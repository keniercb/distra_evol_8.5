<?php

abstract class BaseNomTiporotacionarea extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.nom_tiporotacionarea');
        $this->hasColumn(
            'idtiporotacionarea', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_logfarmacia.sec_nomrotacionarea')
        );
        $this->hasColumn(
            'iddeposito', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtiporotacion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
