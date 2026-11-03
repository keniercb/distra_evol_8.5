<?php

class ActividadModel extends ZendExt_Model
{
    private $_actividad;
    private $_prioridad;
    private $_canal;
    private $_clientemodel;
    private $_datosmaestros;
    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_actividad = new DatActividad();
        $this->_prioridad = new NomPrioridad();
        $this->_canal = new NomCanal();
        $this->_clientemodel = new ClienteModel();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();

    }

    public function actinsert($params){
        if($params->idactividad){
            $actividad = Doctrine::getTable('DatActividad')->find($params->idactividad);
        }else{
            $actividad = new DatActividad();
        }
        $actividad->presupuesto = $params->presupuesto;
        $actividad->denominacion = $params->denominacion;
        $actividad->fechainicio = $params->fechainicio;
        $actividad->fechafin = $params->fechafin;
        $actividad->descripcion = $params->descripcion;
        $actividad->idcampanna = $params->idcampanna;
        $actividad->idprioridad = $params->idprioridad;
        $actividad->idcanal = $params->idcanal;

        $actividad->save();

        $idactividad = $actividad->idactividad;
        if ($idactividad) {
            $clientes = $params->clienteseliminados;
            if ($clientes) {
                $this->_clientemodel->delete($clientes,0);
            }
            $clientes = $params->clientesmodificados;
            foreach ($clientes as $cliente) {
                $this->_clientemodel->insert($cliente, $idactividad ,0);
            }
        }
        return 1;
    }

    public function actdelete($params){
        try{
            foreach($params as $idactividad){
                $actividad = Doctrine::getTable('DatActividad')->find($idactividad);
                if($actividad){
                    $actividad->delete();
                }
            }
            return 1;
        }catch (Doctrine_Exception $e){
            throw $e;
        }
    }

    public function getPrioridad($params){
        return $this->_prioridad->getPrioridad($params);
    }

    public function getCanal($params){
        return $this->_canal->getCanal($params);
    }

    public function getCliente($params){
        $filtro = array();
        if ($params['filtro']) {
            $temp = json_decode($params['filtro']);
            foreach ($temp as $key => $value) {
                $filtro[$key] = $value;
            }
        }
        $result = $this->_datosmaestros->getClientes($filtro, $params['start'], $params['limit']);
        return $result;
    }

    public function getActividad($params)
    {
        $result = $this->_actividad->getActividad($params);
        foreach($result['data'] as $key=>$value){
            foreach($value['DatClienteActividad'] as $index=>$row){
                $clienteproveedor = $this->_datosmaestros->getClienteById($row['idclientesproveedores'])['datos'][0];
                $result['data'][$key]['DatClienteActividad'][$index]['nombre'] = $clienteproveedor['nombre'];
                $result['data'][$key]['DatClienteActividad'][$index]['idclasificacion'] = $clienteproveedor['idclasificacion'];
            }
        }
        return $result;
    }
}