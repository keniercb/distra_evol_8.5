<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 9:10
 */
class DatCilindroEntidad extends BaseDatCilindroEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomCilindro',
            array('local'   => 'idnomcilindro',
                  'foreign' => 'idnomcilindro')
        );
    }
}
