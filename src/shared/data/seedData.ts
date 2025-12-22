// src/shared/data/seedData.ts
export const seededRestaurants = [
  { id: "69381d150310d04a47d9cedb", name: "Mama's Kitchen", location: "Ikeja", img: "https://via.placeholder.com/600x300?text=Mama%27s+Kitchen", distance: "0.8km", rating: 4.6, avgPrice: 6.5 },
  { id: "69381d150310d04a47d9cedc", name: "Café Bella",    location: "VI",    img: "https://via.placeholder.com/600x300?text=Cafe+Bella",    distance: "1.2km", rating: 4.7, avgPrice: 8.0 },
];

export const seededMenuItems = [
  {
    id: "69381d160310d04a47d9cee1",
    restaurantId: "69381d150310d04a47d9cedb",
    title: "Jollof Rice & Chicken",
    price: 1200,
    img: "https://via.placeholder.com/500x500?text=Jollof+Rice",
    type: "food",
  },
  {
    id: "69381d160310d04a47d9cee2",
    restaurantId: "69381d150310d04a47d9cedb",
    title: "Fried Plantain (Dodo)",
    price: 400,
    img: "https://via.placeholder.com/500x500?text=Fried+Plantain",
    type: "snacks",
  },
  {
    id: "69381d160310d04a47d9cee3",
    restaurantId: "69381d150310d04a47d9cedc",
    title: "Latte (Medium)",
    price: 800,
    img: "https://via.placeholder.com/500x500?text=Latte",
    type: "drink",
  },
  {
    id: "69381d160310d04a47d9cee4",
    restaurantId: "69381d150310d04a47d9cedc",
    title: "Blueberry Muffin",
    price: 500,
    img: "https://via.placeholder.com/500x500?text=Muffin",
    type: "cake",
  },
];
