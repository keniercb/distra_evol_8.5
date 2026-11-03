<?php

class NomAsigdefensaModel extends ZendExt_Model
{
    protected $objAsigdefensa;
    protected $response;

    function __construct()
    {
        $this->obj = new NomAsigdefensa();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAsiganacionDefensa($filtro, $limit, $start,$value)
    {
        try {
            $response->data = $this->obj->getAsiganacionDefensa($filtro, $limit, $start,$value);
            $response->quantity = $this->obj->getCantgetAsiganacionDefensa($filtro);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function  addAsiganacionDefensa($objAsi)
    {
        try {
            if (!$this->obj->findByIdOrDenomadd($objAsi->denominacion)) {
                $obj = new NomAsigdefensa();
                foreach ($objAsi as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idasignaciondefensa;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modAsiganacionDefensa($idasignaciondefensa, $denominacion, $abreviatura, $descripcion, $fdesde,
        $fhasta)
    {
        try {
            if (!$this->obj->findByIdOrDenom($denominacion, $idasignaciondefensa)) {
                $result = $this->obj->modAsiganacionDefensa(
                    $idasignaciondefensa, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
                );
            } else {
                throw new Exception('La asignaci&oacute;n en la defensa que quiere modificar ya existe.', 3);
            }

            return $result;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function delAsiganacionDefensa($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomAsigdefensa');
            if (is_array($arrids)) {
                $query->whereIn('idasignaciondefensa', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idasignaciondefensa = ?', $arrids);
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

