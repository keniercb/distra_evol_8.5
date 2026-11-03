<?php
/**
 * Created by PhpStorm.
 * User: yari
 * Date: 09/10/17
 * Time: 17:25
 */
class CertificarcompetenciasController extends ZendExt_Controller_Secure
{
    public function init()
    {
        parent::init();
    }

    function certificarcompetenciasAction()
    {
        $this->view->estructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->render();
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
        $idcargo = $this->_getParam('idcargo');
        $start = $this->_getParam('start');
        $limit = $this->_getParam('limit');
        $datos = ZendExt_IoC_Inter::getInstance()->movimientoslaborales->getSituacionesLaborales(
            $filtro,
            $idestructura,
            $idcargo,
            $start,
            $limit,
            1
        );
        echo Zend_Json::encode($datos);
    }

    /**
     * Obtiene el listado de competencias por cargo
     * @return Arreglo con las competencias dado un cargo
     * @author Yaricel Guerra Velazquez
     */
    function getCompetenciasByCargoAction()
    {
        $idcargo = $this->_getParam('idcargo');
        if (!empty($idcargo)) {
            $arr = DatCompetenciaCargo::dameCompetenciasCargo($idcargo);
        } else {
            $idpersona = $this->_getParam('idpersona');
            $arr = DatCompetenciapersonaModel::geCompetenciasPersona($idpersona);
        }
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de las competencias nomencladas
     * @return Arreglo con todas las competencias nomencladas
     * @author Yaricel Guerra Velazquez
     */
    function getCompetenciasNomAction()
    {
        $modeloNegocio = new NomCompetenciaModel();
        $arr = $modeloNegocio->getCompetencias(
            $this->_getParam('query'), $this->_getParam('start'), $this->_getParam('limit')
        );
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de valores de la escala Nomenclados
     * @return Arreglo con los valores
     * @author Yaricel Guerra Velazquez
     */
    function getValoresEscalaAction()
    {
        $valores = ZendExt_IoC_Inter::getInstance()->maestro->getValoresByEscala($this->_request->getPost('idescala'));
        echo Zend_Json::encode($valores);
    }

    /**
     * Obtiene el listado de competencias por persona
     * @return Arreglo con las competencias dada una persona
     * @author Yaricel Guerra Velazquez
     */
    function getCompetenciasByPersonaAction()
    {
        $idpersona = $this->_getParam('idpersona');
        $idcargo = $this->_getParam('idcargo');
        $arr = DatCompetenciapersonaModel::geCompetenciasPersona($idpersona, $idcargo);
        echo Zend_Json::encode($arr);
    }

    /**
     * Obtiene el listado de evaluaciones por persona
     * @return Arreglo con las evaluaciones dada una persona
     * @author Yaricel Guerra Velazquez
     */
    function getEvalByPersonaAction()
    {
        $idpersona = $this->_getParam('idpersona');
        $valores = ZendExt_IoC_Inter::getInstance()->evaluaciones->getEvaluacionesPersona($idpersona);
        $p = 0;
        while (count($valores->data) > $p) {
            if ($valores->data[$p]['valor'] == null) {
                unset($valores->data[$p]);
                $valores->data = array_values($valores->data);
                $p--;
            }
            $p++;
        }
        echo Zend_Json::encode($valores);
    }

    /**
     * Obtiene el listado de acciones de capacit por persona
     * @return Arreglo con las acciones dada una persona
     * @author Yaricel Guerra Velazquez
     */
    function getAccionByPersonaAction()
    {
        $idpersona = $this->_getParam('idpersona');
        $valores = ZendExt_IoC_Inter::getInstance()->capacitacion->getAccionesByPersona(0, $idpersona);
        echo Zend_Json::encode($valores);
    }

    /**
     * Adiciona competencias a la persona
     * @return Mensaje informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addCompetenciasAction()
    {
        $parametros = $this->_request->getParams();
        $competencias = json_decode($parametros['competencias']);
        foreach ($competencias as $v) {
            $objc = new DatCompetenciapersonaModel();
            $r = $objc->add(
                $this->_getParam('idpersona'),
                $v->idcompetencia,
                $v->fdesde,
                $v->fhasta,
                $v->idvalor
            );
        }
        echo Zend_Json::encode($r);
    }

    /**
     * Modifica competencias a la persona
     * @return Mensaje informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateCompetenciasAction()
    {
        $parametros = $this->_request->getParams();
        $competencias = json_decode($parametros['competencias']);
        foreach ($competencias as $v) {
            $objc = new DatCompetenciapersonaModel();
            $r = $objc->update(
                $v->idcompetenciapersona,
                $v->fdesde,
                $v->fhasta,
                $v->idvalor
            );
        }
        echo Zend_Json::encode($r);
    }

    /**
     * Eliminar competencia a persona
     * @return Mensaje informando el resultado de la operaci�n
     * @author Yaricel Guerra Velazquez
     */
    public function deleteCompetenciaAction()
    {
        $escalas = json_decode(stripslashes($this->_request->getPost('competencias')));
        $respuesta = true;
        $obj = new DatCompetenciapersonaModel();
        foreach ($escalas as $p) {
            $r = $obj->delete($p);
            if ($r == false) {
                $respuesta = false;
            }
        }
        echo json_encode($respuesta);
    }

    /**
     * Adiciona la certificacion a una competencia
     * @return Mensaje informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function addCertificacionAction()
    {
        $r = DatCertificacionModel::add(
            $this->_getParam('idcompetenciapersona'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('idpersonaevaluacion'),
            $this->_getParam('idaccionparticipante')
            );
        echo Zend_Json::encode($r);
    }

    /**
     * Modifica la certificacion a una competencia
     * @return Mensaje informando el resultado de la operaci�n
     * @author Yaricel Guerra Vel�zquez
     */
    function updateCertificacionAction()
    {
        $r = DatCertificacionModel::update(
            $this->_getParam('idcertificacion'),
            $this->_getParam('fdesde'),
            $this->_getParam('fhasta'),
            $this->_getParam('idpersonaevaluacion'),
            $this->_getParam('idaccionparticipante')
        );
        echo Zend_Json::encode($r);
    }
}