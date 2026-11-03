<?php

/* Esta clase controla todas las partidas
 * @copyright Xetid
 * @author División Gestión de Entidades
 * @versión 1.0
 */

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class PartidasController extends BaseController
{
    /**
     * @var partidasModel
     */
    private $partidas,
        /**
         * @var DatEstructuraubicacionModel
         */
        $estructuraubic,
        $serviciosUbicacion;

    public function init()
    {
        parent::init('log.lb.partidas');
        $configuracionService = new ConfiguracioninventarioService();
        $config = $configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
        $this->partidas = new PartidasModel();
        $this->estructuraubic = new DatEstructuraubicacionModel();
        $cfg = new Datconfigubicacion();
        $confubic = $cfg->cargarDatos($this->global->Estructura->idestructura);
        $fecha = new DateTime();
        $this->view->uiVariables = array_merge(
            array('usarCategoria' => $this->objectHelper->getBooleanStr($config['usarcategoria']),
                  'confubicacion' => $confubic['estructura'] ? 'false' : 'true',
                  'fecha' => "'{$fecha->format('d/m/Y')}'"),
            $this->view->uiVariables
        );
    }

    function partidasAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.lb.partidas');
        $this->renderTemplate();
    }

    public function cargarDocumentosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosDocumentos = $this->partidas->cargarDocumentos($this->uiParams);
        $this->datos = $datosDocumentos['datos'];
        $this->cantidad = $datosDocumentos['cantidad'];
    }

    public function cargarProductosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosBusqueda = $this->partidas->cargarProductosPartidas($this->uiParams);
        $datcofubicacion = new UtilesubicacionService();
        $confubic = $datcofubicacion->obtenerConfiguracionUbicacion($this->global->Estructura->idestructura);
        $this->confubicacion = $confubic;
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }
}
