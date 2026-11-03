<?php

class DatProdordenarea extends BaseDatProdordenarea
{
    public function setUp()
    {
        $this->hasOne('DatAreaproducto', array('foreign' => 'idareaproducto', 'local' => 'idareaproducto'));
        $this->hasOne('DatProdorden', array('local' => 'idprodorden', 'foreign' => 'idprodorden'));
        parent::setUp();
    }
}