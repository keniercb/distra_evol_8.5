<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:39 PM
 */

abstract class BaseDatPuertoOrigenOferta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmcontratacion.dat_puertoorigenoferta');
        $this->hasColumn('idpuertoorigenoferta', 'numeric', 19,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmcontratacion.sec_puertoorigenoferta'));
        $this->hasColumn('idoferta', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpuertoorigen', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
