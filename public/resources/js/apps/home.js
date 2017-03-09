$(function() {

  $('#flash-message').delay(7000).fadeOut(5000);

  Home.init();

  NProgress.set(0.3);

});


var Home = App.Home = {
  init: function() {
    var worldSel = document.getElementById("world"),
      frm = document.getElementById("form-choose-world");

    $(frm).submit(function(ev) {
      ev.preventDefault();
      window.location.href = $(frm).attr("action") + "/" + $(worldSel).val();
      return false;
    });

  },
};
