<?php

class NomSector extends BaseNomSector
{
    public function setUp()
    {
        parent::setUp();
        $this->hasMany('DatEstructura', array('local' => 'idsector', 'foreign' => 'idsector'));
        $this->hasMany('DatCargo', array('local' => 'idsector', 'foreign' => 'idsector'));
    }

    public static function dameTodosVisibles()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomSector')->where("visible = 1")->orderBy("denominacion")->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();

        return $result;
    }
}