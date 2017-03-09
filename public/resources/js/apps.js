(function() {
  "use strict";

  // Global defenition
  if (typeof App != "object") {
    window.App = {};
  }

  App.BaseUrl = location.protocol + '//' + location.host;
  App.API_BaseUrl = location.protocol + '//' + location.host + '/api';
  App.User = {};
  App.Mustache = $.Mustache;
  App.Mustache.directory = App.BaseUrl + '/mustache';


  if(window.isLogin) {

    var currentUser = $.jStorage.get('current_user');

    if( _.isObject(currentUser) ) {

      App.User.session = currentUser;

    } else {
      $.ajax({
        url : App.API_BaseUrl + '/user/current/',
        type: 'GET',
        cache: true,
        async: false,
        success: function (res) {
          var data = res.data;

          App.User.session = res.data;

          $.jStorage.set("current_user", App.User.session, {TTL : 60000});
        }
      });
    }
  }
}());

NProgress.configure({ ease: 'ease', speed: 500, trickle: false });
NProgress.start();

$(window).load(function() {
  // executes when complete page is fully loaded, including all frames, objects and images
  NProgress.done();
});

(function() {
  "use strict";
  App.User = _.extend( App.User, {
    init: function () {
      this.forgotPassword();
      this.resetPassword();
    },
    forgotPassword: function () {
      var formForgot = $('form.form-forgot-password');

      formForgot.submit(function(e) {
        e.preventDefault();

      }).validate({
        rules: {
          email: {
            required: true,
            email: true
          }
        },
        submitHandler : function(form){

          var emailInput = formForgot.find('input[type="text"]');

          var btnSubmit = formForgot.find('.btn-forgot');

          $.ajax({
            url      : App.BaseUrl + '/forgot-password',
            type     : 'POST',
            dataType : "json",
            data     : {
              '_csrf': $('input[name="_csrf"]').val(),
              email: emailInput.val()
            },
            beforeSend: function(xhr, opts){
              btnSubmit.attr('disabled', 'disabled');
              NProgress.start();
            }
          })
          .fail(function(res) {
            NProgress.done();
            btnSubmit.attr('disabled', false);

            if(_.isObject(res.responseJSON.error)) {
              Notifier.show(res.responseJSON.error.message, 'err');
            } else {
              Notifier.show(res.responseJSON.message, 'err');
            }
          })
          .done(function(res) {
            NProgress.done();
            emailInput.val('');
            Notifier.show('An e-mail has been sent to' + emailInput.val() + ' with further instructions.' );
            btnSubmit.attr('disabled', false);
          });
        }
      });
    },
    resetPassword: function () {
      var formReset = $('form.form-reset-password');

      formReset.submit(function(e) {
        e.preventDefault();

      }).validate({
        rules: {
          new_password: {
            required: true,
            minlength: 6
          },
          confirm_new_password: {
            required: true,
            minlength: 6,
            equalTo: "#new_password"
          }
        },
        messages: {
          new_password: {
            required: "Please provide a password",
            minlength: "Your password must be at least 6 characters long"
          },
          confirm_new_password: {
            required: "Please provide a confirm password",
            equalTo: "Please enter the same password as above"
          }
        },
        submitHandler : function(form){
          var newPassword  = formReset.find('input#new_password');
          var confirmNewPassword = formReset.find('input#confirm_new_password');
          var btnSubmit = formReset.find('.btn-reset-password');
          var tokenReset = $('input.token').val();

          $.ajax({
            url      : App.BaseUrl + '/reset/' + tokenReset,
            type     : 'POST',
            dataType : "json",
            data : {
              password: newPassword.val(),
              confirm_password : confirmNewPassword.val(),
              '_csrf': $('input[name="_csrf"]').val(),
            },
            beforeSend: function(xhr, opts){
              btnSubmit.attr('disabled', 'disabled');
              NProgress.start();
            }
          })
          .fail(function(res) {
            btnSubmit.attr('disabled', false);
            Notifier.show(res.responseJSON.message, 'err');
            NProgress.done();
          })
          .done(function(res) {
            NProgress.done();
            newPassword.val('');
            confirmNewPassword.val('');
            window.location.href = App.BaseUrl + '/login';
          });
        }
      });
    }
  });

  $(function() {

    App.User.init();

  });

}());

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
