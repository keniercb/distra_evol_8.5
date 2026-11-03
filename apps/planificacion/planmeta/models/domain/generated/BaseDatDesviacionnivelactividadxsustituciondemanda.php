<?php

abstract class BaseDatDesviacionnivelactividadxsustituciondemanda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desviacionnivelactividadxsustituciondemanda');
        $this->hasColumn(
            'iddesviacionnivelactividaddemanda', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );
       
        $this->hasColumn(
            'idactividadentidad', 'numeric', null,
            array('notnull' => true, 'primary' => true)
        );       
            
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase
