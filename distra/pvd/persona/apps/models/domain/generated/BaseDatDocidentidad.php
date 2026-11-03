<?php

abstract class BaseDatDocidentidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_docidentidad');
        $this->hasColumn('principal', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('serie', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('numero', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipodocidentidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'iddocidentidad', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_docidentidad')
        );
    }

}

