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


    }
}


class ReporteTirillapagopdfModel extends ZendExt_Model {

    public function ReporteTirillapagopdfModel() {
        parent::ZendExt_Model();

    }


    public function construirReporte($datospersona){
        $pdf  = new PDFNomina('L', 'mm','A3');
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 20);
        $pdffinal = $this->cuerpoReporte($pdf, $datospersona);
        $pdffinal->Output();

    }

    public function cuerpoReporte($pdf, $datospersona){

        $grupo = 'grupo en desarrollo';
        $area = 'area en desarrollo';
        //  $pdf->Cell(110,10,"".utf8_decode("".$datos[nombreyapellidos]),1,0, "C");
        foreach($datospersona as $k=>$v){
            $pdf->SetFont('Arial', 'I', 15);
            $pdf->Cell(15,15,"Area:  ",0,'L');
            $pdf->Cell(250,15,"".utf8_decode("".$v[denominacion]),0,'L');
            $pdf->Cell(20,15,"Grupo:  ",0,'C');
            $pdf->Cell(120,15," ",0,'C');
           // if("".utf8_decode("".$v['Vac. Dias.'])){ $dias="".utf8_decode("".$v['Vac. Dias.']);}else{$se=0.00;}
            $pdf->Cell(50,15,"Vac.Dias: ",0,'L');
            $pdf->Cell(50,15,"",0,'L');
            $pdf->Cell(50,15," Salario",0,1,'L');

            $pdf->Cell(50,15,"Lug.Pago: ",0,'L');
            $pdf->Cell(100,15," ",0,'L');

            $pdf->Cell(30,15,"Empl:  ",0,'L');
            $pdf->Cell(170,15,"".utf8_decode("".$v['nombreyapellidos']),0,'L');
            $pdf->Cell(50,15,"Vac.Imp.:  ",0,'L');
            $pdf->Cell(50,15,"",0,'L');
            $pdf->Cell(50,15," Periodo",0,'L');
            $pdf->Cell(50,15," ",0,1,'L');
         //   if("".utf8_decode("".$v[SE])){ $se="".utf8_decode("".$v[SE]);}else{$se=0.00;}
            $pdf->Cell(50,15,"Sal basico ",0,'L');
           $pdf->Cell(20,15,"",0,'L');
            $pdf->Cell(50,15,"Tpo.Pagar:  ",0,'L');
            $pdf->Cell(20,15," ",0,'L');
            $pdf->Cell(50,15,"Estim:  ",0,'L');
            $pdf->Cell(20,15,"",0,'L');
            $pdf->Cell(50,15, "Cpl:  ",0,'L');
            $pdf->Cell(20,15, "",0,'L');
            $pdf->Cell(50,15,"Retencion:  ",0,'L');
            $pdf->Cell(20,15," ",0,'L');
            $pdf->Cell(50,15,"Vac. Dias. Acum:  ",0,'L');
            $pdf->Cell(20,15,"  ",0,1,'L');

         //   if("".utf8_decode("".$v[PAP])){ $pap="".utf8_decode("".$v[PAP]);}else{$se=0.00;}
            $pdf->Cell(50,15,"Adc.Pla/Cat:",0,'L');
           $pdf->Cell(20,15,"",0,'L');
            $pdf->Cell(50,15,"Tpo.Desc:  ",0,'L');
            $pdf->Cell(20,15," ",0,'L');
            $pdf->Cell(50,15, "Sal.Cpl:  ",0,'L');
            $pdf->Cell(20,15," ",0,'L');
            $pdf->Cell(50,15, "Coef.DS:  ",0,'L');
            $pdf->Cell(20,15," ",0,'L');
            $pdf->Cell(50,15,"Descuento:  ",0,'L');
            $pdf->Cell(20,15," ",0,'L');
            $pdf->Cell(50,15,"Vac. Imp. Acum:  ",0,'L');
            $pdf->Cell(20,15," ",0,1,'L');


            $pdf->Cell(50,15,"Adc.Otr.:",0,'L');
            $pdf->Cell(20,15," ",0,'L');
            $pdf->Cell(50,15,"Cond.Extras.:  ",0,'L');
            $pdf->Cell(20,15," ",0,'L');
            $pdf->Cell(50,15,"Feriad.Dobles:  ",0,'L');
            $pdf->Cell(20,15," ",0,'L');
            $pdf->Cell(50,15, "Penal:  ",0,'L');
            $pdf->Cell(40,15," ",0,'L');
            $pdf->Cell(50,15," ",0,'L');
            $pdf->Cell(25,15,"A cobrar:  ",0,'L');
            $pdf->Cell(30,15,"".utf8_decode("".$v[importe_n]),0,'L');
            $pdf->Cell(25,15,"CUC:  ",0,1,'L');
            $pdf->Cell(20,15," ",0,'L');
            $pdf->Cell(20,15," ",0,1,'L');
            $pdf->Cell(550,4,"",'T',1,'L');
        }
        return $pdf;



    }

}


