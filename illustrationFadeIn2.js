(function() {
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
	console.log(hidden)

	function init() {
		[].slice.call( document.querySelectorAll( 'path' ) ).forEach( function( el, i ) {
			path[i] = el;
			var l = path[i].getTotalLength();
			length[i] = l;
			path[i].style.strokeDasharray = l + ' ' + l; 
			path[i].style.strokeDashoffset = l;
		} );

	}

	function draw() {
		var progress = current_frame/total_frames;
		if (progress > 1) {
			window.cancelAnimFrame(handle);
			showPage();
		} else {
			current_frame++;
			for(var j=0; j<path.length;j++){
				path[j].style.strokeDashoffset = Math.floor(length[j] * (1 - progress));
			}
			handle = window.requestAnimFrame(draw);
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

	init();
	draw();

})();