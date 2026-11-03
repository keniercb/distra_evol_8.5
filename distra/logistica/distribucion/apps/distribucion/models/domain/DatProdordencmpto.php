<?php
class DatProdordencmpto extends BaseDatProdordencmpto
{
    public function setUp()
    {
        $this->hasOne('DatProdorden', array('local' => 'idprodorden', 'foreign' => 'idprodorden'));
        parent::setUp();
    }
}