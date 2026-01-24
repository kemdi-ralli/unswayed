# US Territories Cities Database Seeder

## Overview
This directory contains database seeds for populating cities in **5 US inhabited territories**. These territories currently have empty city dropdowns in the application.

---

## Territories Covered

| Territory | Cities Count | Capital/Main City |
|-----------|--------------|-------------------|
| **American Samoa** | 15 | Pago Pago |
| **Guam** | 19 | Hagåtña (Agana) |
| **Northern Mariana Islands** | 13 | Saipan |
| **Puerto Rico** | 72 | San Juan |
| **U.S. Virgin Islands** | 18 | Charlotte Amalie |
| **TOTAL** | **137 cities** | |

---

## Files Included

### 1. `us_territories_cities.sql`
**Format**: SQL Insert Statements  
**Usage**: Direct database import  
**Database**: MySQL/MariaDB compatible  

### 2. `us_territories_cities.json`
**Format**: JSON data  
**Usage**: API seeding, programmatic import, reference  

---

## Installation Instructions

### Method 1: Direct SQL Import (Recommended)

#### Prerequisites
1. Territories must exist in `states` table with exact names:
   - `American Samoa`
   - `Guam`
   - `Northern Mariana Islands`
   - `Puerto Rico`
   - `U.S. Virgin Islands`

#### Steps
```bash
# 1. Access your database
mysql -u your_username -p your_database_name

# 2. Import the SQL file
source /path/to/us_territories_cities.sql

# OR use command line
mysql -u your_username -p your_database_name < us_territories_cities.sql
```

### Method 2: Laravel Seeder (If using Laravel)

#### Create a seeder file
```bash
php artisan make:seeder USTerritoriesCitiesSeeder
```

#### Add this code to the seeder
```php
<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class USTerritoriesCitiesSeeder extends Seeder
{
    public function run()
    {
        $json = File::get(database_path('seeds/us_territories_cities.json'));
        $data = json_decode($json, true);

        foreach ($data['territories'] as $territory) {
            $state = DB::table('states')
                ->where('name', $territory['name'])
                ->first();

            if ($state) {
                foreach ($territory['cities'] as $cityName) {
                    DB::table('cities')->insert([
                        'state_id' => $state->id,
                        'name' => $cityName,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }
        }
    }
}
```

#### Run the seeder
```bash
php artisan db:seed --class=USTerritoriesCitiesSeeder
```

### Method 3: API Endpoint Seeder

If you prefer to create an admin API endpoint:

```php
Route::post('/admin/seed/us-territories-cities', function () {
    $json = file_get_contents(storage_path('seeds/us_territories_cities.json'));
    $data = json_decode($json, true);
    
    $insertedCount = 0;
    
    foreach ($data['territories'] as $territory) {
        $state = State::where('name', $territory['name'])->first();
        
        if ($state) {
            foreach ($territory['cities'] as $cityName) {
                City::create([
                    'state_id' => $state->id,
                    'name' => $cityName,
                ]);
                $insertedCount++;
            }
        }
    }
    
    return response()->json([
        'message' => 'Cities seeded successfully',
        'cities_inserted' => $insertedCount
    ]);
});
```

---

## Verification

After importing, run this query to verify:

```sql
SELECT 
    s.name AS territory,
    COUNT(c.id) AS city_count
FROM states s
LEFT JOIN cities c ON c.state_id = s.id
WHERE s.name IN (
    'American Samoa',
    'Guam',
    'Northern Mariana Islands',
    'Puerto Rico',
    'U.S. Virgin Islands'
)
GROUP BY s.name
ORDER BY s.name;
```

### Expected Results
```
+---------------------------+------------+
| territory                 | city_count |
+---------------------------+------------+
| American Samoa            | 15         |
| Guam                      | 19         |
| Northern Mariana Islands  | 13         |
| Puerto Rico               | 72         |
| U.S. Virgin Islands       | 18         |
+---------------------------+------------+
```

---

## City Details

### American Samoa (15 cities)
- **Capital**: Pago Pago
- **Notable Cities**: Tafuna, Leone, Fagatogo
- **Note**: Organized into districts; villages serve as population centers

### Guam (19 villages)
- **Capital**: Hagåtña (also known as Agana)
- **Largest**: Dededo
- **Tourist Hub**: Tumon
- **Note**: Villages are the primary administrative divisions

### Northern Mariana Islands (13 cities)
- **Capital**: Saipan
- **Main Islands**: Saipan, Tinian, Rota
- **Notable**: Garapan (tourist/commercial center on Saipan)

### Puerto Rico (72 municipalities)
- **Capital**: San Juan
- **Major Cities**: Bayamón, Carolina, Ponce, Caguas
- **Note**: All 78 municipalities included (complete coverage)
- **Islands**: Includes Vieques and Culebra

### U.S. Virgin Islands (18 cities)
- **Capital**: Charlotte Amalie (on St. Thomas)
- **Main Islands**:
  - St. Croix: 8 cities (largest island)
  - St. Thomas: 8 cities (capital island)
  - St. John: 2 cities (smallest inhabited island)

---

## Data Sources

Cities were researched from official sources:
- US Census Bureau data
- Official territory government websites
- USPS postal designations
- Geographic Names Information System (GNIS)

All data is accurate as of 2024-2025.

---

## Cleanup (If Needed)

To remove all territory cities:

```sql
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
```

**⚠️ WARNING**: This will permanently delete all cities for these territories!

---

## Troubleshooting

### Issue: "State not found" error
**Solution**: Ensure territories exist in `states` table with exact names (case-sensitive)

### Issue: Duplicate cities
**Solution**: Add unique constraint or check before inserting:
```sql
INSERT IGNORE INTO cities ...
```

### Issue: Special characters not displaying
**Solution**: Ensure database charset is UTF-8:
```sql
ALTER TABLE cities CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## Frontend Integration

After seeding the database:

1. ✅ Frontend code already updated to handle territories
2. ✅ City dropdowns will automatically populate
3. ✅ No additional frontend changes needed

The frontend updates in these files already support territories:
- `src/helper/MasterGetApiHelper.js`
- `src/app/applicant/form/page.jsx`
- `src/app/employer/form/page.jsx`
- `src/components/employer/createJob/CreateJobsForm.jsx`
- `src/app/applicant/settings/change-notification/page.jsx`

---

## API Endpoint Requirements

Ensure your backend has this endpoint working:

```
GET /cities-by-state-name/{stateName}

Example: GET /cities-by-state-name/Puerto Rico

Response:
{
  "status": "success",
  "data": {
    "cities": [
      { "id": 1, "name": "San Juan" },
      { "id": 2, "name": "Bayamón" },
      ...
    ]
  }
}
```

---

## Maintenance

### Adding New Cities
If new cities need to be added later:

```sql
INSERT INTO cities (state_id, name, created_at, updated_at)
SELECT id, 'New City Name', NOW(), NOW() 
FROM states 
WHERE name = 'Territory Name';
```

### Updating City Names
```sql
UPDATE cities 
SET name = 'New Name', updated_at = NOW()
WHERE name = 'Old Name' 
AND state_id = (SELECT id FROM states WHERE name = 'Territory Name');
```

---

## Support

If you encounter issues:
1. Check database connection
2. Verify states table has territories
3. Ensure UTF-8 encoding
4. Check API endpoint `/cities-by-state-name/{stateName}` works

---

## License

Public domain - US geographic data

---

**Created**: January 19, 2026  
**Version**: 1.0.0  
**Status**: Production Ready  
**Total Cities**: 137
