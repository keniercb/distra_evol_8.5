<?php

abstract class BaseDatEstadoce extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifinversiones.dat_estadoce');
        $this->hasColumn(
            'idestadoce', 'numeric', null,
            array('notnull' => false, 'primary' => true,
                  'sequence' => 'mod_planifinversiones.sec_estadoce')
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

