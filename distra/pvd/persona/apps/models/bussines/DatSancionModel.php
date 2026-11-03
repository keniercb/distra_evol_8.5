<?php

class DatSancionModel extends ZendExt_Model implements IConceptoExport
{
    protected $_objDatSancion;

    function __construct()
    {
        $this->_objDatSancion = new DatSancion();
        $this->objEstructuraService = new EyCServices();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $idpersona
     * @param $filtro
     * @param $limit
     * @param $start
     *
     * @return mixed
     * @throws Exception
     */
    public function getSancionesByPersonas($idpersona, $filtro, $limit, $start)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $response->data = $this->_objDatSancion->getSancionesByPersona($arrayPersonas, $filtro, $limit, $start);
            foreach ($response->data as $c => $array) {
                $cargo = $this->objEstructuraService->getAllCargos($array['idcargofacultado'], null, null);
                $response->data[$c]['cargopropuesto'] = $cargo[0]['denominacion'];
                $response->data[$c]['idcargopropuesto'] = $array['idcargofacultado'];
            }
            $response->quantity = ($limit > 0) ? $this->_objDatSancion->getCantSancionesByPersona(
                $arrayPersonas, $filtro
            ) : 0;

            return $response;
        } catch (Exception $e) {

            throw $e;
        }
    }

    /**
     * @param $data
     *
     * @return array
     */
    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    public function addSanciones(array $data, $idpersona)
    {
        try {

            $collection = new Doctrine_Collection('DatSancion');
            foreach ($data as $p => $array) {
                foreach ($array as $k => $v) {
                    $collection[$p][$k] = $v;
                }
                $collection[$p]['idpersona'] = $idpersona;
            }
            $collection->save();
        } catch (Doctrine_Collection_Exception $e) {

            throw $e;
        }
    }

    public function modSanciones(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->_objDatSancion->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idsancionp] as $k => $val) {
                            $collection[$p]->$k = $val;
                        }
                    }
                    if ($collection->isModified()) {
                        $collection->save();
                    }
                }
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function delSanciones($id, $idpersona)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrayIdSanciones = $this->reflectArray($id);
            $this->_objDatSancion->delSanciones($arrayIdSanciones, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dsanc.*')->leftJoin($baseAlias . '.DatSancion dsanc');
    }

    protected function verifExist($val, $index, $array, $id = null)
    {
        $cantd = count($array);
        if ($cantd > 0) {
            while ($cantd > 0) {
                $arr = $array[$cantd - 1];
                if ((isset($id) && isset($arr['idsancionp'])) && $arr['idsancionp'] == $id) {
                    $cantd--;
                } elseif ($arr[$index] == $val) {
                    return true;
                } else {
                    $cantd--;
                }
            }
        }

        return false;
    }
}