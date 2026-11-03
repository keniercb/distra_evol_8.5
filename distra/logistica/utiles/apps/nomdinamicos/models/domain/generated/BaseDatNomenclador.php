<?php

abstract class BaseDatNomenclador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logmetadata.dat_nomenclador');
        $this->hasColumn(
            'idnomenclador', 'numeric', 19,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logmetadata.sec_datnomenclador')
        );
        $this->hasColumn('denominacion', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('referencia', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('propiedades', 'json', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtiponomenclador', 'numeric', 19, null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 

