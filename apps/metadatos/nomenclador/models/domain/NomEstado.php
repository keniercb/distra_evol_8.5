<?php

/**
 * Class NomEstado
 */
class NomEstado extends BaseNomEstado
{
    /**
     *
     */
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatEstructuraop', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasMany('DatCargo', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasMany('DatEstructura', array('local' => 'idestado', 'foreign' => 'idestado'));
        $this->hasMany('DatMedio', array('local' => 'idestado', 'foreign' => 'idestado'));
    }

    /**
     * @param $idEstado
     *
     * @return mixed
     */
    public static function dameColor($idEstado)
    {
        $object = Doctrine::getTable('NomEstado')->find($idEstado);

        return $object->color;
    }
}