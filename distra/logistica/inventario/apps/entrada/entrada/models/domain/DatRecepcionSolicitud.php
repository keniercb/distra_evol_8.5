<?php

class DatRecepcionSolicitud extends BaseDatRecepcionSolicitud
{
    public function setUp()
    {
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        parent::setUp();
    }

}
