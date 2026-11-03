<?php

class NomAseoModel extends ZendExt_Model
{
    protected $objAseo;
    protected $response;

    function __construct()
    {
        $this->objAseo = new NomAseo();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAseo($filtro, $limit, $start,$value)
    {
        try {
            $response->data = $this->objAseo->getAseo($filtro, $limit, $start,$value);
            $response->quantity = $this->objAseo->getCantAseoActivos($filtro);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addAseo($objAseo)
    {
        try {
            if (!$this->objAseo->findByIdOrDenomadd($objAseo->denominacion)) {
                $obj = new NomAseo();
                foreach ($objAseo as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idaseo;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modAseo($idaseo, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!$this->objAseo->findByIdOrDenom($denominacion, $idaseo)) {
                $result = $this->objAseo->modAseo(
                    $idaseo, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
                );
            } else {
                throw new Exception('El aseo que quiere modificar ya existe.', 3);
            }

            return $result;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function delAseo($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomAseo');
            if (is_array($arrids)) {
                $query->whereIn('idaseo', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idaseo = ?', $arrids);
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

