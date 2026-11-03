<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatElemento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_elemento');
        $this->hasColumn(
            'idelemento', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_metadata.sec_elemento')
        );
        $this->hasColumn('idcomponente', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('elemento', 'character varying', 50, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}