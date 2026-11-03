<?php
class NomValorcualitativoModel extends ZendExt_Model
{

    public function getValoresCualitativos($filtro, $inicio, $limit)
    {
        try {
            $datos = NomValorcualitativo::getValores($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            } else {
                foreach ($datos as $i => $val) {
                    $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
                }
            }
            $resp->datos = $datos;
            $resp->cantidad = NomValorcualitativo::cantValores($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getValoresActivos()
    {
        try {
            $datos = NomValorcualitativo::getValoresActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addValor($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomValorcualitativo();
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

    public function updateValor($idvalorcualitativo, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomValorcualitativo::getById($idvalorcualitativo);
            $denom = NomValorcualitativo::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['idvalorcualitativo'] == $obj->idvalorcualitativo) {
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

    public function deleteValor($idvalorcualitativo)
    {
        try {
            $obj = NomValorcualitativo::getById($idvalorcualitativo);
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
        return NomValorcualitativo::existeDenom($denominacion);
    }
}