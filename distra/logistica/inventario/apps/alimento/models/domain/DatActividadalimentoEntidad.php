<?php

class DatActividadalimentoEntidad extends BaseDatActividadalimentoEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomActividadalimento', array('local' => 'idactividadalimento', 'foreign' => 'idactividadalimento')
        );
    }

}


