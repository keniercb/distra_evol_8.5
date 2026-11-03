<?php

/**
 * Created by JetBrains PhpStorm.
 * User: yosniel
 * Date: 6/03/15
 * Time: 9:23
 */
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

class GestplaninversionesController extends ZendExt_Controller_Secure {
//ESTEIMADOS DESARROLLADORES, PONGANLE COMENTARIOS A LOS METODS
    public function init() {

        parent::init();
    }

    public function gestplaninversionesAction() {
        $this->render();
    }

//Este metodo carga las entidades...
    public function cargarTreeNomencladoresAction() {
        $node = $this->_request->getPost('node');
        $valor = $this->_request->getPost('valor');
        $model = new InversionesModel();
        echo json_encode($model->cargarEntidades($node, $valor));
    }

    public function cargarDatosModificarAction() {
        $idinversion = $this->_request->getPost('idinversion');
        $objinversiones = Doctrine_Core::getTable('DatInversion')->find($idinversion);
        $objprovincia = $this->integrator->datosmaestros->getElementoid($objinversiones->idprovincia);
        $objtipoinversion = Doctrine::getTable('NomTipoinversion')->find($objinversiones->idtipoinversion);
        $objcaracteristicas = Doctrine::getTable('DatCaracteristica')->find($objinversiones->idcaracteristica);
        $objcaract = Doctrine::getTable('NomDatosnomenclador')->findByDql("iddatosnomenclador = $objcaracteristicas->iddatosnomenclador");

        $objmedioambiente = Doctrine::getTable('DatAmbiente')->find($objinversiones->idmedioambiente);
        $objmedio = Doctrine::getTable('NomDatosnomenclador')->findByDql("iddatosnomenclador = $objmedioambiente->iddatosnomenclador");

        $objinverprograma = Doctrine::getTable('DatTipoinversionprograma')->find($objinversiones->idtipoinversionprograma);
        $objprograma = Doctrine::getTable('NomDatosnomenclador')->findByDql("iddatosnomenclador = $objinverprograma->iddatosnomenclador");

        $objforma = Doctrine::getTable('DatFormapropiedad')->find($objinversiones->idformapropiedad);
        $objformapropiedad = Doctrine::getTable('NomDatosnomenclador')->findByDql("iddatosnomenclador = $objforma->iddatosnomenclador");
        $objobj = Doctrine::getTable('DatObjetivo')->find($objinversiones->idobjetivo);
        $objobjetivo = Doctrine::getTable('NomDatosnomenclador')->findByDql("iddatosnomenclador = $objobj->iddatosnomenclador");
        $objexterior = Doctrine::getTable('DatEfectocomercial')->find($objinversiones->idefectocomercial);
        $objcomercioexterior = Doctrine::getTable('NomDatosnomenclador')->findByDql("iddatosnomenclador = $objexterior->iddatosnomenclador");
        $objdesem = Doctrine::getTable('DatDesempenno')->find($objinversiones->iddatdesempenno);
        $objdesempeno = Doctrine::getTable('NomDatosnomenclador')->findByDql("iddatosnomenclador = $objdesem->iddatosnomenclador");
        $objprog = Doctrine::getTable('DatPrograma')->find($objinversiones->idprograma);
        $objprogramaa = Doctrine::getTable('NomDatosnomenclador')->findByDql("iddatosnomenclador = $objdesem->iddatosnomenclador");


        if (isset($objinversiones->idinversion)) {
            $dat[] = array(
                'denominacion' => $objinversiones->denominacion,
                'fasttrack' => $objinversiones->fasttrack,
                'fechainicio' => $objinversiones->fechainicio,
                'fechafin' => $objinversiones->fechafin,
                'provincia' => array('idprovincia' => $objprovincia[0]['idpadre'],
                    'nombreprovincia' => $objprovincia[0]['denominacion']),
                'tipoinversion' => array('idtipoinversion' => $objtipoinversion->idtipoinversion,
                    'denominacion' => $objtipoinversion->denominacion),
                'caracteristica' => array('iddatosnomenclador' => $objcaract[0]['iddatosnomenclador'],
                    'denominacion' => $objcaract[0]['denominacion'],
                    'idcaracteristica' => $objcaracteristicas->idcaracteristica),
                'medioambiente' => array('iddatosnomenclador' => $objmedio[0]['iddatosnomenclador'],
                    'denominacion' => $objmedio[0]['denominacion'],
                    'idmedioambiente' => $objmedioambiente->idmedioambiente),
                'programa' => array('iddatosnomenclador' => $objprograma[0]['iddatosnomenclador'],
                    'denominacion' => $objprograma[0]['denominacion'],
                    'idtipoinversionprograma' => $objinverprograma->idtipoinversionprograma),
                'forma' => array('iddatosnomenclador' => $objformapropiedad[0]['iddatosnomenclador'],
                    'denominacion' => $objformapropiedad[0]['denominacion'],
                    'idformapropiedad' => $objforma->idformapropiedad),
                'objetivo' => array('iddatosnomenclador' => $objobjetivo[0]['iddatosnomenclador'],
                    'denominacion' => $objobjetivo[0]['denominacion'],
                    'idobjetivo' => $objobj->idobjetivo),
                'comercio' => array('iddatosnomenclador' => $objcomercioexterior[0]['iddatosnomenclador'],
                    'denominacion' => $objcomercioexterior[0]['denominacion'],
                    'idefectocomercial' => $objexterior->idefectocomercial),
                'analisis' => $objinversiones->analpostinversiones,
                'desempeno' => array('iddatosnomenclador' => $objdesempeno[0]['iddatosnomenclador'],
                    'denominacion' => $objdesempeno[0]['denominacion'],
                    'iddatdesempenno' => $objdesem->iddatdesempenno),
                'programaa' => array('iddatosnomenclador' => $objprogramaa[0]['iddatosnomenclador'],
                    'denominacion' => $objprogramaa[0]['denominacion'],
                    'idprograma' => $objprog->idprograma),
            );
            echo json_encode(array('mensaje' => 1, 'data' => $dat));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    public function GuardarValorAction() {
        $parametros['valores'] = json_decode(stripslashes($this->_request->getPost('valores')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $parametros['aejercicio'] = $this->_request->getPost('aejercicio');
        $parametros['pejercicio'] = $this->_request->getPost('pejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idinversion'] = $this->_request->getPost('idinversion');
        $parametros['idetapainversion'] = $this->_request->getPost('idetapainversion');
        $parametros['USD'] = 9900000046;
        $parametros['MP'] = 9900000103;
        $parametros['ajustar'] = $this->_request->getPost('ajustar');
        $parametros['usuario'] = $this->global->Perfil->usuario;
        
        $model = new InversionesModel();
        $model->guardarValorConstructor($parametros);
        $model->guardarValorTotalConstuctoresEnEtapa($parametros);
        echo json_encode(array('codMsgGV' => 1));
    }
    
    public function guardarAjusteConstructorAction(){
        $parametros['valores'] = json_decode(stripslashes($this->_request->getPost('valores')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $parametros['aejercicio'] = $this->_request->getPost('aejercicio');
        $parametros['pejercicio'] = $this->_request->getPost('pejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idinversion'] = $this->_request->getPost('idinversion');
        $parametros['idetapainversion'] = $this->_request->getPost('idetapainversion');
        $parametros['USD'] = 9900000046;
        $parametros['MP'] = 9900000103;
        $parametros['ajustar'] = $this->_request->getPost('ajustar');
        $model = new InversionesModel();
        $model->guardarValorConstructor($parametros);
        $model->guardarValorTotalConstuctoresEnEtapa($parametros);
        echo json_encode(array('codMsgGV' => 1));
    }

    public function GuardarMedioAmbAction() {
        $parametros['datos'] = json_decode(stripslashes($this->_request->getPost('datos')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $parametros['aejercicio'] = $this->_request->getPost('aejercicio');
        $parametros['pejercicio'] = $this->_request->getPost('pejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idinversion'] = $this->_request->getPost('idinversion');
        $parametros['ajustar'] = $this->_request->getPost('ajustar');
        $model = new InversionesModel();

        $idUSD = $model->devolverIdMonedaXCodigo('USD', $parametros['identidad']);
        $iddMP = $model->devolverIdMonedaXCodigo('CUP', $parametros['identidad']);
        $parametros['USD'] = $idUSD[0]['idmonedaentidad'] ? $idUSD[0]['idmonedaentidad'] : 0;
        $parametros['MP'] = $iddMP[0]['idmonedaentidad'] ? $iddMP[0]['idmonedaentidad'] : 0;
        if (count($parametros['datos']) > 0) {
            DatMedioAmbienteModel::guardarValorGlobal($parametros);
            echo json_encode(array('codMsgGV' => 1));
        } else {
            echo json_encode(array('codMsgGV' => 55));
        }
    }

    public function ajustarMedioAmbAction() {
        $parametros['datos'] = json_decode(stripslashes($this->_request->getPost('datos')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $parametros['aejercicio'] = $this->_request->getPost('aejercicio');
        $parametros['pejercicio'] = $this->_request->getPost('pejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idinversion'] = $this->_request->getPost('idinversion');
        $parametros['ajustar'] = $this->_request->getPost('ajustar');
        $model = new InversionesModel();

        $idUSD = $model->devolverIdMonedaXCodigo('USD', $parametros['identidad']);
        $iddMP = $model->devolverIdMonedaXCodigo('CUP', $parametros['identidad']);
        $parametros['USD'] = $idUSD[0]['idmonedaentidad'] ? $idUSD[0]['idmonedaentidad'] : 0;
        $parametros['MP'] = $iddMP[0]['idmonedaentidad'] ? $iddMP[0]['idmonedaentidad'] : 0;
        if (count($parametros['datos']) > 0) {
            DatMedioAmbienteModel::guardarValorGlobal($parametros);
            echo json_encode(array('codMsgGV' => 1));
        } else {
            echo json_encode(array('codMsgGV' => 55));
        }
    }

    public function GuardarEquiposAction() {
        $parametros['datos'] = json_decode(stripslashes($this->_request->getPost('valores')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $parametros['aejercicio'] = $this->_request->getPost('aejercicio');
        $parametros['pejercicio'] = $this->_request->getPost('pejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idinversion'] = $this->_request->getPost('idinversion');
        $parametros['idplan'] = $this->_request->getPost('idplan');
        $parametros['plan'] = $this->_request->getPost('plan');
        $parametros['usuario'] = $this->global->Perfil->usuario;
        $model = new InversionesModel();

        $idUSD = $model->devolverIdMonedaXCodigo('USD', $parametros['identidad']);
        $iddMP = $model->devolverIdMonedaXCodigo('CUP', $parametros['identidad']);
        $parametros['USD'] = $idUSD[0]['idmonedaentidad'] ? $idUSD[0]['idmonedaentidad'] : 0;
        $parametros['MP'] = $iddMP[0]['idmonedaentidad'] ? $iddMP[0]['idmonedaentidad'] : 0;
        if (count($parametros['datos']) > 0 && $parametros['aaejercicio'] != '' 
                && $parametros['aejercicio'] != '' && $parametros['pejercicio']!= '') {
            DatEtapaEquipoModel::guardarValorEquipo($parametros);
            echo json_encode(array('codMsgGV' => 1));
        } else {
            echo json_encode(array('codMsgGV' => 55));
        }
    }

    public function GuardarEquiposAjusteAction() {
        $parametros['datos'] = json_decode(stripslashes($this->_request->getPost('valores')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $parametros['aejercicio'] = $this->_request->getPost('aejercicio');
        $parametros['pejercicio'] = $this->_request->getPost('pejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idinversion'] = $this->_request->getPost('idinversion');
        $parametros['idplan'] = $this->_request->getPost('idplan');
        $parametros['plan'] = $this->_request->getPost('plan');
        $parametros['usuario'] = $this->global->Perfil->usuario;
        $model = new InversionesModel();

        $idUSD = $model->devolverIdMonedaXCodigo('USD', $parametros['identidad']);
        $iddMP = $model->devolverIdMonedaXCodigo('CUP', $parametros['identidad']);
        $parametros['USD'] = $idUSD[0]['idmonedaentidad'] ? $idUSD[0]['idmonedaentidad'] : 0;
        $parametros['MP'] = $iddMP[0]['idmonedaentidad'] ? $iddMP[0]['idmonedaentidad'] : 0;
        if (count($parametros['datos']) > 0 && $parametros['aaejercicio'] != '' && $parametros['aejercicio'] != '' && $parametros['pejercicio']!= '') {
            DatEtapaEquipoModel::guardarValorEquipoAjuste($parametros);
            echo json_encode(array('codMsgGV' => 1));
        } else {
            echo json_encode(array('codMsgGV' => 55));
        }
    }

    public function guardarDatosPlanPreparacionAction() {
        $valores = json_decode(stripslashes($this->_request->getPost('datos')));
        $parametros['datos'] = $valores[1];
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $parametros['aejercicio'] = $this->_request->getPost('aejercicio');
        $parametros['pejercicio'] = $this->_request->getPost('pejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idinversion'] = $this->_request->getPost('idinversion');
        $parametros['planPrepMP'] = $this->_request->getPost('planPrepMP');
        $parametros['planPrepUSD'] = $this->_request->getPost('planPrepUSD');

        $model = new InversionesModel();
        $idUSD = $model->devolverIdMonedaXCodigo('USD', $parametros['identidad']);
        $iddMP = $model->devolverIdMonedaXCodigo('CUP', $parametros['identidad']);
        $parametros['USD'] = $idUSD[0]['idmonedaentidad'] ? $idUSD[0]['idmonedaentidad'] : 0;
        $parametros['MP'] = $iddMP[0]['idmonedaentidad'] ? $iddMP[0]['idmonedaentidad'] : 0;

        //print_r($parametros);die;

        $model->guardarDatosPlanPreparacion($parametros);
        echo json_encode(array('codMsgGV' => 1));

        //echo json_encode(array('codMsgGV' => 55));
        //echo json_encode(array('mensaje' => 1));
    }

//Cargar las denominaciones de las inversiones de un ejercicio y entidad
    public function cargarDenominacionInversionAction() {
        $model = new InversionesModel();
        echo json_encode(array('data' => $model->cargarDenomInversiones($this->_request->getPost())));
    }

//Este metodo carga los organismos...
    public function cargarOrganismosAction() {
        $idEstructura = 0;
// $logueada = $this->global->Estructura->idestructura;//print_r($logueada);die;
        $dominios = $this->integrator->metadatos->buscarHijosEstructuras($this->global->Perfil->iddominio, $idEstructura, 0, 0, 3);
// print_r($dominios);die;
        $cont = 0;
        $result = array();
        foreach ($dominios as $valor) {

            $entidades = $this->integrator->metadatos->DameHijosEstructura($valor['id']); //--
            $result[$cont]['organismo'] = $valor['text'];
            $result[$cont]['idorganismo'] = $valor['id']; //print_r($result);die;
            $cont = $cont + 1;
            foreach ($entidades as $key => $val) {
// print_r($val);die;
                $result[$cont]['organismo'] = $val->codigo . ' - ' . $val->text;
                $result[$cont]['idorganismo'] = $val->id;
                $cont = $cont + 1;
            }
        }

        echo json_encode(array('data' => $result));
    }

    public function cargarEntidadesAction() {
        ini_set("max_execution_time", 600000);
        $entidades = array();
        $organismos = json_decode(stripslashes($this->_request->getPost('idorganismo')));
        if ($organismos == "") {
            echo json_encode(array('data' => $entidades));
        } else {
            $arrayOrganismos = explode(',', $organismos);
            foreach ($arrayOrganismos as $key => $k) {
                $dominios = $this->integrator->metadatos->DameHijosEstructura($k);
                if ($dominios[0] != "") {
                    foreach ($dominios as $key => $k) {
                        $entidades_hijas = array();
                        $entidades_hijas = self::entidadesHijas($k->id, $k->text);
                        $entidades = array_merge($entidades_hijas, $entidades);
                    }
                }
            }
            echo json_encode(array('data' => $entidades));
        }
    }

    public function cargarEntidadesResumenAction() {
        ini_set("max_execution_time", 600000);
        $entidades = array();
        $organismos = ($this->_request->getPost('idorganismo'));
        if ($organismos == "") {
            echo json_encode(array('data' => $entidades));
        } else {
            $arrayOrganismos = explode(',', $organismos);
            foreach ($arrayOrganismos as $key => $k) {
                $dominios = $this->integrator->metadatos->DameHijosEstructura($k);
                if ($dominios[0] != "") {
                    foreach ($dominios as $key => $k) {
                        $entidades_hijas = array();
                        $entidades_hijas = self::entidadesHijas($k->id, $k->text);
                        $entidades = array_merge($entidades_hijas, $entidades);
                    }
                }
            }
            echo json_encode(array('data' => $entidades));
        }
    }

    public function cargarEntidadesAux($idorganismo) {
        $entidades = array();
        foreach ($idorganismo as $key => $k) {
            $dominios = $this->integrator->metadatos->DameHijosEstructura($k);
            if ($dominios[0] != "") {
                foreach ($dominios as $key => $k) {
                    $entidades_hijas = array();
                    $entidades_hijas = self::entidadesHijas($k->id, $k->text);
                    $entidades = array_merge($entidades_hijas, $entidades);
                }
            }
        }
        return $entidades;
    }

    public function cargarEntidadesAux1($idorganismo) {
        $entidades = array();

        $dominios = $this->integrator->metadatos->DameHijosEstructura($idorganismo);
        if ($dominios[0] != "") {
            foreach ($dominios as $key => $k) {
                $entidades_hijas = array();
                $entidades_hijas = self::entidadesHijas($k->id, $k->text, $k->_parent);
                $entidades = array_merge($entidades_hijas, $entidades);
            }
        }
        return $entidades;
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
                $entidades_hijas[$key + 1]['parent'] = $entidad_hija->_parent;
            } else {
                $entidades_hijas = array_merge($entidades_hijas, self::entidadesHijas($entidad_hija->id, $entidad_hija->text));
            }
        }
        return $entidades_hijas;
    }

    public function modificarPlanInversionesAction() {

        $parametros->idinversion = $this->_request->getPost('idinversion');
        $parametros->denominacion = $this->_request->getPost('denominacion');
        $parametros->idtipoinversion = $this->_request->getPost('idtipoinversion');
        $parametros->idmedioambiente = $this->_request->getPost('idmedioambiente');
        $parametros->idobjetivo = $this->_request->getPost('idobjetivo');
        $parametros->idformapropiedad = $this->_request->getPost('idformapropiedad');
        $parametros->idtipoinversionprograma = $this->_request->getPost('idtipoinversionprograma');
        $parametros->idcaracteristica = $this->_request->getPost('idcaracteristica');
        $parametros->idefectocomercial = $this->_request->getPost('idefectocomercial');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->idprovincia = $this->_request->getPost('idprovincia');
        $parametros->fasttrack = $this->_request->getPost('fasttrack');
        $parametros->iddatdesempenno = $this->_request->getPost('iddatdesempenno');
        $parametros->idprograma = $this->_request->getPost('idprograma');
        $parametros->analpostinversiones = $this->_request->getPost('analpostinversiones');
        $parametros->presupuesto = json_decode(stripslashes($this->_request->getPost('presupuesto')));
        $parametros->financiamiento = json_decode(stripslashes($this->_request->getPost('financiamiento')));
        $parametros->liquidos = json_decode(stripslashes($this->_request->getPost('liquidos')));
        $parametros->usd = 9900000046;
        $parametros->mp = 9900000103;
        if ($parametros->idinversion != '') {
            $objInversionesModel = new InversionesModel();
            //try {
            $arrayrespuesta = $objInversionesModel->modificarPlanInv($parametros);
            if ($arrayrespuesta['mensaje'] == 1) {
                echo json_encode(array('codMsgP' => 1));
            } else if ($arrayrespuesta['mensaje'] == 2) {
                echo json_encode(array('codMsgP' => 2));
            } else if ($arrayrespuesta['mensaje'] == 3) {
                echo json_encode(array('codMsgP' => 3));
            } else if ($arrayrespuesta['mensaje'] == 4) {
                echo json_encode(array('codMsgP' => 4));
            }
        } else {
            echo json_encode(array('codMsgP' => 4));
        }

        /* } catch (Exception $e) {
          echo json_encode(array('codMsgP' => 5));
          } */
    }

    public function eliminarPlanPresupuestoAction() {
        ini_set("max_execution_time", 3600);
        $parametros['idpresanteproy'] = json_decode(stripslashes($this->_request->getPost('idpresanteproy')));
        $model = new InversionesModel();
        if ($parametros['idpresanteproy'] != "") {
            $result = $model->eliminarPresupuesto($parametros);
        }
        echo ($result != false) ? $result : 22;
    }

    public function eliminarFinanciamientoAction() {
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

    public function listarEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

    public function listarReportesAction() {
        echo json_encode(array('data' => 'w'));
    }

    public function cargarInversionesAction() {
        ini_set("max_execution_time", 7200); //2hora
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 100;
        $params['check'] = $this->_request->getPost('check');
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['ejercicio'] = $this->_request->getPost('ejercicio') ? $this->_request->getPost('ejercicio') : 0;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['vigente'] = $this->_request->getPost('vigente');
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
                }elseif ($datos ['field'] == 'estadoplan') {
                    $parametros ['filtros']['estadoplan'] = $datos ['data'] ['value'];
                }elseif ($datos ['field'] == 'sector') {
                    $parametros ['filtros']['sector'] = $datos ['data'] ['value'];
                }elseif ($datos ['field'] == 'grupoobra') {
                    $parametros ['filtros']['grupoobra'] = $datos ['data'] ['value'];
                }elseif ($datos ['field'] == 'fechainicio') {
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
                }
            }
        }
        $model = new InversionesModel();
        if ($params['check'] == 1) {
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
        $result = $model->cargarInversiones($params, $entidadesFinales);
        echo json_encode(array('data' => array_slice($result['data'], $this->_request->getPost('start'), $this->_request->getPost('limit')), 'total' => count($result['data'])));
    }

    public function entidadesHijasPlan($identidad) {
        $dominios = $this->integrator->metadatos->DameHijosEstructura($identidad);
        $entidades_hijas = array();
        $entidades_hijas[] = $identidad;
        foreach ($dominios as $entidad_hija) {
            if ($entidad_hija->leaf == 1) {
                $entidades_hijas[] = $entidad_hija->id;
                break;
            } else {
                $entidades_hijas = array_merge($entidades_hijas, self::entidadesHijas($entidad_hija->id));
            }
        }
        return $entidades_hijas;
    }

    public function listarComboClasificacionAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->cargarClasificacion($params);
        echo json_encode(array('data' => $result));
    }

    public function listarComboTipoInversionAction() {
        $model = new InversionesModel();
        $result = $model->cargarTipoInversion();
        echo json_encode($result);
    }

    public function listarComboCaracteristicaAction() {
        $model = new InversionesModel();
        $result = $model->cargarCaracteristica();
        echo json_encode(array('data' => $result));
    }

    public function listarComboFormaPropiedadAction() {
        //$params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        //$params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->cargarForma();
        echo json_encode(array('data' => $result));
    }

    public function listarProvinciasAction() {
        $model = new InversionesModel();
        $result = $model->listarProvincias();
        echo json_encode($result);
    }

    public function listarComboObjetivoAction() {
        $model = new InversionesModel();
        echo json_encode(array('data' => $model->listarObjetivo()));
    }

    public function listarComboEfectoAction() {
        $model = new InversionesModel();
        echo json_encode(array('data' => $model->listarEfecto()));
    }

    public function cargarEquiposAction() {

        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = DatEtapaEquipoModel::CargarEquipos($params);
        foreach ($data['data'] as $pos => $valor) {
            $data['data'][$pos]['orgrect'] = trim($valor['orgrect'], '}');
            $data['data'][$pos]['orgrect'] = trim($data['data'][$pos]['orgrect'], '{');
        }
        //print_r($data['data']);die;
        echo json_encode(array('data' => array_slice($data['data'], $this->_request->getPost('start'), $this->_request->getPost('limit')), 'total' => count($data['data'])));
    }

    public function cargarEquiposDesgloseAction() {
        $datos['idinversion'] = $this->_request->getPost('idinversion');
        $datos['idejercicio'] = $this->_request->getPost('idejercicio');
        $datos['componente'] = $this->_request->getPost('componente');
        $datos['idequipoplan'] = $this->_request->getPost('idequipoplan');
//        $datos['modelo'] = $this->_request->getPost('modelo');
        $datos['identidad'] = $this->_request->getPost('identidad');
        $datos['aaejercicio'] = $this->_request->getPost('aaejercicio') ? $this->_request->getPost('aaejercicio') : "0";
        $datos['aejercicio'] = $this->_request->getPost('aejercicio') ? $this->_request->getPost('aejercicio') : "0";
        $datos['pejercicio'] = $this->_request->getPost('pejercicio') ? $this->_request->getPost('pejercicio') : "0";
        $datos['idpadre'] = $this->_request->getPost('idpadre');
        $datos['start'] = $this->_request->getPost('start');
        $datos['limit'] = $this->_request->getPost('limit');
        $model = new InversionesModel();
        $idUSD = $model->devolverIdMonedaXCodigo('USD', $datos['identidad']);
        $iddMP = $model->devolverIdMonedaXCodigo('CUP', $datos['identidad']);
        $datos['USD'] = $idUSD[0]['idmonedaentidad'] ? $idUSD[0]['idmonedaentidad'] : 0;
        $datos['MP'] = $iddMP[0]['idmonedaentidad'] ? $iddMP[0]['idmonedaentidad'] : 0;
//print_r($datos);die;
        if ($datos['componente'] != '' && $datos['idequipoplan'] != '') {
            $data = DatEtapaEquipoModel::fnCargarEquiposDesglose($datos);
            if (count($data) > 0) {
                echo json_encode(array('data' => $data, 'total' => count($data)));
            } else {
                echo json_encode(array('data' => array(), 'total' => 0));
            }
        } else {
            echo json_encode(array('data' => array(), 'total' => 0));
        }
    }

    public function cargarFinanciamientoAction() {
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $model = new InversionesModel();
        $result = $model->listarF($params);
        echo json_encode(array('data' => $result));
    }

    public function cargarFinanciamientoPLanInversionAction() {
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $params['aejercicio'] = $this->_request->getPost('aejercicio');
        $params['pejercicio'] = $this->_request->getPost('pejercicio');
        $params['idinversion'] = $this->_request->getPost('idinversion') ? $this->_request->getPost('idinversion') : 0;
        $model = new InversionesModel();
        $result = $model->listarFinanciamientoParaInversion($params);
        echo json_encode(array('data' => $result));
    }

    public function cargarFinancistasAction() {
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $params['aejercicio'] = $this->_request->getPost('aejercicio');
        $params['pejercicio'] = $this->_request->getPost('pejercicio');
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $model = new InversionesModel();
        $result = $model->listarFinancistas($params);
        echo json_encode(array('data' => $result));
    }

    public function cargarFinanciamientoContadoAction() {
        $params['start'] = $this->_request->getPost('start') ? $this->_request->getPost('start') : 0;
        $params['limit'] = $this->_request->getPost('limit') ? $this->_request->getPost('limit') : 20;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 0;
        $params['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $params['aejercicio'] = $this->_request->getPost('aejercicio');
        $params['pejercicio'] = $this->_request->getPost('pejercicio');
        $params['idinversion'] = $this->_request->getPost('idinversion') ? $this->_request->getPost('idinversion') : 0;
        $arregloAcreedor = json_decode(stripslashes($this->_request->getPost('datosacreedor')));



        $model = new InversionesModel();
        $result = $model->listarFinanciamientoContado($params);
        $result[0]['idgridcontado'] = 1;

        $result[] = array('idgridcontado' => 2,
            'idinversion' => $result[0]['idinversion'],
            'ejecutado_mp1' => number_format($arregloAcreedor[0]->ejecutado_mp1, '2', '.', ''),
            'ejecutado_usd1' => number_format($arregloAcreedor[0]->ejecutado_usd1, '2', '.', ''),
            'ejecutado_mp2' => number_format($arregloAcreedor[0]->ejecutado_mp2, '2', '.', ''),
            'ejecutado_usd2' => number_format($arregloAcreedor[0]->ejecutado_usd2, '2', '.', ''),
            'ejecutado_mp3' => number_format($arregloAcreedor[0]->ejecutado_mp3, '2', '.', ''),
            'ejecutado_usd3' => number_format($arregloAcreedor[0]->ejecutado_usd3, '2', '.', ''),
            'ejecutado_mp4' => number_format($arregloAcreedor[0]->ejecutado_mp4, '2', '.', ''),
            'ejecutado_usd4' => number_format($arregloAcreedor[0]->ejecutado_usd4, '2', '.', ''),
            'estimado_mp1' => number_format($arregloAcreedor[0]->estimado_mp1, '2', '.', ''),
            'estimado_usd1' => number_format($arregloAcreedor[0]->estimado_usd1, '2', '.', ''),
            'estimado_mp2' => number_format($arregloAcreedor[0]->estimado_mp2, '2', '.', ''),
            'estimado_usd2' => number_format($arregloAcreedor[0]->estimado_usd2, '2', '.', ''),
            'estimado_mp3' => number_format($arregloAcreedor[0]->estimado_mp3, '2', '.', ''),
            'estimado_usd3' => number_format($arregloAcreedor[0]->estimado_usd3, '2', '.', ''),
            'estimado_mp4' => number_format($arregloAcreedor[0]->estimado_mp4, '2', '.', ''),
            'estimado_usd4' => number_format($arregloAcreedor[0]->estimado_usd4, '2', '.', ''),
            'plan_mp1' => number_format($arregloAcreedor[0]->plan_mp1, '2', '.', ''),
            'plan_usd1' => number_format($arregloAcreedor[0]->plan_usd1, '2', '.', ''),
            'plan_mp2' => number_format($arregloAcreedor[0]->plan_mp2, '2', '.', ''),
            'plan_usd2' => number_format($arregloAcreedor[0]->plan_usd2, '2', '.', ''),
            'plan_mp3' => number_format($arregloAcreedor[0]->plan_mp3, '2', '.', ''),
            'plan_usd3' => number_format($arregloAcreedor[0]->plan_usd3, '2', '.', ''),
            'plan_mp4' => number_format($arregloAcreedor[0]->plan_mp4, '2', '.', ''),
            'plan_usd4' => number_format($arregloAcreedor[0]->plan_usd4, '2', '.', ''),
            'proyec_mp1' => number_format($arregloAcreedor[0]->proyec_mp1, '2', '.', ''),
            'proyec_usd1' => number_format($arregloAcreedor[0]->proyec_usd1, '2', '.', ''),
            'proyec_mp2' => number_format($arregloAcreedor[0]->proyec_mp2, '2', '.', ''),
            'proyec_usd2' => number_format($arregloAcreedor[0]->proyec_usd2, '2', '.', ''),
            'proyec_mp3' => number_format($arregloAcreedor[0]->proyec_mp3, '2', '.', ''),
            'proyec_usd3' => number_format($arregloAcreedor[0]->proyec_usd3, '2', '.', ''),
            'proyec_mp4' => number_format($arregloAcreedor[0]->proyec_mp4, '2', '.', ''),
            'proyec_usd4' => number_format($arregloAcreedor[0]->proyec_usd4, '2', '.', ''),
            'proyec_mp4' => number_format($arregloAcreedor[0]->proyec_mp4, '2', '.', ''),
            'proyec_usd4' => number_format($arregloAcreedor[0]->proyec_usd4, '2', '.', ''),
            'sumapresp_mp' => number_format($arregloAcreedor[0]->sumapresp_mp, '2', '.', ''),
            'sumapresp_usd' => number_format($arregloAcreedor[0]->sumapresp_usd, '2', '.', ''),
            'plazoamortizacion' => number_format($arregloAcreedor[0]->plazoamortizacion, '2', '.', ''),
            'gracia' => number_format($arregloAcreedor[0]->gracia, '2', '.', ''),
            'comosefinanc' => $arregloAcreedor[0]->comosefinanc);

        //print_r($result);die;

        echo json_encode(array('data' => $result, 'total' => count($result)));
    }

    function mostrarVerDetallesAction() {
        
        $datosInv['idinversion'] = $this->_request->getPost('idinversion');
        $datosInv['idejercicio'] = $this->_request->getPost('idejercicio');
        $datosInv['identidad'] = $this->_request->getPost('identidad');
        $parametros->datosinv = json_decode(stripslashes($this->_request->getPost('datosinv')));
        $inv = new InversionesModel();
        $datos = $inv->verDetalles($parametros, $datosInv);
        echo json_encode($datos);
    }

    function mostrarCuadreAction() {
        $datosInv['idinversion'] = $this->_request->getPost('idinversion');
        $datosInv['idejercicio'] = $this->_request->getPost('idejercicio');
        $datosInv['identidad'] = $this->_request->getPost('identidad');
        // $datosInv['id'] = $datosInv['idinversion'];
        $inv = new InversionesModel();
        $datos = $inv->verCuadre($datosInv);
        $inv->actualizarCuadrada($datosInv);
        echo json_encode($datos);
    }

    public function eliminarDatAction() {
        ini_set("max_execution_time", 3600);
        $datos['datos'] = json_decode(stripslashes($this->_request->getPost('datos')));
        $datos['idinversion'] = $this->_request->getPost('idinversion');
        $datos['idejercicio'] = $this->_request->getPost('idejercicio');
        $datos['identidad'] = $this->_request->getPost('identidad');
        if (count($datos['datos']) > 0 && $datos['idinversion'] != '') {
            $model = new DatMedioAmbienteModel();
            $model->eliminarDat($datos);
            echo json_encode(array('codMsgDel' => 1));
        } else {
            echo json_encode(array('codMsgDel' => 55));
        }
    }

    public function cargarAccionesAction() {
        $data['idinversion'] = $this->_request->getPost('idinversion');
        $data['idejercicio'] = $this->_request->getPost('idejercicio');
        $data['identidad'] = $this->_request->getPost('identidad');
        $data['idsector'] = $this->_request->getPost('idsector');
        $data['iddatosnomencladorpadre'] = $this->_request->getPost('iddatosNomPad');
        $model = new DatMedioAmbienteModel();
        $result = $model->listarAcciones($data);
        echo $result;
    }

    public function cargarCuencasAction() {
        $data['idinversion'] = $this->_request->getPost('idinversion');
        $data['idejercicio'] = $this->_request->getPost('idejercicio');
        $data['identidad'] = $this->_request->getPost('identidad');
        $data['idsector'] = $this->_request->getPost('idsector');
        $data['iddatosnomencladorpadre'] = $this->_request->getPost('iddatosNomPad');
        $model = new DatMedioAmbienteModel();
        $result = $model->listarCuencas($data);
        echo $result;
    }

    public function cargarBahiasAction() {
        $data['idinversion'] = $this->_request->getPost('idinversion');
        $data['idejercicio'] = $this->_request->getPost('idejercicio');
        $data['identidad'] = $this->_request->getPost('identidad');
        $data['idsector'] = $this->_request->getPost('idsector');
        $data['iddatosnomencladorpadre'] = $this->_request->getPost('iddatosNomPad');
        $model = new DatMedioAmbienteModel();
        $result = $model->listarBahias($data);
        echo $result;
    }

    public function cargarSectoresAction() {
        $datos['idinversion'] = $this->_request->getPost('idinversion');
        $datos['idejercicio'] = $this->_request->getPost('idejercicio');
        $datos['identidad'] = $this->_request->getPost('identidad');
        $datos['idnomencaldor'] = $this->_request->getPost('idnomencaldor');
        $datos['parent'] = $this->_request->getPost('parent');
        $model = new DatMedioAmbienteModel();
        $nom = $model->listarNomDatos($datos);
        echo $nom;
    }

    public function adicionarDatosAction() {
        $data['idinversion'] = $this->_request->getPost('idinversion');
        $data['idejercicio'] = $this->_request->getPost('idejercicio');
        $data['identidad'] = $this->_request->getPost('identidad');
        $data['datosAccion'] = json_decode(stripslashes($this->_request->getPost('datosAccion')));
        $data['datosBahia'] = json_decode(stripslashes($this->_request->getPost('datosBahia')));
        $data['datosCuenca'] = json_decode(stripslashes($this->_request->getPost('datosCuenca')));
        $data['idsector'] = $this->_request->getPost('idsector');
        $data['iddatosnomencladorpadre'] = $this->_request->getPost('iddatosNomPad');
        if ($data['idinversion'] != '' && $data['idejercicio'] != '' && $data['identidad'] != '' && $data['idsector'] != '' && $data['iddatosnomencladorpadre'] != 0) {
            $result = DatMedioAmbienteModel::adicionarDatos($data);
            echo json_encode(array('codMsgE' => $result));
        } else {
            echo json_encode(array('codMsgE' => 55));
        }
    }

    public function cargarAmbienteAction() {
        $datos['idinversion'] = $this->_request->getPost('idinversion');
        $datos['idejercicio'] = $this->_request->getPost('idejercicio');
        $datos['identidad'] = $this->_request->getPost('identidad');
        $datos['aaejercicio'] = $this->_request->getPost('aaejercicio') ? $this->_request->getPost('aaejercicio') : "0";
        $datos['aejercicio'] = $this->_request->getPost('aejercicio') ? $this->_request->getPost('aejercicio') : "0";
        $datos['pejercicio'] = $this->_request->getPost('pejercicio') ? $this->_request->getPost('pejercicio') : "0";
        $datos['idpadre'] = $this->_request->getPost('idpadre');
        $datos['start'] = $this->_request->getPost('start');
        $datos['limit'] = $this->_request->getPost('limit');
        $model = new InversionesModel();
        $cont = 0;
        $idUSD = $model->devolverIdMonedaXCodigo('USD', $datos['identidad']);
        $iddMP = $model->devolverIdMonedaXCodigo('CUP', $datos['identidad']);
        $datos['USD'] = $idUSD[0]['idmonedaentidad'] ? $idUSD[0]['idmonedaentidad'] : 0;
        $datos['MP'] = $iddMP[0]['idmonedaentidad'] ? $iddMP[0]['idmonedaentidad'] : 0;
        $valor = $this->_request->getPost('anode');
        if ($valor != '' && $valor != undefined && $valor != null && $valor != 0 && $datos['idpadre'] == 0) {
            $datos['idpadre'] = $valor;
        }
        $data = DatMedioAmbienteModel::cargarMedioAmb($datos);
        foreach ($data as $key => $dato) {
            if ($dato['pad'] == $dato['idmedioambglobal']) {
                $data[$key]['_parent'] = null;
                $data[$key]['tipo'] = 'sector';
            } else {
                $data[$key]['_parent'] = $dato['pad'];
            }
        }
        if (count($data) > 0) {
            echo json_encode(array('data' => $data, 'total' => count($data)));
        } else {
            echo json_encode(array('data' => array(), 'total' => 0));
        }
    }

    public function cargarEtapasAction() {
        $inv = new InversionesModel();
        $datosInv['idinversion'] = $this->_request->getPost('idinversion');
        $datosInv['idejercicio'] = $this->_request->getPost('idejercicio');
        $datosInv['identidad'] = $this->_request->getPost('identidad');
        $resultado = $inv->cargarComponentes($datosInv);
        echo json_encode($resultado);
    }

    public function cargarPresupuestoInversionAction() {
        $ejer = array();
        $datosInv['idinversion'] = $this->_request->getPost('idinversion');
        $datosInv['idejercicio'] = $this->_request->getPost('idejercicio');
        $datosInv['idejercicioparam'] = $this->_request->getPost('idejercicio');
        $datosInv['identidad'] = $this->_request->getPost('identidad');
        $ejer[0]['den'] = $this->_request->getPost('aaejercicio');
        $ejer[1]['den'] = $this->_request->getPost('aejercicio');
        $ejer[2]['den'] = $this->_request->getPost('ejercicio');
        $ejer[3]['den'] = $this->_request->getPost('pejercicio');

        $ejer[0]['id'] = DatInversion::idejercicioPorDenominacion($ejer[0]['den']);
        $ejer[1]['id'] = DatInversion::idejercicioPorDenominacion($ejer[1]['den']);
        $ejer[3]['id'] = DatInversion::idejercicioPorDenominacion($ejer[3]['den']);
        $ejer[2]['id'] = $datosInv['idejercicio'];

        $datosInv['start'] = $this->_request->getPost('start');
        $datosInv['limit'] = $this->_request->getPost('limit');
        $datosInv['monedausd'] = 9900000046;
        $datosInv['monedamp'] = 9900000103;
        $inv = new InversionesModel();

        $idUSD = $inv->devolverIdMonedaEnt($datosInv['monedausd'], $datosInv['identidad']);
        $iddMP = $inv->devolverIdMonedaEnt($datosInv['monedamp'], $datosInv['identidad']);
        $datosInv['USD'] = $idUSD[0]['idmonedaentidad'] ? $idUSD[0]['idmonedaentidad'] : 0;
        $datosInv['MP'] = $iddMP[0]['idmonedaentidad'] ? $iddMP[0]['idmonedaentidad'] : 0;

        $datosInv['ejercicios'] = $ejer;

        $datos = $inv->listarPlanesPreparacion($datosInv);
        //print_r($datosInv);die;
        $planPrepracion = $inv->PlanPreparacion($datosInv); //nuevo Yanila
        //print_r($planPrepracion);die;



        $resultado = $inv->listarComponentes($datosInv, $datos);
      
        //$resultCons = $inv->TotalesValConst($datosInv, $resultado, $ejer);
        //print_r($datos[0]['valormp']);die;
        if (count($resultado) > 0) {
            echo json_encode(array('data' => $resultado, 'total' => count($resultado), 
                'planPrep' => $planPrepracion, 'valormp' => $datos[0]['valormp'], 
                'valorusd' => $datos[0]['valorusd'], 'ejercicio' => $datos[0]['ejercicio']));
        } else {
            echo json_encode(array('data' => array(), 'total' => 0));
        }
    }

    public function guardarDatosPresupuestoAction() {
        $parametros->datos = json_decode(stripslashes($this->_request->getPost('datos')));
        $parametros->ejercicio = $this->_request->getPost('ejercicio');
        $parametros->idinversion = $this->_request->getPost('idinversion');
        $parametros->usd = 9900000046;
        $parametros->mp = 9900000103;
        $model = new InversionesModel();
        $result = $model->guardarDatosPresupuesto($parametros);
        echo json_encode(array('mensaje' => 1));
    }

    public function guardarDatosPresupuestoAjusteAction() {
        $parametros->datos = json_decode(stripslashes($this->_request->getPost('datos')));
        $parametros->ejercicio = $this->_request->getPost('ejercicio');
        $parametros->idinversion = $this->_request->getPost('idinversion');
        $parametros->usd = 9900000046;
        $parametros->mp = 9900000103;
        $model = new InversionesModel();
        $result = $model->guardarDatosPresupuestoAjuste($parametros);
        echo json_encode(array('mensaje' => 1));
    }

    public function cargarContructorAction() {

        $datos['idinversion'] = $this->_request->getPost('idinversion');
        $datos['idejercicio'] = $this->_request->getPost('idejercicio');
        $datos['identidad'] = $this->_request->getPost('identidad');
        $datos['aaejercicio'] = $this->_request->getPost('aaejercicio') ? $this->_request->getPost('aaejercicio') : "0";
        $datos['aejercicio'] = $this->_request->getPost('aejercicio') ? $this->_request->getPost('aejercicio') : "0";
        $datos['pejercicio'] = $this->_request->getPost('pejercicio') ? $this->_request->getPost('pejercicio') : "0";
        $datos['start'] = $this->_request->getPost('start');
        $datos['limit'] = $this->_request->getPost('limit');

        $datos['idusd'] = 9900000046;
        $datos['idmp'] = 9900000103;
        $idUSD = InversionesModel::devolverIdMonedaEnt($datos['idusd'], $datos['identidad']);
        $iddMP = InversionesModel::devolverIdMonedaEnt($datos['idmp'], $datos['identidad']);
        $datos['USD'] = $idUSD[0]['idmonedaentidad'] ? $idUSD[0]['idmonedaentidad'] : 0;
        $datos['MP'] = $iddMP[0]['idmonedaentidad'] ? $iddMP[0]['idmonedaentidad'] : 0;
        $etapa = 199; //id construcion etapa
        $etapainv = DatInversion::cargarIdEtapa($datos, $etapa);
        if (count($etapainv) > 0) {
            $datos['idetapa'] = $etapainv[0]['idetapainversion'];
            $datosUSD = DatInversion::cargarPresupuestoEtapaxMoneda($datos, $datos['USD']);
            $datosMP = DatInversion::cargarPresupuestoEtapaxMoneda($datos, $datos['MP']);

            $desgloseUSD = DatInversion::cargarDesglose($datos, $datos['idusd']);
            $desgloseMP = DatInversion::cargarDesglose($datos, $datos['idmp']);
            $sumUsd = array_sum($desgloseUSD[0]);
            $sumMp = array_sum($desgloseMP[0]);
        } else {
            $datosUSD = 0;
            $datosMP = 0;
            $sumUsd = 0;
            $sumMp = 0;
        }
        $model = new InversionesModel();
        $data = $model->listarConstructorPorEjercicio($datos);


        if (count($data) > 0) {
            echo json_encode(array('data' => $data, 'total' => count($data), 'usdpresp' => $datosUSD, 'mppresp' => $datosMP, 'usddesg' => $sumUsd, 'mpdesg' => $sumMp));
        } else {
            echo json_encode(array('data' => array(), 'total' => 0));
        }
    }

//***Otros indicadores****
    function cargarOtrosindicadoresAction() {
        $datosInv['idinversion'] = $this->_request->getPost('idinversion');
        $datosInv['idejercicio'] = $this->_request->getPost('idejercicio');
        $datosInv['identidad'] = $this->_request->getPost('identidad');
        $datosInv['aaejercicio'] = $this->_request->getPost('aaejercicio'); //denominacion del ejercicio antes del anterior
        $datosInv['aejercicio'] = $this->_request->getPost('aejercicio'); //denominacion del ejercicio anterior
        $datosInv['pejercicio'] = $this->_request->getPost('pejercicio'); //denominacion del ejercicio porsterior        
        $datosInv['start'] = 0;
        $datosInv['limit'] = 2000;
        $MP = 9900000103;
        $moneda = InversionesModel::devolverIdMonedaEnt($MP, $datosInv['identidad']);
        $datosInv['idmonedaentidadmp'] = $moneda ? $moneda[0]['idmonedaentidad'] : 0;
        $inv = new InversionesModel();
        $resultado = $inv->listarOtrosindicadores($datosInv);
        //print_r($resultado);die;
        if (count($resultado) > 0) {
            echo json_encode(array('data' => $resultado, 'total' => count($resultado)));
        } else {
            echo json_encode(array('data' => array(), 'total' => 0));
        }
    }

    public function etapaPlanAction() {
        ini_set("max_execution_time", 600000);
        $datos['idinversion'] = $this->_request->getPost('inversion');
        if ($datos['idinversion'] != '') {
            $inv = new DatEtapaEquipoModel();
            $etapa = $inv->deVolEtapa($datos);
            $plan = $inv->deVolPlan($datos);
            echo json_encode(array('etapa' => $etapa[0], 'plan' => $plan[0]));
        } else {
            echo json_encode(array('etapa' => '', 'plan' => ''));
        }
    }

    function guardarOtrosindicadoresAction() {
        $params['valores'] = json_decode(stripslashes($this->_request->getPost('valores')));
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $params['usuario'] = $this->global->Perfil->usuario;
        $params['aaejercicio'] = $this->_request->getPost('aaejercicio'); //denominacion del ejercicio antes del anterior
        $params['aejercicio'] = $this->_request->getPost('aejercicio'); //denominacion del ejercicio anterior
        $params['pejercicio'] = $this->_request->getPost('pejercicio'); //denominacion del ejercicio porsterior 
        $model = new InversionesModel();
        echo json_encode(array('codMsgOI' => $model->guardarOtrosindicadores($params)));
    }

    function ajustarOtrosindicadoresAction() {
        $params['valores'] = json_decode(stripslashes($this->_request->getPost('valores')));
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $params['aaejercicio'] = $this->_request->getPost('aaejercicio'); //denominacion del ejercicio antes del anterior
        $params['aejercicio'] = $this->_request->getPost('aejercicio'); //denominacion del ejercicio anterior
        $params['pejercicio'] = $this->_request->getPost('pejercicio'); //denominacion del ejercicio porsterior 
        $params['ajustar'] = $this->_request->getPost('ajustar'); 
        $model = new InversionesModel();
        echo json_encode(array('codMsgOI' => $model->guardarOtrosindicadores($params)));
    }

//*** Niveles de Capacidades a poner en explotacion****
    function cargarCapExplotacionAction() {
        $datosInv['start'] = 0;
        $datosInv['limit'] = 2000;
        $inv = new InversionesModel();
        $resultado = $inv->listarCapExplotacion($datosInv);
        if (count($resultado) > 0) {
            echo json_encode(array('data' => $resultado, 'total' => count($resultado)));
        } else {
            echo json_encode(array('data' => array(), 'total' => 0));
        }
    }

//*** Adicionar niveles de actividad para la capacidades a poner en explotacion
    function adicionarInvCapExpAction() {
        $params['arrayidniveles'] = json_decode(stripslashes($this->_request->getPost('arrayidniveles')));
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idinversion'] = $this->_request->getPost('idinversion');
        $model = new InversionesModel();
        echo json_encode(array('codMsgA' => $model->adicionarInvCapExp($params)));
    }

//*** Eliminar niveles de actividad para la capacidades a poner en explotacion
    function eliminarInvCapExpAction() {
        $params['array_niveles'] = json_decode(stripslashes($this->_request->getPost('array_niveles')));
        $model = new InversionesModel();
        echo json_encode(array('codMsgA' => $model->eliminarInvCapExp($params)));
    }

//*** Cargar Unidad de medida **
    function cargarUMAction() {
        $model = new InversionesModel();
        echo json_encode(array('datos' => $model->listarum($this->_request->getPost())));
    }

    public function guardarDatosFinanciamientoAction() {
        $parametros->datos = json_decode(stripslashes($this->_request->getPost('datos')));
        $parametros->ejercicio = $this->_request->getPost('ejercicio');
        $parametros->identidad = $this->_request->getPost('identidad');
        $parametros->usd = 9900000046;
        $parametros->mp = 9900000103;
        $model = new InversionesModel();
        $result = $model->guardarDatosFinanciamiento($parametros);
        echo json_encode(array('mensaje' => 1));
    }


    public function guardarDatosFinanciamientoAjusteAction() {
        $parametros->datos = json_decode(stripslashes($this->_request->getPost('datos')));
        $parametros->ejercicio = $this->_request->getPost('ejercicio');
        $parametros->identidad = $this->_request->getPost('identidad');
        $parametros->usd = 9900000046;
        $parametros->mp = 9900000103;
        $model = new InversionesModel();
        $result = $model->guardarDatosFinanciamientoAjuste($parametros);
        echo json_encode(array('mensaje' => 1));
    }

    public function guardarDatosQuienFinanciaAction() {
        $parametros->datos = json_decode(stripslashes($this->_request->getPost('datos')));
        $parametros->ejercicio = $this->_request->getPost('ejercicio');
        $parametros->identidad = $this->_request->getPost('identidad');
        $parametros->usd = 9900000046;
        $parametros->mp = 9900000103;
        try {
            $model = new InversionesModel();
            $result = $model->guardarDatosQuienFinancia($parametros);
            echo json_encode(array('mensaje' => 1));
        } catch (Exception $e) {
            echo json_encode(array('mensaje' => 1));
        }
    }

    public function guardarDatosQuienFinanciaAjusteAction() {
        $parametros->datos = json_decode(stripslashes($this->_request->getPost('datos')));
        $parametros->ejercicio = $this->_request->getPost('ejercicio');
        $parametros->identidad = $this->_request->getPost('identidad');
        $parametros->usd = 9900000046;
        $parametros->mp = 9900000103;
        try {
            $model = new InversionesModel();
            $result = $model->guardarDatosQuienFinanciaAjuste($parametros);
            echo json_encode(array('mensaje' => 1));
        } catch (Exception $e) {
            echo json_encode(array('mensaje' => 1));
        }
    }

    public function listarOrgSatisfaAction() {
        $model = new NomOrganosatisface();
        $result = $model->listarOSxEquipos();
        echo json_encode(array('data' => $result));
    }

    public function guardarDatosAlContadoAction() {
//die('e');
        $parametros->datos = json_decode(stripslashes($this->_request->getPost('datos')));
        //print_r($parametros->datos);die;
        $parametros->ejercicio = $this->_request->getPost('ejercicio');
        $parametros->identidad = $this->_request->getPost('identidad');
        $parametros->usd = 9900000046;
        $parametros->mp = 9900000103;
        //try {
        $model = new InversionesModel();
        $model->guardarDatosAlContado($parametros);
        echo json_encode(array('mensaje' => 1));
        /*  } catch (Exception $e) {
          echo json_encode(array('mensaje' => 1));
          } */
    }

    public function guardarDatosAlContadoAjusteAction() {

        $parametros->datos = json_decode(stripslashes($this->_request->getPost('datos')));
        //print_r($parametros->datos);die;
        $parametros->ejercicio = $this->_request->getPost('ejercicio');
        $parametros->identidad = $this->_request->getPost('identidad');
        $parametros->usd = 9900000046;
        $parametros->mp = 9900000103;
        //try {
        $model = new InversionesModel();
        $model->guardarDatosAlContadoAjuste($parametros);
        echo json_encode(array('mensaje' => 1));
        /*  } catch (Exception $e) {
          echo json_encode(array('mensaje' => 1));
          } */
    }

    public function listarCreditosAction() {

        $model = new InversionesModel();
        $result = $model->listarCreditos($parametros);
        echo json_encode(array('data' => $result));
    }

    function verFinanciamientoPlanAction() {
        $datosInv['idinversion'] = $this->_request->getPost('idinversion');
        $datosInv['idejercicio'] = $this->_request->getPost('idejercicio');
        $datosInv['identidad'] = $this->_request->getPost('identidad');
        $parametros->datosinv = json_decode(stripslashes($this->_request->getPost('datosinv')));
        $inv = new InversionesModel();
        $datos = $inv->verFinan($parametros, $datosInv);
        echo json_encode($datos);
    }

    function reporteViviendaHabitacionAction() {
        ini_set("max_execution_time", 600000);
        $parametros['idorganismo'] = $this->_request->getPost('idorganismo');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['aprobadopor'] = $this->_request->getPost('aprobadopor');
        $parametros['elaboradopor'] = $this->_request->getPost('elaboradopor');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['idejercicioden'] = $this->_request->getPost('idejercicioden');
        $parametros['organismoden'] = $this->_request->getPost('organismoden');
        $parametros['observacion'] = $this->_request->getPost('observacion');
        $parametros['identiDen'] = $this->_request->getPost('identiDen');
        $parametros['reporte'] = $this->_request->getPost('reporte');
        if ($parametros['reporte'] == 1) {
            //  $parametros['descrip'] = "F�sico de Viviendas Terminaci�n";
            $parametros['idnomotrosindicadores'] = 120;
        } else if ($parametros['reporte'] == 0) {
            // $parametros['descrip'] = "F�sico de Habitaciones Nuevas";
            $parametros['idnomotrosindicadores'] = 119;
        }
        $parametros['entidadeshijas'] = json_decode(stripslashes($this->_request->getPost('entidadeshijas')));
        $parametros['entidadesDen'] = json_decode(stripslashes($this->_request->getPost('entidadesDen')));
        $inv = new InversionesModel();
        $datos = $inv->reporteViviendaHabitacion($parametros);
        echo json_encode($datos);
    }

    public function reporteDemandaEquiposAction() {
        ini_set("max_execution_time", 600000);
        $parametros->idorganismo = $this->_request->getParam('idorganismo');
        $parametros->idejercicio = $this->_request->getParam('idejercicio');
        $parametros->checkD = $this->_request->getParam('checkD');
        $parametros->idmoneda = $this->_request->getParam('idmoneda');
        $parametros->identidad = $this->_request->getParam('identidad');
        $parametros->idnivel = $this->_request->getParam('idnivel');
        $parametros->organismo = $this->_request->getParam('organismo');
        $parametros->moneda = $this->_request->getParam('moneda');
        $parametros->entidad = $this->_request->getParam('entidad');
        $parametros->nivel = $this->_request->getParam('nivel');
        $parametros->denominacion = $this->_request->getParam('denominacion');
        $parametros->aprobado = $this->_request->getParam('aprobado');
        $parametros->elaborado = $this->_request->getParam('elaborado');
        $parametros->observaciones = $this->_request->getParam('observaciones');
        $parametros->identiDen = $this->_request->getParam('identiDen');
        $parametros->organismoden = $this->_request->getPost('organismo');
        $obj = new GenerarPdfDemandaEquipos($parametros);
        $obj->export();
    }

    public function rptComponentesAction() {
        ini_set("max_execution_time", 600000);
        $parametros->idorganismo = $this->_request->getParam('idorganismo');
        $parametros->idejercicio = $this->_request->getParam('idejercicio');
        $parametros->ejercicioden = $this->_request->getParam('ejercicioden');
        $parametros->checkD = $this->_request->getParam('checkD');
        $parametros->idmoneda = $this->_request->getParam('idmoneda');
        $parametros->identidad = $this->_request->getParam('identidad');
        $parametros->idnivel = $this->_request->getParam('idnivel');
        $parametros->organismo = $this->_request->getParam('organismo');
        $parametros->moneda = $this->_request->getParam('moneda');
        $parametros->entidad = $this->_request->getParam('entidad');
        $parametros->nivel = $this->_request->getParam('nivel');
        $parametros->denominacion = $this->_request->getParam('denominacion');
        $parametros->aprobado = $this->_request->getParam('aprobado');
        $parametros->elaborado = $this->_request->getParam('elaborado');
        $parametros->observaciones = $this->_request->getParam('observaciones');
        $parametros->identiDen = $this->_request->getParam('identiDen');
        $parametros->organismoden = $this->_request->getPost('organismo');
        $parametros->mostrarInv = $this->_request->getParam('mostrarinv');
        $parametros->forma = $this->_request->getParam('forma');
        $parametros->formaden = $this->_request->getParam('formaden');



        if ($this->_request->getParam('reporte') == 19) {
            $modelPI = new DatPlanInversionesModel ();
            $modelPI->reporteXComponeteExcel($parametros);
        } else {
            $obj = new GenerarPdfComponentes($parametros);
            $obj->export();
        }
    }

    public function reporteAcredorInversionAction() {
        ini_set("max_execution_time", 600000);
        $parametros['idorganismo'] = $this->_request->getParam('idorganismo');
        $parametros['integrator'] = $this->integrator;
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['aprobadopor'] = $this->_request->getParam('aprobadopor');
        $parametros['elaboradopor'] = $this->_request->getParam('elaboradopor');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['idejercicioden'] = $this->_request->getParam('idejercicioden');
        $parametros['organismoden'] = $this->_request->getParam('organismoden');
        $parametros['observacion'] = $this->_request->getParam('observacion');
        $parametros['identiDen'] = $this->_request->getParam('identiDen');
        $parametros['reporte'] = $this->_request->getParam('reporte');
        $parametros['credito'] = $this->_request->getParam('credito');
        $parametros['moneda'] = $this->_request->getParam('moneda');
        $parametros['gracia'] = $this->_request->getParam('gracia');
        $parametros['interes'] = $this->_request->getParam('interes');
        $parametros['amorti'] = $this->_request->getParam('amorti');
        $parametros['entidadeshijas'] = json_decode(stripslashes($this->_request->getParam('entidadeshijas')));
        $parametros['entidadesDen'] = json_decode(stripslashes($this->_request->getParam('entidadesDen')));
        $parametros['ids'] = array();
        $parametros1 = array();

        /* if($parametros['credito']==''){
          $datos = DatInversion::listarTipoFinan();
          print_r($datos);die;

          } */
        $organismo = explode(",", $parametros['idorganismo']);
        if ($parametros['identidad'] != "") {
            $parametros['entidades'].= $parametros['idorganismo'] . ",";
            $parametros['entidades'].= $parametros['identidad'];
        } else {
            $parametros['id'] = self::cargarEntidadesAux($organismo);
            foreach ($parametros['id'] as $key => $val) {
                $parametros1[$key]['ids'] = $val['identidad'];
            }
            foreach ($parametros1 as $key => $value) {
                $parametros['entidades'].=$value['ids'] . ",";
            }
            $parametros['entidades'].= $parametros['idorganismo'];
        }
        $parametros['idmoneda'] = $this->_request->getParam('moneda');
        try {
            if ($parametros['reporte'] == 3) {

                $obj = new GenerarPdfInversionAcredor($parametros);
                $obj->export();
            } else if ($parametros['reporte'] == 4) {
                $obj = new GenerarPdfAcredirInversion($parametros);
                $obj->export();
            }
        } catch (Exception $e) {
            
        }
    }

    public function reporteEmisionInversionAction() {


        ini_set("max_execution_time", 600000);
        $parametros['idorganismo'] = $this->_request->getParam('idorganismo');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['aprobadopor'] = $this->_request->getParam('aprobadopor');
        $parametros['elaboradopor'] = $this->_request->getParam('elaboradopor');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['idejercicioden'] = $this->_request->getParam('idejercicioden');
        $parametros['organismoden'] = $this->_request->getParam('organismoden');
        $parametros['observacion'] = $this->_request->getParam('observacion');
        $parametros['forma'] = $this->_request->getParam('forma');
        $parametros['formaden'] = $this->_request->getParam('formaden');
        $parametros['identiDen'] = $this->_request->getParam('identiDen');
        $parametros['entidadeshijas'] = json_decode(stripslashes($this->_request->getParam('entidadeshijas')));
        $parametros['entidadesDen'] = json_decode(stripslashes($this->_request->getParam('entidadesDen')));
        $parametros['codigoreu'] = InversionesModel::devolCodigoR($parametros['idorganismo']);
        $parametros['usd'] = 9900000046;
        $parametros['mp'] = 9900000103;

        //print_r($this->_request->getParam('idorganismo'));die;

        $parametros['direccionInversiones'] = $this->integrator->metadatos->DameHijosEstructura();
        $obj = new GenerarPdfEmisionInversion($parametros);
        $obj->export();
    }

    public function reporteXCosntructorAction() {

        ini_set("max_execution_time", 600000);
        $parametros['idorganismo'] = $this->_request->getParam('idorganismo');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['integrator'] = $this->integrator;
        $parametros['aprobadopor'] = $this->_request->getParam('aprobadopor');
        $parametros['formaden'] = $this->_request->getParam('forma');
        $parametros['elaboradopor'] = $this->_request->getParam('elaboradopor');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['idejercicioden'] = $this->_request->getParam('idejercicioden');
        $parametros['organismoden'] = $this->_request->getParam('organismoden');
        $parametros['observacion'] = $this->_request->getParam('observacion');
        $parametros['constructor'] = $this->_request->getParam('constructor');
        $parametros['identiDen'] = $this->_request->getParam('identiDen');
        $parametros['reporte'] = $this->_request->getParam('reporte');
        $parametros['provincia'] = $this->_request->getParam('provincia'); //arrayconstructor
        $parametros['arrayconstructor'] = json_decode(stripslashes($this->_request->getParam('arrayconstructor')));
        $parametros['idpt'] = $this->_request->getParam('provincia');
        $parametros['chequeado'] = $this->_request->getParam('chequeado');
        $parametros['chequeado1'] = $this->_request->getParam('chequeado1');
        $parametros['entidadeshijas'] = json_decode(stripslashes($this->_request->getParam('entidadeshijas')));
        $parametros['entidadesDen'] = json_decode(stripslashes($this->_request->getParam('entidadesDen')));
        $parametros['usd'] = 9900000046;
        $parametros['mp'] = 9900000103;
        $parametros1 = array();
        $organismo = explode(",", $parametros['idorganismo']);
        $parametros['id'] = self::cargarEntidadesAux($organismo);
        foreach ($parametros['id'] as $key => $val) {
            $parametros1[$key]['ids'] = $val['identidad'];
        }
        foreach ($parametros1 as $key => $value) {
            $parametros['entidades'].=$value['ids'] . ",";
        }
        $parametros['entidades'].= $parametros['idorganismo'];


        try {
            if ($parametros['reporte'] == 7) {
                $obj = new GenerarPdfConstructor($parametros);
                $obj->export();
            } else if ($parametros['reporte'] == 8) {
                $obj = new GenerarPdfInversionConstruccionMontaje($parametros);
                $obj->export();
            }
        } catch (Exception $e) {
            
        }
    }

    public function reporteXCosntructorExcelAction() {

        ini_set("max_execution_time", 600000);
        $parametros['idorganismo'] = $this->_request->getParam('idorganismo');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['integrator'] = $this->integrator;
        $parametros['aprobadopor'] = $this->_request->getParam('aprobadopor');
        $parametros['elaboradopor'] = $this->_request->getParam('elaboradopor');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['idejercicioden'] = $this->_request->getParam('idejercicioden');
        $parametros['organismoden'] = $this->_request->getParam('organismoden');
        $parametros['observacion'] = $this->_request->getParam('observacion');
        $parametros['constructor'] = $this->_request->getParam('constructor');
        $parametros['identiDen'] = $this->_request->getParam('identiDen');
        $parametros['reporte'] = $this->_request->getParam('reporte');
        $parametros['provincia'] = $this->_request->getParam('provincia'); //arrayconstructor
        $parametros['arrayconstructor'] = json_decode(stripslashes($this->_request->getParam('arrayconstructor')));
        $parametros['idpt'] = $this->_request->getParam('provincia');
        $parametros['chequeado'] = $this->_request->getParam('chequeado');
        $parametros['chequeado1'] = $this->_request->getParam('chequeado1');
        $parametros['entidadeshijas'] = json_decode(stripslashes($this->_request->getParam('entidadeshijas')));
        $parametros['entidadesDen'] = json_decode(stripslashes($this->_request->getParam('entidadesDen')));
        $parametros['usd'] = 9900000046;
        $parametros['mp'] = 9900000103;
        $parametros1 = array();
        $organismo = explode(",", $parametros['idorganismo']);
        $parametros['id'] = self::cargarEntidadesAux($organismo);
        foreach ($parametros['id'] as $key => $val) {
            $parametros1[$key]['ids'] = $val['identidad'];
        }
        foreach ($parametros1 as $key => $value) {
            $parametros['entidades'].=$value['ids'] . ",";
        }
        $parametros['entidades'].= $parametros['idorganismo'];

        $modelPI = new DatPlanInversionesModel ();
        $modelPI->exportarConstructoresAExcel($parametros);
    }

    public function reporteResumenInversionAction() {
        ini_set("max_execution_time", 600000);
        $parametros['idorganismo'] = $this->_request->getParam('idorganismo');
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['aprobadopor'] = $this->_request->getParam('aprobadopor');
        $parametros['elaboradopor'] = $this->_request->getParam('elaboradopor');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['idejercicioden'] = $this->_request->getParam('idejercicioden');
        $parametros['organismoden'] = $this->_request->getParam('organismoden');
        $parametros['observacion'] = $this->_request->getParam('observacion');
        $parametros['identiDen'] = $this->_request->getParam('identiDen');
        $parametros['idinversion'] = $this->_request->getParam('idinversion');
        $parametros['entidadeshijas'] = json_decode(stripslashes($this->_request->getParam('entidadeshijas')));
//        $parametros['entidadesDen'] = json_decode(stripslashes($this->_request->getParam('entidadesDen')));
        $parametros['entidadesDen'] = $this->_request->getParam('entidadesDen');
        $parametros['ids'] = array();
        if ($parametros['identidad'] != "") {
            $parametros['ids'][0] = $parametros['idorganismo'];
            $parametros['ids'][1] = $parametros['identidad'];
        } else {
            $parametros['ids'][0] = $parametros['idorganismo'];
            foreach ($parametros['entidadeshijas'] as $key => $val) {
                $parametros['ids'][] = $val;
            }
        }
        if ($this->_request->getParam('reporte') == 5) {
            $obj = new GenerarPdfResumenInversion($parametros);
            $obj->export();
        } else if ($this->_request->getParam('reporte') == 10) {
            $obj = new GenerarPdfResumenInversionMUSD($parametros);
            $obj->export();
        } else if ($this->_request->getParam('reporte') == 18) {
            $modelPI = new DatPlanInversionesModel ();
            $modelPI->reporteResumenMPExcel($parametros);
        }
    }

    public function reporteBalanceVAction() {
        $parametros['idorgrector'] = $this->_request->getParam('idorgrector');
        $modelPI = new DatPlanInversionesModel ();
        $modelPI->reporteBVAutomotor($parametros);
    }

    public function reporteEquiposAutomotoresAction() {
        ini_set("max_execution_time", 600000);
        $parametros['idorganismo'] = $this->_request->getParam('idorganismo');
        $parametros['integrator'] = $this->integrator;
        $parametros['integrator'] = $this->integrator;
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['aprobadopor'] = $this->_request->getParam('aprobadopor');
        $parametros['elaboradopor'] = $this->_request->getParam('elaboradopor');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['idejercicioden'] = $this->_request->getParam('idejercicioden');
        $parametros['organismoden'] = $this->_request->getParam('organismoden');
        $parametros['observacion'] = $this->_request->getParam('observacion');
        $parametros['idforma'] = $this->_request->getParam('forma');
        $parametros['idcompra'] = $this->_request->getParam('idcompra');
        $parametros['comprarden'] = $this->_request->getParam('comprarden');
        $parametros['formaden'] = $this->_request->getParam('formaden');
        $parametros['identiDen'] = $this->_request->getParam('identiDen');
        $parametros['entidadeshijas'] = json_decode(stripslashes($this->_request->getParam('entidadeshijas')));
        $parametros['entidadesDen'] = json_decode(stripslashes($this->_request->getParam('entidadesDen')));
        $parametros['idmoneda'] = $this->_request->getParam('idmoneda');
        $parametros['codigoreu'] = InversionesModel::devolCodigoR($parametros['idorganismo']);

        $parametros1 = array();
        $parametros['id'] = self::cargarEntidadesAux($parametros['idorganismo']);
        foreach ($parametros['id'] as $key => $val) {
            $parametros1[$key]['ids'] = $val['identidad'];
        }
        foreach ($parametros1 as $key => $value) {
            $parametros['entidades'].=$value['ids'] . ",";
        }
        $parametros['entidades'].= $parametros['idorganismo'];

// try {   

        $obj = new GenerarPdfEquiposAutomotoresPlan($parametros);
        $obj->export();
//  } catch (Exception $e) {
//  }
    }

    public function listarMonedaAction() {
        $model = new DatPlanInversionesModel();
        $result = $model->ListarMonedaPorEntidad();
        echo json_encode(array('data' => $result));
    }

    public function listarMonedaAuxAction() {
        $model = new DatPlanInversionesModel();
        $result = $model->ListarMonedas();
        echo json_encode($result);
    }

    public function listarComboProgramadaAction() {
        $params['idejercicio'] = $this->_request->getPost('idejercicio') ? $this->_request->getPost('idejercicio') : 15;
        $params['identidad'] = $this->_request->getPost('identidad') ? $this->_request->getPost('identidad') : 0;
        $model = new InversionesModel();
        $result = $model->cargarProgramada($params);
        echo json_encode($result);
    }

    public function getElementosAction() {
        $params->idorganismo = json_decode($this->_request->getParam('idorganismo'));
        $params->idejercicio = $this->_request->getParam('idejercicio');
        $params->idforma = json_decode($this->_request->getParam('idforma'));
        if ($params->idorganismo != '') {
            $model = new DatEtapaModel();
            $organismo = explode(",", $params->idorganismo);
            $parametros['id'] = self::cargarEntidadesAux($organismo);
            foreach ($parametros['id'] as $key => $val) {
                $parametros1[$key]['ids'] = $val['identidad'];
            }
            foreach ($parametros1 as $key => $value) {
                $params->identidades.=$value['ids'] . ",";
            }
            $params->identidades.= $params->idorganismo;
            $result = $model->getEtapas($params, $params->identidades);
            echo json_encode($result);
        }
    }

    public function reporteMaquetaAction() {
        
        ini_set("max_execution_time", 600000);
        $params->idejercicio = $this->_request->getParam('idejercicio');
        $params->ejercicioden = $this->_request->getParam('ejercicioden');
        $params->idorganismo = $this->_request->getParam('idorganismo');
        $params->organismoden = $this->_request->getParam('organismoden');
        $params->idforma = $this->_request->getParam('idforma');
        $params->aprobado = $this->_request->getParam('aprobado');
        $params->elaborado = $this->_request->getParam('elaborado');
        $params->idetapa = $this->_request->getParam('idetapa');
        $params->observaciones = $this->_request->getParam('observaciones');
        $params->integrador = $this->integrator;
        try {
            $objpdfmaqueta = new GenerarPdfMaqueta($params);
            $objpdfmaqueta->export();
        } catch (Exception $e) {
            
        }
    }

    public function exportarEquiposAutomotroesExcelAction() {
        
        $parametros['idorganismo'] = $this->_request->getParam('idorganismo');
        $parametros['integrator'] = $this->integrator;
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['aprobadopor'] = $this->_request->getParam('aprobadopor');
        $parametros['elaboradopor'] = $this->_request->getParam('elaboradopor');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['idejercicioden'] = $this->_request->getParam('idejercicioden');
        $parametros['organismoden'] = $this->_request->getParam('organismoden');
        $parametros['observacion'] = $this->_request->getParam('observacion');
        $parametros['idforma'] = $this->_request->getParam('forma');

        $parametros['idcompra'] = $this->_request->getParam('idcompra');
        $parametros['comprarden'] = $this->_request->getParam('comprarden');
        $parametros['formaden'] = $this->_request->getParam('formaden');
        $parametros['identiDen'] = $this->_request->getParam('identiDen');
        $parametros['entidadeshijas'] = json_decode(stripslashes($this->_request->getParam('entidadeshijas')));
        $parametros['entidadesDen'] = json_decode(stripslashes($this->_request->getParam('entidadesDen')));
        $parametros['idmoneda'] = $this->_request->getParam('idmoneda');
        $parametros1 = array();
        $parametros['id'] = self::cargarEntidadesAux($parametros['idorganismo']);

        foreach ($parametros['id'] as $key => $val) {
            $parametros1[$key]['ids'] = $val['identidad'];
        }
        foreach ($parametros1 as $key => $value) {
            $parametros['entidades'].=$value['ids'] . ",";
        }
        $parametros['entidades'].= $parametros['idorganismo'];
        $modelPI = new DatPlanInversionesModel ();
        $modelPI->exportarAExcel($parametros);
    }

    public function exportarEquiposExcelAction() {
        
        $parametros['idorganismo'] = $this->_request->getParam('idorganismo');
        $parametros['integrator'] = $this->integrator;
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['organismoden'] = $this->_request->getParam('organismoden');
        $parametros['idforma'] = $this->_request->getParam('FormaProp');
        $parametros['idcompra'] = $this->_request->getParam('idcompra');
        $parametros['idadquirir'] = $this->_request->getParam('adquirir');
        $parametros['orgsat'] = $this->_request->getParam('idorgano');
        $parametros['identiDen'] = $this->_request->getParam('identiDen');
        if ($parametros['idorganismo']) {
            $idorganismo = explode(',', $parametros['idorganismo']);

            $entidades = array();
            foreach ($idorganismo as $org) {
                $entidades = array_merge($entidades, self::buscarEntidades($org));
            }

            $parametros['entidades'] = implode(',', $entidades);
        }


        $modelPI = new DatPlanInversionesModel ();
        $modelPI->exportarEquiposExcel($parametros);
    }

    public function listarOrganoSatisfaceAction() {
        $p = NomIndicadorModel::listarnombresorganoSatisface();
        // print_r($p);die;
        echo json_encode(NomIndicadorModel::listarnombresorganoSatisface());
    }

    public function exportarConstMontajeExcelAction() {
        ini_set("max_execution_time", 600000000);
        $idorganismo = $this->_request->getParam('idorganismo');
        $identidad = $this->_request->getParam('identidad');
        $forma = $this->_request->getParam('forma');
        //$idejercicio = $this->_request->getParam('idejercicio');
        $idorganismoarray = explode(",", $idorganismo);
        $identidadarray = explode(",", $identidad);

        if ($idorganismo) {
            foreach ($idorganismoarray as $key => $value) {
                $parametros[$key]['idorganismo'] = $value;
                $entidades = self::cargarEntidadesAux1($value);
                foreach ($entidades as $key1 => $value1) {
                    $entidadesaux[$key1] = $value1['identidad'];
                }

                if ($identidad) {
                    $entidadesauxinter = array_intersect($entidadesaux, $identidadarray);
                    if (count($entidadesauxinter) != 0) {
                        $parametros[$key]['entidades'] = implode(",", $entidadesauxinter);
                    }
                } else {
                    $parametros[$key]['entidades'] = implode(",", $entidadesaux);
                }
            }
        } else {
            $dominios = $this->integrator->metadatos->DameHijosEstructura();
            $entidades = $this->integrator->metadatos->DameHijosEstructura($dominios[0]->id);
            foreach ($entidades as $value) {
                $organismos [] = $value->id;
            }
            foreach ($organismos as $key3 => $value11) {
                $parametros[$key3]['idorganismo'] = $value11;
                $entidades1 = self::cargarEntidadesAux1($value11);
                $entidadesaux = [];
                foreach ($entidades1 as $key4 => $value2) {
                    $entidadesaux[$key4] = $value2['identidad'];
                }
                $parametros[$key3]['entidades'] = implode(",", $entidadesaux);
            }
        }


        $ejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        $modelPI = new DatPlanInversionesModel ();
        $modelPI->exportarConstMontajeExcelModel($parametros, $ejercicioactual['idejercicio'], $forma);
    }

    public function buscarEntidades($identidad) {
        $query = " SELECT f5.idfila as idestructura
                    FROM mod_estructuracomp.nom_filaestruc f5
                    WHERE f5.lft >= (SELECT f3.lft FROM mod_estructuracomp.nom_filaestruc f3 WHERE f3.idfila = $identidad)
                    AND f5.rgt <= (SELECT f4.rgt FROM mod_estructuracomp.nom_filaestruc f4 WHERE f4.idfila = $identidad)
                    AND f5.rgt -f5.lft =1";
        $conn = Doctrine_Manager::connection();
        $res = $conn->execute($query);
        $result = $res->fetchAll(PDO::FETCH_COLUMN);

        return $result;
    }

    public function exportarPlanPreparacionAction() {
        ini_set("max_execution_time", 600000);
        $parametros['identidad'] = $this->_request->getParam('identidad');
        $parametros['idejercicio'] = $this->_request->getParam('idejercicio');
        $parametros['ejercicio'] = $this->_request->getParam('ejercicio');
        $parametros['vigente'] = $this->_request->getParam('vigente');
        $parametros['idinvers'] = json_decode(stripslashes($this->_request->getParam('idinvers')));
        $parametros['scp'] = $this->_request->getParam('scp');
        $entidad = $this->integrator->metadatos->DameEstructura($parametros['identidad']);
        $parametros['entidad'] = $entidad [0]->denominacion;

        if($parametros['scp']==1){
            // reporte consolidado
            $dominios = $this->integrator->metadatos->DameHijosEstructura($parametros['identidad']);
            $dom=array();
            foreach ($dominios as $value) {
                array_push($dom, $value->id);
            }
            array_push($dom, $parametros['identidad']);
            $parametros['dominios'] = $dom;            
            $modelPI = new DatPlanInversionesModel();
            $modelPI->exportarIndSCP($parametros);

        }elseif ($parametros['scp']==2) {
            //reporte para entidad seleccionada
            $dom=array();
            array_push($dom, $parametros['identidad']);
            $parametros['dominios'] = $dom;
            $modelPI = new DatPlanInversionesModel();
            $modelPI->exportarIndSCP($parametros);
        }else{
            $modelPI = new DatPlanInversionesModel();
            $modelPI->exportarPlanPreparacion($parametros);
        }
//print_r($parametros);die;
        

    }

    public function getEjercicioEstadoAction(){
        $parametros['ejercicio'] = $this->_request->getParam('ejercicio');
        $model = new DatPlanInversionesModel();
        $result = $model->getEjercicioEstado($parametros);
        echo json_encode($result);
    }

    public function calcularEquiposAction(){
        $parametros['datos'] = json_decode(stripslashes($this->_request->getPost('valores')));
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['aaejercicio'] = $this->_request->getPost('aaejercicio');
        $parametros['aejercicio'] = $this->_request->getPost('aejercicio');
        $parametros['pejercicio'] = $this->_request->getPost('pejercicio');
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idinversion'] = $this->_request->getPost('idinversion');
        //print_r('entras');die;
        $equipoModel = new DatPlanInversionesModel();

        $datos = $equipoModel->calcularEquipos ($parametros);
        echo json_encode($datos);
    }



}
