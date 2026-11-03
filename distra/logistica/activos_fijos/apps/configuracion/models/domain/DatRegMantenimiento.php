<?php

/**
 *  Daniel Arias Espinosa 06-07-16
 */
class DatRegMantenimiento extends BaseDatRegMantenimiento
{

    /**
     *
     */
    public function setUp()
    {
        parent:: setUp();
        $this->hasMany('DatRegnumericoActivo', array('local' => 'idregnumerico', 'foreign' => 'idregnumerico'));
        $this->hasMany(
            'CfgPlanificacionMantenimiento',
            array('local' => 'idplanificacionmantenimiento', 'foreign' => 'idplanificacionmantenimiento')
        );
        $this->hasMany(
            'DatRegnumerico',
            array('local' => 'idregnumerico', 'foreign' => 'idregnumerico')
        );
    }
}
