<?php
$connect = mysqli_connect("localhost", "root", "", "project_db");
  // var_dump($_POST);

  if (isset($_POST['KeyId'])) {
      $query = "";

      $query .= "UPDATE part_directory SET ";
      $query .= "Status='Reject', ";
      $query .= "RejectTime=now()";
      $query .= "WHERE KeyId='" . $_POST['KeyId'] . "';";

      $result = mysqli_multi_query($connect, $query);

      // return
      $response = array();
      if ($result) {
          $response['result'] = $result;
      } else {
          $response['result'] = false;
      };

      echo(json_encode($response));

      mysqli_close($connect);
      exit();
  } else {
      echo json_encode(array("Error" => "Post Page"));
      mysqli_close($connect);
      exit();
  };
