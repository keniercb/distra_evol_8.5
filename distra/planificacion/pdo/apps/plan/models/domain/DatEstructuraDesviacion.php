<?php

class DatEstructuraDesviacion extends BaseDatEstructuraDesviacion
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($iddesviacion)
    {
        return Doctrine::getTable('DatEstructuraDesviacion')->find(
            $iddesviacion
        )->toArray();
    }

    public function EliminarEstructuraDesviacion($iddesviacion)
    {
        $query = new Doctrine_Query();
        $result = $query->delete('DatEstructuraDesviacion')
            ->where("iddesviacion = ?", $iddesviacion)
            ->execute();
        return $result;
    }

}

