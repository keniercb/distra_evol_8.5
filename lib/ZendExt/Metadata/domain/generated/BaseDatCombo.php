<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatCombo extends DatComponente
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_combo');
        $this->hasColumn('idcomponente', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('filtrado', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}