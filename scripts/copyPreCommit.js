import fs from "fs/promises";

console.log("Starting Copy");
const script = await fs.readFile("scripts/pre-commit");
await fs.writeFile(".git/hooks/pre-commit", script);
console.log("Copy Successful");
