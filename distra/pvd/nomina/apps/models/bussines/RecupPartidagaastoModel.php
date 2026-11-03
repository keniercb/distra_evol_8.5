<?php
class RecupPartidagaastoModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public function RecupPartidagaastoModel()
    {
        parent::ZendExt_Model();
    }


    public function listarpornominapartidasgasto($idelaborarpagos, $identidad, $tipo)
    {
        $cont = 0;
        $bool = DatPartidagasto::existe($identidad,$tipo);
        if ($bool) {
            DatPartidagasto::DeleteAll($identidad,$tipo);
         }

        foreach ($idelaborarpagos as $k => $v) {//arreglo de idelaborar pagos segun ls nominas seleccionadas
            $respuesta = DatElaborarPagos::listarpornominapartidasgasto($v, $identidad, $tipo);//contiene los campos serializados de la nomina

            foreach ($respuesta as $kr => $vr) {
                $campo = ConfigConceptosContables::getidestructuramodelonomina($vr['idtiponomina']); //devuelve el idestructuramodelonomina y partida de gasto asociada
                foreach ($campo as $kc => $vc) {
                    $valores = unserialize($vr['valores']);
                    $cant = 0;
                    $importe = 0;
                    foreach ($valores as $kd => $vd) {
                        if ($vd['c'.$vc['idestructuramodelodomina']] > 0) {
                            $cant++;
                            $importe = +$vd['c' . $vc['idestructuramodelodomina']];

                        }
                    }
                    if($importe>0){
                        $aux[$cont]['idpartidagasto'] = $vc['idpartidagasto'];
                        $aux[$cont]['idtiponomina'] = $vr['idtiponomina'];
                        $aux[$cont]['nomenclador'] = $vr['nomenclador'];
                        $aux[$cont]['partida'] = $vc['partida'];
                        $aux[$cont]['importe'] = $importe;
                        $aux[$cont]['cant'] = $cant;
                        $aux[$cont]['cajacajero'] = $tipo;
                        $aux[$cont]['identidad'] = $cant;
                        $aux[$cont]['isespecialidad'] = 1;
                        $cont++;

                        $objPartida = new DatPartidagasto();
                        $objPartida->idestructura = $identidad;
                        $objPartida->idtiponomina = $vr['idtiponomina'];
                        $objPartida->cantpersonas = $cant;
                        $objPartida->valor =$importe;
                        $objPartida->cajacajero =$tipo;
                        $objPartida->idespecialidad =1;
                        $objPartida->save();
                   }

//                    $respuesta[$kr]['importe']=$cant;
//                    $respuesta[$kr]['cant']=$importe;
                }
            }
        }

   // print_r($aux);die;

        return $aux;
    }

}
