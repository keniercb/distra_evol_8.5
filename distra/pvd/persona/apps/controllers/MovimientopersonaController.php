<?php
$dirwww = $_SERVER['DOCUMENT_ROOT'];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dirrelmt = '/';
//Direccion absoluta del marco de trabajo
//$dirabsmt = str_replace('//', '/', dirname($dirwww . '..') . '/' . $dirrelmt);
$dirabsmt = str_replace("//", "/", str_replace('web','',$dirwww). $dirrelmt);
$config['include_path'] = get_include_path();
//$config['include_path'] .= '' . PATH_SEPARATOR . $dirabsmt . 'apps/pvd/persona/arquitectura/controllers';
$config["include_path"] .= "" . PATH_SEPARATOR . $dirabsmt . "apps/pvd/comun/controllers";
//Se inicializa el include path de php a partir de la variable de configuracion
set_include_path($config['include_path']);

/**
 * Class MovimientopersonaController
 */
class MovimientopersonaController extends ControladorBase
{
    /**
     * @var
     */
    protected $objOcupacion;

    /**
     *
     */
    public function init()
    {
        parent::init();
    }

    /**
     *
     */
    function movimientopersonaAction()
    {
        $this->cargaInicial('persona', 'movimientopersona');
        $this->render();
    }

    /**
     *
     */
    function darBajaAction()
    {
        try {
            $values = json_decode($this->_getParam('arrIds'));
            $objModel = new DatPersonaentidadModel();
            $ids = array();
            $indexData = array();
            foreach ($values as $v) {
                array_push($ids, $v->idpersonaentidad);
                $indexData[$v->idpersonaentidad] = array('fbaja' => $v->fbaja, 'idmotivobaja' => $v->idmotivobaja);
            }
            $objModel->darBaja($ids, $indexData);
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    /**
     *
     */
    public function responseRequest()
    {
        $this->response->success = isset($this->response->success) ? $this->response->success : true;
        echo json_encode($this->response);
    }

    /**
     * @param $error
     */
    public function responseExceptions($error)
    {
        $this->response->success = false;
        $this->response->codigo = $error->getCode();
        $this->response->mensaje = $error->getMessage();
        $this->response->traza = $error->getTraceAsString();
        $this->responseRequest();
    }

    /**
     * @throws Exception
     */
    function movimientoCargoAction()
    {
        $index = array(
            'idsituacion', 'fdesde', 'fhasta', 'idarea', 'area', 'idcargo', 'cargo', 'idpersonaentidad',
            'idsituacionlaboralp');
        $personaEntidad = array();
        $situacionActual = array();
        $newSituacion = array();
        foreach ($index as $k) {
            switch ($k) {
                case 'idsituacionlaboralp':
                    $situacionActual = json_decode($this->_getParam($k));
                    break;
                case 'idpersonaentidad':
                    $personaEntidad = json_decode($this->_getParam($k));
                    break;
                default:
                    $newSituacion[$k] = $this->_getParam($k, null);
                    break;
            }
        }
        try {
            $objModel = new DatSituacionModel();
            $objModel->movimientoSituacion($situacionActual, $personaEntidad, $newSituacion);
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    function modificarSituacionLaboralPersonaAction()
    {
        $index = array(
            'idsituacion', 'fdesde', 'fhasta', 'idarea', 'area', 'idcargo', 'cargo', 'idprocedenciasocial',
            'idpersonaentidad', 'idsituacionlaboralp');
        $personaEntidad = array();
        $situacionActual = array();
        $newSituacion = array();
        foreach ($index as $k) {
            switch ($k) {
                case 'idsituacionlaboralp':
                    $situacionActual = json_decode($this->_getParam($k));
                    break;
                case 'idpersonaentidad':
                    $personaEntidad['ids'] = json_decode($this->_getParam($k));
                    break;
                case 'idprocedenciasocial':
                    $personaEntidad['params'][$k] = $this->_getParam($k, null);
                    break;
                default:
                    $newSituacion[$k] = $this->_getParam($k, null);
                    break;
            }
        }
        try {
            $objPersonaEntidad = new DatPersonaentidadModel();
            $objPersonaEntidad->updateData($personaEntidad['ids'], $personaEntidad['params']);
            $objSituacionLaboral = new DatSituacionModel();
            $objSituacionLaboral->updateSituacionActual($situacionActual, $newSituacion);
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    /**
     * @throws Exception
     */
    function darAltaAction()
    {
        try {
            if ($this->_getParam('idpersona', null) !== null) {
                $index = array(
                    'idsituacion', 'fdesde', 'fhasta', 'identidad', 'entidad', 'idarea', 'area', 'idcargo', 'cargo',
                    'idprocedenciasocial', 'idpersona', 'noalta');
                $dataAlta = array();
                $dataSituacionLaboral = array();
                $arrCargos = array();
                foreach ($index as $k) {
                    /*list($persona, $dataAlta, $dataSituacionLaboral, $arrCargos) = $this->setAlta($k, $dataAlta,
                        $dataSituacionLaboral, $arrCargos);*/
                    switch ($k) {
                        case 'idpersona':
                            $persona = json_decode($this->_getParam('idpersona', null));
                            break;
                        case 'identidad':
                        case 'entidad':
                        case 'idprocedenciasocial':
                            $dataAlta[$k] = $this->_getParam($k, null);
                            break;
                        case 'fdesde':
                            $dataAlta[$k] = $this->_getParam($k);
                            $dataSituacionLaboral[$k] = $this->_getParam($k);
                            break;
                        case 'fhasta':
                            $dataSituacionLaboral[$k] = $this->_getParam($k);
                            break;
                        case 'idcargo':
                            if ($this->_getParam($k)) {
                                $arrCargos[] = $this->_getParam($k);
                                $dataSituacionLaboral[$k] = $this->_getParam($k);
                            }
                            break;
                        case 'noalta':
                            $dataSituacionLaboral[$k] = $this->_getParam($k);
                            break;
                        default:
                            $dataSituacionLaboral[$k] = $this->_getParam($k, null);
                            break;
                    }
                }
                $objModel = new DatPersonaentidadModel();
                $objModel->darAltaEntidad($persona, $dataAlta, $dataSituacionLaboral);
                $objSituacion = new DatSituacionModel();
                $objSituacion->syncCompletamientoCargo($arrCargos);
                $this->responseRequest();
            } else {
                throw new Exception('La persona no existe', 3);
            }
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }

    }

    function getPersonasInCargoAction()
    {
        try {
            $this->objSituacion = new DatSituacionModel();
            $filtro = $this->_getParam('query');
            $idEntidad = $this->_getParam('identidad');
            $idcargo = $this->_getParam('idestructura');
            $limit = $this->_getParam('limit', null);
            $start = $this->_getParam('start', 0);
            $this->response = $this->objSituacion->getPersonasConSituacionLaboral(
                $filtro, $idEntidad, $idcargo, $limit, $start
            );
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    function getPersonasToAltaAction()
    {
        $this->objSituacion = new DatSituacionModel();
        try {
            $filtro = $this->_getParam('query', null);
            $idEntidad = $this->_getParam('idestructura', null);
            $limit = $this->_getParam('limit', null);
            $start = $this->_getParam('start', 0);
            $personaToAlta = $this->objSituacion->getPersonaToAlta($filtro, $idEntidad, $limit, $start);
            $this->response = $personaToAlta;
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    function getPersonaToMovAction()
    {
        $this->objSituacion = new DatSituacionModel();
        try {
            $filtro = $this->_getParam('query');
            $idEntidad = $this->_getParam('identidad');
            $idCargo = $this->_getParam('idestructura');
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start', 0);
            $this->response = $this->objSituacion->getPersonaToMov($filtro, $idEntidad, $idCargo, $limit, $start);
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    function removeRegisterAction()
    {
        try {
            $values = json_decode($this->_getParam('arrIds'));
            if ($this->_getParam('all') === 'true') {
                $objModel = new DatPersonaentidadModel();
                $objModel->removeRegister($values);
            } else {
                $objModel = new DatSituacionModel();
                $objModel->removeRegister($values);
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    function getReservaCargoAction()
    {
        try {
            $this->objReserva = new DatReservacargoModel();
            $filtro = $this->_getParam('query');
            $idestructura = $this->_getParam('idestructura', null);
            $limit = $this->_getParam('limit', null);
            $start = $this->_getParam('start', 0);
            $reservasCargo = $this->objReserva->getReservasCargo($filtro, $idestructura, $limit, $start);
            $this->response = $reservasCargo;

        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    function getPersonaToReservaAction()
    {
        $this->objReserva = new DatReservacargoModel();
        try {
            $filtro = $this->_getParam('query');
            $idEntidad = $this->_getParam('identidad');
            $idCargo = $this->_getParam('idestructura');
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start', 0);
            $personaToReserva = $this->objReserva->getPersonaToReserva($filtro, $idEntidad, $idCargo, $limit, $start);
            $this->response = $personaToReserva;
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
        $this->responseRequest();
    }

    function addReservaCargoAction()
    {
        try {
            $index = array(
                'idpersonaentidad', 'idcargo', 'fdesde', 'fhasta', 'sustituto',);
            $arrData = array();
            foreach ($index as $k) {
                switch ($k) {
                    default:
                        $arrData[$k] = $this->_getParam($k);
                        break;
                }
            }
            $objModel = new DatReservacargoModel();
            $objModel->addReservaCargo(array($arrData));
            $this->responseRequest();

        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    function modReservaCargoAction()
    {
        try {
            $index = array(
                'idreservacargo', 'idpersonaentidad', 'idcargo', 'fdesde', 'fhasta', 'sustituto',);
            $arrData = array();
            $ids = array();
            foreach ($index as $k) {
                switch ($k) {
                    case 'idreservacargo':
                        $ids[] = $this->_getParam($k);
                        break;
                    default:
                        $arrData[$k] = $this->_getParam($k);
                        break;
                }
            }
            $objModel = new DatReservacargoModel();
            $objModel->modReservaCargo(array($this->_getParam('idreservacargo') => $arrData), $ids);
            $this->responseRequest();

        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    function removeReservaCargoAction()
    {
        try {
            $values = json_decode($this->_getParam('arrIds'));
            $objModel = new DatReservacargoModel();
            $objModel->delReservaCargo($values);
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    function getHistoricoAction()
    {
        try {
            $objModel = new DatSituacionModel();
            $filtro = $this->_getParam('query');
            $idEntidad = $this->_getParam('identidad');
            $idCargo = $this->_getParam('idestructura');
            $limit = $this->_getParam('limit');
            $start = $this->_getParam('start', 0);
            $historico = $objModel->getHistorico($filtro, $idEntidad, $idCargo, $limit, $start);
            $this->response = $historico;
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    function syncCargosOcupacionAction()
    {
        try {
            $objSituacion = new DatSituacionModel();
            $idcargo = Utiles::getArryOfCargos(json_decode($this->_getParam('idestructura')), true);
            $objSituacion->syncCompletamientoCargo($idcargo);
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);

            return;
        }
    }

    /**
     * @param $k
     * @param $dataAlta
     * @param $dataSituacionLaboral
     * @param $arrCargos
     *
     * @return array
     */
    protected function setAlta($k, $dataAlta, $dataSituacionLaboral, $arrCargos)
    {
        switch ($k) {
            case 'idpersona':
                $persona = json_decode($this->_getParam('idpersona', null));
                break;
            case 'identidad':
            case 'entidad':
            case 'idprocedenciasocial':
                $dataAlta[$k] = $this->_getParam($k, null);
                break;
            case 'fdesde':
                $dataAlta[$k] = $this->_getParam($k);
                $dataSituacionLaboral[$k] = $this->_getParam($k);
                break;
            case 'fhasta':
                $dataSituacionLaboral[$k] = $this->_getParam($k);
                break;
            case 'idcargo':
            case 'noalta':
                $dataSituacionLaboral[$k] = $this->_getParam($k);
                if ($this->_getParam($k)) {
                    $arrCargos[] = $this->_getParam($k);
                }
                break;
            default:
                $dataSituacionLaboral[$k] = $this->_getParam($k, null);
                break;
        }

        return array($persona, $dataAlta, $dataSituacionLaboral, $arrCargos);
    }
}