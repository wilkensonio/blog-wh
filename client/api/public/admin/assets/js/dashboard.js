(function($) {
  'use strict';
  $.fn.andSelf = function() {
    return this.addBack.apply(this, arguments);
  }
  $(function() {

    //check all boxes in order status 
    $("#check-all").click(function () {
      $(".form-check-input").prop('checked', $(this).prop('checked'));
    });

     
     
    if($('#audience-map').length) {
      $('#audience-map').vectorMap({
        map: 'world_mill_en',
        backgroundColor: 'transparent',
        panOnDrag: true,
        focusOn: {
          x: 0.5,
          y: 0.5,
          scale: 1,
          animate: true
        },
        series: {
          regions: [{
            scale: ['#3d3c3c', '#f2f2f2'],
            normalizeFunction: 'polynomial',
            values: {

              "BZ": 75.00,
              "US": 56.25,
              "AU": 15.45,
              "GB": 25.00,
              "RO": 10.25,
              "GE": 33.25
            }
          }]
        }
      });
    } 
  });
})(jQuery);
