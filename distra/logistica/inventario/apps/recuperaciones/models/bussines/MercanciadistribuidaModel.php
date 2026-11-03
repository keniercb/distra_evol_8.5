<?php

class MercanciadistribuidaModel extends ZendExt_Model
{
    private $_serviciosConfiguracionGeneral;

    public function __construct()
    {
        parent::__construct();
        $this->_serviciosConfiguracionGeneral = ServiciosConfiguracionGeneralHelper::__init();
    }
    public function getEstructuras() {
        $estructuras = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras();
        return array('datos'=>$estructuras, 'cantidad'=>count($estructuras));
    }
   
    public function cargarmercanciadistribuida($params)
    {
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        $estructurasorigen =($params['estructuraori']) ?  $params['estructuraori'] : 'null'; 
        $estructurasdestino = ($params['estructuradest']) ? $params['estructuradest'] : 'null';
        $finicio = ($params['finicio']) ? "'" . $params['finicio'] . "'" : 'null';//asi se pone cuando hay numero
        $fin = ($params['fin']) ?  "'" . $params['fin']  . "'" : 'null';
        $deposito = ($params['iddeposito']) ? $params['iddeposito'] : 'null';
        $estadomercancia = ($params['estado']) ? $params['estado'] : 'null';
        $estadoejecucion = ($params['estadoejecucion']) ? $params['estadoejecucion'] : 'null';
        //print_r($params);die;
        $arrCondicion = [];
        $where = '';

        if ($params['naturaleza']) {
            $arrCondicion[] = "idnaturaleza = {$params['naturaleza']}";
        }
        if ($params['deposito']) {
            $arrCondicion[] = "id_estructura_deposito = {$params['deposito']}";
        }
        if ($params['num_distrib']) {
            $arrCondicion[] = "num_distrib = {$params['num_distrib']}";
        }
        if ($params['estadoejecucion']) {
            $arrCondicion[] = "estadoejecucion = {$params['estadoejecucion']}";
        }

        if (count($arrCondicion) > 0) {
            $where = 'where ' . implode(' and ' ,$arrCondicion);
        }


        $sql =  "select *, count(*) over() as cantidad
            from (with cumplimiento as (
                select dpo.idorden, COALESCE(count(dpo.idprodorden), 0) as cantidad
                from mod_logdistribucion.dat_prodorden dpo
                join mod_logdistribucion.dat_prodordencmpto dpoc ON dpoc.idprodorden = dpo.idprodorden
                where dpoc.pendiente = dpo.cantidad
                group by dpo.idorden
            ),
            clientes as (
                select dpo.idorden, COALESCE(count(dpo.idprodorden), 0) as cantidad
                from mod_logdistribucion.dat_prodorden dpo
                group by dpo.idorden
            ),
            cumplimiento2 as (
                select dpo.idorden, COALESCE(count(dpo.idprodorden), 0) as cantidad
                from mod_logdistribucion.dat_prodorden dpo
                join mod_logdistribucion.dat_prodordencmpto dpoc ON dpoc.idprodorden = dpo.idprodorden
                where dpoc.entregado = dpo.cantidad
                group by dpo.idorden
            )
            select fmd.*,
            case 
            when fmd.idestado < 3 then 1
            when cu2.cantidad = cli.cantidad then 3 
            when cu.cantidad = cli.cantidad then 1
            else 2
            end as estadoejecucion
            from mod_loginventario.f_mercanciadistribuida($estructurasorigen,$estructurasdestino,$deposito,$finicio,$fin,$estadomercancia,$estadoejecucion) fmd
            left join cumplimiento cu on cu.idorden = fmd.iddocumento
            left join clientes cli on cli.idorden = fmd.iddocumento
            left join cumplimiento2 cu2 on cu2.idorden = fmd.iddocumento
            ) a
            
            $where
            order by diferencia DESC
            LIMIT $limit
            OFFSET $start 
        ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result, 'cantidad' => $result[0] ? $result[0]['cantidad'] : 0);
        
    }
    
    public function cargarEstructuras($parametros)
    {
        //$estructuras = ServiciosEstructuraComposicionHelper::__init();
        $parametros['identidad'] = ($parametros['identidad']) ? $parametros['identidad'] : $this->global->Estructura->idestructura;
        $depositos = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructurasNoFormalesPorEntidad($parametros['identidad'], ($parametros['query'])?$parametros['query']:$parametros['criterio']);
        $datos = array();
        foreach ($depositos as $index => $r) {

            $uxiliar = ($r->codigo) ? $r->codigo . '-' : ''; 
            if ($parametros['depositosprod']) {
                $datos[$index]['iddeposito'] = $r->idfila;
            } else {
                $datos[$index]['idestructuraop'] = $r->idfila;
            }
            $datos[$index]['id'] = $r->idfila;
            $datos[$index]['deposito'] = $uxiliar . $r->idfila;
            $datos[$index]['codigo'] = ($r->codigo) ? $r->codigo : '-';
            $datos[$index]['nombre'] = $r->denominacion;
            $datos[$index]['leaf'] = true;
            foreach ($parametros['idseleccionados'] as $idDeposito) {
                if ($r->idfila == $idDeposito) {
                    unset($datos[$index]);
                }
            }
        }
        return array('cantidad' => count($datos), 'datos' => array_values($datos));
    }

    public function getDeposito($params){
        $sql =  "select  id_estructura_deposito, deposito
        from mod_loginventario.f_mercanciadistribuida(null,null,null,null,null,null,null)        
        group by id_estructura_deposito, deposito 
        ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result);

    }

    public function getDocumento($params){
        $sql =  "select   num_distrib
        from mod_loginventario.f_mercanciadistribuida(null,null,null,null,null,null,null)        
         group by num_distrib
        ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result);

    }
    public function getNaturaleza($params){//filtro para la naturaleza
        $sql =  "select idnaturaleza, naturaleza
        from mod_loginventario.f_mercanciadistribuida(null,null,null,null,null,null,null) 
        group by idnaturaleza, naturaleza
        ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result);

    }
    ///ventana ver producto
    public function cargarproductos($params){
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        $numerodocumento = ($params['idDoc']) ? "'" . $params['idDoc'] . "'" : 'null';
        $sql =  "select*, count(*) over() as cantidad
        from mod_loginventario.f_productosmercanciadistribuida($numerodocumento)
        LIMIT $limit
        OFFSET $start 
        ";
        //print_r($sql);die;
       
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result, 'cantidad' => $result[0] ? $result[0]['cantidad'] : 0); 
   
    }
    public function cargarestado($params){
        $sql =  "select * 
        from mod_logistica.dat_documento WHERE estado IN (1,2,3,10)
        order by estado
        ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result);
        
    }

   /* public function cargarestadoejecucion($params){ funcion anterior para cargar los estado
        $sql = "select * 
        from mod_logistica.nom_estado WHERE idestado IN (1,3,5,10)
        order by denominacion
        ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result);
        
        
    }*/
   
      
 }


