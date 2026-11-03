<?php

class Utiles
{
    /**
     * @param $data
     *
     * @return array
     */
    public static function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    /**
     * @param      $id
     * @param bool $noImplode
     *
     * @throws Exception
     * @return array
     */
    public static function getArryOfCargos($id, $noImplode = false)
    {
        try {
            $objService = new EyCServices();
            $arrCargos = $objService->getCargosByEstructura($id);
            $array = array();
            foreach ($arrCargos as $v) {
                $array[] = $v['idcargo'];
            }
            if ($noImplode) {
                return $array;
            }

            return count($array) > 0 ? implode(',', $array) : $array;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public static function personaBy(Doctrine_Query &$objQ, $filtros = '', $pA, $dA = null)
    {
        $advaceSearch = json_decode($filtros);
        if (empty($advaceSearch)) {
            if (is_string($filtros)) {
                $basicFiltro = $filtros;
            } else {
                $advaceSearch = $filtros;
            }
        }
        if (!empty($basicFiltro)) {
            $filtros = trim($filtros);
            $arrFiltros = explode(' ', $filtros);
            $cant = count($arrFiltros);
            $i = 1;
            $where
                = "$pA.nombre ILIKE '%$arrFiltros[0]%' OR $pA.snombre ILIKE '%$arrFiltros[0]%' OR $pA.papel ILIKE '%$arrFiltros[0]%' OR $pA.sapel ILIKE '%$arrFiltros[0]%'";
            while ($i < $cant) {
                $v = $arrFiltros[$i];
                $where .= " OR $pA.nombre ILIKE '%$v%' OR $pA.snombre ILIKE '%$v%' OR $pA.papel ILIKE '%$v%' OR $pA.sapel ILIKE '%$v%'";
                $i++;
            }
            $objQ->andWhere($where);
        } else {
            if (!empty($advaceSearch)) {
                $operador = ' LIKE ';
                $l = '%';
                $r = '%';
                switch ($advaceSearch->condicion) {
                    case '<>':
                        $operador = ' <> ';
                        break;
                    case 'x%':
                        $l = '';
                        break;
                    case '%x':
                        $r = '';
                        break;
                    default:
                        break;
                }
                if ($advaceSearch->fonetica) {

                }
                if ($advaceSearch->minMayus) {
                    $operador = ' ILIKE ';
                }
                if ($advaceSearch->allWord) {
                    $l = '';
                    $r = '';
                }
                if ($advaceSearch->nombre !== '' && isset($advaceSearch->nombre)) {
                    $objQ->andWhere("$pA.nombre $operador '$l$advaceSearch->nombre$r'");
                }
                if ($advaceSearch->snombre !== '' && isset($advaceSearch->snombre)) {
                    $objQ->andWhere("$pA.snombre $operador '$l$advaceSearch->snombre$r'");
                }
                if ($advaceSearch->papel !== '' && isset($advaceSearch->papel)) {
                    $objQ->andWhere("$pA.papel $operador '$l$advaceSearch->papel$r'");
                }
                if ($advaceSearch->sapel !== '' && isset($advaceSearch->sapel)) {
                    $objQ->andWhere("$pA.sapel $operador '$l$advaceSearch->sapel$r'");
                }
                if ($advaceSearch->id !== '' && isset($advaceSearch->id)) {
                    $objQ->andWhere("$pA.sexo = ?", $advaceSearch->id);

                }
                if ($advaceSearch->numid !== '' && !empty($dA) && isset($advaceSearch->numid)) {
                    $objQ->andWhere("$dA.numero ILIKE '$advaceSearch->numid'");
                }
            }
        }
    }

    /**
     * @param Doctrine_Collection $collection
     * @param                     $data
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public static function linkCollectionToSave(Doctrine_Collection $collection, $data)
    {
        try {
//print_r($data);die;
            foreach ($data as $k => $v) {
                if (!empty($v)) {
                    $collection[0]->$k = $v;
                }
            }
//print_r($collection);die;
            return $collection;
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }
}