<?php

abstract class BaseNomTasacambio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpuntoventa.nom_tasacambio');
        $this->hasColumn(
            'idtasacambio', 'numeric', null,
            array(
                'notnull' => true, 'primary' => true,
                'sequence' => 'mod_logpuntoventa.sec_nomtasacambio'
            )
        );        
        $this->hasColumn(
            'idmonedabase', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );      
        $this->hasColumn(
            'idmonedacambio', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
        $this->hasColumn(
            'estado', 'character varying', 1, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechafin', 'date', null, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'fechainicio', 'date', null, array(
                'notnull' => true, 'primary' => false
            )
        );    
        $this->hasColumn(
            'denominacion', 'character varying', 255, array(
                'notnull' => false, 'primary' => false
            )
        );
        $this->hasColumn(
            'venta', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );    
        $this->hasColumn(
            'devolucion', 'numeric', null, array(
            'notnull' => true, 'primary' => false
            )
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}
