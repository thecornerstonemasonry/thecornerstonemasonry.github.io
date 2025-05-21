let isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

if (!isMobile) {
  /* set navbar class to mobile one */
  /* alert("This website is tailored to mobile devices.") */
} else {
  /* set navbar class to desktop one */
}

//Find the button using the getElement method
var contactButton = document.getElementById("button1");

contactButton.addEventListener("click", function () {
    //Adds an event listener that awaits the button click. Returns an alert notification and clears the fields.
    alert("Thank you for your inquiry. We will reach out to you as soon as possible.");
    document.getElementById("name1").value = "";
    document.getElementById("email1").value = "";
    document.getElementById("message1").value = "";
});
