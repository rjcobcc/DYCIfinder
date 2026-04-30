## SETUP GUIDE

1. Install XAMPP and run Apache and MySQL
2. Download and move the project folder into the htdocs folder
3. Initialize the database using the commands below
4. Move email.php and keys.php to folder /server/conf
5. Configure values of /app/conf/api.js and files in /server/conf
6. Get API key for /server/conf/keys.php from https://api.imgbb.com/

## DATABASE

```sql
CREATE DATABASE dyci_finder;
USE dyci_finder;

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
    report_status VARCHAR(16) DEFAULT 'Pending', -- Pending -> Unclaimed -> Owned -> Claimed
    ownerpost_type VARCHAR(16), -- Claim or Lost Report
    ownerpost_id INT,
    
    item_name VARCHAR(16),
    item_category VARCHAR(32),
    item_desc TEXT,
    find_location VARCHAR(32),
    find_date DATE,
    image_url VARCHAR(512),

    user_id INT, -- null if logged out or unregistered

    finder_full_name VARCHAR(64),
    finder_student_id VARCHAR(16),
    finder_course_section VARCHAR(8),

    finder_fb VARCHAR(255),
    finder_phone VARCHAR(16),
    finder_email VARCHAR(32),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lost_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    report_status VARCHAR(16) DEFAULT 'Lost', -- Lost -> Found -> Resolved / Expired
    foundreport_id INT, -- for linking to a found report
    
    item_name VARCHAR(16),
    item_category VARCHAR(32),
    item_desc TEXT,
    lost_location VARCHAR(32),
    lost_date DATE,
    image_url1 VARCHAR(512),
    image_url2 VARCHAR(512),

    user_id INT, -- null if logged out or unregistered

    owner_full_name VARCHAR(64),
    owner_student_id VARCHAR(16),
    owner_course_section VARCHAR(8),

    owner_fb VARCHAR(255),
    owner_phone VARCHAR(16),
    owner_email VARCHAR(32),
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE foundreport_claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    foundreport_id INT NOT NULL,
    claim_status VARCHAR(16) DEFAULT 'Pending', -- Pending -> Selected -> Claimed
    
    claim_desc TEXT,
    image_url1 VARCHAR(512),
    image_url2 VARCHAR(512),

    user_id INT, -- null if logged out or unregistered

    owner_full_name VARCHAR(64),
    owner_student_id VARCHAR(16),
    owner_course_section VARCHAR(8),

    owner_fb VARCHAR(255),
    owner_phone VARCHAR(16),
    owner_email VARCHAR(32),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (foundreport_id) REFERENCES found_reports(id)
);

CREATE TABLE users(
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_role VARCHAR(8) DEFAULT 'Normal', -- Normal or Admin

    email_address VARCHAR(32) UNIQUE NOT NULL,
    hashed_pass VARCHAR(512),

    full_name VARCHAR(255),
    student_id VARCHAR(16),
    course_section VARCHAR(8),

    facebook_url VARCHAR(255),
    phone_number VARCHAR(16),

    register_code INT,
    register_code_created_at TIMESTAMP,
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