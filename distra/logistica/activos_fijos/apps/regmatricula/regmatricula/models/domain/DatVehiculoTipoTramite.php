<?php

/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 1/20/2016
 * Time: 3:49 PM
 */
class DatVehiculoTipoTramite extends BaseDatVehiculoTipoTramite
{

    public function setUp()
    {
        parent::setUp();
        $this->hasOne('DatRegVehiculo', array('local' => 'idregistrovehiculo', 'foreign' => 'idregistrovehiculo'));
    }

}
