<?php

abstract class BaseDatRegimentrabajo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_regimentrabajo');
        $this->hasColumn('idturnotrabajo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idgrupodescanso', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idregimentrabajo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('actual', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcargo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idregimentrabajop', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_personaregimen')
        );
    }

}

