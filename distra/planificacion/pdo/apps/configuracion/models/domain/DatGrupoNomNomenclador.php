<?php

/**
 * @author    Liermes Ferriol Mena
 * @author    Alberto Tamayo Ramos
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatGrupoNomNomenclador extends BaseDatGrupoNomNomenclador
{
    public function setUp()
    {
        parent::setUp();
    }

    static public function ExisteRelacionGrupoNomenclador(
        $idgrupo, $idnomenclador
    ) 
    {
        $query = Doctrine_Query::create();
        $result = $query->select('gn.*')
            ->from('DatGrupoNomNomenclador gn')
            ->where(
                "gn.idgrupo = $idgrupo AND gn.idnomenclador = $idnomenclador"
            )
            ->execute();
        return $result->toArray();
    }

    public function ObtenerArrayIdNomencladorPorArrayIdGruposYTipo(
        $arrayidgrupos, $tiponom
    ) 
    {
        $query = Doctrine_Query::create();
        $result = $query->select('gn.idnomenclador*')
            ->from('DatGrupoNomNomenclador gn')
            ->innerjoin('gn.NomNomenclador n')
            ->where("n.tiponomenclador = $tiponom ")
            ->whereIn("gn.idgrupo ", $arrayidgrupos)
            ->execute();
        return $result->toArray();
    }
}//fin de la clase