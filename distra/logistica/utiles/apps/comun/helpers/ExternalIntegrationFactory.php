<?php

class ExternalIntegrationFactory implements IExternalStoreIntegration
{

    /**
     * @var ExternalStoreIntegrationModel
     */
    private $externalModel;

    /**
     * ExternalIntegrationFactory constructor.
     */
    public function __construct($store = 'ps')
    {
        $this->externalModel = $this->initModel($store);
    }

    /**
     * @param $arrayDatos
     */
    public function addOrdenesVenta($arrayDatos)
    {
        $this->getExternalModel()->addOrdenesVenta($arrayDatos);
    }

    public function addPedidosTienda($arrayDatos)
    {
        return $this->getExternalModel()->addPedidosTienda($arrayDatos);
    }

    public function descargarProdMantenimiento($arrayDatos)
    {
        return $this->getExternalModel()->descargarProdMantenimiento($arrayDatos);
    }

    public function ajustarProdMantenimiento($arrayDatos)
    {
        return $this->getExternalModel()->ajustarProdMantenimiento($arrayDatos);
    }
    
    /**
     * @param $idorden
     * @param $idestado
     * @return mixed
     */
    public function cambiarEstado($idorden, $idestado)
    {
        $this->getExternalModel()->cambiarEstado($idorden, $idestado);
    }

    /**
     * @param $arrayCategory
     */
    public function migrarCategorias($arrayCategory, $params)
    {
        $this->getExternalModel()->migrarCategorias($arrayCategory, $params);
    }

    /**
     * @param $arrayItems
     */
    public function migrarProductos($arrayItems)
    {
        $this->getExternalModel()->migrarProductos($arrayItems);
    }

    /**
     * @param $type
     * @return ExternalStoreIntegrationModel
     */
    private function initModel($store)
    {
        switch ($store) {
            case 'ps' :
                return new PrestaShopIntegration();
            case 'oc' :
                return new OpenCartIntegration();
            default:
                return null;

        }
    }

    /**
     * @param $arrayConfig
     * @return ExternalStoreIntegrationModel|mixed
     */
    public function setStoreConfig($arrayConfig)
    {
        $this->getExternalModel()->setStoreConfig($arrayConfig);
        return $this->getExternalModel();
    }

    public function devolverPedido($idorden, $productos)
    {
        return $this->getExternalModel()->devolverPedido($idorden, $productos);
    }

    public function devolverPedidoImporte($idorden, $importe)
    {
        return $this->getExternalModel()->devolverPedidoImporte($idorden, $importe);
    }


    /**
     * @return ExternalStoreIntegrationModel
     */
    public function getExternalModel()
    {
        return $this->externalModel;
    }


    public function connect()
    {
        $this->getExternalModel()->connect();
    }

    public function setModoCatalogo($params, $conectionName)
    {
        return $this->getExternalModel()->setModoCatalogo($params, $conectionName);
    }
}
