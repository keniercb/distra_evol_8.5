<?php

class NomSituacexcepModel extends ZendExt_Model
{
    protected $objAsigdefensa;
    protected $response;

    function __construct()
    {
        $this->obj = new NomSituacexcep();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getSituacExcep($filtro, $limit, $start,$value)
    {
       // print_r($filtro);die;
        try {
            $response->data = $this->obj->getSituacExcep($filtro, $limit, $start,$value);
            $response->quantity = $this->obj->getCantSituacExcep($filtro);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function  addSituacExcep($objAsi)
    {
        try {

            if (!$this->obj->findByIdOrDenomadd($objAsi->denominacion)) {
                $obj = new NomSituacexcep();
                foreach ($objAsi as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idsituacexcep;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modSituacExcep($idsituacexcep, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!$this->obj->findByIdOrDenom($denominacion, $idsituacexcep)) {
                $result = $this->obj->modSituacExcep(
                    $idsituacexcep, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
                );
            } else {
                throw new Exception('La situaci�n excepcional que quiere modificar ya existe.', 3);
            }

            return $result;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function delSituacExcep($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomSituacexcep');
            if (is_array($arrids)) {
                $query->whereIn('idsituacexcep', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idsituacexcep = ?', $arrids);
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

