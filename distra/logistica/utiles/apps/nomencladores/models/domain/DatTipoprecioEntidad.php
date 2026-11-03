<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 9:10
 */
class DatTipoprecioEntidad extends BaseDatTipoprecioentidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomTipoprecio',
            array('local'   => 'idtipoprecio',
                  'foreign' => 'idtipoprecio')
        );
    }
}