<?php

abstract class BaseDatConfigmostrar extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_reccomplejas2.dat_configmostrar');
        $this->hasColumn(
            'idconfigmostrar', 'numeric', null,
            array('notnull' => false, 'primary' => true, 'sequence' => 'mod_reccomplejas2.sec_configmostrar')
        );
        $this->hasColumn('idcampo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('anchocolumna', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('obligatorio', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('expander', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('agruparcampo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('tooltip', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('oculto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('sqlselect', 'text', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('renderer', 'text', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('icono', 'character varying', null, array('notnull' => false, 'primary' => false));

    }

}