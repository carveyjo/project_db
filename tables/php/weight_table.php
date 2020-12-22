<?php
$connect = mysqli_connect("localhost", "root", "", "project_db");

  function getcolumndata($row)
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

      return array(
      $row['KeyId'],
      $row['PartId'],
      $row['KeyId'] . '__' . $row['Status'],
      $row['Status'],
      $row['TargetWt'],
      $row['PlusMinusWt'],
      $row['PartCreationDate'],
      $Weight1,
      $Weight2,
      $Weight3,
      $Weight4,
      $Weight5,
      $WeightCheckInTime,
      $row['KeyId'], // 14 -- started
      $row['KeyId'], // 15 -- finished
      $row['KeyId'] // 16 -- cancel

    );
  };

  if (isset($_GET['searchValue'])) {
      $valuesToSearch = explode(" ", $_GET['searchValue']);

      $queryBase = "SELECT *
      FROM part_directory dir
      LEFT JOIN weight_detroit det on det.DetroitLotId=dir.PartId
      LEFT JOIN weight_traverse_city tc on tc.TraverseCityLotId=dir.PartId";

      $query = "";
      foreach ($valuesToSearch as $item) {
          $query .= $queryBase;
          $query .= " WHERE dir.PartId LIKE '%".$item."%'
      ORDER BY det.DetroitCheckInTime DESC, tc.TraverseCityCheckInTime DESC;";
      };
  } else {
      $query = "SELECT *
      FROM part_directory dir
      LEFT JOIN weight_detroit det on det.DetroitLotId=dir.PartId
      LEFT JOIN weight_traverse_city tc on tc.TraverseCityLotId=dir.PartId
      ORDER BY det.DetroitCheckInTime DESC, tc.TraverseCityCheckInTime DESC
      ";
  }

  $responseArray=array("data" => array());

  if (mysqli_multi_query($connect, $query)) {
      do {
          if ($result = mysqli_store_result($connect)) {
              while ($row = mysqli_fetch_array($result)) {
                  $temp = getcolumndata($row);
                  array_push($responseArray['data'], $temp);
              };
              mysqli_free_result($result);
          };
      } while (mysqli_next_result($connect));
  } else {
      $result = mysqli_query($connect, $query);
      while ($row = mysqli_fetch_array($result)) {
          $temp = getcolumndata($row);
          array_push($responseArray['data'], $temp);
      };
  };




  echo json_encode($responseArray);
  mysqli_close($connect);
