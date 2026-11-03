<?php

/**
 * Modelo de negocio para gestionar los tipos de nómina.
 *
 * @author Ing. Aroldo L. Hechavarría Hechavarría.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoNomina, Entidad tipo de nómina (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class DatPagoDestajoModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function DatPagoDestajoModel()
    {
        parent::ZendExt_Model();
    }

    /**
     * Obtener un listado de los datos de los tipos de nómina.
     *
     * @param int $inicio Inicio de la busqueda.
     * @param int $limite Limite maximo de la busqueda.
     * @return array Listado de tipos de nómina.
     */
    

    public function obtenerPeriodosPagoDestajo($idnomtipodestajo)
    {
        $r = DatPagoDestajo::obtenerPeriodosPagoDestajo($idnomtipodestajo);
        $arrayperiodo = array();
        $cont = 0;

        foreach ($r as $key => $dato) {
            $arrayperiodo[$cont]['fechacierre'] = $dato['fechacierre']; 
            $arrayperiodo[$cont]['fechainicio'] = $dato['fechainicio']; 
            $arrayperiodo[$cont]['fechafin'] = $dato['fechafin']; 
            $arrayperiodo[$cont]['iddatpagodestajo'] = $dato['iddatpagodestajo'];        
            $arrayperiodo[$cont]['periodo'] = $dato['periodo'];        
            $arrayperiodo[$cont]['estado'] = $dato['estado'];        
            $arrayperiodo[$cont]['anno'] = explode('/', $dato['fechainicio'])[2];        
            $cont++;
        }

        return $arrayperiodo;
    }

    public function aprobarPeriodoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad)
    {
        $v = DatPagoDestajo::validarPeriodoDestajo($fechainicio, $fechafin, $idnomtipodestajo, $identidad);
        $datos = DatPersonaBrigada::obtenerListadoPersonasBrigada(null, null, null);

        if ($v == null) {
            $r = DatPagoDestajo::adicionarDatosPeriodoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad, $datos);
        } elseif($v != null && $v[0]['estado'] == -1) {
            $r = DatPagoDestajo::modificarDatosPeriodoDestajo($v[0]['iddatpagodestajo'], $datos, $v[0]['estado'], $identidad);
        }elseif ($v != null && $v[0]['estado'] == 1) {
            $r = false;
        }

        return $r;
    }

    public function desaprobarPeriodoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad)
    {
        $v = DatPagoDestajo::validarPeriodoDestajo($fechainicio, $fechafin, $idnomtipodestajo, $identidad);
        $iddatpagodestajo = $v[0]['iddatpagodestajo'];

        if ($v != null && $v[0]['estado'] == 1) {
            $r = DatPagoDestajo::modificarEstadoPeriodoDestajo($iddatpagodestajo, null, -1, $identidad);

        } elseif ($v[0]['estado'] == -1) {
            $r = false;
        }

        return $r;
    }

    public function cerrarResumenPeriodoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad)
    {
        $v = DatPagoDestajo::validarPeriodoDestajo($fechainicio, $fechafin, $idnomtipodestajo, $identidad);

        if ($v != null && $v[0]['estado'] == 1) {
            $r = DatPagoDestajo::cerrarResumenPeriodoDestajo($idnomtipodestajo, $fechainicio, $fechafin, $identidad);
        }elseif ($v != null && $v[0]['estado'] == 0) {
            $r = 'cerrado';
        }

        return $r;
    }
}
