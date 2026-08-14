import bcrypt from "bcryptjs";

const password = process.argv[2];

if (!password) {
  console.error('Usage: npm run hash-password -- "votre_mot_de_passe"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
// Next.js interprète les "$" dans .env (expansion de variables) : on les échappe
// pour que le hash bcrypt soit stocké tel quel.
const escapedHash = hash.replace(/\$/g, "\\$");
console.log("\nAjoutez cette ligne à votre fichier .env :\n");
console.log(`ADMIN_PASSWORD_HASH="${escapedHash}"\n`);
