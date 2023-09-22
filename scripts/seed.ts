const {PrismaClient } = require("@prisma/client");

const database = new PrismaClient()

async function main() {
  try {
    await database.category.createMany({
      data: [
        {name: "Computer Science"},
        {name: "Accounting"},
        {name: "Music"},
        {name: "Fitness"},
        {name: "Photography"},
        {name: "Engineering"},
        {name: "Filming"},
      ]
    })

    console.log("Success seeding the database")
  } catch (error) {
    console.log("Error seeding the database", error);
  } finally {
    await database.$disconnect();
  }
}


main()
