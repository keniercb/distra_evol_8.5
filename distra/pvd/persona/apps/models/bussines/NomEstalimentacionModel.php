<?php

class NomEstalimentacionModel extends ZendExt_Model
{
    protected $_objestalim = null;

    function __construct()
    {
        $this->_objestalim = new NomEstalimentacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getEstAlimentacionActivas($filtro, $limit, $start)
    {
        try {
            $tmp->data = $this->_objestalim->getEstAlimentacionActivas($filtro, $limit, $start);
            $tmp->quantity = $this->_objestalim->getCantActivas($filtro);
            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addEstAlimentacion($objEstAlim)
    {
      //  print_r($objEstAlim);die;
       // try {
            $objDomain = new NomEstalimentacion();
            if (!$objDomain->findByIdOrDenomadd($objEstAlim->denominacion)) {
                $obj = new NomEstalimentacion();
                foreach ($objEstAlim as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();
                return $obj->idestalimentacion;
            } else {
                return false;
            }
       /* } catch (Exception $e) {
            echo $e->getTraceAsString();
        }*/
    }

    public function modEstAlimentacion($idestalimentacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomEstalimentacion::findByIdOrDenom($denominacion, $idestalimentacion)) {
                $objDomain = new NomEstalimentacion();
                $result = $objDomain->modEstAlimentacion($idestalimentacion, $denominacion, $abreviatura, $descripcion, $fdesde,
                    $fhasta);
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

    public function delEstAlimentacion($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstalimentacion');
            if (is_numeric($arrids)) {
                $query->where('idestalimentacion = ?', $arrids);
            }
            $result = $query->execute();
            if ($result->delete()) {
                $r['exception'] = 0;
            }
            return $r;
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