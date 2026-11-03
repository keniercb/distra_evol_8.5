<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:39 PM
 */

abstract class BaseDatCondicionPagoContratoImportacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmcontratacion.dat_condicionpagocontratoimportacion');
        $this->hasColumn('idcondicionpagocontratoimportacion', 'numeric', 19,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmcontratacion.sec_condicionpagocontratoimportacion'));
        $this->hasColumn('idcontratoimportacion', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcondicionpago', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
