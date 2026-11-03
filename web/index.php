<?php
    $configured = true;
    $php_ext = array ( );
	$php_ext ['pdo'] 		= 'Debe instalar la extensi&oacute;n PDO de php para el acceso a bases de datos [pdo].';
	$php_ext ['pgsql'] 		= 'Debe instalar la extensi&oacute;n de php para el acceso a bases de datos PostgreSQL [pgsql].';
	$php_ext ['pdo_pgsql'] 	= 'Debe instalar la extensi&oacute;n PDO para PostgreSQL de php para el acceso a bases de datos PostgreSQL [pdo_pgsql].';
	$php_ext ['soap'] 		= 'Debe instalar la extensi&oacute;n SOAP de php para el uso de servicios web [soap].';
	$php_ext ['gd'] 		= 'Debe instalar la extensi&oacute;n GD2 de php para el trabajo con imagenes [gd2 ó gd].';
	$php_ext ['bcmath'] 	= 'Debe instalar la extensi&oacute;n BCMATH de php para el trabajo con números de gran tamaño [bcmath].';
	$php_ext ['simplexml'] 	= 'Debe instalar la extensi&oacute;n SimpleXML de php para el trabajo con xml [simplexml].';
	$php_ext ['json'] 		= 'Debe instalar la extensi&oacute;n JSON de php para el trabajo con json [json].';
	$php_ext ['xsl'] 		= 'Debe instalar la extensi&oacute;n XSL de php para el trabajo con xslt [xsl].';
	$php_ext ['openssl'] 	= 'Debe instalar la extensi&oacute;n OPENSSL de php para el trabajo con certificados digitales [openssl].';
	$php_ext ['curl'] 		= 'Debe instalar la extensi&oacute;n CURL de php para el acceso remoto a recursos por http [curl].';
	//$php_ext ['xlicenciador'] 		= 'Debe instalar la extensi&oacute;n LICENCIADOR del marco de trabajo para asegurar la integridad del mismo [xlicenciador].';
	$php_ext ['ldap'] 		= 'Debe instalar la extensi&oacute;n LDAP de php para las conexiones a servidores de autentica&oacute;n';

	function showMsg ($msg_error) {
		echo '<pre><b>Fatal error</b>: ' . $msg_error;
	}

    foreach ( $php_ext as $ext => $msg_error ) {
    if ( !extension_loaded ( $ext ) ) {
        showMsg($msg_error);
        $configured = false;
    }
    }

    //	paquetes a revisar al montar Zeolides
    $paquetesArray =
        [
        //array('nombre' => 'zip', 'mensajeError' => ' para el trabajo con la ayuda de zeolides.' ),
       // array('nombre' => 'libpq-dev', 'mensajeError' => ' para en trabajo con la exportaci&oacute;n e importaci&oacute;n de la base de datos.'),
        ];
    foreach ($paquetesArray as $paquete) {
        $result = null;
        exec("dpkg -s " . $paquete['nombre'], $result);
        if (empty($result)) {
            showMsg('Debe instalar la librería ' . $paquete['nombre'] . $paquete['mensajeError']);
            $configured = false;
        }
    }

	if (!$configured) {
		exit();
	}
	$direccion = dirname(__FILE__) . '/instalador';
	if(is_dir($direccion))
		eliminarDir($direccion);
	 header('Location: portal/');

	function eliminarDir($carpeta) {
		foreach(glob($carpeta."/*") as $archivos_carpeta) {
			if(is_dir($archivos_carpeta))
				eliminarDir($archivos_carpeta);
			else unlink($archivos_carpeta);
		}
		rmdir($carpeta);
	}
