<?php
/**
 * Created by PhpStorm.
 * User: work
 * Date: 17/11/17
 * Time: 12:39 PM
 */

abstract class BaseDatIncotermOferta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_crmcontratacion.dat_incotermoferta');
        $this->hasColumn('idincotermoferta', 'numeric', 19,array('notnull' => true, 'primary' => true, 'sequence' => 'mod_crmcontratacion.sec_incotermoferta'));
        $this->hasColumn('idoferta', 'numeric', 19, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idincoterm', 'numeric', 19, array('notnull' => false, 'primary' => false));
    }

    public function setUp() {
        parent::setUp();
    }

}
