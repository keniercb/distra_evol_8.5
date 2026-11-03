<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 4/20/2015
 * Time: 1:56 PM
 */
abstract class BaseDatInspectorMatricula extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logactivofijotangible.dat_inspectormatricula');

        $this->hasColumn('idinspectormatricula', 'numeric', null,
            array('notnull' => true, 'primary' => true,
            'sequence' => 'sec_datinspectormatricula')
        );

        $this->hasColumn('nombre', 'character varying', null, array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'descripcion', 'character varying', null, array('notnull' => false, 'primary' => false)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
