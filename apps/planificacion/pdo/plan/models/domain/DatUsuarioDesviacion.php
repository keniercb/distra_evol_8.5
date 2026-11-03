<?php

class DatUsuarioDesviacion extends BaseDatUsuarioDesviacion
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($iddesviacion)
    {
        return Doctrine::getTable('DatUsuarioDesviacion')->find($iddesviacion)
            ->toArray();
    }

    public function EliminarUsuarioDesviacion($iddesviacion)
    {
        $query = new Doctrine_Query();
        $result = $query->delete('DatUsuarioDesviacion')
            ->where("iddesviacion = ?", $iddesviacion)
            ->execute();
        return $result;
    }


}

