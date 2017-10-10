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

function displayData(data) {
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

connectDB(connection).then(queryItems(connection).then( data => {
	displayData(data);
}, err => {
	console.log(err);
}));