<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatCampo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_campo');
        $this->hasColumn(
            'idcampo', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_metadata.sec_campo')
        );
        $this->hasColumn('longitud', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => true, 'primary' => false));
        $this->hasColumn('permitenulo', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('precision', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('secuencia', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idtipodatogestor', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('llaveprimaria', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idtabla', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}