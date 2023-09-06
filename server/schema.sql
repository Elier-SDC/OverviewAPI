-- Create the product
CREATE TABLE IF NOT EXISTS product (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  slogan VARCHAR(200),
  description VARCHAR(500),
  category VARCHAR(25),
  default_price DECIMAL(10, 2)
);

-- Create the styles table
CREATE TABLE IF NOT EXISTS styles (
  style_id SERIAL PRIMARY KEY,
  product_id INT,
  name VARCHAR(50),
  sale_price INT,
  default_price INT,
  default_style SMALLINT
);

-- Create the skus table
CREATE TABLE IF NOT EXISTS skus (
  sku_id SERIAL PRIMARY KEY,
  style_id INT,
  size VARCHAR(15),
  quantity INT
);

-- Create the photos table
CREATE TABLE IF NOT EXISTS photos (
  photo_id SERIAL PRIMARY KEY,
  style_id INT,
  url VARCHAR,
  thumbnail_url VARCHAR
);

-- Create the features table
CREATE TABLE IF NOT EXISTS features (
  feature_id SERIAL PRIMARY KEY,
  product_id INT,
  feature VARCHAR(25),
  value VARCHAR(40)
);
