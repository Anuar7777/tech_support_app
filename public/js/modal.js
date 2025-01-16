function toggleModal() {
  const modal = document.querySelector(".header__modal");
  if (modal) {
    if (!modal.classList.contains("header__modal--open")) {
      modal.classList.add("header__modal--open");
    } else {
      modal.classList.remove("header__modal--open");
    }
  }
}

function showModal(modal) {
  modal.style.display = "flex";
}

function hideModal(modal) {
  modal.style.display = "none";
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
