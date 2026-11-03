<?php

class GestionarestadoController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
        $this->model[] = new DatEstado();  //0
        $this->model[] = new DatEstadoModel(); //1
        $this->model[] = new DatTransicion(); //2
        $this->model[] = new ConfDocDatEstado(); //3
        $this->model[] = new ConfDoc();   //4
        $this->model[] = new ConfDocModel();   //5
        $this->model[] = new ConfDocDatEstadoModel();    //6
    }

    function gestionarestadoAction() {
        $this->render();
    }

    function cargarestadoAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $denominacion = $this->_request->getPost('denominacion');
        $start = $this->_request->getPost('start');
        $limit = $this->_request->getPost('limit');
        $idusuariosession = $this->global->Perfil->idusuario;
        $arrayestados = $this->model[1]->CargarEstados(
                $denominacion, $idusuariosession, $start, $limit
        );
        if ($arrayestados['datos'][0]) {
            for ($index = 0; $index < count($arrayestados['datos']); $index++) {
                $idestado = $arrayestados['datos'][$index]['idestado'];
                $arrayestadosasoc [] = $this->model[3]->DocumentosConEstado(
                        $idestado
                );
            }
            for ($i = 0; $i < count($arrayestados['datos']); $i++) {
                for ($j = 0; $j < count($arrayestadosasoc); $j++) {
                    foreach ($arrayestadosasoc[$j] as $key => $asociacion) {
                        if ($arrayestados['datos'][$i]['idestado'] === $asociacion['idestado']
                        ) {
                            if ($asociacion['idtipodoc'] == '0') {
                                $arrayestados['datos'][$i]['docplan'] = 1;
                            }
                            if ($asociacion['idtipodoc'] == '1') {
                                $arrayestados['datos'][$i]['docobjetivo'] = 2;
                            }
                            if ($asociacion['idtipodoc'] == '3') {
                                $arrayestados['datos'][$i]['docactividad'] = 3;
                            }
                        }
                    }
                }
            }
            echo json_encode(
                    array('total' => $arrayestados['total'],
                        'campos' => $arrayestados['datos'])
            );
        }
        if (!$arrayestados['datos'][0]) {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    function cargartdocAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos = Array();
        $datos = $this->model[5]->CargarTipoDocConf(0, 0);
        echo json_encode($datos);
    }

    function generarestadospordefectoAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $respuesta = $this->model[0]->GenerarEstadoPorDefecto($idusuariosession);
        echo json_encode(array('mensaje' => $respuesta));
    }

    //Funcion para cargar los estados asociados el tipo documento
    function cargarestadoasocAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtdoc = $this->_request->getPost('idtdoc');
        $datos = Array();
        $limit = 20;//($this->_request->getPost('limit')) ? $this->_request->getPost('limit') : 20;//$this->_request->getPost('limit');
        $start = 0;//($this->_request->getPost('start')) ? $this->_request->getPost('start') : 0;//$this->_request->getPost('start');
        $datos = $this->model[0]->GetPorLimite(
                $start, $limit, $idtdoc, $idusuariosession
        );
        if ($datos['total'] > 0) {
            echo json_encode(
                    array('total' => $datos['total'], 'datos' => $datos['datos'])
            );
        } else {
            echo json_encode(array('total' => 0, 'datos' => array()));
        }
    }

    //Funcion para cargar los estados sin asociar el tipo documento
    function cargarestadosasocAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtdoc = $this->_request->getPost('idtdoc');
        $datos = Array();
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $datos = $this->model[0]->GetPorLimiteEstado(
                $start, $limit, $idtdoc, $idusuariosession
        );
        if ($datos['total'] > 0) {
            echo json_encode(
                    array('total' => $datos['total'], 'datos' => $datos['datos'])
            );
        } else {
            echo json_encode(array('total' => 0, 'datos' => array()));
        }
    }

    //Funcion para asociar un estado al tipo documento
    function asociarestadotdocAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idtdoc = $this->_request->getPost('idtdoc');
        $arrEst = json_decode(stripslashes($this->_request->getPost('arrEst')));
        foreach ($arrEst as $index => $row) {
            $idusuariosession = $this->global->Perfil->idusuario;
            $confdocdatestado = new ConfDocDatEstado();
            $confdocdatestado->idtipodoc = $idtdoc;
            $confdocdatestado->idestado = $row;
            $confdocdatestado->idautor = $idusuariosession;
            $this->model[6]->Insertar($confdocdatestado);
        }
        echo("{'codMsgE':1}");
    }

    function desasociarestadotdocAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idtdoc = $this->_request->getPost('idtdoc');
        $arrEst = json_decode(stripslashes($this->_request->getPost('arrEst')));
        $puedeeliminar = 1;
        $canteliminados = 0;
        if (isset($arrEst)) {
            foreach ($arrEst as $index => $row) {
                $cantestadoentransicion
                        = $this->model[2]->ExisteEstadoEnTransicion($row, $idtdoc);
                if ($cantestadoentransicion > 0) {
                    $puedeeliminar = 0;
                } else {
                    $existeasoc = Doctrine::getTable('ConfDocDatEstado')
                            ->findByDql("idtipodoc = $idtdoc AND idestado = $row");
                    if (isset($existeasoc[0]->idestado)) {
                        $existeasoc->delete();
                        $canteliminados++;
                    }
                }
            }
            if ($canteliminados > 0) {
                $respuesta = 1;
            }
            if ($canteliminados == 0) {
                $respuesta = 2;
            }
            echo("{'codMsgE':" . $respuesta . "}");
        }
    }

    function adicionarestadoAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $denom = $this->_request->getPost('denominacion');
        $datestado = new DatEstado();
        $datestado->denominacion = $denom;
        $datestado->idautor = $idusuariosession;
        $deno = "'" . $denom . "'";
        $est = Doctrine::getTable('DatEstado')->findByDql(
                " denominacion = $deno"
        );
        $denominacion = $est[0]->denominacion;
        if ($denominacion == $denom) {
            echo("{'codMsgE':2}");
        } else {
            if ($this->model[1]->Insertar($datestado)) {
                echo("{'codMsgE':1}");
            } else {
                echo("{'codMsgE':3}");
            }
        }
    }

    function eliminarestadoAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $noeliminados = 0;
        $idestado = json_decode(
                stripslashes(
                        $this->_request->getPost('idestado')
                )
        );
        foreach ($idestado as $estado) {
            if (!$this->model[3]->ExisteDocumentosConEstado($estado)) {
                $datestado = Doctrine::getTable('DatEstado')->find($estado);
                if (isset($datestado->idestado)) {
                    try {
                        $datestado->delete();
                    } catch (Exception $e) {
                        
                    }
                }
            } else {
                $noeliminados += 1;
            }
        }
        if ($noeliminados == 0) {
            if (count($idestado) > 1) {
                echo("{'codMsgE':1,mensaje:'Los estados han sido eliminados satisfactoriamente.'}");
            } else {
                echo("{'codMsgE':1,mensaje:'El estado ha sido eliminado satisfactoriamente.'}");
            }
        } else {
            if ($noeliminados == count($idestado)) {
                if (count($idestado) > 1) {
                    echo("{'codMsgE':3,mensaje:'Los estados no se pueden eliminar debido a que estan en uso.'}");
                } else {
                    echo("{'codMsgE':3,mensaje:'El estado no se puede eliminar debido a que esta en uso.'}");
                }
            } else {
                echo("{'codMsgE':2,mensaje:'Algunos de los estados no se pueden eliminar debido a que estan en uso.'}");
            }
        }
    }

    function modificarestadoAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idestado = $this->_request->getPost('idestado');
        $denom = $this->_request->getPost('denominacion');
        $datestado = Doctrine::getTable('DatEstado')->find($idestado);
        $datestado->denominacion = $denom;
        $deno = "'" . $denom . "'";
        $est = Doctrine::getTable('DatEstado')->findByDql(
                " denominacion = $deno"
        );
        $denominacion = $est[0]->denominacion;
        $id = $est[0]->idestado;
        if ($denominacion == $denom && $id != $idestado) {
            echo("{'codMsgA':2}");
        } else {
            if ($this->model[1]->Actualizar($datestado)) {
                echo("{'codMsgD':1}");
            } else {
                echo("{'codMsgC':3'}");
            }
        }
    }

    function modificarestadoinicialAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtipodoc = $this->_request->getPost('idtdoc');
        $idestado = $this->_request->getPost('idestado');
        $valor = $this->_request->getPost('valor');
        $this->model[3]->Actualizar(
                $idestado, $idtipodoc, $idusuariosession, $valor
        );
        if ($valor != 0) {
            $idaprob = $this->model[0]->EstadoPorDefecto(
                    $idusuariosession, $idtipodoc
            );
            $idaprob = $idaprob[0]['idestado'];
            $this->model[0]->actualizarElemSinEstadAprov(
                    $idaprob, $idusuariosession, $idtipodoc
            );
        }
        echo("{'codMsgE':1}");
    }

    function modificarestadogeneradorAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idtipodoc = $this->_request->getPost('idtdoc');
        $idestado = $this->_request->getPost('idestado');
        $valor = $this->_request->getPost('valor');
        $this->model[3]->ActualizarNotificacion(
                $idestado, $idtipodoc, $idusuariosession, $valor
        );
        //obtengo los arrays de estados siguentes y anteriores
        $obj = new WorkflowServices();
        $arraysiguentes = $obj->EstadosSiguientesDadoEstado($idestado);
        $arrayanteriores = $obj->EstadosAnterioresDadoEstado($idestado);
        //llamada al servicio que modifica la bandera de los elementos que 
        //conciden con el tipo y el estado este entre los siguentes o los anteriores.
        $this->integrator->planificacion->ModificarBanderaDeNotificacion(
                $idtipodoc, $arraysiguentes, $arrayanteriores
        );
        echo("{'codMsgE':1}");
    }

    function modificarEstadoControlAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $params->idusuariosession = $this->global->Perfil->idusuario;
        $params->idtipodoc = $this->_request->getPost('idtdoc');
        $params->idestado = $this->_request->getPost('idestado');
        $params->valor = $this->_request->getPost('valor');
        //obtengo los arrays de estados siguentes y anteriores
        $obj = new WorkflowServices();
        $params->siguentes = $obj->EstadosSiguientesDadoEstado(
                $params->idestado
        );
        $params->anteriores = $obj->EstadosAnterioresDadoEstado(
                $params->idestado
        );
        //llamada al servicio que modifica la bandera de los elementos que
        //conciden con el tipo y el estado este entre los siguentes o los anteriores.
        $this->model[3]->actualizarControl($params);
        $this->model[3]->modificarControlCambio($params);
        echo("{'codMsgE':1}");
    }

    function cargarusuariosubordinadosAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $iddominio = $this->global->Perfil->iddominio;
        $idtipodoc = $this->_request->getPost('idtipodoc');
        $idestado = $this->_request->getPost('idestado');
        $arraysubordinados
                = $this->integrator->planificacion->UsuariosSubordinados(
                $idusuariosession
        );
        $arraysub = array();
        $key = 0;
        if (isset($arraysubordinados[0])) {
            foreach ($arraysubordinados as $subordinado) {
                $inicial = 0;
                $final = 0;
                $idusuario = $subordinado['idpsobre'];
                $objrestriccion = Doctrine::getTable('DatRestricciones')
                        ->findByDql(
                        " idestado = '$idestado' AND idtipodoc = '$idtipodoc' AND idusuario = '$idusuario'"
                );
                if (isset($objrestriccion[0]) && $objrestriccion[0]->idusuario != ''
                ) {
                    $inicial = $objrestriccion[0]->estadoinicial;
                    $final = $objrestriccion[0]->estadofinal;
                }
                $arraysub[$key]['idusuario'] = $subordinado['idpsobre'];
                $arraysub[$key]['denominacion']
                        = $this->integrator->seguridad->nombreUsuario(
                        $subordinado['idpsobre']
                );
                $arraysub[$key]['inicial'] = $inicial;
                $arraysub[$key]['tipo'] = 1;
                $arraysub[$key]['fueinicial'] = $inicial;
                $arraysub[$key]['finall'] = $final;
                $arraysub[$key++]['fuefinal'] = $final;
            }
        }

        /*******************
           Para el user logueado
         ***********************/

      $objrestriccion = Doctrine::getTable('DatRestricciones')
                                ->findByDql(
                                  " idestado = '$idestado' AND idtipodoc = '$idtipodoc' AND idusuario = '$idusuariosession'"
                                );
      if (isset($objrestriccion[0]) && $objrestriccion[0]->idusuario != ''
      ) {
        $inicial = $objrestriccion[0]->estadoinicial;
        $final = $objrestriccion[0]->estadofinal;
      }
      $arraysub[$key]['idusuario'] = $idusuariosession;
      $arraysub[$key]['denominacion']
                                   = $this->integrator->seguridad->nombreUsuario(
        $idusuariosession
      );
      $arraysub[$key]['inicial'] = $inicial;
      $arraysub[$key]['tipo'] = 1;
      $arraysub[$key]['fueinicial'] = $inicial;
      $arraysub[$key]['finall'] = $final;
      $arraysub[$key++]['fuefinal'] = $final;


        /****************************
        *******************************/

//        $entidades = $this->integrator->seguridad->getIdsEntityByUser(
//                $idusuariosession
//        );
//        if (isset($entidades[0])) {
//            foreach ($entidades as $value) {
//                $inicial = 0;
//                $final = 0;
//                $objrestriccion = Doctrine::getTable(
//                                'DatRestriccionesestructura'
//                        )->findByDql(
//                        " idestado = '$idestado' AND idtipodoc = '$idtipodoc'
//                        AND idestructura = '$value'"
//                );
//                if (isset($objrestriccion[0]) && $objrestriccion[0]->idestructura != ''
//                ) {
//                    $inicial = $objrestriccion[0]->estadoinicial;
//                    $final = $objrestriccion[0]->estadofinal;
//                }
//                $aux = Array();
//                $aux[] = $value;
//                $arrayidcargos
//                        = $this->integrator->metadatos->obtenerCargosEstructuraInmediatos(
//                        $aux, $iddominio
//                );
//                if (count($arrayidcargos) > 0) {
//                    $entidad = $this->integrator->metadatos->DameEstructura(
//                            $value
//                    );
//                    if ($entidad[0]->idtipo != 7) {
//                        $arraysub[$key]['idestructura'] = $value;
//                        $arraysub[$key]['tipo'] = 2;
//                        $arraysub[$key]['inicial'] = $inicial;
//                        $arraysub[$key]['denominacion']
//                                = $entidad[0]->denominacion;
//                        $arraysub[$key]['fueinicial'] = $inicial;
//                        $arraysub[$key]['finall'] = $final;
//                        $arraysub[$key++]['fuefinal'] = $final;
//                    }
//                }
//            }
//        }
        echo json_encode(
                array('total' => count($arraysub), 'campos' => $arraysub)
        );
    }

    function configurarrestriccionesAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arraycambios = json_decode(
                stripslashes($this->_request->getPost('arraycambios'))
        );
        $idestado = $this->_request->getPost('idestado');
        $idtipodoc = $this->_request->getPost('idtipodoc');
        $objrestmodel = new DatRestriccionesModel();
        $respuesta = $objrestmodel->ConfigurarRestricciones(
                $arraycambios, $idestado, $idtipodoc
        );
        echo json_encode(array('mensaje' => $respuesta));
    }

    function cargarcondicionesAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idestado = $this->_request->getPost('idestado');
        $tipocondicion = $this->_request->getPost('tipocondicion');
        $objconidcionmodel = new NomCondicionModel();
        $arraycondiciones = $objconidcionmodel->CargarCondiciones(
                $idestado, $tipocondicion
        );
        if (isset($arraycondiciones[0])) {
            echo json_encode(
                    array('total' => count($arraycondiciones),
                        'campos' => $arraycondiciones)
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    function cargarusuariospostAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $idestado = $this->_request->getPost('idestado');
        $parametros->iddominio = $this->global->Perfil->iddominio;
        $parametros->integrator = $this->integrator;
        $objcondmodel = new NomCondicionModel();
        $arraysubordinados = $objcondmodel->CargarUsuariosPost(
                $idusuario, $idestado, $parametros
        );
        if (isset($arraysubordinados[0])) {
            echo json_encode(
                    array('total' => count($arraysubordinados),
                        'campos' => $arraysubordinados)
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    function configurarpostaccionesAction() {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idpostcondicion = $this->_request->getPost('idpostcondicion');
        $ejecutarpostcond = $this->_request->getPost('ejecutarpostcond');
        $idestado = $this->_request->getPost('idestado');
        $arraysubordinadospost = json_decode(
                stripslashes($this->_request->getPost('arraysubordinadospost'))
        );
        if (isset($arraysubordinadospost[0])) {
            if ($ejecutarpostcond == true) {
                foreach ($arraysubordinadospost as $subordinadopost) {
                    $idusuario = $subordinadopost->idusuario;

                    if ($subordinadopost->modificar == true || $subordinadopost->eliminar == true
                    ) {
                        $modificar = 0;
                        if ($subordinadopost->modificar == true) {
                            $modificar = 1;
                        }
                        $eliminar = 0;
                        if ($subordinadopost->eliminar == true) {
                            $eliminar = 1;
                        }
                        if ($subordinadopost->tipo == 1) {
                            $objs = Doctrine::getTable('DatPostconacceso')
                                    ->findByDql(
                                    "idestado = $idestado AND idusuario = $idusuario"
                            );
                            if (isset($objs[0]->idpostconacceso) && $objs[0]->idpostconacceso != '' && $objs[0]->idpostconacceso != null
                            ) {
                                $objs[0]->eliminar = $eliminar;
                                $objs[0]->modificar = $modificar;
                                $objs[0]->save();
                            } else {
                                $objpostconacceso = new DatPostconacceso();
                                $objpostconacceso->idcondicion
                                        = $idpostcondicion;
                                $objpostconacceso->idestado = $idestado;
                                $objpostconacceso->eliminar = $eliminar;
                                $objpostconacceso->modificar = $modificar;
                                $objpostconacceso->idusuario = $idusuario;
                                $objpostconacceso->save();
                            }
                        } else {
                            $objs = Doctrine::getTable(
                                            'DatPostconaccesoestructura'
                                    )->findByDql(
                                    "idestado = $idestado AND idestructura = $idusuario"
                            );
                            if (isset($objs[0]->idpostconacceso) && $objs[0]->idpostconacceso != '' && $objs[0]->idpostconacceso != null
                            ) {
                                $objs[0]->eliminar = $eliminar;
                                $objs[0]->modificar = $modificar;
                                $objs[0]->save();
                            } else {
                                $objpostconacceso
                                        = new DatPostconaccesoestructura();
                                $objpostconacceso->idcondicion
                                        = $idpostcondicion;
                                $objpostconacceso->idestado = $idestado;
                                $objpostconacceso->eliminar = $eliminar;
                                $objpostconacceso->modificar = $modificar;
                                $objpostconacceso->idestructura = $idusuario;
                                $objpostconacceso->save();
                            }
                        }
                    } else {
                        if ($subordinadopost->tipo == 1) {
                            $objs = Doctrine::getTable('DatPostconacceso')
                                    ->findByDql(
                                    "idestado = $idestado AND idusuario = $idusuario"
                            );
                        } else {
                            $objs = Doctrine::getTable(
                                            'DatPostconaccesoestructura'
                                    )->findByDql(
                                    "idestado = $idestado AND idestructura = $idusuario"
                            );
                        }
                        $objs[0]->delete();
                    }
                }
            } else {
                $existenconfig = Doctrine::getTable('DatPostconacceso')
                        ->findByDql("idestado = $idestado");
                $existenconfigestruc = Doctrine::getTable(
                                'DatPostconaccesoestructura'
                        )->findByDql("idestado = $idestado");
                if (isset($existenconfig[0]->idpostconacceso) && $existenconfig[0]->idpostconacceso != null && $existenconfig[0]->idpostconacceso != ''
                ) {
                    foreach ($existenconfig as $config) {
                        $config->delete();
                    }
                }
                if (isset($existenconfigestruc[0]->idpostconacceso) && $existenconfigestruc[0]->idpostconacceso != null && $existenconfigestruc[0]->idpostconacceso != ''
                ) {
                    foreach ($existenconfigestruc as $config) {
                        $config->delete();
                    }
                }
            }
            $respuesta = 1;
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

}

