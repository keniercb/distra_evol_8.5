<?php

class ClientesyproveedoresServices extends ZendExt_Model
{

    public function __construct()
    {
        $this->model = new NomClienteproveedorModel();
        parent::ZendExt_Model();
    }

    /**
     * Devuelve los clientes y/o proveedores de acuerdo a los parametros.
     *
     * @param int   $idCliente    Identificador del cliente y/o proveedor a buscar
     * @param int   $idEstructura Identificador de la estructura comun
     * @param bool  $cliente      En caso que se quieran obtenere los cliente este parametros se pasa en true
     * @param bool  $proveedor    En caso que se quieran obtenere los proveedores este parametros se pasa en true
     * @param array $filtros      Arreglo en formato clave valor en caso que se quieran agregar filtros a la busqueda
     * @param int   $start        A partir de que tupla se quiera obtener la respuesta
     * @param int   $limit        Cantidad de elementos a obtener
     *
     * @return mixed|array
     */
    public function getClientesProveedorByParams(
        $idCliente = null, $idEstructura = null, $cliente = false,
        $proveedor = false, $filtros = null, $start = null, $limit = null
    ) {

        $params = [];
        $condition = [];
        $idCliente = gettype($idCliente) == 'string' ? json_decode($idCliente) : $idCliente;
        $idEstructura = gettype($idEstructura) == 'string' ? json_decode($idEstructura) : $idEstructura;
        $cliente = gettype($cliente) == 'string' ? json_decode($cliente) : $cliente;
        $proveedor = gettype($proveedor) == 'string' ? json_decode($proveedor) : $proveedor;
        $start = (gettype($start) == 'string') ? json_decode($start) : $start;
        $limit = gettype($limit) == 'string' ? json_decode($limit) : $limit;

        if (!is_array($filtros)) {
            $filtros = array();
        } else {
            if ($filtros['codigo'] == $filtros['nombre']) {
                $filtros['filtro'] = $filtros['codigo'];
                unset($filtros['codigo']);
                unset($filtros['nombre']);
            }
        }

        if (!is_null($idCliente)) {
            $filtros['idclientesproveedores'] = $idCliente;
        }
        if (!is_null($idEstructura)) {
            $filtros['idestructuracomun'] = $idEstructura;
        }
        if ($cliente && $proveedor /*&& !$idCliente*/) {
            $filtros['idtipo'] = 3;
			
        } else {
            if ($cliente == true /*&& !$idCliente*/) {
                $filtros['idtipo'] = 1;
            }
            if ($proveedor == true /*&& !$idCliente*/) {
                $filtros['idtipo'] = 2;
            }
        }
        if ($filtros['habilitado']) {
            $filtros['habilitado'] = 1;
        }
        $result = $this->model->cargarClientesproveedores($filtros, false, $start, $limit, false);
        $cont = 0;

    foreach ($result['datos'] as &$value) {
        $cuentabancaria = $this->model->obtenerDatosAdicionales(
            $value['idclientesproveedores'], null, $idEstructura, $filtros['cobrospagos']
        );
        $value['cuentabancaria'] = $cuentabancaria['data'];
        $value['cobrospagos'] = $cuentabancaria['cuentas'];
        $cont++;
    }
    return $result;
    }

    public function getCuentasClientesProveedor($idCliente, $filtros = array())
    {
        $idestructura = $filtros['idestructura'];
        $cobrospagos = $filtros['cobrospagos'];
        $moneda = $filtros['moneda'];
        $cuenta = $filtros['cuenta'];
        return $this->model->obtenerDatosAdicionales($idCliente, false, $idestructura, $cobrospagos, $moneda, $cuenta);
    }

    public function getQuery($alias)
    {
        $result = $this->model->getQuery($alias);
        return $result;
    }

    public function getClienteProveedorByUser($idusuario)
    {
        return $this->model->getClienteProveedorByUser($idusuario);
    }

    public function devolverJS()
    {
        return $this->model->devolverJS();
    }

    public function devolverCSS()
    {
        return $this->model->devolverCSS();
    }

    public function obtenerEspacioTrabajo($parametros){
        try{
            return $this->model->obtenerEspacioTrabajo($parametros);
        }catch (Exception $e){
            throw $e;
        }
    }

    /**
     * Inserta un cliente o proveedor
     *
     * @param  array $parametros arreglo de parametros
     *
     * @return json $result respuesta
     */
    public function adicionarClienteProveedor($parametros)
    {
        try {
            if(is_object($parametros)){
                $parametros = (array)$parametros;
            }
            $add = $parametros['idclientesproveedores'] ? false : true;
            $parametros['coneccion'] = Doctrine_Manager::getInstance()->getCurrentConnection()->getName();
            $parametros = $this->formatearParametros($parametros);
            $respuesta = $this->model->gestionar($parametros, $add);
            return $this->tratarRespuesta($respuesta);
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    public function eliminarClienteProveedor($parametros)
    {
        try {
            $respuesta = $this->model->eliminar($parametros);
            return $respuesta;
        } catch (Exception $e) {
            return array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false);
        }
    }

    private function formatearParametros($parametros)
    {
        $parametros['cuentabanco'] = $this->formatearArray($parametros['cuentabanco']);
        $parametros['contactos'] = $this->formatearArray($parametros['contactos']);
        return array((object)$parametros);
    }

    private function formatearArray($array)
    {
        $result = [];
        if(is_object($array)){
            $array = (array)$array;
        }
        if (is_array($array) && $array['modificados'] && is_array($array['modificados'])) {
            foreach ($array['modificados'] as $var) {
                if (is_array($var)) {
                    $result[] = (object)$var;
                }
            }
            if (count($result)) {
                return (object)array('modificados' => $result);
            }
        }
        return null;
    }

    private function tratarRespuesta($respuesta)
    {
        $respuesta['success'] = false;
        switch ($respuesta['code']) {
            case -1:
                $respuesta['msg'] = 'El cliente y/o proveedor ha sido insertado satisfactoriamente.';
                $respuesta['success'] = true;
                break;
            case -2:
                $respuesta['msg'] = 'Ya existe un cliente y/o proveedor con este c&oacute;digo.';
                break;
            case -3:
                $respuesta['msg'] = 'Ya existe un cliente y/o proveedor con este usuario.';
                break;
            case -4:
                $respuesta['msg'] = 'La persona que quiere adicionar como cliente y/o proveedor ya existe.';
                break;
            case -5:
                $respuesta['msg'] = 'La entidad que quiere adicionar como cliente y/o proveedor ya existe.';
                break;
            case -6:
                $respuesta['msg'] = 'Ya existe un cliente y/o proveedor con este c&oacute;digo contable.';
                break;
        }
        return $respuesta;
    }

    public function getOrganismos($parametros)
    {
        return $this->model->getOrganismos($parametros);
    }
}
