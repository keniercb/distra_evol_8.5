<?php
/**
 * Componente frontal para la configuración de los servicios.
 *
 * @package Services
 * @copyright UCID
 * @author Equipo de Arquitectura.
 * @version 1.0-0
 */
try {

    require_once(substr(__FILE__, 0, strrpos(__FILE__, DIRECTORY_SEPARATOR . 'web' . DIRECTORY_SEPARATOR)) . DIRECTORY_SEPARATOR . 'apps' . DIRECTORY_SEPARATOR . 'comun' . DIRECTORY_SEPARATOR . 'config_service.php');


    $config_file = substr(__FILE__, 0, strrpos(__FILE__, 'web')) . 'apps/pvd/comun/config.php';
    require_once($config_file);
    require_once (substr(__FILE__, 0, strrpos(__FILE__, 'web'))  .'apps/pvd/persona/services/PersonaAPKService.php');


    // Se inicia la aplicacion
    $app = new ZendExt_App_Service();
    $app->init($config, false);
    // Deshabilitar el cacheado del wsdl (Revisar esto porque puede que no sea conveniente)
    ini_set('soap.wsdl_cache_enabled', 0);

    // Buscar la direccion del WSDL
    $dir_host = $_SERVER['HTTP_HOST'];
    // Buscar si se trabaja en modo seguro la peticion por ssl
    $http = isset($_SERVER['HTTPS']) ? 'https' : 'http';
    // Generar la direccion
    $wsdl = "{$http}://{$dir_host}/pvd/persona/services/webservices/server_apk.wsdl.php";

    // Publicar el servicio
    $soapServer = new SoapServer($wsdl);
    $soapServer->setClass('PersonaAPKService');

    ob_start();
    $soapServer->handle();
    $Salida = ob_get_contents();
    ob_end_flush();
} catch (Exception $e) {

    $trace = $e->getTraceAsString();
    $devMsgText = str_replace('#', '<br><br>#', $trace);

    throw new SoapFault('Excepcion controlada', json_encode(array(
        'message' => $e->getMessage(),
        'developer_message' => 'Traza:' . $devMsgText
    )));
}