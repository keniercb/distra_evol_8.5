<?php

class CapturarhuellaController extends ZendExt_Controller_Secure
{
    private $objDedo, $objHuella, $response;

    function init()
    {
        parent::init();
        $this->objDedo = new NomDedoModel();
        $this->objHuella = new DatHuellaModel();
    }

    function capturarhuellaAction()
    {
        $this->view->jsCmpReccomplejas = $this->integrator->reccomplejas->obtenerScriptsReccomplejas();
        $this->view->jspersona = $this->integrator->pvd->mostrarIUBuscarPersona();
        $this->render();
    }

    public function getCmbFingersAction()
    {
        try {
            echo json_encode(array('data' => $this->objDedo->getCmbFingres()));
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getFingersByIdpersonAction()
    {
        try {
            $idpersona = $this->_getParam('idpersona');
            if ($idpersona != '') {
                $this->response = $this->objHuella->getFingersByIdperson($idpersona);
            } else {
                throw new Exception('No existe persona a la cual obtener los datos de la nacionalidad', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    public function responseExceptions($error)
    {
        $this->response->success = false;
        $this->response->codigo = $error->getCode();
        $this->response->mensaje = $error->getMessage();
        $this->response->traza = $error->getTraceAsString();
        $this->responseRequest();
    }

    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : true;
        echo json_encode($this->response);
    }

    public function saveFingersAction()
    {
        try {
            if ($this->_request->getPost('idpersona')) {
                $fingers = json_decode($this->_request->getPost('data'));
                $indixes = array(
                    'iddedo' => '', 'idhuella' => '', 'imagen' => '', 'calidad' => '', 'minutia' => '');
                $arrAdd = array();
                $arrMods = array();
                $arrIds = array();
                foreach ($fingers as $v) {
                    $p = count($arrAdd);
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idhuella':
                                if ($v->$i != '') {
                                    $arrIds[] = $v->$i;
                                }
                                break;
                            default:
                                if ($v->idhuella != '') {
                                    $arrMods[$v->idhuella][$i] = $v->$i;
                                } else {
                                    $arrAdd[$p][$i] = $v->$i;
                                }
                                break;
                        }
                    }
                }
                $this->objHuella->saveAndUpdateFingers(
                    $arrAdd, $arrIds, $arrMods, $this->_request->getPost('idpersona')
                );
                $this->responseRequest();
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    public function findByParamsAction()
    {
        try {
            $fingers = json_decode($this->_request->getPost('data'));
            $result = array();
            if ($fingers->idpersona != 'null' && $fingers->iddedo != 'null') {
                $persona = ZendExt_IoC_Inter::getInstance()->pvd->getPrincipalesDatosPersona(
                    $fingers->idpersona
                );
                $huella = $this->objHuella->getDataHuella($fingers->idpersona, $fingers->iddedo);
                $result['idpersona'] = $persona->data[0]['idpersona'];
                $result['nombreapellidos'] = $persona->data[0]['nombreapellidos'];
                $result['denomdedo'] = $huella[0]['denomdedo'];
                $result['foto'] = $persona->data[0]['foto'];
                $result['imagen'] = $huella[0]['imagen'];
                $result['numid'] = $persona->data[0]['numid'];
                $result['sexo'] = $persona->data[0]['denomsexo'];
                $this->response->success = true;
                $this->response->data = $result;
            } else {
                $this->response->success = false;
            }
            $this->responseRequest();
        } catch (Exception $e) {

        }
    }
}