<?php
class DatOrdenProductoSust extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logproduccion.dat_ordenproductosust');
        $this->hasColumn('idordenproductosust', 'numeric', null, array('notnull' => true, 'primary' => true,));
        $this->hasColumn('idordenproduccion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('norma', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idactividad', 'numeric', null, array('notnull' => false, 'primary' => false));

    }

    public function setUp()
    {
       parent::setUp();
    }
}