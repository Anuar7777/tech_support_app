function toggleModal() {
  const modal = document.querySelector(".header__modal");
  if (modal) {
    if (!modal.classList.contains("header__modal--open")) {
      modal.classList.add("header__modal--open");
      console.log("Modal opened:", modal);
    } else {
      modal.classList.remove("header__modal--open");
      console.log("Modal closed:", modal);
    }
  }
}

document.addEventListener("click", function (event) {
  const modal = document.querySelector(".header__modal");
  const profileImage = document.querySelector(".header__profile");

  if (modal) {
    if (!modal.contains(event.target) && event.target !== profileImage) {
      modal.classList.remove("header__modal--open");
    }
  }
});
