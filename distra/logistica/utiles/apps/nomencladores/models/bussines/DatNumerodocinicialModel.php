<?php

class DatNumerodocinicialModel extends NomencladoresModel
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarNomenclador($array)
    {
        if ($array['hiddenmodficar'] != 1) {
            $obj = new DatNumerodocinicial();
        } else {
            $res = Doctrine::getTable('DatNumerodocinicial')->findByDql(' idseriedocentidad = ? ',
                array($array['idseriedocentidad']));
            $obj = $res[0];
            if (!$obj->idseriedocentidad) {
                return false;
            }
        }
        $obj->synchronizeWithArray($array);
        $obj->save();
        return true;
    }

    public function existenroInicial($obj)
    {
        $filtro = '';
        if ($obj['nrodocumentoinicial']) {
            $arrFiltro [] = "nrodocumentoinicial = '{$obj['nrodocumentoinicial']}'";
        }
        $query = Doctrine_Query::create()->from($obj['modelo']);
        if ($obj['nrodocumentoinicial']) {
            $filtro = implode(' AND ', $arrFiltro);
            $query->addWhere($filtro);
        }
        return $query->count();
    }

}
