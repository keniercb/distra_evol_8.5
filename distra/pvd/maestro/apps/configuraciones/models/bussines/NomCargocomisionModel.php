<?php
/**
 * @name NomCargocomisionModel - Clase modelo del nomenclador "Cargo para comisiones".
 * @copyright XETID.
 * @author Centro RRHH. División Gestión de Entidades. XETID.
 * @date 20/10/2017 Ing. Orestes Rodríguez Lorenzo
 * @version 1.0.0
 */

class NomCargocomisionModel extends ZendExt_Model
{
    
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getCargos($filtro, $inicio, $limit)
    {
        try {
            $datos = NomCargocomision::getCargos($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomCargocomision::cantCargos($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addCargo($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomCargocomision();
            
            $obj->denominacion = $denominacion;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            
            //print_r($obj);die;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateCargo($idcargocomision, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomCargocomision::getById($idcargocomision);
            $denom = NomCargocomision::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['denominacion'] == $obj->denominacion) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteCargo($idcargocomision)
    {
        try {
            $obj = NomCargocomision::getById($idcargocomision);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            print_r($e);die;
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function existeDenom($denominacion)
    {
        return NomCargocomision::existeDenom($denominacion);
    }
}
