# PLAN
- found items
    1. post and bring found items to office (office then confirm the post and set it to public, includes decoy detail verification where selected identifying details are hidden and used for claim verification, duplicate post detection to prevent similar or repeated submissions)
    2. browse found items 
    3. submit claims to an item with proof (only visible to office and after office has confirmed the claim and proof, claim poster will be contacted through their given contact info)
- lost items
    1. privately post for office to find a possible owner (includes proof and detailed description, works the same as claims for found items but not specified to single item posting, includes duplicate post detection to prevent repeated reports)
- all claims and postings 
    1. goes through office manual verification with system assisted matching of claims and items
    2. have a contact info from user for verification since there is no account requirement
    3. details are updated or archived by office, automatically if possible but mostly manual to avoid mistakes
    4. includes images and all details for easier searching, verification, and documentation

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