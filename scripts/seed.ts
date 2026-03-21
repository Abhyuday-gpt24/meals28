import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

async function main() {
  const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
  const prisma = new PrismaClient({ adapter });

  // --- Categories ---
  const categories = await Promise.all(
    [
      { name: "Starters", description: "Appetizers and small bites" },
      { name: "Main Course", description: "Rice, curries, and gravies" },
      { name: "Breads", description: "Naan, roti, and parathas" },
      { name: "Beverages", description: "Hot and cold drinks" },
      { name: "Desserts", description: "Sweet treats to end your meal" },
    ].map((c) =>
      prisma.category.upsert({
        where: { name: c.name },
        update: {},
        create: c,
      })
    )
  );

  const cat = Object.fromEntries(categories.map((c) => [c.name, c.id]));

  // --- Menu Items ---
  const items = [
    // Starters
    { name: "Paneer Tikka", price: 249, isVegetarian: true, categoryId: cat["Starters"], description: "Marinated cottage cheese grilled in tandoor" },
    { name: "Chicken Seekh Kebab", price: 299, isVegetarian: false, categoryId: cat["Starters"], description: "Minced chicken skewers with spices" },
    { name: "Samosa (2 pcs)", price: 99, isVegetarian: true, categoryId: cat["Starters"], description: "Crispy pastry filled with spiced potatoes" },
    { name: "Fish Amritsari", price: 349, isVegetarian: false, categoryId: cat["Starters"], description: "Batter-fried fish with ajwain and spices" },

    // Main Course
    { name: "Dal Makhani", price: 229, isVegetarian: true, categoryId: cat["Main Course"], description: "Slow-cooked black lentils in creamy gravy" },
    { name: "Butter Chicken", price: 319, isVegetarian: false, categoryId: cat["Main Course"], description: "Tandoori chicken in rich tomato-butter sauce" },
    { name: "Palak Paneer", price: 249, isVegetarian: true, categoryId: cat["Main Course"], description: "Cottage cheese cubes in spinach gravy" },
    { name: "Chicken Biryani", price: 299, isVegetarian: false, categoryId: cat["Main Course"], description: "Fragrant basmati rice layered with spiced chicken" },
    { name: "Veg Biryani", price: 249, isVegetarian: true, categoryId: cat["Main Course"], description: "Aromatic rice with mixed vegetables" },
    { name: "Mutton Rogan Josh", price: 399, isVegetarian: false, categoryId: cat["Main Course"], description: "Kashmiri-style slow-cooked mutton curry" },

    // Breads
    { name: "Butter Naan", price: 59, isVegetarian: true, categoryId: cat["Breads"], description: "Soft leavened bread brushed with butter" },
    { name: "Garlic Naan", price: 69, isVegetarian: true, categoryId: cat["Breads"], description: "Naan topped with garlic and coriander" },
    { name: "Laccha Paratha", price: 69, isVegetarian: true, categoryId: cat["Breads"], description: "Flaky layered whole wheat bread" },
    { name: "Tandoori Roti", price: 39, isVegetarian: true, categoryId: cat["Breads"], description: "Whole wheat bread baked in tandoor" },

    // Beverages
    { name: "Masala Chai", price: 49, isVegetarian: true, categoryId: cat["Beverages"], description: "Spiced Indian tea with milk" },
    { name: "Mango Lassi", price: 99, isVegetarian: true, categoryId: cat["Beverages"], description: "Chilled yogurt drink with mango pulp" },
    { name: "Sweet Lime Soda", price: 79, isVegetarian: true, categoryId: cat["Beverages"], description: "Fresh lime with soda and sugar" },

    // Desserts
    { name: "Gulab Jamun (2 pcs)", price: 99, isVegetarian: true, categoryId: cat["Desserts"], description: "Deep-fried milk dumplings in sugar syrup" },
    { name: "Rasmalai", price: 129, isVegetarian: true, categoryId: cat["Desserts"], description: "Soft paneer discs in saffron milk" },
    { name: "Kulfi", price: 89, isVegetarian: true, categoryId: cat["Desserts"], description: "Traditional Indian frozen dessert" },
  ];

  for (const item of items) {
    const exists = await prisma.menuItem.findFirst({ where: { name: item.name } });
    if (!exists) {
      await prisma.menuItem.create({ data: item });
    }
  }

  const count = await prisma.menuItem.count();
  console.log(`Seeded ${categories.length} categories and ${count} menu items.`);

  await prisma.$disconnect();
}

main();
