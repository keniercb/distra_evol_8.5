<?php

class NomModoformacionModel extends ZendExt_Model
{

    protected $objModoFormacion;
    protected $response;

    function __construct()
    {
        $this->objModoFormacion = new NomModoformacion();
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
    public function getModoFormacionActive($filtro = null, $limit = null, $start = 0, $activo = true)
    {
        try {
            $response = new stdClass();
            // $response->data = $this->objModoFormacion->getSituacionLaboral($filtro, $limit, $start, $activo);
            $response->quantity = $limit > 0
                ? $this->objModoFormacion->getCantSituacionLaboral($filtro, $activo)
                : count(
                    $response->data
                );

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $data
     *
     * @throws Exception
     */
    public function addModoFormacion($data)
    {
        try {
            if (count($data) > 0 && !$this->objModoFormacion->verifExiste($data['denominacion'])) {
                $collection = new NomModoformacion();
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
     * @param $idmodoformacion
     * @param $denominacion
     * @param $descripcion
     * @param $fdesde
     * @param $fhasta
     *
     * @throws Exception
     */
    public function modModoFormacion($idmodoformacion, $values)
    {
        try {
            if (count($values) > 0 && !empty($idmodoformacion)) {
                $collection = $this->objModoFormacion->getById($idmodoformacion);
                if (count($collection) > 0) {
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
    public function delModoFormacion($arrids)
    {
        /* try {
             $query = Doctrine_Query::create();
             $query->from('NomModoformacion');
             if (is_array($ids)) {
                 $query->whereIn('idmodoformacion', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idmodoformacion = ?', $arrids);
             }
             $result = $query->execute();
             if($result->delete()){
                 $r['exception'] = 0;
             }
             return $r;
         } catch (Doctrine_Exception $e) {
             if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                 $r['exception'] = 1;
                 return $r;
             } else {
                 return (json_encode($e->getMessage()));
             }
         }*/
        try {
            if (count($id) > 0) {
                $this->objModoFormacion->deleteModoformacion($id);
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
    public function getAllModoformacion($activo = true)
    {
        try {
            $tmp = $this->objModoFormacion->getAllModoformacion($activo);

            return $this->generateTreeModo($tmp);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $array
     * @param       $idPadre
     * @param       $len
     *
     * @return array
     */
    private function generateTreeModo(array &$array, $idPadre = null, &$len = -1)
    {
        $treeFormat = array();
        $len = isset($len) && $len >= 0 ? $len : count($array);
        $cont = 0;
        while ($len > $cont) {
            $v = $array[$cont];
            $lenght = count($treeFormat);
            if (empty($idPadre)) {
                if ($v['idmodoformacion'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = true;
                    $treeFormat[$lenght]['iconCls'] = 'package';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idmodoformacion'], $len);
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
                if ($v['idpadre'] == $idPadre && $v['idmodoformacion'] != $idPadre) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = false;
                    $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idmodoformacion'], $len);
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

    public function addModo($objModoFormacion)
    {
        try {
            if (!$this->objModoFormacion->findByIdOrDenom(
                $objModoFormacion->denominacion, null, $objModoFormacion->idpadre
            )
            ) {
                $obj = new NomModoformacion();
                foreach ($objModoFormacion as $k => $v) {
                    $obj->$k = $v;
                }
                if (empty($objModoFormacion->idpadre)) {
                    $obj->idpadre = $this->objModoFormacion->getIncremented();
                }
                $obj->save();

                return $obj->idmodoformacion;
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
            $query->from('NomModoformacion');
            if (is_array($arrids)) {
                $query->whereIn('idmodoformacion', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idmodoformacion = ?', $arrids);
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
