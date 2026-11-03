<?php

/*$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "/pvd/comun/recursos/PHPExcel.php";*/

 $dirwww = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
include_once($dirwww . '/pvd/comun/recursos/PHPExcel.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Writer/Excel5.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/Writer/Excel2007.php');
include_once($dirwww . '/pvd/comun/recursos/PHPExcel/IOFactory.php');

//include($direccionComun);


/*class PDFEstruc extends PHPExcel
{
}*/

class ReportActivFunexcelModel extends ZendExt_Model
{
    public function ReportActivFunexcelModel()
    {
        parent::ZendExt_Model();

    }

    public function clasificacionxparticipacionE(/*$idestructura*/)
    {
        $objPHPExcel = new PHPExcel();
        ob_end_clean();
        //Codigo para exportar el documento Exel. Para salvar en un directorio
        // usar la direccion en el save; echo($objWriter->save('directorio'));
        header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        header('Content-Disposition: attachment;filename="Bttyexcel" ');
        header('Cache-Control: max-age=0');

        $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'Excel5');
        ob_end_clean();
        echo($objWriter->save('php://output'));
        $objPHPExcel->disconnectWorksheets();
        unset($objPHPExcel);
    }

}
