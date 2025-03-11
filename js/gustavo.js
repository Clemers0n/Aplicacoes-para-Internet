function escondeHeaderFeio() {
  const headerFeio = document.querySelector(".g-header");
  const headerMeu = document.querySelector(".g-header-2");
  if (headerFeio.style.display === "block") {
    headerFeio.style.display = "none";
    headerMeu.style.position = "relative";
  } else {
    headerFeio.style.display = "block";
  }
}