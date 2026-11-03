<?php
/**
 * Componente frontal para la configuraci�n de los servicios.
 *
 * @package Services
 * @copyright UCID
 * @author Equipo de Arquitectura.
 * @version 1.0-0
 */
try {
    require_once (substr(__FILE__, 0, strrpos(__FILE__, 'web')) . 'apps/comun/config_service.php');
    require_once(substr(__FILE__, 0, strrpos(__FILE__, 'web')) . 'apps/planificacion/proyecto/planeacion/services/PlanificacionSoapService.php');
    $config['include_path'] .= PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'proyecto' . DIRECTORY_SEPARATOR . 'planeacion' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain' . DIRECTORY_SEPARATOR . 'generated'
        . PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'proyecto' . DIRECTORY_SEPARATOR . 'planeacion' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'domain'
        . PATH_SEPARATOR . $dir_abs_mt . 'apps' . DIRECTORY_SEPARATOR . 'planificacion' . DIRECTORY_SEPARATOR . 'proyecto' . DIRECTORY_SEPARATOR . 'planeacion' . DIRECTORY_SEPARATOR . 'models' . DIRECTORY_SEPARATOR . 'bussines';

    set_include_path($config['include_path']);

    //Se inicia la aplicacion
    $app = new ZendExt_App_Service();
    $app->init($config, false);
    ini_set('soap.wsdl_cache_enabled', 0);
    $dir_host = $_SERVER['HTTP_HOST'];
    // Buscar la direccion del WSDL
    $dir_host = $_SERVER['HTTP_HOST'];
    // Buscar si se trabaja en modo seguro la peticion por ssl
    $https = isset($_SERVER['HTTPS']) ? 's' : '';
    // Generar la direccion
    $wsdl = "http{$https}://{$dir_host}/planificacion/proyecto/planeacion/services/webservices/servicio.wsdl";
//    $wsdl = "http{$https}://gestion-empresarial.xetid.cu/planificacion/pdo/plan/services/webservices/server.wsdl.php";
    // Publicar el servicio
    $soapServer = new SoapServer($wsdl);
    $soapServer->setClass('PlanificacionSoapService');
    $soapServer->handle();

} catch (Exception $e) {

    $trace = $e->getTraceAsString();
    $devMsgText = str_replace('#', '<br><br>#', $trace);

    throw new SoapFault('Excepcion controlada', json_encode(array(
        'message' => $e->getMessage(),
        'developer_message' => 'Traza:' . $devMsgText
    )));
}