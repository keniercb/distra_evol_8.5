<?php

class NomencladorModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarNomenclador($node, $criteriobusqueda) {
        $filtros = array();
        if ($criteriobusqueda != 'undefined') {
            $filtros[0] ['field'] = 'text';
            $filtros[0] ['data']['value'] = $criteriobusqueda;
        }
        return NomNomenclador::listarNomenclador($node, $filtros);
    }

    public function listarGridNomenclador($node, $filtros) {
        $data->data = NomNomenclador::listarNomenclador($node, $filtros);
        $data->total = $data->data[0]['total'];
        return $data;
    }

    public function exportarGridNomenclador($params) {
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
        header('Content-Disposition: attachment;filename=Nomencladores.xls');

        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";

        //titulo
        echo "<H2 align=left>{$params['text']}</H2>";

        echo "</tr>";
        //columnas
        echo '<th align=left>Denominación</th>';
        echo '<th align=left>Descripción</th>';
        echo '<th>Activación</th>';
        echo '<th>Valor por defecto</th>';
        echo "</tr>";

        //Obteniendo los datos
        $datos = self::listarGridNomenclador($params['node'], $params['filtros']);

        //Mostrando los datos
        foreach ($datos->data as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['text'] . "</td>";
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
        echo '</BODY></HTML>';
    }

    public function addModNomenclador($params) {
        $d = strtolower($params['denominacion']);
        if ($params['idpadre'])
            $objNomenclador = Doctrine::getTable('NomNomenclador')->findByDql("lower(denominacion) = '$d' AND idpadre={$params['idpadre']}");
        else
            $objNomenclador = Doctrine::getTable('NomNomenclador')->findByDql("lower(denominacion) = '$d' AND idpadre=idnomenclador");
        if ($params['accion'] == 'adicionar') {
            if ($objNomenclador[0]->idnomenclador)
                return 0; //ya existe un nomenclador con esa denominacion
            else {
                $objNomencladorNuevo = new NomNomenclador();
                $raiz = true;
                if ($params['idpadre']) {
                    $objNomencladorNuevo->idpadre = $params['idpadre'];
                    $raiz = false;
                }
                $objNomencladorNuevo->denominacion = $params['denominacion'];
                $objNomencladorNuevo->descripcion = $params['descripcion'];
                $objNomencladorNuevo->uri = strtolower($params['denominacion']);
                $objNomencladorNuevo->valordefecto = $params['valordefecto'];
                $objNomencladorNuevo->save();
                NomNomenclador::crearUriNomenclador($objNomencladorNuevo->idnomenclador);
                self::ordenarNomencladores($raiz, $objNomencladorNuevo->idpadre);
                return 1; //operacion realizada
            }
        } else {//modificar
            if ($objNomenclador[0]->idnomenclador && $objNomenclador[0]->idnomenclador != $params['idnomenclador'])
                return 0; //ya existe un nomenclador con esa denominacion
            else {
                $objNomencladorNuevo = Doctrine::getTable('NomNomenclador')->find($params['idnomenclador']);
                $objNomencladorNuevo->denominacion = $params['denominacion'];
                $objNomencladorNuevo->descripcion = $params['descripcion'];
                $objNomencladorNuevo->uri = strtolower($params['denominacion']);
                $objNomencladorNuevo->save();
                NomNomenclador::crearUriNomenclador($params['idnomenclador']);
                return 1; //operacion realizada
            }
        }
    }

    public function eliminarnomenclador($params) {
        $arrayNomenclador = explode(',', $params['idnomenclador']);
        $procesados = 0;
        $total = 0;
        foreach ($arrayNomenclador as $value) {
            $result = NomNomenclador::eliminarNomenclador($value);
            $procesados = $procesados + $result;
            $total++;
        }
        if ($procesados != 0) {
            //ordenar los nomencladores
            $raiz = true;
            if ($params['idpadre'] != 0)
                $raiz = false;
            self::ordenarNomencladores($raiz, $params['idpadre']);
        }
        if ($procesados == 0)
            return 0;
        elseif ($procesados == $total)
            return 1;
        else
            return 2;
    }

    public function definirValorDefecto($params) {
        NomNomenclador::eliminarValorDefectoNomenclador($params['idpadre']);
        $objNomencladorNuevo = Doctrine::getTable('NomNomenclador')->find($params['idnomenclador']);
        $objNomencladorNuevo->valordefecto = 1;
        $objNomencladorNuevo->save();
        return 1; //operacion realizada
    }

    public function activarDesactivar($params) {
        NomNomenclador::activarDesactivar($params);
        return 1; //operacion realizada
    }

    public function ordenarNomencladores($raiz, $idpadre) {
        if ($raiz)
            $nomencladores = NomNomenclador::getNomOrdenadosRaiz();
        else
            $nomencladores = NomNomenclador::getNomOrdenados($idpadre);
        $orden = 1;
        foreach ($nomencladores as $idnomenclador) {
            NomNomenclador::actualizarOrdenNom($idnomenclador, $orden);
            $orden++;
        }
    }

    public function ordenAlfabetico($idpadre) {
        if ($idpadre == 0)
            $nomencladores = NomNomenclador::getNomOrdenAlfabeticoRaiz();
        else
            $nomencladores = NomNomenclador::getNomOrdenAlfabetico($idpadre);
        $orden = 1;
        foreach ($nomencladores as $idnomenclador) {
            NomNomenclador::actualizarOrdenNom($idnomenclador, $orden);
            $orden++;
        }
        return 1; //operacion realizada
    }

    public function actualizarOrden($params) {
        foreach ($params['nomenclador'] as $value) {
            $objNomenclador = Doctrine::getTable('NomNomenclador')->find($value->nomenclador->idnomenclador);
            if ($objNomenclador->idnomenclador != null) {
                $objNomenclador->orden = $value->nomenclador->orden;
                $objNomenclador->save();
            }
        }
        return 1; //operacion realizada
    }

    public function moverRama($params) {
        return NomNomenclador::moverRama($params);
    }

    public function importarFicheroNomenclador($params) {
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
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarnomencladordatosxls" . $params['idusuario']);
        //creando tabla donde se guardan los datos del excel
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importarnomencladordatosxls" . $params['idusuario'] . " (xls TEXT) WITH (OIDS = FALSE)");
        //almacenando los datos del excel en la BD para usarlos en la próxima petición
        $conn->execute("INSERT INTO mod_planifimportacion.temp_importarnomencladordatosxls" . $params['idusuario'] . "(xls) VALUES ('" . $datos . "')");
        $result->columnas = $columnas;
        $result->columnasExcel = $columnasExcel;
        return $result;
    }

    public function importarDatosRelacionadosNomenclador($params) {
        $idusuario = $params['idusuario'];
        //obteniendo los datos del excel guardados en BD en la petición anterior(importarfichero)
        $conn = Doctrine_Manager::connection();
        $query = "SELECT xls FROM mod_planifimportacion.temp_importarnomencladordatosxls" . $params['idusuario'];
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $datos = unserialize($result[0]);
        //eliminando tabla donde se guardan los datos del excel
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarnomencladordatosxls" . $params['idusuario']);
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
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_nomencladordatos" . $idusuario . "");
        //creando tabla temporal dinamica
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_nomencladordatos" . $idusuario . " (
                                    idtabla SERIAL,
                                    denominacion VARCHAR(255),
                                    descripcion VARCHAR(255),
                                    iddatosnomenclador NUMERIC(19,0))");

        foreach ($datos as $j => $row) {
            //ignorando los datos del encabezado de la tabla
            if ($j == 1) {
                continue;
            }
            //dando valor a la denominacion si viene vacio
            $denominacion = "";
            $long = strlen($row[$posiciones['denominacion']]);
            //cantidad de caracteres de 1 a 255
            if ($long <= 255 && $long > 0) {
                //en el caso de las denominaciones no las convierto en UTF-8 porque dan error, las dejo igual
                $denominacion = $row[$posiciones['denominacion']];
            }

            //dando valor a la descripcion si viene vacio
            $descripcion = "";
            $long = strlen($row[$posiciones['descripcion']]);
            //cantidad de caracteres de 1 a 255
            if ($long <= 255 && $long > 0) {
                //en el caso de las descripciones no las convierto en UTF-8 porque dan error, las dejo igual
                $descripcion = $row[$posiciones['descripcion']];
            }
            //insertando los datos en la tabla temporal
            $conn->execute("INSERT INTO mod_planifimportacion.temp_nomencladordatos" . $idusuario . "
                        (denominacion,
                        descripcion)
                        VALUES ('$denominacion',
                              '$descripcion')");
        }
        return self::validarDatosImportadosNomenclador($params);
    }

    private function validarDatosImportadosNomenclador($params) {
        try {
            //buscando los datosnomenclador para los mensajes de validación
            $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
            foreach ($array_ests_dnom as $k => $dn) {
                unset($array_ests_dnom[$k]);
                $array_ests_uri[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
            }
            unset($array_ests_dnom);
            $conn = Doctrine_Manager::connection();
            $query = "SELECT    tn.idtabla,
                            tn.descripcion,
                            tn.denominacion,
                            count(*) OVER () as total
                          FROM
                            mod_planifimportacion.temp_nomencladordatos" . $params['idusuario'] . " tn ORDER BY tn.idtabla";
            $datosTemp = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

            foreach ($datosTemp as $key => $value) {
                //la denominación está vacía
                if ($value['denominacion'] == "") {
                    self::actualizarValidacion($params['idusuario'], $value['idtabla'], $array_ests_uri['denominacionvacia']);
                    continue;
                }
                //denominacion  ya existe
                /* $d = strtolower($value['denominacion']);
                  $objNomenclador = Doctrine::getTable('NomNomenclador')->findByDql("lower(denominacion) = '$d' ");
                  if ($objNomenclador[0]->idnomenclador) {
                  self::actualizarValidacion($params['idusuario'], $value['idtabla'], $array_ests_uri['elementorepetido']);
                  continue;
                  } */
                /* //la denominación tiene caracteres raros
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
                  self::actualizarValidacion($params['idusuario'], $value['idtabla'], $array_ests_uri['denominacionnovalida']);
                  continue;
                  } */
                //denominacion  repetida en el excel
                /* $repetido = 0;
                  for ($index = 0; $index < $key; $index++) {
                  if (strtolower($datosTemp[$key]['denominacion']) == strtolower($datosTemp[$index]['denominacion'])) {
                  $repetido = 1;
                  break;
                  }
                  }
                  if ($repetido == 1) {
                  self::actualizarValidacion($params['idusuario'], $value['idtabla'], $array_ests_uri['elementorepetido']);
                  continue;
                  } */
                //si los datos son correctos se guarda el estado "OK"
                self::actualizarValidacion($params['idusuario'], $value['idtabla'], $array_ests_uri['ok']);
            }
            return 1;
        } catch (Exception $e) {
            echo json_encode(array('codMsgN' => $e->getMessage()));
        }
    }

    public function actualizarValidacion($idusuario, $idtabla, $iddatosnomenclador) {
        $conn = Doctrine_Manager::connection();
        $query = "UPDATE
                    mod_planifimportacion.temp_nomencladordatos" . $idusuario . "
                  SET
                    iddatosnomenclador = $iddatosnomenclador
                  WHERE
                    idtabla = $idtabla";
        $conn->execute($query);
    }

    public function listarDatosValidados($idusuario, $start, $limit, $filtros) {
        $condiciones = array();
        if ($filtros) {
            foreach ($filtros as $datos) {
                if ($datos['field'] == 'denominacion' || $datos['field'] == 'descripcion') {
                    $condiciones[] = "upper(tdn." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                }
            }
        }
        $WHERE = "true";
        foreach ($condiciones as $condicion) {
            $WHERE = $WHERE . " AND " . $condicion;
        }
        $conn = Doctrine_Manager::connection();
        $query = "SELECT    tdn.idtabla,
                            tdn.descripcion,
                            tdn.denominacion,
                            tdn.iddatosnomenclador,
                            dn.denominacion as denominaciondato,
                            count(*) OVER () as total
                          FROM
                            mod_planifimportacion.temp_nomencladordatos" . $idusuario . " tdn
                            LEFT JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = tdn.iddatosnomenclador)
                            WHERE $WHERE
                ORDER BY tdn.idtabla OFFSET $start LIMIT $limit";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    public function insertarDatosImportar($idusuario, $idnomenclador) {
        $data = NomDatosnomenclador::listarDatosAImportar($idusuario);

        foreach ($data as $nomenclador) {
            $nuevo = array();
            $nuevo['accion'] = 'adicionar';
            $nuevo['idpadre'] = $idnomenclador;
            $nuevo['denominacion'] = $nomenclador['denominacion'];
            $nuevo['descripcion'] = $nomenclador['descripcion'];
            self::addModNomenclador($nuevo);
        }

        $conn = Doctrine_Manager::connection();
        //eliminando tabla donde se guardan los datos del excel
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarnomencladordatosxls" . $idusuario);
        //eliminando tabla temporal dinámica
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_nomencladordatos" . $idusuario);
        if ($data[0] != null) {
            return 1;
        }
    }

}
