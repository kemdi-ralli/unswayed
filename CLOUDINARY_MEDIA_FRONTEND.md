# Cloudinary media – frontend alignment

Backend now serves **full Cloudinary URLs** for post media and profile pictures. This doc records the frontend audit and the only change required.

---

## Audit result

- **No ASSET_URL or base-URL prepending:** The codebase does not prepend any base URL (e.g. `ASSET_URL`, `BASE_URL`) to `media` or profile photo fields.
- **Media used directly:** Post media and profile photos are used as received from the API:
  - Post media: `item.media`, `data.media`, `el.media` → `src={item.media}` (or `<video src={...}>` / ReactPlayer `url={...}`).
  - Profile: `photo`, `userProfile` → `src={...}` with fallbacks (e.g. `/assets/images/profile.png`) when null.
- **Null handling:** Existing checks (`item?.media &&`, `data?.media &&`, etc.) already handle old posts where backend returns `null` for media.

So no changes were needed in components that render media or profile images.

---

## Change made: Next.js image config

**File:** `next.config.mjs`

- **Added** `res.cloudinary.com` to `images.domains` so `next/image` can load Cloudinary URLs.
- **Added** a `remotePatterns` entry for `https://res.cloudinary.com/**` so all Cloudinary paths are allowed.

Without this, `<Image src={post.media} />` (e.g. in `MyPosting.jsx`) would fail when `post.media` is a Cloudinary URL, because Next.js only allows configured remote hosts for the Image component.

---

## Usage rules (for future code)

1. **Use the URL from the API as-is**
   - Correct: `<img src={post.media} />`, `<video src={post.media} />`, `<Image src={post.media} />` (with Cloudinary in `next.config.mjs`).
   - Incorrect: `${ASSET_URL}/storage/${post.media}` or any base URL + path.

2. **Handle null**
   - Old or failed uploads may have `media === null`. Keep conditional rendering, e.g. `{item?.media && <Image src={item.media} ... />}`.

3. **Videos**
   - Cloudinary URLs work with `<video src={...}>` and ReactPlayer; no extra proxy needed.

4. **Profile pictures**
   - Same as above: use `photo` / `userProfile` directly; use a local fallback when null.

---

## Backward compatibility

- **New posts:** Full Cloudinary URLs in `media`; they work with current components and the new Next image config.
- **Old posts:** Backend returns `null` for missing media; frontend already skips rendering when `media` is falsy.
