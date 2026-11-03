<?php

abstract class BaseDatContacto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_persona.dat_contacto');
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipocontacto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtipomediocontacto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('oficial', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('contacto', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'idcontacto', 'numeric', null, array(
                'notnull' => true, 'primary' => true, 'sequence' => 'mod_persona.sec_contacto')
        );
    }

}

