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
    public partial class Form15 : Form
    {
        public Form15()
        {
            InitializeComponent();
        }

        private void toolStripDropDownButton1_Click(object sender, EventArgs e)
        {

        }

        private void Form15_Load(object sender, EventArgs e)
        {

        }

        private void toolStrip1_ItemClicked_1(object sender, ToolStripItemClickedEventArgs e)
        {

        }

        private void calculateTheAreaOfARectangleToolStripMenuItem_Click(object sender, EventArgs e)
        {

            Form5 areaRec = new Form5();
            areaRec.ShowDialog();
            areaRec = null;
            this.Show();

        }

        private void temperatureConverterToolStripMenuItem_Click(object sender, EventArgs e)
        {

            Form2 tempConverter = new Form2();
            tempConverter.ShowDialog();
            tempConverter = null;
            this.Show();
        }

        private void calculateMyAgeToolStripMenuItem_Click(object sender, EventArgs e)
        {

            Form3 ageCalculator = new Form3();
            ageCalculator.ShowDialog();
            ageCalculator = null;
            this.Show();
        }

        private void verifyACharacterToolStripMenuItem_Click(object sender, EventArgs e)
        {

            Form4 charVerifier = new Form4();
            charVerifier.ShowDialog();
            charVerifier = null;
            this.Show();
        }

        private void mySimpleCalculatorToolStripMenuItem_Click(object sender, EventArgs e)
        {

            Form6 simpleCalcu = new Form6();
            simpleCalcu.ShowDialog();
            simpleCalcu = null;
            this.Show();

        }

        private void exitToolStripMenuItem_Click(object sender, EventArgs e)
        {
            this.Close();
        }

        private void daysOfTheWeekToolStripMenuItem_Click(object sender, EventArgs e)
        {

            Form7 daysOfTheWeek = new Form7();
            daysOfTheWeek.ShowDialog();
            daysOfTheWeek = null;
            this.Show();
        }

        private void enterATemperatureToolStripMenuItem_Click(object sender, EventArgs e)
        {

            Form8 enterATemp = new Form8();
            enterATemp.ShowDialog();
            enterATemp = null;
            this.Show();
        }

        private void studentGWAToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Form12 studentGWA = new Form12();
            studentGWA.ShowDialog();
            studentGWA = null;
            this.Show();
        }

        private void registrationFormToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Form13 RegistrationForm = new Form13();
            RegistrationForm.ShowDialog();
            RegistrationForm = null;
            this.Show();
        }

        private void myResumeToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Form14 Resume = new Form14();
            Resume.ShowDialog();
            Resume = null;
            this.Show();
        }

        private void minorOrAdultToolStripMenuItem_Click(object sender, EventArgs e)
        {
            Form16 MinorAdult = new Form16();
            MinorAdult.ShowDialog();
            MinorAdult = null;
            this.Show();
        }
    }
}
