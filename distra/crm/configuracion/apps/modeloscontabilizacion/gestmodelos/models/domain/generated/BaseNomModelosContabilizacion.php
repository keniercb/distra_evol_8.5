<?php

abstract class BaseNomModelosContabilizacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_modeloscontabilizacion');
        $this->hasColumn(
            'idmodelo', 'numeric', 19,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_datosmaestros.sec_nommodeloscontabilizacion')
        );
        $this->hasColumn('codigo', 'varchar', 30, array('notnull' => true));
        $this->hasColumn('nombre', 'varchar', 255, array('notnull' => false));
        $this->hasColumn(
            'descripcion', 'varchar', 255, array('notnull' => false)
        );
        $this->hasColumn('estado', 'boolean', null, array('notnull' => true));
        $this->hasColumn(
            'idsubsistema', 'numeric', 19, array('notnull' => true)
        );
        $this->hasColumn(
            'idestructuracomun', 'numeric', 19, array('notnull' => true)
        );
    }

    public function setUp()
    {
        parent::setUp();
    }

}
