<?php

class ExptecnicoController extends ZendExt_Controller_Secure
{

    private $model;
    protected $serviciosAyuda;

    function init()
    {
        parent:: init();
        $this->serviciosAyuda = ServiciosAyudaHelper::__init();
        $this->model = new ExpTecnicoModel();
    }

    public function exptecnicoAction()
    {
        $this->view->arrayJs = array($this->serviciosAyuda->getJSAyuda());
        $this->render();
    }

    public function getMovimientosRegistroAction()
    {
        try {
            $parametros = $this->_request->getPost();

            ComunAFTModel::getInstance()->configStartAndLimitInParams(
                $parametros, $this->_request->getPost('start'), $this->_request->getPost('limit')
            );
            echo json_encode($this->model->listadoDocumentos($parametros));
        } catch (Exception $exc) {
            echo json_encode(
                array('success' => false, 'error' => $exc->getMessage())
            );
        }
    }

    public function getMediosModulosAction()
    {
        $parametros = $this->_request->getPost();
        $parametros['id'] = 1;
        $parametros['modulo'] = true;
        if ($this->_request->getPost('_id')) {
            $parametros['id'] = $this->_request->getPost('_id');
        }
        $parametros['id'] = ($this->_request->getPost('_id')) ? $this->_request->getPost('_id') : 1;
        $parametros['idestructuraop'] = $parametros['idarea'];
        $datos = $this->model->obtenerModulos($parametros);
        echo json_encode($datos);
    }

    public function getUsuariosAction()
    {
        try {
            echo json_encode($this->model->getUsuarios());
        } catch (Exception $exc) {
            echo json_encode(
                array('success' => false, 'error' => $exc->getMessage())
            );
        }
    }

    public function getEntidadAction()
    {
        $ent = $this->integrator->metadatos->DameEstructura(
            $this->global->Estructura->idestructura
        );
        $datos['entidad'] = $ent[0]->denominacion;
        $datos['identidad'] = $ent[0]->idestructura;
        echo(json_encode($datos));
    }

    public function getImagenesDetallesAction()
    {
        $idindicador = $this->_request->getPost('idindicador');
        $result = Doctrine::getTable('DatImagenindicador')->findByDql(
            ' idindicador = ?', array($idindicador)
        );
        if (count($result) != 0) {
            $datos = $result->toArray();
        } else {
            $datos = array();
        }
        echo json_encode(array('data' => $datos));
    }

    public function mostrarDetallesAction()
    {
        try {
            $parametros = $this->_request->getPost();
            if ($this->_request->getPost('idregnumerico')) {
                $parametros['idregnumerico'] = json_decode(
                    stripcslashes($this->_request->getPost('idregnumerico'))
                );
            }
            echo json_encode($this->model->mostrarDetalles($parametros));
        } catch (Exception $exc) {
            echo json_encode(
                array('success' => false, 'error' => $exc->getMessage())
            );
        }
    }

    public function mostrarHistorialAction()
    {
        try {
            $parametros = $this->_request->getPost();
            $parametros['start'] = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
            if ($this->_request->getPost('idregnumerico')) {
                $parametros['idregnumerico'] = json_decode(
                    stripcslashes($this->_request->getPost('idregnumerico'))
                );
            }
            echo json_encode($this->model->mostrarHistorial($parametros));
        } catch (Exception $exc) {
            echo json_encode(
                array('success' => false, 'error' => $exc->getMessage())
            );
        }
    }

    public function getDatosMedioAction()
    {
        try {
            $parametros = $this->_request->getPost();
            if ($this->_request->getPost('idregnumerico')) {
                $parametros['idregnumerico'] = json_decode(
                    stripcslashes($this->_request->getPost('idregnumerico'))
                );
            }
            echo json_encode($this->model->getDatosMedio($parametros));
        } catch (Exception $exc) {
            echo json_encode(
                array('success' => false, 'error' => $exc->getMessage())
            );
        }
    }

    public function getTipoMedioAction()
    {
        try {
            $parametros = $this->_request->getPost();
            if ($this->_request->getPost('idregnumerico')) {
                $parametros['idregnumerico'] = json_decode(
                    stripcslashes($this->_request->getPost('idregnumerico'))
                );
            }
            echo json_encode($this->model->getTipoMedio($parametros));
        } catch (Exception $exc) {
            echo json_encode(
                array('success' => false, 'error' => $exc->getMessage())
            );
        }
    }

}
