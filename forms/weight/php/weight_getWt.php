<?php
$connect = mysqli_connect("localhost", "root", "", "project_db");
  if (!isset($_POST['Type'])) {
      echo json_encode(
          array(
        "status" => false,
        "msg" => "No Type Given"
        )
      );
      exit();
  };
  if ($_POST['Type'] == 'traversecity') {
      $query = "SELECT ROUND(dir.TargetWt,0) AS TargetWt FROM part_directory dir WHERE PartId LIKE '%" . $_POST['id'] . "%';";
  } elseif ($_POST['Type'] == 'detroit') {
      $query = "SELECT ROUND(dir.TargetWt,0) AS TargetWt FROM part_directory dir WHERE PartId LIKE '%" . $_POST['id'] . "%';";
  } else {
      echo json_encode(
          array(
        "status" => false,
        "msg" => "Invalid Type Given"
        )
      );
      exit();
  };
  $response = array();
  $temp = array();
  $result = mysqli_query($connect, $query);
  if ($result) {
      while ($row = mysqli_fetch_assoc($result)) {
          array_push($temp, $row);
      };
      $response['data'] = $temp;
      $response['status'] = true;
  } else {
      $response['status'] = false;
      $response['msg'] = mysqli_error($connect);
  };

  $query = "SELECT dir.PartId,dir.PlusMinusWt FROM part_directory dir
  WHERE dir.PartId LIKE '%" . $_POST['id'] . "%'";
  $queryresult = mysqli_query($connect, $query);
  $part = mysqli_fetch_assoc($queryresult);
  $response['PlusMinusWt'] = $part;

  echo(json_encode($response));
  mysqli_close($connect);
  exit();
