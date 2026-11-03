<?php

/**
 * @copyright UCID, ERP-CUBA
 */
class CmpfiltroController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    private $model;

    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array())
    {
        parent::__construct($request, $response, $invokeArgs);
        $this->model = new DatFiltroReporteModel();
    }

    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista
     */
    function cmpfiltroAction()
    {
        $this->render();
    }

    function listarFiltroAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['sort'] = $this->_request->getPost('sort');
        $parametros['dir'] = $this->_request->getPost('dir');
        $start = $this->_request->getPost('start');
        $parametros['start'] = (empty($start) || !is_numeric($start)) ? 0 : $start;
        $limit = $this->_request->getPost('limit');
        $parametros['limit'] = empty($limit) ? 100 : $limit;
        $parametros['idreporte'] = $this->_request->getPost('idreporte');

        $result = $this->model->listarFiltroReporte($parametros);
        if (isset($result['data'][0])) echo json_encode($result);
        else echo json_encode(array('total' => 0, 'data' => array()));
    }


    function adicionarFiltroAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idusuario'] = $this->global->Perfil->idusuario;
        $denelemento = $this->_request->getPost('tfdenominacion');
        $parametros['denominacion'] = str_ireplace('"', "'", $denelemento);
        $parametros['orden'] = $this->_request->getPost('nforden');
        $parametros['anchocolumna'] = $this->_request->getPost('nfanchocolumna');
        $parametros['nombreparametro'] = $this->_request->getPost('tfnombreparametro');
        $parametros['idreporte'] = $this->_request->getPost('idreporte');
        $parametros['valorpordefecto'] = $this->_request->getPost('valorpordefecto');
        $tipo = $this->_request->getPost('tipo');
        $parametros['tipo'] = $tipo;
        if ($tipo == 1) { //texto
            $parametros['longitudminima'] = $this->_request->getPost('nflongitudminima');
            $parametros['longitudmaxima'] = $this->_request->getPost('nflongitudmaxima');
            $parametros['denominaciontipo'] = 'Texto';
        } else if ($tipo == 2) { //numero
            $parametros['valorminimo'] = $this->_request->getPost('nfvalorminimo');
            $parametros['valormaximo'] = $this->_request->getPost('nfvalormaximo');
            $parametros['denominaciontipo'] = 'Numérico';
        } else if ($tipo == 3) { //fecha
            $parametros['denominaciontipo'] = 'Fecha';
            if (empty($parametros['valorpordefecto']))
                $parametros['valorpordefecto'] = $this->_request->getPost('rfechadefault');
        } else if ($tipo == 4) { //nomenclador
            $parametros['denominaciontipo'] = 'Nomenclador';
            $parametros['nomidentificador'] = $this->_request->getPost('tfcampovalor');
            $parametros['nomdenominacion'] = $this->_request->getPost('tfcampomostrar');
            $parametros['tipofuentedatos'] = !empty($this->_request->getPost('rcodigosql')) ? 1 : 0;
            $parametros['paginado'] = !empty($this->_request->getPost('chpaginado')) ? 1 : 0;
            $parametros['enviarid'] = !empty($this->_request->getPost('rdenviarid')) ? 1 : 0;
            $parametros['sentenciasql'] = $this->_request->getPost('tacodigosql');
            $parametros['nomservicio'] = $this->_request->getPost('taservicio');
        } else if ($tipo == 5) { //variable global
            $parametros['denominaciontipo'] = 'Variable global';
        } else if ($tipo == 6) { //estructura
            $parametros['denominaciontipo'] = 'Estructura';
            $parametros['anchocolumna'] = 99;
            $parametros['orden'] = 0;
            $parametros['estructuracompleta'] = !empty($this->_request->getPost('chestructuracompleta')) ? 1 : 0;

        }
        $result = $this->model->adicionarFiltroReporte($parametros);
        echo json_encode(array('mensaje' => $result));
    }

    function modificarFiltroAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idusuario'] = $this->global->Perfil->idusuario;
        $denelemento = $this->_request->getPost('tfdenominacion');
        $parametros['denominacion'] = str_ireplace('"', "'", $denelemento);
        $parametros['orden'] = $this->_request->getPost('nforden');
        $parametros['anchocolumna'] = $this->_request->getPost('nfanchocolumna');
        $parametros['nombreparametro'] = $this->_request->getPost('tfnombreparametro');
        $parametros['idreporte'] = $this->_request->getPost('idreporte');
        $parametros['idfiltro'] = $this->_request->getPost('idfiltro');
        $parametros['valorpordefecto'] = $this->_request->getPost('valorpordefecto');
        $tipo = $this->_request->getPost('tipo');
        $parametros['tipo'] = $tipo;
        if ($tipo == 1) { //texto
            $parametros['longitudminima'] = $this->_request->getPost('nflongitudminima');
            $parametros['longitudmaxima'] = $this->_request->getPost('nflongitudmaxima');
        } else if ($tipo == 2) { //numero
            $parametros['valorminimo'] = $this->_request->getPost('nfvalorminimo');
            $parametros['valormaximo'] = $this->_request->getPost('nfvalormaximo');
        } else if ($tipo == 3) { //fecha
            if (empty($parametros['valorpordefecto']))
                $parametros['valorpordefecto'] = $this->_request->getPost('rfechadefault');
        } else if ($tipo == 4) { //nomenclador
            $parametros['nomidentificador'] = $this->_request->getPost('tfcampovalor');
            $parametros['nomdenominacion'] = $this->_request->getPost('tfcampomostrar');
            $parametros['tipofuentedatos'] = !empty($this->_request->getPost('rcodigosql')) ? 1 : 0;
            $parametros['paginado'] = !empty($this->_request->getPost('chpaginado')) ? 1 : 0;
            $parametros['enviarid'] = !empty($this->_request->getPost('rdenviarid')) ? 1 : 0;
            $parametros['sentenciasql'] = $this->_request->getPost('tacodigosql');
            $parametros['nomservicio'] = $this->_request->getPost('taservicio');
        } else if ($tipo == 6) { //estructura
            $parametros['anchocolumna'] = 99;
            $parametros['orden'] = 0;
            $parametros['estructuracompleta'] = !empty($this->_request->getPost('chestructuracompleta')) ? 1 : 0;
        }
        $result = $this->model->modificarFiltroReporte($parametros);
        echo json_encode(array('mensaje' => $result));
    }

    function eliminarFiltroAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $arrayidfiltros = json_decode(
            stripslashes($this->_request->getPost('arrayidfiltros'))
        );
        $result = $this->model->eliminarFiltroReporte($arrayidfiltros);
        echo json_encode(array('mensaje' => $result));
    }

    function cargarFormularioFiltroAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idfiltro'] = $this->_request->getPost('idfiltro');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        $result = $this->model->obtenerFiltroReporteDadoId($parametros);
        if (is_array($result)) {
            $dat [] = array(
                'idreporte' => $result['idreporte'],
                'denominacion' => $result['denominacion'],
                'nombreparametro' => $result['nombreparametro'],
                'anchocolumna' => $result['anchocolumna'],
                'orden' => $result['orden'],
                'tipo' => $result['tipo'],
                'longitudminima' => $result['longitudminima'],
                'longitudmaxima' => $result['longitudmaxima'],
                'valorminimo' => $result['valorminimo'],
                'valormaximo' => $result['valormaximo'],
                'nomidentificador' => $result['nomidentificador'],
                'nomdenominacion' => $result['nomdenominacion'],
                'tipofuentedatos' => $result['tipofuentedatos'],
                'paginado' => $result['paginado'],
                'sentenciasql' => $result['sentenciasql'],
                'nomservicio' => $result['nomservicio'],
                'enviarid' => $result['enviarid'],
                'valorpordefecto' => $result['valorpordefecto'],
                'estructuracompleta' => $result['estructuracompleta']
            );
            echo json_encode(array('data' => $dat, 'mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => $result));
        }
    }

    function cargarDatosNomencladorAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idfiltro'] = $this->_request->getPost('idfiltro');
        $parametros['tipo'] = $this->_request->getPost('tipo');
        $parametros['tipofuentedatos'] = $this->_request->getPost('tipofuentedatos');
        $parametros['enviarid'] = $this->_request->getPost('enviarid');
        $parametros['filtrar'] = $this->_request->getPost('filtrar');
        $start = $this->_request->getPost('start');
        $parametros['start'] = (empty($start) || !is_numeric($start)) ? 0 : $start;
        $limit = $this->_request->getPost('limit');
        $parametros['limit'] = empty($limit) ? 100 : $limit;
        if ($parametros['tipofuentedatos'] == '1') {
            $result = $this->model->cargarDatosNomenclador($parametros);
            if (isset($result['data'][0])) echo json_encode($result);
            else echo json_encode(array('total' => 0, 'data' => array(), 'mensaje' => $result));
        }
    }

    public function cargarArbolEstructurasAction()
    {
        $entidadlogueada = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;
        $estructuracompleta = $this->_request->getPost('estructuracompleta');
        $node = $this->_request->getPost('node');
        $idEstructura = ($estructuracompleta && $node == 'nodo2') ? 0 :
            (($node != 'nodo2') ? $node : $entidadlogueada);
        $valor = $this->_request->getPost('denominacion');
        $iddominio = ($estructuracompleta) ? 0 : $this->global->Perfil->iddominio;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras(
            $iddominio, $idEstructura, 0, 0, 3
        );
        $result = array();
        foreach ($dominios as $key => $val) {
            if ($valor != null) {
                $flag = stristr($val['text'], $valor);
            }
            if ($val['tipo'] != 7) {
                $result[$key] = $val;
                $result[$key]['qtip'] = $val['text'];
            }
        }
        if ($valor != null) {
            foreach ($result as $key => $value) {
                if (stristr($value['text'], $valor) == false) {
                    unset($result[$key]);
                }
            }
            $res = array();
            $i = 0;
            foreach ($result as $key => $val) {
                $res[$i++] = $val;
            }
        }
        if ($res != null) {
            $result = $res;
        }
        echo json_encode($result);
    }

}
