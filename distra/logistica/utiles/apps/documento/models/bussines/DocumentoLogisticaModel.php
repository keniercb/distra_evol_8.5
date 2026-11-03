<?php

/**
 * @author Kenier Cumba Bueno
 */
class DocumentoLogisticaModel extends BaseModel
{

    protected
        /**
         * @var LogisticaProductoModel Instancia de la clase LogisticaProductoModel
         * para acceder a los metodos del componente producto
         */
        $producto,
        /**
         * @var Numeric
         */
        $iddoc,
        /**
         * @var Numeric
         */
        $idestructuracomun,
        /**
         * @var Numeric
         */
        $idusuario,
        /**
         *
         */
        $idestadoAnterior,
        /**
         * @var EstadoDocumentoModel
         */
        $estadoModel,
        /**
         * @var LogisticaDoctrineHelper
         */
        $logisticaDoctrine,
        /**
         * @var TrazasDocumentoModel
         */
        $trazaDocumento,
        /**
         *
         */
        $aliasDocumento,
        /**
         * @var Numeric
         */
        $idSubsistema;

    public function __construct($datos = array())
    {
        parent::__construct();
        $this->producto = new LogisticaProductoModel();
        $this->trazaDocumento = new TrazasDocumentoModel();
        $this->idestructuracomun = $datos['idestructuracomun'] ?: $this->global->Estructura->idestructura;
        $this->idusuario = $datos['idusuario'] ?: $this->global->Perfil->idusuario;
        $this->estadoModel = new EstadoDocumentoModel();
        $this->idestadoAnterior = null;
        $this->logisticaDoctrine = LogisticaDoctrineHelper::__init();
        $this->idSubsistema = is_null($datos['subsistema']) ?
            $this->global->Subsistema->idsubsistema : $datos['subsistema'];
        if ($datos['alias']) {
            $this->aliasDocumento = $datos['alias'];
            $this->setIdTipoDocumento($datos['alias'], $this->idSubsistema);
        }
        $idejerc = $this->configuracionHelper->getEjercicioActualSubsistema($this->idestructuracomun,
            $this->idSubsistema);

        if ($idejerc == 0 && !$datos['noexception'] && $datos['isPrincipal']) {
            throw new LogisticaException('LOG_LB_DOC_016', null, null, $this->idSubsistema);
        }
        if (!$this->iddoc && !$datos['noexception'] && $datos['isPrincipal']) {

            $docPrim = $this->configuracionHelper->getDocumentsByParams(array('abreviatura' => $datos['alias']));
            $str = "<i><b>{$docPrim[0]['denominacion']}</b></i>";
            throw new LogisticaException('LOG_LB_DOC_001', null, null, $str);
        }
    }

    /**
     * Metodo para setear el iddoc del documento en cada proceso
     *
     * @param type $alias
     * @param type $subsistema
     */
    protected function setIdTipoDocumento($alias, $subsistema = null, $idestructura = null)
    {
        $idsubsistema = is_null($subsistema) ? $this->global->Subsistema->idsubsistema : $subsistema;
        $idestructura = is_null($idestructura) ? $this->idestructuracomun : $idestructura;
        $objDocPrim = LogisticaDocumentosHelper::__init()->devuelveIddocByIdEstructura(
            $alias, $idestructura, $idsubsistema
        );
        $this->iddoc = $objDocPrim->iddoc;
    }

    /**
     *
     * @param int $idSubsistema
     */
    public function setIdSubsistema($idSubsistema)
    {
        $this->idSubsistema = $idSubsistema;
    }

    /**
     *
     * @param type $idEstructura
     */
    public function setIdEstructura($idEstructura)
    {
        $this->idestructuracomun = $idEstructura;
    }

    /**
     * @return DatDocumento
     */
    public function adicionarDocumento($datosDoc = array())
    {
        if ($datosDoc['idoperaciont']) {
            $datosDoc['idoperacion'] = $datosDoc['idoperaciont'];
        }
        if ($datosDoc['numeroreft']) {
            $datosDoc['numeroref'] = $datosDoc['numeroreft'];
        }
        $documento = new DatDocumento();
        if (!$datosDoc['iddocumento']) {
            $this->inicializarDocumento($datosDoc);
        } else {
            $documento->assignIdentifier($datosDoc['iddocumento']);
        }
        if (is_array($datosDoc)) {
            $documento->synchronizeWithArray($datosDoc);
        }
        if ($documento->iddocumento) {
            $cuadre = self::validarCuadreAlmacen(array('iddocumento' => $documento->iddocumento));
        } else {
            $cuadre = self::validarCuadreAlmacen(array('idestructuracomun' => $datosDoc['idestructuracomun'],
                'fechacontable' => $datosDoc['fechacontable']));
        }

        return $documento;
    }

    public function adicionarClientes($idDocumento, $idClientes, $clearOlds = false)
    {
        $this->trazaDocumento->guardarTraza('Clientes adicionados', $idDocumento);
        if ($clearOlds) {
            $this->eliminarOldClients($idDocumento);
        }
        $collClientes = new Doctrine_Collection('DatDocumentoCliente');

        foreach ($idClientes as $cliente) {
            if (is_numeric($cliente['idcliente']) && !DatDocumentoCliente::existeClienteDocumento(
                    $idDocumento, $cliente['idcliente'], $cliente['tipocliente']
                )
            ) {
                $record = new DatDocumentoCliente();
                $cliente['iddocumento'] = $idDocumento;
                $record->synchronizeWithArray($cliente);
                $collClientes->add($record);
            }
        }
        if ($collClientes->count()) {
            $collClientes->save();
        }
    }

    public function eliminarOldClients($idDocumento)
    {
        $this->logisticaDoctrine->query(
            "DELETE * FROM DatDocumentoCliente WHERE iddocumento = {$idDocumento}"
        );
        return true;
    }

    /*borrar estooooooooooooooo*/
    public function cargarDatosDocPadre($idDocumento)
    {
        $sql = "select es.idestructuracomun,ndp.abreviatura from mod_logistica.dat_documento d
            inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc            
            inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dp.iddocumentos
            inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dp.idestructurasubsist
            where d.iddocumento = {$idDocumento}";
        $data = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        return $data[0];
    }

    /**
     *
     * @param type $datosDoc
     */
    public function inicializarDocumento(&$datosDoc)
    {

        $datosDoc['iddoc'] = ($datosDoc['iddoc']) ?: $this->iddoc;
        $datosDoc['idusuario'] = $this->idusuario;
        $datosDoc['idespecialidad'] = $this->getEspecialidad();
        $datosDoc['idejercicio'] = $this->configuracionHelper
            ->getEjercicioActualSubsistema($this->idestructuracomun, $this->idSubsistema);
        $datosDoc['idperiodo'] = $this->configuracionHelper
            ->getPeriodoActualSubsistema($this->idestructuracomun, $this->idSubsistema);
        $datosDoc['idestructuracomun'] = $datosDoc['idestructuracomun'] ?:
            $this->idestructuracomun;
        if ($datosDoc['idejercicio'] == 0) {
            unset($datosDoc['idejercicio']);
        }
        if ($datosDoc['idperiodo'] == 0) {
            unset($datosDoc['idperiodo']);
        }
        $fechaDep = is_numeric($datosDoc['idestructuracomun']) ? LogisticaFechasHelper::__init()->getFechaDeposito($datosDoc['idestructuracomun']) : false;
        $fechaDep = ($this->idSubsistema == LogisticaGlobal::SUBSISTEMA_FAC && (new VariablesGlobalesModel())->obtenerValor('FECHA_FACT_TPV') != null) ? false : $fechaDep;

        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->idestructuracomun, $this->idSubsistema);
        $anno = explode('/', $fecha->fecha);
        $datosDoc['anno'] = ($anno[2]) ?: date('Y');
        $datosDoc['fechacontable'] = ($datosDoc['fechaproduccion']) ?: $fechaDep ?: $fecha->fecha;
        $datosDoc['version'] = 1;
        $datosDoc['cronologia'] = 0;
        $datosDoc['estado'] = EstadoDocumentoModel::ESTADO_ELABORACION;
        $datosDoc['hora'] = date('H:i:s');
        if (!$datosDoc['numeroref']) {
            $datosDoc['numeroref'] = $this->devolverUltimoNumeroDoc(
                $datosDoc['iddoc'], $datosDoc['idestructuracomun'], $datosDoc['idejercicio']
            );
        }
        $this->initOperacionDocumento($datosDoc);
        $this->objectHelper->unsetNullValues($datosDoc);
    }

    private function initOperacionDocumento(&$datosDoc)
    {
        if (!$datosDoc['idoperacion']) {
            $operacion = $this->configuracionHelper->obtenerOperaciones(null, null, $datosDoc['iddoc']);
            $datosDoc['idoperacion'] = $operacion[0]['idnomoperaciones'];
        }
    }

    /**
     * Devuelve el ultimo numero de documento generado para la estructura dado el tipo de documento
     *
     * @param Integer $iddoc
     * @param Integer $idestructuracomun
     *
     * @return Integer
     */
    public function devolverUltimoNumeroDoc($iddoc = null, $idestructuracomun = null, $idejercicio = null,
                                            $campo = 'numeroref')
    {
        $iddoc = is_null($iddoc) ? $this->iddoc : $iddoc;
        $idestructuracomun = is_null($idestructuracomun) ? $this->idestructuracomun : $idestructuracomun;
        $numero = (new DatDocumento())->devolverUltimoNumeroDoc($iddoc, $idestructuracomun, $idejercicio, $campo, array(
            'idespecialidad' => $this->getEspecialidad()
        ));
        return $numero + 1;
    }

    /**
     * Devuelve los datos de la cabecera del documento
     *
     * @param numeric $iddocumento
     *
     * @return array
     */
    public function cargarEncabezado($iddocumento)
    {
        $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        $docPrim = $this->configuracionHelper->ObtenerDocumentoPrimPorId($doc->iddoc);
        return array(
            'numero' => is_null($doc->nrodoc) ? $doc->numeroref : $doc->nrodoc,
            'fecha' => $doc->fechacontable,
            'estado' => $doc->estado,
            'idoperacion' => $doc->idoperacion,
            'observaciones' => $doc->observaciones,
            'tipo' => $docPrim->sigla
        );
    }

    /**
     * @return Doctrine_Query
     */
    public function devolverDocumentos($parametros = array())
    {
        $query = $this->getQueryDocumento('d');
        (new DatDocumentoCliente)->addDqlClientesDocumentos($query, 'd', 'c', $parametros);
        $this->producto->getMovimientoModel()->getJoinContarMovimientos($query, 'd', 'm');
        $this->addFiltersQueryDocumento($query, $parametros, 'd');
        if ($parametros['idcliente'] || $parametros['tipocliente']) {
            (new DatDocumentoCliente)->addFilterCliente($query, 'd', 'dcc', $parametros);
        }
        return $query;
    }

    /**
     *
     * @param Doctrine_Query $dql
     * @param type $parametros
     * @param type $alias
     *
     * @return \Doctrine_Query
     */
    public function addFiltersQueryDocumento(Doctrine_Query $dql, $parametros, $alias = 'd')
    {
        if ($parametros['criterio']) {
            if (is_numeric($parametros['criterio'])) {
                $parametros['nrodoc'] = $parametros['criterio'];
            } else {
                $parametros['nrodoc'] = -1;
            }
            unset($parametros['criterio']);
        }

        if ($parametros['nrodoc']) {
            $dql->addWhere("({$alias}.nrodoc = ? OR {$alias}.numeroref = ?)",
                array($parametros['nrodoc'], $parametros['nrodoc']));
        }
        if ($parametros['idusuario']) {
            $dql->addWhere("{$alias}.idusuario = ? ", array($parametros['idusuario']));
        }
        if ($parametros['aprobadopor']) {
            $dql->addWhere("{$alias}.aprobadopor = ? ", array($parametros['aprobadopor']));
        }
        if ($parametros['iddocumento']) {
            $parametros['iddocumento'] = (is_array($parametros['iddocumento'])) ?
                $parametros['iddocumento'] : array($parametros['iddocumento']);
            $dql->whereIn("{$alias}.iddocumento", $parametros['iddocumento']);
        }
        if ((new DatDocumento())->contains('idespecialidad')) {
            //$dql->addWhere("{$alias}.idespecialidad = ? ", array($this->getEspecialidad()));
        }
        if ($parametros['observaciones']) {
            $dql->addWhere("{$alias}.observaciones ilike '%{$parametros['observaciones']}%'");
        }
        $this->filtrosFecha($dql, $parametros, $alias);
        $this->filtrosOperaciones($dql, $parametros, $alias);
        return $dql;
    }

    private function filtrosOperaciones(Doctrine_Query $dql, $parametros, $alias)
    {
        if ($parametros['idestructura']) {
            if (is_string($parametros['idestructura'])) {
                $parametros['idestructura'] = json_decode($parametros['idestructura']);
            }
            $parametros['idestructura'] = is_array($parametros['idestructura']) ? $parametros['idestructura'] :
                array($parametros['idestructura']);
            $dql->andWhereIn("{$alias}.idestructuracomun ", $parametros['idestructura']);
        }
        if ($parametros['porsubsistema']) {
            $objDocPrim = $this->documentosHelper->devuelveArrIddocByIdEstructura(
                $parametros['alias'], $this->idestructuracomun, $parametros['subsistema']
            );

            $arrayResult = array();
            foreach ($objDocPrim[0] as $value) {
                array_push($arrayResult, $value);
            }
            $parametros['iddoc'] = $arrayResult;
        }
        if (!array_key_exists('filtraiddoc', $parametros) || $parametros['filtraiddoc'] == false) {
            if ($parametros['iddoc'] || $this->iddoc) {
                $iddoc = $parametros['iddoc'] ? $parametros['iddoc'] : $this->iddoc;
                if (!is_array($iddoc)) {
                    $iddoc = array($iddoc);
                }
                $dql->andWhereIn("{$alias}.iddoc", $iddoc);
            }
        }
        if ($parametros['estado']) {
            if (!is_array($parametros['estado'])) {
                $parametros['estado'] = array($parametros['estado']);
            }
            $dql->andWhereIn("{$alias}.estado", $parametros['estado']);
        } else {
            $tempExluidos = array(
                EstadoDocumentoModel::ESTADO_CANCELADO, EstadoDocumentoModel::ESTADO_ELIMINADO,
                EstadoDocumentoModel::ESTADO_ANULADO, EstadoDocumentoModel::ESTADO_CANCELADO_DUPLICADO
            );
            $dql->andWhereNotIn("{$alias}.estado", $tempExluidos);

        }
        if ($parametros['idoperacion']) {
            if (is_array($parametros['idoperacion'])) {
                $dql->andWhereIn("{$alias}.idoperacion ", $parametros['idoperacion']);
            } else {
                $dql->addWhere("{$alias}.idoperacion = ? ", array($parametros['idoperacion']));
            }
        }
    }

    private function filtrosFecha(Doctrine_Query $dql, $parametros, $alias)
    {
        if ($parametros['desde'] || $parametros['hasta']) {
            if ($parametros['desde']) {
                $dql->addWhere("{$alias}.fechacontable >= ? ", array($parametros['desde']));
            }
            if ($parametros['hasta']) {
                $dql->addWhere("{$alias}.fechacontable <= ? ", array($parametros['hasta']));
            }
        } else {
            if (!$parametros['idejercicio']) {
                $parametros['idejercicio'] = $this->configuracionHelper
                    ->getEjercicioActualSubsistema($this->idestructuracomun, $this->idSubsistema);
            }
            if ($parametros['idperiodo']) {
                $dql->addWhere("{$alias}.idperiodo = ? ", array($parametros['idperiodo']));
            } elseif ($this->idSubsistema != LogisticaGlobal::SUBSISTEMA_TALLERES) {
                if (!$parametros['filtrado']) {
                    $periodo = $this->configuracionHelper->getPeriodoActualSubsistema($this->idestructuracomun, $this->idSubsistema, null);
                    $dql->andWhere("{$alias}.idperiodo = ?", $periodo);
                }
            }
            if ($parametros['anno']) {
                $dql->addWhere("{$alias}.anno = ? ", array($parametros['anno']));
            }
        }
        //LogisticaFechasHelper::__init()->getFechaDeposito($parametros['idestructura']);
        if (!$parametros['generaobligaciones'] && !$parametros['hasta']) {
            $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
                $this->idSubsistema);
            $fechaDep = is_numeric($parametros['idestructura']) ? LogisticaFechasHelper::__init()->getFechaDeposito($parametros['idestructura']) : false;
            $dql->addWhere("{$alias}.fechacontable <= ? ", array($fechaDep != false ? $fechaDep : $fecha->fecha));
        }
    }

    /**
     *
     * @param type $as
     *
     * @return type
     */
    protected function getSelectSinAlias($as = 'd')
    {
        return "{$as}.iddocumento,{$as}.idestructuracomun, {$as}.anno, {$as}.cronologia, {$as}.estado, {$as}.idcomprobante as idcomprobante,"
            . "{$as}.fechacontable, {$as}.iddoc, {$as}.idejercicio, {$as}.idoperacion,{$as}.idoperacion as idoperaciont, "
            . "{$as}.idusuario, {$as }.aprobadopor, {$as}.nrodoc, {$as}.numeroref,{$as}.numeroref as numeroreft, {$as}.observaciones, "
            . "{$as}.controlfirma, {$as }.hora, ({$as}.idusuario = {$this->idusuario}) as is_creador, {$as}.idnodo, {$as}.iduebdestino, {$as}.firmado, {$as}.idbloqueousuario";
    }

    /**
     *
     * @return LogisticaProductoModel
     */
    public function getProductoModel()
    {
        return $this->producto;
    }

    /**
     *
     * @return IdDocumento
     */
    public function getIdDocumento()
    {
        return $this->iddoc;
    }

    /**
     * @return Doctrine_Query Devuelve un objeto de consulta de doctrine con la tabla DatDocumento como root
     */
    public function getQueryDocumento($alias = 'd')
    {
        return Doctrine_Query::create()->from("DatDocumento {$alias}")
            ->select($this->getSelectSinAlias($alias))
            ->orderBy("{$alias}.iddocumento DESC");
    }

    /**
     * Funcion para eliminar un documento. Si es el ultimo documento de la entidad lo elimina,
     * sino anula el documento.
     *
     * @param int $iddocumento Identificador del documento a eliminar
     */
    public function eliminarDocumento($iddocumento)
    {
        $cuadre = self::validarCuadreAlmacen(array('iddocumento' => $iddocumento));
        $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        if ($doc->estado == EstadoDocumentoModel::ESTADO_ELABORACION) {
            if ($this->verificarTiendaVirtual($iddocumento)) {
                $nro = $this->devolverUltimoNumeroDoc($doc->iddoc, $doc->idestructuracomun, $doc->idejercicio);
                $movimiento = new LogisticaMovimientoModel();
                $movimiento->eliminarMovimientos($iddocumento, null, false, ($doc->numeroref != $nro - 1));
                if ($doc->numeroref == $nro - 1) {
                    Doctrine_Query::create()->delete('DatDocumento')->where('iddocumento = ?', array($iddocumento))->execute();
                } else {
                    $this->trazaDocumento->guardarTraza('Documento eliminado', $iddocumento, EstadoDocumentoModel::ESTADO_ELIMINADO);
                    $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_ELIMINADO);
                    $comprometida = new CantidadesComprometidasModel();
                    $comprometida->eliminarCantidadComprometida($iddocumento);
                    Doctrine_Query::create()->delete()->from('DatDocumentoPadre')->where('iddocumento = ?', $iddocumento)->execute();
                }
                return true;
            }
        }

    }

    /**
     *
     */
    public function confirmarDocumento($iddocumento)
    {
        $cuadre = self::validarCuadreAlmacen(array('iddocumento' => $iddocumento));
        $this->trazaDocumento->guardarTraza('Documento confirmado', $iddocumento, EstadoDocumentoModel::ESTADO_PENDIENTE);
        return $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_PENDIENTE);
    }

    /**
     *
     * @param type $iddocumento
     */
    public function getEstadoDocumento($iddocumento)
    {
        $this->idestadoAnterior = $this->estadoModel->getEstadoActual($iddocumento);
    }

    /**
     *
     * @param type $iddocumento
     *
     * @return type
     */
    public function anularEstadoDocumento($iddocumento)
    {
        $cuadre = self::validarCuadreAlmacen(array('iddocumento' => $iddocumento));
        $this->trazaDocumento->guardarTraza('Estado anulado ', $iddocumento, EstadoDocumentoModel::ESTADO_ELABORACION);
        return $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_ELABORACION);
    }

    /**
     *
     * @param type $iddocumento
     *
     * @return type
     */
    public function anularDocumento($iddocumento)
    {
        $cuadre = self::validarCuadreAlmacen(array('iddocumento' => $iddocumento));
        $this->trazaDocumento->guardarTraza('Documento anulado', $iddocumento, EstadoDocumentoModel::ESTADO_ANULADO);
        Doctrine_Query::create()->delete()->from('DatDocumentopadre')->where('iddocumento = ?', $iddocumento)->excecute();
        $comprometida = new CantidadesComprometidasModel();
        $comprometida->eliminarCantidadComprometida(array($iddocumento));
        return $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_ANULADO);


    }

    /**
     * Aprueba el documento.
     * @param numeric $iddocumento
     * @param boolean $setCronologia [Opcional]
     * @return numeric|boolean
     */
    public function aprobarDocumento($iddocumento, $setCronologia = false)
    {
        $this->trazaDocumento->guardarTraza('Documento aprobado', $iddocumento, EstadoDocumentoModel::ESTADO_APROBADO);
        $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_APROBADO);
        $this->actualizarAprobadoPoryFecha($iddocumento);
        return $setCronologia ? $this->establecerCronologia($iddocumento) : true;
    }

    /**
     *
     * @param type $iddocumento
     *
     * @return type
     */
    public function copiarDocumento($iddocumento, $sameDoc = false, $cancelSigno = false, $sameMov = true)
    {
        $this->trazaDocumento->guardarTraza('Documento duplicado', $iddocumento);
        $this->cargarEncabezado($iddocumento);
        $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        $nuevoDoc = $doc->copy(false);
        if (!$sameDoc) {
            $datos = $doc->toArray();
            $this->inicializarDocumento($datos);
            $datos['aprobadopor'] = null;
            $datos['idcomprobante'] = null;
            $datos['nrodoc'] = null;
            $nuevoDoc->synchronizeWithArray($datos);
            $nuevoDoc->observaciones = "Documento generado a partir del "
                . "documento No:{$doc->nrodoc} - Ref:{$doc->numeroref}";
            $nuevoDoc->numeroref = $this->devolverUltimoNumeroDoc($nuevoDoc->iddoc, $nuevoDoc->idestructuracomun,
                $this->configuracionHelper
                    ->getEjercicioActualSubsistema($this->idestructuracomun, $this->idSubsistema));
        }
        $nuevoDoc->save();
        $movimientos = $this->producto->getMovimientoModel()
            ->devolverMovimientos(array('iddocumento' => $iddocumento))->fetchArray();
        if (count($movimientos)) {
            foreach ($movimientos as $mov) {
                if ($doc->anno == 2020) {
                    $arrayIdProducto[] = array(
                        'idproducto' => $mov['idproducto'],
                        'cantidad' => ($sameMov) ? $mov['cantidad'] : 0,
                        'preciocontable' => ($sameMov) ? $mov['preciocontable'] + $mov['precioalternativo'] : 0,
                        'importecontable' => ($sameMov) ? $mov['importe'] + $mov['importealternativo'] : 0,
                        'precioalternativo' => ($sameMov) ? /*$mov['precioalternativo']*/
                            0 : 0,
                        'importealternativo' => ($sameMov) ? /*$mov['importealternativo']*/
                            0 : 0,
                        'cancelar' => $sameDoc
                    );
                } else {
                    $arrayIdProducto[] = array(
                        'idproducto' => $mov['idproducto'],
                        'cantidad' => ($sameMov) ? $mov['cantidad'] : 0,
                        'preciocontable' => ($sameMov) ? $mov['preciocontable'] : 0,
                        'importecontable' => ($sameMov) ? $mov['importe'] : 0,
                        'precioalternativo' => ($sameMov) ? $mov['precioalternativo'] : 0,
                        'importealternativo' => ($sameMov) ? $mov['importealternativo'] : 0,
                        'cancelar' => $sameDoc
                    );
                }
                if ($sameDoc) {
                    $arrayIdProducto[count($arrayIdProducto) - 1]['entrada'] = 1;
                }
            }
            $signo = $cancelSigno ? $this->producto->getSignoContrario($movimientos[0]['signo']) :
                $movimientos[0]['signo'];
            $this->producto->adicionarMovimientos($nuevoDoc->iddocumento, $arrayIdProducto, $signo);
        }
        return $nuevoDoc->iddocumento;
    }

    public function cancelarDocumento($idDocumento, $flag = false)
    {
        $doc = Doctrine::getTable('DatDocumento')->find($idDocumento);
        if (!$flag || $flag === $doc->uuidflag) {
            if ($this->contabilidadHelper->verificarDuoContabilizadoExterno($idDocumento) == false) {
                $docGenerado = $this->verificarDocumentoGenerado($idDocumento);
                if (count($docGenerado)) {
                    $this->doctrineHelper->getConnection()->execute(
                        "update mod_logistica.dat_documento set uuidflag = null 
                     where iddocumento = {$idDocumento}"
                    );
                    throw new ZendExt_Exception('LOG_LB_DOC_032');
                }
                $this->trazaDocumento->guardarTraza('Documento cancelado', $idDocumento, EstadoDocumentoModel::ESTADO_CANCELADO);
                $this->checkPuedeCancelar($idDocumento);
                $idCancelado = $this->copiarDocumento($idDocumento, true, true);
                $this->estadoModel->setEstadoDocumento($idDocumento, EstadoDocumentoModel::ESTADO_CANCELADO);
                if (is_array($idCancelado)) {
                    $idCancelado = $idCancelado['iddocumento'];
                }
                if (is_null($doc->idcomprobante) || $doc->idcomprobante == -1) {
                    $doc->idcomprobante = -1;
                } else {
                    $doc->idcomprobante = null;
                    //ServiciosContabilidadFinanzasHelper::__init()->anularComprobante($doc);
                }
                $doc->idusuario = $this->idusuario;
                $doc->save();
                $this->estadoModel->setEstadoDocumento($idCancelado, EstadoDocumentoModel::ESTADO_CANCELADO_DUPLICADO);
                $this->actualizarAprobadoPoryFecha($idCancelado, true);
                //LogisticaDoctrineHelper::__init()->getConnection()->execute('SELECT FROM mod_logubicacion.fn_arreglardesubicados();');
                LogisticaDoctrineHelper::__init()->getConnection()->execute("DELETE FROM mod_contabilidad.dat_comprobante_documento WHERE iddocumento = {$idDocumento}");
                $this->doctrineHelper->getConnection()->execute(
                    "update mod_logistica.dat_documento set uuidflag = null 
                     where iddocumento = {$idDocumento}"
                );
                return array('cronologia' => $this->establecerCronologia($idCancelado), 'iddocumento' => $idCancelado);
            } else {
                $this->doctrineHelper->getConnection()->execute(
                    "update mod_logistica.dat_documento set uuidflag = null 
                     where iddocumento = {$idDocumento}"
                );
                throw new ZendExt_Exception('LOG_LB_DOC_028');
            }
        } else {
            throw new ZendExt_Exception('LOG_LB_DOC_031');
        }
    }

    /**
     *
     */
    public function contabilizarDocumento($iddocumento)
    {
        $cuadre = self::validarCuadreAlmacen(array('iddocumento' => $iddocumento));
        $this->trazaDocumento->guardarTraza('Documento contabilizado', $iddocumento, EstadoDocumentoModel::ESTADO_CONTABILIZADO);
        $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_CONTABILIZADO);
        $this->actualizarAprobadoPoryFecha($iddocumento);
        $this->actializarComprobante($iddocumento);
        return $this->establecerCronologia($iddocumento);
    }

    /* private function insertarQRCodeDatosDoc($iddocumento){

    } */

    public function insertarQRPagoEnZona($base64Img, $iddocumento)
    {
        $imagen = new NomImagen();
        $imagen->imagen = $base64Img;
        $imagen->save();
        $query = "INSERT INTO  mod_logistica.dat_documentoimagen
                    (iddocumento,idimagen,tipo)
                    VALUES ({$iddocumento}, {$imagen->idimagen},1);";
        $result = LogisticaDoctrineHelper::__init()->getConnection()->execute($query);

        /* $documento = new DatDocumentoImagen();
        $documento->idimagen = $imagen->idimagen;
        $documento->iddocumento = $iddocumento;
        $documento->tipo = 1;
        $documento->save();
        print_r($documento->toArray());die; */
        return true;
    }

    private function actializarComprobante($iddocumento)
    {
        $query = "SELECT valor  FROM mod_logistica.nom_variableglobal gb where gb.nombre = 'OPER_NO_CONTABILIZA'";
        $result = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($query);
        if (count($result)) {
            $result = explode(',', str_replace("'", "", $result[0]['valor']));
            foreach ($result as $idopernoc) {
                Doctrine_Query::create()->update('DatDocumento')->set('idcomprobante', -1)
                    ->where('iddocumento = ? and idoperacion = ?', array($iddocumento, $idopernoc))
                    ->execute();
            }
        }
    }

    /**
     * Establece la cronologia del documento y opcionalmente los movimientos asociados.
     * @param numeric $iddocumento
     * @param boolean $setCronologia [Opcional]
     * @return numeric
     */
    public function establecerCronologia($iddocumento, $setCronologia = false)
    {
        $this->trazaDocumento->guardarTraza('Cronologia establecida', $iddocumento, EstadoDocumentoModel::ESTADO_CONTABILIZADO);
        $cronologia = $this->cronologia();
        Doctrine_Query::create()->update('DatDocumento')->set('cronologia', $cronologia)
            ->where('iddocumento = ?', array($iddocumento))
            ->execute();
        if ($setCronologia) {
            Doctrine_Query::create()->update('DatMovimientos')->set('cronologia', $cronologia)
                ->where('iddocumento = ?', array($iddocumento))
                ->execute();
        }
        return $cronologia;
    }

    public function actualizarAprobadoPoryFecha($iddocumento, $cancelar = false)
    {
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            $this->idSubsistema);

        $datosDoc = Doctrine::getTable('DatDocumento')->find($iddocumento)->toArray();

        $fechaDep = is_numeric($datosDoc['idestructuracomun']) ? LogisticaFechasHelper::__init()->getFechaDeposito($datosDoc['idestructuracomun']) : false;
        $fechaDep = ($this->idSubsistema == LogisticaGlobal::SUBSISTEMA_FAC && (new VariablesGlobalesModel())->obtenerValor('FECHA_FACT_TPV') != null) ? false : $fechaDep;

        $fecha = ($fechaDep != false ? $fechaDep : (($fecha->fecha) ? $fecha->fecha : date('d/m/Y')));

        $idperiodo = $this->configuracionHelper
            ->getPeriodoActualSubsistema($this->idestructuracomun, $this->idSubsistema);
        $docActualizar = Doctrine_Query::create()->update('DatDocumento')->set('aprobadopor', $this->idusuario)
            ->set('fechacontable', '?', $fecha);
        if ($idperiodo) {
            $docActualizar->set('idperiodo', $idperiodo);
        }
        if ($cancelar) {
            $docActualizar->set('idnodo', 'null')
                ->set('controlfirma', 0);
        } else {
            $nroDoc = $this->devolverUltimoNumeroDoc($datosDoc['iddoc'], $datosDoc['idestructuracomun'],
                $datosDoc['idejercicio'], 'nrodoc');
            /*if($this->aliasDocumento == 'facturaLog'){
                $idDoc = $datosDoc['iddoc'];
                $selectFact = "select nextval('mod_logfacturacion.sec_{$idDoc}_seq'::regclass) as nro";
                $result = LogisticaDoctrineHelper::__init()->getConnection()->fetchAssoc($selectFact);
                $nroDoc = $result[0]['nro'];
            }*/
            $docActualizar->set('nrodoc', $nroDoc);
        }
        $docActualizar->where('iddocumento = ?', array($iddocumento))
            ->execute();
        return $docActualizar;
    }

    /**
     *
     * @return type
     */
    public function cronologia($iddocumento = false)
    {
        return DatDocumento::GetCronologia($iddocumento);
    }

    /**
     *
     * @param numeric $iddocumento
     *
     * @return Doctrine_Record
     */
    public function findDocumento($iddocumento)
    {
        return Doctrine::getTable('DatDocumento')->find($iddocumento);
    }

    /**
     *
     * @param Doctrine_Query $query
     * @param type $aliasExterno
     * @param type $aliasLocal
     *
     * @return Doctrine_Query
     */
    public function getJoinDatDocumento(Doctrine_Query $query, $aliasExterno, $aliasLocal = 'd')
    {
        return $query->innerJoin("{$aliasExterno}.DatDocumento {$aliasLocal}");
    }

    /**
     * Metodo que devuelve los nombres de los usuarios que realizaron una accion sobre un documento
     * ya sea creacion o aprobacion en dependencia del campo
     *
     * @param String $campo Campo de la tabla documento que se desea consulta,
     *                      idusuario=> creado por aprobadopor=>aprobadopor
     *
     * @return array
     */
    public function devolverUsuarios($campo = 'idusuario')
    {
        $dql = Doctrine_Query::create()->select("DISTINCT d.{$campo} as id")->from('DatDocumento d')->groupBy("d.{$campo}");
        if ($this->iddoc) {
            $iddoc = is_array($this->iddoc) ? $this->iddoc : array($this->iddoc);
            $dql->andWhereIn('d.iddoc', $iddoc);
        }
        $queryResults = $dql->fetchArray();
        $usuariosDevueltos = array($this->idusuario);
        foreach ($queryResults as $idusuario) {
            //if (!array_search($idusuario['id'], $usuariosDevueltos)) {
            array_push($usuariosDevueltos, $idusuario['id']);
            //}
        }
        return ServiciosSeguridadHelper::__init()->getUsersNameById($usuariosDevueltos);
    }

    /**
     * Metodo que devuelve los nombres de los tipo de documento
     * para el combo de la busqueda
     *
     * @return array
     */
    public function devolverTipoDocumento()
    {
        return array_merge(
            $this->configuracionHelper
                ->documentosPorSubsistemaEntidad(LogisticaGlobal::SUBSISTEMA_INV, $this->idestructuracomun),
            $this->configuracionHelper
                ->documentosPorSubsistemaEntidad(LogisticaGlobal::SUBSISTEMA_DIST, $this->idestructuracomun),
            $this->configuracionHelper
                ->documentosPorSubsistemaEntidad(LogisticaGlobal::SUBSISTEMA_AFT, $this->idestructuracomun),
            $this->configuracionHelper
                ->documentosPorSubsistemaEntidad(LogisticaGlobal::SUBSISTEMA_TALLERES, $this->idestructuracomun),
            $this->configuracionHelper
                ->documentosPorSubsistemaEntidad(LogisticaGlobal::SUBSISTEMA_FAC, $this->idestructuracomun),
            $this->configuracionHelper
                ->documentosPorSubsistemaEntidad(LogisticaGlobal::SUBSISTEMA_PRODUCCION, $this->idestructuracomun)
        );
    }

    /**
     *
     * @return array()
     */
    public function cargaInicial()
    {
        $usuariosCreadores = $this->devolverUsuarios();
        $usuariosOtros = $this->devolverUsuarios('aprobadopor');
        //$nomdinamicos = $this->producto->cargarNomecladoresDinamicos();
        return array(
            'usuarios' => array_merge($usuariosCreadores, $usuariosOtros),
            'iddocs' => $this->devolverTipoDocumento()//,
            // 'nomdinamicos' => $nomdinamicos
        );
    }

    /**
     * Devuelve los documentos con el nombre de los clientes correspondientes.
     * @param array $arrayDatos
     * @return array
     */
    public function cargarClientesDocumentos(&$arrayDatos, $filtro = null)
    {
        $cacheCentroCosto = array();
        $cacheCliente = array();
        $cacheDepostio = array();
        $cacheAreaResp = array();
        $cacheOper = array();
        $arrayDatosBusqueda = array();
        $filt = null;
        $count = 0;
        foreach ($arrayDatos as $i => $doc) {
            //temporal para angel que necesita el numero de comprobante
            if ($doc['idcomprobante']) {
                $sql = "select c.numerocomprobante as nrocomprobante from mod_contabilidad.dat_comprobante c where c.idcomprobante = {$doc['idcomprobante']}";
                $resultComp = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
                $arrayDatos[$i]['nrocomprobante'] = $resultComp[0]['nrocomprobante'];
            }
            switch ($doc['tipocliente']) {
                case LogisticaGlobal::TIPO_CLIENTE_CENTRO:
                    if (!array_key_exists($doc['idcliente'], $cacheCentroCosto)) {
                        if ($filtro['cambioAlias']) {
                            unset($filtro['cambioAlias']);
                        }
                        $centro = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
                            $this->idestructuracomun, null, null, $filtro, array($doc['idcliente']));
                        $cacheCentroCosto[$doc['idcliente']] = $centro[0];
                    }
                    if (!$filtro) {
                        $arrayDatos[$i]['cliente'] = $cacheCentroCosto[$doc['idcliente']]->codigocentrogrupo .
                            ' - ' . $cacheCentroCosto[$doc['idcliente']]->descripcioncentrogrupo;
                        $arrayDatos[$i]['descripcliente'] = $cacheCentroCosto[$doc['idcliente']]->descripcioncentrogrupo;
                        $arrayDatos[$i]['nombre'] = $cacheCentroCosto[$doc['idcliente']]->descripcioncentrogrupo;
                        $arrayDatos[$i]['codigocliente'] = $cacheCentroCosto[$doc['idcliente']]->codigocentrogrupo;
                    } else {
                        if ($cacheCentroCosto[$doc['idcliente']]) {
                            $arrayDatosBusqueda[$count]['cliente'] = $cacheCentroCosto[$doc['idcliente']]->codigocentrogrupo .
                                ' - ' . $cacheCentroCosto[$doc['idcliente']]->descripcioncentrogrupo;
                            $arrayDatosBusqueda[$count]['descripcliente'] = $cacheCentroCosto[$doc['idcliente']]->descripcioncentrogrupo;
                            $arrayDatosBusqueda[$count]['nombre'] = $cacheCentroCosto[$doc['idcliente']]->descripcioncentrogrupo;
                            $arrayDatosBusqueda[$count]['codigocliente'] = $cacheCentroCosto[$doc['idcliente']]->codigocentrogrupo;
                            $count++;
                        }
                    }
                    break;
                case LogisticaGlobal::TIPO_CLIENTE_CLIENTE:
                    if (isset($doc['devolvercentrocosto'])) {
                        if (!array_key_exists($doc['idcentrocosto'], $cacheCentroCosto)) {
                            if ($filtro['cambioAlias']) {
                                unset($filtro['cambioAlias']);
                            }
                            $centro = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
                                $this->idestructuracomun, null, null, $filtro, array($doc['idcentrocosto']));
                            $cacheCentroCosto[$doc['idcentrocosto']] = $centro[0];
                        }
                        if (!$filtro) {
                            $arrayDatos[$i]['denomcentrocosto'] = $cacheCentroCosto[$doc['idcentrocosto']]->codigocentrogrupo .
                                ' - ' . $cacheCentroCosto[$doc['idcentrocosto']]->descripcioncentrogrupo;
                        } else {
                            if ($cacheCentroCosto[$doc['idcentrocosto']]) {
                                $arrayDatosBusqueda[$count]['denomcentrocosto'] = $cacheCentroCosto[$doc['idcentrocosto']]->codigocentrogrupo .
                                    ' - ' . $cacheCentroCosto[$doc['idcentrocosto']]->descripcioncentrogrupo;
                            }
                        }
                    }

                    if (!array_key_exists($doc['idcliente'], $cacheCliente)) {
                        if (!is_array($filtro)) {
                            $filt['nombre'] = $filtro;
                            $filt['codigo'] = $filtro;
                        }
                        $cache = $this->configuracionHelper->getClientesProveedorByParams(
                            $doc['idcliente'], /*$this->idestructuracomun*/ null, null, null, null, $filt

                        );
                        $cacheCliente[$doc['idcliente']] = $cache['datos'][0];
                    }
                    if (!$filtro) {
                        $arrayDatos[$i]['cliente'] = $cacheCliente[$doc['idcliente']]['codigo'] . ' ' . $cacheCliente[$doc['idcliente']]['nombre'];
                        $arrayDatos[$i]['nombre'] = $cacheCliente[$doc['idcliente']]['nombre'];
                        $arrayDatos[$i]['codigocliente'] = $cacheCliente[$doc['idcliente']]['codigo'];
                        $arrayDatos[$i]['direccion'] = $cacheCliente[$doc['idcliente']]['direccion'];
                        $arrayDatos[$i]['correo'] = $cacheCliente[$doc['idcliente']]['correo'];
                    } else {

                        if (is_array($filtro)) {
                            $arrayDatos[$i]['cliente'] = $cacheCliente[$doc['idcliente']]['codigocliente'] . ' ' . $cacheCliente[$doc['idcliente']]['nombre'];
                            $arrayDatos[$i]['nombre'] = $cacheCliente[$doc['idcliente']]['nombre'];
                            $arrayDatos[$i]['codigocliente'] = $cacheCliente[$doc['idcliente']]['codigocliente'];
                            $arrayDatos[$i]['direccion'] = $cacheCliente[$doc['idcliente']]['direccion'];
                            $arrayDatos[$i]['correo'] = $cacheCliente[$doc['idcliente']]['correo'];
                        } else if ($cacheCliente[$doc['idcliente']]) {
                            $arrayDatosBusqueda[$count]['cliente'] = $cacheCliente[$doc['idcliente']]['codigo'] . ' ' . $cacheCliente[$doc['idcliente']]['nombre'];
                            $arrayDatosBusqueda[$count]['nombre'] = $cacheCliente[$doc['idcliente']]['nombre'];
                            $arrayDatosBusqueda[$count]['codigocliente'] = $cacheCliente[$doc['idcliente']]['codigo'];
                            $arrayDatosBusqueda[$count]['direccion'] = $cacheCliente[$doc['idcliente']]['direccion'];
                            $arrayDatosBusqueda[$count]['correo'] = $cacheCliente[$doc['idcliente']]['correo'];
                            $count++;
                        }
                    }
                    break;
                case LogisticaGlobal::TIPO_CLIENTE_DEPOSITO:
                    if (!array_key_exists($doc['idcliente'], $cacheDepostio)) {
                        if (is_array($filtro)) {
                            if ($filtro['cambioAlias']) {
                                unset($filtro['cambioAlias']);
                            }
                        }
                        $cache = $this->estructuraHelper->getEstructura($doc['idcliente']);
                        $cacheDepostio[$doc['idcliente']] = (array)$cache[0];
                    }
                    if (!$filtro) {
                        $arrayDatos[$i]['cliente'] = $cacheDepostio[$doc['idcliente']]['denominacion'];
                        $arrayDatos[$i]['nombre'] = $cacheDepostio[$doc['idcliente']]['denominacion'];
                        $arrayDatos[$i]['codigocliente'] = $cacheDepostio[$doc['idcliente']]['codigo'];
                    } else {
                        if ($cacheDepostio[$doc['idcliente']]) {
                            $arrayDatosBusqueda[$count]['cliente'] = $cacheDepostio[$doc['idcliente']]['denominacion'];
                            $arrayDatosBusqueda[$count]['nombre'] = $cacheDepostio[$doc['idcliente']]['denominacion'];
                            $arrayDatosBusqueda[$count]['codigocliente'] = $cacheDepostio[$doc['idcliente']]['codigo'];
                            $count++;
                        }
                    }

                    $sql = "select dee.idestructuracomun from mod_contabilidad.dat_estructurae dee where dee.idestructuracomun = {$doc['idcliente']}";
                    $resul = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
                    if (count($resul) > 0) {
                        $arrayDatos[$i]['idclienteexterno'] = $resul[0]['idestructuracomun'];
                    }

                    break;
                case LogisticaGlobal::TIPO_AREA_RESPONSABILIDAD:
                    if (!array_key_exists($doc['idcliente'], $cacheAreaResp)) {
                        if (!is_array($filtro)) {
                            $filt['nombre'] = $filtro;
                            $filt['codigo'] = $filtro;
                        }

                        $cache = $this->estructuraHelper->getEstructura($doc['idcliente'], $filt);
                        $cacheAreaResp[$doc['idcliente']] = $cache[0];
                    }
                    if (!$filtro) {
                        $arrayDatos[$i]['cliente'] = $cacheAreaResp[$doc['idcliente']]->codigo . ' ' . $cacheAreaResp[$doc['idcliente']]->denominacion;
                        $arrayDatos[$i]['nombre'] = $cacheAreaResp[$doc['idcliente']]->denominacion;
                        $arrayDatos[$i]['codigocliente'] = $cacheAreaResp[$doc['idcliente']]->codigo;
                    } else {
                        if ($cacheAreaResp[$doc['idcliente']]) {
                            $arrayDatosBusqueda[$count]['nombre'] = $cacheAreaResp[$doc['idcliente']]->denominacion;
                            $arrayDatosBusqueda[$count]['cliente'] = $cacheAreaResp[$doc['idcliente']]->denominacion;
                            $arrayDatosBusqueda[$count]['codigocliente'] = $cacheAreaResp[$doc['idcliente']]->codigo;

                            $count++;
                        }
                    }

                    break;
                default :

                    $arrayDatos[$i]['cliente'] = '-';
                    $arrayDatos[$i]['nombre'] = '-';
                    break;
            }
            if ($doc['estado'] == EstadoDocumentoModel::ESTADO_CANCELADO_DUPLICADO) {
                $arrayDatos[$i]['cliente'] = 'Cancelado';
            }
            if ($doc['idoperacion'] && !array_key_exists($doc['idoperacion'], $cacheOper)) {
                $operacion = $this->configuracionHelper->obtenerOperaciones(null, null, null, $doc['idoperacion']);
                $cacheOper[$doc['idoperacion']] = $operacion[0];
            }
            if ($doc['idestructuracomun'] && !array_key_exists($doc['idestructuracomun'], $cacheDepostio)) {
                $cache = LogisticaEstructuraUbicHelper::__init()->cargardepositos($doc['idestructuracomun'], null, null);
                $cacheDepostio[$doc['idestructuracomun']] = $cache['depositos'][0];
            }
            if ($doc['id']) {
                $estructura = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras($doc['id']);
                foreach ($estructura as $est) {
                    if ($est->idestructura == $doc['id']) {
                        $cacheEntidad[$doc['id']] = $est;
                    }
                }
            }
            $arrayDatos[$i]['operacion'] = $doc['idoperacion'] ? $cacheOper[$doc['idoperacion']]['denominacion'] : '';
            $arrayDatos[$i]['deposito'] = $doc['idestructuracomun'] ? $cacheDepostio[$doc['idestructuracomun']]['codigo'] . ' ' . $cacheDepostio[$doc['idestructuracomun']]['deposito'] : '';
            $arrayDatos[$i]['entidaddestino'] = $doc['id'] ? $cacheEntidad[$doc['id']]->denominacion : '';
            $arrayDatos[$i]['codigoentidad'] = $doc['id'] ? $cacheEntidad[$doc['id']]->codigo : '';
        }
        return (!$filtro || is_array($filtro)) ? $arrayDatos : $arrayDatosBusqueda;
    }

    /**
     *
     * @return type
     */
    public function getIddoc()
    {
        return $this->iddoc;
    }

    public function adicionarTransportador(DatDocumento $d, $datosDoc = array())
    {
        if (count($datosDoc) && $datosDoc['idorganizacion']) {
            $transporteDocumento = new DatDocumentotransporte();
            if ($datosDoc['iddocumento']) {
                $dqlResult = Doctrine_Query::create()->select('d.iddocumentotransporte')
                    ->from('DatDocumentotransporte d')
                    ->where("d.iddocumento = ? ", array($datosDoc['iddocumento']))->fetchArray();
                if ($dqlResult[0]['iddocumentotransporte']) {
                    $transporteDocumento->assignIdentifier($dqlResult[0]['iddocumentotransporte']);
                }
            }
            $transporteDocumento->synchronizeWithArray($datosDoc);
            $d->DatDocumentotransporte = $transporteDocumento;
        }
    }

    public function cargarTransportador(Doctrine_Query $dql, $aliasExterno = 'd', $aliasLocal = 'dt')
    {
        (new DatDocumentotransporte)->addDqlTransportador($dql, $aliasExterno, $aliasLocal);
    }

    public function devolverDocumentoContabilizados($arriddocs, $params, $arrayEstado = array())
    {
        $arrayEstado = is_array($arrayEstado) ? $arrayEstado : array($arrayEstado);
        if (count($arrayEstado) == 0) {
            array_push($arrayEstado, EstadoDocumentoModel::ESTADO_CONTABILIZADO);
        }
        $strEstado = implode(",", $arrayEstado);
        $query = Doctrine_Query::create()
            ->select("dd.iddocumento,dd.nrodoc,dd.estado,dd.fechacontable,dd.idusuario,dd.iddoc, dd.idoperacion,dd.idestructuracomun")
            ->from('DatDocumento dd')
            ->whereIn('dd.iddoc', $arriddocs)
            ->addWhere("dd.estado in ({$strEstado}) AND dd.idcomprobante is NULL")
            ->orderBy('dd.idestructuracomun, dd.iddoc,dd.nrodoc');
        DatDocumentoCliente::addDqlClientesDocumentos($query, 'dd', 'c');
        $query->addSelect(
            "(COALESCE(( SELECT SUM(round(mv.importecontable,2)) FROM DatMovimientos mv "
            . "WHERE mv.iddocumento = dd.iddocumento),0) + COALESCE((SELECT SUM(COALESCE(dci.valormn,0)) FROM DatConceptoimporterecep dci "
            . "INNER JOIN dci.DatRecepcion r ON r.iddocumento = dci.iddocumento "
            . "WHERE dci.iddocumento = dd.iddocumento AND r.salidafactura = 1),0)) as importetotal"
        );
        $query->addSelect(
            "(COALESCE(( SELECT SUM(round(mv2.importealternativo,2)) FROM DatMovimientos mv2 "
            . "WHERE mv2.iddocumento = dd.iddocumento),0) + COALESCE((SELECT SUM(COALESCE(dci2.valoralt,0)) FROM DatConceptoimporterecep dci2 "
            . "INNER JOIN dci2.DatRecepcion r2 ON r2.iddocumento = dci2.iddocumento "
            . "WHERE dci2.iddocumento = dd.iddocumento AND r2.salidafactura = 1),0)) as importetotalalt"
        );
        if ($params['nrodoc']) {
            $query->addWhere("dd.nrodoc = ? ", array($params['nrodoc']));
        }
        if ($params['idestructura']) {
            $query->addWhere("dd.idestructuracomun = ? ", array($params['idestructura']));
        }
        if ($params['desde']) {
            $query->addWhere("dd.fechacontable >= ? ", array($params['desde']));
        }
        if ($params['hasta']) {
            $query->addWhere("dd.fechacontable <= ? ", array($params['hasta']));
        }
        if ($params['iddoc']) {
            $query->addWhere("dd.iddoc = ? ", array($params['iddoc']));
        }
        $data = $this->doctrineHelper->addQueryLimits($query, $params)->fetchArray();
        return array('cantidad' => $query->count(),
            'datos' => $this->cargarClientesDocumentos($data));
    }

    public function getTableAlias()
    {
        return strtolower($this->aliasDocumento);
    }

    public function salvarObservaciones($params)
    {
        $params['observaciones'] = Zend_Json::decode($params['observaciones']);
        $obsAddArray = new Doctrine_Collection('DatDocObservaciones');
        if ($params['observaciones']) {
            foreach ($params['observaciones'] as $obs) {
                $objObs = new DatDocObservaciones();
                $obs['iddocumento'] = $params['iddocumento'];
                $obs['fecha'] = date('d/m/Y');
                if ($obs['iddocobservaciones']) {
                    $objObs->assignIdentifier($obs['iddocobservaciones']);
                }
                if (is_array($obs)) {
                    $objObs->synchronizeWithArray($obs);
                }
                $obsAddArray[] = $objObs;
            }
            if ($obsAddArray->count()) {
                $obsAddArray->save();
            }
        }
    }

    public function devolverObservaciones($parametros, $dql = false)
    {
        if ($parametros['iddocumento']) {
            $query = Doctrine_Query::create()
                ->select("do.iddocumento, do.observaciones, do.fecha")->from('DatDocObservaciones do')
                ->addWhere('do.iddocumento = ?', array($parametros['iddocumento']));

            $this->logisticaDoctrine->addQueryLimits($query, $parametros);
            if ($dql) {
                return $query;
            } else {
                return array('cantidad' => $query->count(), 'datos' => $query->fetchArray());
            }
        }
        return array('cantidad' => 0, 'datos' => array());
    }

    public function eliminarObservaciones($ids)
    {
        $ids = Zend_Json::decode($ids['ids']);
        if (is_array($ids) && $ids) {
            $dql = Doctrine_Query::create()
                ->delete('DatDocObservaciones')->whereIn('iddocobservaciones ', $ids)
                ->execute();
            return true;
        }
        return false;
    }

    public function descargarDocumento($params = array())
    {
        $doc = $this->integrator->gestordocumental->obtenerBase64Documento($params['idnodo']);
        header('Cache-Control: must-revalidate');
        header('Pragma: public');
        header('Content-Description: File Transfer');
        header('Content-Disposition: attachment; filename=' . ucfirst($params['name']) . "." . strtolower($params['typeFormat']));
        header('Content-Transfer-Encoding: binary');
        header('Content-Length: ' . strlen($doc));
        header('Content-Type: ' . $params['content'] . '; charset=utf-8');
        echo $doc;
        return;
    }

    /**
     * @return stdClass
     */
    public function firmarDocumento($params = array())
    {
        set_time_limit(0);
        ini_set('max_execution_time', 0);
        $params = Zend_Json::decode(($params['data']));
        $result = new stdClass();
        $result->success = false;
        if ($params['step'] == '1') {  //exportar el doc a pdf
            $jasperClientService = new JasperClientService();
            $report = $jasperClientService->exportReport($params['reportSet']);
            if ($report->success) {
                $dir = sys_get_temp_dir() . DIRECTORY_SEPARATOR;
                $fileName = $dir . $params['reportSet']["name"];
                file_put_contents(
                    $fileName . '.pdf',
                    $report->data
                );
                $result->success = true;
                $result->codigoMsg = '1';
                $result->data = array('file' => $fileName, 'step' => '2');
                $params['file'] = $fileName;
                $params['step'] = '2';
            }
        }
        if ($params['step'] == '2') {  //adicionando DOCUMENTO al gestor documental
            if (isset($params["uid_folder"])) {
                $sgDoc = ServiciosGestionDocumentalHelper::__init();
                $respuesta = $sgDoc->adicionarDocumento(
                    $params['fileSet']["iddir"], 'Descripcion de Prueba',
                    'application/pdf', 'Descripcion de Prueba',
                    array(
                        'archivo' => array(
                            'name' => $params['reportSet']["name"],
                            'type' => 'application/pdf',
                            'tmp_name' => $params['file'],
                            'error' => 0,
                            'size' => filesize($params['file'])
                        )
                    ),
                    $params['reportSet']["name"]);
                if ($respuesta) {
                    $result->data = array('uid_node' => $respuesta["idnodoadicionado"], 'step' => '3');
                    $result->codigoMsg = '2';
                    $result->success = $respuesta["idnodoadicionado"] ? true : false;
                    $params['uid_node'] = $respuesta["idnodoadicionado"];
                    $params['idnodo'] = $respuesta["idnodoadicionado"];
                    $params['step'] = '3';
                }
                exec("srm " . $params['file'] . " > /dev/null 2>&1 &");
            }
        }
        if ($params['step'] == '3') {  //adicionando el idnodo a datdocumento y recargar grid
            $doc = $this->adicionarDocumento($params);
            $result->success = $doc ? true : false;
            $result->codigoMsg = '3';
            $result->data = array('doc' => $doc, 'step' => $doc ? '4' : '3');
        }
        if ($params['step'] == '4') {  //firmardocservice
            $docSign = $this->integrator->gestordocumental->firmardocservice($params);
            if ($docSign) {//(success && responseText.codigoMsg != 4 && responseText.documents != 'null' && responseText.documents != "[]")
                $result->success = true;
                $result->codigoMsg = '3';
                $result->data = array('doc' => $docSign, 'step' => '5');
                $params['idnodo'] = $docSign[0]['pk_iddoc'] . "_" . $docSign[0]['cant_pages'] . "_" . $docSign[0]['validez'] . '_' . (($docSign[0]['uid_node']) ? $docSign[0]['uid_node'] : $params['uid_node']);//'id_p_v_u'
                $params['controlfirma'] = (int)$params['controlfirma'] + 1;
                $params['step'] = '5';
            }
        }
        if ($params['step'] == '5') {  //adicionando el idnodo a datdocumento y recargar grid
            $doc = $this->adicionarDocumento($params);
            $result->success = $doc ? true : false;
            $result->codigoMsg = '4';
            $result->data = array('doc' => $doc, 'step' => $doc ? '4' : '3');
        }
        return $result;
    }

    public function bloquearDocumento($idDocumento, $accion)
    {
        $sqlBloqueo = $accion == 'bloquear' ? "update mod_logistica.dat_documento set idbloqueousuario = {$this->idusuario} 
                            where iddocumento = {$idDocumento} and idbloqueousuario is null" :
            "update mod_logistica.dat_documento set idbloqueousuario = null
                            where iddocumento = {$idDocumento} and idbloqueousuario ={$this->idusuario}";
        $this->doctrineHelper->executeQuery($sqlBloqueo);
        return true;
    }

    public function salvarFirmasDocumentos($data)
    {
        $data['nombreautorizadopor'] = $data['nombrejefealmacen'] ? $data['nombrejefealmacen'] : $data['nombreautorizadopor'];
        $data['ciautorizadopor'] = $data['cijefealmacen'] ? $data['cijefealmacen'] : $data['ciautorizadopor'];
        $data['cargoautorizadopor'] = $data['cargojefealmacen'] ? $data['cargojefealmacen'] : $data['cargoautorizadopor'];

        $data['nombreconciliadopor'] = $data['nombrejefecomision'] ? $data['nombrejefecomision'] : $data['nombreconciliadopor'];
        $data['ciconciliadopor'] = $data['cijefecomision'] ? $data['cijefecomision'] : $data['ciconciliadopor'];
        $data['cargoconciliadopor'] = $data['cargojefecomision'] ? $data['cargojefecomision'] : $data['cargoconciliadopor'];
        $pieFirmas = new DatPiefirmadocumento();
        $pieFirmas->synchronizeWithArray($data);
        $pieFirmas->save();
        Doctrine_Query::create()->update('DatDocumento')->set('firmado', 1)
            ->where('iddocumento = ?', array($data['iddocumento']))->execute();
    }

    public function salvarFirmasPorDefecto($data)
    {
        $idestructura = $this->idestructuracomun;
        $idfuncionalidad = $data['generalData']['idFuncionalidad'];
        // print_r($data);die;
        if (!$idfuncionalidad) {
            return;
        }
        DatPieFirmaDefDocumento::deleteByIdEstructuraAndIdFuncionalidad($idestructura, $idfuncionalidad);
        foreach ($data as $key => $value) {
            if ($value && $key !== 'generalData' && $key !== 'primaryKeyField' && $key !== 'iddocumento') {
                $pieFirmas = new DatPieFirmaDefDocumento();
                $pieFirmas->idestructura = $idestructura;
                $pieFirmas->idfuncionalidad = $idfuncionalidad;
                $pieFirmas->denominacion = $key;
                $pieFirmas->valor = $value;
                $pieFirmas->save();
            }
        }

    }

    public function cargarFirmasPorDefecto($data)
    {
        $idestructura = $this->idestructuracomun;
        $idfuncionalidad = $data['idFuncionalidad'];
        $arrFirmasNoCargar = $data['arrFirmasNoCargar'];
        $res = DatPieFirmaDefDocumento::getByIdEstructuraAndIdFuncionalidad($idestructura, $idfuncionalidad);
        $resultado = [];
        foreach ($res as $key => $value) {
            foreach ($arrFirmasNoCargar as $valuef) {
                if (stripos($value['denominacion'], $valuef)) {
                    continue 2;
                }
            }
            $resultado[$value['denominacion']] = $value['valor'];
        }
        return ['datos' => $resultado];
    }

    private function getEspecialidad()
    {
        $idUsuario = $this->global->Perfil->idusuario;
        $sql = "select cue.idespecialidad from mod_logistica.conf_usuarioespecialidad cue 
                where cue.idusuario = {$idUsuario} limit 1";
        $result = LogisticaDoctrineHelper::__init()->getConnection()->fetchAll($sql);
        return $result[0]['idespecialidad'];
    }

    public function generarComprobante($iddocumento, $subsistema)
    {
        $arrayNumComp = array();
        $iddocumento = is_array($iddocumento) ? $iddocumento : array($iddocumento);
        $comprobanteModel = ($subsistema == LogisticaGlobal::SUBSISTEMA_FAC)
            ? new FacturacionComprobanteModel()
            : ($subsistema == LogisticaGlobal::SUBSISTEMA_TALLERES ? new TalleresComprobanteModel() : new LogisticaComprobanteModel());
        foreach ($iddocumento as $id) {
            $comprobante = $comprobanteModel->contabilizarDocumento(
                $id, $subsistema
            );
            $existe = $this->contabilidadHelper->existeComprobanteDocumento($id, $subsistema);
            if (!$existe) {
                $impDebito = $impCredito = 0;
                foreach ($comprobante->dataComprobante as &$anotacion) {
                    $anotacion->numerodocumento = $anotacion->numero;
                    $anotacion->cuenta = $anotacion->concatcta;
                    $anotacion->idoperacion = $anotacion->idoperacioncontable;
                    $anotacion->fechaemision = $comprobante->fechaContable;
                    if ($anotacion->debitoCredito == 0) {
                        $anotacion->debito = $anotacion->importemb;
                        $impDebito += $anotacion->importemb;
                    } else {
                        $anotacion->credito = $anotacion->importemb;
                        $impCredito += $anotacion->importemb;
                    }
                }
                if (round($impDebito, 2) == round($impCredito, 2) && $impDebito > 0 && $impCredito > 0) {
                    $comprobante->descripcion = $comprobante->descripcion . ' Generado automaticamente';
                    $result = $this->contabilidadHelper->salvarComprobanteGeneradoDesdeSubsistemaExterno(
                        $this->global->EstructuraEconomica->idestructurae, $subsistema, $comprobante->idtipocomprobante,
                        8031, $comprobante->fechaContable, $comprobante->detalle, $comprobante->descripcion, $comprobante->dataComprobante
                    );
                } else {
                    $result = array('codMsg' => 2); //Comprobante dscuadrado
                }
                array_push($arrayNumComp, $result);
            }
        }
        return $arrayNumComp;
    }

    public function getIdentificador($iddocumento)
    {
        $result = array();
        if (!is_array($iddocumento)) {
            $iddocumento = array($iddocumento);
        }
        foreach ($iddocumento as $id) {
            $idGenerado = $this->objectHelper->guidv4();
            $this->doctrineHelper->getConnection()->execute(
                "update mod_logistica.dat_documento set uuidflag = '{$idGenerado}' 
                 where iddocumento = {$id} and uuidflag is null"
            );
            array_push($result, array($id, $idGenerado));
        }
        return $result;
    }

    public function verificarDocumentoGenerado($iddocumento)
    {
        $sql = "select es.idestructuracomun,ndp.denominacion from mod_logistica.dat_documento d
            inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc            
            inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dp.iddocumentos
            inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dp.idestructurasubsist
            inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = d.iddocumento
            where ddp.idpadre = {$iddocumento} and d.estado in (1,2,3,4) 
            and ndp.abreviatura in ('facturaLog','ajusteLog','recepcionLog','transferenciaLog','valedev','compdevLog','compventaLog',
            'debitoLog','creditoLog','valeLog')";
        $data = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        return $data;
    }

    public function verificarTiendaVirtual($iddocumento)
    {
        $tienda = "select count(nv.nombre) from mod_logistica.nom_variableglobal nv 
                          where nv.nombre = 'TV_EXIST' and nv.valor = 'true'";
        $activa = LogisticaDoctrineHelper::__init()->getConnection()->execute($tienda)->fetchAll(PDO::FETCH_COLUMN);
        if ($activa[0] > 0) {
            $sqlExiste = "select count(pd.idpedido) from mod_logpuntoventa.dat_pedidodocumento pd 
                          where pd.iddocumento = {$iddocumento}";
            $existe = LogisticaDoctrineHelper::__init()->getConnection()->execute($sqlExiste)->fetchAll(PDO::FETCH_COLUMN);
            if ($existe[0] > 0) {
                throw new ZendExt_Exception('LOG_LB_FAC_009');
            }
        }
        return true;
    }

    public function getDocumentosGenerados($datosDoc)
    {
        $sql = "select es.idestructuracomun,ndp.denominacion as tipodocumento, d.nrodoc as nrodoc, d.numeroref as numeroref, d.estado as estado, d.fechacontable, 
       ddc.tipocliente AS tipocliente, ddc.iddocumentocliente as iddocumentocliente, ddc.idcliente from mod_logistica.dat_documento d
            inner join mod_logistica.dat_documentocliente ddc on ddc.iddocumento = d.iddocumento     
            inner join mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc            
            inner join mod_datosmaestros.nom_docprim ndp on ndp.iddocumentos = dp.iddocumentos
            inner join mod_datosmaestros.dat_estructurasubsist es on es.idestructurasubsist = dp.idestructurasubsist
            inner join mod_logistica.dat_documentopadre ddp on ddp.iddocumento = d.iddocumento
            where ddp.idpadre = {$datosDoc['iddocumento']} and d.estado in (1,2,3,4) 
            and ndp.abreviatura in ('facturaLog','valedev','compdevLog','compventaLog','valeLog', 'pedido')";
        $data = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
        if (!is_numeric($datosDoc['criterio'])) {
            $cliente = $datosDoc['criterio'];
        }
        return array('datos' => $this->cargarClientesDocumentos(
            $data, $cliente
        ), 'cantidad' => count($data));
    }

    public function validarCuadreAlmacen($parametros)
    {
        return false;
        if ($parametros['productos'] && !is_array($parametros['productos'][0])) {
            $addWhere = ($parametros['iddocumento']) ? "(
                    select fechacontable from mod_logistica.dat_documento
                    where iddocumento = {$parametros['iddocumento']})" :
                "(
                    select d.fechacontable from mod_logistica.dat_documento d
                    inner join mod_logistica.dat_movimiento m on m.iddocumento = d.iddocumento
                    where m.idmovimiento = {$parametros['idmovimiento']})";
            $strProductos = implode(',', $parametros['productos']);
            $sql = "select DISTINCT h.idcierrediario from mod_logistica.dat_producto p
            inner join mod_logistica.his_cuadrediario h on h.iddeposito = p.idestructura
            where p.idproducto in ({$strProductos}) and h.fechacierre = $addWhere ";
        } elseif ($parametros['movimientos']) {
            $strMovimientos = implode(',', $parametros['movimientos']);
            $sql = "select DISTINCT h.idcierrediario from mod_logistica.dat_producto p
                    inner join mod_logistica.his_cuadrediario h on h.iddeposito = p.idestructura
                    inner join mod_logistica.dat_movimiento m on m.idproducto = p.idproducto
                    inner join mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
                    where m.idmovimiento in ({$strMovimientos})
                    and h.fechacierre = d.fechacontable";
        } elseif ($parametros['iddocumento']) {
            $sql = "SELECT h.idcierrediario FROM mod_logistica.dat_documento d
            inner join mod_logistica.his_cuadrediario h on h.iddeposito = d.idestructuracomun
            WHERE d.iddocumento = {$parametros['iddocumento']} and h.fechacierre = d.fechacontable and h.estado = 1";
        } elseif ($parametros['idestructuracomun']) {
            $sql = "SELECT h.idcierrediario FROM mod_logistica.his_cuadrediario h 
            WHERE h.iddeposito = {$parametros['idestructuracomun']}     
                and h.fechacierre = '" . $parametros['fechacontable'] . "' and h.estado = 1";
        }
        if ($sql) {
            $existCierre = $this->doctrineHelper->getConnection()->fetchAssoc($sql);
            if ($existCierre[0]['idcierrediario']) {
                throw new ZendExt_Exception('LOG_LB_CIERE_008');
            }
            return true;
        }
        return true;

    }

    public function saveQrByDoc($iddocumento, $qrcode, $type)
    {
        $imagen = "'" . $qrcode . "'";
        $sql = "INSERT INTO mod_logistica.nom_imagen (imagen) VALUES ($imagen) RETURNING idimagen";

        $imagen = $this->doctrineHelper->getConnection()->fetchAll($sql);
        $idimagen = $imagen[0]['idimagen'];
        $sql = "INSERT INTO mod_logistica.dat_documentoimagen (iddocumento,idimagen,tipo) VALUES($iddocumento, $idimagen, $type)";

        $this->doctrineHelper->getConnection()->execute($sql);
        return true;
    }
}
