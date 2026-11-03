<?php

class DatGrupoDesviacion extends BaseDatGrupoDesviacion
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($iddesviacion)
    {
        return Doctrine::getTable('DatGrupoDesviacion')->find($iddesviacion)
            ->toArray();
    }

    public function EliminarGrupoDesviacion($iddesviacion)
    {
        $query = new Doctrine_Query();
        $result = $query->delete('DatGrupoDesviacion')
            ->where("iddesviacion = ?", $iddesviacion)
            ->execute();
        return $result;
    }


}

