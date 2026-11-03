<?php


/**
 * Controlador para gestionar elementos salariales a las personas.
 *
 * @author Ing. Milena Gainza Rodríguez.
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
        $this->Ln(30);
        $this->SetX(20);
        $this->Write(10, 'POR RECURSOS HUMANOS');
        $this->SetX(300);
        $this->Write(10, 'POR EL AREA CONTABLE');
        $this->Ln();
        $this->SetX(20);
        $this->Write(10, 'ELABORADO POR:');
        $this->SetX(300);
        $this->Write(10, 'REVISADO POR:');
        $this->Ln();
        $this->SetX(20);
        $this->Write(10, 'REVISADO Y APROBADO POR:');
        $this->SetX(300);
        $this->Write(10, 'CONTABILIZADO POR:');
        $this->SetFont('Arial', 'B', 10);
        $this->Ln(20);
        $this->Cell(0, 10, ' ' . $this->PageNo(), 0, 0, 'C');


    }
}

class PDF extends fpdf
{
    // Método para definir el pie de página
    function Footer()
    {
        // Posición a 1.5 cm del fondo
        $this->SetY(-15);
        // Seleccionar fuente
        $this->SetFont('Arial', 'I', 8);
        // Número de página
        $this->Cell(0, 10, '' . $this->PageNo(), 0, 0, 'C');
        
        // Puedes agregar más información al pie de página aquí
        // Ejemplo: $this->Cell(0, 10, 'Texto adicional', 0, 0, 'C');
    }
}


class ReporteExportarbancopdfModel extends ZendExt_Model
{

    public function ReporteSNCpdfModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($datospersona)
    {
        

        $cont = 0;
        $cont1 = 0;
        $final = array();
        foreach ($datospersona as $k => $v) {
            $aux[$k] = $v['idplantillanominal'];
        }
        array_multisort($aux, SORT_ASC, SORT_STRING, $datospersona);
        $pdf = new PDFNomina('L', 'mm', array(600, 565));
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 20);
        $pdffinal = $this->cabeceraReporte($pdf, $datospersona);

        for ($i = 0; $i < 1; $i++) {
            $pdffinal = $this->cuerpoReporte($pdf, $datospersona);
        }

        $pdffinal->Output();
    }

    public function observacionesReporte($pdf)
    {
        //Imprimiendo las observaciones
        $ypossition = $pdf->GetY();
        $pdf->Cell(550, 40, "", 1, 0, 'C');
        $pdf->Text(5, $ypossition + 5, "OBSERVACIONES");
        $pdf->Ln(40);
        $pdf->SetX(5);

        return $pdf;
    }

    public function cuerpoReporte($pdf, $datospersona)
    {
        $cantPersonas = count($datospersona);
        $pdf->SetFont('Arial', '', 12);
        $pdf->Ln(10);
        $pdf->SetX(5);

        $pdf->SetX(5);
        $no = 0;
        $cant_tn = 0;
        $cant_td = 0;
        $cant_n = 0;
        $cant_d = 0;
        $si = $datospersona[0][denominacion];
        $pdf->SetFont('Arial', 'B', 12);

        $pdf->Cell(550, 10, "" . utf8_decode("" . $si), 1, 0);
        $pdf->Ln(10);
        foreach ($datospersona as $i => $datos) {
            $pdf->SetFont('Arial', '', 12);

            $no++;
            $cant_tn = $cant_tn + $datos[importe_n];
            $cant_td = $cant_td + $datos[importe_d];


            if ($si == $datos[denominacion]) {
                $cant_n = $cant_n + $datos[importe_n];
                $cant_d = $cant_d + $datos[importe_d];

                $pdf->SetX(5);
                $pdf->Cell(110, 10, "" . utf8_decode("" . $datos[nombreyapellidos]), 1, 0, "C");
                $pdf->Cell(110, 10, "" . utf8_decode("" . $datos[num_ideper]), 1, 0, "C");
                $pdf->Cell(110, 10, "" . utf8_decode("" . $datos[importe_n]), 1, 0, "C");
                $pdf->Cell(110, 10, "" . utf8_decode("" . $datos[importe_d]), 1, 0, "C");
                $pdf->Cell(110, 10, "", 1, 0, 'C');
            } else {

                $si = $datos[denominacion];
                $pdf->SetFont('Arial', 'B', 12);
                $pdf->Cell(220, 10, "" . utf8_decode("" . 'Subtotal'), 1, 0);
                $pdf->Cell(110, 10, "" . $cant_n, 1, 0, 'C');
                $pdf->Cell(220, 10, "" . $cant_d, 1, 0);
                $cant_n = $datos[importe_n];
                $cant_d = $datos[importe_d];

                $pdf->Ln(10);
                $pdf->SetX(5);
                $pdf->Cell(550, 10, "" . utf8_decode("" . $si), 1, 0);
                $pdf->SetFont('Arial', '', 12);
                $pdf->Ln(10);
                $pdf->SetX(5);
                $pdf->Cell(110, 10, "" . utf8_decode("" . $datos[nombreyapellidos]), 1, 0, "C");
                $pdf->Cell(110, 10, "" . utf8_decode("" . $datos[num_ideper]), 1, 0, "C");
                $pdf->Cell(110, 10, "" . utf8_decode("" . $datos[importe_n]), 1, 0, "C");
                $pdf->Cell(110, 10, "" . utf8_decode("" . $datos[importe_d]), 1, 0, "C");
                $pdf->Cell(110, 10, "", 1, 0, 'C');
            }


            $pdf->Ln(10);
            $pdf->SetX(5);
        }
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Cell(220, 10, "" . utf8_decode("" . 'Subtotal'), 1, 0);
        $pdf->Cell(110, 10, "" . $cant_n, 1, 0);
        $pdf->Cell(220, 10, "" . $cant_d, 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(5);
        $pdf->Cell(220, 10, "" . utf8_decode("" . 'Subtotal general'), 1, 0);
        $pdf->Cell(110, 10, "" . $cant_tn, 1, 0);
        $pdf->Cell(220, 10, "" . $cant_td, 1, 0);


        return $pdf;
    }

    public function cabeceraReporte($pdf, $datospersona)
    {
        

        //Cabecera
        $pdf->SetFont('Arial', 'B', 20);

        //Primera fila del encabezado
        $pdf->SetX(520);
        // $pdf->Cell(50,40,"",1,0);
        $pdf->SetX(5);
        $pdf->SetFont('Arial', 'B', 30);
        $pdf->MultiCell(550, 15, "Entidad" . " ", 1, 'C');


        //Segunda fila del encabezado
        $pdf->SetFont('Arial', 'B', 15);
        //$pdf->Text(505, 20, "No.");
        //$pdf->Ln(0);
        $pdf->SetX(5);
        $pdf->Cell(275, 10, "", 1, 0);
        $pdf->Cell(275, 10, "", 1, 0);

        //Tercera fila del encabezado

        $pdf->SetX(5);
        $pdf->Cell(275, 20, "", 1, 0);
        $pdf->Cell(275, 20, "", 1, 0);   //CUARTA FILA
        $pdf->Ln(20);
        $pdf->SetX(5);
        $pdf->Cell(110, 10, "", 1, 0);
        $pdf->Cell(110, 10, "", 1, 0);
        $pdf->Cell(110, 10, "", 1, 0);
        $pdf->Cell(110, 10, "", 1, 0);
        $pdf->Cell(110, 10, "", 1, 0);

        //Textos de la segunda fila ubicados mediante coordenadas
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->Text(100, 32, "NOMBRE");
        $pdf->Text(45, 41, utf8_decode('Empresa de tecnologías de la información para la defensa'));

        //$pdf->SetFont('Arial', 'B', 30);
        //$pdf->Text(15, 80, "".utf8_decode($papell));
        $pdf->SetFont('Arial', 'B', 15);


        $pdf->Text(400, 32, "CODIGO");
        $pdf->Text(400, 41, utf8_decode('127.0.0.1'));
        $pdf->SetFont('Arial', 'B', 30);
        $pdf->Text(125, 80, "" . utf8_decode($sapell));
        $pdf->SetFont('Arial', 'B', 15);


        $pdf->Text(30, 52, "NOMBRE Y APELLIDOS");
        $pdf->SetFont('Arial', 'B', 30);
        $pdf->Text(125, 80, "" . utf8_decode($sapell));
        $pdf->SetFont('Arial', 'B', 15);


        $pdf->Text(130, 52, "CI");
        $pdf->SetFont('Arial', 'B', 30);
        $pdf->Text(125, 80, "" . utf8_decode($sapell));
        $pdf->SetFont('Arial', 'B', 15);


        $pdf->Text(270, 52, "MN");
        $pdf->SetFont('Arial', 'B', 30);
        $pdf->Text(125, 80, "" . utf8_decode($sapell));
        $pdf->SetFont('Arial', 'B', 15);


        $pdf->Text(370, 52, "CUC");
        $pdf->SetFont('Arial', 'B', 30);
        $pdf->Text(125, 80, "" . utf8_decode($sapell));
        $pdf->SetFont('Arial', 'B', 15);


        $pdf->Text(490, 52, "FIRMA");
        $pdf->SetFont('Arial', 'B', 30);
        $pdf->Text(125, 80, "" . utf8_decode($sapell));
        $pdf->SetFont('Arial', 'B', 15);


        $dir_www = str_ireplace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);


        return $pdf;
    }

    public function construirReportePeriododePago($identidad, $plantillasN, $arrpersonas)
    {
        $sql="SELECT de.codigo, de.denominacion FROM mod_estructuracomp.dat_estructura de where de.idestructura = $identidad";
        $mg = Doctrine_Manager::getInstance();
        $conn = $mg->getCurrentConnection();
        $datos = $conn->fetchAll($sql);
        $importetotal = 0;
        
        foreach($arrpersonas as $i=> $d){
            $importetotal += $d['importe_n'];
        }
        
        $pdf = new PDF('L', 'mm','A4');  //210x297
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->Text(110,10,('Listado de Personas por Cajeros'));
        $y = $pdf->getY();
        $pdf->setY($y+10);
        $pdf->SetFillColor(230); 

        $pdf->Cell(240,10,utf8_decode('Número Unidad Militar: '.$datos[0]['codigo']), 0, 0);
        $pdf->Cell(40,10,utf8_decode('Cant personas: '.count($arrpersonas)), 0,1,'R');
        $pdf->Cell(240,10,utf8_decode('Unidad Militar: '.$datos[0]['denominacion']), 0, 0);
        $pdf->Cell(40,10,utf8_decode('Importe total: '.number_format($importetotal, 2, '.', '')), 0,1,'R');

       $pdf->Cell(40,10,utf8_decode('NUM_IDEPER'), 'B',0, 'L', 1);
       $pdf->Cell(80,10,utf8_decode('Nombre y Apellidos'), 'B',0, 'L', 1);
       $pdf->Cell(35,10,utf8_decode('COD_TIPID'), 'B',0, 'C', 1);
       $pdf->Cell(45,10,utf8_decode('COD_PAEXID'), 'B',0, 'C', 1);
       $pdf->Cell(40,10,utf8_decode('CTA_MNAC'), 'B',0, 'C', 1);
       $pdf->Cell(40,10,utf8_decode('IMPORTE_N'), 'B',1,'R', 1); 
       $general;

       foreach($plantillasN as $j => $pn){
        $subtotal = 0; 
        $pdf->SetFont('Arial', 'B', 12);  
        $pdf->Cell(100,10,utf8_decode($pn),0,1);
        foreach($arrpersonas as $i=> $ps){
            
            
            if($pn == $ps['denominacion']){
                $pdf->SetFont('Arial', '', 12); 
                $pdf->Cell(40,10,utf8_decode($ps['num_ideper']), 0);
                $pdf->Cell(80,10,utf8_decode($ps['nombreyapellidos']), 0, 0,'l');
                $pdf->Cell(40,10,utf8_decode($ps['cod_tipid']),  0, 0,'C');
                $pdf->Cell(40,10,utf8_decode($ps['cod_paexid']),  0, 0,'C');
                $pdf->Cell(40,10,utf8_decode($ps['cta_mnac']), 0);
                $pdf->Cell(40,10,utf8_decode($ps['importe_n']), 0,1,'R');
                $subtotal += $ps['importe_n'];
            }
        }
        
        
        $general += $subtotal;
        $pdf->Cell(255,10,utf8_decode('Subtotal Importe: '),0);
        $pdf->Cell(50,10,(sprintf('%0.2f', round($subtotal, 2))),0,1);
        $y = $pdf->getY();
        $pdf->setY($y+10);
       }

        $pdf->Cell(255,10,utf8_decode('Subtotal General: '), '',0, 'L', 1);
        //  $pdf->Cell(50,10,(sprintf('%0.2f', round($general, 2))),0,1);
        $pdf->Cell(50,10,(number_format($general, 2, '.', '')),0,1);

            //Primera fila
        $pdf->setY(183); 
        $pdf->SetFont('Arial', '', 12);
        $arrdatosfirmas = ['Jefe de Economía y/o Finanzas','Jefe de Unidad'];
        $contcolumnas = 0;

        foreach ($arrdatosfirmas as $firma) {
            $saltolinea = ($contcolumnas % 2 == 0) ? 0 : 1;
            $pdf->Cell(180, 5, utf8_decode($firma . ': ' . ' ______________'), 0, $saltolinea, "L");
            $contcolumnas++;
        } 
        
        $pdf->Output();
    }
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
 

