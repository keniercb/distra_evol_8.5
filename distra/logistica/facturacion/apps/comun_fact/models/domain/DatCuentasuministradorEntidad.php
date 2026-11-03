<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 9:10
 */
class DatCuentasuministradorEntidad extends BaseDatCuentasuministradorEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomCuentasuministrador',
            array('local'   => 'idcuentasuministrador',
                  'foreign' => 'idcuentasuministrador')
        );
    }
}
