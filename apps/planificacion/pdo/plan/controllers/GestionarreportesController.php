<?php

class GestionarreportesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     *
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista adicionaractividad.phtml
     *
     */
    function gestionarreportesAction()
    {
        //$jsayuda = '';//$this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $this->render();
    }

    function cargarGridPlanesAction()
    {
        $nodo = $this->_request->getPost('anode');
        $idusuario = $this->global->Perfil->idusuario;
        $dat = $this->pIntegrator->planpdo->CargarPlanes($nodo, $idusuario);
        echo json_encode($dat);
    }

    function generarreportesAction()
    {
        $idusuariosession = $this->global->Perfil->idusuario;
        $nombreusuario = $this->global->Perfil->usuario;
        $valueanno = $this->_request->getPost('valueanno');
        $textomeses = $this->_request->getPost('valuetextomeses');
        $valuemeses = $this->_request->getPost('valuenummeses');

        $fechainicio = null;
        if (json_decode(stripslashes($this->_request->getPost('valuefi')))) {
            $fechainiciox = split(
                'T',
                json_decode(stripslashes($this->_request->getPost('valuefi')))
            );
            $fechainicioy = split('-', $fechainiciox[0]);
            $fechainicio = $fechainicioy[2] . '-' . $fechainicioy[1] . '-'
                . $fechainicioy[0];
        }
        $fechafin = null;
        if (json_decode(stripslashes($this->_request->getPost('valueff')))) {
            $fechafinx = split(
                'T',
                json_decode(stripslashes($this->_request->getPost('valueff')))
            );
            $fechafiny = split('-', $fechafinx[0]);
            $fechafin
                = $fechafiny[2] . '-' . $fechafiny[1] . '-' . $fechafiny[0];
        }

        $idplan = $this->_request->getPost('idplan');
        if ($idplan && !$fechainicio && !$fechafin) {
            $objplan = Doctrine::getTable('DatPlanPdo')->find($idplan);
            if (isset($objplan)) {
                $fechainiciox = $objplan->fechainicio;
                $fechainicioy = split('-', $fechainiciox);
                $fechainicio = $fechainicioy[2] . '-' . $fechainicioy[1] . '-'
                    . $fechainicioy[0];

                $fechafinx = $objplan->fechafin;
                $fechafiny = split('-', $fechafinx);
                $fechafin
                    = $fechafiny[2] . '-' . $fechafiny[1] . '-' . $fechafiny[0];
            }
        }

        $idreporte = $this->_request->getPost('idreporte');
        $conductor = $this->_request->getPost('conductor');
        $encabezado = $this->_request->getPost('encabezado');
        $piepagina = $this->_request->getPost('piepagina');
        $principales = $this->_request->getPost('principales');
        $confidencialidad = $this->_request->getPost('confidencialidad');
        $rangofecha = $this->_request->getPost('rangofecha');
        $todoscrit = $this->_request->getPost('todoscrit');
        $textconfidencialidad = $this->_request->getPost(
            'textconfidencialidad'
        );
        $tituloreporte = $this->_request->getPost('tituloreporte');
        $arrayautores = json_decode(
            stripslashes($this->_request->getPost('arrayautores'))
        );
        $arrayinvol = json_decode(
            stripslashes($this->_request->getPost('arrayinvol'))
        );
        $arrayidnom = json_decode(
            stripslashes($this->_request->getPost('arrayidnom'))
        );

        /*$arrayestadosverdoc*/
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idsubsistema = 15, $idusuariosession, $idtipodoc = 3
        );

        $arrayidautor = array();

        $arrayestados = array();
        if (isset($arrayestadosverdoc['data'][0])) {
            foreach ($arrayestadosverdoc['data'] as $key => $estado) {
                $arrayestados[]['idestado'] = $estado['idestado'];
            }
        }

        if (isset($arrayautores[0])) {
            foreach ($arrayautores as $autor) {
                $idautor = $autor->idusuario;
                if ($autor->tipo == 0) {
                    $idautor = $autor->idgrupo;
                }
                $arrayidautor[]['idusuariocrea'] = $idautor;
            }
        }


        $cero = 0;
        $uno = 1;
        if (isset($arrayinvol[0])) {
            foreach ($arrayinvol as $invol) {
                $idinvol = $invol->idusuario;
                if ($invol->tipo == 0) {
                    $idinvol = $invol->idgrupo;
                }
                $arrayidinvol[]['idinvolucrado'] = $idinvol . $cero;
                $arrayidinvol[]['idinvolucrado'] = $idinvol . $uno;

                if ($invol->tipo == 1) {
                    $arraygrupos
                        = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                        $idinvol
                    );

                    if (isset($arraygrupos[0])) {
                        foreach ($arraygrupos as $grupo) {
                            $arrayidinvol[]['idinvolucrado']
                                = $grupo['idgrupo'] . $cero;
                            $arrayidinvol[]['idinvolucrado']
                                = $grupo['idgrupo'] . $uno;
                        }
                    }
                }
            }
        }


        if (!isset($arrayautores[0]) && !isset($arrayinvol[0]) && !$idplan) {
            $arrayidautor[]['idusuariocrea'] = $idusuariosession;
            $arrayidinvol[]['idinvolucrado'] = $idusuariosession . $cero;
            $arrayidinvol[]['idinvolucrado'] = $idusuariosession . $uno;

            $arraygrupos
                = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
                $idusuariosession
            );
            if (isset($arraygrupos[0])) {
                foreach ($arraygrupos as $grupo) {
                    $arrayidinvol[]['idinvolucrado']
                        = $grupo['idgrupo'] . $cero;
                    $arrayidinvol[]['idinvolucrado'] = $grupo['idgrupo'] . $uno;
                }
            }
        }
        if ($todoscrit == 'true') {
            $operador = " AND ";
        } else {
            $operador = " OR ";
        }
        $objreportemodel = new GestionarreportesModel();
        $cuerporeporte = $objreportemodel->GenerarReporte(
            $idusuariosession, $valueanno, $textomeses, $valuemeses,
            $fechainicio, $fechafin, $idplan, $idreporte, $conductor,
            $nombreusuario,
            $encabezado, $piepagina, $principales, $confidencialidad,
            $textconfidencialidad,
            $tituloreporte, $rangofecha, $arrayidautor, $arrayidinvol,
            $operador, $arrayidnom,
            $arrayestados, $todoscrit
        );

        $session = Zend_Registry::get('session');
        $session->cuerporeporte = $cuerporeporte;
        $session->tituloreporte = $tituloreporte;
        echo json_encode($cuerporeporte);
    }

    function uploadAction()
    {
        $session = Zend_Registry::get('session');
        $cuerporeporte = $session->cuerporeporte;
        $tituloreport = $session->tituloreporte;
        $tituloreporte = str_replace(" ", "_", $tituloreport);
        $extension = $_GET['extension'];
        $variable
            = '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>'
            . $cuerporeporte . '</BODY></HTML>';

        if ($extension == ".xls") {
            $tipo = "excel";
        }
        if ($extension == ".doc") {
            $tipo = "word";
        }
        if ($extension == ".html") {
            $tipo = "html";
        }
        header(
            "Content-type: application/vnd.ms-" . $tipo . "; name='" . $tipo
            . "';Charset=iso-8859-1"
        );
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header(
            "Content-disposition: attachment; filename=" . $tituloreporte
            . $extension
        );
        header("Pragma: no-cache");
        header("Expires: 0");
        echo $variable;
    }

    function configurarfirmaAction()
    {
        $parametros['idusuario'] = $this->global->Perfil->idusuario;
        $parametros['cargoaprueba']
            = $cargoaprueba = $this->_request->getPost('cargoaprueba');
        $parametros['gradoaprueba']
            = $gradoaprueba = $this->_request->getPost('gradoaprueba');
        $parametros['nombreaprueba']
            = $nombreaprueba = $this->_request->getPost('nombreaprueba');
        $parametros['cargoelabora']
            = $cargoelabora = $this->_request->getPost('cargoelabora');
        $parametros['gradoelabora']
            = $gradoelabora = $this->_request->getPost('gradoelabora');
        $parametros['nombreelabora']
            = $nombreelabora = $this->_request->getPost('nombreelabora');

        $objconffirmamodel = new ConfFirmaModel();
        $objconffirmamodel->ConfigurarFirma($parametros);
        echo json_encode(array('msg' => 1));
    }

    function cargarconfiguracionAction()
    {
        $idusuario = $this->global->Perfil->idusuario;
        $objconffirmamodel = new ConfFirmaModel();
        $cad = $objconffirmamodel->CargarConfiguracionFirma($idusuario);
        die("{success: true, data: {$cad}}");
    }

    function cargarreportesexistentesAction()
    {

        $arrayreportes[0]['idreporte'] = 0;
        $arrayreportes[0]['denreporte']
            = 'Plan de Actividades agrupadas por ARC';
        $arrayreportes[0]['descreporte']
            = 'Muestra las actividades agrupadas por &Aacute;reas de Resultados Claves';
        $arrayreportes[0]['icon'] = 'PA.JPG';

        $arrayreportes[1]['idreporte'] = 3;
        $arrayreportes[1]['denreporte']
            = 'Plan de Actividades agrupadas por Objetivos';
        $arrayreportes[1]['descreporte']
            = 'Muestra las actividades agrupadas por objetivos';
        $arrayreportes[1]['icon'] = 'PA.JPG';

        $arrayreportes[2]['idreporte'] = 1;
        $arrayreportes[2]['denreporte'] = 'Listado de Actividades';
        $arrayreportes[2]['descreporte']
            = 'Muestra las actividades en forma de lista simple';
        $arrayreportes[2]['icon'] = 'LA.JPG';

        $arrayreportes[3]['idreporte'] = 2;
        $arrayreportes[3]['denreporte'] = 'Plan Mensual';
        $arrayreportes[3]['descreporte']
            = 'Muestra las actividades en un Gr&aacute;fico de Coordinaci&oacute;n(d&iacute;as del mes) ';
        $arrayreportes[3]['icon'] = 'calendario.jpg';

        echo json_encode(
            array('total' => count($arrayreportes), 'campos' => $arrayreportes)
        );
    }

    public function cargarextensionesAction()
    {
        $objreportesmodel = new GestionarreportesModel();
        $arrayformatos = $objreportesmodel->CargarFormatos();
        echo json_encode(array('data' => $arrayformatos));
    }

}


