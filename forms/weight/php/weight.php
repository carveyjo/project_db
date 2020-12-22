<?php
$connect = mysqli_connect("localhost", "root", "", "project_db");

  $response = array();  //For ajax return data//

  $PartId = $_POST['PartId'];
  $response['post1'] = $PartId;
  $Weight1 = $_POST['Weight1'];
  $response['post2'] = $Weight1;
  $Weight2 = $_POST['Weight2'];
  $response['post3'] = $Weight2;
  $Weight3 = $_POST['Weight3'];
  $response['post4'] = $Weight3;
  $Weight4 = $_POST['Weight4'];
  $response['post5'] = $Weight4;
  $Weight5 = $_POST['Weight5'];
  $response['post6'] = $Weight5;
  $Plant = $_POST['Plant'];
  $PartTable = $_POST['PartTable'];


  $result = mysqli_query($connect, "SET FOREIGN_KEY_CHECKS=0");
  mysqli_query($connect, "INSERT INTO $PartTable VALUES (NULL,'$PartId','$Weight1','$Weight2',
  '$Weight3','$Weight4','$Weight5','$Plant',now())");
    mysqli_query($connect, "SET FOREIGN_KEY_CHECKS=1");
  if ($result) {
      // $response['success'] = "success";
      $response['result'] = $result;
  } else {
      // $response['error'] = "error";
      $response['result'] = mysqli_error($connect);
  }

  $query = "SELECT dir.PartId,ROUND(dir.TargetWt,0) AS TargetWt FROM part_directory dir
  WHERE dir.PartId LIKE '%".$PartId."%'";
  $queryresult = mysqli_query($connect, $query);
  $Part = mysqli_fetch_assoc($queryresult);
      $response['TargetWt'] = $Part;

  echo(json_encode($response)); //Send return data to ajax

  mysqli_close($connect);  //Close link with database
