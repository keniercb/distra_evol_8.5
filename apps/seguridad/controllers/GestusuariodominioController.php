<?php

/**
 * @name GestusuariodominioController - Clase controladora de compartimentacion 
 * de usuarios.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestusuariodominioController extends ZendExt_Controller_Secure
{

    /**
     * @method init() - Constructor de la clase.
     */
    public function init()
    {
        parent::init();
    }

    /**
     * @method gestusuariodominioAction() - Función principal de la clase, 
     * encargada de renderiar la
     * vista correspondiente.
     *
     * @return void
     */
    public function gestusuariodominioAction()
    {
        $this->render();
    }

    /**
     * @method cargarusuariodominioAction - Función usada para listar 
     * los usuarios compartimentados por lotes.
     */
    public function cargarusuariodominioAction()
    {
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $nombreusuario = $this->_request->getPost('denrolbuscado');
        $filtroDominio = $this->global->Perfil->iddominio;
        $idUsuario = $this->global->Perfil->idusuario;

        if ($nombreusuario) {
            $result = array();
            $datosusuario = SegUsuario::cargarusuario(
                $filtroDominio, $idUsuario, $limit, $start
            );
            foreach ($datosusuario as $user){
                $pos = strpos($user['nombreusuario'], $nombreusuario);
                if ($pos !== false) {
                    $result[] = $user;
                }
            }
            echo json_encode(
                array('cantidad_filas' => count($result), 'datos' => $result)
            );

        } else {
            $datosusuario = SegUsuario::cargarusuario(
                $filtroDominio, $idUsuario, $limit, $start
            );
            $cantf = SegUsuario::obtenercantusuarios($filtroDominio, $idUsuario);
            echo json_encode(
                array('cantidad_filas' => $cantf[0]["count"], 'datos' => $datosusuario)
            );
        }
    }

    /**
     * @method cargarArbolDominiosAction - Fnción usada para cargar el árbol 
     * de dominio compartimentado.
     */
    public function cargarArbolDominiosAction()
    {
        $iddominio = $this->_request->getPost('node');
        $idusuario = $this->_request->getPost('idusuario');
        $dominiosUser = SegCompartimentacionusuario::cargardominioUsuario(
            $idusuario
        );
        $arrayDominio = SeguridadECProxy::getInstance()->cargarArbolDominios(
            $iddominio
        );
        $result = self::armarDominio($arrayDominio, $dominiosUser);
        $result = self::eliminarpos($result);
        echo json_encode($result);
    }

    /**
     * @method insertarUsuariosDominiosAction - Función genérica que permite 
     * adicionar y eliminar los permisos que
     * tiene un administrador sobre la información de los usuarios
     * que son registrados en los dominios hijos.
     */
    function insertarUsuariosDominiosAction()
    {
        $idusuario = $this->_request->getPost('idusuario');
        $arrayPadres = json_decode(
            stripslashes($this->_request->getPost('arrayPadres'))
        );
        $arrayPadresEliminar = json_decode(
            stripslashes($this->_request->getPost('arrayPadresEliminar'))
        );
        $arrayDominios = json_decode(
            stripslashes($this->_request->getPost('arrayDominios'))
        );        
        $arrayDominiosEliminar = json_decode(
            stripslashes($this->_request->getPost('arrayDominiosEliminar'))
        );
        $dominiosUser = SegCompartimentacionusuario::cargardominioUsuario(
            $idusuario
        );
        $arrayUsuarioDominio = SegUtil::convertToUnidimensional(
            $dominiosUser, 'iddominio'
        );
        $arrayHijos = array();
        if (count($arrayPadres)) {
            $arrayHijos = SeguridadECProxy::getInstance()
                ->buscarArbolHijosDominio($arrayPadres);
            $arrayHijos = SegUtil::convertToUnidimensional(
                $arrayHijos, 'iddominio'
            );
        }
        $arrayHijosEliminar = array();
        if (count($arrayPadresEliminar)) {
            $arrayHijosEliminar = SeguridadECProxy::getInstance()
                ->buscarArbolHijosDominio($arrayPadresEliminar);
            $arrayHijosEliminar = SegUtil::convertToUnidimensional(
                $arrayHijosEliminar, 'iddominio'
            );
        }
        $arrayDominiosEliminar = array_merge(
            $arrayDominiosEliminar, $arrayHijosEliminar
        );
        $arrayDominioIns = array_merge($arrayDominios, $arrayHijos);
        if (count($arrayUsuarioDominio)) {
            $arrayDominioIns=array_diff($arrayDominioIns, $arrayUsuarioDominio);
        }
        if (count($arrayDominioIns)) {
            foreach ($arrayDominioIns as $dominiosIns) {
                $objUsuarioDominio = new SegCompartimentacionusuario();
                $objUsuarioDominio->idusuario = $idusuario;
                $objUsuarioDominio->iddominio = $dominiosIns;
                $arrayIns[] = $objUsuarioDominio;
            }
        }
        if (count($arrayDominiosEliminar)) {
            foreach ($arrayDominiosEliminar as $dominiosElim) {
                $objUsuarioDominioE = new stdClass();
                $objUsuarioDominioE->idusuario = $idusuario;
                $objUsuarioDominioE->iddominio = $dominiosElim;
                $arrayElim[] = $objUsuarioDominioE;
            }
        }
        if (!count($arrayIns) && !count($arrayElim)) {
            echo "{'bien':3}";
        } else {            
            $model = new SegCompartimentacionusuarioModel();
            if ($model->insertarUsuarioDominio($arrayIns, $arrayElim)) {
                echo "{'bien':1}";
            }
        }
    }

    private static function datosGridUsuarios($datosusuario)
    {
        foreach ($datosusuario as $key => $usuario) {
            $arrayusuario[$key]['idusuario'] = $usuario->idusuario;
            $arrayusuario[$key]['nombreusuario'] = $usuario->nombreusuario;
        }

        return $arrayusuario;
    }

    private static function armarDominio($arrayDominio, $dominiosUser)
    {
        $arrayresult = array();
        foreach ($arrayDominio as $key => $dominio) {
            $arrayresult[] = $dominio;
            foreach ($dominiosUser as $userdominio) {
                if ($dominio['id'] == $userdominio['iddominio']) {
                    $arrayresult[$key]['checked'] = true;
                    break;
                }
            }
        }

        return $arrayresult;
    }

    private static function eliminarpos($array)
    {
        $result = array();
        foreach ($array as $valores) {
            $global = ZendExt_GlobalConcept::getInstance();
            if ($valores['id'] == $global->Perfil->iddominio) {
                unset($valores['checked']);
                $result[] = $valores;
            }
            if (!self::existe($valores['id'], $result)) {
                $result[] = $valores;
            }
        }

        return $result;
    }

    private static function existe($id, $array)
    {
        foreach ($array as $valor) {
            if ($valor['id'] == $id) {
                return true;
            }
        }

        return false;
    }

}
