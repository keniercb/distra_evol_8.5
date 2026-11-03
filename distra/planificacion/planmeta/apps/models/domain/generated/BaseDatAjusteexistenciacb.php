<?php

abstract class BaseDatAjusteexistenciacb extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_ajusteexistenciacb');
        $this->hasColumn(
            'idajusteexistenciacb', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_ajusteexistenciacb')
        );
        $this->hasColumn(
            'identidadmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'demanda', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'necesidad', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'ajustenivelactividadneg', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'ajustenivelactividadpos', 'numeric', null,
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
            'reservaministerial', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'idaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'importedemanda', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'fechaajuste', 'date', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatEntidadmodelo',
            array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasOne(
            'NomAprobacion',
            array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->hasMany(
            'DatDesgviaadquisorgsat', array('local'   => 'idajusteexistenciacb',
                                            'foreign' => 'idajusteexistenciacb')
        );
        $this->hasOne(
            'DatModelo', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasOne(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasOne(
            'NomIndicador',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
    }

}


