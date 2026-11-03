<?php

/**
 *  Esta clase gestiona las facturas emitidas
 * @copyright XETID
 * @author Divicion de Gestion de Entidades
 * @version 1.0
 */
class OrdenDespachoModel extends BaseModel
{
    private $service;

    public function __construct()
    {
        parent::__construct();
        $this->service = new FacturacionService();
    }

    public function cargarOrdenDespacho($param)
        {
            $param['estado'] = array(EstadoDocumentoModel::ESTADO_CONTABILIZADO);
            return $this->service->getDocumentos($param);
            /*$conn = Zend_Registry::get('conexion');
            $notIn = (count(json_decode($param['iddocumentos'])) > 0) ? "and ddp.idpadre not in (".implode(',',json_decode($param['iddocumentos'])).")" : "";
            $selec = "select distinct d.iddocumento, d.nrodoc, d.fechacontable";
            $from = " FROM  mod_logistica.dat_documento d 
                inner join mod_logdistribucion.dat_distribucion ddi on ddi.iddistribucion = d.iddocumento 
                inner join mod_logistica.dat_documentopadre ddp on d.iddocumento = ddp.idpadre";
            $where = " Where  ddp.iddocumento in (select dd.iddocumento from mod_logistica.dat_documento dd 
                       inner join mod_logfacturacion.dat_docfactura ddf on ddf.idfactura = dd.iddocumento 
                       where dd.estado = 4 and ddf.idestructuracomun = {$this->global->Estructura->idestructura}) 
                       {$notIn} order by d.fechacontable DESC";
            $limit = "";
            if ($param['limit']) {
                $limit.= " LIMIT {$param['limit']} ";
            }
            if ($param['start']) {
                $limit.= "OFFSET {$param['start']} ";
            }
            $total = LogisticaDoctrineHelper::__init()->getConnection()->execute($selec. $from. $where)
                ->fetchAll(PDO::FETCH_ASSOC);
            $result = $conn->execute($selec.$from.$where. $limit)->fetchAll();

            return array('datos'=>$result, 'cantidad'=>count($total));*/
        }


}
