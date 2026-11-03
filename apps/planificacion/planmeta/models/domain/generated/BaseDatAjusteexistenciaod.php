<?php

abstract class BaseDatAjusteexistenciaod extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_ajusteexistenciaod');
        $this->hasColumn(
            'idajusteexistenciaod', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_ajusteexistenciaod')
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
            'idaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'necesidad', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
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
        $this->hasOne(
            'DatOdcte',
            array('local' => 'identidadmodelo', 'foreign' => 'identidadmodelo')
        );
        $this->hasOne(
            'DatOdcte', array('local' => 'idmodelo', 'foreign' => 'idmodelo')
        );
        $this->hasOne(
            'DatOdcte',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasOne(
            'DatOdcte', array('local' => 'identidad', 'foreign' => 'identidad')
        );
        $this->hasOne(
            'DatOdcte',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

}


