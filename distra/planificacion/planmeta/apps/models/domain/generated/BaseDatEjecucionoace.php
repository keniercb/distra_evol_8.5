<?php

class BaseDatEjecucionoace extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_ejecucionoace');
        $this->hasColumn(
            'idejecucionoace', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_ejecucionoace')
        );
        $this->hasColumn(
            'identidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idejercicio', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'contratado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'preciocontrado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'ejecutado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'precioejecutado', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'tipo', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'mes', 'numeric', null, array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'NomEjercicioplanificacion',
            array('local' => 'idejercicio', 'foreign' => 'idejercicio')
        );
        $this->HasMany(
            'DatEntidaddatosnomenclador', array('local'   => 'identidad',
                                                'foreign' => 'identidaddatosnomenclador')
        );
    }

}

//fin clase 

