<?php

/**
 * @class      MenualimentoController
 * @package    Inventario
 * @subpackage Alimento
 * @author     Jorge Luis Saavedra Rubio
 * @copyright  XETID
 * @version    1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class MenualimentoController extends BaseController
{

    protected $model, $arrayData, $serviciosAyuda;
    private $serviciosConfiguracionGeneral, $logistEstrucUbica, $servContFinzas, $configuracionService;

    public function init()
    {
        $this->arrayData = array(
            'alias' => 'menuAlim', 'subsistema' => LogisticaGlobal::SUBSISTEMA_INV
        );
        parent::init('log.inv.alimento');
        
        $this->serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
        $this->logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();
        $this->servContFinzas = ServiciosContabilidadFinanzasHelper::__init();
        $this->model = new MenualimentoModel($this->arrayData);
        $data = $this->configuracionHelper->ObtenerDocumentoPrimPorId($this->model->getIddoc());
        $this->configuracionService = new ConfiguracioninventarioService();
        $config = $this->configuracionService->devolverConfiguracion($this->global->Estructura->idestructura);
         $this->view->uiVariables = array_merge(
            array(  
             'idespaciotrabajo' => empty($data->idespaciotrabajo) ?  'false' : "'$data->idespaciotrabajo'",
                'reportSpace' => empty($data->dirreporte) ? 'false' : "'$data->dirreporte'",
            'useSign' => $this->objectHelper->getBooleanStr($config['firmadigital']),
            'usarCategoria' => $this->objectHelper->getBooleanStr($config['usarcategoria']),
            ), $this->view->uiVariables
        );
    }

    public function gestmenualimentoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->serviciosConfiguracionGeneral->mostrarNomencladoresGenerales(),
            $this->serviciosConfiguracionGeneral->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.inv.alimento');
        $this->renderTemplate();
    }

    public function cargardepositosAction()
    {
        $depositos = $this->logistEstrucUbica->cargardepositos(null,null,null,null,null,-1);
        $this->datos = $depositos['depositos'];
    }

    public function cargarDocumentosAction()
    {
        //$this->uiParams['depositos'] = $this->logistEstrucUbica->cargardepositos();
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['depositos']);
        $datosBusqueda = $this->model->devolverDocumentos($this->uiParams);
        $depositos = $this->logistEstrucUbica->cargardepositos(null,array(),null,null,null,-1);
        foreach ($datosBusqueda['datos'] as $index => $data) {
            $datosBusqueda['datos'][$index]['deposito'] = $this->model->devolverDeposito($data['iddeposito'], $depositos['depositos']);
        }

        /*if ($datosBusqueda['datos'][0]['idestructuracomun'] && count($depositos['depositos'] > 0)) {
            $datosBusqueda['datos'][0]['deposito'] = $this->model->devolverDeposito(
                $datosBusqueda['datos'][0]['idestructuracomun'], $depositos
            );
        }*/
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = (array)Zend_Json::decode($this->uiParams['data']);
        $this->uiParams['listaRecetas'] = (array)Zend_Json::decode($this->uiParams['listaRecetas']);
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);
        //$deposito =  $this->uiParams['iddeposito'];
        unset($this->uiParams['data']);
        //$result = $this->model->adicionarDocumento($this->uiParams);
        $this->objectHelper->synchronize($this, $this->model->adicionarDocumento($this->uiParams));
        /*$arrDat = array(
            'idmenu'   => $result['iddocumento'],
            'deposito' => $this->uiParams['iddeposito']
        );*/
        /*$this->model->salvarProductos($arrDat);
        if ($result == false) {
            $this->success = false;
        } else {
            $this->iddocumento = $result['iddocumento'];
        }*/
    }

    public function eliminarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->eliminarDocumento($this->uiParams['iddocumento']);
    }

    public function confirmarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->confirmarDocumento($this->uiParams['iddocumento']);
    }

    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->model->anularEstadoDocumento($this->uiParams['iddocumento']);
    }

    public function revisarDocumentoAction()
    {
        $this->success = $this->model->revisadoPor($this->uiParams['iddocumento']);
    }

    public function aprobarEstadoDocumentoAction()
    {
        $this->success = $this->model->aprobarDocumento($this->uiParams['iddocumento']);
    }

    public function cargarDetallesProductosAction()
    {
        if ($this->uiParams['productoMenu']) {
            $this->objectHelper->synchronize($this, $this->model->obtenerProductos($this->uiParams));
        } else {
            $datosBusqueda = $this->model->devolverProductos($this->uiParams);
            if ($datosBusqueda) {
                $this->datos = $datosBusqueda;
                $this->cantidad = count($datosBusqueda);
            } else {
                $this->success = false;
            }
        }
    }

    public function copiarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->iddocumento = $this->model->copiarDocumento($this->uiParams['iddocumento'], $this->uiParams['iddeposito']);
    }

    public function cargarRecetasNomencladasAction()
    {
//        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $datosBusqueda = $this->model->devolverRecetasNomencladas($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function cargarRecetaMenuAction()
    {
        $datosBusqueda = $this->model->devolverRecetaMenu($this->uiParams);
        if ($datosBusqueda) {
            $this->datos = $datosBusqueda['datos'];
            $this->cantidad = $datosBusqueda['cantidad'];
        } else {
            $this->success = false;
        }
    }

    public function eliminaRecetasAction()
    {
        $this->uiParams['idrecetas'] = (array)Zend_Json::decode($this->uiParams['idrecetas']);
        $this->success = $this->model->eliminarRecetas($this->uiParams);
    }

    public function salvarCategoriasAction()
    {
        $this->uiParams = Zend_Json::decode($this->uiParams['data']);
        $this->success = $this->model->salvarProductosMenu($this->uiParams);
    }

    public function cargarProductoAlternativoAction()
    {
        $res = $this->model->devolverProductoAlternativo($this->uiParams);
        if ($res) {
           $this->objectHelper->synchronize($this, $res);
        } else {
            $this->success = false;
        }
    }

    public function eliminarProductoMenuAction()
    {
        $this->success = $this->model->eliminarProductosMenu($this->uiParams);
    }

    public function alternarProductoMenuAction()
    {
        $this->success = $this->model->alternarProductoMenu($this->uiParams);
    }

    public function salvarConclusionMedicaAction()
    {

        $this->uiParams['data'] = Zend_Json::decode($this->uiParams['data']);
        $this->success = $this->model->salvarConclusionMedica($this->uiParams);
    }

    public function autorizarEntregarAlimentosAction()
    {
        $this->uiParams['data'] = Zend_Json::decode($this->uiParams['data']);
        $this->success = $this->model->autorizarEntregarAlimentos($this->uiParams);
    }

    public function cargarActividadesMenuAction()
    {
        $this->uiParams['idestructuracomun'] = $this->global->Estructura->idestructura;
        $datosBusqueda = $this->model->devolverActividadesMenu($this->uiParams);
        if ($datosBusqueda) {
            $this->datos = $datosBusqueda['datos'];
            $this->cantidad = $datosBusqueda['cantidad'];
        }
    }

    public function cargarCategoriasAction()
    {
        $datosBusqueda = $this->model->devolverCategorias($this->uiParams);
        if ($datosBusqueda) {
            $this->datos = $datosBusqueda['datos'];
            $this->cantidad = $datosBusqueda['cantidad'];
        }
    }

}
