<?php


class ProductosModel extends UnificadorConceptosFactory
{

    public function __construct()
    {
    }

    public function devolver($params)
    {
        $arrayWhere = array();
        $sqlproductos = "select nc.idindicador as id, denominacion as nombre, umm.abreviaturaunidadmedida as abreviatura, descripcion,numeropieza as  codigo, count(*) over () as _total,
                            coalesce(nc.numeropieza || ' ','') || nc.denominacion as text
                        from mod_datosmaestros.nom_indicador nc join mod_datosmaestros.nom_unidadmedida umm on nc.idumedida = umm.idunidadmedida";
        if (isset($params['criterio'])) {
            array_push($arrayWhere, "nc.numeropieza ilike '%{$params['criterio']}%'");
            array_push($arrayWhere, "nc.denominacion ilike '%{$params['criterio']}%'");
        }
        if (count($arrayWhere)) {
            $sqlproductos .=" where (" . implode(" OR ", $arrayWhere).")";
        }
        $sqlproductos .= count($arrayWhere) == 0 ? ' where':' and';
        $sqlproductos .= " nc.estado <> 0 and nc.activo <> 0 and (nc.fechafin >= now() or nc.fechafin is null)";

        $sqlproductos .=" order by nc.numeropieza";
        if (isset($params['limit'])) {
            $sqlproductos .= " limit {$params['limit']}";
        }
        if (isset($params['start'])) {
            $sqlproductos .= " offset {$params['start']}";
        }
        $resultData = $this->doctrineHelper->getConnection()->fetchAll($sqlproductos);
        return array('cantidad' => $resultData[0]['_total'], 'datos' => $resultData);
    }

    public function unificar($idDestino, $arrayIdOrigen){
        $this->unificarProductosLogistica($idDestino, $arrayIdOrigen);
        /*$this->unificarClientesCyP($idDestino, $arrayIdOrigen);
        $this->unificarClientesAnticipos($idDestino, $arrayIdOrigen);
        $this->unificarClientesCRM($idDestino, $arrayIdOrigen);
        $this->disableClientes($idDestino, $arrayIdOrigen);*/
        return true;
    }

    private function unificarProductosLogistica($idDestino, $arrayIdOrigen)
    {
        $ids = implode(',', $arrayIdOrigen);
        $sqlLogistica = "update mod_logistica.dat_producto set idindicador = {$idDestino} 
                            where idindicador in ($ids)";
        $sqlLogInd = "update mod_datosmaestros.nom_indicador set estado = 0, activo = 0, fechafin = now()  
                            where idindicador in ($ids) and idindicador <> {$idDestino}";
        $this->doctrineHelper->executeQuery($sqlLogistica);
        $this->doctrineHelper->executeQuery($sqlLogInd);
    }

    /*private function unificarClientesAnticipos($idDestino, $arrayIdOrigen)
    {

    }

    private function unificarClientesCyP($idDestino, $arrayIdOrigen)
    {
        $ids = implode(',', $arrayIdOrigen);
        $sqlCyP= "update mod_cobroypago.dat_derechouobligacion set idclienteproveedorfiscal = {$idDestino},
                        idclienteproveedorcobropago = {$idDestino} where idclienteproveedorfiscal in ({$ids})";
        $sqlCyPResumen = "update mod_finanzas.res_resumencuentafnz set idcliente = {$idDestino} where idcliente in ({$ids})";
        $sqlInstrumento = "update mod_finanzas.dat_instrumentofnz set idcliente = {$idDestino}, idclienteproveedor = {$idDestino} where idcliente in ({$ids})";
        $this->doctrineHelper->executeQuery($sqlCyP);
        $this->doctrineHelper->executeQuery($sqlCyPResumen);
        $this->doctrineHelper->executeQuery($sqlInstrumento);
    }

    private function disableClientes($idDestino, $arrayIdOrigen)
    {
        $arrayValues = array();
        foreach ($arrayIdOrigen as $idCliente){
            if($idCliente!= $idDestino){
                array_push($arrayValues, "({$idDestino},{$idCliente})") ;
            }
        }
        $values = implode(',', $arrayValues);
        $insertSql = "INSERT INTO mod_datosmaestros.mig_unificacioncleintes(idclientedestino, idcliente) values {$values}";
        $this->doctrineHelper->executeQuery($insertSql);
    }

    private function unificarClientesCRM($idDestino, $arrayIdOrigen)
    {
        $ids = implode(',', $arrayIdOrigen);
        $sqlCRM = "update mod_crmcontratacion.dat_contrato set idclienteproveedor = {$idDestino} where idclienteproveedor in ({$ids})";
        $sqlOferta = "update mod_crmcontratacion.dat_ofertanegocio set idclienteproveedor = {$idDestino} where idclienteproveedor in ({$ids})";
        $sqlSN = "update mod_crmcontratacion.dat_solicitudnegocio set idclienteproveedor = {$idDestino} where idclienteproveedor in ({$ids})";
        $sqlPerfil = "update mod_crmclienteproveedor.dat_perfilcliente set idclienteproveedor = {$idDestino} where idclienteproveedor in ({$ids})";
        $this->doctrineHelper->executeQuery($sqlCRM);
        $this->doctrineHelper->executeQuery($sqlOferta);
        $this->doctrineHelper->executeQuery($sqlSN);
        $this->doctrineHelper->executeQuery($sqlPerfil);
    }*/

}