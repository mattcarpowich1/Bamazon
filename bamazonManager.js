const mysql = require('mysql');
const inquirer = require('inquirer');
require('console.table');

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

// Connect to database
function connectDB(connection) {
  return new Promise((resolve, reject) => {
    connection.connect(err => {
      if (err) reject(err);
      resolve();
    });
  });
} 

// Use console.table to print the products table.
// If lowInventory is true, only print products 
// with stock quantity less than 5
function listProducts(lowInventory) {
  let query = "SELECT * FROM products";
  let caption;
  if (lowInventory) {
    query += " WHERE stock_quantity < 5";
    caption = "Low Inventory";
  } else {
    caption = "Product Inventory";
  }
  connection.query(query, (err, data) => {
    if (err) console.log(err);
    else {
      let products_table = [];
      for (let i = 0; i < data.length; i++) {
        let table_item = {
          id: data[i]["item_id"],
          name: data[i]["product_name"],
          price: data[i]["price"],
          quantity: data[i]["stock_quantity"]
        };
        products_table.push(table_item);
      }
      console.table(caption, products_table);
      connection.end();
    }
  });
}

// Initializes a prompt for a manager to increase
// the supply of a particular product
function addToInventory() {
  let query = "SELECT * FROM products";
  connection.query(query, (err, data) => {
    if (err) console.log(err);
    else {
      let products = [];
      for (let i = 0; i < data.length; i++) {
        products.push(data[i]["product_name"]);
      }
      inquirer.prompt([
        {
          name: "product",
          message: "Select product to restock.",
          type: "list",
          choices: products
        }, {
          name: "amount", 
          message: "Enter quantity.",
          type: "input",
          validate: (answer) => {
            return !(Number.isNaN(parseInt(answer))) &&
                    (parseInt(answer) > 0);
          }
        }, {
          name: "confirm",
          message: (answers) => {
            let str = "Restocking " + answers.product + 
                    " by " + answers.amount +
                    ". \nConfirm?";
            return str;
          },
          type: "confirm"
        }
      ]).then( input => {
        if (!input.confirm) {
          console.log("Cancelled.");
          connection.end();
        } else {
          modifyStock(input.product, parseInt(input.amount));
        }
      });
    }
  });
}

// Increase product stock by a given quantity
function modifyStock(name, quantity) {
  let query = "UPDATE products SET stock_quantity = " + 
              " stock_quantity + " + quantity + 
              " WHERE product_name = '" + name + "'";
  connection.query(query, (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Added " + quantity + " of " + name + "!");
      connection.end();
    }
  })
}

// Prompt for manager wanting to add new product to inventory
function addNewProduct() {
  let query = "SELECT DISTINCT department_name " +
              "FROM products";
  connection.query(query, (err, data) => {
    if (err) console.log(err);
    else {
      let departments = [];
      for (let i = 0; i < data.length; i++) {
        departments.push(data[i]["department_name"]);
      }
      departments.push("Other");
      inquirer.prompt([
        {
          name: "name",
          message: "Enter product name",
          type: "input"
        }, {
          name: "department",
          message: "Select department",
          type: "list",
          choices: departments
        }, {
          name: "price",
          message: "Enter product price",
          type: "input",
          validate: input => {
            return !(Number.isNaN(parseFloat(input)));
          }
        }, {
          name: "quantity",
          message: "Enter stock quantity",
          type: "input",
          validate: input => {
            return !(Number.isNaN(parseInt(input))) &&
                    (parseInt(input) > 0);
          }
        }
      ]).then( input => {
        let name = input.name,
            department = input.department,
            price = parseFloat(input.price),
            quantity = parseInt(input.quantity);
        insertProduct(name, department, price, quantity);
      });
    }
  });
}

// Inserts new product information into inventory
function insertProduct(name, department, price, quantity) {
  let query = "INSERT INTO products " + 
              "(product_name, department_name, " +
              "price, stock_quantity) VALUES( " + 
              "'" + name + "', '" + 
              department + "', " + price + ", " +
              quantity + ");";
  connection.query(query, (err) => {
    if (err) console.log(err);
    else {
      console.log("Added new product '" + name + "' to inventory!");
      connection.end();
    }
  });
}

// Starts app
function start() {
  inquirer.prompt([
  	{
  		name: "option",
      message: "Manager Menu Options",
      type: "list",
      choices: [
        "View Products for Sale",
        "View Low Inventory",
        "Add to Inventory",
        "Add New Product"
      ]
  	}
  ]).then( selection => {
    switch (selection.option) {
      case "View Products for Sale":
        listProducts();
        break;
      case "View Low Inventory":
        listProducts(true);
        break;
      case "Add to Inventory":
        addToInventory();
        break;
      case "Add New Product":
        addNewProduct();
        break;
      default:
        console.log("Error");
    }
  });
}

connectDB(connection).then(start, err=> console.log(err));