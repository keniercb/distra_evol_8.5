<?php

/**
 *
 */
class CfgPlanificacionMantenimiento extends BaseCfgPlanificacionMantenimiento
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomIndicador', array('local' => 'idindicador', 'foreign' => 'idindicador'));
        $this->hasOne(
            'CfgActividadPlanificacion',
            array('local' => 'idplanificacionmantenimiento', 'foreign' => 'idplanificacionmantenimiento')
        );
    }

}
