<?php 
class NomPeriodoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getPeriodos($filtro, $inicio, $limit)
    {
        try {
            $datos = NomPeriodo::getPeriodos($filtro, $inicio, $limit);
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
            $resp->cantidad = NomPeriodo::cantPeriodos($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getPeriodosActivos()
    {
        try {
            $datos = NomPeriodo::getPeriodosActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addPeriodo($denominacion, $descripcion, $fdesde, $fhasta, $tiempo)
    {
        try {
            $obj = new NomPeriodo();
            $obj->denominacion = $denominacion;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->tiempo = $tiempo;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updatePeriodo($idPeriodo, $denominacion, $descripcion, $fdesde, $fhasta, $tiempo)
    {
        try {
            $obj = NomPeriodo::getById($idPeriodo);
            $denom = NomPeriodo::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['denominacion'] == $obj->denominacion) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = $fhasta;
                $obj->tiempo = $tiempo;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deletePeriodo($idperiodo)
    {
        try {
            $obj = NomPeriodo::getById($idperiodo);
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
        return NomPeriodo::existeDenom($denominacion);
    }
}