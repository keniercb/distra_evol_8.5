<?php

class BalancecuadreprocesoModel extends ZendExt_Model
{
    private $_conftalleres, $configuracionHelper;

    public function __construct()
    {
        parent::__construct();
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
        $this->_conftalleres = new ConfiguraciontalleresService();
        $this->doctrineHelper = LogisticaDoctrineHelper::__init();
    }

    public function getDatosReporte($params){
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;

        $idEjercicioActual = $this->configuracionHelper->getEjercicioActualSubsistema(
            $this->global->Estructura->idestructura, 4);//4-Contabilidad
        $ejercactual = $this->configuracionHelper->obtenerEjercicio($idEjercicioActual);
        $params['fechainicio'] = $ejercactual[0]->inicio;
        $sql = "(select sbq.idcuenta, sbq.cuenta
        from (
            select nc.idcuenta,
                ncc.cuenta
            from mod_logtaller.nom_cuadreproceso ncc
            join mod_contabilidad.nom_cuenta nc on nc.idcuenta = ncc.idcuenta
            join mod_logtaller.dat_cuadreprocesoentidad cce on ncc.idcuadreproceso = cce.idcuadreproceso
            where cce.idestructuracomun = {$this->global->Estructura->idestructura}     
            ) sbq
       group by sbq.idcuenta, sbq.cuenta
       order by sbq.cuenta)";
        $datos = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        foreach ($datos as &$cuenta) {
            $cuenta['saldocontableot'] = $this->getSaldoCuenta($params, $cuenta['idcuenta']);
            $importe = $this->getSaldoDocumento($cuenta['saldocontableot'], $cuenta['idcuenta'], $params);
            $cuenta['importeorden'] = $importe['saldoot'] ? $importe['saldoot'] : 0;
            $cuenta['diff'] = $importe['diff'] ? $importe['diff'] : 0;
        }
        return array('datos' => $datos, 'cantidad' => count($datos),
            'datosPeriodo' => array(
            'inicio' => ($params['fechainicio']) ? $params['fechainicio'] : ''
        ));
    }

    public function getDatosReporteDetallado($params){
        $conn = Zend_Registry::get('conexion');
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;

        $condition = '';
        $sql ='';
        if ($params['fechainicio']) {
            $condition .= " and dot.fechainicio >= '{$params['fechainicio']}'";
        }

        if ($params['fechafin']) {
            $condition .= " and dot.fechainicio <= '{$params['fechafin']}'";
        }

        if ($params['criterio']) {
            $condition .= " and dd.nrodoc = {$params['criterio']}";
        }

        if ($params['fechaini']) {
            $condition .= " and dot.fechainicio = '{$params['fechaini']}'";
        }

        if ($params['nrodoc']) {
            $condition .= " AND dd.nrodoc = {$params['nrodoc']}";
        }

        $datosDoc = $this->getDatosDocumentoDetallado($params, $condition);
        return $datosDoc;
    }

    public function getDatosCuadre($params)
    {
        $conn = Zend_Registry::get('conexion');
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        $condition = '';
        $corregidove = '';
        $corregidovd = '';
        $where = '';
        $sql ='';
        $SELECT = '';
        $INNERVE = '';
        $INNERVD = '';
        $GROUPBY = '';

        $idPeriodoActual = $this->configuracionHelper->getPeriodoActualSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV);
        $periodo = $this->configuracionHelper->obtenerPeriodo($idPeriodoActual);

        $fechafin = ($params['fechafin']) ? $params['fechafin'] : $periodo->fin;
        $fechainicio = ($params['fechainicio']) ? $params['fechainicio'] : $periodo->inicio;

        $idEstructuraE = $this->global->EstructuraEconomica->idestructurae;

        if ($fechainicio) {
            $condition .= " and d.fechacontable >= '{$fechainicio}'";
        }

        if ($fechafin) {
            $condition .= " and d.fechacontable <= '{$fechafin}'";
        }

        if ($params['criterio']) {
            $where .= " and d.nrodoc = {$params['criterio']}";
        }

        if ($params['nroorden']) {
            $where .= " and dd.nrodoc = {$params['nroorden']}";
        }

        if ($params['nrove']) {
            $where .= " and d.nrodoc = {$params['nrove']}";
        }

        if ($params['tipodocorigen']) {
            $valor = array_sum($params['tipodocorigen']);
            if ($valor == 1) {
                $where .= " and ndpr.abreviatura ilike 'entregaLog%'";
            }
            if ($valor == 2) {
                $where .= " and ndpr.abreviatura ilike 'ordenServicioLOG%'";
            }
        }

        if ($params['nombrecuenta']) {
            $where .= " and nc.concatcta ilike '%{$params['nombrecuenta']}%'";
        }

        if ($params['iddeposito']) {
            $where .= " and de.idestructuraop = {$params['iddeposito']}";
        }

        if ($params['nrocomprobante']) {
            $where .= " and dc.numerocomprobante = {$params['nrocomprobante']}";
        }

        if ($params['nrovd']) {
            $where .= " and doc.nrodoc = {$params['nrovd']}";
        }

        if ($params['textove'] == 1) {
            $corregidove .= " and ca.idcomprobanteve IS NOT NULL";
        } else {
            $corregidove .= " and ca.idcomprobanteve IS NULL";
        }

        if ($params['textovd'] == 1) {
            $corregidovd .= " and ca.idcomprobantevd IS NOT NULL";
        } else {
            $corregidovd .= " and ca.idcomprobantevd IS NULL";
        }

        if ($params['tipovale'] == 1) {
            $INNERVE .=  " AND nc.idcuenta in (
            SELECT ncu.idcuenta from mod_contabilidad.nom_cuenta ncu
                inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cta where cta.idcuenta = {$params['idcuenta']}) a on (ncu.parent_path OPERATOR(public.<@) a.parent_path) 
            )";
            $INNERVD .=  " AND ncu.idcuenta in (
            SELECT ncue.idcuenta from mod_contabilidad.nom_cuenta ncue
                inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cuta where cuta.idcuenta = {$params['idcuenta']}) a1 on (ncue.parent_path OPERATOR(public.<@) a1.parent_path)    
            )";
            $condition .= " and ndpr.abreviatura not ilike 'ordenServicioLOG%' {$corregidove} {$corregidovd}";
        }
        else if ($params['tipovale'] == 2) {
            /*$SELECT .= " ca.nrocomprobanteve as nrocomprobantecontve, (CASE WHEN ca.nrocomprobanteve IS NOT NULL THEN 1 ELSE 0 END) as corregidove,";*/
            $INNERVE .=  " INNER JOIN mod_contabilidad.res_centroelem_saldo cs ON cs.idcomprobante = dc.idcomprobante
            AND cs.idestructurae = {$idEstructuraE} AND cs.idcuenta = nc.idcuenta AND nc.idcuenta not in (
            SELECT ncu.idcuenta from mod_contabilidad.nom_cuenta ncu
                inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cta where cta.idcuenta = {$params['idcuenta']}) a on (ncu.parent_path OPERATOR(public.<@) a.parent_path) 
            ) ";
            $condition .= " AND ndpr.abreviatura ilike 'ordenServicioLOG%' AND cs.debitomb > 0 {$corregidove} ";
            $GROUPBY .= ",ca.nrocomprobanteve";

        } else if ($params['tipovale'] == 3) {
            /*$SELECT .= " ca.nrocomprobantevd as nrocomprobantecontvd, (CASE WHEN ca.nrocomprobantevd IS NOT NULL THEN 1 ELSE 0 END) as corregidovd,";*/
            $INNERVE .=  " LEFT JOIN mod_contabilidad.res_centroelem_saldo cs ON cs.idcomprobante = dc.idcomprobante
            AND cs.idestructurae = {$idEstructuraE} AND cs.idcuenta = nc.idcuenta AND nc.idcuenta in (
            SELECT ncu.idcuenta from mod_contabilidad.nom_cuenta ncu
                inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cta where cta.idcuenta = {$params['idcuenta']}) a on (ncu.parent_path OPERATOR(public.<@) a.parent_path) 
            ) ";
            $INNERVD .=  " AND ncu.idcuenta in (
            SELECT ncue.idcuenta from mod_contabilidad.nom_cuenta ncue
                inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cuta where cuta.idcuenta = {$params['idcuenta']}) a1 on (ncue.parent_path OPERATOR(public.<@) a1.parent_path)    
            )";
            $condition .= " AND ndpr.abreviatura not ilike 'ordenServicioLOG%' AND dcomp.idcomprobante IS NOT NULL AND cs.debitomb > 0 {$corregidovd} ";
            $GROUPBY .= ",ca.nrocomprobantevd";
        } else if ($params['tipovale'] == 4) {
            $INNERVE .=  " LEFT JOIN mod_contabilidad.res_centroelem_saldo cs ON cs.idcomprobante = dc.idcomprobante
            AND cs.idestructurae = {$idEstructuraE} AND cs.idcuenta = nc.idcuenta AND nc.idcuenta not in (
            SELECT ncu.idcuenta from mod_contabilidad.nom_cuenta ncu
                inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cta where cta.idcuenta = {$params['idcuenta']}) a on (ncu.parent_path OPERATOR(public.<@) a.parent_path) 
            )";
            $INNERVD .=  " AND ncu.idcuenta not in (
            SELECT ncue.idcuenta from mod_contabilidad.nom_cuenta ncue
                inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cuta where cuta.idcuenta = {$params['idcuenta']}) a1 on (ncue.parent_path OPERATOR(public.<@) a1.parent_path)    
            )";
            $condition .= " AND ndpr.abreviatura ilike 'ordenServicioLOG%' AND cs.debitomb > 0 AND dcomp.idcomprobante IS NOT NULL {$corregidovd} ";
        } else {
            $INNERVE .= " AND nc.idcuenta in (
            SELECT ncu.idcuenta from mod_contabilidad.nom_cuenta ncu
                inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cta where cta.idcuenta = {$params['idcuenta']}) a on (ncu.parent_path OPERATOR(public.<@) a.parent_path) 
            )";
            $condition .= " {$corregidove} {$corregidovd}";
        }

        $sql = "SELECT (CASE WHEN ndpr.abreviatura not ilike 'ordenServicioLOG%' THEN 0 ELSE dd.nrodoc END) as nroorden,
             d.nrodoc as nrove,
            (SELECT ndpr.denominacion FROM mod_datosmaestros.nom_docprim ndpr
             INNER JOIN mod_datosmaestros.dat_documentoprim ddpr ON ddpr.iddocumentos = ndpr.iddocumentos
             INNER JOIN mod_logistica.dat_documento dd ON dd.iddoc = ddpr.iddoc
             INNER JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = dd.iddocumento
             WHERE ddp.iddocumento = d.iddocumento) as tipodocorigen,
            (CASE WHEN doc.nrodoc IS NOT NULL THEN doc.nrodoc ELSE 0 END) as nrovd,
            d.fechacontable as fechave,       
            de.denominacion as deposito,
            dc.numerocomprobante as nrocomprobante,
            dc.idcomprobante,
            (SELECT coalesce(sum(coalesce(mov.importecontable,0)),0) FROM mod_logistica.dat_movimiento mov where mov.iddocumento = d.iddocumento) as importeve,
            (SELECT coalesce(sum(coalesce(dmo.importecontable,0)),0) FROM mod_logistica.dat_movimiento dmo where dmo.iddocumento = doc.iddocumento) as importevd,
           /* nc.idcuenta as idcuentave,
            ncu.idcuenta as idcuentavd,*/
            {$SELECT}
            nc.concatcta as nombrecuenta,
            d.iddocumento,
            ca.nrocomprobanteve as nrocomprobantecontve,
            ca.nrocomprobantevd as nrocomprobantecontvd,
            (CASE WHEN ca.nrocomprobanteve IS NOT NULL THEN 1 ELSE 0 END) as corregidove,
            (CASE WHEN ca.nrocomprobantevd IS NOT NULL THEN 1 ELSE 0 END) as corregidovd
            
            
            FROM mod_logistica.dat_documento d
            INNER JOIN mod_datosmaestros.dat_documentoprim ddprim ON ddprim.iddoc = d.iddoc
            INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddprim.iddocumentos
            INNER JOIN mod_logistica.dat_movimiento dm on dm.iddocumento = d.iddocumento
            INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto 
                   
            INNER JOIN mod_contabilidad.dat_comprobante dc ON dc.idcomprobante = d.idcomprobante
            INNER JOIN mod_contabilidad.dat_asiento dasi ON dasi.idcomprobante = dc.idcomprobante
            INNER JOIN mod_contabilidad.dat_pase dpa ON dpa.idasiento = dasi.idasiento
            INNER JOIN mod_contabilidad.nom_cuenta nc ON nc.idcuenta = dpa.idcuenta
            {$INNERVE}
            LEFT JOIN mod_logistica.dat_documentopadre ddp ON ddp.iddocumento = d.iddocumento
            LEFT JOIN mod_logistica.dat_documento dd ON dd.iddocumento = ddp.idpadre  
            LEFT JOIN mod_datosmaestros.dat_documentoprim ddpr ON ddpr.iddoc = dd.iddoc
            LEFT JOIN mod_datosmaestros.nom_docprim ndpr ON ndpr.iddocumentos = ddpr.iddocumentos 
            LEFT JOIN mod_estructuracomp.dat_estructuraop de ON de.idestructuraop = dp.idestructura
                
            LEFT JOIN mod_logistica.dat_documentopadre ddpad ON ddpad.idpadre = d.iddocumento
            LEFT JOIN mod_logistica.dat_documento doc ON doc.iddocumento = ddpad.iddocumento
            LEFT JOIN mod_logistica.dat_movimiento dmov on dmov.iddocumento = doc.iddocumento  

            LEFT JOIN mod_contabilidad.dat_comprobante dcomp ON dcomp.idcomprobante = doc.idcomprobante   
            LEFT JOIN mod_contabilidad.dat_asiento da ON da.idcomprobante = dcomp.idcomprobante
            LEFT JOIN mod_contabilidad.dat_pase dpas ON dpas.idasiento = da.idasiento
            LEFT JOIN mod_contabilidad.nom_cuenta ncu ON ncu.idcuenta = dpas.idcuenta
            {$INNERVD}  
            LEFT JOIN  mod_logtaller.dat_comprobantearreglo ca on ca.iddocumento = d.iddocumento         
            WHERE dp.idestructuracomun = {$this->global->Estructura->idestructura}
            AND ndp.abreviatura ilike 'valeLog%' {$condition} {$where}
            GROUP BY d.iddocumento, doc.nrodoc, doc.iddocumento, de.denominacion, d.fechacontable, de.denominacion, dc.numerocomprobante, dc.idcomprobante, ndpr.abreviatura,/* nc.idcuenta, ncu.idcuenta,*/ nc.concatcta, dd.nrodoc/*, ca.nrocomprobanteve, ca.nrocomprobantevd*//*, dm.importecontable, dmov.importecontable*/
            ,ca.nrocomprobanteve, ca.nrocomprobantevd
            ORDER BY dd.nrodoc, d.nrodoc, d.fechacontable, dc.numerocomprobante ";

        $cantidadTotal = count($conn->fetchAll($sql));
        if ($params['limit']) {
            $sql = $sql . "LIMIT {$params['limit']} ";
        }
        if ($params['start']) {
            $sql = $sql . "OFFSET {$params['start']} ";
        }

        $result = $conn->fetchAll($sql);
        return array('datos' => $result, 'cantidad' => $cantidadTotal);
    }

    private function getSaldoCuenta($params, $iduenta) {
        $sqlNaturaleza = "SELECT idnaturaleza FROM mod_contabilidad.nom_cuenta cta where idcuenta = $iduenta";
        $resNaturaleza = $this->doctrineHelper->getConnection()->execute($sqlNaturaleza)->fetchAll(PDO::FETCH_ASSOC);
        $idNaturaleza = $resNaturaleza[0]['idnaturaleza'];

        $idEstructuraE = $this->global->EstructuraEconomica->idestructurae;
        $sqlSaldo ="SELECT case when {$idNaturaleza} = 8030 then sum(s.creditomb) - sum(s.debitomb) else sum(s.debitomb) - sum(s.creditomb) end as saldo 
        FROM mod_contabilidad.nom_cuenta h
        LEFT JOIN mod_contabilidad.dat_confcuentaentidade c ON h.idcuenta = c.idcuenta and c.idestructurae = {$idEstructuraE}
        INNER JOIN mod_contabilidad.res_centroelem_saldo s ON (h.idcuenta = s.idcuenta and s.idestructurae = {$idEstructuraE})
        INNER JOIN mod_contabilidad.dat_comprobante cmp ON (cmp.idcomprobante = s.idcomprobante)
        INNER JOIN (SELECT parent_path FROM mod_contabilidad.nom_cuenta cta where idcuenta = {$iduenta}) a on (h.parent_path OPERATOR(public.<@) a.parent_path)
        WHERE (h.idestructurae = {$idEstructuraE} OR c.idestructurae = {$idEstructuraE}) AND s.fechaemision >= '{$params['fechainicio']}'";

        $datos = $this->doctrineHelper->getConnection()->execute($sqlSaldo)->fetchAll(PDO::FETCH_ASSOC);
        return $datos[0]['saldo'];
    }

    private function getSaldoDocumento($saldoContable, $idcuenta, $params) {
        $idEstructuraE = $this->global->EstructuraEconomica->idestructurae;
        $sqlSaldo = "SELECT q.saldoot, abs({$saldoContable} - q.saldoot) as diff
        FROM
        /*(select sum(coalesce((select sum(coalesce(dpas.importemonedabase,0)) from mod_contabilidad.dat_pase dpas
            inner join mod_contabilidad.dat_asiento das ON das.idasiento = dpas.idasiento
            inner join mod_contabilidad.dat_comprobante dcomp ON das.idcomprobante = dcomp.idcomprobante
            inner join mod_logistica.dat_documento doc on doc.idcomprobante = dcomp.idcomprobante
            where doc.iddocumento = dd1.iddocumento and dpas.idcuenta in (
                select ncu.idcuenta from mod_contabilidad.nom_cuenta ncu
                inner join (select parent_path FROM mod_contabilidad.nom_cuenta cta where cta.idcuenta = {$idcuenta}) a on (ncu.parent_path OPERATOR(public.<@) a.parent_path)
            )
        ),0) - (coalesce((select sum(coalesce(abs(dpa.importemonedabase),0)) from mod_contabilidad.dat_pase dpa
            inner join mod_contabilidad.dat_asiento da ON da.idasiento = dpa.idasiento         
            inner join mod_contabilidad.dat_comprobante dcom ON da.idcomprobante = dcom.idcomprobante         
            inner join mod_logistica.dat_documento d on d.idcomprobante = dcom.idcomprobante        
            inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = d.iddocumento        
            where devp.idpadre = dd1.iddocumento and dpa.idcuenta in (        
                select nc.idcuenta from mod_contabilidad.nom_cuenta nc        
                inner join (select parent_path FROM mod_contabilidad.nom_cuenta ct where ct.idcuenta = {$idcuenta}) b on (nc.parent_path OPERATOR(public.<@) b.parent_path)     
            )     
            ),0)))*/(select sum(COALESCE(dm.importecontable, 0)-(
                    coalesce((
                                select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
                                inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
                                inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
                                where ddev.estado = 4 and devp.idpadre = dd1.iddocumento and dev.idproducto = dm.idproducto
                            ),0)
                )) + coalesce((select sum(coalesce(res.debitomb,0))
             from mod_logtaller.dat_comprobantearreglo dca
             inner join mod_contabilidad.res_centroelem_saldo res ON res.idcomprobante = dca.idcomprobanteve
             inner join mod_contabilidad.dat_comprobante dc ON dc.idcomprobante = res.idcomprobante
             where res.numerocmp = dca.nrocomprobanteve and res.debitomb > 0 
             AND res.fechaemision >= '{$params['fechainicio']}' and res.idestructurae = {$idEstructuraE} AND dca.idestructura = {$this->global->Estructura->idestructura} AND dc.creadoencontabilidad <> 1
            ),0) /*+ coalesce((select sum(coalesce(res.creditomb,0))
             from mod_logtaller.dat_comprobantearreglo dca
             inner join mod_contabilidad.res_centroelem_saldo res ON res.idcomprobante = dca.idcomprobantevd
             inner join mod_contabilidad.dat_comprobante dc ON dc.idcomprobante = res.idcomprobante
             where res.numerocmp = dca.nrocomprobantevd and res.debitomb > 0 
             AND res.fechaemision >= '{$params['fechainicio']}' and res.idestructurae = {$idEstructuraE} AND dca.idestructura = {$this->global->Estructura->idestructura} AND dc.creadoencontabilidad = 1
            ),0)*/ /*- coalesce((select sum(coalesce(res.creditomb,0))
             from mod_logtaller.dat_comprobantearreglo dca
             inner join mod_contabilidad.res_centroelem_saldo res ON res.idcomprobante = dca.idcomprobantevd
             inner join mod_contabilidad.dat_comprobante dc ON dc.idcomprobante = res.idcomprobante
             where res.numerocmp = dca.nrocomprobantevd and res.creditomb > 0 
             AND res.fechaemision >= '{$params['fechainicio']}' and res.idestructurae = {$idEstructuraE} AND dca.idestructura = {$this->global->Estructura->idestructura} AND dc.creadoencontabilidad <> 1
            ),0)*//* - coalesce((select sum(coalesce(res.creditomb,0))
             from mod_logtaller.dat_comprobantearreglo dca
             inner join mod_contabilidad.res_centroelem_saldo res ON res.idcomprobante = dca.idcomprobantevd
             inner join mod_contabilidad.dat_comprobante dc ON dc.idcomprobante = res.idcomprobante
             where res.numerocmp = dca.nrocomprobantevd and res.debitomb > 0 
             AND res.fechaemision >= '{$params['fechainicio']}' and res.idestructurae = {$idEstructuraE} AND dca.idestructura = {$this->global->Estructura->idestructura} AND dc.creadoencontabilidad = 1
            ),0)*/ as saldoot
            
        from mod_logistica.dat_documento dd
        inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dd.iddocumento
        inner join mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento
        inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = ddp.iddocumento
        inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd1.iddocumento
        inner join mod_logistica.dat_documentocliente dmc on dmc.iddocumento = dd.iddocumento and dmc.tipocliente = 1
        inner join mod_datosmaestros.nom_clientesproveedor nmc on nmc.idclientesproveedores = dmc.idcliente        
        where dd.idestructuracomun = {$this->global->Estructura->idestructura}
        and dd.estado in (1,2) and dd1.estado = 4 and dd1.idcomprobante is not null 
        ) q";

        $datos = $this->doctrineHelper->getConnection()->execute($sqlSaldo)->fetchAll(PDO::FETCH_ASSOC);
        return $datos[0];
    }

    private function getDatosDocumentoDetallado($params, $condition) {
        $where = "";
        $estado = "";
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        $idEstructuraE = $this->global->EstructuraEconomica->idestructurae;
        if ($params['condiferencias']) {
           $estado .= " AND dd.estado IN (9) ";
            $where .= " HAVING ((abs(round((sum(COALESCE(dm.importecontable, 0) - (COALESCE((
            SELECT sum(COALESCE(dev.importecontable,0)) FROM mod_logistica.dat_movimiento dev
            INNER JOIN mod_logistica.dat_documento ddev ON ddev.iddocumento = dev.iddocumento
            INNER JOIN mod_logistica.dat_documentopadre devp ON devp.iddocumento = ddev.iddocumento
            INNER JOIN mod_contabilidad.dat_comprobante dcomp ON dcomp.idcomprobante = ddev.idcomprobante
            INNER JOIN mod_contabilidad.dat_asiento das ON das.idcomprobante = dcomp.idcomprobante
            INNER JOIN mod_contabilidad.dat_pase dpa ON dpa.idasiento = das.idasiento
            INNER JOIN mod_contabilidad.nom_cuenta h on h.idcuenta = dpa.idcuenta and h.idcuenta in (
            SELECT ncue.idcuenta from mod_contabilidad.nom_cuenta ncue
               inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cuta where cuta.idcuenta = {$params['idcuenta']}) a1 on (ncue.parent_path OPERATOR(public.<@) a1.parent_path) 
            )
            WHERE ddev.estado = 4 AND devp.idpadre = dm.iddocumento AND dev.idproducto = dm.idproducto
            ),0))
        )),2)  - (SELECT sum(round(dmat.precio*cantidadreal,2)) FROM mod_logtaller.dat_material dmat WHERE dmat.idordentrabajo = dot.idordentrabajo))) > 0) ";
        } else {
            $estado .= " AND dd.estado IN (1,2) ";
        }

        $conn = Zend_Registry::get('conexion');
        $sqlDatos = "SELECT 
        dd.nrodoc,
        dot.fechainicio AS fechaini,
        (sum(COALESCE(dm.importecontable, 0) - (COALESCE((
            SELECT sum(COALESCE(dev.importecontable,0)) FROM mod_logistica.dat_movimiento dev
            INNER JOIN mod_logistica.dat_documento ddev ON ddev.iddocumento = dev.iddocumento
            INNER JOIN mod_logistica.dat_documentopadre devp ON devp.iddocumento = ddev.iddocumento
            INNER JOIN mod_contabilidad.dat_comprobante dcomp ON dcomp.idcomprobante = ddev.idcomprobante
            INNER JOIN mod_contabilidad.dat_asiento das ON das.idcomprobante = dcomp.idcomprobante
            INNER JOIN mod_contabilidad.dat_pase dpas ON dpas.idasiento = das.idasiento
            INNER JOIN mod_contabilidad.nom_cuenta ncu on ncu.idcuenta = dpas.idcuenta and ncu.idcuenta in (
            SELECT ncue.idcuenta from mod_contabilidad.nom_cuenta ncue
               inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cuta where cuta.idcuenta = {$params['idcuenta']}) c on (ncue.parent_path OPERATOR(public.<@) c.parent_path) 
            )
            WHERE ddev.estado = 4 AND devp.idpadre = dm.iddocumento AND dev.idproducto = dm.idproducto
            ),0))
        )) AS saldocontableot,
        (SELECT sum(round(dmat.precio*cantidadreal,2)) FROM mod_logtaller.dat_material dmat WHERE dmat.idordentrabajo = dot.idordentrabajo) as importeorden,
        abs(sum(COALESCE(dm.importecontable, 0) - (COALESCE((
            SELECT sum(COALESCE(dev.importecontable,0)) FROM mod_logistica.dat_movimiento dev
            INNER JOIN mod_logistica.dat_documento ddev ON ddev.iddocumento = dev.iddocumento
            INNER JOIN mod_logistica.dat_documentopadre devp ON devp.iddocumento = ddev.iddocumento
            INNER JOIN mod_contabilidad.dat_comprobante dcomp ON dcomp.idcomprobante = ddev.idcomprobante
            INNER JOIN mod_contabilidad.dat_asiento das ON das.idcomprobante = dcomp.idcomprobante
            INNER JOIN mod_contabilidad.dat_pase dpas ON dpas.idasiento = das.idasiento
            INNER JOIN mod_contabilidad.nom_cuenta h on h.idcuenta = dpas.idcuenta and h.idcuenta in (
            SELECT ncue.idcuenta from mod_contabilidad.nom_cuenta ncue
               inner join (SELECT parent_path FROM mod_contabilidad.nom_cuenta cuta where cuta.idcuenta = {$params['idcuenta']}) a1 on (ncue.parent_path OPERATOR(public.<@) a1.parent_path) 
            )
            WHERE ddev.estado = 4 AND devp.idpadre = dm.iddocumento AND dev.idproducto = dm.idproducto
            ),0))
        ) - (SELECT sum(round(dmat.precio*cantidadreal,2)) FROM mod_logtaller.dat_material dmat WHERE dmat.idordentrabajo = dot.idordentrabajo)) AS diff,
         EXTRACT (days FROM (now() - dot.fechainicio)) AS estadia,
         dd.iddocumento       
        FROM mod_logistica.dat_documento dd 
        INNER JOIN mod_logtaller.dat_ordentrabajo dot ON dot.idordentrabajo = dd.iddocumento
        INNER JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = dd.iddocumento
        INNER JOIN mod_logistica.dat_documento dd1 ON dd1.iddocumento = ddp.iddocumento
        INNER JOIN mod_datosmaestros.dat_documentoprim ddprim ON ddprim.iddoc = dd1.iddoc
        INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddprim.iddocumentos
        INNER JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = dd1.iddocumento
            
        INNER JOIN mod_logistica.dat_documentocliente dmc ON dmc.iddocumento = dd.iddocumento AND dmc.tipocliente = 1
        INNER JOIN mod_datosmaestros.nom_clientesproveedor nmc ON nmc.idclientesproveedores = dmc.idcliente
                   
        INNER JOIN mod_contabilidad.dat_comprobante dc ON dc.idcomprobante = dd1.idcomprobante
        WHERE dd.idestructuracomun = {$this->global->Estructura->idestructura}
        {$estado} AND dd1.estado = 4 
        {$condition}
        GROUP BY dd.nrodoc, dot.fechainicio, dot.idordentrabajo, dd.iddocumento {$where} ";

        $cantidadTotal = count($conn->fetchAll($sqlDatos));
        if ($params['limit']) {
            $sqlDatos = $sqlDatos . "LIMIT {$params['limit']} ";
        }
        if ($params['start']) {
            $sqlDatos = $sqlDatos . "OFFSET {$params['start']} ";
        }

        $datos = $conn->fetchAll($sqlDatos);
        return array('datos' => $datos, 'cantidad' => $cantidadTotal);
    }

    public function adicionarBalance($params)
    {
        try {
            $diferencia = 0;
            $cierre = 0;
            $idEstructura = $this->global->EstructuraEconomica->idestructuracomun;
            $fechaSubsist = $this->integrator->datosmaestros->fechaContableSubsistema($idEstructura, 113);
            $idusuario = $this->global->Perfil->idusuario;

            if ($params['cierre']) {
                $config = $this->_conftalleres->devolverConfiguracion($this->global->Estructura->idestructura);
                if ($config['datos']['cierrecondiferencia'] == 1) {
                    $this->cerrarConDiferencia($params, $fechaSubsist,$idusuario);
                } else {
                    $datosCuenta = $this->getDatosReporte();
                    if($datosCuenta['datos'][0]['diff'] > 0){
                        return array('diferencia' => 1);
                    }else{
                        $this->cerrarConDiferencia($params, $fechaSubsist,$idusuario);
                    }

                    //Si existen diferencias, muestro una exepcion, sino cierro
                }

            }
            unset($params['cierre']);

            $collDatBalance = new Doctrine_Collection('DatBalanceCuadreProceso');

            foreach ($params['arrayCuentas'] as $per) {
                if ($per['idcuenta']){

                    $existe = Doctrine::getTable('DatBalanceCuadreProceso')
                        ->findByDql('idcuenta = ? and idestructura = ? and fecha = ? and cierre = ?', array($per['idcuenta'],$this->global->Estructura->idestructura,$fechaSubsist,$cierre));
                }

                if (count($existe) == 0) {
                    $balance = new DatBalanceCuadreProceso();
                    $balance->idcuenta = $per['idcuenta'];
                    $balance->idestructura = $this->global->Estructura->idestructura;
                    $balance->fecha = $fechaSubsist;
                    $balance->cierre = $cierre;
                    $balance->idusuario = $idusuario;

                } else {
                    $balance = $existe[0];
                }
                $balance->saldocontable = $per['saldocontable'];
                $balance->saldoot = $per['saldoot'];
                $balance->diferencia = $per['diferencia'];
                $balance->idestructura = $this->global->Estructura->idestructura;
                $collDatBalance->add($balance);
                unset($existe);

            }

            if ($collDatBalance->count() > 0) {
                $collDatBalance->save();
            }

        } catch (Exception $e) {
            return array(
                'success' => false,
                'details' => $e->getMessage(),
                'message' => "Failed to create record"
            );
        }

        return array('diferencia' => $diferencia);

    }

    public function guardarComprobante($params)
    {
        $bandera = false;
        $idPeriodoActual = $this->configuracionHelper->getPeriodoActualSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV);
        $periodo = $this->configuracionHelper->obtenerPeriodo($idPeriodoActual);

        $fechainicio = ($params['fechainicio']) ? $params['fechainicio'] : $periodo->inicio;

        $idEstructuraE = $this->global->EstructuraEconomica->idestructurae;
        $idEstructura = $this->global->Estructura->idestructura;
        foreach ($params['arregloDatos'] as $dat) {
            if ($dat['iddocumento'] && ($dat['nrocomprobanteve'] || $dat['nrocomprobantevd'])) {
                $nrocomprobante = ($dat['nrocomprobanteve']) ? $dat['nrocomprobanteve'] : $dat['nrocomprobantevd'];
                $conditionCredito = ($dat['nrocomprobanteve']) ? " AND res.creditomb > 0 " : " AND res.debitomb > 0";

                $existe = "SELECT res.idcomprobante, res.numerocmp as nrocomprobante
                FROM mod_contabilidad.res_centroelem_saldo res
                WHERE res.fechaemision >= '{$fechainicio}' AND res.idestructurae = {$idEstructuraE} AND res.numerocmp = {$nrocomprobante} {$conditionCredito}";
                $datos = Doctrine_Manager::connection()->execute($existe)->fetchAll(PDO::FETCH_ASSOC);
                if ($datos[0]['idcomprobante']) {
                    $existeDoc = "SELECT dca.iddocumento, dca.nrocomprobanteve, dca.idcomprobanteve, dca.nrocomprobantevd, dca.idcomprobantevd
                    FROM mod_logtaller.dat_comprobantearreglo dca
                    WHERE dca.iddocumento = {$dat['iddocumento']}";
                    $datosDoc = Doctrine_Manager::connection()->execute($existeDoc)->fetchAll(PDO::FETCH_ASSOC);
                    if (!$datosDoc[0]['iddocumento']) {
                        $numerocomprobanteve = ($dat['nrocomprobanteve']) ? $datos[0]['nrocomprobante'] : 'null';
                        $numerocomprobantevd = ($dat['nrocomprobantevd']) ? $datos[0]['nrocomprobante'] : 'null';
                        $idcomprobanteve = ($dat['nrocomprobanteve']) ? $datos[0]['idcomprobante'] : 'null';
                        $idcomprobantevd = ($dat['nrocomprobantevd']) ? $datos[0]['idcomprobante'] : 'null';

                        $sqlIns = "INSERT INTO mod_logtaller.dat_comprobantearreglo(iddocumento,idestructura,nrocomprobanteve,idcomprobanteve,nrocomprobantevd,idcomprobantevd)
                        VALUES({$dat['iddocumento']},{$idEstructura},{$numerocomprobanteve},{$idcomprobanteve},{$numerocomprobantevd},{$idcomprobantevd});";
                        Doctrine_Manager::connection()->execute($sqlIns);
                        $bandera = true;
                    } else {
                        $nrocomprobanteve = ($dat['nrocomprobanteve']) ? $datos[0]['nrocomprobante'] : $datosDoc[0]['nrocomprobanteve'];
                        $nrocomprobantevd = ($dat['nrocomprobantevd']) ? $datos[0]['nrocomprobante'] : $datosDoc[0]['nrocomprobantevd'];
                        $idcomprobve = ($dat['nrocomprobanteve']) ? $datos[0]['idcomprobante'] : $datosDoc[0]['idcomprobanteve'];
                        $idcomprobvd = ($dat['nrocomprobantevd']) ? $datos[0]['idcomprobante'] : $datosDoc[0]['idcomprobantevd'];

                        $sqlUpd = "UPDATE mod_logtaller.dat_comprobantearreglo SET
                        nrocomprobanteve = {$nrocomprobanteve}, idcomprobanteve = {$idcomprobve}, nrocomprobantevd = {$nrocomprobantevd}, idcomprobantevd = {$idcomprobvd}
                        WHERE iddocumento = {$datosDoc[0]['iddocumento']}";
                        Doctrine_Manager::connection()->execute($sqlUpd);
                        $bandera = true;
                    }
                } else {
                    $bandera = false;
                }
            }
        }
        return array('success' => $bandera);
    }

    public function cargarHistorialBalance($params){
        $conn = Zend_Registry::get('conexion');
        $sqlWhere = " ";

        if(($params['desdeBA']) && ($params['hastaBA'])){
            $sqlWhere = " AND (db.fecha BETWEEN '{$params['desdeBA']}'::date AND '{$params['hastaBA']}'::date) ";
        }
        else  if(($params['desdeBA'])){
            $sqlWhere = " AND (db.fecha >= '{$params['desdeBA']}'::date) ";
        }
        else  if(($params['hastaBA'])){
            $sqlWhere = " AND (db.fecha <= '{$params['hastaBA']}'::date) ";
        }
        $sql = "Select db.*,
        nc.descripcion as cuenta,nc.concatcta,
        (case
          when db.cierre = 1 then 'Cierre período'
          else 'Cierre diario'
        end)as tipocierre,su.nombreusuario
 From mod_logtaller.dat_balancecuadreproceso db
      INNER JOIN mod_contabilidad.nom_cuenta nc on nc.idcuenta = db.idcuenta
      INNER JOIN mod_seguridad.seg_usuario su on su.idusuario = db.idusuario
 where db.idestructura  = {$this->global->Estructura->idestructura} ".$sqlWhere."ORDER BY db.fecha";
 //print_r($sql);die;
     $datos = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
     $cantidadTotal = count($conn->fetchAll($sql));
     return array('datos' => $datos, 'cantidad' => $cantidadTotal);
    }    

    public function cerrarConDiferencia($params, $fechaSubsist,$idusuario){
        if($params['cierre']){
            $collDatBalanceCierre = new Doctrine_Collection('DatBalanceCuadreProceso');
            $datosCuenta = $this->getDatosReporte();
            foreach ($datosCuenta['datos'] as $dat) {
                 $params['arrayCuentas'][] = array('idcuenta'=> $dat['idcuenta'], 
                 'saldocontable'=> $dat['importeorden'], 'saldoot'=> $dat['saldocontableot'], 'diferencia'=> $dat['diff']); 
               
                if ($dat['idcuenta']){
                    $existeCierre = Doctrine::getTable('DatBalanceCuadreProceso')
                        ->findByDql('idcuenta = ? and idestructura = ? and fecha = ? and cierre = ?', array($dat['idcuenta'],$this->global->Estructura->idestructura,$fechaSubsist,1));  
                }
               
                if (count($existeCierre) == 0) { 
                    $balanceCierre = new DatBalanceCuadreProceso();
                  
                    $balanceCierre->idcuenta = $dat['idcuenta'];
                    $balanceCierre->idestructura = $this->global->Estructura->idestructura;
                    $balanceCierre->fecha = $fechaSubsist;
                    $balanceCierre->cierre = 1;     
                    $balanceCierre->idusuario = $idusuario;
 
                } else {
                    $balanceCierre = $existeCierre[0];           
                }
               
                $balanceCierre->saldocontable = $dat['saldocontableot'];
                $balanceCierre->saldoot = $dat['importeorden'];
                $balanceCierre->diferencia = $dat['diff'];
                $balanceCierre->idestructura = $this->global->Estructura->idestructura;
                if($balanceCierre->diferencia > 0){
                   
                    $diferencia = 1;
                }
              
                $collDatBalanceCierre->add($balanceCierre);
                unset($existeCierre);
            }
            
            if ($collDatBalanceCierre->count() > 0) {
                // print_r($collDatBalanceCierre->toArray());die;
                $collDatBalanceCierre->save();
            }

        }
      
        unset($params['cierre']);
           
        // $collDatBalance = new Doctrine_Collection('DatBalanceCuadreProceso');   
        // foreach ($params['arrayCuentas'] as $per) {
        //     if ($per['idcuenta']){
        //         $existe = Doctrine::getTable('DatBalanceCuadreProceso')
        //             ->findByDql('idcuenta = ? and fecha = ? and cierre = ?', array($per['idcuenta'], $fechaSubsist,$cierre));                   
        //     }
            
        //     if (count($existe) == 0) {       
        //         $balance = new DatBalanceCuadreProceso();
        //         $balance->idcuenta = $per['idcuenta'];
        //         $balance->idestructura = $this->global->Estructura->idestructura;
        //         $balance->fecha = $fechaSubsist;
        //         $balance->cierre = $cierre;      
        //     } else {
        //         $balance = $existe[0];           
        //     }
            
        //     $balance->saldocontable = $per['saldocontable'];
        //     $balance->saldoot = $per['saldoot'];
        //     $balance->diferencia = $per['diferencia'];
        //     $collDatBalance->add($balance);
        // }
        
        // if ($collDatBalance->count() > 0) {
        //     $collDatBalance->save();
        // }

       
     return array('datos' => $collDatBalanceCierre->toArray());
         

    }
}