<?php

class DatDocExpediente extends BaseDatDocExpediente {
    public function setUp() {
        parent::setUp();
        $this->hasOne('DatExpedienteInmueble', array('local' => 'idexpinmueble', 'foreign' => 'idexpinmueble'));
        $this->hasOne('NomDocumentoExpediente', array('local' => 'idexpediente', 'foreign' => 'idexpediente'));
    }
}