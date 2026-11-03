<?php

class DatImportarModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listar($params) {
        if (!$params ['idconcepto']) {
            return array();
        }
        $conc = Doctrine::getTable('NomConceptoimportar')->find($params ['idconcepto']);

        $campo = null;
        if ($conc) {
            $campo = $conc->getCriterioOrdenenar();
            $params ['tabla'] = $conc->DatConfiguracionimportar->tablatemporal;
        } else {
            return array();
        }
        $query = new Doctrine_Query ();
        if ($params['filtros']) {
            $where = self::SqlFiltros($params ['tabla'], $params['filtros']);
            $query->addwhere($where);
        }

        $params['idespecialidad'] = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
        $query->addWhere('idespecialidad = ?', $params['idespecialidad']);

        if ($params['start']) {
            $query->offset($params['start']);
        }
        if ($params['limit']) {
            $query->limit($params ['limit']);
        }

        $query->from($params ['tabla'])->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        if ($campo) {
            $query->orderby($campo);
        }
        $res ['data'] = $query->execute();
        $res ['total'] = $query->count();

        return $res;
    }

    public function SqlFiltros($table, $filtros, $alias = "") {
        $where = '';
        $operation = '';
        $compar = "";
        if (is_array($filtros)) {
            foreach ($filtros as $key => $filtro) {
                $length = strlen($filtro['data']['value']);
                $caracter_scapado = "%";
                if (substr($filtro['data']['value'], $length - 1, $length) == '.') {
                    $filtro['data']['value'] = substr($filtro['data']['value'], 0, $length - 1);
                    $caracter_scapado = "";
                }
                switch ($filtro['data']['comparison']) {
                    case 'lt':
                        $operation = ' < ';
                        break;
                    case 'gt':
                        $operation = ' > ';
                        break;
                    case 'eq':
                    default:
                        $operation = ' = ';
                        break;
                }

//temporal cambiar la referencia a los datros nomenclador que esta por id 312 y 352 por la uri
                switch ($filtro['data']['type']) {
                    case 'string':
                        if ($filtro['field'] == 'iddatosnomenclador') {
                            if ($filtro['data']['value'] == '-1') {
                                $compar = ' ' . $alias . $filtro['field'] . " is null ";
                            } elseif ($filtro['data']['value'] == '-2') {
                                $compar = '' . $alias . $filtro['field'] . ' <> 352 and ' . $alias . $filtro['field']
                                        . ' <> 312 ';
                            } else {
                                $compar = ' ' . $alias . $filtro['field'] . " = " . $filtro['data']['value'] . " ";
                            }
                        } else {
                            $compar = 'lower(' . $alias . $filtro['field'] . ") LIKE '" . strtolower($filtro['data']['value'])
                                    . "{$caracter_scapado}' ";
                        }
                        break;
                    default:
                        $compar = $alias . $filtro['field'] . $operation . ' ' . $filtro['data']['value'] . ' ';
                        break;
                }
                if (strlen($where) == 0) {
                    $where .= $compar;
                } else {
                    $where .= 'AND ' . $compar;
                }
            }
        }
        return $where;
    }

    public function obtenerTablaTemporalDadoIdConcepto($idconcepto) {
        $conc = Doctrine::getTable('NomConceptoimportar')->find($idconcepto);
        $tabla = '';
        if ($conc) {
            $tabla = $conc->DatConfiguracionimportar->tablatemporal;
        }
        return $tabla;
    }

    public function listarDadoTempTable($table) {
        $query = new Doctrine_Query ();
        $queryTotal = new Doctrine_Query ();
        $res ['data'] = $query->from($table)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function listarConceptos() {
        return NomConceptoimportar::listar();
    }

    public function getConfigGrid($idconcepto) {
        $config = NomConceptoimportar::getConfigGrid($idconcepto);
        if (isset($config [0]) && count($config [0] ['DatColumnaconcepto']) > 0) {
            $res = array('cm' => array(), 'rd' => array());
            $res ['codMsg'] = 7; //Tiene configuracion
//Poniendo el identificador de la tabla de primero
            $res ['rd'] [] = array('name' => Doctrine::getTable($config [0] ['tablatemporal'])->getIdentifier());
            foreach ($config [0] ['DatColumnaconcepto'] as $k => $c) {
                $aux = substr($c ['etiqueta'], 0, 2);
                $width = strlen($c ['etiqueta']) * 15;
                if (strtolower($aux) != 'id') {
                    $type = Doctrine::getTable($config [0] ['tablatemporal'])->getColumnDefinition($c ['nombrecampo']);
                    $res ['cm'] [] = array('header' => $c ['etiqueta'], 'width' => $width,
                        'dataIndex' => $c ['nombrecampo'], 'datatype' => $type['type']);
                    $res ['rd'] [] = array('name' => $c ['nombrecampo']);
                } else {
                    $res ['cm'] [] = array($c ['etiqueta'], 'width' => '180', 'hidden' => true,
                        'dataIndex' => $c ['nombrecampo']);
                    $res ['rd'] [] = array('name' => $c ['nombrecampo']);
                }
            }
        } else {
            $res ['codMsg'] = 8; //Error en la configuracion
        }
        return $res;
    }

    function eliminarDatosTempTable($ids, $table, $idconcepto) {
        if ($ids[0] != null) {
            $idesplogueada = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
            $query = Doctrine_Query::create();
            $query->addWhere('idespecialidad = ?', $idesplogueada);
            $query->delete()->from($table . ' temp')->whereIn(
                    'temp.' . Doctrine::getTable($table)->getIdentifier(), $ids
            )->execute();
        }
        return true;
    }

    public function exportarTempTable($cols = array(), $tempdata = array()) {
        $integrator = ZendExt_IoC::getInstance();
        $vias = NomViaadquisicion::Obtener_via_adquisicion();
        $global = ZendExt_GlobalConcept::getInstance();
        $identidad = $global->Estructura->idestructura;
        $estructuras = $integrator->metadatos->DameHijosEstructura($identidad);
        $centrobalance = $integrator->metadatos->DameEstructura($identidad);
        $naturalezas = NomDatosnomenclador::ObtenerDatosNomenclador(2);
        $ums = $integrator->datosmaestros->listarUnidadesMedidaTodas();
        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=indicadores.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";
        echo "<caption>CONCEPTOS</caption>\n";
        echo "<tr>\n";
        foreach ($cols as $value) {
            echo "<th>" . utf8_decode($value ['etiqueta']) . "</th>\n";
        }
        echo "</tr>\n";
        foreach ($tempdata['data'] as $k => $value) {
            echo "<tr>\n";
            foreach ($cols as $valuec) {
                echo "<td>" . utf8_decode($value[$valuec['nombrecampo']]) . "</td>\n";
            }
            echo "</tr>\n";
        }
        echo "</table>\n";
        echo '</BODY></HTML>';
    }

    public function importarFichero($params) {

        $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
        foreach ($array_ests_dnom as $k => $dn) {
            unset($array_ests_dnom[$k]);
            $array_ests_dnom[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
        }

        $idesplogueada = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
        $tablaTemp;


        $ruta = '/ReaderModel.php';
        include_once(dirname(__FILE__) . $ruta);
        $data = new ReaderModel();
        $data->setOutputEncoding('CP1251');
        $data->read($params['file']);
        $indicadores = $data->sheets[0]['cells'];
        $indicador = self::obtenerColumnasDadoIdConcepto($params ['idconcepto']);


        $this->tablaTemp = is_array($indicador) ? $indicador[0]['DatConfiguracionimportar']['tablatemporal'] : null;


        switch ($params['idconcepto']) {
            case 1: //IMPORTAR PRECIO PARA INDICADORES
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                $length = count($indicadores);
                for ($i = 2; $i <= $length; $i++, $cont++) {
                    $row = $indicadores[$i];
                    $model[$cont]->codigo = utf8_encode($row[1]);
                    $model[$cont]->denominacion = utf8_encode($row[2]);
                    $precio = self::validarNumeric($row[3]);
                    $preciodivisa = self::validarNumeric($row[4]);
                    if ($precio != 'no' && $preciodivisa != 'no') {
                        $model[$cont]->precio = $precio;
                        $model[$cont]->preciodivisa = $preciodivisa;
                    } else {
                        $model[$cont]->precio = '0.0';
                        $model[$cont]->preciodivisa = '0.0';
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorennumerico'];
                    }
                    $model[$cont]->idespecialidad = $idesplogueada;
                }
                unset($model[$cont]);
                $model->save();

                return array('cod' => 1);
                break;
            case 2: // IMPORTAR INDICADORES
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                $length = count($indicadores);
                for ($i = 2; $i <= $length; $i++, $cont++) {
                    $row = $indicadores[$i];
                    $model[$cont]->codigo = utf8_encode($row[1]);
                    $model[$cont]->numeropieza = utf8_encode($row[2]);
                    $model[$cont]->denominacion = utf8_encode($row[3]);
                    switch (strlen($row[1])) { //columna 4
                        case '3':
                            $model[$cont]->nivelarbol = 'Generico';
                            $model[$cont]->idnivelarbol = 1;
                            break;
                        case '4':
                            $model[$cont]->nivelarbol = 'Subgenerico';
                            $model[$cont]->idnivelarbol = 2;
                            break;
                        case '6':
                            $model[$cont]->nivelarbol = 'Especifico';
                            $model[$cont]->idnivelarbol = 3;
                            break;
                        case '10':
                            $model[$cont]->nivelarbol = 'Surtido';
                            $model[$cont]->idnivelarbol = 4;
                            break;
                        default:
                            $model[$cont]->nivelarbol = 'No definido';
                            $model[$cont]->idnivelarbol = 1;
                            break;
                    }

                    $model[$cont]->naturaleza = utf8_encode($row[5]);
                    $model[$cont]->centrobalance = utf8_encode($row[6]);

                    $model[$cont]->idumedida = utf8_encode($row[7]);
                    $model[$cont]->idaprobacion = utf8_encode($row[8]); //columna 8
                    $model[$cont]->nivel = utf8_encode($row[9]);
                    ;
                    $model[$cont]->estado = utf8_encode($row[10]); //columna 10
                    $model[$cont]->viaadquisicion = utf8_encode($row[11]);
                    $model[$cont]->organosatisface = utf8_encode($row[12]);


                    $precio = self::validarNumeric($row[13]);
                    $flete = self::validarNumeric($row[14]);
                    $contingencia = self::validarNumeric($row[15]);
                    $preciodivisa = self::validarNumeric($row[16]);

                    if ($precio != 'no' && $flete != 'no' && $contingencia != 'no' && $preciodivisa != 'no') {
                        $model[$cont]->precio = $precio;
                        $model[$cont]->flete = $flete;
                        $model[$cont]->contingencia = $contingencia;
                        $model[$cont]->preciodivisa = $preciodivisa;
                    } else {
                        $model[$cont]->precio = '0.0';
                        $model[$cont]->flete = 0;
                        $model[$cont]->contingencia = 0;
                        $model[$cont]->preciodivisa = '0.0';
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorennumerico'];
                    }
                    $model[$cont]->pais = ($row[17]) ? utf8_encode($row[17]) : 'CUB';
                    $model[$cont]->idespecialidad = $idesplogueada;
                }
                unset($model[$cont]);
                try {
                    $model->save();
                } catch (Doctrine_Exception $e) {
                    echo "<pre>";
                    /* print_r($e->getMessage());
                      die; */
                }
                return array('cod' => 1);
                break;
            case 3: //IMPORTAR ACTIVIDADES
                self::importActividades($idesplogueada, $params, $indicadores, $indicador, $this->tablaTemp);
                break;
            case 4: //IMPORTAR NORMAS PARA INDICADORES
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                $length = count($indicadores);
                for ($i = 2; $i <= $length; $i++, $cont++) {
                    $row = $indicadores[$i];
                    $model[$cont]->codigoact = $row[1];
                    $model[$cont]->codigoind = $row[2];
                    $cantplanif = self::validarNumeric($row[3]);
                    $cantbase = self::validarNumeric($row[4]);
                    if ($cantplanif != 'no' && $cantbase != 'no') {
                        $model[$cont]->cantplanif = $cantplanif;
                        $model[$cont]->cantbase = $cantbase;
                    } else {
                        $model[$cont]->cantplanif = 1;
                        $model[$cont]->cantbase = 1;
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorennumerico'];
                    }
                    $model[$cont]->idespecialidad = $idesplogueada;
                }
                unset($model[$cont]);
                $model->save();

                return array('cod' => 1);
                break;

            case 5: //IMPORTAR CONCEPTOS DE FORMA GENERICA PARA COLUMNAS DE TIPO CADENA DE CARACTERES
                return self::importar_generico_str(
                                $idesplogueada, $indicadores, $params['idconcepto'], $this->tablaTemp
                );
                break;
            case 6: //IMPORTAR FLETE Y CONTINGENCIA PARA INDICADORES

                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                $length = count($indicadores);
                for ($i = 2; $i <= $length; $i++, $cont++) {
                    $row = $indicadores[$i];
                    $model[$cont]->codigo = utf8_encode($row[1]);
                    $model[$cont]->denominacion = utf8_encode($row[2]);
                    $flete = self::validarNumeric($row[3]);
                    $conting = self::validarNumeric($row[4]);
                    if ($flete != 'no' && $conting != 'no') {
                        $model[$cont]->flete = $flete;
                        $model[$cont]->contingencia = $conting;
                    } else {
                        $model[$cont]->flete = '0.0';
                        $model[$cont]->contingencia = '0.0';
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorennumerico'];
                    }
                    $model[$cont]->idespecialidad = $idesplogueada;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
            case 7:
                $temporal = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                $cod = 1;
                $length = count($indicadores);
                /* print_r($indicadores);
                  die; */
                for ($i = 2; $i <= $length; $i++, $cont++) {
                    $fila = $indicadores[$i];
                }
                return array('cod' => $cod);
                break;
            case 8:  //IMPORTAR NIVELES DE ACTIVIDAD DE BGGESTNIVELESDEACTIVIDAD

                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));

                $cont = 0;
                $length = count($indicadores);
                for ($i = 2; $i <= $length; $i++, $cont++) {
                    $row = $indicadores[$i];
                    $model[$cont]->denomentidad = utf8_encode($row[1]);
                    $model[$cont]->codigoact = utf8_encode($row[2]);

                    $nivel = self::validarNumeric($row[4]);

                    if ($nivel != 'no') {
                        $model[$cont]->nivelact = $nivel;
                    } else {
                        $model[$cont]->nivelact = '0';
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorennumerico'];
                    }
                }

                unset($model[$cont]);
                $model->save();

                return array('cod' => 1);
                break;

            case 9:  //IMPORTAR PLAN

                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));

                $cont = 0;
                $length = count($indicadores);

                for ($i = 2; $i <= $length; $i++, $cont++) {
                    $row = $indicadores[$i];

                    $model[$cont]->denomentidad = utf8_encode($row[1]);

                    $model[$cont]->denommodelo = utf8_encode($row[2]);
                    $model[$cont]->codigoindicador = utf8_encode($row[3]);

                    $cantidad = self::validarNumeric($row[6]);
                    if ($cantidad != 'no') {
                        $model[$cont]->cantindicadores = $cantidad;
                    } else {
                        $model[$cont]->cantindicadores = '0';
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorennumerico'];
                    }
                }

                unset($model[$cont]);


                $model->save();

                return array('cod' => 1);
                break;

            /* case 10:
              $result =  self::importarInversionesExcel($params);
              return array('cod' => $result);
              default:
              break; */
            case 10://importar inversiones general
                $cont = 0;
                $length = count($indicadores);
                if ($params['tipoexcel'] == 3) {//print_r(1);die;
                    $contarr = 0;
                    for ($i = 2; $i <= $length; $i++, $cont++) {
                        $parametrosinv = array();
                        $row = $indicadores[$i];
                        $parametrosinv['inversion'] = utf8_encode($row[1]);
                        $parametrosinv['tipo'] = utf8_encode($row[2]);
                        $parametrosinv['entidad'] = utf8_encode($row[3]);
                        $parametrosinv['provincia'] = utf8_encode($row[4]);
                        $parametrosinv['programa'] = utf8_encode($row[5]);
                        $parametrosinv['fechai'] = $row[6];
                        $parametrosinv['fechaf'] = $row[7];
                        $parametrosinv['observacion'] = utf8_encode($row[8]);
                        $parametrosinv['objetivo'] = utf8_encode($row[9]);
                        $parametrosinv['efecto'] = utf8_encode($row[10]);
                        $parametrosinv['caracteristica'] = utf8_encode($row[11]);
                        $parametrosinv['formapropiedad'] = utf8_encode($row[12]);
                        $parametrosinv['desempenno'] = utf8_encode($row[13]);
                        $parametrosinv['analisis'] = $row[14];
                        $parametrosinv['clasificacion'] = utf8_encode($row[15]);
                        $parametrosinv['fast'] = utf8_encode($row[16]);
                        if (self::comprobarEInsertardatos($parametrosinv)) {
                            $contarr++;
                        }
                    }
                    if ($contarr == 0)
                        return array('tipo' => 1, 'mensaje' => 'No se importÃ³ ningun dato.');
                    else
                    if ($contarr == $length - 1)
                        return array('tipo' => 2, 'mensaje' => 'Se importaron satisfactoriamente todos los datos.');
                    else
                        return array('tipo' => 3, 'mensaje' => 'Algunos datos no pudieron ser importados.');
                } else if ($params['tipoexcel'] == 2) {//print_r(2);die;
                    $contarr = 0;
                    for ($i = 2; $i <= $length; $i++, $cont++) {
                        $parametrosinv = array();
                        $row = $indicadores[$i];
                        $parametrosinv['denentidad'] = utf8_encode($row[1]);
                        $parametrosinv['deninversion'] = utf8_encode($row[2]);
                        $parametrosinv['denequipo'] = utf8_encode($row[3]);
                        $parametrosinv['cantreposicion'] = utf8_encode($row[4]);
                        $parametrosinv['cantincremento'] = utf8_encode($row[5]);
                        $parametrosinv['adquirir'] = utf8_encode($row[6]);
                        $parametrosinv['comprar'] = utf8_encode($row[7]);
                        if (self::comprobarEInsertardatosEquipo($parametrosinv)) {
                            $contarr++;
                        }
                    }
                    if ($contarr == 0)
                        return array('tipo' => 1, 'mensaje' => 'No se importÃ³ ningun dato.');
                    else
                    if ($contarr == $length - 1)
                        return array('tipo' => 2, 'mensaje' => 'Se importaron satisfactoriamente todos los datos.');
                    else
                        return array('tipo' => 3, 'mensaje' => 'Algunos datos no pudieron ser importados.');
                } else if ($params['tipoexcel'] == 1) {//constr
                    $contarr = 0; //print_r(3);die;
                    for ($i = 2; $i <= $length; $i++, $cont++) {
                        $parametrosinv = array();
                        $row = $indicadores[$i];
                        $parametrosinv['denentidad'] = utf8_encode($row[1]);
                        $parametrosinv['deninversion'] = utf8_encode($row[2]);
                        $parametrosinv['constructor'] = utf8_encode($row[3]);
                        $parametrosinv['provincia'] = utf8_encode($row[4]); //print_r($parametrosinv);die;
                        if (self::comprobarEInsertardatosConstructor($parametrosinv)) {
                            $contarr++;
                        }
                    }
                    if ($contarr == 0)
                        return array('tipo' => 1, 'mensaje' => 'No se importÃ³ ningun dato.');
                    else
                    if ($contarr == $length - 1)
                        return array('tipo' => 2, 'mensaje' => 'Se importaron satisfactoriamente todos los datos.');
                    else
                        return array('tipo' => 3, 'mensaje' => 'Algunos datos no pudieron ser importados.');
                } else if ($params['tipoexcel'] == 4) {//print_r(4);die;
                    $contarr = 0; //print_r($indicadores);die;
                    for ($i = 2; $i <= $length; $i++, $cont++) {
                        $parametrosinv = array();
                        $row = $indicadores[$i];
                        $parametrosinv['denentidad'] = utf8_encode($row[1]);
                        $parametrosinv['deninversion'] = utf8_encode($row[2]);
                        $parametrosinv['tipodato'] = utf8_encode($row[3]);
                        $parametrosinv['constructor'] = utf8_encode($row[4]);
                        $parametrosinv['provincia'] = utf8_encode($row[5]);
                        $parametrosinv['acreedor'] = utf8_encode($row[6]);
                        $parametrosinv['cup'] = utf8_encode($row[7]);
                        $parametrosinv['usd'] = utf8_encode($row[8]);
                        $parametrosinv['plazo'] = utf8_encode($row[9]);
                        $parametrosinv['interes'] = utf8_encode($row[10]); //print_r($parametrosinv);die;
                        if (self::comprobarEInsertartipodatos($parametrosinv)) {
                            $contarr++;
                        }
                    }
                    if ($contarr == 0)
                        return array('tipo' => 1, 'mensaje' => 'No se importÃ³ ningun dato.');
                    else
                    if ($contarr == $length - 1)
                        return array('tipo' => 2, 'mensaje' => 'Se importaron satisfactoriamente todos los datos.');
                    else
                        return array('tipo' => 3, 'mensaje' => 'Algunos datos no pudieron ser importados.');
                }
                break;
        }
        return array('cod' => 1);
    }

    private function importarInversionesExcel($params) {
        $ruta = '/ReaderModel.php';
        include_once(dirname(__FILE__) . $ruta);
        $data = new ReaderModel();

        $data->read($params['file']);

        if (isset($data->sheets[0])) {
            $celdas = $data->sheets[0]['cells'];
            if (!self::validacionesDeCeldas($celdas)) {
                return 4;
            }
            $params['celdas'] = $celdas;

            switch ($params['tipoexcel']) {
                case 1:
                    return self::excelBasico($params);
                    break;
                case 2:
                    return self::excelDemandaEquipos($params);
                    break;
                case 3:
                    return self::excelInversiones($params);
                    break;
                default:
                    break;
            }
        } else {
            return 3;
        }
    }

    private function excelBasico($params) {
        foreach ($params['celdas'] as $pos => $value) {
            if ($pos > 1) {
                foreach ($value as $key => $dato) {
                    if ($key == 1 || $key == 2 || $key >= 7) {
                        if (!preg_match("/^[0-9]+$/", $value[$key])) {
                            return 5;
                        }
                    }
                }
            }
        }
        $params['nombre'] = 'basico.xls';
        self::crearFicheros($params);
        return 1;
    }

    private function excelDemandaEquipos($params) {
        foreach ($params['celdas'] as $pos => $value) {
            if ($pos > 1) {
                if (!preg_match("/^[0-9]+$/", $value[8]) ||
                        !preg_match("/^[0-9]+$/", $value[3]) ||
                        !preg_match("/^[0-9]+$/", $value[1]) ||
                        !preg_match("/^[0-9]+$/", $value[5]) || !preg_match("/^[0-9]+$/", $value[6]) || !preg_match("/^[0-9]+$/", $value[7])
                ) {
                    return 5;
                }
            }
        }
        $params['nombre'] = 'demanda_equipos.xls';
        self::crearFicheros($params);
        return 1;
    }

    private function excelInversiones($params) {

        foreach ($params['celdas'] as $pos => $value) {
            if ($pos > 1) {
                if (!preg_match("/^[0-9]+$/", $value[8]) || !preg_match("/^[0-9]+$/", $value[9]) || !preg_match("/^[0-9]+$/", $value[1])) {
                    return 5;
                }
            }
        }
        $params['nombre'] = 'inversiones.xls';
        self::crearFicheros($params);
        return 1;
    }

    private function crearFicheros($params) {
        if (!file_exists($_SERVER['DOCUMENT_ROOT'] . '/excelimport')) {
            $old = umask(0);
            mkdir($_SERVER['DOCUMENT_ROOT'] . '/excelimport');
            umask($old);
        }

        exec('cp -p ' . trim($params['file']) . ' ' . $_SERVER['DOCUMENT_ROOT'] . '/excelimport/' . $params['nombre']);
        exec('chmod -R 777 ' . $_SERVER['DOCUMENT_ROOT'] . '/excelimport');

        $fichero = $params['nombre'];

        switch ($params['nombre']) {
            case 'basico.xls':
                $fichero = 'basico';
                break;
            case 'demanda_equipos.xls':
                $fichero = 'demandaEquipos';
                break;
            case 'inversiones.xls':
                $fichero = 'inversiones';
                break;
        }
        $respuesta = $this->EjecutarAccion($fichero);


//shell_exec(/*Aqui va la direccion del sh*/);
    }

    public function EjecutarAccion($fichero) {
//identificar el sistema operativo para saber el tipo
//de extension de archivo a ejecutar
        $cadenaserverconfig = $_SERVER['SERVER_SOFTWARE'];

//descubriendo la direccion de los fiecheros ejecutables
        $register = Zend_Registry::getInstance();
        $dirarchivoejecutable = $register->config->dir_aplication . "/sami/data-integration/";


        $extension = '.sh';
        $dirarchivoejecutable = $dirarchivoejecutable . $fichero . $extension;
        if (file_exists($dirarchivoejecutable)) {
            shell_exec($dirarchivoejecutable);
            $respuesta = 1;
        } else {
            $respuesta = 3;
        }

        return $respuesta;
    }

    private function validacionesDeCeldas($celdas) {
        $result = true;
        if (!isset($celdas[1]) || !isset($celdas[1][1])) {
            $result = false;
        }
        return $result;
    }

    private function validarNumeric($valor) {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        $valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        if (is_numeric($valor)) {
            return $valor;
        }
        return 'no';
    }

    private function importar_generico_str($idesplogueada, $array_elements, $idconcepto, $tablaTemp) {
        $array_generic = new Doctrine_Collection(Doctrine:: getTable($tablaTemp));
        $length = count($array_elements);
        $array_colsconcept = self::obtenerColumnasDadoIdConcepto($idconcepto);

        foreach ($array_colsconcept as $indice => $valor) {
            unset($array_colsconcept[$indice]);
            if ($valor['nombrecampo'] != 'iddatosnomenclador') {
                $array_colsconcept[$indice]['nombrecampo'] = $valor['nombrecampo'];
                $array_colsconcept[$indice]['pos_col_excel'] = ($valor['orden'] + 1);
            }
        }
        $cont = 0;
        for ($i = 2; $i <= $length; $i++, $cont++) {
            $row = $array_elements[$i];
            foreach ($array_colsconcept as $ind => $valor) {
                $nombrecampo = $valor['nombrecampo'];
                $array_generic[$cont]->$nombrecampo = utf8_encode($row[$valor['pos_col_excel']]);
            }
            $array_generic[$cont]->idespecialidad = $idesplogueada;
            $cont++;
        }
        unset($array_generic[$cont]);
        $array_generic->save();
        return array('cod' => 1);
    }

    public function actualizarTablaIndicadores(
    $idconcepto, $idaccion, $rectora, $array_ests_dnom, $array_filtros, $tablatemporal, $cols_checked
    ) {
        $cont = 0;
        $integrator = ZendExt_IoC::getInstance();
        $idesplogueada = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
        switch ($idconcepto) {
//ACTUALIZAR PRECIOS PARA INDICADORES
            case '1':
                $cant = TempIndicadorprecio::getConcepto(
                                $idesplogueada, array($array_ests_dnom['actualizadook'], $array_ests_dnom['errorennumerico']), 0, 0, true
                );

                if ($cant == 0) {
                    return 'vacio';
                }
                $cantxpag = 10000;
                $cant_paginas = self::getCantPaginas($cant, $cantxpag);
                $offset = 0;
                $paso = $cantxpag;

                unset($cantxpag);
                $cant_process = 0;
                for ($i = 0; $i < $cant_paginas; $i++) {
                    $array_res = TempIndicadorprecio::getConcepto(
                                    $idesplogueada, array($array_ests_dnom['actualizadook'], $array_ests_dnom['errorennumerico']), $offset, $paso
                    );

                    $arraycoll_indprecio_ind = $array_res['tempind'];
                    unset($array_res['tempind']);
                    $arraycoll_nomind = $array_res['nomind'];
                    unset($array_res['nomind']);
                    $array_paralelo_localizacion = $array_res['localizacion'];
                    unset($array_res['localizacion']);

                    foreach ($arraycoll_indprecio_ind as $indice => $row_ind) {
                        if (isset($array_paralelo_localizacion['cod' . $row_ind->codigo])) {
                            $ptr_indicador = $array_paralelo_localizacion['cod' . $row_ind->codigo];
                        } else {
                            $ptr_indicador[0] = 'no';
                        }

                        if (empty($row_ind->codigo)) {
                            $arraycoll_indprecio_ind[$indice]->iddatosnomenclador = $array_ests_dnom['codigovacio'];
                            continue;
                        } else {
                            if (empty($row_ind->precio)) {
                                $arraycoll_indprecio_ind[$indice]->iddatosnomenclador = $array_ests_dnom['precionovalido'];
                                continue;
                            } else {
                                if (empty($row_ind->preciodivisa)) {
                                    $arraycoll_indprecio_ind[$indice]->iddatosnomenclador = $array_ests_dnom['preciodivisanovalido'];
                                    continue;
                                } else {
                                    if (empty($row_ind->preciodivisa)) {
                                        $arraycoll_indprecio_ind[$indice]->iddatosnomenclador = $array_ests_dnom['preciodivisanovalido'];
                                        continue;
                                    } elseif ($ptr_indicador[0] != 'ok') {
                                        $arraycoll_indprecio_ind[$indice]->iddatosnomenclador = $array_ests_dnom['indicadornoexiste'];
                                        continue;
                                    }
                                }
                            }
                        }
                        $ptr_indicador = $ptr_indicador[1];
                        if ($cols_checked['precio']) {
                            $arraycoll_nomind[$ptr_indicador]->precio = $row_ind->precio;
                            $arraycoll_indprecio_ind[$indice]->iddatosnomenclador = $array_ests_dnom['actualizadook'];
                        }
                        if ($cols_checked['preciodivisa']) {
                            $arraycoll_nomind[$ptr_indicador]->preciodivisa = $row_ind->preciodivisa;
                            $arraycoll_indprecio_ind[$indice]->iddatosnomenclador = $array_ests_dnom['actualizadook'];
                        }
                        $cant_process++;
                    }

                    $arraycoll_indprecio_ind->save();
                    if (is_object($arraycoll_nomind)) {
                        $arraycoll_nomind->save();
                    }
                }
                if ($cant == $cant_process) {
                    return 1;
                }
                return 0;
                break;
            case '2': //ACTUALIZAR INDICADORES.

                $cantxpag = 10000;
//cargas iniciales
                $array_viasad = NomViaadquisicion::Obtener_via_adquisicion()->data;
                foreach ($array_viasad as $k => $valor) {
                    unset($array_viasad[$k]);
                    $array_viasad [$valor['denominacion']] = $valor['idviaadquisicion'];
                }
//                //Naturalezas
                $array_naturls = NomDatosnomenclador::ObtenerDatosNomenclador(2);
                foreach ($array_naturls as $k => $valor) {
                    unset($array_naturls[$k]);
                    $array_naturls[$valor['nom_datosnomenclador_denominacion']] = $valor ['iddatosnomenclador'];
                }
//                //formato
                $idformato = NomIndicador::obternerFormato();
//Centros de balances
                $idcentrobalance = 1; //temporal numero fijo en la BD para Nomdatosnomenclador
                $array_cbs = DatEntidaddatosnomenclador::getEntidadDadoComportamiento($idcentrobalance);
                foreach ($array_cbs as $k => $valor) {
                    unset($array_cbs[$k]);
                    $datosentidad = $integrator->metadatos->DameEstructura($valor ['identidad']);
                    $array_cbs[strtoupper($datosentidad [0]->denominacion)] = $valor ['identidaddatosnomenclador'];
                }
//Organos que satisface
                $organos = NomOrganosatisface::obtenerOS();
                $array_deno_os = array();
                foreach ($organos as $k => $valor) {
                    $array_deno_os[$valor['denominacion']] = $valor['idorganosatisface'];
                }
                unset($organos);
                $this->nomenclador = new ZendExt_Nomencladores_ADT ();
                $array_pais = $this->nomenclador->selectParam('nom_pais', array('idpais', 'siglas'));
                foreach ($array_pais as $k => $valor) {
                    unset($array_pais[$k]);
                    $array_pais[$valor['siglas']] = $valor['idpais'];
                }
// fin cargas iniciales
                $conn = Doctrine_Manager::connection();
                if ($idaccion == 1) {
                    return self::adicionarIndicador(
                                    $cantxpag, $conn, $idesplogueada, $idformato, $array_pais, $array_cbs, $array_viasad, $array_naturls, $array_deno_os, $array_ests_dnom, $integrator, $array_filtros, $tablatemporal
                    );
                } elseif ($idaccion == 2) { //actualizar
                } elseif ($idaccion == 4) { //validar
                    return self::adicionarIndicador(
                                    $cantxpag, $conn, $idesplogueada, $idformato, $array_pais, $array_cbs, $array_viasad, $array_naturls, $array_deno_os, $array_ests_dnom, $integrator, $array_filtros, $tablatemporal, null
                    );
                }
                break;
            case '4':
//ACTUALIZAR TABLA NORMAS
                $cantxpag = 10000;
                if ($idaccion == 1) { //add
                    return self::adicionarNormasConsumo($idesplogueada, $cantxpag, $array_ests_dnom);
                } elseif ($idaccion == 2) { //update
                } else { //validar 4
                    return self::adicionarNormasConsumo($idesplogueada, $cantxpag, $array_ests_dnom, false);
                }
                break;
            case '5':
//Adicionar - Actualizar(sobre escribir) tabla via y organos
                $cantxpag = 10000;
                $idesplogueada = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
                $conn = Doctrine_Manager::connection();
//cargas iniciales
                $array_viasad = NomViaadquisicion::Obtener_via_adquisicion()->data;
                foreach ($array_viasad as $k => $valor) {
                    unset($array_viasad[$k]);
                    $array_viasad [$valor['denominacion']] = $valor['idviaadquisicion'];
                }
//Organos que satisface
                $array_deno_os = NomOrganosatisface::obtenerOS();
                foreach ($array_deno_os as $k => $valor) {
                    unset($array_deno_os[$k]);
                    $array_deno_os[$valor['denominacion']] = $valor['idorganosatisface'];
                }
                if ($idaccion == 1) { //add
                    return self::adicionarVAOS(
                                    $idesplogueada, $cantxpag, $conn, $array_viasad, $array_deno_os, $array_ests_dnom, $array_filtros, $tablatemporal, true
                    );
                } elseif ($idaccion == 2) { //actualizar reemplazar
                    return self::reemplazarVAOS(
                                    $idesplogueada, $cantxpag, $conn, $array_viasad, $array_deno_os, $array_ests_dnom, $array_filtros, $tablatemporal, true
                    );
                } else { //validar 4
                    return self::adicionarVAOS(
                                    $idesplogueada, $cantxpag, $conn, $array_viasad, $array_deno_os, $array_ests_dnom, $array_filtros, $tablatemporal, false
                    );
                }
                break;
            case '6':
                $cantxpag = 10000;
                $idesplogueada = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
                if ($idaccion == 2) { //actualizar
                    return self::actualizarFleteContingencia(
                                    $idesplogueada, $cantxpag, $array_ests_dnom, $array_filtros, $cols_checked, true
                    );
                } else { //validar 4
                    return self::actualizarFleteContingencia(
                                    $idesplogueada, $cantxpag, $array_ests_dnom, $array_filtros, $cols_checked, false
                    );
                }
            default:
                break;
        }
    }

    private function actualizarFleteContingencia(
    $idesplogueada, $cantxpag, $array_ests_dnom, $array_filtros, $cols_checked, $actualizar = true
    ) {
        $cant = TempActfleteycontingencia::getConcepto(
                        $idesplogueada, array($array_ests_dnom['actualizadook'], $array_ests_dnom['errorennumerico']), 0, 0, true
        );
        if ($cant == 0) {
            return 'vacio';
        }
        $cant_paginas = self::getCantPaginas($cant, $cantxpag);
        $offset = 0;
        $paso = $cantxpag;
        unset($cantxpag);
        $cant_process = 0;
        for ($i = 0; $i < $cant_paginas; $i++) {
            $array_res = TempActfleteycontingencia::getConcepto(
                            $idesplogueada, array($array_ests_dnom['actualizadook'], $array_ests_dnom['errorennumerico']), $offset, $paso
            );
            $arraycoll_indflecont_ind = $array_res['tempind'];
            unset($array_res['tempind']);
            $arraycoll_nomind = $array_res['nomind'];
            unset($array_res['nomind']);
            $array_paralelo_localizacion = $array_res['localizacion'];
            unset($array_res['localizacion']);

            foreach ($arraycoll_indflecont_ind as $indice => $row_ind) {
                if (isset($array_paralelo_localizacion['cod' . $row_ind->codigo])) {
                    $ptr_indicador = $array_paralelo_localizacion['cod' . $row_ind->codigo];
                } else {
                    $ptr_indicador[0] = 'no';
                }
                if (empty($row_ind->codigo)) {
                    $arraycoll_indflecont_ind[$indice]->iddatosnomenclador = $array_ests_dnom['codigovacio'];
                    continue;
                } else {
                    if (empty($row_ind->flete)) {
                        $arraycoll_indflecont_ind[$indice]->iddatosnomenclador = $array_ests_dnom['fletenovalido'];
                        continue;
                    } else {
                        if (empty($row_ind->contingencia)) {
                            $arraycoll_indflecont_ind[$indice]->iddatosnomenclador = $array_ests_dnom['contingencianovalido'];
                            continue;
                        } elseif ($ptr_indicador[0] != 'ok') {
                            $arraycoll_indflecont_ind[$indice]->iddatosnomenclador = $array_ests_dnom['indicadornoexiste'];
                            continue;
                        }
                    }
                }
                $ptr_indicador = $ptr_indicador[1];
                if ($cols_checked['flete']) {
                    $arraycoll_nomind[$ptr_indicador]->flete = $row_ind->flete;
                    $arraycoll_indflecont_ind[$indice]->iddatosnomenclador = $array_ests_dnom['actualizadook'];
                }
                if ($cols_checked['contingencia']) {
                    $arraycoll_nomind[$ptr_indicador]->contingencia = $row_ind->contingencia;
                    $arraycoll_indflecont_ind[$indice]->iddatosnomenclador = $array_ests_dnom['actualizadook'];
                }
                if ($actualizar) {
                    $arraycoll_indflecont_ind[$indice]->iddatosnomenclador = $array_ests_dnom['ok'];
                }
                $cant_process++;
            }
            $arraycoll_indflecont_ind->save();
            if (is_object($arraycoll_nomind) && $actualizar) {
                $arraycoll_nomind->save();
            }
        }
        if ($cant == $cant_process) {
            return 1;
        }
        return 0;
    }

    private function reemplazarVAOS(
    $idesplogueada, $cantxpag, $conn, $array_viasad, $array_deno_os, $array_ests_dnom, $array_filtros, $tablatemporal, $adicionar = true
    ) {
        $vacio = 'vacio';
        $cant = TempInsindicadorviayos::getConceptoSql(
                        $idesplogueada, $array_ests_dnom['oklisto'], $array_ests_dnom['ok'], 0, 0, $array_filtros, $tablatemporal, true
        ); //cant x nivel
        if ($cant > 0) {
            $vacio = 'no';
        }

        $cant_paginas = self::getCantPaginas($cant, $cantxpag);
        $paso = $cantxpag;
        $offset = 0;

        $cont_procesados = 0;
        $cod_anterior = null;
        for ($i = 0; $i < $cant_paginas; $i++) {
            $array_coll_tempinsvos = TempInsindicadorviayos::getConceptoSql(
                            $idesplogueada, $array_ests_dnom['oklisto'], $array_ests_dnom['ok'], $offset, $paso, $array_filtros, $tablatemporal, null
            ); //cant x nivel


            foreach ($array_coll_tempinsvos as $indice => $row_indvos) {
                if ($cod_anterior == $row_indvos->codigo) {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['elementorepetido'];
                    continue;
                }
                if (empty($row_indvos->codigo)) {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['codigovacio'];
                    continue;
                } elseif (empty($row_indvos->viaadquisicion)) {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['viaadquisicionnoexiste'];
                    continue;
                } elseif (empty($row_indvos->organosatisface)) {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['organosatisfacenoexiste'];
                    continue;
                } elseif (empty($row_indvos->NomIndicador->idindicador)) {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['codigoindvacio'];
                    continue;
                }

                $array_vias_asociadas = array();
                foreach ($row_indvos->NomIndicador->DatIndicadorviaadquisicion as $indice_vaasoc => $val_va) {
                    $array_vias_asociadas[$val_va->idviaadquisicion]['existe'] = 'ok';
                    foreach ($val_va->DatIndicadorviaadquisicionorganosatisface as $indice_os => $val_os) {
                        $array_vias_asociadas[$val_va->idviaadquisicion][$val_os->idorganosatisface] = 'ok';
                    }
                }

                $result_error_insert = NomIndicador::verifExistanVA_OS(
                                $array_viasad, $row_indvos->viaadquisicion, $array_deno_os, $row_indvos->organosatisface, $array_vias_asociadas
                );
                if ($result_error_insert[0] == 'va') {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['viaadquisicionnoexiste'];
                    continue;
                } elseif ($result_error_insert[0] == 'os') {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['organosatisfacenoexiste'];
                    continue;
                }


                $obj_temp_insind = new stdClass();
                $arroba_cb = "";
                $arroba_va = "";
                $viasadq_exist_con_os = array();
                $array_insertado = array();
                foreach ($result_error_insert[1] as $relacion) {
                    if ($relacion->tipo == 'va' && $relacion->idviaadquisicion != null) {
                        $obj_temp_insind->idvia = $obj_temp_insind->idvia . $arroba_va . $relacion->idviaadquisicion;
                        $dolar_os = "";
                        $str_ids_os = "";
                        foreach ($relacion->organos as $org) {
                            if ($org->idorganosatisface != null) {
                                if ($viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface] != 'ok'
                                ) {
                                    $str_ids_os = $str_ids_os . $dolar_os . $org->idorganosatisface;
                                    $viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface] = 'ok';
                                    $dolar_os = "$";
                                }
                            }
                        }
                        $obj_temp_insind->idorgano = $obj_temp_insind->idorgano . $arroba_va . $str_ids_os;
                        $arroba_va = "@";
                    }
                }
                $row_indvos->idindicador = $row_indvos->NomIndicador->idindicador;
                $row_indvos->idvia = $obj_temp_insind->idvia;
                $row_indvos->idorgano = $obj_temp_insind->idorgano;
                $row_indvos->iddatosnomenclador = $array_ests_dnom['ok'];
                $cod_anterior = $row_indvos->codigo;
            }
            $offset += $paso;
            $cont_procesados++;
            $array_coll_tempinsvos->save();
        }
        if ($adicionar) {
            $conn->execute("select * from mod_planifimportacion.f_reemplazarviayos(?)", array($idesplogueada));
        }
        if ($vacio == 'vacio') {
            return $vacio;
        } else {
            return 1;
        }
    }

    private function adicionarVAOS(
    $idesplogueada, $cantxpag, $conn, $array_viasad, $array_deno_os, $array_ests_dnom, $array_filtros, $tablatemporal, $adicionar = true
    ) {
        $vacio = 'vacio';
        $cant = TempInsindicadorviayos::getConceptoSql(
                        $idesplogueada, $array_ests_dnom['oklisto'], $array_ests_dnom['ok'], 0, 0, $array_filtros, $tablatemporal, true
        ); //cant x nivel
        if ($cant > 0) {
            $vacio = 'no';
        }

        $cant_paginas = self::getCantPaginas($cant, $cantxpag);
        $paso = $cantxpag;
        $offset = 0;

        $cont_procesados = 0;
        $cod_anterior = null;
        for ($i = 0; $i < $cant_paginas; $i++) {
            $array_coll_tempinsvos = TempInsindicadorviayos::getConceptoSql(
                            $idesplogueada, $array_ests_dnom['oklisto'], $array_ests_dnom['ok'], $offset, $paso, $array_filtros, $tablatemporal, null
            ); //cant x nivel


            foreach ($array_coll_tempinsvos as $indice => $row_indvos) {
                if ($cod_anterior == $row_indvos->codigo) {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['elementorepetido'];
                    continue;
                }
                if (empty($row_indvos->codigo)) {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['codigovacio'];
                    continue;
                } elseif (empty($row_indvos->viaadquisicion)) {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['viaadquisicionnoexiste'];
                    continue;
                } elseif (empty($row_indvos->organosatisface)) {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['organosatisfacenoexiste'];
                    continue;
                } elseif (empty($row_indvos->NomIndicador->idindicador)) {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['codigoindvacio'];
                    continue;
                }

                $array_vias_asociadas = array();
                foreach ($row_indvos->NomIndicador->DatIndicadorviaadquisicion as $indice_vaasoc => $val_va) {
                    $array_vias_asociadas[$val_va->idviaadquisicion]['existe'] = 'ok';
                    foreach ($val_va->DatIndicadorviaadquisicionorganosatisface as $indice_os => $val_os) {
                        $array_vias_asociadas[$val_va->idviaadquisicion][$val_os->idorganosatisface] = 'ok';
                    }
                }

                $result_error_insert = NomIndicador::verifExistanVA_OS(
                                $array_viasad, $row_indvos->viaadquisicion, $array_deno_os, $row_indvos->organosatisface, $array_vias_asociadas
                );
                if ($result_error_insert[0] == 'va') {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['viaadquisicionnoexiste'];
                    continue;
                } elseif ($result_error_insert[0] == 'os') {
                    $row_indvos->iddatosnomenclador = $array_ests_dnom['organosatisfacenoexiste'];
                    continue;
                }


                $obj_temp_insind = new stdClass();
                $arroba_cb = "";
                $arroba_va = "";
                $viasadq_exist_con_os = array();
                $array_insertado = array();
                foreach ($result_error_insert[1] as $relacion) {
                    if ($relacion->tipo == 'va' && $relacion->idviaadquisicion != null) {
                        $obj_temp_insind->idvia = $obj_temp_insind->idvia . $arroba_va . $relacion->idviaadquisicion;
                        $dolar_os = "";
                        $str_ids_os = "";
                        foreach ($relacion->organos as $org) {
                            if ($org->idorganosatisface != null) {
                                if ($viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface] != 'ok'
                                ) {
                                    $str_ids_os = $str_ids_os . $dolar_os . $org->idorganosatisface;
                                    $viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface] = 'ok';
                                    $dolar_os = "$";
                                }
                            }
                        }
                        $obj_temp_insind->idorgano = $obj_temp_insind->idorgano . $arroba_va . $str_ids_os;
                        $arroba_va = "@";
                    }
                }
                $row_indvos->idindicador = $row_indvos->NomIndicador->idindicador;
                $row_indvos->idvia = $obj_temp_insind->idvia;
                $row_indvos->idorgano = $obj_temp_insind->idorgano;
                $row_indvos->iddatosnomenclador = $array_ests_dnom['ok'];
                $cod_anterior = $row_indvos->codigo;
            }
            $offset += $paso;
            $cont_procesados++;
            $array_coll_tempinsvos->save();
        }
        if ($adicionar) {
            $conn->execute("select * from mod_planifimportacion.f_actualizaviayos(?)", array($idesplogueada));
        }
        if ($vacio == 'vacio') {
            return $vacio;
        } else {
            return 1;
        }
    }

    private function adicionarIndicador_new_porprobar(
    $cantxpag, $conn, $idesplogueada, $idformato, $array_pais, $array_cbs, $array_viasad, $array_naturls, $array_deno_os, $array_ests_dnom, $integrator, $array_filtros, $tablatemporal, $adicionar = true
    ) {
        $cont_procesados = 0;
        $array_niveles = array(1, 2, 3, 4);
        $bool_procces_bylevel = null;
        $vacio = 'vacio';
        foreach ($array_niveles as $ptr_nivel) {
            $array_update = array();
            try {
                $array_cods = array();
//proceso x nivel, para evitar consultar los padres por cada indicador temporal.
                $cant = TempInsindicador::getConceptoSql_new_porProbar(
                                array($array_ests_dnom['oklisto'], $array_ests_dnom['errorennumerico']), 0, 0, $ptr_nivel, $array_filtros, $tablatemporal, true
                ); //cant x nivel

                if ($cant > 0) {
                    $vacio = 'no';
                }

                $cant_paginas = self::getCantPaginas($cant, $cantxpag);
                $paso = $cantxpag;
                $offset = 0;

                $cont_procesados = 0;
                $codigo_anterior = null;
                for ($i = 0; $i < $cant_paginas; $i++) { //$cant_paginas
                    $array_res = TempInsindicador::getConceptoSql(
                                    array($array_ests_dnom['oklisto'], $array_ests_dnom['errorennumerico']), $offset, $paso, $ptr_nivel, $array_filtros, $tablatemporal
                    );

                    $arraycoll_tempind = $array_res['tempind'];
                    unset($array_res['tempind']);
                    $array_nomind = $array_res['nomind'];
                    unset($array_res['nomind']);
                    $array_paralelo_localizacion = $array_res['localizacion'];
                    unset($array_res['localizacion']);

                    foreach ($arraycoll_tempind as $indice => $row_ind) {
                        $idpadre = null;
                        $idarbol = null;
                        if (isset($array_paralelo_localizacion['cod' . $row_ind->codigo])) {
                            $ptr_indicador = $array_paralelo_localizacion['cod' . $row_ind->codigo];
                            $idpadre = $array_nomind[$ptr_indicador[1]]->idpadre;
                            $idarbol = $array_nomind[$ptr_indicador[1]]->idarbol;
                        } else {
                            $ptr_indicador[0] = 'error';
                        }
                        if ($row_ind->iddatosnomenclador == $array_ests_dnom['oklisto']) {
                            continue;
                        }
                        if ($codigo_anterior == $row_ind->codigo) { //elementorepetido
                            $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['elementorepetido'];
                            continue;
                        } elseif ($row_ind->codigo == null) {
                            $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['codigoindvacio'];
                            continue;
                        }
                        $res_na_lv = self::validarNivelArbol($row_ind->nivelarbol);
                        if ($res_na_lv == 'noval') {
                            $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['nivelplanifnovalido'];
                            continue;
                        }
                        $nivelarbol = $res_na_lv[0];
                        $log_valida = $res_na_lv[1];
                        if ($log_valida != strlen($row_ind->codigo)) {
                            $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['codigoinconcistente'];
                            continue;
                        }
                        $nivel = self::getEstado($row_ind->nivel);
                        $result_error_insert = NomIndicador::verifExistanCB_VA_OS(
                                        $array_cbs, $row_ind->centrobalance, $array_viasad, $row_ind->viaadquisicion, $array_deno_os, $row_ind->organosatisface
                        );
                        if ($result_error_insert[0] == 'cb') {
                            $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['centrobalancenoexiste'];
                            continue;
                        } elseif ($result_error_insert[0] == 'va') {
                            $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['viaadquisicionnoexiste'];
                            continue;
                        } elseif ($result_error_insert[0] == 'os') {
                            $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['organosatisfacenoexiste'];
                            continue;
                        }
                        if ($ptr_indicador[0] != null && $ptr_indicador[0] == 'no') { //ADICIONAR INDICADOR
                            $naturaleza = null;
                            if ($array_naturls[$row_ind->naturaleza] != null) {
                                $naturaleza = $array_naturls[$row_ind->naturaleza];
                            } else {
                                $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['naturalezanoexiste'];
                                continue;
                            }
                            $idpais = $array_pais[$row_ind->pais];
                            if ($idpais == null) { //CUB = 1
                                $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['paisnovalido'];
                                continue;
                            }
//solo admite numeros o letras
                            if ($array_ums_buscadas['id' . $row_ind->idumedida] == null) {
                                $idumedida = $integrator->datosmaestros->obtenerUnidadesMedidaByAbreviatura(
                                        $row_ind->idumedida
                                );
                                $idumedida = $idumedida[0]->idunidadmedida;
                            } else {
                                $idumedida = $array_ums_buscadas['id' . $row_ind->idumedida];
                            }
                            if ($idumedida == null) {
//
                                $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['umnoexiste'];
                                continue;
                            } else {
                                $array_ums_buscadas['id' . $row_ind->idumedida] = $idumedida;
                            }

                            $array_codpadre_niv = NomIndicador::getCodPadre($row_ind->codigo);
                            if ($nivelarbol > 1 && (empty($idpadre) || empty($idarbol))) {
                                if ($nivelarbol == 2) {
                                    $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['genericonoexiste'];
                                } elseif ($nivelarbol == 3) {
                                    $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['subgenericonoexiste'];
                                } else { //es 4
                                    $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['especificonoexiste'];
                                }
                                continue;
                            }
                            if ($array_codpadre_niv == 'errorformato') {
                                $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['genericonoexiste'];
                                continue;
                            } elseif ($adicionar) {
                                if (($idpadre == null || $idarbol == null) && $array_codpadre_niv[1] > 1) {
                                    if ($array_codpadre_niv[1] == 2) {

                                        $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['genericonoexiste'];
                                    } elseif ($array_codpadre_niv[1] == 3) {

                                        $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['subgenericonoexiste'];
                                    } else { //es 4
                                        $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['especificonoexiste'];
                                    }
                                    continue;
                                }
                            }
                            $estado = self::getEstado($row_ind->estado);
                            $idaprob = self::getAprobacion($row_ind->idaprobacion);
                            $new_idindicador = $conn->execute("(Select nextval('sec_indicador_seq')); ")->fetchAll(
                                    PDO::FETCH_ASSOC
                            );
                            $new_idindicador = $new_idindicador[0]['nextval'];
                            $obj_temp_insind = new stdClass();
                            $arroba_cb = "";
                            $arroba_va = "";
                            $viasadq_exist_con_os = array();
                            $array_insertado = array();
                            foreach ($result_error_insert[1] as $relacion) {
                                if ($relacion->tipo == 'cb' && $array_insertado[$new_idindicador . 'U' . $relacion->identidaddatosnomenclador] != 'ok' && $relacion->identidaddatosnomenclador != null
                                ) {
                                    $array_insertado[$new_idindicador . 'U' . $relacion->identidaddatosnomenclador] = 'ok';
                                    $obj_temp_insind->idcentrobalance = $obj_temp_insind->idcentrobalance . $arroba_cb
                                            . $relacion->identidaddatosnomenclador;
                                    $arroba_cb = "@";
                                } elseif ($relacion->tipo == 'va' && $relacion->idviaadquisicion != null) {
                                    $obj_temp_insind->idvia = $obj_temp_insind->idvia . $arroba_va . $relacion->idviaadquisicion;
                                    $dolar_os = "";
                                    $str_ids_os = "";
                                    foreach ($relacion->organos as $org) {
                                        if ($org->idorganosatisface != null) {
                                            if ($viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface] != 'ok'
                                            ) {
                                                $str_ids_os = $str_ids_os . $dolar_os . $org->idorganosatisface;
                                                $viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface] = 'ok';
                                                $dolar_os = "$";
                                            }
                                        }
                                    }
                                    $obj_temp_insind->idorgano = $obj_temp_insind->idorgano . $arroba_va . $str_ids_os;
                                    $arroba_va = "@";
                                }
                            }
                            if ($array_cods['id' . $row_ind->codigo] != 'ok') {
                                $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['ok'];
                                $arraycoll_tempind[$indice]->idpadre = $idpadre;
                                $arraycoll_tempind[$indice]->idaprob = $idaprob;
                                $arraycoll_tempind[$indice]->idum = $idumedida;
                                $arraycoll_tempind[$indice]->idpais = $idpais;
                                $arraycoll_tempind[$indice]->idnaturaleza = $naturaleza;
                                $arraycoll_tempind[$indice]->idarbol = $idarbol;
                                $arraycoll_tempind[$indice]->idformato = $idformato;
                                $arraycoll_tempind[$indice]->idcentrobalance = $obj_temp_insind->idcentrobalance;
                                $arraycoll_tempind[$indice]->idvia = $obj_temp_insind->idvia;
                                $arraycoll_tempind[$indice]->idorgano = $obj_temp_insind->idorgano;
                                $arraycoll_tempind[$indice]->idnivel = $nivel;
                                $arraycoll_tempind[$indice]->idnivelarbol = $nivelarbol;
                                $arraycoll_tempind[$indice]->idindicador = $new_idindicador;
                                $array_cods['id' . $row_ind->codigo] = 'ok';
                            }
                        } else {

                            $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['indicadoryaexiste'];
                        }
                        $codigo_anterior = $row_ind->codigo;
                    }
                    if (is_object($arraycoll_tempind)) {
                        $arraycoll_tempind->save();
                    }
                    $cont_procesados++;
                }
                if ($adicionar) {
                    if ($cant == $cont_procesados && $bool_procces_bylevel != 0
                    ) {
                        $bool_procces_bylevel = 1;
                    } else {
                        $bool_procces_bylevel = 0;
                    }
                }
            } catch (Doctrine_Exception $e) {
                echo "<pre>";
                print_r($e->getMessage());
                return array(-1);
            }
            if ($adicionar) {
                $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
                $idejercicio = $idejercicio[0]['idejercicio'];
                $conn->execute(
                        "select * from mod_planifimportacion.f_insertar_indicador(?,?)", array($ptr_nivel, $idesplogueada, $idejercicio)
                );
            }
        }

        if ($vacio == 'vacio') {
            return $vacio;
        }
//Doctrine_Exception
        if ($adicionar) {
            return $bool_procces_bylevel;
        } else {
            return 1;
        }
    }

    private function adicionarIndicador(
    $cantxpag, $conn, $idesplogueada, $idformato, $array_pais, $array_cbs, $array_viasad, $array_naturls, $array_deno_os, $array_ests_dnom, $integrator, $array_filtros, $tablatemporal, $adicionar = true
    ) {
        $cont_procesados = 0;
        $array_niveles = array(1, 2, 3, 4);
        $bool_procces_bylevel = null;
        $vacio = 'vacio';
        foreach ($array_niveles as $ptr_nivel) {
            $array_update = array();
            try {
                $array_cods = array();
                $cant = TempInsindicador::getConceptoSql(
                                array($array_ests_dnom['oklisto'], $array_ests_dnom['errorennumerico']), 0, 0, $ptr_nivel, $array_filtros, $tablatemporal, true
                );
                if ($cant > 0) {
                    $vacio = 'no';
                }

                $cant_paginas = self::getCantPaginas($cant, $cantxpag);

                $paso = $cantxpag;
                $offset = 0;

                $cont_procesados = 0;
                for ($i = 0; $i < $cant_paginas; $i++) { //$cant_paginas
                    $array_inds = TempInsindicador::getConceptoSql(
                                    array($array_ests_dnom['oklisto'], $array_ests_dnom['errorennumerico']), $offset, $paso, $ptr_nivel, $array_filtros, $tablatemporal
                    );

                    $offset += $paso;
                    $codigo_anterior = null;

                    foreach ($array_inds as $indice => $row_ind) {
                        $idpadre = $row_ind->idpadre;
                        $idarbol = $row_ind->idarbol;


                        if ($row_ind->iddatosnomenclador == $array_ests_dnom['oklisto']) {
                            continue;
                        }

                        if ($codigo_anterior == $row_ind->codigo) {
                            $array_update['elementorepetido'][] = $row_ind->idinsindicador;
                            continue;
                        } elseif ($row_ind->codigo == null) {
                            $array_update['codigoindvacio'][] = $row_ind->idinsindicador;
                            continue;
                        }

                        $res_na_lv = self::validarNivelArbol($row_ind->nivelarbol);

                        if ($res_na_lv == 'noval') {
                            $array_update['nivelplanifnovalido'][] = $row_ind->idinsindicador;
                            continue;
                        }
                        $nivelarbol = $res_na_lv[0];
                        $log_valida = $res_na_lv[1];

                        if ($log_valida != strlen($row_ind->codigo)) {
                            $array_update['codigoinconcistente'][] = $row_ind->idinsindicador;
                            continue;
                        }

                        $nivel = self::getEstado($row_ind->nivel);

                        $result_error_insert = NomIndicador::verifExistanCB_VA_OS(
                                        $array_cbs, $row_ind->centrobalance, $array_viasad, $row_ind->viaadquisicion, $array_deno_os, $row_ind->organosatisface
                        );

                        if ($result_error_insert[0] == 'cb') {
                            $array_update['centrobalancenoexiste'][] = $row_ind->idinsindicador;
                            continue;
                        } elseif ($result_error_insert[0] == 'va') {
                            $array_update['viaadquisicionnoexiste'][] = $row_ind->idinsindicador;
                            continue;
                        } elseif ($result_error_insert[0] == 'os') {
                            $array_update['organosatisfacenoexiste'][] = $row_ind->idinsindicador;
                            continue;
                        }

                        if ($row_ind->idindicador == null) { //ADICIONAR INDICADOR
                            $naturaleza = null;
                            if ($array_naturls[$row_ind->naturaleza] != null) {
                                $naturaleza = $array_naturls[$row_ind->naturaleza];
                            } else {
                                $array_update['naturalezanoexiste'][] = $row_ind->idinsindicador;
                                continue;
                            }
                            $idpais = $array_pais[$row_ind->pais];
                            if ($idpais == null) { //CUB = 1
                                $array_update['paisnovalido'][] = $row_ind->idinsindicador;
                                continue;
                            }
//solo admite numeros o letras
                            if ($array_ums_buscadas['id' . $row_ind->idumedida] == null) {
                                $idumedida = $integrator->datosmaestros->obtenerUnidadesMedidaByAbreviatura(
                                        $row_ind->idumedida
                                );
                                $idumedida = $idumedida[0]->idunidadmedida;
                            } else {
                                $idumedida = $array_ums_buscadas['id' . $row_ind->idumedida];
                            }

                            if ($idumedida == null) {
                                $array_update['umnoexiste'][] = $row_ind->idinsindicador;
                                continue;
                            } else {
                                $array_ums_buscadas['id' . $row_ind->idumedida] = $idumedida;
                            }

                            $array_codpadre_niv = NomIndicador::getCodPadre($row_ind->codigo);
                            if ($nivelarbol > 1 && ($idpadre == null || $idarbol == null)) {
                                if ($nivelarbol == 2) {
                                    $array_update['genericonoexiste'][] = $row_ind->idinsindicador;
                                } elseif ($nivelarbol == 3) {
                                    $array_update['subgenericonoexiste'][] = $row_ind->idinsindicador;
                                } else { //es 4
                                    $array_update['especificonoexiste'][] = $row_ind->idinsindicador;
                                }
                                continue;
                            }
                            if ($array_codpadre_niv == 'errorformato') {
                                $array_update['genericonoexiste'][] = $row_ind->idinsindicador;
                                continue;
                            } elseif ($adicionar) {
                                if (($idpadre == null || $idarbol == null) && $array_codpadre_niv[1] > 1) {
                                    if ($array_codpadre_niv[1] == 2) {
                                        $array_update['genericonoexiste'][] = $row_ind->idinsindicador;
                                    } elseif ($array_codpadre_niv[1] == 3) {
                                        $array_update['subgenericonoexiste'][] = $row_ind->idinsindicador;
                                    } else { //es 4
                                        $array_update['especificonoexiste'][] = $row_ind->idinsindicador;
                                    }
                                    continue;
                                }
                            }

                            $estado = self::getEstado($row_ind->estado);
                            $idaprob = self::getAprobacion($row_ind->idaprobacion);

                            $new_idindicador = $conn->execute("(Select nextval('sec_indicador_seq')); ")->fetchAll(
                                    PDO::FETCH_ASSOC
                            );
                            $new_idindicador = $new_idindicador[0]['nextval'];

                            $obj_temp_insind = new stdClass();
                            $arroba_cb = "";
                            $arroba_va = "";
                            $viasadq_exist_con_os = array();
                            $array_insertado = array();
                            foreach ($result_error_insert[1] as $relacion) {
                                if ($relacion->tipo == 'cb' && $array_insertado[$new_idindicador . 'U' . $relacion->identidaddatosnomenclador] != 'ok' && $relacion->identidaddatosnomenclador != null
                                ) {
                                    $array_insertado[$new_idindicador . 'U' . $relacion->identidaddatosnomenclador] = 'ok';
                                    $obj_temp_insind->idcentrobalance = $obj_temp_insind->idcentrobalance . $arroba_cb
                                            . $relacion->identidaddatosnomenclador;
                                    $arroba_cb = "@";
                                } elseif ($relacion->tipo == 'va' && $relacion->idviaadquisicion != null) {
                                    $obj_temp_insind->idvia = $obj_temp_insind->idvia . $arroba_va . $relacion->idviaadquisicion;
                                    $dolar_os = "";
                                    $str_ids_os = "";
                                    foreach ($relacion->organos as $org) {
                                        if ($org->idorganosatisface != null) {
                                            if ($viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface] != 'ok'
                                            ) {
                                                $str_ids_os = $str_ids_os . $dolar_os . $org->idorganosatisface;
                                                $viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface] = 'ok';
                                                $dolar_os = "$";
                                            }
                                        }
                                    }
                                    $obj_temp_insind->idorgano = $obj_temp_insind->idorgano . $arroba_va . $str_ids_os;
                                    $arroba_va = "@";
                                }
                            }

                            if ($array_cods['id' . $row_ind->codigo] != 'ok') {

                                $conn->execute(
                                        "UPDATE mod_planifimportacion.temp_insindicador
                                                                        SET iddatosnomenclador=?,idpadre=?,idaprob=?,estadoind=?,idum=?,idpais=?,idnaturaleza=?,idarbol=?,idformato=?,idcentrobalance=?,idvia=?,idorgano=?,idnivel=?,idnivelarbol=?,idindicador=? WHERE idinsindicador=? AND idespecialidad=? AND idnivelarbol=?", array($array_ests_dnom['ok'],
                                    $idpadre,
                                    $idaprob,
                                    $estado,
                                    $idumedida,
                                    $idpais,
                                    $naturaleza,
                                    $idarbol,
                                    $idformato,
                                    $obj_temp_insind->idcentrobalance,
                                    $obj_temp_insind->idvia,
                                    $obj_temp_insind->idorgano,
                                    $nivel,
                                    $nivelarbol,
                                    $new_idindicador,
                                    $row_ind->idinsindicador,
                                    $idesplogueada,
                                    $row_ind->idnivelarbol
                                        )
                                );
                                $array_cods['id' . $row_ind->codigo] = 'ok';
                            }
                        } else {
                            $array_update['indicadoryaexiste'][] = $row_ind->idinsindicador;
                        }

                        $codigo_anterior = $row_ind->codigo;
                    }

                    $cont_procesados++;
                }

                if ($adicionar) {
                    if ($cant == $cont_procesados && $bool_procces_bylevel != 0
                    ) {
                        $bool_procces_bylevel = 1;
                    } else {
                        $bool_procces_bylevel = 0;
                    }
                }
            } catch (Doctrine_Exception $e) {
                echo "<pre>";
                print_r($e->getMessage());
                return array(-1);
            }
            self::actualizar_estados($conn, $array_update, $array_ests_dnom);

            if ($adicionar) {

                $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
                $idejercicio = $idejercicio[0]['idejercicio'];
                $conn->execute(
                        "select * from mod_planifimportacion.f_insertar_indicador(?,?)", array($ptr_nivel, $idesplogueada, $idejercicio)
                );
            }
        }

        if ($vacio == 'vacio') {
            return $vacio;
        }
//Doctrine_Exception
        if ($adicionar) {
            return $bool_procces_bylevel;
        } else {
            return 1;
        }
    }

    private function getCantPaginas($cant, $cantxpag) {
        $cant_paginas = intval($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cant_paginas++;
        }
        return $cant_paginas;
    }

    private function adicionarNormasConsumo($idesplogueada, $cantxpag, $array_ests_dnom, $adicionar = true) {
        $cont = 0;
        $cant = TempInsnorma::getConcepto(
                        $idesplogueada, array($array_ests_dnom['oklisto'], $array_ests_dnom['errorennumerico']), 0, 0, true
        );


        if ($cant == 0) {
            return 'vacio';
        }
        $cant_paginas = self::getCantPaginas($cant, $cantxpag);
        $offset = 0;
        $paso = $cantxpag;
        unset($cantxpag);
        $idejercicio = NomEjercicioplanificacion:: listarEjercicioActual();
        for ($i = 0; $i < $cant_paginas; $i++) {
            $array_actvs_normas = TempInsnorma::getConcepto(
                            $idesplogueada, array($array_ests_dnom['oklisto'], $array_ests_dnom['errorennumerico']), $offset, $paso
            );

            $offset += $paso;
            $array_cods = array();
            $normas = new Doctrine_Collection(Doctrine:: getTable('DatNorma'));
            $integrator = ZendExt_IoC::getInstance();
            foreach ($array_actvs_normas as $key => $row_act_norma) {

                $codind = $row_act_norma->codigoind;
                $codact = $row_act_norma->codigoact;

                if ($row_act_norma->NomActividad->idactividad . '' == null) {
                    $array_actvs_normas[$key]->iddatosnomenclador = $array_ests_dnom['actividadnoexiste'];
                    continue;
                }
                if ($row_act_norma->NomIndicador->idindicador . '' == null) {
                    $array_actvs_normas[$key]->iddatosnomenclador = $array_ests_dnom['indicadornoexiste'];
                    continue;
                }
                if ($row_act_norma->NomIndicador->NomIndicadorplanif->nivelplanif != 1) {
                    $array_actvs_normas[$key]->iddatosnomenclador = $array_ests_dnom['indicadornonivelplanif'];
                    continue;
                }
                if (empty($row_act_norma->codigoact)) {
                    $array_actvs_normas[$key]->iddatosnomenclador = $array_ests_dnom['codigoactvacio'];
                    continue;
                }
                if (empty($row_act_norma->codigoind)) {
                    $array_actvs_normas[$key]->iddatosnomenclador = $array_ests_dnom['codigoindvacio'];
                    continue;
                }
                if ($row_act_norma->cantbase <= 0) {
                    $array_actvs_normas[$key]->iddatosnomenclador = $array_ests_dnom['cantbasecero'];
                    continue;
                }
                if ($row_act_norma->cantplanif <= 0) {
                    $array_actvs_normas[$key]->iddatosnomenclador = $array_ests_dnom['cantplanifcero'];
                    continue;
                }
                if ($adicionar) {
                    $normas[$cont]->idindicador = $row_act_norma->NomIndicador->idindicador;
                    $normas[$cont]->idactividad = $row_act_norma->NomActividad->idactividad;
                    $normas[$cont]->cantbase = $row_act_norma->cantbase;
                    $normas[$cont]->cantplanif = $row_act_norma->cantplanif;
                    $normas[$cont]->idejercicio = $idejercicio[0]['idejercicio'];
                    $cont++;
                    $array_actvs_normas[$key]->iddatosnomenclador = $array_ests_dnom['oklisto'];
                } else {
                    $array_actvs_normas[$key]->iddatosnomenclador = $array_ests_dnom['ok'];
                }
                $row_act_norma->codigoind = $codind;
                $row_act_norma->codigoact = $codact;
            }
            unset($normas[$cont]);
            try {
                $normas->save();
            } catch (Doctrine_Exception $e) {
                if ($e->getCode() == '23505') { //error de codigo indicador repetido en las normas de la actividad
                    return array('error' => 'codind_repetido');
                } else {
                    throw new Exception($e->getMessage());
                }
            }
            $array_actvs_normas->save();
        }

        return $cont;
    }

    private function validarNivelArbol($strnivelarbol) {

        switch (strtolower($strnivelarbol)) {
            case 'gen�rico' :
                $nivelarbol = 1;
                $log_valida = 3;
                break;
            case 'subgen�rico' :
                $nivelarbol = 2;
                $log_valida = 4;
                break;
            case 'espec�fico' :
                $nivelarbol = 3;
                $log_valida = 6;
                break;
            case 'generico' :
                $nivelarbol = 1;
                $log_valida = 3;
                break;
            case 'subgenerico' :
                $nivelarbol = 2;
                $log_valida = 4;
                break;
            case 'especifico' :
                $nivelarbol = 3;
                $log_valida = 6;
                break;
            case 'surtido' :
                $nivelarbol = 4;
                $log_valida = 10;
                break;
            case 'g' :
                $nivelarbol = 1;
                $log_valida = 3;
                break;
            case 'sg' :
                $nivelarbol = 2;
                $log_valida = 4;
                break;
            case 'e' :
                $nivelarbol = 3;
                $log_valida = 6;
                break;
            case 's' :
                $nivelarbol = 4;
                $log_valida = 10;
                break;
            default : //no valido
                return 'noval';
                break;
        }
        return array($nivelarbol, $log_valida);
    }

    private function getEstado($nivel) {
//print_r($nivel);die;
        $nivelr = '0';
        if ($nivel != null) {
            if ($nivel == 'Si' || $nivel == 'S�' || $nivel == 's�' || $nivel == 'si' || $nivel == 'SI' || $nivel == 'S�'
            ) {
                $nivelr = '1';
            }
        }
        return $nivelr;
    }

    private function getAprobacion($val) {
        if ($val != null) {
            if ($val == 'Si' || $val == 'S�' || $val == 's�' || $val == 'si' || $val == 'SI' || $val == 'S�' || $val == 'Aprobado' || $val == 'APROBADO'
            ) {
                return 4;
            }
        }
        return 1;
    }

    private function actualizar_estados($conn, $array_update, $array_ests_dnom) {
        foreach ($array_update as $key => $valor) {
            if ($array_update[$key][0] != null) {
                $conn->execute(
                        "UPDATE mod_planifimportacion.temp_insindicador SET iddatosnomenclador = ? WHERE idinsindicador IN ("
                        . implode(",", $array_update[$key]) . ")", array($array_ests_dnom[$key])
                );
            }
        }
    }

    public function obtenerColumnasDadoIdConcepto($idconcepto) {
        $query = Doctrine_Query::create();
        $query->from('DatColumnaconcepto dcc')->innerJoin('dcc.DatConfiguracionimportar dci')->innerJoin(
                'dci.NomConceptoimportar nci'
        )->where('nci.idconcepto = ?', $idconcepto)->orderBy('dcc.orden')->setHydrationMode(Doctrine::HYDRATE_ARRAY);

        $result = $query->execute();
        return $result;
    }

    public function borraDatosTabla($tabla) {

        $query = Doctrine_Query::create();
        $query->delete()->from($tabla)->execute();
    }

    public function importActividades($idesplogueada, $params, $activs, $conf, $tablaTemp) {
        $coll_actvs = new Doctrine_Collection(Doctrine:: getTable($tablaTemp));
        $i = 0;
        foreach ($activs as $k => $row_act) {
            if ($k > 1) {
                $coll_actvs[$i] = new $tablaTemp();
                $coll_actvs[$i]->codigo = utf8_encode($row_act[1]);
                $coll_actvs[$i]->denominacion = utf8_encode($row_act[2]);
                $coll_actvs[$i]->nivel = strtoupper(utf8_encode($row_act[3]));
                $coll_actvs[$i]->especialidad = utf8_encode($row_act[4]);
                $coll_actvs[$i]->plan = utf8_encode($row_act[5]);
                $coll_actvs[$i]->aprobada = utf8_encode($row_act[6]);
                $coll_actvs[$i]->activada = utf8_encode($row_act[7]);
                $coll_actvs[$i]->iddatosnomenclador = null;
                $coll_actvs[$i]->idespecialidad = $idesplogueada;
                $i++;
            }
        }
        $coll_actvs->save();
        return 1;
    }

    public function realizarAccion($idaccion, $idconcepto, $idconf, $rectora, $filtros, $cols_checked) {
        $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');

        $tablatemporal = self::obtenerColumnasDadoIdConcepto($idconcepto);
        $tablatemporal = $tablatemporal[0]['DatConfiguracionimportar']['tablatemporal'];

        $array_ests_uri = array();
        foreach ($array_ests_dnom as $k => $dn) {
            unset($array_ests_dnom[$k]);
            $array_ests_uri[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
        }

        foreach ($cols_checked as $k => $valor) {
            unset($cols_checked[$k]);
            $cols_checked[$valor->column_name] = true;
        }

        switch ($idconcepto) {
            case '1':
                return self:: actualizarTablaIndicadores(
                                $idconcepto, $idaccion, $rectora, $array_ests_uri, $filtros, $tablatemporal, $cols_checked
                );
                break;
            case '2':
                return self:: actualizarTablaIndicadores(
                                $idconcepto, $idaccion, $rectora, $array_ests_uri, $filtros, $tablatemporal, $cols_checked
                );
                break;
            case '4':
                return self:: actualizarTablaIndicadores(
                                $idconcepto, $idaccion, $rectora, $array_ests_uri, $filtros, $tablatemporal, $cols_checked
                );
                break;
            case '3':
                return self:: realizarAccionActvs(
                                $idaccion, $idconcepto, $idconf, $rectora, $array_ests_uri, $cols_checked
                );
                break;
            case '5':
                return self::actualizarTablaIndicadores(
                                $idconcepto, $idaccion, $rectora, $array_ests_uri, $filtros, $tablatemporal, $cols_checked
                );
                break;
            case '5':
                return self::actualizarTablaIndicadores(
                                $idconcepto, $idaccion, $rectora, $array_ests_uri, $filtros, $tablatemporal, $cols_checked
                );
                break;
            case '6':
                return self::actualizarTablaIndicadores(
                                $idconcepto, $idaccion, $rectora, $array_ests_uri, $filtros, $tablatemporal, $cols_checked
                );
            case '8'://bgnivelesactividad
                return self::actualizarTablaIndicadores(
                                $idconcepto, $idaccion, $rectora, $array_ests_uri, $filtros, $tablatemporal, $cols_checked
                );
            case '9'://plan
                return self::actualizarTablaIndicadores(
                                $idconcepto, $idaccion, $rectora, $array_ests_uri, $filtros, $tablatemporal, $cols_checked
                );
                break;
            default:
                return 3;
                break;
        }
    }

    public function realizarAccionActvs($idaccion, $idconcepto, $idconf, $rectora, $array_ests_uri, $cols_checked) {

        $ultimonivel = NomActividad::obtener_ConfFormato_UltimoNivel();
        $idformato = $ultimonivel[0];
        $ultimonivel = $ultimonivel[1];
        $nomenclador = new ZendExt_Nomencladores_ADT ();
        $especialidades = $nomenclador->selectParam(
                'nom_especialidad', array('idespecialidad', 'denespecialidad', 'codespecialidad')
        );
        $array_esp = array();
        $array_long_inicialxnivelx_esp = array();
        foreach ($especialidades as $k => $esp) {
            $array_esp['den' . strtoupper($esp['denespecialidad'])]['idespecialidad'] = $esp['idespecialidad'];
            $array_esp['den' . strtoupper($esp['denespecialidad'])]['codespecialidad'] = $esp['codespecialidad'];
            $longitud_codesp = strlen($esp['codespecialidad']);

            if ($array_long_inicialxnivelx_esp['longit' . $longitud_codesp] == null) {
                $array_long_inicialxnivelx_esp['longit' . $longitud_codesp] = NomActividad::obtIntervalosPorPartesDeFormatos($esp['codespecialidad'], true);
            }
            $array_esp['den' . strtoupper($esp['denespecialidad'])]['long_inicialxnivel'] = $array_long_inicialxnivelx_esp['longit' . $longitud_codesp];
            unset($especialidades[$k]);
        }
        unset($especialidades);

        $array_estados_aprob = array(
            'eNo' => "0",
            'eNO' => "0",
            'eno' => "0",
            'eSi' => "1",
            'aNo' => "1",
            'aNO' => "1",
            'aSi' => "3",
            'aSI' => "3",
            'aS�' => "3",
            'asi' => "3",
            'as�' => "3",
            'aRector' => "4",
            'aRECTOR' => "4"
        );
//temporal
        $array_nivel = array(
            'nGA' => 1,
            'nGRUPO DE LA ACTIVIDAD' => 1,
            'nSGA' => 2,
            'nSUB GRUPO DE LA ACTIVIDAD' => 2,
            'nPRE ACTIVIDAD' => 3,
            'nPA' => 3,
            'nA' => 4,
            'nACT' => 4,
            'nACTIVIDAD' => 4
        );
//No definido
        $array_modelos = DatEntidadmodelo::servBP_getModeloAsocEntidad(
                        ZendExt_GlobalConcept::getInstance()->Estructura->idestructura
        );
        $array_mods = array();
        foreach ($array_modelos as $k => $modelo) {
            $array_mods['deno' . strtoupper($modelo['denominacion'])] = $modelo['idmodelo'];
            unset($array_modelos[$k]);
        }
        unset($array_modelos);

        $result = 1;
        switch ($idaccion) {
            case 1: { //adicionar
                    return self::adicionarActvs(
                                    $array_ests_uri, $ultimonivel, $idformato, $array_esp, $array_estados_aprob, $array_nivel, $array_mods, $array_long_inicialxnivelx_esp
                    );
                }
                break;
            case 4: { //validar
                    return self::adicionarActvs(
                                    $array_ests_uri, $ultimonivel, $idformato, $array_esp, $array_estados_aprob, $array_nivel, $array_mods, $array_long_inicialxnivelx_esp, false
                    );
                }
                break;
            default:
                break;
        }
        return $result;
    }

    private function adicionarActvs(
    $array_ests_uri, $ultimonivel, $idformato, $array_esp, $array_estados_aprob, $array_nivel, $array_mods, $array_long_inicialxnivelx_esp, $esadd = true
    ) { //adicionar
//                    $i = 0;
        $exist_elem = false;
        for ($ptr_nivel = 1; $ptr_nivel < 5; $ptr_nivel++) {
            $cant = TempInsactividad::getConceptos($array_ests_uri['oklisto'], 0, 0, true);
            if ($cant > 0) {
                $exist_elem = true;
            }
            $cantxpag = 10000;
            $cant_paginas = intval($cant / $cantxpag);
            if (fmod($cant, $cantxpag) > 0) {
                $cant_paginas++;
            }
            $offset = 0;
            $paso = $cantxpag;
            unset($cantxpag);
            $ultimo_codigo = null;
            for ($i = 0; $i < $cant_paginas; $i++) {
                $result = TempInsactividad::getConceptos($array_ests_uri['oklisto'], $offset, $paso);

//no es necesario iterar el offset
                $array_actvs = $result[0];
                $array_paralelo_existentes = $result[1];
                unset($result);
                $array_cods = array();
                $array_coll_actvs = new Doctrine_Collection(Doctrine:: getTable("NomActividad"));
                $array_paralelo_paracoll_actvs = array();
                $ptr = 0;
                foreach ($array_actvs as $key => $row_act) {
                    $codigo = $row_act->codigo;
                    if ($row_act->iddatosnomenclador == $array_ests_uri['oklisto']) {
                        continue;
                    }
                    if ($ultimo_codigo == $row_act->codigo) {
                        $row_act->iddatosnomenclador = $array_ests_uri['codigorepetido'];
                        continue;
                    }
                    if ($array_esp['den' . strtoupper($row_act->especialidad)]['idespecialidad'] != null) {
                        $idespecialidad = $array_esp['den' . strtoupper($row_act->especialidad)]['idespecialidad'];
                    } else {
                        $row_act->iddatosnomenclador = $array_ests_uri['especialidadnoexiste'];
                        $result = -1;
                        continue;
                    }
//validar subcodigo de la especialidad

                    if (self::verificarCodActv(
                                    $codigo, $array_esp['den' . strtoupper($row_act->especialidad)]['codespecialidad']
                            )
                    ) {
                        $row_act->iddatosnomenclador = $array_ests_uri['errorsubcodigoespecialidad'];
                        $result = -1;
                        continue;
                    }
//validar si ya existe la actividad para esa especialidad
                    if ($array_paralelo_existentes[$key]['idactividad'] != null) {
                        $row_act->iddatosnomenclador = $array_ests_uri['codigorepetido'];
                        $result = -1;
                        continue;
                    }
//validar denominacion
                    if ($row_act->denominacion != null) {
                        $denominacion = $row_act->denominacion;
                    } else {
//temporal
                        $row_act->iddatosnomenclador = $array_ests_uri['denominacionnovalida']; //308;
                        $result = -1;
                        continue;
                    }
//validar aprobacion
                    if ($array_estados_aprob['a' . $row_act->aprobada] == null) {
                        $row_act->iddatosnomenclador = $array_ests_uri['aprobacionnoexiste']; //310;
                        $result = -1;
                        continue;
                    } else {
                        $idaprobacion = $array_estados_aprob['a' . $row_act->aprobada];
                    }
//validar estado
                    $estado = $array_estados_aprob['e' . $row_act->activada];
                    if ($array_nivel['n' . strtoupper($row_act->nivel)] != null) {
                        $nivel = $array_nivel['n' . strtoupper($row_act->nivel)];
                    } else {
                        $row_act->iddatosnomenclador = $array_ests_uri['nivelnoexiste'];
                        $result = -1;
                        continue;
                    }
//validar codigo
//obtener y validar codigo del padre


                    $nomenclador = new ZendExt_Nomencladores_ADT ();
                    $especialidades = $nomenclador->selectParam(
                            'nom_especialidad', array('idespecialidad', 'denespecialidad', 'codespecialidad')
                    );
                    $array_esp = array();
                    $array_long_inicialxnivelx_esp = array();
                    foreach ($especialidades as $k => $esp) {
                        $array_esp['den' . strtoupper($esp['denespecialidad'])]['idespecialidad'] = $esp['idespecialidad'];
                        $array_esp['den' . strtoupper($esp['denespecialidad'])]['codespecialidad'] = $esp['codespecialidad'];
                        $longitud_codesp = strlen($esp['codespecialidad']);

                        if ($array_long_inicialxnivelx_esp['longit' . $longitud_codesp] == null) {
                            $array_long_inicialxnivelx_esp['longit' . $longitud_codesp] = NomActividad::obtIntervalosPorPartesDeFormatos($esp['codespecialidad'], true);
                        }
                        $array_esp['den' . strtoupper($esp['denespecialidad'])]['long_inicialxnivel'] = $array_long_inicialxnivelx_esp['longit' . $longitud_codesp];
                        unset($especialidades[$k]);
                    }
                    unset($especialidades);


                    $arry_idarb_idp = self::definirPadreActv(
                                    $codigo, $nivel, $array_long_inicialxnivelx_esp['longit' . $longitud_codesp][$nivel][0]
                    );
                    if ($arry_idarb_idp == 'noexiste') {
                        $row_act->iddatosnomenclador = $array_ests_uri['padrenoexiste']; //310;
                        $result = -1;
                        continue;
                    }
//asociar a plan
                    $idmodelo = null;
                    if ($ultimonivel == $nivel) {
                        if ($array_mods['deno' . strtoupper($row_act->plan)] != null) {
                            $idmodelo = $array_mods['deno' . strtoupper($row_act->plan)];
                        } elseif ($row_act->plan != null && $row_act->plan != "No definido" && $row_act->plan != "-") {
                            $row_act->iddatosnomenclador = $array_ests_uri['plannoexiste'];
                            $result = -1;
                            continue;
                        }
                    }
//datos validos
                    if ($esadd) {
                        $array_coll_actvs[$ptr]->idaprobacion = 1;
                        $array_coll_actvs[$ptr]->normada = 0;
                        $array_coll_actvs[$ptr]->idespecialidad = $idespecialidad;
                        $array_coll_actvs[$ptr]->codigo = $codigo;
                        $array_coll_actvs[$ptr]->denominacion = $denominacion;
                        $array_coll_actvs[$ptr]->idespecialidadrector = $idespecialidad;
                        $array_coll_actvs[$ptr]->idaprobacion = $idaprobacion;
                        $array_coll_actvs[$ptr]->estado = $estado;
                        $array_coll_actvs[$ptr]->idarbol = $arry_idarb_idp[0];
                        $array_coll_actvs[$ptr]->idpadre = $arry_idarb_idp[1];
                        $array_coll_actvs[$ptr]->idformato = $idformato;
                        $array_coll_actvs[$ptr]->descripcion = '-';
                        $array_coll_actvs[$ptr]->nivel = $nivel;

                        $row_act->codigo = $codigo;

                        if ($nivel == 4) {
                            if ($idmodelo != null) {
                                $array_paralelo_paracoll_actvs[$ptr]['idmodelo'] = $idmodelo;
                            }
                        }
                        $ptr++;
                        $row_act->iddatosnomenclador = $array_ests_uri['oklisto']; //312;
                    } else {
                        $row_act->iddatosnomenclador = $array_ests_uri['ok']; //312;
                    }
                    $ultimo_codigo = $codigo;
                }
                if ($esadd) {
                    $array_coll_actvs->save();
                }


                foreach ($array_coll_actvs as $ind_ => $row_act) {
                    if ($array_paralelo_paracoll_actvs[$ind_]['idmodelo'] != null) {
//validacion
                        if ($ultimonivel == $row_act->nivel) {
                            $array_objs_modelos = new Doctrine_Collection(Doctrine:: getTable("DatActividadmodelo"));
                            $array_objs_modelos[0]->idactividad = $row_act->idactividad;
                            $array_objs_modelos[0]->idmodelo = $array_paralelo_paracoll_actvs[$ind_]['idmodelo'];
                            $array_coll_actvs[$ind_]->DatActividadmodelo = $array_objs_modelos;
                        }
                    }
                }
                if ($esadd) {
                    $array_coll_actvs->save();
                }
                $array_actvs->save();
            }
        }
        if (!$exist_elem) {
            return 'vacio';
        }
    }

//importar actividad
    private function verificarCodActv($codActividad, $codesp) {

        $subcod = substr($codActividad, 0, strlen($codesp));
        if ((strlen($subcod) == strlen($codesp)) && ($subcod == $codesp)) {
            return null;
        }
        return true;
    }

    private function definirPadreActv($codhijo, $nivel, $long_inicialxnivelx_esp) {
        if ($nivel > 1) {
            $codpadre = substr($codhijo, 0, $long_inicialxnivelx_esp);

            $objpadre = NomActividad::obtActPorCod($codpadre);
            $idpadre = $objpadre->idactividad;
            $idarbol = $objpadre->idarbol;
            if ($idpadre && $idarbol) {
                return array($idarbol, $idpadre);
            }
            return 'noexiste';
        }
        return array(null, null);
    }

    public function replaceValue($idconcepto, $campo, $nuevovalor, $array_filtros) {
        $temptable = $this->obtenerTablaTemporalDadoIdConcepto($idconcepto);
        $idesplogueada = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
        $conn = Doctrine_Manager::connection();
        foreach ($array_filtros as $k => $valor) {
            unset($array_filtros[$k]);
            $array_filtros[$k]['field'] = $valor->field;
            $array_filtros[$k]['data']['comparison'] = $valor->data->comparison;
            $array_filtros[$k]['data']['type'] = $valor->data->type;
            $array_filtros[$k]['data']['value'] = $valor->data->value;
        }
        $where = DatImportarModel::SqlFiltros($temptable, $array_filtros);

        try {
            $query = Doctrine_Query::create();
            if ($idconcepto == 2) {
                if ($where != '') {
                    $where = "AND " . $where;
                }
                $query->update($temptable)->set($campo, "?")->where(
                        " idespecialidad = ? {$where}", array($nuevovalor, $idesplogueada)
                );
            } else {
                $query->update($temptable)->set($campo, "?", array($nuevovalor));
                if ($where != '') {
                    $query->where("{$where}");
                }
            }
            $res = $query->execute();
        } catch (Doctrine_Exception $e) {
            if ($e->getCode() == '22') { //intenta insertar valor string en campo numerico
                return 2;
            } else {
                echo "<pre>";
                /* print_r($e);
                  die; */
            }
        }
        return ($res > 0) ? 1 : 2;
    }

    public function getEstadosFilas($idconcepto) {
        $idesp_logueada = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
        $conc = Doctrine::getTable('NomConceptoimportar')->find($idconcepto);
        $tabla = $conc->DatConfiguracionimportar->tablatemporal;
        $query = new Doctrine_Query ();
        $query->select('DISTINCT dn.iddatosnomenclador, dn.denominacion, dn.uridatosnomenclador')
                ->from('NomDatosnomenclador dn')
                ->innerJoin('dn.NomTiponomenclador tn')
                ->innerJoin('dn.' . $tabla . ' tempx')
                ->addWhere('tempx.idespecialidad = ?');
        $conn = Doctrine_Manager::connection();
        $array_errors = $conn->execute($query->getSqlQuery(), array($idesp_logueada))->fetchAll(PDO::FETCH_CLASS);
        foreach ($array_errors as $indice => $valor) {
            unset($array_errors[$indice]);
            $array_errors[$indice]['iddatosnomenclador'] = $valor->n__iddatosnomenclador;
            $array_errors[$indice]['denominacion'] = $valor->n__denominacion;
            $array_errors[$indice]['uridatosnomenclador'] = $valor->n__uridatosnomenclador;
        }
        return $array_errors;
    }

    public function EliminarDatosTablaTempNivelesa() {

        $conn = Doctrine_Manager::connection();
        $sql = " DELETE FROM mod_planifimportacion.temp_insnivelesa";
        $resp = $conn->execute($sql);
    }

    public function EliminarDatosTablaplan() {

        $conn = Doctrine_Manager::connection();
        $sql = " DELETE FROM mod_planifimportacion.temp_insindicadorplan";
        $resp = $conn->execute($sql);
    }

    public function comprobarEInsertardatos($params) {
//Capturo una instancia de Doctrine_Manager para manejar la conexion
        $dm = Doctrine_Manager::getInstance();
//Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();

        if ($params['inversion'] != null && $params['inversion'] != '') {
            $iddatotipo = self::obtenerIddatoNom('Tipo de Inversión', $params['tipo']); //print_r(1);
            if ($iddatotipo != null) {
                $iddatoprograma = self::obtenerIddatoNom('Programa', $params['programa']); //print_r(2);
                if ($iddatoprograma != null) {
                    $iddatoobjetivo = self::obtenerIddatoNom('Objetivo', $params['objetivo']); //print_r(3);
                    if ($iddatoobjetivo != null) {
                        $iddatoefecto = self::obtenerIddatoNom('Efecto en COMEX', $params['efecto']); //print_r(4);
                        if ($iddatoefecto != null) {
                            $iddatocaracteristica = self::obtenerIddatoNom('caracteristica', $params['caracteristica']); //print_r(5);
                            if ($iddatocaracteristica != null) {
                                $iddatoformapropiedad = self::obtenerIddatoNom('Forma de propiedad', $params['formapropiedad']); //print_r(6);
                                if ($iddatoformapropiedad != null) {
                                    $iddatodesempenno = self::obtenerIddatoNom('Desempeño', $params['desempenno']); //print_r(7);
                                    if ($iddatodesempenno != null) {
//if (is_int($params['analisis'])) {
                                        $iddatoclasificacion = self::obtenerIdTipoInversion($params['clasificacion']); //print_r(8);
                                        if ($iddatoclasificacion != null) {
                                            if ($params['fast']) {
                                                if ($params['fast'] == 'si')
                                                    $params['fast'] = 1;
                                                else
                                                if ($params['fast'] == 'no')
                                                    $params['fast'] = 0;;
                                                $entidades = self::obtenerIdEntidad($params['entidad']); //print_r(9);
                                                $identidad = $entidades[0]['idestructura'];
                                                $idespecialidad = $entidades[0]['idespecialidad'];
                                                $codigoEntidad = $entidades[0]['codigo'];
                                                if ($identidad != null) {
                                                    $idprov = self::obtenerIdProvincia($params['provincia']); //print_r(10);
                                                    if ($idprov != null) {
                                                        $fechai = self::obtenerFecha($params['fechai'], true); //print_r(11);
                                                        if ($fechai != null) {
                                                            $fechaf = self::obtenerFecha($params['fechaf'], false); //print_r(12);
                                                            if ($fechaf != null) {
                                                                $fechaf = self::obtenerFecha($params['fechaf'], false); //print_r(13);

                                                                $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
                                                                $objtemp = new InversionesModel();
                                                                $codinv = $objtemp->getCodigoInversion($idejercicio[0]['ejercicio'], $identidad, $idejercicio[0]['idejercicio']);
                                                                $obj = new DatInversion();
                                                                $obj->idtipoinversion = $iddatoclasificacion[0][0];
                                                                $obj->idestructuracomun = $identidad;
                                                                $obj->idejercicio = $idejercicio[0]['idejercicio'];
                                                                $obj->fechainicio = $fechai;
                                                                $obj->fechafin = $fechaf;
                                                                $obj->idtipoinversionprograma = $iddatotipo;
                                                                $obj->idformapropiedad = $iddatoformapropiedad;
                                                                $obj->idcaracteristica = $iddatocaracteristica;
                                                                $obj->idobjetivo = $iddatoobjetivo;
                                                                $obj->fasttrack = $params['fast'];
                                                                $obj->idestadoinversion = 2;
                                                                $obj->denominacion = $params['inversion'];
                                                                $obj->codigo = $codinv;
                                                                $obj->idefectocomercial = $iddatoefecto;
                                                                $obj->idestadoaprobacion = 2;
                                                                $obj->idprovincia = $idprov[0][0];
                                                                $obj->idcumplimientoinversion = 0;
                                                                $obj->observaciones = $params['observacion'];
                                                                $obj->analpostinversiones = $params['analisis'];
                                                                $obj->iddatdesempenno = $iddatodesempenno;
                                                                $obj->idprograma = $iddatoprograma;
                                                                $obj->cuadrada = 0;
                                                                $obj->save();
//Ejecuto la transaccion de doctrine para poder insertar el meta correspondiente a la tupla
                                                                $con->commit();
//Habro una nueva transaccion de doctrine para la proxima ejecucion
                                                                $con->beginTransaction();

                                                                self::insertarcomponenteInversion($iddatoclasificacion[0][0], $obj->idinversion);
                                                                self::insertarelementoInversion($obj->idinversion);

                                                                return true;
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
//}
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    public function comprobarEInsertardatosEquipo($params) {
        $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $entidades = self::obtenerIdEntidad($params['denentidad']);
        $identidad = $entidades[0]['idestructura'];
        if ($identidad != null) {
            $inversion = self::obtenerIdinversionDadoDenom($identidad, $params['deninversion'], $idejercicio[0]['idejercicio']);
            $idinversion = $inversion[0]['idinversion'];
            if ($idinversion != null) {
                $equipoequipo = self::obtenerIdComponenteEquipo($idinversion);
                $idequipoequipo = $equipoequipo[0]['idetapa'];
                if ($idequipoequipo != null) {
                    $EtapaEquipoInversion = self::obtenerIdEtapaEquipoInversion($idinversion, $idequipoequipo);
                    $idEtapaEquipoInversion = $EtapaEquipoInversion[0]['idetapainversion'];
                    if ($idEtapaEquipoInversion != null) {
                        $equipoind = self::obtenerDatosEquipoDadoDenom($params['denequipo']);
                        if ($equipoind != null) {
                            $denmodelo = 'Plan de reposición';
                            $modeloreposicion = self::obtenerIdModeloDadoDenom($denmodelo, $identidad);
                            $idmodeloreposicion = $modeloreposicion[0]['identidadmodelo'];
                            $denmodelo = 'Plan de incremento';
                            $modeloincremento = self::obtenerIdModeloDadoDenom($denmodelo, $identidad);
                            $idmodeloincremento = $modeloincremento[0]['identidadmodelo'];
                            if ($idmodeloincremento != null && $idmodeloreposicion != null) {
                                $adq = self::obtenerIddatoNom('Adquisición', $params['adquirir']);
                                if ($adq != null) {
                                    $comp = self::obtenerIddatoNom('Compra', $params['comprar']);
                                    if ($comp != null) {
                                        if ($params['cantincremento'] != 0) {
                                            $obj = new DatEtapaEquipo();
                                            $obj->idindicador = $equipoind[0]['idindicador'];
                                            $obj->identidadmodelo = $idmodeloincremento;
                                            $obj->idejercicio = $idejercicio[0]['idejercicio'];
                                            $obj->precio = $equipoind[0]['precio'];
                                            $obj->idunidadmedida = $equipoind[0]['idumedida'];
                                            $obj->idcentrobalance = $equipoind[0]['identidaddatosnomenclador'];
                                            $obj->cantidad = $params['cantincremento'];
                                            $obj->importe = $params['cantincremento'] * $equipoind[0]['precio'];
                                            $obj->preciodivisa = $equipoind[0]['preciodivisa'];
                                            $obj->importedivisa = $params['cantincremento'] * $equipoind[0]['preciodivisa'];
                                            $obj->idetapainversion = $idEtapaEquipoInversion;
                                            $obj->observaciones = "";
                                            $obj->idadquisicion = $adq;
                                            $obj->idcomprar = $comp;
                                            $obj->save();
                                        }
                                        if ($params['cantreposicion'] != 0) {
                                            $obj1 = new DatEtapaEquipo();
                                            $obj1->idindicador = $equipoind[0]['idindicador'];
                                            $obj1->identidadmodelo = $idmodeloreposicion;
                                            $obj1->idejercicio = $idejercicio[0]['idejercicio'];
                                            $obj1->precio = $equipoind[0]['precio'];
                                            $obj1->idunidadmedida = $equipoind[0]['idumedida'];
                                            $obj1->idcentrobalance = $equipoind[0]['identidaddatosnomenclador'];
                                            $obj1->cantidad = $params['cantreposicion'];
                                            $obj1->importe = $params['cantreposicion'] * $equipoind[0]['precio'];
                                            $obj1->preciodivisa = $equipoind[0]['preciodivisa'];
                                            $obj1->importedivisa = $params['cantreposicion'] * $equipoind[0]['preciodivisa'];
                                            $obj1->idetapainversion = $idEtapaEquipoInversion;
                                            $obj1->observaciones = "";
                                            $obj1->idadquisicion = $adq;
                                            $obj1->idcomprar = $comp;
                                            $obj1->save();
                                        }
                                        if ($params['cantincremento'] != 0 || $params['cantreposicion'] != 0)
                                            return true;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    public function comprobarEInsertardatosConstructor($params) {
        $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $entidades = self::obtenerIdEntidad($params['denentidad']);
        $identidad = $entidades[0]['idestructura'];
        if ($identidad != null) {//print_r(1);
            $inversion = self::obtenerIdinversionDadoDenom($identidad, $params['deninversion'], $idejercicio[0]['idejercicio']);
            $idinversion = $inversion[0]['idinversion'];
            if ($idinversion != null) {//print_r(2);
                $constructorconstructor = self::obtenerIdConstructor();
                $idconstructorconstructor = $constructorconstructor[0]['idetapa'];
                if ($idconstructorconstructor != null) {//print_r(3);
                    $EtapaEquipoInversion = self::obtenerIdEtapaEquipoInversion($idinversion, $idconstructorconstructor);
                    $idEtapaEquipoInversion = $EtapaEquipoInversion[0]['idetapainversion'];
                    if ($idEtapaEquipoInversion != null) {//print_r(4);
                        $idconstructor = self::obtenerIddatoNom('Constructor', $params['constructor']);
                        if ($idconstructor != null) {//print_r(5);
                            $idprov = self::obtenerIdProvincia($params['provincia']);
                            if ($idprov != null) {//print_r(6);
                                $obj = new DatEtapainverconsprov();
                                $obj->idetapainversion = $idEtapaEquipoInversion;
                                $obj->iddpt = $idprov[0][0];
                                $obj->idconstructor = $idconstructor;
                                $obj->save();
                                return true;
                            }
                        }
                    }
                }
            }
        }
        return false;
    }

    public function comprobarEInsertartipodatos($params) {
        $respuesta = false;
        $idejercicio = NomEjercicioplanificacion::listarEjercicioActual();
        $entidades = self::obtenerIdEntidad($params['denentidad']);
        $identidad = $entidades[0]['idestructura']; //print_r($params);die;
        if ($identidad != null) {
            $inversion = self::obtenerIdinversionDadoDenom($identidad, $params['deninversion'], $idejercicio[0]['idejercicio']);
            $idinversion = $inversion[0]['idinversion'];
            if ($idinversion != null) {
                $datostipo = self::obtenerDatosTipoDadoDato($params['tipodato']); //print_r($datostipo);die;
                if ($datostipo[0]['tipo'] == 'PLAN DE PREPARACION') {
                    $entidadmonedaUSD = self::obtenerEntidadMoneda($identidad, 'USD');
                    $identidadmonedaUSD = $entidadmonedaUSD[0]['idmonedaentidad'];
                    if ($identidadmonedaUSD != null) {
                        if ($params['usd'] != 0) {
                            $obj = new DatPresanteproy();
                            $obj->idinversion = $idinversion;
                            $obj->idmonedaentidad = $identidadmonedaUSD;
                            $obj->valor = $params['usd'];
                            $obj->save();
                            $respuesta = true;
                        }
                    }
                    $entidadmonedaCUP = self::obtenerEntidadMoneda($identidad, 'CUP');
                    $identidadmonedaCUP = $entidadmonedaCUP[0]['idmonedaentidad'];
                    if ($identidadmonedaCUP != null) {
                        if ($params['cup'] != 0) {
                            $obj = new DatPresanteproy();
                            $obj->idinversion = $idinversion;
                            $obj->idmonedaentidad = $identidadmonedaCUP;
                            $obj->valor = $params['cup'];
                            $obj->save();
                            $respuesta = true;
                        }
                    }
                } else if ($datostipo[0]['tipo'] == 'COMPONENTE') {//print_r($params);die;
                    if ($params['usd'] != 0) {
                        $idelementovalor = self::existevalorelementos('USD', $identidad, $idinversion, $params['tipodato']);
                        if ($idelementovalor[0][0] != null) {
                            self::actualizarvalorelementos($idelementovalor[0][0], $params['usd']);
                            $respuesta = true;
                        } else {
                            self::insertarvalorelementos('USD', $identidad, $params['usd'], $idinversion, $params['tipodato']);
                            $respuesta = true;
                        }

                        $idetapainversion = self::obteneretapainversion($idinversion, $params['tipodato']);
                        $idmoneda = self::obteneridmoneda('USD');
                        $idplaninversetapaplan = self::obteneridplaninversetapaplan($idmoneda[0][0], $idejercicio[0]['idejercicio'], $idetapainversion[0][0]);
                        if ($idplaninversetapaplan[0][0] != null) {
                            self::actualizarpresupuestoplan($idplaninversetapaplan[0][0], $params['usd']);
                            $respuesta = true;
                        } else {
                            self::insertarpresupuestoplan($idmoneda[0][0], $params['usd'], $idejercicio[0]['idejercicio'], $idetapainversion[0][0]);
                            $respuesta = true;
                        }
                    }


                    if ($params['cup'] != 0) {
                        $idelementovalor = self::existevalorelementos('CUP', $identidad, $idinversion, $params['tipodato']);
                        if ($idelementovalor[0][0] != null) {
                            self::actualizarvalorelementos($idelementovalor[0][0], $params['cup']);
                            $respuesta = true;
                        } else {
                            self::insertarvalorelementos('CUP', $identidad, $params['cup'], $idinversion, $params['tipodato']);
                            $respuesta = true;
                        }
                        $idetapainversion = self::obteneretapainversion($idinversion, $params['tipodato']);
                        $idmoneda = self::obteneridmoneda('CUP');
                        $idplaninversetapaplan = self::obteneridplaninversetapaplan($idmoneda[0][0], $idejercicio[0]['idejercicio'], $idetapainversion[0][0]);
                        if ($idplaninversetapaplan[0][0] != null) {
                            self::actualizarpresupuestoplan($idplaninversetapaplan[0][0], $params['cup']);
                            $respuesta = true;
                        } else {
                            self::insertarpresupuestoplan($idmoneda[0][0], $params['cup'], $idejercicio[0]['idejercicio'], $idetapainversion[0][0]);
                            $respuesta = true;
                        }
                    }

                    if ($params['constructor'] != null) {
                        $idplaninversetapaplan = self::obteneridplaninversetapaplan($idmoneda[0][0], $idejercicio[0]['idejercicio'], $idetapainversion[0][0]);
//print_r($idplaninversetapaplan);die;
                        if ($idplaninversetapaplan[0][0] != null) {
                            if ($params['cup'] != 0) {
                                $idconstructor = self::obteneridconstructorprov($params['constructor']);
                                $idprov = self::obtenerIdProvincia($params['provincia']);
                                $idmoneda = self::obteneridmoneda('CUP');
//print_r($idconstructor);die;
                                $idetapinverconsprov = self::obteneridetapinverconsprov($idetapainversion[0][0], $idprov[0][0], $idconstructor[0][0]);
//print_r($idetapinverconsprov);die;
                                $idetapinverconsprovplan = self::obteneridetapinverconsprovplan($idetapinverconsprov[0][0], $idmoneda[0][0], $idejercicio[0]['idejercicio']);
                                if ($idetapinverconsprovplan[0][0] != null) {
                                    self::actualizarpresupuestoconstructorplan($idetapinverconsprovplan[0][0], $params['cup']);
                                    $respuesta = true;
                                } else {
                                    self::insertarpresupuestoconstructorplan($idmoneda[0][0], $params['cup'], $idejercicio[0]['idejercicio'], $idetapinverconsprov[0][0]);
                                    $respuesta = true;
                                }
                            }
                            if ($params['usd'] != 0) {
                                $idconstructor = self::obteneridconstructorprov($params['constructor']);
                                $idprov = self::obtenerIdProvincia($params['provincia']);
                                $idmoneda = self::obteneridmoneda('USD');
                                $idetapinverconsprov = self::obteneridetapinverconsprov($idetapainversion[0][0], $idprov[0][0], $idconstructor[0][0]);
                                $idetapinverconsprovplan = self::obteneridetapinverconsprovplan($idetapinverconsprov[0][0], $idmoneda[0][0], $idejercicio[0]['idejercicio']);

                                if ($idetapinverconsprovplan[0][0] != null) {
                                    self::actualizarpresupuestoconstructorplan($idetapinverconsprovplan[0][0], $params['usd']);
                                    $respuesta = true;
                                } else {
                                    self::insertarpresupuestoconstructorplan($idmoneda[0][0], $params['usd'], $idejercicio[0]['idejercicio'], $idetapinverconsprov[0][0]);
                                    $respuesta = true;
                                }
                            }
                        }
                    }
                } else if ($datostipo[0]['tipo'] == 'Quien Financia' || $datostipo[0]['tipo'] == 'Como se financia') {

                    if ($params['tipodato'] == 'CREDITO') {
                        $idfinancista = self::obteneridfinancista($params['tipodato']);
                        $idtipofinanciamiento = self::obteneridtipofinanciamiento($params['acreedor']);

                        if ($params['cup'] != 0) {
                            $idmonedaentidad = self::obtenerEntidadMoneda($identidad, 'CUP');

                            $idfinanciamiento = self::obteneridfinanciamiento($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0]);
                            if ($idfinanciamiento[0][0] != NULL) {
                                self::actualizarfinanciamientoinversion($idfinanciamiento[0][0], $params['cup'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            } else {
                                self::insertarfinanciamientoinversion($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0], $params['cup'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            }

                            $idinversfinancplan = self::obteneridinversfinancplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idtipofinanciamiento[0][0], $idinversion);

                            if ($idinversfinancplan[0][0] != NULL) {
                                self::actualizarinversfinancplan($idinversfinancplan[0][0], $params['cup']);
                                $respuesta = true;
                            } else {
                                self::insertarinversfinancplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idinversion, $idtipofinanciamiento[0][0], $params['cup']);
                                $respuesta = true;
                            }
                        }
                        if ($params['usd'] != 0) {
                            $idmonedaentidad = self::obtenerEntidadMoneda($identidad, 'USD');

                            $idfinanciamiento = self::obteneridfinanciamiento($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0]);
                            if ($idfinanciamiento[0][0] != NULL) {
                                self::actualizarfinanciamientoinversion($idfinanciamiento[0][0], $params['usd'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            } else {
                                self::insertarfinanciamientoinversion($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0], $params['usd'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            }

                            $idinversfinancplan = self::obteneridinversfinancplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idtipofinanciamiento[0][0], $idinversion);
                            if ($idinversfinancplan[0][0] != NULL) {
                                self::actualizarinversfinancplan($idinversfinancplan[0][0], $params['usd']);
                                $respuesta = true;
                            } else {
                                self::insertarinversfinancplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idinversion, $idtipofinanciamiento[0][0], $params['usd']);
                                $respuesta = true;
                            }
                        }
                    } else if ($datostipo[0]['tipo'] == 'Como se financia') {//print_r($params['tipodato']);die;
                        $idfinancista = self::obteneridfinancista('CONTADO');
                        $idtipofinanciamiento = self::obteneridtipofinanciamiento($params['tipodato']); //print_r($idtipofinanciamiento);die;
                        if ($params['cup'] != 0) {
                            $idmonedaentidad = self::obtenerEntidadMoneda($identidad, 'CUP');

                            $idfinanciamiento = self::obteneridfinanciamiento($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0]);
                            if ($idfinanciamiento[0][0] != NULL) {
                                self::actualizarfinanciamientoinversion($idfinanciamiento[0][0], $params['cup'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            } else {
                                self::insertarfinanciamientoinversion($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0], $params['cup'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            }

                            $idinverscontadoplan = self::obteneridinverscontadoplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idinversion);
                            if ($idinverscontadoplan[0][0] != NULL) {
                                self::actualizarcontadoplan($idinverscontadoplan[0][0], $params['cup']);
                                $respuesta = true;
                            } else {
                                self::insertarinverscontadoplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idinversion, $params['cup']);
                                $respuesta = true;
                            }
                        }
                        if ($params['usd'] != 0) {
                            $idmonedaentidad = self::obtenerEntidadMoneda($identidad, 'USD');

                            $idfinanciamiento = self::obteneridfinanciamiento($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0]);
                            if ($idfinanciamiento[0][0] != NULL) {
                                self::actualizarfinanciamientoinversion($idfinanciamiento[0][0], $params['usd'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            } else {
                                self::insertarfinanciamientoinversion($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0], $params['usd'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            }

                            $idinverscontadoplan = self::obteneridinverscontadoplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idinversion);
                            if ($idinverscontadoplan[0][0] != NULL) {
                                self::actualizarcontadoplan($idinverscontadoplan[0][0], $params['usd']);
                                $respuesta = true;
                            } else {
                                self::insertarinverscontadoplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idinversion, $params['usd']);
                                $respuesta = true;
                            }
                        }
                    } else if ($datostipo[0]['tipo'] == 'Quien Financia') {//print_r($params['tipodato']);die;
                        $idfinancista = self::obteneridfinancista($params['tipodato']);
                        $idtipofinanciamiento = self::obteneridtipofinanciamiento('CONTADO'); //print_r($idtipofinanciamiento);die;
                        if ($params['cup'] != 0) {
                            $idmonedaentidad = self::obtenerEntidadMoneda($identidad, 'CUP');

                            $idfinanciamiento = self::obteneridfinanciamiento($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0]);
                            if ($idfinanciamiento[0][0] != NULL) {
                                self::actualizarfinanciamientoinversion($idfinanciamiento[0][0], $params['cup'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            } else {
                                self::insertarfinanciamientoinversion($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0], $params['cup'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            }

                            $idinverscontadoplan = self::obteneridinverscontadoplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idinversion);
                            if ($idinverscontadoplan[0][0] != NULL) {
                                self::actualizarcontadoplan($idinverscontadoplan[0][0], $params['cup']);
                                $respuesta = true;
                            } else {
                                self::insertarinverscontadoplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idinversion, $params['cup']);
                                $respuesta = true;
                            }
                        }
                        if ($params['usd'] != 0) {
                            $idmonedaentidad = self::obtenerEntidadMoneda($identidad, 'USD');

                            $idfinanciamiento = self::obteneridfinanciamiento($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0]);
                            if ($idfinanciamiento[0][0] != NULL) {
                                self::actualizarfinanciamientoinversion($idfinanciamiento[0][0], $params['usd'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            } else {
                                self::insertarfinanciamientoinversion($idinversion, $idtipofinanciamiento[0][0], $idfinancista[0][0], $idmonedaentidad[0][0], $params['usd'], $params['interes'], $params['plazo'], 0);
                                $respuesta = true;
                            }

                            $idinverscontadoplan = self::obteneridinverscontadoplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idinversion);
                            if ($idinverscontadoplan[0][0] != NULL) {
                                self::actualizarcontadoplan($idinverscontadoplan[0][0], $params['usd']);
                                $respuesta = true;
                            } else {
                                self::insertarinverscontadoplan($idmonedaentidad[0][0], $idejercicio[0]['idejercicio'], $idinversion, $params['usd']);
                                $respuesta = true;
                            }
                        }
                    }
                }
            }
        }
        return $respuesta;
    }

    public function insertarinversfinancplan($idmonedaentidad, $idejercicio, $idinversion, $idinversfinancplan, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "INSERT INTO
  mod_planifinversiones.dat_inversfinancplan
(
  idmonedaentidad,
  idejercicio,
  idtipofinanciamiento,
  valor,
  idinversion
)
VALUES (
 $idmonedaentidad,
  $idejercicio,
  $idinversfinancplan,
  $valor,
  $idinversion
);";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function insertarinverscontadoplan($idmonedaentidad, $idejercicio, $idinversion, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "INSERT INTO
  mod_planifinversiones.dat_inverscontadoplan
(
  idmonedaentidad,
  idejercicio,
  valor,
  idinversion
)
VALUES (
  $idmonedaentidad,
  $idejercicio,
  $valor,
  $idinversion
);";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function actualizarinversfinancplan($idinversfinancplan, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "UPDATE
  mod_planifinversiones.dat_inversfinancplan
SET

  valor = $valor
WHERE
  idinversfinancplan = $idinversfinancplan
;";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function actualizarcontadoplan($idinverscontadoplan, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "UPDATE
  mod_planifinversiones.dat_inverscontadoplan
SET
  valor = valor + $valor
WHERE
  idinverscontadoplan = $idinverscontadoplan
;";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obteneridinversfinancplan($idmonedaentidad, $idejercicio, $idtipofinanciamiento, $idinversion) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  idinversfinancplan
FROM
  mod_planifinversiones.dat_inversfinancplan
  where idmonedaentidad = $idmonedaentidad
  and idejercicio = $idejercicio
  and idtipofinanciamiento = $idtipofinanciamiento
  and idinversion = $idinversion;";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obteneridinverscontadoplan($idmonedaentidad, $idejercicio, $idinversion) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  idinverscontadoplan
FROM
  mod_planifinversiones.dat_inverscontadoplan
  where idmonedaentidad = $idmonedaentidad
 and idejercicio = $idejercicio and
  idinversion = $idinversion;";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function insertarfinanciamientoinversion($idinversion, $idtipofinanciamiento, $idfinancista, $idmonedaentidad, $valor, $interes, $plazo, $gracia) {
        $con = Doctrine_Manager::connection();
        $query = "INSERT INTO
  mod_planifinversiones.dat_financiamiento
(
  idinversion,
  idtipofinanciamiento,
  idfinancista,
  idmonedaentidad,
  valor,
  porcientointeres,
  plazoamortizacion,
  gracia
)
VALUES (
  $idinversion,
  $idtipofinanciamiento,
  $idfinancista,
  $idmonedaentidad,
  $valor,
  $interes,
  $plazo,
  $gracia
);";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function actualizarfinanciamientoinversion($idfinanciamiento, $valor, $interes, $plazo, $gracia) {
        $con = Doctrine_Manager::connection();
        $query = "UPDATE
  mod_planifinversiones.dat_financiamiento
SET
 valor = $valor,
  porcientointeres = $interes,
  plazoamortizacion = $plazo,
  gracia = $gracia

WHERE
  idfinanciamiento = $idfinanciamiento
; ";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function actualizarvalorelementos($idelementovalor, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "UPDATE
  mod_planifinversiones.dat_elementovalor
SET
  valor = valor + $valor
 WHERE
  idelementovalor = $idelementovalor; ";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obteneridmoneda($moneda) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  m.idmoneda
FROM
  mod_datosmaestros.nom_moneda m
WHERE
  m.codigoiso = '$moneda'";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obteneridfinanciamiento($idinversion, $idtipofinanciamiento, $idfinancista, $idmonedaentidad) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  idfinanciamiento
FROM
  mod_planifinversiones.dat_financiamiento
  where idinversion = $idinversion
  and idtipofinanciamiento = $idtipofinanciamiento
  and idfinancista = $idfinancista
  and idmonedaentidad = $idmonedaentidad;";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obteneridconstructorprov($constructor) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  dc.idconstructor
FROM
  mod_planifinversiones.dat_constructor dc
  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (dc.iddatosnomenclador = dn.iddatosnomenclador)
  where dn.denominacion = '$constructor'; ";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerC($quien) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT df.idconstructor
                    FROM  mod_planifinversiones.dat_constructor df
                      INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (df.iddatosnomenclador = dn.iddatosnomenclador)
                      where dn.denominacion = '$quien' ";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obteneridfinancista($quien) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  df.idfinancista,
  dn.denominacion
FROM
  mod_planifinversiones.dat_financista df
  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (df.iddatosnomenclador = dn.iddatosnomenclador)
  where dn.denominacion = '$quien' ";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obteneridtipofinanciamiento($como) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  df.idtipofinanciamiento,
  dn.denominacion
FROM
  mod_planifinversiones.dat_tipofinanciamiento df
  INNER JOIN mod_planificacion.nom_datosnomenclador dn ON (df.iddatosnomenclador = dn.iddatosnomenclador)
  where dn.denominacion = '$como' "; //print_r($query);die;
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obteneridetapinverconsprov($idetapainversion, $iddpt, $idconstructor) {//print_r($iddpt);die;
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  idetapinverconsprov

FROM
  mod_planifinversiones.dat_etapinverconsprov
  where
  idetapainversion = $idetapainversion
  and iddpt = $iddpt
  and idconstructor = $idconstructor ; ";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obteneridetapinverconsprovplan($idetapinverconsprov, $idmoneda, $idejercicio) {//print_r($idetapinverconsprov);die;
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  idetapinverconsprovplan
FROM
  mod_planifinversiones.dat_etapinverconsprovplan
  where
  idmoneda = $idmoneda
and  idejercicio = $idejercicio
and  idetapinverconsprov = $idetapinverconsprov; ";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obteneridplaninversetapaplan($idmoneda, $idejercicio, $idetapainversion) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  idplaninversetapaplan
FROM
  mod_planifinversiones.dat_inversetapaplan
  where
  idmoneda = $idmoneda
  and idejercicio = $idejercicio
  and idetapainversion = $idetapainversion; ";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obteneretapainversion($idinversion, $dato) {

        $con = Doctrine_Manager::connection();
        $query = "SELECT ei.idetapainversion,et.idetapa
  FROM mod_planifinversiones.dat_etapainversion ei
 INNER JOIN mod_planifinversiones.dat_etapa et ON (ei.idetapa = et.idetapa)
 INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa = ne.idnombreetapa)
 WHERE ei.idinversion = $idinversion AND ne.denominacion = '$dato'";
        //print_r($query);die;
        $res = $con->fetchAssoc($query);

        return $res;
    }

    public function obtenerEtapaInvConstProvDadoEtapaInv($idetainversion, $idprov, $idcons) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT eticp.idetapainversion
FROM mod_planifinversiones.dat_etapinverconsprov eticp
WHERE eticp.idetapainversion = $idetainversion AND eticp.iddpt = $idprov AND eticp.idconstructor = $idcons";

        $res = $con->fetchAssoc($query);

        return $res;
    }

    public function obtenerEtapaInversionDadoIdEtapa($idinversion, $idetapa) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT ei.idetapainversion,et.idetapa
  FROM mod_planifinversiones.dat_etapainversion ei
 INNER JOIN mod_planifinversiones.dat_etapa et ON (ei.idetapa = et.idetapa)
 INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa = ne.idnombreetapa)
 WHERE ei.idinversion = $idinversion AND et.idetapa = $idetapa";
        $res = $con->fetchAssoc($query);
        return $res;
    }

    public function obteneretapaEleminversion($idinversion, $dato) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
ei.idetapainversion,et.idetapa,eei.idetapaelementoinversion
FROM mod_planifinversiones.dat_etapainversion ei
 INNER JOIN mod_planifinversiones.dat_etapa et ON (ei.idetapa = et.idetapa)
 INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa = ne.idnombreetapa)
  INNER JOIN mod_planifinversiones.dat_etapaelementoinversion eei ON (eei.idetapainversion = ei.idetapainversion)
 WHERE ei.idinversion = $idinversion AND ne.denominacion = '$dato'";
        //pre_r($query);die;
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function obtenerElemvalor($ideteleminv) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT elemval.idelemento
FROM mod_planifinversiones.dat_elementovalor elemval
  WHERE elemval.idelemento = $ideteleminv;";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function obtenerFinamDadoInver($idinversion) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT finam.idinversion
FROM mod_planifinversiones.dat_financiamiento finam
WHERE finam.idinversion = $idinversion";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function existevalorelementos($moneda, $identidad, $idinversion, $dato) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
idelementovalor
FROM
  mod_planifinversiones.dat_elementovalor
WHERE
  idelemento = (SELECT MIN(eei.idetapaelementoinversion)
FROM
  mod_planifinversiones.dat_etapainversion ei
 INNER JOIN mod_planifinversiones.dat_etapa et ON (ei.idetapa = et.idetapa)
  INNER JOIN mod_planifinversiones.dat_elemento el ON (et.idetapa = el.idetapa)
  INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa = ne.idnombreetapa)
  INNER JOIN mod_planifinversiones.dat_etapaelementoinversion eei on (eei.idetapainversion = ei.idetapainversion )
WHERE
  ei.idinversion = $idinversion
  and el.denominacion =  ne.denominacion
  and ne.denominacion = '$dato'
)
  AND idmonedaentidad = (SELECT
  me.idmonedaentidad
FROM
  mod_datosmaestros.nom_moneda m
  INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (m.idmoneda = me.idmoneda)
WHERE
  m.codigoiso = '$moneda' AND
  me.idestructuracomun = $identidad) ";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function insertarpresupuestoplan($moneda, $valor, $idejercicio, $idetapainversion) {
        $con = Doctrine_Manager::connection();
        $query = "INSERT INTO
  mod_planifinversiones.dat_inversetapaplan
(
   idmoneda,
  idejercicio,
  idetapainversion,
  valor
)
VALUES (
$moneda,$idejercicio,$idetapainversion,$valor
);";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function insertarpresupuestoconstructorplan($idmoneda, $valor, $idejercicio, $idetapinverconsprov) {
        $con = Doctrine_Manager::connection();
        $query = "INSERT INTO
  mod_planifinversiones.dat_etapinverconsprovplan
(

  idmoneda,
  idejercicio,
  idetapinverconsprov,
  valor
)
VALUES (

  $idmoneda,
  $idejercicio,
  $idetapinverconsprov,
  $valor
);";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function actualizarpresupuestoconstructorplan($idetapinverconsprovplan, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "UPDATE
  mod_planifinversiones.dat_etapinverconsprovplan
SET
  valor = valor + $valor

WHERE
  idetapinverconsprovplan = $idetapinverconsprovplan
;";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function actualizarpresupuestoplan($idplaninversetapaplan, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "UPDATE
  mod_planifinversiones.dat_inversetapaplan
SET
  valor = valor + $valor
WHERE
  idplaninversetapaplan = $idplaninversetapaplan;";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function insertarvalorelementos($moneda, $identidad, $valor, $idinversion, $dato) {
        $con = Doctrine_Manager::connection();
        $query = "INSERT INTO
  mod_planifinversiones.dat_elementovalor
(
  idelemento,
  idmonedaentidad,
  valor
)
 (
 SELECT
  eei.idetapaelementoinversion,
  (SELECT
  me.idmonedaentidad
FROM
  mod_datosmaestros.nom_moneda m
  INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (m.idmoneda = me.idmoneda)
WHERE
  m.codigoiso = '$moneda' AND
  me.idestructuracomun = $identidad) as idmonedaentidad,
  $valor as valor
FROM
  mod_planifinversiones.dat_etapainversion ei
 INNER JOIN mod_planifinversiones.dat_etapa et ON (ei.idetapa = et.idetapa)
  INNER JOIN mod_planifinversiones.dat_elemento el ON (et.idetapa = el.idetapa)
  INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa = ne.idnombreetapa)
  INNER JOIN mod_planifinversiones.dat_etapaelementoinversion eei on (eei.idetapainversion = ei.idetapainversion )
WHERE
  ei.idinversion = $idinversion
  and el.denominacion =  ne.denominacion
  and ne.denominacion = '$dato'
);";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerEntidadMoneda($identidad, $moneda) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  me.idmonedaentidad
FROM
  mod_datosmaestros.nom_moneda m
  INNER JOIN mod_datosmaestros.dat_monedaentidad me ON (m.idmoneda = me.idmoneda)
WHERE
  m.codigoiso = '$moneda' AND
  me.idestructuracomun = $identidad";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerDatosTipoDadoDato($dato) {//print_r($dato);die;
        $con = Doctrine_Manager::connection();
        $query = "select f.denominacion,f.tipo FROM(


SELECT

  n.denominacion,c.*
FROM
  mod_planificacion.nom_datosnomenclador n

inner join

(

------------------------------------------------------


  SELECT
  iddatosnomenclador,
  idnomenclador,
  'Quien Financia' as tipo
FROM
  mod_planifinversiones.dat_financista
------------------------------------------------------
  union

  SELECT
  iddatosnomenclador,
  idnomenclador,
  'Como se financia' as tipo
FROM
  mod_planifinversiones.dat_tipofinanciamiento


  ) c

  on    c.iddatosnomenclador = n.iddatosnomenclador
  union

  SELECT
  denominacion,
  idnombreetapa as iddatosnomenclador,
  0 as idnomenclador,
  'COMPONENTE' as tipo
FROM
  mod_planifinversiones.nom_nombreetapa

  union

   SELECT
  'PLAN DE PREPARACION' as denominacion,
  1 as iddatosnomenclador,
  0 as idnomenclador,
  'PLAN DE PREPARACION' as tipo
FROM
  mod_planifinversiones.nom_nombreetapa



  )f
where f.denominacion = '$dato'
order by f.tipo"; //print_r($query);die;
        $res = $con->execute($query)->fetchAll();
        /*  union

          SELECT
          'INGRESOS DE LA ENTIDAD' as denominacion,
          1 as iddatosnomenclador,
          0 as idnomenclador,
          'INGRESOS DE LA ENTIDAD' as tipo
          FROM
          mod_planificacion.nom_datosnomenclador */
        return $res;
    }

    public function obtenerIdModeloDadoDenom($denmodelo, $identidad) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT em.identidadmodelo
FROM
  mod_planificacion.dat_modelo m
  INNER JOIN mod_planificacion.dat_entidadmodelo em
                               on(em.idmodelo = m.idmodelo)
  where m.denominacion= '$denmodelo'
  and em.identidad=$identidad limit 1";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerDatosEquipoDadoDenom($denomequipo) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT i.idindicador,ip.precio,i.idumedida,ip.preciodivisa,cb.identidaddatosnomenclador, edn.identidad as identidadcentrobalance
FROM
  mod_datosmaestros.nom_indicador i
   INNER JOIN mod_datosmaestros.nom_indicadorplanif ip ON (i.idindicador = ip.idindicador)
   INNER JOIN mod_datosmaestros.dat_indicadorcentrobalance cb ON (i.idindicador = cb.idindicador)
   INNER JOIN mod_planificacion.dat_entidaddatosnomenclador edn
                               on(edn.identidaddatosnomenclador = cb.identidaddatosnomenclador)
  where i.denominacion= '$denomequipo'";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerIdComponenteEquipo($idinversion) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT e.idetapa
FROM
  mod_planifinversiones.nom_nombreetapa ne
  INNER JOIN mod_planifinversiones.dat_etapa e ON (ne.idnombreetapa = e.idnombreetapa)
  INNER JOIN mod_planifinversiones.dat_etapainversion ei ON (e.idetapa = ei.idetapa)
  where ne.denominacion= 'TOTAL EQUIPOS'
   and ei.idinversion = $idinversion limit 1";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerIdConstructor() {
        $con = Doctrine_Manager::connection();
        $query = "SELECT e.idetapa
FROM
  mod_planifinversiones.nom_nombreetapa ne
  INNER JOIN mod_planifinversiones.dat_etapa e ON (ne.idnombreetapa = e.idnombreetapa)
  where ne.denominacion= 'CONSTRUCCION Y MONTAJE' limit 1";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerIdEtapaEquipoInversion($idinversion, $idequipoequipo) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT ei.idetapainversion
FROM
  mod_planifinversiones.dat_etapainversion ei
  where ei.idetapa= $idequipoequipo
  and ei.idinversion= $idinversion";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerIdinversionDadoDenom($identidad, $deninversion, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  idinversion,
  codigo
FROM
  mod_planifinversiones.dat_inversion
  where idestructuracomun = $identidad
  and denominacion = '$deninversion'
  and idejercicio=$idejercicio limit 1";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerIddatoNom($tipo, $dato) {
        $con = Doctrine_Manager::connection();
        $v = "'";
        $consulta = "select
'select d.'||n.nombreidtabla|| ',dn.denominacion from mod_planificacion.nom_datosnomenclador dn
inner join ' ||n.esquema||'.'||n.tabla || ' d on (dn.iddatosnomenclador = d.iddatosnomenclador) where
 dn.denominacion = ' as ejecutar,
n.nombreidtabla
FROM
  mod_planifinversiones.nom_nomenclador n
  where n.nombrecampo = '$tipo'";
        $res = $con->execute($consulta)->fetchAll();
        $r = $con->execute($res[0]['ejecutar'] . $v . $dato . $v)->fetchAll();
        return $r[0][0];
    }

    public function insertarcomponenteInversion($tipo, $idinv) {
        $con = Doctrine_Manager::connection();
        $consulta = "INSERT INTO
  mod_planifinversiones.dat_etapainversion
(
  idinversion,
  idetapa,
  idestadoft
) (
  SELECT
  $idinv AS idinversion,
  de.idetapa,
  (SELECT
  t.idestadoinicial
FROM
  mod_planifinversiones.dat_flujotrabajo ft
  INNER JOIN mod_planifinversiones.dat_transicion t ON (ft.idflujotrabajo = t.idflujotrabajo)
WHERE
  t.inicial = 1
  and ft.idflujotrabajo = de.idflujotrabajo) as idestadoft
FROM
  mod_planifinversiones.conf_formatoetapa fe
  INNER JOIN mod_planifinversiones.dat_etapa de ON (fe.idformatoetapa = de.idformatoetapa)
  INNER JOIN mod_planifinversiones.nom_tipoinversion ti ON (fe.idformatoetapa = ti.idformatoetapa)
WHERE
  ti.idtipoinversion = $tipo
ORDER BY
  de.orden
)";

        $con->execute($consulta);
    }

    public function insertarelementoInversion($idinv) {
        $con = Doctrine_Manager::connection();
        $consulta = "INSERT INTO
  mod_planifinversiones.dat_etapaelementoinversion(
  idelemento,
  idetapainversion)
(
SELECT
  el.idelemento,
  ei.idetapainversion
FROM
  mod_planifinversiones.dat_etapainversion ei
  INNER JOIN mod_planifinversiones.dat_etapa et ON (ei.idetapa = et.idetapa)
  INNER JOIN mod_planifinversiones.dat_elemento el ON (et.idetapa = el.idetapa)
WHERE
  ei.idinversion = $idinv
);";

        $con->execute($consulta);
    }

    public function obtenerIdProvincia($prov) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT
  d.iddpt
FROM
  mod_datosmaestros.nom_dpt d
  where d.denominacion='$prov' order by d.iddpt limit 1";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerIdEntidad($ent) {
        $con = Doctrine_Manager::connection();
        $query = "Select e.idestructura, e.codigo, e.idespecialidad from mod_estructuracomp.nom_filaestruc f1
						 inner join mod_estructuracomp.dat_estructura
                         e on (f1.idfila = e.idestructura and e.idproyecto = 0)
                           where e.denominacion = '$ent'";

        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function obtenerIdTipoInversion($clasificacion) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idtipoinversion
        FROM mod_planifinversiones.nom_tipoinversion
        where denominacion = '$clasificacion'";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerFecha($fecha, $inicio) {
        $newformat = '';
        if (/* is_int($fecha) && */
                $fecha >= 1000 && $fecha <= 9999
        )
            if ($inicio)
                $strf = '01-01-' . $fecha;
            else
                $strf = '31-12-' . $fecha;

        $time = strtotime($strf);

        $newformat = date('d-m-Y', $time);
        return $newformat;
    }

    public function fnImportarInversiones($params) {
// $idesplogueada = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
        $ruta = '/ReaderModel.php';
        include_once(dirname(__FILE__) . $ruta);

        $data = new ReaderModel();
        $data->setOutputEncoding('CP1251');
        $data->read($params['file']);
        $inversiones = $data->sheets[0]['cells'];
        if ($params['tipoexcel'] == 1) {
            $datosCorrectosInversion = array();
            $contadorCorrectosInversion = 0;
            $datosCorrectosInversionUpdate = array();
            $contadorCorrectosInversionUpdate = 0;
            $datosCorrectosErogacion = array();
            $contadorCorrectosErogacion = 0;
            $datosCorrectosErogacionUpdate = array();
            $contadorCorrectosErogacionUpdate = 0;
            $datosCorrectosFinancim = array();
            $contadorCorrectosFinancim = 0;
            $datosCorrectosFinancimUpdate = array();
            $contadorCorrectosFinancimUpdate = 0;
            $datosCorrectosPreparacion = array();
            $contadorCorrectosPreparacion = 0;
            $datosCorrectosPreparacionUpdate = array();
            $contadorCorrectosPreparacionUpdate = 0;
            $datosCorrectosConstructor = array();
            $contadorCorrectosConstructor = 0;
            $datosCorrectosConstructorUpdate = array();
            $contadorCorrectosConstructorUpdate = 0;
            $datosCorrectosEtapaElemInv = array();
            $contadorCorrectosEtapaElemInv = 0;
            $datosCorrectosEquipo = array();
            $contadorCorrectosEquipo = 0;
            $datosCorrectosEquipoUpdate = array();
            $contadorCorrectosEquipoUpdate = 0;
            $datosCorrectosElemInv = array();
            $contadorCorrectosElemInv = 0;
            $datosCorrectosElemInvUpdate = array();
            $contadorCorrectosElemInvUpdate = 0;
            $errores = array();
            $contadorErrores = 0;
            //pre_r($inversiones);die;
            $ejercicioactual = NomEjercicioplanificacion::listarEjercicioActual();

            $denomejercicioactual = $ejercicioactual[0]['ejercicio'];
            if ($denomejercicioactual != $inversiones[1][1]) {
                $errores[$contadorErrores] = "El ejercico actual del sistema no coincide con el que desea importar.";
            } else {
//----------------------Comprobacion de los datos importados------------------------------------
                foreach ($inversiones as $key => $valorinv) {
//----------------------Comprobacion de los datos generales------------------------------------
                    $contadorErroresPorInv = 0;
                    $valores = "";
                    $existeError = false;
                    if ($valorinv[1] == "datosgenerales") {
                        $resultInv = self::obetenerInversion($valorinv[13], $params['identidad']);

                        if ($resultInv[0]['idinversion'] == null || $resultInv[0]['idinversion'] == "") {

                            $valores->tipo_inversion = utf8_encode($valorinv[2]);
                            $valores->ejercicio = utf8_encode($valorinv[3]);
                            $valores->inv_programa = utf8_encode($valorinv[6]);
                            $valores->forma_prop = utf8_encode($valorinv[7]);
                            $valores->caracteristica = utf8_encode($valorinv[8]);
                            $valores->objetivo = utf8_encode($valorinv[9]);
                            $valores->estado_inv = utf8_encode($valorinv[11]);
                            $valores->efecto_comercial = utf8_encode($valorinv[14]);
                            $valores->estado_aprob = utf8_encode($valorinv[15]);
                            $valores->provincia = $valorinv[16];
                            //$valores->provincia = utf8_encode($valorinv[17]);
                            $valores->cumpli_inv = utf8_encode($valorinv[17]);
                            $valores->desempenno = utf8_encode($valorinv[20]);
                            $valores->programa = utf8_encode($valorinv[21]);
                            $valores->cuadrada = utf8_encode($valorinv[22]);
                            $valores->medio_amb = utf8_encode($valorinv[23]);
                            $valores->grupo_obra = utf8_encode($valorinv[24]);
                            $valores->estado_planinv = utf8_encode($valorinv[25]);
                            $valores->sector_estrat = utf8_encode($valorinv[27]);

                            $result_comprob = self::comprobacionNomencladorInversiones($valores);
                            
                            if ($result_comprob[0]['tipoinversion'] != null || $result_comprob[0]['tipoinversion'] != "") {
                                if($result_comprob[0]['grupoobra'] != null || $result_comprob[0]['grupoobra'] != ''){
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idtipoinversion'] = $result_comprob[0]['tipoinversion'];

//                                if ($valorinv[2] == "CONSTRUCTIVA") {
                                    if ($valorinv[24] != null || $valorinv[24] != "-") {
                                        $datosCorrectosInversion[$contadorCorrectosInversion]['idgrupoobra'] = $result_comprob[0]['grupoobra'];
                                    } else {
                                        $existeError = true;
                                        $errores[$contadorErrores] = "Error en la fila $key: el tipo de inversión tiene que tener grupo de obra.";

                                        $contadorErrores++;
                                    }
//                                } else {
//                                    if ($valorinv[24] != "Ninguno") {
////                                    if ($valorinv[24] != null && $valorinv[24] != "-" && $valorinv[24] != "" && $valorinv[24] != " ") {
//                                        $existeError = true;
//                                        $errores[$contadorErrores] = "Error en la fila $key: el grupo de obra de la inversión es: Ninguno.";
//
//                                        $contadorErrores++;
//                                    }
//                                }
                                } else {
                                    $existeError = true;
                                    $errores[$contadorErrores] = "Error en la fila $key: el grupo de obra no existe.";
                                    $contadorErrores++;
                                }
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el tipo de inversión no existe.";

                                $contadorErrores++;
                            }


                            if ($result_comprob[0]['ejercicio'] != null || $result_comprob[0]['ejercicio'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idejercicio'] = $result_comprob[0]['ejercicio'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: El ejercicio no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['tipoinveprograma'] != null || $result_comprob[0]['tipoinveprograma'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idtipoinveprograma'] = $result_comprob[0]['tipoinveprograma'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el tipo de inversión programa no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['formapropiedad'] != null || $result_comprob[0]['formapropiedad'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idformapropiedad'] = $result_comprob[0]['formapropiedad'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores]['inversion'] = "Error en la fila $key: la forma de propiedad no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['caracteristica'] != null || $result_comprob[0]['caracteristica'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idcaracteristica'] = $result_comprob[0]['caracteristica'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: la característica no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['objetivo'] != null || $result_comprob[0]['objetivo'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idobjetivo'] = $result_comprob[0]['objetivo'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el objetivo no existe.";

                                $contadorErrores++;
                            }


                            if ($result_comprob[0]['estadoinv'] != null || $result_comprob[0]['estadoinv'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idestadoinv'] = $result_comprob[0]['estadoinv'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el tipo de estado de inversión no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['efectocomercial'] != null || $result_comprob[0]['efectocomercial'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idefectocomercial'] = $result_comprob[0]['efectocomercial'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el efecto comercial no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['estadoaprobacion'] != null || $result_comprob[0]['estadoaprobacion'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idestadoaprobacion'] = $result_comprob[0]['estadoaprobacion'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el estado de aprobación no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['provincia'] != null || $result_comprob[0]['provincia'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idprovincia'] = $result_comprob[0]['provincia'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: la provincia no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['cumplumientoinv'] != null || $result_comprob[0]['cumplumientoinv'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idcumplumientoinv'] = $result_comprob[0]['cumplumientoinv'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el tipo de cumplimiento de inversión no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['desempenno'] != null || $result_comprob[0]['desempenno'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['iddesempenno'] = $result_comprob[0]['desempenno'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el desempeño no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['programa'] != null || $result_comprob[0]['programa'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idprograma'] = $result_comprob[0]['programa'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el programa no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['medioamb'] != null || $result_comprob[0]['medioamb'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idmedioamb'] = $result_comprob[0]['medioamb'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el medio ambiente no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['estadoplaninv'] != null || $result_comprob[0]['estadoplaninv'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idestadoplaninv'] = $result_comprob[0]['estadoplaninv'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el estado de plan inversion no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['sectorestrate'] != null || $result_comprob[0]['sectorestrate'] != "") {
                                $datosCorrectosInversion[$contadorCorrectosInversion]['idsectorestrate'] = $result_comprob[0]['sectorestrate'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el sector estratégico no existe.";

                                $contadorErrores++;
                            }

                            if ($existeError) {

                                unset($datosCorrectosInversion[$contadorCorrectosInversion]);

                            } else {
                                if ($valorinv[1] == "datosgenerales") {
//----- Resto de los datos generales -----------
                                    $datosCorrectosInversion[$contadorCorrectosInversion]['fechainicio'] = $valorinv[4];
                                    $datosCorrectosInversion[$contadorCorrectosInversion]['fechafin'] = $valorinv[5];
                                    $datosCorrectosInversion[$contadorCorrectosInversion]['fasttrack'] = $valorinv[10];
                                    $datosCorrectosInversion[$contadorCorrectosInversion]['denominacion'] = $valorinv[12];
                                    $datosCorrectosInversion[$contadorCorrectosInversion]['codigo'] = $valorinv[13];
                                    $datosCorrectosInversion[$contadorCorrectosInversion]['observaciones'] = $valorinv[18];
                                    $datosCorrectosInversion[$contadorCorrectosInversion]['analpostinversiones'] = $valorinv[19];
                                    $datosCorrectosInversion[$contadorCorrectosInversion]['cuadrada'] = $valorinv[22];
                                    $datosCorrectosInversion[$contadorCorrectosInversion]['preparacion'] = $valorinv[26];
                                    $datosCorrectosInversion[$contadorCorrectosInversion]['identidad'] = $params['identidad'];
                                    $contadorCorrectosInversion++;
                                }
                            }
                        } else {
                            $valores->tipo_inversion = utf8_encode($valorinv[2]);
                            $valores->ejercicio = utf8_encode($valorinv[3]);
                            $valores->inv_programa = utf8_encode($valorinv[6]);
                            $valores->forma_prop = utf8_encode($valorinv[7]);
                            $valores->caracteristica = utf8_encode($valorinv[8]);
                            $valores->objetivo = utf8_encode($valorinv[9]);
                            $valores->estado_inv = utf8_encode($valorinv[11]);
                            $valores->efecto_comercial = utf8_encode($valorinv[14]);
                            $valores->estado_aprob = utf8_encode($valorinv[15]);
                            $valores->provincia = $valorinv[16];
                            //$valores->provincia = utf8_encode($valorinv[17]);
                            $valores->cumpli_inv = utf8_encode($valorinv[17]);
                            $valores->desempenno = utf8_encode($valorinv[20]);
                            $valores->programa = utf8_encode($valorinv[21]);
                            $valores->cuadrada = utf8_encode($valorinv[22]);
                            $valores->medio_amb = utf8_encode($valorinv[23]);
                            $valores->grupo_obra = utf8_encode($valorinv[24]);
                            $valores->estado_planinv = utf8_encode($valorinv[25]);
                            $valores->sector_estrat = utf8_encode($valorinv[27]);

                            $result_comprob = self::comprobacionNomencladorInversiones($valores);

                            if ($result_comprob[0]['tipoinversion'] != null || $result_comprob[0]['tipoinversion'] != "") {
                                
                                
                                if($result_comprob[0]['grupoobra'] != null || $result_comprob[0]['grupoobra'] != ''){
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idtipoinversion'] = $result_comprob[0]['tipoinversion'];

//                                if ($valorinv[2] == "CONSTRUCTIVA") {
                                    if ($valorinv[24] != null || $valorinv[24] != "-") {
                                        $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idgrupoobra'] = $result_comprob[0]['grupoobra'];
                                    } else {
                                        $existeError = true;
                                        $errores[$contadorErrores] = "Error en la fila $key: el tipo de inversión tiene que tener grupo de obra.";

                                        $contadorErrores++;
                                    }
//                                } else {
//                                    if ($valorinv[24] != "Ninguno") {
////                                    if ($valorinv[24] != null && $valorinv[24] != "-" && $valorinv[24] != "" && $valorinv[24] != " ") {
//                                        $existeError = true;
//                                        $errores[$contadorErrores] = "Error en la fila $key: el grupo de obra de la inversión es: Ninguno.";
//
//                                        $contadorErrores++;
//                                    }
//                                }
                                } else {
                                    $existeError = true;
                                    $errores[$contadorErrores] = "Error en la fila $key: el grupo de obra no existe.";
                                    $contadorErrores++;
                                }
                                
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el tipo de inversión no existe.";

                                $contadorErrores++;
                            }


                            if ($result_comprob[0]['ejercicio'] != null || $result_comprob[0]['ejercicio'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idejercicio'] = $result_comprob[0]['ejercicio'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el ejercicio no existe.";

                                $contadorErrores++;
                            }
                            if ($result_comprob[0]['tipoinveprograma'] != null || $result_comprob[0]['tipoinveprograma'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idtipoinveprograma'] = $result_comprob[0]['tipoinveprograma'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el tipo de inversión programa no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['formapropiedad'] != null || $result_comprob[0]['formapropiedad'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idformapropiedad'] = $result_comprob[0]['formapropiedad'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: la forma de propiedad no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['caracteristica'] != null || $result_comprob[0]['caracteristica'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idcaracteristica'] = $result_comprob[0]['caracteristica'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: la característica no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['objetivo'] != null || $result_comprob[0]['objetivo'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idobjetivo'] = $result_comprob[0]['objetivo'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el objetivo no existe.";

                                $contadorErrores++;
                            }


                            if ($result_comprob[0]['estadoinv'] != null || $result_comprob[0]['estadoinv'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idestadoinv'] = $result_comprob[0]['estadoinv'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el tipo de estado de inversión no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['efectocomercial'] != null || $result_comprob[0]['efectocomercial'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idefectocomercial'] = $result_comprob[0]['efectocomercial'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el efecto comercial no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['estadoaprobacion'] != null || $result_comprob[0]['estadoaprobacion'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idestadoaprobacion'] = $result_comprob[0]['estadoaprobacion'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el estado de aprobación no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['provincia'] != null || $result_comprob[0]['provincia'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idprovincia'] = $result_comprob[0]['provincia'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: la provincia no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['cumplumientoinv'] != null || $result_comprob[0]['cumplumientoinv'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idcumplumientoinv'] = $result_comprob[0]['cumplumientoinv'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el tipo de cumplimiento de inversión no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['desempenno'] != null || $result_comprob[0]['desempenno'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['iddesempenno'] = $result_comprob[0]['desempenno'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el desempeño no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['programa'] != null || $result_comprob[0]['programa'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idprograma'] = $result_comprob[0]['programa'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el programa no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['medioamb'] != null || $result_comprob[0]['medioamb'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idmedioamb'] = $result_comprob[0]['medioamb'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el medio ambiente no existe.";

                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['estadoplaninv'] != null || $result_comprob[0]['estadoplaninv'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idestadoplaninv'] = $result_comprob[0]['estadoplaninv'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores] = "Error en la fila $key: el estado de plan inversión no existe.";
                                $contadorErrores++;
                            }

                            if ($result_comprob[0]['sectorestrate'] != null || $result_comprob[0]['sectorestrate'] != "") {
                                $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idsectorestrate'] = $result_comprob[0]['sectorestrate'];
                            } else {
                                $existeError = true;
                                $errores[$contadorErrores]= "Error en la fila $key: el sector estratégico no existe.";
                                $contadorErrores++;
                            }

                            if ($existeError) {
                                unset($datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]);
                            } else {
                                if ($valorinv[1] == "datosgenerales") {
//----- Resto de los datos generales -----------
                                    $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['fechainicio'] = $valorinv[4];
                                    $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['fechafin'] = $valorinv[5];
                                    $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['fasttrack'] = $valorinv[10];
                                    $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['denominacion'] = $valorinv[12];
                                    $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['codigo'] = $valorinv[13];
                                    $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['observaciones'] = $valorinv[18];
                                    $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['analpostinversiones'] = $valorinv[19];
                                    $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['cuadrada'] = $valorinv[22];
                                    $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['preparacion'] = $valorinv[26];
                                    $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['idinversion'] = $resultInv[0]['idinversion'];
                                    $datosCorrectosInversionUpdate[$contadorCorrectosInversionUpdate]['identidad'] = $params['identidad'];
                                    $contadorCorrectosInversionUpdate++;
                                }
                            }
                        }
                    }
                }
                // aki funcion para insertar y actualizar las inversiones del arreglo $datosCorrectosInversion
                if (count($datosCorrectosInversion) != 0) {
                    $resultInsert = self::insertarInversiones($datosCorrectosInversion);
                    foreach ($datosCorrectosInversion as $valorinversiones) {
                        $idinversion1 = self::obetenerInversion($valorinversiones['codigo'], $params['identidad']);
                        $idinversionEtapa = self::obtenerInversionEnEtapaInversion($idinversion1[0]['idinversion']);
                        $componentes = self::obtenerEtapa($valorinversiones['idtipoinversion']); // aki esta el idetapa y el idestadoflujotrabajo = idestadosft  en dat_etapainversion
                        $elementos = self::obtenerElementoInv($valorinversiones['idtipoinversion']); // aki estan los datos para insertar en dat_etapaelementoinversion
                        if ($idinversion1[0]['idinversion'] != null || $idinversion1[0]['idinversion'] != "") {
                            //para las etapas inversion
                            if ($idinversionEtapa[0]['idinversion'] != null || $idinversionEtapa[0]['idinversion'] != "") {
                                self::deleteEtapaInversion($idinversion1[0]['idinversion']);
                            }
                            self::insertarEtapaInversion($componentes, $idinversion1);

                            //para los elementos inversion
                            foreach ($elementos as $elem) {
                                $datosCorrectosEtapaElemInv[$contadorCorrectosEtapaElemInv]['idelemento'] = $elem['idelemento'];
                                $result = self::obtenerEtapaInversionDadoIdEtapa($idinversion1[0]['idinversion'], $elem['idetapa']);
                                $datosCorrectosEtapaElemInv[$contadorCorrectosEtapaElemInv]['idetapainversion'] = $result[0]['idetapainversion'];
                                $contadorCorrectosEtapaElemInv++;
                            }

                            self::insertarEtapaElementoInversion($datosCorrectosEtapaElemInv);
                        }
                    }
                }

                if (count($datosCorrectosInversionUpdate) != 0) {
                    $resultUpdate = self::updateInversiones($datosCorrectosInversionUpdate);
                    foreach ($datosCorrectosInversionUpdate as $valorinversionesUpd) {

                        $idinversion11 = self::obetenerInversion($valorinversionesUpd['codigo'], $params['identidad']);

                        if ($idinversion11[0]['idinversion'] != null || $idinversion11[0]['idinversion'] != "") {
                            $idinversionEtapa1 = self::obtenerInversionEnEtapaInversion($idinversion11[0]['idinversion']);
                            $componentes1 = self::obtenerEtapa($valorinversionesUpd['idtipoinversion']); // aki esta el idetapa y el idestadoflujotrabajo = idestadosft  en dat_etapainversion
                            $elementos1 = self::obtenerElementoInv($valorinversionesUpd['idtipoinversion']); // aki estan los datos para insertar en dat_etapaelementoinversion
                            //para las etapa inversion

                            if ($idinversionEtapa1[0]['idinversion'] != null || $idinversionEtapa1[0]['idinversion'] != "") {
                                self::deleteEtapaInversion($idinversion11[0]['idinversion']);
                                //eliminar
                            }
                            self::insertarEtapaInversion($componentes1, $idinversion11);

                            // para los elementos inversion
                            $idEtapaElemInv1 = self::obtenerElemInversion($idinversionEtapa1[0]['idetapainversion']);

                            if ($idEtapaElemInv1[0]['idetapainversion'] != null || $idEtapaElemInv1[0]['idetapainversion'] != "") {
                                foreach ($idinversionEtapa1 as $id) {
                                    self::deleteEtapaElemInversion($id['idetapainversion']);
                                }
                            }

                            foreach ($elementos1 as $elem1) {
                                $datosCorrectosEtapaElemInv[$contadorCorrectosEtapaElemInv]['idelemento'] = $elem1['idelemento'];
                                $result = self::obtenerEtapaInversionDadoIdEtapa($idinversion11[0]['idinversion'], $elem1['idetapa']);
                                $datosCorrectosEtapaElemInv[$contadorCorrectosEtapaElemInv]['idetapainversion'] = $result[0]['idetapainversion'];
                                $contadorCorrectosEtapaElemInv++;
                            }
                            self::insertarEtapaElementoInversion($datosCorrectosEtapaElemInv);
                        }
                    }
                }

                foreach ($inversiones as $key1 => $valorinve) {
                    $existeErrorEro = false;
                    $existeErrorFinan = false;
                    $existeErrorPrep = false;
                    $existeErrorConst = false;
                    $existeErrorElem = false;
                    $existeErrorEquipo = false;
                    $contadorErroresPorInve = 0;
                    if ($valorinve[1] == "erogacion") {
//----------------------------Erogacion--------------------------------
                        $idinversion = self::obetenerInversion($valorinve[2], $params['identidad']);

                        if ($idinversion[0]['idinversion'] != null || $idinversion[0]['idinversion'] != "") {
                            $idmonedaentidad = self::obtenerEntidadMoneda($params['identidad'], utf8_encode($valorinve[3]));
                            $resultErog = self::obtenerErogLiquido($idinversion[0]['idinversion']);

                            if ($resultErog[0]['idinversion'] != null || $resultErog[0]['idinversion'] != "") {
                                $datosCorrectosErogacionUpdate[$contadorCorrectosErogacionUpdate]['idmonedadentidad'] = $idmonedaentidad[0]['idmonedaentidad'];
                                $datosCorrectosErogacionUpdate[$contadorCorrectosErogacionUpdate]['idinversion'] = $idinversion[0]['idinversion'];
                                $datosCorrectosErogacionUpdate[$contadorCorrectosErogacionUpdate]['valor'] = $valorinve[4];
                            } else {
                                $datosCorrectosErogacion[$contadorCorrectosErogacion]['idmonedadentidad'] = $idmonedaentidad[0]['idmonedaentidad'];
                                $datosCorrectosErogacion[$contadorCorrectosErogacion]['idinversion'] = $idinversion[0]['idinversion'];
                                $datosCorrectosErogacion[$contadorCorrectosErogacion]['valor'] = $valorinve[4];
                            }
                        } else {
                            $existeErrorEro = true;
                            $errores[$contadorErrores] = "Error en la fila $key1: la inversión no existe.";
                            $contadorErrores++;
                        }
                    } else if ($valorinve[1] == "financiamiento") {

//-----------------------------Financiamiento-------------------------------------------------
                        $idinversion = self::obetenerInversion($valorinve[2], $params['identidad']);
                        if ($idinversion[0]['idinversion'] != null || $idinversion[0]['idinversion'] != "") {
                            $idtipofinancimiento = self::obtenerTipoFinancimiento(utf8_encode($valorinve[6]));
                            $idfinancista = self::obtenerFinancista(utf8_encode($valorinve[5]));
                            $idmonedaentidad = self::obtenerEntidadMoneda($params['identidad'], utf8_encode($valorinve[3]));
                            $idinverFinam = self::obtenerFinamDadoInver($idinversion[0]['idinversion']);

                            if ($idinverFinam[0]['idinversion'] != null || $idinverFinam[0]['idinversion'] != "") {

                                if ($idtipofinancimiento[0]['idtipofinanciamiento'] != null || $idtipofinancimiento[0]['idtipofinanciamiento'] != "") {
                                    $datosCorrectosFinancimUpdate[$contadorCorrectosFinancimUpdate]['idtipofinanciamiento'] = $idtipofinancimiento[0]['idtipofinanciamiento'];
                                } else {
                                    $existeErrorFinan = true;
                                    $errores[$contadorErrores] = "Error en la fila $key1: el tipo de financiamiento no existe.";
                                    $contadorErrores++;
                                }

                                if ($idfinancista[0]['idfinancista'] != null || $idfinancista[0]['idfinancista'] != "") {
                                    $datosCorrectosFinancimUpdate[$contadorCorrectosFinancimUpdate]['idfinacista'] = $idfinancista[0]['idfinancista'];
                                } else {
                                    $existeErrorFinan = true;
                                    $errores[$contadorErrores] = "Error en la fila $key1: el financista no existe.";
                                    $contadorErrores++;
                                }

                                //-------- Resto de los datos de financiamiento -----------
                                $datosCorrectosFinancimUpdate[$contadorCorrectosFinancimUpdate]['valor'] = $valorinve[4];
                                $datosCorrectosFinancimUpdate[$contadorCorrectosFinancimUpdate]['porcientointeres'] = $valorinve[7];
                                $datosCorrectosFinancimUpdate[$contadorCorrectosFinancimUpdate]['plazoamortizacion'] = $valorinve[8];
                                $datosCorrectosFinancimUpdate[$contadorCorrectosFinancimUpdate]['gracia'] = $valorinve[9];
                                $datosCorrectosFinancimUpdate[$contadorCorrectosFinancimUpdate]['idinversion'] = $idinversion[0]['idinversion'];
                                $datosCorrectosFinancimUpdate[$contadorCorrectosFinancimUpdate]['codigoinversion'] = $idinversion[0]['codigo'];
                                $datosCorrectosFinancimUpdate[$contadorCorrectosFinancimUpdate]['idmonedaentidad'] = $idmonedaentidad[0]['idmonedaentidad'];
                            } else {

                                if ($idtipofinancimiento[0]['idtipofinanciamiento'] != null || $idtipofinancimiento[0]['idtipofinanciamiento'] != "") {
                                    $datosCorrectosFinancim[$contadorCorrectosFinancim]['idtipofinanciamiento'] = $idtipofinancimiento[0]['idtipofinanciamiento'];
                                } else {
                                    $existeErrorFinan = true;
                                    $errores[$contadorErrores] = "Error en la fila $key1: el tipo de financiamiento no existe.";
                                    $contadorErrores++;
                                }

                                if ($idfinancista[0]['idfinancista'] != null || $idfinancista[0]['idfinancista'] != "") {
                                    $datosCorrectosFinancim[$contadorCorrectosFinancim]['idfinacista'] = $idfinancista[0]['idfinancista'];
                                } else {
                                    $existeErrorFinan = true;
                                    $errores[$contadorErrores] = "Error en la fila $key1: el financista no existe.";
                                    $contadorErrores++;
                                }

                                //-------- Resto de los datos de financiamiento -----------
                                $datosCorrectosFinancim[$contadorCorrectosFinancim]['valor'] = $valorinve[4];
                                $datosCorrectosFinancim[$contadorCorrectosFinancim]['porcientointeres'] = $valorinve[7];
                                $datosCorrectosFinancim[$contadorCorrectosFinancim]['plazoamortizacion'] = $valorinve[8];
                                $datosCorrectosFinancim[$contadorCorrectosFinancim]['gracia'] = $valorinve[9];
                                $datosCorrectosFinancim[$contadorCorrectosFinancim]['idinversion'] = $idinversion[0]['idinversion'];
                                $datosCorrectosFinancim[$contadorCorrectosFinancim]['codigoinversion'] = $idinversion[0]['codigo'];
                                $datosCorrectosFinancim[$contadorCorrectosFinancim]['idmonedaentidad'] = $idmonedaentidad[0]['idmonedaentidad'];
                            }
                        } else {
                            $existeErrorFinan = true;
                            $errores[$contadorErrores] = "Error en la fila $key1: la inversión no existe.";
                            $contadorErrores++;
                        }
                    } else if ($valorinve[1] == "preparacion") {
//-----------------------------Preparacion-------------------------------------------------
                        $idinversionn = self::obetenerInversion($valorinve[2], $params['identidad']);
                        if ($idinversionn[0]['idinversion'] != null || $idinversionn[0]['idinversion'] != "") {
                            $idprepInv = self::obtenerPreparacionDadoInversion($idinversionn[0]['idinversion']);
                            if ($idprepInv[0]['idinversion'] != null || $idprepInv[0]['idinversion'] != "") {
                                $idmonedaentidadd = self::obtenerEntidadMoneda($params['identidad'], utf8_encode($valorinve[3]));
                                $datosCorrectosPreparacionUpdate[$contadorCorrectosPreparacionUpdate]['idinversion'] = $idinversionn[0]['idinversion'];
                                $datosCorrectosPreparacionUpdate[$contadorCorrectosPreparacionUpdate]['idmonedadentidad'] = $idmonedaentidadd[0]['idmonedaentidad'];
                                $datosCorrectosPreparacionUpdate[$contadorCorrectosPreparacionUpdate]['valor'] = $valorinve[4];
                            } else {
                                $idmonedaentidadd = self::obtenerEntidadMoneda($params['identidad'], utf8_encode($valorinve[3]));
                                $datosCorrectosPreparacion[$contadorCorrectosPreparacion]['idinversion'] = $idinversionn[0]['idinversion'];
                                $datosCorrectosPreparacion[$contadorCorrectosPreparacion]['idmonedadentidad'] = $idmonedaentidadd[0]['idmonedaentidad'];
                                $datosCorrectosPreparacion[$contadorCorrectosPreparacion]['valor'] = $valorinve[4];
                            }
                        } else {
                            $existeErrorPrep = true;
                            $errores[$contadorErrores] = "Error en la fila $key1: la inversión no existe.";
                            $contadorErrores++;
                        }
                    } else if ($valorinve[1] == "constructor") {
//-----------------------------Constructor-------------------------------------------------
                        $idinversionn = self::obetenerInversion($valorinve[2], $params['identidad']);

                        if ($idinversionn[0]['idinversion'] != null || $idinversionn[0]['idinversion'] != "") {
                            $idetapainversion = self::obtenerEtapaInversion($idinversionn[0]['idinversion'], utf8_encode($valorinve[3]));

                            if ($idetapainversion[0]['idetapainversion'] != null || $idetapainversion[0]['idetapainversion'] != "") {
                                $idprovincia = self::obtenerProvincia(utf8_encode($valorinve[7]));
                                $idconstructor = self::obtenerConstructor(utf8_encode($valorinve[8]));


                                if ($idprovincia[0]['idprovincia'] != null || $idprovincia[0]['idprovincia'] != "") {
                                    if ($idconstructor[0]['idconstructor'] != null || $idconstructor[0]['idconstructor'] != "") {

                                        $idetapainvconstprov = self::obtenerEtapaInvConstProvDadoEtapaInv($idetapainversion[0]['idetapainversion'], $idprovincia[0]['idprovincia'], $idconstructor[0]['idconstructor']);
                                        if ($idetapainvconstprov[0]['idetapainversion'] != null || $idetapainvconstprov[0]['idetapainversion'] != "") {
                                            $datosCorrectosConstructorUpdate[$contadorCorrectosConstructorUpdate]['idprovincia'] = $idprovincia[0]['idprovincia'];

                                            //if ($idprovincia[0]['idprovincia'] != null || $idprovincia[0]['idprovincia'] != "") {
                                            $datosCorrectosConstructorUpdate[$contadorCorrectosConstructorUpdate]['idetapainversion'] = $idetapainversion[0]['idetapainversion'];
                                            /* } else {
                                              $existeErrorConst = true;
                                              $errores[$contadorErrores] = "Error fila $key1: En el constructor con codigo inversion $valorinve[2] y provincia $valorinve[7] la provincia $valorinve[7] no existe.";
                                              $contadorErrores++;
                                              } */

                                            //if ($idconstructor[0]['idconstructor'] != null || $idconstructor[0]['idconstructor'] != "") {
                                            $datosCorrectosConstructorUpdate[$contadorCorrectosConstructorUpdate]['idconstructor'] = $idconstructor[0]['idconstructor'];
                                            /* } else {
                                              $existeErrorConst = true;
                                              $errores[$contadorErrores] = "Error fila $key1: En el constructor con codigo inversion $valorinve[2] y provincia $valorinve[7] el constructor $valorinve[8] no existe.";
                                              $contadorErrores++;
                                              } */
                                        } else {
                                            $datosCorrectosConstructor[$contadorCorrectosConstructor]['idetapainversion'] = $idetapainversion[0]['idetapainversion'];
                                            //if ($idprovincia[0]['idprovincia'] != null || $idprovincia[0]['idprovincia'] != "") {
                                            $datosCorrectosConstructor[$contadorCorrectosConstructor]['idprovincia'] = $idprovincia[0]['idprovincia'];
                                            /* } else {
                                              $existeErrorConst = true;
                                              $errores[$contadorErrores] = "Error fila $key1: En el constructor con codigo inversion $valorinve[2] y provincia $valorinve[7] la provincia $valorinve[7] no existe.";
                                              //$contadorErroresPorInve++;
                                              $contadorErrores++;
                                              } */

                                            //if ($idconstructor[0]['idconstructor'] != null || $idconstructor[0]['idconstructor'] != "") {
                                            $datosCorrectosConstructor[$contadorCorrectosConstructor]['idconstructor'] = $idconstructor[0]['idconstructor'];
                                            /* } else {
                                              $existeErrorConst = true;
                                              $errores[$contadorErrores] = "Error fila $key1: En el constructor con codigo inversion $valorinve[2] y provincia $valorinve[7] el constructor $valorinve[8] no existe.";
                                              //$contadorErroresPorInve++;
                                              $contadorErrores++;
                                              } */
                                        }
                                    } else {
                                        $existeErrorConst = true;
                                        $errores[$contadorErrores] = "Error en la fila $key1: el constructor no existe.";
                                        $contadorErrores++;
                                    }
                                } else {
                                    $existeErrorConst = true;
                                    $errores[$contadorErrores] = "Error en la fila $key1: la provincia no existe.";

                                    $contadorErrores++;
                                }
                            } else {
                                $existeErrorConst = true;
                                $errores[$contadorErrores] = "Error en la fila $key1: la etapa no existe.";
                                $contadorErrores++;

                            }
                        } else {
                            $existeErrorConst = true;
                            $errores[$contadorErrores] = "Error en la fila $key1: la inversión no existe.";

                            $contadorErrores++;
                        }
                    } else if ($valorinve[1] == "elemento") {
//-----------------------------Elemento-------------------------------------------------
                        $idinversionn = self::obetenerInversion($valorinve[2], $params['identidad']);

                        if ($idinversionn[0]['idinversion'] != null || $idinversionn[0]['idinversion'] != "") {

                            $idetapainversion1 = self::obteneretapaEleminversion($idinversionn[0]['idinversion'], utf8_encode($valorinve[3]));

                            if ($idetapainversion1[0]['idetapainversion'] != null || $idetapainversion1[0]['idetapainversion'] != "") {
                                $resultElem = self::obtenerElemvalor($idetapainversion1[0]['idetapaelementoinversion']);
                                if ($resultElem[0]['idelemento'] != null || $resultElem[0]['idelemento'] != "") {
                                    // if ($idetapainversion1[0]['idetapainversion'] != null || $idetapainversion1[0]['idetapainversion'] != "") {
                                    $datosCorrectosElemInvUpdate[$contadorCorrectosElemInvUpdate]['idelemento'] = $idetapainversion1[0]['idetapaelementoinversion'];
                                    $datosCorrectosElemInvUpdate[$contadorCorrectosElemInvUpdate]['idetapainversion'] = $idetapainversion1[0]['idetapainversion'];
                                    //-------- Resto de los datos de elementos -----------
                                    $idmonedaentidaddd = self::obtenerEntidadMoneda($params['identidad'], $valorinve[6]);
                                    $datosCorrectosElemInvUpdate[$contadorCorrectosElemInvUpdate]['valor'] = $valorinve[4]; //insertar en la tabla dat_elementovalor
                                    $datosCorrectosElemInvUpdate[$contadorCorrectosElemInvUpdate]['idmonedaentidad'] = $idmonedaentidaddd[0]['idmonedaentidad']; //insertar en la tabla dat_elementovalor
                                    /* } else {
                                      $existeErrorElem = true;
                                      $errores[$contadorErrores] = "Error fila $key1: En el elemento con codigo inversion $valorinve[2] y codigo ISO $valorinve[6] la etapa $valorinve[3] no existe.";
                                      //$contadorErroresPorInve++;
                                      $contadorErrores++;
                                      } */
                                } else {
                                    // if ($idetapainversion1[0]['idetapainversion'] != null || $idetapainversion1[0]['idetapainversion'] != "") {
                                    $datosCorrectosElemInv[$contadorCorrectosElemInv]['idelemento'] = $idetapainversion1[0]['idetapaelementoinversion'];
                                    $datosCorrectosElemInv[$contadorCorrectosElemInv]['idetapainversion'] = $idetapainversion1[0]['idetapainversion'];
                                    //-------- Resto de los datos de elementos -----------
                                    $idmonedaentidaddd = self::obtenerEntidadMoneda($params['identidad'], $valorinve[6]);
                                    $datosCorrectosElemInv[$contadorCorrectosElemInv]['valor'] = $valorinve[4]; //insertar en la tabla dat_elementovalor
                                    $datosCorrectosElemInv[$contadorCorrectosElemInv]['idmonedaentidad'] = $idmonedaentidaddd[0]['idmonedaentidad']; //insertar en la tabla dat_elementovalor
                                    /* } else {
                                      $existeErrorElem = true;
                                      $errores[$contadorErrores]= "Error fila $key1: En el elemento con codigo inversion $valorinve[2] y codigo ISO $valorinve[6] la etapa $valorinve[3] no existe.";
                                      //$contadorErroresPorInve++;
                                      $contadorErrores++;
                                      } */
                                }
                            } else {
                                $existeErrorElem = true;
                                $errores[$contadorErrores] = "Error en la fila $key1: la etapa no existe.";
                                $contadorErrores++;
                            }
                        } else {
                            $existeErrorElem = true;
                            $errores[$contadorErrores] = "Error en la fila $key1: la inversión no existe.";
                            $contadorErrores++;
                        }
                    } else if ($valorinve[1] == "equipo") {
//-----------------------------Equipo-------------------------------------------------

                        $idinversion2 = self::obetenerInversion($valorinve[2], $params['identidad']);
                        $idindicador = self::obtenerIndicador(utf8_encode($valorinve[22]));
                        if (($idinversion2[0]['idinversion'] != null || $idinversion2[0]['idinversion'] != "") && ($idindicador[0]['idindicador'] != null || $idindicador[0]['idindicador'] != "")) {
                            $idetapainversion1 = self::obtenerEtapaInversion($idinversion2[0]['idinversion'], utf8_encode($valorinve[3]));
                            $idejercicio = self::obtenerEjercicio(utf8_encode($valorinve[20]));
                            $idcentrobalance = self::obtenerCentroBalance(utf8_encode($valorinve[17]));
                            $identidadmodelo = self::obtenerEntidadmodelo($params['identidad'], utf8_encode($valorinve[21]));
                            $idum = self::obtenerUnidadMedida(utf8_encode($valorinve[18]));
                            $idcomprar = self::obtenerComprar(utf8_encode($valorinve[11]));
                            $idadquisicion = self::obtenerAdquisicion(utf8_encode($valorinve[12]));
                            $idcomprarpais = self::obtenerComprar(utf8_encode($valorinve[9]));
                            if ($idetapainversion1[0]['idetapainversion'] != null || $idetapainversion1[0]['idetapainversion'] != "") {
                                if ($identidadmodelo[0]['identidadmodelo'] != "" || $identidadmodelo[0]['identidadmodelo'] != null) {
                                    if ($idejercicio[0]['idejercicio'] != null || $idejercicio[0]['idejercicio'] != "") {

                                    $idindexit = self::obtenerIndicadorExist($idindicador[0]['idindicador'], $identidadmodelo[0]['identidadmodelo'], $idetapainversion1[0]['idetapainversion'], $idejercicio[0]['idejercicio']);

                                    if ($idindexit[0]['idindicador'] != "" || $idindexit[0]['idindicador'] != null) {

                                        $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['idetapainversion'] = $idetapainversion1[0]['idetapainversion'];
                                        $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['idejercicio'] = $idejercicio[0]['idejercicio'];

                                        if ($idcentrobalance[0]['idcentrobalance'] != null || $idcentrobalance[0]['idcentrobalance'] != "") {
                                            $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['idcentrobalance'] = $idcentrobalance[0]['idcentrobalance'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error en la fila $key1: el centro de balance no existe.";
                                            $contadorErrores++;
                                        }

                                        if ($identidadmodelo[0]['identidadmodelo'] != null || $identidadmodelo[0]['identidadmodelo'] != "") {
                                            $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['identidadmodelo'] = $identidadmodelo[0]['identidadmodelo'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error en la fila $key1: el modelo no existe.";
                                            $contadorErrores++;
                                        }

                                        if ($idum[0]['idunidadmedida'] != null || $idum[0]['idunidadmedida'] != "") {
                                            $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['idunidadmedida'] = $idum[0]['idunidadmedida'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error en la fila $key1: la unidad de medida no existe.";
                                            $contadorErrores++;
                                        }

                                        if ($idcomprar[0]['idcomprar'] != null || $idcomprar[0]['idcomprar'] != "") {
                                            $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['idcomprar'] = $idcomprar[0]['idcomprar'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error en la fila $key1: la compra no existe.";
                                            $contadorErrores++;
                                        }

                                        if ($idadquisicion[0]['idadquisicion'] != null || $idadquisicion[0]['idadquisicion'] != "") {
                                            $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['idadquisicion'] = $idadquisicion[0]['idadquisicion'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error en la fila $key1: la adquisición no existe.";
                                            $contadorErrores++;
                                        }

                                        if ($idcomprarpais[0]['idcomprar'] != null || $idcomprarpais[0]['idcomprar'] != "") {
                                            $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['idcomprarpais'] = $idcomprarpais[0]['idcomprar'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error en la fila $key1: la compra país no existe.";
                                            $contadorErrores++;
                                        }

                                        //-------- Resto de los datos de los equipos -----------
                                        $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['importedivisa'] = $valorinve[13];
                                        $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['preciodivisa'] = $valorinve[14];
                                        $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['importe'] = $valorinve[15];
                                        $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['cantidad'] = $valorinve[16];
                                        $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['precio'] = $valorinve[19];
                                        $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['observaciones'] = $valorinve[10];
                                        $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['observaciones'] = $valorinve[10];
                                        $datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]['idindicador'] = $idindicador[0]['idindicador'];
                                    } else {
                                        $datosCorrectosEquipo[$contadorCorrectosEquipo]['idetapainversion'] = $idetapainversion1[0]['idetapainversion'];
                                        $datosCorrectosEquipo[$contadorCorrectosEquipo]['idejercicio'] = $idejercicio[0]['idejercicio'];

                                        if ($idcentrobalance[0]['idcentrobalance'] != null || $idcentrobalance[0]['idcentrobalance'] != "") {
                                            $datosCorrectosEquipo[$contadorCorrectosEquipo]['idcentrobalance'] = $idcentrobalance[0]['idcentrobalance'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error en la fila $key1: el centro de balance no existe.";
                                            $contadorErrores++;
                                        }

                                        if ($identidadmodelo[0]['identidadmodelo'] != null || $identidadmodelo[0]['identidadmodelo'] != "") {
                                            $datosCorrectosEquipo[$contadorCorrectosEquipo]['identidadmodelo'] = $identidadmodelo[0]['identidadmodelo'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error en la fila $key1: el modelo no existe.";
                                            $contadorErrores++;
                                        }

                                        if ($idum[0]['idunidadmedida'] != null || $idum[0]['idunidadmedida'] != "") {
                                            $datosCorrectosEquipo[$contadorCorrectosEquipo]['idunidadmedida'] = $idum[0]['idunidadmedida'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error en la fila $key1: la unidad de medida no existe.";
                                            $contadorErrores++;
                                        }

                                        if ($idcomprar[0]['idcomprar'] != null || $idcomprar[0]['idcomprar'] != "") {
                                            $datosCorrectosEquipo[$contadorCorrectosEquipo]['idcomprar'] = $idcomprar[0]['idcomprar'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error fila $key1: la compra no existe.";
                                            $contadorErrores++;
                                        }

                                        if ($idadquisicion[0]['idadquisicion'] != null || $idadquisicion[0]['idadquisicion'] != "") {
                                            $datosCorrectosEquipo[$contadorCorrectosEquipo]['idadquisicion'] = $idadquisicion[0]['idadquisicion'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error en la fila $key1: la adquisición no existe.";

                                            $contadorErrores++;
                                        }

                                        if ($idcomprarpais[0]['idcomprar'] != null || $idcomprarpais[0]['idcomprar'] != "") {
                                            $datosCorrectosEquipo[$contadorCorrectosEquipo]['idcomprarpais'] = $idcomprarpais[0]['idcomprar'];
                                        } else {
                                            $existeErrorEquipo = true;
                                            $errores[$contadorErrores] = "Error en la fila $key1: la compra país no existe.";
                                            $contadorErrores++;
                                        }

                                        //-------- Resto de los datos de los equipos -----------
                                        $datosCorrectosEquipo[$contadorCorrectosEquipo]['importedivisa'] = $valorinve[13];
                                        $datosCorrectosEquipo[$contadorCorrectosEquipo]['preciodivisa'] = $valorinve[14];
                                        $datosCorrectosEquipo[$contadorCorrectosEquipo]['importe'] = $valorinve[15];
                                        $datosCorrectosEquipo[$contadorCorrectosEquipo]['cantidad'] = $valorinve[16];
                                        $datosCorrectosEquipo[$contadorCorrectosEquipo]['precio'] = $valorinve[19];
                                        $datosCorrectosEquipo[$contadorCorrectosEquipo]['observaciones'] = $valorinve[10];
                                        $datosCorrectosEquipo[$contadorCorrectosEquipo]['idindicador'] = $idindicador[0]['idindicador'];
                                    }
                                } else {
                                        $existeErrorEquipo = true;
                                        $errores[$contadorErrores] = "Error en la fila $key1: el ejercicio no existe.";
                                        $contadorErrores++;
                                    }
                                } else {
                                    $errores[$contadorErrores] = "Error en la fila $key1: el plan no existe.";
                                    $contadorErrores++;
                                }
                            } else {
                                $existeErrorEquipo = true;
                                $errores[$contadorErrores] = "Error en la fila $key1: no existe la relacion entre la inversion y la etapa.";
                                $contadorErrores++;
                            }
                        } else {
                            $existeErrorEquipo = true;
                            if ($idindicador[0]['idindicador'] == null || $idindicador[0]['idindicador'] == "") {
                                $errores[$contadorErrores] = "Error en la fila $key1: el indicador no existe.";
                                $contadorErrores++;
                            }
                            if ($idinversion2[0]['idinversion'] == null || $idinversion2[0]['idinversion'] == ""){
                                $errores[$contadorErrores] = "Error en la fila $key1: la inversión no existe.";
                                $contadorErrores++;
                            }

                        }
                    }


                    if ($valorinve[1] == "erogacion") {
                        if ($existeErrorEro) {
                            unset($datosCorrectosErogacion[$contadorCorrectosErogacion]);
                            unset($datosCorrectosErogacionUpdate[$contadorCorrectosErogacionUpdate]);
                        } else {
                            $contadorCorrectosErogacion++;
                            $contadorCorrectosErogacionUpdate++;
                        }
                    } else if ($valorinve[1] == "financiamiento") {
                        if ($existeErrorFinan) {
                            unset($datosCorrectosFinancim[$contadorCorrectosFinancim]);
                            unset($datosCorrectosFinancimUpdate[$contadorCorrectosFinancimUpdate]);
                        } else {
                            $contadorCorrectosFinancimUpdate++;
                            $contadorCorrectosFinancim++;
                        }
                    } else if ($valorinve[1] == "preparacion") {
                        if ($existeErrorPrep) {
                            unset($datosCorrectosPreparacion[$contadorCorrectosPreparacion]);
                            unset($datosCorrectosPreparacionUpdate[$contadorCorrectosPreparacionUpdate]);
                        } else {
                            $contadorCorrectosPreparacion++;
                            $contadorCorrectosPreparacionUpdate++;
                        }
                    } else if ($valorinve[1] == "constructor") {
                        if ($existeErrorPrep) {
                            unset($datosCorrectosConstructor[$contadorCorrectosConstructor]);
                            unset($datosCorrectosConstructorUpdate[$contadorCorrectosConstructorUpdate]);
                        } else {
                            $contadorCorrectosConstructor++;
                            $contadorCorrectosConstructorUpdate++;
                        }
                    } else if ($valorinve[1] == "elemento") {
                        if ($existeErrorElem) {
                            unset($datosCorrectosElemInv[$contadorCorrectosElemInv]);
                            unset($datosCorrectosElemInvUpdate[$contadorCorrectosElemInvUpdate]);
                        } else {
                            $contadorCorrectosElemInv++;
                            $contadorCorrectosElemInvUpdate++;
                        }
                    } else if ($valorinve[1] == "equipo") {
                        if ($existeErrorEquipo) {
                            unset($datosCorrectosEquipo[$contadorCorrectosEquipo]);
                            unset($datosCorrectosEquipoUpdate[$contadorCorrectosEquipoUpdate]);
                        } else {
                            $contadorCorrectosEquipo++;
                            $contadorCorrectosEquipoUpdate++;
                        }
                    }
                }

                if (count($datosCorrectosErogacion) != 0) {
                    self::insertarErogacion($datosCorrectosErogacion);
                }

                if (count($datosCorrectosErogacionUpdate) != 0) {
                    self::updateErogacion($datosCorrectosErogacionUpdate);
                }

                if (count($datosCorrectosFinancim) != 0) {
                    self::insertarFinanciamiento($datosCorrectosFinancim);
                }

                if (count($datosCorrectosFinancimUpdate) != 0) {
                    self::updateFinanciamiento($datosCorrectosFinancimUpdate);
                }
                if (count($datosCorrectosPreparacion) != 0) {
                    self::insertarPreparacion($datosCorrectosPreparacion);
                }

                if (count($datosCorrectosPreparacionUpdate) != 0) {
                    self::updatePreparacion($datosCorrectosPreparacionUpdate);
                }

                if (count($datosCorrectosConstructor) != 0) {
                    self::insertarConstructor($datosCorrectosConstructor);
                }

                if (count($datosCorrectosConstructorUpdate) != 0) {
                    self::updateConstructor($datosCorrectosConstructorUpdate);
                }

                if (count($datosCorrectosElemInv) != 0) {
                    self::insertarElementoValor($datosCorrectosElemInv);
                }


                if (count($datosCorrectosEquipo) != 0) {
                    self::insertarEquipo($datosCorrectosEquipo);
                }

                if (count($datosCorrectosEquipoUpdate) != 0) {
                    self::updateEquipo($datosCorrectosEquipoUpdate);
                }
            }


            return $errores;
        } else {
            if ($params['tipoexcel'] == 2) {
                $ejercicioactual = NomEjercicioplanificacion::listarEjercicioActual();
                $denomejercicioactual = $ejercicioactual[0]['ejercicio'];
                $params['idejercicioactual'] = $ejercicioactual[0]['idejercicio'];
                $datosmal = array();
                if ($denomejercicioactual == $inversiones[1][1]) {
                    $key = 7;
                    foreach ($inversiones as $key => $valorinv) {
                        $var = "";
                        if ($valorinv[1] == "Presupuesto") {
                            $valores->inversion = utf8_encode($valorinv[3]);
                            $valores->componente = utf8_encode($valorinv[5]);
                            $valores->moneda = utf8_encode($valorinv[23]);
                            $valores->ejecutado = utf8_encode($valorinv[32]);
                            $valores->estimado = utf8_encode($valorinv[33]);
                            $valores->plan = utf8_encode($valorinv[34]);
                            $valores->proyeccion = utf8_encode($valorinv[35]);
                            $var = self::valInsertarDatosPresupuesto($valores, $params, $key);
                            if ($var != null)
                                $datosmal[] = $var;
                        } else {
                            if ($valorinv[1] == "Contado") {
                                $valores->inversion = utf8_encode($valorinv[3]);
                                $valores->moneda = utf8_encode($valorinv[23]);
                                $valores->ejecutado = utf8_encode($valorinv[32]);
                                $valores->estimado = utf8_encode($valorinv[33]);
                                $valores->plan = utf8_encode($valorinv[34]);
                                $valores->proyectado = utf8_encode($valorinv[35]);
                                $var = self::valInsertarDatosContado($valores, $params, $key);
                                if ($var != null)
                                    $datosmal[] = $var;
                            } else {
                                if ($valorinv[1] == "Financista") {
                                    $valores->inversion = utf8_encode($valorinv[3]);
                                    $valores->financista = utf8_encode($valorinv[7]);
                                    $valores->moneda = utf8_encode($valorinv[23]);
                                    $valores->ejecutado = utf8_encode($valorinv[32]);
                                    $valores->estimado = utf8_encode($valorinv[33]);
                                    $valores->plan = utf8_encode($valorinv[34]);
                                    $valores->proyectado = utf8_encode($valorinv[35]);
                                    $var = self::valInsertarDatosFinancista($valores, $params, $key);
                                    if ($var != null)
                                        $datosmal[] = $var;
                                } else {
                                    if ($valorinv[1] == "Plan de Prep.") {
                                        $valores->inversion = utf8_encode($valorinv[3]);
                                        $valores->moneda = utf8_encode($valorinv[23]);
                                        $valores->ejecutado = utf8_encode($valorinv[32]);
                                        $valores->estimado = utf8_encode($valorinv[33]);
                                        $valores->plan = utf8_encode($valorinv[34]);
                                        $valores->proyectado = utf8_encode($valorinv[35]);
                                        $var = self::valInsertarDatosPlanprep($valores, $params, $key);
                                        if ($var != null)
                                            $datosmal[] = $var;
                                    } else {
                                        if ($valorinv[1] == "Acreedor") {
                                            $valores->inversion = utf8_encode($valorinv[3]);
                                            $valores->acreedor = utf8_encode($valorinv[6]);
                                            $valores->moneda = utf8_encode($valorinv[23]);
                                            $valores->ejecutado = utf8_encode($valorinv[32]);
                                            $valores->estimado = utf8_encode($valorinv[33]);
                                            $valores->plan = utf8_encode($valorinv[34]);
                                            $valores->proyectado = utf8_encode($valorinv[35]);
                                            $var = self::valInsertarDatosAcreedor($valores, $params, $key);
                                            if ($var != null)
                                                $datosmal[] = $var;
                                        } else {
                                            if ($valorinv[1] == "Constructor") {
                                                $valores->inversion = utf8_encode($valorinv[3]);
                                                $valores->componente = utf8_encode($valorinv[5]);
                                                $valores->constructor = utf8_encode($valorinv[10]);
                                                $valores->provincia = utf8_encode($valorinv[11]);
                                                $valores->moneda = utf8_encode($valorinv[23]);
                                                $valores->ejecutado = utf8_encode($valorinv[32]);
                                                $valores->estimado = utf8_encode($valorinv[33]);
                                                $valores->plan = utf8_encode($valorinv[34]);
                                                $valores->proyeccion = utf8_encode($valorinv[35]);
                                                $var = self::valInsertarDatosConstructor($valores, $params, $key);
                                                if ($var != null)
                                                    $datosmal[] = $var;
                                            } else {
                                                if ($valorinv[1] == "Otros indicadores") {
                                                    $valores->inversion = utf8_encode($valorinv[3]);
                                                    $valores->indicador = utf8_encode($valorinv[12]);
                                                    $valores->cantidad = utf8_encode($valorinv[13]);
                                                    $valores->posterior = utf8_encode($valorinv[14]);
                                                    $var = self::valInsertarDatosOtrosInd($valores, $params, $key);
                                                    if ($var != null)
                                                        $datosmal[] = $var;
                                                } else {
                                                    if ($valorinv[1] == "Nivel de actividad") {
                                                        $valores->inversion = utf8_encode($valorinv[3]);
                                                        $valores->nivel = utf8_encode($valorinv[15]);
                                                        $valores->cantidad = utf8_encode($valorinv[16]);
                                                        $valores->posterior = utf8_encode($valorinv[17]);
                                                        $var = self::valInsertarDatosNA($valores, $params, $key);
                                                        if ($var != null)
                                                            $datosmal[] = $var;
                                                    } else {

                                                        if ($valorinv[1] == "Otros indicadores desglose") {
                                                            $valores->inversion = utf8_encode($valorinv[3]);
                                                            $valores->indicador = utf8_encode($valorinv[12]);
                                                            $valores->ejecutado = utf8_encode($valorinv[32]);
                                                            $valores->estimado = utf8_encode($valorinv[33]);
                                                            $valores->plan = utf8_encode($valorinv[34]);
                                                            $valores->proyeccion = utf8_encode($valorinv[35]);
                                                            $var = self::valInsertarDatosOtrosIndDes($valores, $params, $key);
                                                            if ($var != null)
                                                                $datosmal[] = $var;
                                                        } else {
                                                            if ($valorinv[1] == "Equipo") {
                                                                $valores->inversion = utf8_encode($valorinv[3]);
                                                                $valores->componente = utf8_encode($valorinv[5]);
                                                                $valores->indicador = utf8_encode($valorinv[8]);
                                                                $valores->modelo = utf8_encode($valorinv[9]);
                                                                $valores->ejecutado = utf8_encode($valorinv[32]);
                                                                $valores->estimado = utf8_encode($valorinv[33]);
                                                                $valores->plan = utf8_encode($valorinv[34]);
                                                                $valores->proyectado = utf8_encode($valorinv[35]);
                                                                $var = self::valInsertarDatosEquipos($valores, $params, $key);
                                                                if ($var != null)
                                                                    $datosmal[] = $var;
                                                            } else {

                                                                if ($valorinv[1] == "Nivel de actividad desglose") {
                                                                    $valores->inversion = utf8_encode($valorinv[3]);
                                                                    $valores->nivel = utf8_encode($valorinv[15]);
                                                                    $valores->ejecutado = utf8_encode($valorinv[32]);
                                                                    $valores->estimado = utf8_encode($valorinv[33]);
                                                                    $valores->plan = utf8_encode($valorinv[34]);
                                                                    $valores->proyeccion = utf8_encode($valorinv[35]);
                                                                    $var = self::valInsertarNADes($valores, $params, $key);
                                                                    if ($var != null)
                                                                        $datosmal[] = $var;
                                                                } else {
                                                                    if ($valorinv[1] == "Medio ambiente") {
                                                                        $valores->inversion = utf8_encode($valorinv[3]);
                                                                        $valores->medio = utf8_encode($valorinv[18]);
                                                                        $valores->tipo = utf8_encode($valorinv[19]);
                                                                        $valores->mediopadre = utf8_encode($valorinv[20]);
                                                                        $valores->tipopadre = utf8_encode($valorinv[21]);
                                                                        $var = self::valInsertarMA($valores, $params, $key);
                                                                        if ($var != null)
                                                                            $datosmal[] = $var;
                                                                    } else {
                                                                        if ($valorinv[1] == "Medio ambiente presupuesto") {
                                                                            $valores->inversion = utf8_encode($valorinv[3]);
                                                                            $valores->medio = utf8_encode($valorinv[18]);
                                                                            $valores->tipo = utf8_encode($valorinv[19]);
                                                                            $valores->mediopadre = utf8_encode($valorinv[20]);
                                                                            $valores->tipopadre = utf8_encode($valorinv[21]);
                                                                            $valores->valor = utf8_encode($valorinv[22]);
                                                                            $valores->moneda = utf8_encode($valorinv[23]);
                                                                            $var = self::valInsertarMAP($valores, $params, $key);
                                                                            if ($var != null)
                                                                                $datosmal[] = $var;
                                                                        } else {
                                                                            if ($valorinv[1] == "Medio ambiente desglose") {
                                                                                $valores->inversion = utf8_encode($valorinv[3]);
                                                                                $valores->medio = utf8_encode($valorinv[18]);
                                                                                $valores->tipo = utf8_encode($valorinv[19]);
                                                                                $valores->mediopadre = utf8_encode($valorinv[20]);
                                                                                $valores->tipopadre = utf8_encode($valorinv[21]);
                                                                                $valores->ejecutado = utf8_encode($valorinv[32]);
                                                                                $valores->estimado = utf8_encode($valorinv[33]);
                                                                                $valores->plan = utf8_encode($valorinv[34]);
                                                                                $valores->proyectado = utf8_encode($valorinv[35]);
                                                                                $valores->moneda = utf8_encode($valorinv[23]);
                                                                                $var = self::valInsertarMADes($valores, $params, $key);
                                                                                if ($var != null)
                                                                                    $datosmal[] = $var;
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                } else {
                    $datosmal[] = 'El ejercicio actual del sistema no coincide con el que desea importar.';
                }
                return $datosmal;
            }
        }
    }

    public function insertarElementoValor($elementosvalor) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionElemvalor = new Doctrine_Collection("DatElementovalor");
        foreach ($elementosvalor as $index => $elemvalor) {
            $objElemvalor = new DatElementovalor();
            $objElemvalor->idelemento = $elemvalor['idelemento'];
            $objElemvalor->idmonedaentidad = $elemvalor['idmonedaentidad'];
            $objElemvalor->valor = $elemvalor['valor'];
            $collectionElemvalor[$index] = $objElemvalor;
        }
        $collectionElemvalor->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function insertarInversiones($datosInversiones) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();

        $collectionInversiones = new Doctrine_Collection('DatInversion');

        foreach ($datosInversiones as $index => $datosInv) {
            $objInv = new DatInversion();
            $objInv->idtipoinversion = $datosInv['idtipoinversion'];
            $objInv->idgrupoobra = $datosInv['idgrupoobra'];
            $objInv->idefectocomercial = $datosInv['idefectocomercial'];
            $objInv->idejercicio = $datosInv['idejercicio'];
            $objInv->idtipoinversionprograma = $datosInv['idtipoinveprograma'];
            $objInv->idformapropiedad = $datosInv['idformapropiedad'];
            $objInv->idcaracteristica = $datosInv['idcaracteristica'];
            $objInv->idobjetivo = $datosInv['idobjetivo'];
            $objInv->idestadoinversion = $datosInv['idestadoinv'];
            $objInv->idestadoaprobacion = $datosInv['idestadoaprobacion'];
            $objInv->idprovincia = $datosInv['idprovincia'];
            $objInv->idcumplimientoinversion = $datosInv['idcumplumientoinv'];
            $objInv->idprograma = $datosInv['idprograma'];
            $objInv->idmedioambiente = $datosInv['idmedioamb'];
            $objInv->idestadoplaninversion = $datosInv['idestadoplaninv'];
            $objInv->idsectorestrategico = $datosInv['idsectorestrate'];
            $objInv->iddatdesempenno = $datosInv['iddesempenno'];
            $objInv->fechainicio = $datosInv['fechainicio'];
            $objInv->fechafin = $datosInv['fechafin'];
            $objInv->fasttrack = $datosInv['fasttrack'];
            $objInv->denominacion = utf8_encode($datosInv['denominacion']);
            $objInv->codigo = $datosInv['codigo'];
            $objInv->observaciones = utf8_encode($datosInv['observaciones']);
            $objInv->analpostinversiones = $datosInv['analpostinversiones'];
            $objInv->preparacion = $datosInv['preparacion'];
            $objInv->idestructuracomun = $datosInv['identidad'];
            $objInv->cuadrada = $datosInv['cuadrada'];
            $objInv->idcontenido = null;
            $collectionInversiones[$index] = $objInv;
        }
        $collectionInversiones->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();

        /*  $con = Doctrine_Manager::connection();
          foreach ($datosInversiones as $index => $datosInv) {
          $datosInv['idgrupoobra'] = null;
          $codigo = $datosInv['codigo'];
          $denom = $datosInv['denominacion'];
          $obs = $datosInv['observaciones'];
          $fechaini = $datosInv['fechainicio'];
          $fechafin = $datosInv['fechafin'];
          if($datosInv['idgrupoobra']!="" || $datosInv['idgrupoobra']!=null){
          $sql = "INSERT INTO mod_planifinversiones.dat_inversion(idtipoinversion,
          idestructuracomun, idejercicio, fechainicio, fechafin, idtipoinversionprograma,
          idformapropiedad, idcaracteristica, idobjetivo, fasttrack, idestadoinversion,
          denominacion, codigo, idefectocomercial, idestadoaprobacion, idprovincia,
          idcumplimientoinversion,observaciones, analpostinversiones, iddatdesempenno,
          idprograma, idmedioambiente, idgrupoobra, idestadoplaninversion,
          preparacion, idsectorestrategico)
          VALUES (" . $datosInv['idtipoinversion'] . "," . $datosInv['identidad'] . "," . $datosInv['idejercicio'] . ",'$fechaini',
          '$fechafin'," . $datosInv['idtipoinveprograma'] . "," . $datosInv['idformapropiedad'] . "," . $datosInv['idcaracteristica'] . ",
          " . $datosInv['idobjetivo'] . "," . $datosInv['fasttrack'] . "," . $datosInv['idestadoinv'] . ",'$denom',
          '$codigo'," . $datosInv['idefectocomercial'] . "," . $datosInv['idestadoaprobacion'] . "," . $datosInv['idprovincia'] . ",
          " . $datosInv['idcumplumientoinv'] . ",'$obs'," . $datosInv['analpostinversiones'] . "," . $datosInv['iddesempenno'] . ",
          " . $datosInv['idprograma'] . "," . $datosInv['idmedioamb'] . "," . $datosInv['idgrupoobra'] . "," . $datosInv['idestadoplaninv'] . ",
          " . $datosInv['preparacion'] . "," . $datosInv['idsectorestrate'] . ");";
          } else {

          $sql = "INSERT INTO mod_planifinversiones.dat_inversion(idtipoinversion,
          idestructuracomun, idejercicio, fechainicio, fechafin, idtipoinversionprograma,
          idformapropiedad, idcaracteristica, idobjetivo, fasttrack, idestadoinversion,
          denominacion, codigo, idefectocomercial, idestadoaprobacion, idprovincia,
          idcumplimientoinversion,observaciones, analpostinversiones, iddatdesempenno,
          idprograma, idmedioambiente, idestadoplaninversion,
          preparacion, idsectorestrategico)
          VALUES (" . $datosInv['idtipoinversion'] . "," . $datosInv['identidad'] . "," . $datosInv['idejercicio'] . ",'$fechaini',
          '$fechafin'," . $datosInv['idtipoinveprograma'] . "," . $datosInv['idformapropiedad'] . "," . $datosInv['idcaracteristica'] . ",
          " . $datosInv['idobjetivo'] . "," . $datosInv['fasttrack'] . "," . $datosInv['idestadoinv'] . ",'$denom',
          '$codigo'," . $datosInv['idefectocomercial'] . "," . $datosInv['idestadoaprobacion'] . "," . $datosInv['idprovincia'] . ",
          " . $datosInv['idcumplumientoinv'] . ",'$obs'," . $datosInv['analpostinversiones'] . "," . $datosInv['iddesempenno'] . ",
          " . $datosInv['idprograma'] . "," . $datosInv['idmedioamb'] . "," . $datosInv['idestadoplaninv'] . ",
          " . $datosInv['preparacion'] . "," . $datosInv['idsectorestrate'] . ");";
          }
          $con->fetchAssoc($sql);
          } */
    }

    public function updateInversiones($datosInversionesUpdate) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();

        $collectionInversiones = new Doctrine_Collection('DatInversion');
        foreach ($datosInversionesUpdate as $index => $datosInv) {
            $objInv = Doctrine::getTable('DatInversion')->find($datosInv['idinversion']);
            $objInv->idtipoinversion = $datosInv['idtipoinversion'];
            $objInv->idgrupoobra = $datosInv['idgrupoobra'];
            $objInv->idefectocomercial = $datosInv['idefectocomercial'];
            $objInv->idejercicio = $datosInv['idejercicio'];
            $objInv->idtipoinversionprograma = $datosInv['idtipoinveprograma'];
            $objInv->idformapropiedad = $datosInv['idformapropiedad'];
            $objInv->idcaracteristica = $datosInv['idcaracteristica'];
            $objInv->idobjetivo = $datosInv['idobjetivo'];
            $objInv->idestadoinversion = $datosInv['idestadoinv'];
            $objInv->idestadoaprobacion = $datosInv['idestadoaprobacion'];
            $objInv->idprovincia = $datosInv['idprovincia'];
            $objInv->idcumplimientoinversion = $datosInv['idcumplumientoinv'];
            $objInv->idprograma = $datosInv['idprograma'];
            $objInv->idmedioambiente = $datosInv['idmedioamb'];
            $objInv->idestadoplaninversion = $datosInv['idestadoplaninv'];
            $objInv->idsectorestrategico = $datosInv['idsectorestrate'];
            $objInv->iddatdesempenno = $datosInv['iddesempenno'];
            $objInv->fechainicio = $datosInv['fechainicio'];
            $objInv->fechafin = $datosInv['fechafin'];
            $objInv->fasttrack = $datosInv['fasttrack'];
            $objInv->denominacion = utf8_encode($datosInv['denominacion']);
            $objInv->codigo = $datosInv['codigo'];
            $objInv->observaciones = utf8_encode($datosInv['observaciones']);
            $objInv->analpostinversiones = $datosInv['analpostinversiones'];
            $objInv->preparacion = $datosInv['preparacion'];
            $objInv->idestructuracomun = $datosInv['identidad'];
            $objInv->cuadrada = $datosInv['cuadrada'];
            $objInv->idcontenido = null;
            $collectionInversiones[$index] = $objInv;
        }
        $collectionInversiones->save();

        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function insertarEquipo($equipos) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();

        $collectionEquipos = new Doctrine_Collection("DatEtapaEquipo");
        foreach ($equipos as $index => $eq) {
            $objetaequip = new DatEtapaEquipo();
            $objetaequip->idindicador = $eq['idindicador'];
            $objetaequip->identidadmodelo = $eq['identidadmodelo'];
            $objetaequip->idejercicio = $eq['idejercicio'];
            $objetaequip->precio = $eq['precio'];
            $objetaequip->idunidadmedida = $eq['idunidadmedida'];
            $objetaequip->idcentrobalance = $eq['idcentrobalance'];
            $objetaequip->cantidad = $eq['cantidad'];
            $objetaequip->importe = $eq['importe'];
            $objetaequip->preciodivisa = $eq['preciodivisa'];
            $objetaequip->importedivisa = $eq['importedivisa'];
            $objetaequip->idetapainversion = $eq['idetapainversion'];
            $objetaequip->idadquisicion = $eq['idadquisicion'];
            $objetaequip->idcomprar = $eq['idcomprar'];
            $objetaequip->observaciones = $eq['observaciones'];
            $objetaequip->idcomprarpais = $eq['idcomprarpais'];
            $collectionEquipos[$index] = $objetaequip;
        }
        $collectionEquipos->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function updateEquipo($equipos) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();

        $collectionEquipos = new Doctrine_Collection("DatEtapaEquipo");
        foreach ($equipos as $index => $eq) {
            $ind = $eq['idindicador'];
            $identmod = $eq['identidadmodelo'];
            $objetaequip = Doctrine::getTable("DatEtapaEquipo")->findByDql("idindicador = $ind AND identidadmodelo = $identmod");
            $objetaequip[0]->idindicador = $eq['idindicador'];
            $objetaequip[0]->identidadmodelo = $eq['identidadmodelo'];
            $objetaequip[0]->idejercicio = $eq['idejercicio'];
            $objetaequip[0]->precio = $eq['precio'];
            $objetaequip[0]->idunidadmedida = $eq['idunidadmedida'];
            $objetaequip[0]->idcentrobalance = $eq['idcentrobalance'];
            $objetaequip[0]->cantidad = $eq['cantidad'];
            $objetaequip[0]->importe = $eq['importe'];
            $objetaequip[0]->preciodivisa = $eq['preciodivisa'];
            $objetaequip[0]->importedivisa = $eq['importedivisa'];
            $objetaequip[0]->idetapainversion = $eq['idetapainversion'];
            $objetaequip[0]->idadquisicion = $eq['idadquisicion'];
            $objetaequip[0]->idcomprar = $eq['idcomprar'];
            $objetaequip[0]->observaciones = $eq['observaciones'];
            $objetaequip[0]->idcomprarpais = $eq['idcomprarpais'];
            $collectionEquipos[$index] = $objetaequip[0];
        }
        $collectionEquipos->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function insertarPreparacion($preparaciones) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionPreparacion = new Doctrine_Collection("DatPresanteproy");
        foreach ($preparaciones as $index => $prep) {
            $objPrep = new DatPresanteproy();
            $objPrep->idinversion = $prep['idinversion'];
            $objPrep->idmonedaentidad = $prep['idmonedadentidad'];
            $objPrep->valor = $prep['valor'];
            $collectionPreparacion[$index] = $objPrep;
        }
        $collectionPreparacion->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function updatePreparacion($preparaciones) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionPreparacion = new Doctrine_Collection("DatPresanteproy");
        foreach ($preparaciones as $index => $prep) {
            $idinv = $prep['idinversion'];
            $idmoneda = $prep['idmonedadentidad'];
            $objPrep = Doctrine::getTable("DatPresanteproy")->findByDql("idinversion = $idinv AND idmonedaentidad = $idmoneda ");
            $objPrep[0]->idinversion = $prep['idinversion'];
            $objPrep[0]->idmonedaentidad = $prep['idmonedadentidad'];
            $objPrep[0]->valor = $prep['valor'];
            $collectionPreparacion[$index] = $objPrep[0];
        }
        $collectionPreparacion->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function insertarErogacion($erogaciones) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionErogacion = new Doctrine_Collection("DatErogacionliquido");
        foreach ($erogaciones as $index => $erog) {
            $objEro = new DatErogacionliquido();
            $objEro->idmonedaentidad = $erog['idmonedadentidad'];
            $objEro->idinversion = $erog['idinversion'];
            $objEro->valor = $erog['valor'];
            $collectionErogacion[$index] = $objEro;
        }
        $collectionErogacion->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function updateErogacion($erogaciones) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionErogacion = new Doctrine_Collection("DatErogacionliquido");
        foreach ($erogaciones as $index => $erog) {
            $idinv = $erog['idinversion'];
            $idmoneda = $erog['idmonedadentidad'];
            $objEro = Doctrine::getTable('DatErogacionliquido')->findByDql("idinversion = $idinv AND idmonedaentidad = $idmoneda ");
            $objEro[0]->idmonedaentidad = $erog['idmonedadentidad'];
            $objEro[0]->valor = $erog['valor'];
            $collectionErogacion[$index] = $objEro[0];
        }
        $collectionErogacion->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function insertarFinanciamiento($financiamientos) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionFinam = new Doctrine_Collection("DatFinanciamiento");
        foreach ($financiamientos as $index => $finam) {
            $objFinam = new DatFinanciamiento();
            $objFinam->idtipofinanciamiento = $finam['idtipofinanciamiento'];
            $objFinam->idfinancista = $finam['idfinacista'];
            $objFinam->valor = $finam['valor'];
            $objFinam->porcientointeres = $finam['porcientointeres'];
            $objFinam->plazoamortizacion = $finam['plazoamortizacion'];
            $objFinam->gracia = $finam['gracia'];
            $objFinam->idinversion = $finam['idinversion'];
            $objFinam->idmonedaentidad = $finam['idmonedaentidad'];
            $collectionFinam[$index] = $objFinam;
        }
        $collectionFinam->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function updateFinanciamiento($financiamientos) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionFinam = new Doctrine_Collection("DatFinanciamiento");
        
        foreach ($financiamientos as $index => $finam) {
            $idinv = $finam['idinversion'];
            $idmoneda = $finam['idmonedaentidad'];
            $idtipofinam = $finam['idtipofinanciamiento'];
            $idfinancista = $finam['idfinacista'];
            $objFinam = Doctrine::getTable("DatFinanciamiento")->findByDql("idinversion = $idinv AND idmonedaentidad = $idmoneda AND idfinancista = $idfinancista AND idtipofinanciamiento= $idtipofinam");
            $objFinam[0]->idtipofinanciamiento = $finam['idtipofinanciamiento'];
            $objFinam[0]->idfinancista = $finam['idfinacista'];
            $objFinam[0]->valor = $finam['valor'];
            $objFinam[0]->porcientointeres = $finam['porcientointeres'];
            $objFinam[0]->plazoamortizacion = $finam['plazoamortizacion'];
            $objFinam[0]->gracia = $finam['gracia'];
            $objFinam[0]->idinversion = $finam['idinversion'];
            //$objFinam->idinversion = $finam['idinversion'];
            $objFinam[0]->idmonedaentidad = $finam['idmonedaentidad'];
            $collectionFinam[$index] = $objFinam[0];
        }
       /* print_r($collectionFinam);
                                        die;*/
        $collectionFinam->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function insertarConstructor($constructores) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionConstructor = new Doctrine_Collection("DatEtapainverconsprov");
        foreach ($constructores as $index => $cons) {
            $objConstru = new DatEtapainverconsprov();
            $objConstru->idetapainversion = $cons['idetapainversion'];
            $objConstru->iddpt = $cons['idprovincia'];
            $objConstru->idconstructor = $cons['idconstructor'];
            $collectionConstructor[$index] = $objConstru;
        }
        $collectionConstructor->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function updateConstructor($constructores) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionConstructor = new Doctrine_Collection("DatEtapainverconsprov");
        foreach ($constructores as $index => $cons) {
            $idetapainversion = $cons['idetapainversion'];
            $idprovincia = $cons['idprovincia'];
            $idconstructor = $cons['idconstructor'];
            $objConst = Doctrine::getTable("DatEtapainverconsprov")->findByDql("idetapainversion = $idetapainversion AND iddpt = $idprovincia AND idconstructor = $idconstructor ");
            $objConst[0]->idetapainversion = $cons['idetapainversion'];
            $objConst[0]->iddpt = $cons['idprovincia'];
            $objConst[0]->idconstructor = $cons['idconstructor'];
            $collectionConstructor[$index] = $objConst[0];
        }
        $collectionConstructor->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function insertarEtapaInversion($componentes, $idinv) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionEtapaInv = new Doctrine_Collection('DatEtapaInversion');
        foreach ($componentes as $index => $comp) {
            $objEtapaInv = new DatEtapaInversion();
            $objEtapaInv->idetapa = $comp['idetapa'];
            $objEtapaInv->idestadoft = $comp['idestadoflujotrabajo'];
            $objEtapaInv->idinversion = $idinv[0]['idinversion'];
            $collectionEtapaInv[$index] = $objEtapaInv;
        }
        $collectionEtapaInv->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function updateEtapaInversion($componentes, $idinv) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionEtapaInv = new Doctrine_Collection("DatEtapaInversion");
        foreach ($componentes as $index => $comp) {
            $idetapa = $comp['idetapa'];
            $objEtapaInv = Doctrine::getTable('DatEtapaInversion')->findByDql("idinversion = $idinv and idetapa = $idetapa");
            $objEtapaInv[0]->idetapa = $idetapa;
            $objEtapaInv[0]->idestadoft = $comp['idestadoflujotrabajo'];
            $collectionEtapaInv[$index] = $objEtapaInv[0];
        }
        $collectionEtapaInv->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function deleteEtapaInversion($idinv) {
        $con = Doctrine_Manager::connection();
        $sql = "DELETE FROM mod_planifinversiones.dat_etapainversion eti
        WHERE eti.idinversion = $idinv";
        $con->fetchAssoc($sql);
    }

    public function obtenerErogLiquido($idinv) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT eroloq.idinversion
FROM mod_planifinversiones.dat_erogacionliquido eroloq
WHERE eroloq.idinversion = $idinv";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function deleteEtapaElemInversion($idetapainv) {
        $con = Doctrine_Manager::connection();
        $sql = "DELETE FROM mod_planifinversiones.dat_etapaelementoinversion eti
WHERE eti.idetapainversion = $idetapainv";
        $con->fetchAssoc($sql);
    }

    public function obtenerElemInversion($idetapainv) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT etielem.idetapainversion
FROM mod_planifinversiones.dat_etapaelementoinversion etielem
  WHERE etielem.idetapainversion = $idetapainv";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function insertarEtapaElementoInversion($elementos) {
        $dm = Doctrine_Manager::getInstance();
        //Capturo una instancia de la conexion
        $con = $dm->getCurrentConnection();
        $collectionElemInv = new Doctrine_Collection("DatEtapaElementoinversion");
        foreach ($elementos as $index => $elem) {
            $objElem = new DatEtapaElementoinversion();
            $objElem->idetapainversion = $elem['idetapainversion'];
            $objElem->idelemento = $elem['idelemento'];
            $collectionElemInv[$index] = $objElem;
        }
        $collectionElemInv->save();
        $con->commit();
        //Habro una nueva transaccion de doctrine para la proxima ejecucion
        $con->beginTransaction();
    }

    public function obtenerAdquisicion($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT adq.idadquisicion
FROM mod_planifinversiones.dat_adquisicion adq
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (adq.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = adq.idnomenclador)
WHERE nomdat.denominacion LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerIndicadorExist($idind, $identmo,$idetapainv,$idejer) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT ete.idindicador
FROM mod_planifinversiones.dat_etapaequipos ete
WHERE ete.idindicador = $idind AND ete.identidadmodelo = $identmo AND ete.idetapainversion = $idetapainv AND ete.idejercicio = $idejer;";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerComprar($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT comp.idcomprar
FROM mod_planifinversiones.dat_comprar comp
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (comp.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = comp.idnomenclador)
WHERE nomdat.denominacion LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerUnidadMedida($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT um.idunidadmedida
FROM mod_datosmaestros.nom_unidadmedida um
WHERE um.denominacionunidadmedida = '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerEntidadmodelo($identidad, $plan) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT entmod.identidadmodelo
FROM mod_planificacion.dat_entidadmodelo entmod
INNER JOIN mod_planificacion.dat_modelo mod ON (entmod.idmodelo = mod.idmodelo)
WHERE entmod.identidad = $identidad AND mod.denominacion LIKE '$plan'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerCentroBalance($centrobalance) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT entdatos.identidaddatosnomenclador as idcentrobalance
FROM mod_planificacion.dat_entidaddatosnomenclador entdatos
INNER JOIN mod_planificacion.nom_datosnomenclador nomdatos ON (entdatos.iddatosnomenclador = nomdatos.iddatosnomenclador)
INNER JOIN mod_estructuracomp.dat_estructura estr ON(entdatos.identidad = estr.idestructura)
WHERE estr.denominacion = '$centrobalance' AND nomdatos.denominacion LIKE 'Centro de balance'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerEjercicio($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT nomejer.idejercicio
FROM mod_planificacion.nom_ejercicioplanificacion nomejer
WHERE nomejer.ejercicio LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerIndicador($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT ind.idindicador
FROM mod_datosmaestros.nom_indicador ind
WHERE ind.codigo LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerEtapa($idtipoinv) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT et.idetapa,nom.denominacion,et.idestadoflujotrabajo
FROM mod_planifinversiones.nom_tipoinversion tipo
INNER JOIN mod_planifinversiones.conf_formatoetapa conf ON(conf.idformatoetapa = tipo.idformatoetapa)
INNER JOIN mod_planifinversiones.dat_etapa et ON(et.idformatoetapa = conf.idformatoetapa)
INNER JOIN mod_planifinversiones.nom_nombreetapa nom ON(nom.idnombreetapa = et.idnombreetapa)
WHERE tipo.idtipoinversion = $idtipoinv";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerElementoInv($idtipoinv) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT Distinct el.idelemento,et.idetapa
FROM mod_planifinversiones.nom_tipoinversion tipo
INNER JOIN mod_planifinversiones.conf_formatoetapa conf ON(conf.idformatoetapa = tipo.idformatoetapa)
INNER JOIN mod_planifinversiones.dat_etapa et ON(et.idformatoetapa = conf.idformatoetapa)
INNER JOIN mod_planifinversiones.dat_elemento el ON(el.idetapa = et.idetapa)
WHERE tipo.idtipoinversion = $idtipoinv";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerProvincia($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT prov.iddpt as idprovincia
FROM mod_datosmaestros.nom_dpt prov
WHERE prov.denominacion LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerConstructor($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT const.idconstructor
FROM mod_planifinversiones.dat_constructor const
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (const.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = const.idnomenclador)
WHERE nomdat.denominacion LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerFinancista($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT tipofinancista.idfinancista
FROM mod_planifinversiones.dat_financista tipofinancista
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (tipofinancista.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = tipofinancista.idnomenclador)
WHERE nomdat.denominacion LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerTipoFinancimiento($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT tipofin.idtipofinanciamiento
FROM mod_planifinversiones.dat_tipofinanciamiento tipofin
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (tipofin.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = tipofin.idnomenclador)
WHERE nomdat.denominacion LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obetenerInversion($codigo, $identidad) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT inv.idinversion, inv.codigo, inv.idtipoinversion
FROM mod_planifinversiones.dat_inversion inv
WHERE inv.codigo = '$codigo' and inv.idestructuracomun=$identidad";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerPreparacionDadoInversion($idinversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT antpro.idinversion
FROM mod_planifinversiones.dat_presanteproy antpro
WHERE antpro.idinversion = $idinversion";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerInversionEnEtapaInversion($idinv) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT DISTINCT inv.idinversion,inv.idetapainversion
FROM mod_planifinversiones.dat_etapainversion inv
WHERE inv.idinversion = $idinv ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerEq($codigo) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idindicador
FROM mod_datosmaestros.nom_indicador
where codigo = '$codigo'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obteneridetapaequipo($idindicador, $identidadmodelo, $idetapainversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idetapaequipos
FROM mod_planifinversiones.dat_etapaequipos
where idindicador = $idindicador AND
      identidadmodelo =$identidadmodelo AND
      idetapainversion = $idetapainversion";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obetenerIndicador($codigo) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idnomotrosindicadores
FROM mod_planifinversiones.nom_otrosindicadores
where denominacion = '$codigo'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerNivel($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT c.iddatcapexplotacion
FROM mod_planifinversiones.dat_capexplotacion c
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (c.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = c.idnomenclador)
WHERE nomdat.denominacion LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerMApadre($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT c.iddatosnomenclador,c.idnomenclador
FROM mod_planifinversiones.dat_sector c
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (c.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = c.idnomenclador)
WHERE nomdat.denominacion LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerMABahia($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT c.iddatosnomenclador,c.idnomenclador
FROM mod_planifinversiones.dat_bahia c
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (c.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = c.idnomenclador)
WHERE nomdat.denominacion LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerMACuenca($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT c.iddatosnomenclador,c.idnomenclador
FROM mod_planifinversiones.dat_cuenca c
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (c.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = c.idnomenclador)
WHERE nomdat.denominacion LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerMAAcc($nombre) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT c.iddatosnomenclador,c.idnomenclador
FROM mod_planifinversiones.dat_accion c
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (c.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = c.idnomenclador)
WHERE nomdat.denominacion LIKE '$nombre'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerMAGlobal($idinversion, $iddatosnomenclador, $iddatosnomencladorpadre, $idnomenclador) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idmedioambglobal
                FROM mod_planifinversiones.dat_medioambglobal
                where idinversion = $idinversion AND
                iddatosnomenclador = $iddatosnomenclador AND
                iddatosnomencladorpadre = $iddatosnomencladorpadre AND
                idnomenclador = $idnomenclador";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerMAGlobalPadre($idinversion, $iddatosnomenclador, $iddatosnomencladorpadre, $idnomenclador) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idmedioambglobal
                FROM mod_planifinversiones.dat_medioambglobal
                where idinversion = $idinversion AND
                iddatosnomenclador = $iddatosnomenclador AND
                iddatosnomencladorpadre = $iddatosnomencladorpadre AND
                idnomenclador = $idnomenclador";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obetenerInversionPlanPrep($idinversion, $idmonedaentidad) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idpresanteproy
FROM mod_planifinversiones.dat_presanteproy
WHERE idinversion =$idinversion AND idmonedaentidad =$idmonedaentidad";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerrelacionfinancista($financista, $inversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT distinct f.idfinancista
FROM mod_planifinversiones.dat_financista f
     INNER JOIN mod_planifinversiones.dat_financiamiento fin ON f.idfinancista =
       fin.idfinancista
     INNER JOIN mod_planifinversiones.dat_inversion i ON i.idinversion =
       fin.idinversion
WHERE i.idinversion = $inversion AND f.idfinancista=$financista";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerrelacionacreedor($financista, $inversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT distinct f.idtipofinanciamiento
FROM mod_planifinversiones.dat_tipofinanciamiento f
     INNER JOIN mod_planifinversiones.dat_financiamiento fin ON f.idtipofinanciamiento =
       fin.idtipofinanciamiento
     INNER JOIN mod_planifinversiones.dat_inversion i ON i.idinversion =
       fin.idinversion
WHERE i.idinversion = $inversion AND f.idtipofinanciamiento=$financista";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function comprobacionNomencladorInversiones($valores) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT
(SELECT tipinv.idtipoinversion
FROM mod_planifinversiones.nom_tipoinversion tipinv
WHERE tipinv.denominacion LIKE '$valores->tipo_inversion') as tipoinversion,

(SELECT nomejer.idejercicio
FROM mod_planificacion.nom_ejercicioplanificacion nomejer
WHERE nomejer.ejercicio LIKE '$valores->ejercicio') as ejercicio,

(SELECT tipinvpro.idtipoinversionprograma
FROM mod_planifinversiones.dat_tipoinversionprograma tipinvpro
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (tipinvpro.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = tipinvpro.idnomenclador)
WHERE nomdat.denominacion LIKE '$valores->inv_programa') as tipoinveprograma,

(SELECT forma.idformapropiedad
FROM mod_planifinversiones.dat_formapropiedad forma
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (forma.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = forma.idnomenclador)
WHERE nomdat.denominacion LIKE '$valores->forma_prop') as formapropiedad,

(SELECT caract.idcaracteristica
FROM mod_planifinversiones.dat_caracteristica caract
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (caract.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = caract.idnomenclador)
WHERE nomdat.denominacion LIKE '$valores->caracteristica') as caracteristica,

(SELECT obj.idobjetivo
FROM mod_planifinversiones.dat_objetivo obj
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (obj.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = obj.idnomenclador)
WHERE nomdat.denominacion LIKE '$valores->objetivo') as objetivo,

(SELECT estinv.idestadoinversion
FROM mod_planifinversiones.nom_estadoinversion estinv
WHERE estinv.denominacion LIKE '$valores->estado_inv') as estadoinv,

(SELECT efecinv.idefectocomercial
FROM mod_planifinversiones.dat_efectocomercial efecinv
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (efecinv.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = efecinv.idnomenclador)
WHERE nomdat.denominacion LIKE '$valores->efecto_comercial') as efectocomercial,

(SELECT apinv.idestadoaprobacion
FROM mod_planifinversiones.nom_estadoaprobacion apinv
WHERE apinv.denominacion LIKE '$valores->estado_aprob') as estadoaprobacion,

(SELECT prov.iddpt
FROM mod_datosmaestros.nom_dpt prov
WHERE prov.iddpt = $valores->provincia) as provincia,

(SELECT cumpinv.idcumplimientoinversion
FROM mod_planifinversiones.nom_cumplimientoinversion cumpinv
WHERE cumpinv.denominacion LIKE '$valores->cumpli_inv') cumplumientoinv,

(SELECT deseinv.iddatdesempenno
FROM mod_planifinversiones.dat_desempenno deseinv
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (deseinv.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = deseinv.idnomenclador)
WHERE nomdat.denominacion LIKE '$valores->desempenno') as desempenno,

(SELECT proing.idprograma
FROM mod_planifinversiones.dat_programa proing
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (proing.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = proing.idnomenclador)
WHERE nomdat.denominacion LIKE '$valores->programa') as programa,

(SELECT ambinv.idmedioambiente
FROM mod_planifinversiones.dat_medioambiente ambinv
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (ambinv.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = ambinv.idnomenclador)
WHERE nomdat.denominacion LIKE '$valores->medio_amb') as medioamb,

(SELECT gruinv.idgrupoobra
FROM mod_planifinversiones.dat_grupoobra gruinv
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (gruinv.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = gruinv.idnomenclador)
WHERE nomdat.denominacion LIKE '$valores->grupo_obra') as grupoobra,

(SELECT estplainv.idestadoplaninversion
FROM mod_planifinversiones.dat_estadoplaninversion estplainv
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (estplainv.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = estplainv.idnomenclador)
WHERE nomdat.denominacion LIKE '$valores->estado_planinv') as estadoplaninv,

(SELECT secestinv.idsectorestrategico
FROM mod_planifinversiones.dat_sectorestrategico secestinv
INNER JOIN mod_planificacion.nom_datosnomenclador nomdat ON (secestinv.iddatosnomenclador = nomdat.iddatosnomenclador)
INNER JOIN mod_planifinversiones.nom_nomenclador nom ON (nom.idnomenclador = secestinv.idnomenclador)
WHERE nomdat.denominacion LIKE '$valores->sector_estrat') as sectorestrate";
        //print_r($sql);die;
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function valInsertarDatosPresupuesto($valores, $params, $key) {
        $componente = self::obetenercomponente($valores->componente);
        if ($componente[0]) {
            $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);
            if ($inversion[0]) {
                $componenteTipoInv = self::obetenercomponentetipoinversion($valores->componente, $inversion[0]['idtipoinversion']);
                if ($componenteTipoInv[0]) {
                    $idInvComp = self::obtenerRelacionInvComponete($inversion[0]['idinversion'], $componenteTipoInv[0]['idetapa']);
                    if ($idInvComp[0]) {
                        $idmoneda = self::obtenerMoneda($valores->moneda);
                        if ($idmoneda[0]) {
                            $idejecutado = self::obtenerEjecutado($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idInvComp[0]['idetapainversion']);
                            if ($idejecutado[0]) {
//modificar
                                self:: modificarEjecutado($valores->ejecutado, $idejecutado[0]['idplaninversetapaejecutado']);
                            } else {
//insertar
                                self:: adicionarEjecutado($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idInvComp[0]['idetapainversion'], $valores->ejecutado);
                            }

                            $idestimado = self::obtenerEstimado($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idInvComp[0]['idetapainversion']);
                            if ($idestimado[0]) {
//modificar
                                self:: modificarEstimado($valores->estimado, $idestimado[0]['idplaninversetapaestimado']);
                            } else {
//insertar
                                self:: adicionarEstimado($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idInvComp[0]['idetapainversion'], $valores->estimado);
                            }

                            $idplan = self::obtenerPlan($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idInvComp[0]['idetapainversion']);
                            if ($idplan[0]) {
//modificar
                                self:: modificarPlan($valores->plan, $idplan[0]['idplaninversetapaplan']);
                            } else {
//insertar
                                self:: adicionarPlan($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idInvComp[0]['idetapainversion'], $valores->plan);
                            }
                            $idproyeccion = self::obtenerProyeccion($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idInvComp[0]['idetapainversion']);
                            if ($idproyeccion[0]) {
//modificar
                                self:: modificarProyeccion($valores->proyeccion, $idproyeccion[0]['idplaninversetapaproyectado']);
                            } else {
//insertar
                                self:: adicionarProyeccion($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idInvComp[0]['idetapainversion'], $valores->proyeccion);
                            }
                        } else {
                            return 'Error en la fila ' . $key . ': no existe la moneda.';
                        }
                    } else {
                        return 'Error en la fila ' . $key . ': no existe la relación inversión  - componente.';
                    }
                } else {
                    return 'Error en la fila ' . $key . ': no existe la relación tipo de inversión  - componente.';
                }
            } else {
                return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe el componente.';
        }
    }

    public function valInsertarDatosContado($valores, $params, $key) {

        $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);

        if ($inversion[0]) {
            $idmoneda = self::obtenerMoneda($valores->moneda);
            if ($idmoneda[0]) {
                $monedaentidad = self::obtenerMonedaEntidad($idmoneda[0]['idmoneda'], $params['identidad']);
                if ($monedaentidad[0]) {
                    $idejecutado = self::obtenerContadoejecutado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion']);
                    if ($idejecutado[0]) {
//modificar
                        self:: modificarContadoejecutado($valores->ejecutado, $idejecutado[0]['idinverscontadoejecutado']);
                    } else {
//insertar
                        self:: adicionarContadoejecutado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->ejecutado);
                    }
                    $idestimado = self::obtenerContadoestimado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion']);
                    if ($idestimado[0]) {
//modificar
                        self:: modificarContadoestimado($valores->estimado, $idestimado[0]['idinverscontadoestimado']);
                    } else {
//insertar
                        self:: adicionarContadoestimado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->estimado);
                    }
                    $idplan = self::obtenerContadoplan($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion']);
                    if ($idplan[0]) {
//modificar
                        self:: modificarContadoplan($valores->plan, $idplan[0]['idinverscontadoplan']);
                    } else {
//insertar
                        self:: adicionarContadoplan($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->plan);
                    }
                    $idproyectado = self::obtenerContadoproyectado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion']);
                    if ($idproyectado[0]) {
//modificar

                        self:: modificarContadoproyectado($valores->proyectado, $idproyectado[0]['idinverscontadoproyectado']);
                    } else {
//insertar
                        self:: adicionarContadoproyectado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->proyectado);
                    }
                } else {
                    return 'Error en la fila ' . $key . ': no existe la relación moneda - entidad.';
                }
            } else {
                return 'Error en la fila ' . $key . ': no existe la moneda.';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
        }
    }

    public function valInsertarDatosPlanprep($valores, $params, $key) {

        $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);

        if ($inversion[0]) {


            $idmoneda = self::obtenerMoneda($valores->moneda);
            if ($idmoneda[0]) {
                $monedaentidad = self::obtenerMonedaEntidad($idmoneda[0]['idmoneda'], $params['identidad']);
                if ($monedaentidad[0]) {
                    $inversionplan = self::obetenerInversionPlanPrep($inversion[0]['idinversion'], $monedaentidad[0]['idmonedaentidad']);

                    if ($inversionplan[0]) {
                        $idejecutado = self::obtenerPPejecutado($inversionplan[0]['idpresanteproy'], $params['idejercicioactual']);
                        if ($idejecutado[0]) {
//modificar
                            self:: modificarPPejecutado($valores->ejecutado, $idejecutado[0]['idpresupejecutado']);
                        } else {
//insertar
                            self:: adicionarPPejecutado($inversionplan[0]['idpresanteproy'], $params['idejercicioactual'], $valores->ejecutado);
                        }
                        $idestimado = self::obtenerPPestimado($inversionplan[0]['idpresanteproy'], $params['idejercicioactual']);
                        if ($idestimado[0]) {
//modificar
                            self:: modificarPPestimado($valores->estimado, $idestimado[0]['idpresupestimado']);
                        } else {
//insertar
                            self:: adicionarPPestimado($inversionplan[0]['idpresanteproy'], $params['idejercicioactual'], $valores->estimado);
                        }
                        $idplan = self::obtenerPPplan($inversionplan[0]['idpresanteproy'], $params['idejercicioactual']);
                        if ($idplan[0]) {
//modificar
                            self:: modificarPPplan($valores->plan, $idplan[0]['idpresupplan']);
                        } else {
//insertar
                            self:: adicionarPPplan($inversionplan[0]['idpresanteproy'], $params['idejercicioactual'], $valores->plan);
                        }
                        $idproyectado = self::obtenerPPproyectado($inversionplan[0]['idpresanteproy'], $params['idejercicioactual']);
                        if ($idproyectado[0]) {
//modificar
                            self:: modificarPPproyectado($valores->proyectado, $idproyectado[0]['idpresupproyectado']);
                        } else {
//insertar
                            self:: adicionarPPproyectado($inversionplan[0]['idpresanteproy'], $params['idejercicioactual'], $valores->proyectado);
                        }
                    } else {
                        return 'Error en la fila ' . $key . ': no existe el Plan de Preparación para la inversión: ' . $valores->inversion . ' .';
                    }
                } else {
                    return 'Error en la fila ' . $key . ': no existe la relación moneda - entidad.';
                }
            } else {
                return 'Error en la fila ' . $key . ': no existe la moneda.';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
        }
    }

    public function valInsertarDatosAcreedor($valores, $params, $key) {
        $idacreedor = self::obteneridtipofinanciamiento($valores->acreedor);

        if ($idacreedor[0]) {
            $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);
            if ($inversion[0]) {
                $relacionfinancista = self::obtenerrelacionacreedor($idacreedor[0]['idtipofinanciamiento'], $inversion[0]['idinversion']);
                if ($relacionfinancista[0]) {
                    $idmoneda = self::obtenerMoneda($valores->moneda);
                    if ($idmoneda[0]) {
                        $monedaentidad = self::obtenerMonedaEntidad($idmoneda[0]['idmoneda'], $params['identidad']);
                        if ($monedaentidad[0]) {
                            $idejecutado = self::obtenerAcreejecutado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $idacreedor[0]['idtipofinanciamiento']);
                            if ($idejecutado[0]) {
//modificar
                                self:: modificarAcreejecutado($valores->ejecutado, $idejecutado[0]['idinversfinancejecutado']);
                            } else {
//insertar
                                self:: adicionarAcreejecutado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->ejecutado, $idacreedor[0]['idtipofinanciamiento']);
                            }

                            $idestimado = self::obtenerAcreestimado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $idacreedor[0]['idtipofinanciamiento']);
                            if ($idestimado[0]) {
//modificar
                                self:: modificarAcreestimado($valores->estimado, $idestimado[0]['idinversfinancestimado']);
                            } else {
//insertar
                                self:: adicionarAcreestimado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->estimado, $idacreedor[0]['idtipofinanciamiento']);
                            }

                            $idplan = self::obtenerAcreplan($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $idacreedor[0]['idtipofinanciamiento']);
                            if ($idplan[0]) {
//modificar
                                self:: modificarAcreplan($valores->plan, $idplan[0]['idinversfinancplan']);
                            } else {
//insertar
                                self:: adicionarAcreplan($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->plan, $idacreedor[0]['idtipofinanciamiento']);
                            }

                            $idproyectado = self::obtenerAcreproyectado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $idacreedor[0]['idtipofinanciamiento']);
                            if ($idproyectado[0]) {
//modificar
                                self:: modificarAcreproyectado($valores->proyectado, $idproyectado[0]['idplaninversfinancproyectado']);
                            } else {
//insertar
                                self:: adicionarAcreproyectado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->proyectado, $idacreedor[0]['idtipofinanciamiento']);
                            }
                        } else {
                            return 'Error en la fila ' . $key . ': no existe la relación moneda - entidad.';
                        }
                    } else {
                        return 'Error en la fila ' . $key . ': no existe la moneda.';
                    }
                } else {
                    return 'Error en la fila ' . $key . ': no existe la relación inversión - acreedor.';
                }
            } else {
                return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe el acreedor.';
        }
    }

    public function valInsertarDatosFinancista($valores, $params, $key) {
        $financista = self::obteneridfinancista($valores->financista);
        if ($financista[0]) {
            $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);
            if ($inversion[0]) {
                $relacionfinancista = self::obtenerrelacionfinancista($financista[0]['idfinancista'], $inversion[0]['idinversion']);
                if ($relacionfinancista[0]) {
                    $idmoneda = self::obtenerMoneda($valores->moneda);
                    if ($idmoneda[0]) {
                        $monedaentidad = self::obtenerMonedaEntidad($idmoneda[0]['idmoneda'], $params['identidad']);
                        if ($monedaentidad[0]) {
                            $idejecutado = self::obtenerFinejecutado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $financista[0]['idfinancista']);
                            if ($idejecutado[0]) {
//modificar
                                self:: modificarFinejecutado($valores->ejecutado, $idejecutado[0]['idinversfinancistaejecutado']);
                            } else {
//insertar
                                self:: adicionarFinejecutado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->ejecutado, $financista[0]['idfinancista']);
                            }
                            $idestimado = self::obtenerFinestimado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $financista[0]['idfinancista']);
                            if ($idestimado[0]) {
//modificar
                                self:: modificarFinestimado($valores->estimado, $idestimado[0]['idinversfinancistaestimado']);
                            } else {
//insertar
                                self:: adicionarFinestimado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->estimado, $financista[0]['idfinancista']);
                            }
                            $idplan = self::obtenerFinplan($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $financista[0]['idfinancista']);
                            if ($idplan[0]) {
//modificar
                                self:: modificarFinplan($valores->plan, $idplan[0]['idinversfinancistaplan']);
                            } else {
//insertar
                                self:: adicionarFinplan($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->plan, $financista[0]['idfinancista']);
                            }
                            $idproyectado = self::obtenerFinproyectado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $financista[0]['idfinancista']);
                            if ($idproyectado[0]) {
//modificar
                                self:: modificarFinproyectado($valores->proyectado, $idproyectado[0]['idinversfinancistaproyectado']);
                            } else {
//insertar
                                self:: adicionarFinproyectado($monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->proyectado, $financista[0]['idfinancista']);
                            }
                        } else {
                            return 'Error en la fila ' . $key . ': no existe la relación moneda - entidad.';
                        }
                    } else {
                        return 'Error en la fila ' . $key . ': no existe la moned.a';
                    }
                } else {
                    return 'Error en la fila ' . $key . ': no existe la relación inversión - financista.';
                }
            } else {
                return 'Error en la fila ' . $key . ': no existe la inversión: ' . $valores->inversion . ' .';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe el financista.';
        }
    }

    public function valInsertarDatosConstructor($valores, $params, $key) {
        $componente = self::obetenercomponente($valores->componente);
        if ($componente[0]) {
            $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);
            if ($inversion[0]) {
                $constructor = self::obtenerC($valores->constructor);
                if ($constructor[0]) {
                    $provincia = self::obtenerIdProvincia($valores->provincia);
                    if ($provincia[0]) {
                        $componenteTipoInv = self::obetenercomponentetipoinversion($valores->componente, $inversion[0]['idtipoinversion']);
                        if ($componenteTipoInv[0]) {
                            $idInvComp = self::obtenerRelacionInvComponete($inversion[0]['idinversion'], $componenteTipoInv[0]['idetapa']);
                            if ($idInvComp[0]) {
                                $idetapinverconsprov = self::obteneretapinverconsprov($provincia[0]['iddpt'], $idInvComp[0]['idetapainversion'], $constructor[0]['idconstructor']);
                                if ($idetapinverconsprov[0]) {
                                    $idmoneda = self::obtenerMoneda($valores->moneda);
                                    if ($idmoneda[0]) {
                                        $idejecutado = self::obtenerContruejecutado($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idetapinverconsprov[0]['idetapinverconsprov']);

                                        if ($idejecutado[0]) {
//modificar
                                            self:: modificarContruejecutado($valores->ejecutado, $idejecutado[0]['idetapinverconsprovejecutado']);
                                        } else {
//insertar
                                            self:: adicionarContruejecutado($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idetapinverconsprov[0]['idetapinverconsprov'], $valores->ejecutado);
                                        }

                                        $idestimado = self::obtenerContruestimado($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idetapinverconsprov[0]['idetapinverconsprov']);

                                        if ($idestimado[0]) {
//modificar
                                            self:: modificarContruestimado($valores->estimado, $idestimado[0]['idetapinverconsprovestimado']);
                                        } else {
//insertar
                                            self:: adicionarContruestimado($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idetapinverconsprov[0]['idetapinverconsprov'], $valores->estimado);
                                        }
                                        $idplan = self::obtenerContruplan($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idetapinverconsprov[0]['idetapinverconsprov']);

                                        if ($idplan[0]) {
//modificar
                                            self:: modificarContruplan($valores->plan, $idplan[0]['idetapinverconsprovplan']);
                                        } else {
//insertar
                                            self:: adicionarContruplan($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idetapinverconsprov[0]['idetapinverconsprov'], $valores->plan);
                                        }
                                        $idproyeccion = self::obtenerContruproyeccion($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idetapinverconsprov[0]['idetapinverconsprov']);

                                        if ($idproyeccion[0]) {
//modificar
                                            self:: modificarContruproyeccion($valores->proyeccion, $idproyeccion[0]['idetapinverconsprovproyeccion']);
                                        } else {
//insertar
                                            self:: adicionarContruproyeccion($idmoneda[0]['idmoneda'], $params['idejercicioactual'], $idetapinverconsprov[0]['idetapinverconsprov'], $valores->proyeccion);
                                        }
                                    } else {
                                        return 'Error en la fila ' . $key . ': no existe la moneda.';
                                    }
                                } else {
                                    return 'Error en la fila ' . $key . ': no existe la relación componente - inversión - constructor - provincia.';
                                }
                            } else {
                                return 'Error en la fila ' . $key . ': no existe la relación componente - inversión.';
                            }
                        } else {
                            return 'Error en la fila ' . $key . ': no existe la relación componente - tipo de inversión.';
                        }
                    } else {
                        return 'Error en la fila ' . $key . ': no existe la provincia.';
                    }
                } else {
                    return 'Error en la fila ' . $key . ': no existe el constructor.';
                }
            } else {
                return 'Error en la fila ' . $key . ': no existe la inversión: ' . $valores->inversion . ' .';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe el componente.';
        }
    }

    public function valInsertarDatosOtrosInd($valores, $params, $key) {

        $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);

        if ($inversion[0]) {
            $indicador = self::obetenerIndicador($valores->indicador);

            if ($indicador[0]) {
                $idejecutado = self::obtenerOtrosInd($inversion[0]['idinversion'], $indicador[0]['idnomotrosindicadores']);
                if ($idejecutado[0]) {
//modificar
                    self:: modificarOtrosInd($valores->posterior, $valores->cantidad, $idejecutado[0]['idotrosindicadoresannospostcant']);
                } else {
//insertar
                    self:: adicionarOtrosInd($indicador[0]['idnomotrosindicadores'], $inversion[0]['idinversion'], $valores->posterior, $valores->cantidad);
                }
            } else {
                return 'Error en la fila ' . $key . ': no existe el indicador.';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
        }
    }

    public function valInsertarDatosNA($valores, $params, $key) {

        $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);
        if ($inversion[0]) {
            $idnivel = self::obtenerNivel($valores->nivel);
            if ($idnivel[0]) {
                $idejecutado = self::obtenerNA($inversion[0]['idinversion'], $idnivel[0]['iddatcapexplotacion']);
                if ($idejecutado[0]) {
//modificar
                    self:: modificarNA($valores->posterior, $valores->cantidad, $idejecutado[0]['idcapexplotannospostcant']);
                } else {
//insertar
                    self:: adicionarNA($idnivel[0]['iddatcapexplotacion'], $inversion[0]['idinversion'], $valores->posterior, $valores->cantidad);
                }
            } else {
                return 'Error en la fila ' . $key . ': no existe el nivel de actividad.';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
        }
    }

    public function valInsertarDatosEquipos($valores, $params, $key) {

        $componente = self::obetenercomponente($valores->componente);
        if ($componente[0]) {
            $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);
            if ($inversion[0]) {
                $equipo = self::obtenerEq($valores->indicador);
                if ($equipo[0]) {
                    $modelo = self::obtenerM($valores->modelo);
                    if ($modelo[0]) {
                        $entidadmodelo = self::obtenerEM($modelo[0]['idmodelo'], $params['identidad']);
                        if ($entidadmodelo[0]) {

                            $componenteTipoInv = self::obetenercomponentetipoinversion($valores->componente, $inversion[0]['idtipoinversion']);
                            if ($componenteTipoInv[0]) {
                                $idInvComp = self::obtenerRelacionInvComponete($inversion[0]['idinversion'], $componenteTipoInv[0]['idetapa']);

                                if ($idInvComp[0]) {
                                    $idetapaequipo = self::obteneridetapaequipo($equipo[0]['idindicador'], $entidadmodelo[0]['identidadmodelo'], $idInvComp[0]['idetapainversion']);

                                    if ($idetapaequipo[0]) {
                                        $idetapaequipoglobal = self::obteneretapaequipoglobal($idetapaequipo[0]['idetapaequipos']);
                                        if ($idetapaequipoglobal[0]) {
                                            //modificar tabla desg
                                            $idejecutado = self::obtenerEqejecutado($idetapaequipoglobal[0]['idetapaequipoglobal']);
                                            if ($idejecutado[0]) {//modificar
                                                self:: modificarEqejecutado($idejecutado[0]['idetapaequipoejecutado'], $valores->ejecutado);
                                            } else {//insertar
                                                self:: adicionarEqejecutado($idetapaequipoglobal[0]['idetapaequipoglobal'], $params['idejercicioactual'], $valores->ejecutado);
                                            }

                                            $idestimado = self::obtenerEqestimado($idetapaequipoglobal[0]['idetapaequipoglobal']);
                                            if ($idestimado[0]) {//modificar
                                                self:: modificarEqestimado($idestimado[0]['idetapaequipoestimado'], $valores->estimado);
                                            } else {//insertar
                                                self:: adicionarEqestimado($idetapaequipoglobal[0]['idetapaequipoglobal'], $params['idejercicioactual'], $valores->estimado);
                                            }

                                            $idplan = self::obtenerEqplan($idetapaequipoglobal[0]['idetapaequipoglobal']);
                                            if ($idplan[0]) {//modificar
                                                self:: modificarEqplan($idplan[0]['idetapaequipoplan'], $valores->plan);
                                            } else {//insertar
                                                self:: adicionarEqplan($idetapaequipoglobal[0]['idetapaequipoglobal'], $params['idejercicioactual'], $valores->plan);
                                            }

                                            $idproyectado = self::obtenerEqproyectado($idetapaequipoglobal[0]['idetapaequipoglobal']);
                                            if ($idproyectado[0]) {//modificar
                                                self:: modificarEqproyectado($idproyectado[0]['idetapaequipoproyectado'], $valores->proyectado);
                                            } else {//insertar
                                                self:: adicionarEqproyectado($idetapaequipoglobal[0]['idetapaequipoglobal'], $params['idejercicioactual'], $valores->proyectado);
                                            }
                                        } else {
                                            //insertar global y desglobal
                                            self:: adicionarGlobal($idetapaequipo[0]['idetapaequipos']);
                                            $idetapaequipoglobal = self::obteneretapaequipoglobal($idetapaequipo[0]['idetapaequipos']);

                                            self:: adicionarEqejecutado($idetapaequipoglobal[0]['idetapaequipoglobal'], $params['idejercicioactual'], $valores->ejecutado);
                                            self:: adicionarEqestimado($idetapaequipoglobal[0]['idetapaequipoglobal'], $params['idejercicioactual'], $valores->estimado);
                                            self:: adicionarEqplan($idetapaequipoglobal[0]['idetapaequipoglobal'], $params['idejercicioactual'], $valores->plan);
                                            self:: adicionarEqproyectado($idetapaequipoglobal[0]['idetapaequipoglobal'], $params['idejercicioactual'], $valores->proyectado);
                                        }
                                    } else {
                                        return 'Error en la fila ' . $key . ': no existe la relación componente - equipo.';
                                    }
                                } else {
                                    return 'Error en la fila ' . $key . ': no existe la relación componente - inversión.';
                                }
                            } else {
                                return 'Error en la fila ' . $key . ': no existe la relación componente - tipo de inversión.';
                            }
                        } else {
                            return 'Error en la fila ' . $key . ': no existe la relación entidad - modelo.';
                        }
                    } else {
                        return 'Error en la fila ' . $key . ': no existe el modelo.';
                    }
                } else {
                    return 'Error en la fila ' . $key . ': no existe el equipo.';
                }
            } else {
                return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe el componente.';
        }
    }

    public function valInsertarDatosOtrosIndDes($valores, $params, $key) {

        $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);

        if ($inversion[0]) {
            $indicador = self::obetenerIndicador($valores->indicador);

            if ($indicador[0]) {
                $idejecutado = self::obtenerOtrosIndDes($inversion[0]['idinversion'], $indicador[0]['idnomotrosindicadores'], $params['idejercicioactual']);
                if ($idejecutado[0]) {
//modificar
                    self:: modificarOtrosIndDes($valores->ejecutado, $valores->estimado, $valores->plan, $valores->proyeccion, $idejecutado[0]['iddatotrosindicadares']);
                } else {
//insertar
                    self:: adicionarOtrosIndDes($indicador[0]['idnomotrosindicadores'], $inversion[0]['idinversion'], $valores->ejecutado, $valores->estimado, $valores->plan, $valores->proyeccion, $params['idejercicioactual']);
                }
            } else {
                return 'Error en la fila ' . $key . ': no existe el indicador.';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
        }
    }

    public function valInsertarNADes($valores, $params, $key) {


        $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);


        if ($inversion[0]) {
            $idnivel = self::obtenerNivel($valores->nivel);

            if ($idnivel[0]) {
                $idejecutado = self::obtenerNADes($inversion[0]['idinversion'], $params['idejercicioactual'], $idnivel[0]['iddatcapexplotacion']);
                if ($idejecutado[0]) {
//modificar
                    self:: modificarNADes($idejecutado[0]['idinverscapexplot'], $valores->ejecutado, $valores->estimado, $valores->plan, $valores->proyeccion);
                } else {
//insertar
                    self:: adicionarNADes($idnivel[0]['iddatcapexplotacion'], $params['idejercicioactual'], $inversion[0]['idinversion'], $valores->ejecutado, $valores->estimado, $valores->plan, $valores->proyeccion);
                }
            } else {
                return 'Error en la fila ' . $key . ': no existe el nivel de actividad.';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
        }
    }

    public function valInsertarMA($valores, $params, $key) {

        $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);

        if ($inversion[0]) {
            if ($valores->tipopadre == 'Sector') {
                $idpadre = self::obtenerMApadre($valores->mediopadre);
                if ($idpadre[0]) {
                    if ($valores->tipo == 'Sector')
                        $idhijo = self::obtenerMApadre($valores->medio);
                    else {
                        if ($valores->tipo == 'Bahía')
                            $idhijo = self::obtenerMABahia($valores->medio);
                        else {
                            if ($valores->tipo == 'Cuenca')
                                $idhijo = self::obtenerMACuenca($valores->medio);
                            else {
                                if ($valores->tipo == 'Acción')
                                    $idhijo = self::obtenerMAAcc($valores->medio);
                            }
                        }
                    }
                    if ($idhijo[0]) {
                        $idglobal = self::obtenerMAGlobal($inversion[0]['idinversion'], $idhijo[0]['iddatosnomenclador'], $idpadre[0]['iddatosnomenclador'], $idhijo[0]['idnomenclador']);
                        if ($idglobal[0] == null || $idglobal[0] == '' || !$idglobal[0]) {
                            if ($valores->tipopadre == $valores->tipo) {
                                self:: adicionarMAGlobal($inversion[0]['idinversion'], $idhijo[0]['iddatosnomenclador'], $idpadre[0]['iddatosnomenclador'], $idhijo[0]['idnomenclador'], null);
                            } else {
                                $idpadreglobal = self::obtenerMAGlobalPadre($inversion[0]['idinversion'], $idpadre[0]['iddatosnomenclador'], $idpadre[0]['iddatosnomenclador'], $idpadre[0]['idnomenclador']);

                                if ($idpadreglobal[0]) {
                                    self:: adicionarMAGlobal($inversion[0]['idinversion'], $idhijo[0]['iddatosnomenclador'], $idpadre[0]['iddatosnomenclador'], $idhijo[0]['idnomenclador'], $idpadreglobal[0]['idmedioambglobal']);
                                } else {
                                    return 'Error en la fila ' . $key . ': no existe ' . $valores->medio . 'para la inversión ' . $valores->inversion;
                                }
                            }
                        }
                    } else {
                        return 'Error en la fila ' . $key . ': no existe el hijo.';
                    }
                } else {
                    return 'Error en la fila ' . $key . ': no existe el padre.';
                }
            } else {
                return 'Error en la fila ' . $key . ': el padre no es de tipo sector.';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
        }
    }

    public function valInsertarMAP($valores, $params, $key) {

        $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);

        if ($inversion[0]) {
            if ($valores->tipopadre == 'Sector') {
                $idpadre = self::obtenerMApadre($valores->mediopadre);
                if ($idpadre[0]) {
                    if ($valores->tipo == 'Sector')
                        $idhijo = self::obtenerMApadre($valores->medio);
                    else {
                        if ($valores->tipo == 'Bahía')
                            $idhijo = self::obtenerMABahia($valores->medio);
                        else {
                            if ($valores->tipo == 'Cuenca')
                                $idhijo = self::obtenerMACuenca($valores->medio);
                            else {
                                if ($valores->tipo == 'Acción')
                                    $idhijo = self::obtenerMAAcc($valores->medio);
                            }
                        }
                    }
                    if ($idhijo[0]) {
                        $idglobal = self::obtenerMAGlobal($inversion[0]['idinversion'], $idhijo[0]['iddatosnomenclador'], $idpadre[0]['iddatosnomenclador'], $idhijo[0]['idnomenclador']);
                        if ($idglobal[0]) {
                            $idmoneda = self::obtenerMoneda($valores->moneda);
                            if ($idmoneda[0]) {
                                $monedaentidad = self::obtenerMonedaEntidad($idmoneda[0]['idmoneda'], $params['identidad']);
                                if ($monedaentidad[0]) {
                                    $idpresupuesto = self::obtenerMAPresup($idglobal[0]['idmedioambglobal'], $monedaentidad[0]['idmonedaentidad']);
                                    if ($idpresupuesto[0]) {
//modificar
                                        self:: modificarMAPresup($idpresupuesto[0]['idmedioambpresupuesto'], $valores->valor);
                                    } else {
//insertar
                                        self:: adicionarMAPresup($idglobal[0]['idmedioambglobal'], $monedaentidad[0]['idmonedaentidad'], $valores->valor);
                                    }
                                } else {
                                    return 'Error en la fila ' . $key . ': no existe la relación moneda - entidad-';
                                }
                            } else {
                                return 'Error en la fila ' . $key . ': no existe la moneda-';
                            }
                        } else {
                            return 'Error en la fila ' . $key . ': no existe la relación inversión - medio ambiente';
                        }
                    } else {
                        return 'Error en la fila ' . $key . ': no existe el hijo-';
                    }
                } else {
                    return 'Error en la fila ' . $key . ': no existe el padre-';
                }
            } else {
                return 'Error en la fila ' . $key . ': el padre no es de tipo sector-';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
        }
    }

    public function valInsertarMADes($valores, $params, $key) {

        $inversion = self::obetenerInversion($valores->inversion, $params['identidad']);

        if ($inversion[0]) {
            if ($valores->tipopadre == 'Sector') {
                $idpadre = self::obtenerMApadre($valores->mediopadre);
                if ($idpadre[0]) {
                    if ($valores->tipo == 'Sector')
                        $idhijo = self::obtenerMApadre($valores->medio);
                    else {
                        if ($valores->tipo == 'Bahía')
                            $idhijo = self::obtenerMABahia($valores->medio);
                        else {
                            if ($valores->tipo == 'Cuenca')
                                $idhijo = self::obtenerMACuenca($valores->medio);
                            else {
                                if ($valores->tipo == 'Acción')
                                    $idhijo = self::obtenerMAAcc($valores->medio);
                            }
                        }
                    }
                    if ($idhijo[0]) {
                        $idglobal = self::obtenerMAGlobal($inversion[0]['idinversion'], $idhijo[0]['iddatosnomenclador'], $idpadre[0]['iddatosnomenclador'], $idhijo[0]['idnomenclador']);
                        if ($idglobal[0]) {
                            $idmoneda = self::obtenerMoneda($valores->moneda);
                            if ($idmoneda[0]) {
                                $monedaentidad = self::obtenerMonedaEntidad($idmoneda[0]['idmoneda'], $params['identidad']);
                                if ($monedaentidad[0]) {

                                    $idejecutado = self::obtenerMAEjecutado($idglobal[0]['idmedioambglobal'], $monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual']);
                                    if ($idejecutado[0]) {
//modificar
                                        self:: modificarMAEjecutado($idejecutado[0]['idmedioambejecutado'], $valores->ejecutado);
                                    } else {
//insertar
                                        self:: adicionarMAEjecutado($idglobal[0]['idmedioambglobal'], $monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $valores->ejecutado);
                                    }

                                    $idestimado = self::obtenerMAEstimado($idglobal[0]['idmedioambglobal'], $monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual']);
                                    if ($idestimado[0]) {
//modificar
                                        self:: modificarMAEstimado($idestimado[0]['idmedioambestimado'], $valores->estimado);
                                    } else {
//insertar
                                        self:: adicionarMAEstimado($idglobal[0]['idmedioambglobal'], $monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $valores->estimado);
                                    }

                                    $idplan = self::obtenerMAplan($idglobal[0]['idmedioambglobal'], $monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual']);
                                    if ($idplan[0]) {
//modificar
                                        self:: modificarMAplan($idplan[0]['idmedioambplan'], $valores->plan);
                                    } else {
//insertar
                                        self:: adicionarMAplan($idglobal[0]['idmedioambglobal'], $monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $valores->plan);
                                    }

                                    $idproyectado = self::obtenerMAproyectado($idglobal[0]['idmedioambglobal'], $monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual']);
                                    if ($idproyectado[0]) {
//modificar
                                        self:: modificarMAproyectado($idproyectado[0]['idmedioambproyectado'], $valores->proyectado);
                                    } else {
//insertar
                                        self:: adicionarMAproyectado($idglobal[0]['idmedioambglobal'], $monedaentidad[0]['idmonedaentidad'], $params['idejercicioactual'], $valores->proyectado);
                                    }
                                } else {
                                    return 'Error en la fila ' . $key . ': no existe la relación moneda - entidad.';
                                }
                            } else {
                                return 'Error en la fila ' . $key . ': no existe la moneda.';
                            }
                        } else {
                            return 'Error en la fila ' . $key . ': no existe ' . $valores->medio . 'para la inversión ' . $valores->inversion . ' .';
                        }
                    } else {
                        return 'Error en la fila ' . $key . ': no existe el hijo.';
                    }
                } else {
                    return 'Error en la fila ' . $key . ': no existe el padre.';
                }
            } else {
                return 'Error en la fila ' . $key . ': el padre no es de tipo sector.';
            }
        } else {
            return 'Error en la fila ' . $key . ': no existe la inversión ' . $valores->inversion . ' .';
        }
    }

    public function obetenercomponente($componente) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT e.idetapa
                FROM mod_planifinversiones.nom_nombreetapa n
                INNER JOIN mod_planifinversiones.dat_etapa e ON n.idnombreetapa =
                  e.idnombreetapa
                WHERE n.denominacion = '$componente'";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obetenercomponentetipoinversion($componente, $tipoinversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT e.idetapa
                FROM mod_planifinversiones.nom_nombreetapa n
                INNER JOIN mod_planifinversiones.dat_etapa e ON n.idnombreetapa =
                  e.idnombreetapa
                  INNER JOIN mod_planifinversiones.conf_formatoetapa fe ON fe.idformatoetapa =
                  e.idformatoetapa
                   INNER JOIN mod_planifinversiones.nom_tipoinversion ti ON fe.idformatoetapa =
                  ti.idformatoetapa
                WHERE n.denominacion = '$componente' AND ti.idtipoinversion = $tipoinversion ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obteneretapinverconsprov($provincia, $idInvComp, $constructor) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idetapinverconsprov
                FROM mod_planifinversiones.dat_etapinverconsprov
                WHERE idetapainversion = $idInvComp AND iddpt = $provincia AND idconstructor =$constructor ";
        $result = $con->fetchAssoc($sql);

        return $result;
    }

    public function obtenerRelacionInvComponete($inversion, $componente) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idetapainversion
                FROM mod_planifinversiones.dat_etapainversion
                WHERE idinversion = $inversion AND idetapa = $componente";
        $result = $con->fetchAssoc($sql);

        return $result;
    }

    public function obtenerMoneda($moneda) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idmoneda
FROM mod_datosmaestros.nom_moneda
where codigoiso = '$moneda'";
        $result = $con->fetchAssoc($sql);

        return $result;
    }

    public function obtenerMonedaEntidad($moneda, $entidad) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idmonedaentidad
FROM mod_datosmaestros.dat_monedaentidad
WHERE idmoneda = $moneda AND idestructuracomun = $entidad";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerEjecutado($idmoneda, $idejercicio, $idetapainversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idplaninversetapaejecutado
                FROM mod_planifinversiones.dat_inversetapaejecutado
                WHERE idmoneda = $idmoneda AND
                idejercicio = $idejercicio AND
                idetapainversion = $idetapainversion";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarEjecutado($valor, $idplaninversetapaejecutado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversetapaejecutado
                SET valor =$valor
                WHERE idplaninversetapaejecutado =$idplaninversetapaejecutado";
        $con->execute($sql);
    }

    public function adicionarEjecutado($idmoneda, $idejercicio, $idetapainversion, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversetapaejecutado(idmoneda,idejercicio, idetapainversion, valor)
                VALUES ($idmoneda, $idejercicio,$idetapainversion, $valor)";
        $con->execute($sql);
    }

    public function obtenerEstimado($idmoneda, $idejercicio, $idetapainversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idplaninversetapaestimado
                FROM mod_planifinversiones.dat_inversetapaestimado
                WHERE idmoneda = $idmoneda AND
                idejercicio = $idejercicio AND
                idetapainversion = $idetapainversion";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarEstimado($valor, $idplaninversetapaestimado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversetapaestimado
                SET valor =$valor
                WHERE idplaninversetapaestimado =$idplaninversetapaestimado";
        $con->execute($sql);
    }

    public function adicionarEstimado($idmoneda, $idejercicio, $idetapainversion, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversetapaestimado(idmoneda,idejercicio, idetapainversion, valor)
                VALUES ($idmoneda, $idejercicio,$idetapainversion, $valor)";
        $con->execute($sql);
    }

    public function obtenerPlan($idmoneda, $idejercicio, $idetapainversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idplaninversetapaplan
                FROM mod_planifinversiones.dat_inversetapaplan
                WHERE idmoneda = $idmoneda AND
                idejercicio = $idejercicio AND
                idetapainversion = $idetapainversion";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarPlan($valor, $idplaninversetapaplan) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversetapaplan
                SET valor =$valor
                WHERE idplaninversetapaplan =$idplaninversetapaplan";
        $con->execute($sql);
    }

    public function adicionarPlan($idmoneda, $idejercicio, $idetapainversion, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversetapaplan(idmoneda,idejercicio, idetapainversion, valor)
                VALUES ($idmoneda, $idejercicio,$idetapainversion, $valor)";
        $con->execute($sql);
    }

    public function obtenerProyeccion($idmoneda, $idejercicio, $idetapainversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idplaninversetapaproyectado
                FROM mod_planifinversiones.dat_inversetapaproyectado
                WHERE idmoneda = $idmoneda AND
                idejercicio = $idejercicio AND
                idetapainversion = $idetapainversion";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarProyeccion($valor, $idplaninversetapaproyectado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversetapaproyectado
                SET valor =$valor
                WHERE idplaninversetapaproyectado =$idplaninversetapaproyectado";
        $con->execute($sql);
    }

    public function adicionarProyeccion($idmoneda, $idejercicio, $idetapainversion, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversetapaproyectado(idmoneda,idejercicio, idetapainversion, valor)
                VALUES ($idmoneda, $idejercicio,$idetapainversion, $valor)";
        $con->execute($sql);
    }

    public function obtenerContadoejecutado($identidadmoneda, $idejercicio, $idinversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinverscontadoejecutado
                FROM mod_planifinversiones.dat_inverscontadoejecutado
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarContadoejecutado($valor, $idinverscontadoejecutado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inverscontadoejecutado
                SET valor =$valor
                WHERE idinverscontadoejecutado =$idinverscontadoejecutado";
        $con->execute($sql);
    }

    public function adicionarContadoejecutado($monedaentidad, $idejercicio, $inversion, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inverscontadoejecutado(idmonedaentidad,idejercicio, idinversion, valor)
                VALUES ($monedaentidad, $idejercicio,$inversion, $valor)";
        $con->execute($sql);
    }

    public function obtenerContadoestimado($identidadmoneda, $idejercicio, $idinversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinverscontadoestimado
                FROM mod_planifinversiones.dat_inverscontadoestimado
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion";

        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarContadoestimado($valor, $idinverscontadoestimado) {

        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inverscontadoestimado
                SET valor =$valor
                WHERE idinverscontadoestimado =$idinverscontadoestimado";
        $con->execute($sql);
    }

    public function adicionarContadoestimado($monedaentidad, $idejercicio, $inversion, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inverscontadoestimado(idmonedaentidad,idejercicio, idinversion, valor)
                VALUES ($monedaentidad, $idejercicio,$inversion, $valor)";
        $con->execute($sql);
    }

    public function obtenerContadoplan($identidadmoneda, $idejercicio, $idinversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinverscontadoplan
                FROM mod_planifinversiones.dat_inverscontadoplan
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion";

        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarContadoplan($valor, $idinverscontadoplan) {

        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inverscontadoplan
                SET valor =$valor
                WHERE idinverscontadoplan =$idinverscontadoplan";
        $con->execute($sql);
    }

    public function adicionarContadoplan($monedaentidad, $idejercicio, $inversion, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inverscontadoplan(idmonedaentidad,idejercicio, idinversion, valor)
                VALUES ($monedaentidad, $idejercicio,$inversion, $valor)";
        $con->execute($sql);
    }

    public function obtenerContadoproyectado($identidadmoneda, $idejercicio, $idinversion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinverscontadoproyectado
                FROM mod_planifinversiones.dat_inverscontadoproyectado
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion";

        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarContadoproyectado($valor, $idinverscontadoproyectado) {

        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inverscontadoproyectado
                SET valor =$valor
                WHERE idinverscontadoproyectado =$idinverscontadoproyectado";
        $con->execute($sql);
    }

    public function adicionarContadoproyectado($monedaentidad, $idejercicio, $inversion, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inverscontadoproyectado(idmonedaentidad,idejercicio, idinversion, valor)
                VALUES ($monedaentidad, $idejercicio,$inversion, $valor)";
        $con->execute($sql);
    }

    public function obtenerPPejecutado($idpresanteproy, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idpresupejecutado
                FROM mod_planifinversiones.dat_presupejecutado
                WHERE idpresanteproy = $idpresanteproy AND
                idejercicio = $idejercicio
                ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarPPejecutado($valor, $idpresupejecutado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_presupejecutado
                SET valor =$valor
                WHERE idpresupejecutado =$idpresupejecutado";
        $con->execute($sql);
    }

    public function adicionarPPejecutado($idpresanteproy, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_presupejecutado(idpresanteproy, idejercicio, valor)
                VALUES ($idpresanteproy, $idejercicio, $valor)";
        $con->execute($sql);
    }

    public function obtenerPPestimado($idpresanteproy, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idpresupestimado
                FROM mod_planifinversiones.dat_presupestimado
                WHERE idpresanteproy = $idpresanteproy AND
                idejercicio = $idejercicio
                ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarPPestimado($valor, $idpresupestimado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_presupestimado
                SET valor =$valor
                WHERE idpresupestimado =$idpresupestimado";
        $con->execute($sql);
    }

    public function adicionarPPestimado($idpresanteproy, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_presupestimado(idpresanteproy, idejercicio, valor)
                VALUES ($idpresanteproy, $idejercicio, $valor)";
        $con->execute($sql);
    }

    public function obtenerPPplan($idpresanteproy, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idpresupplan
                FROM mod_planifinversiones.dat_presupplan
                WHERE idpresanteproy = $idpresanteproy AND
                idejercicio = $idejercicio
                ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarPPplan($valor, $idpresupplan) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_presupplan
                SET valor =$valor
                WHERE idpresupplan =$idpresupplan";
        $con->execute($sql);
    }

    public function adicionarPPplan($idpresanteproy, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_presupplan(idpresanteproy, idejercicio, valor)
                VALUES ($idpresanteproy, $idejercicio, $valor)";
        $con->execute($sql);
    }

    public function obtenerPPproyectado($idpresanteproy, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idpresupproyectado
                FROM mod_planifinversiones.dat_presupproyectado
                WHERE idpresanteproy = $idpresanteproy AND
                idejercicio = $idejercicio
                ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarPPproyectado($valor, $idpresupproyectado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_presupproyectado
                SET valor =$valor
                WHERE idpresupproyectado =$idpresupproyectado";
        $con->execute($sql);
    }

    public function adicionarPPproyectado($idpresanteproy, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_presupproyectado(idpresanteproy, idejercicio, valor)
                VALUES ($idpresanteproy, $idejercicio, $valor)";
        $con->execute($sql);
    }

    public function obtenerFinejecutado($identidadmoneda, $idejercicio, $idinversion, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinversfinancistaejecutado
                FROM mod_planifinversiones.dat_inversfinancistaejecutado
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion AND idfinancista=$idfinancista ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarFinejecutado($valor, $idinversfinancistaejecutado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversfinancistaejecutado
                SET valor =$valor
                WHERE idinversfinancistaejecutado =$idinversfinancistaejecutado";
        $con->execute($sql);
    }

    public function adicionarFinejecutado($monedaentidad, $idejercicio, $inversion, $valor, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversfinancistaejecutado(idmonedaentidad,idejercicio,idfinancista,valor,idinversion)
                VALUES ($monedaentidad, $idejercicio,$idfinancista, $valor,$inversion)";
        $con->execute($sql);
    }

    public function obtenerFinestimado($identidadmoneda, $idejercicio, $idinversion, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinversfinancistaestimado
                FROM mod_planifinversiones.dat_inversfinancistaestimado
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion AND idfinancista=$idfinancista ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarFinestimado($valor, $idinversfinancistaestimado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversfinancistaestimado
                SET valor =$valor
                WHERE idinversfinancistaestimado =$idinversfinancistaestimado";
        $con->execute($sql);
    }

    public function adicionarFinestimado($monedaentidad, $idejercicio, $inversion, $valor, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversfinancistaestimado(idmonedaentidad,idejercicio,idfinancista,valor,idinversion)
                VALUES ($monedaentidad, $idejercicio,$idfinancista, $valor,$inversion)";
        $con->execute($sql);
    }

    public function obtenerFinplan($identidadmoneda, $idejercicio, $idinversion, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinversfinancistaplan
                FROM mod_planifinversiones.dat_inversfinancistaplan
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion AND idfinancista=$idfinancista ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarFinplan($valor, $idinversfinancistaplan) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversfinancistaplan
                SET valor =$valor
                WHERE idinversfinancistaplan =$idinversfinancistaplan";
        $con->execute($sql);
    }

    public function adicionarFinplan($monedaentidad, $idejercicio, $inversion, $valor, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversfinancistaplan(idmonedaentidad,idejercicio,idfinancista,valor,idinversion)
                VALUES ($monedaentidad, $idejercicio,$idfinancista, $valor,$inversion)";
        $con->execute($sql);
    }

    public function obtenerFinproyectado($identidadmoneda, $idejercicio, $idinversion, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinversfinancistaproyectado
                FROM mod_planifinversiones.dat_inversfinancistaproyectado
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion AND idfinancista=$idfinancista ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarFinproyectado($valor, $idinversfinancistaproyectado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversfinancistaproyectado
                SET valor =$valor
                WHERE idinversfinancistaproyectado =$idinversfinancistaproyectado";
        $con->execute($sql);
    }

    public function adicionarFinproyectado($monedaentidad, $idejercicio, $inversion, $valor, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversfinancistaproyectado(idmonedaentidad,idejercicio,idfinancista,valor,idinversion)
                VALUES ($monedaentidad, $idejercicio,$idfinancista, $valor,$inversion)";
        $con->execute($sql);
    }

    public function obtenerAcreejecutado($identidadmoneda, $idejercicio, $idinversion, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinversfinancejecutado
                FROM mod_planifinversiones.dat_inversfinancejecutado
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion AND idtipofinanciamiento=$idfinancista ";

        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarAcreejecutado($valor, $idinversfinancejecutado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversfinancejecutado
                SET valor =$valor
                WHERE idinversfinancejecutado =$idinversfinancejecutado";
        $con->execute($sql);
    }

    public function adicionarAcreejecutado($monedaentidad, $idejercicio, $inversion, $valor, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversfinancejecutado(idmonedaentidad,idejercicio,idtipofinanciamiento,valor,idinversion)
                VALUES ($monedaentidad, $idejercicio,$idfinancista, $valor,$inversion)";

        $con->execute($sql);
    }

    public function obtenerAcreestimado($identidadmoneda, $idejercicio, $idinversion, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinversfinancestimado
                FROM mod_planifinversiones.dat_inversfinancestimado
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion AND idtipofinanciamiento=$idfinancista ";

        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarAcreestimado($valor, $idinversfinancejecutado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversfinancestimado
                SET valor =$valor
                WHERE idinversfinancestimado =$idinversfinancejecutado";
        $con->execute($sql);
    }

    public function adicionarAcreestimado($monedaentidad, $idejercicio, $inversion, $valor, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversfinancestimado(idmonedaentidad,idejercicio,idtipofinanciamiento,valor,idinversion)
                VALUES ($monedaentidad, $idejercicio,$idfinancista, $valor,$inversion)";

        $con->execute($sql);
    }

    public function obtenerAcreplan($identidadmoneda, $idejercicio, $idinversion, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinversfinancplan
                FROM mod_planifinversiones.dat_inversfinancplan
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion AND idtipofinanciamiento=$idfinancista ";

        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarAcreplan($valor, $idinversfinancejecutado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversfinancplan
                SET valor =$valor
                WHERE idinversfinancplan =$idinversfinancejecutado";
        $con->execute($sql);
    }

    public function adicionarAcreplan($monedaentidad, $idejercicio, $inversion, $valor, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversfinancplan(idmonedaentidad,idejercicio,idtipofinanciamiento,valor,idinversion)
                VALUES ($monedaentidad, $idejercicio,$idfinancista, $valor,$inversion)";

        $con->execute($sql);
    }

    public function obtenerAcreproyectado($identidadmoneda, $idejercicio, $idinversion, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idplaninversfinancproyectado
                FROM mod_planifinversiones.dat_inversfinancproyectado
                WHERE idmonedaentidad = $identidadmoneda AND
                idejercicio = $idejercicio AND
                idinversion = $idinversion AND idtipofinanciamiento=$idfinancista ";
        $result = $con->fetchAssoc($sql);

        return $result;
    }

    public function modificarAcreproyectado($valor, $idinversfinancejecutado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inversfinancproyectado
                SET valor =$valor
                WHERE idplaninversfinancproyectado =$idinversfinancejecutado";
        $con->execute($sql);
    }

    public function adicionarAcreproyectado($monedaentidad, $idejercicio, $inversion, $valor, $idfinancista) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inversfinancproyectado(idmonedaentidad,idejercicio,idtipofinanciamiento,valor,idinversion)
                VALUES ($monedaentidad, $idejercicio,$idfinancista, $valor,$inversion)";

        $con->execute($sql);
    }

    public function obtenerContruejecutado($idmoneda, $idejercicio, $idetapinverconsprov) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idetapinverconsprovejecutado
                FROM mod_planifinversiones.dat_etapinverconsprovejecutado
                WHERE idmoneda = $idmoneda AND
                idejercicio = $idejercicio AND
                idetapinverconsprov = $idetapinverconsprov ";
        $result = $con->fetchAssoc($sql);

        return $result;
    }

    public function modificarContruejecutado($valor, $idinversfinancejecutado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_etapinverconsprovejecutado
                SET valor =$valor
                WHERE idetapinverconsprovejecutado =$idinversfinancejecutado";
        $con->execute($sql);
    }

    public function adicionarContruejecutado($monedaentidad, $idejercicio, $idetapinverconsprov, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_etapinverconsprovejecutado( idmoneda,idejercicio,idetapinverconsprov,valor)
                VALUES ($monedaentidad, $idejercicio,$idetapinverconsprov, $valor)";

        $con->execute($sql);
    }

    public function obtenerContruestimado($idmoneda, $idejercicio, $idetapinverconsprov) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idetapinverconsprovestimado
                FROM mod_planifinversiones.dat_etapinverconsprovestimado
                WHERE idmoneda = $idmoneda AND
                idejercicio = $idejercicio AND
                idetapinverconsprov = $idetapinverconsprov ";
        $result = $con->fetchAssoc($sql);

        return $result;
    }

    public function modificarContruestimado($valor, $idinversfinancestimado) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_etapinverconsprovestimado
                SET valor =$valor
                WHERE idetapinverconsprovestimado =$idinversfinancestimado";
        $con->execute($sql);
    }

    public function adicionarContruestimado($monedaentidad, $idejercicio, $idetapinverconsprov, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_etapinverconsprovestimado( idmoneda,idejercicio,idetapinverconsprov,valor)
                VALUES ($monedaentidad, $idejercicio,$idetapinverconsprov, $valor)";

        $con->execute($sql);
    }

    public function obtenerContruplan($idmoneda, $idejercicio, $idetapinverconsprov) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idetapinverconsprovplan
                FROM mod_planifinversiones.dat_etapinverconsprovplan
                WHERE idmoneda = $idmoneda AND
                idejercicio = $idejercicio AND
                idetapinverconsprov = $idetapinverconsprov ";
        $result = $con->fetchAssoc($sql);

        return $result;
    }

    public function modificarContruplan($valor, $idinversfinancplan) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_etapinverconsprovplan
                SET valor =$valor
                WHERE idetapinverconsprovplan =$idinversfinancplan";
        $con->execute($sql);
    }

    public function adicionarContruplan($monedaentidad, $idejercicio, $idetapinverconsprov, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_etapinverconsprovplan( idmoneda,idejercicio,idetapinverconsprov,valor)
                VALUES ($monedaentidad, $idejercicio,$idetapinverconsprov, $valor)";

        $con->execute($sql);
    }

    public function obtenerContruproyeccion($idmoneda, $idejercicio, $idetapinverconsprov) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idetapinverconsprovproyeccion
                FROM mod_planifinversiones.dat_etapinverconsprovproyeccion
                WHERE idmoneda = $idmoneda AND
                idejercicio = $idejercicio AND
                idetapinverconsprov = $idetapinverconsprov ";
        $result = $con->fetchAssoc($sql);

        return $result;
    }

    public function modificarContruproyeccion($valor, $idinversfinancproyeccion) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_etapinverconsprovproyeccion
                SET valor =$valor
                WHERE idetapinverconsprovproyeccion =$idinversfinancproyeccion";
        $con->execute($sql);
    }

    public function adicionarContruproyeccion($monedaentidad, $idejercicio, $idetapinverconsprov, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_etapinverconsprovproyeccion( idmoneda,idejercicio,idetapinverconsprov,valor)
                VALUES ($monedaentidad, $idejercicio,$idetapinverconsprov, $valor)";

        $con->execute($sql);
    }

    public function obtenerOtrosInd($idinversion, $indicador) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idotrosindicadoresannospostcant
                FROM mod_planifinversiones.dat_otrosindicadoresannospostcant
                WHERE idinversion = $idinversion AND
                idnomotrosindicadores = $indicador ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarOtrosInd($posterior, $cantidad, $idotrosindicadoresannospostcant) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_otrosindicadoresannospostcant
                SET valor =$posterior,
                    cantidad=$cantidad
                WHERE idotrosindicadoresannospostcant =$idotrosindicadoresannospostcant";
        $con->execute($sql);
    }

    public function adicionarOtrosInd($indicador, $inversion, $posterior, $cantidad) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_otrosindicadoresannospostcant(idinversion, idnomotrosindicadores, valor,cantidad)
                VALUES ($inversion,$indicador, $posterior, $cantidad)";
        $con->execute($sql);
    }

    public function obtenerOtrosIndDes($idinversion, $indicador, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT iddatotrosindicadares
                FROM mod_planifinversiones.dat_otrosindicadares
                WHERE idinversion = $idinversion AND
                idnomotrosindicadores = $indicador
                AND idejercicio=$idejercicio";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarOtrosIndDes($ejecutado, $estimado, $plan, $proyeccion, $iddatotrosindicadares) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_otrosindicadares
                SET ejecutado = $ejecutado,estimado = $estimado,plan = $plan,proyeccion = $proyeccion
                WHERE iddatotrosindicadares =$iddatotrosindicadares";
        $con->execute($sql);
    }

    public function adicionarOtrosIndDes($indicador, $inversion, $ejecutado, $estimado, $plan, $proyeccion, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_otrosindicadares(idejercicio,idinversion,idnomotrosindicadores, ejecutado, estimado,plan,proyeccion)
                VALUES ($idejercicio,$inversion,$indicador,  $ejecutado, $estimado,$plan,$proyeccion)";
        $con->execute($sql);
    }

    public function obtenerM($prov) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idmodelo
FROM mod_planificacion.dat_modelo
where denominacion ='$prov'";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

    public function obtenerEM($modelo, $entidad) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT identidadmodelo
                    FROM mod_planificacion.dat_entidadmodelo
                    WHERE identidad =$entidad AND
                    idmodelo =$modelo";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function obtenerEqejecutado($idetapaequipoglobal) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idetapaequipoejecutado
                    FROM mod_planifinversiones.dat_etapaequipoejecutado
                    WHERE idetapaequipoglobal =$idetapaequipoglobal";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function modificarEqejecutado($idetapaequipoejecutado, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "UPDATE mod_planifinversiones.dat_etapaequipoejecutado
                    SET valor =$valor
                    WHERE idetapaequipoejecutado = $idetapaequipoejecutado";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function adicionarEqejecutado($idetapaequipoglobal, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "INSERT INTO mod_planifinversiones.dat_etapaequipoejecutado(idetapaequipoglobal,
                    idejercicio, valor)VALUES ($idetapaequipoglobal, $idejercicio, $valor)";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function obtenerEqestimado($idetapaequipoglobal) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idetapaequipoestimado
                    FROM mod_planifinversiones.dat_etapaequipoestimado
                    WHERE idetapaequipoglobal =$idetapaequipoglobal";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function modificarEqestimado($idetapaequipoestimado, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "UPDATE mod_planifinversiones.dat_etapaequipoestimado
                    SET valor =$valor
                    WHERE idetapaequipoestimado = $idetapaequipoestimado";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function adicionarEqestimado($idetapaequipoglobal, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "INSERT INTO mod_planifinversiones.dat_etapaequipoestimado(idetapaequipoglobal,
                    idejercicio, valor)VALUES ($idetapaequipoglobal, $idejercicio, $valor)";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function obtenerEqplan($idetapaequipoglobal) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idetapaequipoplan
                    FROM mod_planifinversiones.dat_etapaequipoplan
                    WHERE idetapaequipoglobal =$idetapaequipoglobal";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function modificarEqplan($idetapaequipoplan, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "UPDATE mod_planifinversiones.dat_etapaequipoplan
                    SET valor =$valor
                    WHERE idetapaequipoplan = $idetapaequipoplan";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function adicionarEqplan($idetapaequipoglobal, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "INSERT INTO mod_planifinversiones.dat_etapaequipoplan(idetapaequipoglobal,
                    idejercicio, valor)VALUES ($idetapaequipoglobal, $idejercicio, $valor)";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function obtenerEqproyectado($idetapaequipoglobal) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idetapaequipoproyectado
                    FROM mod_planifinversiones.dat_etapaequipoproyectado
                    WHERE idetapaequipoglobal =$idetapaequipoglobal";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function modificarEqproyectado($idetapaequipoproyectado, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "UPDATE mod_planifinversiones.dat_etapaequipoproyectado
                    SET valor =$valor
                    WHERE idetapaequipoproyectado= $idetapaequipoproyectado";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function adicionarEqproyectado($idetapaequipoglobal, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $query = "INSERT INTO mod_planifinversiones.dat_etapaequipoproyectado(idetapaequipoglobal,
                    idejercicio, valor)VALUES ($idetapaequipoglobal, $idejercicio, $valor)";
        $res = $con->execute($query)->fetchAll();
        return $res;
    }

    public function obteneretapaequipoglobal($idetapaequipos) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idetapaequipoglobal
FROM mod_planifinversiones.dat_etapaequipoglobal
where idetapaequipos = $idetapaequipos";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function adicionarGlobal($idetapaequipos) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_etapaequipoglobal(idetapaequipos)
        VALUES ($idetapaequipos)";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function obtenerNA($idinversion, $nivel) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idcapexplotannospostcant
                FROM mod_planifinversiones.dat_capexplotannospostcant
                WHERE idinversion = $idinversion AND
                iddatcapexplotacion = $nivel ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarNA($posterior, $cantidad, $idcapexplotannospostcant) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_capexplotannospostcant
                SET valor =$posterior,
                    cantidad=$cantidad
                WHERE idcapexplotannospostcant =$idcapexplotannospostcant";
        $con->execute($sql);
    }

    public function adicionarNA($iddatcapexplotacion, $inversion, $posterior, $cantidad) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_capexplotannospostcant(idinversion, iddatcapexplotacion, valor,cantidad)
                VALUES ($inversion,$iddatcapexplotacion, $posterior, $cantidad)";
        $con->execute($sql);
    }

    public function obtenerNADes($idinversion, $idejercicio, $iddatcapexplotacion) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idinverscapexplot
                FROM mod_planifinversiones.dat_inverscapexplot
                WHERE idinversion = $idinversion AND
                iddatcapexplotacion = $iddatcapexplotacion AND idejercicio= $idejercicio";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarNADes($idinverscapexplot, $ejecutado, $estimado, $plan, $proyeccion) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_inverscapexplot
                SET ejecutado =$ejecutado,
                    estimado=$estimado,
                    plan =$plan,
                    proyeccion =$proyeccion
                WHERE idinverscapexplot =$idinverscapexplot";

        $con->execute($sql);
    }

    public function adicionarNADes($iddatcapexplotacion, $idejercicio, $idinversion, $ejecutado, $estimado, $plan, $proyeccion) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_inverscapexplot(idejercicio, idinversion, iddatcapexplotacion, ejecutado, estimado, plan,proyeccion)
                VALUES ($idejercicio, $idinversion,$iddatcapexplotacion, $ejecutado, $estimado, $plan, $proyeccion);";
        $con->execute($sql);
    }

    public function adicionarMAGlobal($idinversion, $iddatosnomenclador, $iddatosnomencladorpadre, $idnomenclador, $idpadre) {
        $con = Doctrine_Manager::connection();

        if ($idpadre) {

            $sql = "INSERT INTO mod_planifinversiones.dat_medioambglobal(idinversion,iddatosnomenclador, iddatosnomencladorpadre, idnomenclador, idpadre)
         VALUES ($idinversion, $iddatosnomenclador, $iddatosnomencladorpadre, $idnomenclador, $idpadre)";
        } else {
            $sql = "INSERT INTO mod_planifinversiones.dat_medioambglobal(idinversion,iddatosnomenclador, iddatosnomencladorpadre, idnomenclador, idpadre)
         VALUES ($idinversion, $iddatosnomenclador, $iddatosnomencladorpadre, $idnomenclador, null)";
        }

        $con->execute($sql);
    }

    public function obtenerMAPresup($idglobal, $monedaentidad) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idmedioambpresupuesto
                FROM mod_planifinversiones.dat_medioambpresupuesto
                WHERE idmedioambglobal = $idglobal AND
                idmonedaentidad =$monedaentidad ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarMAPresup($idmedioambpresupuesto, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_medioambpresupuesto
                SET valor =$valor
                WHERE idmedioambpresupuesto =$idmedioambpresupuesto";

        $con->execute($sql);
    }

    public function adicionarMAPresup($idglobal, $monedaentidad, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_medioambpresupuesto(idmedioambglobal,idmonedaentidad,valor )
                VALUES ($idglobal, $monedaentidad,$valor)";
        $con->execute($sql);
    }

    public function obtenerMAEjecutado($idglobal, $monedaentidad, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idmedioambejecutado
                FROM mod_planifinversiones.dat_medioambejecutado
                WHERE idmedioambglobal = $idglobal AND
                idmonedaentidad =$monedaentidad AND idejercicio=$idejercicio ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarMAEjecutado($idmedioambpresupuesto, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_medioambejecutado
                SET valor =$valor
                WHERE idmedioambejecutado =$idmedioambpresupuesto";

        $con->execute($sql);
    }

    public function adicionarMAEjecutado($idglobal, $monedaentidad, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_medioambejecutado(idmedioambglobal,idmonedaentidad,idejercicio,valor )
                VALUES ($idglobal, $monedaentidad,$idejercicio,$valor)";
        $con->execute($sql);
    }

    public function obtenerMAEstimado($idglobal, $monedaentidad, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idmedioambestimado
                FROM mod_planifinversiones.dat_medioambestimado
                WHERE idmedioambglobal = $idglobal AND
                idmonedaentidad =$monedaentidad AND idejercicio=$idejercicio ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarMAEstimado($idmedioambpresupuesto, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_medioambestimado
                SET valor =$valor
                WHERE idmedioambestimado =$idmedioambpresupuesto";

        $con->execute($sql);
    }

    public function adicionarMAEstimado($idglobal, $monedaentidad, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_medioambestimado(idmedioambglobal,idmonedaentidad,idejercicio,valor )
                VALUES ($idglobal, $monedaentidad,$idejercicio,$valor)";
        $con->execute($sql);
    }

    public function obtenerMAplan($idglobal, $monedaentidad, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idmedioambplan
                FROM mod_planifinversiones.dat_medioambplan
                WHERE idmedioambglobal = $idglobal AND
                idmonedaentidad =$monedaentidad AND idejercicio=$idejercicio ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarMAplan($idmedioambpresupuesto, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_medioambplan
                SET valor =$valor
                WHERE idmedioambplan =$idmedioambpresupuesto";

        $con->execute($sql);
    }

    public function adicionarMAplan($idglobal, $monedaentidad, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_medioambplan(idmedioambglobal,idmonedaentidad,idejercicio,valor )
                VALUES ($idglobal, $monedaentidad,$idejercicio,$valor)";
        $con->execute($sql);
    }

    public function obtenerMAproyectado($idglobal, $monedaentidad, $idejercicio) {
        $con = Doctrine_Manager::connection();
        $sql = "SELECT idmedioambproyectado
                FROM mod_planifinversiones.dat_medioambproyectado
                WHERE idmedioambglobal = $idglobal AND
                idmonedaentidad =$monedaentidad AND idejercicio=$idejercicio ";
        $result = $con->fetchAssoc($sql);
        return $result;
    }

    public function modificarMAproyectado($idmedioambpresupuesto, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "UPDATE mod_planifinversiones.dat_medioambproyectado
                SET valor =$valor
                WHERE idmedioambproyectado =$idmedioambpresupuesto";

        $con->execute($sql);
    }

    public function adicionarMAproyectado($idglobal, $monedaentidad, $idejercicio, $valor) {
        $con = Doctrine_Manager::connection();
        $sql = "INSERT INTO mod_planifinversiones.dat_medioambproyectado(idmedioambglobal,idmonedaentidad,idejercicio,valor )
                VALUES ($idglobal, $monedaentidad,$idejercicio,$valor)";
        $con->execute($sql);
    }

    public function exportarErrores($errores) {
        $todosErrores = explode(',', $errores);
        $cuerpoerror.= '<table border="1" bordercolor="black"  width="80%" align="center" cellpadding="0" cellspacing="0" style="margin-top:2cm;">';
        $cuerpoerror .= '<tr style="text-align:CENTER;"><td colspan="2"><strong>ERRORES EN LOS DATOS A IMPORTAR<strong></td></tr>';
        $cuerpoerror.= '<tr>
                          <td width="5%" style="text-align: center"><strong>Número</strong></td>
                          <td style="text-align: center"><strong>Denominación error</strong></td>
                         </tr>';
        foreach ($todosErrores as $key => $valerror) {
            $numero = $key + 1;
            $cuerpoerror.= '<tr>
                          <td width="5%" style="text-align: center">' . $numero . '</td>
                          <td>' . $valerror . '</td>
                         </tr>';
        }
        $cuerpoerror.= '<table>';

        echo $cuerpoerror;
    }

}
