<?php

abstract class BaseDatConfigcondicion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_reccomplejas2.dat_configcondicion');
        $this->hasColumn(
            'idconfigcondicion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_reccomplejas2.sec_configcondicion')
        );
        $this->hasColumn('idcampo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('usarcondicion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn(
            'tipodato', 'character varying', null, array('notnull' => true, 'primary' => false, 'sequence' => 'T')
        );
        $this->hasColumn(
            'usarreemplazar', 'character varying', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn('representartbar', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'condicionpordefecto', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('expresionregular', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('sqlwhere', 'text', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('sqlfilter', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtabla', 'character varying', null, array('notnull' => true, 'primary' => false));
    }


}

