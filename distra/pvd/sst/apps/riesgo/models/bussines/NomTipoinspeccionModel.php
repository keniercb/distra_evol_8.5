<?php 
class NomTipoinspeccionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTipoinspeccion($filtro, $inicio, $limit)
    {
        try {
            $datos = NomTipoinspeccion::getTipoInspeccion($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomTipoinspeccion::cantTipoInspeccion($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTipoinspeccionActivos()
    {
        try {
            $datos = NomTipoinspeccion::getTipoInspeccionActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function add($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomTipoinspeccion();
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

    public function update($idtipoinspeccion, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomTipoinspeccion::getById($idtipoinspeccion);
            $denom = NomTipoinspeccion::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idtipoinspeccion'] == $idtipoinspeccion) {
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

    public function delete($idtipoinspeccion)
    {
        try {
            $obj = NomTipoinspeccion::getById($idtipoinspeccion);
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
        return NomTipoinspeccion::existeDenom($denominacion);
    }
}