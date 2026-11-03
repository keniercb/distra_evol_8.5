<?php

abstract class BaseDatUsuarioIncidencia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_objetivos.dat_usuario_incidencia');
        $this->hasColumn(
            'idincidencia', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => false, 'primary' => true)
        );
    }


}

