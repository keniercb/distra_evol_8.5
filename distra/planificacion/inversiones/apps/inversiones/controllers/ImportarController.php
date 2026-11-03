<?php

/**
 * ImportarController
 * Controlador para gestionar las importaciones al sistema.
 *
 * @ author Dionisdel Ponce Santana
 * @ package Planificación
 * @ subpackage Planificación
 * @ copyright UCID-ERP Cuba
 * @ version 2.x
 * */
class ImportarController extends ZendExt_Controller_Secure {

    /**
     * init
     * Inicializar los atributos de la clase
     *
     * @return void
     */
    function init() {
        parent::init();
        //Aumentar el Tamaño Máximo al Cargar Archivos
        ini_set("upload_max_filesize", '400M'); //M=MegaByte
        ini_set("post_max_size", '450M'); //M=MegaByte
        ini_set("max_execution_time", 7200); //120 min de conexion 2 hrs
    }

//fin de la función init

    function listarTipoDocumentosAction() {
        $nuevo = new NomTipodocumentoimportar();
        $res = $nuevo->listarTipoDocumento();
        echo json_encode(array('data' => $res));
    }

    function importarAction() {
        $jsayuda = $this->integrator->ayuda->devolverJS();
        $this->view->jsayuda = $jsayuda;
        $this->render();
    }

    function listarAction() {
        $params['idconcepto'] = $this->_request->getPost('idconcepto');
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        $res = DatImportarModel::listar($params);
        echo json_encode($res);
    }

    function listarConceptosAction() {
        $res = DatImportarModel::listarConceptos();
        echo json_encode(array('data' => $res));
    }

    function getConfigGridAction() {
        $idconcepto = $this->_request->getPost('idconcepto');
        $res = DatImportarModel::getConfigGrid($idconcepto);
        echo json_encode($res);
    }

    function importarficheroAction() {
        $filename = $_FILES['file']['tmp_name'];
        $params['idconcepto'] = $this->_request->getPost('idconcepto');
        $params['file'] = $filename;
        $fileextension = $_FILES['file']['type'];
        $filename = explode('.', $_FILES['file']['name']);

        if ($fileextension == 'application/vnd.ms-excel' || $fileextension == 'application/xls' || $filename[count($filename) - 1] == 'xls' || $filename[count($filename) - 1] == 'xlsx'
        ) {
            $res = DatImportarModel::importarFichero($params);

            echo json_encode($res);
        } else {
            echo json_encode(array('cod' => 53));
        }
    }

    function listarTipoAccionAction() {
        $idconcepto = $this->_request->getPost('idconcepto');
        $nuevo = new NomTipoaccionimportar();
        $result = $nuevo->listarTipoAccionDadoIdConcepto($idconcepto);
        echo json_encode(array('data' => $result));
    }

    function realizaracciondatosimportadosAction() {
        ini_set("max_execution_time", 7200); //120 min de conexion 2 hrs
        $idconf = $this->_request->getPost('idconfiguracion');
        $idaccion = $this->_request->getPost('idaccion'); //1
        $idconcepto = $this->_request->getPost('idconcepto'); //4
        $rectora = $this->_request->getPost('rectora');
        $filtros = json_decode(stripslashes($this->_request->getPost('filtros')));
        $cols_checked = json_decode(stripslashes($this->_request->getPost('cols_checked')));
        $resp = DatImportarModel::realizarAccion($idaccion, $idconcepto, $idconf, $rectora, $filtros, $cols_checked);
        /* 1 - ERRORES, 2 - BIEN */
        if (is_array($resp)) {
            echo json_encode(array('cod' => 3, 'tipo' => $resp['error']));
        } elseif ($resp . 'f' == 'vaciof') {
            echo json_encode(array('cod' => 'vacio', 'idtipoaccion' => $idaccion));
        } elseif ($resp > 0) {
            echo json_encode(array('cod' => 1, 'idtipoaccion' => $idaccion));
        } else {
            echo json_encode(array('cod' => 2, 'idtipoaccion' => $idaccion));
        }
    }

    function exportartemptableAction() {
        $config = json_decode($this->_request->getParam('config'));
        $datos = DatImportarModel::listarDadoTempTable($config->tablatemporal);
        $cols = DatImportarModel::obtenerColumnasDadoIdConcepto($config->idconcepto);
        DatImportarModel::exportarTempTable($cols, $datos);
    }

    function eliminarelementostemptableAction() {
        $idtempelements = json_decode(stripslashes($this->_request->getPost('idtempelements')));
        $idconcepto = $this->_request->getPost('idconcepto');
        $temptable = DatImportarModel::obtenerTablaTemporalDadoIdConcepto($idconcepto);
        if (!empty($temptable)) {
            DatImportarModel::eliminarDatosTempTable($idtempelements, $temptable, $idconcepto);
            echo json_encode(array('cod' => 1));
        } else {
            echo json_encode(array('cod' => 3));
        }
    }

    function eliminartodoselementosAction() {
        $idconcepto = $this->_request->getPost('idconcepto');
        $temptable = DatImportarModel::obtenerTablaTemporalDadoIdConcepto($idconcepto);
        if (!empty($temptable)) {
            DatImportarModel::borraDatosTabla($temptable);
            echo json_encode(array('cod' => 1));
        } else {
            echo json_encode(array('cod' => 3));
        }
    }

    function listarEstadosColumnaAction() {
        $idconcepto = $idconcepto = $this->_request->getPost('idconcepto');

        if ($idconcepto) {
            $data = DatImportarModel::getEstadosFilas($idconcepto);
        } else {
            $uri = 'estadoimportar';
            $data = NomDatosnomenclador::getDatosNomPorUriTipoNom($uri);
        }

        //temporal setear estos valores en la IU con l json
        $record = array();
        $record['iddatosnomenclador'] = '-1';
        $record['denominacion'] = '-';
        $record['uridatosnomenclador'] = '-';

        $data[] = $record;

        echo json_encode(array('data' => $data));
    }

    function remplazarValorAction() {
        $array_filtros = json_decode(stripslashes($this->_request->getPost('filtros')));
        $campo = $this->_request->getPost('campo');
        $nuevoval = $this->_request->getPost('nuevoval');
        $idconcepto = $this->_request->getPost('idconcepto');
        $model = new DatImportarModel();
        echo json_encode(array('cod' => $model->replaceValue($idconcepto, $campo, $nuevoval, $array_filtros)));
    }

    function listarFormatosAction() {
        $formatos = $this->integrator->datosmaestros->listarFormatos();
        //Enviar el arreglo de formatos a la interfaz
        echo json_encode(array('data' => $formatos));
    }


}

//fin de la clase GesttipomodeloController
