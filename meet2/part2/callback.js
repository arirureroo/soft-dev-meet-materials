// The data we want to get:
const _NAME = 'udin';

console.log('loading the page...');

function getStudentName() {
  // In reality,
  // getting data from database is time consumed.
  // Let say 1 second (1000 miliseconds)
  setTimeout(() => _NAME, 1000);
}

const name = getStudentName();
console.log(`Welcome, ${name}!`);

console.log('rendering the rest page...');
// OUTPUT:
// loading the page...
// Welcome, undefined!
// rendering the rest page...

console.log('\n=============================\n');

// SOLUTION:
// ASYNCHRONOUS
// using CALLBACK (function that will call later)
console.log('loading the page...');

// adding one parameter named 'callback'
// as a function with 'name' as its parameter
function getStudentName2(callback) {
  setTimeout(() => callback(_NAME), 1000);
}

getStudentName2((name) => console.log(`Welcome, ${name}!`));

console.log('rendering the rest page...');
// OUTPUT:
// loading the page...
// rendering the rest page...
// Welcome, udin!
