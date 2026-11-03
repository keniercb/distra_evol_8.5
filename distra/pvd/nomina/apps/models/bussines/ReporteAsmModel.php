<?php
/**
 * Modelo para hacer el reporte del Submayor de Vacaciones.
 *
 * @author Ing. Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Models.
 * @category Clase Modelo.
 * @uses 
 * @copyright UCID
 * @version 1.0
 */
class ReporteAsmModel extends ZendExt_Model {

    public function ReporteAsmModel() {
        parent::ZendExt_Model();
    }

    //Funcionalidad para exportar el reporte de los asm
    public function exportarASM($idelaborarpagos){
        $objDatosNominas = new DatNominaDatos();
        //Obj de Php Excel
        $objPHPExcel = new PHPExcel();
        //AQUI EMPIEZA EL CODIGO DE LA PAGINA DE LA NOMINA GENERAL
        $arrDatosNominas = $objDatosNominas->obtenerDatosNominaPlantillaPorElaborarPago($idelaborarpagos);
        if (count($arrDatosNominas) > 0) {
            $arrCentros = array();
            $fila = 2;
            $objPHPExcel->getActiveSheet()->setCellValue('A1', 'CI');
            $objPHPExcel->getActiveSheet()->setCellValue('B1', 'Anticipo Salarial Mensual');
            $objPHPExcel->getActiveSheet()->setCellValue('C1', 'TRT');
            foreach ($arrDatosNominas as $k => $v) {
                $arrValores = unserialize($v['valores']);
                $arrcolumna = unserialize($v['campos']);
                foreach($arrValores as $iv=>$rv){
                    $nombre = $rv["c202"];
                    $asm = $rv["c230"];
                    $trt = $rv["c306"];
                    $objPHPExcel->getActiveSheet()->setCellValue('A'.$fila, $nombre);
                    $objPHPExcel->getActiveSheet()->setCellValue('B'.$fila, $asm);
                    $objPHPExcel->getActiveSheet()->setCellValue('C'.$fila, $trt);
                    $fila++;
                }
            }
        }

        //Exportando el excel
        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="Reporte de los Anticipos Salariales Mensuales.xlsx" ');
        header('Cache-Control: max-age=0');
        $objWriter=PHPExcel_IOFactory::createWriter($objPHPExcel,'Excel2007');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
    }

}

