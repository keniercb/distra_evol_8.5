<?php

abstract class BaseDatRecepcion extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_loginventario.dat_recepcion');
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('fechadocorigen', 'date', null, array('notnull' => false, 'primary' => false));
       // $this->hasColumn('nrodocorigen', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nrodocorigen', 'character varying', 50, array('notnull' => false, 'primary' => false));
        $this->hasColumn('nrocontrato', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechacontrato', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipopago', 'numeric', 0, array('notnull' => false, 'primary' => false));
        $this->hasColumn('recargo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descuento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('recargoalternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('descuentoalternativo', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcondicionpago', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantbulto', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tipobulto', 'varchar', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('tasa', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmoneda', 'numeric', null, array('notnull' => false, 'primary' => false));
	    $this->hasColumn('salidafactura', 'numeric', null, array('notnull' => false, 'primary' => false));
	    $this->hasColumn('idcontrato', 'numeric', null, array('notnull' => false, 'primary' => false));
	    $this->hasColumn('bl', 'character varying', null, array('notnull' => false, 'primary' => false));
	    $this->hasColumn('idpuertodestino', 'numeric', null, array('notnull' => false, 'primary' => false));
	    $this->hasColumn('puertodestino', 'character varying', null, array('notnull' => false, 'primary' => false));
	    $this->hasColumn('destinocomercial', 'character varying', null, array('notnull' => false, 'primary' => false));
	    $this->hasColumn('prodgenerico', 'character varying', null, array('notnull' => false, 'primary' => false));
	    $this->hasColumn('contenedor', 'character varying', null, array('notnull' => false, 'primary' => false));

    }

    public function Setup()
    {
        parent::setUp();
    }

}
