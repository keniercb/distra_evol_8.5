<?php

/**
 * @author Kenier Cumba Bueno
 */
class ActivoComprobanteModel extends LogisticaComprobanteModel {

    private $sConfGeneral;

    /**
     *
     */
    public function __construct() {
        parent::__construct();
        $this->sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    /**
     *
     */
    public static function getInstance() {
        return new ActivoComprobanteModel;
    }

    /*
     * Método que devuelve los pases (movimientos) de un asiento (documento)
     * Ej: Array(
     *          0 => stdClass{
     *          'idcuenta' => 000001,
     *          'importe' => 58900
     *      },
     *      1 => stdClass{
     *          'idcuenta' => 000002,
     *          'importe' => 92100
     *      }
     * )
     *
     * Donde el idcuenta es la cuenta del activo o de depreciación en dependencia del 
     * documento que se este contabilizando que se asocia al grupo del indicador y el
     * importe es la sumatoria del valor contable de tosos los registros numéricos 
     * que tiene ese movimiento adentro.
     */

    public function pasesMovimientos($iddocumento, $pase) {
        $pases = array();
        $mComunAFT = ComunAFTModel::getInstance();
        //  Ver que tipo de documento es
        $documento = Doctrine::getTable('DatDocumento')->find($iddocumento);
        $tipoDocumento = $mComunAFT->getDatosInterfazByIdOperacion($documento->idoperacion);

        $datos = array();
        if ($tipoDocumento['codigo'] == 'OPER_DEPRECIACION') {
            $datos = $this->getQueryPasesMov($iddocumento, 'depreciacion', 'idcuentadepreciacion');
        }
        elseif ($tipoDocumento['codigo'] == 'OPER_MOD_VALOR' 
				|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_DIS' 
				|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_UH' 
				|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_DIS_UH' 
				) {
            $datos = $this->getQueryPasesMov($iddocumento, 'diferenciavalor', 'idcuentaactivo');
            $datos = array_merge($this->getQueryPasesMov($iddocumento, 'diferenciadepreciacion', 'idcuentadepreciacion'), $datos);
        }
        else {
            $datos = $this->getQueryPasesMov($iddocumento);
        }

        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];

            $objPase = $this->inicializarPase($pase, $iddocumento);
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function pasesMovimientosAlternativo($iddocumento, $pase) {
        $pases = array();
        $mComunAFT = ComunAFTModel::getInstance();

        //  Ver que tipo de documento es
        $documento = Doctrine::getTable('DatDocumento')->find($iddocumento);
        $tipoDocumento = $mComunAFT->getDatosInterfazByIdOperacion($documento->idoperacion);

        $datos = array();
        if ($tipoDocumento['codigo'] == 'OPER_DEPRECIACION') {
            $datos = $this->getQueryPasesMov($iddocumento, 'depreciacioncuc', 'idcuentadepreciacionalternativa');
        }
        elseif ($tipoDocumento['codigo'] == 'OPER_MOD_VALOR'
				|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_DIS' 
				|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_UH' 
				|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_DIS_UH'
				) {
            $datos = $this->getQueryPasesMov($iddocumento, 'diferenciavaloralternativo', 'idcuentaactivoalternativa');
            $datos = array_merge($this->getQueryPasesMov($iddocumento, 'diferenciadepreciacionalternativo', 'idcuentadepreciacionalternativa'), $datos);
        }
        else {
            $datos = $this->getQueryPasesMov($iddocumento, 'valorcontablealternativo', 'idcuentaactivoalternativa');
        }

        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];

            $objPase = $this->inicializarPase($pase, $iddocumento);
            $objPase->idmoneda = $moneda->idmonedaalternativa;
            $objPase->moneda = $moneda->codigoisoalt;
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    /**
     * TODO: Cambiar esta consulta pues requiere que el nomenclador de indicadores tenga asociado un grupo y de no ser
     * asi los comprobantes se descuadran
     * 
     * @param $iddocumento
     * @param $pase
     * @param string $campoSumar -- Es el campo que se va a sumar(En el caso de la depreciacion es "depreciacion")
     * @param string $campoCuenta -- Es el campo que contiene el idcuenta en la conf.(En el caso de la depreciacion es
     *                                                                                "idcuentadepreciacion")
     * 
     * @return mixed
     */
    public function getQueryPasesMov($iddocumento, $campoSumar = 'valorcontable', $campoCuenta = 'idcuentaactivo') {
        $idEstructura = $this->global->Estructura->idestructura;
        $sql = "SELECT
                SUM(round(abs(mrna.$campoSumar),{$this->fRedondeo6})) as importe, cgc.$campoCuenta as idcuenta
                FROM mod_logistica.dat_movimiento dm
                INNER JOIN mod_logistica.dat_producto dp on dm.idproducto = dp.idproducto
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovimiento = dm.idmovimiento
				inner join mod_logactivofijotangible.dat_regnumericoactivo rn on rn.idregnumerico = mrn.idregnumerico
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico                 
                INNER JOIN mod_logactivofijotangible.conf_gruposcuentas cgc on cgc.idgruposubgrupo = coalesce(rn.idgruposubgrupo,mrna.idgruposubgrupo) and cgc.idestructura = {$idEstructura}
                WHERE dm.iddocumento = $iddocumento
                GROUP BY cgc.idgruposubgrupo,cgc.$campoCuenta
            ";
        $conn = Zend_Registry::get('conexion');
        $respdata = $conn->execute($sql);
        $datos = $respdata->fetchAll(PDO::FETCH_ASSOC);
        return $datos;
    }

    /**
     *
     */
    public function cargarDocContabilizados() {
        $mDocActivo = new DocumentoActivoModel();
        return $mDocActivo->getDocumentosContabilizan();
    }

    /**
     *
     */
    public function importeTotalDocumentoDepreciacion($idDocumento) {
        $mDocActivo = new DocumentoActivoModel();
        return $mDocActivo->getImporteTotalDocumentoDepreciacion($idDocumento);
    }

    /**
     *
     */
    public function importeTotalDocumento($idDocumento) {
        $mDocActivo = new DocumentoActivoModel();
        return $mDocActivo->getImporteTotalDocumento($idDocumento);
    }

    public function getNumeroFactura($idDocumento) {
        $sql = "select ac.nrofactura
                from mod_logactivofijotangible.dat_docaltacompra ac
                where ac.iddocaltacompra = {$idDocumento}";
        $dataQuery = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return (count($dataQuery)) ? $dataQuery[0]['nrofactura'] : null;
    }

    /**
     *
     */
    public function importeTotalDocumentoAlternativo($idDocumento) {
        $mDocActivo = new DocumentoActivoModel();
        return $mDocActivo->getImporteTotalDocumentoAlternativos($idDocumento);
    }

    /**
     *
     */
    public function importeTotalDocumentoDepreciacionAlternativo($idDocumento) {
        $mDocActivo = new DocumentoActivoModel();
        return $mDocActivo->getImporteTotalDocumentoDepreciacionAlternativos($idDocumento);
    }

    public function buscarCuentaClienteProveedor($iddocumento, $porPagar = true, $idmoneda = null) {
        $idmoneda = is_null($idmoneda) ? LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda : $idmoneda;
        $query = Doctrine_Query::create();
        $datos = $query->select("ddc.idcliente as idcliente,dd.iddocumento,ddc.tipocliente as tipo, 
                                ddc.idcondicionpago as idcondicionpago")
                ->from('DatDocumento dd')
                ->innerjoin('dd.DatDocumentoCliente ddc')
                ->where(' ddc.iddocumento = ? ', $iddocumento)
                ->fetchArray();
        if ($datos[0]['tipo'] == 2) {
            $result = $this->contabilidadHelper->obtenerCuentasAsociadasACentros($datos[0]['idcliente']);
            return $result[0]['idcuenta'];
        }
        else {
            /**
             * Busco la condicion de pago
             */
            $condPago = $datos[0]['idcondicionpago'];

            if (!array_key_exists($datos[0]['idcliente'], $this->cache['clientes'])) {
                $this->cache['clientes'][$datos[0]['idcliente']] = $this->configuracionHelper
                        ->getCuentasClienteProveedor($datos[0]['idcliente']);
            }
            $cliente = $this->cache['clientes'][$datos[0]['idcliente']];

            $concepto = $porPagar == true ? 2 : 1;
            foreach ($cliente['cuentas'] as $pos => $cuenta) {
                if ($cuenta['idmoneda'] == $idmoneda && $cuenta['idclasificacion'] == $concepto && $condPago == $cuenta['idterminodepago']
                ) {
                    return $cuenta['idcuenta'];
                }
            }
            return null;
        }
    }

    public function getDepreciacion($iddocumento, $pase) {
        $pases = array();
        $datos = $this->getQueryPasesMov($iddocumento, 'depreciacion', 'idcuentadepreciacion');
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];

            $objPase = $this->inicializarPase($pase, $iddocumento);
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function getDepreciacionAcumulada($iddocumento, $pase) {
        $pases = array();
        $datos = $this->getQueryPasesMov($iddocumento, 'depreciacionacumulada', 'idcuentadepreciacion');
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];

            $objPase = $this->inicializarPase($pase, $iddocumento);
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function getDepreciacionAcumuladaAlternativo($iddocumento, $pase) {
        $pases = array();
        $datos = $this->getQueryPasesMov($iddocumento, 'depreciacionacumuladaalternativo', 'idcuentadepreciacionalternativa');
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];

            $objPase = $this->inicializarPase($pase, $iddocumento);
            $objPase->idmoneda = $moneda->idmonedaalternativa;
            $objPase->moneda = $moneda->codigoisoalt;
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function getDepreciacionAlternativo($iddocumento, $pase) {
        $pases = array();
        $datos = $this->getQueryPasesMov($iddocumento, 'depreciacioncuc', 'idcuentadepreciacionalternativa');
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];

            $objPase = $this->inicializarPase($pase, $iddocumento);
            $objPase->idmoneda = $moneda->idmonedaalternativa;
            $objPase->moneda = $moneda->codigoisoalt;
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function contabilizarDocumento($idDocumento, $subsistema, $detalles = '', $observaciones = '') {
        $this->subsistema = $subsistema;
        $comprobante = $this->inicializarComprobante($subsistema);
        if (!is_array($idDocumento)) {
            $idDocumento = array($idDocumento);
        }
        $pases = $documentos = array();
        foreach ($idDocumento as $idDocContablizar) {
            $result = $this->contabilidadHelper->existeComprobanteDocumento($idDocContablizar, $subsistema);
            $documento = Doctrine::getTable('DatDocumento')->find($idDocContablizar);
            if ($result != 0) {
                $documento->idcomprobante = $result;
                $documento->save();
                continue;
            }
            if (!array_key_exists($documento->idoperacion, $this->cache['operaciones'])) {
                $operacion = $this->configuracionHelper->obtenerOperaciones(
                        null, $subsistema, $documento->iddoc, $documento->idoperacion
                );
                $this->cache['operaciones'][$documento->idoperacion] = $this->configuracionHelper
                        ->getModeloContabilizacion($operacion[0]['idmodelo']);
            }
            $nro = $documento->nrodoc;
			$observaciones = $documento->observaciones;
            $this->generarPases($idDocContablizar, $this->cache['operaciones'][$documento->idoperacion], $pases, $documento->idoperacion, $nro, $documento->estado);
            array_push($documentos, $nro);
        }
        $comprobante->dataComprobante = $this->unificarPases($pases);
        $comprobante->detalle = empty($detalles) ? "Contabilizando el(los) documento(s) #" . implode(',', $documentos) : $detalles;
        $comprobante->descripcion = rtrim($this->getDetallesOperacion($idDocContablizar));
        $comprobante->detalle = empty($observaciones) ? (($subsistema == LogisticaGlobal::SUBSISTEMA_FAC) ? 'Comprobante de operaciones de facturacion - '.implode(',', $documentos) : 'Comprobante de operaciones de inventario') : $observaciones;
        return $this->buildComprobante($comprobante);
    }

    public function generarPase($idDocumento, $pase) {
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        $objPase = $this->inicializarPase($pase, $idDocumento);
        if ($pase['tipocuenta'] == 'fija') {
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($pase['cuenta']);
            $objPase->idcuenta = $cuenta->idcuenta;
        }
        else {
            switch ($pase['cuenta']['valor']) {
                /**
                 * Cuenta por pagar en moneda contable
                 */
                case 100 :
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, false, $moneda->idmoneda);
                    $objPase->idmoneda = $moneda->idmoneda;
                    $objPase->moneda = $moneda->codigoiso;
                    break;
                case 114 :
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, true, $moneda->idmonedaalternativa);
                    $objPase->idmoneda = $moneda->idmonedaalternativa;
                    $objPase->moneda = $moneda->codigoisoalt;
                    break;
                /**
                 * Cuenta por cobrar en moneda contable
                 */
                case 102 :
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, true, $moneda->idmoneda);
                    $objPase->idmoneda = $moneda->idmoneda;
                    $objPase->moneda = $moneda->codigoiso;
                    break;
                case 113 :
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, false, $moneda->idmonedaalternativa);
                    $objPase->idmoneda = $moneda->idmonedaalternativa;
                    $objPase->moneda = $moneda->codigoisoalt;
                    break;
                /**
                 * Para los vales de devolucion
                 */
                case 105 :
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, false);
                    $objPase->idmoneda = $moneda->idmonedaalternativa;
                    $objPase->moneda = $moneda->codigoisoalt;
                    break;
                case 101:
                    $valor = $pase['valor']['valor'];
                    if ($valor == 123 || $valor == 124) {
                        return $this->pasesRevaluacion($idDocumento, $pase, $valor == 123 ? 1 : 0);
                    }
                    elseif ($valor == 125 || $valor == 126) {
                        return $this->pasesRevaluacion($idDocumento, $pase, $valor == 125 ? 1 : 0, 2);
                    }
                    return $this->pasesMovimientos($idDocumento, $pase);

                case 112:
                    return $this->pasesMovimientosAlternativo($idDocumento, $pase);
                /*
                 * Depreciacion
                 * */
                case 110:
                    return $this->getDepreciacion($idDocumento, $pase);
                /*
                 * Depreciacion alternativa
                 * */
                case 121:
                    return $this->getDepreciacionAlternativo($idDocumento, $pase);

                case 128:
                    return $this->pasesAFTCambioGrupo($idDocumento, $pase, 1, false);

                case 129:
                    return $this->pasesAFTCambioGrupo($idDocumento, $pase, 1, true);

                default :
            }
        }
        $pases = $this->completarPase($objPase, $pase, $idDocumento);
        return count($pases) > 0 ? $pases : $objPase;
    }

    public function pasesAFTCambioGrupo($iddocumento, $pase, $contable = 1, $depreciacion = false)
    {
        $campo = ($depreciacion) ? 'idcuentadepreciacion' : 'idcuentaactivo';
        $campoImporte = ($depreciacion) ? 'depreciacionacumulada' : 'valorcontable';
        if ($contable != 1) {
            $campo = 'idcuentaactivoalternativa';
            $campoImporte = 'valorcontablealt';
        }
        $pases = array();
        $igualGrupo = "coalesce(ma.idgruposubgrupoold,-1)";
        $sql = "select gc.{$campo} as idcuenta, sum(round(COALESCE(ma.{$campoImporte},0),{$this->fRedondeo6})) as importe
                from mod_datosmaestros.nom_indicador i
                inner join mod_logistica.dat_producto p on p.idindicador = i.idindicador
                inner join mod_logistica.dat_movimiento m on m.idproducto = p.idproducto
                inner join mod_logactivofijotangible.dat_movregnumerico mr on mr.idmovimiento = m.idmovimiento
                inner join mod_logactivofijotangible.dat_movregnumericoactivo ma on ma.idmovregnumerico = mr.idmovregnumerico
                inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
                inner join mod_logactivofijotangible.conf_gruposcuentas gc 
                        on (gc.idgruposubgrupo = {$igualGrupo} and gc.idestructura = {$this->global->Estructura->idestructura})
                where m.iddocumento = {$iddocumento}
                group by gc.{$campo} having sum(COALESCE(ma.{$campoImporte},0)) > 0";
        $dataQuery = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        foreach ($dataQuery as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $iddocumento);
            $objPase->idmoneda = $moneda->idmoneda;
            $objPase->moneda = $moneda->codigoiso;
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function completarPase(&$objPase, $pase, $idDocumento) {
        $refArray = array();
        $flagCentroCosto = false;
	
        if (count($pase['sustituciones'])) {
            foreach ($pase['sustituciones'] as $pos => $sustitucion) {
                /**
                 * 119 Centro de costo
                 * 120 Elemento del gasto
                 */
                if ($sustitucion['valor'] == 119) {
                    $campo = 'depreciacion';
					if ($pase['valor']['valor'] != 103) {
                        $campo = 'depreciacioncuc';
                    }
					if ($pase['valor']['valor'] == 121) {
                        $campo = 'depreciacioncuc';
                    }
					if ($pase['valor']['valor'] == 111 || $pase['valor']['valor'] == 110) {
                        $campo = 'depreciacion';
                    }
					if ($pase['valor']['valor'] == 103) {
                        $campo = 'valorcontable';
                    }
					if ($pase['valor']['valor'] == 115) {
                        $campo = 'valorcontablealternativo';
                    }
                    
                    $centros = $this->getCentroCostosActivos($idDocumento, $campo);

                    foreach ($centros as $centro) {
                        $newPase = $this->inicializarPase($pase, $idDocumento);
                        $newPase->importe = $centro['importe'];
                        $newPase->importemb = $centro['importe'];
                        $newPase->importemo = $centro['importe'];						
                        if ($centro['idcentrocosto']) {
                            $newPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, $sustitucion['parteformato'], $centro['idcentrocosto']);
							$sustitucionElemento = $pase['sustituciones'][$pos + 1];
                            $elemem = $sustitucionElemento['valores'][0];
                            $idcuenta = $newPase->idcuenta;
                            $idElementos = $this->getElementosByIdElemento($elemem['id']);
							$cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);        

							$concate = $cuenta->concatcta . '.' . $idElementos[0]['concat'];
							$cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
							$idcuenta = $cuentaE->idcuenta;
							
                            $newPase->idcuenta = $idcuenta;
                            array_push($refArray, $newPase);
                        }
                    }
                }
                elseif ($sustitucion['valor'] == 309) {
                    /**
                     * Aperetura para la entidad destino
                     */
                    $sqlEstrucutura = "select dc.identidaddestino 
                            from mod_logactivofijotangible.dat_doctransfentidades dc
                            where dc.iddoctranfentidades = {$idDocumento} limit 1";
                    $destino = $this->doctrineHelper->getConnection()->execute($sqlEstrucutura)->fetchAll(PDO::FETCH_ASSOC);
					if(!count($destino)){
						$sqlEstrucutura = "select ncp.idestructura as identidaddestino 
										from mod_logistica.dat_documentocliente dc
										inner join mod_datosmaestros.nom_clientesproveedor ncp on dc.idcliente = ncp.idclientesproveedores
										where dc.iddocumento = {$idDocumento} limit 1";
						$destino = $this->doctrineHelper->getConnection()->execute($sqlEstrucutura)->fetchAll(PDO::FETCH_ASSOC);
					}
                    if(count($destino) == 0){
						$sqlDoc = "select s.iddocumentoinv as idpadre
									from mod_logactivofijotangible.dat_docorigen s
									where s.iddocorigen = {$idDocumento}";
						$documento = $this->doctrineHelper->getConnection()->execute($sqlDoc)->fetchAll(PDO::FETCH_ASSOC);
                        
						$sqlEstrucutura = "select dc.identidaddestino 
                            from mod_logactivofijotangible.dat_doctransfentidades dc
                            where dc.iddoctranfentidades = {$documento[0]['idpadre']} limit 1";
                        $destino = $this->doctrineHelper->getConnection()->execute($sqlEstrucutura)->fetchAll(PDO::FETCH_ASSOC);
                    }
                    $cuenta = $this->buscarCuentaEstructuraE($objPase->idcuenta, $destino[0]['identidaddestino']);
                    $objPase->idcuenta = $cuenta->idcuenta;
                }
                elseif ($sustitucion['valor'] == 308) {
                    /**
                     * Apertura de la cuenta para el origen del traspaso
                     */
					$sqlEstrucutura = "select d.iduebdestino as identidaddestino
										from mod_logistica.dat_documento d
										where d.iddocumento = {$idDocumento} limit 1";
					$destino = $this->doctrineHelper->getConnection()->execute($sqlEstrucutura)->fetchAll(PDO::FETCH_ASSOC);
					if(!is_numeric($destino[0]['identidaddestino'])){
						die("El campo donde se guarda el identidad destino no tiene valores. (mod_logistica.dat_documento.iduebdestino)");
					}
					$cuenta = $this->buscarCuentaEstructuraE($objPase->idcuenta, $destino[0]['identidaddestino'], true);
                    $objPase->idcuenta = $cuenta->idcuenta;
                }
            }
            if (count($refArray)) {
                return $refArray;
            }
        }
        $mComunAFT = ComunAFTModel::getInstance();
        $documento = Doctrine::getTable('DatDocumento')->find($idDocumento);
        $tipoDocumento = $mComunAFT->getDatosInterfazByIdOperacion($documento->idoperacion);
        switch ($pase['valor']['valor']) {
            case 102 :
                $objPase->importe = $this->importeTotalDocumentoByID($idDocumento, 'valoradquisicion');
                break;
            case 110 :
                $objPase->importe = $this->importeTotalDocumentoByID($idDocumento, 'depreciacion');
                break;
            case 121 :
                $objPase->importe = $this->importeTotalDocumentoByID($idDocumento, 'depreciacioncuc');
                $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 103 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeTotalDocumentoByID($idDocumento, 'valorcontable');
                if ($tipoDocumento['codigo'] == 'OPER_MOD_VALOR'
					|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_DIS' 
					|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_UH' 
					|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_DIS_UH'
					) {
                    $objPase->importe = $this->importeTotalDocumentoByID($idDocumento, 'diferenciavalor') +
                        $this->importeTotalDocumentoByID($idDocumento, 'diferenciadepreciacion');
                }
                break;
            case 115 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeTotalDocumentoByID($idDocumento, 'valorcontablealternativo');
                if ($tipoDocumento['codigo'] == 'OPER_MOD_VALOR'
					|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_DIS' 
					|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_UH' 
					|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_DIS_UH'
					) {
                    $objPase->importe = $this->importeTotalDocumentoByID($idDocumento, 'diferenciavaloralternativo') +
                        $this->importeTotalDocumentoByID($idDocumento, 'diferenciadepreciacionalternativo');
                }
                $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 123 :
                $objPase->importe = $this->importeRevaluacion($idDocumento, 1);
                break;
            case 124 :
                $objPase->importe = $this->importeRevaluacion($idDocumento, 0);
                break;
            case 125 :
                $objPase->importe = $this->importeRevaluacion($idDocumento, 1, 'diferenciadepreciacion');
                break;
            case 126 :
                $objPase->importe = $this->importeRevaluacion($idDocumento, 0, 'diferenciadepreciacion');
                break;
            case 300 :
                /**
                 * @todo Eliminar el 15/12/2018
                 */
                if ($tipoDocumento['codigo'] == 'OPER_DEPRECIACION') {
                    $objPase->importe = $this->importeTotalDocumentoByID($idDocumento, 'depreciacion') +
                            $this->importeTotalDocumentoByID($idDocumento, 'depreciacioncuc');
                }
                elseif ($tipoDocumento['codigo'] == 'OPER_MOD_VALOR'
						|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_DIS' 
						|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_UH' 
						|| $tipoDocumento['codigo'] == 'OPER_MOD_VALOR_DIS_UH'
						) {
                    /*$datos = $this->getQueryPasesMov($iddocumento, 'diferenciavaloralternativo', 'idcuentaactivoalternativa');
                    $datos = array_merge($this->getQueryPasesMov($iddocumento, 'diferenciadepreciacionalternativo', 'idcuentadepreciacionalternativa'), $datos);*/
                    $objPase->importe = $this->importeTotalDocumentoByID($idDocumento, 'diferenciavaloralternativo') +
                        $this->importeTotalDocumentoByID($idDocumento, 'diferenciadepreciacionalternativo') +
                        $this->importeTotalDocumentoByID($idDocumento, 'diferenciavalor') +
                        $this->importeTotalDocumentoByID($idDocumento, 'diferenciadepreciacion');
                }
                else {
                    $objPase->importe = $this->importeTotalDocumentoByID($idDocumento, 'valorcontable') +
                            $this->importeTotalDocumentoByID($idDocumento, 'valorcontablealternativo');
                }

                break;
            case 302:
                $objPase->importe = $this->importeTotalDocumentoByID($idDocumento, 'depreciacion') +
                        $this->importeTotalDocumentoByID($idDocumento, 'depreciacioncuc');
                break;
            /*             * *
             * Valores residuales
             */
            case 303:
                $objPase->importe = $this->valorResidualDocumentoByID($idDocumento, 0);
                break;
            case 305:
                $objPase->importe = $this->valorResidualDocumentoByID($idDocumento, 1);
                break;
            case 304:
                $objPase->importe = $this->valorResidualDocumentoByID($idDocumento, 0) +
                        $this->valorResidualDocumentoByID($idDocumento, 1);
                break;
        }
        $objPase->importemb = $objPase->importe;
        $objPase->importemo = $objPase->importe;
    }

    public function pasesRevaluacion($idDocumento, $pase, $signo, $activo = 1) {
        $cuenta = 'idcuentaactivo';
        $valor = 'diferencia';
        if ($activo == 2) {
            $cuenta = 'idcuentadepreciacion';
            $valor = 'diferenciadepreciacion';
        }
        $sqlImporte = "SELECT {$cuenta} as idcuenta, sum({$valor}) as importe "
                . "FROM mod_logactivofijotangible.dat_resumenrevaluacion "
                . "where iddocumentorevaluacion = {$idDocumento} and signo = {$signo} group by {$cuenta}";
        $valores = $this->doctrineHelper->getConnection()->execute($sqlImporte)->fetchAll(PDO::FETCH_ASSOC);
        $pases = array();
        foreach ($valores as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function importeRevaluacion($idDocumento, $signo, $column = 'diferencia') {
        $sqlImporte = "SELECT sum({$column}) as importe "
                . "FROM mod_logactivofijotangible.dat_resumenrevaluacion "
                . "where iddocumentorevaluacion = {$idDocumento} and signo = {$signo} ";
        $importe = $this->doctrineHelper->getConnection()->execute($sqlImporte)->fetchAll(PDO::FETCH_COLUMN);
        return $importe[0];
    }

    private function getCentroCostosActivos($iddocumento, $campo = 'depreciacion') {
        $sql = "select distinct rna.idcentrocosto , sum(coalesce(round(mra.{$campo},{$this->fRedondeo6}),0)) as importe 
                    from mod_logactivofijotangible.dat_regnumericoactivo rna
                inner join mod_logactivofijotangible.dat_movregnumerico mr on mr.idregnumerico = rna.idregnumerico
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mra ON mra.idmovregnumerico = mr.idmovregnumerico
                inner join mod_logistica.dat_movimiento m on m.idmovimiento = mr.idmovimiento
                inner join mod_logactivofijotangible.dat_registronumerico dr on dr.idregnumerico = rna.idregnumerico --and dr.idproducto = m.idproducto
                where m.iddocumento = {$iddocumento} group by rna.idcentrocosto having sum(coalesce(mra.{$campo},0)) > 0";
        return LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
    }

    /**
     * @param $idDocumento
     * @param string $campo
     * @return int
     */
    private function importeTotalDocumentoByID($idDocumento, $campo = '') {
		$campo = "mrna.{$campo}";
		if($campo == 'depreciacion'){
			$campo = "coalesce({$campo} , mrna.depreciacionacumulada)";
		}
		if($campo == 'depreciacioncuc'){
			$campo = "coalesce({$campo} , mrna.depreciacionacumuladaalternativo)";
		}
        $sql = "SELECT sum(round(abs({$campo}),{$this->fRedondeo6})) as importe
                FROM mod_logistica.dat_movimiento dm
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovimiento = dm.idmovimiento
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico                          
                WHERE dm.iddocumento = {$idDocumento}";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        return count($datos) > 0 ? $datos[0]['importe'] : 0;
    }

    private function valorResidualDocumentoByID($idDocumento, $alternativo = 0) {
        $campo = $alternativo == 1 ? "(mrna.valorcontablealternativo - mrna.depreciacioncuc)" : "(mrna.valorcontable - mrna.depreciacion)";
        $sql = "SELECT sum(round({$campo},{$this->fRedondeo6})) as importe
                FROM mod_logistica.dat_movimiento dm
                INNER JOIN mod_logactivofijotangible.dat_movregnumerico mrn on mrn.idmovimiento = dm.idmovimiento
                INNER JOIN mod_logactivofijotangible.dat_movregnumericoactivo mrna on mrna.idmovregnumerico = mrn.idmovregnumerico                          
                WHERE dm.iddocumento = {$idDocumento}";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        return count($datos) > 0 ? $datos[0]['importe'] : 0;
    }

}
