<?php

/**
 * Clase dominio de Acciones.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class DatParametros extends BaseDatParametros
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatFunciones', 
            array('local' => 'idfuncion', 'foreign' => 'idfuncion')
        );
    }

    static function cargarparametros($idfunciones, $limit, $start)
    {
        $query = Doctrine_Query::create();
        $fndes = $query->select(
            'idfuncion,denominacion, descripcion,puedesernull,'
            . 'tipoparametro,valordefecto,idparametro'
        )
            ->from('DatParametros')
            ->where("idfuncion = ?", $idfunciones)
            ->orderby('idparametro')
            ->limit($limit)
            ->offset($start)
            ->execute();
        return $fndes;
    }

    static function obtenercantpar($idfunciones)
    {
        $query = Doctrine_Query::create();
        $cantFndes = $query->from('DatParametros f')
            ->where("f.idfuncion= ?", $idfunciones)
            ->count();
        return $cantFndes;
    }

}