<?php
$connect = mysqli_connect("localhost", "root", "", "project_db");

  function getWeights($row)
  {
    if (is_numeric($row['DetroitWeight1'])) {
        $Weight1 = $row['DetroitWeight1'];
    } elseif (is_numeric($row['TraverseCityWeight1'])) {
        $Weight1 = $row['TraverseCityWeight1'];
    } else {
        $Weight1 = "";
    };
    if (is_numeric($row['DetroitWeight2'])) {
        $Weight2 = $row['DetroitWeight2'];
    } elseif (is_numeric($row['TraverseCityWeight2'])) {
        $Weight2 = $row['TraverseCityWeight2'];
    } else {
        $Weight2 = "";
    };
    if (is_numeric($row['DetroitWeight3'])) {
        $Weight3 = $row['DetroitWeight3'];
    } elseif (is_numeric($row['TraverseCityWeight3'])) {
        $Weight3 = $row['TraverseCityWeight3'];
    } else {
        $Weight3 = "";
    };
    if (is_numeric($row['DetroitWeight4'])) {
        $Weight4 = $row['DetroitWeight4'];
    } elseif (is_numeric($row['TraverseCityWeight4'])) {
        $Weight4 = $row['TraverseCityWeight4'];
    } else {
        $Weight4 = "";
    };
    if (is_numeric($row['DetroitWeight5'])) {
        $Weight5 = $row['DetroitWeight5'];
    } elseif (is_numeric($row['TraverseCityWeight5'])) {
        $Weight5 = $row['TraverseCityWeight5'];
    } else {
        $Weight5 = "";
    };
    if ($row['DetroitCheckInTime'] != "") {
        $WeightCheckInTime = $row['DetroitCheckInTime'];
    } elseif ($row['TraverseCityCheckInTime'] != "") {
        $WeightCheckInTime = $row['TraverseCityCheckInTime'];
    } else {
        $WeightCheckInTime = "";
    };

      $array = array(
      'id' => $row['PartId'],
      'MinTargetWt' => $row['MinTargetWt'],
      'MaxTargetWt' => $row['MaxTargetWt'],
      'w1' => $Weight1,
      'w2' => $Weight2,
      'w3' => $Weight3,
      'w4' => $Weight4,
      'w5' => $Weight5

    );
      return $array;
  }

  if (isset($_POST['searchValue'])) {
      $valuesToSearch = explode(" ", $_POST['searchValue']);

      $queryBase = "SELECT *, dir.TargetWt-dir.PlusMinusWt AS MinTargetWt,dir.TargetWt+dir.PlusMinusWt AS MaxTargetWt
      FROM part_directory dir
      LEFT JOIN weight_detroit det on det.DetroitLotId=dir.PartId
      LEFT JOIN weight_traverse_city tc on tc.TraverseCityLotId=dir.PartId
      WHERE dir.PartId ";

      $query = "";
      foreach ($valuesToSearch as $item) {
          $query .= $queryBase;
          $query .= "LIKE '%".$item."%';";
      }
  } else {
      $query = "SELECT *, dir.TargetWt-dir.PlusMinusWt AS MinTargetWt,dir.TargetWt+dir.PlusMinusWt AS MaxTargetWt
      FROM part_directory dir
      LEFT JOIN weight_detroit det on det.DetroitLotId=dir.PartId
      LEFT JOIN weight_traverse_city tc on tc.TraverseCityLotId=dir.PartId";
  }

  $data_sets = array(); //main return
  $temp = array( );

  if (mysqli_multi_query($connect, $query)) {
      do {
          if ($result = mysqli_store_result($connect)) {
              while ($row = mysqli_fetch_array($result)) {
                  $temp = getWeights($row);
                  $PartId = ($row['PartId']) ;
                  if (array_key_exists($temp['id'], $data_sets)) {
                      $tempArray = $data_sets[$PartId];

                      $tarray1 = $tempArray;
                      array_push($tarray1, $temp['w1']);
                      array_push($tarray1, $temp['w2']);
                      array_push($tarray1, $temp['w3']);
                      array_push($tarray1, $temp['w4']);
                      array_push($tarray1, $temp['w5']);
                      $tempArray = $tarray1;

                      $data_sets[$PartId] = $tempArray;
                  } else {
                      $data_sets[$temp['id']] = $temp;
                  };
              };
          };
      } while (mysqli_next_result($connect));
  } else {
      $result = mysqli_query($connect, $query);
      while ($row = mysqli_fetch_array($result)) {
          $temp = getWeights($row);
          $PartId = ($row['PartId']) ;
          $MinTargetWt = ($row['MinTargetWt']) ;
          $MaxTargetWt = ($row['MaxTargetWt']) ;

          if (array_key_exists($temp['id'], $data_sets)) {
              $tempArray = $data_sets[$PartId];

              $tarray = array( );

              $tarray1 = $tempArray['w1'];
              array_push($tarray1, $temp['w1']);
              $tempArray['w1'] = $tarray1;

              $tarray1 = $tempArray['w2'];
              array_push($tarray1, $temp['w2']);
              $tempArray['w2'] = $tarray1;

              $tarray1 = $tempArray['w3'];
              array_push($tarray1, $temp['w3']);
              $tempArray['w3'] = $tarray1;

              $tarray1 = $tempArray['w4'];
              array_push($tarray1, $temp['w4']);
              $tempArray['w4'] = $tarray1;

              $tarray1 = $tempArray['w5'];
              array_push($tarray1, $temp['w5']);
              $tempArray['w5'] = $tarray1;
          } else {
              $tarray = array( );

              $tarray1 = array( $temp['w1'] );
              $tarray['w1'] = $tarray1;

              $tarray1 = array( $temp['w2'] );
              $tarray['w2'] = $tarray1;

              $tarray1 = array( $temp['w3'] );
              $tarray['w3'] = $tarray1;

              $tarray1 = array( $temp['w4'] );
              $tarray['w4'] = $tarray1;

              $tarray1 = array( $temp['w5'] );
              $tarray['w5'] = $tarray1;

              $data_sets[$temp['id']] = $tarray;
          };
      };
  };


  echo json_encode($data_sets);





  mysqli_close($connect);
