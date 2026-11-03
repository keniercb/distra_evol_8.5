<?php

abstract class BaseDatAjustedemanda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_ajustedemanda');
        $this->hasColumn(
            'ajustepornivelactividad', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'ajustepornivelactividadneg', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'cantidadeconomia', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'coberturaparcialestimada', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'demanda', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'fechaajuste', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idajustedemanda', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_ajustedemanda')
        );
        $this->hasColumn(
            'idaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 1)
        );
        $this->hasColumn(
            'identidaddatosnomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidadmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'importedemanda', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'necesidad', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'reservaministerial', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
    }

    public function Setup()
    {
        parent::setUp();
    }

}


