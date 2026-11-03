<?php

abstract class BaseTempCobropagoanticipado extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_importar.temp_cobroanticipado');
        $this->hasColumn(
            'idcobroanticipado', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_importar.sec_cobroanticipado')
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'numclienteproveedor', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'clienteproveedor', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cuentacontable', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipoobligacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipodeudoracreedor','character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'numdocumento', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'condicionpago', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechaemision', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'importependiente', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'comentario', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idclienteproveedor', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idclienteproveedorentidad', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idcuenta', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idtasa', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idmoneda', 'character varying', 19,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}


