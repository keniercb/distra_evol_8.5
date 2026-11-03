<?php

class BaseDatEjecucionoaceindicador extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_ejecucionoaceindicador');
        $this->hasColumn(
            'idejecucionoaceindicador', 'numeric', null,
            array('notnull' => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_ejecucionoaceindicador')
        );
        $this->hasColumn(
            'idejecucionoace', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idindicador', 'numeric', null,
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
        $this->HasMany(
            'NomIndicador',
            array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
    }

}


