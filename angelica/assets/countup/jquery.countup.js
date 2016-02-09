/**
 * @name		jQuery CountUp Plugin
 * @author		Rafnix Guzman
 * @version 	1.0
 * @url			http://github.com/rafnixg/countup-jquery
 * @license		MIT License
 * Martin Angelov http://tutorialzine.com/2011/12/countdown-jquery/
 */

(function($){
	
	// Number of seconds in every time division
	var days	= 24*60*60,
		hours	= 60*60,
		minutes	= 60;
	
	// Creating the plugin
	$.fn.countup = function(prop){
		
		var options = $.extend({
			callback	: function(){},
			start	: new Date()
		},prop);
		
		var passed = 0, d, h, m, s, positions;

		// Initialize the plugin
		init(this, options);
		
		positions = this.find('.position');
		
		(function tick(){
			
			// Time passed
			passed = Math.floor(((new Date()) -options.start) / 1000);
			
			// Number of days passed
			d = Math.floor(passed / days);
			d1=Math.floor(d/100)%100;
			d2=d%100;
			updateDuo(0, 1, d1);
			updateDuo(2, 3, d2);
			passed -= d*days;
			
			// Number of hours passed
			h = Math.floor(passed / hours);
			updateDuo(4, 5, h);
			passed -= h*hours;
			
			// Number of minutes passed
			m = Math.floor(passed / minutes);
			updateDuo(6, 7, m);
			passed -= m*minutes;
			
			// Number of seconds passed
			s = passed;
			updateDuo(8, 9, s);
			
			// Calling an optional user supplied callback
			options.callback(d, h, m, s);
			
			// Scheduling another call of this function in 1s
			setTimeout(tick, 1000);
		})();
		
		// This function updates two digit positions at once
		function updateDuo(minor,major,value){
			switchDigit(positions.eq(minor),Math.floor(value/10)%10);
			switchDigit(positions.eq(major),value%10);
		}
		
		return this;
	};


	function init(elem, options){
		elem.addClass('countupHolder');

		// Creating the markup inside the container
		$.each(['Days','Hours','Minutes','Seconds'],function(i){
			if (this=='Days') 
			{
				$('<span class="count'+this+'">').html(
				'<span class="position">\
					<span class="digit static">0</span>\
				</span>\
				<span class="position">\
					<span class="digit static">0</span>\
				</span>\
				<span class="position">\
					<span class="digit static">0</span>\
				</span>\
				<span class="position">\
					<span class="digit static">0</span>\
				</span>'
			).appendTo(elem);
			}else{
				$('<span class="count'+this+'">').html(
				'<span class="position">\
					<span class="digit static">0</span>\
				</span>\
				<span class="position">\
					<span class="digit static">0</span>\
				</span>'
			).appendTo(elem);
			};
			

			if(this!="Seconds"){
				elem.append('<span class="countDiv countDiv'+i+'"></span>');
			}
		});

	}

	// Creates an animated transition between the two numbers
	function switchDigit(position,number){
		
		var digit = position.find('.digit')
		
		if(digit.is(':animated')){
			return false;
		}
		
		if(position.data('digit') == number){
			// We are already showing this number
			return false;
		}
		
		position.data('digit', number);
		
		var replacement = $('<span>',{
			'class':'digit',
			css:{
				top:'-2.1em',
				opacity:0
			},
			html:number
		});
		
		// The .static class is added when the animation
		// completes. This makes it run smoother.
		
		digit
			.before(replacement)
			.removeClass('static')
			.animate({top:'2.5em',opacity:0},'fast',function(){
				digit.remove();
			})

		replacement
			.delay(100)
			.animate({top:0,opacity:1},'fast',function(){
				replacement.addClass('static');
			});
	}
})(jQuery);