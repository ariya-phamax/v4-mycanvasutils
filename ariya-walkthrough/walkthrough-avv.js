$(document).ready(function () {
  // introJs()
    // .setOptions({
      // steps: [
        // {
          // title: "<img src='/icon-color.png' width=40>",
          // element: document.querySelector("#aav-hightlight"),
          // intro:
          //   `
          //   Let me suggest you something interesting we have worked on to empower anyone living with or affected by AAV. The AAV MASTERCLASS programme.
          //   <video id="making_of" width="300" controls autoplay">
          //       <source src="/site/templates/videos/making_of_video_en.mp4" type="video/mp4"/>     
          //   </video>
          //   <button type="button" id="register-btn">Register here</button>
          //   `
        // },
      // ],
    // })
    // .start();

    const registerEle = document.querySelector("#register-btn");
    registerEle.onclick = () =>{
      $('#aav-content').removeAttr('id');
      $('#making_of').get(0).pause()
      $("#aav-content-right").fadeOut();
      $("#aav-highlight").removeAttr('id');
      $(".ariya-float-icon").click()
      $(".close-btn").click()
    }

    $(".close-btn").click(function(){
      $(".close").fadeOut();
      $('#making_of').get(0).pause()
      $("#aav-highlight").removeAttr('id');
      $(".aav-text-light").removeAttr('class');
    })


    $("#aav-content-right").delay(10000).fadeIn("fast", function(){
      $('#making_of').get(0).play()
    });
});
