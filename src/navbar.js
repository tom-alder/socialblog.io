(function($) { "use strict";
	
	//Navigation

	var app = function () {
		var body = undefined;
		var menu = undefined;
		var menuItems = undefined;
		var init = function init() {
			body = document.querySelector('body');
			menu = document.querySelector('.menu-icon');
			menuItems = document.querySelectorAll('.nav__list-item');
			applyListeners();
		};
		var applyListeners = function applyListeners() {
			menu.addEventListener('click', function () {
				return toggleClass(body, 'nav-active');
			});
		};
		var toggleClass = function toggleClass(element, stringClass) {
			if (element.classList.contains(stringClass)) element.classList.remove(stringClass);else element.classList.add(stringClass);
		};
		init();
	}();

	// When the user scrolls down 80px from the top of the document, resize the navbar's padding and the logo's font size
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
  if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
    document.getElementById("top-nav-content").style.paddingTop = "1rem";
    document.getElementById("top-nav").style.boxShadow = "0 3px 3px -3px rgba(0,0,0,.2)";
    document.getElementById("top-nav-content").style.transition = "0.4s";
    document.getElementById("top-nav").style.transition = "0.7s";
    document.getElementById("logo").style.fontSize = "25px";
  } else {
    document.getElementById("top-nav-content").style.paddingTop = "2rem";
	document.getElementById("top-nav").style.boxShadow = "0 0px 0px 0px rgba(255,255,255)";
    document.getElementById("top-nav-content").style.transition = "0.4s";
    document.getElementById("top-nav").style.transition = "0.7s";
    document.getElementById("logo").style.fontSize = "35px";
  }
}
	
})(jQuery); 