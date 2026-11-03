<?php

abstract class BaseDatCuotas extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_cuotasterminosdepago');
        $this->hasColumn('idcuota', 'numeric', null,array('notnull' => true, 'primary' => true));
        $this->hasColumn('idterminodepago', 'numeric', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('idterminoaplicable', 'numeric', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('porciento', 'decimal', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('aclaraciones', 'varchar', 255,array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

