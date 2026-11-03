<?php

class AdministracionController extends ZendExt_Controller_Secure
{

    function init()
    {
        parent::init();
    }

    function administracionAction()
    {
        $this->render();
    }

    public function getConfiguracionesAction()
    {
        $query = $this->_request->getPost('query');
        $objNomConfiguracion = new NomConfiguracion();
        $r['datos'] = $objNomConfiguracion->GetPorLimite($query);
        $r['cantidad'] = $objNomConfiguracion->GetCantTotal($query);
        echo json_encode($r);
    }

    public function adicionarConfiguracionAction()
    {
        $accion = $this->_request->getPost('accion');
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $server = $this->_request->getPost('servidor');
        $port = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('usuario');
        $pass = $this->_request->getPost('contrasena');
        $dbname = $this->_request->getPost('basedato');
        $denominacion = $this->_request->getPost('denominacion');
        $claveproteccion = $this->_request->getPost('claveproteccion');
        $schema = $this->_request->getPost('esquema');
        $table = $this->_request->getPost('tabla');
        $existe = true;

        $objMetadato = new MetadatoModel($server, $port, $user, $pass, $dbname);

        if ($objMetadato) {
            //Obtiene los identificadores de la tabla base
            $primaryKeys = $objMetadato->getPrimaryKeys($schema, $table);
            $pKeys = array();
            foreach ($primaryKeys as $pKey) {
                $pKeys[]['campo'] = $pKey['name'];
            }

            //Encripto el pass para poder almacenarlo en la base de datos.
            $rsa = new ZendExt_RSA();
            $keys = $rsa->generate_keys('9990454949', '9990450271', 0);

            if ($accion == 'add') {
                $objConfig = new NomConfiguracion();
                $objConfig->idconfiguracion = $idconfiguracion;
                $objConfig->servidor = $server;
                $objConfig->puerto = $port;
                $objConfig->usuario = $user;
                $objConfig->contrasena = $rsa->encrypt($pass, $keys[1], $keys[0], 5);
                $objConfig->basedato = $dbname;
                $objConfig->denominacion = $denominacion;
                $objConfig->claveproteccion = $rsa->encrypt($claveproteccion, $keys[1], $keys[0], 5);
                $objConfig->esquema = $schema;
                $objConfig->tabla = $table;
                $objConfig->idtablabase = json_encode($pKeys);
                $idtabla = json_encode($pKeys);

                $contr = $rsa->encrypt($pass, $keys[1], $keys[0], 5);
                $clave = $rsa->encrypt($claveproteccion, $keys[1], $keys[0], 5);
                if (!$objConfig->existe($idconfiguracion)) {
                    $mg = Doctrine_Manager::getInstance();
                    $conn = $mg->getCurrentConnection();

                   $sql = "INSERT INTO mod_reccomplejas2.nom_configuracion(
                        idconfiguracion, denominacion, servidor, puerto, basedato, usuario,
                        contrasena, claveproteccion, esquema, tabla, idtablabase)
                        VALUES ('$idconfiguracion', '$denominacion', '$server', $port, '$dbname', '$user',
                                '$contr','$clave' , '$schema',
                                 '$table', '$idtabla')" ;
                     $conn->fetchAll($sql);
                    $existe = false;
                }
            } else {
                $objConfig = Doctrine::getTable('NomConfiguracion')->find($idconfiguracion);
                $objConfig->servidor = $server;
                $objConfig->puerto = $port;
                $objConfig->usuario = $user;
                $objConfig->contrasena = $rsa->encrypt($pass, $keys[1], $keys[0], 5);
                $objConfig->basedato = $dbname;
                $objConfig->denominacion = $denominacion;
                $objConfig->claveproteccion = $rsa->encrypt($claveproteccion, $keys[1], $keys[0], 5);
                $objConfig->esquema = $schema;
                $objConfig->tabla = $table;
                $objConfig->idtablabase = json_encode($pKeys);
                $idtabla = json_encode($pKeys);
                $us = $user;
                $sc = $schema;
                $tb = $table;
                $contr = $rsa->encrypt($pass, $keys[1], $keys[0], 5);
                $clave = $rsa->encrypt($claveproteccion, $keys[1], $keys[0], 5);
                $mg = Doctrine_Manager::getInstance();
                $conn = $mg->getCurrentConnection();

                $sql = "UPDATE mod_reccomplejas2.nom_configuracion
                       SET idconfiguracion='$idconfiguracion', denominacion='$denominacion', servidor='$server', puerto=$port, basedato='$dbname',
                           usuario='$us', contrasena='$contr', claveproteccion='$clave',
                            esquema='$sc', tabla='$tb', idtablabase='$idtabla'
                       WHERE nom_configuracion.idconfiguracion ilike '$idconfiguracion' " ;
                $conn->fetchAll($sql);
            }
            $r->success = true;
            $r->existe = $existe;
            echo json_encode($r);
        } else {
            $m->codMsg = 2;
            $m->existe = $existe;
            $m->mensaje = "No se pudo conectar al servidor.";
            echo json_encode($m);
        }
    }

    public function duplicarConfiguracionAction()
    {
        $idConfigOrigal = $this->_request->getPost('idConfigOrigal');
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $denominacion = $this->_request->getPost('denominacion');
        $password = $this->_request->getPost('password');

        $datConfiguracionModel = new DatConfiguracionModel();
        $objConfig = $datConfiguracionModel->duplicarConfiguracion(
            $idConfigOrigal, $idconfiguracion, $denominacion, $password
        );
        $m->duplicarOK = 1;
        echo json_encode($m);
    }

    public function eliminarConfiguracionAction()
    {
        $configModel = new NomConfiguracionModel();
        $resp = new stdClass();
        $resp->success = $configModel->eliminarConfiguracion($this->_request->getPost('idconfiguracion'));
        echo json_encode($resp);
    }

    public function comprobarConexionAction()
    {
        $server = $this->_request->getPost('servidor');
        $port = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('usuario');
        $pass = $this->_request->getPost('contrasena');
        $dbname = $this->_request->getPost('basedato');
        $passEncrypted = $this->_request->getPost('passencrypted');

        if ($passEncrypted) {
            $pass = $this->decrypt($pass);
        }

        $c = $this->checkConnection($server, $port, $user, $pass, $dbname);

        if ($c) {
            $m->conexion = 1;
        } else {
            $m->conexion = 2;
        }
        echo json_encode($m);
    }

    public function getMetadatoAction()
    {
        try {
            $server = $this->_request->getPost('servidor');
            $port = $this->_request->getPost('puerto');
            $user = $this->_request->getPost('usuario');

            if ($this->_request->getPost('passclaro')) {
                $pass = $this->_request->getPost('contrasena');
            } else {
                $pass = $this->decrypt($this->_request->getPost('contrasena'));
            }

            $dbname = $this->_request->getPost('basedato');
            $typeNode = $this->_request->getPost('type'); //Tipo de nodo
            $text = $this->_request->getPost('text');
            $maxlevel = $this->_request->getPost('maxlevel'); //Nivel maximo a desplegar

            $c = $this->checkConnection($server, $port, $user, $pass, $dbname);

            //Verifica conexion con el servidor
            if ($c) {
                $objMetadato = new MetadatoModel($server, $port, $user, $pass, $dbname);

                if ($typeNode == 'undefined') { //cargo todos los esquemas de la base de datos
                    $result = $objMetadato->getSchemas();
                    $type = 'schema';
                    $icon = 'schema';
                    $draggable = false;
                } else {
                    if ($typeNode == 'schema') { //Cargo todas las tablas del schema
                        $result = $objMetadato->getTablesBySchema($text);
                        $type = 'table';
                        $icon = 'table';
                        $draggable = false;
                    } else {
                        if ($typeNode == 'table') { //Cargo todas los atributos de la tabla
                            $schema = $this->_request->getPost('schema');
                            $result = $objMetadato->getFieldsByTables($text, $schema);
                            $type = 'field';
                            $icon = 'campo';
                            $draggable = true;
                        }
                    }
                }
                $arbol = array();
                $n = 0;
                if ($result != false) {
                    foreach ($result as $campo) {
                        $arbol[$n]['type'] = $type;
                        if ($type == 'field'
                        ) { //Pregunto para saber de acuerdo a que tipo de campo es cambiarle el icono
                            $arbol[$n]['iconCls'] = $campo['key'];
                            $arbol[$n]['text'] = $campo['name'];
                            $arbol[$n]['schema'] = $campo['schema'];
                            $arbol[$n]['obligatorio'] = $campo['obligatorio'] == 1 ? true : false;
                            $arbol[$n]['fk_table'] = $campo['fk_table'];
                            $arbol[$n]['fk_schema'] = $campo['fk_schema'];
                            $arbol[$n]['table'] = $campo['table'];
                            $arbol[$n]['tipodato'] = $campo['tipodato'];
                            $arbol[$n]['checked'] = false;
                            $arbol[$n]['leaf'] = true;
                        } else {
                            if ($type == 'table') {
                                $arbol[$n]['text'] = $campo['table'];
                                $arbol[$n]['schema'] = $campo['schema'];
                                $arbol[$n]['iconCls'] = $icon;
                                $arbol[$n]['leaf'] = $maxlevel == 'table';
                            } else {
                                $arbol[$n]['text'] = $campo;
                                $arbol[$n]['iconCls'] = $icon;
                            }
                        }
                        $n++;
                    }

                    echo json_encode($arbol);
                } else {
                    $m['codMsg'] = 2;
                    $m['mensaje'] = "Los sentimos. No hay datos para mostrar";
                    echo json_encode($m);
                }
            } else {
                $m['codMsg'] = 2;
                $m['mensaje'] = "No se ha podido establecer conexi&oacute;n con el servidor de base de datos.";
                echo json_encode($m);
            }

        } catch (PDOException $e) {
            $m->codMsg = 2;
            $m->mensaje = $e->getMessage();
            echo json_encode($m);
        }
    }

    public function generarXMLsAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $idtablabase = json_decode(stripslashes($this->_request->getPost('idtablabase')));

        $objConfiguracion = new DatConfiguracionModel();
        $r = $objConfiguracion->generarXML($idconfiguracion, $idtablabase);

        echo json_encode($r->success = true);
    }

    public function getCamposAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $idpadre = $this->_request->getPost('idcampo');
        $objCampo = new DatCampo();
        $r = $objCampo->getCampos($idconfiguracion, $idpadre);
        echo json_encode($r);
    }

    public function gestCarpetaCampoAction()
    {
        $accion = $this->_request->getPost('accion');
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $denominacion = $this->_request->getPost('denominacion');
        $descripcion = $this->_request->getPost('descripcion');
        $idcampo = $this->_request->getPost('idcampo');

        if ($accion == 'add') {
            $objCampo = new DatCampo();
            $objCampo->idconfiguracion = $idconfiguracion;
            $objCampo->denominacion = $denominacion;
            $objCampo->descripcion = $descripcion;
            $objCampo->idpadre = $idcampo;
            $objCampo->save();
        } else {
            $objCampo = Doctrine::getTable('DatCampo')->find($idcampo);
            $objCampo->denominacion = $denominacion;
            $objCampo->descripcion = $descripcion;
            $objCampo->save();
        }

        $r['sucess'] = true;
        echo json_encode($r);
    }

    public function adicionarCamposAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $esquemabase = $this->_request->getPost('esquemabase');
        $tablabase = $this->_request->getPost('tablabase');
        $idpadre = $this->_request->getPost('idpadre');
        $arrCampos = Json_decode(stripslashes($this->_request->getPost('arrCampos')));

        $dcDatCampo = new DatCampo();
        foreach ($arrCampos as $key => $campo) {
            $dcDatCampo->idconfiguracion = $idconfiguracion;
            $dcDatCampo->idpadre = $idpadre;
            $dcDatCampo->denominacion = $campo->campo;
            $dcDatCampo->campo = $campo->campo;
            $dcDatCampo->tabla = $campo->tabla;
            $dcDatCampo->esquema = $campo->esquema;
            $dcDatCampo->save();

            $idcampo = $dcDatCampo->idcampo;

            $query = Doctrine_Manager::getInstance();
            $sql = "UPDATE mod_reccomplejas2.dat_campo
                  SET  index=$idcampo
                   WHERE mod_reccomplejas2.dat_campo.idcampo = $idcampo";
            $arrAux = $query->getCurrentConnection()->execute($sql)->fetchAll(PDO::FETCH_ASSOC);

            $objConfigMostrar = new DatConfigmostrar();
            $objConfigMostrar->idcampo = $dcDatCampo->idcampo;
            $objConfigMostrar->save();

            $objConfigCondicion = new DatConfigcondicion();
            $objConfigCondicion->idcampo = $dcDatCampo->idcampo;
            $objConfigCondicion->save();

            $objMapeo = new DatMapeo();
            $objMapeo->idcampo = $dcDatCampo->idcampo;
            $objMapeo->esquema = $esquemabase;
            $objMapeo->tabla = $tablabase;
            $objMapeo->save();
        }


        $r['success'] = true;
        echo json_encode($r);
    }

    public function eliminarCampoAction()
    {
        $idcampo = $this->_request->getPost('idcampo');
        try {
            $objCampo = Doctrine::getTable('DatCampo')->find($idcampo);
            $objCampo->delete();

            $r['success'] = true;
            echo json_encode($r);
        } catch (Exception $e) {
            die($e->getMessage());
        }
    }

    public function guardarDatosCampoAction()
    {
        $p->idcampo = $this->_request->getPost('idcampo');
        $p->sourceMostrar = Json_decode(stripslashes($this->_request->getPost('sourceMostrar')));
        $p->sourceCondicion = Json_decode(stripslashes($this->_request->getPost('sourceCondicion')));
        $p->arrMultievaluado = Json_decode(stripslashes($this->_request->getPost('arrMultievaluado')));
        $objModel = new DatCampoModel();
        $objModel->guardarDatosCampo($p);

        $r['success'] = true;
        echo json_encode($r);
    }

    public function getMultiplesValoresAction()
    {
        $idcampo = $this->_request->getPost('idcampo');
        $obj = new DatMultievaluado();
        $r['datos'] = $obj->getValores($idcampo);
        echo json_encode($r);
    }

    public function verificarPermisoAction()
    {
        $claveproteccion = $this->_request->getPost('claveproteccion');
        $claveEntrada = $this->_request->getPost('claveEntrada');

        $rsa = new ZendExt_RSA();
        $keys = $rsa->generate_keys('9990454949', '9990450271', 0);
        $x = $rsa->encrypt($claveEntrada, $keys[1], $keys[0], 5);
        if ($claveproteccion == $x) {
            $r['cont'] = 1;
        } else {
            $r['cont'] = 0;
        }
        echo(json_encode($r));
    }

    public function getMapeoAction()
    {
        $idcampo = $this->_request->getPost('idcampo');
        $objMapeo = new DatMapeo();
        $mapeo = $objMapeo->getMapeo($idcampo);
        if ($mapeo) {
            echo json_encode(array('datos' => $mapeo));
        } else {
            echo json_encode(array('datos' => array()));
        }
    }

    public function getCamposTablaAction()
    {
        $server = $this->_request->getPost('servidor');
        $port = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('usuario');
        if (json_decode($this->_request->getPost('passclaro'))) {
            $pass = $this->_request->getPost('contrasena');
        } else {
            $pass = $this->decrypt($this->_request->getPost('contrasena'));
        }
        //$pass = $this->_request->getPost('contrasena');
        $dbname = $this->_request->getPost('basedato');
        $esquema = $this->_request->getPost('esquema');
        $tabla = $this->_request->getPost('tabla');
        $objMetadatoModel = new MetadatoModel($server, $port, $user, $pass, $dbname);
        $result = $objMetadatoModel->getFieldsByTables($tabla, $esquema);

        $arrCampos = null;
        foreach ($result as $campo) {
            $arrAux['campo'] = $campo['name'];
            $arrCampos[] = $arrAux;
        }
        $r['datos'] = $arrCampos;
        echo json_encode($r);
    }

    public function adicionarTablaMapeoAction()
    {
        $idcampo = $this->_request->getPost('idcampo');
        $esquema = $this->_request->getPost('esquema');
        $tabla = $this->_request->getPost('tabla');
        $persistejoin = $this->_request->getPost('persistejoin');
        $tipoconexion = $this->_request->getPost('tipoconexion');

        $valores = new DatMapeo();
        $valores->idcampo = $idcampo;
        $valores->esquema = $esquema;
        $valores->tabla = $tabla;
        //$valores->persistejoin = ($persistejoin != 'on') ? 'false' : 'true';
        $valores->persistejoin = ($persistejoin != 'on') ? 0 : 1;
        if ($this->_request->getPost('idpersistejoin') != '') {
            $valores->idpersistejoin = $this->_request->getPost('idpersistejoin');
        }
        $valores->tipoconexion = $tipoconexion;
        $model = new DatMapeoModel();
        $resp = $model->Insertar($valores);
        if ($resp) {
            $r['adicionar'] = 1;
        } else {
            $r['adicionar'] = 3;
        }
        echo json_encode($r);
    }

    public function modificarTablaMapeoAction()
    {
        $idmapeo = $this->_request->getPost('idmapeo');
        $idcampo = $this->_request->getPost('idcampo');
        $esquema = $this->_request->getPost('esquema');
        $tabla = $this->_request->getPost('tabla');
        $persistejoin = $this->_request->getPost('persistejoin');
        $tipoconexion = $this->_request->getPost('tipoconexion');

        $valores['idmapeo'] = $idmapeo;
        $valores['idcampo'] = $idcampo;
        $valores['esquema'] = $esquema;
        $valores['tabla'] = $tabla;
        //$valores['persistejoin'] = ($persistejoin != 'on') ? 'false' : 'true';
        $valores['persistejoin'] = ($persistejoin == 'on') ? 1 : 0;
        if ($valores['persistejoin'] == 1) {
            $valores['idpersistejoin'] = $this->_request->getPost('idpersistejoin');
        } else {
            $valores['idpersistejoin'] = null;
        }
        $valores['tipoconexion'] = $tipoconexion;
        $model = new DatMapeoModel();
        $resp = $model->Actualizar($valores);
        if ($resp) {
            $r['modificar'] = 1;
        } else {
            $r['modificar'] = 3;
        }
        echo json_encode($r);
    }

    public function eliminarTablaMapeoAction()
    {
        $idcampo = $this->_request->getPost('idmapeo');
        $model = new DatMapeoModel();
        $resp = $model->Eliminar($idcampo);
        if ($resp) {
            $r['eliminar'] = 1;
        } else {
            $r['eliminar'] = 3;
        }
        echo json_encode($r);
    }

    public function getUnionAction()
    {
        $idmapeo = $this->_request->getPost('idmapeo');
        $objUnion = new DatUnion();
        $union = $objUnion->getUnion($idmapeo);
        if ($union) {
            echo json_encode(array('datos' => $union));
        } else {
            echo json_encode(array('datos' => array()));
        }
    }

    public function adicionarUnionAction()
    {
        $idmapeo = $this->_request->getPost('idmapeo');
        $campoinicial = $this->_request->getPost('campoinicial');
        $operador = $this->_request->getPost('operador');
        $campofinal = $this->_request->getPost('campofinal');

        $val = new DatUnion();
        $val->idmapeo = $idmapeo;
        $val->campoinicial = $campoinicial;
        $val->operador = $operador;
        $val->campofinal = $campofinal;
        if ($this->_request->getPost('logico') != '') {
            $val->logico = $this->_request->getPost('logico');
        } else {
            $val->logico = null;
        }
        $modelo = new DatUnionModel();
        $resp = $modelo->Insertar($val);
        if ($resp) {
            $r['modificar'] = 1;
        } else {
            $r['modificar'] = 3;
        }
        echo json_encode($r);
    }

    public function modificarUnionAction()
    {
        $idunion = $this->_request->getPost('idunion');
        $idmapeo = $this->_request->getPost('idmapeo');
        $campoinicial = $this->_request->getPost('campoinicial');
        $operador = $this->_request->getPost('operador');
        $campofinal = $this->_request->getPost('campofinal');

        $val['idunion'] = $idunion;
        $val['idmapeo'] = $idmapeo;
        $val['campoinicial'] = $campoinicial;
        $val['operador'] = $operador;
        $val['campofinal'] = $campofinal;
        if ($this->_request->getPost('logico') != '') {
            $val['logico'] = $this->_request->getPost('logico');
        } else {
            $val['logico'] = null;
        }
        $modelo = new DatUnionModel();
        $resp = $modelo->Actualizar($val);
        if ($resp) {
            $r['modificar'] = 1;
        } else {
            $r['modificar'] = 3;
        }
        echo json_encode($r);
    }

    public function eliminarUnionAction()
    {
        $idunion = $this->_request->getPost('idunion');
        $model = new DatUnionModel();
        $resp = $model->Eliminar($idunion);
        if ($resp) {
            $r['eliminar'] = 1;
        } else {
            $r['eliminar'] = 3;
        }
        echo json_encode($r);
    }

    public function obtenerPassAction()
    {
        $contrasenna = $this->_request->getPost('contrasenna');
        $pass = $this->decrypt($contrasenna);
        $r['pass'] = $pass;
        echo json_encode($r);
    }

    public function getRolesAction()
    {
        $r = array();;
        try {
            $r['datos'] = $this->integrator->seguridad->getTodosRoles();
            echo json_encode($r);
        } catch (Exception $e) {
            $r['codigo'] = $e->getCode();
            $r['mensaje'] = $e->getMessage();
            echo json_encode($r);
        }
    }

    public function getSegCamposAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $idrol = $this->_request->getPost('idrol');

        $objModel = new SegCampoModel();
        $result = $objModel->getSegCampoAsTree($idconfiguracion, $idrol);

        echo json_encode($result);
    }

    public function setCompartimentacionAction()
    {
        $arrAdd = json_decode($this->_request->getPost('arrAdd'));
        $arrDel = json_decode($this->_request->getPost('arrDel'));

        $objModel = new SegCampoModel();
        $result = $objModel->setAcceso($arrAdd, $arrDel);

        echo json_encode($result);
    }

    /**
     * Eliminar un filtro de compartiementacion
     */
    public function delFiltroAction()
    {
        $idfiltro = $this->_request->getPost('idfiltro');
        $objModel = new SegFiltroModel();
        $r = $objModel->delFiltro($idfiltro);

        echo json_encode($r);
    }

    /**
     * Adiciona o modifica un filtro de la compartimentacion
     */
    public function saveFiltroAction()
    {
        $idfiltro = $this->_request->getPost('idfiltro');
        $idcampo = $this->_request->getPost('idcampo');
        $idrol = $this->_request->getPost('idrol');
        $condicion = $this->_request->getPost('condicion');
        $valor = $this->_request->getPost('valor');
        $valormostrar = $this->_request->getPost('valormostrar');
        $logico = $this->_request->getPost('logico');
        $orden = $this->_request->getPost('orden');

        $objModel = new SegFiltroModel();
        $r = $objModel->saveFiltro($idcampo, $idrol, $condicion, $valor, $valormostrar, $logico, $idfiltro, $orden);

        echo json_encode($r);
    }

    //--- Funciones privadas ---
    /**
     * Verifica conexion con servidor de base de datos
     *
     * @param type $server
     * @param type $port
     * @param type $user
     * @param type $pass
     * @param type $dbname
     *
     * @return boolean
     * @throws ZendExt_Exception
     */
    private function checkConnection($server, $port, $user, $pass, $dbname)
    {
        try {
            $c = new PDO("pgsql:host=$server;dbname=$dbname", $user, $pass);

            return true;
        } catch (PDOException $e) {
            throw new ZendExt_Exception('ADMINREC01');
        }
    }

    /**
     * Decodifica el dato encriptado usando el mismo metodo RSA y la misma llave.
     *
     * @param type $encoded
     *
     * @return type
     */
    private function decrypt($encoded)
    {
        $rsa = new ZendExt_RSA();
        $keys = $rsa->generate_keys('9990454949', '9990450271', 0);
        $decoded = $rsa->decrypt($encoded, $keys[2], $keys[0]);

        return $decoded;
    }

    public function cambiasPassAction()
    {
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $oldPass = $this->_request->getPost('oldPass');
        $newPass = $this->_request->getPost('newPass');
        $viejaclave = $this->_request->getPost('viejaclave');

        $objDatConfiguracionModel = new DatConfiguracionModel();

        $rsa = new ZendExt_RSA();
        $keys = $rsa->generate_keys('9990454949', '9990450271', 0);
        $nuevaclave = $rsa->encrypt($newPass, $keys[1], $keys[0], 5);

        if (!empty($viejaclave)) {
            $clave = $rsa->encrypt($oldPass, $keys[1], $keys[0], 5);
            if ($viejaclave == $clave) {
                $objDatConfiguracionModel->cambiarPass($idconfiguracion, $nuevaclave);
                $r['codMsg'] = 1;
            } else {
                $r['codMsg'] = 0;
            }
        } else {
            $objDatConfiguracionModel->cambiarPass($idconfiguracion, $nuevaclave);
            $r['codMsg'] = 1;
        }
        echo json_encode($r);
    }

    public function getFileCompartimentacionAction(){
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $objComp = new CompartimentacionModel($idconfiguracion);
        $r['code'] = $objComp->getDataFile();

        echo json_encode($r);
    }

    public function saveFileCompartimentacionAction(){
        $idconfiguracion = $this->_request->getPost('idconfiguracion');
        $code = $this->_request->getPost('code');
        $objComp = new CompartimentacionModel($idconfiguracion);
        $r['success'] = $objComp->saveFile($code);
        echo json_encode($r);
    }
    public function ordenarCampoAction(){
        $idcampo = $this->_request->getPost('idcampo');
        $idpadre = $this->_request->getPost('idpadre');
        $posicion = $this->_request->getPost('posicion');

      if($idpadre == null){
          $id = 'null';
      }else{
          $id = $idpadre;
      }

        $objCampo = new DatCampoModel();
        $function = $objCampo->cambiarOrden($idcampo,$id,$posicion);
        $r['success'] = $function;
        echo json_encode($r);
    }

   /* function obtenerValorCampoAction()
    {
        $tabla = $this->_request->getPost('tabla');
        $esquema =$this->_request->getPost('esquema');
        $campo =$this->_request->getPost('campo');


        if($campo=='Edad'){
            $consulta ="SELECT DISTINCT(date_part('year',age(".$esquema.".".$tabla.".fechanacimiento)) || 'años') as denominacion" ." FROM ".$esquema.".".$tabla;
        }

        else if($campo=='Sexo'){
            $consulta ="SELECT DISTINCT ((CASE WHEN ".$esquema.'.'.$tabla.".sexo =". 0 ." THEN"."'". Femenino ."'"." WHEN ".$esquema.'.'.$tabla.".sexo =". 1 ." THEN". "'". Masculino ."'" ."END)) as denominacion  FROM ".$esquema.".".$tabla;
        }
        else if($campo=='No. Identidad'){
            $consulta = 'SELECT ' .$esquema.'.'.$tabla.'.numero as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='Estatura'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.estatura) as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='Contacto'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.contacto) as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else {
            $consulta ='SELECT ' .$esquema.'.'.$tabla.'.denominacion FROM '.$esquema.'.'.$tabla;
        }


        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($consulta);
       for($i = 0;$i<count($result);$i++){
           if($result[$i]['denominacion']==''){
               $result[$i]['denominacion']='0';
           }
       }
        echo json_encode($result);
    }*/
    function obtenerValorCampoAction()
    {
        $tabla = $this->_request->getPost('tabla');
        $esquema =$this->_request->getPost('esquema');
        $campo =$this->_request->getPost('campo');

        if($campo=='Edad'){
            $consulta ="SELECT DISTINCT(date_part('year',age(".$esquema.".".$tabla.".fechanacimiento)) || 'años') as denominacion" ." FROM ".$esquema.".".$tabla;
        }

        else if($campo=='Sexo'){
            $consulta ="SELECT DISTINCT ((CASE WHEN ".$esquema.'.'.$tabla.".sexo =". 0 ." THEN"."'". Femenino ."'"." WHEN ".$esquema.'.'.$tabla.".sexo =". 1 ." THEN". "'". Masculino ."'" ."END)) as denominacion  FROM ".$esquema.".".$tabla;
        }
        else if($campo=='No. Identidad'){
            $consulta = 'SELECT ' .$esquema.'.'.$tabla.'.numero as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='Estatura'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.'dat_fenotipo'.'.estatura) as denominacion FROM mod_persona.dat_persona 
			INNER JOIN mod_persona.dat_fenotipo on (mod_persona.dat_fenotipo.idpersona = mod_persona.dat_persona.idpersona)';
      
	   }
	    else if($campo=='Contacto'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.contacto) as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='Nombre'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.nombre) as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='Primer Apellido'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.papel) as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='Segundo Apellido'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.sapel) as denominacion FROM '.$esquema.'.'.$tabla;
        }
        else if($campo=='País'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.nombrepais) as denominacion FROM '.$esquema.'.'.$tabla;

        }
		else if($campo=='Cuantía'){
            $consulta = 'SELECT DISTINCT(' .$esquema.'.'.$tabla.'.cuantia) as denominacion FROM '.$esquema.'.'.$tabla;

        }else if($campo=='Provincia'){
			$consulta ='SELECT DISTINCT(' .$esquema.'.'.$tabla.'.denominacion) FROM '.$esquema.'.'.$tabla.' WHERE '.$esquema.'.'.$tabla.'.idnivelestructural= 16';

		}	
         else if($campo=='Municipio'){
			$consulta ='SELECT DISTINCT(' .$esquema.'.'.$tabla.'.denominacion) FROM '.$esquema.'.'.$tabla.' WHERE '.$esquema.'.'.$tabla.'.idnivelestructural= 17';

		}			
        else {
            $consulta ='SELECT DISTINCT (' .$esquema.'.'.$tabla.'.denominacion) FROM '.$esquema.'.'.$tabla;
        }


        $result = Doctrine_Manager::getInstance()->getCurrentConnection()->fetchAll($consulta);
        for($i = 0;$i<count($result);$i++){
            if($result[$i]['denominacion']==''){
                $result[$i]['denominacion']='0';
            }
        }
        echo json_encode($result);
    }
}
