<?php

///var/www/vhosts/scp.prod.xetid.cu/htdocs/sige/apps/planificacion/plancentral/models/bussines

class ImportardemandaModel extends ZendExt_Model {

    //IMPORTAR demanda de produccion
    function importarFicheroDemanda($params) {
        
        //creando el arreglo de las columnas fijas
        $columnas = array();
        $columnas[0][0] = "Código del indicador";
        $columnas[0][1] = 0;

        $columnas[1][0] = "Denominación";
        $columnas[1][1] = 0;

        $columnas[2][0] = "Cantidad";
        $columnas[2][1] = 0;

        $columnas[3][0] = "Ajuste";
        $columnas[3][1] = 0;

        $columnas[4][0] = "EMI";
        $columnas[4][1] = 0;

        $columnas[5][0] = "Programa";
        $columnas[5][1] = 0;

        $columnas[6][0] = "Destino";
        $columnas[6][1] = 0;
        
        //obteniendo las columnas del excel
        $columnasExcel = array();
        foreach ($params['data'][0] as $k => $col) {
            $params['data'][0][$k] = utf8_encode($col);
            $columnasExcel[$k][0] = utf8_encode($col);
            $columnasExcel[$k][1] = $k;
        }

        //convirtiendo el arreglo de datos en un text
        $datos = serialize($params['data']);

        //eliminando tabla donde se guardan los datos del excel
        $conn = Doctrine_Manager::connection();
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarproezademandadatosxls" . $params['idusuario']);

        //creando tabla donde se guardan los datos del excel
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importarproezademandadatosxls" . $params['idusuario'] . " (xls TEXT) WITH (OIDS = FALSE)");

        //almacenando los datos del excel en la BD para usarlos en la próxima petición         
        $conn->execute("INSERT INTO mod_planifimportacion.temp_importarproezademandadatosxls" . $params['idusuario'] . "(xls) VALUES ('" . $datos . "')");

        $result->columnas = $columnas;
        $result->columnasExcel = $columnasExcel;
        return $result;
    }

    //validar datos a importar
    function importarDatosRelacionadosDemanda($params) {

        //obteniendo los datos del excel guardados en BD en la petición anterior(importarfichero)    
        $conn = Doctrine_Manager::connection();
        $query = "SELECT xls FROM mod_planifimportacion.temp_importarproezademandadatosxls" . $params['idusuario'];
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_COLUMN);
        $datos = unserialize($result[0]);

        //eliminando tabla donde se guardan los datos del excel
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarproezademandadatosxls" . $idusuario);

        //preparando datos para crear tabla dinamica
        //en esta variable se guarda, de las columnas,
        //la posicion de su columna correspondiente en el excel
        $posiciones = array();
        foreach ($params['relaciones'] as $rel) {
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
            if ($rel->denominacionOS == "Ajuste") {
                $posiciones['ajuste'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "EMI") {
                $posiciones['empresa'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Programa") {
                $posiciones['programa'] = $rel->posicioncolumnaExcel;
                continue;
            }
            if ($rel->denominacionOS == "Destino") {
                $posiciones['destino'] = $rel->posicioncolumnaExcel;
                continue;
            }
        }
        //eliminando tabla temporal dinánica
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarproezademandadatos" . $params['idusuario']);

        //creando tabla temporal dinamica  
        $conn->execute("CREATE TABLE mod_planifimportacion.temp_importarproezademandadatos" . $params['idusuario'] . " (
          idtabla SERIAL,
          codigo VARCHAR(255) NOT NULL,
          idindicador NUMERIC(19,0),          
          denominacion VARCHAR,          
          cantidadinicial NUMERIC(19,3),
          ajuste NUMERIC(19,3),
          empresa VARCHAR,          
          identidadorganosatisface NUMERIC(19,0),  
          programa VARCHAR,          
          idprograma NUMERIC(19,0),  
          destino VARCHAR,          
          iddestino NUMERIC(19,0),  
          iddatosnomenclador NUMERIC(19,0))");

        foreach ($datos as $j => $row) {
            //ignorando los datos del encabezado de la tabla
            if ($j == 0) {
                continue;
            }
            //dando valor al codigo si viene vacio
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
            $cantidad = 0.0;
            if ($row[$posiciones['cantidad']]) {
                $n = self::validarNumericPositivo($row[$posiciones['cantidad']]);
                if ($n != 'no')
                    $cantidad = $n;
            }

            //dando valor al ajuste si viene vacio
            $ajuste = 0.0;
            if ($row[$posiciones['ajuste']]) {
                $n = self::validarNumeric($row[$posiciones['ajuste']]);
                if ($n != 'no')
                    $ajuste = $n;
            }

            //dando valor a empresa
            if ($row[$posiciones['empresa']]) {
                $empresa = utf8_encode($row[$posiciones['empresa']]);
            } else {
                $empresa = "-";
            }

            //dando valor a programa
            if ($row[$posiciones['programa']]) {
                $programa = utf8_encode($row[$posiciones['programa']]);
            } else {
                $programa = "-";
            }

            //dando valor a destino
            if ($row[$posiciones['destino']]) {
                $destino = utf8_encode($row[$posiciones['destino']]);
            } else {
                $destino = "-";
            }

            //insertando los datos en la tabla temporal
            $query = "INSERT INTO mod_planifimportacion.temp_importarproezademandadatos" . $params['idusuario'] . "
                              (
                                codigo,
                                denominacion,
                                cantidadinicial,
                                ajuste,
                                empresa,
                                programa,
                                destino
                              )
                              VALUES (
                                '$codigo',
                                '$denominacion',
                                $cantidad,
                                $ajuste,
                                '$empresa',
                                '$programa',
                                '$destino'
                              );";
            $conn->execute($query);
        }

        return self::validarDatosImportadosDemanda($params);
    }

    //Validar datos importados
    private function validarDatosImportadosDemanda($params) {
        //Buscando los datosnomenclador para los mensajes de validación 
        $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
        foreach ($array_ests_dnom as $k => $dn) {
            unset($array_ests_dnom[$k]);
            $array_ests_uri[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
        }
        unset($array_ests_dnom);

        //Buscando las entidades productoras
        $array_entidades_productoras = DemandaproduccionModel::listarEntidadesProductoras($params);
        foreach ($array_entidades_productoras as $key => $productor) {
            $array_entidades_productoras_denom[$productor['denominacion']] = $key;
        }

        $idformato = NomIndicador::obternerFormato();

        $conn = Doctrine_Manager::connection();
        $query = "WITH datos as (
                    SELECT DISTINCT t.idtabla,
                                    CASE
                                      WHEN ind.codigo IS NOT NULL THEN ind.codigo
                                      ELSE '0'
                                    END AS codigo,
                           CASE
                             WHEN ind.estado IS NOT NULL THEN ind.estado
                             ELSE 0
                           END AS estado,
                           CASE
                             WHEN indp.idaprobacion = 4 THEN 1
                             ELSE 0
                           END AS aprobado,
                           CASE
                             WHEN indp.nivelplanif IS NOT NULL THEN indp.nivelplanif
                             ELSE 0
                           END AS nivelplanif,
                           CASE
                             WHEN dnprograma.iddatosnomenclador IS NOT NULL THEN
                               dnprograma.iddatosnomenclador
                             ELSE 0
                           END AS idprograma,
                           CASE
                             WHEN dndestino.iddatosnomenclador IS NOT NULL THEN
                               dndestino.iddatosnomenclador
                             ELSE 0
                           END AS iddestino,
                           t.cantidadinicial,
                           t.ajuste,
                           ind.idindicador,
                           t.empresa,
                           tn.idtiponomenclador
                    FROM mod_planifimportacion.temp_importarproezademandadatos" . $params['idusuario'] . " t
                         LEFT JOIN mod_datosmaestros.nom_indicador ind ON ind.codigo = t.codigo
                         LEFT JOIN mod_datosmaestros.nom_indicadorplanif indp ON (ind.idindicador =
                           indp.idindicador)
                         LEFT JOIN mod_planificacion.nom_datosnomenclador dnprograma ON
                           dnprograma.denominacion = t.programa
                         LEFT JOIN mod_planificacion.nom_datosnomenclador dndestino ON
                           dndestino.denominacion = t.destino
                         LEFT JOIN mod_planificacion.nom_tiponomenclador tn ON
                           dndestino.idtiponomenclador = tn.idtiponomenclador AND
                           tn.uritiponomenclador = 'Destino'
                    )
                    SELECT idtabla,
                           codigo,
                           estado,
                           aprobado,
                           nivelplanif,
                           idprograma,
                           iddestino,
                           cantidadinicial,
                           ajuste,
                           idindicador,
                           empresa
                    FROM datos d
                    WHERE d.idtiponomenclador IS NOT NULL OR
                          d.iddestino = 0";
        $result = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($result as $key => $value) {
            //No existe un formato definido para los Indicadores
            if ($idformato == null) {
                self::actualizarValidacionDemanda($params['idusuario'], $value['idtabla'], $array_ests_uri['noexisteformatoindicadores']);
                continue;
            }
            //Código del indicador no existe
            if ($value['idindicador'] == null) {
                self::actualizarValidacionDemanda($params['idusuario'], $value['idtabla'], $array_ests_uri['codigoindvacio']);
                continue;
            }
            //El indicador no es nivel de planificacion
            if ($value['nivelplanif'] == 0) {
                $codigo = $value['codigo'];
                self::actualizarValidacionDemanda($params['idusuario'], $value['idtabla'], $array_ests_uri['indicadornonivelplanif']);
                continue;
            }
            //El indicador esta desaprobado
            if ($value['aprobado'] == 0) {
                self::actualizarValidacionDemanda($params['idusuario'], $value['idtabla'], $array_ests_uri['elindicadorestadesaprobado']);
                continue;
            }
            //El indicador esta desactivado
            if ($value['estado'] == 0) {
                self::actualizarValidacionDemanda($params['idusuario'], $value['idtabla'], $array_ests_uri['elindicadorestadesactivado']);
                continue;
            }
            //El programa no existe
            if ($value['idprograma'] == 0) {
                self::actualizarValidacionDemanda($params['idusuario'], $value['idtabla'], $array_ests_uri['programanoexiste']);
                continue;
            }
            //El destino no existe
            if ($value['iddestino'] == 0) {
                self::actualizarValidacionDemanda($params['idusuario'], $value['idtabla'], $array_ests_uri['destinonoexiste']);
                continue;
            }

            //La entidad no existe
            if (is_null($array_entidades_productoras_denom[$value['empresa']])) {
                self::actualizarValidacionDemanda($params['idusuario'], $value['idtabla'], $array_ests_uri['entidadnoexiste']);
                continue;
            }

            //La entidad no produce ese indicador
            $identidadorganosatisface = $array_entidades_productoras[$array_entidades_productoras_denom[$value['empresa']]]['identidadorganosatisface'];

            $entidades_productoras_del_indicador = DemandaproduccionModel::listarEntidadesProductorasIndicador($value);
            foreach ($entidades_productoras_del_indicador as $key => $productora_del_indicador) {
                if ($productora_del_indicador['identidadorganosatisface'] == $identidadorganosatisface) {
                    $value['identidadorganosatisface'] = $identidadorganosatisface;
                    break;
                }
            }

            if (is_null($value['identidadorganosatisface'])) {
                self::actualizarValidacionDemanda($params['idusuario'], $value['idtabla'], $array_ests_uri['entidadnoproduceindicador']);
                continue;
            }

            //Ya existe una demanda similar... idejercicio, identidadcliente, idindicador, indentidadorganosatisface
            $ObjDatDemanda = Doctrine::getTable('DatDemanda')->findByDql("idindicador = {$value['idindicador']} AND idejercicio = {$params['idejercicio']} AND identidadcliente = {$params['identidad']} AND identidadorganosatisface = {$value['identidadorganosatisface']}");
            if ($ObjDatDemanda[0]->iddemanda != null) {
                self::actualizarValidacionDemanda($params['idusuario'], $value['idtabla'], $array_ests_uri['yaexistedemanda']);
                continue;
            }

            //El indicador tiene cantidad igual a 0
            if ($value['cantidadinicial'] <= 0 || ($value['cantidadinicial'] + $value['ajuste']) < 0) {
                self::actualizarValidacionDemanda($params['idusuario'], $value['idtabla'], $array_ests_uri['elindicadortienecantidadiguala0']);
                continue;
            }

            //Validado correctamente
            $conn2 = Doctrine_Manager::connection();
            $query = "UPDATE 
                        mod_planifimportacion.temp_importarproezademandadatos" . $params['idusuario'] . " 
                      SET 
                        idindicador = {$value['idindicador']},
                        identidadorganosatisface = {$value['identidadorganosatisface']},
                        idprograma = {$value['idprograma']},
                        iddestino = {$value['iddestino']},
                        iddatosnomenclador = {$array_ests_uri['ok']}
                      WHERE 
                        idtabla = {$value['idtabla']};";
            $conn2->execute($query);
        }
        return 1;
    }

    //Actualizar los datos validados
    private function actualizarValidacionDemanda($idusuario, $idtabla, $iddatosnomenclador, $campo = "", $valor = "") {
        $addSet = "";
        if ($campo != "") {
            $addSet = ", $campo = $valor";
        }
        $conn2 = Doctrine_Manager::connection();
        $query = "UPDATE 
                    mod_planifimportacion.temp_importarproezademandadatos" . $idusuario . " 
                  SET 
                    iddatosnomenclador = $iddatosnomenclador $addSet
                  WHERE 
                    idtabla = $idtabla;";
        $conn2->execute($query);
    }

    //listar datos validados a importar
    function listarDatosValidadosDemanda($params) {
        $addWhere = "where true";
        if ($params['filtros']) {
            foreach ($params['filtros'] as $datos) {
                if ($datos['field'] == 'codigo') {
                    $addWhere .= " and e.codigo like '" . $datos['data']['value'] . "%'";
                } else
                if ($datos['field'] == 'denominacion') {
                    $addWhere .= " and upper(ind." . $datos['field'] . ") LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else
                if ($datos['field'] == 'denominaciondato') {
                    $addWhere .= " and upper(dn.denominacion) LIKE '%" . mb_convert_case($datos['data']['value'], MB_CASE_UPPER, 'UTF-8') . "%'";
                } else {
                    $cond = "=";
                    if ($datos['data']['comparison'] == "gt") {
                        $cond = ">";
                    } elseif ($datos['data']['comparison'] == "lt") {
                        $cond = "<";
                    }
                    $addWhere .= " and " . $datos['field'] . "" . $cond . $datos['data']['value'];
                }
            }
        }

        $conn = Doctrine_Manager::connection();
        $query = "SELECT e.idtabla,
                        e.codigo,
                        CASE
                          WHEN e.idindicador IS NULL THEN e.denominacion
                          ELSE ind.denominacion
                        END as denominacion,
                        e.cantidadinicial,
                        e.ajuste,
                        e.empresa,
                        e.programa,
                        e.destino,
                        e.iddatosnomenclador,
                        dn.denominacion as denominaciondato,
                        count(*) OVER() as total
                FROM mod_planifimportacion.temp_importarproezademandadatos" . $params['idusuario'] . " e
                     INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (dn.iddatosnomenclador = e.iddatosnomenclador)
                     LEFT JOIN mod_datosmaestros.nom_indicador ind ON (e.idindicador = ind.idindicador)
                      $addWhere ORDER BY e.iddatosnomenclador, e.idtabla
                OFFSET {$params['start']} LIMIT {$params['limit']}";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $data;
    }

    //inserta todos los datos validados correctamente
    function insertarDatosImportarDemanda($params) {
        $conn = Doctrine_Manager::connection();
        $query = "SELECT e.idtabla,
                        e.idindicador,
                        e.cantidadinicial,
                        e.ajuste,
                        e.identidadorganosatisface,
                        e.idprograma,
                        e.iddestino
                FROM mod_planifimportacion.temp_importarproezademandadatos" . $params['idusuario'] . " e
                    WHERE e.iddatosnomenclador = 312 ORDER BY e.idtabla";
        $data = $conn->execute($query)->fetchAll(PDO::FETCH_ASSOC);

        foreach ($data as $nuevo_dato) {
            $demanda = new DatDemanda();
            $demanda->idindicador = $nuevo_dato['idindicador'];
            $demanda->identidadcliente = $params['identidad'];
            $demanda->identidadorganosatisface = $nuevo_dato['identidadorganosatisface'];
            $demanda->idprograma = $nuevo_dato['idprograma'];
            $demanda->iddestino = $nuevo_dato['iddestino'];
            $demanda->idejercicio = $params['idejercicio'];
            $demanda->idusuario = $params['idusuario'];
            $demanda->idaprobacion = 1;
            $demanda->cantidadinicial = $nuevo_dato['cantidadinicial'];
            $demanda->ajuste = $nuevo_dato['ajuste'];
            $demanda->cantidadconfirmada = $nuevo_dato['cantidadinicial'] + $nuevo_dato['ajuste'];
            $demanda->idaprobacionplan = 1;
            $demanda->fecha = NULL;
            $demanda->save();
        }

        //eliminando tabla donde se guardan los datos del excel
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarproezademandadatosxls" . $idusuario);

        //eliminando tabla temporal dinánica
        $conn->execute("DROP TABLE IF EXISTS mod_planifimportacion.temp_importarproezademandadatos" . $idusuario);

        return 1;
    }

    public static function modificarCaracteresEspeciales($url) {
        $url = strtolower($url);
        //Reemplazamos caracteres especiales latinos 
        $find = array('á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'î', 'ô', 'û', 'ü', 'ã', 'õ', 'ç', 'ñ');
        $repl = array('a', 'e', 'i', 'o', 'u', 'a', 'e', 'i', 'o', 'u', 'u', 'a', 'o', 'c', 'n');
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

    private function validarNumeric($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor)) {
            return $valor;
        }
        return 'no';
    }

}
