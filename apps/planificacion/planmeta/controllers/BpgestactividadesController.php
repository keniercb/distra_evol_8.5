<?php

class BpgestactividadesController extends ZendExt_Controller_Secure {

    public function init() {
        $this->nivel = NomActividad::getNivel();
        parent::init();
    }

    public function bpgestactividadesAction() {
        $this->render();
    }

    /*     * ************actividades********************** */

    //funcion listar actividades  
    public function listarActividadesAction() {
        try {
            ini_set("max_execution_time", 600);
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['idpadre'] = $this->_request->getPost('anode');
            $params['nivel'] = $this->_request->getPost('nivel') == null ? 1 : $this->_request->getPost('nivel');
            $params['filtros'] = $this->_request->getPost('filtros');
            $params['rector'] = $this->_request->getPost('rector');
            $params['idindicadorebuscar'] = $this->_request->getPost('idindicadorebuscar');
            $params['idejerciciosbuscar'] = $this->_request->getPost('idejerciciosbuscar');
            $params['limpiarbuscar'] = $this->_request->getPost('limpiarbuscar');
            $params['idespecialidad'] = (is_numeric($this->_request->getPost('idespecialidad'))) ? $this->_request->getPost('idespecialidad') : null;
            $params['integrator'] = $this->integrator;
            $params['ultimonivel'] = $this->nivel;
            $params['limitado'] = true;
            $modelAct = new NomActividadModel();
            echo json_encode($modelAct->listarActividades($params));
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    //funcion exportar actividades  
    public function exportarAction() {
        ini_set("max_execution_time", 600); //10 min de conexion
        $params['nivel'] = $this->_request->getParam('nivel') == null ? 1 : $this->_request->getParam('nivel');
        $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
        $params['rector'] = $this->_request->getParam('rector');
        $params['tipo'] = $this->_request->getParam('tipo');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['idespecialidad'] = (is_numeric($this->_request->getParam('idespecialidad'))) ? $this->_request->getParam('idespecialidad') : null;
        $params['integrator'] = $this->integrator;
        $params['ultimonivel'] = $this->nivel;
        $params['limitado'] = false;
        $modelAct = new NomActividadModel();
        $modelAct->exportarActividades($params);
    }

    //funcion listar indicadores a buscar 
    public function listarBuscarIndicadorAction() {
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params ['buscar'] = true;
        $modelAct = new NomActividadModel();
        $result = $modelAct->listarIndicadorActividades($params);
        echo json_encode($result);
    }

    public function guardarPredefinidoAction() {
        $params['idformato'] = $this->_request->getPost('idformato');
        if ($params['idformato'] == 'delete') {
            $existeActv = NomActividad::ObtenerIdActividades();
            if (count($existeActv) == 0) {
                $existe = $identidad = Doctrine::getTable('NomFormatopredefinido')->findByDql("true");
                if ($existe[0]->idformato != null) {
                    $existe[0]->delete();
                }
            }
        } else {
            $existe = $identidad = Doctrine::getTable('NomFormatopredefinido')->findByDql("idformato = {$params['idformato']}");
            if ($existe[0]->idformato != null) {
                $existe[0]->idformato = $params['idformato'];
                $existe[0]->save();
            } else {
                $obj = new NomFormatopredefinido();
                $obj->idformato = $params['idformato'];
                $obj->save();
            }
        }
        echo json_encode(1);
    }

    //funcion aprobar actividades  
    public function aprobarDesaprobarActividadAction() {
        ini_set("max_execution_time", 600);
        $params['actividades'] = json_decode(stripslashes($this->_request->getPost('actividades')));
        $params['idaprobacion'] = $this->_request->getPost('idaprobacion');
        $params['esrector'] = ($this->_request->getPost('esrector') == 'true') ? true : false;
        $params['nivel'] = $this->nivel;
        $modelActividad = new NomActividadModel();
        if ($params['actividades'][0] != null && $modelActividad->aprobarDesaprobarVariasActividades($params)) {
            echo json_encode(
                    array('codMsgM' => 24, 'mensaje' => (($params['idaprobacion'] == '3' || $params['idaprobacion'] == '4') ? 'aprobada' : 'desaprobada')));
        } else {
            echo("{'codMsgM':3 }");
        }
    }

    //funcion activar actividades  
    public function activarDesactivarActividadAction() {
        ini_set("max_execution_time", 600);
        $params['estado'] = $this->_request->getPost('estado');
        $params['actividades'] = json_decode(stripslashes($this->_request->getPost('actividades')));
        $params['nivel'] = $this->nivel;
        $params['integrator'] = $this->integrator;
        $modelActividad = new NomActividadModel();
        if ($params['actividades'][0] != null && $modelActividad->activarDesactivarPostordenVariasActividades($params)) {
            echo json_encode(
                    array('codMsgM' => 24, 'mensaje' => (($params['estado'] == '0') ? 'desact' : 'act')));
        } else {
            echo("{'codMsgM':3 }");
        }
    }

    //funcion eliminar actividades
    public function eliminarActividadAction() {
        ini_set("max_execution_time", 600);
        $params['idactividades'] = json_decode(stripslashes($this->_request->getPost('actividades')));
        $params['nivel'] = $this->nivel;
        $modelActividad = new NomActividadModel();
        if ($params['idactividades'][0] != null && $modelActividad->eliminarVariasActividades($params)) {
            echo json_encode(array('codMsgM' => 1));
        } else {
            echo json_encode(array('codMsgM' => 3));
        }
    }

    //funcion adicionar actividades
    public function adicionarActividadAction() {
        try {
            $params['codAdicionar'] = $this->_request->getPost('codAdicionar');
            $params['nivelAdicionar'] = $this->_request->getPost('nivelAdicionar');
            $params['ultimonivel'] = $this->_request->getPost('ultimonivel');
            $params['idarbolAdicionar'] = $this->_request->getPost('idarbolAdicionar');
            $params['idpadreAdicionar'] = $this->_request->getPost('idpadreAdicionar');
            $params['idespecialidad'] = $this->_request->getPost('idespecialidad');
            $params['descripcion'] = $this->_request->getPost('descripcion');
            $params['denominacion'] = $this->_request->getPost('denominacion');
            $params['idformato'] = $this->_request->getPost('idformato');
            $params['integrator'] = $this->integrator;
            $params['idmodelo'] = $this->_request->getPost('idmodelo');
            $params['idmodeloSalida'] = $this->_request->getPost('idmodeloSalida');
            $params['idespecialidadcomp'] = $this->_request->getPost('idespecialidadcomp');
            $params['idespecialidadesdem'] = $this->_request->getPost('idespecialidadesdem');
            $params['idusuario'] = $this->global->Perfil->idusuario;

            $modelAct = new NomActividadModel();
            /* Adicionar actividad */
            $mensaje = 'Add';
            if ($modelAct->noExisteCodigoAct($params['codAdicionar'])) {
                if ($modelAct->adicionarActividad($params)) {
                    $codmensaje = 1;
                }
            } else {
                $codmensaje = 22;
            }
            echo json_encode(
                    array('codMsgM' => $codmensaje, 'mensaje' => $mensaje)
            );
        } catch (Exception $exc) {
            echo $exc->getTraceAsString();
        }
    }

    public function asociarActividadAction() {

        //$params['idarbolAdicionar'] = $this->_request->getPost('idarbolAdicionar');
        //$params['idpadreAdicionar'] = $this->_request->getPost('idpadreAdicionar');
        $params['idespecialidad'] = $this->_request->getPost('idespecialidad');
        $params['integrator'] = $this->integrator;
        $params['idmodelo'] = $this->_request->getPost('idmodeloAsc');
        $params['idmodeloSalida'] = $this->_request->getPost('idmodeloSalidaAsc');
        $params['idespecialidadcomp'] = $this->_request->getPost('idespecialidadcomp');
        $params['idespecialidadesdem'] = $this->_request->getPost('idespecialidadesdem');
        $params['actividades'] = json_decode(stripslashes($this->_request->getPost('actividades')));
        //$params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $modelAct = new NomActividadModel();

        /* Adicionar actividad */
        $mensaje = 'Add';
        if ($modelAct->asociarActPlanes($params)) {
            $codmensaje = 1;
        }
        echo json_encode(
                array('codMsgM' => $codmensaje, 'mensaje' => $mensaje)
        );
    }

    //funcion modificar-duplicar actividades
    public function modificarActividadAction() {
        try {



            $params['tfcodigo'] = $this->_request->getPost('tfcodigoMod');
            $params['codpadre'] = $this->_request->getPost('codpadreMod');
            $params['nivel'] = $this->_request->getPost('nivel');
            $params['descripcion'] = $this->_request->getPost('descripcionMod');
            $params['idejercicio'] = $this->_request->getPost('idejercicio');
            $params['denominacion'] = $this->_request->getPost('denominacionMod');
            $params['integrator'] = $this->integrator;
            $params['idmodeloMod'] = $this->_request->getPost('idmodeloMod');
            $params['idmodeloSalidaMod'] = $this->_request->getPost('idmodeloSalidaMod');
            $params['idespecialidadcomp'] = ($this->_request->getPost('idespecialidadcomp')) ? $this->_request->getPost('idespecialidadcomp') : null;
            $params['idespecialidadesdem'] = ($this->_request->getPost('idespecialidadesdem')) ? $this->_request->getPost('idespecialidadesdem') : null;
            $params['idespecialidadcompDup'] = json_decode(stripslashes($this->_request->getPost('idespecialidadcompDup')));
            if (is_array($params['idespecialidadcompDup'])) {
                foreach ($params['idespecialidadcompDup'] as $value) {
                    $idespComp[] = $value->idespecialidad;
                }
            } else {
                $idespComp = explode(',', $params['idespecialidadcompDup']);
            }
            $params['idespecialidadesdemDup'] = json_decode(stripslashes($this->_request->getPost('idespecialidadesdemDup')));
            if (is_array($params['idespecialidadesdemDup'])) {
                foreach ($params['idespecialidadesdemDup'] as $value) {
                    $idespDem[] = $value->idespecialidad;
                }
            } else {
                $idespDem = explode(',', $params['idespecialidadesdemDup']);
            }
            $params['idespecialidadesdemDup'] = $this->_request->getPost('idespecialidadesdemDup');
            $params['idactividad'] = $this->_request->getPost('idactividad');
            $params['ultimonivel'] = $this->_request->getPost('ultimonivel');
            $params['un'] = $this->nivel;
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $params['accion'] = $this->_request->getPost('accion');
            $params['idpadre'] = $this->_request->getPost('idpadre');
            $params['idarbol'] = $this->_request->getPost('idarbol');
            $params['idformato'] = $this->_request->getPost('idformato');
            $params['idespecialidad'] = $this->_request->getPost('idespecialidad');
            $params['idusuario'] = $this->global->Perfil->idusuario;
            $params['integrator'] = $this->integrator;

            $modelAct = new NomActividadModel();
            if ($params['accion'] == "duplicar") {

                /* duplicar actividad */
                $mensaje = 'Dup';
                $params['codduplicar'] = '' . $params['codpadre'] . '' . $params['tfcodigo'];
                $params['idactorigen'] = $params['idactividad'];

                if ($modelAct->noExisteCodigoAct($params['codduplicar'])) {

                    if ($modelAct->duplicarActividad($params['idactorigen'], $params['idpadre'], $params['tfcodigo'], $params['denominacion'], $params['descripcion'], $params['idformato'], $params['idusuario'], $params['idespecialidad'], $params['un'], $idespDem, $idespComp, $params['integrator'])) {
                        $codmensaje = 1;
                    }
                } else {
                    $codmensaje = 22;
                }
                echo json_encode(array('codMsgM' => $codmensaje, 'mensaje' => $mensaje));
            } elseif ($params['accion'] == "modificar") {
                /* Modificar actividad */
                $mensaje = 'Mod';
                if ($modelAct->noExisteCodigoAct(('' . $params['codpadre'] . '' . $params['tfcodigo']), intval($params['idactividad']))) {
                    if ($modelAct->modificarActividad($params)) {
                        $codmensaje = 1;
                    }
                } else {
                    $codmensaje = 22;
                }
                echo json_encode(array('codMsgM' => $codmensaje, 'mensaje' => $mensaje));
            }
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
    }

    /*     * ************fin de actividades********************** */

    /*     * ************normas********************** */

    public function listarNormasAction() {
        $params = array();
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $params['integrator'] = $this->integrator;
        $normaActv = new DatNormaModel();
        $data = $normaActv->listarNormasPorActividad($params);
        echo json_encode($data);
    }

    public function listarIndicadoresAddNormaAction() {
        ini_set("max_execution_time", 600);
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $modelActEnt = new NomActividadModel();
        $result = $modelActEnt->listarIndicadorActividades($params);
        echo json_encode($result);
    }

    public function adicionarNormasAction() {
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['normas'] = json_decode(stripslashes($this->_request->getPost('normas')));
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $actualizados = 0;
        if ($params['normas'][0]->idindicador != null) {
            $actualizados = DatNormaModel::adicionarNormas($params);
        }
        echo json_encode(array('codMsgN' => $actualizados));
    }

    function eliminarNormaAction() {
        $params['normas'] = json_decode(stripslashes($this->_request->getPost('normas')));
        $eliminadas = 0;
        if ($params['normas'][0]->idnorma != null) {
            $eliminadas = DatNormaModel::eliminarNorma($params);
        }
        echo json_encode(array('codMsgN' => $eliminadas));
    }

    public function actualizarNormaAction() {
        $params['normas'] = json_decode(stripslashes($this->_request->getPost('normas')));
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $actualizados = 0;
        if ($params['normas'][0]->idnorma != null) {
            $actualizados = DatNormaModel::modificarNorma($params);
        }
        echo json_encode(array('codMsgN' => $actualizados));
    }

    /*     * ************fin de normas********************** */

    /*     * ************reglas********************** */

    public function listarReglasAction() {
        $params = array();
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');

        $data = DatReglaModel::listarReglas($params);
        echo json_encode($data);
    }

    public function listarActividadesAddReglaAction() {
        $params = array();
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idnorma'] = $this->_request->getPost('idnorma');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['idespecialidad'] = $this->_request->getPost('idespecialidad');
        $params['ultimonivel'] = $this->_request->getPost('ultimonivel');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');

        $data->data = DatReglaModel::listarActividadesAddRegla($params);
        $data->total = $data->data[0]['total'];

        echo json_encode($data);
    }

    public function adicionarReglaAction() {
        $params = array();
        $params['idnorma'] = $this->_request->getPost('idnorma');
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idactividaddestino'] = $this->_request->getPost('idactividaddestino');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['denominacion'] = $this->_request->getPost('denominacion');
        $params['valorcontrol'] = $this->_request->getPost('valorcontrol');
        $params['nivelbase'] = $this->_request->getPost('nivelbase');
        $params['idusuario'] = $this->global->Perfil->idusuario;

        $adicionado = DatReglaModel::adicionarRegla($params);
        echo json_encode(array('codMsgN' => 1));
    }

    public function eliminarReglaAction() {
        $params['reglas'] = json_decode(stripslashes($this->_request->getPost('reglas')));
        $eliminadas = 0;
        if ($params['reglas'][0]->idregla != null) {
            $eliminadas = DatReglaModel::eliminarRegla($params);
        }
        echo json_encode(array('codMsgN' => $eliminadas));
    }

    public function actualizarReglasAction() {
        $params['reglas'] = json_decode(stripslashes($this->_request->getPost('reglas')));
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $actualizados = 0;
        if ($params['reglas'][0]->idregla != null) {
            $actualizados = DatReglaModel::actualizarReglas($params);
        }
        echo json_encode(array('codMsgN' => $actualizados));
    }

    /*     * ************fin de reglas********************** */

    /*     * ************salidas********************** */

    public function listarSalidasAction() {
        $params = array();
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $objSalida = new DatSalidaModel();
        $result = $objSalida->listarSalidas($params);
        echo json_encode($result);
    }

    public function listarIndicadoresAddSalidasAction() {
        ini_set("max_execution_time", 600);
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $modelActEnt = new NomActividadModel();
        $result = $modelActEnt->listarIndicadorActividades($params);
        echo json_encode($result);
    }

    public function adicionarSalidaAction() {
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['salidas'] = json_decode(stripslashes($this->_request->getPost('salidas')));
        $params['idusuario'] = $this->global->Perfil->idusuario;
        if ($params['salidas'][0]->idindicador != null) {
            $model = new DatSalidaModel();
            $model->adicionar_salida($params);
        }
        echo json_encode(array('codMsgS' => 1));
    }

    public function modificarSalidaAction() {
        try {
            $params['idactividad'] = $this->_request->getPost('idactividad');
            $params['salidas'] = json_decode(stripslashes($this->_request->getPost('salidas')));
            $params['idusuario'] = $this->global->Perfil->idusuario;
            if ($params['salidas'][0] != null) {           
                $model = new DatSalidaModel();
                $model->modificar_salida($params);
            }
            echo json_encode(array('si' => 1));
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
    }

    public function eliminarSalidaAction() {
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['salidas'] = json_decode(stripslashes($this->_request->getPost('salidas')));
        if ($params['salidas'][0] != null) {
            $model = new DatSalidaModel();
            $model->eliminarvarias_salidas($params);
        }
        echo json_encode(array('codMsgG' => 1));
    }

    /*     * ************fin de salidas********************** */

    /*     * ************cargos********************** */

    public function listarCargosAction() {
        $params = array();
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $objCargo = new DatCargoModel();
        $result = $objCargo->listarCargos($params);
        echo json_encode(array('data' => $result, 'total' => $result[0]['total']));
    }

    public function listarActivosAction() {
        $params = array();
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $modelActEnt = new NomActividadModel();
        $result = $modelActEnt->listarActivos($params);
        echo json_encode(array('data' => $result, 'total' => $result[0]['total']));
    }

    public function listarActivosAddActivosAction() {
        try {
            ini_set("max_execution_time", 600);
            $params['idactividad'] = $this->_request->getPost('idactividad');
            $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $params['filtros'] = $this->_request->getPost('filtros');
            $modelActEnt = new NomActividadModel();
            $result = $modelActEnt->listarActivosAddActivos($params);
            echo json_encode($result);
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function adicionarActivosAction() {
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['activos'] = json_decode(stripslashes($this->_request->getPost('activos')));
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $actualizados = 0;
        if ($params['activos'][0]->idindicador != null) {
            $actualizados = NomActividadModel::adicionarActivos($params);
        }
        echo json_encode(array('codMsgS' => $actualizados));
    }

    function eliminarActivosAction() {
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['activos'] = json_decode(stripslashes($this->_request->getPost('activos')));
        $eliminadas = 0;
        if ($params['activos'][0] != null) {
            $eliminadas = NomActividadModel::eliminarActivos($params);
        }
        echo json_encode(array('codMsgN' => $eliminadas));
    }

    public function modificarActivosAction() {
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['activos'] = json_decode(stripslashes($this->_request->getPost('activos')));
        $params['idusuario'] = $this->global->Perfil->idusuario;
        $modificados = 0;
        if ($params['activos'][0] != null) {
            $modificados = NomActividadModel::modificarActivos($params);
        }
        if ($modificados != 0) {
            echo json_encode(array('codMsgN' => 1));
        } else {
            echo json_encode(array('codMsgN' => 0));
        }
    }

    public function listarCargosAddCargosAction() {
        ini_set("max_execution_time", 600);
        $params['idactividad'] = $this->_request->getPost('idactividad');
        //$params['idejercicio'] = $this->_request->getPost('idejercicio');
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');


        $cargos = $this->integrator->metadatos->buscarCargo("", null, $params['start']);
        $params['cargos'] = $cargos;
        $objCargo = new DatCargoModel();
        $cargosFiltrados = $objCargo->listarCargosAddCargos($params);
        $total = count($cargosFiltrados);
        $cargosWithPagination = array_slice($cargosFiltrados, $params['start'], $params['limit']);
        echo json_encode(array('data' => $cargosWithPagination, 'total' => $total));
    }

    public function obtenerCargosAction() {

        $cargos = $this->integrator->metadatos->buscarCargo("", null, 0);

        $data = array();
        foreach ($cargos as $key => $value) {
            $data[$key]['idcargo'] = $value['idnomcargo'];
            $data[$key]['denominacion'] = $value['denominacion'];
        }

        echo json_encode(array('data' => $data));
    }

    public function adicionarCargoAction() {
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['cargos'] = json_decode(stripslashes($this->_request->getPost('cargos')));
        $params['idusuario'] = $this->global->Perfil->idusuario;
        if ($params['cargos'][0]->idnomcargo != null) {
            $model = new DatCargoModel();
            $model->adicionar_cargo($params);
        }
        echo json_encode(array('codMsgS' => 1));
    }

    public function modificarCargoAction() {
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['cargos'] = json_decode(stripslashes($this->_request->getPost('cargos')));
        $params['idusuario'] = $this->global->Perfil->idusuario;

        if ($params['cargos'][0] != null) {
            $model = new DatCargoModel();
            $model->modificar_cargo($params);
        }
        echo json_encode(array('si' => 1));
    }

    public function eliminarCargoAction() {
        $params['idactividad'] = $this->_request->getPost('idactividad');
        $params['cargos'] = json_decode(stripslashes($this->_request->getPost('cargos')));
        if ($params['cargos'][0] != null) {
            $model = new DatCargoModel();
            $model->eliminarvarios_cargos($params);
        }
        echo json_encode(array('codMsgG' => 1));
    }

    /*     * ************fin de cargos********************** */

    /*     * *************** Metodos generales *************** */

    public function guardarResumenCostoAction() {
        $params['idactividad'] = $this->_request->getParam('idactividad');
        $params['idejercicio'] = $this->_request->getParam('idejercicio');
        $params['costosindirectos'] = $this->_request->getParam('costosindirectos');
        $params['otroscostos'] = $this->_request->getParam('otroscostos');
        $modelActEnt = new DatActividadentidadModel();
        $result = $modelActEnt->guardarResumenCosto($params);
        echo json_encode(array('codMsg1' => $result));
    }

    public function calcularCostoDirectoAction() {

        $params['idactividad'] = $this->_request->getParam('idactividad');
        $idejercicio = $idejercicio = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        $params['idejercicio'] = $idejercicio['idejercicio'];
        $modelActEnt = new NomActividadModel();
        $result = $modelActEnt->calcularCostoDirecto($params);
        echo json_encode(
                array(
                    'importe' => $result[0]['importe'],
                    'importeind' => $result[0]['costosindirectos'],
                    'otrosimp' => $result[0]['otroscostos'])
        );
    }

    public function exportarResumenCostoAction() {
        ini_set("max_execution_time", 600); //10 min de conexion
        $params = array();
        $params['directo'] = $this->_request->getParam('directo');
        $params['indirecto'] = $this->_request->getParam('indirecto');
        $params['otros'] = $this->_request->getParam('otros');
        $params['ejercicio'] = $this->_request->getParam('ejercicio');
        $params['denominacion'] = $this->_request->getParam('denominacion');
        $totalcostos = $params['directo'] + $params['indirecto'] + $params['otros'];
        //pintando la tabla
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=Resumen.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<caption align=center style = color:blue > Resumen de Costo </caption>';
        echo "<table cellspacing=1 width=100%>  
		<tr >
                <th align=left style = color:blue >Actividad</th>
		<td align=right>" . $params['denominacion'] . "</td>
		</tr><tr >
                <th align=left style = color:blue >Ejercicio</th>
		<td align=right>" . $params['ejercicio'] . "</td>
		</tr> </tr>";

        echo ("<br></br></table>") . "<tr >";
        echo "<table border=1 cellspacing=0 width=60%>  
              <tr >
              <th align=left>Costos directos</th>
              <td align=right style=\"mso-number-format:'@';\" >" . $params['directo'] . "</td>
              </tr> <tr>
              <th align=left >Costos indirectos</th>
              <td align=right style=\"mso-number-format:'@';\" >" . $params['indirecto'] . "</td>
              </tr>
              <tr>
              <th align=left >Otros costos</th>
              <td align=right style=\"mso-number-format:'@';\" >" . $params['otros'] . "</td>
              </tr> 
              <tr style = 'color:green'>
              <th align=left >Total</th>
              <th align=right>" . $totalcostos . "</th>			 
              </tr>			 
              </tr>";
        echo ("<br></br></table>") . "<tr >";
    }

    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function longNivelAction() {
        //Obtener el identificador de formato
        $idformato = $this->_request->getPost('idformato');
        //Obtener el nivel del formato que se desea del nivel del arbol
        $nivel = $this->_request->getPost('nivel');
        //Obtener la configuracion por nodos de un formato
        $result = $this->integrator->datosmaestros->buscarParteFormato($idformato);

        //Inicializar variable en 0 para contar los niveles
        $longitud = 0;
        $nombre = '';
        $abreviatura = '';
        foreach ($result as $r) {
            if ($r->nivel == $nivel) {
                $longitud = $r->longitud;
                $nombre = $r->nombre;
                $abreviatura = $r->abreviatura;
            }
        }
        //Enviar la longitud del formato a la IU.
        echo json_encode(array('longitud' => $longitud, 'nombre' => $nombre, 'abreviatura' => $abreviatura));
    }

    public function cargarNivelesAction() {
        $modelActividad = new NomActividadModel();
        echo json_encode($modelActividad->cargarNiveles($this->integrator));
    }

    public function listarEspecialidadesTodasAction() {
        echo json_encode(array('data' => NomActividad::obtenerEspecialidadesTodas(null, false)));
    }

    public function cargarModelosAction() {
        $data->data = DatEntidadmodelo::servBP_getModeloAsocEntidad();
        $data->data [] = array('idmodelo' => '-', 'denominacion' => '-');
        echo json_encode($data);
    }

    public function getEjerciciosAction() {
        $data = null;
        $data->data = $this->pIntegrator->planmeta->obtenerEjercicios();
        $data->idejercicioactual = $this->pIntegrator->planmeta->obtenerEjercicioActual();
        echo json_encode($data);
    }

    public function listarCentroBalanceAction() {
        $modelActividad = new NomActividadModel();
        echo json_encode($modelActividad->listarCentroBalance($this->integrator));
    }

    public function cargarunidadmedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function listarNaturalezasAction() {
        $naturaleza = DatBasescalculoModel::obtenerNaturalezas();
        echo json_encode(array('data' => $naturaleza));
    }

    public function listarArbolEspecialidadesAction() {
        $params['idespecialidad'] = (is_numeric($this->_request->getPost('node'))) ? $this->_request->getPost('node') : null;
        $res = $this->integrator->datosmaestros->obtenerArbolEspecialidad($params['idespecialidad']);
        echo json_encode($res);
    }

    public function listarEspecialidadesAction() {
        $params['idespecialidad'] = (is_numeric($this->_request->getPost('idespecialidad'))) ? $this->_request->getPost('idespecialidad') : null;
        $params['denespecialidad'] = ($this->_request->getPost('denespecialidad')) ? $this->_request->getPost('denespecialidad') : null;
        $params['rector'] = $this->_request->getPost('rector');
        if ($params['idespecialidad'] != null) {
            $especialidades = $this->integrator->datosmaestros->getTodosHijosEspecialidad($params['idespecialidad']);
            $especialidad['idespecialidad'] = $params['idespecialidad'];
            $especialidad['denespecialidad'] = $params['denespecialidad'];
            array_unshift($especialidades, $especialidad);
        } else {
            if ($params['rector'] == 'true') {
                $especialidades = NomActividad::obtenerEspecialidadesTodas(null, false);
            } else {
                $especialidad = $this->integrator->datosmaestros->obtenerEspecialidadPorId(ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad);
                $especialidades = $this->integrator->datosmaestros->getTodosHijosEspecialidad($especialidad[0]->idespecialidad);
                $especialidad['idespecialidad'] = $especialidad[0]->idespecialidad;
                $especialidad['denespecialidad'] = $especialidad[0]->denespecialidad;
                array_unshift($especialidades, $especialidad);
            }
        }
        echo json_encode(array('data' => $especialidades));
    }

    Public function listarEspecialidadesYValorUltimoNivelAction() {
        $params['comboListar'] = ($this->_request->getPost('comboListar')) ? $this->_request->getPost('comboListar') : null;
        $params['demandantes'] = ($this->_request->getPost('demandantes')) ? json_decode(stripslashes($this->_request->getPost('demandantes'))) : null;
        $params['idespecialidadCreador'] = ($this->_request->getPost('idespecialidadCreador')) ? $this->_request->getPost('idespecialidadCreador') : null;
        $params['compartidas'] = ($this->_request->getPost('compartidas')) ? json_decode(stripslashes($this->_request->getPost('compartidas'))) : null;

        $especialidades = array();

        if ($params['demandantes'] != null && $params['demandantes'] != "" && $params['demandantes'] != '""') {
            array_unshift($especialidades, $params['demandantes']);
        }

        if ($params['compartidas'] != null && $params['compartidas'] != "" && $params['compartidas'] != '""') {
            array_unshift($especialidades, $params['compartidas']);
        }
        if ($params['idespecialidadCreador'] != null && $params['idespecialidadCreador'] != "" && $params['idespecialidadCreador'] != '""') {
            array_unshift($especialidades, $params['idespecialidadCreador']);
        }

        $modelActEnt = new NomActividadModel();

        $result = $modelActEnt->listarEspecialidadesCB($especialidades);
        echo json_encode(array('data' => $result));
    }

    public function obtenerEspecialidadLogueadaAction() {
        $especialidad = $this->integrator->datosmaestros->obtenerEspecialidadPorId(
                ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad
        );
        $resp[0]['idespecialidad'] = $especialidad[0]->idespecialidad;
        $resp[0]['denominacion'] = $especialidad[0]->denespecialidad;
        $resp[0]['codigo'] = $especialidad[0]->codespecialidad;
        echo json_encode(array('data' => $resp));
    }

    public function listarFormatosAction() {
        $formatos = $this->integrator->datosmaestros->listarFormatos();
        if ($formatos)
            echo json_encode(array('data' => $formatos));
        else
            echo json_encode(array('data' => array()));
    }

    //funcion dado una actividad devuelve las especialidades compartidas y demandadas
    public function demandandesCompartidosAction() {
        $params['idactividad'] = ($this->_request->getPost('idactividad')) ? $this->_request->getPost('idactividad') : null;
        $params['codigo'] = ($this->_request->getPost('codigo')) ? json_decode(stripslashes($this->_request->getPost('codigo'))) : null;
        $params['integrator'] = $this->integrator;
        $datActespcomportamiento = new NomActividadModel();
        $data = $datActespcomportamiento->obtenerComportamientoByIdactividad($params);
        echo json_encode($data);
    }

    /* public function guardarFormatoPredefinidoAction() {
      $idformato = $this->_request->getPost('idformato');
      echo json_encode(array('data' => NomActividad::guardarFormatoPredefinido($idformato)));
      } */

    /*     * ************ Fin de Metodos generales *********** */
}
