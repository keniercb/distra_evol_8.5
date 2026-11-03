<?php

class ReclistadocuotasModel extends ZendExt_Model
{
    public function ReclistadocuotasModel ()
    {
        parent::ZendExt_Model();
    }

    public function obtenerAfiliados ($identidad, $arridfechascierre, $idorganizacion)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
        $arridelaborarpagos = array();
        foreach($arridfechascierre as $idfechacierre) {
            $arridelaborarpagos = array_merge($arridelaborarpagos, DatCierrePeriodosNomina::obtenerListadoPeriodosPagoDatCierrePeriodos($idfechacierre));
        }
        foreach($arridelaborarpagos as &$periodo) {
            $periodo = $periodo['idelaborarpagos'];
        }
        $cadenapagos = trim(implode(',', array_values(array_unique($arridelaborarpagos))), ',');

        $sql = " select distinct(dp.idpersona), ddi.numero, dp.nombre, dp.snombre, dp.papel, dp.sapel,
                   (CASE WHEN dp.snombre is not null THEN dp.snombre ELSE '' END) as snombre, daf.idafiliacion, nomo.idorganizacion, nomo.denominacion,
                   (CASE WHEN dco.idplantillanominal is not null THEN dco.idplantillanominal WHEN cpn.idplantillanominal is not null THEN cpn.idplantillanominal ELSE -1 END) as idarea,
                   ((CASE WHEN dco.idplantillanominal is not null THEN (select cpx.orden ||'-'|| cpx.denominacion from mod_nomina.conf_plantillanominal cpx where cpx.idplantillanominal = dco.idplantillanominal) WHEN cpn.denominacion <> '' THEN cpn.orden ||'-'|| cpn.denominacion ELSE 'Sin plantilla nominal' END)) as area
                   from mod_persona.dat_persona dp
                   left join mod_persona.dat_docidentidad ddi on (ddi.idpersona = dp.idpersona)
                   inner join mod_personaext.dat_afiliacion daf on (daf.idpersona = dp.idpersona)
                   inner join mod_personaext.nom_organizacion nomo on (nomo.idorganizacion = daf.idorganizacion)--politicas
                   inner join mod_nomina.dat_personaselaborarpagos dpep on(dpep.idpersona = dp.idpersona)
                   inner join mod_nomina.dat_elaborarpagos dep on(dep.idelaborarpagos = dpep.idelaborarpagos)
                   inner join mod_nomina.dat_cargosocupados dco on(dco.idpersona = dp.idpersona)
                   inner join mod_nomina.conf_plantillanominalcargo cpnca on(cpnca.idcargo = dco.idcargo)
                   inner join mod_nomina.conf_plantillanominal cpn on(cpn.idplantillanominal = cpnca.idplantillanominal)
                   where dep.identidad = ? and dco.identidad = ? and cpn.identidad = ? and nomo.idorganizacion = ? and dpep.idelaborarpagos IN({$cadenapagos})";
        $datos = $conn->fetchAll($sql, array($identidad, $identidad, $identidad, $idorganizacion));

        $r = array();
        foreach($datos as $persona) {
            $r[$persona['idpersona']] = $persona;
        }
        $conn->commit();
        return $r;
    }

    public function obtenerTiposPagoyFormulas ($identidad, $idconfafiliacion)
    {
        //Obteniendo los datos de la configuracion
        $tipospago = trim(ConfAfiliaciones::obtenerTiposPagoAfiliaciones($idconfafiliacion), ',');
        $arrtipospagoafiliacion = explode(',', $tipospago);

        //Obteniendo todos los tipos de pagos
        $arrtipospago = NomTipoPago::obtenerTodosTiposPago();
        $arrtipospago = $this->indexarArreglo($arrtipospago, 'idtipopago');

        $r = array();
        foreach($arrtipospagoafiliacion as $tipopago) {
            $r[$tipopago]['idtipopago'] = $tipopago;
            $r[$tipopago]['denominacion'] = $arrtipospago[$tipopago]['denominacion'];
        }

        //Obteniendo la formula de la escala
        $idformula = ConfAfiliaciones::obtenerFormulaEscala($idconfafiliacion);
        $idformuladevengado = ConfAfiliaciones::obtenerFormulaDevengadoTotal($idconfafiliacion);
        $arrfinal['tipospagos'] = $r;
        $arrfinal['idescala'] = $idformula;
        $arrfinal['iddevengado'] = $idformuladevengado;

        return $arrfinal;
    }

    public function indexarArreglo ($array, $indice)
    {
        $arrayfinal = array();
        foreach($array as $valor) {
            $arrayfinal[$valor[$indice]] = $valor;
        }
        return $arrayfinal;
    }

    public function obtenerPersonasAfiliadas ($identidad, $arridfechascierre, $idconfafiliacion, $idorganizacion)
    {
        $objCP = new DatCierrePeriodosNomina();
        //Obteniendo el arreglo de personas afiliadas PCC y UJC
        $arrpersonasafiliadas = $this->obtenerAfiliados($identidad, $arridfechascierre, $idorganizacion);

        //Obteniendo el arreglo de tipos de pagos y la escala a mostrar
        $arrtipospagoescala = $this->obtenerTiposPagoyFormulas($identidad, $idconfafiliacion);
        $tipospagos = "";
        foreach($arrtipospagoescala['tipospagos'] as $tp => $tipopago) {
            $tipospagos .= $tp . ',';
        }
        $tipospagos = trim($tipospagos, ',');

        //Obteniendo el arreglo de indicadores de la formula del salario devengado total
        $arrformuladevengado = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($arrtipospagoescala['iddevengado']);
        $expresiondevengado = ZendExt_IoC_Inter::getInstance()->comun->BuscarTodosporarrIdExpresionMatematica(array($arrtipospagoescala['iddevengado']));
        $expmostrardevengado = $expresiondevengado[0]['expresionacalcular'];

        $arridconceptos = array();
        foreach($arrformuladevengado as $ind) {
            list($tipoindicador, $idindicadorconcepto) = explode('_', $ind);
            if($tipoindicador == 'CRM')
                $arridconceptos[$ind] = DatDatosModeloNominaConceptos::obtenerIdEstructuraModeloNomina($identidad, "0_CRM_" . $idindicadorconcepto, 3, $tipospagos);
            elseif($tipoindicador == 'CA'){
                $arrtipopago = ConfigEstructurarModelosNomina:: obtenerTipoPagoXIdEstructuraMN($idindicadorconcepto);
                $arridconceptos[$ind][$arrtipopago[0]['idtipopago']] = $idindicadorconcepto;
            }
        }

        //Obteniendo el arreglo de indicadores de la formula de escala
        $arrformulaescala = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($arrtipospagoescala['idescala']);
        $expresionescala = ZendExt_IoC_Inter::getInstance()->comun->BuscarTodosporarrIdExpresionMatematica(array($arrtipospagoescala['idescala']));
        $expmostrarescala = $expresionescala[0]['expresionacalcular'];


        //Llenando el arreglo de personas afiliadas
        $arrayperiodospago = array();
        foreach($arridfechascierre as $idfechacierre) {//Fechas de cierre
            $rfechacierre = $objCP->obtenerListadoDatCierrePeriodos($idfechacierre);
            foreach($rfechacierre as $i => &$f) {//Datos fechas de cierre
                $idtipopago = DatElaborarPagos::obtenerTipoPagoPeriodo($f['idelaborarpagos']);
                $periodopago[$idtipopago] = DatNominaDatos::obtenerDatosNominaPorElaborarPago($f['idelaborarpagos']);
                foreach($arrtipospagoescala['tipospagos'] as $tp => $tipopago) {
                    foreach($periodopago[$tp] as $in => $nomina) {
                        foreach(unserialize($nomina['valores']) as $persona) {
                            $arrayperiodospago[$tp]['denomtipopago'] = $tipopago['denominacion'];
                            $arrayperiodospago[$tp][$persona['idpersona']] = $persona;
                        }
                    }

                }
            }
        }

        //Array de columnas que no tienen un total = 0
        $rtotalcolumnastipospagos = array();
        foreach($arrtipospagoescala['tipospagos'] as $tp) {
            $rtotalcolumnastipospagos[$tp['denominacion']] = 0;
        }

        //Arreglo final personas
        $arraydatos = array();
        $cont = 0;
        foreach($arrpersonasafiliadas as $idpersona => $p) {
            $devengadototal = 0;
            $arraydatos[$cont]['idpersona'] = $p['idpersona'];
            $arraydatos[$cont]['ci'] = $p['numero'];
            $arraydatos[$cont]['nombreapellidos'] = $p['nombre'] . ' ' . ((!empty($p['snombre'])) ? $p['snombre'] . ' ' : '') . $p['papel'] . ' ' . $p['sapel'];
            $arraydatos[$cont]['organizacion'] = $p['denominacion'];
            $arraydatos[$cont]['area'] = $p['area'];
            $arraydatos[$cont]['idarea'] = $p['idarea'];

            //Por cada tipo de pago en los que se encuentra la persona
            foreach($arrayperiodospago as $idtipopago => $tipopago) {
                $arraycampostipopago = array();
                //Llenando los campos a evaluar para la persona
                foreach($arridconceptos as $idconcepto => $concepto) {
                    //si el idestructuramn es vacio que ponga "c_000" en vez de "c" pues hay un campo en la persona que tiene esta denominacion
                    $idestructurarmodelonomina = (!empty($concepto[$idtipopago])) ? $concepto[$idtipopago] : '_000';
                    $valorcampo = (!empty($tipopago[$idpersona]['c' . $idestructurarmodelonomina])) ? $tipopago[$idpersona]['c' . $idestructurarmodelonomina] : 0;
                    $arraycampostipopago[$idconcepto] = $valorcampo;
                }


                //Evaluando los campos de la formula del devengado total
                $arrayind = array();
                $conteval = 0;
                foreach($arrformuladevengado as $rif) {
                    $arrayind[$conteval]['idindicador'] = $rif;
                    $arrayind[$conteval]['valor'] = $arraycampostipopago[$rif];
                    $conteval++;
                }

                $rcalculo = CalculoFormulasPagoResultados::evaluarExpresionMatematica($arrayind, $expmostrardevengado);
                $valordevengado = ($rcalculo->codigo == 1) ? $rcalculo->valor : null;
                $devengadototal += $valordevengado;

                //Guardando el valor por tiponomina
                $arraydatos[$cont][$tipopago['denomtipopago']] = number_format($valordevengado, 2, '.', '');

                //Llenando el arreglo final de elementos a mostrar
                $rtotalcolumnastipospagos[$tipopago['denomtipopago']] += $valordevengado;

            }

            //Evaluando el total para definir la escala
            $arrayind = array();
            $conteval = 0;
            foreach($arrformulaescala as $rif) {
                $arrayind[$conteval]['idindicador'] = $rif;
                $arrayind[$conteval]['valor'] = $devengadototal;
                $conteval++;
            }
            $rcalculo = CalculoFormulasPagoResultados::evaluarExpresionMatematica($arrayind, $expmostrarescala);
            $valorescala = ($rcalculo->codigo == 1) ? $rcalculo->valor : null;

            $arraydatos[$cont]['Total'] = number_format($devengadototal, 2, '.', '');
            $arraydatos[$cont]['Escala'] = number_format($valorescala, 2, '.', '');
            $arraydatos[$cont]['Redondeo'] = ($devengadototal != 0.00)?number_format(round($arraydatos[$cont]['Escala']), 2, '.', ''):$arraydatos[$cont]['Escala'];//Si la persona no tiene salario se devuelve la escala configurada(0.20)
            $arraydatos[$cont]['Pago'] = number_format($arraydatos[$cont]['Redondeo'], 2, '.', '');
            $cont++;
        }

        //print_r($rtotalcolumnastipospagos);die;
        //Array de columnas dinámicas
        $arraycolumnas = array();
        foreach($rtotalcolumnastipospagos as $i => $tp) {
            if(!empty($tp)){
                $arraycolumnas[] = $i;
            }
        }
        $arraycolumnas[] = 'Total';
        $arraycolumnas[] = 'Escala';
        $arraycolumnas[] = 'Redondeo';
        $arraycolumnas[] = 'Pago';
        $r['personas'] = $arraydatos;
        $r['columnas'] = $arraycolumnas;
        return $r;
    }

}
