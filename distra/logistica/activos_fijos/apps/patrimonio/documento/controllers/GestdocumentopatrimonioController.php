<?php

/**
 *
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication.'/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path().PATH_SEPARATOR.$config['include_path']);
}
$configFile = Zend_Registry::getInstance()->get('config')->dir_aplication
    .'logistica/activos_fijos/documento/controllers/GestdocumentoController.php';
include_once($configFile);

/**
 *
 */
class GestdocumentopatrimonioController extends GestdocumentoController //BaseController
{
    protected $sConfGeneral;
    protected $idnatObjObra;
    protected $idnatINMUEBLE;
    //protected $idnatActivos;
    protected $_mDocActivo;
    protected $_mDocEnvReparar;
    protected $_mDocEntregTemp;
    protected $_mDocPatrimonio;

    /**
     *
     */
    public function init($strComponent = 'log.aft.documentopatrimonio')
    {
        $this->_mComunAFT = ComunAFTModel::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        parent:: init($strComponent);
        $this->idnatObjObra = IntegracionNomencladoresModel::NATURALEZA_OBJETODEOBRA;
        $this->idnatINMUEBLE = IntegracionNomencladoresModel::NATURALEZA_INMUEBLE;
        //$this->idnatActivos = IntegracionNomencladoresModel::NATURALEZA_ACTIVOS;
        $this->view->uiVariables = array_merge(
            array(
            'natobjobraP' => $this->idnatObjObra,
            'natinmuebleP' => $this->idnatINMUEBLE//,
           // 'natactivosP' => $this->idnatActivos
            ), $this->view->uiVariables
        );
        $this->_mDocActivo = new DocumentoActivoModel(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        $this->_mDocPatrimonio = new DocumentoPetrimonioModel();
        $this->_mDocEnvReparar = new DocEnviadoRepararModel();
        $this->_mDocEntregTemp = new DocEntregaTemporalModel();
    }

    /**
     *
     */
    public function gestdocumentopatrimonioAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.aft.documentopatrimonio');
        $this->renderTemplate();
    }

    public function getEntregadosTemporalmenteAction()
    {
        $mDocEntregaTemporal = new DocEntregaTemporalModel(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
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
        $params['tipo'] = 1;
        $data = $mDocEntregaTemporal->getEntregadoTemporal($params);
        if (count($data['datos']) > 0) {
            $data['total'] = count($data['datos']);
            foreach ($data['datos'] as &$value) {
                $value['idindicador'] = $value['id'];
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
    public function cargardocumentosAction()
    {
        if ($this->uiParams['idoperacion']) {
            $this->uiParams['idoperacion'] = json_decode(stripcslashes($this->uiParams['idoperacion']));
        }
        if ($this->uiParams['validar_usuario']) {
            $idusuario = $this->global->Perfil->idusuario;
            $this->uiParams['idusuario'] = $idusuario;
        }
        $params = $this->uiParams;
        $params['tipo'] = 1; //documentos de Patrimonio y no AFT
        $datos = $this->_mDocActivo->getDocumentosActivos($params);
        $this->objectHelper->synchronize($this, $datos);
    }

    /**
     * @throws Exception
     * @throws ZendExt_Exception
     */
    public function adicionardocumentoAction()
    {
        $this->uiParams['tipo'] = 1; //documentos de Patrimonio y no AFT
//        try {
            $this->uiParams['idestructuracomun'] = $this->uiParams['iddeposito'];

            $objGesDocModelo = DocumentoActivoFactory::getInstance(
                    $this->uiParams['idoperacion'], LogisticaGlobal::SUBSISTEMA_PATRIMONIO
            );

            if ($this->uiParams['datosTraslado']) {
                $this->uiParams['datosTraslado'] = json_decode(stripcslashes($this->uiParams['datosTraslado']));
            }

            if ($this->uiParams['registros']) {
                $this->uiParams['registros'] = json_decode(
                    stripcslashes($this->uiParams['registros'])
                );
            }

            // En caso de que sea un documento de inventario PMensual para verificar que el mismo no este hecho ya
            if ($this->uiParams['mensual'] && !$this->uiParams['modificar']) {
                $mDocInventario = new DocInventarioModel();
                $mDocInventario->validarDocPMensual($this->uiParams);
            }

            if ($this->uiParams['numero'] != '' || $this->uiParams['fecha'] != '' ||
                $this->uiParams['clave'] != '' || $this->uiParams['iddocumentoinv'] != ''
            ) {
                $mDocOrigen = new DocOrigenModel();

                $doc = $mDocOrigen->addActivoDoc($this->uiParams);
            } else {

                $doc = $objGesDocModelo->addActivoDoc($this->uiParams);
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
            $this->nrodoc = $doc->nrodoc;
        /*} catch (Exception $e) {

            if (is_a($e, 'ZendExt_Exception')) {
                throw $e;
            } else {
                $this->failure = true;
                $this->msg = $e->getMessage();
            }
        }*/
    }

    public function addDocRecepcionAction()
    {
        try {
            $mDocEnvReparar = new DocEnviadoRepararModel();
            $this->uiParams['tipo'] = 1;
            if ($this->uiParams['datosEnvRep']) {
                $this->uiParams['datosEnvRep'] = json_decode(stripcslashes($this->uiParams['datosEnvRep']));
                $this->uiParams['idestructuracomun'] = $this->uiParams['datosEnvRep'][0]->idestructuracomun;
                $this->uiParams['idestructuraEntidad'] = $this->uiParams['datosEnvRep'][0]->idestructuraEntidad;
                $this->objectHelper->synchronize(
                    $this, $mDocEnvReparar->addDocDeEnviadoReparar($this->uiParams)
                );
            }
            if ($this->uiParams['datosEntregTemp']) {
                $this->uiParams['datosEntregTemp'] = json_decode(stripcslashes($this->uiParams['datosEntregTemp']));
                $this->uiParams['idestructuracomun'] = $this->uiParams['datosEntregTemp'][0]->idestructuracomun;
                $this->uiParams['idestructuraEntidad'] = $this->uiParams['datosEntregTemp'][0]->idestructuraEntidad;
                $mDocEntregTemp = new DocEntregaTemporalModel();
                $this->objectHelper->synchronize(
                    $this, $mDocEntregTemp->addDocDeEntregaTemporal($this->uiParams)
                );
            }
        } catch (Exception $exc) {
            $this->success = false;
            $this->error = $exc->getMessage();
        }
    }

    public function enviadosRepararAction()
    {
        $this->uiParams['tipo'] = 1;
        $parametros = $this->uiParams;
        $parametros['idarearesp'] = json_decode(stripcslashes($this->uiParams['idarearesp']));
        $mDocEnvReparar = new DocEnviadoRepararModel(LogisticaGlobal::SUBSISTEMA_PATRIMONIO);
        $datos = $mDocEnvReparar->getEnviadoRepararDoc($parametros);
        //$datos = $this->_mDocEnvReparar->getEnviadosAReparar($parametros);
        if ($datos['total'] > 0) {
            foreach ($datos['datos'] as &$value) {
                $estructura = $this->_sEstrComposicion->getEstructura($value['idestructuracomun']);
                $value['estructuradenom'] = $estructura[0]->denominacion;
                $value['marca-modelo'] = $value['marca'];
                $value['marca-modelo'] .= ($value['modelo']) ? ' - '.$value['modelo'] : '';
            }
            $this->objectHelper->synchronize($this, $datos);
        } else {
            $this->datos = array();
            $this->total = $datos['total'];
        }
    }

    public function getoperacionesAction()
    {

        //unset($this->uiParams['idfuncionalidad']);        
        $dat = $this->_mDocActivo->getOperaciones($this->uiParams);

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

    public function trasladoAction()
    {
        $mTraslados = new DocTransfEntreEntidadesModel();
        $this->uiParams['tipo'] = 1; //documentos de Patrimonio y no AFT

        $this->uiParams['idnaturaleza'] = array($this->idnatObjObra, $this->idnatINMUEBLE/*, $this->idnatActivos*/);
        ComunAFTModel::getInstance(LogisticaGlobal::SUBSISTEMA_PATRIMONIO)->configStartAndLimitInParams(
            $this->uiParams, $this->uiParams['start'], $this->uiParams['limit']
        );

        $this->objectHelper->synchronize($this, $mTraslados->getTraslados($this->uiParams));
    }

    public function gettipodocumentosAction()
    {
        $cEstructura = 'Estructura';
        if ($this->uiParams['idestructura'] == null || $this->uiParams['idestructura'] == '') {
            $this->uiParams['idestructura'] = $this->global->$cEstructura->idestructura;
        }
        $this->uiParams['subsistema'] = LogisticaGlobal::SUBSISTEMA_PATRIMONIO;
        $this->datos = $this->_mDocPatrimonio->getTiposDocumentosPatrimonio($this->uiParams);
    }

}
