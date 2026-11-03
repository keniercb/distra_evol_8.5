<?php

/**
 * Class DatCiudadaniaModel
 */
class DatCiudadaniaModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var DatCiudadania
     */
    protected $_objCiudadania;

    /**
     *
     */
    function __construct()
    {
        $this->_objCiudadania = new DatCiudadania();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param array $data
     * @param       $idpersona
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     * @throws Exception
     */
    public function addCiudadanias(array $data, $idpersona)
    {
        try {
            $ciudadaniasReg = $this->getCiudadaniasByPersona($idpersona);
            $collection = new Doctrine_Collection('DatCiudadania');
            $ciudadania = null;
            foreach ($data as $p => $array) {
                foreach ($array as $k => $v) {
                    switch ($k) {
                        case 'idciudadania':
                            $ciudadania = $this->verifExist($v, 'idciudadania', $ciudadaniasReg->datos) ? $v : $ciudadania;
                            break;
                        default:
                            break;
                    }
                    $collection[$p][$k] = $v;
                }
                $collection[$p]['idpersona'] = $idpersona;
            }
            if (!empty($ciudadania)) {
                throw new Exception("La ciudadadanía $ciudadania ya existe", 3);
            }
            $collection->save();
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
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
    public function getCiudadaniasByPersona($idpersona, $filtro, $limit, $start)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $response->data = $this->_objCiudadania->getCiudadaniasByPersona($arrayPersonas, $filtro, $limit, $start);
            $response->quantity = ($limit > 0) ? $this->_objCiudadania->getCantCiudadaniasByPersona(
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

    /**
     * @param      $val
     * @param      $index
     * @param      $array
     * @param null $id
     *
     * @return bool
     */
    protected function verifExist($val, $index, $array, $id = null)
    {
        $cantd = count($array);
        if ($cantd > 0) {
            while ($cantd > 0) {
                $arr = $array[$cantd - 1];
                if ((isset($id) && isset($arr['idciudadaniap'])) && $arr['idciudadaniap'] == $id) {
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

    /**
     * @param array $data
     * @param array $ids
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function modCiudadanias(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->_objCiudadania->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idciudadaniap] as $k => $val) {
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

    /**
     * @param $id
     * @param $idpersona
     *
     * @throws Exception
     */
    public function delCiudadanias($id, $idpersona)
    {
        try {
            $arrayPersonas = $this->reflectArray($idpersona);
            $arrayIdCiudadanias = $this->reflectArray($id);
            $this->_objCiudadania->delCiudadanias($arrayIdCiudadanias, $arrayPersonas);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dciu.*')->leftJoin($baseAlias . '.DatCiudadania dciu');
    }
}

