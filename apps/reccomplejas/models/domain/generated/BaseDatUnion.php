<?php

abstract class BaseDatUnion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_reccomplejas2.dat_union');
        $this->hasColumn(
            'idunion', 'numeric', null,
            array('notnull' => false, 'primary' => true, 'sequence' => 'mod_reccomplejas2.sec_union')
        );
        $this->hasColumn('idmapeo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('campoinicial', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('operador', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('campofinal', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('logico', 'character varying', null, array('notnull' => true, 'primary' => false));
    }


}

