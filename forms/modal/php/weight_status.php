
      <?php
        $connect = mysqli_connect("localhost", "root", "", "project_db");

        $response = array();  //For ajax return data//

        $KeyId = $_POST['KeyId'];
        $Status = $_POST['Status'];

        $result = mysqli_query($connect, " UPDATE part_directory SET Status = IF('$Status' = '',Status,'$Status') WHERE KeyId='$KeyId'");


        if ($result) {
            $response['result'] = $result;
        } else {
            $response['result'] = mysqli_error($connect);
        }

        echo(json_encode($response));
        mysqli_close($connect);
        ?>
