<?php

/**
 *
 */
class BaseDatDocEnviadoReparar extends Doctrine_Record
{

    /**
     *
     */
    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_docenviadoreparar');
        $this->hasColumn('iddocenviadoreparar', 'numeric', null, array('notnull' => true, 'primary' => true));
        $this->hasColumn('identidaddestino', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idclientesproveedores', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('idtransportador', 'numeric', null, array('notnull' => false, 'primary' => true));
        $this->hasColumn('chapatransportador', 'character varying', null, array('notnull' => false, 'primary' => false));
        }

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
    }

}
