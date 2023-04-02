console.log("script added!");

// Add click event listener to sidebar links
document.querySelectorAll(".sidebar-link").forEach(function (link) {
  link.addEventListener("click", function (event) {
    console.log("link clicked!");
    event.preventDefault(); // Prevent default page navigation behavior
    var url = this.href; // Get link URL

    loadContent(url); // Load new content
    updateSidebar(url);
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

function loadContent(url) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      // Create a temporary div element
      var tempDiv = document.createElement("div");
      // Set the response text as innerHTML
      tempDiv.innerHTML = xhr.responseText;
      // Get the page-content div's children
      var pageContentChildren = tempDiv.querySelector("#page-content").children;
      console.log(pageContentChildren);
      // Replace page content with loaded HTML data
      document.querySelector("#page-content").innerHTML = "";
      var forloops = pageContentChildren.length;
      for (var i = 0; i < forloops; i++) {
        console.log(pageContentChildren);
        console.log(pageContentChildren[0]);
        console.log(i);
        document
          .querySelector("#page-content")
          .appendChild(pageContentChildren[0]);
      }
      // Add page data to browser history
      history.pushState({}, "", url);
      // Update sidebar link highlighting
      // removeSidebar(); // Remove previous sidebar
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
