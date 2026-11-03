<?php

abstract class BaseNomConfiguracionReporte extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_integracionreporte.nom_configuracionreporte');

        $this->hasColumn(
            'idconfiguracion', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_integracionreporte.sec_configuracionreporte')
        );
        $this->hasColumn(
            'urlservidor', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'usuario', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'apikey', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denconfiguracion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idsso', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'autenticarapikey', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'usuariors', 'character varying', 100,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'contrasenna', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}

//fin clase