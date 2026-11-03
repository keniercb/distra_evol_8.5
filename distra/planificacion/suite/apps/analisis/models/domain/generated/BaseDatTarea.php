<?php

abstract class BaseDatTarea extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_planifproyecto.dat_tarea');
        $this->hasColumn(
            'idevaluacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechafin', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtarea', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'plantilla', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechainicio', 'date', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'duracionestimada', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'duracionreal', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'lugar', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'horainicio', 'time', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'horafin', 'time', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'esprincipal', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tiporepeticion', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtareadepende', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );  $this->hasColumn(
            'dependencias', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'evento', 'character varying', null,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }
}//fin clase
?>

