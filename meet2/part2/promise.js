// The data we want to get:
const _NAME = 'udin';
const _SEMESTER = 'genap2026';
const _GPA = 3.9;
const _COURSE = {
  name: 'statistic',
  credits: 3,
  grade: 'A',
};

// Instead of using callback into a function,
// use Promise as a ticket to be claimed later
// with `resolve` as the success value
// and `reject` as the error/failed value
function getStudentName() {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(_NAME), 1000);
  });
}

function getCurrentSemester(name) {
  return new Promise((resolve, reject) => {
    if (!name || name !== _NAME) reject('wrong student!');
    setTimeout(() => resolve(_SEMESTER), 1000);
  });
}

function getGPA(name, semester) {
  return new Promise((resolve, reject) => {
    if (!name || name !== _NAME || !semester || semester !== _SEMESTER)
      reject('wrong student or semester!');
    setTimeout(() => resolve(_GPA), 1000);
  });
}

function getCourseInfo(courseName) {
  return new Promise((resolve, reject) => {
    if (!courseName || courseName !== _COURSE.name) reject('wrong course!');
    setTimeout(() => resolve(_COURSE), 1000);
  });
}

// then, we can use a bit cleaner syntax than nested callback
// which is Promise chaining `.then`
// but still, it looks ugly and complicated
getStudentName()
  .then((response) => {
    const name = response;
    console.log(`Student name: ${name}`);
    return getCurrentSemester(name).then((response) => {
      // because we will need the 'name' later,
      // must finish the Promise of getCurrentSemester() here
      const semester = response;
      return [name, semester]; // hand over to the next `then`
    });
  })
  .then((response) => {
    const [name, semester] = response;
    console.log(`Student current semester: ${semester}`);
    return getGPA(name, semester); // hand over to the next `then`
  })
  .then((response) => {
    const gpa = response;
    console.log(`Student GPA: ${gpa}`); // end of chain
  })
  .catch((reason) => console.log(reason)); // catch any errors from the Promise chaining

getCourseInfo('statistic')
  .then((response) => console.log(response))
  .catch((reason) => console.log(reason));

// Student name: udin
// { name: 'statistic', credits: 3, grade: 'A' }
// Student current semester: genap2026
// Student GPA: 3.9
