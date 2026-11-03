<?php

abstract class BaseConfModelosContabilizacion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.conf_modeloscontabilizacion');
        $this->hasColumn(
            'idconfmodelo', 'numeric', 19,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_datosmaestros.sec_confmodeloscontabilizacion')
        );
        $this->hasColumn('codigo', 'varchar', 30, array('notnull' => true));
        $this->hasColumn('nombre', 'varchar', 255, array('notnull' => false));
        $this->hasColumn('descripcion', 'varchar', 255, array('notnull' => false));
        $this->hasColumn('estado', 'boolean', null, array('notnull' => true));
        $this->hasColumn('idsubsistema', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('idplantilla', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('configuracion', null, null, array('notnull' => true));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
