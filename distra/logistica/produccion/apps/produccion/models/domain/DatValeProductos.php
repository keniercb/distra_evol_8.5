<?php

class DatValeProductos extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.dat_valeproductos');
        $this->hasColumn('idvaleproducto', 'numeric', 19, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idvaleproduccion', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('iddeposito', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', 25, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        $this->hasOne('DatValeProduccion', array('local' => 'idvaleproduccion', 'foreign' => 'idvaleproduccion'));
        parent::setUp();
    }
}