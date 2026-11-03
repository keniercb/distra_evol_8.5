<?php

class EstadiaModel extends ZendExt_Model
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
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 30;
        $params['cliente'] =  ($params['cliente']) ? $params['cliente'] : 'null';
        $params['sector'] = ($params['sector']) ? $params['sector']: 'null';
        $params['idestructura'] = $this->global->Estructura->idestructura;
        if($params['nombre']){
            $client = "select dmc.idcliente
            from mod_logistica.dat_documentocliente dmc
            inner join mod_datosmaestros.nom_clientesproveedor nmc on nmc.idclientesproveedores = dmc.idcliente
            where nmc.nombre LIKE ('{$params['nombre']}') limit 1";
            $ressclient = $conn->fetchAll($client);
            $params['cliente'] =$ressclient[0]['idcliente'];
        }
        //print_r($params);die;
        if($params['fechainicio'] && !$params['fechafin']){
            $consulta = " select * from mod_logtaller.f_getestadia ({$params['tiporeporte']},'{$params['fechainicio']}',null,{$params['sector']},
        {$params['cliente']},{$params['idestructura']},{$params['start']},{$params['limit']} ) ";
        }else if (!$params['fechainicio'] && $params['fechafin']){
            $consulta = " select * from mod_logtaller.f_getestadia ({$params['tiporeporte']},null,'{$params['fechafin']}',{$params['sector']},
            {$params['cliente']},{$params['idestructura']},{$params['start']},{$params['limit']} ) ";
        }else if ($params['fechainicio'] && $params['fechafin']){
            $consulta = " select * from mod_logtaller.f_getestadia ({$params['tiporeporte']},'{$params['fechainicio']}','{$params['fechafin']}',{$params['sector']},
        {$params['cliente']},{$params['idestructura']},{$params['start']},{$params['limit']} ) ";
        }else{
            $consulta = " select * from mod_logtaller.f_getestadia ({$params['tiporeporte']},null,null,{$params['sector']},
        {$params['cliente']},{$params['idestructura']},{$params['start']},{$params['limit']} ) ";
        }
        
        
        $result = $conn->fetchAll($consulta);
        
        return array('datos' => $result, 'cantidad' => $result[0]['cantidad'] , 'promedio' => $result[0]['promedio']);
    }
}