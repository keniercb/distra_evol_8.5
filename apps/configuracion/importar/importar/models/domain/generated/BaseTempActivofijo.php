<?php

abstract class BaseTempActivofijo extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_migracion_aft.apertura_importar_activos');
        $this->hasColumn(
            'id', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_migracion_aft.sec_importar_activos')
        );
        $this->hasColumn(
            'id_centrocosto', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'area', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idestructuracomun_distra', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'iddatosnomenclador', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'desc_activofijo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'id_rotulo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'responsable', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'tasa_depreciacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'dep_cuc_acumulada', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'dep_cup_acumulada', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valor_cuc_inicial', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valor_cup_inicial', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'codigoproveedor', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'numero_serie', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'nromotor', 'character varying', 50,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'circulacion', 'character varying', 50,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'matricula', 'character varying', 50,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'color1', 'character varying', 50,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'color2', 'character varying', 50,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'estadotecnico', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fecha_alta', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'migrado', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainiexplotacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valorcontablealternativo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'valorcontable', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'clasificacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );


    }

    public function Setup()
    {
        parent::setUp();
    }

}


