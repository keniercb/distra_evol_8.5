<?php

class CuadrediarioModel extends DocumentoLogisticaModel
{

    private $serviciosConfiguracion,$maestroProducto,$configuracionService,$menu,$idestructura,$fechacontable;

    public function __construct($datos = array())
    {
        parent::__construct($datos);
        $this->trazaDocumento = new TrazasDocumentoModel();
        $this->maestroProducto = new MaestroProductoModel();
        $this->menu = new DatMenu();
        $this->idestructura = $this->global->Estructura->idestructura;
        $this->fechacontable = $this->global->FechaContable->fecha;
        
        $relationsP[] = array(
            'cardinalidad' => 'one',
            'relation'     => 'DatMenu',
            'properties'   => array('local' => 'iddocumento', 'foreign' => 'idmenu')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatDocumento(), $relationsP);
        $relationsS[] = array(
            'cardinalidad' => 'one',
            'relation'     => 'DatProductoMenu',
            'properties'   => array('local' => 'idproducto', 'foreign' => 'idproducto')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatProductoLogistica(), $relationsS);
        $relationsC[] = array(
            'cardinalidad' => 'one',
            'relation'     => 'DatActividad',
            'properties'   => array('local' => 'idactividadalimento', 'foreign' => 'idactividadalimento')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new NomActividadalimento(), $relationsC);
        $relationsQ[] = array(
            'cardinalidad' => 'one',
            'relation'     => 'DatProductoReceta',
            'properties'   => array('local' => 'idreceta', 'foreign' => 'idreceta')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatRecetaActividad(), $relationsQ);
        $relationsSe[] = array(
            'cardinalidad' => 'one',
            'relation'     => 'DatRecetaActividad',
            'properties'   => array('local' => 'idreceta', 'foreign' => 'idreceta')
        );
        $this->logisticaDoctrine->tryInyectRelactions(new DatProductoReceta(), $relationsSe);

        $this->serviciosConfiguracion = ServiciosConfiguracionGeneralHelper::__init();
        $this->configuracionService = new ConfiguracioninventarioService();
        $this->estadoModel = new EstadoDocumentoModel();
        $this->trazaDocumento = new TrazasDocumentoModel();
    }
    
    public function cargarCuadresRealizados($parametros)
    {
        $start = ($parametros['start'])?$parametros['start']:0;
        $limit = ($parametros['limit'])?$parametros['limit']:30;
        $fechacontable = "'".$this->fechacontable."'";

        $addWhere = "cf.idestructura = {$this->idestructura}";
        if($parametros['fechaactual']){
            $fecha = "'".$parametros['fechaactual']."'";
            $addWhere .= " and h.fechacierre = {$fecha}";
        }
        if($parametros['iddeposito']){
            $addWhere .= " and h.iddeposito = {$parametros['iddeposito']}";
        }        
        if($parametros['estado'] > 0){
            $addWhere .= " and h.estado =".$parametros['estado'] - 1;
        }
        if($parametros['desde']){
            $addWhere .= " and h.fechacierre > {$parametros['desde']}::date";
        }
        if($parametros['hasta']){
            $addWhere .= " and h.fechacierre <= {$parametros['desde']}::date";
        }
        if($parametros['criterio']){
            $addWhere .= " and (h.saldocont {$parametros['criterio']} h.saldofinal)";
        }

        $sql = "SELECT DISTINCT h.idcierrediario,h.iddeposito,t.codigo||' - '||t.denominacion as deposito,
            h.saldoinicial as importeinicial,h.saldofinal as importefinal,
            h.saldocont as saldocont,round((h.saldofinal - h.saldocont),2) as diferencia,
            h.fechacierre,h.estado,h.fechacierre as fechaactual,h.apertura,
            {$fechacontable} as proxfecha,
            (select fechacierre from mod_logistica.his_cuadrediario where iddeposito = h.iddeposito 
            	and fechacierre < h.fechacierre order by idcierrediario desc limit 1) as fechaultcierre
            FROM mod_logistica.his_cuadrediario h 
            inner join mod_estructuracomp.v_dametodasestructuras t on t.idestructura = h.iddeposito
            inner join mod_logdistribucion.conf_depositocuadrediario cf on cf.iddeposito = h.iddeposito
            where $addWhere
            order by h.idcierrediario desc";
            
        $addStartLimit = " offset {$start} limit {$limit}";        

        $total = count($this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN));

        return array('datos'=>$this->doctrineHelper->getConnection()->execute($sql . $addStartLimit)->fetchAll(PDO::FETCH_ASSOC), 
            'cantidad'=>$total);
    }

    public function cargardepositos($filtro='',$groupby='')
    {
        $start = ($filtro['start'])?$filtro['start']:0;
        $limit = ($filtro['limit'])?$filtro['limit']:30;
        $fechacontable = "'".$this->fechacontable."'";
        if($filtro['idcierrediario'] || $filtro['fechaactual']){
            $idcierrediario = $filtro['idcierrediario'];           

            if($idcierrediario){
                $sql = "select * from mod_logistica.his_cuadreclasificacion 
                where idcierrediario = {$idcierrediario} order by clasificacion";
            }else{
                $fechaactual = "'" . $filtro['fechaactual'] . "'";
                $sql = "select * from mod_logistica.his_cuadreclasificacion ccl
                inner join mod_logistica.his_cuadrediario cd on cd.idcierrediario = ccl.idcierrediario
                where cd.iddeposito = {$filtro['iddeposito']} and cd.fechacierre = {$fechaactual}
                order by clasificacion";
                $otherDatos = $this->cargarCuadresRealizados($filtro);
            }
        
            $addStartLimit = " offset {$start} limit {$limit}";       
            $total = count($this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN));
            $datos = $this->doctrineHelper->getConnection()->execute($sql . $addStartLimit)->fetchAll(PDO::FETCH_ASSOC); 

            return array('cantidad'=>$total,'total'=>$total,'datos'=>$datos, 
                'record'=>($otherDatos['datos'])?$otherDatos['datos'][0]:array());
        }else{
            $sql = "SELECT DISTINCT p.idestructura as iddeposito, COALESCE(e.fecha,f.fecha)::date as fechaactual,
                    max(h.fechacierre::date) as fechaultcierre, 
                    v.codigo, v.denominacion as almacen,
                    {$fechacontable} as proxfecha
                    FROM mod_logistica.dat_producto p 
                    inner join mod_logdistribucion.conf_depositocuadrediario cf on cf.iddeposito = p.idestructura
                    INNER JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura = p.idestructura 
                    left join mod_logistica.dat_estadoalmacen e on e.iddeposito = cf.iddeposito 
                    left join mod_datosmaestros.dat_estructurasubsist sub on sub.idestructuracomun = p.idestructuracomun 
                    and sub.idsubsistema = 10
                    inner join mod_datosmaestros.dat_fecha f on f.idestructurasubsist = sub.idestructurasubsist
                    left join mod_logistica.his_cuadrediario h on h.iddeposito = p.idestructura
                    WHERE p.cronologia > 0 and p.idestructuracomun = {$this->idestructura} 
                    and p.idclasificacioncontable = cf.idclasificacioncontable
                    and p.idestructura not in (select iddeposito from mod_logistica.his_cuadrediario 
                        where fechacierre = COALESCE(e.fecha,f.fecha)::date and estado = 0)
                    --and h.fechacierre <> COALESCE(e.fecha,f.fecha)::date
                    group by p.idestructura, fechaactual,v.codigo, almacen, proxfecha
                    order by almacen";  

            /* $addSelect = $addFiltro = $addAnd = "";
            $iddeposito = ($filtro['iddeposito'])?$filtro['iddeposito']:'NULL';
            $agrupadopor = ($groupby['clasificacion'])?1:3;
            $isapertura = ($filtro['isapertura'])?$filtro['isapertura']:0;
            $sql = "SELECT * FROM mod_loginventario.fn_cuadrediariomov (
                    {$iddeposito},$agrupadopor,0,{$this->idestructura},NULL,NULL,{$isapertura})";    */ 
            
            $datos = $this->doctrineHelper->getConnection()->fetchAll($sql);             
            $total = count($datos);
            return array('cantidad'=>$total,'total'=>$total,'datos'=>$datos);

        }

        
    }

    public function abrirDiaActual($parametros)
    {
        #validar que no se pueda abrir el dia si ya el subsistema esta en otra fecha.
        $estadoAlm = Doctrine::getTable('DatEstadoalmacen')->find($parametros['iddeposito']);
        if($estadoAlm->fecha != $parametros['fechaactual']){
            throw new ZendExt_Exception('LOG_LB_CIERE_011'); 
        }
        $existCierre = Doctrine::getTable('HisCuadrediario')
            ->findByDql('iddeposito = ? and fechacierre = ?', array($parametros['iddeposito'], $parametros['fechaactual']));
        if($existCierre[0]->idcierrediario){
            $existCierre[0]->estado = 0;
            $existCierre[0]->save();
            return array('succes'=>true);
        }
        return array('succes'=>false);
    }

    public function cerrarDiaActual($parametros)
    {
        $cierre = new GestcierreModel();
        $datos = $cierre->cargarDocuPendInv(array('idestructura'=> $parametros['iddeposito']));
        if($datos['cantidad'] > 0){
            throw new ZendExt_Exception('LOG_LB_CIERE_005');
        }
        $datos = $cierre->cargarDocuPendFac(array());
        if($datos['cantidad'] > 0){
            throw new ZendExt_Exception('LOG_LB_CIERE_006');
        } 
        $config = $this->configuracionService->devolverConfiguracion($this->idestructura);
        if($parametros['saldocont'] != $parametros['importefinal'] && $config['cuadrediario'] == 0){
            throw new ZendExt_Exception('LOG_LB_CIERE_007');
        } 
        //print_r($parametros);die;
        $estado = ($parametros['estado'])?$parametros['estado']:0;
        $apertura = ($parametros['apertura'])?1:0;
        $idcierrediario = ($parametros['idcierrediario'])?",{$parametros['idcierrediario']}":NULL;
        $fechaactual = "'" . $parametros['fechaactual'] . "'";
        $sql = "SELECT * FROM mod_loginventario.fn_cuadrediario_apertura({$fechaactual},{$fechaactual},{$estado},
                        {$apertura},{$parametros['iddeposito']} $idcierrediario)";
        $result = $this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        $idcierre = (count($result) ? $result[0]['fn_cuadrediario_apertura'] : null);
        return array('success'=>true, 'idcierrediario' => $idcierre);
    }   

    public function cargarClasificaciones($filtro){
        $total = 0;
        $datos = array();
        if($filtro['iddeposito']){
            $sql = "select ncc.idclasificacioncontable,ncc.denominacion,nc.concatcta as cuenta
            from mod_logdistribucion.conf_depositocuadrediario cf 
            inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idclasificacioncontable = cf.idclasificacioncontable
            inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cf.idcuenta
            where cf.iddeposito = {$filtro['iddeposito']}
            order by ncc.denominacion";
            $datos = $this->doctrineHelper->getConnection()->fetchAll($sql);   
            $total = count($datos);
        }
        return array('cantidad'=>$total,'total'=>$total,'datos'=>$datos);
    }

    public function cargarNaturalezas($filtro){
        $total = 0;
        $datos = array();
        if($filtro['iddeposito']){
            $sql = "select DISTINCT n.idnaturaleza,n.denominacion,n.codigo
            from mod_logdistribucion.conf_depositocuadrediario cf 
            inner join mod_logistica.nom_clasificacioncontable ncc on ncc.idclasificacioncontable = cf.idclasificacioncontable
            inner join mod_logistica.dat_producto p on p.idclasificacioncontable = ncc.idclasificacioncontable
            inner join mod_datosmaestros.nom_indicador ind on ind.idindicador = p.idindicador
            inner join mod_datosmaestros.nom_naturaleza n on n.idnaturaleza = ind.idnaturaleza
            inner join mod_contabilidad.nom_cuenta nc on nc.idcuenta = cf.idcuenta
            where cf.iddeposito = {$filtro['iddeposito']} and p.idestructura = {$filtro['iddeposito']}
            order by n.denominacion";
            $datos = $this->doctrineHelper->getConnection()->fetchAll($sql);   
            $total = count($datos);
        }
        return array('cantidad'=>$total,'total'=>$total,'datos'=>$datos);
    }

    public function eliminarCierreDiario($params){
        $cuadre = Doctrine::getTable('HisCuadrediario')->find($params['idcierrediario']);
        $cuadre->delete();
        return true;
    }

    public function cargarDepositosCerrados($params){
        $start = ($filtro['start'])?$filtro['start']:0;
        $limit = ($filtro['limit'])?$filtro['limit']:30;
    
        $sql = "SELECT DISTINCT h.iddeposito as iddeposito, v.codigo, v.denominacion as almacen
        FROM  mod_logistica.his_cuadrediario h
        left join mod_logdistribucion.conf_depositocuadrediario cf on cf.iddeposito = h.iddeposito
        INNER JOIN mod_estructuracomp.v_dametodasestructuras v ON v.idestructura = cf.iddeposito
        WHERE cf.idestructura = {$this->idestructura} 
        order by almacen";
        $addStartLimit = " offset {$start} limit {$limit}";       
        $total = count($this->doctrineHelper->getConnection()->execute($sql)->fetchAll(PDO::FETCH_COLUMN));
        $datos = $this->doctrineHelper->getConnection()->execute($sql . $addStartLimit)->fetchAll(PDO::FETCH_ASSOC); 
        return array('cantidad'=>$total,'total'=>$total,'datos'=>$datos);
    }

    public function AbrirProximoDia($params){        
        LogisticaFechasHelper::__init()->cerrarDiaDeposito($params['iddeposito']);
        $cierre = Doctrine::getTable('HisCuadrediario')->find($params['idcierrediario']);
        $cierre->estado = $params['estado'];
        $cierre->save();
        return true;
    }

    public function BloquearCierre($params){        
        $cierre = Doctrine::getTable('HisCuadrediario')->find($params['idcierrediario']);
        $cierre->estado = $params['estado'];
        $cierre->save();
        return true;
    }
}
