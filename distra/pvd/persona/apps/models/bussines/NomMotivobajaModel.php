<?php

class NomMotivobajaModel extends ZendExt_Model
{

    protected $_objlowmotive;

    function __construct()
    {
        $this->_objlowmotive = new NomMotivobaja();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener la LowMotivea activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveLowMotive($filtro = null, $limit = null, $start = 0, $activo = true)
    {
        try {
            $response = new stdClass();
            $response->data = $this->_objlowmotive->getSituacionLaboral($filtro, $limit, $start, $activo);
            $response->quantity = $limit > 0
                ? $this->_objlowmotive->getCantSituacionLaboral($filtro, $activo)
                : count(
                    $response->data
                );

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de LowMotivea
     *
     * @param object $objlowmotive
     *
     * @return numeric
     */
    public function addLowMotive($data)
    {
        try {
            if (count($data) > 0 && !$this->_objlowmotive->verifExiste($data['denominacion'])) {
                $collection = new NomMotivobaja();
                foreach ($data as $p => $v) {
                    $collection[$p] = $v;
                }
                // print_r($collection->get);die;
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para modificar el tipo de  LowMotivea
     *
     * @param numeric $idmotivobaja
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modLowMotive($idmotivobaja, $values)
    {
        try {
            if (count($values) > 0 && !empty($idmotivobaja)) {
                $collection = $this->_objlowmotive->getById($idmotivobaja);
                if (count($collection) > 0) {
                    if (!$this->_objlowmotive->findByIdOrDenom($values->denominacion, $idmotivobaja, $values->idpadre)) {
                        foreach ($values as $k => $val) {
                            $collection[0][$k] = $val;
                        }
                        if ($collection[0]->isModified()) {
                            $collection[0]->save();

                            return true;
                        }
                    } else {
                        return false;
                    }
                }
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    /**
     * Funcion para elieminar el tipo de  LowMotivea
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delLowMotive(array $id)
    {
        try {
            if (count($id) > 0) {
                $this->_objlowmotive->delLowMotive($id);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getAllMotivobaja($activo = true)
    {
        try {
            $tmp = $this->_objlowmotive->getAllMotivobaja($activo);

            return $this->generateTreeModo($tmp);
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function generateTreeModo(array &$array, $idPadre = null, &$len = -1)
    {
        $treeFormat = array();
        $len = isset($len) && $len >= 0 ? $len : count($array);
        $cont = 0;
        while ($len > $cont) {
            $v = $array[$cont];
            $lenght = count($treeFormat);
            if (empty($idPadre)) {
                if ($v['idmotivobaja'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = true;
                    $treeFormat[$lenght]['iconCls'] = 'package';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idmotivobaja'], $len);
                    if (count($children) > 0) {
                        $treeFormat[$lenght]['children'] = $children;
                        $treeFormat[$lenght]['leaf'] = false;
                    } else {
                        $treeFormat[$lenght]['leaf'] = true;
                    }
                } else {
                    $cont++;
                }
            } else {
                if ($v['idpadre'] == $idPadre && $v['idmotivobaja'] != $idPadre) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = false;
                    $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idmotivobaja'], $len);
                    if (count($children) > 0) {
                        $treeFormat[$lenght]['children'] = $children;
                        $treeFormat[$lenght]['leaf'] = false;
                        // $treeFormat[$lenght]['expanded'] = true;
                        $treeFormat[$lenght]['iconCls'] = 'agrupador';
                    } else {
                        $treeFormat[$lenght]['leaf'] = true;
                    }
                } else {
                    $cont++;
                }
            }
        }

        //print_r($treeFormat);die;
        return $treeFormat;
    }

    public function addModo($objlowmotive)
    {
        try {
            if (!$this->_objlowmotive->findByIdOrDenom($objlowmotive->denominacion, null, $objlowmotive->idpadre)) {
                $obj = new NomMotivobaja();
                foreach ($objlowmotive as $k => $v) {
                    $obj->$k = $v;
                }
                if (empty($objlowmotive->idpadre)) {
                    $obj->idpadre = $this->_objlowmotive->getIncremented();
                }
                $obj->save();

                return $obj->idmotivobaja;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    public function removeModo($arrids)
    {
        try {
            $query = Doctrine_Query::create()->delete('NomMotivobaja')->whereIn('idmotivobaja', $arrids);
            $result = $query->execute();
            if (count($result)) {
                $r->exception = 0;
            }

            return $r;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r->exception = 1;
                $r->msg = 'Code for foreignKeyViolation';

                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

    public function getMotivos()
    {
        $tmp = $this->_objlowmotive->getAllMotivobaja(true);
        foreach ($tmp as $k => $v) {
            if ($v['idmotivobaja'] == $v['idpadre']) {
                $tmp[$k]['agrupador'] = $v['denominacion'];
            }
        }

        //print_r($tmp);die;
        return array('data' => $tmp, 'quantity' => count($tmp));
    }
}

