<?php

abstract class BaseNomIndicadormedicamento extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_indicadormedicamento');
        $this->hasColumn('idindicador', 'numeric', null,array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'primary' => true));
        //$this->hasColumn('idindicador', 'numeric', null,array('notnull'  => true, 'primary' => true));
        $this->hasColumn('idforma', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('composicion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idumcomposicion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idpresentacion', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('unidadpresent', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('dosisunitaria', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('temperatura', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('pesoenvase', 'numeric', null, array('notnull' => false, 'primary' => false));
        $this->hasColumn('idumpeso', 'numeric', null, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
