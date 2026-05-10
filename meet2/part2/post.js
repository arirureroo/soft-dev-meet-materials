async function addStudent(name, gpa, semester) {
  const student = {
    name: name,
    gpa: Number(gpa),
    semester: Number(semester),
  };

  try {
    const response = await fetch(
      'https://6a000e842b7ab34960300690.mockapi.io/softdev/student',
      {
        // override the default method which is 'GET'
        method: 'POST',
        headers: {
          // tell the server what format we're sending
          'Content-Type': 'application/json',
        },
        // convert the object to a JSON string
        body: JSON.stringify(student),
      },
    );

    if (!response.ok)
      throw new Error(`Response status code: ${response.status}`);

    const savedStudent = await response.json();
    console.log(savedStudent);
  } catch (error) {
    console.error(error);
  }
}

addStudent('Bambang Tembang', 3.9, 4);
// {
//   createdAt: 1778412775,
//   name: 'Bambang Tembang',
//   gpa: 3.9,
//   semester: 4,
//   id: '2'
// }
