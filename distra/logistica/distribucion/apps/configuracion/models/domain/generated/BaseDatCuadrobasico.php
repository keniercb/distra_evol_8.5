<?php

abstract class BaseDatCuadrobasico extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_cuadrobasico');

        $this->hasColumn(
            'idcuadrobasico', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logdistribucion.sec_datcuadrobasico')
        );
        $this->hasColumn('idcategoria', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idestructura', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}