$(document).ready(function () {
  const usersTable = $("#usersTable").DataTable();
  const apiURL = "https://jsonplaceholder.typicode.com/users";

  showLoader();

  $.get(apiURL, function (data) {
    data.forEach((user) => {
      addUserRow(user);
    });
    hideLoader();
  });

  function addUserRow(user) {
    const isFavorite = checkFavorite(user.id);
    usersTable.row.add([
      user.name,
      user.email,
      user.phone,
      user.company.name,
      `
      <button class="btn btn-sm btn-primary edit-btn" data-id="${user.id}">Edit</button>
      <button class="btn btn-sm btn-danger delete-btn" data-id="${user.id}">Delete</button>
      <button class="btn btn-sm btn-warning fav-btn" data-id="${user.id}">
        ${isFavorite ? "⭐" : "☆"}
      </button>
      `
    ]).draw(false);
  }

  function checkFavorite(id) {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    return favorites.includes(id);
  }

  $(document).on("click", ".fav-btn", function () {
    const id = parseInt($(this).data("id"));
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (favorites.includes(id)) {
      favorites = favorites.filter((f) => f !== id);
      toastr.info("Removed from favorites");
    } else {
      favorites.push(id);
      toastr.success("Added to favorites");
    }
    localStorage.setItem("favorites", JSON.stringify(favorites));
    $(this).text(checkFavorite(id) ? "⭐" : "☆");
  });

  $(document).on("click", ".delete-btn", function () {
    usersTable.row($(this).parents("tr")).remove().draw();
    toastr.warning("User deleted locally");
  });

  let editUserId = null;
  $(document).on("click", ".edit-btn", function () {
    editUserId = $(this).data("id");
    const row = $(this).closest("tr");
    const rowData = usersTable.row(row).data();

    $("#editUserId").val(editUserId);
    $("#editName").val(rowData[0]);
    $("#editEmail").val(rowData[1]);
    $("#editPhone").val(rowData[2]);
    $("#editCompany").val(rowData[3]);

    $("#editUserModal").modal("show");
  });

  $("#editUserForm").submit(function (e) {
    e.preventDefault();
    const row = $(`.edit-btn[data-id='${editUserId}']`).closest("tr");
    usersTable.row(row).data([
      $("#editName").val(),
      $("#editEmail").val(),
      $("#editPhone").val(),
      $("#editCompany").val(),
      row.find("td").last().html(), 
    ]).draw(false);

    $("#editUserModal").modal("hide");
    toastr.success("User updated locally");
  });
});

