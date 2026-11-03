<?php

/**
 * @class RecepcionModel
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Entrada
 * @author Dainier Aguila Medina
 * @copyright (c) 2014, XETID
 * @version 1.0
 */
class RecepcionModel extends EntradaModel
{
    const OPER_FACT = 'OPER_INV_FACT';
    protected $reclamacionService, $compraService;
    private $_tipoTasa, $_idmonedacontable;

    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->trazaDocumento = new TrazasDocumentoModel();
        // $this->compraService = new CompraService();
        $apertura = new AperturaService();
        /*if ($conf['contintegrada'] && !$apertura->existenTodosAprobados()) {
            throw new LogisticaException('LOG_LB_CIERE_001', null, null);
        }*/
        $this->tryInyector();
        $this->reclamacionService = new ReclamacionService();
        $config = new ConfiguracioninventarioService();
        $result = $config->devolverConfiguracion($this->idestructuracomun);
        $this->_tipoTasa = $result['idtipotasa'];
        $this->_idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;
    }

    public function cargaInicial()
    {
        $datos = parent::cargaInicial();
        $config = new ConfiguracioninventarioService();
        $result = $config->devolverConfiguracion($this->idestructuracomun);
        $this->_tipoTasa = $result['idtipotasa'];
        $datos['porfactura'] = $result['registrarcantidad'];
        $datos['monedas'] = array(
            'contable' => $this->tipoMoneda['codCont'], 'alternativa' => $this->tipoMoneda['idalternativa']
        );
        return $datos;
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @param array $datosDoc Arreglo de datos del documento con sus preductos.
     * @param boolean $dql [Opcional]
     * @return array
     */
    public function devolverDocumentos($datosDoc = array(), $dql = false)
    {
        $query = parent::devolverDocumentos($datosDoc);
        $query->addSelect('d.idcomprobante');
        //$query->addSelect('(SELECT round(SUM(round(dm.importecontable,2)),2) FROM DatMovimientos dm WHERE dm.iddocumento = d.iddocumento) as importecontable');
        //$query->addSelect('(SELECT round(SUM(round(dm1.importealternativo,2)),2) FROM DatMovimientos dm1 WHERE dm1.iddocumento = d.iddocumento) as importealternativo');
        $this->cargarTransportador($query, 'd');
        $recepcion = new DatRecepcion();

        $recepcion->getJoinDatRecepcion($query, $datosDoc, 'd');
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->cargarClientesDocumentos(
                $this->doctrineHelper->addQueryLimits($query, $datosDoc)->fetchArray()
            )
        );
    }

    /**
     * Adiciona un documento de apertura.
     * @param Array $datosDoc Arreglo de datos del documento con sus preductos.
     * @return integer
     */
    public function adicionarDocumento($datosDoc = array())
    {
        if (is_array($datosDoc['paramsprod'])) {
            $paramsProd = $datosDoc['paramsprod'];
        } else {
            $paramsProd = (array)json_decode($datosDoc['paramsprod']);
        }

        if ($datosDoc['iddocumento']) {
            $objDoc = Doctrine::getTable('DatDocumento')->find($datosDoc['iddocumento']);
            if (
                $objDoc->estado == EstadoDocumentoModel::ESTADO_CONTABILIZADO ||
                $objDoc->estado == EstadoDocumentoModel::ESTADO_PENDIENTE) {
                if (!is_numeric($objDoc->idcomprobante)) {
                    if (is_numeric($datosDoc['idcondicionpago'])) {
                        $objDocCl = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($datosDoc['iddocumento']));
                        $recepcion = new DatRecepcion();
                        $cliente = new DatDocumentoCliente();
                        if ($datosDoc['iddocumento']) {
                            $recepcion->assignIdentifier($datosDoc['iddocumento']);
                            $cliente->assignIdentifier($objDocCl[0]->iddocumentocliente);
                        }
                        $recepcion->idcondicionpago = $datosDoc['idcondicionpago'];
                        $cliente->idcondicionpago = $datosDoc['idcondicionpago'];
                        $recepcion->save();
                        $cliente->save();
                    }
                    if ($objDoc->estado == EstadoDocumentoModel::ESTADO_CONTABILIZADO) {
                        $this->procesarConceptos($datosDoc['conceptosimporte'], $datosDoc['iddocumento'], true);
                    }
                    return $datosDoc['iddocumento'];
                } else {
                    return $datosDoc['iddocumento'];
                }
            }
        } else {
            if ($datosDoc['idpadre']) {
                $datosAux = $this->cargarProductosDocumentoExterno($paramsProd)['datos'];
                $idsProdAux = array();
                foreach ($datosAux as $p) {
                    if ($p['idproducto']) {
                        $datosDoc['idproductos'][] = $p;
                        $idsProdAux[] = $p['idproducto'];
                    } else {
                        $datosDoc['tarjeta'][] = $p;
                    }
                }
                if (count($idsProdAux)) {
                    $idsProds = implode(',', $idsProdAux);
                    $desactivados = $this->doctrineHelper->getConnection()->execute(
                        "SELECT pi.idproducto
                  FROM mod_logistica.dat_productoinactivo pi 
                  INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = pi.idproducto
                  WHERE pi.idproducto IN ({$idsProds})"
                    )->fetchAll(PDO::FETCH_COLUMN);
                    if (count($desactivados)) {
                        return array('inactivos' => $desactivados);
                    }
                }

            } elseif ($paramsProd['idsolicitud711']) {
                $datosAux = $this->planificacionHelper->Productos711DadoEntidad(
                    $this->global->Estructura->idestructura, $paramsProd['idsolicitud711']
                );
                foreach ($datosAux as $p) {
                    $dql = $this->getProductoModel()->getMaestroProducto()->getQueryIndicador()->andWhere('ind.idindicador = ?', array($p['idindicador']));
                    $this->configuracionHelper->getQueryJoinUnidadMedida(
                        $dql, 'ind', 'umedida', 'umedida.abreviaturaunidadmedida AS umedida, umedida.decimales AS decimales', 'leftJoin'
                    );
                    $this->getProductoModel()->getMaestroProducto()->addQueryJoinIndicadorHoja($dql);
                    $dql->addSelect("(SELECT p.idproducto FROM DatProductoLogistica p WHERE p.idindicador = ind.idindicador AND p.idestructura = {$datosDoc['idestructuracomun']} LIMIT 1) AS idproducto");
                    $dql->addSelect("(SELECT p1.idclasificacioncontable FROM DatProductoLogistica p1 WHERE p1.idindicador = ind.idindicador AND p1.idestructura = {$datosDoc['idestructuracomun']} LIMIT 1) AS idclasificacioncontable");
                    $dql->addSelect("{$datosDoc['idestructuracomun']} AS idestructura,{$p['sumacantidad']} as cantfactura,"
                        . "(CASE WHEN indh.tipocontrol = 2 THEN 1 ELSE 0 END) AS tienelote, "
                        . "(CASE WHEN indh.tipocontrol = 3 THEN 1 ELSE 0 END) AS equipo, "
                        . "(CASE WHEN indh.tipocontrol = 4 THEN 1 ELSE 0 END) AS municion"
                    );
                    $existe = $dql->fetchArray();
                    $existe[0]['idumedidacrc'] = $existe[0]['idumedida'];
                    if (is_numeric($existe[0]['idproducto'])) {
                        $datosDoc['idproductos'][] = $existe[0];
                    } else {
                        unset($existe[0]['idproducto']);
                        $datosDoc['tarjeta'][] = $existe[0];
                    }
                }
            }
        }
        if (isset($datosDoc['plan711']) || isset($paramsProd['plan711'])) {
            unset($datosDoc['tarjeta']);
            foreach ($datosDoc['arridindicador'] as $p) {
                $p['preciocontable'] = $p['precio'] ? $p['precio'] : 0;
                $p['cantidad'] = 0;
                unset($p['iddocumento']);
                if (is_numeric($p['existe'])) {
                    $p['idproducto'] = $p['existe'];
                    $datosDoc['idproductos'][] = $p;
                } else {
                    $datosDoc['tarjeta'][] = $p;
                }
            }
        }
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $datosDoc['observaciones'] = $datosDoc['observaciones'] ? $datosDoc['observaciones'] : null;
        $documento = parent::adicionarDocumento($datosDoc);
        $this->adicionarTransportador($documento, $datosDoc);
        $recepcion = new DatRecepcion();
        if ($datosDoc['iddocumento']) {
            $recepcion->assignIdentifier($datosDoc['iddocumento']);
        }
        $datosDoc['salidafactura'] = ($datosDoc['salidafactura'] == 1) ? 1 : 0;
        $recepcion->synchronizeWithArray($datosDoc);
        $documento->DatRecepcion = $recepcion;
        $documento->save();
        $this->trazaDocumento->guardarTraza('Documento adicionado', $documento->iddocumento);

        if ($datosDoc['tarjeta'] && $datosDoc['tarjeta']['idindicador']) {
            $datosDoc['tarjeta']['iddocumento'] = $documento->iddocumento;
            $datosDoc['tarjeta']['idestructura'] = $datosDoc['idestructuracomun'];
            $this->producto->adicionarProductoEstructuras(array($datosDoc['tarjeta']));
        } elseif ($datosDoc['tarjeta']) {
            foreach ($datosDoc['tarjeta'] as $index => $prod) {
                $datosDoc['tarjeta'][$index]['iddocumento'] = $documento->iddocumento;
                $datosDoc['tarjeta'][$index]['idestructura'] = $datosDoc['idestructuracomun'];
            }
            $this->producto->adicionarProductoEstructuras($datosDoc['tarjeta']);
        }
        if (is_array($datosDoc['idproductos']) && count($datosDoc['idproductos']) > 0) {
            $mov = $this->getProductoModel()->adicionarMovimientos(
                $documento->iddocumento, $datosDoc['idproductos'], LogisticaMovimientoModel::SIGNO_MOV_SUMA
            );
        }
        if ($datosDoc['portipodoc']) {
            $productos = array_merge((array)$datosDoc['tarjeta'], (array)$datosDoc['idproductos']);
            $this->adicionarProductosXTipoDoc($productos, $documento->iddocumento, $config['registrarcantidad'], $config['categoriaproducto']);
        }
        if (is_array($datosDoc['productos']) && count($datosDoc['productos']) > 0) {
            $datosDoc['productos'][0]['entrada'] = true;
            $this->producto->modificarMovimientos($datosDoc['productos']);
            if ($documento->estado == EstadoDocumentoModel::ESTADO_ELABORACION && $config['registrarcantidad']) {
                $this->adicionarMovrecepcion($datosDoc['productos']);
            }
            if ($documento->estado == EstadoDocumentoModel::ESTADO_ELABORACION && $config['registrarcantidad']) {
                $dif = $this->cargarDiferencias(array('iddocumento' => $documento->iddocumento));
                if (count($dif) > 0) {
                    $this->registrarDiferencias($dif, true);
                }
            }
        }
        /*if ($datosDoc['tasa']) {
            $this->procesarMonedas($datosDoc['monedas'], $documento->iddocumento, $datosDoc['tasa']);
        }*/
        $this->procesarConceptos($datosDoc['conceptosimporte'], $documento->iddocumento);
        if (is_numeric($datosDoc['idcliente'])) {
            $idClientes = array();
            $tipocliente = (self::devolverTipocliente($datosDoc['idcliente']) > 0) ? LogisticaGlobal::TIPO_CLIENTE_DEPOSITO :
                LogisticaGlobal::TIPO_CLIENTE_CLIENTE;
            $idClientes[] = array(
                'idcliente' => $datosDoc['idcliente'], 'tipocliente' => $tipocliente,
                'idcondicionpago' => $datosDoc['idcondicionpago']
            );
            $this->adicionarClientes($documento->iddocumento, $idClientes, true);
        }

        if (is_numeric($datosDoc['idpadre'])) {
            $this->adicionarDocumentoPadre($documento->iddocumento, $datosDoc['idpadre']);
        }
        if (isset($paramsProd['idsolicitud711']) && is_numeric($paramsProd['idsolicitud711'])) {
            $this->adicionarSolicitudPadre($documento->iddocumento, $paramsProd['idsolicitud711']);
        }
        //return $documento->iddocumento;
        return array('iddocumento' => $documento->iddocumento, 'numeroref' => $documento->numeroref, 'fechacontable' => $documento->fechacontable);
    }

    public function procesarConceptos($conceptos, $documento, $contabilizado = false)
    {
        $collection = new Doctrine_Collection('DatConceptoimporterecep');
        $recepcion = Doctrine::getTable('DatRecepcion')->find($documento);
        foreach ($conceptos as $c) {
            $c['valormn'] = ($c['valormn']) ? $c['valormn'] : 0;
            $c['valoralt'] = ($c['valoralt']) ? $c['valoralt'] : 0;
            $c['idcondicionpago'] = ($c['idcondicionpago']) ? $c['idcondicionpago'] : null;
            $c['idproveedor'] = ($c['idproveedor']) ? $c['idproveedor'] : null;
            if (!$contabilizado) {
                if ($c['moneda']) {
                    $c['idmoneda'] = $c['moneda'];
                    if ($c['moneda'] != $recepcion->idmoneda && $c['moneda'] != $this->_idmonedacontable) {
                        $tasa = $this->configuracionHelper->getTasaByMonedas(
                            $this->_idmonedacontable, $c['idmoneda'], $this->_tipoTasa
                        );
                        if (empty($tasa)) {
                            $c['tasa'] = null;
                        } else {
                            $c['tasa'] = $tasa[0]['factordeconversion'];
                        }
                    } else {
                        $c['tasa'] = null;
                    }
                } else {
                    $c['idmoneda'] = null;
                }
            }
            $obj = new DatConceptoimporterecep();
            if ($c['idconceptorecep']) {
                $obj->assignIdentifier($c['idconceptorecep']);
            }
            $obj->synchronizeWithArray($c);
            $obj->iddocumento = $documento;
            $collection->add($obj);
        }
        $collection->save();
    }

    private function validarDocumentoOrigen($datos)
    {
        /*$sql = "select * from mod_logistica.dat_documento dd
            inner join mod_loginventario.dat_recepcion dr using(iddocumento)
            inner join mod_logistica.dat_documentocliente dc using(iddocumento)
            where dc.idcliente = {$datos['idcliente']}
            and dr.fechadocorigen  = '{$datos['fechadocorigen']}'
            and dr.nrodocorigen = {$datos['nrodocorigen']} ";*/

    }

    /* borrar estooooooooooooooo */

    public function devolverTipocliente($idcliente)
    {
        $sql = "select count(idestructuraop) from mod_estructuracomp.dat_estructuraop where idestructuraop = $idcliente";
        $data = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        return $data[0]['count'];
    }

    /**
     * Duplica el documento seleccionado.
     * @param numeric $iddocumento Indentificador del documento.
     * @return Integer
     */
    public function copiarDocumento($iddocumento, $sameDoc = false, $cancelSigno = false)
    {
        $idCopia = parent::copiarDocumento($iddocumento, $sameDoc, $cancelSigno);
        $config = new ConfiguracioninventarioService();
        $docRecepcion = Doctrine::getTable('DatRecepcion')->find($iddocumento);
        $recepcion = $docRecepcion->copy();
        $datos = $docRecepcion->toArray();
        $datos['iddocumento'] = $idCopia;
        $recepcion->synchronizeWithArray($datos);
        $recepcion->save();
        $transporte = Doctrine::getTable('DatDocumentotransporte')->findByDql('iddocumento = ?', array($iddocumento))
            ->getFirst();
        if ($transporte) {
            $newtransporte = $transporte->copy();
            $datos = $transporte->toArray();
            $datos['iddocumentotransporte'] = null;
            $datos['iddocumento'] = $idCopia;
            $newtransporte->synchronizeWithArray($datos);
            $newtransporte->save();
        }
        $cliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($iddocumento))
            ->getFirst();
        if ($cliente) {
            $newcliente = $cliente->copy();
            $datos = $cliente->toArray();
            $datos['iddocumentocliente'] = null;
            $datos['iddocumento'] = $idCopia;
            $newcliente->synchronizeWithArray($datos);
            $newcliente->save();
        }
        $padre = Doctrine::getTable('DatDocumentoPadre')->findByDql('iddocumento = ?', array($iddocumento))
            ->getFirst();
        if ($padre) {
            $newpadre = $padre->copy();
            $datos = $padre->toArray();
            $datos['iddocumentopadre'] = null;
            $datos['iddocumento'] = $idCopia;
            $newpadre->synchronizeWithArray($datos);
            $newpadre->save();
        }
        $doc = Doctrine::getTable('DatDocumento')->find($idCopia);
        return array('iddocumento' => $idCopia, 'observaciones' => $doc->observaciones);
    }

    /**
     * Confirma un documento dado su identificador.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function contarDocumento($iddocumento)
    {
        $diferencias = $this->cargarDiferencias(array('iddocumento' => $iddocumento));
        foreach ($diferencias as $value) {
            $this->registrarDiferencias($value);
            Doctrine_Query::create()->delete('DatMovdiferenciacalidad')
                ->where('idmovimiento = ?', $value['idmovimiento'])->execute();
        }
        $this->trazaDocumento->guardarTraza('Documento confirmado', $iddocumento, EstadoDocumentoModel::ESTADO_ELABORACION);
        return $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_ELABORACION);
    }

    /**
     * Confirma un documento dado su identificador.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function confirmarDocumento($iddocumento)
    {
        $condPagoOb = "select nv.valor from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'CONDPAGO_OBLIG'";
        $activaCPO = LogisticaDoctrineHelper::__init()->getConnection()->execute($condPagoOb)->fetchAll(PDO::FETCH_ASSOC);
        if (count($activaCPO) > 0) {
            $docAux = Doctrine::getTable('DatDocumento')->find($iddocumento);
            $operacionesCPO = explode(',', $activaCPO[0]['valor']);
            $cliente = Doctrine::getTable('DatDocumentoCliente')->findByDql('iddocumento = ?', array($iddocumento));
            if (in_array($docAux->idoperacion, $operacionesCPO) && count($cliente) > 0 && !$cliente[0]->idcondicionpago) {
                throw new ZendExt_Exception('LOG_LB_RECEP_001');
            }
        }
        $recepcion = Doctrine::getTable('DatRecepcion')->find($iddocumento);
        $tasa = 1;
        if ($recepcion->tasa) {
            $this->procesarMonedasTasa($iddocumento, $recepcion->tasa);
            $tasa = $recepcion->tasa;
        }
        $this->actualizarMovUbicacion($iddocumento);
        $movimientos = Doctrine_Query::create()
            ->select(
                'm.idmovimiento, m.cantidad, m.preciocontable, m.precioalternativo, r.tipopago AS tipopago,  m.importecontable, m.importealternativo, '
                . '(coalesce(r.recargo, 0) - coalesce(r.descuento, 0)) AS pagocontable, '
                . '(coalesce(r.recargoalternativo, 0) - coalesce(r.descuentoalternativo, 0)) AS pagoalternativo'
            )
            ->from('DatMovimientos m')->innerJoin('m.DatRecepcion r')
            ->where('m.iddocumento = ? ', $iddocumento)
            ->fetchArray();
        if (!$recepcion->salidafactura) {
            $conceptos = Doctrine_Query::create()
                ->select(
                    'dci.idconceptorecep, dci.idmoneda,COALESCE(dci.valormn,0) as valormn, COALESCE(dci.valoralt,0) as valoralt,
                    nc.porciento as porciento, coalesce(dci.tasa,1) as tasa'
                )
                ->from('DatConceptoimporterecep dci')
                ->innerJoin('dci.NomCategoriaprecio nc')
                ->where('dci.iddocumento = ?', $iddocumento)
                ->fetchArray();
        } else {
            $conceptos = array(array('valormn' => 0, 'valoralt' => 0));
        }
        $value = $movimientos[0];
        $importe = Doctrine_Query::create()->select("SUM(round(dm.cantidad * dm.preciocontable*{$tasa},2)) as importe")
            ->from('DatMovimientos dm')
            ->where('dm.iddocumento = ?', $iddocumento)
            ->fetchArray();
        $importeAlt = Doctrine_Query::create()->select('SUM(round(dm.cantidad * dm.precioalternativo,2)) as importe')
            ->from('DatMovimientos dm')
            ->where('dm.iddocumento = ?', $iddocumento)
            ->fetchArray();
        $importeTemp = $importe[0]['importe']/* + $importeAlt[0]['importe']*/
        ;
        $collection = new Doctrine_Collection('DatMovimientos');
        $porcientoContable = $value['pagocontable'];
        $porcientoAlternativo = $value['pagoalternativo'];
        $valorContAux = $valorAltAux = 0;
        if ($recepcion->tipopago == 1) {
            /**
             * Valor porcentual a prorratar general para el documento llevado a importe
             */
            $valorCont = ($importe[0]['importe'] * $porcientoContable) / 100;
            $valorAlt = ($importeAlt[0]['importe'] * $porcientoAlternativo) / 100;

        } else {
            /**
             * Valor a prorratar general para el documento
             */
            $valorCont = $porcientoContable * $tasa;
            $valorAlt = $porcientoAlternativo;
            /**
             * Cantidad a porratear en partes iguales a cada movimiento en caso de que no tenga importe o
             */
            $valorContAux = /*LogisticaObjectHelper::__init()->_round(*/
                $porcientoContable / count($movimientos)/*, LogisticaGlobal::FACTOR_REDONDEO)*/
            ;
            $valorAltAux = /*LogisticaObjectHelper::__init()->_round(*/
                $porcientoAlternativo / count($movimientos)/*, LogisticaGlobal::FACTOR_REDONDEO)*/
            ;

        }
        $j = 1;
        $acumContable = 0;
        $acumAlt = 0;
        $collConceptos = new Doctrine_Collection('DatConceptoimporterecep');
        if ($recepcion->tipopago || count($conceptos) > 0) {
            $restoConceptos = $conceptos;
            foreach ($movimientos as $value) {
                $importeTotalMov = $value['importecontable'] * $tasa + $value['importealternativo'];
                if ($j == count($movimientos)) {
                    //var_dump($acumContable);die;
                    /**
                     * Si es el ultimo movimiento calculo el resto
                     */
                    $rd = ((($valorCont - $acumContable) < 0) && $valorCont > 0) ? LogisticaObjectHelper::__init()->_round($valorCont * $porCientoLocal, LogisticaGlobal::FACTOR_REDONDEO) : $valorCont - $acumContable;
                    $rdAlt = ((($valorAlt - $acumAlt) < 0) && $valorAlt > 0) ? LogisticaObjectHelper::__init()->_round($valorAlt * $porCientoLocal, LogisticaGlobal::FACTOR_REDONDEO) : $valorAlt - $acumAlt;
                    if (/*$importe[0]['importe'] = 0 || 0*/ $value['preciocontable'] * $value['cantidad'] == 0) {
                        //$rd = $valorContAux;
                    }
                    if (/*$importeAlt[0]['importe'] = 0 || */ $value['precioalternativo'] * $value['cantidad'] == 0) {
                        //$rdAlt = $valorAltAux;
                    }
                } else {
                    /**
                     * Calculando el valor que repesenta el importe de movimiento del importe total
                     *
                     * $localAcum = LogisticaObjectHelper::__init()->_round($value['preciocontable'] * $value['cantidad'], LogisticaGlobal::FACTOR_REDONDEO) / $importe[0]['importe'];
                     * $localAcumAlt = LogisticaObjectHelper::__init()->_round($value['precioalternativo'] * $value['cantidad'], LogisticaGlobal::FACTOR_REDONDEO) / $importeAlt[0]['importe'];
                     */
                    $porCientoLocal = /*LogisticaObjectHelper::__init()->_round(*/
                        $importeTotalMov / $importeTemp/*, 2)*/
                    ;
                    /**
                     * Calculando el recargo a partir de la fraccion anterior por el importe
                     */
                    $rd = LogisticaObjectHelper::__init()->_round($valorCont * $porCientoLocal, LogisticaGlobal::FACTOR_REDONDEO);
                    $rdAlt = LogisticaObjectHelper::__init()->_round($valorAlt * $porCientoLocal, LogisticaGlobal::FACTOR_REDONDEO);
                    /**
                     *
                     */
                    if (/*$importe[0]['importe'] = 0 || 0*/ $value['preciocontable'] * $value['cantidad'] == 0) {
                        //$rd = $valorContAux;
                    }
                    if (/*$importeAlt[0]['importe'] = 0 || */ $value['precioalternativo'] * $value['cantidad'] == 0) {
                        //$rdAlt = $valorAltAux;
                    }
                    /**
                     * Acumulando el valor adicionado a cada movimiento
                     */
                    $acumContable += $rd;
                    $acumAlt += $rdAlt;
                }
                $value['recargodescuento'] = $rd;
                $value['recargodescuentoalt'] = $rdAlt;
                $precioAux = $value['importecontable'] / $value['cantidad'];
                $precioAuxAlt = $value['importealternativo'] / $value['cantidad'];
                $rdUnidad = $rd / $value['cantidad'];
                $rdUnidadAlt = $rdAlt / $value['cantidad'];
                $value['importecontable'] = LogisticaObjectHelper::__init()->_round($value['importecontable'] * $tasa + $rd, LogisticaGlobal::FACTOR_REDONDEO);
                $value['importealternativo'] = LogisticaObjectHelper::__init()->_round($value['importealternativo'] + $rdAlt, LogisticaGlobal::FACTOR_REDONDEO);
                foreach ($conceptos as $pos => &$c) {
                    if ($j == 1) {
                        if ($c['porciento'] == 1) {
                            $c['valormn'] = $restoConceptos[$pos]['valormn'] = LogisticaObjectHelper::__init()->_round($importeTemp * $c['valormn'] / 100, LogisticaGlobal::FACTOR_REDONDEO);
                        } else {
                            if (!$c['idmoneda']) {
                                $c['valormn'] = $restoConceptos[$pos]['valormn'] = $c['valormn'] * $tasa;
                            } else if ($recepcion->idmoneda && $c['idmoneda'] == $recepcion->idmoneda) {
                                $c['valormn'] = $restoConceptos[$pos]['valormn'] = $c['valormn'] * $tasa;
                            } else {
                                $c['valormn'] = $restoConceptos[$pos]['valormn'] = $c['valormn'] * $c['tasa'];
                            }
                        }
                        $objConcepto = new DatConceptoimporterecep();
                        $objConcepto->assignIdentifier($c['idconceptorecep']);
                        $objConcepto->valorcalculomn = $c['valormn'];
                        $collConceptos->add($objConcepto);
                    }
                    if ($j == count($movimientos)) {
                        $value['importecontable'] += $restoConceptos[$pos]['valormn'];
                        $value['importealternativo'] += $restoConceptos[$pos]['valoralt'];
                        $value['recargodescuento'] += $restoConceptos[$pos]['valormn'];
                        $value['recargodescuentoalt'] += $restoConceptos[$pos]['valoralt'];
                    } else {
                        $value['importecontable'] += LogisticaObjectHelper::__init()->_round($c['valormn'] * $porCientoLocal, LogisticaGlobal::FACTOR_REDONDEO);
                        $value['importealternativo'] += LogisticaObjectHelper::__init()->_round($c['valoralt'] * $porCientoLocal, LogisticaGlobal::FACTOR_REDONDEO);
                        $value['recargodescuento'] += LogisticaObjectHelper::__init()->_round($c['valormn'] * $porCientoLocal, LogisticaGlobal::FACTOR_REDONDEO);
                        $value['recargodescuentoalt'] += LogisticaObjectHelper::__init()->_round($c['valoralt'] * $porCientoLocal, LogisticaGlobal::FACTOR_REDONDEO);

                        $restoConceptos[$pos]['valormn'] -= LogisticaObjectHelper::__init()->_round($c['valormn'] * $porCientoLocal, LogisticaGlobal::FACTOR_REDONDEO);
                        $restoConceptos[$pos]['valoralt'] -= LogisticaObjectHelper::__init()->_round($c['valoralt'] * $porCientoLocal, LogisticaGlobal::FACTOR_REDONDEO);
                    }
                }
                $value['preciocontable'] = /*($value['preciocontable'] > 0) ? */
                    ($value['cantidad'] > 0)
                        ? LogisticaObjectHelper::__init()->_round($value['importecontable'] / $value['cantidad'], 6)
                        : $value['preciocontable']/* : $rd/ $value['cantidad']*/
                ;
                $value['precioalternativo'] = /*($value['precioalternativo'] > 0) ?*/
                    ($value['cantidad'] > 0)
                        ? LogisticaObjectHelper::__init()->_round($value['importealternativo'] / $value['cantidad'], 6)
                        : $value['precioalternativo']/*: $rdAlt/ $value['cantidad']*/
                ;
                $mov = new DatMovimientos();
                $mov->assignIdentifier($value['idmovimiento']);
                $mov->synchronizeWithArray($value);
                $collection->add($mov);
                $j++;
            }
        } else {
            foreach ($movimientos as $value) {
                $value['preciocontable'] = round($value['preciocontable'] * $tasa, 6);
                $value['importecontable'] = LogisticaObjectHelper::__init()->_round($value['preciocontable'] * $value['cantidad'], LogisticaGlobal::FACTOR_REDONDEO);
                $mov = new DatMovimientos();
                $mov->assignIdentifier($value['idmovimiento']);
                $mov->synchronizeWithArray($value);
                $collection->add($mov);
            }
        }
        if ($collection->count() > 0) {
            $collection->save();
        }
        if ($collConceptos->count() > 0) {
            $collConceptos->save();
        }
        $this->trazaDocumento->guardarTraza('Documento confirmado', $iddocumento, EstadoDocumentoModel::ESTADO_PENDIENTE);
        return $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_PENDIENTE);
    }

    /**
     * Anula el estado del documento.
     * @param numeric $iddocumento
     * @param integer $estado [Opcional]
     * @return boolean
     */
    public function anularEstadoDocumento($iddocumento, $estado)
    {
        $recepcion = Doctrine::getTable('DatRecepcion')->find($iddocumento);
        Doctrine_Query::create()->delete('DatMovubicacion')
            ->where(
                'idmovimiento IN (SELECT m.idmovimiento FROM DatMovimientos m WHERE m.iddocumento = ?) '
                . 'AND idestructuraubicacion = -1', $iddocumento
            )->execute();
        if ($recepcion->tasa) {
            $sqlUpdate = "UPDATE  mod_logistica.dat_movimiento  d 
                        SET  importecontable = coalesce((select mm.importe from mod_logistica.dat_movmoneda mm where mm.idmovimiento = d.idmovimiento and mm.idmoneda = {$recepcion->idmoneda} limit 1),0), 
                             importealternativo = 0,
							 preciocontable =  coalesce ((select mm.precio from mod_logistica.dat_movmoneda mm where mm.idmovimiento = d.idmovimiento and mm.idmoneda = {$recepcion->idmoneda} limit 1),0), 
                             precioalternativo = 0 
                        WHERE d.iddocumento = {$iddocumento};";
        } else {
            $sqlUpdate = "UPDATE  mod_logistica.dat_movimiento  d 
                        SET  importecontable = round((coalesce(d.importecontable,0) - coalesce(d.recargodescuento,0)),2), 
                             importealternativo = round((coalesce(d.importealternativo - d.recargodescuentoalt,0)),2),
							 preciocontable = (CASE WHEN round((coalesce(d.importecontable,0) - coalesce(d.recargodescuento,0)),2) <> 0 THEN (round((coalesce(d.importecontable,0) - coalesce(d.recargodescuento,0)),2)/ cantidad) ELSE 0 END) , 
                             precioalternativo = CASE WHEN round((coalesce(d.importealternativo - d.recargodescuentoalt,0)),2) <> 0 THEN (round((coalesce(d.importealternativo - d.recargodescuentoalt,0)),2) / cantidad) ELSE 0 END 
                        WHERE d.iddocumento = {$iddocumento};";
        }
        LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlUpdate);
        $estado = EstadoDocumentoModel::ESTADO_ELABORACION;
        $this->trazaDocumento->guardarTraza('Estado anulado ', $iddocumento, $estado);
        return $this->estadoModel->setEstadoDocumento($iddocumento, $estado);
    }

    /**
     * Contabiliza un documento.
     * @param Integer $iddocumento (identificador de documento).
     * @return Boolean
     */
    public function contabilizarDocumento($iddocumento)
    {
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $this->actualizarUbicacion($iddocumento, true);
        if ($this->existComponent('log.inv.municiones')) {
            $municiones = new MunicionesService();
            $municiones->aprobarPartida($iddocumento);
        }
        $datosBusqueda = $this->getProductoModel()->devolverMovimientos(array('iddocumento' => $iddocumento));
        $idreclamacion = null;
        foreach ($datosBusqueda['datos'] as $value) {
            $difCantidad = $this->cargarDiferenciasXCantidad(array('idmovimiento' => $value['idmovimiento']));
            $difCalidad = $this->cargarDiferenciasXCalidad($value['idmovimiento']);
            if ($difCantidad['datos']['cantidaddiferencia'] || $difCalidad['cantidad'] > 0) {
                if (!$idreclamacion) {
                    $docRecepcion = Doctrine::getTable('DatDocumento')->find($iddocumento);
                    $idreclamacion = $this->reclamacionService->adicionarDocumento(
                        array('idrecepcion' => $iddocumento, 'idestructuracomun' => $docRecepcion->idestructuracomun)
                    );
                    $docDif = Doctrine::getTable('DatDocumento')->find($idreclamacion)->toArray();
                }
                $value['idmovimiento'] = null;
                $value['iddocumento'] = $idreclamacion;
                $value['signo'] = LogisticaMovimientoModel::SIGNO_NINGUNO;
                $recordMov = new DatMovimientos();
                $recordMov->synchronizeWithArray($value);
                $recordMov->save();
                $datos = $difCantidad['datos'];
                $datos['idmovimiento'] = $recordMov->idmovimiento;
                $datos['dif'] = true;
                foreach ($difCalidad['datos'] as $dif) {
                    $dif['idmovdiferenciacalidad'] = null;
                    $dif['idmovimiento'] = $recordMov->idmovimiento;
                    $datos['calidad'][] = $dif;
                }
                $this->registrarDiferencias($datos);
            }
        }
        $cronologia = parent::contabilizarDocumento($iddocumento);
        $this->nroSerieService->actualizarEstadoNumeroSerie($iddocumento);
        $this->loteService->actualizarExistenciaLote($iddocumento, true, $cronologia);
        $actualizarSolicitud = $this->getDatosActualizarSolicitud($iddocumento);
        if ($actualizarSolicitud) {
            $this->planificacionHelper->ActualizarSolicitudes711(
                $actualizarSolicitud['idsolicitud'], $actualizarSolicitud['productos']
            );
        }
        Doctrine_Manager::connection()->execute(
            "select mod_datosmaestros.f_actualizarpreciosbyparams(null, {$iddocumento}, null)"
        );
        $tienda = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'TV_EXIST' and nv.valor = 'true'";
        $activa = LogisticaDoctrineHelper::__init()->getConnection()->execute($tienda)->fetchAll(PDO::FETCH_COLUMN);
        if ($activa[0] > 0 && !$idreclamacion) {
            $sqlExiste = "select count(pd.idpedido) from mod_logpuntoventa.dat_pedidodocumento pd 
                          where pd.iddocumento = {$iddocumento}";
            $existe = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlExiste)->fetchAll(PDO::FETCH_COLUMN);
            if ($existe[0] > 0) {
                Doctrine_Manager::connection()->execute(
                    "select mod_logpuntoventa.f_procesarrecepciontienda({$iddocumento}, 
                {$this->global->Estructura->idestructura},{$this->global->Perfil->idusuario},0,0)"
                );
            }
        }
        if ($config['comprobante']) {
            $comp = $this->generarComprobante($iddocumento, LogisticaGlobal::SUBSISTEMA_INV);
            $resultado['comprobante'] = $comp[0];
        }
        if ($config['farmaciaintegrada']) {
            $factory = new BodegaApiHelper();
            $tokenData = $factory->authenticate();
            $productos = $this->getProductosControladosByDoc($iddocumento);
            $sendData = array(
                'idfarmacia' => $this->global->Estructura->idestructura,
                'productos' => array()

            );

            foreach ($productos as $p) {
                $dataProd = array(
                    'idproductoP' => $p['idindicador'],
                    'idproducto' => $p['idproducto'],
                    'codigo' => $p['numeropieza'],
                    'denominacion' => $p['denominacion'],
                    'cantidad' => $p['cantidad'],
                    'precio' => $p['preciocontable']
                );
                array_push($sendData['productos'], $dataProd);
            }

            $resp = $factory->repartirControladosFarmacia(json_encode($sendData), $tokenData);
            //var_dump($resp); die;
            if (isset($resp['type']) && $resp['type'] == 'success') {
                //respuesta correcta
            } else {
                // print_r($resp); die;
            }
        }
        return array(
            'comprobante' => (isset($resultado) ? $resultado['comprobante'] : false), 'nrodif' => ($idreclamacion ? $docDif['numeroref'] : null)
        );
    }

    public function getProductosControladosByDoc($iddocumento)
    {
        /*$sql = "select dp.idindicador, ni.numeropieza, ni.denominacion, dm.cantidad, dm.preciocontable from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
                inner join mod_logfarmacia.conf_cuadrobasico cb on dp.idindicador = cb.idindicador
                INNER JOIN mod_logfarmacia.conf_anno ca ON cb.idanno = ca.idanno
                INNER JOIN mod_logfarmacia.dat_unidadsaluddispensacion usd ON cb.idcuadrobasico = usd.idcuadrobasico
                where dm.iddocumento = {$iddocumento} and cb.idestructura = {$this->global->Estructura->idestructura}
                and ca.activo = 1 and cb.idtipodispensacion = 3";*/
        $sql = "select dp.idindicador,dp.idproducto, ni.numeropieza, ni.denominacion, dm.cantidad, dm.preciocontable 
                from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador	
                where dm.iddocumento = {$iddocumento} and ni.idindicador in (
                    select distinct pt.idindicador from mod_logfarmacia.dat_productotarjetamedicamento pt
                    inner join mod_logfarmacia.dat_tarjetamedicamento tm ON pt.idtarjetamedicamento = tm.idtarjetamedicamento
                    inner join mod_logistica.dat_documento d on d.iddocumento = tm.idtarjetamedicamento	
                    where d.idestructuracomun = {$this->global->Estructura->idestructura}
                )";
        $data = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        return $data;
    }

    /**
     * Anula el documento.
     * @param Integer $iddocumento
     */
    public function cancelarDocumento($iddocumento)
    {
        $this->actualizarUbicacion($iddocumento);
        $this->loteService->actualizarExistenciaLote($iddocumento, true, 1, true);
        $this->nroSerieService->actualizarEstadoNumeroSerie($iddocumento, true);
        $this->nroSerieService->eliminarNrosCancelados($iddocumento);
        if ($this->existComponent('log.inv.municiones')) {
            $municiones = new MunicionesService();
            $municiones->aprobarPartida($iddocumento, true);
            $municiones->eliminarPartidasCanceladas($iddocumento);
        }
        /*$datos = parent::cancelarDocumento($iddocumento);
        $this->producto->cancelarMovimientos($datos['iddocumento'], $datos['cronologia'], true);
        return true;*/
        return parent::cancelarDocumento($iddocumento);
    }

    /**
     * Devuelve los movimientos del informe de recepción.
     * @param array $filtro
     * @return array
     */
    public function devolverMovimientos($filtro)
    {
        $query = $this->getProductoModel()->devolverMovimientos($filtro, true);
        $maestroP = new MaestroProductoModel();
        $query->addSelect('coalesce(mr.cantidad, 0) AS cantfactura, (mr.idmovimiento IS NOT NULL) AS porfactura')
            ->leftJoin('mov.DatMovrecepcion mr');
        return array(
            'cantidad' => $query->count(),
            'datos' => $maestroP->addSelectionData($this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()),
            'importetotal' => $this->sumarImportesInternos($filtro)[0]['importe']
        );
    }

    public function adicionarMovimientos($iddocumento, $idproductos)
    {
        $result = $this->getProductoModel()->adicionarMovimientos(
            $iddocumento, $idproductos, LogisticaMovimientoModel::SIGNO_MOV_SUMA
        );
        return $result;
    }

    /**
     * Elimina los movimientos seleccionados del documento.
     * @param array $arrIdMov
     */
    public function eliminarMovimientos($arrIdMov, $iddocumento)
    {
        $this->nroSerieService->eliminarNrosCancelados($iddocumento, $arrIdMov);
        if ($this->existComponent('log.inv.municiones')) {
            $municiones = new MunicionesService();
            $municiones->eliminarPartidasCanceladas(null, $arrIdMov);
        }
        $this->getProductoModel()->eliminarMovimientos(false, $arrIdMov, false, false);
        return array('cantproductos' => $this->getCantMovimientos($iddocumento));
    }

    /**
     * Actualiza la cantidad de los productos no liniales de la recepcion.
     * @param array $datos
     * @param numeric $iddocumento
     * @param boolean $porfactura [Opcional]
     * @return boolean
     */
    private function adicionarProductosXTipoDoc($datos, $iddocumento, $porfactura = false, $usarcategoria = false)
    {
        $flag = $porfactura ? '1' : '0';
        foreach ($datos as $key => $value) {
            $value['idcategoria'] = $value['idcategoria'] ? $value['idcategoria'] : 'null';
            $verificarCategoria = ($usarcategoria) ? "AND coalesce(p.idcategoria, -1) = coalesce({$value['idcategoria']}, -1)" : "";
            $mov = Doctrine_Query::create()->select('m.idmovimiento, p.idproducto')
                ->from('DatMovimientos m')->innerJoin('m.DatProductoLogistica p')
                ->where(
                    "m.iddocumento = ? AND p.idindicador = ? AND p.idestructura = ? AND p.idumedida = ? "
                    . "{$verificarCategoria}",
                    array($iddocumento, $value['idindicador'], $value['idestructura'], $value['idumedidacrc'])
                )
                ->fetchOne();
            $datos[$key]['idmovimiento'] = $mov->idmovimiento;
            if ($value['tienelote']) {
                $sql = "SELECT l.*, ml.*, (CASE WHEN {$flag} = '1' THEN 0 ELSE ml.cantidad END) AS cantidad, "
                    . "{$mov->idproducto} AS idproducto, {$mov->idmovimiento} AS idmovimiento, "
                    . "null AS idlote, null AS idmovlote, coalesce(_l.existencia, 0) AS existencia, _l.cronologia, "
                    . "'+' AS signo FROM mod_logistica.dat_movlote ml INNER JOIN mod_logistica.dat_lote l "
                    . "ON l.idlote = ml.idlote LEFT JOIN mod_logistica.dat_lote _l ON _l.idlote = l.idlote "
                    . "AND _l.idproducto = {$mov->idproducto} WHERE ml.idmovimiento = {$value['idmov']} "
                    . "ORDER BY ml.idmovlote";
                $connection = Doctrine_Manager::connection();
                $lotes = $connection->fetchAll($sql);
                $this->loteService->adicionarLote($lotes, array('collection' => true));
            }
            if ($value['equipo']) {
                $sql = "SELECT ns.*, {$mov->idproducto} AS idproducto, {$mov->idmovimiento} AS idmovimiento, "
                    . "null AS idnroserie, null AS idmovnumeroserie, coalesce(_ns.estado, 1) AS estado "
                    . "FROM mod_loginventario.dat_movnroserie mns INNER JOIN mod_loginventario.dat_nroserie ns "
                    . "ON ns.idnroserie = mns.idnroserie LEFT JOIN mod_loginventario.dat_nroserie _ns "
                    . "ON _ns.nroserie = ns.nroserie AND _ns.idproducto = {$mov->idproducto} "
                    . "WHERE mns.idmovimiento = {$value['idmov']} ORDER BY mns.idmovnumeroserie";
                $connection = Doctrine_Manager::connection();
                $ns = $connection->fetchAll($sql);
                foreach ($ns as $item) {
                    $this->nroSerieService->adicionarNumeroserie($item, false);
                }
            }
            if ($value['municion'] && $this->existComponent('log.inv.municiones')) {
                $sql = "SELECT pm.idestructuraubicacion, pm.idpartida, pm.idanno, pm.idfab, pm.elemembalajes, "
                    . "pm.estiba, pm.hilera, pm.idmarcapolvuno, pm.idpartidapolvuno, pm.idannopolvuno, "
                    . "pm.idfabpolvuno, pm.idmarcapolvdos, pm.idpartidapolvdos, pm.idannopolvdos, pm.idfabpolvdos, "
                    . "pm.idmarcaexplosivo, pm.idpartidaexplosivo, pm.idannoexplosivo, pm.idfabexplosivo, "
                    . "pm.idmarcaespoleta, pm.idpartidaespoleta, pm.idannoespoleta, pm.idfabespoleta, "
                    . "pm.idmarcaestopin, pm.idpartidaestopin, pm.idannoestopin, pm.idfabestopin, pm.checksum, "
                    . "(CASE WHEN {$flag} = '1' THEN 0 ELSE mpm.cantidad END) AS cantidad, "
                    . "{$mov->idproducto} AS idproducto, {$mov->idmovimiento} AS idmovimiento, "
                    . "null AS idproductomunic, null AS idmovproductomunic, coalesce(_pm.existencia, 0) AS existencia, "
                    . "pm.indice, coalesce(_pm.estado, 1) AS estado FROM mod_loginventario.dat_movproductomunic mpm "
                    . "INNER JOIN mod_loginventario.dat_productomunic pm ON pm.idproductomunic = mpm.idproductomunic "
                    . "LEFT JOIN mod_loginventario.dat_productomunic _pm ON _pm.checksum = pm.checksum "
                    . "AND _pm.idproducto = {$mov->idproducto} WHERE mpm.idmovimiento = {$value['idmov']} "
                    . "ORDER BY mpm.idmovproductomunic";
                $connection = Doctrine_Manager::connection();
                $partidas = $connection->fetchAll($sql);
                $municiones = new MunicionesService();
                $municiones->adicionarPartida($partidas, $partidas[0]['indice'], false);
            }
        }
        if ($porfactura) {
            $this->adicionarMovrecepcion($datos);
        }
        return true;
    }

    /**
     * Adiciona los movimientos de productos de la recepcion segun la factura.
     * @param array $productos
     * @return boolean
     */
    private function adicionarMovrecepcion($productos)
    {
        $collection = new Doctrine_Collection('DatMovrecepcion');
        foreach ($productos as $value) {
            $mov = new DatMovrecepcion();
            $sql = "select count(idmovimiento) as existe from mod_loginventario.dat_movrecepcion where idmovimiento = {$value['idmovimiento']}";
            $data = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
            if ($data[0]['existe'] > 0) {
                $mov->assignIdentifier($value['idmovimiento']);
                unset($value['idmovimiento']);
            }
            $value['cantidad'] = $value['cantfactura'] ? $value['cantfactura'] : 0;
            $mov->synchronizeWithArray($value);
            $collection->add($mov);
        }
        if ($collection->count() > 0) {
            $collection->save();
        }
        return true;
    }

    /**
     * @param Integer $idDocumento
     * @return boolean
     */
    public function checkPuedeCancelar($idDocumento)
    {
        $this->checkCancelarExistenciaMovimientos($idDocumento);
        return true;
    }

    /**
     * @param Integer $idDocumento
     * @return Boolean
     * @throws ZendExt_Exception
     */
    private function checkCancelarExistenciaMovimientos($idDocumento)
    {
        $dql = "SELECT COUNT(DISTINCT p.idproducto) as cant_negativos"
            . " FROM DatProductoLogistica p INNER JOIN p.DatMovimientos m"
            . " WHERE m.iddocumento = {$idDocumento} AND (p.cantidad - m.cantidad) < 0";
        $dqlResult = $this->doctrineHelper->query($dql)->toArray();
        if ($dqlResult[0]['cant_negativos'] > 0) {
            throw new ZendExt_Exception('LOG_LB_DOC_007');
        }
        return true;
    }

    /**
     * @param Integer $idDocumento
     * @return Boolean
     * @throws ZendExt_Exception
     */
    private function checkMovimientosPosteriores($idDocumento)
    {
        $arrayEstados = array(EstadoDocumentoModel::ESTADO_ELIMINADO, EstadoDocumentoModel::ESTADO_ANULADO);
        $strEstados = implode(',', $arrayEstados);
        $dql = "SELECT count(DISTINCT p.idproducto) as cant_posteriores FROM DatProductoLogistica p INNER JOIN"
            . " p.DatMovimientos m INNER JOIN m.DatDocumento d WHERE p.idproducto IN ( "
            . " SELECT mm.idproducto FROM DatMovimientos mm  where mm.iddocumento = {$idDocumento} "
            . ") AND d.cronologia > (SELECT dd.cronologia FROM DatDocumento dd WHERE dd.iddocumento = {$idDocumento})"
            . " AND d.estado not in ({$strEstados})";
        $dqlResult = $this->doctrineHelper->query($dql)->toArray();
        if ($dqlResult[0]['cant_posteriores'] > 0) {
            throw new ZendExt_Exception('LOG_LB_DOC_006');
        }
        return true;
    }

    /**
     * Devuelve un arreglo con los tipos de documento del sistema.
     * @return Array
     */
    public function cargarComboTipoDocumento()
    {
        return $this->configuracionHelper->obtenerOperaciones(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV, $this->iddoc
        );
    }

    /**
     * Busca el padre del documento.
     * @param numeric $iddocumento
     * @return array
     */
    public function buscarPadre($iddocumento)
    {
        return Doctrine_Query::create()->from('DatDocumentoPadre dp')->where('dp.iddocumento = ?', $iddocumento)
            ->fetchArray();
    }

    /**
     * Adiciona un DocumentoPadre.
     * @param numenric $iddocumento
     * @param numenric $idpadre
     * @return boolean
     */
    private function adicionarDocumentoPadre($iddocumento, $idpadre)
    {
        Doctrine_Query::create()->delete('DatDocumentoPadre dp')->where('dp.iddocumento = ?', $iddocumento)->execute();
        $padre = new DatDocumentoPadre();
        $padre->synchronizeWithArray(array('iddocumento' => $iddocumento, 'idpadre' => $idpadre));
        $padre->save();
        return true;
    }

    private function adicionarSolicitudPadre($iddocumento, $idpadre)
    {
        Doctrine_Query::create()->delete('DatRecepcionSolicitud drs')->where('drs.iddocumento = ?', $iddocumento)->execute();
        $padre = new DatRecepcionSolicitud();
        $padre->synchronizeWithArray(array('iddocumento' => $iddocumento, 'idsolicitudpadre' => $idpadre));
        $padre->save();
        return true;
    }

    /**
     * Verifica que los productos del documento tengan cantidades registradas.
     * @param numeric $iddocumento identificador de documento.
     * @param boolean $porfactura
     * @return boolean
     */
    public function productosConCantidad($iddocumento, $porfactura)
    {
        $query = Doctrine_Query::create()
            ->from('DatMovimientos m')
            ->where('m.iddocumento = ?', $iddocumento);
        if (isset($porfactura) && $porfactura) {
            $query->leftJoin('m.DatMovrecepcion mr')->addWhere('mr.idmovimiento IS NULL OR mr.cantidad = 0');
        } else {
            $query->addWhere('m.cantidad = 0');
        }
        if ($query->count() > 0) {
            return false;
        }
        return true;
    }

    /**
     * Verifica que los productos del documento tengan cantidades registradas.
     * @param integer $iddocumento
     * @return boolean
     */
    public function productosConPrecio($iddocumento)
    {
        /*$query = Doctrine_Query::create()
            ->from('DatMovimientos m')
            ->where('m.iddocumento = ? AND m.preciocontable = 0 AND m.precioalternativo = 0', $iddocumento);
        if ($this->tipoMoneda['idalternativa']) {
            $query->leftJoin('m.DatMovmoneda mn')
                ->where('m.iddocumento = ?', $iddocumento)
                ->groupBy('m.idmovimiento, mn.idmovmoneda')
                ->having('count(mn.idmovmoneda) = 0');
            if ($query->count() > 0) {
                return false;
            }
            $query->having('mn.precio = 0 OR count(mn.idmovmoneda) = 0');
        }
        if ($query->count() > 0) {
            if ($this->tipoMoneda['idalternativa']) {
                throw new LogisticaException('LOG_LB_DOC_013');
            }
            return false;
        }*/
        return true;
    }

    /**
     * Devuelve los documentos del subsistema especificado.
     * @param array $filtro
     * @return array
     */
    public function cargarDocumentosExternos($filtro)
    {
        $filtro['identidad'] = $this->global->Estructura->idestructura;
        if ($filtro['proceso'] != 'factura711') {
            $select = "SELECT DISTINCT d.*, cp.idclientesproveedores AS idcliente, de.denominacion ";
            $from = "FROM mod_logistica.dat_documento d "
                //. "LEFT JOIN mod_logistica.dat_documentopadre dp ON dp.idpadre = d.iddocumento "
                . "INNER JOIN mod_logistica.dat_documentocliente dc ON dc.iddocumento = d.iddocumento "
                . "INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = d.iddoc "
                . "INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos "
                . "INNER JOIN mod_logistica.dat_movimiento m ON m.iddocumento = d.iddocumento "
                . "INNER JOIN mod_logistica.dat_producto p ON p.idproducto = m.idproducto "
                . "INNER JOIN mod_estructuracomp.v_dametodasestructuras de ON de.idestructura = p.idestructuracomun "
                . "INNER JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idestructura = p.idestructuracomun "/*. "INNER JOIN mod_datosmaestros.dat_clienteproveedorentidad ncpe "
                . "ON ncpe.idclienteproveedor = cp.idclientesproveedores AND ncpe.idestructuracomun = p.idestructuracomun "*/
            ;
            $limit = "ORDER BY d.fechacontable DESC, d.cronologia DESC OFFSET {$filtro['start']} LIMIT {$filtro['limit']}";
            $idsubsistema = LogisticaGlobal::SUBSISTEMA_INV;
            $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->idestructuracomun, $idsubsistema);
            $where = "WHERE d.estado = 4 ";
            if ($filtro['criterio']) {
                $where .= $filtro['proceso'] == 'facturacion' ? " AND f.nrofactura = " . (is_numeric($filtro['criterio']) ? $filtro['criterio'] : -1) : " AND d.nrodoc = " . (is_numeric($filtro['criterio']) ? $filtro['criterio'] : -1);
            }
            switch ($filtro['proceso']) {
                case 'compra':
                    return array();
                case 'facturacion':
                    $select = "SELECT DISTINCT d.*, f.nrofactura as nrodoc, cp.idclientesproveedores AS idcliente, de.denominacion , f.idproveedor AS idorganizacion, ft.identidadchofer AS ciconductor, "
                        . "ft.nombrechofer AS nombreconductor, ft.matriculavehiculo AS matricula, ft.cartaporte ";
                    $from = "FROM mod_logistica.dat_documento d "
                        //. "LEFT JOIN mod_logistica.dat_documentopadre dp ON dp.idpadre = d.iddocumento "
                        . "INNER JOIN mod_logistica.dat_documentocliente dc ON dc.iddocumento = d.iddocumento "
                        . "INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = d.iddoc "
                        . "INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos "
                        . "INNER JOIN mod_datosmaestros.dat_estructurasubsist est ON est.idestructurasubsist = ddp.idestructurasubsist "
                        . "INNER JOIN mod_estructuracomp.v_dametodasestructuras de ON de.idestructura = est.idestructuracomun "
                        . "INNER JOIN mod_datosmaestros.nom_clientesproveedor cp ON cp.idestructura = est.idestructuracomun ";
                    $limit = "ORDER BY d.fechacontable DESC, d.cronologia DESC OFFSET {$filtro['start']} LIMIT {$filtro['limit']}";
                    $join = "INNER JOIN mod_datosmaestros.nom_clientesproveedor cp2 "
                        . "ON cp2.idclientesproveedores = dc.idcliente "
                        . "inner join mod_datosmaestros.dat_clienteproveedorentidad cpe on cpe.idclienteproveedor = cp.idclientesproveedores "
                        . "INNER JOIN mod_logfacturacion.dat_docfactura f ON f.idfactura = d.iddocumento "
                        . "LEFT JOIN mod_logfacturacion.dat_docfacturatransportacion ft ON ft.idfactura = f.idfactura "/*. "INNER JOIN mod_datosmaestros.dat_clienteproveedorentidad cpe_t "
                        . "ON cpe_t.idclienteproveedor = f.idproveedor "
                        . "AND cpe_t.idestructuracomun = {$filtro['idEntidadComun']} "*/
                    ;
                    $avreb = $filtro['conduce'] ? "conduceLog" : "facturaLog";
                    $where .= "AND ndp.abreviatura = '{$avreb}' AND cp2.idestructura = {$filtro['identidad']} AND cpe.idestructuracomun = {$filtro['identidad']} 
                    AND (SELECT SUM(dmov.cantidad) FROM mod_logistica.dat_movimiento dmov 
                      WHERE dmov.iddocumento = d.iddocumento) > COALESCE((SELECT SUM(dmov1.cantidad) FROM mod_logistica.dat_movimiento dmov1 
                      WHERE dmov1.iddocumento IN (SELECT ddpd.iddocumento FROM mod_logistica.dat_documentopadre ddpd 
                      INNER JOIN mod_logistica.dat_documento ddd1 ON ddd1.iddocumento = ddpd.iddocumento
                      WHERE ddpd.idpadre = d.iddocumento AND ddd1.estado IN (1,2,4)
                      )),0) ";
                    break;
                case 'transferencia':
                    $select = "SELECT DISTINCT d.*, p.idestructuracomun AS idcliente,eop.denominacion ";
                    $select .= ",t.idorganizacion,t.nombreconductor,t.ciconductor,t.matricula,t.cartaporte,t.casilla,t.embarque,
                  t.manifiesto,t.partida,t.nombrecomprador,t.cargo,t.cicomprador,t.viatransporte ";

                    $from = "FROM mod_logistica.dat_documento d "
                        . "LEFT JOIN mod_logistica.dat_documentopadre dp ON dp.idpadre = d.iddocumento "
                        . "INNER JOIN mod_logistica.dat_documentocliente dc ON dc.iddocumento = d.iddocumento "
                        . "INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = d.iddoc "
                        . "INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos "
                        . "INNER JOIN mod_logistica.dat_movimiento m ON m.iddocumento = d.iddocumento "
                        . "INNER JOIN mod_logistica.dat_producto p ON p.idproducto = m.idproducto ";
                    $join = "left JOIN mod_logistica.dat_documentotransporte t ON t.iddocumento = d.iddocumento "
                        . "LEFT JOIN mod_estructuracomp.v_dametodasestructuras eop ON eop.idestructura = p.idestructuracomun ";
                    $where .= "AND (dc.tipocliente = 3 AND (dc.idcliente = {$filtro['identidad']})) "
                        . "AND ndp.abreviatura = 'transferenciaLog' AND (dp.iddocumentopadre IS NULL OR (select count(destp.iddocumento) from mod_logistica.dat_documento destp where destp.iddocumento in (select 
                    destp1.iddocumento from mod_logistica.dat_documento destp1
                    inner join mod_logistica.dat_documentopadre ddpest on ddpest.iddocumento = destp1.iddocumento
                    where ddpest.idpadre = d.iddocumento) and destp.estado in (1,2,4)) = 0)";
                    break;
                case 'transferenciaint':
                    $select = "SELECT DISTINCT d.*, p.idestructura AS idcliente,eop.denominacion ";
                    $select .= ",t.idorganizacion,t.nombreconductor,t.ciconductor,t.matricula,t.cartaporte,t.casilla,t.embarque,
  					t.manifiesto,t.partida,t.nombrecomprador,t.cargo,t.cicomprador,t.viatransporte ";

                    $from = "FROM mod_logistica.dat_documento d "
                        . "LEFT JOIN mod_logistica.dat_documentopadre dp ON dp.idpadre = d.iddocumento "
                        . "INNER JOIN mod_logistica.dat_documentocliente dc ON dc.iddocumento = d.iddocumento "
                        . "INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = d.iddoc "
                        . "INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos "
                        . "INNER JOIN mod_logistica.dat_movimiento m ON m.iddocumento = d.iddocumento "
                        . "INNER JOIN mod_logistica.dat_producto p ON p.idproducto = m.idproducto ";

                    $join = "left JOIN mod_logistica.dat_documentotransporte t ON t.iddocumento = d.iddocumento "
                        . "LEFT JOIN mod_estructuracomp.v_dametodasestructuras eop ON eop.idestructura = p.idestructura ";
                    $where .= "AND (dc.tipocliente = 3 AND (dc.idcliente = {$filtro['idestructura']})) "
                        . "AND ndp.abreviatura = 'transferenciaLog' AND (SELECT SUM(dmov.cantidad) FROM mod_logistica.dat_movimiento dmov 
                      WHERE dmov.iddocumento = d.iddocumento) > COALESCE((SELECT SUM(dmov1.cantidad) FROM mod_logistica.dat_movimiento dmov1 
                      WHERE dmov1.iddocumento IN (SELECT ddpd.iddocumento FROM mod_logistica.dat_documentopadre ddpd 
                      INNER JOIN mod_logistica.dat_documento ddd1 ON ddd1.iddocumento = ddpd.iddocumento
                      WHERE ddpd.idpadre = d.iddocumento AND ddd1.estado IN (1,2,4)
                      )),0)";
                    $where .= " AND (dc.prioridad <> -1 OR dc.prioridad IS NULL) ";
                    break;
                case 'produccion':
                    $select = "SELECT DISTINCT dd.*, vp.cantidad, dop.nrolote,dop.fechacierre as fechacierre,
                            cti.idindicadorsalida as idindicador, dop.idcentrogrupo as idcliente,
                            voc.cliente as denominacioncliente,dct.numerocontrato as nrocontrato,dct.fechafirma as fechacontrato,
                            ncc.descripcioncentrogrupo as denominacion ";
                    $from = "FROM mod_logistica.dat_documento d "
                        . "INNER JOIN mod_logproduccion.dat_ordenproduccion dop ON d.iddocumento = dop.idordenproduccion "
                        . "LEFT JOIN mod_contabilidadcosto.nom_centrocosto ncc on ncc.idcentrogrupo = dop.idcentrogrupo "
                        . "INNER JOIN mod_planifindustrial.dat_cartatecindustrial cti ON dop.idcartatecnologica = cti.idcartatecindustrial "
                        . "INNER JOIN mod_logproduccion.dat_valeproduccion vp on vp.idordenproduccion = dop.idordenproduccion "
                        . "INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = vp.idvaleproduccion "
                        . "LEFT JOIN mod_crmcontratacion.dat_contrato dct ON dop.idcontrato = dct.idcontrato "
                        . "LEFT JOIN mod_logistica.dat_documentocliente dc ON dc.iddocumento = d.iddocumento "
                        . "LEFT JOIN mod_logproduccion.v_obtenercliente voc ON dc.idcliente = voc.idcliente "
                        . "INNER JOIN mod_logproduccion.conf_almacenes cat ON dop.idalmacendestino = cat.idconfalmacen AND cat.almacenpt = 1 "
                        . "LEFT JOIN mod_logistica.dat_documentopadre dp ON dp.idpadre = dd.iddocumento ";
                    $where = " WHERE dd.estado = 3
                              AND dd.idestructuracomun = {$filtro['identidad']}
                              AND cat.idalmacen = {$filtro['idestructura']} AND dp.iddocumentopadre is null";// 
                    $limit = " ORDER BY dd.fechacontable DESC, dd.cronologia DESC OFFSET {$filtro['start']} LIMIT {$filtro['limit']}";
                    break;
                default:
                    return array();
            }
            //echo $select . $from . $join . $where . $limit;die;
            $datos = Doctrine_Manager::connection()->fetchAll($select . $from . $join . $where . $limit);
            $cantidad = Doctrine_Manager::connection()->fetchAll($select . $from . $join . $where);
            return array('cantidad' => count($cantidad), 'datos' => $datos);
        } else {
            $ano = $numero = $descripcion = null;
            if ($filtro['nrodoc'] || $filtro['criterio']) {
                $numero = ($filtro['nrodoc']) ? $filtro['nrodoc'] : $filtro['criterio'];
            }
            if ($filtro['ejercicio']) {
                $ano = $filtro['ejercicio'];
            }
            if ($filtro['descripciongeneral']) {
                $descripcion = $filtro['descripciongeneral'];
            }
            $datos = $this->planificacionHelper->Solicitudes711DadoEntidad(
                $this->global->Estructura->idestructura, $ano, $descripcion, $numero, $filtro['start'], $filtro['limit']
            );
            return array('cantidad' => count($datos) ? $datos[0]['totalsolitudes'] : 0, 'datos' => $datos);
        }
    }

    /**
     * Devuelve los movimientos de un documento del subsitema especificado.
     * @param array $filtro
     * @return array
     */
    public function cargarProductosDocumentoExterno($filtro)
    {
        $filtro['idEntidadComun'] = ($filtro['idEntidadComun']) ? $filtro['idEntidadComun'] : $this->global->Estructura->idestructura;
        $config = $this->configuracionService->devolverConfiguracion($filtro['idEntidadComun']);
        $flag = $config['registrarcantidad'] ? '1' : '0';
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatProductoLogistica',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica(), $relations);
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatValeProductos',
            'properties' => array('local' => 'idindicador', 'foreign' => 'idindicador')
        );
        $this->doctrineHelper->tryInyectRelactions(new NomIndicador(), $relations);
        $idestructura = $filtro['idestructura'];
        if ($filtro['proceso'] == 'produccion') {
            $query = $this->getProductoModel()->getMaestroProducto()->getQueryIndicador('i');
            $this->getProductoModel()->getMaestroProducto()->addQueryJoinIndicadorHoja($query, 'i', 'ih', false);
            $query->leftJoin("i.DatProductoLogistica p ON i.idindicador = p.idindicador
                AND (p.idestructuracomun = {$filtro['idEntidadComun']} 
                AND (p.idestructura = {$filtro['idestructura']}))")
                ->addSelect(" p.idindicador as idindicador, p.idproducto as idproducto,"
                    . "p.idestructura as idestructura, p.idcategoria as idcategoria, "
                    . "p.numerolote as numerolote, p.fechavencelote as fechavencelote, "
                    . "i.idumedida as idumedidacrc, round(p.cantidad,6) as existencia,"
                    . "p.cronologia as cronologia, p.minimo as minimo, p.maximo as maximo, "
                    . "p.propiedad as propiedad,vp.cantidad AS cantidad,i.precio"
                //. ""
                );
            $query->innerJoin('i.DatValeProductos vp');
            if ($filtro['nrolote']) {
                $relations[] = array(
                    'cardinalidad' => 'many',
                    'relation' => 'DatLote',
                    'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
                );
                $filtro['fechafabricacion'] = $filtro['fechafabricacion'] ? $filtro['fechafabricacion'] : date('d/m/Y');
                $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica(), $relations);
                $query->leftJoin("p.DatLote dl ON dl.idproducto is null")
                    ->addSelect("{$filtro['nrolote']} as numero, 1 as idpais,"
                        . "{$filtro['fechafabricacion']} as fechafabricacion, 1 as disponible, 
                      1 as existencia, 1 as estado, {$filtro['idEntidadComun']}  as idfabricante");
            }
            if ($filtro['idindicador']) {
                $query->addWhere('i.idindicador =?', array($filtro['idindicador']));
            }
            $query->addWhere('vp.iddeposito =? and vp.idvaleproduccion = ?', array($filtro['idestructura'], $filtro['idpadre']));
            //echo $query->getSqlQuery();die;
        } else {
            unset($filtro['idestructura']);
            $query = $this->getProductoModel()->devolverMovimientos($filtro, true);
            $query->addWhere("
                mov.cantidad > COALESCE((
                  SELECT dmov.cantidad FROM DatMovimientos dmov
                  INNER JOIN dmov.DatDocumento ddev
                  WHERE dmov.idproducto = mov.idproducto AND ddev.estado = 4 AND ddev.iddocumento IN (
                  SELECT ddpd.iddocumento FROM DatDocumentoPadre ddpd WHERE ddpd.idpadre = {$filtro['iddocumento']}
                  ) 
                ),0)
            ");
            if ($filtro['proceso'] == 'facturacion') {
                $query->addSelect("
                    COALESCE((SELECT COALESCE(dmm.precio,0) FROM DatMovmoneda dmm WHERE dmm.idmovimiento = mov.idmovimiento AND dmm.idmoneda = {$this->_idmonedacontable}),0) as precioventa
                "
                );
            }
            $verificarCategoria = ($config['categoriaproducto']) ? "AND coalesce(p.idcategoria, -1) = coalesce(p2.idcategoria, -1) " : "";
            $query->addSelect("null AS idmovimiento,mov.cantidad AS cantfactura,"
                . "(CASE WHEN ({$flag} = '1' OR ih.tipocontrol = 3) THEN 0 ELSE mov.cantidad END) AS cantidadmov, "
                . "mov.preciocontable, mov.importecontable, mov.precioalternativo, mov.importealternativo, "
                . "mov.idmovimiento AS idmov"
            )
                ->leftJoin(
                    "p.DatProductoLogistica p2 ON (p2.idindicador = p.idindicador AND p2.idestructura = $idestructura "
                    . "{$verificarCategoria} AND p.idumedida = p2.idumedida)"
                );
            $query->addOrderBy('mov.idmovimiento');
            $query->addSelect("{$idestructura} AS idestructura, p2.idproducto AS idproducto, p.idcategoria AS idcategoria, p.idumedida AS idumedida, p.idproducto as idporigen,"
                . "p.idumedida AS idunidadmedida, p.minimo AS minimo, p.maximo AS maximo,true AS cancelar,"
                . "p.idclasificacioncontable AS idclasificacioncontable,"
                . "(CASE WHEN ih.tipocontrol = 2 THEN 1 ELSE 0 END) AS tienelote, "
                . "(CASE WHEN ih.tipocontrol = 3 THEN 1 ELSE 0 END) AS equipo, "
                . "(CASE WHEN ih.tipocontrol = 4 THEN 1 ELSE 0 END) AS municion"
            );
        }
        //echo $query->getSqlQuery();die;
        $data = $query->fetchArray();
        //print_r($data);die;
        for ($i = 0; $i < (count($data)); $i++) {
            for ($j = $i + 1; $j < count($data); $j++) {
                if ($data[$i]['idproducto'] == $data[$j]['idproducto'] && !is_null($data[$j]['idproducto'])) {
                    $data[$i]['cantfactura'] += $data[$j]['cantfactura'];
                    $data[$i]['cantidadmov'] += $data[$j]['cantidadmov'];
                    unset($data[$j]);
                }
            }
            if ($filtro['proceso'] != 'produccion') {
                $data[$i]['cantidad'] = $data[$i]['cantidadmov'];
            }
            if ($data[$i]['cantidad'] == 0) {
                $data[$i]['importecontable'] = 0;
            }
            if ($filtro['proceso'] == 'facturacion') {
                $data[$i]['preciocontable'] = $data[$i]['precioventa'];
                $data[$i]['importecontable'] = round($data[$i]['preciocontable'] * $data[$i]['cantidad'], 2);
            }
            unset($data[$i]['DatProductoLogistica']);
            unset($data[$i]['iddocumento']);
            unset($data[$i]['signo']);
            unset($data[$i]['idmovimiento']);
        }
        unset($data[(count($data) - 1)]['DatProductoLogistica']);
        unset($data[(count($data) - 1)]['iddocumento']);
        unset($data[(count($data) - 1)]['signo']);
        unset($data[(count($data) - 1)]['idmovimiento']);
        //print_r(array('datos' => array_values($data)));die;
        return array('datos' => array_values($data));
    }

    /**
     * @param array $filtro
     * @return array
     */
    public function cargarDiferenciasXCantidad($filtro)
    {
        return $this->reclamacionService->cargarDiferenciasXCantidad($filtro);
    }

    /**
     * @param numeric $idmovimiento
     * @return array
     */
    public function cargarDiferenciasXCalidad($idmovimiento)
    {
        return $this->reclamacionService->cargarDiferenciasXCalidad($idmovimiento);
    }

    /**
     * Devuelve las diferencias entre la factura y el movimiento.
     * @param array $filtro
     * @return array
     */
    private function cargarDiferencias($filtro)
    {
        $query = Doctrine_Query::create()->select(
            'mr.idmovimiento, coalesce(abs(mr.cantidad - m.cantidad), 0) AS cantidaddiferencia, '
            . '(CASE WHEN mr.cantidad < m.cantidad THEN 1 WHEN mr.cantidad > m.cantidad THEN 2 END) '
            . 'AS signo, 0 AS preciodiferencia, 0 AS importediferencia, 0 AS preciodiferenciaalt, '
            . '0 AS importediferenciaalt'
        )
            ->from('DatMovrecepcion mr')
            ->innerJoin('mr.DatMovimientos m');
        if ($filtro['iddocumento']) {
            $query->where('m.iddocumento = ?', $filtro['iddocumento']);
        } else {
            $query->where('mr.idmovimiento = ?', $filtro['idmovimiento']);
        }
        return $query->fetchArray();
    }

    /**
     * @param array $datos
     * @param boolean $varios [Opcional]
     * @return boolean
     */
    public function registrarDiferencias($datos, $varios = false)
    {
        return $this->reclamacionService->registrarDiferencias($datos, $varios);
    }

    /**
     * Devuelve la cantidad de movimientos del documento.
     * @param numeric $iddocumento
     * @return integer
     */
    public function getCantMovimientos($iddocumento)
    {
        return Doctrine_Query::create()->from('DatMovimientos m')->where('m.iddocumento = ?', $iddocumento)->count();
    }

    /**
     * Devuelve los importe contable y alternativo total del documento.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function productosConDescuento($iddocumento)
    {
        return true;
        $query = Doctrine_Query::create()
            ->select('d.iddocumento')
            ->from('DatDocumento d')
            ->innerJoin('d.DatMovimientos m')
            ->innerJoin('d.DatRecepcion r')
            ->where('d.iddocumento = ? AND r.tipopago = 2', $iddocumento)
            ->having(
                '(r.descuento > 0 AND sum(m.importecontable) <= r.descuento) OR (r.descuentoalternativo > 0 '
                . 'AND sum(coalesce(m.importealternativo, 0)) <= r.descuentoalternativo)'
            )
            ->groupBy('d.iddocumento, r.descuento, r.descuentoalternativo');
        return $query->count() == 0;
    }

    /**
     * Busca un producto dentro del arreglo por su id.
     * @param array $productos
     * @param numeric $idproducto
     * @return array
     */
    private function buscarProductoPorId($productos, $idproducto)
    {
        foreach ($productos as $value) {
            if ($idproducto == $value['idproducto']) {
                return $value;
            }
        }
        return null;
    }

    /**
     * Inyecta las relaciones entre clases.
     */
    private function tryInyector()
    {
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatRecepcion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatRecepcionSolicitud',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatDocumento(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatMovrecepcion',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $relations[] = array(
            'cardinalidad' => 'many',
            'relation' => 'DatMovmoneda',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatProductocmplto',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos(), $relations);
    }

    /**
     *Devuelve las monedas que no son ni contable ni alternativas
     */
    public function cargarMonedasDiferentes()
    {
        $monedaAlternativa = (array)$this->configuracionHelper->obtenerMonedasAlternativasPorEntidad($this->idestructuracomun)['datos'];
        $monedas = LogisticaGlobal::__init()->getMonedaEntidad();
        foreach ($monedaAlternativa as $mon) {
            $tasa = $this->configuracionHelper->getTasaByMonedas(
                $monedas->idmoneda, $mon['idmoneda'], $this->_tipoTasa
            );
            if (empty($tasa)) {
                $mon['tasa'] = 0;
            } else {
                $mon['tasa'] = $tasa;
            }
            if ($mon['dualidad'] == 0) {
                $arrayResult[] = $mon;
            }
        }
        return array('cantidad' => count($arrayResult), 'datos' => $arrayResult);
    }

    public function obtenerCondicionesPago($params)
    {
        $proveedor = $this->configuracionHelper->getClientesProveedorByParams(
            $params['idclienteproveedor'], null, null, null, null, null
        );

        $array = array();
        $arrayId = array();
        $count = 0;
        foreach ($proveedor['datos'][0]['cobrospagos'] as $cond) {
            if (!in_array($cond['idterminodepago'], $arrayId) && $cond['idclasificacion'] == 2 && $cond['idterminodepago'] != null) {
                if (isset($params['query']) && strlen($params['query']) > 0) {
                    if (stripos($cond['nombreterminodepago'], $params['query']) !== false) {
                        $arrayId[] = $cond['idterminodepago'];
                        $array[] = array('idterminodepago' => $cond['idterminodepago'], 'nombre' => $cond['nombreterminodepago']);
                        $count++;
                    }
                } else {
                    $arrayId[] = $cond['idterminodepago'];
                    $array[] = array('idterminodepago' => $cond['idterminodepago'], 'nombre' => $cond['nombreterminodepago']);
                    $count++;
                }
            }
        }
        return array('cantidad' => $count, 'datos' => $array);
    }

    public function cargarConceptosImporte($params)
    {
        $objNomenclador = new NomencladoresLogService();
        $query = $objNomenclador->getQueryConceptoImporte();
        $dci = $dci1 = $dci2 = $dci3 = $dci4 = $dci5 = '';
        if ($params['iddocumento']) {
            $dci = " and dci.iddocumento = {$params['iddocumento']}";
            $dci1 = " and dci1.iddocumento = {$params['iddocumento']}";
            $dci2 = " and dci2.iddocumento = {$params['iddocumento']}";
            $dci3 = " and dci3.iddocumento = {$params['iddocumento']}";
            $dci4 = " and dci4.iddocumento = {$params['iddocumento']}";
            $dci5 = " and dci5.iddocumento = {$params['iddocumento']}";
        }
        $query->addSelect(
            "(
                SELECT dci.valormn FROM DatConceptoimporterecep dci
                WHERE dci.idconceptoimporte = m.idcategoriaprecio {$dci}
            ) as valormn"
        );
        $query->addSelect(
            "(
                SELECT dci1.valoralt FROM DatConceptoimporterecep dci1
                WHERE dci1.idconceptoimporte = m.idcategoriaprecio {$dci1}
            ) as valoralt"
        );
        $query->addSelect(
            "(
                SELECT dci2.idproveedor FROM DatConceptoimporterecep dci2
                WHERE dci2.idconceptoimporte = m.idcategoriaprecio {$dci2}
            ) as idproveedor"
        );
        $query->addSelect(
            "(
                SELECT dci3.idcondicionpago FROM DatConceptoimporterecep dci3
                WHERE dci3.idconceptoimporte = m.idcategoriaprecio {$dci3}
            ) as idcondicionpago"
        );
        $query->addSelect(
            "(
                SELECT dci4.idconceptorecep FROM DatConceptoimporterecep dci4
                WHERE dci4.idconceptoimporte = m.idcategoriaprecio {$dci4}
            ) as idconceptorecep"
        );
        $query->addSelect(
            "(
                SELECT dci5.nrofactura FROM DatConceptoimporterecep dci5
                WHERE dci5.idconceptoimporte = m.idcategoriaprecio {$dci5}
            ) as nrofactura"
        );

        $query->addWhere('m.conformaprecio = ?', array(0));
        $conceptos = $query->fetchArray();
        $conceptosResult = array();
        foreach ($conceptos as &$c) {
            $c['proveedor'] = "";
            if ($c['idproveedor']) {
                $prov = $this->configuracionHelper->getClientesProveedorByParams(
                    $c['idproveedor'], null, null, null, null, null
                );
                $c['proveedor'] = $prov['datos'][0]['nombre'];
                $c['cobrospagos'] = $prov['datos'][0]['cobrospagos'];
                if ($c['idcondicionpago']) {
                    foreach ($c['cobrospagos'] as $cc) {
                        if ($c['idcondicionpago'] == $cc['idterminodepago']) {
                            $c['condicionpago'] = $cc['nombreterminodepago'];
                            break;
                        }
                    }
                }
            }
            if (($c['estado'] == 1 && ($c['idtipo'] == 1 || $c['idtipo'] == 0)) || $c['valormn'] > 0) {
                $conceptosResult[] = $c;
            }
        }
        return array('datos' => $conceptosResult, 'cantidad' => count($conceptosResult));
    }

    public function procesarMonedasTasa($iddocumento, $tasa)
    {
        $recep = Doctrine::getTable('DatRecepcion')->find($iddocumento);
        $collMoneda = new Doctrine_Collection('DatMovmoneda');
        $movimientos = Doctrine_Query::create()
            ->select('m.idmovimiento,m.preciocontable,m.importecontable,m.cantidad')
            ->from('DatMovimientos m')
            ->where('m.iddocumento = ?', $iddocumento)
            ->fetchArray();
        foreach ($movimientos as $value) {
            $monedas = $this->cargarMonedas(array('idmovimiento' => $value['idmovimiento']), true)->fetchArray();
            if (count($monedas)) {
                $this->adicionarMoneda($monedas, $tasa);
            } else {
                $obj = new DatMovmoneda();
                $obj->idmovimiento = $value['idmovimiento'];
                $obj->idmoneda = $recep->idmoneda;
                $obj->precio = $value['preciocontable'];
                $obj->importe = $value['importecontable'];
                $obj->preciotasa = $value['preciocontable'] * $tasa;
                $obj->importetasa = round($value['preciocontable'] * $tasa * $value['cantidad'], LogisticaGlobal::FACTOR_REDONDEO);
                $collMoneda->add($obj);
            }
            $datosAct = array(
                'idmovimiento' => $value['idmovimiento'],
                'preciocontable' => $value['preciocontable'],
                'precioalternativo' => 0,
                'importealternativo' => 0,
                'cantidad' => $value['cantidad'],
                'importecontable' => LogisticaObjectHelper::__init()->_round($value['preciocontable'] * $value['cantidad'], 2),
                'entrada' => true
            );
            $result = $this->getProductoModel()->modificarMovimientos(array($datosAct));
        }
        $collMoneda->save();
    }

    public function cargarProductos711($params)
    {
        $datosMaestros = new MaestroProductoModel();
        $params['tipo'] = 1;
        $params['grid'] = 1;
        $datosAux = $this->planificacionHelper->Productos711DadoEntidad($this->global->Estructura->idestructura);//array(193328, 207828, 208354, 147959, 106373);
        $idIndicador711 = $this->objectHelper->extractValueFromArrayColumn($datosAux, 'idindicador');
        if (count($idIndicador711) == 0) {
            $idIndicador711 = array(-1);
        }
        $dql = $datosMaestros->getQueryIndicador()->andWhereIn('ind.idindicador', $idIndicador711);
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $dql, 'ind', 'umedida', 'umedida.abreviaturaunidadmedida AS umedida, umedida.decimales AS decimales', 'leftJoin'
        );
        $datosMaestros->addQueryJoinIndicadorHoja($dql);
        $dql->addSelect("(SELECT p.idproducto FROM DatProductoLogistica p WHERE p.idindicador = ind.idindicador AND p.idestructura = {$params['idalmacen']} LIMIT 1) AS existe");
        $dql->addSelect("(SELECT p1.idclasificacioncontable FROM DatProductoLogistica p1 WHERE p1.idindicador = ind.idindicador AND p1.idestructura = {$params['idalmacen']} LIMIT 1) AS idclasificacioncontable");
        $dql->addSelect("{$params['idalmacen']} AS idestructura,"
            . "(CASE WHEN indh.tipocontrol = 2 THEN 1 ELSE 0 END) AS tienelote, "
            . "(CASE WHEN indh.tipocontrol = 3 THEN 1 ELSE 0 END) AS equipo, "
            . "(CASE WHEN indh.tipocontrol = 4 THEN 1 ELSE 0 END) AS municion"
        );
        if ($params['iddocumento']) {
            $conn = Zend_Registry::get('conexion');
            $q = $conn->execute("
                Select p.idindicador from mod_logistica.dat_producto p 
                inner join mod_logistica.dat_movimiento dm using(idproducto)
                where dm.iddocumento = {$params['iddocumento']} 
                ")
                ->fetchAll(PDO::FETCH_COLUMN);
            if (count($q))
                $params['idseleccionados'] = json_encode($q);
        }
        $datosMaestros->addFiltersQueryIndicador($dql, 'ind', $params);
        $cantidad = $dql->count();
        return array('datos' => $dql->offset($params['start'])->limit($params['limit'])->fetchArray(), 'cantidad' => $cantidad);
    }

    public function getDatosActualizarSolicitud($iddocumento)
    {
        $conn = Zend_Registry::get('conexion');
        $q = $conn->execute("
                Select p.idindicador, dm.cantidad from mod_logistica.dat_producto p 
                inner join mod_logistica.dat_movimiento dm using(idproducto)
                where dm.iddocumento = {$iddocumento} 
                ")
            ->fetchAll(PDO::FETCH_ASSOC);
        $q1 = $conn->execute("
                Select ds.idsolicitudpadre from mod_loginventario.dat_recepcionsolicitud ds 
                where ds.iddocumento = {$iddocumento} 
                ")
            ->fetchAll(PDO::FETCH_COLUMN);
        if (count($q1)) {
            return array('idsolicitud' => $q1[0], 'productos' => $q);
        }
        return false;
    }

    public function sumarImportesInternos($params)
    {
        return Doctrine_Query::create()->select("SUM(round(dm.cantidad * dm.preciocontable,2)) as importe")
            ->from('DatMovimientos dm')
            ->where('dm.iddocumento = ?', array($params['iddocumento']))
            ->fetchArray();
    }

    //Importar
    public function importarFichero($file, $params)
    {
        if ((new VariablesGlobalesModel())->obtenerValor('isNovaBank') == 1) {
            return $this->importProductsNovaBank($file, $params['iddocumento']);
        }
        $error = $file['error'];
        Doctrine_Query::create()->delete('TmpImpproductorecepcion')->where('iddocumento = ?', array($file['iddocumento']))->execute();
        $collection = new Doctrine_Collection('TmpImpproductorecepcion');
        $collection->synchronizeWithArray($file['productos']);
        $collection->save();
        if (!$error) {
            $resultError = $this->importarProductoRecepcion($params['idestructuracomun'], $file['iddocumento']);
            $file['productoserror'] = count($resultError);
        }
        return $file;
    }

    public function importarProductoRecepcion($iddeposito, $iddocumento)
    {
        $sql = "SELECT * FROM mod_loginventario.f_importaproductorecepcion(
            {$this->global->Perfil->idusuario},
            {$this->global->Estructura->idestructura},
            {$iddeposito},
            {$iddocumento}
            )";
        // Productos duplicados. Error 3.
        // Codigo producto nulo. Error 4.

        $result = Doctrine_Manager::connection()->fetchOne($sql);
        $sqlError = "SELECT * FROM mod_loginventario.tmp_impproductorecepcionerror where iddocumento = {$iddocumento}";

        $resultError = Doctrine_Manager::connection()->execute($sqlError)->fetchAll(PDO::FETCH_ASSOC);
        return count($resultError);
    }

    public function cargarProductoError($params)
    {
        if ($params['inactivos']) {
            $params['inactivos'] = json_decode($params['inactivos']);
            $idsProds = implode(',', $params['inactivos']);
            $sqlError = "SELECT pi.idproducto, ni.numeropieza as codigoproducto, ni.denominacion as denominacionproducto,
                      um.abreviaturaunidadmedida as um 
                  FROM mod_logistica.dat_productoinactivo pi 
                  INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = pi.idproducto
                  INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
                  INNER JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = dp.idumedida
                  WHERE pi.idproducto IN ({$idsProds})";
        } else {
            $sqlError = "
            SELECT ipre.*, ipr.codigobarra
            FROM mod_loginventario.tmp_impproductorecepcionerror ipre
            inner join mod_loginventario.tmp_impproductorecepcion ipr on ipre.idimpproductorecepcion = ipr.idimpproducto
            where ipre.iddocumento = {$params['iddocumento']}
            ";
        }

        $resultError = Doctrine_Manager::connection()->execute($sqlError)->fetchAll(PDO::FETCH_ASSOC);
        return array('datos' => $resultError, 'total' => count($resultError));
    }

    public function eliminarImportar($params)
    {
        $sqlError = "delete from mod_loginventario.tmp_impproductorecepcionerror where iddocumento = {$params['iddocumento']}";

        Doctrine_Manager::connection()->execute($sqlError);
        return array('success' => true);
    }

    /*prueba*/
    public function setDefaultParam($array, $param, $default = null)
    {
        $value = $array[$param];
        if ((null === $value) && (null !== $default)) {
            $value = $default;
        }
        $array[$param] = $value;
    }

    public function sincronizarArray($datos, $params)
    {
        if ((new VariablesGlobalesModel())->obtenerValor('isNovaBank') == 1) {
            return $this->processExcelNovaBank($datos);
        }
        $campos = array(
            'codigoproducto', 'codigoauxiliar', 'descripcionproducto', 'denominacionproducto', 'um', 'naturaleza', 'tipo',
            'almacenamiento', 'utiloherramienta', 'precio', 'formaalmacenamiento',
            'grupo', 'marca', 'modelo', 'elementogasto', 'clasificacioncontable', 'cantidad', 'nrolote', 'nroserie', 'codigobarra'
        );
        $productos = array();
        $params['data'] = $this->objectHelper->stdClassToArray(Zend_Json::decode($params['data']));
        $params = array_merge($params, $params['data']);
        unset($params['data']);
        foreach ($params as $param => $value) {
            if (null == $value) {
                unset($params[$param]);
            }
        }
        $this->setDefaultParam($params, 'tipopago', null);
        $this->setDefaultParam($params, 'recargo', null);
        $this->setDefaultParam($params, 'descuento', null);
        $this->setDefaultParam($params, 'recargoalternativo', null);
        $this->setDefaultParam($params, 'descuentoalternativo', null);
        $this->setDefaultParam($params, 'cantbulto', 0);
        $this->setDefaultParam($params, 'tipobulto', null);

        $params['alias'] = 'recepcionLog';
        $params['subsistema'] = LogisticaGlobal::SUBSISTEMA_INV;

        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            $params['alias'], $this->idestructuracomun, LogisticaGlobal::SUBSISTEMA_INV
        );
        $params['iddoc'] = $objDocPrim->iddoc;
        $this->setIdSubsistema(LogisticaGlobal::SUBSISTEMA_INV);
        $data = $this->adicionarDocumento($params);

        foreach ($datos as $index => $item) {
            if ($index > 0) {
                $prod = array();
                if (strlen($item[0]) > 0 || strlen($item[19]) > 0) {
                    foreach ($item as $key => $value) {
                        $value = trim($value);
                        if ($value && (substr_count($campos[$key], 'cantidad') || substr_count($campos[$key], 'precio') ||
                                substr_count($campos[$key], 'importe'))) {
                            $value = str_replace(',', '', $value);

                        }
                        $prod[$campos[$key]] = $value ?: null;
                    }
                    $prod['iddocumento'] = $data['iddocumento'];
                    $productos[] = $prod;
                }

            }
        }
        return array_merge($data, array('productos' => $productos, 'error' => ''));
    }

    public function getContratos($params)
    {
        if ($params['criterio']) {
            $params['numerocontrato'] = $params['criterio'];
        }
        if (!$params['idclienteproveedor']) {
            unset($params['idclienteproveedor']);
        }
        $params['vigente'] = 1;
        $params['clientes'] = '[0,2]';
        $arrayContrato = $this->crmHelper->getContratos($params);
        return array('datos' => $arrayContrato['data'], 'cantidad' => $arrayContrato['cant']);
    }

    public function getServContrato($params)
    {
        $datos = [];
        $arrayServicios = $this->crmHelper->getServiciosByContrato($params);
        if (count($arrayServicios['hitos']) > 0) {
            foreach ($arrayServicios['hitos'] as &$hito) {
                $hito['denominacion'] = $hito['descripcion'];
                //$hito['prodserv'] = '<p><table>';
                if (count($hito['indicadoresservicios']) > 0) {
                    $hito['prodserv'] .= '<p><table style="color: #006400"><tr><td width="80"></td><td width="200"><p><b>Servicios</b></p></td>';
                    $hito['prodserv'] .= '</td><td width="80" align="right"><p><b>Cantidad</b></p></td></tr>';
                    foreach ($hito['indicadoresservicios'] as &$p) {
                        $hito['prodserv'] .= '<tr><td width="80"></td><td width="200"><p><li>' . $p['denominacion'] . '</li></p></td>';
                        $hito['prodserv'] .= '<td width="80" align="right"><p>' . $p['cantidad'] . '</p></td></tr>';
                        //$hito['servicioslist'] .= '<li>'.$p['denominacion'].'</li>';
                        //$p['idhito'] = $hito['idhito'];
                    }
                    $hito['prodserv'] .= '</table></p>';
                }
                if (count($hito['indicadoresproductos']) > 0) {
                    $cantidad = (count($hito['indicadoresservicios']) > 0) ? '' : 'Cantidad';
                    $hito['prodserv'] .= '<p><table style="color: #00008b"><tr><td width="80"></td><td width="200"><p><b>Productos</b></p></td>';
                    $hito['prodserv'] .= '</td><td width="80" align="right"><p><b>' . $cantidad . '</b></p></td></tr>';
                    foreach ($hito['indicadoresproductos'] as &$p) {
                        $hito['prodserv'] .= '<tr><td width="80"></td><td width="200"><p><li>' . $p['denominacion'] . '</li></p></td>';
                        $hito['prodserv'] .= '<td width="80" align="right"><p>' . $p['cantidad'] . '</p></td></tr>';
                    }
                    $hito['prodserv'] .= '</table></p>';
                }
            }
            $datos = array_merge($datos, $arrayServicios['hitos']);
        } else {
            if (count($arrayServicios['indicadoresservicios']) > 0) {
                $datos = array_merge($datos, $arrayServicios['indicadoresservicios']);
            }
        }
        return array('datos' => $datos, 'cantidad' => count($datos));
    }

    public function getProdContrato($params)
    {
        $datos = [];
        $arrayServicios = $this->crmHelper->getServiciosByContrato($params);
        if (count($arrayServicios['hitos']) > 0) {
            foreach ($arrayServicios['hitos'] as &$hito) {
                $hito['denominacion'] = $hito['descripcion'];
                //$hito['prodserv'] = '<p><table>';
                if (count($hito['indicadoresproductos']) > 0) {
                    $hito['prodserv'] .= '<p><table style="color: #00008b"><tr><td width="80"></td><td width="200"><p><b>Productos</b></p></td>';
                    $hito['prodserv'] .= '</td><td width="80" align="right"><p><b>Cantidad</b></p></td></tr>';
                    foreach ($hito['indicadoresproductos'] as &$p) {
                        $hito['prodserv'] .= '<tr><td width="80"></td><td width="200"><p><li>' . $p['denominacion'] . '</li></p></td>';
                        $hito['prodserv'] .= '<td width="80" align="right"><p>' . $p['cantidad'] . '</p></td></tr>';
                        //$hito['prodserv'] .= '<li>'.$p['denominacion'].'</li>';
                        //$hito['productoslist'] .= '<li>'.$p['denominacion'].'</li>';
                        //$p['idhito'] = $hito['idhito'];
                    }
                    $hito['prodserv'] .= '</table></p>';
                }
                if (count($hito['indicadoresservicios']) > 0) {
                    $cantidad = (count($hito['indicadoresproductos']) > 0) ? '' : 'Cantidad';
                    $hito['prodserv'] .= '<p><table style="color: #006400"><tr><td width="80"></td><td width="200"><p><b>Servicios</b></p></td>';
                    $hito['prodserv'] .= '</td><td width="80" align="right"><p><b>' . $cantidad . '</b></p></td></tr>';
                    foreach ($hito['indicadoresservicios'] as &$p) {
                        $hito['prodserv'] .= '<tr><td width="80"></td><td width="200"><p><li>' . $p['denominacion'] . '</li></p></td>';
                        $hito['prodserv'] .= '<td width="80" align="right"><p>' . $p['cantidad'] . '</p></td></tr>';
                        //$hito['servicioslist'] .= '<li>'.$p['denominacion'].'</li>';
                        //$p['idhito'] = $hito['idhito'];
                    }
                    $hito['prodserv'] .= '</table></p>';
                }
            }
            $datos = array_merge($datos, $arrayServicios['hitos']);
        } else {
            if (count($arrayServicios['indicadoresproductos']) > 0) {
                $datos = array_merge($datos, $arrayServicios['indicadoresproductos']);
            }
        }
        return array('datos' => $datos, 'cantidad' => count($datos));
    }

    public function getPuertos($params)
    {
        $limit = "";
        if (isset($params['start']) && isset($params['limit'])) {
            $limit = " offset %s limit %s ";
        }
        $sql = sprintf("select f.*, COUNT(*) OVER() as total from mod_crmcontratacion.nom_puertodestino f
                        {$limit}", $params['start'], $params['limit']);
        $puertos = LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $puertos,
            'cantidad' => (count($puertos) ? $puertos[0]['total'] : 0)
        );
    }

    public function generarCodigoBarrasProductoError($post)
    {
        $idestandarcodigobarra = $post['idestandarcodigobarra'];
        $idestructura = $this->global->Estructura->idestructura;
        if (!$idestandarcodigobarra) {
            return [
                'codigoMsg' => -2,
                'msg' => 'Debe seleccionar un estandar de codigo de barra'
            ];
        }

        $conn = Doctrine_Manager::connection();

        $errores = $conn->fetchAll("
            select iderror
            from mod_loginventario.tmp_impproductorecepcionerror
            group by iderror
        ");

        if (!(count($errores) === 1 && $errores[0]['iderror'] == 7)) {
            return [
                'codigoMsg' => -1,
                'msg' => 'Resuelva los demas errores aparte de los codigo barra vacio'
            ];
        }
        //mod_loginventario.tmp_impproductorecepcion 
        $datos = $conn->fetchAll("
            select idimpproductorecepcion
            from mod_loginventario.tmp_impproductorecepcionerror 
            where iderror = 7
        ");

        if (count($datos) > 0) {
            $conn->fetchAll("
            select idimpproductorecepcion
            from mod_loginventario.f_generar_codigo_barra_en_impproducto_recepcion(
				{$idestandarcodigobarra},
				{$idestructura}
			)
        	");
        }

        $error = $this->importarProductoRecepcion();
        if ($error === 0) {
            return [
                'datos' => $datos,
                'codigoMsg' => 1,
                'msg' => 'Se importaron los datos',
                'error' => $error
            ];
        } else {
            return [
                'codigoMsg' => -3,
                'msg' => 'Esto no deberia pasar',
                'error' => $error
            ];
        }
    }
    private function processExcelNovaBank($datos)
    {
        $results = array();
        $excelColumns = array('indice', 'codigo', 'descripcion', 'unidad_medida', 'precio', 'serie', 'clasificacion');
        foreach ($datos as $index => $item) {
            $insertedItem = array();
            if ($index > 0) {
                foreach ($item as $columnIndex => $value) {
                    $insertedItem[$excelColumns[$columnIndex]] = $value;
                }
                $results[] = $insertedItem;
            }
        }
        return $results;
    }
    private function importProductsNovaBank($file, $idDocumento)
    {
        foreach ($file as $pos => $item) {
            $sqlInsert = "insert into mod_loginventario.tmp_importarlotes (codigo, descripcion, um, serie, precio, clasificacion,iddocumento)
                        values ('{$item['codigo']}','{$item['descripcion']}','{$item['unidad_medida']}','{$item['serie']}',{$item['precio']},'{$item['clasificacion']}',$idDocumento);";
            LogisticaDoctrineHelper::__init()->executeQuery($sqlInsert);
        }
        $entidad = $this->global->Estructura->idestructura;
        $sql = "select from mod_loginventario.f_importarlotes(p_iddocumento:= $idDocumento, p_entidad:= $entidad)";
        //die($sql);
        LogisticaDoctrineHelper::__init()->executeQuery($sql);
        return $file;
    }
}
