<?php

/**
 * Modelo de negocio para gestionar los obras.
 *
 * @author Ing. Dainier Velazquez Labrada.
 * @package Pvd.
 * @subpackage Nomina - Nomencladores.
 * @category Modelo de negocio
 * @uses NomBilleteModel, Entidad obra (Clase del dominio).
 * @copyright UCID
 * @version 1.0
 */
class NomBilleteModel extends ZendExt_Model
{
    /**
     * Constructor de la clase.
     */
    public function NomBilleteModel()
    {
        parent::ZendExt_Model();
    }

    public function obtenerListadoBilletes($start = 0, $limit = 1000)
    {
        //Retornando el listado de obras.
        $arrayreturn = array();
        $cont = 0;
        $arrayBilletes = NomBillete::obtenerListadoBillete($start, $limit);
        foreach ($arrayBilletes as $i => $value) {
            $arrayreturn[$cont]['idbillete'] = $value['idbillete'];
            $arrayreturn[$cont]['denominacion'] = $value['denominacion'];
            $arrayreturn[$cont]['orden'] = $value['orden'];
            $arrayreturn[$cont]['activo'] = $value['activo'];
            $arrayreturn[$cont]['idmoneda'] = $value['idmoneda'];
            $arrayreturn[$cont]['denommoneda'] = NomBillete::obtenerDenominacionMoneda($value['idmoneda'])[0]['codigoiso'];
            $cont++;
        }
        return $arrayreturn;
    }

    public function cantBilletes(){
        return NomBillete::cantBilletes();
    }

    public function adicionarBillete($denominacion, $orden, $tipomoneda, $monedaactiva)
    {
        //Se crea el objeto del billete.
        $objBillete = new NomBillete();
        $idmoneda = NomBillete::obtenerMonedaXCodigoIso($tipomoneda)[0]['idmoneda'];

        //Obteniendo los billetes que tienen la misma denominacion
        $arr_bill_denom_rep = $objBillete->obtenerBilletesMismaDenominacion($denominacion, $idmoneda);
        if (count($arr_bill_denom_rep) > 0) { //Validando que no existan billetes con la misma denominacion para una misma moneda
            return 2;
        }

        //Obteniendo los billetes que tienen el mismo orden
        $arr_bill_orden_rep = $objBillete->obtenerBilletesMismoOrden($orden, $idmoneda);
        if (count($arr_bill_orden_rep) > 0) { //Validando que no existan billetes con el mismo orden para una misma moneda
            return 3;
        }

        //Insertando los datos del billete.
        $objBillete->denominacion = $denominacion;
        $objBillete->orden = $orden;
        $objBillete->activo = ($monedaactiva == 'Si') ? 1 : 0;
        $objBillete->idmoneda = $idmoneda;

        //Guardando los datos.
        $objBillete->save();
        return 1;
    }

    public function modificarBillete($idbillete, $denominacion, $orden, $tipomoneda, $monedaactiva)
    {
        //Obteniendo el billete a modificar.
        $objBillete = NomBillete::obtenerObjBilleteDadoId($idbillete);
        $idmoneda = NomBillete::obtenerMonedaXCodigoIso($tipomoneda)[0]['idmoneda'];

        //Obteniendo los billetes que tienen la misma denominacion
        $arr_bill_denom_rep = $objBillete->obtenerBilletesMismaDenominacion($denominacion, $idmoneda);
        //Validando que no existan billetes con la misma denominacion para una misma moneda
        if (count($arr_bill_denom_rep) > 0 && $arr_bill_denom_rep[0]['idbillete'] != $idbillete) {
            return 2;
        }

        //Obteniendo los billetes que tienen el mismo orden
        $arr_bill_orden_rep = $objBillete->obtenerBilletesMismoOrden($orden, $idmoneda);
        //Validando que no existan billetes con el mismo orden para una misma moneda
        if (count($arr_bill_orden_rep) > 0 && $arr_bill_orden_rep[0]['idbillete'] != $idbillete) {
            return 3;
        }

        //Insertando los datos del billete.
        $objBillete->denominacion = $denominacion;
        $objBillete->orden = $orden;
        $objBillete->activo = ($monedaactiva == 'Si') ? 1 : 0;
        $objBillete->idmoneda = NomBillete::obtenerMonedaXCodigoIso($tipomoneda)[0]['idmoneda'];

        //Guardando los datos.
        $objBillete->save();
        return 1;
    }

    public function eliminarBillete($idbillete)
    {
        //Obteniendo la actividad del billete.
        $activo = NomBillete::obtenerBilleteActivo($idbillete);
        if (!empty($activo)) {
            return 3;
        } else {
            //Obteniendo el billete a eliminar.
            $objBillete = NomBillete::obtenerObjBilleteDadoId($idbillete);
            //Borrando el billete.
            $objBillete->delete();
            return 1;
        }

    }

    //Exportar nomenclador
    public function fnExportarNomenclador($arrBilletes)
    {
        $obj = new DatNominaModel();
        $objPHPExcel = new PHPExcel();

        //Definiendo el arreglo por monedas
        $r = array();
        foreach ($arrBilletes as $billete) {
            $r[$billete['denommoneda']][] = $billete;
        }

        //Pintando la denominación del área
        $fila = 1;
        $columna = 1;
        $objPHPExcel->getActiveSheet()->mergeCells('A1:D1');
        $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, 'Desglose de billetes', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('A')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'A', $fila, 'Denominación', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('B')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'B', $fila, 'Orden', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('C')->setWidth(30);
        $obj->fnPintarCelda($objPHPExcel, 'C', $fila, 'Tipo moneda', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $columna++;
        $objPHPExcel->getActiveSheet()->getColumnDimension('D')->setWidth(10);
        $obj->fnPintarCelda($objPHPExcel, 'D', $fila, 'Activo', null, '000000', 'Arial', 11, '000000', 'center', 'center', 0, 1);
        $fila++;
        //Pintando las monedas
        foreach ($r as $denommoneda => $rmonedas) {
            $columna = 1;
            $objPHPExcel->getActiveSheet()->mergeCells('A'.$fila.':D'.$fila);
            $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $denommoneda, null, null, 'Arial', 11, '006600', 'left', 'center', 0, 1);
            $fila++;
            foreach ($rmonedas as $moneda) {
                $columna = 1;
                $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $moneda['denominacion'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                $columna++;
                $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $moneda['orden'], null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                $columna++;
                $obj->fnPintarCelda($objPHPExcel, chr($columna + 64), $fila, $denommoneda, null, '000000', 'Arial', 10, '000000', 'center', 'center', 0, 0);
                $columna++;
                $this->fnPintarImagen($objPHPExcel, chr($columna + 64) . $fila, ($moneda['activo'] == 1 ? 'si' : 'no'));
                $fila++;
            }
        }

        //TERMINACION DEL EXCEL*********************************************************
        $objPHPExcel->setActiveSheetIndex(0);
        ob_end_clean();
        header('Content-Type: application/vnd.ms-excel');
        header('Content-Disposition: attachment;filename="Nomenclador.xls" ');
        header('Cache-Control: max-age=0');
        header('Pragma: no-cache');
        header('Expires: 0');

        //$objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel2007');
        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
        return 1;
    }

    public function fnPintarImagen(&$objPHPExcel, $celda, $denomimagen)
    {
        $dir_www = $_SERVER['DOCUMENT_ROOT'];
        $imagepath = $dir_www . "/pvd/nomina/views/images/" . $denomimagen . ".gif";
        if (file_exists($imagepath)) {
            $objPHPExcelDrawing = new PHPExcel_Worksheet_Drawing();
            $objPHPExcelDrawing->setPath($imagepath);
            $objPHPExcelDrawing->setCoordinates($celda);
            $objPHPExcelDrawing->setResizeProportional(false);
            $objPHPExcelDrawing->setWidth(15);
            $objPHPExcelDrawing->setHeight(15);
            $objPHPExcelDrawing->setOffsetX(25);
            $objPHPExcelDrawing->setOffsetY(2);

            $objPHPExcelDrawing->setWorksheet($objPHPExcel->getActiveSheet());
        }
    }
}
