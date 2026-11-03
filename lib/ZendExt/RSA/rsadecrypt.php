<?php
	include '../RSA.php';
	include 'Facade.php';
	if (count($argv) == 2) {
		$rsaObject = new ZendExt_RSA_Facade();
		echo $rsaObject->decrypt($argv[1]);
		exit;
	} else {
		echo 'ERROR';
		exit;
	}
