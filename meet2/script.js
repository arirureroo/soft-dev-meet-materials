// CHALLENGE 1 — DARK MODE TOGGLE
// - Select the toggle button from the header
// - On click, toggle the class "dark-mode" on <body>
// - Change the button label to reflect the current state

// CHALLENGE 2 — ADD COURSE FORM
// - Listen for the form's submit event
// - Prevent the page from reloading (preventDefault)
// - Read each input value from the form
// - Build a new .grade-card element with DOM manipulation
// - Append it to .grade-list
// - Show a brief success notification
// - Reset the form back to empty

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
