<?php

/*
 * Clase que contiene los servicios de los nomencladores de talleres
 */

/**
 * Description of NomencladoresTallServices
 *
 * @author Maricet Estevez
 */
class NomencladoresTallService extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

    public function getJSNomencladores()
    {
        return '<script type="text/javascript"
        src="/logistica/talleres/nomencladores/views/js/fallasmedios/fallasmedios.component.js"></script>
              <script type="text/javascript"
              src="/logistica/talleres/nomencladores/views/js/destino/destino.component.js"></script>
              <script type="text/javascript"
              src="/logistica/talleres/nomencladores/views/js/clasificacion/clasificacion.component.js"></script>
              <script type="text/javascript"
              src="/logistica/talleres/nomencladores/views/js/cuadreproceso/cuadreproceso.component.js"></script>
              <script type="text/javascript"
              src="/logistica/talleres/nomencladores/views/js/ubicacion/ubicaciontall.component.js"></script>
            ';
    }

    /**
     * @param $obj array(''modelo = 'NomDestino', denominacion:'', codigo:'',idnom:'iddestino', ...)
     * @param $dql
     *
     * @return array
     */

    public function cargarNomenclador($obj, $dql)
    {
        $modelDestino = new NomDestinoModel();
        return $modelDestino->buscarEntidad($obj, $dql);
    }


}
