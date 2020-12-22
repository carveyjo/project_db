<?php
$connect = mysqli_connect("localhost", "root", "", "project_db");

  $response = array();  //For ajax return data//

  $PartId = $_POST['PartId'];
  $TargetWt = $_POST['TargetWt'];
  $PlusMinusWt = $_POST['PlusMinusWt'];

  $result = mysqli_query($connect, "SET FOREIGN_KEY_CHECKS=0");
  mysqli_query($connect, "INSERT INTO part_directory VALUES (NULL,'$PartId','Pending','$TargetWt',
  '$PlusMinusWt',NULL,NULL,now())");
    mysqli_query($connect, "SET FOREIGN_KEY_CHECKS=1");
  if ($result) {
      // $response['success'] = "success";
      $response['result'] = $result;
  } else {
      // $response['error'] = "error";
      $response['result'] = mysqli_error($connect);
  }

  echo(json_encode($response)); //Send return data to ajax

  mysqli_close($connect);  //Close link with database
