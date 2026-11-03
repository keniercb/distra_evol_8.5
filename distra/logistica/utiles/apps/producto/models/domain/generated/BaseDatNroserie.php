<?php

abstract class BaseDatNroserie extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_nroserie');
        $this->hasColumn(
            'idnroserie', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'sec_datnroserie')
        );
        $this->hasColumn('nroserie', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idconservacion', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('numero', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idestructuraubicacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('annofabricacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('annoconservacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarca', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmodelo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nropieza', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
