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
class DatConvenios extends BaseDatConvenios {

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int       $inicio Inicio de la busqueda.
     * @param int       $limite Limite maximo de la busqueda.
     * @return array    Listado de los datos de los tipos de nómina.
     */

    public static function obtenerListadoConvenios($inicio, $limite, $idplantilla) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT idconvenio, denominacion, obra, importe, fechainicio, fechafin, descripcion
                FROM mod_nomina.dat_convenios WHERE idplantillanominal = $idplantilla;";
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public static function obtenerListadoConveniosPeriodo($idnomtipodestajo, $fechainicio, $fechafin) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT dc.*, cpn.denominacion as brigada 
            FROM mod_nomina.dat_convenios dc
            LEFT JOIN mod_nomina.conf_plantillanominal cpn on (cpn.idplantillanominal = dc.idplantillanominal)
            
            WHERE idnomtipodestajo = $idnomtipodestajo AND fechainicioperiodo = '$fechainicio' AND fechafinperiodo = '$fechafin'  ORDER BY dc.idplantillanominal ASC;";
        $datos = $conn->fetchAll($sql);
        return $datos;
    }

    public static function adicionarConvenioByObra($denominacion, $obra, $importe, $fechainicio, $fechafin, $descripcion, $idplantilla, $identidad, $idnomtipodestajo, $fechainicioperiodo, $fechafinperiodo) 
    {
        $existe = DatConvenios::existeDenomConvenio($denominacion);//print_r($existe);die;
        if ($existe == 0) {
            $objConvenio = new DatConvenios();
            $objConvenio->denominacion = $denominacion;
            $objConvenio->obra = $obra;
            $objConvenio->importe = $importe;
            $objConvenio->fechainicio = $fechainicio;
            $objConvenio->fechafin = $fechafin;
            $objConvenio->descripcion = $descripcion;
            $objConvenio->idplantillanominal = $idplantilla;
            $objConvenio->identidad = $identidad;
            $objConvenio->idnomtipodestajo = $idnomtipodestajo;
            $objConvenio->fechainicioperiodo = $fechainicioperiodo;
            $objConvenio->fechafinperiodo = $fechafinperiodo;
            $objConvenio->save();

            return 1;
        }else if($existe > 0) {
            return 3;
        }
    }

    public static function existeDenomConvenio($denominacion) 
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT count(idconvenio) FROM  mod_nomina.dat_convenios WHERE denominacion = '$denominacion';";
        $datos = $conn->fetchOne($sql);
        return $datos;
    }

    public static function modificarConvenioByObra($idconvenio, $denominacion, $obra, $importe, $fechainicio, $fechafin, $descripcion){

        $obj = Doctrine::getTable('DatConvenios')->find($idconvenio);

        $obj->denominacion = $denominacion;
        $obj->obra = $obra;
        $obj->importe = $importe;
        $obj->fechainicio = $fechainicio;
        $obj->fechafin = $fechafin;
        $obj->descripcion = $descripcion;

        $obj->save();

        return 1;

    }

    public static function eliminarConvenio($idconvenio){

        $obj = Doctrine::getTable('DatConvenios')->find($idconvenio);

        $obj->delete();

        return 1;

    }

    
    
}
