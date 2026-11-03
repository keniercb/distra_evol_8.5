<?php

/**
 * Controlador para gestionar reportes
 * Autor: Tte. Nestor Bernal Vidal
 * UCID-ERP
 * V1.0
 */
class CmpreportesController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     * commit abel 123
     */
    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista gestionarreportes.phtml
     */
    function cmpreportesAction()
    {
        $this->view->usarGD = '<script> var usarGD = false; </script>';
        $this->render();
    }

    /**
     * Accion para obtener los reportes existentes
     */
    function cargarreportesexistentesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $objcmpreportesmodel = new CmpreportesModel();
        $arrayreportes = $objcmpreportesmodel->CargarReportesExistentes();
        if (isset($arrayreportes[0])) {
            echo json_encode(
                array('total'  => count($arrayreportes),
                      'campos' => $arrayreportes)
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    /**
     * Accion para obtener las versiones de los reportes existentes
     */
    function cargarversionesreporteAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos->idusuario = $this->global->Perfil->idusuario;
        $datos->idreporte = $this->_request->getPost('idreporte');
        $datos->idtiporeporte = $this->_request->getPost('idtiporeporte');
        $datos->idtipo = $this->_request->getPost('idtipo');
        $objcmpreportes = new CmpreportesModel();
        $arrayversiones = $objcmpreportes->CargarVersionesDeReporte($datos);
        echo json_encode($arrayversiones);
    }
    /**
     * Accion para cargar el formulario de modificar la version del reporte
     */
    function cargarFormVersionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos->idusuario = $this->global->Perfil->idusuario;
        $datos->idversionreporte = $this->_request->getPost('idversionreporte');
        $objcmpreportes = new CmpreportesModel();
        $arrayversiones = $objcmpreportes->cargarFormVersion($datos);
        echo json_encode($arrayversiones);
    }

    /**
     * Accion para obtener los campos a seleccionar en la version del reporte
     */
    function cargarcamposconfeccionversionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos->idusuario = $this->global->Perfil->idusuario;
        $datos->idtiporeporte = $this->_request->getPost('idtiporeporte');
        $datos->modovisual = $this->_request->getPost('modovisualreporte');
        $datos->idversionreporte = $this->_request->getPost('idversionreporte');
        $objcmpreportes = new CmpreportesModel();
        $arraycampos = $objcmpreportes->CargarCamposConfeccionVersion($datos);
        echo json_encode($arraycampos);
    }

    /**
     * Accion para obtener las partes a seleccionar en la version del reporte
     */
    function cargarpartesconfeccionversionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos->idusuario = $this->global->Perfil->idusuario;
        $datos->idtiporeporte = $this->_request->getPost('idtiporeporte');
        $datos->modovisual = $this->_request->getPost('modovisualreporte');
        $datos->idversionreporte = $this->_request->getPost('idversionreporte');
        $objcmpreportes = new CmpreportesModel();
        $arraypartes = $objcmpreportes->CargarPartesConfeccionVersion($datos);
        //print_r($arraypartes);die;
        echo json_encode($arraypartes);
    }

    /**
     * Accion para adicionar la version del reporte
     */
    function adicionarversionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos->idusuario = $this->global->Perfil->idusuario;
        $datos->denversion = $this->_request->getPost('tfdenomversion');
        $datos->descversion = $this->_request->getPost('hedescversion');
        $datos->versionReporte = $this->_request->getPost('versionReporte');
        $datos->arraypartesreporte = json_decode(
            stripslashes($this->_request->getPost('arraypartesreporte'))
        );
        $datos->arraydatosreporte = json_decode(
            stripslashes($this->_request->getPost('arraydatosreporte'))
        );
        $datos->idtiporeporte = $this->_request->getPost('idtiporeporte');
        $objcmpreportes = new CmpreportesModel();
        $respuesta = $objcmpreportes->AdicionarVersionReporte($datos);
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para eliminar la version del reporte
     */
    function eliminarversionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos->idusuario = $this->global->Perfil->idusuario;
        $datos->idversion = $this->_request->getPost('idversion');
        $objcmpreportes = new CmpreportesModel();
        $respuesta = $objcmpreportes->EliminarVersionReporte($datos);
        echo json_encode(array('mensaje' => $respuesta));
    }

    /**
     * Accion para generar el reporte
     */
    function obtenerreporteAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos->idusuariosession = $this->global->Perfil->idusuario;
        $datos->nombreusuario = $this->global->Perfil->usuario;
        $datos->valueanno = $this->_request->getPost('valueanno');
        $datos->ano = $this->_request->getPost('ano');
        $datos->fipcumplido = ($this->_request->getPost('fipcumplido') == 'true') ? 1 : 0;
        $datos->textomeses = $this->_request->getPost('valuetextomeses');
        $datos->idtipofip = $this->_request->getPost('idtipofip');
        $datos->valuemeses = $this->_request->getPost('valuenummeses');
        $datos->idopcion = $this->_request->getPost('idopcion');
        $datos->orientacionhoja = $this->_request->getPost('orientacionhoja');
        $datos->altohoja = $this->_request->getPost('altohoja');
        $datos->anchohoja = $this->_request->getPost('anchohoja');
        $datos->fechainicio = null;
        $datos->tipoletra = $this->_request->getPost('tipoletra');
        $datos->tamanoletra = $this->_request->getPost('tamanoletra');
        $datos->posicionaprobado = explode("px", $datos->tamanoletra);
        $datos->posicionaprobado = $datos->posicionaprobado[0] + 2;
        if (json_decode(stripslashes($this->_request->getPost('valuefi')))) {
            $fechainiciox = split(
                'T',
                json_decode(stripslashes($this->_request->getPost('valuefi')))
            );
            $fechainicioy = split('-', $fechainiciox[0]);
            $datos->fechainicio
                = $fechainicioy[2] . '-' . $fechainicioy[1] . '-'
                . $fechainicioy[0];
        }
        $datos->fechafin = null;
        if (json_decode(stripslashes($this->_request->getPost('valueff')))) {
            $fechafinx = split(
                'T',
                json_decode(stripslashes($this->_request->getPost('valueff')))
            );
            $fechafiny = split('-', $fechafinx[0]);
            $datos->fechafin
                = $fechafiny[2] . '-' . $fechafiny[1] . '-' . $fechafiny[0];
        }
        $datos->idplan = $this->_request->getPost('idplan');
        $datos->idtiporeporte = $this->_request->getPost('idtiporeporte');
        switch ($datos->idtiporeporte) {
            case 5:
                $datos->idtipoelemento = 1;
                break;
            case 11:
                $datos->idtipoelemento = 1;
                break;
            default:
                $datos->idtipoelemento = 3;
        }
        $datos->idversionreporte = $this->_request->getPost('idversionreporte');
        $datos->versionadoSelecionado = $this->_request->getPost('versionadoSelecionado');
        $datos->confidencialidad = $this->_request->getPost('confidencialidad');
        $datos->tituloreporte = $this->_request->getPost('tituloreporte');
        $datos->arrayautores = json_decode(
            stripslashes($this->_request->getPost('arrayautores'))
        );
        $datos->arrayinvol = json_decode(
            stripslashes($this->_request->getPost('arrayinvol'))
        );
        $datos->arrayidnom = json_decode(
            stripslashes($this->_request->getPost('arrayidnom'))
        );

        $datos->rangotitle=1;
        $objcmpreportes = new CmpreportesModel();


      ////  GRupos donde esta el usuario

      if (!isset($datos->arrayautores[0]) && !isset($datos->arrayinvol[0])
      ) {
        $cero = 0;
        $uno = 1;
        $arrayinvolact[] = $datos->idusuariosession;
        $arrayinvolact[] = $datos->idusuariosession . $cero;
        $arrayinvolact[] = $datos->idusuariosession . $uno;
        $arraygrupos
          = $this->pIntegrator->configuracionpdo->DameGruposDondeEstaUsuario(
          $datos->idusuariosession
        );
        if (isset($arraygrupos[0])) {
          foreach ($arraygrupos as $grupo) {
            $arrayinvolact[] = $grupo['idgrupo'] . $cero;
            $arrayinvolact[] = $grupo['idgrupo'] . $uno;
          }
        }

        $datos->arrayinvolucrados = $arrayinvolact;
      }else{
        $datos->arrayinvolucrados = [];
      }


      $cuerporeporte = $objcmpreportes->ObtenerReporte($datos);
      echo json_encode($cuerporeporte);
    }

    function convertirhtmlAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $session = Zend_Registry::get('session');
        $cuerporeporte = $session->cuerporeporte;
        $tituloreport = $session->tituloreporte;
        $tituloreporte = str_replace(" ", "_", $tituloreport);
        $extension = $_GET['extension'];

        if ($extension == ".xls") {
            $tipo = "excel";
        }
        if ($extension == ".doc") {
            $tipo = "word";
        }
        if ($extension == ".html") {
            $tipo = "html";
        }
        $variable
            = '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>'
            . $cuerporeporte . '</BODY></HTML>';
        echo $variable;
    }

    /**
     * Accion para configurar el encabezado y pie de firma delreporte
     */
    function configurarfirmaAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos->idusuario = $this->global->Perfil->idusuario;
        $datos->cargoaprueba = $this->_request->getPost('cargoaprueba');
        $datos->gradoaprueba = $this->_request->getPost('gradoaprueba');
        $datos->nombreaprueba = $this->_request->getPost('nombreaprueba');
        $datos->cargoelabora = $this->_request->getPost('cargoelabora');
        $datos->gradoelabora = $this->_request->getPost('gradoelabora');
        $datos->nombreelabora = $this->_request->getPost('nombreelabora');
        $objconffirmamodel = new ConfFirmaModel();
        $objconffirmamodel->ConfigurarFirma($datos);
        echo json_encode(array('msg' => 1));
    }

    /**
     * Accion para cargar el formulario con el encabezado y pie de pagina
     */
    function cargarconfiguracionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $objconffirmamodel = new ConfFirmaModel();
        $cad = $objconffirmamodel->CargarConfiguracionFirma($idusuario);
        echo json_encode(array('success' => true, 'data'=>$cad));
    }

    /**
     * Accion para cargar el combo con los tipos de hojas
     */
    function cargartipohojasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $tiponomenclador = 8;
        $nomencladores
            = $this->pIntegrator->configuracionpdo->GetTodosNomencladoresPorTipo(
            $tiponomenclador, $idusuario
        );
        //print_r($nomencladores);die();
        if ($nomencladores != null) {
            foreach ($nomencladores as $val) {
                $dat->data [] = array('idtipohoja'   => $val['idnomenclador'],
                                      'denominacion' =>
                                          $val['denom'] . ' (' . $val['ancho']
                                          . ' x ' . $val['alto'] . ')',
                                      'ancho'        => $val['ancho'],
                                      'alto'         => $val['alto']);
            }
        } else {
            $dat->data = array();
        }
        echo json_encode($dat);
    }

    /**
     * Funcion para cargar el combo de estados de aprobacion de los planes
     */
    function cargarcmbestadosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
            $idusuariosession, $idtipodoc = 0
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }

    function traducirMesEsp()
    {
        $mes = date("F");
        if ($mes == "January") {
            $mes = "Enero";
        }
        if ($mes == "February") {
            $mes = "Febrero";
        }
        if ($mes == "March") {
            $mes = "Marzo";
        }
        if ($mes == "April") {
            $mes = "Abril";
        }
        if ($mes == "May") {
            $mes = "Mayo";
        }
        if ($mes == "June") {
            $mes = "Junio";
        }
        if ($mes == "July") {
            $mes = "Julio";
        }
        if ($mes == "August") {
            $mes = "Agosto";
        }
        if ($mes == "September") {
            $mes = "Septiembre";
        }
        if ($mes == "October") {
            $mes = "Octubre";
        }
        if ($mes == "November") {
            $mes = "Noviembre";
        }
        if ($mes == "December") {
            $mes = "Diciembre";
        }
        return $mes;
    }

}

