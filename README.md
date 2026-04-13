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

CREATE TABLE campus_locations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    location_name VARCHAR(32)
);

CREATE TABLE item_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    category_name VARCHAR(32)
);

CREATE TABLE found_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,

    item_name VARCHAR(16),
    item_category VARCHAR(32),
    item_description TEXT,

    location_found VARCHAR(32),
    datetime_found TIMESTAMP,
    
    image_url1 VARCHAR(512),
    image_url2 VARCHAR(512),

    finder_name VARCHAR(64),

    report_status VARCHAR(16),
    claimant_post_type VARCHAR(8), 
    claimant_post_id INT,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lost_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,

    item_name VARCHAR(16),
    item_category VARCHAR(32),
    item_description TEXT,

    location_found VARCHAR(32),
    datetime_found TIMESTAMP,
    
    image_url1 VARCHAR(512),
    image_url2 VARCHAR(512),

    loster_name VARCHAR(64),
    facebook_profile VARCHAR(256),
    contact_number VARCHAR(16),
    email_address VARCHAR(32)

    report_status VARCHAR(16),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item_claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    found_item_id INT NOT NULL,

    claim_description TEXT,
    image_url1 VARCHAR(512),
    image_url2 VARCHAR(512),

    claimant_name VARCHAR(64),
    facebook_profile VARCHAR(256),
    contact_number VARCHAR(16),
    email_address VARCHAR(32)

    claim_status VARCHAR(16),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (found_item_id) REFERENCES found_reports(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE
);
```
