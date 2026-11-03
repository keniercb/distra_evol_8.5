<?php 
class NomTipoaccionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTiposAccion($filtro, $inicio, $limit)
    {
        try {
            $datos = NomTipoaccion::getTiposAccion($filtro, $inicio, $limit);
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
            $resp->cantidad = NomTipoaccion::cantTiposAccion($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTiposAccionActivos()
    {
        try {
            $datos = NomTipoaccion::getTiposAccionActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addTipoAccion($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomTipoaccion();
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

    public function updateTipoAccion($idtipoaccion, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomTipoaccion::getById($idtipoaccion);
            $denom = NomTipoaccion::existeDenom($denominacion);
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

    public function deleteTipoAccion($idtipoaccion)
    {
        try {
            $obj = NomTipoaccion::getById($idtipoaccion);
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
        return NomTipoaccion::existeDenom($denominacion);
    }
}