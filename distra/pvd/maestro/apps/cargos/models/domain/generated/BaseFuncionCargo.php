<?php
abstract class BaseFuncionCargo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_funccargo');
        $this->hasColumn(
            'denominacion',
            'character varying',
            null,
            array ('notnull' => true,'primary' => false)
        );
        $this->hasColumn(
            'idestructura',
            'numeric',
            null,
            array ('notnull' => true,'primary' => false)
        );
        $this->hasColumn(
            'especifica',
            'numeric',
            null,
            array ('notnull' => true,'primary' => false)
        );
        $this->hasColumn(
            'idfunccargo',
            'numeric',
            null,
            array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_funccargo')
        );
    }
}