<?php

class NomActividadalimento extends BaseNomActividadalimento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatActividadalimentoEntidad', array('local' => 'idactividadalimento', 'foreign' => 'idactividadalimento')
        );
        $this->hasOne('DatActividad', array('local' => 'idactividadalimento', 'foreign' => 'idactividadalimento'));
    }

}
