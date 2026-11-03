<?php

class NomCargoexcepModel extends ZendExt_Model
{
    protected $objAsigdefensa;
    protected $response;

    function __construct()
    {
        $this->obj = new NomCargoexcep();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCargoExcep($filtro, $limit, $start,$value)
    {
        try {
            $response->data = $this->obj->getCargoExcep($filtro, $limit, $start,$value);
            $response->quantity = $this->obj->getCantCargoExcep($filtro);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function  addCargoExcep($objAsi)
    {
        try {

            if (!$this->obj->findByIdOrDenomadd($objAsi->denominacion)) {
                $obj = new NomCargoexcep();
                foreach ($objAsi as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idcargoexcep;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modCargoExcep($idcargoexcep, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!$this->obj->findByIdOrDenom($denominacion, $idcargoexcep)) {
                $result = $this->obj->modCargoExcep(
                    $idcargoexcep, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
                );
            } else {
                throw new Exception('El cargo de la situaci�n excepcional que quiere modificar ya existe.', 3);
            }

            return $result;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function delCargoExcep($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomCargoexcep');
            if (is_array($arrids)) {
                $query->whereIn('idcargoexcep', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idcargoexcep = ?', $arrids);
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

