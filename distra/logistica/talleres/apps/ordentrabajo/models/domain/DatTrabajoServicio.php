<?php

/**
 * @autor:Daniel Arias Espinosa
 */
class DatTrabajoServicio extends BaseDatTrabajoServicio
{

    public function setUp()
    {
        $this->hasMany('DatOrdenTrabajo', array('local' => 'idordentrabajo', 'foreign' => 'idordentrabajo'));		
		$this->hasMany('ConfActividad', array('local' => 'idservicio', 'foreign' => 'idactividad'));
    }
}
