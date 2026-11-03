<?php

/**
 * @name GestroldominioController - Clase controladora de 
 * compartimentacion de Roles.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestroldominioController extends SeguridadController
{

    function init()
    {
        parent::init();
    }

    function gestroldominioAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    function cargarRolDominioAction()
    {
        $start = $this->_request->getPost("start");
        $limit = $this->_request->getPost("limit");
        $denominacion = $this->_request->getPost("denrolbuscado");
        $filtroDominio = $this->global->Perfil->iddominio;
        $type = 'false';
        if ($denominacion) {
            $arrayroles = SegRol::obtenerrolBuscado(
                $filtroDominio, $denominacion, $limit, $start, $type
            );
            $cantrol = SegRol::cantrolBuscados(
                $denominacion, $filtroDominio, $type
            );
        } else {
            $arrayroles = SegRol::obtenerrol(
                $filtroDominio, $limit, $start, $type
            );
            $cantrol = SegRol::cantrol($filtroDominio, $type);
        }
        echo json_encode(
            array('cantidad_filas' => $cantrol, 'datos' => $arrayroles)
        );
    }

    function cargarArbolDominiosAction()
    {
        $iddominio = $this->_request->getPost('node');
        $idrol = $this->_request->getPost('idrol');
        $dominiosRoles = SegCompartimentacionroles::cargardominioRoles($idrol);
        $arrayDominio = SeguridadECProxy::getInstance()
            ->cargarArbolDominios($iddominio);
        $resultado = $this->armarDominio($arrayDominio, $dominiosRoles);
        $result = $this->eliminarpos($resultado);
        echo json_encode($result);

        return;
    }

    function armarDominio($arrayDominio, $dominiosRoles)
    {
        $arrayresult = array();
        foreach ($arrayDominio as $key => $dominio) {
            $arrayresult[] = $dominio;
            foreach ($dominiosRoles as $roldominio) {
                if ($dominio['id'] == $roldominio['iddominio']) {
                    $arrayresult[$key]['checked'] = true;
                    break;
                }
            }
        }

        return $arrayresult;
    }

    function eliminarpos($array)
    {
        $result = array();
        foreach ($array as $valores) {
            if ($valores['id'] == $this->global->Perfil->iddominio) {
                unset($valores['checked']);
                $result[] = $valores;
            }
            if (!$this->existe($valores['id'], $result)) {
                $result[] = $valores;
            }
        }

        return $result;
    }

    function existe($id, $array)
    {
        foreach ($array as $valor) {
            if ($valor['id'] == $id) {
                return true;
            }
        }

        return false;
    }

    function insertarRolesDominiosAction()
    {
        $idrol = $this->_request->getPost('idrol');
        $arrayPadres = json_decode(
            stripslashes($this->_request->getPost('arrayPadres'))
        );
        //array de nodos desmarcados sin desplegar
        $arrayPadresEliminar = json_decode(
            stripslashes($this->_request->getPost('arrayPadresEliminar'))
        );
        //estructura chekeadas
        $arrayDominios = json_decode(
            stripslashes($this->_request->getPost('arrayDominios'))
        );
        //estructuras a eliminar ke son las ke se deschekearon
        $arrayDominiosEliminar = json_decode(
            stripslashes($this->_request->getPost('arrayDominiosEliminar'))
        );
        $dominiosRol = SegCompartimentacionroles::cargardominioRoles($idrol);
        $arrayRolesDominio = $this
            ->arregloBidimensionalToUnidimensional($dominiosRol);
        $arrayHijos = array();
        if (count($arrayPadres)) {
            $arrayHijos = SeguridadECProxy::getInstance()
                ->buscarArbolHijosDominio($arrayPadres);
            $arrayHijos = $this->arregloBidimensionalToUnidimensional(
                $arrayHijos
            );
        }
        $arrayHijosEliminar = array();
        if (count($arrayPadresEliminar)) {
            $arrayHijosEliminar = SeguridadECProxy::getInstance()
                ->buscarArbolHijosDominio($arrayPadresEliminar);
            $arrayHijosEliminar = $this->arregloBidimensionalToUnidimensional(
                $arrayHijosEliminar
            );
        }
        $arrayDominiosEliminar = array_merge(
            $arrayDominiosEliminar, $arrayHijosEliminar
        );
        $arrayDominioIns = array_merge($arrayDominios, $arrayHijos);
        if (count($arrayRolesDominio)) {
            $arrayDominioIns = array_diff($arrayDominioIns, $arrayRolesDominio);
        }
        if (count($arrayDominioIns)) {
            foreach ($arrayDominioIns as $dominiosIns) {
                $objRolesDominio = new SegCompartimentacionroles();
                $objRolesDominio->idrol = $idrol;
                $objRolesDominio->iddominio = $dominiosIns;
                $arrayIns[] = $objRolesDominio;
            }
        }
        if (count($arrayDominiosEliminar)) {
            foreach ($arrayDominiosEliminar as $dominiosElim) {
                $objRolesDominioE = new stdClass();
                $objRolesDominioE->idrol = $idrol;
                $objRolesDominioE->iddominio = $dominiosElim;
                $arrayElim[] = $objRolesDominioE;
            }
        }
        if (!count($arrayIns) && !count($arrayElim)) {
            echo "{'bien':3}";
        } else {
            //No se hace nada
            $model = new SegCompartimentacionrolesModel();
            if ($model->insertarRolesDominio($arrayIns, $arrayElim)) {
                echo "{'bien':1}";
            }
        }
    }

    function arregloBidimensionalToUnidimensional($arrayDominios)
    {
        $array = array();
        foreach ($arrayDominios as $dominios) {
            $array[] = $dominios['iddominio'];
        }

        return $array;
    }

}
