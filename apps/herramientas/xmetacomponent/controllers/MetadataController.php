<?php

class MetadataController extends ZendExt_Controller_Secure
{

    private $_tableModel;
    private $_campoModel;
    private $_metadataModel;

    function init()
    {
        parent::init();
        $this->_tableModel = ZendExt_Metadata::getInstance()->Concept();
        $this->_metadataModel = ZendExt_Metadata::getInstance()->Metadata();
        $this->_campoModel = ZendExt_Metadata::getInstance()->Attribute();
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();

    }

    public function metadataAction()
    {
        $this->render();
    }

    public function cargarnomAction()
    {
        echo json_encode($this->_tableModel->cargarNomencladores());
    }

    public function cargarcamposAction()
    {

        echo json_encode(
            $this->_metadataModel->obtenerConfigGridPanel(
                $this->_request->getPost('node')
            )
        );
    }

    public function crudAction()
    {


        switch ($this->_request->getPost('comand')) {
            case 'load' :
                $ciar = $this->_metadataModel->obtenerInfoTabla(
                    $this->_request->getPost('node')
                );

                try {
                    $doctrineManager = Doctrine_Manager::getInstance();
                    $module = $doctrineManager->getConnectionName($this->conn);
                    $doctrineManager->setCurrentConnection('xmetacomponent');
                    $result = $ciar->offset($this->_request->getPost('start'))
                        ->limit($this->_request->getPost('limit'))
                        ->get()
                        ->result_array();
                    $doctrineManager->setCurrentConnection($module);
                } catch (Exception $e) {
                    $this->log($e);
                }


                echo json_encode(
                    array('data' => $result, 'total' => count($result))
                );
                break;

            case 'create' :
                $nueva = array_values($this->_request->getParams());

                $request = $this->_request->getPost('node');
                $params = $this->_request->getParams();
                if ($this->comprobarExistencia($nueva[5])) {
                    if ($this->_metadataModel->insertarEnMetadatos(
                        $request, $params
                    )
                    ) {
                        $this->showMessage(
                            "Los datos han sido adicionados satisfactoriamente."
                        );
                    };
                } else {
                    $this->showErrorMessage(
                        "El dato que quiere adicionar ya existe."
                    );
                }
                break;

            case 'update' :
                $nueva = array_values($this->_request->getParams());

                $request = $this->_request->getPost('node');
                $params = $this->_request->getParams();
                if ($this->comprobarExistencia($nueva[5])) {
                    if ($this->_metadataModel->modificarEnMetadatos(
                        $request, $params
                    )
                    ) {
                        $this->showMessage(
                            "El dato ha sido modificado satisfactoriamente."
                        );
                    }
                } else {
                    $this->showErrorMessage("El dato ya existe.");
                }
                break;

            case 'delete' :
                $request = $this->_request->getPost('node');
                $params = $this->_request->getParams();
                if ($this->_metadataModel->eliminarEnMetadatos(
                    $request, $params
                )
                ) {
                    $this->showMessage(
                        "El dato ha sido eliminado satisfactoriamente."
                    );
                };
                break;
        }


    }

    private function log(Exception $e)
    {
        $code = $e->getCode();
        switch ($code) {
            case 42: //No existe tabla o secuencia.
            case 42704: //No existe disparador.
            case 42883: //No existe funcion.
                throw new ZendExt_Exception('XMT004', $e);
                break;

            default:
                throw $e;
        }
    }

    public function formconfigAction()
    {
        $request = $this->_request->getPost('node');
        echo json_encode(
            $this->_metadataModel->obtenerConfigFormulario($request)
        );
    }

    public function crudtreeAction()
    {
        $nodeConcept = $this->_request->getPost('nodeconcept');
        $arrayNode = array("node" => $this->_request->getPost("node"));
        $ciar = $this->_metadataModel->obtenerInfoTabla(
            $nodeConcept, $arrayNode
        );
        $data = $ciar->get()
            ->result_array();

        for ($i = 0; $i < count($data); $i++) {
            $data[$i]['leaf'] = ($data[$i]['leaf'] == 1) ? true : false;
        }
        echo json_encode($data);
    }

    public function comprobarExistencia($denominacion)
    {
        $ciar = $this->_metadataModel->obtenerInfoTabla(
            $this->_request->getPost('node')
        );
        $result = $ciar->offset($this->_request->getPost('start'))
            ->limit($this->_request->getPost('limit'))
            ->get()
            ->result_array();
        foreach ($result as $value) {
            $vieja = array_values($value);
            if ($vieja[1] == $denominacion) {
                return false;
            }
        }

        return true;
    }
}
