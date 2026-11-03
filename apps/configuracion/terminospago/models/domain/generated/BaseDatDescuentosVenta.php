<?php

abstract class BaseDatDescuentosVenta extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.dat_descuentosventa');
        $this->hasColumn('iddescuentosventa', 'numeric', null,array('notnull' => true, 'primary' => true));
        $this->hasColumn('idterminodepago', 'numeric', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('porciento', 'decimal', null,array('notnull' => true, 'primary' => false));
        $this->hasColumn('min', 'numeric', null,array('notnull' => false, 'primary' => false));
        $this->hasColumn('aclaraciones', 'varchar', 255,array('notnull' => false, 'primary' => false));
        $this->hasColumn('max', 'numeric', null,array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}

