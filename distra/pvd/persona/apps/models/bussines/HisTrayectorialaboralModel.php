<?php
class HisTrayectorialaboralModel extends ZendExt_Model
{
    protected $objTrayectoriaLaboral;

    function __construct()
    {
		
        $this->objTrayectoriaLaboral = new HisTrayectorialaboral();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTrayectoriaLaboralByPersona($idpersona)
    {
        try {
            $tmp = new StdClass();
            $tmp->data = $this->objTrayectoriaLaboral->getTrayectoriaLaboralByPersona($idpersona);
            foreach ($tmp->data as $key=> $datos) {
                if (!$datos['fbaja']) {
                    $tmp->data[$key]['fbaja']='';
                }
            }
            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTrayectoriaLaboralGetSituacionLab($idpersona)
    {
        try {
            $tmp = new StdClass();
            $tmp->data = $this->objTrayectoriaLaboral->getTrayectoriaLaboralGetSituacionLab($idpersona);
            foreach ($tmp->data as $k => $val) {
                if ($val['estado'] == 1 || $val['estado'] == 2) {
                    $motivo = $this->objTrayectoriaLaboral->getMotivoBajaSituacionLabById($val['idsituacionlaboralp'], $val['estado']);
                    $tmp->data[$k]['denominacion'] = $motivo[0]['motivo'];
                } else {
                    $tmp->data[$k]['denominacion'] = '';
                    if (!$val['fbaja']) {
                        $tmp->data[$k]['fbaja']='';
                    }
                }
            }
            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addTrayectoriaLaboral(array $data, $idpersona)
    {
		 try {
            $collection = new Doctrine_Collection('HisTrayectorialaboral');
            foreach ($data as $p => $array) {
                foreach ($array as $k => $v) {
                    $collection[$p][$k] = $v;
                }
                $collection[$p]['idpersona'] = $idpersona;
            }
            $collection->save();
		 } catch (Doctrine_Collection_Exception $e) {
		     throw $e;
		 }
    }

    public function modTrayectoriaLaboral(array $data, array $ids)
    {
        try {
            if (count($data) > 0 && count($ids) > 0) {
                $collection = $this->objTrayectoriaLaboral->getById($ids);
                if (count($collection) > 0) {
                    foreach ($collection as $p => $v) {
                        foreach ($data[$v->idtrayectorialaboral] as $k => $val) {
                            $collection[$p]->$k = $val;
                        }
                    }
                    if ($collection->isModified()) {
                        $collection->save();
                    }
                }
            }
        } catch (Doctrine_Collection_Exception $e) {
            throw $e;
        }
    }

    public function delTrayectoriaLaboral(array $data, $idpersona)
    {
        try {
            if (count($data) > 0) {
                $this->objTrayectoriaLaboral->delTrayectoriaLaboral($data, $idpersona);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }

    public function getEntidad()
    {
        try {
            $datos=HisTrayectorialaboral::getEntidad();
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getDenomEntidad($orgentidad)
    {
        try {
            $datos=HisTrayectorialaboral::getDenomEntidad($orgentidad);
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function obtenerCategoriaOcupacional()
    {
        try {
            $trayectoriaLaboral = new HisTrayectorialaboral();
            return $trayectoriaLaboral->obtenerCategOcupacional();
        } catch (Exception $e) {
            throw $e;
        }
    }
}