<?php

/**
 *
 */
class CfgActividadPlanificacion extends BaseCfgActividadPlanificacion
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'CfgPlanificacionMantenimiento',
            array('local' => 'idplanificacionmantenimiento', 'foreign' => 'idplanificacionmantenimiento')
        );
        $this->hasMany(
            'CfgActividadSistemaMedio',
            array('local' => 'idconfactividadsistemamedio', 'foreign' => 'idconfactividadsistemamedio')
        );
    }

}
