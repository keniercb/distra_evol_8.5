<?php

class DatImportarModel extends ZendExt_Model
{
    private $desarrollo;

    public function __construct()
    {
        parent::ZendExt_Model();
        $this->desarrollo = 1;

    }

    public function setearIncludePath($concepto)
    {
        $register = Zend_Registry::getInstance();
        $dir_abs_mt = $register->config->dir_aplication;
        if ($concepto == 'clientes') {  //Clientes y/o proveedores
            $include_path =
                PATH_SEPARATOR . $dir_abs_mt . '/configuracion/clientesyproveedores/models/domain/generated'
                . PATH_SEPARATOR . $dir_abs_mt . '/configuracion/clientesyproveedores/models/domain'
                . PATH_SEPARATOR . $dir_abs_mt . '/configuracion/clientesyproveedores/models/bussines';
        }
        if ($concepto == 'importar') {
            $include_path =
                PATH_SEPARATOR . $dir_abs_mt . 'configuracion/importar/comun/recursos/lib/PHPExcel';
        }
        set_include_path(get_include_path() . $include_path);
    }

    public function listar($params)
    {
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
            //print_r($where);die;
            $query->addwhere($where);
        }

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
        $temp = $query->getSqlQuery();

        $res ['data'] = $query->execute();
        $res ['total'] = $query->count();

        return $res;
    }

    public function SqlFiltros($table, $filtros, $alias = "")
    {
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
                            $compar = 'lower(' . $alias . $filtro['field'] . ") LIKE '{$caracter_scapado}" . strtolower($filtro['data']['value'])
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

    public function obtenerTablaTemporalDadoIdConcepto($idconcepto)
    {
        $conc = Doctrine::getTable('NomConceptoimportar')->find($idconcepto);
        $tabla = '';
        if ($conc) {
            $tabla = $conc->DatConfiguracionimportar->tablatemporal;
        }
        return $tabla;
    }

    public function listarDadoTempTable($table)
    {
        $query = new Doctrine_Query ();
        $queryTotal = new Doctrine_Query ();
        $res ['data'] = $query->from($table)->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
        return $res;
    }

    public function exportarErroresTempTable($idconcepto)
    {
        $cols = self::obtenerColumnasDadoIdConcepto(
            $idconcepto
        );
        $tablatemp = (isset($cols[0])) ? $cols[0]['DatConfiguracionimportar']['tablatemporal'] : null;
        if ($tablatemp) {
            $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
            $array_ests_uri = array();
            foreach ($array_ests_dnom as $k => $dn) {
                unset($array_ests_dnom[$k]);
                $array_ests_uri[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
            }
            $array_idests_dnom[0] = $array_ests_uri['validadook'];
            $array_idests_dnom[1] = $array_ests_uri['importadook'];
            $array_idests_dnom[2] = $array_ests_uri['adicionadook'];
            $array_idests_dnom[3] = $array_ests_uri['actualizadook'];
            $datos = self::listarErrorresDadoTempTable($tablatemp, $array_idests_dnom);
            if (isset($datos['data'][0])) {
                $nombrereporte = self::exportarTempTable($cols, $datos);
                $data['cod'] = 1;
                $data['titulo'] = $nombrereporte;
            } else  $data['cod'] = 0; //No existen datos erroneos para exportar
        } else $data['cod'] = 2; //Falta la tabla en BD
        return $data;
    }

    public function listarErrorresDadoTempTable($table, $ids)
    {
        try {
            $query = new Doctrine_Query ();
            $queryTotal = new Doctrine_Query ();
            $res ['data'] = $query->from($table . ' temp')
                ->innerJoin('temp.NomDatosnomenclador ndn')
                ->where('ndn.iddatosnomenclador = temp.iddatosnomenclador')
                ->addWhere('temp.iddatosnomenclador is not null')
                ->whereNotIn('temp.iddatosnomenclador', $ids)
                ->setHydrationMode(Doctrine::HYDRATE_ARRAY)->execute();
            return $res;
        } catch (Exception $e) {
            print_r($e->getMessage());
        }
    }

    public function listarConceptos($idconcepto)
    {
        $obj = new NomConceptoimportar();
        return $obj->listar($idconcepto);
    }

    public function getConfigGrid($idconcepto)
    {
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

    public function eliminarDatosTempTable($ids, $table, $idconcepto)
    {
        if (isset($ids[0])) {
            $query = Doctrine_Query::create();
            $query->delete()->from($table . ' temp')->whereIn(
                'temp.' . Doctrine::getTable($table)->getIdentifier(), $ids
            )->execute();
        }
        return true;
    }

    public function eliminarPostDatosErrorTempTable($table)
    {
        if (!empty($table)) {
            $query = Doctrine_Query::create();
            $query->delete()->from($table . ' temp')->addWhere(
                'temp.iddatosnomenclador is not null AND temp.iddatosnomenclador < ?', 100
            )->execute();
        }
        return true;
    }

    public function exportarTempTable($cols = array(), $tempdata = array())
    {
        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment");
        header("Content-Transfer-Encoding: binary ");
        $cuerporeporte = '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        $cuerporeporte .= "<table border=1>\n";
        if ($cols[0]['idconfiguracion'] == 3) //Cliente proveedor
            $cuerporeporte .= "<caption>CONCEPTOS</caption>\n";
        $cuerporeporte .= "<tr>\n";
        foreach ($cols as $value) {
            //$cuerporeporte .= "<th>" . utf8_decode($value ['etiqueta']) . "</th>\n";
            $cuerporeporte .= "<th>" . ($value ['etiqueta']) . "</th>\n";
        }
        $cuerporeporte .= "</tr>\n";
        foreach ($tempdata['data'] as $k => $value) {
            $cuerporeporte .= "<tr>\n";
            foreach ($cols as $valuec) {
                if ($valuec['nombrecampo'] == 'iddatosnomenclador') {
                    //$cuerporeporte .= "<td>" . utf8_decode($value['NomDatosnomenclador']['denominacion']) . "</td>\n";
                    $cuerporeporte .= "<td>" . ($value['NomDatosnomenclador']['denominacion']) . "</td>\n";
                } else {
                    //$cuerporeporte .= "<td>" . utf8_decode($value[$valuec['nombrecampo']]) . "</td>\n";
                    $cuerporeporte .= "<td>" . ($value[$valuec['nombrecampo']]) . "</td>\n";
                }
            }
            $cuerporeporte .= "</tr>\n";
        }
        $cuerporeporte .= "</table>\n";
        $cuerporeporte .= '</BODY></HTML>';

        $nombrearchivo = (isset($cols[0])) ? $cols[0]['DatConfiguracionimportar']['NomConceptoimportar']['denominacion'] : 'Datos_erroneos';
        $nombrearchivo .= '_ERRORES(' . date('Y-m-d') . ')' . '.xls';
        $nombrearchivo = str_replace(' ', '_', str_replace('/', '_', $nombrearchivo));

        $register = Zend_Registry::getInstance();
        $dirarchivo = $register->config->modulo_path . 'resources/descargas/'
            . $nombrearchivo;
        $dirarchivo = str_replace("apps", "web", $dirarchivo);

        $fp = fopen($dirarchivo, 'w+b');
        if ($fp) {
            fwrite($fp, $cuerporeporte);
            fclose($fp);
        }
        return $nombrearchivo;
    }

    public function exportarTempTableOld($cols = array(), $tempdata = array())
    {
        header("Pragma: public");
        header("Expires: 0");
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=ConceptoErrores.xls");
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

    public function importarFichero($params)
    {
        $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
        foreach ($array_ests_dnom as $k => $dn) {
            unset($array_ests_dnom[$k]);
            $array_ests_dnom[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
        }
        $identidad = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;

        $indicador = self::obtenerColumnasDadoIdConcepto($params ['idconcepto']);
        $this->tablaTemp = is_array($indicador) ? $indicador[0]['DatConfiguracionimportar']['tablatemporal'] : null;
        $save = 100;
        self::setearIncludePath('importar');
        try {
            $archivo = $params['file'];
            $inputFileType = PHPExcel_IOFactory::identify($archivo);
            $objReader = PHPExcel_IOFactory::createReader($inputFileType);
            $objPHPExcel = $objReader->load($archivo);
            $sheet = $objPHPExcel->getSheet(0);
            $highestRow = $sheet->getHighestRow();
            $highestColumn = $sheet->getHighestColumn();
        } catch (Exception $e) {
            return array('cod' => 0); //Error libreria lectura Excel
        }
        $valores['vacios'] = 0;
        switch ($params['idconcepto']) {
            case 1: //IMPORTAR CUENTAS POR COBRAR/PAGAR
                if (!empty($this->tablaTemp)) {
                    //Elimino los datos cargados anteriormente que dieron error
                    self::eliminarPostDatosErrorTempTable($this->tablaTemp);

                    $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                    $cont = 0;
                    for ($fila = 2; $fila <= $highestRow; $fila++) {

                        $row[0] = $sheet->getCell("A" . $fila)->getValue();
                        $numdocumento = trim(($row[0]));
                        if (empty($numdocumento)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->numdocumento = 'NULL';
                        } else $model[$cont]->numdocumento = $numdocumento;

                        $row[1] = $sheet->getCell("B" . $fila)->getValue();
                        $condicionpago = trim(($row[1]));
                        if (empty($condicionpago)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->condicionpago = 'NULL';
                        } else $model[$cont]->condicionpago = self::stringBuscar($condicionpago);

                        $row[2] = $sheet->getCell("C" . $fila)->getFormattedValue();
                        $fechaemision = trim(($row[2]));
                        if (empty($fechaemision)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->fechaemision = 'NULL';
                        } else {
                            if (!self::date_is_valid($fechaemision)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                                $model[$cont]->fechaemision = $fechaemision . '-> FORMATO: DD/MM/AAAA';
                            } else $model[$cont]->fechaemision = $fechaemision;
                        }

                        $row[3] = $sheet->getCell("D" . $fila)->getValue();
                        $importependiente = self::validarNumericPositivo(trim($row[3]));
                        if ($importependiente == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->importependiente = 'NUMERO FUERA DE FORMATO';
                        } else $model[$cont]->importependiente = $importependiente;

                        $row[4] = $sheet->getCell("E" . $fila)->getValue();
                        $model[$cont]->comentario = trim($row[4]);

                        $row[5] = $sheet->getCell("F" . $fila)->getValue();
                        $numclienteproveedor = trim(($row[5]));
                        if (empty($numclienteproveedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->numclienteproveedor = 'NULL';
                        } else $model[$cont]->numclienteproveedor = self::eliminarEspaciosBlanco($numclienteproveedor);

                        $row[6] = $sheet->getCell("G" . $fila)->getValue();
                        $clienteproveedor = trim(($row[6]));
                        if (empty($clienteproveedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->clienteproveedor = 'NULL';
                        } else $model[$cont]->clienteproveedor = $clienteproveedor;

                        $row[7] = $sheet->getCell("H" . $fila)->getValue();
                        $cuentacontable = trim(($row[7]));
                        if (empty($cuentacontable)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->cuentacontable = 'NULL';
                        } else {
                            $cuentacontable = str_replace('-', '.', $cuentacontable);
                            $cuentacontable = self::eliminarEspaciosBlanco($cuentacontable);
                            $model[$cont]->cuentacontable = $cuentacontable;
                        }

                        $row[8] = $sheet->getCell("I" . $fila)->getValue();
                        $tipoobligacion = trim(($row[8]));
                        if (empty($tipoobligacion)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->tipoobligacion = 'NULL';
                        } else {
                            $tipoobligacion = strtoupper($tipoobligacion);
                            if ($tipoobligacion == 'COBRO ANTICIPADO' || $tipoobligacion == 'COBROS ANTICIPADOS')
                                $model[$cont]->tipoobligacion = '1';
                            else if ($tipoobligacion == 'PAGO ANTICIPADO' || $tipoobligacion == 'PAGOS ANTICIPADOS')
                                $model[$cont]->tipoobligacion = '2';
                            else {
                                if ($tipoobligacion == '1' || $tipoobligacion == '2')
                                    $model[$cont]->tipoobligacion = $tipoobligacion;
                                else {
                                    $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                    $model[$cont]->tipoobligacion = 'NULL';
                                }

                            }
                        }

                        $row[9] = $sheet->getCell("J" . $fila)->getValue();
                        $tipodeudoracreedor = trim(($row[9]));
                        if (empty($tipodeudoracreedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->tipodeudoracreedor = 'NULL';
                        } else {
                            $tipodeudoracreedor = strtoupper($tipodeudoracreedor);
                            if ($tipodeudoracreedor == 'CLIENTE/PROVEEDOR' || $tipodeudoracreedor == 'CLIENTE Y/O PROVEEDOR' || $tipodeudoracreedor == 'CLIENTE-PROVEEDOR')
                                $model[$cont]->tipodeudoracreedor = '1';
                            else if ($tipodeudoracreedor == 'TRABAJADOR' || $tipodeudoracreedor == 'TRABAJADORES')
                                $model[$cont]->tipodeudoracreedor = '2';
                            else if ($tipodeudoracreedor == 'PRESUPUESTO' || $tipodeudoracreedor == 'PRESUPUESTOS')
                                $model[$cont]->tipodeudoracreedor = '3';
                            else if ($tipodeudoracreedor == '1' || $tipodeudoracreedor == '2' || $tipodeudoracreedor == '3')
                                $model[$cont]->tipodeudoracreedor = $tipodeudoracreedor;
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->tipoobligacion = 'NULL';
                            }

                        }

                        if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                        if ($cont % $save == 0) {
                            $model->save();
                        }
                        $cont++;
                        array_push($valores['datos'], $row);
                        if (self::stopCargaDatos($valores)) break;
                    }
                    unset($model[$cont]);
                    $model->save();
                    return array('cod' => 1);
                }
                break;
            case 2: //IMPORTAR COBRO-PAGO ANTICIPADO
                if (!empty($this->tablaTemp)) {
                    //Elimino los datos cargados anteriormente que dieron error
                    self::eliminarPostDatosErrorTempTable($this->tablaTemp);

                    $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                    $cont = 0;
                    for ($fila = 2; $fila <= $highestRow; $fila++) {
                        $row[0] = $sheet->getCell("A" . $fila)->getValue();
                        $numdocumento = trim(($row[0]));
                        if (empty($numdocumento)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->numdocumento = 'NULL';
                        } else $model[$cont]->numdocumento = $numdocumento;

                        $row[1] = $sheet->getCell("B" . $fila)->getValue();
                        $condicionpago = trim(($row[1]));
                        if (empty($condicionpago)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->condicionpago = 'NULL';
                        } else $model[$cont]->condicionpago = self::stringBuscar($condicionpago);

                        $row[2] = $sheet->getCell("C" . $fila)->getFormattedValue();
                        $fechaemision = trim(($row[2]));
                        if (empty($fechaemision)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->fechaemision = 'NULL';
                        } else {
                            if (!self::date_is_valid($fechaemision)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                                $model[$cont]->fechaemision = $fechaemision . '-> FORMATO: DD/MM/AAAA';
                            } else $model[$cont]->fechaemision = $fechaemision;
                        }

                        $row[3] = $sheet->getCell("D" . $fila)->getValue();
                        $importependiente = self::validarNumericPositivo(trim($row[3]));
                        if ($importependiente == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->importependiente = 'NUMERO FUERA DE FORMATO';
                        } else $model[$cont]->importependiente = $importependiente;

                        $row[4] = $sheet->getCell("E" . $fila)->getValue();
                        $model[$cont]->comentario = trim($row[4]);

                        $row[5] = $sheet->getCell("F" . $fila)->getValue();
                        $numclienteproveedor = trim(($row[5]));
                        if (empty($numclienteproveedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->numclienteproveedor = 'NULL';
                        } else $model[$cont]->numclienteproveedor = self::eliminarEspaciosBlanco($numclienteproveedor);

                        $row[6] = $sheet->getCell("G" . $fila)->getValue();
                        $clienteproveedor = trim(($row[6]));
                        if (empty($clienteproveedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->clienteproveedor = 'NULL';
                        } else $model[$cont]->clienteproveedor = $clienteproveedor;

                        $row[7] = $sheet->getCell("H" . $fila)->getValue();
                        $cuentacontable = trim(($row[7]));
                        if (empty($cuentacontable)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->cuentacontable = 'NULL';
                        } else {
                            $cuentacontable = str_replace('-', '.', $cuentacontable);
                            $cuentacontable = self::eliminarEspaciosBlanco($cuentacontable);
                            $model[$cont]->cuentacontable = $cuentacontable;
                        }

                        $row[8] = $sheet->getCell("I" . $fila)->getValue();
                        $tipoobligacion = trim(($row[8]));
                        if (empty($tipoobligacion)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->tipoobligacion = 'NULL';
                        } else {
                            $tipoobligacion = strtoupper($tipoobligacion);
                            if ($tipoobligacion == 'COBRO ANTICIPADO' || $tipoobligacion == 'COBROS ANTICIPADOS')
                                $model[$cont]->tipoobligacion = '1';
                            else if ($tipoobligacion == 'PAGO ANTICIPADO' || $tipoobligacion == 'PAGOS ANTICIPADOS')
                                $model[$cont]->tipoobligacion = '2';
                            else {
                                if ($tipoobligacion == '1' || $tipoobligacion == '2')
                                    $model[$cont]->tipoobligacion = $tipoobligacion;
                                else {
                                    $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                    $model[$cont]->tipoobligacion = 'NULL';
                                }

                            }
                        }

                        $row[9] = $sheet->getCell("J" . $fila)->getValue();
                        $tipodeudoracreedor = trim(($row[9]));
                        if (empty($tipodeudoracreedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->tipodeudoracreedor = 'NULL';
                        } else {
                            $tipodeudoracreedor = strtoupper($tipodeudoracreedor);
                            if ($tipodeudoracreedor == 'CLIENTE/PROVEEDOR' || $tipodeudoracreedor == 'CLIENTE Y/O PROVEEDOR' || $tipodeudoracreedor == 'CLIENTE-PROVEEDOR')
                                $model[$cont]->tipodeudoracreedor = '1';
                            else if ($tipodeudoracreedor == 'TRABAJADOR' || $tipodeudoracreedor == 'TRABAJADORES')
                                $model[$cont]->tipodeudoracreedor = '2';
                            else if ($tipodeudoracreedor == 'PRESUPUESTO' || $tipodeudoracreedor == 'PRESUPUESTOS')
                                $model[$cont]->tipodeudoracreedor = '3';
                            else if ($tipodeudoracreedor == '1' || $tipodeudoracreedor == '2' || $tipodeudoracreedor == '3')
                                $model[$cont]->tipodeudoracreedor = $tipodeudoracreedor;
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->tipoobligacion = 'NULL';
                            }

                        }

                        if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                        if ($cont % $save == 0) {
                            $model->save();
                        }
                        $cont++;
                        array_push($valores['datos'], $row);
                        if (self::stopCargaDatos($valores)) break;
                    }
                    unset($model[$cont]);
                    $model->save();
                    return array('cod' => 1);
                }
                break;
            case 3: //IMPORTAR CLIENTES Y PROVEEDORES
                if (!empty($this->tablaTemp)) {
                    //Elimino los datos cargados anteriormente que dieron error
                    self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                    $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                    $cont = 0;
                    for ($fila = 3; $fila <= $highestRow; $fila++) {
                        $row[0] = $sheet->getCell("A" . $fila)->getValue();
                        $tipo = trim(($row[0]));
                        if (empty($tipo)) {
                            $model[$cont]->tipo = $array_ests_dnom['camposvacios'];
                            $model[$cont]->tipo = 'NULL';
                        } else {
                            $tipo = strtoupper($tipo);
                            if ($tipo == 'CLIENTE' || $tipo == 'CLIENTES')   //CLIENTE/PROVEEDOR
                                $model[$cont]->tipo = '1';
                            else if ($tipo == 'PROVEEDOR' || $tipo == 'PROVEEDORES')
                                $model[$cont]->tipo = '2';
                            else if ($tipo == '1' || $tipo == '2')
                                $model[$cont]->tipo = $tipo;
                            else $model[$cont]->tipo = '3'; //CLIENTE/PROVEEDOR
                        }

                        $row[1] = $sheet->getCell("B" . $fila)->getValue();
                        $subcodigoreeup = self::validarNumericPositivo(trim($row[1]));
                        if ($subcodigoreeup == 'no') {
                            $model[$cont]->subcodigoreeup = '';
                        } else $model[$cont]->subcodigoreeup = $subcodigoreeup;

                        $row[2] = $sheet->getCell("C" . $fila)->getValue();
                        $codigoreeup = trim(($row[2]));
                        if (empty($codigoreeup)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->codigoreeup = 'NULL';
                        } else $model[$cont]->codigoreeup = self::eliminarEspaciosBlanco($codigoreeup);

                        $row[3] = $sheet->getCell("D" . $fila)->getValue();
                        $nombre = trim(($row[3]));
                        if (empty($nombre)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->nombre = 'NULL';
                        } else $model[$cont]->nombre = $nombre;

                        $row[4] = $sheet->getCell("E" . $fila)->getValue();
                        $model[$cont]->codigonit = trim(($row[4]));

                        $row[5] = $sheet->getCell("F" . $fila)->getValue();
                        $model[$cont]->correo = trim(($row[5]));

                        $row[6] = $sheet->getCell("G" . $fila)->getValue();
                        $model[$cont]->telefono = str_replace('-', ',', trim(($row[6])));

                        $row[7] = $sheet->getCell("H" . $fila)->getValue();
                        $model[$cont]->provincia = trim(($row[7]));

                        $row[8] = $sheet->getCell("I" . $fila)->getValue();
                        $model[$cont]->abreviatura = trim(($row[8]));

                        $row[9] = $sheet->getCell("J" . $fila)->getValue();
                        $model[$cont]->direccion = str_replace("'", '', trim(($row[9])));
                        //**CONTACTO**
                        $row[10] = $sheet->getCell("K" . $fila)->getValue();
                        $model[$cont]->nombrecontacto = trim($row[10]);

                        $row[11] = $sheet->getCell("L" . $fila)->getValue();
                        $cicontacto = str_replace(' ', '', trim($row[11]));
                        $long = strlen($cicontacto);
                        if (!empty($cicontacto) && ($long != 11 && $long != 6))
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatoidsuin'];
                        $model[$cont]->cicontacto = $cicontacto;

                        $row[12] = $sheet->getCell("M" . $fila)->getValue();
                        $model[$cont]->movilcontacto = trim(($row[12]));

                        $row[13] = $sheet->getCell("N" . $fila)->getValue();
                        $model[$cont]->telefonocontacto = str_replace('-', ',', trim(($row[13])));

                        $row[14] = $sheet->getCell("O" . $fila)->getValue();
                        $model[$cont]->direccioncontacto = str_replace("'", '', trim(($row[14])));

                        $row[15] = $sheet->getCell("P" . $fila)->getValue();
                        $model[$cont]->cargocontacto = trim(($row[15]));

                        $row[16] = $sheet->getCell("Q" . $fila)->getValue();
                        $model[$cont]->facultadcontacto = trim(($row[16]));
                        //**CUENTA BANCARIA MN**
                        $row[17] = $sheet->getCell("R" . $fila)->getValue();
                        $numcuentamn = trim(($row[17]));
                        if (empty($numcuentamn)) {
                            $model[$cont]->numcuentamn = '';
                            $model[$cont]->titularmn = '';
                            $model[$cont]->bancomn = '';
                            $model[$cont]->sucursalmn = '';
                        } else {
                            $model[$cont]->numcuentamn = $numcuentamn;
                            $row[18] = $sheet->getCell("S" . $fila)->getValue();
                            $titularmn = trim(($row[18]));
                            if (empty($titularmn)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->titularmn = 'NULL';
                            } else $model[$cont]->titularmn = $titularmn;

                            $row[19] = $sheet->getCell("T" . $fila)->getValue();
                            $bancomn = trim($row[19]);
                            if (empty($bancomn)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->bancomn = 'NULL';
                            } else $model[$cont]->bancomn = $bancomn;

                            $row[20] = $sheet->getCell("U" . $fila)->getValue();
                            $sucursalmn = trim(($row[20]));
                            if (empty($sucursalmn)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->sucursalmn = 'NULL';
                            } else $model[$cont]->sucursalmn = $sucursalmn;
                        }

                        //**CUENTA BANCARIA CUC**
                        $row[21] = $sheet->getCell("V" . $fila)->getValue();
                        $numcuentacuc = trim(($row[21]));
                        if (empty($numcuentacuc)) {
                            $model[$cont]->numcuentacuc = '';
                            $model[$cont]->titularcuc = '';
                            $model[$cont]->bancocuc = '';
                            $model[$cont]->sucursalcuc = '';
                            $model[$cont]->licbancariacuc = '';
                        } else {
                            $model[$cont]->numcuentacuc = $numcuentacuc;

                            $row[22] = $sheet->getCell("W" . $fila)->getValue();
                            $titularcuc = trim(($row[22]));
                            if (empty($titularcuc)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->titularcuc = 'NULL';
                            } else $model[$cont]->titularcuc = $titularcuc;

                            $row[23] = $sheet->getCell("X" . $fila)->getValue();
                            $bancocuc = trim(($row[23]));
                            if (empty($bancocuc)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->bancocuc = 'NULL';
                            } else $model[$cont]->bancocuc = $bancocuc;

                            $row[24] = $sheet->getCell("Y" . $fila)->getValue();
                            $sucursalcuc = trim(($row[24]));
                            if (empty($sucursalcuc)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->sucursalcuc = 'NULL';
                            } else $model[$cont]->sucursalcuc = $sucursalcuc;

                        }
                        $row[25] = $sheet->getCell("Z" . $fila)->getValue();
                        $licbancariacuc = trim(($row[25]));
                        if (!empty($licbancariacuc) && strlen($licbancariacuc) > 11)
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatolicbancariacuc'];
                        $model[$cont]->licbancariacuc = $licbancariacuc;

                        if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                        if ($cont % $save == 0) {
                            $model->save();
                        }
                        $cont++;
                        array_push($valores['datos'], $row);
                        if (self::stopCargaDatos($valores)) break;
                    }
                    unset($model[$cont]);
                    $model->save();
                    return array('cod' => 1);
                }
                break;
            case 4: //IMPORTAR CONTRATOS
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                for ($fila = 2; $fila <= $highestRow; $fila++) {
                    $row[0] = $sheet->getCell("A" . $fila)->getValue();
                    $model[$cont]->nocontrato = trim($row[0]);

                    $row[1] = $sheet->getCell("B" . $fila)->getValue();
                    $nocontratoproveedor = trim(($row[1]));
                    if (empty($nocontratoproveedor)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->nocontratoproveedor = 'NULL';
                    } else $model[$cont]->nocontratoproveedor = $nocontratoproveedor;

                    $row[2] = $sheet->getCell("C" . $fila)->getValue();
                    $codigoreeup = trim(($row[2]));
                    if (empty($codigoreeup)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->codigoreeup = 'NULL';
                    } else $model[$cont]->codigoreeup = $codigoreeup;

                    $row[3] = $sheet->getCell("D" . $fila)->getValue();
                    $nombrecliente = trim(($row[3]));
                    if (empty($nombrecliente)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->nombrecliente = 'NULL';
                    } else $model[$cont]->nombrecliente = $nombrecliente;

                    $row[4] = $sheet->getCell("E" . $fila)->getValue();
                    $tipocontrato = trim(($row[4]));
                    if (empty($tipocontrato)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->tipocontrato = 'NULL';
                    } else $model[$cont]->tipocontrato = $tipocontrato;

                    $row[5] = $sheet->getCell("F" . $fila)->getValue();
                    $sector = trim(($row[5]));
                    if (empty($sector)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->sector = 'NULL';
                    } else $model[$cont]->sector = $sector;

                    $row[6] = $sheet->getCell("G" . $fila)->getValue();
                    $model[$cont]->marco = trim($row[6]);

                    $row[7] = $sheet->getCell("H" . $fila)->getFormattedValue();
                    $fechafirma = trim(($row[7]));
                    if (!empty($fechafirma)) {
                        if (!self::date_is_valid($fechafirma)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                            $model[$cont]->fechafirma = $fechafirma . '-> FORMATO: DD/MM/AAAA';
                        } else $model[$cont]->fechafirma = $fechafirma;
                    } else $model[$cont]->fechafirma = $fechafirma;

                    $row[8] = $sheet->getCell("I" . $fila)->getValue();
                    $vigencia = self::validarNumericPositivo(trim($row[8]));
                    if ($vigencia == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->vigencia = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->vigencia = $vigencia;

                    $row[9] = $sheet->getCell("J" . $fila)->getValue();
                    $tiempo = trim(($row[9]));
                    if (empty($tiempo)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->tiempo = 'NULL';
                    } else $model[$cont]->tiempo = $tiempo;

                    $row[10] = $sheet->getCell("K" . $fila)->getValue();
                    $area = trim(($row[10]));
                    if (empty($area)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->area = 'NULL';
                    } else $model[$cont]->area = $area;

                    $row[11] = $sheet->getCell("L" . $fila)->getValue();
                    $ciresponsablearea = str_replace(' ', '', trim($row[11]));
                    if (empty($ciresponsablearea)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->ciresponsablearea = 'NULL';
                    } else {
                        $long = strlen($ciresponsablearea);
                        if ($long != 11 && $long != 6)
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatoidsuin'];
                        $model[$cont]->ciresponsablearea = $ciresponsablearea;
                    }

                    /*$row[11] = $sheet->getCell("L" . $fila)->getValue();
                    $ciresponsablearea = trim(($row[11]));
                    if (empty($ciresponsablearea)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->ciresponsablearea = 'NULL';
                    } else $model[$cont]->ciresponsablearea = $ciresponsablearea;*/

                    $row[12] = $sheet->getCell("M" . $fila)->getValue();
                    $model[$cont]->objeto = trim($row[12]);

                    $row[13] = $sheet->getCell("N" . $fila)->getValue();
                    $model[$cont]->descripcion = trim($row[13]);

                    $row[14] = $sheet->getCell("O" . $fila)->getValue();
                    $cup = trim($row[14]);
                    if (!empty($cup)) {
                        $num = self::validarNumericPositivo($cup);
                        if ($num == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->cup = $cup . ' -> NUMERO FUERA DE FORMATO';
                            $cup = 'invalid';
                        } else  $model[$cont]->cup = $cup;
                    } else {
                        $cup = 0;
                        $model[$cont]->cup = $cup;
                    }

                    $row[15] = $sheet->getCell("P" . $fila)->getValue();
                    $cuc = trim($row[15]);
                    if (!empty($cuc)) {
                        $num = self::validarNumericPositivo($cuc);
                        if ($num == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->cuc = $cuc . ' -> NUMERO FUERA DE FORMATO';
                            $cuc = 'invalid';
                        } else  $model[$cont]->cuc = $cuc;
                    } else {
                        $cuc = 0;
                        $model[$cont]->cuc = $cuc;
                    }

                    $row[16] = $sheet->getCell("Q" . $fila)->getValue();
                    $usd = trim($row[16]);
                    if (!empty($usd)) {
                        $num = self::validarNumericPositivo($usd);
                        if ($num == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->usd = $usd . ' -> NUMERO FUERA DE FORMATO';
                            $usd = 'invalid';
                        } else  $model[$cont]->usd = $usd;
                    } else {
                        $usd = 0;
                        $model[$cont]->usd = $usd;
                    }

                    $row[17] = $sheet->getCell("R" . $fila)->getValue();
                    $euro = trim($row[17]);
                    if (!empty($euro)) {
                        $num = self::validarNumericPositivo($euro);
                        if ($num == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->euro = $euro . ' -> NUMERO FUERA DE FORMATO';
                            $euro = 'invalid';
                        } else $model[$cont]->euro = $euro;
                    } else {
                        $euro = 0;
                        $model[$cont]->euro = $euro;
                    }
                    $parametros['cup'] = $cup;
                    $parametros['cuc'] = $cuc;
                    $parametros['usd'] = $usd;
                    $parametros['euro'] = $euro;
                    $montototal = self::calcularMontoTotal($parametros);
                    if (is_numeric($montototal))
                        $model[$cont]->montototal = $montototal;
                    else {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->montototal = 'VALORES DE MONEDA NO NUMERICOS';
                    }

                    /*$row[18] = $sheet->getCell("S" . $fila)->getFormattedValue();
                    $montototal = trim($row[18]);
                    if (!empty($montototal)) {
                        $montototal = self::validarNumericPositivo($montototal);
                        if ($montototal == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->montototal = 'NUMERO FUERA DE FORMATO';
                        } else $model[$cont]->montototal = $montototal;
                    } else $model[$cont]->montototal = $montototal;*/

                    $row[19] = $sheet->getCell("T" . $fila)->getValue();
                    $model[$cont]->mediopago = trim($row[19]);

                    $row[20] = $sheet->getCell("U" . $fila)->getValue();
                    $model[$cont]->condicionpago = trim($row[20]);

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) $model->save();
                    $cont++;
                    array_push($valores['datos'], $row);
                    if (self::stopCargaDatos($valores)) break;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
            case 5: //IMPORTAR ACTIVO FIJO
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                for ($fila = 2; $fila <= $highestRow; $fila++) {
                    $row[0] = $sheet->getCell("A" . $fila)->getValue();
                    $model[$cont]->codigoproveedor = trim($row[0]);

                    $row[1] = $sheet->getCell("B" . $fila)->getValue();
                    $denominacion = trim($row[1]);
                    if (empty($denominacion)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->desc_activofijo = 'NULL';
                    } else $model[$cont]->desc_activofijo = $denominacion;

                    $row[2] = $sheet->getCell("C" . $fila)->getValue();
                    $model[$cont]->numero_serie = trim($row[2]);

                    $row[3] = $sheet->getCell("D" . $fila)->getValue();
                    $numinventario = trim($row[3]);
                    if (empty($numinventario)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->id_rotulo = 'NULL';
                    } else $model[$cont]->id_rotulo = $numinventario;

                    $row[4] = $sheet->getCell("E" . $fila)->getValue();
                    $model[$cont]->clasificacion = trim($row[4]);

                    $row[5] = $sheet->getCell("F" . $fila)->getValue();
                    $model[$cont]->estadotecnico = trim($row[5]);

                    $row[6] = $sheet->getCell("G" . $fila)->getFormattedValue();
                    $valor_cup_inicial = self::validarNumericPositivo(trim($row[6]));
                    if ($valor_cup_inicial == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->valor_cup_inicial = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->valor_cup_inicial = $valor_cup_inicial;

                    $row[7] = $sheet->getCell("H" . $fila)->getFormattedValue();
                    $valor_cuc_inicial = self::validarNumericPositivo(trim($row[7]));
                    if ($valor_cuc_inicial == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->valor_cuc_inicial = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->valor_cuc_inicial = $valor_cuc_inicial;

                    $row[8] = $sheet->getCell("I" . $fila)->getFormattedValue();
                    $valorcontable = trim($row[8]);
                    if (!empty($valorcontable)) {
                        $valorcontable = self::validarNumericPositivo($valorcontable);
                        if ($valorcontable == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->valorcontable = 'NUMERO FUERA DE FORMATO';
                        } else $model[$cont]->valorcontable = $valorcontable;
                    }
                    $row[9] = $sheet->getCell("J" . $fila)->getFormattedValue();
                    $valorcontablealternativo = trim($row[9]);
                    if (!empty($valorcontablealternativo)) {
                        $valorcontablealternativo = self::validarNumericPositivo($valorcontablealternativo);
                        if ($valorcontablealternativo == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->valorcontablealternativo = 'NUMERO FUERA DE FORMATO';
                        } else $model[$cont]->valorcontablealternativo = $valorcontablealternativo;
                    }

                    $row[10] = $sheet->getCell("K" . $fila)->getFormattedValue();
                    $dep_cup_acumulada = self::validarNumericPositivo(trim($row[10]));
                    if ($dep_cup_acumulada == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->dep_cup_acumulada = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->dep_cup_acumulada = $dep_cup_acumulada;

                    $row[11] = $sheet->getCell("L" . $fila)->getFormattedValue();
                    $dep_cuc_acumulada = self::validarNumericPositivo(trim($row[11]));
                    if ($dep_cuc_acumulada == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->dep_cuc_acumulada = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->dep_cuc_acumulada = $dep_cuc_acumulada;

                    $row[12] = $sheet->getCell("M" . $fila)->getFormattedValue();
                    $tasa_depreciacion = self::validarNumericPositivo(trim($row[12]));
                    if ($tasa_depreciacion == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->tasa_depreciacion = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->tasa_depreciacion = $tasa_depreciacion;

                    $row[13] = $sheet->getCell("N" . $fila)->getFormattedValue();
                    $fechaadquisicion = trim($row[13]);
                    if (!empty($fechaadquisicion)) {
                        if (!self::date_is_valid($fechaadquisicion)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                            $model[$cont]->fecha_alta = $fechaadquisicion . '-> FORMATO: DD/MM/AAAA';
                        } else $model[$cont]->fecha_alta = $fechaadquisicion;
                    } else {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->fecha_alta = 'NULL';
                    }

                    $row[14] = $sheet->getCell("O" . $fila)->getFormattedValue();
                    $fechainiexplotacion = trim($row[14]);
                    if (!empty($fechainiexplotacion)) {
                        if (!self::date_is_valid($fechainiexplotacion)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                            $model[$cont]->fechainiexplotacion = $fechainiexplotacion . '-> FORMATO: DD/MM/AAAA';
                        } else $model[$cont]->fechainiexplotacion = $fechainiexplotacion;
                    }

                    $row[15] = $sheet->getCell("P" . $fila)->getValue();
                    $model[$cont]->color1 = trim($row[15]);

                    $row[16] = $sheet->getCell("Q" . $fila)->getValue();
                    $model[$cont]->color2 = trim($row[16]);

                    $row[17] = $sheet->getCell("R" . $fila)->getValue();
                    $model[$cont]->matricula = trim($row[17]);

                    $row[18] = $sheet->getCell("S" . $fila)->getValue();
                    $model[$cont]->circulacion = trim($row[18]);

                    $row[19] = $sheet->getCell("T" . $fila)->getValue();
                    $model[$cont]->nromotor = trim($row[19]);

                    $row[20] = $sheet->getCell("U" . $fila)->getValue();
                    $area = trim($row[20]);
                    if (empty($area)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->area = 'NULL';
                    } else $model[$cont]->area = $area;

                    $row[21] = $sheet->getCell("V" . $fila)->getValue();
                    $id_centrocosto = trim($row[21]);
                    if (empty($id_centrocosto)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->id_centrocosto = 'NULL';
                    } else $model[$cont]->id_centrocosto = $id_centrocosto;

                    $row[22] = $sheet->getCell("W" . $fila)->getValue();
                    $ciresponsable = str_replace(' ', '', trim($row[22]));
                    if (empty($ciresponsable)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->responsable = 'NULL';
                    } else {
                        $long = strlen($ciresponsable);
                        if ($long != 11 && $long != 6)
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatoidsuin'];
                        $model[$cont]->responsable = $ciresponsable;
                    }

                    /*$row[22] = $sheet->getCell("W" . $fila)->getValue();
                    $ciresponsable = trim($row[22]);
                    if (empty($ciresponsable)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->responsable = 'NULL';
                    } else $model[$cont]->responsable = $ciresponsable;*/

                    $model[$cont]->idestructuracomun_distra = $identidad;
                    $model[$cont]->migrado = 1;

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) {
                        $model->save();
                    }
                    $cont++;
                    array_push($valores['datos'], $row);
                    if (self::stopCargaDatos($valores)) break;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
            case 6: //IMPORTAR UTILES
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                for ($fila = 2; $fila <= $highestRow; $fila++) {
                    /*$row[0] = $sheet->getCell("A" . $fila)->getValue();
                    $model[$cont]->codigo = trim($row[0]);*/

                    $row[1] = $sheet->getCell("B" . $fila)->getValue();
                    $denominacion = trim($row[1]);
                    if (empty($denominacion)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->denomindicador = 'NULL';
                    } else $model[$cont]->denomindicador = $denominacion;

                    $getv = $sheet->getCell("C" . $fila)->getValue();
                    $getf = $sheet->getCell("C" . $fila)->getFormattedValue();
                    $row[2] = empty($getv) ? $getf : $getv;
                    $cantidad = self::validarNumericPositivo(trim($row[2]));
                    if ($cantidad == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->cantidad = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->cantidad = $cantidad;

                    $getv = $sheet->getCell("D" . $fila)->getValue();
                    $getf = $sheet->getCell("D" . $fila)->getFormattedValue();
                    $row[3] = empty($getv) ? $getf : $getv;
                    $valor_cup = self::validarNumericPositivo(trim($row[3]));
                    if ($valor_cup == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->valor_cup = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->valor_cup = $valor_cup;

                    $getv = $sheet->getCell("E" . $fila)->getValue();
                    $getf = $sheet->getCell("E" . $fila)->getFormattedValue();
                    $row[4] = empty($getv) ? $getf : $getv;
                    $valor_cuc = self::validarNumericPositivo(trim($row[4]));
                    if ($valor_cuc == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->valor_cuc = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->valor_cuc = $valor_cuc;

                    $row[5] = $sheet->getCell("F" . $fila)->getValue();
                    $model[$cont]->grupo = trim($row[5]);

                    $row[6] = $sheet->getCell("G" . $fila)->getValue();
                    $model[$cont]->estadotecnico = trim($row[6]);

                    $row[7] = $sheet->getCell("H" . $fila)->getFormattedValue();
                    $fechainiexplotacion = trim($row[7]);
                    if (!empty($fechainiexplotacion)) {
                        if (!self::date_is_valid($fechainiexplotacion)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                            $model[$cont]->fechainiexplotacion = $fechainiexplotacion . '-> FORMATO: DD/MM/AAAA';
                        } else $model[$cont]->fechainiexplotacion = $fechainiexplotacion;
                    }

                    $row[8] = $sheet->getCell("I" . $fila)->getValue();
                    $area = trim($row[8]);
                    if (empty($area)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->area = 'NULL';
                    } else $model[$cont]->area = $area;

                    $row[9] = $sheet->getCell("J" . $fila)->getValue();
                    $id_centrocosto = trim($row[9]);
                    if (empty($id_centrocosto)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->id_centrocosto = 'NULL';
                    } else $model[$cont]->id_centrocosto = $id_centrocosto;

                    $row[10] = $sheet->getCell("K" . $fila)->getValue();
                    $ciresponsable = str_replace(' ', '', trim($row[10]));
                    if (empty($ciresponsable)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->idempleado = 'NULL';
                    } else {
                        $long = strlen($ciresponsable);
                        if ($long != 11 && $long != 6)
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatoidsuin'];
                        $model[$cont]->idempleado = $ciresponsable;
                    }

                    /*$row[10] = $sheet->getCell("K" . $fila)->getValue();
                    $ciresponsable = trim($row[10]);
                    if (empty($ciresponsable)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->idempleado = 'NULL';
                    } else $model[$cont]->idempleado = $ciresponsable;*/

                    $model[$cont]->idestructuracomun_distra = $identidad;
                    $model[$cont]->migrado = 1;

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) {
                        $model->save();
                    }
                    $cont++;
                    array_push($valores['datos'], $row);
                    if (self::stopCargaDatos($valores)) break;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
            case 7: //IMPORTAR PERSONA
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                for ($fila = 2; $fila <= $highestRow; $fila++) {
                    $row[1] = $sheet->getCell("B" . $fila)->getValue();
                    $nombre = trim($row[1]);
                    if (empty($nombre)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->nombre = 'NULL';
                    } else $model[$cont]->nombre = $nombre;

                    $row[2] = $sheet->getCell("C" . $fila)->getValue();
                    $model[$cont]->segnombre = trim($row[2]);

                    $row[3] = $sheet->getCell("D" . $fila)->getValue();
                    $apellido = trim($row[3]);
                    if (empty($apellido)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->apellido = 'NULL';
                    } else $model[$cont]->apellido = $apellido;

                    $row[4] = $sheet->getCell("E" . $fila)->getValue();
                    $model[$cont]->segapellido = trim($row[4]);

                    $row[5] = $sheet->getCell("F" . $fila)->getValue();
                    $sexo = trim($row[5]);
                    if (empty($sexo)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->sexo = 'NULL';
                    } else $model[$cont]->sexo = $sexo;

                    $row[6] = $sheet->getCell("G" . $fila)->getValue();
                    $idsuin = trim($row[6]);

                    $row[7] = $sheet->getCell("H" . $fila)->getValue();
                    $expedientefar = trim($row[7]);

                    if (empty($idsuin) && empty($expedientefar)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->idsuin = 'NULL';
                    } else {
                        $idsuin = str_replace(' ', '', $idsuin);
                        if (strlen($idsuin) != 11)
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatoidsuin'];
                        else $model[$cont]->idsuin = $idsuin;

                        $expedientefar = str_replace(' ', '', $expedientefar);
                        if (!empty($expedientefar) && strlen($expedientefar) != 6)
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorexpedientefar'];
                        else $model[$cont]->expedientefar = $expedientefar;
                    }
                    $row[8] = $sheet->getCell("I" . $fila)->getFormattedValue();
                    $model[$cont]->fechanacimiento = trim($row[8]);

                    $row[9] = $sheet->getCell("J" . $fila)->getValue();
                    $model[$cont]->colorpiel = trim($row[9]);

                    $row[10] = $sheet->getCell("K" . $fila)->getValue();
                    $model[$cont]->direccion = str_replace("'", '', trim($row[10]));

                    $row[11] = $sheet->getCell("L" . $fila)->getValue();
                    $model[$cont]->provincia = trim($row[11]);

                    $row[12] = $sheet->getCell("M" . $fila)->getValue();
                    $model[$cont]->municipio = trim($row[12]);

                    $row[13] = $sheet->getCell("N" . $fila)->getValue();
                    $model[$cont]->correoelectronico = trim($row[13]);

                    $row[14] = $sheet->getCell("O" . $fila)->getValue();
                    $cuentabancariacup = trim($row[14]);

                    $row[15] = $sheet->getCell("P" . $fila)->getValue();
                    $bancocup = trim($row[15]);

                    if (!empty($cuentabancariacup) && empty($bancocup)) {
                        $model[$cont]->cuentabancariacup = $cuentabancariacup;
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->bancocup = 'NULL';
                    } elseif (empty($cuentabancariacup) && !empty($bancocup)) {
                        $model[$cont]->cuentabancariacup = 'NULL';
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->bancocup = $bancocup;
                    } else {
                        $model[$cont]->cuentabancariacup = $cuentabancariacup;
                        $model[$cont]->bancocup = $bancocup;
                    }
                    $row[16] = $sheet->getCell("Q" . $fila)->getValue();
                    $cuentabancariacuc = trim($row[16]);

                    $row[17] = $sheet->getCell("R" . $fila)->getValue();
                    $bancocuc = trim($row[17]);

                    if (!empty($cuentabancariacuc) && empty($bancocuc)) {
                        $model[$cont]->cuentabancariacuc = $cuentabancariacuc;
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->bancocuc = 'NULL';
                    } elseif (empty($cuentabancariacuc) && !empty($bancocuc)) {
                        $model[$cont]->cuentabancariacuc = 'NULL';
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->bancocuc = $bancocuc;
                    } else {
                        $model[$cont]->cuentabancariacuc = $cuentabancariacuc;
                        $model[$cont]->bancocuc = $bancocuc;
                    }

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) {
                        $model->save();
                    }
                    $cont++;
                    array_push($valores['datos'], $row);
                    if (self::stopCargaDatos($valores)) break;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
            case 8: //IMPORTAR CUENTAS CLIENTES Y/O PROVEEDORES
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                for ($fila = 2; $fila <= $highestRow; $fila++) {
                    $row[0] = $sheet->getCell("A" . $fila)->getValue();
                    $codigo = trim(($row[0]));
                    if (empty($codigo)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->codigo = 'NULL';
                    } else $model[$cont]->codigo = $codigo;

                    $row[1] = $sheet->getCell("B" . $fila)->getValue();
                    $nocuenta = trim(($row[1]));
                    if (empty($nocuenta)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->nocuenta = 'NULL';
                    } else $model[$cont]->nocuenta = str_replace('-', '.', $nocuenta);

                    $row[2] = $sheet->getCell("C" . $fila)->getValue();
                    $clasificacion = trim(($row[2]));
                    if (empty($clasificacion)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->clasificacion = 'NULL';
                    } else {
                        if (is_numeric($clasificacion)) {
                            if ($clasificacion == 1 || $clasificacion == 2 || $clasificacion == 3 || $clasificacion == 4)
                                $model[$cont]->clasificacion = $clasificacion;
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->clasificacion = 'NULL';
                            }
                        } else {
                            $clasificacion = strtoupper($clasificacion);
                            if ($clasificacion == 'CUENTAS POR COBRAR' || $clasificacion == 'CUENTA POR COBRAR')
                                $model[$cont]->clasificacion = '1';
                            else if ($clasificacion == 'CUENTAS POR PAGAR' || $clasificacion == 'CUENTA POR PAGAR')
                                $model[$cont]->clasificacion = '2';
                            else if ($clasificacion == 'COBROS ANTICIPADOS' || $clasificacion == 'COBRO ANTICIPADO')
                                $model[$cont]->clasificacion = '3';
                            else if ($clasificacion == 'PAGOS ANTICIPADOS' || $clasificacion == 'PAGO ANTICIPADO')
                                $model[$cont]->clasificacion = '4';
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->clasificacion = 'NULL';
                            }
                        }
                    }
                    $row[3] = $sheet->getCell("D" . $fila)->getValue();
                    $condicion = trim(($row[3]));
                    if (empty($condicion)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->condicion = 'NULL';
                    } else $model[$cont]->condicion = $condicion;

                    $row[4] = $sheet->getCell("E" . $fila)->getValue();
                    $plazo = self::validarNumericPositivo(trim($row[4]));
                    if ($plazo == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->plazo = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->plazo = $plazo;

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) {
                        $model->save();
                    }
                    $cont++;
                    array_push($valores['datos'], $row);
                    if (self::stopCargaDatos($valores)) break;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
            case 9: //IMPORTAR MAESTRO DE PRODUCTOS
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $modeltemp = $model;
                $cont = 0;
                for ($fila = 2; $fila <= $highestRow; $fila++) {
                    $row[0] = $sheet->getCell("A" . $fila)->getValue();
                    $codigoproveedor = trim(($row[0]));
                    if (empty($codigoproveedor)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->codigoproveedor = 'NULL';
                    } else $model[$cont]->codigoproveedor = $codigoproveedor;

                    $row[1] = $sheet->getCell("B" . $fila)->getValue();
                    $denominacion = trim(($row[1]));
                    if (empty($denominacion)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->denominacion = 'NULL';
                    } else $model[$cont]->denominacion = $denominacion;

                    $row[2] = $sheet->getCell("C" . $fila)->getValue();
                    $umedida = trim(($row[2]));
                    if (empty($umedida)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->umedida = 'NULL';
                    } else $model[$cont]->umedida = $umedida;

                    $row[3] = $sheet->getCell("D" . $fila)->getValue();
                    $model[$cont]->naturaleza = trim(($row[3]));

                    $row[4] = $sheet->getCell("E" . $fila)->getValue();
                    $productoservicio = trim(($row[4]));
                    if (empty($productoservicio)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->productoservicio = 'NULL';
                    } else {
                        if (is_numeric($productoservicio)) {
                            if ($productoservicio == 1 || $productoservicio == 2)
                                $model[$cont]->productoservicio = $productoservicio;
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->productoservicio = 'NULL';
                            }
                        } else {
                            $productoservicio = strtoupper($productoservicio);
                            if ($productoservicio == 'PRODUCTO' || $productoservicio == 'PRODUCTOS')
                                $model[$cont]->productoservicio = '1';
                            else if ($productoservicio == 'SERVICIO' || $productoservicio == 'SERVICIOS')
                                $model[$cont]->productoservicio = '2';
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->productoservicio = 'NULL';
                            }
                        }
                    }
                    $row[5] = $sheet->getCell("F" . $fila)->getValue();
                    $almacenaexplota = trim(($row[5]));
                    if (empty($almacenaexplota)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->almacenaexplota = 'NULL';
                    } else {
                        if (is_numeric($almacenaexplota)) {
                            if ($almacenaexplota == 1 || $almacenaexplota == 2 || $almacenaexplota == 3)
                                $model[$cont]->almacenaexplota = $almacenaexplota;
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->almacenaexplota = 'NULL';
                            }
                        } else {
                            $almacenaexplota = strtoupper($almacenaexplota);
                            if ($almacenaexplota == 'ALMACENAMIENTO')
                                $model[$cont]->almacenaexplota = '1';
                            else if ($almacenaexplota == 'EXPLOTACION' || $almacenaexplota == 'EXPLOTACIÓN')
                                $model[$cont]->almacenaexplota = '2';
                            else if ($almacenaexplota == 'AMBOS' || $almacenaexplota == 'ALMACENAMIENTO/EXPLOTACION' || $almacenaexplota == 'ALMACENAMIENTO-EXPLOTACION' ||
                                $almacenaexplota == 'ALMACENAMIENTO/EXPLOTACIÓN' || $almacenaexplota == 'ALMACENAMIENTO-EXPLOTACIÓN')
                                $model[$cont]->almacenaexplota = '3';
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->almacenaexplota = 'NULL';
                            }
                        }
                    }
                    $row[6] = $sheet->getCell("G" . $fila)->getValue();
                    $utiloherra = trim(($row[6]));
                    if (empty($utiloherra)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->utiloherra = 'NULL';
                    } else {
                        if (is_numeric($utiloherra)) {
                            if ($utiloherra == 1 || $utiloherra == 2)
                                $model[$cont]->utiloherra = $utiloherra;
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->utiloherra = 'NULL';
                            }
                        } else {
                            $utiloherra = self::stringBuscar($utiloherra);
                            if ($utiloherra == 'SI' || self::buscarSubCadena($utiloherra, 'UTIL') || self::buscarSubCadena($utiloherra, 'HERRAM'))
                                $model[$cont]->utiloherra = '1';
                            else if ($utiloherra == 'NO')
                                $model[$cont]->utiloherra = '2';
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->utiloherra = 'NULL';
                            }
                        }
                    }
                    $row[7] = $sheet->getCell("H" . $fila)->getValue();
                    $almacenamiento = trim(($row[7]));
                    if (empty($almacenamiento) && $model[$cont]->productoservicio == '1') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->almacenamiento = 'NULL';
                    } else $model[$cont]->almacenamiento = strtoupper($almacenamiento);

                    $row[8] = $sheet->getCell("I" . $fila)->getValue();
                    $grupo = trim(($row[8]));
                    if (empty($grupo) && $activo == '1') { //Verificar como se si es activo
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->grupo = 'NULL';
                    } else $model[$cont]->grupo = $grupo;

                    $row[9] = $sheet->getCell("J" . $fila)->getValue();
                    $model[$cont]->marca = trim(($row[9]));

                    $row[10] = $sheet->getCell("K" . $fila)->getValue();
                    $model[$cont]->modelo = trim(($row[10]));

                    $row[11] = $sheet->getCell("L" . $fila)->getValue();
                    $model[$cont]->elementogasto = trim(($row[11]));

                    $row[12] = $sheet->getCell("M" . $fila)->getValue();
                    $model[$cont]->elementogastoalter = trim(($row[12]));

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) {
                        $model->save();
                    }
                    $cont++;
                    array_push($valores['datos'], $row);
                    if (self::stopCargaDatos($valores)) break;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
        }
        return array('cod' => 1);
    }

    public function stopCargaDatos(&$valores)
    {
        $data = $valores['datos'][0];
        $cant = count($data);
        $vacios = 0;
        foreach ($data as $key => $row) {
            if (empty($row)) $vacios++;
        }
        if ($vacios == $cant)
            $valores['vacios'] += 1;
        $valores['datos'] = array();
        if ($valores['vacios'] == 4) return true;
        else return false;
    }

    public function importarFicheroOld($params)
    {
        $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
        foreach ($array_ests_dnom as $k => $dn) {
            unset($array_ests_dnom[$k]);
            $array_ests_dnom[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
        }
        $identidad = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;

        $ruta = '/ReaderModel.php';
        include_once(dirname(__FILE__) . $ruta);
        $data = new ReaderModel();
        $data->setOutputEncoding('CP1251');
        $data->read($params['file']);
        $indicadores = $data->sheets[0]['cells'];

        $indicador = self::obtenerColumnasDadoIdConcepto($params ['idconcepto']);
        $this->tablaTemp = is_array($indicador) ? $indicador[0]['DatConfiguracionimportar']['tablatemporal'] : null;
        $save = 100;
        switch ($params['idconcepto']) {
            case 1: //IMPORTAR CUENTAS POR COBRAR/PAGAR
                if (!empty($this->tablaTemp)) {
                    //Elimino los datos cargados anteriormente que dieron error
                    self::eliminarPostDatosErrorTempTable($this->tablaTemp);

                    $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                    $cont = 0;
                    foreach ($indicadores as $row) {
                        //Ignorando los datos del encabezado de la tabla
                        if ($cont < 1) {
                            $cont++;
                            continue;
                        }
                        $numdocumento = trim(utf8_encode($row[0]));
                        if (empty($numdocumento)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->numdocumento = 'NULL';
                        } else $model[$cont]->numdocumento = $numdocumento;

                        $condicionpago = trim(utf8_encode($row[1]));
                        if (empty($condicionpago)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->condicionpago = 'NULL';
                        } else $model[$cont]->condicionpago = self::stringBuscar($condicionpago);

                        $fechaemision = trim(utf8_encode($row[2]));
                        if (empty($fechaemision)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->fechaemision = 'NULL';
                        } else {
                            if (!self::date_is_valid($fechaemision)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                                $model[$cont]->fechaemision = $fechaemision . '-> FORMATO: DD/MM/AAAA';
                            } else $model[$cont]->fechaemision = $fechaemision;
                        }

                        $importependiente = self::validarNumericPositivo(utf8_encode($row[3]));
                        if ($importependiente == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->importependiente = 'NUMERO FUERA DE FORMATO';
                        } else $model[$cont]->importependiente = $importependiente;

                        $model[$cont]->comentario = utf8_encode($row[4]);

                        $numclienteproveedor = trim(utf8_encode($row[5]));
                        if (empty($numclienteproveedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->numclienteproveedor = 'NULL';
                        } else $model[$cont]->numclienteproveedor = self::eliminarEspaciosBlanco($numclienteproveedor);

                        $clienteproveedor = trim(utf8_encode($row[6]));
                        if (empty($clienteproveedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->clienteproveedor = 'NULL';
                        } else $model[$cont]->clienteproveedor = $clienteproveedor;

                        $cuentacontable = trim(utf8_encode($row[7]));
                        if (empty($cuentacontable)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->cuentacontable = 'NULL';
                        } else {
                            $cuentacontable = str_replace('-', '.', $cuentacontable);
                            $cuentacontable = self::eliminarEspaciosBlanco($cuentacontable);
                            $model[$cont]->cuentacontable = $cuentacontable;
                        }

                        $tipoobligacion = trim(utf8_encode($row[8]));
                        if (empty($tipoobligacion)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->tipoobligacion = 'NULL';
                        } else {
                            $tipoobligacion = strtoupper($tipoobligacion);
                            if ($tipoobligacion == 'COBRO ANTICIPADO' || $tipoobligacion == 'COBROS ANTICIPADOS')
                                $model[$cont]->tipoobligacion = '1';
                            else if ($tipoobligacion == 'PAGO ANTICIPADO' || $tipoobligacion == 'PAGOS ANTICIPADOS')
                                $model[$cont]->tipoobligacion = '2';
                            else {
                                if ($tipoobligacion == '1' || $tipoobligacion == '2')
                                    $model[$cont]->tipoobligacion = $tipoobligacion;
                                else {
                                    $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                    $model[$cont]->tipoobligacion = 'NULL';
                                }

                            }
                        }

                        $tipodeudoracreedor = trim(utf8_encode($row[9]));
                        if (empty($tipodeudoracreedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->tipodeudoracreedor = 'NULL';
                        } else {
                            $tipodeudoracreedor = strtoupper($tipodeudoracreedor);
                            if ($tipodeudoracreedor == 'CLIENTE/PROVEEDOR' || $tipodeudoracreedor == 'CLIENTE Y/O PROVEEDOR' || $tipodeudoracreedor == 'CLIENTE-PROVEEDOR')
                                $model[$cont]->tipodeudoracreedor = '1';
                            else if ($tipodeudoracreedor == 'TRABAJADOR' || $tipodeudoracreedor == 'TRABAJADORES')
                                $model[$cont]->tipodeudoracreedor = '2';
                            else if ($tipodeudoracreedor == 'PRESUPUESTO' || $tipodeudoracreedor == 'PRESUPUESTOS')
                                $model[$cont]->tipodeudoracreedor = '3';
                            else {
                                if ($tipodeudoracreedor == '1' || $tipodeudoracreedor == '2' || $tipodeudoracreedor == '3')
                                    $model[$cont]->tipodeudoracreedor = $tipodeudoracreedor;
                                else {
                                    $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                    $model[$cont]->tipoobligacion = 'NULL';
                                }
                            }
                        }

                        if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                        if ($cont % $save == 0) {
                            $model->save();
                        }
                        $cont++;
                    }
                    unset($model[$cont]);
                    $model->save();
                    return array('cod' => 1);
                }
                break;
            case 2: //IMPORTAR COBRO-PAGO ANTICIPADO
                if (!empty($this->tablaTemp)) {
                    //Elimino los datos cargados anteriormente que dieron error
                    self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                    $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                    $cont = 0;
                    foreach ($indicadores as $row) {
                        //Ignorando los datos del encabezado de la tabla
                        if ($cont < 1) {
                            $cont++;
                            continue;
                        }
                        $numdocumento = trim(utf8_encode($row[0]));
                        if (empty($numdocumento)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->numdocumento = 'NULL';
                        } else $model[$cont]->numdocumento = $numdocumento;

                        $condicionpago = trim(utf8_encode($row[1]));
                        if (empty($condicionpago)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->condicionpago = 'NULL';
                        } else $model[$cont]->condicionpago = self::stringBuscar($condicionpago);

                        $fechaemision = trim(utf8_encode($row[2]));
                        if (empty($fechaemision)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->fechaemision = 'NULL';
                        } else {
                            if (!self::date_is_valid($fechaemision)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                                $model[$cont]->fechaemision = $fechaemision . '-> FORMATO: DD/MM/AAAA';
                            } else $model[$cont]->fechaemision = $fechaemision;
                        }

                        $importependiente = self::validarNumericPositivo(utf8_encode($row[3]));
                        if ($importependiente == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->importependiente = 'NUMERO FUERA DE FORMATO';
                        } else $model[$cont]->importependiente = $importependiente;

                        $model[$cont]->comentario = utf8_encode($row[4]);

                        $numclienteproveedor = trim(utf8_encode($row[5]));
                        if (empty($numclienteproveedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->numclienteproveedor = 'NULL';
                        } else $model[$cont]->numclienteproveedor = self::eliminarEspaciosBlanco($numclienteproveedor);

                        $clienteproveedor = trim(utf8_encode($row[6]));
                        if (empty($clienteproveedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->clienteproveedor = 'NULL';
                        } else $model[$cont]->clienteproveedor = $clienteproveedor;

                        $cuentacontable = trim(utf8_encode($row[7]));
                        if (empty($cuentacontable)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->cuentacontable = 'NULL';
                        } else {
                            $cuentacontable = str_replace('-', '.', $cuentacontable);
                            $cuentacontable = self::eliminarEspaciosBlanco($cuentacontable);
                            $model[$cont]->cuentacontable = $cuentacontable;
                        }

                        $tipoobligacion = trim(utf8_encode($row[8]));
                        if (empty($tipoobligacion)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->tipoobligacion = 'NULL';
                        } else {
                            $tipoobligacion = strtoupper($tipoobligacion);
                            if ($tipoobligacion == 'COBRO ANTICIPADO' || $tipoobligacion == 'COBROS ANTICIPADOS')
                                $model[$cont]->tipoobligacion = '1';
                            else if ($tipoobligacion == 'PAGO ANTICIPADO' || $tipoobligacion == 'PAGOS ANTICIPADOS')
                                $model[$cont]->tipoobligacion = '2';
                            else {
                                if ($tipoobligacion == '1' || $tipoobligacion == '2')
                                    $model[$cont]->tipoobligacion = $tipoobligacion;
                                else {
                                    $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                    $model[$cont]->tipoobligacion = 'NULL';
                                }

                            }
                        }

                        $tipodeudoracreedor = trim(utf8_encode($row[9]));
                        if (empty($tipodeudoracreedor)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->tipodeudoracreedor = 'NULL';
                        } else {
                            $tipodeudoracreedor = strtoupper($tipodeudoracreedor);
                            if ($tipodeudoracreedor == 'CLIENTE/PROVEEDOR' || $tipodeudoracreedor == 'CLIENTE Y/O PROVEEDOR' || $tipodeudoracreedor == 'CLIENTE-PROVEEDOR')
                                $model[$cont]->tipodeudoracreedor = '1';
                            else if ($tipodeudoracreedor == 'TRABAJADOR' || $tipodeudoracreedor == 'TRABAJADORES')
                                $model[$cont]->tipodeudoracreedor = '2';
                            else if ($tipodeudoracreedor == 'PRESUPUESTO' || $tipodeudoracreedor == 'PRESUPUESTOS')
                                $model[$cont]->tipodeudoracreedor = '3';
                            else {
                                if ($tipodeudoracreedor == '1' || $tipodeudoracreedor == '2' || $tipodeudoracreedor == '3')
                                    $model[$cont]->tipodeudoracreedor = $tipodeudoracreedor;
                                else {
                                    $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                    $model[$cont]->tipoobligacion = 'NULL';
                                }
                            }
                        }

                        if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                        if ($cont % $save == 0) {
                            $model->save();
                        }
                        $cont++;
                    }
                    unset($model[$cont]);
                    $model->save();
                    return array('cod' => 1);
                }
                break;
            case 3: //IMPORTAR CLIENTES Y PROVEEDORES
                if (!empty($this->tablaTemp)) {
                    //Elimino los datos cargados anteriormente que dieron error
                    self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                    $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                    $cont = 0;
                    foreach ($indicadores as $row) {
                        //Ignorando los datos del encabezado de la tabla
                        if ($cont < 2) {
                            $cont++;
                            continue;
                        }
                        $tipo = trim(utf8_encode($row[0]));
                        if (empty($tipo)) {
                            $model[$cont]->tipo = $array_ests_dnom['camposvacios'];
                            $model[$cont]->tipo = 'NULL';
                        } else {
                            $tipo = strtoupper($tipo);
                            if ($tipo == 'CLIENTE' || $tipo == 'CLIENTES')   //CLIENTE/PROVEEDOR
                                $model[$cont]->tipo = '1';
                            else if ($tipo == 'PROVEEDOR' || $tipo == 'PROVEEDORES')
                                $model[$cont]->tipo = '2';
                            else if ($tipo == 'CLIENTE Y/O PROVEEDOR' || 'CLIENTE-PROVEEDOR' || 'CLIENTES Y/O PROVEEDORES')
                                $model[$cont]->tipo = '3';
                            else {
                                if ($tipo == '1' || $tipo == '2' || $tipo == '3')
                                    $model[$cont]->tipo = $tipo;
                                else {
                                    $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                    $model[$cont]->tipo = 'NULL';
                                }
                            }
                        }

                        $subcodigoreeup = self::validarNumericPositivo(utf8_encode($row[1]));
                        if ($subcodigoreeup == 'no') {
                            $model[$cont]->subcodigoreeup = '';
                        } else $model[$cont]->subcodigoreeup = $subcodigoreeup;

                        $codigoreeup = trim(utf8_encode($row[2]));
                        if (empty($codigoreeup)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->codigoreeup = 'NULL';
                        } else $model[$cont]->codigoreeup = self::eliminarEspaciosBlanco($codigoreeup);

                        $nombre = trim(utf8_encode($row[3]));
                        if (empty($nombre)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                            $model[$cont]->nombre = 'NULL';
                        } else $model[$cont]->nombre = $nombre;

                        $model[$cont]->codigonit = trim(utf8_encode($row[4]));
                        $model[$cont]->correo = trim(utf8_encode($row[5]));
                        $model[$cont]->telefono = str_replace('-', ',', trim(utf8_encode($row[6])));
                        $model[$cont]->provincia = trim(utf8_encode($row[7]));
                        $model[$cont]->abreviatura = trim(utf8_encode($row[8]));
                        $model[$cont]->direccion = str_replace("'", '', trim(utf8_encode($row[9])));
                        //**CONTACTO**
                        $model[$cont]->nombrecontacto = trim(utf8_encode($row[10]));
                        $model[$cont]->cicontacto = trim(utf8_encode($row[11]));
                        $model[$cont]->movilcontacto = trim(utf8_encode($row[12]));
                        $model[$cont]->telefonocontacto = str_replace('-', ',', trim(utf8_encode($row[13])));
                        $model[$cont]->direccioncontacto = str_replace("'", '', trim(utf8_encode($row[14])));
                        $model[$cont]->cargocontacto = trim(utf8_encode($row[15]));
                        $model[$cont]->facultadcontacto = trim(utf8_encode($row[16]));
                        //**CUENTA BANCARIA MN**
                        $numcuentamn = trim(utf8_encode($row[17]));
                        if (empty($numcuentamn)) {
                            $model[$cont]->numcuentamn = '';
                            $model[$cont]->titularmn = '';
                            $model[$cont]->bancomn = '';
                            $model[$cont]->sucursalmn = '';
                        } else {
                            $model[$cont]->numcuentamn = $numcuentamn;

                            $titularmn = trim(utf8_encode($row[18]));
                            if (empty($titularmn)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->titularmn = 'NULL';
                            } else $model[$cont]->titularmn = $titularmn;

                            $bancomn = trim(utf8_encode($row[19]));
                            if (empty($bancomn)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->bancomn = 'NULL';
                            } else $model[$cont]->bancomn = $bancomn;

                            $sucursalmn = trim(utf8_encode($row[20]));
                            if (empty($sucursalmn)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->sucursalmn = 'NULL';
                            } else $model[$cont]->sucursalmn = $sucursalmn;
                        }

                        //**CUENTA BANCARIA CUC**
                        $numcuentacuc = trim(utf8_encode($row[21]));
                        if (empty($numcuentacuc)) {
                            $model[$cont]->numcuentacuc = '';
                            $model[$cont]->titularcuc = '';
                            $model[$cont]->bancocuc = '';
                            $model[$cont]->sucursalcuc = '';
                            $model[$cont]->licbancariacuc = '';
                        } else {
                            $model[$cont]->numcuentacuc = $numcuentacuc;

                            $titularcuc = trim(utf8_encode($row[22]));
                            if (empty($titularcuc)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->titularcuc = 'NULL';
                            } else $model[$cont]->titularcuc = $titularcuc;

                            $bancocuc = trim(utf8_encode($row[23]));
                            if (empty($bancocuc)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->bancocuc = 'NULL';
                            } else $model[$cont]->bancocuc = $bancocuc;

                            $sucursalcuc = trim(utf8_encode($row[24]));
                            if (empty($sucursalcuc)) {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                                $model[$cont]->sucursalcuc = 'NULL';
                            } else $model[$cont]->sucursalcuc = $sucursalcuc;

                        }
                        $model[$cont]->licbancariacuc = trim(utf8_encode($row[25]));

                        if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                        if ($cont % $save == 0) {
                            $model->save();
                        }
                        $cont++;
                    }
                    unset($model[$cont]);
                    $model->save();
                    return array('cod' => 1);
                }
                break;
            case 4: //IMPORTAR CONTRATOS
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                foreach ($indicadores as $row) {
                    //Ignorando los datos del encabezado de la tabla
                    if ($cont < 1) {
                        $cont++;
                        continue;
                    }
                    $model[$cont]->nocontrato = utf8_encode($row[0]);

                    $nocontratoproveedor = trim(utf8_encode($row[1]));
                    if (empty($nocontratoproveedor)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->nocontratoproveedor = 'NULL';
                    } else $model[$cont]->nocontratoproveedor = $nocontratoproveedor;

                    $codigoreeup = trim(utf8_encode($row[2]));
                    if (empty($codigoreeup)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->codigoreeup = 'NULL';
                    } else $model[$cont]->codigoreeup = $codigoreeup;

                    $nombrecliente = trim(utf8_encode($row[3]));
                    if (empty($nombrecliente)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->nombrecliente = 'NULL';
                    } else $model[$cont]->nombrecliente = $nombrecliente;

                    $tipocontrato = trim(utf8_encode($row[4]));
                    if (empty($tipocontrato)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->tipocontrato = 'NULL';
                    } else $model[$cont]->tipocontrato = $tipocontrato;

                    $sector = trim(utf8_encode($row[5]));
                    if (empty($sector)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->sector = 'NULL';
                    } else $model[$cont]->sector = $sector;

                    $model[$cont]->marco = utf8_encode($row[6]);

                    $fechafirma = trim(utf8_encode($row[7]));
                    if (!empty($fechafirma)) {
                        if (!self::date_is_valid($fechafirma)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                            $model[$cont]->fechafirma = $fechafirma . '-> FORMATO: DD/MM/AAAA';
                        } else $model[$cont]->fechafirma = $fechafirma;
                    } else $model[$cont]->fechafirma = $fechafirma;

                    $vigencia = self::validarNumericPositivo(utf8_encode($row[8]));
                    if ($vigencia == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->vigencia = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->vigencia = $vigencia;

                    $tiempo = trim(utf8_encode($row[9]));
                    if (empty($tiempo)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->tiempo = 'NULL';
                    } else $model[$cont]->tiempo = $tiempo;

                    $area = trim(utf8_encode($row[10]));
                    if (empty($area)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->area = 'NULL';
                    } else $model[$cont]->area = $area;

                    $ciresponsablearea = trim(utf8_encode($row[11]));
                    if (empty($ciresponsablearea)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->ciresponsablearea = 'NULL';
                    } else $model[$cont]->ciresponsablearea = $ciresponsablearea;

                    $model[$cont]->objeto = utf8_encode($row[12]);
                    $model[$cont]->descripcion = utf8_encode($row[13]);
                    $model[$cont]->cup = utf8_encode($row[14]);
                    $model[$cont]->cuc = utf8_encode($row[15]);
                    $model[$cont]->usd = utf8_encode($row[16]);
                    $model[$cont]->euro = utf8_encode($row[17]);

                    $montototal = utf8_encode($row[18]);
                    if (!empty($montototal)) {
                        $montototal = self::validarNumericPositivo($montototal);
                        if ($montototal == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->montototal = 'NUMERO FUERA DE FORMATO';
                        } else $model[$cont]->montototal = $montototal;
                    } else $model[$cont]->montototal = $montototal;


                    $model[$cont]->mediopago = utf8_encode($row[19]);
                    $model[$cont]->condicionpago = utf8_encode($row[20]);

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) {
                        $model->save();
                    }
                    $cont++;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
            case 5: //IMPORTAR ACTIVO FIJO
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                foreach ($indicadores as $row) {
                    //Ignorando los datos del encabezado de la tabla
                    if ($cont < 1) {
                        $cont++;
                        continue;
                    }
                    $model[$cont]->codigoproveedor = utf8_encode($row[0]);

                    $denominacion = utf8_encode($row[1]);
                    if (empty($denominacion)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->desc_activofijo = 'NULL';
                    } else $model[$cont]->desc_activofijo = $denominacion;

                    $model[$cont]->numero_serie = utf8_encode($row[2]);

                    $numinventario = utf8_encode($row[3]);
                    if (empty($numinventario)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->id_rotulo = 'NULL';
                    } else $model[$cont]->id_rotulo = $numinventario;

                    //$model[$cont]->clasificacion = utf8_encode($row[4]);

                    $model[$cont]->estadotecnico = utf8_encode($row[5]);

                    $valor_cup_inicial = self::validarNumericPositivo(utf8_encode($row[6]));
                    if ($valor_cup_inicial == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->valor_cup_inicial = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->valor_cup_inicial = $valor_cup_inicial;

                    $valor_cuc_inicial = self::validarNumericPositivo(utf8_encode($row[7]));
                    if ($valor_cuc_inicial == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->valor_cuc_inicial = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->valor_cuc_inicial = $valor_cuc_inicial;

                    /*$valorcontable = utf8_encode($row[8]);
                    if (!empty($valorcontable)) {
                        $valorcontable = self::validarNumericPositivo($valorcontable);
                        if ($valorcontable == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->valorcontable = 'NUMERO FUERA DE FORMATO';
                        } else $model[$cont]->valorcontable = $valorcontable;
                    }

                    $valorcontablealternativo = utf8_encode($row[9]);
                    if (!empty($valorcontablealternativo)) {
                        $valorcontablealternativo = self::validarNumericPositivo($valorcontablealternativo);
                        if ($valorcontablealternativo == 'no') {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                            $model[$cont]->valorcontablealternativo = 'NUMERO FUERA DE FORMATO';
                        } else $model[$cont]->valorcontablealternativo = $valorcontablealternativo;
                    }*/

                    $dep_cup_acumulada = self::validarNumericPositivo(utf8_encode($row[10]));
                    if ($dep_cup_acumulada == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->dep_cup_acumulada = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->dep_cup_acumulada = $dep_cup_acumulada;

                    $dep_cuc_acumulada = self::validarNumericPositivo(utf8_encode($row[11]));
                    if ($dep_cuc_acumulada == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->dep_cuc_acumulada = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->dep_cuc_acumulada = $dep_cuc_acumulada;

                    $tasa_depreciacion = self::validarNumericPositivo(utf8_encode($row[12]));
                    if ($tasa_depreciacion == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->tasa_depreciacion = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->tasa_depreciacion = $tasa_depreciacion;

                    $fechaadquisicion = utf8_encode($row[13]);
                    if (!empty($fechaadquisicion)) {
                        if (!self::date_is_valid($fechaadquisicion)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                            $model[$cont]->fecha_alta = $fechaadquisicion . '-> FORMATO: DD/MM/AAAA';
                        } else $model[$cont]->fecha_alta = $fechaadquisicion;
                    }

                    $fechainiexplotacion = utf8_encode($row[14]);
                    if (!empty($fechainiexplotacion)) {
                        if (!self::date_is_valid($fechainiexplotacion)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                            $model[$cont]->fechainiexplotacion = $fechainiexplotacion . '-> FORMATO: DD/MM/AAAA';
                        } else $model[$cont]->fechainiexplotacion = $fechainiexplotacion;
                    }

                    $model[$cont]->color1 = utf8_encode($row[15]);
                    $model[$cont]->color2 = utf8_encode($row[16]);
                    $model[$cont]->matricula = utf8_encode($row[17]);
                    $model[$cont]->circulacion = utf8_encode($row[18]);
                    $model[$cont]->nromotor = utf8_encode($row[19]);

                    $area = utf8_encode($row[20]);
                    if (empty($area)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->area = 'NULL';
                    } else $model[$cont]->area = $area;

                    $id_centrocosto = utf8_encode($row[21]);
                    if (empty($id_centrocosto)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->id_centrocosto = 'NULL';
                    } else $model[$cont]->id_centrocosto = $id_centrocosto;

                    $ciresponsable = utf8_encode($row[22]);
                    if (empty($ciresponsable)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->responsable = 'NULL';
                    } else $model[$cont]->responsable = $ciresponsable;

                    $model[$cont]->idestructuracomun_distra = $identidad;
                    $model[$cont]->migrado = 1;

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) {
                        $model->save();
                    }
                    $cont++;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
            case 6: //IMPORTAR UTILES
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                foreach ($indicadores as $row) {
                    //Ignorando los datos del encabezado de la tabla
                    if ($cont < 1) {
                        $cont++;
                        continue;
                    }
                    //$model[$cont]->codigo = utf8_encode($row[0]);

                    $denominacion = utf8_encode($row[1]);
                    if (empty($denominacion)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->denomindicador = 'NULL';
                    } else $model[$cont]->denomindicador = $denominacion;

                    $cantidad = self::validarNumericPositivo(utf8_encode($row[2]));
                    if ($cantidad == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->cantidad = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->cantidad = $cantidad;

                    $valor_cup = self::validarNumericPositivo(utf8_encode($row[3]));
                    if ($valor_cup == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->valor_cup = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->valor_cup = $valor_cup;

                    $valor_cuc = self::validarNumericPositivo(utf8_encode($row[4]));
                    if ($valor_cuc == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->valor_cuc = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->valor_cuc = $valor_cuc;

                    $model[$cont]->grupo = utf8_encode($row[5]);
                    $model[$cont]->estadotecnico = utf8_encode($row[6]);

                    $fechainiexplotacion = utf8_encode($row[7]);
                    if (!empty($fechainiexplotacion)) {
                        if (!self::date_is_valid($fechainiexplotacion)) {
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatofecha'];
                            $model[$cont]->fechainiexplotacion = $fechainiexplotacion . '-> FORMATO: DD/MM/AAAA';
                        } else $model[$cont]->fechainiexplotacion = $fechainiexplotacion;
                    }

                    $area = utf8_encode($row[8]);
                    if (empty($area)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->area = 'NULL';
                    } else $model[$cont]->area = $area;

                    $id_centrocosto = utf8_encode($row[9]);
                    if (empty($id_centrocosto)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->id_centrocosto = 'NULL';
                    } else $model[$cont]->id_centrocosto = $id_centrocosto;

                    $ciresponsable = utf8_encode($row[10]);
                    if (empty($ciresponsable)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->idempleado = 'NULL';
                    } else $model[$cont]->idempleado = $ciresponsable;

                    $model[$cont]->idestructuracomun_distra = $identidad;
                    $model[$cont]->migrado = 1;

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) {
                        $model->save();
                    }
                    $cont++;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
            case 7: //IMPORTAR PERSONA
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                foreach ($indicadores as $row) {
                    //Ignorando los datos del encabezado de la tabla
                    if ($cont < 1) {
                        $cont++;
                        continue;
                    }
                    $nombre = trim(utf8_encode($row[1]));
                    if (empty($nombre)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->nombre = 'NULL';
                    } else $model[$cont]->nombre = $nombre;

                    $model[$cont]->segnombre = trim(utf8_encode($row[2]));

                    $apellido = trim(utf8_encode($row[3]));
                    if (empty($apellido)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->apellido = 'NULL';
                    } else $model[$cont]->apellido = $apellido;

                    $model[$cont]->segapellido = trim(utf8_encode($row[4]));

                    $sexo = trim(utf8_encode($row[5]));
                    if (empty($sexo)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->sexo = 'NULL';
                    } else $model[$cont]->sexo = $sexo;

                    $idsuin = trim(utf8_encode($row[6]));
                    $expedientefar = trim(utf8_encode($row[7]));

                    if (empty($idsuin) && empty($expedientefar)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->idsuin = 'NULL';
                    } else {
                        $idsuin = str_replace(' ', '', $idsuin);
                        if (strlen($idsuin) != 11)
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorformatoidsuin'];
                        $model[$cont]->idsuin = $idsuin;

                        $expedientefar = str_replace(' ', '', $expedientefar);
                        if (!empty($expedientefar) && strlen($expedientefar) != 6)
                            $model[$cont]->iddatosnomenclador = $array_ests_dnom['errorexpedientefar'];
                        $model[$cont]->expedientefar = $expedientefar;
                    }

                    $model[$cont]->fechanacimiento = utf8_encode($row[8]);
                    $model[$cont]->colorpiel = trim(utf8_encode($row[9]));
                    $model[$cont]->direccion = str_replace("'", '', trim(utf8_encode($row[10])));
                    $model[$cont]->provincia = trim(utf8_encode($row[11]));
                    $model[$cont]->municipio = trim(utf8_encode($row[12]));
                    $model[$cont]->correoelectronico = utf8_encode($row[13]);

                    $cuentabancariacup = trim(utf8_encode($row[14]));
                    $bancocup = trim(utf8_encode($row[15]));

                    if (!empty($cuentabancariacup) && empty($bancocup)) {
                        $model[$cont]->cuentabancariacup = $cuentabancariacup;
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->bancocup = 'NULL';
                    } elseif (empty($cuentabancariacup) && !empty($bancocup)) {
                        $model[$cont]->cuentabancariacup = 'NULL';
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->bancocup = $bancocup;
                    } else {
                        $model[$cont]->cuentabancariacup = $cuentabancariacup;
                        $model[$cont]->bancocup = $bancocup;
                    }

                    $cuentabancariacuc = trim(utf8_encode($row[16]));
                    $bancocuc = trim(utf8_encode($row[17]));

                    if (!empty($cuentabancariacuc) && empty($bancocuc)) {
                        $model[$cont]->cuentabancariacuc = $cuentabancariacuc;
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->bancocuc = 'NULL';
                    } elseif (empty($cuentabancariacuc) && !empty($bancocuc)) {
                        $model[$cont]->cuentabancariacuc = 'NULL';
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->bancocuc = $bancocuc;
                    } else {
                        $model[$cont]->cuentabancariacuc = $cuentabancariacuc;
                        $model[$cont]->bancocuc = $bancocuc;
                    }

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) {
                        $model->save();
                    }
                    $cont++;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
            case 8: //IMPORTAR CUENTAS CLIENTES Y/O PROVEEDORES
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $cont = 0;
                foreach ($indicadores as $row) {
                    //Ignorando los datos del encabezado de la tabla
                    if ($cont < 1) {
                        $cont++;
                        continue;
                    }
                    $codigo = trim(utf8_encode($row[0]));
                    if (empty($codigo)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->codigo = 'NULL';
                    } else $model[$cont]->codigo = $codigo;

                    $nocuenta = trim(utf8_encode($row[1]));
                    if (empty($nocuenta)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->nocuenta = 'NULL';
                    } else $model[$cont]->nocuenta = str_replace('-', '.', $nocuenta);

                    $clasificacion = trim(utf8_encode($row[2]));
                    if (empty($clasificacion)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->clasificacion = 'NULL';
                    } else {
                        if (is_numeric($clasificacion)) {
                            if ($clasificacion == '1' || $clasificacion == '2' || $clasificacion == '3' || $clasificacion == '4')
                                $model[$cont]->clasificacion = $clasificacion;
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->clasificacion = 'NULL';
                            }
                        } else {
                            $clasificacion = strtoupper($clasificacion);
                            if ($clasificacion == 'CUENTAS POR COBRAR' || $clasificacion == 'CUENTA POR COBRAR')
                                $model[$cont]->clasificacion = '1';
                            else if ($clasificacion == 'CUENTAS POR PAGAR' || $clasificacion == 'CUENTA POR PAGAR')
                                $model[$cont]->clasificacion = '2';
                            else if ($clasificacion == 'COBROS ANTICIPADOS' || $clasificacion == 'COBRO ANTICIPADO')
                                $model[$cont]->clasificacion = '3';
                            else if ($clasificacion == 'PAGOS ANTICIPADOS' || $clasificacion == 'PAGO ANTICIPADO')
                                $model[$cont]->clasificacion = '4';
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->clasificacion = 'NULL';
                            }
                        }
                    }

                    $condicion = trim(utf8_encode($row[3]));
                    if (empty($condicion)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->condicion = 'NULL';
                    } else $model[$cont]->condicion = $condicion;

                    $plazo = self::validarNumericPositivo(utf8_encode($row[4]));
                    if ($plazo == 'no') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['errornumerico'];
                        $model[$cont]->plazo = 'NUMERO FUERA DE FORMATO';
                    } else $model[$cont]->plazo = $plazo;

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) {
                        $model->save();
                    }
                    $cont++;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
            case 9: //IMPORTAR MAESTRO DE PRODUCTOS
                //Elimino los datos cargados anteriormente que dieron error
                self::eliminarPostDatosErrorTempTable($this->tablaTemp);
                $model = new Doctrine_Collection(Doctrine:: getTable($this->tablaTemp));
                $modeltemp = $model;
                $cont = 0;
                foreach ($indicadores as $row) {
                    //Ignorando los datos del encabezado de la tabla
                    if ($cont < 1) {
                        $cont++;
                        continue;
                    }
                    $codigoproveedor = trim(utf8_encode($row[0]));
                    if (empty($codigoproveedor)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->codigoproveedor = 'NULL';
                    } else $model[$cont]->codigoproveedor = $codigoproveedor;

                    $denominacion = trim(utf8_encode($row[1]));
                    if (empty($denominacion)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->denominacion = 'NULL';
                    } else $model[$cont]->denominacion = $denominacion;

                    $umedida = trim(utf8_encode($row[2]));
                    if (empty($umedida)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->umedida = 'NULL';
                    } else $model[$cont]->umedida = $umedida;

                    $model[$cont]->naturaleza = trim(utf8_encode($row[3]));

                    $productoservicio = trim(utf8_encode($row[4]));
                    if (empty($productoservicio)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->productoservicio = 'NULL';
                    } else {
                        if (is_numeric($productoservicio)) {
                            if ($productoservicio == '1' || $productoservicio == '2')
                                $model[$cont]->productoservicio = $productoservicio;
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->productoservicio = 'NULL';
                            }
                        } else {
                            $productoservicio = strtoupper($productoservicio);
                            if ($productoservicio == 'PRODUCTO' || $productoservicio == 'PRODUCTOS')
                                $model[$cont]->productoservicio = '1';
                            else if ($productoservicio == 'SERVICIO' || $productoservicio == 'SERVICIOS')
                                $model[$cont]->productoservicio = '2';
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->productoservicio = 'NULL';
                            }
                        }
                    }

                    $almacenaexplota = trim(utf8_encode($row[5]));
                    if (empty($almacenaexplota)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->almacenaexplota = 'NULL';
                    } else {
                        if (is_numeric($almacenaexplota)) {
                            if ($almacenaexplota == '1' || $almacenaexplota == '2' || $almacenaexplota == '3')
                                $model[$cont]->almacenaexplota = $almacenaexplota;
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->almacenaexplota = 'NULL';
                            }
                        } else {
                            $almacenaexplota = strtoupper($almacenaexplota);
                            if ($almacenaexplota == 'ALMACENAMIENTO')
                                $model[$cont]->almacenaexplota = '1';
                            else if ($almacenaexplota == 'EXPLOTACION' || $almacenaexplota == 'EXPLOTACIÓN')
                                $model[$cont]->almacenaexplota = '2';
                            else if ($almacenaexplota == 'AMBOS' || $almacenaexplota == 'ALMACENAMIENTO/EXPLOTACION' || $almacenaexplota == 'ALMACENAMIENTO-EXPLOTACION' ||
                                $almacenaexplota == 'ALMACENAMIENTO/EXPLOTACIÓN' || $almacenaexplota == 'ALMACENAMIENTO-EXPLOTACIÓN')
                                $model[$cont]->almacenaexplota = '3';
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->almacenaexplota = 'NULL';
                            }
                        }
                    }

                    $utiloherra = trim(utf8_encode($row[6]));
                    if (empty($utiloherra)) {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->utiloherra = 'NULL';
                    } else {
                        if (is_numeric($utiloherra)) {
                            if ($utiloherra == '1' || $utiloherra == '2')
                                $model[$cont]->utiloherra = $utiloherra;
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->utiloherra = 'NULL';
                            }
                        } else {
                            $utiloherra = self::stringBuscar($utiloherra);
                            if ($utiloherra == 'SI' || self::buscarSubCadena($utiloherra, 'UTIL') || self::buscarSubCadena($utiloherra, 'HERRAM'))
                                $model[$cont]->utiloherra = '1';
                            else if ($utiloherra == 'NO')
                                $model[$cont]->utiloherra = '2';
                            else {
                                $model[$cont]->iddatosnomenclador = $array_ests_dnom['errordatos'];
                                $model[$cont]->utiloherra = 'NULL';
                            }
                        }
                    }

                    $almacenamiento = trim(utf8_encode($row[7]));
                    if (empty($almacenamiento) && $model[$cont]->productoservicio == '1') {
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->almacenamiento = 'NULL';
                    } else $model[$cont]->almacenamiento = strtoupper($almacenamiento);

                    $grupo = trim(utf8_encode($row[8]));
                    if (empty($grupo) && $activo == '1') { //Verificar como se si es activo
                        $model[$cont]->iddatosnomenclador = $array_ests_dnom['camposvacios'];
                        $model[$cont]->grupo = 'NULL';
                    } else $model[$cont]->grupo = $grupo;

                    $model[$cont]->marca = trim(utf8_encode($row[9]));
                    $model[$cont]->modelo = trim(utf8_encode($row[10]));
                    $model[$cont]->elementogasto = trim(utf8_encode($row[11]));
                    $model[$cont]->elementogastoalter = trim(utf8_encode($row[12]));

                    if (empty($model[$cont]->iddatosnomenclador)) $model[$cont]->iddatosnomenclador = $array_ests_dnom['importadook'];
                    if ($cont % $save == 0) {
                        $model->save();
                    }
                    $cont++;
                }
                unset($model[$cont]);
                $model->save();
                return array('cod' => 1);
                break;
        }
        return array('cod' => 1);
    }

    public function calcularMontoTotal($params)
    {
        $monto = 0;
        foreach ($params as $key => $val) {
            if ($val == 'invalid')
                return $val;
            else $monto += (int)$val;
        }
        return $monto;
    }

    public function getArrayEstadosIgnorarValidar($array_ests_uri)
    {
        $array_idests_dnom[0] = $array_ests_uri['adicionadook'];
        $array_idests_dnom[1] = $array_ests_uri['validadook'];
        $array_idests_dnom[2] = $array_ests_uri['camposvacios'];
        $array_idests_dnom[3] = $array_ests_uri['errornumerico'];
        $array_idests_dnom[4] = $array_ests_uri['actualizadook'];
        $array_idests_dnom[5] = $array_ests_uri['errorformatofecha'];
        $array_idests_dnom[6] = $array_ests_uri['errorformatoidsuin'];
        $array_idests_dnom[7] = $array_ests_uri['errorexpedientefar'];
        $array_idests_dnom[8] = $array_ests_uri['errorformatolicbancariacuc'];
        $array_idests_dnom[9] = $array_ests_uri['errorformatolicbancariamn'];
        $array_idests_dnom[10] = $array_ests_uri['correlacionadook'];
        return $array_idests_dnom;
    }

    public function getArrayEstadosAdicionar($array_ests_uri)
    {
        $array_idests_dnom[0] = $array_ests_uri['validadook'];
        $array_idests_dnom[1] = $array_ests_uri['importadook'];
        return $array_idests_dnom;
    }

    public function realizarAccion($parametros)
    {
        $array_ests_dnom = NomDatosnomenclador::getDatosNomPorUriTipoNom('estadoimportar');
        $idestructura = ZendExt_GlobalConcept::getInstance()->Estructura->idestructura;
        $tablatemporal = self::obtenerColumnasDadoIdConcepto($parametros->idconcepto);
        $tablatemporal = $tablatemporal[0]['DatConfiguracionimportar']['tablatemporal'];
        $idusuario = ZendExt_GlobalConcept::getInstance()->Perfil->idusuario;

        $array_ests_uri = array();
        foreach ($array_ests_dnom as $k => $dn) {
            unset($array_ests_dnom[$k]);
            $array_ests_uri[$dn['uridatosnomenclador']] = $dn['iddatosnomenclador'];
        }

        foreach ($parametros->cols_checked as $k => $valor) {
            unset($parametros->cols_checked[$k]);
            $cols_checked[$valor->column_name] = true;
        }
        $params['array_ests_uri'] = $array_ests_uri;
        $params['cols_checked'] = $cols_checked;
        $params['idestructura'] = $idestructura;
        $params['idusuario'] = $parametros->idusuario;
        $params['idconf'] = $parametros->idconf;
        $params['idaccion'] = $parametros->idaccion;
        $params['idconcepto'] = $parametros->idconcepto;
        $params['idproducto'] = $parametros->idproducto;
        $params['iddoc'] = $parametros->iddoc;
        $params['save'] = 100; //Salvar cada 100 elementos
        $params['cont'] = 0;
        $params['desarrollo'] = $this->desarrollo;
        self::setearIncludePath('clientes');
        switch ($parametros->idconcepto) {
            case '1': //CUENTA POR COBRAR-PAGAR
                return self::gestionarCuentasPorCobrarPagar($params);
                break;
            case '2': //COBRO-PAGO ANTICIPADO
                return self::gestionarCobroPagoAnticipado($params);
                break;
            case '3': //CLIENTES Y PROVEEDORES
                return self::gestionarClienteProveedor($params);
                break;
            case '4': //CONTRATOS
                return self::gestionarContratos($params);
                break;
            case '5': //ACTIVO FIJO
                return self::gestionarActivofijo($params);
                break;
            case '6': //UTILES
                return self::gestionarUtiles($params);
                break;
            case '7': //PERSONA
                return self::gestionarPersona($params);
                break;
            case '8': //CUENTA CLIENTES Y PROVEEDORES
                return self::gestionarCuentaClienteProveedor($params);
                break;
            case '9': //MAESTRO DE PRODUCTOS
                return self::gestionarMaestroProductos($params);
                break;
            default:
                return 3;
                break;
        }
    }

    public function gestionarClienteProveedor($parametros)
    { //adicionar
        extract($parametros);
        $add = 1;
        $idclientesproveedores = null;
        if ($idaccion == '3') {//adicionar-actualizar
            $array_idests_dnom[0] = $array_ests_uri['validadook'];
            $array_idests_dnom[1] = $array_ests_uri['importadook'];
            $objcliente = new TempClienteproveedor();
            $clientes = $objcliente->obtenerDatosAdicionarClienteProveedor($array_idests_dnom);
            if (isset($clientes[0])) {
                return self::adicionarClientes($clientes, $parametros);
            } else return -1; //No existen valores para adicionar-actualizar

        } else if ($idaccion == '4') { //validar datos idaccion = 4
            $array_idests_dnom = self::getArrayEstadosIgnorarValidar($array_ests_uri);
            $objcliente = new TempClienteproveedor();
            $clientes = $objcliente->obtenerDatosValidarClienteProveedor($array_idests_dnom);
            if (isset($clientes[0])) {
                return self::validarDatosClientesProveedores($clientes, $parametros);
            } else return -1; //No existen valores para validar
        }
    }

    public function adicionarClientes($clientes, $parametros)
    {
        $result = self::validarDatosClientesProveedores($clientes, $parametros);
        if ($result == 1 || $result == -1) {
            $result = -1;
            $errores = 0;
            extract($parametros);
            $idclientesproveedores = null;
            $add = 1;
            foreach ($clientes as $val => $key) {
                if ($key->iddatosnomenclador == $array_ests_uri['validadook']) {
                    $codigoreuup = $key->codigoreeup;
                    $clienteproveedor = Doctrine::getTable('NomClienteproveedor')->findByDql(
                        "codigo = '$codigoreuup'"
                    );
                    if (isset($clienteproveedor[0])) {
                        $nombreBD = self::stringBuscar($clienteproveedor[0]->nombre);
                        $nombre = self::stringBuscar($key->nombre);
                        if ($nombre == $nombreBD) {
                            $add = 0;
                        }
                        $idclientesproveedores = $clienteproveedor[0]->idclientesproveedores;
                        $key->idcliente = $idclientesproveedores;
                    } else {
                        $idclientesproveedores = null;
                        $add = 1;
                    }
                    $params['add'] = $add;
                    $params['idclientesproveedores'] = $idclientesproveedores;
                    $params['idusuario'] = $idusuario;
                    $params['idestructura'] = $idestructura;
                    $params['desarrollo'] = $this->desarrollo;

                    try {
                        $res = self::adicionarDatosValidadosClientesProveedores($clientes[$val], $params);
                        switch ($res) {
                            case 0:
                                $clientes[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                                break;
                            case -1:
                                if ($add) $clientes[$val]->iddatosnomenclador = $array_ests_uri['adicionadook'];
                                else $clientes[$val]->iddatosnomenclador = $array_ests_uri['actualizadook'];
                                $result = 1;
                                break;
                            case -2:
                                $clientes[$val]->iddatosnomenclador = $array_ests_uri['existecliente'];
                                break;
                            case -3:
                                $clientes[$val]->iddatosnomenclador = $array_ests_uri['existeusuariocliente'];
                                break;
                            case -4:
                                $clientes[$val]->iddatosnomenclador = $array_ests_uri['existepersonacliente'];
                                break;
                            case -5:
                                $clientes[$val]->iddatosnomenclador = $array_ests_uri['existeentidadcliente'];
                                break;
                        }
                    } catch (Exception $e) {
                        $clientes[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                        if ($parametros['desarrollo']) print_r($e->getMessage());
                        else ob_clean();
                        $errores = 1;
                        continue;
                    }
                    $cont++;
                    if ($cont % $save == 0) $clientes->save();
                }

            }
            $clientes->save();
            $result = ($errores) ? 0 : $result;
        }
        return $result;
    }

    public function adicionarDatosValidadosClientesProveedores($key, $parametros)
    {
        extract($parametros);
        if (!$add) $datos[1]->idclientesproveedores = $idclientesproveedores;
        $datos[0]->idtipo = $key->tipo;
        $datos[0]->idClasificacion = 1;
        $datos[0]->registrado = 0;
        $datos[0]->codigo = $key->codigoreeup;
        $datos[0]->nombre = $key->nombre;
        $datos[0]->codigonit = $key->codigonit;
        $datos[0]->idorganismo = (empty($key->subcodigoreeup) ? null : $key->subcodigoreeup);
        $datos[0]->correo = $key->correo;
        $datos[0]->telefono = $key->telefono;
        $datos[0]->dpa = $key->iddpa;
        $datos[0]->abreviatura = $key->abreviatura;
        $datos[0]->direccion = $key->direccion;
        $datos[0]->idestructura = $idestructura;

        $cuentamn = null;
        if (!empty($key->numcuentamn)) {
            $cuentamn = new stdClass();
            $cuentamn->id = $key->idcuentamn;
            $cuentamn->numerocuenta = $key->numcuentamn;
            $cuentamn->nombrecuenta = $key->titularmn;
            $cuentamn->idmoneda = $key->idmonedacuc;
            $cuentamn->idsucursal = $key->idsucursalmn;
            $cuentamn->idbanco = $key->idbancomn;
            $cuentamn->predeterminado = 1;
        }

        $cuentacuc = null;
        if (!empty($key->numcuentacuc)) {
            $cuentacuc = new stdClass();
            $cuentacuc->id = $key->idcuentacuc;
            $cuentacuc->numerocuenta = $key->numcuentacuc;
            $cuentacuc->nombrecuenta = $key->titularcuc;
            $cuentacuc->idmoneda = $key->idmonedacuc;
            $cuentacuc->idsucursal = $key->idsucursalcuc;
            $cuentacuc->idbanco = $key->idbancocuc;
            $cuentacuc->licenciabancaria = $key->licbancariacuc;
            $cuentamn->predeterminado = empty($key->numcuentamn) ? 1 : 0;
        }

        $objcuentabanco = new stdClass();
        $objcuentabanco->modificados = null;
        if (!empty($cuentamn)) array_push($objcuentabanco->modificados, $cuentamn);
        if (!empty($cuentacuc)) array_push($objcuentabanco->modificados, $cuentacuc);
        $datos[0]->cuentabanco = $objcuentabanco;

        $objcontacto = new stdClass();
        $objcontacto->idcontacto = $key->idcontacto;
        $objcontacto->nombre = $key->nombrecontacto;
        $objcontacto->cargo = $key->cargocontacto;
        $objcontacto->telefono = $key->telefonocontacto;
        $objcontacto->movil = $key->movilcontacto;
        $objcontacto->direccion = $key->direccioncontacto;
        $objcontacto->facultad = $key->facultadcontacto;
        $objcontacto->numeroidentidad = $key->cicontacto;
        $datos[0]->contactos->modificados = [$objcontacto];

        try {
            $nomclienteproveedor = new NomClienteproveedorModel();
            $result = $nomclienteproveedor->gestionar($datos, $add);
            return $result['code'];
        } catch (Doctrine_Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else {
                $this->conn->rollback();
                ob_clean();
                return $result['code'] = 0;
            }
        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            return $result['code'] = 0;
        }
    }

    public function validarDatosClientesProveedores(&$clientes, &$parametros)
    {
        $idmoneda = self::validarMoneda();
        if (array($idmoneda)) {
            $result = -1;
            $errores = 0;
            $idmonedacup = $idmoneda['idmonedacup'];
            $idmonedacuc = $idmoneda['idmonedacuc'];
            extract($parametros);
            foreach ($clientes as $val => $key) {
                try {
                    if ($key->iddatosnomenclador != $array_ests_uri['validadook']) {
                        $correo = $key->correo;
                        if (!empty($correo)) {
                            $correo = self::validarCorreo($key->correo);
                            if (!self::validarMaxCaracteres($correo, 50)) {
                                $clientes[$val]->iddatosnomenclador = $array_ests_uri['errorlongitudcorreo'];
                                continue;
                            } else $key->correo = $correo;
                        }
                        if (!self::validarMaxCaracteres($key->codigoreeup, 30)) {
                            $clientes[$val]->iddatosnomenclador = $array_ests_uri['errorlongitudcodigoreup'];
                            continue;
                        }
                        if (!self::validarMaxCaracteres($key->codigonit, 30)) {
                            $clientes[$val]->iddatosnomenclador = $array_ests_uri['errorlongitudcodigonit'];
                            continue;
                        }
                        $codigoreuup = $key->codigoreeup;
                        $clienteproveedor = Doctrine::getTable('NomClienteproveedor')->findByDql(
                            "codigo = '$codigoreuup'"
                        );
                        if (isset($clienteproveedor[0])) {
                            $key->idcliente = $clienteproveedor[0]->idclientesproveedores;
                        }
                        $iddpa = self::obtenerIdProvincia($key->provincia);
                        if (isset($iddpa[0])) {
                            $key->iddpa = $iddpa[0]['iddpt'];
                        } else {
                            $clientes[$val]->iddatosnomenclador = $array_ests_uri['errordpaprovincia'];
                            continue;
                        }
                        $key->idmonedamn = $idmonedacup;
                        $key->idmonedacuc = $idmonedacuc;
                        if (!empty($key->bancomn)) {
                            $bancomn = self::obtenerIdBanco($key->bancomn);
                            if (isset($bancomn[0])) {
                                $key->idbancomn = $bancomn[0]['idbanco'];
                                $sucursalmn = self::obtenerIdSucursal($key->sucursalmn, $key->idbancomn);
                                if (isset($sucursalmn[0])) {
                                    $key->idsucursalmn = $sucursalmn[0]['idsucursal'];
                                } else {
                                    $clientes[$val]->iddatosnomenclador = $array_ests_uri['errorsucursalmn'];
                                    continue;
                                }
                                $cuentamn = self::obtenerIdNumCuenta($key->numcuentamn);
                                if (isset($cuentamn[0])) {
                                    $key->idcuentamn = $cuentamn[0]['idcuentabancliente'];
                                }
                            } else {
                                $clientes[$val]->iddatosnomenclador = $array_ests_uri['errorbancomn'];
                                continue;
                            }
                        }
                        if (!empty($key->bancocuc)) {
                            $bancocuc = self::obtenerIdBanco($key->bancocuc);
                            if (isset($bancocuc[0])) {
                                $key->idbancocuc = $bancocuc[0]['idbanco'];

                                $sucursalcuc = self::obtenerIdSucursal($key->sucursalcuc, $key->idbancocuc);
                                if (isset($sucursalcuc[0])) {
                                    $key->idsucursalcuc = $sucursalcuc[0]['idsucursal'];
                                } else {
                                    $clientes[$val]->iddatosnomenclador = $array_ests_uri['errorsucursalcuc'];
                                    continue;
                                }
                                $cuentacuc = self::obtenerIdNumCuenta($key->numcuentacuc);
                                if (isset($cuentacuc[0])) {
                                    $key->idcuentacuc = $cuentacuc[0]['idcuentabancliente'];
                                }

                            } else {
                                $clientes[$val]->iddatosnomenclador = $array_ests_uri['errorbancocuc'];
                                continue;
                            }
                        }
                        $contacto = self::obtenerIdContacto($key->nombrecontacto);
                        if (isset($contacto[0])) $key->idcontacto = $contacto[0]['idcontacto'];
                        $clientes[$val]->iddatosnomenclador = $array_ests_uri['validadook'];
                        $result = 1;
                    }
                } catch (Exception $e) {
                    $clientes[$val]->iddatosnomenclador = $array_ests_uri['errorvalidar'];
                    $errores = 1;
                    if ($parametros['desarrollo']) print_r($e->getMessage());
                    else ob_clean();
                    continue;
                }
                $cont++;
                if ($cont % $save == 0) $clientes->save();
            }
            $clientes->save();
            $result = ($errores) ? 0 : $result;
            return $result;
        } else return $idmoneda; //Error moneda
    }

    public
    function validarOperacionPeriodoTipoDoc($idestructura)
    {
        try {
            $idperiodo = $this->integrator->datosmaestros->periodoActualSubsistema($idestructura, 6);
            if (empty($idperiodo)) return 10; //No existe idperiodo;
        } catch (Exception $e) {
            return 11; //Error al verificar idperiodo
        }
        try {
            $operacionesporcobrar = $this->integrator->datosmaestros->obtenerOperaciones(
                $idestructura, 6, null, null, null, null, array('signo' => '1')
            );
            if (isset($operacionesporcobrar[0])) {
                $idoperacionesporcobrar = $operacionesporcobrar[0]['idnomoperaciones'];
                $idtipodocporcobrar = $operacionesporcobrar[0]['iddocentidad'];
            } else {
                return 12; //No existe idoperacion
            }
        } catch (Exception $e) {
            return 13; // Error al verificar operaciones cuentas por cobrar
        }
        try {
            $operacionesporpagar = $this->integrator->datosmaestros->obtenerOperaciones(
                $idestructura, 6, null, null, null, null, array('signo' => '2')
            );
            if (isset($operacionesporpagar[0])) {
                $idoperacionesporpagar = $operacionesporpagar[0]['idnomoperaciones'];
                $idtipodocporpagar = $operacionesporpagar[0]['iddocentidad'];
            } else {
                return 12; //No existe idoperacion
            }
        } catch (Exception $e) {
            return 15; // Error al verificar operaciones cuentas por pagar
        }
        $data['idperiodo'] = $idperiodo;
        $data['idoperacionesporcobrar'] = $idoperacionesporcobrar;
        $data['idtipodocporcobrar'] = $idtipodocporcobrar;
        $data['idoperacionesporpagar'] = $idoperacionesporpagar;
        $data['idtipodocporpagar'] = $idtipodocporpagar;
        return $data;
    }

    public
    function gestionarCuentasPorCobrarPagar($parametros)
    {
        extract($parametros);
        $objcuentas = new TempCuentaporcobrar();
        if ($idaccion == '1') {//adicionar
            $array_idests_dnom = self::getArrayEstadosAdicionar($array_ests_uri);
            $cuentas = $objcuentas->obtenerDatosAdicionarCuentasPorCobrar($array_idests_dnom);
            if (isset($cuentas[0])) {
                $parametros['idsubsistema'] = '6';
                $parametros['cargainicial'] = '1';
                $parametros['idestadodcop'] = '1';
                $parametros['idestadodocumento'] = '2';
                $parametros['valorCero'] = '0';
                $parametros['add'] = 1;
                return self::adicionarCuentas($cuentas, $parametros);
            } else return -1; //No existen valores para adicionar
        } else if ($idaccion == '4') { //validar datos
            $array_idests_dnom = self::getArrayEstadosIgnorarValidar($array_ests_uri);
            $cuentas = $objcuentas->obtenerDatosValidarCuentasPorCobrar($array_idests_dnom);
            if (isset($cuentas[0])) {
                return self::validarDatosCuentasPorCobrar($cuentas, $parametros);
            } else return -1;
        }
    }

    public
    function gestionarCobroPagoAnticipado($parametros)
    {
        extract($parametros);
        $objcobro = new TempCobropagoanticipado();

        if ($idaccion == '1') {//adicionar
            $array_idests_dnom = self::getArrayEstadosAdicionar($array_ests_uri);
            $cobro = $objcobro->obtenerDatosAdicionarCobroPagoAnticipado($array_idests_dnom);
            if (isset($cobro[0])) {
                $parametros['idsubsistema'] = '6';
                $parametros['idestadodo'] = '8';
                $parametros['cargainicial'] = '1';
                $parametros['identrega'] = '1';
                $parametros['campoinstrumento'] = '1';
                $parametros['add'] = 1;
                return self::adicionarCobroPagoAnticipado($cobro, $parametros);
            } else return -1; //No existen valores para adicionar

        } else if ($idaccion == '4') { //validar datos
            $array_idests_dnom = self::getArrayEstadosIgnorarValidar($array_ests_uri);
            $cobro = $objcobro->obtenerDatosValidarCobroPagoAnticipado($array_idests_dnom);
            if (isset($cobro[0])) {
                return self::validarDatosCobroPagoAnticipado($cobro, $parametros);
            } else return -1;
        }
    }

    public
    function validarDatosCobroPagoAnticipado(&$cobro, &$parametros)
    {
        $constantes = self::validarOperacionPeriodoTipoDoc($parametros['idestructura']);
        if (is_array($constantes)) {
            $result = -1;
            $errores = 0;
            $clienteproveedor = null;
            $parametros['idperiodo'] = $constantes['idperiodo'];
            $parametros['idoperacionesporcobrar'] = $constantes['idoperacionesporcobrar'];
            $parametros['idtipodocporcobrar'] = $constantes['idtipodocporcobrar'];
            $parametros['idoperacionesporpagar'] = $constantes['idoperacionesporpagar'];
            $parametros['idtipodocporpagar'] = $constantes['idtipodocporpagar'];
            extract($parametros);
            foreach ($cobro as $val => $key) {
                if ($key->iddatosnomenclador != $array_ests_uri['validadook']) {
                    if ($key->tipoobligacion == '1') {
                        if (empty($idoperacionesporcobrar)) {
                            $cobro[$val]->iddatosnomenclador = $array_ests_uri['noexisteidoperacionesporcobrar'];
                            continue;
                        }
                        if (empty($idtipodocporcobrar)) {
                            $cobro[$val]->iddatosnomenclador = $array_ests_uri['noexisteidtipodocporcobrar'];
                            continue;
                        }
                    }
                    if ($key->tipoobligacion == '2') {
                        if (empty($idoperacionesporpagar)) {
                            $cobro[$val]->iddatosnomenclador = $array_ests_uri['noexisteidoperacionesporpagar'];
                            continue;
                        }
                        if (empty($idtipodocporpagar)) {
                            $cobro[$val]->iddatosnomenclador = $array_ests_uri['noexisteidtipodocporpagar'];
                            continue;
                        }
                    }
                    try {
                        $codigoreuup = $key->numclienteproveedor;
                        $clienteproveedor = Doctrine::getTable('NomClienteproveedor')->findByDql(
                            "codigo = '$codigoreuup'"
                        );
                        if (isset($clienteproveedor[0])) {
                            $idclienteproveedor = $clienteproveedor[0]->idclientesproveedores;
                            $key->idclienteproveedor = $idclienteproveedor;
                            $idclienteproveedorentidad = self::obtenerIdClienteProveedorEntidad($idclienteproveedor, $idestructura);
                            if (isset($idclienteproveedorentidad[0])) {
                                $key->idclienteproveedorentidad = $idclienteproveedorentidad[0]['idclienteproveedorentidad'];
                                $cuentacontable = self::obtenerIdCuenta($idestructura, $key->cuentacontable);
                                if (isset($cuentacontable[0])) {
                                    $idtasa = $cuentacontable[0]['idtasa'];
                                    $idcuenta = $cuentacontable[0]['idcuenta'];
                                    $idmoneda = $cuentacontable[0]['idmoneda'];
                                    $key->idcuenta = $idcuenta;
                                    $key->idtasa = $idtasa;
                                    $key->idmoneda = $idmoneda;
                                } else {
                                    $cobro[$val]->iddatosnomenclador = $array_ests_uri['noexistecuenta'];
                                    continue;
                                }
                            } else {
                                $cobro[$val]->iddatosnomenclador = $array_ests_uri['noexisteclienteentidad'];
                                continue;
                            }
                        } else {
                            $cobro[$val]->iddatosnomenclador = $array_ests_uri['noexistecliente'];
                            continue;
                        }
                        $cobro[$val]->iddatosnomenclador = $array_ests_uri['validadook'];
                        $result = 1;
                    } catch (Exception $e) {
                        $cobro[$val]->iddatosnomenclador = $array_ests_uri['errorvalidar'];
                        $errores = 1;
                        if ($parametros['desarrollo']) print_r($e->getMessage());
                        else ob_clean();
                        continue;
                    }
                    $cont++;
                    if ($cont % $save == 0) $cobro->save();
                }
            }
            $cobro->save();
            $result = ($errores) ? 0 : $result;
            return $result;
        } else return $constantes; //Error
    }

    public
    function validarDatosCuentasPorCobrar(&$cuentas, &$parametros)
    {
        $constantes = self::validarOperacionPeriodoTipoDoc($parametros['idestructura']);
        if (is_array($constantes)) {
            $result = -1;
            $errores = 0;
            $clienteproveedor = null;
            $parametros['idperiodo'] = $constantes['idperiodo'];
            $parametros['idoperacionesporcobrar'] = $constantes['idoperacionesporcobrar'];
            $parametros['idtipodocporcobrar'] = $constantes['idtipodocporcobrar'];
            $parametros['idoperacionesporpagar'] = $constantes['idoperacionesporpagar'];
            $parametros['idtipodocporpagar'] = $constantes['idtipodocporpagar'];
            extract($parametros);
            foreach ($cuentas as $val => $key) {
                if ($key->iddatosnomenclador != $array_ests_uri['validadook']) {
                    if ($key->tipoobligacion == '1') {
                        if (empty($idoperacionesporcobrar)) {
                            $cuentas[$val]->iddatosnomenclador = $array_ests_uri['noexisteidoperacionesporcobrar'];
                            continue;
                        }
                        if (empty($idtipodocporcobrar)) {
                            $cuentas[$val]->iddatosnomenclador = $array_ests_uri['noexisteidtipodocporcobrar'];
                            continue;
                        }
                    }
                    if ($key->tipoobligacion == '2') {
                        if (empty($idoperacionesporpagar)) {
                            $cuentas[$val]->iddatosnomenclador = $array_ests_uri['noexisteidoperacionesporpagar'];
                            continue;
                        }
                        if (empty($idtipodocporpagar)) {
                            $cuentas[$val]->iddatosnomenclador = $array_ests_uri['noexisteidtipodocporpagar'];
                            continue;
                        }
                    }
                    try {
                        $cuentacontable = self::obtenerIdCuenta($idestructura, $key->cuentacontable);
                        if (isset($cuentacontable[0])) {
                            $idtasa = $cuentacontable[0]['idtasa'];
                            $idcuenta = $cuentacontable[0]['idcuenta'];
                            $idmoneda = $cuentacontable[0]['idmoneda'];
                            $key->idcuenta = $idcuenta;
                            $key->idtasa = $idtasa;
                            $key->idmoneda = $idmoneda;
                        } else {
                            $cuentas[$val]->iddatosnomenclador = $array_ests_uri['noexistecuenta'];
                            continue;
                        }
                        if ($key->tipodeudoracreedor == '3') {  //TRABAJADOR
                            $params['idsuin'] = $key->numclienteproveedor;
                            $idpersona = self::obtenerIdPersona($params);
                            if (isset($idpersona[0])) {
                                $key->idclienteproveedor = $idpersona[0]['idpersona'];
                            } else {
                                $cuentas[$val]->iddatosnomenclador = $array_ests_uri['noexistepersona'];
                                continue;
                            }
                        } else {  //CLIENTE/PROVEEDOR
                            $codigoreuup = $key->numclienteproveedor;
                            $clienteproveedor = Doctrine::getTable('NomClienteproveedor')->findByDql(
                                "codigo = '$codigoreuup'"
                            );
                            if (isset($clienteproveedor[0])) {
                                $idclienteproveedor = $clienteproveedor[0]->idclientesproveedores;
                                $key->idclienteproveedor = $idclienteproveedor;
                                $idclienteproveedorentidad = self::obtenerIdClienteProveedorEntidad($idclienteproveedor, $idestructura);
                                if (isset($idclienteproveedorentidad[0])) {
                                    $key->idclienteproveedorentidad = $idclienteproveedorentidad[0]['idclienteproveedorentidad'];
                                    $terminopago = self::obtenerIdTerminoPago($idestructura, $idcuenta, $idclienteproveedor);
                                    if (!isset($terminopago[0])) {
                                        $cuentas[$val]->iddatosnomenclador = $array_ests_uri['noexisteterminopago'];
                                        continue;
                                    } else $key->idterminodepago = $terminopago[0]['idterminodepago'];

                                } else {
                                    $cuentas[$val]->iddatosnomenclador = $array_ests_uri['noexisteclienteentidad'];
                                    continue;
                                }
                            } else {
                                $cuentas[$val]->iddatosnomenclador = $array_ests_uri['noexistecliente'];
                                continue;
                            }
                        }
                        $cuentas[$val]->iddatosnomenclador = $array_ests_uri['validadook'];
                        $result = 1;
                    } catch (Exception $e) {
                        $cuentas[$val]->iddatosnomenclador = $array_ests_uri['errorvalidar'];
                        $errores = 1;
                        if ($parametros['desarrollo']) print_r($e->getMessage());
                        else ob_clean();
                        continue;
                    }
                    $cont++;
                    if ($cont % $save == 0) $cuentas->save();
                }
            }
            $cuentas->save();
            $result = ($errores) ? 0 : $result;
            return $result;
        } else return $constantes; //Error

    }

    public
    function adicionarCuentas($cuentas, $parametros)
    {
        $result = self::validarDatosCuentasPorCobrar($cuentas, $parametros);
        if ($result == 1 || $result == -1) {
            $result = -1;
            $errores = 0;
            extract($parametros);
            $connA = Doctrine_Manager:: connection();
            foreach ($cuentas as $val => $key) {
                if ($add) {
                    if ($key->iddatosnomenclador == $array_ests_uri['validadook']) {
                        try {
                            $idderechoobligacion = self::adicionarDerechoObligacion($cuentas[$val], $parametros);
                            if (!empty($idderechoobligacion)) {
                                $parametros['idderechoobligacion'] = $idderechoobligacion;
                                $parametros['idoperacioncontable'] = ($key->tipoobligacion == '1') ? $idoperacionesporcobrar : $idoperacionesporpagar;

                                $idoperacioncp = self::actualizarOperacionCP($cuentas[$val], $parametros);
                                if (!isset($idoperacioncp[0])) {
                                    self::adicionarOperacionCP($cuentas[$val], $parametros);
                                    $cuentas[$val]->iddatosnomenclador = $array_ests_uri['adicionadook'];
                                } else $cuentas[$val]->iddatosnomenclador = $array_ests_uri['adicionadook'];
                                $result = 1;
                            } else {
                                $cuentas[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                                continue;
                            }
                        } catch (Exception $e) {
                            if ($parametros['desarrollo']) print_r($e->getMessage());
                            else ob_clean();
                            $cuentas[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                            $errores = 1;
                            continue;
                        }
                    }
                    $cont++;
                    if ($cont % $save == 0) $cuentas->save();
                }

            }
            $cuentas->save();
            $result = ($errores) ? 0 : $result;
            return $result;
        } else return $result;
    }

    public
    function adicionarDerechoObligacion($cuenta, $parametros)
    {
        extract($parametros);
        try {
            $idderechouobligacion = '';
            $idderecho = self::actualizarDerechoObligacion($cuenta, $parametros);
            if (!isset($idderecho[0])) {
                $parametros['idtipodocumento'] = ($cuenta->tipoobligacion == '1') ? $idtipodocporcobrar : $idtipodocporpagar;
                $idderecho = self::insertarDerechoObligacion($cuenta, $parametros);
                if (isset($idderecho[0])) {
                    $idderechouobligacion = $idderecho[0]['idderechouobligacion'];
                } else {
                    $cuenta->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                }
            } else $idderechouobligacion = $idderecho[0]['idderechouobligacion'];
        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            $cuenta->iddatosnomenclador = $array_ests_uri['erroradicionar'];
        }
        $cuenta->save();
        return $idderechouobligacion;
    }

    public
    function adicionarCobroPagoAnticipado($cobro, $parametros)
    {
        $result = self::validarDatosCobroPagoAnticipado($cobro, $parametros);
        if ($result == 1 || $result == -1) {
            $result = -1;
            $errores = 0;
            extract($parametros);
            $connA = Doctrine_Manager:: connection();
            foreach ($cobro as $val => $key) {
                if ($add) {
                    if ($key->iddatosnomenclador == $array_ests_uri['validadook']) {
                        try {
                            $iddocumento = self::adicionarDocFnz($cobro[$val], $parametros);
                            if (isset($iddocumento[0])) {
                                if (count($iddocumento) == 1) {
                                    $parametros['iddocumento'] = $iddocumento[0]['iddocumento'];
                                    $iddocumento = self::adicionarInstrumentoFnz($cobro[$val], $parametros);
                                    if (isset($iddocumento[0])) {
                                        if (count($iddocumento) == 1) {
                                            $parametros['iddocumento'] = $iddocumento[0]['iddocumento'];
                                            $parametros['idoperacion'] = ($key->tipoobligacion == '1') ? $idoperacionesporcobrar : $idoperacionesporpagar;
                                            $iddocumento = self::adicionarAnticipoFnz($cobro[$val], $parametros);
                                            if (isset($iddocumento[0])) {
                                                if (count($iddocumento) == 1) {
                                                    $parametros['iddocumento'] = $iddocumento[0]['iddocumento'];
                                                    $iddocumento = self::adicionarBeneficiarioFnz($cobro[$val], $parametros);
                                                    if (isset($iddocumento[0])) {
                                                        if (count($iddocumento) == 1) {
                                                            $cobro[$val]->iddatosnomenclador = $array_ests_uri['adicionadook'];
                                                            $result = 1;
                                                        } else $cobro[$val]->iddatosnomenclador = $array_ests_uri['errorbeneficiariofnzrepetido'];
                                                    } else {
                                                        $cobro[$val]->iddatosnomenclador = $array_ests_uri['errorbeneficiariofnz'];
                                                        continue;
                                                    }
                                                } else {
                                                    $cobro[$val]->iddatosnomenclador = $array_ests_uri['erroranticipofnzrepetido'];
                                                    continue;
                                                }
                                            } else {
                                                $cobro[$val]->iddatosnomenclador = $array_ests_uri['erroranticipofnz'];
                                                continue;
                                            }
                                        } else {
                                            $cobro[$val]->iddatosnomenclador = $array_ests_uri['errorinstrumentofnzrepedido'];
                                            continue;
                                        }
                                    } else {
                                        $cobro[$val]->iddatosnomenclador = $array_ests_uri['errorinstrumentofnz'];
                                        continue;
                                    }
                                } else {
                                    $cobro[$val]->iddatosnomenclador = $array_ests_uri['errordocfnzrepedido'];
                                    continue;
                                }
                            } else {
                                $cobro[$val]->iddatosnomenclador = $array_ests_uri['errordocfnz'];
                                continue;
                            }
                        } catch (Exception $e) {
                            if ($parametros['desarrollo']) print_r($e->getMessage());
                            else ob_clean();
                            $cobro[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                            $errores = 1;
                            continue;
                        }
                        $cont++;
                        if ($cont % $save == 0) $cobro->save();
                    }
                }

            }
            $cobro->save();
            $result = ($errores) ? 0 : $result;
            return $result;
        } else return $result;

    }

    public
    function adicionarDocFnz($cobro, $parametros)
    {
        extract($parametros);
        try {
            $iddocumento = array();
            $parametros['idtipodocumento'] = ($cobro->tipoobligacion == '1') ? $idtipodocporcobrar : $idtipodocporpagar;
            $iddocfnz = self::actualizarDocFnz($cobro, $parametros);
            if (isset($iddocfnz[0])) {
                $iddocumento = $iddocfnz;
            } else {
                $iddocfnz = self::insertarDocFnz($cobro, $parametros);
                if (isset($iddocfnz[0])) {
                    $iddocumento = $iddocfnz;
                } else {
                    $cobro->iddatosnomenclador = $array_ests_uri['errordocfnz'];
                }
            }

        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            $cobro->iddatosnomenclador = $array_ests_uri['errordocfnz'];
        }
        $cobro->save();
        return $iddocumento;
    }

    public
    function adicionarInstrumentoFnz($cobro, $parametros)
    {
        extract($parametros);
        try {
            $iddocumento = '';
            $idinstrumentofnz = self::actualizarInstrumentoFnz($cobro, $parametros);
            if (isset($idinstrumentofnz[0])) {
                $iddocumento = $idinstrumentofnz;
            } else {
                $idinstrumentofnz = self::insertarInstrumentoFnz($cobro, $parametros);
                if (isset($idinstrumentofnz[0])) {
                    $iddocumento = $idinstrumentofnz;
                } else {
                    $cobro->iddatosnomenclador = $array_ests_uri['errorinstrumentofnz'];
                }
            }
        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            $cobro->iddatosnomenclador = $array_ests_uri['errorinstrumentofnz'];
        }
        $cobro->save();
        return $iddocumento;
    }

    public
    function adicionarAnticipoFnz($cobro, $parametros)
    {
        extract($parametros);
        try {
            $iddocumento = '';
            $idanticipofnz = self::actualizarAnticipoFnz($cobro, $parametros);
            if (isset($idanticipofnz[0])) {
                $iddocumento = $idanticipofnz;
            } else {
                $idanticipofnz = self::insertarAnticipoFnz($cobro, $parametros);
                if (isset($idanticipofnz[0])) {
                    $iddocumento = $idanticipofnz;
                } else {
                    $cobro->iddatosnomenclador = $array_ests_uri['erroranticipofnz'];
                }
            }

        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            $cobro->iddatosnomenclador = $array_ests_uri['erroranticipofnz'];
        }
        $cobro->save();
        return $iddocumento;
    }

    public
    function adicionarBeneficiarioFnz($cobro, $parametros)
    {
        extract($parametros);
        try {
            $iddocumento = '';
            $idbeneficiariofnz = self::actualizarBeneficiarioFnz($cobro, $parametros);
            if (isset($idbeneficiariofnz[0])) {
                $iddocumento = $idbeneficiariofnz;
            } else {
                $idbeneficiariofnz = self::insertarBeneficiarioFnz($cobro, $parametros);
                if (isset($idbeneficiariofnz[0])) {
                    $iddocumento = $idbeneficiariofnz;
                } else {
                    $cobro->iddatosnomenclador = $array_ests_uri['errorbeneficiariofnz'];
                }
            }

        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            $cobro->iddatosnomenclador = $array_ests_uri['errorbeneficiariofnz'];
        }
        $cobro->save();
        return $iddocumento;
    }

    public
    function gestionarContratos($parametros)
    {
        extract($parametros);
        $objcontrato = new TempContrato();
        if ($idaccion == '1') {//adicionar
            $array_idests_dnom = self::getArrayEstadosAdicionar($array_ests_uri);
            $contratos = $objcontrato->obtenerDatosAdicionarContratos($array_idests_dnom);
            if (isset($contratos[0])) {
                $parametros['add'] = 1;
                return self::adicionarContratos($contratos, $parametros); //1-Datos adicionados correctamente, -1 no existen datos para adicionar
            } else return -1; //No existen valores para adicionar
        } else if ($idaccion == '4') { //validar datos
            $array_idests_dnom = self::getArrayEstadosIgnorarValidar($array_ests_uri);
            $contratos = $objcontrato->obtenerDatosValidarContratos($array_idests_dnom);
            if (isset($contratos[0])) {
                $params['array_ests_uri'] = $array_ests_uri;
                $params['idestructura'] = $idestructura;
                return self::validarDatosContratos($contratos, $params);
            } else return -1;
        }
    }

    public
    function validarDatosContratos(&$contratos, $parametros)
    {
        extract($parametros);
        $result = -1;
        $errores = 0;
        $idestados = self::validarIdEstados();
        if (is_array($idestados)) {
            foreach ($contratos as $val => $key) {
                try {
                    if ($key->iddatosnomenclador != $array_ests_uri['validadook']) {
                        $codigoreuup = $key->codigoreeup;
                        $clienteproveedor = null;
                        $clienteproveedor = Doctrine::getTable('NomClienteproveedor')->findByDql(
                            "codigo = '$codigoreuup'"
                        );
                        if (isset($clienteproveedor[0])) {
                            $idclienteproveedor = $clienteproveedor[0]->idclientesproveedores;
                            $key->idclienteproveedor = $idclienteproveedor;

                            $parametros['idclienteproveedor'] = $idclienteproveedor;
                            $parametros['nocontratoproveedor'] = $key->nocontratoproveedor;

                            $idcontrato = self::obtenerIdContrato($parametros);

                            if (isset($idcontrato[0])) $key->idcontratocrm = $idcontrato[0]['idcontrato'];
                            if (isset($add) && $add && isset($idcontrato[0])) {
                                $contratos[$val]->iddatosnomenclador = $array_ests_uri['existecontrato'];
                                continue;
                            }
                            $idtipocontrato = self::obtenerIdTipoContrato($key->tipocontrato);
                            if (isset($idtipocontrato[0])) {
                                $key->idtipocontrato = $idtipocontrato[0]['idtipocontrato'];
                                $params['idsuin'] = $key->ciresponsablearea;
                                //$idpersona = self::obtenerIdPersonaOld($key->ciresponsablearea);
                                $idpersona = self::obtenerIdPersona($params);
                                if (isset($idpersona[0])) {
                                    $key->idpersona = $idpersona[0]['idpersona'];
                                    if (!empty($key->mediopago)) {
                                        $idmediopago = self::obtenerIdMedioPago($key->mediopago);
                                        if (isset($idmediopago[0])) $key->idmediopago = $idmediopago[0]['idmediodepago'];
                                        else {
                                            $contratos[$val]->iddatosnomenclador = $array_ests_uri['noexistemediopago'];
                                            continue;
                                        }
                                    }
                                    if (!empty($key->condicionpago)) {
                                        $idcondicionpago = self::obtenerIdCondicionPago($key->condicionpago);
                                        if (isset($idcondicionpago[0])) $key->idcondicionpago = $idcondicionpago[0]['idterminodepago'];
                                        else {
                                            $contratos[$val]->iddatosnomenclador = $array_ests_uri['noexistecondicionpago'];
                                            continue;
                                        }
                                    }
                                    foreach ($idestados as $val2 => $key2) {
                                        if (empty($key->fechafirma)) {
                                            if ($key2['nombre'] == 'A LA FIRMA') {
                                                $key->idestado = $key2['idestado'];
                                                break;
                                            }
                                        } else {
                                            if ($key2['nombre'] == 'APROBADO') {
                                                $key->idestado = $key2['idestado'];
                                                break;
                                            }
                                        }
                                    }
                                } else {
                                    $contratos[$val]->iddatosnomenclador = $array_ests_uri['noexistepersona'];
                                    continue;
                                }
                            } else {
                                $contratos[$val]->iddatosnomenclador = $array_ests_uri['noexistetipocontrato'];
                                continue;
                            }
                        } else {
                            $contratos[$val]->iddatosnomenclador = $array_ests_uri['noexistecliente'];
                            continue;
                        }
                        $contratos[$val]->iddatosnomenclador = $array_ests_uri['validadook'];
                        $result = 1;
                    }
                } catch (Exception $e) {
                    if ($parametros['desarrollo']) print_r($e->getMessage());
                    else ob_clean();
                    $contratos[$val]->iddatosnomenclador = $array_ests_uri['errorvalidar'];
                    $errores = 1;
                    continue;
                }
                $cont++;
                if ($cont % $save == 0) $contratos->save();
            }
            $contratos->save();
            $result = ($errores) ? 0 : $result;
            return $result;
        } else return $idestados; //Error
    }

    public
    function adicionarContratos($contratos, $parametros)
    {
        $result = self::validarDatosContratos($contratos, $parametros);
        if ($result == 1 || $result == -1) {
            extract($parametros);
            $connA = Doctrine_Manager:: connection();
            $result = -1;
            $errores = 0;
            foreach ($contratos as $val => $key) {
                if ($add) {
                    if ($key->iddatosnomenclador == $array_ests_uri['validadook']) {
                        try {
                            $cliente = 0;
                            $marco = (self::stringBuscar($key->marco) == 'NO') ? 0 : 1;
                            $idestado = $key->idestado;

                            $tiempo = $key->tiempo;
                            $obligaciones = ($this->stringBuscar($tiempo) == 'CUMPLIMIENTO OBLIGACIONES') ? 1 : 0;
                            $unidadtiempo = self::unidadDeTiempo($tiempo);

                            $vigencia = intval($key->vigencia);

                            $params['vigencia'] = $vigencia;
                            $params['unidadtiempo'] = $unidadtiempo;
                            $params['fechafirma'] = $key->fechafirma;
                            $fechas = self::calcularFechaFin($params);
                            $fechafin = $fechas['fechafin'];
                            $fechafirma = $fechas['fechafirma'];

                            $numerojson = self::obtenerNumeroJson($key->nocontrato);

                            $montototal = $key->montototal;
                            $montototal = (empty($montototal)) ? 0 : intval($montototal);

                            $cadenainsert = 'INSERT INTO mod_crmcontratacion.dat_contrato ("numero", "idclienteproveedor", "idtipocontrato", "nombre", 
                                  "idestructuracomun", "montototal", "denominaciontipocontrato", "denominacionclienteproveedor", "objeto", 
                                  "descripcion", "contratomarco", "cliente", "fechafin", "idestado", "idmediopago", "numerojson", "vigencia",
                                   "unidadtiempo", "idresponsable", "idcondicionpago", "idarea", "numerocontrato", "cumplimientoobligaciones", "fechafirma")';

                            $cadenavalues = " VALUES ('$key->nocontrato',$key->idclienteproveedor, $key->idtipocontrato, '$key->nombrecliente',
                               $idestructura, $montototal, '$key->tipocontrato', '$key->nombrecliente', '$key->objeto',
                                '$key->descripcion', $marco, $cliente,  NULLIF ('$fechafin','')::date, $idestado, $key->idmediopago, '$numerojson', '$vigencia',
                                 $unidadtiempo, $key->idpersona, $key->idcondicionpago, null, '$key->nocontrato', $obligaciones, NULLIF ('$fechafirma','')::date);";
                            $cadena = $cadenainsert . $cadenavalues;

                            $connA->execute($cadena);
                            $contratos[$val]->iddatosnomenclador = $array_ests_uri['adicionadook'];
                            $result = 1;
                        } catch (Doctrine_Exception $e) {
                            $contratos[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                            $connA->rollback();
                            $errores = 1;
                            if ($parametros['desarrollo']) print_r($e->getMessage());
                            else ob_clean();
                            continue;
                        } catch (Exception $e) {
                            $contratos[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                            $errores = 1;
                            if ($parametros['desarrollo']) print_r($e->getMessage());
                            else ob_clean();
                            continue;
                        }
                        $cont++;
                        if ($cont % $save == 0) $contratos->save();
                    }
                }
            }
            $contratos->save();
            $result = ($errores) ? 0 : $result;
        }
        return $result;
    }

    public
    function gestionarActivofijo($parametros)
    {
        extract($parametros);
        if ($idaccion == '5') {//correlacionar areas / importar apertura
            $array_idests_dnom = self::getArrayEstadosAdicionar($array_ests_uri);
            $objactivofijo = new TempActivofijo();
            $activosfijos = $objactivofijo->obtenerDatosAdicionarActivoFijo($array_idests_dnom);
            if (isset($activosfijos[0])) {
                $total = $objactivofijo->obtenerTotalActivoFijo();
                if ($total == count($activosfijos))
                    return self::adicionarActivoFijoCorrelacionar($activosfijos, $parametros);
                else return 36; //Deben estar todos los datos validados para poder correlacionarlos
            } else return -1; //No existen valores para adicionar
        } else if ($idaccion == '6') {//asociar documentos
            $array_idests_dnom[0] = $array_ests_uri['correlacionadook'];
            $objactivofijo = new TempActivofijo();
            $activosfijos = $objactivofijo->obtenerDatosAdicionarActivoFijo($array_idests_dnom);
            if (isset($activosfijos[0])) {
                $total = $objactivofijo->obtenerDatosAdicionarActivoFijo($array_idests_dnom, 1);
                if ($total == count($activosfijos))
                    return self::adicionarActivoFijoAsociarDoc($parametros);
                else return 41; //Deben estar todos los datos correlacionados
            } else return -1; //No existen valores para adicionar
        } else if ($idaccion == '4') { //validar datos
            return self::validarDatosUtilesAFT(0, $parametros);
        }
    }

    /*public
    function gestionarActivofijoOld($parametros)
    {
        extract($parametros);
        if ($idaccion == '1') {//adicionar
            $array_idests_dnom = self::getArrayEstadosAdicionar($array_ests_uri);
            $objactivofijo = new TempActivofijo();
            $activosfijos = $objactivofijo->obtenerDatosAdicionarActivoFijo($array_idests_dnom);
            if (isset($activosfijos[0])) {
                $total = $objactivofijo->obtenerTotalActivoFijo();
                if ($total == count($activosfijos))
                    return self::adicionarActivoFijo($activosfijos, $parametros);
                else return 36; //Deben estar todos los datos correctos
            } else return -1; //No existen valores para adicionar
        } else if ($idaccion == '4') { //validar datos
            return self::validarDatosUtilesAFT(0, $parametros);
        }

    }*/

    public
    function adicionarActivoFijoCorrelacionar($activos, $parametros)
    {
        $result = self::validarDatosUtilesAFT(0, $parametros);
        if ($result == 1) {
            try {
                $connA = Doctrine_Manager:: connection();
                //$paramsQuery = array(1,'345345345');
                if ($paramsQuery) {
                    $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_activos_importar(?,?,?);";
                    $result = $connA->execute($query, $paramsQuery);
                } else {
                    $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_activos_importar(null, null, null);";
                    $result = $connA->execute($query);
                }
                $result = $result->fetchAll(PDO::FETCH_ASSOC);

                if (!isset($result[0])) {
                    extract($parametros);
                    $paramsQuery = array($idnaturaleza);
                    $query = "select * from mod_migracion_aft.f_importar_apertura_aft_importar(?);";
                    $result = $connA->execute($query, $paramsQuery)->fetchAll(PDO::FETCH_ASSOC);

                    $array_idests_dnom[0] = $array_ests_uri['adicionadook'];
                    $array_idests_dnom[1] = $array_ests_uri['correlacionadook'];
                    $array_idests_dnom[2] = $array_ests_uri['camposvacios'];
                    $array_idests_dnom[3] = $array_ests_uri['errornumerico'];
                    $array_idests_dnom[4] = $array_ests_uri['errorformatofecha'];
                    $array_idests_dnom[5] = $array_ests_uri['errorformatoidsuin'];
                    $idestado = $array_ests_uri['correlacionadook'];
                    $model = new TempActivofijo();
                    $model->actualizarEstadoDatos($array_idests_dnom, $idestado);
                    return 1;
                } else {
                    //Error
                    foreach ($activos as $key => $value) {
                        foreach ($result as $key1 => $value1) {
                            if ($value->id == $value1['v_idaft']) {
                                if (!empty($value1['v_idcentrocosto']))
                                    $activos[$key]->iddatosnomenclador = $array_ests_uri['errorcentrocosto'];
                                if (!empty($value1['v_arearesp']))
                                    $activos[$key]->iddatosnomenclador = $array_ests_uri['errorarearesp'];
                            }
                        }
                    }
                    $activos->save();
                    return -1;
                }
            } catch (Exception $e) {
                if ($parametros['desarrollo']) print_r($e->getMessage());
                else ob_clean();
                return 0;
            }
        } else return $result;//Error
    }

    public
    function adicionarActivoFijoAsociarDoc($parametros)
    {
        $result = self::validarDatosUtilesAFT(0, $parametros);
        if ($result == 1) {
            try {
                $connA = Doctrine_Manager:: connection();

                extract($parametros);
                $paramsQuery = array($idestructura, $iddoc, $idoperacion, $idusuario);
                //print_r($paramsQuery);die;

                $query = "select * from mod_migracion_aft.f_importar_apertura_asociardoc_aft_importar(?, ?, ?, ?);";
                $result = $connA->execute($query, $paramsQuery)->fetchAll(PDO::FETCH_ASSOC);

                $array_idests_dnom[0] = $array_ests_uri['adicionadook'];
                $array_idests_dnom[1] = $array_ests_uri['errorformatoidsuin'];
                $array_idests_dnom[2] = $array_ests_uri['camposvacios'];
                $array_idests_dnom[3] = $array_ests_uri['errornumerico'];
                $array_idests_dnom[4] = $array_ests_uri['errorformatofecha'];
                $idestado = $array_ests_uri['adicionadook'];
                $model = new TempActivofijo();
                $model->actualizarEstadoDatos($array_idests_dnom, $idestado);
                return 1;

            } catch (Exception $e) {
                if ($parametros['desarrollo']) print_r($e->getMessage());
                else ob_clean();
                return 0;
            }
        } else return $result;//Error
    }

    public
    function adicionarActivoFijo($activos, $parametros)
    {
        $result = self::validarDatosUtilesAFT(0, $parametros);
        if ($result == 1) {
            try {
                $connA = Doctrine_Manager:: connection();
                //$paramsQuery = array(1,'345345345');
                if ($paramsQuery) {
                    $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_activos_importar(?,?,?);";
                    $result = $connA->execute($query, $paramsQuery);
                } else {
                    $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_activos_importar(null, null, null);";
                    $result = $connA->execute($query);
                }
                $result = $result->fetchAll(PDO::FETCH_ASSOC);

                if (!isset($result[0])) {
                    extract($parametros);
                    $paramsQuery = array($idnaturaleza);
                    $query = "select * from mod_migracion_aft.f_importar_apertura_aft_importar(?);";
                    $result = $connA->execute($query, $paramsQuery)->fetchAll(PDO::FETCH_ASSOC);

                    $paramsQuery = array($idestructura, $iddoc, $idoperacion, $idusuario);
                    //print_r($paramsQuery);die;

                    $query = "select * from mod_migracion_aft.f_importar_apertura_asociardoc_aft_importar(?, ?, ?, ?);";
                    $result = $connA->execute($query, $paramsQuery)->fetchAll(PDO::FETCH_ASSOC);

                    $array_idests_dnom[0] = $array_ests_uri['adicionadook'];
                    $array_idests_dnom[1] = $array_ests_uri['errorformatoidsuin'];
                    $array_idests_dnom[2] = $array_ests_uri['camposvacios'];
                    $array_idests_dnom[3] = $array_ests_uri['errornumerico'];
                    $array_idests_dnom[4] = $array_ests_uri['errorformatofecha'];
                    $model = new TempActivofijo();
                    $model->actualizarEstadoDatos($array_idests_dnom, 0);
                    return 1;
                } else {
                    //Error
                    foreach ($activos as $key => $value) {
                        foreach ($result as $key1 => $value1) {
                            if ($value->id == $value1['v_idaft']) {
                                if (!empty($value1['v_idcentrocosto']))
                                    $activos[$key]->iddatosnomenclador = $array_ests_uri['errorcentrocosto'];
                                if (!empty($value1['v_arearesp']))
                                    $activos[$key]->iddatosnomenclador = $array_ests_uri['errorarearesp'];
                            }
                        }
                    }
                    $activos->save();
                    return -1;
                }
            } catch (Exception $e) {
                if ($parametros['desarrollo']) print_r($e->getMessage());
                else ob_clean();
                return 0;
            }
        } else return $result;//Error
    }

    public
    function gestionarUtiles($parametros)
    {
        extract($parametros);
        if ($idaccion == '5') {//correlacionar areas / importar apertura
            $array_idests_dnom = self::getArrayEstadosAdicionar($array_ests_uri);
            $objutiles = new TempUtiles();
            $utiles = $objutiles->obtenerDatosAdicionarUtiles($array_idests_dnom);
            if (isset($utiles[0])) {
                $total = $objutiles->obtenerTotalUtiles();
                if ($total == count($utiles))
                    return self::adicionarUtilesCorrelacionar($utiles, $parametros);
                else return 36; //Deben estar todos los datos validados para poder correlacionarlos
            } else return -1; //No existen valores para adicionar
        } else if ($idaccion == '6') {//asociar documentos
            $array_idests_dnom[0] = $array_ests_uri['correlacionadook'];
            $objutiles = new TempUtiles();
            $utiles = $objutiles->obtenerDatosAdicionarUtiles($array_idests_dnom);
            if (isset($utiles[0])) {
                $total = $objutiles->obtenerDatosAdicionarUtiles($array_idests_dnom, 1);
                if ($total == count($utiles))
                    return self::adicionarUtilesAsociarDoc($parametros);
                else return 41; //Deben estar todos los datos correlacionados
            } else return -1; //No existen valores para adicionar
        } else if ($idaccion == '4') { //validar datos
            return self::validarDatosUtilesAFT(0, $parametros);
        }
    }

    /*public
    function gestionarUtilesOld($parametros)
    {
        extract($parametros);
        if ($idaccion == '1') {//adicionar
            $array_idests_dnom = self::getArrayEstadosAdicionar($array_ests_uri);
            $objutiles = new TempUtiles();
            $utiles = $objutiles->obtenerDatosAdicionarUtiles($array_idests_dnom);
            if (isset($utiles[0])) {
                $total = $objutiles->obtenerTotalUtiles();
                if ($total == count($utiles))
                    return self::adicionarUtiles($utiles, $parametros);
                else return 36; //Deben estar todos los datos correctos
            } else return -1; //No existen valores para adicionar
        } else if ($idaccion == '4') { //validar datos
            return self::validarDatosUtilesAFT(1, $parametros);
        }
    }*/

    public
    function adicionarUtilesCorrelacionar($utiles, $parametros)
    {
        $result = self::validarDatosUtilesAFT(0, $parametros);
        if ($result == 1) {
            try {
                $connA = Doctrine_Manager:: connection();
                //$paramsQuery = array(1,'345345345');
                if ($paramsQuery) {
                    $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_utiles_importar(?,?,?);";
                    $result = $connA->execute($query, $paramsQuery);
                } else {
                    $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_utiles_importar(null, null, null);";
                    $result = $connA->execute($query);
                }
                $result = $result->fetchAll(PDO::FETCH_ASSOC);

                if (!isset($result[0])) {
                    extract($parametros);
                    $paramsQuery = array($idnaturaleza);
                    $query = "select * from mod_migracion_aft.f_importar_apertura_utiles_importar(?);";
                    $result = $connA->execute($query, $paramsQuery)->fetchAll(PDO::FETCH_ASSOC);

                    $array_idests_dnom[0] = $array_ests_uri['adicionadook'];
                    $array_idests_dnom[1] = $array_ests_uri['correlacionadook'];
                    $array_idests_dnom[2] = $array_ests_uri['camposvacios'];
                    $array_idests_dnom[3] = $array_ests_uri['errornumerico'];
                    $array_idests_dnom[4] = $array_ests_uri['errorformatofecha'];
                    $array_idests_dnom[5] = $array_ests_uri['errorformatoidsuin'];
                    $idestado = $array_ests_uri['correlacionadook'];
                    $model = new TempUtiles();
                    $model->actualizarEstadoDatos($array_idests_dnom, $idestado);
                    return 1;
                } else {
                    //Error
                    foreach ($utiles as $key => $value) {
                        foreach ($result as $key1 => $value1) {
                            if ($value->id == $value1['v_idaft']) {
                                if (!empty($value1['v_idcentrocosto']))
                                    $utiles[$key]->iddatosnomenclador = $array_ests_uri['errorcentrocosto'];
                                if (!empty($value1['v_arearesp']))
                                    $utiles[$key]->iddatosnomenclador = $array_ests_uri['errorarearesp'];
                            }
                        }
                    }
                    $utiles->save();
                    return -1;
                }
            } catch (Exception $e) {
                if ($parametros['desarrollo']) print_r($e->getMessage());
                else ob_clean();
                return 0;
            }
        } else return $result;//Error
    }

    public
    function adicionarUtilesAsociarDoc($parametros)
    {
        $result = self::validarDatosUtilesAFT(0, $parametros);
        if ($result == 1) {
            try {
                $connA = Doctrine_Manager:: connection();

                extract($parametros);
                $paramsQuery = array($idestructura, $iddoc, $idoperacion, $idusuario);
                //print_r($paramsQuery);die;

                $query = "select * from mod_migracion_aft.f_importar_apertura_asociardoc_utiles_importar(?, ?, ?, ?);";
                $result = $connA->execute($query, $paramsQuery)->fetchAll(PDO::FETCH_ASSOC);

                $array_idests_dnom[0] = $array_ests_uri['adicionadook'];
                $array_idests_dnom[1] = $array_ests_uri['errorformatoidsuin'];
                $array_idests_dnom[2] = $array_ests_uri['camposvacios'];
                $array_idests_dnom[3] = $array_ests_uri['errornumerico'];
                $array_idests_dnom[4] = $array_ests_uri['errorformatofecha'];
                $idestado = $array_ests_uri['adicionadook'];
                $model = new TempUtiles();
                $model->actualizarEstadoDatos($array_idests_dnom, $idestado);
                return 1;

            } catch (Exception $e) {
                if ($parametros['desarrollo']) print_r($e->getMessage());
                else ob_clean();
                return 0;
            }
        } else return $result;//Error
    }

    public
    function adicionarUtiles($utiles, $parametros)
    {
        $result = self::validarDatosUtilesAFT(1, $parametros);
        if ($result == 1) {
            try {
                $connA = Doctrine_Manager:: connection();
                //$paramsQuery = array(1,'345345345');
                if ($paramsQuery) {
                    $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_utiles(?,?);";
                    $result = $connA->execute($query, $paramsQuery);
                } else {
                    $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_utiles(null, null);";
                    $result = $connA->execute($query);
                }
                $result = $result->fetchAll(PDO::FETCH_ASSOC);
                //print_r($result);die;

                if (!isset($result[0])) {
                    $query = "select * from mod_migracion_aft.f_importar_apertura_utiles();";
                    $result = $connA->execute($query)->fetchAll(PDO::FETCH_ASSOC);

                    extract($parametros);
                    $paramsQuery = array($idestructura, $iddoc, $idoperacion, $idusuario);
                    //print_r($paramsQuery);die;

                    $query = "select * from mod_migracion_aft.f_importar_apertura_asociardoc_utiles(?, ?, ?, ?);";
                    $result = $connA->execute($query, $paramsQuery)->fetchAll(PDO::FETCH_ASSOC);

                    $array_idests_dnom[0] = $array_ests_uri['adicionadook'];
                    $array_idests_dnom[2] = $array_ests_uri['camposvacios'];
                    $array_idests_dnom[3] = $array_ests_uri['errornumerico'];
                    $model = new TempUtiles();
                    $model->actualizarEstadoDatos($array_idests_dnom, 0);
                    return 1;
                } else {
                    //Error
                    foreach ($utiles as $key => $value) {
                        foreach ($result as $key1 => $value1) {
                            if ($value->id == $value1['v_idutiles']) {
                                if (!empty($value1['v_idcentrocosto']))
                                    $utiles[$key]->iddatosnomenclador = $array_ests_uri['errorcentrocosto'];
                                if (!empty($value1['v_arearesp']))
                                    $utiles[$key]->iddatosnomenclador = $array_ests_uri['errorarearesp'];
                            }
                        }
                    }
                    $utiles->save();
                    return -1;
                }
            } catch (Exception $e) {
                if ($parametros['desarrollo']) print_r($e->getMessage());
                else ob_clean();
                return 0;
            }
        } else return $result;//Error

    }

    public
    function validarDatosUtilesAFT($utiles = 1, &$parametros)
    {
        $iddoc = $parametros['iddoc'];
        if (!empty($iddoc)) {
            $tipo = ($utiles) ? 'UTILES' : 'AFT';
            $idformato = self::validarDatosGeneralesLogistica($tipo);
            if (isset($idformato[0])) {
                $parametros['idnaturaleza'] = $idformato[0]['idnaturaleza_ninguna'];
                extract($parametros);
                $idestructurasub = self::obtenerIdEstructuraSub($idestructura);
                if (isset($idestructurasub[0])) {
                    $idestructurasub = $idestructurasub[0]['idestructurasubsist'];
                    $fechaestructurasub = self::obtenerFechaEstructuraSub($idestructurasub);
                    if (isset($fechaestructurasub[0])) {
                        $idejerciciosub = self::obtenerIdEjercicioPeriodoEstructuraSub($idestructurasub);
                        if (isset($idejerciciosub[0])) {
                            if (empty($idejerciciosub[0]['idejercicioactual']))
                                return 34; //El idejecicio es NULL
                            else if (empty($idejerciciosub[0]['idperiodoactual']))
                                return 35; //El idperiodo es NULL
                            else {
                                $idoperacion = self::obtenerIdOperacionTipoDoc($iddoc);
                                if (isset($idoperacion[0])) {
                                    $parametros['idoperacion'] = $idoperacion[0]['idoperacion'];
                                    $array_idests_dnom = self::getArrayEstadosIgnorarValidar($array_ests_uri);
                                    $model = ($utiles) ? new TempUtiles() : new TempActivofijo();
                                    $idestado = $array_ests_uri['validadook'];
                                    $model->actualizarEstadoDatos($array_idests_dnom, $idestado);
                                    return 1;
                                } else return 20; //No existe una operacion asociada al tipo de documento
                            }
                        } else return 33; //El idperiodo e idejecicio son NULL

                    } else return 32; //El año y la fecha son NULL

                } else return 31; //El idestructurasubsist es NULL

            } else return 30; //No existen datos en la tabla mod_migracion_aft.datos_necesarios_generales

        } else return 19; //Debe seleccionar un tipo de documento
    }

    public
    function gestionarMaestroProductos($parametros)
    {
        extract($parametros);
        $objmaestroproductos = new TempMaestroproductos();
        if ($idaccion == '1') {//adicionar
            $array_idests_dnom = self::getArrayEstadosAdicionar($array_ests_uri);
            $maestroproductos = $objmaestroproductos->obtenerDatosAdicionarMaestroProductos($array_idests_dnom);
            if (isset($maestroproductos[0])) {
                $parametros['add'] = 1;
                $parametros['migrado'] = 1;
                $parametros['check_datos_import'] = 0;
                $parametros['update_naturaleza'] = 0;
                return self::adicionarMaestroProductos($maestroproductos, $parametros); //1- Datos adicionados correctamente
            } else return -1; //No existen valores para adicionar

        } else if ($idaccion == '4') { //validar datos
            $array_idests_dnom = self::getArrayEstadosIgnorarValidar($array_ests_uri);
            $maestroproductos = $objmaestroproductos->obtenerDatosValidarMaestroProductos($array_idests_dnom);
            if (isset($maestroproductos[0])) {
                return self::validarDatosMaestroProductos($maestroproductos, $parametros); //Datos validados correctamente
            } else return -1; //No existen valores para validar
        }
    }

    public
    function validarDatosMaestroProductos(&$maestroproductos, &$parametros)
    {
        $idespecialidad = self::obtenerIdEspecialidad();
        if (isset($idespecialidad[0])) {
            $parametros['idespecialidad'] = $idespecialidad[0]['idespecialidad'];
            $idnaturaleza = self::obtenerIdNaturaleza('NINGUNA');
            if (isset($idnaturaleza[0])) {
                extract($parametros);
                $parametros['idnaturaleza'] = $idnaturaleza[0]['idnaturaleza'];
                $result = -1;
                $errores = 0;
                foreach ($maestroproductos as $val => $key) {
                    try {
                        if ($key->iddatosnomenclador != $array_ests_uri['validadook']) {
                            $existeindicador = self::validarExisteIndicador($key->codigoproveedor);
                            if (!isset($existeindicador[0])) {
                                if (!empty($key->naturaleza)) {
                                    $idnaturalezaind = self::obtenerIdNaturaleza($key->naturaleza);
                                    if (isset($idnaturalezaind[0])) $key->idnaturaleza = $idnaturalezaind[0]['idnaturaleza'];
                                    else {
                                        $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['noexistenaturaleza'];
                                        continue;
                                    }
                                } else $key->idnaturaleza = $parametros['idnaturaleza']; //NINGUNA
                                if (!empty($key->umedida)) {
                                    $idumedida = self::obtenerIdUnidadMedida($key->umedida);
                                    if (isset($idumedida[0])) $key->idumedida = $idumedida[0]['idunidadmedida'];
                                    else {
                                        $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['noexisteunidadmedida'];
                                        continue;
                                    }
                                }
                                if (!empty($key->grupo)) {
                                    $idgrupo = self::obtenerIdGrupo($key->grupo);
                                    if (isset($idgrupo[0])) $key->idgrupo = $idgrupo[0]['idgruposubgrupo'];
                                    else {
                                        $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['noexistegrupo'];
                                        continue;
                                    }
                                }
                                if (!empty($key->marca)) {
                                    $idmarca = self::obtenerIdMarca($key->marca);
                                    if (isset($idmarca[0])) $key->idmarca = $idmarca[0]['idmarca'];
                                    else {
                                        $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['noexistemarca'];
                                        continue;
                                    }
                                }
                                if (!empty($key->modelo)) {
                                    $idmodelo = self::obtenerIdModelo($key->modelo);
                                    if (isset($idmodelo[0])) $key->idmodelo = $idmodelo[0]['idmodelo'];
                                    else {
                                        $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['noexistemodelo'];
                                        continue;
                                    }
                                }
                                if (!empty($key->elementogasto)) {
                                    $idelementogasto = self::obtenerIdElementoGasto($key->elementogasto);
                                    if (isset($idelementogasto[0])) $key->idelementogasto = $idelementogasto[0]['idelementoobjeto'];
                                    else {
                                        $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['noexisteelementogasto'];
                                        continue;
                                    }
                                }
                                if (!empty($key->elementogastoalter)) {
                                    $idelementogasto = self::obtenerIdElementoGasto($key->elementogastoalter);
                                    if (isset($idelementogasto[0])) $key->idelementogastoalter = $idelementogasto[0]['idelementoobjeto'];
                                    else {
                                        $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['noexisteelementogastoalter'];
                                        continue;
                                    }
                                }
                                $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['validadook'];
                                $result = 1;
                            } else {
                                $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['existeindicador'];
                                continue;
                            }
                        }
                    } catch (Exception $e) {
                        if ($parametros['desarrollo']) print_r($e->getMessage());
                        else ob_clean();
                        $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['errorvalidar'];
                        $errores = 1;
                        continue;
                    }
                    $cont++;
                    if ($cont % $save == 0) $maestroproductos->save();
                }
                $maestroproductos->save();
                $result = ($errores) ? 0 : $result;
                return $result;
            } else return 39; //No existe el nomenclador de naturaleza NINGUNA
        } else return 38; //No existe el nomenclador de especialidad NINGUNA
    }

    public
    function adicionarMaestroProductos($maestroproductos, $parametros)
    {
        $result = self::validarDatosMaestroProductos($maestroproductos, $parametros);
        if ($result == 1 || $result == -1) {
            $resultado = -1;
            $errores = 0;
            extract($parametros);
            $connA = Doctrine_Manager:: connection();
            if (!empty($idproducto)) {
                $idformatoind = self::obtenerInfoIndicadorPorId($idproducto);
                if (isset($idformatoind[0])) {
                    $parametros['idformatoindicador'] = $idformatoind[0]['idformato'];
                    $parametros['idindicadorpadre'] = $idformatoind[0]['idpadre'];
                    foreach ($maestroproductos as $val => $key) {
                        if ($add) {
                            if ($key->iddatosnomenclador == $array_ests_uri['validadook']) {
                                $result = self::insertarNomIndicador($connA, $key, $parametros);
                                if (isset($result[0])) {
                                    $parametros['idindicador'] = $result[0]['idindicador'];
                                    $result = self::insertarNomIndicadorHoja($connA, $key, $parametros);
                                    if ($result) {
                                        $parametros['idaprobacion'] = 1; //No aprobado
                                        $parametros['precio'] = 0;
                                        $result = self::insertarNomIndicadorPlanif($connA, $key, $parametros);
                                        if ($result) {
                                            $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['adicionadook'];
                                            $resultado = $result;
                                        } else {
                                            $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                                            $errores = 1;
                                            continue;
                                        }
                                    } else {
                                        $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                                        $errores = 1;
                                        continue;
                                    }
                                } else {
                                    $maestroproductos[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                                    $errores = 1;
                                    continue;
                                }
                                $cont++;
                                if ($cont % $save == 0) $maestroproductos->save();
                            }
                        }
                    }
                    $maestroproductos->save();
                    $resultado = ($errores) ? 0 : $resultado;
                    return $resultado;
                } else return 37; //No existe el nomenclador indicador
            } else return 40; //No se selecciono el producto o servicio
        } else  return $result;
    }

    public
    function insertarNomIndicador($connA, $indicador, $parametros)
    {
        extract($parametros);
        $cadenainsert = 'INSERT INTO mod_datosmaestros.nom_indicador
                                      (codigo, 
                                       numeropieza, denominacion, idumedida, 
                                       idnaturaleza, tipo, idelementogasto, 
                                       idelementogastoalt, idespecialidad, idformato, 
                                       idpadre, idarbol,  fechainicio, 
                                       orden, 
                                       activo, nivel)';

        $cadenavalues = " VALUES ((SELECT max(i.codigo::numeric) + 1  FROM mod_datosmaestros.nom_indicador i WHERE i.idpadre = $idindicadorpadre), 
                                   '$indicador->codigoproveedor','$indicador->denominacion',  NULLIF('$indicador->idumedida','')::numeric, 
                                   NULLIF('$indicador->idnaturaleza','')::numeric, $indicador->productoservicio::numeric, NULLIF('$indicador->idelementogasto','')::numeric,
                                   NULLIF('$indicador->idelementogastoalter','')::numeric, $idespecialidad::numeric, $idformatoindicador::numeric, 
                                   NULLIF('$idindicadorpadre','')::numeric, NULLIF('$idindicadorpadre','')::numeric, now(), 
                                   (SELECT max(i.orden::numeric) + 1 FROM mod_datosmaestros.nom_indicador i WHERE i.idpadre = $idindicadorpadre),
                                   1, 2) returning idindicador; ";

        $cadena = $cadenainsert . $cadenavalues;
        try {
            $idindicador = $connA->execute($cadena)->fetchAll();
            return $idindicador;
        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            return 0;
        }
    }

    public
    function insertarNomIndicadorHoja($connA, $indicador, $parametros)
    {
        extract($parametros);
        $almadenaexplota = $indicador->almacenaexplota;

        if ($almadenaexplota == 1) {
            $explotacion = 0;
            $almacenado = 1;
        } elseif ($almadenaexplota == 2) {
            $explotacion = 1;
            $almacenado = 0;
        } elseif ($almadenaexplota == 3) {
            $explotacion = 1;
            $almacenado = 1;
        } else {
            $explotacion = 0;
            $almacenado = 0;
        }
        $cadenainsert = 'INSERT INTO mod_datosmaestros.nom_indicadorhoja
                  (idindicador, codigoauxiliar, explotacion, almacenado, 
                   idgruposubgrupo, idmarca, 
                   idmodelo, tipocontrol)';

        $cadenavalues = " VALUES ($idindicador::numeric, '$indicador->codigoauxiliar', $explotacion::numeric, $almacenado::numeric, 
                   NULLIF('$indicador->idgrupo','')::numeric, NULLIF('$indicador->idmarca','')::numeric,
                   NULLIF('$indicador->idmodelo','')::numeric,  1); ";

        $cadena = $cadenainsert . $cadenavalues;
        try {
            $connA->execute($cadena);
            return 1;
        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            return 0;
        }
    }

    public
    function insertarNomIndicadorPlanif($connA, $indicador, $parametros)
    {
        extract($parametros);
        $cadenainsert = 'INSERT INTO mod_datosmaestros.nom_indicadorplanif(idindicador, precio, idaprobacion)';
        $cadenavalues = " VALUES ($idindicador::numeric, $precio::numeric, $idaprobacion::numeric); ";
        $cadena = $cadenainsert . $cadenavalues;
        try {
            $connA->execute($cadena);
            return 1;
        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            return 0;
        }
    }

    public
    function insertarDatIndicadorViaAdquisicion($connA, $indicador, $parametros)
    {
        extract($parametros);
        $cadenainsert = ' INSERT INTO mod_datosmaestros.dat_indicadorviaadquisicion (idindicador, idviaadquisicion) ';
        $cadenavalues = " VALUES ($idindicador::numeric, $indicador->idviaadquisicion::numeric); ";
        $cadena = $cadenainsert . $cadenavalues;
        try {
            $connA->execute($cadena);
            return 1;
        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            return 0;
        }
    }

    public
    function insertarDatIndicadorViaAdquisicionOrgSatisf($connA, $indicador, $parametros)
    {
        extract($parametros);
        $cadenainsert = ' INSERT INTO mod_datosmaestros.dat_indicadorviaadquisicionorganosatisface
                          (idindicador, idviaadquisicion, idorganosatisface) ';
        $cadenavalues = " VALUES ($idindicador::numeric, $indicador->idviaadquisicion::numeric, $indicador->idorganosatisface::numeric); ";
        $cadena = $cadenainsert . $cadenavalues;
        try {
            $connA->execute($cadena);
            return 1;
        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            return 0;
        }
    }

    public
    function insertarDatIndicadorCentroBalance($connA, $indicador, $parametros)
    {
        extract($parametros);
        $cadenainsert = ' INSERT INTO mod_datosmaestros.dat_indicadorcentrobalance
                          (idindicador,
                          identidaddatosnomenclador) ';
        $cadenavalues = " VALUES ($idindicador::numeric, $indicador->identidaddatosnomenclador::numeric); ";
        $cadena = $cadenainsert . $cadenavalues;
        try {
            $connA->execute($cadena);
            return 1;
        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            return 0;
        }
    }

    public
    function validarExisteIndicador($codigo)
    {

        $cadena = "SELECT i.numeropieza
                    FROM mod_datosmaestros.nom_indicador i
                    INNER JOIN mod_datosmaestros.nom_indicadorhoja ih on ih.idindicador = i.idindicador
                    WHERE i.numeropieza = '$codigo'
                    limit 1;";
        $connA = Doctrine_Manager:: connection();
        $numeropieza = $connA->execute($cadena)->fetchAll();
        return $numeropieza;
    }

    public
    function obtenerInfoIndicador()
    {
        $denominacion = 'INDICADOR';
        $cadena = "SELECT i.idformato, i.idpadre
                    FROM mod_datosmaestros.nom_indicador i
                    WHERE  upper(translate(i.denominacion, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like " . "'%$denominacion%'";
        $connA = Doctrine_Manager:: connection();
        $idformato = $connA->execute($cadena)->fetchAll();
        return $idformato;
    }

    public
    function obtenerInfoIndicadorPorId($id)
    {
        $cadena = "SELECT i.idformato, i.idpadre
                    FROM mod_datosmaestros.nom_indicador i
                    WHERE  (i.idindicador = $id)";
        $connA = Doctrine_Manager:: connection();
        $idformato = $connA->execute($cadena)->fetchAll();
        return $idformato;
    }

    public
    function obtenerIdEspecialidad()
    {
        $denominacion = 'NINGUNA';
        $cadena = "SELECT e.idespecialidad
                    FROM mod_datosmaestros.nom_especialidad e
                    WHERE  upper(translate(e.denespecialidad, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like " . "'%$denominacion%'";
        $connA = Doctrine_Manager:: connection();
        $idespecialidad = $connA->execute($cadena)->fetchAll();
        return $idespecialidad;
    }

    public
    function obtenerIdNaturaleza($denominacion)
    {
        $denominacion = self::stringBuscar($denominacion);
        $cadena = "SELECT n.idnaturaleza
                    FROM mod_datosmaestros.nom_naturaleza n
                    WHERE  upper(translate(n.denominacion, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like " . "'%$denominacion%'";
        $connA = Doctrine_Manager:: connection();
        $idnaturaleza = $connA->execute($cadena)->fetchAll();
        return $idnaturaleza;
    }

    public
    function obtenerIdUnidadMedida($denominacion)
    {
        $denominacion = self::stringBuscar($denominacion);
        $cadena = "SELECT um.idunidadmedida
                    FROM mod_datosmaestros.nom_unidadmedida um
                    WHERE upper(translate(um.abreviaturaunidadmedida, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like " . "'%$denominacion%'";
        $connA = Doctrine_Manager:: connection();
        $idumedida = $connA->execute($cadena)->fetchAll();
        return $idumedida;
    }

    public
    function obtenerIdGrupo($denominacion)
    {
        $denominacion = self::stringBuscar($denominacion);
        $cadena = "SELECT g.idgruposubgrupo
                    FROM mod_datosmaestros.nom_gruposubgrupo g
                    WHERE upper(translate(g.denominacion, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like " . "'%$denominacion%'";
        //print_r($cadena);die;
        $connA = Doctrine_Manager:: connection();
        $idgrupo = $connA->execute($cadena)->fetchAll();
        return $idgrupo;
    }

    public
    function obtenerIdMarca($denominacion)
    {
        $denominacion = self::stringBuscar($denominacion);
        $cadena = "SELECT m.idmarca
                    FROM mod_datosmaestros.nom_marca m
                    WHERE upper(translate(m.denominacion, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like " . "'%$denominacion%'";
        $connA = Doctrine_Manager:: connection();
        $idmarca = $connA->execute($cadena)->fetchAll();
        return $idmarca;
    }

    public
    function obtenerIdModelo($denominacion)
    {
        $denominacion = self::stringBuscar($denominacion);
        $cadena = "SELECT m.idmodelo
                    FROM mod_datosmaestros.nom_modelo m
                    WHERE upper(translate(m.denominacion, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like " . "'%$denominacion%'";
        $connA = Doctrine_Manager:: connection();
        $idmodelo = $connA->execute($cadena)->fetchAll();
        return $idmodelo;
    }

    public
    function obtenerIdElementoGasto($denominacion)
    {
        $denominacion = self::stringBuscar($denominacion);
        $cadena = "SELECT eg.idelementoobjeto
                    FROM mod_contabilidadcosto.nom_elementogasto eg
                    WHERE upper(translate(eg.descripcionelementoobjeto, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like " . "'%$denominacion%'";
        $connA = Doctrine_Manager:: connection();
        $idelemento = $connA->execute($cadena)->fetchAll();
        return $idelemento;
    }

    public
    function obtenerIdEstructuraSub($idestructura)
    {
        $cadena = "SELECT sub.idestructurasubsist
                    FROM mod_datosmaestros.dat_estructurasubsist sub
                    WHERE sub.idestructuracomun = $idestructura AND sub.idsubsistema = 11";
        $connA = Doctrine_Manager:: connection();
        $idestructurasub = $connA->execute($cadena)->fetchAll();
        return $idestructurasub;
    }

    public
    function obtenerFechaEstructuraSub($idestructurasub)
    {
        $cadena = "SELECT f.fecha
                    FROM mod_datosmaestros.dat_fecha f
                    WHERE f.idestructurasubsist = $idestructurasub;";
        $connA = Doctrine_Manager:: connection();
        $fecha = $connA->execute($cadena)->fetchAll();
        return $fecha;
    }

    public
    function obtenerIdEjercicioPeriodoEstructuraSub($idestructurasub)
    {
        $cadena = "SELECT c.idejercicioactual, c.idperiodoactual
                     FROM mod_datosmaestros.dat_cierre c
                     WHERE c.idestructurasubsist = $idestructurasub";
        $connA = Doctrine_Manager:: connection();
        $fecha = $connA->execute($cadena)->fetchAll();
        return $fecha;
    }

    public
    function validarDatosGeneralesLogistica($tipo)
    {
        $query = "SELECT dg.idformato, dg.idnaturaleza_ninguna
                    FROM mod_migracion_aft.datos_necesarios_generales dg
                    WHERE  upper(translate(dg.aft_utiles, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like '%$tipo%';";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($query)->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function adicionarActivoFijoOLD($activosfijos, $parametros)
    {
        $cadenainsert = 'INSERT INTO mod_migracion_aft.apertura_importar_activos 
                        ("codigoproveedor", "id_rotulo", "desc_activofijo", "id_clasificacion", "fecha_alta", "valor_cuc_inicial",
                         "valor_cup_inicial", "tasa_depreciacion", "dep_cuc_acumulada", "dep_cup_acumulada", "responsable", 
                         "id_area", "area", "id_centrocosto", "centro_costo", "numero_serie", 
                         "gruoexplotacion", "estadotecnico", "idarearesp_distra", "idcentrocosto_distra", "idestructuracomun_distra", 
                         "migrado", "color1", "color2", "matricula", "circulacion", "nromotor") VALUES ';
        extract($parametros);
        $cadenavalues = '';
        foreach ($activosfijos as $key => $value) {
            $cadenavalues .= " ('{$value['codigo']}', '{$value['id_rotulo']}', '{$value['desc_activofijo']}', '{$value['clasificacion']}', '{$value['fechaadquisicion']}', '{$value['valor_cuc_inicial']}',
                                '{$value['valor_cup_inicial']}', '{$value['tasa_depreciacion']}', '{$value['dep_cuc_acumulada']}', '{$value['dep_cup_acumulada']}', '{$value['ciresponsable']}',
                                null, '{$value['area']}', {$value['id_centrocosto']}, null, '{$value['numserie']}',
                                null, '{$value['estadotecnico']}', null, null, $idestructura,
                                1, '{$value['colorprimario']}', '{$value['colorsecundario']}', '{$value['matricula']}', '{$value['circulacion']}', '{$value['nummotor']}'),";
        }

        $cadenavalues = rtrim($cadenavalues, ',') . ';';
        $cadenasql = $cadenainsert . $cadenavalues;
        try {
            $connA = Doctrine_Manager:: connection();
            $connA->execute($cadenasql);

            //$paramsQuery = array(1,'denomarea');
            if ($paramsQuery) {
                $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_activos(?,?);";
                $result = $connA->execute($query, $paramsQuery);
            } else {
                $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_activos(null, null);";
                $result = $connA->execute($query);
            }
            $result = $result->fetchAll(PDO::FETCH_ASSOC);

            $result = pg_get_result($connA);
            //var_dump($result);die;

            //print_r(pg_last_notice($result));die;
            print_r(pg_last_notice($result, PGSQL_NOTICE_ALL));
            die;

            if (isset($result[0])) {
                if (empty($result[0]['f_correlacionar_areas_centrocosto_activos'])) {
                    $query = "select * from mod_migracion_aft.f_importar_apertura_aft();";
                    $result = $connA->execute($query)->fetchAll(PDO::FETCH_ASSOC);
                    if (isset($result[0])) {
                        if (empty($result[0]['f_importar_apertura_aft'])) {
                            $paramsQuery = array($idestructura, $iddoc, $idoperacion, $idusuario);
                            $query = "select * from mod_migracion_aft.f_importar_apertura_asociardoc_aft(?, ?, ?, ?);";
                            //$result = $connA->execute($query, $paramsQuery);
                        }
                    }
                }
            }
            return 1;
        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            return 0;
        }
    }

    public
    function adicionarUtilesOld($utiles, $parametros)
    {
        $cadenainsert = 'INSERT INTO mod_migracion_aft.apertura_importar_utiles 
                        ("codigoproveedor",  "denomindicador", "cantidad", "valor_cup", "valor_cuc", "fecha_alta", 
                         "migrado", "idempleado", "id_area", "area", "id_centrocosto", "centro_costo", 
                         "idarearesp_distra", "idcentrocosto_distra", "idestructuracomun_distra") VALUES ';
        extract($parametros);
        $cadenavalues = '';

        foreach ($utiles as $key => $value) {
            $cadenavalues .= " ('{$value['codigo']}', '{$value['denomindicador']}', '{$value['cantidad']}', '{$value['valor_cup']}', '{$value['valor_cuc']}', null,
                                1, '{$value['ciresponsable']}', null, '{$value['area']}', {$value['id_centrocosto']}, null,
                                null, null, $idestructura),";
        }

        $cadenavalues = rtrim($cadenavalues, ',') . ';';
        $cadenasql = $cadenainsert . $cadenavalues;

        try {
            $connA = Doctrine_Manager:: connection();
            //$connA->execute($cadenasql);

            //$paramsQuery = array(1,'345345345');
            if ($paramsQuery) {
                $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_utiles(?,?);";
                $result = $connA->execute($query, $paramsQuery);
            } else {
                $query = "select * from mod_migracion_aft.f_correlacionar_areas_centrocosto_utiles(null, null);";
                $result = $connA->execute($query);
            }
            $result = $result->fetchAll(PDO::FETCH_ASSOC);
            print_r($result);
            die;

            if (isset($result[0])) {
                if (empty($result[0]['f_correlacionar_areas_centrocosto_utiles'])) {
                    $query = "select * from mod_migracion_aft.f_importar_apertura_utiles();";
                    $result = $connA->execute($query)->fetchAll(PDO::FETCH_ASSOC);
                    if (isset($result[0])) {
                        if (empty($result[0]['f_importar_apertura_utiles'])) {
                            $paramsQuery = array($idestructura, '', '', $idusuario);
                            $query = "select * from mod_migracion_aft.f_importar_apertura_asociardoc_utiles(?, ?, ?, ?);";
                            //$result = $connA->execute($query, $paramsQuery);
                        }
                    }
                }
            }
            return 1;
        } catch (Exception $e) {
            if ($parametros['desarrollo']) print_r($e->getMessage());
            else ob_clean();
            return 0;
        }

    }

    public
    function gestionarPersona($parametros)
    {
        extract($parametros);
        if ($idaccion == '3') {//adicionar-actualizar
            $array_idests_dnom[0] = $array_ests_uri['validadook'];
            $array_idests_dnom[1] = $array_ests_uri['importadook'];
            $objpersona = new TempPersona();
            $personas = $objpersona->obtenerDatosAdicionarPersona($array_idests_dnom);
            if (isset($personas[0])) {
                $parametros['add'] = 1;
                $parametros['migrado'] = 1;
                $parametros['idpais'] = 1;
                return self::adicionarPersona($personas, $parametros); //Datos adicionados-actualizados correctamente
            } else return -1; //No existen valores para adicionar-actualizar

        } else if ($idaccion == '4') { //validar datos idaccion = 4
            $array_idests_dnom = self::getArrayEstadosIgnorarValidar($array_ests_uri);
            $objpersona = new TempPersona();
            $personas = $objpersona->obtenerDatosValidarPersona($array_idests_dnom);
            if (isset($personas[0])) {
                return self::validarDatosPersona($personas, $parametros); //Datos validados correctamente
            } else return -1; //No existen valores para validar
        }
    }

    public
    function adicionarPersona($personas, $parametros)
    {
        $result = self::validarDatosPersona($personas, $parametros);
        if ($result == 1 || $result == -1) {
            extract($parametros);
            $result = -1;
            $errores = 0;
            foreach ($personas as $val => $key) {
                if ($add) {
                    if ($key->iddatosnomenclador == $array_ests_uri['validadook']) {
                        try {
                            $ci = $key->idsuin;
                            $idsuin = (empty($ci)) ? $key->expedientefar : $ci;
                            $params['idsuin'] = $idsuin;
                            $params['nombre'] = $key->nombre;
                            $params['apellido'] = $key->apellido;
                            $params['migrado'] = $migrado;
                            $idpersona = self::obtenerIdPersona($params);
                            $mod = 0;
                            $sexo = self::mapearSexo($key->sexo);
                            $params['sexo'] = $sexo;
                            if (!isset($idpersona[0])) {
                                $idpersona = self::insertarPersona($key, $params);
                            } elseif (count($idpersona) > 1) {
                                $personas[$val]->iddatosnomenclador = $array_ests_uri['personaduplicada'];
                                continue;
                            } elseif (!empty($idpersona[0]['feliminado'])) {
                                $personas[$val]->iddatosnomenclador = $array_ests_uri['personaeliminada'];
                                continue;
                            } else {
                                $mod = 1;
                                $idpersona = $idpersona[0]['idpersona'];
                                $params['idpersona'] = $idpersona;
                                $idpersona = self::actualizarPersona($key, $params);
                            }
                            $key->idmodpersona = $idpersona[0]['idpersona'];
                            self::actualizarDocIdentidad($key, $parametros);
                            if (!empty($ci)) {
                                $fechanacimiento = self::obtenerFechaNacimientoCI($ci);
                                $params['fechanacimiento'] = $fechanacimiento;
                                $iddatosnacimiento = self::actualizarDatosNacimiento($key, $params);
                                if (!isset($iddatosnacimiento[0]))
                                    self::insertarDatosNacimiento($key, $params);
                            }
                            if (!empty($key->correoelectronico)) {
                                $idcontacto = self::actualizarDatosContacto($key, $parametros);
                                if (!isset($idcontacto[0])) self::insertarDatosContacto($key, $parametros);
                            }
                            if (!empty($key->direccion)) {
                                $iddireccion = self::actualizarDireccion($key, $parametros);
                                if (!isset($iddireccion[0])) self::insertarDireccion($key, $parametros);
                            }
                            if (!empty($key->colorpiel)) {
                                $idfenotipo = self::actualizarColorPiel($key, $parametros);
                                if (!isset($idfenotipo[0])) self::insertarColorPiel($key, $parametros);
                            }
                            self::adicionarCuentasBancarias($key, $parametros);

                            if ($mod) $personas[$val]->iddatosnomenclador = $array_ests_uri['actualizadook'];
                            else $personas[$val]->iddatosnomenclador = $array_ests_uri['adicionadook'];
                            $result = 1;
                        } catch (Exception $e) {
                            if ($parametros['desarrollo']) print_r($e->getMessage());
                            else ob_clean();
                            $personas[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                            $errores = 1;
                            continue;
                        }
                        $cont++;
                        if ($cont % $save == 0) $personas->save();
                    }
                }

            }
            $personas->save();
            $result = ($errores) ? 0 : $result;
        }
        return $result;
    }

    public
    function adicionarCuentasBancarias($persona, $parametros)
    {
        extract($parametros);
        $connA = Doctrine_Manager:: connection();
        $updatecuentacuc = 0;
        $updatecuentacup = 0;
        $puedeupdatecuc = (!empty($persona->cuentabancariacuc) && !empty($persona->idbancocuc)) ? 1 : 0;
        $puedeupdatecup = (!empty($persona->cuentabancariacup) && !empty($persona->idbancomn)) ? 1 : 0;

        $idtipoacreditacionsalario = (empty($persona->expedientefar)) ? $idtipoacreditacionsalarioci : $idtipoacreditacionsalariocm;
        $codtipoid = $idtipoacreditacionsalario;

        if ($puedeupdatecuc) {
            $cadenaupdate
                = "UPDATE mod_personaext.dat_cuentabancaria SET 
                idtipoacreditacionsalario = $idtipoacreditacionsalario,
                codtipoid = $codtipoid,
                migrado = $migrado
                WHERE (idpersona = $persona->idmodpersona and
                      numerocuenta = '$persona->cuentabancariacuc' and
                      idbanco = $persona->idbancocuc AND 
                      idmoneda = $idmonedacuc) 
                RETURNING idcuentabancaria";

            $res = $connA->execute($cadenaupdate);
            $result = $res->fetchAll(PDO::FETCH_ASSOC);
            if (isset($result[0])) $updatecuentacuc = 1;
        }
        if ($puedeupdatecup) {
            $cadenaupdate
                = "UPDATE mod_personaext.dat_cuentabancaria SET 
                idtipoacreditacionsalario = $idtipoacreditacionsalario,
                codtipoid = $codtipoid,
                migrado = $migrado
                WHERE (idpersona = $persona->idmodpersona and
                      numerocuenta = '$persona->cuentabancariacup' and
                      idbanco = $persona->idbancomn AND 
                      idmoneda = $idmonedacup) 
                RETURNING idcuentabancaria";

            $res = $connA->execute($cadenaupdate);
            $result = $res->fetchAll(PDO::FETCH_ASSOC);
            if (isset($result[0])) $updatecuentacup = 1;
        }
        if ($puedeupdatecuc && !$updatecuentacuc && $puedeupdatecup && !$updatecuentacup)
            self::insertarCuentaBancaria($persona, $parametros, 1, 1);
        elseif ($puedeupdatecuc && !$updatecuentacuc)
            self::insertarCuentaBancaria($persona, $parametros, 1, 0);
        elseif ($puedeupdatecup && !$updatecuentacup)
            self::insertarCuentaBancaria($persona, $parametros, 0, 1);
        return 1;
    }

    public
    function gestionarCuentaClienteProveedor($parametros)
    { //adicionar
        extract($parametros);
        if ($idaccion == '3') {//adicionar-actualizar
            $array_idests_dnom[0] = $array_ests_uri['validadook'];
            $array_idests_dnom[1] = $array_ests_uri['importadook'];
            $objcuentacliente = new TempCuentaclienteproveedor();
            $cuentaclientes = $objcuentacliente->obtenerDatosAdicionarCuentaClienteProveedor($array_idests_dnom);
            if (isset($cuentaclientes[0])) {
                return self::adicionarCuentaClientes($cuentaclientes, $parametros);
            } else return -1; //No existen valores para adicionar-actualizar

        } else if ($idaccion == '4') { //validar datos idaccion = 4
            $array_idests_dnom = self::getArrayEstadosIgnorarValidar($array_ests_uri);
            $objcuentacliente = new TempCuentaclienteproveedor();
            $cuentaclientes = $objcuentacliente->obtenerDatosValidarCuentaClienteProveedor($array_idests_dnom);
            if (isset($cuentaclientes[0])) {
                return self::validarDatosCuentaClientesProveedores($cuentaclientes, $parametros);
            } else return -1; //No existen valores para validar
        }
    }

    public
    function adicionarCuentaClientes($cuentaclientes, $parametros)
    {
        $result = self::validarDatosCuentaClientesProveedores($cuentaclientes, $parametros);
        if ($result == 1 || $result == -1) {
            $result = -1;
            $errores = 0;
            extract($parametros);
            foreach ($cuentaclientes as $val => $key) {
                if ($key->iddatosnomenclador == $array_ests_uri['validadook']) {
                    try {
                        $params = array();
                        $mod = 1;
                        $params['idclienteproveedor'] = $key->idclientesproveedores;
                        $params['idcuenta'] = $key->idcuenta;
                        $params['idmoneda'] = $key->idmoneda;
                        $idterminodepago = self::obtenerIdCondicionPago($key->condicion);
                        if (isset($idterminodepago[0])) {
                            $params['idterminodepago'] = $idterminodepago[0]['idterminodepago'];
                            $idclienteproveedorcobropago = self::actualizarClienteProveedorCobroPago($key, $params);
                            if (!isset($idclienteproveedorcobropago[0])) {
                                self::insertarClienteProveedorCobroPago($key, $params);
                                $mod = 0;
                            }
                            if ($mod) $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['actualizadook'];
                            else $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['adicionadook'];
                            $result = 1;
                        } else {
                            $params['idumplazo'] = 1;
                            $params['aplazos'] = 0;
                            $params['mora'] = 0;
                            $params['descventa'] = 0;
                            $params['dpp'] = 0;
                            $params['predeterminado'] = 0;
                            $idterminopago = self::insertarTerminoPago($key, $params);
                            if (isset($idterminodepago[0])) {
                                $params['idterminodepago'] = $idterminodepago[0]['idterminodepago'];
                                self::insertarClienteProveedorCobroPago($key, $params);
                                $mod = 0;
                            }
                            if ($mod) $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['actualizadook'];
                            else $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['adicionadook'];
                            $result = 1;
                        }

                    } catch (Exception $e) {
                        $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                        if ($parametros['desarrollo']) print_r($e->getMessage());
                        else ob_clean();
                        $cuentaclientes->save();
                        $errores = 1;
                        continue;
                    }
                    $cont++;
                    if ($cont % $save == 0) $cuentaclientes->save();
                }
            }
            $cuentaclientes->save();
            $result = ($errores) ? 0 : $result;
        }
        return $result;
    }

    function adicionarCuentaClientesOld($cuentaclientes, $parametros)
    {
        $result = self::validarDatosCuentaClientesProveedores($cuentaclientes, $parametros);
        if ($result == 1) {
            $result = -1;
            extract($parametros);
            foreach ($cuentaclientes as $val => $key) {
                if ($key->iddatosnomenclador == $array_ests_uri['validadook']) {
                    try {
                        $params = array();
                        $mod = 1;
                        $codigoreeup = $key->codigo;
                        $clienteproveedor = Doctrine::getTable('NomClienteproveedor')->findByDql(
                            "codigo = '$codigoreeup'"
                        );
                        if (isset($clienteproveedor[0])) {
                            $params['idclienteproveedor'] = $clienteproveedor[0]->idclientesproveedores;
                            $cuentacontable = self::obtenerIdCuentaCliente($key->nocuenta);
                            if (isset($cuentacontable[0])) {
                                $params['idcuenta'] = $cuentacontable[0]['idcuenta'];
                                $params['idmoneda'] = $cuentacontable[0]['idmoneda'];
                                $idterminodepago = self::obtenerIdCondicionPago($key->condicion);
                                if (isset($idterminodepago[0])) {
                                    $params['idterminodepago'] = $idterminodepago[0]['idterminodepago'];
                                    $idclienteproveedorcobropago = self::actualizarClienteProveedorCobroPago($key, $params);
                                    if (!isset($idclienteproveedorcobropago[0])) {
                                        self::insertarClienteProveedorCobroPago($key, $params);
                                        $mod = 0;
                                    }
                                    if ($mod) $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['actualizadook'];
                                    else $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['adicionadook'];
                                } else {
                                    $params['idumplazo'] = 1;
                                    $params['aplazos'] = 0;
                                    $params['mora'] = 0;
                                    $params['descventa'] = 0;
                                    $params['dpp'] = 0;
                                    $params['predeterminado'] = 0;
                                    $idterminopago = self::insertarTerminoPago($key, $params);
                                    if (isset($idterminodepago[0])) {
                                        $params['idterminodepago'] = $idterminodepago[0]['idterminodepago'];
                                        self::insertarClienteProveedorCobroPago($key, $params);
                                        $mod = 0;
                                    }
                                    if ($mod) $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['actualizadook'];
                                    else $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['adicionadook'];
                                }
                            } else {
                                $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['noexistecuenta'];
                                continue;
                            }
                        } else {
                            $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['noexistecliente'];
                            continue;
                        }
                        $result = 1;
                    } catch (Exception $e) {
                        $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['erroradicionar'];
                        if ($parametros['desarrollo']) echo($e->getMessage());
                        $cuentaclientes->save();
                        continue;
                    }
                }
                if ($cont % $save == 0) {
                    $cuentaclientes->save();
                }
                $cont++;
            }
            $cuentaclientes->save();
        }
        return $result;
    }

    public
    function validarDatosCuentaClientesProveedores(&$cuentaclientes, &$parametros)
    {
        extract($parametros);
        $result = -1;
        $errores = 0;
        foreach ($cuentaclientes as $val => $key) {
            if ($key->iddatosnomenclador != $array_ests_uri['validadook']) {
                try {
                    $codigoreeup = $key->codigo;
                    $clienteproveedor = Doctrine::getTable('NomClienteproveedor')->findByDql(
                        "codigo = '$codigoreeup'"
                    );
                    if (isset($clienteproveedor[0])) {
                        $key->idclienteproveedor = $clienteproveedor[0]->idclientesproveedores;
                        $cuentacontable = self::obtenerIdCuentaCliente($key->nocuenta);
                        if (isset($cuentacontable[0])) {
                            $key->idcuenta = $cuentacontable[0]['idcuenta'];
                            $key->idmoneda = $cuentacontable[0]['idmoneda'];
                            $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['validadook'];
                            $result = 1;
                        } else {
                            $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['noexistecuenta'];
                            continue;
                        }
                    } else {
                        $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['noexistecliente'];
                        continue;
                    }
                } catch (Exception $e) {
                    $cuentaclientes[$val]->iddatosnomenclador = $array_ests_uri['errorvalidar'];
                    if ($parametros['desarrollo']) print_r($e->getMessage());
                    else ob_clean();
                    $cuentaclientes->save();
                    $errores = 1;
                    continue;
                }
                $cont++;
                if ($cont % $save == 0) $cuentaclientes->save();

            }

        }
        $cuentaclientes->save();
        $result = ($errores) ? 0 : $result;
        return $result;
    }

    public
    function actualizarClienteProveedorCobroPago($cuentacliente, $parametros)
    {
        extract($parametros);
        $cadena
            = "UPDATE mod_datosmaestros.dat_clienteproveedorcobropago SET
                clasificacion = $cuentacliente->clasificacion
               WHERE (idcuenta = $idcuenta AND idmoneda = $idmoneda AND idclienteproveedor = $idclienteproveedor
                      AND idterminodepago = $idterminodepago AND idestructura = $idestructura)
               RETURNING idclienteproveedorcobropago";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function insertarClienteProveedorCobroPago($cuentacliente, $parametros)
    {
        extract($parametros);
        $cadenainsert = 'INSERT INTO mod_datosmaestros.dat_clienteproveedorcobropago
                            ("idcuenta", "idmoneda", "idclienteproveedor", 
                              "idterminodepago", "clasificacion", "idestructura")
                          VALUES ';
        $cadenavalues = "($idcuenta, $idmoneda, $idclienteproveedor, 
                            $idterminodepago, $cuentacliente->clasificacion, $idestructura)";
        $cadenasql = $cadenainsert . $cadenavalues;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenasql);
        return 1;
    }

    public
    function insertarTerminoPago($cuentacliente, $parametros)
    {
        extract($parametros);
        $cadenainsert = 'INSERT INTO mod_datosmaestros.nom_terminosdepago
                            ("idestructura", "plazo", "idumplazo","aplazos", "mora", 
                                "descventa", "dpp", "predeterminado", "nombre")
                          VALUES ';
        $cadenavalues = "($idestructura, $cuentacliente->plazo, $idumplazo, $aplazos, $mora,
                            $descventa, $dpp, $predeterminado, '$cuentacliente->condicion')
                            RETURNING idterminodepago;";
        $cadenasql = $cadenainsert . $cadenavalues;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenasql)->fetchAll(PDO::FETCH_ASSOC);
        return $res;
    }

    public
    function insertarCuentaBancaria($persona, $parametros, $cuc, $cup)
    {
        extract($parametros);
        $cadenainsert = 'INSERT INTO mod_personaext.dat_cuentabancaria
                            ("idpersona", "numerocuenta", "idbanco", "idmoneda", 
                            "idtipoacreditacionsalario", "codtipoid", "migrado") VALUES ';
        $cadenavaluescuc = '';
        $cadenavaluescup = '';
        $idtipoacreditacionsalario = (empty($persona->expedientefar)) ? $idtipoacreditacionsalarioci : $idtipoacreditacionsalariocm;
        $codtipoid = $idtipoacreditacionsalario;

        if ($cuc) {
            $cadenavaluescuc = "( $persona->idmodpersona, '$persona->cuentabancariacuc', $persona->idbancocuc, $idmonedacuc, 
                                    $idtipoacreditacionsalario, $codtipoid, $migrado )";
        }
        if ($cup) {
            $cadenavaluescup = "( $persona->idmodpersona, '$persona->cuentabancariacup', $persona->idbancomn, $idmonedacup, 
                                    $idtipoacreditacionsalario, $codtipoid, $migrado)";
        }
        if ($cuc && $cup)
            $cadenavalues = $cadenavaluescuc . ', ' . $cadenavaluescup . ';';
        elseif ($cuc)
            $cadenavalues = $cadenavaluescuc . ';';
        elseif ($cup)
            $cadenavalues = $cadenavaluescup . ';';

        $cadenasql = $cadenainsert . $cadenavalues;
        //print_r($cadenasql);die;
        $connA = Doctrine_Manager:: connection();
        $connA->execute($cadenasql);
        return 1;
    }

    public
    function insertarColorPiel($persona, $parametros)
    {
        extract($parametros);
        $cadenainsert = 'INSERT INTO mod_persona.dat_fenotipo 
                            ("idpersona", "idcolorpiel", "migrado")
                          VALUES ';
        $cadenavalues = "($persona->idmodpersona, $persona->idcolorpiel, $migrado)";
        $cadenasql = $cadenainsert . $cadenavalues;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenasql);
        return 1;
    }

    public
    function actualizarColorPiel($persona, $parametros)
    {
        extract($parametros);
        $cadena
            = "UPDATE mod_persona.dat_fenotipo SET 
                migrado = $migrado,
                idcolorpiel = $persona->idcolorpiel
                WHERE (idpersona = $persona->idmodpersona) 
                RETURNING idfenotipo";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function insertarDireccion($persona, $parametros)
    {
        extract($parametros);
        $cadenaselect = "SELECT d.oficial, d.iddireccion
                        FROM mod_persona.dat_direccion d
                        WHERE d.idpersona = $persona->idmodpersona";

        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaselect)
            ->fetchAll(PDO::FETCH_ASSOC);

        $oficial = 1;
        foreach ($res as $key) {
            if ($key['oficial'] == 1) {
                $oficial = 0;
                break;
            }
        }

        $cadenainsert = 'INSERT INTO mod_persona.dat_direccion 
                            ("idpersona", "idprovincia", "idmunicipio", 
                            "direccion", "oficial", "idpais", "migrado")
                          VALUES ';
        $cadenavalues = "($persona->idmodpersona, $persona->iddpaprovincia, $persona->iddpamunicipio,
                            '$persona->direccion', $oficial, $idpais, $migrado)";
        $cadenasql = $cadenainsert . $cadenavalues;
        $res = $connA->execute($cadenasql);
        return 1;
    }

    public
    function actualizarDireccion($persona, $parametros)
    {
        //print_r($parametros);die;
        extract($parametros);
        $cadena
            = "UPDATE mod_persona.dat_direccion SET 
                idpais = $idpais,
                migrado = $migrado,
                direccion = '$persona->direccion'
                WHERE (idpersona = $persona->idmodpersona AND 
                       idprovincia = $persona->iddpaprovincia AND 
                       idmunicipio = $persona->iddpamunicipio) 
                RETURNING iddireccion";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function actualizarDatosContacto($persona, $parametros)
    {
        extract($parametros);
        $correoelectronico = self::stringBuscar($persona->correoelectronico);
        $cadena
            = "UPDATE mod_persona.dat_contacto SET 
                idtipomediocontacto = $idtipomediocontacto,
                idtipocontacto = $idtipocontacto,
                migrado = $migrado
                WHERE (idpersona = $persona->idmodpersona AND 
                        upper(translate(contacto, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like '$correoelectronico') 
                RETURNING idcontacto";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function insertarDatosContacto($persona, $parametros)
    {
        extract($parametros);
        $cadenaselect = "SELECT c.oficial, c.idcontacto
                          FROM mod_persona.dat_contacto c
                          WHERE idpersona = $persona->idmodpersona";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenaselect)
            ->fetchAll(PDO::FETCH_ASSOC);

        $oficial = 1;
        foreach ($res as $key) {
            if ($key['oficial'] == 1) {
                $oficial = 0;
                break;
            }
        }
        $cadenainsert = 'INSERT INTO mod_persona.dat_contacto 
                            ("contacto", "oficial", "idtipomediocontacto",
                             "idtipocontacto", "idpersona", "migrado")
                          VALUES ';
        $cadenavalues = "('$persona->correoelectronico', $oficial, $idtipomediocontacto,
                            $idtipocontacto, $persona->idmodpersona, $migrado)";
        $cadenasql = $cadenainsert . $cadenavalues;
        $res = $connA->execute($cadenasql);
        return 1;
    }

    public
    function actualizarDatosNacimiento($persona, $parametros)
    {
        extract($parametros);
        $cadena
            = "UPDATE mod_persona.dat_datosnacimiento SET 
                fechanacimiento = '$fechanacimiento',
                migrado = $migrado
                WHERE (idpersona = $persona->idmodpersona) 
                RETURNING iddatosnacimiento";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function insertarDatosNacimiento($persona, $parametros)
    {
        extract($parametros);
        $cadenainsert = 'INSERT INTO mod_persona.dat_datosnacimiento 
                            ("idpersona", "fechanacimiento", "migrado")
                          VALUES ';
        $cadenavalues = "($persona->idmodpersona, '$fechanacimiento', $migrado )
                             RETURNING idpersona;";
        $cadenasql = $cadenainsert . $cadenavalues;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenasql);
        return 1;
    }

    public
    function obtenerFechaNacimientoCI($numero_identidad_civil)
    {
        $FECHAV = substr($numero_identidad_civil, 0, 6);
        $SIGLO = substr($numero_identidad_civil, 6, 1);

        if ($SIGLO <= 5) {
            $FECHAV = "19" . $FECHAV;
        } else if ($SIGLO == 9) {
            $FECHAV = "18" . $FECHAV;
        } else {
            $FECHAV = "20" . $FECHAV;
        }
        $year = substr($FECHAV, 0, 4);
        $month = substr($FECHAV, 4, 2);
        $day = substr($FECHAV, 6, 2);

        $FECHAV = strtotime(date((string)($day . '-' . $month . '-' . $year)));
        $fechanacimiento = date('d-M-Y', $FECHAV);

        return $fechanacimiento;
    }

    public
    function validarDatosPersona(&$personas, &$parametros)
    {
        $addmilitares = TempPersona::verificarExisteExpedienteFar();
        $addmilitares = (isset($addmilitares[0])) ? 1 : 0;
        $tipoidentidad = self::validarIdTipoIdentidad($addmilitares);
        if (is_array($tipoidentidad)) {
            $parametros['idtipodocidentidadcivil'] = $tipoidentidad['idtipodocidentidadcivil'];
            $parametros['idtipodocidentidadfar'] = (isset($tipoidentidad['idtipodocidentidadfar'])) ? $tipoidentidad['idtipodocidentidadfar'] : null;

            $idtipocontacto = self::obtenerIdTipoContactoTrabajo();
            $parametros['idtipocontacto'] = (isset($idtipocontacto[0])) ? $idtipocontacto[0]['idtipocontacto'] : null;

            $idtipomediocontacto = self::obtenerIdTipoMedioContactoCorreo();
            $parametros['idtipomediocontacto'] = (isset($idtipomediocontacto[0])) ? $idtipomediocontacto[0]['idtipomediocontacto'] : null;

            $idmoneda = self::validarMoneda();
            if (is_array($idmoneda)) {
                $parametros['idmonedacup'] = $idmoneda['idmonedacup'];
                $parametros['idmonedacuc'] = $idmoneda['idmonedacuc'];
                $idtipoacreditacionsalario = self::validarIdTipoAcreditacionSalario($addmilitares);
                if (is_array($idtipoacreditacionsalario)) {
                    $parametros['idtipoacreditacionsalarioci'] = $idtipoacreditacionsalario['idtipoacreditacionsalarioci'];
                    $parametros['idtipoacreditacionsalariocm'] = (isset($idtipoacreditacionsalario['idtipoacreditacionsalariocm'])) ? $idtipoacreditacionsalario['idtipoacreditacionsalariocm'] : null;
                    extract($parametros);
                    $result = -1;
                    $errores = 0;
                    foreach ($personas as $val => $key) {
                        try {
                            if ($key->iddatosnomenclador != $array_ests_uri['validadook']) {
                                $ci = $key->idsuin;
                                if (!empty($ci)) {
                                    $validarci = self::validarCI($ci);
                                    if (!$validarci) {
                                        $personas[$val]->iddatosnomenclador = $array_ests_uri['erroridsuin'];
                                        continue;
                                    }
                                }
                                $cm = $key->expedientefar;
                                if (!empty($cm)) {
                                    if (!self::validarCM($cm)) {
                                        $personas[$val]->iddatosnomenclador = $array_ests_uri['errorexpedientefar'];
                                        continue;
                                    }
                                }
                                $correo = $key->correoelectronico;
                                if (!empty($correo)) {
                                    if (empty($parametros['idtipocontacto'])) {
                                        $personas[$val]->iddatosnomenclador = $array_ests_uri['erroridtipocontacto'];
                                        continue;
                                    }
                                    if (empty($parametros['idtipomediocontacto'])) {
                                        $personas[$val]->iddatosnomenclador = $array_ests_uri['erroridtipomediocontacto'];
                                        continue;
                                    }
                                }
                                $colorpiel = $key->colorpiel;
                                if (!empty($colorpiel)) {
                                    $idcolorpiel = self::obtenerIdColorPiel($colorpiel);
                                    if (isset($idcolorpiel[0])) {
                                        $key->idcolorpiel = $idcolorpiel[0]['idcolorpiel'];
                                    } else {
                                        $personas[$val]->iddatosnomenclador = $array_ests_uri['erroridcolorpiel'];
                                        continue;
                                    }
                                }
                                $cuentabancariacuc = $key->cuentabancariacuc;
                                if (!empty($cuentabancariacuc)) {
                                    if (empty($parametros['idmonedacuc'])) {
                                        $personas[$val]->iddatosnomenclador = $array_ests_uri['errormonedacuc'];
                                        continue;
                                    }
                                }
                                $cuentabancariacup = $key->cuentabancariacup;
                                if (!empty($cuentabancariacup)) {
                                    if (empty($parametros['idmonedacup'])) {
                                        $personas[$val]->iddatosnomenclador = $array_ests_uri['errormonedacup'];
                                        continue;
                                    }
                                }
                                $bancocuc = $key->bancocuc;
                                if (!empty($bancocuc)) {
                                    $idbancocuc = self::obtenerIdBanco($bancocuc);
                                    if (isset($idbancocuc[0])) {
                                        $key->idbancocuc = $idbancocuc[0]['idbanco'];
                                    } else {
                                        $personas[$val]->iddatosnomenclador = $array_ests_uri['errorbancocuc'];
                                        continue;
                                    }
                                }
                                $bancocup = $key->bancocup;
                                if (!empty($bancocup)) {
                                    $idbancocup = self::obtenerIdBanco($bancocup);
                                    if (isset($idbancocup[0])) {
                                        $key->idbancomn = $idbancocup[0]['idbanco'];
                                    } else {
                                        $personas[$val]->iddatosnomenclador = $array_ests_uri['errorbancomn'];
                                        continue;
                                    }
                                }
                                $direccion = $key->direccion;
                                if (!empty($direccion)) {
                                    $provincia = str_replace('_', ' ', $key->provincia);
                                    $municipio = str_replace('_', ' ', $key->municipio);
                                    if (empty($provincia) || empty($municipio)) {
                                        if (empty($provincia)) $personas[$val]->provincia = 'NULL';
                                        if (empty($municipio)) $personas[$val]->municipio = 'NULL';
                                        $personas[$val]->iddatosnomenclador = $array_ests_uri['camposvacios'];
                                        continue;
                                    } else {
                                        $idprovincia = self::obtenerIdProvincia($provincia);
                                        if (isset($idprovincia[0])) {
                                            $idprovincia = $idprovincia[0]['iddpt'];
                                            $key->iddpaprovincia = $idprovincia;

                                            $idmunicipio = self::obtenerIdMunicipio($municipio, $idprovincia);
                                            if (isset($idmunicipio[0])) {
                                                $key->iddpamunicipio = $idmunicipio[0]['iddpt'];
                                            } else {
                                                $personas[$val]->iddatosnomenclador = $array_ests_uri['errordpamunicipio'];
                                                continue;
                                            }

                                        } else {
                                            $personas[$val]->iddatosnomenclador = $array_ests_uri['errordpaprovincia'];
                                            continue;
                                        }
                                    }
                                }
                                $personas[$val]->iddatosnomenclador = $array_ests_uri['validadook'];
                                $result = 1;
                            }
                        } catch (Exception $e) {
                            if ($parametros['desarrollo']) print_r($e->getMessage());
                            else ob_clean();
                            $personas[$val]->iddatosnomenclador = $array_ests_uri['errorvalidar'];
                            $errores = 1;
                            continue;
                        }
                        $cont++;
                        if ($cont % $save == 0) $personas->save();
                    }
                    $personas->save();
                    $result = ($errores) ? 0 : $result;
                    return $result;
                } else return $idtipoacreditacionsalario; //Error nomenclador tipo acreditacion salario
            } else return $idmoneda; //Error nomenclador de moneda
        } else return $tipoidentidad; //Error nomenclador tipo de identidad
    }

    public
    function adicionarDocIdentidad($persona, $parametros, $civil, $far)
    {
        extract($parametros);
        $cadenainsert = 'INSERT INTO mod_persona.dat_docidentidad
                            ("idpersona", "numero", "idtipodocidentidad", "principal", "migrado") VALUES ';
        $cadenavaluescivil = '';
        $cadenavaluesfar = '';
        if ($civil) {
            $principal = (empty($persona->expedientefar)) ? 1 : 0;
            $cadenavaluescivil = "( $persona->idmodpersona, '$persona->idsuin', $idtipodocidentidadcivil, $principal, $migrado)";
        }
        if ($far) {
            $principal = 1;
            $cadenavaluesfar = "( $persona->idmodpersona, '$persona->idsuin', $idtipodocidentidadfar, $principal, $migrado)";
        }
        if ($civil && $far)
            $cadenavalues = $cadenavaluescivil . ', ' . $cadenavaluesfar . ';';
        elseif ($civil)
            $cadenavalues = $cadenavaluescivil . ';';
        elseif ($far)
            $cadenavalues = $cadenavaluesfar . ';';

        $cadenasql = $cadenainsert . $cadenavalues;
        $connA = Doctrine_Manager:: connection();
        $connA->execute($cadenasql);
        return 1;
    }

    public
    function actualizarDocIdentidad($persona, $parametros)
    {
        extract($parametros);
        $connA = Doctrine_Manager:: connection();
        $updatecivil = 0;
        $updatefar = 0;
        if (!empty($persona->idsuin)) {
            $principal = (empty($persona->expedientefar)) ? 1 : 0;
            $cadenaupdatecivil
                = "UPDATE mod_persona.dat_docidentidad SET 
                principal = $principal,
                migrado = $migrado,
                numero = $persona->idsuin
                WHERE (idpersona = $persona->idmodpersona and
                      idtipodocidentidad = $idtipodocidentidadcivil) 
                RETURNING iddocidentidad";

            $res = $connA->execute($cadenaupdatecivil);
            $result = $res->fetchAll(PDO::FETCH_ASSOC);

            if (isset($result[0])) $updatecivil = 1;
        }
        if (!empty($persona->expedientefar)) {
            $principal = 1;
            $cadenaupdatefar
                = "UPDATE mod_persona.dat_docidentidad SET 
                principal = $principal,
                migrado = $migrado,
                numero = $persona->expedientefar
                WHERE (idpersona = $persona->idmodpersona and
                      idtipodocidentidad = $idtipodocidentidadfar) 
                RETURNING iddocidentidad";

            $res = $connA->execute($cadenaupdatefar);
            $result = $res->fetchAll(PDO::FETCH_ASSOC);
            if (isset($result[0])) $updatefar = 1;
        }

        if (!$updatecivil && !empty($persona->idsuin) && !$updatefar && !empty($persona->expedientefar))
            self::adicionarDocIdentidad($persona, $parametros, 1, 1);
        else if (!$updatecivil && !empty($persona->idsuin))
            self::adicionarDocIdentidad($persona, $parametros, 1, 0);
        else if (!$updatefar && !empty($persona->expedientefar))
            self::adicionarDocIdentidad($persona, $parametros, 0, 1);

        return 1;
    }

    public
    function mapearSexo($sexo)
    {
        $sexo = self::stringBuscar($sexo);
        if ($sexo == 'M' || $sexo == 'MASCULINO' || $sexo == 'HOMBRE' || $sexo == 'VARON')
            $sexo = 1;
        else $sexo = 0;
        return $sexo;
    }

    public
    function validarCM($numero_expediente_far)
    {
        $reg = '/^\d\d\d\d\d\d$/';
        if (preg_match($reg, $numero_expediente_far)) return true;
        else return false;
    }

    public
    function validarCI($numero_identidad_civil)
    {
        $validador = false;
        $reg = '/^\d\d\d\d\d\d\d\d\d\d\d$/';
        if (preg_match($reg, $numero_identidad_civil)) {
            $FECHAV = substr($numero_identidad_civil, 0, 6);
            $SIGLO = substr($numero_identidad_civil, 6, 1);

            if ($SIGLO <= 5) {
                $FECHAV = "19" . $FECHAV;
            } else if ($SIGLO == 9) {
                $FECHAV = "18" . $FECHAV;
            } else {
                $FECHAV = "20" . $FECHAV;
            }

            $year = intval(substr($FECHAV, 0, 4), 10);
            $month = intval(substr($FECHAV, 4, 2), 10) - 1;
            $day = intval(substr($FECHAV, 6, 2), 10);

            if ($year < 1800 || $year > 2100 || $month < 0 || $month > 11 || $day < 0 || $day > 31) {
                $validador = false;
            } else {
                $FECHAV = date((string)($day . '-' . $month . '-' . $year));
                $TODAY = date('d-m-Y');

                if (strtotime($FECHAV) > strtotime($TODAY)) {
                    $validador = false;
                } else {
                    $ID = (($numero_identidad_civil{0}) * 2) + (($numero_identidad_civil{1}) * 1) + (($numero_identidad_civil{2}) * 9) +
                        (($numero_identidad_civil{3}) * 8) + (($numero_identidad_civil{4}) * 7) + (($numero_identidad_civil{5}) * 6) +
                        (($numero_identidad_civil{6}) * 5) + (($numero_identidad_civil{7}) * 4) + (($numero_identidad_civil{8}) * 3) +
                        (($numero_identidad_civil{9}) * 2);
                    $ID = (10 - ($ID % 10)) % 10;
                    if ($ID != $numero_identidad_civil{10}) {
                        $validador = false;
                    } else {
                        $validador = true;
                    }
                }
            }
        }
        return $validador;
    }

    public
    function obtenerIdPersona($parametros)
    {
        extract($parametros);
        $cadena = "SELECT p.idpersona
                    FROM mod_persona.dat_persona p
                    WHERE (p.idsuin = '$idsuin'";
        if (!empty($nombre)) {
            $nombre = self::stringBuscar($nombre);
            $cadena .= " AND upper(translate(p.nombre, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like '%$nombre%' ";
        }
        if (!empty($apellido)) {
            $apellido = self::stringBuscar($apellido);
            $cadena .= " AND upper(translate(p.papel, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like '%$apellido%' ";
        }
        $cadena .= ')';
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll();
        //print_r($result);die;
        return $result;
    }

    public
    function insertarPersona($persona, $parametros)
    {
        extract($parametros);
        $cadenainsert = 'INSERT INTO mod_persona.dat_persona 
                            ("nombre", "snombre", "papel", "sapel", 
                            "sexo", "idsuin", "migrado")
                          VALUES ';
        $cadenavalues = "('$persona->nombre', '$persona->segnombre', '$persona->apellido', '$persona->segapellido',
                           $sexo, '$idsuin', $migrado )
                             RETURNING idpersona;";
        $cadenasql = $cadenainsert . $cadenavalues;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenasql);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function actualizarPersona($persona, $params)
    {
        extract($params);
        $cadena
            = "UPDATE  mod_persona.dat_persona SET 
                nombre = '$persona->nombre',
                papel = '$persona->apellido',
                sexo = $sexo,
                migrado = $migrado";
        $cadena .= (!empty($persona->segnombre)) ? ",snombre = '$persona->segnombre'" : ' ';
        $cadena .= (!empty($persona->segapellido)) ? ",sapel = '$persona->segapellido'" : ' ';
        $cadena .= " WHERE (idpersona = $idpersona) 
                RETURNING idpersona";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;

    }

    public
    function actualizarPersonaOld($persona, $params)
    {
        extract($params);
        $cadena
            = "UPDATE  mod_persona.dat_persona SET 
                nombre = '$persona->nombre',
                snombre = NULLIF('$persona->segnombre','')::VARCHAR,
                papel = '$persona->apellido',
                sapel =  NULLIF('$persona->segapellido','')::VARCHAR,
                sexo = $sexo,
                migrado = $migrado
                WHERE (idpersona = $idpersona) 
                RETURNING idpersona";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;

    }

    public
    function obtenerIdColorPiel($color)
    {
        $color = self::stringBuscar($color);
        $cadena = "select cp.idcolorpiel
                    from mod_persona.nom_colorpiel cp
                    where upper(translate(cp.denominacion, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like" . "'%$color%'";
        $connA = Doctrine_Manager:: connection();
        $idmedio = $connA->execute($cadena)->fetchAll();
        return $idmedio;
    }

    public
    function validarIdTipoAcreditacionSalario($addmilitares)
    {
        $idtipoacreditacion = self::obtenerIdTipoAcreditacionSalario();
        if (isset($idtipoacreditacion[0])) {
            foreach ($idtipoacreditacion as $value => $k) {
                if ($k['abreviatura'] == 'CI')
                    $data['idtipoacreditacionsalarioci'] = $k['idtipoacreditacionsalario'];
                if ($k['abreviatura'] == 'CM')
                    $data['idtipoacreditacionsalariocm'] = $k['idtipoacreditacionsalario'];
            }
            if (!isset($data['idtipoacreditacionsalarioci'])) return 25; //No existe el nomenclador tipo de acreditacion del salario: CI
            if ($addmilitares && !isset($data['idtipoacreditacionsalariocm'])) return 29; //No existe el nomenclador tipo de acreditacion del salario: CM
            else return $data;
        } else  return 24; //No existen el nomenclador tipo de acreditacion del salario

    }

    public
    function obtenerIdTipoAcreditacionSalario()
    {
        /*$cadena = "select tas.idtipoacreditacionsalario,
                      upper(translate(tas.abreviatura, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) as abreviatura
                  from mod_personaext.nom_tipoacreditacionsalario tas
                  where ((upper(translate(tas.abreviatura, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like 'CI')
                      or
                        (upper(translate(tas.abreviatura, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like 'CM'))";*/

        $cadena = 'select tas.idtipoacreditacionsalario,
                      upper(translate(tas.abreviatura, \'ÁÉÍÓÚáéíóúñÑ\', \'AEIOUaeiounN\')) as abreviatura
                  from mod_personaext.nom_tipoacreditacionsalario tas
                  where (abreviatura like \'CI\' or abreviatura like \'CM\')';
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll();
        //print_r($cadena);die;
        return $result;
    }

    public
    function validarMoneda()
    {
        $moneda = self::obtenerIdMoneda();
        if (isset($moneda[0])) {
            foreach ($moneda as $value => $k) {
                if ($k['codigoiso'] == 'CUP')
                    $data['idmonedacup'] = $k['idmoneda'];
                if ($k['codigoiso'] == 'CUC')
                    $data['idmonedacuc'] = $k['idmoneda'];
            }
            if (!isset($data['idmonedacup'])) return 26; //No existe la modena CUP
            if (!isset($data['idmonedacuc'])) return 27; //No existe la modena CUC
            return $data;
        } else  return 23; //No existen la monedas CUP y CUC

    }

    public
    function validarIdTipoIdentidad($addmilitares)
    {
        $tipoidentidad = self::obtenerIdTipoIdentidad();
        if (isset($tipoidentidad[0])) {
            foreach ($tipoidentidad as $key => $val) {
                if ($val['denominacion'] == 'CARNE DE IDENTIDAD')
                    $data['idtipodocidentidadcivil'] = $val['idtipodocidentidad'];
                if ($val['denominacion'] == 'CARNE DE IDENTIDAD FAR')
                    $data['idtipodocidentidadfar'] = $val['idtipodocidentidad'];
            }
            if (!isset($data['idtipodocidentidadcivil'])) return 22; //No existe el nomenclador tipo de identidad: CARNÉ DE IDENTIDAD
            if ($addmilitares && !isset($data['idtipodocidentidadfar'])) return 28; //No existe el nomenclador tipo de identidad: CARNÉ DE IDENTIDAD FAR
            else return $data;
        } else return 21; //No existe el nomenclador tipo de identidad
    }

    public
    function obtenerIdTipoIdentidad()
    {
        $cadena = "select ti.idtipodocidentidad, upper(translate(ti.denominacion, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) as denominacion
                  from mod_persona.nom_tipodocidentidad ti
                  where ((upper(translate(ti.denominacion, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like '%CARNE DE IDENTIDAD%'))";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll();
        //print_r($result);die;
        return $result;
    }

    public
    function obtenerIdTipoMedioContactoCorreo()
    {
        $cadena = "select mc.idtipomediocontacto
                    from mod_persona.nom_tipomediocontacto mc
                    where ((upper(translate(mc.denominacion, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like 'CORREO'))";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll();
        //print_r($result);die;
        return $result;
    }

    public
    function obtenerIdTipoContactoTrabajo()
    {
        $cadena = "select tp.idtipocontacto
                    from mod_persona.nom_tipocontacto tp
                    where ((upper(translate(tp.denominacion, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN')) like 'TRABAJO'))";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll();
        //print_r($result);die;
        return $result;
    }

    public
    function date_is_valid($str)
    {
        if (substr_count($str, '/') == 2) {
            list($d, $m, $y) = explode('/', $str);
            return checkdate($m, $d, sprintf('%04u', $y));
        }
        return false;
    }

    public
    function validarIdEstados()
    {
        $denom[0] = 'A LA FIRMA';
        $denom[1] = 'APROBADO';
        $idestados = self::obtenerIdEstados($denom);
        if (count($idestados) == 2) {
            return $idestados;
        } else if (isset($idestados[0])) {
            $nombrestado = self::stringBuscar($idestados[0][0]['nombre']);
            if ($nombrestado == $denom[0]) {
                return 16;//no existe el estado: Aprobado
            } else {
                return 17;//no existe el estado: A la firma
            }
        } else {
            return 18;//No existe el nomemclador de estados
        }
    }

    public
    function unidadDeTiempo($tiempo)
    {
        $tiempo = self::stringBuscar($tiempo);
        if ($tiempo == 'ANO') return 3;
        elseif ($tiempo == 'MES') return 2;
        elseif ($tiempo == 'DIAS') return 1;
        else return 0;
    }

    public
    function calcularFechaFin($parametros) //fechafirma , unidadtiempo, vigencia
    {
        extract($parametros);
        if (!empty($fechafirma)) {
            $fechafirma = strtotime(
                date(str_replace("/", "-", $fechafirma))
            );
            $fechafirma = date('d-M-Y', $fechafirma);
            switch ($unidadtiempo) {
                case 1: //dias
                    $fechafin = date(
                        'd-M-Y', strtotime($fechafirma . "+ " . $vigencia . " days")
                    );
                    break;
                case 2: //mes
                    $fechafin = date(
                        'd-M-Y', strtotime($fechafirma . "+ " . $vigencia . " month")
                    );
                    break;
                case 3: //anno
                    $fechafin = date(
                        'd-M-Y', strtotime($fechafirma . "+ " . $vigencia . " year")
                    );
                    break;
                default:
                    $fechafin = null;
                    break;

            }

        } else {
            $fechafirma = null;
            $fechafin = null;
        }
        $data['fechafirma'] = $fechafirma;
        $data['fechafin'] = $fechafin;
        return $data;
    }

    public
    function obtenerNumeroJson($nocontrato)
    {
        if (!empty($nocontrato)) {
            $nocontrato = explode('-', $nocontrato);
            $result = '{"numero":[';
            $cant = count($nocontrato);
            for ($i = 0; $i < $cant; $i++) {
                $result .= '"' . $nocontrato[$i] . '"';
                if ($i != $cant - 1) $result .= ',"-",';
            }
            $result .= '],"suplemento":0}';
            return $result;
        } else return 'null';
    }

    public
    function obtenerIdProvincia($provincia)
    {
        $provincia = self::stringBuscar($provincia);
        $cadena = 'select dpt.iddpt
                  from mod_datosmaestros.nom_dpt dpt
                  where upper(translate(dpt.denominacion, \'ÁÉÍÓÚáéíóúñÑü\', \'AEIOUaeiounNu\'))
                              like ' . "'%$provincia%'" . 'and dpt.iddpt = dpt.idpadre';
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll();
        //print_r($result);die;
        return $result;
    }

    public
    function obtenerIdMunicipio($municipio, $idprovincia)
    {
        $municipio = self::stringBuscar($municipio);
        $cadena = 'select dpt.iddpt
                    from mod_datosmaestros.nom_dpt dpt
                    where upper(translate(dpt.denominacion, \'ÁÉÍÓÚáéíóúñÑü\', \'AEIOUaeiounNu\'))
                    like ' . "'%$municipio%'" . "and dpt.idpadre = $idprovincia";
        $connA = Doctrine_Manager:: connection();
        $result = $connA->execute($cadena)->fetchAll();
        //print_r($result);die;
        return $result;
    }

    public
    function obtenerIdMoneda()
    {
        $cadena = 'select m.idmoneda, m.codigoiso
                    from mod_datosmaestros.nom_moneda m
                    where (m.codigoiso = \'CUP\' or m.codigoiso = \'CUC\' )';
        $connA = Doctrine_Manager:: connection();
        $moneda = $connA->execute($cadena)->fetchAll();
        return $moneda;
    }

    public
    function obtenerIdBanco($banco)
    {
        $banco = self::stringBuscar($banco);
        $cadena = 'select b.idbanco
                    from mod_datosmaestros.nom_banco b
                    where (upper(translate(b.nombre, \'ÁÉÍÓÚáéíóúñÑ\', \'AEIOUaeiounN\')) 
                              like ' . "'%$banco%'" . ' or upper(translate(b.abreviatura, \'ÁÉÍÓÚáéíóúñÑ\', \'AEIOUaeiounN\')) 
                              like ' . "'%$banco%')";
        //print_r($cadena);die;
        $connA = Doctrine_Manager:: connection();
        $idbanco = $connA->execute($cadena)->fetchAll();
        return $idbanco;
    }

    public
    function obtenerIdNumCuenta($numerocuenta)
    {
        $cadena = 'select cbc.idcuentabancliente
                    from mod_datosmaestros.dat_cuentabanccliente cbc
                    where cbc.numerocuenta = ' . "'$numerocuenta'";
        $connA = Doctrine_Manager:: connection();
        $idcuenta = $connA->execute($cadena)->fetchAll();
        return $idcuenta;
    }

    public
    function obtenerIdSucursal($sucursal, $idbanco)
    {
        if (is_numeric($sucursal)) {
            $comparar = "s.numero ='$sucursal'";
        } else {
            $sucursal = self::stringBuscar($sucursal);
            $comparar = "upper(translate(s.numero, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN'))  like '%$sucursal%'";
        }
        $cadena = 'SELECT s.idsucursal
                    FROM mod_datosmaestros.nom_sucursal s
                    WHERE (s.idbanco =' . "'$idbanco' AND " . $comparar . ')';

        $connA = Doctrine_Manager:: connection();
        $idsucursal = $connA->execute($cadena)->fetchAll();
        return $idsucursal;
    }

    public
    function obtenerIdContacto($nombre, $ci)
    {
        $nombre = self::stringBuscar($nombre);
        $cadena = 'SELECT c.idcontacto
                    FROM mod_datosmaestros.nom_contacto c
                    WHERE upper(translate(c.nombre, \'ÁÉÍÓÚáéíóúñÑ\', \'AEIOUaeiounN\'))  like' . "'%$nombre%'";
        $connA = Doctrine_Manager:: connection();
        $idcontacto = $connA->execute($cadena)->fetchAll();
        return $idcontacto;
    }

    public
    function obtenerIdClienteProveedorEntidad($idclienteproveedor, $idestructura)
    {
        $cadena = 'SELECT cpe.idclienteproveedorentidad
                    from mod_datosmaestros.dat_clienteproveedorentidad cpe
                    inner JOIN mod_datosmaestros.nom_clientesproveedor cp on (cpe.idclienteproveedor = cp.idclientesproveedores)
                    where (cpe.idestructuracomun = ' . "'$idestructura'" . ' and cp.idclientesproveedores = ' . "'$idclienteproveedor'" . ')';
        $connA = Doctrine_Manager:: connection();
        $idclienteproveedorentidad = $connA->execute($cadena)->fetchAll();
        return $idclienteproveedorentidad;
    }

    public
    function obtenerIdCuenta($idestructura, $cuentacontable)
    {
        $cadena = 'SELECT c.idcuenta, c.idmoneda, t.idtasa
                    FROM mod_contabilidad.nom_cuenta c
                    INNER JOIN mod_datosmaestros.dat_tasa t on (c.idmoneda = t.idmoneda)
                    WHERE (t.idestructuracomun = ' . "'$idestructura'" . ' and c.concatcta = ' . "'$cuentacontable'" . ')';
        $connA = Doctrine_Manager:: connection();
        $cuenta = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $cuenta;
    }

    public
    function obtenerIdCuentaCliente($cuentacontable)
    {
        $cadena = 'SELECT c.idcuenta, c.idmoneda, c.descripcion
                    FROM mod_contabilidad.nom_cuenta c
                    WHERE (c.concatcta = ' . "'$cuentacontable'" . ')';
        $connA = Doctrine_Manager:: connection();
        $cuenta = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $cuenta;
    }

    public
    function obtenerIdTerminoPago($idestructura, $idcuenta, $idclienteproveedor)
    {
        $cadena = 'SELECT cpcp.idterminodepago
                    FROM mod_datosmaestros.dat_clienteproveedorcobropago cpcp
                    WHERE (cpcp.idclienteproveedor = ' . "'$idclienteproveedor'" . ' and cpcp.idcuenta = ' . "'$idcuenta'" . ' and cpcp.idestructura = ' . "'$idestructura'" . ')';
        //print_r($cadena);die;
        $connA = Doctrine_Manager:: connection();
        $terminopago = $connA->execute($cadena)->fetchAll(PDO::FETCH_ASSOC);
        return $terminopago;
    }

    public
    function obtenerIdDerechoObligacion($cuenta)
    {
        $fechaemision = strtotime(
            date(str_replace("/", "-", $cuenta->fechaemision))
        );
        $fechaemision = date('d-M-Y', $fechaemision);
        $cadena
            = "SELECT ddo.idderechouobligacion
                    FROM mod_cobroypago.dat_derechouobligacion ddo
                    WHERE (ddo.idtipo = {$cuenta->tipoobligacion} and
                          ddo.importemb = {$cuenta->importependiente} and
                          ddo.idestructuracomun = {$cuenta->idclienteproveedorentidad} and
                          ddo.fechaemision = '$fechaemision')";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function insertarDerechoObligacion($cuenta, $parametros)
    {
        extract($parametros);
        $fechaemision = strtotime(
            date(str_replace("/", "-", $cuenta->fechaemision))
        );
        $fechaemision = date('d-M-Y', $fechaemision);
        $idclienteproveedorcobropago = ($cuenta->tipodeudoracreedor == '3') ? null : $cuenta->idclienteproveedor;

        $cadenainsert = 'INSERT INTO mod_cobroypago.dat_derechouobligacion 
                            ("numero", "comentario", "fechaemision", "importemb", "pagadomb", 
                            "idestadodocumento", "idestadodcop", "idcondicionpago", "idtipo", "idtipodocumento", 
                            "idestructuracomun", "idperiodo", "idcuenta", "fechaentrega", "cargainicial", 
                             "idsubsistema", "idclienteproveedorfiscal", "idtipoderechouobligacion", "idclienteproveedor", "idclienteproveedorcobropago")
                          VALUES ';
        $cadenavalues = "('$cuenta->numdocumento','$cuenta->comentario', '$fechaemision', $cuenta->importependiente, 0,
                          $idestadodocumento, $idestadodcop, $cuenta->idterminodepago, $cuenta->tipoobligacion, $idtipodocumento,
                          $idestructura, $idperiodo, $cuenta->idcuenta, '$fechaemision', $cargainicial,
                          $idsubsistema, $cuenta->idclienteproveedor, $cuenta->tipodeudoracreedor, $cuenta->idclienteproveedor,  NULLIF('$idclienteproveedorcobropago','')::NUMERIC)
                          RETURNING idderechouobligacion;";
        $cadenasql = $cadenainsert . $cadenavalues;
        //print_r($cadenasql);die;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenasql);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function actualizarDerechoObligacion($cuenta, $parametros)
    {
        extract($parametros);
        $fechaemision = strtotime(
            date(str_replace("/", "-", $cuenta->fechaemision))
        );
        $fechaemision = date('d-M-Y', $fechaemision);
        $cadena
            = "UPDATE mod_cobroypago.dat_derechouobligacion SET 
                comentario = '$cuenta->comentario',
                idestadodocumento = $idestadodocumento,
                idestadodcop = $idestadodcop,
                idcondicionpago = NULLIF('$cuenta->idterminodepago','')::NUMERIC ,
                idperiodo = $idperiodo,
                idcuenta = $cuenta->idcuenta,
                cargainicial = $cargainicial,
                idsubsistema = $idsubsistema,
                idclienteproveedorfiscal = $cuenta->idclienteproveedor,
                idclienteproveedor = $cuenta->idclienteproveedor,
                idtipoderechouobligacion = $cuenta->tipodeudoracreedor,
                fechaentrega = '$fechaemision'
                WHERE (numero = '$cuenta->numdocumento' and
                      idtipo = $cuenta->tipoobligacion and
                      importemb = $cuenta->importependiente and
                      fechaemision = '$fechaemision') 
                RETURNING idderechouobligacion";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function obtenerIdOperacionCP($idderechouobligacion)
    {
        $cadena
            = "SELECT ocp.idoperacion
                    FROM mod_cobroypago.dat_operacioncp ocp
                    WHERE (ocp.idderechouobligacion = $idderechouobligacion)";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function actualizarOperacionCP($cuenta, $parametros)
    {
        extract($parametros);
        $cadena
            = "UPDATE mod_cobroypago.dat_operacioncp SET
               idmoneda = $cuenta->idmoneda,
               tasa = $cuenta->idtasa,
               idoperacioncontable = $idoperacioncontable,
               importemb = $cuenta->importependiente,
               importemo = $cuenta->importependiente,
               liquidadomb = 0,
               liquidadomo = 0
               WHERE (idderechouobligacion = $idderechoobligacion)
               RETURNING idoperacion";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function adicionarOperacionCP($cuenta, $parametros)
    {
        extract($parametros);
        $cadenainsert
            = 'INSERT INTO mod_cobroypago.dat_operacioncp 
              ("idmoneda", "tasa", "idoperacioncontable", "importemb", 
              "importemo", "liquidadomb", "liquidadomo", "idderechouobligacion") VALUES ';
        $cadenavalues = "($cuenta->idmoneda,$cuenta->idtasa, $idoperacioncontable, $cuenta->importependiente,
                          $cuenta->importependiente, 0, 0, $idderechoobligacion);";
        $cadenasql = $cadenainsert . $cadenavalues;
        //print_r($cadenasql);die;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenasql);
        return 1;
    }

    public
    function obtenerIdTipoContrato($tipocontrato)
    {
        $tipocontrato = self::stringBuscar($tipocontrato);
        $cadena = 'SELECT tc.idtipocontrato
                    FROM mod_crmcontratacion.dat_tipocontrato tc
                    WHERE upper(translate(tc.denominacion, \'ÁÉÍÓÚáéíóúñÑ\', \'AEIOUaeiounN\'))  like' . "'%$tipocontrato%'";
        $connA = Doctrine_Manager:: connection();
        $idcontrato = $connA->execute($cadena)->fetchAll();
        return $idcontrato;
    }

    public
    function obtenerIdPersonaOld($ci)
    {
        $cadena
            = 'SELECT p.idpersona
                FROM mod_persona.dat_persona p
                WHERE (p.idsuin =' . "'$ci'" . ')';
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena)->fetchAll();
        return $res;
    }

    public
    function obtenerIdMedioPago($denominacion)
    {
        $denominacion = self::stringBuscar($denominacion);
        $cadena = 'SELECT mp.idmediodepago
                    FROM mod_crmcontratacion.nom_mediodepago mp
                    WHERE upper(translate(mp.nombre, \'ÁÉÍÓÚáéíóúñÑ\', \'AEIOUaeiounN\'))  like' . "'%$denominacion%'";
        $connA = Doctrine_Manager:: connection();
        $idmedio = $connA->execute($cadena)->fetchAll();
        return $idmedio;
    }

    public
    function obtenerIdCondicionPago($denominacion)
    {
        $denominacion = self::stringBuscar($denominacion);
        $cadena = 'SELECT tp.idterminodepago
                    FROM mod_datosmaestros.nom_terminosdepago tp
                    WHERE upper(translate(tp.nombre, \'ÁÉÍÓÚáéíóúñÑ\', \'AEIOUaeiounN\'))  like' . "'%$denominacion%'";
        //print_r($cadena);die;
        $connA = Doctrine_Manager:: connection();
        $idcondicion = $connA->execute($cadena)->fetchAll();
        return $idcondicion;
    }

    public
    function obtenerIdContrato($parametros)
    {
        extract($parametros);
        $cadena = "SELECT c.idcontrato
                    FROM mod_crmcontratacion.dat_contrato c
                    WHERE (c.numerocontrato = '$nocontratoproveedor' AND c.idclienteproveedor = '$idclienteproveedor' 
                    AND c.idestructuracomun = '$idestructura')";
        //print_r($cadena);die;
        $connA = Doctrine_Manager:: connection();
        $idcondicion = $connA->execute($cadena)->fetchAll();
        return $idcondicion;
    }

    public
    function obtenerIdEstados($arraydenominacion)
    {
        $cadena = "SELECT e.idestado, UPPER (e.nombre) as nombre
                    FROM mod_crmcontratacion.nom_estado e
                    WHERE ((upper(translate(e.nombre, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN'))  like '%{$arraydenominacion[0]}%') OR
                          (upper(translate(e.nombre, 'ÁÉÍÓÚáéíóúñÑ', 'AEIOUaeiounN'))  like '%{$arraydenominacion[1]}%' ))";
        $connA = Doctrine_Manager:: connection();
        $idestados = $connA->execute($cadena)->fetchAll();
        return $idestados;
    }

    public
    function listarTipoDoc($idestructura)
    {
        $cadena = "select dp.denominacion, ddp.iddoc
                    from mod_datosmaestros.nom_docprim dp
                    inner join mod_datosmaestros.dat_documentoprim ddp on ddp.iddocumentos = dp.iddocumentos
                    inner join mod_datosmaestros.dat_estructurasubsist des on des.idestructurasubsist = ddp.idestructurasubsist
                    where des.idestructuracomun = $idestructura and des.idsubsistema = 11;";
        $connA = Doctrine_Manager:: connection();
        $tipodoc = $connA->execute($cadena)->fetchAll();
        return $tipodoc;
    }

    public
    function obtenerIdOperacionTipoDoc($iddoc)
    {
        $cadena = "select op.idnomoperaciones as idoperacion, op.denominacion
                    from mod_datosmaestros.nom_operacion op
                    inner join mod_datosmaestros.dat_operacionesentidad opent on opent.idnomoperaciones = op.idnomoperaciones
                    where opent.iddoc = $iddoc and op.idsubsistema = 11 and op.codigooperacion = 'OPER_APERTURA'
                    limit 1";
        $connA = Doctrine_Manager:: connection();
        $operacion = $connA->execute($cadena)->fetchAll();
        return $operacion;
    }

    public
    function importes($importependiente, $tipoobligacion)
    {
        $importependiente = intval($importependiente);
        $newImporteAnt = 0;
        $newImporteInst = 0;
        $newImporteABS = abs($importependiente);
        if ($tipoobligacion == 2) {//2-Pago
            $newImporteAnt = $newImporteABS * -1;
            $newImporteInst = $newImporteABS;
        } else {
            $newImporteAnt = $newImporteABS;
            $newImporteInst = $newImporteABS * -1;
        }
        $data['newImporteAnt'] = $newImporteAnt;
        $data['newImporteInst'] = $newImporteInst;
        return $data;
    }

    public
    function actualizarDocFnz($cobro, $parametros)
    {
        extract($parametros);
        $fechaemision = strtotime(
            date(str_replace("/", "-", $cobro->fechaemision))
        );
        $fechaemision = date('d-M-Y', $fechaemision);
        $cadena
            = "UPDATE mod_finanzas.dat_documentofnz SET
               idsubsistema = $idsubsistema,
               idperiodo = $idperiodo,
               cargainicial = $cargainicial,
               idestadodoccomunfinanzas = $idestadodo,
               idtipodocumento = $idtipodocumento
               WHERE (numerodocumento = '$cobro->numdocumento' 
                      AND fechacreacion = '$fechaemision'
                      AND identidad = $idestructura)
               RETURNING iddocumento";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function insertarDocFnz($cobro, $parametros)
    {
        extract($parametros);
        $fechaemision = strtotime(
            date(str_replace("/", "-", $cobro->fechaemision))
        );
        $fechaemision = date('d-M-Y', $fechaemision);
        $cadenainsert
            = 'INSERT INTO mod_finanzas.dat_documentofnz 
              ("numerodocumento", "fechacreacion", "idsubsistema", "idperiodo", 
              "cargainicial", "idestadodoccomunfinanzas", "idtipodocumento", "identidad") VALUES ';
        $cadenavalues = "('$cobro->numdocumento', '$fechaemision', $idsubsistema, $idperiodo,
                         $cargainicial, $idestadodo, $idtipodocumento, $idestructura)
                          RETURNING iddocumento;";
        $cadenasql = $cadenainsert . $cadenavalues;
        //print_r($cadenasql);die;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenasql);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function actualizarInstrumentoFnz($cobro, $parametros)
    {
        extract($parametros);
        $fechaemision = strtotime(
            date(str_replace("/", "-", $cobro->fechaemision))
        );
        $fechaemision = date('d-M-Y', $fechaemision);
        $registrado = intval($cobro->tipoobligacion);
        $importe = self::importes($cobro->importependiente, $registrado)['newImporteInst'];
        $cadena
            = "UPDATE mod_finanzas.dat_instrumentofnz SET
               fecharecepcion = '$fechaemision',
               importemo = $importe,
               importemb = $importe,
               registrado = $registrado,
               identrega = $identrega,
               idtasa = $cobro->idtasa,
               idcliente = $cobro->idclienteproveedor,
               comentario = '$cobro->comentario',
               idmoneda =  $cobro->idmoneda
               WHERE (iddocumento = $iddocumento)
               RETURNING iddocumento;";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function insertarInstrumentoFnz($cobro, $parametros)
    {
        extract($parametros);
        $fechaemision = strtotime(
            date(str_replace("/", "-", $cobro->fechaemision))
        );
        $fechaemision = date('d-M-Y', $fechaemision);
        $registrado = intval($cobro->tipoobligacion);
        $importe = self::importes($cobro->importependiente, $registrado)['newImporteInst'];
        $cadenainsert
            = 'INSERT INTO mod_finanzas.dat_instrumentofnz 
              ("fecharecepcion", "importemo", "importemb", "registrado", "identrega",
               "idtasa", "idcliente", "comentario", "idmoneda", "iddocumento") VALUES ';
        $cadenavalues = "('$fechaemision', $importe, $importe, $registrado, $identrega,
                          $cobro->idtasa,  $cobro->idclienteproveedor, '$cobro->comentario', $cobro->idmoneda, $iddocumento )
                          RETURNING iddocumento;";
        $cadenasql = $cadenainsert . $cadenavalues;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenasql);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function actualizarAnticipoFnz($cobro, $parametros)
    {
        extract($parametros);
        $tipoobligacion = intval($cobro->tipoobligacion);
        $importe = self::importes($cobro->importependiente, $tipoobligacion)['newImporteAnt'];
        $cadena
            = "UPDATE mod_finanzas.dat_anticipofnz SET
               importemo = $importe,
               importemb = $importe,
               idcuenta = $cobro->idcuenta,
               tipo = $tipoobligacion,
               comentario = '$cobro->comentario',
               idoperacioncontable = $idoperacion
               WHERE (iddocumento = $iddocumento)
               RETURNING iddocumento;";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function insertarAnticipoFnz($cobro, $parametros)
    {
        extract($parametros);
        $tipoobligacion = intval($cobro->tipoobligacion);
        $importe = self::importes($cobro->importependiente, $tipoobligacion)['newImporteAnt'];
        $cadenainsert
            = 'INSERT INTO mod_finanzas.dat_anticipofnz 
              ("importemo", "importemb", "idcuenta",
              "tipo", "comentario", "idoperacioncontable", "iddocumento") VALUES ';
        $cadenavalues = "($importe, $importe, $cobro->idcuenta,
                         $tipoobligacion, '$cobro->comentario', $idoperacion, $iddocumento)
                          RETURNING iddocumento;";
        $cadenasql = $cadenainsert . $cadenavalues;
        //print_r($cadenasql);die;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenasql);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function actualizarBeneficiarioFnz($cobro, $parametros)
    {
        extract($parametros);
        $tipoobligacion = intval($cobro->tipoobligacion);
        $cadena
            = "UPDATE mod_finanzas.dat_beneficiariofnz SET
               idelemento = $cobro->idclienteproveedor,
               tipo = $tipoobligacion,
               campoinstrumento = $campoinstrumento
               WHERE (iddocumento = $iddocumento)
               RETURNING iddocumento;";
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadena);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function insertarBeneficiarioFnz($cobro, $parametros)
    {
        extract($parametros);
        $tipoobligacion = intval($cobro->tipoobligacion);
        $cadenainsert
            = 'INSERT INTO mod_finanzas.dat_beneficiariofnz 
              ("iddocumento", "idelemento", "tipo", "campoinstrumento") VALUES ';
        $cadenavalues = "($iddocumento, $cobro->idclienteproveedor, $tipoobligacion, $campoinstrumento)
                          RETURNING iddocumento;";
        $cadenasql = $cadenainsert . $cadenavalues;
        //print_r($cadenasql);die;
        $connA = Doctrine_Manager:: connection();
        $res = $connA->execute($cadenasql);
        $result = $res->fetchAll(PDO::FETCH_ASSOC);
        return $result;
    }

    public
    function stringBuscar($string)
    {
        $string = str_replace('   ', ' ', str_replace('  ', ' ', str_replace('Ñ', 'N', str_replace('Ú', 'U', str_replace('Ó', 'O',
            str_replace('Í', 'I', str_replace('É', 'E', str_replace('Á', 'A',
                str_replace('ñ', 'N', str_replace('ú', 'U', str_replace('ó', 'O',
                    str_replace('í', 'I', str_replace('é', 'E', str_replace('á', 'A', str_replace('ü', 'U', strtoupper($string))))))))))))))));
        return trim($string);
    }

    public
    function crearFicheros($params)
    {
        if (!file_exists($_SERVER['DOCUMENT_ROOT'] . ' / excelimport')) {
            $old = umask(0);
            mkdir($_SERVER['DOCUMENT_ROOT'] . ' / excelimport');
            umask($old);
        }

        exec('cp - p ' . trim($params['file']) . ' ' . $_SERVER['DOCUMENT_ROOT'] . ' / excelimport / ' . $params['nombre']);
        exec('chmod - R 777 ' . $_SERVER['DOCUMENT_ROOT'] . ' / excelimport');

        $fichero = $params['nombre'];

        switch ($params['nombre']) {
            case 'basico . xls':
                $fichero = 'basico';
                break;
            case 'demanda_equipos . xls':
                $fichero = 'demandaEquipos';
                break;
            case 'inversiones . xls':
                $fichero = 'inversiones';
                break;
        }
        $respuesta = $this->EjecutarAccion($fichero);


//shell_exec(/*Aqui va la direccion del sh*/);
    }

    public
    function EjecutarAccion($fichero)
    {
        //identificar el sistema operativo para saber el tipo
        //de extension de archivo a ejecutar
        $cadenaserverconfig = $_SERVER['SERVER_SOFTWARE'];

        //descubriendo la direccion de los fiecheros ejecutables
        $register = Zend_Registry::getInstance();
        $dirarchivoejecutable = $register->config->dir_aplication . "/sami/data-integration/";


        $extension = ' . sh';
        $dirarchivoejecutable = $dirarchivoejecutable . $fichero . $extension;
        if (file_exists($dirarchivoejecutable)) {
            shell_exec($dirarchivoejecutable);
            $respuesta = 1;
        } else {
            $respuesta = 3;
        }

        return $respuesta;
    }

    public
    function validacionesDeCeldas($celdas)
    {
        $result = true;
        if (!isset($celdas[1]) || !isset($celdas[1][1])) {
            $result = false;
        }
        return $result;
    }

    public
    function validarNumeric($valor)
    {
        $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
        //$valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
        $valor = self::eliminarEspaciosBlanco($valor);
        if (is_numeric($valor)) {
            return $valor;
        }
        return 'no';
    }

    public
    function validarNumericPositivo($valor)
    {
        if (empty($valor)) {
            return 'no';
        } else {
            $valor = str_replace(",", ".", $valor); //reemplazar (,) por (.)
            //$valor = str_replace(" ", "", $valor); //reemplazar espacios por vacios
            $valor = self::eliminarEspaciosBlanco($valor);
            if (is_numeric($valor) && $valor >= 0) {
                return $valor;
            }
            return 'no';
        }

    }

    public
    function importar_generico_str($idesplogueada, $array_elements, $idconcepto, $tablaTemp)
    {
        $array_generic = new Doctrine_Collection(Doctrine:: getTable($tablaTemp));
        $length = count($array_elements);
        $array_colsconcept = self::obtenerColumnasDadoIdConcepto($idconcepto);

        foreach ($array_colsconcept as $indice => $valor) {
            unset($array_colsconcept[$indice]);
            if ($valor['nombrecampo'] != 'iddatosnomenclador') {
                $array_colsconcept[$indice]['nombrecampo'] = $valor['nombrecampo'];
                $array_colsconcept[$indice]['pos_col_excel'] = ($valor['orden']);
            }
        }
        $cont = 0;
        foreach ($array_elements as $row) {
            if ($cont < 1) {
                $cont++;
                continue;
            }
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

    public
    function getCantPaginas($cant, $cantxpag)
    {
        $cant_paginas = intval($cant / $cantxpag);
        if (fmod($cant, $cantxpag) > 0) {
            $cant_paginas++;
        }
        return $cant_paginas;
    }

    public
    function getParteFormato($conn, $idformato)
    {
        return $conn->execute("SELECT nivel FROM mod_datosmaestros.dat_parteformato pf where pf.idformato = $idformato order by nivel")->fetchAll(PDO::FETCH_COLUMN);
    }

    public
    function obtenerColumnasDadoIdConcepto($idconcepto)
    {
        try {
            $query = Doctrine_Query::create();
            $query->from('DatColumnaconcepto dcc')
                ->innerJoin('dcc.DatConfiguracionimportar dci')
                ->innerJoin('dci.NomConceptoimportar nci')
                ->where('nci.idconcepto = ?', $idconcepto)
                ->orderBy('dcc.orden')->setHydrationMode(Doctrine::HYDRATE_ARRAY);
            return $query->execute();
        } catch (Exception $e) {
            print_r($e->getMessage());
        }
    }

    public
    function borraDatosTabla($tabla)
    {
        $query = Doctrine_Query::create();
        $query->delete()->from($tabla)->execute();
    }

    public
    function getEstadosFilas($idconcepto)
    {
        $idesp_logueada = ZendExt_GlobalConcept::getInstance()->Estructura->idespecialidad;
        $conc = Doctrine::getTable('NomConceptoimportar')->find($idconcepto);
        $tabla = $conc->DatConfiguracionimportar->tablatemporal;
        $query = new Doctrine_Query ();
        $query->select('DISTINCT dn . iddatosnomenclador, dn . denominacion, dn . uridatosnomenclador')
            ->from('NomDatosnomenclador dn')
            ->innerJoin('dn . NomTiponomenclador tn')
            ->innerJoin('dn . ' . $tabla . ' tempx')
            ->addWhere('tempx . idespecialidad = ?');
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

    public
    function exportarErrores($errores)
    {
        $todosErrores = explode(',', $errores);
        $cuerpoerror = ' < table border = "1" bordercolor = "black"  width = "80%" align = "center" cellpadding = "0" cellspacing = "0" style = "margin-top:2cm;" > ';
        $cuerpoerror .= '<tr style = "text-align:CENTER;" ><td colspan = "2" ><strong > ERRORES EN LOS DATOS HA IMPORTAR < strong></td ></tr > ';
        $cuerpoerror .= '<tr >
                          <td width = "5%" style = "text-align: center" ><strong > Número</strong ></td >
                          <td style = "text-align: center" ><strong > Denominación error </strong ></td >
                         </tr > ';
        foreach ($todosErrores as $key => $valerror) {
            $numero = $key + 1;
            $cuerpoerror .= '<tr >
                          <td width = "5%" style = "text-align: center" > ' . $numero . '</td >
                          <td > ' . $valerror . '</td >
                         </tr > ';
        }
        $cuerpoerror .= '<table > ';

        echo $cuerpoerror;
    }

    public
    function eliminarEspaciosBlanco($str)
    {
        $str = preg_replace('/\s+/', '', $str);
        return $str;
    }

    public
    function validarCorreo($correo)
    {
        $correo = explode(' ', $correo);
        $result = '';
        foreach ($correo as $value) {
            if (!empty($value))
                $result .= $value . ((substr($value, -1)) == ',' || (substr($value, -1)) == ';') ?: ', ';
        }
        return $result;
    }

    public
    function validarMaxCaracteres($cadena, $logitud)
    {
        if (strlen($cadena) > $logitud) return false;
        else return true;
    }

    public
    function buscarSubCadena($cadena, $subcadena)
    {
        if (strlen(strstr($cadena, $subcadena)) > 0)
            return true;
        else return false;
    }

}
