<?php

abstract class BaseDatPersona extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_persona');
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('sexo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'feliminado', 'timestamp without time zone', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fregistro', 'timestamp without time zone', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn('sapel', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('papel', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('snombre', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombre', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idsuin', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idpersona', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_persona')
        );
    }

}

