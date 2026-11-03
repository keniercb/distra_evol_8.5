<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:39 PM
 */

abstract class BaseDatPuertoDestinoOferta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmcontratacion.dat_puertodestinooferta');
        $this->hasColumn('idpuertodestinooferta', 'numeric', 19,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmcontratacion.sec_puertodestinooferta'));
        $this->hasColumn('idoferta', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpuertodestino', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
