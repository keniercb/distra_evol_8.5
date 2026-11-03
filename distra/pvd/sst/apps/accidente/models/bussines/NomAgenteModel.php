<?php 
class NomAgenteModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getAgentes($filtro, $idtipoagente, $inicio, $limit)
    {
        try {
            $datos = NomAgente::getAgentes($filtro, $idtipoagente, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = NomAgente::cantAgentes($filtro, $idtipoagente);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getAgentesbyTipo($idtipoagente, $inicio, $limite)
    {
        try {
            $datos = NomAgente::getAgentesbyTipo($idtipoagente, $inicio, $limite);
            $cant = NomAgente::cantAgentesbyTipo($idtipoagente);
            $res->datos = $datos;
            $res->cantidad = $cant;
            return $res;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addAgente($denominacion, $descripcion, $fdesde, $fhasta, $idtipoagente)
    {
        try {
            $obj = new NomAgente();
            $obj->denominacion = $denominacion;
            $obj->idtipoagente = $idtipoagente;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->save();
            return true;
           
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateAgente($idagente, $denominacion, $descripcion, $fdesde, $fhasta, $idtipoagente)
    {
        try {            
            $obj = NomAgente::getById($idagente);
            $denom = NomAgente::existeDenom($denominacion, $idtipoagente);
            if (count($denom) == 0 || $denom[0]['denominacion'] == $obj->denominacion) {
                $obj->denominacion = $denominacion;
                $obj->idtipoagente = $idtipoagente;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->save();
                return true;
            } else {
                return 1;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteAgente($idagente)
    {
        try {
            $obj = NomAgente::getById($idagente);
            $obj->delete();
            return true;
        } catch (Exception $e) {
            if ($e->GetCode() == 23503) {
                return false;
            }
        }
    }

    public function existeDenom($denominacion, $idtipoagente)
    {
        return NomAgente::existeDenom($denominacion, $idtipoagente);
    }
}