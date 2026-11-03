<?php

/**
 * FirmaDigitalModel
 *
 * @author  Ing.Rodain Terrer Molina
 * @version 1.0
 */

$dir = $_SERVER ['DOCUMENT_ROOT'];
$apps = str_replace('/web', '/', $dir);
require_once($apps . 'apps/configuracion/firmadigital/services/PmRestService.php');

class FirmaDigitalModel extends ZendExt_Model
{
    private $serverName;
    private $workspace;
    private $clientId;
    private $secretKey;
    private $file;
    private $token;
    private $config;

    private $caseId;

    function __construct()
    {
        parent::ZendExt_Model();
        $APPNAME = realpath(dirname(__FILE__)) . '/';
        $this->file = realpath($APPNAME . '../../../comun/server_config.ini');

        //Direccion del fichero de configuracion
        if (file_exists($this->file)) {
            $this->config = parse_ini_file($this->file, true);
            $processmaker = $this->config['processmarker'];
            $this->serverName = $processmaker['serverName'];
            $this->workspace = $processmaker['workspace'];
            $this->clientId = $processmaker['clientId'];
            $this->secretKey = $processmaker['secretKey'];
        } else{
            throw new Exception('El fichero de configuracion no existe');
        }
    }

    /**
     * Instancia para garantizar el acceso singleton a la clase
     *
     * @var FirmaDigitalModel
     */
    private static $instance = null;

    /**
     * Metodo que devuelve una nueva instancia de la clase
     *
     * @return FirmaDigitalModel Instancia singleton
     */
    public static function getInstance() {
        if (null === self::$instance) {
            self::$instance = new FirmaDigitalModel();
        }
        return self::$instance;
    }

    public function getConfigProcessMarker($name)
    {
        return $this->config['processmaker'][$name];
    }
    public function getConfigFirmaRevision($name)
    {
        return $this->config['Firmar y archivar documentos digitales'][$name];
    }

    public function getProcessValue($process,$name)
    {
        return $this->config[$process][$name];
    }

    public function getConfigEmision($name)
    {
        return $this->config['Emisión, visto bueno y archivo de documentación digital'][$name];
    }

    public function getConfigFirmaEvaluacion($name)
    {
        return $this->config['Firmar Evaluacion de Desempeño'][$name];
    }
    


    public function getServerName()
    {
        return $this->serverName;
    }
    public function getWorkspace()
    {
        return $this->workspace;
    }


    public function getDataFile()
    {
        return file_get_contents($this->file);
    }

    public function saveFile($code)
    {
        if (file_exists($this->file)) {
            file_put_contents($this->file, $code);
            return true;
        }
    }

    public function login()
    {

        $rsa = new ZendExt_RSA_Facade();
        $user = $_SESSION['Quarseg']['SP']['authData'];
        $usuario = $user['usuario'];
        $pass = $rsa->decrypt($user['passw']);
        //print_r([$usuario,$pass,$this->serverName]);die;
        //generar el toquen
        $response = PmRestService::login(
            $this->serverName,   //repositorio de tramite pal login
            $this->workspace,         //workspace
            $this->clientId,    //fijo
            $this->secretKey,    //fijo
            $usuario,// "admin",
            $pass // "admin1"
        );
        $response = is_array($response) ? $response : (array) $response;
        if(isset($response['success']) && !$response['success']){
//            print_r($response);
        //    throw new Exception('Error en la autenticacion:'.$response['description']);
            throw new Exception('Error en la autenticacion:');
            return false;
        }
        $this->token = $response;
        return true;
    }


    public function crearCaso($proceso,$variables)
    {

        $response = PmRestService::request(
            $this->serverName,
            'POST',
            '/api/1.0/' . $this->workspace . '/cases',
            array(
                'pro_uid' => $this->getProcessValue($proceso,'pro_uid'),//$this->getConfigFirmaRevision('pro_uid'),
                'tas_uid' => $this->getProcessValue($proceso,'tas_uid'),
                'variables' => array($variables)
            ),
            $this->token['access_token']
        );
        $response = is_array($response) ? $response : (array) $response;
        if(isset($response['success']) && !$response['success']){
            throw new Exception('Error en inicializar caso.');
            return false;
        }
        $this->caseId = $response['app_uid'];

        if(!$this->caseId){
            throw new Exception('Error en inicializar caso.');
            return false;
        }
        return true;
    }  

    /*$docs = array(
        array(
         name => '',
         path => 'path'
        )
    )*/
    public function subirDocumento($proceso,$docs)
    {
        $flag = false;
        foreach ($docs as $doc) {
            if(!file_exists($doc['path'])){
                $flag = false;
                throw new Exception("El documento con direccion {$doc['path']} no existe");
                break;
            }


            //subir el documento y mostrar documento
            $response = PmRestService::request(
                $this->serverName,
                'POST_FORM',
                '/api/1.0/' . $this->workspace . '/plugin-Rest/' . $this->caseId
               . '/input-document',

                /*array(
                    'inp_doc_uid' => $this->getProcessValue($proceso,'inputDocId'),
                    'doc_name' => $doc['name'],
                    'field_type' => "multipleFile",      //con multifile es para varios documentos
                    'case_var_name' => $this->getProcessValue($proceso,'case_var_name'),
                    //'case_var_name' => "doc_firmar_multiple", //variable del formulario
                    'doc_comment' => "comentario",
                    'form' => (phpversion() >= "5.5") ? new \CurlFile($doc['path']) : '@' . $doc['path']
                )*/array(
                    'inpDocUid' => $this->getProcessValue($proceso,'inputDocId'),
                    'docName' => $doc['name'],
                    'fieldType' => "multipleFile",      //con multifile es para varios documentos
                    'caseVarName' => $this->getProcessValue($proceso,'case_var_name'),
                    //'case_var_name' => "doc_firmar_multiple", //variable del formulario
                    'docComment' => "comentario",
                    'form' => (phpversion() >= "5.5") ? new \CurlFile($doc['path']) : '@' . $doc['path']
                ),
                $this->token['access_token']
            );
            $response = is_array($response) ? $response : (array) $response;
            if(isset($response['success']) && !$response['success']){
                throw new Exception('Error al adicionar documento.');
                $flag = false;
                break;
            }
            $flag = true;
        }
        return array(
            'success' => $flag,
            'caseId' => $this->caseId,
            'url' => $this->serverName . '/sys' . $this->workspace . '/es-ES/xetid/cases/opencase/'. $this->caseId
        );
    }


    public function firmaDigital($proceso,$variables,$documentos){
        //generar el toquen
        try {
            $flag = $this->login();
            //print_r('Step Login: ok');
            $flag = $this->crearCaso($proceso,$variables);
            //print_r('Step CrearCaso: ok');die;
            $response = $this->subirDocumento($proceso,$documentos);
            return $response;
        } catch (Exception $e){
            throw $e;
        }
    }

    public function listarDocumentosPorCaso($caseId){
        $caseId = $caseId ? $caseId : $this->caseId;
        try {
            $flag = $this->login();
            $response = PmRestService::request(
                $this->serverName,
                'GET',
                '/api/1.0/' . $this->workspace . '/cases/'. $caseId .'/input-documents',
                null,
                $this->token['access_token']
            );
           // print_r($response);die;
            if(isset($response['success']) && !$response['success']){
                throw new Exception('Error al listar los documentos del caso.');
            }
            return array(
                'success' => true,
                'serverName' => $this->getServerName(),
                'workspace' => $this->getWorkspace(),
                'data' => $response
            );
        } catch (Exception $e){
            throw $e;
        }
    }

    public function mostrarCaso($caseId = null){
        $caseId = $caseId ? $caseId : $this->caseId;
        $flag = $this->login();
        $response = PmRestService::request(
            $this->serverName,
            'GET',
            '/api/1.0/' . $this->workspace . '/cases/'. $caseId,
            null,
            $this->token['access_token']
        );
        $response = is_array($response) ? $response : (array) $response;
        if(isset($response['success']) && !$response['success']){
            throw new Exception('Error al mostrar el caso.');
            return false;
        }
        $response['url'] = $this->serverName . '/sys' . $this->workspace . '/es-ES/xetid/cases/opencase/'. $caseId;
        //print_r($response);die;
        return $response;
    }

    public function descargarDocumentos($params){
        try{
            $response = $this->login();
        } catch (Exception $e){
            $response = array(
                'success' => false,
                'mensajes' => $e->getMessage()
            );
            return $response;
        }
        $response = PmRestService::request(
            $this->serverName,
            'GET',
            '/api/1.0/' . $this->workspace . '/cases/' . $params['caseId'] . '/input-document/' . $params['app_doc_uid'] . '/file?v=' . $params['version'],
            null,
            $this->token['access_token']
        );
       // print_r($response);die;
        if($response && is_object($response)) {
            if (isset($response['success']) && !$response['success']) {
                throw new Exception('Error al descargar el documento del caso.');
                return false;
            }
            return $response;
        } else{
            header('Cache-Control: must-revalidate');
            header('Pragma: public');
            header('Content-Description: File Transfer');
            header('Content-Disposition: attachment; filename='.$params['app_doc_filename'] . ".pdf");
            header('Content-Transfer-Encoding: binary');
            header('Content-Length: ' . strlen($response));
            header ('Content-Type: application/pdf; charset=utf-8');
            echo $response;
        }
    }


}
