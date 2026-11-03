<?php
include_once(APP_HOME . '../../../seguridad/models/domain/SegRol.php');
include_once(APP_HOME . '../../../seguridad/models/domain/SegUsuario.php');


class DatArriboEstado extends BaseDatArriboEstado
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatArribo', array('local' => 'idarribo', 'foreign' => 'idarribo'));
        $this->hasOne( 'NomEstado', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasOne( 'SegUsuario',array('local' => 'idusuario', 'foreign' => 'idusuario'));
    }
}
