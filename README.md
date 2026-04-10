# SYSTEM PLAN
- found items
    1. anyone can post and will be instructed to bring found items to office (office then would confirm the post and set it to public, includes decoy detail verification where selected identifying details are hidden and used for claim verification)
    2. anyone can browse and search found items 
    3. anyone can submit claims to a found item with proof (only visible to office. after office has confirmed the claim and proof, claimant will be contacted through their given contact info)
- lost items
    1. anyone can make private posts for office to consider a possible owner (includes proof and detailed description, works the same as claims for found items but not specified to a single item posting)
- all
    1. postings goes through office manual verification with system assisted matching of claims and items
    2. postings have requires a contact info from user since there are no user account requirements
    3. postings are updated or archived by office, automatically if possible but mostly manual to avoid mistakes
    4. postings includes images and all details for easier searching, verification, and documentation

# DATABASE
```sql
CREATE DATABASE dycifinder;
USE dycifinder;

CREATE TABLE found_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_category VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500),
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
    campus_name VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE lost_reports (
    id INT AUTO_INCREMENT PRIMARY KEY,
    item_name VARCHAR(255) NOT NULL,
    item_category VARCHAR(255),
    description TEXT,
    image_url VARCHAR(500),
    location_lost VARCHAR(255),
    date_lost DATE,
    report_status VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE item_claims (
    id INT AUTO_INCREMENT PRIMARY KEY,
    found_item_id INT NOT NULL,
    claim_description TEXT,
    proof_image_url VARCHAR(500),
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
