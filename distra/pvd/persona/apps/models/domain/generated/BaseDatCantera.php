<?php

abstract class BaseDatCantera extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_personaext.dat_cantera');
        $this->hasColumn(
            'idcantera', 'numeric', null, array(
                'notnull' => false, 'primary' => true,
                'sequence' => 'mod_personaext.sec_canteras')
        );
        $this->hasColumn('idcargopropuesto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idorganismo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idpropone', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('propone', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estadocantera', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechapropuesta', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechatermino', 'date', null, array('notnull' => true, 'primary' => false));

    }
}