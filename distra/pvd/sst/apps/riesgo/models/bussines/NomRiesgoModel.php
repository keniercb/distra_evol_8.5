<?php 
class NomRiesgoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getRiesgos($filtro, $inicio, $limit)
    {
        try {
            $datos = NomRiesgo::getRiesgos($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomRiesgo::cantRiesgos($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getRiesgosActivos()
    {
        try {
            $datos = NomRiesgo::getRiesgosActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addRiesgo($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomRiesgo();
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

    public function updateRiesgo($idnriesgo, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomRiesgo::getById($idnriesgo);
            $denom = NomRiesgo::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idnriesgo'] == $idnriesgo) {
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

    public function deleteRiesgo($idnriesgo)
    {
        try {
            $obj = NomRiesgo::getById($idnriesgo);
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
        return NomRiesgo::existeDenom($denominacion);
    }
}