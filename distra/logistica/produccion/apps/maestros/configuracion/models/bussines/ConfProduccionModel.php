<?php

/**
 * Created by PhpStorm.
 * User: Adrian
 * Date: 09-Oct-19
 * Time: 2:43 PM
 */
class ConfProduccionModel extends BaseModel
{
    protected  $idestructura, $_serviciosEstructuraComposicion;

    public function __construct() {
        //$classEstructura = 'Estructura';
        parent::__construct();
        $this->idestructura = $this->global->Estructura->idestructura;
        $this->_serviciosEstructuraComposicion = ServiciosEstructuraComposicionHelper::__init();
    }

    public function getDepositos($params) {
        $tipoalmacen = $params['tipoalmacen'];
        if(!$tipoalmacen)
            die('error al pasar el tipo de almacen 1=>MPM 2=>PT');
        $start = 0;
        $limit = 20;
        if($params['start'] >= 0 && $params['limit'] >= 0 ){
            $start = $params['start'];
            $limit = $params['limit'];
        }
        $sql = "select cfgalm.idalmacen,
                        cfgalm.idconfalmacen,
                        cfgalm.identidad,
                        v_est.codigo,
                        v_est.denominacion
              from mod_logproduccion.conf_almacenes cfgalm
              inner join mod_estructuracomp.v_dametodasestructuras v_est on v_est.idestructura = cfgalm.idalmacen
              where cfgalm.identidad = {$this->idestructura} ";


        if($tipoalmacen == 1){
            $sql.= " and cfgalm.almacenmpm = 1 ";
        }else if($tipoalmacen == 2){
            $sql.= " and cfgalm.almacenpt = 1 ";
        }

        $sql .= " offset {$start} limit {$limit} ";

        $conn = Zend_Registry::get('conexion');
        $almacenes = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

        //print_r($almacenes);die;

        return $almacenes;
    }

    public function getAllDepositos($params) {

        $start = 0;
        $limit = 20;
        if($params['start'] >= 0 && $params['limit'] >= 0 ){
            $start = $params['start'];
            $limit = $params['limit'];
        }

        $logistEstrucUbica = LogisticaEstructuraUbicHelper::__init();

        $filtro = null;
        if($params['filtrado'] == 1){
            $filtro = $params['criterio'];
        }

        $depositos = $logistEstrucUbica->cargardepositos(null,null,$filtro,$limit,$start,-1);
        $depositos = $depositos['depositos'];
        $conn = Zend_Registry::get('conexion');
        foreach ($depositos as &$dep){
            $sql = "SELECT
                      cfgalm.almacenmpm,
                      cfgalm.almacenpt
                    FROM mod_logproduccion.conf_almacenes cfgalm
                    WHERE cfgalm.idalmacen = {$dep['iddeposito']}
            ";
            $almConf = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
            $dep['materias'] = $almConf[0]['almacenmpm'] == 1 ? 1 : 0;
            $dep['produccion'] = $almConf[0]['almacenpt'] == 1 ? 1 : 0;
        }

        return $depositos;
    }

    public function addTodosDepositos($params) {
        $iddeposito = $params['idalmacen'];
        $idestructura = $this->idestructura;
        $tipoalmacen = $params['tipoalmacen'];

        $prodCfg = new ConfProdAlmacenes();
        $prodCfg->idalmacen = $iddeposito;
        $prodCfg->identidad = $idestructura;
        $prodCfg->tipoalmacen = $tipoalmacen;
        $prodCfg->save();
    }

    public function delconfdepositos($almaceneMPM, $almacenesPT) {

        $conn = Zend_Registry::get('conexion');
        if(count($almaceneMPM) > 0){
            $ids = implode(',', $almaceneMPM);
            $sql = "UPDATE mod_logproduccion.conf_almacenes 
                    SET
                      almacenmpm = 0
                    WHERE idconfalmacen IN ($ids)";
            $conn->execute($sql);
        }

        if(count($almacenesPT) > 0){
            $ids = implode(',', $almacenesPT);
            $sql = "UPDATE mod_logproduccion.conf_almacenes 
                    SET
                      almacenpt = 0
                    WHERE idconfalmacen IN ($ids)";
            $conn->execute($sql);
        }

        $idsEliminar = implode(',', array_merge($almaceneMPM, $almacenesPT));

        $sql = "DELETE FROM mod_logproduccion.conf_almacenes cfgalm 
                WHERE cfgalm.idconfalmacen IN ({$idsEliminar}) 
                      AND cfgalm.almacenpt = 0 AND cfgalm.almacenmpm = 0";
        $conn->execute($sql);
    }

    public function gestionarConfDepostiso($accionesEnDepostitos){


        $conn = Zend_Registry::get('conexion');
        $idseliminar = [];
        $valuesInsert = [];

        foreach ($accionesEnDepostitos as $depostito){
            if($depostito->materias == 0 && $depostito->produccion == 0){
                array_push($idseliminar, $depostito->idalmacen);
            }else{
                if($depostito->isNew == 1){
                    array_push($valuesInsert, "({$this->idestructura}, {$depostito->idalmacen}, {$depostito->materias}, {$depostito->produccion})");
                }else{
                    $sqlUpdate = "UPDATE mod_logproduccion.conf_almacenes 
                            SET
                              almacenmpm = {$depostito->materias},
                              almacenpt = {$depostito->produccion}
                            WHERE idalmacen = {$depostito->idalmacen}";
                    $conn->execute($sqlUpdate);
                }
            }
        }

        if(count($valuesInsert) > 0){
            $sqlValues = implode(',', $valuesInsert);
            $sqlInsert = "INSERT INTO mod_logproduccion.conf_almacenes (
                          identidad,
                          idalmacen,                          
                          almacenmpm,
                          almacenpt
                        ) VALUES {$sqlValues} ;";
            $conn->execute($sqlInsert);
        }

        if(count($idseliminar) > 0){
            $ids = implode(',', $idseliminar);
            $sqlDelete ="DELETE FROM mod_logproduccion.conf_almacenes confalm where confalm.idalmacen IN ($ids)";
            $conn->execute($sqlDelete);
        }
    }


    public function addEquipos($idsregistros){

        if(count($idsregistros) > 0){
            $idestructura = $this->idestructura;
            $valuesInsert = [];
            foreach ($idsregistros as $idregistro){
                array_push($valuesInsert, "( {$idestructura} , {$idregistro})");
                $sqlinsert = implode(',', "");
            }
            $sqlValues = implode(',', $valuesInsert);
            $conn = Zend_Registry::get('conexion');
            $sql = "INSERT INTO mod_logproduccion.conf_equipos (identidad, idregnumerico)
                VALUES {$sqlValues} 
                ";
            $conn->execute($sql);
        }
    }

    public function getEquiposConfigurados($params){
        $start = 0;
        $limit = 20;
        if($params['start'] >= 0 && $params['limit'] >= 0 ){
            $start = $params['start'];
            $limit = $params['limit'];
        }
        $sql = "SELECT 
                  i.codigo,
                  i.denominacion,
                  rna.nroinventario,
                  rn.idregnumerico,
                  (CASE WHEN (rna.idestadoperacion IN (0,7,6) OR dp.idestructura <> $this->idestructura) THEN 'rojo' ELSE 'verde' END) as color 
                FROM mod_logproduccion.conf_equipos cfgeq
                INNER JOIN mod_logactivofijotangible.dat_registronumerico rn on rn.idregnumerico = cfgeq.idregnumerico
                INNER JOIN mod_logactivofijotangible.dat_regnumericoactivo rna on rna.idregnumerico = rn.idregnumerico
                INNER JOIN mod_logistica.dat_producto dp on dp.idproducto = rn.idproducto
                INNER JOIN mod_datosmaestros.nom_indicador i on i.idindicador = dp.idindicador
                WHERE cfgeq.identidad = {$this->idestructura}
        ";

        $sql .= " offset {$start} limit {$limit} ";
        $conn = Zend_Registry::get('conexion');
        $equipos = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        return $equipos;
    }

    public function deleteEquipos($idregistros){
        if(count($idregistros) > 0) {
            $conn = Zend_Registry::get('conexion');
            $ids = implode(',', $idregistros);
            $sql = "DELETE FROM mod_logproduccion.conf_equipos cfg WHERE cfg.idregnumerico IN ({$ids})";
            $conn->execute($sql);
        }
    }

    public function cargaractividades($params){

        if($params['start'] >= 0 && $params['limit'] >= 0 ){
            $start = $params['start'];
            $limit = $params['limit'];
        }
       
        $sql = "SELECT cacc.idcartatecindustrial, concat(ni.denominacion, ' - ' , dcti.descripcion) as denominacionindicador,
                ni.denominacion as denominacion,
                ni.idindicador as idindicadorsalida,
                MAX(cacc.idactcentrocosto) as idactcentrocosto,
                nu.idunidadmedida as idumedida, cacc.idcentrogrupo as idcentrocosto
                FROM mod_logproduccion.conf_actividadcentrocosto cacc
                INNER JOIN mod_planifindustrial.dat_cartatecindustrial dcti on dcti.idcartatecindustrial = cacc.idcartatecindustrial
                INNER JOIN mod_datosmaestros.nom_indicador ni on ni.idindicador = dcti.idindicadorsalida
                INNER JOIN mod_estructuracomp.dat_estructuraop op on op.idestructuraop = cacc.idalmacen
                LEFT JOIN mod_datosmaestros.nom_unidadmedida nu ON nu.idunidadmedida = ni.idumedida
                WHERE cacc.identidad = {$this->idestructura}
                
              ";
        if ($params['criterio']) {
            $sql .= " AND ( ni.denominacion ilike '%{$params['criterio']}%'
                      OR  dcti.descripcion ilike '%{$params['criterio']}%') ";
        }

       // $sql .= " offset {$start} limit {$limit} ";
        $conn = Zend_Registry::get('conexion');
        $actividades = $conn->execute("$sql group by ni.idindicador,cacc.idcartatecindustrial, ni.denominacion, dcti.descripcion,nu.idunidadmedida, cacc.idcentrogrupo ORDER BY idactcentrocosto desc ")->fetchAll(PDO::FETCH_ASSOC);
 /*cacc.idactcentrocosto, cacc.idcartatecindustrial as idcartatecindustrial, cacc.idcentrogrupo as idcentrocosto, cacc.idalmacen as idarea,*/
// concat(ni.denominacion, ' - ' , dcti.descripcion) as denominacionindicador/*, op.denominacion as text*/
        foreach ($actividades as &$act) {
           $centro = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
            $this->idestructura, $params['start'], $params['limit'], null, array($act['idcentrocosto']));
$act['centrocosto'] = $centro[0]->descripcioncentrogrupo;
        }
      
        return $actividades;
    }

public function deleteActividad($idcartatecindustrial){
        $conn = Zend_Registry::get('conexion');
        $flag = false;
       $sql = "SELECT *
       FROM  mod_logproduccion.dat_ordenproduccion dop
       INNER JOIN mod_logistica.dat_documento dd on dd.iddocumento = dop.idordenproduccion
       WHERE dop.idcartatecnologica  =  {$idcartatecindustrial[0]} and dd.idestructuracomun = {$this->idestructura} ";
       $result = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
       if (empty($result))  {
                $sql = "DELETE FROM mod_logproduccion.conf_actividadcentrocosto cac WHERE cac.idcartatecindustrial = {$idcartatecindustrial[0]}  and cac.identidad = {$this->idestructura} ";
                $conn->execute($sql);
                $flag = true;
                return  $flag;
            }else {
                return $flag;
            }
            
    
      
    
}

    public function addActividad($params){
       // print_r($params);die;
        $idindicadores = json_decode($params['idindicadores']);
        $arrayids = json_decode($params['idactividad']);
        $arraymodificados = json_decode($params['modificados']);
        $collactividadcentrocosto = new Doctrine_Collection('ConfActividadCentroCosto');
        //$arrayDatos = array();
        if(count($arrayids) > 0) {
            $idestructura = $this->idestructura;
            foreach ($arrayids as $ids) { 
                $actividadcentrocosto = new ConfActividadCentroCosto();
               // print_r(array($params['idcartatecindustrial'], $ids->idcartatecindustrialactividad, $this->idestructura));die;
                if(!$actividadcentrocosto->existeActividad($params['idcartatecindustrial'], $ids->idcartatecindustrialactividad, $this->idestructura)){
                    $actividadcentrocosto->identidad = $this->idestructura;
                    $actividadcentrocosto->idcartatecindustrial = $params['idcartatecindustrial'];
                    $actividadcentrocosto->idcentrogrupo = $params['idcentrocosto'];
                    $actividadcentrocosto->idalmacen = $params['idarea'];
                    $actividadcentrocosto->idcartatecindustrialactividad = $ids->idcartatecindustrialactividad;
                    $collactividadcentrocosto->add($actividadcentrocosto);
                }else{
                    $datosConf = Doctrine::getTable('ConfActividadCentroCosto')->findByDql('idcartatecindustrial = ? and idcartatecindustrialactividad = ? and identidad = ?', array($params['idcartatecindustrial'], $ids->idcartatecindustrialactividad, $this->idestructura));
                    if ($datosConf) {
                       // print_r($datosConf);die;
                        foreach ($datosConf as $dat) {
                            if ($dat->idcartatecindustrialactividad == $ids->idcartatecindustrialactividad) {
                                $dat->idalmacen = is_numeric($params['idarea']) ? $params['idarea'] : $dat->idalmacen;
                                $dat->idcentrogrupo =  is_numeric($params['idcentrocosto']) ? $params['idcentrocosto'] : $dat->idcentrogrupo;
                            } 
                            $dat->save();     
                        }
                    }     
                } 
            }
            
            if ($collactividadcentrocosto->count()) {
                $collactividadcentrocosto->save();
            }
        }
        
        if(count($idindicadores) > 0) {   
            $valuesInsert = [];
            $conn = Zend_Registry::get('conexion');
            foreach ($idindicadores as $idind){  
                array_push($valuesInsert, "({$this->idestructura}, {$params['idcartatecindustrial']}, {$idind->idindicadores}, {$idind->precio})");                                 
            }
            if (count($valuesInsert) > 0) {
                $sqlValues = implode(',', $valuesInsert);     
                $sql = "INSERT INTO mod_logproduccion.dat_precioporindicador (identidad, idcartatecindustrial, idindicador, precio) VALUES {$sqlValues}"; 
                $conn->execute($sql);  
            }                   
        }

        if (count($arraymodificados) > 0) {
            $conn1 = Zend_Registry::get('conexion');
            foreach ($arraymodificados as $mod) { 
                if ($mod->idprecioporindicador != null) {
                    $sqlp = "UPDATE mod_logproduccion.dat_precioporindicador
                    SET precio = $mod->precio
                    WHERE idprecioporindicador = $mod->idprecioporindicador"; 
                    $conn1->execute($sqlp); 
                }    
            }                           
        }  
       
        return $collactividadcentrocosto->toArray();
    }

    public function listarActividadesCartatecnologica($params){
       /* $start = 0;
        $limit = 20;*/
        if($params['start'] >= 0 && $params['limit'] >= 0 ){
            $start = $params['start'];
            $limit = $params['limit'];
        }
        if ($params['idcartatecindustrial']) {
            $sql = "SELECT DISTINCT
            ctiact.idcartatecindustrialactividad as idcartatecindustrialactividad,
            act.denominacion as denominacion,
            op.denominacion as area,
            cacc.idcentrogrupo as idcentrocosto,
            cacc.idcartatecindustrial as idcartatecindustrial
            /*ctiact.idactividad as idactividad*/
          FROM 
            mod_planifindustrial.dat_cartatecindustrialactividad ctiact
            INNER JOIN mod_planificacion.nom_actividad act ON (act.idactividad = ctiact.idactividad)  
            LEFT JOIN mod_logproduccion.conf_actividadcentrocosto cacc ON cacc.idcartatecindustrialactividad = ctiact.idcartatecindustrialactividad AND cacc.identidad = {$this->idestructura}
            LEFT JOIN mod_estructuracomp.dat_estructuraop op on op.idestructuraop = cacc.idalmacen
            WHERE ctiact.idcartatecindustrial = {$params['idcartatecindustrial']} 
            Order by  ctiact.idcartatecindustrialactividad desc ";
   /*and cacc.identidad = {$this->idestructura}*/
            $conn = Zend_Registry::get('conexion');
            $actividades = $conn->execute($sql)->fetchAll(PDO::FETCH_ASSOC);
        }

        foreach ($actividades as &$act) {
           if($act['idcentrocosto']){            
$centro = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
             $this->idestructura, $params['start'], $params['limit'], null, array($act['idcentrocosto']));
             $act['centrocosto'] = $centro[0]->descripcioncentrogrupo;
         }
}  

        return $actividades;
     }

     public function listarIndicadores($params){
        $query = " ";
        $idactividades = array();
        foreach($params['arrayActividad'] as $p) {
            $idactividades[] = $p;
        }
            $idactividad = implode(',', $idactividades);
            $query = " SELECT n.idindicador,
            ind.codigo,
            ind.denominacion,
            um.denominacionunidadmedida as um,
            pxi.idprecioporindicador,
            COALESCE(sum(n.necesidad), 0.00) as norma,
            CASE
              WHEN pxi.idprecioporindicador IS NULL THEN COALESCE(ind.precio, 0.000000)
              ELSE COALESCE(pxi.precio, 0.000000)
            END as precio,
            CASE
              WHEN pxi.idprecioporindicador IS NULL THEN COALESCE(ind.precio * COALESCE(sum(n.necesidad), 0.00), 0.000000)
              ELSE COALESCE(pxi.precio * COALESCE(sum(n.necesidad), 0.00), 0.000000)
            END as importe
     FROM mod_planificacion.dat_norma n
          INNER JOIN mod_planifindustrial.dat_cartatecindustrialactividad ca ON (ca.idactividad = n.idactividad)
          INNER JOIN mod_datosmaestros.nom_indicador ind ON (ind.idindicador = n.idindicador)
          INNER JOIN mod_datosmaestros.nom_unidadmedida um ON (um.idunidadmedida = ind.idumedida)
          LEFT JOIN mod_logproduccion.dat_precioporindicador pxi ON (pxi.idcartatecindustrial = ca.idcartatecindustrial AND pxi.idindicador = n.idindicador
            )
     WHERE n.idejercicio =
           (
             SELECT idejercicio
             FROM mod_planificacion.nom_ejercicioplanificacion
             WHERE actual = 1
           ) AND
           ca.idcartatecindustrialactividad IN ({$idactividad})
     GROUP BY n.idindicador,
              ind.codigo,
              ind.denominacion,
              um.denominacionunidadmedida,
              pxi.idprecioporindicador,
              ind.precio
     ORDER BY ind.codigo,
              ind.denominacion";
       
      $conn = Zend_Registry::get('conexion');
             $indicadores = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
             return $indicadores;
   
    }
 
    public function cargarAreas($params = array()){
       
        $datos = $this->getAreasResponsabilidad($params);
        return $datos;
    }

    public function getAreasResponsabilidad($params) {
        
        /*$sql = "select 
                f.idfila as iddeposito,
                f.idfila as id,
                op.denominacion as deposito,
                op.codigo as codigo,
                op.denominacion as text,
                (select 
                case
                        when 
                                (select count(fest.idfila) from mod_estructuracomp.nom_filaestruc fest where fest.parent_path OPERATOR(public.<@) f.parent_path) > 0
                    then 0 else 1 end) as leaf,
                '' as denestado,
                null as estado,
                '' as color
                from mod_estructuracomp.nom_filaestruc f
                left join mod_estructuracomp.dat_estructuraop op on op.idestructuraop = f.idfila
                where 
                        f.parent_path OPERATOR(public.<@) (
                      select fe1.parent_path
                      from mod_estructuracomp.nom_filaestruc fe1
                      WHERE fe1.idfila = {$this->idestructura}
                    )    
                    AND	
                    f.idfila not in(
                        select nomfila.idfila 
                        from mod_estructuracomp.nom_filaestruc nomfila
                        where nomfila.parent_path OPERATOR(public.<@)
                        
                        (   
                            select array_agg(fe.parent_path)
                            from mod_estructuracomp.nom_filaestruc fe
                            left join mod_estructuracomp.dat_estructuraop eop on fe.idfila = eop.idestructuraop            
                            where eop.idorgano = -2 and eop.idconcepto = 5
                            and fe.idfila <> {$this->idestructura}
                            and fe.parent_path OPERATOR(public.<@) (
                                select fe2.parent_path from mod_estructuracomp.nom_filaestruc fe2
                                where fe2.idfila = {$this->idestructura}
                            )
                        )
                        UNION select {$this->idestructura}
                    )
                    AND f.fechafin is null
                    AND op.idproyecto = 0
                    AND f.idconcepto = 5    
                        and (op.idconcepto=5 OR op.idconcepto=8)";

        $conn = Zend_Registry::get('conexion');
        
        $respdata = $conn->execute("$sql ORDER BY op.denominacion");
        return $respdata->fetchAll(PDO::FETCH_ASSOC);*/

        $subd = $this->_serviciosEstructuraComposicion->obtenerSubordinaciones(
            "ATall", $params['limit'], $params['start']
        );
        
        
        $params['idnomsubordinacion'] = $subd[0]['idnomsubordinacion'];
        $depositos = $this->_serviciosEstructuraComposicion->buscarHijoPorSubordinacion(
            $this->global->Estructura->idestructura,$subd[0]['idnomsubordinacion'] //array($params['idnomsubordinacion'])
            , null
        );
      //  print_r($depositos);die;
        return $depositos;
    }
}
