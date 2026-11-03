<?php

class ConfCondicionesRetencionesModel extends ZendExt_Model
{

    public function ConfCondicionesRetencionesModel()
    {
        parent::ZendExt_Model();
    }

    public function adicionarFormulas($idconret, $idtiponomina, $idexpresionmatematica, $tipoexpresion)
    {

        $obj = (!empty($idconret)) ? ConfCondicionesRetenciones::obtenerObjConfigCondicionesRetenciones($idconret) :
            new ConfCondicionesRetenciones();

        if ($tipoexpresion == 1) {
            $obj->idtiponomina = $idtiponomina;
            $obj->formulacumpleretenciones = $idexpresionmatematica;
            $obj->secumplesiempre = 0;
            $obj->sinlimiteretenciones = 0;
        } else {
            $obj->idtiponomina = $idtiponomina;
            $obj->formulalimiteretenciones = $idexpresionmatematica;
            $obj->secumplesiempre = 0;
            $obj->sinlimiteretenciones = 0;
        }
        $obj->save();
        return 'ok';
    }

    public function limpiarFormulas($idtiponomina)
    {
        //Borrando las fórmulas de  retención del tipo de nómina.
        $obj = ConfCondicionesRetenciones::obtenerCondicionesRetencionesPorTipoNomina($idtiponomina);
        $objfinal = ConfCondicionesRetenciones::obtenerObjConfigCondicionesRetenciones($obj[0]['idcondicionesretenciones']);
        $objfinal->delete();
        return "ok";
    }
}
