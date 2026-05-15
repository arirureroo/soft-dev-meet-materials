// DARK MODE
const darkModeBtn = document.querySelector('#dark-mode-btn');

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  darkModeBtn.textContent = isDarkMode ? 'Light' : 'Dark';
});

// CHALLENGE 1: UPGRADE THE FORM WITH fetch() POST
//
// What changed from Meet 2A:
//   1. The event listener callback is now `async` because required to use `await` inside it.
//   2. Before touching the DOM, we fire a fetch() POST to send the course data
//      to the MockAPI endpoint 'https://6a000e842b7ab34960300690.mockapi.io/softdev/course'.
//      The shape of request body:
//        {
//          name: //string
//          sks: //number
//          grade: //string
//        }
//   3. The submit button is disabled during the request so the user can't
//      submit twice while waiting for the server.
//   4. The DOM is only updated after the server confirms success (response.ok).
//   5. If the server fails, we show an error notification instead.
//   6. `finally` always re-enables the button, whether the request succeeded or not.
//   7. On page load, we fetch() GET all courses and render them into the list.
const addCourseForm = document.querySelector('#add-course-form');
const submitBtn = document.querySelector('#submit-btn');
const gradeList = document.querySelector('.grade-list');

async function loadCourses() {
  try {
    const response = await fetch('https://6a000e842b7ab34960300690.mockapi.io/softdev/course');

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const courses = await response.json();

    gradeList.innerHTML = '';
    courses.forEach((course) => {
      gradeList.appendChild(createCourseCard(course));
    });
  } catch (error) {
    console.error('Failed to load courses:', error);
    showNotification('Gagal memuat daftar mata kuliah.', 'error');
  }
}

addCourseForm.addEventListener('submit', async (event) => {
  // Stop the browser from reloading the page
  event.preventDefault();

  // Read the values from each form field
  const courseName = document.querySelector('#input-course-name').value.trim();
  const sks = document.querySelector('#input-sks').value;
  const grade = document.querySelector('#input-grade').value;

  if (!courseName) return;

  // Disable the button and show a loading label
  // This prevents the user from clicking submit again while the request is in flight
  submitBtn.disabled = true;
  submitBtn.textContent = 'Menyimpan...';

  try {
    // Send the course data to the server via POST
    // fetch() returns a Promise
    // await pauses this function until the server responds
    const response = await fetch('https://6a000e842b7ab34960300690.mockapi.io/softdev/course', {
      method: 'POST',
      headers: {
        // Tells the server that we're sending JSON
        'Content-Type': 'application/json',
      },
      // The request body must be a string
      // JSON.stringify converts the object into JSON-like string
      body: JSON.stringify({
        name: courseName,
        sks: Number(sks),
        grade,
      }),
    });

    // Check that the server actually accepted the request
    // fetch() does NOT throw on 4xx/5xx status codes
    // we must check manually
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Parse the server's JSON response
    // response.json() is also async
    // it reads and parses the response body
    const savedCourse = await response.json();

    // Log the server's confirmation to the console
    console.log('Server confirmed the save:', savedCourse);

    // Only update the DOM after the server says it's okay
    const newCard = createCourseCard(savedCourse);
    gradeList.appendChild(newCard);

    // Notify the user of success and reset the form
    const displayName = savedCourse.name || courseName;
    showNotification(`"${displayName}" berhasil ditambahkan!`);
    addCourseForm.reset();
  } catch (error) {
    // If anything went wrong (network failure or bad status),
    // show an error notification. The DOM is NOT updated.
    console.error('Failed to save course:', error);
    showNotification('Gagal menyimpan mata kuliah. Coba lagi.', 'error');
  } finally {
    // Re-enable the button no matter what happened
    // `finally` runs after try OR catch
    submitBtn.disabled = false;
    submitBtn.textContent = 'Tambahkan Mata Kuliah';
  }
});

loadCourses();

// CHALLENGE 2: RANDOM QUOTE FETCHER
//
// When the "Muat Kutipan" button is clicked:
//   1. The button is disabled and shows a loading label.
//   2. A fetch() GET is sent to the public quotes API.
//   3. The API response is parsed and the quote + author are rendered into the card.
//   4. If anything fails, a fallback error message is shown inside the card.
//   5. The button is always re-enabled in `finally`.
//
// API: https://api.quotable.kurokeita.dev/api/quotes/random
//
// Response shape:
// {
//   "quote": {
//     "id": "2aU1Mvmr4D",
//     "content": "You are important enough to ask and you are blessed enough to receive back.",
//     "tags": [
//       {
//         "id": "unDK8Rkf6F",
//         "name": "Famous Quotes"
//       }
//     ],
//     "author": {
//       "id": "Waw7SWVnlw",
//       "name": "Wayne Dyer",
//       "slug": "wayne-dyer",
//       "description": "American self-help author",
//       "bio": "Wayne Walter Dyer (May 10, 1940 - August 29, 2015) was an American self-help author and a motivational speaker. His first book, Your Erroneous Zones (1976), is one of the best-selling books of all time, with an estimated 100 million copies sold to date.",
//       "link": "https://en.wikipedia.org/wiki/Wayne_Dyer"
//     }
//   }
// }
const loadQuoteBtn = document.querySelector('#load-quote-btn');
const quoteText = document.querySelector('#quote-text');
const quoteAuthor = document.querySelector('#quote-author');

loadQuoteBtn.addEventListener('click', async () => {
  // Disable the button and show a loading state in the card
  loadQuoteBtn.disabled = true;
  loadQuoteBtn.textContent = 'Memuat...';

  quoteText.textContent = 'Memuat kutipan...';
  quoteText.classList.add('is-loading');
  quoteAuthor.textContent = '';

  try {
    // Send a GET request
    const response = await fetch('https://api.quotable.kurokeita.dev/api/quotes/random');

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // Parse the JSON response
    const result = await response.json();

    // Extract the quote and author from the response's `quote` field
    if (!result.quote || !result.quote.content) {
      throw new Error('Invalid quote response');
    }
    const text = result.quote.content;
    const author = result.quote.author ? result.quote.author.name : 'Anonim';

    // Render into the DOM
    quoteText.classList.remove('is-loading');
    quoteText.textContent = `"${text}"`;
    quoteAuthor.textContent = `— ${author}`;
  } catch (error) {
    // Show a user-friendly error message inside the card
    console.error('Failed to load quote:', error);
    quoteText.classList.remove('is-loading');
    quoteText.textContent = 'Gagal memuat kutipan. Periksa koneksi internetmu dan coba lagi.';
    quoteAuthor.textContent = '';
  } finally {
    // Re-enable the button and update its label
    loadQuoteBtn.disabled = false;
    loadQuoteBtn.textContent = 'Muat Kutipan Lagi';
  }
});

// HELPER FUNCTIONS

function createCourseCard(course) {
  const newCard = document.createElement('article');
  newCard.classList.add('grade-card');

  const badgeClass = getGradeBadgeClass(course.grade);

  newCard.innerHTML = `
    <div class="grade-badge ${badgeClass}">${course.grade}</div>
    <div class="grade-info">
      <h3>${course.name}</h3>
      <p>${course.sks} SKS</p>
    </div>
  `;

  return newCard;
}

// Maps a grade string to the correct CSS badge class.
function getGradeBadgeClass(grade) {
  if (grade === 'A') return 'grade-a';
  if (grade === 'A-') return 'grade-a-minus';
  if (grade === 'B+' || grade === 'B') return 'grade-b';
  return 'grade-c'; // C+, C, and anything else
}

// Creates a temporary toast notification at the top of the page.
// `type` is optional, pass 'error' to show a red notification.
function showNotification(message, type = 'success') {
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;

  // Apply the error modifier class if needed
  if (type === 'error') {
    notification.classList.add('notification--error');
  }

  document.body.prepend(notification);

  requestAnimationFrame(() => {
    notification.classList.add('notification--visible');
  });

  setTimeout(() => {
    notification.classList.remove('notification--visible');
    notification.addEventListener('transitionend', () => notification.remove());
  }, 3000);
}
