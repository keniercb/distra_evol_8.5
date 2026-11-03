<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:39 PM
 */

abstract class BaseDatPuertoOrigenContrato extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmcontratacion.dat_puertoorigencontrato');
        $this->hasColumn('idpuertoorigencontrato', 'numeric', 19,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmcontratacion.sec_puertoorigencontrato'));
        $this->hasColumn('idcontrato', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpuertoorigen', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
