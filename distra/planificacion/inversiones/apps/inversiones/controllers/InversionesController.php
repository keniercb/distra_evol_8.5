<?php

$dir_www = $_SERVER["DOCUMENT_ROOT"];
//Direccion del Marco de trabajo relativa a la carpeta de publicacion.
$dir_rel_mt = "/";
//Direccion absoluta del marco de trabajo
$dir_abs_mt = str_replace("//", "/", dirname($dir_www . "..") . "/" . $dir_rel_mt);
$config["include_path"] = get_include_path();

$config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/planmeta/comun/lib/tcpdf/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/planmeta/comun/lib/tcpdf/config/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/planmeta/comun/lib/tcpdf/fonts/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/planmeta/comun/lib/tcpdf/include/';
$config['include_path'] .= '' . PATH_SEPARATOR . $dir_abs_mt . 'apps/planificacion/planmeta/comun/lib/tcpdf/tools/';
set_include_path($config["include_path"]);
class InversionesController extends ZendExt_Controller_Secure {
    public function init() {
        $this->_meta = ZendExt_Metadata::getInstance();
        parent::init();
    }

    public function inversionesAction() {
//        $filexml = str_ireplace('/web','/apps/planificacion/comun/conf_integracion.xml',$_SERVER["DOCUMENT_ROOT"]);
//        $xmlconf = false;
//        if(file_exists($filexml)){
//            $xmlconf = simplexml_load_file($filexml);
//        }
//
//        $this->view->sipac_elementos = '';
//        if($xmlconf){
//            foreach($xmlconf->subsistema as $subsistema)
//            {
//                if($subsistema->nombre=='sipac'){
//                    $this->view->sipac_elementos = $this->integrator->planpdo->getJSElementos();
//                }
//            }
//        }
//        if (self::verificarGestorDoc()) {
//            $this->view->gestdoc = $this->integrator->gestordocumental->devolverJSContenido();
//
//            $this->view->usarGD = '<script> var usarGD = true; </script>';
//        } else {
//            $this->view->usarGD = '<script> var usarGD = false; </script>';
//            $this->view->gestdoc = '';
//        }


//        $this->view->jsrepresentacion = $this->integrator->gis->DevolverJS();
        $this->render();
    }

    public function verificarGestorDoc() {
        $dirindex = $_SERVER['SCRIPT_FILENAME'];
        $gestordocumental = substr($dirindex, 0, strrpos($dirindex, 'web'))
                . 'apps/gestordocumental/comun/recursos/xml/ioc.xml';
        if (file_exists($gestordocumental)) {
            $configuracion = new ConfiguracionGD((string) Zend_Registry::getInstance()->config->xml->RepositorioAlfresco);
            $data = parse_url($configuracion->obtenerDireccionRepositorio() . 'api'); /* $this->direccionRepositorio */
            $fp = fsockopen($data['host'], isset($data['port']) ? $data['port'] : 80, $errno, $errstr, 30);
            //if ($fp) {
            /* && $this->integrator->gestordocumental->estaAutenticadoUsuarioActual() == 1 */
            //$autenticacion = $this->integrator->gestordocumental->obtenerAutenticacion();
            //}


            if ($fp) {
                return true;
            }
        }

        return false;
    }

    public function cargaAccionesAction() {
        $identidad = $this->global->Estructura->idestructura;
        $identidadRectora = 0;
        $array_comport = NomDatosnomenclador::getDatosNomPorUriDatosNom('rectorbalance');
        foreach ($array_comport as $indice => $valor) {
            unset($array_comport[$indice]);
            $array_comport[$valor['uridatosnomenclador']] = $valor['iddatosnomenclador'];
        }
        $data = DatEntidaddatosnomenclador::getEntidaddatosnomenclador($array_comport, $params);
        foreach ($data->data as $indice => $valor) {
            if ($valor['d__4']) {
                $identidadRectora = $valor['d__0'];
            }
        }
        if ($identidadRectora != 0) {
            echo json_encode(array('acciones' => TRUE));
        } else {
            echo json_encode(array('acciones' => FALSE));
        }
    }

//Este metodo carga las entidades...
    public function cargarTreeNomencladoresAction() {
        $node = $this->_request->getPost('node');
        $valor = $this->_request->getPost('valor');
        $model = new InversionesModel();
        echo json_encode($model->cargarEntidades($node, $valor));
    }

    function mostrarVerDetallesAction() {
        $datosInv['idinversion'] = $this->_request->getPost('idinversion');
        $datosInv['idejercicio'] = $this->_request->getPost('idejercicio');
        $datosInv['identidad'] = $this->_request->getPost('identidad');
        $parametros->datosinv = json_decode(stripslashes($this->_request->getPost('datosinv')));
        //print_r('entras');die;
        $inv = new InversionesModel();

        $datos = $inv->verDetalles($parametros, $datosInv);
        echo json_encode($datos);
    }

    function verPresupuestoAction() {
        $datosInv['idinversion'] = $this->_request->getPost('idinversion');
        $datosInv['idejercicio'] = $this->_request->getPost('idejercicio');
        $datosInv['identidad'] = $this->_request->getPost('identidad');
        $datosInv['idelemento'] = $this->_request->getPost('idelemento');
        $datosInv['denominacionetapa'] = $this->_request->getPost('denominacionetapa');
        $datosInv['idetapainversion'] = $this->_request->getPost('idetapainversion');
        $parametros->datosinv = json_decode(stripslashes($this->_request->getPost('datosinv')));
        $inv = new InversionesModel();

        $datos = $inv->verPresup($parametros, $datosInv);
        echo json_encode($datos);
    }

    function verFinanciamientoAction() {
        $datosInv['idinversion'] = $this->_request->getPost('idinversion');
        $datosInv['idejercicio'] = $this->_request->getPost('idejercicio');
        $datosInv['identidad'] = $this->_request->getPost('identidad');
        $parametros->datosinv = json_decode(stripslashes($this->_request->getPost('datosinv')));
        $inv = new InversionesModel();
        $datos = $inv->verFinan($parametros, $datosInv);
        echo json_encode($datos);
    }

    public function cargarInversionesAction() {
        ini_set("max_execution_time", 7200); //2hora
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $params['check'] = $this->_request->getPost('check');
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['ejercicio'] = $this->_request->getPost('ejercicio') ? $this->_request->getPost('ejercicio') : 0;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['vigente'] = $this->_request->getPost('vigente');
        $params['factibilidad'] = $this->_request->getPost('factibilidad');
        $params['cartera'] = $this->_request->getPost('cartera');
        $entidades = array();
        $entidadesFinales = array();
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $key => $datos) {
                if ($datos ['field'] == 'codigo') {
                    $params ['filtros']['codigo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'denominacion') {
                    $params ['filtros']['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'clasificacion') {
                    $parametros ['filtros']['clasificacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'tipoinv') {
                    $parametros ['filtros']['tipoinv'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'programa') {
                    $parametros ['filtros']['programa'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'caracteristicas') {
                    $parametros ['filtros']['caracteristicas'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'provincia') {
                    $parametros ['filtros']['provincia'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'forma') {
                    $parametros ['filtros']['forma'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'medioambiente') {
                    $parametros ['filtros']['medioambiente'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'estadoplan') {
                    $parametros ['filtros']['estadoplan'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'sector') {
                    $parametros ['filtros']['sector'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'grupoobra') {
                    $parametros ['filtros']['grupoobra'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'fechainicio') {
                    $parametros ['filtros']['fechaini'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'fechafin') {
                    $parametros ['filtros']['fechafin'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'efecto') {
                    $parametros ['filtros']['efecto'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'idestadoinversion') {
                    if ($datos ['data'] ['value'] == 'SI') {
                        $params ['filtros']['activadosi'] = '1';
                    }
                    if ($datos ['data'] ['value'] == 'NO') {
                        $params ['filtros']['activadono'] = '0';
                    }
                } elseif ($datos ['field'] == 'objetivo') {
                    $parametros ['filtros']['objetivo'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'idestadoaprobacion') {
                    if ($datos ['data'] ['value'] == 'SI') {
                        $params ['filtros']['aprobadosi'] = '1';
                    }
                    if ($datos ['data'] ['value'] == 'NO') {
                        $params ['filtros']['aprobadono'] = '0';
                    }
                } elseif ($datos ['field'] == 'fasttrack') {
                    if ($datos ['data'] ['value'] == 'SI') {
                        $params ['filtros']['fassi'] = '1';
                    }
                    if ($datos ['data'] ['value'] == 'NO') {
                        $params ['filtros']['fasno'] = '0';
                    }
                }elseif ($datos ['field'] == 'bloqueada') {
                    if ($datos ['data'] ['value'] == 'SI') {
                        $params ['filtros']['activadosi'] = '1';
                    }
                    if ($datos ['data'] ['value'] == 'NO') {
                        $params ['filtros']['activadono'] = '0';
                    }
                } /* elseif ($datos ['field'] == 'preparacion') {
                  if ($datos ['data'] ['value'] == 'SI') {
                  $params ['filtros']['carterasi'] = '1';
                  }
                  if ($datos ['data'] ['value'] == 'NO') {
                  $params ['filtros']['carterano'] = '0';
                  }
                  } */
            }
        }
        $model = new InversionesModel();
        if ($params['check'] == 1) {
            /*  $dominios = $this->integrator->metadatos->DameHijosEstructura($params['identidad']);
              if ($dominios[0] != "") {
              foreach ($dominios as $key => $k) {
              $entidades_hijas = array();
              $entidades_hijas = self::entidadesHijas($k->id);
              $entidades = array_merge($entidades_hijas, $entidades);
              }
              $entidades[] = $params['identidad'];
              foreach ($entidades as $key => $k) {
              if (is_array($k)) {
              $entidadesFinales[] = $k['identidad'];
              } else {
              $entidadesFinales[] = $k;
              }
              }
              } else {
              $entidadesFinales[0] = $params['identidad'];
              } */
            $dominios = $this->integrator->metadatos->DameHijosEstructura($params['identidad']);
            if ($dominios[0] != "") {
                foreach ($dominios as $key => $k) {
                    $entidades_hijas = array();
                    $entidades_hijas = self::entidadesHijas($k->id);
                    $entidades = array_merge($entidades_hijas, $entidades);
                }
                $entidades[] = $params['identidad'];
                foreach ($entidades as $key => $k) {
                    if (is_array($k)) {
                        $entidadesFinales[] = $k['identidad'];
                    } else {
                        $entidadesFinales[] = $k;
                    }
                }
            } else {
                $entidadesFinales[0] = $params['identidad'];
            }
        } else {
            $entidadesFinales[0] = $params['identidad'];
        }

        $result = $model->cargarInversiones($params, $entidadesFinales, json_decode(stripslashes($this->_request->getPost('idinversion'))));
        echo json_encode(array('data' => array_slice($result['data'], $this->_request->getPost('start'), $this->_request->getPost('limit')),
            'total' => count($result['data'])));
    }

    public function entidadesHijas($identidad, $text) {
        $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad);
        $entidades_hijas = array();
        $entidades_hijas[0]['identidad'] = $identidad;
        $entidades_hijas[0]['entidad'] = $text;
        foreach ($dominios as $key => $entidad_hija) {
            if ($entidad_hija->leaf == 1) {
                $entidades_hijas[$key + 1]['identidad'] = $entidad_hija->id;
                $entidades_hijas[$key + 1]['entidad'] = $entidad_hija->text;
            } else {
                $entidades_hijas = array_merge($entidades_hijas, self::entidadesHijas($entidad_hija->id, $entidad_hija->text));
            }
        }
        return $entidades_hijas;
    }

    public function cargarDatosNomencladoresAction() {
        $tree = array(array(
                'text' => 'Tipo inversion programa',
                'expanded' => true,
                'id' => 'id1',
                'children' => array(array(
                        'text' => 'Inversion nominales',
                        'expanded' => true,
                        'id' => 'id2',
                        'leaf' => true
                    ), array(
                        'text' => 'Inversion no nominales',
                        'expanded' => true,
                        'id' => 'id3',
                        'leaf' => true
                    ))
        ));
        echo (json_encode($tree));
    }

    public function listarEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

    public function buscarEspacioFactibilidadAction() {

        $idTipoInversion = $this->_request->getPost('idtipoinversion');
        $codigoInversion = $this->_request->getPost('codigoinversion');
        $idInversion = $this->_request->getPost('idinversion');
        $espacio = InversionesModel::buscarEspacioFactibilidadByTipoInv($idTipoInversion);
        $espacio_inversion = '';

		
		

        //si se configur'o el doc de factibilidad, se busca su espacio y se crea el espacio de la inversion dentro
        if (!empty($espacio) && $espacio[0]['iddocumentos'] != '') {
            $existe = 1;
            $datos_doc_espacio = $this->integrator->datosmaestros->obtenerDocumentoPrimPorId($espacio[0]['iddocumentos']);

            $padre = $datos_doc_espacio->idespaciotrabajo;
            $nombre = 'EF-' . $codigoInversion;
// print_r($padre);
// print_r('--');
// print_r($nombre);die('dede');
            $adicion = $this->integrator->gestordocumental->adicionarEspacioTrabajo($padre, $nombre, $nombre, array());
// print_r($adicion);die('ww23');

            if($adicion['identificadorNodoPadre']!= ''){
                $objInversion = Doctrine::getTable('DatInversion')->find($idInversion);
                $objInversion->idcontenido = $adicion['identificadorNodoPadre'];
                $objInversion->save();
            }


            $espacio_inversion = $adicion['identificadorNodoPadre'];
        } else
            $existe = 0;

        echo json_encode(array('existe' => $existe, 'espacio_inversion' => $espacio_inversion));
    }

    public function guardarDocumentoFactibilidadAction() {

        $idDocumento = $this->_request->getPost('iddocumento');
        $idInversion = $this->_request->getPost('idinversion');
        $nameDocumento = $this->_request->getPost('nemedocumento');
        $result = DatInversionestfactModel::guardarDocumentoFactibilidad($idInversion, $idDocumento, $nameDocumento);
        echo json_encode($result);
    }

    public function eliminarDocFactibilidadAction() {

        $idDocumento = $this->_request->getPost('iddocumento');
        $idInversion = $this->_request->getPost('idinversion');
        $idInversionDoc = $this->_request->getPost('idinversionestfact');
        //$result = DatInversionestfactModel::eliminarDocFactibilidad($idInversion, $idDocumento, $idInversionDoc);
        try {
            $documentoGestor = $this->integrator->gestordocumental->eliminarElementosContenido(array($idDocumento), 'total');
            //print_r($documentoGestor);die;
            if ($documentoGestor) {
                $objDocFactibilidad = Doctrine::getTable('DatInversionestfact')->find($idInversionDoc);
                DatInversionestfactModel::Eliminar($objDocFactibilidad);
                $result = array('codgMensaje' => 1, 'mensaje' => 'El documento se ha eliminado satisfactoriamente');
            } else
                $result = array('codgMensaje' => 25, 'mensaje' => 'Error al intentar eliminar el documento');
        } catch (Exception $e) {
            $result = array('codgMensaje' => 25, 'mensaje' => 'Error al intentar eliminar el documento');
        }

        echo json_encode($result);
    }

    public function setVigenteDocFactibilidadAction() {

        $idInversionDoc = $this->_request->getPost('idinversionestfact');
        $idInversion = $this->_request->getPost('idinversion');
        $result = DatInversionestfactModel::setVigenteDocFactibilidad($idInversionDoc, $idInversion);
        echo json_encode($result);
    }

    public function gestionarAprobacionAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idinversion'] = json_decode(stripslashes($this->_request->getPost('idinversion')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        if ($this->_request->getPost('aprobar') == 'false') {
            $parametros['idaprobado'] = 2;
        } else {
            $parametros['idaprobado'] = 1;
        }
        if (InversionesModel::aprobar_desaproInv($parametros))
            $dat->codMsgM = 1;
        else
            $dat->codMsgM = 25;
        if ($estado == 0)
            $dat->mensaje = 'desactivado';
        else
            $dat->mensaje = 'activado';

        echo json_encode($dat);
    }

    public function importarFicheroInversionAction() {
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['tipoexcel'] = $this->_request->getPost('tipoexcel');
        $parametros['iddominio'] = $this->global->Perfil->iddominio;
        $filename = $_FILES['file']['tmp_name'];
        $parametros['idconcepto'] = 10;
        $parametros['file'] = $filename;
        $fileextension = $_FILES['file']['type'];
        $filename = explode('.', $_FILES['file']['name']);
        if ($fileextension == 'application/vnd.ms-excel' || $fileextension == 'application/xls' || $filename[count($filename) - 1] == 'xls' || $filename[count($filename) - 1] == 'xlsx'
        ) {
            $res = DatImportarModel::importarFichero($parametros);
            echo json_encode($res);
        } else {
            echo json_encode(array('cod' => 53));
        }
    }

    public function verificarConcurrenciaAction() {
        $parametros->tipoexcel = $this->_request->getPost('tipoexcel');
        switch ($parametros->tipoexcel) {
            case 1:
                $nombreFichero = 'basico.xls';
                break;
            case 2:
                $nombreFichero = 'demanda_equipos.xls';
                break;
            case 3:
                $nombreFichero = 'inversiones.xls';
                break;
            default:
                break;
        }
        $result = 1;
        if (file_exists($_SERVER['DOCUMENT_ROOT'] . '/excelimport/' . $nombreFichero)) {
            $result = 2;
        }
        echo json_encode($result);
    }

    public function gestionarACmpAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idcomponente'] = json_decode(stripslashes($this->_request->getPost('idformatoetapa')));
        $parametros['aprobar'] = $this->_request->getPost('aprobar');
        if ($parametros['aprobar'] == 'false') {
            $parametros['idaprobado'] = 0;
        } else {
            $parametros['idaprobado'] = 1;
        }
        if (InversionesModel::aprobar_desaproICmp($parametros))
            $dat->codMsgM = 1;
        else
            $dat->codMsgM = 25;
        if ($parametros['idaprobado'] == 1)
            $dat->mensaje = 'aprobado';
        else
            $dat->mensaje = 'desaprobado';

        echo json_encode($dat);
    }

    public function gestionarActivacionAction() {
        $parametros['idinversion'] = json_decode(stripslashes($this->_request->getPost('idinversion')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        if ($this->_request->getPost('activar') == 'false') {
            $parametros['idestado'] = 2;
        } else {
            $parametros['idestado'] = 1;
        }

        if (InversionesModel::activar_desactivarInv($parametros))
            $dat->codMsgM = 1;
        else
            $dat->codMsgM = 25;
        if ($estado == 0)
            $dat->mensaje = 'desactivado';
        else
            $dat->mensaje = 'activado';

        echo json_encode($dat);
    }
    
    public function gestionarBloqueoAction() {
        $parametros['idinversion'] = json_decode(stripslashes($this->_request->getPost('idinversion')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        if ($this->_request->getPost('activar') == 'false') {
            $parametros['idestado'] = 0;
        } else {
            $parametros['idestado'] = 1;
        }

        if (InversionesModel::Bloquear_DesbloquearInv($parametros))
            $dat->codMsgM = 1;
        else
            $dat->codMsgM = 25;
        if ($estado == 0)
            $dat->mensaje = 'desactivado';
        else
            $dat->mensaje = 'activado';

        echo json_encode($dat);
    }

    public function cargarComponentesAction() {

        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['idinversion'] = $this->_request->getPost('idinversion') ? $this->_request->getPost('idinversion') : 0;
        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $key => $datos) {
                if ($datos ['field'] == 'denominacion') {
                    $params ['filtros']['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'aprobado') {
                    if ($datos ['data'] ['value'] == 'SI') {
                        $params ['filtros']['value'] = 'aprobadosi';
                    }
                    if ($datos ['data'] ['value'] == 'NO') {
                        $params ['filtros']['value'] = 'aprobadono';
                    }
                } elseif ($datos ['field'] == 'orden') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $params ['filtros']['orden_condicion'] = ">";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $params ['filtros']['orden_condicion'] = "<";
                    } else {
                        $params ['filtros']['orden_condicion'] = "=";
                    }
                }
            }
        }
        $model = new InversionesModel();
        $data = $model->cargarComponentes($params);
        if ($params['idinversion'] == 0) {
            $array = array();
            echo json_encode(array('data' => $array));
        } else {
            echo json_encode(array('data' => array_slice($data['data'], $this->_request->getPost('start'), $this->_request->getPost('limit')), 'total' => count($data['data'])));
        }
    }
    
    public function listarIndicadoresAction() {
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['idinversion'] = $this->_request->getPost('idinversion') ? $this->_request->getPost('idinversion') : 0;
        $params['idetapainversion'] = $this->_request->getPost('idetapainversion');
        $params['identidadmodelo'] = $this->_request->getPost('idequipoplan');
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        $integrator = $this->integrator;
        $centrobalances = NomIndicadorModel::listarCentroBalance($integrator, null, null);
        $objeto = $this->nomenclador = new ZendExt_Nomencladores_ADT ();
        $paises = $this->nomenclador->selectParam('nom_pais', array('idpais', 'nombrepais'));
       
        //este servicio esta dando error en el por eso se in
         $naturaleza =array();
        //$naturaleza = $this->integrator->datosmaestros->obtenerDatosArbolNaturaleza();

        if (is_array($params['filtros'])) {
            foreach ($params['filtros'] as $key => $datos) {
                if ($datos ['field'] == 'denominacion') {
                    $params ['filtros']['denominacion'] = $datos ['data'] ['value'];
                } elseif ($datos ['field'] == 'aprobado') {
                    if ($datos ['data'] ['value'] == 'SI') {
                        $params ['filtros']['value'] = 'aprobadosi';
                    }
                    if ($datos ['data'] ['value'] == 'NO') {
                        $params ['filtros']['value'] = 'aprobadono';
                    }
                } elseif ($datos ['field'] == 'orden') {
                    if ($datos ['data'] ['comparison'] == "gt") {
                        $params ['filtros']['orden_condicion'] = ">";
                    } elseif ($datos ['data'] ['comparison'] == "lt") {
                        $params ['filtros']['orden_condicion'] = "<";
                    } else {
                        $params ['filtros']['orden_condicion'] = "=";
                    }
                }
            }
        }
        
        $data = InversionesModel::listarIndicadores($params, $unidades, $centrobalances, $paises, $naturaleza);
        echo json_encode(array('data' => array_slice($data->data, $this->_request->getPost('start'), $this->_request->getPost('limit')),
            'total' => count($data->data)));
    }

    public function listarUnidadmedidaAction() {
        $data = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        $resul['data'] = $data;
        echo json_encode($resul);
    }

    public function ListarComboCentrobalanceAction() {
        $idcentrobalance = 1; //numero fijo en la BD para Nomdatosnomenclador
        $centrobalance = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcentrobalance);
        foreach ($centrobalance as $k => $valor) {
            $dat [$k] ['identidad'] = $valor ['identidad'];
            $datosentidad = $this->integrator->metadatos->DameEstructura($valor ['identidad']);
            $dat [$k] ['denominacion'] = $datosentidad [0]->denominacion;
            $dat [$k] ['identidaddatosnomenclador'] = $valor ['identidaddatosnomenclador'];
        }
        echo json_encode(array('data' => $dat));
    }

    public function cambiarEstadoAction() {
        $params['idcomponenete'] = $this->_request->getPost('idcomponenete');
        $params['idetapa'] = $this->_request->getPost('idetapa');
        $params['estado'] = $this->_request->getPost('estado');
        $params['idtransicion'] = $this->_request->getPost('idtransicion');
        $params['idestadofinal'] = $this->_request->getPost('idestadofinal');
        $params['idestadoinicial'] = $this->_request->getPost('idestadoinicial');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idestadoflujotrabajo'] = $this->_request->getPost('idestadoflujotrabajo');
        $params['idcumplimientoinversion'] = $this->_request->getPost('idcumplimientoinversion');
        $params['orden'] = $this->_request->getPost('orden');
        $model = new InversionesModel();
        $result = InversionesModel::cambiarEstado($params);
        if ($result) {
            $dat->codMsgM = 1;
        } else
            $dat->codMsgM = 22;


        echo json_encode($dat);
    }

    public function listarEstadosAction() {
        $params['idetapa'] = $this->_request->getPost('idetapa');
        $params['orden'] = $this->_request->getPost('orden');
        $params['idestadoflujotrabajo'] = $this->_request->getPost('idestadoflujotrabajo');
        $params['idflujotrabajo'] = $this->_request->getPost('idflujotrabajo');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $model = new InversionesModel();
        $result = $model->listarEstados($params);
        if ($result[0] != "") {
            $resul['data'] = $result;
            echo json_encode($resul);
        } else {
            $res = array();
            $resul['data'] = $res;
            echo json_encode($resul);
        }
    }

    public function listarEquiposAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['limit'] = $this->_request->getPost('limit');
        $params['start'] = $this->_request->getPost('start');
        $params['idcomponente'] = $this->_request->getPost('idcomponente');
        $model = new InversionesModel();
        $result['codigo'] = 0452;
        $result['denominacion'] = "fhfgh";
        echo json_encode(array('data' => $result));
    }

    public function cargarElementosAction() {
            $params['niveles'] = $this->_request->getPost('niveles');

            $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
            $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
            $params['idcomponente'] = $this->_request->getPost('idcomponente') ? $this->_request->getPost('idcomponente') : 0;
            $params['idinversion'] = $this->_request->getPost('idinversion');
            $params['filtros'] = $this->_request->getPost('filtros');

        if(!$params['niveles']) {
            if (is_array($params['filtros'])) {
                foreach ($params['filtros'] as $key => $datos) {
                    if ($datos ['field'] == 'denominacion') {
                        $params ['filtros']['denominacion'] = $datos ['data'] ['value'];
                    } elseif ($datos ['field'] == 'parametrosdinamicos') {
                        if ($datos ['data'] ['value'] == 'SI') {
                            $params ['filtros']['value'] = 'parametrosdinamicossi';
                        }
                        if ($datos ['data'] ['value'] == 'NO') {
                            $params ['filtros']['value'] = 'parametrosdinamicosno';
                        }
                    } elseif ($datos ['field'] == 'documento') {
                        if ($datos ['data'] ['value'] == 'SI') {
                            $params ['filtros']['value'] = 'documentosi';
                        }
                        if ($datos ['data'] ['value'] == 'NO') {
                            $params ['filtros']['value'] = 'documentono';
                        }
                    }
                }
            }
            $model = new InversionesModel();
            $data = $model->cargarElementos($params);
            if ($params['idcomponente'] == 0) {
                $array = array();
                echo json_encode(array('data' => $array));
            } else {
                echo json_encode(array('data' => array_slice($data->data, $this->_request->getPost('start'), $this->_request->getPost('limit')),
                    'total' => count($data->data)));
            }
        }else{
           /*dri ini_set("max_execution_time", 600);
            $params = array();
            $params['esrector'] = $this->_request->getPost('esrector');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['idmodelo'] = $this->_request->getPost('idmodelo');
            $params ['idaprobacion_actividad'] = array(3, 4);
            $params ['idEstructuraPadre'] = $this->_request->getPost('idEstructuraPadre');
            $params ['calcularrestoxdistrib'] = $this->_request->getPost('calcularrestoxdistrib');
            $global = ZendExt_GlobalConcept::getInstance();
            if ($this->_request->getPost('idespecialidad') != '') {
                $params['idespecialidad'] = $this->_request->getPost('idespecialidad');
            } else {
                $params['idespecialidad'] = $global->Estructura->idespecialidad;
            }
            $params['identidad'] = $this->_request->getPost('identidad');
            if ($params ['idEstructuraPadre'] == 'undefined') {
                $params ['idEstructuraPadre'] = $params['identidad'];
            }
            $params ['calcularimporte'] = $this->_request->getPost('calcularimporte');
            $is_leaf = $this->_request->getPost('is_leaf');
            if ($params['idespecialidad'] != null && $params['identidad'] != null && $params['identidad'] != '0') {
                $array_res_formato_ultimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
                $params ['nivel'] = $array_res_formato_ultimonivel[1];

                if ($this->_request->getPost('codigo') != '') {
                    $params ['codigo'] = $this->_request->getPost('codigo');
                }
                if ($this->_request->getPost('denominacion') != '') {
                    $params ['denominacion'] = $this->_request->getPost('denominacion');
                }
                if ($this->_request->getPost('calcularimporte') != '') {
                    $params ['calcularimporte'] = $this->_request->getPost('calcularimporte');
                }
                if ($this->_request->getPost('idaprobacion') != '') {
                    $params ['idaprobacion'] = $this->_request->getPost('idaprobacion');
                }


                $params['filtros'] = $this->_request->getPost('filtros');
                $params['start'] = $this->_request->getPost('start');
                $params['limit'] = $this->_request->getPost('limit');


                $modelActEnt = new DatActividadentidadModel ();
                $params['entidades_productoras'] = array('-1');
                $security = ZendExt_Aspect_Security_Sgis::getInstance();
                if ($params ['calcularrestoxdistrib'] == 'true') {
                    $params['entidades_productoras'] = DatActividadentidad::auxObtenerEntidadesHijas(
                        $params ['idEstructuraPadre'], $security
                    );
                }
                if ($is_leaf == 'true') {

                    $params['entidades'] = array('0' => $params['identidad']);
                    $datos_entidad = $this->integrator->metadatos->DameEstructura($params['identidad']);
                    $params['id_especialidades'] [] = $datos_entidad [0]->idespecialidad;
                    if ($params['esrector'] == 'true') {
                        $params['idespecialidad'] = $datos_entidad [0]->idespecialidad;
                    }
                    echo json_encode($modelActEnt->listarActsNivActPorEntidad($params));
                } else {
                    /* Consolidar nivels de actividad */
             /*dri       $idestructura = $this->integrator->metadatos->DameEstructura($params['identidad']);
                    $params['entidades'] = DatActividadentidad::auxObtenerEntidadesHijas(
                        $idestructura[0]->idestructura, $security
                    );

                    if ($params['entidades'] [0] != null) {
                        $params['id_especialidades'] = array();
                        foreach ($params['entidades'] as $key => $valor_identidad) {
                            $temp_especialidades = 0;
                            $entidades[] = $this->integrator->metadatos->DameEstructura($valor_identidad);
                            foreach ($params['id_especialidades'] as $k => $esp) {
                                if ($esp == $entidades [$key][0]->idespecialidad) {
                                    $temp_especialidades = 1;
                                }
                            }
                            if ($temp_especialidades == 0) {
                                $params['id_especialidades'] [] = $entidades [$key][0]->idespecialidad;
                            }
                        }
                        $result = $modelActEnt->listarActsNivActPorEntidad($params);

                        echo json_encode($result);
                    } else {
                        $data->data = array();
                        $data->total = 0;
                        echo json_encode($data);
                    }
                }
            } else {
                if ($params['identidad'] == '0' || $params['identidad'] == null) {
                    $data->data = array();
                    $data->total = 0;
                    echo json_encode($data);
                } else {
                    echo json_encode(
                        array('codMsg' => 3, 'mensaje' => 'Su secci&oacute;n ha expirado, por favor reinicie el sistema. ')
                    );
                }
            }dri*/

            //----------------Listar actividades aprobadas, actividas del ultimo nivel------//
        /*    $params['filtros'] = $this->_request->getPost('filtros');
            if (is_array($params['filtros'])) {
                foreach ($params['filtros'] as $key => $datos) {
                    if ($datos ['field'] == 'denominacion') {
                        $params ['filtros']['denominacion'] = $datos ['data'] ['value'];
                    } elseif ($datos ['field'] == 'codigo') {
                            $params ['filtros']['codigo'] = $datos ['data'] ['value'];
                    } elseif ($datos ['field'] == 'nivelimporte') {
                            $params ['filtros']['nivelimporte'] = $datos ['data'] ['value'];
                    }
                }
            }

            $params['identidad'] = $this->_request->getPost('identidad');
            $params['start'] = $this->_request->getPost('start');
            $params['limit'] = $this->_request->getPost('limit');
            $modelActividad = new DatActividadModel ();
            $result =  $modelActividad->listarActividadesInversiones($params);
            echo json_encode($result);*/
            //----------------FIN------------------------------------------------------------//
        }
    }

    public function eliminarInversionAction() {
        ini_set("max_execution_time", 3600);
        $parametros['idinversion'] = json_decode(stripslashes($this->_request->getPost('idinversion')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['iduser'] = $this->global->Perfil->usuario;
        $model = new InversionesModel();
        if ($parametros['idinversion'][0] != '') {
            $model->EliminarInversion($parametros);
            echo json_encode(array('codMsgAs' => 1));
        } else {
            echo json_encode(array('codMsgAs' => 25));
        }
    }

    public function listarPresupuestoAction() {
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $params['filtros'] = $this->_request->getPost('filtros');

        $model = new InversionesModel();
        if ($params['idinversion']) {
            $result = $model->listarP($params);
            echo json_encode(array('data' => $result));
        } else {
            $result = array();
            echo json_encode(array('data' => $result));
        }
    }

    public function listarFinanciamientoAction() {
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $params['filtros'] = $this->_request->getPost('filtros');
        $model = new InversionesModel();
        if ($params['idinversion']) {
            $result = $model->listarF($params);
            echo json_encode(array('data' => $result));
        } else {
            $result = array();
            echo json_encode(array('data' => $result));
        }
    }

    public function listarLiquidosAction() {
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $params['filtros'] = $this->_request->getPost('filtros');

        $model = new InversionesModel();
        if ($params['idinversion']) {
            $result = $model->listarLiq($params);
            echo json_encode(array('data' => $result));
        } else {
            $result = array();
            echo json_encode(array('data' => $result));
        }
    }

    public function adicionarInversionesAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $model = new InversionesModel();
        try {
            InversionesModel::adicionarInversiones($this->_request->getPost(), $this->global->Perfil->usuario);
            // $model->actualizarCuadrada($this->_request->getPost());
            echo json_encode(array('codMsgA' => 1));
        } catch (Exception $e) {
            die($e);
            echo json_encode(array('codMsgA' => 25));
        }
    }

    public function listarComboClasificacionAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->cargarClasificacion($params);
        echo json_encode(array('data' => $result));
    }

    public function listarMonedaAction() {
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idmonedaentidad'] = json_decode(stripslashes($this->_request->getPost('idmonedaentidad')));
       /* if($parametros['idmonedaentidad']){
            $parametros['idmonedaentidad']= implode(',',$parametros['idmonedaentidad']);
        }*/
        $model = new InversionesModel();

        $result = $model->ListarMonedas($parametros);
        //print_r($result);die;
        echo json_encode($result);
    }

    public function listarTodosDatosMonedaAction() {
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $model = new InversionesModel();
        $result = $model->listarTodosDatosMoneda($parametros);
        //print_r($result);die;
        echo json_encode($result);
    }

    public function listarProvinciasAction() {
        $model = new InversionesModel();
        $result = $model->listarProvincias();
        echo json_encode($result);
    }

    public function cargarNomencladoresInversionesAction() {
        $model = new InversionesModel();
        echo json_encode($model->cargarNomencladorInversion(null, null));
    }

    public function cargarDatosNomInversionAction() {
        $params['idNomInversion'] = $this->_request->getPost('idNomInversion');
        $model = new DatTipoinversionprogramaModel();

        if ($params['idNomInversion'] == 0) {
            $datos = array();
            echo json_encode(array('data' => $datos));
        } else {
            $cargaDesdeGrid = false;
            $datos = $model->obtenerArrayIdDatosGrupoNom($params, $cargaDesdeGrid);
            foreach ($datos->data as $key => &$valor) {

                $valor['text'] = $valor['denominacion'];
                $valor['codigo'] = $valor['denominacion'];
            }
            echo json_encode($datos);
        }
    }

    public function listarComboTipoInversionAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->cargarTipoInversion($params);
        echo json_encode($result);
    }

    public function listarComboMedioAmbienteAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->listarCmbMedioAmbiente($params);
        echo json_encode(array('data' => $result));
    }

    public function listarComboProgramadaAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->cargarProgramada($params);
        echo json_encode($result);
    }

    public function listarComboCaracteristicaAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->cargarCaracteristica($params);
        echo json_encode(array('data' => $result));
    }

    public function listarTipoFinanAction() {
        $model = new InversionesModel();
        $result = $model->listarTipoFinan();
        echo json_encode(array('data' => $result));
    }

    public function listarFinancistaAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->listarFinancista($params);
        echo json_encode(array('data' => $result));
    }

    public function listarComboFormaPropiedadAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->cargarForma($params);
        echo json_encode(array('data' => $result));
    }

    public function listarGrupoObraAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->cargarGrupoObra($params);
        echo json_encode(array('data' => $result));
    }

    public function listarEstadoAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->cargarEstado($params);
        echo json_encode(array('data' => $result));
    }

    public function listarSectorEstrategicoAction() {
        $model = new InversionesModel();
        $result = $model->cargarSectorEstrategico();
        echo json_encode(array('data' => $result));
    }

    public function listarComboObjetivoAction() {
        $model = new InversionesModel();
        echo json_encode(array('data' => $model->listarObjetivo()));
    }

    public function listarComboDesempennoAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        echo json_encode(array('data' => $model->listarDesempenno($params)));
    }

    public function listarComboEstadoAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        echo json_encode(array('data' => $model->listarEstado($params)));
    }

    public function listarComboEfectoAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        echo json_encode(array('data' => $model->listarEfecto($params)));
    }

    public function listarGestionarParamAction() {
        $params['accion'] = $this->_request->getPost('accion') ? $this->_request->getPost('accion') : null;
        $params['idelemento'] = json_decode(stripslashes($this->_request->getPost('idelemento')));
        $params['denominacion'] = json_decode(stripslashes($this->_request->getPost('denominacion')));

        $model = new InversionesModel();
        echo json_encode(array('data' => $model->listarGestionarParam($params)));
    }

    public function listarGestionarDocAction() {
        $params['accion'] = $this->_request->getPost('accion') ? $this->_request->getPost('accion') : null;
        $params['idelemento'] = $this->_request->getPost('idelemento'); //idetapaelementoinversion
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['denominacion'] = $this->_request->getPost('denominacion'); //tipo de documento
        $params['documentos'] = json_decode(stripslashes($this->_request->getPost('documentos')));
        $params['iddocumento'] = $this->_request->getPost('iddocumento');
        $params['name'] = $this->_request->getPost('name'); //nombre del espacio de trabajo
        $padre = "0485686c-4711-430f-aa85-a7e445aeae4c"; //CARPETA DONDE PLANIF GUARDA SUS ESPACIOS DE TRABAJO.(cambiar luego)
        $propiedadAdd = Array(); //PROPIEDADES ADICIONALES
        $model = new InversionesModel();
        if ($params['name'] != "" && $params['denominacion'] != "") {
            if ($model->validarExistencia($params) == 0) {
                $espacio = $this->integrator->gestordocumental->adicionarEspacioTrabajo($padre, $params['name'], $params['name'], $propiedadAdd);
                $model->listarGestionarDoc($params, $espacio['identificadorNodoPadre']);
                echo json_encode(array('codMsgAs' => $espacio['identificadorNodoPadre']));
            } else {
                $idcontenido = InversionesModel::buscarContenido($params['idelemento']);
                echo json_encode(array('codMsgAs' => $idcontenido[0]['idcontenido']));
            }
        } else {
            echo json_encode(array('codMsgAs' => 25));
        }
    }

    public function listarParamAction() {
        $model = new InversionesModel();
        echo json_encode(array('data' => $model->listarParam()));
    }

    public function listarDocAction() {
        $parametros['iddocumento'] = $this->_request->getPost();
        $this->integrator->gestordocumental->abrirdocumento($parametros['iddocumento']);
    }

    public function guardarValorAction() {
        $params['val'] = json_decode(stripslashes($this->_request->getPost('valores')));
        $model = new InversionesModel();
        if ($this->_request->getPost('idelemento') != 0) {
            try {
                $datos = $model->guardarValor($this->_request->getPost(), $params, $this->global->Perfil->usuario);
                $model->actualizarCuadrada($this->_request->getPost());
                echo json_encode(array('codMsgA' => 1));
            } catch (Exception $e) {
                echo json_encode(array('codMsgAs' => 22));
            }
        } else {
            echo json_encode(array('codMsgA' => 25));
        }
    }

    public function listarValorAction() {
        $params['filas'] = $this->_request->getPost('idejercicio');
        $params['idetapainversion'] = $this->_request->getPost('idetapainversion');
        $params['denominacionetapa'] = $this->_request->getPost('denominacionetapa');
        $params['idelemento'] = $this->_request->getPost('idelemento') ? $this->_request->getPost('idelemento') : 0;
        if ($params['denominacionetapa'] != '' && $params['idelemento'] != '') {
            $model = new InversionesModel();
            echo json_encode(array('data' => $model->ListarElementoV($params)));
        } else {
            echo json_encode(array('data' => array()));
        }
    }

    public function addDelParAction() {
        $params['accion'] = $this->_request->getPost('accion') ? $this->_request->getPost('accion') : null;
        $params['idparmetros'] = json_decode(stripslashes($this->_request->getPost('idparmetros')));
        $params['idelemento'] = $this->_request->getPost('idelemento');
        $model = new InversionesModel();
        echo json_encode(array('data' => $model->addDel($params)));
    }

    public function VerdocumentoAction() {
        $params['accion'] = $this->_request->getPost('accion') ? $this->_request->getPost('accion') : null;
        $params['idelemento'] = $this->_request->getPost('idelemento');
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $key => $datos) {
                if ($datos ['field'] == 'denominacion') {
                    $params ['filtros']['denominacion'] = $datos ['data'] ['value'];
                }
            }
        }
        $model = new InversionesModel();
        $result = $model->listarDoc($params);
        echo json_encode($result);
    }

    public function GetDocumentosFactibilidadByInversionAction() {
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $model = new InversionesModel();
        $result = $model->GetDocumentosFactibilidadByInversion($params);
        echo json_encode(array('data' => $result));
    }

    public function verEspacioTrabajoAction() {
        try {
            $params['idelemento'] = $this->_request->getPost('idelemento'); //idetapaelementoinversion
            $params['iddoc'] = $this->_request->getPost('iddoc'); //tipo de doc del elemento
            $params['identidad'] = $this->_request->getPost('identidad');
            $params['name'] = $this->_request->getPost('name'); //nombre del espacio de trabajo
            $espacio_elemento = '';

            $datos_doc_espacio = $this->integrator->datosmaestros->obtenerDocumentoPrimPorId($params['iddoc']);
            $datos_doc_espacio_array = (array) $datos_doc_espacio;
            if (!empty($datos_doc_espacio_array)) {
                $padre = $datos_doc_espacio_array['idespaciotrabajo'];
                $adicion = $this->integrator->gestordocumental->adicionarEspacioTrabajo($padre, $params['name'], $params['name'], array());
                $params['idcontenido'] = $adicion['identificadorNodoPadre'];
                $elemModel = new DatElementoModel();
                $adicion_tabla = $elemModel->adicionarInversionComponenteElemEspacio($params);
                if ($adicion_tabla) {
                    $codMsg = 1;
                    $espacio_elemento = $params['idcontenido'];
                } else
                    $codMsg = 3;
            }else {
                $codMsg = 1;
                $espacio_elemento = '';
            }

            echo json_encode(array('cdgMsg' => $codMsg, 'espacio_elemento' => $espacio_elemento));
        } catch (Exception $e) {
            $codMsg = 3;
            echo json_encode(array('cdgMsg' => $codMsg));
        }




        /* if ($params['name'] != "") {
          if ($model->validarExistencia($params) == 0) {

          $espacio = $this->integrator->gestordocumental->adicionarEspacioTrabajo($padre, $params['name'], $params['name'], $propiedadAdd);

          $model->listarGestionarDoc($params, $espacio['identificadorNodoPadre']);
          echo json_encode(array('contenido' => $espacio['identificadorNodoPadre']));
          } else {
          $idcontenido = InversionesModel::buscarContenido($params['idelemento']);
          echo json_encode(array('contenido' => $idcontenido[0]['idcontenido']));
          }
          } else {
          echo json_encode(array('contenido' => 25));
          } */
    }

    public function asociarDesasociarAction() {
        $parametros['iddoc'] = $this->_request->getPost('iddoc'); //idelementodocgestordoc
        $parametros['idelemento'] = $this->_request->getPost('idelemento'); //idetapaelementoinversion
        $parametros['idcontenido'] = $this->_request->getPost('idcontenido');
        $gestdoc = $this->integrator->gestordocumental->eliminarElementosContenido($parametros['idcontenido']);
        try {
            if (InversionesModel::EliminarAss($parametros['idelemento']) && $gestdoc && $parametros['idelemento'] != 0)
                $dat->codMsgE = 1;
            else
                $dat->codMsgE = 25;
        } catch (Exception $e) {
            $dat->codMsgE = 25;
        }

        echo json_encode($dat);
    }

    public function eliminarValorAction() {
        ini_set("max_execution_time", 3600);
        $parametros['idelementovalor'] = json_decode(stripslashes($this->_request->getPost('idelementovalor')));
        $model = new InversionesModel();
        if ($parametros['idelementovalor'][0] != "") {
            $result = $model->eliminarValor($parametros, $this->_request->getPost('idinversion'), $this->global->Perfil->usuario);
            $model->actualizarCuadrada($this->_request->getPost());
            echo json_encode(array('codMsgE' => 1));
        } else {
            echo json_encode(array('codMsgE' => 22));
        }
    }

    public function eliminarPresupuestoAction() {
        ini_set("max_execution_time", 3600);
        $parametros['idpresanteproy'] = json_decode(stripslashes($this->_request->getPost('idpresanteproy')));
        $model = new InversionesModel();
        if ($parametros['idpresanteproy'] != "") {
            $result = $model->eliminarPresupuesto($parametros);
        }
        echo ($result != false) ? $result : 22;
    }

    public function eliminarFinAction() {
        ini_set("max_execution_time", 3600);
        $parametros['idfinanciamiento'] = json_decode(stripslashes($this->_request->getPost('idfinanciamiento')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idinversion'] = $this->_request->getPost('idinversion');
        $parametros['usd'] = 9900000046;
        $parametros['mp'] = 9900000103;
        $model = new InversionesModel();
        if ($parametros['idfinanciamiento'] != "") {
            $result = $model->eliminarFin($parametros);
        }
        echo ($result != false) ? $result : 22;
    }

    public function eliminarLiquidosAction() {
        ini_set("max_execution_time", 3600);
        $parametros['iderogacionliquido'] = json_decode(stripslashes($this->_request->getPost('iderogacionliquido')));
        $model = new InversionesModel();
        if ($parametros['iderogacionliquido'] != "") {
            $result = $model->eliminarLiq($parametros);
        }
        echo ($result != false) ? $result : 22;
    }

    public function adicionarEquiposAction() {
        $array_equipo = json_decode(stripslashes($this->_request->getPost('equipos')));
        $params['idequipoplan'] = $this->_request->getPost('idequipoplan');
        $params['idetapainversion'] = $this->_request->getPost('idetapainversion');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idusuario'] = $this->global->Perfil->usuario;
        $params['idinversion'] = $this->_request->getPost('idinversion');

        $model = new DatEtapaEquipoModel();
        $datos = $model->adicionarEquipos($array_equipo, $params);

        echo json_encode(array('codMsgE' => 10));
    }

    public function CargarEquiposAction() {
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idetapainversion'] = $this->_request->getPost('idetapainversion');
        $params['idequipoplan'] = $this->_request->getPost('idequipoplan');

        $params['filtros'] = $this->_request->getPost('filtros');
        if ($params['idequipoplan'] != "") {
            $data = DatEtapaEquipoModel::CargarEqui($params);
//print_r($data);die;
            foreach ($data['data'] as $pos => $valor) {
                $data['data'][$pos]['orgrect'] = trim($valor['orgrect'], '}');
                $data['data'][$pos]['orgrect'] = trim($data['data'][$pos]['orgrect'], '{');
            }

            echo json_encode(array('data' => $data['data'], 'total' => $data['total']));
        } else {
            $array = array();
            echo json_encode(array('data' => $array, 'total' => 0));
        }
    }

    public function eliminarEquiposAction() {
        ini_set("max_execution_time", 3600);
        $parametros['idetapaequipos'] = json_decode(stripslashes($this->_request->getPost('idetapaequipos')));
        $parametros['idindicadores'] = json_decode(stripslashes($this->_request->getPost('idindicadores')));
        $parametros['idEntidad'] = $this->_request->getPost('idEntidad');
        $parametros['idusuario'] = $this->global->Perfil->usuario;
        $parametros['idinversion'] = $this->_request->getPost('idinversion');
        if ($parametros['idetapaequipos'] != '') {
            $model = new DatEtapaEquipoModel();
            if ($parametros['idetapaequipos'] != "") {
                $result = $model->eliminarEquipo($parametros);
            }
            if($result[0])
            echo 3;
            else
                echo 1;
        } else {
            echo 1;
        }
    }

    public function equipoDesglosadoAction() {
        $model = new DatEtapaEquipoModel();
        echo json_encode(array('result' => $model->equipoDesglosado($this->_request->getPost())));
    }

    public function guardarEquiposAction() {
        $params['idetapaequipos'] = json_decode(stripslashes($this->_request->getPost('idetapaequipos')));
        $accion = $this->_request->getPost('accion');
        if($accion==NULL){
            $params['idusuario'] = $this->global->Perfil->usuario;
            $params['idinversion'] = $this->_request->getPost('idinversion');
            $model = new DatEtapaEquipoModel();
            $modelInv = new InversionesModel();
            if ($params['idetapaequipos'] == "") {
                $params['idetapaequipos'] = json_decode($this->_request->getPost('idetapaequipos'));
            }
            $datos = $model->guardarEquipos($params);
            $modelInv->actualizarCuadrada($this->_request->getPost());
            if ($datos) {
                echo json_encode(array('codMsgA' => 1));
            } else {
                echo json_encode(array('codMsgA' => 22));
            }
        }else{
            $model = new DatEtapaEquipoModel();
            $datos = $model->actualizarPrecioEquipos($params);
            //$modelInv->actualizarCuadrada($this->_request->getPost());
            if ($datos) {
                echo json_encode(array('codMsgA' => 1));
            } else {
                echo json_encode(array('codMsgA' => 22));
            } 
        }
        
        
    }


    public function actualizarPrecioEquiposAction() {
        $params['idetapaequipos'] = json_decode(stripslashes($this->_request->getPost('idetapaequipos')));
        
    }

    public function listarComboModeloAction() {
        $params['identidad'] = $this->_request->getPost('identidad');
        $model = new DatEtapaEquipoModel();
        echo json_encode(array('data' => $model->listarEntidadModelo($params)));
    }

    public function guardarDatosDinamicosAction() {
        $model = new DatElementoModel();
        $idtabla = $model->getIdcolumna($this->_request->getPost());

        $obmodel = new InversionesModel();
        echo json_encode($obmodel->guardarDatosColumnasDinamicas($idtabla[0], json_decode(stripslashes($this->_request->getPost('datos'))), $this->_request->getPost('idelemento'), $this->_request->getPost('idetapaelementoinversion'), $this->_request->getPost('transicion'), $this->_request->getPost('idelemtipomodelovalor')));
    }

    public function cargarParamentrosAction() {
        $model = new DatElementoModel();
        $idtabla = $model->getIdcolumna($this->_request->getPost());
        $result = $this->_meta->Metadata()->obtenerConfigGridPanel($idtabla[0]);

        $modelinv = new InversionesModel();
        echo json_encode($modelinv->obtenerConfigParamsDinam($result, $idtabla[0]));
    }

    public function listarDatosAction() {
        $model = new DatElementoModel();
        try {
            $idtabla = $model->getIdcolumna($this->_request->getPost());
            $obmodel = new InversionesModel();
            $datos = $obmodel->obtenerDatosColumnasDinamicas($idtabla[0], $this->_request->getPost('idelemento'));
            echo json_encode(array('datos' => $datos));
        } catch (Exception $e) {
            $datos = array();
            echo json_encode(array('datos' => $datos));
        }
    }

    public function eliminarValortipomodeloAction() {
        $model = new InversionesModel();
        echo json_encode($model->eliminar(json_decode(stripslashes($this->_request->getPost('idelementotipomodelovalor')))));
    }

    public function cargarConstructoresByidetapaAction() {
        $model = new DatConstructorModel();
        $datos = $model->getConstructoresByidetapainversion($this->_request->getPost());
        echo json_encode(array('datos' => array_slice($datos, $this->_request->getPost('start'), $this->_request->getPost('limit')), 'total' => count($datos)));
    }

    public function cargarConstructoresAction() {
        $model = new DatConstructorModel();
        echo json_encode(array('data' => $model->getConstructores($this->_request->getPost())));
    }

    public function eliminarConstrucutorEtapaAction() {
        $params['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $params['aejercicio'] = $this->_request->getPost('aejercicio');
        $params['pejercicio'] = $this->_request->getPost('pejercicio');
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $params['idusuario'] = $this->global->Perfil->usuario;
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idetapainversion'] = $this->_request->getPost('idetapainversion');
        $params['USD'] = 9900000046;
        $params['MP'] = 9900000103;
        $model = new DatEtapainverconsprovModel();
        echo json_encode($model->eliminarConstrucutorEtap(json_decode(stripslashes($this->_request->getPost('idetapainverconsprov'))), 
                $params));
    }

    public function adicionarConstrucutorEtapaAction() {
        $model = new DatEtapainverconsprovModel();
        echo json_encode($model->adicionarConstrucutorEtap(json_decode(stripslashes($this->_request->getPost('datosConstructores'))),
                $this->_request->getPost('idinversion'), $this->global->Perfil->usuario));
    }

    public function listarComboAdquisicionAction() {
        $model = new InversionesModel();
        echo json_encode(array('data' => $model->listarAdquisicion()));
    }

    public function listarComboComprarAction() {
        $model = new InversionesModel();
        echo json_encode(array('data' => $model->listarCompra()));
    }

    public function cierreinversionAction() {
        // print_r('jajja');die;
        $parametros->tipoelemento = $this->_request->getPost('elemento');
        $parametros->accion = $this->_request->getPost('accion');
        $objcierremodel = new CmpcomplementarioModel();
        $respuesta = $objcierremodel->EfectuarCierre($parametros);
        echo json_encode($respuesta);
    }

    //Exportar
    public function exportarElemEqConstAction() {
        ini_set("max_execution_time", 600); //10 min de conexion
        $params = array();

        $params['identidad'] = $this->_request->getParam('identidad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['ejercicio'] = $this->_request->getParam('ejercicio');
        $params['idinvers'] = json_decode(stripslashes($this->_request->getParam('idinvers')));
        $model = new InversionesModel();
        $model->exportarElemEqConst($params);
    }

    public function ImportarInversionesAction() {
        ini_set("max_execution_time", 6000000);
        ini_set("memory_limit","1024M"); 
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['tipoexcel'] = $this->_request->getPost('tipoexcel');
        $params['tipoexcel'] = $this->_request->getPost('tipoexcel');
        $params['identidad'] = $this->_request->getPost('identidad');
        $params['iddominio'] = $this->global->Perfil->iddominio;
        $filename = $_FILES['file']['tmp_name'];
        $params['file'] = $filename;
        $fileextension = $_FILES['file']['type'];
        $filename = explode('.', $_FILES['file']['name']);

        if ($fileextension == 'application/vnd.ms-excel' || $fileextension == 'application/xls' || $filename[count($filename) - 1] == 'xls' || $filename[count($filename) - 1] == 'xlsx'
        ) {
                $result = DatImportarModel::fnImportarInversiones($params);
                //print_r($result);die;
                echo json_encode(array('resultado'=>$result));
                /*$objPdf = new GenerarPdfErroresImportar($result);
                $objPdf->export();*/


        } else {
            echo json_encode(array('cod' => 53));
        }
    }

    public function exportarErroresAction(){
        $errores = $this->_request->getParam('errores');
        DatImportarModel::exportarErrores($errores);
    }

}
