// Add click event listener to sidebar links
document.querySelectorAll("sidebar-link").forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default page navigation behavior
    var url = this.href; // Get link URL
    loadContent(url);
  });
});

// Add click event listener to other links
document.querySelectorAll("link").forEach(function (link) {
  link.addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default page navigation behavior
    var url = this.href; // Get link URL
    loadContent(url);
  });
});

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
      updateSidebar(url);
    }
  };
  xhr.open("GET", url, true);
  xhr.send();
}

// Update sidebar link highlighting based on current URL
function updateSidebar(url) {
  document.querySelectorAll("sidebar-link").forEach(function (link) {
    link.classList.remove("active");
  });
  document.querySelector(`sidebar-link[href="${url}"]`).classList.add("active");
}
