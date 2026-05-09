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

// Combine all information in dashboard asynchronously
// using `async` and `await`
async function studentDashboard() {
  console.time('execution1');

  // `await` means wait until called function (e.g. getStudentName()) finish
  const name = await getStudentName();
  const semester = await getCurrentSemester(name);
  const gpa = await getGPA(name, semester);
  console.log(`${name}'s GPA for the semester of ${semester} is ${gpa}`);

  const course = await getCourseInfo('statistic');
  console.log(`Course name: ${course.name}
Course credits: ${course.credits}
Course grade: ${course.grade}`);

  console.timeEnd('execution1');
}
await studentDashboard();
// udin's GPA for the semester of genap2026 is 3.9
// Course name: statistic
// Course credits: 3
// Course grade: A
// execution1: 4.033s

async function studentDashboard2() {
  console.time('execution2');

  const name = await getStudentName();
  const semester = await getCurrentSemester(name);

  // Since the getGPA() and getCourseInfo()
  // are independent of each other,
  // there is no need to wait for one another

  // they can run in parallel, which saves time (main goal)
  const [gpa, course] = await Promise.all([
    getGPA(name, semester),
    getCourseInfo('statistic'),
  ]);

  console.log(`${name}'s GPA for the semester of ${semester} is ${gpa}`);
  console.log(`Course name: ${course.name}
Course credits: ${course.credits}
Course grade: ${course.grade}`);

  console.timeEnd('execution2');
}
await studentDashboard2();
// udin's GPA for the semester of genap2026 is 3.9
// Course name: statistic
// Course credits: 3
// Course grade: A
// execution2: 3.004s
