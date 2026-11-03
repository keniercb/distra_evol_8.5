<?php

/**
 *  Esta clase
 * @copyright XETID
 * @author Division de Gestion de Entidades
 * @version 1.0
 */
class ValordepositosModel extends RecuperacionesInventarioModel {

    private $producto, $serviciosIddoc, $arrayIddocs;

    public function __construct() {

        parent::__construct();
        $this->producto = new LogisticaProductoModel();
        $this->serviciosIddoc = LogisticaDocumentosHelper::__init();
        $this->arrayIddocs = array();
    }

    /**
     * Devuelve los importes contable y alternativo por operacion de cada deposito de la entidad.
     * @return array
     */
    public function devolverValorDepositos($filtro) {
        $idestructura = $this->global->Estructura->idestructura;
        if(!$filtro['iddepositos']){
            $datosDepositos = $this->loadDepositos();
            $iddepositos = $this->objectHelper->extractValueFromArrayColumn($datosDepositos['datos'], 'iddeposito');
            $strdepositos = implode(', ', $iddepositos);
        }else{
            $strdepositos = $filtro['iddepositos'];
            $iddepositos = explode(',',$filtro['iddepositos']);
        }
        $arrAlias = array('aperturaLog', 'recepcionLog', 'valedev', 'valeLog', 'transferenciaLog', 'ajusteLog');
        $arrAliasFact = array('facturaLog','compventaLog','compdevLog');
        $aliasInv = $this->findIddocsByAlias($arrAlias, LogisticaGlobal::SUBSISTEMA_INV);
        $aliasFact = $this->findIddocsByAlias($arrAliasFact, LogisticaGlobal::SUBSISTEMA_FAC);
        $striddoc = implode(', ', array_merge($aliasInv, $aliasFact));
        
        $iddocs = "'{".$striddoc."}'";
        $depositos = "'{".$strdepositos."}'";
        
       // if($filtro['fecha']){
            $fecha = $filtro['fecha'];
            $filtro['fecha'] =  (isset($filtro['fecha']) && !empty($filtro['fecha']))? "'{$fecha}'" : 'null' ;//$this->global->Fechacontable->fecha;
        /*
        } else {
            $filtro['fecha'] = 'null';            
        }*/

        $datos = Doctrine_Manager::connection()->fetchAll(
            "select * from mod_loginventario.f_recvalordeposito ({$depositos}, "
            . "{$idestructura}, 10, {$iddocs},{$filtro['fecha']} ) q"
        );
        return array(
            'cantidad' => count($datos), 'datos' => $datos,
            'iddocs' => (!empty($striddoc)) ? "{" . $striddoc . "}" : null,
            'iddepositos' => (!empty($strdepositos)) ? "{" . $strdepositos . "}" : null
        );
/*
        $sql = '';
        if ($filtro['fecha']) {
            $sql .= " and dd.fechacontable <= '{$filtro['fecha']}'";
        }

        $a = "coalesce(sum((
                        SELECT sum(dm.importecontable)
                        FROM mod_logistica.dat_movimiento dm
                        INNER JOIN mod_logistica.dat_documento dd ON dd.iddocumento = dm.iddocumento
                        where dp.idestructura = dd.idestructuracomun and dm.cronologia > 0 and dm.signo = '+' {$sql}
                 ) - (
                        SELECT sum(dm.importecontable)
                        FROM mod_logistica.dat_movimiento dm
                        INNER JOIN mod_logistica.dat_documento dd ON dd.iddocumento = dm.iddocumento
                        where dp.idestructura = dd.idestructuracomun and dm.cronologia > 0 and dm.signo = '-' {$sql}
                 )),0)";
        $b = "coalesce(sum((
                        SELECT dm.importetotalalt
                        FROM mod_logistica.dat_movimiento dm
                        INNER JOIN mod_logistica.dat_documento dd ON dd.iddocumento = dm.iddocumento
                        where dp.idproducto = dm.idproducto and dm.cronologia > 0 and dm.signo <> 'N' {$sql}
                        ORDER by dm.cronologia DESC limit 1
             )),0)";
        $sqlImporte = "INNER JOIN ( select distinct dp.idestructuraop as idest,
				coalesce((
					 SELECT sum(ddp.cantidad * ddp.precio)
                        FROM mod_logistica.dat_producto ddp
                        where dp.idestructuraop = ddp.idestructura
				),0) 
				as importe, 
				coalesce((
					 SELECT sum(ddp.cantidad * ddp.precioalternativo)
                        FROM mod_logistica.dat_producto ddp
                        where dp.idestructuraop = ddp.idestructura
				),0)
				as importealt
            from mod_estructuracomp.dat_estructuraop dp
        ) q on q.idest = p.idestructura";

        $sql = "SELECT DISTINCT e.idestructuraop AS iddeposito, e.denominacion AS deposito, "
                . "round(q.importe, 2) AS importe, round(q.importealt, 2) AS importealternativo, "
                . "coalesce({$this->selectImporte("'aperturaLog'", $striddoc, false, false, $filtro)}, 0) AS apertura, "
                . "coalesce({$this->selectImporte("'aperturaLog'", $striddoc, true, false, $filtro)}, 0) AS aperturaalt, "
                . "coalesce({$this->selectImporte("'recepcionLog', 'valedev'", $striddoc, false, '+', $filtro)}, 0) AS compras, "
                . "coalesce({$this->selectImporte("'recepcionLog', 'valedev'", $striddoc, true, false, $filtro)}, 0) AS comprasalt, "
                . "coalesce({$this->selectImporte("'facturaLog'", $striddoc, false, false, $filtro)}, 0) AS ventas, "
                . "coalesce({$this->selectImporte("'facturaLog'", $striddoc, true, false, $filtro)}, 0) AS ventasalt, "
                . "coalesce({$this->selectImporte("'valeLog', 'transferenciaLog'", $striddoc, false, false, $filtro)}, 0) AS gastos, "
                . "coalesce({$this->selectImporte("'valeLog', 'transferenciaLog'", $striddoc, true, false, $filtro)}, 0) AS gastosalt, "
                . "(coalesce({$this->selectImporte("'ajusteLog'", $striddoc, false, '+', $filtro)}, 0) - "
                . "coalesce({$this->selectImporte("'ajusteLog'", $striddoc, false, '-', $filtro)}, 0)) AS ajustes, "
                . "(coalesce({$this->selectImporte("'ajusteLog'", $striddoc, true, '+', $filtro)}, 0) - "
                . "coalesce({$this->selectImporte("'ajusteLog'", $striddoc, true, '-', $filtro)}, 0)) AS ajustesalt, "
                . "{$this->selectImporte("'revaluacionLog'", $striddoc, true, '-', $filtro)} AS reevaluacion "
                . "FROM mod_logistica.dat_producto p INNER JOIN mod_estructuracomp.dat_estructuraop e "
                . "ON e.idestructuraop = p.idestructura {$sqlImporte} WHERE p.cronologia > 0 AND p.idestructuracomun = $idestructura "
                . "AND p.idestructura IN ($strdepositos) "
                . "GROUP BY e.denominacion, e.idestructuraop,e.codigo,p.idestructura,q.importe,q.importealt ORDER BY e.denominacion";
        if (isset($filtro['start'])) {
            $sql .= " OFFSET {$filtro['start']} LIMIT {$filtro['limit']}";
        }
        
        $query = Doctrine_Query::create()->select('count(p.idestructura) AS cantidad')
                ->from('DatProductoLogistica p')->where('p.cronologia > 0 AND p.idestructuracomun = ?', array($this->idestructura))->whereIn('p.idestructura', $iddepositos)
                ->groupBy('p.idestructura');
        $datos = Doctrine_Manager::connection()->fetchAll($sql);
        return array(
            'cantidad' => $query->count(), 'datos' => $datos,
            'iddocs' => (!empty($striddoc)) ? "{" . $striddoc . "}" : null,
            'iddepositos' => (!empty($strdepositos)) ? "{" . $strdepositos . "}" : null
        );*/
    }

    /**
     * Devuelve el importe de la operacion.
     * @param string $alias
     * @param string $iddoc
     * @param boolean $alternativo [Opcional]
     * @param string $signo [Opcional]
     * @return string
     */
    private function selectImporte($alias, $iddoc, $alternativo = false, $signo = null, $filtro = null) {
        if ($alias == "'revaluacionLog'") {
            return $this->selectReevaluacion($alias, $filtro['fecha']);
        }
        if ($alias == "'facturaLog'") {
            $serviceFact = new FacturacionService();
            $params = array('idestructuraop' => "e.idestructuraop", 'alternativo' => $alternativo);
            $sqlImportes = $serviceFact->getImportesFacturaReportes($params);
            return $sqlImportes;
        }
        $estado = $alias == "'aperturaLog'" ? 3 : 4;
        $campo = $alternativo ? 'importealternativo' : 'importecontable';
        $idestructura = "d.idestructuracomun";
        $sql = '';
        if ($signo) {
            $sql .= " and m.signo = '{$signo}'";
        }
        if ($filtro['fecha']) {
            $sql .= " and d.fechacontable <= '{$filtro['fecha']}'";
        }
        if ($alias == "'facturaLog'") {
            $join = "INNER JOIN mod_logistica.dat_producto _p ON _p.idproducto = m.idproducto ";
            $idestructura = "_p.idestructura";
        }
        return "(SELECT sum(round(m.{$campo},2)) FROM mod_logistica.dat_movimiento m {$join}"
                . "INNER JOIN mod_logistica.dat_documento d ON d.iddocumento = m.iddocumento "
                . "INNER JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = d.iddoc "
                . "INNER join mod_datosmaestros.nom_docprim np ON np.iddocumentos = dp.iddocumentos "
                . "WHERE np.abreviatura IN ({$alias}) AND dp.iddoc IN ({$iddoc}) AND d.estado = {$estado} "
                . "AND e.idestructuraop = {$idestructura} AND d.cronologia > 0 {$sql})";
    }

    private function selectReevaluacion($alias, $fecha = null) {
        $sql = '';
        $sql1 = '';
        if ($fecha) {
            $sql .= " and dd.fechacontable < '{$fecha}'";
            $sql1 .= " and dd1.fechacontable < '{$fecha}'";
        }
        return "(
            coalesce(
                (SELECT sum(mm.importecontable) 
                FROM mod_logistica.dat_movimiento mm 
                INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = mm.idproducto 
                INNER JOIN mod_logistica.dat_documento dd ON dd.iddocumento = mm.iddocumento 
                INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc 
                INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos 
                WHERE ndp.abreviatura = {$alias} AND dp.idestructura = e.idestructuraop AND mm.signo = '+' {$sql})
            , 0) - 
            coalesce(
                (SELECT sum(mm.importecontable) 
                FROM mod_logistica.dat_movimiento mm 
                INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = mm.idproducto 
                INNER JOIN mod_logistica.dat_documento dd ON dd.iddocumento = mm.iddocumento 
                INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc 
                INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos 
                WHERE ndp.abreviatura = {$alias} AND dp.idestructura = e.idestructuraop AND mm.signo = '-' {$sql})
            , 0) + 
            coalesce(
                (SELECT sum(round(dm1.importetotalalt, 2)) AS importe 
                FROM mod_logistica.dat_movimiento dm1 
                INNER JOIN mod_logistica.dat_producto dp1 ON dm1.idproducto = dp1.idproducto 
                WHERE idmovimiento IN (
                        SELECT(
                            SELECT mm1.idmovimiento FROM mod_logistica.dat_movimiento mm1 
                            INNER JOIN mod_logistica.dat_documento dd1 ON dd1.iddocumento = mm1.iddocumento
                            WHERE mm1.idproducto = dp.idproducto AND mm1.cronologia > 0 {$sql1}
                            AND mm1.cronologia < mm.cronologia AND mm1.signo <> 'N' 
                            ORDER BY mm1.cronologia DESC LIMIT 1
                        )
                        FROM mod_logistica.dat_movimiento mm 
                        INNER JOIN mod_logistica.dat_producto dp ON dp.idproducto = mm.idproducto 
                        INNER JOIN mod_logistica.dat_documento dd ON dd.iddocumento = mm.iddocumento 
                        INNER JOIN mod_datosmaestros.dat_documentoprim ddp ON ddp.iddoc = dd.iddoc 
                        INNER JOIN mod_datosmaestros.nom_docprim ndp ON ndp.iddocumentos = ddp.iddocumentos 
                        WHERE ndp.abreviatura = {$alias} AND dp.idestructura = e.idestructuraop {$sql}
                    ) 
                )
            , 0)
        )";
    }

    public function getValorOperacion($params, $arrAlias, $subsistema = LogisticaGlobal::SUBSISTEMA_INV, $estado = null) {
        if ($subsistema == LogisticaGlobal::SUBSISTEMA_FAC) {
            /* $queryTemp = Doctrine_Query::create()->select('idfactura')
              ->from('DatDocfactura')->where('iddeposito = ?', array($params['idestructura']))->fetchArray();
              $params['iddocumento'] = $this->objectHelper->extractValueFromArrayColumn($queryTemp, 'idfactura');
              unset($params['idestructura']);
              if (count($params['iddocumento']) == 0) {
              return 0;
              } */
            $facturaService = new FacturacionService();
            $arrayImportes = $facturaService->getImportesFacturaReportes($params);
            return $arrayImportes['importecontable'];
        }
        $dql = $this->producto->getMovimientoModel()->getQueryValorMovimientos($params);
        $alias = $this->findIddocsByAlias($arrAlias, $subsistema);
        $dql->whereIn('iddoc', $alias);

        $documento = new DocumentoLogisticaModel(array('noexception' => true));
        $params['estado'] = is_null($estado) ? array(
            EstadoDocumentoModel::ESTADO_CONTABILIZADO, EstadoDocumentoModel::ESTADO_APROBADO) : $estado;
        $documento->addFiltersQueryDocumento($dql, $params);
        $query = $dql->fetchArray();
        return $query[0]['importe'];
    }

    private function findIddocsByAlias($arrAlias, $subsistema) {
        $result = array();
        if (!is_array($arrAlias)) {
            $arrAlias = array($arrAlias);
        }
        foreach ($arrAlias as $alias) {
            //if (!array_key_exists($alias, $this->arrayIddocs)) {       
            $iddoc = $this->serviciosIddoc->devuelveIddocByIdEstructura(
                    $alias, $this->global->Estructura->idestructura, $subsistema
            );
            if (!empty($iddoc->iddoc)) {
                array_push($result, $iddoc->iddoc);
            }
        }
        return $result;
    }

    public function getImporteTotal($params) {
        $params['asentado'] = true;
        $query = $this->producto->getQueryProducto('p', false);
        $query->select("round(SUM(p.importe),2) as importe");
        $this->producto->addFiltersQueryDatProducto($query, 'p', $params, false);
        $result = $query->fetchArray();
        return $result[0]['importe'];
    }

    public function devolverValorPeriodos($datosPeriodos) {
        $datos = array(
            'compras' => array(),
            'ventas' => array(),
        );
        foreach ($datosPeriodos as $periodo) {
            array_push(
                    $datos['compras'], $this->getValorOperacion(
                            array('idperiodo' => $periodo['idperiodo']), 'aperturaLog'
                    ) +
                    $this->getValorOperacion(array('idperiodo' => $periodo), 'recepcionLog') +
                    $this->getValorOperacion(array('idperiodo' => $periodo), 'valedev')
            );
            array_push(
                    $datos['ventas'], $this->getValorOperacion(
                            array('idperiodo' => $periodo), 'facturaLog', LogisticaGlobal::SUBSISTEMA_FAC
                    )
            );
        }
        return array('datos' => $datos);
    }
    
    public function devolverValorDepositosxFecha($filtro) {

        if(!$filtro['fechainicio']){
          $filtro['fechainicio'] = date('d/m/Y');
        }
        $filtro['fechainicio'] = "'".$filtro['fechainicio']."'";
        $idestructura = $this->global->Estructura->idestructura;
        if(!$filtro['iddepositos']){
            $datosDepositos = $this->loadDepositos();
            $iddepositos = $this->objectHelper->extractValueFromArrayColumn($datosDepositos['datos'], 'iddeposito');
            $strdepositos = implode(', ', $iddepositos);
        }else{
            $strdepositos = $filtro['iddepositos'];
            $iddepositos = explode(',',$filtro['iddepositos']);
        }
        $arrAlias = array('aperturaLog', 'recepcionLog', 'valedev', 'valeLog', 'transferenciaLog', 'ajusteLog');
        $arrAliasFact = array('facturaLog','compventaLog','compdevLog');
        $aliasInv = $this->findIddocsByAlias($arrAlias, LogisticaGlobal::SUBSISTEMA_INV);
        $aliasFact = $this->findIddocsByAlias($arrAliasFact, LogisticaGlobal::SUBSISTEMA_FAC);
        $striddoc = implode(', ', array_merge($aliasInv, $aliasFact));
        
        $iddocs = "'{".$striddoc."}'";
        $depositos = "'{".$strdepositos."}'";
        
        $filtro['fecha'] = ($filtro['fecha'])? $filtro['fecha'] : date('d/m/Y');
        $filtro['fecha'] = "'".$filtro['fecha']."'";
        $detalle = 0;
        $diferencias = 0;
        if ($filtro['iddetalle']) {
            $detalle = $filtro['iddetalle'];
        }
        if ($filtro['diferencias']) {
            $diferencias = 1;
        }
        $idEstructura = $this->global->EstructuraEconomica->idestructuracomun;
        $fechaSubsist = $this->integrator->datosmaestros->fechaContableSubsistema($idEstructura, LogisticaGlobal::SUBSISTEMA_INV);
    
        $sql = "SELECT * FROM mod_loginventario.f_recvalordepositobyfecha (($depositos), "
        . "{$idestructura}, 10, {$iddocs},{$filtro['fecha']}, {$filtro['fechainicio']}, {$detalle} ,{$filtro['start']}, {$filtro['limit']}, {$diferencias}, '$fechaSubsist') q";
        
      //print_r($sql);die;
        $datos = Doctrine_Manager::connection()->fetchAll($sql);
        return array(
            'cantidad' => $datos[0]['total'], 'datos' => $datos,
            'iddocs' => (!empty($striddoc)) ? "{" . $striddoc . "}" : null,
            'iddepositos' => (!empty($strdepositos)) ? "{" . $strdepositos . "}" : null,
            'fechasubsistema'=> $fechaSubsist 
        );
    }

    public function restablecerDisponible($idestructura) {
        foreach ($idestructura as $id) {
            $sql = "SELECT * FROM mod_loginventario.fn_actualizarsubmayoresalmacen ({$id})";
            Doctrine_Manager::connection()->fetchAll($sql);
        }
        return true;
    }

}
