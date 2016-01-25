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

	function element( el ) {
		this.el = el;
		this.current_frame = 0;
		this.total_frames = 60;
		this.path = new Array();
		this.length = new Array();
		this.handle = 0;
		this.init();
	}

	element.prototype.init = function() {
		var self = this;
		[].slice.call( this.el.querySelectorAll( 'path' ) ).forEach( function( path, i ) {
			self.path[i] = path;
			var l = self.path[i].getTotalLength();
			self.length[i] = l;
			self.path[i].style.strokeDasharray = l + ' ' + l; 
			self.path[i].style.strokeDashoffset = l;
		} );
	};

	element.prototype.render = function( domEl ) {
		if( this.rendered ) return;
		if( domEl ) {
			this.domEl = domEl;
		}
		this.rendered = true;
		this.draw();
	};

	element.prototype.draw = function() {
		var self = this,
			progress = this.current_frame/this.total_frames;
		if (progress > 1) {
			window.cancelAnimFrame(this.handle);
			this.showDomEl();
		} else {
			this.current_frame++;
			for(var j=0, len = this.path.length; j<len;j++){
				this.path[j].style.strokeDashoffset = Math.floor(this.length[j] * (1 - progress));
			}
			this.handle = window.requestAnimFrame(function() { self.draw(); });
		}
	};

	element.prototype.showDomEl = function() {
		console.log(this.domEl);
		if( this.domEl ) {
			this.domEl.setAttribute( 'class', this.domEl.getAttribute('class').replace("hide", "show"));
		}
		this.el.setAttribute( 'class', this.el.getAttribute('class') + ' hide' );
	};
	
	function init() {
		var svgs = Array.prototype.slice.call( document.querySelectorAll( 'svg' ) );

		svgs.forEach( function( el, i ) {
			var svg = new element( el ),
				svgid = el.id;

			setTimeout( function() {
				svg.render( document.querySelector( '[data-svg=' + svgid + ']' ) );
			}, Math.floor( Math.random() * 2001 ) );
		} );
	}

	init();

})();