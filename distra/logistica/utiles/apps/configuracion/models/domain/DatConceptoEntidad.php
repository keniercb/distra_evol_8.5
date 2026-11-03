<?php

class DatConceptoEntidad extends BaseDatConceptoEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'NomConcepto',
            array('local' => 'idnomconcepto', 'foreign' => 'idnomconcepto')
        );
    }

}
