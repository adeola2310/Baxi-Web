
$(function () {
  "use strict";


  $(document).on("click", ".hamburger", () => {
    $('.bottom-links').toggleClass('bottom-links-active');
    $('.hamburger').toggleClass('toggle');
  });

  $(document).click(function(e) {

    let container = $(".baxi-bottom-nav");
    let link = $(".bottom-links");
    let target = $( e.target);
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if (link.hasClass("bottom-links-active")) {
        link.removeClass("bottom-links-active");
        $('.hamburger').removeClass('toggle');
      }
    }


    if ( target.is( "a" ) ) {
      link.removeClass("bottom-links-active");
      $('.hamburger').removeClass('toggle');
    }
  });

  $(window).on('scroll', function () {
    if (window.innerWidth <= 768) {
      if ($(this).scrollTop() > 55) {
        $('.baxi-bottom-nav').css('top', '0')
      } else {
        $('.baxi-bottom-nav').css('top', 'unset')
      }
    }
  })

});
