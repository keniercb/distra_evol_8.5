<?php

/*
 * Esta clase ha sido generada por Doctrine Generator 
 */

abstract class BaseDatFecha extends DatComponente
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_metadata.dat_fecha');
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcomponente', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}