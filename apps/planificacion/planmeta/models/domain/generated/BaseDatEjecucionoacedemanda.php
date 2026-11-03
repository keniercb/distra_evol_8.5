<?php

class BaseDatEjecucionoacedemanda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_ejecucionoacedemanda');
        $this->hasColumn(
            'idejecucionoacedemanda', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_ejecucionoacedemanda')
        );
        $this->hasColumn(
            'idejecucionoace', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idajusteexistenciacb', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatEjecucionoace',
            array('local' => 'idejecucionoace', 'foreign' => 'idejecucionoace')
        );
        $this->HasMany(
            'DatAjusteexistenciacb', array('local'   => 'idajusteexistenciacb',
                                           'foreign' => 'idajusteexistenciacb')
        );
    }

}

