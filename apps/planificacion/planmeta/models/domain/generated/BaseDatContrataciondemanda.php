<?php

abstract class BaseDatContrataciondemanda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_contrataciondemanda');
        $this->hasColumn(
            'idcontrataciondemanda', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_contrataciondemanda')
        );
        $this->hasColumn(
            'cantidadcontratada', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		 $this->hasColumn(
            'preciocontratado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );        
        $this->hasColumn(
            'idplanificacion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
		$this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
		$this->hasColumn(
            'identidadmodelo', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
		$this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
		$this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );      
         
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
