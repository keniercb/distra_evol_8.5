<?php

class ClienteModel extends ZendExt_Model
{
    private $_clienteoportunidad;
    private $_clienteactividad;
    private $_datosmaestros;

    /**
     * Constructor de la clase
     */
    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_clienteoportunidad = new DatClienteOportunidad();
        $this->_clienteactividad = new DatClienteActividad();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
    }

    public function insert($params, $id,$esOportunidad = 1)
    {
        try {
            if($esOportunidad){
                $cliente = new DatClienteOportunidad();
                $cliente->idoportunidad = $id;
            }else{
                $cliente = new DatClienteActividad();
                $cliente->idactividad = $id;
            }
            $cliente->idclientesproveedores = $params->idclientesproveedores;

            $cliente->save();
            return 1;
        } catch (Exception $e) {
            throw $e;
        }

    }

    public function delete($clientes,$esOportunidad = 1)
    {
        try {
            foreach ($clientes as $idcliente) {
                if($esOportunidad){
                    $cliente = Doctrine::getTable('DatClienteOportunidad')->find($idcliente);
                }else{
                    $cliente = Doctrine::getTable('DatClienteActividad')->find($idcliente);
                }
                if($cliente){
                    $cliente->delete();
                }
            }
            return 1;
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function getClientes($params,$esOportunidad = 1)
    {
        if($esOportunidad){
            $result = $this->_clienteoportunidad->getClienteOportunidad($params);
        }else{
            $result = $this->_clienteactividad->getClienteActividad($params);
        }
        foreach($result['data'] as $key =>$value){
            $clienteproveedor = $this->_datosmaestros->getClienteById($value['idclientesproveedores'])['datos'][0];
            $result['data'][$key]['nombre'] = $clienteproveedor['nombre'];
            $result['data'][$key]['idclasificacion'] = $clienteproveedor['idclasificacion'];
        }
        return $result;
    }
}