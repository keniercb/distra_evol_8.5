<?php
interface IExternalStoreIntegration
{
    /**
     * @param $arrayDatos
     * @return mixed
     */
    public function addOrdenesVenta($arrayDatos);

    /**
     * @param $idorden
     * @param $idestado
     * @return mixed
     */
    public function cambiarEstado($idorden, $idestado);

    /**
     * @param $id_customer
     * @return mixed
     */
    //public function buscarCliente($id_customer);

    /**
     * @param $arrayCategory
     * @return mixed
     */
    public function migrarCategorias($arrayCategory, $params);

    /**
     * @param $arrayItems
     * @return mixed
     */
    public function migrarProductos($arrayItems);

    /**
     * @param $arrayConfig
     * @return mixed
     */
    public function setStoreConfig($arrayConfig);

    /**
     * @param $arrayConfig
     * @return mixed
     */
    public function devolverPedido($idorden, $productos);

    public function devolverPedidoImporte($idorden, $importe);

    /**
     * @return mixed
     */
    public function connect();
}