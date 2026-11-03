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

    require_once (substr(__FILE__, 0, strrpos(__FILE__, '/web/')) . '/apps/comun/config_service.php');
    // Se inicia la aplicacion
    $app = new ZendExt_App_Service();
    $app->init($config, false);
    // Deshabilitar el cacheado del wsdl (Revisar esto porque puede que no sea conveniente)
    ini_set('soap.wsdl_cache_enabled', 0);

    // Buscar la direccion del WSDL
    $dir_host = $_SERVER['HTTP_HOST'];
    // Buscar si se trabaja en modo seguro la peticion por ssl
    $https = isset($_SERVER['HTTPS']) ? 's' : '';
    // Generar la direccion
    $wsdl = "http{$https}://{$dir_host}/seguridad/webservices/server.wsdl.php";

    // Publicar el servicio
    $soapServer = new SoapServer($wsdl);
    $soapServer->setClass('AcaxiaSoapAutentication');

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
