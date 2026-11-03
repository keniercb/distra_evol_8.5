<?php

abstract class BaseTempUtilesModImportar extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_importar.temp_utiles');
        $this->hasColumn(
            'idutiles', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_importar.sec_utiles')
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'denomindicador', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ciresponsable', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'id_centrocosto', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'area','character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valor_cuc', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valor_cup', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'codigo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'grupo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainiexplotacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estadotecnico', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'centro_costo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'id_area', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'descripcion_arearesponsabilidad', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun_distra', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'migrado', 'integer', null,
            array('notnull' => false, 'primary' => false)
        );


    }

    public function Setup()
    {
        parent::setUp();
    }

}


