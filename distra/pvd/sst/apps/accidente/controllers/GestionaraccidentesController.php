<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 13/12/17
 * Time: 17:25
 */
class GestionaraccidentesController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function gestionaraccidentesAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Obtiene el listado de accidentes
     * @return Arreglo con los accidentes
     * @author Yaricel Guerra Vel�zquez
     */
    function getAccidentesAction()
    {
        $modeloNegocio = new DatAccidenteModel();
        $datos = $modeloNegocio->getAccidentes(
            $this->_getParam('query'),
            $this->_getParam('idestructura'),
            $this->_getParam('desde'),
            $this->_getParam('hasta'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de todos los tipos de accidente
     * @return Arreglo con los tipos de accidente
     * @author Yaricel Guerra Vel�zquez
     */
    function getTiposAccidenteAction()
    {
        $modeloNegocio = new NomTipoaccidenteModel();
        $datos = $modeloNegocio->getTiposActivos();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de todos las formas de accidente
     * @return Arreglo con las formas de accidente
     * @author Yaricel Guerra Vel�zquez
     */
    function getFormasAccidenteAction()
    {
        $modeloNegocio = new NomFormaaccidenteModel();
        $datos = $modeloNegocio->getFormasActivos();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de todos los tipos de agente
     * @return Arreglo con los tipos de agente
     * @author Yaricel Guerra Vel�zquez
     */
    function getTiposAgenteAction()
    {
        $modeloNegocio = new NomTipoagenteModel();
        $datos = $modeloNegocio->getTiposActivos();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de todos los agentes
     * @return Arreglo con los agentes
     * @author Yaricel Guerra Vel�zquez
     */
    function getAgentesAction()
    {
        $modeloNegocio = new NomAgenteModel();
        $datos = $modeloNegocio->getAgentesbyTipo($this->_getParam('idtipoagente'));
        echo Zend_Json::encode($datos->datos);
    }

    /**
     * Obtiene el listado de todas las partes del cuerpo nomencladas
     * @return Arreglo con las partes del cuerpo
     * @author Yaricel Guerra Vel�zquez
     */
    function getPartesCuerpoAction()
    {
        $modeloNegocio = new NomPartecuerpoModel();
        $datos = $modeloNegocio->getPartesActivos();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de todas las partes del cuerpo nomencladas
     * @return Arreglo con las partes del cuerpo
     * @author Yaricel Guerra Vel�zquez
     */
    function getLesionesAction()
    {
        $idaccidenteimplicado = $this->_getParam('idaccidenteimplicado');
        $modeloNegocio = new DatImplicadopartecuerpo();
        $datos = $modeloNegocio->getPartescuerpo($idaccidenteimplicado);
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de todos los tipos de invalidez
     * @return Arreglo con los tipos de invalidez
     * @author Yaricel Guerra Vel�zquez
     */
    function getTiposInvalidezAction()
    {
        $modeloNegocio = new NomTipoinvalidezModel();
        $datos = $modeloNegocio->getTiposActivos();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de todas las naturalezas de lesi�n
     * @return Arreglo con las naturalezas de lesi�n
     * @author Yaricel Guerra Vel�zquez
     */
    function getNaturalezasLesionAction()
    {
        $modeloNegocio = new NomNaturalezalesionModel();
        $datos = $modeloNegocio->getNaturalezasActivos();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de implicados por accidentes
     * @return Arreglo con los implicados
     * @author Yaricel Guerra Vel�zquez
     */
    function getImplicadosAction()
    {
        $modeloNegocio = new DatAccidenteimplicadoModel();
        $datos = $modeloNegocio->getImplicados(
            $this->_getParam('idaccidente'),
            $this->_getParam('query'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de Comisiones
     * @return Arreglo con las comisiones
     * @author Yaricel Guerra Vel�zquez
     */
    function getComisionesAction()
    {
        $modeloNegocio = new DatAccidentecomisionModel();
        $datos = $modeloNegocio->getComisiones(
            $this->_getParam('idaccidente')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de personas
     * @return Arreglo con las personas
     * @author Yaricel Guerra Vel�zquez
     */
    function getPersonasAction()
    {
        $filtro = $this->_getParam('query');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = Array();
        $idestructura = $_SESSION['Zeolides']['entidad']->idestructura;
        $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
            $filtro,
            $idestructura,
            null,
            $start,
            $limit,
            1
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de causas del accidente
     * @return Arreglo con las causas del accidente
     * @author Yaricel Guerra Vel�zquez
     */
    function getCausasAllAction()
    {
        $modeloNegocio = new NomCausaaccidenteModel();
        $datos = $modeloNegocio->getCausa();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de causas del nomenclador
     * @return Arreglo con las causas
     * @author Yaricel Guerra Vel�zquez
     */
    function getCausasAction()
    {
        $modeloNegocio = new DatAccidentecausaModel();
        $arr = $modeloNegocio->getCausas(
            $this->_getParam('idaccidente'),
            $this->_getParam('query'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de recomendaciones
     * @return Arreglo con las recomendaciones
     * @author Yaricel Guerra Vel�zquez
     */
    function getRecomendacionesAction()
    {
        $modeloNegocio = new DatAccidenterecomendacionModel();
        $datos = $modeloNegocio->getRecomendaciones(
            $this->_getParam('idaccidente'),
            $this->_getParam('query'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de conclusiones
     * @return Arreglo con las consecuencias
     * @author Yaricel Guerra Vel�zquez
     */
    function getConclusionesAction()
    {
        $modeloNegocio = new DatAccidenteconclusionesModel();
        $datos = $modeloNegocio->getConclusiones(
            $this->_getParam('idaccidente'),
            $this->_getParam('query'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }
    
    /**
     * Obtiene el listado de costos
     * @return Arreglo con los costos
     * @author Eddy Santana Navarro
     */
    function getCostosAction()
    {
        $modeloNegocio = new DatAccidentecostoModel();
        $datos = $modeloNegocio->getCostos(
            $this->_getParam('idaccidente'),
            $this->_getParam('query'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }
    
    /**
     * Obtiene el listado de subsidios
     * @return Arreglo con los subsidios
     * @author Eddy Santana Navarro
     */
    function getSubsidiosAction()
    {
        $modeloNegocio = new DatAccidenteimplicadoModel();
        $datos = $modeloNegocio->getSubsidios(
            $this->_getParam('idaccidenteimplicado'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Adiciona accidentes
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addAccidenteAction()
    {
        $modeloNegocio = new DatAccidenteModel();
        $arr = $modeloNegocio->add(
            $this->_getParam('idestructura'),
            $this->_getParam('lugar'),
            $this->_getParam('idtipoaccidente'),
            $this->_getParam('idformaaccidente'),
            $this->_getParam('idagente'),
            $this->_getParam('fecha'),
            $this->_getParam('hora'),
            $this->_getParam('descripcion'),
            $this->_getParam('equiparado')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica accidentes
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateAccidenteAction()
    {
        $modeloNegocio = new DatAccidenteModel();
        $arr = $modeloNegocio->update(
            $this->_getParam('idaccidente'),
            $this->_getParam('lugar'),
            $this->_getParam('idtipoaccidente'),
            $this->_getParam('idformaaccidente'),
            $this->_getParam('idagente'),
            $this->_getParam('fecha'),
            $this->_getParam('hora'),
            $this->_getParam('descripcion'),
            $this->_getParam('equiparado')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina accidentes de capacitaci�n
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteAccidentesAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('accidentes')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatAccidenteModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona implicados
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addImplicadoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('implicados')));
        foreach ($arrayids as $p) {
            $r = DatAccidenteimplicadoModel::add(
                $this->_getParam('idaccidente'),
                $p,
                $this->_getParam('idtipoinvalidez'),
                $this->_getParam('tareahabitual')
            );
        }
        echo Zend_Json::encode($r);
    }

    /**
     * Modifica implicados
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateImplicadoAction()
    {
        $idaccidenteimplicado = $this->_getParam('idaccidenteimplicado');
        $idtipoinvalidez = $this->_getParam('idtipoinvalidez');
        $tareahabitual = $this->_getParam('tareahabitual');
        $r = DatAccidenteimplicadoModel::update($idaccidenteimplicado, $idtipoinvalidez, $tareahabitual);
        echo Zend_Json::encode($r);
    }

    /**
     * Adiciona parte accidentada implicados
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addParteImplicadoAction()
    {
        $idaccidenteimplicado = $this->_getParam('idaccidenteimplicado');
        $idnaturalezalesion = $this->_getParam('idnaturalezalesion');
        $idpartecuerpo = $this->_getParam('idpartecuerpo');
        $descripcion = $this->_getParam('descripcion');
        $objModel = new DatAccidenteimplicadoModel();
        $r = $objModel->addLesion($idaccidenteimplicado, $idnaturalezalesion, $idpartecuerpo, $descripcion);
        echo Zend_Json::encode($r);
    }

    /**
     * Modifica parte accidentada implicados
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateParteImplicadoAction()
    {
        $idimplicadopartecuerpo = $this->_getParam('idimplicadopartecuerpo');
        $idnaturalezalesion = $this->_getParam('idnaturalezalesion');
        $idpartecuerpo = $this->_getParam('idpartecuerpo');
        $descripcion = $this->_getParam('descripcion');
        $objModel = new DatAccidenteimplicadoModel();
        $r = $objModel->updateLesion($idimplicadopartecuerpo, $idnaturalezalesion, $idpartecuerpo, $descripcion);
        echo Zend_Json::encode($r);
    }

    /**
     * Modifica informacion de fallecimiento
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateFallecimientoAction()
    {
        $idaccidenteimplicado = $this->_getParam('idaccidenteimplicado');
        $ffallecimiento = $this->_getParam('ffallecimiento');
        $descripcion = $this->_getParam('descfallecido');
        $r = DatAccidenteimplicadoModel::updateFallecimiento($idaccidenteimplicado, $ffallecimiento, $descripcion);
        echo Zend_Json::encode($r);
    }

    /**
     * Elimina lesiones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteParteImplicadoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('lesiones')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatAccidenteimplicadoModel::deleteLesion($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Elimina implicados
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteImplicadoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('implicados')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatAccidenteimplicadoModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona recomendaciones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addRecomendacionAction()
    {
        $modeloNegocio = new DatAccidenterecomendacionModel();
        $arr = $modeloNegocio->add(
            $this->_getParam('idaccidente'),
            $this->_getParam('recomendacion')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica recomendaciones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateRecomendacionAction()
    {
        $modeloNegocio = new DatAccidenterecomendacionModel();
        $arr = $modeloNegocio->update(
            $this->_getParam('idaccidenterecomendacion'),
            $this->_getParam('recomendacion')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina recomendaciones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteRecomendacionAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('recomendaciones')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatAccidenterecomendacionModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona conclusiones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addConclusionAction()
    {
        $modeloNegocio = new DatAccidenteconclusionesModel();
        $arr = $modeloNegocio->add(
            $this->_getParam('idaccidente'),
            $this->_getParam('conclusion')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica conclusiones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateConclusionAction()
    {
        $modeloNegocio = new DatAccidenteconclusionesModel();
        $arr = $modeloNegocio->update(
            $this->_getParam('idaccidenteconclusion'),
            $this->_getParam('conclusion')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina conclusiones
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteConclusionAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('conclusiones')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatAccidenteconclusionesModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Guardar comision
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function guardarComisionAction()
    {
        $idaccidente = $this->_getParam('idaccidente');
        $arrayids = json_decode(stripslashes($this->_request->getPost('comisiones')));
        DatAccidentecomision::deleteByIdAccidente($idaccidente);
        foreach ($arrayids as $p) {
            $r = DatAccidentecomisionModel::add($idaccidente, $p);
        }
        echo Zend_Json::encode($r);
    }

    /**
     * Guardar causas
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addCausaAction()
    {
        $r = DatAccidentecausaModel::add(
            $this->_getParam('idaccidente'),
            $this->_getParam('idcausaaccidente'),
            $this->_getParam('descripcion')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Actualizar causas
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateCausaAction()
    {
        $r = DatAccidentecausaModel::update(
            $this->_getParam('idaccidentecausa'),
            $this->_getParam('idcausaaccidente'),
            $this->_getParam('descripcion')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Elimina causas
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteCausaAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('causas')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatAccidentecausaModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
    /**
     * Adiciona costo
     * @author Eddy Santana Navarro
     */
    function addCostoAction()
    {
        $modeloNegocio = new DatAccidentecostoModel();
        $arr = $modeloNegocio->add(
            $this->_getParam('idaccidente'),
            $this->_getParam('denominacion'),
            $this->_getParam('importe')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica costo
     * @author Eddy Santana Navarro
     */
    function updateCostoAction()
    {
        $modeloNegocio = new DatAccidentecostoModel();
        $arr = $modeloNegocio->update(
            $this->_getParam('idaccidentecosto'),
            $this->_getParam('denominacion'),
            $this->_getParam('importe')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina costos
     * @author Eddy Santana Navarro
     */
    function deleteCostoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('costos')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatAccidentecostoModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }
    
    /**
     * Adiciona subsidio
     * @author Eddy Santana Navarro
     */
    function addSubsidioAction()
    {
        $modeloNegocio = new DatAccidenteimplicadoModel();
        $arr = $modeloNegocio->addSubsidio(
            $this->_getParam('idaccidenteimplicado'),
            $this->_getParam('denominacion'),
            $this->_getParam('importe')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica subsidio
     * @author Eddy Santana Navarro
     */
    function updateSubsidioAction()
    {
        $modeloNegocio = new DatAccidenteimplicadoModel();
        $arr = $modeloNegocio->updateSubsidio(
            $this->_getParam('idimplicadosubsidio'),
            $this->_getParam('denominacion'),
            $this->_getParam('importe')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina subsidios
     * @author Eddy Santana Navarro
     */
    function deleteSubsidioAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('subsidios')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatAccidenteimplicadoModel::deleteSubsidio($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    function generarRecomendacionesAction()
    {
        $idaccidente = $this->_getParam('idaccidente');
        $objReportePDF = new ReportepdfRecomendacionesModel();
        $objReportePDF->CrearReportePDF($idaccidente);
        return true;
    }

    function generarConclusionesAction()
    {
        $idaccidente = $this->_getParam('idaccidente');
        $objReportePDF = new ReportepdfConclusionesModel();
        $objReportePDF->CrearReportePDF($idaccidente);
        return true;
    }
    
    function generarCostosAction()
    {
        $idaccidente = $this->_getParam('idaccidente');
        $objReportePDF = new ReportepdfCostosModel();
        $objReportePDF->CrearReportePDF($idaccidente);
        return true;
    }

    function generarPdfReporteAction()
    {
        $idestructura = $this->_getParam('idestructura');
        $objReportePDF = new ReportepdfindproteccionyssModel();
        $objReportePDF->CrearReportePDF($idestructura);
        return true;
    }

    function generarPdfExpedienteAction()
    {
        $idaccidente = $this->_getParam('idaccidente');
        $objReportePDF = new ReportepdfExpedienteModel();
        $objReportePDF->CrearReportePDF($idaccidente);
        return true;
    }

    function generarFichaAction()
    {
        $idaccidenteimplicado = $this->_getParam('idaccidenteimplicado');
        $objReportePDF = new FichaimplicadoModel();
        $objReportePDF->CrearFichaPDF($idaccidenteimplicado);
        return true;
    }
}