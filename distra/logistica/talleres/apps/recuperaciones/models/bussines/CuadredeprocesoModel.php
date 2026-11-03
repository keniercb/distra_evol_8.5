<?php

class CuadredeprocesoModel extends ZendExt_Model
{
    //private $_ordenTrabajoService, $_serviciosConfiguracionGeneral;
    public function __construct()
    {
        parent::__construct();
        //$this->_ordenTrabajoService = new OrdenTrabajoTalleresService();
        $this->configuracionHelper = ServiciosConfiguracionGeneralHelper::__init();
    }

    public function getClientes($parametros){
        $filtro = array();
        if ($parametros['query']) {
            $filtro['nombre'] = $parametros['query'];
            $filtro['codigo'] = $parametros['query'];
        } 
        $start = ($parametros['start'])?$parametros['start']:0;
        $limit = ($parametros['limit'])?$parametros['limit']:20;

        $clientes =  $this->configuracionHelper->getClientesProveedorByParams(
            null, $this->global->Estructura->idestructura, true, true, true, $filtro, $start, $limit
            ); 
        return $clientes;    
    }
    public function getSector() {
        $sql = "select ns.idsector, ns.denominacion from mod_crmcontratacion.nom_sector ns";
        return array('datos' => LogisticaDoctrineHelper::__init()->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC));
    }
    public function getDatosReporte($params){
        $conn = Zend_Registry::get('conexion');
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        $fi = '';
        $sql ='';
        $cliente = ($params['cliente']) ? $params['cliente'] : 'null';
        $sector = ($params ['sector'])? $params['sector'] : 'null';
        if($params['cliente']){
            $fi .= " and dmc.idcliente = {$params['cliente']}";
        }
        if($params['sector']){
            $fi .= " and nmc.idsector = {$params['sector']}";
        }
        if($params['fechainicio']){
            $fi .= " and dot.fechainicio >= '{$params['fechainicio']}'";
        }
        if($params['fechafin']){
           $fi .= " and dot.fechainicio <= '{$params['fechafin']}'";
        }

        if($params ['tiporeporte'] == 1){
            $sql = "select  sum(COALESCE(dm.importecontable, 0)-(
                    coalesce((
                                select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
                                inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
                                inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
                                where ddev.estado = 4 and devp.idpadre = dm.iddocumento and dev.idproducto = dm.idproducto
                            ),0)
                )) 
             as importeorden 
            from mod_logistica.dat_documento dd 
            inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dd.iddocumento
            inner join mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento
            inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = ddp.iddocumento
            inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd1.iddocumento
            inner join mod_logistica.dat_documentocliente dmc on dmc.iddocumento = dd.iddocumento and dmc.tipocliente = 1
            inner join mod_datosmaestros.nom_clientesproveedor nmc on nmc.idclientesproveedores = dmc.idcliente
            where dd.idestructuracomun = {$this->global->Estructura->idestructura}  
            and dd.estado in (1,2)
            and dd1.idcomprobante is not null and dd1.estado = 4 {$fi}
         ";
        }
        else if($params['tiporeporte'] == 2){
            $sql = "select (sum(COALESCE(dm.importecontable, 0)) - coalesce((
                select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
                inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
                inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
                where ddev.estado = 4 and devp.idpadre in (select pad.iddocumento from mod_logistica.dat_documentopadre pad where pad.idpadre = dd.iddocumento)
            ),0)) as importeorden, dd.nrodoc, dot.fechainicio, dot.fechafin,sum(COALESCE(dm.importecontable, 0))valeentrega,coalesce((
                select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
                inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
                inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
                where ddev.estado = 4 and devp.idpadre in (select pad.iddocumento from mod_logistica.dat_documentopadre pad where pad.idpadre = dd.iddocumento)
            ),0)as valedev,
            ((sum(COALESCE(dm.importecontable, 0))-coalesce((
                select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
                inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
                inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
                where ddev.estado = 4 and devp.idpadre in (select pad.iddocumento from mod_logistica.dat_documentopadre pad where pad.idpadre = dd.iddocumento)
            ),0))-(sum(COALESCE(dm.importecontable, 0)) - coalesce((
                select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
                inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
                inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
                where ddev.estado = 4 and devp.idpadre in (select pad.iddocumento from mod_logistica.dat_documentopadre pad where pad.idpadre = dd.iddocumento)
            ),0 )))as diferencia,dot.idordentrabajo

            from mod_logistica.dat_documento dd 
            inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dd.iddocumento
            inner join mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento
            inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = ddp.iddocumento
            inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd1.iddocumento
            inner join mod_logistica.dat_documentocliente dmc on dmc.iddocumento = dd.iddocumento and dmc.tipocliente = 1
            inner join mod_datosmaestros.nom_clientesproveedor nmc on nmc.idclientesproveedores = dmc.idcliente
            where dd.idestructuracomun = {$this->global->Estructura->idestructura}  
            and dd.estado in (1,2) 
            and dd1.idcomprobante is not null 

            and dd1.estado = 4 {$fi}
            group by dd.iddocumento ,dd.nrodoc, dot.fechainicio, dot.fechafin,dot.idordentrabajo
            order by dot.fechainicio";
        }
        else if($params['tiporeporte'] == 3){
            $sql = "select (sum(COALESCE(dm.importecontable, 0)) - coalesce((
                select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
                inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
                inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
                where ddev.estado = 4 and devp.idpadre in (select pad.iddocumento from mod_logistica.dat_documentopadre pad where pad.idpadre = dd.iddocumento)
            ),0)) as importeorden, dd.iddocumento,dot.idordentrabajo,dd.nrodoc, dot.fechainicio, dot.fechafin,sum(COALESCE(dm.importecontable, 0))valeentrega,coalesce((
                select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
                inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
                inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
                where ddev.estado = 4 and devp.idpadre in (select pad.iddocumento from mod_logistica.dat_documentopadre pad where pad.idpadre = dd.iddocumento)
            ),0)as valedev,
            ((sum(COALESCE(dm.importecontable, 0)) - coalesce((
                select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
                inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
                inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
                where ddev.estado = 4 and devp.idpadre in (select pad.iddocumento from mod_logistica.dat_documentopadre pad where pad.idpadre = dd.iddocumento)
            ),0))-(sum(COALESCE(dm.importecontable, 0)) - coalesce((
                select sum(coalesce(dev.importecontable,0)) from mod_logistica.dat_movimiento dev
                inner join mod_logistica.dat_documento ddev on ddev.iddocumento = dev.iddocumento
                inner join mod_logistica.dat_documentopadre devp on devp.iddocumento = dev.iddocumento
                where ddev.estado = 4 and devp.idpadre in (select pad.iddocumento from mod_logistica.dat_documentopadre pad where pad.idpadre = dd.iddocumento)
            ),0 )))as diferencia,dot.idordentrabajo
            
            from mod_logistica.dat_documento dd 
            inner join mod_logtaller.dat_ordentrabajo dot on dot.idordentrabajo = dd.iddocumento
            inner join mod_logistica.dat_documentopadre ddp on ddp.idpadre = dd.iddocumento
            inner join mod_logistica.dat_documento dd1 on dd1.iddocumento = ddp.iddocumento
            inner join mod_logistica.dat_movimiento dm on dm.iddocumento = dd1.iddocumento
            inner join mod_logistica.dat_documentocliente dmc on dmc.iddocumento = dd.iddocumento and dmc.tipocliente = 1
            inner join mod_datosmaestros.nom_clientesproveedor nmc on nmc.idclientesproveedores = dmc.idcliente
            where dd.idestructuracomun = {$this->global->Estructura->idestructura}  
            
            and dd1.idcomprobante is not null 

            and dd.estado = 9 {$fi}
            group by dd.iddocumento ,dd.nrodoc, dot.fechainicio, dot.fechafin,dot.idordentrabajo
            order by dot.fechainicio";
           
        }
//print_r($this->global->Estructura->idestructura);die;
       
         $result = $conn->fetchAll($sql);
         return array('datos' => $result, 'cantidad' => $result[0]['cantidad']);
    }
    public function listarValeEntrega($params){
        
        $conn = Zend_Registry::get('conexion');
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        $sql ='';
        $sql ="SELECT 
        dp.iddocumento,
        dd.fechacontable,
        dd.nrodoc,
        dot.idordentrabajo,
        deop.denominacion as deposito
        FROM mod_logtaller.dat_ordentrabajo  dot
         INNER JOIN mod_logistica.dat_documento d ON (d.iddocumento = dot.idordentrabajo)
         INNER JOIN mod_logistica.dat_documentopadre dp ON (dp.idpadre = d.iddocumento)
         INNER JOIN mod_logistica.dat_documento dd ON (dd.iddocumento = dp.iddocumento)
        LEFT JOIN mod_datosmaestros.dat_documentoprim dprim ON (dprim.iddoc = dd.iddoc)
        LEFT JOIN mod_datosmaestros.nom_docprim docp ON (docp.iddocumentos = dprim.iddocumentos)
        LEFT JOIN mod_estructuracomp.dat_estructuraop deop ON (deop.idestructuraop = dd.idestructuracomun)
        WHERE (dot.idordentrabajo IN ('{$params['idordentrabajo']}'))
        ORDER BY dot.idordentrabajo DESC";
    
        $result = $conn->fetchAll($sql);
        
    return array('datos' => $result);
   }
    

public function listarValedevolucion($params){
    $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $conn->beginTransaction();
   
    $start = ($params['start']) ? $params['start'] : 0;
    $limit = ($params['limit']) ? $params['limit'] : 30;
    $sql ='';
    if($params['nrodoc']){
         $sql = "SELECT distinct d.iddocumento AS iddocumento,
        d.nrodoc AS nrodoc,
        d.numeroref AS numeroref,
        d.fechacontable AS fechacontable,
        d.idestructuracomun AS idestructuracomun,
        m8.denominacion AS tipodocumento,
        d.estado AS estado,
        m9.denominacion AS deposito
 FROM mod_logtaller.dat_ordentrabajo  m
      INNER JOIN mod_logistica.dat_documento m2 ON (m2.iddocumento = m.idordentrabajo)
      INNER JOIN mod_logistica.dat_documentopadre m3 ON (m3.idpadre = m2.iddocumento)
      INNER JOIN mod_logistica.dat_documento m4 ON (m4.iddocumento = m3.iddocumento)
      INNER JOIN mod_logistica.dat_documentopadre m5 ON (m5.idpadre = m4.iddocumento)
      INNER JOIN mod_logistica.dat_documento d ON (d.iddocumento = m5.iddocumento)
      LEFT JOIN mod_datosmaestros.dat_documentoprim m7 ON (m7.iddoc = d.iddoc)
      LEFT JOIN mod_datosmaestros.nom_docprim m8 ON (m8.iddocumentos = m7.iddocumentos)
      LEFT JOIN mod_estructuracomp.dat_estructuraop m9 ON (m9.idestructuraop = d.idestructuracomun)
 WHERE (m.idordentrabajo = '{$params['idordentrabajo']}' AND
       d.estado in (4))
        "; 
      
}

$result = $conn->fetchAll($sql);
$conn->commit();

return array('datos' => $result);

}

public function listarproductos($params){
    
    $conn = Zend_Registry::get('conexion');
    $start = ($params['start']) ? $params['start'] : 0;
    $limit = ($params['limit']) ? $params['limit'] : 30;
    $sql ='';
  
        $sql = " SELECT i.numeropieza as codigoproveedor, i.codigo as codigo, i.denominacion as text, tp.cantidad, i.idumedida, 
                    um.abreviaturaunidadmedida as umedida, i.idindicador
                    FROM mod_logistica.dat_documento doc 
                LEFT JOIN mod_logistica.dat_movimiento tp ON tp.iddocumento = doc.iddocumento
                LEFT JOIN mod_logistica.dat_producto dp ON dp.idproducto = tp.idproducto
                LEFT JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador 
                LEFT JOIN mod_datosmaestros.nom_unidadmedida um on um.idunidadmedida = i.idumedida
                where doc.iddocumento = '{$params['iddocumento']}' "
        ;
    $result = $conn->fetchAll($sql);
    
return array('datos' => $result);
}

}
