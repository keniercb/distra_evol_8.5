<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatCampoTexto extends DatComponente
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_campotexto');
        $this->hasColumn('idexpresionregular', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcomponente', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}