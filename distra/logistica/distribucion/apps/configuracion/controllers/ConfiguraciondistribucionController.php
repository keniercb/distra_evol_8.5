<?php

/**
 * @class      ConfiguraciondistribucionController
 *
 * @package    Inventario
 * @subpackage Configuracion
 * @author     Antonio Diaz Soutuyo
 * @modified   Yadrian Aguila Ferran
 * @copyright  XETID
 * @version    2.0
 */
if (!class_exists('BaseModel')) {
    $dir = Zend_Registry::getInstance()->get('config')->dir_aplication . '/logistica/utiles/comun/config.php';
    include_once $dir;
    set_include_path(get_include_path() . PATH_SEPARATOR . $config['include_path']);
}

class ConfiguraciondistribucionController extends BaseController
{
    private $modelSetting, $idestructuraComun, $modelPlanConsumo;

    public function init()
    {
        parent::init('log.dist.configuracion');
        $this->idestructuraComun = $this->global->Estructura->idestructura;
        $this->modelSetting = new ConfiguraciondistribucionModel();
        $this->modelPlanConsumo = new DatPlanconsumoModel();
    }

    public function configuraciondistribucionAction()
    {
        $this->autoShow = false;
        $this->render();
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna true si se salvo la configuracion correctamente
     */
    public function salvarconfiguracionAction()
    {
        $this->uiParams['idestructuracomun'] = $this->idestructuraComun;
        $this->modelSetting->salvarConfiguracion($this->uiParams);
        $this->success = true;
    }

    /**
     * @author Antonio Diaz Soutuyo
     * @return Retorna los datos de la configuracion en caso de existir
     */
    public function cargarconfigdistribucionAction()
    {
        $this->datos = $this->modelSetting->devolverConfiguracion($this->idestructuraComun);
    }

    function asociarClientesProductoAction()
    {
        $this->uiParams['idestructura'] = $this->global->Estructura->idestructura;
        $this->uiParams['productos'] = json_decode(stripcslashes($this->uiParams['productos']));
        $this->uiParams['clientes'] = json_decode(stripcslashes($this->uiParams['clientes']));
        $result = $this->modelPlanConsumo->asociarClientesProductos($this->uiParams);
        if ($result) {
            $this->codigoMsg = 1;
            $this->flags = $result['flags'];
            $this->success = $result['flags'];
        } else {
            $this->codigoMsg = 3;
            $this->flags = false;
            $this->success = false;
        }
    }

    function modificarfilaAction()
    {
        $arrDatos = json_decode(str_replace('\\', '', $this->uiParams['datos']));
        $result = $this->modelPlanConsumo->modificarFila($arrDatos);
        $this->codigoMsg = 1;
        $this->datos = array('fechaactualizacion' => $result['fechaactualizacion']);
    }

    function eliminaValoresConsumoAction()
    {
        $arrDatos = json_decode(str_replace('\\', '', $this->uiParams['datos']));
        $result = $this->modelPlanConsumo->eliminarValores($arrDatos);
        if ($result != true) {
            $this->codigoMsg = 3;
        } else {
            $this->codigoMsg = 1;
        }
    }

    function modificarValorColumnaAction()
    {
        $arrDatos = json_decode(str_replace('\\', '', $this->uiParams['datos']));
        $columna = $this->uiParams['columna'];
        $valor = $this->uiParams['valor'];
        $this->modelPlanConsumo->modificarColumna($arrDatos, $valor, $columna);
        $this->codigoMsg = 1;
    }

    function exportarPlanConsumoAction()
    {
        $this->autoShow = false;
        $params = Zend_Json::decode($this->uiParams['datas'], 1);
        $params['start'] = ($params['start']) ? $params['start'] : 0;
        $params['limit'] = ($params['limit']) ? $params['limit'] : 10;
        $result = $this->modelPlanConsumo->cargarPlanConsumo($params);
        header('Content-type: text/xml');
        header('Content-Disposition: attachment; filename="InformacionesDeConsumidores.xml"');
        echo $this->getXmlByArray($result['datos']);
    }

    function cargarPlanConsumoAction()
    {
        $params = $this->uiParams;
        $params['filexml'] = $_FILES["filexml"];
        if (!empty($params['filexml'])) {
            if (($params['filexml']['error'] == UPLOAD_ERR_OK)
                && ($params['filexml']['type'] == 'text/xml')
                && (is_uploaded_file($params['filexml']['tmp_name']))
            ) {
                try {
                    $resultDecode = Zend_Json::decode(
                        Zend_Json::fromXml(file_get_contents($params['filexml']['tmp_name'])),
                        1
                    );
                    if ((!empty($resultDecode['list'])) && (!empty($resultDecode['list']['plan']))) {
                        $result['datos'] = $resultDecode['list']['plan'];
                        $result['idestructura'] = $this->global->Estructura->idestructura;
                        $result = $this->modelPlanConsumo->importarDatas($result);
                        if ($result['success']) {
                            $this->codigoMsg = 1;
                            $this->exists = $result['exists'];
                            $this->success = $result['success'];
                        } else {
                            $this->codigoMsg = $result['codigoMsg'];
                            $this->exists = $result['exists'];
                            $this->success = false;
                        }
                    } else {
                        $this->success = false;
                        $this->codigoMsg = 2;
                    }
                } catch (Exception $exc) {
                    $this->success = false;
                    $this->codigoMsg = 2;
                }
            } else {
                $this->success = false;
                $this->codigoMsg = 4;
            }
        } else {
            $params['start'] = ($params['start']) ? $params['start'] : 0;
            $params['limit'] = ($params['limit']) ? $params['limit'] : 10;
            $result = $this->modelPlanConsumo->cargarPlanConsumo($params);
            $this->datos = $result['datos'];
            $this->cantidad = $result['total'];
        }
    }

    function getArrayByXml($xml)
    {
        $dom = DOMDocument::load($xml);
        $workflowElements = $dom->getElementsByTagName("plan");
        $data = array();
        $value = array();
        foreach ($workflowElements as $node) {
            foreach ($node->childNodes as $child) {
                if ($child->nodeName != '#text') {
                    $value[$child->nodeName] = $child->nodeValue;
                }
            }
            $data[] = $value;
        }
        return array('datos' => $data, 'total' => $workflowElements->length);
    }

    function getXmlByArray($datas)
    {
        $xml = new DomDocument('1.0', 'UTF-8');
        $xml->formatOutput = true;
        $xml->validateOnParse = true;
        $xml->preserveWhiteSpace = false;
        $root = $xml->appendChild($xml->createElement('list'));
        foreach ($datas as $data) {
            $plan = $root->appendChild($xml->createElement('plan'));
            foreach ($data as $index => $val) {
                $child = $plan->appendChild($xml->createElement($index));
                $child->appendChild($xml->createTextNode($val));
            }
        }
        $path = "/tmp/InformacionesDeConsumidores.xml";
        $xml->save($path); //$xml->saveXML();
        return file_get_contents($path);
    }

    function cargarTodosClientesAction()
    {
        $this->uiParams['idseleccionados'] = (array)Zend_Json::decode(
            $this->uiParams['idseleccionados']
        );
        $datosCliente = $this->modelSetting->devolverTodosClientes($this->uiParams);
        $this->datos = $datosCliente['datos'];
        $this->cantidad = $datosCliente['cantidad'];
    }

    function cargarClientesAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosCliente = $this->modelSetting->devolverClientes($this->uiParams);
        $this->datos = $datosCliente['datos'];
        $this->cantidad = $datosCliente['cantidad'];
    }

    function cargarProductosAction()
    {
        $this->setDefaultParam('limit', 30);
        $this->setDefaultParam('start', 0);
        $datosCliente = $this->modelSetting->devolverProductos($this->uiParams);
        $this->datos = $datosCliente['datos'];
        $this->cantidad = $datosCliente['cantidad'];
    }

    function cargarArbolAction()
    {
        $this->autoShow = false;
        if ($this->params['node'] == 0) {
            $arrayCategorias = $this->modelSetting->cargarCategorias();
            if (count($arrayCategorias) > 0) {
                foreach ($arrayCategorias as $categorias) {
                    $obj = new stdClass();
                    $obj->id = $categorias['idcategoria'];
                    $obj->text = $categorias['text'];
                    $obj->leaf = true;
                    $arbolDepositos[] = $obj;
                }
            } else {
                $arbolDepositos[] = null;
            }
            echo json_encode($arbolDepositos);
        }
    }

    function adicionarCategoriaAction()
    {
        $parametros = json_decode($this->_request->getPost('datos'));
        $this->success = $this->modelSetting->adicionarCategoria($parametros);
    }

    function adicionarProductosAction()
    {
        $this->uiParams['productos'] = (array)Zend_Json::decode($this->uiParams['productos']);
        $this->uiParams['idcategoria'] = json_decode($this->_request->getPost('idcategoria'));
        $this->success = $this->modelSetting->adicionarProducto($this->uiParams);
    }

    function adicionarClientesAction()
    {
        $this->uiParams['clientes'] = (array)Zend_Json::decode($this->uiParams['clientes']);
        $this->uiParams['idcategoria'] = json_decode($this->_request->getPost('idcategoria'));
        $this->success = $this->modelSetting->adicionarCliente($this->uiParams);
    }

    function eliminarCategoriaAction()
    {
        $parametros = json_decode($this->_request->getPost('datos'));
        $this->success = $this->modelSetting->eliminarCategoria($parametros);
    }

    function eliminarProductosAction()
    {
        $this->uiParams['datos'] = (array)Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->modelSetting->eliminarProducto($this->uiParams);
    }

    function eliminarClientesAction()
    {
        $this->uiParams['datos'] = (array)Zend_Json::decode($this->uiParams['datos']);
        $this->success = $this->modelSetting->eliminarCliente($this->uiParams);
    }

    function cargarCategoriasAction()
    {
        $datosCliente = $this->modelSetting->devolverCategoriasEstructuras($this->uiParams);
        $this->datos = $datosCliente['datos'];
        $this->cantidad = $datosCliente['cantidad'];
    }

    function heredarCategoriaAction()
    {
        $parametros = json_decode($this->_request->getPost('datos'));
        $this->success = $this->modelSetting->heredarCategoria($parametros);
    }

}
