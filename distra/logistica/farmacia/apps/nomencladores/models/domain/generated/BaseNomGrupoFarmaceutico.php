<?php

abstract class BaseNomGrupoFarmaceutico extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfarmacia.nom_grupofm');
        $this->hasColumn('idgrupofm', 'numeric', null, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logfarmacia.sec_nomgrupofm'));
        $this->hasColumn('codigo', 'character varying', 255 , array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255 , array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpadre', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idarbol', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nivel', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('parentpath', 'string', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('ordenizq', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('ordender', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}