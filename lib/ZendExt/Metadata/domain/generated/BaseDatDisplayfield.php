<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatDisplayfield extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_displayfield');
        $this->hasColumn('idtabla', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idcampo', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}