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
    public partial class Form6 : Form

    {

        double value = 0;
        String operation = "";
        bool sel_operation = false;
        public Form6()
        {
            InitializeComponent();
        }

        private void button_Click(object sender, EventArgs e)
        {
            //allows the text box to start at the number that was first pressed insead of 0
            //if the user pressed the operations, the text box would be cleared again to cater to the second set of numbers
            if (result.Text == "0" || (sel_operation))
            {
                result.Clear();
            }
            //'result' is the name of the text box.
            //enables the other buttons to return their corresponding values to the text box
            Button buttonNum = (Button)sender;
            result.Text = result.Text + buttonNum.Text;
        }

        //makes the CE button to clear the text box
        private void button18_Click(object sender, EventArgs e)
        {
            result.Text = "0";
        }

        private void operation_Click(object sender, EventArgs e)
        {
            //for handling the math operations

            Button buttonNum = (Button)sender;
            operation = buttonNum.Text;
            value = Double.Parse(result.Text);
            sel_operation = true;
        }

        //allows the equal button to return the results by using switch cases to determine which operation to use
        private void button12_Click(object sender, EventArgs e)
        {
            switch (operation)
            {
                case "+":
                    result.Text = (value + Double.Parse(result.Text)).ToString();
                    break;

                case "-":
                    result.Text = (value - Double.Parse(result.Text)).ToString();
                    break;

                case "*":
                    result.Text = (value * Double.Parse(result.Text)).ToString();
                    break;

                case "/":

                    double input = Double.Parse(result.Text);
                    if (value == 0)
                    {
                        MessageBox.Show("Cannot divide by zero!", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        result.Text = "0";
                        return; // Exit the method to prevent further processing


                    }

                    else if (input == 0)
                    {
                        MessageBox.Show("Cannot divide by zero!", "Error", MessageBoxButtons.OK, MessageBoxIcon.Error);
                        return; // Exit the method to prevent further processing
                        result.Text = "0";
                    }

                    result.Text = (value / Double.Parse(result.Text)).ToString();

                    
                    break;
            }//end switch
            sel_operation = false;
        }

        //C button
        private void button17_Click(object sender, EventArgs e)
        {
            result.Text = "0";
        }

        private void result_TextChanged(object sender, EventArgs e)
        {

        }
    }
}