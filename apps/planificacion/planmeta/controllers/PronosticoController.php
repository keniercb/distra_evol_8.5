<?php

class PronosticoController extends ZendExt_Controller_Secure {

    public function init() {
        parent::init();
    }

    public function pronosticoAction() {
        $jsestructura = $this->integrator->metadatos->obtenerIUEstructura();
        $this->view->jsestructura = $jsestructura;
        $this->render();
    }

    //Lista los ejercicios de la planificacion
    public function getEjerciciosAction() {
        $data->data = NomEjercicioplanificacion::listarEjercicioActualByUri();
        $data->idejercicioactual = NomEjercicioplanificacion::obtenerDenEjercicioActual();
        echo json_encode($data);
    }

    //Lista los indicadores planificados con cantidad mayor que cero dada una entidad y un ejercicio
    public function listarIndicadoresAction() {
        ini_set("max_execution_time", 600); //10min de conexion
        $parametros['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $parametros['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $parametros['filtros'] = $this->_request->getPost('filtros');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');
        $parametros['entidades'] = DatActividadentidad::auxObtenerEntidadesHijasComun($this->_request->getPost('identidad'));
        $datos = PronosticoModel::listarIndEjec($parametros);
        foreach ($datos->data as $k => $d) {
            //obtiene la unidad de medida
            $unidades = $this->integrator->datosmaestros->obtenerUnidadMedidaDadoId(Array($d['idunidadmedida']));
            $datos->data[$k]['umedida'] = $unidades[0]['abreviaturaunidadmedida'];
        }
        echo json_encode($datos);
    }

    public function getOrganosbyIndicadorAction() {

        $params = array();
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['idEntidad'] = ($this->_request->getPost('idEntidad'));
        $params['idMes'] = ($this->_request->getPost('idMes'));
        $params['idEjercicio'] = ($this->_request->getPost('idEjercicio'));
        $params['filtros'] = json_decode(stripslashes($this->_request->getPost('Arrayfiltros')));
        $data = array();
        $object = new PronosticoModel();


        $data = $object->getIndWitOrganos($params);

        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function getMesesAction() {


        $data = array();
        $object = new PronosticoModel();
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $data = $object->getMeses($params);

        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function gestionarPronosticoAction() {

        $paramas = array();
        $action = ($this->_request->getPost('action'));
        $options = json_decode($this->_request->getPost('options'));
        $pronosticos = json_decode($this->_request->getPost('pronosticos'));
        $paramas['idEntidad'] = ($this->_request->getPost('idEntidad'));
        $paramas['idMes'] = ($this->_request->getPost('idMes'));
        $paramas['idEjercicio'] = ($this->_request->getPost('idEjercicio'));
        $paramas['total'] = ($this->_request->getPost('total'));
        $data = array();
        $object = new PronosticoModel();
        switch ($action) {

            case'mod':
                $data = $object->setPronosticos($paramas, $pronosticos, $options);
                break;
        }

        echo json_encode(array('codMsg' => $data, 'mensaje' => $action));
    }

    //importar fichero pronostico
    function importarFicheroPronosticoAction() {

        //obteniendo parametros
        $parametros['identidad'] = $this->_request->getPost('identidad');
        $parametros['idejercicio'] = $this->_request->getPost('idejercicio');

        //buscando listado de columnas dinamicas(OS)
        $coldinam = PronosticoModel::listarOrganosSatisface($parametros);

        foreach ($coldinam as $k => $col) {
            $temp = $coldinam[$k][1];
            $coldinam[$k][1] = $k + 1;
            $coldinam[$k][2] = $temp;
        }

        //creando el arreglo de las columnas fijas
        $colfijas = array();
        $colfijas[0][0] = "Código";
        $colfijas[0][1] = 0;

        //obteniendo arreglo con todas las columnas
        $columnas = array_merge($colfijas, $coldinam);

        //leyendo el excel
        $filename = $_FILES['file']['tmp_name'];
        $file = $filename;
        $ruta = '/ReaderModel.php';
        include_once(dirname(__FILE__) . $ruta);
        $data = new ReaderModel();
        $data->setOutputEncoding('CP1251');
        $data->read($file);
        $dat = $data->sheets[0]['cells'];


        //obteniendo las columnas del excel
        $columnasExcel = array();
        foreach ($dat[0] as $k => $col) {
            $columnasExcel[$k][0] = $col;
            $columnasExcel[$k][1] = $k;
        }

        //convirtiendo el arreglo de datos en un text
        $datos = serialize($dat);

        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        //eliminando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarpronosticoxls" . $idusuario);

        //creando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importarpronosticoxls" . $idusuario . " (xls TEXT) WITH (oids = false)");

        //almacenando los datos en la BD para usarlos en la próxima petición         
        $conn->execute("INSERT INTO mod_planifimportacion.temp_importarpronosticoxls" . $idusuario . "(xls) VALUES ('" . $datos . "')");

        echo json_encode(
                array('columnas' => $columnas, 'columnasExcel' => $columnasExcel, 'columnasdinamicas' => $coldinam)
        );
    }

    //validar datos a importar
    function importarDatosRelacionadosAction() {

        //obteniendo los parametros
        $relaciones = json_decode(stripslashes($this->_request->getPost('relaciones')));
        $coldin = json_decode(stripslashes($this->_request->getPost('coldin')));
        $identidad = $this->_request->getPost('identidad');
        $idejercicio = $this->_request->getPost('idejercicio');

        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        //eliminando tabla temporal dinánica
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_pronostico" . $idusuario);

        //obteniendo los datos del excel guardados en BD en la petición anterior(importarfichero)    
        $query = "SELECT  xls FROM  mod_planifimportacion.temp_importarpronosticoxls" . $idusuario;
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $datos = unserialize($result[0]);

        //preparando datos para crear tabla dinamica
        //en esta variable se guarda, de las columnas,
        //la posicion de su columna correspondiente en el excel
        $posiciones = array();

        $idOS = array();

        //en esta variable se guardan los campos
        //con que se creara la tabla
        $cadenacampos = "";

        //en esta variable temporal se guardan las denominaciones 
        //de las columnas sin caracteres especiales
        $tempDenomCol = "";

        foreach ($relaciones as $rel) {
            if ($rel->denominacionOS == "Código") {
                $posiciones['codigo'] = $rel->posicioncolumnaExcel;
                continue;
            }
            //aqui solo entraria si es una columna dinamica                        
            else {
                $tempDenomCol = self::modificarCaracteresEspeciales($rel->denominacionOS);
                $posiciones[$tempDenomCol] = $rel->posicioncolumnaExcel;
                $idOS[$tempDenomCol] = $rel->idOS;
                $cadenacampos.=" " . $tempDenomCol . " VARCHAR(255) NOT NULL default '',";
            }
        }

        //creando tabla temporal dinamica  
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_pronostico" . $idusuario . " (
          idtabla serial,
          codigo VARCHAR(255) NOT NULL,
          idindicador NUMERIC(19,0),          
          $cadenacampos
          iddatosnomenclador NUMERIC(19,0))");

        //variable que guarda la denominacion de los campos dinamicos
        $denomcampos = $coldin[0][0];

        //variable que guarda la denominacion de las columnas dinamicas
        //y su tipo de dato
        $denomc = "";

        //en esta variable se guardan los campos
        //con que se insertara en la tabla
        $cadenacamposUpdate = "";

        //variable para tratar errores
        $iddatosnom = null;
        $idind = null;

        foreach ($datos as $j => $row) {

            $iddatosnom = null;
            $idind = null;

            //ignorando los datos del encabezado de la tabla
            if ($j == 0) {
                continue;
            }

            //dando valor a la denominacion si viene vacio
            if ($row[$posiciones['codigo']]) {
                $codigo = utf8_encode($row[$posiciones['codigo']]);
            } else {
                $codigo = "-";
            }

            //tratamiento de errores
            if ($codigo != "-") {
                $ind = Doctrine::getTable('NomIndicador')->findByDql("codigo = '$codigo'");

                if ($ind[0]->idindicador != null && $ind[0]->idindicador != '') {
                    $idind = $ind[0]->idindicador;
                    if ($ind[0]->estado != 1) {
                        //no esta activado
                        $iddatosnom = 1082;
                    } else {
                        $indp = Doctrine::getTable('NomIndicadorplanif')->findByDql("idindicador = {$ind[0]->idindicador}");
                        if ($indp[0]->nivelplanif != 1) {
                            //no es nivel planif
                            $iddatosnom = 324;
                        } else {
                            if ($indp[0]->idaprobacion != 4) {
                                //no esta aprobado
                                $iddatosnom = 1081;
                            } else {
                                $datosV = DatPronostico::validarIndicador($ind[0]->idindicador, $identidad, $idejercicio);
                                if ($datosV[0] != null && $datosV[0] != '') {

                                    foreach ($coldin as $i => $value) {
                                        $tempDenomCol = self::modificarCaracteresEspeciales($value[0]);

                                        //dando valor al numerico si viene un dato incorrecto o vacio       
                                        $numV = 0.0;
                                        if ($row[$posiciones[$tempDenomCol]]) {
                                            $nV = self::validarNumericPositivo($row[$posiciones[$tempDenomCol]]);
                                            if ($nV != 'no')
                                                $numV = $nV;
                                        }
                                        if ($numV != 0.0) {
                                            $indos = DatPronostico::validarIndicadorOs($ind[0]->idindicador, $idOS[$tempDenomCol]);
                                            if ($indos[0] == null || $indos[0] == '') {
                                                //El indicador no tiene organo que satisface asociado(s)
                                                $iddatosnom = 1129;
                                            }
                                        }
                                    }
                                } else {
                                    //no esta planificado
                                    $iddatosnom = 1130;
                                }
                            }
                        }
                    }
                } else {
                    //no existe ind
                    $idind = 'null';
                    $iddatosnom = 159;
                }
            } else {
                //no existe ind celda vacia en el excel
                $idind = 'null';
                $iddatosnom = 159;
            }

            //variable que guarda los datos dinamicos 
            //a insertar en la tabla temporal
            $dina = "";

            //en esta variable temporal se guardan las denominaciones 
            //de las columnas sin caracteres especiales
            $tempDenomCol = "";

            foreach ($coldin as $i => $value) {
                $tempDenomCol = self::modificarCaracteresEspeciales($value[0]);

                if ($j == 1) {
                    if ($i != 0) {
                        $denomcampos.="," . $value[0];
                    }
                    $cadenacamposUpdate.=" " . $tempDenomCol . ",";
                }

                //dando valor al numerico si viene un dato incorrecto o vacio       
                $num = 0.0;
                if ($row[$posiciones[$tempDenomCol]]) {
                    $n = self::validarNumericPositivo($row[$posiciones[$tempDenomCol]]);
                    if ($n != 'no')
                        $num = $n;
                }
                $dina.=" '" . $num . "_" . $idOS[$tempDenomCol] . "' ,";
                if ($j == 1) {
                    $denomc[] = $tempDenomCol;
                }
            }
            if ($iddatosnom == null)
                $iddatosnom = 312;

            //insertando los datos en la tabla temporal
            $conn->execute("INSERT INTO mod_planifimportacion.temp_pronostico" . $idusuario . "
              ($cadenacamposUpdate idindicador,codigo,iddatosnomenclador)
              VALUES ( $dina $idind,'$codigo',$iddatosnom)");
        }

        echo json_encode(
                array('campos' => $denomcampos, 'columnasdinamicasindex' => $denomc)
        );
    }

    //listar datos validados a importar
    function listarDatosValidadosAction() {
        $coldin = json_decode(stripslashes($this->_request->getParam('coldin')));
        if ($coldin[0]) {
            $coldin = implode(',', $coldin);
            $coldin = ", " . $coldin;
        } else {
            $coldin = "";
        }
        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;
        $start = ($this->_request->getPost('start') != null) ? $this->_request->getParam('start') : 0;
        $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getParam('limit') : 20;
        $filtros = $this->_request->getPost('filtros');
        $addWhere = "where true";
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere.= " and codigo like '%" . $datos['data']['value'] . "%'";
                } else {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $addWhere.= " and  left(" . $datos['field'] . ", strpos(" . $datos['field'] . ", '_')-1)::numeric" . $cond . $datos['data']['value'];
                }
            }
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT idtabla,p.codigo, dn.denominacion as denominaciondato $coldin
FROM mod_planifimportacion.temp_pronostico" . $idusuario . " p
     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = p.iddatosnomenclador)
      $addWhere    OFFSET $start LIMIT $limit";
        $data->data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        $query = "SELECT count(p.idtabla)
FROM mod_planifimportacion.temp_pronostico" . $idusuario . " p
     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = p.iddatosnomenclador)
     $addWhere";
        $data->total = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $data->total = $data->total[0];
        echo json_encode($data);
    }

    //inserta todos los datos validados correctamente
    function insertarDatosImportarAction() {
        //obteniendo los parametros
        //si este parametro hace falta tengo que buscarlo en el metodo importarDatosRelacionados y 
        //ya lo estoy leyendo y mandando de la vista para aca sino hace falta quitarlo de la vista(linea 863)
        //$columnasdinamicas = json_decode($this->_request->getPost('columnasdinamicas'));
        $columnasdinamicas = json_decode(stripslashes($this->_request->getPost('columnasdinamicas')));
        $identidad = $this->_request->getPost('identidad');
        $idejercicio = $this->_request->getPost('idejercicio');
        $idmes = $this->_request->getPost('idmes');

        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        //ejecutando funcion de BD que inserta todos los datos validados correctamente
        $conn = Doctrine_Manager::connection();
        $paramsQuery = array($tabla, $campos, $columnasdinamicas, $idusuario);
        $paramsQuery = array($idusuario, $identidad, $idejercicio, $idmes, implode(",", $columnasdinamicas));
        $query = "select * from mod_planifimportacion.f_importarpronosticoinsertar(?,?,?,?,?);";
        $result = $conn->execute($query, $paramsQuery);
        $result->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(1);
    }

    public static function modificarCaracteresEspeciales($url) {
        $url = strtolower($url);
        //Reemplazamos caracteres especiales latinos 
        $find = array('á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'î', 'ô', 'û', 'ã', 'õ', 'ç', 'ñ');
        $repl = array('a', 'e', 'i', 'o', 'u', 'a', 'e', 'i', 'o', 'u', 'a', 'o', 'c', 'n');
        $url = str_replace($find, $repl, $url);
        //Añadimos los guiones 
        $find = array(' ', '&amp;', '\r\n', '\n', '+');
        $url = str_replace($find, '_', $url);
        //Eliminamos y Reemplazamos los demas caracteres especiales 
        $find = array('/[^a-z0-9\-&lt;&gt;]/', '/[\-]+/', '/&lt;{^&gt;*&gt;/');
        $repl = array('', '-', '');
        $url = preg_replace($find, $repl, $url);
        return $url;
    }

    private function validarNumericPositivo($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor) && $valor >= 0) {
            return $valor;
        }
        return 'no';
    }

    //Permite obtener todas las unidades de medida
    public function cargarunidadmedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function cargarumAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function listaIndicadoresAction() {
        $data = array();
        $params = array();
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['idEntidad'] = ($this->_request->getPost('idEntidad'));
        $params['idMes'] = ($this->_request->getPost('idMes'));
        $params['idEjercicio'] = ($this->_request->getPost('idEjercicio'));
        $params['filtros'] = json_decode(stripslashes($this->_request->getPost('Arrayfiltros')));
        $object = new PronosticoModel();
        $data = $object->getIndicadores($params);

        echo json_encode(array('total' => $data[0]['total'], 'data' => $data));
    }

    public function listaOrganosAction() {
        //buscando listado de columnas dinamicas(OS)
        $unidades = PronosticoModel::getOrganosSatisface();

        echo json_encode(array('data' => $unidades));
    }

    public function exportarAction() {

        $params = array();
        ini_set("max_execution_time", 3600); //600 = 10min  3600 = 1hora
        $params['idEntidad'] = ($this->_request->getParam('idEntidad'));
        $params['textEntidad'] = ($this->_request->getParam('textEntidad'));
        $params['idMes'] = ($this->_request->getParam('idMes'));
        $params['idEjercicio'] = ($this->_request->getParam('idEjercicio'));
        $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
        $params['colunmasDinamicas'] = json_decode(stripslashes($this->_request->getParam('colunmasDinamicas')));

        $object = new PronosticoModel();

        $data = $object->exportarPronostico($params);
    }

}
