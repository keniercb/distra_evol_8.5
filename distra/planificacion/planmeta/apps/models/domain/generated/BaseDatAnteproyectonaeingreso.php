<?php

abstract class BaseDatAnteproyectonaeingreso extends Doctrine_Record
{

    public function setTableDefinition()
    {
        $this->setTableName('dat_anteproyectonaeingreso');
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
            'idanteproyectonaeingreso', 'numeric', null,
            array('notnull'  => true, 'primary' => true,
                  'sequence' => 'mod_planificacion.sec_anteproyectonaeingreso')
        );
        $this->hasColumn(
            'idingreso', 'numeric', null,
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


