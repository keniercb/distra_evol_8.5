<?php

abstract class BaseDatCantidadesComprometidas extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.dat_cantidadcomprometida');
        $this->hasColumn(
            'idcantidadcomprometida', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_datcantidadcomprometida')
        );
        $this->hasColumn('iddocumento', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idproducto', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcliente', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('cantidad', 'numeric', 0, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', 1, array('notnull' => false, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
