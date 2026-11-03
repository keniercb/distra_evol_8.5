<?php
/**
 * Class ConfigurarproyectoController
 */
class ConfigurarproyectoController extends ZendExt_Controller_Secure
{
    private $_resquest, $_data;

    function init()
    {
        parent::init();
        $this->_data = '';
    }

    function configurarproyectoAction()
    {
        $this->render();
    }

    function getTodosProyectosAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $query = $this->_request->getPost('query');
        $objModel = new DatProyectoModel();
        echo json_encode($objModel->getAllProjects($limit, $start, $query));
    }

    function cargarCbxRcomplejaAction()
    {
        $denom = $this->_request->getPost('query');
        $datos = $this->integrator->reccomplejas->obtenerConfiguraciones($denom);
        echo json_encode($datos);
    }

    function insertarProyectoAction()
    {
        try {
            $r = new StdClass();
            $action = $this->_request->getPost('action');
            $idproyecto = $this->_request->getPost('idproyecto');
            $idconfiguracion = $this->_request->getPost('idconfiguracion');
            $denominacion = $this->_request->getPost('denominacion');
            if ($action == 'add') {
                $val = DatProyecto::verifExist(
                    $this->_request->getPost('idproyecto'), $this->_request->getPost('denominacion')
                );
                if (!$val) {
                    $objDatProyecto = new DatProyecto();
                    $objDatProyecto->idproyecto = strtolower($idproyecto);
                    $objDatProyecto->idconfiguracion = $idconfiguracion;
                    $objDatProyecto->denominacion = $denominacion;
                    $objDatProyecto->save();
                } else {
                    echo('{"codMsg":3,"mensaje": "El proyecto que quiere adicionar ya existe."}');
                }
            } else {
                $objDatProyecto = new DatProyecto();
                $p = $objDatProyecto->getById($idproyecto);
                $p->idconfiguracion = $idconfiguracion;
                $p->denominacion = $denominacion;
                $p->save();
            }
            $r->success = true;
            echo json_encode($r);

        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    function updateProyectoAction()
    {
        try {
            $r = new StdClass();
            $idproyecto = $this->_request->getPost('idproyecto');
            $fdatos = $this->_request->getPost('fdatos');
            if ($idproyecto) {
                $fuente = ($fdatos == 'Si') ? 1 : 0;
                DatProyecto::updateProyecto($idproyecto, $fuente);
            }
            $r->success = true;
            echo json_encode($r);

        } catch (Exception $e) {
            throw $e;
        }
    }

    function eliminarProyectoAction()
    {
        if ($this->_request->getPost('idproyecto')) {
            $r = new StdClass();
            $r = new StdClass();
            $objModel = new DatProyectoModel();
            $objModel->Eliminar($this->_request->getPost('idproyecto'));
            $r->success = true;
        } else {
            $r->success = false;
        }
        echo json_encode($r);
    }

    function loadConceptsAction()
    {
        $idproyecto = $this->_request->getPost('idproyecto');
        $idpadre = $this->_request->getPost('idproyectoconcepto');
        $objDatProyectoConcepto = new DatProyectoconceptoModel();
        $format = ($idpadre == 'root') ? true : false;
        $r = $objDatProyectoConcepto->getConceptsByProject($idproyecto, $idpadre, $format);

        echo json_encode($r);
    }

    function addConceptAction()
    {
        try {
            $r = new StdClass();
            $arrCamposBD = array();
            $idproyectoconcepto = $this->_getParam('idproyectoconcepto') ? $this->_getParam(
                'idproyectoconcepto'
            ) : null;
            $arrCamposBD['idproyecto'] = $this->_getParam('idproyecto');
            $arrCamposBD['idpadre'] = $this->_getParam('idpadre');
            $arrCamposBD['denominacion'] = $this->_getParam('denominacion');
            $arrCamposBD['tipo'] = $this->_getParam('tipo');
            $arrCamposBD['iconcls'] = $this->_getParam('iconCls');
            $arrCamposBD['descripcion'] = $this->_getParam('descripcion') ? $this->_getParam('descripcion') : null;
            $position = $this->_getParam('position');
            $order = $this->_getParam('orden');
            $objModel = new DatProyectoconceptoModel();
            $objModel->addConcept($idproyectoconcepto, $arrCamposBD, $position, $order);
            $r->codigo = 1;
        } catch (Exception $e) {
            $r->codigo = $e->getCode();
            $r->traza = $e->getTraceAsString();
        }
        echo json_encode($r);
    }

    function saveConceptAction()
    {
        $arrCamposBD = array();
        $idproyectoconcepto = $this->_getParam('idproyectoconcepto') ? $this->_getParam(
            'idproyectoconcepto'
        ) : null;
        $arrCamposBD['idproyecto'] = $this->_getParam('idproyecto') ? $this->_getParam('idproyecto') : null;
        $arrCamposBD['idpadre'] = $this->_getParam('idpadre');
        $arrCamposBD['denominacion'] = $this->_getParam('denominacion');
        $arrCamposBD['descripcion'] = $this->_getParam('descripcion') ? $this->_getParam('descripcion') : null;
        $arrCamposBD['tipo'] = $this->_getParam('tipo');
        $arrCamposBD['propiedades'] = $this->_getParam('propiedades');
        $arrCamposBD['iconcls'] = $this->_getParam('iconcls');
        $arrCamposBD['codigo'] = $this->_getParam('funcionesyeventos');
        $arrCamposBD['cmpempleado'] = $this->_getParam('cmpempleado');
        $objModel = new DatProyectoconceptoModel();
        $r['idproyectoconcepto'] = $objModel->saveConcept($idproyectoconcepto, $arrCamposBD);
        $r['success'] = true;
        echo json_encode($r);
    }

    function deleteConceptAction()
    {
        try {
            $r = new StdClass();
            $idproyectoconcepto = $this->_request->getPost('idproyectoconcepto');
            $objModel = new DatProyectoconceptoModel();
            $r->codigo = ($objModel->Eliminar($idproyectoconcepto)) ? 1 : 0;
        } catch (Exception $e) {
            $r->codigo = $e->getCode();
            $r->traza = $e->getTraceAsString();
        }
        echo json_encode($r);
    }

    function getIconsAction()
    {
        try {
            $objModel = new ConfigurarproyectoModel();
            $this->_resquest->datos = $objModel->getListOfIcons();
            $this->_resquest->cant = count($this->_resquest->datos);
        } catch (Exception $e) {
            $this->generateErrorReport($e);
        }
        $this->returnRequest();
    }

    function generateErrorReport($objError)
    {
        $this->_resquest->codigo = $objError->getCode();
        $this->_resquest->mensaje = $objError->getMessage();
    }

    function returnRequest()
    {
        echo json_encode($this->_resquest);
    }

    function getDenomComponentAction()
    {
        try {
            $objModel = new NomObjProperty();
            $this->_resquest->datos = $objModel->getListOfCmp();
        } catch (Exception $e) {
            $this->generateErrorReport($e);
        }
        $this->returnRequest();
    }

    function getPropertysAction()
    {
        try {
            $cmp = $this->_request->getPost('cmp');
            $idproyectoconcepto = $this->_request->getPost('idproyectoconcepto');
            $objTreePropertys = new NomObjProperty();
            $objModel = new DatProyectoconceptoModel();
            $this->_resquest->datos = $objModel->getPropertys(
                $idproyectoconcepto, $objTreePropertys->getPropertysByCmp($cmp)
            );
        } catch (Exception $e) {
            $this->generateErrorReport($e);
        }
        $this->returnRequest();
    }

    function getEventsAction()
    {
        try {
            $cmp = $this->_request->getPost('cmp');
            $idproyectoconcepto = $this->_request->getPost('idproyectoconcepto');
            $objTreePropertys = new NomObjProperty();
            $objModel = new DatProyectoconceptoModel();
            $this->_resquest->datos = $objModel->getEventsByProject(
                $idproyectoconcepto, $objTreePropertys->getEventsByCmp($cmp)
            );
        } catch (Exception $e) {
            $this->generateErrorReport($e);
        }
        $this->returnRequest();
    }

    function generateProjectAction()
    {
        try {
            $idproyecto = $this->_request->getPost('idproyecto');
            $objModel = new ConfigurarproyectoModel();
            $objModel->generateProject($idproyecto);
            $this->_resquest->succes = true;
        } catch (Exception $e) {
            $this->generateErrorReport($e);
        }
        $this->returnRequest();
    }

    function getTreeConceptByRolAction()
    {
        try {
            if ($this->_getParam('idrol') != '') {
                $idproyecto = $this->_request->getPost('idproyecto');
                $objModel = new DatProyectorolModel();
                $this->_resquest = $objModel->getTreeConceptByRolToCompartimentacion(
                    $this->_getParam('idrol'), $idproyecto
                );
            } else {
                $this->_resquest = false;
            }
        } catch (Exception $e) {
            $this->generateErrorReport($e);
        }
        $this->returnRequest();
    }

    function getRolesAction()
    {
        try {
            $roles = $this->integrator->seguridad->getTodosRoles();
            if ($roles) {
                $this->_resquest->datos = $roles;
            } else {
                $this->_resquest->datos = array();
            }
        } catch (Exception $e) {
            $this->generateErrorReport($e);
        }
        $this->returnRequest();
    }

    function saveCompartimentacionByRolAction()
    {
        try {
            if ($this->_getParam('idrol') != '') {
                $objModel = new DatProyectorolModel();
                $datos = json_decode($this->_getParam('arrMod'));
                $indixes = array(
                    'idproyectorol' => '', 'idproyectoconcepto' => '', 'activo' => 0, 'obligatorio' => 0, 'add' => 0,
                    'mod' => 0, 'del' => 0);
                $arrAdd = array();
                $arrMods = array();
                $arrIds = array();
                foreach ($datos as $v) {
                    $p = count($arrAdd);
                    foreach ($indixes as $i => $l) {
                        switch ($i) {
                            case 'idproyectorol':
                                if ($v->$i != '') {
                                    $arrIds[] = $v->$i;
                                }
                                break;
                            case 'add':
                            case 'mod':
                            case 'del':
                            case 'activo':
                            case 'obligatorio':
                                if ($v->idproyectorol != '') {
                                    $arrMods[$v->idproyectorol][$i] = ($v->$i == 1) ? 1 : 0;
                                } else {
                                    $arrAdd[$p][$i] = ($v->$i == 1) ? 1 : 0;
                                }
                                break;
                            default:
                                if ($v->idproyectorol != '') {
                                    $arrMods[$v->idproyectorol][$i] = $v->$i;
                                } else {
                                    $arrAdd[$p][$i] = $v->$i;
                                }
                                break;
                        }
                    }
                }
                $objModel->updateCompartimentacionByRol($arrAdd, $arrIds, $arrMods, $this->_getParam('idrol'));
                $this->_resquest->codigo = 1;
            }
        } catch (Exception $e) {
            $this->generateErrorReport($e);
        }
        $this->returnRequest();
    }

    function getNomCompartimentacionAction()
    {
        try {
            $objModel = new NomCompartimentacionModel();
            echo json_encode($objModel->getCompartimentaciones());
        } catch (Exception $e) {

        }
    }

    function loadCompartimentacionAction()
    {
        try {
            $r = new StdClass();
            $objModel = new ConfigurarproyectoModel();
            $r->datos = $objModel->getCompartimentacion();
            echo json_encode($r);
        } catch (Exception $e) {

        }
    }

    function saveCompartimentacionInfoByRolUserAction()
    {
        try {
            $r = new StdClass();
            $datos = json_decode($this->_getParam('changes'));
            $newCompRol = array();
            $modCompRol = array();
            $newCompUser = array();
            $modCompUser = array();
            $idsRols = array();
            $idsUser = array();
            //Extraccion de los datos
            foreach ($datos as $v) {
                switch ($v->roluser) {
                    case 'roles':
                        if (!empty($v->idcompartimentacion)) {
                            array_push($idsRols, $v->idcompartimentacion);
                            $modCompRol[$v->idcompartimentacion]['idcompartimentacion'] = $v->idnomcompart;
                        } else {
                            $p = count($newCompRol);
                            $newCompRol[$p]['idrol'] = $v->idroluser;
                            $newCompRol[$p]['idcompartimentacion'] = $v->idnomcompart;
                        }
                        break;
                    case 'users':
                        if (!empty($v->idcompartimentacion)) {
                            array_push($idsUser, $v->idcompartimentacion);
                            $modCompUser[$v->idcompartimentacion]['idcompartimentacion'] = $v->idnomcompart;
                        } else {
                            $p = count($newCompUser);
                            $newCompUser[$p]['idusuario'] = $v->idroluser;
                            $newCompUser[$p]['idcompartimentacion'] = $v->idnomcompart;
                        }
                        break;
                }
            }
            $objRolComp = new DaRolcompartimentacionModel();
            $objRolComp->addCompartimentacion($newCompRol);
            $objRolComp->modCompartimentacion($modCompRol, $idsRols);
            $objUserComp = new DatUsuariocompartimentacionModel();
            $objUserComp->addCompartimentacion($newCompUser);
            $objUserComp->modCompartimentacion($modCompUser, $idsUser);
            $r->codigo = 1;
            echo json_encode($r);
        } catch (Exception $e) {
            print_r($e);
            die;
        }
    }

    function registerConceptBaseAction()
    {
        try {
            $r = new StdClass();
            $data = json_decode($this->_getParam('data'));
            $this->_data = $data;
            $objModel = new NomConceptoModel();
            $objModel->addConcept($data);
            $r->codigo = 1;
        } catch (Exception $e) {
            $r->codigo = $e->getCode();
            $r->traza = $e->getTraceAsString();
        }
        echo json_encode($r);
    }

    function exportConceptAction()
    {
        try {
            $objModel = new NomConceptoModel();
            $data = json_decode($this->_getParam('data'));
            $objModel->exportConcept($data);
        } catch (Exception $e) {
            throw $e;
        }
    }

    function importConceptAction()
    {
        try {
            $objExport = new NomConceptoModel();

            $resp = $objExport->importConcept(
                $_FILES['conceptfile']
            );
            $this->response->success = true;

            echo json_encode($this->response);
        } catch (Exception $e) {
            throw $e;
        }
    }

    function getCenceptsBaseAction()
    {
        try {
            $limit = $this->_getParam('limit') != '' ? $this->_getParam('limit') : 15;
            $start = $this->_getParam('start') != '' ? $this->_getParam('start') : 0;;
            $filtro = $this->_getParam('query') != '' ? $this->_getParam('query') : null;
            $objModel = new NomConceptoModel();
            $data = $objModel->getConceptosDenominacion($filtro || null, $limit, $start);
            echo json_encode($data);
        } catch (Exception $e) {
            print_r($e);
            die;
        }
    }

    function addConceptBaseToProjectAction()
    {
        try {
            $r = new StdClass();
            $idProject = $this->_getParam('idproyecto');
            $idPadre = $this->_getParam('idpadre');
            $arrConcept = json_decode($this->_getParam('arrConcept'));
            $objModel = new DatProyectoconceptoModel();
            $objModel->cloneTreeConcepto($idProject, $idPadre, $arrConcept);
            $r->codigo = 1;
        } catch (Exception $e) {
            print_r($e);
            die;
        }
        echo json_encode($r);
    }
}