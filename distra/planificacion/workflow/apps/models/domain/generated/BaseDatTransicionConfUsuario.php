<?php

abstract class  BaseDatTransicionConfUsuario extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_flujotrabajo.dat_transicion_conf_usuario');
        $this->hasColumn(
            'idtransicion', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'simultaneo', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}


