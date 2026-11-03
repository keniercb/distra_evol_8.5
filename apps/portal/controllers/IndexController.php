<?php

class IndexController extends ZendExt_Controller_Secure
{

    public function init()
    {
        $this->model = new PortalModel();
        parent::init();
    }

    public function cargardominioAction()
    {
        $security = ZendExt_Aspect_Security_Sgis::getInstance();
        $idestructuracomun = $this->_request->getPost('node');
        $dominios = $security->getDomain($idestructuracomun);
        if (count($dominios)) {
            echo json_encode($dominios);
        } else {
            echo json_encode(array());
        }
    }

    public function entraralsistemaAction()
    {
        $register = Zend_Registry::getInstance();
        $tipoacceso = $this->_request->getPost('tipoacceso');

        if ($tipoacceso == 'nuevo' /*&& !$register->session->close*/) {
            $register->session->close = true;
            //header("Location:/seguridad/index.php/serviceprovider/index");
            echo json_encode(array('reload' => false));
        } else {
            $_SERVER['HTTP_X_REQUESTED_WITH'] = 1;
            $identidad = $this->_request->getPost('dominio');
            $integrator = ZendExt_IoC::getInstance();
            $rolEntidad = $integrator->seguridad->VerificarAccesoEntidadRol(
                $register->session->certificado,
                $identidad
            );
            $idrol = $rolEntidad['idrol'];
            if (!$idrol) {
                throw new ZendExt_Exception('EP009');
            }
            if (!isset($register->session->entidad) || $identidad != $register->session->entidad->idestructura
            ) {
                $estructura = PortalECProxy::getInstance()
                    ->DameEstructura(
                        $identidad
                    );
                $register->session->entidad = $estructura[0];
                $register->session->idestructura = $identidad;
                $register->session->idrol = $idrol;
                $register->session->perfil['idrol'] = $idrol;
                $register->session->perfil['identidad'] = $rolEntidad['identidad'];
            }
            echo json_encode(array('reload' => true));
        }
    }

    protected function getUsuario()
    {
        $registro = Zend_Registry::getInstance();
        $alias = $registro->session->usuario;
        $usuario = $this->model->buscarUsuarioByAlias($alias);
        if ($usuario) {
            $usrArray = $usuario->toArray();
            $registro->session->perfil = $usrArray[0];

            return $usrArray[0];
        } else {
            throw new ZendExt_Exception('EP001');
        }
    }

    public function indexAction()
    {
        $perfil = $this->getPerfil();
        if ($perfil->caduca == 0) {
            $this->view->usuario = $perfil->usuario;
            $this->render('cambiarpassword');
        } elseif ($perfil->tema) {
            $identidad = $this->global->Perfil->accesodirecto;
            $this->view->accesodirecto = $identidad;
            $integrator = ZendExt_IoC::getInstance();
            $register = Zend_Registry::getInstance();
            if ($identidad != 0) {
                $rolEntidad = $integrator->seguridad->VerificarAccesoEntidadRol(
                    $register->session->certificado,
                    $identidad
                );
                $idrol = $rolEntidad['idrol'];
                if (!$rolEntidad['identidad']) {
                    $htmlLinkToLogout = "<br><br><a href='/seguridad/index.php/serviceprovider/logout'>Salir</a>";
                    throw new ZendExt_Exception('EP010',null,array( 0 => $htmlLinkToLogout));
                }
                if (!isset($register->session->entidad) || $identidad != $register->session->entidad->idestructura
                ) {
                    $estructura = PortalECProxy::getInstance()
                        ->DameEstructura(
                            $identidad
                        );
                    $register->session->entidad = $estructura[0];
                    $register->session->idestructura = $identidad;
                    $register->session->idrol = $idrol;
                    $register->session->perfil['idrol'] = $idrol;
                    $register->session->perfil['identidad'] = $rolEntidad['identidad'];
                }
            } else {
                $roles = $integrator->seguridad->LoadUserRoles(
                    $register->session->certificado
                );
                if (!count($roles)) {
                    throw new ZendExt_Exception('EP010');
                }
            }
            $this->render();
        } else {
            throw new ZendExt_Exception('EP002');
        }
    }

    /**
     * @author Darien García Tejo.
     * @method nuevopasswordAction - Función usada para cambiar el password del
     * usuario.
     * @return json | ZendExt_Exception - Satisfactorio o una
     * excepción controlada.
     */
    public function nuevopasswordAction()
    {
        $result = $this->integrator->seguridad->CambiarContrasenna(
            $this->global->Perfil->usuario, $this->_request->getPost('oldpass'), $this->_request->getPost('contrasenap')
        );
        if ($result) {
            $register = Zend_Registry::getInstance();
            $register->session->perfil['caduca'] = $result;
            echo '{success: true}';
        } else {
            throw new ZendExt_Exception('SEGPASS01');
        }
    }

    public function closeportalAction()
    {
        $registro = Zend_Registry::getInstance();
        $registro->session->close = true;
        echo json_encode(array('close' => true));
    }

    public function asociarcertificadoAction() {
        $utils = new ZendExt_OpenSSLUtils();
        $cert = $this->_request->getPost('cert');
        $usuario = $utils->SubjectFromX509($cert);
        $idusuario = $this->integrator->seguridad->obtenerIdUsuarioDadoNombre($usuario);
        $idusuarioactual = $this->global->perfil->idusuario;
        $usuarioactual = $this->global->perfil->usuario;

        if($idusuario == $idusuarioactual){
            $ski = $utils->SkiFromX509($cert);
            $this->integrator->seguridad->AsociarUsuarioCertificado($ski, $idusuario);
            echo json_encode(array("success" => 1, "msg" => "Certificado asociado al usuario ".$usuarioactual." correctamente."));
        } else {
            echo json_encode(array("success" => 0, "msg" => "Certificado incorrecto para el usuario ".$usuarioactual."."));
        }
    }
    public function obtenerModoInicioAction()
    {

        try{
            $usuario = $this->global->Perfil->idusuario;
            $resultado= NomDesktopModel::obtenerModoInicio($usuario);
            echo json_encode($resultado);
            return $resultado;
        }
        catch (Exception $e){
            print_r($e->getMessage());
        }


    }

}
