<?php
/**
 * Controlador para gestionar elementos salariales a las personas.
 *
 * @author Ing. Tte. Frank Rodriguez Berroa.
 * @package Pvd.
 * @subpackage Nomina - Configuracion.
 * @category Clase controladora.
 * @uses 
 * @copyright UCID
 * @version 1.0
 */
class PDFNomina extends fpdf
{
    function Footer()
    {
        $this->SetFont('Arial', 'B', 10);
        $this->Ln(10);
        $this->SetX(20);
        $this->Write(10,'POR RECURSOS HUMANOS');
        $this->SetX(300);
        $this->Write(10,'POR EL AREA CONTABLE');
        $this->Ln();
        $this->SetX(20);
        $this->Write(10,'ELABORADO POR:');
        $this->SetX(300);
        $this->Write(10,'REVISADO POR:');
        $this->Ln();
        $this->SetX(20);
        $this->Write(10,'REVISADO Y APROBADO POR:');
        $this->SetX(300);
        $this->Write(10,'CONTABILIZADO POR:');
        $this->SetFont('Arial', 'B', 10);
        $this->Ln(20);
        $this->Cell(0,10,' '.$this->PageNo(),0,0,'C');


    }
}

class ReporteExportarPDFModel extends ZendExt_Model {

    public function ReporteExportarPDFModel() {
        parent::ZendExt_Model();
    
	}
	

public function exportarReporte($idconfreportescertificaciones,$idreportescertificaciones,$tipoelemento,$historico){
    $pdf = new PDFNomina('L', 'mm', array(440,560));
	$pdf->SetTitle("SNC-225");
	$pdf->SetAuthor("Tte. Ing. Frank Rodriguez Berroa");
	$pdf->SetLeftMargin(2);
    $pdf->AddPage();
    $pdf->SetFont('Arial', 'B', 20);
    $pdffinal = $this->cabeceraReporte($pdf, $idreportescertificaciones);
    $pdffinal = $this->cuerpoReporte($pdf, $idconfreportescertificaciones,$idreportescertificaciones,$tipoelemento,$historico);
	$pdffinal->Output();
}

public function observacionesReporte($pdf){ 

	return $pdf;
}

public function cuerpoReporte($pdf, $idconfreportescertificaciones,$idreportescertificaciones,$tipoelemento,$historico){
    $pdf->Ln(10);
	$pdf->SetX(0);
    $pdf->SetFont('Arial', 'B', 15);
    $obj = new DatReportesCertificaciones();
    $arraydatosbuscar = array();
    $indicadores = $obj->obtenerDatosConfVariables($idconfreportescertificaciones);

    foreach($indicadores as $iind=>$rind){
        $arraydatosbuscar[$rind->idvariable]['variable'] = $rind->variable;
    }

    if($historico==0)
    {
        $objE = new DatElementosReportesCertificaciones();
        $datos = $objE->obtenerElementosReportesCertificacionesPersona($idreportescertificaciones);

    }else
    {
        $objE = new HisElementosReportesCertificaciones();
        $datos = $objE->obtenerElementosReportesCertificacionesPersona($idreportescertificaciones);
    }

    foreach($indicadores as $key=>$val){
        foreach($datos as $k=>$v){
            $datos[$k][$val->variable] = $v[$val->idvariable];

        }
    }
    $columnas = count($arraydatosbuscar)+3;
    $anchocolumnasreporte = (550-220)/count($arraydatosbuscar);
    //Pintando las columnas que son fijas, ej: nombre, ci, categoria
	$pdf->Cell(55,10,utf8_decode("Carnet de identidad"),1,0,'C');
	$pdf->Cell(100,10,"Nombre y apellidos",1,0,'C');
    $pdf->Cell(65,10,utf8_decode("Categoría ocupacional"),1,0,'C');
    //Pintando las columnas que vienen a continuacion, titulos de las columnas que vienen del reporte
    foreach($arraydatosbuscar as $ic=>$rcol){
        $pdf->Cell($anchocolumnasreporte,10,utf8_decode($rcol['variable']),1,0,'C');
    }
    $pdf->Ln(10);
    $pdf->SetX(0);
    //Pintando los datos de las personas
    $pdf->SetFont('Arial', '', 14);
    foreach($datos as $idat=>$rdat){
        $datospersona = $this->pIntegrator->pvd->getPrincipalesDatosPersona(array($rdat['idelemento']),null,null,null,null,null);
        $ci = $datospersona->data[0]['numid'];
        $nombreapp = $datospersona->data[0]['nombre'].' '.$datospersona->data[0]['snombre'].' '.$datospersona->data[0]['sapel'].' '.$datospersona->data[0]['papel'];
        $datoscargo = $this->integrator->metadatos->obtenerDatosCargo(array($datospersona->data[0]['idcargo']));
        $categoriaocupacional = $datoscargo[0]['grupocategoria'];
        //Pintando el nombre, ci, categoria
        $pdf->Cell(55,10,utf8_decode($ci),1,0,'C');
        $pdf->Cell(100,10,utf8_decode($nombreapp),1,0,'C');
        $pdf->Cell(65,10,utf8_decode($categoriaocupacional),1,0,'C');
        //Recorriendo los indicadores para pintar los valores de las personas
        foreach($arraydatosbuscar as $idvariable=>$rdvar){//print_r($rdat["$idvariable"]);die;
            $pdf->Cell($anchocolumnasreporte,10,utf8_decode($rdat["$idvariable"]),1,0,'C');
        }
        $pdf->Ln(10);
        $pdf->SetX(0);
    }
    $pdf->Output();
	return $pdf;
}
	
public function cabeceraReporte($pdf, $idreportescertificaciones)
{
    $objreporte = new DatReportesCertificaciones();
    $datosreporte = $objreporte->obtenerObjReporteDadoId($idreportescertificaciones);
    $fechainicio = explode('/', $datosreporte->fechainicio);
    $fechafin = explode('/', $datosreporte->fechainicio);
    $diainicio = $fechainicio[0];
    $mesinicio = $fechainicio[1];
    $annoinicio = $fechainicio[2];
    $diafin = $fechafin[0];
    $mesfin = $fechafin[1];
    $annofin = $fechafin[2];
    $organismo  = 'MINFAR';
    $empresa  = 'XETID';
    $codigo  = '127.0.14420';
    $direccion  = '';

    //Cabecera
	$pdf->SetFont('Arial', 'B', 20);
	
    //Primera fila del encabezado
	$pdf->SetX(500);    
    $pdf->Cell(50,40,"",1,0);
	$pdf->SetX(0);
	$pdf->SetFont('Arial', 'B', 30);
	$pdf->MultiCell(500,20,"Modelo de reportes, certificaciones"."\n y


	",1,'C',0);
	//Segunda fila del encabezado
	$pdf->SetFont('Arial', 'B', 15);
	$pdf->Text(505, 20, "No.");
	$pdf->Ln(0);
	//Tercera fila del encabezado
	//$pdf->Ln(40);
	$pdf->SetX(0);
	$pdf->Cell(110,40,"",1,0);
	$pdf->Cell(110,40,"",1,0);
	$pdf->Cell(110,40,"",1,0);
	$pdf->Cell(110,40,"",1,0);
	$pdf->Cell(110,10,"",1,0);
	$pdf->Ln(10);
	$pdf->SetX(440);
	$pdf->Cell(55,10,"",1,0);
	$pdf->Cell(55,10,"",1,0);
	$pdf->Ln(10);
	$pdf->SetX(440);
	$pdf->Cell(18.3,10,"D",1,0,C);
	$pdf->Cell(18.3,10,"M",1,0,C);
	$pdf->Cell(18.3,10,"A",1,0,C);
	$pdf->Cell(18.3,10,"D",1,0,C);
	$pdf->Cell(18.3,10,"M",1,0,C);
	$pdf->Cell(18.4,10,"A",1,0,C);
	$pdf->Ln(10);
	$pdf->SetX(440);
    //Imprimiendo los dias, meses y años del alta y la baja
    $pdf->SetFont('Arial', 'B', 12);
	$pdf->Cell(18.3,10,$diainicio,1,0);
	$pdf->Cell(18.3,10,$mesinicio,1,0);
	$pdf->Cell(18.3,10,$annoinicio,1,0);
	$pdf->Cell(18.3,10,$diafin,1,0);
	$pdf->Cell(18.3,10,$mesfin,1,0);
	$pdf->Cell(18.4,10,$annofin,1,0);
	//Textos de la tercera fila ubicados mediante coordenadas
    $pdf->SetFont('Arial', 'B', 15);
	$pdf->Text(30, 60, "ORGANISMO");
	$pdf->SetFont('Arial', 'B', 30);
	$pdf->Text(25, 80, "".$organismo);
    $pdf->Text(150, 60, "ENTIDAD");
	$pdf->SetFont('Arial', 'B', 30);
	$pdf->Text(130, 80, "".$empresa);
    $pdf->SetFont('Arial', 'B', 15);
    $pdf->Text(260, 60, utf8_decode("CÓDIGO"));
	$pdf->SetFont('Arial', 'B', 30);
	$pdf->Text(240, 80, "".$codigo);
    $pdf->SetFont('Arial', 'B', 15);
    $pdf->Text(365, 60, utf8_decode("DIRECCIÓN"));
	$pdf->Text(485, 57, "FECHA DE:");
	$pdf->Text(459, 68, "ALTA");
	$pdf->Text(515, 68, "BAJA");

	return $pdf;
} 
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
 

