<?php

class ConfModulosModel extends ZendExt_Model
{
    public function ConfModulosModel()
    {
        parent::ZendExt_Model();
    }

    public function obtenerListadoModulos()
    {
        return ConfModulos::obtenerListadoModulos();
    }

    public function obtenerCantidadModulos()
    {
        return ConfModulos::obtenerCantidadModulos();
    }

    public function obtenerListadoModulosEntidadConfiguracion($identidad)
    {
        return ConfModulos::obtenerListadoModulosEntidadConfiguracion($identidad);
    }

    public function obtenerCantidadModulosEntidadConfiguracion($identidad)
    {
        return ConfModulos::obtenerCantidadModulosEntidadConfiguracion($identidad);
    }

    public function adicionarModulo($datos)
    {
        $existe = ConfModulos::existeObjConfModulosDadoDenom($datos['denominacion']);
        $existeidentificador = ConfModulos::existeObjConfModulosDadoIdentificador($datos['identificador']);
        if ($existe != 1) {
            if ($datos['formato'] == 1) {    
                if ($existeidentificador == 0) {        
                    $obj = new ConfModulos();
                    $obj->identificador = $datos['identificador'];
                    $obj->denominacion = $datos['denominacion'];
                    $obj->cobroypago = (!empty($datos['cobroypago'])) ? 1 : 0;
                    $obj->apertura = (!empty($datos['apertura'])) ? 1 : 0;
                    $obj->fijaretencionesporpagar = (!empty($datos['fijaretencionesporpagar'])) ? 1 : 0;
                    $obj->save();
                    return 'existe';
                } else {
                    return 'existe';
                }
            } else if ($datos['formato'] == 2) {
                $existeidentificador = DatModuloEntidad::existeObjDatModulosEntidadDadoIdentificador($datos['identificador'], $datos['identidad']);
                if ($existeidentificador == 0) {
                    $objDatModuloEnt = new DatModuloEntidad();
                    $identificador = $datos['identificador'];
                    $denominacion = $datos['denominacion'];
                    $cobroypago = (!empty($datos['cobroypago'])) ? 1 : 0;
                    $apertura = (!empty($datos['apertura'])) ? 1 : 0;
                    $fijaretencionesporpagar = (!empty($datos['fijaretencionesporpagar'])) ? 1 : 0;
                    $identidad = $datos['identidad'];

                    $add = $objDatModuloEnt->adicionarModulosEntidad($identificador, $denominacion, $cobroypago, $apertura, $fijaretencionesporpagar, $identidad);
                    return 'ok';
                } else {
                    return 'existe';
                }
            }
        } else {
            return 'existe';
        }

    }

    public function modificarModulo($datos)
    {
        if ($datos['tabla'] == 2) {
            $obj = ConfModulos::obtenerObjConfModulosDadoId($datos['idmoduloentidad']);
            $obj->identificador = $datos['identificador'];
            $obj->denominacion = $datos['denominacion'];
            $obj->cobroypago = (!empty($datos['cobroypago'])) ? 1 : 0;
            $obj->apertura = (!empty($datos['apertura'])) ? 1 : 0;
            $obj->fijaretencionesporpagar = (!empty($datos['fijaretencionesporpagar'])) ? 1 : 0;
            $obj->save();
            return 'ok';
        } elseif ($datos['tabla'] == 1) {
            $objDatModuloEnt = new DatModuloEntidad();
            $identificador = $datos['identificador'];
            $denominacion = $datos['denominacion'];
            $cobroypago = (!empty($datos['cobroypago'])) ? 1 : 0;
            $apertura = (!empty($datos['apertura'])) ? 1 : 0;
            $fijaretencionesporpagar = (!empty($datos['fijaretencionesporpagar'])) ? 1 : 0;
            $identidad = $datos['identidad'];
            $idmoduloentidad = $datos['idmoduloentidad'];

            $mod = $objDatModuloEnt->modificarModulosEntidad($identificador, $denominacion, $cobroypago, $apertura, $fijaretencionesporpagar, $identidad, $idmoduloentidad);
            return 'ok';
        }
    }

    public function eliminarModulo($arridconfmodulo)
    {
        try {
            foreach ($arridconfmodulo as $idmodulo) {
                if ($idmodulo['tabla'] == 2) {
                    $obj = ConfModulos::obtenerObjConfModulosDadoId($idmodulo['idmoduloentidad']);
                    $obj->delete();
                }elseif ($idmodulo['tabla'] == 1) {
                    $delete = DatModuloEntidad::eliminarModulosEntidad($idmodulo['idmoduloentidad']);
                }
            }
            return 'ok';
        } catch (Exception $e) {
            return 'error';
        }
    }
}
