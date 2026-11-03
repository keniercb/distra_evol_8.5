<?php

/**
 * Esta clase se relaciona con la clase InventarioController
 *
 * @copyright XETID
 * @author    División de Gestión de Entidades
 * @version   1.0
 */
class InventarioModel extends MovimientosModel
{

    const TIPO_INV_DIARIO = 1, TIPO_INV_MENSUAL = 2, TIPO_INV_PARCIAL = 3, TIPO_INV_GENERAL = 4;

    protected $logisticaDoctrine, $logisticaDocHelper, $servConfigInvent, $loteService;

    public function __construct($datosDoc = array())
    {
        parent::__construct($datosDoc);
        $this->loteService = new LoteService();
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatInventario',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idinventario'));
        $this->doctrineHelper->tryInyectRelactions(new DatDocumento(), $relations);
        $relations = array();
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatLote',
            'properties' => array('local' => 'idproducto', 'foreign' => 'idproducto'));
        $this->doctrineHelper->tryInyectRelactions(new DatProductoLogistica(), $relations);
        $relations = array();
        $relations[] = array('cardinalidad' => 'one', 'relation' => 'DatMovinventario',
            'properties' => array('local' => 'idmovimiento', 'foreign' => 'idmovimiento'));
        $this->doctrineHelper->tryInyectRelactions(new DatMovimientos(), $relations);
    }

    /**
     * Función que permite confirmar si el documento tiene productos
     *
     * @param mixed $iddocumento Identificador de documento
     *
     * @return boolean
     */
    public function contieneProductos($iddocumento)
    {
        $datosBusqueda = $this->getProductoModel()
            ->devolverMovimientos(
                array('iddocumento' => implode(',', Zend_Json::decode($iddocumento)))
            );
        if ($datosBusqueda['cantidad'] > 0) {
            return true;
        }
        return false;
    }

    /**
     * @param $filtro
     * @return array
     */
    public function cargarLotes($filtro)
    {
        $query = $this->loteService->cargarMovLote($filtro, true)
            ->addSelect(
                '(CASE WHEN (SELECT sum(ml3.cantidad) FROM DatMovlote ml3 WHERE ml3.idlote = l.idlote ' .
                'AND ml3.idmovimiento = ml.idmovimiento) < l.existencia THEN 1 ELSE (CASE WHEN ' .
                '(SELECT sum(ml4.cantidad) FROM DatMovlote ml4 WHERE ml4.idlote = l.idlote ' .
                'AND ml4.idmovimiento = ml.idmovimiento) > l.existencia THEN 2 ELSE 3 END) END) AS conteopor'
            )
            ->orderBy('ml.idubicacion, l.fechavencimiento');
        return array('datos' => $query->fetchArray(), 'cantidad' => $query->count());
    }

    /**
     * @param $iddocumento
     * @return bool
     */
    public function confirmarDocumento($iddocumento)
    {
        $sqlInsert = "insert into mod_loginventario.dat_movinventario(idmovimiento, iddocumento,existenciaactual,
                                                importeactual,importealtactual)
        select dm.idmovimiento, dm.iddocumento, (
            case when inv.idestructuraubicacion is not null then
            (select up.cantidad from mod_logubicacion.dat_ubicacionproducto up where up.idproducto = dm.idproducto and up.idubicacion = inv.idestructuraubicacion limit 1)
            else dp.cantidad end
        ),  dp.importe, dp.importealternativo
        from mod_logistica.dat_movimiento dm
        join mod_loginventario.dat_inventario inv on inv.idinventario = dm.iddocumento
        join mod_logistica.dat_producto dp  on dm.idproducto = dp.idproducto
        where dm.iddocumento = {$iddocumento}";
        $this->doctrineHelper->executeQuery($sqlInsert);
        return parent::confirmarDocumento($iddocumento);
    }

    /**
     * @param array $datosDoc
     * @return array|bool|Doctrine_Query
     */
    public function devolverMovimientos($datosDoc)
    {

        $query = $this->getProductoModel()->devolverMovimientos($datosDoc,true)
            ->leftJoin('mov.DatMovinventario dmi')->addSelect('dmi.existenciaactual as exist')
            /*->where('dmi.existenciaactual > 0')*/;

        $query->leftJoin('p.DatUbicacionproducto dupr');//->orderBy('i.numeropieza');//dupr.idubicacionproducto,
        $movimientos = array('cantidad'=>$query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $datosDoc)->fetchArray());
        $estado = $this->estadoModel->getEstadoActual($datosDoc['iddocumento']);
        if ($estado != 1) {
          
            foreach ($movimientos['datos'] as &$value) {

                $value['existencia'] = $value['exist'];
                if ($value['tienelote'] == 1) {
                    $value['sobrante'] = $this->tieneDiferenciasConteoLote($value, $signo = '>') ? 1 : 0;
                    $value['faltante'] = $this->tieneDiferenciasConteoLote($value, $signo = '<') ? 1 : 0;
                } else {
                    $value['faltante'] = ($value['exist'] > $value['cantidad']) ? 1 : 0;
                    $value['sobrante'] = ($value['exist'] < $value['cantidad']) ? 1 : 0;
                }
            }
        }
        return $movimientos;
    }

    /**
     * Función que permite devolver los documentos de hoja de inventario
     *
     * @param array $datosDoc Arreglo con los parametros para filtrar los documentos
     * @param boolean $dql [Opcional]
     * @return array|Doctrine_Query
     */
    public function devolverDocumentos($datosDoc, $dql = false)
    {

        $query = parent::devolverDocumentos($datosDoc);
        $inventario = new DatInventario();
        $inventario->getJoinDatInventario($query, $datosDoc, 'd', 'i');
        if ($dql) {
            return $query;
        }
        $datos = $this->doctrineHelper->addQueryLimits($query, $datosDoc)->fetchArray();
        $utiles = new UtilesubicacionService();
        foreach ($datos as $index => $d) {
            $datosArea = $utiles->devolverArea($d['idarea']);
            $datos[$index]['area'] = ($d['tipoinventario'] == self::TIPO_INV_GENERAL) ? 'Todas las áreas' :
                $datosArea[0]['descripcion'];
        }
        return array('cantidad' => $query->count(), 'datos' => $datos);
    }

    /**
     * Función que permite cargar las areas dado un deposito
     *
     * @param mixed $iddeposito Identificador de deposito
     *
     * @return array
     */
    public function cargarAreas($iddeposito)
    {
        $utiles = new UtilesubicacionService();
        $areas = $utiles->devolverAreasPorDeposito($iddeposito);
        $data = array();
        foreach ($areas as $index => $est) {
            $data[$index]['area'] = $est['idarea'];
            $data[$index]['descripcion'] = $est['descripcion'];
        }
        return $data;
    }

    /**
     * Función que permite cargar las naturalezas dado un idarea
     *
     * @param mixed $idarea Identificador de area
     *
     * @return array
     */
    public function cargarNaturaleza($idarea)
    {
        $node = 0;
        $data = array();
        $utilizar = (new ConfiguracioninventarioService())->utilizarUbicacion($this->global->Estructura->idestructura);
        if ($utilizar == '1') {
            $utiles = new UtilesubicacionService();
            $datos = $utiles->devolverNaturalezaPorTipoArea($idarea);
        } else {
            $datos = $this->configuracionHelper->obtenerDatosArbolNaturaleza($node);
        }
        foreach ($datos as $index => $est) {
            $data[$index]['idnaturaleza'] = $est['idnaturaleza'];
            $data[$index]['denominacion'] = $utilizar == '1' ? $est['denominacionnat'] : $est['text'];
        }
        return $data;
    }

    /**
     * Función que permite cargar los meses a inventariar
     *
     * @param Interger $idestructuracomun Identificador de iddeposito
     *
     * @return array
     */
    public function cargarMesesInventariar($idestructuracomun)
    {
        $arrMesesN = array();
        $idEjercicioactual = $this->configuracionHelper->getEjercicioActualSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $planconteo = new PlanconteoService();
        $idplan = $planconteo->ObtenerIdPlanDadoAnno($idEjercicioactual, $idestructuracomun);
        if ($idplan) {
            $arrMeses = $planconteo->ObtenerMesesParaInventario($idplan);
            //$arrMesesN[12]['mes'] = LogisticaGlobal::__init()->getMesActual();
        }
        if ($arrMeses) {
            $periodos = Doctrine_Query::create()
                ->select('d.iddocumento, inv.idperiodo AS idperiodo')
                ->from('DatDocumento d')
                ->innerJoin('d.DatInventario inv')
                ->where(
                    'd.idejercicio = ? AND d.idestructuracomun = ? AND inv.idperiodo > 0 and d.estado <> 5',
                    array($idEjercicioactual, $idestructuracomun)
                )
                ->fetchArray();
            $idperiodos = $this->objectHelper->extractValueFromArrayColumn($periodos, 'idperiodo');
            foreach ($arrMeses as $key => $value) {
                if (!is_numeric(array_search($value['idperiodo'], $idperiodos))) {
                    $arrMesesN[$key]['idplanconteo'] = $value['idplanconteom'];
                    $arrMesesN[$key]['mes'] = $value['idperiodo'];
                    $arrMesesN[$key]['dmes'] = $this->getMes($value['idperiodo']);
                    $arrMesesN[$key]['porciento'] = $value['porciento'];
                }
            }
        }
        return array_values($arrMesesN);
    }

    /**
     * @param $valor
     * @return string
     */
    public function getMes($valor)
    {
        switch ($valor) {
            case 1:
                return 'Enero';
            case 2:
                return 'Febrero';
            case 3:
                return 'Marzo';
            case 4:
                return 'Abril';
            case 5:
                return 'Mayo';
            case 6:
                return 'Junio';
            case 7:
                return 'Julio';
            case 8:
                return 'Agosto';
            case 9:
                return 'Septiembre';
            case 10:
                return 'Octubre';
            case 11:
                return 'Noviembre';
            case 12:
                return 'Diciembre';
        }
    }

    /**
     * Función que permite cargar los años a inventariar
     *
     * @return array
     */
    public function cargarAnnosInventariar()
    {
        $idEjercicioactual = $this->configuracionHelper->getEjercicioActualSubsistema(
            $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_INV
        );
        $planconteo = new PlanconteoService();
        $arrDiciembre = $planconteo->verificarExistenciaPlanAnual($idEjercicioactual);
        if (count($arrDiciembre) > 0) {
            $datejercicio = $this->configuracionHelper->obtenerEjercicio($arrDiciembre[0]['idejercicio']);
            $arrAnnos[0]['anno'] = $datejercicio[0]->nombre;
            $arrAnnos[0]['idannoinv'] = $arrDiciembre[0]['idejercicio'];
        }
        return $arrAnnos;
    }

    /**
     * @param $datosDoc
     * @return mixed
     */
    public function movimientosInvetario($datosDoc)
    {
        $arraylotes = array();

        foreach ($datosDoc['movimientos'] as $datos) {
            $datosProd['idproducto'] = $datos['idproducto'];
            $datosProd['idmovimiento'] = $datos['idmovimiento'];
            $lotes = $this->loteService->cargarUbicacionesLote($datosProd, true)
                ->select("ul.idubicacion, l.idlote AS idlote, {$datos['idmovimiento']} AS idmovimiento, 0 AS cantidad")
                ->fetchArray();
            if (count($lotes) > 0) {
                $arraylotes = array_merge($arraylotes, $lotes);
            }
        }
        $this->loteService->adicionarLote($arraylotes, array('collection' => true));

        return $datosDoc;
    }

    /**
     * @param $datos
     * @return bool
     */
    public function eliminarLote($datos)
    {
        $idlotes = $this->objectHelper->extractValueFromArrayColumn($datos['data'], 'idlote');
        $movlotes = $this->loteService->cargarMovLote(
            array('idlote' => $idlotes, 'idmovimiento' => $datos['datos']['idmovimiento'])
        );
        $this->loteService->eliminarLote($movlotes['datos']);
        return true;
    }

    /**
     * Función que permite adicionar un documento y el conteo del producto
     *
     * @param array $datosDoc Arreglo con los parametros para adicionar un documento
     *
     * @return array
     */
    public function adicionarDocumento($datosDoc)
    {
        $this->trazaDocumento = new TrazasDocumentoModel();
        $idperiodo = $datosDoc['idperiodo'];
        unset($datosDoc['idperiodo']);
        $documento = parent::adicionarDocumento($datosDoc);
        $inventario = new DatInventario();
        if ($datosDoc['iddocumento']) {
            $inventario->assignIdentifier($datosDoc['iddocumento']);
        }
        $datosDoc['idperiodo'] = $idperiodo;
        $inventario->synchronizeWithArray($datosDoc);
        $documento->DatInventario = $inventario;
        $documento->save();
        $this->trazaDocumento->guardarTraza('Documento adicionado', $documento->iddocumento);
        if (!$this->checkProcesarProductos($datosDoc) && !$datosDoc['iddocumento'] && !$datosDoc['idindicador']) {
            $arrDatosProductos = $this->getProductosInvetariar($datosDoc, $documento->iddocumento);
            if (count($arrDatosProductos) > 0) {
                $idproductos = $this->objectHelper->extractValueFromArrayColumn($arrDatosProductos, 'idproducto');
                $result = $this->producto->adicionarMovimientos($documento->iddocumento, $idproductos);
                $this->movimientosInvetario($result);
            }
            if (count($idproductos) > 0) {
                Doctrine_Query::create()->update('DatMovimientos')->set('cantidad', -1)
                    ->where('iddocumento = ?', $documento->iddocumento)->execute();
            }
        } else {
            $datosDoc['iddocumento'] = $documento->iddocumento;
            $this->adicionarMovimientos($datosDoc);
        }
        return array(
            'iddocumento' => $documento->iddocumento,
            'cantproductos' => $this->cantidadMovimientos($documento->iddocumento),
            'reloadGridDetalle' => 1
        );
    }

    /**
     * @param $datosDoc
     * @param $iddocumento
     * @return array|type
     * @throws Doctrine_Query_Exception
     */
    private function getProductosInvetariar($datosDoc, $iddocumento)
    {
        switch ($datosDoc['tipoinventario']) {
            case self::TIPO_INV_DIARIO:
                return $this->producto->getProductosMovidosByFecha(
                    $this->global->FechaContable->fecha, $datosDoc['idestructuracomun'], $datosDoc['idestructuraubicacion']
                );
            case self::TIPO_INV_MENSUAL:
                $datosDoc['idejercicio'] = $this->global->Ejercicio->ejercicioactual;
                $dqlProductos = $this->producto->getProductosPorCiento(
                    array(
                        'idestructura' => $datosDoc['idestructuracomun'], 'idejercicio' => $datosDoc['idejercicio'],
                        'porciento' => $datosDoc['porciento'], 'idestructuraubicacion' => $datosDoc['idestructuraubicacion']
                    )
                );
                return $dqlProductos;
            case self::TIPO_INV_GENERAL:
                $sql = "SELECT mod_loginventario.f_generarinvgeneral({$iddocumento}, "
                    . "{$datosDoc['idestructuracomun']}, NULL);";
                $this->doctrineHelper->getConnection()->fetchAll($sql);
                Doctrine_Query::create()->update('DatMovimientos')->set('cantidad', -1)
                    ->where('iddocumento = ?', $iddocumento)->execute();
                return array();
            default:
                return array();
        }
    }

    /**
     * Función que permite adicionar un movimiento y modificar la cantidad que le corresponde
     * @param array $datosDoc Arreglo con los parametros para adicionar y modificar un movimiento
     * @return boolean
     */
    public function adicionarMovimientos($datosDoc)
    {
        if (is_array($datosDoc['idproductos']) && count($datosDoc['idproductos']) > 0) {
            $result = $this->producto->adicionarMovimientos($datosDoc['iddocumento'], $datosDoc['idproductos']);
            $this->movimientosInvetario($result);
            Doctrine_Query::create()->update('DatMovimientos')->set('cantidad', -1)
                ->where('iddocumento = ?', $datosDoc['iddocumento'])->execute();
        }
        if (is_array($datosDoc['idindicador']) && count($datosDoc['idindicador']) > 0) {
            $maestroP = new MaestroProductoModel();
            foreach ($datosDoc['idindicador'] as $valor) {
                $indicadores = $maestroP->getIdIndicadoresRama($valor, true);
                $indicador['idindicador'] = json_encode($indicadores['inferior']);
                $indicador['idestructura'] = $datosDoc['idestructuracomun'];
                $result2 = $this->producto->cargarProductos($indicador);
                $idprod = $this->objectHelper->extractValueFromArrayColumn($result2['datos'], 'idproducto');
                $result = $this->producto->adicionarMovimientos($datosDoc['iddocumento'], $idprod);
                $this->movimientosInvetario($result);
                Doctrine_Query::create()->update('DatMovimientos')->set('cantidad', -1)
                    ->where('iddocumento = ?', $datosDoc['iddocumento'])->execute();
            }
        }
        if (is_array($datosDoc['productos']) && count($datosDoc['productos']) > 0) {
            $this->producto->modificarMovimientos($datosDoc['productos'], false);
        }
        return true;
    }

    /**
     * Función que permite anular el estado a un documento
     *
     * @param Interger $documento Identificador de documento
     *
     * @return boolean
     */
    public function anularEstadoDocumento($iddocumento)
    {
        Doctrine_Query::create()
            ->update('DatMovimientos')
            ->set('cantidad', -1)
            ->set('importecontable', 0)
            ->set('importealternativo', 0)
            ->where('iddocumento = ?', $iddocumento);
        Doctrine_Query::create()
            ->delete('DatMovinventario')
            ->where('iddocumento = ?', $iddocumento)
            ->execute();
        Doctrine_Query::create()
            ->update('DatMovlote')
            ->set('cantidad', 0)
            ->where(
                'idmovimiento IN (SELECT m.idmovimiento FROM DatMovimientos m WHERE m.iddocumento = ?)', $iddocumento
            )
            ->execute();

        return parent::anularEstadoDocumento($iddocumento);
    }

    /**
     * Función que permite aprobar un documento de hoja de inventario
     *
     * @param array $iddocumento Identificador de documento
     *
     * @return array
     */
    public function aprobarDocumento($iddocumento)
    {
        $sobrantes = $faltantes = false;
        $movimientos = $this->getProductoModel()->devolverMovimientos(array('iddocumento' => $iddocumento), true)
            ->innerJoin( 'mov.DatMovinventario dmi')->addSelect('dmi.existenciaactual as exist')
            ->fetchArray();
        foreach ($movimientos as $item) {
            if ($sobrantes && $faltantes) {
                break;
            }
            if ($item['tienelote'] == 1) {
                if ($this->tieneDiferenciasConteoLote($item, $signo = '>')) {
                    $sobrantes = true;
                }
                if ($this->tieneDiferenciasConteoLote($item, $signo = '<')) {
                    $faltantes = true;
                }
            } else {
                if ($item['cantidad'] > $item['exist']) {
                    $sobrantes = true;
                } elseif ($item['cantidad'] < $item['exist']) {
                    if (($item['exist'] - $item['cantidad']) > $item['disponible']) {
                        throw new LogisticaException('LOG_LB_DOC_023');
                    }
                    $faltantes = true;
                }
            }
        }
        $this->aprobarMovimientos($iddocumento);
        $this->realizarOperaciones($sobrantes, $faltantes, $iddocumento);
        return array('success' => true, 'codigoMsg' => ($sobrantes || $faltantes));
    }

    /**
     * @param $idDocumento
     */
    private function aprobarMovimientos($idDocumento)
    {
        $cronologia = parent::aprobarDocumento($idDocumento, true);
        $this->getProductoModel()->aprobarMovimientos($idDocumento, $cronologia, false, false, false);
        $sqlUpdate = "WITH sq_update as (
                select dp.idproducto,dp.cantidad, dp.precio, dp.precioalternativo,dp.importe,dp.importealternativo
                from mod_logistica.dat_movimiento dm
                inner join mod_logistica.dat_producto dp on dp.idproducto = dm.idproducto
                where dm.iddocumento = {$idDocumento}
        )
        update mod_logistica.dat_movimiento dd
        set existenciaactual = sq_update.cantidad,
            preciopromedio = sq_update.precio,
            preciopromalt = sq_update.precioalternativo,
            importetotal = sq_update.precio * sq_update.cantidad,
            importetotalalt = sq_update.precioalternativo * sq_update.cantidad
        from sq_update
        where dd.idproducto = sq_update.idproducto and dd.iddocumento = {$idDocumento};";
        $this->doctrineHelper->executeQuery($sqlUpdate);
    }

    /**
     * Devuelve los lotes con diferencias.
     *
     * @param array $datos
     * @param string $signo
     *
     * @return boolean
     */
    public function tieneDiferenciasConteoLote($datos, $signo)
    {
        $lotes = Doctrine_Query::create()
            ->select('l.idlote')
            ->from('DatLote l')
            ->innerJoin('l.DatMovlote ml')
            ->where('l.idproducto = ? AND ml.idmovimiento = ?', array($datos['idproducto'], $datos['idmovimiento']))
            ->groupBy('l.idlote')
            ->having("sum(ml.cantidad) {$signo} l.existencia")
            ->fetchArray();
        return count($lotes) > 0;
    }

    /**
     * Función que permite realizar operaciones a un documento que esta en proceso de aprobacion
     *
     * @param boolean $sobrantes Arreglo con los parametros de un conteo por sobrante
     * @param boolean $faltantes Arreglo con los parametros de un conteo por faltante
     * @param interger $iddocumento Identificador de documento
     *
     * @return boolean
     */
    public function realizarOperaciones($sobrantes, $faltantes, $iddocumento)
    {
        $index = 0;
        if ($sobrantes) {
            $ajustes[$index] = new stdClass();
            $ajustes[$index]->signo = LogisticaMovimientoModel::SIGNO_MOV_SUMA;
            $index++;
        }
        if ($faltantes) {
            $ajustes[$index] = new stdClass();
            $ajustes[$index]->signo = LogisticaMovimientoModel::SIGNO_MOV_RESTA;
        }
        if (count($ajustes) > 0) {
            $this->crearAjusteInventario($iddocumento, $ajustes);
        }
    }

    /**
     * Función que permite adicionar un ajuste de inventario si existe un coteo por faltante o sobrante
     *
     * @param Interger $iddocumento Identificador de documento
     * @param array $ajustes Arreglo con los parametros de un conteo a ajustar
     *
     * @return Array
     */
    public function crearAjusteInventario($iddocumento, $ajustes)
    {
        $ajuste = new AjusteModel(array('alias' => 'ajusteLog'));
        foreach ($ajustes as $value) {
            $idoperacion = $ajuste->getIdOperacion(AjusteModel::MOTIVO_FALTANTE);
            if ($value->signo == LogisticaMovimientoModel::SIGNO_MOV_SUMA) {
                $idoperacion = $ajuste->getIdOperacion(AjusteModel::MOTIVO_SOBRANTE);
            }
            if (!$idoperacion) {
                throw new LogisticaException('LOG_LB_DOC_022');
            }
            $datInventario = new DatInventario();
            $inventario = $datInventario->ObtenerInventarioDadoId($iddocumento);
            $datosDoc = array(
                'idestructuracomun' => $inventario[0]['idestructuracomun'],
                'observaciones' => "Generado por el documento de inventario No. {$inventario[0]['nrodoc']} Ref.
                {$inventario[0]['numeroref']}", 'idoperacion' => $idoperacion, 'idinventario' => $iddocumento,
                'signo' => $value->signo
            );
            $creado = $ajuste->generarAjuste($datosDoc);
        }
        return $creado ? true : false;
    }

    /**
     * Función que permite duplicar un documento de inventario
     *
     * @param Interger $iddocumento Identificador de documento
     *
     * @return Interger
     */
    public function copiarDocumento($iddocumento, $sameDoc = false, $cancelSigno = false)
    {
        $idCopia = parent::copiarDocumento($iddocumento, $sameDoc, $cancelSigno);
        $inventario = Doctrine::getTable('DatInventario')
            ->find($iddocumento);
        $nuevoDoc = $inventario->copy();
        $datos = $inventario->toArray();
        $datos['idinventario'] = $idCopia;
        $nuevoDoc->synchronizeWithArray($datos);
        $nuevoDoc->save();
        return $nuevoDoc->idinventario;
    }

    public function checkProcesarProductos($datosDoc)
    {
        return (is_array($datosDoc['idproductos']) && count($datosDoc['idproductos']) > 0) ||
            (is_array($datosDoc['productos']) && count($datosDoc['productos']) > 0);
    }

    /**
     * Función que permite actualizar el conteo sin diferencias a los productos
     *
     * @param array $parametros Arreglo con los parametros para actualizar el conteo
     *
     * @return void
     */
    public function actualizarConteo($parametros)
    {
        $sql = "SELECT mod_loginventario.f_actualizardifinventario({$parametros['iddocumento']});";
        $this->doctrineHelper->executeQuery($sql);
    }

    /**
     * @param $datosDoc
     */
    public function guardarConteoLote($datosDoc)
    {
        $this->loteService->adicionarLote($datosDoc['datos'], $datosDoc['params']);
    }

    /**
     * @param $iddocumento
     * @return bool
     */
    public function contieneConteo($iddocumento)
    {
        return Doctrine_Query::create()
                ->from('DatMovimientos')
                ->where('iddocumento = ? AND cantidad = -1', $iddocumento)
                ->count() == 0;
    }
}