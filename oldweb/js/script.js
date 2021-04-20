// window.ddzSlider = $('.testimonial-container').ddzSlider({animSpeed:500,easing:"swing",speed:10});
   $(window).load(function(){
 $(".se-pre-con").fadeOut("slow");
});

  $('#toggle-menu').click(function(){

    $(this).toggleClass('toggle-menu-visible').toggleClass('toggle-menu-hidden');
      $('nav').toggleClass('show');
       $('header').toggleClass('mhn');
    });


$("#home").mousemove(function(e) {
  parallaxIt(e, "#bubble-lg", -100);
  parallaxIt(e, "#bubble-md", -75);
   parallaxIt(e, "#bubble-sm", -50);
   parallaxIt(e, ".banner-img", -25);
});

function parallaxIt(e, target, movement) {
  var $this = $("#home");
  var relX = e.pageX - $this.offset().left;
  var relY = e.pageY - $this.offset().top;

  TweenMax.to(target, 1, {
    x: (relX - $this.width() / 2) / $this.width() * movement,
    y: (relY - $this.height() / 2) / $this.height() * movement
  });
}

$( document ).ready(function() {
    var removeClass = true;
$(".ovx-vertical-menu.standalone ").click(function(){
$(this).toggleClass("open");
 removeClass = false;

});
$("html").click(function () {
    if (removeClass) {
        $(".ovx-vertical-menu.standalone").removeClass('open');
    }
    removeClass = true;
});
$( ".ovx-btn.trigger" ).each(function(index) {
    $(this).on("click", function(){
        $('.to-hide').removeClass('show');
      $(this).parents('.field-group-pair').find('.to-hide').addClass('show');
    });
});
});




// $(window).load(function() {
    // Animate loader off screen
    // setTimeout(function(){
    //     $('body').addClass('loaded');
    //       }, 3000);
        // $(".slider-inner").height($(".slide img").height());
        // $(".lines-bg").width( $(document).width());
// $(".owl-carousel").owlCarousel({
//   loop: true,
//   autoplay: true,
//   items: 1,
//      margin:10,

//   autoplayHoverPause: true,
//   animateOut: 'slideOutUp',
//   animateIn: 'slideInUp'
// });
  // });

// $( window ).resize(function() {
//     // $(".slider-inner").height($(".slide img").height());
//      $(".lines-bg").width( $(document).width());

// });
// // makes sure the whole site is loaded
// jQuery(window).load(function() {
//         // will first fade out the loading animation
//     jQuery(".status").fadeOut();
//         // will fade out the whole DIV that covers the website.
//     jQuery(".preloader").delay(1000).fadeOut("slow");
// })

// $(document).ready(function() {
//   $('.main-navigation').onePageNav({
//     scrollThreshold: 0.2, // Adjust if Navigation highlights too early or too late
//     scrollOffset: 60 //Height of Navigation Bar
//   });

// });



// $(window).load(function(){
//     // sliderfix();
//     topMenuFix();
// });
// $(window).scroll(function(){
//     // sliderfix();
//     topMenuFix();
// });
//     function topMenuFix(){
//     if(jQuery(window).scrollTop()>=1){
//         jQuery('header').addClass('scroll_menu');
//     }
//     else{
//         jQuery('header').removeClass('scroll_menu');
//     }
// }


var select_box_con_start_temp = '<a class=" ovx-btn" onclick="open_options(this)"><div class="opt_text">Select</div><span class="ico-arrow"></span></a><div class="ovx-dropdown"><ul class="ovx-dropdown-options">',
    select_box_con_end = '</ul></div>',
    select_box_con_start = '';


//get all select list
$('select.select_box').each(function(ind, ele) {
    select_box_con = '';
    select_box_options = '';


    var selectbox = $(ele);
    selectbox.addClass('off-screen');

    //for default selected option
    sel_opt = selectbox.find('option:selected').text();
            console.log(sel_opt);

    if (sel_opt == '') {
        select_box_con_start = select_box_con_start_temp;
    } else {
        select_box_con_start = select_box_con_start_temp.replace("Select", sel_opt);
    }
    selectbox.find('option').each(function(optno, eleno) {


        var ths = $(this),
        option_val = ths.text();
        var li_class = (ths.is('[disabled=disabled]')) ? "disabled" : "";
        if(ths.is('[disabled=disabled]')){
            select_box_options += '<li class="'+li_class+'">' + option_val + '</li>';
        }
        else{
            select_box_options += '<li class="'+li_class+'" onclick="option_selected(this,' + optno + ')">' + option_val + '</li>';
        }

    });

    select_box_con = select_box_con_start + select_box_options + select_box_con_end;

    $(select_box_con).insertAfter(selectbox);
});
//open options function
function open_options(ths) {
    ths = $(ths);
    $(".ovx-select-group").removeClass('open');
    ths.parent('.ovx-select-group').toggleClass('open');

}
//select option function
function option_selected(ths, optno) {
    ths = $(ths);
    opt_text = ths.text();
    dropdown_parent = ths.closest('.ovx-dropdown'),
        select_parent = $(dropdown_parent).closest('.ovx-select-group');
    dropdown_parent.prev('a').find('.opt_text').text(opt_text);

    $(select_parent).find('select.select_box').children('option')
        .removeAttr('selected')
        .end()
        .children('option:eq(' + optno + ')').attr('selected', 'selected');
    dropdown_parent.parent('.ovx-select-group').toggleClass('open');
}


//Close select box on click anywhere on page
$(document).click(function(e) {

    if (!$(e.target).hasClass('ovx-btn') && !$(e.target).hasClass('opt_text') && !$(e.target).hasClass('ico-arrow') && !$(e.target).hasClass('ovx-dropdown-options') && !$(e.target).hasClass('disabled')) {
        $('.ovx-select-group').removeClass('open');
    }
});

// Hide Header on on scroll down
var didScroll;
var lastScrollTop = 0;
var delta = -1;
var navbarHeight = 0;

$(window).scroll(function(event){
    didScroll = true;
});

setInterval(function() {
    if (didScroll) {
        hasScrolled();
        didScroll = false;
    }
});

function hasScrolled() {
    var st = $(this).scrollTop();

    // Make sure they scroll more than delta
    if(Math.abs(lastScrollTop - st) <= delta)
        return;

    // If they scrolled down and are past the navbar, add class .nav-up.
    // This is necessary so you never see what is "behind" the navbar.
    if ( st > navbarHeight){
        // Scroll Down
        $('header').addClass('stick');
    } else {
        // Scroll Up
        if(st + $(window).height() < $(document).height()) {
            $('header').removeClass('stick');
        }
    }

    lastScrollTop = st;
}
// Footer //

// $(window).scroll(function() {

//     var top_of_screen = $(window).scrollTop();
// var header = $("header").offset().top + $("header").outerHeight();


// });





// $('.ajax-popup-link').magnificPopup({
//     type: 'ajax',
//     alignTop: true,
//     overflowY: 'scroll', // as we know that popup content is tall we set scroll overflow by default to avoid jump
//     cursor: 'mfp-ajax-cur', // CSS class that will be added to body during the loading (adds "progress" cursor)
//     tError: '<a href="%url%">The content</a> could not be loaded.', //  Error message, can contain %curr% and %total% tags if gallery is enabled
//     closeBtnInside: true,
//     preloader: false,
//     midClick: true,
//     removalDelay: 300,
//     mainClass: 'my-mfp-slide-bottom',
//     preloader: false,
// });

// $('.alert-modal').magnificPopup({

//     type: 'ajax',
//     alignTop: false,

//     cursor: 'mfp-ajax-cur', // CSS class that will be added to body during the loading (adds "progress" cursor)
//     tError: '<a href="%url%">The content</a> could not be loaded.', //  Error message, can contain %curr% and %total% tags if gallery is enabled
//     closeBtnInside: false,
//     modal:true,
//     preloader: false,
//     midClick: true,
//     removalDelay: 300,
//     mainClass: 'my-mfp-slide-bottom',

// });



// $(document).ready(function() {



//     (function(a){a.fn.extend({tabify:function(e){function c(b){hash=a(b).find("a").attr("href");return hash=hash.substring(0,hash.length-4)}function f(b){a(b).addClass("active");a(c(b)).show();a(b).siblings("li").each(function(){a(this).removeClass("active");a(c(this)).hide()})}return this.each(function(){function b(){location.hash&&a(d).find("a[href="+location.hash+"]").length>0&&f(a(d).find("a[href="+location.hash+"]").parent())}var d=this,g={ul:a(d)};a(this).find("li a").each(function(){a(this).attr("href", a(this).attr("href")+"-tab")});location.hash&&b();setInterval(b,100);a(this).find("li").each(function(){a(this).hasClass("active")?a(c(this)).show():a(c(this)).hide()});e&&e(g)})}})})(jQuery);

// $('.ovx-tabs').tabify();




/* Set the width of the side navigation to 250px and the left margin of the page content to 250px and add a black background color to body */

//  $(document).ready(larg);

//  $(window).resize(larg);

// function larg(){
// var r = ( $('#header').innerHeight() + 25);
// var sticky = $('.container.continue');
// var stickyheight = $('.container.continue .pure-g').outerHeight();
// var contentheight = $('.container.continue').offset().top + stickyheight;

//    if ($(".checkout-page.checkout2,.dashboard,.sample-dashboard").length > 0){  /* check if sticky needed on page or not*/
// var w = $('.container').width() ;

//  $(window).scroll(function () {
// 	 var doc_height = $(this).scrollTop()+ $(this).height();

//         if ($(this).scrollTop() >= r && doc_height <= contentheight){
//             sticky.addClass("sticky");
//              $('.continue .pure-g').css('width', w);

//    //$("#content").css("padding-bottom",stickyheight);
//         } else {
//             sticky.removeClass("sticky");
//  //$("#content").css("padding-bottom","2em");
//         }
//     });
//     }

// }

// $(document).ready(function () {
// setTimeout(function() {
//  if ($('.home-page').length) {
//    $.magnificPopup.open({
//         modal:true,  closeBtnInside: false,
//     items: {
//         src: '#subscribe'
//     },
//     type: 'inline'
//       });
//    }
//  }, 2000);
// });
// $('.alert-modal').magnificPopup({

//   callbacks : {

//     open : function(){
//        $.ajax({
//           type: "POST",
//           url: "insertVote.php",
//           data: dataString,
//           cache: false,
//           success: function(html) {
//              parent.html(html);
//           }
//        });
//     }
//   }
// });




// });






































