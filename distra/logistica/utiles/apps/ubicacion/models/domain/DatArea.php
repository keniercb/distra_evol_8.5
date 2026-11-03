<?php

class DatArea extends BaseDatArea
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatEstructuraubicacion', array('local' => 'idarea', 'foreign' => 'idarea'));
        $this->hasOne('DatAreainventario', array('local' => 'idarea', 'foreign' => 'idarea'));
        $this->hasOne('NomTipoarea', array('local' => 'idarea', 'foreign' => 'idnomtipoarea'));
        $this->hasOne('DatAreaproducto', array('local' => 'idarea', 'foreign' => 'idarea'));
        $this->hasMany('DatArealote', array('local' => 'idarea', 'foreign' => 'idarea'));
    }

    public function obtenerAreasSinSecciones($iddeposito, $dql = false)
    {
        $query = Doctrine_Query::create()
            ->select('a.idarea, eu.descripcion AS descripcion, eu.idestructuraubicacion AS idestructuraubicacion')
            ->from('DatArea a')
            ->innerJoin('a.DatEstructuraubicacion eu')
            ->where('a.idestructuracomun = ? AND eu.idpadre = eu.idestructuraubicacion', $iddeposito);
        if ($dql) {
            return $query;
        }
        return $query->fetchArray();
    }

    public function dadevolverNaturalezaPorTipoArea($idarea)
    {

        $query = Doctrine_Query::create();
        $query->select("da.idarea,tap.idnaturaleza as idnaturaleza")
            ->from('DatArea da')
            ->innerJoin('da.DatAreainventario dai')
            ->innerJoin('dai.NomTipoarea nt')
            ->innerJoin('nt.DatTipoareaEntidad dte')
            ->innerJoin('dte.NomTipoareatipoproducto tap ')
            ->where("da.idarea = ?", $idarea);
        $query = ServiciosConfiguracionGeneralHelper::__init()->innerJoinNomNaturaleza($query, 'tap', 'nna', true, '');

        return $query->fetchArray();
    }

    public function getTodos()
    {
        $query = new Doctrine_Query();
        $result = $query->from('DatArea')->execute();
        return $result->toArray();
    }

}

