-- Add project_zip_url column to submissions table
USE hackathon;

ALTER TABLE submissions 
ADD COLUMN project_zip_url VARCHAR(255) AFTER hackathon_id;

-- Update the column comment for clarity
ALTER TABLE submissions 
MODIFY COLUMN demo_url VARCHAR(255) COMMENT 'Live website/demo URL';

ALTER TABLE submissions 
MODIFY COLUMN documentation_url VARCHAR(255) COMMENT 'Project report/documentation URL';
