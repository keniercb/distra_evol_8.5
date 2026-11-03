<?php

class DatConceptoimporteEntidad extends BaseDatConceptoimporteEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomConceptoimporte',
            array('local'   => 'idconceptoimporte',
                  'foreign' => 'idconceptoimporte')
        );
    }
}