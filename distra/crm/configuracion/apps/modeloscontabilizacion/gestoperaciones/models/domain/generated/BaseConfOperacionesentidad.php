<?php

abstract class BaseConfOperacionesentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.conf_operacionesentidad');
        $this->hasColumn('idconfoperaciones', 'numeric', 19, array('notnull' => true, 'primary' => true,
            'sequence' => 'mod_datosmaestros.sec_confoperacionesentidad'));
        $this->hasColumn('idnomoperaciones', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('iddoc', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('signo', 'numeric', 19, array('notnull' => false));
        $this->hasColumn('idplantilla', 'numeric', 19, array('notnull' => false));
    }

}
