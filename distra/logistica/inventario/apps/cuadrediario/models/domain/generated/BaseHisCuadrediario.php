<?php

abstract class BaseHisCuadrediario extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.his_cuadrediario');
        
        $this->hasColumn(
            'idcierrediario', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'iddeposito', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechacierre', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'saldoinicial', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'saldofinal', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'saldocont', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'contador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechacierreanterior', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}
