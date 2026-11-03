<?php

class DatosNominaModel extends ZendExt_Model
{

    /**
     * Constructor de la clase.
     */
    protected $arrFormulas;

    public function DatosNominaModel()
    {
        parent::ZendExt_Model();
    }

    /*

     * Funcion que se encarga de cargar todos los datos necesarios para generar la nomina
     * Ing. Yadir Martinez Vergara
     * Ing. Frank Rodriguez Berroa
     * 25/05/2016
     * 
     * Formato: 
     *      d->persona[idcargosocupados] = Array;   
     *      d->reportes[idpersona]->reporte[idconfreportescertificaciones]
     *              ->variable[idvariableselementosreportescertificaciones] = valor;
     *      d->retenciones[idpersona]->tiporetencion[idtiporetencion][idretencionpersona] = Array;
     *      d->vacaciones[idpersona] = Array; 
     *      d->variablesglobales[idvariableglobal] = Array; 
     *      d->conceptospd[idconceptopercepciondescuento]->conceptopdtarifa[idconceptopdtarifa] = Array;
     *      d->conceptosrm[idconceptosrm]->sistemapago[idsistemapago] = Array;
     *      d->configfsp[idtipopago]->sistemapago[idsistemapago]->periodopago[idperiodopago]
     *          ->conceptopd[idconceptopercepciondescuento] = stdClass;
     *      d->configescp[idcargosocupados]->sistemapago[idsistemapago]->periodopago[idperiodopago]
      ->conceptopd[idconceptopercepciondescuento] = stdClass;
     *      */

    public function cargarDatosNomina($idelaborarpagos, $identidad = null)
    {
        $d = new stdClass();

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        $iocInterno = ZendExt_IoC_Inter::getInstance();

        $this->arrFormulas = array();

        /* Sincronizacion automatica de las cuentas bancarias de las personas */
        $synccuentas = $this->actualizarCuentasBancariasPersonas($identidad);

        if($synccuentas == 'ok'){
            /* Guardo todas las expresiones matemeticas que tienen indicadores en los fichero en comun */

            /* Busco los datos del elaborar el pago */
            $sql = "SELECT el.idelaborarpagos, el.idtipopago, el.idperiodopago, el.fechapago, el.fechainicioperiodo,
                    el.fechafinperiodo, el.mesanyopago, el.estado, el.identidad, ntn.tipomoneda, ntn.idtiponomina, 
                    ntn.acumulavacaciones, ntn.reintegro,npp.esmensual, ntp.sedesglosa, ntp.ultimopagoenperiodo, ntp.sepagaadelantado
               FROM mod_nomina.dat_elaborarpagos el
               INNER JOIN mod_nomina.conf_modelonomina cm ON (cm.idtipopago = el.idtipopago)
               INNER JOIN mod_nomina.nom_tiponomina ntn ON (ntn.idtiponomina = cm.idtiponomina)
               LEFT JOIN mod_nomina.nom_periodopago npp ON (npp.idperiodopago = el.idperiodopago)
               LEFT JOIN mod_nomina.nom_tipopago ntp ON (ntp.idtipopago = el.idtipopago)
               WHERE idelaborarpagos = ?;";
            $d->pago = $conn->fetchAll($sql, array($idelaborarpagos));

            $d->secalculaaportequincenal = -1;
            $d->secalculaaportesemanal = -1;

            /* Cargo las personas que van al pago */
            $d->personas = $this->cargarPersonas($idelaborarpagos, $conn);
            $arridpersonas = array();
            foreach ($d->personas as $idp => $rp) {
                $arridpersonas[] = $idp;
            };
            /* Periodos quincenales y semanales para los aportes */
            if ($d->pago[0]['esmensual'] == 2) {
                $limitador = '-';
                if (strpos($d->pago[0]['fechainicioperiodo'], '-') === FALSE) {
                    $limitador = '/';
                }

                $arr = explode($limitador, $d->pago[0]['fechainicioperiodo']);

                if ($arr[0] > 15) {
                    $d->secalculaaportequincenal = 1;
                    /* Cargo la nómina del período quincenal anterior */
                    $fi = explode($limitador, $d->pago[0]['fechainicioperiodo']);
                    $ff = explode($limitador, $d->pago[0]['fechafinperiodo']);

                    if ($limitador == '-') {
                        $fiq = $fi[0] . "-" . $fi[1] . "-01";
                        $ffq = $ff[0] . "-" . $ff[1] . "-15";
                    } else {
                        $fiq = $fi[2] . "-" . $fi[1] . "-01";
                        $ffq = $ff[2] . "-" . $ff[1] . "-15";
                    }

                    $sql = "SELECT dnd.valores
                    FROM mod_nomina.dat_elaborarpagos ep
                    INNER JOIN mod_nomina.dat_nomina dn ON (dn.idelaborarpago = ep.idelaborarpagos)
                    INNER JOIN mod_nomina.dat_nominadatos dnd ON (dnd.idnomina = dn.idnomina)
                    WHERE ep.idtipopago = ? AND ep.idperiodopago = ? AND (ep.estado = 2 OR ep.estado = 1) 
                    AND (ep.fechainicioperiodo = '{$fiq}'::date AND ep.fechafinperiodo = '{$ffq}'::date);";

                    $d->nominasquincenaanterior = $conn->fetchAll($sql, array($d->pago[0]['idtipopago'],
                        $d->pago[0]['idperiodopago']));
                }
            }

            /* Cargo el nomenclador de las plantillas nominales */
            $d->plantillasnominales = $this->cargarPlantillasNominales($conn, $d->pago);

            /* Construyo un arreglo lineal con los id de las personas que van al pago */
            $arrIdsPersonas = array();
            $arrIdsCargosOcupados = array();
            foreach ($d->personas as $p) {
                $arrIdsPersonas[] = $p['idpersona'];
                $arrIdsCargosOcupados[] = $p['idcargosocupados'];
            }

            /* Cargo los reportes que van al pago */
            $d->reportes = $this->cargarReportes($conn, $d->pago, $arridpersonas);

            /* Cargo las condiciones de las retenciones */
            $d->condicionesretenciones = $this->cargarCondicionesRetenciones($conn, $d->pago, $iocInterno);

            $retencionesaplicar = array();
            /* Cargo las retenciones de las personas que van al pago */
            $d->retenciones = $this->cargarRetenciones($arrIdsPersonas, $conn, $d->pago, $retencionesaplicar);

            /* Cargo las retenciones que se aplicaron en el periodo de las personas que van al pago */
            $d->retencionesaplicadas = $this->cargarRetencionesAplicadasPorPersona($conn, $d->pago, $retencionesaplicar);

            /* Cargo las vacaciones de las personas que van al pago si la nomina acumula o liquida */
            if ($d->pago[0]['acumulavacaciones'] == 1 || $d->pago[0]['acumulavacaciones'] == 2 || $d->pago[0]['acumulavacaciones'] == 4) {
                $d->vacaciones = $this->cargarVacaciones($arrIdsPersonas, $conn, $d->pago);
            }

            /* Cargo las variables globales configuradas en el sistema */
            $d->variablesglobales = $this->cargarVariablesGlobales($conn, $d->pago);

            /* Cargo los conceptos de percepciones y descuentos */
            $d->conceptospddescuentos = array();
            $conceptospddescuentosaplicar = array();
            $d->conceptospd = $this->cargarConceptosPercepcionesDescuentos($conn, $iocInterno, $d->conceptospddescuentos, $conceptospddescuentosaplicar);

            /* Cargo los descuentos que se aplicaron en el periodo de las personas que van al pago */
            $d->conceptospddescuentosaplicados = $this->cargarConceptosPercepcionesDescuentosAplicadosPorPersona($conn, $d->pago, $conceptospddescuentosaplicar, $arrIdsPersonas);

            /* Cargo los conceptos generales de la retribucion monetaria */
            $d->conceptosrm = $this->cargarConceptosGeneralesdelaRetribucionMonetaria($conn, $d->pago, $iocInterno);

            /* Cargo la configuracion de las formas y sistemas de pago */
            $d->configfsp = $this->cargarConfigFormasySistemasPago($conn, $d->pago, $iocInterno);

            /* Cargo la configuracion de los elementos salariales al cargo y persona */
            $d->configescp = $this->cargarElementosSalarialesalCargoyPersona($conn, $arrIdsCargosOcupados, $d->pago);

            /* Cargo la configuracion de los elementos salariales de las situaciones de servicio */
            $d->configesss = $this->cargarElementosSalarialesSituacionServ($conn, $arrIdsCargosOcupados, $d->pago);

            /* Cargar los campos de la estructura de la nomina */
            $d->camposrefnominas = NULL;
            $d->configestnomina = $this->cargarEstructuraNomina($conn, $d->pago[0]['idtiponomina'], $identidad, $iocInterno, $d->conceptospddescuentos, $d->pago, $d->camposrefnominas, $arrIdsPersonas, $idelaborarpagos);

            /* Cargar los sueldos por cargo de los elementos salariales y de las situaciones del servicio */
            $d->sueldoxcargo = $this->cargarSueldoCargoElementosSalariales($conn, $arrIdsCargosOcupados);

            /* Ejecuto las validaciones generales */
            $this->validacionesGenerales($d);

            //Obteniendo las expresiones matematicas del Registro de Salarios y Tiempo de Servicio
            $this->cargarExpresionesMatematicasRegistroSalariosTiempoServicio();


            $iocInterno->comun->GuardarExpresionesMatematicas($this->arrFormulas);

            /* Guardo el archivo con los datos serializados */
            $register = Zend_Registry::getInstance();
            $nombreArchivo = $idelaborarpagos . ".dnomina";
            $direccion = $register->config->modulo_path . 'comun/recursos/datosnominas/' . $nombreArchivo;
            $archivo = fopen($direccion, "w");
            fclose($archivo);
            file_put_contents($direccion, serialize($d));


            return $nombreArchivo;
        }
    }

    /* Busca las personas que van al pago

     * Devuelve Array(idpersona, idcargosocupados, 1, 2, 3, 4, 5, 6, 7, idplantillanominal, idnomina)
     *       */

    public function cargarPersonas($idelaborarpagos, &$conn)
    {
        //Cargos de las personas que se encuentran en el periodo de pago
        $sql = "SELECT eppco.idcargosocupados
            FROM mod_nomina.dat_elaborarpagos ep
            INNER JOIN mod_nomina.dat_personaselaborarpagos epp
                ON (epp.idelaborarpagos = ep.idelaborarpagos AND epp.excluido = 0)
            INNER JOIN mod_nomina.dat_personaelaborarpagoscargosocupados eppco
                ON (eppco.idpersonaelaborarpagos = epp.idpersonaelaborarpagos)
            WHERE ep.idelaborarpagos = ? and epp.excluido = 0;";

        $arrPersonas = $conn->fetchAll($sql, array($idelaborarpagos));

        $arrIdsCO = array();
        foreach ($arrPersonas as $p) {
            $arrIdsCO[] = $p['idcargosocupados'];
        }

        //Id's de las nominas del periodo de pago
        $sqlnominas = "SELECT *
            FROM mod_nomina.dat_nomina
            WHERE idelaborarpago = ?;";

        $arrnominas = $conn->fetchAll($sqlnominas, array($idelaborarpagos));

        $xml = new NXML('campos_persona.xml');
        $x = $xml->LeerDatosCamposPersona(array(1, 2, 3, 4, 5, 6, 7, 8, 9, 10), 0); //Cargo todos los campos del XML

        $select = "";
        $join = "inner join mod_persona.dat_persona dp  on (dp.idpersona = dco.idpersona and dp.feliminado is null) ";
        $where = "";
        $from = "";
        $select .= "SELECT distinct dco.idpersona, dco.idcargosocupados, dco.idcargo, dco.idsituacionlaboral ";
        $from .= " FROM mod_nomina.dat_cargosocupados dco ";
        $where .= " WHERE dn.cajacajero = (case when (dco.idpersonacuentabancariamn is not null and ntn.tipomoneda 
                    = '01' or dco.idpersonacuentabancariacuc is not null and ntn.tipomoneda = '02') then 2 else 1 end) 
                    and dco.idcargosocupados in (" . implode(',', $arrIdsCO) . ") ";

        foreach ($x as $v) {
            $select .= ", " . $v->select;
            $where .= ($v->where != '' ? " AND " . $v->where : "");
            $arrJoin = explode('>>>', $v->join);
            foreach ($arrJoin as $j) {
                if (stripos($join, $j) === false) {
                    $join .= " " . $j;
                }
            }
        }

        /* Agrego el sql para obtener las plantillas nominal y el idnomina de cada persona */
        $select .= ", (case when dco.idcargo is null then dco.idplantillanominal else cpnc.idplantillanominal end)"
            . " as idplantillanominal, dn.idnomina, dsl.principal as escargoprincipal, nfe.nivel";
        $join .= " left join mod_nomina.conf_plantillanominalcargo cpnc on (cpnc.idcargo = dco.idcargo) "
            . "left join mod_nomina.dat_nomina dn on (dn.idelaborarpago = ? and (dn.idplantillanominal = "
            . "dco.idplantillanominal or dn.idplantillanominal = cpnc.idplantillanominal))"
            . "left JOIN mod_nomina.dat_elaborarpagos el ON (el.idelaborarpagos = dn.idelaborarpago)"
            . "left JOIN mod_estructuracomp.dat_cargo edc on (edc.idcargo = dco.idcargo and edc.idestado=0)"
            . "left JOIN mod_estructuracomp.nom_filaestruc nfe on (nfe.idfila = edc.idcargo)"
            . "left JOIN mod_nomina.conf_modelonomina cm ON (cm.idtipopago = el.idtipopago)"
            . "left JOIN mod_nomina.nom_tiponomina ntn ON (ntn.idtiponomina = cm.idtiponomina)"
            . "left JOIN mod_persona.dat_personaentidad dpe ON (dpe.idpersona = dp.idpersona AND
                    (dpe.fhasta IS NULL OR dpe.fhasta >= now()))"
            . "left JOIN mod_persona.dat_situacionlaboral dsl ON (dsl.idpersonaentidad = dpe.idpersonaentidad "
            . "AND dsl.idcargo = dco.idcargo AND (dsl.fhasta IS NULL OR dsl.fhasta >= now()))";
        $order = " order by nfe.nivel ASC, 4 ASC";

        $sql = $select . " " . $from . " " . $join . " " . $where . $order;


        $rDatosPersona = $conn->fetchAll($sql, array($idelaborarpagos));//print_r($sql);die;

        $arrDatosCampos = array();
        foreach ($rDatosPersona as $p) {
            $arrDatosCampos[$p['idcargosocupados']] = $p;
            $aRef = array();
            foreach ($rDatosPersona as $pb) {
                if ($pb['idpersona'] == $p['idpersona'] && $p['idcargosocupados'] != $pb['idcargosocupados']) {
                    $aRef[] = $pb['idcargosocupados'];
                }
            }
            $arrDatosCampos[$p['idcargosocupados']]['referencia'] = $aRef;
        }

        return $arrDatosCampos;
    }

    /* Tranforma las fechas del periodo de pago */

    private function devolverFechasPago(&$rPago)
    {
        $fechas = new stdClass();

        if ($rPago[0]['fechainicioperiodo'] == '') {
            $arrMesAP = explode('-', $rPago[0]['mesanyopago']);
            $ultimodia = mktime(0, 0, 0, 3, 0, $arrMesAP[0]);
            $fechas->fechainicio = $arrMesAP[0] . "-" . $arrMesAP[1] . "-01";
            $fechas->fechafin = $arrMesAP[0] . "-" . $arrMesAP[1] . "-" . $ultimodia;
        } else {
            $fi = explode('/', $rPago[0]['fechainicioperiodo']);
            $ff = explode('/', $rPago[0]['fechafinperiodo']);

            $fechas->fechainicio = $fi[2] . '-' . $fi[1] . '-' . $fi[0];
            $fechas->fechafin = $ff[2] . '-' . $ff[1] . '-' . $ff[0];
        }
        return $fechas;
    }

    public function cargarPlantillasNominales(&$conn, &$rPago)
    {
        $sql = "SELECT idplantillanominal, denominacion, identidad, idcentrocosto, codigo, idarea, esbrigada
               FROM mod_nomina.conf_plantillanominal WHERE identidad = ?;";

        $arrR = $conn->fetchAll($sql, array($rPago[0]['identidad']));

        $arrPlantillas = array();
        foreach ($arrR as $rp) {
            $arrPlantillas[$rp['idplantillanominal']] = $rp;
        }
        return $arrPlantillas;
    }

    /* Busca los reportes que van al pago pago */

    public function cargarReportes(&$conn, &$rPago, $arridpersonas)
    {
        $fechas = $this->devolverFechasPago($rPago);

        $sql = "SELECT dr.idconfreportescertificaciones, ctr.denominacion as tiporeporte, der.idelemento, 
                dver.idvariablesconfreportescertificaciones, dver.valor,
                dver.idvariableselementosreportescertificaciones
                FROM mod_nomina.dat_reportescertificaciones dr
                LEFT JOIN mod_nomina.dat_elementosreportescertificaciones der
                    on (der.idreportescertificaciones = dr.idreportescertificaciones)
                LEFT JOIN mod_nomina.conf_tiporeportescertificaciones ctr
                    on (ctr.idconfreportescertificaciones = dr.idconfreportescertificaciones)
                LEFT JOIN mod_nomina.dat_variableselementosreportescertificaciones dver
                    on (dver.idelementosreportescertificaciones = der.idelementosreportescertificaciones)
                WHERE dr.identidad = ? AND dr.fechainicio <= '{$fechas->fechainicio}'::date AND
                    (dr.fechafin >= '{$fechas->fechafin}'::date OR dr.fechafin IS NULL)";
        //(dr.fechafin >= '{$fechas->fechafin}'::date OR dr.fechafin IS NULL) AND der.idelemento in (" . implode(',', $arridpersonas) . ")";
        $arrR = $conn->fetchAll($sql, array($rPago[0]['identidad']));

        $arrReportes = array();

        foreach ($arrR as $v) {
            $arrReportes[$v['idelemento']]->reporte[$v['idconfreportescertificaciones']]->tiporeporte = $v['tiporeporte'];
            $arrReportes[$v['idelemento']]->reporte[$v['idconfreportescertificaciones']]
                ->variable[$v['idvariablesconfreportescertificaciones']] = ($v['valor'] == null || $v['valor'] == '') ? 0.00 : $v['valor'];
        }

        return $arrReportes;
    }

    /* Busca la configuracion de las condiciones de las retenciones */

    public function cargarCondicionesRetenciones(&$conn, &$rPago, &$iocInterno)
    {
        $sql = "SELECT cr.formulacumpleretenciones, dem1.expresionacalcular as expresionacalcularcumple, 
                cr.formulalimiteretenciones, dem2.expresionacalcular as expresionacalcularlimite, cr.secumplesiempre, 
                cr.sinlimiteretenciones
               FROM mod_nomina.conf_condicionesretenciones cr
               LEFT JOIN mod_utiles.dat_expresionmatematica dem1 
                ON (dem1.idexpresionmatematica = cr.formulacumpleretenciones) 
               LEFT JOIN mod_utiles.dat_expresionmatematica dem2 
                ON (dem2.idexpresionmatematica = cr.formulalimiteretenciones) 
               WHERE idtiponomina = ?;";

        $arrCondRet = $conn->fetchAll($sql, array($rPago[0]['idtiponomina']));

        if (!empty($arrCondRet)) {
            $arrIds[] = $arrCondRet[0]['formulacumpleretenciones'];
            if ($arrCondRet[0]['formulacumpleretenciones']) {
                $this->arrFormulas[] = $arrCondRet[0]['formulacumpleretenciones'];
            }

            if ($arrCondRet[0]['formulalimiteretenciones'] != '') {
                $arrIds[] = $arrCondRet[0]['formulalimiteretenciones'];
                if ($arrCondRet[0]['formulalimiteretenciones']) {
                    $this->arrFormulas[] = $arrCondRet[0]['formulalimiteretenciones'];
                }

            }
            $arrIndFormulas = $iocInterno->comun->ObtenerarrIdIndicadoresporArrayExpresionMatematica($arrIds);
            $arrCondRet[0]['indicadorescumple'] = $arrIndFormulas[$arrCondRet[0]['formulacumpleretenciones']];
            if (array_key_exists($arrCondRet[0]['formulalimiteretenciones'], $arrIndFormulas)) {
                $arrCondRet[0]['indicadoreslimite'] = $arrIndFormulas[$arrCondRet[0]['formulalimiteretenciones']];
            }
            return $arrCondRet[0];
        }

        return $arrCondRet;
    }

    /* Busca en el submayor de retenciones las retenciones de cada persona va al pago pago */

    public function cargarRetenciones(&$arrIdsPersonas, &$conn, &$rPago, &$retencionesaplicar)
    {
        /*$sql = "SELECT rp.idretencionpersona, rp.idpersona, rp.idtiporetencion, rp.saldoinicial, rp.mensualidad, 
                rp.ultmensualidad, rp.prioridad, tr.saldolimite, tr.orden, tr.tienelimitemaximo, hrp.saldodeladeudo, 
                hrp.retencionpendiente, saldodeladeudopendiente, hrp.fechaoperacion       
                FROM mod_nomina.dat_retencionpersona rp
                INNER JOIN mod_nomina.nom_tiporetencion tr ON (tr.idtiporetencion = rp.idtiporetencion)
                LEFT JOIN mod_nomina.his_retencionpersona hrp ON (hrp.idretencionpersona = rp.idretencionpersona
                    AND hrp.fechaoperacion = (SELECT MAX(h1.fechaoperacion) FROM mod_nomina.his_retencionpersona h1 
                    WHERE h1.idretencionpersona = hrp.idretencionpersona) 
                        )  
                WHERE rp.identidad = ? AND (rp.fechafin IS NULL OR rp.fechafin >= now()) AND rp.activo=1
                AND rp.idpersona IN (" . implode(',', $arrIdsPersonas) . ")
                ORDER BY rp.idpersona, tr.orden, hrp.idhisretencionpersona";*/
                
                $entidad = $rPago[0]['identidad'];
                $sql ="SELECT DISTINCT on(rp.idretencionpersona) rp.idretencionpersona, rp.idpersona, rp.idtiporetencion, rp.saldoinicial, rp.mensualidad, 
                rp.ultmensualidad, rp.prioridad, tr.saldolimite, tr.orden, tr.tienelimitemaximo, hrp.saldodeladeudo, 
                hrp.retencionpendiente, saldodeladeudopendiente, hrp.fechaoperacion       
                FROM mod_nomina.dat_retencionpersona rp
                INNER JOIN mod_nomina.nom_tiporetencion tr ON (tr.idtiporetencion = rp.idtiporetencion)
                LEFT JOIN mod_nomina.his_retencionpersona hrp ON (hrp.idretencionpersona = rp.idretencionpersona AND rp.idpersona IN (" . implode(',', $arrIdsPersonas) . "))  
                WHERE rp.identidad = {$entidad}::numeric  and (rp.fechafin IS NULL OR rp.fechafin >= now()) AND rp.activo=1
                ORDER BY rp.idretencionpersona,hrp.fechaoperacion desc,tr.orden";
        $arrR = $conn->fetchAll($sql, array());

        $arrRetenciones = array();

        foreach ($arrR as $v) {
            $arrRetenciones[$v['idpersona']]->tiporetencion[$v['idtiporetencion']][$v['idretencionpersona']] = $v;
            $ra = array();
            $ra['idpersona'] = $v['idpersona'];
            $ra['idtiporetencion'] = $v['idtiporetencion'];
            $retencionesaplicar[] = $ra;
        }
        return $arrRetenciones;
    }

    /* Funcion para obtener las retenciones por personas que se pueden aplicar en este período y verifica si se 
      aplicaron en otro pago del mismo periodo */

    public function cargarRetencionesAplicadasPorPersona(&$conn, $pago, $retencionesaplicar)
    {
        $arrIdpersonas = array();
        $arrIdsTiposRetenciones = array();
        $arrPRA = array();

        foreach ($retencionesaplicar as $ra) {
            $arrIdpersonas[] = $ra['idpersona'];
            $arrIdsTiposRetenciones[$ra['idtiporetencion']] = $ra['idtiporetencion'];
        }
        if (count($arrIdpersonas) > 0) {
            ///Buscando el mes de pago
            $refechafinp = explode('/', $pago[0]['fechafinperiodo']);
            $mespago = $refechafinp[1];
            $annopago = $refechafinp[2];
            $ultimodia = date("d",(mktime(0,0,0,$mespago+1,1,$annopago)-1));
            //Fecha Inicio Mes de Pago
            $fechainiciomespago = "1/".$mespago."/".$annopago;
            //Fecha Fin Mes de Pago
            $fechafinmespago = $ultimodia."/".$mespago."/".$annopago;

            $sql = "SELECT idretencionesaplicadasporpersona, idelaborarpagos, idpersona, idtiporetencion
					FROM mod_nomina.dat_retencionesaplicadasporpersona rap
					WHERE rap.idpersona IN (" . implode(',', $arrIdpersonas) . ") AND "
                . "rap.idtiporetencion IN (" . implode(',', $arrIdsTiposRetenciones) . ") "
                . "AND rap.idelaborarpagos IN (SELECT idelaborarpagos FROM mod_nomina.dat_elaborarpagos WHERE "
                . "identidad = ? AND ((fechainicioperiodo BETWEEN '{$fechainiciomespago}'::date AND '{$fechafinmespago}'::date) and (fechafinperiodo BETWEEN '{$fechainiciomespago}'::date AND '{$fechafinmespago}'::date)));";

            $arrPersonasConRetAplicadas = $conn->fetchAll($sql, array($pago[0]['identidad']));

            foreach ($arrPersonasConRetAplicadas as $pra) {
                $arrPRA[$pra['idpersona']]->tiporetencion[$pra['idtiporetencion']] = $pra;
            }
        }

        return $arrPRA;
    }

    /* Busca en el submayor de vacaciones las vacaciones de cada persona va al pago pago */

    public function cargarVacaciones(&$arrIdsPersonas, &$conn, &$rPago)
    {
        //Datos de datvacaciones
		$sql = "SELECT vp.idvacacionespersona, vp.idpersona, vp.tiempoacumuladoinicial, vp.importeacumuladoinicial
                FROM mod_nomina.dat_vacacionespersona vp
                WHERE vp.identidad = ? AND  vp.idpersona IN (" . implode(',', $arrIdsPersonas) . ");"; 
        $arrRV = $conn->fetchAll($sql, array($rPago[0]['identidad'])); 
		
		//Recorriendo los datos de datvacaciones para obtener la ultima operacion
		foreach($arrRV as $i=>$rv){
		  //Ultima operacion
		$sqlop = "SELECT hvp.idnomina, hvp.tipooperacion, hvp.fechaoperacion, hvp.tiempoacumulado, hvp.importeacumulado, hvp.saldoentiempo, hvp.saldoenimporte
                FROM mod_nomina.his_vacacionespersona hvp
                INNER JOIN mod_nomina.dat_vacacionespersona dvp on(dvp.idvacacionespersona = hvp.idvacacionespersona)
                WHERE hvp.idvacacionespersona = ? ORDER BY hvp.idhisvacacionespersona DESC LIMIT 1;";
        $arrOP = $conn->fetchAll($sqlop, array($rv['idvacacionespersona']));
		$arrRV[$i]['idnomina'] = $arrOP[0]['idnomina'];
		$arrRV[$i]['tipooperacion'] = $arrOP[0]['tipooperacion'];
		$arrRV[$i]['fechaoperacion'] = $arrOP[0]['fechaoperacion'];
		$arrRV[$i]['tiempoacumulado'] = $arrOP[0]['tiempoacumulado'];
		$arrRV[$i]['importeacumulado'] = $arrOP[0]['importeacumulado'];
		$arrRV[$i]['saldoentiempo'] = $arrOP[0]['saldoentiempo'];
		$arrRV[$i]['saldoenimporte'] = $arrOP[0]['saldoenimporte'];			
		}

        $arrVacaciones = array();
        $arrPersonasFaltaInicializacion = array();

        foreach ($arrIdsPersonas as $idp) {
            $encontrada = -1;
            foreach ($arrRV as $v) {
                if ($idp == $v['idpersona']) {
                    $arrVacaciones[$v['idpersona']] = $v;
                    $encontrada = 1;
                }
            }
            if ($encontrada == -1) {
                $arrPersonasFaltaInicializacion[] = $idp;
            }
        }
        /* El indice faltan es para un array con las personas que no tienen inicializado el submayor de vacaciones */
        return array('submayor' => $arrVacaciones, 'faltan' => $arrPersonasFaltaInicializacion);
    }

    /* Busca las variables globales definidas en el sistema */

    public function cargarVariablesGlobales(&$conn, &$rPago)
    {
        $sql = "SELECT vg.idvariableglobal, vg.denominacion, vg.idnivelconfiguracion, vg.lugaresdecimales, 
                        vg.calculosubsidio, cvg.identidad, cvg.idcargo, cvg.valor
                  FROM mod_nomina.nom_variableglobal vg
                  LEFT JOIN mod_nomina.conf_variableglobalvalor cvg ON (cvg.idvariableglobal = vg.idvariableglobal 
                    and (vg.fechafin IS NULL OR vg.fechafin >= now()) AND (vg.idnivelconfiguracion = 1
                  OR (vg.idnivelconfiguracion = 3) OR (vg.idnivelconfiguracion = 2 AND cvg.identidad = ?)));";

        $arrRVG = $conn->fetchAll($sql, array($rPago[0]['identidad']));

        $arrVarGlob = array();

        foreach ($arrRVG as $v) {
            if ($v['idnivelconfiguracion'] == 3) {
                $arrVarGlob[$v['idvariableglobal']]['idvariableglobal'] = $v['idvariableglobal'];
                $arrVarGlob[$v['idvariableglobal']]['idnivelconfiguracion'] = $v['idnivelconfiguracion'];
                $arrVarGlob[$v['idvariableglobal']]['denominacion'] = $v['denominacion'];
                $arrVarGlob[$v['idvariableglobal']]['cargos'][$v['idcargo']] = $v['valor'];
            } else {
                $arrVarGlob[$v['idvariableglobal']] = $v;
            }
        }
        return $arrVarGlob;
    }

    /* Busca las escalas del concepto y las devuelve */

    private function buscarEscaladelConcepto(&$arr, $idconceptopdtarifa)
    {
        $aescala = array();
        foreach ($arr as $e) {
            if ($e['idconceptopdtarifa'] == $idconceptopdtarifa) {
                $aescala[$e['idescalatarifa']] = $e;
            }
        }
        return $aescala;
    }

    /* Buscar la estructura de la escala del concepto y la devuelve */

    private function buscarEstructuraEscaladelConcepto(&$arr, $idconceptopdtarifa)
    {
        $aescala = array();
        foreach ($arr as $e) {
            if ($e['idconceptopdtarifa'] == $idconceptopdtarifa) {
                $aescala[$e['idestructuraescalar']] = $e;
            }
        }
        return $aescala;
    }

    /* Buscar las dependencias de la estructura de la escala del concepto y la devuelve */

    private function buscarDependenciaEstructuraEscaladelConcepto(&$arr, $idconceptopdtarifa)
    {
        $adescala = array();
        foreach ($arr as $e) {
            if ($e['idconceptopdtarifa'] == $idconceptopdtarifa) {
                $adescala[$e['idestructuraescalaradyacente']] = $e;
            }
        }
        return $adescala;
    }

    /* Busca los conceptos de percepciones y descuentos */

    public function cargarConceptosPercepcionesDescuentos(&$conn, &$iocInterno, &$conceptospddescuentos, &$conceptospddescuentosaplicar)
    {
        $sql = "SELECT cpd.idconceptopercepciondescuento, cpd.denominacion, cpd.idtipoconceptopd, 
                        cpdt.idconceptopdtarifa, cpdt.idtarifa, cpdt.idformacalculo,
                        cpdt.importe, cpdt.idformula, cpdt.lugaresdecimales, dem.expresionacalcular,
                        cpd.esdescuentoaplicarunaves, cpd.formulaaplicardescuentounaves, demd.expresionacalcular as expresionacalculardescuento
                  FROM mod_nomina.nom_conceptopercepciondescuento cpd
                  INNER JOIN mod_nomina.nom_conceptopdtarifa cpdt 
                    ON (cpdt.idconceptopercepciondescuento = cpd.idconceptopercepciondescuento)
                  LEFT JOIN mod_utiles.dat_expresionmatematica dem ON (dem.idexpresionmatematica = cpdt.idformula)
                  LEFT JOIN mod_utiles.dat_expresionmatematica demd ON (demd.idexpresionmatematica = cpd.formulaaplicardescuentounaves)
                WHERE (cpd.fechafin IS NULL OR cpd.fechafin >= now());";

        $arrCPD = $conn->fetchAll($sql);

        $arrConceptosPD = array();

        $arrCPDEscalas = array();
        $arrCPDFormulas = array();

        foreach ($arrCPD as $v) {
            if ($v['idformacalculo'] == 3) {
                $arrCPDEscalas[] = $v['idconceptopdtarifa'];
            }
            if ($v['idformacalculo'] == 2) {
                $arrCPDFormulas[] = $v['idformula'];
                if ($v['idformula']) {
                    $this->arrFormulas[] = $v['idformula'];
                }

            }

            if($v['formulaaplicardescuentounaves'] != -1 && $v['formulaaplicardescuentounaves'] != null){
                $this->arrFormulas[] = $v['formulaaplicardescuentounaves'];
            }

            if ($v['esdescuentoaplicarunaves'] == 1) {
                $arrInd = array();
                if (!empty($v['formulaaplicardescuentounaves'])) {
                    $rFormula = $iocInterno->comun->ObtenerarrIdIndicadoresporArrayExpresionMatematica(array($v['formulaaplicardescuentounaves']));
                    $arrInd = $rFormula[$v['formulaaplicardescuentounaves']];
                }

                $conceptospddescuentos[$v['idconceptopercepciondescuento']] = array('idconceptopercepciondescuento' => $v['idconceptopercepciondescuento'], 'idformulaaplicardescuento' => $v['formulaaplicardescuentounaves'], 'expresionacalcular' => $v['expresionacalculardescuento'], 'indicadores' => $arrInd);
                $conceptospddescuentosaplicar[] = $v['idconceptopercepciondescuento'];
            }
        }

        if (!empty($arrCPDEscalas)) {
            $arrIndFormulas = $iocInterno->comun->ObtenerarrIdIndicadoresporArrayExpresionMatematica($arrCPDFormulas);
            $sqlEscala = "SELECT idescalatarifa, idoperadorcomparacion, valorinicial, valorfinal,
								idformacalculo, importe, idformula, idconceptopdtarifa, idestructuraescalar, 
								valorescalar, idpadre
						   FROM mod_nomina.nom_escalatarifa WHERE idconceptopdtarifa IN ("
                . implode(',', $arrCPDEscalas) . ") ;";
            $arrEscalas = $conn->fetchAll($sqlEscala);

            $sqlEstEscala = "SELECT idestructuraescalar, denominacion, idtipocampo, idnomencladorreferencia,
								idconceptopdtarifa, nivel, idtipoentrada, idconfreportescertificaciones, 
								idvariablesconfreportescertificaciones
						   FROM mod_nomina.nom_estructuraescalar WHERE idconceptopdtarifa IN ("
                . implode(',', $arrCPDEscalas) . ") ;";
            $arrEstEscalas = $conn->fetchAll($sqlEstEscala);

            $sqlDependencias = "SELECT iddependenciaestructuraescalar, idestructuraescalar, idestructuraescalaradyacente,
								idconceptopdtarifa
							FROM mod_nomina.nom_dependenciaestructuraescalar WHERE idconceptopdtarifa IN ("
                . implode(',', $arrCPDEscalas) . ") ;";
            $arrDependencias = $conn->fetchAll($sqlDependencias);
        }
        foreach ($arrCPD as $c) {
            if ($c['idformacalculo'] == 2) {
                if (array_key_exists($c['idformula'], $arrIndFormulas)) {
                    $c['indicadores'] = $arrIndFormulas[$c['idformula']];
                } else {
                    $c['indicadores'] = array();
                }
            }

            if ($c['idformacalculo'] == 3) {
                $c['escala'] = $this->buscarEscaladelConcepto($arrEscalas, $c['idconceptopdtarifa']);
                $c['estructuraescala'] = $this->buscarEstructuraEscaladelConcepto
                ($arrEstEscalas, $c['idconceptopdtarifa']);
                $c['dependencia'] = $this->buscarDependenciaEstructuraEscaladelConcepto
                ($arrDependencias, $c['idconceptopdtarifa']);
            }

            $arrConceptosPD[$c['idconceptopercepciondescuento']]->conceptopdtarifa[$c['idconceptopdtarifa']] = $c;
            $arrConceptosPD[$c['idconceptopercepciondescuento']]->denominacion = $c['denominacion'];
        }


        return $arrConceptosPD;
    }

    public function cargarConceptosPercepcionesDescuentosAplicadosPorPersona(&$conn, &$pago, $conceptospddescuentosaplicar, $arrIdsPersonas)
    {
        $arrPDA = array();
        if (count($arrIdsPersonas) > 0 && !empty($conceptospddescuentosaplicar)) {
            $sql = "SELECT iddescuentosaplicadosporpersona, idelaborarpagos, idpersona, idconceptopercepciondescuento
					FROM mod_nomina.dat_descuentosaplicadosporpersona dap
					WHERE dap.idpersona IN (" . implode(',', $arrIdsPersonas) . ") AND "
                . "dap.idconceptopercepciondescuento IN (" . implode(',', $conceptospddescuentosaplicar) . ") "
                . "AND dap.idelaborarpagos IN (SELECT idelaborarpagos FROM mod_nomina.dat_elaborarpagos WHERE "
                . "identidad = ? AND fechainicioperiodo = ? AND fechafinperiodo = ?);";

            $arrPersonasConDescAplicadas = $conn->fetchAll($sql, array($pago[0]['identidad'], $pago[0]['fechainicioperiodo'], $pago[0]['fechafinperiodo']));

            foreach ($arrPersonasConDescAplicadas as $pda) {
                $arrPDA[$pda['idpersona']]->conceptodescuento[$pda['idconceptopercepciondescuento']] = $pda;
            }
        }

        return $arrPDA;
    }

    /* Busca los conceptos generales de la retribucion monetaria */

    public function cargarConceptosGeneralesdelaRetribucionMonetaria(&$conn, &$rPago, &$iocInterno)
    {
        $sql = "SELECT crm.idconceptorm, crm.denominacion, crm.esconceptopagosalario, ccrm.idsistemapago, ccrm.lugaresdecimales,
                ccrm.idexpresionmatematica, dem.expresionacalcular, ccrm.idtipopago, ccrm.calcularpluriempleo,
                ccrm.calcularperiodomensual  FROM mod_nomina.nom_conceptoretribucionmonetaria crm
                INNER JOIN mod_nomina.conf_conceptosgeneralesnomina ccrm ON (ccrm.idconceptorm = crm.idconceptorm)
                INNER JOIN mod_utiles.dat_expresionmatematica dem ON 
                    (dem.idexpresionmatematica = ccrm.idexpresionmatematica)
                WHERE ccrm.identidad = ? AND ccrm.idtipopago = ? AND (crm.fechafin IS NULL OR crm.fechafin >= now());";

        $arrCRM = $conn->fetchAll($sql, array($rPago[0]['identidad'], $rPago[0]['idtipopago']));

        $arrConceptosRM = array();
        $arrExpMat = array();

        foreach ($arrCRM as $v) {
            $arrExpMat[] = $v['idexpresionmatematica'];
            if ($v['idexpresionmatematica']) {
                $this->arrFormulas[] = $v['idexpresionmatematica'];
            }

        }

        $arrIndFormulas = $iocInterno->comun->ObtenerarrIdIndicadoresporArrayExpresionMatematica($arrExpMat);


        foreach ($arrCRM as $c) {
            if (array_key_exists($c['idexpresionmatematica'], $arrIndFormulas)) {
                $c['indicadores'] = $arrIndFormulas[$c['idexpresionmatematica']];
            } else {
                $c['indicadores'] = array();
            }
            $arrConceptosRM[$c['idconceptorm']]->sistemapago[-1] = $c;
            $arrConceptosRM[$c['idconceptorm']]->denominacion = $c;
        }

        return $arrConceptosRM;
    }

    /* Busca la configuracion de las formas y sistemas de pago en una entidad */

    public function cargarConfigFormasySistemasPago(&$conn, &$rPago, &$iocInterno)
    {
        $sql = "SELECT c1.idtipopago, c1.idsistemapago, c1.idconceptopercepciondescuento, c2.idperiodopago, 
                        c2.idexpresionmatematica, c2.lugaresdecimales, c3.idvariableauxconceptospdformasysistemaspago, 
                        c3.formaentrada, c3.idconfreportescertificaciones, c3.idvariablesconfreportescertificaciones,
                        c3.lugaresdecimalesvariable, dem.expresionacalcular
                  FROM mod_nomina.conf_conceptosportiposysistemaspago c1
                  INNER JOIN mod_nomina.conf_conceptospdformasysistemaspago c2 
                    ON (c2.idconfconceptosportiposysistemaspago = c1.idconfconceptosportiposysistemaspago)
                  LEFT JOIN mod_nomina.dat_variableauxconceptospdformasysistemaspago c3 
                    ON (c3.idconfconceptospdformasysistemaspago = c2.idconfconceptospdformasysistemaspago)
                  INNER JOIN mod_utiles.dat_expresionmatematica dem 
                    ON (dem.idexpresionmatematica = c2.idexpresionmatematica)
                WHERE c1.identidad = ?;";

        $arrFSP = $conn->fetchAll($sql, array($rPago[0]['identidad']));

        $arrFormSistPago = array();
        $arrExpMat = array();

        foreach ($arrFSP as $v) {
            $arrExpMat[] = $v['idexpresionmatematica'];
            if ($v['idexpresionmatematica']) {
                $this->arrFormulas[] = $v['idexpresionmatematica'];
            }

        }

        $arrIndFormulas = $iocInterno->comun->ObtenerarrIdIndicadoresporArrayExpresionMatematica($arrExpMat);


        foreach ($arrFSP as $c) {
            if (array_key_exists($c['idexpresionmatematica'], $arrIndFormulas)) {
                $c['indicadores'] = $arrIndFormulas[$c['idexpresionmatematica']];
            } else {
                $c['indicadores'] = array();
            }
            if ($c['idsistemapago'] != "") {
                $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]
                    ->periodopago[$c['idperiodopago']]->conceptopd[$c['idconceptopercepciondescuento']]
                    ->idexpresionmatematica = $c['idexpresionmatematica'];
                $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]
                    ->periodopago[$c['idperiodopago']]->conceptopd[$c['idconceptopercepciondescuento']]
                    ->indicadores = $c['indicadores'];
                $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]
                    ->periodopago[$c['idperiodopago']]->conceptopd[$c['idconceptopercepciondescuento']]
                    ->lugaresdecimales = $c['lugaresdecimales'];
                $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]
                    ->periodopago[$c['idperiodopago']]->conceptopd[$c['idconceptopercepciondescuento']]
                    ->expresionacalcular = $c['expresionacalcular'];

                if ($c['idconfreportescertificaciones'] != "") {
                    $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]
                        ->periodopago[$c['idperiodopago']]->conceptopd[$c['idconceptopercepciondescuento']]
                        ->variable[$c['idvariableauxconceptospdformasysistemaspago']]
                        ->formaentrada = $c['formaentrada'];
                    $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]
                        ->periodopago[$c['idperiodopago']]->conceptopd[$c['idconceptopercepciondescuento']]
                        ->variable[$c['idvariableauxconceptospdformasysistemaspago']]
                        ->idconfreportescertificaciones = $c['idconfreportescertificaciones'];
                    $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]
                        ->periodopago[$c['idperiodopago']]->conceptopd[$c['idconceptopercepciondescuento']]
                        ->variable[$c['idvariableauxconceptospdformasysistemaspago']]
                        ->idvariablesconfreportescertificaciones = $c['idvariablesconfreportescertificaciones'];
                    $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]
                        ->periodopago[$c['idperiodopago']]->conceptopd[$c['idconceptopercepciondescuento']]
                        ->variable[$c['idvariableauxconceptospdformasysistemaspago']]
                        ->lugaresdecimalesvariable = $c['lugaresdecimalesvariable'];
                }
            } else {
                $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]->periodopago[-1]
                    ->conceptopd[$c['idconceptopercepciondescuento']]
                    ->idexpresionmatematica = $c['idexpresionmatematica'];
                $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]->periodopago[-1]
                    ->conceptopd[$c['idconceptopercepciondescuento']]
                    ->indicadores = $c['indicadores'];
                $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]->periodopago[-1]
                    ->conceptopd[$c['idconceptopercepciondescuento']]
                    ->lugaresdecimales = $c['lugaresdecimales'];
                $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]->periodopago[-1]
                    ->conceptopd[$c['idconceptopercepciondescuento']]
                    ->expresionacalcular = $c['expresionacalcular'];

                if ($c['idconfreportescertificaciones'] != "") {
                    $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]->periodopago[-1]
                        ->conceptopd[$c['idconceptopercepciondescuento']]
                        ->variable[$c['idvariableauxconceptospdformasysistemaspago']]
                        ->formaentrada = $c['formaentrada'];
                    $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]->periodopago[-1]
                        ->conceptopd[$c['idconceptopercepciondescuento']]
                        ->variable[$c['idvariableauxconceptospdformasysistemaspago']]
                        ->idconfreportescertificaciones = $c['idconfreportescertificaciones'];
                    $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]->periodopago[-1]
                        ->conceptopd[$c['idconceptopercepciondescuento']]
                        ->variable[$c['idvariableauxconceptospdformasysistemaspago']]
                        ->idvariablesconfreportescertificaciones = $c['idvariablesconfreportescertificaciones'];
                    $arrFormSistPago[$c['idtipopago']]->sistemapago[-1]->periodopago[-1]
                        ->conceptopd[$c['idconceptopercepciondescuento']]
                        ->variable[$c['idvariableauxconceptospdformasysistemaspago']]
                        ->lugaresdecimalesvariable = $c['lugaresdecimalesvariable'];
                }
            }
        }

        return $arrFormSistPago;
    }

    /* Busca la configuracion de elementos salariales al cargo y persona */

    public function cargarElementosSalarialesalCargoyPersona(&$conn, &$arrIdsCargosOcupados, &$pago)
    {
        $sql = "SELECT dco.idcargosocupados, e1.idsistemapago, e1.idperiodopago, e2.idconceptopercepciondescuento, 
                e2.idtarifa,  e3.idescalatarifa as idescalatarifacargo, e4.importe as importepersona,e4.idescalatarifa as idescalatarifapersona
                FROM mod_nomina.dat_cargosocupados dco
              INNER JOIN mod_nomina.conf_elementosalarialcargo e1 ON (e1.idcargo = dco.idcargo)
              LEFT JOIN mod_nomina.conf_conceptospdelementossalariales e2 
                ON (e2.idelementosalarialcargo = e1.idelementosalarialcargo 
                    AND (e2.fechafin IS NULL OR e2.fechafin >= now()))
              LEFT JOIN mod_nomina.conf_escalaelementosalarial e3 
                ON (e3.idconfconceptospdelementossalariales = e2.idconfconceptospdelementossalariales 
                    AND (e3.fechafin IS NULL OR e3.fechafin >= now()))
              LEFT JOIN mod_nomina.conf_escalaelementosalarialpersona e4 
                ON (e4.idconfconceptospdelementossalariales = e2.idconfconceptospdelementossalariales
                    AND e4.idpersona = dco.idpersona AND (e4.fechafin IS NULL OR e4.fechafin >= now()))
              WHERE (e1.fechafin IS NULL OR e1.fechafin >= now()) 
                AND dco.idsituacionlaboral IS NULL AND dco.idcargosocupados 
                    IN (" . implode(',', $arrIdsCargosOcupados) . ") ;";

        $arrES = $conn->fetchAll($sql);
        $arrElemSal = array();

        foreach ($arrES as $e) {
            if ($pago[0]['sedesglosa'] != 1) {
                $arrElemSal[$e['idcargosocupados']]->sistemapago[-1]->periodopago[-1]
                    ->conceptopd[$e['idconceptopercepciondescuento']]->idtarifa = $e['idtarifa'];
                $arrElemSal[$e['idcargosocupados']]->sp = -1;
                if ($e['idescalatarifacargo'] != "") {
                    $arrElemSal[$e['idcargosocupados']]->sistemapago[-1]->periodopago[-1]
                        ->conceptopd[$e['idconceptopercepciondescuento']]
                        ->idescalatarifacargo = $e['idescalatarifacargo'];
                }
                if ($e['idescalatarifapersona'] != "") {
                    $arrElemSal[$e['idcargosocupados']]->sistemapago[-1]->periodopago[-1]
                        ->conceptopd[$e['idconceptopercepciondescuento']]
                        ->idescalatarifapersona = $e['idescalatarifapersona'];

                    $arrElemSal[$e['idcargosocupados']]->sistemapago[-1]->periodopago[-1]
                        ->conceptopd[$e['idconceptopercepciondescuento']]
                        ->importepersona = $e['importepersona'];
                }
            } else {
                $arrElemSal[$e['idcargosocupados']]->sistemapago[$e['idsistemapago']]->periodopago[$e['idperiodopago']]
                    ->conceptopd[$e['idconceptopercepciondescuento']]->idtarifa = $e['idtarifa'];
                $arrElemSal[$e['idcargosocupados']]->sp = $e['idsistemapago'];
                if ($e['idescalatarifacargo'] != "") {
                    $arrElemSal[$e['idcargosocupados']]->sistemapago[$e['idsistemapago']]->periodopago[$e['idperiodopago']]
                        ->conceptopd[$e['idconceptopercepciondescuento']]
                        ->idescalatarifacargo = $e['idescalatarifacargo'];
                }
                if ($e['idescalatarifapersona'] != "") {
                    $arrElemSal[$e['idcargosocupados']]->sistemapago[$e['idsistemapago']]->periodopago[$e['idperiodopago']]
                        ->conceptopd[$e['idconceptopercepciondescuento']]
                        ->idescalatarifapersona = $e['idescalatarifapersona'];

                    $arrElemSal[$e['idcargosocupados']]->sistemapago[-1]->periodopago[-1]
                        ->conceptopd[$e['idconceptopercepciondescuento']]
                        ->importepersona = $e['importepersona'];
                }
            }
        }
        return $arrElemSal;
    }

    /* Busca la configuracion de elementos salariales de las situaciones de servicio */

    public function cargarElementosSalarialesSituacionServ(&$conn, &$arrIdsCargosOcupados, &$pago)
    {
        $sql = "SELECT e1.idelementosalarialsituacionservicio, e1.idsistemapago, e1.idperiodopago, e1.idcargoocupado, 
                e2.idconceptopercepciondescuento, e2.idtarifa, e3.idescalatarifa, e3.importe as importesitservicio
                FROM mod_nomina.conf_elementosalarialsituacionservicio e1
              INNER JOIN mod_nomina.dat_cargosocupados dco ON (dco.idcargosocupados = e1.idcargoocupado)
              LEFT JOIN mod_nomina.conf_conceptpelementsalarialessituacionservicio e2 
                ON (e2.idcargosocupados = e1.idcargoocupado AND (e2.fechafin IS NULL OR e2.fechafin >= now()))
              LEFT JOIN mod_nomina.conf_escalaelementosalarialsituacionservicio e3 
                ON (e3.idconceptpelementsalarialessituacionservicio = e2.idconceptpelementsalarialessituacionservicio 
                    AND (e3.fechafin IS NULL OR e3.fechafin >= now()))
              WHERE (e1.fechafin IS NULL OR e1.fechafin >= now()) AND dco.idsituacionlaboral IS NOT NULL 
                AND e1.idcargoocupado IN (" . implode(',', $arrIdsCargosOcupados) . ") ;";

        $arrESSS = $conn->fetchAll($sql);

        $arrElemSalSitServ = array();

        foreach ($arrESSS as $e) {
            if ($pago[0]['sedesglosa'] != 1) {
                $arrElemSalSitServ[$e['idcargoocupado']]->sistemapago[-1]
                    ->periodopago[-1]->conceptopd[$e['idconceptopercepciondescuento']]
                    ->idtarifa = $e['idtarifa'];
                $arrElemSalSitServ[$e['idcargoocupado']]->sp = -1;
                if ($e['idescalatarifa'] != "") {
                    $arrElemSalSitServ[$e['idcargoocupado']]->sistemapago[-1]
                        ->periodopago[-1]->conceptopd[$e['idconceptopercepciondescuento']]
                        ->idescalatarifa = $e['idescalatarifa'];

                    $arrElemSalSitServ[$e['idcargoocupado']]->sistemapago[-1]
                        ->periodopago[-1]->conceptopd[$e['idconceptopercepciondescuento']]
                        ->importepersona = $e['importesitservicio'];


                }
            } else {
                $arrElemSalSitServ[$e['idcargoocupado']]->sistemapago[$e['idsistemapago']]
                    ->periodopago[$e['idperiodopago']]->conceptopd[$e['idconceptopercepciondescuento']]
                    ->idtarifa = $e['idtarifa'];
                $arrElemSalSitServ[$e['idcargoocupado']]->sp = $e['idsistemapago'];
                if ($e['idescalatarifa'] != "") {
                    $arrElemSalSitServ[$e['idcargoocupado']]->sistemapago[$e['idsistemapago']]
                        ->periodopago[$e['idperiodopago']]->conceptopd[$e['idconceptopercepciondescuento']]
                        ->idescalatarifa = $e['idescalatarifa'];

                    $arrElemSalSitServ[$e['idcargoocupado']]->sistemapago[-1]
                        ->periodopago[-1]->conceptopd[$e['idconceptopercepciondescuento']]
                        ->importepersona = $e['importesitservicio'];
                }
            }
        }

        return $arrElemSalSitServ;
    }

    //Funcion para cargar los campos de la nomina que van en el fichero
    public function cargarEstructuraNomina(&$conn, &$idtiponomina, $identidad, &$iocInterno, &$conceptospddescuentos, $pago, &$camposrefnominas, $arrIdsPersonas, $idelaborarpagos)
    {
        $objDatElaborarPagosReferencia = new DatElaborarPagosReferencia();
        $sql = "SELECT emn.*,mnc.*,expm.expresionacalcular
                FROM mod_nomina.conf_estructuramodelosnomina emn
                INNER JOIN mod_nomina.conf_estructuramodelosnominaentidad cemne
                    ON (cemne.idestructuramodelodomina = emn.idestructuramodelodomina)
                LEFT JOIN mod_nomina.dat_datosmodelonominaconceptos mnc
                    ON (mnc.idestructuramodelosnomina = emn.idestructuramodelodomina)
                LEFT JOIN mod_utiles.dat_expresionmatematica expm
                    ON (expm.idexpresionmatematica = emn.idvalormostrar and  (emn.idtipocampo = 3 OR emn.idtipocampo = 4))
                WHERE emn.idtiponomina = ? and cemne.idestructura = ? ORDER BY emn.orden";
        $arrEMN = $conn->fetchAll($sql, array($idtiponomina, $identidad));

        $arrExpMat = array();

        foreach ($arrEMN as $v) {
            if ($v['idtipocampo'] == 3 || $v['idtipocampo'] == 4) {
                $arrExpMat[] = $v['idvalormostrar'];
                if ($v['idvalormostrar']) {
                    $this->arrFormulas[] = $v['idvalormostrar'];
                }

            }
            if ($v['idtipocampo'] == 2) {
                if ($v['tipo'] == 5) {
                    $c = explode('_', $v['idconcepto']);

                    if (array_key_exists($c[4], $conceptospddescuentos)) {
                        $conceptospddescuentos[$c[4]]['columna'] = "c" . $v['idestructuramodelosnomina'];
                    } else {
                        unset($conceptospddescuentos[$c[4]]);
                    }
                }
            }
        }

        $arrIndFormulas = $iocInterno->comun->ObtenerarrIdIndicadoresporArrayExpresionMatematica($arrExpMat);

        $arrTiposNominaIndRefNomina = array();
        $arrTipodNominaRefFechas = array();
        $contrefnomina = 0;$contrefnominaope = 0;
        $arrCamposIndRefNomina = array();
        $arrIndRefNomina = array();

        $arrCamposIndRefOtrasNomina = array();
        $arrIndRefOtrasNomina = array();
        $arrEstIndRefOtrasNomina = array();

        $arrIndRefOtrasNominaPeriodEsp = array();
        $arrCamposIndRefOtrasNominaPeriodEsp = array();
        $arrEstIndRefOtrasNominaPeriodEsp = array();
        $arrTipodNominaRefPeriodEsp = array();
        if (!empty($arrIndFormulas)) {
            foreach ($arrEMN as &$n) {
                if ($n['idtipocampo'] == 3 || $n['idtipocampo'] == 4) {
                    if (array_key_exists($n['idvalormostrar'], $arrIndFormulas)) {
                        $n['indicadores'] = $arrIndFormulas[$n['idvalormostrar']];
                        foreach ($arrIndFormulas[$n['idvalormostrar']] as $i) {  //print_r($i);
                            $a = explode("_", $i);
                            if (is_numeric($a[0])) {
                                if ($n['idtipocampo'] == 4) {
                                    //Por rangos de fecha
                                    if($n['tiporeferencia'] == 1){
                                        $arrTipodNominaRefFechas[$contrefnomina]['idtiponomina'] = $a[0];
                                        $fecha = $this->buscarFechaNominaReferencia($n['periodobusquedareferencianomina'], $pago[0]['fechainicioperiodo'], $pago[0]['fechafinperiodo']);
                                        $arrTipodNominaRefFechas[$contrefnomina]['fechainicio'] = $fecha->fechainicio;
                                        $arrTipodNominaRefFechas[$contrefnomina]['fechafin'] = $fecha->fechafin;
                                        $arrTipodNominaRefFechas[$contrefnomina]['periodobusquedareferencianomina'] = $n['periodobusquedareferencianomina'];
                                        $arrTipodNominaRefFechas[$contrefnomina]['idestructuramodelodomina'] = $n['idestructuramodelodomina'];
                                        $contrefnomina++;
                                        $arrCamposIndRefOtrasNomina[] = $a[1];
                                        $arrIndRefOtrasNomina[] = $i;
                                        $arrEstIndRefOtrasNomina[] = $n['idestructuramodelodomina'];
                                    //Por periodos especificos
                                    }else{
                                        $arrTipodNominaRefPeriodEsp[$contrefnominaope]['idtiponomina'] = $a[0];
                                        $arrTipodNominaRefPeriodEsp[$contrefnominaope]['idestructuramodelodomina'] = $n['idestructuramodelodomina'];
                                        //Periodos de pago
                                        //Tipo de nomina del tipo de pago
                                        $arridrefelbpag = $objDatElaborarPagosReferencia->obtenerIdElaborarPagosReferenciadosdadoIdElaborarPagos($idelaborarpagos);
                                        $arrayidelabopagoref = array();
                                        if(count($arridrefelbpag)>0){
                                            foreach ($arridrefelbpag as $repr){
                                                $arrayidelabopagoref[] = $repr['idelaborarpagosreferenciados'];
                                            }
                                        }
                                        $arrTipodNominaRefPeriodEsp[$contrefnominaope]['periodospago'] = $arrayidelabopagoref;
                                        $arrCamposIndRefOtrasNominaPeriodEsp[] = $a[1];
                                        $arrIndRefOtrasNominaPeriodEsp[] = $i;
                                        $arrEstIndRefOtrasNominaPeriodEsp[] = $n['idestructuramodelodomina'];
                                        $contrefnominaope++;
                                    }

                                } else {
                                    $arrTiposNominaIndRefNomina[] = $a[0];
                                    $arrCamposIndRefNomina[] = $a[1];
                                    $arrIndRefNomina[] = $i;
                                }

                            }


                        }
                        //die;
                    } else {
                        $n['indicadores'] = array();
                    }
                }
            }
        }
        //Si son refrencias a campos de otras nomina con rangos de fecha especificos
        $buscarrefnominas = array();
        if (!empty($arrIndRefOtrasNomina)) {
            for ($i = 0; $i < count($arrTipodNominaRefFechas); $i++) {
                $idtiponominai = $arrTipodNominaRefFechas[$i]['idtiponomina'];
                $fechainicioi = $arrTipodNominaRefFechas[$i]['fechainicio'];
                $fechafini = $arrTipodNominaRefFechas[$i]['fechafin'];
                for ($j = $i + 1; $j < count($arrTipodNominaRefFechas); $j++) {
                    $idtiponominaj = $arrTipodNominaRefFechas[$j]['idtiponomina'];
                    $fechainicioj = $arrTipodNominaRefFechas[$j]['fechainicio'];
                    $fechafinj = $arrTipodNominaRefFechas[$j]['fechafin'];
                    if ($idtiponominai == $idtiponominaj && $fechafini = $fechainicioj && $fechafini == $fechafinj) {
                        unset($arrTipodNominaRefFechas[$j]);
                        $arrTipodNominaRefFechas = array_values($arrTipodNominaRefFechas);
                    }

                }
            }
            $arrVRef = array();
            $contvf = 0;
            /*print_r($arrTipodNominaRefFechas);
            die;*/
            foreach ($arrTipodNominaRefFechas as $rtiponominaref) {
                $idtiponominaref = $rtiponominaref['idtiponomina'];
                $whereref = '';
                //Si es una referencia a periodos especificos
                /*if($n['tiporeferencia'] == 2){
                    //Tipo de nomina del tipo de pago
                    $arridrefelbpag = DatElaborarPagosReferencia::obtenerIdElaborarPagosReferenciadosdadoIdElaborarPagos($idelaborarpagos);
                    $arrayidelabopagoref = array();
                    if(count($arridrefelbpag)>0){
                        foreach ($arridrefelbpag as $repr){
                            $arrayidelabopagoref[] = $repr['idelaborarpagosreferenciados'];
                        }
                    }
                    $whereref = " ep.idelaborarpagos IN (" . implode(',', $arrayidelabopagoref) . ")";
                //Si es una referencia por rangos de fecha
                }*/
                $whereref = " (ep.fechainicioperiodo = '{$rtiponominaref['fechainicio']}'::date "
                . "AND ep.fechafinperiodo = '{$rtiponominaref['fechafin']}'::date) "
                . "AND cmn.idtiponomina = $idtiponominaref";


                $sql = "SELECT ep.idelaborarpagos, cmn.idtiponomina, dnd.valores
                FROM mod_nomina.dat_elaborarpagos ep
                INNER JOIN mod_nomina.conf_modelonomina cmn ON (cmn.idtipopago = ep.idtipopago)
                INNER JOIN mod_nomina.dat_nomina dn ON (dn.idelaborarpago = ep.idelaborarpagos)
                INNER JOIN mod_nomina.dat_nominadatos dnd ON (dnd.idnomina = dn.idnomina)
                WHERE ep.identidad = {$identidad} AND {$whereref} AND dn.aprobada <> 0 order by cmn.idtiponomina;";
                $arrValores = $conn->fetchAll($sql);

                foreach ($arrValores as $rv) {
                    $arrayvf = array();
                    $arrayvf['idelaborarpagos'] = $rv['idelaborarpagos'];
                    $arrayvf['idtiponomina'] = $rv['idtiponomina'];
                    $arrayvf['valores'] = $rv['valores'];
                    $arrayvf['periodobusquedareferencianomina'] = $rtiponominaref['periodobusquedareferencianomina'];
                    array_push($arrVRef, $arrayvf);
                    $contvf++;
                }
            }
            //$camposrefnominas = array();

            foreach ($arrVRef as $vf) {
                $vnomina = unserialize($vf['valores']);
                foreach ($vnomina as $vref) {
                    foreach ($arrIndRefOtrasNomina as $i => $rarrindref) {
                        $idestructuranominapadre = $arrEstIndRefOtrasNomina[$i];
                        $a = explode("_", $rarrindref);
                        if ($a[0] == $vf['idtiponomina']) {
                            $ref = "c{$a[1]}";
                            $sqlpb = "SELECT emn.periodobusquedareferencianomina
                            FROM mod_nomina.conf_estructuramodelosnomina emn                
                            WHERE emn.idestructuramodelodomina = ?;";
                            $periodobusquedareferencianomina = $conn->fetchOne($sqlpb, array($idestructuranominapadre));
                            if ($vf['periodobusquedareferencianomina'] == $periodobusquedareferencianomina) {
                                if (array_key_exists($ref, $vref)) {
                                    $buscarrefnominas[$vref['idpersona']][$idestructuranominapadre][$vf['idtiponomina'] . '-' . $periodobusquedareferencianomina][$a[1]] = $vref[$ref];
                                    //if($vref['idpersona'] == 1){print_r($buscarrefnominas[$vref['idpersona']]);}
                                }
                            }
                        }
                    }
                }
            }

            foreach ($arrIdsPersonas as $idpers) {
                if (array_key_exists($idpers, $buscarrefnominas)) {
                    $camposrefnominas[$idpers] = $buscarrefnominas[$idpers];
                }
            }

        }
        //Si son refrencias a campos de otras nomina con periodos especificos
        if (!empty($arrIndRefOtrasNominaPeriodEsp)) {
            $arrVRef = array();
            $contvf = 0;
            foreach ($arrTipodNominaRefPeriodEsp as $rtiponominaref) {
                $idtiponominaref = $rtiponominaref['idtiponomina'];
                //Si es una referencia a periodos especificos
                //Tipo de nomina del tipo de pago
                $arridrefelbpag = DatElaborarPagosReferencia::obtenerIdElaborarPagosReferenciadosdadoIdElaborarPagos($idelaborarpagos);
                $arrayidelabopagoref = array();
                if(count($arridrefelbpag)>0){
                    foreach ($arridrefelbpag as $repr){
                        $arrayidelabopagoref[] = $repr['idelaborarpagosreferenciados'];
                    }
                }if(count($arrayidelabopagoref)>0){
                    $whereref = " ep.idelaborarpagos IN (" . implode(',', $arrayidelabopagoref) . ")";
                    $sql = "SELECT ep.idelaborarpagos, cmn.idtiponomina, dnd.valores
                        FROM mod_nomina.dat_elaborarpagos ep
                        INNER JOIN mod_nomina.conf_modelonomina cmn ON (cmn.idtipopago = ep.idtipopago)
                        INNER JOIN mod_nomina.dat_nomina dn ON (dn.idelaborarpago = ep.idelaborarpagos)
                        INNER JOIN mod_nomina.dat_nominadatos dnd ON (dnd.idnomina = dn.idnomina)
                        WHERE ep.identidad = {$identidad} AND {$whereref} AND dn.aprobada <> 0 order by cmn.idtiponomina;";
                    $arrValores = $conn->fetchAll($sql);

                    foreach ($arrValores as $rv) {
                        $arrayvf = array();
                        $arrayvf['idelaborarpagos'] = $rv['idelaborarpagos'];
                        $arrayvf['idtiponomina'] = $rv['idtiponomina'];
                        $arrayvf['valores'] = $rv['valores'];
                        $arrayvf['periodobusquedareferencianomina'] = $rtiponominaref['periodobusquedareferencianomina'];
                        $arrayvf['idestructuramodelodomina'] = $rtiponominaref['idestructuramodelodomina'];
                        array_push($arrVRef, $arrayvf);
                        $contvf++;
                    }
                }
            }
            //$camposrefnominas = array();

            foreach ($arrVRef as $vf) {
                $vnomina = unserialize($vf['valores']);
                foreach ($vnomina as $vref) {
                    foreach ($arrIndRefOtrasNominaPeriodEsp as $i => $rarrindref) {
                        $idestructuranominapadre = $arrEstIndRefOtrasNominaPeriodEsp[$i];
                        $a = explode("_", $rarrindref);
                        if ($a[0] == $vf['idtiponomina']) {
                            $ref = "c{$a[1]}";
                            if (array_key_exists($ref, $vref)) {
                                $buscarrefnominas[$vref['idpersona']][$idestructuranominapadre][$vf['idtiponomina']][$a[1]] = $vref[$ref];
                            }

                        }
                    }
                }
            }

            foreach ($arrIdsPersonas as $idpers) {
                if (array_key_exists($idpers, $buscarrefnominas)) {
                    $camposrefnominas[$idpers] = $buscarrefnominas[$idpers];
                }
            }

        }
        //Si son refrencias a campos de la misma nomina
        if (!empty($arrIndRefNomina)) {
            $arrIndRefNomina = array_unique($arrIndRefNomina);
            $arrTiposNominaIndRefNomina = array_unique($arrTiposNominaIndRefNomina);
            $arrCamposIndRefNomina = array_unique($arrCamposIndRefNomina);

            $fi = explode('/', $pago[0]['fechainicioperiodo']);
            $ff = explode('/', $pago[0]['fechafinperiodo']);
            if ($fi[1] == 12) {
                $fi[1] = 0;
                $fi[2] = $fi[2] + 1;
            }

            $fechainicioperiodo = $pago[0]['fechainicioperiodo'];
            $fechafinperiodo = $pago[0]['fechafinperiodo'];

            $siguiente_fi = mktime(0, 0, 0, $fi[1] + 1, $fi[0], $fi[2]);
            $siguiente_ff = mktime(0, 0, 0, $ff[1] + 2, 0, $ff[2]);
            $finiciosiguiente = date("d/m/Y", $siguiente_fi);
            $ffinsiguiente = date("d/m/Y", $siguiente_ff);

            $anterior_fi = mktime(0, 0, 0, $fi[1] - 1, $fi[0], $fi[2]);
            $anterior_ff = mktime(0, 0, 0, $ff[1], 0, $ff[2]);
            $finicioanterior = date("d/m/Y", $anterior_fi);
            $ffinanterior = date("d/m/Y", $anterior_ff);


            if ($pago[0]['sepagaadelantado'] == 1) {
                $fechainicioperiodo = $finicioanterior;
                $fechafinperiodo = $ffinanterior;
            }

            $sql = "SELECT tp.idtipopago, mn.idtiponomina, tp.sepagaadelantado
            FROM mod_nomina.conf_modelonomina mn
            INNER JOIN mod_nomina.nom_tipopago tp ON (tp.idtipopago = mn.idtipopago)
            WHERE mn.idtiponomina IN (" . implode(',', $arrTiposNominaIndRefNomina) . ");";

            $arrTN = $conn->fetchAll($sql);
            $arrNPAdelantado = array();
            $arrNPNormal = array();

            foreach ($arrTN as $nm) {
                if ($nm['sepagaadelantado'] == 1) {
                    $arrNPAdelantado[] = $nm['idtiponomina'];
                } else {
                    $arrNPNormal[] = $nm['idtiponomina'];
                }
            }

            if (!empty($arrNPAdelantado) || !empty($arrNPNormal)) {

                $where = "";
                if (!empty($arrNPNormal)) {
                    $where1 .= " (ep.fechainicioperiodo = '{$fechainicioperiodo}'::date "
                        . "AND ep.fechafinperiodo = '{$fechafinperiodo}'::date "
                        . "AND cmn.idtiponomina IN (" . implode(',', $arrNPNormal) . ")) ";
                }

                if (!empty($arrNPAdelantado)) {
                    $where2 .= " (ep.fechainicioperiodo = '{$finiciosiguiente}'::date "
                        . "AND ep.fechafinperiodo = '{$ffinsiguiente}'::date "
                        . "AND cmn.idtiponomina IN (" . implode(',', $arrNPAdelantado) . ")) ";
                }

                if (!empty($arrNPAdelantado) && !empty($arrNPNormal)) {
                    $where = "({$where1} OR {$where2})";
                } else if (!empty($arrNPNormal)) {
                    $where = $where1;
                } else if (!empty($arrNPAdelantado)) {
                    $where = $where2;
                }

                $sql = "SELECT ep.idelaborarpagos, cmn.idtiponomina, dnd.valores
                FROM mod_nomina.dat_elaborarpagos ep
                INNER JOIN mod_nomina.conf_modelonomina cmn ON (cmn.idtipopago = ep.idtipopago)
                INNER JOIN mod_nomina.dat_nomina dn ON (dn.idelaborarpago = ep.idelaborarpagos)
                INNER JOIN mod_nomina.dat_nominadatos dnd ON (dnd.idnomina = dn.idnomina)
                WHERE ep.identidad = {$identidad} AND {$where} AND dn.aprobada <> 0 order by cmn.idtiponomina;";

                $arrVRef = $conn->fetchAll($sql);

                //$camposrefnominas = array();
                $buscarrefnominas = array();
                foreach ($arrVRef as $vf) {
                    $vnomina = unserialize($vf['valores']);
                    foreach ($vnomina as $vref) {
                        foreach ($arrIndRefNomina as $i) {
                            $a = explode("_", $i);
                            if ($a[0] == $vf['idtiponomina']) {
                                $ref = "c{$a[1]}";
                                if (array_key_exists($ref, $vref)) {
                                    $buscarrefnominas[$vref['idpersona']][$vf['idtiponomina']][$a[1]] = $vref[$ref];
                                }
                            }
                        }
                    }
                }

                foreach ($arrIdsPersonas as $idpers) {
                    if (array_key_exists($idpers, $buscarrefnominas)) {
                        $camposrefnominas[$idpers] = $buscarrefnominas[$idpers];
                    }
                }
            }
        }

        return $arrEMN;
    }

    public function buscarFechaNominaReferencia($periodobusquedareferencianomina, $fechainicioperiodo, $fechafinperiodo)
    {
        $refecha = new stdClass();
        //Mismo mes
        if ($periodobusquedareferencianomina == 1) {
            $refecha->fechainicio = $fechainicioperiodo;
            $refecha->fechafin = $fechafinperiodo;
            //Mes anterior
        } else if ($periodobusquedareferencianomina == 2) {
            $fi = explode('/', $fechainicioperiodo);
            $ff = explode('/', $fechainicioperiodo);
            $anterior_fi = mktime(0, 0, 0, $fi[1] - 1, $fi[0], $fi[2]);
            $anterior_ff = mktime(0, 0, 0, $ff[1], 0, $ff[2]);
            $finicioanterior = date("d/m/Y", $anterior_fi);
            $ffinanterior = date("d/m/Y", $anterior_ff);
            $refecha->fechainicio = $finicioanterior;
            $refecha->fechafin = $ffinanterior;
        } else if ($periodobusquedareferencianomina == 3) {
            $fi = explode('/', $fechainicioperiodo);
            $ff = explode('/', $fechainicioperiodo);
            if ($fi[1] == 12) {
                $fi[1] = 0;
                $fi[2] = $fi[2] + 1;
            }
            $anterior_fi = mktime(0, 0, 0, $fi[1] - 2, $fi[0], $fi[2]);
            $anterior_ff = mktime(0, 0, 0, $ff[1] - 1, 0, $ff[2]);
            $finicioanterior = date("d/m/Y", $anterior_fi);
            $ffinanterior = date("d/m/Y", $anterior_ff);
            $refecha->fechainicio = $finicioanterior;
            $refecha->fechafin = $ffinanterior;
        } else if ($periodobusquedareferencianomina == 4) {
            $fi = explode('/', $fechainicioperiodo);
            $ff = explode('/', $fechainicioperiodo);
            if ($fi[1] == 12) {
                $fi[1] = 0;
                $fi[2] = $fi[2] + 1;
            }
            $anterior_fi = mktime(0, 0, 0, $fi[1] - 3, $fi[0], $fi[2]);
            $anterior_ff = mktime(0, 0, 0, $ff[1] - 2, 0, $ff[2]);
            $finicioanterior = date("d/m/Y", $anterior_fi);
            $ffinanterior = date("d/m/Y", $anterior_ff);
            $refecha->fechainicio = $finicioanterior;
            $refecha->fechafin = $ffinanterior;
        } else {
            $refecha->fechainicio = $fechainicioperiodo;
            $refecha->fechafin = $fechafinperiodo;
        }
        return $refecha;
    }

    //Funcion para obtener los sueldos por cargo
    public function cargarSueldoCargoElementosSalariales(&$conn, $arrIdsCargosOcupados)
    {
        $arrayindex = array();
        $sql = "SELECT esc.importe as spccargo, esss.importe as spcsitservicio, dco.idcargosocupados, esc.idsistemapago 
                as idsistemapagoescargo, esss.idsistemapago as idsistemapagoesss
                FROM mod_nomina.dat_cargosocupados dco
                INNER JOIN mod_nomina.conf_elementosalarialcargo esc ON (esc.idcargo = dco.idcargo)
                LEFT JOIN mod_nomina.conf_elementosalarialsituacionservicio esss 
                    ON (esss.idcargoocupado = dco.idcargosocupados)
                WHERE dco.idcargosocupados IN (" . implode(',', $arrIdsCargosOcupados) . ")";
        $arrSPC = $conn->fetchAll($sql);
        foreach ($arrSPC as $rspc) {
            $arrayindex[$rspc['idcargosocupados']]['spccargo'] = $rspc['spccargo'];
            $arrayindex[$rspc['idcargosocupados']]['idsistemapagoescargo'] = $rspc['idsistemapagoescargo'];
            $arrayindex[$rspc['idcargosocupados']]['idsistemapagoesss'] = $rspc['idsistemapagoesss'];
            $arrayindex[$rspc['idcargosocupados']]['spcsitservicio'] = $rspc['spcsitservicio'];
        }
        return $arrayindex;
    }

    //Funcion para obtener realizar las validaciones generales
    public function validacionesGenerales(&$d)
    {
        /* Para guardar las validaciones */
        $d->validaciones = array();
        /* Para guardar los campos que acumulan y liquidan en el submayor de vacaciones */
        $d->camposacumulanliquidan = array();

        /* Personas */
        if (empty($d->personas)) {
            $d->validaciones['todos'][] = "No existen personas para este pago.";
        }

        /* Plantillas nominales */
        if (empty($d->plantillasnominales)) {
            $d->validaciones['todos'][] = "Las plantillas nominales no se encuentran configuradas.";
        }

        /* Conceptos PD */
        if (empty($d->conceptospd)) {
            $d->validaciones['todos'][] = "Los conceptos de percepción y descuentos no se encuentran configurados.";
        }

        /* Conceptos generales de nómina */
        if (empty($d->conceptosrm)) {
            $d->validaciones['todos'][] = "Los conceptos generales de nómina no se encuentran configurados.";
        }

        /* Configuracion de formas y sistemas de pagos */
        if (empty($d->configfsp)) {
            $d->validaciones['todos'][] = "Los conceptos no están configurados en formas y sistemas de pago para este tipo de pago.";
        }

        /* Elementos salariales */
        /*if (empty($d->configescp)) {
            $d->validaciones['todos'][] = "Los elementos salariales al cargo y la persona no se encuentran configurados.";
        }*/

        /* Estructurar modelos de nomina */
        if (empty($d->configestnomina)) {
            $d->validaciones['todos'][] = "La nómina no se encuentra estructurada para este tipo de pago.";
        }

        /* Vacaciones */
        /* Verifico si el pago hace alguna operacion en el submayor es decir si acumula o liquida */
        if ($d->pago[0]['acumulavacaciones'] == 1 || $d->pago[0]['acumulavacaciones'] == 2 || $d->pago[0]['acumulavacaciones'] == 4) {
            /* Verifico si faltan personas por inicializar el submayor */
            if (!empty($d->vacaciones['faltan'])) {
                $personasFaltanSV = "";
                $contador = 0;
                $cantidadFaltan = count($d->vacaciones['faltan']);
                foreach ($d->vacaciones['faltan'] as $pf) {
                    foreach ($d->personas as $pbv) {
                        if ($pbv['idpersona'] == $pf) {
                            $personasFaltanSV .= $pbv[4] . " <br>";
                        }
                    }
                }
                $d->validaciones['certificar'][] = "Las siguientes personas no tienen inicializado el submayor de vacaciones: <br> {$personasFaltanSV}";
            }

            /* Verifico que estén configurados los campos que acumulan o liquidan en dias e importe */
            $estacampodias = -1;
            $estacampoimporte = -1;
            foreach ($d->configestnomina as $cn) {
                if ($cn['acumulaliquida'] == 1) {
                    $estacampodias = 1;
                    $d->camposacumulanliquidan[1] = $cn;
                }
                if ($cn['acumulaliquida'] == 2) {
                    $estacampoimporte = 1;
                    $d->camposacumulanliquidan[2] = $cn;
                }
                if ($cn['acumulaliquida'] == 3) {
                    $d->camposacumulanliquidan[3] = $cn;
                }
                if ($cn['acumulaliquida'] == 4) {
                    $d->camposacumulanliquidan[4] = $cn;
                }
            }
            /*if ($estacampodias == -1)
            {
                $d->validaciones['certificar'][] = "La nómina no tiene configurada el campo que acumula o liquida en días en el submayor de vacaciones.";
            }*/
            if ($estacampoimporte == -1) {
                $d->validaciones['certificar'][] = "La nómina no tiene configurada el campo que acumula o liquida en importe en el submayor de vacaciones.";
            }
        }
    }

    public  function actualizarCuentasBancariasPersonas($identidad){
        $arraycargosocupados = DatCargosOcupados::obtenerListadoTodosCargosOcupadosEntidad($identidad);
        foreach ($arraycargosocupados as $ic => $rco) {
            //Datos del cargo ocupado
            $objDomainCargosOcupados = new DatCargosOcupados();
            $objCargos = $objDomainCargosOcupados->obtenerObj($rco['idcargosocupados']);
            $idpersona = $rco['idpersona'];
            //Cuenta en MN
            $sqldatoscuentamn = "select datcban.idcuentabancaria from mod_personaext.dat_cuentabancaria datcban
                                              inner join mod_datosmaestros.nom_moneda nmon on (nmon.idmoneda = datcban.idmoneda)
                                              inner join mod_persona.dat_persona dp on (dp.idpersona = datcban.idpersona)
                                              where dp.idpersona = ? and nmon.codigo = '01';";
            // 01 es el codigo de mn
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $datoscuentamn = $conn->fetchAll($sqldatoscuentamn, array($idpersona));
            $idpersonacuentabancariamn = $datoscuentamn[0]['idcuentabancaria'];
            //Cuenta en CUC
            $sqldatoscuentacuc = "select datcban.idcuentabancaria from mod_personaext.dat_cuentabancaria datcban
                                              inner join mod_datosmaestros.nom_moneda nmon on (nmon.idmoneda = datcban.idmoneda)
                                              inner join mod_persona.dat_persona dp on (dp.idpersona = datcban.idpersona)
                                              where dp.idpersona = ? and nmon.codigo = '02';";
            // 02 es el codigo de cuc
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $datoscuentacuc = $conn->fetchAll($sqldatoscuentacuc, array($idpersona));
            $idpersonacuentabancariacuc = $datoscuentacuc[0]['idcuentabancaria'];
            //Salvando las actualizaciones en los numeros de cuenta
            $objCargos->idpersonacuentabancariamn = $idpersonacuentabancariamn;
            $objCargos->idpersonacuentabancariacuc = $idpersonacuentabancariacuc;
            $objCargos->save();
        }
        return 'ok';
    }

    public  function cargarExpresionesMatematicasRegistroSalariosTiempoServicio(){
        //Configuraciones de Formulas de los campos del registro de salareios y tiempo de servicio
        $sqlconfregsaltiemserv = "SELECT expresionmatemdias, expresionmatemimport
                                FROM
                                  mod_nomina.conf_registsalartiempservc;";
        // 02 es el codigo de cuc
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $datosconfregsaltiemserv = $conn->fetchAll($sqlconfregsaltiemserv);
        if(count($datosconfregsaltiemserv) > 0){
            foreach($datosconfregsaltiemserv as $dr){
                if($dr['expresionmatemdias']){
                    $this->arrFormulas[] = $dr['expresionmatemdias'];
                }
                if($dr['expresionmatemimport']){
                    $this->arrFormulas[] = $dr['expresionmatemimport'];
                }


            }
        }
        return 'ok';
    }
}
