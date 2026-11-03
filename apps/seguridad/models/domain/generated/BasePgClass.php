<?php

abstract class BasePgClass extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('pg_class');
        $this->hasColumn(
            'relname', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'notnull' => true,
            'primary' => true,
            )
        );
        $this->hasColumn(
            'relnamespace', 'blob', null, array(
            'type' => 'blob',
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'reltype', 'blob', null, array(
            'type' => 'blob',
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relowner', 'blob', null, array(
            'type' => 'blob',
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relam', 'blob', null, array(
            'type' => 'blob',
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relfilenode', 'blob', null, array(
            'type' => 'blob',
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'reltablespace', 'blob', null, array(
            'type' => 'blob',
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relpages', 'integer', 4, array(
            'type' => 'integer',
            'length' => 4,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'reltuples', 'float', null, array(
            'type' => 'float',
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'reltoastrelid', 'blob', null, array(
            'type' => 'blob',
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'reltoastidxid', 'blob', null, array(
            'type' => 'blob',
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relhasindex', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relisshared', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relkind', 'string', null, array(
            'type' => 'string',
            'fixed' => true,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relnatts', 'integer', 2, array(
            'type' => 'integer',
            'length' => 2,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relchecks', 'integer', 2, array(
            'type' => 'integer',
            'length' => 2,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'reltriggers', 'integer', 2, array(
            'type' => 'integer',
            'length' => 2,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relukeys', 'integer', 2, array(
            'type' => 'integer',
            'length' => 2,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relfkeys', 'integer', 2, array(
            'type' => 'integer',
            'length' => 2,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relrefs', 'integer', 2, array(
            'type' => 'integer',
            'length' => 2,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relhasoids', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relhaspkey', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relhasrules', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relhassubclass', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relfrozenxid', 'integer', 4, array(
            'type' => 'integer',
            'length' => 4,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'relacl', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'notnull' => false,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'reloptions', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'notnull' => false,
            'primary' => false,
            )
        );
    }

}
