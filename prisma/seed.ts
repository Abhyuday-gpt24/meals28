import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const categories = [
  { name: "Snacks", description: "Savory bites and light eats" },
  { name: "Chinese", description: "Indo-Chinese favorites" },
  { name: "Tawa Parathas", description: "Fresh parathas from the tawa" },
  { name: "South Indian", description: "Dosas, idli, and more" },
  { name: "Curries & Sabji", description: "Rich gravies and dry sabji" },
  { name: "Thali", description: "Complete meal combos" },
  { name: "Sandwiches & Burgers", description: "Quick bites and burgers" },
  { name: "Pasta & Soups", description: "Italian-inspired comfort food" },
  { name: "Drinks", description: "Shakes, tea, and coffee" },
];

const menuItems: {
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  isVegetarian: boolean;
  description?: string;
}[] = [
  // === Snacks ===
  { name: "2 Pav with Bhaji", price: 120, category: "Snacks", imageUrl: "https://meals28.com/wp-content/uploads/2026/03/Pav-Bhaji-300x300.png", isVegetarian: true },
  { name: "Vada Pav (2 Pcs)", price: 120, category: "Snacks", imageUrl: "https://meals28.com/wp-content/uploads/2026/03/vada-pav-300x300.png", isVegetarian: true },
  { name: "Bread Pakoda (2 Pcs)", price: 99, category: "Snacks", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/b-pakoda-300x300.png", isVegetarian: true },
  { name: "Bread Rolls (3 Pcs)", price: 99, category: "Snacks", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/b-rolls-300x300.png", isVegetarian: true },
  { name: "Masala Macroni", price: 120, category: "Snacks", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/masala-macroni-300x300.png", isVegetarian: true },

  // === Chinese ===
  { name: "Chilli Potato", price: 120, category: "Chinese", imageUrl: "https://meals28.com/wp-content/uploads/2026/03/chilli-potato-300x300.png", isVegetarian: true },
  { name: "Chinese Fried Rice", price: 120, category: "Chinese", imageUrl: "https://meals28.com/wp-content/uploads/2026/03/c-f-rice-300x300.png", isVegetarian: true },
  { name: "Chowmein", price: 99, category: "Chinese", imageUrl: "https://meals28.com/wp-content/uploads/2026/03/chowmein-300x300.png", isVegetarian: true },
  { name: "Hakka Noodles", price: 150, category: "Chinese", imageUrl: "https://meals28.com/wp-content/uploads/2026/03/Veg-Singapori-Noodles-300x300.png", isVegetarian: true },
  { name: "Honey Chilli Potato", price: 140, category: "Chinese", imageUrl: "https://meals28.com/wp-content/uploads/2026/03/honey-chilli-potato-300x300.png", isVegetarian: true },
  { name: "Veg Noodles", price: 120, category: "Chinese", imageUrl: "https://meals28.com/wp-content/uploads/2026/03/chowmein-300x300.png", isVegetarian: true },

  // === Tawa Parathas ===
  { name: "Butter Tawa Roti", price: 15, category: "Tawa Parathas", imageUrl: "https://meals28.com/wp-content/uploads/2026/02/roti-300x300.png", isVegetarian: true },
  { name: "Aloo Paratha", price: 50, category: "Tawa Parathas", imageUrl: "https://meals28.com/wp-content/uploads/2026/02/roti-300x300.png", isVegetarian: true },
  { name: "Paneer Paratha", price: 70, category: "Tawa Parathas", imageUrl: "https://meals28.com/wp-content/uploads/2026/02/roti-300x300.png", isVegetarian: true },
  { name: "Gobi Paratha", price: 50, category: "Tawa Parathas", imageUrl: "https://meals28.com/wp-content/uploads/2026/02/roti-300x300.png", isVegetarian: true },
  { name: "Mix Paratha", price: 60, category: "Tawa Parathas", imageUrl: "https://meals28.com/wp-content/uploads/2026/02/roti-300x300.png", isVegetarian: true },
  { name: "Plain Tawa Roti", price: 10, category: "Tawa Parathas", imageUrl: "https://meals28.com/wp-content/uploads/2026/02/roti-300x300.png", isVegetarian: true },

  // === South Indian ===
  { name: "Paper Dosa", price: 70, category: "South Indian", imageUrl: "https://meals28.com/wp-content/uploads/2025/11/Paper-Dosa-300x300.png", isVegetarian: true },
  { name: "Idli Sambar (4 Pcs)", price: 99, category: "South Indian", imageUrl: "https://meals28.com/wp-content/uploads/2025/11/Idli-Sambar-300x300.png", isVegetarian: true },
  { name: "Masala Dosa", price: 99, category: "South Indian", imageUrl: "https://meals28.com/wp-content/uploads/2025/11/Masala-Dosa-300x300.png", isVegetarian: true },
  { name: "Paneer Masala Dosa", price: 120, category: "South Indian", imageUrl: "https://meals28.com/wp-content/uploads/2025/11/Paneer-Masala-Dosa-300x300.png", isVegetarian: true },
  { name: "Full Paneer Dosa", price: 140, category: "South Indian", imageUrl: "https://meals28.com/wp-content/uploads/2025/11/Whole-Paneer-Dosa-e1767973930799-300x300.png", isVegetarian: true },
  { name: "Schezwan Masala Dosa", price: 120, category: "South Indian", imageUrl: "https://meals28.com/wp-content/uploads/2025/11/Schezwan-Masala-Dosa-300x300.png", isVegetarian: true },

  // === Curries & Sabji ===
  { name: "Butter Paneer Masala", price: 140, category: "Curries & Sabji", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/butter-paneer-masala-300x300.png", isVegetarian: true },
  { name: "Dal Fry", price: 70, category: "Curries & Sabji", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/dal-fry-300x300.png", isVegetarian: true },
  { name: "Kadhayi Paneer", price: 120, category: "Curries & Sabji", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/Kadhayi-Paneer-300x300.png", isVegetarian: true },
  { name: "Matar Mushroom", price: 130, category: "Curries & Sabji", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/matar-mushroom-300x300.png", isVegetarian: true },
  { name: "Mushroom Do Pyaza", price: 120, category: "Curries & Sabji", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/mushroom-do-pyaza-300x300.png", isVegetarian: true },
  { name: "Palak Paneer", price: 120, category: "Curries & Sabji", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/butter-paneer-masala-300x300.png", isVegetarian: true },
  { name: "Shahi Paneer", price: 140, category: "Curries & Sabji", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/butter-paneer-masala-300x300.png", isVegetarian: true },
  { name: "Mix Veg", price: 100, category: "Curries & Sabji", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/matar-mushroom-300x300.png", isVegetarian: true },

  // === Thali ===
  { name: "Paneer Thali", price: 199, category: "Thali", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/butter-paneer-masala-300x300.png", isVegetarian: true, description: "Paneer sabji, dal, rice, 3 roti, salad, papad" },
  { name: "Special Thali", price: 249, category: "Thali", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/Kadhayi-Paneer-300x300.png", isVegetarian: true, description: "2 sabji, dal, rice, 4 roti, raita, papad, sweet" },
  { name: "Mini Thali", price: 149, category: "Thali", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/dal-fry-300x300.png", isVegetarian: true, description: "1 sabji, dal, rice, 2 roti, salad" },

  // === Sandwiches & Burgers ===
  { name: "Aloo Sandwich (4 Pcs)", price: 99, category: "Sandwiches & Burgers", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/a-sandwich-300x300.png", isVegetarian: true },
  { name: "Coleslaw Sandwich (2 Pcs)", price: 99, category: "Sandwiches & Burgers", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/col-sandwich-300x300.png", isVegetarian: true },
  { name: "Club Sandwich (2 Pcs)", price: 99, category: "Sandwiches & Burgers", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/ChatGPT-Image-Jan-2-2026-12_23_06-PM-300x300.png", isVegetarian: true },

  // === Pasta & Soups ===
  { name: "White Sauce Pasta (Penne)", price: 140, category: "Pasta & Soups", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/white-sauce-pasta-300x300.png", isVegetarian: true },
  { name: "Masala Macroni", price: 120, category: "Pasta & Soups", imageUrl: "https://meals28.com/wp-content/uploads/2026/01/masala-macroni-300x300.png", isVegetarian: true },

  // === Drinks ===
  { name: "Banana Shake (350ml)", price: 99, category: "Drinks", imageUrl: "https://meals28.com/wp-content/uploads/2026/02/b-shake2-300x300.png", isVegetarian: true },
  { name: "KitKat Shake (350ml)", price: 120, category: "Drinks", imageUrl: "https://meals28.com/wp-content/uploads/2026/02/kitkat-shake-300x300.png", isVegetarian: true },
  { name: "Oreo Shake (350ml)", price: 120, category: "Drinks", imageUrl: "https://meals28.com/wp-content/uploads/2026/02/oreo-shake-300x300.png", isVegetarian: true },
  { name: "Masala Tea / Chai (300ml)", price: 60, category: "Drinks", imageUrl: "https://meals28.com/wp-content/uploads/2025/11/Masala-Tea-or-Chai-e1767975737516-300x300.png", isVegetarian: true },
  { name: "Hot Coffee (300ml)", price: 80, category: "Drinks", imageUrl: "https://meals28.com/wp-content/uploads/2025/11/Hot-Coffee-300x300.png", isVegetarian: true },
];

async function main() {
  console.log("Cleaning all tables...");

  // Delete in order respecting foreign keys
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.appSettings.deleteMany();

  console.log("All tables cleaned.");

  // Seed app settings
  await prisma.appSettings.create({
    data: { id: "app-settings", deliveryFee: 40 },
  });
  console.log("App settings created.");

  // Create categories
  const categoryMap = new Map<string, string>();
  for (const cat of categories) {
    const created = await prisma.category.create({ data: cat });
    categoryMap.set(cat.name, created.id);
    console.log(`Category: ${cat.name}`);
  }

  // Create menu items
  // Remove duplicates (Masala Macroni appears in both Snacks and Pasta)
  const seenNames = new Set<string>();
  for (const item of menuItems) {
    if (seenNames.has(item.name)) continue;
    seenNames.add(item.name);

    const categoryId = categoryMap.get(item.category);
    await prisma.menuItem.create({
      data: {
        name: item.name,
        price: item.price,
        imageUrl: item.imageUrl,
        isVegetarian: item.isVegetarian,
        isAvailable: true,
        description: item.description || null,
        categoryId: categoryId || null,
      },
    });
    console.log(`  Item: ${item.name} — ₹${item.price}`);
  }

  console.log(`\nDone! Seeded ${categories.length} categories and ${seenNames.size} menu items.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
