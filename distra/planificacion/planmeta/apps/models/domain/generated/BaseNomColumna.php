<?php

abstract class BaseNomColumna extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('nom_columna');
        $this->hasColumn(
            'idcolumna', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_columna')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 100,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
         
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase


