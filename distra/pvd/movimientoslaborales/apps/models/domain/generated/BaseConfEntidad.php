<?php
abstract class BaseConfEntidad extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.conf_entidad');
        $this->hasColumn(
            'identidad',
            'numeric',
            null,
            array('notnull' => true,'primary' => true)
        );
        $this->hasColumn(
            'idestructura',
            'numeric',
            null,
            array('notnull' => true,'primary' => true)
        );
    }
}