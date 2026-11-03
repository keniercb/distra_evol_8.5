<?php
abstract class BaseConfMotivosbaja extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.conf_motivosbaja');
        $this->hasColumn(
            'idconfmotivobaja',
            'numeric',
            null,
            array('notnull' => true,'primary' => true)
        );
        $this->hasColumn(
            'motivoreporte',
            'character varying',
            null,
            array('notnull' => true,'primary' => false)
        );
        $this->hasColumn(
            'idmotivobaja',
            'numeric',
            null,
            array('notnull' => false,'primary' => false)
        );
    }
}
