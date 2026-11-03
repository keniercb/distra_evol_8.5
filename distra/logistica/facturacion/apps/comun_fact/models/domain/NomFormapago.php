<?php


class NomFormapago extends BaseNomFormapago
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany(
            'DatFormapagoEntidad',
            array('local'   => 'idnomformapago',
                'foreign' => 'idnomformapago')
        );

    }
}
