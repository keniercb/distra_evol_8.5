<?php

class DatCombo extends BaseDatCombo
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatElemento', array('local' => 'idcomponente', 'foreign' => 'idcomponente'));
        $this->hasOne('DatRemoto', array('local' => 'idcomponente', 'foreign' => 'idcomponente'));
    }

}