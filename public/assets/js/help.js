        // Add event listener to the button
      const sections = document.querySelectorAll(".section");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add("animate");
            }
          });
        },
        {
          threshold: 0.1,
        }
      );

      sections.forEach((section) => {
        observer.observe(section);
      });
   