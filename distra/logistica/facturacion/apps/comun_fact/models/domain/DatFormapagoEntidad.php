<?php

/**
 * Created by PhpStorm.
 * User: Tony
 * Date: 24/10/2014
 * Time: 9:10
 */
class DatFormapagoEntidad extends BaseDatFormapagoEntidad
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'NomFormapago',
            array('local'   => 'idnomformapago',
                  'foreign' => 'idnomformapago')
        );
    }
}
