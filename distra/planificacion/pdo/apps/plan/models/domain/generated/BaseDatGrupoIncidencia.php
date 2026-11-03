<?php

abstract class BaseDatGrupoIncidencia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_grupo_incidencia');
        $this->hasColumn(
            'idincidencia', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idgrupo', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

