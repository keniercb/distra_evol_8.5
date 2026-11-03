<?php

/*
 * Clase que contiene los servicios de los nomencladores de talleres
 */

/**
 * Description of NomencladoresTallServices
 *
 * @author Maricet Estevez
 */
class NomencladoresFarmaciaService extends ZendExt_Model
{
    public function __construct()
    {
        parent::ZendExt_Model();
    }

        public function getJSNomencladores()
    {
        return '
        <script type="text/javascript"
        src="/logistica/farmacia/nomencladores/views/js/lineaproductofarm.component.js"></script>
        <script type="text/javascript"
        src="/logistica/farmacia/nomencladores/views/js/farmaceutica.component.js"></script>
        <script type="text/javascript"
        src="/logistica/farmacia/nomencladores/views/js/grupofarmacologico.component.js"></script>
        <script type="text/javascript"
        src="/logistica/farmacia/nomencladores/views/js/conceptoretenido.component.js"></script>
        <script type="text/javascript"
        src="/logistica/farmacia/nomencladores/views/js/consultorio.component.js"></script>
        ';
    }

    public function getJoinLineaProducto($dql, $aliasE, $join= 'left', $aliasI='nlpf')
    {
        if($join== 'left'){
            $dql->leftJoin("{$aliasE}.NomLineaProductoFarm {$aliasI}");
        }else{
            $dql->innerJoin("{$aliasE}.NomLineaProductoFarm {$aliasI}");
        }
        return $dql->addSelect(
            "{$aliasI}.idlineaprod as idlineaprod, {$aliasI}.denominacion as denomlineaprodfarm"
        );
    }

}