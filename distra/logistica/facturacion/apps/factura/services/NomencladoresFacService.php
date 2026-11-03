<?php

/*
 * Clase que contiene los servicios de los nomencladores de facturacion
 */

/**
 * Description of NomencladoresTallServices
 *
 * @author Maricet Estevez
 */
class NomencladoresFacService extends ZendExt_Model
{
   public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getJsNomencladores()
    {
        return '<script type="text/javascript"
        src="/logistica/facturacion/facturacion/comun_fact/views/js/nomencladores/tipoprecio.component.js"></script>;
        <script type="text/javascript"
        src="/logistica/facturacion/facturacion/comun_fact/views/js/nomencladores/categoriaprecio.component.js"></script>
        <script type="text/javascript"
        src="/logistica/facturacion/facturacion/comun_fact/views/js/nomencladores/cilindros.component.js"></script>
        <script type="text/javascript"
        src="/logistica/facturacion/facturacion/comun_fact/views/js/nomencladores/formapago.component.js"></script>
        <script type="text/javascript"
        src="/logistica/facturacion/facturacion/comun_fact/views/js/nomencladores/cuentasuministrador.component.js"></script>
        <script type="text/javascript"
        src="/planificacion/pdo/comun/recursos/bibliotecas/extjs3/src/util/Format.js"></script>';
    }


}
