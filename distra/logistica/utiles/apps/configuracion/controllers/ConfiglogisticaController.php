<?php

if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ConfiglogisticaController extends BaseController//ZendExt_Controller_Secure//
{

    private $serviciosConfiguracionGeneral;
       

    function init()
    {
        parent::init('log.lb.configuracion');
        $this->serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    function configlogisticaAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->view->arrayJs = array(
            $this->serviciosConfiguracionGeneral->mostrarNomencladoresGenerales(),
            $this->serviciosConfiguracionGeneral->obtenerJSArbolUM(),
            $this->serviciosConfiguracionGeneral->ObtenerJSArbolNaturaleza()
        );
        $this->initComponent('log.lb.configuracion');
        $this->initCfgSubsistemasInstalados();
        $this->renderTemplate();
    }

    private function initCfgSubsistemasInstalados()
    {
        //Direccion de la servidora
        $dirIndex = $_SERVER['SCRIPT_FILENAME'];
        //Direccion del componente facturacion
        $dirComponenteFacturacion = substr($dirIndex, 0, strrpos($dirIndex, 'web'))
            . 'apps/logistica/facturacion';
        //Direccion del componente inventario
        $dirComponenteInventario = substr($dirIndex, 0, strrpos($dirIndex, 'web'))
            . 'apps/logistica/inventario';

        //Direccion del componente ubicacion
        $dirComponenteUbicacion = substr($dirIndex, 0, strrpos($dirIndex, 'web'))
            . 'apps/logistica/utiles/ubicacion';
        //Direccion del componente distribucion
        $dircomponenteDistribucion = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/distribucion';
        //Direccion del componente compra
        $dircomponenteCompra = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/compra';
        //Direccion del componente talleres
        $dircomponenteTalleres = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/talleres';
        //Direccion del componente control calidad
        $dircomponenteCalidad = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/controlcalidad';


        //Direccion del componente transportacion
        $dircomponenteTransp = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/transportacion';

        $dircomponenteAF = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/activos_fijos';

        $dircomponenteProd = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/produccion';

        $dircomponentePatr = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/activos_fijos/patrimonio';

        //Direccion de reserva
        $dircomponenteReserva = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/reserva';
		
		 //Direccion del componente contenedores
        $dirComponenteContendores = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/contenedores';

        //Direccion del componente combustible
        $dirComponenteCombustible = substr($dirIndex, 0, strrpos($dirIndex, 'web')) . 'apps/logistica/combustible';
		

        if (file_exists($dircomponenteTransp)) {
            $serviceConfTransportacion = new TripulacionService();
            array_push(
                $this->view->arrayJs, $serviceConfTransportacion->getJsTripulacion()
            );
        }
        if (file_exists($dircomponenteAF)) {
            $serviceConfAF = new ConfiguracionActivosService();
            array_push(
                $this->view->arrayJs, $serviceConfAF->getJsConfigActivos()
            );
        }

        if (file_exists($dircomponenteProd)) {
            $serviceConfProd = new ConfiguracionProduccionService();
            array_push(
                $this->view->arrayJs, $serviceConfProd->getJsConfig()
            );
        }
		
		 if (file_exists($dirComponenteContendores)) {
            $serviceConfContenedores = new ConfContenedoresService();
            array_push(
                $this->view->arrayJs, $serviceConfContenedores->getJsConfigContenedores()
            );
        }
		
        if (file_exists($dircomponentePatr)) {
            $serviceConfPatri = new ConfiPatrimonioService();
            array_push(
                $this->view->arrayJs, $serviceConfPatri->getJsConfigPatri()
            );
        }
        
        
        if (file_exists($dirComponenteFacturacion)) {
            $serviceConfFacturacion = new ConfFacturacionService();
            array_push(
                $this->view->arrayJs, $serviceConfFacturacion->getJsConfigfacturacion()
            );
        }
        if (file_exists($dircomponenteTalleres) 
            && LogisticaGlobal::__init()->estaAperturadoSubsistema(LogisticaGlobal::SUBSISTEMA_TALLERES)) {
            $serviceConfTalleres = new ConfiguraciontalleresService();
            array_push(
                $this->view->arrayJs, $serviceConfTalleres->getJsConfiguracionMedios()
            );
            array_push(
                $this->view->arrayJs, $serviceConfTalleres->getJsConfiguracionActividades()
            );
            array_push(
                $this->view->arrayJs, $serviceConfTalleres->getJsConfiguracion()
            );
            array_push(
                $this->view->arrayJs, $serviceConfTalleres->getJsConfiguracionFacturacion()
            );
            array_push(
                $this->view->arrayJs, $serviceConfTalleres->getJsConfiguracionParalizacion()
            );
        }
        if (file_exists($dircomponenteCalidad)) {
            $serviceConfCalidad = new ConfiguracioncalidadService();
            array_push(
                $this->view->arrayJs, $serviceConfCalidad->getJsConfiguracion()
            );
        }
        if (file_exists($dirComponenteInventario)) {
            $serviceConfInventario = new ConfiguracioninventarioService();
            $inventario = $serviceConfInventario->getJsConfiguracion();
            array_push($this->view->arrayJs, $inventario);
        }
        if (file_exists($dircomponenteCompra)) {
            $serviceCompra = new ConfiguraciongeneralcompraService();
            array_push(
                $this->view->arrayJs, $serviceCompra->getJsConfCompra()
            );
        }

        if (file_exists($dirComponenteUbicacion)) {
            $serviceConfubicacion = new UtilesubicacionService();
            $ubicacion = $serviceConfubicacion->getJsUbicacion();
            array_push($this->view->arrayJs, $ubicacion);
        }
         if (file_exists($dircomponenteReserva)) {
             $serviceConfReserv = new ConfreservaService();
             array_push($this->view->arrayJs, $serviceConfReserv->getJsConfigcuadrobasicoreset());
         }


        if (file_exists($dircomponenteDistribucion)) {
            $serviceConfdistribucion = new ConfiguraciondistribucionService();
            $distribucion = $serviceConfdistribucion->getJsConfDistribucion();
            $pedido = $serviceConfdistribucion->getJsConfPedido();
            array_push($this->view->arrayJs, $distribucion);
            array_push($this->view->arrayJs, $pedido);
            // Agregando la configuracion de balanceo
            if(file_exists($dircomponenteDistribucion . '/balanceo') && class_exists('ConfiguracionbalanceoService')){
                    $serviceConfBalanceo = new ConfiguracionbalanceoService();
                    $balanceo = $serviceConfBalanceo->getJsConfBalanceo();
                    array_push($this->view->arrayJs, $balanceo);
            }
        }
        //Direccion del componente produccion
         $dircomponenteproduccion = substr($dirIndex, 0,strrpos($dirIndex, 'web')) . 'apps/logistica/produccion/maestros/configuracion';
        if (file_exists($dircomponenteproduccion)) {
            $serviceConfigProduccion = new ConfigProduccionService();
            array_push(
                $this->view->arrayJs, $serviceConfigProduccion->getJsConfig()
            );
        }

        $dirComponenteABC = substr($dirIndex, 0, strpos($dirIndex, 'web')). 'apps/logistica/inventario/abc/';
        if(file_exists($dirComponenteABC)){
            $serviceConfABC = new AbcService();
            array_push($this->view->arrayJs, $serviceConfABC->getJsConfiguracion());
        }

        if(file_exists($dirComponenteCombustible)){
            $serviceConfCombustible = new ConfiguracioncombustibleService();
            array_push(
                $this->view->arrayJs, $serviceConfCombustible->getJsConfiguracionVentas()
            );
            array_push(
                $this->view->arrayJs, $serviceConfCombustible->getJsConfiguracionSurtidores()
            );
        }

    }

}
