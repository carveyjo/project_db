var weight = null

function addToCounter() {
  $("#counterDiv").html(parseInt($("#counterDiv").html()) + 1);
};

function HasErrors() {
  errors = false;
  $.each($(".inputfield:visible"), function(c, obj) {
    if ($(obj).val() == "") {
      $(obj).addClass("border border-danger");
      errors = true;
    } else {
      $(obj).removeClass("border border-danger");
    };
  });
  return errors;
};

function isBadWeight(field) {
  if (isNaN(field.val()) || parseFloat(field.val()) < parseFloat($("#TargetWt").html()) - parseFloat($('#PlusMinusWt').html()) ||
    parseFloat(field.val()) > parseFloat($("#TargetWt").html()) + parseFloat($('#PlusMinusWt').html())) {
    field.addClass('border border-warning');
    return true;
  } else {
    field.removeClass('border border-warning');
    return false;
  };
};

// Gets data from all fields for ajax POST
function GetData() {

  data = {
    'PartId': $("#PartField").val().trim(),
    'Weight1': $("#input_1").val(),
    'Weight2': $("#input_2").val(),
    'Weight3': $("#input_3").val(),
    'Weight4': $("#input_4").val(),
    'Weight5': $("#input_5").val(),
    'Plant': $("#Plant").html(),
    'PartTable': $("#PartTable").html(),
  };
  return data;
};

function HideAndRemoveValsFromAllFields() {
  $(".inputfield")
    .val("")
    .attr('hidden', true);
};

// id: PartId || success: true/false
function raiseAlert(id, success, error) {
  if (success == true) {
    if ($(".alert").hasClass("alert-danger")) {
      $(".alert").removeClass("alert-danger");
    };

    $(".alert").addClass("alert-success");
    $("#alertText").html("<strong>Success!</strong> Success.");
  } else {
    if ($(".alert").hasClass("alert-success")) {
      $("alert").removeClass("alert-success");
    };

    $(".alert").addClass("alert-danger");

    if (id != "none") { //if id is given - (known error) \/ enter text
      $("#alertText").html("<strong>Error!</strong> '" + id + "' Data not submitted, talk to tech team");
    } else if (error = 1) {
      $("#alertText").html("<strong>Error!</strong> PartId scanned in wrong field.");
    } else { //Unknown error// --Generic
      $("#alertText").html("<strong>Error!</strong> Something went wrong.");

    }
  }
  $(".alert").addClass('show');
  $(".alert").fadeTo(2000, 500).slideUp(500, function() {
    $(".alert").slideUp(500);
  });
}

function showSubmitData(id, Weight1, Weight2, Weight3, Weight4, Weight5, success, e) {
  if (success == true) {
    tableLine = '<tr id="addedrow"><th>' + id + '</th><th>' + Weight1 + '</th><th>' + Weight2 + '</th><th>' +
      Weight3 + '</th><th>' + Weight4 + '</th><th>' + Weight5 + '</th>';
    tableLine += "<th class='alert-success'>Success</th></tr>"; //Show Green
  } else {
    tableLine = '<tr id="addedrow"><th>' + id + '</th><th>' + Weight1 + '</th><th>' + Weight2 + '</th><th>' +
      Weight3 + '</th><th>' + Weight4 + '</th><th>' + Weight5 + '</th>'; //If error ---------------------
    if (e != "none") { //Know error duplicate \/
      tableLine += "<th class='alert-danger'>Error: '" + id + "' Data not submitted, talk to tech team</th></tr>";
    } else { //Unknown error// --Generic
      tableLine += "<th class='alert-danger'>Error: not sure what happened</th></tr>";
    };
  };

  $(tableLine).prependTo('#dataPartTable > tbody');
};

$(document).ready(function() {
  $(".inputfield").change(function() {
    if (isBadWeight($(this))) {
      showErrorDiv("Weight " + $(this).attr('id').split("_")[1] + " is out of spec")
      PlaySound();
    };
  });

  $('#PartField').change(function() {
    if (!$(this).val()) {
      HideAndRemoveValsFromAllFields();
      return;
    };

    submitData = {
      'id': $(this).val().trim(),
      'Type': $("#Type").html()
    }

    $.ajax({
      method: 'post',
      url: 'php/weight_getWt.php',
      data: submitData,
      success: function(data) {
        var d = $.parseJSON(data)
        if (d['status']) {
          $('#PlusMinusWt').html(d['PlusMinusWt']['PlusMinusWt'])
          if (d['data'][0]['TargetWt'] && d['data']['TargetWt'] != '') {
            $("#TargetWt").html(d['data'][0]['TargetWt']);
          } else {
            alert("STOP!! There is no TargetWt");
          }
        } else {
          alert("PartId does not exist");
        }
      },
      error: function(data) {
        console.log(data)
      }
    });

    PartType = $(this).val().trim().slice(3, 6)

    fieldsToShow = 0;
    if (PartType == "001") {
      fieldsToShow = 1;
    } else if (PartType == "002") {
      fieldsToShow = 5;

    } // Do for Each Part Tag // use || (or) to make it smaller

    for (i = 0; i <= fieldsToShow; i++) {
      currentId = "#input_" + i
      $(currentId).removeAttr('hidden');
    };

    $('#input_1').focus();
  });

  $("#submitBtn").click(function() {
    if (HasErrors()) {
      return;
    }

    $.ajax({
      method: 'post',
      url: 'php/weight.php',
      data: GetData(),
      success: function(data) {
        var d = $.parseJSON(data);
        HideAndRemoveValsFromAllFields();
        $('#PartField').val('');
        $('#PartField').focus();
        addToCounter();

        if (d['result'] == true) {
          $('.border-warning').removeClass('border-warning');
          showSuccessDiv('!');
          showSubmitData(d['post1'], d['post2'], d['post3'], d['post4'], d['post5'], d['post6'], true, "success");
        } else { // Barcode Data not submitted, talk to tech team
          showErrorDiv('error')
          showSubmitData(d['post1'], d['post2'], d['post3'], d['post4'], d['post5'], d['post6'], false, "duplicate");
        }
      },
      error: function(data) {
        showErrorDiv("none", false, 0);
        showSubmitData(d['post1'], false, "none");
        CaddToCounter();
      }
    });
  });

  $('a').click(function(e) {
    e.preventDefault();
    $(".alert").removeClass('show');
    return false;
  });
});
