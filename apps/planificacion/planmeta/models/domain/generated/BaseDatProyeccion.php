<?php

abstract class BaseDatProyeccion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_proyeccion');
        $this->hasColumn(
            'idproyeccion', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_proyeccion')
        );
		$this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );        
		$this->hasColumn(
            'idejerciciobase', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		 $this->hasColumn(
            'componente', 'numeric', null,
            array('notnull' => true, 'primary' => false)
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
            'planes', 'numeric[]', null,
            array('notnull' => true, 'primary' => false)
        );
        
        $this->hasColumn(
            'lineal', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		
		
        $this->hasColumn(
            'importegasto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'importeingreso', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'fecha', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
                $this->hasColumn(
            'porciento', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
