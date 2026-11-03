<?php

abstract class BaseDatEntrega extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('dat_entrega');
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('iddestino', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('origen', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('cicliente', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('version', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombrefirma', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('observacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cargocliente', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nombrecliente', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('casilla', 'character varying', 2, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantbulto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcuenta', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcuentaalternativa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nrodocorigen', 'numeric', null, array('notnull' => false, 'primary' => false));
		$this->hasColumn('iddocorigen', 'numeric', null, array('notnull' => false, 'primary' => false));
		
    }

    public function Setup()
    {
        parent::setUp();
    }

}
