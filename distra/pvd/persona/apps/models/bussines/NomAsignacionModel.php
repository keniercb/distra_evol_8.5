<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:59
 */
class NomAsignacionModel extends ZendExt_Model
{

    protected $objasignacion;

    protected $response;

    function __construct()
    {
        $this->objasignacion = new NomAsignacion();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    /**
     * @param $data
     * @return array
     */
    public function reflectArray($data)
    {
        if (is_array($data)) {
            return $data;
        } elseif (!empty($data)) {
            return array($data);
        } else {
            return array();
        }
    }


    public function getAsignacionActive($filtro, $limit, $start,$value)
    {
        try {
            $tmp->data = $this->objasignacion->getAsignacionActive($filtro, $limit, $start,$value);
            $tmp->quantity = $this->objasignacion->getCantAsignacionActive($filtro);
            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de ingreso

     * @return numeric
     */
    public function addAsignacion($obasignacion)
    {
        try {
            $objDomain = new NomAsignacion();
            if (!$objDomain->findByIdOrDenom($obasignacion->denominacion)) {
                $obj = new NomAsignacion();
                foreach ($obasignacion as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();
                return $obj->idasignacion;
            } else {
                return false;
            }
        } catch (Exception $e) {
            echo $e->getTraceAsString();
        }
    }



    /**
     * Funcion para modificar el tipo de ingreso
     * @param numeric $idtipoingreso
     * @param string $denominacion
     * @param string $descripcion
     * @param date $fdesde
     * @param date $fhasta
     * @return boolean
     */
    public function modAsignacion($idasignacion, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $objDomain = new NomAsignacion();
            $result = $objDomain->modAsignacion($idasignacion, $denominacion, $abreviatura, $descripcion, $fdesde,
                $fhasta);
            return $result;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString1();
        }
    }

    /**
     * Funcion para elieminar el tipo de ingreso
     * @param array $arrids
     * @return type
     */
    public function delAsignacion($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomAsignacion');
            if (is_array($arrids)) {
                $query->whereIn('idasignacion', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idasignacion = ?', $arrids);
            }
            $result = $query->execute();
            return $result->delete();
        }catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}