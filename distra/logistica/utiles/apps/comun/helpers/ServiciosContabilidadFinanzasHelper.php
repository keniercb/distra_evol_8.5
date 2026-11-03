<?php

/**
 * Clase especializada en el trabajo con los servicios que se utilizan
 * de contabilidad y finanzas
 *
 *
 */
class ServiciosContabilidadFinanzasHelper implements ISingletonClass {

    /**
     * Una instancia unica de ServiciosContabilidadFinanzasHelper
     *
     * @var ServiciosContabilidadFinanzasHelper
     */
    private static $instance = null;

    /**
     * Variables internas de la clase
     *
     */
    private $integrator = null;
    private $varglobal = null;

    /**
     * Inicializando las variables
     *
     */
    private function __construct() {
        $this->integrator = ZendExt_IoC::getInstance();
        $this->varglobal = ZendExt_GlobalConcept::getInstance();
    }

    /**
     * Creates a new instance of class ServiciosContabilidadFinanzasHelper
     *
     * @return ServiciosContabilidadFinanzasHelper
     */
    static function __init() {

        if (null === self::$instance) {
            self::$instance = new ServiciosContabilidadFinanzasHelper;
        }
        return self::$instance;
    }

    /**
     * Metodo que devuelve las cuentas controladas por cada subsistema
     * se accede a traves de contabilidad
     *
     * @return stdClass
     */
    public function obtenerCuentasCtrladasPorSusbt($idestructura, $idsubsistema) {
        try {
            return $this->integrator->contabilidad->obtenerCuentasCtrladasPorSusbt($idestructura, $idsubsistema);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve el saldo contable de las cuentas segun un dia determinado
     * @params $idestructura, $fechacontable, $idcuentas(puede ser un arreglo),$orderby(criterio por ordenar)
     * @return array
     */
    public function obtenerSaldoDiarioContableCuenta($idestructura, $fechacontable, $idcuentas, $orderby = 'idcuenta') {
        try {
            return $this->integrator->contabilidad->obtenerSaldoContableCuenta($idestructura, $fechacontable, $idcuentas, $orderby);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los datos de las cuentas dado sus ids
     *
     * @param $arrayidscuentas arreglo de idcuentas
     *
     * @return stdClass
     * se accede a traves de contabilidad
     */
    public function obtenerCuentasPorId($arrayidscuentas) {

        try {

            return $this->integrator->contabilidad->obtenerCuentasPorId($arrayidscuentas);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los saldos de la cuenta de un ejercicio
     *
     * @param $arrayidscuentas arreglo de idcuentas,
     *                         $entidad el id de la entidad,$EjercicioContabilidad ejercicio
     *                         del subsitema
     *                         se accede a traves de contabilidad
     *
     * @return stdClass
     */
    public function obtenerSaldoCuentas($arrayidscuentas, $ejercicioContabilidad, $entidad = null) {

        try {
            return $this->integrator->contabilidad->obtenerSaldoCuentas(
                            $arrayidscuentas, ($entidad == null ? $this->varglobal->Estructura->idestructura : $entidad), $ejercicioContabilidad
            );
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve la estructra
     *
     * @param $idestructura el di de la estructura,
     *                      se accede a traves de contabilidad
     *
     * @return stdClass
     */
    public function obtenerEstructuraE($idestructura = null) {

        try {
            return $this->integrator->contabilidad->obtenerEstructuraE(
                            ($idestructura == null) ?
                            $this->varglobal->Estructura->idestructura : $idestructura
            );
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve una interfaz de comprobante
     *
     * se accede a traves de contabilidad
     *
     * @return window
     */
    public function mostrarComprobanteTipo() {

        try {
            return $this->integrator->contabilidad->mostrarComprobanteTipo();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los datos de la cuenta dado su id
     *
     * se accede a traves de contabilidad
     * $param idcuenta identificador de la cuenta
     *
     * @return stdClass
     */
    public function obtenerCuentaPorId($idcuenta) {

        try {

            return $this->integrator->contabilidad->obtenerCuentaPorId($idcuenta);
        } catch (Exception $e) {
            return $e;
        }
    }

    /**
     * Metodo que devuelve el redondeo de las cuentas
     *
     * se accede a traves de contabilidad
     *
     * @return array
     */
    public function obtenerCuentaRedondeo() {

        try {
            return $this->integrator->contabilidad->obtenerCuentaRedondeo();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve el js de comprobante
     *
     * se accede a traves de contabilidad
     *
     * @return js
     */
    public function obtenerComprobanteClass() {

        try {
            return $this->integrator->contabilidad->dir_ComprobanteClass();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve el js de comprobante
     *
     * se accede a traves de contabilidad
     *
     * @return js
     */
    public function obtenerComprobanteUI() {

        try {
            return $this->integrator->contabilidad->dir_ComprobanteUI();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve un js que se utiliza en comprobante de operaciones
     *
     * se accede a traves de contabilidad
     *
     * @return js
     */
    public function dirComunjs() {

        try {
            return $this->integrator->contabilidad->dirComun_js();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve un plugin
     *
     * se accede a traves de contabilidad
     *
     * @return js
     */
    public function dirComunPagingToolbar() {

        try {
            return $this->integrator->contabilidad->dirComun_PagingToolbar();
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los centros de niveles por area
     *
     * se accede a traves de costo
     *
     * @param idarea el valos del ide area, idestructura
     *
     * @return array
     */
    public function obtenerCentrosNivelPorAreas($idarea, $idestructura = null) {

        try {
            return $this->integrator->costo->obtenerCentrosNivelPorAreas(
                            $idarea, ($idestructura == null) ? $this->varglobal->Estructura->idestructura : $idestructura
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Metodo que devuelve los centros de niveles por id
     *
     * se accede a traves de costo
     *
     * @param idcliente
     *
     * @return array
     */
    public function obtenerCentroNivelPorId($idcliente) {

        try {
            return $this->integrator->costo->obtenerCentroNivelPorId($idcliente);
        } catch (Exception $e) {
            return array();
        }
    }

    /**
     * Metodo que devuelve los centros de costo dado
     * el idestrucutra
     *
     * se accede a traves de costo
     *
     * @param idestructura
     *
     * @return array
     */
    public function obtenerCentrosCosto($idestructura) {

        try {
            return $this->integrator->costo->obtenerCentrosCosto($idestructura);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los centros de costo dado
     * el idestrucutra
     *
     * se accede a traves de costo
     *
     * @param idestructura ,start,limit,filtro (ejemplo 'centro1'), arrIdsCentros
     *
     * @return array
     */
    public function obtenerCentrosCostoFiltro($idEstructura, $start = null, $limit = null, $filter = null, $arrIdsCentros = null, $ultimoNivel = null) {

        try {
            if (!$filter) {
                unset($filter);
                $filter = null;
            }
            return $this->integrator->costo->obtenerCentrosCostoFiltro($idEstructura, $start, $limit, $filter, $arrIdsCentros, $ultimoNivel);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los centros de costo dado
     * el idestrucutra permite filtrar por codigo y denominacion
     *
     * se accede a traves de costo
     *
     * @param $idestructura ,$start,$limit,$filtro
     *
     * @return array
     */
    public function getCentrosCosto($idestructura, $start, $limit, $filtro = array()) {

        try {
            if (!$idestructura) {
                $idestructura = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;
            }
            return $this->integrator->costo->getCentrosCosto($idestructura, $start, $limit, $filtro);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los centros de costo de lasestructuras
     * no formales
     *
     * se accede a traves de costo
     *
     * @param estructura
     *
     * @return stdClass
     */
    public function obtenerCentrosCostoNAE($estructura) {

        try {
            return $this->integrator->costo->obtenerCentrosCostoNAE($estructura);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los centros de costo por cuenta
     *
     * se accede a traves de costo
     *
     * @param $idestructura , $idcuenta
     *
     * @return array
     */
    public function obtenerCentrosPorCuenta($idestructura, $idcuenta) {

        try {
            return $this->integrator->costo->obtenerCentrosPorCuenta($idestructura, $idcuenta);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los elementos asociados a un centro
     *
     * se accede a traves de costo
     *
     * @param $idestructuracomun , $idcentrocosto
     *
     * @return array
     */
    public function obtenerElementosAsociadosACentro($idestructuracomun, $idcentrocosto) {

        try {
            return $this->integrator->costo->obtenerElementosAsociadosACentro(
                            $idestructuracomun, $idcentrocosto
            );
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function obtenerElementosGasto($idestructuracomun) {

        try {
            $elementos = $this->integrator->costo->obtenerElementosGastoHoja(
                    $idestructuracomun
            );
            /* foreach ($elementos as $pos => $elem) {
              if (abs($elem->ordenizq - $elem->ordender) != 1) {
              unset($elementos[$pos]);
              }
              } */
            return array_values($elementos);
        } catch (Exception $e) {
            return array();
        }
    }

    /**
     * Metodo que devuelve los elementos por su id
     *
     * se accede a traves de costo
     *
     * @param $idelementogasto
     *
     * @return array
     */
    public function obtenerElementoObjetoPorId($idelementogasto) {

        try {
            return $this->integrator->costo->obtenerElementoObjetoPorId($idelementogasto);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los elementos por su id
     *
     * se accede a traves de finanzas
     *
     * @param  $asientos , $idestructura, $idsubsistema
     *
     * @return array
     */
    public function insertarDerechoObligacionSubsistemaExterno($asientos, $idestructura, $idsubsistema) {
        try {
            return $this->integrator->copa->InsertarDerechoObligacionSubsistemaExterno(
                            $asientos, $idestructura, $idsubsistema
            );
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * @param $arrayData
     * @return mixed
     * @throws Exception
     */
    public function cancelarDuoContabilizadoExterno($arrayData) {
        try {
            return $this->integrator->copa->CancelarDuoContabilizadoExterno($arrayData);
        } catch (Exception $e) {
            throw $e;
        }
    }

    /**
     * Metodo que devuelve las cuentas bancarias
     *
     * se accede a traves de finanzas
     *
     * @param  $idestrucPadrePorSubord
     *
     * @return array
     */
    public function obtenerCuentasBancarias($idestrucPadrePorSubord) {

        try {
            return $this->integrator->finanzas->obtenerCuentasBancarias($idestrucPadrePorSubord);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve la descripcion de los centros de costos
     *
     * se accede a traves de costo
     *
     * @param  $idcliente
     *
     * @return array
     */
    public function descripcionCentro($idcliente) {

        try {
            return $this->integrator->costo->descripcionCentro($idcliente);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los elementos que son hijas de una entidad
     *
     * se accede a traves de costo
     *
     * @param  $idestructuracomun
     *
     * @return stdClass
     */
    public function obtenerElementosHoja($idestructuracomun) {
        try {
            /**
             * @todo Buscar que significa el 3 como parametro
             */
            return $this->integrator->costo->obtenerElementosGastoHoja($idestructuracomun, 3);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Metodo que devuelve los elos centro de costo de una estructura
     *
     * se accede a traves de costo
     *
     * @param  $idestructuracomun
     *
     * @return stdClass
     */
    public function obtenerCentrosEstructura($idestructuracomun) {

        try {
            return $this->integrator->costo->centrosEstructura($idestructuracomun);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function obtenerClasificadorCuentas($idEntidad = null, $idCuenta = null, $filter = array(), $argExc = true, $idsubsistema = '') {
        try {
            if (!$idEntidad) {
                $idEntidad = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;
            }
            $cuentas = $this->integrator->contabilidad->obtenerClasificadorCuentas($idEntidad, $idCuenta, $filter, $argExc, $idsubsistema);
            return $cuentas['datos'];
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    /**
     * Obtienes las cuentas asociadas a uno o varios centros de costo
     *
     * @param type $idcentro (puede ser un arreglo o un valor)
     *
     * @return type
     */
    public function obtenerCuentasAsociadasACentros($idcentro, $idmoneda = false) {
        try {
            $sql = "select refa.idcuentapadreref as idcuenta from mod_contabilidad.dat_refapertura refa
                      inner join mod_contabilidad.conf_apertura cfga on refa.idconfapertura = cfga.idconfapertura
                      inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = refa.idcuenta
                      where cfga.concepto = 'nom_centrocosto' and refa.idrefnomenclador = {$idcentro}";
            if ($idmoneda) {
                //$sql .= " and nc.idmoneda = {$idmoneda}";
            }
            $cuentas = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_OBJ);
            $arrayRes = array();
            foreach ($cuentas as $cuenta) {
                $cta = $this->obtenerCuentaPorId($cuenta->idcuenta);
                $cta->descripcioncta = $cta->text;
                array_push($arrayRes, $cta);
            }

            return $arrayRes;
            //return $this->integrator->costo->obtenerCuentasGastoPorCentros($idcentro);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function obtenerElementosPorCuentaCentro($idEstructura, $idCuenta, $idCentro) {
        $andcuenta = ($idCuenta) ? " AND refa.idcuentapadreref = {$idCuenta}" : "";
        $sql = "select idcuenta from mod_contabilidad.dat_refapertura refa
                      inner join mod_contabilidad.conf_apertura cfga on refa.idconfapertura = cfga.idconfapertura
                      where cfga.concepto = 'nom_centrocosto' and refa.idrefnomenclador = {$idCentro}
                      {$andcuenta}";

        $cuentas = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_OBJ);
        $datos = $this->obtenerElementosGasto($idEstructura);
        $idCuenta = $this->obtenerCuentaPorId($cuentas[0]->idcuenta);
        foreach ($datos as $pos => $elemento) {
            $concat = $idCuenta->concatcta . '.' . $elemento->concat;
            $cuenta = $this->obtenerCuentaPorConcat($idEstructura, $concat);
            if (!$cuenta->idcuenta) {
                unset($datos[$pos]);
            }
        }
        return array_values($datos);
    }

    public function obtenerCuentaPorConcat($idEstructura, $concat) {
        try {
            return $this->integrator->contabilidad->obtenerCuentaPorConcat($idEstructura, $concat);
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    public function getComprobanteComponent() {
        try {
            return $this->integrator->contabilidad->getComprobanteComponent();
        } catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    public function getCuentasBancarias($idestructuracomun, $abiertas = 1) {
        try {
            return $this->integrator->banco->obtenerCuentasBancarias($idestructuracomun, $abiertas);
        } catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    public function obtenerCondicionesPago() {
        try {
            return $this->integrator->copa->obtenerCondicionesPago();
        } catch (Exception $exc) {
            return $exc->getMessage();
        }
    }

    /**
     *
     * @param numeric $idsubsitema
     * @param numeric $idestructura
     * @param boolean $flag
     */
    public function unificacionSubsistema($idsubsitema, $idestructura, $flag) {
        $this->integrator->contabilidad->unificacionSubsistema($idsubsitema, $idestructura, $flag);
    }

    public function existeComprobanteDocumento($idDocContablizar, $subsistema) {
        return $this->integrator->contabilidad->existeComprobanteDocumento($idDocContablizar, $subsistema);
    }

    public function verificarDuoContabilizadoExterno($iddocumento, $importe = 0) {
        try {
            return $this->integrator->copa->verificarDuoLiquidadoExterno($iddocumento, $importe);
        } catch (Exception $exc) {
            
        }
    }

    public function anularComprobante($documento) {
        LogisticaDoctrineHelper::__init()->commitTransaction();
        $idComprobante = $documento->idcomprobante;
        $comprobante = $this->getInstanceComprobanteService()->revertirComprobanteExterno(array($idComprobante), "{$documento->observaciones} (Anulado)");
        if (count($comprobante) > 0) {
            $iddocNC = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
                    'creditoLog', $documento->idestructuracomun, LogisticaGlobal::SUBSISTEMA_FAC
            );
            if ($iddocNC->iddoc && $iddocNC->iddoc == $documento->iddoc) {
                $this->cancelarLiquidacionNC($idComprobante, $documento, $comprobante[$idComprobante]);
            } else {
                $this->cancelarDuoContabilizadoExterno(array(
                    'iddocumento' => $documento->iddocumento,
                    'idcomprobante' => $comprobante[$idComprobante]['idcomprobante'],
                    'numerocomprobante' => $comprobante[$idComprobante]['numero'],
                    'fechacomprobante' => $comprobante[$idComprobante]['fecha'],
                ));
            }
            $documento->idcomprobante = $comprobante[$idComprobante]['idcomprobante'];
        }
    }

    public function getInstaceCopaService() {
        return $this->integrator->copa->instanceDerechoService();
    }

    public function getInstanceComprobanteService() {
        return $this->integrator->contabilidad->instanceComprobanteService();
    }

    public function actualizarDerechoObligacion($obligaciones, $idestructura, $signo = '+') {
        $conn = Zend_Registry::get('conexion');
        foreach ($obligaciones as $ob) {
            $importe = ($signo == '+') ? abs($ob->importe) : abs($ob->importe) * -1;
            $tipoCancelacion = ($signo == '+') ? 1 : 2;
            $arrdata = array(
                'numero' => $ob->numero,
                'fecha' => $ob->fechacomprobante,
                'comentario' => $ob->comentario,
                'importemo' => $importe,
                'importemb' => $importe,
                'idestructura' => $idestructura,
                'idcuenta' => $ob->idcuenta,
                'idcliente' => $ob->idcliente,
                'idperiodo' => $ob->idperiodo,
                'numcmp' => $ob->numcomprobante,
                'iddoc' => $ob->tipodocumento
            );
            $derecho = $conn->execute(
                            "select ddo.idderechouobligacion as idduo, opc.idmoneda from mod_cobroypago.dat_derechouobligacion ddo
                    inner join mod_cobroypago.dat_origen dor on dor.idderechouobligacion = ddo.idderechouobligacion
                    inner join mod_cobroypago.dat_operacioncp opc on opc.idderechouobligacion = ddo.idderechouobligacion
                    where ddo.idcuenta = {$ob->idcuenta} and dor.iddocumento = {$ob->iddocumentoorigen}"
                    )->fetchAll(PDO::FETCH_ASSOC);
            $arrdata['idmoneda'] = $derecho[0]['idmoneda'];
            $this->integrator->copa->ActualizarDerechoObligacion($derecho[0]['idduo'], array('tipoCancelacion' => $tipoCancelacion, 'liquidadomb' => $importe, 'pagadomb' => $importe, 'liquidaDirecto' => true, 'resumenLiq' => $arrdata));
        }
    }

    public function cancelarLiquidacionNC($comprobante, $documento) {
        $facturaService = new FacturacionService();
        $doctrineHelper = LogisticaDoctrineHelper::__init();
        $periodo = ServiciosConfiguracionGeneralHelper::__init()->getPeriodoActualSubsistema(
                $documento['idestructuracomun'], LogisticaGlobal::SUBSISTEMA_FAC
        );
        $docOrigen = $doctrineHelper->getConnection()->execute(
                        "select ddp.idpadre from mod_logistica.dat_documentopadre ddp where ddp.iddocumento = {$documento['iddocumento']}"
                )->fetchAll(PDO::FETCH_COLUMN);
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        $notaCredito = Doctrine::getTable('DatDocfactura')->find($documento['iddocumento']);
        $idcuenta = $this->getCuentaClienteNC($notaCredito, $moneda->idmoneda);
        $obligaciones = array();
        if ($idcuenta) {
            $pase = $doctrineHelper->getConnection()->execute(
                            "select sum(dp.importemonedaoriginal) as importe from mod_contabilidad.dat_pase dp
                    inner join mod_contabilidad.dat_asiento da on da.idasiento = dp.idasiento
                    where da.idcomprobante = {$comprobante['idComprobante']} and dp.idcuenta = {$idcuenta}"
                    )->fetchAll(PDO::FETCH_ASSOC);
            $ob = new stdClass();
            $ob->numero = $facturaService->getNumeroFactura($documento['iddocumento']);
            $ob->fechacomprobante = $comprobante['fechaComprobante'];
            $ob->comentario = 'Derecho de cobro de factura';
            $ob->importe = $pase[0]['importe'];
            $ob->idcuenta = $idcuenta;
            $ob->idcliente = $notaCredito->idcliente;
            $ob->idperiodo = $periodo;
            $ob->numcomprobante = $comprobante['numComprobante'];
            $ob->tipodocumento = $documento['iddoc'];
            $ob->iddocumentoorigen = $docOrigen[0];
            if (count($pase)) {
                array_push($obligaciones, $ob);
            }
        }
        if ($moneda->idmonedaalternativa) {
            $idcuentaalt = $this->getCuentaClienteNC($notaCredito, $moneda->idmonedaalternativa);
            if ($idcuentaalt) {
                $paseAlt = $doctrineHelper->getConnection()->execute(
                                "select sum(dp.importemonedaoriginal) as importe from mod_contabilidad.dat_pase dp
                    inner join mod_contabilidad.dat_asiento da on da.idasiento = dp.idasiento
                    where da.idcomprobante = {$idComprobante} and dp.idcuenta = {$idcuentaalt}"
                        )->fetchAll(PDO::FETCH_ASSOC);
                $copyOb = clone $ob;
                $copyOb->importe = $paseAlt[0]['importe'];
                $copyOb->idcuenta = $idcuentaalt;
                if (count($paseAlt)) {
                    array_push($obligaciones, $copyOb);
                }
            }
        }
        $this->actualizarDerechoObligacion($obligaciones, ZendExt_GlobalConcept::getInstance()->Estructura->idestructura, '-');
    }

    public function getCuentaClienteNC($documento, $moneda) {
        $cliente = ServiciosConfiguracionGeneralHelper::__init()->getCuentasClienteProveedor($documento->idcliente);
        foreach ($cliente['cuentas'] as $pos => $cuenta) {
            if ($cuenta['idmoneda'] == $moneda && $cuenta['idclasificacion'] == 1 && $documento->idcondicionpago == $cuenta['idterminodepago']
            ) {
                return $cuenta['idcuenta'];
            }
        }
        return false;
    }

    public function salvarComprobanteGeneradoDesdeSubsistemaExterno($agIdEstructurae, $agIdSubsistema, $agTipoComprobante, $agEstadoComprobante,
            $agFechaEmision, $agDetalle, $agObservacion, $agArrayAnotaciones) {
        try {

            return $this->integrator->contabilidad_financiera->salvarComprobanteGeneradoDesdeSubsistemaExterno($agIdEstructurae, $agIdSubsistema, $agTipoComprobante, $agEstadoComprobante,
                            $agFechaEmision, $agDetalle, $agObservacion, $agArrayAnotaciones);
        } catch (Exception $e) {
            return $e->getMessage();
        }
    }

    public function anticiposPendientesByClienteProveedor($idEstructura, $idClienteProveedor, $tipoAnt, $idAnticipo = 0) {
        return $this->integrator->copa->anticiposPendientesByClienteProveedor($idEstructura, $idClienteProveedor, $tipoAnt, $idAnticipo = 0);
    }

    /*   Servicio para liquidar anticipo(Parametro dataLiqAnticipo se describe abajo)
     *   idAnticipo //id del anticipo a liquidar
     *   tipoAnticipo //1-Cobro Anticipado, 2 -Pago Anticipado
     *   importe //Importe a liquidar
     *   comentario //Comentario de la operaci�n
     *   idCmp //id del comprobante
     *   numCmp //numero del comprobante
     *   fechaCmp //fecha del comprobante
     */

    public function liquidarAnticipoExterno($dataLiqAnticipo, $tipoContabilizacion = 1) {
        return $this->integrator->copa->liquidarAnticipoExterno($dataLiqAnticipo, $tipoContabilizacion = 1);
    }

}
