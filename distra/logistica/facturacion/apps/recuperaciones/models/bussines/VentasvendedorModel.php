<?php

/**
 *  Esta clase gestiona las facturas emitidas
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class VentasvendedorModel extends BaseModel
{
    private $service;

    public function __construct()
    {
        parent::__construct();
        $this->service = new FacturacionService();
    }

    public function cargarVendedor($param)
        {

        }


}
