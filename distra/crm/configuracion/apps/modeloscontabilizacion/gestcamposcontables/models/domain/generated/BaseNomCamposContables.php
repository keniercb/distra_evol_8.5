<?php

abstract class BaseNomCamposContables extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_campocontable');
        $this->hasColumn('idcampo', 'numeric', 19, array('notnull' => true, 'primary' => true, 
            'sequence' => 'mod_datosmaestros.sec_nomcamposactuales'));
        $this->hasColumn('nombre', 'varchar', 255, array('notnull' => true));
        $this->hasColumn('idclasificador', 'numeric', 19, array('notnull' => false));
        $this->hasColumn('tipo', 'numeric', 1, array('notnull' => true));
        $this->hasColumn('referencia', 'varchar', 255, array('notnull' => true));
        $this->hasColumn('idsubsistema', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('ruta', 'varchar', 255, array('notnull' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
