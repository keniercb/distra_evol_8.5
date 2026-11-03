<?php

abstract class BaseDatDesviacionplandemanda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desviacionplandemanda');
        $this->hasColumn(
            'iddesviacionplandemanda', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_desviacionplan')
        );
      
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );      
         $this->hasColumn(
            'identidadmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
          $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
				
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
