<?php
include_once(APP_HOME . '../../../seguridad/models/domain/SegRol.php');
include_once(APP_HOME . '../../../seguridad/models/domain/SegUsuario.php');

class PenalizacionEstado extends DatPenalizacionEstadoMapper
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatPenalizaciones', array('local' => 'idpenalidad', 'foreign' => 'idpenalidad'));
        $this->hasOne('NomEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasOne('SegUsuario', array('local' => 'idusuario', 'foreign' => 'idusuario'));
    }
}