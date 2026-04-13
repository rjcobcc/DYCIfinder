# USERS' SYSTEM PROCESS

### finders' process
1. finds an item
2. visit the site
3. post the item found with all the details and images (only visible to office for now)
4. instructed to bring the item to office

### admin managing finder posts
1. view submitted found item report
2. publicize found item report (after being received and report details are verified)

### losters' process
1. losts an item
2. visit the site
3. reporting lost item (only visible to office)(with contact info, detailed item description, and images for proof):
    1. submit a claim to a posted found item report
    2. submit a general lost item report
4. wait for office to contact them

### admin managing loster posts
1. find match between found item reports and (claims made to them OR general lost item reports)
2. finds a (claim OR lost item report) matching a found item report
3. archive and marks the found item post with the (claim OR lost item report)
4. contact the claim poster or lost item poster (through their given contact info)
5. item will be claimed at the office. if wrong owner, undo step 3 and go back to step 1

### user features


### admin features



# DATABASE
```sql
CREATE DATABASE dycifinder;
USE dycifinder;

CREATE TABLE found_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_category VARCHAR(255),
    description TEXT,
    image_url1 VARCHAR(500),
    image_url2 VARCHAR(500),
    location_found VARCHAR(255),
    date_found DATE,
    finder_name VARCHAR(255),
    item_status VARCHAR(255),
    claimant_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE campus_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(255) NOT NULL
);

CREATE TABLE lost_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_category VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500),
    location_lost VARCHAR(255),
    date_lost DATE,
    proof_image_url1 VARCHAR(500),
    proof_image_url2 VARCHAR(500),
    report_status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item_claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    found_item_id INT NOT NULL,
    claim_description TEXT,
    proof_image_url1 VARCHAR(500),
    proof_image_url2 VARCHAR(500),
    claimant_name VARCHAR(255),
    facebook_profile VARCHAR(255),
    contact_number VARCHAR(50),
    email_address VARCHAR(255),
    additional_contact TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (found_item_id) REFERENCES found_reports(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```
