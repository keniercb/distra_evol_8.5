<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:39 PM
 */

abstract class BaseDatMedioPagoOferta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmcontratacion.dat_mediopagooferta');
        $this->hasColumn('idmediopagooferta', 'numeric', 19,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmcontratacion.sec_mediopagooferta'));
        $this->hasColumn('idoferta', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmediopago', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
