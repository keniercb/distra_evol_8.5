<?php

class ImportarModel extends BaseModel
{
    private $datosLectura, $_model;

    public function ImportarModel($class)
    {
        parent::__construct();
        $this->datosLectura = new ReaderModel();
        $clase = "{$class}";
        $this->_model = new $clase;
    }

    public function importarFichero($file, $params)
    {
        $fileName = $file['name'];
        $temp = $file['tmp_name'];
        $partesNombre = explode('.', $fileName);
        $nameSize = count($partesNombre) - 1;
        $ext = strtolower($partesNombre[$nameSize]);
        $tipo = $file['type'];
        if ($ext == 'csv') {
            $tipo = 'text/csv';
        }
        if ($ext == '001' || $ext == 'bin') {
            if ($ext == '001') {
                $ext = 'bin';
            }
            $tipo = 'text/bin';
        }

        if ($this->validarFichero($ext, $tipo)) {
            switch ($params['formato']) {
                case 'xml':
                    return $this->leerFicheroXML($temp, $params);
                case 'ord':
                    return $this->leerFicheroOrd($temp, $params);
                case 'csv':
                    return $this->leerFicheroCSV($temp, $params);
                case 'json':
                    return $this->leerFicheroJson($temp, $params);
                case 'bin':
                    return $this->leerFicheroBin($temp, $params);
                default:
                    return $this->leerFichero($temp, $params);
            }
        } else {
            return 2;
        }
    }

    private function validarFichero($ext, $tipo)
    {
        $types['text/xml'] = 'xml';
        $types['application/octet-stream'] = 'ord';
        $types['application/json'] = 'json';
        $types['text/csv'] = 'csv';
        $types['text/bin'] = 'bin';
        $types['application/wps-office.xls'] = 'xls';
        $types['application/vnd.ms-excel'] = 'xls';
        $types['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'] = 'xlsx';
        $types['application/vnd.oasis.opendocument.spreadsheet'] = 'ods';

        return (array_key_exists($tipo, $types) && $types[$tipo] == $ext) ? true : false;
    }

    private function leerFichero($temp, $params)
    {
        $objPHPExcel = PHPExcel_IOFactory::load($temp);
        $datosExcel = $objPHPExcel->getActiveSheet()->toArray();
        $datos = $this->_model->sincronizarArray($datosExcel, $params);
        $result = $this->_model->importarFichero($datos, $params);
        return ($result) ?: array();
    }

    private function leerFicheroXML($temp, $params)
    {
        $domXML = new DOMDocument();
        $domXML->load($temp);
        $rows = $domXML->getElementsByTagName('Row');
        $firstRow = true;
        $datosExcel = array();
        foreach ($rows as $rowItem) {
            $rowData = array();
            if ($firstRow) {
                $firstRow = false;
            } else {
                foreach ($rowItem->getElementsByTagName('Cell') as $cellItem) {
                    array_push($rowData, trim($cellItem->nodeValue));
                }
                array_push($datosExcel, $rowData);
            }
        }
        $datos = $this->_model->sincronizarArray($datosExcel, $params);
        $result = $this->_model->importarFichero($datos, $params);
        return array();
    }

    private function leerFicheroCSV($temp, $params)
    {
        $csvHandler = fopen($temp, 'r');
        $datos = array();
        while ($data = fgetcsv($csvHandler, 10000, ($params['delimiter']) ? $params['delimiter'] : ',')) {
            array_push($datos, $data);
        }
        $result = $this->_model->importarFicheroCSV($datos, $params);
        return ($result) ? $result : array();
    }


    private function leerFicheroBin($temp, $params)
    {
        $binHandler = fopen($temp, 'rb');
        $datos = array();
        /*while (!feof($binHandler)) {
            $data = fread($binHandler, 10000);
            $arr = unpack("H*", $data);
            foreach ($arr as $key => $value){
                array_push($datos, $value);
            }
        }*/
        while ($data = fgetcsv($binHandler, 10000, ($params['delimiter']) ? $params['delimiter'] : ',')) {
            array_push($datos, $data);
        }
        $result = $this->_model->importarFicheroBin($datos, $params);
        return ($result) ? $result : array();
    }

    private function leerFicheroOrd($temp, $params)
    {
        $xml = simplexml_load_file($temp);
        $datos = $this->_model->sincronizarArray($xml, $params);
        $result = $this->_model->importarFichero($datos, $params);
        return array();
    }

    private function leerFicheroJson($temp, $params)
    {

        $json = file_get_contents($temp);
        $datos = json_decode($json, true);
        $result = $this->_model->importarFicheroJson($datos, $params);
        return ($result) ? $result : array();
    }

}
