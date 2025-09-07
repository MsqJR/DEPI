$(document).ready(function () {
  const usersAPI = "https://jsonplaceholder.typicode.com/users";
  const postsAPI = "https://jsonplaceholder.typicode.com/posts";
  const commentsAPI = "https://jsonplaceholder.typicode.com/comments";

  showLoader();

  // --- Helpers for localStorage ---
  function getLocalPosts() {
    return JSON.parse(localStorage.getItem("localPosts")) || [];
  }

  function getLocalUsers() {
    return JSON.parse(localStorage.getItem("localUsers")) || [];
  }

  function getLocalComments() {
    return JSON.parse(localStorage.getItem("localComments")) || [];
  }

  // --- Fetch Data from APIs ---
  $.when(
    $.get(usersAPI),
    $.get(postsAPI),
    $.get(commentsAPI)
  ).done(function (usersRes, postsRes, commentsRes) {
    const users = usersRes[0];
    const posts = postsRes[0];
    const comments = commentsRes[0];

    // Merge with localStorage
    const totalUsers = users.length + getLocalUsers().length;
    const totalPosts = posts.length + getLocalPosts().length;
    const totalComments = comments.length + getLocalComments().length;

    // Update Dashboard
    $("#usersCount").text(totalUsers);
    $("#postsCount").text(totalPosts);
    $("#commentsCount").text(totalComments);

    hideLoader();
  }).fail(function () {
    toastr.error("Failed to fetch dashboard data");
    hideLoader();
  });
});

