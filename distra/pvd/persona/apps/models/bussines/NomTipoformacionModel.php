<?php

class NomTipoformacionModel extends ZendExt_Model
{
    protected $_objTipoFormacion;

    protected $_response;

    function __construct()
    {
        $this->_objTipoFormacion = new NomTipoformacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $filtro
     * @param $limit
     * @param $start
     *
     * @throws Exception
     */
    public function getTipoFormacionActive($filtro = null, $limit = null, $start = 0, $activo = true)
    {
        try {
            $response = new stdClass();
            //Para que no de error el jenkins:
            $start = 0;
            // $response->data = $this->objModoFormacion->getSituacionLaboral($filtro, $limit, $start, $activo);
            $response->quantity = $limit > 0
                ? $this->_objTipoFormacion->getCantSituacionLaboral($filtro, $activo)
                : count(
                    $response->data
                );

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $objTipoFormacion
     *
     * @throws Exception
     */
    public function addTipoFormacion($data)
    {
        try {
            if (count($data) > 0 && !$this->_objTipoFormacion->verifExiste($data['denominacion'])) {
                $collection = new NomTipoformacion();
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
     * @param $idtipoformacion
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     *
     * @throws Exception
     */
    public function modTipoFormacion($idtipoformacion, $values)
    {
        try {
            if (count($values) > 0 && !empty($idtipoformacion)) {
                $collection = $this->_objTipoFormacion->getById($idtipoformacion);
                if (count($collection) > 0) {
                    foreach ($values as $k => $val) {
                        $collection[0][$k] = $val;
                    }
                    if ($collection[0]->isModified()) {
                        $collection[0]->save();

                        return true;
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
     * @param $arrids
     *
     * @return Doctrine_Collection
     * @throws Doctrine_Exception
     * @throws Exception
     */
    public function delTipoFormacion(array $id)
    {
        try {
            if (count($id) > 0) {
                $this->_objTipoFormacion->deleteTipoformacion($id);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idsituacion
     *
     * @throws Exception
     */
    public function getAllTipoformacion($activo = true)
    {
        try {
            $tmp = $this->_objTipoFormacion->getAllTipoformacion($activo);

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
                if ($v['idtipoformacion'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = true;
                    $treeFormat[$lenght]['iconCls'] = 'package';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idtipoformacion'], $len);
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
                if ($v['idpadre'] == $idPadre && $v['idtipoformacion'] != $idPadre) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = false;
                    $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idtipoformacion'], $len);
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
        return $treeFormat;
    }

    public function addModo($objTipoFormacion)
    {
        try {
            if (!$this->_objTipoFormacion->findByIdOrDenom(
                $objTipoFormacion->denominacion, null, $objTipoFormacion->idpadre
            )
            ) {
                $obj = new NomTipoformacion();
                foreach ($objTipoFormacion as $k => $v) {
                    $obj->$k = $v;
                }
                if (empty($objTipoFormacion->idpadre)) {
                    $obj->idpadre = $this->_objTipoFormacion->getIncremented();
                }
                $obj->save();

                return $obj->idtipoformacion;
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
            $query = Doctrine_Query::create();
            $query->from('NomTipoformacion');
            if (is_array($arrids)) {
                $query->whereIn('idtipoformacion', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idtipoformacion = ?', $arrids);
            }
            $result = $query->execute()->delete();
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

}