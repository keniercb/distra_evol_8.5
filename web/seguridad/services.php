<?php

/**
 * Componente frontal para la configuración de los servicios.
 *
 * @package Services
 * @copyright UCID   
 * @author Equipo de Arquitectura.  
 * @version 1.0-0
 */
require_once (substr(__FILE__, 0, strrpos(__FILE__, '/web/')) . '/apps/comun/config_service.php');
//Se inicia la aplicacion 
$app = new ZendExt_App_Service();
$app->init($config);
ini_set('soap.wsdl_cache_enabled', 0);

// Buscar la direccion del WSDL
$dir_host = $_SERVER['HTTP_HOST'];
// Buscar si se trabaja en modo seguro la peticion por ssl
$https = isset($_SERVER['HTTPS']) ? 's' : '';
// Generar la direccion
$wsdl = "http{$https}://{$dir_host}/seguridad/webservices/SeguridadSoapService.wsdl";
$contextOptions = stream_context_create(
    [
        "ssl" => [
            "verify_peer" => false,
            "verify_peer_name" => false,
            "allow_self_signed" => true
        ]
    ]
);
$wsdl = file_get_contents($wsdl, null, $contextOptions);
$file = 'data://text/plain;base64,'.base64_encode($wsdl);
$soapServer = new SoapServer($file);
$soapServer->setClass('SeguridadSoapService');
$soapServer->handle();
?>