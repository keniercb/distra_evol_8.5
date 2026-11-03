<?php

class NomEstructransportacionModel extends ZendExt_Model
{
    protected $objTrans;

    protected $response;

    function __construct()
    {
        $this->objTrans = new NomEstructransportacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }
    

    public function getEstrucTransportacion($activo = true)
    {

        try {
            $tmp = $this->objTrans->getEstrucTransportacion($activo);
            //  print_r($tmp);die;
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
                if ($v['idestructuratransportacion'] == $v['idpadre']) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = true;
                    $treeFormat[$lenght]['iconCls'] = 'package';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idestructuratransportacion'], $len);
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
                if ($v['idpadre'] == $idPadre && $v['idestructuratransportacion'] != $idPadre) {
                    $treeFormat[$lenght] = $v;
                    $treeFormat[$lenght]['expanded'] = false;
                    $treeFormat[$lenght]['iconCls'] = 'tag_blue';
                    array_splice($array, $cont, 1);
                    $len--;
                    $children = $this->generateTreeModo($array, $v['idestructuratransportacion'], $len);
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
            $tmp = $this->objTrans->getCategoriasPadre($activo);

            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addModo($objTrans)
    {
        try {
            if (!$this->objTrans->findByIdOrDenom($objTrans->denominacion, null, $objTrans->idpadre)) {
                $obj = new NomEstructransportacion();
                foreach ($objTrans as $k => $v) {
                    $obj->$k = $v;
                }
                if (empty($objTrans->idpadre)) {
                    $obj->idpadre = $this->objTrans->getIncremented();
                }
                $obj->save();

                return $obj->idestructuratransportacion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }


    public function modEstrucTransportacion($idestructuratransportacion, $values)
    {
        try {
            if (!empty($idestructuratransportacion)) {
                $this->objTrans->modEst($idestructuratransportacion, $values->denominacion, $values->fdesde, $values->fhasta);
                return true;
            } else {
                return false;
            }
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    public function delEstrucTransportacion($arrids)
    {
        try {
            $query = Doctrine_Query::create()->delete('NomEstructransportacion')->whereIn('idestructuratransportacion', $arrids);
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

    public function getRutaTransportacion($idestructuratransportacion, $ruta)
    {
        $objModel = new NomEstructransportacion();
        $datosnodo = $objModel->getById(array($idestructuratransportacion));
        if ($datosnodo[0]['idestructuratransportacion'] == $datosnodo[0]['idpadre']) {
            array_push($ruta, $datosnodo[0]['denominacion']);
            return $ruta;
        } else {
            $ruta = $this->getRutaTransportacion($datosnodo[0]['idpadre'], $ruta);
            array_push($ruta, $datosnodo[0]['denominacion']);
        }
        // print_r($ruta);die;
        return $ruta;
    }
}



