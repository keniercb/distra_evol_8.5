<?php
abstract class BaseConfEspcargo extends Doctrine_Record
{
    public function setTableDefinition()
    {
        $this->setTableName('mod_rrhhmaestro.conf_espcargo');
        $this->hasColumn(
            'denominacion',
            'character varying',
            null,
            array ('notnull' => true,'primary' => false)
        );
        $this->hasColumn(
            'idcargo',
            'numeric',
            null,
            array ('notnull' => true,'primary' => false)
        );
        $this->hasColumn(
            'idespcargo',
            'numeric',
            null,
            array ('notnull' => true,'primary' => true, 'sequence' => 'mod_rrhhmaestro.sec_espcargo')
        );
    }
}