<?php

class TalleresComprobanteModel extends LogisticaComprobanteModel {

    protected $dualidad, $idCentroCosto;

    public function __construct() {
        parent::__construct();
        $this->dualidad = LogisticaGlobal::__init()->getMonedaEntidad();
    }

    public function generarPases($idDocumento, $modelo, &$pases, $idOperacion, $nroDoc, $estado, $importeAnticipos = 0)
    {
         $queryData = Doctrine_Query::create()->select('coalesce(idcliente,-1) as idcentrocosto')->from('DatDocumentoCliente')
            ->where('iddocumento = ? and tipocliente = 2', array($idDocumento))->fetchOne();
         $this->idCentroCosto = $queryData->idcentrocosto;
        parent::generarPases($idDocumento, $modelo, $pases, $idOperacion, $nroDoc, $estado, $importeAnticipos);
    }

    public function cargarDocContabilizados($parametros) {
        $estado = array(EstadoDocumentoModel::ESTADO_CERRADO);
        if ($parametros['estado']) {
            $estado = array($parametros['estado']);
        }
        $idejercicio = $this->configuracionHelper->getEjercicioActualSubsistema(
                $this->global->Estructura->idestructura,
                LogisticaGlobal::SUBSISTEMA_TALLERES
                );
        $fecha = $this->configuracionHelper->obtenerEjercicio($idejercicio);
        $service = new OrdenTrabajoTalleresService();
        $documentos = $service->getOrdenesTrabajoCerradas(
            array_merge($parametros, array(
                'comprobante' => 1,
                'estado' => $estado,
                'fechacierre' => $fecha[0]->fin
            ))
        );
        return $documentos;
    }

    public function generarPase($idDocumento, $pase, $estado, $devfac = false, $importeAnticipos = 0) {
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        $objPase = $this->inicializarPase($pase);
        $signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        $documento = Doctrine::getTable('DatDocumento')->find($idDocumento);
        if ($pase['tipocuenta'] == 'fija') {
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($pase['cuenta']);
            $objPase->idcuenta = $cuenta->idcuenta;
        }
        else {

        }
        $pases = $this->completarPase($objPase, $pase, $idDocumento, false, 0);
        return count($pases) > 0 ? $pases : $objPase;
    }

    public function completarPase(&$objPase, $pase, $idDocumento, $devfac = false, $importeAnticipos = 0) {
        $moneda = LogisticaGlobal::__init()->getMonedaEntidad();
        if (count($pase['sustituciones'])) {
            foreach ($pase['sustituciones'] as $pos => $sustitucion) {
                /*
                 * 119 Centro de costo
                 */
                if ($sustitucion['valor'] == 119) {
                    /* $queryData = Doctrine_Query::create()->select('coalesce(idcentrocosto,-1) as idcentrocosto')->from('DatDocfactura')
                                     ->where('idfactura = ?', array($idDocumento))->fetchOne();*/
                    $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, $sustitucion['parteformato'], $this->idCentroCosto);
                }
                elseif ($sustitucion['valor'] == 502 || $sustitucion['valor'] == 526) {
                    /**
                     * Aperetura para el servicio
                     */
                    return $this->getServiciosProductoCodigoIng($idDocumento, $pase, $objPase, $sustitucion['valor']);
                }elseif ($sustitucion['valor'] == 507) {
                    /**
                     * Aperetura para el servicio
                     */
                    return $this->getServiciosProductoCodigoCosto($idDocumento, $pase, $objPase);
                }elseif ($sustitucion['tipo'] == 'refestatica') {
                    $idcuenta = $objPase->idcuenta;
                    $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
                    $concate = $cuenta->concatcta . '.' . $sustitucion['valor'];
                    $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
                    $objPase->idcuenta = $cuentaE->idcuenta;
                }
            }
        }
        switch ($pase['valor']['valor']) {
            case 108 :
                /**
                 * @todo Calcular el importe total del documento en el cmp documento
                 */
                $objPase->importe = $this->importePrecioPromedio($idDocumento);
                $objPase->importemb = $objPase->importe;
                $objPase->importemo = $objPase->importe;
                break;
        }
    }

    public function importePrecioPromedio ($iddocumento, $campo = 'preciocontable') {
        $signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        /*$sqlProducto = "select sum(round(m.{$campo},2)-coalesce((select sum(round(dm1.{$campo},2)) from mod_logistica.dat_movimiento dm1
          inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = dm1.iddocumento
		 inner join mod_logistica.dat_documentopadre ddp2 on ddp2.iddocumento = dm1.iddocumento
		 where dd1.estado = 4 and ddp2.idpadre = dd.iddocumento and dm1.signo = '+'  and dm1.idproducto = m.idproducto
		 )
		 ,0)) from mod_logistica.dat_documentopadre ddp 				
				inner join mod_logistica.dat_movimiento m on m.iddocumento = ddp.iddocumento 
				inner join mod_logistica.dat_producto dp on dp.idproducto = m.idproducto				
				inner join mod_logistica.dat_documento dd on dd.iddocumento = m.iddocumento        
				where ddp.idpadre = {$iddocumento} and dd.estado = 4 and m.signo='{$signo}'";*/

        $sqlProducto = "select sum(round(
                    coalesce(m.{$campo},0)*(
                    m.cantidad-coalesce((select sum(dm1.cantidad) from mod_logistica.dat_movimiento dm1
                          inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = dm1.iddocumento
                         inner join mod_logistica.dat_documentopadre ddp2 on ddp2.iddocumento = dm1.iddocumento
                         where dd1.estado = 4 and ddp2.idpadre = dd.iddocumento and dm1.signo = '+'  and dm1.idproducto = m.idproducto
                         )
                         ,0)
                )
                ,2)) from mod_logistica.dat_documentopadre ddp 				
				inner join mod_logistica.dat_movimiento m on m.iddocumento = ddp.iddocumento 
				inner join mod_logistica.dat_producto dp on dp.idproducto = m.idproducto				
				inner join mod_logistica.dat_documento dd on dd.iddocumento = m.iddocumento        
				where ddp.idpadre = {$iddocumento} and dd.estado = 4 and m.signo='{$signo}'";

			$importe = LogisticaDoctrineHelper::__init()->getConnection()->execute(
				"select coalesce((
				{$sqlProducto}
				),0)"
				)->fetchAll(PDO::FETCH_COLUMN);
			return $importe[0];
		}
	// Eliminado 24/3/2022
    /*public function getServiciosProductoCodigoCosto($idDocumento, $pase, $pObjectPase = null) {
        if (
            $pase['valor']['valor'] == 108
        ) {
            $idmoneda = $this->dualidad->idmoneda;
            $campo = 'preciocontable';
            $iso = $this->dualidad->codigoiso;
        } else {
            $idmoneda = $this->dualidad->idmonedaalternativa;
            $campo = 'precioalternativo';
            $iso = $this->dualidad->codigoisoalt;
        }
        $signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        $sqlProductos = "select distinct nnat.codigocontable as codigoauxiliar, sum(coalesce(round((dm.{$campo} * dm.cantidad),$this->fRedondeo6),0)) as importe 
                    from mod_logistica.dat_movimiento dm
				inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dp.idindicador
				inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
				inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
				inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = dm.iddocumento
                left join mod_logistica.dat_documentopadre ddp1 on ddp1.idpadre = ddp.iddocumento 
                where ddp.idpadre = {$idDocumento} and dd.estado = 4 and dm.signo = '{$signo}' group by nnat.codigocontable";

        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sqlProductos);
        $pases = array();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase);
            $objPase->idmoneda = $idmoneda;
            $objPase->moneda = $iso;
            $idcuenta = $pObjectPase->idcuenta;
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
            $concate = $cuenta->concatcta . '.' . $value['codigoauxiliar'];
            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            $idcuenta = $cuentaE->idcuenta;
            $objPase->idcuenta = $idcuenta;
            $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $this->idCentroCosto);
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }*/
	// Hasta aki
	
	public function getServiciosProductoCodigoCosto($idDocumento, $pase, $pObjectPase = null) {
		if ($pase['valor']['valor'] == 108) {
			$idmoneda = $this->dualidad->idmoneda;
			$campo = 'preciocontable';
			$iso = $this->dualidad->codigoiso;
		} else {
			$idmoneda = $this->dualidad->idmonedaalternativa;
			$campo = 'precioalternativo';
			$iso = $this->dualidad->codigoisoalt;
		}
		$signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
		$sqlProductos = "select distinct nnat.codigocontable as codigoauxiliar,
			sum(coalesce(round((dm.{$campo} * (dm.cantidad -
			coalesce((select sum(dm1.cantidad) from mod_logistica.dat_movimiento dm1
			inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = dm1.iddocumento
			inner join mod_logistica.dat_documentopadre ddp2 on ddp2.iddocumento = dm1.iddocumento
			where dd1.estado = 4 and ddp2.idpadre = dd.iddocumento and dm1.idproducto = dm.idproducto and dm1.signo = '+'
			)
			,0))),$this->fRedondeo6),0)) as importe
			from mod_logistica.dat_movimiento dm
			inner join mod_logistica.dat_documento dd on dd.iddocumento = dm.iddocumento
			inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
			inner join mod_datosmaestros.nom_indicadorhoja nih on nih.idindicador = dp.idindicador
			inner join mod_datosmaestros.nom_indicador ni on ni.idindicador = dp.idindicador
			inner join mod_datosmaestros.nom_naturaleza nnat on ni.idnaturaleza = nnat.idnaturaleza
			inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = dm.iddocumento
			--left join mod_logistica.dat_documentopadre ddp1 on ddp1.idpadre = ddp.iddocumento
			where ddp.idpadre = {$idDocumento} and dd.estado = 4 and dm.signo = '{$signo}' group by nnat.codigocontable";

        $datos = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sqlProductos);
        $pases = array();
        foreach ($datos as $value) {
            $value['importemb'] = $value['importe'];
            $value['importemo'] = $value['importe'];
            $objPase = $this->inicializarPase($pase);
            $objPase->idmoneda = $idmoneda;
            $objPase->moneda = $iso;
            $idcuenta = $pObjectPase->idcuenta;
            $cuenta = $this->contabilidadHelper->obtenerCuentaPorId($idcuenta);
            $concate = $cuenta->concatcta . '.' . $value['codigoauxiliar'];
            $cuentaE = $this->contabilidadHelper->obtenerCuentaPorConcat($this->global->Estructura->idestructura, $concate);
            $idcuenta = $cuentaE->idcuenta;
            $objPase->idcuenta = $idcuenta;
            $objPase->idcuenta = $this->getCuentaAperturaNivel($objPase->idcuenta, null, $this->idCentroCosto);
            $this->objectHelper->synchronize($objPase, $value);
            array_push($pases, $objPase);
        }
        return $pases;
    }

}
