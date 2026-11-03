<?php 
class NomMotivomovimientoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getMotivos($node, $denom, $fdesde, $fhasta)
    {
        try {
            if ($node) {
                $datos = NomMotivomovimiento::getMotivosHijos($node);
            } else {
                $datos = NomMotivomovimiento::getMotivosPadres(
                    $denom, $fdesde, $fhasta
                );
            }
            $result = $this->completarDatosMotM($datos);
            if (count($result)==0) {
                $result = Array();
            }
            $resp->data = $result;
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function completarDatosMotM($datos)
    {
        foreach ($datos as $r => $v) {
            $result[$r]->idmotivomovimiento = $v['id'];
            $result[$r]->id = $v['id'];
            $result[$r]->denominacion = $v['denominacion'];
            $result[$r]->text = $v['denominacion'];
            $result[$r]->descripcion = $v['descripcion'];
            $result[$r]->_parent = ($v['idpadre'] == $v['id'])?null:$v['idpadre'];
            $result[$r]->fdesde = $v['fdesde'];
            $result[$r]->fhasta = $v['fhasta'];
            $result[$r]->gestion = $v['gestion'];
            $hijos = NomMotivomovimiento::getMotivosHijos($v['id']);
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

    public function addMotivo($denom, $fdesde, $fhasta, $descripcion, $idpadre)
    {
        try {
            $obj = new NomMotivomovimiento();
            $obj->denominacion = $denom;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->descripcion = $descripcion;
            if (isset($idpadre)) {
                $obj->idpadre = $idpadre;
            }
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateMotivo($idmotivomov, $denom, $fdesde, $fhasta, $desc)
    {
        try {
            $obj = NomMotivomovimiento::getById($idmotivomov);
            $existe = NomMotivomovimiento::existeDenom($denom);
            $c = count($existe);
            if ($c == 0 || $existe[0]['denominacion'] == $obj->denominacion) {
                $obj->denominacion = $denom;
                $obj->fdesde = $fdesde;
                if ($fhasta) {
                    $obj->fhasta = $fhasta;
                }
                $obj->descripcion = $desc;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteMotivo($idmotivomovimiento)
    {
        try {
            $obj = NomMotivomovimiento::getById($idmotivomovimiento);
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
        return NomMotivomovimiento::existeDenom($denominacion);
    }

    public function getMotivoMovimiento()
    {
        try {
            $tmp = NomMotivomovimiento::getMotivosActivos();
            return NomMotivomovimientoModel::generateTree($tmp);
        } catch (Exception $e) {
            throw $e;
        }
    }
    public function getDenomById($idmotivomovimiento)
    {
        try {
            $tmp = NomMotivomovimiento::getDenomById($idmotivomovimiento);
            return $tmp;
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
                if ($v['idmotivomovimiento'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = true;
                    $treeFormat[$lenght]['iconCls'] = 'package';
                    $treeFormat[$lenght]['qtip'] = (empty($v['descripcion']))?$sd:$v['descripcion'];
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = NomMotivomovimientoModel::generateTree($array, $v['idmotivomovimiento'], $len);
                    if (count($children) > 0) {
                        $treeFormat[$lenght]['children'] = $children;
                        $treeFormat[$lenght]['leaf'] = false;
                    } else {
                        $treeFormat[$lenght]['leaf'] = true;
                    }
                } else {
                    $cont++;
                }
            } else if ($v['idpadre'] == $idPadre && $v['idmotivomovimiento'] != $idPadre) {
                $treeFormat[$lenght] = $v;
                $treeFormat[$lenght]['expanded'] = false;
                $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                $treeFormat[$lenght]['qtip'] = (empty($v['descripcion']))?$sd:$v['descripcion'];
                array_splice($array, $cont, 1);
                $len--;
                $children = NomMotivomovimientoModel::generateTree($array, $v['idmotivomovimiento'], $len);
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