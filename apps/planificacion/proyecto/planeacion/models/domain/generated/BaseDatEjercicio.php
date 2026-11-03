<?php

abstract class BaseDatEjercicio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifproyecto.dat_ejercicio');
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planifproyecto.sec_ejercicio')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'date', 255,
            array('notnull' => true, 'primary' => false)
        );		
		$this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		
		$this->hasColumn(
            'duracionestimada', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'tiemporeal', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'estado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


