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
class GesttrasladomasivoController extends GestdocumentoController
{

    public function init($strComponent = 'log.aft.trasladomasivo')
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
        $this->_mDocActivo = new DocumentoMasivoModel();
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
        $this->initComponent('log.aft.trasladomasivo');
        $this->renderTemplate();
    }

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
        $this->uiParams['masivo'] = 1;

        $datos = $this->_mDocActivo->getDocumentosActivos($this->uiParams);
        $this->objectHelper->synchronize($this, $datos);
    }


}
