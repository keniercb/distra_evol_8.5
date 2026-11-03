<?php

/**
 * @class      ConfiguracioninventarioService
 *
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @copyright  XETID
 * @version    2.0
 */
class ConfiguraciondistribucionService extends ZendExt_Model
{
    private $model, $confInventario;
    private $cfgDistribucion, $modelPlanes;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->model = new ConfiguraciondistribucionModel();
        $this->modelPlanes = new DatPlanconsumoModel();
    }

    public function getJsConfDistribucion()
    {

        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps
            . '/logistica/distribucion/configuracion/views/scripts/'
            . 'configuraciondistribucion/configuraciondistribucion.phtml';
        $js .= file_get_contents($dirPhtml);

        return $js;
    }

    public function getJsConfPedido()
    {

        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps
            . '/logistica/distribucion/configuracion/views/scripts/'
            . 'configuracionpedido/configuracionpedido.phtml';
        $js .= file_get_contents($dirPhtml);

        return $js;
    }
    public function getJsConCodigo()
    {

        $dirApps = Zend_Registry::getInstance()->config->dir_aplication;
        $dirPhtml = $dirApps
            . '/logistica/distribucion/configuracion/views/scripts/'
            . 'configuraciondelcodigo/configuraciondelcodigo.phtml';
        $js .= file_get_contents($dirPhtml);

        return $js;
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna la configuracion si existe
     *
     */
    public function devolverConfiguracion()
    {
        return $this->model->devolverConfiguracion(
            $this->global->Estructura->idestructura
        );
    }

    public function getplanesconsumos($idestructura, $idproductos, $idclientes, $limit, $start)
    {
        return $this->modelPlanes->getplanesconsumos($idestructura, $idproductos, $idclientes, $limit, $start);

    }

    public function actualizarExistenciaPlanConsumo($idcliente, $idproducto, $idcontrato, $cantidadfac)
    {
        return $this->modelPlanes->actualizarExistenciaPlanConsumo($idcliente, $idproducto, $idcontrato, $cantidadfac);
    }

    public function getDatosPlanConsumoCritico($fechacontable, $limit, $start)
    {
        return $this->modelPlanes->getDatosConsumoCritico($fechacontable, $limit, $start);
    }

    public function getDatosPlanConsumo($idestructura, $idproducto)
    {
        return $this->modelPlanes->getDatosPlanConsumo($idestructura, $idproducto);
    }

    public function getPlanConsumoByProductoCliente($idestructura, $idproductos, $idclientes)
    {
        return $this->modelPlanes->getPlanConsumoByProductoCliente($idestructura, $idproductos, $idclientes);
    }
}