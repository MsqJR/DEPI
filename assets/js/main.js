function showLoader() {
  $("#loader").fadeIn(200);
}

function hideLoader() {
  $("#loader").fadeOut(200);
}

toastr.options = {
  closeButton: true,
  progressBar: true,
  positionClass: "toast-top-right",
  timeOut: "2000",
};

$(document).ready(function () {
  const body = $("body");
  const toggleBtn = $("#toggleTheme");

  const savedTheme = localStorage.getItem("theme") || "light";
  toggleBtn.text(savedTheme === "dark" ? "☀️" : "🌙");
  if (savedTheme === "dark"){
	  document.body.classList.add("dark-mode")
  }

  toggleBtn.on("click", function () {
    body.toggleClass("dark-mode");

    if (body.hasClass("dark-mode")) {
      localStorage.setItem("theme", "dark");
      toggleBtn.text("☀️");
      toastr.info("Dark mode enabled");
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.text("🌙");
      toastr.info("Light mode enabled");
    }
  });
});
function checkMode(){
	const mode = localStorage.getItem("theme");
	if (mode === "dark")
	{document.body.classList.add("dark-mode")}
	
}
