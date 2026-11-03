<?php


class DatCierreventa extends BaseDatCierreventa
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomFilaestruc', array('local' => 'identidad', 'foreign' => 'idfila'));
        $this->hasOne('DatDocumentoventa', array('local' => 'idcierreventa', 'foreign' => 'idcierreventa'));

    }
}