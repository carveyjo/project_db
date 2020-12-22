///////////////////////////////////////////////////////////////////////////////
jQuery.fn.dataTable.Api.register('average()', function() {
  var data = this.flatten();
  var sum = data.reduce(function(a, b) {
    return (a * 1) + (b * 1); // cast values in-case they are strings
  }, 0);

  len = data.reduce((acc, cv) => (cv) ? acc + 1 : acc, 0);
  return [(sum / len), len];
});

jQuery.fn.dataTable.Api.register('standardDev()', function(avg, len, col) {
  var data = this.flatten();

  var squareDiffs = data.map(function(value) {
    var diff = value - avg;
    var sqrDiff = diff * diff;
    return sqrDiff;
  });

  var sumSquareDiff = squareDiffs.reduce(function(a, b) {
    return (a * 1) + (b * 1);
  }, 0);

  avgSquareDiffPopulation = (sumSquareDiff / len)
  avgSquareDiffSample = (sumSquareDiff / (len - 1))

  return [Math.sqrt(avgSquareDiffPopulation), Math.sqrt(avgSquareDiffSample)];
});
///////////////////////////////////////////////////////////////////////////////
function getUpdateHeader() {
  nThead = $(".dataTables_scrollHead").find("thead");
  aLayout = []

  var nTrs = $(nThead).children('tr');
  var nTr, nCell;
  var i, k, l, iLen, jLen, iColShifted, iColumn, iColspan, iRowspan;
  var bUnique;
  var fnShiftCol = function(a, i, j) {
    var k = a[i];
    while (k[j]) {
      j++;
    }
    return j;
  };

  aLayout.splice(0, aLayout.length);

  /* We know how many rows there are in the layout - so prep it */
  for (i = 0, iLen = nTrs.length; i < iLen; i++) {
    aLayout.push([]);
  }

  /* Calculate a layout array */
  for (i = 0, iLen = nTrs.length; i < iLen; i++) {
    nTr = nTrs[i];
    iColumn = 0;

    /* For every cell in the row... */
    nCell = nTr.firstChild;
    while (nCell) {
      if (nCell.nodeName.toUpperCase() == "TD" ||
        nCell.nodeName.toUpperCase() == "TH") {
        /* Get the col and rowspan attributes from the DOM and sanitise them */
        iColspan = nCell.getAttribute('colspan') * 1;
        iRowspan = nCell.getAttribute('rowspan') * 1;
        iColspan = (!iColspan || iColspan === 0 || iColspan === 1) ? 1 : iColspan;
        iRowspan = (!iRowspan || iRowspan === 0 || iRowspan === 1) ? 1 : iRowspan;

        /* There might be colspan cells already in this row, so shift our target
         * accordingly
         */
        iColShifted = fnShiftCol(aLayout, i, iColumn);

        /* Cache calculation for unique columns */
        bUnique = iColspan === 1 ? true : false;

        /* If there is col / rowspan, copy the information into the layout grid */
        for (l = 0; l < iColspan; l++) {
          for (k = 0; k < iRowspan; k++) {
            aLayout[i + k][iColShifted + l] = {
              "cell": nCell,
              "unique": bUnique
            };
            aLayout[i + k].nTr = nTr;
          }
        }
      }
      nCell = nCell.nextSibling;
    }
  }
  return aLayout;
};
///////////////////////////////////////////////////////////////////////////////
function createColFilterListener(obj, column) {
  $('.table').on('change', ("." + $(obj).attr("class")), function() {
    // -- on change event --
    // get value selected
    var val = $.fn.dataTable.util.escapeRegex(
      $(this).val()
    );
    // call search function and then redraw table
    column
      .search(val ? '^' + val + '$' : '', true, false)
      .draw();
    // -- on change event END --
  });
};

function createColButtonFilterListener(obj, column) {
  $('.table').on('change', ("." + $(obj).attr("class")), function() {
    // -- on change event --
    // get value selected
    var val = $.fn.dataTable.util.escapeRegex(
      $(this).val()
    );
    // call search function and then redraw table

    // [0-9]+__val
    column
      .search(val ? val : '', true, false)
      .draw();
    // -- on change event END --
  });
};

function approveBtnClick(column, table) {
  $('.table').on('click', ".approveBtn", function() {
    temp = this.value.split("__");

    data = {
      'KeyId': temp[0]
    };

    $.ajax({
      method: 'post',
      url: '/tables/php/weight_approve.php',
      data: data,
      success: function(data) {
        if (data['result'] != false) {
          //. update value
          table.cell(temp[1], 2).data(table.cell(temp[1], 2).data().split("__")[0] + "__Approve")

          // redrawing doesn't render with new class
          $.each($('.dataTable tbody'), function(i, t) {
            // loop through both tables, change correct row's class
            $($(t).children('tr[rowrun="' + temp[1] + '"]'))
              .removeClass('rejectrow pendingrow cancelrow')
              .addClass('approverow')
          })

        };
      },
    });
  });
}

function rejectBtnClick(column, table) {
  $('.table').on('click', ".rejectBtn", function() {
    temp = this.value.split("__");

    data = {
      'KeyId': temp[0]

    };
    $.ajax({
      method: 'post',
      url: '/tables/php/weight_reject.php',
      data: data,
      success: function(data) {
        if (data['result'] != false) {
          //. update value
          table.cell(temp[1], 2).data(table.cell(temp[1], 2).data().split("__")[0] + "__Reject")

          $.each($('.dataTable tbody'), function(i, t) {
            // loop through both tables, change correct row's class
            $($(t).children('tr[rowrun="' + temp[1] + '"]'))
              .removeClass('approverow pendingrow cancelrow')
              .addClass('rejectrow')
          })

        };
      },
    });
  });
}
///////////////////////////////////////////////////////////////////////////////

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

$(document).ready(function() {
  var TableWasLoaded = false;
  var ColsToCalc = [9];
  var urlvars = getUrlVars();

  if (urlvars['search']) {
    $("body").append("<div class='spinner'></div>");
    var datatableVar = $('#myTable').DataTable({
      "ajax": {
        "url": "/tables/php/weight_table.php",
        "data": {
          'searchValue': urlvars['search']
        }
      },
      'dom': 'Bfrtip',
      'buttons': [
        'copyHtml5',
        'excelHtml5',
        'csvHtml5'
      ],
      "columnDefs": [{
          "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          "className": 'text-center',
          "orderable": true,
        },
        {
          "targets": 2,
          "orderable": false,
          "className": 'text-center',
          "render": function(data, type, full, meta) {
            s = data.split("__")
            return '<button class="statusBtn btn btn-primary ' + s[1] + '" value="' + s[0] + '"">' + s[1] + '</button>';
          }
        },
        {
          "targets": 3,
          "visible": false,
          "className": 'text-center',
        },
        {
          "targets": 13,
          "orderable": false,
          "className": 'text-center',
          "render": function(data, type, full, meta) {
            return '<button class="approveBtn btn btn-success" value="' + data + '__' + meta['row'] + '">Approve</button>';
          }
        },

        {
          "targets": 14,
          "orderable": false,
          "className": 'text-center',
          "render": function(data, type, full, meta) {
            return '<button class="rejectBtn btn btn-info" value="' + data + '__' + meta['row'] + '" >Reject</button>';
          }
        },
        {
          "targets": 15,
          "orderable": false,
          "className": 'text-center',
          "render": function(data, type, full, meta) {
            s = data.split("__")
            return '<button class="cancelBtn btn btn-danger" value="' + data + '__' + meta['row'] + '"">Cancel</button>';
          }
        },
      ],
      "paging": false,
      "pagingType": "full_numbers",
      "lengthMenu": [50, 50, 100, 200, 400],
      'scrollY': "70vh",
      'scrollX': true,
      'scrollCollapse': true,
      'fixedColumns': {
        'leftColumns': 2
      },

      initComplete: function() {
        // Runs after the table has been rendered for the first time --

        // ---- DropDown Filters ----
        // Create extra header row to hold dropdowns
        $('thead').append('<tr class="dropDownRow" role="row"></tr>');
        // loop through columns
        //  create new cell in header, fill cell with select,
        //    add onchange event -> filter by selected value
        this.api().columns().every(function(index) {
          var column = this;

          if (index != 3) {
            // not a hidden column -

            // add new cell to header
            var newHeaderColumn = $('<th></th>').appendTo($(".dropDownRow"))

            // if it's not a excempt column -> add dropdown
            //  ex btns or links, shouldn't have a filter
            if (index != 13 && index != 14 && index != 15) {

              // add select to new cell, attach onChange event to select field
              var select = $('<select class="ColSelect_' + index + '"><option value=""></option></select>')
                .appendTo($(newHeaderColumn))

              createColFilterListener(select, column);

              // fill select field with unique values
              if (index == 2) {
                column.data().unique().sort().each(function(d, j) {
                  temp = d.split("__")
                  // check if current cell is empty
                  if (temp[1] != null && temp[1].trim() != "") {
                    // append to select field
                    select.append('<option value="' + temp[1] + '">' + temp[1] + '</option>')
                  };
                });
              } else {
                column.data().unique().sort().each(function(d, j) {
                  // check if current cell is empty
                  if (d != null && d.trim() != "") {
                    // append to select field
                    select.append('<option value="' + d + '">' + d + '</option>')
                  };
                });
              };
            };
          } else {


            if (index == 3) {
              approveBtnClick(column, this, index);
              rejectBtnClick(column, this, index);
            }

          };

        });

        // ---- DropDown Filters END ----

        // flag to show this innit funtion has ran..
        // - next draw event will do avgs and stddev
        //    see: "drawCallback"
        TableWasLoaded = true;

        // redraw the table..
        // finds avgs and stddev + match columns widths with new header rows
        this.api().draw()
        // this.api().columns(22).search().draw();

        // update datatable's internal header list
        this.api().context[0]['aoHeader'] = getUpdateHeader();

      },

      createdRow: function(row, data, index) {
        if (data[3] == "Reject") {
          $(row).addClass("rejectrow");
        } else if (data[3] == "Pending") {
          $(row).addClass("pendingrow");
        } else if (data[3] == "Approve") {
          $(row).addClass("approverow");
        } else if (data[3] == "Cancel") {
          $(row).addClass("cancelrow");
        }
      },
    });
  } else {
    var datatableVar = $('#myTable').DataTable({
      "ajax": '/tables/php/weight_table.php',
      'dom': 'Bfrtip',
      'buttons': [
        'copyHtml5',
        'excelHtml5',
        'csvHtml5'
      ],
      "columnDefs": [{
          "targets": [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
          "className": 'text-center',
          "orderable": true,
        },
        {
          "targets": 2,
          "orderable": false,
          "className": 'text-center',
          "render": function(data, type, full, meta) {
            s = data.split("__")
            return '<button class="statusBtn btn btn-primary ' + s[1] + '" value="' + s[0] + '"">' + s[1] + '</button>';
          }
        },
        {
          "targets": 3,
          "visible": false,
          "className": 'text-center',
        },
        {
          "targets": 13,
          "orderable": false,
          "className": 'text-center',
          "render": function(data, type, full, meta) {
            return '<button class="approveBtn btn btn-success" value="' + data + '__' + meta['row'] + '">Approve</button>';
          }
        },

        {
          "targets": 14,
          "orderable": false,
          "className": 'text-center',
          "render": function(data, type, full, meta) {
            return '<button class="rejectBtn btn btn-info" value="' + data + '__' + meta['row'] + '" >Reject</button>';
          }
        },
        {
          "targets": 15,
          "orderable": false,
          "className": 'text-center',
          "render": function(data, type, full, meta) {
            s = data.split("__")
            return '<button class="cancelBtn btn btn-danger" value="' + data + '__' + meta['row'] + '"">Cancel</button>';
          }
        },
      ],
      "paging": false,
      "pagingType": "full_numbers",
      "lengthMenu": [50, 50, 100, 200, 400],
      'scrollY': "70vh",
      'scrollX': true,
      'scrollCollapse': true,
      'fixedColumns': {
        'leftColumns': 2
      },

      initComplete: function() {
        // Runs after the table has been rendered for the first time --

        // ---- DropDown Filters ----
        // Create extra header row to hold dropdowns
        $('thead').append('<tr class="dropDownRow" role="row"></tr>');
        // loop through columns
        //  create new cell in header, fill cell with select,
        //    add onchange event -> filter by selected value
        $('.dataTables_filter input').unbind().bind('keyup', function() {
          var searchTerm = this.value.toLowerCase().trim();
          if (!searchTerm) {
            datatableVar.draw()
            return
          }
          datatableVar.search(searchTerm.split(" ").join("|"), true, false).draw();
          $.fn.dataTable.ext.search.pop()
        });
        this.api().columns().every(function(index) {
          var column = this;

          if (index != 3) {
            // not a hidden column -

            // add new cell to header
            var newHeaderColumn = $('<th></th>').appendTo($(".dropDownRow"))

            // if it's not a excempt column -> add dropdown
            //  ex btns or links, shouldn't have a filter
            if (index != 13 && index != 14 && index != 15) {

              // add select to new cell, attach onChange event to select field
              var select = $('<select class="ColSelect_' + index + '"><option value=""></option></select>')
                .appendTo($(newHeaderColumn))

              if (index == 2) {
                createColButtonFilterListener(select, column);
              } else {
                createColFilterListener(select, column);
              }

              // fill select field with unique values
              if (index == 2) {
                // if column is status, break up url data
                valuesAlreadyInList = []
                column.data().unique().sort().each(function(d, j) {
                  temp = d.split("__")
                  // check if current cell is empty
                  if (temp[1] != null && temp[1].trim() != "") {
                    //if item is not in the list already
                    if ($.inArray(temp[1], valuesAlreadyInList) == -1) {
                      // append to select field
                      select.append('<option value="' + temp[1] + '">' + temp[1] + '</option>')
                      valuesAlreadyInList.push(temp[1])
                    }
                  };
                });
              } else {
                column.data().unique().sort().each(function(d, j) {
                  // check if current cell is empty
                  if (d != null && d.trim() != "") {
                    // append to select field
                    select.append('<option value="' + d + '">' + d + '</option>')
                  };
                });
              };
            };
          } else {


            if (index == 3) {
              approveBtnClick(column, this, index);
              rejectBtnClick(column, this, index);
            };

          };

        });

        // ---- DropDown Filters END ----

        // flag to show this innit funtion has ran..
        // - next draw event will do avgs and stddev
        //    see: "drawCallback"
        TableWasLoaded = true;

        // redraw the table..
        // finds avgs and stddev + match columns widths with new header rows
        this.api().draw()
        // this.api().columns(22).search().draw();

        // update datatable's internal header list
        this.api().context[0]['aoHeader'] = getUpdateHeader();

      },

      createdRow: function(row, data, index) {
        $(row).attr('rowrun', index);
        if (data[3] == "Reject") {
          $(row).addClass("rejectrow");
        } else if (data[3] == "Pending") {
          $(row).addClass("pendingrow");
        } else if (data[3] == "Approve") {
          $(row).addClass("approverow");
        } else if (data[3] == "Cancel") {
          $(row).addClass("cancelrow");
        }
      },
    });
  };

  $('body').on('click', '.statusBtn', function() {
    if ($(this).hasClass("Pending")) {
      $("#StatusModal").modal('show')
      $('#nzzz').attr('value', $(this).attr('value'))
    } else if ($(this).hasClass("Approve")) {
      $("#StatusModal").modal('show')
      $('#nzzz').attr('value', $(this).attr('value'))
    } else if ($(this).hasClass("Reject")) {
      $("#StatusModal").modal('show')
      $('#nzzz').attr('value', $(this).attr('value'))
    } else if ($(this).hasClass("Cancel")) {
      $("#StatusModal").modal('show')
      $('#nzzz').attr('value', $(this).attr('value'))
    }
  });
  $('body').on('click', '.cancelBtn', function() {
    $("#CancelModal").modal('show')
    $('#rxax').attr('value', $(this).attr('value'))
  });

});
