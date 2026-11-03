<?php 
class NomMotivobajaModel extends ZendExt_Model
{
    private $_objMotivoBaja;
    public function __construct()
    {
        $this->_objMotivoBaja = new NomMotivobaja();
    }
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getMotivos($node, $denom, $fdesde, $fhasta)
    {
        try {
            if ($node) {
                $datos = $this->_objMotivoBaja->getMotivosHijos($node);
            } else {
                $datos = $this->_objMotivoBaja->getMotivosPadres(
                    $denom, $fdesde, $fhasta
                );
            }
            $result = $this->completarDatosMot($datos);
            if (count($result)==0) {
                $result = Array();
            }
            $resp->data = $result;
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function completarDatosMot($datos)
    {
        foreach ($datos as $r => $v) {
            $result[$r]->idmotivobaja = $v['id'];
            $result[$r]->id = $v['id'];
            $result[$r]->denominacion = $v['denominacion'];
            $result[$r]->text = $v['denominacion'];
            $result[$r]->descripcion = $v['descripcion'];
            $result[$r]->_parent = ($v['idpadre'] == $v['id'])?null:$v['idpadre'];
            $result[$r]->fdesde = $v['fdesde'];
            $result[$r]->fhasta = $v['fhasta'];
            $result[$r]->gestion = $v['gestion'];
            $result[$r]->fluctuacion = $v['fluctuacion'];
            $hijos = $this->_objMotivoBaja->getMotivosHijos($v['id']);
            if (count($hijos)== 0 && $v['idpadre'] != $v['id']) {
                $result[$r]->_is_leaf = true;
                $result[$r]->leaf = true;
            } else {
                $result[$r]->_is_leaf = false;
                $result[$r]->leaf = false;
            }
        }
        return $result;
    }

    public function addMotivo($denom, $fdesde, $fhasta, $descripcion, $idpadre, $fluctuacion)
    {
        try {
            $obj = new NomMotivobaja();
            $obj->denominacion = $denom;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->descripcion = $descripcion;
            $obj->fluctuacion = ($fluctuacion)?$fluctuacion:null;
            if (isset($idpadre)) {
                $obj->idpadre = $idpadre;
            }
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateMotivo($idmotivobaja, $denom, $fdesde, $fhasta, $des, $fluctuacion)
    {
        try {
            $obj = $this->_objMotivoBaja->getById($idmotivobaja);
            $existe = $this->_objMotivoBaja->existeDenom($denom);
            $c = count($existe);
            if ($c == 0 || $existe[0]['idmotivobaja'] == $idmotivobaja) {
                $obj->denominacion = $denom;
                $obj->fdesde = $fdesde;
                $obj->fluctuacion = ($fluctuacion)?$fluctuacion:null;
                if ($fhasta) {
                    $obj->fhasta = $fhasta;
                }
                $obj->descripcion = $des;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteMotivo($idmotivobaja)
    {
        try {
            $obj = $this->_objMotivoBaja->getById($idmotivobaja);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function existeDenom($denominacion)
    {
        return $this->_objMotivoBaja->existeDenom($denominacion);
    }

    public function getMotivoBaja()
    {
        try {
            $tmp = $this->_objMotivoBaja->getMotivosActivos();
            return $this->generateTree($tmp);
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function generateTree(array &$array, $idPadre = null, &$len = -1)
    {
        $treeFormat = array();
        $sd = 'Sin descripci&oacute;n';
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
                    $treeFormat[$lenght]['qtip'] = (empty($v['descripcion']))?$sd:$v['descripcion'];
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTree(
                        $array,
                        $v['idmotivobaja'],
                        $len
                    );
                    if (count($children) > 0) {
                        $treeFormat[$lenght]['children'] = $children;
                        $treeFormat[$lenght]['leaf'] = false;
                    } else {
                        $treeFormat[$lenght]['leaf'] = true;
                    }
                } else {
                    $cont++;
                }
            } else if ($v['idpadre'] == $idPadre && $v['idmotivobaja'] != $idPadre) {
                $treeFormat[$lenght] = $v;
                $treeFormat[$lenght]['expanded'] = false;
                $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                $treeFormat[$lenght]['qtip'] = (empty($v['descripcion']))?$sd:$v['descripcion'];
                array_splice($array, $cont, 1);
                $len--;
                $children = $this->generateTree($array, $v['idmotivobaja'], $len);
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