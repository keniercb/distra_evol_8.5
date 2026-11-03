<?php

class DatElemento extends BaseDatElemento
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatCombo', array('local' => 'idcomponente', 'foreign' => 'idcomponente'));
    }

}