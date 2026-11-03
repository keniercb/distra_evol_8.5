<?php

class DatTiempoEntidad extends BaseDatTiempoentidad
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('NomTiempo', array('local' => 'idtiempo', 'foreign' => 'idtiempo'));
    }
}
