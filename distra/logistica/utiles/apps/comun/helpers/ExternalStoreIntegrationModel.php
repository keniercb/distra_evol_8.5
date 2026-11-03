<?php


abstract class ExternalStoreIntegrationModel implements IExternalStoreIntegration
{
    public abstract function addOrdenesVenta($arrayDatos);

    public abstract function cambiarEstado($idorden, $idestado);
    
    public abstract function migrarCategorias($arrayCategory, $params);

    public abstract function migrarProductos($arrayItems);

    public abstract function setStoreConfig($arrayConfig);

    public abstract function devolverPedido($idorden, $productos);

    public abstract function devolverPedidoImporte($idorden, $importe);

    public abstract function connect();




}