<?php

/**
 * Class DatProyectorolModel
 */
class DatProyectorolModel extends ZendExt_Model
{
    /**
     * @var DatProyectorol
     */
    protected $objDatProjectRol;
    /**
     * @var DatProyectoconceptoModel
     */
    protected $objDatProjectConcept;

    /**
     *
     */
    function __construct()
    {
        $this->objDatProjectRol = new DatProyectorol();
        $this->objDatProjectConcept = new DatProyectoconceptoModel();
    }

    /**
     *
     */
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $idrol
     * @param $idproject
     *
     * @return array
     * @throws Exception
     */
    public function getTreeConceptByRolToCompartimentacion($idrol, $idproject)
    {
        try {
            $tree = $this->objDatProjectConcept->getTreeConceptByRol($idrol, $idproject);

            return $this->generateTreeConceptByRol($tree);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $array
     * @param       $idPadre
     *
     * @return array
     */
    private function generateTreeConceptByRol(array $array, $idPadre = null)
    {
        $treeFormat = array();
        $len = count($array);
        $cont = 0;
        while ($len > $cont) {
            $v = $array[$cont];
            $lenght = count($treeFormat);
            if (empty($idPadre)) {
                if ($v['idproyectoconcepto'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = true;
                    $treeFormat[$lenght]['uiProvider'] = 'col';
                    $array[$cont] = array_pop($array);
                    $len--;
                    $treeFormat[$lenght]['children'] = $this->generateTreeConceptByRol($array, $v['idproyectoconcepto']);
                } else {
                    $cont++;
                }
            } else {
                if ($v['idpadre'] == $idPadre && $v['idproyectoconcepto'] != $idPadre) {
                    $prop = json_decode($v['propiedades']);
                    if ($prop->xtype != 'hidden') {
                        $treeFormat[$lenght] = $v;
                        $treeFormat[$lenght]['expanded'] = false;
                        $treeFormat[$lenght]['uiProvider'] = 'col';
                        switch ($v['tipo']) {
                            case 1:
                                $treeFormat[$lenght]['visibilidad'] = array(
                                    'checked' => $v['activo'] == 1 ? true : false);
                                $treeFormat[$lenght]['obligatorio'] = array(
                                    'checked' => $v['oblig'] == 1 ? true : false);
                                $treeFormat[$lenght]['add'] = array(
                                    'checked' => (bool)$v['add']);
                                $treeFormat[$lenght]['mod'] = array(
                                    'checked' => (bool)$v['mod']);
                                $treeFormat[$lenght]['del'] = array(
                                    'checked' => (bool)$v['del']);
                                $treeFormat[$lenght]['leaf'] = false;
                                break;
                            case 3:
                                $disabled = $prop->allowBlank === 'false' ? true : false;
                                $treeFormat[$lenght]['disabled'] = $disabled;
                                if ($disabled) { //si es obligatorio por default
                                    $checked = true;
                                } else {
                                    if (isset($v['activo'])) { //Si es valido
                                        $checked = $v['activo'] ? true : false;
                                    } elseif ($prop->hidden === 'false') { //Si es visible el campo por default
                                        $checked = true;
                                    } else {
                                        $checked = false;
                                    }
                                }
                                $treeFormat[$lenght]['visibilidad'] = array(
                                    'disabled' => $disabled, 'checked' => $checked);
                                if ($disabled) {
                                    $checked = true;
                                } elseif (isset($v['oblig'])) {
                                    $checked = ($v['oblig'] == 1) ? true : false;
                                } else {
                                    $checked = false;
                                }
                                $treeFormat[$lenght]['obligatorio'] = array(
                                    'disabled' => $disabled, 'checked' => $checked);
                                $treeFormat[$lenght]['leaf'] = true;
                                break;
                            default:
                                break;
                        }
                        $array[$cont] = array_pop($array);
                        $len--;
                        $treeFormat[$lenght]['children'] = $this->generateTreeConceptByRol($array, $v['idproyectoconcepto']);
                    } else {
                        $array[$cont] = array_pop($array);
                        $len--;
                    }
                } else {
                    $cont++;
                }
            }
        }

        return $treeFormat;
    }

    /**
     * @param array $arrAdd
     * @param array $ids
     * @param array $arrMods
     * @param       $idrol
     *
     * @throws Doctrine_Collection_Exception
     * @throws Exception
     */
    public function updateCompartimentacionByRol(array $arrAdd, array $ids, array $arrMods, $idrol)
    {
        try {
            if ((count($arrAdd) > 0 || count($arrMods) > 0) && !empty($idrol)) {
                $collection = $this->objDatProjectRol->getById($ids);
                if (count($collection) > 0) { //Si se van a modificar datos
                    foreach ($collection as $p => $v) {
                        foreach ($arrMods[$v->idproyectorol] as $k => $val) {
                            $collection[$p]->$k = $val;
                        }
                        $collection[$p]->idrol = $idrol;
                    }
                } else { //Creo el collection para adicionar los datos
                    $collection = new Doctrine_Collection('DatProyectorol');
                }
                foreach ($arrAdd as $k => $val) {
                    $p = count($collection);
                    $collection[$p]['idproyectoconcepto'] = $val['idproyectoconcepto'];
                    $collection[$p]->activo = $val['activo'];
                    $collection[$p]->obligatorio = $val['obligatorio'];
                    $collection[$p]->add = $val['add'];
                    $collection[$p]->mod = $val['mod'];
                    $collection[$p]->del = $val['del'];
                    $collection[$p]->idrol = $idrol;
                }
                if ($collection->isModified()) {
                    $collection->save();
                }
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $idrol
     * @param $idproject
     *
     * @return array
     * @throws Exception
     */
    public function getTreeConceptByRol($idrol, $idproject)
    {
        try {
            $tree = $this->objDatProjectConcept->getTreeConceptByRol($idrol, $idproject);

            return $this->generateTreeByCompartimentacion($tree);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param array $array
     * @param       $idPadre
     *
     * @return array
     */
    public function generateTreeByCompartimentacion(array $array, $idPadre = null, $add = 0, $mod = 0, $del = 0)
    {
        $treeFormat = array();
        $len = count($array);
        $cont = 0;
        while ($len > $cont) {
            $v = $array[$cont];
            $v['codigo'] = null;
            $lenght = count($treeFormat);
            if (empty($idPadre)) {
                if ($v['idproyectoconcepto'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = true;
                    $array[$cont] = array_pop($array);
                    $len--;
                    $children = $this->generateTreeByCompartimentacion($array, $v['idproyectoconcepto']);
                    if (count($children) > 0) {
                        $treeFormat[$lenght]['children'] = $children;
                    } else {
                        array_pop($treeFormat);
                    }
                } else {
                    $cont++;
                }
            } else {
                if ($v['idpadre'] == $idPadre && $v['idproyectoconcepto'] != $idPadre) {
                    switch ($v['tipo']) {
                        case 1: //Si es un concepto
                            if ($v['activo'] == 1) { //Solo si es visible los cargo
                                $treeFormat[$lenght] = $v;
                                $treeFormat[$lenght]['expanded'] = false;
                                $treeFormat[$lenght]['leaf'] = true;
                                if ($v['oblig']) {
                                    $treeFormat[$lenght]['obligatorio'] = $v['oblig'];
                                } else {
                                    $treeFormat[$lenght]['obligatorio'] = false;
                                    $treeFormat[$lenght]['checked'] = false;
                                }
                                $array[$cont] = array_pop($array);
                                $len--;
                                $treeFormat[$lenght]['children'] = $this->generateTreeByCompartimentacion(
                                    $array, $v['idproyectoconcepto'], $v['add'], $v['mod'], $v['del']
                                );
                            } else {
                                $array[$cont] = array_pop($array);
                                $len--;
                            }
                            break;
                        case 3:
                            $treeFormat[$lenght] = $v;
                            $treeFormat[$lenght]['expanded'] = false;
                            $prop = json_decode($v['propiedades']);
                            $disabled = $prop->allowBlank === 'false' ? true : false;
                            if (!$disabled) {
                                if (isset($v['activo'])) {
                                    $prop->hidden = ($v['activo'] == 0) ? 'true' : 'false';
                                    if (isset($v['oblig'])) {
                                        $prop->allowBlank = ($v['oblig'] == 0) ? 'true' : 'false';
                                    }
                                }
                            }
                            $treeFormat[$lenght]['propiedades'] = json_encode($prop);
                            $treeFormat[$lenght]['add'] = $add;
                            $treeFormat[$lenght]['mod'] = $mod;
                            $treeFormat[$lenght]['del'] = $del;
                            $array[$cont] = array_pop($array);
                            $len--;
                            $treeFormat[$lenght]['children'] = $this->generateTreeByCompartimentacion(
                                $array, $v['idproyectoconcepto'], $add, $mod, $del
                            );
                            break;
                        default:
                            $treeFormat[$lenght] = $v;
                            $treeFormat[$lenght]['expanded'] = false;
                            $treeFormat[$lenght]['add'] = $add;
                            $treeFormat[$lenght]['mod'] = $mod;
                            $treeFormat[$lenght]['del'] = $del;
                            $array[$cont] = array_pop($array);
                            $len--;
                            $treeFormat[$lenght]['children'] = $this->generateTreeByCompartimentacion(
                                $array, $v['idproyectoconcepto'], $add, $mod, $del
                            );
                            break;
                    }
                } else {
                    $cont++;
                }
            }
        }

        return $treeFormat;
    }
}

