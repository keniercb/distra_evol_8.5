<?php

class NomcargodefensaModel extends ZendExt_Model
{
    protected $objCar;
    protected $response;

    function __construct()
    {
        $this->objCar = new Nomcargodefensa();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCargoDefensa($filtro, $limit, $start,$value)
    {
        try {
            $response->data = $this->objCar->getCargoDefensa($filtro, $limit, $start,$value);
            $response->quantity = $this->objCar->getCantgetCargoDefensa($filtro);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

   public function addCargoDefensa($objCa)
    {
        try {
            if (!$this->objCar->findByIdOrDenomadd($objCa->denominacion)) {
                $obj = new Nomcargodefensa();
                foreach ($objCa as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idcargodefensa;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modCargoDefensa($idcargodefensa, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!$this->objCar->findByIdOrDenom($denominacion, $idcargodefensa)) {
                $result = $this->objCar->modCargoDefensa(
                    $idcargodefensa, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
                );
            } else {
                throw new Exception('El cargo en la defensa que quiere modificar ya existe.', 3);
            }

            return $result;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function delCargoDefensa($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('Nomcargodefensa');
            if (is_array($arrids)) {
                $query->whereIn('idcargodefensa', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idcargodefensa = ?', $arrids);
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

