# Backend Implementation Guide - US Territories Cities

## Quick Start (5 Steps)

### Step 1: Verify Prerequisites
```sql
-- Check if territories exist in states table
SELECT id, name 
FROM states 
WHERE name IN (
    'American Samoa',
    'Guam',
    'Northern Mariana Islands',
    'Puerto Rico',
    'U.S. Virgin Islands'
);
```
**Expected**: Should return 5 rows with these exact names

### Step 2: Import Cities
Choose ONE method:

#### Option A: Direct SQL Import (Fastest)
```bash
mysql -u username -p database_name < us_territories_cities.sql
```

#### Option B: Laravel Artisan Command
```bash
php artisan db:seed --class=USTerritoriesCitiesSeeder
```

#### Option C: Manual Import via phpMyAdmin
1. Open phpMyAdmin
2. Select your database
3. Go to Import tab
4. Upload `us_territories_cities.sql`
5. Click "Go"

### Step 3: Verify Import
```sql
-- Should return 137 total cities
SELECT COUNT(*) as total_cities
FROM cities
WHERE state_id IN (
    SELECT id FROM states 
    WHERE name IN (
        'American Samoa',
        'Guam',
        'Northern Mariana Islands',
        'Puerto Rico',
        'U.S. Virgin Islands'
    )
);
```
**Expected Result**: `total_cities: 137`

### Step 4: Test API Endpoint
```bash
# Test for Puerto Rico
curl http://your-api-url/cities-by-state-name/Puerto%20Rico

# Should return JSON with 72 cities
```

### Step 5: Verify Frontend
1. Go to registration form
2. Select country: "United States"
3. Select state: "Puerto Rico"
4. Cities dropdown should show 72+ cities ✅

---

## Detailed Verification Checklist

### Database Verification
- [ ] American Samoa: 15 cities
- [ ] Guam: 19 cities
- [ ] Northern Mariana Islands: 13 cities
- [ ] Puerto Rico: 72 cities
- [ ] U.S. Virgin Islands: 18 cities
- [ ] **Total: 137 cities**

### API Endpoint Verification
Test each territory:

```bash
# American Samoa
curl http://api/cities-by-state-name/American%20Samoa
# Expected: 15 cities

# Guam
curl http://api/cities-by-state-name/Guam
# Expected: 19 cities

# Northern Mariana Islands
curl http://api/cities-by-state-name/Northern%20Mariana%20Islands
# Expected: 13 cities

# Puerto Rico
curl http://api/cities-by-state-name/Puerto%20Rico
# Expected: 72 cities

# U.S. Virgin Islands
curl http://api/cities-by-state-name/U.S.%20Virgin%20Islands
# Expected: 18 cities
```

### Frontend Verification
For EACH territory, test in these forms:

- [ ] Applicant registration form
- [ ] Employer registration form
- [ ] Applicant profile edit
- [ ] Employer profile edit
- [ ] Create job form
- [ ] Job alert settings

---

## Troubleshooting

### Problem: "0 cities returned"
**Cause**: State names don't match exactly  
**Solution**:
```sql
-- Check actual state names
SELECT name FROM states WHERE name LIKE '%Samoa%';
SELECT name FROM states WHERE name LIKE '%Guam%';
SELECT name FROM states WHERE name LIKE '%Mariana%';
SELECT name FROM states WHERE name LIKE '%Rico%';
SELECT name FROM states WHERE name LIKE '%Virgin%';

-- Update SQL file with correct names if different
```

### Problem: "Duplicate entry" error
**Cause**: Cities already exist  
**Solution**:
```sql
-- Clear existing cities first
DELETE FROM cities 
WHERE state_id IN (
    SELECT id FROM states 
    WHERE name IN (
        'American Samoa',
        'Guam',
        'Northern Mariana Islands',
        'Puerto Rico',
        'U.S. Virgin Islands'
    )
);

-- Then re-import
```

### Problem: Special characters not displaying correctly
**Cause**: Character encoding issue  
**Solution**:
```sql
-- Set proper encoding
ALTER TABLE cities CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE states CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Re-import after encoding fix
```

### Problem: API returns empty array
**Cause**: Endpoint not finding state by name  
**Solution**:
```php
// In your cities controller, ensure this logic:
public function getCitiesByStateName($stateName)
{
    $state = State::where('name', $stateName)->first();
    
    if (!$state) {
        return response()->json([
            'status': 'error',
            'message': 'State not found: ' . $stateName
        ], 404);
    }
    
    $cities = City::where('state_id', $state->id)->get();
    
    return response()->json([
        'status': 'success',
        'data': [
            'cities' => $cities
        ]
    ]);
}
```

---

## Production Deployment Checklist

### Before Deployment
- [ ] Backup current database
- [ ] Test on staging environment first
- [ ] Verify all 5 territories have cities
- [ ] Test API endpoints work
- [ ] Check UTF-8 encoding is correct

### During Deployment
- [ ] Run import during low-traffic period
- [ ] Monitor import progress
- [ ] Check for errors in logs
- [ ] Verify count matches (137 cities)

### After Deployment
- [ ] Test each territory in frontend
- [ ] Monitor error logs for 24 hours
- [ ] Check user reports
- [ ] Document completion

---

## Database Schema Requirements

Ensure your tables have this structure:

### States Table
```sql
CREATE TABLE states (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    country_id INT,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    INDEX (name)
);
```

### Cities Table
```sql
CREATE TABLE cities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    state_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP,
    updated_at TIMESTAMP,
    FOREIGN KEY (state_id) REFERENCES states(id),
    INDEX (state_id),
    INDEX (name)
);
```

---

## API Endpoint Implementation

Ensure you have this route:

### Laravel Route
```php
// routes/api.php
Route::get('/cities-by-state-name/{stateName}', [CityController::class, 'getCitiesByStateName']);
```

### Controller Method
```php
public function getCitiesByStateName($stateName)
{
    try {
        // Decode URL-encoded state name
        $stateName = urldecode($stateName);
        
        // Find state
        $state = State::where('name', $stateName)->first();
        
        if (!$state) {
            return response()->json([
                'status' => 'error',
                'message' => 'State not found'
            ], 404);
        }
        
        // Get cities
        $cities = City::where('state_id', $state->id)
            ->orderBy('name', 'asc')
            ->get(['id', 'name']);
        
        return response()->json([
            'status' => 'success',
            'data' => [
                'cities' => $cities,
                'count' => $cities->count()
            ]
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'error',
            'message' => $e->getMessage()
        ], 500);
    }
}
```

---

## Performance Considerations

### Add Indexes
```sql
-- Add indexes for faster queries
CREATE INDEX idx_states_name ON states(name);
CREATE INDEX idx_cities_state_id ON cities(state_id);
CREATE INDEX idx_cities_name ON cities(name);
```

### Cache Results (Optional)
```php
// Cache city results for 24 hours
$cities = Cache::remember("cities_for_{$stateName}", 86400, function() use ($stateId) {
    return City::where('state_id', $stateId)->get();
});
```

---

## Success Criteria

✅ **All checks must pass:**

1. Database has 137 cities total
2. Each territory has correct city count
3. API endpoint returns cities for each territory
4. Frontend dropdowns populate correctly
5. No character encoding issues
6. Users can select and save territory cities

---

## Support

If you need help:
1. Check logs: `tail -f storage/logs/laravel.log`
2. Test SQL queries in database console
3. Verify API responses with Postman
4. Check frontend console for errors

---

## Time Estimate

- SQL Import: **2-5 minutes**
- Verification: **5-10 minutes**
- Testing: **10-15 minutes**
- **Total: 20-30 minutes**

---

**Created**: January 19, 2026  
**Version**: 1.0.0  
**Status**: Ready for Production
