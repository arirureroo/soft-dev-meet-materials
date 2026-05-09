// The data we want to get:
const _NAME = 'udin';
const _SEMESTER = 'genap2026';
const _GPA = 3.9;
const _COURSE = {
  name: 'statistic',
  credits: 3,
  grade: 'A',
};

function getStudentName() {
  return _NAME;
}

function getCurrentSemester(name) {
  if (name === _NAME) return _SEMESTER;
  console.log('wrong student!');
}

function getGPA(name, semester) {
  if (name === _NAME && semester === _SEMESTER) return _GPA;
  console.log('wrong student or semester!');
}

function getCourseInfo(courseName) {
  if (courseName === _COURSE.name) return _COURSE;
  console.log('wrong course!');
}

const studentName = getStudentName();
console.log(`Student name: ${studentName}`);

const semester = getCurrentSemester(studentName);
console.log(`Student current semester: ${semester}`);

const studentGPA = getGPA(studentName, semester);
console.log(`Student GPA: ${studentGPA}`);

const course = getCourseInfo('statistic');
console.log(`Course name: ${course.name}
Course credits: ${course.credits}
Course grade: ${course.grade}`);

// Student name: udin
// Student current semester: genap2026
// Student GPA: 3.9
// Course name: statistic
// Course credits: 3
// Course grade: A
