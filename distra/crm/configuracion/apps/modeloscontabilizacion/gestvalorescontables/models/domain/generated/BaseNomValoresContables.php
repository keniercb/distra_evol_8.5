<?php

abstract class BaseNomValoresContables extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_valorcontable');
        $this->hasColumn(
            'idvalorcontable', 'numeric', 19,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_datosmaestros.sec_nomvalorescontables')
        );
        $this->hasColumn('nombre', 'varchar', 255, array('notnull' => true));
        $this->hasColumn(
            'idsubsistema', 'numeric', 19, array('notnull' => true)
        );
        $this->hasColumn('tipo', 'numeric', 1, array('notnull' => true));
        $this->hasColumn(
            'idestructuracomun', 'numeric', 19, array('notnull' => true)
        );
        $this->hasColumn(
            'sustitucion', 'boolean', null,
            array('notnull' => true, 'default' => false)
        );
        $this->hasColumn(
            'referencia', 'varchar', null, array('notnull' => true)
        );
        $this->hasColumn(
            'ruta', 'varchar', null, array('notnull' => true, 'default' => null)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
