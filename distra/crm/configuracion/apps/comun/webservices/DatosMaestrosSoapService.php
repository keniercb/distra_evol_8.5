<?php

/**
 * Class DatosMaestrosSoapService
 * Implementa los servicios soap del subistema Datos Maestros
 *
 * @author Alberto Mesa Martinez
 */
define('ROOT_DM', Zend_Registry::get('config')->dir_aplication . '/configuracion');
define('ROOT_DPA', ROOT_DM . '/divisionpolitica');
define('ROOT_MONEDA', ROOT_DM . '/multimoneda');
include_once(ROOT_DPA . '/models/domain/generated/BaseNomPais.php');
include_once(ROOT_DPA . '/models/domain/NomPais.php');
include_once(ROOT_DPA . '/models/domain/generated/BaseNomDpasecodena.php');
include_once(ROOT_DPA . '/models/domain/NomDpa.php');
include_once(ROOT_DPA . '/models/domain/generated/BaseNomNivelestructural.php');
include_once(ROOT_DPA . '/models/domain/NomNivelestructural.php');
include_once(ROOT_DPA . '/models/domain/generated/BaseNomConceptonivel.php');
include_once(ROOT_DPA . '/models/domain/NomConceptonivel.php');
include_once(ROOT_MONEDA . '/models/domain/generated/BaseDatMonedaEntidad.php');
include_once(ROOT_MONEDA . '/models/domain/DatMonedaEntidad.php');

class DatosMaestrosSoapService
{
    private $_especialidadmodel;
    private $_nomespecialidad;
    private $_clienteproveedormodel;
    private $_nompais;
    private $_dpa;

    function __construct()
    {
        //$this->_especialidadmodel = new EspecialidadModel();
        //$this->_nomespecialidad = new NomEspecialidad();
        $this->_clienteproveedormodel = new NomClienteproveedorModel();
        $this->_nompais = new NomPais();
        $this->_dpa = new NomDpa();
        $this->_moneda = new DatMonedaEntidad();
    }

    /**
     * Obtiene las especialidad por parametros especificados
     *
     * @param  array $parametros arreglo de parametros
     *
     * @return json $result respuesta
     */
    public function obtenerEspecialidadParametros($parametros)
    {
        $result = $this->_especialidadmodel->obtenerEspecialidadParametros($parametros);
        return json_encode($result);
    }

    /**
     * Obtener arbol especialidad
     *
     * @param  array $parametros arreglo de parametros
     *
     * @return json $result respuesta
     */
    public function obtenerArbolEspecialidad($parametros)
    {
        $idpadre = $parametros['idpadre'] ? $parametros['idpadre'] : 0;
        $filtro = $parametros['filtro'] ? $parametros['filtro'] : '';
        $buscar = $parametros['filtro'] ? 1 : 0;

        if ($buscar == 0) {
            $result = $this->_nomespecialidad->cargarEspecialidades($idpadre);
        } else {
            $result = $this->_especialidadmodel->obtenerArbol($filtro, $buscar);
        }
        $result = (count($result) > 0) ? $result : array();
        return json_encode($result);
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
            if (is_object($parametros)) {
                $parametros = (array)$parametros;
            }
            $add = $parametros['idclientesproveedores'] ? false : true;
            $parametros['coneccion'] = Doctrine_Manager::getInstance()->getCurrentConnection()->getName();
            $parametros = $this->formatearParametros($parametros);
            $respuesta = $this->_clienteproveedormodel->gestionar($parametros, $add);
            return json_encode($this->tratarRespuesta($respuesta));
        } catch (Exception $e) {
            return json_encode(array('code' => $e->getCode(), 'msg' => $e->getMessage(), 'success' => false));
        }
    }

    private function formatearParametros($parametros)
    {
        $parametros['cuentabanco'] = $this->formatearArray($parametros['cuentabanco']);
        $parametros['contactos'] = $this->formatearArray($parametros['contactos']);
        $parametros = (object)$parametros;
        $idcliente = (object)array('idclientesproveedores' => $parametros->idclientesproveedores);
        return array($parametros, $idcliente);
    }

    private function formatearArray($array)
    {
        $modificados = [];
        $eliminados = $array['eliminados'];
        if (is_object($array)) {
            $array = (array)$array;
        }
        if (is_array($array) && $array['modificados'] && is_array($array['modificados'])) {
            foreach ($array['modificados'] as $var) {
                if (is_array($var)) {
                    $modificados[] = (object)$var;
                }
            }
        }
        if (count($modificados) || count($eliminados)) {
            return (object)array('modificados' => $modificados, 'eliminados' => $eliminados);
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

    public function obtenerClienteProveedor($parametros)
    {
        $result = $this->_clienteproveedormodel->cargarClientesproveedores(
            $parametros, false, $parametros['start'], $parametros['limit'], false
        );
        foreach ($result['datos'] as $key => &$value) {
            $datos = $this->_clienteproveedormodel->obtenerDatosAdicionales($value['idclientesproveedores']);
            $value['cuentas'] = $datos['data'];
            $value['certifico'] = $datos['certifico'];
            $datos2 = $this->_clienteproveedormodel->obtenerDatosAdicionales($value['idclientesproveedores'], true);
            $value['contacto'] = $datos2['data'];
            if ($value['dpa']) {
                $ruta = $this->_dpa->getRutaDPT($value['dpa'], true);
                $value['rutadpa'] = $ruta;
            }
        }
        return json_encode($result);
    }

    public function obtenerOrganismos($parametros)
    {
        if (is_object($parametros)) {
            $parametros = (array)$parametros;
        }
        $resultado = $this->_clienteproveedormodel->getOrganismos($parametros);
        return json_encode($resultado);
    }

    public function obtenerBancos($parametros)
    {
        if (is_object($parametros)) {
            $parametros = (array)$parametros;
        }
        $resultado = $this->_clienteproveedormodel->cargarBancos();
        return json_encode($resultado);
    }

    public function obtenerSucursales($parametros)
    {
        if (is_object($parametros)) {
            $parametros = (array)$parametros;
        }
        $resultado = $this->_clienteproveedormodel->cargarSucursales($parametros);
        return json_encode($resultado);
    }

    public function obtenerPais($parametros)
    {
        $resultado = $this->_nompais->obtenerNomPaises($parametros);
        return json_encode($resultado);
    }

    public function obtenerProvincia($parametros)
    {
        $resultado = $this->_dpa->cargarEstructura(0, $parametros['idpais'], $parametros['nombre']);
        return json_encode($resultado);
    }

    public function obtenerMunicipio($parametros)
    {
        $resultado = $this->_dpa->cargarEstructura(
            $parametros['idprovincia'], $parametros['idpais'], $parametros['nombre']
        );
        return json_encode($resultado);
    }

    public function obtenerMonedas($parametros){
        if(!$parametros['idestructuracomun']){
            return array();
        }
        return $this->_moneda->obtenerMonedasByEntidad($parametros);
    }
}
