<?php
abstract class BaseConfNiveles extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_fuerzatrabajo.conf_niveles');
        $this->hasColumn(
            'idconfnivel',
            'numeric',
            null,
            array('notnull' => true,'primary' => true)
        );
        $this->hasColumn(
            'idpreparacion',
            'numeric',
            null,
            array('notnull' => true,'primary' => false)
        );
        $this->hasColumn(
            'idniveleducacional',
            'numeric',
            null,
            array('notnull' => true,'primary' => false)
        );
    }
}
