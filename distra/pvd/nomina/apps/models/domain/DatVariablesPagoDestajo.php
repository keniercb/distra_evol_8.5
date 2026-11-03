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
class DatVariablesPagoDestajo extends BaseDatVariablesPagoDestajo {

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int       $inicio Inicio de la busqueda.
     * @param int       $limite Limite maximo de la busqueda.
     * @return array    Listado de los datos de los tipos de nómina.
     */  

    public function guardarDatosVariables($idnomtipodestajo, $fechainicio, $fechafin, $identidad)
    {
        $datos = DatVariablesPagoDestajo::obtenerDatosTablaTemporal($identidad, $idnomtipodestajo);
        $datser = serialize($datos);

        $objDatVar = new DatVariablesPagoDestajo();
        $objDatVar->idnomtipodestajo = $idnomtipodestajo;
        $objDatVar->identidad = $identidad;
        $objDatVar->datos = $datser;
        $objDatVar->periodo = $fechainicio . ' al ' . $fechafin;
        $objDatVar->save();

		return true;
    } 


    public static function obtenerDatosTablaTemporal($identidad, $idnomtipodestajo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "SELECT montobrigada, coeficiente, salariocalculado, idplantillanominal
            FROM mod_nomina.dat_variablespagodestajotemporal WHERE identidad = $identidad;";
        $r = $conn->fetchAll($sql);

        return $r;

    }

    
    
    
}
