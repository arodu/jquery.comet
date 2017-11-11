<?php 
    for($i = 1; $i<=4; $i++){
        clearstatcache();
        sleep(1);
    }

    echo json_encode( array( 'date'=>date('c')) );
?>
