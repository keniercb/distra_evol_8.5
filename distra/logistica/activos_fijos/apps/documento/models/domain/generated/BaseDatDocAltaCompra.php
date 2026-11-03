<?php

/**
 *
 */
class BaseDatDocAltaCompra extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_docaltacompra');
        $this->hasColumn('iddocaltacompra', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idclientesproveedores', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nrocontrato', 'character varying', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('nrofactura', 'character varying', 255, array('notnull' => true, 'primary' => false));
    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
