<?php

/**
 * @class DevolucionModel
 * (Descripcion de la clase, objetivo)
 *
 * @package Inventario
 * @subpackage Entrada
 * @author Dainier Aguila Medina
 * @copyright XETID
 * @version 1.0
 */
class DevolucionModel extends EntradaModel
{

    private $_dualidad;
    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->tryInyector();
        $this->_dualidad = LogisticaGlobal::__init()->getMonedaEntidad();
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @param array $datosDoc Arreglo de datos del documento con sus preductos.
     * @param boolean $dql Bandera que indica si devuelve la consulta.
     * @return array/Doctrine_Query
     */
    public function devolverDocumentos($datosDoc = array(), $dql = false)
    {
        $query = parent::devolverDocumentos($datosDoc);
        $devolucion = new DatValedevolucion();
        $devolucion->getJoinDatValedevolucion($query, $datosDoc, 'd');
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->cargarClientesDocumentos(
                $this->logisticaDoctrine->addQueryLimits($query, $datosDoc)->fetchArray()
            )
        );
    }

    /**
     * Adiciona un documento.
     * @param array $datosDoc Arreglo de datos del documento con sus preductos.
     * @return numeric
     */
    public function adicionarDocumento($datosDoc = array())
    {
        $documento = parent::adicionarDocumento($datosDoc);
        $documento->save();
        $this->trazaDocumento->guardarTraza('Documento adicionado', $documento->iddocumento);
        if ($datosDoc['idproductos'] && count($datosDoc['idproductos']) > 0) {
            $this->producto->adicionarMovimientos(
                $documento->iddocumento, $datosDoc['idproductos'], LogisticaMovimientoModel::SIGNO_MOV_SUMA
            );
        }
        if (is_array($datosDoc['productos']) && count($datosDoc['productos']) > 0) {
            $datosDoc['productos'][0]['entrada'] = 1;
            $this->producto->modificarMovimientos($datosDoc['productos']);
        }
        if (is_array($datosDoc['lotes']) && count($datosDoc['lotes']) > 0) {
            $array = array('collection' => true, 'signo' => '+', 'actualizarMov' => true);
            $this->loteService->adicionarLote($datosDoc['lotes'], $array);
        }
        $this->actualizarProductoCmplto($datosDoc['iddocumento']);
        return $documento->iddocumento;
    }

    /**
     * Confirma el vale de devolución.
     * @param numeric $iddocumento
     */
    public function confirmarDocumento($iddocumento)
    {
        Doctrine_Query::create()->update('DatMovimientos')->set('signo',"'+'")
          ->where('iddocumento = ?', array($iddocumento))->execute();
        $this->actualizarMovUbicacion($iddocumento);
        return parent::confirmarDocumento($iddocumento);
    }

    /**
     * Contabiliza un documento.
     * @param numeric $iddocumento (identificador de documento).
     * @return boolean
     */
    public function contabilizarDocumento($iddocumento)
    {
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $this->actualizarUbicacion($iddocumento, true);
        $cronologia = parent::contabilizarDocumento($iddocumento);
        if ($this->existComponent('log.inv.municiones')) {
            $municionesService = new MunicionesService();
            $municionesService->aprobarPartida($iddocumento);
        }
        $this->nroSerieService->actualizarEstadoNumeroSerie($iddocumento);
        $this->loteService->actualizarExistenciaLote($iddocumento, true, $cronologia);
        if ($config['comprobante']) {
            $comp = $this->generarComprobante($iddocumento, LogisticaGlobal::SUBSISTEMA_INV);
            $resultado['comprobante'] = $comp[0];
        }
        return array(
            'success' => true,
            'comprobante' => (isset($resultado) ? $resultado['comprobante'] : false)
        );
    }

    /**
     * Elimina un documento dado su identificador.
     * @return boolean
     */
    public function eliminarDocumento($iddocumento)
    {
        $this->actualizarProductoCmplto($iddocumento, true);
        $idProductos = parent::getProductoModel()->devolverMovimientos(array('iddocumento' => $iddocumento));
        foreach ($idProductos['datos'] as $value) {
            $arrIdProd[] = $value['idmovimiento'];
        }
        $arrIdProd = json_encode($arrIdProd);
        Doctrine_Query::create()
            ->delete('DatDocumentoPadre dp')
            ->where('dp.iddocumento = ?', array($iddocumento))
            ->execute();
        parent::getProductoModel()->eliminarMovimientos($iddocumento, $arrIdProd, false, false);
        return parent::eliminarDocumento($iddocumento);
    }

    /**
     * Devuelve los movimientos del vale de devolución.
     * @param array $filtro
     * @return array
     */
    public function devolverMovimientos($filtro)
    {
        $query = $this->getProductoModel()->devolverMovimientos($filtro, true);
        $maestroP = new MaestroProductoModel();
		$query->addSelect(
            "(SELECT DISTINCT m2.cantidad FROM DatMovimientos m2 "
            . "INNER JOIN m2.DatDocumento d ON d.iddocumento = m2.iddocumento "
            . "INNER JOIN d.DatDocumentoPadre dp ON dp.idpadre = d.iddocumento "
            . "WHERE dp.iddocumento = mov.iddocumento AND m2.idproducto = mov.idproducto) AS cantentregada, "
            . 'COALESCE((SELECT sum(m3.cantidad) FROM DatMovimientos m3 INNER JOIN m3.DatDocumento d2 '
			. 'ON d2.iddocumento = m3.iddocumento INNER JOIN d2.DatDocumentoPadre dp2 ON d2.iddocumento = dp2.iddocumento '
			. 'WHERE d2.estado <> 7 AND d2.iddocumento <> mov.iddocumento AND dp2.idpadre = (SELECT dp3.idpadre FROM DatDocumentoPadre dp3 WHERE dp3.iddocumento = mov.iddocumento) '
			. 'AND m3.idproducto = mov.idproducto), 0)  AS resto'
        );
        /*$query->addSelect(
            "(SELECT DISTINCT m2.cantidad FROM DatMovimientos m2 "
            . "INNER JOIN m2.DatDocumento d ON d.iddocumento = m2.iddocumento "
            . "INNER JOIN d.DatDocumentoPadre dp ON dp.idpadre = d.iddocumento "
            . "WHERE dp.iddocumento = mov.iddocumento AND m2.idproducto = mov.idproducto) AS cantentregada, "
            . 'coalesce((SELECT sum(m3.cantidad) FROM DatMovimientos m3 INNER JOIN m3.DatDocumentoPadre dp2 '
            . 'ON dp2.iddocumento = m3.iddocumento INNER JOIN dp2.DatDocumento d2 ON d2.iddocumento = dp2.idpadre '
			. 'INNER JOIN d2.DatDocumentoPadre dp3 ON dp3.idpadre = d2.iddocumento '
            . 'INNER JOIN m3.DatDocumento dd3 ON dd3.iddocumento = m3.iddocumento '
            . 'AND dp3.iddocumento <> dp2.iddocumento WHERE m3.iddocumento <> mov.iddocumento '
            . 'AND m3.idproducto = mov.idproducto AND dp3.iddocumento = mov.iddocumento AND dd3.estado <> 7'
            . 'GROUP BY m3.idproducto), 0) AS resto'
        );*/
        $query->addSelect('(case when (mov.existenciaactual-mov.cantidad) > 0 then (mov.existenciaactual-mov.cantidad) else 0 end) AS actual');  
        return array(
            'cantidad' => $query->count(),
            'datos' => $maestroP->addSelectionData($this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray())
        );
    }

    public function eliminarMovimientos($arrIdMov)
    {
        $doc = Doctrine_Query::create()
            ->select('m.iddocumento')
            ->from('DatMovimientos m')
            ->whereIn('idmovimiento', $arrIdMov)
            ->fetchArray();
        $this->actualizarProductoCmplto($doc[0]['iddocumento'], true, $arrIdMov);
        $this->getProductoModel()->eliminarMovimientos(false, $arrIdMov, false, false);
    }

    /**
     * Genera un vale de devolución a partir de un vale de entrega o una factura.
     * @param array $datosDoc
     * @return array
     */
    public function generarDocumento($datosDoc)
    {
        $idCopia = parent::copiarDocumento($datosDoc['iddocumento'], false, true, true);
        $cliente = Doctrine::getTable('DatDocumentoCliente')
                ->findByDql('iddocumento = ?', array($datosDoc['iddocumento']))->getFirst()->toArray();
        $arrayClientes[] = $cliente;
        $this->cargarClientesDocumentos($arrayClientes);
        $datos = Doctrine::getTable('DatDocumento')->find($idCopia)->toArray();
        $datos['iddoc'] = $this->getIddoc();
        $datos['idestructuracomun'] = $datosDoc['idestructura'];
        $datos['idcentrocosto'] = $cliente['idcliente'];
        $datos['numeroref'] = $this->devolverUltimoNumeroDoc(
            $datos['iddoc'], $datos['idestructuracomun'], $datos['idejercicio']
        );
        $documento = parent::adicionarDocumento($datos);
        $documento->save();
        $docPadre = new DatDocumentoPadre();
        $docPadre->synchronizeWithArray(array('iddocumento' => $idCopia, 'idpadre' => $datosDoc['iddocumento']));
        $docPadre->save();
        $this->actuaizarPrecio($datosDoc['iddocumento'], $idCopia);
        $docCliente = new DatDocumentoCliente();
        $docCliente->synchronizeWithArray(
            array(
                'iddocumento' => $idCopia, 'idcliente' => $cliente['idcliente'],
                'tipocliente' => $cliente['tipocliente']
            )
        );
        $docCliente->save();
        $this->actualizarProductoCmplto($idCopia);
        $movimientos = Doctrine::getTable('DatMovimientos')->findByDql('iddocumento = ?', array($idCopia));

        $collection = new Doctrine_Collection('DatMovdevolucion');
        foreach ($movimientos as $mov) {
            $movVale = Doctrine::getTable('DatMovimientos')->findByDql('iddocumento = ? and idproducto = ?', array($datosDoc['iddocumento'], $mov->idproducto));
            $movEntrega = Doctrine::getTable('DatMoventrega')->findByDql('idmovimiento = ?', array($movVale[0]->idmovimiento));
            if (count($movEntrega) && $movEntrega[0]->idordenactividad) {
                $movDev = new DatMovdevolucion();
                $movDev->idmovimiento = $mov->idmovimiento;
                $movDev->idordenactividad = $movEntrega[0]->idordenactividad;
                $movDev->cantidad = $mov->cantidad;
                $collection->add($movDev);
            }
        }
        if (count($collection)) {
            $collection->save();
        }
        return array(
            'iddocumento' => $idCopia, 'idpadre' => $datosDoc['iddocumento'], 'numeroref' => $documento->numeroref,
            'fechacontable' => $documento->fechacontable, 'descripcliente' => $arrayClientes[0]['descripcliente'],
            'observaciones' => $datos['observaciones']
        );
    }
    
    /**
     * Actualiza los precio de los movimientos del vale de devolucion.
     * @param numeric $idorigen
     * @param numeric $iddocumento
     */
    private function actuaizarPrecio($idorigen, $iddocumento)
    {
        $movimientos = $this->getProductoModel()->getMovimientoModel()
            ->devolverMovimientos(array('iddocumento' => $idorigen))
            ->addSelect("(SELECT mm.idmovimiento FROM DatMovimientos mm WHERE mm.iddocumento = {$iddocumento} AND mm.idproducto = mov.idproducto) AS idmov")
            ->addSelect("(COALESCE((SELECT SUM(m3.cantidad) FROM DatMovimientos m3 INNER JOIN m3.DatDocumento d2 ON (d2.iddocumento = m3.iddocumento)
			                  INNER JOIN d2.DatDocumentoPadre dp2 ON (d2.iddocumento = dp2.iddocumento) 
                  			WHERE d2.estado <> 7 AND d2.iddocumento <> {$iddocumento} AND 
                        dp2.idpadre = {$idorigen} 
	                      AND m3.idproducto = mov.idproducto), 0)) AS devuelto")
            ->innerJoin('mov.DatDocumentoPadre dp ON (dp.idpadre = mov.iddocumento)')
            ->innerJoin('dp.DatMovimientos m')->addWhere('m.iddocumento = ?', $iddocumento)
            ->fetchArray();
        if ($this->_dualidad->idmonedaalternativa) {
            foreach ($movimientos as $mov) {
                $arrayMov[] = array(
                    'idmovimiento' => $mov['idmov'], 'preciocontable' => $mov['preciocontable'],
                    'precioalternativo' => $mov['precioalternativo'], 'signo' => LogisticaMovimientoModel::SIGNO_MOV_SUMA, 'entrada' => 1,
                    'cantidad' => $mov['cantidad'] - $mov['devuelto'],
                    'idelementogasto' => $mov['idelementogasto'], 'idelementogastoalt' => $mov['idelementogastoalt']
                );
            }
        } else {
            foreach ($movimientos as $mov) {
                $arrayMov[] = array(
                    'idmovimiento' => $mov['idmov'], 'preciocontable' => $mov['preciocontable']+$mov['precioalternativo'],
                    'precioalternativo' => 0, 'signo' => LogisticaMovimientoModel::SIGNO_MOV_SUMA, 'entrada' => 1,
                    'cantidad' => $mov['cantidad'] - $mov['devuelto'],
                    'idelementogasto' => $mov['idelementogasto']
                );
            }
        }
        $this->getProductoModel()->modificarMovimientos($arrayMov);
    }

    /**
     * Devuelve los vales de entrega.
     * @param array $filtro
     * @return array
     */
    public function cargarDocSalida($filtro)
    {
        $filtro['tipo'] = 3;
        //$id = $this->configuracionHelper->getEjercicioActualSubsistema($this->idestructuracomun, $this->idSubsistema);
        $salidaService = new DocumentosalidaService();
        $query = $salidaService->devolverDocumentos($filtro, true);
        $query->addWhere(
            'coalesce((SELECT (CASE WHEN pcto.iddocumento IS NOT NULL AND sum(pcto.cantidad) > sum(pcto.entregado) '
            . 'THEN 1 ELSE 0 END) FROM DatProductocmplto pcto WHERE pcto.iddocumento = d.iddocumento '
            . 'GROUP BY pcto.iddocumento), 1) = 1 '
        );
        $query->leftJoin('d.DatDocumentoPadre ddp')->addWhere(
            '((SELECT dd.estado FROM DatDocumento dd WHERE dd.iddocumento = ddp.idpadre) <> 9 OR (SELECT dd1.estado FROM DatDocumento dd1 WHERE dd1.iddocumento = ddp.idpadre) = 9 AND (SELECT COUNT(df.idfactura) FROM DatDocfactura df INNER JOIN df.DatDocumento dd2 INNER JOIN dd2.DatDocumentoPadre ddp1 WHERE ddp1.idpadre = ddp.idpadre AND dd2.estado <> 7) = 0)'
        );
        return array(
            'cantidad' => $query->count(), 'datos' => $this->cargarClientesDocumentos(
                $this->logisticaDoctrine->addQueryLimits($query, $filtro)->fetchArray()
            )
        );
    }

    /**
     * Devuelve las facturas y conduce.
     * @param array $filtro
     * @return array
     */
    public function cargarDocFactura($filtro)
    {
        $facturacionService = new FacturacionService();
        $query = $facturacionService->getfacturasContabilizadasCliente($filtro, true);
        $query->addSelect('sum(pcto.cantidad) AS suma, sum(pcto.entregado) AS entregado')
            ->leftJoin('dd.DatProductocmplto pcto ON (pcto.iddocumento = dd.iddocumento)')
            ->having('
                (SUM(pcto.cantidad) IS NULL AND SUM(pcto.entregado) IS NULL)
                OR 
                (SUM(pcto.cantidad) > SUM(pcto.entregado))
            ')
            ->groupBy('df.idfactura, dd.iddocumento, ddc.idcliente, ddc.tipocliente, pcto.iddocumento, df.nrofactura, dd.fechacontable');
        $datos = $this->logisticaDoctrine->addQueryLimits($query, $filtro)->fetchArray();
        /*foreach ($datos as $key => $value) {
            if ($value['suma']) {
              if ($value['suma'] && $value['suma'] <= $value['entregado']) {
                  unset($datos[$key]);
              }
            }
        }*/
        return array('cantidad' => $query->count(), 'datos' => $this->cargarClientesDocumentos($datos));
    }

    /**
     * Actualiza el cumplimiento de devolución de los productos del documento.
     * @param numeric $iddocumento
     * @param boolean $borrar [Opcional]
     * @param array $idmovimientos [Opcional]
     * @return boolean
     */
    public function actualizarProductoCmplto($iddocumento, $borrar = false, $idmovimientos = array())
    {
        $resto = "coalesce((SELECT sum(_m.cantidad) FROM DatMovimientos _m INNER JOIN _m.DatDocumentoPadre _dp "
            . "ON (_dp.iddocumento = _m.iddocumento AND _dp.idpadre = dp.idpadre) WHERE _m.idproducto = pc.idproducto "
            . "AND _m.iddocumento NOT IN ({$iddocumento}) GROUP BY _m.idproducto), 0)";
        if ($borrar) {
            $query = Doctrine_Query::create()
                ->select("pc.idproductocmplto, {$resto} AS resto")
                ->from('DatProductocmplto pc')
                ->innerJoin('pc.DatDocumento d')
                ->innerJoin('d.DatDocumentoPadre dp ON (dp.idpadre = d.iddocumento)')
                ->where('dp.iddocumento = ?', $iddocumento);
            if (is_array($idmovimientos) && count($idmovimientos) > 0) {
                $query->innerJoin(
                        'dp.DatMovimientos m ON (m.iddocumento = dp.iddocumento AND m.idproducto = pc.idproducto)'
                    )
                    ->whereIn('m.idmovimiento', $idmovimientos);
            }
        } else {
            $query = Doctrine_Query::create()
                ->select(
                    "m.iddocumento, m.idproducto, pc.idproductocmplto AS idproductocmplto, m.cantidad, "
                    . "coalesce(m2.cantidad, 0) AS entregado, {$resto} AS resto"
                )
                ->from('DatMovimientos m')
                ->innerJoin('m.DatDocumentoPadre dp ON (dp.idpadre = m.iddocumento)')
                ->innerJoin(
                    'dp.DatMovimientos m2 ON (m2.iddocumento = dp.iddocumento AND m2.idproducto = m.idproducto)'
                )
                ->leftJoin(
                    'm.DatProductocmplto pc ON (pc.iddocumento = m.iddocumento AND pc.idproducto = m.idproducto)'
                )
                ->where('dp.iddocumento = ?', $iddocumento);
        }
        $datos = $query->fetchArray();
        $collection = new Doctrine_Collection('DatProductocmplto');
        foreach ($datos as $value) {
            $value['entregado'] = $borrar ? $value['resto'] : $value['resto'] + $value['entregado'];
            $prodCmplto = new DatProductocmplto();
            if ($value['idproductocmplto']) {
                $prodCmplto->assignIdentifier($value['idproductocmplto']);
            }
            $prodCmplto->synchronizeWithArray($value);
            $collection->add($prodCmplto);
        }
        if ($collection->count()) {
            $collection->save();
        }
        return true;
    }

    /**
     * Devuelve un arreglo con los lotes del producto a devolver.
     * @param array $filtro
     * @return array
     */
    public function cargarLotes($filtro)
    {
        $query = $this->loteService->cargarUbicacionesLote($filtro, true)
            ->addSelect(
                'coalesce((SELECT ml5.cantidad FROM DatMovlote ml5 WHERE ml5.idlote = l.idlote AND '
                . 'ml5.idmovimiento = m2.idmovimiento AND ml5.idubicacion = ul.idubicacion), 0) AS cantentregada'
            )
            ->leftJoin('l.DatMovlote ml4')
            ->addWhere(
                'm2.iddocumento = ? AND ul.idubicacion NOT IN (SELECT ml6.idubicacion FROM DatMovlote ml6 '
                . 'WHERE ml6.idlote = l.idlote AND ml6.idmovimiento = ?) AND coalesce((SELECT ml7.cantidad '
                . 'FROM DatMovlote ml7 WHERE ml7.idlote = l.idlote AND ml7.idmovimiento = m2.idmovimiento '
                . 'AND ml7.idubicacion = ul.idubicacion), 0) > 0',
                array($filtro['idpadre'], $filtro['idmovimiento'])
            )
            ->leftJoin('ml4.DatMovimientos m2');
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->logisticaDoctrine->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Devuelve un arreglo con los lotes y los movlotes del producto a devolver.
     * @param array $filtro
     * @return array
     */
    public function cargarMovLote($filtro)
    {
        $query = $this->loteService->cargarMovLote($filtro, true);
        $query->addSelect(
            "(SELECT sum(ml3.cantidad) FROM DatMovlote ml3 INNER JOIN ml3.DatMovimientos _m "
            . "ON (_m.idmovimiento = ml3.idmovimiento AND _m.iddocumento = {$filtro['idpadre']}) "
            . "WHERE ml3.idlote = ml.idlote AND ml3.idubicacion = ml.idubicacion) AS cantidadOrigen, "
            . "coalesce((SELECT sum(ml4.cantidad) FROM DatMovlote ml4 INNER JOIN ml4.DatMovimientos m2 "
            . "ON m2.idmovimiento = ml4.idmovimiento INNER JOIN m2.DatDocumentoPadre dp "
            . "ON dp.iddocumento = m2.iddocumento AND dp.idpadre = {$filtro['idpadre']} "
            . "WHERE ml4.idlote = ml.idlote), 0) AS resto, (SELECT sum(ml5.cantidad) FROM DatMovlote ml5 "
            . "WHERE ml5.idmovimiento = {$filtro['idmovimiento']}) AS total, ml.cantidad AS cantidadVieja"
        );
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->logisticaDoctrine->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Verifica que los productos con lote del documento tengan cantidades registradas.
     * @param numeric $iddocumento
     * @return boolean
     */
    public function lotesConCantidad($iddocumento)
    {
        $query = $this->loteService->cargarMovLote(null, true);
        return $query->addWhere('m.iddocumento = ? AND ml.cantidad = 0', array($iddocumento))->count() == 0;
    }
    
    private function tryInyector()
    {
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatDocumentoPadre',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatProductocmplto',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatMovimientos(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatEntrega',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatProductocmplto',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        if ($this->existComponent('log.fac.facturacion')) {
            $relations[] = array(
                'cardinalidad' => 'one',
                'relation' => 'DatDocfactura',
                'properties' => array('local' => 'iddocumento', 'foreign' => 'idfactura')
            );
        }
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relations);
        $relations = array();
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatMovimientos',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'iddocumento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumentoPadre(), $relations);
    }

}
