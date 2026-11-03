<?php
	include '../RSA.php';
	include 'Facade.php';
	if (count($argv) == 2) {
		$rsaObject = new ZendExt_RSA_Facade();
		echo $rsaObject->encrypt($argv[1]);
		exit;
	} else {
		echo 'ERROR';
		exit;
	}
