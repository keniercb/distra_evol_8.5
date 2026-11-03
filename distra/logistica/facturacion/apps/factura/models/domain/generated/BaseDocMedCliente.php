<?php

abstract class BaseDocMedCliente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logfacturacion.dat_docmedicioncliente');
        $this->hasColumn(
            'iddocumedcliente', 'numeric', null, array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_logfacturacion.sec_datdocumentomedicioncliente')
        );
        $this->hasColumn('cantidad', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmedicioncliente', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }
}
