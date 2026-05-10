const courses = [
  { name: 'Metodologi Penelitian', credits: 3, grade: 'A', score: 90 },
  { name: 'Sistem Klasifikasi Barang', credits: 2, grade: 'A', score: 92 },
  { name: 'Praktikum Sistem Klasifikasi', credits: 1, grade: 'A', score: 95 },
  { name: 'Jaringan Komputer', credits: 3, grade: 'B+', score: 78 },
  { name: 'Basis Data', credits: 3, grade: 'B', score: 74 },
];

// Mapping (do this for each item)
// let say we want to create a list of courses along with its credits

// manual
const courseCredits = [];
for (let i = 0; i < courses.length; i++) {
  const course = courses[i];
  courseCredits.push(`${course.name} (${course.credits} SKS)`);
}
console.log('Manual Mapping:');
console.log(courseCredits);

// using 'map' function
const courseCredits2 = courses.map((course) => `${course.name} (${course.credits} SKS)`);
console.log("\nUsing 'map' function:");
console.log(courseCredits2);

// Filter (only return item that pass the requirement)
// let say we want to know courses with an A grade

// manual
const coursesGradeA = [];
for (let i = 0; i < courses.length; i++) {
  const course = courses[i];
  if (course.grade !== 'A') {
    continue;
  }
  coursesGradeA.push(course);
}
console.log('\nManual Filtering:');
console.log(coursesGradeA);

// using 'filter' function
const coursesGradeA2 = courses.filter((c) => c.grade === 'A');
console.log("\nUsing 'filter' function:");
console.log(coursesGradeA2);

// Reduce (Collapse into single value)
// let say we want to know our GPA (IP semester ini berapa sih)
const gradeIndex = {};
gradeIndex['A'] = 4;
gradeIndex['B+'] = 3.3;
gradeIndex['B'] = 3;

// manual
let totalPoints = 0;
let totalCredits = 0;
for (let i = 0; i < courses.length; i++) {
  const course = courses[i];
  totalCredits += course.credits;
  totalPoints += gradeIndex[course.grade] * course.credits;
}
console.log('\nManual Reduce:');
console.log(totalPoints / totalCredits);

// Using 'reduce' function
const gpa = courses.reduce(
  (accumulator, currentCourse) => {
    accumulator.points += gradeIndex[currentCourse.grade] * currentCourse.credits;
    accumulator.credits += currentCourse.credits;
    return accumulator;
  },
  { points: 0, credits: 0 }, // initial value of accumulator
);
console.log("\nUsing 'reduce' function:");
console.log(gpa.points / gpa.credits);

// Chaining
// let say we want to know total credits for courses where we got an A
const totalCreditsA = courses
  .filter((course) => course.grade === 'A')
  .reduce((acc, course) => acc + course.credits, 0);
console.log('\nTotal Credits:', totalCreditsA);
