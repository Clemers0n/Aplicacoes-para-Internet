const slides = document.querySelectorAll(".slide");
const indicatorsContainer = document.querySelector(".indicators");
const prevButton = document.querySelector(".prev");
const nextButton = document.querySelector(".next");
let currentIndex = 0;
let autoSlideInterval;

slides.forEach((_, index) => {
  const indicator = document.createElement("div");
  indicator.classList.add("indicator");
  if (index === 0) indicator.classList.add("active");
  indicator.addEventListener("click", () => manualSlide(index));
  indicatorsContainer.appendChild(indicator);
});

function goToSlide(index) {
  document.querySelector(".slides").style.transform = `translateX(-${
    index * 100
  }%)`;
  document
    .querySelectorAll(".indicator")
    .forEach((ind) => ind.classList.remove("active"));
  document.querySelectorAll(".indicator")[index].classList.add("active");
  currentIndex = index;
}

function nextSlide() {
  currentIndex = (currentIndex + 1) % slides.length;
  goToSlide(currentIndex);
}

function prevSlide() {
  currentIndex = (currentIndex - 1 + slides.length) % slides.length;
  goToSlide(currentIndex);
}

function manualSlide(index) {
  goToSlide(index);
  resetAutoSlide();
}

function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  autoSlideInterval = setInterval(nextSlide, 3000);
}

nextButton.addEventListener("click", () => {
  nextSlide();
  resetAutoSlide();
});
prevButton.addEventListener("click", () => {
  prevSlide();
  resetAutoSlide();
});

resetAutoSlide();
