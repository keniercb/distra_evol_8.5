<?php

abstract class BaseNomTipoMaterialConstruccion extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_logpatrimonio.dat_materialestipoconstruccion');
        $this->hasColumn(
            'idtipoconstruccion', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true)
        );
        $this->hasColumn(
            'idmaterialesconstruccion', 'numeric', null,
            array('type' => 'numeric', 'fixed' => false, 'unsigned' => false, 'primary' => true)
        );
     
    }

    public function setUp()
    {
        parent::setUp();
    }
}