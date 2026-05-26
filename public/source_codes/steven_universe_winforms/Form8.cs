using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace MainFrame
{
    public partial class Form8 : Form
    {
        public Form8()
        {
            InitializeComponent();
        }

        private void button1_Click(object sender, EventArgs e)
        {
            string initialTemp = textBox1.Text;
            double celciusTempt = Convert.ToDouble(initialTemp);

            if (celciusTempt >= 0 && celciusTempt <=10)
            {
                Form9 cold = new Form9();
                cold.ShowDialog();
                cold = null;
                this.Show();


            }
            else if (celciusTempt >= 11 && celciusTempt <= 30) 
            {
                Form10 warm = new Form10();
                warm.ShowDialog();
                warm = null;
                this.Show();
            }
            else if (celciusTempt >= 31)
            {
                Form11 hot = new Form11();
                hot.ShowDialog();
                hot = null;
                this.Show();
            }

            textBox1.Text = "";
        }
    }
}
