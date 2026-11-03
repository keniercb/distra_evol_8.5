<?php

abstract class BaseDatCalculoduracion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_planifproyecto.dat_calculoduracion');
        $this->hasColumn(
            'idcalculoduracion', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planifproyecto.sec_calculoduracion')
        );
       
        $this->hasColumn(
            'idtarea', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
		 $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tiempo', 'time', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
		$this->hasColumn(
            'idejerciciotarea', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
       
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


