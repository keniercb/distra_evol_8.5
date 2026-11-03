<?php 
class NomPartecuerpoModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getPartes($filtro, $inicio, $limit)
    {
        try {
            $datos = NomPartecuerpo::getPartes($filtro, $inicio, $limit);
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
            $resp->cantidad = NomPartecuerpo::cantPartes($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getPartesActivos()
    {
        try {
            $datos = NomPartecuerpo::getPartesActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addParte($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomPartecuerpo();
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

    public function updateParte($idpartecuerpo, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomPartecuerpo::getById($idpartecuerpo);
            $denom = NomPartecuerpo::existeDenom($denominacion);
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

    public function deleteParte($idpartecuerpo)
    {
        try {
            $obj = NomPartecuerpo::getById($idpartecuerpo);
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
        return NomPartecuerpo::existeDenom($denominacion);
    }
}