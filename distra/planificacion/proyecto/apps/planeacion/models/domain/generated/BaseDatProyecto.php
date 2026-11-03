<?php

abstract class BaseDatProyecto extends Doctrine_Record {

    public function setTableDefinition() {
        $this->setTableName('mod_planifproyecto.dat_proyecto');
        $this->hasColumn(
                'idproyecto', 'numeric', null, array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
                'fechafin', 'date', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'plantilla', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'fechainicio', 'date', null, array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
                'identificador', 'character varying', 10, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'duracionestimada', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'duracionreal', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
                'idprioridad', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup() {
        parent::setUp();
    }

}

//fin clase
?>

