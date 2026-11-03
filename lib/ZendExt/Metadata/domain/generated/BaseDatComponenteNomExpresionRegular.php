<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatComponenteNomExpresionRegular extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_componente_nom_expresion_regular');
        $this->hasColumn('idexpresionregular', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idcomponente', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}