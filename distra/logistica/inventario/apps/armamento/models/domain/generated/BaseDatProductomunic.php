<?php

abstract class BaseDatProductomunic extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_productomunic');
        $this->hasColumn(
            'idproductomunic', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_loginventario.sec_datproductomunic')
        );
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('elemembalajes', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idanno', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('numeropartida', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartidaestopin', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idannoestopin', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarcaestopin', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfabpolvdos', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idannoespoleta', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarcaexplosivo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('existencia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idannoexplosivo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idannopolvdos', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idannopolvuno', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartidapolvuno', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructuraubicacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarcaespoleta', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('indice', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idfabestopin', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idrevest', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartida', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('hilera', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estiba', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarcapolvdos', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarcapolvuno', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfabexplosivo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartidapolvdos', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfabespoleta', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartidaespoleta', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfabpolvuno', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfab', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn(
            'idpartidaexplosivo', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn('disponible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('checksum', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 1, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}


