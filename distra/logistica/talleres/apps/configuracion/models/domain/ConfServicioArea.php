<?php

/**
 * @autor:Daniel Arias Espinosa
 */
class ConfServicioArea extends BaseConfServicioArea
{

    public function setUp()
    {
        $this->hasOne('ConfActividad', array('local' => 'idservicio', 'foreign' => 'idactividad'));
    }
}
