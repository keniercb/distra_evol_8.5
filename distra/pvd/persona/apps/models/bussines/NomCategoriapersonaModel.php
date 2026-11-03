<?php

class NomCategoriapersonaModel extends ZendExt_Model
{
    protected $objCategoria;

    protected $response;

    function __construct()
    {
        $this->objCategoria = new NomCategoriapersona();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function addCategorias($data)
    {
        try {
            if (count($data) > 0 && !$this->objCategoria->verifExiste($data['denominacion'])) {
                $collection = new NomCategoriapersona();
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

    public function modCategorias($idcategoriapersona, $values)
    {
        try {
            if (count($values) > 0 && !empty($idcategoriapersona)) {
                $collection = $this->objCategoria->getById($idcategoriapersona);
              
                if (count($collection) > 0) {
                    foreach ($values as $k => $val) {
                        $collection[0][$k] = $val;
                    }
                    if ($collection[0]->isModified()) {
                        $collection[0]->save();

                        return true;
                    }
                }
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    public function delCategorias(array $id)
    {
        try {
            if (count($id) > 0) {
                $this->objCategoria->delCategorias($id);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCategorias($activo = true)
    {
        try {
            $tmp = $this->objCategoria->getCategorias($activo);

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
                if ($v['idcategoriapersona'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = true;
                    $treeFormat[$lenght]['iconCls'] = 'package';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idcategoriapersona'], $len);
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
                if ($v['idpadre'] == $idPadre && $v['idcategoriapersona'] != $idPadre) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = false;
                    $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idcategoriapersona'], $len);
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

    public function getCategoriasPadres($activo = true)
    {
        try {
            $tmp = $this->objCategoria->getCategoriasPadre($activo);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addModo($objCategoria)
    {
        try {
            if (!$this->objCategoria->findByIdOrDenom($objCategoria->denominacion, null, $objCategoria->idpadre)) {
                $obj = new NomCategoriapersona();
                foreach ($objCategoria as $k => $v) {
                    $obj->$k = $v;
                }
                if (empty($objCategoria->idpadre)) {
                    $obj->idpadre = $this->objCategoria->getIncremented();
                }
                $obj->save();

                return $obj->idcategoriapersona;
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
            $query = Doctrine_Query::create()->delete('NomCategoriapersona')->whereIn('idcategoriapersona', $arrids);
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
}

