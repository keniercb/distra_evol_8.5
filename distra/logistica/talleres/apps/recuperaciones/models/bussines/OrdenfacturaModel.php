<?php

class OrdenfacturaModel extends ZendExt_Model
{
    private $_ordenTrabajoService, $_serviciosConfiguracionGeneral;

    public function __construct()
    {
        parent::__construct();
        $this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
        $this->_serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function getDatosReporte($params){
        $params['fechainicio'] = ($params['fechainicio']) ? '\'' . ($params['fechainicio'] . '\'') : 'null';
        $params['fechafin'] = ($params['fechafin']) ? '\'' . ($params['fechafin'] . '\'') : 'null';
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        $estructura = $this->global->Estructura->idestructura;
        $sql = "select *, count(1) over() as cantidad
        from mod_logtaller.f_ordenfactura ({$params['fechainicio']},{$params['fechafin']},{$params['tiporeporte']},$estructura) 
        limit $limit
        offset $start
        ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result, 'cantidad' => $result[0]['cantidad']);
       /* $conn = Zend_Registry::get('conexion');
        $fi = '';
        $where = '';
        $join = '';
        $select = '';
        $group = '';
        $idoperacioninterna = -1;
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        $operacioninterna = "select nv.valor from mod_logistica.nom_variableglobal nv
                             where nv.nombre = 'OPER_TALL_INTERNO'"; 
        $resultoperacion = $conn->fetchAll($operacioninterna);
        if(count($resultoperacion)){
            $idoperacioninterna = $resultoperacion[0]['valor'];
        }
        if($params['tiporeporte'] == 1){
            $where =" and (case when d.idoperacion is not null then d.idoperacion = {$idoperacioninterna} else true end)";
        }elseif($params['tiporeporte'] == 2){
            $where =" and (case when d.idoperacion is not null then d.idoperacion <> {$idoperacioninterna} else true end)";
        }elseif($params['tiporeporte'] == 3){
            $join = "inner join mod_logistica.dat_documentopadre dp on dp.idpadre = d.iddocumento 
                     inner join mod_logistica.dat_documento dd on dd.iddocumento = dp.iddocumento
                     inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento";
            $where = "and (dd.estado = 7 )";
        }elseif($params['tiporeporte'] == 4){
            $join = ' inner join mod_contabilidad.dat_comprobante dcmp on dcmp.idcomprobante = d.idcomprobante';
            $select = ",dcmp.numerocomprobante as nocomprobante";
            $group = ', dcmp.numerocomprobante';
        }elseif($params['tiporeporte'] == 5){
            $select = ",dcmp.numerocomprobante as nocomprobante, df.nrofactura as nofactura";
            $join = '   inner join mod_logistica.dat_documentopadre dp on dp.idpadre = d.iddocumento 
                        inner join mod_logistica.dat_documento dd on dd.iddocumento = dp.iddocumento
                        inner join mod_contabilidad.dat_comprobante dcmp on dcmp.idcomprobante = dd.idcomprobante
                        inner join mod_logfacturacion.dat_docfactura df on df.idfactura = dd.iddocumento';
            $where = "and (d.idcomprobante is null)";
            $group = ', dcmp.numerocomprobante,  df.nrofactura ';
        }
        if($params['fechainicio']){
            $fi="and ot.fechacierre >= '{$params['fechainicio']}'";
        }
        if($params ['fechafin']){
            $fi .= " and ot.fechacierre <= '{$params['fechafin']}'";
        }
        $sql = "SELECT
        d.iddocumento,   
        d.nrodoc ,
        cp.codigo ||' '|| cp.nombre as cliente,
        act.denominacion as servicio ,
        ot.fechacierre, 
        (coalesce((SELECT sum(coalesce(dm.importecup,0) + coalesce(dm.importecuc,0)) FROM mod_logtaller.dat_material dm where dm.idordentrabajo = d.iddocumento),0) 
        + coalesce((SELECT sum(coalesce(da.costo,0) + coalesce(da.importealternativo,0)) FROM mod_logtaller.dat_ordenactividad da where da.idordentrabajo = d.iddocumento),0)) as importe,
        count(d.iddocumento) over() as cantidad
        $select
        from mod_logistica.dat_documento d 
        inner join mod_logtaller.dat_ordentrabajo ot on ot.idordentrabajo = d.iddocumento
        inner join mod_logistica.dat_documentocliente dc on dc.iddocumento = d.iddocumento and dc.tipocliente=1
        inner join mod_datosmaestros.nom_clientesproveedor cp on cp.idclientesproveedores = dc.idcliente
        inner join mod_logtaller.dat_trabajoservicio s on s.idordentrabajo = d.iddocumento
        inner join mod_logtaller.conf_actividad act on act.idactividad=s.idservicio 
        $join
        WHERE d.estado = 9 {$fi} {$where}
        group by d.iddocumento, d.nrodoc, cp.codigo ||' '|| cp.nombre, act.denominacion, ot.fechacierre $group
        limit $limit
        offset $start
        ";

         $result = $conn->fetchAll($sql);
        // print_r($result);die;
         return array('datos' => $result, 'cantidad' => $result[0]['cantidad']);*/
    }
}