<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatChequeo extends DatComponente
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_chequeo');
        $this->hasColumn('idcomponente', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('valor', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}