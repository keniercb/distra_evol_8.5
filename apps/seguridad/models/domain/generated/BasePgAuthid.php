<?php

abstract class BasePgAuthid extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('pg_authid');
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
            'rolname', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'rolsuper', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'rolinherit', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'rolcreaterole', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'rolcreatedb', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'rolcatupdate', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'rolcanlogin', 'boolean', 1, array(
            'type' => 'boolean',
            'length' => 1,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'rolconnlimit', 'integer', 4, array(
            'type' => 'integer',
            'length' => 4,
            'unsigned' => false,
            'notnull' => true,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'rolpassword', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'notnull' => false,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'rolvaliduntil', 'timestamp', null, array(
            'type' => 'timestamp',
            'notnull' => false,
            'primary' => false,
            )
        );
        $this->hasColumn(
            'rolconfig', 'string', null, array(
            'type' => 'string',
            'fixed' => false,
            'notnull' => false,
            'primary' => false,
            )
        );
    }

}
