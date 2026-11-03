<?php

abstract class BaseTempContrato extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_importar.temp_contrato');
        $this->hasColumn(
            'idcontrato', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_importar.sec_contrato')
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nocontrato', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'nocontratoproveedor', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'codigoreeup', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'nombrecliente', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipocontrato','character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'sector', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'marco', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechafirma', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'vigencia', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'area', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ciresponsablearea', 'character varying', 19,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'objeto', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'cup', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'cuc', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'usd', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'euro', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'montototal', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'mediopago', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'condicionpago', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'tiempo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idclienteproveedor', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtipocontrato', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idpersona', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmediopago', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcondicionpago', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcontratocrm', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestado', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}


