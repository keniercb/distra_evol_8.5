<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 8:57
 */
class NomTipoprecio extends BaseNomTipoprecio
{
    public function setUp()
    {
        parent::setUp();
        $this->hasOne(
            'DatTipoprecioEntidad', array('local'   => 'idtipoprecio',
                                          'foreign' => 'idcategoriaprecio')
        );

    }
}