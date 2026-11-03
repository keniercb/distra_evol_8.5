<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatCampoNumerico extends DatComponente
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_camponumerico');
        $this->hasColumn('limitesuperior', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcomponente', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('limiteinferior', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('negativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('decimal', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('precision', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}