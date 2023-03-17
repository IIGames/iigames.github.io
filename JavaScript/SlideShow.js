// Get the slideshow element
var slideshow = document.querySelector(".slideshow");

// Get all the images inside the slideshow
var images = slideshow.querySelectorAll("img.slideshow-img");

// Get the prev and next buttons
var prev = document.getElementById("prev");
var next = document.getElementById("next");

// Set a variable to keep track of the current image index
var current = 0;

// Add a click event listener to the prev button
prev.addEventListener("click", function () {
  // Remove the active class from the current image
  images[current].classList.remove("active");

  // Decrease the current index by one
  current--;

  // If the current index is less than zero, wrap it around to the last image index
  if (current < 0) {
    current = images.length - 1;
  }

  // Add the active class to the new current image
  images[current].classList.add("active");
});

// Add a click event listener to the next button
next.addEventListener("click", function () {
  // Remove the active class from the current image
  images[current].classList.remove("active");

  // Increase the current index by one
  current++;

  // If the current index is greater than or equal to the number of images, wrap it around to zero
  if (current >= images.length) {
    current = 0;
  }

  // Add the active class to the new current image
  images[current].classList.add("active");
});
