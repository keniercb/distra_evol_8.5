<?php 
class NomNivelriesgoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getNiveles($filtro, $inicio, $limit)
    {
        try {
            $datos = NomNivelriesgo::getNiveles($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = NomNivelriesgo::cantNiveles($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getNivelesActivos()
    {
        try {
            $datos = NomNivelriesgo::getNivelesActivos();
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addNivel($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomNivelriesgo();
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

    public function updateNivel($idnivelriesgo, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomNivelriesgo::getById($idnivelriesgo);
            $denom = NomNivelriesgo::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idnivelriesgo'] == $idnivelriesgo) {
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

    public function deleteNivel($idnivelriesgo)
    {
        try {
            $obj = NomNivelriesgo::getById($idnivelriesgo);
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
        return NomNivelriesgo::existeDenom($denominacion);
    }
}