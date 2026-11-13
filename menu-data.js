/**
 * ============================================================================
 * HOTEL GRAND XENIA - DIGITAL MENU DATA
 * ============================================================================
 * 
 * Edit this file to update hotel details, phone/WhatsApp numbers, categories,
 * and dishes. You do NOT need to touch HTML, CSS, or app.js.
 * 
 * HOW TO ADD A NEW DISH:
 * 1. Find the appropriate category in the MENU array below.
 * 2. Copy an existing dish object inside the `dishes: [...]` array.
 * 3. Update the fields:
 *    - id: Unique text identifier (e.g. "main-course-paneer-lababdar")
 *    - name: Dish name in English/Hindi
 *    - description: Short appetizing description
 *    - price: Price in INR as a number (e.g. 320)
 *    - veg: true for Pure Vegetarian, false for Non-Vegetarian
 *    - special: true for Chef's Special badge, false otherwise
 *    - image: Optional image path/URL (leave as "" if none)
 * ============================================================================
 */

const RESTAURANT = {
  name: "Hotel Grand Xenia",
  tagline: "Fine Dining & 24-Hour Room Service",
  announcement: "Welcome to Hotel Grand Xenia • 24/7 Room Service & Fine Dining",
  address: "Pushkar By-Pass Road, Karni Nagar, Ajmer, Rajasthan 305004",
  phone: "+91 145 262 4890",
  phoneDisplay: "+91 145 262 4890",
  whatsapp: "917877756598", // Digits only with country code (91 for India)
  currencySymbol: "₹",
  taxPercent: 5, // 5% GST
  taxNote: "Government taxes (5% GST) applicable. No service charge.",
  deliveryNote: "Complimentary in-room delivery for in-house guests."
};

const MENU = [
  {
    id: "soups",
    name: "Soups",
    dishes: [
      {
        id: "soups-tomato-dhaniya-shorba",
        name: "Tomato Dhaniya Shorba",
        description: "Roasted tomato broth infused with fresh coriander and crushed black pepper.",
        price: 120,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "soups-hot-and-sour-soup",
        name: "Veg Hot & Sour Soup",
        description: "Spicy and tangy Indo-Chinese broth loaded with finely chopped seasonal vegetables.",
        price: 130,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "soups-chicken-manchow-soup",
        name: "Chicken Manchow Soup",
        description: "Garlic-infused dark soy chicken soup topped with crispy fried noodles.",
        price: 150,
        veg: false,
        special: false,
        image: ""
      }
    ]
  },
  {
    id: "starters",
    name: "Starters",
    dishes: [
      {
        id: "starters-paneer-tikka",
        name: "Ajmeri Paneer Tikka",
        description: "Char-grilled cottage cheese cubes marinated in hung curd and roasted spices.",
        price: 280,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "starters-hara-bhara-kebab",
        name: "Hara Bhara Kebab",
        description: "Pan-seared spinach, green pea, and potato patties stuffed with spiced paneer.",
        price: 240,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "starters-chilli-paneer-dry",
        name: "Chilli Paneer Dry",
        description: "Crispy fried cottage cheese tossed with bell peppers, onions, and spicy soy sauce.",
        price: 270,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "starters-tandoori-chicken",
        name: "Tandoori Chicken (Half)",
        description: "Clay-oven roasted spring chicken marinated overnight in yogurt and Kashmiri chilli.",
        price: 340,
        veg: false,
        special: false,
        image: ""
      },
      {
        id: "starters-chicken-65",
        name: "Chicken 65",
        description: "Crispy batter-fried chicken bites tempered with curry leaves, garlic, and green chillies.",
        price: 320,
        veg: false,
        special: false,
        image: ""
      }
    ]
  },
  {
    id: "main-course",
    name: "Main Course",
    dishes: [
      {
        id: "main-course-dal-baati-churma",
        name: "Rajasthani Dal Baati Churma",
        description: "Baked wheat dumplings served with five-lentil dal, sweet churma, and pure desi ghee.",
        price: 360,
        veg: true,
        special: true,
        image: ""
      },
      {
        id: "main-course-gatte-ki-sabzi",
        name: "Jodhpuri Gatte Ki Sabzi",
        description: "Steamed gram flour dumplings simmered in a tangy, spiced Rajasthani yogurt gravy.",
        price: 260,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "main-course-ker-sangri",
        name: "Royal Ker Sangri",
        description: "Traditional desert berries and beans sautéed with dried red chillies and raw mango.",
        price: 310,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "main-course-paneer-butter-masala",
        name: "Paneer Butter Masala",
        description: "Soft cottage cheese cubes cooked in a rich, velvety tomato and cashew gravy.",
        price: 300,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "main-course-dal-tadka",
        name: "Yellow Dal Tadka",
        description: "Slow-cooked yellow lentils finished with a sizzling cumin, garlic, and ghee tempering.",
        price: 210,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "main-course-laal-maas",
        name: "Mewari Laal Maas",
        description: "Fiery Rajasthani mutton curry slow-cooked with smoked Mathania red chillies and garlic.",
        price: 480,
        veg: false,
        special: true,
        image: ""
      },
      {
        id: "main-course-butter-chicken",
        name: "Murgh Makhani (Butter Chicken)",
        description: "Tandoori chicken tikka simmered in a creamy, mildly spiced tomato and butter sauce.",
        price: 420,
        veg: false,
        special: false,
        image: ""
      }
    ]
  },
  {
    id: "chinese",
    name: "Chinese",
    dishes: [
      {
        id: "chinese-veg-hakka-noodles",
        name: "Veg Hakka Noodles",
        description: "Wok-tossed noodles with julienned carrots, cabbage, bell peppers, and light soy.",
        price: 210,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "chinese-veg-manchurian-gravy",
        name: "Veg Manchurian Gravy",
        description: "Golden vegetable dumplings simmered in a savory ginger, garlic, and soy sauce.",
        price: 230,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "chinese-chicken-fried-rice",
        name: "Chicken Schezwan Fried Rice",
        description: "Aromatic rice stir-fried with diced chicken, egg, spring onions, and fiery Schezwan paste.",
        price: 260,
        veg: false,
        special: false,
        image: ""
      }
    ]
  },
  {
    id: "breads-and-rice",
    name: "Breads & Rice",
    dishes: [
      {
        id: "breads-and-rice-butter-naan",
        name: "Butter Naan",
        description: "Leavened refined flour flatbread baked in the tandoor and brushed with white butter.",
        price: 65,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "breads-and-rice-garlic-naan",
        name: "Garlic Naan",
        description: "Tandoor-baked flatbread topped with minced garlic, fresh coriander, and melted butter.",
        price: 80,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "breads-and-rice-missi-roti",
        name: "Rajasthani Missi Roti",
        description: "Savory flatbread made from spiced gram flour and whole wheat, baked crisp.",
        price: 60,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "breads-and-rice-jeera-rice",
        name: "Jeera Rice",
        description: "Fragrant basmati rice tempered with roasted cumin seeds and fresh coriander.",
        price: 160,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "breads-and-rice-hyderabadi-chicken-biryani",
        name: "Royal Dum Chicken Biryani",
        description: "Saffron-infused basmati rice layered with spiced chicken, served with burani raita.",
        price: 380,
        veg: false,
        special: true,
        image: ""
      }
    ]
  },
  {
    id: "desserts",
    name: "Desserts",
    dishes: [
      {
        id: "desserts-gulab-jamun",
        name: "Hot Gulab Jamun (2 Pcs)",
        description: "Deep-fried milk solid dumplings soaked in warm cardamom and rose-scented sugar syrup.",
        price: 110,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "desserts-moong-dal-halwa",
        name: "Rajasthani Moong Dal Halwa",
        description: "Rich, slow-roasted yellow lentil pudding cooked in ghee with almonds and saffron.",
        price: 160,
        veg: true,
        special: false,
        image: ""
      }
    ]
  },
  {
    id: "beverages",
    name: "Beverages",
    dishes: [
      {
        id: "beverages-masala-chaas",
        name: "Rajasthani Masala Chaas",
        description: "Chilled churned buttermilk spiced with roasted cumin, mint, and black salt.",
        price: 70,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "beverages-kesar-badam-lassi",
        name: "Kesar Badam Lassi",
        description: "Thick, creamy sweet yogurt drink blended with saffron strands and slivered almonds.",
        price: 110,
        veg: true,
        special: false,
        image: ""
      },
      {
        id: "beverages-fresh-lime-soda",
        name: "Fresh Lime Soda",
        description: "Refreshing sparkling lime drink served sweet, salted, or mixed with ice.",
        price: 80,
        veg: true,
        special: false,
        image: ""
      }
    ]
  }
];
