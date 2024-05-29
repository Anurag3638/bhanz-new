// Wait for the content to load
window.addEventListener('load', function () {
    // Hide the loader when the content is loaded
    var loader = document.querySelector('.loader-wrapper');
    loader.style.display = 'none';
  });

  
  let slideIndex = 0;
  showSlides();
  
  function showSlides() {
    let slides = document.getElementsByClassName("slide");
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";  
    }
    slideIndex++;
    if (slideIndex > slides.length) {slideIndex = 1}    
    slides[slideIndex-1].style.display = "block";  
    setTimeout(showSlides, 3000); // Change image every 3 seconds
  }
  
  function changeSlide(n) {
    slideIndex += n;
    showSlides();
  }
  