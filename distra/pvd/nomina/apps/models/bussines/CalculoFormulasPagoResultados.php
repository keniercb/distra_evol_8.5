<?php

/*
* Author: Milena Gainza Rodríguez
* Version: 2.0
* Description:
*
* Este fichero se utiliza por la clase

*/

class CalculoFormulasPagoResultados extends ZendExt_Model
{
    //Arreglo que contiene los principales elementos de interes del pago
    public $arrayDetalles;
    public $arrayPersonasNopago;
    public $arrSumatoriaTotal;
    public $arrMontosFinales;
    public $contnoacceden;
    public $arraypersonasnopago;

    function __construct()
    {
        $this->arrayDetalles = Array();
        $this->arrayPersonasNopago = Array();
        $this->arrSumatoriaTotal = Array();
        $this->arrSumatoriaTotalEntidad = Array();
        $this->arraypersonasnopago = Array();
        $this->contnoacceden = 0;
    }

    public function llenarIndicadoresCondicionales($arrayPersonaValores, $indicadores)
    {
        foreach ($indicadores as $rind) {
            if ($rind['tipovalor'] == 3 /*&& $rind['obligatorio'] == 1*/) {
                foreach ($arrayPersonaValores as $rValores) {
                    $idpersona = $rValores['id'];
                    //Validando si la formula del indicador no tiene sumatoria - es una formula lineal
                    $arrformulaind = $this->ObtenerarrIdIndicadoresporExpresionMatematica($rind['expresionmatematicaindicador']);
                    $expresion = $this->BuscarTodosporarrIdExpresionMatematica(array($rind['expresionmatematicaindicador']));
                    $expmostrar = $expresion[0]['expresionacalcular'];
                    $arrayind = array();
                    $conteval = 0;
                    foreach ($arrformulaind as $rif) {
                        $rexplode = explode('_', $rif);
                        foreach ($indicadores as $rind2) {
                            if ($rind2['idindicadorespagoresultado'] == $rexplode[1]) {
                                $valind = $rValores[$rind2['denominacion']];
                                $arrayind[$conteval]['idindicador'] = $rif;
                                $arrayind[$conteval]['valor'] = (empty($valind)) ? 0 : $valind;
                                $conteval++;
                            }
                        }
                    }
                    $valorfind = $this->evaluarExpresionMatematica($arrayind, $expmostrar);
                    $arrayPersonaValores[$idpersona][$rind['denominacion']] = (!empty($valorfind->valor)) ? number_format($valorfind->valor, $rind['lugaresdecimales'], '.', '') : 0.00;
                }
            }return $arrayPersonaValores;
        }
        
    }

    public function Calcular($arrayPersonaValores, $indicadoresPagoAux, $personasPorAreasAux, $montosPorAreas, $tipocalculo, $fechainicio = null, $fechafin = null, $pagoxresultadosdestajo)
    {
        //Llenando los indicadores condicionales obligatorios
        $arrayPersonaValores = $this->llenarIndicadoresCondicionales($arrayPersonaValores, $indicadoresPagoAux);

        $indpagores = $indicadoresPagoAux[count($indicadoresPagoAux) - 1]['denominacion'];
        $indicadoresPago = $this->indexarArreglo($indicadoresPagoAux, 'idindicadorespagoresultado');
        $todasPersonasPorAreas = $this->indexarArreglo($personasPorAreasAux, 'idpersona');

        $arraypersonasnopagoaux = array();
        $arraypersonaspago = array();
        $contpersonasnopago = 0;
        $montosPorAreasReal = $montosPorAreas;
        foreach ($montosPorAreasReal as &$monto)
            $monto = 0.00;

        $personasPorAreas = array();
        foreach ($arrayPersonaValores as $ip => $persarea) {
            if($todasPersonasPorAreas[$ip]){
                $personasPorAreas[$ip] = $todasPersonasPorAreas[$ip];
                $personasPorAreas[$ip]['identidad'] = $persarea['identidad'];
            }
        }

        //Cantidad de personas por areas y total
        $totalpersonas = 0;
        $arrcantidadpersonasareas = array();$c = 0;
        foreach ($montosPorAreas as $ida=>$rmontoa){
            $contpareas = 0;
            foreach ($personasPorAreas as $iparea => $rparea) {
                $idpersonaarea = $rparea['idpersona'];
                if ($arrayPersonaValores[$idpersonaarea]) {
                    if($rparea['idarea'] == $ida){
                        $totalpersonas++;
                        $contpareas++;
                    }
                }
            }
            $arrcantidadpersonasareas[$ida]['idarea'] =  $ida;
            $arrcantidadpersonasareas[$ida]['cantidadpersonas'] =  $contpareas;
            $c++;
        }
        foreach ($indicadoresPago as $in => $rind) {
            $flagsumatoria = false;
            foreach ($personasPorAreas as $ipa => $ra) {
                $idpersona = $ra['idpersona'];
                $ci = $ra['ci'];
                if ($arrayPersonaValores[$idpersona]) {
                    $arraypersonaspago[$idpersona]['idpersona'] = $idpersona;
                    $arraypersonaspago[$idpersona]['ci'] = $ci;
                    $arraypersonaspago[$idpersona]['identidad'] = $ra['identidad'];
                    $arraypersonaspago[$idpersona]['nombreapellido'] = $ra['nombreapellido'];
                    $arraypersonaspago[$idpersona]['idarea'] = $ra['idarea'];
                    $arraypersonaspago[$idpersona]['area'] = $ra['area'];
                    $arrayPersonaValores[$idpersona]['idpersona'] = $idpersona;
                    $arrayPersonaValores[$idpersona]['area'] = $ra['area'];
                    $arrayPersonaValores[$idpersona]['idarea'] = $ra['idarea'];
                    switch ($rind['tipovalor']) {
                        //Campos de la nomina
                        case '1': {
                            if (!empty($arrayPersonaValores[$idpersona][$rind['denominacion']])) {
                                $arraypersonaspago[$idpersona][$rind['denominacion']] = $arrayPersonaValores[$idpersona][$rind['denominacion']];
                            } else {
                                if ($rind['obligatorio'] == 0) {
                                    $arraypersonaspago[$idpersona][$rind['denominacion']] = 0;
                                } else {
                                    $arraypersonaspago[$idpersona][$rind['denominacion']] = 0;
                                    $arraypersonasnopagoaux[$contpersonasnopago] = $idpersona;
                                    $contpersonasnopago++;
                                }

                            }
                            break;
                        }
                        //Reporte de entrada
                        case '2': {
                            if (!empty($arrayPersonaValores[$idpersona][$rind['denominacion']]))
                                $arraypersonaspago[$idpersona][$rind['denominacion']] = $arrayPersonaValores[$idpersona][$rind['denominacion']];
                            else {
                                if ($rind['obligatorio'] == 0) {
                                    $arraypersonaspago[$idpersona][$rind['denominacion']] = 0;
                                } else {
                                    $arraypersonaspago[$idpersona][$rind['denominacion']] = 0;
                                    $arraypersonasnopagoaux[$contpersonasnopago] = $idpersona;
                                    $contpersonasnopago++;
                                }
                            }
                            break;
                        }
                        //Calculables
                        case '3': {
                            if (($tipocalculo == 1 && $rind['recalculable'] != 1) || $tipocalculo == 2) {
                                $indcalculable = $rind;
                                if (!empty($rind['expresionmatematicaindicador'])) {//Validando si tiene formula indicador
                                    //Validando si la formula del indicador no tiene sumatoria - es una formula lineal
                                    $arrformulaind = $this->ObtenerarrIdIndicadoresporExpresionMatematica($rind['expresionmatematicaindicador']);
                                    $expresion = $this->BuscarTodosporarrIdExpresionMatematica(array($rind['expresionmatematicaindicador']));
                                    $expmostrar = $expresion[0]['expresionacalcular'];
                                    $conteval = 0;
                                    $arrayind = array();
                                    foreach ($arrformulaind as $rif) {
                                        $rexplode = explode('_', $rif);
                                        switch ($rexplode[0]) {
                                            //Salario Escala
                                            case 'SPC': {
                                                $valor = $personasPorAreas[$idpersona]['salarioescala'];
                                                $arrayind[$conteval]['idindicador'] = $rif;
                                                $arrayind[$conteval]['valor'] = (empty($valor)) ? 0 : $valor;
                                                $conteval++;
                                                break;
                                            }
                                            //Campos de la nomina
                                            case 'F': {
                                                $valor = $arraypersonaspago[$idpersona][$indicadoresPago[$rexplode[1]]['denominacion']];
                                                $arrayind[$conteval]['idindicador'] = $rif;
                                                $arrayind[$conteval]['valor'] = (empty($valor)) ? 0 : $valor;
                                                $conteval++;
                                                break;
                                            }
                                            case 'SUMATAREA': {
                                                $idexpresionformula = $rind['expresionmatematicaformula'];
                                                $valor = 0;
                                                //Pago * resultados
                                                if($pagoxresultadosdestajo == 1){
                                                    $valsumatoriaarea = $this->arrSumatoriaTotal[$indcalculable['idindicadorespagoresultado']][$ra['idarea']];
                                                    $valor = ($valsumatoriaarea) ? $this->arrSumatoriaTotal[$indcalculable['idindicadorespagoresultado']][$ra['idarea']] : $this->calcularValorSumatoria(
                                                        $arrayPersonaValores, $personasPorAreas, $indicadoresPago, $indcalculable, $ra['idarea'], $idexpresionformula, $fechainicio, $fechafin, $pagoxresultadosdestajo);
                                                    //Destajo
                                                }else{
                                                    $valsumatoriaarea = $this->arrSumatoriaTotal[$indcalculable['idindicadorespagoresultado']][$ra['idarea']];
                                                    $valor = ($valsumatoriaarea) ? $this->arrSumatoriaTotal[$indcalculable['idindicadorespagoresultado']][$ra['idarea']] : $this->calcularValorSumatoria(
                                                        $arrayPersonaValores, $personasPorAreas, $indicadoresPago, $indcalculable, $ra['idarea'], $idexpresionformula, $fechainicio, $fechafin, $pagoxresultadosdestajo);
                                                    //if($rind['denominacion'] == 'TSCalc'){print_r($this->arrSumatoriaTotal[$indcalculable['idindicadorespagoresultado']][$ra['idarea'].'-'.$fechainicio.'-'.$fechafin]);die;}
                                                }

                                                //if($rind['denominacion'] == 'TSCalc'){print_r($this->arrSumatoriaTotal);die;}
                                                $arrayind[$conteval]['idindicador'] = $rif;
                                                $arrayind[$conteval]['valor'] = (empty($valor)) ? 0 : $valor;
                                                $conteval++;
                                                $flagsumatoria = true;
                                                break;
                                            }
                                            case 'SUMATENT': {
                                                $idexpresionformula = $rind['expresionmatematicaformula'];
                                                $valor = 0;
                                                //Pago * resultados
                                                if($pagoxresultadosdestajo == 1){
                                                    $valsumatoriaarea = $this->arrSumatoriaTotalEntidad[$indcalculable['idindicadorespagoresultado']];
                                                    $valor = ($valsumatoriaarea) ? $this->arrSumatoriaTotalEntidad[$indcalculable['idindicadorespagoresultado']] : $this->calcularValorSumatoriaEntidad(
                                                        $arrayPersonaValores, $personasPorAreas, $indicadoresPago, $indcalculable, $ra['idarea'], $idexpresionformula, $fechainicio, $fechafin, $pagoxresultadosdestajo);

                                                    //Destajo
                                                }else{
                                                    $valsumatoriaarea = $this->arrSumatoriaTotalEntidad[$indcalculable['idindicadorespagoresultado']];
                                                    $valor = ($valsumatoriaarea) ? $this->arrSumatoriaTotalEntidad[$indcalculable['idindicadorespagoresultado']] : $this->calcularValorSumatoriaEntidad(
                                                        $arrayPersonaValores, $personasPorAreas, $indicadoresPago, $indcalculable, $ra['idarea'], $idexpresionformula, $fechainicio, $fechafin, $pagoxresultadosdestajo);
                                                    //if($rind['denominacion'] == 'TSCalc'){print_r($this->arrSumatoriaTotal[$indcalculable['idindicadorespagoresultado']][$ra['idarea'].'-'.$fechainicio.'-'.$fechafin]);die;}
                                                }

                                                //if($rind['denominacion'] == 'TSCalc'){print_r($this->arrSumatoriaTotal);die;}
                                                $arrayind[$conteval]['idindicador'] = $rif;
                                                $arrayind[$conteval]['valor'] = (empty($valor)) ? 0 : $valor;
                                                $conteval++;
                                                $flagsumatoria = true;
                                                break;
                                            }
                                            case 'MONTO': {
                                                $montoarea = $montosPorAreas[$ra['idarea']];
                                                $arrayind[$conteval]['idindicador'] = $rif;
                                                $arrayind[$conteval]['valor'] = (empty($montoarea)) ? 0 : $montoarea;
                                                $conteval++;
                                                break;
                                            }

                                            case 'CANTPERSAREA': {
                                                $cantidadpersonasarea = $arrcantidadpersonasareas[$ra['idarea']]['cantidadpersonas'];
                                                $arrayind[$conteval]['idindicador'] = $rif;
                                                $arrayind[$conteval]['valor'] = (empty($cantidadpersonasarea)) ? 0 : $cantidadpersonasarea;
                                                $conteval++;
                                                break;
                                            }
                                            case 'CANTPERSONAS': {
                                                $arrayind[$conteval]['idindicador'] = $rif;
                                                $arrayind[$conteval]['valor'] = (empty($totalpersonas)) ? 0 : $totalpersonas;
                                                $conteval++;
                                                break;
                                            }
                                        }
                                    }

                                    //Valor de la formula del indicador
                                    $valorfind = $this->evaluarExpresionMatematica($arrayind, $expmostrar);
                                    if (!empty($valorfind->valor)) {
                                        $arraypersonaspago[$idpersona][$rind['denominacion']] = number_format($valorfind->valor, $rind['lugaresdecimales'], '.', '');
                                        $arrayPersonaValores[$idpersona][$rind['denominacion']] = number_format($valorfind->valor, $rind['lugaresdecimales'], '.', '');
                                    } else {
                                        if ($rind['obligatorio'] == 0) {
                                            $arraypersonaspago[$idpersona][$rind['denominacion']] = 0.00;
                                            $arrayPersonaValores[$idpersona][$rind['denominacion']] = 0.00;
                                        } else {
                                            $arraypersonaspago[$idpersona][$rind['denominacion']] = 0.00;
                                            $arrayPersonaValores[$idpersona][$rind['denominacion']] = 0.00;

                                            $arraypersonasnopagoaux[$contpersonasnopago] = $idpersona;
                                            $contpersonasnopago++;
                                        }

                                    }

                                    //Valor final del pago por resultado
                                    if ($in == (count($indicadoresPago) - 1)) {
                                        $arraypersonaspago[$idpersona]['valorfinal'] = $arraypersonaspago[$idpersona][$rind['denominacion']];
                                    }

                                } else {//Validando si no tiene formula indicador
                                    return 'NO-FORMULA-IND';
                                }
                            } else {
                                $arraypersonaspago[$idpersona][$rind['denominacion']] = 0.00;
                            }

                            break;
                        }
                    }
                    $valpersona = (!empty($arraypersonaspago[$idpersona][$rind['denominacion']])) ? $arraypersonaspago[$idpersona][$rind['denominacion']] : 0;
                    $valpersona = number_format($valpersona, 7, '.', '');
                    $montosPorAreasReal[$ra['idarea']] += ($rind['resultadofinal'] == 1) ? $valpersona : 0;
                }

            }
            //}
        }//print_r($arraypersonaspago);die;

        $arraypersonaspagoaux = $arraypersonaspago;
        $arraypersonasnopagoaux = array_values(array_unique($arraypersonasnopagoaux));
        //$contnoacceden = 0;
        // foreach ($arraypersonasnopagoaux as $idnopago) {
        //     foreach ($arraypersonaspagoaux as $per => $personapaga) {
        //         if ($idnopago == $personapaga['idpersona']) {
        //             //Llenando el arreglo de personas que no acceden al pago por tener valores nulos
        //             $this->arraypersonasnopago[$this->contnoacceden]['idpersona'] = $personapaga['idpersona'];
        //             $this->arraypersonasnopago[$this->contnoacceden]['nombreapellido'] = $personapaga['nombreapellido'];
        //             $this->arraypersonasnopago[$this->contnoacceden]['idarea'] = $personapaga['idarea'];
        //             $this->arraypersonasnopago[$this->contnoacceden]['area'] = ($pagoxresultadosdestajo == 1)?$personapaga['area']:$personapaga['area'].'-'.$fechainicio.'-'.$fechafin;
        //             //Eliminando del arreglo de personas que acceden al pago los que tienen campos nulos
        //             unset($arraypersonaspago[$per]);
        //             $this->contnoacceden++;
        //         }
        //     }
        // }

        $arraypersonaspago = array_values($arraypersonaspago);
        $this->arrayPersonasNopago = $this->arraypersonasnopago;
        //Calculando la diferencias de montos totales menos montos reales
        foreach ($montosPorAreas as $i => $monto) {
            $this->arrMontosFinales[$i]['montototal'] = number_format($monto, 2, '.', '');
            $this->arrMontosFinales[$i]['montoreal'] = number_format($montosPorAreasReal[$i], 2, '.', '');
            $this->arrMontosFinales[$i]['diferencia'] = number_format(($monto - $montosPorAreasReal[$i]), 2, '.', '');
        }

        //Calculando el monto total
        $montototal = 0;
        $montoreal = 0;
        foreach ($montosPorAreas as $m => $monto) {
            $montototal += $monto;
            $montoreal += $montosPorAreasReal[$m];
        }

        $mayorsalario = 0;
        $menorsalario = 999999;

        foreach ($arraypersonaspago as $i => $rpp) {
            $mayorsalario = ($rpp[$indpagores] > $mayorsalario) ? $rpp[$indpagores] : $mayorsalario;
            $menorsalario = ($rpp[$indpagores] < $menorsalario) ? $rpp[$indpagores] : $menorsalario;
            $arraypersonaspago[$i]['area'] = ($pagoxresultadosdestajo == 1)?$arraypersonaspago[$i]['area']:$arraypersonaspago[$i]['area'].'-'.$fechainicio.'-'.$fechafin;
            //$arraypersonaspago[$i]['idpersona'] = $arraypersonaspago[$i]['idpersona'].'-'.$fechainicio.'-'.$fechafin;
        }

        //Salvando los datos globales
        $this->arrayDetalles['a1---Cant. personas']['cantidad'] = count($arraypersonaspago) + count($this->arraypersonasnopago);
        $this->arrayDetalles['a2---Cant. personas pago']['cantidad'] = count($arraypersonaspago);
        $this->arrayDetalles['a3---Cant. personas no pago']['cantidad'] = count($this->arraypersonasnopago);
        $this->arrayDetalles['a4---Mayor salario']['cantidad'] = number_format($mayorsalario, 2, '.', '');
        $this->arrayDetalles['a5---Menor salario']['cantidad'] = number_format($menorsalario, 2, '.', '');

        $this->arrayDetalles['a6---Monto total repartido']['cantidad'] = number_format($montototal, 2, '.', '');
        $this->arrayDetalles['a7---Monto real repartido']['cantidad'] = number_format($montoreal, 2, '.', '');
        $this->arrayDetalles['a8---Diferencia']['cantidad'] = number_format(($montototal - $montoreal), 2, '.', '');
        return $arraypersonaspago;
    }

    public function ObtenerarrIdIndicadoresporExpresionMatematica($idexpresionmatematica)
    {
        $dir = $_SERVER ['DOCUMENT_ROOT'] . "/pvd/comun/indicadoresexpresonmatematica/{$idexpresionmatematica}.iem";
        $fp = fopen($dir, "r");
        if ($fp == FALSE)
            return array();
        $contenido = fread($fp, filesize($dir));
        $s = unserialize($contenido);
        return $s;
    }

    /* Devuelve los datos de las expresiones matematicas dado un arreglo de id de expresiones matematicas */
    public function BuscarTodosporarrIdExpresionMatematica($arrIdexpresionmatematica)
    {
        $objExpMat = new DatExpresionmatematica();
        return $objExpMat->GetTodosporarrIdExpMat($arrIdexpresionmatematica);
    }

    public function dameDetallesPago()
    {
        return $this->arrayDetalles;
    }

    public function damePersonasExcluidas()
    {
        return $this->arrayPersonasNopago;
    }

    public function dameMontosFinales()
    {
        return $this->arrMontosFinales;
    }

    //Función que evalua la expresión matemática a calcular
    public function evaluarExpresionMatematica($arrIndicadoresValor, $expresionacalcular)
    {
        $r = new stdClass();
        /* Busco los indicadores dentro de la expresion matematica y compruebo que esten todos */
        /* Reemplaza los indicadores por sus valores */
        foreach ($arrIndicadoresValor as $i => $v) {
            $ind = 'I' . $v['idindicador'];

            /* Tiene en cuenta la exactitud de la variable */
            $expresionacalcular = preg_replace_callback(
                '/' . $ind . '(\D|\Z)/', function ($matches) use ($v) {
                return $v['valor'] . $matches[1];
            }, $expresionacalcular
            );
        }

        /* Reemplaza los operadores condicionales */
        $expresionacalcular = str_replace('SI_', ' if( ', $expresionacalcular);
        $expresionacalcular = str_replace('ENTONCES', ' ) ', $expresionacalcular);
        $expresionacalcular = str_replace('SINO', ' else ', $expresionacalcular);
        $expresionacalcular = str_replace('DEVOLVER', " \$resultadoexpresion = ", $expresionacalcular);

        /* Compruebo si quedaron indicadores sin reemplazar por su valor */
        $pos = strpos($expresionacalcular, 'I');
        if ($pos === FALSE) {
            /* Si me encuentro el operador if la expresion no se considera booleana y la expresion no es lineal */
            $esLineal = 1;
            if (strpos($expresionacalcular, 'if') !== FALSE) {
                $esbooleana = 0;
                $esLineal = 0;
            }

            /* Evaluo la expresion matematica y almaceno en la variable $resultadoexpresion el valor */
            try {
                /* Desabilito todos los errores */
                error_reporting(0);
                if ($esLineal == 1)
                    $expresionacalcular = "\$resultadoexpresion = " . $expresionacalcular . " ;";
                else
                    $expresionacalcular = "\$resultadoexpresion = NULL; " . $expresionacalcular;
                $resultado = eval($expresionacalcular);
                /* Si la funcion eval devuelve falso es que hubo error sino la expresion está bien */
                if ($resultado === false) {
                    $r->codigo = 3;
                    $r->valor = number_format(0, 2, '.', '');
                    $r->booleana = 0;
                    $r->expresionacalcular = $expresionacalcular;
                    $r->error = "Error de sintaxis en la formula a evaluar. Formula: " . $expresionacalcular;
                    return $r;
                }
            } catch (Exception $e) {
                throw $e;
            }

            $r->codigo = 1;
            $r->expresionacalcular = $expresionacalcular;
            $r->valor = $resultadoexpresion;

            /*
             * El valor a devolver siempre va a ser un objeto y con valor numérico
             * codigo: 1 ok, 3 error
             * booleana: 0 no, 1 si
             * valor: numero
             * error: Mensaje del error
             */
            return $r;
        } else {
            $r->codigo = 3;
            $r->booleana = 0;
            $r->valor = number_format(0, 2, '.', '');
            $r->expresionacalcular = $expresionacalcular;
            $r->error = "Existe(n) " . substr_count($expresionacalcular, 'I') . " indicador(es) que no se encuentra(n) en la expresi&oacute;n matem&aacute;tica. Formula: " . $expresionacalcular;
            return $r;
        }
    }

    //Función para calcular el valor de la sumatoria para un área especifica
    public function calcularValorSumatoria($arrayPersonasValores, $personasPorAreas, $indicadoresPago, $indicador, $idarea, $idexpresionformula, $fechainicio = null, $fechafin = null, $pagoxresultadosdestajo)
    {
        $respuesta = 0;
        if (!empty($idexpresionformula)) {//Validando si tiene formula sumatoria
            //Capturando los indicadores que conforman la fórmula de sumatoria
            $arrformulasumat = $this->ObtenerarrIdIndicadoresporExpresionMatematica($idexpresionformula);//print_r($arrformulasumat);die;
            $expresion = $this->BuscarTodosporarrIdExpresionMatematica(array($idexpresionformula));
            $expmostrar = $expresion[0]['expresionacalcular'];
            // Llenando el arreglo de todas las personas que acceden al pago por resultado
            foreach ($personasPorAreas as $ipa => $rpa) {
                $arrayind = array();
                $conteval = 0;
                $idpersona = $rpa['idpersona'];
                if ($arrayPersonasValores[$idpersona]['id'] == $idpersona && $rpa['idarea'] == $idarea) {
                    foreach ($arrformulasumat as $iri => $rif) {
                        $rexplode = explode('_', $rif);
                        $valor = $arrayPersonasValores[$idpersona][$indicadoresPago[$rexplode[1]]['denominacion']];
                        $arrayind[$conteval]['idindicador'] = $rif;
                        $arrayind[$conteval]['valor'] = (empty($valor)) ? 0 : $valor;
                        $conteval++;
                    }
                    $valorind = $this->evaluarExpresionMatematica($arrayind, $expmostrar);//if($idarea == 25 && $idpersona == 10110127){print_r($arrayPersonasValores[$idpersona]);die;}
                    $respuesta += ($valorind->codigo == 1) ? $valorind->valor : 0;
					//Pago x resultados
					if($pagoxresultadosdestajo == 1){
					  $this->arrSumatoriaTotal[$indicador['idindicadorespagoresultado']][$idarea] += ($valorind->codigo == 1) ? $valorind->valor : 0;
					//Destajo
					}else{
					  $this->arrSumatoriaTotal[$indicador['idindicadorespagoresultado']][$idarea.'-'.$fechainicio.'-'.$fechafin] += ($valorind->codigo == 1) ? $valorind->valor : 0; 
					 
					}
                    
                }

            }

            return $respuesta;
        } else
            return $respuesta;
    }

    //Función para calcular el valor de la sumatoria para en la Entidad
    public function calcularValorSumatoriaEntidad($arrayPersonasValores, $personasPorAreas, $indicadoresPago, $indicador, $idarea, $idexpresionformula, $fechainicio = null, $fechafin = null, $pagoxresultadosdestajo)
    {
        $respuesta = 0;
        if (!empty($idexpresionformula)) {//Validando si tiene formula sumatoria
            //Capturando los indicadores que conforman la fórmula de sumatoria
            $arrformulasumat = $this->ObtenerarrIdIndicadoresporExpresionMatematica($idexpresionformula);//print_r($arrformulasumat);die;
            $expresion = $this->BuscarTodosporarrIdExpresionMatematica(array($idexpresionformula));
            $expmostrar = $expresion[0]['expresionacalcular'];
            // Llenando el arreglo de todas las personas que acceden al pago por resultado
            foreach ($personasPorAreas as $ipa => $rpa) {
                $arrayind = array();
                $conteval = 0;
                $idpersona = $rpa['idpersona'];
                foreach ($arrformulasumat as $iri => $rif) {
                    $rexplode = explode('_', $rif);
                    $valor = $arrayPersonasValores[$idpersona][$indicadoresPago[$rexplode[1]]['denominacion']];
                    $arrayind[$conteval]['idindicador'] = $rif;
                    $arrayind[$conteval]['valor'] = (empty($valor)) ? 0 : $valor;
                    $conteval++;
                }
                $valorind = $this->evaluarExpresionMatematica($arrayind, $expmostrar);
                $respuesta += ($valorind->codigo == 1) ? $valorind->valor : 0;
                //Pago x resultados
                if($pagoxresultadosdestajo == 1){
                    $this->arrSumatoriaTotalEntidad[$indicador['idindicadorespagoresultado']] += ($valorind->codigo == 1) ? $valorind->valor : 0;
                    //Destajo
                }else{
                    //$this->arrSumatoriaTotalEntidad[$indicador['idindicadorespagoresultado']][$fechainicio.'-'.$fechafin] += ($valorind->codigo == 1) ? $valorind->valor : 0;

                }

            }

            return $respuesta;
        } else
            return $respuesta;
    }

    //Función para indexar un arreglo dado un índice
    public function indexarArreglo($array, $indice)
    {
        $arrayfinal = array();
        foreach ($array as $valor) {
            $arrayfinal[$valor[$indice]] = $valor;
        }
        return $arrayfinal;
    }

}
