<?php

abstract class BaseNomCalidadmovdiferencia extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('nom_calidadmovdiferencia');
        $this->hasColumn(
            'idcalidad', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'sec_nomcalidadmovdiferencia')
        );
        $this->hasColumn(
            'denominacion', 'character varying', 70,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'version', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estado', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase
