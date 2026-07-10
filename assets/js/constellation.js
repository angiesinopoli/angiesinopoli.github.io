(function () {

	var canvas = document.getElementById('constellation');
	if (!canvas || !canvas.getContext) return;

	var ctx = canvas.getContext('2d'),
		header = canvas.parentElement,
		stars = [],
		STAR_COUNT = 70,
		MAX_DIST = 140;

	function resize() {
		canvas.width = header.offsetWidth;
		canvas.height = header.offsetHeight;
	}

	function makeStars() {
		stars = [];
		for (var i = 0; i < STAR_COUNT; i++) {
			stars.push({
				x: Math.random() * canvas.width,
				y: Math.random() * canvas.height,
				vx: (Math.random() - 0.5) * 0.15,
				vy: (Math.random() - 0.5) * 0.15,
				r: Math.random() * 1.4 + 0.6,
				twinkleOffset: Math.random() * Math.PI * 2
			});
		}
	}

	function step(time) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = 0; i < stars.length; i++) {
			var s = stars[i];
			s.x += s.vx;
			s.y += s.vy;
			if (s.x < 0) s.x = canvas.width;
			if (s.x > canvas.width) s.x = 0;
			if (s.y < 0) s.y = canvas.height;
			if (s.y > canvas.height) s.y = 0;
		}

		for (var i = 0; i < stars.length; i++) {
			for (var j = i + 1; j < stars.length; j++) {
				var a = stars[i], b = stars[j],
					dx = a.x - b.x,
					dy = a.y - b.y,
					dist = Math.sqrt(dx * dx + dy * dy);

				if (dist < MAX_DIST) {
					ctx.strokeStyle = 'rgba(255, 255, 255, ' + (0.18 * (1 - dist / MAX_DIST)) + ')';
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.stroke();
				}
			}
		}

		for (var i = 0; i < stars.length; i++) {
			var s = stars[i],
				twinkle = 0.5 + 0.5 * Math.sin(time * 0.001 + s.twinkleOffset);

			ctx.beginPath();
			ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
			ctx.fillStyle = 'rgba(255, 255, 255, ' + (0.35 + twinkle * 0.45) + ')';
			ctx.fill();
		}

		requestAnimationFrame(step);
	}

	window.addEventListener('resize', function () {
		resize();
		makeStars();
	});

	resize();
	makeStars();
	requestAnimationFrame(step);

})();
