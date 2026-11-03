<?php

abstract class BaseDatOdcte extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_odcte');
        $this->hasColumn(
            'ajustenivelactividadneg', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'ajustenivelactividadpos', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'cpe', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'demanda', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'demandahijos', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fechaajuste', 'date', null,
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
            'identidadmodelo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 1)
        );
        $this->hasColumn(
            'importedemanda', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'idodcte', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_odcte')
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatAjusteexistenciaod',
            array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasOne(
            'DatAjusteexistenciaod',
            array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasOne(
            'DatAjusteexistenciaod',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasOne(
            'DatAjusteexistenciaod',
            array('local' => 'identidad', 'foreign' => 'identidad')
        );
        $this->hasOne(
            'DatAjusteexistenciaod',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

}

