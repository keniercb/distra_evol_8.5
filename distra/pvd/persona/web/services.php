<?php
	/**
	 *Componente frontal para la configuración de los servicios.
	 *
	 * @package Services
	 * @copyright UCID   
	 * @author Equipo de Arquitectura.  
	 * @version 1.0-0
	 */
    $dir_script = $_SERVER['SCRIPT_FILENAME'];
 //   print_r(substr($dir_script, 0, strrpos($dir_script, '/web/')) . '/apps/'. 'comun/config_service.php');die;
require_once (substr($dir_script, 0, strrpos($dir_script, '/web/')) . '/apps/'. 'comun/config_service.php');
//	require_once (substr(__FILE__, 0, strrpos(__FILE__, '/web/')) . '/apps/comun/config_service.php');
        //Se inicia la aplicacion
        $app = new ZendExt_App_Service();
        $app->init($config);
        ini_set('soap.wsdl_cache_enabled', 0);
        $dir_host = $_SERVER['HTTP_HOST'];
        $wsdl = "https://{$dir_host}/pvd/persona/services/webservices/PersonaService.wsdl";
        $soapServer = new SoapServer($wsdl);
        $soapServer->setClass('PersonaSOAPService');
        $soapServer->handle();



?>