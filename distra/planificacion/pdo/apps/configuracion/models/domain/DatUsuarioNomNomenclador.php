<?php

/**
 * @author    Liermes Ferriol Mena
 * @author    Alberto Tamayo Ramos
 * @version   1.0.0
 * @copyright UCID, ERP-CUBA
 */
class DatUsuarioNomNomenclador extends BaseDatUsuarioNomNomenclador
{
    public function setUp()
    {
        parent::setUp();
    }

    static public function ExisteRelacionUsuarioNomenclador(
        $idusuario, $idnomenclador
    ) 
    {
        $query = Doctrine_Query::create();
        $result = $query->select('un.*')
            ->from('DatUsuarioNomNomenclador un')
            ->where(
                "un.idusuario = $idusuario AND un.idnomenclador = $idnomenclador"
            )
            ->execute();
        return $result->toArray();
    }

}//fin de la clase

