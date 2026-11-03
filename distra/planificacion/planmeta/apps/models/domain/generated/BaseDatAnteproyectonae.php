<?php

abstract class BaseDatAnteproyectonae extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_anteproyectonae');
        $this->hasColumn(
            'idanteproyecto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idanteproyectonae', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_anteproyectonae')
        );
        $this->hasColumn(
            'idnae', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->HasMany(
            'DatAnteproyectonaeobjetogasto',
            array('local'   => 'idanteproyectonae',
                  'foreign' => 'idanteproyectonae')
        );
        $this->HasMany(
            'DatAnteproyectonaeingreso', array('local'   => 'idanteproyectonae',
                                               'foreign' => 'idanteproyectonae')
        );
        $this->hasOne(
            'DatAnteproyecto',
            array('local' => 'idanteproyecto', 'foreign' => 'idanteproyecto')
        );
    }

}


