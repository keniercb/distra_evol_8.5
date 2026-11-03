<?php 
class NomConsecuenciaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getConsecuencias($filtro, $inicio, $limit)
    {
        try {
            $datos = NomConsecuencia::getConsecuencias($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomConsecuencia::cantConsecuencias($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getConsecuenciasActivos()
    {
        try {
            $datos = NomConsecuencia::getConsecuenciasActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addConsecuencia($denominacion, $descripcion, $fdesde, $fhasta, $valor)
    {
        try {
            $obj = new NomConsecuencia();
            $obj->denominacion = $denominacion;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->valor = $valor;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateConsecuencia($idconsecuencia, $denominacion, $descripcion, $fdesde, $fhasta, $valor)
    {
        try {
            $obj = NomConsecuencia::getById($idconsecuencia);
            $denom = NomConsecuencia::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idconsecuencia'] == $idconsecuencia) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->valor = (empty($valor))?null:$valor;
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

    public function deleteConsecuencia($idconsecuencia)
    {
        try {
            $obj = NomConsecuencia::getById($idconsecuencia);
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
        return NomConsecuencia::existeDenom($denominacion);
    }
}