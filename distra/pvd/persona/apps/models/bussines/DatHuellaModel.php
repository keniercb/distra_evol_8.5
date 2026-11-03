<?php

/**
 * Class DatHuellaModel
 */
class DatHuellaModel extends ZendExt_Model
{
    /**
     * @var
     */
    protected $_objDomain;

    /**
     *
     */
    function __construct()
    {
        $this->objHuella = new DatHuella();
    }

    /**
     * @throws ZendExt_Exception
     */
    public function setUp()
    {
        parent::ZendExt_Model();

    }

    /**
     * @param array $arrAdd
     * @param array $ids
     * @param array $arrMods
     * @param       $idpersona
     *
     * @throws Doctrine_Collection_Exception
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function saveAndUpdateFingers(array $arrAdd, array $ids, array $arrMods, $idpersona)
    {
        try {
            if ((count($arrAdd) > 0 || count($arrMods) > 0) && !empty($idpersona)) {
                $collection = $this->objHuella->getById($ids);
                if (count($collection) > 0) { //Si se van a modificar datos
                    foreach ($collection as $p => $v) {
                        foreach ($arrMods[$v->idhuella] as $k => $val) {
                            $collection[$p]->$k = $val;
                        }
                        $collection[$p]->idpersona = $idpersona;

                    }
                } else { //Creo el collection para adicionar los datos
                    $collection = new Doctrine_Collection('DatHuella');
                }
                foreach ($arrAdd as $k => $val) {
                    $p = count($collection);
                    $collection[$p]->iddedo = $val['iddedo'];
                    $collection[$p]->imagen = $val['imagen'];
                    $collection[$p]->minutia = $val['minutia'];
                    $collection[$p]->calidad = $val['calidad'];
                    $collection[$p]->idpersona = $idpersona;
                    $this->deleteFingers($val['iddedo'], $idpersona);
                }
                if ($collection->isModified()) {
                    $collection->save();
                }

            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    private function deleteFingers($iddedo, $idpersona)
    {
        try {
            return $this->objHuella->deleteFingers($iddedo, $idpersona);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $arrayFingers
     * @param       $idpersona
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function addFingers(array $arrayFingers, $idpersona)
    {
        try {
            $huellas = $this->getFingersByIdperson($idpersona);
            $modi = array();
            $collection = new Doctrine_Collection('DatHuella');
            $huella = null;
            foreach ($arrayFingers as $p => $array) {
                foreach ($array as $k => $v) {
                    switch ($k) {
                        case 'idhuella':
                            $huella = $this->verifExist($v, 'idhuella', $huellas->data) ? $v : $huella;
                            if ($huella) {
                                $modi[] = $array;
                            }
                            break;
                        default:
                            break;
                    }
                    $collection[$p][$k] = $v;
                }
                $collection[$p]['idpersona'] = $idpersona;

            }
            if (!empty($huella)) {
                throw new Exception("La huella:  $huella ya existe", 3);

            }
            if ($collection->save()) {
                $arridhuellap = array();
                foreach ($collection as $key => $value) {
                    $data = $value->getData();
                    $arridhuellap[$key]['idhuella'] = $value['idhuella'];

                }

                return $arridhuellap;
            } else {
                return false;
            }

        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idpersona
     *
     * @throws Exception
     */
    public function getFingersByIdperson($idpersona)
    {
        try {
            $response = new stdClass();
            $response->data = $this->objHuella->getFingersByIdperson($idpersona);

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
                if ((isset($id) && isset($arr['idhuella'])) && $arr['idhuella'] == $id) {
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
     * @throws Exception
     */
    public function changeFingers(array $data, array $ids)
    {
        try {
            try {
                if (count($data) > 0 && count($ids) > 0) {
                    $collection = $this->objHuella->getById($ids);
                    if (count($collection) > 0) {
                        foreach ($collection as $p => $v) {
                            foreach ($data[$v->idhuella] as $k => $val) {
                                $collection[$p]->$k = $val;
                            }
                        }
                        if ($collection->isModified()) {
                            $collection->save();
                        }
                    } else {
                        throw new Exception('No existen los records a modificar', 3);
                    }
                }
            } catch (Doctrine_Collection_Exception $e) {
                throw $e;
            }

        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDataHuella($idpersona, $iddedo)
    {
        try {
            return $this->objHuella->getDataHuella($idpersona, $iddedo);
        } catch (Exception $e) {
        }
    }
}

