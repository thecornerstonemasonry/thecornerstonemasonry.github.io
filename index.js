const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navMenu.classList.toggle("active");
});

document.querySelectorAll(".nav-link").forEach(n => n.addEventListener("click", () => {
  hamburger.classList.remove("active");
  navMenu.classList.remove("active");
}));

//Find the button using the getElement method
var contactButton = document.getElementById("button1");

contactButton.addEventListener("click", function () {
    //Adds an event listener that awaits the button click. Returns an alert notification and clears the fields.
    alert("Thank you for your inquiry. We will reach out to you as soon as possible.");
    document.getElementById("name1").value = "";
    document.getElementById("email1").value = "";
    document.getElementById("message1").value = "";
});
