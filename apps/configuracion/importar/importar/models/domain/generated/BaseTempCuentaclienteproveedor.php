<?php

abstract class BaseTempCuentaclienteproveedor extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_importar.temp_cuentaclienteproveedor');
        $this->hasColumn(
            'idcuentaclienteproveedor', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_importar.sec_cuentaclienteproveedor')
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'codigo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nocuenta', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'clasificacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'condicion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'plazo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idclienteproveedor', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcuenta', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmoneda', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}


