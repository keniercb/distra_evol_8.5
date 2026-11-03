<?php

class DatOrdenMateriaPrima extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.dat_ordenmateriales');
        $this->hasColumn('idordenmateriales', 'numeric', null, array('notnull' => true, 'primary' => true,'sequence'=>'mod_logproduccion.sec_ordenmaterial'));
        $this->hasColumn('idordenproduccion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cantidadsolicitada', 'numeric', null, array('notnull' => true, 'primary' => false));

    }

    public function setUp()
    {
       parent::setUp();
    }
}