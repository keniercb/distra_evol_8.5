<?php

class GestionarflujodetrabajoController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
        $this->model[] = new DatSubsistemaModel(); //0
        $this->model[] = new ConfDocModel(); //1
        $this->model[] = new DatEstado(); //2
        $this->model[] = new DatTransicion(); //3
        $this->model[] = new DatTransicionModel(); //4
        //$this->model[] = new DatCondicionModel(); //5
        $this->model[] = new ConfUsuarioModel(); //6
        $this->model[] = new ConfUsuarioConfDocDatEstadoModel(); //7
        $this->model[] = new DatTransicionConfUsuarioModel(); //8
        $this->model[] = new ConfUsuario(); //9
        $this->model[] = new ConfUsuarioConfDocDatEstado(); //10
        //$this->model[] = new DatCondicion(); //11
        $this->model[] = new DatTransicionConfUsuario(); //12
        $this->model[] = new UtilidadesModel(); //13
    }

    function gestionarflujodetrabajoAction()
    {
        $this->render();
    }

    // Cargar tipo Documentos
    public function cargargridconfflujoAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $tipodoc = null;
        $idsub = $this->_request->getPost('idsub');
        $tipodoc->data = $this->model[1]->cargarTipoDoc($idsub);
        echo json_encode($tipodoc);
    }

    //Cargar las transiciones asociadas tipo de documento
    public function cargargridtransAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idtipodoc = $this->_request->getPost('idtdoc');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $data = $this->model[3]->CargarTransicionTDoc(
            $start, $limit, $idtipodoc
        );
        echo json_encode($data);
    }

    //Cargar estados en los combos de inicia/final para la transicion
    //Adicionar una transaccion al tipo documento
    public function adicionartransAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        try {
            $idusuariosession = $this->global->Perfil->idusuario;
            $idtipodoc = $this->_request->getPost('idtdoc');
            $idestadof = $this->_request->getPost('estfinal');
            $idestadoi = $this->_request->getPost('estinicial');
            $arruser = json_decode(
                stripslashes($this->_request->getPost('user'))
            );
            if ($this->model[3]->ExisteTrans($idestadoi, $idestadof, $idtipodoc)
                == 0
            ) {
                $dattrans = new DatTransicion();
                $dattrans->idtipodoc = $idtipodoc;
                $dattrans->idestadofinal = $idestadof;
                $dattrans->idestadoinicial = $idestadoi;
                $dattrans->idautor = $idestadoi;
                //Inserta la Transicion
                if ($this->model[4]->Insertar($dattrans)) {
                    $r = $this->model[3]->GetIDTrans();
                    $idtrans = $r[0]['max'];
                    foreach ($arruser as $number => $row) {
                        if ($this->model[9]->ExisteUsuario($row->iduser) == 0) {
                            $confuser = new ConfUsuario();
                            $confuser->idusuario = $row->iduser;
                            $confuser->nombre = $row->nombre;
                            //Insertar Usuario
                            $this->model[6]->Insertar($confuser);
                        }
                        for ($i = 0; $i < 2; $i++) {
                            $confuserdoc = new ConfUsuarioConfDocDatEstado();
                            $confuserdoc->idtipodoc = $idtipodoc;
                            $confuserdoc->idusuario = $row->iduser;
                            if ($i == 0) {
                                $confuserdoc->idestado = $idestadoi;
                                $confuserdoc->tipo = 0;
                            } else {
                                $confuserdoc->idestado = $idestadof;
                                $confuserdoc->tipo = 1;
                            }
                            if ($this->model[10]->ExisteUsuarioDocEstado(
                                    $confuserdoc->idusuario,
                                    $confuserdoc->idestado,
                                    $confuserdoc->idtipodoc
                                ) == 0
                            ) {
                                //Insertar ConfDoc_CofUsuario_DatEstado
                                $this->model[7]->Insertar($confuserdoc);
                            } else {
                                if ($i == 1) {
                                    $this->model[10]->updateModificar(
                                        $confuserdoc->idtipodoc,
                                        $confuserdoc->idestado,
                                        $confuserdoc->idusuario
                                    );
                                }
                            }
                        }
                        $dattranuser = new DatTransicionConfUsuario();
                        $dattranuser->idtransicion = $idtrans;
                        $dattranuser->idusuario = $row->iduser;
                        if ($row->mod) {
                            $dattranuser->simultaneo = 1;
                        } else {
                            $dattranuser->simultaneo = 0;
                        }
                        //Insertar DatTransicion ConfUsuario
                        $this->model[8]->Insertar($dattranuser);
                    }
                    echo '{"codMsgF":1}';
                }
            } else {
                echo '{"codMsgF":2}';
            }
        } catch (Doctrine_Exception $ee) {
            echo '{"codMsgF":2}';
            //print_r($ee);
        }
    }

    // Cargar tree Subsistemas
    public function cargarsubsistemasAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        //$idestructuracomun = $this->global->Estructura->idestructura;
        // $subsistemas = $this->integrator->parametros->ObtenerSubsistemasCont($idestructuracomun);
        $subsistemas = $this->model[0]->cargarSubsistema();
        $datos = Array();
        foreach ($subsistemas as $number => $row) {
            $datos[$number]['text'] = $row['densubsistema'];
            $datos[$number]['id'] = $row['idsubsistema'];
            $datos[$number]['leaf'] = 'false';
        }
        echo json_encode($datos);
    }

    //Obtener los servicios del subsistema Seleccionado en el tree
    function obtenerserviciosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos = Array(); //1
        $idsub = $this->_request->getPost('idsub'); //1
        $ioCXML = $this->cargarXML('ioc'); //1
        if ($ioCXML) {//2
            $subsistemas = $ioCXML->children(); //3
            $modulos = $subsistemas->workflow->children(); //3
            for ($j = 0; $j < count($modulos); $j++) {//4
                if ($modulos[$j]['id'] == $idsub) {//5
                    $servicios = $modulos[$j]->children(); //6
                    for ($k = 0; $k < count($servicios); $k++) {//7
                        $datos[$k]['condicion'] = $servicios[$k]->getName(); //8
                    }
                    break;
                }//9
            }
            $resp['data'] = $datos; //10
            $_SESSION['arrCondiciones'] = $resp; //10
            echo json_encode($resp); //10
        }//11
    }

//12

    function cargarXML($xmlname)
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        static $xml;
        if (!isset($xml)) {
            $xml = array();
        }
        try {
            if (!$xml[$xmlname]) {
                $xml[$xmlname] = ZendExt_FastResponse::getXML($xmlname);
            }
            return $xml[$xmlname];
        } catch (Exception $e) {
            return;
        }
    }

    //Cargar el grid servicio para modificar la transicion seleccionadas
    function cargarserviciosmodtransAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $datos = Array();
        $idsub = $this->_request->getPost('idsub');
        $idtrans = $this->_request->getPost('idtrans');
        $result = $this->model[11]->GetCondiciones($idtrans);
        $arrtodocond = $_SESSION['arrCondiciones'];
        foreach ($result as $index => $row) {
            if ($row['tipo'] == 0) {
                $row['pre'] = 1;
                $row['pos'] = 0;
            } else {
                $row['pre'] = 0;
                $row['pos'] = 1;
            }
            $datos[] = $row;
        }

        foreach ($arrtodocond['data'] as $r) {
            $flag = false;
            foreach ($datos as $line) {
                if ($r['condicion'] == $line['condicion']) {
                    $flag = true;
                    $resp['data'][] = $line;
                }
            }
            if ($flag == false) {
                $resp['data'][] = $r;
            }
        }
        echo json_encode($resp);
    }

    function obtenerusuariosmodtransAction()
    {
        $datos['data'] = Array();
        $idsub = $this->_request->getPost('idsub');
        $idtrans = $this->_request->getPost('idtrans');
        $result = $this->model[9]->GetUsuario($idtrans);
        $arrusertodo = $_SESSION['arrUsuario'];
        foreach ($result['data'] as $row) {
            switch ($row['simultaneo']) {
                case 0: {
                    $row['ver'] = 1;
                    $row['mod'] = 0;
                }
                    break;
                case 1: {
                    $row['ver'] = 0;
                    $row['mod'] = 1;
                }
                    break;
            }
            $row['nombreusuario'] = $row['nombre'];
            $datos[] = $row;
        }
        foreach ($arrusertodo['data'] as $row) {
            $flag = false;
            foreach ($datos as $line) {
                if ($row['idusuario'] == $line['idusuario']) {
                    $flag = true;
                    $resp['data'][] = $line;
                }
            }
            if ($flag == false) {
                $resp['data'][] = $row;
            }
        }
        echo json_encode($resp);
    }

    //----------------------------------------------
    function cargartransicionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idestadoinicial = $this->_request->getPost('idestadoinicial');
        $idestadofinal = $this->_request->getPost('idestadofinal');
        $tipodocplan = $this->_request->getPost('tipodocplan');
        $tipodocobjetivo = $this->_request->getPost('tipodocobjetivo');
        $tipodocactividad = $this->_request->getPost('tipodocactividad');
        $arrayautoresbusqueda = json_decode(
            stripslashes($this->_request->getPost('tipodocactividad'))
        );
        $arrayusuariosasocbusqueda = json_decode(
            stripslashes($this->_request->getPost('arrayusuariosasocbusqueda'))
        );
        if (isset($arrayusuariosasocbusqueda[0])) {
        }
        if (!isset($arrayusuariosasocbusqueda[0])
            && !isset($arrayautoresbusqueda[0])
        ) {
            $arrayautoresasoc[0]['idautor'] = $idusuariosession;
            $arrayusuariosasoc[0]['idusuario'] = $idusuariosession;
        }
        $arraytransiciones = DatTransicion::CargarTransiciones(
            $limit, $start, $idestadoinicial, $idestadofinal, $tipodocplan,
            $tipodocobjetivo, $tipodocactividad, $arrayautoresasoc,
            $arrayusuariosasoc
        );
        if ($arraytransiciones['total'] > 0) {
            foreach ($arraytransiciones['campos'] as $key => $transicion) {
                $eliminar = $modificar = 0;
                $superior = 1;
                if ($idusuariosession == $transicion['idautor']) {
                    $eliminar = $modificar = 1;
                    $superior = 0;
                }
                $nombreestadoincial = Doctrine::getTable('DatEstado')->find(
                    $transicion['idestadoinicial']
                )->denominacion;
                $nombreestadofinal = Doctrine::getTable('DatEstado')->find(
                    $transicion['idestadofinal']
                )->denominacion;
                $arraytransiciones['campos'][$key]['nombreautor']
                    = $this->pIntegrator->configuracionpdo->getDenominacionIdUsuario(
                    $transicion['idautor'], 'usuario', null
                );
                $arraytransiciones['campos'][$key]['nombreestadoinicial']
                    = $nombreestadoincial;
                $arraytransiciones['campos'][$key]['nombreestadofinal']
                    = $nombreestadofinal;
                $arraytransiciones['campos'][$key]['modificar']
                    = 1; //$modificar;
                $arraytransiciones['campos'][$key]['eliminar'] = $eliminar;
                $arraytransiciones['campos'][$key]['superior'] = $superior;
            }
            echo json_encode(
                array('total'  => $arraytransiciones['total'],
                      'campos' => $arraytransiciones['campos'])
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    function adicionartransicionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $idusuariosarelacionar = json_decode(
            stripslashes($this->_request->getPost('idusuariosarelacionar'))
        );
        $arraysubordinadospost = json_decode(
            stripslashes($this->_request->getPost('arraysubordinadospost'))
        );
        $idestadoinicial = $this->_request->getPost('idestadoinicial');
        $idestadofinal = $this->_request->getPost('idestadofinal');
        $tipodocplan = $this->_request->getPost('tipodocplan');
        $tipodocobjetivo = $this->_request->getPost('tipodocobjetivo');
        $tipodocactividad = $this->_request->getPost('tipodocactividad');
        $idpostcondicion = $this->_request->getPost('idpostcondicion');
        $ejecutarpostcond = $this->_request->getPost('ejecutarpostcond');
        $error = 0;
        //verifico que los estados esten asociados con los tipos de documentos
        if ($tipodocplan) {
            $existeasociacionestadoinicial
                = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                0, $idestadoinicial
            );
            $existeasociacionestadofinal
                = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                0, $idestadofinal
            );
            if (!isset($existeasociacionestadoinicial[0])
                || !isset($existeasociacionestadofinal[0])
            ) {
                $error = 1;
                $respuesta = 2;
            }
        }
        if ($tipodocobjetivo) {
            $existeasociacionestadoinicial
                = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                1, $idestadoinicial
            );
            $existeasociacionestadofinal
                = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                1, $idestadofinal
            );
            if (!isset($existeasociacionestadoinicial[0])
                || !isset($existeasociacionestadofinal[0])
            ) {
                $error = 1;
                $respuesta = 2;
            }
        }
        if ($tipodocactividad) {
            $existeasociacionestadoinicial
                = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                3, $idestadoinicial
            );
            $existeasociacionestadofinal
                = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                3, $idestadofinal
            );
            if (!isset($existeasociacionestadoinicial[0])
                || !isset($existeasociacionestadofinal[0])
            ) {
                $error = 1;
                $respuesta = 2;
            }
        }
        $existetransicion = Doctrine::getTable('DatTransicion')->findByDql(
            "idestadoinicial = '$idestadoinicial' AND idestadofinal = '$idestadofinal'"
        );
        if (isset($existetransicion[0]->idtransicion)
            && $existetransicion[0]->idtransicion != ''
        ) {
            $error = 1;
            $respuesta = 3;
        }
        if ($error == 0) {
            $objtransicion = new DatTransicion();
            $objtransicion->idestadoinicial = $idestadoinicial;
            $objtransicion->idestadofinal = $idestadofinal;
            $objtransicion->idautor = $idusuariosession;
            $objtransicion->tipodocplan = $tipodocplan;
            $objtransicion->tipodocobjetivo = $tipodocobjetivo;
            $objtransicion->tipodocactividad = $tipodocactividad;
            $objtransicion->save();
            $idtransicion = $objtransicion->idtransicion;
            //relaciono la transicion con los usuarios
            if (isset($idusuariosarelacionar[0])) {
                foreach ($idusuariosarelacionar as $idusuario) {
                    if ($idusuario->tipo == 1) {
                        $iduser = $idusuario->idusuario;
                        $objtransicionusuario = new DatTransicionConfUsuario();
                        $objtransicionusuario->idtransicion = $idtransicion;
                        $objtransicionusuario->idusuario = $iduser;
                        $objtransicionusuario->simultaneo = 0;
                        $objtransicionusuario->save();
                        $this->AsociarUsuariosAEstadosTipodocTransicion(
                            $tipodocplan, $tipodocobjetivo, $tipodocactividad,
                            $idestadoinicial, $idestadofinal, $iduser,
                            $idtransicion
                        );
                    } else {
                        $iduser = $idusuario->idusuario;
                        $objtransicionusuario = new DatTransicionConfEstructura(
                        );
                        $objtransicionusuario->idtransicion = $idtransicion;
                        $objtransicionusuario->idestructura = $iduser;
                        $objtransicionusuario->simultaneo = 0;
                        $objtransicionusuario->save();
                        $this->AsociarEstructurasAEstadosTipodocTransicion(
                            $tipodocplan, $tipodocobjetivo, $tipodocactividad,
                            $idestadoinicial, $idestadofinal, $iduser,
                            $idtransicion
                        );
                    }
                }
            }
            $respuesta = 1;
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    function modificartransicionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idtransicion = $this->_request->getPost('idtransicion');
        $tipodocplan = $this->_request->getPost('tipodocplan');
        $tipodocobjetivo = $this->_request->getPost('tipodocobjetivo');
        $tipodocactividad = $this->_request->getPost('tipodocactividad');
        $arraysubordinadospost = json_decode(
            stripslashes($this->_request->getPost('arraysubordinadospost'))
        );
        $idpostcondicion = $this->_request->getPost('idpostcondicion');
        $ejecutarpostcond = $this->_request->getPost('ejecutarpostcond');
        $objtransicion = Doctrine::getTable('DatTransicion')->find(
            $idtransicion
        );
        if (isset($objtransicion->idtransicion)) {
            $idestadoinicial = $objtransicion->idestadoinicial;
            $idestadofinal = $objtransicion->idestadofinal;
            $error = 0;
            //verifico que los estados esten asociados con los tipos de documentos
            if ($tipodocplan) {
                $existeasociacionestadoinicial
                    = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                    0, $idestadoinicial
                );
                $existeasociacionestadofinal
                    = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                    0, $idestadofinal
                );
                if (!isset($existeasociacionestadoinicial[0])
                    || !isset($existeasociacionestadofinal[0])
                ) {
                    $error = 1;
                    $respuesta = 2;
                }
            }
            if ($tipodocobjetivo) {
                $existeasociacionestadoinicial
                    = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                    1, $idestadoinicial
                );
                $existeasociacionestadofinal
                    = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                    1, $idestadofinal
                );
                if (!isset($existeasociacionestadoinicial[0])
                    || !isset($existeasociacionestadofinal[0])
                ) {
                    $error = 1;
                    $respuesta = 2;
                }
            }
            if ($tipodocactividad) {
                $existeasociacionestadoinicial
                    = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                    3, $idestadoinicial
                );
                $existeasociacionestadofinal
                    = ConfDocDatEstado::VerificarAsociacionDocumentoEstado(
                    3, $idestadofinal
                );
                if (!isset($existeasociacionestadoinicial[0])
                    || !isset($existeasociacionestadofinal[0])
                ) {
                    $error = 1;
                    $respuesta = 2;
                }
            }
            if ($error == 0) {
                $objtransicion->tipodocplan = $tipodocplan;
                $objtransicion->tipodocobjetivo = $tipodocobjetivo;
                $objtransicion->tipodocactividad = $tipodocactividad;
                $objtransicion->save();
                $arrayusuariosasociados = DatTransicionConfUsuario::DameUser(
                    $idtransicion
                );
                if (isset($arrayusuariosasociados[0])) {
                    foreach ($arrayusuariosasociados as $usuarioasociado) {
                        $idusuario = $usuarioasociado['idusuario'];
                        $this->AsociarUsuariosAEstadosTipodocTransicion(
                            $tipodocplan, $tipodocobjetivo, $tipodocactividad,
                            $idestadoinicial, $idestadofinal, $idusuario,
                            $idtransicion
                        );
                    }
                }
                if (isset($arraysubordinadospost[0])) {
                    if ($ejecutarpostcond == true) {
                        foreach ($arraysubordinadospost as $subordinadopost) {
                            $idusuario = $subordinadopost->idusuario;
                            if ($subordinadopost->modificar == true
                                || $subordinadopost->eliminar == true
                            ) {
                                $modificar = 0;
                                if ($subordinadopost->modificar == true) {
                                    $modificar = 1;
                                }
                                $eliminar = 0;
                                if ($subordinadopost->eliminar == true) {
                                    $eliminar = 1;
                                }
                                $objs = Doctrine::getTable('DatPostconacceso')
                                    ->findByDql(
                                        "idtransicion = $idtransicion 
                                            AND idusuario = $idusuario"
                                    );
                                if (isset($objs[0]->idpostconacceso)
                                    && $objs[0]->idpostconacceso != ''
                                    && $objs[0]->idpostconacceso != null
                                ) {
                                    $objs[0]->eliminar = $eliminar;
                                    $objs[0]->modificar = $modificar;
                                    $objs[0]->save();
                                } else {
                                    $objpostconacceso = new DatPostconacceso();
                                    $objpostconacceso->idcondicion
                                        = $idpostcondicion;
                                    $objpostconacceso->idtransicion
                                        = $idtransicion;
                                    $objpostconacceso->eliminar = $eliminar;
                                    $objpostconacceso->modificar = $modificar;
                                    $objpostconacceso->idusuario = $idusuario;
                                    $objpostconacceso->save();
                                }
                            } else {
                                $objs = Doctrine::getTable('DatPostconacceso')
                                    ->findByDql(
                                        "idtransicion = $idtransicion 
                                            AND idusuario = $idusuario"
                                    );
                                $objs[0]->delete();
                            }
                        }
                    } else {
                        $existenconfig = Doctrine::getTable('DatPostconacceso')
                            ->findByDql("idtransicion = $idtransicion");
                        if (isset($existenconfig[0]->idpostconacceso)
                            && $existenconfig[0]->idpostconacceso != null
                            && $existenconfig[0]->idpostconacceso != ''
                        ) {
                            foreach ($existenconfig as $config) {
                                $config->delete();
                            }
                        }
                    }
                }
                $respuesta = 1;
            }
        } else {
            $respuesta = 0;
        }
        echo json_encode(array('mensaje' => $respuesta));
    }

    function eliminartransicionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $arraytransicionesseleccionadas = json_decode(
            stripslashes(
                $this->_request->getPost('arraytransicionesseleccionadas')
            )
        );
        if (isset($arraytransicionesseleccionadas[0]->idtransicion)) {
            $eliminadas = 0;
            foreach ($arraytransicionesseleccionadas as $transicion) {
                $idtransicion = $transicion->idtransicion;
                $objtransicion = Doctrine::getTable('DatTransicion')->find(
                    $idtransicion
                );
                if (isset($objtransicion->idtransicion)) {
                    $objtransicion->delete();
                    $eliminadas++;
                }
            }
            if ($eliminadas > 1) {
                $mensaje = 2;
            }
            if ($eliminadas == 1) {
                $mensaje = 1;
            }
            if ($eliminadas == 0) {
                $mensaje = 0;
            }
            echo json_encode(array('mensaje' => $mensaje));
        }
    }

    function cargarcbestadosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuariosession = $this->global->Perfil->idusuario;
        $data = $this->model[2]->CargarEstadosParaTransicion($idusuariosession);
        echo json_encode(array('data' => $data));
    }

    function cargarcbestadosinicialAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $cont = 0;
        $idusuariosession = $this->global->Perfil->idusuario;
        $tipoplan = $this->_request->getPost('plan');
        if ($tipoplan != null) {
            $arrayidtipodoc[$cont] = $tipoplan;
            $cont++;
        }
        $tipoobjetivo = $this->_request->getPost('objetivo');
        if ($tipoobjetivo != null) {
            $arrayidtipodoc[$cont] = $tipoobjetivo;
            $cont++;
        }
        $tipoact = $this->_request->getPost('actividad');
        if ($tipoact != null) {
            $arrayidtipodoc[$cont] = $tipoact;
            $cont++;
        }
        $arrayidtipodoc = implode(',', $arrayidtipodoc);
        $data = $this->model[2]->CargarEstadosParaTransicion($idusuariosession);
        $arraydatos = array();
        $conta = 0;
        if (isset($data[0])) {
            $arrayestadosrestringidos
                = DatRestricciones::ObtenerRestriccionesEstadoInicial(
                $idusuariosession, $arrayidtipodoc
            );

            foreach ($data as $estado) {
                $procede = 1;
                if (isset($arrayestadosrestringidos[0])) {
                    foreach (
                        $arrayestadosrestringidos as $pos => $estadorestringido
                    ) {
                        if ($estado['idestado']
                            == $estadorestringido['idestado']
                        ) {
                            $procede = 0;
                        }
                    }
                }
                if ($procede == 1) {
                    $arraydatos[$conta]['idestado'] = $estado['idestado'];
                    $arraydatos[$conta]['denominacion']
                        = $estado['denominacion'];
                    $conta++;
                }
            }
        }
        echo json_encode(array('data' => $arraydatos));
    }

    function cargarcbestadosfinalAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $cont = 0;
        $idusuariosession = $this->global->Perfil->idusuario;
        $tipoplan = $this->_request->getPost('plan');
        if ($tipoplan != null) {
            $arrayidtipodoc[$cont] = $tipoplan;
            $cont++;
        }
        $tipoobjetivo = $this->_request->getPost('objetivo');
        if ($tipoobjetivo != null) {
            $arrayidtipodoc[$cont] = $tipoobjetivo;
            $cont++;
        }
        $tipoact = $this->_request->getPost('actividad');
        if ($tipoact != null) {
            $arrayidtipodoc[$cont] = $tipoact;
            $cont++;
        }
        $arrayidtipodoc = implode(',', $arrayidtipodoc);
        $data = $this->model[2]->CargarEstadosParaTransicion($idusuariosession);
        $arraydatos = array();
        $conta = 0;
        if (isset($data[0])) {
            $arrayestadosrestringidos
                = DatRestricciones::ObtenerRestriccionesEstadoFinal(
                $idusuariosession, $arrayidtipodoc
            );
            foreach ($data as $estado) {
                $procede = 1;
                if (isset($arrayestadosrestringidos[0])) {
                    foreach (
                        $arrayestadosrestringidos as $pos => $estadorestringido
                    ) {
                        if ($estado['idestado']
                            == $estadorestringido['idestado']
                        ) {
                            $procede = 0;
                        }
                    }
                }
                if ($procede == 1) {
                    $arraydatos[$conta]['idestado'] = $estado['idestado'];
                    $arraydatos[$conta]['denominacion']
                        = $estado['denominacion'];
                    $conta++;
                }
            }
        }
        echo json_encode(array('data' => $arraydatos));
    }

    //Obtener Usuarios asociados a la transicion
    function cargarusuariosasociadosAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;

        $nombreusuario = $this->global->Perfil->usuario;
        $estamodificando = $this->_request->getPost('estamodificando');
        $idtransicion = $this->_request->getPost('idtransicion');
        $cont = 0;
        if ($estamodificando) {
            $arraysubordinados
                = $this->integrator->planificacion->UsuariosSubordinados(
                $idusuario
            );

            foreach ($arraysubordinados as $subordinado) {
                $estaasociado = 0;
                if ($estamodificando == 1 && $idtransicion) {

                    $idsubordinado = $subordinado['idpsobre'];


                    $existeusuarioentrans = Doctrine::getTable(
                        'DatTransicionConfUsuario'
                    )->findByDql(
                        "idtransicion = $idtransicion
                            AND idusuario = $idsubordinado"
                    );
                    if (!$existeusuarioentrans) {

                        $existeusuarioentrans = Doctrine::getTable(
                            'DatTransicionConfUsuario'
                        )->findByDql(
                            "idtransicion = $idtransicion
                                AND idusuario = $idusuario"
                        );
                    }
                    if (isset($existeusuarioentrans[0]->idusuario)
                        && $existeusuarioentrans[0]->idusuario != ''
                    ) {
                        $objpermiso = new GestionarpermisosModel();
                        $arrayusuariosasociados[$cont]['idusuario']
                            = $subordinado['idpsobre'];
                        $arrayusuariosasociados[$cont]['tipo'] = 1;
                        $arrayusuariosasociados[$cont]['denominacion']
                            /* = $this->integrator->seguridad->nombreUsuario(
                              $subordinado['idpsobre']
                              ); */
                            = $objpermiso->DameDenominacion(
                            $subordinado['idpsobre'], 'usuario'
                        );
                        $cont++;
                    }
                }
            }
            $existeusuarioentransa = Doctrine::getTable(
                'DatTransicionConfUsuario'
            )->findByDql(
                "idtransicion = $idtransicion AND idusuario = $idusuario"
            );
            if (isset($existeusuarioentransa[0]->idusuario)
                && $existeusuarioentransa[0]->idusuario != ''
            ) {
                $objpermiso = new GestionarpermisosModel();
                $arrayusuariosasociados[$cont]['idusuario'] = $idusuario;
                $arrayusuariosasociados[$cont]['tipo'] = 1;
                $arrayusuariosasociados[$cont++]['denominacion']
                    //= $this->integrator->seguridad->nombreUsuario($idusuario);
                    = $objpermiso->DameDenominacion($idusuario, 'usuario');
            }
            $entidades = $this->integrator->seguridad->getIdsEntityByUser(
                $idusuario
            );
            if (isset($entidades[0])) {
                foreach ($entidades as $value) {
                    $estaasociado = 0;
                    if ($estamodificando == 1 && $idtransicion) {
                        $existeestructuraentrans = Doctrine::getTable(
                            'DatTransicionConfEstructura'
                        )->findByDql(
                            " idtransicion = $idtransicion AND idestructura = $value"
                        );

                        if (isset($existeestructuraentrans[0]->idestructura)
                            && $existeestructuraentrans[0]->idestructura != ''
                        ) {
                            $entidad
                                = $this->integrator->metadatos->DameEstructura(
                                $value
                            );
                            $arrayusuariosasociados[$cont]['idestructura']
                                = $value;
                            $arrayusuariosasociados[$cont]['denominacion']
                                = $entidad[0]->denominacion;
                            $arrayusuariosasociados[$cont]['tipo'] = 2;
                            $cont++;
                        }
                    }
                }
            }
        }
        if (isset($arrayusuariosasociados[0])) {
            echo json_encode(
                array('total' => $cont + 1, 'campos' => $arrayusuariosasociados)
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    //Obtener Usuarios asociados a la transicion
    function cargarusuariossinasociarAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $nombreusuario = $this->global->Perfil->usuario;
        $estamodificando = $this->_request->getPost('estamodificando');
        $idtransicion = $this->_request->getPost('idtransicion');
        $arraysubordinados
            = $this->integrator->planificacion->UsuariosSubordinados(
            $idusuario
        );
        $cantsubordinados = count($arraysubordinados);
        $arraysubordinados[$cantsubordinados]['idpsobre'] = $idusuario;
        $arraysubordinados[$cantsubordinados]['denpsobre'] = $nombreusuario;
        $cont = 0;
        if (isset($arraysubordinados[0])) {

            foreach ($arraysubordinados as $subordinado) {
                $estaasociado = 0;
                if ($estamodificando == 1 && $idtransicion) {
                    $idsubordinado = $subordinado['idpsobre'];
                    $existeusuarioentrans = Doctrine::getTable(
                        'DatTransicionConfUsuario'
                    )->findByDql(
                        "idtransicion = $idtransicion AND idusuario = $idsubordinado"
                    );
                    if (isset($existeusuarioentrans[0]->idusuario)
                        && $existeusuarioentrans[0]->idusuario != ''
                    ) {
                        $estaasociado = 1;
                    }
                }
                if ($estaasociado == 0) {
                    $objpermiso = new GestionarpermisosModel();
                    $arrayusuariossinasoc[$cont]['idusuario']
                        = $subordinado['idpsobre'];
                    $arrayusuariossinasoc[$cont]['tipo'] = 1;
                    $arrayusuariossinasoc[$cont]['denominacion']
                        /* = $this->integrator->seguridad->nombreUsuario(
                          $subordinado['idpsobre']
                          ); */
                        = $objpermiso->DameDenominacion(
                        $subordinado['idpsobre'], 'usuario'
                    );
                    $cont++;
                }
            }
        }
//        $entidades = $this->integrator->seguridad->getIdsEntityByUser(
//            $idusuario
//        );
//        if (isset($entidades[0])) {
//            foreach ($entidades as $value) {
//                $estaasociado = 0;
//                if ($estamodificando == 1 && $idtransicion) {
//                    $existeestructuraentrans = Doctrine::getTable(
//                        'DatTransicionConfEstructura'
//                    )->findByDql(
//                        " idtransicion = $idtransicion AND idestructura = $value"
//                    );
//
//                    if (isset($existeestructuraentrans[0]->idestructura)
//                        && $existeestructuraentrans[0]->idestructura != ''
//                    ) {
//                        $estaasociado = 1;
//                    }
//                }
//                if ($estaasociado == 0) {
//                    $aux = Array();
//                    $aux[] = $value;
//                    $arrayidcargos
//                        = $this->integrator->metadatos->obtenerCargosEstructuraInmediatos(
//                        $aux, $iddominio
//                    );
//                    if (count($arrayidcargos) > 0) {
//                        $entidad = $this->integrator->metadatos->DameEstructura(
//                            $value
//                        );
//                        if ($entidad[0]->idtipo != 7) {
//                            $arrayusuariossinasoc[$cont]['idestructura'] = $value;
//                            $arrayusuariossinasoc[$cont]['tipo'] = 2;
//                            $arrayusuariossinasoc[$cont]['inicial'] = $inicial;
//                            $arrayusuariossinasoc[$cont]['denominacion'] = $entidad[0]->denominacion;
//                            $arrayusuariossinasoc[$cont]['fueinicial'] = $inicial;
//                            $arrayusuariossinasoc[$cont]['finall'] = $final;
//                            $arrayusuariossinasoc[$cont++]['fuefinal'] = $final;
//                        }
//                    }
//                }
//            }
//        }
        if (isset($arrayusuariossinasoc[0])) {
            echo json_encode(
                array('total' => $cont + 1, 'campos' => $arrayusuariossinasoc)
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    function cargartransicionmodificarAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idtransicion = $this->_request->getPost('idtransicion');
        $objtransicion = Doctrine::getTable('DatTransicion')->find(
            $idtransicion
        );
        if (isset($objtransicion->idtransicion)) {
            $objestadoinicial = Doctrine::getTable('DatEstado')->find(
                $objtransicion->idestadoinicial
            );
            $objestadofinal = Doctrine::getTable('DatEstado')->find(
                $objtransicion->idestadofinal
            );
            $dat->data [] = array(
                'estadoinicial'    => array('idestado'     => $objtransicion->idestadoinicial,
                                            'denominacion' => $objestadoinicial->denominacion),
                'estadofinal'      => array('idestado'     => $objtransicion->idestadofinal,
                                            'denominacion' => $objestadofinal->denominacion),
                'tipodocplan'      => $objtransicion->tipodocplan,
                'tipodocobjetivo'  => $objtransicion->tipodocobjetivo,
                'tipodocactividad' => $objtransicion->tipodocactividad,
            );
            echo json_encode($dat);
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    function eliminartransicioncancelarAction()
    {
        $idtransicion = $this->_request->getPost('idtransicion');
        $arrayidusuariosparaasoc = json_decode(
            stripslashes($this->_request->getPost('arrayeliminar'))
        );
        foreach ($arrayidusuariosparaasoc as $idusuario) {
            $existeasociacion = Doctrine::getTable('DatTransicionConfUsuario')
                ->findByDql(
                    "idtransicion = '$idtransicion' AND idusuario = '$idusuario'"
                );
            $existeestructuraentrans = Doctrine::getTable(
                'DatTransicionConfEstructura'
            )->findByDql(
                " idtransicion = $idtransicion AND idestructura = $idusuario"
            );
            if (isset($existeasociacion[0]->idtransicion)
                && $existeasociacion[0]->idtransicion != ''
            ) {
                $existeasociacion[0]->delete();
            } else {
                if (isset($existeestructuraentrans[0]->idtransicion)
                    && $existeestructuraentrans[0]->idtransicion != ''
                ) {
                    $existeestructuraentrans[0]->delete();
                }
            }
        }
    }

    function adicionartransicioncancelarAction()
    {
        $idtransicion = $this->_request->getPost('idtransicion');
        $arrayidusuariosparaasoc = json_decode(
            stripslashes($this->_request->getPost('arrayinsertar'))
        );
        foreach ($arrayidusuariosparaasoc as $idestructura) {
            $entidad = $this->integrator->metadatos->DameEstructura(
                $idestructura
            );
            if (count($entidad) != 0) {
                $objestructuratransicion = new DatTransicionConfEstructura();
                $objestructuratransicion->idtransicion = $idtransicion;
                $objestructuratransicion->idestructura = $idestructura;
                $objestructuratransicion->simultaneo = 0;
                $objestructuratransicion->save();
            } else {
                $objusuariotransicion = new DatTransicionConfUsuario();
                $objusuariotransicion->idtransicion = $idtransicion;
                $objusuariotransicion->idusuario = $idestructura;
                $objusuariotransicion->simultaneo = 0;
                $objusuariotransicion->save();
            }
        }
    }

    function asociarusuariosatransicionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idtransicion = $this->_request->getPost('idtransicion');
        $arrayidusuariosparaasoc = json_decode(
            stripslashes($this->_request->getPost('arrayidusuariosparaasoc'))
        );
        $arraytipoidparaasociar = json_decode(
            stripslashes($this->_request->getPost('arraytipoidparaasociar'))
        );
        $objtransicion = Doctrine::getTable('DatTransicion')->find(
            $idtransicion
        );
        if (isset($objtransicion->idtransicion)) {
            foreach ($arrayidusuariosparaasoc as $key => $idusuario) {
                if ($arraytipoidparaasociar[$key] == 0) {
                    $objusuariotransicion = new DatTransicionConfUsuario();
                    $objusuariotransicion->idtransicion = $idtransicion;
                    $objusuariotransicion->idusuario = $idusuario;
                    $objusuariotransicion->simultaneo = 0;
                    $objusuariotransicion->save();
                } else {
                    $objestructuratransicion = new DatTransicionConfEstructura(
                    );
                    $objestructuratransicion->idtransicion = $idtransicion;
                    $objestructuratransicion->idestructura = $idusuario;
                    $objestructuratransicion->simultaneo = 0;
                    $objestructuratransicion->save();
                }
            }
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    function desasociarusuariosatransicionAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idtransicion = $this->_request->getPost('idtransicion');
        $arrayidusuariosparadesasoc = json_decode(
            stripslashes($this->_request->getPost('arrayidusuariosparadesasoc'))
        );
        $objtransicion = Doctrine::getTable('DatTransicion')->find(
            $idtransicion
        );
        if (isset($objtransicion->idtransicion)) {
            foreach ($arrayidusuariosparadesasoc as $idusuario) {
                $existeasociacion = Doctrine::getTable(
                    'DatTransicionConfUsuario'
                )->findByDql(
                    "idtransicion = '$idtransicion' AND idusuario = '$idusuario'"
                );
                $existeestructuraentrans = Doctrine::getTable(
                    'DatTransicionConfEstructura'
                )->findByDql(
                    " idtransicion = $idtransicion AND idestructura = $idusuario"
                );
                if (isset($existeasociacion[0]->idtransicion)
                    && $existeasociacion[0]->idtransicion != ''
                ) {
                    $existeasociacion->delete();
                } else {
                    if (isset($existeestructuraentrans[0]->idtransicion)
                        && $existeestructuraentrans[0]->idtransicion != ''
                    ) {
                        $existeestructuraentrans->delete();
                    }
                }
            }
            echo json_encode(array('mensaje' => 1));
        } else {
            echo json_encode(array('mensaje' => 0));
        }
    }

    function AsociarUsuariosAEstadosTipodocTransicion(
        $tipodocplan, $tipodocobjetivo, $tipodocactividad, $idestadoinicial,
        $idestadofinal, $iduser, $idtransicion
    ) {
        ini_set("max_execution_time", 3600); //3600 1hora
        if ($tipodocplan) {
            //creo la relacion entre el estado, el usuario y el 
            //permiso que tiene sobre el en los planes
            $existecongpermisopinicial = Doctrine::getTable(
                'ConfUsuarioConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadoinicial' AND idusuario = '$iduser'
                AND idtipodoc = 0 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 1;
            if (isset($existecongpermisopinicial[0]->idestado)
                && $existecongpermisopinicial[0]->idestado != ''
            ) {
                if ($nuevovalorpermiso > $existecongpermisopinicial[0]->tipo) {
                    $existecongpermisopinicial[0]->tipo = $nuevovalorpermiso;
                } else {
                    if ($existecongpermisopinicial[0]->tipo == 2) {
                        $existecongpermisopinicial[0]->tipo = 3;
                    }
                }
            } else {
                $objconfdocusuarioestadoinicialp
                    = new ConfUsuarioConfDocDatEstado();
                $objconfdocusuarioestadoinicialp->idtipodoc = 0;
                $objconfdocusuarioestadoinicialp->idusuario = $iduser;
                $objconfdocusuarioestadoinicialp->idestado = $idestadoinicial;
                $objconfdocusuarioestadoinicialp->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestadoinicialp->idtransicion = $idtransicion;
                $objconfdocusuarioestadoinicialp->save();
            }
            //creo la relacion entre el estado, el usuario y el 
            //permiso que tiene sobre el en los planes
            $existecongpermisopfinal = Doctrine::getTable(
                'ConfUsuarioConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadofinal' AND idusuario = '$iduser'
                AND idtipodoc = 0 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 2;
            if (isset($existecongpermisopfinal[0]->idestado)
                && $existecongpermisopfinal[0]->idestado != ''
            ) {
                if ($nuevovalorpermiso > $existecongpermisopfinal[0]->tipo
                    && $existecongpermisopfinal[0]->tipo != 1
                ) {
                    $existecongpermisopfinal[0]->tipo = $nuevovalorpermiso;
                } else {
                    if ($existecongpermisopfinal[0]->tipo == 1) {
                        $existecongpermisopfinal[0]->tipo = 3;
                    }
                }
            } else {
                $objconfdocusuarioestadofinalp
                    = new ConfUsuarioConfDocDatEstado();
                $objconfdocusuarioestadofinalp->idtipodoc = 0;
                $objconfdocusuarioestadofinalp->idusuario = $iduser;
                $objconfdocusuarioestadofinalp->idestado = $idestadofinal;
                $objconfdocusuarioestadofinalp->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestadofinalp->idtransicion = $idtransicion;
                $objconfdocusuarioestadofinalp->save();
            }
        }
        if ($tipodocobjetivo) {
            //creo la relacion entre el estado, el usuario y el 
            //permiso que tiene sobre el en los planes
            $existecongpermisooinicial = Doctrine::getTable(
                'ConfUsuarioConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadoinicial' AND idusuario = '$iduser'
                AND idtipodoc = 1 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 1;
            if (isset($existecongpermisooinicial[0]->idestado)
                && $existecongpermisooinicial[0]->idestado != ''
            ) {
                if ($nuevovalorpermiso > $existecongpermisooinicial[0]->tipo) {
                    $existecongpermisooinicial[0]->tipo = $nuevovalorpermiso;
                } else {
                    if ($existecongpermisooinicial[0]->tipo == 2) {
                        $existecongpermisooinicial[0]->tipo = 3;
                    }
                }
            } else {
                $objconfdocusuarioestado = new ConfUsuarioConfDocDatEstado();
                $objconfdocusuarioestado->idtipodoc = 1;
                $objconfdocusuarioestado->idusuario = $iduser;
                $objconfdocusuarioestado->idestado = $idestadoinicial;
                $objconfdocusuarioestado->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestado->idtransicion = $idtransicion;
                $objconfdocusuarioestado->save();
            }
            //creo la relacion entre el estado, el usuario y el 
            //permiso que tiene sobre el en los planes
            $existecongpermisoofinal = Doctrine::getTable(
                'ConfUsuarioConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadofinal' AND idusuario = '$iduser'
                AND idtipodoc = 1 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 2;
            if (isset($existecongpermisoofinal[0]->idestado)
                && $existecongpermisoofinal[0]->idestado != ''
            ) {
                if ($nuevovalorpermiso > $existecongpermisoofinal[0]->tipo
                    && $existecongpermisoofinal[0]->tipo != 1
                ) {
                    $existecongpermisoofinal[0]->tipo = $nuevovalorpermiso;
                } else {
                    if ($existecongpermisoofinal[0]->tipo == 1) {
                        $existecongpermisoofinal[0]->tipo = 3;
                    }
                }
            } else {
                $objconfdocusuarioestado = new ConfUsuarioConfDocDatEstado();
                $objconfdocusuarioestado->idtipodoc = 1;
                $objconfdocusuarioestado->idusuario = $iduser;
                $objconfdocusuarioestado->idestado = $idestadofinal;
                $objconfdocusuarioestado->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestado->idtransicion = $idtransicion;
                $objconfdocusuarioestado->save();
            }
        }
        if ($tipodocactividad) {
            //creo la relacion entre el estado, el usuario y el 
            //permiso que tiene sobre el en los planes
            $existecongpermisoainicial = Doctrine::getTable(
                'ConfUsuarioConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadoinicial' AND idusuario = '$iduser'
                AND idtipodoc = 3 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 1;
            if (isset($existecongpermisoainicial[0]->idestado)
                && $existecongpermisoainicial[0]->idestado != ''
            ) {
                if ($nuevovalorpermiso > $existecongpermisoainicial[0]->tipo) {
                    $existecongpermisoainicial[0]->tipo = $nuevovalorpermiso;
                }
            } else {
                $objconfdocusuarioestado = new ConfUsuarioConfDocDatEstado();
                $objconfdocusuarioestado->idtipodoc = 3;
                $objconfdocusuarioestado->idusuario = $iduser;
                $objconfdocusuarioestado->idestado = $idestadoinicial;
                $objconfdocusuarioestado->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestado->idtransicion = $idtransicion;
                $objconfdocusuarioestado->save();
            }
            //creo la relacion entre el estado, el usuario y el permiso 
            //que tiene sobre el en los planes
            $existecongpermisoafinal = Doctrine::getTable(
                'ConfUsuarioConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadofinal' AND idusuario = '$iduser'
                AND idtipodoc = 3 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 2;
            if (isset($existecongpermisoafinal[0]->idestado)
                && $existecongpermisoafinal[0]->idestado != ''
            ) {
                if ($nuevovalorpermiso > $existecongpermisoafinal[0]->tipo
                    && $existecongpermisoafinal[0]->tipo != 1
                ) {
                    $existecongpermisoafinal[0]->tipo = $nuevovalorpermiso;
                } else {
                    if ($existecongpermisoafinal[0]->tipo == 1) {
                        $existecongpermisoafinal[0]->tipo = 3;
                    }
                }
            } else {
                $objconfdocusuarioestado = new ConfUsuarioConfDocDatEstado();
                $objconfdocusuarioestado->idtipodoc = 3;
                $objconfdocusuarioestado->idusuario = $iduser;
                $objconfdocusuarioestado->idestado = $idestadofinal;
                $objconfdocusuarioestado->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestado->idtransicion = $idtransicion;
                $objconfdocusuarioestado->save();
            }
        }
    }

    function AsociarEstructurasAEstadosTipodocTransicion(
        $tipodocplan, $tipodocobjetivo, $tipodocactividad, $idestadoinicial,
        $idestadofinal, $iduser, $idtransicion
    ) {
        ini_set("max_execution_time", 3600); //3600 1hora
        if ($tipodocplan) {
            //creo la relacion entre el estado, el usuario y el permiso que 
            //tiene sobre el en los planes
            $existecongpermisopinicial = Doctrine::getTable(
                'ConfEstructuraConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadoinicial' AND idestructura = '$iduser'
                AND idtipodoc = 0 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 1;
            if (isset($existecongpermisopinicial[0]->idestado)
                && $existecongpermisopinicial[0]->idestado != ''
            ) {
                if ($nuevovalorpermiso > $existecongpermisopinicial[0]->tipo) {
                    $existecongpermisopinicial[0]->tipo = $nuevovalorpermiso;
                } else {
                    if ($existecongpermisopinicial[0]->tipo == 2) {
                        $existecongpermisopinicial[0]->tipo = 3;
                    }
                }
            } else {
                $objconfdocusuarioestadoinicialp
                    = new ConfEstructuraConfDocDatEstado();
                $objconfdocusuarioestadoinicialp->idtipodoc = 0;
                $objconfdocusuarioestadoinicialp->idestructura = $iduser;
                $objconfdocusuarioestadoinicialp->idestado = $idestadoinicial;
                $objconfdocusuarioestadoinicialp->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestadoinicialp->idtransicion = $idtransicion;
                $objconfdocusuarioestadoinicialp->save();
            }
            //creo la relacion entre el estado, el usuario y el permiso que 
            //tiene sobre el en los planes
            $existecongpermisopfinal = Doctrine::getTable(
                'ConfEstructuraConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadofinal' AND idestructura = '$iduser'
                AND idtipodoc = 0 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 2;
            if (isset($existecongpermisopfinal[0]->idestado)
                && $existecongpermisopfinal[0]->idestado != ''
            ) {
                if ($nuevovalorpermiso > $existecongpermisopfinal[0]->tipo
                    && $existecongpermisopfinal[0]->tipo != 1
                ) {
                    $existecongpermisopfinal[0]->tipo = $nuevovalorpermiso;
                } else {
                    if ($existecongpermisopfinal[0]->tipo == 1) {
                        $existecongpermisopfinal[0]->tipo = 3;
                    }
                }
            } else {
                $objconfdocusuarioestadofinalp
                    = new ConfEstructuraConfDocDatEstado();
                $objconfdocusuarioestadofinalp->idtipodoc = 0;
                $objconfdocusuarioestadofinalp->idestructura = $iduser;
                $objconfdocusuarioestadofinalp->idestado = $idestadofinal;
                $objconfdocusuarioestadofinalp->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestadofinalp->idtransicion = $idtransicion;
                $objconfdocusuarioestadofinalp->save();
            }
        }
        if ($tipodocobjetivo) {
            //creo la relacion entre el estado, el usuario y el permiso
            // que tiene sobre el en los planes
            $existecongpermisooinicial = Doctrine::getTable(
                'ConfEstructuraConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadoinicial' AND idestructura = '$iduser'
                AND idtipodoc = 1 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 1;
            if (isset($existecongpermisooinicial[0]->idestado)
                && $existecongpermisooinicial[0]->idestado != ''
            ) {
                if ($nuevovalorpermiso > $existecongpermisooinicial[0]->tipo) {
                    $existecongpermisooinicial[0]->tipo = $nuevovalorpermiso;
                } else {
                    if ($existecongpermisooinicial[0]->tipo == 2) {
                        $existecongpermisooinicial[0]->tipo = 3;
                    }
                }
            } else {
                $objconfdocusuarioestado = new ConfEstructuraConfDocDatEstado();
                $objconfdocusuarioestado->idtipodoc = 1;
                $objconfdocusuarioestado->idestructura = $iduser;
                $objconfdocusuarioestado->idestado = $idestadoinicial;
                $objconfdocusuarioestado->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestado->idtransicion = $idtransicion;
                $objconfdocusuarioestado->save();
            }
            //creo la relacion entre el estado, el usuario y el permiso que 
            //tiene sobre el en los planes
            $existecongpermisoofinal = Doctrine::getTable(
                'ConfEstructuraConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadofinal' AND idestructura = '$iduser'
                AND idtipodoc = 1 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 2;
            if (isset($existecongpermisoofinal[0]->idestado)
                && $existecongpermisoofinal[0]->idestado != ''
            ) {
                if ($nuevovalorpermiso > $existecongpermisoofinal[0]->tipo
                    && $existecongpermisoofinal[0]->tipo != 1
                ) {
                    $existecongpermisoofinal[0]->tipo = $nuevovalorpermiso;
                } else {
                    if ($existecongpermisoofinal[0]->tipo == 1) {
                        $existecongpermisoofinal[0]->tipo = 3;
                    }
                }
            } else {
                $objconfdocusuarioestado = new ConfEstructuraConfDocDatEstado();
                $objconfdocusuarioestado->idtipodoc = 1;
                $objconfdocusuarioestado->idestructura = $iduser;
                $objconfdocusuarioestado->idestado = $idestadofinal;
                $objconfdocusuarioestado->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestado->idtransicion = $idtransicion;
                $objconfdocusuarioestado->save();
            }
        }
        if ($tipodocactividad) {
            //creo la relacion entre el estado, el usuario y el permiso que 
            //tiene sobre el en los planes
            $existecongpermisoainicial = Doctrine::getTable(
                'ConfEstructuraConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadoinicial' AND idestructura = '$iduser'
                AND idtipodoc = 3 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 1;
            if (isset($existecongpermisoainicial[0]->idestado)
                && $existecongpermisoainicial[0]->idestado != ''
            ) {

                if ($nuevovalorpermiso > $existecongpermisoainicial[0]->tipo) {
                    $existecongpermisoainicial[0]->tipo = $nuevovalorpermiso;
                }
            } else {
                $objconfdocusuarioestado = new ConfEstructuraConfDocDatEstado();
                $objconfdocusuarioestado->idtipodoc = 3;
                $objconfdocusuarioestado->idestructura = $iduser;
                $objconfdocusuarioestado->idestado = $idestadoinicial;
                $objconfdocusuarioestado->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestado->idtransicion = $idtransicion;
                $objconfdocusuarioestado->save();
            }
            //creo la relacion entre el estado, el usuario y el permiso que 
            //tiene sobre el en los planes
            $existecongpermisoafinal = Doctrine::getTable(
                'ConfEstructuraConfDocDatEstado'
            )->findByDql(
                "idestado = '$idestadofinal' AND idestructura = '$iduser'
                AND idtipodoc = 3 AND idtransicion = '$idtransicion'"
            );
            $nuevovalorpermiso = 2;
            if (isset($existecongpermisoafinal[0]->idestado)
                && $existecongpermisoafinal[0]->idestado != ''
            ) {
                if ($nuevovalorpermiso > $existecongpermisoafinal[0]->tipo
                    && $existecongpermisoafinal[0]->tipo != 1
                ) {
                    $existecongpermisoafinal[0]->tipo = $nuevovalorpermiso;
                } else {
                    if ($existecongpermisoafinal[0]->tipo == 1) {
                        $existecongpermisoafinal[0]->tipo = 3;
                    }
                }
            } else {
                $objconfdocusuarioestado = new ConfEstructuraConfDocDatEstado();
                $objconfdocusuarioestado->idtipodoc = 3;
                $objconfdocusuarioestado->idestructura = $iduser;
                $objconfdocusuarioestado->idestado = $idestadofinal;
                $objconfdocusuarioestado->tipo = $nuevovalorpermiso;
                $objconfdocusuarioestado->idtransicion = $idtransicion;
                $objconfdocusuarioestado->save();
            }
        }
    }

    function cargarcondicionesAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idtransicion = $this->_request->getPost('idtransicion');
        $tipocondicion = $this->_request->getPost('tipocondicion');
        $estamodificando = $this->_request->getPost('estamodificando');
        $objconidcionmodel = new NomCondicionModel();
        $arraycondiciones = $objconidcionmodel->CargarCondiciones(
            $estamodificando, $idtransicion, $tipocondicion
        );
        if (isset($arraycondiciones[0])) {
            echo json_encode(
                array('total'  => count($arraycondiciones),
                      'campos' => $arraycondiciones)
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    function cargarusuariospreAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $idtransicion = $this->_request->getPost('idtransicion');
        $estamodificando = $this->_request->getPost('estamodificando');
        $objcondmodel = new NomCondicionModel();
        $arraysubordinados = $objcondmodel->CargarUsuariosPre(
            $idusuario, $idtransicion, $estamodificando
        );
        if (isset($arraysubordinados[0])) {
            echo json_encode(
                array('total'  => count($arraysubordinados),
                      'campos' => $arraysubordinados)
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

    function cargarusuariospostAction()
    {
        ini_set("max_execution_time", 3600); //3600 1hora
        $idusuario = $this->global->Perfil->idusuario;
        $idtransicion = $this->_request->getPost('idtransicion');
        $estamodificando = $this->_request->getPost('estamodificando');
        $objcondmodel = new NomCondicionModel();
        $arraysubordinados = $objcondmodel->CargarUsuariosPost(
            $idusuario, $idtransicion, $estamodificando
        );
        if (isset($arraysubordinados[0])) {
            echo json_encode(
                array('total'  => count($arraysubordinados),
                      'campos' => $arraysubordinados)
            );
        } else {
            echo json_encode(array('total' => 0, 'campos' => array()));
        }
    }

}

