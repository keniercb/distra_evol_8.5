<?php

class NomTipoestanciaexteriorModel extends ZendExt_Model
{
    protected $_objTipoEstanciaExterior;

    function __construct()
    {
        $this->_objTipoEstanciaExterior = new NomTipoestanciaexterior();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTipoEstanciaExteriorActivos($filtro, $limit, $start)
    {
        try {
            $response = new StdClass();
            $response->data = $this->_objTipoEstanciaExterior->getTipoEstanciaExteriorActivos($filtro, $limit, $start);
            $response->quantity = ($limit > 0) ? $this->_objTipoEstanciaExterior->getCantTipoEstanciaExteriorActivos(
                $filtro
            ) : count($response->data);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addTipoEstanciaExterior($objTipoEstanciaExterior)
    {
        try {
            if (!$this->_objTipoEstanciaExterior->findByIdOrDenomadd($objTipoEstanciaExterior->denominacion)) {
                $obj = new NomTipoestanciaexterior();
                foreach ($objTipoEstanciaExterior as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idtipoestanciaexterior;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modTipoEstanciaExterior($idtipoestanciaexterior, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!NomTipoestanciaexterior::findByIdOrDenom($denominacion, $idtipoestanciaexterior)) {
                $result = $this->_objTipoEstanciaExterior->modTipoEstanciaExterior(
                    $idtipoestanciaexterior, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
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
            throw $exc;
        }
    }

    public function delTipoEstanciaExterior($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomTipoestanciaexterior');
//            if (is_array($ids)) {
//                $query->whereIn('idtipoestanciaexterior', $arrids);
//            } else
            if (is_numeric($arrids)) {
                $query->where('idtipoestanciaexterior = ?', $arrids);
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
        /* try {
             $query = Doctrine_Query::create();
             $query->from('NomTipoestanciaexterior');
             if (is_array($arrids)) {
                 $query->whereIn('idtipoestanciaexterior', $arrids);
             } elseif (is_numeric($arrids)) {
                 $query->where('idtipoestanciaexterior = ?', $arrids);
             }
             return $query->execute()->delete();
         } catch (Doctrine_Exception $e) {
             if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                 $r->exception = 1;
                 return $r;
             } else {
                 throw $e;
             }
         }*/
    }
}

