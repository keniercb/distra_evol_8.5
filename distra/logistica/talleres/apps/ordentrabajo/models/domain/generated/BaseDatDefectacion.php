<?php

abstract class BaseDatDefectacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_taller.dat_defectacion');
        $this->hasColumn(
            'iddefectacion', 'numeric', null,
            array('notnull' => true, 'primary' => true/*,'sequence' => 'mod_logistica.sec_datconciliacion'*/)
        );
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descripcion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcliente', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

