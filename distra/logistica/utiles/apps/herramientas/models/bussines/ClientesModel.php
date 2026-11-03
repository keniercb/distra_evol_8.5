<?php


class ClientesModel extends UnificadorConceptosFactory
{

    public function __construct()
    {
    }

    public function devolver($params)
    {
        $arrayWhere = array();
        $sqlClientes = "select nc.idclientesproveedores as id, nombre, abreviatura, descripcion, codigo, count(*) over () as _total,
                            nc.codigo || ' ' || nc.nombre as text
                        from mod_datosmaestros.nom_clientesproveedor nc";
        if (isset($params['criterio'])) {
            array_push($arrayWhere, "nc.nombre ilike '%{$params['criterio']}%'");
            array_push($arrayWhere, "nc.codigo ilike '%{$params['criterio']}%'");
        }
        if (count($arrayWhere)) {
            $sqlClientes .=" where (" . implode(" OR ", $arrayWhere).")";
        }
        $sqlClientes .= count($arrayWhere) == 0 ? ' where':' and';
        $sqlClientes .= " nc.idclientesproveedores not in (select fnz.idcliente from mod_datosmaestros.mig_unificacioncleintes fnz)";
        $sqlClientes .=" order by nc.codigo";
        if (isset($params['limit'])) {
            $sqlClientes .= " limit {$params['limit']}";
        }
        if (isset($params['start'])) {
            $sqlClientes .= " offset {$params['start']}";
        }
        $resultData = $this->doctrineHelper->getConnection()->fetchAll($sqlClientes);
        return array('cantidad' => $resultData[0]['_total'], 'datos' => $resultData);
    }

    public function unificar($idDestino, $arrayIdOrigen){
        $this->unificarClientesLogistica($idDestino, $arrayIdOrigen);
        $this->unificarClientesCyP($idDestino, $arrayIdOrigen);
        $this->unificarClientesAnticipos($idDestino, $arrayIdOrigen);
        $this->unificarClientesCRM($idDestino, $arrayIdOrigen);
        $this->disableClientes($idDestino, $arrayIdOrigen);
        return true;
    }

    private function unificarClientesLogistica($idDestino, $arrayIdOrigen)
    {
        $ids = implode(',', $arrayIdOrigen);
        $sqlLogistica = "update mod_logistica.dat_documentocliente set idcliente = {$idDestino} 
                            where idcliente in ($ids) and tipocliente = 1";
        $sqlLogComprometida = "update mod_logistica.dat_cantidadcomprometida set idcliente = {$idDestino} 
                            where idcliente in ($ids)";
        $sqlFac = "update mod_logfacturacion.dat_docfactura set idcliente = {$idDestino} 
                            where idcliente in ($ids) ";
        $sqlDesglosePrec= "update mod_logfacturacion.dat_clientedesgloseprecio set idcliente = {$idDestino} 
                            where idcliente in ($ids) ";
        $sqlPO= "update mod_logdistribucion.dat_prodorden set idcliente = {$idDestino} 
                            where idcliente in ($ids) ";
        $this->doctrineHelper->executeQuery($sqlLogistica);
        $this->doctrineHelper->executeQuery($sqlLogComprometida);
        $this->doctrineHelper->executeQuery($sqlFac);
        $this->doctrineHelper->executeQuery($sqlPO);
        $this->doctrineHelper->executeQuery($sqlDesglosePrec);
    }

    private function unificarClientesAnticipos($idDestino, $arrayIdOrigen)
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
    }

}