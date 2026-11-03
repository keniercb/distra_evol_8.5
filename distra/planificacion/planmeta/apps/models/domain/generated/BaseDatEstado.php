<?php

abstract class BaseDatEstado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifinversiones.dat_estado');
        $this->hasColumn(
            'idestado', 'numeric', null,
            array('notnull' => false, 'primary' => true,
                  'sequence' => 'mod_planifinversiones.sec_estado')
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idnomenclador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

}

