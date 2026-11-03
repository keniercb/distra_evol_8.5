<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 8:57
 */
class NomCilindro extends BaseNomCilindro
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatCilindroEntidad',
            array('local'   => 'idnomcilindro',
                'foreign' => 'idnomcilindro')
        );
        $this->hasOne(
            'NomUnidadmedida',
            array('local'   => 'idumedida',
                'foreign' => 'idunidadmedida')
        );

    }
}
