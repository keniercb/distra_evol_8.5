<?php

/**
 *
 */
class BaseDatDocPrestamo extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_docprestamo');
        $this->hasColumn('iddocprestamo', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('idclientesproveedores', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpersona', 'numeric', null, array('notnull' => false, 'primary' => false));

        $this->hasColumn('carnet', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('telefono', 'character varying', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('direccion', 'character varying', null, array('notnull' => false, 'primary' => false));

    }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
