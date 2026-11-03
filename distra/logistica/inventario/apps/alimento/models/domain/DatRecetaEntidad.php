<?php

class DatRecetaEntidad extends BaseDatRecetaEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomReceta', array('local' => 'idreceta', 'foreign' => 'idreceta'));
    }

}
