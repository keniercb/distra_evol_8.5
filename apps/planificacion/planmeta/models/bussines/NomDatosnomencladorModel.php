<?php

class NomDatosnomencladorModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarDatonomenclador($params) {
        $params['addWhereFiltros'] = "";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos ['field'] == 'denominacion') {
                    $params['addWhereFiltros'] .= " AND upper(dn.denominacion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos ['field'] == 'descripcion') {
                    $params['addWhereFiltros'] .= " AND upper(dn.descripcion) LIKE  " . "'%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } elseif ($datos['field'] == 'activacion' || $datos['field'] == 'valordefecto') {
                    if ($datos['data']['value'])
                        $params['addWhereFiltros'] .= " AND dn.{$datos['field']} = {$datos['data']['value']}";
                    else
                        $params['addWhereFiltros'] .= " AND dn.{$datos['field']} = 0";
                }
            }
        }
        return NomDatosnomenclador::listarDatonomenclador($params);
    }

    public function exportarDatoNomenclador($params) {
        //Ajustando los parámetros de los filtros al formato 'listar'
        $nuevos_filtros = [];
        foreach ($params['filtros'] as $filtro) {
            $obj_filtro['field'] = $filtro->field;
            $obj_filtro['data']['type'] = $filtro->data->type;
            if ($obj_filtro['data']['type'] == 'numeric') {
                $obj_filtro['data']['comparison'] = $filtro->data->comparison;
            }
            if ($obj_filtro['data']['type'] == 'list') {
                $obj_filtro['data']['value'] = $filtro->data->value[0];
            } else {
                $obj_filtro['data']['value'] = $filtro->data->value;
            }
            $nuevos_filtros[] = $obj_filtro;
        }
        $params['filtros'] = $nuevos_filtros;

        //preparando excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header('Content-Disposition: attachment;filename=Datosnomencladores.xls');

        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";

        //titulo        
        echo "<H2 align=left>Datos nomencladores</H2>";
        echo "<H2 align=left>{$params['denomTiponomenclador']}</H2>";

        echo "</tr>";
        //columnas
        echo '<th align=left>Denominación</th>';
        echo '<th align=left>Descripción</th>';
        echo '<th>Activación</th>';
        echo '<th>Valor por defecto</th>';
        echo "</tr>";

        //Obteniendo los datos
        $datos = self::listarDatonomenclador($params);
        //Mostrando los datos
        foreach ($datos->data as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacion'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['descripcion'] . "</td>";
            if ($value['activacion'] == 1) {
                echo"<td align=left style=\"mso-number-format:'@';\" >" . 'Sí' . "</td>";
            } else {
                echo"<td align=left style=\"mso-number-format:'@';\" >" . 'No' . "</td>";
            }
            if ($value['valordefecto'] == 1) {
                echo"<td align=left style=\"mso-number-format:'@';\" >" . 'Sí' . "</td>";
            } else {
                echo"<td align=left style=\"mso-number-format:'@';\" >" . 'No' . "</td>";
            }
            echo "</tr>";
        }
        echo "</table>\n";
        $fecha = strftime("%Y/%m/%d %T", time());
        echo"Fecha: {$fecha}</H6>.";
        echo '</BODY></HTML>';
    }

    public function addModDatonomenclador($params) {
        $d = strtolower($params['denominacion']);
        $objDatosnomenclador = Doctrine::getTable('NomDatosnomenclador')->findByDql("lower(denominacion) = '$d' AND idtiponomenclador={$params['idtiponomenclador']}");
        if ($params['accion'] == 'adicionar') {
            if ($objDatosnomenclador[0]->iddatosnomenclador)
                return 0; //ya existe un datonomenclador con esa denominacion
            else {
                $objDatosnomencladorNuevo = new NomDatosnomenclador();
                $objDatosnomencladorNuevo->denominacion = $params['denominacion'];
                $objDatosnomencladorNuevo->idtiponomenclador = $params['idtiponomenclador'];
                $objDatosnomencladorNuevo->descripcion = $params['descripcion'];
                $objDatosnomencladorNuevo->uridatosnomenclador = strtolower($params['denominacion']);
                $objDatosnomencladorNuevo->valordefecto = $params['valordefecto'];
                $objDatosnomencladorNuevo->save();
                NomDatosnomenclador::crearUriDatoNomenclador($objDatosnomencladorNuevo->iddatosnomenclador);

                //ordenar los datos nomencladores del tipo nomenclador
                self::ordenarDatosNomencladores($params['idtiponomenclador']);
                return 1; //operacion realizada
            }
        } else {//modificar    
            if ($objDatosnomenclador[0]->iddatosnomenclador && $objDatosnomenclador[0]->iddatosnomenclador != $params['iddatosnomenclador'])
                return 0; //ya existe un datonomenclador con esa denominacion
            else {
                $objDatosnomencladorNuevo = Doctrine::getTable('NomDatosnomenclador')->find($params['iddatosnomenclador']);
                $objDatosnomencladorNuevo->denominacion = $params['denominacion'];
                $objDatosnomencladorNuevo->idtiponomenclador = $params['idtiponomenclador'];
                $objDatosnomencladorNuevo->descripcion = $params['descripcion'];
                $objDatosnomencladorNuevo->valordefecto = $params['valordefecto'];
                $objDatosnomencladorNuevo->uridatosnomenclador = strtolower($params['denominacion']);
                $objDatosnomencladorNuevo->save();
                NomDatosnomenclador::crearUriDatoNomenclador($params['iddatosnomenclador']);
                return 1; //operacion realizada
            }
        }
    }

    public function eliminarDatonomenclador($params) {
        $arrayDatosnomenclador = explode(',', $params['iddatosnomenclador']);
        $procesados = 0;
        $total = 0;
        foreach ($arrayDatosnomenclador as $value) {
            $result = NomDatosnomenclador::eliminarDatonomenclador($value);
            $procesados = $procesados + $result;
            $total++;
        }
        if ($procesados != 0) {
            //ordenar los datos nomencladores del tipo nomenclador
            self::ordenarDatosNomencladores($params['idtiponomenclador']);
        }
        if ($procesados == 0)
            return 0;
        elseif ($procesados == $total)
            return 1;
        else
            return 2;
    }

    public function definirValorDefecto($params) {
        NomDatosnomenclador::eliminarValorDefectoDatonomenclador($params['idtiponomenclador']);
        $objDatosnomencladorNuevo = Doctrine::getTable('NomDatosnomenclador')->find($params['iddatosnomenclador']);
        $objDatosnomencladorNuevo->valordefecto = 1;
        $objDatosnomencladorNuevo->save();
        return 1; //operacion realizada
    }

    public function activarDesactivar($params) {
        NomDatosnomenclador::activarDesactivar($params);
        return 1; //operacion realizada
    }

    public function ordenarDatosNomencladores($idtiponomenclador) {
        $datosNomencladores = NomDatosnomenclador::getDatosNomOrdenados($idtiponomenclador);
        $orden = 1;
        foreach ($datosNomencladores as $iddatosnomenclador) {
            NomDatosnomenclador::actualizarOrdenDatoNom($iddatosnomenclador, $orden);
            $orden++;
        }
    }

    public function actualizarOrden($params) {
        foreach ($params['datonomenclador'] as $value) {
            $objDatosnomenclador = Doctrine::getTable('NomDatosnomenclador')->find($value->datonomenclador->iddatosnomenclador);
            if ($objDatosnomenclador->iddatosnomenclador != null) {
                $objDatosnomenclador->orden = $value->datonomenclador->orden;
                $objDatosnomenclador->save();
            }
        }
        return 1; //operacion realizada
    }

    public function ordenAlfabetico($idtiponomenclador) {
        $datosNomencladores = NomDatosnomenclador::getDatosNomOrdenAlfabetico($idtiponomenclador);
        $orden = 1;
        foreach ($datosNomencladores as $iddatosnomenclador) {
            NomDatosnomenclador::actualizarOrdenDatoNom($iddatosnomenclador, $orden);
            $orden++;
        }
        return 1; //operacion realizada
    }

    public function importarFicheroDatonomenclador($params) {
        //creando el arreglo de las columnas fijas
        $columnas = array();
        $columnas[0][0] = 'Denominación';
        $columnas[0][1] = 0;
        $columnas[1][0] = 'Descripción';
        $columnas[1][1] = 0;
        //obteniendo las columnas del excel
        $columnasExcel = array();
        $cont = 0;
        foreach ($params['data'][1] as $k => $col) {
            $columnasExcel[$cont][0] = $col;
            $columnasExcel[$cont][1] = $k;
            $cont++;
        }
        //convirtiendo el arreglo de datos en un text
        $datos = serialize($params['data']);
        //eliminando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importardatonomencladordatosxls" . $params['idusuario']);
        //creando tabla donde se guardan los datos del excel
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importardatonomencladordatosxls" . $params['idusuario'] . " (xls TEXT) WITH (OIDS = FALSE)");
        //almacenando los datos del excel en la BD para usarlos en la próxima petición
        $conn->execute("INSERT INTO mod_planifimportacion.temp_importardatonomencladordatosxls" . $params['idusuario'] . "(xls) VALUES ('" . $datos . "')");
        $result->columnas = $columnas;
        $result->columnasExcel = $columnasExcel;
        return $result;
    }

    public function importarDatosRelacionadosDatonomenclador($params) {
        //obteniendo los datos del excel guardados en BD en la petición anterior(importarfichero)    
        $conn = Doctrine_Manager::connection();
        $query = "SELECT xls FROM mod_planifimportacion.temp_importardatonomencladordatosxls" . $params['idusuario'];
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $datos = unserialize($result[0]);
        //eliminando tabla donde se guardan los datos del excel
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importardatonomencladordatosxls" . $params['idusuario']);
        //preparando datos para crear tabla dinamica
        //en esta variable se guarda, de las columnas,
        //la posicion de su columna correspondiente en el excel
        $posiciones = array();
        foreach ($params['relaciones'] as $rel) {
            if ($rel->denominacionOS == "Denominación") {
                $posiciones['denominacion'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Descripción") {
                $posiciones['descripcion'] = $rel->posicioncolumnaExcel;
                continue;
            }
        }
        //eliminando tabla temporal dinánica
        NomDatosnomenclador::obtenerDatosCargados($params['idusuario']);
        //creando tabla temporal dinamica  
        NomDatosnomenclador::crearTablaTemporal($params['idusuario']);
        foreach ($datos as $j => $row) {
            //ignorando los datos del encabezado de la tabla
            if ($j == 1) {
                continue;
            }
            //dando valor a la denominacion si viene vacio
            $denominacion = ""; 
            if (self::validarDenominacionDatonomenclador($row[$posiciones['denominacion']])) {
                //en el caso de las denominaciones no las convierto en UTF-8 porque dan error, las dejo igual
                $denominacion = $row[$posiciones['denominacion']];
            }
            //dando valor a la descripcion si viene vacio
            $descripcion = "";
            if (self::validarDescripcionDatonomenclador($row[$posiciones['descripcion']])) {
                //en el caso de las descripciones no las convierto en UTF-8 porque dan error, las dejo igual
                $descripcion = $row[$posiciones['descripcion']];
            }
            //insertando los datos en la tabla temporal
            NomDatosnomenclador::insertarDatosTablaTemporal($params['idusuario'], $denominacion, $descripcion);
        }
        return self::validarDatosImportadosDatosnomenclador($params);
    }

    private function validarDatosImportadosDatosnomenclador($params) {
        try {
            //buscando los datosnomenclador para los mensajes de validación 
            $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
            foreach ($array_ests_dnom as $k => $dn) {
                unset($array_ests_dnom[$k]);
                $array_ests_uri[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
            }
            unset($array_ests_dnom);
            $datosTemp = NomDatosnomenclador::listarDatosTablaTemporal($params['idusuario']);            
            foreach ($datosTemp as $key => $value) {
                //la denominación está vacía
                if ($value['denominacion'] == "") {
                    NomDatosnomenclador::actualizarValidacion($params['idusuario'], $value['idtabla'], $array_ests_uri['denominacionvacia']);
                    continue;
                }
                //denominacion  ya existe
                $d = strtolower($value['denominacion']);
                $objDatosnomenclador = Doctrine::getTable('NomDatosnomenclador')->findByDql("lower(denominacion) = '$d' AND idtiponomenclador={$params['idtiponomenclador']}");
                if ($objDatosnomenclador[0]->iddatosnomenclador) {
                    NomDatosnomenclador::actualizarValidacion($params['idusuario'], $value['idtabla'], $array_ests_uri['elementorepetido']);
                    continue;
                }
                //la denominación tiene caracteres raros
                if (substr_count($value['denominacion'], '(') > 0 ||
                        substr_count($value['denominacion'], ')') > 0 ||
                        substr_count($value['denominacion'], '[') > 0 ||
                        substr_count($value['denominacion'], ']') > 0 ||
                        substr_count($value['denominacion'], '+') > 0 ||
                        substr_count($value['denominacion'], '/') > 0 ||
                        substr_count($value['denominacion'], '.') > 0 ||
                        substr_count($value['denominacion'], '*') > 0 ||
                        substr_count($value['denominacion'], ':') > 0 ||
                        substr_count($value['denominacion'], ';') > 0 ||
                        substr_count($value['denominacion'], ',') > 0) {
                    NomDatosnomenclador::actualizarValidacion($params['idusuario'], $value['idtabla'], $array_ests_uri['denominacionnovalida']);
                    continue;
                }
                //denominacion  repetida en el excel
                $repetido = 0;
                for ($index = 0; $index < $key; $index++) {
                    if (strtolower($datosTemp[$key]['denominacion']) == strtolower($datosTemp[$index]['denominacion'])) {
                        $repetido = 1;
                        break;
                    }
                }
                if ($repetido == 1) {
                    NomDatosnomenclador::actualizarValidacion($params['idusuario'], $value['idtabla'], $array_ests_uri['elementorepetido']);
                    continue;
                }
                //si los datos don correctos se guarda el estado "OK"
                NomDatosnomenclador::actualizarValidacion($params['idusuario'], $value['idtabla'], $array_ests_uri['ok']);
            }
            return 1;
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function listarDatosValidados($idusuario, $start, $limit, $filtros) {
        return NomDatosnomenclador::listarDatosValidados($idusuario, $start, $limit, $filtros);
    }

    public function insertarDatosImportar($idusuario, $idtiponomenclador) {
        $data = NomDatosnomenclador::listarDatosAImportar($idusuario);
        foreach ($data as $datonomenclador) {
            $objDatosnomencladorNuevo = new NomDatosnomenclador();
            $objDatosnomencladorNuevo->denominacion = $datonomenclador['denominacion'];
            $objDatosnomencladorNuevo->idtiponomenclador = $idtiponomenclador;
            $objDatosnomencladorNuevo->descripcion = $datonomenclador['descripcion'];
            $objDatosnomencladorNuevo->uridatosnomenclador = strtolower($datonomenclador['denominacion']);
            $objDatosnomencladorNuevo->valordefecto = 0;
            $objDatosnomencladorNuevo->save();
            NomDatosnomenclador::crearUriDatoNomenclador($objDatosnomencladorNuevo->iddatosnomenclador);

            //ordenar los datos nomencladores del tipo nomenclador
            self::ordenarDatosNomencladores($idtiponomenclador);
        }
        $conn = Doctrine_Manager::connection();
        //eliminando tabla donde se guardan los datos del excel
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importardatonomencladordatosxls" . $idusuario);
        //eliminando tabla temporal dinámica
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_datonomencladordatos" . $idusuario);
        if ($data[0] != null) {
            return 1;
        }
    }

    public function validarDenominacionDatonomenclador($denominacion) {
        $long = strlen($denominacion);        
        //cantidad de caracteres de 1 a 255
        if ($long <= 255 && $long > 0) {
            return true;
        } else
            return false;
    }

    public function validarDescripcionDatonomenclador($descripcion) {
        $long = strlen($descripcion);
        //cantidad de caracteres de 1 a 255
        if ($long <= 255 && $long > 0) {
            return true;
        } else
            return false;
    }

    public function getDatosNomDadoIdTipoNom($idtn) {
        return NomDatosnomenclador::getDatosNomPorIdTipoNom($idtn);
    }

    public function ObtenerDatosDadoIdDatosNom($ids) {
        return NomDatosnomenclador::ObtenerDatosDadoIdDatosNom($ids);
    }

    public function obtenerDatosNomencladorByDenominacion($denominacion) {
        return NomDatosnomenclador::obtenerDatosNomencladorByDenominacion($denominacion);
    }

    public function verificarEstados() {
        //version anterior
        $datNomCreado = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadosejercicio', 'creado');
        //version actual
        $datNomElaboracion = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadosejercicio', 'elaboracion');
        if ($datNomCreado[0] || $datNomElaboracion[0])
            return 1;
        else
            return 0;
    }

    //estos metodos son de las recuperaciones
    public function listarSR() {
        return NomDatosnomenclador::ObtenerDatosNomenclador(5);
    }

    public function listarDestinos() {
        return NomDatosnomenclador::ObtenerDatosNomenclador(4);
    }

    public function listarOACE() {
        return NomDatosnomenclador::ObtenerDatosNomenclador(6);
    }

    //ver si esta solucion se mantiene
    public function listarDatosNomencladorDadoDenomTipoComp($denomtipo) {
        $tipocomp = NomTiponomenclador::NomTiponomenclador($denomtipo);
        $tiponomasociado = DatTipocomponentetiponomencladorModel::getAsocPorTipoComp($tipocomp[0]['idtipocomponente']);
        return NomDatosnomencladorModel::getDatosNomDadoIdTipoNom($tiponomasociado[0]['idtiponomenclador']);
    }

}
