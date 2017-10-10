CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
  item_id INT NOT NULL AUTO_INCREMENT,
  product_name VARCHAR(255) NOT NULL,
  department_name VARCHAR(255) NOT NULL,
  price FLOAT(10, 2) NOT NULL,
  stock_quantity INT NOT NULL,
  PRIMARY KEY(item_id)
);

INSERT INTO products (product_name, department_name,
  price, stock_quantity)  
VALUES (
  "Coffee Grinder",
  "Home and Kitchen",
  99.99,
  10     
);

INSERT INTO products (product_name, department_name,
  price, stock_quantity)  
VALUES (
  "Guitar Amp",
  "Musical Instruments",
  200.00,
  20     
);

INSERT INTO products (product_name, department_name,
  price, stock_quantity)  
VALUES (
  "Electronic Keyboard",
  "Musical Instruments",
  400.00,
  15     
), (
  "Spatula",
  "Home and Kitchen",
  8.50,
  50
), (
  "White Socks",
  "Clothing",
  2.99,
  100
), (
  "Virtual Reality Goggles",
  "Electronics",
  250.00,
  30
), (
  "Disneyland Hat",
  "Clothing",
  7.99,
  500
), (
  "Ukulele",
  "Musical Instruments",
  69.99,
  15
), (
  "Laptop Computer",
  "Electronics",
  1200,
  40
), (
  "Firetruck Toy",
  "Toys",
  29.99,
  25
), (
  "Nerf Gun",
  "Toys",
  15.00,
  12
);
