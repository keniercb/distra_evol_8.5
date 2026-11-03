<?php
class NomAptitudfisicaModel extends ZendExt_Model
{
    protected $objAptitudFisica;
    protected $response;

    function __construct()
    {
        $this->objAptitudFisica = new NomAptitudfisica();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAptitudesFisicasActivas($filtro, $limit, $start, $value)
    {
        try {
            $response->data = $this->objAptitudFisica->getAptitudesFisicasActivos($filtro, $limit, $start,$value);
            $response->quantity = $this->objAptitudFisica->getCantAptitudesFisicasActivos($filtro);

            return $response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addAptitudesFisicas($objAptitudFisica)
    {
        try {
            if (!$this->objAptitudFisica->findByIdOrDenomadd($objAptitudFisica->denominacion)) {
                $obj = new NomAptitudfisica();
                foreach ($objAptitudFisica as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();

                return $obj->idaptitudfisica;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modAptitudesFisicas($idaptitudfisica, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!$this->objAptitudFisica->findByIdOrDenom($denominacion, $idaptitudfisica)) {
                $result = $this->objAptitudFisica->modAptitudesFisicas(
                    $idaptitudfisica, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta
                );
            } else {
                throw new Exception('La aptitud f&iacute;sica que quiere modificar ya existe.', 3);
            }

            return $result;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function delAptitudesFisicas($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomAptitudfisica');
            if (is_array($arrids)) {
                $query->whereIn('idaptitudfisica', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idaptitudfisica = ?', $arrids);
            }
            $result = $query->execute();
            if ($result->delete()) {
                $r['exception'] = 0;
            }
            return $r;
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == 23503) {
                $r['exception'] = 1;

                return $r;
            } else {
                throw $e;
            }
        }
    }
}

