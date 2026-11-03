<?php

class NomTipoubicModel extends NomencladoresModel
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarNomenclador($array)
    {
        $array['peso'] = ($array['peso']) ? '1' : '0';
        $array['volumen'] = ($array['volumen']) ? '1' : '0';
        $array['capacidad'] = ($array['capacidad']) ? '1' : '0';
        $array['um'] = ($array['unidadmedida']) ? '1' : '0';
        $array['producto'] = ($array['producto']) ? '1' : '0';

        $obj = parent::insertarNomenclador($array, true);
        if (!is_object($obj)) {
            return $obj;
        }
        unset($array['idtipoubicacion']);
        $obj->NomCampostipoubicacion->synchronizeWithArray($array);
        $obj->save();
        return true;
    }

    public function buscar($obj)
    {
        $arr = parent::buscar($obj, array(), true);
        $query = $arr['query'];
        $query->addSelect(
            'ncu.capacidad as capacidad,
             ncu.um as um,
             ncu.producto as producto,
             ncu.volumen as volumen,
             ncu.peso as peso'
        );

        $clasEntidad = 'Dat' . substr($obj['modelo'], 3) . 'Entidad';


        if (class_exists($clasEntidad)) {

            $query->addSelect("e.idtipoubicentidad as idtipoubicentidad");
            // $query->addWhere("e.idtipoubicacion =  ncu.idtipoubicacion");
        }

        $res = $query->leftJoin("{$arr['alias']}.NomCampostipoubicacion ncu")
            ->limit(($obj['limit']) ? $obj['limit'] : 30)
            ->offset(($obj['start']) ? $obj['start'] : 0)
            ->orderBy("{$obj['idnom']} DESC")->fetchArray();
        $resultado = array('cantidad' => $arr['cant'], 'datos' => $res);
        //print_r($resultado);die;
        return $resultado;
    }

    public function modificarNomenclador($array)
    {
        $array['peso'] = ($array['peso']) ? '1' : '0';
        $array['volumen'] = ($array['volumen']) ? '1' : '0';
        $array['capacidad'] = ($array['capacidad']) ? '1' : '0';
        $array['um'] = ($array['um']) ? '1' : '0';
        $array['producto'] = ($array['producto']) ? '1' : '0';
        $obj = parent::modificarNomenclador($array, true);
        if (!is_object($obj)) {
            return $obj;
        }
        unset($array['idtipoubicacion']);
        $obj->NomCampostipoubicacion->synchronizeWithArray($array);
        $obj->save();

        return true;
    }

    public function buscarEntidad($obj)
    {
        $filtro = '';
        $arrFiltro = array();
        $query = new Doctrine_Query();
        if ($obj['denominacion']) {
            $arrFiltro [] = "denominacion ILIKE '%{$obj['denominacion']}%'";
        }

        if ($obj['codigo']) {
            $arrFiltro [] = "codigo LIKE '%{$obj['codigo']}%'";
        }

        if (!empty($arrFiltro)) {
            $filtro = implode(' AND ', $arrFiltro);
            $query->addWhere($filtro);
        }

        $query->select('m.*')->from("{$obj['modelo']} m");
        $clasEntidad = 'Dat' . substr($obj['modelo'], 3) . 'Entidad';
        $fechaHoy = date("d/m/Y");
        if (class_exists($clasEntidad)) {
            $query->addSelect(",e.idestructuracomun as usarentidad")->innerJoin(
                "m.$clasEntidad e ON m.{$obj['idnom']} = e.{$obj['idnom']}
                AND e.idestructuracomun =
                                    {$this->global->Estructura->idestructura}"
            );
            $query->addSelect(
                'ncu.capacidad as capacidad,
                ncu.um as um,
                ncu.producto as producto,
                ncu.volumen as volumen, ncu.peso as peso'
            )->innerJoin(
                "m.NomCampostipoubicacion ncu ON m.{$obj['idnom']}= ncu.{$obj['idnom']}"
            );
            if ($obj['iddependence']) {
                $query->addWhere(
                    "e.{$obj['iddependence']} = ?", array($obj['value'])
                );
            }
            $query->addWhere(
                'm.fechafin >= ? OR m.fechafin IS NULL', array($fechaHoy)
            );
        }
        $cant = $query->count();

        $query->limit(($obj['limit']) ? $obj['limit'] : 30)
            ->offset(($obj['start']) ? $obj['start'] : 0)
            ->orderBy("{$obj['idnom']} DESC");
        $res = $query->fetchArray();

        return array('cantidad' => $cant, 'datos' => $res);
    }

}
