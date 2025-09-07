$(document).ready(function () {
  const postsTable = $("#postsTable").DataTable({
    pageLength: 10,
    lengthMenu: [5, 10, 25, 50],
    order: [[3, "desc"]], 
    columns: [
      { title: "Title" },
      { title: "Body" },
      { title: "Actions", orderable: false },
      { title: "id", visible: false, searchable: false } 
    ]
  });

  const apiURL = "https://jsonplaceholder.typicode.com/posts";

  showLoader();

  const localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];
  localPosts.forEach((p) => addPostRow(p));

  $.get(apiURL, function (data) {
    data.forEach((post) => addPostRow(post));
    hideLoader();
  });

  function addPostRow(post) {
    postsTable.row.add([
      post.title,
      post.body,
      `
      <button class="btn btn-sm btn-primary edit-post" data-id="${post.id}">Edit</button>
      <button class="btn btn-sm btn-danger delete-post" data-id="${post.id}">Delete</button>
      <button class="btn btn-sm btn-info view-comments" data-id="${post.id}">Comments</button>
      `,
      post.id 
    ]).draw(false);
  }

  $(document).on("click", ".delete-post", function () {
    const id = parseInt($(this).data("id"));

    postsTable.row($(this).parents("tr")).remove().draw();

    let localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];
    localPosts = localPosts.filter((p) => p.id !== id);
    localStorage.setItem("localPosts", JSON.stringify(localPosts));

    toastr.warning("Post deleted locally");
  });

  let editingRow = null;
  $(document).on("click", ".edit-post", function () {
    editingRow = $(this).closest("tr");
    const rowData = postsTable.row(editingRow).data();

    $("#postTitle").val(rowData[0]);
    $("#postBody").val(rowData[1]);

    $("#addPostModalLabel").text("Edit Post");
    $("#addPostModal").modal("show");
  });

  $("#addPostForm").submit(function (e) {
    e.preventDefault();
    const title = $("#postTitle").val();
    const body = $("#postBody").val();

    if (editingRow) {
      const rowData = postsTable.row(editingRow).data();
      const id = rowData[3]; 

      postsTable.row(editingRow).data([
        title,
        body,
        `
        <button class="btn btn-sm btn-primary edit-post" data-id="${id}">Edit</button>
        <button class="btn btn-sm btn-danger delete-post" data-id="${id}">Delete</button>
        <button class="btn btn-sm btn-info view-comments" data-id="${id}">Comments</button>
        `,
        id
      ]).draw(false);

      let localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];
      localPosts = localPosts.map((p) =>
        p.id === id ? { ...p, title, body } : p
      );
      localStorage.setItem("localPosts", JSON.stringify(localPosts));

      toastr.success("Post updated locally");
      editingRow = null;
    } else {
      const allData = postsTable.rows().data().toArray();
      const maxId = allData.length
        ? Math.max(...allData.map((r) => parseInt(r[3])))
        : 0;

      const newPost = { id: maxId + 1, title, body };

      addPostRow(newPost);

      let localPosts = JSON.parse(localStorage.getItem("localPosts")) || [];
      localPosts.push(newPost);
      localStorage.setItem("localPosts", JSON.stringify(localPosts));

      toastr.success("Post added locally");
    }

    $("#addPostModal").modal("hide");
    this.reset();
    $("#addPostModalLabel").text("Add Post");
  });

  $(document).on("click", ".view-comments", function () {
    const id = $(this).data("id");
    $("#commentsList").empty();
    showLoader();

    $.get(`https://jsonplaceholder.typicode.com/comments?postId=${id}`, function (comments) {
      comments.forEach((c) => {
        $("#commentsList").append(
          `<li class="list-group-item"><strong>${c.name}</strong> (${c.email}): ${c.body}</li>`
        );
      });
      hideLoader();
      $("#commentsModal").modal("show");
    });
  });
});
