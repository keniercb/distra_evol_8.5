<?php

class NomCausaaccidenteModel extends ZendExt_Model
{

    protected $_objcausaaccidente = null;

    function __construct()
    {
        $this->_objcausaaccidente = new NomCausaaccidente();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener las causas de accidentes activas
     * 
     * @return objectArray
     * @throws Exception
     */
    public function getActiveCausas($node, $denom, $fdesde, $fhasta)
    {
        try {
            if ($node) {
                $datos = NomCausaaccidente::getCausaHijos($node);
            } else {
                $datos = NomCausaaccidente::getCausaPadres($denom, $fdesde, $fhasta);
            }
            foreach ($datos as $r => $v) {
                $result[$r]->idcausaaccidente = $v['id'];
                $result[$r]->id = $v['id'];
                $result[$r]->denominacion = $v['denominacion'];
                $result[$r]->text = $v['denominacion'];
                $result[$r]->descripcion = $v['descripcion'];
                $result[$r]->_parent = ($v['idpadre'] == $v['id'])?null:$v['idpadre'];
                $result[$r]->fdesde = $v['fdesde'];
                $result[$r]->fhasta = $v['fhasta'];
                $result[$r]->gestion = $v['gestion'];
                $hijos = NomCausaaccidente::getCausaHijos($v['id']);
                if (count($hijos)== 0 && $v['idpadre'] != $v['id']) {
                    $result[$r]->_is_leaf = true;
                    $result[$r]->leaf = true;
                } else {
                    $result[$r]->_is_leaf = false;
                    $result[$r]->leaf = false;
                }
            }
            if (count($result)==0) {
                $result = Array();
            }
            $resp->data = $result;
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCausa()
    {
        try {
            $tmp = NomCausaaccidente::getCausaAct();
            return NomCausaaccidenteModel::generateTree($tmp);
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function generateTree(array &$array, $idPadre = null, &$len = -1)
    {
        $treeFormat = array();
        $len = isset($len) && $len >= 0 ? $len : count($array);
        $cont = 0;
        while ($len > $cont) {
            $v = $array[$cont];
            $lenght = count($treeFormat);
            if (empty($idPadre)) {
                if ($v['idcausaaccidente'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = true;
                    $treeFormat[$lenght]['iconCls'] = 'package';
                    if (empty($v['descripcion'])) {
                        $treeFormat[$lenght]['qtip'] = 'Sin descripci&oacute;n';
                    } else {
                        $treeFormat[$lenght]['qtip'] = $v['descripcion'];
                    }
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = NomCausaaccidenteModel::generateTree($array, $v['idcausaaccidente'], $len);
                    if (count($children) > 0) {
                        $treeFormat[$lenght]['children'] = $children;
                        $treeFormat[$lenght]['leaf'] = false;
                    } else {
                        $treeFormat[$lenght]['leaf'] = true;
                    }
                } else {
                    $cont++;
                }
            } else if ($v['idpadre'] == $idPadre && $v['idcausaaccidente'] != $idPadre) {
                $treeFormat[$lenght] = $v;
                $treeFormat[$lenght]['expanded'] = false;
                $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                $treeFormat[$lenght]['qtip'] = (empty($v['descripcion']))?'Sin descripci&oacute;n':$v['descripcion'];
                array_splice($array, $cont, 1);
                $len--;
                $children = NomCausaaccidenteModel::generateTree($array, $v['idcausaaccidente'], $len);
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

    /**
     * Funcion para adicionar una causa de accidente
     */
    public function addCausa($denominacion, $fdesde, $fhasta, $descripcion, $idpadre)
    {
        try {
            $obj = new NomCausaaccidente();
            $obj->denominacion = $denominacion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->descripcion = $descripcion;
            if ($idpadre) {
                $obj->idpadre = $idpadre;
            }
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    /**
     * Funcion para modificar la causa de accidente
     *
     * @param numeric $idcausaaccidente
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modCausa($idcausaaccidente, $denominacion, $fdesde, $fhasta, $descripcion)
    {
        try {
            if (!NomCausaaccidente::findByIdOrDenom($denominacion, $idcausaaccidente)) {
                $objDomain = new NomCausaaccidente();
                $result = $objDomain->modCausa(
                    $idcausaaccidente, $denominacion, $descripcion, $fdesde, $fhasta
                );
                if ($result) {
                    return $result;
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
     * Funcion para eliminar causa de accidente
     *
     */
    public function delCausa($id)
    {
        try {
            $obj = new NomCausaaccidente();
            $objProc = $obj->getById($id);
            $objProc->delete();
            return true;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r['exception'] = 1;
                return $r;
            } else {
                return (json_encode($e->getMessage()));
            }
        }
    }

}

