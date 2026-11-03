<?php

class DatEstudiomatrizrelacionModel extends ZendExt_Model
{
    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getConfig($idproyecto)
    {
        try {
            $res["config"] = DatEstudiomatrizrelacion::getConfig($idproyecto);

            if ($res["config"]["idconfiguracionmatrizrelacion"]) {
                $cr = $this->getColumnRows($res["config"]["idestudiomatrizrelacion"]);
                $res = array_merge($res, $cr);
            } else {
                $res['success'] = false;
                $res['codmsg'] = 3;
                $res['message'] = "msgNoConfiguredMatrix";
            }
            return $res;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function saveConfig($config)
    {
        try {
            if ($config["idconfiguracionmatrizrelacion"]) {
                $success = DatConfiguracionmatrizrelacion::updateConfig($config);
            } else {
                $idconfig = DatConfiguracionmatrizrelacion::insertConfig($config);
                $success = DatEstudiomatrizrelacion::setConfig($config["idproyecto"], $idconfig);
                $nombrerelacion = $config['nombrerelacion'] ? $config['nombrerelacion'] : '';
                $nombre = explode('/', $nombrerelacion);
                if ($config['cantidadfilas']) {
                    for ($i = 0; $i < $config['cantidadfilas']; $i++) {
                        $pParams['denominacion'] = (($nombre[0]) ? $nombre[0] : 'Fila') . ($i + 1);
                        $pParams['idestudiomatrizrelacion'] = $config['idestudiomatrizrelacion'];
                        $pParams['descripcion'] = (($nombre[0]) ? $nombre[0] : 'Fila') . ($i + 1);
                        $pParams['fila'] = true;
                        $this->insertColumnRow($pParams);
                    }

                }
                if ($config['cantidadcolumnas']) {
                    for ($i = 0; $i < $config['cantidadcolumnas']; $i++) {
                        $pParams['denominacion'] = (($nombre[1]) ? $nombre[1] : 'Columna') . ($i + 1);
                        $pParams['idestudiomatrizrelacion'] = $config['idestudiomatrizrelacion'];
                        $pParams['descripcion'] = (($nombre[1]) ? $nombre[1] : 'Columna') . ($i + 1);
                        $pParams['fila'] = false;
                        $this->insertColumnRow($pParams);
                    }
                }
            }
            if ($success) {
                return $this->getConfig($config["idproyecto"]);
            } else {
                $res['success'] = false;
                $res['codmsg'] = 3;
                $res['message'] = "insertErrorMessage";
            }
            return $res;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function insertColumnRow($pParams)
    {
        try {
            $success = DatColumnafila::insertColunmaFila($pParams);
            if ($success) {
                return $this->getConfig($pParams["idproyecto"]);
            } else {
                $res['success'] = false;
                $res['codmsg'] = 3;
                $res['message'] = "insertErrorMessage";
                return $res;
            }
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function creatematrix($config, $columnrows, $datos)
    {
        try {
            $config = $this->saveConfig($config);
            $success = true;
            foreach ($columnrows as $value) {
                if ($config['config']['idestudiomatrizrelacion']) {
                    $value['idestudiomatrizrelacion'] = $config['config']['idestudiomatrizrelacion'];
                    $success = DatColumnafila::insertColunmaFila($value);
                } else {
                    $success = false;
                    break;
                }
            }
            if ($success) {
                if (!empty($datos)) {
                    $arreglo = $this->getColumnRows($config['config']["idestudiomatrizrelacion"]);
                    foreach ($datos['cells'] as $key => $value) {
                        foreach ($arreglo['columns'] as $key1 => $value1) {
                            if ($value['column'] == $value1['denominacion']) {
                                $datos['cells'][$key]['column'] = $arreglo['columns'][$key1]['idcolumnafila'];
                            }
                        }
                        foreach ($arreglo['rows'] as $key1 => $value1) {
                            if ($value['row'] == $value1['denominacion']) {
                                $datos['cells'][$key]['row'] = $arreglo['rows'][$key1]['idcolumnafila'];
                            }
                        }
                        if ($value['hibrida']) {
                            if ($value['value']) {
                                $cadena = '{"new":{"new-0":"' . $value['value'] . '"}}';
                                $cadena = Zend_Json_Decoder::decode(stripcslashes($cadena));
                            } else if ($value['value'] == '') {
                                $cadena = '{}';
                                $cadena = Zend_Json_Decoder::decode(stripcslashes($cadena));
                            }
                        } else {
                            if ($value['value'] == 'X') {
                                $cadena = '{"new":{"new-0":"X"}}';
                                $cadena = Zend_Json_Decoder::decode(stripcslashes($cadena));
                            } else if ($value['value'] == '') {
                                $cadena = '{}';
                                $cadena = Zend_Json_Decoder::decode(stripcslashes($cadena));
                            }
                        }
                        $datos['cells'][$key]['value'] = $cadena;
                    }
                    $datos['idestudiomatrizrelacion'] = $config['config']["idestudiomatrizrelacion"];
                    $datos['idproyecto'] = $config['config']["idproyecto"];
                    $this->saveCells($datos);
                }
                $this->conn->commit();
                return $this->loadMatrix($config['config']["idestudiomatrizrelacion"]);
            } else {
                $res['success'] = false;
                $res['codmsg'] = 3;
                $res['message'] = "createErrorMessage";
                return $res;
            }
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function deleteColumnRow($pParams)
    {
        try {
            $success = DatColumnafila::deleteColunmaFila($pParams);
            if ($success) {
                return $this->getConfig($pParams["idproyecto"]);
            } else {
                $res['success'] = false;
                $res['codmsg'] = 3;
                $res['message'] = "deleteErrorMessage";
                return $res;
            }
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function updateColumnRow($pParams)
    {
        try {
            $success = DatColumnafila::updateColunmaFila($pParams);
            if ($success) {
                return $this->getConfig($pParams["idproyecto"]);
            } else {
                $res['success'] = false;
                $res['codmsg'] = 3;
                $res['message'] = "updateErrorMessage";
                return $res;
            }
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function loadMatrix($idestudiomatrizrelacion)
    {
        try {
            return $this->getColumnRows($idestudiomatrizrelacion);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function saveCells($pParams)
    {
        try {
            $cells = $pParams['cells'];
            $cellsAded = $cellsupdated = $cellsdeleted = array();
            foreach ($cells as $cell) {
                if (count($cell["value"]) > 0) {
                    foreach ($cell["value"] as $key => $content) {
                        if ($key == "new") {
                            $aded = $this->addCell($cell);
                            if ($aded != null) {
                                $cellsAded[] = $aded;
                            }
                        } else {
                            if ($cell["value"][$key]["number"]) {
                                $cell["number"] = $cell["value"][$key]["number"];
                                $cellsupdated[] = DatCelda::updateNumberCell($cell);
                            } else {
                                $textcell["value"] = $content;
                                if ($this->deleteall($content)) {
                                    $params["column"] = $cell["column"];
                                    $params["row"] = $cell["row"];
                                    $cellsdeleted[] = DatCelda::delCell($params);
                                } else {
                                    $textcell["idcelda"] = $key;
                                    $cellsupdated[] = $this->updateTextCell($textcell);
                                }
                            }
                        }
                    }
                } else {
                    $params["column"] = $cell["column"];
                    $params["row"] = $cell["row"];
                    $cellsdeleted[] = DatCelda::delCell($params);
                }
            }
            if (count($cellsAded) > 0 || count($cellsdeleted) > 0 || count($cellsupdated) > 0) {
                $res['success'] = true;
                $res = $this->loadMatrix($pParams['idestudiomatrizrelacion']);
            } else {
                $res['success'] = false;
                $res['codmsg'] = 3;
                $res['message'] = "noCellsAdedMessage";
            }
            return $res;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    private function deleteall($content)
    {
        try {
            $count = 0;
            foreach ($content as $key => $value) {
                $new = explode("-", $key);
                if (count($new) > 1) {
                    if (isset($new[0]) && $new[0] === "del") {
                        $count++;
                    }
                }
            }
            return $count >= count($content);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function export($filename, $html, $type)
    {
        try {
            $res = array('success' => true, 'codmsg' => 1, 'message' => "msgExported");
            $tabla = $html;
            if ($type == 'rtf' || $type == 'doc') {
                header("Pragma: public");
                header("Expires: 0");
                header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
                header("Content-Type: application/force-download");
                header("Content-type: application/ms-word");
                header("Content-Type: application/download");
                header("Content-Disposition: attachment;filename=" . "$filename.rtf");
                header("Content-Transfer-Encoding: binary ");
                echo $tabla;
                die;
            } else {
                //Parametros de configuracion del PDF
                ini_set("memory_limit", "250M");
                $dir_www = $_SERVER ['DOCUMENT_ROOT'];
                $dir_rel_mt = '/';
                $dir_abs_mt = str_replace('//', '/', dirname($dir_www . '..') . '/' . $dir_rel_mt);
                $GLOBALS ['dirdom'] = $dir_abs_mt . 'lib/dompdf/dompdf_config.inc.php';
                Zend_Loader::loadFile($GLOBALS ['dirdom']);
                $autoloader = Zend_Loader_Autoloader::getInstance();
                $default = $autoloader->getDefaultAutoloader();
                $autoloader->setDefaultAutoloader('DOMPDF_autoload');
                $dompdf = new DOMPDF ();
                $dompdf->load_html($tabla);
                $dompdf->render();
                $dompdf->stream("$filename.pdf");
                $autoloader->setDefaultAutoloader($default);
                $dompdf->output();
                die;
            }
            return $res;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public static function getByProyecto($idProyecto)
    {
        $estudio = DatEstudiomatrizrelacion::getByProyecto($idProyecto);
        return $estudio;
    }

    public function updateText($idText, $value)
    {
        try {
            return DatTexto::update($idText, $value);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function deleteText($idText)
    {
        try {
            return DatTexto::delete($idText);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function getMatrixTexts($idProyecto)
    {
        try {
            return DatEstudiomatrizrelacion::getTexts($idProyecto);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    /*     * *****************Private Functions************************ */
    public function getColumnRows($idestudiomatrizrelacion)
    {
        try {
            $res = $rows = $rowIds = $cols = $colIds = array();
            $columnrows = DatColumnafila::getColumnsRows($idestudiomatrizrelacion);
            foreach ($columnrows as $value) {
                if ($value["fila"]) {
                    $rows[] = $value;
                    $rowIds[] = $value["idcolumnafila"];
                } else {
                    $cols[] = $value;
                    $colIds[] = $value["idcolumnafila"];
                }
            }
            $res["columns"] = $cols;
            $res["rows"] = $rows;
            if (count($colIds) > 0) {
                if (count($rowIds) > 0) {
                    $cells = DatCelda::getCells($colIds, $rowIds);
                    for ($i = 0; $i < count($res["rows"]); $i++) {
                        for ($j = 0; $j < count($res["columns"]); $j++) {
                            $res["rows"][$i][$res["columns"][$j]["idcolumnafila"]] = $this->getCellValue($cells, $res["columns"][$j]["idcolumnafila"], $res["rows"][$i]["idcolumnafila"]);
                        }
                    }
                    $res['success'] = true;
                } else {
                    $res['success'] = false;
                    $res['codmsg'] = 3;
                    $res['message'] = "msgNoRowsMatrix";
                }
            } else {
                $res['success'] = false;
                $res['codmsg'] = 3;
                $res['message'] = "msgNoColumnsMatrix";
            }
            return $res;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    private function getRows($idestudiomatrizrelacion, $columns)
    {
        try {
            $rows = DatColumnafila::getRows($idestudiomatrizrelacion);
            if (count($rows) > 0) {
                $colIds = array();
                foreach ($columns as $value) {
                    $colIds[] = $value["idcolumnafila"];
                }
                $rowIndexes = array();
                foreach ($rows as $value) {
                    $rowIds[] = $value["idcolumnafila"];
                }
                $cells = DatCelda::getCells($colIds, $rowIds);
                for ($i = 0; $i < count($rows); $i++) {
                    for ($j = 0; $j < count($columns); $j++) {
                        $rows[$i][$columns[$j]["idcolumnafila"]] = $this->getCellValue($cells, $columns[$j]["idcolumnafila"], $rows[$i]["idcolumnafila"]);
                    }
                }
            }
            return $rows;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    private function updateTextCell($cell)
    {
        try {
            $texts = $cell["value"];
            foreach ($texts as $key => $value) {
                $new = explode("-", $key);
                if (count($new) > 1) {
                    if (isset($new[0]) && $new[0] === "new") {
                        $cellid = $this->addText($cell["idcelda"], $value);
                    } elseif (isset($new[0]) && $new[0] === "upd") {
                        $cellid = $this->updateText($new[1], $value);
                    } elseif (isset($new[0]) && $new[0] === "del") {
                        $cellid = $this->deleteText($new[1]);
                    }
                }
            }
            return $cellid;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    private function addCell($cell)
    {
        try {
            if (count($cell["value"]["new"]) > 0) {
                $cellid = DatCelda::getCell($cell["column"], $cell["row"]);
                if (!isset($cellid["idcelda"])) {
                    $cellid = DatCelda::addCell($cell);
                }
                if (isset($cellid["idcelda"])) {
                    if (!isset($cell["value"]["new"]["number"]) || $cell["value"]["new"]["number"] == null && isset($cell["value"]["new"])) {
                        $textcell["idcelda"] = $cellid["idcelda"];
                        $textcell["value"] = $cell["value"]["new"];
                        $this->updateTextCell($textcell);
                    }
                }
            }
            return $cellid;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    private function getCellValue($cells, $idcolumna, $idfila)
    {
        try {
            $val = array();
            foreach ($cells as $value) {
                if ($value["idcolumna"] == $idcolumna && $value["idfila"] == $idfila) {
                    if (isset($value["numero"]) && $value["numero"] !== null) {
                        $val[$value["idcelda"]]["number"] = $value["numero"];
                        return $val;
                    } else if (isset($value["texto"]) && $value["texto"] !== null) {
                        $val[$value["idcelda"]][$value["idtexto"]] = $value["texto"];
                    }
                }
            }
            return $val;
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    private function addText($idCell, $value)
    {
        try {
            return DatTexto::add($idCell, $value);
        } catch (Exception $exc) {
            throw $exc;
        }
    }

    public function getDatosReporte($params)
    {

        $data = array();
        $data[0]->tipo = 'matriz';
        $data[0]->encabezado = 'Matriz de relaciones';
        $data[0]->columnas = $params['tabla']['columns'];
        $data[0]->referencia = $params['tabla']['columns'];
        $data[0]->datos = $params['tabla']['data'];
        $data['informe'] = 'Informe de matriz de relaciones';
        $data['denominacion'] = $data['denominacion'];

        return $data;
    }
}