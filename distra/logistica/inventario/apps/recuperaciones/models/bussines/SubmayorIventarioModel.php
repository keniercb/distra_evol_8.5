<?php

/**
 * Esta clase se encarga del acceso a datos
 * @copyright XETID
 * @author División de Gestión de Entidades
 * @version 1.0
 */
class SubmayorIventarioModel extends BaseModel
{

    private $serviciosConfiguracion, $documentosHelper, $productosModel;

    public function __construct()
    {
        $this->serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        $this->documentosHelper = LogisticaDocumentosHelper::__init();
        parent::__construct();
        $this->productosModel = new LogisticaProductoModel();
    }

    /**
     * Carga los movimientos de un producto
     * @param array $param Datos del producto del cual se devuelven los movimientos
     * @return array
     */
    public function devolverDetalles_OLD($params)
    {
        //Se quito lo de exception=true de DocumentoLogistica, para que lanzara el error cuando no estuviea configurado
        //el documento primerio en la entidad
        $modelConteo = new DocumentoLogisticaModel(array('alias' => 'inventariogLog'));
        $modelTransf = new DocumentoLogisticaModel(array('alias' => 'transferenciareaLog'));
        $cadenaSignos = LogisticaMovimientoModel::SIGNO_MOV_SUMA . "','" . LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        $idDocConteo = $modelConteo->getIddoc();
        $idDocTransf = $modelTransf->getIddoc();
        if (!$idDocConteo) {
            $docPrim = $this->configuracionHelper->getDocumentsByParams(array('abreviatura' => 'inventariogLog'));
            $str = "<i><b>{$docPrim[0]['denominacion']}</b></i>";
            throw new LogisticaException('LOG_LB_DOC_001', null, null, $str);
        } elseif (!$idDocTransf) {
            $docPrim = $this->configuracionHelper->getDocumentsByParams(array('abreviatura' => 'transferenciareaLog'));
            $str = "<i><b>{$docPrim[0]['denominacion']}</b></i>";
            throw new LogisticaException('LOG_LB_DOC_001', null, null, $str);
        }
        $cadenaIddoc = $idDocConteo . "," . $idDocTransf;
        $result = $this->productosModel->getMovimientoModel()->devolverMovimientos($params, true); //631
        $aux = $this->devolverDetallesAuxiliar($params, $result, $cadenaSignos, $cadenaIddoc);
        //print_r($aux->fetchArray());die;
        $datosmov = LogisticaDoctrineHelper::__init()->addQueryLimits($result, $params)->fetchArray();
        $facturacion = LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_FAC);
        if($facturacion){
            $serviceFac = new FacturacionService();
            $objIddocFac = $this->documentosHelper->devuelveIddocByIdEstructura(
                'facturaLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
            );
        }
        foreach ($datosmov as $index => $value) {
            $tipodoc = $this->serviciosConfiguracion->getTipoDocumentoById($value['iddoc']);
            $datosmov[$index]['abreviatura'] = $tipodoc->abreviatura;
            $datosmov[$index]['denomdocumento'] = $tipodoc->sigla;
            if ($objIddocFac->iddoc == $value['iddoc']) {
                $numeroFactura = $serviceFac->getNumeroFactura($value['iddocumento']);
                $datosmov[$index]['numerodocumento'] = $numeroFactura;
            }
        }

        return array(
            'datos' => $modelConteo->cargarClientesDocumentos($datosmov),
            'cantidad' => $aux->count(),
            'inventarioLog' => $modelConteo->getIddoc(),
            'transferenciareaLog' => $modelTransf->getIddoc(),
            'tipoDoc' => $this->serviciosConfiguracion->documentosPorSubsistemaEntidad(
                LogisticaGlobal::SUBSISTEMA_INV, $this->global->Estructura->idestructura
            )
        );
    }

    /**
     * Carga los movimientos de un producto
     * @param array $param Datos del producto del cual se devuelven los movimientos
     * @return array
     */
    public function devolverDetalles($params)
    {
        $iddocConduce = $this->documentosHelper->devuelveIddocByIdEstructura(
            'conduceLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );
        $iddoc = 'null';
        if ($iddocConduce->iddoc) {
            $iddoc = $iddocConduce->iddoc;
        }
        $fecha1 = new DateTime($params['desde']);
        $fecha2 = new DateTime($params['hasta']);
        $params['desde'] = $params['desde'] ? "'" . $fecha1->format('d/m/Y') . "'" : 'null';
        $params['hasta'] = $params['hasta'] ? "'" . $fecha2->format('d/m/Y') . "'" : 'null';
        $params['iddoc'] = implode(',', $params['iddoc']);
        $params['iddoc'] = $params['iddoc'] ? "'{" . $params['iddoc'] . "}'" : 'null';
        $params['idlote'] = $params['idlote'] ? $params['idlote'] : 'null';
        $params['idnroserie'] = $params['idnroserie'] ? $params['idnroserie'] : 'null';
        $params['idpartida'] = $params['idpartida'] ? $params['idpartida'] : 'null';
        /*
print_r(     "select * from mod_loginventario.f_recsubmov ({$params['idproducto']}, "
            . "'{990000000253, 990000000254}', null, {$iddoc}, {$params['desde']}, {$params['hasta']}, "
            . "{$params['iddoc']}, {$params['idlote']}, {$params['idnroserie']}, {$params['idpartida']},null,null) q "
            . "offset {$params['start']} limit {$params['limit']}");die;*/
        
        $datosmov = Doctrine_Manager::connection()->fetchAll(
            "select * from mod_loginventario.f_recsubmov ({$params['idproducto']}, "
            . "'{990000000253, 990000000254}', null, {$iddoc}, {$params['desde']}, {$params['hasta']}, "
            . "{$params['iddoc']}, {$params['idlote']}, {$params['idnroserie']}, {$params['idpartida']},null,null) q "
            . "offset {$params['start']} limit {$params['limit']}"
        );
        $cantidad = Doctrine_Manager::connection()->fetchAll(
            "select count(*) from mod_loginventario.f_recsubmov ({$params['idproducto']}, "
            . "'{990000000253, 990000000254}', null, {$iddoc}, {$params['desde']}, {$params['hasta']}, "
            . "{$params['iddoc']}, {$params['idlote']}, {$params['idnroserie']}, {$params['idpartida']},null,null)"
        );
        foreach ($datosmov as $index => $value) {
            if ($value['q']) {
                $datosmov[$index] = (array) json_decode($value['q']);
            }
        }

        return array(
            'datos' => $datosmov,
            'cantidad' => $cantidad[0]['count'],
            'iddoc' => $params['iddoc'],
            'tipoDoc' => $this->serviciosConfiguracion->documentosPorSubsistemaEntidad(
                LogisticaGlobal::SUBSISTEMA_INV, $this->global->Estructura->idestructura
            )
        );
    }

    /**
     * Para reducir la complejidad ciclomatica de la funcion devolverDetalles()
     * @return array
     */
    public function devolverDetallesAuxiliar($params, $result, $cadenaSignos, $cadenaIddoc)
    {
        $iddocConduce = $this->documentosHelper->devuelveIddocByIdEstructura(
            'conduceLog', $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_FAC
        );

        if (!$params['idpartida'] && !$params['idnroserie'] && !$params['idlote']) {
            $result->addSelect(
                "doc.nrodoc as numerodocumento, doc.fechacontable as fecha, doc.iddoc as iddoc, "
                . "doc.estado as estado, "
                . "(case when (mov.signo ='+' and doc.idoperacion not in (990000000253, 990000000254)) "
                . "then round(mov.cantidad,6) end) as entradacant,"

                . "(case when (mov.signo ='-' and doc.idoperacion not in (990000000253, 990000000254)) "
                . "then round(mov.cantidad,6) end) as salidacant,"

                . "(case when mov.signo ='+' then round(mov.importecontable,2) end) as entradaimp,"
                . "(case when mov.signo ='+' then round(mov.importealternativo,2) end) as entradaimpalt,"

                . "(case when mov.signo ='-' then round(mov.importecontable,2) end) as salidaimp,"
                . "(case when mov.signo ='-' then round(mov.importealternativo,2) end) as salidaimpalt,"

                . "round(mov.importetotal,2) as importetotal,"
                . "round(mov.existenciaactual,6) as existenciaactual,"

                . "round(mov.preciopromedio,6) as preciopromedio,"
                . "round(mov.importetotalalt,2) as importetotalalt,"

                . "round(mov.preciopromalt,6) as preciopromedioalt,"
            );
        } else {
            $this->addDqlProducto($result, $params);
        }
        $result->innerJoin("mov.DatProductoLogistica prod")
            ->innerJoin("mov.DatDocumento doc")
            ->andWhere("doc.cronologia > ?", array(0))
            ->andWhere("( mov.signo IN ('{$cadenaSignos}') OR doc.iddoc IN ({$cadenaIddoc}))")
            ->orderBy("doc.cronologia ASC"); //141
        if($iddocConduce->iddoc){
            $result->andWhere("doc.iddoc <> ?", array($iddocConduce->iddoc));
        }

        DatDocumentoCliente::addDqlClientesDocumentos($result, 'doc', 'cte');
        if ($params['desde']) {
            $result->addWhere(
                "doc.fechacontable >= ? ", array($params['desde'])
            );
        }
        if ($params['hasta']) {
            $result->addWhere(
                "doc.fechacontable <= ? ", array($params['hasta'])
            );
        }
        if ($params['iddoc']) {
            $result->andWhereIn("doc.iddoc", $params['iddoc']);
        }

        return $result;
    }

    /**
     * Devuelve, en la Busqueda avanzada, una lista de los tipos de documento existentes
     * @return array
     */
    public function devolverTipoDocumento()
    {
        $inventario = ServiciosConfiguracionGeneralHelper::__init()
            ->documentosPorSubsistemaEntidad(
                LogisticaGlobal::SUBSISTEMA_INV, $this->global->Estructura->idestructura
            ); 
         $facturacion = ServiciosConfiguracionGeneralHelper::__init()
            ->documentosPorSubsistemaEntidad(
                LogisticaGlobal::SUBSISTEMA_FAC, $this->global->Estructura->idestructura
            );
        foreach($facturacion as $fact => $pos) {
           if ($pos->sigla == 'compdevLog' || $pos->sigla == 'compventaLog') {
               array_push($inventario, $facturacion[$fact]);    
           }
        }

        return $inventario;

    }

    /**
     * Adiciona datos del numero de serie o lote o municion al dql que devuelve los movimientos del producto
     * @return array
     */
    public function addDqlProducto($dql, $params)
    {
        if ($params['idnroserie']) {
            new DatMovnroserie();
            $dql->addSelect(
                "doc.nrodoc as numerodocumento, doc.fechacontable as fecha, doc.iddoc as iddoc, "
                . "doc.estado as estado, "
                . "(case when mov.signo ='+' then round(1) end) as entradacant,"
                . "(case when mov.signo ='-' then round(1) end) as salidacant,"
                . "(case when mov.signo ='+' then round(mov.importecontable,2) end) as entradaimp,"
                . "(case when mov.signo ='-' then round(mov.importecontable,2) end) as salidaimp,"
                . " round(mov.importetotal,2) as importetotal,"
                . "1 as existenciaactual,"
                . " round(mov.preciopromedio,6) as preciopromedio"
            )
                ->leftJoin("mov.DatMovnroserie dmns")
                ->andWhere("dmns.idnroserie = ?", $params['idnroserie']);
        }

        if ($params['idpartida']) {
            new DatMovproductomunic();
            new DatMovtransferenciamunic();
            //print_r($params['idpartida']);die;
            //todos los calculos estan con preciocontable hay que cambiarlo a precio promedio
            $dql->addSelect(
                "doc.nrodoc as numerodocumento, doc.fechacontable as fecha, doc.iddoc as iddoc, "
                . "doc.estado as estado, "
                . "(case when mov.signo ='+' then round(dmpm.cantidad,6) else " . "
                (case when dmtm.idmovimiento = mov.idmovimiento then " .
                "(SELECT ROUND(SUM(dmtm1.cantidad),6) FROM DatMovtransferenciamunic dmtm1 WHERE " .
                "dmtm1.idpartidadestino = {$params['idpartida']} and dmtm1.idmovimiento = mov.idmovimiento) end) end)
                 as entradacant,(case when mov.signo ='-' then round(dmpm.cantidad,6) else "
                ."(case when dmtm.idmovimiento = mov.idmovimiento then "
                ."(SELECT ROUND(dmtm2.cantidad,6) FROM DatMovtransferenciamunic dmtm2 WHERE "
                ."dmtm2.idpartidaorigen = {$params['idpartida']} and dmtm2.idmovimiento = mov.idmovimiento) end)
                end) as salidacant, (case when mov.signo ='+' then round(dmpm.cantidad*mov.preciocontable,2) else "
                . "(case when dmtm.idmovimiento = mov.idmovimiento then "
                ."(SELECT ROUND(SUM(dmtm3.cantidad*mov.preciocontable),2) FROM DatMovtransferenciamunic dmtm3 WHERE "
                ."dmtm3.idpartidadestino = {$params['idpartida']} and dmtm3.idmovimiento = mov.idmovimiento) end)
                 end) as entradaimp, (case when mov.signo ='-' then round(dmpm.cantidad*mov.preciocontable,2) else "
                ."(case when dmtm.idmovimiento = mov.idmovimiento then "
                ."(SELECT ROUND(SUM(dmtm4.cantidad*mov.preciocontable),2) FROM DatMovtransferenciamunic dmtm4 WHERE "
                ."dmtm4.idpartidaorigen = {$params['idpartida']} and dmtm4.idmovimiento = mov.idmovimiento) end)
                end) as salidaimp, round(((SELECT COALESCE(SUM(dmpm1.cantidad*mov.preciocontable),0) "
                ."FROM DatMovproductomunic dmpm1 "
                . " WHERE dmpm1.idproductomunic = {$params['idpartida']} and dmpm1.idmovimiento in ("
                ."SELECT dmpm3.idmovimiento FROM DatMovproductomunic dmpm3 "
                ."INNER JOIN dmpm3.DatMovimientos m "
                ."INNER JOIN m.DatDocumento datd "
                ."WHERE m.signo = '+' AND m.cronologia <= mov.cronologia"
                ." and datd.estado in (3,4))"
                .")-(SELECT COALESCE(SUM(dmpm2.cantidad*mov.preciocontable),0) FROM DatMovproductomunic dmpm2 " .
                " WHERE dmpm2.idproductomunic = {$params['idpartida']} and dmpm2.idmovimiento in ("
                ."SELECT dmpm4.idmovimiento FROM DatMovproductomunic dmpm4 "
                ."INNER JOIN dmpm4.DatMovimientos m1 "
                ."INNER JOIN m1.DatDocumento datd1 "
                ."WHERE m1.signo = '-' AND m1.cronologia <= mov.cronologia "
                ." and datd1.estado in (3,4))"
                ." )-(SELECT COALESCE(SUM(dmtm7.cantidad * mov.preciocontable), 0) FROM DatMovtransferenciamunic dmtm7 "
                ."WHERE dmtm7.idpartidaorigen = {$params['idpartida']} AND dmtm7.idmovimiento IN ("
                ."SELECT dmtm8.idmovimiento FROM DatMovtransferenciamunic dmtm8 "
                ."INNER JOIN dmtm8.DatMovimientos m5 "
                ."INNER JOIN m5.DatDocumento datd5 "
                ."WHERE m5.cronologia <= mov.cronologia and datd5.estado in (3, 4)))"
                ."+(SELECT COALESCE(SUM(dmtm9.cantidad * mov.preciocontable), 0) FROM DatMovtransferenciamunic dmtm9 " .
                "WHERE dmtm9.idpartidadestino = {$params['idpartida']} AND dmtm9.idmovimiento IN (" .
                "SELECT dmtm10.idmovimiento FROM DatMovtransferenciamunic dmtm10 " .
                "INNER JOIN dmtm10.DatMovimientos m6 " . "INNER JOIN m6.DatDocumento datd6 " .
                "WHERE m6.cronologia <= mov.cronologia and datd6.estado in (3, 4)))"

                ."),2) as importetotal,"

                ." round(((SELECT COALESCE(SUM(dmpm5.cantidad),0) FROM DatMovproductomunic dmpm5 "
                ." WHERE dmpm5.idproductomunic = {$params['idpartida']} and dmpm5.idmovimiento in ("
                ."SELECT dmpm7.idmovimiento FROM DatMovproductomunic dmpm7 "
                . "INNER JOIN dmpm7.DatMovimientos m2 "
                ."INNER JOIN m2.DatDocumento datd2 "
                ."WHERE m2.signo = '+' AND m2.cronologia <= mov.cronologia"
                ." and datd2.estado in (3,4))"
                .")-(SELECT COALESCE(SUM(dmpm6.cantidad),0) FROM DatMovproductomunic dmpm6 "
                ." WHERE dmpm6.idproductomunic = {$params['idpartida']} and dmpm6.idmovimiento in ("
                ."SELECT dmpm8.idmovimiento FROM DatMovproductomunic dmpm8 " . "INNER JOIN dmpm8.DatMovimientos m3 "
                ."INNER JOIN m3.DatDocumento datd3 " . "WHERE m3.signo = '-' AND m3.cronologia <= mov.cronologia "
                ." and datd3.estado in (3,4))" . " )"

                ."+(SELECT COALESCE(SUM(dmtm11.cantidad),0) FROM DatMovtransferenciamunic dmtm11 " .
                "WHERE dmtm11.idpartidadestino = {$params['idpartida']} and dmtm11.idmovimiento in (" .
                "SELECT dmtm12.idmovimiento FROM DatMovtransferenciamunic dmtm12 " .
                "INNER JOIN dmtm12.DatMovimientos m7 " . "INNER JOIN m7.DatDocumento datd7 " .
                "WHERE m7.cronologia <= mov.cronologia and datd7.estado in (3,4)))"

                ."-(SELECT COALESCE(SUM(dmtm5.cantidad),0) FROM DatMovtransferenciamunic dmtm5 "
                ."WHERE dmtm5.idpartidaorigen = {$params['idpartida']} and dmtm5.idmovimiento in ("
                ."SELECT dmtm6.idmovimiento FROM DatMovtransferenciamunic dmtm6 "
                ."INNER JOIN dmtm6.DatMovimientos m4 "
                ."INNER JOIN m4.DatDocumento datd4 "
                ."WHERE m4.cronologia <= mov.cronologia and datd4.estado in (3,4))"
                .")),6) as existenciaactual,"

                . " round(mov.preciocontable,6) as preciopromedio"
            )
                ->leftJoin("mov.DatMovproductomunic dmpm")
                ->leftJoin("mov.DatMovtransferenciamunic dmtm")
                ->leftJoin("dmpm.DatProductomunic dpm")
                ->andWhere("dmpm.idproductomunic = ? or dmtm.idpartidaorigen = ?", array($params['idpartida'],
                    $params['idpartida']));
        }

        if ($params['idlote']) {
            new DatMovlote();
            $dql->addSelect(
                "doc.nrodoc as numerodocumento, doc.fechacontable as fecha, doc.iddoc as iddoc, "
                . "doc.estado as estado, "
                . "(case when mov.signo ='+' then round(dml.cantidad,6) end) as entradacant,"
                . "(case when mov.signo ='-' then round(dml.cantidad,6) end) as salidacant,"
                . "(case when mov.signo ='+' then round(mov.importecontable,2) end) as entradaimp,"
                . "(case when mov.signo ='-' then round(mov.importecontable,2) end) as salidaimp,"
                . " round(mov.importetotal,2) as importetotal,"
                . "round(dl.existencia,6) as existenciaactual,"
                . " round(mov.preciopromedio,6) as preciopromedio"
            )
                ->leftJoin("mov.DatMovlote dml")
                ->leftJoin("dml.DatLote dl")
                ->andWhere("dml.idlote = ?", $params['idlote']);
        }
    }

    /**
     * Carga los productos del grid principal
     * @param $parametros
     * @return array
     */
    public function cargarproductos_OLD($parametros)
    {
        if(empty($parametros['idestructura'])){
            return array();
        }
        $objconfiginv = new ConfiguracioninventarioService();
        $datosprod['confinventario'] = $objconfiginv->utilizarUbicacion($this->global->Estructura->idestructura);
        $datosprod = $this->productosModel->cargarProductos($parametros, false,
            array('class' => $this, 'method' => 'testDecorator', 'params' => $parametros));
        $datosprod = $this->cargarImagenes($datosprod);
        //$datosprod = $this->cargarDatosCuentasandEspecialidad($datosprod);
        return $datosprod;
    }

    /**
     * Carga los productos del grid principal
     * @param $parametros
     * @return array
     */
    public function cargarproductos($parametros)
    {
        if (empty($parametros['idestructura'])) {
            return array();
        }
        $objconfiginv = new ConfiguracioninventarioService();
        $datosprod['confinventario'] = $objconfiginv->utilizarUbicacion($this->global->Estructura->idestructura);
        //$parametros['criterio'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
        $parametros['codigo'] = $parametros['codigo'] ? "'" . $parametros['codigo'] . "'" : 'null';
        $parametros['codigoproveedor'] = $parametros['codigoproveedor'] ? "'" . $parametros['codigoproveedor'] . "'" : 'null';
        $parametros['denominacion'] = $parametros['denominacion'] ? "'" . $parametros['denominacion'] . "'" : 'null';
        $parametros['tipoproducto'] = isset($parametros['tipoproducto']) ? $parametros['tipoproducto'] : 'null';
        $parametros['idnaturaleza'] = is_numeric($parametros['idnaturaleza']) ? $parametros['idnaturaleza'] : 'null';
        $parametros['idmarca'] = is_numeric($parametros['idmarca']) ? $parametros['idmarca'] : (($parametros['marca'] && is_numeric($parametros['marca'])) ? $parametros['marca'] : 'null');
        $parametros['idmodelo'] = is_numeric($parametros['idmodelo']) ? $parametros['idmodelo'] : (($parametros['modelo'] && is_numeric($parametros['modelo'])) ? $parametros['modelo'] : 'null');
        $parametros['idcategoria'] = is_numeric($parametros['idcategoria']) ? $parametros['idcategoria'] : 'null';
        $parametros['idclasificacioncontable'] = is_numeric($parametros['idclasificacioncontable']) ? $parametros['idclasificacioncontable'] : 'null';
        $parametros['idarea'] = is_numeric($parametros['idarea']) ? $parametros['idarea'] : 'null';
        $parametros['condisponible'] = $parametros['condisponible'] ? 1 : 'null';
        $parametros['conexistencia'] = $parametros['conexistencia'] ? 1 : 'null';
        $parametros['criterioavan'] = $parametros['criterioavan'] ? $parametros['criterioavan'] : 'null';
        $parametros['cantidad'] = is_numeric($parametros['cantidad']) ? $parametros['cantidad'] : 'null';

        $fecha1 = new DateTime($parametros['desde']);
        $fecha2 = new DateTime($parametros['hasta']);
        $parametros['desde'] = $parametros['desde'] ? "'" . $fecha1->format('d/m/Y') . "'" : 'null';
        $parametros['hasta'] = $parametros['hasta'] ? "'" . $fecha2->format('d/m/Y') . "'" : 'null';
        $parametros['idmonedacontable'] = is_numeric($parametros['idmonedacontable']) ? $parametros['idmonedacontable'] : 'null';
        $parametros['idmonedaalternativa'] = is_numeric($parametros['idmonedaalternativa']) ? $parametros['idmonedaalternativa'] : 'null';
        if($parametros['criterio'] && count($parametros['criterio']) > 0){
            $parametros['codigo'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
            $parametros['codigoproveedor'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
            $parametros['denominacion'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
        }
       
      $query =   "select * from mod_loginventario.f_recsub ({$parametros['idestructura']}, "
            . "{$parametros['codigo']}, {$parametros['codigoproveedor']}, {$parametros['denominacion']}, "
            . "{$parametros['tipoproducto']}, {$parametros['idnaturaleza']}, {$parametros['idcategoria']}, "
            . "{$parametros['idclasificacioncontable']}, {$parametros['idarea']}, {$parametros['condisponible']}, "
            . "{$parametros['conexistencia']}, null, {$parametros['cantidad']}, "
            . "{$parametros['desde']}, {$parametros['hasta']}, {$parametros['idmonedacontable']}, {$parametros['idmonedaalternativa']}, {$parametros['idmarca']}, {$parametros['idmodelo']},{$parametros[  'limit']}, {$parametros['start']},{$parametros['criterioavan']} ) q"
        ;

        if (!empty($parametros['hasta']) && $parametros['hasta'] !== 'null') {
        $query = str_replace('f_recsub', 'f_recsub_v2', $query);
    }
        $datosprod['datos'] = Doctrine_Manager::connection()->fetchAll($query);

        $datosprod['cantidad'] = $datosprod['datos'][0]['total'];
        $datosprod['fecha'] = LogisticaFechasHelper::__init()->getFechaDeposito($parametros['idestructura']);
        //...
        $datosprod = $this->cargarImagenes($datosprod);
        $datosprod = $this->cargarTarjetaActiva($datosprod);
        //$datosprod = $this->cargarDatosCuentasandEspecialidad($datosprod);
        //print_r($parametros);die;
        return $datosprod;
    }/**
     * Carga los productos del grid principal
     * @param $parametros
     * @return array
     */
    public function exportarConsumoPorductos($parametros)
    {
        if (empty($parametros['idestructura'])) {
            return array();
        }
        $objconfiginv = new ConfiguracioninventarioService();
        $datosprod['confinventario'] = $objconfiginv->utilizarUbicacion($this->global->Estructura->idestructura);
        
        //$parametros['criterio'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
        $parametros['codigo'] = $parametros['codigo'] ? "'" . $parametros['codigo'] . "'" : 'null';
        $parametros['codigoproveedor'] = $parametros['codigoproveedor'] ? "'" . $parametros['codigoproveedor'] . "'" : 'null';
        $parametros['denominacion'] = $parametros['denominacion'] ? "'" . $parametros['denominacion'] . "'" : 'null';
        $parametros['tipoproducto'] = 'null';
        $parametros['idnaturaleza'] = is_numeric($parametros['idnaturaleza']) ? $parametros['idnaturaleza'] : 'null';
        $parametros['idmarca'] = is_numeric($parametros['idmarca']) ? $parametros['idmarca'] : (($parametros['marca'] && is_numeric($parametros['marca'])) ? $parametros['marca'] : 'null');
        $parametros['idmodelo'] = is_numeric($parametros['idmodelo']) ? $parametros['idmodelo'] : (($parametros['modelo'] && is_numeric($parametros['modelo'])) ? $parametros['modelo'] : 'null');
        $parametros['idcategoria'] = is_numeric($parametros['idcategoria']) ? $parametros['idcategoria'] : 'null';
        $parametros['idclasificacioncontable'] = is_numeric($parametros['idclasificacioncontable']) ? $parametros['idclasificacioncontable'] : 'null';
        $parametros['idarea'] = is_numeric($parametros['idarea']) ? $parametros['idarea'] : 'null';
        $parametros['condisponible'] = $parametros['condisponible'] ? 1 : 'null';
        $parametros['conexistencia'] = $parametros['conexistencia'] ? 1 : 'null';
        $parametros['criterioavan'] = $parametros['criterioavan'] ? $parametros['criterioavan'] : 'null';
        $parametros['cantidad'] = is_numeric($parametros['cantidad']) ? $parametros['cantidad'] : 'null';
		
		$parametros['hasta'] = $parametros['hasta'] ? $parametros['hasta'] : date('m/d/Y'); 
		//print_r($parametros);die;
        $fecha2 = new DateTime($parametros['hasta']);
		$parametros['hasta'] = $parametros['hasta'] ? "'" . $fecha2->format('d/m/Y') . "'" : 'null';
        
		$newDate = clone $fecha2;
        $newDate = $newDate->modify("-30 day");
		if($parametros['desde']){
				$fecha1 = new DateTime($parametros['desde']);
		}
		$parametros['desde'] = $parametros['desde'] ? "'" . $fecha1->format('d/m/Y') . "'" : "'" . $newDate->format('d/m/Y') . "'";
		$parametros['idmonedacontable'] = is_numeric($parametros['idmonedacontable']) ? $parametros['idmonedacontable'] : 'null';
        $parametros['idmonedaalternativa'] = is_numeric($parametros['idmonedaalternativa']) ? $parametros['idmonedaalternativa'] : 'null';
        
		
		if($parametros['criterio'] && count($parametros['criterio']) > 0){
            $parametros['codigo'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
            $parametros['codigoproveedor'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
            $parametros['denominacion'] = $parametros['criterio'] ? "'" . $parametros['criterio'] . "'" : 'null';
        }
		$SQL = "select * from mod_loginventario.f_movimientosperiodo ({$parametros['idestructura']}, "
            . "{$parametros['codigo']}, {$parametros['codigoproveedor']}, {$parametros['denominacion']}, "
            . "{$parametros['tipoproducto']}, {$parametros['idnaturaleza']}, {$parametros['idcategoria']}, "
            . "{$parametros['idclasificacioncontable']}, {$parametros['idarea']}, {$parametros['condisponible']}, "
            . "{$parametros['conexistencia']}, {$parametros['criterioavan']}, {$parametros['cantidad']}, "
            . "{$parametros['desde']}, {$parametros['hasta']}, {$parametros['idmonedacontable']}, {$parametros['idmonedaalternativa']}, {$parametros['idmarca']}, {$parametros['idmodelo']},{$parametros[  'limit']}, {$parametros['start']} ) q";
		$datosprod['datos'] = Doctrine_Manager::connection()->fetchAll($SQL);
		$datosprod['cantidad'] = $datosprod['datos'][0]['total'];
        
		unlink("tmp/");
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $columns = array(
            array('header' => '<b>C&oacute;digo</b>', 'dataIndex' => 'codproveedor'),
            array('header' => '<b>Denominaci&oacute;n</b>', 'dataIndex' => 'denomprod'),
            array('header' => '<b>UM</b>', 'dataIndex' => 'um'),
            array('header' => '<b>Saldo inicial</b>', 'dataIndex' => 'saldoinicio'),
            array('header' => '<b>Entradas</b>', 'dataIndex' => 'entradas'),
            array('header' => '<b>Transferencias internas</b>', 'dataIndex' => 'transint'),
            array('header' => '<b>Transferencias externas</b>', 'dataIndex' => 'transext'),
            array('header' => '<b>Ajustes</b>', 'dataIndex' => 'ajustes'),
            array('header' => '<b>Salidas</b>', 'dataIndex' => 'salidas'),
            array('header' => '<b>Saldo final</b>', 'dataIndex' => 'saldo'),
        );
        $excel->writeData($datosprod['datos'], $columns);
        $excel->close();
        return '/logistica/inventario/recuperaciones/' . $fichero;
    }

    public function testDecorator($dql, $parametros)
    {
        //Obtener Fecha de emision de la tarjeta
        $dqlCrono = "SELECT min( _dd.cronologia) FROM DatDocumento _dd INNER JOIN _dd.DatMovimientos _dm "
            . "WHERE _dm.idproducto = p.idproducto and _dd.cronologia > 0";
        $dql->addSelect(
            "(SELECT dd.fechacontable FROM DatDocumento dd WHERE dd.cronologia = ($dqlCrono) limit 1) as fechaemision"
        );
        $this->cargarProductosAux($dql, $parametros);
    }

    public function cargarProductosAux(Doctrine_Query $dql, $parametros)
    {
        if ($parametros['criterioavan'] && $parametros['cantidad']) {
            $signo = '=';
            if ($parametros['criterioavan'] == 1) {
                $signo = '<';
            }
            if ($parametros['criterioavan'] == 3) {
                $signo = '>';
            }
            $sql = "select m.idproducto from mod_logistica.dat_movimiento m inner join mod_logistica.dat_producto p "
                . "on p.idproducto = m.idproducto inner join mod_logistica.dat_documento d "
                . "on d.iddocumento = m.iddocumento where p.idestructura = {$parametros['idestructura']} "
                . "and p.cronologia > 0 and d.cronologia > 0 group by m.idproducto "
                . "having count(m.idmovimiento) {$signo} {$parametros['cantidad']}";
            $data = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN);
            $dql->andWhereIn('p.idproducto', $data);
        }
    }

    public function getCantMovimientoProducto($idproducto)
    {
        $query = new Doctrine_Query();
        return $query->select("COUNT(mov.idmovimiento) as cantmovimientos")
            ->from('DatMovimientos mov')
            ->innerJoin('mov.DatDocumento doc')
            ->where('idproducto = ? AND signo <> ?', array($idproducto, 'N'))
            ->andWhere("doc.cronologia > ?", array(0))
            ->fetchArray();
    }

    public function cargarImagenes($datosprod)
    {
        foreach ($datosprod['datos'] as &$value) {
            if ($value['q']) {
                $value = (array) json_decode($value['q']);
            }
            $value['imagenesIndicador'] = array();
            $idImagenes = $this->getIdImagenIndicador($value['idindicador']);
            foreach ($idImagenes as $idImagen) {
                $dImagen = LogisticaImagenHelper::__init()->obtenerImagenDb($idImagen['idimagen']);
                array_push(
                    $value['imagenesIndicador'],
                    array(
                        'idimagen' => $idImagen['idimagen'],
                        'src' => $dImagen
                    )
                );
            }
            //cargar especialidad
            $datosEspecialidad = $this->configuracionHelper->obtenerEspecialidadPorId($value['idespecialidad']);
            $value['especialidad'] = $datosEspecialidad[0]->denespecialidad;
        }
        return $datosprod;
    }

    public function cargarTarjetaActiva($datosprod)
    {
        foreach ($datosprod['datos'] as &$value) {
            $activo = $this->doctrineHelper->getConnection()->execute(
                "SELECT count(idproducto) FROM mod_logistica.dat_productoinactivo "
                . "WHERE idproducto = {$value['idproducto']}"
            )->fetchAll(PDO::FETCH_COLUMN);
            $value['tarjetaactiva'] = ($activo[0]) ? 0 : 1;
        }
        return $datosprod;
    }

    public function getIdImagenIndicador($idindicador)
    {
        $conn = Zend_Registry::get('conexion');
        return $conn->execute(
            "SELECT di.idimagen FROM mod_datosmaestros.dat_imagenindicador di "
            . "WHERE di.idindicador = $idindicador"
        );
    }

    /**
     * Carga las ubicacion de lote, nroserie, partidas
     * @return string
     */
    public function cargarUbicaciones($params)
    {
        $ubicacion = new UtilesubicacionService();
        return $ubicacion->cargarUbicacionesXTipoProducto($params);
    }

    /**
     * Carga los datos del grid en Ubicacion por area
     * @return array
     */
    public function datosGridUbicacionPorArea($params)
    {
        $ubicacion = new UtilesubicacionService();
        $result = $ubicacion->cargarUbicacionesProducto($params, true);
        $cantidad = count($result);
        $array = $result->fetchArray();
        /*foreach ($array as &$ar) {
            $formato = $this->serviciosConfiguracion->buscarFormatoPorID($ar['idformato']);//->separador
            $arbol = $ubicacion->getDatosArbolDenominacion($ar['idubic'], '<', '>');
            $ar['ubicacion'] = implode($formato->separador, $arbol);
        }*/
        return array('datos' => $array, 'cantidad' => $cantidad);
    }

    public function cargarDatosCuentasandEspecialidad($datosprod)
    {
        $cuentas = array();
        foreach ($datosprod['datos'] as $index => &$value) {

            ($value['cuentaalt']) ? $cuentas = array($value['cuenta'], $value['cuentaalt']) :
                $cuentas = array($value['cuenta']);
            $datosCuentas = $this->contabilidadHelper->obtenerCuentasPorId($cuentas);
            $datosEspecialidad = $this->configuracionHelper->obtenerEspecialidadPorId($value['idespecialidad']);
            $value['nomcuenta'] = $datosCuentas[0]->text;
            $value['especialidad'] = $datosEspecialidad[0]->denespecialidad;
            if ($value['cuentaalt']) {
                $value['nomcuentaalt'] = $datosCuentas[1]->text;
            }
        }
        return $datosprod;
    }

    public function validarCierreDeposito($iddeposito)
    {
        /**
         * Validar documentos pendientes
         */
        $cantDocs = Doctrine_Query::create()->from('DatDocumento d')->select('d.iddocumento')
            ->where('d.idestructuracomun = ? and d.cronologia = 0', array($iddeposito))->count();
        if ($cantDocs > 0) {
            throw new ZendExt_Exception('LOG_LB_COMUN_001');
        }
        /**
         * Validar productos con existencias
         */
        $cantProds = Doctrine_Query::create()->from('DatProductoLogistica p')->select('p.idproducto')
            ->where('p.idestructura = ? and p.cantidad <> 0', array($iddeposito))->count();
        if ($cantProds > 0) {
            throw new ZendExt_Exception('LOG_LB_COMUN_002');
        }
    }

    public function darBaja($idproducto)
    {
        Doctrine_Query::create()
            ->update('DatProductoLogistica')
            ->set('esbaja', 1)
            ->where('idproducto = ?', $idproducto)
            ->execute();
        return true;
    }

    public function restablecerDisponible($idproducto){
        $sqlUpdate = "update mod_logistica.dat_cantidadcomprometida 
                        set estado = 2 where idproducto = {$idproducto} 
                        and iddocumento not in (
                          select idorden from mod_logdistribucion.dat_prodorden 
                          inner join mod_logistica.dat_documento dd on dd.iddocumento = idorden
                          where idproducto = {$idproducto} and dd.estado <> 5
                          union 
                          select dd.iddocumento from mod_logistica.dat_documento dd
                            inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
                            inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
                            inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
                            inner join mod_logistica.dat_cantidadcomprometida cc on cc.iddocumento = dd.iddocumento
                            where ndp.abreviatura = 'transTiendaLog' and cc.idproducto = {$idproducto} and cc.cantidad > 0
                          )";
        LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlUpdate);
        LogisticaDoctrineHelper::__init()->getConnection()->execute("SELECT * FROM mod_loginventario.fn_actualizarsubmayores({$idproducto});");
        return true;
    }

    public function devolverDisponibilidad($params) {
        $and = "";
        if ($params['iddoc'] && count($params['iddoc'])) {
            $iddocs = implode(',', $params['iddoc']);
            $and .= " and dd.iddoc in ({$iddocs}) ";
        }
        if ($params['desde']) {
            $and .= " and dd.fechacontable >= '{$params['desde']}' ";
        }
        if ($params['hasta']) {
            $and .= " and dd.fechacontable <= '{$params['hasta']}' ";
        }
        $sql = "select dd.iddocumento, dd.nrodoc, dd.numeroref, dd.estado, dd.fechacontable,
                ndp.denominacion as tipodoc, dcomp.cantidad
                 from mod_logistica.dat_documento dd
                 inner join mod_logistica.dat_cantidadcomprometida dcomp on dcomp.iddocumento = dd.iddocumento
                 inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
                 inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
                 where dcomp.estado = 1 {$and} and dcomp.idproducto = {$params['idproducto']} offset {$params['start']} limit {$params['limit']}";
        $count = "select count(dd.iddocumento) as cantidad
                 from mod_logistica.dat_documento dd
                 inner join mod_logistica.dat_cantidadcomprometida dcomp on dcomp.iddocumento = dd.iddocumento
                 inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
                 inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos
                 where dcomp.estado = 1 {$and} and dcomp.idproducto = {$params['idproducto']}";
        $cantidad = $this->doctrineHelper->getConnection()->execute($count)->fetchAll(PDO::FETCH_COLUMN);
        $data = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return array('datos'=>$data, 'cantidad'=>$cantidad);

    }

    public function restablecerUbicaciones(){
        LogisticaDoctrineHelper::__init()->getConnection()->execute("SELECT * FROM mod_logubicacion.fn_arreglardesubicados();");
        return true;
    }

    public function restablecerAlmacen($idestructura) {
        $sql = "SELECT * FROM mod_loginventario.fn_actualizarsubmayoresalmacen ({$idestructura})";
        Doctrine_Manager::connection()->fetchAll($sql);
        return true;
    }

    public function desactivarTarjeta($idproducto) {
        $sql = "SELECT * FROM mod_loginventario.fn_desactivartarjeta ({$idproducto}, {$this->global->Perfil->idusuario})";
        Doctrine_Manager::connection()->fetchAll($sql);
        return true;
    }

    public function exportarGastoPorductos($parametros)
    {
        $where = "";
        if (!empty($parametros['idestructura'])) {
            $where .= " and dd.idestructuracomun = {$parametros['idestructura']}";
        }

        $where .= " and dd.fechacontable >= '{$parametros['fechainicio']}' and dd.fechacontable <= '{$parametros['fechafin']}' ";

        $SQL = "select 
                coalesce(ni.numeropieza, ni.codigo) as codigo,
                ni.denominacion as descripcion,
                um.abreviaturaunidadmedida as umedida,
                dm.cantidad,
                dm.preciocontable as precio,
                round(dm.preciocontable*dm.cantidad,2) as importe,
                dd.nrodoc as vs,
                (dep.codigo || ' ' || dep.denominacion) as almacen,
                dor.nrodoc as nroorden,
                dor.fechacontable as fechaorden,
                elg.codigoelementoobjeto as subelemento,
                cl.denominacion as clasificacion,
                cp.descripcion as comentario,
                sum(round(dm.preciocontable*dm.cantidad,2)) over() as total_importe
                from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = dp.idumedida
                inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
                inner join mod_logistica.nom_clasificacioncontable cl on cl.idclasificacioncontable = dm.idclasificacion
                inner join mod_contabilidadcosto.nom_elementogasto elg on elg.idelementoobjeto = dm.idelementogasto
                inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
                inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddoc = dd.iddoc
                inner join mod_datosmaestros.dat_estructurasubsist est on est.idestructurasubsist = ddp.idestructurasubsist
                inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = ddp.iddocumentos and ndp.abreviatura = 'valeLog'
                inner join mod_estructuracomp.v_dametodasestructuras dep on dep.idestructura = dd.idestructuracomun
                left join mod_contabilidad.dat_comprobante cp on cp.idcomprobante = dd.idcomprobante
                left join mod_logistica.dat_documentopadre dpr on dpr.iddocumento = dd.iddocumento
                left join mod_logtaller.dat_ordentrabajo ord on ord.idordentrabajo = dpr.idpadre
                left join mod_logistica.dat_documento dor on dor.iddocumento = ord.idordentrabajo
                where dd.estado = 4 {$where}";
        $datosprod['datos'] = Doctrine_Manager::connection()->fetchAll($SQL);

        if (count($datosprod['datos']) > 0) {
            $datosprod['datos'][] = array(
                'codigo' => '',
                'descripcion' => 'TOTAL',
                'umedida' => '',
                'cantidad' => '',
                'precio' => '',
                'importe' => $datosprod['datos'][0]['total_importe'],
                'vs' => '',
                'almacen' => '',
                'nroorden' => '',
                'fechaorden' => '',
                'subelemento' => '',
                'clasificacion'=> '',
                'comentario' => '', );
        }
        //$datosprod['cantidad'] = $datosprod['datos'][0]['total'];
        unlink("tmp/");
        mkdir('tmp');
        $semilla = mktime();
        $fichero = "tmp/{$semilla}_informe.xls";
        $excel = new ExcelWriter($fichero);
        $columns = array(
            array('header' => '<b>C&oacute;digo</b>', 'dataIndex' => 'codigo'),
            array('header' => '<b>Descripci&oacute;n</b>', 'dataIndex' => 'descripcion'),
            array('header' => '<b>UM</b>', 'dataIndex' => 'umedida'),
            array('header' => '<b>Cantidad</b>', 'dataIndex' => 'cantidad'),
            array('header' => '<b>Precio</b>', 'dataIndex' => 'precio'),
            array('header' => '<b>Importe</b>', 'dataIndex' => 'importe'),
            array('header' => '<b>VS</b>', 'dataIndex' => 'vs'),
            array('header' => '<b>Almacén</b>', 'dataIndex' => 'almacen'),
            array('header' => '<b>No Orden Trabajo</b>', 'dataIndex' => 'nroorden'),
            array('header' => '<b>Fecha Orden Trabajo</b>', 'dataIndex' => 'fechaorden'),
            array('header' => '<b>Subelemento</b>', 'dataIndex' => 'subelemento'),
            array('header' => '<b>Clacificaci&oacute;n</b>', 'dataIndex' => 'clasificacion'),
            array('header' => '<b>Comentario del comprobante</b>', 'dataIndex' => 'comentario'),
        );
        $excel->writeData($datosprod['datos'], $columns);
        $excel->close();
        return '/logistica/inventario/recuperaciones/' . $fichero;
    }
}
