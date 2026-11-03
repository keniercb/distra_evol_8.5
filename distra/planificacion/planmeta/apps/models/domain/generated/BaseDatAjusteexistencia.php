<?php

abstract class BaseDatAjusteexistencia extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_ajusteexistencia');
        $this->hasColumn(
            'ajustenivelactividadneg', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ajustenivelactividadpos', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidadcontratado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidadeninventario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'coberturatotalestimada', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cteoriginal', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idajusteexistencia', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_ajusteexistencia')
        );
        $this->hasColumn(
            'idaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'mercanciaentransito', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'necesidadannoactual', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidadeconomia', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'reservaministerial', 'numeric', null,
            array('notnull' => true, 'primary' => false, 'default' => 0)
        );
        $this->hasColumn(
            'generadoconmat', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'NomIndicador',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->hasOne(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->hasOne(
            'NomAprobacion',
            array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->HasMany(
            'DatAjusteexistenciacb', array('local'   => 'idajusteexistencia',
                                           'foreign' => 'idajusteexistencia')
        );
        $this->HasMany(
            'DatAjusteexistenciaod', array('local'   => 'idajusteexistencia',
                                           'foreign' => 'idajusteexistencia')
        );
        $this->HasMany(
            'DatDesgviaadquisorgsat', array('local'   => 'idajusteexistencia',
                                            'foreign' => 'idajusteexistencia')
        );
    }

}


