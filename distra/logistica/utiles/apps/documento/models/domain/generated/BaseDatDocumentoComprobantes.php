<?php

abstract class BaseDatDocumentoComprobantes extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_documentocomprobante');
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('fechacomprobante', 'date', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nrocomprobante', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcomprobante', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
