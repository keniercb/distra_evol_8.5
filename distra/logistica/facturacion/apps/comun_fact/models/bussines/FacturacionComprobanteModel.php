<?php

class FacturacionComprobanteModel extends LogisticaComprobanteModel
{

    protected $dualidad, $idCentroCostoFac, $_modelo;

    public function __construct()
    {
        parent::__construct();
        $this->dualidad = LogisticaGlobal::__init()->getMonedaEntidad();
    }

    public function generarPases($idDocumento, $modelo, &$pases, $idOperacion, $nroDoc, $estado, $importeAnticipos = 0)
    {
        $this->_modelo = $modelo;
        $queryData = Doctrine_Query::create()->select('coalesce(idcentrocosto,-1) as idcentrocosto')->from('DatDocfactura')
            ->where('idfactura = ?', array($idDocumento))->fetchOne();
        $this->idCentroCostoFac = $queryData->idcentrocosto;
        parent::generarPases($idDocumento, $modelo, $pases, $idOperacion, $nroDoc, $estado, $importeAnticipos);
    }

    public function cargarDocContabilizados($parametros)
    {
        $estado = array(EstadoDocumentoModel::ESTADO_CANCELADO, EstadoDocumentoModel::ESTADO_CONTABILIZADO);
        if ($parametros['estado']) {
            $estado = array($parametros['estado']);
        }
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $serviceFact = new FacturacionService();
        $documentos = $serviceFact->getDocumentos(
            array_merge($parametros, array(
                'solofacturas' => 1,
                'notadc' => 1,
                'compventa' => 1,
                'comprobante' => 1,
                'datosBasicos' => 1,
                'estado' => $estado,
                'hasta' => $fecha->fecha
            ))
        );
        $documentos['cantidad'] = $documentos['total'];
        return $documentos;
    }

    public function generarPase($idDocumento, $pase, $estado, $devfac = false, $importeAnticipos = 0)
    {
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        $objPase = $this->inicializarPase($pase, $idDocumento);
        $signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        $documento = Doctrine::getTable('DatDocumento')->find($idDocumento);
        $factura = Doctrine::getTable('DatDocfactura')->find($idDocumento);
        $tipoDocNC = $this->documentosHelper->devuelveIddocByIdEstructura(
            'creditoLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $tipoDocDev = $this->documentosHelper->devuelveIddocByIdEstructura(
            'compdevLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        if (($tipoDocNC->iddoc && $documento->iddoc == $tipoDocNC->iddoc) || ($tipoDocDev->iddoc && $documento->iddoc == $tipoDocDev->iddoc)) {
            $signo = LogisticaMovimientoModel::SIGNO_MOV_SUMA;
        }
        $importeResta = 0;
        if ($pase['tipocuenta'] == 'fija') {
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($pase['cuenta']);
            $objPase->idcuenta = $cuenta->idcuenta;
        } else {
            switch ($pase['cuenta']['valor']) {
                /**
                 * Cuenta del cliente
                 */
                case 100 :
                    $idmoneda = $moneda->idmoneda;
                    $objIddocVenta = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
                        'compventaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
                    );
                    $objIddocDev = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
                        'compdevLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
                    );
                    $conn = Doctrine_Manager:: connection();
                    if (($objIddocVenta->iddoc && $documento->iddoc == $objIddocVenta->iddoc) || ($objIddocDev->iddoc && $documento->iddoc == $objIddocDev->iddoc)) {
                        $sqlMoneda = "Select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                        on dm.idmovimiento = mm.idmovimiento
                        where dm.iddocumento = {$idDocumento} limit 1";
                        $arrayMoneda = $conn->execute($sqlMoneda)
                            ->fetchAll(PDO::FETCH_ASSOC);
                        if (!count($arrayMoneda)) {
                            $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
                        where mm.idventas = {$idDocumento} limit 1";
                            $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
                        }
                        $idmoneda = $arrayMoneda[0]['idmoneda'];
                    } else {
                        $dinamicaAlt = false;
                        foreach ($this->_modelo as $m) {
                            if ($m['tipocuenta'] == 'dinamica' && $m['cuenta']['valor'] == 113) {
                                $dinamicaAlt = true;
                            }
                        }
                        if (!$dinamicaAlt && $factura->idmoneda && $factura->pagoexterior != 1) {
                            $desgloseCuenta = (new VariablesGlobalesModel)->obtenerValor('DESGLOSE_CUENTA');
                            if (!$desgloseCuenta || $desgloseCuenta == 'true')
                                $idmoneda = $factura->idmoneda;
                        }
                    }
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, false, $idmoneda);
                    $importeResta = $importeAnticipos;
                    break;
                case 113 :
                    $idmonedaAlt = $moneda->idmonedaalternativa;
                    if ($factura->idmoneda) {
                        $idmonedaAlt = $factura->idmoneda;
                    } else if ($factura->idmonedaprod) {
                        $idmonedaAlt = $factura->idmonedaprod;
                    }
                    $objPase->idcuenta = $this->buscarCuentaClienteProveedor($idDocumento, false, $idmonedaAlt);
                    $objPase->idmoneda = $moneda->idmoneda;
                    $objPase->moneda = $moneda->codigoiso;
                    break;
                case 101:
                    return $this->pasesMovimientos($idDocumento, $pase, $signo);
                case 112:
                    return $this->pasesMovimientosAlternativo($idDocumento, $pase, $signo);
                case 107:
                    return $this->pasesFactoresPrecio($idDocumento, $pase, '+');
                case 109:
                    return $this->pasesFactoresPrecio($idDocumento, $pase, '-'); //-
                case 303:
                    return $this->pasesFactoresPrecioAlternativo($idDocumento, $pase, '+');
                case 304:
                    return $this->pasesFactoresPrecioAmbasMonedas($idDocumento, $pase, '+');
                case 305:
                    return $this->pasesFactoresPrecioAlternativo($idDocumento, $pase, '-'); //-
                case 306:
                    return $this->pasesFactoresPrecioAmbasMonedas($idDocumento, $pase, '-');
                default :
            }
        }
        $pases = $this->completarPase($objPase, $pase, $idDocumento, false, $importeResta);
        return count($pases) > 0 ? $pases : $objPase;
    }

    public function getDescuentoMaterialesByCentrocosto($idDocumento, $pase)
    {
        $sql = "select coalesce(sum(round(desg.descuento,2)),0) as importe, 
                coalesce(dps.idcentrocosto, -1) as idcentrocosto
                from mod_logfacturacion.dat_prodservicios dps 
                inner join mod_logfacturacion.dat_desglosemonedaprodserv desg on desg.idprodservicio = dps.idprodservicio 
                inner join mod_logfacturacion.dat_elementosfactura def on def.idelementofactura = dps.idelementofactura 
                inner join mod_logfacturacion.dat_prodservnomenclador dpsn on dpsn.idelementofactura = def.idelementofactura 
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpsn.idindicador
                inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                where def.idfactura = {$idDocumento} and desg.idmoneda = {$this->dualidad->idmoneda} group by dps.idcentrocosto";
        $conn = Doctrine_Manager:: connection();
        $importe = $conn->execute($sql)
            ->fetchAll(PDO::FETCH_ASSOC);
        $categorias = Doctrine_Query::create()
            ->select("dcpf.idcategoriafactura, "
                . "cp.porciento as porciento,round(ddcp.valorcalculo,2) as valor, nc.idcuenta as idcuenta")
            ->from('DatCategoriaPrecioFactura dcpf')
            ->innerjoin('dcpf.DatDesglosecategoriapreciofactura ddcp')
            ->innerjoin('dcpf.NomClasificacioncontablelog nc')
            ->innerjoin('dcpf.NomCategoriaprecio cp')
            ->where(
                "dcpf.idfactura = ? and ddcp.idmoneda = ? and cp.concepto = '-' and cp.codigo = 'DESC'", array($idDocumento, $this->dualidad->idmoneda)
            )
            ->fetchArray();
        $aux = array();
        $pases = array();
        $importeMateriales = 0;

        foreach ($categorias as &$cat) {
            foreach ($importe as $im) {
                $im['importemb'] = $im['importe'];
                $im['importemo'] = $im['importe'];
                $importeMateriales += $im['importe'];
                $objPase = $this->inicializarPase($pase, $idDocumento);
                $objPase->idcuenta = $cat['idcuenta'];
                if ($im['idcentrocosto'] != -1) {
                    $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $im['idcentrocosto']);
                } else if ($this->idCentroCostoFac)
                    $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $this->idCentroCostoFac);

                $this->objectHelper->synchronize($objPase, $im);
                array_push($pases, $objPase);
            }
            $cat['importemb'] = $cat['valor'] - $importeMateriales;
            $cat['importemo'] = $cat['valor'] - $importeMateriales;
            if ($cat['importemo'] > 0) {
                $objPase = $this->inicializarPase($pase, $idDocumento);
                $objPase->iddocumento = $idDocumento;
                $this->objectHelper->synchronize($objPase, $cat);
                array_push($pases, $objPase);
            }

        }
        return $pases;
    }

    public function pasesFactoresPrecio($idDocumento, $pase, $signo)
    {
        $pases = array();
        $aux = array();
        if (count($pase['sustituciones'])) {
            foreach ($pase['sustituciones'] as $sustitucion) {
                if ($sustitucion['valor'] == 119) {
                    if ($pase['valor']['valor'] == 109) {
                        return $this->getDescuentoMaterialesByCentrocosto($idDocumento, $pase);
                    }
                }
            }
        }
        $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
        $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;
        if ($fac->idmoneda || $fac->idmonedaprod) {
            if ($fac->idmoneda) {
                $sqlMoneda = " and ddcp.idmoneda = {$this->dualidad->idmoneda} and ddcp.idmonedacategoria = {$this->dualidad->idmoneda}";
                $sqlOtraMoneda = " and (ddcp.idmonedacategoria is null or ddcp.idmonedacategoria = {$fac->idmoneda}) ";

            } else {
                $sqlMoneda = " and (ddcp.idmoneda = {$this->dualidad->idmoneda} and (ddcp.idmonedacategoria is null or ddcp.idmonedacategoria = {$this->dualidad->idmoneda})
                                    or ddcp.idmoneda <> {$this->dualidad->idmoneda} and ddcp.idmonedacategoria = {$this->dualidad->idmoneda})";
                $sqlOtraMoneda = " and ((ddcp.idmonedacategoria is null and ddcp.idmoneda = {$fac->idmonedaprod}) or ddcp.idmonedacategoria = {$fac->idmonedaprod}) ";
            }
        } else {
            $sqlMoneda = " and (ddcp.idmonedacategoria = {$this->dualidad->idmoneda} or ddcp.idmonedacategoria is null) ";
            $sqlOtraMoneda = " and ddcp.idmonedacategoria is not null and ddcp.idmonedacategoria <> {$this->dualidad->idmoneda} ";
        }
        new DatCategoriaPrecioFactura();
        if ($fac->idmoneda) {
            $categorias = Doctrine_Query::create()
                ->select("ddcp.idcategoriafactura, "
                    . "cp.porciento as porciento,
                    (CASE WHEN ddcp.porciento = 1 THEN 
                        round(ddcp.valorcalculo,2)*{$tasa}
                     ELSE round(ddcp.valorcalculo,2) END) as valor
                    , nc.idcuenta as idcuenta")
                ->from('DatDesglosecategoriapreciofactura ddcp')
                ->innerjoin('ddcp.DatCategoriaPrecioFactura dcpf')
                ->innerjoin('dcpf.NomClasificacioncontablelog nc')
                ->innerjoin('dcpf.NomCategoriaprecio cp')
                ->where(
                    "dcpf.idfactura = ? and cp.concepto = '{$signo}' {$sqlMoneda}", array($idDocumento)
                )
                ->fetchArray();
        } else if ($fac->idmonedaprod) {
            $categorias = Doctrine_Query::create()
                ->select("ddcp.idcategoriafactura, "
                    . "ddcp.porciento as porciento,
                    (CASE WHEN ddcp.porciento = 1 and ddcp.idmoneda <> {$this->dualidad->idmoneda} THEN 
                        round(ddcp.valorcalculo,2)*{$tasa}
                     ELSE round(ddcp.valorcalculo,2) END) as valor
                    , nc.idcuenta as idcuenta")
                ->from('DatDesglosecategoriapreciofactura ddcp')
                ->innerjoin('ddcp.DatCategoriaPrecioFactura dcpf')
                ->innerjoin('dcpf.NomClasificacioncontablelog nc')
                ->where(
                    "dcpf.idfactura = ? and ddcp.concepto = '{$signo}' {$sqlMoneda}", array($idDocumento)
                )
                ->fetchArray();
        } else {
            $categorias = Doctrine_Query::create()
                ->select("ddcp.idcategoriafactura, "
                    . "cp.porciento as porciento,round(ddcp.valorcalculo,2) as valor, nc.idcuenta as idcuenta")
                ->from('DatDesglosecategoriapreciofactura ddcp')
                ->innerjoin('ddcp.DatCategoriaPrecioFactura dcpf')
                ->innerjoin('dcpf.NomClasificacioncontablelog nc')
                ->innerjoin('dcpf.NomCategoriaprecio cp')
                ->where(
                    "dcpf.idfactura = ? and ddcp.idmoneda = ? and cp.concepto = '{$signo}'", array($idDocumento, $this->dualidad->idmoneda)
                )
                ->fetchArray();
        }

        foreach ($categorias as $cat) {
            $aux[$cat['idcuenta']]['importe'] += $cat['valor'];
            $aux[$cat['idcuenta']]['idcuenta'] = $cat['idcuenta'];
        }
        $elementos = $this->getElementos($idDocumento);
        $movimientos = $this->getMovimientos($idDocumento);
        $q = Doctrine_Query::create()
            ->select("dec.idmovimiento,dec.idelementofactura,dec.idcategoriaelemento, dec.concepto as concepto,"
                . "dec.valor as valor, nc.idcuenta as idcuenta")
            ->from('DatElementocategoria dec')
            ->innerjoin('dec.DatCuentadesgloceprecio dcdp')
            ->innerjoin('dcdp.NomClasificacioncontablelog nc')
            ->where(
                "dec.valor is not null and dec.valor > 0 and dec.idmoneda = ? and dec.concepto = '{$signo}'", array($this->dualidad->idmoneda)
            );
        if ($elementos) {
            $q->andWhereIn('dec.idelementofactura', $elementos);
        }
        if ($movimientos) {
            $q->andWhereIn('dec.idmovimiento', $movimientos);
        }
        $categoriasElementos = $q->fetchArray();
        //mesclar con categorias y probar
        foreach ($categoriasElementos as $cat) {
            if ($cat['idelementofactura']) {
                $elemento = Doctrine::getTable('DatElementosFactura')->find($cat['idelementofactura']);
                $cant = $elemento->cantidad;
            } else {
                $elemento = Doctrine::getTable('DatMovimientos')->find($cat['idmovimiento']);
                $cant = $elemento->cantidad;
            }
            $aux[$cat['idcuenta']]['importe'] += round($cat['valor'] * $cant, 2);
            $aux[$cat['idcuenta']]['idcuenta'] = $cat['idcuenta'];
        }
        foreach ($aux as $idcuenta => $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $objPase->idcuenta = $value['idcuenta'];
            unset($value['idcuenta']);
            $objPase->conceptoprecio = 1;
            $objPase->iddocumento = $idDocumento;
            if ($this->idCentroCostoFac) {
                $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $this->idCentroCostoFac);
            }
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function pasesFactoresPrecioAlternativo($idDocumento, $pase, $signo)
    {
        $pases = array();
        $aux = array();
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
        $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;
        if ($fac->idmoneda || $fac->idmonedaprod) {
            if ($fac->idmoneda) {
                $sqlOtraMoneda = " and (ddcp.idmonedacategoria is null or ddcp.idmonedacategoria = {$fac->idmoneda}) ";

            } else {
                $sqlOtraMoneda = " and ((ddcp.idmonedacategoria is null and ddcp.idmoneda = {$fac->idmonedaprod}) or ddcp.idmonedacategoria = {$fac->idmonedaprod}) ";
            }
        } else {
            $sqlOtraMoneda = " and ddcp.idmonedacategoria is not null and ddcp.idmonedacategoria <> {$this->dualidad->idmoneda} ";
        }
        new DatCategoriaPrecioFactura();
        if ($fac->idmoneda) {
            $categorias = Doctrine_Query::create()
                ->select("ddcp.idcategoriafactura, "
                    . "cp.porciento as porciento,
                    (CASE WHEN ddcp.porciento = 1 THEN 
                        round(ddcp.valorcalculo,2)*{$tasa}
                     ELSE round(ddcp.valorcalculo,2)*{$tasa} END) as valor
                    , nc.idcuentaalt as idcuenta")
                ->from('DatDesglosecategoriapreciofactura ddcp')
                ->innerjoin('ddcp.DatCategoriaPrecioFactura dcpf')
                ->innerjoin('dcpf.NomClasificacioncontablelog nc')
                ->innerjoin('dcpf.NomCategoriaprecio cp')
                ->where(
                    "dcpf.idfactura = ? and cp.concepto = '{$signo}' {$sqlOtraMoneda}", array($idDocumento)
                )
                ->fetchArray();
        } else if ($fac->idmonedaprod) {
            $categorias = Doctrine_Query::create()
                ->select("ddcp.idcategoriafactura, "
                    . "ddcp.porciento as porciento,
                    (CASE WHEN ddcp.porciento = 1 and ddcp.idmoneda = {$this->dualidad->idmoneda} THEN 
                        round(ddcp.valorcalculo,2)/{$tasa}
                     ELSE round(ddcp.valorcalculo,2) END) as valor
                    , nc.idcuentaalt as idcuenta")
                ->from('DatDesglosecategoriapreciofactura ddcp')
                ->innerjoin('ddcp.DatCategoriaPrecioFactura dcpf')
                ->innerjoin('dcpf.NomClasificacioncontablelog nc')
                ->where(
                    "dcpf.idfactura = ? and ddcp.concepto = '{$signo}' {$sqlOtraMoneda}", array($idDocumento)
                )
                ->fetchArray();
        } else {
            $categorias = array();
        }
        foreach ($categorias as $cat) {
            $aux[$cat['idcuenta']]['importe'] += $cat['valor']/**$tasa*/
            ;
            $aux[$cat['idcuenta']]['idcuenta'] = $cat['idcuenta'];
        }
        $elementos = $this->getElementos($idDocumento);
        $movimientos = $this->getMovimientos($idDocumento);
        $q = Doctrine_Query::create()
            ->select("dec.idmovimiento,dec.idelementofactura,dec.idcategoriaelemento, dec.concepto as concepto,"
                . "dec.valor as valor, nc.idcuentaalt as idcuenta")
            ->from('DatElementocategoria dec')
            ->innerjoin('dec.DatCuentadesgloceprecio dcdp')
            ->innerjoin('dcdp.NomClasificacioncontablelog nc')
            ->where(
                "dec.idmoneda = ? and dec.concepto = '{$signo}'", array($this->dualidad->idmonedaalternativa)
            );
        if ($elementos) {
            $q->andWhereIn('dec.idelementofactura', $elementos);
        }
        if ($movimientos) {
            $q->andWhereIn('dec.idmovimiento', $movimientos);
        }
        $categoriasElementos = $q->fetchArray();
        //mesclar con categorias y probar
        foreach ($categoriasElementos as $cat) {
            if ($cat['idelementofactura']) {
                $elemento = Doctrine::getTable('DatElementosFactura')->find($cat['idelementofactura']);
                $cant = $elemento->cantidad;
            } else {
                $elemento = Doctrine::getTable('DatMovimientos')->find($cat['idmovimiento']);
                $cant = $elemento->cantidad;
            }
            $aux[$cat['idcuenta']]['importe'] += round($cat['valor'] * $cant, 2);
            $aux[$cat['idcuenta']]['idcuenta'] = $cat['idcuenta'];
        }
        foreach ($aux as $idcuenta => $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $objPase->idmoneda = $moneda->idmoneda;
            $objPase->moneda = $moneda->codigoiso;
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function pasesFactoresPrecioAmbasMonedas($idDocumento, $pase, $signo)
    {
        $pases = array();
        $aux = array();
        $pasesMN = $this->pasesFactoresPrecio($idDocumento, $pase, $signo);
        $pasesAlt = $this->pasesFactoresPrecioAlternativo($idDocumento, $pase, $signo);
        $pases = array_merge($pasesMN, $pasesAlt);
        return $pases;
    }

    public function importeTotalSinMateriales($idDocumento)
    {
        new DatProdFactura();
        new DatCategoriaPrecioFactura();

        $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
        $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;
        $importe = $this->doctrineHelper->query(
            "SELECT SUM(COALESCE(dpf.importe,
                abs(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
              THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) -
            ROUND(COALESCE (dpf.importefactmn,0),2))
              )) as importe FROM DatMovimientos m
			INNER JOIN m.DatMovmoneda dmm
			INNER JOIN m.DatProdFactura dpf
			WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$this->dualidad->idmoneda}"
        )->getFirst()->toArray();
        $importe2 = $this->doctrineHelper->query(
            "SELECT sum(COALESCE(dde.importe, 
                        abs(ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
                        THEN def.cantidadfactura - def.cantidad 
                        ELSE def.cantidad END),2) - 
                        ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2))
                        )) as importe
                        FROM DatElementosFactura def
                        INNER JOIN def.DatDesgloselemento dde
                        WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$this->dualidad->idmoneda} 
                        AND (SELECT COUNT(dpserv.idprodservicio) FROM DatProdServicios dpserv WHERE dpserv.idelementofactura = def.idelementofactura) = 0"
        )->getFirst()->toArray();
        $conceptos = $this->doctrineHelper->query(
            "SELECT ddcp.concepto,ddcp.porciento,round(abs((ddcp.valorcalculo*{$tasa}) - COALESCE(ddcp.valorcalculofact*{$tasa},0)),2) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} and ddcp.idmoneda = {$this->dualidad->idmoneda}"
        )->toArray();
        $importe['importe'] = $importe['importe'] * $tasa;
        $importe2['importe'] = $importe2['importe'] * $tasa;
        $importeParcial = $importe['importe'] + $importe2['importe'];
        $conceptosSuma = 0;
        $conceptosResta = 0;
        foreach ($conceptos as $concp) {
            if ($concp['concepto'] == '+') {
                $conceptosSuma += $concp['valorcalculo'];
            } else {
                $conceptosResta += $concp['valorcalculo'];
            }
        }
        return $importeParcial + $conceptosSuma - $conceptosResta + $this->getMargenProdSinPrecio($idDocumento);
    }

    public function importeTotalDocumento($idDocumento)
    {
        new DatProdFactura();
        new DatCategoriaPrecioFactura();
        $conn = Doctrine_Manager:: connection();
        $objIddocVenta = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compventaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $objIddocDev = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compdevLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $doc = Doctrine::getTable('DatDocumento')->find($idDocumento);
        if (($objIddocVenta->iddoc && $doc->iddoc == $objIddocVenta->iddoc) || ($objIddocDev->iddoc && $doc->iddoc == $objIddocDev->iddoc)) {
            $importe = $this->doctrineHelper->query(
                "SELECT SUM(ROUND(dmm.precio * m.cantidad,2)) as importe FROM DatMovimientos m
                  INNER JOIN m.DatMovmoneda dmm
                   WHERE m.iddocumento = {$idDocumento} "
            )->getFirst()->toArray();
            $importeServ = $this->doctrineHelper->query(
                "SELECT SUM(ROUND(dvs.precio * dvs.cantidad,2)) as importe FROM DatVentaservicio dvs
                   WHERE dvs.idventas = {$idDocumento} "
            )->getFirst()->toArray();
            $sqlMoneda = "Select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                  on dm.idmovimiento = mm.idmovimiento
                  where dm.iddocumento = {$idDocumento} limit 1";
            $arrayMoneda = $conn->execute($sqlMoneda)
                ->fetchAll(PDO::FETCH_ASSOC);
            if (!count($arrayMoneda)) {
                $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
                        where mm.idventas = {$idDocumento} limit 1";
                $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
            }
            $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
            $arrayTasa = $conn->execute($sqlTasa)
                ->fetchAll(PDO::FETCH_ASSOC);
            $idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;
            if ($idmonedacontable != $arrayMoneda[0]['idmoneda']) {
                $tasa = $this->configuracionHelper->getTasaByMonedas(
                    $idmonedacontable, $arrayMoneda[0]['idmoneda'], $arrayTasa[0]['idtipotasa']
                );
                if (count($tasa)) {
                    $importe['importe'] *= $tasa[0]['factordeconversion'];
                    $importeServ['importe'] *= $tasa[0]['factordeconversion'];
                }
            }
            return $importe['importe'] + $importeServ['importe'];

        } else {
            $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
            $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;
            $importe = $this->doctrineHelper->query(
                "SELECT SUM(COALESCE(dpf.importe,
                abs(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
              THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) -
            ROUND(COALESCE (dpf.importefactmn,0),2))
              )) as importe FROM DatMovimientos m
			INNER JOIN m.DatMovmoneda dmm
			INNER JOIN m.DatProdFactura dpf
			WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$this->dualidad->idmoneda}"
            )->getFirst()->toArray();
            $importe2 = $this->doctrineHelper->query(
                "SELECT sum(COALESCE(dde.importe, 
                        abs(ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
                        THEN def.cantidadfactura - def.cantidad 
                        ELSE def.cantidad END),2) - 
                        ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2))
                        )) as importe
                        FROM DatElementosFactura def
                        INNER JOIN def.DatDesgloselemento dde
                        WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$this->dualidad->idmoneda}"
            )->getFirst()->toArray();
            $conceptos = $this->doctrineHelper->query(
                "SELECT ddcp.concepto,ddcp.porciento,round(abs((ddcp.valorcalculo) - COALESCE(ddcp.valorcalculofact,0)),2) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} and ddcp.idmoneda = {$this->dualidad->idmoneda}"
            )->toArray();
            $importe['importe'] = $importe['importe'] * $tasa;
            $importe2['importe'] = $importe2['importe'] * $tasa;
            $importeParcial = $importe['importe'] + $importe2['importe'];
            $conceptosSuma = 0;
            $conceptosResta = 0;
            foreach ($conceptos as $concp) {
                if ($concp['concepto'] == '+') {
                    $conceptosSuma += $concp['valorcalculo'];
                } else if ($concp['concepto'] == '-') {
                    $conceptosResta += $concp['valorcalculo'];
                }
            }
            $conceptosSuma = $conceptosSuma * $tasa;
            $conceptosResta = $conceptosResta * $tasa;
            $importeMedia = $this->importeMediaProductos($idDocumento);
            return $importeParcial + $conceptosSuma - $conceptosResta + $this->getMargenProdSinPrecio($idDocumento) - $importeMedia;
        }
    }

    public function importeFinalDocumento($idDocumento)
    {
        new DatProdFactura();
        new DatCategoriaPrecioFactura();
        $conn = Doctrine_Manager:: connection();
        $objIddocVenta = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compventaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $objIddocDev = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compdevLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $doc = Doctrine::getTable('DatDocumento')->find($idDocumento);
        if (($objIddocVenta->iddoc && $doc->iddoc == $objIddocVenta->iddoc) || ($objIddocDev->iddoc && $doc->iddoc == $objIddocDev->iddoc)) {
            $importe = $this->doctrineHelper->query(
                "SELECT SUM(ROUND(dmm.precio * m.cantidad,2)) as importe FROM DatMovimientos m
                  INNER JOIN m.DatMovmoneda dmm
                   WHERE m.iddocumento = {$idDocumento} "
            )->getFirst()->toArray();
            $importeServ = $this->doctrineHelper->query(
                "SELECT SUM(ROUND(dvs.precio * dvs.cantidad,2)) as importe FROM DatVentaservicio dvs
                   WHERE dvs.idventas = {$idDocumento} "
            )->getFirst()->toArray();
            $sqlMoneda = "Select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                  on dm.idmovimiento = mm.idmovimiento
                  where dm.iddocumento = {$idDocumento} limit 1";
            $arrayMoneda = $conn->execute($sqlMoneda)
                ->fetchAll(PDO::FETCH_ASSOC);
            if (!count($arrayMoneda)) {
                $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
                        where mm.idventas = {$idDocumento} limit 1";
                $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
            }
            $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
            $arrayTasa = $conn->execute($sqlTasa)
                ->fetchAll(PDO::FETCH_ASSOC);
            $idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;

            $auxVenta = Doctrine::getTable('DatVenta')->find($idDocumento);

            $recdesc = 0;
            $importeTotal = $importe['importe'] + $importeServ['importe'];
            if ($objIddocDev->iddoc && $doc->iddoc == $objIddocDev->iddoc) {
                $venta = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                    "select dev.idventas from mod_logpuntoventa.dat_devolucion dev where dev.iddevolucion = {$idDocumento}"
                )->fetchAll(PDO::FETCH_COLUMN);
                if (count($venta)) {
                    $iddocComision = $venta[0];
                    $auxVentaTC = Doctrine::getTable('DatVenta')->find($iddocComision);

                    if ($auxVentaTC->valorconcepto > 0) {
                        $recdesc = $importeTotal * $auxVentaTC->valorconcepto / 100;
                        if ($auxVentaTC->conceptoventa == '-') {
                            $recdesc *= -1;
                        }
                    }
                }
            } else {
                if ($auxVenta->calculoconcepto > 0) {
                    $recdesc = $auxVenta->calculoconcepto;
                    if ($auxVenta->conceptoventa == '-') {
                        $recdesc *= -1;
                    }
                }
            }
            $importeTotal += $recdesc;
            if ($idmonedacontable != $arrayMoneda[0]['idmoneda']) {
                $tasa = $this->configuracionHelper->getTasaByMonedas(
                    $idmonedacontable, $arrayMoneda[0]['idmoneda'], $arrayTasa[0]['idtipotasa']
                );
                if (count($tasa)) {
                    $importeTotal *= $tasa[0]['factordeconversion'];
                }
            }
            return $importeTotal;

        } else {
            $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
            $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;
            $importe = $this->doctrineHelper->query(
                "SELECT SUM(COALESCE(dpf.importe,
                abs(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
              THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) -
            ROUND(COALESCE (dpf.importefactmn,0),2))
              )) as importe FROM DatMovimientos m
			INNER JOIN m.DatMovmoneda dmm
			INNER JOIN m.DatProdFactura dpf
			WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$this->dualidad->idmoneda}"
            )->getFirst()->toArray();
            $importe2 = $this->doctrineHelper->query(
                "SELECT sum(COALESCE(dde.importe, 
                        abs(ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
                        THEN def.cantidadfactura - def.cantidad 
                        ELSE def.cantidad END),2) - 
                        ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2))
                        )) as importe
                        FROM DatElementosFactura def
                        INNER JOIN def.DatDesgloselemento dde
                        WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$this->dualidad->idmoneda}"
            )->getFirst()->toArray();
            $conceptos = $this->doctrineHelper->query(
                "SELECT ddcp.concepto,ddcp.porciento,round(abs((ddcp.valorcalculo*{$tasa}) - COALESCE(ddcp.valorcalculofact*{$tasa},0)),2) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} and ddcp.idmoneda = {$this->dualidad->idmoneda}"
            )->toArray();
            $importe['importe'] = $importe['importe'];
            $importe2['importe'] = $importe2['importe'];
            $importeParcial = $importe['importe'] + $importe2['importe'];

            $recdesc = 0;
            if ($fac->calculoconcepto > 0) {
                $recdesc = $fac->calculoconcepto;
                if ($fac->conceptoventa == '-') {
                    $recdesc *= -1;
                }
            }

            $importeParcial += $recdesc;

            $conceptosSuma = 0;
            $conceptosResta = 0;
            foreach ($conceptos as $concp) {
                if ($concp['concepto'] == '+') {
                    $conceptosSuma += $concp['valorcalculo'];
                } else {
                    $conceptosResta += $concp['valorcalculo'];
                }
            }
            $importeParcial *= $tasa;
            return $importeParcial + $conceptosSuma - $conceptosResta + $this->getMargenProdSinPrecio($idDocumento);
        }
    }


    public function importeRecargoDescuento($idDocumento, $concepto = 'N')
    {
        new DatProdFactura();
        new DatCategoriaPrecioFactura();
        $conn = Doctrine_Manager:: connection();
        $objIddocVenta = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compventaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $objIddocDev = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compdevLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $doc = Doctrine::getTable('DatDocumento')->find($idDocumento);
        if (($objIddocVenta->iddoc && $doc->iddoc == $objIddocVenta->iddoc) || ($objIddocDev->iddoc && $doc->iddoc == $objIddocDev->iddoc)) {

            $sqlMoneda = "Select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                  on dm.idmovimiento = mm.idmovimiento
                  where dm.iddocumento = {$idDocumento} limit 1";
            $arrayMoneda = $conn->execute($sqlMoneda)
                ->fetchAll(PDO::FETCH_ASSOC);
            if (!count($arrayMoneda)) {
                $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
                        where mm.idventas = {$idDocumento} limit 1";
                $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
            }
            $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
            $arrayTasa = $conn->execute($sqlTasa)
                ->fetchAll(PDO::FETCH_ASSOC);
            $idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;

            $auxVenta = Doctrine::getTable('DatVenta')->find($idDocumento);

            $recdesc = 0;

            if ($objIddocDev->iddoc && $doc->iddoc == $objIddocDev->iddoc) {
                $importe = $this->doctrineHelper->query(
                    "SELECT SUM(ROUND(dmm.precio * m.cantidad,2)) as importe FROM DatMovimientos m
                  INNER JOIN m.DatMovmoneda dmm
                   WHERE m.iddocumento = {$idDocumento} "
                )->getFirst()->toArray();
                $importeServ = $this->doctrineHelper->query(
                    "SELECT SUM(ROUND(dvs.precio * dvs.cantidad,2)) as importe FROM DatVentaservicio dvs
                   WHERE dvs.idventas = {$idDocumento} "
                )->getFirst()->toArray();
                $importeTotalDev = $importe['importe'] + $importeServ['importe'];
                $venta = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                    "select dev.idventas from mod_logpuntoventa.dat_devolucion dev where dev.iddevolucion = {$idDocumento}"
                )->fetchAll(PDO::FETCH_COLUMN);
                if (count($venta)) {
                    $iddocComision = $venta[0];
                    $auxVentaTC = Doctrine::getTable('DatVenta')->find($iddocComision);

                    if ($auxVentaTC->valorconcepto > 0) {
                        $recdesc = $importeTotalDev * $auxVentaTC->valorconcepto / 100;
                    }
                }
            } else {
                if ($auxVenta->calculoconcepto > 0) {
                    if ($auxVenta->conceptoventa == $concepto) {
                        $recdesc = $auxVenta->calculoconcepto;
                    }
                }
            }

            $importeTotal = $recdesc;

            if ($idmonedacontable != $arrayMoneda[0]['idmoneda']) {
                $tasa = $this->configuracionHelper->getTasaByMonedas(
                    $idmonedacontable, $arrayMoneda[0]['idmoneda'], $arrayTasa[0]['idtipotasa']
                );
                if (count($tasa)) {
                    $importeTotal *= $tasa[0]['factordeconversion'];
                }
            }
            return $importeTotal;

        } else {
            $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
            $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;

            $recdesc = 0;
            if ($fac->calculoconcepto > 0) {
                if ($fac->conceptoventa == $concepto) {
                    $recdesc = $fac->calculoconcepto;
                }
            }
            $importeParcial = $recdesc;


            $importeParcial *= $tasa;
            return $importeParcial;
        }
    }

    public function importeTotalDocumentoSinComision($idDocumento)
    {
        new DatProdFactura();
        new DatCategoriaPrecioFactura();
        $conn = Doctrine_Manager:: connection();
        $objIddocVenta = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compventaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $objIddocDev = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compdevLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $doc = Doctrine::getTable('DatDocumento')->find($idDocumento);
        if (($objIddocVenta->iddoc && $doc->iddoc == $objIddocVenta->iddoc) || ($objIddocDev->iddoc && $doc->iddoc == $objIddocDev->iddoc)) {
            $importe = $this->doctrineHelper->query(
                "SELECT SUM(ROUND(dmm.precio * m.cantidad,2)) as importe FROM DatMovimientos m
                  INNER JOIN m.DatMovmoneda dmm
                   WHERE m.iddocumento = {$idDocumento} "
            )->getFirst()->toArray();
            $importeServ = $this->doctrineHelper->query(
                "SELECT SUM(ROUND(dvs.precio * dvs.cantidad,2)) as importe FROM DatVentaservicio dvs
                   WHERE dvs.idventas = {$idDocumento} "
            )->getFirst()->toArray();
            $sqlMoneda = "Select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                  on dm.idmovimiento = mm.idmovimiento
                  where dm.iddocumento = {$idDocumento} limit 1";
            $arrayMoneda = $conn->execute($sqlMoneda)
                ->fetchAll(PDO::FETCH_ASSOC);
            if (!count($arrayMoneda)) {
                $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
                        where mm.idventas = {$idDocumento} limit 1";
                $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
            }
            $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
            $arrayTasa = $conn->execute($sqlTasa)
                ->fetchAll(PDO::FETCH_ASSOC);
            $idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;

            $auxVenta = Doctrine::getTable('DatVenta')->find($idDocumento);

            $recdesc = 0;
            if ($auxVenta->calculoconcepto > 0) {
                $recdesc = $auxVenta->calculoconcepto;
                if ($auxVenta->conceptoventa == '-') {
                    $recdesc *= -1;
                }
            }
            $importeTotal = $importe['importe'] + $importeServ['importe'];

            if ($idmonedacontable != $arrayMoneda[0]['idmoneda']) {
                $tasa = $this->configuracionHelper->getTasaByMonedas(
                    $idmonedacontable, $arrayMoneda[0]['idmoneda'], $arrayTasa[0]['idtipotasa']
                );
                if (count($tasa)) {
                    $importeTotal *= $tasa[0]['factordeconversion'];
                    $recdesc *= $tasa[0]['factordeconversion'];
                }
            }
            $iddocComision = $idDocumento;
            if ($objIddocDev->iddoc && $doc->iddoc == $objIddocDev->iddoc) {
                $venta = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                    "select dev.idventas from mod_logpuntoventa.dat_devolucion dev where dev.iddevolucion = {$idDocumento}"
                )->fetchAll(PDO::FETCH_COLUMN);
                if (count($venta)) {
                    $iddocComision = $venta[0];
                    $auxVentaTC = Doctrine::getTable('DatVenta')->find($iddocComision);

                    if ($auxVentaTC->valorconcepto > 0) {
                        $recdesc = $importeTotal * $auxVentaTC->valorconcepto / 100;
                        if ($auxVentaTC->conceptoventa == '-') {
                            $recdesc *= -1;
                        }
                    }
                }
            }
            $sqlCom = "select pt.comision from mod_logpuntoventa.dat_pedidotienda pt
                        inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda
                        inner join mod_logpuntoventa.dat_ventas dv on dv.idventas = pd.iddocumento and pd.tipo = 4
                        where dv.idventas = {$iddocComision}";
            $comAux = $conn->execute($sqlCom)->fetchAll(PDO::FETCH_ASSOC);
            if (count($comAux) && is_numeric($comAux[0]['comision'])) {
                $importeTotal = $importeTotal - ($importeTotal * $comAux[0]['comision'] / 100);
            }
            return $importeTotal + $recdesc;

        } else {
            $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
            $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;
            $importe = $this->doctrineHelper->query(
                "SELECT SUM(COALESCE(dpf.importe,
                abs(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
              THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) -
            ROUND(COALESCE (dpf.importefactmn,0),2))
              )) as importe FROM DatMovimientos m
			INNER JOIN m.DatMovmoneda dmm
			INNER JOIN m.DatProdFactura dpf
			WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$this->dualidad->idmoneda}"
            )->getFirst()->toArray();
            $importe2 = $this->doctrineHelper->query(
                "SELECT sum(COALESCE(dde.importe, 
                        abs(ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
                        THEN def.cantidadfactura - def.cantidad 
                        ELSE def.cantidad END),2) - 
                        ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2))
                        )) as importe
                        FROM DatElementosFactura def
                        INNER JOIN def.DatDesgloselemento dde
                        WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$this->dualidad->idmoneda}"
            )->getFirst()->toArray();
            $conceptos = $this->doctrineHelper->query(
                "SELECT ddcp.concepto,ddcp.porciento,round(abs((ddcp.valorcalculo*{$tasa}) - COALESCE(ddcp.valorcalculofact*{$tasa},0)),2) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} and ddcp.idmoneda = {$this->dualidad->idmoneda}"
            )->toArray();
            $importe['importe'] = $importe['importe'];
            $importe2['importe'] = $importe2['importe'];
            $importeParcial = $importe['importe'] + $importe2['importe'];

            $recdesc = 0;
            if ($fac->calculoconcepto > 0) {
                $recdesc = $fac->calculoconcepto;
                if ($fac->conceptoventa == '-') {
                    $recdesc *= -1;
                }
            }

            $importeParcial += $recdesc;

            $conceptosSuma = 0;
            $conceptosResta = 0;
            foreach ($conceptos as $concp) {
                if ($concp['concepto'] == '+') {
                    $conceptosSuma += $concp['valorcalculo'];
                } else {
                    $conceptosResta += $concp['valorcalculo'];
                }
            }
            $importeParcial *= $tasa;
            return $importeParcial + $conceptosSuma - $conceptosResta + $this->getMargenProdSinPrecio($idDocumento);
        }
    }

    public function getComisionTV($idDocumento)
    {
        $conn = Doctrine_Manager:: connection();
        $objIddocVenta = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compventaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $objIddocDev = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compdevLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $doc = Doctrine::getTable('DatDocumento')->find($idDocumento);
        if (($objIddocVenta->iddoc && $doc->iddoc == $objIddocVenta->iddoc) || ($objIddocDev->iddoc && $doc->iddoc == $objIddocDev->iddoc)) {
            $importe = $this->doctrineHelper->query(
                "SELECT SUM(ROUND(dmm.precio * m.cantidad,2)) as importe FROM DatMovimientos m
                  INNER JOIN m.DatMovmoneda dmm
                   WHERE m.iddocumento = {$idDocumento} "
            )->getFirst()->toArray();
            $sqlMoneda = "Select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                  on dm.idmovimiento = mm.idmovimiento
                  where dm.iddocumento = {$idDocumento} limit 1";
            $arrayMoneda = $conn->execute($sqlMoneda)
                ->fetchAll(PDO::FETCH_ASSOC);
            $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
            $arrayTasa = $conn->execute($sqlTasa)
                ->fetchAll(PDO::FETCH_ASSOC);
            $idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;
            if ($idmonedacontable != $arrayMoneda[0]['idmoneda']) {
                $tasa = $this->configuracionHelper->getTasaByMonedas(
                    $idmonedacontable, $arrayMoneda[0]['idmoneda'], $arrayTasa[0]['idtipotasa']
                );
                if (count($tasa)) {
                    $importe['importe'] *= $tasa[0]['factordeconversion'];
                }
            }
            $iddocComision = $idDocumento;
            if ($objIddocDev->iddoc && $doc->iddoc == $objIddocDev->iddoc) {
                $venta = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                    "select dev.idventas from mod_logpuntoventa.dat_devolucion dev where dev.iddevolucion = {$idDocumento}"
                )->fetchAll(PDO::FETCH_COLUMN);
                if (count($venta))
                    $iddocComision = $venta[0];
            }
            $sqlCom = "select pt.comision from mod_logpuntoventa.dat_pedidotienda pt
                        inner join mod_logpuntoventa.dat_pedidodocumento pd on pd.idpedido = pt.idpedidotienda
                        inner join mod_logpuntoventa.dat_ventas dv on dv.idventas = pd.iddocumento and pd.tipo = 4
                        where dv.idventas = {$iddocComision}";
            $comAux = $conn->execute($sqlCom)->fetchAll(PDO::FETCH_ASSOC);
            if (count($comAux) && is_numeric($comAux[0]['comision'])) {
                $importe['importe'] = $importe['importe'] * $comAux[0]['comision'] / 100;
            } else {
                $importe['importe'] = 0;
            }
            return $importe['importe'];
        }
        return 0;
    }

    public function importeTotalDocumentoInventario($idDocumento)
    {
        new DatProdFactura();
        new DatCategoriaPrecioFactura();

        $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
        $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;
        $importe = $this->doctrineHelper->query(
            "SELECT SUM(COALESCE(dpf.importe,
                abs(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
              THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) -
            ROUND(COALESCE (dpf.importefactmn,0),2))
              )) as importe FROM DatMovimientos m
			INNER JOIN m.DatMovmoneda dmm
			INNER JOIN m.DatProdFactura dpf
			WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$this->dualidad->idmoneda}"
        )->getFirst()->toArray();

        return $importe['importe'] * $tasa;
    }


    public function importeTotalDocumentoSinInre($idDocumento, $idmoneda)
    {
        new DatProdFactura();
        new DatCategoriaPrecioFactura();

        $importe = $this->doctrineHelper->query(
            "SELECT abs(SUM(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END)) - SUM(COALESCE (dpf.importefactmn,0))) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                INNER JOIN m.DatProdFactura dpf
                 WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$idmoneda}"
        )->getFirst()->toArray();
        $importe2 = $this->doctrineHelper->query(
            "SELECT abs(SUM(dde.preciotarifa * def.cantidad) - SUM(COALESCE(dde.preciotarifafactura,0) * def.cantidad)) as importe FROM DatElementosFactura def
                INNER JOIN def.DatDesgloselemento dde
                WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$idmoneda}"
        )->getFirst()->toArray();
        $conceptos = $this->doctrineHelper->query(
            "SELECT ddcp.concepto,ddcp.porciento,abs(ddcp.valorcalculo - COALESCE(ddcp.valorcalculofact,0)) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                INNER JOIN dcpf.NomCategoriaprecio ncp
                WHERE dcpf.idfactura = {$idDocumento} and ddcp.idmoneda = {$idmoneda} and ncp.codigo <> 'inre'"
        )->toArray();
        $importeParcial = $importe['importe'] + $importe2['importe'];
        $conceptosSuma = 0;
        $conceptosResta = 0;
        foreach ($conceptos as $concp) {
            if ($concp['concepto'] == '+') {
                $conceptosSuma += $concp['valorcalculo'];
            } else {
                $conceptosResta += $concp['valorcalculo'];
            }
        }
        return $importeParcial + $conceptosSuma - $conceptosResta;
    }

    public function importeConceptoCodigo($idDocumento, $idmoneda, $codigo = null, $signo = false)
    {
        new DatCategoriaPrecioFactura();
        $addCodigo = is_null($codigo) ? " " : ((is_array($codigo)) ? " and ncp.codigo in (" . implode(',', $codigo) . ") " : " and ncp.codigo = '{$codigo}' ");
        $conceptos = $this->doctrineHelper->query(
            "SELECT ddcp.concepto,ddcp.porciento,abs(round(ddcp.valorcalculo,2) - round(COALESCE(ddcp.valorcalculofact,0),2)) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                INNER JOIN dcpf.NomCategoriaprecio ncp
                WHERE dcpf.idfactura = {$idDocumento} and ddcp.idmoneda = {$idmoneda} {$addCodigo}"
        )->toArray();
        $conceptosSuma = 0;
        $conceptosResta = 0;
        foreach ($conceptos as $concp) {
            if ($concp['concepto'] == '+') {
                $conceptosSuma += $concp['valorcalculo'];
            } else {
                $conceptosResta += $concp['valorcalculo'];
            }
        }
        return (!$signo) ? ($conceptosSuma - $conceptosResta) : (($signo == '+') ? $conceptosSuma : $conceptosResta);
    }

    public function importeTotalDocumentoAlternativo($idDocumento)
    {

        new DatProdFactura();
        new DatCategoriaPrecioFactura();
        $objIddocVenta = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compventaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $objIddocDev = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            'compdevLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $doc = Doctrine::getTable('DatDocumento')->find($idDocumento);
        if (($objIddocVenta->iddoc && $doc->iddoc == $objIddocVenta->iddoc) || ($objIddocDev->iddoc && $doc->iddoc == $objIddocDev->iddoc)) {
            $importe = $this->doctrineHelper->query(
                "SELECT SUM(ROUND(dmm.precio * m.cantidad,2)) as importe FROM DatMovimientos m
                  INNER JOIN m.DatMovmoneda dmm
                   WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda <> {$this->dualidad->idmoneda}"
            )->getFirst()->toArray();
            return $importe['importe'];

        } else {
            if ($this->dualidad->idmonedaalternativa) {
                $importe = $this->doctrineHelper->query(
                    "SELECT abs(SUM(
  							round(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2)
  						) - round(SUM(COALESCE (dpf.importefactalt,0)),2)) as importe FROM DatMovimientos m
                  INNER JOIN m.DatMovmoneda dmm
                  INNER JOIN m.DatProdFactura dpf
                   WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$this->dualidad->idmonedaalternativa}"
                )->getFirst()->toArray();
                $importe2 = $this->doctrineHelper->query(
                    "SELECT abs(SUM( round(dde.preciotarifa * def.cantidad,2)) - SUM(round(COALESCE(dde.preciotarifafactura,0) * def.cantidad,2))) as importe FROM DatElementosFactura def
                  INNER JOIN def.DatDesgloselemento dde
                  WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$this->dualidad->idmonedaalternativa}"
                )->getFirst()->toArray();
                $conceptos = $this->doctrineHelper->query(
                    "SELECT ddcp.concepto,ddcp.porciento,round(abs(ddcp.valorcalculo - COALESCE(ddcp.valorcalculofact,0)),2) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} and ddcp.idmoneda = {$this->dualidad->idmonedaalternativa}"
                )->toArray();
                $importeParcial = $importe['importe'] + $importe2['importe'];
                $conceptosSuma = 0;
                $conceptosResta = 0;
                foreach ($conceptos as $concp) {
                    if ($concp['concepto'] == '+') {
                        $conceptosSuma += $concp['valorcalculo'];
                    } else {
                        $conceptosResta += $concp['valorcalculo'];
                    }
                }
                return $importeParcial + $conceptosSuma - $conceptosResta + $this->getMargenProdSinPrecio($idDocumento, true);
            }
        }
    }

    public function importeParcial($idDocumento)
    {
        $margComMovSum = $margComMovRes = $margComElmSum = $margComElmRes = array('valor' => 0);
        $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
        $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;
        $importe = $this->doctrineHelper->query(
            "SELECT SUM(ROUND(dmm.precio * m.cantidad,2)) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                 WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$this->dualidad->idmoneda}"
        )->getFirst()->toArray();
        $importe2 = $this->doctrineHelper->query(
            "SELECT SUM(ROUND(dde.preciotarifa * def.cantidad,2)) as importe FROM DatElementosFactura def
                INNER JOIN def.DatDesgloselemento dde
                WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$this->dualidad->idmoneda}"
        )->getFirst()->toArray();
        $margComElmSum = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(def.cantidad * dect.valor),0) AS valor 
                        FROM DatElementocategoria dect 
                        INNER JOIN dect.DatCuentadesgloceprecio dcdp  
                        INNER JOIN dcdp.NomClasificacioncontablelog nc 
                        INNER JOIN dect.DatElementosFactura def 
                        WHERE dect.idmoneda = {$this->dualidad->idmoneda} AND dect.idelementofactura IN (SELECT def1.idelementofactura FROM DatElementosFactura def1
                        WHERE def1.idfactura = {$idDocumento}) AND dect.concepto = '+'"
        )->getFirst()->toArray();
        $margComElmRes = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(def.cantidad * dect.valor),0) AS valor 
                        FROM DatElementocategoria dect 
                        INNER JOIN dect.DatCuentadesgloceprecio dcdp  
                        INNER JOIN dcdp.NomClasificacioncontablelog nc 
                        INNER JOIN dect.DatElementosFactura def 
                        WHERE dect.idmoneda = {$this->dualidad->idmoneda} AND dect.idelementofactura IN (SELECT def1.idelementofactura FROM DatElementosFactura def1
                        WHERE def1.idfactura = {$idDocumento}) AND dect.concepto = '-'"
        )->getFirst()->toArray();
        $margComMovSum = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(dm.cantidad * dect.valor),0) AS valor 
                        FROM DatElementocategoria dect 
                        INNER JOIN dect.DatCuentadesgloceprecio dcdp  
                        INNER JOIN dcdp.NomClasificacioncontablelog nc 
                        INNER JOIN dect.DatMovimientos dm 
                        WHERE dect.idmoneda = {$this->dualidad->idmoneda} AND dect.idmovimiento IN (SELECT dm1.idmovimiento FROM DatMovimientos dm1
                        WHERE dm1.iddocumento = {$idDocumento}) AND dect.concepto = '+'"
        )->getFirst()->toArray();
        $margComMovRes = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(dm.cantidad * dect.valor),0) AS valor 
                        FROM DatElementocategoria dect 
                        INNER JOIN dect.DatCuentadesgloceprecio dcdp  
                        INNER JOIN dcdp.NomClasificacioncontablelog nc 
                        INNER JOIN dect.DatMovimientos dm 
                        WHERE dect.idmoneda = {$this->dualidad->idmoneda} AND dect.idmovimiento IN (SELECT dm1.idmovimiento FROM DatMovimientos dm1
                        WHERE dm1.iddocumento = {$idDocumento}) AND dect.concepto = '-'"
        )->getFirst()->toArray();

        $importeConceptos = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(ddcp.valorcalculo),0) AS importe FROM DatCategoriaPrecioFactura dcpf 
            INNER JOIN dcpf.DatDesglosecategoriapreciofactura ddcp
            INNER JOIN dcpf.NomCategoriaprecio cp
            WHERE dcpf.idfactura = {$idDocumento} AND dcpf.idcuenta IS NULL 
            AND cp.codigo IS NULL AND ddcp.idmoneda = {$this->dualidad->idmoneda} AND cp.concepto = '+'"
        )->getFirst()->toArray();

        $importeTotal = $importe['importe'] + $importe2['importe']/* + $importeConceptos['importe']*/
        ;
        $return = $importeTotal - $margComMovSum['valor'] - $margComElmSum['valor'] + $margComMovRes['valor'] + $margComElmRes['valor'];
        return $return * $tasa;
    }

    public function importeParcialAlternativo($idDocumento)
    {
        $margComMovSum = $margComMovRes = $margComElmSum = $margComElmRes = array('valor' => 0);
        $importe = $this->doctrineHelper->query(
            "SELECT SUM(dmm.precio * m.cantidad) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                 WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$this->dualidad->idmonedaalternativa}"
        )->getFirst()->toArray();
        $importe2 = $this->doctrineHelper->query(
            "SELECT SUM(dde.preciotarifa * def.cantidad) as importe FROM DatElementosFactura def
                INNER JOIN def.DatDesgloselemento dde
                WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$this->dualidad->idmonedaalternativa}"
        )->getFirst()->toArray();
        $margComElmSum = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(def.cantidad * dect.valor),0) AS valor 
                        FROM DatElementocategoria dect 
                        INNER JOIN dect.DatCuentadesgloceprecio dcdp  
                        INNER JOIN dcdp.NomClasificacioncontablelog nc 
                        INNER JOIN dect.DatElementosFactura def 
                        WHERE dect.idmoneda = {$this->dualidad->idmonedaalternativa} AND dect.idelementofactura IN (SELECT def1.idelementofactura FROM DatElementosFactura def1
                        WHERE def1.idfactura = {$idDocumento}) AND dect.concepto = '+'"
        )->getFirst()->toArray();
        $margComElmRes = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(def.cantidad * dect.valor),0) AS valor 
                        FROM DatElementocategoria dect 
                        INNER JOIN dect.DatCuentadesgloceprecio dcdp  
                        INNER JOIN dcdp.NomClasificacioncontablelog nc 
                        INNER JOIN dect.DatElementosFactura def 
                        WHERE dect.idmoneda = {$this->dualidad->idmonedaalternativa} AND dect.idelementofactura IN (SELECT def1.idelementofactura FROM DatElementosFactura def1
                        WHERE def1.idfactura = {$idDocumento}) AND dect.concepto = '-'"
        )->getFirst()->toArray();
        $margComMovSum = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(dm.cantidad * dect.valor),0) AS valor 
                        FROM DatElementocategoria dect 
                        INNER JOIN dect.DatCuentadesgloceprecio dcdp  
                        INNER JOIN dcdp.NomClasificacioncontablelog nc 
                        INNER JOIN dect.DatMovimientos dm 
                        WHERE dect.idmoneda = {$this->dualidad->idmonedaalternativa} AND dect.idmovimiento IN (SELECT dm1.idmovimiento FROM DatMovimientos dm1
                        WHERE dm1.iddocumento = {$idDocumento}) AND dect.concepto = '+'"
        )->getFirst()->toArray();
        $margComMovRes = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(dm.cantidad * dect.valor),0) AS valor 
                        FROM DatElementocategoria dect 
                        INNER JOIN dect.DatCuentadesgloceprecio dcdp  
                        INNER JOIN dcdp.NomClasificacioncontablelog nc 
                        INNER JOIN dect.DatMovimientos dm 
                        WHERE dect.idmoneda = {$this->dualidad->idmonedaalternativa} AND dect.idmovimiento IN (SELECT dm1.idmovimiento FROM DatMovimientos dm1
                        WHERE dm1.iddocumento = {$idDocumento}) AND dect.concepto = '-'"
        )->getFirst()->toArray();

        $importeConceptos = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(ddcp.valorcalculo),0) AS importe FROM DatCategoriaPrecioFactura dcpf 
            INNER JOIN dcpf.DatDesglosecategoriapreciofactura ddcp
            INNER JOIN dcpf.NomCategoriaprecio cp
            WHERE dcpf.idfactura = {$idDocumento} AND dcpf.idcuenta IS NULL AND cp.codigo IS NULL 
            AND ddcp.idmoneda = {$this->dualidad->idmonedaalternativa} AND cp.concepto = '+'"
        )->getFirst()->toArray();

        $importeTotal = $importe['importe'] + $importe2['importe'] + $importeConceptos['importe'];
        $return = $importeTotal - $margComMovSum['valor'] - $margComElmSum['valor'] + $margComMovRes['valor'] + $margComElmRes['valor'];
        return $return;
    }

    public function importePrecioPromedio($idDocumento, $campo = 'preciocontable')
    {
        $dataQuery = Doctrine_Query::create()
            ->select("SUM(round(dm.{$campo} * dm.cantidad,2)) as importe")
            ->from('DatMovimientos dm')
            ->innerjoin('dm.DatProductoLogistica dp')
            ->where('dm.iddocumento = ? and dm.signo <> ?', array($idDocumento, 'N'))
            ->fetchArray();

        return $dataQuery[0]['importe'];
    }

    public function getIngresosNetosXMercancia($idDocumento)
    {
        return $this->importeTotalDocumentoInventario($idDocumento) - $this->importePrecioPromedio($idDocumento);
    }

    /*public function importeCostoMaterial($idDocumento, $campo = 'importecup') {
        $conn = Zend_Registry::get('conexion');
        $dataQuery = Doctrine_Query::create()
                ->select("ddf.idsubsistema")
                ->from('DatDocfactura ddf')
                ->where('ddf.idfactura = ? ', $idDocumento)
                ->fetchArray();
        if ($dataQuery[0]['idsubsistema'] == 113) {
            $docOrigen = $conn->execute(
                            "select ddp.idpadre from mod_logistica.dat_documentopadre ddp where ddp.iddocumento = {$idDocumento}"
                    )
                    ->fetchAll(PDO::FETCH_COLUMN);
            $importe = $conn->execute(
                            "select sum(dm.{$campo}) from mod_logtaller.dat_material dm where dm.idordentrabajo = {$docOrigen[0]}"
                    )
                    ->fetchAll(PDO::FETCH_COLUMN);
            return $importe[0];
        }
        return 0;
    }*/

    /*
     * Funcion para calcular costo de materiales y mano de obra de la ot
     * @param $prodmanoobra (0->productos y servicios, 1->productos, 2->servicios)
     * */

    public function importeCostoMaterial($idDocumento, $campo = 'importecontable', $prodmanoobra = 0)
    {
        $dataQuery = Doctrine_Query::create()
            ->select("ddf.idsubsistema")
            ->from('DatDocfactura ddf')
            ->where('ddf.idfactura = ? ', $idDocumento)
            ->fetchArray();
        if ($dataQuery[0]['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_TALLERES) {
            $signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
            $docOrigen = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                "select ddp.idpadre from mod_logistica.dat_documentopadre ddp where ddp.iddocumento = {$idDocumento}"
            )->fetchAll(PDO::FETCH_COLUMN);
            $sqlProducto = "select (sum(round(m.{$campo},2))-sum(COALESCE(dev.importecontable, 0))) from mod_logistica.dat_documentopadre ddp 				
				inner join mod_logistica.dat_movimiento m on m.iddocumento = ddp.iddocumento 
				inner join mod_logistica.dat_producto dp on dp.idproducto = m.idproducto				
				inner join mod_logistica.dat_documento dd on dd.iddocumento = m.iddocumento
                left join mod_logistica.dat_documentopadre ddp1 on ddp1.idpadre = ddp.iddocumento 
                left join mod_logistica.dat_documentopadre ddp2 on ddp2.idpadre = m.iddocumento
				left join mod_logistica.dat_movimiento dev on dev.iddocumento = ddp2.iddocumento and dev.idproducto = m.idproducto
				left join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento and ddev.estado = 4       
				where ddp.idpadre = {$docOrigen[0]} and dd.estado = 4 and m.signo='{$signo}' --and ddp1.iddocumento is null
				and dp.idindicador in (
                	select dps.idindicador from mod_logfacturacion.dat_elementosfactura def
					inner join mod_logfacturacion.dat_prodservnomenclador dps on dps.idelementofactura = def.idelementofactura
					where def.idfactura = {$idDocumento}";
            $sqlServicios = "select round(sum(dat.costo),2)
                    from mod_logtaller.dat_ordenactividad dat
                    join mod_datosmaestros.nom_indicador i on i.idindicador = dat.idindicador
                    join mod_datosmaestros.nom_naturaleza nat on i.idnaturaleza = nat.idnaturaleza
                    where dat.idordentrabajo = {$docOrigen[0]}";
            switch ($prodmanoobra) {
                case 1:
                    $importe = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                        "select coalesce((
                        {$sqlProducto}
                        )),0)"
                    )->fetchAll(PDO::FETCH_COLUMN);
                    break;
                case 2:
                    $importe = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                        "select coalesce(({$sqlServicios}),0)"
                    )->fetchAll(PDO::FETCH_COLUMN);
                    break;
                default:
                    $importe = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                        "select coalesce((
                        {$sqlProducto}
                        )),0) + coalesce(({$sqlServicios}),0)"
                    )->fetchAll(PDO::FETCH_COLUMN);
                    break;
            }
            return $importe[0];
        }
        return 0;
    }

    public function completarPase(&$objPase, $pase, $idDocumento, $devfac = false, $importeAnticipos = 0)
    {
        $refArray = array();
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        $objPase->valorcontable = $pase['valor']['valor'];
        if (count($pase['sustituciones'])) {
            foreach ($pase['sustituciones'] as $pos => $sustitucion) {
                /*
                 * 119 Centro de costo
                 */
                if ($sustitucion['valor'] == 119) {
                    if ($pase['valor']['valor'] == 527) {
                        return $this->getMaterialesServicio($idDocumento, $pase, $objPase, $sustitucion['valor']);
                    } else {
                        if ($pase['valor']['valor'] == 539 && $pos == count($pase['sustituciones']) - 1) {
                            return $this->getServicioProductoCC($idDocumento, $pase, $objPase, $sustitucion['valor']);
                        }
                        if ($this->idCentroCostoFac && $this->idCentroCostoFac != -1) {
                            $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, $sustitucion['parteformato'], $this->idCentroCostoFac);
                        } else {
                            return $this->getServicioProductoCC($idDocumento, $pase, $objPase, $sustitucion['valor']);
                        }
                    }
                    /* $queryData = Doctrine_Query::create()->select('coalesce(idcentrocosto,-1) as idcentrocosto')->from('DatDocfactura')
                                     ->where('idfactura = ?', array($idDocumento))->fetchOne();*/

                } elseif ($sustitucion['valor'] == 120) {
                    $campo = 'importecontable';
                    $elementos = $this->getValorElementosGasto($idDocumento, $campo);
                    if (count($elementos)) {
                        foreach ($elementos as $gasto) {
                            if ($gasto->idelemento) {
                                $idcuenta = $objPase->idcuenta;

                                $idElementos = $this->getElementosByIdElemento($gasto->idelemento);
                                $cuenta = $this->buscarCuentaPorId($idcuenta);
                                $concate = $cuenta->concatcta . '.' . $idElementos[0]['concat'];
                                $cuentaE = $this->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
                                $idcuenta = $cuentaE->idcuenta;
                            }
                            if ($idcuenta == $objPase->idcuenta) {
                                //TODO Muestro el error de que no existe el elmento del gasto aperturado
                            } else {
                                $newPase = $this->inicializarPase($pase, $idDocumento);
                                $newPase->idcuenta = $idcuenta;
                                $newPase->importe = $gasto->importe;
                                $newPase->importemb = $gasto->importe;
                                $newPase->importemo = $gasto->importe;
                                $moneda = LogisticaGlobal::__init()->getMonedaEntidad();

                                array_push($refArray, $newPase);
                            }
                        }
                    }

                } elseif ($sustitucion['valor'] == 501) {
                    /**
                     * Aperetura para el almacen
                     */
                    $sqlOrganismo = "SELECT nor.codigo
						FROM  mod_logistica.dat_documentocliente ddc
						inner join mod_datosmaestros.nom_clientesproveedor ncp on ncp.idclientesproveedores = ddc.idcliente
						inner join mod_crmclienteproveedor.nom_organismo nor on nor.idorganismo = ncp.idorganismo
						where ddc.iddocumento = {$idDocumento} limit 1";
                    $almacen = $this->doctrineHelper->getConnection()->execute($sqlOrganismo)->fetchAll(PDO::FETCH_ASSOC);
                    $idcuenta = $objPase->idcuenta;
                    $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
                    $concate = $cuenta->concatcta . '.' . $almacen[0]['codigo'];
                    $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
                    $idcuenta = $cuentaE->idcuenta;
                    $objPase->idcuenta = $idcuenta;
                } elseif ($sustitucion['valor'] == 502 || $sustitucion['valor'] == 526) {
                    /**
                     * Aperetura para el servicio
                     */
                    if ($pase['valor']['valor'] == 541) {
                        return $this->getServiciosTPV($idDocumento, $pase, $objPase, $sustitucion['valor']);
                    } else {
                        return $this->getServiciosProductoCodigoIng($idDocumento, $pase, $objPase, $sustitucion['valor']);
                    }
                } elseif ($sustitucion['valor'] == 507) {
                    /**
                     * Aperetura para el servicio
                     */
                    return $this->getServiciosProductoCodigoCosto($idDocumento, $pase, $objPase);
                } elseif ($sustitucion['valor'] == 500) {
                    /**
                     * Aperetura para el almacen
                     */
                    $sqlEstrucutura = "SELECT distinct  v.codigo
                                    FROM mod_logistica.dat_producto dp
                                    inner join mod_estructuracomp.v_dametodasestructuras v on v.idestructura = dp.idestructura
                                    inner join mod_logistica.dat_movimiento dm on dm.idproducto = dp.idproducto
                                    where dm.iddocumento = {$idDocumento} limit 1";
                    $almacen = $this->doctrineHelper->getConnection()->execute($sqlEstrucutura)->fetchAll(PDO::FETCH_ASSOC);
                    $idcuenta = $objPase->idcuenta;
                    $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
                    $concate = $cuenta->concatcta . '.' . $almacen[0]['codigo'];
                    $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
                    $idcuenta = $cuentaE->idcuenta;
                    $objPase->idcuenta = $idcuenta;
                } elseif ($sustitucion['valor'] == 590) {
                    /**
                     * Aperetura para forma de pago en punto de venta
                     */
                    return $this->aperturaFormaPago($idDocumento, $pase, $objPase);
                } elseif ($sustitucion['tipo'] == 'refestatica') {
                    $idcuenta = $objPase->idcuenta;
                    $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
                    $concate = $cuenta->concatcta . '.' . $sustitucion['valor'];
                    $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
                    $objPase->idcuenta = $cuentaE->idcuenta;
                } else if ($sustitucion['valor'] == 308) {
                    return $this->getMaterialesServicioOtraEntidad($idDocumento, $pase, $objPase, $sustitucion['valor']);
                }
            }
            if (count($refArray)) {
                return $refArray;
            }
        }
        switch ($pase['valor']['valor']) {
            case 103 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeTotalDocumento($idDocumento) - $importeAnticipos;
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 300 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeTotalDocumento($idDocumento) + $this->importeTotalDocumentoAlternativo($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 106 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeParcial($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 301 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeParcialAlternativo($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 302 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $importeParcialMN = $this->importeParcial($idDocumento);
                $importeParcialAlt = $this->importeParcialAlternativo($idDocumento);
                $objPase->importe = $importeParcialMN + $importeParcialAlt;
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;

            case 108 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importePrecioPromedio($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 115 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeTotalDocumentoAlternativo($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 119 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importePrecioPromedio($idDocumento, 'precioalternativo');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 307 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $importeMC = $this->importePrecioPromedio($idDocumento);
                $importeMA = $this->importePrecioPromedio($idDocumento, 'precioalternativo');
                $objPase->importe = $importeMC + $importeMA;
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 402 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeCostoMaterial($idDocumento, 'importecontable', 0);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 403 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeCostoMaterial($idDocumento, 'importealternativo');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 404 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeCostoMaterial($idDocumento, 'importecontable', 1);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 405 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeCostoMaterial($idDocumento, 'importecontable', 2);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 503 :
                /**
                 * @todo Calcular el importe total del documento sin el monto de la reserva
                 */
                $objPase->importe = $this->importeTotalDocumentoSinInre($idDocumento, $this->dualidad->idmoneda);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 504 :
                /**
                 * @todo Calcular el importe total del documento sin el monto de la reserva
                 */
                $objPase->importe = $this->importeTotalDocumentoSinInre($idDocumento, $this->dualidad->idmonedaalternativa);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 510 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->importeConceptoCodigo($idDocumento, $this->dualidad->idmoneda, null, '+');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 511 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->importeConceptoCodigo($idDocumento, $this->dualidad->idmonedaalternativa);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 512 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->importeConceptoCodigo($idDocumento, $this->dualidad->idmoneda, 'inre');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 513 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->importeConceptoCodigo($idDocumento, $this->dualidad->idmonedaalternativa, 'inre');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmonedaalternativa;
                $objPase->moneda = $moneda->codigoisoalt;
                break;
            case 514 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->importeConceptoCodigo($idDocumento, $this->dualidad->idmoneda, array("'arancel'", "'servicio'"));
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 515 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->importeConceptoCodigo($idDocumento, $this->dualidad->idmoneda, 'flete');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmoneda;
                $objPase->moneda = $moneda->codigoiso;
                break;
            case 516 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->importeConceptoCodigo($idDocumento, $this->dualidad->idmoneda, 'seguro');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmoneda;
                $objPase->moneda = $moneda->codigoiso;
                break;
            case 517 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->importeConceptoCodigo($idDocumento, $this->dualidad->idmoneda, 'tramdoc');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmoneda;
                $objPase->moneda = $moneda->codigoiso;
                break;
            case 518 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->importeConceptoCodigo($idDocumento, $this->dualidad->idmoneda, 'insp');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmoneda;
                $objPase->moneda = $moneda->codigoiso;
                break;
            case 519 :
                /**
                 * @todo Calcular el importe total del documento sin el monto de la reserva
                 */
                $objPase->importe = $this->importeTotalDocumentoSinMC($idDocumento, $this->dualidad->idmoneda, array("'gastfinc'", "'mc'"));
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 520 :
                /**
                 * @todo Calcular el importe total del documento sin el monto de la reserva
                 */
                $objPase->importe = $this->importeTotalDocumentoSinCod($idDocumento, $this->dualidad->idmoneda, 'gastfinc');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmoneda;
                $objPase->moneda = $moneda->codigoiso;
                break;
            case 521 :
                /**
                 * @todo Calcular el importe total del documento sin el monto de la reserva
                 */
                $objPase->importe = $this->importeConceptoCodigo($idDocumento, $this->dualidad->idmoneda, 'puestafob');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                $objPase->idmoneda = $moneda->idmoneda;
                $objPase->moneda = $moneda->codigoiso;
                break;
            case 523 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->getServiciosProductoCodigoST($idDocumento, $this->dualidad->idmoneda, 'CST');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 524 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->getServiciosProductoCodigoST($idDocumento, $this->dualidad->idmonedaalternativa, 'CST');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 525 :
                /**
                 * @todo Calcular el importe de conceptos para el importe dado el codigo del concepto
                 */
                $objPase->importe = $this->importeConceptoCodigo($idDocumento, $this->dualidad->idmoneda, 'isv2');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 528 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento sin los servicios que tienen materiales
                 */
                $objPase->importe = $this->importeTotalSinMateriales($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 529 :
                /**
                 * @todo Calcular el importe de los ingresos netos del documento (Total - costo = ingreso)
                 */
                $objPase->importe = $this->getIngresosNetosXMercancia($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 530 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeTotalDocumentoSinComision($idDocumento) - $importeAnticipos;
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 531 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getComisionTV($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;

            case 532 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getMaterialesServicioOtraEntidad($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 533 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getImporteTotalXMoneda($idDocumento, false, 533);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 534 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getImporteTotalXMoneda($idDocumento, true, 534);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 535 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getImporteTotalAmbasMoneda($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 536 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getImporteTotalXMoneda($idDocumento, false, 536);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 537 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getImporteTotalXMoneda($idDocumento, true, 537);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 538 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getImporteTotalAmbasMonedaExt($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 539 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getImporteTotalContUsd($idDocumento, true, 539);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 540 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getImporteTotalContUsd($idDocumento, false, 540);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 541 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getImporteServiciosTPV($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 542 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeFinalDocumento($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 543 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeRecargoDescuento($idDocumento, '-');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 544 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeRecargoDescuento($idDocumento, '+');
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 545 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->getImporteProductosTPV($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 546 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeMediaProductos($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
            case 590 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importeEfectivo($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
        }
    }

    public function getServiciosProductoCodigoST($idDocumento, $idmoneda, $codigo = 'SC')
    {
        $sql = "select sum(coalesce(round((dde.preciotarifa * def.cantidad),$this->fRedondeo6),0)) as importe 
                    from mod_logfacturacion.dat_elementosfactura def
                inner join mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
                inner join mod_logfacturacion.dat_prodservnomenclador dps on dps.idelementofactura = def.idelementofactura
                inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dps.idindicador
				inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dps.idindicador
				inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                where def.idfactura = {$idDocumento} and dde.idmoneda = {$idmoneda} and nnat.codigocontable = '{$codigo}'";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        return $datos[0]['importe'];
    }

    public function getServiciosProductoCodigoIng($idDocumento, $pase, $pObjectPase = null, $sustitucion = false)
    {
        $idmoneda = ($pase['valor']['valor'] == 103 || $pase['valor']['valor'] == 106 || $pase['valor']['valor'] == 108 || $pase['valor']['valor'] == 539 || $pase['valor']['valor'] == 540) ? $this->dualidad->idmoneda : $this->dualidad->idmonedaalternativa;
        $iso = ($pase['valor']['valor'] == 103 || $pase['valor']['valor'] == 106 || $pase['valor']['valor'] == 108 || $pase['valor']['valor'] == 539 || $pase['valor']['valor'] == 540) ? $this->dualidad->codigoiso : $this->dualidad->codigoisoalt;
        $columna = $pase['valor']['valor'] == 108 ? 'dm' : 'dmm';
        $campo = $pase['valor']['valor'] == 108 ? 'preciocontable' : 'precio';
        $andE = $andM = ($sustitucion) ? " and (nnat.codigoaux = '{$sustitucion}' or nnat.codigoaux is null) " : "";
        $idmoneda = ($idmoneda) ? $idmoneda : $this->dualidad->idmoneda;
        $signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
        $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;
        if ($pase['valor']['valor'] == 539 || $pase['valor']['valor'] == 540) {
            if ($pase['valor']['valor'] == 539) {
                if ($fac->idmoneda) {
                    $tasa = 0;
                } else if ($fac->idmonedaprod) {
                    $tasa = 1;
                    $andE .= " and dps.tipo = 2 ";
                    $andM .= " and false ";
                }
            } else {
                if ($fac->idmonedaprod) {
                    $andE .= " and dps.tipo = 1 ";
                } else if ($fac->idmoneda) {
                    $andE .= "";
                    $andM .= "";
                } else {
                    $andE .= " and false ";
                    $andM .= " and false ";
                }
            }
        }
        $sql = "select distinct nnat.codigocontable as codigoauxiliar, sum(coalesce(round((dde.preciotarifa * def.cantidad),$this->fRedondeo6),0))*{$tasa} as importe 
                    from mod_logfacturacion.dat_elementosfactura def
                inner join mod_logfacturacion.dat_desgloselemento dde on dde.idelementofactura = def.idelementofactura
                inner join mod_logfacturacion.dat_prodservnomenclador dps on dps.idelementofactura = def.idelementofactura
                inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dps.idindicador
				inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dps.idindicador
				inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                where def.idfactura = {$idDocumento} and dde.idmoneda = {$idmoneda}{$andE} group by nnat.codigocontable 
                union 
                select distinct nnat.codigocontable as codigoauxiliar, sum(coalesce(round(({$columna}.{$campo} * dm.cantidad),$this->fRedondeo6),0))*{$tasa} as importe 
                    from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_movmoneda dmm on dmm.idmovimiento = dm.idmovimiento
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dp.idindicador
				inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
				inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                where dm.iddocumento = {$idDocumento} and dmm.idmoneda = '{$idmoneda}'{$andM} group by nnat.codigocontable";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        $pases = array();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $objPase->idmoneda = $idmoneda;
            $objPase->moneda = $iso;
            $idcuenta = $pObjectPase->idcuenta;
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
            $concate = $cuenta->concatcta . '.' . $value['codigoauxiliar'];
            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            $idcuenta = $cuentaE->idcuenta;
            $objPase->idcuenta = $idcuenta;
            if ($this->idCentroCostoFac)
                $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $this->idCentroCostoFac);
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function getImporteServiciosTPV($iddocumento)
    {
        $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
            where mm.idventas = {$iddocumento} limit 1";
        $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
        $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
        $arrayTasa = $this->doctrineHelper->getConnection()->fetchAll($sqlTasa);
        $idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;
        $tasaCambio = 1;
        if ($idmonedacontable != $arrayMoneda[0]['idmoneda']) {
            $tasa = $this->configuracionHelper->getTasaByMonedas(
                $idmonedacontable,
                $arrayMoneda[0]['idmoneda'],
                $arrayTasa[0]['idtipotasa']
            );
            if (count($tasa)) {
                $tasaCambio = $tasa[0]['factordeconversion'];
            }
        }
        $sql = "select sum(coalesce(dvs.importetotal*{$tasaCambio})) as importe from mod_logpuntoventa.dat_ventaservicio dvs where dvs.idventas = {$iddocumento}";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        $importe = 0;
        if (count($datos)) {
            $importe = $datos[0]['importe'];
        }
        return $importe;
    }

    public function getImporteProductosTPV($iddocumento)
    {
        $sqlMoneda = "select mm.idmoneda from mod_logistica.dat_movmoneda mm
                      inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = mm.idmovimiento 
            where dm.iddocumento = {$iddocumento} limit 1";
        $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
        $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
        $arrayTasa = $this->doctrineHelper->getConnection()->fetchAll($sqlTasa);
        $idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;
        $tasaCambio = 1;
        if ($idmonedacontable != $arrayMoneda[0]['idmoneda']) {
            $tasa = $this->configuracionHelper->getTasaByMonedas(
                $idmonedacontable,
                $arrayMoneda[0]['idmoneda'],
                $arrayTasa[0]['idtipotasa']
            );
            if (count($tasa)) {
                $tasaCambio = $tasa[0]['factordeconversion'];
            }
        }
        $sql = "select SUM(ROUND(dmm.precio * m.cantidad,2)*{$tasaCambio}) as importe from mod_logistica.dat_movmoneda dmm 
                inner join mod_logistica.dat_movimiento m on m.idmovimiento = dmm.idmovimiento 
        where m.iddocumento = {$iddocumento}";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        $importe = 0;
        if (count($datos)) {
            $importe = $datos[0]['importe'];
        }
        return $importe;
    }

    public function getServiciosTPV($idDocumento, $pase, $pObjectPase = null, $sustitucion = false)
    {
        $and = ($sustitucion) ? " and (nnat.codigoaux = '{$sustitucion}' or nnat.codigoaux is null) " : "";
        $idmoneda = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;
        $iso = $this->dualidad->codigoiso;

        $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
            where mm.idventas = {$idDocumento} limit 1";
        $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
        $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
        $arrayTasa = $this->doctrineHelper->getConnection()->fetchAll($sqlTasa);

        $tasaCambio = 1;
        if ($idmoneda != $arrayMoneda[0]['idmoneda']) {
            $tasa = $this->configuracionHelper->getTasaByMonedas(
                $idmoneda,
                $arrayMoneda[0]['idmoneda'],
                $arrayTasa[0]['idtipotasa']
            );
            if (count($tasa)) {
                $tasaCambio = $tasa[0]['factordeconversion'];
            }
        }

        $sql = "select distinct nnat.codigocontable as codigoauxiliar, sum(coalesce(dvs.importetotal*{$tasaCambio},0)) as importe 
                    from mod_logpuntoventa.dat_ventaservicio dvs
                inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dvs.idindicador
				inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dvs.idindicador
				inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                where dvs.idventas = {$idDocumento} {$and} group by nnat.codigocontable ";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        $pases = array();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $objPase->idmoneda = $idmoneda;
            $objPase->moneda = $iso;
            $idcuenta = $pObjectPase->idcuenta;
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
            $concate = $cuenta->concatcta . '.' . $value['codigoauxiliar'];
            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            $idcuenta = $cuentaE->idcuenta;
            $objPase->idcuenta = $idcuenta;
            if ($this->idCentroCostoFac)
                $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $this->idCentroCostoFac);
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function aperturaFormaPago($idDocumento, $pase, $pObjectPase = null)
    {
        $sqlMoneda = "select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                  on dm.idmovimiento = mm.idmovimiento
                  where dm.iddocumento = {$idDocumento} limit 1";
        $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
        if (!count($arrayMoneda)) {
            $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
            where mm.idventas = {$idDocumento} limit 1";
            $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
        }
        $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
        $arrayTasa = $this->doctrineHelper->getConnection()->fetchAll($sqlTasa);
        $idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;
        $tasaCambio = 1;
        if ($idmonedacontable != $arrayMoneda[0]['idmoneda']) {
            $tasa = $this->configuracionHelper->getTasaByMonedas(
                $idmonedacontable,
                $arrayMoneda[0]['idmoneda'],
                $arrayTasa[0]['idtipotasa']
            );
            if (count($tasa)) {
                $tasaCambio = $tasa[0]['factordeconversion'];
            }
        }
        $iso = $this->dualidad->codigoiso;
        $idmoneda = $this->dualidad->idmoneda;
        $sql = "select mp.codigo, sum(dp.importe)*{$tasaCambio} as importe from mod_logpuntoventa.dat_desglosepago dp
                join mod_logpuntoventa.nom_modopago mp ON mp.idmodopago = dp.idformapago
                where iddocumento = {$idDocumento} and mp.efectivo <> 1
                group by mp.codigo";
        $datos = $this->doctrineHelper->getConnection()->fetchAll($sql);
        $pases = array();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $objPase->idmoneda = $idmoneda;
            $objPase->moneda = $iso;
            $idcuenta = $pObjectPase->idcuenta;
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
            $concate = $cuenta->concatcta . '.' . $value['codigo'];
            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            $objPase->idcuenta = $cuentaE->idcuenta;
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function importeEfectivo($idDocumento)
    {
        $sqlMoneda = "select mm.idmoneda from mod_logistica.dat_movmoneda mm inner join mod_logistica.dat_movimiento dm 
                  on dm.idmovimiento = mm.idmovimiento
                  where dm.iddocumento = {$idDocumento} limit 1";
        $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
        $sqlTasa = "select c.idtipotasa from mod_logfacturacion.conf_configuracionfactura c where c.idestructuracomun = {$this->global->Estructura->idestructura}";
        $arrayTasa = $this->doctrineHelper->getConnection()->fetchAll($sqlTasa);
        if (!count($arrayMoneda)) {
            $sqlMoneda = "select mm.idmoneda from mod_logpuntoventa.dat_ventaservicio mm 
                        where mm.idventas = {$idDocumento} limit 1";
            $arrayMoneda = $this->doctrineHelper->getConnection()->fetchAll($sqlMoneda);
        }
        $idmonedacontable = LogisticaGlobal::__init()->getMonedaEntidad()->idmoneda;
        $tasaCambio = 1;
        if ($idmonedacontable != $arrayMoneda[0]['idmoneda']) {
            $tasa = $this->configuracionHelper->getTasaByMonedas(
                $idmonedacontable,
                $arrayMoneda[0]['idmoneda'],
                $arrayTasa[0]['idtipotasa']
            );
            if (count($tasa)) {
                $tasaCambio = $tasa[0]['factordeconversion'];
            }
        }
        $sql = "select mp.codigo, sum(dp.importe)*{$tasaCambio} as importe from mod_logpuntoventa.dat_desglosepago dp
                join mod_logpuntoventa.nom_modopago mp ON mp.idmodopago = dp.idformapago
                where iddocumento = {$idDocumento} and mp.efectivo = 1
                group by mp.codigo";
        $datos = $this->doctrineHelper->getConnection()->fetchAll($sql);
        return $datos[0]['importe'];
    }
    /*public function getServiciosProductoCodigoCosto($idDocumento, $pase) {
        $idmoneda = ($pase['valor']['valor'] == 108) ? $this->dualidad->idmoneda : $this->dualidad->idmonedaalternativa;
        $campo = ($pase['valor']['valor'] == 108) ? 'preciopromedio' : 'preciopromalt';
        $iso = ($pase['valor']['valor'] == 108) ? $this->dualidad->codigoiso : $this->dualidad->codigoisoalt;
        $sql = "select distinct nih.codigoauxiliar , sum(coalesce(round((dm.{$campo} * dm.cantidad),$this->fRedondeo6),0)) as importe 
                    from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dp.idindicador
                where dm.iddocumento = {$idDocumento} group by nih.codigoauxiliar";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        $pases = array();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase);
            $objPase->idmoneda = $idmoneda;
            $objPase->moneda = $iso;
            $idcuenta = $pase['cuenta'];
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
            $concate = $cuenta->concatcta . '.' . $value['codigoauxiliar'];
            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            $idcuenta = $cuentaE->idcuenta;
            $objPase->idcuenta = $idcuenta;
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }*/
    /*
     * Funcion para calcular costo de materiales y mano de obra de la ot
     * @param $prodmanoobra (0->productos y servicios, 1->productos, 2->servicios)
     * */
    public function getServiciosProductoCodigoCosto($idDocumento, $pase, $pObjectPase = null)
    {
        if (
            $pase['valor']['valor'] == 108
            || $pase['valor']['valor'] == 402
            || $pase['valor']['valor'] == 404
            || $pase['valor']['valor'] == 405
        ) {
            $idmoneda = $this->dualidad->idmoneda;
            $campo = 'preciocontable';
            $iso = $this->dualidad->codigoiso;
        } else {
            $idmoneda = $this->dualidad->idmonedaalternativa;
            $campo = 'precioalternativo';
            $iso = $this->dualidad->codigoisoalt;
        }

        $dataQuery = Doctrine_Query::create()
            ->select("ddf.idsubsistema")
            ->from('DatDocfactura ddf')
            ->where('ddf.idfactura = ? ', $idDocumento)
            ->fetchArray();
        if ($dataQuery[0]['idsubsistema'] == LogisticaGlobal::SUBSISTEMA_TALLERES) {
            $docOrigen = LogisticaDoctrineHelper::__init()->getConnection()->execute(
                "select ddp.idpadre from mod_logistica.dat_documentopadre ddp where ddp.iddocumento = {$idDocumento}"
            )->fetchAll(PDO::FETCH_COLUMN);
            $idDocumentoOT = $docOrigen[0];
        }
        $signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        $sqlProductos = "select distinct nnat.codigocontable as codigoauxiliar, (sum(coalesce(round((dm.{$campo} * dm.cantidad),$this->fRedondeo6),0))-sum(COALESCE(dev.importecontable, 0))) as importe 
                    from mod_logistica.dat_movimiento dm
				inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dp.idindicador
				inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
				inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
				inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = dm.iddocumento
                left join mod_logistica.dat_documentopadre ddp1 on ddp1.idpadre = ddp.iddocumento 
                left join mod_logistica.dat_documentopadre ddp2 on ddp2.idpadre = dd.iddocumento
				left join mod_logistica.dat_movimiento dev on dev.iddocumento = ddp2.iddocumento and dev.idproducto = dm.idproducto
				left join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento and ddev.estado = 4
                where ddp.idpadre = {$idDocumentoOT} and dd.estado = 4 and dm.signo = '{$signo}' and dp.idindicador in (
                	select dps.idindicador from mod_logfacturacion.dat_elementosfactura def
					inner join mod_logfacturacion.dat_prodservnomenclador dps on dps.idelementofactura = def.idelementofactura
					where def.idfactura = {$idDocumento}
                )  group by nnat.codigocontable";
        $sqlServicios = "select nat.codigocontable as codigoauxiliar, round(sum(dat.costo),2) as importe
                from mod_logtaller.dat_ordenactividad dat
                join mod_datosmaestros.nom_indicador i on i.idindicador = dat.idindicador
                join mod_datosmaestros.nom_naturaleza nat on i.idnaturaleza = nat.idnaturaleza
                where dat.idordentrabajo = {$idDocumentoOT} group by nat.codigocontable";

        switch ($pase['valor']['valor']) {
            case 404:
                $sql = "$sqlProductos";
                break;
            case 405:
                $sql = "$sqlServicios";
                break;
            default:
                $sql = "{$sqlProductos} union {$sqlServicios}";
                break;
        }

        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        $pases = array();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $objPase->idmoneda = $idmoneda;
            $objPase->moneda = $iso;
            $idcuenta = $pObjectPase->idcuenta;
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
            $concate = $cuenta->concatcta . '.' . $value['codigoauxiliar'];
            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            $idcuenta = $cuentaE->idcuenta;
            $objPase->idcuenta = $idcuenta;
            $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $this->idCentroCostoFac);
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function getElementos($idDocumento)
    {
        $mov = $this->doctrineHelper->query(
            "SELECT de.idelementofactura FROM DatElementosFactura de
         WHERE de.idfactura = {$idDocumento}"
        )->toArray();
        foreach ($mov as $i => $m) {
            $movimientos[$i] = $m['idelementofactura'];
        }
        return ($movimientos) ? $movimientos : false;
    }

    public function getMovimientos($idDocumento)
    {
        if (class_exists('DatMovimientos')) {
            $mov = $this->doctrineHelper->query(
                "SELECT dm.idmovimiento FROM DatMovimientos dm
             WHERE dm.iddocumento = {$idDocumento}"
            )->toArray();
            foreach ($mov as $i => $m) {
                $movimientos[$i] = $m['idmovimiento'];
            }
            return ($movimientos) ? $movimientos : false;
        }
        return false;
    }

    public function getMargenProdSinPrecio($iddocumento, $alternativo = false, $signo = '+')
    {
        $idmoneda = ($alternativo) ? $this->dualidad->idmonedaalternativa : $this->dualidad->idmoneda;
        $campo = ($alternativo) ? 'precioalternativo' : 'preciocontable';
        $margComMovSum = $this->doctrineHelper->query(
            "SELECT COALESCE(SUM(dm.cantidad * dect.valor),0) AS valor 
                        FROM DatElementocategoria dect 
                        INNER JOIN dect.DatCuentadesgloceprecio dcdp  
                        INNER JOIN dcdp.NomClasificacioncontablelog nc 
                        INNER JOIN dect.DatMovimientos dm 
                        WHERE dect.idmoneda = {$idmoneda} AND dect.idmovimiento IN (SELECT dm1.idmovimiento FROM DatMovimientos dm1
                        WHERE dm1.iddocumento = {$iddocumento} AND dm1.{$campo} = 0) AND dect.concepto = '{$signo}'"
        )->getFirst()->toArray();
        return $margComMovSum['valor'];
    }

    public function importeTotalDocumentoSinMC($idDocumento, $idmoneda, $codigoMC = false)
    {
        new DatProdFactura();
        new DatCategoriaPrecioFactura();
        $and = ($codigoMC) ? " and ncp.codigo not in (" . implode(',', $codigoMC) . ") " : "";
        $importe = $this->doctrineHelper->query(
            "SELECT abs(SUM(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2)) - SUM(COALESCE (dpf.importefactmn,0))) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                INNER JOIN m.DatProdFactura dpf
                 WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$idmoneda}"
        )->getFirst()->toArray();
        $importe2 = $this->doctrineHelper->query(
            "SELECT abs(SUM(dde.preciotarifa * def.cantidad) - SUM(COALESCE(dde.preciotarifafactura,0) * def.cantidad)) as importe FROM DatElementosFactura def
                INNER JOIN def.DatDesgloselemento dde
                WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$idmoneda}"
        )->getFirst()->toArray();
        $conceptos = $this->doctrineHelper->query(
            "SELECT ddcp.concepto,ddcp.porciento,abs(ddcp.valorcalculo - COALESCE(ddcp.valorcalculofact,0)) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                INNER JOIN dcpf.NomCategoriaprecio ncp
                WHERE dcpf.idfactura = {$idDocumento} and ddcp.idmoneda = {$idmoneda} {$and}"
        )->toArray();
        $importeParcial = $importe['importe'] + $importe2['importe'];
        $conceptosSuma = 0;
        $conceptosResta = 0;
        foreach ($conceptos as $concp) {
            if ($concp['concepto'] == '+') {
                $conceptosSuma += $concp['valorcalculo'];
            } else {
                $conceptosResta += $concp['valorcalculo'];
            }
        }
        return $importeParcial + $conceptosSuma - $conceptosResta;
    }

    public function importeTotalDocumentoSinCod($idDocumento, $idmoneda, $codigo)
    {
        new DatProdFactura();
        new DatCategoriaPrecioFactura();

        $importe = $this->doctrineHelper->query(
            "SELECT abs(SUM(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END)) - SUM(COALESCE (dpf.importefactmn,0))) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                INNER JOIN m.DatProdFactura dpf
                 WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$idmoneda}"
        )->getFirst()->toArray();
        $importe2 = $this->doctrineHelper->query(
            "SELECT abs(SUM(dde.preciotarifa * def.cantidad) - SUM(COALESCE(dde.preciotarifafactura,0) * def.cantidad)) as importe FROM DatElementosFactura def
                INNER JOIN def.DatDesgloselemento dde
                WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$idmoneda}"
        )->getFirst()->toArray();
        $conceptos = $this->doctrineHelper->query(
            "SELECT ddcp.concepto,ddcp.porciento,abs(ddcp.valorcalculo - COALESCE(ddcp.valorcalculofact,0)) as valorcalculo FROM DatDesglosecategoriapreciofactura ddcp
                INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                INNER JOIN dcpf.NomCategoriaprecio ncp
                WHERE dcpf.idfactura = {$idDocumento} and ddcp.idmoneda = {$idmoneda} and ncp.codigo <> '{$codigo}'"
        )->toArray();
        $importeParcial = $importe['importe'] + $importe2['importe'];
        $conceptosSuma = 0;
        $conceptosResta = 0;
        foreach ($conceptos as $concp) {
            if ($concp['concepto'] == '+') {
                $conceptosSuma += $concp['valorcalculo'];
            } else {
                $conceptosResta += $concp['valorcalculo'];
            }
        }
        return $importeParcial + $conceptosSuma - $conceptosResta;
    }

    public function getMaterialesServicio($idDocumento, $pase, $pObjectPase = null, $sustitucion = false)
    {
        $idmoneda = $this->dualidad->idmoneda;
        $iso = $this->dualidad->codigoiso;
        $and = ($sustitucion) ? " and (nnat.codigoaux = '{$sustitucion}' or nnat.codigoaux is null) " : "";

        $sql = "select distinct nnat.codigocontable as codigoauxiliar, coalesce(sum(round(desg.precio*dps.cantidad,2)),0) as importe, 
                coalesce(dps.idcentrocosto, -1) as idcentrocosto
                from mod_logfacturacion.dat_prodservicios dps 
                inner join mod_logfacturacion.dat_desglosemonedaprodserv desg on desg.idprodservicio = dps.idprodservicio 
                inner join mod_logfacturacion.dat_elementosfactura def on def.idelementofactura = dps.idelementofactura 
                inner join mod_logfacturacion.dat_prodservnomenclador dpsn on dpsn.idelementofactura = def.idelementofactura 
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpsn.idindicador
                inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                where def.idfactura = {$idDocumento} and desg.idmoneda = {$idmoneda} 
                and (dps.idestructuracomun = {$this->global->Estructura->idestructura} or dps.idestructuracomun is null) {$and} group by nnat.codigocontable, dps.idcentrocosto";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        $pases = array();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $objPase->idmoneda = $idmoneda;
            $objPase->moneda = $iso;
            $idcuenta = $pObjectPase->idcuenta;
            $objPase->idcuenta = $idcuenta;
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
            $concate = $cuenta->concatcta . '.' . $value['codigoauxiliar'];
            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            $idcuenta = $cuentaE->idcuenta;
            $objPase->idcuenta = $idcuenta;
            if ($value['idcentrocosto'] != -1) {
                $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $value['idcentrocosto']);
            } else if ($this->idCentroCostoFac)
                $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $this->idCentroCostoFac);
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function getServicioProductoCC($idDocumento, $pase, $pObjectPase = null, $sustitucion = false)
    {
        $idmoneda = $this->dualidad->idmoneda;
        $iso = $this->dualidad->codigoiso;
        $and = "";
        $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
        $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;
        if ($pase['valor']['valor'] == 539 || $pase['valor']['valor'] == 540) {
            if ($pase['valor']['valor'] == 539) {
                if ($fac->idmoneda) {
                    $tasa = 0;
                    $sql = "select coalesce(sum(round(desg.preciotarifa*def.cantidad,2)),0)*{$tasa} as importe, 
                    coalesce(def.idcentrocosto, -1) as idcentrocosto
                    from mod_logfacturacion.dat_elementosfactura def 
                    inner join mod_logfacturacion.dat_prodservnomenclador dpsn on dpsn.idelementofactura = def.idelementofactura
                    inner join mod_logfacturacion.dat_desgloselemento desg on desg.idelementofactura = def.idelementofactura 
                    --inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpsn.idindicador
                    --inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                    where def.idfactura = {$idDocumento} and desg.idmoneda = {$idmoneda} 
                    {$and} group by idcentrocosto";
                } else if ($fac->idmonedaprod) {
                    $sql = "select coalesce(sum(round(desg.preciotarifa*def.cantidad,2)),0) as importe, 
                    coalesce(def.idcentrocosto, -1) as idcentrocosto
                    from mod_logfacturacion.dat_elementosfactura def 
                    inner join mod_logfacturacion.dat_prodservnomenclador dpsn on dpsn.idelementofactura = def.idelementofactura
                    inner join mod_logfacturacion.dat_desgloselemento desg on desg.idelementofactura = def.idelementofactura 
                    --inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpsn.idindicador
                    --inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                    where def.idfactura = {$idDocumento} and dpsn.tipo = 2 and desg.idmoneda = {$idmoneda} 
                    {$and} group by idcentrocosto";
                } else {
                    $sql = "select coalesce(sum(round(desg.preciotarifa*def.cantidad,2)),0) as importe, 
                    coalesce(def.idcentrocosto, -1) as idcentrocosto
                    from mod_logfacturacion.dat_elementosfactura def 
                    inner join mod_logfacturacion.dat_prodservnomenclador dpsn on dpsn.idelementofactura = def.idelementofactura
                    inner join mod_logfacturacion.dat_desgloselemento desg on desg.idelementofactura = def.idelementofactura 
                    --inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpsn.idindicador
                    --inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                    where def.idfactura = {$idDocumento} and desg.idmoneda = {$idmoneda} 
                    {$and} group by idcentrocosto";
                }
            } else {
                if ($fac->idmoneda) {
                    $sql = "select coalesce(sum(round(desg.preciotarifa*def.cantidad,2)),0)*{$tasa} as importe, 
                    coalesce(def.idcentrocosto, -1) as idcentrocosto
                    from mod_logfacturacion.dat_elementosfactura def 
                    inner join mod_logfacturacion.dat_prodservnomenclador dpsn on dpsn.idelementofactura = def.idelementofactura
                    inner join mod_logfacturacion.dat_desgloselemento desg on desg.idelementofactura = def.idelementofactura 
                    --inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpsn.idindicador
                    --inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                    where def.idfactura = {$idDocumento} and desg.idmoneda = {$idmoneda} 
                    {$and} group by idcentrocosto";
                } else if ($fac->idmonedaprod) {
                    $sql = "select coalesce(sum(round(desg.preciotarifa*def.cantidad,2)),0)*{$tasa} as importe, 
                    coalesce(def.idcentrocosto, -1) as idcentrocosto
                    from mod_logfacturacion.dat_elementosfactura def 
                    inner join mod_logfacturacion.dat_prodservnomenclador dpsn on dpsn.idelementofactura = def.idelementofactura
                    inner join mod_logfacturacion.dat_desgloselemento desg on desg.idelementofactura = def.idelementofactura 
                    --inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpsn.idindicador
                    --inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                    where def.idfactura = {$idDocumento} and dpsn.tipo = 1 and desg.idmoneda = {$idmoneda} 
                    {$and} group by idcentrocosto";
                } else {
                    $sql = "select coalesce(sum(round(desg.preciotarifa*def.cantidad,2)),0)*0 as importe, 
                    coalesce(def.idcentrocosto, -1) as idcentrocosto
                    from mod_logfacturacion.dat_elementosfactura def 
                    inner join mod_logfacturacion.dat_prodservnomenclador dpsn on dpsn.idelementofactura = def.idelementofactura
                    inner join mod_logfacturacion.dat_desgloselemento desg on desg.idelementofactura = def.idelementofactura 
                    --inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpsn.idindicador
                    --inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                    where def.idfactura = {$idDocumento} and desg.idmoneda = {$idmoneda} 
                    {$and} group by idcentrocosto";
                }
            }
        } else {
            $sql = "select coalesce(sum(round(desg.preciotarifa*def.cantidad,2)),0) as importe, 
                coalesce(def.idcentrocosto, -1) as idcentrocosto
                from mod_logfacturacion.dat_elementosfactura def 
                inner join mod_logfacturacion.dat_prodservnomenclador dpsn on dpsn.idelementofactura = def.idelementofactura
                inner join mod_logfacturacion.dat_desgloselemento desg on desg.idelementofactura = def.idelementofactura 
                --inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpsn.idindicador
                --inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                where def.idfactura = {$idDocumento} and desg.idmoneda = {$idmoneda} 
                {$and} group by idcentrocosto";
        }
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        $pases = array();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $objPase->idmoneda = $idmoneda;
            $objPase->moneda = $iso;
            $idcuenta = $pObjectPase->idcuenta;
            $objPase->idcuenta = $idcuenta;
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
            /*$concate = $cuenta->concatcta . '.' . $value['codigoauxiliar'];
            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            $idcuenta = $cuentaE->idcuenta;
            $objPase->idcuenta = $idcuenta;*/
            if ($value['idcentrocosto'] != -1) {
                $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $value['idcentrocosto']);
            } else if ($this->idCentroCostoFac)
                $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $this->idCentroCostoFac);
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function getMaterialesServicioOtraEntidad($idDocumento, $pase, $pObjectPase = null, $sustitucion = false)
    {
        $idmoneda = $this->dualidad->idmoneda;
        $iso = $this->dualidad->codigoiso;
        $select = $groupBy = "";
        if ($sustitucion) {
            $select = " distinct dps.idestructuracomun, ";
            $groupBy = " group by dps.idestructuracomun ";
        }

        $sql = "select {$select} coalesce(sum(round(desg.precio*dps.cantidad,2)),0) as importe
                from mod_logfacturacion.dat_prodservicios dps 
                inner join mod_logfacturacion.dat_desglosemonedaprodserv desg on desg.idprodservicio = dps.idprodservicio 
                inner join mod_logfacturacion.dat_elementosfactura def on def.idelementofactura = dps.idelementofactura 
                inner join mod_logfacturacion.dat_prodservnomenclador dpsn on dpsn.idelementofactura = def.idelementofactura 
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dpsn.idindicador
                inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
                where def.idfactura = {$idDocumento} and desg.idmoneda = {$idmoneda} and dps.idestructuracomun <> {$this->global->Estructura->idestructura} 
                {$groupBy}";
        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        if (!$sustitucion) {
            return $datos[0]['importe'];
        }
        $pases = array();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase, $idDocumento);
            $objPase->idmoneda = $idmoneda;
            $objPase->moneda = $iso;
            $idcuenta = $pObjectPase->idcuenta;
            $objPase->idcuenta = $idcuenta;

            $cuenta = $this->buscarCuentaEstructuraE($objPase->idcuenta, $value['idestructuracomun']);
            $objPase->idcuenta = $cuenta->idcuenta;

            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

    public function unificarPases($pases)
    {
        $this->objectHelper->unsetNullValues($pases);
        $arrRestar = array();
        $totalDebito = 0;
        $totalCredito = 0;
        $iddocumento = false;
        $isTruncateD = false;
        $isTruncateN = false;

        $debito = array();
        $credito = array();
        $importeCredito = array();
        $importeDebito = array();

        $originalCredito = array();
        $originalDebito = array();
        foreach ($pases as $pos => &$objPase) {
            if (is_null($objPase->idcuenta) || is_null($objPase->importe) || is_null($objPase->idmoneda) ||
                $objPase->importe == 0
            ) {
                unset($pases[$pos]);
            } else {
                $objPase->valororiginal = $objPase->importe;
                $objPase->pocision = $pos;
                $valor = (($objPase->importe * $objPase->porciento) / 100);
                $objPase->valornotruncado = $valor;

                if ($objPase->porciento == 250) {
                    $valor = (($objPase->importe * 50) / 100);
                    $valueR = explode('.', $valor);
                    $valor = (strlen($valueR[1]) == 3) ? LogisticaObjectHelper::__init()->truncateFloat($valor, LogisticaGlobal::FACTOR_REDONDEO) : $valor;
                    $valor *= 2;
                } else {

                    if (!$objPase->conceptoprecio) {
                        if ($objPase->debitoCredito) {
                            $credito[$objPase->valorcontable][] = $objPase;
                        } else {
                            $debito[$objPase->valorcontable][] = $objPase;
                        }
                    }
                }
                /*Anteriormente en el else del if superior*/
                /*else if($objPase->porciento == 75){
                    $valor = (($objPase->importe * 75) / 100);
                    $valueR = explode('.', $valor);
                    $valor = (strlen($valueR[1]) == 3) ? LogisticaObjectHelper::__init()->truncateFloat($valor, LogisticaGlobal::FACTOR_REDONDEO) : $valor;
                    //$valor *= 2;
                }else if($objPase->porciento == 10){
                    $valor = (($objPase->importe * 10) / 100);
                    $valorD = ($objPase->importe * 10) / 100;
                    $valorN = round(($objPase->importe * 90) / 100, LogisticaGlobal::FACTOR_REDONDEO);
                    $valueR = explode('.', $valor);
                    $truncado = (double)LogisticaObjectHelper::__init()->truncateFloat($valor, LogisticaGlobal::FACTOR_REDONDEO);
                    $suma = $truncado + $valorN;
                    if (round($suma,2) != round($objPase->importe,2)) {
                        $truncado = $valor;
                    } else {
                        $isTruncateD = true;
                    }
                    $valor = (strlen($valueR[1]) == 3 && !$isTruncateN) ? $truncado : $valor;
                } else if ($objPase->porciento == 90) {
                    $valor = (($objPase->importe * 90) / 100);
                    $valorD = round(($objPase->importe * 10) / 100, LogisticaGlobal::FACTOR_REDONDEO);
                    $valorN = (($objPase->importe * 90) / 100);
                    $valueR = explode('.', $valor);
                    $truncado = (double)LogisticaObjectHelper::__init()->truncateFloat($valor, LogisticaGlobal::FACTOR_REDONDEO);
                    $suma = $truncado + $valorD;
                    if (round($suma,2) != round($objPase->importe,2)) {
                        $truncado = $valor;
                    } else {
                        $isTruncateN = true;
                    }
                    $valor = (strlen($valueR[1]) == 3 && !$isTruncateD) ? $truncado : $valor;
                }*/
                $objPase->importemb = $objPase->importemo = $objPase->importe = LogisticaObjectHelper::__init()->_round($valor, LogisticaGlobal::FACTOR_REDONDEO);

                if ($objPase->debitoCredito) {
                    $importeCredito[$objPase->valorcontable] += $objPase->importemb;
                    $originalCredito[$objPase->valorcontable] += $objPase->valororiginal;
                } else {
                    $importeDebito[$objPase->valorcontable] += $objPase->importemb;
                    $originalDebito[$objPase->valorcontable] += $objPase->valororiginal;
                }
            }
            if ($objPase->conceptoprecio) {
                $arrRestar[] = $pos;
                $iddocumento = $objPase->iddocumento;
            }
            if ($objPase->debitoCredito) {
                $totalCredito += $objPase->importemb;
            } else {
                $totalDebito += $objPase->importemb;
            }
            if ($objPase->idcuenta) {
                $cuenta = $this->buscarCuentaPorId($objPase->idcuenta);
                $objPase->concatcta = $cuenta->concatcta;
                if ($cuenta->activo == 0) {
                    unset($pases[$pos]);
                }
            } else {
                unset($pases[$pos]);
            }
        }
        if ($objPase->iddocumento) {
            $sqlDif = "select abs(sum(round(dmm.precio*dm.cantidad,2))-
                  sum((round(dm.preciocontable*dm.cantidad,2)+round(ec.valor*dm.cantidad,2)))) as resta
                   from mod_logistica.dat_movmoneda dmm
                  left join mod_logistica.dat_movimiento dm using(idmovimiento)
                  left join mod_logfacturacion.dat_elementocategoria ec on ec.idmovimiento = dm.idmovimiento
                  where dm.iddocumento = {$objPase->iddocumento} and dmm.idmoneda = {$this->dualidad->idmoneda} and ec.valor > 0 and ec.valor is not null";
            $conn = Doctrine_Manager::connection();
            $resto = $conn->execute($sqlDif)->fetchAll(PDO::FETCH_COLUMN)[0];
            if (round(abs($totalDebito - $totalCredito), 2) == $resto && count($arrRestar)) {
                /*$equivalente = $resto/count($posRestar);
                while($resto > 0){

                } */
                $posRestar = count($arrRestar) - 1;
                if ($totalCredito > $totalDebito) {
                    $final = ($pases[$arrRestar[$posRestar]]->debitoCredito) ? $pases[$arrRestar[$posRestar]]->importe - $resto : $pases[$arrRestar[$posRestar]]->importe + $resto;
                    $pases[$arrRestar[$posRestar]]->importemb = $pases[$arrRestar[$posRestar]]->importemo = $pases[$arrRestar[$posRestar]]->importe = $final;
                } else if ($totalCredito < $totalDebito && $posRestar != -1) {
                    $final = ($pases[$arrRestar[$posRestar]]->debitoCredito) ? $pases[$arrRestar[$posRestar]]->importe + $resto : $pases[$arrRestar[$posRestar]]->importe - $resto;
                    $pases[$arrRestar[$posRestar]]->importemb = $pases[$arrRestar[$posRestar]]->importemo = $pases[$arrRestar[$posRestar]]->importe = $final;
                }
            }
        } else if ($iddocumento) {
            $sqlDif = "select abs(sum(round(dmm.precio*dm.cantidad,2))-
                  sum((round(dm.preciocontable*dm.cantidad,2)+round(ec.valor*dm.cantidad,2)))) as resta
                   from mod_logistica.dat_movmoneda dmm
                  left join mod_logistica.dat_movimiento dm using(idmovimiento)
                  left join mod_logfacturacion.dat_elementocategoria ec on ec.idmovimiento = dm.idmovimiento
                  where dm.iddocumento = {$iddocumento} and dmm.idmoneda = {$this->dualidad->idmoneda} and ec.valor > 0 and ec.valor is not null";
            $conn = Doctrine_Manager::connection();
            $resto = $conn->execute($sqlDif)->fetchAll(PDO::FETCH_COLUMN)[0];
            //print_r($resto);die;

            if (round(abs($totalDebito - $totalCredito), 2) == $resto && count($arrRestar)) {
                /*$equivalente = $resto/count($posRestar);
                while($resto > 0){

                } */
                $posRestar = count($arrRestar) - 1;
                if ($totalCredito > $totalDebito) {
                    $final = ($pases[$arrRestar[$posRestar]]->debitoCredito) ? $pases[$arrRestar[$posRestar]]->importe - $resto : $pases[$arrRestar[$posRestar]]->importe + $resto;
                    $pases[$arrRestar[$posRestar]]->importemb = $pases[$arrRestar[$posRestar]]->importemo = $pases[$arrRestar[$posRestar]]->importe = $final;
                } else if ($totalCredito < $totalDebito && $posRestar != -1) {
                    $final = ($pases[$arrRestar[$posRestar]]->debitoCredito) ? $pases[$arrRestar[$posRestar]]->importe + $resto : $pases[$arrRestar[$posRestar]]->importe - $resto;
                    $pases[$arrRestar[$posRestar]]->importemb = $pases[$arrRestar[$posRestar]]->importemo = $pases[$arrRestar[$posRestar]]->importe = $final;
                }
            }
        }
        if (round(abs($totalDebito - $totalCredito), 2) != 0) {
            $diff = round(abs($totalDebito - $totalCredito), 2);
            if ($totalCredito > $totalDebito) {
                foreach ($credito as $valorcontable => $c) {
                    if (count($c) > 1) {
                        if ((double)$originalCredito[$valorcontable] != (double)$importeCredito[$valorcontable]) {
                            $valorTruncar = round((double)$originalCredito[$valorcontable] - (double)$importeCredito[$valorcontable], 2);
                            if (abs($valorTruncar) > 0) {
                                foreach ($c as $p) {
                                    if ($valorTruncar == 0 || $diff == 0) {
                                        continue;
                                    }
                                    $valueR = explode('.', $p->valornotruncado);
                                    if (strlen($valueR[1]) == 3) {
                                        $aux = (double)LogisticaObjectHelper::__init()->truncateFloat($p->valornotruncado, LogisticaGlobal::FACTOR_REDONDEO);
                                        $pases[$p->pocision]->importemb = $pases[$p->pocision]->importemo = $pases[$p->pocision]->importe = $aux;
                                        $diff -= abs(round(round($p->valornotruncado, 2) - $aux, 2));
                                        if ($valorTruncar < 0) {
                                            $valorTruncar += abs(round(round($p->valornotruncado, 2) - $aux, 2));
                                        } else {
                                            $valorTruncar -= abs(round(round($p->valornotruncado, 2) - $aux, 2));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            } else {
                foreach ($debito as $valorcontable => $c) {
                    if (count($c) > 1) {
                        if ((double)$c[0]->valororiginal != (double)$importeDebito[$valorcontable]) {
                            $valorTruncar = round((double)$c[0]->valororiginal - (double)$importeDebito[$valorcontable], 2);
                            if (abs($valorTruncar) > 0) {
                                foreach ($c as $p) {
                                    if ($valorTruncar == 0 || $diff == 0) {
                                        continue;
                                    }
                                    $valueR = explode('.', $p->valornotruncado);
                                    if (strlen($valueR[1]) == 3) {
                                        $aux = (double)LogisticaObjectHelper::__init()->truncateFloat($p->valornotruncado, LogisticaGlobal::FACTOR_REDONDEO);
                                        $pases[$p->pocision]->importemb = $pases[$p->pocision]->importemo = $pases[$p->pocision]->importe = $aux;
                                        $diff -= abs(round(round($p->valornotruncado, 2) - $aux, 2));
                                        if ($valorTruncar < 0) {
                                            $valorTruncar += abs(round(round($p->valornotruncado, 2) - $aux, 2));
                                        } else {
                                            $valorTruncar -= abs(round(round($p->valornotruncado, 2) - $aux, 2));
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        return array_values($pases);
    }

    private function getValorElementosGasto($idDocumento, $campo = 'importecontable', $elemento = true)
    {
        $campoElem = $campo == 'importecontable' ? 'idelementogasto' : 'idelementogastoalt';
        if ($campo == 'ambos') {
            $campo = 'm.importecontable + m.importealternativo';
        } else {
            $campo = "m.{$campo}";
        }
        $sql = "SELECT DISTINCT SUM(round({$campo},{$this->fRedondeo6})) as importe";
        if ($elemento) {
            $sql .= ", coalesce(m.{$campoElem},p.{$campoElem},i.{$campoElem}) as idelemento";
        }
        $sql .= " FROM mod_logistica.dat_movimiento m "
            . " INNER JOIN mod_logistica.dat_producto p ON p.idproducto = m.idproducto"
            . " INNER JOIN mod_datosmaestros.nom_indicador i ON i.idindicador = p.idindicador"
            . " WHERE iddocumento = {$idDocumento}";
        if ($elemento) {
            $sql .= " GROUP BY idelemento"; //i.{$campoElem}, p.{$campoElem},m.{$campoElem}
        }
        return $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_OBJ);
    }

    public function getImporteTotalXMoneda($idDocumento, $monedaContable = false, $valor = false)
    {
        new DatProdFactura();
        new DatCategoriaPrecioFactura();
        $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
        $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;

        $sqlMoneda = "";
        $sqlOtraMoneda = "";
        if ($fac->idmoneda) {
            $sqlMoneda = " and ddcp.idmonedacategoria = {$this->dualidad->idmoneda} ";
            $sqlOtraMoneda = " and (ddcp.idmonedacategoria is null or ddcp.idmonedacategoria = {$fac->idmoneda}) ";
        } else {
            $sqlMoneda = " and (ddcp.idmonedacategoria = {$this->dualidad->idmoneda} or ddcp.idmonedacategoria is null) ";
            $sqlOtraMoneda = " and ddcp.idmonedacategoria is not null and ddcp.idmonedacategoria <> {$this->dualidad->idmoneda} ";
        }
        if ($fac->pagoexterior) {
            $signo = ($valor == 533 || $valor == 534) ? "=" : "<>";
            $sqlMoneda .= " and dcpf.noexterior {$signo} 1 ";
            $sqlOtraMoneda .= " and dcpf.noexterior {$signo} 1 ";
        }
        if ((($monedaContable && $fac->idmoneda) || $fac->pagoexterior == 1) && ($valor == 533 || $valor == 534 || $valor == 536)) {
            $importe = $importe2 = 0;
        } else {
            $importe = $this->doctrineHelper->query(
                "SELECT SUM(COALESCE(dpf.importe,
                abs(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
              THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) -
            ROUND(COALESCE (dpf.importefactmn,0),2))
              )) as importe FROM DatMovimientos m
			INNER JOIN m.DatMovmoneda dmm
			INNER JOIN m.DatProdFactura dpf
			WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$this->dualidad->idmoneda}"
            )->getFirst()->toArray();
            $importe2 = $this->doctrineHelper->query(
                "SELECT sum(COALESCE(dde.importe, 
                        abs(ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
                        THEN def.cantidadfactura - def.cantidad 
                        ELSE def.cantidad END),2) - 
                        ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2))
                        )) as importe
                        FROM DatElementosFactura def
                        INNER JOIN def.DatDesgloselemento dde
                        WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$this->dualidad->idmoneda}"
            )->getFirst()->toArray();
            $importe['importe'] = $importe['importe'] * $tasa;
            $importe2['importe'] = $importe2['importe'] * $tasa;
        }
        if ($monedaContable) {
            $conceptosMN = $this->doctrineHelper->query(
                "SELECT ddcp.concepto,ddcp.porciento,ddcp.idmonedacategoria,
                  round(abs((ddcp.valorcalculo) - COALESCE(ddcp.valorcalculofact,0)),2) as valorcalculo 
                  FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} and ddcp.idmoneda = {$this->dualidad->idmoneda} 
                  {$sqlMoneda}"
            )->toArray();
            $conceptos = $conceptosMN;
        } else {
            $conceptosOtraMoneda = $this->doctrineHelper->query(
                "SELECT ddcp.concepto,ddcp.porciento,ddcp.idmonedacategoria,
                  round(abs((ddcp.valorcalculo*{$tasa}) - COALESCE(ddcp.valorcalculofact*{$tasa},0)),2) as valorcalculo 
                  FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} and ddcp.idmoneda = {$this->dualidad->idmoneda} 
                  {$sqlOtraMoneda}"
            )->toArray();
            $conceptos = $conceptosOtraMoneda;
        }

        $importeParcial = $importe['importe'] + $importe2['importe'];
        $conceptosSuma = 0;
        $conceptosResta = 0;
        foreach ($conceptos as $concp) {
            if ($concp['concepto'] == '+') {
                $conceptosSuma += $concp['valorcalculo'];
            } else {
                $conceptosResta += $concp['valorcalculo'];
            }
        }
        return $importeParcial + $conceptosSuma - $conceptosResta + $this->getMargenProdSinPrecio($idDocumento);
    }

    public function getImporteTotalAmbasMoneda($idDocumento)
    {
        return $this->getImporteTotalXMoneda($idDocumento, false, 533) + $this->getImporteTotalXMoneda($idDocumento, true, 534);
    }

    public function getImporteTotalAmbasMonedaExt($idDocumento)
    {
        return $this->getImporteTotalXMoneda($idDocumento, false, 536) + $this->getImporteTotalXMoneda($idDocumento, true, 537);
    }

    public function getClientes($params)
    {
        $serviceFact = new FacturacionService();
        return $serviceFact->getClientes($params);
    }

    public function getImporteTotalContUsd($idDocumento, $monedaContable = false, $valor = false)
    {
        new DatProdFactura();
        new DatCategoriaPrecioFactura();
        $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
        $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;

        $tipo = "";
        if ($fac->idmoneda || $fac->idmonedaprod) {

            if ($fac->idmoneda) {
                $sqlMoneda = " and ddcp.idmoneda = {$this->dualidad->idmoneda} and ddcp.idmonedacategoria = {$this->dualidad->idmoneda}";
                $sqlOtraMoneda = " and (ddcp.idmonedacategoria is null or ddcp.idmonedacategoria = {$fac->idmoneda}) ";
            } else {
                $sqlMoneda = " and (ddcp.idmoneda = {$this->dualidad->idmoneda} and (ddcp.idmonedacategoria is null or ddcp.idmonedacategoria = {$this->dualidad->idmoneda})
                                    or ddcp.idmoneda <> {$this->dualidad->idmoneda} and ddcp.idmonedacategoria = {$this->dualidad->idmoneda})";
                $sqlOtraMoneda = " and ((ddcp.idmonedacategoria is null and ddcp.idmoneda = {$fac->idmonedaprod}) or ddcp.idmonedacategoria = {$fac->idmonedaprod}) ";
            }
        } else {
            $sqlMoneda = " and (ddcp.idmonedacategoria = {$this->dualidad->idmoneda} or ddcp.idmonedacategoria is null) ";
            $sqlOtraMoneda = " and ddcp.idmonedacategoria is not null and ddcp.idmonedacategoria <> {$this->dualidad->idmoneda} ";
        }
        if ($monedaContable) {
            if ($fac->idmoneda) {
                $importe = $importe2 = array('importe' => 0);
                $conceptosMN = $this->doctrineHelper->query(
                    "SELECT ddcp.concepto,ddcp.porciento,ddcp.idmonedacategoria,
                  (CASE WHEN ddcp.porciento = 1
                   THEN 
                    round(abs((ddcp.valorcalculo) - COALESCE(ddcp.valorcalculofact,0)),2)*{$tasa}
                    ELSE round(abs((ddcp.valorcalculo) - COALESCE(ddcp.valorcalculofact,0)),2) END) as valorcalculo 
                  FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} {$sqlMoneda}"
                )->toArray();
            } else {
                if ($fac->idmonedaprod) {
                    $importe = array('importe' => 0);
                    $tipo = " and dpsn.tipo = 2 ";
                } else {
                    $importe = $this->doctrineHelper->query(
                        "SELECT SUM(COALESCE(dpf.importe,
                abs(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
              THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) -
            ROUND(COALESCE (dpf.importefactmn,0),2))
              )) as importe FROM DatMovimientos m
			INNER JOIN m.DatMovmoneda dmm
			INNER JOIN m.DatProdFactura dpf
			WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$this->dualidad->idmoneda}"
                    )->getFirst()->toArray();
                }
                $importe2 = $this->doctrineHelper->query(
                    "SELECT sum(COALESCE(dde.importe, 
                        abs(ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
                        THEN def.cantidadfactura - def.cantidad 
                        ELSE def.cantidad END),2) - 
                        ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2))
                        )) as importe
                        FROM DatElementosFactura def
                        INNER JOIN def.DatDesgloselemento dde
                        INNER JOIN def.DatProdServNomenclador dpsn
                        WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$this->dualidad->idmoneda} {$tipo}"
                )->getFirst()->toArray();

                $conceptosMN = $this->doctrineHelper->query(
                    "SELECT ddcp.concepto,ddcp.porciento,ddcp.idmonedacategoria,
                  (CASE WHEN ddcp.porciento = 1 and ddcp.idmoneda <> {$this->dualidad->idmoneda}
                   THEN 
                    round(abs((ddcp.valorcalculo) - COALESCE(ddcp.valorcalculofact,0)),2)*{$tasa}
                    ELSE round(abs((ddcp.valorcalculo) - COALESCE(ddcp.valorcalculofact,0)),2) END) as valorcalculo  
                  FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} {$sqlMoneda}"
                )->toArray();
            }


            $conceptos = $conceptosMN;
        } else {
            if ($fac->idmoneda || $fac->idmonedaprod) {
                $importe = $this->doctrineHelper->query(
                    "SELECT SUM(COALESCE(dpf.importe,
                    abs(ROUND(dmm.precio * (CASE WHEN dpf.cantidadfactura > 0 
                  THEN dpf.cantidadfactura - m.cantidad ELSE m.cantidad END),2) -
                ROUND(COALESCE (dpf.importefactmn,0),2))
                  )) as importe FROM DatMovimientos m
                INNER JOIN m.DatMovmoneda dmm
                INNER JOIN m.DatProdFactura dpf
                WHERE m.iddocumento = {$idDocumento} and dmm.idmoneda = {$this->dualidad->idmoneda}"
                )->getFirst()->toArray();
                if ($fac->idmonedaprod && !$fac->idmoneda) {
                    $tipo = " and dpsn.tipo = 1 ";
                }
                $importe2 = $this->doctrineHelper->query(
                    "SELECT sum(COALESCE(dde.importe, 
                        abs(ROUND(dde.preciotarifa * (CASE WHEN def.cantidadfactura > 0 
                        THEN def.cantidadfactura - def.cantidad 
                        ELSE def.cantidad END),2) - 
                        ROUND(COALESCE(dde.preciotarifafactura,0) * COALESCE(def.cantidadfactura,0),2))
                        )) as importe
                        FROM DatElementosFactura def
                        INNER JOIN def.DatDesgloselemento dde
                        INNER JOIN def.DatProdServNomenclador dpsn
                        WHERE def.idfactura = {$idDocumento} and dde.idmoneda = {$this->dualidad->idmoneda} {$tipo}"
                )->getFirst()->toArray();
                if ($fac->idmoneda) {
                    $conceptosOtraMoneda = $this->doctrineHelper->query(
                        "SELECT ddcp.concepto,ddcp.porciento,ddcp.idmonedacategoria,
                  round(abs((ddcp.valorcalculo) - COALESCE(ddcp.valorcalculofact,0)),2) as valorcalculo 
                  FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} {$sqlOtraMoneda}"
                    )->toArray();
                } else {
                    $conceptosOtraMoneda = $this->doctrineHelper->query(
                        "SELECT ddcp.concepto,ddcp.porciento,ddcp.idmonedacategoria,
                  (CASE WHEN ddcp.porciento = 1 and ddcp.idmoneda = {$this->dualidad->idmoneda}
                   THEN 
                    round(abs((ddcp.valorcalculo) - COALESCE(ddcp.valorcalculofact,0)),2)/{$tasa}
                    ELSE round(abs((ddcp.valorcalculo) - COALESCE(ddcp.valorcalculofact,0)),2) END) as valorcalculo 
                  FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} {$sqlOtraMoneda}"
                    )->toArray();
                }
            } else {
                $conceptosOtraMoneda = $this->doctrineHelper->query(
                    "SELECT ddcp.concepto,ddcp.porciento,ddcp.idmonedacategoria,
                  round(abs((ddcp.valorcalculo) - COALESCE(ddcp.valorcalculofact,0)),2) as valorcalculo 
                  FROM DatDesglosecategoriapreciofactura ddcp
                  INNER JOIN ddcp.DatCategoriaPrecioFactura dcpf
                  WHERE dcpf.idfactura = {$idDocumento} {$sqlOtraMoneda}"
                )->toArray();
            }


            $importe['importe'] = $importe['importe'] * $tasa;
            $importe2['importe'] = $importe2['importe'] * $tasa;

            $conceptos = $conceptosOtraMoneda;
        }
        $importeParcial = $importe['importe'] + $importe2['importe'];
        $conceptosSuma = 0;
        $conceptosResta = 0;
        foreach ($conceptos as $concp) {
            if ($concp['concepto'] == '+') {
                $conceptosSuma += $concp['valorcalculo'];
            } else {
                $conceptosResta += $concp['valorcalculo'];
            }
        }
        if (!$monedaContable) {
            $conceptosSuma = $conceptosSuma * $tasa;
            $conceptosResta = $conceptosResta * $tasa;
        }
        return $importeParcial + $conceptosSuma - $conceptosResta + $this->getMargenProdSinPrecio($idDocumento);
    }

    public function importeMediaProductos($idDocumento)
    {
        $fac = Doctrine::getTable('DatDocfactura')->find($idDocumento);
        $tasa = ($fac->factorconvercion) ? $fac->factorconvercion : 1;

        $conn = Doctrine_Manager:: connection();
        $importe = $conn->execute("select sum(coalesce(s.media,0)) as media from (
                select sum(round(coalesce(dpf.mediatotal,0)*dm.cantidad,2)) as media from mod_logfacturacion.dat_prodfactura dpf
                inner join mod_logistica.dat_movimiento dm on dm.idmovimiento = dpf.idmovimiento
                where dm.iddocumento = $idDocumento
                union
                select sum(round(coalesce(dpf.mediatotal,0)*dm.cantidad,2)) as media from mod_logfacturacion.dat_prodservnomenclador dpf
                inner join mod_logfacturacion.dat_elementosfactura dm on dm.idelementofactura = dpf.idelementofactura
                where dm.idfactura = $idDocumento
                union
                select sum(round(coalesce(dpf.mediatotal,0)*dm.cantidad,2)) as media from mod_logfacturacion.dat_activosfactura dpf
                inner join mod_logfacturacion.dat_elementosfactura dm on dm.idelementofactura = dpf.idelementofactura
                where dm.idfactura = $idDocumento
            ) s")
            ->fetchAll(PDO::FETCH_ASSOC);
        return $importe[0]['media'] * $tasa;
    }

}
