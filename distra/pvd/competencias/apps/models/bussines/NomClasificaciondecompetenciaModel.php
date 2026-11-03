<?php 
class NomClasificaciondecompetenciaModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getClasificaciones($filtro, $inicio, $limit)
    {
        try {
            $datos = NomClasificaciondecompetencia::getClasificaciones($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = NomClasificaciondecompetencia::cantClasificaciones($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getClasificacionesActivas()
    {
        try {
            $datos = NomClasificaciondecompetencia::getClasificacionesActivas();
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addClasificacion($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomClasificaciondecompetencia();
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

    public function updateClasificacion($idclasificaciondecompetencia, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomClasificaciondecompetencia::getById($idclasificaciondecompetencia);
            $denom = NomClasificaciondecompetencia::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idclasifcompetencia'] == $idclasificaciondecompetencia) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = (empty($fhasta) || $fhasta == "") ? null : $fhasta;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteClasificacion($idclasificaciondecompetencia)
    {
        try {
            $obj = NomClasificaciondecompetencia::getById($idclasificaciondecompetencia);
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
        return NomClasificaciondecompetencia::existeDenom($denominacion);
    }
}