<?php

/**
 * Clase dominio de DatFunciones.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatFunciones extends BaseDatFunciones
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatServicio', 
            array('local' => 'idservicio', 'foreign' => 'idservicio')
        );
        $this->hasMany(
            'DatParametros', 
            array('local' => 'idfuncion', 'foreign' => 'idfuncion')
        );
    }

    static function cargarfunciones($idservicio, $limit, $start)
    {
        $query = Doctrine_Query::create();
        $fndes =$query->select('idfuncion,denominacion, descripcion,idservicio')
            ->from('DatFunciones')
            ->where("idservicio = ?", $idservicio)
            ->orderby('idfuncion')->limit($limit)
            ->offset($start)
            ->execute();
        return $fndes;
    }

    static function obtenercantfunc($idservicio)
    {
        $query = Doctrine_Query::create();
        $cantFndes = $query->from('DatFunciones f')
            ->where("f.idservicio = ?", $idservicio)->count();
        return $cantFndes;
    }

}