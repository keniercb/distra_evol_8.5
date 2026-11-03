<?php

class NomProcedenciasocialModel extends ZendExt_Model
{

    //$objhaircolor=> objeto  SocialOriginas
    protected $_objsocialorigin = null;

    function __construct()
    {
        $this->_objsocialorigin = new NomProcedenciasocial();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para obtener la SocialOrigin activos
     *
     * @param string $filtro
     * @param int $limit
     * @param int $start
     *
     * @return objectArray
     * @throws Exception
     */
    public function getActiveSocialOrigin($node, $denom, $fdesde, $fhasta)
    {
        try {
            if ($node) {
                $datos = NomProcedenciasocial::getProcedenciaHijos($node);
            } else {
                $datos = NomProcedenciasocial::getProcedenciaPadres(
                    $denom, $fdesde, $fhasta
                );
            }
            foreach ($datos as $r => $v) {
                $result[$r]->idprocedenciasocial = $v['id'];
                $result[$r]->id = $v['id'];
                $result[$r]->denominacion = $v['denominacion'];
                $result[$r]->text = $v['denominacion'];
                $result[$r]->descripcion = $v['descripcion'];
                $result[$r]->_parent = ($v['idpadre'] == $v['id'])?null:$v['idpadre'];
                $result[$r]->fdesde = $v['fdesde'];
                $result[$r]->fhasta = $v['fhasta'];
                $result[$r]->gestion = $v['gestion'];
                $hijos = NomProcedenciasocial::getProcedenciaHijos($v['id']);
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

    public function getProcedencia()
    {
        try {
            $tmp = NomProcedenciasocial::getProcedenciaAct();
            return NomProcedenciasocialModel::generateTree($tmp);
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
                if ($v['idprocedenciasocial'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = true;
                    $treeFormat[$lenght]['iconCls'] = 'package';
                    $treeFormat[$lenght]['qtip'] = (empty($v['descripcion']))?$sd:$v['descripcion'];
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = NomProcedenciasocialModel::generateTree($array, $v['idprocedenciasocial'], $len);
                    if (count($children) > 0) {
                        $treeFormat[$lenght]['children'] = $children;
                        $treeFormat[$lenght]['leaf'] = false;
                    } else {
                        $treeFormat[$lenght]['leaf'] = true;
                    }
                } else {
                    $cont++;
                }
            } else if ($v['idpadre'] == $idPadre && $v['idprocedenciasocial'] != $idPadre) {
                $treeFormat[$lenght] = $v;
                $treeFormat[$lenght]['expanded'] = false;
                $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                $treeFormat[$lenght]['qtip'] = (empty($v['descripcion']))?$sd:$v['descripcion'];
                array_splice($array, $cont, 1);
                $len--;
                $children = NomProcedenciasocialModel::generateTree($array, $v['idprocedenciasocial'], $len);
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
     * Funcion para adicionar un tipo de SocialOrigin
     *
     * @param object $objsocialorigin
     *
     * @return numeric
     */
    public function addSocialOrigin($denom, $fdesde, $fhasta, $des, $idpadre)
    {
        try {
            $obj = new NomProcedenciasocial();
            $obj->denominacion = $denom;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->descripcion = $des;
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
     * Funcion para modificar el tipo de  SocialOrigina
     *
     * @param numeric $idprocedenciasocial
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     *
     * @return boolean
     */
    public function modSocialOrigin($idps, $denom, $fdesde, $fhasta, $des)
    {
        try {
            if (!NomProcedenciasocial::findByIdOrDenom($denom, $idps)) {
                $objDomain = new NomProcedenciasocial();
                $result = $objDomain->modSocialOrigin(
                    $idps,
                    $denom,
                    $des,
                    $fdesde,
                    $fhasta
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
     * Funcion para elieminar el tipo de  SocialOrigin
     *
     * @param array $arrids
     *
     * @return type
     */
    public function delSocialOrigin($id)
    {
        try {
            $obj = new NomProcedenciasocial();
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

