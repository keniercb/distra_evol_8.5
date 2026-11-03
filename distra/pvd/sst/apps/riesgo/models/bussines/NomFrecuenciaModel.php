<?php 
class NomFrecuenciaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getFrecuencias($filtro, $inicio, $limit)
    {
        try {
            $datos = NomFrecuencia::getFrecuencias($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = NomFrecuencia::cantFrecuencias($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getFrecuenciasActivos()
    {
        try {
            $datos = NomFrecuencia::getFrecuenciasActivos();
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addFrecuencia($denominacion, $descripcion, $fdesde, $fhasta, $valor)
    {
        try {
            $obj = new NomFrecuencia();
            $obj->denominacion = $denominacion;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->valor = (empty($valor)) ? null : $valor;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateFrecuencia($idfrecuencia, $denominacion, $descripcion, $fdesde, $fhasta, $valor)
    {
        try {
            $obj = NomFrecuencia::getById($idfrecuencia);
            $denom = NomFrecuencia::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idfrecuencia'] == $idfrecuencia) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->valor = (empty($valor)) ? null : $valor;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteFrecuencia($idfrecuencia)
    {
        try {
            $obj = NomFrecuencia::getById($idfrecuencia);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function existeDenom($denominacion)
    {
        return NomFrecuencia::existeDenom($denominacion);
    }
}