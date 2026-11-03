<?php

class DatElementoEntidad extends BaseDatElementoEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomElemento', array('local' => 'idelemento', 'foreign' => 'idelemento'));
    }

}


