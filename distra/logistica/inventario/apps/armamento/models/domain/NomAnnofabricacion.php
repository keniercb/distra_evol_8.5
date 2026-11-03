<?php

class NomAnnofabricacion extends BaseNomAnnofabricacion
{

    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatAnnofabricacionEntidad', array('local' => 'idnannofabricacion', 'foreign' => 'idannofabricacion')
        );
    }

}


