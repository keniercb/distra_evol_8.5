<?php

abstract class BaseDatAfeccion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_afeccion');
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tratamiento', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpadecimiento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idafeccion', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_afeccion')
        );
    }

}

