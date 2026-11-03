<?php

abstract class BaseDatIncidencia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_incidencia');
        $this->hasColumn(
            'impacto', 'character varying', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idincidencia', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

