<?php

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of ExportarReporteModel
 *
 * @author Ing. Miguel Antonio Cabreja Aldana
 * @versión 1.0
 */
class ExportarReporteModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function generarReporte($formato, $tituloReporte, $datos, $header, $usuario,$fecha,$objLogo) {
        if ($formato == 'XLS') {
            $this->getExcel($tituloReporte, $datos, $header, $usuario,$fecha);
        } else if ($formato == 'PDF') {
            $this->getPDF($tituloReporte, $datos, $header, $usuario,$fecha,$objLogo);
        } else if ($formato == 'DOC') {
            $this->getDOC($tituloReporte, $datos, $header, $usuario,$fecha,$objLogo);
        } else if ($formato == 'HTML') {
            $this->getHTML($tituloReporte, $datos, $header, $usuario,$fecha,$objLogo);
        }
    }

    private function getExcel($tituloReporte, $datos, $header, $usuario,$fecha) {
        $xls = new DatReporteWriter();	 
        $xls_int = array('type' => 'int');
        $xls_date = array('type' => 'date');
		$xls_pie = array('GENRADO POR: ', 'FECHA: ');
		$style_blod=array('bold' => true);
        $xls->WriteLineMarge(array('Título: '.$tituloReporte), count($header) - 1);
        $xls->OpenRow();
		
        foreach ($header as $cod => $val) {
            $xls->NewCell($val, false, $xls_style);
        }
        $xls->CloseRow();

        foreach ($datos as $fila) {
            $xls->OpenRow();
            foreach ($fila as $dato) {
                if (is_numeric($dato)) {
                    $xls->NewCell($dato, false, $xls_int);
                } else  {
                    $xls->NewCell($dato, true); //Auto alineado 
                }
            }
            $xls->CloseRow();
        }
        $xls->WriteLine();
        $xls->WriteLine();        
		if(!empty($usuario) && !empty($fecha)){
			$xls->OpenRow();
			foreach ($xls_pie as $cod => $val) {
				$xls->NewCell($val, false,$style_blod);
			}
			$xls->CloseRow();
			$xls->OpenRow();
			$xls->NewCell($usuario, true);
			$xls->NewCell($fecha, true);
			$xls->CloseRow();			
		}else if(!empty($usuario)){
			$xls->OpenRow();
			$xls->NewCell($xls_pie[0], false,$style_blod);
			$xls->CloseRow();
			$xls->OpenRow();			
			$xls->NewCell($usuario, true);
			$xls->CloseRow();
		}else if(!empty($fecha)){
			$xls->OpenRow();
			$xls->NewCell($xls_pie[1], false,$style_blod);
			$xls->CloseRow();
			$xls->OpenRow();			
			$xls->NewCell($fecha, true);
			$xls->CloseRow();
		}
        
        $xls->GetXLS(true, $tituloReporte);
    }

    private function getPDF($tituloReporte, $datos, $header, $usuario,$fecha,$objLogo) {
		$pdf_numeric = array('type' => 'numeric');
        $pdf = new DatReporteWriter();
        $pdf->OpenRowTR();
        $pdf->WriteHeaderLine($header);
        $pdf->CloseRowTR();

        foreach ($datos as $fila) {
            $pdf->OpenRowTR();
            foreach ($fila as $dato) {
                if (is_numeric($dato)) {
                    $pdf->NewCellTD($dato, false,$pdf_numeric);
                } else {
                    $pdf->NewCellTD($dato, true); //Auto alineado
                }
            }
            $pdf->CloseRowTR();
        }
        $pdf->GetPDF(true, $tituloReporte, $usuario,$fecha,$objLogo);
    }

    private function getDOC($tituloReporte, $datos, $header, $usuario,$fecha,$objLogo) {
		$doc_numeric = array('type' => 'numeric');
        $doc = new DatReporteWriter();
        $doc->OpenRowTR();
        $doc->WriteHeaderLine($header);
        $doc->CloseRowTR();
        foreach ($datos as $fila) {
            $doc->OpenRowTR();
            foreach ($fila as $dato) {
                if (is_numeric($dato)) {
                    $doc->NewCellTD($dato, false,$doc_numeric);
                } else {
                    $doc->NewCellTD($dato, true); //Auto alineado 
                }
            }
            $doc->CloseRowTR();
        }
        $doc->GetDOC(true, $tituloReporte, $usuario,$fecha,$objLogo);
    }

    private function getHTML($tituloReporte, $datos, $header, $usuario,$fecha,$objLogo) {
        $html_numeric = array('type' => 'numeric');
        $html = new DatReporteWriter();
        $html->OpenRowTR();
        $html->WriteHeaderLine($header);
        $html->OpenRowTR();
        foreach ($datos as $fila) {
            $html->OpenRowTR();
            foreach ($fila as $dato) {
                if (is_numeric($dato)) {
                    $html->NewCellTD($dato, false,$html_numeric);
                } else {
                    $html->NewCellTD($dato, true); //Auto alineado 
                }
            }
            $html->CloseRowTR();
        }
        $html->GetHTML($tituloReporte, $usuario,$fecha,$objLogo);
		
    }

}

?>