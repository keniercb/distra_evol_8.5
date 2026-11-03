<?php

/**
 * Created by PhpStorm.
 * User: W-01223
 * Date: 13/02/15
 * Time: 15:36
 */
class NomMarcaarmamentoModel extends NomencladoresModel
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function existedenominacion($obj)
    {
        $filtro = '';
        $filtroElemento = '';
        if ($obj['denominacion']) {
            $arrFiltro [] = "denominacion = '{$obj['denominacion']}'";
        }
        if ($obj['idelemento']) {
            $arrFiltroElemento [] = "idelemento = '{$obj['idelemento']}'";
        }
        $query = new Doctrine_Query();
        if ($obj['denominacion']) {
            $filtro = implode(' AND ', $arrFiltro);
            $query->addWhere($filtro);
        }
        if ($obj['idelemento']) {
            $filtroElemento = implode(' AND ', $arrFiltroElemento);
            $query->addWhere($filtroElemento);
        }
        return $query->from($obj['modelo'])->count();
    }

    public function buscar($obj, $arrIdsInsertados, $returnobj = true)
    {
        $arr = parent::buscar($obj, $arrIdsInsertados, $returnobj);
        $query = $arr['query'];
        if ($obj['idelemento']) {
            if (!is_numeric($obj['idelemento'])) {
                $idindice = Doctrine_Query::create()->select("elem.idelemento")
                    ->from('NomElemento elem')
                    ->where('elem.codigo = ?', $obj['idelemento'])
                    ->fetchArray();
                $obj['idelemento'] = $idindice[0]['idelemento'];
            }
            if($obj['idelemento'])
            $query->addWhere("{$arr['alias']}.idelemento = {$obj['idelemento']}");
        } else {
            $query->addWhere("{$arr['alias']}.idelemento = 0");
        }
        $cantidad = $query->count();
        if (isset($obj['start']) || isset($obj['limit'])) {
            $query->offset(isset($obj['start']) ? $obj['start'] : 0)->limit(isset($obj['limit']) ? $obj['limit'] : 30);
        }
        $res = $query->fetchArray();
        return array('cantidad' => $cantidad, 'datos' => $res);
    }

    public function buscarEntidad($obj, $devolvequery = true)
    {
        $arr = parent::buscarEntidad($obj, $devolvequery);
        $query = $arr['query'];
        if ($obj['idelemento']) {
            $idindice = Doctrine_Query::create()->select("elem.idelemento")
                ->from('NomElemento elem')
                ->where('elem.codigo = ?', $obj['idelemento'])
                ->fetchArray();
            $obj['idelemento'] = $idindice[0]['idelemento'];
            $query->addWhere("{$arr['alias']}.idelemento = {$obj['idelemento']}");
        } else {
            $query->addWhere("{$arr['alias']}.idelemento = 0");
        }
        return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
    }

}
