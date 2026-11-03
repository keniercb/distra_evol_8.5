<?php

/**
 *
 */
class CfgActividadSistemaMedio extends BaseCfgActividadSistemaMedio
{

    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('NomSistemaMedio', array('local' => 'idnomsistemamedio', 'foreign' => 'idnomsistemamedio'));
        $this->hasMany(
            'CfgActividadPlanificacion',
            array('local' => 'idconfactividadsistemamedio',
            'foreign' => 'idconfactividadsistemamedio')
        );
    }

}
