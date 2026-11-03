<?php

class DatDatosclasificadorindicador extends BaseDatDatosclasificadorindicador
{

    public function setUp()
    {
        parent::setUp();
    }

    public function listar()
    {
        $query = Doctrine_Query::create();
        $data = $query->from('DatDatosclasificadorindicador dc')
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $data;
    }

    public function eliminar($aux)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatDatosclasificadorindicador dc')
            ->whereIn('dc.idindicador', $aux)->execute();
    }

    public function eliminarDadoIdInd($idind, $iddatos)
    {
        $query = Doctrine_Query::create();
        $query->delete()
            ->from('DatDatosclasificadorindicador dc')
            ->whereIn('dc.idindicador', $idind)
            ->whereIn('dc.iddatosclasificador', $iddatos)->execute();
    }

}
