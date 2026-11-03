<?php

class ConfigurardepreciacionController extends ZendExt_Controller_Secure {

    function init() {
        parent::init();
        $this->_meta = ZendExt_Metadata::getInstance();
    }

    public function configurardepreciacionAction() {
        $this->render();
    }

    public function cargarUnidaddeMedidaAction() {
        $unidades = $this->integrator->datosmaestros->listarUnidadesMedidaTodas();
        echo json_encode(array('data' => $unidades));
    }

    public function listarNaturalezasAction() {
        $naturaleza = DatBasescalculoModel::obtenerNaturalezas();
        echo json_encode(array('data' => $naturaleza));
    }

    public function listarIndicadoresParaAdicionarAction() {
        $params = array();
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = ConfigurardepreciacionModel::listarIndicadoresParaAdicionar($params);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function listarDepreciacionesAction() {
        $params = array();
        $params['start'] = ($this->_request->getPost('start') != null) ? $this->_request->getPost('start') : 0;
        $params['limit'] = ($this->_request->getPost('limit') != null) ? $this->_request->getPost('limit') : 20;
        $params['filtros'] = $this->_request->getPost('filtros');
        $data = ConfigurardepreciacionModel::listarDepreciaciones($params);

        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    public function adicionarIndicadorAction() {
        $params['idindicadores'] = json_decode(stripslashes($this->_request->getPost('idindicadores')));
        $res = ConfigurardepreciacionModel::adicionarIndicadores($params);
        echo json_encode(array('codMsg' => $res));
    }

    public function modificarIndicadoresAction() {
        $params['valores'] = json_decode(stripslashes($this->_request->getPost('valores')));
        echo json_encode(array('codMsg' => ConfigurardepreciacionModel::modificarIndicadores($params)));
    }

    public function eliminarIndicadorAction() {
        try {
            $res = 0;
            $indicadores = json_decode(stripslashes($this->_request->getPost('indicadores')));
            if ($indicadores [0] != null) {
                $res = ConfigurardepreciacionModel::eliminarIndicadores($indicadores);
            }
            echo json_encode(array('codMsg' => $res));
        } catch (Exception $e) {
            echo json_encode(array('codMsg' => $e->getMessage()));
        }
    }

    public function exportarAction() {
        $params['filtros'] = json_decode(stripslashes($this->_request->getParam('filtros')));
        $obj = new ConfigurardepreciacionModel();
        $obj->exportar($params);
    }

    //Importar fichero
    function importarFicheroAction() {
        //creando el arreglo de las columnas fijas
        $columnas = array();
        $columnas[0][0] = "Código del indicador";
        $columnas[0][1] = 0;

        $columnas[1][0] = "Denominación";
        $columnas[1][1] = 0;

        $columnas[2][0] = "Cantidad";
        $columnas[2][1] = 0;

        $columnas[3][0] = "Tasa de depreciación anual";
        $columnas[3][1] = 0;



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
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importardepreciacionxls" . $idusuario);

        //creando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importardepreciacionxls" . $idusuario . " (xls TEXT) WITH (OIDS = FALSE)");

        //almacenando los datos en la BD para usarlos en la próxima petición         
        $conn->execute("INSERT INTO mod_planifimportacion.temp_importardepreciacionxls" . $idusuario . "(xls) VALUES ('" . $datos . "')");

        echo json_encode(
                array('columnas' => $columnas, 'columnasExcel' => $columnasExcel)
        );
    }

    //validar datos a importar
    function importarDatosRelacionadosAction() {

        //obteniendo los parametros
        $relaciones = json_decode(stripslashes($this->_request->getPost('relaciones')));
        //$idcartatecnologica = $this->_request->getPost('idcartatecnologica');
        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;

        //eliminando tabla temporal dinámica
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importardepreciacion" . $idusuario);

        //obteniendo los datos del excel guardados en BD en la petición anterior(importarfichero)    
        $query = "SELECT  xls FROM  mod_planifimportacion.temp_importardepreciacionxls" . $idusuario;
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $datos = unserialize($result[0]);

        //preparando datos para crear tabla dinamica
        //en esta variable se guarda, de las columnas,
        //la posicion de su columna correspondiente en el excel
        $posiciones = array();

        foreach ($relaciones as $rel) {
            if ($rel->denominacionOS == "Código del indicador") {
                $posiciones['codigo'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Denominación") {
                $posiciones['denominacion'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Cantidad") {
                $posiciones['cantidad'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Tasa de depreciación anual") {
                $posiciones['tasadepreciacionanual'] = $rel->posicioncolumnaExcel;
                continue;
            }
        }
        //creando tabla temporal dinamica  
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importardepreciacion" . $idusuario . " (
          idtabla SERIAL,
          codigo VARCHAR(255) NOT NULL,
          denominacion VARCHAR(255) NOT NULL,   
          cantidad NUMERIC(19,2) NOT NULL,          
          tasadepreciacionanual NUMERIC(19,2) NOT NULL,
          iddatosnomenclador NUMERIC(19,0))");

        foreach ($datos as $j => $row) {

            //ignorando los datos del encabezado de la tabla
            if ($j == 0) {
                continue;
            }
            //dando valor a la codigo si viene vacio
            if ($row[$posiciones['codigo']]) {
                $codigo = utf8_encode($row[$posiciones['codigo']]);
            } else {
                $codigo = "-";
            }
            //dando valor a la denominacion si viene vacio
            if ($row[$posiciones['denominacion']]) {
                $denominacion = utf8_encode($row[$posiciones['denominacion']]);
            } else {
                $denominacion = "-";
            }
            //dando valor a la cantidad si viene vacio
            $cantidad = 0;
            if ($row[$posiciones['cantidad']]) {
                $n = self::validarNumericPositivo($row[$posiciones['cantidad']]);
                if ($n != 'no')
                    $cantidad = $n;
            }
            //dando valor a la tasa de depreciacion anual si viene vacio
            $tasaDA = 0;
            if ($row[$posiciones['tasadepreciacionanual']]) {
                $n = self::validarNumericPositivo($row[$posiciones['tasadepreciacionanual']]);
                if ($n != 'no')
                    $tasaDA = $n;
            }

            //insertando los datos en la tabla temporal
            $conn->execute("INSERT INTO mod_planifimportacion.temp_importardepreciacion" . $idusuario . "
                        (
                        codigo,          
                        denominacion,          
                        cantidad,    
                        tasadepreciacionanual)
                        VALUES (
                              '$codigo',
                              '$denominacion',
                              $cantidad,
                              $tasaDA    
                        )");
        }

        self::validarDatosImportados($idusuario);
        echo json_encode(array('campos' => 1));
    }

    //Validar datos importados
    private function validarDatosImportados($idusuario) {
        //Buscando los datosnomenclador para los mensajes de validación 
        $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
        foreach ($array_ests_dnom as $k => $dn) {
            unset($array_ests_dnom[$k]);
            $array_ests_uri[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
        }

        $formato = NomActividad::obtener_ConfFormato_UltimoNivel();
        $idformato = $formato[0];
        $ultimoNivel = $formato[1];

        $conn = Doctrine_Manager::connection();
        $query = "SELECT e.idtabla,
                        e.codigo,
                        ind.idindicador,
                        e.denominacion,
                        e.cantidad,
                        e.tasadepreciacionanual,
                        e.iddatosnomenclador
                 FROM mod_planifimportacion.temp_importardepreciacion" . $idusuario . " e
                    LEFT JOIN mod_datosmaestros.nom_indicador ind
                    ON ind.codigo =e.codigo                     
                    LEFT JOIN mod_datosmaestros.nom_indicadorplanif indp 
                    ON indp.idindicador =ind.idindicador";
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        
        foreach ($result as $key => $value) {
            //No existe formato para las actividad
           /* if ($idformato == null) {
                self::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['noexisteformatoactividades']);
                continue;
            }
            if ($value['idactividad'] == null) {
                self::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['codigoactvacio']);
                continue;
            }
            if ($value['nivel'] != $ultimoNivel) {
                self::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['actividadnoesultimonivel']);
                continue;
            }*/
            //Validado correctamente
            self::actualizarValidacion($idusuario, $value['idtabla'], $array_ests_uri['ok']);
        }
    }

    //Actualizar los datos validados
    private function actualizarValidacion($idusuario, $idtabla, $iddatosnomenclador) {
        $conn2 = Doctrine_Manager::connection();
        $query = "UPDATE 
                    mod_planifimportacion.temp_importardepreciacion" . $idusuario . " 
                  SET 
                    iddatosnomenclador = $iddatosnomenclador 
                  WHERE 
                    idtabla = $idtabla;";
        $conn2->execute($query);
    }

    //listar datos validados a importar
    function listarDatosValidadosAction() {
        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;
        $start = ($this->_request->getPost('start') != null) ? $this->_request->getParam('start') : 0;
        $limit = ($this->_request->getPost('limit') != null) ? $this->_request->getParam('limit') : 20;
        $filtros = $this->_request->getPost('filtros');
        $addWhere = "where true";
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere .= " and e.codigo like '%" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion') {
                    $addWhere .= " and upper(e." . $datos['field'] . ") LIKE '%" . strtoupper($datos['data']['value']) . "%'";
                } else
                if ($datos['field'] == 'cantidad' || $datos['field'] == 'tasadepreciacionanual') {
                    if ($datos['data']['comparison'] == 'lt') {
                        $sqlSigno = "<";
                    } else {
                        if ($datos['data']['comparison'] == 'gt') {
                            $sqlSigno = ">";
                        } else {
                            $sqlSigno = "=";
                        }
                    }
                    $addWhere .= " and e." . $datos['field'] . $sqlSigno . $datos['data']['value'];
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT e.idtabla,
                        e.codigo,
                        e.denominacion,
                        e.cantidad,
                        e.tasadepreciacionanual,
                        ndn.denominacion as denominaciondato,
                        count(*) over () as total
                 FROM mod_planifimportacion.temp_importardepreciacion" . $idusuario . " e
                     LEFT JOIN mod_planificacion.nom_datosnomenclador ndn ON (
       ndn.iddatosnomenclador = e.iddatosnomenclador)
                      $addWhere 
                ORDER BY e.codigo OFFSET $start LIMIT $limit";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        echo json_encode(array('data' => $data, 'total' => $data[0]['total']));
    }

    //inserta todos los datos validados correctamente
    function insertarDatosImportarAction() {
        ini_set("max_execution_time", 60000);
        //obteniendo los parametros
        //obteniendo el id del usuario logueado
        $idusuario = $this->global->Perfil->idusuario;
        
        $conn = Doctrine_Manager::connection();
        $query = "SELECT ind.idindicador
                 FROM mod_planifimportacion.temp_importardepreciacion" . $idusuario . " e
                    LEFT JOIN mod_datosmaestros.nom_indicador ind
                    ON ind.codigo =e.codigo";
        $result= $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        foreach ($result as $i){
            $params['idindicadores'][]=$i['idindicador'];
        }
        //adicionamos los indicadores
        $res = ConfigurardepreciacionModel::adicionarIndicadores($params);

        //eliminando tabla donde se guardan los datos del excel
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importardepreciacionxls" . $idusuario);
        //eliminando tabla temporal dinámica
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importardepreciacion" . $idusuario);

        echo json_encode(array('codMsgN' => 1));
    }

    private function validarNumericPositivo($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor) && $valor >= 0) {
            return $valor;
        }
        return 'no';
    }

    private function validarNumeric($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor)) {
            return $valor;
        }
        return 'no';
    }

}
