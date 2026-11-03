<?php

class NomElemento extends BaseNomElemento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatElementoEntidad', array('local' => 'idelemento', 'foreign' => 'idelemento'));
        $this->hasMany('NomMarcaarmamento', array('local' => 'idelemento', 'foreign' => 'idelemento'));
    }

}

