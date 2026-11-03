<?php

include_once (Zend_Registry::get('config')->dir_aplication.'/crm/comun/recursos/fpdf/fpdf.php');
include_once (Zend_Registry::get('config')->dir_aplication.'/crm/comun/recursos/fpdf/fpdf_cellfit.php');

/**
 * ClientesProveedoresExportDService
 *
 * @package Domain.
 * @subpackage Domain services.
 * @copyright UCID
 * @version 1.0
 */
class ClientesProveedoresExportDService extends ZendExt_Model
{
    private $_cientesproveedoresRepository, $_pdfDoc,
        $listCampos = array(
            array('column'=> 'Código', 'attribute'=> 'codigo', 'width' => 40, "align"=> 'C'),
            array('column'=> 'Nombre', 'attribute'=> 'nombre', 'width' => 100, "align"=> 'L'),
            array('column'=> 'Abreviatura', 'attribute'=> 'abreviatura', 'width' => 40, "align"=> 'C'),
            array('column'=> 'Tipo', 'attribute'=> 'tipo', 'width' => 40, "align"=> 'C'),
            array('column'=> 'Contratos', 'attribute'=> 'cantcontratos', 'width' => 30, "align"=> 'C')
        );

    public function __construct()
    {
        $this->_cientesproveedoresRepository = new ClientesProveedoresRepository();
        parent::ZendExt_Model();
    }

    public function exportarDatos($params)
    {
        $this->_pdfDoc = new FPDF_CELLFIT('P','mm','A3');
        $this->_pdfDoc->AddPage();

        $this->createTitle('Listado de clientes y proveedores');

        $this->createEncabezados();

        $clientesP = $this->_cientesproveedoresRepository->getClientesProveedores($this->global->Perfil->iddominio, $params);

        $this->createColumns($clientesP['data']);

        $this->exportPDF();
    }

    public function createTitle($title)
    {
        $this->_pdfDoc->SetFont('Arial','B',18);
        $this->_pdfDoc->Cell(0,10, utf8_decode($title), 0, 1,'C');
        $this->_pdfDoc->Ln(10);
    }

    public function createEncabezados()
    {
        //Style head columns
        $this->_pdfDoc->SetFont('Arial','B',10);
        $this->_pdfDoc->SetFillColor(218,218,218);

        foreach($this->listCampos as $value){
            $this->_pdfDoc->Cell($value['width'], 5, utf8_decode($value['column']), 1, 0,'C', 1 );
        }
    }

    public function createColumns($data)
    {
        $this->_pdfDoc->SetFont('Arial','',10);

        $this->_pdfDoc->Ln();
        foreach($data as $val){

            foreach($this->listCampos as $field){
                $cellValue = $val[ $field['attribute'] ];
                if( $field['attribute'] == 'tipo'){

                    switch($val['idtipo']){
                        case 1 : $cellValue = 'Cliente';break;
                        case 2 : $cellValue = 'Proveedor';break;
                        default : $cellValue = 'Cliente y Proveedor';
                    }
                }
                $this->_pdfDoc->CellFitScale($field['width'], 5, utf8_decode($cellValue), 1, 0,$field['align']);
            }
            $this->_pdfDoc->Ln();
        }
    }

    private function exportPDF()
    {
        ob_end_clean();
        header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");
        header("Cache-Control: no-store, no-cache, must-revalidate");
        header("Cache-Control: post-check=0, pre-check=0", false);
        header("Pragma: no-cache");
        header('Content-Type: application/pdf');
//        header('Content-Disposition: attachment;filename="'.$filename.'.pdf"');
        ob_end_clean();
        $this->_pdfDoc->Output('documenttest'.'.pdf', 'I');
    }

    private function getField($attribute){
        foreach($this->listCampos as $field){
           if($field['attribute'] == $attribute){
               return $field;
           }
        }
    }
}