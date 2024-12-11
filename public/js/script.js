function redirectToPage(url, openInNewTab = false) {
  if (openInNewTab) {
    window.open(url, "_blank");
  } else {
    window.location.href = url;
  }
}
