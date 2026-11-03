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
                            $compar
                                    =
                                    'lower(' . $alias . $filtro['field'] . ") LIKE '" . strtolower($filtro['data']['value'])
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
                    print_r($e->getMessage());
                    die;
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
                print_r($indicadores);
                die;
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
                }
                else if ($params['tipoexcel'] == 2) {//print_r(2);die;
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
                }
                else if ($params['tipoexcel'] == 1) {//constr
                    $contarr = 0;//print_r(3);die;
                    for ($i = 2; $i <= $length; $i++, $cont++) {
                        $parametrosinv = array();
                        $row = $indicadores[$i];
                        $parametrosinv['denentidad'] = utf8_encode($row[1]);
                        $parametrosinv['deninversion'] = utf8_encode($row[2]);
                        $parametrosinv['constructor'] = utf8_encode($row[3]);
                        $parametrosinv['provincia'] = utf8_encode($row[4]);//print_r($parametrosinv);die;
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
                }
                else if ($params['tipoexcel'] == 4) {//print_r(4);die;
                    $contarr = 0;//print_r($indicadores);die;
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
                        $parametrosinv['interes'] = utf8_encode($row[10]);//print_r($parametrosinv);die;
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
                        !preg_match("/^[0-9]+$/", $value[5]) || !preg_match("/^[0-9]+$/", $value[6]) || !preg_match("/^[0-9]+$/", $value[7])) {
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
                                $arraycoll_indprecio_ind[$indice]->iddatosnomenclador
                                        = $array_ests_dnom['precionovalido'];
                                continue;
                            } else {
                                if (empty($row_ind->preciodivisa)) {
                                    $arraycoll_indprecio_ind[$indice]->iddatosnomenclador
                                            = $array_ests_dnom['preciodivisanovalido'];
                                    continue;
                                } else {
                                    if (empty($row_ind->preciodivisa)) {
                                        $arraycoll_indprecio_ind[$indice]->iddatosnomenclador
                                                = $array_ests_dnom['preciodivisanovalido'];
                                        continue;
                                    } elseif ($ptr_indicador[0] != 'ok') {
                                        $arraycoll_indprecio_ind[$indice]->iddatosnomenclador
                                                = $array_ests_dnom['indicadornoexiste'];
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
                            $arraycoll_indflecont_ind[$indice]->iddatosnomenclador
                                    = $array_ests_dnom['contingencianovalido'];
                            continue;
                        } elseif ($ptr_indicador[0] != 'ok') {
                            $arraycoll_indflecont_ind[$indice]->iddatosnomenclador
                                    = $array_ests_dnom['indicadornoexiste'];
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
                                    $viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface]
                                            = 'ok';
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
                                    $viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface]
                                            = 'ok';
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
                            $arraycoll_tempind[$indice]->iddatosnomenclador
                                    = $array_ests_dnom['viaadquisicionnoexiste'];
                            continue;
                        } elseif ($result_error_insert[0] == 'os') {
                            $arraycoll_tempind[$indice]->iddatosnomenclador
                                    = $array_ests_dnom['organosatisfacenoexiste'];
                            continue;
                        }
                        if ($ptr_indicador[0] != null && $ptr_indicador[0] == 'no') { //ADICIONAR INDICADOR
                            $naturaleza = null;
                            if ($array_naturls[$row_ind->naturaleza] != null) {
                                $naturaleza = $array_naturls[$row_ind->naturaleza];
                            } else {
                                $arraycoll_tempind[$indice]->iddatosnomenclador
                                        = $array_ests_dnom['naturalezanoexiste'];
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
                                    $arraycoll_tempind[$indice]->iddatosnomenclador
                                            = $array_ests_dnom['genericonoexiste'];
                                } elseif ($nivelarbol == 3) {
                                    $arraycoll_tempind[$indice]->iddatosnomenclador
                                            = $array_ests_dnom['subgenericonoexiste'];
                                } else { //es 4
                                    $arraycoll_tempind[$indice]->iddatosnomenclador
                                            = $array_ests_dnom['especificonoexiste'];
                                }
                                continue;
                            }
                            if ($array_codpadre_niv == 'errorformato') {
                                $arraycoll_tempind[$indice]->iddatosnomenclador = $array_ests_dnom['genericonoexiste'];
                                continue;
                            } elseif ($adicionar) {
                                if (($idpadre == null || $idarbol == null) && $array_codpadre_niv[1] > 1) {
                                    if ($array_codpadre_niv[1] == 2) {

                                        $arraycoll_tempind[$indice]->iddatosnomenclador
                                                = $array_ests_dnom['genericonoexiste'];
                                    } elseif ($array_codpadre_niv[1] == 3) {

                                        $arraycoll_tempind[$indice]->iddatosnomenclador
                                                = $array_ests_dnom['subgenericonoexiste'];
                                    } else { //es 4
                                        $arraycoll_tempind[$indice]->iddatosnomenclador
                                                = $array_ests_dnom['especificonoexiste'];
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
                                    $array_insertado[$new_idindicador . 'U' . $relacion->identidaddatosnomenclador]
                                            = 'ok';
                                    $obj_temp_insind->idcentrobalance = $obj_temp_insind->idcentrobalance . $arroba_cb
                                            . $relacion->identidaddatosnomenclador;
                                    $arroba_cb = "@";
                                } elseif ($relacion->tipo == 'va' && $relacion->idviaadquisicion != null) {
                                    $obj_temp_insind->idvia
                                            = $obj_temp_insind->idvia . $arroba_va . $relacion->idviaadquisicion;
                                    $dolar_os = "";
                                    $str_ids_os = "";
                                    foreach ($relacion->organos as $org) {
                                        if ($org->idorganosatisface != null) {
                                            if ($viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface] != 'ok'
                                            ) {
                                                $str_ids_os = $str_ids_os . $dolar_os . $org->idorganosatisface;
                                                $viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface]
                                                        = 'ok';
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
                                    $array_insertado[$new_idindicador . 'U' . $relacion->identidaddatosnomenclador]
                                            = 'ok';
                                    $obj_temp_insind->idcentrobalance = $obj_temp_insind->idcentrobalance . $arroba_cb
                                            . $relacion->identidaddatosnomenclador;
                                    $arroba_cb = "@";
                                } elseif ($relacion->tipo == 'va' && $relacion->idviaadquisicion != null) {
                                    $obj_temp_insind->idvia
                                            = $obj_temp_insind->idvia . $arroba_va . $relacion->idviaadquisicion;
                                    $dolar_os = "";
                                    $str_ids_os = "";
                                    foreach ($relacion->organos as $org) {
                                        if ($org->idorganosatisface != null) {
                                            if ($viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface] != 'ok'
                                            ) {
                                                $str_ids_os = $str_ids_os . $dolar_os . $org->idorganosatisface;
                                                $viasadq_exist_con_os['id' . $org->idviaadquisicion . "U" . $org->idorganosatisface]
                                                        = 'ok';
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
                $array_long_inicialxnivelx_esp['longit' . $longitud_codesp]
                        = NomActividad::obtIntervalosPorPartesDeFormatos($esp['codespecialidad'], true);
            }
            $array_esp['den' . strtoupper($esp['denespecialidad'])]['long_inicialxnivel']
                    = $array_long_inicialxnivelx_esp['longit' . $longitud_codesp];
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
                            $array_long_inicialxnivelx_esp['longit' . $longitud_codesp]
                                    = NomActividad::obtIntervalosPorPartesDeFormatos($esp['codespecialidad'], true);
                        }
                        $array_esp['den' . strtoupper($esp['denespecialidad'])]['long_inicialxnivel']
                                = $array_long_inicialxnivelx_esp['longit' . $longitud_codesp];
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
                print_r($e);
                die;
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
            $iddatotipo = self::obtenerIddatoNom('Tipo de Inversión', $params['tipo']);//print_r(1);
            if ($iddatotipo != null) {
                $iddatoprograma = self::obtenerIddatoNom('Programa', $params['programa']);//print_r(2);
                if ($iddatoprograma != null) {
                    $iddatoobjetivo = self::obtenerIddatoNom('Objetivo', $params['objetivo']);//print_r(3);
                    if ($iddatoobjetivo != null) {
                        $iddatoefecto = self::obtenerIddatoNom('Efecto en COMEX', $params['efecto']);//print_r(4);
                        if ($iddatoefecto != null) {
                            $iddatocaracteristica = self::obtenerIddatoNom('caracteristica', $params['caracteristica']);//print_r(5);
                            if ($iddatocaracteristica != null) {
                                $iddatoformapropiedad = self::obtenerIddatoNom('Forma de propiedad', $params['formapropiedad']);//print_r(6);
                                if ($iddatoformapropiedad != null) {
                                    $iddatodesempenno = self::obtenerIddatoNom('Desempeño', $params['desempenno']);//print_r(7);
                                    if ($iddatodesempenno != null) {
                                        //if (is_int($params['analisis'])) {
                                        $iddatoclasificacion = self::obtenerIdTipoInversion($params['clasificacion']);//print_r(8);
                                        if ($iddatoclasificacion != null) {
                                            if ($params['fast']) {
                                                if ($params['fast'] == 'si')
                                                    $params['fast'] = 1;
                                                else
                                                if ($params['fast'] == 'no')
                                                    $params['fast'] = 0;;
                                                $entidades = self::obtenerIdEntidad($params['entidad']);//print_r(9);
                                                $identidad = $entidades[0]['idestructura'];
                                                $idespecialidad = $entidades[0]['idespecialidad'];
                                                $codigoEntidad = $entidades[0]['codigo'];
                                                if ($identidad != null) {
                                                    $idprov = self::obtenerIdProvincia($params['provincia']);//print_r(10);
                                                    if ($idprov != null) {
                                                        $fechai = self::obtenerFecha($params['fechai'], true);//print_r(11);
                                                        if ($fechai != null) {
                                                            $fechaf = self::obtenerFecha($params['fechaf'], false);//print_r(12);
                                                            if ($fechaf != null) {
                                                                $fechaf = self::obtenerFecha($params['fechaf'], false);//print_r(13);

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
        $identidad = $entidades[0]['idestructura'];//print_r($params);die;
        if ($identidad != null) {
            $inversion = self::obtenerIdinversionDadoDenom($identidad, $params['deninversion'], $idejercicio[0]['idejercicio']);
            $idinversion = $inversion[0]['idinversion'];
            if ($idinversion != null) {
                $datostipo = self::obtenerDatosTipoDadoDato($params['tipodato']);//print_r($datostipo);die;
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
                    } else if($datostipo[0]['tipo'] == 'Como se financia'){//print_r($params['tipodato']);die;
                        $idfinancista = self::obteneridfinancista('CONTADO');
                        $idtipofinanciamiento = self::obteneridtipofinanciamiento($params['tipodato']);//print_r($idtipofinanciamiento);die;
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
						
                    }else if($datostipo[0]['tipo'] == 'Quien Financia'){//print_r($params['tipodato']);die;
                        $idfinancista = self::obteneridfinancista($params['tipodato']);
                        $idtipofinanciamiento = self::obteneridtipofinanciamiento('CONTADO');//print_r($idtipofinanciamiento);die;
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
  where dn.denominacion = '$como' ";//print_r($query);die;
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
        $query = "SELECT
ei.idetapainversion
FROM
  mod_planifinversiones.dat_etapainversion ei
 INNER JOIN mod_planifinversiones.dat_etapa et ON (ei.idetapa = et.idetapa)
 INNER JOIN mod_planifinversiones.nom_nombreetapa ne ON (et.idnombreetapa = ne.idnombreetapa)WHERE
  ei.idinversion = $idinversion
  and ne.denominacion = '$dato' ";
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
order by f.tipo";//print_r($query);die;
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
        $consulta =
                "select
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
        $consulta =
                "INSERT INTO 
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
        $consulta =
                "INSERT INTO 
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
    public function obtenerMod($prov) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT idmodelo
FROM mod_planificacion.dat_modelo
where denominacion ='$prov'";
        $res = $con->execute($query)->fetchAll();

        return $res;
    }

     public function obtenerentidadmodelo($modelo,$entidad) {
        $con = Doctrine_Manager::connection();
        $query = "SELECT identidadmodelo
                    FROM mod_planificacion.dat_entidadmodelo
                    WHERE identidad =$entidad AND
                    idmodelo =$modelo";
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
        if (/* is_int($fecha) && */$fecha >= 1000 && $fecha <= 9999)
            if ($inicio)
                $strf = '01-01-' . $fecha;
            else
                $strf = '31-12-' . $fecha;

        $time = strtotime($strf);

        $newformat = date('d-m-Y', $time);
        return $newformat;
    }

}
