<?php

/**
 * Clase de utilidad para devolver los datos de los sistemas externos que se muestran en forma de arbol
 *
 * @author kenier
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class SistemasexternosController extends BaseController {

    public function init() {
        parent::init();
        $this->autoShow = false;
    }

    public function sistemasExternosAction() {
        
    }

    /**
     * Accion para devolver el arbol de unidades de medidas registradas en el sistema
     */
    public function cargarArlboUMAction() {
        $this->jsonResponse($this->configuracionHelper->listarUnidadesMedida($this->uiParams['node']));
    }

    /**
     * Accion para devolver los centro de costos
     */
    public function cargarCentroCostosAction() {
        $centros = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
                $this->global->Estructura->idestructura, $this->uiParams['start'], $this->uiParams['limit'],
                $this->uiParams['filtro']
        );
        $centrosTotal = $this->contabilidadHelper->obtenerCentrosCostoFiltro(
                $this->global->Estructura->idestructura, null, null, $this->uiParams['filtro']
        );

        $this->jsonResponse(array('datos' => $centros, 'total' => count($centrosTotal)));
    }

    /**
     * Accion para devolver los productos
     */
    public function cargarProductosAction() {
        $prodMaest = new MaestroProductoModel();
        $valores = $prodMaest->cargarGridNomenclador($this->uiParams, false);
        $this->jsonResponse($valores['datos']);
    }

    /**
     * Muestra el arbol del clasificador de cuentas
     */
    public function cargarCuentasAction() {
        try {
            /* print_r($this->uiParams);
              die; */
            $valor = $this->contabilidadHelper->obtenerClasificadorCuentas(null, $this->uiParams['node'], array(), true, '10,11,13');
            if (!is_array($valor)) {
                throw new Exception("Debe configurar la estructura econ&oacute;mica.");
            } else {
                $this->jsonResponse($valor);
            }
        } catch (Exception $ex) {
            $this->jsonResponse(array('codMsg' => 3, 'success' => false, 'mensaje' => $ex->getMessage()));
        }
    }

    public function getNaturalezasAction() {
        $this->jsonResponse($this->configuracionHelper->obtenerDatosArbolNaturaleza($this->uiParams));
    }

    public function getDepositosAction() {
        $depositos = $this->logistEstrucUbica->cargardepositos();
        $this->jsonResponse($depositos['depositos']);
    }

    /**
     * Accion para devolver los clientes
     */
    public function cargarClientesAction() {
        if (array_key_exists('query', $this->uiParams)) {
            $this->uiParams['criterio'] = $this->uiParams['query'];
        }
        $this->uiParams['nombre'] = $this->uiParams['criterio'];
        $this->uiParams['codigo'] = $this->uiParams['criterio'];
        $cliente = $this->configuracionHelper->getClientesProveedorByParams(
                null, $this->global->Estructura->idestructura, true, true, false, $this->uiParams, $this->uiParams['start'],
                $this->uiParams['limit']
        );
        foreach ($cliente['datos'] as &$c) {
            $c['nombre'] = $c['codigo'] . ' ' . $c['nombre'];
        }
        $this->jsonResponse(array('datos' => $cliente['datos'], 'total' => $cliente['cantidad']));
    }

    /**
     * Accion para devolver los proveedores
     */
    public function cargarProveedoresAction() {
        if (array_key_exists('query', $this->uiParams)) {
            $this->uiParams['criterio'] = $this->uiParams['query'];
        }
        $this->uiParams['nombre'] = $this->uiParams['criterio'];
        $this->uiParams['codigo'] = $this->uiParams['criterio'];
        $this->jsonResponse(
                $this->configuracionHelper->getClientesProveedorByParams(
                        null, $this->global->Estructura->idestructura, true, false, true, $this->uiParams,
                        $this->uiParams['start'], $this->uiParams['limit']
                )
        );
    }

    public function cargarPaisesAction() {
        $this->autoShow = true;
        $this->datos = $this->configuracionHelper->obtenerPaisesEntidad();
    }

    public function cargarEspecialidadAction() {
        $this->autoShow = true;
        $noneEspecialidad = array(
            array(
                'idespecialidad' => 1,
                'denespecialidad' => 'NINGUNA'
            )
        );
        $this->datos = array_merge($noneEspecialidad,
                $this->configuracionHelper->obtenerEspecialidades($this->uiParams));
    }

    public function cargarEntidadesGrupoAction() {
        $this->autoShow = true;
        $this->datos = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras($this->global->Estructura->idestructura);
    }

    public function cargarComboUMAction() {
        $array = array('datos' => $this->configuracionHelper->listarUnidadesMedidaTodas());
        $this->jsonResponse($array);
    }

    /**
     * @return array
     */
    public function cargarCuentasCentroCostoAction() {
        $this->autoShow = true;
        $this->datos = $this->contabilidadHelper->obtenerCuentasAsociadasACentros($this->uiParams['idcentrocosto'], $this->uiParams['idmoneda']);
    }

    public function obtenerCondicionesPagoAction() {
        $this->autoShow = true;
        $condiciones = $this->configuracionHelper->obtenerCondicionesPago();
        $this->datos = $condiciones['data'];
    }

}
