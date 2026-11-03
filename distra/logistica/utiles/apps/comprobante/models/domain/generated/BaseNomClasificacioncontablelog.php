<?php

abstract class BaseNomClasificacioncontablelog extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logistica.nom_clasificacioncontable');
        $this->hasColumn(
            'idclasificacioncontable', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_logistica.sec_nomclasificacioncontable')
        );
        $this->hasColumn('fechainicio', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('fechafin', 'date', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('denominacion', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('codigo', 'character varying', 255, array('notnull' => false, 'primary' => false));
        $this->hasColumn('estado', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcuenta', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idcuentaalt', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('facturacion', 'numeric', null, array('notnull' => true, 'primary' => false));
    }

    public function Setup()
    {
        parent::setUp();
    }

}
