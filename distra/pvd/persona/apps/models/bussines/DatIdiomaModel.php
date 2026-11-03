<?php

/**
 * Class DatIdiomaModel
 */
class DatIdiomaModel extends ZendExt_Model implements IConceptoExport
{
    /**
     * @var
     */
    protected $_objIdioma;

    /**
     *
     */
    function __construct()
    {
        $this->_objIdioma = new DatIdioma();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function addLanguages(array $arrayIdioma, $idpersona)
    {
        try {
            $idioma = $this->getLanguageByIdperson($idpersona);
            $collection = new Doctrine_Collection('DatIdioma');
            $idioma = null;
            foreach ($arrayIdioma as $p => $array) {
                foreach ($array as $k => $v) {
                    switch ($k) {
                        case 'ididioma':
                            $idioma = $this->verifExist($v, 'ididioma', $idioma->data) ? $v : $idioma;
                            break;
                        default:
                            break;
                    }
                    $collection[$p][$k] = $v;
                }
                $collection[$p]['idpersona'] = $idpersona;
            }
            if (!empty($idioma)) {
                throw new Exception("El idioma:  $idioma ya existe", 3);
            }
            $collection->save();
            $arrididiomap = array();
            foreach ($collection as $key => $value) {
                //$data = $value->getData();
                $arrididiomap[$key]['ididiomap'] = $value['ididiomap'];

            }

            return $arrididiomap;
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function getLanguageByIdperson($idpersona)
    {
        try {
            $response->data = $this->_objIdioma->getLanguageByIdperson($idpersona);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    protected function verifExist($val, $index, $array, $id = null)
    {
        $cantd = count($array);
        if ($cantd > 0) {
            while ($cantd > 0) {
                $arr = $array[$cantd - 1];
                if ((isset($id) && isset($arr['ididiomap'])) && $arr['ididiomap'] == $id) {
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

    public function changeLanguages(array $data, array $ids)
    {
        try {
            try {
                if (count($data) > 0 && count($ids) > 0) {
                    $collection = $this->_objIdioma->getById($ids);
                    if (count($collection) > 0) {
                        foreach ($collection as $p => $v) {
                            foreach ($data[$v->ididiomap] as $k => $val) {
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

    public function removeLanguages(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $this->_objIdioma->removeLanguages($data, $idpersona);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function concatDqlPersonaDataExport($query, $baseAlias)
    {
        return $query->addSelect('didiom.*')->leftJoin($baseAlias . '.DatIdioma didiom');
    }
}

