## SETUP GUIDE

1. Install XAMPP and run Apache and MySQL
2. Download and move the project folder into the htdocs folder
3. Initialize the database using the commands below
4. Move email.php and keys.php to folder /server/conf
5. Configure values of /app/conf/api.js and files in /server/conf

## DATABASE

```sql
CREATE DATABASE dycifinder;
USE dycifinder;

CREATE TABLE campus_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(32),
    available BOOLEAN
);

CREATE TABLE item_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(32),
    available BOOLEAN
);

CREATE TABLE found_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- reporter's id, null if not a registered user

    item_name VARCHAR(16),
    item_category VARCHAR(32),
    item_description TEXT,

    find_location VARCHAR(32),
    find_date DATE,
    
    image_url VARCHAR(512),

    finder_name VARCHAR(64),

    report_status VARCHAR(16) DEFAULT 'Pending', -- Pending -> Unclaimed -> Claimed
    claimant_post_type VARCHAR(8), -- claimant/owner's post type (claim post or lost report)
    claimant_post_id INT, -- claimant/owner's post id

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lost_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT, -- reporter's id, null if not a registered user

    item_name VARCHAR(16),
    item_category VARCHAR(32),
    item_description TEXT,

    lost_location VARCHAR(32),
    lost_date DATE,
    
    image_url1 VARCHAR(512),
    image_url2 VARCHAR(512),

    loster_name VARCHAR(64),
    facebook_profile VARCHAR(255),
    contact_number VARCHAR(16),
    email_address VARCHAR(32),

    report_status VARCHAR(16)  DEFAULT 'Unresolved', -- Unresolved -> Resolved / Expired

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item_claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,  -- claimant's id, null if not a registered user
    found_item_id INT NOT NULL,

    claim_description TEXT,
    image_url1 VARCHAR(512),
    image_url2 VARCHAR(512),

    claimant_name VARCHAR(64),
    facebook_profile VARCHAR(255),
    contact_number VARCHAR(16),
    email_address VARCHAR(32),

    claim_status VARCHAR(16),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (found_item_id) REFERENCES found_reports(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    
    email_address VARCHAR(32) UNIQUE NOT NULL,
    hashed_pass VARCHAR(512),

    full_name VARCHAR(255),
    student_no VARCHAR(16),
    facebook_profile VARCHAR(255),
    contact_number VARCHAR(16),
    user_role VARCHAR(8),

    register_code INT,
    regis_code_created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## SAMPLE DATA

```sql
INSERT INTO campus_locations (location_name) VALUES
('Main Campus'),
('North Campus'),
('South Campus'),
('East Campus'),
('West Campus'),
('Library Building'),
('Science Building'),
('Engineering Building'),
('Administration Building'),
('Student Center'),
('Sports Complex'),
('Dormitory A'),
('Dormitory B'),
('Cafeteria'),
('Parking Area');

INSERT INTO item_categories (category_name) VALUES
('ID Card'),
('Access Card'),
('Student Uniform'),
('Keys'),
('Wallet/Purse'),
('Mobile Phone'),
('Laptop'),
('Tablet'),
('Earphones/Headphones'),
('Books'),
('Notebooks'),
('Pens & Stationery'),
('Backpack/Bag'),
('Water Bottle'),
('Umbrella'),
('Jacket/Hoodie'),
('Charger/Charging Cable'),
('USB Drive'),
('Eyeglasses'),
('Sports Gear');
```