<?php

class DatEstructuraNomenclador extends BaseDatEstructuraNomenclador
{

    public function setUp()
    {
        parent:: setUp();
    }

    public function getByid($idnomenclador)
    {
        return Doctrine::getTable('DatEstructuraNomenclador')->find(
            $idnomenclador
        )->toArray();
    }

    static public function ExisteRelacionEstructuraNomenclador(
        $idestructura, $idnomenclador
    ) 
    {
        $query = Doctrine_Query::create();
        $result = $query->select('un.*')
            ->from('DatEstructuraNomenclador un')
            ->where(
                "un.idestructura = $idestructura 
                AND un.idnomenclador = $idnomenclador"
            )
            ->execute();
        return $result->toArray();
    }


}

