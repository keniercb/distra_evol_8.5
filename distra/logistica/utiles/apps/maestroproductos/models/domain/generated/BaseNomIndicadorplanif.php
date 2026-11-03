<?php

abstract class BaseNomIndicadorplanif extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_datosmaestros.nom_indicadorplanif');
        $this->hasColumn(
            'idindicador', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'primary' => true)
        );
        $this->hasColumn(
            'nivelplanif', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        /*$this->hasColumn(
            'precioplanif', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );*/
        $this->hasColumn(
            'precio', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idaprobacion', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'flete', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'contingencia', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cobertura', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'precioventa', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'balanceable', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'margencomercial', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'preciodivisa', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
       /* $this->hasColumn(
            'precioplanif', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idviaadquisicion', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idorganosatisface', 'decimal', null,
            array('type' => 'decimal', 'fixed' => false, 'unsigned' => false, 'notnull' => true, 'primary' => false)
        );*/
    }

    public function setUp()
    {
        parent::setUp();
    }

}
