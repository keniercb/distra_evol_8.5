<?php 
class NomTipoaccidenteModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getTipos($filtro, $inicio, $limit)
    {
        try {
            $datos = NomTipoaccidente::getTipos($filtro, $inicio, $limit);
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
            $resp->cantidad = NomTipoaccidente::cantTipos($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getTiposActivos()
    {
        try {
            $datos = NomTipoaccidente::getTiposActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addTipo($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomTipoaccidente();
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

    public function updateTipo($idtipoaccidente, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomTipoaccidente::getById($idtipoaccidente);
            $denom = NomTipoaccidente::existeDenom($denominacion);
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

    public function deleteTipo($idtipoaccidente)
    {
        try {
            $obj = NomTipoaccidente::getById($idtipoaccidente);
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
        return NomTipoaccidente::existeDenom($denominacion);
    }
}