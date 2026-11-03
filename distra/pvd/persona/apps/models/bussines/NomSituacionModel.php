<?php

class NomSituacionModel extends ZendExt_Model
{
    protected $objSituacion;

    function __construct()
    {
        $this->objSituacion = new NomSituacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getSituacionLaboral($filtro = null, $limit = null, $start = 0, $activo = true)
    {
        try {
            $response = new stdClass();
            $response->data = $this->objSituacion->getSituacionLaboral($filtro, $limit, $start, $activo);
            $response->quantity = $limit > 0
                ? $this->objSituacion->getCantSituacionLaboral($filtro, $activo)
                : count(
                    $response->data
                );

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addSituacionLaboral($data)
    {
        try {
            if (count($data) > 0 && !$this->objSituacion->verifExiste($data['denominacion'])) {
                $collection = new NomSituacion();
                foreach ($data as $p => $v) {
                    $collection[$p] = $v;
                }
                //print_r($collection->get);die;
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function modSituacionLaboral($data)
    {
        try {
            if (count($data) > 0 && !$this->objSituacion->verifExiste($data['denominacion'], $data['idsituacionlaboral'])) {
                $collection = $this->objSituacion->getById($data['idsituacionlaboral']);
                foreach ($data as $p => $v) {
                    if ($collection[0]->$p != $v) {
                        $collection[0]->$p = $v;
                    }
                }
                //print_r($collection[0]);die;
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function delSituacionLaboral(array $id)
    {
        try {
            if (count($id) > 0) {
                $this->objSituacion->deleteSitacionLaboral($id);
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
    public function getAllSituation($activo = true, $cargoAsociado = false)
    {
        try {
			
            $tmp = $this->objSituacion->getAllSituation($activo, $cargoAsociado);
           // print_r($tmp);die;
            return $this->generateTreeSituacion($tmp);
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
    private function generateTreeSituacion(array &$array, $idPadre = null, &$len = -1)
    {
        $treeFormat = array();
        $len = isset($len) && $len >= 0 ? $len : count($array);
        $cont = 0;
        while ($len > $cont) {
            $v = $array[$cont];
            $lenght = count($treeFormat);
            if (empty($idPadre)) {
                if ($v['idsituacion'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = true;
                    $treeFormat[$lenght]['iconCls'] = 'package';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeSituacion($array, $v['idsituacion'], $len);
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
                if ($v['idpadre'] == $idPadre && $v['idsituacion'] != $idPadre) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = false;
                    $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeSituacion($array, $v['idsituacion'], $len);
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

    /**
     * @param $objSituacion
     *
     * @return bool|mixed
     */
    public function addSituation($objSituacion)
    {
        try {
            if (!$this->objSituacion->findByIdOrDenom($objSituacion->denominacion, null, $objSituacion->idpadre)) {
                $obj = new NomSituacion();
                foreach ($objSituacion as $k => $v) {
                    $obj->$k = $v;
                }
                if (empty($objSituacion->idpadre)) {
                    $obj->idpadre = $this->objSituacion->getIncremented();
                } else {
                    if (empty($objSituacion->color)) {
                        $objparent = $this->objSituacion->getColorParent($objSituacion->idpadre);
                        $obj->color = $objparent[0]['color'];
                    }
                }
                $obj->save();

                return $obj->idsituacion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    /**
     * @param $idsituacion
     * @param $values
     *
     * @return bool
     */
    public function changeSituation($idsituacion, $values)
    {
        try {
            if (count($values) > 0 && !empty($idsituacion)) {
                $collection = $this->objSituacion->getById($idsituacion);
                if (count($collection) > 0) {
                    if (!$this->objSituacion->findByIdOrDenom($values->denominacion, $idsituacion, $values->idpadre)) {
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
     * @param $arrids
     *
     * @return Doctrine_Collection|string
     */
    public function removeSituation($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomSituacion');
            if (is_array($arrids)) {
                $query->whereIn('idsituacion', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idsituacion = ?', $arrids);
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
