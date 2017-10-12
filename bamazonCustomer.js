const mysql = require('mysql');
const inquirer = require('inquirer');

let connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "",
  database: "bamazon"
});

function connectDB(connection) {
	return new Promise((resolve, reject) => {
		connection.connect(err => {
			if (err) reject(err);
			resolve(connection);
		});
	});
} 

function queryItems(connection) {
	return new Promise((resolve, reject) => {
		connection.query("SELECT * FROM products", (err, data) => {
			if (err) reject(err);
			else resolve(data);
		})
	});
}

function queryStock(connection, quantity, id) {
  return new Promise((resolve, reject) => {
    let query = "SELECT stock_quantity FROM products WHERE item_id=" + id;
    connection.query(query, (err, data) => {
      if (err) reject(err);
      let stock = data[0]["stock_quantity"];
      if (stock >= quantity) {
        let amount = stock - quantity;
        resolve(amount);
      } else {
        console.log("Insufficient Quantity!");
      }
    });
  });
}

function depleteStock(connection, amount, id) {
  return new Promise((resolve, reject) => {
    let query = "UPDATE products SET stock_quantity = " + amount + 
                " WHERE item_id=" + id; 
    connection.query(query, (err) => {
      if (err) reject(err);
      resolve();
    });
  });
}

function printReceipt(connection, quantity, id) {
  let query = "SELECT price, product_name FROM products WHERE item_id= " + id; 
  connection.query(query, (err, data) => {
    if (err) console.log(err);
    // console.log(data);
    let price = data[0]["price"];
    let total = price * quantity;
    let name = data[0]["product_name"];
    console.log("Thanks for your order!",
                "\n" + quantity + " × " + name, 
                "\nYour total cost is $" + total.toFixed(2));
  });
}

function displayProducts(data) {
	console.log("OUR PRODUCTS",
						  "\n--------------------------------");
	for (let i = 0; i < data.length; i++) {
		let id = data[i].item_id,
				name = data[i].product_name,
				price = data[i].price.toFixed(2);
		console.log("ID: " + id,
								"\nNAME: " + name,
								"\nPRICE: $" + price,
								"\n--------------------------------");
	}
}

function promptUser(data) {
  return inquirer.prompt([
  {
    name: "id",
    message: "Enter the ID of the product you wish to buy.",
    type: "input",
    validate: answer => {
      let ids = [];
      for (let i = 0; i < data.length; i++) {
        ids.push(data[i].item_id);
      }
      return (ids.indexOf(parseInt(answer)) > -1);
    }
  },
  {
    name: "quantity",
    message: "How many would you like to buy?",
    type: "input"
  }]);
}

function handleError(err) {
  console.log(err);
}

connectDB(connection).then( connection => {
  queryItems(connection).then( data => {
    displayProducts(data);
    promptUser(data).then( answers => {
      let qty = parseInt(answers.quantity);
      let id = parseInt(answers.id);
      queryStock(connection, qty, id)
        .then( amount => {
          depleteStock(connection, amount, id)
            .then( () => { 
              printReceipt(connection, qty, id);
              connection.end(); 
            }, err => handleError(err));
        }, err => handleError(err));
    }, err => handleError(err));
  }, err => handleError(err));
});