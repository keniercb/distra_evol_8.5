<?php

class NomEstrucalimentacionModel extends ZendExt_Model
{
    protected $objE;
    protected $response;

    function __construct()
    {
        $this->objE = new NomEstrucalimentacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getEstrucAlimentacion($filtro, $limit, $start,$value)
    {
        try {
            $response->data = $this->objE->getEstrucAlimentacion($filtro, $limit, $start,$value);
            print_r($response->data);die;
            $response->quantity = $this->objE->getCantgetEstrucAlimentacion($filtro);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function  addAsiganacionDefensa($objAsi)
    {
        try {
            if (!$this->objE->findByIdOrDenomadd($objAsi->denominacion)) {
                $obj = new NomEstrucalimentacion();
                foreach ($objAsi as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idestructuraalimentacion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modEstrucAlimentacion($idestructuraalimentacion, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!$this->obj->findByIdOrDenom($denominacion, $idestructuraalimentacion)) {
                $result = $this->obj->modAsiganacionDefensa(
                    $idestructuraalimentacion, $denominacion, $descripcion, $fdesde, $fhasta
                );
            } else {
                throw new Exception('La estructura de alimentacion que quiere modificar ya existe.', 3);
            }

            return $result;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function delEstrucAlimentacion($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstrucalimentacion');
            if (is_array($arrids)) {
                $query->whereIn('idestructuraalimentacion', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idestructuraalimentacion = ?', $arrids);
            }
            $result = $query->execute();
            if ($result->delete()) {
                $r['exception'] = 0;
            }

            return $r;
            // return $query->execute()->delete();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) { //Code for foreignKeyViolation
                $r['exception'] = 1;

                return $r;
            } else {
                throw $e;
            }
        }
    }
}

