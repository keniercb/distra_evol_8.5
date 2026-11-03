<?php

class BaseDatPuntualdemanda extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_puntualdemanda');
        $this->hasColumn(
            'idpuntualdemanda', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_puntualdemanda')
        );
        $this->hasColumn(
            'idejecucionoace', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'importe', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'cantidad', 'numeric', null,
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
    }

}

//fin clase 


