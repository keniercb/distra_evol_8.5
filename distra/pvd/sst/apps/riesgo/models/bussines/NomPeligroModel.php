<?php 
class NomPeligroModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getPeligros($filtro, $inicio, $limit)
    {
        try {
            $datos = NomPeligro::getPeligros($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = NomPeligro::cantPeligros($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getPeligrosActivos()
    {
        try {
            $datos = NomPeligro::getPeligrosActivos();
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addPeligro($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomPeligro();
            $obj->denominacion = $denominacion;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updatePeligro($idpeligro, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomPeligro::getById($idpeligro);
            $denom = NomPeligro::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idpeligro'] == $idpeligro) {
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

    public function deletePeligro($idpeligro)
    {
        try {
            $obj = NomPeligro::getById($idpeligro);
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
        return NomPeligro::existeDenom($denominacion);
    }
}