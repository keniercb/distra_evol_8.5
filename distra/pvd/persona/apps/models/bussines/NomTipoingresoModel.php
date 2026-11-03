<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 17/06/16
 * Time: 16:21
 */
class NomTipoingresoModel extends ZendExt_Model
{
    protected $_objTipoingreso;
    protected $_response;

    function __construct()
    {
        $this->_objTipoingreso = new NomTipoingreso();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTipoingresoActivo($filtro = null, $limit = null, $start = 0)
    {
        try {
            $this->_response->data = $this->_objTipoingreso->getTipoIngresoActivo($filtro, $limit, $start);
            $this->_response->quantity = ($limit > 0)
                ? $this->_objTipoingreso->getCantTipoIngresoActivo($filtro)
                : count($this->_response->data);
            return $this->_response;
        } catch (Exception $e) {
            throw $e;
        }
    }
    public function addTipoingreso($objTipoingreso)
    {
        try {
            if (!$this->_objTipoingreso->findByIdOrDenom($objTipoingreso->denominacion)) {
                $obj = new NomTipoingreso();
                foreach ($objTipoingreso as $k => $v) {
                    $obj->$k = $v;
                }
                $obj->save();
                return $obj->idtipoingreso;
            } else {
                return false;
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function modTipoingreso($idtipoingreso, $denominacion, $abreviatura, $descripcion, $fdesde, $fhasta)
    {
        try {
            if (!$this->_objTipoingreso->findByIdOrDenom($denominacion, $idtipoingreso)) {
                $this->_objTipoingreso = new NomTipoingreso();
                $result = $this->_objTipoingreso->modTipoingreso(
                    $idtipoingreso,
                    $denominacion,
                    $abreviatura,
                    $descripcion,
                    $fdesde,
                    $fhasta
                );
                return $result;
            } else {
                throw new Exception('El tipo de ingreso ya existe', 3);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }
    
    public function delTipoingreso($arrids)
    {
        try {
            $data = Utiles::reflectArray($arrids);
            if (count($data) > 0) {
                $query = Doctrine_Query::create()
                    ->delete('NomTipoingreso')
                    ->whereIn('idtipoingreso', $data)
                    ->execute();
            } else {
                return false;
            }
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }
}