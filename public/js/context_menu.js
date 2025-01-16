const contextMenu = document.querySelector(".context__link");
const contextMenuLink = contextMenu;

function showContextMenu(event, element) {
  event.preventDefault();

  const item = element;

  if (item) {
    if (!contextMenu.classList.contains("context__link--hidden")) {
      contextMenu.classList.add("context__link--hidden");
      return;
    }

    contextMenu.style.left = `${event.pageX + 5}px`;
    contextMenu.style.top = `${event.pageY}px`;

    const href = item.getAttribute("data-href");
    contextMenuLink.setAttribute("href", href);

    contextMenu.classList.remove("context__link--hidden");
  }
}

document.addEventListener("click", function (event) {
  if (!contextMenu.contains(event.target)) {
    contextMenu.classList.add("context__link--hidden");
  }
});

contextMenu.addEventListener("click", function () {
  contextMenu.classList.add("context__link--hidden");
});

contextMenu.addEventListener("contextmenu", function (event) {
  event.preventDefault();
});
