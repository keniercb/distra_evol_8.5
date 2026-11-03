<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:39 PM
 */

abstract class BaseDatMedioPagoContrato extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmcontratacion.dat_mediopagocontrato');
        $this->hasColumn('idmediopagocontrato', 'numeric', 19,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmcontratacion.sec_datmediopago'));
        $this->hasColumn('idcontrato', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idmediopago', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
