<?php

/**
 * PenalizacionesDService
 *
 * @package    Domain.
 * @subpackage Domain services.
 * @copyright  UCID
 * @version    1.0
 */
class PenalizacionesDService extends ZendExt_Model
{
    private $_penalizacionesRepository, $_gestordocumental, $_estadoDService, $_datosmaestros, $_confcontratacion, $_confpenalizacion;
    private $_datindicador;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->_contrato = new DatContrato();
        $this->_penalizacionesRepository = new PenalizacionesRepository();
        $this->_gestordocumental = new GestorDocumentalComunicationInterface();
        $this->_datosmaestros = new DatosMaestrosComunicationInterface();
        $this->_estadoDService = new PenalizacionEstadoDService();
        $this->_confcontratacion = new ConfContratacionModel();
        $this->_confpenalizacion = new ConfPenalizaciones();
        $this->_datindicador = new DatIndicadorContrato();
        $this->_transicion = new NomTransicion();
        $this->_seguridad = new SeguridadComunicationInterface();
    }

    public function getPenalizaciones($params)
    {

        $result = $this->_penalizacionesRepository->getPenalizaciones($params);
        $listPenalizaciones = array();
        foreach ($result['datos'] as $value) {
            if (array_key_exists($value, $listPenalizaciones)) {
                continue;
            }

            $listPenalizaciones[] = $value;
        }
        return array('cant' => $result['cant'],'datos'=> $listPenalizaciones,
            'estados_penalizacion' => $this->getTransicionesProceso('penalizacion'));
    }

    function getPenalizacionesDocs($idespacioTrabajo
    ) {
        $result = [];
        if ($this->existeGestorDocumental() && !empty($idespacioTrabajo)) {

            $result = $this->_gestordocumental->getContenido(
                array('idespaciotrabajo' => $idespacioTrabajo)
            );
        }
        return $result;
    }

    function adicionarPenalizacion($params)
    {
//        print_r($params);die;
        try {

            $params_values = json_decode($params['values']);
            $existe=Doctrine::getTable('DatPenalizaciones')->findByDql(
                "idtipopenalidad=".$params_values->idtipopenalidad." AND idarribo=".$params_values->idarribo
            );
            if(!$existe->count()) {
                $penalizacion = new DatPenalizaciones();
                $penalizacion->idarribo = $params_values->idarribo == '' ? null : $params_values->idarribo;
                $penalizacion->idtipopenalidad = $params_values->idtipopenalidad == '' ? null : $params_values->idtipopenalidad;
                $penalizacion->descripcion = $params_values->descripcion == '' ? null : $params_values->descripcion;

//            if (count($_FILES) != 0
//                && $this->_confpenalizacion->getConfig()['activo'] == '1'
//            ) {
//                $this->updateUploadFilesName($params);
//                $saveValues['idespaciotrabajo'] = $this->generateEspacioTrabajo(
//                    $params_values
//                );
//                $this->insertarDocumentos($saveValues['idespaciotrabajo']);
//            }


//            $penalizacion->idespaciotrabajo = $saveValues['idespaciotrabajo']
//            == '' ? null
//                : $saveValues['idespaciotrabajo'];
                $penalizacion->save();
                $this->guardarEstadoInicial($penalizacion->idpenalidad);

                return array('success' => true);
            }else{
                return array('success' => false, 'msg'=> 'Ya el arribo tiene añadida una penalidad de ese tipo.');
            }
        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }

            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function modificarPenalizacion($params
    ) {
        try {
            $params_values = json_decode($params['values']);
            $penalizacion = Doctrine::getTable('DatPenalizaciones')->find(
                $params_values->idpenalidad
            );
            $penalizacion->idarribo = $params_values->idarribo == '' ? null
                : $params_values->idarribo;
            $penalizacion->idtipopenalidad = $params_values->idtipopenalidad
            == '' ? null : $params_values->idtipopenalidad;
            $penalizacion->descripcion = $params_values->descripcion == '' ? null : $params_values->descripcion;

//            if (count($_FILES) != 0) {
//                print('/*entro*/');
//                $this->updateUploadFilesName($params);
//                $saveValues['idespaciotrabajo'] = $this->generateEspacioTrabajo(
//                    $params_values
//                );
//                $this->insertarDocumentos($saveValues['idespaciotrabajo']);
//
//            }
//            $penalizacion->idespaciotrabajo = $saveValues['idespaciotrabajo']
//            == '' ? $params_values->idespaciotrabajo
//                : $saveValues['idespaciotrabajo'];

            $penalizacion->save();
            return array('success' => true);
        } catch (Exception $e) {
            if ($e->getCode() == 335) {
                return;
            }
            return array('code'    => $e->getCode(), 'msg' => $e->getMessage(),
                         'success' => false);
        }
    }

    public function guardarEstadoInicial($idpenalidad)
    {
        try {
            $instance = new PenalizacionEstado();
            $instance->idestado = $this->obtenerEstadoinicial();
            $instance->idpenalidad = $idpenalidad;
            $instance->idusuario = $this->global->Perfil->idusuario;
            $instance->fechainicio = date('d/m/Y');
            $instance->save();
        } catch (Doctrine_Exception $e) {
            throw $e;
        }
    }

    public function obtenerEstadoinicial()
    {
        try {
            $estado = new NomEstado();
            $idestado = $estado->getEstadoInicial()['idestado'];
            if (!$idestado) {
                throw new Exception('No existe el estado inicial.', 333);
            }
            return $idestado;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function eliminarPenalizacion($penalizaciones
    ) {
        $upEx = array();
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        foreach ($penalizaciones as $del) {
            $query
                = "DELETE FROM mod_crmcontratacion.dat_penalizaciones ";
            $query .= " WHERE idpenalidad = " . $del;
            $query .= " RETURNING idpenalidad ";

            $ex = $conexionActual->fetchAll($query);
            if (!$ex) {
                $upEx[] = $del;
            }
        }
        if (empty($upEx)) {
            return array('success' => true);
        }
        return array('success' => false, $upEx);
    }

    private
    function updateUploadFilesName($params
    ) {
        foreach ($_FILES as $k => $file) {
            $id = explode("_new", $k)[1];
            if ($_FILES[$k]['name']) {
                $_FILES[$k]['realname'] = $params['params']["nombre_new" . $id];
            } else {
                unset($_FILES[$k]);
            }
        }
    }

    private
    function generateEspacioTrabajo($params
    ) {
        if ($this->existeGestorDocumental()) {
            $result = $this->_confcontratacion->loadConfPenalizacion();
            if (count($result['config'])) {
                $idespacioGeneral = $result['config']['idespaciotrabajo'];
            }

            if ($idespacioGeneral) {
                return $this->_estadoDService->crearEspacioPenalizaciones(
                    $params, $idespacioGeneral
                );
            }

            return '';
        }
    }

    public
    function existeGestorDocumental()
    {
        try {
            $conf = new ConfContratacionModel();
            $result = $conf->loadconfpenalizaciones();
            if (count($result) && count($result['config'])
                && $result['config']['activo']
                && $this->_gestordocumental->testGD()
            ) {
                return true;
            }
            return false;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public
    function insertarDocumentos($idespaciopenalizacion
    ) {
        try {
            if (count($_FILES) != 0 && $idespaciopenalizacion) {


                $documento = $this->_gestordocumental->saveDocument(
                    $idespaciopenalizacion
                );
                if (count($documento) == 0) {
                    throw new Exception(
                        'Ocurrio un error al salvar el documento.', 335
                    );
                }
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public
    function modificarDocumentos($docs
    ) {
        try {
            foreach ($docs as $doc) {
                $this->_gestordocumental->editDocument(
                    $doc->idnodo, array('nombre' => $doc->nombre)
                );
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    function eliminarDocumentos($docs
    ) {
        try {
            if (count($docs)) {
                $this->_gestordocumental->delFile($docs);
            }
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function cargarContratos($params
    ) {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $and = '';
        $JOIN = '';

        $query
            = "SELECT (c.numero ||' - '|| c.nombre) as nombre, c.idcontrato
                       FROM mod_crmcontratacion.dat_contrato c
                       $JOIN
                       WHERE (c.cumplimientoobligaciones=1 OR 
                                    c.fechafirma <='" . date('d/m/Y')
            . "' AND (c.fechafin>='" . date('d/m/Y')
            . "' OR c.fechafin ISNULL )) AND c.cliente=2 AND c.contratomarco=0";
        $resp = $conexionActual->fetchAll($query);
        return array('datos' => $resp, 'total' => count($resp));
    }

    public function obtenerTiposPenalidades($params)
    {
            $objDoctrine = Doctrine_Manager::getInstance();
            $conexionActual = $objDoctrine->getCurrentConnection();
            $where = '';
            $JOIN = '';

            if ($params['idcontrato']) {
                $where = ' WHERE c.idcontrato = ' . $params['idcontrato'];
                $JOIN
                    = " LEFT JOIN mod_crmcontratacion.dat_contrato c on (tp.denominaciontipocontrato=c.denominaciontipocontrato) ";
            }

            $query
                = "SELECT tp.nombre as tipopenalidad, tp.idtipopenalidad, tp.denominaciontipocontrato, tp.porciento
                       FROM mod_crmcontratacion.nom_tipopenalidad tp
                       $JOIN" . $where;

            //   print_r($query);die;

            $resp = $conexionActual->fetchAll(
                $query
            );
            return array('datos' => $resp, 'total' => count($resp));

    }

    public function cargarArribos($params)
    {
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $where = '';
        if ($params['idcontrato']) {
            $where = ' WHERE a.idcontrato = ' . $params['idcontrato'];
        }
        $query
            = "SELECT a.descripcion, a.idarribo
                       FROM mod_crmcontratacion.dat_arribo a " . $where;
        $resp = $conexionActual->fetchAll($query);
        return array('datos' => $resp, 'total' => count($resp));
    }

    public function cargarPorcientoPenalidad($params)
    {
//        print_r($params);die;
        $objDoctrine = Doctrine_Manager::getInstance();
        $conexionActual = $objDoctrine->getCurrentConnection();
        $where = '';
        $JOIN = '';
        if ($params['idtipopenalidad']) {
            $where = ' WHERE tp.idtipopenalidad = ' . $params['idtipopenalidad'];
        }
        $query
            = "SELECT tp.porciento
                       FROM mod_crmcontratacion.nom_tipopenalidad tp" . $where;
        $resp = $conexionActual->fetchAll($query);

        return array('datos' => $resp, 'total' => count($resp));
    }

    public function getArrayRolsIds()
    {
        $global = ZendExt_GlobalConcept::getInstance();
        $rolsArray = $this->_seguridad->getRolsByUser(
            $global->Perfil->idusuario
        );
        $ids = array();
        foreach ($rolsArray as $rol) {
            if (is_numeric($rol['idrol'])) {
                $ids [] = $rol['idrol'];
            }
        }
        return $ids;
    }

    private function getTransicionesProceso($idproceso)
    {
        $roles = $this->getArrayRolsIds();
        $result = $this->_transicion->getEstadoTransicionesPermisos(
            $idproceso, $roles, true, $this->global->Estructura->idestructura
        );
//        print_r($result);die;
        return $this->changeResponse($result);
    }

    private function changeResponse($result)
    {
        foreach ($result as &$value) {
            $transicionesAutorizadas = array();
            foreach ($value['NomTransicion'] as $val) {
//                print_r($val);die;
                if (empty($val['DatRolTransicion'])
                    || $val['idestadofinal'] == $value['idestado']
                ) {
                    continue;
                }
                array_push(
                    $transicionesAutorizadas,
                    array('idestado'  => $val['idestadofinal'],
                        'notificar' => $val['notificar'])
                );
//                array_push($transicionesAutorizadas, $val['idestadofinal']);
            }

            unset($value['NomTransicion']);
            $value['transiciones'] = $transicionesAutorizadas;
            $value['acciones'] = Zend_Json::decode($value['acciones']);
        }
        return $result;
    }
}






















