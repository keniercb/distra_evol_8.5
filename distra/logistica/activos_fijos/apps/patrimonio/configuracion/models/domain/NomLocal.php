<?php
class NomLocal extends BaseNomLocal
{
    public function setUp()
    {
        parent::setUp();
       $this->hasOne('DatLocalEntidad', array('local' => 'idlocal', 'foreign' => 'idlocal'));    
    }

}