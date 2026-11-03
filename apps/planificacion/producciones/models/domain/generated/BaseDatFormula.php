<?php

abstract class BaseDatFormula extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_formula');
        $this->hasColumn(
            'idformula', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_formula')
        ); 
		$this->hasColumn(
            'idindicadorsalida', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'idagrupacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );      
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
		$this->hasColumn(
            'cantidadsalida', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'kcalformula', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );        
       
        $this->hasColumn(
            'tipoporciento', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'date', null,
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


