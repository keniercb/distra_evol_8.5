<?php
class NomSituacionModel extends ZendExt_Model
{
    protected $_objSituacion;

    function __construct()
    {
        $this->_objSituacion = new NomSituacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getSituacionLaboral($filtro, $limit, $start, $activo)
    {
        try {
            $response = new stdClass();
            $response->data = $this->_objSituacion->getSituacionLaboral(
                $filtro,
                $limit,
                $start,
                $activo
            );
            $response->quantity = $limit > 0
                ? $this->_objSituacion->getCantSituacionLaboral(
                    $filtro,
                    $activo
                )
                : count($response->data);
            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addSituacionLaboral($data)
    {
        try {
            if (count($data) > 0 && !$this->_objSituacion->verifExiste($data['denominacion'])) {
                $collection = new NomSituacion();
                foreach ($data as $p => $v) {
                    $collection[$p] = $v;
                }
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function modSituacionLaboral($data)
    {
        try {
            if (
                count($data) > 0 &&
                !$this->_objSituacion->verifExiste($data['denominacion'], $data['idsituacionlaboral'])
            ) {
                $collection = $this->_objSituacion->getById(
                    $data['idsituacionlaboral']
                );
                foreach ($data as $p => $v) {
                    if ($collection[0]->$p != $v)
                        $collection[0]->$p = $v;
                }
                $collection->save();
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function delSituacionLaboral(array $id)
    {
        try {
            if (count($id) > 0)
                $this->_objSituacion->deleteSitacionLaboral($id);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getAllSituation($activo, $cargoAsociado)
    {
        try {
            $tmp = $this->_objSituacion->getAllSituation(
                $activo,
                $cargoAsociado
            );
            return $this->generateTreeSituacion($tmp);
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addSituation($objSituacion)
    {
        try {
            $estaden = $this->_objSituacion->findByIdOrDenom(
                $objSituacion->denominacion,
                null,
                $objSituacion->idpadre
            );
            if (!$estaden) {
                $obj = new NomSituacion();
                foreach ($objSituacion as $k => $v) {
                    $obj->$k = $v;
                }
                if (empty($objSituacion->idpadre)) {
                    $obj->idpadre = $this->_objSituacion->getIncremented();
                } else if (empty($objSituacion->color)) {
                    $objparent = $this->_objSituacion->getColorParent(
                        $objSituacion->idpadre
                    );
                    $obj->color = $objparent[0]['color'];
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

    public function changeSituation($idsituacion, $values)
    {
        try {
            if (count($values) > 0 && !empty($idsituacion)) {
                $obj = $this->_objSituacion->getById($idsituacion);
                $estaden = $this->_objSituacion->findByIdOrDenom(
                    $values->denominacion,
                    $idsituacion,
                    $values->idpadre
                );
                if (!$estaden) {
                    foreach ($values as $k => $val) {
                        $obj[$k] = $val;
                    }
                    if ($obj->isModified()) {
                        $obj->save();
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

    private function generateTreeSituacion(array &$array, $idPadre = null, &$len = -1)
    {
        $treeFormat = array();
        $sd = 'Sin descripci&oacute;n';
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
                    $treeFormat[$lenght]['qtip'] = (empty($v['descripcion']))?$sd:$v['descripcion'];
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
            } else if ($v['idpadre'] == $idPadre && $v['idsituacion'] != $idPadre) {
                $treeFormat[$lenght] = $v;
                $treeFormat[$lenght]['expanded'] = false;
                $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                $treeFormat[$lenght]['qtip'] = (empty($v['descripcion']))?$sd:$v['descripcion'];
                array_splice($array, $cont, 1);
                $len--;
                $children = $this->generateTreeSituacion($array, $v['idsituacion'], $len);
                if (count($children) > 0) {
                    $treeFormat[$lenght]['children'] = $children;
                    $treeFormat[$lenght]['leaf'] = false;
                    $treeFormat[$lenght]['iconCls'] = 'agrupador';

                } else {
                    $treeFormat[$lenght]['leaf'] = true;

                }
            } else {
                $cont++;
            }
        }
        return $treeFormat;
    }
}