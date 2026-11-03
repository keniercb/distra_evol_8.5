<?php

/** Include PHPExcel */
class CalcularPagoModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    public $objPago;
    public $objAreas;
    public $objPeriodos;
    public $objcargosOcupados;
    public $objIndicadoresPago;

    public function CalcularPagoModel()
    {
        $this->objPago = new ConfPagosporresultado();
        $this->objAreas = new ConfPagosporresultadoarea();
        $this->objPeriodos = new ConfPagosporresultadoperiodopago();
        $this->objcargosOcupados = new DatCargosOcupados();
        $this->objDatNomiDatos = new DatNominaDatos();
        $this->objIndicadoresPago = new ConfIndicadorespagosporresultados();
        parent::ZendExt_Model();

    }

    /*Listar los pagos correspondientes a las  entidades
    * seleccionadas
     *
     */
    public function listarPagosPorResultado($identidad, $tipo, $idpagoporresultado)
    {
        $areasCargos = new NomAreasCargos();
        $pagosEntidades = ConfPagosporresultado::devPagosPorResultadosPorEntidades($identidad, $tipo, $idpagoporresultado);
        $confpagofecha = new ConfPagosporresultadofechas();
        $objNomTipoPago = new NomTipoPago();
        if (!empty($pagosEntidades)) {
            foreach ($pagosEntidades as $posc => &$valorPago) {
                //Buscando los periodos de Pagos asociados
                $datosPeriodosPago = $this->objPeriodos->getPeriodosdePagosPorIdPago($valorPago['idpagoporresultado'],$identidad);
                $valorPago['pagos'] = $datosPeriodosPago;
                //Buscando las areas asociadas
                $datosAreas = $this->objAreas->getAreasPagoPorResultadoDadoIdPago($identidad, $valorPago['idpagoporresultado']);
                if (count($datosAreas) > 0) {
                    foreach ($datosAreas as $ida => $rda) {
                        $monto = $this->objAreas->getMontoAreaPagoPorResultado($rda['idarea'], $rda['idpagoporresultado']);
                        $datosAreas[$ida]['monto'] = (!empty($monto)) ? $monto : 0.00;
                        if ($rda['composicion'] == 2) {
                            $arrayentidades = array();
                            $entidades = $areasCargos->obtenerCargosRegistradorByIdEstruc($identidad);
                            if (count($entidades) > 0) {
                                foreach ($entidades as $identidadaux) {
                                    $arrayentidades[] = $identidadaux['idcargo'];
                                }
                            }
                            $datosAreas[$ida]['entidades'] = $arrayentidades;
                        }
                    }
                }
                $valorPago['areas'] = $datosAreas;
                $pagoresdestajo = $objNomTipoPago->obtenerPagoxResultadosDestajo($valorPago['idtipopago']);
                $arrayfechas = $confpagofecha->obtenerArrayXIdEntidad($valorPago['idpagoporresultado'], $identidad);
                $valorPago['fechainicio'] = $arrayfechas[0]['fechainicio'];
                $valorPago['fechafin'] = $arrayfechas[0]['fechafin'];
                $valorPago['pagoxresultadosdestajo'] = $pagoresdestajo;
            }
        }
        return $pagosEntidades;
    }

    /* Guarda los periodos de pagos y las areas con sus montos de un pago derterminado
     *
     *
     * */
    public function guardarAreasyPeriodosDePagos($idpagoresultado, $arrayPeriodosPagos, $objAreas, $fechainicio, $fechafin, $identidad, $pagoxresultadosdestajo)
    {
        //Pago x resultados con monto y periodoas de pago
        if ($pagoxresultadosdestajo == 1) {
            //Elimino las areas
            foreach ($objAreas as $idarea => $area) {
                ConfPagosporresultadoarea::eliminarAreasDelPago($idpagoresultado, $idarea);
            }

            //Eliminolos pagos configurados
            ConfPagosporresultadoperiodopago::eliminarPeriodosDelPago($idpagoresultado);

            //Obj de pagos por resultados
            $objPagoResultado = $this->objPago->getPagoPorId($idpagoresultado);

            if(count($arrayPeriodosPagos)>0){
                $coleccionPagos = new Doctrine_Collection('ConfPagosporresultadoperiodopago');
                foreach ($arrayPeriodosPagos as $keyPagos => $valuePagos) {
                    $coleccionPagos[$keyPagos]->idpagoporresultado = $idpagoresultado;
                    $coleccionPagos[$keyPagos]->idelaborarpagos = $valuePagos;
                }
                $objPagoResultado->ConfPagosporresultadoperiodopago = $coleccionPagos;
                $objPagoResultado->save();
            }

            if(count($objAreas)>0){
                $coleccionAreas = new Doctrine_Collection('ConfPagosporresultadoarea');
                foreach ($objAreas as $keyAreas => $valueAreas) {
                    $coleccionAreas[$keyAreas]->idpagoporresultado = $idpagoresultado;
                    $coleccionAreas[$keyAreas]->idarea = $valueAreas->idarea;
                    $coleccionAreas[$keyAreas]->monto = $valueAreas->monto;
                }
                $objPagoResultado->ConfPagosporresultadoarea = $coleccionAreas;
                $objPagoResultado->save();
            }

        //Destajo
        } else if ($pagoxresultadosdestajo == 2) {
            //Eliminolos pagos configurados
            ConfPagosporresultadoperiodopago::eliminarPeriodosDelPago($idpagoresultado);

            $coleccionPagos = new Doctrine_Collection('ConfPagosporresultadoperiodopago');
            if(count($arrayPeriodosPagos)>0){
                foreach ($arrayPeriodosPagos as $keyPagos => $valuePagos) {
                    $coleccionPagos[$keyPagos]->idpagoporresultado = $idpagoresultado;
                    $coleccionPagos[$keyPagos]->idelaborarpagos = $valuePagos;
                }
                $objPagoResultado = $this->objPago->getPagoPorId($idpagoresultado);
                $objPagoResultado->ConfPagosporresultadoperiodopago = $coleccionPagos;
                $objPagoResultado->save();
            }
        }
        //Save fechas
        $arrfechas = ConfPagosporresultadofechas::obtenerArrayXIdEntidad($idpagoresultado, $identidad);
        if (count($arrfechas) == 0) {
            $objPagoResultadoFechas = new ConfPagosporresultadofechas();
            $objPagoResultadoFechas->idpagoporresultado = $idpagoresultado;
            $objPagoResultadoFechas->fechainicio = $fechainicio;
            $objPagoResultadoFechas->fechafin = $fechafin;
            $objPagoResultadoFechas->identidad = $identidad;
            $objPagoResultadoFechas->save();
        } else {
            $objPagoResultadoFechas = ConfPagosporresultadofechas::getPPorId($arrfechas[0]['idpagoporresultadofechas']);
            $objPagoResultadoFechas->fechainicio = $fechainicio;
            $objPagoResultadoFechas->fechafin = $fechafin;
            $objPagoResultadoFechas->save();
        }
        return $objPagoResultado->idpagoporresultado;
    }

    public function sincronizarFormulasPagoxResultados($idpagoresultado){
        $iocInterno = ZendExt_IoC_Inter::getInstance();
        $arrexpresionesmatematicas = array();
        $indicadoresPago = $this->objIndicadoresPago->ObtenerIndicadorespagosporresultadosid($idpagoresultado);
        if(count($indicadoresPago)>0){
            foreach ($indicadoresPago as $rind){
                //Si es un valor calculable
                if($rind['tipovalor'] == 3){
                    if($rind['expresionmatematicaindicador']){
                        $arrexpresionesmatematicas[] = $rind['expresionmatematicaindicador'];
                    }
                    if($rind['expresionmatematicaformula']){
                        $arrexpresionesmatematicas[] = $rind['expresionmatematicaformula'];
                    }
                }
            }
        }
        //Si el pago por resultados tiene formulas
        if(count($arrexpresionesmatematicas)>0){
            $respuesta = $iocInterno->comun->GuardarExpresionesMatematicas($arrexpresionesmatematicas);
            return $respuesta;
        //Sino tiene formulas
        }else{
            $respuesta = 'ok';
            return $respuesta;
        }
    }

    public function realizarCalculoPago($idpagoresultado, $objPagos, $objAreas, $identidad, $fechainicio, $fechafin, $composicion, $tipocalculo, $areasmontosredist, $datosfechadestajo, $pagoxresultadosdestajo)
    {
        //Sincronizando las formulas del pago por resultados
        $respuesta = $this->sincronizarFormulasPagoxResultados($idpagoresultado);
        if($respuesta == 'ok'){
            $objNomina = new DatGestionarNominasModel();
            $objClaseCalculo = new CalculoFormulasPagoResultados();
            //Buscando los indicadores del Pago
            $indicadoresPago = $this->objIndicadoresPago->ObtenerIndicadorespagosporresultadosid($idpagoresultado);

            //Buscando las personas por cada una de las areas que entran en el pago
            $varAux = $this->devPersonaPorArea($objAreas, $identidad, $composicion, $idpagoresultado);
            $personasPorAreas = $varAux['personas'];
            $montosPorAreas = $varAux['montos'];

            $arrayentidades = array();
            if ($tipocalculo == 1) {
                $indicadoresPago = array_values($indicadoresPago);

                //Buscando el idtiponomina para el idtipopago
                if (!empty($objPagos)) {
                    foreach ($objPagos as &$p) {
                        $p->tiponomina = ConfigModeloNomina::obtenerIdTiposNominaporTipoPago($p->idelaborarpagos)[0]['idtiponomina'];
                        $p->identidad = DatElaborarPagos::obtenerEntidadPeriodo($p->idelaborarpagos);
                        $arrayentidades[] = $p->identidad;
                    }
                }
                $arrayentidades = array_unique($arrayentidades);
                $arrayentidades = ($composicion == 2) ? implode(',', $arrayentidades) : $identidad;
                $arrayReporte = array();
                //Si es un pago x resultados se busca en los reportes en base al rango de fechas de las entradas generales
                if ($pagoxresultadosdestajo == 1) {
                    $arrayReporte = $this->buscarValoresReportesEntrada($indicadoresPago, $arrayentidades, $fechainicio, $fechafin);
                    //Conformando el arrego general para aplicar la formula del pago
                    $arrayPersonaValores = $this->buscarSBCyValoresReportesPorPagos($objPagos, $arrayReporte, $indicadoresPago, $idpagoresultado, $pagoxresultadosdestajo, $personasPorAreas, $identidad);

                    if (!is_string($arrayPersonaValores)) {
                        if (($arrayPersonaValores->flarind == 0) || ($arrayPersonaValores->flarind == 1 && is_array($arrayPersonaValores->arrayp))) {
                            $personasPago = $objClaseCalculo->Calcular($arrayPersonaValores->arrayp, $indicadoresPago, $personasPorAreas, $montosPorAreas, $tipocalculo, $fechainicio, $fechafin, $pagoxresultadosdestajo);

                            //Obteniendo las diferencias de montos a repartir
                            $montos = $objClaseCalculo->dameMontosFinales();
                            //print_r($montos);die;
                            //Guardando las cantidades de personas por areas
                            $arrpersonasareas = array();
                            if ($composicion == 1) {//Por Areas
                                foreach ($montosPorAreas as $a => $mont) {
                                    $cont = 0;
                                    foreach ($personasPago as $persona) {
                                        if ($a == $persona['idarea']) {
                                            $cont++;
                                            $arrpersonasareas[$a]['denominacion'] = $persona['area'];
                                            $arrpersonasareas[$a]['cantidad'] = $cont;

                                            $arrpersonasareas[$a]['montototal'] = (!empty($montos[$a]['montototal'])) ? $montos[$a]['montototal'] : 0.00;
                                            $arrpersonasareas[$a]['montoreal'] = $montos[$a]['montoreal'];
                                            $arrpersonasareas[$a]['diferencia'] = $montos[$a]['diferencia'];
                                        }
                                    }
                                }
                            } else {//Por Entidades
                                $entidades = array();
                                foreach ($personasPago as $persona) {
                                    $entidades[$persona['area']] = 0;
                                }
                                foreach ($entidades as $e => $entidad) {
                                    $cont = 0;
                                    foreach ($personasPago as $persona) {
                                        if ($e == $persona['area']) {
                                            $cont++;
                                            $arrpersonasareas[$e]['denominacion'] = $persona['area'];
                                            $arrpersonasareas[$e]['cantidad'] = $cont;
                                        }
                                    }
                                }
                            }

                            $varRetorno['pago'] = $personasPago;
                            $varRetorno['indicadorespago'] = $indicadoresPago;

                            //Detalles
                            $varRetorno['detalles'] = $objClaseCalculo->dameDetallesPago();
                            $orden = 1;
                            $divisor = 2;
                            foreach ($arrpersonasareas as $a => $area) {
                                $codigoorden = $objNomina->fnOrganizarPlantillas($orden, $divisor);
                                $varRetorno['detalles']['z' . $codigoorden . '---' . $area['denominacion']]['cantidad'] = $area['cantidad'];
                                $varRetorno['detalles']['z' . $codigoorden . '---' . $area['denominacion']]['montototal'] = $area['montototal'];
                                $varRetorno['detalles']['z' . $codigoorden . '---' . $area['denominacion']]['montoreal'] = $area['montoreal'];
                                $varRetorno['detalles']['z' . $codigoorden . '---' . $area['denominacion']]['diferencia'] = $area['diferencia'];
                                $orden++;
                            }
                            $arrdetalles = array();
                            $cont = 0;
                            foreach ($varRetorno['detalles'] as $d => $detalle) {
                                $arrdetalles[$cont]['id'] = $cont + 1;
                                $arrdetalles[$cont]['denominacion'] = $d;
                                $arrdetalles[$cont]['valor'] = $detalle['cantidad'];
                                $arrdetalles[$cont]['montototal'] = $detalle['montototal'];
                                $arrdetalles[$cont]['montoreal'] = $detalle['montoreal'];
                                $arrdetalles[$cont]['diferencia'] = $detalle['diferencia'];
                                $arrdetalles[$cont]['tipodatos'] = (substr($d, 0, 1) === 'z') ? 'Personas por &aacute;reas' : 'Generales';
                                $cont++;
                            }
                            $varRetorno['detalles'] = $arrdetalles;
                            $varRetorno['nopago'] = $objClaseCalculo->damePersonasExcluidas();
                            $varRetorno['indicadoresnopago'] = array();
                            foreach ($indicadoresPago as $keyindicador => $valorIndicador) {
                                if ($valorIndicador['tipovalor'] == 1 || $valorIndicador['tipovalor'] == 2) {
                                    $varRetorno['indicadoresnopago'][] = $valorIndicador;
                                    foreach ($varRetorno['nopago'] as $p => &$pnopago) {
                                        $pnopago[$valorIndicador['denominacion']] = $arrayReporte[$valorIndicador['denominacion']][$pnopago['idpersona']];
                                    }
                                }
                            }

                            /* Guardo el archivo con los datos serializados */
                            $register = Zend_Registry::getInstance();
                            $nombreArchivo = "pr-" . $identidad . "-" . $idpagoresultado; //. "-" . rand(1, 1000);
                            $direccionarchivo = $register->config->modulo_path . 'models/bussines/calculopago/' . $nombreArchivo . ".txt";
                            $varRetorno['referencia'] = $nombreArchivo;
                            $f = fopen($direccionarchivo, 'w');
                            $datosfichero = array();
                            $datosfichero['detallesgenerales'] = $varRetorno;
                            $datosfichero['personas'] = $personasPago;
                            fclose($f);
                            file_put_contents($direccionarchivo, serialize($datosfichero));

                            //print_r($varRetorno);die;
                            return $varRetorno;
                        } else {
                            return $arrayPersonaValores->arrayp;
                        }
                    } else {
                        return $arrayPersonaValores;
                    }
                    //Si es un destajo
                } else if($pagoxresultadosdestajo == 2){
                    //Recorriendo las fechas del destajo
                    if (count($datosfechadestajo) > 0) {
                        $objDatPeriodoDestajo = new DatPeriodoDestajo();
                        $contp = 0;
                        $arraypp = array();
                        foreach ($datosfechadestajo as $ipd => $idperiodosdestajo) {
                            $rperiododest = $objDatPeriodoDestajo->obtenerPeriodosDestajo($idperiodosdestajo);
                            $fechainiciodestajo = $rperiododest[0]['fechainicio'];
                            $fechafindestajo = $rperiododest[0]['fechafin'];
                            $arrayReporte = $this->buscarValoresReportesEntrada($indicadoresPago, $arrayentidades, $fechainiciodestajo, $fechafindestajo);

                            $arrayPersonaValores = $this->buscarSBCyValoresReportesPorPagos($objPagos, $arrayReporte, $indicadoresPago, $idpagoresultado, $pagoxresultadosdestajo, $personasPorAreas, $identidad);

                            if (is_array($arrayPersonaValores->arrayp)) {
                                $personasPago = $objClaseCalculo->Calcular($arrayPersonaValores->arrayp, $indicadoresPago, $personasPorAreas, $montosPorAreas, $tipocalculo, $fechainiciodestajo, $fechafindestajo, $pagoxresultadosdestajo);//print_r($personasPago);die;
                                foreach ($personasPago as $rpp)
                                    array_push($arraypp, $rpp);


                            }

                        }//print_r($arraypp);die;
                        $varRetorno['pago'] = $arraypp;
                        $varRetorno['indicadorespago'] = $indicadoresPago;//print_r($arraypp);die;
                        $varRetorno['detalles'] = $objClaseCalculo->dameDetallesPago();
                        $varRetorno['nopago'] = $objClaseCalculo->damePersonasExcluidas();
                        $varRetorno['indicadoresnopago'] = array();
                        /* Guardo el archivo con los datos serializados */
                        $register = Zend_Registry::getInstance();
                        $nombreArchivo = "pr-" . $identidad . "-" . $idpagoresultado; //. "-" . rand(1, 1000);
                        $direccionarchivo = $register->config->modulo_path . 'models/bussines/calculopago/' . $nombreArchivo . ".txt";
                        $varRetorno['referencia'] = $nombreArchivo;
                        $f = fopen($direccionarchivo, 'w');
                        $datosfichero = array();
                        $datosfichero['detallesgenerales'] = $varRetorno;
                        $datosfichero['personas'] = $arraypp;
                        fclose($f);
                        file_put_contents($direccionarchivo, serialize($datosfichero));
                        return $varRetorno;
                    }
                }
            } else if ($tipocalculo == 2) {
                //Obteniendo las personas del fichero
                $register = Zend_Registry::getInstance();
                $nombreArchivo = "pr-" . $identidad . "-" . $idpagoresultado;
                $direccionarchivo = $register->config->modulo_path . 'models/bussines/calculopago/' . $nombreArchivo . ".txt";
                $datospersonas = unserialize(file_get_contents($direccionarchivo));
                //Obteniendo los indicadores de tipovalor 1(camposnomina) y 2(reporte)
                $camponomina = '';
                $camposreporte = array();
                $camporecalculable = '';
                $camporesultadofinal = '';
                foreach ($indicadoresPago as $rind) {
                    if ($rind['tipovalor'] == 1) {
                        $camponomina = $rind['denominacion'];
                    }
                    if ($rind['tipovalor'] == 2) {
                        $camposreporte[] = $rind['denominacion'];
                    }

                    if ($rind['tipovalor'] == 3 && $rind['recalculable'] == 1) {
                        $camporecalculable = $rind['denominacion'];
                    }

                    if ($rind['tipovalor'] == 3 && $rind['resultadofinal'] == 1) {
                        $camporesultadofinal = $rind['denominacion'];
                    }
                }

                //Obteniendo solo las personas de las areas a redistribuir los nuevos montos
                $arrayPersonaValores = new stdClass();
                $personasPorAreasReal = array();
                $montosPorAreas = array();
                foreach ($areasmontosredist as $a => &$area) {
                    $area = (array)$area;
                    //Llenando el arreglo de personas con el valor de campo de la nomina y de reportes
                    foreach ($datospersonas['detallesgenerales']['pago'] as $persona) {
                        if ($persona['idarea'] == $area['idarea']) {
                            $arrayPersonaValores->arrayp[$persona['idpersona']]['id'] = $persona['idpersona'];
                            $arrayPersonaValores->arrayp[$persona['idpersona']]['identidad'] = $persona['identidad'];
                            $arrayPersonaValores->arrayp[$persona['idpersona']]['nombreapellido'] = $persona['nombreapellido'];
                            $arrayPersonaValores->arrayp[$persona['idpersona']][$camponomina] = $persona[$camponomina];
                            if (!empty($camposreporte)) {
                                foreach ($camposreporte as $campo) {
                                    $arrayPersonaValores->arrayp[$persona['idpersona']][$campo] = $persona[$campo];
                                }
                            }
                        }
                    }

                    //Redefiniendo el arreglo de personas por areas
                    foreach ($personasPorAreas as $personaarea) {
                        if ($personaarea['idarea'] == $area['idarea']) {
                            $personasPorAreasReal[] = $personaarea;
                        }
                    }

                    //Llenando el array de montos por areas
                    $montosPorAreas[$area['idarea']] = number_format($area['monto'], 2, '.', '');;

                }

                //Recalculando el pago por resultado
                $personasPagoRecalculo = $objClaseCalculo->Calcular($arrayPersonaValores->arrayp, $indicadoresPago, $personasPorAreasReal, $montosPorAreas, $tipocalculo);

                //Obteniendo las diferencias de montos a repartir
                foreach ($datospersonas['detallesgenerales']['pago'] as $ip => &$persona) {
                    foreach ($personasPagoRecalculo as $personarec) {
                        if ($persona['idpersona'] == $personarec['idpersona']) {
                            $datospersonas['detallesgenerales']['pago'][$ip][$camporecalculable] = $personarec[$camporecalculable];
                            $datospersonas['detallesgenerales']['pago'][$ip][$camporesultadofinal] += $personarec[$camporecalculable];
                        }
                    }
                }

                foreach ($datospersonas['personas'] as $ip => &$persona) {
                    foreach ($personasPagoRecalculo as $personarec) {
                        if ($persona['idpersona'] == $personarec['idpersona']) {
                            $datospersonas['personas'][$ip][$camporecalculable] = $personarec[$camporecalculable];
                            $datospersonas['personas'][$ip][$camporesultadofinal] += $personarec[$camporecalculable];
                        }
                    }
                }
                //print_r($datospersonas);die;
                //Guardando las cantidades de personas por areas
                $arrpersonasareas = array();
                if ($composicion == 1) {//Por Areas
                    foreach ($montosPorAreas as $a => $mont) {
                        $cont = 0;
                        foreach ($datospersonas['detallesgenerales']['pago'] as $persona) {
                            if ($a == $persona['idarea']) {
                                $cont++;
                                $arrpersonasareas[$a]['denominacion'] = $persona['area'];
                                $arrpersonasareas[$a]['cantidad'] = $cont;
                            }
                        }
                    }
                } else {//Por Entidades
                    $entidades = array();
                    foreach ($datospersonas['detallesgenerales']['pago'] as $persona) {
                        $entidades[$persona['area']] = 0;
                    }
                    foreach ($entidades as $e => $entidad) {
                        $cont = 0;
                        foreach ($datospersonas['detallesgenerales']['pago'] as $persona) {
                            if ($e == $persona['area']) {
                                $cont++;
                                $arrpersonasareas[$e]['denominacion'] = $persona['area'];
                                $arrpersonasareas[$e]['cantidad'] = $cont;
                            }
                        }
                    }
                }

                //Detalles de montos por areas redistribuidos
                $montos = $objClaseCalculo->dameMontosFinales();
                $orden = 1;
                $divisor = 2;
                $cont = count($datospersonas['detallesgenerales']['detalles']);
                foreach ($montos as $m => $monto) {
                    $codigoorden = $objNomina->fnOrganizarPlantillas($orden, $divisor);
                    $datospersonas['detallesgenerales']['detalles'][$cont]['id'] = $cont + 1;
                    $datospersonas['detallesgenerales']['detalles'][$cont]['denominacion'] = 'z' . $codigoorden . '---' . $arrpersonasareas[$m]['denominacion'];
                    $datospersonas['detallesgenerales']['detalles'][$cont]['valor'] = $arrpersonasareas[$m]['cantidad'];
                    $datospersonas['detallesgenerales']['detalles'][$cont]['montototal'] = $monto['montototal'];
                    $datospersonas['detallesgenerales']['detalles'][$cont]['montoreal'] = $monto['montoreal'];
                    $datospersonas['detallesgenerales']['detalles'][$cont]['diferencia'] = $monto['diferencia'];
                    $datospersonas['detallesgenerales']['detalles'][$cont]['tipodatos'] = 'Personas por &aacute;reas (Rec&aacute;lculo)';
                    $cont++;
                }

                /* Guardo el archivo con los datos serializados */
                $datosfichero = array();
                $datosfichero['detallesgenerales'] = $datospersonas['detallesgenerales'];
                $datosfichero['personas'] = $datospersonas['personas'];
                file_put_contents($direccionarchivo, serialize($datosfichero));
                return $datospersonas['detallesgenerales'];

            }
        }
    }

    public function buscarValoresReportesEntrada($indicadoresPago, $identidad, $fechainicio, $fechafin)
    {
        $arrayReportes = Array();
        $objDatVariablesElementosReportesCertificaciones = new DatVariablesElementosReportesCertificaciones();
        $objConfVariablesReportesCertificaciones = new ConfVariablesReportesCertificaciones();
        foreach ($indicadoresPago as $keyindicador => $valorIndicador) {
            if (!empty($valorIndicador['idreporteentrada']) && $valorIndicador['tipovalor'] == 2) {
                $idconfreportescertificaciones = $objConfVariablesReportesCertificaciones->DevolverIdConfReportesCertificaciones($valorIndicador['idreporteentrada']);
                $valoresReporte = $objDatVariablesElementosReportesCertificaciones->obtenerValorVariablesElementoDadoIdVariable($valorIndicador['idreporteentrada'], $identidad, $fechainicio, $fechafin, $idconfreportescertificaciones);
                $arrayReportes[$valorIndicador['denominacion']] = $this->indexarArregloReportePorIdPersona($valoresReporte);

            }
        }

        return $arrayReportes;
    }

    /* Busca los valores de los elementos de los reportes para todas las personas
     *
     *
     * */
    public function indexarArregloReportePorIdPersona($valoresReporte)
    {
        $arrayIndexado = Array();
        foreach ($valoresReporte as $keyvalor => $valorReporte) {
            $arrayIndexado[$valorReporte['idelemento']] = $valorReporte['valor'];
        }
        return $arrayIndexado;
    }

    public function buscarSBCyValoresReportesPorPagos($objPagos, $arrayReporte, $indicadoresPago, $idpagoresultado, $pagoxresultadosdestajo, $personasPorAreas, $identidad)
    {
        $arrayColumnaPago = Array();
        $arrayPersonas = Array();

        //Si es un pago x resultados q busca en nominas y reportes
        if ($pagoxresultadosdestajo == 1) {
            //$varSBC = false;
            $flarind = 0;
            foreach ($indicadoresPago as $rind) {
                if ($rind['tipovalor'] == 1) {
                    $flarind = 1;
                    break;
                }
            }
            //Si al menos hay un indicador que hale de las nominas se busca el valor de las personas en la nomina y ademas en los reportes
            if ($flarind == 1) {
                //Si el array tiene periodos de pago
                if(count($objPagos)>0){
                    foreach ($objPagos as $keyPagos => $valorPago) {
                        //Obteniendo el identificador del campo nombre y apellidos en estructurarmodelonomina
                        $idcamponombre = ConfigEstructurarModelosNomina::obtenerCampoNombre($valorPago->tiponomina, $valorPago->identidad)[0]['idestructuramodelodomina'];

                        //Obteniendo el identificador de la columna que tributa al pago por resultado
                        if (!$arrayColumnaPago[$valorPago->idelaborarpagos]) {
                            $valorAux = ConfIndicadorespagosporresultados::ObtenerIndicadoresCampoNominaElaborarPagos($idpagoresultado, $valorPago->idelaborarpagos);
                            foreach ($valorAux as $conti0 => $ri){
                                $denom = $ri['denominacion'];
                                $arrayColumnaPago[$valorPago->idelaborarpagos][$ri['idindicadorespagoresultado']]["$denom"] = 'c' . $ri['idestructuramodelonomina'];
                                $arrayColumnaPago[$valorPago->idelaborarpagos][$ri['idindicadorespagoresultado']]['idestructuramodelonomina'] = $ri['idestructuramodelonomina'];
                            }

                        }


                        //Obteniendo las nominas Asociadas al pago
                        $arrayNominas = $this->objDatNomiDatos->obtenerDatosNominaPlantillaPorElaborarPago($valorPago->idelaborarpagos);
                        //print_r($valorPago->idelaborarpagos);die;
                        if (!empty($arrayNominas)) {
                            foreach ($arrayNominas as $keynominas => $valorNomina) {
                                $arrValoresPersonas = unserialize($valorNomina['valores']);//print_r('a');die;
                                foreach ($arrValoresPersonas as $datosPersona) {
                                    $auxPersona = explode('-', $datosPersona['id']);
                                    $id = $auxPersona[0];
                                    //Si el campo de la nomina configurado para el pago por resultados coincide con el campo de la nomina escogida
                                    //if ($datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos]]) {
                                    //Sino existe la persona se asignan el valor de la nomina y los indicadores de reportes
                                    if (!$arrayPersonas[$id]['id']) {
                                        $arrayPersonas[$id]['id'] = $auxPersona[0];
                                        $arrayPersonas[$id]['identidad'] = $valorPago->identidad;
                                        //Columna de nombres y apellidos
                                        //$datospersona = $ioc->pvd->getPrincipalesDatosPersona(array($auxPersona[0]), null, null, null, null, null, null);
                                        $arrayPersonas[$id]['nombreapellido'] = $datosPersona['c' . $idcamponombre];
                                        //Por cada indicador de entrada busco el valor de la variable en el arreglo
                                        foreach ($indicadoresPago as $keyindicador => $valorIndicador) {
                                            $idindicadorespagoresultado = $valorIndicador['idindicadorespagoresultado'];
                                            //Valores de reporte
                                            if ($valorIndicador['tipovalor'] == 2) {
                                                $arrayPersonas[$id][$valorIndicador['denominacion']] = $arrayReporte[$valorIndicador['denominacion']][$id];
                                                //Valor de una nomina
                                            } else if ($valorIndicador['tipovalor'] == 1) {
                                                //Validando que el indicador coincida con la estructura de nomina del periodo de pago
                                                if($valorIndicador['idestructuramodelonomina'] == $arrayColumnaPago[$valorPago->idelaborarpagos][$idindicadorespagoresultado]['idestructuramodelonomina']){
                                                    $varSBC = $valorIndicador['denominacion'];
                                                    //Almacenando el valor del SBC
                                                    //$arrayPersonas[$id][$varSBC] = $arrayPersonas[$id][$varSBC] + $datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos][$varSBC]];
                                                    $importepersonanomina = $datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos][$idindicadorespagoresultado][$varSBC]];
                                                    $arrayPersonas[$id][$varSBC] = ($importepersonanomina)?($importepersonanomina + $arrayPersonas[$id][$varSBC]):0.00;


                                                }
                                            }
                                        }
                                        //Si esta la persona solo se asigna el valor de la nomina
                                    }else{
                                        foreach ($indicadoresPago as $keyindicador => $valorIndicador) {
                                            if ($valorIndicador['tipovalor'] == 1) {
                                                $idindicadorespagoresultado = $valorIndicador['idindicadorespagoresultado'];
                                                //Validando que el indicador coincida con la estructura de nomina del periodo de pago
                                                if($valorIndicador['idestructuramodelonomina'] == $arrayColumnaPago[$valorPago->idelaborarpagos][$idindicadorespagoresultado]['idestructuramodelonomina']){
                                                    $varSBC = $valorIndicador['denominacion'];
                                                    //Almacenando el valor del SBC
                                                    //$arrayPersonas[$id][$varSBC] = $arrayPersonas[$id][$varSBC] + $datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos][$varSBC]];
                                                    $importepersonanomina = $datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos][$idindicadorespagoresultado][$varSBC]];
                                                    $arrayPersonas[$id][$varSBC] = ($importepersonanomina)?($importepersonanomina + $arrayPersonas[$id][$varSBC]):0.00;
                                                }
                                            }
                                        }
                                    }
                                    //Almacenando el valor del SBC
                                    //$arrayPersonas[$id][$varSBC] = $arrayPersonas[$id][$varSBC] + $datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos]];
                                    /*} else {
                                        return 'NO-COINCIDEN-CAMPOCONFIG-CAMPONOMINA';
                                    }*/
                                }
                            }
                        } else {
                            return 'NOMINAS-DESAPROBADAS';
                        }
                    }
                    $r->arrayp = $arrayPersonas;
                    $r->flarind = $flarind;
                    return $r;
                //Si es un calculo que busca valores en las nominas y los reportes pero no existe un periodo de pago
                }else{
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    //Recorriendo las personas por areas para buscar los valores de los reportes solamente
                    foreach ($personasPorAreas as $rp){
                        $idpersona = $rp['idpersona'];
                        $arrayPersonas[$idpersona]['id'] = $idpersona;
                        $arrayPersonas[$idpersona]['identidad'] = $identidad;
                        $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
		                where dp.idpersona = ?;";
                        $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($idpersona));
                        $nombreapp = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                        $arrayPersonas[$idpersona]['nombreapellido'] = $nombreapp;
                        //Por cada indicador de entrada se busca el valor de la variable en el arreglo
                        foreach ($indicadoresPago as $keyindicador => $valorIndicador) {
                            //Valores de reporte
                            if ($valorIndicador['tipovalor'] == 2) {
                                $arrayPersonas[$idpersona][$valorIndicador['denominacion']] = $arrayReporte[$valorIndicador['denominacion']][$idpersona];
                            }
                        }
                    }
                    $r->arrayp = $arrayPersonas;
                    $r->flarind = $flarind;
                    return $r;
                }
            //Si los indicadores halan de reportes solamente
            } else {
                //Si hay datos en los reportes
                if(count($arrayReporte)>0){
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    //Recorriendo las personas por areas para buscar los valores de los reportes solamente
                    foreach ($personasPorAreas as $rp){
                        $idpersona = $rp['idpersona'];
                        $arrayPersonas[$idpersona]['id'] = $idpersona;
                        $arrayPersonas[$idpersona]['identidad'] = $identidad;
                        $sqlDatosPersona = "select dp.nombre, dp.snombre, dp.papel, dp.sapel from mod_persona.dat_persona dp
		                where dp.idpersona = ?;";
                        $arrdatpersona = $conn->fetchAll($sqlDatosPersona, array($idpersona));
                        $nombreapp = $arrdatpersona[0]['nombre'] . " " . $arrdatpersona[0]['snombre'] . " " . $arrdatpersona[0]['papel'] . " " . $arrdatpersona[0]['sapel'];
                        $arrayPersonas[$idpersona]['nombreapellido'] = $nombreapp;
                        //Por cada indicador de entrada se busca el valor de la variable en el arreglo
                        foreach ($indicadoresPago as $keyindicador => $valorIndicador) {
                            //Valores de reporte
                            if ($valorIndicador['tipovalor'] == 2) {
                                $arrayPersonas[$idpersona][$valorIndicador['denominacion']] = $arrayReporte[$valorIndicador['denominacion']][$idpersona];
                            }
                        }
                    }
                    $r->arrayp = $arrayPersonas;
                    $r->flarind = $flarind;
                    return $r;
                //Si no hay datos en los reportes
                }else{
                    $r->arrayp = array();
                    $r->flarind = $flarind;
                    return $r;
                }

            }
            //Si es un destajo q busca en reportes
        } else {
            if (count($personasPorAreas) > 0) {
                $arrayPersonas = array();
                //Reportes
                foreach ($personasPorAreas as $parea) {
                    $id = $parea['idpersona'];
                    //Verifico si la persona ya esta en el arreglo
                    if (!$arrayPersonas[$id]['id']) {

                        //Por cada indicador de entrada busco el valor de la variable en el arreglo
                        foreach ($indicadoresPago as $keyindicador => $valorIndicador) {
                            if ($valorIndicador['tipovalor'] == 2) {
                                if($arrayReporte[$valorIndicador['denominacion']][$id] > 0){
                                    $arrayPersonas[$id]['id'] = $id;
                                    $arrayPersonas[$id]['identidad'] = $identidad;
                                    //Columna de nombres y apellidos
                                    $arrayPersonas[$id]['nombreapellido'] = $parea['nombreapellido'];
                                    $arrayPersonas[$id][$valorIndicador['denominacion']] = ($arrayReporte[$valorIndicador['denominacion']][$id]) ? $arrayReporte[$valorIndicador['denominacion']][$id] : 0.00;
                                }
                            }
                        }
                    }
                }
                if(count($objPagos)>0){
                    foreach ($objPagos as $keyPagos => $valorPago) {
                        //Obteniendo el identificador del campo nombre y apellidos en estructurarmodelonomina
                        $idcamponombre = ConfigEstructurarModelosNomina::obtenerCampoNombre($valorPago->tiponomina, $valorPago->identidad)[0]['idestructuramodelodomina'];
                        //Obteniendo el identificador de la columna que tributa al pago por resultado
                        if (!$arrayColumnaPago[$valorPago->idelaborarpagos]) {
                            $valorAux = ConfIndicadorespagosporresultados::ObtenerIndicadoresCampoNominaElaborarPagos($idpagoresultado, $valorPago->idelaborarpagos);
                            $denom = $valorAux[0]['denominacion'];
                            $arrayColumnaPago[$valorPago->idelaborarpagos]["$denom"] = 'c' . $valorAux[0]['idestructuramodelonomina'];
                            $arrayColumnaPago[$valorPago->idelaborarpagos]['idestructuramodelonomina'] = $valorAux[0]['idestructuramodelonomina'];

                        }
                        //Obteniendo las nominas Asociadas al pago
                        $arrayNominas = $this->objDatNomiDatos->obtenerDatosNominaPlantillaPorElaborarPago($valorPago->idelaborarpagos);
                        //print_r($valorPago->idelaborarpagos);die;
                        if (!empty($arrayNominas)) {
                            foreach ($arrayNominas as $keynominas => $valorNomina) {
                                $arrValoresPersonas = unserialize($valorNomina['valores']);//print_r('a');die;
                                foreach ($arrValoresPersonas as $datosPersona) {
                                    $auxPersona = explode('-', $datosPersona['id']);
                                    $id = $auxPersona[0];
                                    //Si el campo de la nomina configurado para el pago por resultados coincide con el campo de la nomina escogida
                                    //if ($datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos]]) {
                                    //Verifico si la persona no esta en el arreglo
                                    if (!$arrayPersonas[$id]['id']) {
                                        //Por cada indicador de entrada busco el valor de la variable en el arreglo
                                        foreach ($indicadoresPago as $keyindicador => $valorIndicador) {
                                            if ($valorIndicador['tipovalor'] == 1) {
                                                //Validando que el indicador coincida con la estructura de nomina del periodo de pago
                                                if($valorIndicador['idestructuramodelonomina'] == $arrayColumnaPago[$valorPago->idelaborarpagos]['idestructuramodelonomina']){
                                                    $varSBC = $valorIndicador['denominacion'];
                                                    //Almacenando el valor del SBC
                                                    //$arrayPersonas[$id][$varSBC] = $arrayPersonas[$id][$varSBC] + $datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos][$varSBC]];
                                                    $arrayPersonas[$id][$varSBC] = ($datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos][$varSBC]])?$datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos][$varSBC]]:0.00;

                                                }
                                            }
                                        }
                                        //Si esta la persona solo se asigna el valor de la nomina
                                    }else{
                                        foreach ($indicadoresPago as $keyindicador => $valorIndicador) {
                                            if ($valorIndicador['tipovalor'] == 1) {
                                                //Validando que el indicador coincida con la estructura de nomina del periodo de pago
                                                if($valorIndicador['idestructuramodelonomina'] == $arrayColumnaPago[$valorPago->idelaborarpagos]['idestructuramodelonomina']){
                                                    $varSBC = $valorIndicador['denominacion'];
                                                    //Almacenando el valor del SBC
                                                    //$arrayPersonas[$id][$varSBC] = $arrayPersonas[$id][$varSBC] + $datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos][$varSBC]];
                                                    $arrayPersonas[$id][$varSBC] = ($datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos][$varSBC]])?$datosPersona[$arrayColumnaPago[$valorPago->idelaborarpagos][$varSBC]]:0.00;
                                                }
                                            }
                                        }
                                    }

                                    /*} else {
                                        return 'NO-COINCIDEN-CAMPOCONFIG-CAMPONOMINA';
                                    }*/
                                }
                            }
                        } else {
                            return 'NOMINAS-DESAPROBADAS';
                        }
                    }
                }
                $r->arrayp = $arrayPersonas;
                return $r;
        }
    }


    }

    /* Construye el arreglo con todos los elementos necesarioa para aplicar la formula del pago
     *
     *
     * */
    public function devPersonaPorArea($objAreas, $identidad, $composicion, $idpagoresultado)
    {
        $areas = array();
        foreach ($objAreas as $keyArea => $valorAreas) {
            $areas[] = $valorAreas->idarea;
            $montoAreas[$valorAreas->idarea] = $valorAreas->monto;
        }
        //Si es un pago por resultado de entidades
        if ($composicion == 2) {
            $personas = $this->objcargosOcupados->buscarPersonaEntidadesArea($areas, $identidad, $idpagoresultado);
            $varRetorno['personas'] = $personas;
            $varRetorno['montos'] = $montoAreas;
            return $varRetorno;
            //Si es un pago por resultado de cargos
        } else {
            $personas = $this->objcargosOcupados->buscarPersonaAreas($areas, $identidad, $idpagoresultado);
            $varRetorno['personas'] = $personas;
            $varRetorno['montos'] = $montoAreas;
            return $varRetorno;
        }
    }

    public function exportarResultadoCalculo($identidad, $idpagoporresultado, $referencia)
    {
        //Creando el objeto de phpexel
        $objPHPExcel = new PHPExcel();
        $obj = new DatNominaModel();

        //Pintar el encabezado
        $indicadores = $this->objIndicadoresPago->ObtenerIndicadorespagosporresultadosid($idpagoporresultado);
        $arrayIndicadores['ci'] = 'CI';
        $arrayIndicadores['nombreapellido'] = 'Nombre y apellidos';
        foreach ($indicadores as $ind) {
            $arrayIndicadores[$ind['idindicadorespagoresultado']] = $ind['denominacion'];
        }
        $objPHPExcel->getActiveSheet()->freezePane('A1');
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getRowDimension(2)->setRowHeight(30);
        $cantindicadores = count($arrayIndicadores);
        // $ultimacolumna = ($cantindicadores < 27) ? chr($cantindicadores + 64) : 'A' . chr($cantindicadores + 38);
        $ultimacolumna = $this->numberToColumnLetter($cantindicadores);
        $objPHPExcel->getActiveSheet()->mergeCells('A1:' . $ultimacolumna . '1');
        $obj->fnPintarCelda($objPHPExcel, 'A', 1, 'Listado de personas que acceden al pago por resultados', 't,r,b,l', '000000', 'Arial', 12, '000000', 'center', 'center', 0, 1);
        $columna = 1;
        foreach ($arrayIndicadores as $ind => $indicador) { 
            //$letraconvertida = ($columna < 27) ? chr($columna + 64) : 'A' . chr($columna + 38);
            $letraconvertida = $this->numberToColumnLetter($columna);
            $obj->fnPintarCelda($objPHPExcel, $letraconvertida, 2, $indicador, 't,r,b,l', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $columna++;
        }
		//$cifijo =  chr($columna + 64);
		//$obj->fnPintarCelda($objPHPExcel, $cifijo, 2, 'CI', 't,r,b,l', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);

        //Pintando el cuerpo
        $arrayPersonas = $this->escribirLeerArchivo($referencia, null)['personas'];
        $arrayPersonas = $obj->ordenarArrayPorClave($arrayPersonas, 'nombreapellido');
        $arrayAreas = array();
        foreach ($arrayPersonas as $arrp) {
            list($pagoresultado, $fechainicio, $fechafin) = explode('-', $arrp['area']);
            $arrayAreas[$arrp['area']]['fechainicio'] = $fechainicio;
            $arrayAreas[$arrp['area']]['denomarea'] = $arrp['area'];
        }
        $arrayAreas = $obj->ordenarArrayPorClave(array_values($arrayAreas), 'fechainicio');

        $fila = 3;
        foreach ($arrayAreas as $area) {
            $objPHPExcel->getActiveSheet()->mergeCells('A' . $fila . ':' . $ultimacolumna . $fila);
            $obj->fnPintarCelda($objPHPExcel, 'A', $fila, utf8_decode($area['denomarea']), null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
            $fila++;
            foreach ($arrayPersonas as $idpersona => $persona) {
                if ($area['denomarea'] == $persona['area']) {
                    $columna = 1;
                    foreach ($arrayIndicadores as $ind => $denomindicador) {
                       // $letraconvertida = ($columna < 27) ? chr($columna + 64) : 'A' . chr($columna + 38);
                        $letraconvertida = $this->numberToColumnLetter($columna);
                        $val = ($ind == 'nombreapellido' || $ind == 'ci') ? $persona[$ind] : $persona[$denomindicador];
                        $obj->fnPintarCelda($objPHPExcel, $letraconvertida, $fila, $val, null, '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
                        $columna++;
                    }
                    $fila++;
                }
            }
        }


        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->getActiveSheet()->setTitle('Cálculo pago');
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="Cálculo pago.xls" ');
        header('Cache-Control: max-age=0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        return 1;
    }

    /* Escribe o Lee el valor del arreglo de personas del en en fichero con nombre la referencia
    *
    * */
    public function almacenarValoresReporte($idpagoresultado, $referencia, $idestructura, $idusuario, $finicio, $ffin/*, $composicion, $objPagos*/)
    {
        //Buscando los indicadores del Pago
        $indicadores = $this->objIndicadoresPago->ObtenerIndicadorespagosporresultadosid($idpagoresultado);
        $arrayPersona = $this->escribirLeerArchivo($referencia, false);
        $idReporte = $this->devIdReporteDadoIndicadores($indicadores);
        $composicion = $this->objAreas->obtenerComposicionDadoIdPagoResultado($idestructura, $idpagoresultado)[0]['composicion'];
        $areas = array();
        if ($composicion == 2) {
            $r = $this->objAreas->obtenerAreasCargosEntidadPagoResultado($idpagoresultado);
            foreach ($r as $idarea) {
                $areas[] = $idarea['idcargo'];
            }
        } else {
            $areas[] = $idestructura;
        }
        //Sumando el salario final
        $arrayfinal = array();
        $contarrf = 0;
        for ($i = 0; $i < count($arrayPersona['personas']); $i++) {
            $idpersona = $arrayPersona['personas'][$i]['idpersona'];
            if (!$arrayfinal[$idpersona]) {
                $arrayfinal[$idpersona] = $arrayPersona['personas'][$i];
                for ($j = $i + 1; $j < count($arrayPersona['personas']); $j++) {
                    if ($idpersona == $arrayPersona['personas'][$j]['idpersona']) {
                        foreach ($indicadores as $rind) {
                            //Salario total
                            if ($rind['sumadestajo'] == 1) {
                                $salarioj = $arrayPersona['personas'][$j][$rind['denominacion']];
                                $arrayfinal[$idpersona][$rind['denominacion']] += $salarioj;
                            }
                        }
                    }
                }
            }

        }
        //print_r(count($arrayfinal));die;
        //Salvando en cada reporte de cada entidad
        if($idReporte){
            foreach ($areas as $identidad) {
                //Salvando en DatReportesCertificaciones
                $datReporte = new DatReportesCertificaciones();
                $datReporte->idconfreportescertificaciones = $idReporte;
                $datReporte->identidad = $identidad;
                $datReporte->idusuario = $idusuario;
                $datReporte->fechainicio = $finicio;
                $datReporte->fechafin = $ffin;
                $datReporte->save();
                $idreporte = $datReporte->idreportescertificaciones;

                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();
                $conn->beginTransaction();
                foreach ($arrayfinal as $keyPersona => $valoresPersona) {
                    if ($valoresPersona['identidad'] == $identidad) {
                        //Salvando en DatElementosReportesCertificaciones
                        $sql = "INSERT INTO mod_nomina.dat_elementosreportescertificaciones(idreportescertificaciones, idelemento, aprobado)
              VALUES ({$idreporte}, {$valoresPersona['idpersona']}, 1) returning idelementosreportescertificaciones;";
                        $r = $conn->fetchAll($sql);
                        $idelemento = $r[0]['idelementosreportescertificaciones'];

                        foreach ($indicadores as $keyInd => $valueIndicadores) {
                            //Salvando en DatVariableElementosReportesCertificaciones
                            if ($valueIndicadores['idreportesalida']) {
                                $sql = "INSERT INTO mod_nomina.dat_variableselementosreportescertificaciones(idelementosreportescertificaciones, idvariablesconfreportescertificaciones, valor)
                      VALUES ({$idelemento}, {$valueIndicadores['idreportesalida']}, {$valoresPersona[$valueIndicadores['denominacion']]});";
                                $conn->execute($sql);
                            }
                        }
                    }
                }
                $conn->commit();
            }
            return $idreporte;
        }else{
            return null;
        }
    }

    /*
     * Funcion para almacenar los valores obtenidos en el calculo en el reporte del pago por resultado
     *
     * */
    public function escribirLeerArchivo($referencia, $arrayPago)
    {
        $register = Zend_Registry::getInstance();
        $direccAux = $register->config->modulo_path . 'models/bussines/calculopago';
        $dirFileComp = $direccAux . "/$referencia.txt";
        if ($arrayPago)
            return file_put_contents($dirFileComp, serialize($arrayPago));
        else
            return unserialize(file_get_contents($dirFileComp));

    }

    /*
     * Buscando el idconfreportescertificaciones al que pertenecen los indicadores de salidas
     * */
    public function devIdReporteDadoIndicadores($indicadores)
    {
        foreach ($indicadores as $key => $valueIndicador) {
            if ($valueIndicador['idreportesalida']) {
                $datosVariable = ConfVariablesReportesCertificaciones::devDatosPorIdVariable($valueIndicador['idreportesalida']);
                return $datosVariable[0]['idconfreportescertificaciones'];
            }
        }
    }

    public function borraTodosMontosAreas($identidad, $idpagoporresultado)
    {
        return ConfPagosporresultadoarea::eliminarMontosTodasAreasPagoPorResultado($identidad, $idpagoporresultado);
    }

    public function exportarMontosAreas($identidad, $idpagoporresultado, $monto)
    {
        $objPHPExcel = new PHPExcel();
        $obj = new DatNominaModel();
        $datos = $this->listarPagosPorResultado($identidad, null, $idpagoporresultado);
        $arrayareas = array();
        if (count($datos[0]['areas']) > 0) {
            foreach ($datos[0]['areas'] as $areamonto) {
                $arrayareas[] = $areamonto['idarea'];
            }
        }
        $datosagrupados = $this->calcularMontosAreas($identidad, $idpagoporresultado, $monto, $arrayareas);

        //Pintando la denominacion de los campos
        $objPHPExcel->getActiveSheet()->mergeCells('A1:C1');
        $objPHPExcel->getActiveSheet()->getRowDimension(1)->setRowHeight(20);
        $objPHPExcel->getActiveSheet()->getRowDimension(2)->setRowHeight(30);
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(50);
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(10);
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(15);
        $objPHPExcel->getActiveSheet()->freezePane('A4');
        $obj->fnPintarCelda($objPHPExcel, 'A', 1, 'DESGLOSE DE MONTOS POR ÁREAS: ' . strtoupper($datos[0]['dentipopago']), null, '000000', 'Arial', 10, '106010', 'center', 'center', 0, 1);
        $obj->fnPintarCelda($objPHPExcel, 'A', 2, 'Área', 't,r,b,l', '000000', 'Arial', 10, '106010', 'center', 'center', 0, 1);
        $obj->fnPintarCelda($objPHPExcel, 'B', 2, 'Monto', 't,r,b,l', '000000', 'Arial', 10, '106010', 'center', 'center', 0, 1);
        $obj->fnPintarCelda($objPHPExcel, 'C', 2, 'Cantidad personas', 't,r,b,l', '000000', 'Arial', 10, '106010', 'center', 'center', 0, 1);
        //Pintando el valor de cada campo para cada persona
        $numero = 3;
        foreach ($datosagrupados as $g => $agrupador) {
            $obj->fnPintarCelda($objPHPExcel, 'A', $numero, $agrupador['agrupador'], 't,r,b,l', '000000', 'Arial', 10, '000000', 'left', 'center', 0, 1);
            $obj->fnPintarCelda($objPHPExcel, 'B', $numero, $agrupador['monto'], 't,r,b,l', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $obj->fnPintarCelda($objPHPExcel, 'C', $numero, $agrupador['personasareasagrupador'], 't,r,b,l', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 1);
            $numero++;

            foreach ($datos[0]['areas'] as $i => $area) {
                if ($agrupador['montosareas'][$area['idarea']]) {
                    $obj->fnPintarCelda($objPHPExcel, 'A', $numero, $area['area'], 't,r,b,l', '000000', 'Arial', 10, '000000', 'left', 'center', 0, 0);
                    $obj->fnPintarCelda($objPHPExcel, 'B', $numero, $area['monto'], 't,r,b,l', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                    $obj->fnPintarCelda($objPHPExcel, 'C', $numero, $agrupador['cantpersonasareas'][$area['idarea']], 't,r,b,l', '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                    $obj->fnFormatoNumeros($objPHPExcel, 'B' . $numero);
                    $numero++;
                }
            }
            $numero++;
        }

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="Montos áreas.xls" ');
        header('Cache-Control: max-age=0');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        return 1;
    }

    public function calcularMontosAreas($identidad, $idpagoporresultado, $monto, $areasformulasmonto)
    {
        //Obteniendo las configuraciones de los agrupadores y las formulas de las areas
        $objAgrupadoresAreas = new ConfAgrupadorAreas();
        $objFormunasMontosAreas = new ConfFormulasAreasMontos();
        $objCargosOcupados = new DatCargosOcupados();
        $objConfPagosporresultadoarea = new ConfPagosporresultadoarea();
        $objDatGestionarNominas = new DatGestionarNominasModel();
        $obj = new stdClass();
        //Todas las personas de los periodos de pago que entran al pago por resultados
        $personasPeriodo = $this->fnPersonasPeriodoPagoPorResultado($idpagoporresultado, $identidad);

        //Todas las personas de todas las areas configuradas en el pago por resultados
        $todaspersonasareas = $objCargosOcupados->buscarPersonaAreas($areasformulasmonto, $identidad);

        //Validando que solo entren al pago las personas que estan en los periodos
        foreach ($todaspersonasareas as $p => $persona) {
            if (!$personasPeriodo[$persona['idpersona']]) {
                unset($todaspersonasareas[$p]);
            }
        }
        $todaspersonasareas = array_values($todaspersonasareas);

        $ragrupareas = $objAgrupadoresAreas->obtenerAgrupadoresXIdPagoPorResultado($identidad, $idpagoporresultado);

        //Obteniendo la cantidad de personas por areas
        $areas = array();
        foreach ($todaspersonasareas as $persona) {
            $areas[$persona['idarea']][] = $persona;
        }
        $areascant = array();
        foreach ($areas as $a => $area) {
            $areascant[$a] = count($area);
        }

        //Recorriendo los agrupadores para evaluar la formula
        $arraymontosagrupadores = array();
        $contmontosagrup = 0;
        foreach ($ragrupareas as $agar) {
            $arraymontosagrupadores[$agar['idagrupador']]['agrupador'] = $agar['denominacion'];
            $expresionmatematicaagrup = $agar['idformula'];
            $arrformulaind = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expresionmatematicaagrup);
            $expresion = ZendExt_IoC_Inter::getInstance()->comun->BuscarTodosporarrIdExpresionMatematica(array($expresionmatematicaagrup));
            $expmostrar = $expresion[0]['expresionacalcular'];
            $arrayind = array();
            $conteval = 0;
            //Recorriendo los indicadores de la formula del agrupador
            if (count($arrformulaind) > 0) {
                foreach ($arrformulaind as $rif) {
                    $rexplode = explode('_', $rif);
                    //Fondo de salario a distribuir
                    if ($rexplode[0] == 'FSD') {
                        $arrayind[$conteval]['idindicador'] = $rif;
                        $arrayind[$conteval]['valor'] = ($monto) ? $monto : 0;
                        $conteval++;
                        //Total de personas de todas las areas de la entidad que entran en el pago por resultados
                    } else if ($rexplode[0] == 'TP') {
                        $arrayind[$conteval]['idindicador'] = $rif;
                        $arrayind[$conteval]['valor'] = (count($todaspersonasareas)) ? count($todaspersonasareas) : 0;
                        $conteval++;
                        $arraymontosagrupadores[$agar['idagrupador']]['todaspersonasareas'] = count($todaspersonasareas);
                        //Total de personas de las areas del agrupador
                    } else if ($rexplode[0] == 'TPA') {
                        $areasagrup = $objFormunasMontosAreas->obtenerIdAreasMontosXIdAgrupador($agar['idagrupador']);
                        $rareasagrup = array();
                        foreach ($areasagrup as $raagup) {
                            $rareasagrup[] = $raagup['idarea'];
                        }
                        //Obteniendo la cantidad de personas por agrupador
                        $personasareasagrup = array();
                        foreach ($todaspersonasareas as $persona) {
                            foreach ($rareasagrup as $area) {
                                if ($persona['idarea'] == $area) {
                                    $personasareasagrup[] = $persona;
                                }
                            }
                        }
                        //$personasareasagrup = $objCargosOcupados->buscarPersonaAreas($rareasagrup, $identidad);
                        $arrayind[$conteval]['idindicador'] = $rif;
                        $arrayind[$conteval]['valor'] = (count($personasareasagrup)) ? count($personasareasagrup) : 0;
                        $conteval++;
                        $arraymontosagrupadores[$agar['idagrupador']]['personasareasagrupador'] = count($personasareasagrup);
                        $arraymontosagrupadores[$agar['idagrupador']]['areas'] = $rareasagrup;
                        //Monto de un agrupador
                    } else if ($rexplode[0] == 'A') {
                        $areasagrup = $objFormunasMontosAreas->obtenerIdAreasMontosXIdAgrupador($agar['idagrupador']);
                        $rareasagrup = array();
                        foreach ($areasagrup as $raagup) {
                            $rareasagrup[] = $raagup['idarea'];
                        }
                        //Obteniendo la cantidad de personas por agrupador
                        $personasareasagrup = array();
                        foreach ($todaspersonasareas as $persona) {
                            foreach ($rareasagrup as $area) {
                                if ($persona['idarea'] == $area) {
                                    $personasareasagrup[] = $persona;
                                }
                            }
                        }
                        //$personasareasagrup = $objCargosOcupados->buscarPersonaAreas($rareasagrup, $identidad);
                        $idagrupador = $rexplode[1];
                        $montoagrup = $arraymontosagrupadores[$idagrupador]['monto'];
                        $arrayind[$conteval]['idindicador'] = $rif;
                        $arrayind[$conteval]['valor'] = ($montoagrup) ? $montoagrup : 0;
                        $arraymontosagrupadores[$agar['idagrupador']]['todaspersonasareas'] = count($todaspersonasareas);
                        $arraymontosagrupadores[$agar['idagrupador']]['personasareasagrupador'] = count($personasareasagrup);
                        $arraymontosagrupadores[$agar['idagrupador']]['areas'] = $rareasagrup;
                        $conteval++;
                    }
                }
            } else {
                $obj->failed = 'NO-EXPRESION-MATEMATICA-AGRUPADOR';
                $obj->agrupador = $agar['denominacion'];
                return $obj;
            }
            //Evaluando la expresion matematica para obtener el monto de los agrupadores
            $valorfind = $objDatGestionarNominas->EvaluarExpresionMatematica($arrayind, $expmostrar);
            ($valorfind->codigo == 1) ? $arraymontosagrupadores[$agar['idagrupador']]['monto'] = number_format($valorfind->valor, 2, '.', '') : 0;
        }
        //Recorriendo las areas para buscar los montos
        if (count($arraymontosagrupadores) > 0) {
            foreach ($arraymontosagrupadores as $iagrup => $rmontoagrup) {
                //Areas
                foreach ($rmontoagrup['areas'] as $ia => $area) {
                    $expresionmatematicaarea = $objFormunasMontosAreas->obtenerExpresionMatematicaxIdAreassXIdAgrupador($iagrup, $area);
                    //Recorriendo los indicadores de la formula del agrupador
                    if ($expresionmatematicaarea) {
                        $arrformulaindareas = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expresionmatematicaarea);
                        $expresionareas = ZendExt_IoC_Inter::getInstance()->comun->BuscarTodosporarrIdExpresionMatematica(array($expresionmatematicaarea));
                        $expmostrarareas = $expresionareas[0]['expresionacalcular'];
                        $arrayindarea = array();
                        $contevalarea = 0;
                        foreach ($arrformulaindareas as $rif) {
                            $rexplode = explode('_', $rif);
                            //Salario medio del Agrupador (Monto del agrupador/personas agrupador)
                            if ($rexplode[0] == 'SM') {
                                $arrayindarea[$contevalarea]['idindicador'] = $rif;
                                $salariomedio = number_format(($rmontoagrup['monto'] / $rmontoagrup['personasareasagrupador']), 6, '.', '');

                                $arrayindarea[$contevalarea]['valor'] = ($salariomedio) ? $salariomedio : 0;
                                $contevalarea++;
                                //Total de personas del area
                            } else if ($rexplode[0] == 'TPArea') {
                                $areasagrupad = $objFormunasMontosAreas->obtenerIdAreasMontosXIdAgrupador($iagrup);
                                $rareasagrupad = array();
                                foreach ($areasagrupad as $raagup) {
                                    $rareasagrupad[] = $raagup['idarea'];
                                }
                                //Obteniendo la cantidad de personas por agrupador
                                $personasareas = array();
                                foreach ($rareasagrupad as $idareaag) {
                                    $contareas = 0;
                                    foreach ($todaspersonasareas as $arrpersona) {
                                        if ($arrpersona['idarea'] == $idareaag) {
                                            $personasareas[$idareaag][$contareas] = $arrpersona;
                                            $contareas++;
                                        }
                                    }
                                }
                                $arrayindarea[$contevalarea]['idindicador'] = $rif;
                                $arrayindarea[$contevalarea]['valor'] = (count($personasareas[$area])) ? count($personasareas[$area]) : 0;
                                $contevalarea++;
                            }
                        }
                    } else {
                        $obj->failed = 'NO-EXPRESION-MATEMATICA-AREA';
                        $obj->agrupador = $agar['denominacion'];
                        return $obj;
                    }
                    //Evaluando la expresion matematica para obtener el monto de los agrupadores
                    $valorfindareas = $objDatGestionarNominas->EvaluarExpresionMatematica($arrayindarea, $expmostrarareas);
                    ($valorfindareas->codigo == 1) ? $montoarea = number_format($valorfindareas->valor, 2, '.', '') : 0;
                    $arraymontosagrupadores[$iagrup]['montosareas'][$area] = $montoarea;
                    $arraymontosagrupadores[$iagrup]['cantpersonasareas'][$area] = $areascant[$area];

                    //Salvando los montos en ConfAreasMontos
                    $idpagoresarea = $objConfPagosporresultadoarea->getIdPagoPorResultadoAreaxPagoResultadoxIdArea($idpagoporresultado, $area);
                    //Si existe esta area para este pago por resultados se actualiza
                    if ($idpagoresarea) {
                        $objConfPagosporresultadoareaUpdate = Doctrine::getTable('ConfPagosporresultadoarea')->find($idpagoresarea);
                        $objConfPagosporresultadoareaUpdate->monto = (!empty($montoarea))?$montoarea:0;
                        $objConfPagosporresultadoareaUpdate->save();
                        //Si no existe se guarda
                    } else {
                        $objConfPagosporresultadoareaSave = new ConfPagosporresultadoarea();
                        $objConfPagosporresultadoareaSave->idpagoporresultado = $idpagoporresultado;
                        $objConfPagosporresultadoareaSave->idarea = $area;
                        $objConfPagosporresultadoareaSave->monto = (!empty($montoarea))?$montoarea:0;
                        $objConfPagosporresultadoareaSave->save();
                    }

                }
            }
            return $arraymontosagrupadores;
        }
    }

    private function fnPersonasPeriodoPagoPorResultado($idpagoporresultado, $identidad)
    {
        $objDatNominaDatos = new DatNominaDatos();
        $periodosPago = $this->objPeriodos->getPeriodosdePagosPorIdPago($idpagoporresultado, $identidad);
        $datPersonasPeriodo = array();
        foreach ($periodosPago as $periodo) {
            $datNominasPeriodo = $objDatNominaDatos->obtenerDatosNominaPorElaborarPago($periodo['idelaborarpagos']);
            foreach ($datNominasPeriodo as $nomina) {
                $datPersonasPeriodo = array_merge($datPersonasPeriodo, unserialize($nomina['valores']));
            }
        }
        $datPersonasPeriodo = array_values($datPersonasPeriodo);
        $personasPeriodo = array();
        foreach ($datPersonasPeriodo as $persona) {
            $personasPeriodo[$persona['idpersona']] = $persona['id'];
        }

        return $personasPeriodo;
    }

    private function numberToColumnLetter($number) {
        $letter = '';
        while ($number > 0) {
            $temp = ($number - 1) % 26;
            $letter = chr(65 + $temp) . $letter;
            $number = (int)(($number - $temp - 1) / 26);
        }
        return $letter;
    }

}
