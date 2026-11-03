<?php
/**
 * Controlador para gestionar elementos salariales a las personas.
 *
 * @author Ing. milena gainza.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses 
 * @copyright Xetid
 * @version 1.0
 */
class PDFElementosSalarialescargo extends fpdf
{

    function Footer()
    {

        $this->Ln(40);
        $this->Cell(0,10,' '.$this->PageNo(),0,0,'C');


    }
}

class ReporteElemSalarialesCargoModel extends ZendExt_Model {

    public function ReporteElemSalarialesCargoModel() {
        parent::ZendExt_Model();
    
	}


public function exportarReporte($arraPlanESC,$auxArrF,$auxArrFEs,$DenomEstructura,$CodigoEstructura){
    $pdf = new PDFElementosSalarialescargo('L', 'mm', 'A4');
	$pdf->SetTitle("SNC-225");
	$pdf->SetAuthor(" Ing. Milena Gainza Rodríguez");
	$pdf->SetLeftMargin(40);
	$pdf->SetRightMargin(40);
    $pdf->AddPage();
    $pdf->SetFont('Arial', 'B', 11);
    $pdffinal = $this->cabeceraReporte($pdf,$arraPlanESC,$auxArrF,$auxArrFEs,$DenomEstructura,$CodigoEstructura);
    $pdffinal = $this->cuerpoReporte($pdf,$arraPlanESC,$auxArrF,$auxArrFEs);
	$pdffinal->Output();
}



public function observacionesReporte($pdf){


	return $pdf;
}

public function cuerpoReporte($pdf,$arraPlanESC,$auxArrF,$auxArrFEs){

    if(count($arraPlanESC)!=0){
        $pdf->SetFillColor(211, 211, 211);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(0, 10, utf8_decode('Cargos con configuracion de elementos salarial'), 0, 1, 'C', 1);
        $plantilla  = $arraPlanESC[0]['idplantillanominal'];
        $pdf->SetFont('Arial', '', 10);
        $pdf->SetFillColor(245, 245, 245);
        $pdf->Cell(0, 10, utf8_decode($arraPlanESC[0]['denominacion']), 0, 1, 'C', 1);
        $pdf->SetFillColor(255, 255, 255);
        foreach($arraPlanESC as $k => $v) {

            $pdf->SetFont('Arial', '', 10);
            if($plantilla == $v['idplantillanominal']){
                $pdf->Cell(0, 10, utf8_decode($v['denomcargo']), 1,1 , 'L', 1);
            }else{
                $plantilla = $v['idplantillanominal'];
                $pdf->SetFillColor(245, 245, 245);
                $pdf->Cell(0, 10, utf8_decode($v['denominacion']), 0, 1, 'C', 1);
                $pdf->SetFillColor(255, 255, 255);
                $pdf->Cell(0, 10, utf8_decode($v['denomcargo']), 1,1 , 'L', 1);
            }
//            foreach($arraPlanESC as $kc => $vc) {
//                if($v['idcargo']==$vc['idcargo']){
//                    $pdf->Cell(0, 10, utf8_decode($vc['denominacion']), 1,1 , 'L', 1);
//                }
//
//
//            }


        }


    }

    if(count($auxArrF)!=0){
        $pdf->Ln();
        $idplantilla = $auxArrF[0]['idplantillanominal'];
        $pdf->SetFillColor(211);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(0, 10, utf8_decode("Cargos sin conceptos de percepción y descuento"), 0, 1, 'C', 1);
        $pdf->SetFont('Arial', '', 11);
        $pdf->SetFillColor(245);
        $pdf->Cell(0, 10, utf8_decode($auxArrF[0]['plantilla']), 0, 1, 'C', 1);
        $pdf->SetFillColor(255);
        foreach($auxArrF as $kconc=>$vconc){
            if($idplantilla == $vconc['idplantillanominal']){
                $pdf->SetFillColor(245);
                $pdf->Cell(0, 10, utf8_decode($vconc['idcargo']), 1, 1, 'L', 1);
                $pdf->SetFillColor(255);
                $pdf->SetFont('Arial', '', 10);
                $pdf->MultiCell(0, 10, utf8_decode(implode(',',$vconc['arra'])), 1, 1, 'L', 1);

            }else{
                $idplantilla = $vconc['idplantillanominal'];

                $pdf->SetFillColor(211);
                $pdf->Cell(0, 10, utf8_decode($vconc['plantilla']), 0, 1, 'C', 1);
                $pdf->SetFillColor(245);
                $pdf->SetFont('Arial', '', 10);
                $pdf->Cell(0, 10, utf8_decode($vconc['idcargo']), 1, 1, 'L', 1);
                $pdf->SetFillColor(255);
                $pdf->MultiCell(0, 10, utf8_decode(implode(' ,',$vconc['arra'])), 1, 1, 'L', 1);
            }
        }
    }


    if(count($auxArrFEs)!=0){
        $pdf->Ln();
        $idplantilla = $auxArrFEs[0]['idplantillanominal'];
        $pdf->SetFillColor(211);
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(0, 10, utf8_decode("Conceptos de percepcion y descuentos sin configuración de escalas"), 0, 1, 'C', 1);
        $pdf->SetFont('Arial', '', 11);
        $pdf->SetFillColor(220);
        $pdf->Cell(0, 10, utf8_decode($auxArrFEs[0]['plantilla']), 0, 1, 'C', 1);
        $pdf->SetFillColor(255);
        foreach($auxArrFEs as $kconc=>$vconc){
            if($idplantilla == $vconc['idplantillanominal']){
                $pdf->SetFillColor(245);
                $pdf->Cell(0, 10, utf8_decode($vconc['denominacion']), 1, 1, 'L', 1);
                $pdf->SetFillColor(255);
                $pdf->SetFont('Arial', '', 10);
                $pdf->MultiCell(0, 10, utf8_decode(implode(',',$vconc['arra'])), 1, 1, 'L', 1);

            }else{
                $idplantilla = $vconc['idplantillanominal'];
                $pdf->SetFont('Arial', 'B', 11);
                $pdf->SetFillColor(211);
                $pdf->Cell(0, 10, utf8_decode($vconc['plantilla']), 0, 1, 'C', 1);
                $pdf->SetFillColor(245);
                $pdf->SetFont('Arial', '', 10);
                $pdf->Cell(0, 10, utf8_decode($vconc['denominacion']), 1, 1, 'L', 1);
                $pdf->SetFillColor(255);
                $pdf->MultiCell(0, 10, utf8_decode(implode(' ,',$vconc['arra'])), 1, 1, 'L', 1);
            }
        }
    }





    $pdf->Output();
	return $pdf;
}
	
public function cabeceraReporte($pdf,$arraPlanESC,$auxArrF,$auxArrFEs,$DenomEstructura,$CodigoEstructura)
{

    $organismo  = 'MINFAR';
    $empresa  = 'XETID';
    $codigo  = '127.0.14420';
    $direccion  = '';

    //Cabecera
	//$pdf->SetFont('Arial', 'B', 20);
    /*$register  = Zend_Registry::getInstance();
    $direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
    $pdf->Image($direccion, 5, 5, 22, 15);*/
    //Logo de la entidad
    /*$arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
    list($imagenBase64,) = explode(';',  $arrEstruct[0]->logo);
    list(,$extension) = explode('/',  $imagenBase64);
    if(!empty($arrEstruct[0]->logo)){
        $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 15, $extension);
    }*/

    $pdf->Ln();
    $pdf->SetLeftMargin(10);
    //Primera fila del encabezado

    $pdf->SetFont('Arial', 'B', 11);
    $pdf->Cell(0,10,"Reporte de elementos salariales al cargo (No Configurados)",0,1,'C',0);

    $pdf->Cell(0,10,utf8_decode('Entidad: '.$DenomEstructura),0,0,'L',0);
    $pdf->SetLeftMargin(50);
    $pdf->Cell(0,10,utf8_decode('Código: '.$CodigoEstructura),0,1,'C',0);

    if(count($arraPlanESC)==0&&count($auxArrF)==0&&count($auxArrFEs)==0){
        $pdf->SetFont('Arial', 'B', 11);
        $pdf->Cell(0,10,"Se ha configurado todos los elementos satisfactoriamente",0,1,'C',0);
    }
    $pdf->Ln(15);

//	$pdf->SetFont('Arial', 'B', 30);
//	$pdf->Cell(0,20,"Reporte de elementos salariales al cargo (No Configurados)",0,1,'C',0);



	return $pdf;
} 
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
 

