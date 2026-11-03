<?php

/**
 * Class DatDocidentidadModel
 */
class DatDocidentidadModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var DatDocidentidad
     */
    protected $_objDatDocidentidad;

    /**
     *
     */
    function __construct()
    {
        $this->_objDatDocidentidad = new DatDocidentidad();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param array $docIdentidad
     * @param       $idpersona
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     * @throws Exception
     */
    public function addDocIdentidad(array $docIdentidad, $idpersona)
    {
        try {
            $docIdentidadActual = $this->getDocIdentidad($idpersona);
            $collection = new Doctrine_Collection('DatDocidentidad');
            $docPrincipal = 0;
            $tipoDocIdentidad = null;
            foreach ($docIdentidad as $p => $array) {
                foreach ($array as $k => $v) {
                    switch ($k) {
                        case 'principal':
                            $docPrincipal = ($v == true) ? +1 : $docPrincipal;
                            break;
                        case 'idtipodocidentidad':
                            $tipoDocIdentidad = $this->verifExist(
                                $v, 'idtipodocidentidad', $docIdentidadActual->datos
                            ) ? $v : $tipoDocIdentidad;
                            break;
                        default:
                            break;
                    }
                    $collection[$p][$k] = $v;
                }
                $collection[$p]['idpersona'] = $idpersona;
            }
            if (!empty($tipoDocIdentidad)) {
                throw new Exception("El tipo de doc de identidad $tipoDocIdentidad ya existe", 3);
            }
            if ($docPrincipal >= 1 && $this->verifExist(1, 'principal', $docIdentidadActual->datos)) {
                throw new Exception('Existe varios doc de identidad como primario, debe escoger solo uno', 3);
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
     * @return stdClass
     * @throws Exception
     */
    public function getDocIdentidad($idpersona, $filtro, $limit, $start)
    {
        try {
            $response->data = $this->_objDatDocidentidad->getDocIdentidadByPersona($idpersona, $filtro, $limit, $start);
            $response->quantity = ($limit > 0) ? $this->_objDatDocidentidad->getCantDocIdentidadByPersona(
                $idpersona, $filtro
            ) : count($response->data);

            return $response;
        } catch (Exception $e) {
            throw $e;
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
                if ((isset($id) && isset($arr['iddocidentidad'])) && $arr['iddocidentidad'] == $id) {
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
     * @param       $idpersona
     *
     * @throws Exception
     */
    public function modDocIdentidad(array $data, array $ids, $idpersona)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->_objDatDocidentidad->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->iddocidentidad] as $k => $val) {  //print_r($data[$v->iddocidentidad]);die;
                            $collection[$p]->$k = $val;
                        }
                    }
                    if ($collection->isModified()) {
                        $collection->save();
                    }
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para eliminar los doc de identidad de la persona
     *
     * @param array $idDocIdentidad
     * @param       $idpersona
     *
     * @throws Exception
     */
    public function delDocIdentidad(array $idDocIdentidad, $idpersona)
    {
        try {
            $this->_objDatDocidentidad->delDocIdentidad($idDocIdentidad, $idpersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para saber si existe documento de identidad dado un numero
     *
     * @param $idtipodocidentidad
     * @param $numero
     *
     * @throws Exception
     */
    public function existeDocIdentidadByNumero($idtipodocidentidad, $numero, $idpersona)
    {
        $doc = $this->_objDatDocidentidad->getDocIdentidadByNumero($idtipodocidentidad, $numero, $idpersona);
        if (count($doc) > 0) {
            return 1;
        } else {
            return 0;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('ddi.*')->leftJoin($baseAlias . '.DatDocidentidad ddi');
    }
}

