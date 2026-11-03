<?php
/*
 *Componente frontal para la configuraci�n de los servicios.
 *
 * @package SIGIS
 * @copyright UCID-ERP Cuba
 * @author Oiner Gomez Baryolo    
 * @author Darien Garcia Tejo
 * @author Julio Cesar Garc�a Mosquera  
 * @version 1.0-0
 */
//Direccion del fichero de configuracion
require_once(substr(__FILE__, 0, strrpos(__FILE__, 'web')) . 'apps/comun/config_service.php');

/*$soapCliente = new SeguridadSoapService();
print_r($soapCliente->authenticateUser('instalacion', 'instalacion'));
die;*/

//Inicializo el servico web soap
ini_set('soap.wsdl_cache_enabled', 0);
$wsdl = 'http://localhost:5901/seguridad/webservices/SeguridadSoapService.wsdl';
$soapServer = new SoapServer($wsdl, array());
$soapServer->setClass('SeguridadSoapService');
$soapServer->handle();
