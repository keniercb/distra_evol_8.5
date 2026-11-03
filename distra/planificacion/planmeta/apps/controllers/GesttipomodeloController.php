<?php

class GesttipomodeloController extends ZendExt_Controller_Secure {

    function init() {
        $this->_meta = ZendExt_Metadata::getInstance();
        $this->objEncabModel = new EncabezadoModel();
        parent::init();
    }

    public function listarComboNegocioAction() {
        $data = NomTipomodelo::listarNegocio();
        echo json_encode(array('data' => $data['data']));
    }

    public function gesttipomodeloAction() {
        $this->render();
    }

    public function validarOperacionesAction() {
        $tiposmodelo = json_decode(
                stripslashes($this->_request->getPost('tiposmodelos'))
        );
        $operacion = $this->_request->getPost('operacion');
        $enuso = false;
        $aprobado = false;

        foreach ($tiposmodelo as $tipomodelo) {
            $uso = DatModelo::verUsoEnModelo($tipomodelo);
            if (NomTipomodelo::aprobacionTipomodelo($tipomodelo) != 3) {
                //verifica si la operacion es eliminar
                if ($operacion == 'del') {
                    if ($uso == true) {
                        $enuso = true;  //no puede realizar la operacion, tipo modelo en uso
                    }
                }
            } else {
                $aprobado = true;
            }
        }

        if ($enuso) {
            echo("{'codMsgA':21 }"); //no puede realizar la operacion, tipo modelo en uso
        } else {
            if ($aprobado) {
                echo("{'codMsgA':23 }"); //el tipo de modelo esta aprobado, no puede realizar la operacion
            } else {
                echo("{'codMsgA':22 }"); //se puede realizar la operacion
            }
        }
    }

//    public function listarTiposModeloAction() {
//        //seteo parámetros
//        $start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
//        $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
//        $parametros = is_array($this->_request->getPost('filtros')) ? $this->_request->getPost('filtros') : null;
//        $dat = NomTipomodelo::listarTiposModelo($parametros, $start, $limit);
//        echo json_encode($dat);
//    }
    public function cargarUsuariosAction() {
        $users = $this->integrator->seguridad->getAllUsers();
        echo json_encode(array("data" => $users));
    }

    public function listarTiposModeloAction() {
        try {
            //seteo parámetros
            $start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
            $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
            $parametros = is_array($this->_request->getPost('filtros')) ? $this->_request->getPost('filtros') : null;
            $tipomodelo = new NomTipomodelo();
            echo json_encode($tipomodelo->listarTiposModeloNegocio($parametros, $start, $limit));
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
    }

    public function adicionartipomodeloAction() {
        try {
            $idtipomodelo = $this->_request->getPost('idtipomodelo');
            $denominacion = $this->_request->getPost('denominacionmod') ? $this->_request->getPost('denominacionmod') : $this->_request->getPost('denominacion');

            if ($denominacion) {
                $denominacion = $denominacion;
                $descripcion = $this->_request->getPost('descripcionmod') ? $this->_request->getPost('descripcionmod') : $this->_request->getPost('descripcion');
            } else {
                if (!$denominacion) {
                    $denominacion = $this->_request->getPost('denominacion');
                    $descripcion = $this->_request->getPost('descripcion');
                }
            }
            //Se toman los parámetros de la interfaz
            $idaprobacion = 1;
            $codigo = $this->_request->getPost('codigo');
            $identidad = $this->global->Estructura->idestructura;
            $model = new NomTipomodeloModel();
            //Si viene el id es para modificar sino es para adicionar
            if ($idtipomodelo) {
                if (NomTipomodelo::validarCodigo($codigo, $idtipomodelo) != null) {
                    $dat->mensaje = 'codigo';
                    echo json_encode($dat);
                    return;
                }
                if (NomTipomodeloModel::validartipomodelo(
                                $idtipomodelo, $identidad
                        )
                ) {
                    $tipoModelo = Doctrine::getTable('NomTipomodelo')->find(
                            $idtipomodelo
                    );
                    $dat->mensaje = 'mod';
                } else {
                    $dat->codMsgC = 3;
                    $dat->mensaje = 'El Tipo de modelo no se puede modificar.';
                    echo json_encode($dat);
                }
            } else {
                if (NomTipomodelo::validarCodigo($codigo, $idtipomodelo) != null) {
                    $dat->mensaje = 'codigo';
                    echo json_encode($dat);
                    return;
                }
                $idmodelosmetadatos = $this->_request->getPost('idmodelosmetadatos');
                $data = NomTipomodelo::listarNegocioA($idmodelosmetadatos);
                $esquema = $data['data'][0]['esquema'];
                $tablaa = $data['data'][0]['tabla'];
                //ADICIONA UNA NUEVA TABLA EN METADATOS QUE CORRESPONDE A ESTE TIPO DE MODELO CREADO POR EL CODIGO
                $tabla = $this->_meta->Concept()->adicionarTabla('mod_planificacionmeta', $codigo, 0, 3, $denominacion);
                $idusuario = $this->global->Perfil->idusuario;
                $tipoModelo = new NomTipomodelo();

                $tipoModelo->idtabla = $tabla ['idtabla'];
                $tipoModelo->idaprobacion = $idaprobacion;
                $tipoModelo->identidad = $identidad;
                $tipoModelo->codigo = $codigo;
                $tipoModelo->idmodelosmetadatos = $idmodelosmetadatos;
                $tipoModelo->idusuario = $idusuario;
                $dat->mensaje = 'add';
                $this->_meta->Relation()->relacionarTablas(
                        $esquema, $tablaa, $tabla ['idtabla'], 1, 1
                );
            }
            //seteo parámetros
            $tipoModelo->denominacion = $denominacion;
            $tipoModelo->descripcion = $descripcion;
            $model->Insertar($tipoModelo);
            //Definir mensaje
            $dat->codMsgC = 1;

            //muestra el mensaje a la interfazc
            echo json_encode($dat);
        } catch (Exception $exc) {
            echo $exc->getMessage();
        }
    }

    /* public function adicionartipomodeloAction() {
      $idtipomodelo = $this->_request->getPost('idtipomodelo');
      $denominacion = $this->_request->getPost('denominacionmod') ? $this->_request->getPost('denominacionmod') : $this->_request->getPost('denominacion');

      if ($denominacion) {
      $denominacion = $denominacion;
      $descripcion = $this->_request->getPost('descripcionmod') ? $this->_request->getPost('descripcionmod') : $this->_request->getPost('descripcion');
      } else {
      if (!$denominacion) {
      $denominacion = $this->_request->getPost('denominacionAddColunmas');
      $descripcion = $this->_request->getPost('descripcionAddColunmas');
      }
      }
      //Se toman los parámetros de la interfaz
      $idaprobacion = 1;
      $codigo = $this->_request->getPost('codigo');
      $identidad = $this->global->Estructura->idestructura;
      $model = new NomTipomodeloModel();

      //Si viene el id es para modificar sino es para adicionar
      if ($idtipomodelo) {
      if (NomTipomodelo::validarCodigo($codigo, $idtipomodelo) != null) {
      $dat->mensaje = 'codigo';
      echo json_encode($dat);
      return;
      }
      if (NomTipomodeloModel::validartipomodelo(
      $idtipomodelo, $identidad
      )
      ) {
      $tipoModelo = Doctrine::getTable('NomTipomodelo')->find(
      $idtipomodelo
      );
      $dat->mensaje = 'mod';
      } else {
      $dat->codMsgC = 3;
      $dat->mensaje = 'El Tipo de modelo no se puede modificar.';
      echo json_encode($dat);
      }
      } else {
      if (NomTipomodelo::validarCodigo($codigo, $idtipomodelo) != null) {//ver aqui el tema de la comparacion deberia ser 0 no null
      $dat->mensaje = 'codigo';
      echo json_encode($dat);
      return;
      }
      //ADICIONA UNA NUEVA TABLA EN METADATOS QUE CORRESPONDE A ESTE TIPO DE MODELO CREADO POR EL CODIGO
      $tabla = $this->_meta->Concept()->adicionarTabla('mod_planificacionmeta', $codigo, 0, 3, $denominacion);
      $tipoModelo = new NomTipomodelo();
      $tipoModelo->idtabla = $tabla ['idtabla'];
      $tipoModelo->idaprobacion = $idaprobacion;
      $tipoModelo->identidad = $identidad;
      $tipoModelo->codigo = $codigo;
      $dat->mensaje = 'add';
      $this->_meta->Relation()->relacionarTablas(
      'mod_planificacion', 'dat_planificacion', $tabla ['idtabla'], $actualizar = 1, $eliminar = 1
      );
      }
      //seteo parámetros
      $tipoModelo->denominacion = $denominacion;
      $tipoModelo->descripcion = $descripcion;
      $model->Insertar($tipoModelo);
      //Definir mensaje
      $dat->codMsgC = 1;


      //muestra el mensaje a la interfazc
      echo json_encode($dat);
      } */

    public function eliminarTipoModeloAction() {
        $idtipomodelo = json_decode(
                stripslashes($this->_request->getPost('idtipomodelo'))
        );
        $idtabla = json_decode(
                stripslashes($this->_request->getPost('idtabla'))
        );
        $codigo = json_decode(
                stripslashes($this->_request->getPost('codigo'))
        );
        $conn = Doctrine_Manager::connection();
        foreach ($idtipomodelo as $key => $value) {
            $arrayParametros[0] = $value;
            $arrayParametros[1] = $idtabla[$key];
            $arrayParametros[2] = $codigo[$key];
            $queryElim = "select * from mod_planificacion.f_eliminartipomodeloydependencias(?,?,?)";
            $conn->execute($queryElim, $arrayParametros);
        }
        echo("{'codMsgC':1 }");
    }

    public function cargarFormularioTipoModeloAction() {

        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        // Cantidad total de record en BD
        $dat->total = 1;
        $dat->data [] = Doctrine::getTable('NomTipomodelo')->find($idtipomodelo)
                ->toArray();
        echo json_encode($dat);
    }

    public function listarColumnasTipoModeloAction() {

        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 5;
        $start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;

        $dat = NomTipomodelocolumna::Listar($idtipomodelo, $limit, $start);

        $x = 0;
        $total = $dat['total'];
        $array = array();
        foreach ($dat['result'] as $d) {
            $array [$x] ['idtipomodelocolumna'] = $d['idtipomodelocolumna'];
            $array [$x] ['idcampo'] = $d ['idcampo'];
            $array [$x] ['idcolumna'] = $d ['idcolumna'];
            $array [$x] ['denomtipodato'] = $d['NomTipocolumna'] ['denominacion'];
            $array [$x] ['etiqueta'] = $d ['NomColumna'] ['denominacion'];
            $x++;
        }
        echo json_encode(array('total' => $total, 'data' => $array));
    }

    public function adicionarColumnaATipoModeloAction() {

        $idcolumna = $this->_request->getPost('idcolumna');
        $idtipodato = $this->_request->getPost('idtipodato'); //NUMERICO,LETRAS,NOMENCLADOR,ETC
        $idexpresionregular = $this->_request->getPost('idexpresionregular'); //SI LLEVA EXPRESION REGULAR EN EL CASO DE LETRAS
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        $idtabla = $this->_request->getPost('idtabla'); //CADA TM TIENE UN IDTABLA QUE METADATOS NECESITA PARA EJE ALGUNAS ACCIONES ESTA EN LA TABLA NOM_TIPOMODELO
        $idtiponomenclador = $this->_request->getPost('idtiponomenclador');

        $col = Doctrine::getTable('NomColumna')->find($idcolumna);

        if ($col->denominacion == 'Cantidad' || $col->denominacion == 'Importe'
        ) {
            $dat->codMsgC = 21;
        } else {

            if (NomTipomodelocolumna::existeColumna($idtipomodelo, $idcolumna) <> null
            ) {
                $dat->codMsgC = 3;
                $dat->mensaje = 'La columna ya existe.';
            } else {

                if ($col->denominacion != 'Cantidad' || $col->denominacion != 'Importe'
                ) {
                    //definir tipo de dato de la columna
                    switch ($idtipodato) {
                        case 1 : { //Numérico
                                //Mandar el Alias
                                $arrayConfig ['etiqueta'] = $col->denominacion;
                                $arrayConfig ['limite_inferior'] = 20; //Mandar el Alias
                                $arrayConfig ['limite_superior'] = 100; //Mandar el Alias
                                //ADICIONA UNA COLUMNA CON ESTE SERVICIO DE METADATOS
                                $campo = $this->_meta->Attribute()->adicionarCampo(
                                        'c' . $col->idcolumna, $idtabla, $idtipodato, 1, 19, $arrayConfig
                                );
                                break;
                            }
                        case 2 : { //Texto
                                $arrayConfig ['etiqueta'] = $col->denominacion;
                                $arrayConfig ['idexpresionregular'] = $idexpresionregular;
                                //ADICIONA UNA COLUMNA CON ESTE SERVICIO DE METADATOS
                                $campo = $this->_meta->Attribute()->adicionarCampo(
                                        'c' . $col->idcolumna, $idtabla, $idtipodato, 1, 255, $arrayConfig
                                );
                                break;
                            }
                        case 3 : { //Fecha
                                $arrayConfig ['etiqueta'] = $col->denominacion;
                                //ADICIONA UNA COLUMNA CON ESTE SERVICIO DE METADATOS
                                $campo = $this->_meta->Attribute()->adicionarCampo(
                                        'c' . $col->idcolumna, $idtabla, $idtipodato, 1, 0, $arrayConfig
                                );
                                break;
                            }
                        case 4 : { //Chek
                                $arrayConfig ['etiqueta'] = $col->denominacion;
                                $arrayConfig ['valor'] = 0;
                                //ADICIONA UNA COLUMNA CON ESTE SERVICIO DE METADATOS
                                $campo = $this->_meta->Attribute()->adicionarCampo(
                                        'c' . $col->idcolumna, $idtabla, $idtipodato, 1, 255, $arrayConfig
                                );
                                break;
                            }
                        case 5 : { //Nomenclador
                                $denomtipomodelo = NomTiponomenclador::getTipoNomenclador($idtiponomenclador);

                                $tablaf = $this->_meta->Concept()->importarTabla(
                                        'mod_planificacion', 'nom_datosnomenclador'
                                );

                                if ($tablaf) {
                                    $campof = $this->_meta->Attribute()
                                            ->obtenerPrimaryKeyDadoIdtabla(
                                            $tablaf['idtabla']
                                    );
                                    $arrayConfig ['idcampodf'] = 'denominacion'; //campo que se mostraria denominacion o nombre etc.
                                    $arrayConfig ['idcampovf'] = $campof->idcampo; //nombre del campo q es la llave de la tabla q cogi
                                    $arrayConfig ['etiqueta'] = $denomtipomodelo->denominacion;
                                    //ADICIONA UNA COLUMNA CON ESTE SERVICIO DE METADATOS
                                    $campo = $this->_meta->Attribute()
                                            ->adicionarCampo(
                                            'n' . $idtiponomenclador, $idtabla, 5, 1, 19, $arrayConfig
                                    );
                                }
                            }
                        default : {
                                $dat->mensaje = 'Error al insertar el campo, no existe un tipo de dato asociado.';
                                break;
                            }
                    }
                    //inserto en la tabla NomTipomodeloColumna
                    $nomtipomodelocolumna = new NomTipomodelocolumna();
                    $nomtipomodelocolumna->idtipomodelo = $idtipomodelo;
                    $nomtipomodelocolumna->idtipocolumna = $idtipodato;
                    $nomtipomodelocolumna->idcolumna = $idcolumna;
                    $nomtipomodelocolumna->idcampo = $campo;
                    $nomtipomodelocolumna->idtiponomenclador = $idtiponomenclador;
                    NomTipomodeloColumna::Insertar($nomtipomodelocolumna);

                    //actualizar usuario y fecha del tipo de modelo al q se le puso columnas
                    $idusuario = $this->global->Perfil->idusuario;
                    $NomTipomodelo = Doctrine::getTable('NomTipomodelo')->find($idtipomodelo);
                    $NomTipomodelo->idusuario = $idusuario;
                    $NomTipomodelo->fecha = null;
                    $NomTipomodelo->save();
                    $campo = 0;
                    $dat->codMsgC = 1;
                    $dat->mensaje = 'La columna ha sido adicionada satisfactoriamente.';
                }
            }
        }
        echo json_encode($dat);
    }

    public function eliminarColumnaATipoModeloAction() {

        $idtipomodelocolumna = $this->_request->getPost('idtipomodelocolumna');
        $idcampo = $this->_request->getPost('idcolumna');
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        $identidad = $this->global->Estructura->idestructura;
        $usado = DatModelo::ObtenerModelosDeUnTipo($idtipomodelo);
        if ((!$usado) && (NomTipomodeloModel::validartipomodelo(
                        $idtipomodelo, $identidad
                )) == true
        ) {
            if ($idcampo <> 0) {
                $this->_meta->Attribute()->eliminarCampo($idcampo);
            }
            NomTipomodelocolumna::eliminar($idtipomodelocolumna);


            echo("{'codMsgC':1 }");
        } else {
            echo("{'codMsgC':21 }");
        }
    }

    /* public function listarColumnasAction() {

      $dat = NomColumna::getTodosActivos();

      $result = array();
      foreach ($dat as $key => $d) {
      $result[$key]['idcolumna'] = $d ['idcolumna'];
      $result[$key]['denominacion'] = /*utf8_decode($d ['denominacion']);
      $result[$key]['descripcion'] = /*utf8_decode($d ['descripcion']);
      $result[$key]['estado'] = $d ['estado'];
      $result[$key]['idpadre'] = $d ['idpadre'];
      $result[$key]['ordender'] = $d ['ordender'];
      $result[$key]['ordenizq'] = $d ['ordenizq'];
      }

      $datos->data = $result;

      echo json_encode($datos);
      } */

    public function listarColumnasAction() {
        //seteo parámetros
        $start = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $porfiltro = $this->_request->getPost('filtro');
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        if ($this->_request->getPost('enuso') == '1' || $this->_request->getPost('enuso') == '0'
        ) {
            $parametros ['enuso'] = $this->_request->getPost('enuso');
        }
        $parametros ['denominacion'] = $this->_request->getPost('denominacion');
        if (is_array($this->_request->getPost('filtros'))) {
            foreach ($this->_request->getPost('filtros') as $datos) {
                if ($datos['field'] == 'denominacion') {
                    $parametros ['denominacion'] = $datos ['data'] ['value'];
                } else {
                    if ($datos['field'] == 'descripcion') {
                        $parametros['descripcion'] = $datos ['data'] ['value'];
                    } else {
                        if ($datos['field'] == 'enuso') {
                            if ($datos ['data'] ['value'] == 'Si' || $datos ['data'] ['value'] == 'Sí') {
                                $parametros ['enuso'] = 1;
                            } else {
                                $parametros ['enuso'] = 2;
                            }
                        }
                    }
                }
            }
        }
        //Se listan los valores filtrados
        if (!$porfiltro) {
//Obtiene la lista de columnas dado un id padre o nodo
            $data = NomColumna::Listar($parametros, $start, $limit, $idtipomodelo);

            foreach ($data->data as $k => $valor) {
                $enuso = NomColumna::verEnUso($valor['idcolumna']);
                if ($enuso[0] != null) {
                    $data->data[$k]['enuso'] = 1;
                } else {
                    $data->data[$k]['enuso'] = 0;
                }
            }
        } else {
            
        }
        echo json_encode($data);
    }

    public function validarOperacionesColumnaAction() {
        $idcolumna = $this->_request->getPost('idcolumna');
        $operacion = $this->_request->getPost('operacion');
        $denomColumna = NomColumna::buscarDenominacion($idcolumna);
        $enuso = NomColumna::verEnUso($idcolumna);

        if ($denomColumna[0][denominacion] == 'Importe' || $denomColumna[0][denominacion] == 'Cantidad') {
            if ($operacion == 'del' || $operacion == 'mod') {
                echo("{'codMsg':20 }"); //las columnas son fijas, no se puede realizar la operacion
            } else {
                echo("{'codMsg':22 }");
            } //se puede realizar la operacion
        } else {
            if ($operacion == 'del' && $enuso[0] != null) {
                echo("{'codMsg':21 }"); //las columnas estan en uso, no se puede realizar la operacion
            } else {
                echo("{'codMsg':22 }");
            }
        } //se puede realizar la operacion
    }

    public function eliminarColumnaAction() {
        $idcolumna = json_decode(stripslashes($this->_request->getPost('idcolumna')));
        $model = new NomColumnaModel();
        $cont = -1;
        if (!empty($idcolumna)) {
            foreach ($idcolumna as $value) {
                if ($model->eliminarencadena($value)) {
                    $cont++;
                }
            }
        }
        if ($key == $cont) {
            echo("{'codMsgP':1 }");
        } else {
            if ($key != $cont) {
                echo("{'codMsgP':2 }");
            } else {
                if ($cont == -1) {
                    echo("{'codMsgP':4 }");
                } else {
                    echo("{'codMsgP':3 }");
                }
            }
        } //ocurrio error*/
    }

    public function adicionarColumnaAction() {
        //Definir el objeto columna
        $idcolumna = $this->_request->getPost('idcolumna');
        if ($idcolumna) {
            $denominacion = $this->_request->getPost('iddenominacionmod');
            $existeden = NomColumnaModel::existencia($denominacion, $idcolumna);
        } else {
            $denominacion = $this->_request->getPost('denominacion');
            $existeden = NomColumnaModel::existencia($denominacion, $idcolumna);
        }
        if ($existeden) {
            if ($idcolumna) {
                echo json_encode(array('codMsgP' => 2, 'mensaje' => 'mod'));
            } else {
                echo json_encode(array('codMsgP' => 2, 'mensaje' => 'add'));
            }
        } else {
            //Instancear el modelo de columna
            $model = new NomColumnaModel();

            //Si me envian un idcolumna es para modificar
            if ($idcolumna) {
                $col = Doctrine::getTable('NomColumna')->find($idcolumna);
                $mensaje = "mod";
                $denominacion = $this->_request->getPost('iddenominacionmod');
                $descripcion = $this->_request->getPost('iddescripcionmod');
            } else {
                $col = new NomColumna();
                $mensaje = "add";
                $denominacion = $this->_request->getPost('denominacion');
                $descripcion = $this->_request->getPost('descripcion');
            }
            //seteo parámetros
            if ($denominacion) {
                $col->denominacion = $denominacion;
            }
            if ($descripcion) {
                $col->descripcion = $descripcion;
            }
            $model->Insertar($col);

            echo json_encode(array('codMsgP' => 1, 'mensaje' => $mensaje));
        }
    }

    public function listarColumnasComboAction() {
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        $dat->data = NomColumna::getTodosActivosXIdTM($idtipomodelo);
        echo json_encode($dat);
    }

    public function listarNomencladoresAction() {
        $idtipomodelo = $this->_request->getPost('idtipomodelo');
        echo json_encode(
                array('data' => NomTiponomenclador::listarNomencladoresTM($idtipomodelo))
        );
    }

    public function cargarllaveAction() {
        $esquema = $this->_request->getPost('node');
        $nombretabla = $this->_request->getPost('nombretabla');
        //OBTIENE LA LLAVE PRIMARIA DE LA TABLA QUE LE PASAS
        $campo = $this->_meta->Attribute()->obtenerLlavePrimaria(
                $esquema, $nombretabla
        );
        echo json_encode($campo);
    }

    public function cargarcmbcamposAction() {
        $idtabla = $this->_request->getPost('idtabla');
        //CARGA LAS COLUMNAS DE LA TABLA QUE LE PASES
        $campo = $this->_meta->Attribute()->obtenerCamposConRepresentacion(
                $idtabla
        );
        echo json_encode(array('data' => $campo));
    }

    public function cargartbcomboestadosAction() {
        $data->data [] = array('idestado' => 1, 'estado' => 'Si');
        $data->data [] = array('idestado' => 0, 'estado' => 'No');
        echo json_encode($data);
    }

    public function listarTiposDatosColumnasAction() {
        //Definir el objeto donde en la propiedad data va el arreglo de valores
        //Clableado hasta que funcione el servicio de metadatos
        $datas = $this->_meta->Attribute()->cargarTiposDatos();
        echo json_encode(array('data' => $datas));
    }

    public function listarExpresionesRegularesAction() {
        //Definir el objeto donde en la propiedad data va el arreglo de valores
        $datas = $this->_meta->Attribute()->cargarExpresionesRegulares();

        echo json_encode(array('data' => $datas));
    }

//fin de la función listarExpresionesRegulares

    public function cargarTiposModelosAction() {
        $tipo = new NomTipomodelo();
        $arreglo = $tipo->ObtenerIdTipoModeloYDenominacion();
        echo json_encode(array('data' => $arreglo, 'total' => count($arreglo)));
    }

//fin de la función cargarTiposModelos

    public function aprobarDesaprobarAction() {
        $idaprobacion = $this->_request->getPost('aprobacion');
        //$idmodelosmetadatos = $this->_request->getPost('idmodelosmetadatos');
        $idtipomodelo = json_decode(stripslashes($this->_request->getPost('idtipomodelo')));
        $enuso = DatModelo::verUsoEnModelo($idtipomodelo);
        if ($idaprobacion == 1 && $enuso == 1
        ) { //si se quiere desaprobar y esta enuso, no se puede hacer
            echo("{'codMsgA':22 }");
        } else {
            foreach ($idtipomodelo as $d) {
                $tienecolnomenclada = NomTipomodelo::tieneColumnasNomencladas($d);
                if ($tienecolnomenclada == 1) {
                    if ($idaprobacion == 1) {
                        //eliminando la relación con desglose
                        self::desasociarDesglose($d);
                    } else {
                        //creando y/o relacionando el TM con un desglose
                        $dat = self::listarDesglosesAsociar($d);
                        if ($dat->data[0]) {
                            self::asociarDesglose($d, $dat->data[0]);
                        } else {
                            $iddesglose = self::adicionarConfigDesglose($d, $dat->ColNom);
                            self::asociarDesglose($d, $iddesglose);
                        }
                    }
                }
            }
            if (NomTipomodelo::aprobarDesaprobar($idtipomodelo, $idaprobacion)
            ) {
                echo json_encode(
                        array('codMsgA' => 1,
                            'mensaje' => (($idaprobacion == 1) ? 'desaprobado' : 'aprobado'))
                );
            } else {
                echo("{'codMsgA':3 }");
            } // código de error
        }
    }

    public function listarDesglosesAsociar($idtipomodelo) {
        $cant = NomTipomodeloModel::cantColmnasNomencladas($idtipomodelo);
        $cant = $cant[0];
        if ($cant != 0) {
            $arridtiponomenclador = NomTipomodeloModel::getColmnasNomencladas($idtipomodelo);
            $data->ColNom = $arridtiponomenclador;
            $arridtiponomenclador = implode(',', $arridtiponomenclador);
            $data->data = NomTipomodeloModel::listarDesglosesAsociar($arridtiponomenclador, $cant);
        } else {
            $data = array();
        }
        return $data;
    }

    public function asociarDesglose($idtipomodelo, $iddesglose) {
        NomTipomodeloModel::asociarDesglose($idtipomodelo, $iddesglose);
    }

    public function desasociarDesglose($idtipomodelo) {
        NomTipomodeloModel::desasociarDesglose($idtipomodelo);
    }

    public function listarDesglosesTodosAction() {
        $data->data = NomTipomodeloModel::listarDesglosesTodos();
        $data->data[] = array('idconfdesglose' => '-', 'denominacion' => '-');
        echo json_encode($data);
    }

    public function adicionarConfigDesglose($d, $idtiposNom) {
        $params['tiponomencladores'] = $idtiposNom;
        $tm = Doctrine::getTable('NomTipomodelo')->findByDql("idtipomodelo=$d");
        $params['denominacion'] = $tm[0]['denominacion'];
        return DatDesgloseModel::adicionarConfigDesgloseAutomatico($params);
    }

}
