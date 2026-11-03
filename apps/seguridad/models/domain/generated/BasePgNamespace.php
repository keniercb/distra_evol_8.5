<?php

abstract class BasePgNamespace extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('pg_namespace');
        $this->hasColumn(
            'oid', 'integer', null, array(
            'type' => 'integer',
            'length' => 4,
            'unsigned' => false,
            'notnull' => true,
            'primary' => true,
            )
        );
        $this->hasColumn(
            'nspname', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'nspowner', 'blob', null, array(
            'type' => 'blob',
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'nspacl', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'notnull' => false,
            'primary' => false,
            )
        );
    }

}
