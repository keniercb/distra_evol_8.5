<?php
/**
 * Created by PhpStorm.
 * User: yoendy
 * Date: 24/05/2018
 * Time: 14:25
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class RotacionloteController extends BaseController
{
    private $model, $arrayData;

    public function init()
    {
        $this->arrayData = array('isPrincipal' => true, 'alias' => 'rotacionloteLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV);
        parent::init('log.inv.rotacionlote');
        $this->model = new RotacionloteModel($this->arrayData);
        $this->view->uiVariables = array_merge(
            array(
                'fechasub' => "'".$this->global->{"FechaContable"}->fecha."'",
                'idestructura' => $this->global->Estructura->idestructura
            ), $this->view->uiVariables
        );

    }

    public function rotacionloteAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();

        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
            $this->configuracionHelper->ObtenerJSArbolNaturaleza(),
            $this->configuracionHelper->ObtenerJSArbolUM()
        );

        $this->initComponent('log.inv.rotacionlote');
        $this->renderTemplate();
    }

    public function cargarRotacionesAction()
    {
        $datos = $this->model->cargarRotaciones($this->uiParams);
        $this->datos = $datos[0];
        $this->cantidad = $datos[1];
    }
    public function cargarOrigenDestinoAction()
    {
        $cEstructura = $this->global->{"Estructura"}->idestructura;
        $params['idpadre'] = $cEstructura;
        $sEstrComposicion = ServiciosEstructuraComposicionHelper::__init();
        $areas = $this->model->cargarAreasTipoRotacion($this->uiParams['idtiporotacion']);

        $result = $sEstrComposicion->obtenerEstructurasNoFormales(
            $this->global->Perfil->certificado, $cEstructura, false, null, null, $areas
        );
        $this->datos = $result;
    }
    public function cargarProductosAction()
    {
        $this->datos = array();
    }
    public function cargarLotesAction()
    {
        $datos = $this->model->cargarLotes($this->uiParams);
        $this->datos = $datos[0];
        $this->cantidad = $datos[1];
    }
    public function cargarCodificadorAction()
    {
        if ($this->uiParams['excluir']) {
            $this->uiParams['excluir'] = json_decode($this->uiParams['excluir']);
        }
        $datos = $this->model->cargarCodificador($this->uiParams);
        $this->datos = $datos[0];
        $this->cantidad = $datos[1];

    }

    public function salvarDatosAction()
    {
        $datos = $this->model->salvarDatos($this->uiParams);
        $this->idrotacionlote = $datos['idrotacionlote'];
        $this->estado = $datos['estado'];

    }

    public function eliminarRotacionAction()
    {
        $this->model->eliminarRotacion($this->uiParams);

    }
    public function eliminarProductoAction()
    {
        $this->model->eliminarProducto($this->uiParams);

    }
    public function salvarLotesAction()
    {
        $this->model->adicionarLotes($this->uiParams);
    }
    public function eliminarLoteAction()
    {
        $this->model->eliminarLotes($this->uiParams);
    }

    public function rotarLotesAction()
    {
        $this->men = $this->model->rotarLotes($this->uiParams);
    }


}