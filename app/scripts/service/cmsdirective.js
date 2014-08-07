
var app = angular.module('cmsAppApp');

app.directive('scrollOnClick', function() {
  return {
    restrict: 'A',
    link: function(scope, $elm) {
      $elm.on('click', function() {
      	var index = $elm.index();
      	$elm.addClass('active').siblings().removeClass('active');
      	var scrolltop = $('.bs-callout[id]').eq(index).offset().top - 40;
      	console.log(index, scrolltop)
        $("body").animate({scrollTop: scrolltop}, "slow");
      });
    }
  }
});

app.directive('targetBlank', function() {
  return {
    compile: function(element) {
      var elems = (element.prop("tagName") === 'A') ? element : element.find('a');
      elems.attr("target", "_blank");
    }
  };
});