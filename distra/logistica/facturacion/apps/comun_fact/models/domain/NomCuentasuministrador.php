<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 8:57
 */
class NomCuentasuministrador extends BaseNomCuentasuministrador
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatCuentasuministradorEntidad',
            array('local'   => 'idcuentasuministrador',
                'foreign' => 'idcuentasuministrador')
        );
        $this->hasOne(
            'NomMoneda',
            array('local'   => 'idmoneda',
                'foreign' => 'idmoneda')
        );

    }
}
