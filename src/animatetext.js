function setupTypedReplace() {
    // the text node to type in
    var typed_class = "typed-replaced";

    // the original text content to replace, but also use
    var replace_text = "LinkedIn portfolio";

    var options = {
      strings: [
        "blog",
        "personal site",
        "demo",
        "hobby",
        "coding project",
        "MVP",
        "weekend learning",
        replace_text,
      ], // existing text goes at the end
      typeSpeed: 80,
      backSpeed: 40,
      backDelay: 1000,
      loop: true,
      smartBackspace: false,
      cursorChar: "|",
      attr: null,
    };

    // clear out the existing text gracefully then setup the loop
    new Typed("." + typed_class, {
      strings: [replace_text, ""],
      backSpeed: options.backSpeed,
      backDelay: options.backDelay,
      cursorChar: options.cursorChar,
      attr: options.attr,
      // startDelay: 700,
      onComplete: function (t) {
        // existing text has now been removed so let's actually clear everything out
        // and setup the proper Typed loop we want. If we don't do this, the original
        // text content breaks the flow of the loop.
        t.destroy();
        document.getElementsByClassName(typed_class)[0].textContent = "";
        new Typed("." + typed_class, options);
      },
    });
  }
  setupTypedReplace();

  // NUMBER INCREASE ANIMATE

  $(window).scroll(testScroll);
  var viewed = false;

  function isScrolledIntoView(elem) {
    var docViewTop = $(window).scrollTop();
    var docViewBottom = docViewTop + $(window).height();

    var elemTop = $(elem).offset().top;
    var elemBottom = elemTop + $(elem).height();

    return elemBottom <= docViewBottom && elemTop >= docViewTop;
  }

  function testScroll() {
    if (isScrolledIntoView($(".numbers")) && !viewed) {
      viewed = true;

      $(".value").each(function () {
        $(this)
          .prop("Counter", 0)
          .animate(
            {
              Counter: $(this).text(),
            },
            {
              duration: 4000,
              easing: "swing",
              step: function (now) {
                $(this).text(Math.ceil(now));
              },
            }
          );
      });
    }
  }