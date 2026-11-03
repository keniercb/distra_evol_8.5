<?php
include_once(APP_HOME . '../../../seguridad/models/domain/SegRol.php');
include_once(APP_HOME . '../../../seguridad/models/domain/SegUsuario.php');

class ReclamacionEstado extends DatReclamacionEstadoMapper
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatReclamaciones', array('local' => 'idreclamacion', 'foreign' => 'idreclamacion'));
        $this->hasOne('NomEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasOne('SegUsuario', array('local' => 'idusuario', 'foreign' => 'idusuario'));
    }
}