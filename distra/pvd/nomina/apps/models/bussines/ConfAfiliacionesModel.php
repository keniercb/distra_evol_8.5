<?php

class ConfAfiliacionesModel extends ZendExt_Model
{
    public function ConfAfiliacionesModel()
    {
        parent::ZendExt_Model();
    }

    public function obtenerListadoAfiliaciones()
    {
        return ConfAfiliaciones::obtenerListadoAfiliaciones();
    }

    public function adicionarAfiliacion($idorganizacion, $denominacion, $tipospagos, $idformula, $idformuladevengadototal)
    {
        $existe = ConfAfiliaciones::existeObjConfAfiliacionesDadoIdAfiliacion($idorganizacion);
        if ($existe != 1) {
            $obj = new ConfAfiliaciones();
            $obj->idafiliacion = $idorganizacion;
            $obj->denominacion = $denominacion;
            $obj->tipospagos = implode(',', $tipospagos);
            $obj->idformula = $idformula;
            $obj->idformuladevengadototal = $idformuladevengadototal;
            $obj->save();
            return 'ok';
        } else {
            return 'existe';
        }

    }

    public function modificarAfiliacion($idconfafiliacion, $idorganizacion, $denominacion, $tipospagos, $idformula, $idformuladevengadototal)
    {
        $obj = ConfAfiliaciones::obtenerObjConfAfiliacionesDadoId($idconfafiliacion);
        if (!empty($idorganizacion))
            $obj->idafiliacion = $idorganizacion;
        $obj->denominacion = $denominacion;
        if (!empty($tipospagos))
            $obj->tipospagos = implode(',', $tipospagos);
        //$obj->idformula = $idformula;
        //$obj->idformuladevengadototal = $idformuladevengadototal;
        $obj->save();
        return 'ok';
    }

    public function eliminarAfiliacion($arridconfafiliacion)
    {
        foreach ($arridconfafiliacion as $idconfafiliacion) {
            if (!empty($idconfafiliacion)) {
                $obj = ConfAfiliaciones::obtenerObjConfAfiliacionesDadoId($idconfafiliacion);
                $obj->delete();
            }
        }
        return 'ok';
    }

    public function adicionarFormulas($idconfafiliacion, $idformula)
    {
        $obj = ConfAfiliaciones::obtenerObjConfAfiliacionesDadoId($idconfafiliacion);
        print_r($obj);
        die;
        $obj->idformula = $idformula;
        $obj->save();
        return 'ok';
    }
}
