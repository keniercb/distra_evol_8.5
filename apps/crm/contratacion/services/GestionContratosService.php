<?php

/**
 * DatosMaestrosComunicationInterface
 *
 * Esta clase sirve como capa de abstracción
 * para la comunicación con el subsistema datos maestros.
 *
 * @package       ERP-PCRM
 * @category      Model
 * @author        Ing. Alberto Mesa martínez
 * @copyright (c) 2015, XETID
 * @version       1.0
 */
class GestionContratosService extends ZendExt_Model
{
    private $_contrato;
    private $_estructura;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->incluirDependencias();
        $this->_contrato = new GestioncontratoModel();
        $this->_estructura = new EstructuraComunicationInterface();
        $this->_hito = new GestionfacturasModel();
        $this->_estado = new NomEstado();
        $this->_confcontratacion = new ConfContratacionModel();
        $this->_solicitudnegocio = new SolicitudNegocioDService();
    }

    public function obtenerContratos($parametros)
    {
        $filtros = $this->getFiltros($parametros);
        if (count($filtros)) {
            $parametros['filter'] = $filtros;
        }
        return $this->changeResponseDatosAdicionales(
            $this->_contrato->getContratos($parametros, false, false)
        );
    }

    private function getFiltros($parametros)
    {
        $filtros = array();
        foreach ($parametros as $k => $v) {
            if ($k == 'idestructura') {
                $k = 'idarea';
                $v = $this->getArrayHijos($v);
            }
            $filtro = $this->crearFiltro($k, $v);
            if ($filtro['field']) {
                $filtros[] = $filtro;
            }
        }
        return $filtros;
    }

    private function getArrayHijos($idestructura)
    {
        $hijos = [];
        $resultado = $this->_estructura->obtenerHijos($idestructura);
        foreach ($resultado as $v) {
            $hijos[] = $v['id'];
        }
        return $hijos;
    }

    private function crearFiltro($clave, $valor)
    {
        $columnas = Doctrine::getTable('DatContrato')->getColumns();
        $columna = $columnas[$clave];
        if ($columna) {
            return array('field' => $clave,
                         'data'  => array('type'  => $columna['type'],
                                          'value' => $valor));
        } elseif ($clave == 'vigente') {
            return array('field' => $clave,
                         'data'  => array('type' => 'list', 'value' => $valor));
        } elseif ($clave == 'listofactura') {
            return array('field' => $clave,
                  'data'  => array('type' => 'other', 'value' => $valor));
        }elseif ($clave == 'clientes') {
            return array('field' => $clave,
                'data'  => array('type' => 'list', 'value' => $valor));
        } else {
            return array();
        }
    }

    public function incluirDependencias()
    {
        $dirindex = $_SERVER['SCRIPT_FILENAME'];

        //Direccion del fichero de configuracion
        $config_file = substr($dirindex, 0, strrpos($dirindex, 'web'))
            . 'apps/crm/config.php';

        if (!file_exists(
            $config_file
        )
        ) { //Si no existe el fichero de configuracion
            //Se dispara una excepcion
            throw new Exception('El fichero de configuracion no existe');
        } elseif (!is_readable($config_file)) { //Si no se puede leer
            //Se dispara una excepcion
            throw new Exception(
                'No se pudo leer el fichero de configuracion. Acceso denegado.'
            );
        } else { //Si existe el fichero y se puede leer
            //Se inicializa la variable de configuración
            $config = array();

            //Se incluye el fichero
            include_once($config_file);

            if (!isset($config['include_path'])) {
                throw new Exception(
                    'El framework no esta configurado correctamente.'
                );
            }

            //Se inicializa el include path de php a partir de la variable de configuracion
            set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
//            set_include_path($config['include_path']);

            //Se inicia la carga automatica de clases y ficheros
            $loader_file = 'Zend/Loader.php';
            if (!@include_once($loader_file)) {
                throw new Exception(
                    'El framework no esta configurado correctamente.'
                );
            }
        }
    }

    public function obtenerDatosAdicionales($parametros)
    {
        return $this->changeResponseDatosAdicionales(
            $this->_contrato->getDatosAdicionales($parametros)
        );
    }

    public function changeResponseDatosAdicionales($result)
    {
        if ($result['productos']) {
            $result = $this->clasificarProductos($result);
            unset($result['productos']);
        }

        if ($result['hitos']) {
            foreach ($result['hitos'] as $k => $v) {
                $result['hitos'][$k] = $this->clasificarProductos($v);
                unset($result['hitos'][$k]['indicadores']);
            }
        }
        return $result;
    }

    public function clasificarProductos($result)
    {
        $result['indicadoresproductos'] = array();
        $result['productosmanuales'] = array();

        $result['indicadoresservicios'] = array();
        $result['actividades'] = array();
        $result['serviciosmanuales'] = array();
        $values = isset($result['productos']) ? $result['productos']
            : $result['indicadores'];
        foreach ($values as $value) {
            if ($value['tipo'] == 1) {
                if ($value['idindicador']) {
                    $result['indicadoresproductos'][] = $value;
                } else {
                    $result['productosmanuales'][] = $value;
                }
            } else {
                if ($value['idindicador']) {
                    $result['indicadoresservicios'][] = $value;
                } elseif ($value['idactividad']) {
                    $result['actividades'][] = $value;
                } else {
                    $result['serviciosmanuales'][] = $value;
                }
            }
        }
        return $result;
    }

    public function getIndicadoresServicios()
    {

    }

    public function getProductos()
    {

    }

    public function cambiarEstadoHito($params)
    {
        try {
            $this->disableGlobalSubsistema();
            if ($params['idhito']) {
                $idestado = $this->getEstadoAccion($params['estado']);
                if ($idestado) {
                    $params['idestado'] = $idestado;
                    $result = $this->cambiarEstado($params);
                    if ($result) {
                        $this->disableGlobalSubsistema(false);
                        return true;
                    }
                }
            }
            $this->disableGlobalSubsistema(false);
            return false;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function loadConfClientesproveedores(){
        try{
            return $this->_confcontratacion->loadConfClientesproveedores();
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function getEstadoAccion($estado)
    {
        $accion = 'fact';
        switch ($estado) {
            case 1:
                $accion = 'newfact';
                break;
            case 2:
                $accion = 'readyfact';
                break;
            case 3:
                $accion = 'postfact';
                break;
            case 4:
                $accion = 'chargefact';
                break;
        }
        return $this->_estado->getEstadoByAction($accion);
    }

    private function cambiarEstado($params)
    {
        try {
            $hitos = is_array($params['idhito']) ? $params['idhito']
                : [$params['idhito']];
            $temp['idhitos'] = $hitos;
            $temp['idestado'] = $params['idestado'];
            $result = $this->_hito->cambiarEstado($temp);
            if ($result['code'] != 1) {
                return false;
            }
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

    private function disableGlobalSubsistema($disable = true)
    {
        $_SESSION['disablesubsistema'] = $disable;
    }

    public function obtenerLineas(){
        return $this->_solicitudnegocio->cargarLineas();
    }
}