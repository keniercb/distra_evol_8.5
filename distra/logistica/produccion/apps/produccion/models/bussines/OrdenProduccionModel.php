<?php

class OrdenProduccionModel extends DocumentoModel
{
    private $rrhhService, $recursosHumanosService,$planificacionService, $configuracionGeneralService, 
    $estructuraCompService, $maestroProductos, $documento, $productoorden,$cartaact;
 
    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->productoorden = new OrdenMaterialesModel();
        $this->documento = new DatDocumento();

        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatOrdenProduccion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idordenproduccion')
        );
        $relations[] = array(
            'cardinalidad' => 'one',
            'relation' => 'DatValeProduccion',
            'properties' => array('local' => 'iddocumento', 'foreign' => 'idvaleproduccion')
        );
        LogisticaDoctrineHelper::__init()->tryInyectRelactions($this->documento, $relations);

        $this->maestroProductos = new MaestroProductoModel();
        //$this->rrhhService = ServiciosRecursosHumanosHelper::__init();
        $this->recursosHumanosService = ServiciosRecursosHumanosHelper::__init();
        $this->planificacionService = ServiciosPlanificacionHelper::__init();
        $this->configuracionGeneralService = ServiciosConfiguracionGeneralHelper::__init();
        $this->estructuraCompService = ServiciosEstructuraComposicionHelper::__init();
    }

    /**
     * Instancia para garantizar el acceso singleton a la clase
     *
     * @var OrdenProduccionModel
     */
     private static $instance = null;

     /**
      * Metodo que devuelve una nueva instancia de la clase
      *
      * @return OrdenProduccionModel Instancia singleton
      */
     public static function getInstance() {
         if (null === self::$instance) {
             self::$instance = new OrdenProduccionModel(array('alias' => 'produccionLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_PRODUCCION));
         }
         return self::$instance;
     }

    /**
     * Adicionar un documento.
     * @author Yadrian Aguila
     * @return Numeric
     */
    public function adicionarDocumento($params)
    {
        $arrayProdSust = (array) Zend_Json::decode($params['arrayProdSust']);
        $documento = parent::adicionarDocumento($params);
        $op = new DatOrdenProduccion;
        $collGastos = new Doctrine_Collection('DatGasto');
        if (count($params['gastos']) == 0) {
            if ($params['iddocumento']) {
                $op->assignIdentifier($params['iddocumento']);
            } 
            $op->synchronizeWithArray($params);
            $this->productoorden->adicionarMateriales($op,$params);
            $documento->DatOrdenProduccion = $op;
        }
        $iddocumento = $documento->iddocumento ? $documento->iddocumento : $params['iddocumento'];
        if (is_array($params['gastos']) && count($params['gastos']) > 0) {
            foreach ($params['gastos'] as $gast) {
                $gt = new DatGasto();
                $gast['precio'] = $gast['precio'] ? $gast['precio'] : 0;
                $gast['iddocumento'] = $iddocumento;
                $gast['idordenproduccion'] = $iddocumento;
                if ($gast['idtipogasto'] && $params['iddocumento']) {
                  
                    $gt = Doctrine::getTable('DatGasto')->findByDql('idtipogasto = ? and idordenproduccion = ?', array($gast['idtipogasto'], $params['iddocumento']));
                }
                if (count($gt) == 0) {
                    $gt->idordenproduccion = $params['iddocumento'];
                    $gt->idtipogasto = $gast['idtipogasto'];
                    $gt->valor = $gast['valor'];
                    $gt->precio = $gast['precio'];
                    $gt->save();
                } else {
                    $gt->synchronizeWithArray($gast);
                }
                $collGastos->add($gt);
            }
        }
        if ($collGastos->count() > 0) {
            $collGastos->save();      
        }
        
        $collDatOrdenProductoSust = new Doctrine_Collection('DatOrdenProductoSust');   
        if (count($arrayProdSust) > 0) {
            foreach ($arrayProdSust as $opsust){
                if ($opsust['idordenproductosust']) {
                    $ops = new DatOrdenProductoSust;
                    $ops->assignIdentifier($opsust['idordenproductosust']);
                    $ops->synchronizeWithArray($opsust);
                    $collDatOrdenProductoSust->add($ops);
                } else {
                    self::adicionarProductosExtrasOrden([
                        'idordenproduccion' => $iddocumento,
                        'norma' => $opsust['norma'],
                        'idactividad' => json_encode([$opsust['idactividad']]),
                        'productos' => json_encode([['idindicador' => $opsust['idindicador']]]),
                    ]);
                }
            }
        } 
        
        if ($collDatOrdenProductoSust->count() > 0) {
            $collDatOrdenProductoSust->save();      
        }

        try {
            $documento->save();
            $iddocumento = $documento->iddocumento;
            $idcartatecnologica = $documento->DatOrdenProduccion->idcartatecnologica;
            $documento->free();
            $documento = null;
            unset($documento);
            $this->adicionarClientes($iddocumento, array(array('idcliente'=>$params['idcliente'],'tipocliente'=>1)));
            $this->trazaDocumento->guardarTraza('Documento adicionado', $iddocumento);
            return array('success' => true, 'iddocumento' => $iddocumento, 'idcartatecnologica' => $idcartatecnologica);
        } catch (Exception $e) {
            $documento->free();
            $documento = null;
            unset($documento);
            return array('success' => false, 'mensajes' => $e->getMessage(), 'detalles' => $e->getMessage());
        }
    }

    public function adicionarPersona($params)
    {
        $collDocoperario = new Doctrine_Collection('DatOperarioActividad');   
        foreach ($params['personas'] as $per) {
            $documentoOper = new DatOperarioActividad();
            $documentoOper->idactividad = $params['idactividad'];
            $documentoOper->idordenactividad = $params['idordenactividad'];
            $documentoOper->idresponsable = $per['idcliente'];
            $collDocoperario->add($documentoOper);
        }   
        $collDocoperario->save();         
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @author Yadrian Aguila
     * @return Array
     */
    public function devolverDocumentos($params, $dql = false)
    {
        if ($params['iddeposito']) {
            $exist = $this->existDeposito($params['iddeposito']);
            if (!empty($exist)) {
                return array(
                    'cantidad' => 0,
                    'datos' => array()
                );
            }
        }
        unset($params['idEntidadComun']);
        $query = $this->getQueryDocumento('d');
        DatDocumentoCliente::addDqlClientesDocumentos($query, 'd', 'c');
        $this->addFiltersQueryDocumento($query, $params, 'd');
        $this->addQuery($query, 'd');
        if($params['entrada']){
            $query->innerJoin("d.DatDocumentoPadre ddp ON d.iddocumento = ddp.idpadre");
        }
        if (class_exists('NomencladoresLogService')) {
            $nomenclador = new NomencladoresLogService();
            $nomenclador->getQueryConceptoByParams($query, 'dop', 'nc');
        }
      //  $query->addWhere("ddp.iddocumento is null");
        if ($params['idcliente'] || $params['tipocliente']) {
            DatDocumentoCliente::addFilterCliente($query, 'd', 'dcc', $params);
        }
        if ($params['idcliente']) {
            $query->addWhere("dop.idcliente =?", $params['idcliente']);
        }
        if ($params['idcentrogrupo']) {
            $query->addWhere("dop.idcentrogrupo =?", $params['idcentrogrupo']);
        }
        if ($params['idalmacendestino']) {
            $query->addWhere("dop.idalmacendestino =?", $params['idalmacendestino']);
        }
        if ($params['fechainicio']) {
            $query->addWhere("dop.fechainicio =?", $params['fechainicio']);
        }
        if ($params['fechafin']) {
            $query->addWhere("dop.fechafin =?", $params['fechafin']);
        }
        if ($params['idnomconcepto']) {
            $query->addWhere("dop.idnomconcepto =?", $params['idnomconcepto']);
        }
        if ($params['idcartatecnologica']) {
            $query->addWhere("dop.idcartatecnologica =?", $params['idcartatecnologica']);
        }
       if($params['desagregado']){
        if ($params['desagregado']) {
           
            $query->addWhere("dop.desagregado = ?", 1);
     } else {
            $query->addWhere("dop.desagregado = ?", 0);
        } 
       }

        if ($params['idcliente']) {
            $query->addWhere("dop.idcliente =?", $params['idcliente']);
        }
        if ($dql) {
            return $query;
        }
        $datos = $query->fetchArray();
        //$datos = $this->doctrineHelper->addQueryLimits($query, $params)->fetchArray();
        
        //print_r($datos);die;
        $oo = array(); $conto = 0;

        foreach ($datos as $i => &$dat) {            
            $arrayActividad = array();
            $datosAct = $this->cargaractividades($dat['idcartatecnologica']);
            foreach ($datosAct->datos as $act) {
                array_push($arrayActividad, $act['idactividad']);
            }
            $datosMat = $this->cargarMateriaPrima(array('arrayActividad'=> $arrayActividad, 'idordenproduccion' => $dat['idordenproduccion'], 'desviacion' => $params['desviacion']));  
            foreach ($datosMat['datos'] as $mat) {
                
                if ($mat['cantentregada'] > $mat['cantidad']) {
                    $dat['desviacion'] = 1;
                    //array_push($datos[$i], $datosMat['datos']);
                    break;          
                } else {
                    $dat['desviacion'] = 0;
                }    
            }
            if ($params['desviacion'] == true && $dat['desviacion'] == 0) {
                unset($datos[$i]);
            }
            
            /*if ($params['desviacion'] != $datos[$i]['desviacion']) {
                 unset($datos[$i]['desviacion']);
            }*/
        }



        try {           
            return array(
                'cantidad' => count($datos),
                'datos' => array_slice($datos, $params['start'], $params['limit'])
            );
        } catch (Doctrine_Connection_Pgsql_Exception $e) {
            return array('success' => false, 'mensajes' => $e->getMessage(), 'detalles' => $e->getMessage());
        } catch (Doctrine_Exception $e) {
            return array('success' => false, 'mensajes' => $e->getMessage(), 'detalles' => $e->getMessage());
        } catch (Exception $e) {
            return array('success' => false, 'mensajes' => $e->getMessage(), 'detalles' => $e->getMessage());
        }
    }

    /**
     * @param Doctrine_Query $query
     * @param string $aliasExterno
     */
    public function addQuery(Doctrine_Query &$query, $alias = false)
    {
        $query->addSelect('dop.idordenproduccion AS iddocumento,dop.idordenproduccion AS idordenproduccion,
          dop.idcentrogrupo AS idcentrogrupo,dop.nrolote AS nrolote,dop.idalmacendestino AS idalmacen,
          dop.fechacierre AS fechacierre,dop.idalmacendestino AS idalmacendestino,dop.cerradopor AS cerradopor,
          dop.idcartatecnologica AS idcartatecnologica,dop.cantidad AS cantidad,
          dop.idcontrato AS idcontrato,dop.fechainicio AS fechainicio,dop.fechafin AS fechafin,
          dop.idnomconcepto AS idnomconcepto');

        $query->addSelect(
            "COALESCE((SELECT SUM(vp.cantidad) FROM DatValeProduccion vp "
            ."WHERE vp.idordenproduccion = dop.idordenproduccion),0) as cantidadtotal"
        );

        $query->addSelect(
            "(CASE WHEN COALESCE(dop.cantidad,0) = 0 THEN 0 ELSE COALESCE(( 100 * (SELECT SUM(vpc.cantidad) FROM DatValeProduccion vpc "
            ."WHERE vpc.idordenproduccion = dop.idordenproduccion)/ dop.cantidad),0) END) as cumplimiento"
        );
        $query->addSelect(
        "COALESCE(dop.desagregado,0) as desagregado"
        );


        if ($alias) {
          $query->innerJoin("d.DatOrdenProduccion dop");
        } else {
            $query->from("DatOrdenProduccion dop");
           
        }

        return $query;

    }

    /**
     * Aprueba el documento.
     * @param numeric $iddocumento
     * @return numeric|boolean
     */
    public function cerrarDocumento($iddocumento)
    {
        $this->trazaDocumento->guardarTraza('Documento cerrado', $iddocumento, EstadoDocumentoModel::ESTADO_CERRADO);
        try {
            $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_CERRADO);
            $this->actualizarCerradoPoryFecha($iddocumento);
            return array('success' => true, 'iddocumento' => $iddocumento);
        } catch (Doctrine_Exception $e) {
            $codioMsg = $e->getCode();
            if ($e->getCode() == '23505') {
                $codioMsg = "unique_violation";
            } else if ($e->getCode() == '23502') {
                $codioMsg = "not_null_violation";
            }
            return array('success' => false, 'codigoMsg' => $codioMsg, 'detalles' => $e->getMessage(), 'mensaje' => $e->getMessage());
        } catch (Exception $e) {
            return array('success' => false, 'codigoMsg' => $e->getCode(), 'detalles' => $e->getMessage(), 'detalles' => $e->getMessage(), 'mensaje' => $e->getMessage());
        }
    }

    public function actualizarCerradoPoryFecha($iddocumento)
    {
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            $this->idSubsistema);
        $fecha = ($fecha->fecha) ? $fecha->fecha : date('d/m/Y');
        $docActualizar = Doctrine_Query::create()->update('DatOrdenProduccion')->set('cerradopor', $this->idusuario)
            ->set('fechacierre', '?', $fecha);
        $docActualizar->where('idordenproduccion = ?', array($iddocumento))
            ->execute();
        return $docActualizar;
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @author Yadrian Aguila
     * @return Array
     */
    public function existDeposito($iddeposito)
    {
        $query = "SELECT 
          idconfalmacen is not null as exist
        FROM 
          mod_logproduccion.conf_almacenes 
          WHERE idalmacen = {$iddeposito} AND almacenmpm = 23";
        $result = Zend_Registry::get('conexion')->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @author Yadrian Aguila
     * @return Array
     */
    public function cargarContrato($params)
    {
        $result = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
            $this->global->Estructura->idestructura, 0, 1000,
            $this->uiParams['criterio']
        );
        $this->datos = $result;
        $this->cantidad = count($result);

        $datos = ServiciosCrmHelper::__init()->getContratos($params);
        return array(
            'cantidad' => $datos['cant'],
            'datos' => $datos['data']
        );
    }

    /**
     * Devuelve los documentos dado los criterios de búsqueda especificados.
     * @author Yadrian Aguila
     * @return Array
     */
    public function cargarComboCentroCosto($params)
    {
        $datos = ServiciosContabilidadFinanzasHelper::__init()->obtenerCentrosCostoFiltro($this->global->Estructura->idestructura, 0, 1000,
            $params['criterio']);
        return array(
            'cantidad' => count($datos),
            'datos' => $datos
        );
    }

    public function adicionarMateriales($params)
    {
        if ($params['data']) {
            $colletions = new Doctrine_Collection('DatOrdenMateriaPrima');
            $colletionsust = new Doctrine_Collection('DatOrdenProductosust');
            foreach ($params['data'] as $elem) {
                $el = new DatOrdenMateriaPrima();
                if ($elem['idmaterialesproduccion']) {
                    $el->assignIdentifier($elem['idmaterialesproduccion']);
                }
                if ($elem['idordenproductosust']) {
                    $el->assignIdentifier($elem['idordenproductosust']);
                }
              
                $el->synchronizeWithArray($elem);
                $colletions->add($el);
                $colletionsust->add($el);
            }
            try {
                $colletions->save();
                $colletionsust->save();
                return array(
                    'success' => true,
                    'message' => "Created new record"
                );
            } catch (Exception $e) {
                return array(
                    'success' => false,
                    'message' => "Failed to create record"
                );
            }
        } else {
            return array(
                'success' => false,
                'message' => "Failed is empty"
            );
        }

    }

    public function cargarMateriales($params, $aliasProducto = 'dprod')
    {
        $params['idejercicio'] = $this->configuracionHelper->getEjercicioActualSubsistema($this->idestructuracomun, $this->idSubsistema);
        $cantidadConsumida = 0;
        $params['idcartatecindustrial'] = !empty($params['idcartatecindustrial']) ? $params['idcartatecindustrial'] : 0;
        $WHERE = " AND i.idindicador IN(SELECT p.idindicador FROM mod_logproduccion.conf_almacenes ca INNER JOIN mod_logistica.dat_producto p ON (ca.idalmacen = p.idestructura) WHERE almacenmpm = 1 AND identidad = {$this->global->Estructura->idestructura})"; //AND p.idestructura IN(SELECT idalmacen FROM mod_logproduccion.conf_almacenes WHERE almacenmpm = 1 AND identidad = {$this->global->Estructura->idestructura})
        $JOIN_AND = " ";
        if($params['idalmacenorigen']){
            $JOIN_AND = " AND p.idestructura = {$params['idalmacenorigen']}";
        }
        $conn = Doctrine_Manager::connection();
       
        $query="SELECT
         --ops.idordenproductosust,
        ind.codigo,
        ind.denominacion,
        um.denominacionunidadmedida as um,
                COALESCE(sum(n.necesidad), 0.00) as norma,
        (SELECT COALESCE(sum(m.cantidad),0) FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
            INNER JOIN mod_logistica.dat_documentopadre pp on pp.iddocumento = m.iddocumento
                INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc
               INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos                   
                INNER JOIN mod_logistica.dat_producto p ON (m.idproducto = p.idproducto)  
                WHERE ind.idindicador = p.idindicador AND pp.idpadre = {$params['idordenproduccion']} 
                AND np.abreviatura = 'solEntrega'  ) AS solicitada,

                COALESCE((SELECT sum(m.cantidad) FROM mod_logistica.dat_movimiento m 
           INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
           INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc
                 INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
                INNER JOIN mod_logistica.dat_documentopadre pp on pp.iddocumento = d.iddocumento    
                 INNER JOIN mod_logistica.dat_documento ds on pp.idpadre = ds.iddocumento      
             INNER JOIN mod_logistica.dat_documentopadre ppo on ppo.iddocumento = ds.iddocumento        
                INNER JOIN mod_logistica.dat_producto p ON (m.idproducto = p.idproducto)  
           WHERE ind.idindicador = p.idindicador AND ppo.idpadre = {$params['idordenproduccion']}
                AND np.abreviatura = 'valeLog' AND d.estado = 4),0) - COALESCE((SELECT COALESCE(sum(m.cantidad),0) 
                FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_logistica.dat_documento dvd on dvd.iddocumento = m.iddocumento
               INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dvd.iddoc
               INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
               INNER JOIN mod_logistica.dat_documentopadre ppvd on ppvd.iddocumento = dvd.iddocumento    
               INNER JOIN mod_logistica.dat_documento dds on ppvd.idpadre = dds.iddocumento
                INNER JOIN mod_logistica.dat_documentopadre ppds on ppds.iddocumento = dds.iddocumento    
                INNER JOIN mod_logistica.dat_documento dso on ppds.idpadre = dso.iddocumento            
                INNER JOIN mod_logistica.dat_documentopadre ppso on ppso.iddocumento = dso.iddocumento                 
                INNER JOIN mod_logistica.dat_producto p ON (m.idproducto = p.idproducto)  
                WHERE ind.idindicador = p.idindicador AND ppso.idpadre = {$params['idordenproduccion']}  
             AND np.abreviatura = 'valedev' AND dvd.estado = 4 ),0) AS entregada,
             COALESCE((SELECT {$aliasProducto}.idproducto FROM mod_logistica.dat_producto {$aliasProducto} WHERE {$aliasProducto}.idindicador = ind.idindicador
        AND {$aliasProducto}.idestructuracomun = {$this->global->Estructura->idestructura} $subquery LIMIT 1),0) AS idproducto
      
 FROM mod_planificacion.dat_norma n
      INNER JOIN mod_planifindustrial.dat_cartatecindustrialactividad ca ON (ca.idactividad = n.idactividad)
      INNER JOIN mod_datosmaestros.nom_indicador ind ON (ind.idindicador = n.idindicador)
      INNER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = ind.idumedida)
      LEFT JOIN mod_logproduccion.dat_precioporindicador pxi ON (pxi.idcartatecindustrial = ca.idcartatecindustrial AND pxi.idindicador = n.idindicador)
      --LEFT JOIN mod_logproduccion.dat_ordenproductosust ops ON (ind.idindicador = ops.idindicador)
        
 WHERE n.idejercicio =
       (
         SELECT idejercicio
         FROM mod_planificacion.nom_ejercicioplanificacion
         WHERE actual = 1
       ) AND
       ca.idcartatecindustrial = {$params['idcartatecindustrial']} --and ind.tipo = 1
 GROUP BY ind.idindicador,
          ind.codigo,
          ind.denominacion,
          um.denominacionunidadmedida,
          pxi.idprecioporindicador,
          ind.precio
          --ops.idordenproductosust
          /*UNION
          SELECT
          --ops.idordenproductosust,
                 COALESCE(i.numeropieza,i.codigo) as codigo,
                 i.denominacion,
               um.abreviaturaunidadmedida as um,
                -- ops.norma,
                COALESCE(sum(n.necesidad), 0.00) as norma,
              (SELECT COALESCE(sum(m.cantidad),0) FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
                INNER JOIN mod_logistica.dat_documentopadre pp on pp.iddocumento = m.iddocumento
               INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc
                 INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos                   
                INNER JOIN mod_logistica.dat_producto p ON (m.idproducto = p.idproducto)  
                WHERE i.idindicador = p.idindicador AND pp.idpadre = {$params['idordenproduccion']}
                 AND np.abreviatura = 'solEntrega') AS solicitada,

                COALESCE((SELECT sum(m.cantidad) FROM mod_logistica.dat_movimiento m 
              INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
                 INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc
                INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
                INNER JOIN mod_logistica.dat_documentopadre pp on pp.iddocumento = d.iddocumento    
                INNER JOIN mod_logistica.dat_documento ds on pp.idpadre = ds.iddocumento      
                INNER JOIN mod_logistica.dat_documentopadre ppo on ppo.iddocumento = ds.iddocumento        
                INNER JOIN mod_logistica.dat_producto p ON (m.idproducto = p.idproducto)  
                 WHERE i.idindicador = p.idindicador AND ppo.idpadre ={$params['idordenproduccion']}
                 AND np.abreviatura = 'valeLog' AND d.estado = 4),0) - COALESCE((SELECT COALESCE(sum(m.cantidad),0) 
                FROM mod_logistica.dat_movimiento m 
                INNER JOIN mod_logistica.dat_documento dvd on dvd.iddocumento = m.iddocumento
               INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dvd.iddoc
                INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
                 INNER JOIN mod_logistica.dat_documentopadre ppvd on ppvd.iddocumento = dvd.iddocumento    
                INNER JOIN mod_logistica.dat_documento dds on ppvd.idpadre = dds.iddocumento
                INNER JOIN mod_logistica.dat_documentopadre ppds on ppds.iddocumento = dds.iddocumento    
                INNER JOIN mod_logistica.dat_documento dso on ppds.idpadre = dso.iddocumento            
                 INNER JOIN mod_logistica.dat_documentopadre ppso on ppso.iddocumento = dso.iddocumento                 
                 INNER JOIN mod_logistica.dat_producto p ON (m.idproducto = p.idproducto)  
                WHERE i.idindicador = p.idindicador AND ppso.idpadre = {$params['idordenproduccion']}
                 AND np.abreviatura = 'valedev' AND dvd.estado = 4),0) AS entregada,
                 COALESCE((SELECT {$aliasProducto}.idproducto FROM mod_logistica.dat_producto {$aliasProducto} WHERE {$aliasProducto}.idindicador = i.idindicador
        AND {$aliasProducto}.idestructuracomun = {$this->global->Estructura->idestructura} $subquery LIMIT 1),0) AS idproducto
         FROM /*mod_logproduccion.dat_ordenproductosust ops
         INNER JOIN */ mod_datosmaestros.nom_indicador i --ON (i.idindicador = ops.idindicador)
         LEFT JOIN mod_datosmaestros.nom_unidadmedida um ON (i.idumedida = um.idunidadmedida)
         Left JOIN mod_planificacion.dat_norma n ON n.idindicador = i.idindicador
         Left JOIN mod_planifindustrial.dat_cartatecindustrial cti on cti.idindicadorsalida = n.idindicador
        -- WHERE ops.idordenproduccion =  {$params['idordenproduccion']}   
          GROUP BY --ops.idindicador,
          i.numeropieza,
         i.codigo,
          i.denominacion,
          i.idumedida,
          um.abreviaturaunidadmedida,
          --ops.norma,
          --ops.idordenproductosust,
          i.idindicador,
          cti.cantidad
          */";
        //print_r($query); die;
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
     
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function obtenerMateriales($params)
    {
        $conn = Doctrine_Manager::connection();
        $addWhere = $addSelect = $addHaving = $addGROUP = "";
        if($params['idalmacenorigen']){
            $addWhere = " AND om.idindicador IN(SELECT p.idindicador FROM mod_logistica.dat_producto p WHERE p.idestructura = {$params['idalmacenorigen']})";//" AND p.idestructura = {$params['idalmacenorigen']}";
        }
        if($params['solEntrega']){
            $addHaving .= " HAVING (om.cantidad -
            (SELECT coalesce(sum(m.cantidad),0) FROM mod_logistica.dat_movimiento m 
            INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
            INNER JOIN mod_logistica.dat_documentopadre pp on pp.iddocumento = m.iddocumento
            INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc
            INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
            INNER JOIN mod_logistica.dat_producto p ON m.idproducto = p.idproducto
            WHERE om.idindicador = p.idindicador AND pp.idpadre = om.idordenproduccion
            AND np.abreviatura = 'solEntrega')) > 0";
            $addSelect = ",(om.cantidad -
            (SELECT coalesce(sum(m.cantidad),0) FROM mod_logistica.dat_movimiento m 
            INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
            INNER JOIN mod_logistica.dat_documentopadre pp on pp.iddocumento = m.iddocumento
            INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc
            INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
            INNER JOIN mod_logistica.dat_producto p ON m.idproducto = p.idproducto
            WHERE om.idindicador = p.idindicador AND pp.idpadre = om.idordenproduccion 
            AND np.abreviatura = 'solEntrega')) as cantidad,
            (SELECT p.idproducto FROM mod_logistica.dat_producto p WHERE p.idestructura = {$params['idalmacenorigen']} AND p.idindicador = om.idindicador ) as idproducto";
        } else{
            $addSelect = ",om.cantidad,om.idordenmateriales,
            om.idordenproduccion as iddocumento,
            om.idordenproduccion as idordenproduccion";
            $addGROUP = ',om.idordenmateriales';
        }
        $query = "SELECT DISTINCT om.idindicador
                    $addSelect
                    FROM mod_logproduccion.dat_ordenmateriales om
                    WHERE om.idordenproduccion = {$params['idordenproduccion']} $addWhere 
                    GROUP BY om.idindicador,om.cantidad,om.idordenproduccion $addGROUP
                    $addHaving";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if($params['solEntrega']){
            return $data;
        }
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }


    public function obtenerMaterialesActividad($params)
    {
        $conn = Doctrine_Manager::connection();
        $addWhere = $addSelect = $addHaving = "";
        if($params['idalmacenorigen']){
            $addWhere = " AND n.idindicador IN(SELECT p.idindicador FROM mod_logistica.dat_producto p WHERE p.idestructura = {$params['idalmacenorigen']})";//" AND p.idestructura = {$params['idalmacenorigen']}";
        }

        if($params['solEntrega']){
            $addHaving .= " HAVING ((round(((COALESCE(sum(n.necesidad), 0) * (SELECT cantidad FROM mod_logproduccion.dat_ordenproduccion
            WHERE idordenproduccion = {$params['idordenproduccion']}))), 6) -   
            (SELECT coalesce(sum(m.cantidad),0) FROM mod_logistica.dat_movimiento m 
            INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
            INNER JOIN mod_logistica.dat_documentopadre pp on pp.iddocumento = m.iddocumento
            INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc
            INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
            INNER JOIN mod_logistica.dat_producto p ON m.idproducto = p.idproducto
            WHERE n.idindicador = p.idindicador AND pp.idpadre = {$params['idordenproduccion']}
            AND np.abreviatura = 'solEntrega'))) > 0";
        } else {
            $addSelect = ",(round(((COALESCE(sum(n.necesidad), 0) * ( SELECT cantidad FROM mod_logproduccion.dat_ordenproduccion
            WHERE idordenproduccion = {$params['idordenproduccion']}))), 6) as cantidad, n.idactividad,
            n.idnorma as iddocumento,
            n.idnorma as idnorma";
            $addGROUP = ',n.idnorma';
        }
        
        $addSelect = ",(round(((COALESCE(sum(n.necesidad), 0) * ( SELECT cantidad FROM mod_logproduccion.dat_ordenproduccion
        WHERE idordenproduccion = {$params['idordenproduccion']}))), 6) -
        (SELECT coalesce(sum(m.cantidad),0) FROM mod_logistica.dat_movimiento m 
        INNER JOIN mod_logistica.dat_documento d on d.iddocumento = m.iddocumento
        INNER JOIN mod_logistica.dat_documentopadre pp on pp.iddocumento = m.iddocumento
        INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = d.iddoc
        INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
        INNER JOIN mod_logistica.dat_producto p ON m.idproducto = p.idproducto
        WHERE n.idindicador = p.idindicador AND pp.idpadre = {$params['idordenproduccion']}
        AND np.abreviatura = 'solEntrega')) as cantidad,
        (SELECT p.idproducto FROM mod_logistica.dat_producto p WHERE p.idestructura = {$params['idalmacenorigen']} AND p.idindicador = n.idindicador ) as idproducto";

     
            $query="SELECT DISTINCT n.idindicador
                    $addSelect
                    FROM mod_planificacion.dat_norma n
                    INNER JOIN mod_datosmaestros.nom_indicador i ON n.idindicador = i.idindicador --AND (n.idactividad = )
                    INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON i.idindicador = ip.idindicador
                    LEFT JOIN mod_datosmaestros.nom_unidadmedida nu on nu.idunidadmedida = i.idumedida
                    LEFT JOIN mod_planificacion.nom_actividad a ON a.idactividad = n.idactividad
                         LEFT JOIN mod_planifindustrial.dat_cartatecindustrialactividad ctia ON ctia.idactividad = a.idactividad
                         LEFT JOIN mod_planifindustrial.dat_cartatecindustrial cti ON cti.idcartatecindustrial = ctia.idcartatecindustrial
                    WHERE n.idejercicio = 1 and n.idactividad = {$params['idactividad']}
                    GROUP BY n.idindicador, n.necesidad, i.idindicador
                    $addHaving";

        if($params['solEntrega']){
            return $data;
        }
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }


    public function cargarMaterialesPorCarta($params)
    {
        $query = $this->maestroProductos->getQueryIndicador('i');
        $this->configuracionHelper->getQueryJoinUnidadMedida(
            $query, 'i', 'umedida', 'umedida.abreviaturaunidadmedida as umedida', 'leftJoin'
        );
        $this->planificacionService->obtenerIndicadorSalidaxCarta('dop', $query);
        return array(
            'cantidad' => $query->count(),
            'datos' => $this->doctrineHelper->addQueryLimits($query, $params)->fetchArray()
        );
    }

    public function eliminarMateriales($params)
    {
        try {
            $query = Doctrine_Query::create()->delete("DatOrdenMateriaPrima mo");
            if (is_array($params['data'])) {
                $query->whereIn('mo.idmaterialesproduccion', $params['data']);
            } else {
                $query->where('mo.idmaterialesproduccion =?', $params['data']);
            }
            $query->execute();
            return array(
                'success' => true,
                'message' => "Removed to record"
            );
        } catch (Exception $e) {
            return array(
                'success' => false,
                'message' => "Failed removed to record"
            );
        }

    }

    public function adicionarMaquinaria($params)
    {
        if ($params['data']) {
            $colletions = new Doctrine_Collection('DatOrdenEquipo');
            foreach ($params['data'] as $maquinaria) {
                if($maquinaria['idmaquinaria']){
                    $mq = Doctrine::getTable('DatOrdenEquipo')
                        ->find($maquinaria['idmaquinaria']);
                } else {
                    $mq = new DatOrdenEquipo();
                }
                $mq->synchronizeWithArray($maquinaria);

                $colletions->add($mq);
            }
            try {
                $colletions->save();
                return array(
                    'success' => true,
                    'message' => "Created new record"
                );
            } catch (Exception $e) {
                return array(
                    'success' => false,
                    'message' => "Failed to create record"
                );
            }
        } else {
            return array(
                'success' => false,
                'message' => "Failed is empty"
            );
        }
    }

    public function cargarMaquinaria($params)
    {
        $start = 0;
        $limit = 20;
        if ($params['start'] >= 0 && $params['limit'] >= 0) {
            $start = $params['start'];
            $limit = $params['limit'];
        }
        if (empty($params['idordenproduccion'])) {
            $params['idordenproduccion'] = 0;
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT 
                  i.codigo,
                  i.denominacion,
                  rna.nroinventario,
                  rn.idregnumerico,
                  (CASE WHEN (rna.idestadoperacion IN (0,7,6) OR dp.idestructura <> $this->idestructuracomun) THEN 'rojo' ELSE 'verde' END) as color,
                  COALESCE(sum(dve.unidadesproducidas), 0) as unidadesproducidas,
                 COALESCE(sum(dve.horastrabajo), 0) as horastrabajo
                FROM mod_logactivofijotangible.dat_registronumerico rn
                INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
                INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = rn.idproducto
                INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
                INNER JOIN mod_logproduccion.conf_equipos cfgeq on rn.idregnumerico = cfgeq.idregnumerico
                LEFT JOIN (
                      SELECT
                        ve.idregnumerico,
                        ve.unidadesproducidas,
                        ve.horastrabajo
                      FROM mod_logproduccion.dat_valeequipos ve
                      INNER JOIN mod_logproduccion.dat_valeproduccion vp ON ve.idvaleproduccion = vp.idvaleproduccion
                      WHERE vp.idordenproduccion = {$params['idordenproduccion']} 
                ) dve  ON rna.idregnumerico = dve.idregnumerico
                GROUP BY i.codigo,
                  i.denominacion,
                  rna.nroinventario,
                  rn.idregnumerico,
                  rna.idestadoperacion,
                  dp.idestructura
        ";

        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function eliminarMaquinaria($params)
    {
        try {
            $query = Doctrine_Query::create()->delete("DatMaquinaria mq");
            if (is_array($params['data'])) {
                $query->whereIn('mq.idmaquinaria', $params['data']);
            } else {
                $query->where('mq.idmaquinaria =?', $params['data']);
            }
            $query->execute();
            return array(
                'success' => true,
                'message' => "Removed to record"
            );
        } catch (Exception $e) {
            return array(
                'success' => false,
                'message' => "Failed removed to record"
            );
        }
    }

    public function adicionarGasto($params)
    {
        try {
                $params['precio'] = $params['precio'] ? $params['precio'] : 0;
                if ($params['idtipogasto'] && $params['idordenproduccion']){
                    $existe = Doctrine::getTable('DatGasto')
                        ->findByDql('idtipogasto = ? and idordenproduccion = ?', array($params['idtipogasto'], $params['idordenproduccion']));
                }
                if (count($existe) == 0) {
                    $gt = new DatGasto();
                    $gt->idordenproduccion = $params['idordenproduccion'];
                    $gt->idtipogasto = $params['idtipogasto'];
                    $gt->valor = $params['valor'];
                    $gt->precio = $params['precio'];
                } else {
                    return array(
                        'success' => false,
                        'message' => "El gasto que desea adicionar ya existe."
                    );
                }
                $gt->save();
        } catch (Exception $e) {
            return array(
                'success' => false,
                'details' => $e->getMessage(),
                'message' => "Failed to create record"
            );
        }
    } 
    public function cargarGasto($params)
    {
        if (empty($params['idordenproduccion'])) {
            $params['idordenproduccion'] = 0;
        }
        $conn = Doctrine_Manager::connection();
                $queryAct = " SELECT DISTINCT ctiact.idactividad as idactividad
                FROM mod_planifindustrial.dat_cartatecindustrialactividad ctiact
                     INNER JOIN mod_planificacion.nom_actividad act ON (act.idactividad = ctiact.idactividad)
                     LEFT JOIN mod_logproduccion.conf_actividadcentrocosto cacc ON cacc.idcartatecindustrialactividad =
                       ctiact.idcartatecindustrialactividad
                     LEFT JOIN mod_estructuracomp.dat_estructuraop op on op.idestructuraop = cacc.idalmacen
                     LEFT JOIN mod_logistica.dat_documentopadre ddp on ddp.idpadre = act.idpadre
                     LEFT JOIN mod_logistica.dat_documento dd on dd.iddocumento = ddp.iddocumento
                WHERE ctiact.idcartatecindustrial = {$params['idcartatecindustrial']}";

                $query= "SELECT DISTINCT m.idgasto,
                m.idordenproduccion,
                m.idtipogasto,
                ni.precio,
                (Case
                 When (m.idordenproduccion = {$params['idordenproduccion']}) Then m.valor
                 Else null
                 end) as valor,
                sum(COALESCE((Case
                    When (m.idordenproduccion = {$params['idordenproduccion']}) Then m.valor
                    Else 0
                    end),0) * m.precio) as saldo,
                ums.denominacionunidadmedida,
                ni.tipo,
                dn.idnorma,
                ni.denominacion as denominacion,
                ums.abreviaturaunidadmedida as um
         FROM mod_planificacion.dat_norma dn
              Left JOIN mod_logproduccion.dat_gasto m on dn.idnorma = m.idnorma AND m.idordenproduccion = {$params['idordenproduccion']}
              LEFT JOIN mod_logproduccion.dat_ordenproduccion op on op.idordenproduccion = m.idordenproduccion AND op.idordenproduccion = {$params['idordenproduccion']}
              Left Join mod_datosmaestros.nom_indicador ni on ni.idindicador = dn.idindicador
              LEFT JOIN mod_datosmaestros.nom_unidadmedida ums ON ums.idunidadmedida = ni.idumedida
              LEFT JOIN mod_planificacion.nom_actividad na on na.idactividad = dn.idactividad
         WHERE ni.tipo = 2 and
               dn.idactividad IN ($queryAct) 
               GROUP BY ni.denominacion,
                        ni.precio,
                        ni.tipo,
                        ums.abreviaturaunidadmedida,
                        ums.denominacionunidadmedida,
                        m.idordenproduccion,
                        dn.necesidad,
                        dn.idnorma,
                        m.valor,
                        m.idtipogasto,
                        m.idgasto
            union
            SELECT DISTINCT m.idgasto,
               m.idordenproduccion,
               m.idtipogasto,
                sum(m.precio),
              sum(m.valor) as valor,
            --    (Case
            --      When (m.idordenproduccion = {$params['idordenproduccion']}) Then m.valor
            --     Else null
            --     end) as valor,
                sum(m.valor * m.precio) as saldo,
                nm.denominacionunidadmedida,
                0,
                0,
                tc.denominacion as denominacion,
                nm.abreviaturaunidadmedida as um
            FROM mod_logproduccion.nom_tipocontrolcalidad tc
                INNER JOIN mod_logproduccion.dat_gasto m ON m.idtipogasto = tc.idtipocontrolcalidad
                LEFT JOIN mod_datosmaestros.nom_unidadmedida nm ON nm.idunidadmedida = tc.idunidadmedida
                LEFT JOIN mod_logproduccion.dat_ordenproduccion op on op.idordenproduccion = m.idordenproduccion
            WHERE m.idordenproduccion = {$params['iddocumento']}
            GROUP BY nm.denominacionunidadmedida,
                    tc.denominacion,
                    nm.abreviaturaunidadmedida,
                    m.idordenproduccion,
                    m.valor,
                    m.idtipogasto,
                    m.idgasto";
           
                    
       
       // print_r($query);die;
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function eliminarGasto($params)
    {
        $query = Doctrine_Query::create()->delete("DatGasto gt");
        if (is_array($params['id'])) {
            $query->whereIn('gt.idgasto', $params['id']);
        } else {
            $query->where('gt.idgasto =?', $params['id']);
        }
        try {
            $query->execute();
            return array(
                'success' => true,
                'message' => "Removed to record"
            );
        } catch (Exception $e) {
            return array(
                'success' => false,
                'message' => "Failed removed to record"
            );
        }
    }

    public function eliminarOperario($params)
    {
        $query = Doctrine_Query::create()->delete("DatOperarioActividad oa");
        if (is_array($params['id'])) {
            $query->whereIn('oa.idresponsable', $params['id']);
        } else {
            $query->where('oa.idresponsable =?', $params['id']);
        }
        try {
            $query->execute();
            return array(
                'success' => true,
                'message' => "Removed to record"
            );
        } catch (Exception $e) {
            return array(
                'success' => false,
                'message' => "Failed removed to record"
            );
        }
    }

    public function convertirFecha($fecha){
        $arrayFecha = explode('/', $fecha);
        return "{$arrayFecha[2]}-{$arrayFecha[1]}-{$arrayFecha[0]}";
    }

    public function adicionarSolicitudEntrega($params)
    {
        $fechaOP = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            $this->idSubsistema)->fecha;
        $fechaInv = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura,
            10)->fecha;

        $fechaOrdenProd = $this->convertirFecha($fechaOP);
        $fechaInvent = $this->convertirFecha($fechaInv);
       
        if($fechaOrdenProd > $fechaInvent){
            //print_r($fechaOrdenProd);die;
            throw new LogisticaException('LOG_LB_PRO_002');
        }
        
        $ordProd = Doctrine::getTable('DatOrdenProduccion')->find($params['idordenproduccion']);
        $params['solEntrega'] = true;
        $params['descripcliente'] =  $params['idalmacenorigen']; //$ordProd->idcentrogrupo;
        
        if (!$params['actividades']) {
            $params['idproductos'] = ($params['idactividad']) ? $this->obtenerMaterialesActividad($params) : $this->obtenerMateriales($params);
        }
        $params['estado'] = 2;
        $fecha = $this->configuracionHelper->getFechaContableSubsistemaObj($this->global->Estructura->idestructura, 10);//1o es Inventario y $this->idSubsistema es de produccion
        $params['fechaexterna'] = ($fecha->fecha) ? $fecha->fecha : date('d/m/Y');
        if(count($params['idproductos']) > 0){            
            $solEntregaServ = new SolicitudentregaService();
            $datSolEntrega = $solEntregaServ->adicionarDocumento($params);
            return $datSolEntrega;    
        }else{
            throw new LogisticaException('LOG_LB_PRO_001');
        }
    }

    public function cancelarDocumento($iddocumento, $flag = false)
    {
        $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
        $this->trazaDocumento->guardarTraza('Documento cancelado', $iddocumento, EstadoDocumentoModel::ESTADO_CANCELADO);
        $idCancelado = $this->copiarDocumento($iddocumento, true, true);
        $this->estadoModel->setEstadoDocumento($iddocumento, EstadoDocumentoModel::ESTADO_CANCELADO);
        if (is_array($idCancelado)) {
            $idCancelado = $idCancelado['iddocumento'];
        }
        if (is_null($doc->idcomprobante) || $doc->idcomprobante == -1) {
            $doc->idcomprobante = -1;
        } else {
            $doc->idcomprobante = null;
        }
        $doc->idusuario = $this->idusuario;
        $doc->save();
        return array('cronologia' => $this->establecerCronologia($idCancelado), 'iddocumento' => $idCancelado);
    }

    public function validarDocGeneradoRecepcion($iddocumento)
    {
        $valeproduccion =  Doctrine_Query::create()->select('dvp.idvaleproduccion')
             ->from ('DatValeProduccion dvp')
             ->innerJoin('dvp.DatDocumento d on d.iddocumento = dvp.idvaleproduccion')
             ->leftJoin('d.DatDocumentoPadre dpp on dpp.idpadre = d.iddocumento')
             ->leftJoin('dpp.DatDocumento dd on dd.iddocumento = dpp.iddocumento')
             ->whereIn('dvp.idordenproduccion', $iddocumento)
                ->count() == 0;

        $valeentrega =  Doctrine_Query::create()->select('dop.idordenproduccion')
                ->from ('DatOrdenProduccion dop')
                ->innerJoin('dop.DatDocumento d on d.iddocumento = dop.idordenproduccion')
                ->leftJoin('d.DatDocumentoPadre dpp on dpp.idpadre = d.iddocumento')
                ->leftJoin('dpp.DatDocumento dd on dd.iddocumento = dpp.iddocumento')
                ->leftJoin('dd.DatDocumentoPadre ddp on ddp.idpadre = dd.iddocumento')
                ->leftJoin('ddp.DatDocumento ddd on ddd.iddocumento = ddp.iddocumento')
                ->whereIn('dop.idordenproduccion', $iddocumento)
                 ->addWhere('dd.idestructuracomun = ?', array($this->global->Estructura->idestructura))
                 ->count() == 0;
        return ($valeproduccion && $valeentrega);
    }

    public function validarEliminarVale($iddocumento)
    {
        return Doctrine_Query::create()->select('dvp.idvaleproduccion')
             ->from ('DatValeProduccion dvp')
             ->innerJoin('dvp.DatDocumento d on d.iddocumento = dvp.idvaleproduccion')
             ->leftJoin('d.DatDocumentoPadre dpp on dpp.idpadre = d.iddocumento')
             ->leftJoin('dpp.DatDocumento dd on dd.iddocumento = dpp.iddocumento')
             ->whereIn('dvp.idordenproduccion', $iddocumento)
                ->count() == 0;
              
    }



    /**
     * Método para devolver los documentos generados por una orden de produccion
     *
     * @params array $datosDoc Arreglo con los parametros para filtrar los documentos
     *
     * @return array
     */
    public function devolverDocumentosGenerados($datosDoc = array(), $dql = false, $doc = 'd')
    {
        $conn = Doctrine_Manager::connection();

        $iddocumento = $datosDoc['idpadre'] ? $datosDoc['idpadre'] : $datosDoc['iddocumento'];

        $addWhere  = $whereEntrega = "";
        $innerProducion = $innerEntrega = $innerDevolucion = $innerRecepcion = "";
        if ($datosDoc['criterio']){
            $addWhere = " AND {$doc}.nrodoc = {$datosDoc['criterio']}";
        }

        if ($datosDoc['valeentrega']) {
            $select = " {$doc}.iddocumento AS iddocumento, {$doc}.nrodoc AS nrodoc, {$doc}.numeroref AS numeroref, {$doc}.fechacontable AS fechacontable, {$doc}.idestructuracomun AS idestructuracomun,
               m8.denominacion AS tipodocumento, {$doc}.estado AS estado, m9.denominacion AS deposito";
            $innerEntrega = "INNER JOIN mod_logistica.dat_documento m2 ON (m2.iddocumento = m.idordenproduccion)
             INNER JOIN mod_logistica.dat_documentopadre m3 ON (m3.idpadre = m2.iddocumento)
             INNER JOIN mod_logistica.dat_documento m4 ON (m4.iddocumento = m3.iddocumento)
             INNER JOIN mod_logistica.dat_documentopadre m5 ON (m5.idpadre = m4.iddocumento)
             INNER JOIN mod_logistica.dat_documento {$doc} ON ({$doc}.iddocumento = m5.iddocumento)";
             $where = " AND {$doc}.estado in (4)";
        } else if ($datosDoc['recepcion']) {
            $select = "dr.iddocumento AS iddocumento, {$doc}.nrodoc AS nrodoc, {$doc}.numeroref AS numeroref, {$doc}.fechacontable AS fechacontable, {$doc}.idestructuracomun AS idestructuracomun,
               m8.denominacion AS tipodocumento, {$doc}.estado AS estado, m9.denominacion AS deposito";
            $innerRecepcion = "INNER JOIN mod_logproduccion.dat_valeproduccion vp ON (vp.idordenproduccion = m.idordenproduccion)
             INNER JOIN mod_logistica.dat_documento doc ON (doc.iddocumento = vp.idvaleproduccion)
             INNER JOIN mod_logistica.dat_documentopadre ddp ON (ddp.idpadre = doc.iddocumento)
             LEFT JOIN mod_logistica.dat_documento {$doc} ON ({$doc}.iddocumento = ddp.iddocumento)
             LEFT JOIN mod_loginventario.dat_recepcion dr ON (dr.iddocumento = {$doc}.iddocumento)";
            $where = " AND {$doc}.estado in (1, 2, 3, 4)";
        } else if ($datosDoc['valedevolucion']) {
            $select = " {$doc}.iddocumento AS iddocumento, m.idordenproduccion as idordenproduccion, {$doc}.nrodoc AS nrodoc, {$doc}.numeroref AS numeroref, {$doc}.fechacontable AS fechacontable, {$doc}.idestructuracomun AS idestructuracomun,
               m8.denominacion AS tipodocumento, {$doc}.estado AS estado, m6.nrodoc AS nrovaleent, m9.denominacion AS deposito";
            $innerDevolucion = "INNER JOIN mod_logistica.dat_documento m2 ON (m2.iddocumento = m.idordenproduccion)
             INNER JOIN mod_logistica.dat_documentopadre m3 ON (m3.idpadre = m2.iddocumento)
             INNER JOIN mod_logistica.dat_documento m4 ON (m4.iddocumento = m3.iddocumento)
             INNER JOIN mod_logistica.dat_documentopadre m5 ON (m5.idpadre = m4.iddocumento)
             INNER JOIN mod_logistica.dat_documento m6 ON (m6.iddocumento = m5.iddocumento)
             INNER JOIN mod_logistica.dat_documentopadre ddp ON (ddp.idpadre = m6.iddocumento)
             INNER JOIN mod_logistica.dat_documento {$doc} ON ({$doc}.iddocumento = ddp.iddocumento)";
             $where = " AND {$doc}.estado in (4)";
        } else {
            $select = "vp.idvaleproduccion AS iddocumento, {$doc}.nrodoc AS nrodoc, {$doc}.numeroref AS numeroref, {$doc}.fechacontable AS fechacontable, {$doc}.idestructuracomun AS idestructuracomun,
               m8.denominacion AS tipodocumento, {$doc}.estado AS estado, m9.denominacion AS deposito";
            $innerProducion = "LEFT JOIN mod_logproduccion.dat_valeproduccion vp ON (vp.idordenproduccion = m.idordenproduccion)
             LEFT JOIN mod_logistica.dat_documento {$doc} ON ({$doc}.iddocumento = vp.idvaleproduccion)
             LEFT JOIN mod_logistica.dat_documentopadre ddp ON (ddp.idpadre = {$doc}.iddocumento)
             LEFT JOIN mod_logistica.dat_documento doc ON (doc.iddocumento = ddp.iddocumento)";
             $where = " AND {$doc}.estado in (3)";
        }

        $query = " SELECT distinct $select
        FROM mod_logproduccion.dat_ordenproduccion m
             $innerEntrega
             $innerProducion
             $innerDevolucion
             $innerRecepcion
             LEFT JOIN mod_datosmaestros.dat_documentoprim m7 ON (m7.iddoc = {$doc}.iddoc)
             LEFT JOIN mod_datosmaestros.nom_docprim m8 ON (m8.iddocumentos = m7.iddocumentos)
             LEFT JOIN mod_estructuracomp.dat_estructuraop m9 ON (m9.idestructuraop = {$doc}.idestructuracomun) 
             
        WHERE (m.idordenproduccion = {$iddocumento} $where $addWhere)";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        if ($datosDoc['limit']) {
            $query .= " offset {$datosDoc['start']} limit {$datosDoc['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function cargarProductosEjecucion($params)
    {
        $filtro = "";
        if ($params['criterio']) {
            if (is_numeric($params['criterio'])) {
                $filtro = "AND i.codigo ilike '%{$params['criterio']}%'";
            } else {
                $filtro = "AND i.denominacion ilike '%{$params['criterio']}%'";
            }
        }

        $innerEntrega = $innerProduccion = "";
        if ($params['valeproduccion']) {
            $innerProduccion = "mod_logproduccion.dat_valeproduccion tp
            INNER JOIN mod_logproduccion.dat_ordenproduccion op on op.idordenproduccion = tp.idordenproduccion
            LEFT JOIN mod_logproduccion.dat_valeproductos p on tp.idvaleproduccion = p.idvaleproduccion
            LEFT JOIN mod_datosmaestros.nom_indicador i on i.idindicador = p.idindicador
            LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida         
            WHERE tp.idvaleproduccion = {$params['iddocumento']}";
        } else {
            $innerEntrega = "mod_logistica.dat_documento doc 
            LEFT JOIN mod_logistica.dat_movimiento tp ON tp.iddocumento = doc.iddocumento
            LEFT JOIN mod_logistica.dat_producto dp ON dp.idproducto = tp.idproducto
            LEFT JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador 
            LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
            where doc.iddocumento = {$params['iddocumento']}";
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT i.numeropieza as codigoproveedor, i.codigo as codigo, i.denominacion as text, tp.cantidad, i.idumedida, 
                um.abreviaturaunidadmedida as umedida, i.idindicador
                FROM $innerProduccion $innerEntrega $filtro";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return array(
            'datos' => $datas,
            'cantidad' => count($data)
        );
    }

    public function cargaractividades($params){
        if ($params['idcartatecindustrial']) {
            $sql = "SELECT DISTINCT
            ctiact.idcartatecindustrialactividad as idcartatecindustrialactividad,
            act.denominacion as denominacion,
            op.denominacion as area,
            cacc.idcentrogrupo as idcentrocosto,
            cacc.idcartatecindustrial as idcartatecindustrial,
            ctiact.idactividad as idactividad 
          FROM 
            mod_planifindustrial.dat_cartatecindustrialactividad ctiact
            INNER JOIN mod_planificacion.nom_actividad act ON (act.idactividad = ctiact.idactividad)  
            LEFT JOIN mod_logproduccion.conf_actividadcentrocosto cacc ON cacc.idcartatecindustrialactividad = ctiact.idcartatecindustrialactividad AND cacc.identidad = {$this->global->Estructura->idestructura}
            LEFT JOIN mod_estructuracomp.dat_estructuraop op on op.idestructuraop = cacc.idalmacen
            LEFT JOIN mod_logistica.dat_documentopadre ddp on ddp.idpadre = act.idpadre
            LEFT JOIN mod_logistica.dat_documento dd on dd.iddocumento = ddp.iddocumento
            WHERE ctiact.idcartatecindustrial = {$params['idcartatecindustrial']} 
            Order by  ctiact.idcartatecindustrialactividad desc ";

            $conn = Zend_Registry::get('conexion');
            $data->datos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
         }

        foreach ($data->datos as &$act) {
             $centro = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
             $this->global->Estructura->idestructura, $params['start'], $params['limit'], null, array($act['idcentrocosto']));
             $act['centrocosto'] = $centro[0]->descripcioncentrogrupo;
         }

        
        return $data;
       
    }
    public function cargarMateriaPrima($params, $aliasProducto = 'dprod'){
        $query = " ";
        $condactividad = " ";
        $subquery = " ";
        $filtroquery = " ";
        $idactividad = 0;
        $idactividades = array();
        foreach($params['arrayActividad'] as $p) {
            $idactividades[] = $p;
        }
        if (count($idactividades) > 1) {
             $idactividad = implode(',', $idactividades);
        }  
        else{
            if ($idactividades[0]) {
                $idactividad = $idactividades[0];
                $condactividad = " AND ctia.idactividad IN ({$idactividad})";
            }          
        }
        if ($params['idalmacenorigen']) {
            $filtroVale = 1;
            $subquery = "AND {$aliasProducto}.idestructura = {$params['idalmacenorigen']}";
        } else {
            $filtroVale = 0;
        }
        //print_r($params);die;
        /*if($params['desviacion']) {
            $filtroquery = "AND ";
        }*/

        if($params['arrayActividad']>0){
           $query = "select * from ( WITH valeLog AS (
            SELECT sum(dm.cantidad) as cantidad,
                           d.iddocumento,
                           {$aliasProducto}.idindicador,
                           {$aliasProducto}.idproducto,
                           {$aliasProducto}.cantidad as existencia
                    FROM mod_logistica.dat_documento d
                         LEFT JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = d.iddocumento
                         LEFT JOIN mod_logistica.dat_documento dd ON dd.iddocumento = ddp.iddocumento
                         LEFT JOIN mod_logistica.dat_documentopadre ddpp ON ddpp.idpadre = dd.iddocumento
                         LEFT JOIN mod_logistica.dat_documento ddd ON ddd.iddocumento = ddpp.iddocumento
                         LEFT JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = ddd.iddocumento
                         LEFT JOIN mod_logistica.dat_producto {$aliasProducto} ON {$aliasProducto}.idproducto = dm.idproducto
                         LEFT JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = ddd.iddoc
                    WHERE ddd.estado = 4 AND
                          dp.sigla LIKE '%valeLog%' AND
                          d.iddocumento = {$params['idordenproduccion']}
                    GROUP BY d.iddocumento,
                             {$aliasProducto}.idindicador,
                             {$aliasProducto}.idproducto,
                             {$aliasProducto}.cantidad),
            valeDev AS (SELECT COALESCE(sum(m.cantidad), 0) as cantidad,
                               {$aliasProducto}.idindicador,
                               ppso.idpadre as iddocumento
                        FROM mod_logistica.dat_movimiento m
                             INNER JOIN mod_logistica.dat_documento dvd on dvd.iddocumento = m.iddocumento
                             INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dvd.iddoc
                             INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
                             INNER JOIN mod_logistica.dat_documentopadre ppvd on ppvd.iddocumento = dvd.iddocumento
                             INNER JOIN mod_logistica.dat_documento dds on ppvd.idpadre = dds.iddocumento
                             INNER JOIN mod_logistica.dat_documentopadre ppds on ppds.iddocumento = dds.iddocumento
                             INNER JOIN mod_logistica.dat_documento dso on ppds.idpadre = dso.iddocumento
                             INNER JOIN mod_logistica.dat_documentopadre ppso on ppso.iddocumento = dso.iddocumento
                             INNER JOIN mod_logistica.dat_producto {$aliasProducto} ON (m.idproducto = {$aliasProducto}.idproducto)
                        WHERE ppso.idpadre = {$params['idordenproduccion']} AND
                              np.abreviatura = 'valedev' AND
                              dvd.estado = 4
                        GROUP BY {$aliasProducto}.idindicador,
                                 ppso.idpadre)
           
           SELECT DISTINCT 0 as idordenproductosust, (CASE
                              WHEN i.numeropieza IS NULL OR LENGTH(i.numeropieza) = 0 THEN i.codigo
                              ELSE i.numeropieza
                            END) AS codigo,
                  i.denominacion,
                  i.numeropieza,
                  i.idumedida,
                  i.idindicador,
                  nu.abreviaturaunidadmedida AS um,
                  dom.idordenmateriales,
                  n.necesidad AS norma,
                  (round(((COALESCE(n.necesidad, 0) * op.cantidad)), 6)) AS cantidad,
                  (CASE
                     WHEN dom.cantidadsolicitada IS NULL THEN (n.necesidad) * op.cantidad
                     ELSE dom.cantidadsolicitada
                   END) AS cantidadsolicitada,
                  -----------------------------
                  (CASE
                     WHEN vd.cantidad > 0 THEN ((CASE
                                                   WHEN vl.cantidad IS NULL THEN (round(((COALESCE(n.necesidad, 0) * op.cantidad)), 6))
                                                   ELSE (Case
                                                           WHEN ((round(((COALESCE(n.necesidad, 0) * op.cantidad)), 6)) - vl.cantidad) < 0 Then 0
                                                           else ((round(((COALESCE(n.necesidad, 0) * op.cantidad)), 6)) - vl.cantidad)
                                                         END)
                                                 END) + vd.cantidad)
                     ELSE (CASE
                             WHEN vl.cantidad IS NULL THEN (round(((COALESCE(n.necesidad, 0) * op.cantidad)), 6))
                             ELSE (Case
                                     WHEN ((round(((COALESCE(n.necesidad, 0) * op.cantidad)), 6)) - vl.cantidad) < 0 Then 0
                                     else ((round(((COALESCE(n.necesidad, 0) * op.cantidad)), 6)) - vl.cantidad)
                                   END)
                           END)
                   END) as pendiente,
                   COALESCE((SELECT {$aliasProducto}.idproducto FROM mod_logistica.dat_producto {$aliasProducto} WHERE {$aliasProducto}.idindicador = i.idindicador
                AND {$aliasProducto}.idestructuracomun = {$this->global->Estructura->idestructura} $subquery LIMIT 1),0) AS idproducto,
                  --------------------
                  --COALESCE((vl.idproducto), 0) AS idproducto,
                 -- p.idproducto as idproducto,
                  COALESCE((vl.existencia), 0) AS existencia,
                  0 as disponible,
                 
             (CASE WHEN 0 = 1 THEN (SELECT string_agg('VE-' || ddd.nrodoc ,', ') FROM  mod_logistica.dat_documento d 
                LEFT JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = d.iddocumento
                LEFT JOIN mod_logistica.dat_documento dd ON dd.iddocumento = ddp.iddocumento 
                LEFT JOIN mod_logistica.dat_documentopadre ddpp ON ddpp.idpadre = dd.iddocumento
                LEFT JOIN mod_logistica.dat_documento ddd ON ddd.iddocumento = ddpp.iddocumento 
                LEFT JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = ddd.iddocumento
                LEFT JOIN mod_logistica.dat_producto {$aliasProducto} ON {$aliasProducto}.idproducto = dm.idproducto  
                LEFT JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = ddd.iddoc
                WHERE ddd.estado = 4 AND dp.sigla LIKE '%valeLog%' AND {$aliasProducto}.idindicador = i.idindicador
                AND d.iddocumento = {$params['idordenproduccion']} AND {$aliasProducto}.idestructuracomun = {$this->global->Estructura->idestructura} $subquery ) ELSE '-' END)  AS vale,
                (CASE WHEN $filtroVale = 1 THEN (SELECT string_agg('VD-' || dvd.nrodoc, ', ') FROM mod_logistica.dat_movimiento m 
                        INNER JOIN mod_logistica.dat_documento dvd on dvd.iddocumento = m.iddocumento
                        INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dvd.iddoc
                        INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
                        INNER JOIN mod_logistica.dat_documentopadre ppvd on ppvd.iddocumento = dvd.iddocumento    
                        INNER JOIN mod_logistica.dat_documento dds on ppvd.idpadre = dds.iddocumento
                        INNER JOIN mod_logistica.dat_documentopadre ppds on ppds.iddocumento = dds.iddocumento    
                        INNER JOIN mod_logistica.dat_documento dso on ppds.idpadre = dso.iddocumento            
                        INNER JOIN mod_logistica.dat_documentopadre ppso on ppso.iddocumento = dso.iddocumento                 
                        INNER JOIN mod_logistica.dat_producto {$aliasProducto} ON (m.idproducto = {$aliasProducto}.idproducto)  
                        WHERE i.idindicador = {$aliasProducto}.idindicador AND ppso.idpadre = {$params['idordenproduccion']}
                        AND np.abreviatura = 'valedev' AND dvd.estado = 4 AND {$aliasProducto}.idestructuracomun = {$this->global->Estructura->idestructura} $subquery ) ELSE '-' END) AS valedev,
                  -------------------------
                  (CASE
                     WHEN (vd.cantidad) > 0
                  THEN (vl.cantidad) -(vd.cantidad)
                 
                     ELSE (vl.cantidad)
                   END) as cantentregada,
                   ctia.idactividad,
                   (CASE WHEN ((CASE WHEN (vd.cantidad) > 0 THEN (vl.cantidad) - (vd.cantidad) ELSE (vl.cantidad) END) > (round(((COALESCE(n.necesidad, 0) * op.cantidad)), 6))) THEN 1 ELSE 0 END) as desviacion
           FROM mod_logproduccion.dat_ordenproduccion op
                INNER JOIN mod_planifindustrial.dat_cartatecindustrialactividad ctia ON ctia.idcartatecindustrial = op.idcartatecnologica
                INNER JOIN mod_planificacion.dat_norma n ON n.idactividad = ctia.idactividad AND n.idejercicio =
                (
                  SELECT idejercicio
                  FROM mod_planificacion.nom_ejercicioplanificacion
                  WHERE actual = 1
                )
                INNER JOIN mod_datosmaestros.nom_indicador i ON n.idindicador = i.idindicador
                INNER JOIN mod_logistica.dat_producto {$aliasProducto} ON dprod.idindicador = i.idindicador AND {$aliasProducto}.idestructuracomun = {$this->global->Estructura->idestructura}
                INNER JOIN mod_datosmaestros.nom_unidadmedida nu ON nu.idunidadmedida = i.idumedida
                LEFT JOIN valeLog vl ON vl.iddocumento = op.idordenproduccion AND vl.idindicador = i.idindicador
                LEFT JOIN valeDev vd ON vd.iddocumento = op.idordenproduccion AND vd.idindicador = i.idindicador
                LEFT JOIN mod_logproduccion.dat_ordenmateriales dom ON dom.idindicador = i.idindicador AND dom.idordenproduccion = op.idordenproduccion
                LEFT JOIN mod_logproduccion.dat_ordenproductosust ops on (ops.idordenproduccion = {$params['idordenproduccion']} and i.idindicador = ops.idindicador)
           WHERE op.idordenproduccion = {$params['idordenproduccion']} and ops is null
            $condactividad
           $filtroquery
            
           GROUP BY i.codigo,
                    i.denominacion,
                    i.numeropieza,
                    nu.denominacionunidadmedida,
                    i.idumedida,
                    n.idejercicio,
                    i.idindicador,
                    dom.idordenmateriales,
                    nu.abreviaturaunidadmedida,
                    n.necesidad,
                    op.cantidad,
                    vl.cantidad,
                    vl.existencia,
                    ctia.idactividad,
                    vd.cantidad
           ) a
           
           UNION
           select * from (
           WITH valeLog AS (
                    SELECT sum(dm.cantidad) as cantidad,
                           d.iddocumento,
                           dprod.idindicador,
                           {$aliasProducto}.idproducto,
                           {$aliasProducto}.cantidad as existencia
                    FROM mod_logistica.dat_documento d
                         LEFT JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = d.iddocumento
                         LEFT JOIN mod_logistica.dat_documento dd ON dd.iddocumento = ddp.iddocumento
                         LEFT JOIN mod_logistica.dat_documentopadre ddpp ON ddpp.idpadre = dd.iddocumento
                         LEFT JOIN mod_logistica.dat_documento ddd ON ddd.iddocumento = ddpp.iddocumento
                         LEFT JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = ddd.iddocumento
                         LEFT JOIN mod_logistica.dat_producto {$aliasProducto} ON {$aliasProducto}.idproducto = dm.idproducto
                         LEFT JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = ddd.iddoc
                    WHERE ddd.estado = 4 AND
                          dp.sigla LIKE '%valeLog%' AND
                          d.iddocumento = 1000190743
                    GROUP BY d.iddocumento,
                             {$aliasProducto}.idindicador,
                             {$aliasProducto}.idproducto,
                             {$aliasProducto}.cantidad),
            valeDev AS (SELECT COALESCE(sum(m.cantidad), 0) as cantidad,
                               {$aliasProducto}.idindicador,
                               ppso.idpadre as iddocumento
                        FROM mod_logistica.dat_movimiento m
                             INNER JOIN mod_logistica.dat_documento dvd on dvd.iddocumento = m.iddocumento
                             INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dvd.iddoc
                             INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
                             INNER JOIN mod_logistica.dat_documentopadre ppvd on ppvd.iddocumento = dvd.iddocumento
                             INNER JOIN mod_logistica.dat_documento dds on ppvd.idpadre = dds.iddocumento
                             INNER JOIN mod_logistica.dat_documentopadre ppds on ppds.iddocumento = dds.iddocumento
                             INNER JOIN mod_logistica.dat_documento dso on ppds.idpadre = dso.iddocumento
                             INNER JOIN mod_logistica.dat_documentopadre ppso on ppso.iddocumento = dso.iddocumento
                             INNER JOIN mod_logistica.dat_producto {$aliasProducto} ON (m.idproducto = {$aliasProducto}.idproducto)
                        WHERE ppso.idpadre = {$params['idordenproduccion']} AND
                              np.abreviatura = 'valedev' AND
                              dvd.estado = 4
                        GROUP BY {$aliasProducto}.idindicador,
                                 ppso.idpadre)
        
                  SELECT
                  ops.idordenproductosust,
                         COALESCE(i.numeropieza,i.codigo) as codigo,
                         i.denominacion,
                         i.numeropieza,
                         i.idumedida,
                         i.idindicador,
                       um.abreviaturaunidadmedida as um,
                       dom.idordenmateriales,
                       ops.norma AS norma,
                         (round(((COALESCE(ops.norma, 0) * op.cantidad)), 6)) AS cantidad,
                        (CASE
                            WHEN dom.cantidadsolicitada IS NULL THEN (ops.norma) * op.cantidad
                            ELSE dom.cantidadsolicitada
                        END) AS cantidadsolicitada,
        
                        (CASE
                     WHEN vd.cantidad > 0 THEN ((CASE
                                                   WHEN vl.cantidad IS NULL THEN (round(((COALESCE(ops.norma, 0) * op.cantidad)), 6))
                                                   ELSE (Case
                                                           WHEN ((round(((COALESCE(ops.norma, 0) * op.cantidad)), 6)) - vl.cantidad) < 0 Then 0
                                                           else ((round(((COALESCE(ops.norma, 0) * op.cantidad)), 6)) - vl.cantidad)
                                                         END)
                                                 END) + vd.cantidad)
                     ELSE (CASE
                             WHEN vl.cantidad IS NULL THEN (round(((COALESCE(ops.norma, 0) * op.cantidad)), 6))
                             ELSE (Case
                                     WHEN ((round(((COALESCE(ops.norma, 0) * op.cantidad)), 6)) - vl.cantidad) < 0 Then 0
                                     else ((round(((COALESCE(ops.norma, 0) * op.cantidad)), 6)) - vl.cantidad)
                                   END)
                           END)
                   END) as pendiente,
                   COALESCE((SELECT {$aliasProducto}.idproducto FROM mod_logistica.dat_producto {$aliasProducto} WHERE {$aliasProducto}.idindicador = i.idindicador
                AND {$aliasProducto}.idestructuracomun = {$this->global->Estructura->idestructura} $subquery LIMIT 1),0) AS idproducto,
                  --------------------
                  COALESCE((vl.existencia), 0) AS existencia,
                  0 as disponible,
                 
             (CASE WHEN $filtroVale = 1 THEN (SELECT string_agg('VE-' || ddd.nrodoc ,', ') FROM  mod_logistica.dat_documento d 
                LEFT JOIN mod_logistica.dat_documentopadre ddp ON ddp.idpadre = d.iddocumento
                LEFT JOIN mod_logistica.dat_documento dd ON dd.iddocumento = ddp.iddocumento 
                LEFT JOIN mod_logistica.dat_documentopadre ddpp ON ddpp.idpadre = dd.iddocumento
                LEFT JOIN mod_logistica.dat_documento ddd ON ddd.iddocumento = ddpp.iddocumento 
                LEFT JOIN mod_logistica.dat_movimiento dm ON dm.iddocumento = ddd.iddocumento
                LEFT JOIN mod_logistica.dat_producto {$aliasProducto} ON {$aliasProducto}.idproducto = dm.idproducto  
                LEFT JOIN mod_datosmaestros.dat_documentoprim dp ON dp.iddoc = ddd.iddoc
                WHERE ddd.estado = 4 AND dp.sigla LIKE '%valeLog%' AND {$aliasProducto}.idindicador = i.idindicador
                AND d.iddocumento = {$params['idordenproduccion']} AND {$aliasProducto}.idestructuracomun = {$this->global->Estructura->idestructura} $subquery  ) ELSE '-' END)  AS vale,
                (CASE WHEN $filtroVale = 1 THEN (SELECT string_agg('VD-' || dvd.nrodoc, ', ') FROM mod_logistica.dat_movimiento m 
                        INNER JOIN mod_logistica.dat_documento dvd on dvd.iddocumento = m.iddocumento
                        INNER JOIN mod_datosmaestros.dat_documentoprim dp on dp.iddoc = dvd.iddoc
                        INNER JOIN mod_datosmaestros.nom_docprim np on np.iddocumentos = dp.iddocumentos
                        INNER JOIN mod_logistica.dat_documentopadre ppvd on ppvd.iddocumento = dvd.iddocumento    
                        INNER JOIN mod_logistica.dat_documento dds on ppvd.idpadre = dds.iddocumento
                        INNER JOIN mod_logistica.dat_documentopadre ppds on ppds.iddocumento = dds.iddocumento    
                        INNER JOIN mod_logistica.dat_documento dso on ppds.idpadre = dso.iddocumento            
                        INNER JOIN mod_logistica.dat_documentopadre ppso on ppso.iddocumento = dso.iddocumento                 
                        INNER JOIN mod_logistica.dat_producto {$aliasProducto} ON (m.idproducto = {$aliasProducto}.idproducto)  
                        WHERE i.idindicador = {$aliasProducto}.idindicador AND ppso.idpadre = {$params['idordenproduccion']}
                        AND np.abreviatura = 'valedev' AND dvd.estado = 4 AND {$aliasProducto}.idestructuracomun = {$this->global->Estructura->idestructura} $subquery ) ELSE '-' END) AS valedev,
                  -------------------------
                  (CASE
                     WHEN (vd.cantidad) > 0
                  THEN (vl.cantidad) -(vd.cantidad)
                 
                     ELSE (vl.cantidad)
                   END) as cantentregada,
                   ops.idactividad,
                   (CASE WHEN ((CASE WHEN (vd.cantidad) > 0 THEN (vl.cantidad) - (vd.cantidad) ELSE (vl.cantidad) END) > (round(((COALESCE(ops.norma, 0) * op.cantidad)), 6))) THEN 1 ELSE 0 END) as desviacion
                 
                 FROM mod_logproduccion.dat_ordenproductosust ops
                 inner join mod_logproduccion.dat_ordenproduccion op on ops.idordenproduccion = op.idordenproduccion
                 INNER JOIN mod_datosmaestros.nom_indicador i ON (i.idindicador = ops.idindicador)
                 LEFT JOIN mod_datosmaestros.nom_unidadmedida um ON (i.idumedida = um.idunidadmedida)
                 Left JOIN mod_planificacion.dat_norma n ON n.idindicador = i.idindicador
                 Left JOIN mod_planifindustrial.dat_cartatecindustrial cti on cti.idindicadorsalida = n.idindicador
                 LEFT JOIN valeLog vl ON vl.iddocumento = op.idordenproduccion AND vl.idindicador = i.idindicador
                LEFT JOIN valeDev vd ON vd.iddocumento = op.idordenproduccion AND vd.idindicador = i.idindicador
                 LEFT JOIN mod_logproduccion.dat_ordenmateriales dom ON dom.idindicador = i.idindicador AND dom.idordenproduccion = ops.idordenproduccion
                 WHERE ops.idordenproduccion = {$params['idordenproduccion']} AND ops.idactividad IN ({$idactividad})
                  GROUP BY i.codigo,
                    i.denominacion,
                    i.numeropieza,
                    um.denominacionunidadmedida,
                    i.idumedida,
                    n.idejercicio,
                    i.idindicador,
                    dom.idordenmateriales,
                    um.abreviaturaunidadmedida,
                    ops.norma,
                    op.cantidad,
                    vl.cantidad,
                    vl.existencia,
                    vd.cantidad,
                    ops.idactividad,
                    ops.idordenproductosust
                  ) b
                  ORDER BY numeropieza ";

        if ($params['limit']) {
            $query .= " offset {$params['start']} limit {$params['limit']} ";
        }
    }
        $conn = Zend_Registry::get('conexion');
        $datas = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        return array(
            'datos' => $datas,
            'cantidad' => count($datas)
        );
    }

    public function cargarPersonas($params = array())
    {
        $query = "";
        $idEntidad = $this->global->Estructura->idestructura;
        if ($params['idactividad']) {
            $query = "SELECT dp.idpersona AS idpersona, f.denominacion as cargo,
            (SELECT btrim(concat(dp.nombre,' ',dp.snombre,' ',dp.papel,' ',dp.sapel))) as nombreapellidos,
             ddie.numero as numid
            FROM mod_logproduccion.dat_operarioactividad doa
            INNER JOIN mod_persona.dat_persona dp ON dp.idpersona = doa.idresponsable
            INNER JOIN mod_persona.dat_docidentidad ddie ON ddie.idpersona = dp.idpersona
            INNER JOIN mod_persona.dat_personaentidad c on c.idpersona = dp.idpersona and (c.fhasta > now() or c.fhasta is null )
            INNER JOIN mod_persona.dat_situacionlaboral d on d.idpersonaentidad = c.idpersonaentidad and (d.fhasta > now() or d.fhasta is null)
            INNER JOIN mod_estructuracomp.dat_cargo e on e.idcargo = d.idcargo
            INNER JOIN mod_estructuracomp.nom_cargo f on f.idnomcargo = e.idnomcargo
           WHERE doa.idactividad = {$params['idactividad']}";

            if ($params['limit']) {
                $query .= " offset {$params['start']} limit {$params['limit']} ";
            }
            $conn = Zend_Registry::get('conexion');
            $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
            return array('datos' => $data, 'cantidad' => count($data));
       }
          return false;
       
    }

    static public function adicionarProductosExtrasOrden($params)
    {
        $collProdSust = new Doctrine_Collection('DatOrdenProductoSust');   
        $productos = json_decode($params['productos'],true);
        $idactividad = json_decode($params['idactividad'],true);
        foreach ($productos as $per) {
            $ordenProdSust = new DatOrdenProductoSust();
            $ordenProdSust->idindicador = $per['idindicador'];
            //vamos ver
            foreach($idactividad as $p) {
                $ordenProdSust->idactividad = $p;
                break;
            }
            
            $ordenProdSust->idordenproduccion = $params['idordenproduccion'];

            if ($params['norma']) {
                $ordenProdSust->norma = $params['norma'];
            }
          
            $collProdSust->add($ordenProdSust);
        }   
        $collProdSust->save();  
       
    }

    public function eliminarProductosExtrasOrden($params)
    {
        $query = Doctrine_Query::create()->delete("DatOrdenProductoSust ops");
       
        if ($params['idordenproductosust']!= 0) {
            $query->whereIn('ops.idordenproductosust', $params['idordenproductosust']);
        } else {
            throw new LogisticaException('LOG_LB_PRO_005');
        }
        try {
            $query->execute();
            return array(
                'success' => true,
                'message' => "Removed to record"
            );
        } catch (Exception $e) {
            return array(
                'success' => false,
                'message' => "Failed removed to record"
            );
        }
    }

    public function cargarGastosEntidad($params)
    {
        $query = "";
        $idEntidad = $this->global->Estructura->idestructura;
  
            $query = "SELECT tc.idtipocontrolcalidad AS idtipocontrolcalidad,
            tc.denominacion AS denominacion
     FROM mod_logproduccion.nom_tipocontrolcalidad tc
     Inner Join mod_logproduccion.dat_tipocontrolcalidadentidad tce on tc.idtipocontrolcalidad = tce.idtipocontrolcalidad
     where tce.idestructuracomun = $idEntidad";

            if ($params['limit']) {
                $query .= " offset {$params['start']} limit {$params['limit']} ";
            }
            $conn = Zend_Registry::get('conexion');
            $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
            return array('datos' => $data, 'cantidad' => count($data));
       
          return false;
       
    }

    public function cargarProductos($parametros)
    {
        $tmpEstructura = json_decode($parametros['idestructura']);
        if (!is_array($tmpEstructura)) {
            $tmpEstructura = explode(',', $parametros['idestructura']);
        }
        $depositos = $this->getArrayDepositosConfiguracion($this->global->Estructura->idestructura);
        $parametros['idestructura'] = $depositos;
        $modelProducto = new LogisticaProductoModel();
        $query = $modelProducto->cargarProductos($parametros, true);
        $depositos = implode(',',$depositos);
        $query->addWhere("p.idestructura in ($depositos)");
        return $modelProducto->concatenarDeposito(
            array(
                'cantidad' => $query->count(),
                'datos' => $this->maestroProductos->setLastLevel(
                    $this->doctrineHelper->addQueryLimits($query, $parametros)
                    ->addOrderBy('p.idestructuracomun')
                    ->fetchArray()
                )
            )
        );
    }

    public function getArrayDepositosConfiguracion($identidad)
    {
        $query = "SELECT cf.idalmacen FROM mod_logproduccion.conf_almacenes cf
        WHERE cf.identidad = {$identidad} and cf.almacenmpm = 1";
        $conn = Zend_Registry::get('conexion');
        $result = Zend_Registry::get('conexion')->execute($query)->fetchAll(PDO::FETCH_COLUMN);
          return $result;
    }

    // public function getDepositosEntidad($parametros)
    // {
    //     $parametros['identidad'] = $this->global->Estructura->idestructura;
    //     /*$depositos = LogisticaEstructuraUbicHelper::__init()->cargardepositos(null, null, null, null, -1, false, 1);*/
    //     $idsDeposit = $this->seguridadHelper->obtenerEstructurasNoFormales($this->global->Perfil->certificado, 8);
    //     $depositos = $this->estructuraHelper->obtenerEstructurasNoFormales(
    //         false, $parametros['identidad'], false, null, null, $idsDeposit, -1
    //     );
    //     $datosDepositos = array();
    //     foreach ($depositos as $i => $r) {
    //         $datosDepositos[] = $r['DatEstructuraop'][0]['idestructuraop'];
    //     }
    //     /*foreach ($depositos['depositos'] as $i => $r) {
    //         $datosDepositos[] = $r['iddeposito'];
    //     }*/
    //     if (count($datosDepositos) > 0) {
    //         return array('cantidad' => count($datosDepositos), 'datos' => $datosDepositos);
    //     } else {
    //         return false;
    //     }
    // }

    

}
    
