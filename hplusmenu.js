$.fn.hplusmenu = function() {
	return this.each(function() {
		
		// main-menu div
		var element = $(this);

		// main-menu navigation
		var nav = element.find('.hplus-nav');

		// main-menu ul
		var ul = element.find('.hplus-nav>ul');
		var width = 0;
		ul.children().each(function() {
			var li = $(this);
			width+= li.outerWidth();
		});
		
		// inline navigation menu by setting the width
		ul.width(width+1);


		/** implementation of navigation horizontal scrolling by mouse drag **/
		var bScroll = false;
		var scrollStartX = 0;
		var scrollEndX = 0;
		var currentScrollPos = 0;
		var scrollStartTime;
		var bScrolled = false;

		function isMobile() {
		  	try{ 
		  		document.createEvent("TouchEvent"); 
		  			return true; 
		  	} catch(e) { 
		  		return false; 
		  	}
		}

		if(!isMobile()) {
			nav.on('mousedown', function(e) {
				e.preventDefault();
				bScroll = true;
				scrollStartX = e.clientX;
				currentScrollPos = nav.scrollLeft();
				scrollStartTime = new Date();
			});

			$(document).on('mousemove', function(e) {
				e.preventDefault();
				this.setCapture && this.setCapture();
				scrollEndX = e.clientX;
				if(bScroll) {
					nav.scrollLeft(currentScrollPos+scrollStartX-scrollEndX);
				}
			});

			$(document).on('mouseup', function(e) {
				if(bScroll) {
					bScroll = false;
					var scrollDistance = scrollStartX-scrollEndX;
					var scrollEndTime = new Date();
					var delta = scrollEndTime-scrollStartTime;
					var speed = scrollDistance/delta;
					var distance = speed*200;
					nav.animate({scrollLeft: (nav.scrollLeft()+distance)}, {duration: 200, easing: 'easeOutCubic'});
					if(scrollDistance>10 || scrollDistance<-10) {
						bScrolled = true;
						return;
					} else {
						bScrolled = false;
					}
				}
				bScrolled = false;
			});
		} else {
			nav.on('touchstart', function(e) {
				bScroll = true;
				scrollStartX = e.originalEvent.changedTouches[0].pageX;
				currentScrollPos = nav.scrollLeft();
				scrollStartTime = new Date();
			});

			nav.on('touchmove', function(e) {
				scrollEndX = e.originalEvent.changedTouches[0].pageX;
				if(bScroll) {
					nav.scrollLeft(currentScrollPos+scrollStartX-scrollEndX);
				}
			});

			nav.on('touchend', function(e) {
				scrollEndX = e.originalEvent.changedTouches[0].pageX;
				if(bScroll) {
					bScroll = false;
					var scrollEndTime = new Date();
					var delta = scrollStartX-scrollEndX;
					var deltaTime = scrollEndTime-scrollStartTime;
					var speed = (scrollStartX-scrollEndX)/deltaTime;
					var distance = speed*200;
					nav.animate({scrollLeft: (nav.scrollLeft()+distance)}, {duration: 200, easing: 'easeOutCubic'});
				}
			});
		}

		/** implementation of navigation item click **/
		var subIndex = 0;
		$.each(element.find('.hplus-nav>ul>li>a'), function() {
			var navItem = $(this);
			if(navItem.hasClass('hplus-has-sub')) {
				navItem.attr('hplus_sub_index', subIndex);
				subIndex++;
			}
		});

		element.find('.hplus-nav>ul>li>a').on('click', function(e) {
			e.preventDefault();
			if(bScrolled) {
				bScrolled = false;
				return;
			}
			var navItem = $(this);
			var index = navItem.attr('hplus_sub_index');
			if (typeof index !== typeof undefined && index !== false) {
				index = parseInt(index);
				var subItem = element.find('.hplus-content>.hplus-sub:nth-child('+(index+1)+')');
				if(navItem.hasClass('active')) {
					element.find('.hplus-nav>ul>li>a').removeClass('active');
					element.find('.hplus-content>.hplus-sub').removeClass('hplus-open');
				} else {
					element.find('.hplus-nav>ul>li>a').removeClass('active');
					navItem.addClass('active');

					element.find('.hplus-content>.hplus-sub').removeClass('hplus-open');
					subItem.addClass('hplus-open');
				}
				return false;
			}
		});
	});
}