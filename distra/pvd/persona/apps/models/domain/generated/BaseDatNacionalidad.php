<?php

abstract class BaseDatNacionalidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_nacionalidad');
        $this->hasColumn('idnacionalidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fhasta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fdesde', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('activa', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idnacionalidadp', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_nacionalidadp')
        );
    }

}

