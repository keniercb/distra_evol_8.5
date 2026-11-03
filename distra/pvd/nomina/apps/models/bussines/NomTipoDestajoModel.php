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
class NomTipoDestajoModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function NomTipoNominaModel()
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
    
    public function obtenerListadoDestajo($inicio = 0, $limite = 10)
    {
        //Retornando el listado de tipos de nómina.
        $arrayreturn = array();
        $cont = 0;
        $arrayTipoNomina = NomTipoDestajo::obtenerListadoDestajo($inicio, $limite);


        foreach ($arrayTipoNomina as $i => $value) {
            $arrayreturn[$cont]['idnomtipodestajo'] = $value['idnomtipodestajo'];
            $arrayreturn[$cont]['denominacion'] = $value['denominacion'];
            $arrayreturn[$cont]['fechainicio'] = $value['fechainicio'];
            $arrayreturn[$cont]['fechafin'] = $value['fechafin'];
            $arrayreturn[$cont]['descripcion'] = $value['descripcion'];
            $cont++;
        }

        return $arrayreturn;
    }
    
    public function adicionarDestajo($denominacion, $fechainicio, $fechafin, $descripcion)
    {
        $result = NomTipoDestajo::adicionarDestajo($denominacion, $fechainicio, $fechafin, $descripcion);

        return $result;
    }
    
    public function modificarDestajo($idnomtipodestajo, $denominacion, $fechainicio, $fechafin, $descripcion)
    {
        $result = NomTipoDestajo::modificarDestajo($idnomtipodestajo, $denominacion, $fechainicio, $fechafin, $descripcion);

        return $result;
    }
    
    public function eliminarTiposDestajo($idnomtipodestajo)
    {
        $result = NomTipoDestajo::eliminarTiposDestajo($idnomtipodestajo);

        return $result;
    }
    
}
