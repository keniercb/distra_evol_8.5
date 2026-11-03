<?php

/*
 * Clase que contiene los servicios de los nomencladores de pedido
 */

/**
 * Description of NomencladoresTallServices
 *
 * @author Maricet Estevez
 */
class NomencladorPedService extends ZendExt_Model
{
   public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getJsNomencladores()
    {
        return '<script type="text/javascript"
        src="/logistica/distribucion/pedido/views/js/nomenclador/tiporeclamo.component.js"></script>';
    }


}
