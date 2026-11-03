<?php

class MercanciaTransitoModel extends ZendExt_Model
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

    public function getDatosMercancias($params){
        $fechainicio= ($params['fechainicio']) ? "'".$params['fechainicio']."'" : "null";
        $fechafin= ($params['fechafin']) ? "'".$params['fechafin']."'" : "null";
        $start = ($params['start']) ? $params['start'] : 0;
        $limit = ($params['limit']) ? $params['limit'] : 30;
        $diferencia = $params['chbDiff'];
        //print_r($params);die;
        $arrCondicion = [];
        $where = '';
        if ($params['distpadre']) {
            $arrCondicion[] = "distpadre = {$params['distpadre']}";
        }
        if (count($arrCondicion) > 0) {
            $where = 'where ' . implode(' and ' ,$arrCondicion);
        }
        if($params['permiso'] == 1 ){//"'{".$strdepositos."}'";
            $estructuradest = ($params['estructuradest']) ? "'{".$params['estructuradest']."}'" : 'null';
            $estructuraorig = ($params['estructuraorigen']) ? "'{" . $params['estructuraorigen'] . "}'": 'null';
            $deposito = ($params['deposito']) ? "'{".$params['deposito']."}'" : 'null';
            if ($deposito != 'null' ) {
                $sql = "select *, count(1) over() as cantidad
                from mod_loginventario.f_mercanciatransito ({$deposito},{$estructuraorig},{$fechainicio},{$fechafin},{$start},{$limit},{$diferencia})
                $where
                ";
            }else {
                $sql = "select *, count(1) over() as cantidad
                from mod_loginventario.f_mercanciatransito ({$estructuradest},{$estructuraorig},{$fechainicio},{$fechafin},{$start},{$limit},{$diferencia})
               $where
            ";
            }
            $conn = Zend_Registry::get('conexion');
            $result = $conn->fetchAll($sql);
            return array('datos' => $result, 'cantidad' => $result[0]['total']);
        }else if ($params['permiso'] == 2 ){
            $estructuradest =("'{".$this->global->Estructura->idestructura."}'");
            $deposito = ($params['deposito']) ? "'{".$params['deposito']."}'" : 'null';
            $estructuraorig =  ($params['estructuradest']) ?  "'{".$params['estructuradest']."}'" : 'null';
            if ($deposito != 'null' ) {
                $sql = "select *, count(1) over() as cantidad
                from mod_loginventario.f_mercanciatransito ({$deposito},{$estructuraorig},{$fechainicio},{$fechafin},{$start},{$limit},{$diferencia})
                $where
                ";
            }else {
                $sql = "select *, count(1) over() as cantidad
                from mod_loginventario.f_mercanciatransito ({$estructuradest},{$estructuraorig},{$fechainicio},{$fechafin},{$start},{$limit},{$diferencia})
                $where
            ";
            }
           
                
            $conn = Zend_Registry::get('conexion');
            $result = $conn->fetchAll($sql);
            return array('datos' => $result, 'cantidad' => $result[0]['total']);
        }else if($params['permiso'] == 3 ){
            $estructuradest = ($params['estructuradest']) ?  "'{".$params['estructuradest']."}'"  : 'null';
            $estructuraorig = ("'{".$this->global->Estructura->idestructura."}'");
            $deposito = ($params['deposito']) ? "'{".$params['deposito']."}'" : 'null';
            if ($deposito != 'null' ) {
                $sql = "select *, count(1) over() as cantidad
                from mod_loginventario.f_mercanciatransito ({$deposito},{$estructuraorig},{$fechainicio},{$fechafin},{$start},{$limit},{$diferencia})
                $where
                ";
            }else {
                $sql = "select *, count(1) over() as cantidad
                from mod_loginventario.f_mercanciatransito ({$estructuradest},{$estructuraorig},{$fechainicio},{$fechafin},{$start},{$limit},{$diferencia})
               $where
            ";
            }
            $conn = Zend_Registry::get('conexion');
            $result = $conn->fetchAll($sql);
            return array('datos' => $result, 'cantidad' => $result[0]['total']);
        }
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
    public function getcargardistribucionpadre($params) {
        //print_r("hola");die;
        $sql ="select distpadre 
         from mod_loginventario.f_mercanciatransito (null,null,null,null,null,null,null)
          ";
        $conn = Zend_Registry::get('conexion');
        $result = $conn->fetchAll($sql);
        return array('datos' => $result);


    }   

    

}
