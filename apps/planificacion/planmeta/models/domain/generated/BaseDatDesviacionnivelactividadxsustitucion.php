<?php

abstract class BaseDatDesviacionnivelactividadxsustitucion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_desviacionnivelactividadxsustitucion');
        $this->hasColumn(
            'iddesviacionnivelactividad', 'numeric', null,
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
