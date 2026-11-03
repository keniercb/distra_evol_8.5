<?php

/**
 * DatConvenios
 *
 * @author Aroldo L. Hechavarría Hechavarría.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @copyright UCID
 * @version 1.0
 */
class DatVariablesPagoDestajoTemporal extends BaseDatVariablesPagoDestajoTemporal {

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int       $inicio Inicio de la busqueda.
     * @param int       $limite Limite maximo de la busqueda.
     * @return array    Listado de los datos de los tipos de nómina.
     */  

    public static function guardarVariablesTablaTemporal($identidad, $coeficiente, $montobrigada, $salariocalculado, $idplantilla)
    {
        
        $obj = new DatVariablesPagoDestajoTemporal();        
        $obj->identidad = $identidad;
        $obj->montobrigada = $montobrigada;
        $obj->coeficiente = $coeficiente;
        $obj->salariocalculado = $salariocalculado;
        $obj->idplantillanominal = $idplantilla;
        $obj->save();
        
		return true;
    } 


    
    
    
}
