<?php

/**
 *
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication.'/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path().PATH_SEPARATOR.$config['include_path']);
}

/**
 *
 */
class GestdocumentoController extends BaseController
{
    protected $_mDocActivo;
    //protected $_mDocEnvReparar;
    //protected $_mDocEntregTemp;
    protected $_sEstrComposicion;
    protected $_sConfGeneral;
    protected $_sSeguridad;
    protected $_sMproductos;
    protected $_sLogHelper;
    protected $_configuracionService;
    protected $_mComunAFT;
    protected $idnatObjObra;
    protected $idnatINMUEBLE;
   // protected $idnatActivos;
    protected $_confAftServ;


    /**
     *
     */
    public function init($strComponent = 'log.aft.documento')
    {
        // Todo lo que se comentario en este metodo fue para mejorar rendimiento.
        parent:: init($strComponent);

        //$this->_mDocActivo = new DocumentoActivoModel();
        //$this->_mDocEnvReparar = new DocEnviadoRepararModel();
        //$this->_mDocEntregTemp = new DocEntregaTemporalModel();
        $this->_sEstrComposicion = ServiciosEstructuraComposicionHelper::__init();
        $this->_sConfGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->_sSeguridad = ServiciosSeguridadHelper::__init();
        $this->_sLogHelper = LogisticaDocumentosHelper::__init();
        $this->_sMproductos = new MaestroProductosServices();
        $this->_mComunAFT = ComunAFTModel::getInstance();
        $this->arrayData['isPrincipal'] = true;
        $this->_mDocActivo = new DocumentoActivoModel();
        $this->_confAftServ = new ConfiguracionActivosService();
        $this->v_estransgaviota = $this->view->uiVariables['estransgaviota'];
        $this->view->arrayJs = array(
            $this->configuracionHelper->getJSAtributosDinamicos(),
            $this->rrhhHelper->mostrarIUBuscarPersona()
        );


        // Esto porque aqui en documento?
        array_push(
            $this->view->arrayJs, $this->_sConfGeneral->mostrarNomencladoresGenerales()
        );

        // Esto porque aqui en documento?
        array_push(
            $this->view->arrayJs, $this->_sConfGeneral->ObtenerJSArbolNaturaleza()
        );

        // Esto porque aqui en documento?
        array_push(
            $this->view->arrayJs, $this->_sConfGeneral->ObtenerJSArbolUM()
        );


        // Porque las monedas tienen que ir aqui??? esto creo que en el componente documento no se usa(creo)
          $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
          $alternativa = 0;
          $moneda = array();
          foreach ($monedas['datos'] as $value) {
          if ($value['dualidad'] == 1) {
          $alternativa = 1;
          $moneda['monedaalternativa'] = $value['idmoneda'];
          $moneda['nombremonedaalternativa'] = $value['codigoiso'];
          } else {
          $moneda['monedacontable'] = $value['idmoneda'];
          $moneda['nombremonedacontable'] = $value['codigoiso'];
          }
          }

        $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->_mDocActivo->getIddoc());
        $result = $this->_confAftServ->getConfiguracionPG($this->global->Estructura->idestructura);
        $autogenerado = ($result['autogenerado'] == 1 ) ? 1 : 0;
        $estransgaviota = ($v_estransgaviota == 1) ? 1 : 0 ;
        $this->view->uiVariables = array_merge(
            array(
            'usarPki' => ($result[0]['firmadigital'] == 1) ? 'true' : 'false',
            'idespaciotrabajo' => empty($data->idespaciotrabajo) ? 'false' : "'$data->idespaciotrabajo'",
            'autogenerado' => $autogenerado,
            'alternativa' => $alternativa == 1 ? 'true' : 'false',
            'monedacontable' => "'"."{$moneda['monedacontable']}"."'",
            'nommonedacontable' => "'"."{$moneda['nombremonedacontable']}"."'",
            'monedaalternativa' => "'"."{$moneda['monedaalternativa']}"."'",
            'nommonedaalternativa' => "'"."{$moneda['nombremonedaalternativa']}"."'",
            'estransgaviota'=>  $estransgaviota
            ), $this->view->uiVariables
        );

        /* print_r($result);
          print_r($this->view->uiVariables);die;
         */

        if ($result[0]['contabilidad'] == 1 &&
            $this->configuracionHelper->subsistemaAperturado(
                $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_AFT
            ) == 0
        ) {
            $cargaInicial = 1;
        } else {
            $cargaInicial = 0;
        }
        $integradoCont = ComunAFTModel::integradoContabiliadConf($this->global->Estructura->idestructura);

        $this->idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $this->idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
       // $this->idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;

        $this->view->uiVariables = array_merge(
            array(
            'cargaInicial' => $cargaInicial,
            'integradoCont' => $integradoCont,
            'procesorevaluacion' => $this->_mComunAFT->getProcesoRevaluacion(),
            'natobjobraP' => $this->idnatObjObra,
            'natinmuebleP' => $this->idnatINMUEBLE,
            //'natactivosP' => $this->idnatActivos
            ), $this->view->uiVariables
        );
    }

    /**
     *
     */
    public function gestdocumentoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.documento');
        $this->renderTemplate();
    }

    public function cargardatosmonedaAction()
    {
        $monedas = $this->configuracionHelper->monedaContableEntidad($this->global->Estructura->idestructura);
        $alternativa = 0;
        $moneda = array();
        foreach ($monedas['datos'] as $value) {
            if ($value['dualidad'] == 1) {
                $alternativa = 1;
                $moneda['monedaalternativa'] = $value['idmoneda'];
                $moneda['nombremonedaalternativa'] = $value['codigoiso'];
            } else {
                $moneda['monedacontable'] = $value['idmoneda'];
                $moneda['nombremonedacontable'] = $value['codigoiso'];
            }
        }

        $this->alternativa = $alternativa;
        $this->monedacontable = "'"."{$moneda['monedacontable']}"."'";
        $this->nommonedacontable = "'"."{$moneda['nombremonedacontable']}"."'";
        $this->monedaalternativa = "'"."{$moneda['monedaalternativa']}"."'";
        $this->nommonedaalternativa = "'"."{$moneda['nombremonedaalternativa']}"."'";
    }

    /**
     *
     */
    public function getentidadAction()
    {
        $cEstructura = 'Estructura';
        // $entidad = $this->_sEstrComposicion->getEstructura($this->global->$cEstructura->idestructura);
        $entidad = $this->integrator->metadatos->DameEstructura($this->global->$cEstructura->idestructura);
        $this->entidad = $entidad[0]->denominacion;
        $this->identidad = $entidad[0]->idestructura;
    }

    /**
     *
     */
    public function gettipodocumentosAction()
    {
        $cEstructura = 'Estructura';
        //$entidad = $this->_sEstrComposicion->getEstructura($this->global->$cEstructura->idestructura);
        if ($this->uiParams['idestructura'] == null || $this->uiParams['idestructura'] == '') {
            //$this->uiParams['idestructura'] = $entidad[0]->idestructura;
            $this->uiParams['idestructura'] = $this->global->$cEstructura->idestructura;
        }
        $this->uiParams['subsistema'] = LogisticaGlobal::SUBSISTEMA_AFT;
        $this->datos = $this->_mDocActivo->getTiposDocumentos($this->uiParams);
    }

    /**
     *
     */
    public function getoperacionesAction()
    {
        $dat = $this->_mDocActivo->getOperaciones($this->uiParams, false, false);
        $result = array();
        if ($this->uiParams['operacionesEntrada']) {
            foreach ($dat as $key => $value) {
                if ($value['tipo'] == 'entrada' && $value['autogenerada'] == '0') {
                    $result[] = $value;
                }
            }
        }
        $this->datos = (count($result) > 0) ? $result : $dat;
    }

    /**
     *
     */
    public function getdocumentoinventarioAction()
    {
        $datos = $this->_sLogHelper->devuelveArrIddocByIdEstructura(
            array('valeLog', 'transferenciaLog'), 
			$this->uiParams['idestructura'], 
			LogisticaGlobal::SUBSISTEMA_INV
        );
        foreach ($datos[1] as $dat) {
            $result[] = $dat;
        }
        $this->datos = $result;
    }

    /**
     *
     */
    public function getcentrocostoAction()
    {
        // if (ComunAFTModel::integradoContabilidad()) {
        $centros = ServiciosContabilidadFinanzasHelper::__init()->ObtenerCentrosNivelPorAreas(
            $this->uiParams['idarea'], $this->uiParams['idestructurapadre']
        );
        //  }
		
        foreach ($centros as &$centro) {
            $centro['id'] = $centro['idcentrogrupo'];
            $centro['descripcion'] = $centro['codigo'] . ' - '. $centro['text'];
        }
        $this->datos = $centros;
    }

    /**
     *
     */
    public function getencabezadogastionardocAction()
    {
        $cFechaContable = 'FechaContable';
        $cEstructura = 'Estructura';

        $this->fecha = $this->global->$cFechaContable->fecha ? $this->global->$cFechaContable->fecha : date('d/m/Y');
        $this->entidad = $this->global->$cEstructura->denominacion;
        $this->estado = 'Elaboración';
    }

    /**
     *
     */
    public function damecombousuariosAction()
    {
        $this->datos = $this->_mDocActivo->devolverUsuarios();
    }

    /**
     *
     */
    public function getUsuariosSistemaAction()
    {
        $this->objectHelper->synchronize($this, $this->_sSeguridad->obtenerTodosUsuarios());
    }

    /**
     *
     */
    public function getusersAction()
    {
        $usuarios = $this->_sSeguridad->obtenerTodosUsuarios();
        $respuesta = array();
        foreach ($usuarios as $usuario) {
            $respuesta[$usuario['idusuario']] = $usuario['nombreusuario'];
        }
        $this->objectHelper->synchronize($this, $respuesta);
    }

    /**
     *
     */
    public function getMarcasAction()
    {
        $parametros = $this->uiParams;
        $parametros['denominacion'] = $parametros['query'];
        $datos = $this->configuracionHelper->obtenerMarcas($parametros);
        $this->objectHelper->synchronize($this, $datos);
    }

    /**
     *
     */
    public function getModelosAction()
    {
        $parametros = $this->uiParams;
        $parametros['denominacion'] = $parametros['query'];
        $datos = $this->configuracionHelper->obtenerModelos($parametros);
        $this->objectHelper->synchronize($this, $datos);
    }

    /**
     *
     */
    public function getMediosNaturalezaAction()
    {
        $documento = new DocInventarioModel();

        if ($this->uiParams['areasseleccionadas']) {
            $this->uiParams['areasseleccionadas'] = json_decode(stripcslashes($this->uiParams['areasseleccionadas']));
        }

        if ($this->uiParams['cargarMedios'] == 2) {
            $this->datos = $documento->getMediosEnArea($this->uiParams);
        } else {
            $this->datos = $documento->getNaturalezasEnArea($this->uiParams);
        }
    }

    /**
     *
     */
    public function getEntregadosTemporalmenteAction()
    {
        $mDocEntregaTemporal = new DocEntregaTemporalModel();
        $params = $this->uiParams;
        $params['idarearesp'] = json_decode($this->uiParams['idarearesp']);
        if ($params['criterio'] && $params['criterio'] == null) {
            unset($params['criterio']);
        }
        if ($params['denomidmedio'] && $params['denomidmedio'] == null) {
            unset($params['denomidmedio']);
        }
        //$data = $mDocEntregaTemporal->getRegNumEntregados($params);
        ini_set('memory_limit', '2048M');
        $params['tipo'] = 0;
        //$params['idestadoperacion'] = 2;
        $data = $mDocEntregaTemporal->getEntregadoTemporal($params);
        if (count($data['datos']) > 0) {
            $data['total'] = count($data['datos']);
            foreach ($data['datos'] as &$value) {
                //$area = $this->_sEstrComposicion->getEstructura($value['idarearesp']);
                $area = $this->integrator->metadatos->DameEstructura($value['idarearesp']);
                $value['areadenom'] = $area[0]->denominacion;
                $value['idindicador'] = $value['id'];
                $value['idindicador'] = $value['id'];
                if ($value['cfgIndMed_denominacion'] && $value[$value['cfgIndMed_identificador']]) {
                    $value['denomidmedio'] = $value['cfgIndMed_denominacion'].': '.$value[$value['cfgIndMed_identificador']];
                }
                unset($value['id']);
                $value['responsable'] = $value['nombre'].
                    ($value['snombre'] ? ' '.$value['snombre'] : '').
                    ($value['papel'] ? ' '.$value['papel'] : '').
                    ($value['sapel'] ? ' '.$value['sapel'] : '');

                $value['marcamodelo'] = $value['marca'].
                    ($value['modelo'] ? ' - '.$value['modelo'] : '');

                $value['denominaciondoc'] = $value['denominacion'];
                $value['idprod'] = $value['idindicador'];
            }
            $this->objectHelper->synchronize($this, $data);
        } else {
            $this->datos = array();
            $this->total = count($data['datos']);
        }
    }

    /**
     *
     */
    public function getestadosdocumentoAction()
    {
        $this->datos = $this->_mDocActivo->getEstadosDocumento();
    }

    /**
     *
     */
    public function cargarEspecialidadAction()
    {
        $this->data = $this->_sConfGeneral->ObtenerEspecialidadesHojas();
    }

    /**
     *
     */
    public function getOperacionesEntradaAction()
    {
        $parametros = array();
        $parametros['idestructura'] = $this->uiParams['idarearesp'];
        $this->datos = $this->_mDocActivo->getOperacionesEntrada($parametros);
    }

    /**
     *
     */
    public function cargaInicialAction()
    {
        $data = $this->_mDocActivo->getDatosCargaInicial();

        $this->datos = array(
            'usuarios' => $data['usuarios'],
            'iddocs' => $data['iddocs']
        );

        $this->cantidad = 0;
        $this->success = true;
        $this->codigoMsg = 1;
    }

    /**
     *
     */
    public function getdocumentosentradainventarioAction()
    {
      
      $idAreaResp = ($this->uiParams['idarea'] != -1) ? $this->uiParams['idarea'] : $this->uiParams['idareaadd'];
      
      $idoperacoinAft = $this->uiParams['idoperacion'];
      
      if ($this->uiParams['centrocosto']) {
          $parametros['centroscosto'] = $this->uiParams['centrocosto'];
      } else {
          $centrosCosto = $this->_mDocActivo->getCentrosCostos($idAreaResp, $this->uiParams['idestructura']);
          $parametros = array('centroscosto' => array());
          foreach ($centrosCosto as $centro) {
              array_push($parametros['centroscosto'], $centro['idcentrogrupo']);
          }
      }

      $docSalida = new DocumentosalidaService(LogisticaGlobal::SUBSISTEMA_INV);
      
      //$datDocOrigen = new DocOrigenModel();
      //$iddocumantoInventario = $datDocOrigen->getDatDocOrigen($this->uiParams['iddocumantoInventario']);
      //$parametros['ids'] = $iddocumantoInventario;
      $parametros['estado'] = 4;

      $parametros['tipo'] = $this->uiParams['tipo'];

      if($this->uiParams['criterio'])
          $parametros['criterio'] = $this->uiParams['criterio'];
      if($this->uiParams['filtrado'])
          $parametros['filtrado'] = $this->uiParams['filtrado'];
      $parametros['hasta'] = $this->configuracionHelper->getFechaContableSubsistemaObj(
          $this->global->Estructura->idestructura, LogisticaGlobal::SUBSISTEMA_AFT
      )->fecha;

      // Para poder filtar vales que son solamente de salida de UH o AFT a explotacion.
      $idOperacionInv = false;
      $operAft = $this->_mComunAFT->getOperacionSobreMediosById($idoperacoinAft);

      
      $codVale = null;
      if($operAft->codigooperacion == 'OPER_UTILESHERRA' || $operAft->codigooperacion == 'OPER_UTILESHERRA_EXT'){
          // Busco el idoperacion fijo de inentario para los vales de entrega de utiles a explotacion
          $codVale = 'vale_sal_uh_explo';
      }
      if($operAft->codigooperacion == 'OPER_REC_INVENTARIO' || $operAft->codigooperacion == 'OPER_REC_INV_EXT'){
          // Busco el idoperacion fijo de inentario para los vales de entrega de AFT a explotación
          $codVale = 'vale_sal_aft_explo';
      }
      
        if(!class_exists('VariablesGlobalesModel')){ /* Se usa la version vieja del componente de logistica utiles_apps < 1.0.0 */
            LogisticaGlobal::__reset();
            $idOperacionInv = LogisticaGlobal::__init()->getConfig($codVale) ? LogisticaGlobal::__init()->getConfig($codVale) : false;
            if(!$idOperacionInv || $idOperacionInv == 1 ){
                $errorMsg =  "Configure la operación de salida de inventario en el fichero log_config.ini";
                throw new LogisticaException('LOG_LB_DOC_022', null, false, $errorMsg);
            }
        } else { /* Se usa la version nueva del componente de logistica utiles_apps >= tag 1.0.0 */
            $variablesModel = new VariablesGlobalesModel();
            $idOperacionInv = $variablesModel->obtenerValor($codVale);

            if(!$idOperacionInv){
            $errorMsg =  "Configure la operación de salida de inventario con el código: '".$codVale."' en las variables globales de logística.";
            throw new LogisticaException('LOG_LB_DOC_022', null, false, $errorMsg);
            }
        }
        $idOperacionInv = explode(',', $idOperacionInv);

        if($this->uiParams['idEntidadDocSalidaOrigen']){
            $datDoc = $docSalida->devolverDocumentos($parametros, false, $this->uiParams['idEntidadDocSalidaOrigen'], $idOperacionInv);
        }
        else{
            $datDoc = $docSalida->devolverDocumentos($parametros, true, false, $idOperacionInv);
            $ref =new DatDocumento();        
            $rela[] = array('cardinalidad' => 'one', 'relation' => 'DatDocumentoOrigen',
            'properties'   => array('local' => 'iddocumento', 'foreign' => 'iddocumentoinv'));
            $helper1 = LogisticaDoctrineHelper::__init();
            $helper1->tryInyectRelactions($ref, $rela);
            $datDoc->leftJoin('d.DatDocumentoOrigen doco');
            $datDoc->addWhere('doco.iddocumentoinv is null');
            $datDoc->leftJoin('doco.DatDocumento do');
            $datDoc = array(
                'cantidad' => $datDoc->count(), 'datos' => $this->_mDocActivo->cargarClientesDocumentos(
                    $helper1->addQueryLimits($datDoc, $parametros)->fetchArray()
            ));
        }

      $this->objectHelper->synchronize($this, $datDoc);
    }

    /**
     *
     */
    public function getListadoDocSubSisteActivosAction()
    {
        $this->objectHelper->synchronize(
            $this, $this->_mDocActivo->getListadoDocSubSisteActivos($this->uiParams['idestructurapadre'])
        );
    }

    /**
     *
     */
    public function cargarnecesarioAction()
    {
        try {
            $this->objectHelper->synchronize($this, $this->_mDocActivo->getDatosInicialesComponente($this->uiParams));
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    /**
     *
     */
    public function trasladoAction()
    {
        $mTraslados = new DocTransfEntreEntidadesModel();
        $this->uiParams['tipo'] = 0;
        $this->uiParams['idnaturaleza'] = array($this->idnatObjObra, $this->idnatINMUEBLE/*, $this->idnatActivos*/);
        ComunAFTModel::getInstance()->configStartAndLimitInParams(
            $this->uiParams, $this->uiParams['start'], $this->uiParams['limit']
        );

        $this->objectHelper->synchronize($this, $mTraslados->getTraslados($this->uiParams));
    }

    /**
     *
     */
    public function enviadosRepararAction()
    {
        $this->uiParams['tipo'] = 0;
        $parametros = $this->uiParams;
        $envReparar = new DocEnviadoRepararModel();
        $parametros['idarearesp'] = json_decode(stripcslashes($this->uiParams['idarearesp']));
        $datos = $envReparar->getEnviadoRepararDoc($parametros);
        //$datos = $this->_mDocEnvReparar->getEnviadosAReparar($parametros);
        if ($datos['total'] > 0) {
            foreach ($datos['datos'] as &$value) {
                //$estructura = $this->_sEstrComposicion->getEstructura($value['idestructuracomun']);
                $estructura = $this->integrator->metadatos->DameEstructura($value['idestructuracomun']);
                //$area = $this->_sEstrComposicion->getEstructura($value['idarearesp']);
                $area = $this->integrator->metadatos->DameEstructura($value['idarearesp']);
                $value['areadenom'] = $area[0]->denominacion;
                $value['estructuradenom'] = $estructura[0]->denominacion;
                $value['marca-modelo'] = $value['marca'];
                $value['marca-modelo'] .= ($value['modelo']) ? ' - '.$value['modelo'] : '';
                $value['idindicador'] = $value['id'];
                if ($value['cfgIndMed_denominacion'] && $value[$value['cfgIndMed_identificador']]) {
                    $value['denomidmedio'] = $value['cfgIndMed_denominacion'].': '.$value[$value['cfgIndMed_identificador']];
                }
                unset($value['id']);
            }

            $this->objectHelper->synchronize($this, $datos);
        } else {
            $this->datos = array();
            $this->total = $datos['total'];
        }
    }

    /**
     *
     */
    public function estructurasEnviadosRepararAction()
    {
        $mDocEnviadoReparar = new DocEnviadoRepararModel();

        $datos = $mDocEnviadoReparar->getEstrucConOperacionesConfiguradas($this->uiParams);
        $this->objectHelper->synchronize($this, $datos);
    }

    /**
     *
     */
    public function estructurasOrigenTrasladoAction()
    {
        $obj = new DocTransfEntreEntidadesModel();
        $this->objectHelper->synchronize($this, $obj->getEstructuraOrigen($this->uiParams));
    }

    /**
     *
     */
    public function adicionardocumentoAction()
    {
       try {
            $this->uiParams['idcentrocosto'] = ($this->uiParams['idcentrocosto'] == '')?null:$this->uiParams['idcentrocosto'];
            $this->uiParams['idestructuracomun'] = $this->uiParams['iddeposito'];

            $objGesDocModelo = DocumentoActivoFactory::getInstance(
                    $this->uiParams['idoperacion'], LogisticaGlobal::SUBSISTEMA_AFT
            );

            if ($this->uiParams['datosTraslado']) {
                $this->uiParams['datosTraslado'] = json_decode(stripcslashes($this->uiParams['datosTraslado']));
            }

            if ($this->uiParams['registros']) {
                $this->uiParams['registros'] = json_decode(
                    stripcslashes($this->uiParams['registros'])
                );
            }

            if ($this->uiParams['idcondicionpago'] == null) {
                unset($this->uiParams['idcondicionpago']);
            }

            // En caso de que sea un documento de inventario PMensual para verificar que el mismo no este hecho ya
            if ($this->uiParams['mensual'] && !$this->uiParams['modificar']) {
                $mDocInventario = new DocInventarioModel();
                $idestructura = $this->global->Estructura->idestructura;
                $idPeriodoActual = $this->_sConfGeneral->getPeriodoActualSubsistema($idestructura, 11, null);
                $objPeriodo = $this->_sConfGeneral->obtenerPeriodo($idPeriodoActual);
                $mDocInventario->validarDocPMensual($this->uiParams, $objPeriodo, $this->uiParams['idoperacion']);
            }

            if ($this->uiParams['numero'] != '' || $this->uiParams['fecha'] != '' || $this->uiParams['clave'] != '' || $this->uiParams['iddocumentoinv'] != ''
            ) {
                $mDocOrigen = new DocOrigenModel();

                $doc = $mDocOrigen->addActivoDoc($this->uiParams);
            } else {
                if ($this->uiParams['iddocumento'] && $this->uiParams['idnodo']) {
                    $doc = $this->_mDocActivo->addDocumentoFirma($this->uiParams);
                    $doc->idnodo = $this->uiParams['idnodo'];
                    $doc->controlfirma = $this->uiParams['controlfirma'];
                } else {
                    $doc = $objGesDocModelo->addActivoDoc($this->uiParams);
                }
            }
            $doc->save();
            if ($this->uiParams['iddocumentoinv']) {                
                ini_set('memory_limit', '1024M');
                $docSalida = new DocumentosalidaService();
                $arrDocInventario = $docSalida->devolverDatosByDoc($this->uiParams['iddocumentoinv']);
                $objGesDocModelo->loadDocumentoFromDataDocInventario($doc, $arrDocInventario);
            }
            if ($this->uiParams['envmantenimiento']) {
                $parametros['envmantenimiento'] = json_decode(stripcslashes($this->uiParams['envmantenimiento']));
                $parametros['entidadpadre'] = $this->uiParams['entidadpadre'];
                $parametros['idoperacion'] = $this->uiParams['idoperacion'];
                ini_set('memory_limit', '1024M');
                $this->objectHelper->synchronize(
                    $this, $objGesDocModelo->loadDocumentoFromDataDocMantenimeinto($doc, $parametros)
                );
            }            
            
            $this->success = true;
            $this->iddocumento = $doc->iddocumento;
            $this->nrodoc = $doc->numeroref;

        } catch (Exception $e) {

            if (is_a($e, 'ZendExt_Exception')) {
                throw $e;
            } else {
                $this->failure = true;
                $this->msg = $e->getMessage();
            }
        }
        $this->_mDocActivo->updateregnumericoactivo();
    }
    
     /*getEntidadTrasladoExterno*/
    public  function getEntidadTrasladoExternoAction()
    {
        $cEstructura = 'Estructura';
        $estructura = $this->global->$cEstructura->idestructura;
        $this->uiParams['excluir'] = $estructura;
        $datos = $this->_mComunAFT->cargarEstructuras($this->uiParams);

        $this->datos = $datos['datos'];
        $this->total = $datos['total'];
    }

    /**
     *
     */
    public function cargardocumentosAction()
    {   
        if ($this->uiParams['idoperacion']) {
            $this->uiParams['idoperacion'] = json_decode(stripcslashes($this->uiParams['idoperacion']));
        }
        if ($this->uiParams['validar_usuario']) {
            $idusuario = $this->global->Perfil->idusuario;
            $this->uiParams['idusuario'] = $idusuario;
        }
        $this->uiParams['tipo'] = 0; //documentos de AFT y no Patrimonio
        $this->uiParams['masivo'] = 0;

        $datos = $this->_mDocActivo->getDocumentosActivos($this->uiParams);
        $this->objectHelper->synchronize($this, $datos);
    }

    /**
     *
     */
    public function eliminardocumentoAction()
    {
        try {
            $objGesDocModelo = DocumentoActivoFactory::getInstance($this->uiParams['idoperacion']);
            $objGesDocModelo->delDocActivo($this->uiParams);

            $this->success = true;
        } catch (Doctrine_Exception $e) {
            $this->success = false;
            $this->msg = $e->getMessage();
        } catch (Exception $e){
			$this->success = false;
            $this->msg = $e->getMessage();
		}
    }

    /**
     *
     */
    public function confirmardocumentoAction()
    {
        try {
            $valido = true;
            if(!$this->uiParams['inventario']){
                // Validar activos con numero de inventario repetidos
                $nroInv_repetidos = RegNumericoActivoModel::getActivosInventarioYaExistentes($this->uiParams['iddocumento']);
                if(count($nroInv_repetidos) > 0){
                    $this->success = false;
                    $this->repetidos = $nroInv_repetidos;
                    $valido = false;
                }
            }
            //este comentario no se puede quitar porque se esta pensando como hacer esto
            if($valido){
                $validar = $this->_mDocActivo->getValidarDatRegNum($this->uiParams['iddocumento'], $this->uiParams['tipo']);

                if ($validar['mov'] && !$this->uiParams['inventario']) {
                    $this->success = false;
                    $this->msg = 'Existen productos que no tienen asignados registros n&uacute;merico.';
                } else if ($validar != null && !$this->uiParams['inventario']) {
                    $this->success = false;
                    $this->validar = $validar;
                } else {
                    /*metodo que llena los campos necesarios para el 117*/
                    if ($this->_mDocActivo->confirmarDocumento($this->uiParams['iddocumento'])) {

                        $this->_confAftServ->updateUsoDepConfiguracionPG($this->global->Estructura->idestructura, 1);
                        $this->success = true;
                        $this->estado = 'Preparado';
                        $this->idestado = 2;
                    } else {
                        throw(new Doctrine_Exception('El documento no ha podido ser confirmado.'));
                    }
                }
            }
            /* if ($this->_mDocActivo->confirmarDocumento($this->uiParams['iddocumento'])) {

              $this->success = true;
              $this->estado = 'Preparado';
              $this->idestado = 2;
              } else {
              throw(new Doctrine_Exception('El documento no ha podido ser confirmado.'));
              } */
        } catch (Doctrine_Exception $e) {

            $this->success = false;
            $this->msg = $e->getMessage();
            $this->cod = 3;
        }
    }

    /**
     *
     */
    public function cancelardocumentoAction()
    {
        try {
             $estado = $this->_mDocActivo->cancelarEstadoDoc($this->uiParams['iddocumento']);


            if ($estado) {

                if ($this->uiParams['inventario']) {
                    $mDocInventario = new DocInventarioModel();
                    $mDocInventario->cancelarDocInventario($this->uiParams['iddocumento']);
                }

                $this->success = true;
                $this->estado = 'Elaboración';
                $this->idestado = 1;
            } else {
                throw(new Doctrine_Exception('El documento no ha podido ser cancelado.'));
            }
        } catch (Exception $e) {

            $this->success = false;
            $this->msg = $e->getMessage();
            $this->cod = 3;
        }
    }

    /**
     *
     */
    public function aprobardocumentoAction()
    {       
        if ($this->uiParams['inventario']) {
            $mDocInventario = new DocInventarioModel();
            $estado = $mDocInventario->aprobarDocumento($this->uiParams);

            if ($estado == 5 || $estado == 6) {
                $this->success = false;
                $this->cod = $estado;
            } else {
                $this->success = true;
                $this->cod = 2;
            }
        } else {
            $objGesDocModelo = DocumentoActivoFactory::getInstance($this->uiParams['idoperacion']);

            $estado = $objGesDocModelo->aprobarDocumento(
                $this->uiParams['iddocumento'], $this->uiParams['idoperacion'], $this->uiParams['observacion'],
                $this->uiParams['identidadpadre']
            );
			// Para actualizar los campos depreciacion y depreciacioncuc de los movimientos.  
			$this->_mDocActivo->actalizarValorDepreciacion($this->uiParams['iddocumento']);

			
            $historialRNEstadosModel = new HisRegNumericoEstatusModel();
            $historialRNEstadosModel->guardarHistorialRegNumEstatus($this->uiParams['iddocumento']);
			
			
			
			
            if ($estado) {
                $this->success = true;
                $this->estado = 'Aprobado';
                $this->idestado = 3;
                $this->nrodoc = $this->_mDocActivo->obtenerNroDoc($this->uiParams['iddocumento']);
            } else {
                $this->failure = true;
                $this->cod = 3;
            }
        }
    }

    /**
     *
     */
    public function existeintegracioncontabilidadAction()
    {
        $this->integracionContabilidad = ComunAFTModel::integradoContabilidad();
    }

    /**
     *
     */
    public function addDocRecepcionAction()
    { 
        //print_r($this->uiParams);die;
        try {
            $this->uiParams['tipo'] = 0;
            if ($this->uiParams['datosEnvRep']) {
                $mDocEnvReparar = new DocEnviadoRepararModel();
                $this->uiParams['datosEnvRep'] = json_decode(stripcslashes($this->uiParams['datosEnvRep']));
                $this->uiParams['idestructuracomun'] = $this->uiParams['datosEnvRep'][0]->idestructuracomun;
                $this->uiParams['idestructuraEntidad'] = $this->uiParams['datosEnvRep'][0]->idestructuraEntidad;
                $this->objectHelper->synchronize(
                    $this, $mDocEnvReparar->addDocDeEnviadoReparar($this->uiParams)
                );
            }
            
            if ($this->uiParams['datosEntregTemp']) {
                $mDocEntregTemp = new DocEntregaTemporalModel();
                $this->uiParams['datosEntregTemp'] = json_decode(stripcslashes($this->uiParams['datosEntregTemp']));
                $this->uiParams['idestructuracomun'] = $this->uiParams['datosEntregTemp'][0]->idestructuracomun;
                $this->uiParams['idestructuraEntidad'] = $this->uiParams['datosEntregTemp'][0]->idestructuraEntidad;
                $this->objectHelper->synchronize(
                    $this, $mDocEntregTemp->addDocDeEntregaTemporal($this->uiParams)
                );
            }
        } catch (Exception $exc) {
            $this->success = false;
            $this->error = $exc->getMessage();
        }
    }

    /**
     *
     */
    public function addDocDevolucionEntregaAction()
    {
        try {
            $mDocEntregaTemporal = new DocEntregaTemporalModel();

            if ($this->uiParams['datosDevEntreg']) {
                $this->uiParams['datosDevEntreg'] = json_decode(
                    stripcslashes(
                        $this->_request->getPost('datosDevEntreg')
                    )
                );
                $this->uiParams['idestructuracomun'] = $this->uiParams['datosDevEntreg'][0]->idestructuracomun;
                $this->uiParams['idestructuraEntidad'] = $this->uiParams['datosDevEntreg'][0]->idestructuraEntidad;
            }

            $this->objectHelper->synchronize($this, $mDocEntregaTemporal->addDocDeEntregaTemporal($this->uiParams));
        } catch (Exception $exc) {
            $this->success = false;
            $this->error = $exc->getMessage();
        }
    }

    /**
     *  Para cargar los posibles reportes por operación configurados
     */
    public function cargartiporeportesAction()
    {
        $this->objectHelper->synchronize(
            $this, $this->_mDocActivo->getTiposDeReporteOperaciones($this->uiParams['idoperacion'])
        );
    }

    /**
     *  Para cargar los reportes desde jasperReport
     */
    public function iddocsPorSubsistemaEntidadAction()
    {
        $cEstructura = 'Estructura';

        $arrDocumentos = ServiciosConfiguracionGeneralHelper::__init()->documentosPorSubsistemaEntidad(
            LogisticaGlobal::SUBSISTEMA_AFT, $this->global->$cEstructura->idestructura
        );

        $arrIdesDocs = array();
        foreach ($arrDocumentos AS $value) {
            $arrIdesDocs[] = $value->iddoc;
        }
        $this->datos = implode(',', $arrIdesDocs);
    }

    /**
     * Funcion para cargar las areas de una entidad
     */
    public function cargarareasAction()
    {/*
        $this->setDefaultParam('idtipo', 0);
        $depositos = LogisticaEstructuraUbicHelper::__init()->cargardepositos(
            null, null, null, null, null, $this->uiParams['idtipo']
        );
        $this->datos = $depositos['depositos'];
        $this->cantidad = count($depositos['depositos']);*/

        $datos = $this->_mDocActivo->getAreasResponsabilidad();
        $this->datos = $datos['depositos'];
        $this->cantidad = count($datos['depositos']);
    }

    public function buscarDatPersonaDePrestamoAction()
    {
        $obj = new DocPrestamoModel();
        $datos = $obj->buscarPersona($this->uiParams['idpersona']);
        $this->datos = $datos;
    }

    public function buscarDatTransportadorEvnRepararAction()
    {
        try{
            $obj = new DocEnviadoRepararModel();
            $datos = $obj->buscarTransportador($this->uiParams['idpersona']);
            $this->datos = $datos;
        }
        catch(Exception $exc) {
            print_r($exc);
            die;
        }
    }

    public function validarCamposIntegracionInvAction()
    {
        $parametros['iddocumento'] = $this->uiParams['iddocumento'];
        $parametros['idoperacion'] = $this->uiParams['idoperacion'];
        $parametros['idoperacion'] = $this->uiParams['tipo_interfaz'];
        $parametros['iddocIntegracionInventario'] = true;
        $cEstructura = 'Estructura';
        $mMovActivoFijo = new MovimientoActivoFijoModel();
        $datos = $mMovActivoFijo->getDatos($parametros);
        $arrDatMovGrid = $datos['datos'];
        $parametros['idestructurapadre'] = $this->global->$cEstructura->idestructura;
        /* $parametros['idoperacion'] = $this->uiParams['idoperacion'];
          $parametros['tipo_interfaz'] = $this->uiParams['tipo_interfaz']; */

        $datosColumnas = $mMovActivoFijo->obtenerColumnasEditables($arrDatMovGrid, $parametros);

        $this->datos = $datosColumnas;
    }

    public function getExisteDocAjustesInventarioAction()
    {
        $this->datos = $this->_mDocActivo->getExisteDocAjustesInventario($this->uiParams['iddocumento']);
    }

    public function getDestinoFinalAction()
    {
        $destino = new DestinoFinalModel();
        try {
            $destino = new NomDestinoFinal();
            if ($this->uiParams['idestructura']) {
                $estructura = $this->uiParams['idestructura'];
            } else {
                $cEstructura = 'Estructura';
                $estructura = $this->global->$cEstructura->idestructura;
            }
            $result = $destino->getNomDestinoFinal($estructura);
            $this->datos = $result;
            $this->total = count($result);
        } catch (Exception $e) {
            $this->msg = 3;
            $this->error = $e->getMessage();
            /* echo json_encode(
              array('Msg' => 3, 'error' => $e->Message())
              ); */
        }
    }

    public function devolverMediosAction()
    {
        try {
            $arridregistros = json_decode($this->uiParams['idregistros']);
            $this->_mDocActivo->devolverMediosAEntidadOrigen($arridregistros);
            $this->success = true;
        } catch (Exception $exc) {
            $this->success = false;
            $this->error = $exc->getMessage();
        }
    }

    public function cargarMediosDevueltosAction()
    {
        $this->_mComunAFT->configStartAndLimitInParams(
            $this->uiParams, $this->uiParams['start'], $this->uiParams['limit']
        );
        $this->datos = $this->_mDocActivo->cargarMediosDevueltos($this->uiParams);
    }

    public function getCondicionPagoAction()
    {
        $condicion = ServiciosConfiguracionGeneralHelper::__init();
        $datos = $condicion->obtenerCondicionesPago();
        $this->datos = $datos['data'];
        $this->total = $datos['total'];
    }

    public function getCondicionPagoByProvAction()
    {
        $this->objectHelper->synchronize($this, $this->_mDocActivo->getCondicionPagoByProv($this->uiParams));
    }


    // Si devuelve 1-> OK
    // Si devuelve 2-> Error de validacion (No es el ultimo documento de uno o varios activos)
    // Si devuelve 3-> Error de validacion del tipo de documento que se intenta desaprobar
    // Si devuelve 4-> Error interno

    public function desaprobarDocumentoAction(){

        try{
            $iddocumento = $this->uiParams['iddocumento'];

            $doc = Doctrine::getTable('DatDocumento')->find($iddocumento);
            $model = DocumentoActivoFactory::getInstance($doc->idoperacion);

            $respCode = $model->desaprobarDocumento($doc);

            $this->success = ($respCode > 1) ? false : true;
            $this->error = $respCode;

        }
        catch(Exception $exc){
            $this->success = false;
            $this->error = 4;
        }
    }

    public function fBalanceExportarConsoAction()
    {
       $this->datos = $this->_mDocActivo->fBalanceExportarConso($this->uiParams);
        
    }

    /*
    public function ignorarmediostrasladadosAction(){
        
        $arridregistros = json_decode($this->uiParams['idregistros']);
        $resp = $this->_mDocActivo->ignorarMediosTrasladados($arridregistros);
        if($resp){
            $this->success = true;
        }else{
            $this->success = false;
            $this->error = "Debe seleccionar al menos un medio";
        }
    }*/
}
