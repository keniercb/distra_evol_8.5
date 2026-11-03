<?php 
class NomFormaaccidenteModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getFormas($filtro, $inicio, $limit)
    {
        try {
            $datos = NomFormaaccidente::getFormas($filtro, $inicio, $limit);
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
            $resp->cantidad = NomFormaaccidente::cantFormas($filtro);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getFormasActivos()
    {
        try {
            $datos = NomFormaaccidente::getFormasActivos();
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addForma($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomFormaaccidente();
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

    public function updateForma($idformaaccidente, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomFormaaccidente::getById($idformaaccidente);
            $denom = NomFormaaccidente::existeDenom($denominacion);
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

    public function deleteForma($idformaaccidente)
    {
        try {
            $obj = NomFormaaccidente::getById($idformaaccidente);
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
        return NomFormaaccidente::existeDenom($denominacion);
    }
}