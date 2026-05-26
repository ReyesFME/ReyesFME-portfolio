import { useState, useMemo } from "react";
import windowsXpBg from "./wp_2_bg.jpg";
import wp2Bg from "./wp_2_bg.jpg";
import "../../../styles/tkinter-theme.css";

// --- SEED DATA (from inventorydb.sql) ---
const SEED_PRODUCTS = [
  { id: 1, name: "Pencil",     category: "Office Supplies", sku: "12345-AKBFWIUV",  quantity: 25, price: 12.00  },
  { id: 2, name: "Pen",        category: "Office Supplies", sku: "9574602-NVHNI",   quantity: 36, price: 15.00  },
  { id: 3, name: "Wallet",     category: "Clothing",        sku: "84907-NJSICS",    quantity: 12, price: 150.00 },
  { id: 4, name: "T-shirt (S)",category: "Clothing",        sku: "1927366-KJOEUE",  quantity: 18, price: 124.00 },
  { id: 5, name: "T-shirt (M)",category: "Clothing",        sku: "1927366-KJOEUF",  quantity: 27, price: 124.00 },
  { id: 6, name: "T-shirt (L)",category: "Clothing",        sku: "1927366-KJOEUG",  quantity: 12, price: 124.00 },
];

const LOW_STOCK = 5;
let nextId = 7;

// --- MINI BAR CHART ---
const BarChart = ({ products }) => {
  const max = Math.max(...products.map(p => p.quantity), 1);
  return (
    <div className="tki-chart-container">
      <div className="tki-chart-title">Inventory Stock Levels</div>
      <div className="tki-chart-bars">
        {products.map(p => (
          <div key={p.id} className="tki-chart-col">
            <div className="tki-chart-bar-wrap">
              <div
                className={`tki-chart-bar${p.quantity <= LOW_STOCK ? " tki-chart-bar--low" : ""}`}
                style={{ height: `${Math.max(4, (p.quantity / max) * 140)}px` }}
              />
            </div>
            <span className="tki-chart-label">{p.name}</span>
            <span className="tki-chart-qty">{p.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- MAIN COMPONENT ---
const TkinterInventoryApp = () => {
  const [screen, setScreen] = useState("welcome"); // welcome | dashboard
  const [products, setProducts] = useState(SEED_PRODUCTS);
  const [selectedId, setSelectedId] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [showChart, setShowChart] = useState(false);
  const [toast, setToast] = useState(null);

  const [form, setForm] = useState({ name: "", category: "", sku: "", quantity: "", price: "" });
  const [formError, setFormError] = useState("");

  // --- HELPERS ---
  const showToast = (msg, type = "info") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2200);
  };

  const categories = useMemo(() => {
    const cats = [...new Set(products.map(p => p.category))].sort();
    return ["All", ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchCat = categoryFilter === "All" || p.category === categoryFilter;
      const q = searchInput.trim().toLowerCase();
      const matchSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
      return matchCat && matchSearch;
    });
  }, [products, categoryFilter, searchInput]);

  const selectedProduct = products.find(p => p.id === selectedId) || null;

  // --- FORM ACTIONS ---
  const handleRowClick = (product) => {
    setSelectedId(product.id);
    setForm({
      name: product.name,
      category: product.category,
      sku: product.sku,
      quantity: String(product.quantity),
      price: String(product.price),
    });
    setFormError("");
  };

  const validateForm = () => {
    if (!form.name.trim() || !form.category.trim() || !form.sku.trim()) {
      setFormError("Name, Category and SKU are required.");
      return false;
    }
    if (isNaN(parseInt(form.quantity)) || parseInt(form.quantity) < 0) {
      setFormError("Quantity must be a non-negative integer.");
      return false;
    }
    if (isNaN(parseFloat(form.price)) || parseFloat(form.price) < 0) {
      setFormError("Price must be a valid number.");
      return false;
    }
    setFormError("");
    return true;
  };

  const handleAdd = () => {
    if (!validateForm()) return;
    const newProduct = {
      id: nextId++,
      name: form.name.trim(),
      category: form.category.trim(),
      sku: form.sku.trim(),
      quantity: parseInt(form.quantity),
      price: parseFloat(form.price),
    };
    setProducts(prev => [...prev, newProduct]);
    handleClear();
    showToast(`Product "${newProduct.name}" added.`, "success");
  };

  const handleUpdate = () => {
    if (!selectedId) { showToast("Select a product to update.", "warn"); return; }
    if (!validateForm()) return;
    setProducts(prev => prev.map(p =>
      p.id === selectedId
        ? { ...p, name: form.name.trim(), category: form.category.trim(), sku: form.sku.trim(), quantity: parseInt(form.quantity), price: parseFloat(form.price) }
        : p
    ));
    showToast("Product updated.", "success");
  };

  const handleDelete = () => {
    if (!selectedId) { showToast("Select a product to delete.", "warn"); return; }
    if (!window.confirm("Are you sure you want to delete the selected product?")) return;
    setProducts(prev => prev.filter(p => p.id !== selectedId));
    handleClear();
    showToast("Product deleted.", "info");
  };

  const handleClear = () => {
    setSelectedId(null);
    setForm({ name: "", category: "", sku: "", quantity: "", price: "" });
    setFormError("");
  };

  const handleExportCSV = () => {
    const header = ["id", "name", "category", "sku", "quantity", "price"];
    const rows = filteredProducts.map(p => [p.id, p.name, p.category, p.sku, p.quantity, p.price]);
    const csv = [header, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "inventory_export.csv";
    a.click();
    URL.revokeObjectURL(url);
    showToast("Exported to inventory_export.csv", "success");
  };

  // =========================================
  // SCREEN: WELCOME
  // =========================================
  if (screen === "welcome") {
    return (
      <div className="tki-screen tki-welcome-screen" style={{ backgroundImage: `url(${windowsXpBg})` }}>
        <div className="tki-welcome-card">
          <div className="tki-welcome-title">Omoretsam Inventory Management System</div>
          <div className="tki-welcome-subtitle">
            Manage products, track stock levels, and visualize inventory.
          </div>
          <button className="tki-btn tki-btn--primary" onClick={() => setScreen("dashboard")}>
            Proceed
          </button>
        </div>
      </div>
    );
  }

  // =========================================
  // SCREEN: DASHBOARD
  // =========================================
  return (
    <div className="tki-screen tki-dashboard-screen">

      {/* TOAST */}
      {toast && (
        <div className={`tki-toast tki-toast--${toast.type}`}>{toast.msg}</div>
      )}

      {/* HEADER */}
      <div className="tki-header">
        <span className="tki-header-title">Inventory Dashboard</span>
        <div className="tki-header-actions">
          <button className="tki-btn tki-btn--header" onClick={() => setScreen("welcome")}>X</button>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="tki-controls">
        <label className="tki-controls-label">Category:</label>
        <select
          className="tki-select"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        >
          {categories.map(c => <option key={c}>{c}</option>)}
        </select>

        <label className="tki-controls-label">Search:</label>
        <input
          className="tki-input"
          type="text"
          value={searchInput}
          placeholder="Name or SKU..."
          onChange={e => setSearchInput(e.target.value)}
          onKeyDown={e => e.key === "Escape" && setSearchInput("")}
        />

        <button className="tki-btn" onClick={() => { setCategoryFilter("All"); setSearchInput(""); }}>Reset</button>
        <button className="tki-btn" onClick={() => setShowChart(v => !v)}>
          {showChart ? "Hide Chart" : "📊 Show Chart"}
        </button>
        <button className="tki-btn" onClick={handleExportCSV}>Export CSV</button>
      </div>

      {/* CHART (toggleable) */}
      {showChart && <BarChart products={filteredProducts} />}

      {/* MAIN CONTENT */}
      <div className="tki-main">

        {/* TABLE */}
        <div className="tki-table-frame">
          <div className="tki-labelframe-title">Products</div>
          <div className="tki-table-scroll">
            <table className="tki-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Category</th>
                  <th>SKU</th>
                  <th>Qty</th>
                  <th>Price</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.length === 0 && (
                  <tr><td colSpan={6} className="tki-table-empty">No products found.</td></tr>
                )}
                {filteredProducts.map((p, i) => (
                  <tr
                    key={p.id}
                    className={[
                      i % 2 === 0 ? "tki-row-even" : "tki-row-odd",
                      p.quantity <= LOW_STOCK ? "tki-row-low" : "",
                      selectedId === p.id ? "tki-row-selected" : "",
                    ].join(" ")}
                    onClick={() => handleRowClick(p)}
                  >
                    <td className="tki-td-center">{p.id}</td>
                    <td>{p.name}</td>
                    <td>{p.category}</td>
                    <td>{p.sku}</td>
                    <td className="tki-td-center">{p.quantity}</td>
                    <td className="tki-td-center">₱{p.price.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="tki-table-footer">
            {filteredProducts.length} product(s) listed.
            {filteredProducts.some(p => p.quantity <= LOW_STOCK) && (
              <span className="tki-low-notice"> ⚠ Red rows = low stock (≤{LOW_STOCK})</span>
            )}
          </div>
        </div>

        {/* FORM */}
        <div className="tki-form-frame">
          <div className="tki-labelframe-title">Product Management</div>

          {formError && <div className="tki-form-error">{formError}</div>}

          <div className="tki-form-grid">
            <label className="tki-form-label">Name:</label>
            <input className="tki-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />

            <label className="tki-form-label">Category:</label>
            <input className="tki-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} />

            <label className="tki-form-label">SKU:</label>
            <input className="tki-input" value={form.sku} onChange={e => setForm(f => ({ ...f, sku: e.target.value }))} />

            <label className="tki-form-label">Quantity:</label>
            <input className="tki-input" type="number" min="0" value={form.quantity} onChange={e => setForm(f => ({ ...f, quantity: e.target.value }))} />

            <label className="tki-form-label">Price:</label>
            <input className="tki-input" type="number" min="0" step="0.01" value={form.price} onChange={e => setForm(f => ({ ...f, price: e.target.value }))} />
          </div>

          <div className="tki-form-btns">
            <button className="tki-btn tki-btn--action" onClick={handleAdd}>Add Product</button>
            <button className="tki-btn tki-btn--action" onClick={handleUpdate}>Update Selected</button>
            <button className="tki-btn tki-btn--action tki-btn--danger" onClick={handleDelete}>Delete Selected</button>
            <button className="tki-btn tki-btn--action" onClick={handleClear}>Clear Form</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TkinterInventoryApp;