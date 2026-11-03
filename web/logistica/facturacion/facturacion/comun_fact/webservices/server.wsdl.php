<?php

/**
 * Publicacion de wsdl.
 *
 * Localizar el WSDL sin modificar el fichero 'AcaxiaSoapAutentication.wsdl'
 * e inyectarle la direccion del servicio para servirlo
 *
 * @package Services
 * @copyright UCID
 * @author Equipo de Arquitectura.
 * @version 1.0-0
 */
// Buscar si se trabaja en modo seguro la peticion por ssl
$http = isset($_SERVER['HTTPS']) ? 'https' : 'http';
// Buscar la direccion de publicacion de cara al cliente
$servidor = $http . '://' . $_SERVER['SERVER_NAME'] . ':' . $_SERVER['SERVER_PORT'];
// Leer el WSDL para modificar su texto
$wsdlContenido = file_get_contents('./FacturacionSoapService.wsdl');
// Buscar la posicion del tag de direccion
$posInicio = strpos($wsdlContenido, '<soap:address');
// Buscar posicion final del TAG
$posFinal = strpos($wsdlContenido, '/>', $posInicio);
// Obtener la cadena para remplazar
$insertarCadena = '<soap:address location="' . $servidor . '/logistica/facturacion/facturacion/comun_fact/webservices/services.php"/>';
// Obtener las subcadenas para introducir la variable $insertarCadena
$cadenaInicio = substr($wsdlContenido, 0, $posInicio);
$cadenaFin = substr($wsdlContenido, $posFinal + 2);

// Generar la cabecera XML
header('Content-Type: text/xml');
// Unir las 3 cadenas
echo $cadenaInicio . $insertarCadena . $cadenaFin;
