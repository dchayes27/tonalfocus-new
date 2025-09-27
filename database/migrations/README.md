# Database Migration Instructions

## Adding is_black_white Field

To implement the B&W grouping feature, you need to run the following migration on your Supabase database:

### 1. Open Supabase Dashboard
Go to your project's SQL Editor in the Supabase dashboard.

### 2. Run the Migration
Copy and paste the following SQL:

```sql
-- Add is_black_white field to photos table
ALTER TABLE photos ADD COLUMN is_black_white BOOLEAN DEFAULT FALSE;

-- Create index for better performance when grouping
CREATE INDEX idx_photos_is_black_white ON photos(is_black_white);

-- Update existing photos based on category (if using Black & White category)
UPDATE photos 
SET is_black_white = TRUE 
WHERE category_id IN (
  SELECT id FROM categories WHERE slug = 'black-white'
);
```

### 3. Update Existing Photos
After running the migration, you'll need to mark which photos are black & white. You can:

1. **Manually update in admin**: When the admin interface is updated, you'll have a checkbox to mark photos as B&W
2. **Bulk update by category**: If you've been using the "Black & White" category, the migration already handles this
3. **Update via SQL**: Run queries like:
   ```sql
   UPDATE photos SET is_black_white = TRUE WHERE id = 'photo-uuid-here';
   ```

### 4. Verify the Changes
Test the portfolio page to ensure photos are properly grouped by B&W vs Color.

## Removing Legacy `is_color` Field

After confirming `is_black_white` is populated, run `002_drop_is_color_field.sql` to retire the old column:

```sql
-- Backfill from is_color then drop the column and index
\i database/migrations/002_drop_is_color_field.sql
```

This script:

- Copies any remaining `is_color` state into `is_black_white`
- Drops the `idx_photos_is_color` index
- Removes the `is_color` column

Execute it from the Supabase SQL editor (or your migration tool of choice) once the new flag is live in production.
