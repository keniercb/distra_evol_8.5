<?php


if (!class_exists('BaseModel')) {
    $dirAFT = Zend_Registry::getInstance()->get('config')
            ->dir_aplication . '/logistica/activos_fijos/comun/config.php';
    include_once $dirAFT;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

/**
 *
 */
class RegNumActivoService
{
    private $mMovRegNumActivo;
    private $mRegNumActivo;
    private $mRegNumActivoInv;
    private $mEnviadoReparar;
    protected $mComunAFT;
    protected $idsubsistema;

    /**
     *
     */
    public function __construct($idsubsistema = LogisticaGlobal::SUBSISTEMA_AFT)
    {
        $this->idsubsistema = $idsubsistema;

        if (class_exists('MovRegnumericoActivoModel'))
            $this->mMovRegNumActivo = new MovRegnumericoActivoModel();
        if (class_exists('RegNumericoActivoModel'))
            $this->mRegNumActivo = new RegNumericoActivoModel($this->idsubsistema);
        if (class_exists('MovRegnumericoInventarioModel'))
            $this->mRegNumActivoInv = new MovRegnumericoInventarioModel();
        if (class_exists('DocEnviadoRepararModel'))
            $this->mEnviadoReparar = new DocEnviadoRepararModel($this->idsubsistema);
        if (class_exists('ConfiguraciontipomedioModel')){
            $this->_mTipoMedio = new ConfiguraciontipomedioModel();
            $this->_mTipoMedio->loadPluginsFromFile('listapluginsconf')->buildRelations();
        }
        if (class_exists('RegNumericoActivoModel'))
            $this->mRegNumActivo->loadPluginsFromFile('listaplugins')->buildRelations();
        if(class_exists('ComunAFTModel'))
            $this->mComunAFT = ComunAFTModel::getInstance($this->idsubsistema);
    }

    /**
     * Devuelve una instancia de la clase
     *
     * @return RegNumericoActivoModel
     */
    public function getObjRegNumActivoModel()
    {
        return $this->mRegNumActivo;
    }

    /**
     * Devuelve un objeto Doctrine_Query de la clase
     *
     * @param $alias
     * @param $select
     * @param $paramsWhere
     *
     * @return Doctrine_Query
     */
    public function getMovRegNumericoActivo($alias, $select, $paramsWhere)
    {
        return $this->mMovRegNumActivo->getMovRegNumericoActivo($alias, $select, $paramsWhere);
    }

    /**
     * Permite hacer join con un objeto Doctrine_Query de la clase
     *
     * @param $query
     * @param $alias
     * @param $aliasExt
     * @param $join
     * @param $select
     * @param $paramsWhere
     */
    public function getJoinMovRegNumericoActivo($query, $alias, $aliasExt, $join, $select, $paramsWhere)
    {
        $this->mMovRegNumActivo->getJoinMovRegNumericoActivo($query, $alias, $aliasExt, $join, $select, $paramsWhere);
    }

    /**
     * Permite acceder a los atributos de la clase
     *
     * @param $query
     * @param $alias
     * @param $postAlias
     */
    public function getSelectMovRegNumericoActivo($query, $alias, $postAlias)
    {
        $this->mMovRegNumActivo->getSelectMovRegNumericoActivo($query, $alias, $postAlias);
    }

    /**
     * Permite parametrizar una consulta de la clase
     *
     * @param $query
     * @param $alias
     * @param $paramsWhere
     */
    public function getWhereMovRegNumericoActivo($query, $alias, $paramsWhere)
    {
        $this->mMovRegNumActivo->getWhereMovRegNumericoActivo($query, $alias, $paramsWhere);
    }

    /**
     * Devuelve un objeto Doctrine_Query de la clase
     *
     * @param $alias
     * @param $select
     * @param $paramsWhere
     *
     * @return Doctrine_Query
     */
    public function getMovRegNumericoInventario($alias, $select, $paramsWhere)
    {
        return $this->mRegNumActivoInv->getMovRegNumericoInventario($alias, $select, $paramsWhere);
    }

    /**
     * Permite hacer join con un objeto Doctrine_Query de la clase
     *
     * @param $query
     * @param $alias
     * @param $aliasExt
     * @param $join
     * @param $select
     * @param $paramsWhere
     */
    public function getJoinMovRegNumericoInventario($query, $alias, $aliasExt, $join, $select, $paramsWhere)
    {
        $this->mRegNumActivoInv->getJoinMovRegNumericoInventario(
            $query, $alias, $aliasExt, $join, $select, $paramsWhere
        );
    }

    /**
     * Permite acceder a los atributos de la clase
     *
     * @param $query
     * @param $alias
     * @param $postAlias
     */
    public function getSelectMovRegNumericoInventario($query, $alias, $postAlias)
    {
        $this->mMovRegNumActivo->getSelectMovRegNumericoInventario($query, $alias, $postAlias);
    }

    /**
     * Permite parametrizar una consulta de la clase
     *
     * @param $query
     * @param $alias
     * @param $paramsWhere
     */
    public function getWhereMovRegNumericoInventario($query, $alias, $paramsWhere)
    {
        $this->mMovRegNumActivo->getWhereMovRegNumericoInventario($query, $alias, $paramsWhere);
    }

    /**
     *
     */
    public function initReNumActivoModel()
    {
        $this->mRegNumActivo->loadPluginsFromFile('listaplugins')->buildRelations();
    }

    // ---------------------------------------------------------------------------------------------------------------
    /**
     * Este servicio permite replicar los datos que tiene el movimiento del los registros numéricos
     * al registro numérico como tal. (Es lo que debe pasar cuando se aprueba un documento)
     */
    public function actualizarRegNumByIdDocumento($iddocumento, $idoperacion)
    {
        $this->initReNumActivoModel();
        return $this->mRegNumActivo->actualizarRegNumByIdDocumento($iddocumento, $idoperacion);
    }

    /**
     *
     */
    public function getSelectFilesDatRegNumActivo($alias, $isTree)
    {
        $arrUno = $this->mRegNumActivo->getSelectRegNumOperativo($alias, $isTree);
        $arrDos = $this->mRegNumActivo->getQuerySelectFields($alias);

        return $arrUno.", ".$arrDos;
    }

    /**
     *  solo lo usa depreciacion
     */
    public function joinTablasAlternasDatRegNumActivo($alias, $query)
    {
        $this->mRegNumActivo->leftJoinDatAlternosRegNumerico($alias, $query);
    }

    /**
     * solo lo usa depreciacion
     */
    public function getFiltrosDatRegNumActivo($query, $aliasTabla, $parametros)
    {
        //$mRegNumerico = new RegNumericoModel();
        //$mRegNumerico->getWhere($query, $aliasTabla, $parametros);

        $this->mRegNumActivo->addQueryFilters($query, $aliasTabla, $parametros);

        return $query;
    }

    /**
     *
     */
    public function getQueryDataVisualizarRegNumActivos($parametros, $alias = 'drna', $idsRegNumMostrar = array())
    {
        $this->initReNumActivoModel();
        return $this->mRegNumActivo->getQueryDataVisualizarRegNumActivos($parametros, $alias, $idsRegNumMostrar);
    }

    /**
     *
     */
    public function getMediosDisponibles($parametros, $dql = false)
    {
        $this->initReNumActivoModel();
        return $this->mRegNumActivo->getMediosDisponibles($parametros, $dql);
    }

    /**
     *
     */
    public function cargarMovimientosActivos($parametros, $arrCritDinamicos)
    {
        $this->initReNumActivoModel();
        return $this->mRegNumActivo->cargarMovimientosActivos($parametros, $arrCritDinamicos);
    }

    public function cargarMovRegNumAftByIds($parametros)
    {
        $this->initReNumActivoModel();
        return $this->mRegNumActivo->cargarMovRegNumAftByIds($parametros);
    }

    /**
     * 
     */
    public function getQueryRegNumActivo($asLoc = 'rna', $select = false, $parametros = array())
    {
        return $this->mRegNumActivo->getQueryRegNumActivo($asLoc, $select, $parametros);
    }

    public function getRegNumericoDat($parametros)
    {
        return $this->mRegNumActivo->getRegNumericoDat($parametros);
    }

    public function getObtenerDatRegNumAFT($arrayIdRegNumAFT)
    {
        $query = new Doctrine_Query();
        $query->from('DatRegnumerico rn')
            ->innerJoin('rn.DatRegnumericoActivo rna')
            ->select('rn.*,rna.fechainicialgarantia,rna.fechafingarantia')
            ->WhereIn("rna.idregnumerico", $arrayIdRegNumAFT);
        return $query->fetchArray();
    }

    public function getEnviadosAReparar($parametros)
    {
        return $this->mEnviadoReparar->getEnviadosAReparar($parametros);
    }

    /*
     * Esta funcion se utiliza para validar los datos que se insertan en las tablas temporales de los plugins los
     * datos que son importados.
     * */

    public function validarAddDatosTemporalesPlugins($datos)
    {
        return $this->mRegNumActivo->validarAddDatosTemporalesPlugins($datos);
    }

    /*
     * Esta funcion se utiliza para insertar en las tablas temporales de los plugins los datos que son
     * importados.
     * */

    public function addDatosTablasTemporalesPlugins($datos)
    {
        $this->mRegNumActivo->addDatosTablasTemporalesPlugins($datos);
    }

    public function validarSeriesRegistrados($conn)
    {
        $nroseriesRepetidos = $this->mRegNumActivo->validarSeriesRegistrados($conn);
        return $nroseriesRepetidos;
    }

    public function buscarRNInsertadosImportar($conn)
    {
        $nroseriesRepetidos = $this->mRegNumActivo->buscarRNInsertadosImportar($conn);
        return $nroseriesRepetidos;
    }

    public function importarDatos($conn, $idEstructura, $idDocumento, $idCentroCosto)
    {
        return $this->mRegNumActivo->importarDatos($conn, $idEstructura, $idDocumento, $idCentroCosto);
    }

    public function GetConteoRegNumericosEntidad($idestructuraop, $parametros, $imprimir = false)
    {
        $objSubmayor = new SubmayorModel();
        $objSubmayor->GetConteoRegNumericosEntidad($idestructuraop, $parametros, $imprimir = false);
    }

    public function getConteoRegNumericosEntidadService($idestructuraop, $parametros)
    {
        $this->mRegNumActivo->getConteoRegNumericosEntidadService($idestructuraop, $parametros);
    }
    
    /* metodo de carga los registros numericos que estan emtregados temporalmente como los prestamos, alquiler y 
     * entregados temporalmente. Carga tambien los enviados a taller. este metodos se creo nuevo por el metodo 
       getRegNumEntregadosReparacion()     */
    
     public function getRegNumPorEstadoOperacion($parametros, $idestadoperacion)
    {

        if ($parametros['idarearesp'] && is_array($parametros['idarearesp'])) {
            $arrIdsEstructuras = $parametros['idarearesp'];
        } else {
            $arrIdsEstructuras = $this->mComunAFT->getIdEstructurasHijas(
                ($parametros['idestructura']) ? $parametros['idestructura'] : $parametros['idarearesp'], true
            );
        }
        $depreciacion = "";
        $operaciones = $this->mComunAFT->getDatosInterfazOperacion(false, false, 'OPER_DEPRECIACION', false);

        if (count($operaciones)) {
            $idOperacion = $operaciones[0]['idoperacion'];
            $depreciacion = " AND doc.idoperacion <> $idOperacion";
        }
        $query = $this->getQueryDataVisualizarRegNumActivos($parametros);
        $mMovRegNum = new MovRegNumericoModel();
        new DatDocumentoActivo();
        $mMovRegNum->addJoinModelMy($query, 'rn', 'mvReg', 1);
        $query->innerJoin("mvReg.DatMovimientos mov");
        $query->innerJoin("mov.DatMovRegnumerico movrn");
        $query->innerJoin("mov.DatDocumento doc");
        $query->innerJoin("doc.DatDocumentoActivo doca");
        if ($parametros['envrep']) {
            $query->innerJoin('doca.DatDocEnviadoReparar der');
            $query->addWhere('der.identidaddestino IS NULL');
        }
        $query->leftJoin("i.CfgIdentificadorMedio confident"); 
        $query->addSelect('confident.denominacion as denomidmedio');
        $query->addSelect('confident.identificador as identificador');         
        $query->addSelect("doc.iddocumento as iddocumento, doc.nrodoc as nrodoc, doc.idoperacion as idoperacion, doc.fechacontable as fechacontable");
        $query->addSelect("nmarc.denominacion as marca");
        $query->addSelect("nmod.denominacion as modelo");
        $query->addWhere("doc.estado = 3");
        $query->whereIN("drna.idestadoperacion", $idestadoperacion);
        $query->addWhere("doca.tipo = {$parametros['tipo']}");
        $query->addWhere("doc.cronologia > 0");
        $query->orderBy('doc.cronologia DESC');
        $query->addOrderBy('doc.idoperacion');
        $query = $this->getRegNumericoRecepcionWhere($parametros, $query);
        $query->addWhere('rn.enproceso = 0');
		
		/*$query->addWhere(
            "drna.idregnumerico NOT IN (
             SELECT dat_mov_reg.idregnumerico
             FROM DatMovRegnumerico dat_mov_reg
             INNER JOIN dat_mov_reg.DatMovimientos dat_mov ON dat_mov.idmovimiento = dat_mov_reg.idmovimiento
             INNER JOIN dat_mov.DatDocumento docc ON docc.iddocumento = dat_mov.iddocumento
             WHERE docc.estado < 3 AND drna.idregnumerico = dat_mov_reg.idregnumerico $depreciacion
            )"
        );*/
        return $datos = $query->fetchArray();
        
        
        
    }

    /* metodo de carga los registros numericos que estan emtregados temporalmente como los prestamos, alquiler y 
     * entregados temporalmente. Carga tambien los enviados a taller */

  /*  public function getRegNumEntregadosReparacion($parametros, $arrayOperacion, $arrayIdestadoperacion,
        $operacionValidar)
    {

        $sRegNumActivo = new RegNumActivoService();
        $arrIdesOperaciones = $this->mComunAFT->getArrayIdOperacionesUtilizadas(
            false, false, $arrayOperacion, false
        );
        if (count($arrIdesOperaciones) == 0 && $operacionValidar == 'entregadostemp') {
            throw new ZendExt_Exception('LOG_AFT_DOC_008');
        } elseif (count($arrIdesOperaciones) == 0 && $operacionValidar == 'enviadoreparar') {
            throw new ZendExt_Exception('LOG_AFT_DOC_005');
        }

        if (count($arrIdesOperaciones) == 0) {
            return false;
        }
        if ($parametros['idarearesp'] && is_array($parametros['idarearesp'])) {
            $arrIdsEstructuras = $parametros['idarearesp'];
        } else {
            $arrIdsEstructuras = $this->mComunAFT->getIdEstructurasHijas(
                ($parametros['idestructura']) ? $parametros['idestructura'] : $parametros['idarearesp'], true
            );
        }

        $subq = $this->getQuerySelectIDregnumDoc($arrIdsEstructuras);
        new CfgIdentificadorMedio();

        $query = $sRegNumActivo->getQueryDataVisualizarRegNumActivos($parametros);

        $mMovRegNum = new MovRegNumericoModel();
        $mMovRegNum->addJoinModelMy($query, 'rn', 'mvReg', 1);
        $query->innerJoin("mvReg.DatMovimientos mov");
        $query->innerJoin("mov.DatDocumento doc");


        $query->leftJoin("i.CfgIdentificadorMedio confident");
        $query->addSelect('confident.denominacion as denomidmedio');
        $query->addSelect('confident.identificador as identificador');
        $query->addSelect('confident.ididentificadormedio as ididentificadormedio');

        $query->addSelect("doc.iddocumento as iddocumento, doc.nrodoc as nrodoc, doc.idoperacion as idoperacion");
        $query->addSelect("nmarc.denominacion as marca");
        $query->addSelect("nmod.denominacion as modelo");
        $query->whereIN("drna.idestadoperacion", $arrayIdestadoperacion);
        new DatDocumentoActivo();
        if ($parametros['tipo'] == 0 || $parametros['tipo'] == 1) {
            $query->innerJoin("doc.DatDocumentoActivo doca");
            $query->addWhere("doca.tipo = ?", array($parametros['tipo']));
        }

        $query->andWhereIn("p.idestructura", $arrIdsEstructuras);
        $query->andWhereIn("doc.idoperacion", $arrIdesOperaciones);
        if (count($subq) > 0) {
            foreach ($subq as $datSub) {
                $idreg[] = $datSub['idregnumerico'];
            }
            $query->andWhereNotIn('drna.idregnumerico', $idreg);
        }
       
        $query = $this->getRegNumericoRecepcionWhere($parametros, $query);
        $query->orderBy('doc.idoperacion');

        return $datos = $query->fetchArray();
    }*/

    public function getRegNumericoRecepcionWhere($parametros, $query)
    {
        if ($parametros['criterio']) {
            $query->addWhere(" i.denominacion iLike '%{$parametros['criterio']}%' ");
        }
        if ($parametros['denominaciondoc']) {
            $query->addWhere(" i.denominacion iLike '%{$parametros['denominaciondoc']}%' ");
        }
        if ($parametros['denominacion']) {
            $query->addWhere(" i.denominacion iLike '%{$parametros['denominacion']}%' ");
        }
        if ($parametros['nrodoc']) {
            $query->addWhere(" doc.nrodoc = '{$parametros['nrodoc']}'");
        }
        if ($parametros['denomidmedio'] != null) {
            $whereIdentificador = "";
            $whereIdentificador = $this->getIdentificadorDat($parametros);
            $query->addWhere($whereIdentificador);
        }
        return $query;
    }

    public function getIdentificadorDat($parametros, $aliasRA = 'drna', $aliasRAT = 'drna1', $aliasR = 'rn')
    {
        
        $whereIdentificador .= "(";
        $queryaux = Zend_Registry::get('conexion');
        $select = " select DISTINCT confident.identificador, confident.nombretabla, confident.tipo";
        $from = " FROM mod_logactivofijotangible.conf_identificadormedio confident";        
        $indicadoresmedios = $queryaux->fetchAll($select.$from);
        if(count($indicadoresmedios) == 0){
            return "( 1 != 1)";
        }
        
        foreach ($indicadoresmedios as $pos => $item) {              
            if ($item['tipo'] == 1) {
                if ($item['nombretabla'] == "dat_regnumericoactivotransp") {
                    $whereIdentificador .= " CAST({$aliasRAT}.".$item['identificador']." AS VARCHAR) ILIKE '%".
                        $parametros['denomidmedio']."%'";
                }
                if ($item['nombretabla'] == "dat_regnumericoactivo") {
                    $whereIdentificador .= " CAST({$aliasRA}.".$item['identificador']." AS VARCHAR) ILIKE '%".
                        $parametros['denomidmedio']."%'";
                }
                if ($item['nombretabla'] == "dat_registronumerico") {
                    $whereIdentificador .= " CAST({$aliasR}.".$item['identificador']." AS VARCHAR) ILIKE '%".
                        $parametros['denomidmedio']."%'";
                }               
                //quiterlo cuando se active el que esta despues del else               
                if (count($indicadoresmedios) > $pos + 1) {
                $whereIdentificador .= " OR ";
            }
            } else {
               //hay que hacerlo para los atributos dinamicos
            }


            //Cuando se haga el else hay que ponerlo
            /*if (count($indicadoresmedios) > $pos + 1) {
                $whereIdentificador .= " OR ";
            }*/            
        }
        $whereIdentificador .= ")";
        return $whereIdentificador;
    }

    public function getQuerySelectIDregnumDoc($arrIdsEstructuras)
    {
        $cadena = "SELECT dmrn.idregnumerico AS idregnumerico 
        FROM mod_logistica.dat_documento dd 
        INNER JOIN mod_logistica.dat_movimiento dm ON dd.iddocumento = dm.iddocumento 
        INNER JOIN mod_logactivofijotangible.dat_movregnumerico dmrn ON dm.idmovimiento = dmrn.idmovimiento 
        INNER JOIN mod_logactivofijotangible.dat_registronumerico rn ON dmrn.idregnumerico = rn.idregnumerico 
        INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo drna ON rn.idregnumerico = drna.idregnumerico 
        WHERE (dmrn.idregnumerico = drna.idregnumerico AND dd.estado in (1, 2))";
        $objconexion = Doctrine_Manager :: connection();
        return $objconexion->execute($cadena)->fetchAll();
    }

    public function getArrIdsRegNumericosByIddocumento($iddocumento)
    {
        return $this->mRegNumActivo->getArrIdsRegNumericosByIddocumento($iddocumento);
    }

    public function setValoresDepreInMovRnaFromRnaDadoDoc($iddocumento)
    {
        $this->mRegNumActivo->setValoresDepreInMovRnaFromRnaDadoDoc($iddocumento);
    }

    /*
     * Este metodo dado un idregnumerico
     * devuelve el iddocumeto si esta en un documento en elaboracion o preparado, en caso
     * de que no devuelve falso
     * */

    public function getIddocumentoRnActEnElaboracionOPreparado($idregnumerico)
    {
        return $this->mRegNumActivo->getIddocumentoRnActEnElaboracionOPreparado($idregnumerico);
    }

    public function getJoinRegNumericoPlugin($query, $origen = 'rna', $destinoPlug = 'rnap', $joinTablasexternas = false)
    {

        return $this->mRegNumActivo->getJoinRegNumericoPlugin($query, $origen, $destinoPlug, $joinTablasexternas);
    }

    /**
     * @param $idmedio Este idmedio es el idmedio de la tabla mod_estructura.dat_medio que coincide con un idfila
     */
    public function getRegistrosPorIdmediocompletamiento($idmedio)
    {
        return $this->mRegNumActivo->getRegistrosPorIdmediocompletamiento($idmedio);
    }

    /**
     *
     * @param string $aliasRA
     * @param bool $sql
     * @return Doctrine_Query o Array
     */
    public function getRegistrosValoresDinamicos($aliasRA = 'drna', $aliasR = 'drn', $returnsql= false){
        /*$query = Doctrine_Query::create()->from('DatRegnumericoActivo '.$aliasRA);
        $query->innerJoin($aliasRA.'.DatRegnumerico '.$aliasR);
        $query->Select("{$aliasRA}.idregnumerico as idregnumerico, 
         {$aliasRA}.idestatustecnico as idestatustecnico,  
         {$aliasRA}.datos as datos,  
         {$aliasR}.nroserie as nroserie,  
         {$aliasR}.idproducto as idproducto");*/

//        $query->from("DatRegnumericoActivo {$aliasRA}");
        try {
            $sql = sprintf("
        select
         {$aliasRA}.idregnumerico as idregnumerico, 
         {$aliasRA}.idestatustecnico as idestatustecnico,  
         {$aliasRA}.datos as datos,  
         {$aliasR}.nroserie as nroserie,  
         {$aliasR}.idproducto as idproducto
        from mod_logactivofijotangible.dat_regnumericoactivo {$aliasRA}
        inner join mod_logactivofijotangible.dat_registronumerico {$aliasR} on {$aliasR}.idregnumerico= {$aliasRA}.idregnumerico
        inner join mod_logistica.dat_producto p on {$aliasR}.idproducto = p.idproducto
        inner join mod_datosmaestros.nom_indicador i on p.idindicador = i.idindicador
        WHERE i.idnaturaleza = -10
        
                        ");
            $datos= LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            if($returnsql)
                return $sql;
//            $datos = $query->fetchArray();
            foreach ($datos as &$dat){
                $dinamicos = json_decode($dat['datos']);
                settype($dinamicos, "array");
                foreach ($dinamicos as $key=>$tabs){
                    foreach ($tabs as $din){
                        $dat[$key.(str_replace(' ', '', $din->label))] = $din->{$din->name};
                    }
                }
            }

            return $datos;
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }

    }

    public function ContarTodosSinDiferencias($iddocumento){
      $this->mRegNumActivoInv->contarTodos($iddocumento);
    }

    /**
     * $params = [
     *      'start'?: numeric,
     *      'limit'?: numeric
     *      'idcentrocosto'?: numeric,
     *      'denominacion'?: string,
     *      'idestructura'?: string,
     *      'indicativo'?': string
     *      'nromatricula'?': string
     * ]
     */

    public function getMediosTransportes($params){
        return $this->mRegNumActivo->getMediosTransportes($params);
    }


}
