<?php

class TrasladoUebModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    function guardarTrasladoUEB($idpersona, $idsituacionlaboral, $idueb) {
        try {
            $traslado = new DatTrasladoUeb();
            $traslado->idpersona = $idpersona;
            $traslado->idsituacionlaboral = $idsituacionlaboral;
            $traslado->idueb = $idueb;
            $traslado->save();
            return true;
        } catch (Exception $e) {
            return false;
        }
    }

    function obtenerTrasladoUEB()
    {
        try {
            $traslado = new DatTrasladoUeb();
            return array("datos"=>$traslado->obetenerTrasladoUEB());
        } catch (Exception $e) {
            return false;
        }
    }
}