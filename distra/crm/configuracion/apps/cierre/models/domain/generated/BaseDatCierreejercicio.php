<?php

abstract class BaseDatCierreejercicio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_cierreejercicio');
        $this->hasColumn('idcierreejercicio', 'numeric', 19, array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_cierreejercicio'));
        $this->hasColumn('idestructurasubsist', 'numeric', 19, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idejercicio', 'numeric', 19, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase 
?>

