<?php

abstract class BaseDatAnteproyecto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_anteproyecto');
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'fecha', 'date', null, array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idanteproyecto', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_anteproyecto')
        );
        $this->hasColumn(
            'idaprobacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idconceptoespecialidad', 'numeric', null,
            array('notnull' => false, 'primary' => false)
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idtipoanteproyecto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'numero', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'version', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'NomTipoanteproyecto', array('local'   => 'idtipoanteproyecto',
                                         'foreign' => 'idtipoanteproyecto')
        );
        $this->hasOne(
            'DatConceptoespecialidad',
            array('local'   => 'idconceptoespecialidad',
                  'foreign' => 'idconceptoespecialidad')
        );
        $this->hasOne(
            'NomAprobacion',
            array('local' => 'idaprobacion', 'foreign' => 'idaprobacion')
        );
        $this->HasMany(
            'DatAnteproyectonae',
            array('local' => 'idanteproyecto', 'foreign' => 'idanteproyecto')
        );
        $this->hasOne(
            'Ejercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
    }

}


