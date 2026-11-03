<?php

class NomestructalojamientoModel extends ZendExt_Model
{
    protected $objAloj;

    protected $response;

    function __construct()
    {
        $this->objAloj = new Nomestructalojamiento();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }


    public function getEstructAlojamiento($activo = true)
    {
        try {
            $tmp = $this->objAloj->getEstructAlojamiento($activo);
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
            //  print_r($v);die;
            $lenght = count($treeFormat);
            if (empty($idPadre)) {
                $treeFormat[$lenght] = $v['denompadre'];
                if ($v['idestructuraalojamiento'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    // $treeFormat[$lenght] = $v['denompadre'];
                    $treeFormat[$lenght]['expanded'] = true;
                    $treeFormat[$lenght]['iconCls'] = 'package';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idestructuraalojamiento'], $len);
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
                if ($v['idpadre'] == $idPadre && $v['idestructuraalojamiento'] != $idPadre) {
                    $treeFormat[$lenght] = $v['denompadre'];
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = false;
                    $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idestructuraalojamiento'], $len);
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
            $tmp = $this->objAloj->getCategoriasPadre($activo);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addEstructAlojamiento($objAloj)
    {
        try {
            if (!$this->objAloj->findByIdOrDenom($objAloj->denominacion, null, $objAloj->idpadre)) {
                $obj = new Nomestructalojamiento();
                foreach ($objAloj as $k => $v) {
                    $obj->$k = $v;
                }
                if (empty($objAloj->idpadre)) {
                    $obj->idpadre = $this->objAloj->getIncremented();
                }
                $obj->save();

                return $obj->idestructuraalojamiento;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }


    public function modEstructAlojamiento($idestructuraalojamiento, $values)
    {
        try {
            if (!empty($idestructuraalojamiento)) {
                $this->objAloj->modEst(
                    $idestructuraalojamiento, $values->denominacion, $values->fdesde, $values->fhasta
                );
                return true;
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    public function delEstructAlojamiento($arrids)
    {
        //  print_r($arrids);die;
        try {
            $query = Doctrine_Query::create()->delete('Nomestructalojamiento')->whereIn('idestructuraalojamiento', $arrids);
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

    public function getRutaAlojamiento($idestructuraalojamiento, $ruta)
    {

        $objModel = new Nomestructalojamiento();
        $datosnodo = $objModel->getById(array($idestructuraalojamiento));

        if ($datosnodo[0]['idestructuraalojamiento'] == $datosnodo[0]['idpadre']) {
            array_push($ruta, $datosnodo[0]['denominacion']);
            return $ruta;
        } else {
            $ruta = $this->getRutaAlojamiento($datosnodo[0]['idpadre'], $ruta);
            array_push($ruta, $datosnodo[0]['denominacion']);
        }
        return $ruta;
    }


}

