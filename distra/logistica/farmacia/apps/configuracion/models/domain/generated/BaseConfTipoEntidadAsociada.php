<?php

abstract class BaseConfTipoEntidadAsociada extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.conf_tipoentidadasociada');

        $this->hasColumn(
            'idtipoentidadasociada', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => "mod_logfarmacia.sec_asociartipoentidad")
        );
        $this->hasColumn(
            'idtipoentidad', 'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipounidadsalud', 'numeric', 19,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
