let navButton = document.querySelector('header .burger-list');
let navList = document.querySelector('header nav');

if (navButton && navList) {
    navButton.addEventListener('click', () => {
        console.log('this si');
        navList.classList.toggle('max-md:hidden');
    });
}
// animate circle chart
// observer will trigger the dasharray transition on the first circle it sees
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const circle = entry.target; // entry.target IS the circle path
      const percent = circle.dataset.percent;

      requestAnimationFrame(() => {
        circle.style.strokeDasharray = `${percent}, 100`;
      });

      observer.unobserve(circle);
    }
  });
}, { threshold: 0.3 });
document.querySelectorAll('.numbers .circle[data-percent]').forEach(el => {
  observer.observe(el);
});