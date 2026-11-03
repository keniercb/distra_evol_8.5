<?php

abstract class BaseDatProyeccionporejercicio extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_proyeccionporejercicio');
		$this->hasColumn(
            'idproyeccionporejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_proyeccionporejercicio')
        );
        $this->hasColumn(
            'idproyeccion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'idejercicioproyectado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'porciento', 'numeric', null,
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
            'orden', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
