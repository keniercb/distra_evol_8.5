<?php

class DatOdcte extends BaseDatOdcte
{

    public function setUp()
    {
        parent::setUp();
    }

    public function obtenerObjODCTE($parametros)
    {

        $query = Doctrine_Query::create();
        $res = $query
            ->from('DatOdcte odcte')
            ->where(
                ' odcte.identidad=? AND odcte.idmodelo=? 
                    AND odcte.identidadmodelo=? AND odcte.idejercicio=? 
                    AND odcte.idindicador=? ',
                array($parametros['identidad'], $parametros['idmodelo'],
                      $parametros['identidadmodelo'],
                      $parametros['idejercicio'], $parametros['idindicador'])
            )
            ->execute()->getFirst();


        return $res;
    }

    public function deleteInd($idindicadores)
    {
        $query = new Doctrine_Query();
        return $query->delete()
            ->from('DatOdcte')
            ->where('idindicador', $idindicadores)
            ->execute();
    }

}