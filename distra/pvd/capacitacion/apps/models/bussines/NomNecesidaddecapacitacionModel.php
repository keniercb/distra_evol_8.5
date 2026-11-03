<?php 
class NomNecesidaddecapacitacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getNecesidades($filtro, $inicio, $limit)
    {
        try {
            $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
            $datos = NomNecesidaddecapacitacion::getNecesidades($filtro, $inicio, $limit, $identidad);
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
            $resp->cantidad = NomNecesidaddecapacitacion::cantNecesidades($filtro, $identidad);
            return $resp;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getNecesidadesActivos()
    {
        try {
            $identidad = $_SESSION['Zeolides']['entidad']->idestructura;
            $datos = NomNecesidaddecapacitacion::getNecesidadesActivos(null, $identidad);
            foreach ($datos as $i => $val) {
                $datos[$i]['descripcion'] = (empty($val['descripcion']))?'Sin descripci&oacute;n':$val['descripcion'];
            }
            return $datos;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function addNecesidad($denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = new NomNecesidaddecapacitacion();
            $obj->denominacion = $denominacion;
            $obj->descripcion = $descripcion;
            $obj->fdesde = $fdesde;
            $obj->fhasta = $fhasta;
            $obj->identidad = $_SESSION['Zeolides']['entidad']->idestructura;
            $obj->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    public function updateNecesidad($idnecesidad, $denominacion, $descripcion, $fdesde, $fhasta)
    {
        try {
            $obj = NomNecesidaddecapacitacion::getById($idnecesidad);
            $denom = NomNecesidaddecapacitacion::existeDenom(
                $denominacion, $_SESSION['Zeolides']['entidad']->idestructura
            );
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

    public function deleteNecesidad($idnecesidad)
    {
        try {
            $obj = NomNecesidaddecapacitacion::getById($idnecesidad);
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
        return NomNecesidaddecapacitacion::existeDenom($denominacion, $_SESSION['Zeolides']['entidad']->idestructura);
    }
}