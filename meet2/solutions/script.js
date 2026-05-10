// CHALLENGE 1 — DARK MODE TOGGLE
// - Select the toggle button from the header
// - On click, toggle the class "dark-mode" on <body>
// - Change the button label to reflect the current state
const darkModeBtn = document.querySelector('#dark-mode-btn');

darkModeBtn.addEventListener('click', () => {
  // Toggle the "dark-mode" class on <body>
  document.body.classList.toggle('dark-mode');

  // Check the current state and update the button label accordingly
  const isDarkMode = document.body.classList.contains('dark-mode');
  darkModeBtn.textContent = isDarkMode ? 'Light' : 'Dark'; // using 'ternary operator'
});

// CHALLENGE 2 — ADD COURSE FORM
// - Listen for the form's submit event
// - Prevent the page from reloading (preventDefault)
// - Read each input value from the form
// - Build a new .grade-card element with DOM manipulation
// - Append it to .grade-list
// - Show a brief success notification
// - Reset the form back to empty
const addCourseForm = document.querySelector('#add-course-form');

addCourseForm.addEventListener('submit', (event) => {
  // Prevent the browser's default behavior (page reload)
  event.preventDefault();

  // Read the values from each form field
  const courseName = document.querySelector('#input-course-name').value.trim();
  const sks = document.querySelector('#input-sks').value;
  const grade = document.querySelector('#input-grade').value;

  // Basic guard: do nothing if the course name is empty
  if (!courseName) return;

  // Create the new grade card element
  const newCard = document.createElement('article');
  newCard.classList.add('grade-card');

  // Use a helper function to map the grade letter to a CSS class
  const badgeClass = getGradeBadgeClass(grade);

  // Use a template literal to set the card's inner HTML
  newCard.innerHTML = `
    <div class="grade-badge ${badgeClass}">${grade}</div>
    <div class="grade-info">
      <h3>${courseName}</h3>
      <p>${sks} SKS</p>
    </div>
  `;

  // Append the new card to the grade list
  const gradeList = document.querySelector('.grade-list');
  gradeList.appendChild(newCard);

  // Show a success notification
  showNotification(`"${courseName}" berhasil ditambahkan!`);

  // Reset the form so it's ready for the next entry
  addCourseForm.reset();
});

// HELPER FUNCTION

// Maps a grade string to the correct CSS badge class.
// This keeps the submit handler clean and readable.
function getGradeBadgeClass(grade) {
  if (grade === 'A') return 'grade-a';
  if (grade === 'A-') return 'grade-a-minus';
  if (grade === 'B+' || grade === 'B') return 'grade-b';
  return 'grade-c'; // C+, C, D, and anything else
}

// Creates a temporary notification bar at the top of the page,
// then automatically removes it after 3 seconds.
function showNotification(message) {
  // Create the notification element
  const notification = document.createElement('div');
  notification.classList.add('notification');
  notification.textContent = message;

  // Insert it at the very top of <body>
  document.body.prepend(notification);

  // Trigger the slide-in animation on the next frame
  // (The tiny delay lets the browser register the element before animating)
  requestAnimationFrame(() => {
    notification.classList.add('notification--visible');
  });

  // After 3 seconds, fade it out and then remove it from the DOM
  setTimeout(() => {
    notification.classList.remove('notification--visible');

    // Wait for the CSS transition to finish (300ms) before removing the node/object
    notification.addEventListener('transitionend', () => notification.remove());
  }, 3000);
}
