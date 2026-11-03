<?php

class DatNroserie extends BaseDatNroserie
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatMovnroserie', array('local' => 'idnroserie', 'foreign' => 'idnroserie'));
        $this->hasOne('DatMovimientos', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne('NomConservacion', array('local' => 'idconservacion', 'foreign' => 'idconservacion'));
        $this->hasOne('DatProductoLogistica', array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->hasOne(
            'DatEstructuraubicacion', array('local' => 'idestructuraubicacion', 'foreign' => 'idestructuraubicacion')
        );
        $this->hasOne('NomMarca', array('local' => 'idmarca', 'foreign' => 'idmarca'));
        $this->hasOne('NomModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo'));
    }

}
