<?php

class ConfPagosporresultadoModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function adicionarFormulas($idindicadorespagoresultado, $idexpresionmatematica, $tipoexpresion)
    {
        $obj = ConfIndicadorespagosporresultados::getByid($idindicadorespagoresultado);
        if ($tipoexpresion == 1)
            $obj->expresionmatematicaindicador = $idexpresionmatematica;
        else
            $obj->expresionmatematicaformula = $idexpresionmatematica;

        $obj->save();
        return 'ok';
    }

    public function limpiarFormulas($idtiponomina)
    {
//        //Borrando las fórmulas de  retención del tipo de nómina.
//        $obj = ConfIndicadorespagosporresultados::obtenerCondicionesRetencionesPorTipoNomina($idtiponomina);
//        $objfinal = ConfIndicadorespagosporresultados::obtenerObjConfigCondicionesRetenciones($obj[0]['idcondicionesretenciones']);
//        $objfinal->delete();
//        return "ok";
    }
}

