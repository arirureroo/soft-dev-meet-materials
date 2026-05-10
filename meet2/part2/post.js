async function submitCourse(courseName, credits, grade) {
  const newCourse = {
    name: courseName,
    sks: Number(credits),
    grade: grade,
  };

  try {
    const response = await fetch(
      'https://6a000e842b7ab34960300690.mockapi.io/softdev/course',
      {
        // override the default method which is 'GET'
        method: 'POST',
        headers: {
          // tell the server what format we're sending
          'Content-Type': 'application/json',
        },
        // convert the object to a JSON string
        body: JSON.stringify(newCourse),
      },
    );

    if (!response.ok)
      throw new Error(`Response status code: ${response.status}`);

    const savedCourse = await response.json();
    console.log(savedCourse);
  } catch (error) {
    console.error(error);
  }
}

submitCourse('Teknis Kepabeanan dan Cukai', 2, 'A');
// {
//   createdAt: 1778389428,
//   name: 'Teknis Kepabeanan dan Cukai',
//   sks: 2,
//   grade: 'A',
//   id: '5'
// }
