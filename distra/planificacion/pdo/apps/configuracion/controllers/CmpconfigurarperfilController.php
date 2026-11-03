<?php

/**
 * Controlador para configurar perfil del planificador
 *
 */
class CmpconfigurarperfilController extends ZendExt_Controller_Secure {

    /**
     * Inicializar los atributos de la clase
     *
     */
    function init() {
        parent::init();
    }

    /**
     * Accion para mostrar la vista cmpconfigurarperfil.phtml
     * configurarperfil
     */
    function cmpconfigurarperfilAction() {
        //$jsayuda = $this->integrator->ayuda->devolverJS();
        //$this->view->jsayuda = $jsayuda;
        $this->render();
    }

    function cargarcmbestadosAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        //$idtipodoc = 3; //$this->_request->getPost('idtipodoc');
        $arrayestadosverdoc = $this->pIntegrator->workflow->EstadosVerDoc(
                $idusuariosession
        );
        echo json_encode(array('data' => $arrayestadosverdoc));
    }

    public function cargarCmbVistaCalendarioAction() {
        $arrayvistacalendario = NomVistacalendario::obtenerVistaCalendario();
        echo json_encode(array('data' => $arrayvistacalendario));
    }

    public function adicionarConfCalendarioAction() {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->idconfiguracionperfil = $this->_request->getPost(
                'idconfiguracion'
        );
        if ($this->_request->getPost('cateactividad') == 'ninguno') {
            $parametros->cateactividad = null;
        } else {
            $parametros->cateactividad = $this->_request->getPost(
                    'cateactividad'
            );
        }
        if ($this->_request->getPost('tipoactividad') == 'ninguno') {
            $parametros->tipoactividad = null;
        } else {
            $parametros->tipoactividad = $this->_request->getPost(
                    'tipoactividad'
            );
        }
        if ($this->_request->getPost('vista') == 'ninguno') {
            $parametros->vista = null;
        } else {
            $parametros->vista = $this->_request->getPost('vista');
        }
        $parametros->actual = $this->_request->getPost('actual');
        $parametros->denominacion = $this->_request->getPost('denominacion');

        if ($this->_request->getPost('estadoaprob') == 'ninguno') {
            $parametros->estadoaprob = null;
        } else {
            $parametros->estadoaprob = $this->_request->getPost('estadoaprob');
        }
        $parametros->descripcion = $this->_request->getPost('descripcion');
        if ($this->_request->getPost('estadocumpl') == 0) {
            $parametros->estadocump = null;
        } else {
            $parametros->estadocump = $this->_request->getPost('estadocumpl');
        }
        $parametros->usuariosinv = json_decode(
                stripslashes($this->_request->getPost('usuariosinv'))
        );
        $parametros->usuarioseliminar = json_decode(
                stripslashes(
                        $this->_request->getPost('usuarioseliminar')
                )
        );
        $parametros->porcientocump = $this->_request->getPost('porcientocumpl');
        $parametros->igual = $this->_request->getPost('igual');
        $parametros->mayor = $this->_request->getPost('mayor');
        $parametros->menor = $this->_request->getPost('menor');
        $parametros->accion = $this->_request->getPost('accion');
        $obj = new CmpconfigurarperfilModel();
        $resp = $obj->adicionarPerfilCalendario($parametros);
        echo json_encode(array('mensaje' => $resp));
    }

    public function adicionarConfComportamientoAction() {
        $parametros->denominacion = $this->_request->getPost('denominacion');
        $parametros->idconfiguracionperfil = $this->_request->getPost(
                'idconfiguracion'
        );
        $parametros->tipoelemento = json_decode(
                stripslashes($this->_request->getPost('tipoelemento'))
        );
        $parametros->tipoelementodelete = json_decode(
                stripslashes($this->_request->getPost('tipoelementodelete'))
        );
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->usuariosinv = json_decode(
                stripslashes($this->_request->getPost('usuariosinv'))
        );

        $parametros->usuarioseliminar = json_decode(
                stripslashes(
                        $this->_request->getPost('usuarioseliminar')
                )
        );
        $parametros->descripcion = $this->_request->getPost('descripcion');
        $parametros->actual = $this->_request->getPost('actual');
        $parametros->accion = $this->_request->getPost('accion');
        $obj = new CmpconfigurarperfilModel();
        $resp = $obj->adicionarPerfilComportamiento($parametros);
        echo json_encode(array('mensaje' => $resp));
    }

    public function adicionarConfCargaxDefectoAction() {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->idconfiguracionperfil = $this->_request->getPost(
                'idconfiguracion'
        );
        $parametros->actual = $this->_request->getPost('actual');
        $parametros->fechainicio = $this->_request->getPost('fechainicio');
        $parametros->fechafin = $this->_request->getPost('fechafin');
        $parametros->denominacion = $this->_request->getPost('denominacion');
        $parametros->descripcion = $this->_request->getPost('descripcion');
        $parametros->estadoaprob = $this->_request->getPost('estadoaprob');
        $parametros->estadocump = $this->_request->getPost('estadocumpl');
        $parametros->tipoelemento = json_decode(
                stripslashes($this->_request->getPost('tipoelemento'))
        );
        $parametros->tipoelementodelete = json_decode(
                stripslashes($this->_request->getPost('tipoelementodelete'))
        );
        $parametros->porcientocump = $this->_request->getPost('porcientocumpl');
        $parametros->igual = $this->_request->getPost('igual');
        $parametros->mayor = $this->_request->getPost('mayor');
        $parametros->menor = $this->_request->getPost('menor');
        $parametros->accion = $this->_request->getPost('accion');
        $obj = new CmpconfigurarperfilModel();
        $resp = $obj->adicionarPerfilCargaxDefecto($parametros);
        echo json_encode(array('mensaje' => $resp));
    }

    public function modificarConfCargaxDefectoAction() {
        $parametros->idconfiguracionperfil = $this->_request->getPost(
                'idconfiguracion'
        );
        $objconf = ConfPerfil::obtenerConfById(
                        $parametros->idconfiguracionperfil
        );
        if ($objconf['idcomparacion'] != null) {
            $comparaciones = NomComparacion::getByid($objconf['idcomparacion']);
            if (isset($comparaciones['idcomparacion'])) {
                $objconf['igual'] = $comparaciones['igual'];
                $objconf['mayor'] = $comparaciones['mayor'];
                $objconf['menor'] = $comparaciones['menor'];
            }
        }
        $tipoelementos
                = ConfPerfilcargasxdefecto::getTipoelementosdadoidconfperfil(
                        $parametros->idconfiguracionperfil
        );
        $denoestadoaprob = $this->pIntegrator->workflow->DenomEstado(
                $objconf['estadoaprobacion']
        );
        $objconf['denoestadoaprob'] = $denoestadoaprob[0]->denominacion;
        echo json_encode(
                array(
                    'mensaje' => 1,
                    'confperfil' => $objconf,
                    'confvalida' => $tipoelementos)
        );
    }

    public function modificarConfComportamientoAction() {
        $parametros->idconfiguracionperfil = $this->_request->getPost(
                'idconfiguracion'
        );
        $objconf = ConfPerfil::obtenerConfById(
                        $parametros->idconfiguracionperfil
        );
        $tipoelementos
                = ConfPerfilcargasxdefecto::getTipoelementosdadoidconfperfil(
                        $parametros->idconfiguracionperfil, 3
        );
        $idtipoelemento = $tipoelementos[0]['idtipoelemento'];
        $involucrados = Doctrine::getTable(
                        'DatPerfilinvolucradoUsuariosinvolucrados'
                )->findByDql(
                "idconfiguracionperfil = $parametros->idconfiguracionperfil AND idtipoelemento = $idtipoelemento", null, Doctrine::HYDRATE_ARRAY
        ); /* DatConfperfilcalendarioUsuariosinvolucrados::getInvolucradosConfPerfilCalendario
          ($parametros->idconfiguracionperfil); */
        if (isset($involucrados[0])) {
            $objconf['involucrados'] = $involucrados;
        }
        echo json_encode(
                array(
                    'mensaje' => 1,
                    'confperfil' => $objconf,
                    'confvalida' => $tipoelementos)
        );
    }

    public function modificarConfCalendarioAction() {
        $parametros->idconfiguracionperfil = $this->_request->getPost(
                'idconfiguracion'
        );
        $objconf = ConfPerfil::obtenerConfById(
                        $parametros->idconfiguracionperfil
        );
        if ($objconf['idcomparacion'] != null) {
            $comparaciones = NomComparacion::getByid($objconf['idcomparacion']);
            if (isset($comparaciones['idcomparacion'])) {
                $objconf['igual'] = $comparaciones['igual'];
                $objconf['mayor'] = $comparaciones['mayor'];
                $objconf['menor'] = $comparaciones['menor'];
            }
        }

        $confcalendar = ConfPerfilcalendario::getConfigDadoIdconfperfil(
                        $parametros->idconfiguracionperfil
        );
        $denocateact = NomNomenclador::obtenerDenoNomCatActividad(
                        $confcalendar[0]['idcategoriaactividad']
        );
        $denotipoact = NomNomenclador::obtenerDenoNomCatActividad(
                        $confcalendar[0]['idtipoactividad']
        );
        $denovista = NomVistacalendario::getDenoVistaCalendaById(
                        $confcalendar[0]['idvistaxdefecto']
        );
        $involucrados = Doctrine::getTable(
                        'DatConfperfilcalendarioUsuariosinvolucrados'
                )->findByDql(
                "idconfiguracionperfil = $parametros->idconfiguracionperfil", null, Doctrine::HYDRATE_ARRAY
        ); /* DatConfperfilcalendarioUsuariosinvolucrados::getInvolucradosConfPerfilCalendario(
          $parametros->idconfiguracionperfil); */

        if (isset($involucrados[0])) {
            $objconf['involucrados'] = $involucrados;
        }

        $denoestadoaprob = $this->pIntegrator->workflow->DenomEstado(
                $objconf['estadoaprobacion']
        );

        $objconf['denoestadoaprob'] = $denoestadoaprob[0]->denominacion;
        $objconf['denocateact'] = $denocateact[0]['dennomenclador'];
        $objconf['denotipoact'] = $denotipoact[0]['dennomenclador'];
        $objconf['idtipoactividad'] = $denotipoact[0]['idnomenclador'];
        $objconf['denovista'] = $denovista[0]['denominacion'];
        $objconf['idvistaxdefecto'] = $denovista[0]['idvistacalendario'];

        echo json_encode(
                array(
                    'mensaje' => 1,
                    'confperfil' => $objconf,
                    'confvalida' => $confcalendar[0])
        );
    }

    public function listarCargasxDefectoAction() {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $idtipoelemento = $this->_request->getPost('idelemento');

        $parametros->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 80;
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->integrator = $this->integrator;
        $result = array();
        $resultado = new CmpconfigurarperfilModel();
        $result = $resultado->listarCargasxdefecto($parametros);
        if (count($idtipoelemento) != 0) {
            $result = $resultado->organizarSalidaArreglo(
                    $result, $idtipoelemento
            );
        }
        if ($result == null)
            echo json_encode(array('data' => []));
        else
            echo json_encode($result);
    }

    public function listarConfCalendariosAction() {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 80;
        $parametros->filtros = $this->_request->getPost('filtros');
        $parametros->integrator = $this->integrator;
        $model = new CmpconfigurarperfilModel();
        $result = $model->listarCalendario($parametros);
        echo json_encode($result);
    }

    public function listarConfComportamientosAction() {
        $parametros->idusuario = $this->global->Perfil->idusuario;
        $parametros->start = ($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;
        $parametros->limit = ($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 80;
        $parametros->filtros = $this->_request->getPost('filtros');

        $parametros->integrator = $this->integrator;
        $model = new CmpconfigurarperfilModel();
        $result = $model->listarComportamientos($parametros);
        echo json_encode($result);
    }

    public function eliminarConfPerfilCargaxDefectoAction() {
        $parametros->arrayidconfiguracionperfil = json_decode(
                stripslashes(
                        $this->_request->getPost('arrayidconfs')
                )
        );
        $resp = CmpconfigurarperfilModel::eliminarConfPerfilCxD($parametros);
        echo json_encode(array('mensaje' => $resp));
    }

    public function eliminarConfPerfilCalendarioAction() {
        $parametros->arrayidconfiguracionperfil = json_decode(
                stripslashes(
                        $this->_request->getPost('arrayidconfs')
                )
        );
        $resp = CmpconfigurarperfilModel::eliminarConfPerfilCalendar(
                        $parametros
        );
        echo json_encode(array('mensaje' => $resp));
    }

    public function eliminarConfPerfilComportamientoAction() {
        $parametros->arrayidconfiguracionperfil = json_decode(
                stripslashes(
                        $this->_request->getPost('arrayidconfs')
                )
        );
        $resp = CmpconfigurarperfilModel::eliminarConfPerfilComportamiento(
                        $parametros
        );
        echo json_encode(array('mensaje' => $resp));
    }

    public function definirActualAction() {
        $parametros->idconfiguracionperfil = $this->_request->getPost(
                'idconfiguracionperfil'
        );
        $parametros->tipoconf = $this->_request->getPost('tipoconf');
        $parametros->arraytipoelemento = json_decode(
                stripslashes(
                        $this->_request->getPost('arraytipoelemento')
                )
        );
        $model = new CmpconfigurarperfilModel();
        $resultado = $model->definirActual($parametros);
        echo json_encode(array('mensaje' => $resultado));
    }

}

