<?php

class DatAnnofabricacionEntidad extends BaseDatAnnofabricacionEntidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomAnnofabricacion', array('local' => 'idannofabricacion', 'foreign' => 'idannofabricacion'));
    }

}


