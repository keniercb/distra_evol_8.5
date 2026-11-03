<?php

abstract class BaseDatDesviacionplanxsustitucion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desviacionplanxsustitucion');
        $this->hasColumn(
            'iddesviacionplan', 'numeric', null,
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
