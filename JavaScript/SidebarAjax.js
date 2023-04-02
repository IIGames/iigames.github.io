console.log("script added!");

// Add click event listener to sidebar links
document.querySelectorAll(".sidebar-link").forEach(function (link) {
  link.addEventListener("click", function (event) {
    console.log("link clicked!");
    event.preventDefault(); // Prevent default page navigation behavior
    var url = this.href; // Get link URL

    loadContent(url); // Load new content
  });
});

// Add click event listener to other links
document.querySelectorAll(".link").forEach(function (link) {
  link.addEventListener("click", function (event) {
    console.log("link clicked!");
    event.preventDefault(); // Prevent default page navigation behavior
    var url = this.href; // Get link URL
    loadContent(url);
  });
});

// Remove previous sidebar
function removeSidebar() {
  var sidebar = document.querySelector(".sidebar");
  if (sidebar) {
    sidebar.parentNode.removeChild(sidebar);
  }
}

// Load page content via AJAX
function loadContent(url) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Replace page content with loaded HTML data
      document.querySelector("#page-content").innerHTML = xhr.responseText;
      // Add page data to browser history
      history.pushState({}, "", url);
      // Update sidebar link highlighting
      removeSidebar(); // Remove previous sidebar
      updateSidebar(url);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

// Update sidebar link highlighting based on current URL
function updateSidebar(url) {
  console.log("handling active class");
  document.querySelectorAll(".sidebar-link").forEach(function (link) {
    link.classList.remove("active");
  });
  document
    .querySelector(`.sidebar-link[href="${url}"]`)
    .classList.add("active");
  console.log(`href shall be ${url}`);
}
