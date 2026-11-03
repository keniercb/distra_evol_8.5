<?php

abstract class BaseTempUtiles extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_migracion_aft.apertura_importar_utiles');
        $this->hasColumn(
            'id', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_migracion_aft.sec_importar_utiles')
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
            'idempleado', 'character varying', 255,
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
            'codigoproveedor', 'character varying', 255,
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
            'migrado', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );


    }

    public function Setup()
    {
        parent::setUp();
    }

}


