<?php

abstract class BaseDatTerminopago extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_terminosdepago');
        $this->hasColumn('idterminodepago', 'numeric', null,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_terminosdepago'));
        $this->hasColumn('idestructura', 'numeric', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idumplazo', 'numeric', null,array('notnull' => false, 'primary' => false));
        $this->hasColumn('aplazos', 'numeric', null,array('notnull' => false, 'primary' => false));
        $this->hasColumn('mora', 'numeric', null,array('notnull' => false, 'primary' => false));
        $this->hasColumn('plazo', 'numeric', null,array('notnull' => false, 'primary' => false));
        $this->hasColumn('descventa', 'numeric', null,array('notnull' => false, 'primary' => false));
        $this->hasColumn('dpp', 'numeric', null,array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombre', 'varchar', 255,array('notnull' => false, 'primary' => false));
        $this->hasColumn('predeterminado', 'numeric', null,array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

