<?php

class ConfFormulasAreasMontosModel extends ZendExt_Model
{

    public function ConfFormulasAreasMontosModel()
    {
        parent::ZendExt_Model();
    }

    public function obtenerFormulasAreasMontos($idagrupadorarea)
    {
        return ConfFormulasAreasMontos::obtenerConfFormulasAreasMontosXIdAgrupador($idagrupadorarea);
    }

    public function obtenerTodasAreasAgrupadores($identidad, $idpagoporresultado)
    {
        return ConfFormulasAreasMontos::obtenerTodasAreasAgrupadores($identidad, $idpagoporresultado);
    }

    public function adicionarFormulasAreasMontos($idagrupador, $arridareas)
    {
        foreach ($arridareas as $idarea) {
            $obj = new ConfFormulasAreasMontos();
            $existe = $obj->existeArea($idagrupador, $idarea);
            if (!$existe) {
                $obj->idagrupadorarea = $idagrupador;
                $obj->idarea = $idarea;
                $obj->idformula = -1;
                $obj->save();
            }
        }
        return 'ok';
    }

    public function modificarFormulasAreasMontos($arridformulaareamonto, $idformula)
    {
        foreach ($arridformulaareamonto as $idformulaareamonto) {
            $idformulanuevo = ConfConceptospdFormasySistemasPagoModel::crearFormulaNueva($idformula);
            $obj = ConfFormulasAreasMontos::obtenerFormulasAreasMontosXId($idformulaareamonto);
            $obj->idformula = $idformulanuevo;
            $obj->save();
            //Fichero comun
            $dirleer = $_SERVER['DOCUMENT_ROOT'].'/pvd/comun/indicadoresexpresonmatematica/'.$idformula.'.iem';
            $datosserializados = file_get_contents($dirleer);
            $dirguardar = $_SERVER['DOCUMENT_ROOT'].'/pvd/comun/indicadoresexpresonmatematica/'.$idformulanuevo.'.iem';
            file_put_contents($dirguardar, $datosserializados);
        }
        return 'ok';
    }

    public function eliminarFormulasAreasMontos($idagrupador, $arridformulaareamonto)
    {

        foreach ($arridformulaareamonto as $idformulaareamonto) {
            $obj = ConfFormulasAreasMontos::obtenerFormulasAreasMontosXId($idformulaareamonto);
            $obj->delete();
        }
        return 'ok';
    }
}
