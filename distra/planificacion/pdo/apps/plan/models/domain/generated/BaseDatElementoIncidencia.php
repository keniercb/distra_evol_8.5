<?php

abstract class BaseDatElementoIncidencia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_elemento_incidencia');
        $this->hasColumn(
            'idincidencia', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idelemento', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

