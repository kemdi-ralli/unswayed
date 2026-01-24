# Quick Import Guide - US Territories Cities

## ⚡ 3-Step Import Process

### Step 1: Import to Database (2 minutes)
```bash
mysql -u your_username -p your_database < us_territories_cities.sql
```

### Step 2: Verify Import (30 seconds)
```sql
SELECT COUNT(*) FROM cities 
WHERE state_id IN (
    SELECT id FROM states WHERE name IN (
        'American Samoa', 'Guam', 'Northern Mariana Islands', 
        'Puerto Rico', 'U.S. Virgin Islands'
    )
);
```
**Expected**: 137

### Step 3: Test API (1 minute)
```bash
curl http://your-api-url/cities-by-state-name/Puerto%20Rico
```
**Expected**: JSON with 72 cities

---

## ✅ That's It!

Frontend code is already updated. Once you import the SQL file, city dropdowns will work immediately for all 5 US territories.

---

## 📊 What Gets Imported

| Territory | Cities |
|-----------|--------|
| American Samoa | 15 |
| Guam | 19 |
| Northern Mariana Islands | 13 |
| Puerto Rico | 72 |
| U.S. Virgin Islands | 18 |
| **TOTAL** | **137** |

---

## 🔧 Troubleshooting

**Problem**: Import fails  
**Solution**: Check territory names match exactly in states table

**Problem**: Cities don't appear in dropdown  
**Solution**: Verify API endpoint `/cities-by-state-name/{name}` works

**Problem**: Special characters broken  
**Solution**: Use UTF-8 encoding: `utf8mb4_unicode_ci`

---

## 📞 Need Help?

1. Read: `BACKEND_IMPLEMENTATION_GUIDE.md`
2. Check: `README_TERRITORIES_SEEDER.md`
3. Reference: `CITIES_SUMMARY.md`

---

**Total Time**: 5-10 minutes  
**Difficulty**: Easy  
**Impact**: High
