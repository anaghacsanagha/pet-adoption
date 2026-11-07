
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "server", "db.json");

const db = JSON.parse(fs.readFileSync(dbPath, "utf8"));

const ownerNames = [
  "Akhil Nair", "Meera Krishnan", "Arjun Menon",
  "Diya Joseph", "Rahul Das", "Sneha Raj",
  "Nikhil Kumar", "Anjali Mohan", "Vishnu S",
  "Neha Thomas", "Adithya P", "Kavya R",
  "Rohan Mathew", "Amala K", "Sanjay Nair",
  "Devika Menon", "Abhinav Raj", "Parvathy S",
  "Kiran Das", "Aparna Mohan", "Hari Krishnan",
  "Lakshmi Nair", "Joel Thomas", "Athira P",
  "Gokul Menon"
];

// Remove previously generated owner accounts before recreating.
// Anagha's original account is preserved.
db.users = db.users.filter(
  (user) => !String(user.id).startsWith("pet-owner-")
);

db.pets.forEach((pet, index) => {
  const number = index + 1;
  const ownerId = `pet-owner-${number}`;

  const owner = {
    id: ownerId,
    name: ownerNames[index],
    email: `petowner${number}@gmail.com`,
    phone: `90000000${String(number).padStart(2, "0")}`,
    password: "owner123"
  };

  db.users.push(owner);

  pet.ownerId = ownerId;
  pet.ownerName = owner.name;
});

fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

console.log("25 owner accounts created successfully!");
console.log("All 25 pets assigned to separate owners.");
