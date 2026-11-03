<?php
abstract class BaseConfSuplemento extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.conf_suplemento');
        $this->hasColumn(
            'idsuplemento',
            'numeric',
            null,
            array('notnull' => true,'primary' => true)
        );
        $this->hasColumn(
            'identidad',
            'numeric',
            null,
            array('notnull' => true,'primary' => false)
        );
        $this->hasColumn(
            'idplantilla',
            'numeric',
            null,
            array('notnull' => true,'primary' => false)
        );
    }
}