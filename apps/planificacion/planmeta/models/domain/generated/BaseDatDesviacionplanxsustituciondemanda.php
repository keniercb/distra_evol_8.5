<?php

abstract class BaseDatDesviacionplanxsustituciondemanda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desviacionplanxsustituciondemanda');
        $this->hasColumn(
            'iddesviacionplandemanda', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
       
        $this->hasColumn(
            'idplanificacion', 'numeric[]', null,
            array('notnull' => true, 'primary' => true)
        );
          
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
