<?php

abstract class BaseDatCierreperiodo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_cierreperiodo');
        $this->hasColumn('idcierreperiodo', 'numeric', 19, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_cierreperiodo'));
        $this->hasColumn('idestructurasubsist', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idperiodo', 'numeric', 19, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
?>

