<?php
include_once(APP_HOME . '../../../seguridad/models/domain/SegRol.php');
include_once(APP_HOME . '../../../seguridad/models/domain/SegUsuario.php');

class OfertaNegocioEstado extends DatOfertaNegocioEstadoMapper
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('OfertaNegocio', array('local' => 'idsolicitud', 'foreign' => 'idsolicitud'));
        $this->hasOne('NomEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasOne('SegUsuario', array('local' => 'idusuario', 'foreign' => 'idusuario'));
    }
}