<?php

abstract class BaseNomFactorconversion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_factorconversion');
        $this->hasColumn(
            'idfactorconversion', 'numeric', null,
            array('notnull' => true, 'primary' => true, 'sequence' => 'mod_datosmaestros.sec_nomfactorconversion')
        );
        $this->hasColumn('idindicador', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('idunidadmedida', 'numeric', null, array('notnull' => true, 'primary' => false));
        $this->hasColumn('factorconversion', 'numeric', 0, array('notnull' => false, 'primary' => false));
    }

    public function setUp()
    {
        parent::setUp();
    }

}
