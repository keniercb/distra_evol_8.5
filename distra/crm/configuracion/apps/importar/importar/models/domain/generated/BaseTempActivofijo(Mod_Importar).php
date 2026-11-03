<?php

abstract class BaseTempActivofijoModImportar extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('mod_importar.temp_activofijo');
        $this->hasColumn(
            'idactivofijo', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                'sequence' => 'mod_importar.sec_activofijo')
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
            'tasa_depreciacion', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
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
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'valor_cup_inicial', 'character varying', 255,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'codigo', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'numserie', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );

        $this->hasColumn(
            'nummotor', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'circulacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'matricula', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'colorsecundario', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'colorprimario', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechainiexplotacion', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'fechaadquisicion', 'character varying', 255,
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
        $this->hasColumn(
            'estadotecnico', 'character varying', 255,
            array('notnull' => false, 'primary' => false)
        );

    }

    public function Setup()
    {
        parent::setUp();
    }

}


