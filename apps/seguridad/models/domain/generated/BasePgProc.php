<?php

abstract class BasePgProc extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('pg_proc');
        $this->hasColumn(
            'oid', 
            'integer', 
            null, 
            array(
                'type' => 'integer', 
                'length' => 4,
                'unsigned' => false,
                'notnull' => true, 
                'primary' => true,
            )
        );
        $this->hasColumn(
            'proname', 
            'string',
            null,
            array('fixed' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'pronamespace',
            'blob',
            null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'proowner',
            'blob', 
            null, 
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'prolang',
            'blob',
            null, 
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'procost',
            'float', 
            null, 
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'prorows',
            'float',
            null, 
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'proisagg', 
            'boolean',
            1, 
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'prosecdef',
            'boolean',
            1, 
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'proisstrict', 
            'boolean',
            1, 
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'proretset',
            'boolean',
            1, 
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'provolatile',
            'string',
            null,
            array('fixed' => true, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'pronargs',
            'integer',
            2, 
            array('unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'prorettype', 
            'blob', 
            null, 
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'proargtypes', 
            'string',
            null,
            array('fixed' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'proallargtypes', 
            'blob', 
            null, 
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'proargmodes', 
            'string',
            null, 
            array('fixed' => true, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'proargnames',
            'string',
            null, 
            array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'prosrc',
            'string', 
            null, 
            array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'probin',
            'blob',
            null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'proconfig',
            'string',
            null,
            array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'proacl', 
            'string', 
            null, 
            array('fixed' => false, 'notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
