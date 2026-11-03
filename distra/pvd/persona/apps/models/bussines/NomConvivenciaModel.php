<?php
class NomConvivenciaModel extends ZendExt_Model
{
    protected $objconvivencia;

    private $response;

    function __construct()
    {
        $this->objconvivencia = new NomConvivencia();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getConvivencia($query, $limit, $start)
    {
        try {
            //print_r('asdasdas');die;
            $this->response = NomConvivencia::getConvivencia($query, $limit, $start);
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCantidad()
    {
        try {
            $this->response = $this->objconvivencia->getCantConvivencia();
            return $this->response;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addConvivencia($objConvivencia)
    {
        try {
            $objDomain = new NomConvivencia();
            if (!$objDomain->buscarDenominacionId($objConvivencia->denominacion)) {
                $obj = new NomConvivencia();
                foreach ($objConvivencia as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();
                return $obj->idconvivencia;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }

    public function modConvivencia($idconvivencia, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomConvivencia();
            if (!$obj->buscarPorDenom($denominacion, $idconvivencia)) {
                $result = $obj->modConvivencia($idconvivencia, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta);
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

    public function delConvivencia($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomConvivencia');
            if (is_numeric($arrids)) {
                $query->where('idconvivencia = ?', $arrids);
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