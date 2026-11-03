<?php

class PDFRegistrarasistencia extends fpdf
{

    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($datentidad->idestructura);
        $this->SetY(-15);
        $this->SetFont('Arial','I',7);
        $this->Cell(105, 10, utf8_decode($datentidad->denominacion.' ['.$datentidad->abreviatura.']'), 0, 0, 'L');
        if(!empty($arrEstruct[0]->direccion)){
            $this->MultiCell(0, 5, "". utf8_decode($arrEstruct[0]->direccion),0,'R',0);
            $this->Cell(0, 5, utf8_decode(' Teléfono: '.$arrEstruct[0]->telefono), 0, 0, 'R');
        }else{
            $this->Cell(50, 10, utf8_decode('Generado por: '.$perfil['usuario']).' el '.date('d/m/Y H:i'), 0, 0, 'R');
            $this->Cell(0, 10, utf8_decode('Página '.$this->PageNo()), 0, 0, 'R');
        }
    }
}


class DatpdfregistrarasistenciaModel extends ZendExt_Model
{

    public function DatpdfModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($asistencia,$persona,$fechdesde, $fechhasta, $cantidad)
    {
        $habSesiones = new ConfHabilitarsesiones();
        $confSesion = $habSesiones->getHabilitarsesiones();
        $sesiones = $confSesion[0]['habsesion'];

        $pdf = new PDFRegistrarasistencia('P', 'mm','a4');
        $this->crearEncabezadoPrincipal($pdf, $persona, $fechdesde, $fechhasta,$sesiones);
        $pdfNGeneral = $this->crearCuerpo($pdf, $asistencia, $cantidad,$sesiones);
        ob_clean();
        $pdfNGeneral->Output();
    }

    private function crearCuerpo($pdf, $asistencia, $cantidad,$sesiones)
    {
        foreach ($asistencia as $k=>$v) {
            $y = $pdf->GetY();
            if ($y >= 510) {
                $pdf->AddPage();
                $this->getEncabezado($pdf,$sesiones);
            }
            $pdf->SetFont('Arial', 'B', 7);
            $pdf->SetDrawColor(0,0,0);
            $pdf->SetLineWidth(0);

            if($sesiones == 1){
                $pdf->Cell(200, 5, "" . utf8_decode("" . $k), 1, 0, "L",0);
                $pdf->Ln(5);
                foreach ($v as $key=>$val){
                    $fecha = explode('/',$val['fecharegistro']);
                    if($val['finsemana'] == 1) {
                        //$pdf->Cell(6, 5, "" . utf8_decode("" .  $fecha[0]), 1, 0, '', 0);
//                        $pdf->SetFillColor(225,235,247);
                        $pdf->SetFillColor(200);
                        //$pdf->Cell(194, 5, "", 1, 0, '', 1);
                        $pdf->SetFont('Arial', '', 7);
                        $pdf->Cell(6, 5, "" . utf8_decode("" .  $fecha[0]), 1, 0, '', 1);

                        if($val['fechahoraentradaps']) $hentradaps = $val['fechahoraentradaps']; else $hentradaps = '';
                        if($val['fechahorasalidaps']) $hsalidaps = $val['fechahorasalidaps']; else $hsalidaps = '';

                        if($val['fechahoraentradass']) $hentradass = $val['fechahoraentradass']; else $hentradass = '';
                        if($val['fechahorasalidass']) $hsalidass = $val['fechahorasalidass']; else $hsalidass = '';

                        $causaps = $val['denominacionps'];
                        $causass = $val['denominacionss'];
                        $hrsdescontadasps = $val['hrsdescontadasps'];
                        $hrsdescontadasss = $val['hrsdescontadasss'];
                        $horasextrasps = $val['horasextrasps'];
                        $horasextrasss = $val['horasextrasss'];
                        if($val['idcausa']){
                            $pdf->Cell(194, 5, "" . utf8_decode("" . $val['causa']), 1, 0, 'C', 1);
                        }else{
                            $pdf->SetX(11);
                            $pdf->Cell(13, 5, "" . utf8_decode("" . $hentradaps), 1, 0, '', 1);
                            $pdf->Cell(10, 5, "" . utf8_decode("" . $hsalidaps), 1, 0, '', 1);
                            $pdf->Cell(47, 5, "" . utf8_decode("" . $causaps), 1, 0, '', 1);
                            $pdf->Cell(15, 5, "" . utf8_decode("" . $hrsdescontadasps), 1, 0, '', 1);
                            $pdf->Cell(12, 5, "" . utf8_decode("" . $horasextrasps), 1, 0, '', 1);

                            $pdf->SetX(108);
                            $pdf->Cell(13, 5, "" . utf8_decode("" . $hentradass), 1, 0, '', 1);
                            $pdf->Cell(10, 5, "" . utf8_decode("" . $hsalidass), 1, 0, '', 1);
                            $pdf->Cell(47, 5, "" . utf8_decode("" . $causass), 1, 0, '', 1);
                            $pdf->Cell(15, 5, "" . utf8_decode("" . $hrsdescontadasss), 1, 0, '', 1);
                            $pdf->Cell(12, 5, "" . utf8_decode("" . $horasextrasss), 1, 0, '', 1);
                        }
                        $pdf->Ln(5);
//                        $pdf->SetFillColor(0,0,0);
                        continue;
                    }else{
                        $pdf->SetFont('Arial', '', 7);
                        $pdf->Cell(6, 5, "" . utf8_decode("" .  $fecha[0]), 1, 0, '', 0);

                        if($val['fechahoraentradaps']) $hentradaps = $val['fechahoraentradaps']; else $hentradaps = '';
                        if($val['fechahorasalidaps']) $hsalidaps = $val['fechahorasalidaps']; else $hsalidaps = '';

                        if($val['fechahoraentradass']) $hentradass = $val['fechahoraentradass']; else $hentradass = '';
                        if($val['fechahorasalidass']) $hsalidass = $val['fechahorasalidass']; else $hsalidass = '';

                        $causaps = $val['denominacionps'];
                        $causass = $val['denominacionss'];
                        $hrsdescontadasps = $val['hrsdescontadasps'];
                        $hrsdescontadasss = $val['hrsdescontadasss'];
                        $horasextrasps = $val['horasextrasps'];
                        $horasextrasss = $val['horasextrasss'];
                        if($val['idcausa']){
                            $pdf->Cell(194, 5, "" . utf8_decode("" . $val['causa']), 1, 0, 'C', 0);
                        }else{
                            $pdf->SetX(11);
                            $pdf->Cell(13, 5, "" . utf8_decode("" . $hentradaps), 1, 0, '', 0);
                            $pdf->Cell(10, 5, "" . utf8_decode("" . $hsalidaps), 1, 0, '', 0);
                            $pdf->Cell(47, 5, "" . utf8_decode("" . $causaps), 1, 0, '', 0);
                            $pdf->Cell(15, 5, "" . utf8_decode("" . $hrsdescontadasps), 1, 0, '', 0);
                            $pdf->Cell(12, 5, "" . utf8_decode("" . $horasextrasps), 1, 0, '', 0);

                            $pdf->SetX(108);
                            $pdf->Cell(13, 5, "" . utf8_decode("" . $hentradass), 1, 0, '', 0);
                            $pdf->Cell(10, 5, "" . utf8_decode("" . $hsalidass), 1, 0, '', 0);
                            $pdf->Cell(47, 5, "" . utf8_decode("" . $causass), 1, 0, '', 0);
                            $pdf->Cell(15, 5, "" . utf8_decode("" . $hrsdescontadasss), 1, 0, '', 0);
                            $pdf->Cell(12, 5, "" . utf8_decode("" . $horasextrasss), 1, 0, '', 0);
                        }

                    }
                    $pdf->Ln(5);
                }
            }else{
                $pdf->SetFont('Arial', 'B', 7);
                $pdf->Cell(186, 5, "" . utf8_decode("" . $k), 1, 0, "L",1);
                $pdf->Ln(5);

                foreach ($v as $key=>$val){
                    $fecha = explode('/',$val['fecharegistro']);
                    if($val['finsemana'] == 1) {
                        //$pdf->Cell(6, 5, "" . utf8_decode("" .  $fecha[0]), 1, 0, '', 0);
//                        $pdf->SetFillColor(225,235,247);
                        $pdf->SetFillColor(200);
                        //$pdf->Cell(180, 5, "", 1, 0, '', 1);
                        $fechent = explode(' ',$val['fechahoraentrada']);
                        $fechsal = explode(' ',$val['fechahorasalida']);
                        $fechent1 = explode(':',$fechent[1]);
                        $fechsal1 = explode(':',$fechsal[1]);
                        if ($val['fechahoraentrada']) {
                            $hentrada = $fechent1[0] . ':' . $fechent1[1];
                            $fentrada = $fechent[0];
                        }
                        else {
                            $hentrada = '';
                            $fentrada = '';
                        }

                        if ($val['fechahorasalida']) {
                            $hsalida = $fechsal1[0] . ':' . $fechsal1[1];
                            $fsalida = $fechsal[0];
                        }
                        else {
                            $hsalida = '';
                            $fsalida = '';
                        }
                        $causa = $val['causa'];
                        $hrsdescontadas = $val['hrsdescontadas'];
                        $horasextras = $val['horasextras'];
                        $personacontrola = $val['personacontrola'];

                        $pdf->SetFont('Arial', '', 7);
                        $pdf->Cell(6, 5, "" . utf8_decode("" .  $fecha[0]), 1, 0, '', 1);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . ''), 1, 0, 'C', 1);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . ''), 1, 0, 'C', 1);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . ''), 1, 0, 'C', 1);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . ''), 1, 0, 'C', 1);
                        $pdf->Cell(60, 5, "" . utf8_decode("" . ''), 1, 0, 'C', 1);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . ''), 1, 0, 'C', 1);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . ''), 1, 0, 'C', 1);
                        $pdf->Ln(5);
//                        $pdf->SetFillColor(0,0,0);
                        continue;
                    }else{
                        $pdf->SetFont('Arial', '', 7);
                        $fechent = explode(' ',$val['fechahoraentrada']);
                        $fechsal = explode(' ',$val['fechahorasalida']);
                        $fechent1 = explode(':',$fechent[1]);
                        $fechsal1 = explode(':',$fechsal[1]);
                        if ($val['fechahoraentrada']) {
                            $hentrada = $fechent1[0] . ':' . $fechent1[1];
                            $fentrada = $fechent[0];
                        }
                        else {
                            $hentrada = '';
                            $fentrada = '';
                        }

                        if ($val['fechahorasalida']) {
                            $hsalida = $fechsal1[0] . ':' . $fechsal1[1];
                            $fsalida = $fechsal[0];
                        }
                        else {
                            $hsalida = '';
                            $fsalida = '';
                        }
                        $causa = $val['causa'];
                        $hrsdescontadas = $val['hrsdescontadas'];
                        $horasextras = $val['horasextras'];
                        $personacontrola = $val['personacontrola'];

                        $pdf->SetFont('Arial', '', 7);
                        $pdf->Cell(6, 5, "" . utf8_decode("" .  $fecha[0]), 1, 0, '', 0);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . $fentrada), 1, 0, 'C', 0);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . $hentrada), 1, 0, 'C', 0);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . $fsalida), 1, 0, 'C', 0);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . $hsalida), 1, 0, 'C', 0);
                        $pdf->Cell(60, 5, "" . utf8_decode("" . $causa), 1, 0, 'C', 0);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . $hrsdescontadas), 1, 0, 'C', 0);
                        $pdf->Cell(20, 5, "" . utf8_decode("" . $horasextras), 1, 0, 'C', 0);
                    }

                    $pdf->Ln(5);
                }
            }

        }
        return $pdf;
    }

    private function crearEncabezadoPrincipal(&$pdf, $persona,$fechdesde , $fechhasta,$sesiones)
    {
        $pdf->SetLeftMargin(5);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 12);
        $pdf->SetLineWidth(0);
        $x = $pdf->GetX();
        $pdf->SetX($x - 0.3);
        $pdf->Cell(200, 0, utf8_decode('Registro de asistencia'), 0, 0, 'C', 0);
        $pdf->Ln(5);
        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(32, 5, utf8_decode('Nombre y apellidos: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, utf8_decode($persona['nombreapellidos']), 0, 1, 'L', 0);
        $pdf->SetFont('Arial', 'B', 9);

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(14, 5, utf8_decode('Entidad: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(30, 5, utf8_decode($persona['denomentidad']), 0, 1, 'L', 0);

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(9, 5, utf8_decode('Área: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, utf8_decode($persona['denomarea']), 0, 1, 'L', 0);

        $pdf->SetFont('Arial', 'B', 9);
        $pdf->Cell(11, 5, utf8_decode('Cargo: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 9);
        $pdf->Cell(0, 5, utf8_decode($persona['denomcargo']), 0, 1, 'L', 0);

        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(12, 6, utf8_decode('Periodo: '), 0, 0, 'L', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(30, 6, utf8_decode($fechdesde.' - '.$fechhasta), 0, 1, 'L', 0);
        //$pdf->Ln();
        $pdf->Ln(5);
        $pdf->SetLineWidth(0.3);
        $pdf->SetFillColor(200);
//        $pdf->SetFillColor(193,213,240);
        $pdf->SetFont('Arial', 'B', 7);

        if($sesiones == 1){
            $pdf->Cell(6, 8, utf8_decode('Día'), 1, 0, 'C', 1);
            $pdf->Cell(97, 4, utf8_decode('Primera sesión'), 1, 0, 'C', 1);
            $pdf->Cell(97, 4, utf8_decode('Segunda sesión'), 1, 0, 'C', 1);
            $pdf->Ln(4);
            $pdf->SetX(11);
            $pdf->Cell(13, 4, 'Entrada', 1, 0, 'C', 1);
            $pdf->Cell(10, 4, 'Salida', 1, 0, 'C', 1);
            $pdf->Cell(47, 4, 'Causa', 1, 0, 'C', 1);
            $pdf->Cell(15, 4, 'Perdidas', 1, 0, 'C', 1);
            $pdf->Cell(12, 4, 'Extras', 1, 0, 'C', 1);

            $pdf->SetX(108);
            $pdf->Cell(13, 4, 'Entrada', 1, 0, 'C', 1);
            $pdf->Cell(10, 4, 'Salida', 1, 0, 'C', 1);
            $pdf->Cell(47, 4, 'Causa', 1, 0, 'C', 1);
            $pdf->Cell(15, 4, 'Perdidas', 1, 0, 'C', 1);
            $pdf->Cell(12, 4, 'Extras', 1, 0, 'C', 1);
            $pdf->Ln(4);

        }else{
            $pdf->Cell(6, 5, utf8_decode('Día'), 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Fecha entrada', 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Hora entrada', 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Fecha salida', 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Hora salida', 1, 0, 'C', 1);
            $pdf->Cell(60, 5, 'Causa', 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Perdidas', 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Extras', 1, 0, 'C', 1);
            $pdf->Ln(5);
        }

    }

    private function getEncabezado(&$pdf,$sesiones)
    {
        $pdf->SetFillColor(200);
//        $pdf->SetFillColor(193,213,240);
        $pdf->SetFont('Arial', 'B', 7);
        $pdf->SetLineWidth(0);
        $x = $pdf->GetX();
        $pdf->SetX($x - 0.3);
        if($sesiones == 1){
            $pdf->Cell(6, 8, utf8_decode('Día'), 1, 0, 'C', 1);
            $pdf->Cell(97, 4, utf8_decode('Primera sesión'), 1, 0, 'C', 1);
            $pdf->Cell(97, 4, utf8_decode('Segunda sesión'), 1, 0, 'C', 1);
            $pdf->Ln(4);
            $pdf->SetX(11);
            $pdf->Cell(13, 4, 'Entrada', 1, 0, 'C', 1);
            $pdf->Cell(10, 4, 'Salida', 1, 0, 'C', 1);
            $pdf->Cell(47, 4, 'Causa', 1, 0, 'C', 1);
            $pdf->Cell(15, 4, 'Perdidas', 1, 0, 'C', 1);
            $pdf->Cell(12, 4, 'Extras', 1, 0, 'C', 1);

            $pdf->SetX(108);
            $pdf->Cell(13, 4, 'Entrada', 1, 0, 'C', 1);
            $pdf->Cell(10, 4, 'Salida', 1, 0, 'C', 1);
            $pdf->Cell(47, 4, 'Causa', 1, 0, 'C', 1);
            $pdf->Cell(15, 4, 'Perdidas', 1, 0, 'C', 1);
            $pdf->Cell(12, 4, 'Extras', 1, 0, 'C', 1);
            $pdf->Ln(4);

        }else{
            $pdf->Cell(6, 5, utf8_decode('Día'), 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Fecha entrada', 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Hora entrada', 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Fecha salida', 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Hora salida', 1, 0, 'C', 1);
            $pdf->Cell(60, 5, 'Causa', 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Perdidas', 1, 0, 'C', 1);
            $pdf->Cell(20, 5, 'Extras', 1, 0, 'C', 1);
            $pdf->Ln(5);
        }

    }


}