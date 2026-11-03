<?php

class DatLoteComprometido extends BaseDatLoteComprometido
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatLote', array('local' => 'idlote', 'foreign' => 'idlote'));
        $this->hasOne('DatDocumento', array('local' => 'iddocumento', 'foreign' => 'iddocumento'));
        $this->hasOne('DatEstructuraubicacion', array('local' => 'idubicacion', 'foreign' => 'idestructuraubicacion'));
        $this->hasOne('DatUbicacionComprometida', array('local' => 'idubicacion', 'foreign' => 'idubicacion'));
    }

}
