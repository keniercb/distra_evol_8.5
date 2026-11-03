<?php

abstract class BaseCubPartidas extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_loganalisis.cub_existenciapartidas');
        $this->hasColumn(
                'idexistencia', 'numeric', null,
                array(
            'notnull' => true,
            'primary' => false,
            'sequence' => 'mod_loganalisis.sec_existencia'
                )
        );
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtiempo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcategoria', 'numeric', null, array('notnull' => false, 'primary' => true));        
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('disponible', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ubicacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idanno', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfab', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartida', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarcapolvuno', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartidapolvuno', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idannopolvuno', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfabpolvuno', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarcapolvdos', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartidapolvdos', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idannopolvdos', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfabpolvdos', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarcaexplosivo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartidaexplosivo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idannoexplosivo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfabexplosivo', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarcaespoleta', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartidaespoleta', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idannoespoleta', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfabespoleta', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmarcaestopin', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpartidaestopin', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idannoestopin', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idfabestopin', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('checksum', 'character varying', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

