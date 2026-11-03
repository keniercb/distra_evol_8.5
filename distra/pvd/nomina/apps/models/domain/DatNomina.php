<?php

/**
 * DatNomina
 *
 * @author Ing. Yadir Martinez Vergara.
 * @package Pvd.
 * @subpackage Nomina - Pago.
 * @copyright UCID
 * @descripcion Clase que se encarga de generar las nominas con sus valores
 * @version 1.0
 */
class DatNomina extends BaseDatNomina
{
    public $arrValoresColumnas = null;
    public $arrValoresRetencionesPersona = null;
    public $arrConfElemSalarialesConceptosPersona = null;
    public $datosMostrarPersona = null;
    public $datosVariablesGlobales = null;
    public $confConceptosPD = null;
    public $confConceptosRM = null;
    public $confCalculoCPDTipoFormSistPerPago = array();
    public $ioc = null;
    public $arrValoresVariablesElaborarPago = null;
    public $modopago = null;
    public $fechainicioperiodo = null;
    public $fechafinperiodo = null;
    public $mesanyopago = null;
    public $objNominaPersonas = null;
    public $confAcumLiqVac = null;
    public $arrPeriodosVac = null;
    public $arrPersonasSubMayorVac = null;
    public $arrVarAcumLiqVac = null;
    public $sedesglosa = null;
    public $arrIdVarParaPeriodosVacaciones = null;
    public $arrCondicionRetenciones = null;
    public $seCalcularonRetenciones = null;
    public $arrVarReportesRetenciones = null;

    public function setUp ()
    {
        parent::setUp();
        $this->hasMany('DatElaborarPagos', array(
            'local' => 'idelaborarpago',
            'foreign' => 'idelaborarpago',
            'refClass' => 'DatNomina'
        ));

        $this->hasMany('ConfPlantillaNominal', array(
            'local' => 'idplantillanominal',
            'foreign' => 'idplantillanominal',
            'refClass' => 'DatNomina'
        ));

        $this->hasMany('ConfigModeloNomina', array(
            'local' => 'idconfmodelonomina',
            'foreign' => 'idconfmodelonomina',
            'refClass' => 'DatNomina'
        ));
        $this->hasMany('DatNominaDatos', array(
            'local' => 'idnomina',
            'foreign' => 'idnomina',
            'refClass' => 'DatNomina'
        ));


    }

    /*Devuelve un string en formato #####.## para mostrar en la nomina*/
    public function formatoSalario ($valor)
    {
        if($valor == 0 || $valor == '' || $valor == null)
            return "0.00";

        $v = "" . $valor . "";
        $pos = strpos($v, ".");
        if($pos === false){
            return $v . ".00";
        }else{
            $vaux = substr($v, $pos);
            if(strlen($vaux) == 1){
                return $v . "0";
            }else{
                if($vaux == "00")
                    return "" . $v . "";
                else{
                    $val = "" . number_format($v, 2, '.', '')/*round($v, 2)*/ . "";
                    $pos = strpos($val, ".");
                    $valaux = substr($val, $pos);
                    if(strlen($valaux) == 1) return $val . "0";
                    else return $val;
                }
            }
        }
    }

    public function obtenerCantidadNominas ()
    {
        $sql = "select MAX(numeronomina) as maximo from mod_nomina.dat_nomina;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        return $r[0]['maximo'];
    }

    public function obtenerNominasporPeriodoPago ($idelaborarpago, $formato = 2)
    {
        if($formato == 2){
            $sql = "select * from mod_nomina.dat_nomina	where idelaborarpago = ? ;";
        }else{

            $sql = "select dn.* , pn.orden ||'-'|| pn.denominacion as plantillanominal, pn.orden, pn.codigo, ntn.idtiponomina, ntn.denominacion as tiponomina
			from mod_nomina.dat_nomina	dn
			left join mod_nomina.conf_plantillanominal pn on (pn.idplantillanominal = dn.idplantillanominal)
			left join mod_nomina.conf_modelonomina mn on (mn.idconfmodelonomina = dn.idconfmodelonomina)
			left join mod_nomina.nom_tiponomina ntn on (ntn.idtiponomina = mn.idtiponomina)
			where dn.idelaborarpago = ?  order by pn.orden ASC;";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idelaborarpago));
        return $r;
    }

    public function obtenerNominasporPeriodoPagoVisualizar ($idelaborarpago, $formato = 2, $arrcargos)
    {
        if($formato == 2){
            $sql = "select * from mod_nomina.dat_nomina	dn
            left join mod_nomina.conf_plantillanominalcargo pnc on (pnc.idplantillanominal = dn.idplantillanominal)
            where idelaborarpago = ? and pnc.idcargo in (" . implode(',', $arrcargos) . ");";
        }else{
            $sql = "select dn.* , pn.orden ||'-'|| pn.denominacion as plantillanominal, pn.orden, pn.codigo, ntn.idtiponomina, ntn.denominacion as tiponomina
			from mod_nomina.dat_nomina	dn
			left join mod_nomina.conf_plantillanominal pn on (pn.idplantillanominal = dn.idplantillanominal)
			left join mod_nomina.conf_plantillanominalcargo pnc on (pnc.idplantillanominal = pn.idplantillanominal)
			left join mod_nomina.conf_modelonomina mn on (mn.idconfmodelonomina = dn.idconfmodelonomina)
			left join mod_nomina.nom_tiponomina ntn on (ntn.idtiponomina = mn.idtiponomina)
			where dn.idelaborarpago = ? and pnc.idcargo in (" . implode(',', $arrcargos) . ");";
        }
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idelaborarpago));
        return $r;
    }

    /**
     *
     * Descripcion: Funciones para generar la nomina
     * Autor: Ing. Yadir Martinez Vergara
     *
     **/
    /*FUNCION PRINCIPAL DONDE SE GENERA LA NOMINA*/
    public function generarNomina ($identidad, $idelaborarpago, $idtipopago, $idnomina, $idplantillanominal, $idconfmodelonomina, $cajacajero, $modopago, $fechainicioperiodo, $fechafinperiodo, $mesanyopago, $aprobar, $idpersonaservicio)
    {
        $this->ioc = ZendExt_IoC_Inter::getInstance();
        $this->modopago = $modopago;
        $this->fechainicioperiodo = $fechainicioperiodo;
        $this->fechafinperiodo = $fechafinperiodo;
        $this->mesanyopago = $mesanyopago;
        $objTipoPago = Doctrine::getTable('NomTipoPago')->find($idtipopago);
        $this->sedesglosa = $objTipoPago->sedesglosa;
        //$idpersonaservicio = 1000001111196;

        /* if($idpersonaservicio != 0){
			  $sqlDatosPersonaCargoOcupado = "select dcocup.idcargosocupados, dcocup.idcargo, dcocup.idsituacionlaboral, dcocup.idpersona from mod_nomina.dat_cargosocupados dcocup 
				inner join mod_persona.dat_persona dp on (dp.idpersona = dcocup.idpersona)
				where dcocup.idpersona = ?;";
				$mg = Doctrine_Manager::getInstance();
				$conn = $mg->getCurrentConnection();
				$arrDatosPersonaCargoOcupado = $conn->fetchAll($sqlDatosPersonaCargoOcupado, array($idpersonaservicio));
				//ARREGLO DE PERSONAS QUE VAN A LA NOMINA
				$arrdatospersonaservicio['idcargosocupados'] = $arrDatosPersonaCargoOcupado[0]['idcargosocupados'];
				$arrdatospersonaservicio['idpersona'] = $arrDatosPersonaCargoOcupado[0]['idpersona'];
				$arrdatospersonaservicio['idcargo'] = $arrDatosPersonaCargoOcupado[0]['idcargo'];
				$arrdatospersonaservicio['idsituacionlaboral'] = $arrDatosPersonaCargoOcupado[0]['idsituacionlaboral'];
				$arrPerVanAlaNomina[$arrDatosPersonaCargoOcupado[0]['idpersona'].'-'.$arrDatosPersonaCargoOcupado[0]['idcargosocupados']] = $arrdatospersonaservicio;
			  $arrfinal = $this->devolverDatosPersona($arrPerVanAlaNomina);
			}*/

        //Busco las categorias de personas que estan presentes en el tipo nomina
        $objCatPorModNom = new ConfigModeloNominaCategoria(); /*OBJETO*/
        $arrCPMN = $objCatPorModNom->obtenerCategoriasPorIdModelo($idconfmodelonomina);

        if(count($arrCPMN) > 0){

            //Convierto el arreglo de categorias a un arreglo unidimensional
            $arrCatPorModNom = array();
            foreach($arrCPMN as $i => $c) {
                $arrCatPorModNom[] = $c['idcategoria'];
            }
            //Busco el tipo de moneda de esta nomina
            $sqltipomoneda = "select ntn.tipomoneda  from mod_nomina.nom_tiponomina ntn 
			                  inner join mod_nomina.conf_modelonomina cmn on(cmn.idtiponomina = ntn.idtiponomina)    
						      where cmn.idconfmodelonomina = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrtipomoneda = $conn->fetchAll($sqltipomoneda, array($idconfmodelonomina));
            $tipomoneda = $arrtipomoneda[0]['tipomoneda'];
            //Busco todas las personas dentro del periodo de pago seleccionado que tengan esas categorias
            $objPerElaborarPago = new DatPersonaElaborarPagos(); /*OBJETO*/
            $arrPer = $objPerElaborarPago->obtenerPersonaElaborarPagosporCategoriasdePersonas($idelaborarpago, $arrCatPorModNom);
            if(count($arrPer) > 0){

                //Convierto el arreglo de personas del periodo de pago a un arreglo unidimensional
                $arrPersPerPago = array();
                foreach($arrPer as $i => $p) {
                    $arrPersPerPago[] = $p['idpersona'];
                }
                //Elimino los id de personas repetidos
                $arrPersPerPago = array_unique($arrPersPerPago);

                //Busco todas las personas que forman parte de la plantilla nominal que se les paga por caja o cajero
                $objPlantCargos = new ConfPlantillaNominalCargo();/*OBJETO*/
                $arrPerPlantCargos = $objPlantCargos->obtenerPersonaPlantillaOcupanCargosCajeroCaja($idplantillanominal, $cajacajero, $tipomoneda);
                //Busco todas las personas que tienen situacion laboral pero no tienen cargo en la entidad
                $objCargosOcupados = new DatCargosOcupados();/*OBJETO*/
                $arrPerSinCargosConSituacion = $objCargosOcupados->obtenerPersonasNoOcupanCargosContenidasEnArr($identidad, $idplantillanominal, $cajacajero, $arrPersPerPago);

                $c1 = count($arrPerPlantCargos);
                $c2 = count($arrPerSinCargosConSituacion);


                //Si hay personas que ocupan cargos en la entidad y si tienen situacion laboral sin cargo
                if($c1 > 0 || $c2 > 0){

                    //Verifico que las personas que forman parte de la plantilla nominal esten en el periodo de pago
                    $arrPOCVerificadas = array();
                    foreach($arrPerPlantCargos as $i => $p) {
                        foreach($arrPer as $j => $pp) {
                            if($p['idpersona'] == $pp['idpersona'] && $p['idcargosocupados'] == $pp['idcargosocupados']){
                                $arrPOCVerificadas[$p['idpersona'] . '-' . $p['idcargosocupados']] = $p;
                            }
                        }
                    }
                    //print_r($arrPOCVerificadas);die;
                    $arrPerSinCarConSit = array();
                    foreach($arrPerSinCargosConSituacion as $i => $p) {
                        $arrPerSinCarConSit[$p['idpersona'] . '-' . $p['idcargosocupados']] = $p;
                    }

                    $arrPerVanAlaNomina = array();
                    //Obteniendo los datos de la persona para el servicio 
                    if($idpersonaservicio != 0){
                        $sqlDatosPersonaCargoOcupado = "select dcocup.idcargosocupados, dcocup.idcargo, dcocup.idsituacionlaboral, dcocup.idpersona from mod_nomina.dat_cargosocupados dcocup 
									inner join mod_persona.dat_persona dp on (dp.idpersona = dcocup.idpersona)
									where dcocup.idpersona = ?;";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $arrDatosPersonaCargoOcupado = $conn->fetchAll($sqlDatosPersonaCargoOcupado, array($idpersonaservicio));
                        //ARREGLO DE PERSONAS QUE VAN A LA NOMINA
                        $arrdatospersonaservicio['idcargosocupados'] = $arrDatosPersonaCargoOcupado[0]['idcargosocupados'];
                        $arrdatospersonaservicio['idpersona'] = $arrDatosPersonaCargoOcupado[0]['idpersona'];
                        $arrdatospersonaservicio['idcargo'] = $arrDatosPersonaCargoOcupado[0]['idcargo'];
                        $arrdatospersonaservicio['idsituacionlaboral'] = $arrDatosPersonaCargoOcupado[0]['idsituacionlaboral'];
                        $arrPerVanAlaNomina[$arrDatosPersonaCargoOcupado[0]['idpersona'] . '-' . $arrDatosPersonaCargoOcupado[0]['idcargosocupados']] = $arrdatospersonaservicio;
                    }else{
                        //ARREGLO DE PERSONAS QUE VAN A LA NOMINA
                        $arrPerVanAlaNomina = array_merge($arrPOCVerificadas, $arrPerSinCarConSit);
                    }

                    if(count($arrPerVanAlaNomina) <= 0){

                        $m->codigo = 'NOPERSONASPERIODOPAGO';
                        return $m;
                    }

                    //OBTENGO LA ESTRUCTURA DE LA NOMINA POR TIPO DE NOMINA
                    $objConfModNomina = new ConfigModeloNomina();/*OBJETO*/
                    $arrConfModNom = $objConfModNomina->obtenerObjConfigModelosNominaDadoId($idconfmodelonomina)->toArray();
                    if(count($arrConfModNom) > 0){//ESTRUCTURA DE LA NOMINA
                        $estNomina = DatNomina::obtenerEstructuraNomina($arrConfModNom['idtiponomina'], $arrConfModNom['idtipopago']);

                        if(count($estNomina) > 0){
                            //OBTENGO LA CONFIGURACION DE VARIABLES GLOBALES
                            $aC = $objPlantCargos->obtenerCargosByIdPlantilla($idplantillanominal);
                            $arrCargos = array();
                            foreach($aC as $i => $c) {
                                $arrCargos[] = $c['idcargo'];
                            }
                            $this->datosVariablesGlobales = $this->obtenerVariablesGlobales($identidad, $arrCargos);
                            //print_r($this->datosVariablesGlobales);die;
                            //Busco las variables de reportes que devuelven un periodo de vacaciones
                            $this->obtenerVariablesReportesParaPeriodosVacaciones();
                            //VERIFICO SI LA NOMINA ACUMULA VACACIONES PARA CARGAR LA CONFIGURACION
                            $objTipoNomina = Doctrine::getTable('NomTipoNomina')->find($arrConfModNom['idtiponomina']);
                            if($objTipoNomina->acumulavacaciones == 1 || $objTipoNomina->liquidavacaciones == 1){
                                $this->obtenerConfiguracionAcumulacionLiquidacionVacaciones();
                                $this->obtenerConfVariablesFormulaAcumulacionLiquidacionVacaciones();
                                $this->obtenerPeriodosVacaciones();
                                $this->obtenerPersonasSubMayorVacaciones($identidad, $arrPerVanAlaNomina);
                            }

                            //BUSCO LAS CONDICIONES QUE VAN A TENER LAS RETENCIONES
                            $this->condicionRetenciones($objTipoNomina->idtiponomina);

                            //CARGO LAS VARIABLES AUXILIARES SI SE CALCULAN RETENCIONES
                            if($this->arrCondicionRetenciones != null){
                                $this->obtenerVariablesReportesParaRetenciones();
                            }
                            //print_r("sss");die;
                            //OBTENGO LA CONFIGURACION DE LOS CONCEPTOS DE PERCEPCION Y DESCUENTOS
                            $this->confConceptosPD = $this->obtenerConfiguracionConceptosPercepcionDescuentos();

                            //OBTENGO LA FORMA DE CALCULO DE LOS CONCEPTOS DE PERCEPCION Y DESCUENTOS POR TIPO-FORMASySISTEMA-PERIODO PAGO
                            $this->obtenerConfCalculoConceptoPDporTipoFormasySistemasPago($identidad);
                            //print_r($this->obtenerConfCalculoConceptoPDporTipoFormasySistemasPago($identidad));die;
                            //print_r($this->confCalculoCPDTipoFormSistPerPago);die;
                            //print_r("sasa");die;
                            //OBTENGO LA CONFIGURACION DE LOS CONCEPTOS DE LA RETRIBUCION MONETARIA
                            $this->confConceptosRM = $this->obtenerConfiguracionConceptosRetribucionMonetaria();

                            //BUSCO LOS DATOS DE LAS PERSONAS EN DEPENDENCIA DE LAS ESTRUCTURA DE NOMINA
                            $arrCamposPers = array();
                            foreach($estNomina as $i => $e) {
                                if($e->tipocampo == 1){
                                    $arrCamposPers[] = $e->valormostrar;
                                }
                            }

                            //CARGO LOS DATOS DE LAS PERSONAS QUE VAN A LA NOMINA
                            if($idpersonaservicio == 0){
                                $arrDatosCamposPersona = $this->cargarDatosPersonas($arrPerVanAlaNomina, $arrCamposPers);
                            }
                            //CARGO EL SALARIO POR CARGO DE CADA PERSONA
                            $this->obtenerSueldoPorCargo($arrPerVanAlaNomina);

                            //CARGO LAS RETENCIONES DE LAS PERSONAS
                            $this->obtenerRetencionesporPersona($identidad, $arrPerVanAlaNomina);

                            //CARGO LA CONFIGURACION DE ELEMENTOS SALARIALES Y CONCEPTOS DE LAS PERSONAS QUE VAN A LA NOMINA
                            $this->obtenerConfiguracionElementosSalarialesyConceptosporPersona($arrPerVanAlaNomina, $idtipopago);

                            //CARGO LOS VALORES DE LAS VARIABLES QUE SE LLENARON EN EL PERIODO DE PAGO
                            $this->obtenerValoresVariablesPeriodoPagoporPersonasCargosOcupados($idelaborarpago, $arrPerVanAlaNomina);
                            // print_r($arrPerVanAlaNomina);die;
                            /*COMIENZO EL CALCULO DE LOS CONCEPTOS QUE VAN A LA NOMINA*/
                            /*POR CASA PERSONA HAGO LOS CALCULOS*/
                            $arrIndicadoresFormulaAgrupacion = array();

                            foreach($arrPerVanAlaNomina as $i => $p) {
                                foreach($estNomina as $j => $e) {
                                    $valor = null;
                                    $idtipopago = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->idtipopago;
                                    $idsistemapago = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->idsistemapago;
                                    $key = $idtipopago . '-' . $idsistemapago;
                                    if($this->sedesglosa != 1){
                                        $key = $idtipopago . '-';
                                    }

                                    switch ($e->tipocampo) {
                                        case 1: {
                                            $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->datospersona[$e->valormostrar] = $arrDatosCamposPersona[$p['idpersona'] . '-' . $p['idcargosocupados']][$e->valormostrar];
                                            // print_r($arrDatosCamposPersona[$p['idpersona'].'-'.$p['idcargosocupados']][$e->valormostrar]);die;
                                            break;
                                        }
                                        case 2: {
                                            switch ($e->tipocamposcalcular) {
                                                case 5: {
                                                    //VERIFICO QUE EL TIPO Y SISTEMA DE PAGO DE LA PERSONA SE ENCUENTRE EN LA CONFIGURACION DE LA COLUMNA
                                                    $valCPD = 0.00;
                                                    if(array_key_exists($key, $e->camposcalcular)){

                                                        $conceptopd = $e->camposcalcular[$key]->campo;
                                                        //VERIFICO QUE EL CONCEPTO DE PD  DE LA COLUMNA SE ENCUENTRE EN LA CONF DE LA PERSONA
                                                        if(array_key_exists($conceptopd, $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->tsp[$idtipopago . '-' . $idsistemapago]->conceptopd)){
                                                            //print_r($this->arrConfElemSalarialesConceptosPersona);die;
                                                            //CALCULO EL CONCEPTO DE PD	
                                                            $idperiodopago = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->tsp[$idtipopago . '-' . $idsistemapago]->conceptopd[$conceptopd]->idperiodopago;
                                                            $idtarifa = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->tsp[$idtipopago . '-' . $idsistemapago]->conceptopd[$conceptopd]->idtarifa;
                                                            $valCPD = $this->calcularConceptoPago($p, $idtipopago, $idsistemapago, $idperiodopago, $idtarifa, $conceptopd);


                                                        }else{
                                                            $valor->error = "El concepto de percepci&oacute;n y descuento no se encuentra en la columna.";
                                                        }
                                                    }else{
                                                        $valor->error = "El tipo y sistema de pago no se encuentra en la columna.";

                                                    }

                                                    if(is_object($valor)){
                                                        foreach($e->camposcalcular as $k => $c) {
                                                            $conceptopd = $c->campo;
                                                            break;
                                                        }
                                                        $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->errorcpd[$conceptopd] = $valor;
                                                        $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->cpd[$conceptopd] = "0.00";

                                                    }else{
                                                        $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->cpd[$conceptopd] = round($valCPD, 2);
                                                    }

                                                    break;
                                                }
                                                case 3: {
                                                    //VERIFICO QUE EL TIPO Y SISTEMA DE PAGO DE LA PERSONA SE ENCUENTRE EN LA CONFIGURACION DE LA COLUMNA
                                                    if(array_key_exists($key, $e->camposcalcular)){
                                                        $conceptorm = $e->camposcalcular[$key]->campo;
                                                        //CALCULO EL CONCEPTO DE RETRIBUCION MONETARIA	
                                                        $valor = 0.00;
                                                        $valor = $this->calcularConceptoRM($conceptorm, $p);
                                                        //print_r($valor);die;
                                                    }else{
                                                        $valor->error = "El concepto de retribuci&oacute;n monetaria no se encuentra configurado en la columna.";
                                                    }
                                                    if(is_object($valor)){
                                                        foreach($e->camposcalcular as $k => $c) {
                                                            $conceptorm = $c->campo;
                                                            break;
                                                        }
                                                        $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->errorcrm[$conceptorm] = $valor;
                                                        $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->crm[$conceptorm] = "0.00";
                                                    }else{
                                                        $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->crm[$conceptorm] = round($valor, 2);
                                                    }
                                                    break;
                                                }
                                                case 2: {//Retenciones

                                                    //if ($this->seCalcularonRetenciones[$p['idpersona']][$p['idcargosocupados']] == 2) {
                                                    //if ($this->arrCondicionRetenciones != null) {
                                                    if(array_key_exists($p['idpersona'], $this->arrValoresRetencionesPersona)){
                                                        //  if ($this->arrCondicionRetenciones['secumplesiempre'] == 1) {
                                                        $this->CalcularRetPersona($p);
                                                        /*} else {
                                                             if ($this->calcularFormulaSiseCumpleoLimiteRetenciones($p, 1)) {
                                                                 $this->CalcularRetPersona($p);
                                                             }
                                                         }*/
                                                    }
                                                    // }
                                                    //}
                                                    break;
                                                }
                                            }
                                            break;
                                        }
                                        case 3: {
                                            $idexpresionmatematica = $e->valormostrar;
                                            if(array_key_exists($e->id, $arrIndicadoresFormulaAgrupacion)){
                                                $arrIndFormula = $arrIndicadoresFormulaAgrupacion[$e->id];
                                            }else{
                                                $arrIndFormula = $this->ioc->comun->ObtenerarrIdIndicadoresporExpresionMatematica($idexpresionmatematica);
                                                $arrIndicadoresFormulaAgrupacion[$e->id] = $arrIndFormula;
                                            }
                                            $arrValInd = array();
                                            foreach($arrIndicadoresFormulaAgrupacion[$e->id] as $k => $i) {
                                                switch ($estNomina[$i]->tipocamposcalcular) {
                                                    case 1: {
                                                        $arrValInd[$i] = $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->spc;
                                                        break;
                                                    }
                                                    case 2: {
                                                        $idretencion = $estNomina[$i]->camposcalcular->campo;
                                                        $valRet = 0.00;
                                                        $comoRet = $this->arrValoresRetencionesPersona[$p['idpersona']][$idretencion]->comoretener[$p['idcargosocupados']];
                                                        if($comoRet != -1){
                                                            $arrValInd[$i] = $this->calcularMensualidadRetencion($p, $idretencion, $comoRet);
                                                        }else{
                                                            $arrValInd[$i] = 0.00;
                                                        }
                                                        break;
                                                    }
                                                    case 3: {
                                                        //CALCULO EL CONCEPTO DE RETRIBUCION MONETARIA	
                                                        $conceptorm = $estNomina[$i]->camposcalcular->campo;
                                                        $arrValInd[$i] = $this->calcularConceptoRM($conceptorm, $p);
                                                        break;
                                                    }
                                                    case 5: {
                                                        $conceptopd = $estNomina[$i]->camposcalcular->campo;
                                                        //CALCULO EL CONCEPTO DE PD
                                                        if($this->sedesglosa == 1)
                                                            $idperiodopago = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->tsp[$idtipopago . '-' . $idsistemapago]->conceptopd[$conceptopd]->idperiodopago;
                                                        else
                                                            $idperiodopago = 0;
                                                        $idtarifa = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->tsp[$idtipopago . '-' . $idsistemapago]->conceptopd[$conceptopd]->idtarifa;
                                                        $arrValInd[$i] = $this->calcularConceptoPago($p, $idtipopago, $idsistemapago, $idperiodopago, $idtarifa, $conceptopd);

                                                        break;
                                                    }
                                                }
                                                if($arrValInd[$i] == ''){
                                                    $arrValInd[$i] = 0.00;
                                                }
                                            }
                                            //Conformo el arreglo de indicadores con valores
                                            $arrValores = array();
                                            foreach($arrValInd as $i => $v) {
                                                if(gettype($v) == "object"){
                                                    $arrValores[] = array('idindicador' => $i, 'valor' => 0.00);
                                                }else{
                                                    $arrValores[] = array('idindicador' => $i, 'valor' => $v);
                                                }
                                            }
                                            $valorCampoAgrupacion = $this->ioc->comun->EvaluarExpresionMatematica($idexpresionmatematica, $arrValores);
                                            $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->camposAgrup[$e->id] = round($valorCampoAgrupacion->valor, 2);

                                            break;
                                        }

                                    }
                                }
                            }

                            //ACTUALIZO EL SUBMAYOR DE RETENCIONES DE CADA PERSONA
                            if($aprobar == -1){
                                $objHisRetenciones = new HisRetencionesPersonaModel();
                                //print_r($this->arrValoresRetencionesPersona);die;
                                $objHisRetenciones->Adicionar($idnomina, $this->arrValoresRetencionesPersona, $this->seCalcularonRetenciones);
                            }


                            //OBTENGO LA ESTRUCTURA DE LA NOMINA POR TIPO DE NOMINA
                            $objConfModNomina = new ConfigModeloNomina();/*OBJETO*/
                            $arrConfModNom = $objConfModNomina->obtenerObjConfigModelosNominaDadoId($idconfmodelonomina)->toArray();
                            $objTipoNomina = Doctrine::getTable('NomTipoNomina')->find($arrConfModNom['idtiponomina']);

                            //CALCULO EL ACUMULADO DE VACACIONES DE CADA PERSONA QUE ESTA EN LA NOMINA
                            /*if($objTipoNomina->acumulavacaciones == 1 && $aprobar == 1){
											$this->calcularAcumuladoVacaciones();
											$arrAcumuladoVac = array();
											foreach($this->arrPersonasSubMayorVac as $i => $p){
												$tiempo = null; $importe = null; $idvacacionespersona = null;
												foreach($p as $j => $vac){
													$tiempo = $tiempo + $vac->tiempoacumulado;
													$importe = $importe + $vac->importeacumulado;
													$arrAcumuladoVac[$i]['idpersona'] = $i;
													$arrAcumuladoVac[$i]['idvacacionespersona'] = $vac->idvacacionespersona;
													$arrAcumuladoVac[$i]['tiempoacumulado'] = $tiempo;
													$arrAcumuladoVac[$i]['importeacumulado'] = $importe;
													$arrAcumuladoVac[$i]['saldoentiempo'] = $vac->tiempo;
													$arrAcumuladoVac[$i]['saldoenimporte'] = $vac->importe;
													$arrAcumuladoVac[$i]['tiempoacumuladoinicial'] = $vac->tiempoacumuladoinicial;
													$arrAcumuladoVac[$i]['importeacumuladoinicial'] = $vac->importeacumuladoinicial;
												}
											}
											$objHisVacModel = new HisVacacionesPersonaModel();
											$objHisVacModel->Adicionar($arrAcumuladoVac, $idnomina, date('Y-m-d'), 1);
										}
										
										//CALCULO LA LIQUIDACION DE VACACIONES DE CADA PERSONA QUE ESTA EN LA NOMINA										
										if($objTipoNomina->liquidavacaciones == 1 && $aprobar == 1){
											$this->calcularLiquidacionVacaciones();
											$arrLiquidacionVac = array();
											foreach($this->arrPersonasSubMayorVac as $i => $p){
												$tiempo = null; $importe= null; $idvacacionespersona = null;
												foreach($p as $j => $vac){
													$tiempo = $tiempo + $vac->tiempoacumulado;
													$importe= $importe + $vac->importeacumulado;
													$arrLiquidacionVac[$i]['idpersona'] = $i;
													$arrLiquidacionVac[$i]['saldoentiempo'] = $vac->tiempo;
													$arrLiquidacionVac[$i]['saldoenimporte'] = $vac->importe;
													$arrLiquidacionVac[$i]['idvacacionespersona'] = $vac->idvacacionespersona;
													$arrLiquidacionVac[$i]['tiempoacumulado'] = $tiempo;
													$arrLiquidacionVac[$i]['importeacumulado'] = $importe;
													$arrLiquidacionVac[$i]['tiempoacumuladoinicial'] = $vac->tiempoacumuladoinicial;
													$arrLiquidacionVac[$i]['importeacumuladoinicial'] = $vac->importeacumuladoinicial;
												}
											}
											$objHisVacModel = new HisVacacionesPersonaModel();
											$objHisVacModel->Adicionar($arrLiquidacionVac, $idnomina, date('Y-m-d'), 2);
										}*/

                            /*CONFORMO EL ARREGLO DE DATOS A ENVIAR PARA LA VISTA*/
                            $this->objNominaPersonas->valores = array();
                            $pos = 0;
                            foreach($arrPerVanAlaNomina as $i => $p) {
                                $key = $p['idpersona'] . '-' . $p['idcargosocupados'];
                                $idtipopago = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->idtipopago;
                                $idsistemapago = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->idsistemapago;
                                if($this->sedesglosa != 1){
                                    $idsistemapago = null;
                                }
                                $this->objNominaPersonas->valores[$pos]['id'] = $key;
                                foreach($estNomina as $j => $e) {
                                    $valor = "";
                                    switch ($e->tipocampo) {
                                        case 1: {
                                            $valor = $this->arrValoresColumnas[$key]->datospersona[$e->valormostrar];
                                            break;
                                        }
                                        case 2: {

                                            if($e->tipocamposcalcular == 1){
                                                $valor = $this->formatoSalario($this->arrValoresColumnas[$key]->spc);
                                            }else if($e->tipocamposcalcular == 2){
                                                $idretencion = $e->camposcalcular->campo;
                                                $comoRet = $this->arrValoresRetencionesPersona[$p['idpersona']][$idretencion]->comoretener[$p['idcargosocupados']];
                                                if($comoRet != -1){
                                                    $valor = $this->formatoSalario($this->calcularMensualidadRetencion($p, $idretencion, $comoRet));
                                                }else{
                                                    $valor = "0.00";
                                                }
                                            }else if($e->tipocamposcalcular == 3){
                                                $conceptorm = $e->camposcalcular[$idtipopago . '-' . $idsistemapago]->campo;
                                                $valor = $this->formatoSalario($this->arrValoresColumnas[$key]->crm[$conceptorm]);
                                            }else if($e->tipocamposcalcular == 5){
                                                $conceptopd = $e->camposcalcular[$idtipopago . '-' . $idsistemapago]->campo;
                                                $valor = $this->formatoSalario($this->arrValoresColumnas[$key]->cpd[$conceptopd]);
                                            }else $valor = "0.00";

                                            break;
                                        }
                                        case 3: {
                                            $valor = $this->formatoSalario($this->arrValoresColumnas[$key]->camposAgrup[$e->id]);
                                            break;
                                        }
                                    }
                                    $this->objNominaPersonas->valores[$pos]['c' . $e->id] = $valor;
                                }
                                $pos++;
                            }
                            //Verificando si la llamada fue mediante un servicio de persona para devolver el dato
                            if($idpersonaservicio != 0){
                                $contadorservicio = 0;
                                $arraydatosparaservicio = array();
                                foreach($this->objNominaPersonas->valores[0] as $contserv => $datosservicio) {
                                    $arrestructurar = explode('c', $contserv);
                                    $sqlDatosEstructurar = "select estr.denominacion from mod_nomina.conf_estructuramodelosnomina estr 
								    	        			        where estr.idestructuramodelodomina = ? and  estr.visible = 1 and estr.idtipocampo = 2;";
                                    $mg = Doctrine_Manager::getInstance();
                                    $conn = $mg->getCurrentConnection();
                                    $arrdenominacionestructurar = $conn->fetchAll($sqlDatosEstructurar, array($arrestructurar[1]));
                                    if(count($arrdenominacionestructurar) > 0){
                                        $arraydatosparaservicio[$contadorservicio]['denominacion'] = $arrdenominacionestructurar[0]['denominacion'];
                                        $arraydatosparaservicio[$contadorservicio]['importe'] = $datosservicio;
                                        $contadorservicio++;
                                    }


                                }
                                //print_r($arraydatosparaservicio);die;
                                return $arraydatosparaservicio;
                            }

                            foreach($estNomina as $k => $ve) {
                                $tienetotal = 0;
                                if($ve->tipocamposcalcular == 3){
                                    $tienetotal = 1;
                                }

                                $this->objNominaPersonas->campos[] = array('indice' => 'c' . $ve->id, 'denominacion' => $ve->denominacion, 'tipocampo' => $ve->tipocampo, 'orden' => $ve->orden, 'visible' => ($ve->visible == 1) ? false : true, 'total' => $tienetotal);
                            }

                            //PASO A APROBAR Y GUARDAR LA NOMINA
                            if($aprobar == -1){
                                $objNomD = new DatNominaDatosModel();
                                $this->objNominaPersonas->estructura = $estNomina;
                                $objNomD->adicionarDatos($idnomina, $this->objNominaPersonas);
                                $DomainNomina = Doctrine::getTable('DatNomina')->find($idnomina);
                                $DomainNomina->aprobada = -1;
                                $DomainNomina->save();
                            }else{
                                $this->objNominaPersonas->codigo = 'OKs';
                                return $this->objNominaPersonas;
                            }

                            /*FIN DEL PROCESAMIENTO*/

                        }else{
                            $m->codigo = 'NOESTRUCTURANOMINA';
                        }
                    }else{
                        $m->codigo = 'NOCONFMODELONOMINA';
                    }

                }else{
                    $m->codigo = 'NOPERSONASOCUPANCARGOSPLANTILLA';
                }

            }else{

                $m->codigo = 'NOPERSONASPERIODOPAGO';
            }

        }else{
            $m->codigo = 'NOCATTIPONOMINA';
        }
        if($aprobar == -1){
            $DomainNomina = Doctrine::getTable('DatNomina')->find($idnomina);
            $DomainNomina->aprobada = -1;
            $DomainNomina->save();
        }

        return $m;
    }

    /*Codigo para actualizar el dubmayor de vacaciones
	 *
	 *Recive los datos de la nomina
	 **/
    public function acumularLiquidarVacacionesNomina ($identidad, $idelaborarpago, $idnomina, $idconfmodelonomina, $idplantillanominal, $cajacajero, $idtipopago, $modopago, $fechainicioperiodo, $fechafinperiodo, $mesanyopago)
    {
        $a = $idtipopago;
        $this->ioc = ZendExt_IoC_Inter::getInstance();
        $this->modopago = $modopago;
        $this->fechainicioperiodo = $fechainicioperiodo;
        $this->fechafinperiodo = $fechafinperiodo;
        $this->mesanyopago = $mesanyopago;
        $m->codigo = 'Ok';
        //Busco las categorias de personas que estan presentes en el tipo nomina
        $objCatPorModNom = new ConfigModeloNominaCategoria(); /*OBJETO*/
        $arrCPMN = $objCatPorModNom->obtenerCategoriasPorIdModelo($idconfmodelonomina);
        $objTipoPago = Doctrine::getTable('NomTipoPago')->find($idtipopago);
        $this->sedesglosa = $objTipoPago->sedesglosa;

        $this->confConceptosRM = $this->obtenerConfiguracionConceptosRetribucionMonetaria();

        $this->obtenerConfCalculoConceptoPDporTipoFormasySistemasPago($identidad);


        if(count($arrCPMN) > 0){
            //Convierto el arreglo de categorias a un arreglo unidimensional
            $arrCatPorModNom = array();
            foreach($arrCPMN as $i => $c) {
                $arrCatPorModNom[] = $c['idcategoria'];
            }
            //Busco el tipo de moneda de esta nomina
            $sqltipomoneda = "select ntn.tipomoneda  from mod_nomina.nom_tiponomina ntn 
			                  inner join mod_nomina.conf_modelonomina cmn on(cmn.idtiponomina = ntn.idtiponomina)    
						      where cmn.idconfmodelonomina = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $arrtipomoneda = $conn->fetchAll($sqltipomoneda, array($idconfmodelonomina));
            $tipomoneda = $arrtipomoneda[0]['tipomoneda'];
            //Busco todas las personas dentro del periodo de pago seleccionado que tengan esas categorias
            $objPerElaborarPago = new DatPersonaElaborarPagos(); /*OBJETO*/
            $arrPer = $objPerElaborarPago->obtenerPersonaElaborarPagosporCategoriasdePersonas($idelaborarpago, $arrCatPorModNom);
            if(count($arrPer) > 0){
                //Convierto el arreglo de personas del periodo de pago a un arreglo unidimensional
                $arrPersPerPago = array();
                foreach($arrPer as $i => $p) {
                    $arrPersPerPago[] = $p['idpersona'];
                }
                //Elimino los id de personas repetidos
                $arrPersPerPago = array_unique($arrPersPerPago);

                //Busco todas las personas que forman parte de la plantilla nominal que se les paga por caja o cajero
                $objPlantCargos = new ConfPlantillaNominalCargo();/*OBJETO*/
                $arrPerPlantCargos = $objPlantCargos->obtenerPersonaPlantillaOcupanCargosCajeroCaja($idplantillanominal, $cajacajero, $tipomoneda);
                //Busco todas las personas que tienen situacion laboral pero no tienen cargo en la entidad
                $objCargosOcupados = new DatCargosOcupados();/*OBJETO*/
                $arrPerSinCargosConSituacion = $objCargosOcupados->obtenerPersonasNoOcupanCargosContenidasEnArr($identidad, $idplantillanominal, $cajacajero, $arrPersPerPago);
                $c1 = count($arrPerPlantCargos);
                $c2 = count($arrPerSinCargosConSituacion);


                //Si hay personas que ocupan cargos en la entidad y si tienen situacion laboral sin cargo
                if($c1 > 0 || $c2 > 0){
                    //Verifico que las personas que forman parte de la plantilla nominal esten en el periodo de pago
                    $arrPOCVerificadas = array();
                    foreach($arrPerPlantCargos as $i => $p) {
                        foreach($arrPer as $j => $pp) {
                            if($p['idpersona'] == $pp['idpersona'] && $p['idcargosocupados'] == $pp['idcargosocupados']){
                                $arrPOCVerificadas[$p['idpersona'] . '-' . $p['idcargosocupados']] = $p;
                            }
                        }
                    }
                    $arrPerSinCarConSit = array();
                    foreach($arrPerSinCargosConSituacion as $i => $p) {
                        $arrPerSinCarConSit[$p['idpersona'] . '-' . $p['idcargosocupados']] = $p;
                    }

                    //ARREGLO DE PERSONAS QUE VAN A LA NOMINA
                    $arrPerVanAlaNomina = array_merge($arrPOCVerificadas, $arrPerSinCarConSit);
                    //print_r($arrPerVanAlaNomina);die;
                    //OBTENGO LA ESTRUCTURA DE LA NOMINA POR TIPO DE NOMINA
                    $objConfModNomina = new ConfigModeloNomina();/*OBJETO*/
                    $arrConfModNom = $objConfModNomina->obtenerObjConfigModelosNominaDadoId($idconfmodelonomina)->toArray();
                    if(count($arrConfModNom) > 0){//ESTRUCTURA DE LA NOMINA
                        $estNomina = DatNomina::obtenerEstructuraNomina($arrConfModNom['idtiponomina'], $arrConfModNom['idtipopago']);

                        if(count($estNomina) > 0){
                            //OBTENGO LA CONFIGURACION DE VARIABLES GLOBALES
                            $aC = $objPlantCargos->obtenerCargosByIdPlantilla($idplantillanominal);
                            $arrCargos = array();
                            foreach($aC as $i => $c) {
                                $arrCargos[] = $c['idcargo'];
                            }
                            $this->datosVariablesGlobales = $this->obtenerVariablesGlobales($identidad, $arrCargos);
                            //print_r($this->datosVariablesGlobales);die;
                            //Busco las variables de reportes que devuelven un periodo de vacaciones
                            $this->obtenerVariablesReportesParaPeriodosVacaciones();
                            //VERIFICO SI LA NOMINA ACUMULA VACACIONES PARA CARGAR LA CONFIGURACION
                            $objTipoNomina = Doctrine::getTable('NomTipoNomina')->find($arrConfModNom['idtiponomina']);

                        }
                    }


                    //print_r($idtipopago);die;
                    // $this->obtenerConfiguracionElementosSalarialesyConceptosporPersona($arrPerVanAlaNomina, $idtipopago);

                    $objDatosNominas = new DatNominaDatos();
                    $arrDatosNominas = $objDatosNominas->obtenerDatosNomina($idnomina);
                    $arrValores = unserialize($arrDatosNominas[0]['valores']);
                    $arrcolumna = unserialize($arrDatosNominas[0]['campos']);

                    $arrPerVanAlaNominaAux = array();
                    foreach($arrValores as $countv => $rvalor) {
                        $arrdatos = explode("-", $rvalor['id']);
                        $sql = "SELECT dcocup.idcargo, dcocup.idsituacionlaboral
							FROM mod_nomina.dat_cargosocupados dcocup
							where dcocup.idcargosocupados = ?";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $arraycargoocup = $conn->fetchAll($sql, array($arrdatos[1]));
                        $arrPerVanAlaNominaAux[$rvalor['id']]['idcargosocupados'] = $arrdatos[1];
                        $arrPerVanAlaNominaAux[$rvalor['id']]['idpersona'] = $arrdatos[0];
                        $arrPerVanAlaNominaAux[$rvalor['id']]['idcargo'] = $arraycargoocup[0]['idcargo'];
                        $arrPerVanAlaNominaAux[$rvalor['id']]['idsituacionlaboral'] = $arraycargoocup[0]['idsituacionlaboral'];
                    }
                    if($objTipoNomina->acumulavacaciones == 1 || $objTipoNomina->liquidavacaciones == 1){
                        $this->obtenerConfiguracionAcumulacionLiquidacionVacaciones();
                        $this->obtenerConfVariablesFormulaAcumulacionLiquidacionVacaciones();
                        $this->obtenerPeriodosVacaciones();
                        $this->obtenerPersonasSubMayorVacaciones($identidad, $arrPerVanAlaNominaAux);
                        //$this->obtenerPersonasSubMayorVacaciones($identidad, $arrPerVanAlaNomina);
                    }
                    //print_r($objTipoNomina);die;
                    //CALCULO EL ACUMULADO DE VACACIONES DE CADA PERSONA QUE ESTA EN LA NOMINA
                    if($objTipoNomina->acumulavacaciones == 1){
                        $this->calcularAcumuladoVacaciones();
                        $arrAcumuladoVac = array();


                        $sqlcampoacumula = "SELECT estrm.idestructuramodelodomina
							    from mod_nomina.conf_estructuramodelosnomina estrm
							    inner join mod_nomina.conf_modelonomina confm on (confm.idtiponomina = estrm.idtiponomina)
							    inner join mod_nomina.dat_nomina datn on (datn.idconfmodelonomina = confm.idconfmodelonomina)
							    where datn.idnomina = ? and confm.idconfmodelonomina =? and estrm.acumulavacaciones=1";
                        $mg = Doctrine_Manager::getInstance();
                        $conn = $mg->getCurrentConnection();
                        $arraycampocaumula = $conn->fetchAll($sqlcampoacumula, array($idnomina, $idconfmodelonomina));
                        foreach($this->arrPersonasSubMayorVac as $i => $p) {
                            $tiempo = 0;
                            $importe = 0;
                            $idvacacionespersona = 0;
                            foreach($p as $j => $vac) {
                                //Esto para sumar los campos q acumulan de la nomina aprobada.
                                $importecableado = 0;
                                foreach($arrValores as $cont => $valor) {
                                    $arridperscarg = explode("-", $valor['id']);
                                    $idpersonacableada = $arridperscarg[0];
                                    if($i == $idpersonacableada){
                                        foreach($arraycampocaumula as $cc => $racum) {
                                            $idcampo = $racum['idestructuramodelodomina'];
                                            $importecableado += $valor["c$idcampo"];

                                        }

                                    }
                                }
                                $acumuladoimporte = $importecableado * 9.09 / 100;
                                //Si el reporte es de licencia de maternidad
                                if(count($arraycampocaumula) == 2){
                                    //Busco los datos del reporte de licencia de maternidad
                                    $sqldatosreplic = "SELECT conft.idconfreportescertificaciones, ctvar.idvariablesconfreportescertificaciones
							    from mod_nomina.conf_tiporeportescertificaciones conft
							    inner join mod_nomina.conf_variablestiporeportescertificaciones ctvar on (ctvar.idconfreportescertificaciones = conft.idconfreportescertificaciones)
							    where conft.deresultados = 3 and ctvar.tipovariable=5";
                                    $mg = Doctrine_Manager::getInstance();
                                    $conn = $mg->getCurrentConnection();
                                    $arraydatosreplic = $conn->fetchAll($sqldatosreplic);
                                    if(count($arraydatosreplic) > 0){
                                        $valor = $this->buscarEnReportes($i, $arraydatosreplic[0]['idconfreportescertificaciones'], $arraydatosreplic[0]['idvariablesconfreportescertificaciones']);
                                        $tiempo = ($valor != null || $valor != "") ? $valor * 9.09 / 100 : 0.00;
                                    }
                                }else{
                                    $tiempo = $tiempo + $vac->tiempoacumulado;
                                }
                                //$importe = $importe + $vac->importeacumulado;
                                $arrAcumuladoVac[$i]['idpersona'] = $i;
                                $arrAcumuladoVac[$i]['idvacacionespersona'] = $vac->idvacacionespersona;
                                $arrAcumuladoVac[$i]['tiempoacumulado'] = $tiempo;
                                //$arrAcumuladoVac[$i]['importeacumulado'] = $importe;
                                $arrAcumuladoVac[$i]['importeacumulado'] = $acumuladoimporte;
                                $arrAcumuladoVac[$i]['saldoentiempo'] = $vac->tiempo;
                                $arrAcumuladoVac[$i]['saldoenimporte'] = $vac->importe;
                                $arrAcumuladoVac[$i]['tiempoacumuladoinicial'] = $vac->tiempoacumuladoinicial;
                                $arrAcumuladoVac[$i]['importeacumuladoinicial'] = $vac->importeacumuladoinicial;
                            }
                        }
                        /*if(count($this->arrPersonasSubMayorVac)>0){
                    print_r($arrAcumuladoVac);die;
                }*/
                        //if($idnomina==8233){print_r($arrAcumuladoVac);die;}
                        $objHisVacModel = new HisVacacionesPersonaModel();
                        $objHisVacModel->Adicionar($arrAcumuladoVac, $idnomina, date('Y-m-d'), 1);
                    }

                    //CALCULO LA LIQUIDACION DE VACACIONES DE CADA PERSONA QUE ESTA EN LA NOMINA										
                    if($objTipoNomina->liquidavacaciones == 1){
                        $this->calcularLiquidacionVacaciones();
                        $arrLiquidacionVac = array();
                        //print_r($this->arrPersonasSubMayorVac);die;
                        foreach($this->arrPersonasSubMayorVac as $i => $p) {
                            $tiempo = 0;
                            $importe = 0;
                            $idvacacionespersona = 0;
                            foreach($p as $j => $vac) {
                                $tiempo = $tiempo + $vac->tiempoacumulado;
                                $importe = $importe + $vac->importeacumulado;
                                $arrLiquidacionVac[$i]['idpersona'] = $i;
                                $arrLiquidacionVac[$i]['saldoentiempo'] = $vac->tiempo;
                                $arrLiquidacionVac[$i]['saldoenimporte'] = $vac->importe;
                                $arrLiquidacionVac[$i]['idvacacionespersona'] = $vac->idvacacionespersona;
                                $arrLiquidacionVac[$i]['tiempoacumulado'] = $tiempo;
                                $arrLiquidacionVac[$i]['importeacumulado'] = $importe;
                                $arrLiquidacionVac[$i]['tiempoacumuladoinicial'] = $vac->tiempoacumuladoinicial;
                                $arrLiquidacionVac[$i]['importeacumuladoinicial'] = $vac->importeacumuladoinicial;
                            }
                        }
                        $objHisVacModel = new HisVacacionesPersonaModel();
                        $objHisVacModel->Adicionar($arrLiquidacionVac, $idnomina, date('Y-m-d'), 2);
                    }

                    /*if($objTipoNomina->acumulavacaciones != 1 || $objTipoNomina->liquidavacaciones != 1){
			  $m->codigo = 'NOACUMULANOLIQUIDA';
			}*/

                }else{
                    $m->codigo = 'NOPERSONASOCUPANCARGOSPLANTILLA';
                }
            }else{
                $m->codigo = 'NOPERSONASPERIODOPAGO';
            }

        }else{
            $m->codigo = 'NOCATTIPONOMINA';
        }
        return $m;
    }

    /*Obtengo y formateo la estructura de la nomina
	 * 
	 * Formato: array[idestructuramodelodomina]->id
	 * 			  array[idestructuramodelodomina]->denominacion
	 * 			  array[idestructuramodelodomina]->tipocampo
	 * 			  array[idestructuramodelodomina]->valormostrar
	 * 			  array[idestructuramodelodomina]->expmatcal
	 * 			  array[idestructuramodelodomina]->orden
	 * 			  array[idestructuramodelodomina]->visible
	 * 			  array[idestructuramodelodomina]->camposcalcular[idtipopago-idsistemapago]
	 * 			
	 * */
    private function obtenerEstructuraNomina ($idtiponomina, $idtipopago)
    {
        $objEst = array();
        $objConfEN = new ConfigEstructurarModelosNomina();
        $arrEst = $objConfEN->obtenerEstructuraPorTipoNomina($idtiponomina);
        $arrIds = array();
        foreach($arrEst as $i => $e) {
            $arrIds[] = $e['idestructuramodelodomina'];
        }

        $arrIds = array_unique($arrIds);
        $this->objNominaPersonas->campos = array();
        foreach($arrIds as $i => $ids) {
            foreach($arrEst as $j => $ve) {
                if($ids == $ve['idestructuramodelodomina']){
                    $objEst[$ids]->id = $ve['idestructuramodelodomina'];
                    $objEst[$ids]->denominacion = $ve['denominacion'];
                    $objEst[$ids]->tipocampo = $ve['idtipocampo'];
                    $objEst[$ids]->valormostrar = $ve['idvalormostrar']; //Datos de persona o formula
                    $objEst[$ids]->expmatcal = $ve['expmatcal']; //Formula de la expresion matematica a calcular
                    $objEst[$ids]->orden = $ve['orden'];
                    $objEst[$ids]->visible = $ve['visible'];

                    if($objEst[$ids]->tipocampo == 2){
                        $objCampo = $this->conformarParaCalcular($ve['idconcepto'], $ve['tipo'], $idtipopago);
                        $objEst[$ids]->tipocamposcalcular = $ve['tipo'];
                        if($ve['tipo'] == 3 || $ve['tipo'] == 5){
                            $objEst[$ids]->camposcalcular[$objCampo->tipopago . '-' . $objCampo->sistemapago] = $objCampo;
                        }else{
                            $objEst[$ids]->camposcalcular = $objCampo;
                        }
                    }else{
                        $objEst[$ids]->camposcalcular = null;
                    }

                }
            }
        }
        return $objEst;
    }

    private function conformarParaCalcular ($valor, $tipo, $idtipopago)
    {
        $c = null;
        switch ($tipo) {
            case 1: {//Sueldo por cargo
                $c->tipopago = $idtipopago;
                $c->sistemapago = null;
                $c->campo = 'SPC';
                break;
            }
            case 2: { //Retenciones
                $c->tipopago = $idtipopago;

                $a = explode('_', $valor);

                $c->sistemapago = null;
                $c->campo = $a[1];
                break;
            }
            case 3: {//Conceptos de la retribucion monetaria
                $c->tipopago = $idtipopago;

                $a = explode('_', $valor);

                $c->sistemapago = ($a[0] != 0 ? $a[0] : null);
                $c->campo = $a[2];
                break;
            }
            case 5: {//Conceptos de percepcion y descuentos
                $c->tipopago = $idtipopago;

                $a = explode('_', $valor);

                $c->sistemapago = ($a[0] != 0 ? $a[0] : null);
                $c->campo = $a[4];
                break;
            }
        }

        return $c;
    }

    /*Obtengo y formateo la configuracion de Tarifas de Conceptos de Percepciones y Descuentos
	 * 
	 * Formato: array[idconceptopercepciondescuento]->id
	 * 			array[idconceptopercepciondescuento]->tarifa[idconceptopdtarifa]->idtarifa
	 * 			array[idconceptopercepciondescuento]->tarifa[idconceptopdtarifa]->formacalculo
	 * 			array[idconceptopercepciondescuento]->tarifa[idconceptopdtarifa]->idformula
	 * 			array[idconceptopercepciondescuento]->tarifa[idconceptopdtarifa]->importe
	 * */
    private function obtenerConfiguracionConceptosPercepcionDescuentos ()
    {
        $objTCPD = new NomConceptoPDTarifa();
        $arrConf = $objTCPD->obtenerTarifasFormaCalculoConceptosPD();
        $arrConfTCPD = array();

        foreach($arrConf as $j => $tc) {
            $arrConfTCPD[$tc['idconceptopercepciondescuento']]->id = $tc['idconceptopercepciondescuento'];
            $arrConfTCPD[$tc['idconceptopercepciondescuento']]->tarifa[$tc['idtarifa']]->idtarifa = $tc['idtarifa'];
            $arrConfTCPD[$tc['idconceptopercepciondescuento']]->tarifa[$tc['idtarifa']]->formacalculo = $tc['idformacalculo'];
            $arrConfTCPD[$tc['idconceptopercepciondescuento']]->tarifa[$tc['idtarifa']]->idformula = $tc['idformula'];
            $arrConfTCPD[$tc['idconceptopercepciondescuento']]->tarifa[$tc['idtarifa']]->importe = $tc['importe'];
        }

        return $arrConfTCPD;
    }

    /*Obtengo y formateo la configuracion para el calculo de los Conceptos de PD por Tipo - Formas y Sistemas - Periodos  de pago
	 * 
	 * Formato: 
	 * */
    private function obtenerConfCalculoConceptoPDporTipoFormasySistemasPago ($identidad)
    {
        $ioc = ZendExt_IoC_Inter::getInstance();
        $objCPDTSP = new ConfConceptosporTiposySistemasPago();
        $arrConf = $objCPDTSP->obtenerTodosCalculoConceptoPDTiposFormasySistemasporPeriodoPago($identidad);
        foreach($arrConf as $i => $c) {
            $periodo = 0;
            if($c['idperiodopago'] != ''){
                $periodo = $c['idperiodopago'];
            }
            $this->confCalculoCPDTipoFormSistPerPago[$c['idtipopago'] . '-' . $c['idsistemapago']][$c['idconceptopercepciondescuento']]->periodos[$periodo]->formacalculo = $c['formacalculo'];
            $this->confCalculoCPDTipoFormSistPerPago[$c['idtipopago'] . '-' . $c['idsistemapago']][$c['idconceptopercepciondescuento']]->periodos[$periodo]->idexpresionmatematica = $c['idexpresionmatematica'];
            if($c['idexpresionmatematica'] != ''){
                $this->confCalculoCPDTipoFormSistPerPago[$c['idtipopago'] . '-' . $c['idsistemapago']][$c['idconceptopercepciondescuento']]->periodos[$periodo]->indicadoresexpmat = $ioc->comun->ObtenerarrIdIndicadoresporExpresionMatematica($c['idexpresionmatematica']);
            }
            if($c['idvariableauxconceptospdformasysistemaspago'] != ''){
                $this->confCalculoCPDTipoFormSistPerPago[$c['idtipopago'] . '-' . $c['idsistemapago']][$c['idconceptopercepciondescuento']]->periodos[$periodo]->variables[$c['idvariableauxconceptospdformasysistemaspago']]->id = $c['idvariableauxconceptospdformasysistemaspago'];
                $this->confCalculoCPDTipoFormSistPerPago[$c['idtipopago'] . '-' . $c['idsistemapago']][$c['idconceptopercepciondescuento']]->periodos[$periodo]->variables[$c['idvariableauxconceptospdformasysistemaspago']]->formaentrada = $c['formaentrada'];
                $this->confCalculoCPDTipoFormSistPerPago[$c['idtipopago'] . '-' . $c['idsistemapago']][$c['idconceptopercepciondescuento']]->periodos[$periodo]->variables[$c['idvariableauxconceptospdformasysistemaspago']]->idconfreportescertificaciones = $c['idconfreportescertificaciones'];
                $this->confCalculoCPDTipoFormSistPerPago[$c['idtipopago'] . '-' . $c['idsistemapago']][$c['idconceptopercepciondescuento']]->periodos[$periodo]->variables[$c['idvariableauxconceptospdformasysistemaspago']]->idvariablesconfreportescertificaciones = $c['idvariablesconfreportescertificaciones'];
            }
        }
        //print_r($this->confCalculoCPDTipoFormSistPerPago);die;

    }

    /*Obtengo y formateo la configuracion de los Conceptos de la Retribucion Monetaria
	 * 
	 * Formato: array[idtipopago-idsistemapago]->idconceptorm
					  array[idtipopago-idsistemapago]->idtipopago
					  array[idtipopago-idsistemapago]->idsistemapago
					  array[idtipopago-idsistemapago]->idexpresionmatematica
					  array[idtipopago-idsistemapago]->indicadoresexpmat
	 * */
    private function obtenerConfiguracionConceptosRetribucionMonetaria ()
    {
        $ioc = ZendExt_IoC_Inter::getInstance();
        $objTCRM = new ConfConceptosGeneralesNomina();
        $arrConf = $objTCRM->obtenerConfiguracionCRM();
        $arrRM = array();
        foreach($arrConf as $j => $rm) {
            $arrRM[$rm['idtipopago'] . '-' . $rm['idsistemapago']][$rm['idconceptorm']]->idconceptorm = $rm['idconceptorm'];
            $arrRM[$rm['idtipopago'] . '-' . $rm['idsistemapago']][$rm['idconceptorm']]->idtipopago = $rm['idtipopago'];
            $arrRM[$rm['idtipopago'] . '-' . $rm['idsistemapago']][$rm['idconceptorm']]->idsistemapago = $rm['idsistemapago'];
            $arrRM[$rm['idtipopago'] . '-' . $rm['idsistemapago']][$rm['idconceptorm']]->idexpresionmatematica = $rm['idexpresionmatematica'];
            $arrRM[$rm['idtipopago'] . '-' . $rm['idsistemapago']][$rm['idconceptorm']]->indicadoresexpmat = $ioc->comun->ObtenerarrIdIndicadoresporExpresionMatematica($rm['idexpresionmatematica']);
        }

        return $arrRM;
    }

    /*Obtengo los datos de las personas, que se deben de mostrar en la nomina
	 * 
	 * */
    private function cargarDatosPersonas ($arrPersonas, $arrCampos)
    {

        $arrIdsCO = array();
        foreach($arrPersonas as $i => $p) {
            $arrIdsCO[] = $p['idcargosocupados'];
        }
        $arrIdsCO = array_unique($arrIdsCO);

        $xml = new NXML('campos_persona.xml');
        //print_r($arrCampos);die;
        $x = $xml->LeerDatosCamposPersona($arrCampos, 0); //Cargo todos los campos del XML


        $select = "";
        $join = "inner join mod_persona.dat_persona dp  on (dp.idpersona = dco.idpersona and dp.feliminado is null) ";
        $where = "";
        $from = "";
        $select .= "SELECT dco.idpersona, dco.idcargosocupados ";
        $from .= " FROM mod_nomina.dat_cargosocupados dco ";
        $where .= " WHERE dco.idcargosocupados in (" . implode(',', $arrIdsCO) . ") ";

        foreach($x as $i => $v) {
            $select .= ", " . $v->select;
            $where .= ($v->where != '' ? " AND " . $v->where : "");
            $arrJoin = explode('>>>', $v->join);
            foreach($arrJoin as $k => $j) {
                if(stripos($join, $j) === false){
                    $join .= " " . $j;
                }
            }
        }
        $sql = $select . " " . $from . " " . $join . " " . $where;
        //print_r($sql);die;
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $rDatosPersona = $conn->fetchAll($sql);

        $arrDatosCampos = array();
        foreach($rDatosPersona as $j => $p) {
            $arrDatosCampos[$p['idpersona'] . '-' . $p['idcargosocupados']] = $p;
        }

        return $arrDatosCampos;

    }

    /*Obtengo la configuracion de las variables globales
	 * 
	 * Formato:   sistema[idvariableglobal]
	 * 				entidad[idvariableglobal]
	 * 				cargo[idcargo-idvariableglobal]
	 * */
    private function obtenerVariablesGlobales ($identidad, $arrCargos)
    {
        $objCVG = new ConfigVariableGlobalValor();
        $arrVG = $objCVG->obtenerConfValoresVariablesGlobales($identidad, $arrCargos);
        $conf = null;
        foreach($arrVG as $i => $c) {
            if($c['idnivelconfiguracion'] == 1){
                $conf->sistema[$c['idvariableglobal']] = $c['valor'];
            }else if($c['idnivelconfiguracion'] == 2){
                $conf->entidad[$c['idvariableglobal']] = $c['valor'];
            }else if($c['idnivelconfiguracion'] == 3){
                $conf->cargo[$c['idvariableglobal']] = $c['valor'];
            }
        }
        return $conf;
    }

    /*Obtengo los sueldos por cargos de cada persona
	 * 
	 * */
    private function obtenerSueldoPorCargo ($arrIdsCargosOcupadosPersona)
    {
        $arrCargosOcupados = array();
        foreach($arrIdsCargosOcupadosPersona as $i => $cop) {
            $arrCargosOcupados[] = $cop['idcargosocupados'];
        }

        $arrCargosOcupados = array_unique($arrCargosOcupados);//int_r($arrCargosOcupados);die;

        $sql = "select dco.idpersona, dco.idcargosocupados,
					(CASE 
					WHEN (cess.idelementosalarialsituacionservicio is not null) THEN cess.importe 
					WHEN (cesc.idelementosalarialcargo is not null and cess.idelementosalarialsituacionservicio is null) THEN cesc.importe
					ELSE -1 END) as spc
					from mod_nomina.dat_cargosocupados dco
					left join mod_nomina.conf_elementosalarialsituacionservicio cess on (cess.idcargoocupado = dco.idcargosocupados and (cess.fechafin is null or cess.fechafin >= now()))
					left join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idcargo = dco.idcargo and (cesc.fechafin is null or cesc.fechafin >= now()))
					where dco.idcargosocupados in (" . implode(',', $arrCargosOcupados) . ");";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $rSPC = $conn->fetchAll($sql);
        foreach($rSPC as $i => $s) {
            $this->arrValoresColumnas[$s['idpersona'] . '-' . $s['idcargosocupados']]->spc = $s['spc'];
        }
        //print_r($this->arrValoresColumnas);die;
    }

    /*
	 * Obtengo las variables de la configuracion de los tipos de reportes que registran los periodos de vacaciones 
	 * para tenerla en cuenta a la hora de la liquidacion de vacaciones
	 * */
    private function obtenerVariablesReportesParaPeriodosVacaciones ()
    {
        $sql = "select *	from mod_nomina.conf_vartiporeportescertificacionesparaperiodosvacaciones;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $rSPC = $conn->fetchAll($sql);
        foreach($rSPC as $i => $s) {
            $this->arrIdVarParaPeriodosVacaciones[$s['idvariablesconfreportescertificaciones']] = $s['idvariablesconfreportescertificaciones'];
        }

    }

    /*
	 * Obtengo las condiciones para que se pueda aplicar las retenciones de acuerdo con el tipo de nomina
	 * */
    private function condicionRetenciones ($idtiponomina)
    {
        $objConNom = new ConfCondicionesRetenciones();
        $arr = $objConNom->obtenerCondicionesRetencionesPorTipoNomina($idtiponomina);
        if(count($arr) > 0){
            $this->arrCondicionRetenciones = $arr[0];
        }
    }

    /*
	 * Obtengo las variables que forman parte de las formulas de las condiciones de retenciones
	 * */
    private function obtenerVariablesReportesParaRetenciones ()
    {
        $objVRR = new DatVariablesCondicionesRetenciones();
        $arrVar = $objVRR->obtenerTodasVariables();
        foreach($arrVar as $k => $v) {
            $this->arrVarReportesRetenciones[$v['idvariablescondicionesretenciones']]->formaentrada = $v['formaentrada'];
            $this->arrVarReportesRetenciones[$v['idvariablescondicionesretenciones']]->idvariablesconfreportescertificaciones = $v['idvariablesconfreportescertificaciones'];
            $this->arrVarReportesRetenciones[$v['idvariablescondicionesretenciones']]->idconfreportescertificaciones = $v['idconfreportescertificaciones'];
        }
    }

    /*Obtengo las retenciones de las personas
	 * 
	 * */
    private function obtenerRetencionesporPersona ($identidad, $arrPerVanAlaNomina)
    {
        //if ($this->arrCondicionRetenciones != null) {
        $arrPersonas = array();
        foreach($arrPerVanAlaNomina as $i => $p) {
            $arrPersonas[] = $p['idpersona'];
        }
        $objRet = new DatRetencionPersona();
        $objHisRet = new HisRetencionesPersona();
        $rRET = $objRet->obtenerReterncionesPersonasEntidad($identidad, $arrPersonas);
        if(count($rRET) > 0){
            foreach($rRET as $i => $r) {
                $this->arrValoresRetencionesPersona[$r['idpersona']][$r['idtiporetencion']]->idretencionpersona = $r['idretencionpersona'];
                $this->arrValoresRetencionesPersona[$r['idpersona']][$r['idtiporetencion']]->idtiporetencion = $r['idtiporetencion'];
                $this->arrValoresRetencionesPersona[$r['idpersona']][$r['idtiporetencion']]->mensualidad = $r['mensualidad'];
                $this->arrValoresRetencionesPersona[$r['idpersona']][$r['idtiporetencion']]->ultmensualidad = $r['ultmensualidad'];
                $this->arrValoresRetencionesPersona[$r['idpersona']][$r['idtiporetencion']]->prioridad = $r['prioridad'];
                $this->arrValoresRetencionesPersona[$r['idpersona']][$r['idtiporetencion']]->saldolimite = $r['saldolimite'];
                $this->arrValoresRetencionesPersona[$r['idpersona']][$r['idtiporetencion']]->saldoinicial = $r['saldoinicial'];

                //Busco la ultimo operacion que en el submayor de retenciones
                $arrHis = $objHisRet->obtenerUltimaOperacionSubMayorRetenciones($r['idretencionpersona']);
                $saldodeladeudo = -1;
                $retencionpendiente = -1;
                $saldodeladeudopendiente = 0.00;
                if(count($arrHis) > 0){
                    $saldodeladeudo = $arrHis[0]['saldodeladeudo'];
                    $retencionpendiente = $arrHis[0]['retencionpendiente'];
                    $saldodeladeudopendiente = $arrHis[0]['saldodeladeudopendiente'];
                }

                $this->arrValoresRetencionesPersona[$r['idpersona']][$r['idtiporetencion']]->saldodeladeudo = $saldodeladeudo;
                $this->arrValoresRetencionesPersona[$r['idpersona']][$r['idtiporetencion']]->retencionpendiente = $retencionpendiente;
                $this->arrValoresRetencionesPersona[$r['idpersona']][$r['idtiporetencion']]->saldodeladeudopendiente = $saldodeladeudopendiente;
                $this->arrValoresRetencionesPersona[$r['idpersona']][$r['idtiporetencion']]->comoretener[$r['idcargosocupados']] = -1;
                $this->seCalcularonRetenciones[$r['idpersona']][$r['idcargosocupados']] = 2;
            }
        }else{
            $this->arrValoresRetencionesPersona = null;
        }
        /*} else {
            $this->arrValoresRetencionesPersona = null;
        }*/
    }

    /*
	 * Calcula la mensualidad de una retencion de un persona
	 * */
    private function calcularMensualidadRetencion ($p, $idtiporetencion, $modoRetener = 1)
    {
        $objRet = $this->arrValoresRetencionesPersona[$p['idpersona']][$idtiporetencion];
        if($modoRetener == 2){
            if($objRet->retencionpendiente != -1){
                $retencionpendiente = $objRet->retencionpendiente;
            }else{
                $retencionpendiente = 0;
            }
        }else{
            $retencionpendiente = 0;
        }
        if($objRet->saldolimite == 2){
            return $objRet->mensualidad + $retencionpendiente;
        }else{
            $saldoA = ($objRet->saldodeladeudo == -1) ? 0 : $objRet->saldodeladeudo;
            $resta = $objRet->saldoinicial - $saldoA;
            if($resta > 0 && $objRet->saldodeladeudo != 0.00){
                if($objRet->ultmensualidad != ''){
                    if($objRet->saldodeladeudo == $objRet->ultmensualidad || $resta < $objRet->mensualidad){
                        return $objRet->ultmensualidad;
                    }else if($resta > $objRet->ultmensualidad){
                        return $objRet->mensualidad + $retencionpendiente;
                    }else if($resta == $objRet->ultmensualidad){
                        return $objRet->ultmensualidad + $retencionpendiente;
                    }else if($resta > 0 && $resta < $objRet->ultmensualidad){
                        return $resta + $retencionpendiente;
                    }else return 0;
                }else{
                    if($resta >= $objRet->mensualidad){
                        return $objRet->mensualidad + $retencionpendiente;
                    }else{
                        return $resta + $retencionpendiente;
                    }
                }
            }else{
                return 0;
            }
        }

    }

    /*
	 * Calcula y evalua la formula de las condiciones para ver si se puede aplicar o no la retencion
	 * */
    private function calcularFormulaSiseCumpleoLimiteRetenciones ($p, $secumple = 1, $arrRet = null)
    {
        if($secumple == 1){
            $idexpresionmatematica = $this->arrCondicionRetenciones['formulacumpleretenciones'];
        }else{
            $idexpresionmatematica = $this->arrCondicionRetenciones['formulalimiteretenciones'];
        }
        $arrIndExpMat = $this->ioc->comun->ObtenerarrIdIndicadoresporExpresionMatematica($idexpresionmatematica);
        $arrValInd = array();
        foreach($arrIndExpMat as $k => $i) {
            $arr = explode('_', $i);
            switch ($arr[0]) {
                case 'CRM': {
                    $v = $this->calcularConceptoRM($arr[1], $p);
                    $arrValInd[$i] = $v;
                    break;
                }
                case 'VG': {
                    if(array_key_exists($arr[1], $this->datosVariablesGlobales->sistema)){
                        $arrValInd[$i] = $this->datosVariablesGlobales->sistema[$arr[1]];
                    }else if(array_key_exists($arr[1], $this->datosVariablesGlobales->entidad)){
                        $arrValInd[$i] = $this->datosVariablesGlobales->entidad[$arr[1]];
                    }else if(array_key_exists($arr[1], $this->datosVariablesGlobales->cargo)){
                        $arrValInd[$i] = $this->datosVariablesGlobales->cargo[$arr[1]];
                    }else{
                        $s->error = "La variable global no existe.";
                        $arrValInd[$i] = $s;
                    }
                    break;
                }
                case 'VAR': {
                    $v = 0;
                    if($this->arrVarReportesRetenciones[$arr[1]]->formaentrada == 2){
                        $v = $this->buscarEnReportes($p['idpersona'], $this->arrVarReportesRetenciones[$arr[1]]->idconfreportescertificaciones, $this->arrVarReportesRetenciones[$arr[1]]->idvariablesconfreportescertificaciones);
                    }else{
                        //Busco el dato que se introdujo manual
                        $v = 0.00;
                    }
                    $arrValInd[$i] = $v;
                    break;
                }
                case 'RET': {
                    if($arrRet == null){
                        $arrValInd[$i] = 0.00;
                    }else{
                        $sumRet = 0.00;
                        foreach($arrRet as $j => $r) {
                            $sumRet = $sumRet + $this->calcularMensualidadRetencion($p, $j, $r);
                        }
                        $arrValInd[$i] = $sumRet;
                    }
                    break;
                }
            }
        }
        //Conformo el arreglo de indicadores con valores
        $arrValores = array();
        foreach($arrValInd as $i => $v) {
            if(gettype($v) == "object"){
                $arrValores[] = array('idindicador' => $i, 'valor' => 0);
            }else{
                $arrValores[] = array('idindicador' => $i, 'valor' => $v);
            }
        }


        $valorConceptoPago = $this->ioc->comun->EvaluarExpresionMatematica($idexpresionmatematica, $arrValores);
        if($valorConceptoPago->valor == 1)
            return true;
        else
            return false;

    }

    /*
	 * Recorre las retenciones de cada persona y calcula si se pueden aplicar a la persona
	 * */
    private function CalcularRetPersona ($p)
    {
        $arrKey = array_keys($this->arrValoresRetencionesPersona[$p['idpersona']]);
        $arrRet = array();
        foreach($this->arrValoresRetencionesPersona[$p['idpersona']] as $i => $r) {
            if($r->retencionpendiente == -1){
                $arrRet[$i] = 1;
            }else{
                $arrRet[$i] = 2;
            }
        }
        //if($this->calcularFormulaSiseCumpleoLimiteRetenciones($p, 2, $arrRet)){
        foreach($this->arrValoresRetencionesPersona[$p['idpersona']] as $i => &$r) {
            $r->comoretener[$p['idcargosocupados']] = $arrRet[$i];
        }
        /*}else{
			$arrRet = array();
			foreach($this->arrValoresRetencionesPersona[$p['idpersona']] as $i => &$r){
				$arrRet[$i] = 2;
				if($r->retencionpendiente == -1){
					$arrRet[$i] = 1;
				}
				
				if($arrRet[$i] == 2){
					if($this->calcularFormulaSiseCumpleoLimiteRetenciones($p, 2, $arrRet)){
						$arrRet[$i] = 2;
						$r->comoretener[$p['idcargosocupados']] = 2;
						continue;
					}
					$arrRet[$i] = 1;
				}
				
				if($arrRet[$i] == 1){
					if($this->calcularFormulaSiseCumpleoLimiteRetenciones($p, 2, $arrRet)){
						$arrRet[$i] = 1;
						$r->comoretener[$p['idcargosocupados']] = 1;
						continue;
					}else {
						break;
					}
				}
				
			}
			
		}*/
        $this->seCalcularonRetenciones[$p['idpersona']][$p['idcargosocupados']] = 1;
    }

    /*
	 * Obtengo la configuracion de elementos salariales de las personas que van a la nomina
	 * */
    private function obtenerConfiguracionElementosSalarialesyConceptosporPersona ($arrPerVanAlaNomina, $idtipopago)
    {

        $arrCargosOcupados = array();
        foreach($arrPerVanAlaNomina as $i => $cop) {
            $arrCargosOcupados[] = $cop['idcargosocupados'];
        }
        $arrCargosOcupados = array_unique($arrCargosOcupados);//print_r($arrCargosOcupados);die;

        $this->arrConfElemSalarialesConceptosPersona = array();
        $sql = "SELECT distinct dco.idpersona, dco.idcargosocupados,
					(CASE WHEN cess.idelementosalarialsituacionservicio is not null THEN cess.idsistemapago
					WHEN cesc.idelementosalarialcargo is not null THEN cesc.idsistemapago
					ELSE -1 END
					) as idsistemapago,
					(CASE WHEN cess.idelementosalarialsituacionservicio is not null THEN cess.idperiodopago
					WHEN cesc.idelementosalarialcargo is not null THEN cesc.idperiodopago
					ELSE -1 END) as idperiodopago,
					(CASE WHEN cess.idelementosalarialsituacionservicio is not null THEN concepcess.idconceptopercepciondescuento
					WHEN cesc.idelementosalarialcargo is not null THEN concepcesc.idconceptopercepciondescuento
					ELSE -1 END) as idconceptopercepciondescuento,
					(CASE WHEN cess.idelementosalarialsituacionservicio is not null THEN concepcess.idtarifa
					WHEN cesc.idelementosalarialcargo is not null THEN concepcesc.idtarifa
					ELSE -1 END) as idtarifa,
					(CASE WHEN cess.idelementosalarialsituacionservicio is not null THEN 2
					WHEN cesc.idelementosalarialcargo is not null THEN 1
					ELSE -1 END) as tipo,
					(CASE WHEN (esc1.idconfescalaelementosalarial is not null and esc2.idconfescalaelementosalarialpersona is null and esc3.idescalaelementosalarialsituacionservicio is null and concepcess.idconceptpelementsalarialessituacionservicio is null) THEN esc1.idescalatarifa
					WHEN (esc2.idconfescalaelementosalarialpersona is not null and esc3.idescalaelementosalarialsituacionservicio is null and concepcess.idconceptpelementsalarialessituacionservicio is null) THEN esc2.idescalatarifa
					WHEN esc3.idescalaelementosalarialsituacionservicio is not null THEN esc3.idescalatarifa
					ELSE -1 END) as idescalatarifa,
					(CASE WHEN (esc1.idconfescalaelementosalarial is not null and esc2.idconfescalaelementosalarialpersona is null and esc3.idescalaelementosalarialsituacionservicio is null and concepcess.idconceptpelementsalarialessituacionservicio is null) THEN 3
					WHEN (esc2.idconfescalaelementosalarialpersona is not null and esc3.idescalaelementosalarialsituacionservicio is null and concepcess.idconceptpelementsalarialessituacionservicio is null) THEN 4
					WHEN esc3.idescalaelementosalarialsituacionservicio is not null THEN 4
					ELSE -1 END) as tipoentrada
					FROM mod_nomina.dat_cargosocupados dco
					left join mod_nomina.conf_elementosalarialcargo cesc on (cesc.idcargo = dco.idcargo)
					left join mod_nomina.conf_elementosalarialsituacionservicio cess on (cess.idcargoocupado = dco.idcargosocupados)
					left join mod_nomina.conf_conceptospdelementossalariales concepcesc on (concepcesc.idelementosalarialcargo = cesc.idelementosalarialcargo)
					left join mod_nomina.conf_conceptpelementsalarialessituacionservicio concepcess on (concepcess.idcargosocupados = cess.idcargoocupado)
					left join mod_nomina.conf_escalaelementosalarial esc1 on (esc1.idconfconceptospdelementossalariales = concepcesc.idconfconceptospdelementossalariales and (esc1.fechafin is null or esc1.fechafin >= now()))
					left join mod_nomina.conf_escalaelementosalarialpersona esc2 on (esc2.idconfconceptospdelementossalariales = concepcesc.idconfconceptospdelementossalariales and esc2.idcargosocupados = dco.idcargosocupados  and (esc2.fechafin is null or esc2.fechafin >= now()))
					left join mod_nomina.conf_escalaelementosalarialsituacionservicio esc3 on (esc3.idconceptpelementsalarialessituacionservicio = concepcess.idconceptpelementsalarialessituacionservicio  and (esc3.fechafin is null or esc3.fechafin >= now()))
					WHERE dco.idcargosocupados in (" . implode(',', $arrCargosOcupados) . ") and ((cesc.fechafin is null or cesc.fechafin >= now()) or (cess.fechafin is null or cess.fechafin >= now()))";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        foreach($r as $i => $s) {
            $this->arrConfElemSalarialesConceptosPersona[$s['idpersona'] . '-' . $s['idcargosocupados']]->idtipopago = $idtipopago;
            $this->arrConfElemSalarialesConceptosPersona[$s['idpersona'] . '-' . $s['idcargosocupados']]->idsistemapago = $s['idsistemapago'];
            $this->arrConfElemSalarialesConceptosPersona[$s['idpersona'] . '-' . $s['idcargosocupados']]->tsp[$idtipopago . '-' . $s['idsistemapago']]->conceptopd[$s['idconceptopercepciondescuento']]->idconceptopercepciondescuento = $s['idconceptopercepciondescuento'];
            $this->arrConfElemSalarialesConceptosPersona[$s['idpersona'] . '-' . $s['idcargosocupados']]->tsp[$idtipopago . '-' . $s['idsistemapago']]->conceptopd[$s['idconceptopercepciondescuento']]->idtarifa = $s['idtarifa'];
            $this->arrConfElemSalarialesConceptosPersona[$s['idpersona'] . '-' . $s['idcargosocupados']]->tsp[$idtipopago . '-' . $s['idsistemapago']]->conceptopd[$s['idconceptopercepciondescuento']]->idperiodopago = $s['idperiodopago'];
            $this->arrConfElemSalarialesConceptosPersona[$s['idpersona'] . '-' . $s['idcargosocupados']]->tsp[$idtipopago . '-' . $s['idsistemapago']]->conceptopd[$s['idconceptopercepciondescuento']]->tipo = $s['tipo'];
            $this->arrConfElemSalarialesConceptosPersona[$s['idpersona'] . '-' . $s['idcargosocupados']]->tsp[$idtipopago . '-' . $s['idsistemapago']]->conceptopd[$s['idconceptopercepciondescuento']]->tipoentrada = $s['tipoentrada'];
            $this->arrConfElemSalarialesConceptosPersona[$s['idpersona'] . '-' . $s['idcargosocupados']]->tsp[$idtipopago . '-' . $s['idsistemapago']]->conceptopd[$s['idconceptopercepciondescuento']]->idescalatarifa = $s['idescalatarifa'];
        }

    }

    /*Obtengo los valores de las variables que se llenaron de forma manual cuando se estaba elaborando el pago
	 * 
	 * */
    private function obtenerValoresVariablesPeriodoPagoporPersonasCargosOcupados ($idelaborarpago, $arrPerVanAlaNomina)
    {
        $objVarPP = new DatVariablesPersonasElaborarPagos();
        $r = $objVarPP->devolverValoresVariablesporPeriodosyPersonasCargosOcupados($idelaborarpago, $arrPerVanAlaNomina);
        $this->arrValoresVariablesElaborarPago = array();
        foreach($r as $i => $v) {
            if($v['origenvariable'] == 1){
                $this->arrValoresVariablesElaborarPago[$v['idpersona'] . '-' . $v['idcargosocupados']]->conceptopd[$v['idconceptopercepciondescuento']] = $v['valor'];
            }else if($v['origenvariable'] == 2){
                $this->arrValoresVariablesElaborarPago[$v['idpersona'] . '-' . $v['idcargosocupados']]->varauxconfformassistemaspago[$v['idvariableauxconceptospdformasysistemaspago']] = $v['valor'];
            }else if($v['origenvariable'] == 3){
                $this->arrValoresVariablesElaborarPago[$v['idpersona'] . '-' . $v['idcargosocupados']]->varauxconceptopd[$v['idvariableauxiliarformula']] = $v['valor'];
            }
        }
    }

    /*
	 * Calculo el valor del concepto de percepcion y descuento
	 * Funcion recursiva
	 * */
    private function calcularConceptoPago ($p, $idtipopago, $idsistemapago, $idperiodopago, $idtarifa, $conceptopd)
    {
        //Verifico si el concepto de pd para esa persona fue calculado
        if(array_key_exists($conceptopd, $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->cpd)){
            return $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->cpd[$conceptopd];
        }else{
            //Verifico si el periodo de pago esta configurado para ese concepto de pd
            if($this->sedesglosa != 1){
                $pidsistemapago = null; //Se pone a null porque los tipos de pagos que no se desglosan no tienen sistemas de pagos
                $pidperiodopago = 0;
            }else{
                $pidsistemapago = $idsistemapago;
                $pidperiodopago = $idperiodopago;
            }
            if(array_key_exists($pidperiodopago, $this->confCalculoCPDTipoFormSistPerPago[$idtipopago . '-' . $pidsistemapago][$conceptopd]->periodos)){
                $objConfPer = $this->confCalculoCPDTipoFormSistPerPago[$idtipopago . '-' . $pidsistemapago][$conceptopd]->periodos[$pidperiodopago];
                //print_r($objConfPer);die;
                if($objConfPer->formacalculo == 1){//Manual - Se busca en las variables de elaborar pago
                    //Verifico si el concepto tiene valor en las variables que se registran en elaborar pago
                    if(array_key_exists($conceptopd, $this->arrValoresVariablesElaborarPago[$p['idpersona'] . '-' . $p['idcargosocupados']]->conceptopd)){
                        //print_r('si');die;
                        return $this->arrValoresVariablesElaborarPago[$p['idpersona'] . '-' . $p['idcargosocupados']]->conceptopd[$v[$conceptopd]];
                    }else{
                        $s->error = "El valor de no se encuentra registrado a la hora de elaborar el pago.";
                        return $s;
                    }
                }else{//Formula - Se busca el valor del indicador en la conf de cada concepto de pd.
                    $arrValInd = array();
                    foreach($objConfPer->indicadoresexpmat as $k => $i) {
                        $valor = null;
                        $arr = explode('_', $i);
                        switch ($arr[0]) {
                            case 'VASP': {
                                $formaentrada = $objConfPer->variables[$arr[1]]->formaentrada;
                                if($formaentrada == 1){//Forma de entrada manual
                                    if(array_key_exists($arr[1], $this->arrValoresVariablesElaborarPago[$p['idpersona'] . '-' . $p['idcargosocupados']]->varauxconfformassistemaspago)){
                                        $arrValInd[$i] = $this->arrValoresVariablesElaborarPago[$p['idpersona'] . '-' . $p['idcargosocupados']]->varauxconfformassistemaspago[$arr[1]];
                                    }else{
                                        $s->error = "El valor de la variable no se encuentra registrado a la hora de elaborar pago.";
                                        $arrValInd[$i] = $s;
                                    }
                                }else{//Forma de entrada por reporte
                                    $v = $this->buscarEnReportes($p['idpersona'], $objConfPer->variables[$arr[1]]->idconfreportescertificaciones, $objConfPer->variables[$arr[1]]->idvariablesconfreportescertificaciones);
                                    $arrValInd[$i] = $v;
                                }
                                break;
                            }
                            case 'CPDT': {
                                $v = $this->buscarValorConceptoPDtarifa($arr[1], $p, $idtarifa, $conceptopd);
                                if(gettype($v) == "object"){//Si la persona no se le ha configurado el concepto se pone en 0 para poder calcular otros conceptos
                                    $arrValInd[$i] = 0;
                                    $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->errorcpd[$conceptopd] = $v;
                                }else{
                                    $arrValInd[$i] = $v;
                                }
                                $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->cpd[$conceptopd] = $arrValInd[$i];

                                break;
                            }
                            case 'CRM': {
                                $v = $this->calcularConceptoRM($arr[1], $p);
                                $arrValInd[$i] = $v;
                                break;
                            }
                            case 'VG': {
                                if(array_key_exists($arr[1], $this->datosVariablesGlobales->sistema)){
                                    $arrValInd[$i] = $this->datosVariablesGlobales->sistema[$arr[1]];
                                }else if(array_key_exists($arr[1], $this->datosVariablesGlobales->entidad)){
                                    $arrValInd[$i] = $this->datosVariablesGlobales->entidad[$arr[1]];
                                }else if(array_key_exists($arr[1], $this->datosVariablesGlobales->cargo)){
                                    $arrValInd[$i] = $this->datosVariablesGlobales->cargo[$arr[1]];
                                }else{
                                    $s->error = "La variable global no existe.";
                                    $arrValInd[$i] = $s;
                                }
                                break;
                            }
                            case 'SPC': {
                                $arrValInd[$i] = $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->spc;
                                break;
                            }
                        }
                    }
                    //Conformo el arreglo de indicadores con valores
                    $arrValores = array();

                    foreach($arrValInd as $i => $v) {
                        if(gettype($v) == "object"){
                            $arrValores[] = array('idindicador' => $i, 'valor' => 0);
                        }else{
                            $arrValores[] = array('idindicador' => $i, 'valor' => $v);
                        }
                    }

                    $valorConceptoPago = $this->ioc->comun->EvaluarExpresionMatematica($objConfPer->idexpresionmatematica, $arrValores);
                    $val = $valorConceptoPago->valor;
                    return $val;
                }
            }else{
                $s->error = "El per&iacute;odo de pago no se encuentra configurado.";
                return $s;
            }
        }
    }

    /*
	 * Devuelve el valor o dato que se le puso a la persona en el reporte vigente
	 * */
    private function buscarEnReportes ($idpersona, $idconfreportescertificaciones, $idvariablesconfreportescertificaciones)
    {
        $objRepCert = new DatReportesCertificaciones();
        $arr = $objRepCert->ValorReporteCertificacionesNomina($idconfreportescertificaciones, $idvariablesconfreportescertificaciones, $idpersona, $this->modopago, $this->fechainicioperiodo, $this->fechafinperiodo, $this->mesanyopago);
        /*if($idpersona == 1018422){
		 print_r($arr);die;
		}*/
        if(count($arr) > 0){
            if(array_key_exists($idvariablesconfreportescertificaciones, $this->arrIdVarParaPeriodosVacaciones)){/*Aki verifico si la variable fue configurada en*/
                //return $this->arrPeriodosVac[$arr[0]['valor']]->tiempodescontar ; 												/*las variables por tipo  de reportes y ceertificaciones para la liquidacion de vacaciones*/
                return $arr[0]['valor'];                                                /*las variables por tipo  de reportes y ceertificaciones para la liquidacion de vacaciones*/
            }else{
                //Aqui va el codigo para calcular en caliente la antiguedad de las personas a partir del valor inicial q trae el reporte de antiguedad. 
                /*if($idconfreportescertificaciones==21){
				//$fechaactual = date('Y-m-d');
				$fechaactualDateTime = new DateTime('2014-01-27');
				$fechaactualDateTime->add(new DateInterval('P10D'));
  			    print_r($fechaactualDateTime);die;
				$tomorrow = new DateTime('2014-01-28');
				$intervalo = $fechaactualDateTime->diff($tomorrow);
   			    print_r($intervalo);die;
   			    }*/
                return $arr[0]['valor'];
            }
        }else{
            $s->error = "La persona no se encuentra en un reporte vigente.";
            return $s;
        }

    }

    /*
	 * Devuelve el valor del concepto de Percepcion y Descuento con tarifa
	 * */
    private function buscarValorConceptoPDtarifa ($idconceptopdtarifa, $p, $idtarifa, $conceptopd)
    {
        $objConceptoPDTarifa = null;
        if($idconceptopdtarifa != null){//idconceptotarifa
            $objConceptoPDTarifa = Doctrine::getTable('NomConceptoPDTarifa')->find($idconceptopdtarifa);
        }else{//Busco el conceptopdtarifa
            $objConceptoPDTarifa = NomConceptoPDTarifa::obtenerTarifaXConceptoPDObj($idtarifa, $conceptopd);
        }

        if(array_key_exists($objConceptoPDTarifa->idconceptopercepciondescuento, $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->cpd)){
            return $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->cpd[$objConceptoPDTarifa->idconceptopercepciondescuento];
        }else{
            if($objConceptoPDTarifa->idformacalculo == 1){//Importe fijo
                $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->cpd[$objConceptoPDTarifa->idconceptopercepciondescuento] = $objConceptoPDTarifa->importe;
                return $objConceptoPDTarifa->importe;
            }else if($objConceptoPDTarifa->idformacalculo == 2){//Formula
                $arrIndFormula = $this->ioc->comun->ObtenerarrIdIndicadoresporExpresionMatematica($objConceptoPDTarifa->idformula);

                $arrValInd = array();
                foreach($arrIndFormula as $k => $i) {
                    $arr = explode('_', $i);
                    switch ($arr[0]) {
                        case 'CRM': { /*Concepto de retribucion monetaria*/
                            $v = $this->calcularConceptoRM($arr[1], $p);
                            $arrValInd[$i] = $v;
                            break;
                        }
                        case 'VG': {/*Variable global*/
                            if(array_key_exists($arr[1], $this->datosVariablesGlobales->sistema)){
                                $arrValInd[$i] = $this->datosVariablesGlobales->sistema[$arr[1]];
                            }else if(array_key_exists($arr[1], $this->datosVariablesGlobales->entidad)){
                                $arrValInd[$i] = $this->datosVariablesGlobales->entidad[$arr[1]];
                            }else if(array_key_exists($arr[1], $this->datosVariablesGlobales->cargo)){
                                $arrValInd[$i] = $this->datosVariablesGlobales->cargo[$arr[1]];
                            }else{
                                $s->error = "La variable global no existe.";
                                $arrValInd[$i] = $s;
                            }
                            break;
                        }
                        case 'SPC': {/*Sueldo por cargo*/
                            $arrValInd[$i] = $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->spc;
                            break;
                        }
                        case 'RET': {/*Retenciones que se aplican a la persona*/
                            //if ($this->seCalcularonRetenciones[$p['idpersona']][$p['idcargosocupados']] == 2) {
                            //if ($this->arrCondicionRetenciones != null) {
                            // if (array_key_exists($p['idpersona'], $this->arrValoresRetencionesPersona)) {
                            if(array_key_exists($p['idpersona'], $this->arrValoresRetencionesPersona)){
                                /*if ($this->arrCondicionRetenciones['secumplesiempre'] == 1) {
                                    $this->CalcularRetPersona($p);
                                } else {*/
                                // if ($this->calcularFormulaSiseCumpleoLimiteRetenciones($p, 1)) {
                                $this->CalcularRetPersona($p);
                                //}
                                //}
                            }
                            // }
                            //}
                            $sumaRet = 0.00;
                            foreach($this->arrValoresRetencionesPersona[$p['idpersona']] as $jr => $retencion) {
                                if($retencion->comoretener[$p['idcargosocupados']] != -1){
                                    $sumaRet = $sumaRet + +$this->calcularMensualidadRetencion($p, $jr, $retencion->comoretener[$p['idcargosocupados']]);
                                }
                            }
                            $arrValInd[$i] = $sumaRet;
                            break;
                        }
                        case 'VAC': {/*Promedio de lo que se paga diario de acuerdo al submayor de vacaciones*/
                            $arrValInd[$i] = $this->arrPersonasSubMayorVac[$p['idpersona']][$p['idpersona'] . '-' . $p['idcargosocupados']]->promedio;
                            break;
                        }

                    }
                }

                //Conformo el arreglo de indicadores con valores
                $arrValores = array();
                foreach($arrValInd as $i => $v) {
                    if(gettype($v) == "object"){
                        $arrValores[] = array('idindicador' => $i, 'valor' => 0);
                    }else{
                        $arrValores[] = array('idindicador' => $i, 'valor' => $v);
                    }
                }

                $valorConceptoPago = $this->ioc->comun->EvaluarExpresionMatematica($objConceptoPDTarifa->idformula, $arrValores);
                return $valorConceptoPago->valor;

            }else if($objConceptoPDTarifa->idformacalculo == 3){//Escala de valores
                $rEstEsc = $this->estructuraEscalarConcepto($objConceptoPDTarifa->idconceptopdtarifa);
                $cant = count($rEstEsc);
                if($cant == 1 && $rEstEsc[0]['nivel'] == 1){
                    $valor = $this->calcularEscalaConceptoPD($p, $rEstEsc[0], null, $objConceptoPDTarifa->idconceptopercepciondescuento);
                }else if($cant > 1 && $rEstEsc[0]['nivel'] == 1){
                    $an1 = $rEstEsc[0];
                    $an2 = null;
                    for($i = 1; $i < $cant; $i++) {
                        if($rEstEsc[$i]['idestructuraescalaradyacente'] == $rEstEsc[0]['idestructuraescalar']){
                            $an2 = $rEstEsc[$i];
                            break;
                        }
                    }
                    $valor = $this->calcularEscalaConceptoPD($p, $an1, $an2, $objConceptoPDTarifa->idconceptopercepciondescuento);

                }else if($rEstEsc[0]['nivel'] != 1){
                    $valor->error = "La escala del concepto de PD est&aacute; mal configurada.";
                }

                return $valor;
            }
        }

    }

    /*
	 * Cargo la estructura escalar del concepto de percepcion y descuento
	 * */
    private function estructuraEscalarConcepto ($idconceptopdtarifa)
    {
        $sql = "select ee.idestructuraescalar, ee.nivel, ee.idtipoentrada, ee.idconfreportescertificaciones, ee.idvariablesconfreportescertificaciones,dee.idestructuraescalaradyacente
					from mod_nomina.nom_estructuraescalar ee
					left join mod_nomina.nom_dependenciaestructuraescalar dee on (dee.idestructuraescalar = ee.idestructuraescalar)
					where ee.idconceptopdtarifa = ?  order by ee.nivel;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $rEstEsc = $conn->fetchAll($sql, array($idconceptopdtarifa));
        return $rEstEsc;
    }

    /*
	 * Calcula el valor de la escala que le corresponde a la persona
	 * */
    private function calcularEscalaConceptoPD ($p, $arrNivel1, $arrNivel2, $idconceptopercepciondescuento)
    {
        $idtipopago = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->idtipopago;
        $idsistemapago = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->idsistemapago;
        $objConfCon = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->tsp[$idtipopago . '-' . $idsistemapago]->conceptopd[$idconceptopercepciondescuento];

        $valor = null;
        if(is_array($arrNivel1) && is_null($arrNivel2)){
            if($arrNivel1['idtipoentrada'] == 1){//Reporte
                $valorRep = $this->buscarEnReportes($p['idpersona'], $arrNivel1['idconfreportescertificaciones'], $arrNivel1['idvariablesconfreportescertificaciones']);
                if($objConfCon->idescalatarifa != -1){
                    $valor = $this->valorEscalaConceptoPD(1, 1, $arrNivel1['idestructuraescalar'], $objConfCon->idescalatarifa, $valorRep);
                }else{
                    $s->error = "La persona no tiene asignada una escala.";
                    $valor = $s;
                }

            }else if($arrNivel1['idtipoentrada'] == 3 || $arrNivel1['idtipoentrada'] == 4){//Seleccionable al cargo y a la persona
                if($objConfCon->idescalatarifa != -1){
                    $valor = $this->valorEscalaConceptoPD(2, 1, $arrNivel1['idestructuraescalar'], $objConfCon->idescalatarifa, null);
                }else{
                    $s->error = "La persona no tiene asignada una escala.";
                    $valor = $s;
                }

            }

        }else if(is_array($arrNivel1) && is_array($arrNivel2)){

            if($arrNivel1['idtipoentrada'] == 1){//Reporte
                $valorRep = $this->buscarEnReportes($p['idpersona'], $arrNivel1['idconfreportescertificaciones'], $arrNivel1['idvariablesconfreportescertificaciones']);
                if(gettype($valorRep) != "object"){
                    if($objConfCon->idescalatarifa != -1){
                        $valor = $this->valorEscalaConceptoPD(1, 2, $arrNivel2['idestructuraescalar'], $objConfCon->idescalatarifa, $valorRep);
                    }else{
                        $s->error = "La persona no tiene asignada una escala.";
                        $valor = $s;
                    }

                }else{
                    $valor = $valorRep;
                }
            }else if($arrNivel1['idtipoentrada'] == 3 || $arrNivel1['idtipoentrada'] == 4){//Seleccionable al cargo y a la persona
                if($objConfCon->idescalatarifa != -1){
                    $valor = $this->valorEscalaConceptoPD(2, 2, $arrNivel2['idestructuraescalar'], $objConfCon->idescalatarifa, null);
                }else{
                    $s->error = "La persona no tiene asignada una escala.";
                    $valor = $s;
                }

            }
        }else{
            $s->error = "La escala del concepto de PD est&aacute; mal configurada.";
            $valor = $s;
        }
        return $valor;

    }

    /*
	 * Genero el sql y mando a buscar las escalas
	 * Tipo = 1 - Se busca en los valores de la escala en dependencia del operador
	 * Tipo = 2 - Se busca el valor de la escala que se selecciono para el cargo o para la persona
	 * Nivel = 1 - Una sola estructura escalar
	 * Nivel = 2 - Mas de una estructura escalar
	 * */
    private function valorEscalaConceptoPD ($tipo, $nivel, $idestructuraescalar, $idescalatarifa, $valorAbuscar)
    {
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();

        if($tipo == 1 && $nivel == 1){
            $sql = "SELECT * FROM mod_nomina.nom_escalatarifa WHERE idestructuraescalar = ?;";
            $rET = $conn->fetchAll($sql, array($idestructuraescalar));
            $valorET = $this->devolverValorEscalaConcepto($rET, $valorAbuscar);
        }else if($tipo == 2 && ($nivel == 1 || $nivel == 2)){
            $sql = "SELECT * FROM mod_nomina.nom_escalatarifa WHERE idescalatarifa = ?;";
            $rET = $conn->fetchAll($sql, array($idescalatarifa));
            $valorET = (count($rET) > 0 ? $rET [0] : null);
        }else if($tipo == 1 && $nivel == 2){
            $sql = "SELECT * FROM mod_nomina.nom_escalatarifa WHERE idpadre = ?;";
            $rET = $conn->fetchAll($sql, array($idescalatarifa));
            $valorET = $this->devolverValorEscalaConcepto($rET, $valorAbuscar);
        }

        if(is_array($valorET)){
            if($valorET['idformacalculo'] == 1){//Importe fijo
                return $valorET['importe'];
            }else{//Formula
                return 0;/*Por ahora devuelve 0 y esperamos a la proxima iteracion del componente*/
            }
        }else{
            return $valorET;
        }
    }

    /*
	 * Devuelvo el valor en dependencias de las escalas de la persona
	 * */
    private function devolverValorEscalaConcepto ($arrEscalaTarifa, $valorABuscar)
    {
        foreach($arrEscalaTarifa as $k => $et) {
            switch ($et['idoperadorcomparacion']) {
                case 1: {//Igual
                    if($et['valorinicial'] == $valorABuscar) return $et;
                    break;
                }
                case 2: {//Menor
                    if($valorABuscar < $et['valorinicial']) return $et;
                    break;
                }
                case 3: {//Mayor
                    if($valorABuscar > $et['valorinicial']) return $et;
                    break;
                }
                case 4: {//Mayor igual
                    if($valorABuscar >= $et['valorinicial']) return $et;
                    break;
                }
                case 5: {//Menor igual
                    if($valorABuscar <= $et['valorinicial']) return $et;
                    break;
                }
                case 6: {//Rango de valores incluyentes
                    if($valorABuscar >= $et['valorinicial'] && $valorABuscar <= $et['valorfinal']) return $et;
                    break;
                }
                case 7: {//Rango de valores excluyentes
                    if($valorABuscar > $et['valorinicial'] && $valorABuscar < $et['valorfinal']) return $et;
                    break;
                }
            }
        }
        $s->error = "El valor no se encuentra en la configuraci&oacute;n de la escala.";
        return $s;
    }

    /*
	 * Calcula el concepto de Retribucion Monetaria que le corresponde a la persona
	 * */
    private function calcularConceptoRM ($idconceptorm, $p)
    {
        if(array_key_exists($idconceptorm, $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->crm)){
            return $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->crm[$idconceptorm];
        }

        $idtipopago = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->idtipopago;
        $idsistemapago = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->idsistemapago;
        //print_r($this->sedesglosa);die;
        if($this->sedesglosa != 1){
            $idsistemapago = null; //Se pone a null porque los tipos de pagos que no se desglosan no tienen sistemas de pagos
        }
        $key = $idtipopago . '-' . $idsistemapago;
        //print_r($this->confConceptosRM);die;
        if(array_key_exists($key, $this->confConceptosRM)){
            if(array_key_exists($idconceptorm, $this->confConceptosRM[$key])){

                //Calculo los indicadores de la expresion matematica del concepto
                $arrValInd = array();

                foreach($this->confConceptosRM[$key][$idconceptorm]->indicadoresexpmat as $k => $i) {

                    $arr = explode('_', $i);
                    //print_r($arr);die;
                    switch ($arr[0]) {
                        case 'CPD': { /*Concepto de PD*/
                            $idperiodopago = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->tsp[$key]->conceptopd[$arr[1]]->idperiodopago;
                            $idtarifa = $this->arrConfElemSalarialesConceptosPersona[$p['idpersona'] . '-' . $p['idcargosocupados']]->tsp[$key]->conceptopd[$arr[1]]->idtarifa;
                            $valor = $this->calcularConceptoPago($p, $idtipopago, $idsistemapago, $idperiodopago, $idtarifa, $arr[1]);
                            $arrValInd[$i] = $valor;
                            break;
                        }
                        case 'CRM': { /*Concepto de RM*/
                            $v = $this->calcularConceptoRM($arr[1], $p);
                            //print_r($v);die;
                            $arrValInd[$i] = $v;
                            break;
                        }
                        case 'VG': { /*Variable global*/
                            if(array_key_exists($arr[1], $this->datosVariablesGlobales->sistema)){
                                $arrValInd[$i] = $this->datosVariablesGlobales->sistema[$arr[1]];
                            }else if(array_key_exists($arr[1], $this->datosVariablesGlobales->entidad)){
                                $arrValInd[$i] = $this->datosVariablesGlobales->entidad[$arr[1]];
                            }else if(array_key_exists($arr[1], $this->datosVariablesGlobales->cargo)){
                                $arrValInd[$i] = $this->datosVariablesGlobales->cargo[$arr[1]];
                            }else{
                                $s->error = "La variable global no existe.";
                                $arrValInd[$i] = $s;
                            }
                            break;
                        }
                        case 'SPC': {
                            $arrValInd[$i] = $this->arrValoresColumnas[$p['idpersona'] . '-' . $p['idcargosocupados']]->spc;
                            break;
                        }
                        case 'RET': {/*Sueldo por cargo*/
                            // if ($this->seCalcularonRetenciones[$p['idpersona']][$p['idcargosocupados']] == 2) {
                            //if ($this->arrCondicionRetenciones != null) {
                            if(array_key_exists($p['idpersona'], $this->arrValoresRetencionesPersona)){
                                /*if ($this->arrCondicionRetenciones['secumplesiempre'] == 1) {
                                    $this->CalcularRetPersona($p);
                                } else {
                                    if ($this->calcularFormulaSiseCumpleoLimiteRetenciones($p, 1)) {*/
                                $this->CalcularRetPersona($p);
                                //}
                                //}
                            }
                            // }
                            //}
                            $sumaRet = 0.00;
                            foreach($this->arrValoresRetencionesPersona[$p['idpersona']] as $jr => $retencion) {
                                if($retencion->comoretener[$p['idcargosocupados']] != -1){
                                    $sumaRet = $sumaRet + $this->calcularMensualidadRetencion($p, $jr, $retencion->comoretener[$p['idcargosocupados']]);
                                }
                            }
                            $arrValInd[$i] = $sumaRet;
                            break;
                        }
                        case 'VAC': {/*Promedio de vacaciones de un persona en dependencia del submayor de vacaciones*/
                            $arrValInd[$i] = $this->arrPersonasSubMayorVac[$p['idpersona']][$p['idpersona'] . '-' . $p['idcargosocupados']]->promedio;
                            break;
                        }
                    }
                }
            }else{
                $s->error = "El concepto de la retribuci&oacute;n monetaria no se encuentra configurado.";
                return $s;
            }
        }else{
            $s->error = "El concepto de la retribuci&oacute;n monetaria no se encuentra configurado para el tipo y sistema de pago de la persona.";
            return $s;
        }


        //Conformo el arreglo de indicadores con valores
        $arrValores = array();
        foreach($arrValInd as $i => $v) {
            if(gettype($v) == "object"){
                $arrValores[] = array('idindicador' => $i, 'valor' => 0);
            }else{
                $arrValores[] = array('idindicador' => $i, 'valor' => $v);
            }
        }
        if($idconceptorm == 18){
            //Buscar la situacion de la persona
            $sqlSit = "select cop.idsituacionlaboral from mod_nomina.dat_cargosocupados cop 
		  		   inner join mod_persona.dat_persona dp on (dp.idpersona = cop.idpersona)
				   where cop.idpersona = ? and cop.idcargosocupados = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $situacionpersona = $conn->fetchAll($sqlSit, array($p['idpersona'], $p['idcargosocupados']));
        }
        if($situacionpersona[0]['idsituacionlaboral'] == 19){
            //Buscando el sueldo por cargo civil
            $sqlImporteCivil = "select confc.importe from mod_nomina.conf_elementosalarialcargo confc 
		  		   inner join mod_nomina.dat_cargosocupados cop on (cop.idcargo = confc.idcargo)
				   inner join mod_persona.dat_persona dp on (dp.idpersona = cop.idpersona)
		  		   where cop.idpersona = ? and cop.idcargosocupados = ?;";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            $importecivil = $conn->fetchAll($sqlImporteCivil, array($p['idpersona'], $p['idcargosocupados']));

            foreach($arrValores as $con => $elem) {
                if($elem['idindicador'] == "SPC"){
                    $arrValores[$con]['valor'] = $importecivil[0]['importe'];
                }
            }
        }

        try {
            $valorConceptoRM = $this->ioc->comun->EvaluarExpresionMatematica($this->confConceptosRM[$key][$idconceptorm]->idexpresionmatematica, $arrValores);

        } catch (Exception $e) {
            throw $e;
        }
        return $valorConceptoRM->valor;
    }

    /*
	 * Devuelve la configuracion de la liquidacion y acumulacion en el submayor de vacaciones
	 * */
    private function obtenerConfiguracionAcumulacionLiquidacionVacaciones ()
    {
        $objVac = new DatVacacionesVariables();
        $r = $objVac->obtenerConfAcumulacionLiquidacion();
        foreach($r as $k => $v) {
            $this->confAcumLiqVac[$v['idvacacionesvariables']]->id = $v['idvacacionesvariables'];
            $this->confAcumLiqVac[$v['idvacacionesvariables']]->denominacion = $v['denominacion'];
            $this->confAcumLiqVac[$v['idvacacionesvariables']]->idexpresionmatematica = $v['idexpresionmatematica'];
            $this->confAcumLiqVac[$v['idvacacionesvariables']]->indicadoresexpmat = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($v['idexpresionmatematica']);
            //$this->confAcumLiqVac[$v['idvacacionesvariables']]->indicadoresexpmat = $this->ioc->comun->ObtenerarrIdIndicadoresporExpresionMatematica($v['idexpresionmatematica']);
            $this->confAcumLiqVac[$v['idvacacionesvariables']]->indicadoresexpmat = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($v['idexpresionmatematica']);
            //$this->confAcumLiqVac[$v['idvacacionesvariables']]->indicadoresexpmat = $this->ioc->pvd->ObtenerarrIdIndicadoresporExpresionMatematica($v['idexpresionmatematica']);
        }
        //print_r($this->confAcumLiqVac);die;
    }

    /*
	 * Devuelve la configuracion de las variables auxiliares que se usan en el calculo de la acumulacion y liquidacion en el submayor de vacaciones
	 * */
    private function obtenerConfVariablesFormulaAcumulacionLiquidacionVacaciones ()
    {
        $sql = "select * from mod_nomina.dat_variablesformulavacacionesvariables;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql);
        foreach($r as $k => $v) {
            $this->arrVarAcumLiqVac[$v['idvariablesformulavacacionesvariables']]->id = $v['idvariablesformulavacacionesvariables'];
            $this->arrVarAcumLiqVac[$v['idvariablesformulavacacionesvariables']]->formaentrada = $v['formaentrada'];
            $this->arrVarAcumLiqVac[$v['idvariablesformulavacacionesvariables']]->idvariablesconfreportescertificaciones = $v['idvariablesconfreportescertificaciones'];
            $this->arrVarAcumLiqVac[$v['idvariablesformulavacacionesvariables']]->idconfreportescertificaciones = $v['idconfreportescertificaciones'];
        }
    }

    /*
	 * Devuelve la configuracion de los periodos de vacaciones
	 * */
    private function obtenerPeriodosVacaciones ()
    {
        $objPVac = new NomPeriodoVacaciones();
        $r = $objPVac->obtenerListadoPeriodoVacaciones(0, 10000);
        foreach($r as $k => $v) {
            $this->arrPeriodosVac[$v['idperiodovacaciones']]->id = $v['idperiodovacaciones'];
            $this->arrPeriodosVac[$v['idperiodovacaciones']]->tiempootorgar = $v['tiempootorgar'];
            $this->arrPeriodosVac[$v['idperiodovacaciones']]->tiempodescontar = $v['tiempodescontar'];
        }
    }

    /*
	 * Devuelve las personas que van a nomina y que estan iniciadas en el submayor de vacaciones
	 * */
    private function obtenerPersonasSubMayorVacaciones ($identidad, $arrPerVanAlaNomina)
    {
        $objVac = new DatVacacionesPersona();
        $objHisVacPer = new HisVacacionesPersona();
        $arrPersonas = null;
        foreach($arrPerVanAlaNomina as $k => $p) {
            $arrPersonas[] = $p['idpersona'];
        }
        if($arrPersonas != null){
            $arrPersonas = array_unique($arrPersonas);
        }

        $r = $objVac->obtenerPersonasHanIniciadoSubMayorVac($identidad, $arrPersonas);
        //print_r($arrPerVanAlaNomina);die;
        foreach($r as $k => $v) {
            foreach($arrPerVanAlaNomina as $j => $p) {
                if($v['idpersona'] == $p['idpersona']){
                    $this->arrPersonasSubMayorVac[$v['idpersona']][$j]->idvacacionespersona = $v['idvacacionespersona'];

                    $arrUltOperacion = $objHisVacPer->obtenerUltimaOperacionSubMayor($v['idvacacionespersona']);
                    if(count($arrUltOperacion) > 0){
                        $saldoentiempo = $arrUltOperacion[0]['saldoentiempo'];
                        $saldoenimporte = $arrUltOperacion[0]['saldoenimporte'];
                    }else{
                        $saldoentiempo = $v['tiempoacumuladoinicial'];
                        $saldoenimporte = $v['importeacumuladoinicial'];
                    }
                    $this->arrPersonasSubMayorVac[$v['idpersona']][$j]->tiempo = $saldoentiempo;
                    $this->arrPersonasSubMayorVac[$v['idpersona']][$j]->importe = $saldoenimporte;
                    if($saldoentiempo > 0){
                        $vac = $saldoenimporte / $saldoentiempo;
                    }else{
                        $vac = 0.00;
                    }
                    $this->arrPersonasSubMayorVac[$v['idpersona']][$j]->promedio = round($vac, 2);

                    $this->arrPersonasSubMayorVac[$v['idpersona']][$j]->idpersona = $v['idpersona'];
                    $this->arrPersonasSubMayorVac[$v['idpersona']][$j]->tiempoacumuladoinicial = $v['tiempoacumuladoinicial'];
                    $this->arrPersonasSubMayorVac[$v['idpersona']][$j]->importeacumuladoinicial = $v['importeacumuladoinicial'];
                    $this->arrPersonasSubMayorVac[$v['idpersona']][$j]->importeacumulado = 0.00;
                    $this->arrPersonasSubMayorVac[$v['idpersona']][$j]->tiempoacumulado = 0.00;
                }
            }
        }
        $arrfinal = $this->arrPersonasSubMayorVac;//print_r($arrfinal);die;
        return $arrfinal;
        //print_r($this->arrPersonasSubMayorVac);die;
    }

    /*
	 * Calcula el acumulado de vacaciones en tiempo e importe de las personas que van a la nomina y tienen inicializado el submayor
	 * */
    private function calcularAcumuladoVacaciones ()
    {
        //print_r($this->arrPersonasSubMayorVac);die;
        //print_r($this->arrPersonasSubMayorVac);die;
        foreach($this->arrPersonasSubMayorVac as $j => $p) {
            foreach($p as $k => $pv) {
                $valorTiempo = $this->calcularFormulaVacaciones($k, $this->confAcumLiqVac[1]->idexpresionmatematica, $this->confAcumLiqVac[1]->indicadoresexpmat);
                //print_r($this->confAcumLiqVac[2]);die;
                $valorImporte = $this->calcularFormulaVacaciones($k, $this->confAcumLiqVac[2]->idexpresionmatematica, $this->confAcumLiqVac[2]->indicadoresexpmat);
                //print_r($valorTiempo.'--------'.$valorImporte);die;

                $this->arrPersonasSubMayorVac[$j][$k]->tiempoacumulado = round($valorTiempo, 2);
                $this->arrPersonasSubMayorVac[$j][$k]->importeacumulado = round($valorImporte, 2);

            }
        }

    }

    /*
	 * Devuelve el resultado de la formula de acumulacion / liquidacion de vacaciones
	 * */
    private function calcularFormulaVacaciones ($k, $idexpresionmatematica, $indicadoresexpmat)
    {

        //print_r($indicadoresexpmat);die; 
        $idtipopago = $this->arrConfElemSalarialesConceptosPersona[$k]->idtipopago;
        $idsistemapago = $this->arrConfElemSalarialesConceptosPersona[$k]->idsistemapago;

        $key = $idtipopago . '-' . $idsistemapago;
        $a = explode('-', $k);
        $pco['idpersona'] = $a[0];
        $pco['idcargosocupados'] = $a[1];
        $arrValInd = array();
        //print_r($indicadoresexpmat);die;
        foreach($indicadoresexpmat as $ind => $i) {
            $arr = explode('_', $i);
            switch ($arr[0]) {
                case 'CPD': {
                    //CALCULO EL CONCEPTO DE PD	
                    $idperiodopago = $this->arrConfElemSalarialesConceptosPersona[$k]->tsp[$key]->conceptopd[$arr[1]]->idperiodopago;
                    $idtarifa = $this->arrConfElemSalarialesConceptosPersona[$k]->tsp[$key]->conceptopd[$arr[1]]->idtarifa;
                    $valor = $this->calcularConceptoPago($pco, $idtipopago, $idsistemapago, $idperiodopago, $idtarifa, $arr[1]);
                    $arrValInd[$i] = $valor;
                    break;
                }
                case 'CRM': {
                    // print_r($arr[1]);die;
                    $valor = $this->calcularConceptoRM($arr[1], $pco);
                    //print_r($valor);die;
                    $arrValInd[$i] = $valor;
                    break;
                }
                case 'VG': {

                    if(array_key_exists($arr[1], $this->datosVariablesGlobales->sistema)){
                        $arrValInd[$i] = $this->datosVariablesGlobales->sistema[$arr[1]];

                    }else if(array_key_exists($arr[1], $this->datosVariablesGlobales->entidad)){

                        $arrValInd[$i] = $this->datosVariablesGlobales->entidad[$arr[1]];
                    }else if(array_key_exists($arr[1], $this->datosVariablesGlobales->cargo)){

                        $arrValInd[$i] = $this->datosVariablesGlobales->cargo[$arr[1]];
                    }else{

                        $s->error = "La variable global no existe.";
                        $arrValInd[$i] = $s;
                    }
                    break;
                }
                case 'SPC': {
                    $arrValInd[$i] = $this->arrValoresColumnas[$k]->spc;
                    break;
                }
                case 'VAV': {/*Variable auxiliar de las formulas para liquidar y acumular vacaciones*/
                    $formaentrada = $this->arrVarAcumLiqVac[$arr[1]]->formaentrada;

                    if($formaentrada == 1){//Forma de entrada manual
                        /*Esto queda por implementar cuando se itere la funcionalidad de elaborar pagos*/
                        $arrValInd[$i] = 0;
                    }else{//Forma de entrada por reporte
                        $val = $this->buscarEnReportes($pco['idpersona'], $this->arrVarAcumLiqVac[$arr[1]]->idconfreportescertificaciones, $this->arrVarAcumLiqVac[$arr[1]]->idvariablesconfreportescertificaciones);
                        $arrValInd[$i] = $val;

                    }
                    break;
                }
                case 'VAC': {
                    $arrValInd[$i] = $this->arrPersonasSubMayorVac[$pco['idpersona']][$k]->promedio;
                    break;
                }

            }
        }

        //Conformo el arreglo de indicadores con valores
        $arrValores = array();

        foreach($arrValInd as $i => $v) {
            if(gettype($v) == "object"){
                $arrValores[] = array('idindicador' => $i, 'valor' => 0);
            }else{
                $arrValores[] = array('idindicador' => $i, 'valor' => $v);
            }
        }
        //print_r($arrValores);die;
        try {
            // print_r($arrValores);die;
            $valorVacaciones = $this->ioc->comun->EvaluarExpresionMatematica($idexpresionmatematica, $arrValores);
        } catch (Exception $e) {
            throw $e;
        }

        return $valorVacaciones->valor;
    }

    /*
	 * Calcula la liquidacion de vacaciones en tiempo e importe de las personas que van a la nomina y tienen inicializado el submayor
	 * */
    private function calcularLiquidacionVacaciones ()
    {
        //print_r($this->arrPersonasSubMayorVac);die;
        foreach($this->arrPersonasSubMayorVac as $j => $p) {
            foreach($p as $k => $pv) {
                $valorTiempo = $this->calcularFormulaVacaciones($k, $this->confAcumLiqVac[3]->idexpresionmatematica, $this->confAcumLiqVac[3]->indicadoresexpmat);
                $valorImporte = $this->calcularFormulaVacaciones($k, $this->confAcumLiqVac[4]->idexpresionmatematica, $this->confAcumLiqVac[4]->indicadoresexpmat);

                $this->arrPersonasSubMayorVac[$j][$k]->tiempoacumulado = round($valorTiempo, 2);
                $this->arrPersonasSubMayorVac[$j][$k]->importeacumulado = round($valorImporte, 2);

            }
        }
    }

    /*FUNCION SECUNDARIA DONDE SE VERIFICA QUE LA NOMINA CONTENGA PERSONAS*/
    public function verificarPersonasNomina ($identidad, $idelaborarpago, $idtipopago, $idnomina, $idplantillanominal, $idconfmodelonomina, $cajacajero)
    {
        $this->ioc = ZendExt_IoC_Inter::getInstance();
        $objTipoPago = Doctrine::getTable('NomTipoPago')->find($idtipopago);
        $this->sedesglosa = $objTipoPago->sedesglosa;
        $arrNominas = array();

        //Busco el tipo de moneda de esta nomina
        $sqltipomoneda = "select ntn.tipomoneda  from mod_nomina.nom_tiponomina ntn 
			                  inner join mod_nomina.conf_modelonomina cmn on(cmn.idtiponomina = ntn.idtiponomina)    
						      where cmn.idconfmodelonomina = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrtipomoneda = $conn->fetchAll($sqltipomoneda, array($idconfmodelonomina));
        $tipomoneda = $arrtipomoneda[0]['tipomoneda'];
        //Busco todas las personas dentro del periodo de pago seleccionado que tengan esas categorias
        $objPerElaborarPago = new DatPersonaElaborarPagos(); /*OBJETO*/
        $arrPer = $objPerElaborarPago->obtenerPersonaElaborarPagosporCategoriasdePersonas($idelaborarpago);
        if(count($arrPer) > 0){
            //Convierto el arreglo de personas del periodo de pago a un arreglo unidimensional
            $arrPersPerPago = array();
            foreach($arrPer as $i => $p) {
                $arrPersPerPago[] = $p['idpersona'];
            }
            //Elimino los id de personas repetidos
            $arrPersPerPago = array_unique($arrPersPerPago);
            //Busco todas las personas que forman parte de la plantilla nominal que se les paga por caja o cajero
            $objPlantCargos = new ConfPlantillaNominalCargo();/*OBJETO*/
            $arrPerPlantCargos = $objPlantCargos->obtenerPersonaPlantillaOcupanCargosCajeroCaja($idplantillanominal, $cajacajero, $tipomoneda);
            //Busco todas las personas que tienen situacion laboral pero no tienen cargo en la entidad
            $objCargosOcupados = new DatCargosOcupados();/*OBJETO*/
            $arrPerSinCargosConSituacion = $objCargosOcupados->obtenerPersonasNoOcupanCargosContenidasEnArr($identidad, $idplantillanominal, $cajacajero, $arrPersPerPago, $tipomoneda);

            $c1 = count($arrPerPlantCargos);
            $c2 = count($arrPerSinCargosConSituacion);


            //Si hay personas que ocupan cargos en la entidad y si tienen situacion laboral sin cargo
            if($c1 > 0 || $c2 > 0){

                //Verifico que las personas que forman parte de la plantilla nominal esten en el periodo de pago
                $arrPOCVerificadas = array();
                foreach($arrPerPlantCargos as $i => $p) {
                    foreach($arrPer as $j => $pp) {
                        if($p['idpersona'] == $pp['idpersona'] && $p['idcargosocupados'] == $pp['idcargosocupados']){
                            $arrPOCVerificadas[$p['idpersona'] . '-' . $p['idcargosocupados']] = $p;
                        }
                    }
                }
                $arrPerSinCarConSit = array();
                foreach($arrPerSinCargosConSituacion as $i => $p) {
                    $arrPerSinCarConSit[$p['idpersona'] . '-' . $p['idcargosocupados']] = $p;
                }

                //ARREGLO DE PERSONAS QUE VAN A LA NOMINA
                $arrPerVanAlaNomina = array_merge($arrPOCVerificadas, $arrPerSinCarConSit);//if(count($arrPerPlantCargos)>0){print_r($arrPerVanAlaNomina);die;}

                if(count($arrPerVanAlaNomina) <= 0){
                    return $arrNominas;
                }
            }else{
                return $arrNominas;
            }
        }else{
            return $arrNominas;
        }
        $arrNominas[0] = $idnomina;
        return $arrNominas;
    }

    public static function obtenerObj ($idnomina)
    {
        return Doctrine::getTable('DatNomina')->find($idnomina);
    }

    public static function getIdNomina ($idelaborarpago)
    {
        //Devolviendo la cantidad total de los salarios especificos.
        $query = new Doctrine_Query ();
        $result = $query->select('idnomina, idplantillanominal, idconfmodelonomina, cajacajero, numeronomina, aprobada')
            ->from('DatNomina')
            ->where("idelaborarpago=?", array($idelaborarpago))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public static function getIdElaboararpagos ($idnomina)
    {

        $sql = "select n.idnomina,dep.idelaborarpagos, nd.valores,nd.campos, tp.denominacion as tipopago, pp.denominacion as periodopago, dep.fechainicioperiodo, dep.fechafinperiodo
                    from  mod_nomina.dat_nomina n
                    inner join mod_nomina.dat_elaborarpagos dep on(dep.idelaborarpagos = n.idelaborarpago)
		            inner join mod_nomina.dat_nominadatos nd on (nd.idnomina = n.idnomina)
                    inner join mod_nomina.nom_tipopago tp on(tp.idtipopago = dep.idtipopago)
		            inner join mod_nomina.nom_periodopago pp on(pp.idperiodopago = dep.idperiodopago)
                    where(n.idnomina =	? );";

        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $r = $conn->fetchAll($sql, array($idnomina));
        return $r;
    }

    public static function getAllIdNomina ($idelaborarpago)
    {
        //Devolviendo la cantidad total de los salarios especificos.
        $query = new Doctrine_Query ();
        $result = $query->select('idnomina')
            ->from('DatNomina')
            ->where("idelaborarpago=?", array($idelaborarpago))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public static function getSinAprobarPorIdElaborarPago ($idelaborarpago)
    {
        //Devolviendo la cantidad total de los salarios especificos.
        $query = new Doctrine_Query ();
        $result = $query->select('idnomina')
            ->from('DatNomina')
            ->where("idelaborarpago=? and aprobada <> 0", array($idelaborarpago))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public static function getNominasAprobadasCertificadas ($idelaborarpago)
    {
        //Devolviendo la cantidad total de los salarios especificos.
        $query = new Doctrine_Query ();
        $result = $query->select('idnomina')
            ->from('DatNomina')
            ->where("(aprobada = 1 or aprobada = -1) and idelaborarpago=?", array($idelaborarpago))
            ->setHydrationMode(Doctrine::HYDRATE_ARRAY)
            ->execute();
        return $result;
    }

    public function obtenerDatosAnexo3 ($cargo, $idpersona, $idestructura)
    {
        $objAnexo3 = null;
        //$idpersona = 1000001111179;
        //Datos del salario escala
        $sqlSalarioEscala = "select elemsalcarg.importe as salarioescala, concelemsal.idconfconceptospdelementossalariales, concelemsal.idconceptopercepciondescuento from mod_nomina.conf_elementosalarialcargo elemsalcarg 
	                      left join mod_nomina.conf_conceptospdelementossalariales concelemsal on(concelemsal.idelementosalarialcargo = elemsalcarg.idelementosalarialcargo)
	                      where elemsalcarg.idcargo = ?;";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $arrSalarioEscala = $conn->fetchAll($sqlSalarioEscala, array($cargo));
        if(count($arrSalarioEscala) > 0){
            //Salario escaladel cargo
            $salarioescala = $arrSalarioEscala[0]['salarioescala'];
            $objAnexo3->Salario = number_format($salarioescala, 2, '.', '');
            //Conceptos del cargo
            /*$sqlConceptos = "select  concelemsal.idconfconceptospdelementossalariales,nomconc.idconceptopercepciondescuento, nomconc.abreviatura as denominacion from mod_nomina.nom_conceptopercepciondescuento nomconc 
                    left join mod_nomina.conf_conceptospdelementossalariales concelemsal on(concelemsal.idconceptopercepciondescuento = nomconc.idconceptopercepciondescuento)
                    left join mod_nomina.conf_elementosalarialcargo elemsalcarg on(elemsalcarg.idelementosalarialcargo = concelemsal.idelementosalarialcargo)
                    where elemsalcarg.idcargo = ".$cargo." 
                    union 
                    select  concelemsal.idconfconceptospdelementossalariales,nomconc.idconceptopercepciondescuento, nomconc.abreviatura as denominacion from mod_nomina.nom_conceptopercepciondescuento nomconc 
                    left join mod_nomina.conf_conceptospdelementossalariales concelemsal on(concelemsal.idconceptopercepciondescuento = nomconc.idconceptopercepciondescuento)
                    left join mod_nomina.conf_elementosalarialcargo elemsalcarg on(elemsalcarg.idelementosalarialcargo = concelemsal.idelementosalarialcargo)
                    where  nomconc.idconceptopercepciondescuento not in (select  nomconc.idconceptopercepciondescuento from mod_nomina.nom_conceptopercepciondescuento nomconc 
                    left join mod_nomina.conf_conceptospdelementossalariales concelemsal on(concelemsal.idconceptopercepciondescuento = nomconc.idconceptopercepciondescuento)
                    left join mod_nomina.conf_elementosalarialcargo elemsalcarg on(elemsalcarg.idelementosalarialcargo = concelemsal.idelementosalarialcargo)
                    where elemsalcarg.idcargo = ".$cargo.");";*/
            $sqlConceptos = "select  nomconc.idconceptopercepciondescuento, nomconc.abreviatura as denominacion from mod_nomina.nom_conceptopercepciondescuento nomconc 
		            inner join mod_nomina.conf_conceptopdxestructura ccpe on(ccpe.idconceptopd = nomconc.idconceptopercepciondescuento)
					where ccpe.idestructura = ?";
            $mg = Doctrine_Manager::getInstance();
            $conn = $mg->getCurrentConnection();
            //Arreglo de conceptos del cargo
            $arrConceptos = $conn->fetchAll($sqlConceptos, array($idestructura));
            if(count($arrConceptos) > 0){
                //Recorriendo los conceptos para calculas su importe
                foreach($arrConceptos as $i => $rconc) {
                    $sqlConceptoTarifa = "select nomconcpdtar.idconceptopdtarifa, nomconcpdtar.idformacalculo, nomconcpdtar.importe from mod_nomina.nom_conceptopdtarifa nomconcpdtar
	                      inner join mod_nomina.nom_conceptopercepciondescuento nomconc on(nomconc.idconceptopercepciondescuento = nomconcpdtar.idconceptopercepciondescuento)
	                      where nomconcpdtar.idconceptopercepciondescuento = ?;";
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();
                    //Arreglo de conceptos del cargo
                    $arrConceptoTarifa = $conn->fetchAll($sqlConceptoTarifa, array($rconc['idconceptopercepciondescuento']));
                    if(count($arrConceptoTarifa) > 0){
                        //Importe Fijo
                        if($arrConceptoTarifa[0]['idformacalculo'] == 1){
                            $flag = 0;
                            foreach($arrSalarioEscala as $csales => $rsalesc) {
                                if($rsalesc['idconceptopercepciondescuento'] == $rconc['idconceptopercepciondescuento']){
                                    $flag = 1;
                                }
                            }
                            if($flag == 0){
                                $objAnexo3->$rconc['denominacion'] = "0.00";
                            }else{
                                $objAnexo3->$rconc['denominacion'] = $arrConceptoTarifa[0]['importe'];
                            }
                            //Escala de Valores del Cargo
                        }else if($arrConceptoTarifa[0]['idformacalculo'] == 3){
                            $flag = 0;
                            $idconfconceptospdelementossalariales = 0;
                            foreach($arrSalarioEscala as $csales => $rsalesc) {
                                if($rsalesc['idconceptopercepciondescuento'] == $rconc['idconceptopercepciondescuento']){
                                    $flag = 1;
                                    $idconfconceptospdelementossalariales = $rsalesc['idconfconceptospdelementossalariales'];
                                }
                            }
                            if($flag = 0){
                                $objAnexo3->$rconc['denominacion'] = "0.00";
                            }else{
                                $sqlConfEscala = "select confesc.idconfescalaelementosalarial, confesc.idescalatarifa, confesc.importe from mod_nomina.conf_escalaelementosalarial confesc
	                      inner join mod_nomina.conf_conceptospdelementossalariales concelemsal on(concelemsal.idconfconceptospdelementossalariales = confesc.idconfconceptospdelementossalariales)
	                      where confesc.idconfconceptospdelementossalariales = ?;";
                                $mg = Doctrine_Manager::getInstance();
                                $conn = $mg->getCurrentConnection();
                                //Arreglo de conf escala del cargo
                                $arrConfEscala = $conn->fetchAll($sqlConfEscala, array($idconfconceptospdelementossalariales));
                                //Si la escala es "No seleccionable al cargo"
                                if($arrConfEscala[0]['importe'] == "0.00" || count($arrConfEscala) == 0){
                                    //Escala de la Persona			 
                                    $sqlConfEscalaPersona = "select confesc.idconfescalaelementosalarialpersona, confesc.idescalatarifa, confesc.importe from mod_nomina.conf_escalaelementosalarialpersona confesc
	                      inner join mod_nomina.conf_conceptospdelementossalariales concelemsal on(concelemsal.idconfconceptospdelementossalariales = confesc.idconfconceptospdelementossalariales)
	                      where confesc.idconfconceptospdelementossalariales = ?;";
                                    $mg = Doctrine_Manager::getInstance();
                                    $conn = $mg->getCurrentConnection();
                                    //Arreglo de conf escala de la persona
                                    $arrConfEscalaPersona = $conn->fetchAll($sqlConfEscalaPersona, array($idconfconceptospdelementossalariales));
                                    //Si tampoco tiene escala la persona ver si es por reporte
                                    if(count($arrConfEscalaPersona) == 0){
                                        $objAnexo3->$rconc['denominacion'] = "0.00";
                                    }else if($arrConfEscalaPersona[0]['importe'] == "0.00"){

                                        //Dame los hijos de la escala de la persona			 
                                        $sqlHijosConfEscalaPersona = "select nomesctar.idescalatarifa, nomesctar.valorescalar, nomesctar.idoperadorcomparacion,
    				      nomesctar.valorinicial, nomesctar.valorfinal, nomesctar.importe, estresc.idconfreportescertificaciones, estresc.idvariablesconfreportescertificaciones
 						  from mod_nomina.nom_escalatarifa nomesctar
						  inner join mod_nomina.nom_estructuraescalar estresc on(estresc.idestructuraescalar = nomesctar.idestructuraescalar)
	                      where estresc.idtipoentrada = 1  and nomesctar.idpadre = ?;";
                                        $mg = Doctrine_Manager::getInstance();
                                        $conn = $mg->getCurrentConnection();
                                        //Arreglo de conf escala de la persona
                                        $arrHijosConfEscalaPersona = $conn->fetchAll($sqlHijosConfEscalaPersona, array($arrConfEscalaPersona[0]['idescalatarifa']));
                                        //Si tiene hijos seleccionables al reporte buscamos el valor del reporte de la persona
                                        if(count($arrHijosConfEscalaPersona) > 0){
                                            $idconfreportescertificaciones = $arrHijosConfEscalaPersona[0]['idconfreportescertificaciones'];
                                            $idvariablesconfreportescertificaciones = $arrHijosConfEscalaPersona[0]['idvariablesconfreportescertificaciones'];
                                            //Sql que devuelve el valor del reporte
                                            $sqlValorReporte = "select dvar.valor from mod_nomina.dat_variableselementosreportescertificaciones dvar
						  inner join mod_nomina.dat_elementosreportescertificaciones delem on(delem.idelementosreportescertificaciones = dvar.idelementosreportescertificaciones)
						  inner join mod_nomina.dat_reportescertificaciones drep on(drep.idreportescertificaciones = delem.idreportescertificaciones)
	                      where drep.idconfreportescertificaciones = ? and dvar.idvariablesconfreportescertificaciones = ? and delem.idelemento = ? ;";
                                            $mg = Doctrine_Manager::getInstance();
                                            $conn = $mg->getCurrentConnection();
                                            //Arreglo con el valor del reporte
                                            $arrValorReporte = $conn->fetchAll($sqlValorReporte, array($idconfreportescertificaciones, $idvariablesconfreportescertificaciones, $idpersona));
                                            if(count($arrValorReporte) > 0){
                                                //Valor del reporte para una persona
                                                $reporte = $arrValorReporte[0]['valor'];
                                                //print_r($reporte);die;
                                                foreach($arrHijosConfEscalaPersona as $v => $hijesc) {
                                                    if($hijesc['idoperadorcomparacion'] == 1){
                                                        if($reporte == $hijesc['valorinicial']){
                                                            $objAnexo3->$rconc['denominacion'] = $hijesc['importe'];
                                                            break;
                                                        }
                                                    }else if($hijesc['idoperadorcomparacion'] == 2){
                                                        if($reporte < $hijesc['valorinicial']){
                                                            $objAnexo3->$rconc['denominacion'] = $hijesc['importe'];
                                                            break;
                                                        }
                                                    }else if($hijesc['idoperadorcomparacion'] == 3){
                                                        if($reporte > $hijesc['valorinicial']){
                                                            $objAnexo3->$rconc['denominacion'] = $hijesc['importe'];
                                                            break;
                                                        }
                                                    }else if($hijesc['idoperadorcomparacion'] == 4){
                                                        if($reporte >= $hijesc['valorinicial']){
                                                            $objAnexo3->$rconc['denominacion'] = $hijesc['importe'];
                                                            break;
                                                        }
                                                    }else if($hijesc['idoperadorcomparacion'] == 5){
                                                        if($reporte <= $hijesc['valorinicial']){
                                                            $objAnexo3->$rconc['denominacion'] = $hijesc['importe'];
                                                            break;
                                                        }
                                                    }else if($hijesc['idoperadorcomparacion'] == 6){

                                                        if($hijesc['valorinicial'] <= $reporte && $hijesc['valorfinal'] >= $reporte){
                                                            $objAnexo3->$rconc['denominacion'] = $hijesc['importe'];
                                                            break;
                                                            // print_r($objAnexo3);die;
                                                        }
                                                    }else if($hijesc['idoperadorcomparacion'] == 7){
                                                        if($hijesc['valorinicial'] < $reporte && $hijesc['valorfinal'] > $reporte){
                                                            $objAnexo3->$rconc['denominacion'] = $hijesc['importe'];
                                                            break;
                                                        }
                                                    }
                                                }
                                            }else{
                                                $objAnexo3->$rconc['denominacion'] = "0.00";
                                            }
                                            //print_r($objAnexo3);die;
                                        }else{
                                            //Si no tiene escalas seleccionables al reporte
                                            $objAnexo3->$rconc['denominacion'] = $arrConfEscalaPersona[0]['importe'];
                                        }
                                    }else{
                                        //Si tiene importe la escala de la persona
                                        $objAnexo3->$rconc['denominacion'] = $arrConfEscalaPersona[0]['importe'];
                                    }

                                }else{
                                    //Si la escala es "Seleccionable al cargo"
                                    $objAnexo3->$rconc['denominacion'] = $arrConfEscala[0]['importe'];
                                }
                            }
                        }
                    }
                }
                // print_r($objAnexo3);die;
            }
        }
        // print_r($objAnexo3);die;
        return $objAnexo3;
    }

    public function desaprobarNominas ($idelaborarpago)
    {
        $datNominaDatos = new DatNominaDatos();
        $sql = Doctrine_Query::create()
            ->select('idnomina')
            ->from('DatNomina')
            ->where('idelaborarpago = ?', array($idelaborarpago))
            ->fetchArray();
        foreach($sql as $in => $rn) {
            //Borrando nominadatos
            $rnominadatos = $datNominaDatos->obtenerIdDatosNominaArray($rn['idnomina']);
            foreach($rnominadatos as $ind => $rnd) {
                $objNominaDatosDelete = Doctrine::getTable('DatNominaDatos')->find($rnd['idnominadatos']);
                $objNominaDatosDelete->delete();
            }
            //Desaprobando las nominas
            $objDelete = Doctrine::getTable('DatNomina')->find($rn['idnomina']);
            $objDelete->aprobada = 0;
            $objDelete->save();
        }
    }

    public function obtenerIdPlantillaNominalXIdNomina ($idnomina)
    {
        return Doctrine_Query::create()
            ->select('idplantillanominal')
            ->from('DatNomina')
            ->where('idnomina = ?', array($idnomina))
            ->fetchOne()
            ->idplantillanominal;
    }

    public static function obtenerNominaAcumulada ($idnomina)
    {
        $sql = Doctrine_Query::create()
            ->select('acumulada')
            ->from('DatNomina')
            ->where('idnomina = ?', array($idnomina))
            ->fetchOne()
            ->acumulada;
        return $sql;
    }

    public static function obteneEstadoNominas ($idelaborarpago)
    {
        $sql = Doctrine_Query::create()
            ->select('aprobada')
            ->from('DatNomina')
            ->where('idelaborarpago = ?', array($idelaborarpago))
            ->fetchOne()
            ->aprobada;
        return $sql;
    }

    //Funcion para acumular en el snc o registro de salario y tiempo de servicios

    /**
     * @param $idnomina
     * @param $camposregistrosalario
     */
    public function acumularSNC225 ($identidad, $idnomina, $camposregistrosalario, $idelaborarpago, $modopago, $idconfmodelonomina)
    {
        $confmodelonomina = new ConfigModeloNomina();
        $datElaborarPagos = new DatElaborarPagos();
        $datNominaDatos = new DatNominaDatos();
        $todosdatosnomina = $datNominaDatos->obtenerDatosNomina($idnomina);
        $valores = $todosdatosnomina[0]['valores'];
        $datospersonas = unserialize($valores);
        $respuesta = '';
        $contFormulas = 0;
        //Recorriendo las personas para validar que no halla variables sin formulas
        foreach($datospersonas as $idp => $rdp) {
            $arrid = explode('-', $rdp['id']);
            $idpersona = $arrid[0];
            $idcargo = $arrid[1];
            //Recorriendo los campos de la conf del registro de salarios para validar que no halla variables sin formulas
            foreach($camposregistrosalario as $icrs => $rcrs) {
                $contFormulasNulasDias = 0;
                $contFormulasNulasImp = 0;
                $contFormulasNulasImpDev = 0;
                //EXPRESIONMATMDIAS**************************
                $expresionmatematicadias = $rcrs['expresionmatemdias'];
                $arrayformuladiasevaluar = array();
                $contformuladias = 0;
                $arrindicadoresformuladias = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expresionmatematicadias);
                //Recorriendo los indicadores de la formula de los dias para evaluarlos
                foreach($arrindicadoresformuladias as $ifd => $rfd) {
                    $rexplode = explode('_', $rfd);
                    switch ($rexplode[0]) {
                        //Cuando halla que buscar los dias habiles del mes
                        case 'CLDR': {
                            $calendario = new ConfCalendarioSNC();
                            $datospago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago);
                            $rfecha = explode('/', $datospago[0]['fechainicioperiodo']);
                            $mespago = $rfecha[1];
                            $anno = $rfecha[2];
                            $tienediashabiles = $calendario->tieneConfCalendario($mespago, $anno);
                            if($tienediashabiles > 0){
                                $diashabiles = $calendario->obtenerDiasHabiles($mespago, $anno);
                                $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                                $arrayformuladiasevaluar[$contformuladias]['valor'] = $diashabiles;
                                $contformuladias++;
                            }else{
                                $diashabiles = 0;
                                $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                                $arrayformuladiasevaluar[$contformuladias]['valor'] = $diashabiles;
                                $contformuladias++;
                            }
                            break;
                        }
                        //Variable auxiliar del reporte
                        case 'VASP': {
                            $valor = 0;
                            $idvariableauxiliar = $rexplode[1];
                            $datreportes = new DatReportesCertificaciones();
                            $confvariablesregistrosalario = new ConfVarAuxSNC225();
                            $confvariablesreporte = new ConfVariablesReportesCertificaciones();
                            $idvariablesconfreportescertificaciones = $confvariablesregistrosalario->obtenerIdVariableConReporte($idvariableauxiliar);
                            $idconfreportescertificaciones = $confvariablesreporte->obtenerConfReportePorIdVariable($idvariablesconfreportescertificaciones);
                            $datosperiodopago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago, $identidad);
                            $arrayvalor = $datreportes->ValorReporteCertificacionesNomina($idconfreportescertificaciones, $idvariablesconfreportescertificaciones, $idpersona, $modopago, $datosperiodopago[0]['fechainicioperiodo'], $datosperiodopago[0]['fechafinperiodo'], $datosperiodopago[0]['mesanyopago']);
                            if($arrayvalor[0]['valor']){
                                $valor = $arrayvalor[0]['valor'];
                            }
                            $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                            $arrayformuladiasevaluar[$contformuladias]['valor'] = $valor;
                            $contformuladias++;
                            break;
                        }
                        //Campo de la nomina
                        case 'EMN': {
                            $idestructurarnomina = $rexplode[1];
                            $importe = $rdp["c$idestructurarnomina"];
                            if($importe == "" || $importe == null){
                                return 'NO-CAMPO-NOMINA-FORMULA';
                            }
                            $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                            $arrayformuladiasevaluar[$contformuladias]['valor'] = $importe;
                            $contformuladias++;
                            break;
                        }
                        //Variable global
                        case 'VG': {
                            $valor = 0;
                            $idvariableglobal = $rexplode[1];
                            $confvariables = $this->obtenerVariablesGlobales($identidad, array($idcargo));
                            $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                            if(array_key_exists($idvariableglobal, $confvariables->sistema)){
                                $valor = $confvariables->sistema[$idvariableglobal];
                                $arrayformuladiasevaluar[$contformuladias]['valor'] = $valor;
                            }else if(array_key_exists($idvariableglobal, $confvariables->entidad)){
                                $valor = $confvariables->entidad[$idvariableglobal];
                                $arrayformuladiasevaluar[$contformuladias]['valor'] = $valor;
                            }else if(array_key_exists($idvariableglobal, $confvariables->cargo)){
                                $valor = $confvariables->cargo[$idvariableglobal];
                                $arrayformuladiasevaluar[$contformuladias]['valor'] = $valor;
                            }else{
                                return 'NO-CONFIG-VARIABLE-GLOBAL';
                            }
                            $contformuladias++;
                            break;
                        }
                    }
                }
                $formulaevaluadadias = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica($expresionmatematicadias, $arrayformuladiasevaluar);

                //EXPRESIONMATMIMPORT**************************
                $expresionmatematicaimporte = $rcrs['expresionmatemimport'];
                $arrayformulaimporteevaluar = array();
                $contformulaimporte = 0;
                $arrindicadoresformulaimporte = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expresionmatematicaimporte);
                //Recorriendo los indicadores de la formula del salario devengado para evaluarlos
                foreach($arrindicadoresformulaimporte as $ifd => $rfd) {
                    $rexplode = explode('_', $rfd);
                    switch ($rexplode[0]) {
                        //Cuando halla que buscar los dias habiles del mes
                        case 'CLDR': {
                            $calendario = new ConfCalendarioSNC();
                            $datospago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago);
                            $rfecha = explode('/', $datospago[0]['fechainicioperiodo']);
                            $mespago = $rfecha[1];
                            $anno = $rfecha[2];
                            $tienediashabiles = $calendario->tieneConfCalendario($mespago, $anno);
                            if($tienediashabiles > 0){
                                $diashabiles = $calendario->obtenerDiasHabiles($mespago, $anno);
                                $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
                                $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $diashabiles;
                                $contformulaimporte++;
                            }else{
                                $diashabiles = 0;
                                $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
                                $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $diashabiles;
                                $contformulaimporte++;
                            }
                            break;
                        }
                        //Variable auxiliar del reporte
                        case 'VASP': {
                            $valor = 0;
                            $idvariableauxiliar = $rexplode[1];
                            $datreportes = new DatReportesCertificaciones();
                            $confvariablesregistrosalario = new ConfVarAuxSNC225();
                            $confvariablesreporte = new ConfVariablesReportesCertificaciones();
                            $idvariablesconfreportescertificaciones = $confvariablesregistrosalario->obtenerIdVariableConReporte($idvariableauxiliar);
                            $idconfreportescertificaciones = $confvariablesreporte->obtenerConfReportePorIdVariable($idvariablesconfreportescertificaciones);
                            $datosperiodopago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago, $identidad);
                            $arrayvalor = $datreportes->ValorReporteCertificacionesNomina($idconfreportescertificaciones, $idvariablesconfreportescertificaciones, $idpersona, $modopago, $datosperiodopago[0]['fechainicioperiodo'], $datosperiodopago[0]['fechafinperiodo'], $datosperiodopago[0]['mesanyopago']);
                            if($arrayvalor[0]['valor']){
                                $valor = $arrayvalor[0]['valor'];
                            }
                            $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
                            $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $valor;
                            $contformulaimporte++;
                            break;
                        }
                        //Campo de la nomina
                        case 'EMN': {
                            $idestructurarnomina = $rexplode[1];
                            $importe = $rdp["c$idestructurarnomina"];
                            if($importe == "" || $importe == null){
                                return 'NO-CAMPO-NOMINA-FORMULA';
                            }
                            $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
                            $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $importe;
                            $contformulaimporte++;
                            break;
                        }
                        //Variable global
                        case 'VG': {
                            $valor = 0;
                            $idvariableglobal = $rexplode[1];
                            $confvariables = $this->obtenerVariablesGlobales($identidad, array($idcargo));
                            $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
                            if(array_key_exists($idvariableglobal, $confvariables->sistema)){
                                $valor = $confvariables->sistema[$idvariableglobal];
                                $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $valor;
                            }else if(array_key_exists($idvariableglobal, $confvariables->entidad)){
                                $valor = $confvariables->entidad[$idvariableglobal];
                                $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $valor;
                            }else if(array_key_exists($idvariableglobal, $confvariables->cargo)){
                                $valor = $confvariables->cargo[$idvariableglobal];
                                $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $valor;
                            }else{
                                return 'NO-CONFIG-VARIABLE-GLOBAL';
                            }
                            $contformulaimporte++;
                            break;
                        }
                    }
                }
                $formulaevaluadaimporte = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica($expresionmatematicaimporte, $arrayformulaimporteevaluar);

                //EXPRESIONMATMIMPORTDEVENGADO**************************
                $expresionmatematicaimportedev = $rcrs['expresionmatemimportdevengado'];
                $arrayformulaimportedevevaluar = array();
                $contformulaimportedev = 0;
                $arrindicadoresformulaimportedev = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expresionmatematicaimportedev);
                //Recorriendo los indicadores de la formula del salario devengado para evaluarlos
                foreach($arrindicadoresformulaimportedev as $ifd => $rfd) {
                    $rexplode = explode('_', $rfd);
                    switch ($rexplode[0]) {
                        //Cuando halla que buscar los dias habiles del mes
                        case 'CLDR': {
                            $calendario = new ConfCalendarioSNC();
                            $datospago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago);
                            $rfecha = explode('/', $datospago[0]['fechainicioperiodo']);
                            $mespago = $rfecha[1];
                            $anno = $rfecha[2];
                            $tienediashabiles = $calendario->tieneConfCalendario($mespago, $anno);
                            if($tienediashabiles > 0){
                                $diashabiles = $calendario->obtenerDiasHabiles($mespago, $anno);
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $diashabiles;
                                $contformulaimportedev++;
                            }else{
                                $diashabiles = 0;
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $diashabiles;
                                $contformulaimportedev++;
                            }
                            break;
                        }
                        //Variable auxiliar del reporte
                        case 'VASP': {
                            $valor = 0;
                            $idvariableauxiliar = $rexplode[1];
                            $datreportes = new DatReportesCertificaciones();
                            $confvariablesregistrosalario = new ConfVarAuxSNC225();
                            $confvariablesreporte = new ConfVariablesReportesCertificaciones();
                            $idvariablesconfreportescertificaciones = $confvariablesregistrosalario->obtenerIdVariableConReporte($idvariableauxiliar);
                            $idconfreportescertificaciones = $confvariablesreporte->obtenerConfReportePorIdVariable($idvariablesconfreportescertificaciones);
                            $datosperiodopago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago, $identidad);
                            $arrayvalor = $datreportes->ValorReporteCertificacionesNomina($idconfreportescertificaciones, $idvariablesconfreportescertificaciones, $idpersona, $modopago, $datosperiodopago[0]['fechainicioperiodo'], $datosperiodopago[0]['fechafinperiodo'], $datosperiodopago[0]['mesanyopago']);
                            if($arrayvalor[0]['valor']){
                                $valor = $arrayvalor[0]['valor'];
                            }
                            $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
                            $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $valor;
                            $contformulaimportedev++;
                            break;
                        }
                        //Campo de la nomina
                        case 'EMN': {
                            $idestructurarnomina = $rexplode[1];
                            $importe = $rdp["c$idestructurarnomina"];
                            if($importe == "" || $importe == null){
                                return 'NO-CAMPO-NOMINA-FORMULA';
                            }
                            $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
                            $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $importe;
                            $contformulaimportedev++;
                            break;
                        }
                        //Variable global
                        case 'VG': {
                            $valor = 0;
                            $idvariableglobal = $rexplode[1];
                            $confvariables = $this->obtenerVariablesGlobales($identidad, array($idcargo));
                            $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
                            if(array_key_exists($idvariableglobal, $confvariables->sistema)){
                                $valor = $confvariables->sistema[$idvariableglobal];
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $valor;
                            }else if(array_key_exists($idvariableglobal, $confvariables->entidad)){
                                $valor = $confvariables->entidad[$idvariableglobal];
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $valor;
                            }else if(array_key_exists($idvariableglobal, $confvariables->cargo)){
                                $valor = $confvariables->cargo[$idvariableglobal];
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $valor;
                            }else{
                                return 'NO-CONFIG-VARIABLE-GLOBAL';
                            }
                            $contformulaimportedev++;
                            break;
                        }
                    }
                }
                $formulaevaluadaimportedev = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica($expresionmatematicaimportedev, $arrayformulaimportedevevaluar);

                //Validacion de campos formulas vacios***************************
                $fdias = $formulaevaluadadias->expresionacalcular;
                $fimp = $formulaevaluadaimporte->expresionacalcular;
                $fimpdev = $formulaevaluadaimportedev->expresionacalcular;

                $contFormulasNulasDias += ($fdias != null) ? 0 : 1;
                $contFormulasNulasImp += ($fimp != null) ? 0 : 1;
                $contFormulasNulasImpDev += ($fimpdev != null) ? 0 : 1;

                if($contFormulasNulasDias == 1 && $contFormulasNulasImp == 1 && $contFormulasNulasImpDev == 1){
                    $contFormulas++;
                    $respuesta .= $icrs . ';';
                }
            }
        }

        //Si todas las variables tienen almenos una fórmula matemática asignada.
        if($contFormulas == 0){
            $respuesta = 'ok';
            //Recorriendo las personas para empezar a acumularles en el registro de salarios y tiempo de servicios
            foreach($datospersonas as $idp => $rdp) {
                $arrid = explode('-', $rdp['id']);
                $idpersona = $arrid[0];
                $idcargo = $arrid[1];
                //Recorriendo los campos de la conf del registro de salarios
                foreach($camposregistrosalario as $icrs => $rcrs) {
                    //EXPRESIONMATMDIAS**************************
                    $expresionmatematicadias = $rcrs['expresionmatemdias'];
                    $arrayformuladiasevaluar = array();
                    $contformuladias = 0;
                    $arrindicadoresformuladias = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expresionmatematicadias);
                    //Recorriendo los indicadores de la formula de los dias para evaluarlos
                    foreach($arrindicadoresformuladias as $ifd => $rfd) {
                        $rexplode = explode('_', $rfd);
                        switch ($rexplode[0]) {
                            //Cuando halla que buscar los dias habiles del mes
                            case 'CLDR': {
                                $calendario = new ConfCalendarioSNC();
                                $datospago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago);
                                $rfecha = explode('/', $datospago[0]['fechainicioperiodo']);
                                $mespago = $rfecha[1];
                                $anno = $rfecha[2];
                                $tienediashabiles = $calendario->tieneConfCalendario($mespago, $anno);
                                if($tienediashabiles > 0){
                                    $diashabiles = $calendario->obtenerDiasHabiles($mespago, $anno);
                                    $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                                    $arrayformuladiasevaluar[$contformuladias]['valor'] = $diashabiles;
                                    $contformuladias++;
                                }else{
                                    $diashabiles = 0;
                                    $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                                    $arrayformuladiasevaluar[$contformuladias]['valor'] = $diashabiles;
                                    $contformuladias++;
                                }
                                break;
                            }
                            //Variable auxiliar del reporte
                            case 'VASP': {
                                $valor = 0;
                                $idvariableauxiliar = $rexplode[1];
                                $datreportes = new DatReportesCertificaciones();
                                $confvariablesregistrosalario = new ConfVarAuxSNC225();
                                $confvariablesreporte = new ConfVariablesReportesCertificaciones();
                                $idvariablesconfreportescertificaciones = $confvariablesregistrosalario->obtenerIdVariableConReporte($idvariableauxiliar);
                                $idconfreportescertificaciones = $confvariablesreporte->obtenerConfReportePorIdVariable($idvariablesconfreportescertificaciones);
                                $datosperiodopago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago, $identidad);
                                $arrayvalor = $datreportes->ValorReporteCertificacionesNomina($idconfreportescertificaciones, $idvariablesconfreportescertificaciones, $idpersona, $modopago, $datosperiodopago[0]['fechainicioperiodo'], $datosperiodopago[0]['fechafinperiodo'], $datosperiodopago[0]['mesanyopago']);
                                if($arrayvalor[0]['valor']){
                                    $valor = $arrayvalor[0]['valor'];
                                }
                                $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                                $arrayformuladiasevaluar[$contformuladias]['valor'] = $valor;
                                $contformuladias++;
                                break;
                            }
                            //Campo de la nomina
                            case 'EMN': {
                                $idestructurarnomina = $rexplode[1];
                                $importe = $rdp["c$idestructurarnomina"];
                                if($importe == "" || $importe == null){
                                    return 'NO-CAMPO-NOMINA-FORMULA';
                                }
                                $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                                $arrayformuladiasevaluar[$contformuladias]['valor'] = $importe;
                                $contformuladias++;
                                break;
                            }
                            //Variable global
                            case 'VG': {
                                $valor = 0;
                                $idvariableglobal = $rexplode[1];
                                $confvariables = $this->obtenerVariablesGlobales($identidad, array($idcargo));
                                $arrayformuladiasevaluar[$contformuladias]['idindicador'] = $rfd;
                                if(array_key_exists($idvariableglobal, $confvariables->sistema)){
                                    $valor = $confvariables->sistema[$idvariableglobal];
                                    $arrayformuladiasevaluar[$contformuladias]['valor'] = $valor;
                                }else if(array_key_exists($idvariableglobal, $confvariables->entidad)){
                                    $valor = $confvariables->entidad[$idvariableglobal];
                                    $arrayformuladiasevaluar[$contformuladias]['valor'] = $valor;
                                }else if(array_key_exists($idvariableglobal, $confvariables->cargo)){
                                    $valor = $confvariables->cargo[$idvariableglobal];
                                    $arrayformuladiasevaluar[$contformuladias]['valor'] = $valor;
                                }else{
                                    return 'NO-CONFIG-VARIABLE-GLOBAL';
                                }
                                $contformuladias++;
                                break;
                            }
                        }
                    }
                    $formulaevaluadadias = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica($expresionmatematicadias, $arrayformuladiasevaluar);
                    //Dias acumulados
                    $diasacumulados = $formulaevaluadadias->valor;

                    //EXPRESIONMATMIMPORT**************************
                    $expresionmatematicaimporte = $rcrs['expresionmatemimport'];
                    $arrayformulaimporteevaluar = array();
                    $contformulaimporte = 0;
                    $arrindicadoresformulaimporte = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expresionmatematicaimporte);
                    //Recorriendo los indicadores de la formula del salario devengado para evaluarlos
                    foreach($arrindicadoresformulaimporte as $ifd => $rfd) {
                        $rexplode = explode('_', $rfd);
                        switch ($rexplode[0]) {
                            //Cuando halla que buscar los dias habiles del mes
                            case 'CLDR': {
                                $calendario = new ConfCalendarioSNC();
                                $datospago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago);
                                $rfecha = explode('/', $datospago[0]['fechainicioperiodo']);
                                $mespago = $rfecha[1];
                                $anno = $rfecha[2];
                                $tienediashabiles = $calendario->tieneConfCalendario($mespago, $anno);
                                if($tienediashabiles > 0){
                                    $diashabiles = $calendario->obtenerDiasHabiles($mespago, $anno);
                                    $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
                                    $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $diashabiles;
                                    $contformulaimporte++;
                                }else{
                                    $diashabiles = 0;
                                    $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
                                    $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $diashabiles;
                                    $contformulaimporte++;
                                }
                                break;
                            }
                            //Variable auxiliar del reporte
                            case 'VASP': {
                                $valor = 0;
                                $idvariableauxiliar = $rexplode[1];
                                $datreportes = new DatReportesCertificaciones();
                                $confvariablesregistrosalario = new ConfVarAuxSNC225();
                                $confvariablesreporte = new ConfVariablesReportesCertificaciones();
                                $idvariablesconfreportescertificaciones = $confvariablesregistrosalario->obtenerIdVariableConReporte($idvariableauxiliar);
                                $idconfreportescertificaciones = $confvariablesreporte->obtenerConfReportePorIdVariable($idvariablesconfreportescertificaciones);
                                $datosperiodopago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago, $identidad);
                                $arrayvalor = $datreportes->ValorReporteCertificacionesNomina($idconfreportescertificaciones, $idvariablesconfreportescertificaciones, $idpersona, $modopago, $datosperiodopago[0]['fechainicioperiodo'], $datosperiodopago[0]['fechafinperiodo'], $datosperiodopago[0]['mesanyopago']);
                                if($arrayvalor[0]['valor']){
                                    $valor = $arrayvalor[0]['valor'];
                                }
                                $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
                                $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $valor;
                                $contformulaimporte++;
                                break;
                            }
                            //Campo de la nomina
                            case 'EMN': {
                                $idestructurarnomina = $rexplode[1];
                                $importe = $rdp["c$idestructurarnomina"];
                                if($importe == "" || $importe == null){
                                    return 'NO-CAMPO-NOMINA-FORMULA';
                                }
                                $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
                                $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $importe;
                                $contformulaimporte++;
                                break;
                            }
                            //Variable global
                            case 'VG': {
                                $valor = 0;
                                $idvariableglobal = $rexplode[1];
                                $confvariables = $this->obtenerVariablesGlobales($identidad, array($idcargo));
                                $arrayformulaimporteevaluar[$contformulaimporte]['idindicador'] = $rfd;
                                if(array_key_exists($idvariableglobal, $confvariables->sistema)){
                                    $valor = $confvariables->sistema[$idvariableglobal];
                                    $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $valor;
                                }else if(array_key_exists($idvariableglobal, $confvariables->entidad)){
                                    $valor = $confvariables->entidad[$idvariableglobal];
                                    $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $valor;
                                }else if(array_key_exists($idvariableglobal, $confvariables->cargo)){
                                    $valor = $confvariables->cargo[$idvariableglobal];
                                    $arrayformulaimporteevaluar[$contformulaimporte]['valor'] = $valor;
                                }else{
                                    return 'NO-CONFIG-VARIABLE-GLOBAL';
                                }
                                $contformulaimporte++;
                                break;
                            }
                        }
                    }
                    $formulaevaluadaimporte = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica($expresionmatematicaimporte, $arrayformulaimporteevaluar);
                    //Salario devengado
                    $salariodevengado = $formulaevaluadaimporte->valor;

                    //EXPRESIONMATMIMPORTDEVENGADO**************************
                    $expresionmatematicaimportedev = $rcrs['expresionmatemimportdevengado'];
                    $arrayformulaimportedevevaluar = array();
                    $contformulaimportedev = 0;
                    $arrindicadoresformulaimportedev = ZendExt_IoC_Inter::getInstance()->comun->ObtenerarrIdIndicadoresporExpresionMatematica($expresionmatematicaimportedev);
                    //Recorriendo los indicadores de la formula del salario devengado para evaluarlos
                    foreach($arrindicadoresformulaimportedev as $ifd => $rfd) {
                        $rexplode = explode('_', $rfd);
                        switch ($rexplode[0]) {
                            //Cuando halla que buscar los dias habiles del mes
                            case 'CLDR': {
                                $calendario = new ConfCalendarioSNC();
                                $datospago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago);
                                $rfecha = explode('/', $datospago[0]['fechainicioperiodo']);
                                $mespago = $rfecha[1];
                                $anno = $rfecha[2];
                                $tienediashabiles = $calendario->tieneConfCalendario($mespago, $anno);
                                if($tienediashabiles > 0){
                                    $diashabiles = $calendario->obtenerDiasHabiles($mespago, $anno);
                                    $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
                                    $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $diashabiles;
                                    $contformulaimportedev++;
                                }else{
                                    $diashabiles = 0;
                                    $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
                                    $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $diashabiles;
                                    $contformulaimportedev++;
                                }
                                break;
                            }
                            //Variable auxiliar del reporte
                            case 'VASP': {
                                $valor = 0;
                                $idvariableauxiliar = $rexplode[1];
                                $datreportes = new DatReportesCertificaciones();
                                $confvariablesregistrosalario = new ConfVarAuxSNC225();
                                $confvariablesreporte = new ConfVariablesReportesCertificaciones();
                                $idvariablesconfreportescertificaciones = $confvariablesregistrosalario->obtenerIdVariableConReporte($idvariableauxiliar);
                                $idconfreportescertificaciones = $confvariablesreporte->obtenerConfReportePorIdVariable($idvariablesconfreportescertificaciones);
                                $datosperiodopago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago, $identidad);
                                $arrayvalor = $datreportes->ValorReporteCertificacionesNomina($idconfreportescertificaciones, $idvariablesconfreportescertificaciones, $idpersona, $modopago, $datosperiodopago[0]['fechainicioperiodo'], $datosperiodopago[0]['fechafinperiodo'], $datosperiodopago[0]['mesanyopago']);
                                if($arrayvalor[0]['valor']){
                                    $valor = $arrayvalor[0]['valor'];
                                }
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $valor;
                                $contformulaimportedev++;
                                break;
                            }
                            //Campo de la nomina
                            case 'EMN': {
                                $idestructurarnomina = $rexplode[1];
                                $importe = $rdp["c$idestructurarnomina"];
                                if($importe == "" || $importe == null){
                                    return 'NO-CAMPO-NOMINA-FORMULA';
                                }
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $importe;
                                $contformulaimportedev++;
                                break;
                            }
                            //Variable global
                            case 'VG': {
                                $valor = 0;
                                $idvariableglobal = $rexplode[1];
                                $confvariables = $this->obtenerVariablesGlobales($identidad, array($idcargo));
                                $arrayformulaimportedevevaluar[$contformulaimportedev]['idindicador'] = $rfd;
                                if(array_key_exists($idvariableglobal, $confvariables->sistema)){
                                    $valor = $confvariables->sistema[$idvariableglobal];
                                    $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $valor;
                                }else if(array_key_exists($idvariableglobal, $confvariables->entidad)){
                                    $valor = $confvariables->entidad[$idvariableglobal];
                                    $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $valor;
                                }else if(array_key_exists($idvariableglobal, $confvariables->cargo)){
                                    $valor = $confvariables->cargo[$idvariableglobal];
                                    $arrayformulaimportedevevaluar[$contformulaimportedev]['valor'] = $valor;
                                }else{
                                    return 'NO-CONFIG-VARIABLE-GLOBAL';
                                }
                                $contformulaimportedev++;
                                break;
                            }
                        }
                    }
                    $formulaevaluadaimportedev = ZendExt_IoC_Inter::getInstance()->comun->EvaluarExpresionMatematica($expresionmatematicaimportedev, $arrayformulaimportedevevaluar);
                    //Salario devengado calculo reporte
                    $salariodevengadocalcrepo = $formulaevaluadaimportedev->valor;

                    //Datos del perioso de pago
                    $arraypago = $datElaborarPagos->obtenerPeriodosPagoEntidad($idelaborarpago);
                    $arrayfecha = explode('/', $arraypago[0]['fechapago']);
                    $messnc = $arrayfecha[1];
                    $annosnc = $arrayfecha[2];
                    //Datos del modelo de nomina
                    $idtiponomina = $confmodelonomina->obtenerIdNominaDagoConfig($idconfmodelonomina);
                    //Salvando el registro de salarios y tiempo de servicios
                    $gestregistrosalario = new DatRegistroSalarioTiempoServicio();
                    $gestregistrosalario->idpersona = $idpersona;
                    $gestregistrosalario->anno = $annosnc;
                    $gestregistrosalario->idmes = $messnc;

                    $gestregistrosalario->diasacumulados = $diasacumulados;
                    $gestregistrosalario->salariodevengado = $salariodevengado;
                    $gestregistrosalario->salariodevengadoreporte = $salariodevengadocalcrepo;

                    $gestregistrosalario->idtiponomina = $idtiponomina;
                    $gestregistrosalario->idestructura = $identidad;
                    $gestregistrosalario->idconfregistsalartiempservc = $rcrs['idregistsalartiempservc'];
                    $gestregistrosalario->save();
                }
            }
        }else if($contFormulas > 0){
            $respuesta = $respuesta;
        }

//        print_r($contFormulas);
//        print_r($respuesta);die;
        return $respuesta;
    }


}/*FIN DE LA CLASE*/
