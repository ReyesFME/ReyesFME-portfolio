import tkinter as tk
from tkinter import ttk, messagebox
from PIL import Image, ImageTk, ImageOps
import mysql.connector
import matplotlib.pyplot as plt
import csv
import os
import hashlib
import binascii
import hmac

# -----------------------------
# DB Configuration
# -----------------------------
DB_HOST = "localhost"
DB_USER = "root"
DB_PASSWORD = ""
DB_NAME = "InventoryDB"
LOW_STOCK_THRESHOLD = 5

# Password hashing parameters
PBKDF2_ITERATIONS = 100_000
SALT_BYTES = 16  # 128-bit salt


def generate_salt():
    return binascii.hexlify(os.urandom(SALT_BYTES)).decode()


def hash_password(password: str, salt_hex: str) -> str:
    """Return hex-encoded PBKDF2-HMAC-SHA256 hash of password using provided hex salt."""
    salt = binascii.unhexlify(salt_hex)
    dk = hashlib.pbkdf2_hmac("sha256", password.encode("utf-8"), salt, PBKDF2_ITERATIONS)
    return binascii.hexlify(dk).decode()


def verify_password(password: str, salt_hex: str, expected_hash_hex: str) -> bool:
    candidate = hash_password(password, salt_hex)
    # use compare_digest for timing-attack-resistant comparison
    return hmac.compare_digest(candidate, expected_hash_hex)


# -----------------------------
# Database Manager
# -----------------------------
class DatabaseManager:
    def __init__(self, host, user, password, database):
        # connect without specifying database first so we can create it if needed
        self.connection = mysql.connector.connect(host=host, user=user, password=password)
        # Use a buffered cursor to avoid "Unread result found" errors
        self.cursor = self.connection.cursor(buffered=True)
        self.cursor.execute(f"CREATE DATABASE IF NOT EXISTS `{database}`")
        self.connection.database = database

        # create products table (unchanged)
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS products (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                category VARCHAR(255) NOT NULL,
                sku VARCHAR(50) NOT NULL,
                quantity INT NOT NULL,
                price DECIMAL(10,2) NOT NULL
            )
        """)

        # create employees table with hashed password columns
        self.cursor.execute("""
            CREATE TABLE IF NOT EXISTS employees (
                id INT AUTO_INCREMENT PRIMARY KEY,
                username VARCHAR(100) UNIQUE NOT NULL,
                password_hash VARCHAR(512),
                salt VARCHAR(64),
                full_name VARCHAR(255) NOT NULL
            )
        """)
        self.connection.commit()

        # Run migration if an older plaintext 'password' column exists (handle gracefully)
        self._migrate_plaintext_password_column_if_present()

        # ensure at least one default employee exists (admin)
        self._ensure_default_employee()

    def _migrate_plaintext_password_column_if_present(self):
        """If an old 'password' column exists (legacy), migrate non-null plaintext values to hashed storage."""
        # Check columns
        self.cursor.execute("SHOW COLUMNS FROM employees")
        cols = [r[0] for r in self.cursor.fetchall()]
        if "password" in cols:
            # Add new columns if somehow missing
            if "password_hash" not in cols:
                self.cursor.execute("ALTER TABLE employees ADD COLUMN password_hash VARCHAR(512)")
            if "salt" not in cols:
                self.cursor.execute("ALTER TABLE employees ADD COLUMN salt VARCHAR(64)")
            self.connection.commit()

            # Migrate any rows where password_hash is NULL but password is not NULL
            self.cursor.execute("SELECT id, password FROM employees WHERE password IS NOT NULL AND (password_hash IS NULL OR password_hash='')")
            rows = self.cursor.fetchall()
            for r in rows:
                emp_id, plaintext = r
                if not plaintext:
                    continue
                salt = generate_salt()
                phash = hash_password(plaintext, salt)
                try:
                    self.cursor.execute("UPDATE employees SET password_hash=%s, salt=%s WHERE id=%s", (phash, salt, emp_id))
                except Exception:
                    # ignore per-row errors and continue
                    pass
            # After migration, drop the legacy plaintext column to avoid accidental use
            try:
                self.cursor.execute("ALTER TABLE employees DROP COLUMN password")
            except Exception:
                # If cannot drop, silently continue (don't break initialization)
                pass
            self.connection.commit()

    def _ensure_default_employee(self):
        self.cursor.execute("SELECT COUNT(*) FROM employees")
        count = self.cursor.fetchone()[0]
        if count == 0:
            # create default admin with secure hashed password
            self.add_employee("admin", "admin123", "Administrator")

    # -----------------------------
    # Employee Methods (secure)
    # -----------------------------
    def add_employee(self, username, password, full_name):
        if not full_name.strip():
            raise ValueError("Full name is required")
        if not username.strip():
            raise ValueError("Username is required")
        if not password:
            raise ValueError("Password is required")

        salt = generate_salt()
        password_hash = hash_password(password, salt)

        sql = "INSERT INTO employees (username, password_hash, salt, full_name) VALUES (%s, %s, %s, %s)"
        self.cursor.execute(sql, (username, password_hash, salt, full_name))
        self.connection.commit()

    def authenticate_employee(self, username, password):
        """Return (id, username, full_name) on success, None on failure."""
        sql = "SELECT id, username, full_name, password_hash, salt FROM employees WHERE username = %s"
        self.cursor.execute(sql, (username,))
        row = self.cursor.fetchone()
        if not row:
            return None
        emp_id, uname, full_name, password_hash, salt = row
        if not password_hash or not salt:
            # No secure credentials present for this user
            return None
        if verify_password(password, salt, password_hash):
            return (emp_id, uname, full_name)
        return None

    def get_all_employees(self):
        """Return list of (id, username, full_name) without exposing password data."""
        self.cursor.execute("SELECT id, username, full_name FROM employees ORDER BY full_name")
        return self.cursor.fetchall()

    def delete_employee(self, emp_id):
        sql = "DELETE FROM employees WHERE id = %s"
        self.cursor.execute(sql, (emp_id,))
        self.connection.commit()

    # -----------------------------
    # Product CRUD operations
    # -----------------------------
    def save_product(self, product):
        sql = """INSERT INTO products (name, category, sku, quantity, price)
                 VALUES (%s, %s, %s, %s, %s)"""
        values = (product['name'], product['category'], product['sku'], product['quantity'], product['price'])
        self.cursor.execute(sql, values)
        self.connection.commit()
        return self.cursor.lastrowid

    def load_products(self, category_filter=None, search=None):
        sql = "SELECT id, name, category, sku, quantity, price FROM products"
        params = []
        clauses = []
        if category_filter and category_filter.lower() != "all":
            clauses.append("category = %s")
            params.append(category_filter)
        if search:
            clauses.append("(name LIKE %s OR sku LIKE %s)")
            like = f"%{search}%"
            params.extend([like, like])
        if clauses:
            sql += " WHERE " + " AND ".join(clauses)
        sql += " ORDER BY name"
        self.cursor.execute(sql, params)
        return self.cursor.fetchall()

    def update_product(self, product_id, product):
        sql = """UPDATE products SET name=%s, category=%s, sku=%s, quantity=%s, price=%s WHERE id=%s"""
        values = (product['name'], product['category'], product['sku'], product['quantity'], product['price'], product_id)
        self.cursor.execute(sql, values)
        self.connection.commit()

    def delete_product(self, product_id):
        sql = "DELETE FROM products WHERE id = %s"
        self.cursor.execute(sql, (product_id,))
        self.connection.commit()

    def get_categories(self):
        self.cursor.execute("SELECT DISTINCT category FROM products ORDER BY category")
        rows = self.cursor.fetchall()
        return [r[0] for r in rows]

    def close(self):
        try:
            self.cursor.close()
        except Exception:
            pass
        try:
            self.connection.close()
        except Exception:
            pass


# -----------------------------
# GUI / App
# -----------------------------
class InventoryApp:
    def __init__(self, root, db: DatabaseManager):
        self.root = root
        self.db = db
        self.root.title("Omoretsam Inventory Management System")
        self.root.geometry("1000x650")
        self.current_employee = None

        # background attributes
        self.original_bg_image = None
        self.bg_label = None
        self.bg_photo = None

        # -----------------------------
        # Global styling (theme + fonts + paddings)
        # -----------------------------
        style = ttk.Style()
        try:
            style.theme_use("clam")
        except Exception:
            pass  # fallback if theme not available

        style.configure("TLabel", font=("Segoe UI", 11))
        style.configure("TButton", font=("Segoe UI", 10), padding=6)
        style.configure("TEntry", padding=4)
        style.configure("TLabelframe", padding=8)
        style.configure("TLabelframe.Label", font=("Segoe UI", 11, "bold"))
        style.configure("Treeview", rowheight=28, font=("Segoe UI", 10))
        style.configure("Treeview.Heading", font=("Segoe UI", 11, "bold"))
        style.map("TButton",
                  foreground=[("disabled", "#888")],
                  background=[("active", "#e6e6e6")])

        self._build_welcome_screen()

    # helper to load an image or return a blank image if missing
    def _load_bg_safe(self, filename, fallback_size=(800, 600)):
        try:
            if filename and os.path.exists(filename):
                img = Image.open(filename)
                # ensure it's RGB
                if img.mode != "RGB":
                    img = img.convert("RGB")
                return img
        except Exception:
            pass
        # fallback plain white image
        return Image.new("RGB", fallback_size, "white")

    # ---------- Welcome Screen ----------
    def _build_welcome_screen(self):
        self._clear_root()

        # Load original image safely
        self.original_bg_image = self._load_bg_safe("windows_xp_bg.jpg", fallback_size=(1000, 650))

        # Create label for background
        self.bg_label = tk.Label(self.root)
        self.bg_label.place(x=0, y=0, relwidth=1, relheight=1)

        # Resize function for window resizing
        def resize_bg(event):
            try:
                new_width = max(1, event.width)
                new_height = max(1, event.height)
                resized = self.original_bg_image.resize((new_width, new_height), Image.Resampling.LANCZOS)
                self.bg_photo = ImageTk.PhotoImage(resized)
                # only configure if widget still exists
                if self.bg_label.winfo_exists():
                    self.bg_label.config(image=self.bg_photo)
            except Exception:
                # ignore transient errors
                pass

        # Bind resize
        self.root.bind("<Configure>", resize_bg)

        # Foreground widgets
        frame = ttk.Frame(self.root, padding=20)
        frame.place(relx=0.5, rely=0.5, anchor="center")

        title = ttk.Label(frame, text="Welcome to the Omoretsam Inventory Management System",
                          font=("Segoe UI", 20, "bold"))
        title.pack(pady=(20, 10))

        subtitle = ttk.Label(frame, text="Manage products, track stock levels, and visualize inventory",
                             font=("Segoe UI", 12), foreground="#555")
        subtitle.pack(pady=(0, 20))

        btn_frame = ttk.Frame(frame)
        btn_frame.pack(pady=10)

        continue_btn = ttk.Button(btn_frame, text="Manage Stocks (Employee)", command=self._build_login_screen)
        continue_btn.grid(row=0, column=0, padx=10)

        view_btn = ttk.Button(btn_frame, text="View Stocks (Guest)", command=lambda: self._build_dashboard(guest=True))
        view_btn.grid(row=0, column=1, padx=10)

    # ---------- Login Screen ----------
    def _build_login_screen(self):
        self._clear_root()
        self.original_bg_image = self._load_bg_safe("wp_2_bg.jpg", fallback_size=(1000, 650))

        # Create label for background
        self.bg_label = tk.Label(self.root)
        self.bg_label.place(x=0, y=0, relwidth=1, relheight=1)

        # Resize function for window resizing
        def resize_bg(event):
            try:
                new_width = max(1, event.width)
                new_height = max(1, event.height)
                resized = self.original_bg_image.resize((new_width, new_height), Image.Resampling.LANCZOS)
                self.bg_photo = ImageTk.PhotoImage(resized)
                if self.bg_label.winfo_exists():
                    self.bg_label.config(image=self.bg_photo)
            except Exception:
                pass

        self.root.bind("<Configure>", resize_bg)

        # Header banner
        top_frame = tk.Frame(self.root, bg="#2c3e50", height=52)
        top_frame.pack(fill="x")
        header = tk.Label(top_frame, text="Employee Login", font=("Segoe UI", 16, "bold"), fg="white", bg="#2c3e50")
        header.pack(side="left", padx=16, pady=10)

        frame = ttk.Frame(self.root, padding=20)
        frame.pack(expand=True)

        ttk.Label(frame, text="Username:").grid(row=0, column=0, sticky="e", pady=5, padx=(0, 6))
        ttk.Label(frame, text="Password:").grid(row=1, column=0, sticky="e", pady=5, padx=(0, 6))
        username_entry = ttk.Entry(frame, width=28)
        password_entry = ttk.Entry(frame, show="*", width=28)

        username_entry.grid(row=0, column=1, sticky="w", pady=5)
        password_entry.grid(row=1, column=1, sticky="w", pady=5)

        def attempt_login():
            username = username_entry.get().strip()
            password = password_entry.get().strip()
            if not username or not password:
                messagebox.showwarning("Login", "Enter username and password.")
                return
            try:
                auth = self.db.authenticate_employee(username, password)
            except Exception as e:
                messagebox.showerror("DB Error", f"Failed to authenticate: {e}")
                return

            if auth:
                self.current_employee = {"id": auth[0], "username": auth[1], "full_name": auth[2]}
                self._build_dashboard(guest=False)
            else:
                messagebox.showerror("Login Failed", "Invalid credentials.")

        btn_frame = ttk.Frame(frame)
        btn_frame.grid(row=2, column=0, columnspan=2, pady=12)

        ttk.Button(btn_frame, text="Login", command=attempt_login).grid(row=0, column=0, padx=6)
        ttk.Button(btn_frame, text="Register", command=self.open_employee_register).grid(row=0, column=1, padx=6)
        ttk.Button(btn_frame, text="Back", command=self._build_welcome_screen).grid(row=0, column=2, padx=6)

    # ---------- Dashboard ----------
    def _build_dashboard(self, guest=False):
        self._clear_root()

        # Header banner
        top_frame = tk.Frame(self.root, bg="#2c3e50", height=52)
        top_frame.pack(fill="x")

        header = tk.Label(top_frame, text="Inventory Dashboard", font=("Segoe UI", 16, "bold"), fg="white", bg="#2c3e50")
        header.pack(side="left", padx=16, pady=10)

        if guest:
            info = tk.Label(top_frame, text="Viewing as Guest", foreground="lightgray", bg="#2c3e50", font=("Segoe UI", 10))
            info.pack(side="left", padx=(8, 0))
            back_btn = ttk.Button(top_frame, text="Back", command=self._build_welcome_screen)
            back_btn.pack(side="right", padx=10, pady=8)
        else:
            full_name = self.current_employee.get("full_name") if self.current_employee else "Employee"
            info = tk.Label(top_frame, text=f"Signed in as: {full_name}", foreground="lightblue", bg="#2c3e50", font=("Segoe UI", 10))
            info.pack(side="right", padx=16)
            ttk.Button(top_frame, text="Employees", command=self.open_employee_register).pack(side="right", padx=10, pady=8)
            ttk.Button(top_frame, text="Logout", command=self._logout).pack(side="right", padx=10, pady=8)

        # Controls: filter, search, chart, export
        controls = ttk.Frame(self.root, padding=(12, 8))
        controls.pack(fill="x")

        ttk.Label(controls, text="Category:").grid(row=0, column=0, sticky="w")
        self.category_var = tk.StringVar(value="All")
        try:
            categories = ["All"] + self.db.get_categories()
        except Exception:
            categories = ["All"]
        self.category_cb = ttk.Combobox(controls, textvariable=self.category_var, values=categories, state="readonly", width=18)
        self.category_cb.grid(row=0, column=1, padx=5)
        self.category_cb.bind("<<ComboboxSelected>>", lambda e: self.load_table())

        ttk.Label(controls, text="Search:").grid(row=0, column=2, sticky="e", padx=(12, 0))
        self.search_var = tk.StringVar()
        search_entry = ttk.Entry(controls, textvariable=self.search_var, width=24)
        search_entry.grid(row=0, column=3, padx=5)
        search_entry.bind("<Return>", lambda e: self.load_table())

        ttk.Button(controls, text="Search", command=self.load_table).grid(row=0, column=4, padx=5)
        ttk.Button(controls, text="Reset", command=self._reset_filters).grid(row=0, column=5, padx=5)
        ttk.Button(controls, text="📊 Show Chart", command=self.show_chart).grid(row=0, column=6, padx=5)
        ttk.Button(controls, text="Export CSV", command=self.export_csv).grid(row=0, column=7, padx=5)

        # Middle frame: table and form
        middle = ttk.Frame(self.root, padding=10)
        middle.pack(fill="both", expand=True)

        # Table
        table_frame = ttk.LabelFrame(middle, text="Products")
        table_frame.pack(side="left", fill="both", expand=True, padx=(0, 10))

        columns = ("id", "name", "category", "sku", "quantity", "price")
        self.tree = ttk.Treeview(table_frame, columns=columns, show="headings", selectmode="browse")
        for col in columns:
            self.tree.heading(col, text=col.capitalize())
            self.tree.column(col, width=110, anchor="center")
        self.tree.column("name", width=240, anchor="w")
        self.tree.column("category", width=140)

        # Scrollbars for Treeview
        vsb = ttk.Scrollbar(table_frame, orient="vertical", command=self.tree.yview)
        hsb = ttk.Scrollbar(table_frame, orient="horizontal", command=self.tree.xview)
        self.tree.configure(yscroll=vsb.set, xscroll=hsb.set)
        self.tree.pack(side="left", fill="both", expand=True, padx=5, pady=5)
        vsb.pack(side="right", fill="y")
        hsb.pack(side="bottom", fill="x")

        # Row tags
        self.tree.tag_configure('low_stock', background="#ffe6e6")
        self.tree.tag_configure("oddrow", background="#f9f9f9")
        self.tree.tag_configure("evenrow", background="#ffffff")

        self.tree.bind("<<TreeviewSelect>>", self._on_row_select)

        # Form for CRUD (only enabled if not guest)
        form_frame = ttk.LabelFrame(middle, text="Product Management" + ("" if not guest else " (Login to edit)"))
        form_frame.pack(side="right", fill="y", padx=(10, 0))

        ttk.Label(form_frame, text="Name:").grid(row=0, column=0, sticky="e", pady=4, padx=(0, 6))
        ttk.Label(form_frame, text="Category:").grid(row=1, column=0, sticky="e", pady=4, padx=(0, 6))
        ttk.Label(form_frame, text="SKU:").grid(row=2, column=0, sticky="e", pady=4, padx=(0, 6))
        ttk.Label(form_frame, text="Quantity:").grid(row=3, column=0, sticky="e", pady=4, padx=(0, 6))
        ttk.Label(form_frame, text="Price:").grid(row=4, column=0, sticky="e", pady=4, padx=(0, 6))

        self.name_entry = ttk.Entry(form_frame, width=30)
        self.category_entry = ttk.Entry(form_frame, width=30)
        self.sku_entry = ttk.Entry(form_frame, width=30)
        self.quantity_entry = ttk.Entry(form_frame, width=30)
        self.price_entry = ttk.Entry(form_frame, width=30)

        self.name_entry.grid(row=0, column=1, padx=6, pady=2)
        self.category_entry.grid(row=1, column=1, padx=6, pady=2)
        self.sku_entry.grid(row=2, column=1, padx=6, pady=2)
        self.quantity_entry.grid(row=3, column=1, padx=6, pady=2)
        self.price_entry.grid(row=4, column=1, padx=6, pady=2)

        self.selected_product_id = None

        add_btn = ttk.Button(form_frame, text="Add Product", command=self.add_product)
        update_btn = ttk.Button(form_frame, text="Update Selected", command=self.update_product)
        delete_btn = ttk.Button(form_frame, text="Delete Selected", command=self.delete_product)
        clear_btn = ttk.Button(form_frame, text="Clear Form", command=self.clear_form)

        add_btn.grid(row=5, column=0, columnspan=2, sticky="ew", pady=(10, 4))
        update_btn.grid(row=6, column=0, columnspan=2, sticky="ew", pady=4)
        delete_btn.grid(row=7, column=0, columnspan=2, sticky="ew", pady=4)
        clear_btn.grid(row=8, column=0, columnspan=2, sticky="ew", pady=(4, 10))

        # Disable CRUD buttons if guest
        if guest:
            add_btn.state(["disabled"])
            update_btn.state(["disabled"])
            delete_btn.state(["disabled"])
            self.name_entry.state(["disabled"])
            self.category_entry.state(["disabled"])
            self.sku_entry.state(["disabled"])
            self.quantity_entry.state(["disabled"])
            self.price_entry.state(["disabled"])

        # initial load
        self.load_table()

    def _on_row_select(self, event):
        selection = self.tree.selection()
        if not selection:
            return
        item = self.tree.item(selection[0])
        vals = item['values']
        # id, name, category, sku, quantity, price
        self.selected_product_id = vals[0]
        self.name_entry.delete(0, tk.END); self.name_entry.insert(0, vals[1])
        self.category_entry.delete(0, tk.END); self.category_entry.insert(0, vals[2])
        self.sku_entry.delete(0, tk.END); self.sku_entry.insert(0, vals[3])
        self.quantity_entry.delete(0, tk.END); self.quantity_entry.insert(0, vals[4])
        self.price_entry.delete(0, tk.END); self.price_entry.insert(0, vals[5])

    def add_product(self):
        try:
            product = self._read_form()
            if not product:
                return
            self.db.save_product(product)
            messagebox.showinfo("Success", f"Product '{product['name']}' added.")
            self.clear_form()
            self._refresh_categories()
            self.load_table()
        except Exception as e:
            messagebox.showerror("Error", f"Failed to add product: {e}")

    def update_product(self):
        if not self.selected_product_id:
            messagebox.showwarning("Update", "Select a product to update.")
            return
        try:
            product = self._read_form()
            if not product:
                return
            self.db.update_product(self.selected_product_id, product)
            messagebox.showinfo("Success", "Product updated.")
            self.clear_form()
            self._refresh_categories()
            self.load_table()
        except Exception as e:
            messagebox.showerror("Error", f"Failed to update product: {e}")

    def delete_product(self):
        if not self.selected_product_id:
            messagebox.showwarning("Delete", "Select a product to delete.")
            return
        if not messagebox.askyesno("Confirm Delete", "Are you sure you want to delete the selected product?"):
            return
        try:
            self.db.delete_product(self.selected_product_id)
            messagebox.showinfo("Deleted", "Product deleted.")
            self.clear_form()
            self._refresh_categories()
            self.load_table()
        except Exception as e:
            messagebox.showerror("Error", f"Failed to delete product: {e}")

    def _read_form(self):
        name = self.name_entry.get().strip()
        category = self.category_entry.get().strip()
        sku = self.sku_entry.get().strip()
        try:
            quantity = int(self.quantity_entry.get().strip())
        except:
            messagebox.showwarning("Input Error", "Quantity must be an integer.")
            return None
        try:
            price = float(self.price_entry.get().strip())
        except:
            messagebox.showwarning("Input Error", "Price must be a number.")
            return None
        if not (name and category and sku):
            messagebox.showwarning("Input Error", "Name, Category and SKU are required.")
            return None
        return {"name": name, "category": category, "sku": sku, "quantity": quantity, "price": price}

    def load_table(self):
        # clear existing rows
        for r in self.tree.get_children():
            self.tree.delete(r)
        category = self.category_var.get() if hasattr(self, 'category_var') else None
        search = self.search_var.get() if hasattr(self, 'search_var') else None
        try:
            rows = self.db.load_products(category_filter=category if category else None, search=search if search else None)
        except Exception:
            rows = []
        for i, row in enumerate(rows):
            rid, name, category, sku, qty, price = row
            tags = ("evenrow",) if i % 2 == 0 else ("oddrow",)
            if qty <= LOW_STOCK_THRESHOLD:
                tags = tags + ("low_stock",)
            self.tree.insert("", "end", values=(rid, name, category, sku, qty, float(price)), tags=tags)

    def clear_form(self):
        self.selected_product_id = None
        for entry in [self.name_entry, self.category_entry, self.sku_entry, self.quantity_entry, self.price_entry]:
            entry.delete(0, tk.END)

    def _reset_filters(self):
        if hasattr(self, 'category_var'):
            self.category_var.set("All")
        if hasattr(self, 'search_var'):
            self.search_var.set("")
        self.load_table()

    def _refresh_categories(self):
        if hasattr(self, 'category_cb'):
            try:
                categories = ["All"] + self.db.get_categories()
            except Exception:
                categories = ["All"]
            self.category_cb['values'] = categories

    def show_chart(self):
        try:
            rows = self.db.load_products()
        except Exception:
            rows = []
        if not rows:
            messagebox.showinfo("Info", "No products to display.")
            return
        names = [r[1] for r in rows]
        quantities = [r[4] for r in rows]
        plt.figure(figsize=(10, 6))
        plt.bar(names, quantities)
        plt.title("Inventory Stock Levels")
        plt.xlabel("Product")
        plt.ylabel("Quantity")
        plt.xticks(rotation=45, ha="right")
        plt.tight_layout()
        plt.show()

    def export_csv(self):
        try:
            rows = self.db.load_products()
        except Exception:
            rows = []
        if not rows:
            messagebox.showinfo("Info", "No products to export.")
            return
        filename = "inventory_export.csv"
        try:
            with open(filename, "w", newline="", encoding="utf-8") as f:
                writer = csv.writer(f)
                writer.writerow(["id", "name", "category", "sku", "quantity", "price"])
                for r in rows:
                    writer.writerow(r)
            messagebox.showinfo("Exported", f"Data exported to {filename}")
        except Exception as e:
            messagebox.showerror("Error", f"Failed to export: {e}")

    def _logout(self):
        self.current_employee = None
        self._build_welcome_screen()

    def _clear_root(self):
        # Unbind configure events so resize callbacks do not try to update destroyed widgets
        try:
            self.root.unbind("<Configure>")
        except Exception:
            pass

        # destroy children widgets
        for w in self.root.winfo_children():
            try:
                w.destroy()
            except Exception:
                pass

        # reset bg references
        self.bg_label = None
        self.bg_photo = None
        self.original_bg_image = None

    def open_employee_register(self):
        win = tk.Toplevel(self.root)
        win.title("Employee Register")
        # Auto-size (no fixed geometry) so buttons are visible without scrollbar
        win.resizable(False, False)

        frame = ttk.Frame(win, padding=10)
        frame.pack(fill="both", expand=True)

        ttk.Label(frame, text="Employee Registration", font=("Segoe UI", 14, "bold")).pack(pady=10)

        # --------------------
        # Form
        # --------------------
        form = ttk.LabelFrame(frame, text="Register Employee", padding=10)
        form.pack(fill="x", pady=10)

        ttk.Label(form, text="Full Name").grid(row=0, column=0, sticky="e", pady=4, padx=(0, 6))
        ttk.Label(form, text="Username").grid(row=1, column=0, sticky="e", pady=4, padx=(0, 6))
        ttk.Label(form, text="Password").grid(row=2, column=0, sticky="e", pady=4, padx=(0, 6))

        fullname_entry = ttk.Entry(form, width=36)
        username_entry = ttk.Entry(form, width=36)
        password_entry = ttk.Entry(form, width=36, show="*")

        fullname_entry.grid(row=0, column=1, pady=4, padx=6, sticky="w")
        username_entry.grid(row=1, column=1, pady=4, padx=6, sticky="w")
        password_entry.grid(row=2, column=1, pady=4, padx=6, sticky="w")

        # --------------------
        # Employee List
        # --------------------
        list_frame = ttk.LabelFrame(frame, text="Employee List", padding=10)
        list_frame.pack(fill="both", expand=True, pady=(8, 0))

        emp_table = ttk.Treeview(list_frame, columns=("id", "username", "name"), show="headings")
        emp_table.heading("id", text="ID")
        emp_table.heading("username", text="Username")
        emp_table.heading("name", text="Full Name")
        emp_table.column("id", width=50, anchor="center")
        emp_table.column("username", width=160, anchor="w")
        emp_table.column("name", width=260, anchor="w")
        emp_table.pack(fill="both", expand=True)

        # --------------------
        # FUNCTIONS
        # --------------------
        def refresh_list():
            emp_table.delete(*emp_table.get_children())
            try:
                rows = self.db.get_all_employees()
            except Exception:
                rows = []
            for row in rows:
                emp_table.insert("", "end", values=row)

        def confirm_register():
            name = fullname_entry.get().strip()
            username = username_entry.get().strip()
            password = password_entry.get().strip()

            if not name or not username or not password:
                messagebox.showwarning("Input Error", "All fields are required.")
                return

            try:
                self.db.add_employee(username, password, name)
                messagebox.showinfo("Success", "Employee registered successfully.")
                fullname_entry.delete(0, tk.END)
                username_entry.delete(0, tk.END)
                password_entry.delete(0, tk.END)
                refresh_list()
            except mysql.connector.IntegrityError:
                messagebox.showerror("Error", "Username already exists!")
            except Exception as e:
                messagebox.showerror("Error", f"Failed: {e}")

        def delete_employee():
            selected = emp_table.selection()
            if not selected:
                messagebox.showwarning("Delete", "Select an employee.")
                return

            emp_id = emp_table.item(selected[0])["values"][0]
            if messagebox.askyesno("Confirm", "Delete this employee?"):
                try:
                    self.db.delete_employee(emp_id)
                except Exception as e:
                    messagebox.showerror("Error", f"Failed to delete: {e}")
                refresh_list()

        # --------------------
        # Buttons (visible and neat)
        # --------------------
        btn_frame = ttk.Frame(frame)
        btn_frame.pack(fill="x", pady=8)

        ttk.Button(btn_frame, text="Create Employee", command=confirm_register).pack(side="left", padx=8, pady=5)
        ttk.Button(btn_frame, text="Delete Selected", command=delete_employee).pack(side="left", padx=8, pady=5)
        ttk.Button(btn_frame, text="Refresh List", command=refresh_list).pack(side="left", padx=8, pady=5)
        ttk.Button(btn_frame, text="Close", command=win.destroy).pack(side="right", padx=8, pady=5)

        # Initial population
        refresh_list()

        # Center the popup after layout
        win.update_idletasks()
        w = max(520, win.winfo_width())
        h = win.winfo_height()
        x = (win.winfo_screenwidth() // 2) - (w // 2)
        y = (win.winfo_screenheight() // 2) - (h // 2)
        win.geometry(f"{w}x{h}+{x}+{y}")


# -----------------------------
# Program Entry
# -----------------------------
if __name__ == "__main__":
    root = tk.Tk()
    try:
        db = DatabaseManager(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME)
    except Exception as e:
        messagebox.showerror("DB Error", f"Failed to connect to database: {e}")
        raise

    app = InventoryApp(root, db)

    def on_close():
        try:
            db.close()
        except:
            pass
        root.destroy()

    root.protocol("WM_DELETE_WINDOW", on_close)
    root.mainloop()
