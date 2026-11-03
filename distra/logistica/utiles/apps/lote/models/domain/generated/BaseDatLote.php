<?php

abstract class BaseDatLote extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_lote');
        $this->hasColumn(
            'idlote', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datlote')
        );
        $this->hasColumn('fechavencimiento', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('disponible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('numero', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfabricante', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpais', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafabricacion', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('existencia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cronologia', 'numeric', null, array('notnull' => true, 'primary' => false));
        //$this->hasColumn('idtalla', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
