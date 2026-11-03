<?php

/**
 * Clase service para brindar servicios a los sistemas
 *
 * @package    Matricula
 * @author     Division de Gestion de Entidades
 * @copyright  XETID
 * @version    5.0
 */
class ConfMatriculaService extends ZendExt_Model
{

    public function __construct()
    {
        parent::ZendExt_Model();
    }

    /**
     * Funcion para cargar los js dinamicamente
     * en la phtml de los nomencladores
     *
     * @return content Retorna el contenido de la phtml de Facturacion
     */
    public function getJsNomencladores()
    {
        return '<script type="text/javascript"
        src="/logistica/activos_fijos/regmatricula/configuracionmatricula/views/js/sector.js"></script>
	 <script type="text/javascript"
        src="/logistica/activos_fijos/regmatricula/configuracionmatricula/views/js/tipochapa.js"></script>
         <script type="text/javascript"
        src="/logistica/activos_fijos/regmatricula/configuracionmatricula/views/js/tipotramite.js"></script>';
    }

}
