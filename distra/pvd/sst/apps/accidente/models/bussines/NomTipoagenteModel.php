<?php 
class NomTipoagenteModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTiposAgente($filtro, $inicio, $limit)
    {
        try {
            $datos = NomTipoagente::getTiposAgente($filtro, $inicio, $limit);
            if (count($datos)==0) {
                $datos = Array();
            }
            $resp->datos = $datos;
            $resp->cantidad = NomTipoagente::cantTiposAgente($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTiposActivos()
    {
        try {
            $datos = NomTipoagente::getTiposAgenteActive();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addTipoAgente($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomTipoagente();
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

    public function updateTipoAgente($idtipoagente, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomTipoagente::getById($idtipoagente);
            $denom = NomTipoagente::existeDenom($denominacion);
            if (count($denom) == 0 || $denom[0]['denominacion'] == $obj->denominacion) {
                $obj->denominacion = $denominacion;
                $obj->descripcion = $descripcion;
                $obj->fdesde = $fdesde;
                $obj->fhasta = ($fhasta == '')?null:$fhasta;
                $obj->save();
                return true;
            } else {
                return false;
            }
        } catch (Exception $e) {
            return false;
        }
    }

    public function deleteTipoAgente($idtipoagente)
    {
        try {
            $obj = NomTipoagente::getById($idtipoagente);
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
        return NomTipoagente::existeDenom($denominacion);
    }
}