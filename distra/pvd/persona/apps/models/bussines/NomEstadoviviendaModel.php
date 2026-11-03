<?php
class NomEstadoviviendaModel extends ZendExt_Model
{
    protected $objestadovivienda;

    private $response;

    function __construct()
    {
        $this->objestadovivienda = new NomEstadovivienda();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }
    
    public function getEstadoVivienda($query, $limit, $start)
    {
        try {
            $this->response = NomEstadovivienda::getEstadoVivienda($query, $limit, $start);
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCantidad()
    {
        try {
            $this->response = $this->objestadovivienda->getCantEstadoVivienda();
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addEstadoVivienda($objEstadoVivienda)
    {
        try {
            $objDomain = new NomEstadovivienda();
            if (!$objDomain->buscarDenominacionId($objEstadoVivienda->denominacion)) {
                $obj = new NomEstadovivienda();
                foreach ($objEstadoVivienda as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();
                return $obj->idestadovivienda;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    public function modEstadoVivienda($idestadovivienda, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomEstadovivienda();
            if (!$obj->buscarPorDenom($denominacion, $idestadovivienda)) {
                $result = $obj->modEstadoVivienda($idestadovivienda, $denominacion, $abreviatura, $descripcion, $fdesde,
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

    public function delEstadoVivienda($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomEstadovivienda');
            if (is_numeric($arrids)) {
                $query->where('idestadovivienda = ?', $arrids);
            }
            $result = $query->execute();
            $result->delete();
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