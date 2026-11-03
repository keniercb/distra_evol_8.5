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
class DatPagoDestajo extends BaseDatPagoDestajo {

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int       $inicio Inicio de la busqueda.
     * @param int       $limite Limite maximo de la busqueda.
     * @return array    Listado de los datos de los tipos de nómina.
     */   


    public function fnObtenerListadoXIdDatPagoDestajo($idconfpagodestajo)
    {
        return Doctrine::getTable('DatPagoDestajo')->find($idconfpagodestajo);
    }
    

    public static function obtenerPeriodosPagoDestajo($idnomtipodestajo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "SELECT * FROM mod_nomina.dat_pagodestajo WHERE idnomtipodestajo = $idnomtipodestajo;";
        $r = $conn->fetchAll($sql);

        return $r;
    }

    public static function validarPeriodoDestajo($fechainicio, $fechafin, $idnomtipodestajo, $identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $sql = "SELECT *FROM mod_nomina.dat_pagodestajo WHERE idnomtipodestajo = $idnomtipodestajo AND fechainicio = '$fechainicio' AND fechafin = '$fechafin' AND identidad = $identidad;";
        $r = $conn->fetchAll($sql);

        return $r;
    }

    public static function modificarDatosPeriodoDestajo($iddatpagodestajo, $datos, $estado, $identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if ($estado == -1) {
            $datserialize = serialize($datos);
            $sql = "UPDATE mod_nomina.dat_pagodestajo 
                SET 
                datos = '$datserialize',
                estado = 1
                WHERE 
                iddatpagodestajo = $iddatpagodestajo AND identidad = $identidad;";
            $conn->execute($sql);
        } else {
            $sql = "UPDATE mod_nomina.dat_pagodestajo 
                SET 
                datos = null,
                estado = $estado
                WHERE 
                iddatpagodestajo = $iddatpagodestajo AND identidad = $identidad;";
            $conn->execute($sql);
        }

		return true;        
    }

    public static function modificarEstadoPeriodoDestajo($iddatpagodestajo, $datos, $estado, $identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if ($estado == -1) {
            $datserialize = serialize($datos);
            $sql = "UPDATE mod_nomina.dat_pagodestajo 
                SET 
                datos = null,
                estado = $estado
                WHERE 
                iddatpagodestajo = $iddatpagodestajo AND identidad = $identidad;";
            $conn->execute($sql);
        }

		return true;        
    }

    public static function adicionarDatosPeriodoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad, $datos)
    {              
        $objPagoDestajo = new DatPagoDestajo();           
        $objPagoDestajo->idnomtipodestajo = $idnomtipodestajo;
        $objPagoDestajo->identidad = $identidad;
        $objPagoDestajo->datos = serialize($datos);
        $objPagoDestajo->fechainicio = $fechainicio;
        $objPagoDestajo->fechafin = $fechafin;
        $objPagoDestajo->estado = 1;
        $objPagoDestajo->periodo = $fechainicio . ' al ' . $fechafin;
        $objPagoDestajo->save();

		return true;
    }

    public static function obtenerEstadoPagoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $sql = "SELECT estado FROM mod_nomina.dat_pagodestajo 
	        WHERE idnomtipodestajo = $idnomtipodestajo AND identidad = $identidad AND fechainicio = '$fechainicio' AND fechafin = '$fechafin';";
        $rs = $conn->fetchOne($sql);

        return $rs;
    }

    public static function cerrarResumenPeriodoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad)
    {

        //guardar los datos Salario de cálculo, Monto total Brigada, Coeficiente de distribución en la tabla dat_variablespagodestajo
        $incertdatvarpagdes = DatVariablesPagoDestajo::guardarDatosVariables($idnomtipodestajo, $fechainicio, $fechafin, $identidad);

        //guardar los datos en la tabla his_convenios
        $incertdathisconven = HisConvenios::guardarDatosHisConvenios($idnomtipodestajo, $identidad, $fechainicio, $fechafin);

        // cambiar estado periodo destajo a 0 elaborado
        $cambiarestado = DatPagoDestajo::cambiarEstadoPeriodoDestajo($idnomtipodestajo);

        $eliminar = DatPagoDestajo::eliminarDatosPeriodo($idnomtipodestajo, $identidad);

        return true;

    }

    public static function cambiarEstadoPeriodoDestajo($idnomtipodestajo)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $fechacierre = date('d/m/Y');

        $sql = "UPDATE mod_nomina.dat_pagodestajo 
            SET
            estado = 0,
            fechacierre = '$fechacierre'
            WHERE idnomtipodestajo = $idnomtipodestajo;";
        $conn->execute($sql);

        return true;
    }
    
    public static function eliminarDatosPeriodo($idnomtipodestajo, $identidad)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        // eliminar datos de las tablas del actual
        $sqldeletedatperbri = "DELETE FROM mod_nomina.dat_personabrigada WHERE identidad = $identidad;";
        $conn->execute($sqldeletedatperbri);

        $sqlvariatemp = "DELETE FROM mod_nomina.dat_variablespagodestajotemporal WHERE identidad = $identidad;";
        $conn->execute($sqlvariatemp);

        $sqlconvenio = "DELETE FROM mod_nomina.dat_convenios WHERE identidad = $identidad;";
        $conn->execute($sqlconvenio);

        return true;

    }
    
}
