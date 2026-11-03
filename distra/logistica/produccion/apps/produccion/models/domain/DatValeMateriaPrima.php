<?php

class DatValeMateriaPrima extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.dat_valemateriales');
        $this->hasColumn('idmaterialesvaleproduccion', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logproduccion.sec_valematerial'));
        $this->hasColumn('idvaleproduccion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function setUp()
    {
        $this->hasOne('DatValeProduccion', array('local' => 'idvaleproduccion', 'foreign' => 'idvaleproduccion'));
        parent::setUp();
    }
}