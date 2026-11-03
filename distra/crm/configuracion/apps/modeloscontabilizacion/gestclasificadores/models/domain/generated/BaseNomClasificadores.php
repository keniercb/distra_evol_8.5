<?php

abstract class BaseNomClasificadores extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_clasificador');
        $this->hasColumn('idclasificador', 'numeric', 19, array('notnull' => true, 'primary' => true, 
            'sequence' => 'mod_datosmaestros.sec_nomclasificadores'));
        $this->hasColumn('nombre', 'varchar', 255, array('notnull' => true));
        $this->hasColumn('descripcion', 'varchar', 255, array('notnull' => false));
        $this->hasColumn('ruta', 'varchar', 255, array('notnull' => true));
        $this->hasColumn('referenciaclase', 'varchar', 100, array('notnull' => true));
        $this->hasColumn('idsubsistema', 'numeric', 19, array('notnull' => true));
        $this->hasColumn('idestructuracomun', 'numeric', 19, array('notnull' => true));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
