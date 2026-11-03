<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:39 PM
 */

abstract class BaseDatPuertoDestinoContrato extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmcontratacion.dat_puertodestinocontrato');
        $this->hasColumn('idpuertodestinocontrato', 'numeric', 19,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmcontratacion.sec_puertodestinocontrato'));
        $this->hasColumn('idcontrato', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpuertodestino', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
