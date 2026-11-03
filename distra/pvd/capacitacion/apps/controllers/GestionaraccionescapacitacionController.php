<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 30/10/17
 * Time: 17:25
 */
class GestionaraccionescapacitacionController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function gestionaraccionescapacitacionAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
    }

    /**
     * Obtiene el listado de acciones
     * @return Arreglo con las personas
     * @author Yaricel Guerra Vel�zquez
     */
    function getAccionescapacitacionAction()
    {
        $modeloNegocio = new DatAccionnModel();
        $datos = $modeloNegocio->getAcciones(
            $this->_getParam('idestructura'),
            $this->_getParam('query'),
            $this->_getParam('desde'),
            $this->_getParam('hasta'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de necesidades por acciones
     * @return Arreglo con las necesidades
     * @author Yaricel Guerra Vel�zquez
     */
    function getNecesidadesByAccionTodosNomenAction()
    {
        $modeloNegocio = new DatAccionnecesidadModel();
        $datos = $modeloNegocio->getNecesidadesByAccionTodosNomen(
            $this->_getParam('idaccion'),
            $this->_getParam('idestructura')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de necesidades por acci�n y persona
     * @return Arreglo con las necesidades
     * @author Yaricel Guerra Vel�zquez
     */
    function getNecesidadesByAccionPersonaTodosAction()
    {
        $modeloNegocio = new DatNecesidad();
        $datos = $modeloNegocio->getNecesidadesByAccionPersonaTodos(
            $this->_getParam('idaccion'),
            $this->_getParam('idpersona')
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
        $idestructura = $this->_getParam('idestructura');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = Array();
        if (empty($idestructura)) {
            $idestructura = $_SESSION['Zeolides']['identidad'];
            $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
                $filtro,
                $idestructura,
                null,
                $start,
                $limit,
                1
            );
        } else {
            $necesidadesaccion = DatAccionnecesidadModel::getNecesidadesByAccion($this->_getParam('idaccion'));
            $idsnecesidad = Array();
            foreach ($necesidadesaccion->datos as $n) {
                array_push($idsnecesidad, $n['idnecesidad']);
            }
            $datos = DatAccionparticipanteModel::getPersonasByIdcargoIdnecesidad(
                $filtro, $idestructura, $idsnecesidad, $start, $limit
            );
        }
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de participantes
     * @return Arreglo con los participantes de capacitacion
     * @author Yaricel Guerra Vel�zquez
     */
    function getParticipantesAction()
    {
        $modeloNegocio = new DatAccionparticipanteModel();
        $datos = $modeloNegocio->getAccionesParticipantes(
            $this->_getParam('idaccion'),
            $this->_getParam('start'),
            $this->_getParam('limit')
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de cursos del nomenclador
     * @return Arreglo con los cursos
     * @author Yaricel Guerra Vel�zquez
     */
    function getCursosNomAction()
    {
        $modeloNegocio = new NomCursoModel();
        $arr = $modeloNegocio->getCursosActivos();
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de cursos
     * @return Arreglo con los cursos de una capacitacion
     * @author Yaricel Guerra Vel�zquez
     */
    function getCursosAction()
    {
        $modeloNegocio = new DatAccioncursoModel();
        if ($this->_getParam('tipo') == 2) {
            $datos = DatAccioncurso::getAccionesCursosPart(
                $this->_getParam('idaccion'),
                $this->_getParam('idaccionparticipante')
            );
        } else {
            $datos = $modeloNegocio->getAccionesCursos(
                $this->_getParam('idaccion'),
                $this->_getParam('start'),
                $this->_getParam('limit')
            );
        }
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de aseguramientos Nomenclados
     * @return Arreglo con los aseguramientos
     * @author Yaricel Guerra Vel�zquez
     */
    function getAseguramientosAction()
    {
        $modeloNegocio = new DatAccionaseguramientoModel();
        $datos = $modeloNegocio->getAseguramientos($this->_getParam('idaccion'));
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de periodos Nomenclados
     * @return Arreglo con los periodos
     * @author Yaricel Guerra Vel�zquez
     */
    function getPeriodosAction()
    {
        $modeloNegocio = new NomPeriodoModel();
        $datos = $modeloNegocio->getPeriodosActivos();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de indicadores Nomenclados
     * @return Arreglo con los indicadores
     * @author Yaricel Guerra Vel�zquez
     */
    function getIndicadoresAction()
    {
        $modeloNegocio = new NomIndicadoramedirModel();
        $datos = $modeloNegocio->getIndicadoresActivos();
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de indicadores evaluados dado el participante
     * @return Arreglo con los indicadores evaluados
     * @author Yaricel Guerra Vel�zquez
     */
    function getIndicadoresParticipanteAction()
    {
        $modeloNegocio = new DatEvalimpactoModel();
        $datos = $modeloNegocio->getIndicadoresParticipante($this->_request->getPost('idaccionparticipante'));
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de valores de la escala del indicador Nomenclados
     * @return Arreglo con los valores
     * @author Yaricel Guerra Vel�zquez
     */
    function getValoresIndAction()
    {
        $valores = ZendExt_IoC_Inter::getInstance()->maestro->getValoresByEscala($this->_request->getPost('idescala'));
        echo Zend_Json::encode($valores);
    }

    /**
     * Obtiene el listado de tipos de acci�n
     * @return Arreglo con los tipos de acci�n de una capacitacion
     * @author Yaricel Guerra Vel�zquez
     */
    function getTipoaccionAction()
    {
        $modeloNegocio = new NomtipoaccionModel();
        $arr = $modeloNegocio->getTiposAccionActivos();
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de los modos de formaci�n
     * @return Arreglo con todas las necesidades de capacitaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function getModoFormacionAction()
    {
        $modeloNegocio = new NomModoformacionModel();
        $arr = $modeloNegocio->getModosActivos();
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de las categorias
     * @return Arreglo con todas las categorias
     * @author Yaricel Guerra Vel�zquez
     */
    function getCategoriasAction()
    {
        $categorias = ZendExt_IoC::getInstance()->metadatos->dameCategoriaOcupacional(true, null, 0, null);
        foreach ($categorias as $p=>$cat) {
            $categorias[$p]['idcategoria'] = $cat['idcategocup'];
        }
        echo Zend_Json::encode($categorias);
    }

    /**
     * Adiciona acciones de capacitaci�n
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addAccionAction()
    {
        $arrayids = explode(',', $this->_request->getPost('categorias'));
        $necesidades = json_decode(stripslashes($this->_request->getPost('necesidades')));
        $modeloNegocio = new DatAccionnModel();
        $arr = $modeloNegocio->addAccion(
            $this->_getParam('denominacion'),
            $this->_getParam('idmodoformacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('duracion'),
            $this->_getParam('lugar'),
            $this->_getParam('idestructura'),
            $arrayids,
            $this->_getParam('curso'),
            $necesidades
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Modifica acciones de capacitaci�n
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateAccionAction()
    {
        $arrayids = explode(',', $this->_request->getPost('categorias'));
        $necesidades = json_decode(stripslashes($this->_request->getPost('necesidades')));
        $modeloNegocio = new DatAccionnModel();
        $arr = $modeloNegocio->updateAccion(
            $this->_getParam('idaccion'),
            $this->_getParam('denominacion'),
            $this->_getParam('idmodoformacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('duracion'),
            $this->_getParam('lugar'),
            $arrayids,
            $this->_getParam('curso'),
            $necesidades
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Elimina acciones de capacitaci�n
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteAccionesAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('idsacciones')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatAccionnModel::deleteAccion($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona participante
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addParticipanteAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('personas')));
        foreach ($arrayids as $p) {
            $r = DatAccionparticipanteModel::addParticipante($this->_getParam('idaccion'), $p);
        }
        echo Zend_Json::encode($r);
    }

    /**
     * Elimina participantes
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteParticipanteAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('participantes')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatAccionparticipanteModel::deleteParticipante($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona curso
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addCursoAction()
    {
        $r = DatAccioncursoModel::addCurso(
            $this->_getParam('idaccion'),
            $this->_getParam('idcurso'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('profesor')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Modifica curso
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateCursoAction()
    {
        $r = DatAccioncursoModel::updateCurso(
            $this->_getParam('idaccioncurso'),
            $this->_getParam('idcurso'),
            $this->_getParam('descripcion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('profesor')
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Elimina curso
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteCursoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('cursos')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatAccioncursoModel::deleteCurso($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Guardar informacion de los aseguramientos
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function guardarAseguramientoAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('necesidades')));
        $r = DatAccionaseguramientoModel::addAseguramiento($this->_getParam('idaccion'), $arrayids);
        echo Zend_Json::encode($r);
    }

    /**
     * Adicionar evaluaci�n de impacto
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addEvalImpactoAction()
    {
        $idaccionparticipante = $this->_getParam('idaccionparticipante');
        $idperiodo = $this->_getParam('idperiodo');
        $idindicador = $this->_getParam('idindicador');
        $idvalorescala = $this->_getParam('idvalorescala');
        $fecha = $this->_getParam('fecha');
        $complemento = $this->_getParam('complemento');
        $r = DatEvalimpactoModel::add(
            $idaccionparticipante, $idperiodo, $idindicador, $idvalorescala, $fecha, $complemento
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Modificar evaluaci�n de impacto
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateEvalImpactoAction()
    {
        $idevalimpacto = $this->_getParam('idevalimpacto');
        $idperiodo = $this->_getParam('idperiodo');
        $idindicador = $this->_getParam('idindicador');
        $idvalorescala = $this->_getParam('idvalorescala');
        $fecha = $this->_getParam('fecha');
        $complemento = $this->_getParam('complemento');
        $r = DatEvalimpactoModel::update(
            $idevalimpacto, $idperiodo, $idindicador, $idvalorescala, $fecha, $complemento
        );
        echo Zend_Json::encode($r);
    }

    /**
     * Elimina indicadores evaluados
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function deleteEvalIndAction()
    {
        $arrayids = json_decode(stripslashes($this->_request->getPost('indicadores')));
        $respuesta = true;
        foreach ($arrayids as $p) {
            $r = DatEvalimpactoModel::delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Guardar informacion de las necesidades vencidas por el trabajador
     * @return Variable entera informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function guardarNecVencidasAction()
    {
        $vencidas = json_decode(stripslashes($this->_request->getPost('necesidadesv')));
        $novencidas = json_decode(stripslashes($this->_request->getPost('necesidadesnv')));
        $fecha = date('d/m/Y');
        foreach ($vencidas as $v) {
            $r = DatNecesidadModel::updateNecesidadVencida($v, $fecha);
        }
        foreach ($novencidas as $nv) {
            $r = DatNecesidadModel::updateNecesidadVencida($nv, null);
        }
        echo Zend_Json::encode($r);
    }

    function guardarResultadoAction()
    {
        $parametros = $this->_request->getParams();
        $cursos = json_decode($parametros['cursos']);
        $idaccionparticipante = $this->_getParam('idaccionparticipante');
        $observacion = $this->_getParam('observacion');
        $terminado = $this->_getParam('terminado');
        $resultado = $this->_getParam('resultado');
        $resp = DatAccionparticipanteModel::guardarResultado(
            $idaccionparticipante, $observacion, $terminado, $resultado, $cursos
        );
        echo Zend_Json::encode($resp);
    }

    function actualizarfechasAction()
    {
        $idaccion = $this->_getParam('idaccion');
        $idcurso = $this->_getParam('idcurso');
        $frdesde = $this->_getParam('frdesde');
        $frhasta = $this->_getParam('frhasta');
        $accion = $this->_getParam('accion');
        $updaccion = $this->_getParam('updaccion');
        $observacion = $this->_getParam('observacion');
        if ($accion == 1 || $updaccion == 1) {
            $resp = DatAccionnModel::ejecutarAccion($idaccion, $frdesde, $frhasta, $observacion);
        }
        if ($accion == 2) {
            $resp = DatAccioncursoModel::ejecutarCurso($idcurso, $frdesde, $frhasta);
        }
        echo Zend_Json::encode($resp);
    }

    function generarPlanAction()
    {
        set_time_limit(30000);
        $fdesde = $this->_getParam('fdesde');
        $fhasta = $this->_getParam('fhasta');
        $idestructura = $this->_getParam('idestructura');
        $objReportePDF = new ReportepdfplancolectivoModel();
        $objReportePDF->CrearReportePDF($idestructura, $fdesde, $fhasta);
        return true;
    }

    function generarEvaluacionImpAction()
    {
        $idaccionparticipante = $this->_getParam('idaccionparticipante');
        $idpersona = $this->_getParam('idpersona');
        $objReportePDF = new ReportepdfEvalimpactoModel();
        $objReportePDF->CrearReportePDF($idaccionparticipante, $idpersona);
        return true;
    }
}