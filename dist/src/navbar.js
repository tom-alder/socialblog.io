(function($) { "use strict";
	
	//Navigation

	var app = function () {
		var body = undefined;
		var blurme = undefined;
		var menu = undefined;
		var menuItems = undefined;
		var init = function init() {
			body = document.querySelector('body');
			blurme = document.querySelector('#blurme');
			menu = document.querySelector('#togglenav');
			menuItems = document.querySelectorAll('.nav__list-item');
			applyListeners();
		};
		var applyListeners = function applyListeners() {
			menu.addEventListener('click', function () {
				return toggleClass(blurme,'blurred'),  toggleClass(body, 'nav-active');
				
			})
			// if (body.classList.contains('.nav-active')) {
			// 	// do some stuff
			// 	blurme.addEventListener('click', function () {
			// 		return toggleClass(blurme,'blurred'),  toggleClass(body, 'nav-active');
			// 	});
			// }

			blurme.addEventListener("click", () => {
				if (body.classList.contains("nav-active")) {
				  body.classList.remove("nav-active"),
				  blurme.classList.remove("blurred"),
				  document.getElementById("togglenav").checked = false;
				   }
				}, true);
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
  } else {
    document.getElementById("top-nav-content").style.paddingTop = "2rem";
	document.getElementById("top-nav").style.boxShadow = "0 0px 0px 0px rgba(255,255,255)";
    document.getElementById("top-nav-content").style.transition = "0.4s";
    document.getElementById("top-nav").style.transition = "0.7s";
  }
}
	
})
(jQuery); 

