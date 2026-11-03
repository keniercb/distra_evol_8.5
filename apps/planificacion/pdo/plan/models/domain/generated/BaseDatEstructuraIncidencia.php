<?php

abstract class BaseDatEstructuraIncidencia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_estructura_incidencia');
        $this->hasColumn(
            'idincidencia', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idestructura', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

