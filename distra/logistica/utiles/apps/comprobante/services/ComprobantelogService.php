<?php

/**
 * @class      ComprobantelogService
 * Aqui se encuentran todos los servicios de ubicacion *
 * @package    Inventario
 * @subpackage Comprobante
 * @author     Maricet Estevez Fresnedo
 * @copyright  XETID
 * @version    2.0
 */
class ComprobantelogService extends ZendExt_Model
{

    

    public function __construct()
    {
        parent::ZendExt_Model();
        
    }
    public function getJsNomencladores()
    {        
        return '<script type="text/javascript"
        src="/logistica/utiles/comprobante/views/js/clasificacioncontable/clasificacioncontable.component.js"></script>;
        <script type="text/javascript"
        src="/logistica/utiles/comprobante/views/js/clasificacioncontable/clasificacioncontablefact.component.js"></script>';
    }

}
