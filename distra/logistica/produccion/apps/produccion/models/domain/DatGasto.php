<?php

class DatGasto extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.dat_gasto');
        $this->hasColumn('idgasto', 'numeric', null, array('notnull' => true, 'primary' => true,'sequence'=>'mod_logproduccion.sec_gasto'));
        $this->hasColumn('idordenproduccion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipogasto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idnorma', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precio', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatOrdenProduccion', array('local' => 'idordenproduccion', 'foreign' => 'idordenproduccion'));
        /*$this->hasOne('NomTipoControlCalidad', array('local' => 'idtipogasto', 'foreign' => 'idtipocontrolcalidad'));*/
    }
}