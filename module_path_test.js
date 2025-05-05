console.log("process.cwd():", process.cwd());
console.log("module.paths:", module.paths);
try {
    const pug = require('pug');
    console.log("Pug found:", pug);
} catch (error) {
    console.error("Error requiring pug:", error);
}