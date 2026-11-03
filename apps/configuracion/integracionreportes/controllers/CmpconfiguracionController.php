<?php

/**
 * @copyright UCID, ERP-CUBA
 */
class CmpconfiguracionController extends ZendExt_Controller_Secure
{

    /**
     * Inicializar los atributos de la clase
     */
    private $model;

    public function __construct(Zend_Controller_Request_Abstract $request, Zend_Controller_Response_Abstract $response, array $invokeArgs = array())
    {
        parent::__construct($request, $response, $invokeArgs);
        $this->model = new NomConfiguracionReporteModel();
    }

    function init()
    {
        parent::init();
    }

    /**
     * Accion para mostrar la vista importar.phtml
     */
    function cmpconfiguracionAction()
    {
        $this->render();
    }

    function listarConfiguracionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $start = $this->_request->getPost('start');
        $parametros['start'] = (empty($start) || !is_numeric($start)) ? 0 : $start;
        $limit = $this->_request->getPost('limit');
        $parametros['limit'] = empty($limit) ? 100 : $limit;

        $res = $this->model->listarConfiguracion($parametros);
        if (isset($res['data'][0])) echo json_encode($res);
        else echo json_encode(array('total' => 0, 'data' => array()));
    }

    function adicionarConfiguracionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idusuario'] = $this->global->Perfil->idusuario;
        $denelemento = $this->_request->getPost('tfdenominacion');
        $parametros['denconfiguracion'] = str_ireplace('"', "'", $denelemento);
        $parametros['urlservidor'] = $this->_request->getPost('tfurlservidor');
        $parametros['usuario'] = $this->_request->getPost('tfusuario');
        $parametros['apikey'] = $this->_request->getPost('tfapikey');
        $parametros['usuariors'] = $this->_request->getPost('tfusuariors');
        $parametros['pwd'] = $this->_request->getPost('tfpwd');
        $parametros['idsso'] = $this->_request->getPost('tfidsso');
        $autenticarapikey = $this->_request->getPost('fsapikey-checkbox');
        $parametros['autenticarapikey'] = ($autenticarapikey == 'on') ? 1 : 0;
        if (!$parametros['autenticarapikey']) {
            $dirCerts = substr(
                    $_SERVER['DOCUMENT_ROOT'],
                    0,
                    strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
                ) . 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR
                . 'auth' . DIRECTORY_SEPARATOR;
            $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
            $parametros['pwd'] = $rsa
                ->decrypt($parametros['pwd']);
        }
        $result = $this->model->adicionarConfiguracion($parametros);
        echo json_encode(array('mensaje' => $result));
    }

    function modificarConfiguracionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $parametros['idusuario'] = $this->global->Perfil->idusuario;
        $denelemento = $this->_request->getPost('tfdenominacion');
        $parametros['denconfiguracion'] = str_ireplace('"', "'", $denelemento);
        $parametros['urlservidor'] = $this->_request->getPost('tfurlservidor');
        $parametros['usuario'] = $this->_request->getPost('tfusuario');
        $parametros['apikey'] = $this->_request->getPost('tfapikey');
        $parametros['idconfiguracion'] = $this->_request->getPost('idconfiguracion');
        $parametros['usuariors'] = $this->_request->getPost('tfusuariors');
        $parametros['pwd'] = $this->_request->getPost('tfpwd');
        $parametros['idsso'] = $this->_request->getPost('tfidsso');
        $autenticarapikey = $this->_request->getPost('fsapikey-checkbox');
        $parametros['autenticarapikey'] = ($autenticarapikey == 'on') ? 1 : 0;
        if (!$parametros['autenticarapikey']) {
            $dirCerts = substr(
                    $_SERVER['DOCUMENT_ROOT'],
                    0,
                    strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
                ) . 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR
                . 'auth' . DIRECTORY_SEPARATOR;
            $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
            $parametros['pwd'] = $rsa
                ->decrypt($parametros['pwd']);
        }
        $result = $this->model->modificarConfiguracion($parametros);
        echo json_encode(array('mensaje' => $result));
    }

    function eliminarConfiguracionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariocrea = $this->global->Perfil->idusuario;
        $arrayidconfiguracion = json_decode(
            stripslashes($this->_request->getPost('arrayidconfiguracion'))
        );

        $result = $this->model->eliminarConfiguracion($arrayidconfiguracion);
        echo json_encode(array('mensaje' => $result));
    }

    function cargarFormularioConfiguracionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $result = $this->model->obtenerConfiguracionDadoId($idconfiguracion);
        if (is_array($result)) {
            $data = array(
                'idconfiguracion' => $result['idconfiguracion'],
                'denconfiguracion' => $result['denconfiguracion'],
                'usuario' => $result['usuario'],
                'apikey' => $result['apikey'],
                'urlservidor' => $result['urlservidor'],
                'idsso' => $result['idsso'],
                'autenticarapikey' => $result['autenticarapikey'],
                'usuariors' => $result['usuariors']
            );
            if (!empty($result['autenticarapikey'])) {
                $dirCerts = substr(
                        $_SERVER['DOCUMENT_ROOT'],
                        0,
                        strrpos($_SERVER['DOCUMENT_ROOT'], 'web')
                    ) . 'config' . DIRECTORY_SEPARATOR . 'certs' . DIRECTORY_SEPARATOR
                    . 'auth' . DIRECTORY_SEPARATOR;
                $rsa = new ZendExt_Crypt_Rsa(new ZendExt_Crypt_Rsa_Config($dirCerts));
                $data['contrasenna'] = $rsa
                    ->encrypt($result['contrasenna']);
            }
            $dat[] = $data;
            echo json_encode(array('data' => $dat, 'mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => $result));
        }
    }


}
