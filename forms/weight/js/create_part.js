$(document).ready(function() {
  var counter = 0;
  //allows bootstrap alerts to work
  $('.alert').alert();

  //main form submit
  $("#create").submit(function(event) {
    event.preventDefault(); //!!!//
    $(".alert").removeClass('show'); //Remove alert (if there is one open)

    var PartId = $("#aaa").val()
    var TargetWt = $("#bbb").val(); //Get barcode
    var PlusMinusWt = $("#ccc").val(); //Get barcode

    //Data to be sent--
    submitData = {
      'PartId': PartId,
      'TargetWt': TargetWt,
      'PlusMinusWt': PlusMinusWt
    };

    $.ajax({
      method: 'post', //Details about Ajax call (POST)
      url: '/forms/weight/php/create_part.php',
      data: submitData, //Data -> sent to url w/ post call
      //------------------------------------------------------------------------
      //--Replies from url------------------------------------------------------
      success: function(data) { //Success ------
        console.log(data);
        var d = $.parseJSON(data); //parse data into Dictionary
        //--debug--//--------------
        //console.log(submitData);
        console.log(d);
        console.log("Success");
        console.log(submitData);
        //console.log(d['result']);
        //--------------------------
        if (d['result'] == true) { //Everything went fine
          counter++;
          changeCounter()
          raiseAlert("none", true); //Raise success alert
          showSubmitData(PartId, true, "none"); //Enter success into table
        }
      },
      //------------------------------------------------------------------------
      error: function(data) { //Error// --Generic
        console.log(data);
        raiseAlert("none", false); //Raise error
        showSubmitData(PartId, false, "none"); //Enter error into table
      }
      //End of replies from url ------------------------------------------------
    }); //End of Ajax call
    $("#aaa").val("");
    $("#bbb").val("");
    $("#ccc").val("");


  }); //Done Submit Funtion

  //This function shows input Success/Errors on the table
  function showSubmitData(PartId, success, e) {
    if (success == true) { //If successful ---
      tableLine = '<tr PartId="addedrow"><th>' + counter + '</th>';
      tableLine += "<th class='alert-success'>Success</th></tr>"; //Show Green
    } else { //If error ---------------------
      tableLine = "<tr PartId='addedrow'><th class='alert-danger'>Error</th><th class='alert-danger'>" + PartId + '</th>'; //Know error duplicate \/                                                        //Unknown error// --Generic
      tableLine += "<th class='alert-danger'>Error: not sure what happened</th></tr>";
    }


    $(tableLine).prependTo('#dataTable > tbody'); //Add tableLine to top row
  }; //Done showSubmitData

  //Deals with Bootstrap Alerts
  function raiseAlert(PartId, success) {
    if (success == true) { //If successful---------
      if ($(".alert").hasClass("alert-danger")) { //If danger class
        $(".alert").removeClass("alert-danger"); //Remove danger class//
      };

      $(".alert").addClass("alert-success"); //Add success class \/ add text
      $("#alertText").html("<strong>Success!</strong> Everything went good.");
      //--------------------------------------------------------------------------
    } else { //If error---------------
      if ($(".alert").hasClass("alert-success")) { //If success class
        $("alert").removeClass("alert-success"); //Remove success class//
      };

      $(".alert").addClass("alert-danger"); //Add danger class

      if (PartId != "none") { //if id is given - (known error) \/ enter text
        $("#alertText").html("<strong>Error!</strong> '" + PartId + "' Data not submitted");
      } else { //Unknown error// --Generic
        $("#alertText").html("<strong>Error!</strong> Something went wrong.");
      }
    }

    //Show alert (success or error) and add cool lookin animation//
    $(".alert").addClass('show');
    $(".alert").fadeTo(2000, 500).slideUp(500, function() {
      $(".alert").slideUp(500);
    });
  } //End raiseAlert

  function changeCounter() {
    $("#count").html(counter);
  }

  //Override alert's default X -> "Close"
  $('a').click(function(e) {
    e.preventDefault(); //!!!//

    //Instead of default (destroying alert)
    //Only hide and keep reusing the same alert---
    $(".alert").removeClass('show');
    return false;
  }); //End Override

}); //End Document Ready------
