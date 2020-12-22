$(document).ready(function() {
  var urlvars = getUrlVars();
  //////////////////////////////////////////////////////////////////////////////
  var chart = null;
  var xMax;
  var xMin;

  function postSearch(data) {
    $.ajax({
      method: 'post',
      url: 'php/weight_chart.php',
      data: data,
      success: function(data) { //Success ------
        // console.log(data);
        temp = JSON.parse(data);
        $(".spinner").remove();
        generateGraph(temp);
      },
      error: function(data) { //Error//
        $(".spinner").remove();
        $('#myTable').html("");
        $('#myTable').html("<h1>Something went wrong!!</h1>");
      }
    });
  }

  function getUrlVars() {
    var vars = [],
      hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for (var i = 0; i < hashes.length; i++) {
      hash = hashes[i].split('=');
      vars.push(hash[0]);
      vars[hash[0]] = hash[1];
    }
    return vars;
  }

  function getDataPoints(name, data, count) {
    temp = []
    min = data['MinTargetWt']
    max = data['MaxTargetWt']
    delete data['id']
    delete data['MinTargetWt']
    delete data['MaxTargetWt']
    $.each(data, function(index, value) {
      if (value != '') {
        temp.push({
          y: parseFloat(value),
          x: parseFloat(count),
          click: function(e) {
            window.location = value["Url"]
          }
        });
        count += 1
      }
    });
    return [temp, count, min, max];
  };

  function generateGraph(graphDict) {
    var data = []
    count = 0
    minArray = []
    maxArray = []

    $.each(graphDict, function(key, value) {
      tempArray = getDataPoints(key, value, count)
      dataPoints = tempArray[0];
      count = tempArray[1];
      // console.log(tempArray[2] + "\t" + (tempArray[2] in minArray));
      if (minArray.indexOf(parseInt(tempArray[2])) == -1) {
        minArray.push(parseInt(tempArray[2]));
      }
      if (maxArray.indexOf(parseInt(tempArray[3])) == -1) {
        maxArray.push(parseInt(tempArray[3]));
      }

      temp = {
        type: "scatter",
        showInLegend: false,
        name: key,
        dataPoints: dataPoints
      }
      data.push(temp);
    });

    stripLinesList = []
    $.each(minArray, function(counter, value) {
      if (counter == 0) {
        color = "#d8d8d8"
      } else {
        color = "#97dbaf"
      }

      stripLinesList.push({
        startValue: parseFloat(value),
        endValue: parseFloat(maxArray[counter]),
        color: color,
        labelFontColor: "#a8a8a8"
      })
    })




    chart = new CanvasJS.Chart("chartContainer1", {
      title: {
        text: "Part WT",
        fontSize: 25,
        fontFamily: "arial"
      },
      zoomEnabled: true,
      exportEnabled: true,
      zoomType: "xy",
      rangeChanged: function(e) {

        xMin = chart.axisX[0].viewportMinimum;
        xMax = chart.axisX[0].viewportMaximum;
        $('#xMinChange1').val(xMin);
        $('#xMaxChange1').val(xMax);


        yMin = chart.axisY[0].viewportMinimum;
        yMax = chart.axisY[0].viewportMaximum;
        $('#yMinChange1').val(yMin);
        $('#yMaxChange1').val(yMax);
      },

      axisY: {
        titlefontSize: 13,
        titleFontFamily: "arial",
        title: "Weight (g)",
        stripLines: stripLinesList
      },
      axisX: {
        titlefontSize: 13,
        titleFontFamily: "arial",
        title: "Quantity of WTs"
      },
      data: data
    });
    chart.render();
  };

  if (urlvars['search']) {
    //Data to be sent--
    $("body").append("<div class='spinner'></div>");
    submitData = {
      'searchValue': urlvars['search']
    }; //----------------
    // console.log(submitData)
    postSearch(submitData);
  } else {
    $.ajax({
      method: 'get',
      url: 'php/weight_chart.php',
      success: function(data) {
        // console.log(data);
        temp = JSON.parse(data);
        generateGraph(temp);
      },
      error: function(data) { //Error//
        console.log("error");
      }
    });
  };

  $("#main_table_search").submit(function(event) {
    event.preventDefault(); //!!!//
    $("body").append("<div class='spinner'></div>");
    var searchValue = $("#valueToSearch").val(); //Get barcode

    //Data to be sent--
    submitData = {
      'searchValue': searchValue
    }; //----------------
    $("#main_table_search").append("<div class='spinner'></div>");
    postSearch(submitData);
  });

  $("#graphOneZoombtn").click(function() {
    event.preventDefault();

    // console.log("Click 10")
    if ($('#xMinChange1').val().trim() != "") { //if textbox is NOT empty

      val = $('#xMinChange1').val();
      xMin = val

      chart.options.axisX.viewportMinimum = xMin; //else Change1 chart settings
    };
    if ($('#xMaxChange1').val().trim() != "") { //if textbox is NOT empty

      val = ($('#xMaxChange1').val());
      xMax = val

      chart.options.axisX.viewportMaximum = xMax; //else Change1 chart settings
    };

    if (isNaN(parseFloat($('#yMinChange1').val())) == false) {
      chart.options.axisY.viewportMinimum = parseFloat($('#yMinChange1').val());
    };
    if (isNaN(parseFloat($('#yMaxChange1').val())) == false) {
      chart.options.axisY.viewportMaximum = parseFloat($('#yMaxChange1').val());
    };
    chart.render();
  })
});
