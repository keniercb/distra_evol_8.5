<?php
include_once(APP_HOME . '../../../seguridad/models/domain/SegRol.php');
include_once(APP_HOME . '../../../seguridad/models/domain/SegUsuario.php');


class DatSolicitudPagoEstado extends BaseDatSolicitudPagoEstado
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatSolicitudPago', array('local' => 'idsolicitudpago', 'foreign' => 'idsolicitudpago'));
        $this->hasOne( 'NomEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasOne( 'SegUsuario',array('local' => 'idusuario', 'foreign' => 'idusuario'));
    }
}
