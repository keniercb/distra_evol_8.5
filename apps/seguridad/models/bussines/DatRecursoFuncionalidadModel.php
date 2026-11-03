<?php
/**
 * Created by PhpStorm.
 * User: lily
 * Date: 3/10/16
 * Time: 9:39 a.m.
 */

class DatRecursoFuncionalidadModel extends ZendExt_Model
{

    public function init()
    {
        parent::ZendExt_Model();
    }

    public function insertarrecursoFuncionalidad($idrecurso, $idfuncionalidad,$externo)
    {
        $objRecursoFuncionalidad = new DatRecursoFuncionalidad();
        $objRecursoFuncionalidad->idrecurso = $idrecurso;
        $objRecursoFuncionalidad->idfuncionalidad = $idfuncionalidad;
        $objRecursoFuncionalidad->externo  = $externo;
        $objRecursoFuncionalidad->save();
        return $objRecursoFuncionalidad->idrecurso;
    }

    public function modificarrecursoFuncionalidad($instance)
    {
        $instance->save();
        return true;
    }

    public function eliminarrecursoFuncionalidad($idrecurso,$idfuncionalidad)
    {
        DatRecursoFuncionalidad::eliminarRecursos($idrecurso,$idfuncionalidad);
        return true;
    }

}