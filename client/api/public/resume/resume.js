 
  
document.addEventListener('DOMContentLoaded', function() {
    const skillsProgItems = document.querySelectorAll('.skills-prog li .skills-bar');
    skillsProgItems.forEach(function(skillBar, i) {
        const bar = skillBar.querySelector('.bar');
        const percent = skillBar.closest('li').getAttribute('data-percent');
        setTimeout(function() {
            bar.style.width = percent + '%';
            setTimeout(function() {
                bar.style.transitionDuration = '.5s';
            }, 1000);
        }, i * 150);
    });

    const skillsSoftItems = document.querySelectorAll('.skills-soft li svg');
    skillsSoftItems.forEach(function(svg, i) {
        const circle = svg.querySelector('.cbar');
        const r = circle.getAttribute('r');
        const c = Math.PI * (r * 2);
        const percent = svg.closest('li').getAttribute('data-percent');
        const cbar = ((100 - percent) / 100) * c;

        circle.style.strokeDashoffset = c;
        circle.style.strokeDasharray = c;
        
        setTimeout(function() {
            circle.style.transition = 'stroke-dashoffset 1s linear';
            circle.style.strokeDashoffset = cbar;
            setTimeout(function() {
                circle.style.transitionDuration = '.3s';
            }, 1000);
        }, i * 150);

        const small = svg.nextElementSibling;
        if (small.tagName.toLowerCase() === 'small') {
            let counter = 0;
            setTimeout(function() {
                const interval = setInterval(function() {
                    counter++;
                    small.textContent = counter + '%';
                    if (counter >= percent) {
                        clearInterval(interval);
                    }
                }, 1000 / percent);
            }, i * 150);
        }
    });
});
