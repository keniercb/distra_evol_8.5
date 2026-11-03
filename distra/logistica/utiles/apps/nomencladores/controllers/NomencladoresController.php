<?php

/**
 * @class      NomencladoresController
 * Gestiona todos los nomecladores
 *
 * @package    Logistica
 * @subpackage Nomencladores
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class NomencladoresController extends BaseController
{

    /**
     * Instancia del modelo de negocio para la gestion de los nomencladores
     *
     * @var type
     */
    private $nomencladoresModel;
//    private $serviciosConfiguracionGeneral;
//    private $serviciosInventario;
//    private $serviciosAyuda;
    private $params;
    private $idestructura;

    public function init()
    {
        parent::init('log.lb.nomencladores');
        $this->idestructura = $this->global->Estructura->idestructura;
        //$this->view->arrayJs = array();
        $this->params = $this->_request->getParams(); 
        $this->nomencladoresModel = ($this->params['bussines']) ? new $this->params['bussines']() :
            new NomencladoresModel();
        $dualidadMonedas = LogisticaGlobal::__init()->getMonedaEntidad();
        $todasMonedas = ServiciosConfiguracionGeneralHelper::__init()->obtenerMonedasPorEntidad($this->idestructura)['datos'];
        $this->view->uiVariables = array_merge(
            array(
                'idmoneda' => "'" . "{$dualidadMonedas->idmoneda}" . "'",
                'idmonedaalternativa' => $dualidadMonedas->idmonedaalternativa ? "'" . "{$dualidadMonedas->idmonedaalternativa}" . "'" : 'false',
                'moneda' => "'" . "{$dualidadMonedas->codigoiso}" . "'",
                'monedaalternativa' => $dualidadMonedas->codigoisoalt ? "'" . "{$dualidadMonedas->codigoisoalt}" . "'" : 'false' ,
                'monedas' => json_encode($todasMonedas)
            ), $this->view->uiVariables
        );
        /*if($dualidadMonedas->monedas){
            $this->view->uiVariables = array_merge(array('monedas'=>$dualidadMonedas->monedas),$this->view->uiVariables);
        }*/
    }

    /**
     * Metodo para renderizar la interfaz general de los nomencladores de
     * logistica
     *
     * @return void
     */
    public function nomencladoresAction()
    {
        $this->autoShow = false;        
        $this->view->arrayJs = array(
            $this->configuracionHelper->mostrarNomencladoresGenerales(),
        );
        $this->initCmponentesInstall();
        $maestroService = new MaestroProductoService();
        $this->view->arrayJs = array_merge($this->view->arrayJs, $maestroService->getJsNomencladorProductos());
        $this->render();
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna los datos de los nomencladores
     *
     */
    public function cargarnomencladorAction()
    {
        $params = $this->_request->getParams();
        $params['incluirvencidas'] = 2;
        if ($params['treesearch']) {
            $result = $this->nomencladoresModel->cargarArbol($params);
        } else {
            $result = $this->nomencladoresModel->buscar($params);
        }
        if ($params['onlyData']) {
            $this->autoShow = false;
            echo(json_encode($result));
        } else {
            $this->datos = $result['datos'];
            $this->cantidad = $result['cantidad'];
        }
        //viejo
        /*$result = $this->nomencladoresModel->buscar($this->params);
       $this->datos = $result['datos'];
       $this->cantidad = $result['cantidad'];*/

    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna los datos de los nomencladores que estan disponibles para
     *                 utilizarlos en la entidad
     *
     */
    public function cargarnomencladorentidadAction()
    {
        $result = $this->nomencladoresModel->buscarEntidad($this->params);
        $this->datos = $result['datos'];
        $this->cantidad = $result['cantidad'];
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna 'success' si se guardaron los datos del nomeclador
     *                 correctamente
     *
     *
     */
    public function insertarnomencladorAction()
    {
        $automatica = ($this->_request->getPost('automatica') == 1) ? 1 : 0;
        $this->params['automatica'] = $automatica;
        $res = $this->nomencladoresModel->insertarNomenclador($this->params);
        if ($res == 1) {
            $this->success = true;
        } elseif ($res == -1) {
            $this->success = false;
            $this->codigoRes = 'msjAddCodDescexist';
        } elseif ($res == -2) {
            $this->success = false;
            $this->codigoRes = 'msjAddDescexist';
        } else {
            $this->success = false;
            $this->codigoRes = 'msjAddCodexist';
        }
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna 'success' si se guardaron los datos del nomeclador
     *                 correctamente
     *
     */
    public function modificarnomencladorAction()
    {
        $res = $this->nomencladoresModel->modificarNomenclador($this->params);
        if ($res == 1) {
            $this->success = true;
        } elseif ($res == -1) {
            $this->success = false;
            $this->codigoRes = 'msjModCodexist';
            $this->codigoMsg = '3';
        } elseif ($res == -2) {
            $this->success = false;
            $this->codigoRes = 'msjModDescexist';
            $this->codigoMsg = '3';
        }elseif ($res == -3) {
            $this->success = false;
            $this->codigoRes = 'msjCuentauso';
            $this->codigoMsg = '3';
        }
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna 'success' si se eliminaron los datos del nomeclador
     *                 correctamente
     *
     */
    public function eliminarnomencladorAction()
    {
        $res = $this->nomencladoresModel->eliminarNomenclador($this->params);
        if ($res) {
            $this->success = true;
        } else {
            $this->success = false;
            $this->codigoMsg = '3';
        }
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna 'success' si se habilitó o deshabilitó correctamente
     *              para utilizar en la entidad el nomenclador
     *
     */
    public function habilitardesabiltarentidadAction()
    {
        $res = $this->nomencladoresModel->habilitarDesabiltarEntidad(
            $this->params
        );
        if ($res) {
            $this->success = true;
        } else {
            $this->success = false;
        }
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna 'success' si se activó el nomenclador
     *
     */
    public function activarnomencladorAction()
    {
        $res = $this->nomencladoresModel->activarNomenclador($this->params);
        if ($res) {
            $this->success = true;
        } else {
            $this->success = false;
        }
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si se guarda correctamente la categoria
     *
     */
    public function categoriapordefectoAction()
    {
        $res = $this->nomencladoresModel->setCategoriaDefecto(
            $this->params['idnom']
        );

        if ($res) {
            $this->success = true;
        } else {
            $this->success = false;
        }
    }

    public function tipopreciopordefectoAction()
    {
        $res = $this->nomencladoresModel->setTipoprecioDefecto(
            $this->params['idnom']
        );

        if ($res) {
            $this->success = true;
        } else {
            $this->success = false;
        }
    }

    public function condicionpordefectoAction()
    {
        $res = $this->nomencladoresModel->setCondicionDefecto($this->params['idnom']);
        if ($res) {
            $this->success = true;
        } else {
            $this->success = false;
        }
    }
    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna la categoría por defecto establecida en el nomenclador
     *                 categoria
     *
     */
    public function getcategoriadefectoAction()
    {
        $this->datos = $this->serviciosInventario->getCategoriaDefecto(
            $this->idestructura
        );
    }

    public function getcondiciondefectoAction()
    {
        $this->datos = $this->serviciosInventario->getCondicionpagoDefecto($this->idestructura);
    }

    public function cargarCodigoAction() {
        $this->objectHelper->synchronize(
            $this, $this->nomencladoresModel->cargarCodigos()
        );
    }
    
    private function initCmponentesInstall()
    {
        //Direccion de la servidora
        $dirIndex = $_SERVER['SCRIPT_FILENAME'];
        //Direccion del componente armamento
        $dirComponenteArmamento = substr($dirIndex, 0, strrpos($dirIndex, 'web'))
            . 'apps/logistica/inventario/armamento';
         //Direccion del componente talleres
        $dircomponenteTalleres = substr($dirIndex, 0, strrpos($dirIndex, 'web'))
            . 'apps/logistica/talleres';
        //Direccion del componente ubicacion
        $dirComponenteUbicacion = substr($dirIndex, 0, strrpos($dirIndex, 'web'))
            . 'apps/logistica/utiles/ubicacion';
        //Direccion del componente comprobante
        $dirComponenteComprobante = substr($dirIndex, 0, strrpos($dirIndex, 'web'))
            . 'apps/logistica/utiles/comprobante';
        //Direccion del componente pedido
        $dircomponentePedido = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/distribucion/pedido';
        //Direccion del componente punto de venta
        $dircomponentePuntoVenta = substr($dirIndex, 0, strrpos($dirIndex, 'web')) 
            . 'apps/logistica/facturacion/puntoventa';
        //Direccion del componente facturacion
        $dircomponenteFactura = substr($dirIndex, 0, strrpos($dirIndex, 'web')) 
            . 'apps/logistica/facturacion/facturacion';
        //Direccion del componente facturacion
        $dircomponenteResgistroMatr = substr($dirIndex, 0, strrpos($dirIndex, 'web')) 
            . 'apps/logistica/activos_fijos/regmatricula';
        //Direccion del componente talleres
        $dircomponenteCalidad = substr($dirIndex, 0, strrpos($dirIndex, 'web'))
            . 'apps/logistica/controlcalidad';
        //Direccion del componente transportacion
        $dircomponenteTransp = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/transportacion';
        //Direccion de alimento
          $dircomponenteAlim= substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/inventario/alimento';
        //Direccion del componente compra
        $dircomponenteCompra = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/compra';
		//Direccion del componente contenedores
		$dirComponenteContenedor = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/contenedores';
        //Direccion del componente combustible
        $dirComponenteCombustible = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/combustible';

      /*  $dircomponenteAF = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/activos_fijos';

        //Direccion de reserva
        $dircomponenteReserva = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/reserva';*/

        //Direccion del componente produccion
        /* $$dircomponenteproduccion = substr($dirIndex, 0,
          strrpos($dirIndex, 'web')) . 'apps/logistica/produccion'; */
		
		//Direccion del componente farmacia
        $dircomponenteFarmacia = substr($dirIndex, 0, strrpos($dirIndex, 'web'))
            . 'apps/logistica/farmacia';

        if (file_exists($dircomponenteFarmacia)) {
            $serviceFarm = new NomencladoresFarmaciaService();
            array_push(
                $this->view->arrayJs, $serviceFarm->getJSNomencladores()
            );
        }  

        if (file_exists($dirComponenteUbicacion)) {
            $serviceUbicacion = new UtilesubicacionService();
            array_push(
                $this->view->arrayJs, $serviceUbicacion->getJsNomencladores()
            );
        }
        if (file_exists($dirComponenteComprobante)) {
            $serviceComp = new ComprobantelogService();
            array_push(
                $this->view->arrayJs, $serviceComp->getJsNomencladores()
            );
        }
        if (file_exists($dirComponenteArmamento)) {
            $serviceArmamento = new MunicionesService();
            array_push(
                $this->view->arrayJs, $serviceArmamento->getJsNomencladores()
            );
        }
        if (file_exists($dircomponenteResgistroMatr)) {
            $serviceRM = new ConfMatriculaService();
            array_push(
                $this->view->arrayJs, $serviceRM->getJsNomencladores()
            );
        }
        if (file_exists($dircomponenteTalleres)) {
            $serviceTalleres = new NomencladoresTallService();
            array_push(
                $this->view->arrayJs, $serviceTalleres->getJSNomencladores()
            );
        }
        if (file_exists($dircomponenteCalidad)) {
            $serviceCalidad = new NomencladoresCalidadService();
            array_push(
                $this->view->arrayJs, $serviceCalidad->getJSNomencladores()
            );
        }
        if (file_exists($dircomponentePedido)&& LogisticaGlobal::__init()->estaAperturadoSubsistema(
            LogisticaGlobal::SUBSISTEMA_INV
        )) {
        
            $servicePedido = new NomencladorPedService();
            array_push(
                $this->view->arrayJs, $servicePedido->getJsNomencladores()
            );
        }
        if (file_exists($dircomponentePuntoVenta) ) {
            $servicePtoV = new PuntodeventaService();
            array_push(
                $this->view->arrayJs, $servicePtoV->getJsNomencladores()
            );
        }
        if (file_exists($dircomponenteTransp) ) {
            $serviceNomrol = new NomrolService();
            array_push(
                $this->view->arrayJs, $serviceNomrol->getJsNomencladores()
            );
        }
        if (file_exists($dircomponenteAlim) ) {
            if(class_exists('NomencladoresMenuService')){
                $serviceAlim = new NomencladoresMenuService();
                array_push(
                    $this->view->arrayJs, $serviceAlim->getJsNomencladores()
                );
            }
        }
        if (file_exists($dircomponenteFactura)&& LogisticaGlobal::__init()->estaAperturadoSubsistema(
            LogisticaGlobal::SUBSISTEMA_FAC)) {
            $serviceFact = new NomencladoresFacService();
            array_push(
                $this->view->arrayJs, $serviceFact->getJsNomencladores()
            );
        }
        if (file_exists($dircomponenteCompra)) {
            $serviceCompra = new ConfiguraciongeneralcompraService();
            array_push(
                $this->view->arrayJs, $serviceCompra->getJsNomencladores()
            );
        }
		 if (file_exists($dirComponenteContenedor)) {
            $serviceContenedores = new NomencladorescontService();
            array_push(
                $this->view->arrayJs, $serviceContenedores->getJSNomencladores()
            );
        }
        if (file_exists($dirComponenteCombustible)) {
            $serviceCombustible = new NomencladoresCombustibleService();
            array_push(
                $this->view->arrayJs, $serviceCombustible->getJSNomencladores()
            );
        }
       
    }

}
