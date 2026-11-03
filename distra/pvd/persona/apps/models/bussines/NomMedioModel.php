<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/06/16
 * Time: 14:59
 */
class NomMedioModel extends ZendExt_Model
{

    protected $objmedio;

    protected $response;

    function __construct()
    {
        $this->objmedio = new NomMedio();
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


    public function getMedioActive($filtro, $limit, $start,$value)
    {
        try {
            $tmp->data = $this->objmedio->getMedioActive($filtro, $limit, $start,$value);
            $tmp->quantity = $this->objmedio->getCantMedioActive($filtro);
            return $tmp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Funcion para adicionar un tipo de ingreso

     * @return numeric
     */
    public function addMedio($objmedio)
    {

        try {
            $objDomain = new NomMedio();
            if (!$objDomain->findByIdOrDenom($objmedio->denominacion)) {
                $obj = new NomMedio();
                foreach ($objmedio as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();
                return $obj->idmediopersona;
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
    public function modMedio($idmedio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            $objDomain = new NomMedio();
            $result = $objDomain->modMedio($idmedio, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta);
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
    public function delMedio($arrids)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('NomMedio');
            if (is_array($arrids)) {
                $query->whereIn('idmediopersona', $arrids);
            } elseif (is_numeric($arrids)) {
                $query->where('idmediopersona = ?', $arrids);
            }
            $result = $query->execute();
            return $result->delete();
        }catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
    public function getById($idmedio)
    {
        try {
            $objDomain = new NomMedio();
            $result = $objDomain->getDenomById($idmedio);
            return $result;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString1();
        }
    }
}