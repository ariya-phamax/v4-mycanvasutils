$(document).ready(function () {
  const askQueryEle = document.querySelector("#intro-start-ariya-btn");
  askQueryEle.onclick = () => {
    $(".ariya-float-icon").click();
    // introJs().exit();
    $("#intro-start").fadeOut();
  };

  $("#right-btn").click(function () {
    $("#intro-start").fadeOut();
    $("#intro-nav").addClass("navbar-ariya-modal");
    $("#intro-nav").fadeIn();
    $(".navigation").addClass("navbar-selected");
    $("#intro-start-nav").addClass("navbar-ariya-modal");
  });

  $("#right-btn-nav").click(function () {
    $(".navigation").removeClass("navbar-selected");
    $("#intro-nav").fadeOut();
    $("#aav-class").addClass("aav-nav-selected");
    $("#aav-selected-nav").fadeIn();
  });

  $("#intro_03").click(function () {
    $("#aav-class").removeClass("aav-nav-selected");
    $(".close-btn").click();
  });

  // $(document).click(function () {
  //   var container = $("#intro-start");
  //   if (!container.is(event.target) && !container.has(event.target).length) {
  //     container.fadeOut();
  //     return
  //   }

  //   let navbar = $("#intro-nav");
  //   if (!navbar.is(event.target) && !navbar.has(event.target).length) {
  //     navbar.fadeOut();
  //   }

  // });

  $(".close-btn").click(function () { 
    $(".close").fadeOut();
    $(".navigation").removeClass("navbar-selected");
    $("#aav-class").removeClass("aav-nav-selected");
  });
  $("#left-btn-nav").click(function () {
    $(".navigation").removeClass("navbar-selected");
    $(".close").fadeOut();
    $("#intro-start").fadeIn();
    event.stopPropagation();
  });
});
