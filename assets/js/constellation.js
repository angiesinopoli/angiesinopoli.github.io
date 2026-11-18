(function () {

	var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

	// Draws a drifting, twinkling constellation on a canvas.
	// getSize() returns the canvas size; opts sets density and brightness.
	function constellation(canvas, getSize, opts) {
		if (!canvas || !canvas.getContext) return;

		var ctx = canvas.getContext('2d'),
			stars = [],
			lastWidth = 0;

		function resize() {
			var size = getSize();
			canvas.width = size.width;
			canvas.height = size.height;
		}

		function makeStars() {
			var count = opts.count(canvas.width, canvas.height);
			stars = [];
			for (var i = 0; i < count; i++) {
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

			for (var i = 0; i < stars.length && !reduceMotion; i++) {
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

					if (dist < opts.maxDist) {
						ctx.strokeStyle = 'rgba(255, 255, 255, ' + (opts.lineAlpha * (1 - dist / opts.maxDist)) + ')';
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
					twinkle = 0.5 + 0.5 * Math.sin((time || 0) * 0.001 + s.twinkleOffset);

				ctx.beginPath();
				ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
				ctx.fillStyle = 'rgba(255, 255, 255, ' + (opts.starAlpha * (0.35 + twinkle * 0.45)) + ')';
				ctx.fill();
			}

			if (!reduceMotion) requestAnimationFrame(step);
		}

		window.addEventListener('resize', function () {
			resize();
			// Phones fire resize when the address bar shows or hides while
			// scrolling; only reshuffle the stars when the width really changes.
			if (canvas.width !== lastWidth) {
				lastWidth = canvas.width;
				makeStars();
			}
			if (reduceMotion) requestAnimationFrame(step);
		});

		resize();
		lastWidth = canvas.width;
		makeStars();
		requestAnimationFrame(step);
	}

	// Header: the original constellation.
	var headerCanvas = document.getElementById('constellation');
	if (headerCanvas) {
		constellation(headerCanvas, function () {
			var header = headerCanvas.parentElement;
			return { width: header.offsetWidth, height: header.offsetHeight };
		}, {
			count: function () { return 70; },
			maxDist: 140,
			lineAlpha: 0.18,
			starAlpha: 1
		});
	}

	// Whole page: a fainter layer that stays behind the content as you scroll.
	constellation(document.getElementById('page-stars'), function () {
		return { width: window.innerWidth, height: window.innerHeight };
	}, {
		count: function (w, h) { return Math.min(90, Math.round(w * h / 16000)); },
		maxDist: 130,
		lineAlpha: 0.12,
		starAlpha: 0.7
	});

})();
