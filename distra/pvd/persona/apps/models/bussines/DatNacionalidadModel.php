<?php

class DatNacionalidadModel extends ZendExt_Model implements IConceptoExport
{
    protected $objDatNationality;

    /**
     * Constructor de la clase
     */
    function __construct()
    {
        $this->objDatNationality = new DatNacionalidad();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Modificar la nacionalidad de la persona
     *
     * @param array $data
     * @param array $ids
     *
     * @throws Exception
     */
    public function changeNationalitys(array $data, array $ids)
    {
        try {
            try {
                if (count($data) > 0 && count($ids) > 0) {
                    $collection = $this->objDatNationality->getById($ids);
                    if (count($collection) > 0) {
                        foreach ($collection as $p => $v) {
                            foreach ($data[$v->idnacionalidadp] as $k => $val) {
                                $collection[$p]->$k = $val;
                            }
                        }
                        if ($collection->isModified()) {
                            $collection->save();
                        }
                    } else {
                        throw new Exception('No existen los campos a modificar', 3);
                    }
                }
            } catch (Doctrine_Collection_Exception $e) {
                throw $e;
            }

        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Eliminar la(s) nacionalidad(es) de la persona
     *
     * @param array $data
     * @param       $idpersona
     *
     * @throws Exception
     */
    public function removeNationalitys(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $this->objDatNationality->removeNationalitys($data, $idpersona);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtener el idnacionalidadp dado el idpersona y el el idnacionalidad
     *
     * @param $idpersona
     * @param $idnacionalidad
     *
     * @return mixed|null
     */
    public function getIdNationalityP($idpersona, $idnacionalidad)
    {
        $result = $this->objDatNationality->getIdNationalityPro($idpersona, $idnacionalidad);
        $idnacionalidadp = null;
        if (count($result)) {
            foreach ($result as $key => $value) {
                $idnacionalidadp = $value['idnacionalidadp'];
            }

        } else {
            $nacionalidad[0]['idnacionalidad'] = $idnacionalidad;
            $nacionalidad[0]['fdesde'] = date('d/m/y');
            $nacionalidad[0]['fhasta'] = '';
            $nacionalidad[0]['activa'] = 0;
            $arrIds = $this->addNationalitys($nacionalidad, $idpersona);
            $idnacionalidadp = $arrIds[0]['idnacionalidadp'];
        }

        return $idnacionalidadp;
    }

    /**
     * Adicionar una nueva nacionalidad a la persona
     *
     * @param array $arrayNacionalidad
     * @param       $idpersona
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function addNationalitys(array $arrayNacionalidad, $idpersona)
    {
        try {
            $nacionalidad = $this->getNationalityByIdperson($idpersona);
            $collection = new Doctrine_Collection('DatNacionalidad');
            $nacionalidad = null;
            foreach ($arrayNacionalidad as $p => $array) {
                foreach ($array as $k => $v) {
                    switch ($k) {
                        case 'idnacionalidad':
                            $nacionalidad = $this->verifExist($v, 'idnacionalidad', $nacionalidad->data) ? $v : $nacionalidad;
                            break;
                        default:
                            break;
                    }
                    $collection[$p][$k] = $v;
                }
                $collection[$p]['idpersona'] = $idpersona;
            }
            if (!empty($nacionalidad)) {
                throw new Exception("La nacionalidad:  $nacionalidad ya existe", 3);
            }
            $collection->save();
            $arridnacionalidadp = array();
            foreach ($collection as $key => $value) {
                $data = $value->getData();
                $arridnacionalidadp[$key]['idnacionalidadp'] = $value['idnacionalidadp'];

            }

            return $arridnacionalidadp;
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    /**
     * Obtner la nacionalidad por id persona
     *
     * @param $idpersona
     * @param $filtro
     * @param $limit
     * @param $start
     *
     * @return mixed
     * @throws Exception
     */
    public function getNationalityByIdperson($idpersona)
    {
        try {
            $response->data = $this->objDatNationality->getNationalityByIdperson($idpersona);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Verificar si existe la nacionalidad
     *
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
                if ((isset($id) && isset($arr['idnacionalidadp'])) && $arr['idnacionalidadp'] == $id) {
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
     * Obtener denominacion dado el id de nacionalidadp
     *
     * @param $idnacionalidadp
     *
     * @return array
     */
    public function getDenomByIdNationalityP($idnacionalidadp)
    {
        return $this->objDatNationality->getDenomByIdNationalityP($idnacionalidadp);
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('dnacion.*')->leftJoin($baseAlias . '.DatNacionalidad dnacion');
    }
}

