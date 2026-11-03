<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatAreaTexto extends DatComponente
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_areatexto');
        $this->hasColumn('idcomponente', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}