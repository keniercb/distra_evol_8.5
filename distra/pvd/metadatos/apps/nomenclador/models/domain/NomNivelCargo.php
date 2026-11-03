<?php

class NomNivelCargo extends BaseNomNivelCargo
{
    public function setUp()
    {
        parent::setUp();
    }

    public static function dameTodosVisibles()
    {
        $query = new Doctrine_Query();
        $result = $query->from('NomNivelCargo')->where("visible = 1")->orderBy("denominacion")->setHydrationMode(Doctrine :: HYDRATE_ARRAY)
            ->execute();

        return $result;
    }
}