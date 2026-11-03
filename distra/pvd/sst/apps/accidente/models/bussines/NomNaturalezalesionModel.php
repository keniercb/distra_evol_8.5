<?php 
class NomNaturalezalesionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getNaturalezas($filtro, $inicio, $limit)
    {
        try {
            $datos = NomNaturalezalesion::getNaturalezas($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    if (empty($val['descripcion'])) {
                        $datos[$i]['descripcion'] = 'Sin descripci&oacute;n';
                    } else {
                        $datos[$i]['descripcion'] = $val['descripcion'];
                    }
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomNaturalezalesion::cantNaturalezas($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getNaturalezasActivos()
    {
        try {
            $datos = NomNaturalezalesion::getNaturalezasActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addNaturaleza($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomNaturalezalesion();
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

    public function updateNaturaleza($idnaturalezalesion, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomNaturalezalesion::getById($idnaturalezalesion);
            $denom = NomNaturalezalesion::existeDenom($denominacion);
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

    public function deleteNaturaleza($idnaturalezalesion)
    {
        try {
            $obj = NomNaturalezalesion::getById($idnaturalezalesion);
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
        return NomNaturalezalesion::existeDenom($denominacion);
    }
}