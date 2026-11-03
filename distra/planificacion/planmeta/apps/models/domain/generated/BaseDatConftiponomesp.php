<?php

abstract class BaseDatConftiponomesp extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_conftiponomesp');

        $this->hasColumn(
            'idconftiponomesp', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_conftiponomesp')
        );
        $this->hasColumn(
            'idtiponomenclador', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idespecialidad', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'NomTiponomenclador', array('local'   => 'idtiponomenclador',
                                        'foreign' => 'idtiponomenclador')
        );
        $this->hasMany(
            'NomTipobalance', array('local'   => 'idconftiponomesp',
                                    'foreign' => 'idconftiponomesp')
        );
        $this->hasMany(
            'NomBalance', array('local'   => 'idconftiponomesp',
                                'foreign' => 'idconftiponomesp')
        );
    }

}

//fin clase

