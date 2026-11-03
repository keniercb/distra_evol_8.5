<?php

/**
 * @class DatLoteModel
 * @package Logistica
 * @subpackage Lote
 * @author Dainier Aguila Medina
 * @copyright (c) 2014, XETID
 * @version 1.0
 */
class DatLoteModel extends BaseModel
{
    /**
     * Instancia de la service de ubicacion.
     * @var UtilesubicacionService
     */
    private $ubicacion;

    public function __construct()
    {
        parent::__construct();
        $this->ubicacion = new UtilesubicacionService();
        $relations[] = array(
            'cardinalidad' => 'many', 'relation' => 'DatMovlote',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento')
        );
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos(), $relations);
    }

    /**
     * Selecciona los datos del lote.
     * @param Doctrine_Query $query
     * @param boolean $disponible [Opcional]
     */
    private function selectLote($query, $disponible = false)
    {

        $query->addSelect(
                'l.idlote AS idlote, l.idproducto AS idproducto, l.numero AS numero, l.idfabricante AS idfabricante, '
                . 'l.idpais AS idpais, l.fechafabricacion AS fechafabricacion, l.fechavencimiento AS fechavencimiento, '
                . 'l.estado AS estado, l.cronologia AS cronologia'
        );

        if ($disponible) {
            $query->addSelect(
                    'coalesce(l.existencia, 0) AS existencia, '
                    . '(coalesce(l.existencia, 0) - coalesce((SELECT sum(lc.cantidad) FROM DatLoteComprometido lc '
                    . 'WHERE lc.idlote = l.idlote AND lc.estado = 1), 0)) AS disponible'
            );
        }
        /*if ($disponible) {
          $query->addSelect(
          'coalesce(l.existencia, 0) AS existencia, '
          . '(coalesce(l.existencia, 0) - coalesce((SELECT sum(lc.cantidad) FROM DatLoteComprometido lc '
          . 'WHERE lc.idlote = l.idlote AND lc.estado = 1), 0)) AS disponible'
          );
        }*/
    }

    /**
     * Devuelve un arreglo de lotes.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function cargarLotes($filtro, $dql = false)
    {

        $query = Doctrine_Query::create()
                ->select('l.idlote')
                ->from("DatLote l")
                ->orderBy('l.fechavencimiento');
        $this->selectLote($query, true);

        $this->filtroLotes($query, $filtro);
        if ($filtro['ubicaciones']) {
            $query->innerJoin('l.DatUbicacionlote ul')->andWhereIn('ul.idubicacion', $filtro['ubicaciones']);
        }
        // if ($filtro['idmovimiento']) {
        //     $query->addSelect("ml.idmovlote AS idmovlote")
        //         ->leftJoin(
        //             "l.DatMovlote ml ON (ml.idlote = l.idlote AND ml.idmovimiento = {$filtro['idmovimiento']})"
        //         )
        //         ->addWhere('ml.idmovimiento IS NULL');
        // }
        if ($filtro['idarea']) {
            $query->innerJoin('l.DatArealote al')->addWhere('al.idarea = ?', $filtro['idarea']);
        }
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Devuelve un arreglo con los lotes y los movlotes.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function cargarMovLote($filtro, $dql = false)
    {
        $query = Doctrine_Query::create()
                ->from('DatMovlote ml')
                ->select(
                'ml.idmovlote, ml.idmovimiento, ml.idubicacion, coalesce(ml.cantidad,0.000000) as cantidad, m.iddocumento AS iddocumento, '
                        . '(SELECT sum(coalesce(ml2.cantidad,0.000000)) FROM DatMovlote ml2 WHERE ml2.idlote = ml.idlote '
                        . 'AND ml2.idmovimiento = ml.idmovimiento) AS cantidadtotal, (SELECT _lc.idlotecomprometido '
                        . 'FROM DatLoteComprometido _lc WHERE _lc.idlote = l.idlote AND _lc.idubicacion = ml.idubicacion '
                        . 'AND _lc.iddocumento = m.iddocumento) AS idlotecomprometido, (SELECT _uc.idubicacioncomprometida '
                        . 'FROM DatUbicacionComprometida _uc WHERE _uc.idubicacion = ml.idubicacion AND _uc.idlote = l.idlote '
                        . 'AND _uc.idproducto = l.idproducto AND _uc.iddocumento = m.iddocumento) AS idubicacioncomprometida'
                )
                ->innerJoin('ml.DatLote l')
                ->innerJoin('ml.DatMovimientos m')
                ->orderBy('ml.cantidad,l.fechavencimiento');

        $this->selectLote($query, !$filtro['ubicacion']);
        $this->filtroLotes($query, $filtro);

        if ($filtro['idmovlote']) {
            $idmovlotes = is_array($filtro['idmovlote']) ? $filtro['idmovlote'] : array($filtro['idmovlote']);
            $query->whereIn('ml.idmovlote', $idmovlotes);
        }

        if ($filtro['idmovimiento']) {
            $query->addWhere('ml.idmovimiento = ?', array($filtro['idmovimiento']));
        }

        if ($filtro['idarea']) {
            $query->innerJoin('ml.DatEstructuraubicacion _eu')->addWhere('_eu.idarea = ?', $filtro['idarea']);
        }

        if ($filtro['ubicaciones']) {
            $filtro['ubicaciones'] = is_array($filtro['ubicaciones']) ? $filtro['ubicaciones'] :
                    array($filtro['ubicaciones']);
            $query->andWhereIn('ml.idubicacion', $filtro['ubicaciones']);
        }

        if ($filtro['ubicacion']) {
            $query->addSelect(
                    '(coalesce(ul.cantidad, 0) - coalesce((SELECT sum(lc.cantidad) FROM DatLoteComprometido lc '
                    . 'WHERE lc.idlote = l.idlote AND lc.idlote = ul.idlote AND lc.idubicacion = ul.idubicacion '
                    . 'AND lc.estado = 1), 0)) AS disponible, coalesce(ul.cantidad, 0) AS existencia'
            );
            if ($filtro['contabilizado']) {
                $query = $this->ubicacion->getQueryUbicacionLote($query, 'l');
                $query->addWhere('ul.idubicacion = ml.idubicacion');
            } else {
                $query->addSelect("(eu.codigo || '-' || eu.descripcion) AS descripcion, (eu.nivel = 1) AS esarea")
                        ->innerJoin('ml.DatEstructuraubicacion eu')->leftJoin('l.DatUbicacionlote ul');
            }
        }

        if ($dql) {
            return $query;
        }

        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Devuelve un arreglo con los lotes y sus ubicaciones.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function cargarUbicacionesLote($filtro, $dql = false)
    {
        $query = $this->ubicacion->cargarUbicacionesLote($filtro, true);
        $this->selectLote($query);
        $query->addSelect(
                        'coalesce((SELECT sum(ml2.cantidad) FROM DatMovlote ml2 WHERE ml2.idlote = ml.idlote '
                        . 'AND ml2.idmovimiento = ml.idmovimiento), 0) AS cantidadtotal, coalesce(ul.cantidad, 0) AS existencia'
                )
                ->innerJoin('ul.DatLote l')
                ->leftJoin("l.DatMovlote ml ON ml.idlote = l.idlote")
                ->addWhere(
                        'l.cronologia > 0 AND l.idproducto = ? AND ul.idubicacion NOT IN (SELECT ml3.idubicacion '
                        . 'FROM DatMovlote ml3 WHERE ml3.idlote = l.idlote AND ml3.idmovimiento = ?)',
                        array($filtro['idproducto'], $filtro['idmovimiento'])
                )
                ->orderBy('ul.idubicacion')
                ->addOrderBy('l.fechavencimiento');
        $this->filtroLotes($query, $filtro);
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     * Devuelve un arreglo con los lotes y sus ubicaciones.
     * @param array $filtro
     * @param boolean $dql [Opcional] Determina si se devuelve la consulta.
     * @return array|Doctrine_Query
     */
    public function cargarUbicacionesLoteProducto($filtro, $dql = false)
    {
        $query = $this->ubicacion->cargarUbicacionesLote($filtro, true);
        $this->selectLote($query);
        $query->innerJoin('ul.DatLote l')
                ->addWhere('l.cronologia > 0 AND l.idproducto = ? ',
                        array($filtro['idproducto'])
                )
                ->orderBy('ul.idubicacion')
            ->addOrderBy('l.fechavencimiento');/*
          ->having('(coalesce(l.existencia, 0) - coalesce((SELECT SUM(lcd.cantidad) FROM DatLoteComprometido lcd '
                    . 'WHERE lcd.idlote = l.idlote AND lcd.estado = 1), 0)) > 0');*/
        $this->filtroLotes($query, $filtro);
        if ($dql) {
            return $query;
        }
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $filtro)->fetchArray()
        );
    }

    /**
     *  Incluye los filtros generales de lote.
     * @param Doctrine_Query $query
     * @param array $filtro
     */
    private function filtroLotes($query, $filtro)
    {

        if ($filtro['idlote']) {
            $idlotes = is_array($filtro['idlote']) ? $filtro['idlote'] : array($filtro['idlote']);
            $query->andWhereIn('l.idlote', $idlotes);
        }
        if ($filtro['idproducto']) {
            $idproductos = is_array($filtro['idproducto']) ? $filtro['idproducto'] : array($filtro['idproducto']);
            $query->andWhereIn('l.idproducto', $idproductos);
        }
        if ($filtro['contabilizado']) {
            $query->addWhere('l.cronologia > 0');
        }
        if ($filtro['numero']) {
            $query->addWhere("upper(l.numero) = ?", array(strtoupper($filtro['numero'])));
        }
        if ($filtro['criterio']) {
            $query->addWhere("l.numero ILIKE '%{$filtro['criterio']}%'");
        }
    }

    /**
     * Adiciona o actualiza uno o varios lotes.
     * @param array $datos Arreglo asociativo con los datos de uno o varios lotes.
     * @param array $params Arreglo asociativo con datos adicionales (para guardar varios "collection" = true,
     * para actualizar el movimiento "actualizarMov" = true, para actualizar disponible del lote "afectaLote" = true,
     * para actualizar disponible del producto "afectaProducto" = true y el signo del movimiento).
     * @return array Contiene los detalles de posibles excepciones.
     */
    public function adicionarLote($datos, $params)
    {
        $collection = new Doctrine_Collection('DatLote');
        if (!$params['collection']) {
            $datos = array($datos);
        }
        $cantidad = 0;
        foreach ($datos as $value) {
            $value['idpais'] = $value['idpais'] ? $value['idpais'] : null;
            $value['idfabricante'] = $value['idfabricante'] ? $value['idfabricante'] : null;
            $value['signo'] = $value['signo'] ? $value['signo'] : $params['signo'];
            $lote = $this->procesarLote($value);
            if ($params['afectaLote']) {
                $record = $this->procesarLoteComprometido($value, $params['noexception']);
                $lote->DatLoteComprometido[] = $record;
                $value['cantidad'] = $record->cantidad;
                $cantidad += $record->cantidad;
                $this->ubicacion->adicionarUbicacionComprometida($value);
            }
            $collection->add($lote);
            $idmovimiento = $value['idmovimiento'];
            $idproducto = $value['idproducto'];
        }

        if ($collection->count() > 0) {
            $collection->save();
        }
        if ($params['actualizarMov']) {
            $this->actualizarMovimiento(
                    $idmovimiento, $params['afectaProducto'], $params['usaMonedas'], $params['compraVenta']
            );
        }
        return array(
            'success' => true,
            'productos' => array('idmovimiento' => $idmovimiento, 'idproducto' => $idproducto, 'cantidad' => $cantidad)
        );
    }

    /**
     * Prepara un Lote para adicionar o actualizar y lo devuelve.
     * @param array $datos
     * @return DatLote
     */
    private function procesarLote($datos)
    {

        $lote = new DatLote();
        if ($datos['idlote']) {
            $lote->assignIdentifier($datos['idlote']);
        }
        $lote->synchronizeWithArray($datos);
        $movlote = $this->procesarMovLote($datos);
        $lote->DatMovlote[] = $movlote;
        return $lote;
    }

    /**
     * Prepara un Movlote para adicionar o actualizar y lo devuelve.
     * @param array $datos Arreglo asociativo que contiene idmovimiento, idubicacion, cantidad y opcionalmente idlote.
     * @return DatMovlote
     */
    private function procesarMovLote($datos)
    {

        $movlote = new DatMovlote();
        if (!$datos['idubicacion']) {
            $datos['idubicacion'] = -1;
        }
        if ($datos['idmovlote']) {
            $movlote->assignIdentifier($datos['idmovlote']);
        } else {
            $obj = $this->findMovLote($datos['idlote'], $datos['idmovimiento'], $datos['idubicacion']);
            if ($obj) {
                $datos['idmovlote'] = $obj->idmovlote;
                $datos['cantidad'] += $obj->cantidad;
                $movlote->assignIdentifier($datos['idmovlote']);
            }
        }
        $movlote->synchronizeWithArray($datos);
        return $movlote;
    }

    /**
     * Prepara un LoteConprometido para adicionar o actualizar y lo devuelve.
     * @param array $datos
     * @param boolean $noexception [Opcional] Determina si se lanza la excepcion de hacerse negativa la dispobibilidad.
     * @return Doctrine_Record
     */
    private function procesarLoteComprometido($datos, $noexception = false)
    {
        $cantidad = $this->checkDisponible(
                $datos['idlote'], $datos['idubicacion'], $datos['iddocumento'], $datos['cantidad'], $noexception
        );
        if (!$datos['idlotecomprometido']) {
            $obj = $this->findDatLoteComprometido($datos['idlote'], $datos['idubicacion'], $datos['iddocumento']);
            $datos['idlotecomprometido'] = $obj->idlotecomprometido;
        }
        $record = new DatLoteComprometido();
        if ($datos['idlotecomprometido']) {
            $record->assignIdentifier($datos['idlotecomprometido']);
        }
        $datos['cantidad'] -= $cantidad;
        $record->synchronizeWithArray($datos);
        return $record;
    }

    /**
     * Elimina los movlote dado sus id y el lote correspondiente a cada uno en caso de ser el último de no existir más.
     * @param array $filtro Arreglo asociativo que contiene los datos de los movlote.
     * @param array $datos Arreglo asociativo que contiene datos adicionales
     * (para actualizar disponible del lote "afectaLote" = true,
     * para actualizar disponible del producto "afectaProducto" = true y el signo del movimiento).
     * @return boolean
     */
    public function eliminarLote($filtro, $datos)
    {
        foreach ($filtro as $key => $value) {

            $idlotes[] = $value['idlote'];
            if ($key > 0 && $key < count($filtro)) {
                $strIdLote .= ",";
            }
            $strIdLote .= $value['idlote'];

            $idMovlotes = $value['idmovlote'];

            if ($value['idlotecomprometido']) {
                $idcomprometidos[] = $value['idlotecomprometido'];
            }
            if ($value['idubicacioncomprometida']) {
                $idubicacionescomprometidas[] = $value['idubicacioncomprometida'];
            }
        }

        Doctrine_Query::create()->delete('DatMovlote ml')->whereIn('ml.idmovlote', $idMovlotes)->execute();
        Doctrine_Query::create()->delete('DatLote l')
                ->where("l.idlote NOT IN (SELECT DISTINCT ml.idlote FROM DatMovlote ml WHERE ml.idlote IN ({$strIdLote}))")
                ->whereIn('l.idlote', $idlotes)->execute();
        $this->eliminarLoteComprometido(null, $idcomprometidos);
        $this->ubicacion->eliminarUbicacionComprometida(null, null, $idubicacionescomprometidas);
        if ($datos['actualizarMov'] == 1) {
            $this->actualizarMovimiento(
                    $datos['idmovimiento'], $datos['afectaProducto'], $datos['usaMonedas'], $datos['compraVenta']
            );
        }
        return true;
    }

    /**
     * Elimina uno o varios lotes comprometidos asociados a un documento.
     * @param numeric $iddocumento [Opcional]
     * @param numeric|array $idlotecomprometido [Opcional]
     * @return boolean
     */
    private function eliminarLoteComprometido($iddocumento, $idlotecomprometido)
    {
        $query = Doctrine_Query::create()->delete('DatLoteComprometido');
        if ($iddocumento) {
            $query->where('iddocumento = ?', $iddocumento);
        }
        if ($idlotecomprometido) {
            $idcomprometidos = is_array($idlotecomprometido) ? $idlotecomprometido : array($idlotecomprometido);
            $query->whereIn('idlotecomprometido', $idcomprometidos);
        }
        if ($iddocumento || count($idcomprometidos) > 0) {
            $query->execute();
        }
        return true;
    }

    /**
     * Elimina los lotes comprometidos de un documento.
     * @param numeric $iddocumento [Opcional]
     * @param numeric|array $idmovimientos [Opcional]
     */
    public function eliminarLotesDocumento($iddocumento, $idmovimientos)
    {
        if ($idmovimientos) {
            $iddocumento = null;
            $arrMov = is_array($idmovimientos) ? $idmovimientos : array($idmovimientos);
            $ubicaciones = Doctrine_Query::create()
                    ->select('lc.idlotecomprometido')
                    ->from('DatLoteComprometido lc')
                    ->innerJoin('lc.DatDocumento d')
                    ->innerJoin('d.DatMovimientos m')
                    ->whereIn('m.idmovimiento', $arrMov)
                    ->fetchArray();
        }
        $idcomprometidos = $this->objectHelper->extractValueFromArrayColumn($ubicaciones, 'idlotecomprometido');
        if ($iddocumento || ($idcomprometidos && count($idcomprometidos) > 0)) {
            $this->eliminarLoteComprometido($iddocumento, $idcomprometidos);
        }
    }

    /**
     * Actualiza el estado de las cantidades comprometidas de los lotes del documento.
     * @param numeric $iddocumento
     */
    private function cambiarEstadoLoteDocumento($iddocumento)
    {
        Doctrine_Query::create()
                ->update('DatLoteComprometido')
                ->set('estado', 2)
                ->where('iddocumento = ?', $iddocumento)
                ->execute();
    }

    /**
     * Actualiza la cantidad del movimiento del producto asosiada al lote.
     * @param numeric $idmovimiento Identificador por el cual se actualiza el movimiento.
     * @param boolean $afecta [Opcional] Determina si afecta la cantidad disponible del producto (Por defecto false).
     * @param boolean $usaMonedas [Opcional] Determina si usa la dualidad monetaria (Por defecto false).
     * @param numeric $compraVenta [Opcional] Tipo de operación (compra o venta) para la canversión de entre monedas
     * (0 - no toma en cuenta la operación, 1 - para la venta y 2 - para la compra).
     * @return boolean
     */
    private function actualizarMovimiento($idmovimiento, $afecta = false, $usaMonedas = false, $compraVenta = 0)
    {
        $tipo = $this->findTipoMonedas();
        if ($usaMonedas && $tipo['alternativa']) {
            $datos = $this->actualizarMonedas($idmovimiento, $compraVenta, $tipo);
        }
        if (count($datos) == 0) {
            $datos = Doctrine_Query::create()
                    ->select(
                            'm.idmovimiento, p.idproducto AS idproducto, coalesce(sum(ml.cantidad), 0) AS cantidad, '
                            . 'm.preciocontable, m.precioalternativo, '
                            . 'coalesce((sum(ml.cantidad) * m.precioalternativo), 0) AS importealternativo, '
                    )
                    ->from('DatMovimientos m')
                    ->leftJoin('m.DatMovlote ml')
                    ->innerJoin('m.DatProductoLogistica p')
                    ->where("m.idmovimiento = ?", $idmovimiento)
                    ->groupBy('m.idmovimiento, p.idproducto')
                    ->fetchArray();
        }
        (new LogisticaProductoModel())->modificarMovimientos($datos, $afecta);
        $this->registrarDiferencia($idmovimiento);
        $this->actualizarProductoCmpto($idmovimiento);
        return true;
    }

    /**
     * Actualiza la cantidad existente de los lotes de cada movimiento del documento.
     * @param numeric $iddocumento Id del documento.
     * @param boolean $esEntrada [Opcional] Determina si el documento es una entrada o salida.
     * @param integer $cronologia [Opcional] cronología del documento.
     * @param boolean $anular [Opcional] Detemina si se anula o no el documento.
     * @return boolean
     */
    public function actualizarExistenciaLote($iddocumento, $esEntrada = false, $cronologia = 1, $anular = false, $signoMov = false, $afectadisponible = true)
    {
        $andWhere = '';
        if ($signoMov != false){
            $andWhere.= " AND m.signo = '{$signoMov}'";
        }
        $signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        if ($esEntrada && !$anular || !$esEntrada && $anular) {
            $signo = LogisticaMovimientoModel::SIGNO_MOV_SUMA;
        }
        $sql = "UPDATE dat_lote l "
                . "SET existencia = (coalesce(l.existencia, 0) {$signo} (SELECT (sum(ml2.cantidad)) "
                . "FROM dat_movlote ml2 INNER JOIN dat_movimiento m2 ON m2.idmovimiento = ml2.idmovimiento "
                . "WHERE ml2.idlote = l.idlote AND m2.iddocumento = {$iddocumento})), "
                . "cronologia = (CASE WHEN l.cronologia IS NULL OR l.cronologia = 0 THEN {$cronologia} "
                . "ELSE l.cronologia END) WHERE l.idlote IN (SELECT ml.idlote FROM dat_movlote ml "
                . "INNER JOIN dat_movimiento m ON m.idmovimiento = ml.idmovimiento WHERE m.iddocumento = {$iddocumento} {$andWhere})";
        Doctrine_Manager::connection()->fetchAll($sql);
        if ($signo == LogisticaMovimientoModel::SIGNO_MOV_RESTA) {
            $this->cambiarEstadoLoteDocumento($iddocumento);
        }
        $this->ubicarOrDesubicarProductos($iddocumento, $signo == LogisticaMovimientoModel::SIGNO_MOV_SUMA, $esEntrada, $afectadisponible);
        return true;
    }

    /**
     * Actualiza las monedas del movimiento del producto.
     * @param numeric $idmovimiento
     * @param numeric $compraVenta Tipo de operación (compra o venta) para la canversión de entre monedas
     * (0 - no toma en cuenta la operación, 1 - para la venta y 2 - para la compra).
     * @param array $tipo Tipos de moneda configuradas.
     * @return array
     */
    private function actualizarMonedas($idmovimiento, $compraVenta, $tipo)
    {
        $configuracionService = new ConfiguracioninventarioService();
        $conf = $configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $monedas = Doctrine_Query::create()
                ->select(
                        'mn.idmovmoneda, mn.idmoneda, mn.precio, coalesce(sum(ml.cantidad), 0) AS cantidad, '
                        . 'm.preciocontable AS preciocontable, m.cantidad AS cantidadvieja, p.idproducto AS idproducto, '
                        . 'p.idestructuracomun AS idestructura'
                )
                ->from('DatMovmoneda mn')
                ->innerJoin('mn.DatMovimientos m')
                ->innerJoin('m.DatProductoLogistica p')
                ->leftJoin('m.DatMovlote ml')
                ->where('m.idmovimiento = ?', $idmovimiento)
                ->groupBy('mn.idmovmoneda, m.idmovimiento, p.idproducto')
                ->fetchArray();
        $precioCont = $importeCont = $precioAlt = $importeAlt = 0;
        $collection = new Doctrine_Collection('DatMovmoneda');
        foreach ($monedas as $value) {
            $cantidad = $value['cantidad'];
            $cantvieja = $value['cantidadvieja'];
            $idestructura = $value['idestructura'];
            $value['importe'] = $value['cantidad'] * $value['precio'];
            if ($value['idmoneda'] == $tipo['contable']) {
                $precioCont = $value['precio'];
                $importeCont = $value['importe'];
            } elseif ($value['idmoneda'] == $tipo['alternativa']) {
                $precioAlt += $value['precio'];
                $importeAlt += $value['importe'];
            } else {
                $precioConver = $this->configuracionHelper->convertirImporte(
                        $value['idmoneda'], $tipo['alternativa'], $conf['idtipotasa'], $value['precio'], $compraVenta
                );
                if (is_array($precioConver)) {
                    throw new LogisticaException('LOG_LB_DOC_017', null, null);
                }
                $importConv = $this->configuracionHelper->convertirImporte(
                        $value['idmoneda'], $tipo['alternativa'], $conf['idtipotasa'], ($value['precio'] * $cantidad),
                        $compraVenta
                );
                $precioAlt += is_numeric($precioConver) ? $precioConver : 0;
                $importeAlt += is_numeric($importConv) ? $importConv : 0;
            }
            $moneda = new DatMovmoneda();
            if ($value['idmovmoneda']) {
                $moneda->assignIdentifier($value['idmovmoneda']);
            }
            $moneda->synchronizeWithArray($value);
            $collection->add($moneda);
        }
        if ($collection->count() > 0) {
            $result[] = array(
                'idmovimiento' => $idmovimiento, 'preciocontable' => $precioCont, 'importecontable' => $importeCont,
                'cantidad' => $cantidad, 'precioalternativo' => $precioAlt, 'importealternativo' => $importeAlt,
                'cantidadvieja' => $cantvieja, 'idestructura' => $idestructura
            );
            $collection->save();
        }
        return (array)$result;
    }

    /**
     * Registra las difenrencias al recepcionar el producto
     * @param numeric $idmovimiento
     */
    private function registrarDiferencia($idmovimiento)
    {
        if (class_exists('DatMovrecepcion')) {
            $dif = Doctrine_Query::create()
                    ->select(
                            'mr.idmovimiento, abs(mr.cantidad - m.cantidad) AS cantidaddiferencia, '
                            . '(CASE WHEN mr.cantidad < m.cantidad THEN 1 WHEN mr.cantidad > m.cantidad THEN 2 END) AS signo, '
                            . '0 AS preciodiferencia, 0 AS importediferencia'
                    )
                    ->from('DatMovrecepcion mr')
                    ->innerJoin('mr.DatMovimientos m')
                    ->innerJoin('m.DatDocumento d')
                    ->where('mr.idmovimiento = ? AND d.estado = 1', array($idmovimiento))
                    ->fetchArray();
            if (count($dif) > 0) {
                $reclamacion = new ReclamacionService();
                $reclamacion->registrarDiferencias($dif[0]);
            }
        }
    }

    /**
     * Actualiza el cumplimiento de entrega del producto.
     * @param numeric $idmovimiento
     * @return boolean
     */
    private function actualizarProductoCmpto($idmovimiento)
    {
        if (class_exists('RecepcionService') &&
                LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_RESERVA)) {
            $mov = Doctrine::getTable('DatMovimientos')->find($idmovimiento);
            $array = array('iddocumento' => $mov->iddocumento, 'idmovimientos' => array($idmovimiento));
            $recepcion = new RecepcionService();
            $recepcion->actualizarProductoCmpto($array);
        }
        return true;
    }

    /**
     * Ubica o desubica los productos.
     * @param numeric $iddocumento
     * @param boolean $ubicar [Opcional] Determina si se ubica o se desubica el producto.
     * @param boolean $esEntrada [Opcional] Determina si el documento es una entrada o salida.
     * @return boolean
     */
    private function ubicarOrDesubicarProductos($iddocumento, $ubicar = false, $esEntrada = true, $afectadisponible = true)
    {
        $query = Doctrine_Query::create()
                ->select('ml.idlote, ml.cantidad, ml.idmovimiento, ml.idubicacion, l.idproducto AS idproducto')
                ->from('DatMovlote ml')
                ->innerJoin('ml.DatLote l')
                ->innerJoin('ml.DatMovimientos m')
                ->where('m.iddocumento = ?', array($iddocumento));
        if (!$ubicar || !$esEntrada) {
            $this->ubicacion->getQueryUbicacionLote($query, 'l');
        }
        $movLote = $query->fetchArray();
        foreach ($movLote as &$value) {
            $value['afectadisponible'] = $afectadisponible;
            $value['iddocumento'] = $iddocumento;
            if ($ubicar) {
                $this->ubicacion->ubicarProductoLotes($value);
            } else {
                $this->ubicacion->desubicarProductoLote($value);
            }
        }
        return true;
    }

    /**
     * Devuelve un arreglo con las ubicaciones del lote.
     * @param array $filtro Arreglo asociativo que contiene idlote, idproducto, ...
     * @return array
     */
    public function cargarComboUbicaciones($filtro)
    {
        return $this->ubicacion->cargarUbicacionesLoteArbol($filtro);
    }

    /**
     * Extrae las cantidades del porducto de las ubicaciones con cantidades disponibles
     * teniendo en cuenta la fecha de vencimiento.
     * @param array $arrayDatos
     * @param boolean $afecta [Opcional] Determina si afecta la cantidad disponible del producto.
     * @param boolean $rotacion [Opcional] Determina si se estraen los lotes rotados.
     * @return array Contiene los detalles de posibles excepciones.
     */
    public function extraerCantidades($arrayDatos = array(), $afecta = false, $rotacion = false)
    {
        $detalles = array();
        if (count($arrayDatos)) {
            foreach ($arrayDatos as $mov) {
                unset($mov['cronologia']);
                if ($mov['cantidad'] >= 0) {
                    $result = $this->processLotesMovimientos($mov, $afecta, $rotacion);
                } else {
                    $this->unProcessLotesMovimientos($mov);
                }
                if (count($result) > 0 && $result['cantidad'] < $mov['cantidad']) {
                    $detalles[] = $result;
                } elseif ($this->esLote($mov['idproducto'])) {
                    $detalles[] = array(
                        'idmovimiento' => $mov['idmovimiento'], 'idproducto' => $mov['idproducto'], 'cantidad' => 0
                    );
                }
            }
        }
        return $detalles;
    }

    /**
     * Busca las ubicaciones de los lotes disponibles.
     * @param array $datos Datos del movimiento.
     * @param boolean $afecta [Opcional] Determina si afecta la cantidad disponible del producto.
     * @param boolean $rotacion [Opcional] Determina si se estraen los lotes rotados.
     * @return array Contiene los detalles de posibles excepciones.
     */
    private function processLotesMovimientos($datos, $afecta, $rotacion)
    {
        $query = Doctrine_Query::create()
                ->select(
                        'l.idlote AS idlote, ul.idubicacion, ul.idubicacionlote, '
                        . '(ul.cantidad - coalesce((SELECT sum(uc.cantidad) FROM DatUbicacionComprometida uc '
                        . 'WHERE uc.idubicacion = ul.idubicacion AND uc.idlote = ul.idlote AND uc.estado = 1), 0)) AS cantidad'
                )
                ->from('DatUbicacionlote ul')
                ->innerJoin('ul.DatLote l')
                ->where(
                        'l.idproducto = ? AND (ul.cantidad - coalesce((SELECT sum(_uc.cantidad) FROM DatUbicacionComprometida _uc '
                        . 'WHERE _uc.idubicacion = ul.idubicacion AND _uc.idlote = ul.idlote AND _uc.estado = 1), 0)) > 0',
                        $datos['idproducto']
                )
                ->orderBy('l.fechavencimiento');
        if ($datos['ubicaciones']) {
            $idubicaciones = is_array($datos['ubicaciones']) ? $datos['ubicaciones'] : array($datos['ubicaciones']);
            $query->whereIn('ul.idubicacion', $idubicaciones);
        }
        if ($rotacion) {
            $rotacion = new RotacionService();
            $lotes = $rotacion->obtenerLotesRotadosService($datos);
            $idlotes = $this->objectHelper->extractValueFromArrayColumn($lotes, 'idlote');
            $query->andWhereIn('l.idlote', $idlotes);
        }
        if ($query->count() > 0) {
            $dqlResult = $query->fetchArray();
            return $this->fragmentarLotePorUbicacion($dqlResult, $datos, $afecta);
        }
        return array();
    }

    /**
     * @param array $datos
     * @return boolean
     */
    private function unProcessLotesMovimientos($datos)
    {
        return true;
    }

    /**
     * Fragmenta la cantidad entre las diferentes ubicaciones de lote mientras sea posible.
     * @param array $ubicaciones Arreglo asociativo que contiene idlote, cantidad, idubicacion.
     * @param array $datos Arreglo asociativo que contiene idmovimiento y cantidad.
     * @param boolean $afecta [Opcional] Determina si afecta la cantidad disponible del producto.
     * @return array Contiene los detalles de posibles excepciones.
     */
    private function fragmentarLotePorUbicacion($ubicaciones, $datos, $afecta)
    {
        $pos = 0;
        while ($datos['cantidad'] > 0 && count($ubicaciones) > $pos) {
            $ubicLote = $ubicaciones[$pos];
            $nCant = 0;
            if ($ubicLote['cantidad'] > $datos['cantidad']) {
                $nCant = $datos['cantidad'];
            } else {
                $nCant = $ubicLote['cantidad'];
            }
            $datos['cantidad'] -= $nCant;
            $array = array(
                'cantidad' => $nCant, 'idlote' => $ubicLote['idlote'], 'idubicacion' => $ubicLote['idubicacion']
            );
            $lotes[] = array_merge($datos, $array);
            $pos++;
        }
        $afectaProd = $datos['cantidad'] != 0;
        $params = array(
            'collection' => true, 'afectaLote' => true, 'actualizarMov' => $afectaProd,
            'afectaProducto' => $afecta, 'noexception' => true
        );
        $detalles = $this->adicionarLote($lotes, $params);
        return $detalles['productos'];
    }

    /**
     * Verifica si hay disponibilidad para extraer la cantidad especificada.
     * @param numeric $idlote
     * @param numeric $idubicacion
     * @param numeric $iddocumento
     * @param integer $cantidad
     * @param boolean $noexception [Opcional] Determina si se lanza la excepcion de hacerse negativa la dispobibilidad.
     * @return integer Cantidad que no puede procesar.
     * @throws ZendExt_Exception Excepcion que lanza si la disponibilidad se hace negativa.
     */
    private function checkDisponible($idlote, $idubicacion, $iddocumento, $cantidad, $noexception = false)
    {
        $lote = Doctrine_Query::create()
                ->select(
                        "l.idlote, abs(coalesce(l.existencia, 0) - ({$cantidad} + coalesce((SELECT sum(_lc.cantidad) "
                        . "FROM DatLoteComprometido _lc WHERE _lc.idlote = l.idlote AND _lc.estado = 1), 0) - "
                        . "coalesce((SELECT sum(_lc2.cantidad) FROM DatLoteComprometido _lc2 WHERE _lc2.idlote = l.idlote "
                        . "AND _lc2.idubicacion = {$idubicacion} AND _lc2.iddocumento = {$iddocumento} "
                        . "AND _lc2.estado = 1), 0))) AS cantidad"
                )
                ->from('DatLote l')
                ->where(
                        'l.idlote = ? AND ((coalesce(l.existencia, 0) - (coalesce((SELECT sum(lc.cantidad) '
                        . 'FROM DatLoteComprometido lc WHERE lc.idlote = l.idlote AND lc.estado = 1), 0)) + '
                        . '(coalesce((SELECT sum(lc2.cantidad) FROM DatLoteComprometido lc2 WHERE lc2.idlote = l.idlote '
                        . 'AND lc2.idubicacion = ? AND lc2.iddocumento = ? AND lc2.estado = 1), 0) - ?))) < 0',
                        array($idlote, $idubicacion, $iddocumento, $cantidad)
                )
                ->fetchArray();
        if (count($lote) > 0 && !$noexception) {
            throw new ZendExt_Exception('LOG_LB_LOTE_001');
        }
        return count($lote) > 0 ? $lote[0]['cantidad'] : 0;
    }

    /**
     * Devuelve el LoteComprometido si existe.
     * @param numeric $idlote
     * @param numeric $idubicacion
     * @param numeric $iddocumento
     * @return Doctrine_Record
     */
    private function findDatLoteComprometido($idlote, $idubicacion, $iddocumento)
    {
        $obj = Doctrine_Query::create()
                ->from('DatLoteComprometido lc')
                ->where(
                        'lc.idlote = ? AND lc.idubicacion = ? AND lc.iddocumento = ?',
                        array($idlote, $idubicacion, $iddocumento)
                )
                ->fetchOne();
        return $obj;
    }

    /**
     * Devuelve el Movlote si existe.
     * @param numeric $idlote
     * @param numeric $idmovimiento
     * @param numeric $idubicacion [Opcional]
     * @return Doctrine_Record
     */
    private function findMovLote($idlote, $idmovimiento, $idubicacion)
    {
        $query = Doctrine_Query::create()
                ->from('DatMovlote ml')
                ->where('ml.idmovimiento = ? AND ml.idlote = ?', array($idmovimiento, $idlote));
        if ($idubicacion) {
            $query->addWhere('ml.idubicacion = ?', array($idubicacion));
        }
        return $query->fetchOne();
    }

    /**
     * Determina si el producto es por lote.
     * @param numeric $idproducto
     * @return boolean
     */
    private function esLote($idproducto)
    {
        return Doctrine_Query::create()->from('DatLote l')->where('l.idproducto = ?', $idproducto)->count() > 0;
    }

    /**
     * Devuelve los tipos de moneda configuradas.
     * @return array
     */
    private function findTipoMonedas()
    {
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $tipo['alternativa'] = $value['idmoneda'];
            } else if ($value['tipomoneda'] == 0) {
                $tipo['contable'] = $value['idmoneda'];
            }
        }
        return (array)$tipo;
    }


    public function getProductosDocumento($params)
    {
        $stm = "select m.idproducto, m.idmovimiento, i.codigo, i.denominacion, nat.denominacion as denomlineaprodfarm, 
                    m.signo, count(m.idproducto) as cantidad, (coalesce(i.numeropieza,i.codigo) || ' - ' || i.denominacion) as textcodif
                    from mod_logistica.dat_movimiento m 
                    inner join mod_logistica.dat_producto p on p.idproducto = m.idproducto
                    inner join mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
                    inner join mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = p.idindicador
                    inner join mod_datosmaestros.nom_naturaleza nat on nat.idnaturaleza = i.idnaturaleza
                    where m.iddocumento = {$params['iddocumento']} and ih.tipocontrol = 2
                    group by m.idproducto, i.codigo, i.denominacion, nat.denominacion,m.idmovimiento,m.signo,i.numeropieza
                    order by nat.denominacion , i.denominacion ASC";
        return LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($stm);
    }
}
