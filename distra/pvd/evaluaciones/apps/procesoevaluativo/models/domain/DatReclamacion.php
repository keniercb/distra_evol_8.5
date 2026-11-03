<?php

class DatReclamacion extends BaseDatReclamacion
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatEvalpersonaevaluacion',
            array('local' => 'idpersonaevaluacion', 'foreign' => 'idpersonaevaluacion')
        );
        $this->hasMany(
            'DatRespuestareclamacion',
            array('local' => 'idreclamacion', 'foreign' => 'idreclamacion')
        );
    }

    public function Buscar($idreclamacion)
    {
        return Doctrine::getTable('DatReclamacion')->find($idreclamacion);
    }

}