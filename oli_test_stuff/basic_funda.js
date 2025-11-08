// 1. Variables and Data Types
let message = "Hello, JavaScript!"; // String
const year = 2025; // Number
let isActive = true; // Boolean
let undefinedVar; // Undefined
let nullVar = null; // Null (intentional absence of value)

console.log("Message:", message);
console.log("Year:", year);
console.log("Is Active:", isActive);
console.log("Undefined Variable:", undefinedVar);
console.log("Null Variable:", nullVar);

// 2. Operators
let a = 10;
let b = 5;

console.log("Addition:", a + b); // Arithmetic
console.log("Equality:", a === b); // Comparison
console.log("Logical AND:", isActive && (year > 2000)); // Logical

// 3. Conditional Statements
if (year > 2020) {
    console.log("It's a recent year.");
} else if (year === 2020) {
    console.log("It's the year 2020.");
} else {
    console.log("It's an older year.");
}

// 4. Loops
console.log("--- For Loop ---");
for (let i = 0; i < 3; i++) {
    console.log("Loop iteration:", i);
}

console.log("--- While Loop ---");
let count = 0;
while (count < 2) {
    console.log("While count:", count);
    count++;
}

// 5. Functions
function greet(name) {
    return "Hello, " + name + "!";
}

console.log(greet("Alice"));

// Arrow function (modern syntax)
const multiply = (x, y) => x * y;
console.log("Multiplication:", multiply(4, 6));

// 6. Arrays
const fruits = ["Apple", "Banana", "Cherry"];
console.log("Fruits:", fruits);
console.log("First fruit:", fruits[0]);
fruits.push("Date"); // Add element
console.log("Fruits after push:", fruits);

// 7. Objects
const person = {
    firstName: "John",
    lastName: "Doe",
    age: 30,
    occupation: "Developer"
};

console.log("Person:", person);
console.log("Person's first name:", person.firstName);
console.log("Person's age:", person["age"]);