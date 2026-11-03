<?php

/**
 * @copyright UCID, ERP-CUBA
 */
class CmpimportarController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    private $desarrollo;

    public function init()
    {
        parent::init();
        //Aumentar el Tamaño Máximo al Cargar Archivos
        ini_set("upload_max_filesize", '400M'); //M=MegaByte
        ini_set("post_max_size", '450M'); //M=MegaByte
        ini_set("max_execution_time", 7200); //120 min de conexion 2 hrs
        $this->desarrollo = 1;
    }

    /**
     * Accion para mostrar la vista importar.phtml
     */
    public function cmpimportarAction()
    {
        $this->render();
    }

    public function listarTipoDocumentosAction()
    {
        $nuevo = new NomTipodocumentoimportar();
        $res = $nuevo->listarTipoDocumento();
        echo json_encode(array('data' => $res));
    }

    public function listarAction()
    {
        $params['idconcepto'] = $this->_request->getPost('idconcepto');
        $params['start'] = $this->_request->getPost('start');
        $params['limit'] = $this->_request->getPost('limit');
        $params['filtros'] = $this->_request->getPost('filtros');
        $objdatimportar = new DatImportarModel();
        $res = $objdatimportar->listar($params);
        echo json_encode($res);
    }

    public function listarConceptosAction()
    {
        $objimportar = new DatImportarModel();
        $idconcepto = $this->_request->getPost('idconcepto');
        $res = $objimportar->listarConceptos($idconcepto);
        echo json_encode(array('data' => $res));
    }

    public function getConfigGridAction()
    {
        $idconcepto = $this->_request->getPost('idconcepto');
        $res = DatImportarModel::getConfigGrid($idconcepto);
        echo json_encode($res);
    }

    public function importarficheroAction()
    {
        try {
            $filename = $_FILES['file']['tmp_name'];
            $params['idconcepto'] = $this->_request->getPost('idconcepto');
            $params['file'] = $filename;
            $fileextension = $_FILES['file']['type'];
            $filename = explode('.', $_FILES['file']['name']);

            if ($fileextension == 'application/vnd.ms-excel' || $fileextension == 'application/xls' || $filename[count($filename) - 1] == 'xls'
            ) {
                $objdatimportar = new DatImportarModel();
                $res = $objdatimportar->importarFichero($params);

                echo json_encode($res);
            } else if ($filename[count($filename) - 1] == 'xlsx') {
                echo json_encode(array('cod' => 42));
            } else {
                echo json_encode(array('cod' => 53));
            }
        } catch (Exception $e) {
            if ($this->desarrollo) echo json_encode(array('mensaje' => $e->getMessage()));
            echo json_encode(array('cod' => 54));
        }
    }

    public function listarTipoAccionAction()
    {
        $idconcepto = $this->_request->getPost('idconcepto');
        $nuevo = new NomTipoaccionimportar();
        $result = $nuevo->listarTipoAccionDadoIdConcepto($idconcepto);
        echo json_encode(array('data' => $result));
    }

    public function listarTipoDocAction()
    {
        $idestructura = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;
        $objdatimportar = new DatImportarModel();
        $result = $objdatimportar->listarTipoDoc($idestructura);
        echo json_encode(array('data' => $result));
    }

    public function listarOperacionAction()
    {
        $idtipodoc = $this->_request->getPost('idtipodoc');
        $objdatimportar = new DatImportarModel();
        $result = $objdatimportar->obtenerIdOperacionTipoDoc($idtipodoc);
        echo json_encode(array('data' => $result));
    }

    public function realizaracciondatosimportadosAction()
    {
        try {
            ini_set("max_execution_time", 14400); //240 min de conexion 4 hrs
            $parametros->idconf = $this->_request->getPost('idconfiguracion');
            $parametros->idaccion = $this->_request->getPost('idaccion');
            $parametros->idconcepto = $this->_request->getPost('idconcepto');
            $parametros->idproducto = $this->_request->getPost('idproducto');
            $parametros->filtros = json_decode(
                stripslashes($this->_request->getPost('filtros'))
            );
            $parametros->colsChecked = json_decode(
                stripslashes($this->_request->getPost('cols_checked'))
            );
            $parametros->iddoc = $this->_request->getPost('iddoc');
            $parametros->idusuario = $this->global->Perfil->idusuario;
            $datimportar = new DatImportarModel();
            $resp = $datimportar->realizarAccion($parametros);

            if (is_array($resp)) {
                echo json_encode(array('cod' => 3, 'tipo' => $resp['error']));
            } else if ($resp . 'f' == 'vaciof') {
                echo json_encode(
                    array('cod' => 'vacio', 'idtipoaccion' => $parametros->idaccion)
                );
            } else {
                echo json_encode(array('cod' => $resp, 'idtipoaccion' => $parametros->idaccion));
            }
        } catch (Doctrine_Exception $e) {
            echo json_encode(array('cod' => 2, 'idtipoaccion' => $parametros->idaccion));
        }
    }

    public function exportartemptableAction()
    {
        $config = json_decode($this->_request->getParam('config'));

        $idconcepto = $config->idconfiguracion;
        $importarmodel = new DatImportarModel();
        $cols = $importarmodel->obtenerColumnasDadoIdConcepto(
            $idconcepto
        );
        $tablatemp = (isset($cols[0])) ? $cols[0]['DatConfiguracionimportar']['tablatemporal'] : null;
        $datos = $importarmodel->listarDadoTempTable($tablatemp);
        $cuerporeporte = $importarmodel->exportarTempTable($cols, $datos);
        echo json_encode($cuerporeporte);

    }

    public function exportarerrortemptableAction()
    {
        $config = json_decode($this->_request->getParam('config'));
        $idconcepto = $config->idconfiguracion;
        $importarmodel = new DatImportarModel();
        $reporte = $importarmodel->exportarErroresTempTable($idconcepto);
        echo json_encode(array('cod' => $reporte['cod'], 'titulo' => $reporte['titulo']));
    }

    public function eliminarelementostemptableAction()
    {
        ini_set("max_execution_time", 14400); //240 min de conexion 4 hrs
        $idtempelements = json_decode(
            stripslashes($this->_request->getPost('idtempelements'))
        );
        $idconcepto = $this->_request->getPost('idconcepto');
        $temptable = DatImportarModel::obtenerTablaTemporalDadoIdConcepto(
            $idconcepto
        );
        if (!empty($temptable)) {
            DatImportarModel::eliminarDatosTempTable(
                $idtempelements, $temptable
            );
            echo json_encode(array('cod' => 1));
        } else {
            echo json_encode(array('cod' => 3));
        }
    }

    public function eliminartodoselementosAction()
    {
        $idconcepto = $this->_request->getPost('idconcepto');
        $temptable = DatImportarModel::obtenerTablaTemporalDadoIdConcepto(
            $idconcepto
        );
        if (!empty($temptable)) {
            DatImportarModel::borraDatosTabla($temptable);
            echo json_encode(array('cod' => 1));
        } else {
            echo json_encode(array('cod' => 3));
        }
    }

    public function listarEstadosColumnaAction()
    {
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

    public function remplazarValorAction()
    {
        $arrayFiltros = json_decode(
            stripslashes($this->_request->getPost('filtros'))
        );
        $campo = $this->_request->getPost('campo');
        $nuevoval = $this->_request->getPost('nuevoval');
        $idconcepto = $this->_request->getPost('idconcepto');
        $model = new DatImportarModel();
        echo json_encode(
            array('cod' => $model->replaceValue(
                $idconcepto, $campo, $nuevoval, $arrayFiltros
            ))
        );
    }

    public function listarFormatosAction()
    {
        $formatos = $this->integrator->datosmaestros->listarFormatos();
        //Enviar el arreglo de formatos a la interfaz
        echo json_encode(array('data' => $formatos));
    }


}
