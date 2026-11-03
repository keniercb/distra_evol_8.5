<?php

function __autoload($class) {
    include_once $class . ".php";
}

try {
    //Direccion del fichero de configuracion
    $file=str_replace('\\', '/',__FILE__);
    require_once (substr($file, 0, strrpos($file, '/web/')) . '/apps/crm/comun/webservices/config_service.php');
    /* require_once(substr(__FILE__, 0, strrpos(__FILE__, DIRECTORY_SEPARATOR . 'web' . DIRECTORY_SEPARATOR))
         . '/apps/crm/comun/webservices/config_service.php');*/
    // Se inicia la aplicacion
    $app = new ZendExt_App_Service();
    $app->init($config,false);
    // Deshabilitar el cacheado del wsdl (Revisar esto porque puede que no sea conveniente)
    ini_set('soap.wsdl_cache_enabled', 0);

    // Buscar la direccion del WSDL
    $dir_host = $_SERVER['HTTP_HOST'];
    // Buscar si se trabaja en modo seguro la peticion por ssl
    $https = isset($_SERVER['HTTPS']) ? 's' : '';
    // Generar la direccion
    $wsdl = "http{$https}://{$dir_host}/crm/comun/webservices/CrmSoapService.wsdl";
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
    $soapServer->setClass("CrmSoapService");
    $soapServer->handle();
} catch (Exception $e) {

    $trace = $e->getTraceAsString();
    $devMsgText = str_replace('#', '<br><br>#', $trace);

    throw new SoapFault('Excepcion controlada', json_encode(array(
        'message' => $e->getMessage(),
        'developer_message' => 'Traza:' . $devMsgText
    )));
}
