<?php

/**
 * Modelo de negocio para gestionar los tipos de nómina.
 *
 * @author Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomTipoNomina, Entidad tipo de nómina (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomObrasDestajoModel extends ZendExt_Model
{
    
    public function obtenerListadoNomenclador($texto, $inicio = 0, $limite = 10, $identidad)
    {

        $arraydatos = NomObrasDestajo::obtenerListadoNomenclador($texto, $inicio, $limite, $identidad);

        return $arraydatos;
    }
    
    public function adicionarNomenclador($denominacion, $fechainicio, $fechafin, $codigo, $identidad)
    {
        $result = NomObrasDestajo::adicionarNomenclador($denominacion, $fechainicio, $fechafin, $codigo, $identidad);

        return $result;
    }
    
    public function modificarNomencladorObras($idnomobrasdestajo, $denominacion, $fechainicio, $fechafin, $codigo)
    {
        $result = NomObrasDestajo::modificarNomencladorObras($idnomobrasdestajo, $denominacion, $fechainicio, $fechafin, $codigo);

        return $result;
    }
    
    public function eliminarNomenclador($idnomobrasdestajo)
    {
        $result = NomObrasDestajo::eliminarNomenclador($idnomobrasdestajo);

        return $result;
    }
    
}
