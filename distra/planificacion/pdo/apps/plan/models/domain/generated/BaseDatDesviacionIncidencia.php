<?php

abstract class BaseDatDesviacionIncidencia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_desviacion_incidencia');
        $this->hasColumn(
            'iddesviacion', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idincidencia', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

