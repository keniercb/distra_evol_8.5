<?php 
class NomProbabilidadModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getProbabilidades($filtro, $inicio, $limit)
    {
        try {
            $datos = NomProbabilidad::getProbabilidades($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomProbabilidad::cantProbabilidades($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getProbabilidadesActivos()
    {
        try {
            $datos = NomProbabilidad::getProbabilidadesActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addProbabilidad($denominacion, $descripcion, $fdesde, $fhasta, $valor)
    {
        try {
            $obj = new NomProbabilidad();
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

    public function updateProbabilidad($idprobabilidad, $denominacion, $descripcion, $fdesde, $fhasta, $valor)
    {
        try {
            $obj = NomProbabilidad::getById($idprobabilidad);
            $denom = NomProbabilidad::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idprobabilidad'] == $idprobabilidad) {
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

    public function deleteProbabilidad($idprobabilidad)
    {
        try {
            $obj = NomProbabilidad::getById($idprobabilidad);
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
        return NomProbabilidad::existeDenom($denominacion);
    }
}