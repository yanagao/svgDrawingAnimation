(function() {

	'use strict';

	window.requestAnimFrame = function(){
		return (
			window.requestAnimationFrame       || 
			window.webkitRequestAnimationFrame || 
			window.mozRequestAnimationFrame    || 
			window.oRequestAnimationFrame      || 
			window.msRequestAnimationFrame     || 
			function(/* function */ callback){
				window.setTimeout(callback, 1000 / 60);
			}
		);
	}();

	window.cancelAnimFrame = function(){
		return (
			window.cancelAnimationFrame       || 
			window.webkitCancelAnimationFrame || 
			window.mozCancelAnimationFrame    || 
			window.oCancelAnimationFrame      || 
			window.msCancelAnimationFrame     || 
			function(id){
				window.clearTimeout(id);
			}
		);
	}();
	
	var svgs = Array.prototype.slice.call( document.querySelectorAll( 'svg' ) ),
		hidden = Array.prototype.slice.call( document.querySelectorAll( '.hide' ) ),
		current_frame = 0,
		total_frames = 60,
		path = new Array(),
		length = new Array(),
		handle = 0;

	function init() {
		[].slice.call( document.querySelectorAll( 'path' ) ).forEach( function( el, i ) {
			path[i] = el;
			var l = path[i].getTotalLength();
			length[i] = l;
			path[i].style.strokeDasharray = l + ' ' + l; 
			path[i].style.strokeDashoffset = l;
		} );

	}
	function render(domEl) {
		if (domEl) {
			this.domEl = domEl;
		}
		draw();
	}

	function draw() {
		var progress = current_frame/total_frames;
		console.log('xxxxxxxxx'+progress);
		if (progress > 1) {
			window.cancelAnimFrame(handle);
			showPage();
		} else {
			current_frame++;
			for(var j=0; j<path.length;j++){
				path[j].style.strokeDashoffset = Math.floor(length[j] * (1 - progress));
			}
			handle = window.requestAnimFrame(draw);
			console.log(handle);
		}
	}

	function showPage() {
		svgs.forEach( function( el, i ) {
			el.setAttribute( 'class', el.getAttribute('class') + ' hide' );
		} );
		hidden.forEach( function( el, i ) {
			el.setAttribute( 'class', el.getAttribute('class').replace("hide", "show"));
		} );
	}
	function show() {
		svgs.forEach( function( el, i ) {
			var svgid = el.id;

			setTimeout( function() {
				render( document.querySelector( '[data-svg=' + svgid + ']' ) );
			}, Math.floor( Math.random() * 2001 ) );
		} );
	}
	// init();
	// setTimeout( function() {
	// draw();
	// }, Math.floor( Math.random() * 2001 ) );
	show();

})();