// Fades items up gently as they scroll into view.
// Items are only hidden once this script runs, so without JavaScript
// (or with reduced motion turned on) everything simply shows.
(function () {

	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (reduceMotion || !('IntersectionObserver' in window)) return;

	// Each group staggers its own items slightly, one after another.
	var groups = [
		'#intro .definition-box',
		'#first .features > li',
		'.experience > h4, .experience .role',
		'.skills-grid > li',
		'#listening .features > li'
	];

	var observer = new IntersectionObserver(function (entries) {
		entries.forEach(function (entry) {
			if (!entry.isIntersecting) return;
			var el = entry.target;
			el.classList.add('is-visible');
			observer.unobserve(el);

			// Once it has settled, drop the reveal styles so hover effects
			// respond right away instead of inheriting the stagger delay.
			var delay = parseInt(el.style.transitionDelay, 10) || 0;
			setTimeout(function () {
				el.classList.remove('reveal', 'is-visible');
				el.style.transitionDelay = '';
			}, delay + 700);
		});
	}, { rootMargin: '0px 0px -8% 0px', threshold: 0.1 });

	groups.forEach(function (selector) {
		var items = document.querySelectorAll(selector);
		for (var i = 0; i < items.length; i++) {
			items[i].classList.add('reveal');
			items[i].style.transitionDelay = Math.min(i % 5, 4) * 80 + 'ms';
			observer.observe(items[i]);
		}
	});

})();
