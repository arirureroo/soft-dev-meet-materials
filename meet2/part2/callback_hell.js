// The data we want to get:
const _NAME = 'udin';
const _SEMESTER = 'genap2026';
const _GPA = 3.9;
const _COURSE = {
  name: 'statistic',
  credits: 3,
  grade: 'A',
};

function getStudentName(callback) {
  console.log('load student name...');
  setTimeout(() => callback(_NAME), 1000);
  console.log('getStudentName() exited!');
}

function getCurrentSemester(name, callback) {
  console.log('load student current semester...');
  if (!name || name !== _NAME) {
    console.log('wrong student!');
  } else {
    setTimeout(() => callback(_SEMESTER), 1000);
  }
  console.log('getCurrentSemester() exited!');
}

function getGPA(name, semester, callback) {
  console.log('load student GPA...');
  if (!name || name !== _NAME || !semester || semester !== _SEMESTER) {
    console.log('wrong student or semester!');
  } else {
    setTimeout(() => callback(_GPA), 1000);
  }
  console.log('getGPA() exited!');
}

function getCourseInfo(courseName, callback) {
  console.log('load course info...');
  if (!courseName || courseName !== _COURSE.name) {
    console.log('wrong course!');
  } else {
    setTimeout(() => callback(_COURSE), 1000);
  }
  console.log('getCourseInfo() exited!');
}

// This is callback hell (nested callback)
// looks ugly and weird af
getStudentName((response) => {
  const name = response;
  getCurrentSemester(name, (response) => {
    const semester = response;
    getGPA(name, semester, (response) => {
      const gpa = response;
      console.log(`${name}'s GPA for the semester of ${semester} is ${gpa}`);
    });
  });
});

getCourseInfo('statistic', (response) => console.log(response));

// load student name...
// getStudentName() exited!
// load course info...
// getCourseInfo() exited!
// load student current semester...
// getCurrentSemester() exited!
// { name: 'statistic', credits: 3, grade: 'A' }
// load student GPA...
// getGPA() exited!
// udin's GPA for the semester of genap2026 is 3.9
