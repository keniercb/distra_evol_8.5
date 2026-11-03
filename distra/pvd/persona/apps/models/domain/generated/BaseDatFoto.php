<?php

abstract class BaseDatFoto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_foto');
        $this->hasColumn('descripcion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('principal', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('foto', 'bytea', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idfoto', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_foto')
        );
    }

}

