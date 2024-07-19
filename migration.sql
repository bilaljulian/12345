-- Migration script for eNull

-- Drop existing tables if they exist
DROP TABLE IF EXISTS Users;
DROP TABLE IF EXISTS Categories;
DROP TABLE IF EXISTS Listings;
DROP TABLE IF EXISTS Orders;
DROP TABLE IF EXISTS Payments;
DROP TABLE IF EXISTS Reviews;

-- Create Users table
CREATE TABLE Users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    zip TEXT NOT NULL,
    city TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Categories table
CREATE TABLE Categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create Listings table
CREATE TABLE Listings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    picture_url TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES Categories (id),
    FOREIGN KEY (user_id) REFERENCES Users (id)
);

-- Create Orders table
CREATE TABLE Orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('Pending', 'Completed', 'Cancelled')) DEFAULT 'Pending',
    FOREIGN KEY (user_id) REFERENCES Users (id),
    FOREIGN KEY (listing_id) REFERENCES Listings (id)
);

-- Create Payments table
CREATE TABLE Payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    order_id INTEGER NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    payment_method TEXT CHECK(payment_method IN ('Credit Card', 'PayPal')) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES Orders (id)
);

-- Create Reviews table
CREATE TABLE Reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    listing_id INTEGER NOT NULL,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5) NOT NULL,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES Users (id),
    FOREIGN KEY (listing_id) REFERENCES Listings (id)
);

-- Insert default categories
INSERT INTO Categories (name, description) VALUES
('Antiques', 'Rare and valuable antiques.'),
('Collectibles', 'Unique and collectible items.'),
('Art', 'Rare and valuable artworks.'),
('Books', 'Rare and collectible books.'),
('Jewelry', 'Precious and unique jewelry pieces.'),
('Coins', 'Rare and collectible coins.'),
('Stamps', 'Valuable and rare postage stamps.'),
('Toys', 'Rare and collectible toys.'),
('Furniture', 'Antique and rare furniture.'),
('Watches', 'Rare and collectible watches.'),
('Militaria', 'Historical and rare military items.'),
('Music', 'Rare and collectible music records.'),
('Sports Memorabilia', 'Rare and collectible sports items.'),
('Cars', 'Rare and collectible automobiles.'),
('Electronics', 'Rare and collectible electronics.'),
('Fashion', 'Rare and collectible fashion items.'),
('Cameras', 'Rare and collectible cameras.'),
('Art Deco', 'Rare and collectible Art Deco items.'),
('Vintage', 'Rare and collectible vintage items.'),
('Crafts', 'Handmade and rare crafts.');

-- Add additional indexes for performance optimization
CREATE INDEX idx_users_email ON Users (email);
CREATE INDEX idx_listings_category_id ON Listings (category_id);
CREATE INDEX idx_orders_user_id ON Orders (user_id);
CREATE INDEX idx_reviews_user_id ON Reviews (user_id);
CREATE INDEX idx_reviews_listing_id ON Reviews (listing_id);
