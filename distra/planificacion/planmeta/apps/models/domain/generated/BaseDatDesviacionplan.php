<?php

abstract class BaseDatDesviacionplan extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desviacionplan');
        $this->hasColumn(
            'iddesviacionplan', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_desviacionplan')
        );
        $this->hasColumn(
            'cantidadreal', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechareal', 'date', null,
            array('notnull' => true, 'primary' => false)
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
