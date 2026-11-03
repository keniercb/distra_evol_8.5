<?php

class ConfAgrupadorAreasModel extends ZendExt_Model
{

    public function ConfAgrupadorAreasModel()
    {
        parent::ZendExt_Model();
    }

    public function obtenerAgrupadores($identidad,$idpagoporresultado)
    {
        return ConfAgrupadorAreas::obtenerAgrupadoresXIdPagoPorResultado($identidad,$idpagoporresultado);
    }

    public function adicionarAgrupadores($identidad, $idpagoporresultado, $denominacion, $idformula)
    {
        $obj = new ConfAgrupadorAreas();
        $existe = $obj->existeAgrupador($identidad, $idpagoporresultado, $denominacion);
        if ($existe) {
            return 'existe';
        }
        $obj->identidad = $identidad;
        $obj->idpagoporresultado = $idpagoporresultado;
        $obj->denominacion = $denominacion;
        $obj->idformula = $idformula;
        $obj->save();
        return 'ok';
    }

    public function modificarAgrupadores($idagrupador, $identidad, $idpagoporresultado, $denominacion, $idformula)
    {
        //Obteniendo el periodo
        $obj = ConfAgrupadorAreas::obtenerAgrupadoresXId($idagrupador);
        $obj->denominacion = $denominacion;
        $obj->save();
        return 'ok';
    }

    public function eliminarAgrupadores($arridagrupadores)
    {
        foreach ($arridagrupadores as $idagrupador) {
            $obj = ConfAgrupadorAreas::obtenerAgrupadoresXId($idagrupador);
            $obj->delete();
        }
        return 'ok';
    }
}
