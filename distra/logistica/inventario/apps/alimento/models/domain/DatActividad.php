<?php

class DatActividad extends BaseDatActividad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatMenu', array('local' => 'idmenu', 'foreign' => 'idmenu'));
        $this->hasMany('DatRecetaActividad', array('local' => 'idactividad', 'foreign' => 'idactividad'));
        $this->hasMany(
            'NomActividadalimento', array('local' => 'idactividadalimento', 'foreign' => 'idactividadalimento')
        );
    }

    public function getSelectSinAlias(Doctrine_Query $query, $alias)
    {
        $query->addSelect(
            "da.idactividad as idactividad, "
            . "da.cantraciones as cantraciones, "
            . "da.orden as orden, "
            . "nr.idreceta as idreceta, "
            . "nr.cantidad as cantidad, "
            . "nr.denominacion as denominacionreceta, "
            . "num.denominacionunidadmedida as denominacionunidadmedida "
        )
            ->innerJoin("{$alias}.DatActividad da")
            ->innerJoin("da.DatRecetaActividad dra")
            ->leftJoin("dra.NomReceta nr")
            ->innerJoin("nr.NomUnidadMedida num");
        return $query;
    }

}

