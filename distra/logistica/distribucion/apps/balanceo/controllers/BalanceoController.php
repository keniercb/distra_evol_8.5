<?php

/**
 * @class BalanceoController
 * (Descripcion de la clase, objetivo)
 *
 * @package Distribucion
 * @subpackage Distribucion
 * @author Adrian Fernanandez
 * @copyright XETID
 * @version 1.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class BalanceoController extends BaseController/* ZendExt_Controller_Secure */
{

    private $_balanceoModel, $_arrayData;

    public function init()
    {
        $this->_arrayData = array(
            'isPrincipal' => true,
            'alias' => 'balanceoLog',
            'subsistema' => LogisticaGlobal::SUBSISTEMA_INV,
        );
        /*$this->_arrayData = array(
        'isPrincipal' => true,'alias' => 'entregaLog', 'subsistema' => LogisticaGlobal::SUBSISTEMA_DIST
        );*/
        parent::init('log.dist.balanceo');
        $this->_balanceoModel = new BalanceoModel($this->_arrayData);
    }

    public function balanceoAction()
    {
        $this->autoShow = false;
        $this->controllerConfig = 'log';
        $this->prepareView();
        $this->initComponent('log.dist.balanceo');
        $this->renderTemplate();
    }

    public function cargarEncabezadoAction()
    {
        if (!empty($this->uiParams['iddocumento'])) {
            $this->datos = $this->_balanceoModel->cargarEncabezado($this->uiParams['iddocumento']);
        }
    }

    public function cargarPedidosBalanceoAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);

        $this->uiParams['iddocbalanceo'] = $this->uiParams['iddocumento'];
        unset($this->uiParams['iddocumento']);
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $this->uiParams['idestructura'] = $this->uiParams['criterio'];

        $datos = $this->_balanceoModel->getPedidos($this->uiParams);
        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];

    }

    public function cargarPedidosAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);

        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $this->uiParams['idnaturaleza'] = $this->uiParams['idnaturaleza'];
        $this->uiParams['idcliente'] = $this->uiParams['idcliente'];

        $pedidosExcluir = $this->_balanceoModel->getPedidosExcluir();
        $this->uiParams['idseleccionados'] = $pedidosExcluir;

        $datos = $this->_balanceoModel->getPedidos($this->uiParams);

        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    public function adicionarDocumentoAction()
    {
        $this->uiParams['data'] = (array)Zend_Json::decode(
            $this->uiParams['data']
        );
        if ($this->uiParams['iddocumento']) {
            $this->codMsg = 'ESTADO_DOC_INCORRECTO';
            $this->success = false;
        }

        $this->uiParams['documentos'] = (array)Zend_Json::decode(
            $this->uiParams['documentos']
        );
        $this->uiParams = array_merge($this->uiParams, $this->uiParams['data']);

        unset($this->uiParams['data']);
        $this->objectHelper->synchronize($this, $this->_balanceoModel->adicionarDocumento($this->uiParams));
    }

    public function cargarDocumentosAction()
    {
        $this->uiParams['nrodoc'] = $this->uiParams['criterio'];
        $datosBusqueda = $this->_balanceoModel->devolverDocumentos($this->uiParams);
        $this->datos = $datosBusqueda['datos'];
        $this->cantidad = $datosBusqueda['cantidad'];
    }

    public function adicionarPedidosAction()
    {
        $this->uiParams['idpedidos'] = (array)Zend_Json::decode(
            $this->uiParams['idpedidos']
        );
        if ($this->_balanceoModel->isDocEditable($this->uiParams['iddocumento'])) {
            $this->_balanceoModel->agregarPedidos($this->uiParams);
        } else {
            $this->codMsg = 'ESTADO_DOC_INCORRECTO';
            $this->success = false;
        }
    }

    public function eliminarPedidosAction()
    {
        $this->uiParams['idpedidos'] = (array)Zend_Json::decode(
            $this->uiParams['idpedidos']
        );
        if ($this->_balanceoModel->isDocEditable($this->uiParams['iddocumento'])) {
            $this->_balanceoModel->eliminarPedidos($this->uiParams);
        } else {
            $this->codMsg = 'ESTADO_DOC_INCORRECTO';
            $this->success = false;
        }
    }

    public function cargarProductosAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $datos = $this->_balanceoModel->getProductosPedidosFromDoc($this->uiParams);

        $this->datos = $datos['datos'];
        $this->cantidad = $datos['cantidad'];
    }

    public function actualizarObservacionesAction()
    {
        $this->_balanceoModel->guardarObservaciones($this->_request->getPost('iddocumento'), $this->_request->getPost('observaciones'));
        $this->success = true;
    }

    public function cargarPedidosProductoAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $datos = $this->_balanceoModel->getPedidosPorIndicador($this->uiParams);
        $this->datos = $datos;
        $this->cantidad = count($datos);
    }

    public function cargarExistenciasProductosAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $datos = $this->_balanceoModel->getExistenciaProductos($this->uiParams);
        $this->datos = $datos;
        $this->cantidad = count($datos);
    }

    public function cargarSustitutosAction()
    {
        $this->setDefaultParam('start', 0);
        $this->setDefaultParam('limit', 30);
        $datos = $this->_balanceoModel->cargarSustitutos($this->uiParams);
        $this->datos = $datos;
        $this->cantidad = count($datos);
    }

    public function adicionarSustitutoAction()
    {
        if ($this->_balanceoModel->isDocEditable($this->uiParams['iddocumento'])) {
            if (empty($this->_balanceoModel->existeSustituto($this->uiParams))) {
                $this->_balanceoModel->adicionarSustituto($this->uiParams);
                $this->success = true;
                $this->codigoMsg = 1;
            } else {
                $this->success = false;
                $this->codigoMsg = 3;
            }
        } else {
            $this->codigoMsg = 'ESTADO_DOC_INCORRECTO';
            $this->success = false;
        }
    }

    public function sustituirProductoAction()
    {
        $datos = $this->_balanceoModel->sustituirProducto($this->uiParams['idindicador']);
        if (!empty($datos)) {
            $this->datos = $datos;
            $this->success = true;
            $this->codigoMsg = 1;
        } else {
            $this->datos = array();
            $this->success = false;
            $this->codigoMsg = 3;
        }
    }

    public function guardarCantComprarAction()
    {
        if ($this->_balanceoModel->isDocEditable($this->uiParams['iddocumentobalanceo'])) {
            $this->_balanceoModel->guardarCantComprar($this->uiParams);
            $this->success = true;
            $this->codMsg = 1;
        } else {
            $this->codMsg = 'ESTADO_DOC_INCORRECTO';
            $this->success = false;
        }
    }

    public function guardarCantDistribuirAction()
    {
        if ($this->_balanceoModel->isDocEditable($this->uiParams['iddocumentobalanceo'])) {
            $resp = $this->_balanceoModel->guardarCantDistribuir($this->uiParams);
            $this->success = $resp['success'];
            $this->codMsg = $resp['codMsg'];
        } else {
            $this->codMsg = 'ESTADO_DOC_INCORRECTO';
            $this->success = false;
        }
    }

    public function getPedidosFromDocAction()
    {
        $iddocumento = $this->uiParams['iddocumento'];
        $idpedidos = $this->_balanceoModel->getIdPedidosPadre($iddocumento);
        $this->datos = $idpedidos;
    }

    public function eliminarProductoAction()
    {

        if ($this->_balanceoModel->isDocEditable($this->uiParams['iddocumento'])) {

            $resp = $this->_balanceoModel->eliminarProducto($this->uiParams);
            if ($resp) {
                $this->success = true;
                $this->codMsg = 1;
            } else {
                $this->success = false;
                $this->codMsg = 3;
            }
        } else {
            $this->codMsg = 'ESTADO_DOC_INCORRECTO';
            $this->success = false;
        }
    }

    public function eliminarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_balanceoModel->eliminarDocumento($this->uiParams['iddocumento']);
    }

    public function anularDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_balanceoModel->eliminarDocumento($this->uiParams['iddocumento']);
    }

    public function confirmarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $resp = $this->_balanceoModel->validarCantidadesConfimar($this->uiParams['iddocumento']);
        if ($resp) {
            $result = $this->_balanceoModel->confirmarDocumento($this->uiParams['iddocumento']);
            if ($result == 1) {
                $this->success = true;
            } else {
                $this->codigoMsg = $result;
                $this->success = false;
            }
        } else {
            $this->codigoMsg = 'CANT_ERRORNEAS';
            $this->success = false;
        }
    }

    public function anularEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_balanceoModel->anularEstadoDocumento($this->uiParams['iddocumento']);
    }

    public function aprobarEstadoDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(
            ',', Zend_Json::decode($this->uiParams['id'])
        );

        $creados = $this->_balanceoModel->aprobarDocumentoBalanceo($this->uiParams['iddocumento']);

        $this->success = true;

    }

    public function comprarProductosDePedidosAction()
    {

        $iddocumento = $this->uiParams['iddocumento'];
        $iddocpedidos = (array)Zend_Json::decode(
            $this->uiParams['idpedidos']
        );
        if ($this->_balanceoModel->isDocEditable($iddocumento)) {
            $cantidad = $this->_balanceoModel->CantidadPedidosConCantidadesDistribuidas($iddocumento, $iddocpedidos);

            if ($cantidad == 0) {
                $this->success = $this->_balanceoModel->ComprarProductosDePedidos($iddocumento, $iddocpedidos);
                $this->codMsg = 1;
            } else {
                $this->codMsg = 'PRODS_DISTRIBUIDOS';
                $this->success = false;
            }
        } else {
            $this->codMsg = 'ESTADO_DOC_INCORRECTO';
            $this->success = false;
        }
    }

    public function cancelarDocumentoAction()
    {
        $this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        $this->success = $this->_balanceoModel->cancelarDocumento($this->uiParams['iddocumento']);
    }

    public function exportarDemandaAction()
    {
        //$this->uiParams['iddocumento'] = implode(',', Zend_Json::decode($this->uiParams['id']));
        //$this->url = $this->_balanceoModel->exportarDemanda($this->uiParams['iddocumento']);
        $this->_balanceoModel->exportarDemanda($this->uiParams['iddocumento']);
    }

    public function cargarNomtipopedidoAction()
    {
        $respuesta = $this->_balanceoModel->getTipoPedido();
        $this->datos = $respuesta;
        $this->cantidad = count($respuesta);
    }

    public function cargarClientesAction()
    {
        $respuesta = $this->_balanceoModel->cargarClientes($this->uiParams);
        $this->datos = $respuesta['datos'];
        $this->total = $respuesta['cantidad'];
    }

    public function cargarEntidadesAction()
    {
        //$this->datos = ServiciosSeguridadHelper::__init()->getEntidadesByRolUsuario();
        $this->datos = ServiciosEstructuraComposicionHelper::__init()->obtenerEstructuras($this->global->Estructura->idestructura, false, $this->uiParams['criterio']);
    }

}
