<?php
/*
* Author: Javier Rodríguez López
* Version: 2.0
* Description:
* Fichero donde se debe configurar la compartimentacion para la configuración de las recuperaciones
* Este fichero se utiliza por la clase GenerarXMLModel
*/
function compartimentar_personas($extraParams)
{
	$sqlCompartimentacion = ZendExt_IoC::getInstance()->pvd->getSqlUserCompartimentacionPersona();
	
    $result["selectCompartimentacion"] = "";
    $result["fromCompartimentacion"] = "";
    $result["whereCompartimentacion"] = $sqlCompartimentacion;
    $result["paramsCompartimentacion"] = array();
    $result["arrIndices"] = array();	
	
    return $result;
}
