<?php

abstract class BaseDatCuadrobasicocliente extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_cuadrobasicocliente');

        $this->hasColumn(
            'idcuadrobasicocliente', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logdistribucion.sec_datcuadrobasicocliente')
        );
        $this->hasColumn('idcuadrobasico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idcliente', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}