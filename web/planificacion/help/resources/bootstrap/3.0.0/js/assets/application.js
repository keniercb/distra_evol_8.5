
!function ($) {

  $(function(){      

    var $window = $(window)
    var $body   = $(document.body)
    var navHeight = $('.navbar').outerHeight(true) + 10
      $(document).ready(function() {
        
          $('.bs-sidebar .nav > li > a').prepend('<span style="font-size: 0.7em; padding-right: 4px;" class="glyphicon glyphicon-chevron-right"></span>');
          $('div.row').prepend('<div style=" margin-bottom: 25px;border-bottom: solid 1px rgba(209, 209, 209, 0.69);text-align:center; color:#428BCA ;text-shadow: 0px 2px 2px rgba(76, 78, 78, 0.59);"><h1  id="titleDoc" style=" opacity:0.3;font-size: 2.3em">Ayuda del sistema</h1> </div>');
          $('ul.nav.bs-sidenav  > li:first-child > a > span').removeClass('glyphicon-chevron-right');
          $('ul.nav.bs-sidenav  > li:first-child > a > span').addClass('glyphicon-tags');

          $('div.col-md-9').css('background-color;','rgb(255, 255, 255)');
          $('div.col-md-9').css('box-shadow','0px 1px 8px 0px rgba(48, 48, 48, 0.36)');
          $('div.col-md-9').css('-moz-box-shadow','0px 1px 8px 0px rgba(48, 48, 48, 0.36)');
          $('div.col-md-9').css('-webkit-box-shadow','0px 1px 8px 0px rgba(48, 48, 48, 0.36)');
          $('div.col-md-9').css('min-height','600px');


          $("#titleDoc").animate({
              opacity: "1"
          }, 1500 );




          //.prepend('<span style="font-size: 0.7em; padding-right: 4px;" class="glyphicon glyphicon-star-empty"></span>');
             var actionHelp = $window[0].parent.actionhelpview;             
              var condition = 'li[title = '+'"'+actionHelp+'"]';               
             if(actionHelp !=""){
            var selectMove =  $(condition).attr("id")+"_context";
                 if(!selectMove){
                     actionHelp = actionHelp.split('/')[0];
                     condition = 'li[title = '+'"'+actionHelp+'"]';
                     selectMove = $(condition).attr("id")+"_context";
                 }
             $('html, body').stop().animate({scrollTop: $('#'+selectMove).offset().top}, 1000);            
             }

          });

    $body.scrollspy({
      target: '.bs-sidebar',
      offset: navHeight
    })

    $window.on('load', function () {
      $body.scrollspy('refresh')
    })

    $('.bs-docs-container [href=#]').click(function (e) {
      e.preventDefault()
    })

    // back to top
    setTimeout(function () {
      var $sideBar = $('.bs-sidebar')

      $sideBar.affix({
        offset: {
          top: function () {
            var offsetTop      = $sideBar.offset().top
            var sideBarMargin  = parseInt($sideBar.children(0).css('margin-top'), 10)
            var navOuterHeight = $('.bs-docs-nav').height()

            return (this.top = offsetTop - navOuterHeight - sideBarMargin)
          }
        , bottom: function () {
            return (this.bottom = $('.bs-footer').outerHeight(true))
          }
        }
      })
    }, 100)

  
})

}(window.jQuery)
