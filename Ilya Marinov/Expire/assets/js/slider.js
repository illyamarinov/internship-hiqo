$(document).ready(function () {

  $.fn.awesomeSlider = function () {
    const $root = $('.slider');
    const $items = $root.find('.slider-item');
    const $arrows = $root.find('.slider-arrows');
    const $dots = $root.find('.slider-dots');

    let activeIndex = 0;

    function init() {
      const dotsLength = $items.length;

      $dots.empty();

      for (let i = 0; i < dotsLength; i++) {
        $('<span>')
          .appendTo($dots)
          .addClass('dot')
          .on('click', function () {
            change($(this).index());
          });
      }

      $dots.find('.dot').first().addClass('dot-active');

      $arrows.on('click', function() {
        const step = $(this).data('direction') === 'next' ? 1 : -1;
        let nextIndex = (dotsLength + activeIndex + step) % dotsLength;
        change(nextIndex);
      });

    }

    function change(nextIndex) {

      if (activeIndex === nextIndex) return

      $dots.find('.dot').each(function() {
        $(this).removeClass('dot-active');
      });

      $dots.find('.dot').eq(nextIndex).addClass('dot-active');

      $items.eq(activeIndex).fadeOut(function () {
        $items.eq(nextIndex).fadeIn(300);
      });

      activeIndex = nextIndex;
    }

    init();
  }

  $('.slider').awesomeSlider();

});
