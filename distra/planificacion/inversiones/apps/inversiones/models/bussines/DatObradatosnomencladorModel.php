<?php

class DatObradatosnomencladorModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertardat_obradatosnomenclador($dat_obradatosnomenclador)
    {
        $dat_obradatosnomenclador->save();
    }

    public function adicionar($idobra, $idsdatnom)
    {
        if (is_array($idsdatnom)) {
            foreach ($idsdatnom as $dn) {
                $datobradatnom = new DatObradatosnomenclador();
                $datobradatnom->idobra = $idobra;
                $datobradatnom->iddatosnomenclador = $dn;
                $datobradatnom->save();
            }
        } else {
            $datobradatnom = new DatObradatosnomenclador();
            $datobradatnom->idobra = $idobra;
            $datobradatnom->iddatosnomenclador = $idsdatnom;
            $datobradatnom->save();
        }

    }

    public function modificardat_obradatosnomenclador($dat_obradatosnomenclador)
    {
        $dat_obradatosnomenclador->save();
    }

    public function eliminardat_obradatosnomenclador($dat_obradatosnomenclador)
    {
        $dat_obradatosnomenclador->delete();
    }

    public function eliminaDadoObraYTipoNomAsoc($idobra, $idtiponomenclador)
    {
        $datNom = DatObradatosnomencladorModel::getObrasDatNomDadoIdobraIdtiponom($idobra, $idtiponomenclador);
        foreach ($datNom as $j => $dn) {
            DatObradatosnomenclador::eliminaDadoObraYTipoNomAsoc($idobra, $dn['iddatosnomenclador']);
        }
        return 1;
    }

    public function getObrasDatNomDadoIdobraIdtiponom($idobra, $idtiponomasociado)
    {
        return DatObradatosnomenclador::getObrasDatNomDadoIdobraIdtiponom($idobra, $idtiponomasociado);
    }

}
