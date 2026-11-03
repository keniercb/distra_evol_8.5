<?php

/*
 * Clase que contiene los servicios de los nomencladores de menu
 */

/**
 * Description of NomencladoresTallServices
 *
 * @author Maricet Estevez
 */
class NomencladoresMenuService extends ZendExt_Model
{
   public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getJsNomencladores()
    {        
        return '<script type="text/javascript"
        src="/logistica/inventario/alimento/views/js/nomenclador/actividadalimento.component.js"></script>
	 <script type="text/javascript"
        src="/logistica/inventario/alimento/views/js/nomenclador/norma.component.js"></script>';
    }


}
