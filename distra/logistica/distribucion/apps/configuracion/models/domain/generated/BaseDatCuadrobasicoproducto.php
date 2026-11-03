<?php

abstract class BaseDatCuadrobasicoproducto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_cuadrobasicoproducto');

        $this->hasColumn(
            'idcuadrobasicoproducto', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logdistribucion.sec_datcuadrobasicoproducto')
        );
        $this->hasColumn('idcuadrobasico', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}