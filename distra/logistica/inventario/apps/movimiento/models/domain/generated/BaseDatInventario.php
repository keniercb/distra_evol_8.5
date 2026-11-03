<?php
abstract class BaseDatInventario extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_inventario');
        $this->hasColumn('idinventario', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('tipoinventario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechaf', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idusuarioalm', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarea', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('diario', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idperiodo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuraubicacion', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
