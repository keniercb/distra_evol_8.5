<?php

class HisVacacionesPersonaBajaModel extends ZendExt_Model
{
    public function HisVacacionesPersonaBajaModel ()
    {
        parent::ZendExt_Model();
    }

    public static function obtenerPersonasBajasPeriodo ($identidad, $mes, $anno)
    {
        $objhisvacacionesbajas = new HisVacacionesPersonaBaja();
        $objpersonasbajas = new HisPersonaBaja();
        $periodo = $mes . '-' . $anno;

        //Datos principales de las personas que fueron bajas y tienen operaciones en el periodo
        $personasbajasperiodo = $objpersonasbajas->obtenerDatosPrincipalesPersonasBajas($identidad, $periodo);

        //Operaciones del mes
        $oppersonas = $objhisvacacionesbajas->obtenerOperacionesPersonasBajas($identidad, $periodo);

        //Operaciones del mes anterior
        $mesanterior = (intval($mes) == 1) ? 12 : intval($mes) - 1;
        $annomesanterior = (intval($mes) == 1) ? $anno - 1 : $anno;
        $oppersonasmesanterior = $objhisvacacionesbajas->obtenerOperacionesPersonasBajas($identidad, ($mesanterior < 10 ? "0" . $mesanterior : $mesanterior) . "-" . $annomesanterior);


        $arrayidp = array();
        $arraypersonas = array();
        $cont = 0;
        //Personas con operaciones en el historico ese mes
        foreach($personasbajasperiodo as $i => $valor) {
            $nombrecompleto = (!empty($valor['snombre'])) ? $valor['nombre'] . " " . $valor['snombre'] . " " . $valor['papel'] . " " . $valor['sapel'] :
                $valor['nombre'] . " " . $valor['papel'] . " " . $valor['sapel'];
            $arraypersonas[$cont]['idarea'] = $valor['idplantillanominal'];
            $arraypersonas[$cont]['area'] = $valor['area'];
            $arraypersonas[$cont]['orden'] = $valor['orden'];
            $arraypersonas[$cont]['cdg'] = $valor['idcodigocontable'];
            $arraypersonas[$cont]['idpersona'] = $valor['idpersona'];
            $arraypersonas[$cont]['ci'] = $valor['numero'];
            $arraypersonas[$cont]['nombreyapellidos'] = $nombrecompleto;
            $arraypersonas[$cont]['tiempoacumuladoinicial'] = round($valor['tiempoacumuladoinicial'], 2);
            $arraypersonas[$cont]['importeacumuladoinicial'] = round($valor['importeacumuladoinicial'], 2);

            $acumulaciontotaldias = 0;
            $acumulaciontotalimporte = 0;
            $liquidaciontotaldias = 0;
            $liquidaciontotalimporte = 0;
            $ajustetiempo = 0;
            $ajusteimporte = 0;
            $tipoajuste = 0;
            $contultimoajuste = 0;
            foreach($oppersonas as $op) {
                if($op['idpersona'] == $valor['idpersona']){
                    if($op['tipooperacion'] == 1){
                        $acumulaciontotaldias += $op['tiempoacumulado'];
                        $acumulaciontotalimporte += $op['importeacumulado'];
                    }elseif($op['tipooperacion'] == 2){
                        $liquidaciontotaldias += $op['tiempoacumulado'];
                        $liquidaciontotalimporte += $op['importeacumulado'];
                    }

                    if(!empty($op['tipoajuste']) && empty($contultimoajuste)){
                        $ajustetiempo = ((empty($op['ajustetiempo'])) ? 0.00 : $op['ajustetiempo']);
                        $ajusteimporte = ((empty($op['ajusteimporte'])) ? 0.00 : $op['ajusteimporte']);
                        $tipoajuste = $op['tipoajuste'];
                        $contultimoajuste++;
                    }
                }
            }

            $rant = array();
            $c = 0;
            foreach($oppersonasmesanterior as $opant) {
                if($opant['idpersona'] == $valor['idpersona']){
                    $rant[$c]['saldoentiempo'] = $opant['saldoentiempo'];
                    $rant[$c]['saldoenimporte'] = $opant['saldoenimporte'];
                    $rant[$c]['todo'] = $opant;
                    $c++;
                }
            }
            //Si el mes anterior no tiene operaciones pero puede que tenga en otros meses anteriores
            if(count($rant) == 0){
                $idpersonabaja = $valor['idpersonabaja'];
                //Periodo exportar
                $rpb = explode('-', $periodo);
                $periodoexportar = $rpb[1].$rpb[0];
                //Arreglo de operaciones de esta persona
                $oppersonabaja = $objhisvacacionesbajas->obtenerHistoricoSubMayorBaja($idpersonabaja);
                $flagperiodoinf = 0;
                $operacioninf = array();
                //Recorriendo las operaciones para buscar una operacion de un mes inferior
                foreach ($oppersonabaja as $ropi){
                    $rpbi = explode('-', $ropi['periodo']);
                    $periodobuscarinferior = $rpbi[1].$rpbi[0];
                    if($periodobuscarinferior < $periodoexportar){
                        $rant[$c]['saldoentiempo'] = $ropi['saldoentiempo'];
                        $rant[$c]['saldoenimporte'] = $ropi['saldoenimporte'];
                        $rant[$c]['todo'] = $ropi;
                        $c++;
                        break;
                    }
                }
            }

            //saldoinicial del mes anterior
            $arraypersonas[$cont]['saldotiempomesanterior'] = (count($rant) > 0) ? $rant[0]['saldoentiempo'] : round($valor['tiempoacumuladoinicial'], 2);
            $arraypersonas[$cont]['saldoimportemesanterior'] = (count($rant) > 0) ? $rant[0]['saldoenimporte'] : round($valor['importeacumuladoinicial'], 2);

            //acumulado mes
            $arraypersonas[$cont]['tiempoacumulado'] = (!empty($acumulaciontotaldias)) ? $acumulaciontotaldias : 0.00;
            $arraypersonas[$cont]['importeacumulado'] = (!empty($acumulaciontotalimporte)) ? $acumulaciontotalimporte : 0.00;

            //liquidado mes
            $arraypersonas[$cont]['tiempoliquidado'] = (!empty($liquidaciontotaldias)) ? $liquidaciontotaldias : 0.00;
            $arraypersonas[$cont]['importeliquidado'] = (!empty($liquidaciontotalimporte)) ? $liquidaciontotalimporte : 0.00;

            //ajuste
            $arraypersonas[$cont]['ajustetiempo'] = (!empty($ajustetiempo)) ? $ajustetiempo : '';
            $arraypersonas[$cont]['ajusteimporte'] = (!empty($ajusteimporte)) ? $ajusteimporte : '';
            $arraypersonas[$cont]['tipoajuste'] = (!empty($tipoajuste)) ? $tipoajuste : 0;

            //saldo final
            $ajustetiempo = ($tipoajuste == 2) ? (-1) * $ajustetiempo : $ajustetiempo;
            $ajusteimporte = ($tipoajuste == 2) ? (-1) * $ajusteimporte : $ajusteimporte;
            $acumulaciontotaldiasmes = $acumulaciontotaldias - $liquidaciontotaldias + $ajustetiempo;
            $acumulaciontotalimportemes = $acumulaciontotalimporte - $liquidaciontotalimporte + $ajusteimporte;
            $arraypersonas[$cont]['saldoentiempo'] =round($arraypersonas[$cont]['saldotiempomesanterior'], 2) + round($acumulaciontotaldiasmes, 2);
            $arraypersonas[$cont]['saldoenimporte'] = round($arraypersonas[$cont]['saldoimportemesanterior'], 2) + round($acumulaciontotalimportemes, 2);
            $cont++;

            //ArrayIdP
            $arrayidp[] = $valor['idpersona'];
        }

        //Buscando las personas que no tienen operaciones ese mes pero si tienen operaciones meses anteriores y posteriores por tanto hay que agregarlas al arreglo con las personas
        $personasbajasnoperiodo = $objpersonasbajas->obtenerPersonasBajasQueNoEstanArrayIdPers($identidad, $arrayidp);
        $cont2 = (count($arraypersonas)>0)?(count($arraypersonas)):0;
        foreach ($personasbajasnoperiodo as $pbnp){
            $idpersonabaja = $pbnp['idpersonabaja'];
            //Periodo exportar
            $rpb = explode('-', $periodo);
            $periodoexportar = $rpb[1].$rpb[0];
            //Arreglo de operaciones de esta persona
            $oppersonabaja = $objhisvacacionesbajas->obtenerHistoricoSubMayorBaja($idpersonabaja);
            $flagperiodosup = 0; $flagperiodoinf = 0;
            //Recorriendo las operaciones para buscar una operacion de un mes superior
            foreach ($oppersonabaja as $rop){
                $rpbb = explode('-', $rop['periodo']);
                $periodobuscarsuperior = $rpbb[1].$rpbb[0];
                if($periodobuscarsuperior > $periodoexportar){
                    $flagperiodosup = 1;
                    break;
                }
            }
            $operacioninf = array();
            //Recorriendo las operaciones para buscar una operacion de un mes inferior
            foreach ($oppersonabaja as $ropi){
                $rpbi = explode('-', $ropi['periodo']);
                $periodobuscarinferior = $rpbi[1].$rpbi[0];
                if($periodobuscarinferior < $periodoexportar){
                    $flagperiodoinf = 1;
                    $operacioninf = $ropi;
                    break;
                }
            }
            //Cuando se cumpla esta condicion estamos en el caso  de una persona que es baja y el mes que se esta exportando no tiene operaciones y sin embargo tiene operaciones
            // en los meses anteriores y posteriores por tanto era alta en el periodo que se esta exportando
            if($flagperiodoinf == 1 && $flagperiodosup == 1){
                $arraypersonas[$cont2]['idarea'] = $pbnp['idplantillanominal'];
                $arraypersonas[$cont2]['area'] = $pbnp['plantilla'];
                $arraypersonas[$cont2]['orden'] = $pbnp['orden'];
                $arraypersonas[$cont2]['cdg'] = $pbnp['idcodigocontable'];
                $arraypersonas[$cont2]['idpersona'] = $pbnp['idpersona'];
                $arraypersonas[$cont2]['ci'] = $pbnp['numero'];
                $arraypersonas[$cont2]['nombreyapellidos'] = $pbnp['nombrecompleto'];
                $arraypersonas[$cont2]['tiempoacumuladoinicial'] = round($pbnp['tiempoacumuladoinicial'], 2);
                $arraypersonas[$cont2]['importeacumuladoinicial'] = round($pbnp['importeacumuladoinicial'], 2);
                $arraypersonas[$cont2]['saldotiempomesanterior'] = round($operacioninf['saldoentiempo'], 2);
                $arraypersonas[$cont2]['saldoimportemesanterior'] = round($operacioninf['saldoenimporte'], 2);
                $arraypersonas[$cont2]['tiempoacumulado'] = 0.00;
                $arraypersonas[$cont2]['importeacumulado'] = 0.00;
                $arraypersonas[$cont2]['tiempoliquidado'] = 0.00;
                $arraypersonas[$cont2]['importeliquidado'] = 0.00;
                $arraypersonas[$cont2]['saldoentiempo'] = round($operacioninf['saldoentiempo'], 2);
                $arraypersonas[$cont2]['saldoenimporte'] = round($operacioninf['saldoenimporte'], 2);
                $cont2++;

            }


        }

        return $arraypersonas;
    }
}
