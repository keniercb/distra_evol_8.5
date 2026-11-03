<?php
/**
 * Created by PhpStorm.
 * User: olorenzo
 * Date: 26/05/16
 * Time: 11:45
 */
class NomencladoresController extends ZendExt_Controller_Secure
{
    protected $_response;
    protected $_objSituacion;

    /**
     * Constructor
     */
    function init()
    {
        parent::init();
    }

    /**
     *
     */
    public function responseRequest()
    {
        $this->_response->success = TRUE;
        if (isset($this->_response->success)) {
            $this->_response->success = $this->_response->success;
        }
        echo json_encode($this->_response);
    }

    /**
     * @param $error
     */
    public function responseExceptions($error)
    {
        $this->_response->success = FALSE;
        $this->_response->codigo = $error->getCode();
        $this->_response->mensaje = $error->getMessage();
        $this->_response->traza = $error->getTraceAsString();
        $this->responseRequest();
    }

    /**
     *
     */
    function nomencladoresAction()
    {
        $vioc = ZendExt_IoC_Inter::getInstance();
        $this->view->plantilla = $vioc->maestro->mostrarIUPlantilla();
        $this->render();
    }

    /**
     * Obtiene el listado de los tipos de contrato
     * @return Arreglo con todos los tipos de contrato
     * @author Yaricel Guerra Velázquez
     */
    function getTiposContratoAction()
    {
        $modeloNegocio = new NomTipocontratoModel();
        $arr = $modeloNegocio->getTiposContrato(
            $this->_getParam('denominacion'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    function getSuplementosAction()
    {
        $modeloNegocio = new ConfSuplementoModel();
        $arr = $modeloNegocio->getSuplementos(
            $this->_getParam('denominacion'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    public function guardarSuplementoAction()
    {
        $modeloNegocio = new ConfSuplementoModel();
        $modeloNegocio->guardarSuplemento($this->_getParam('idplantilla'));
        echo Zend_Json::encode(true);
    }

    public function deleteSuplementoAction()
    {
        $idsup = $this->_request->getPost('idsuplemento');
        $idsuplemento = json_decode(stripslashes($idsup));
        $respuesta = true;
        foreach ($idsuplemento as $p) {
            $obj = new ConfSuplementoModel();
            $r = $obj->deleteSuplemento($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adicionar tipo de contrato
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function addTipoContratoAction()
    {
        $obj = new NomTipocontratoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addTipoContrato(
                $this->_getParam('denominacion'),
                $this->_getParam('plantilla'),
                $this->_getParam('descripcion'),
                $this->_getParam('determinado'),
                $this->_getParam('idplantilla')
            );
            echo Zend_Json::encode(true);
        } else {
            echo Zend_Json::encode(false);
        }
    }

    /**
     * Modificar tipo de contrato
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function updateTipoContratoAction()
    {
        $obj = new NomTipocontratoModel();
        $r = $obj->updateTipoContrato(
            $this->_getParam('idtipocontrato'),
            $this->_getParam('denominacion'),
            $this->_getParam('plantilla'),
            $this->_getParam('descripcion'),
            $this->_getParam('determinado'),
            $this->_getParam('idplantilla')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar tipos de contratos
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function deleteTipoContratoAction()
    {
        $tiposcontratos = $this->_request->getPost('tiposcontrato');
        $tiposcontrato = json_decode(stripslashes($tiposcontratos));
        $respuesta = true;
        foreach ($tiposcontrato as $p) {
            $obj = new NomTipocontratoModel();
            $r = $obj->deleteTipoContrato($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Obtiene el listado de las plantillas
     * @return Arreglo con todas las plantillas
     * @author Yaricel Guerra Velázquez
     */
    function getPlantillasAction()
    {
        $modeloNegocio = new NomTipocontratoModel();
        $idtipoplantilla = $this->_request->getPost('idtipoplantilla');
        $arr = $modeloNegocio->getPlantillasByIdTipoplantilla(
            $idtipoplantilla
        );
        echo Zend_Json::encode($arr);
    }

    public function getTiposPlantillaAction()
    {
        $modeloNegocio = new NomTipocontratoModel();
        $datos = $modeloNegocio->getPlantillasByIdTipoplantilla($this->_request->getPost('idconfiguracion'));
        echo Zend_Json::encode($datos);
    }

    /////////////////////// Situación laboral//////////////////////////////

    private function getInstanceOf()
    {
        return $this->_objSituacion instanceof NomSituacionModel
            ? $this->_objSituacion
            : new NomSituacionModel();
    }

    /**
     *
     */
    public function getAllSituationAction()
    {
        $this->_objSituacion = $this->getInstanceOf();
        try {
            $datos = $this->_objSituacion->getAllSituation(
                $this->_getParam('activo', true),
                $this->_getParam('asociadocargo', null)
            );
            $this->_response = $datos;
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }


    /**
     *
     */
    public function addSituationAction()
    {
        $values = json_decode($this->_request->getPost('values'));

        try {
            $obj->idpadre = $values->idpadre;
            $obj->asociadocargo = $values->asociadocargo;
            if ($values->denominacion != '') {
                $obj->denominacion = $values->denominacion;
            } else {
                throw new Exception("El campo denominación está vacío.");
            }
            if ($values->color != '' && $values->color != 'Seleccione...') {
                $obj->color = $values->color;
            } else {
                $obj->color = null;
            }
            if ($values->descripcion != '') {
                $obj->descripcion = $values->descripcion;
            } else {
                $obj->descripcion = null;
            }
            if ($values->fdesde != '') {
                $fi = explode('/', $values->fdesde);
                $obj->fdesde = $fi[2] . $fi[1] . $fi[0];
            } else {
                throw new Exception("El campo fecha está vacío.");
            }
            if ($values->fhasta != '') {
                $ff = explode('/', $values->fhasta);
                $obj->fhasta = $ff[2] . $ff[1] . $ff[0];
            } else {
                $obj->fhasta = null;
            }
            $objModel = new NomSituacionModel();
            if ($objModel->addSituation($obj)) {
                $this->_response->success = true;
                $this->_response->mensaje = "La situacion laboral ha sido adicionado satisfactoriamente.";
            } else {
                $this->_response->success = false;
                $this->_response->mensaje = "La situacion laboral que quiere adicionar ya existe.";
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     *
     */
    public function changeSituationAction()
    {
        $idsituacion = $this->_request->getPost('idsituacion');
        $values = json_decode($this->_request->getPost('values'));
        if ($values->color != '' && $values->color != 'Seleccione...') {
            $values->color = $values->color;
        } else {
            $values->color = null;
        }
        try {
            $objModel = new NomSituacionModel();
            $result = $objModel->changeSituation($idsituacion, $values);
            if ($result) {
                $this->_response->success = true;
                $this->_response->mensaje = "La situacion laboral ha sido modifcado satisfactoriamente.";
            } else {
                $this->_response->success = false;
                $this->_response->mensaje = "La situacion laboral que quiere modificar ya existe.";
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }

    /**
     *
     */
    public function removeSituationAction()
    {
        try {
            $arrIds = json_decode($this->_request->getPost('idsituacion'));
            if (!empty($arrIds) && is_array($arrIds)) {
                //$obj->idsituacion = $arrIds;
            } else {
                throw new Exception("El arreglo de idsituacion est&aacute; vacio.");
            }
            $objModel = new NomSituacionModel();
            foreach ($arrIds as $value) {
                $result = $objModel->removeSituation($value);
            }
            if ($result->exception == 0) {
                $this->_response->success = true;
            } else {
                $this->_response->success = false;
            }
            $this->responseRequest();
        } catch (Exception $e) {
            $this->responseExceptions($e);
            return;
        }
    }
    /////////////////////// Motivo de baja ////////////////////////////////

    /**
     * Obtiene el listado de motivos de baja
     * @return Arreglo con todos los motivos de baja
     * @author Yaricel Guerra Velázquez
     */
    function getMotivosBajaAction()
    {
        $modeloNegocio = new NomMotivobajaModel();
        $arr = $modeloNegocio->getMotivos(
            $this->_getParam('id'),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar motivos de baja
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function addMotivoBajaAction()
    {
        $obj = new NomMotivobajaModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addMotivo(
                $this->_getParam('denominacion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('descripcion'),
                $this->_getParam('idpadre'),
                $this->_getParam('fluctuacion')
            );
            $this->_enviarNotificacionCorrecta();
        } else
            echo Zend_Json::encode(false);
    }

    /**
     * Modifica motivos de baja
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function updateMotivoBajaAction()
    {
        $obj = new NomMotivobajaModel();
        $r = $obj->updateMotivo(
            $this->_getParam('idmotivobaja'),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('descripcion'),
            $this->_getParam('fluctuacion')
        );

        echo Zend_Json::encode($r);
    }

    /**
     * Elimina motivos de baja
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function deleteMotivoBajaAction()
    {
        $obj = new NomMotivobajaModel();
        $resp = $obj->deleteMotivo($this->_getParam('idmotivobaja'));
        echo json_encode($resp);
    }

    //////////////////// Motivo de movimiento ////////////////////////////////
    /**
     * Obtiene el listado de motivos de movimiento
     * @return Arreglo con todos los motivos de movimiento
     * @author Yaricel Guerra Velázquez
     */
    function getMotivosMovimientoAction()
    {
        $modeloNegocio = new NomMotivomovimientoModel();
        $arr = $modeloNegocio->getMotivos(
            $this->_getParam('id'),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar motivos de movimiento
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function addMotivoMovAction()
    {
        $obj = new NomMotivomovimientoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addMotivo(
                $this->_getParam('denominacion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('descripcion'),
                $this->_getParam('idpadre')
            );
            $this->_enviarNotificacionCorrecta();
        } else
            echo Zend_Json::encode(false);
    }

    /**
     * Modifica motivos de movimiento
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function updateMotivoMovAction()
    {
        $obj = new NomMotivomovimientoModel();
        $r = $obj->updateMotivo(
            $this->_getParam('idmotivomovimiento'),
            $this->_getParam('denominacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('descripcion')
        );

        echo Zend_Json::encode($r);
    }

    /**
     * Elimina motivos de movimiento
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function deleteMotivoMovAction()
    {
        $obj = new NomMotivomovimientoModel();
        $resp = $obj->deleteMotivo($this->_getParam('idmotivomovimiento'));
        echo json_encode($resp);
    }

    //////////////////// Tipo de periodo ////////////////////////////////////
    /**
     * Obtiene el listado de tipos de periodo
     * @return Arreglo con todos los tipos de periodo
     * @author Yaricel Guerra Velázquez
     */
    function getTiposPeriodoAction()
    {
        $modeloNegocio = new NomTipoperiodoModel();
        $arr = $modeloNegocio->getTiposPeriodo(
            $this->_getParam('denominacion'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar tipos de periodo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function addTiposPeriodoAction()
    {
        $obj = new NomTipoperiodoModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addTipoPeriodo(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('cantped')
            );
            $this->_enviarNotificacionCorrecta();
        } else
            echo Zend_Json::encode(false);
    }

    /**
     * Modifica tipos de periodo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function updateTipoPeriodoAction()
    {
        $obj = new NomTipoperiodoModel();
        $r = $obj->updateTipoPeriodo(
            $this->_getParam('idtipoperiodo'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('cantped')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Elimina tipos de periodo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function deleteTipoPeriodoAction()
    {
        $arrtper = $this->_request->getPost('tiposperiodo');
        $tiposperiodo = json_decode(stripslashes($arrtper));
        $respuesta = true;
        $obj = new NomTipoperiodoModel();
        foreach ($tiposperiodo as $p) {
            $r = $obj->deleteTipoPeriodo($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    //////////////////// Periodo ////////////////////////////////////
    /**
     * Obtiene el listado de periodos
     * @return Arreglo con todos los periodos
     * @author Yaricel Guerra Velázquez
     */
    function getPeriodosAction()
    {
        $modeloNegocio = new NomPeriodoModel();
        $arr = $modeloNegocio->getPeriodos(
            $this->_getParam('denominacion'),
            $this->_getParam('idtipoperiodo'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar periodo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function addPeriodoAction()
    {
        $den = $this->_getParam('denominacion');
        $obj = new NomPeriodoModel();
        if (!$obj->existeDenom($den, $this->_getParam('idtipoperiodo'))) {
            $resp = $obj->addPeriodo(
                $den,
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta'),
                $this->_getParam('idtipoperiodo')
            );
            echo Zend_Json::encode($resp);
        } else
            echo Zend_Json::encode(1);
    }

    /**
     * Modificar periodo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function updatePeriodoAction()
    {
        $obj = new NomPeriodoModel();
        $r = $obj->updatePeriodo(
            $this->_getParam('idperiodo'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('idtipoperiodo')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar periodo
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function deletePeriodoAction()
    {
        $per = $this->_request->getPost('periodos');
        $periodos = json_decode(stripslashes($per));
        $respuesta = true;
        $obj = new NomPeriodoModel();
        foreach ($periodos as $p) {
            $r = $obj->deletePeriodo($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    //////////////////// Motivo de interrupción //////////////////////////////
    /**
     * Obtiene el listado de los motivos de interrupción
     * @return Arreglo con todos los motivos de interrupción
     * @author Yaricel Guerra Velázquez
     */
    function getMotivosInterrupcionAction()
    {
        $modeloNegocio = new NomMotivointerrupcionModel();
        $arr = $modeloNegocio->getMotivos(
            $this->_getParam('denominacion'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar motivo de i8nterrupción
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function addMotivoInterrupcionAction()
    {
        $obj = new NomMotivointerrupcionModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addMotivo(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta')
            );
            $this->_enviarNotificacionCorrecta();
        } else
            echo Zend_Json::encode(false);
    }

    /**
     * Modificar motivo de interrupción
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function updateMotivoInterrupcionAction()
    {
        $obj = new NomMotivointerrupcionModel();
        $r = $obj->updateMotivo(
            $this->_getParam('idmotivointerrupcion'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar motivo de interrupcion
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function deleteMotivoInterrupcionAction()
    {
        $motivos = json_decode(
            stripslashes($this->_request->getPost('motivos'))
        );
        $respuesta = true;
        $obj = new NomMotivointerrupcionModel();
        foreach ($motivos as $p) {
            $r = $obj->deleteMotivo($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    //////////////////// Motivo de disponibilidad ////////////////////////////
    /**
     * Obtiene el listado de los motivos de disponibilidad
     * @return Arreglo con todos los motivos de disponibilidad
     * @author Yaricel Guerra Velázquez
     */
    function getMotivosDisponibilidadAction()
    {
        $modeloNegocio = new NomMotivodisponibilidadModel();
        $arr = $modeloNegocio->getMotivos(
            $this->_getParam('denominacion'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar motivo de disponibilidad
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function addMotivoDisponibilidadAction()
    {
        $obj = new NomMotivodisponibilidadModel();
        if (!$obj->existeDenom($this->_getParam('denominacion'))) {
            $obj->addMotivo(
                $this->_getParam('denominacion'),
                $this->_getParam('descripcion'),
                $this->_getParam('fdesde'),
                $this->_getParam('fhasta')
            );
            $this->_enviarNotificacionCorrecta();
        } else
            echo Zend_Json::encode(false);
    }

    /**
     * Modificar motivo de disponibilidad
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function updateMotivoDisponibilidadAction()
    {
        $obj = new NomMotivodisponibilidadModel();
        $r = $obj->updateMotivo(
            $this->_getParam('idmotivodisponibilidad'),
            $this->_getParam('denominacion'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar motivo de disponibilidad
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function deleteMotivoDisponibilidadAction()
    {
        $motivos = json_decode(
            stripslashes($this->_request->getPost('motivos'))
        );
        $respuesta = true;
        $obj = new NomMotivodisponibilidadModel();
        foreach ($motivos as $p) {
            $r = $obj->deleteMotivo($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    //////////////////// Configurar concepto salarial ////////////////////////
    /**
     * Obtiene el listado de las configuraciones de conceptos salariales
     * @return Arreglo con todas las configuraciones
     * @author Yaricel Guerra Velázquez
     */
    function getComplementosFijosAction()
    {
        $modeloNegocio = new NomConceptosalarial();
        $arr = $modeloNegocio->getConceptosSalarialesFijos();
        echo Zend_Json::encode($arr);
    }

    function updateComplementosFijosAction()
    {
        $modeloNegocio = new NomConceptosalarial();
        $arr = $modeloNegocio->update($this->_getParam('idconceptosalarial'), $this->_getParam('denominacion'));
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de los conceptos salariales de nomina
     * @return Arreglo con los conceptos salariales de nomina
     * @author Yaricel Guerra Velázquez
     */
    function getComplementosNominaAction()
    {
        $obj = new ConfConceptosalarialnominaModel();
        $r = $obj->getConceptosPD();
        foreach ($r as $p => $dat) {
            $idestructuramodelodomina = $dat['idestructuramodelodomina'];
            $r[$p]['idconceptosalarialnomina'] = $idestructuramodelodomina;
        }
        echo Zend_Json::encode($r);
    }

    /**
     * Obtiene el listado de los conceptos salariales por configuración
     * @return Arreglo con todas las configuraciones
     * @author Yaricel Guerra Velázquez
     */
    function getConceptosByIdConfiguracionAction()
    {
        $modeloNegocio = new ConfConceptosalarialnominaModel();
        $arr = $modeloNegocio->getConfigByIdconceptosalarial(
            $this->_getParam('idconceptosalarial')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar configuración de conceptos salariales
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function guardarConfiguracionComplementosAction()
    {
        $conceptos = json_decode(
            stripslashes($this->_request->getPost('conceptos'))
        );
        $obj = new ConfConceptosalarialnominaModel();
        $r = $obj->addConfig(
            $this->_getParam('idconceptosalarial'),
            $conceptos
        );
        echo Zend_Json::encode($r);
    }

    //////////////////// Configurar entidad ////////////////////////////////////
    /**
     * Obtiene el listado de las configuraciones
     * @return Arreglo con todos las configuraciones
     * @author Yaricel Guerra Velázquez
     */
    function getConfigEntidadAction()
    {
        $modeloNegocio = new ConfEntidadModel();
        $arr = $modeloNegocio->getConfig();
        echo Zend_Json::encode($arr);
    }

    /**
     * Adicionar configuración de entidad
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function addConfigEntidadAction()
    {
        $estructuras = json_decode(
            stripslashes($this->_request->getPost('arrayidestructuras'))
        );
        $obj = new ConfEntidadModel();
        $r = $obj->addConfig(
            $this->_getParam('identidad'),
            $estructuras
        );
        echo Zend_Json::encode($r);

    }

    /**
     * Modificar configuración de entidad
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function updateConfigEntidadAction()
    {
        $estructuras = json_decode(
            stripslashes($this->_request->getPost('arrayidestructuras'))
        );
        $obj = new ConfEntidadModel();
        $r = $obj->updateConfig(
            $this->_getParam('identidad'),
            $estructuras
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar configuración
     * @return Mensaje informando el resultado de la operación
     * @author Yaricel Guerra Velázquez
     */
    public function deleteConfigEntidadAction()
    {
        $arrayids = json_decode(
            stripslashes($this->_request->getPost('arrayids'))
        );
        $respuesta = true;
        $obj = new ConfEntidadModel();
        foreach ($arrayids as $p) {
            $r = $obj->deleteConfig($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    function getEstructuraAction()
    {
        try {
            $idest = $this->_getParam('idestructura');
            if ($this->_getParam('node') == 0 && $idest != 0) {
                $id = $idest;
            } else {
                $id = $this->_getParam('node');
            }
            $r = ZendExt_IoC::getInstance()->metadatos->DameHijosEstructura($id);
            $datos = Array();
            $pos = 0;
            foreach ($r as $est) {
                if ($est->idconcepto != 7) {
                    $datos[$pos] = $est;
                    if ($idest) {
                        if ($this->_getParam('check') == 1) {
                            $obj = new ConfEntidad();
                            $ex = $obj->existeEntidadByPadre($idest, $est->id);
                            if (count($ex) > 0) {
                                $datos[$pos]->checked = true;
                            } else {
                                $datos[$pos]->checked = false;
                            }
                        } else {
                            $datos[$pos]->checked = false;
                        }
                    }
                    $pos++;
                }
            }
            echo json_encode($datos);
        } catch (Exception $e) {
            echo json_encode(Array());
        }
    }

    private function _enviarNotificacionCorrecta()
    {
        echo "{success: 'true'}";
    }
}