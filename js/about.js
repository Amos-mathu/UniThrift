document.addEventListener("DOMContentLoaded", () => {
  const statsSection = document.querySelector(".stats");
  const counters = statsSection.querySelectorAll(".counter");

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const counter = entry.target;

          // Add animation class for fade + slide
          counter.classList.add('animated');

          // Start count-up animation
          const updateCount = () => {
            const target = +counter.getAttribute("data-target");
            const suffix = counter.getAttribute("data-suffix") || "+";
            const count = +counter.innerText.replace(/\D/g, '');
            const speed = 200;
            const increment = target / speed;

            if (count < target) {
              counter.innerText = Math.ceil(count + increment).toLocaleString() + suffix;
              setTimeout(updateCount, 10);
            } else {
              counter.innerText = target.toLocaleString() + suffix;
            }
          };

          updateCount();

          // Unobserve after animation triggered once
          observer.unobserve(counter);
        }
      });
    },
    { threshold: 0.5 }
  );

  counters.forEach(counter => observer.observe(counter));
});


// Add fade-in on scroll (simple JS)
 document.addEventListener("DOMContentLoaded", () => {
    const fadeEls = document.querySelectorAll('.fade-in');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('show');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    fadeEls.forEach(el => observer.observe(el));
  });
