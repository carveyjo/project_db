function showSuccessDiv(msg = null) {
  $('#popupAlert')
    .removeClass('alert-danger')
    .addClass('alert-success');

  if (msg) {
    $("#popupAlertText").html(
      '<strong>Success!</strong> ' + msg
    );
  } else {
    $("#popupAlertText").html(
      '<strong>Success</strong> Form Was Submitted'
    );
  };

  $('#popupAlertDiv').fadeIn('slow', function() {
    $(this).delay(100).fadeOut('slow');
  });
};

function PlaySound() {
  var sound = document.getElementById("audio");
  sound.play()
};

function showErrorDiv(msg = null) {
  $('#popupAlert')
    .removeClass('alert-success')
    .addClass('alert-danger');

  if (msg) {
    $("#popupAlertText").html(
      '<strong>Error!</strong> ' + msg
    );
  } else {
    $("#popupAlertText").html(
      '<strong>Error!</strong> Something Went Wrong'
    );
  };

  $('#popupAlertDiv').fadeIn('slow', function() {
    $(this).delay(4000).fadeOut('slow');
  });
};
$(document).ready(function() {
  $("#popupAlertHide").click(function() {
    $("#popupAlertDiv").stop().fadeOut('slow');
  });
});
