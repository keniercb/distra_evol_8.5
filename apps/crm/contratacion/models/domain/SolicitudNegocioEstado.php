<?php
include_once(APP_HOME . '../../../seguridad/models/domain/SegRol.php');
include_once(APP_HOME . '../../../seguridad/models/domain/SegUsuario.php');

class SolicitudNegocioEstado extends DatSolicitudNegocioEstadoMapper
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('SolicitudNegocio', array('local' => 'idsolicitud', 'foreign' => 'idsolicitud'));
        $this->hasOne('NomEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasOne('SegUsuario', array('local' => 'idusuario', 'foreign' => 'idusuario'));
    }
}