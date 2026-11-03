<?php

abstract class BaseDatAnteproyectonaeobjetogasto extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_anteproyectonaeobjetogasto');
        $this->hasColumn(
            'ejecucionanterior', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'estimadoactual', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idanteproyectonae', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idanteproyectonaeobjetogasto', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_anteproyectonaeobjetogasto')
        );
        $this->hasColumn(
            'idobjetogasto', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'idusuario', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'planificacion', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
        $this->hasColumn(
            'presupuestoactual', 'numeric', null,
            array('notnull' => true, 'primary' => false)
        );
    }

    public function Setup()
    {
        parent::setUp();
        $this->hasOne(
            'DatAnteproyectonae', array('local'   => 'idanteproyectonae',
                                        'foreign' => 'idanteproyectonae')
        );
    }

}


