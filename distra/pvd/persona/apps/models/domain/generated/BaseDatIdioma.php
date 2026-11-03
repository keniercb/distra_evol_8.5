<?php

abstract class BaseDatIdioma extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_idioma');
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idformaadquiriridioma', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('ididioma', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'ididiomap', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_personaext.sec_datidioma')
        );
    }
}

