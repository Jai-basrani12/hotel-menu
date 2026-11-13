# Hotel Grand Xenia - Mobile-First Digital QR Menu & Room Service

A royal Rajasthani maroon-and-gold digital dining and 24/7 room service menu website designed for **Hotel Grand Xenia (Ajmer, Rajasthan)**. Built with plain HTML, Tailwind CSS, custom heritage styling, and vanilla JavaScript—zero frameworks, zero build steps, and zero npm dependencies.

---

## 👑 Features

- **Heritage Theme:** Maroon (`#5B132B`), Desert Gold (`#D4AF37`), Cream (`#FAF4E8`), with traditional Rajasthani Jali motif pattern and gold glowing accents.
- **28 Realistic Dishes:** Authentic Rajasthani delicacies (Dal Baati Churma, Mewari Laal Maas, Ker Sangri, Jodhpuri Gatte Ki Sabzi, Moong Dal Halwa), North Indian curries, tandoori starters, soups, Chinese specials, breads, desserts, and beverages.
- **Interactive Cart & Steppers:** Guests can tap `[+ ADD]` on any dish, then increment/decrement with `[-] [count] [+]`.
- **Slide-Up Order Drawer:**
  - Guests can select between **In-Room Delivery (Room Service)** and **Dine-in Table**.
  - Review items, adjust quantities, and enter special cooking notes.
  - Automatic calculation of subtotal, **5% GST**, and Grand Total.
- **Direct WhatsApp Kitchen Ordering:** Generates a structured, itemized WhatsApp order with room/table number and guest notes.
- **QR Code Location Awareness:**
  - `?table=5` &rarr; Shows "Table 5" header badge and pre-fills the table number.
  - `?room=204` &rarr; Shows "Room 204" header badge and pre-fills the room number.
- **Search & Filters:** Real-time dish search and filter pills (**All Dishes**, **Pure Veg**, **Non-Veg**, **Chef's Specials**).
- **Reception Call:** Quick `tel:` link to contact the front desk directly.

---

## 🚀 How to Run Locally

### Method 1: Just Double-Click `index.html`
Simply double-click `index.html` in your file explorer to open it in Chrome, Edge, Safari, or Firefox.

### Method 2: Python Local Server
Run in PowerShell / Terminal:
```bash
python -m http.server 8000
```
Then visit:
- **Default Menu:** `http://localhost:8000`
- **Room 204 Demo:** `http://localhost:8000/?room=204`
- **Table 5 Demo:** `http://localhost:8000/?table=5`

---

## 🍽️ How to Edit or Add Dishes

All hotel details and menu content live **ONLY in [`menu-data.js`](menu-data.js)**. You do not need to touch `index.html`, `style.css`, or `app.js`.

### Adding a Dish:
Open [`menu-data.js`](menu-data.js), find your category, and paste:
```javascript
{
  id: "main-course-paneer-lababdar",
  name: "Shahi Paneer Lababdar",
  description: "Cottage cheese cubes tossed in rich onion, tomato and cashew nut gravy with grated paneer.",
  price: 320,
  veg: true,
  special: true,
  image: ""
},
```

---

## 🌐 Deploy to Vercel

Push this repository to GitHub and import it on [Vercel](https://vercel.com), or run `npx vercel` in this folder. It deploys instantly as a static site.
