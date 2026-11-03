<?php

class DatRecepcionreserva extends BaseDatRecepcionreserva
{
    public function setUp()
    {
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatRecepcion', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatDocumentoPadre', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasMany('DatMovimientos', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        parent::setUp();
    }

}
