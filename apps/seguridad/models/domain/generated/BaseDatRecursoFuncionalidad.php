<?php
/**
 * Created by PhpStorm.
 * User: lily
 * Date: 3/9/16
 * Time: 2:48 p.m.
 */

abstract class BaseDatRecursoFuncionalidad extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_seguridad.dat_recursofuncionalidad');
        $this->hasColumn(
            'idrecurso',
            'decimal',
            null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'idfuncionalidad',
            'decimal',
            null,
            array('notnull' => true, 'primary' => true)
        );
        $this->hasColumn(
            'externo', 'boolean', 1, array(
                'ntype' => 'bool',
                'alltypes' =>
                    array(
                        0 => 'boolean',
                    ),
                'notnull' => true,
                'default' => 'TRUE',
                'primary' => false,
            )
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}