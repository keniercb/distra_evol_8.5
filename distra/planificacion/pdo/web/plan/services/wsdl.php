<?php

$wsld = 'http://sipac-calidad.prod.xetid.cu/planificacion/pdo/plan/services/webservices/servicio.wsdl';
//$wsld = 'https://gestion-empresarial.xetid.cu/planificacion/pdo/plan/services/webservices/servicio.wsdl';
//print_r($wsld);die;
$soap = new SoapClient($wsld);
//print_r($p['blanco']);die;
//$contenido = $p['blanco'];
$result = $soap->__soapCall('insertarBlanco', array($parray)); //Se envia 1 para despues enviar 1 mision;

