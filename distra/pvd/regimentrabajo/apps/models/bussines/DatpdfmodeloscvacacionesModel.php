<?php
include 'PDF_MC_Table.php';

class PDFModeloSCVacaciones extends fpdf
{
    function Footer()
    {
        $perfil = $_SESSION['Zeolides']['perfil'];
        $datentidad = $_SESSION['Zeolides']['entidad'];
        $this->SetY(-15);
        $this->SetFont('Arial', 'I', 7);
        $this->Cell(70, 10, utf8_decode($datentidad->denominacion . ' [' . $datentidad->abreviatura . ']'), 0, 0, 'L');
        $this->Cell(100, 10, utf8_decode('Generado por: ' . $perfil['usuario']) . ' el ' . date('d/m/Y H:i'), 0, 0, 'R');
        $this->Cell(0, 10, utf8_decode('Página ' . $this->PageNo()), 0, 0, 'R');
    }
}


class DatpdfmodeloscvacacionesModel extends ZendExt_Model
{

    public function DatpdfmodeloscvacacionesModel()
    {
        parent::ZendExt_Model();

    }


    public function construirReporte($result, $anno, $fecha, $revisadopor, $aprobadopor, $elaboradopor)
    {
        $pdf = new PDFModeloSCVacaciones('P', 'mm', 'a4');
        $pdffinal = $this->cabeceraReporte($pdf, $anno, $fecha);
        $pdffinal = $this->cuerpoReporte($pdf, $result, $anno, $fecha, $revisadopor, $aprobadopor, $elaboradopor);
        ob_clean();
        $pdffinal->Output();
    }


    public function cuerpoReporte($pdf, $result, $anno, $fecha, $revisadopor, $aprobadopor, $elaboradopor)
    {
        $confCalendario = new ConfCalendario();
        $mesactual = date('m');
        $fprox = date('d/m/Y', strtotime('+1 months', strtotime(date('Y-m-d'))));
        $mesprox = explode('/', $fprox);
        foreach ($result as $i => $v) {
            foreach ($v as $k => $person) {
                for ($i = 1; $i <= 2; $i++) {
                    $fechaempieza = '';
                    $fechadesde = '';
                    if (!empty($person['fhasta'])) {
                        $ffin = explode('/', $person['fhasta']);
                        $ffin1 = date_create($ffin[2] . '-' . $ffin[1] . '-' . $ffin[0]);
                        date_add($ffin1, date_interval_create_from_date_string('1 day'));
                        $FITEMPORAL = explode('/', $ffin1->format('d/m/Y'));
                        $ffin1 = date_create($FITEMPORAL[2] . '-' . $FITEMPORAL[1] . '-' . $FITEMPORAL[0]);
                        $fech = $ffin1->format('d/m/Y');
                        if (!empty($person['idgrupodescanso'])) {
                            $calendario = $confCalendario->getCalendarioByFecha($fech, $person['idgrupodescanso']);
                            if(!empty($calendario)){
                                if ($calendario[0]['trabajo'] == 0 || empty($calendario)) {
                                    while ($calendario[0]['trabajo'] == 0) {
                                        $f1 = explode('/', $fech);
                                        $ff = date_create($f1[2] . '-' . $f1[1] . '-' . $f1[0]);
                                        date_add($ff, date_interval_create_from_date_string('1 day'));
                                        $FIT = explode('/', $ff->format('d/m/Y'));
                                        $ff = date_create($FIT[2] . '-' . $FIT[1] . '-' . $FIT[0]);
                                        $fechaincorpor = $ff->format('d/m/Y');
                                        $calendario = $confCalendario->getCalendarioByFecha($fechaincorpor, $person['idgrupodescanso']);
                                        $fech = $fechaincorpor;
                                    }
                                    $fechaempieza = $fech;
                                } else
                                    $fechaempieza = $fech;
                            }else{
                                $fechaempieza = '';
                            }
                        }
                    }
                    if (!empty($person['fdesde'])) {
                        $fini = explode('T', $person['fdesde']);
                        if (count($fini) == 1)
                            $fechadesde = $person['fdesde'];
                        else {
                            $fini1 = explode('-', $fini[0]);
                            $fechadesde = $fini1[2] . '/' . $fini1[1] . '/' . $fini1[0];
                        }
                    }
                    $datentidad = $_SESSION['Zeolides']['entidad'];
                    $F = explode('/', $fecha);
                    $mes = $this->getMes($F[1]);
                    $n = explode(' ', $person['nombreapellidos']);
                    $nombreapell = "";

                    $nombre = $person['nombre'];
                    $snombre = $person['snombre'];
                    $papel = $person['papel'];
                    $sapel = $person['sapel'];

                    $n = explode(' ', $nombre);					
                    if (count($n) == 2) {
                        $l = substr($n[1], 0, 1);
                        $nombreapell = $n[0] . " " . "$l" . ". " . $papel . " " . $sapel;
                    } else {
                        if (!empty($snombre)) {
                            $letra = substr($snombre, 0, 1);
                            $nombreapell = $nombre . " " . "$letra" . ". " . $papel . " " . $sapel;
                            $nombre .= " " . $snombre;
                        } else {
                            $nombreapell = $nombre . " " . $papel . " " . $sapel;
                        }
                    }

                    $pdf->SetFont('Arial', 'B', 8);
                    $pdf->SetX(10);
                    $pdf->Cell(180, 8, "MODELO SC-404 VACACIONES", 1, 0, "C", 0);
                    $pdf->Ln(8);
                    $pdf->SetX(10);
                    $pdf->Cell(40, 8, "Nombre de la Entidad", 1, 0, "C", 0);
                    $pdf->Cell(40, 8, utf8_decode("Código de la entidad"), 1, 0, "C", 0);
                    $pdf->Cell(40, 8, utf8_decode("Notificación"), 0, 0, "C", 0);
                    $pdf->Cell(60, 8, utf8_decode("No. Consecutivo"), 1, 0, "C", 0);
                    $pdf->Ln(8);
                    $pdf->SetX(10);
                    $pdf->SetFont('Arial', '', 5.7);
                    $pdf->Cell(40, 8, utf8_decode($datentidad->denominacion), 1, 0, "C", 0);
                    $pdf->SetFont('Arial', '', 8);
                    $pdf->Cell(40, 8, $datentidad->codigo, 1, 0, "C", 0);
                    $pdf->SetFont('Arial', 'B', 8);
                    $pdf->Cell(40, 10, "Vacaciones", 0, 0, "C", 0);
                    $pdf->Cell(20, 4, utf8_decode("Día"), 1, 0, "C", 0);
                    $pdf->Cell(20, 4, utf8_decode("Mes"), 1, 0, "C", 0);
                    $pdf->Cell(20, 4, utf8_decode("Año"), 1, 0, "C", 0);
                    $pdf->Ln(4);
                    $pdf->SetX(130);
                    $pdf->SetFont('Arial', '', 8);
                    $pdf->Cell(20, 4, utf8_decode($F[0]), 1, 0, "C", 0);
                    $pdf->Cell(20, 4, utf8_decode($F[1]), 1, 0, "C", 0);
                    $pdf->Cell(20, 4, utf8_decode($F[2]), 1, 0, "C", 0);
                    $pdf->Ln(4);
                    $pdf->SetX(10);
                    $pdf->SetFont('Arial', 'B', 8);
                    $pdf->Cell(40, 8, "Nombres", 1, 0, "C", 0);
                    $pdf->Cell(40, 8, utf8_decode("Primer Apellido"), 1, 0, "C", 0);
                    $pdf->Cell(50, 8, utf8_decode("Segundo Apellido"), 1, 0, "C", 0);
                    $pdf->Cell(50, 8, utf8_decode("Carné Identidad"), 1, 0, "C", 0);
                    $pdf->Ln(8);
                    $pdf->SetX(10);
                    $pdf->SetFont('Arial', '', 8);
                    $pdf->Cell(40, 8, utf8_decode($nombre), 1, 0, "C", 0);
                    $pdf->Cell(40, 8, utf8_decode($papel), 1, 0, "C", 0);
                    $pdf->Cell(50, 8, utf8_decode($sapel), 1, 0, "C", 0);
                    $pdf->Cell(50, 8, utf8_decode($person['noidentidad']), 1, 0, "C", 0);
                    $pdf->Ln(8);
                    $pdf->SetFont('Arial', 'B', 8);
                    $pdf->SetX(10);
                    $pdf->Cell(180, 8, utf8_decode('Área de Trabajo: ' . $person['area']), 1, 0, "L", 0);
                    $pdf->Ln(8);
                    $pdf->SetX(10);
                    $pdf->SetFont('Arial', 'B', 8);
                    $pdf->Cell(180, 8, utf8_decode('Período a Disfrutar'), 1, 0, "C", 0);
                    $pdf->Ln(8);
                    $pdf->SetX(10);
                    $pdf->Cell(36, 8, "Fecha de Inicio:", 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode("Terminación:"), 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode("Días naturales:"), 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode("Dias hábiles a disfrutar:"), 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode("Fecha de Incorporación:"), 1, 0, "C", 0);
                    $pdf->Ln(8);
                    $pdf->SetX(10);
                    $pdf->SetFont('Arial', '', 8);
                    $pdf->Cell(36, 8, $fechadesde, 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode($person['fhasta']), 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode($person['diasnaturales']), 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode($person['diashabiles']), 1, 0, "C", 0);
                    $pdf->Cell(36, 8, $fechaempieza, 1, 0, "C", 0);
                    $pdf->Ln(8);
                    $pdf->SetX(10);
                    $pdf->SetFont('Arial', 'B', 7.5);
                    $pdf->Cell(72, 8, utf8_decode("Días e importe acumulado antes de las vacaciones"), 1, 0, "L", 0);
                    $pdf->Cell(36, 8, utf8_decode("Importe a Cobrar:"), 1, 0, "C", 0);
                    $pdf->Cell(72, 8, utf8_decode("Días e importe acumulado después de las vacaciones"), 1, 0, "L", 0);
                    $pdf->Ln(8);
                    $pdf->SetX(10);
                    $pdf->SetFont('Arial', '', 8);
                    $pdf->Cell(36, 8, utf8_decode("Días Acumulados: " . $person['diasacumulados']), 1, 0, "L", 0);
                    $pdf->Cell(36, 8, utf8_decode("Importe a Cobrar: " . $person['importeacumulado']), 1, 0, "L", 0);
                    $pdf->Cell(36, 8, utf8_decode($person['importecobrar']), 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode("Días Acumulados: " . $person['saldotiempo']), 1, 0, "L", 0);
                    $pdf->Cell(36, 8, utf8_decode("Importe a Cobrar: " . $person['saldoimporte']), 1, 0, "L", 0);
                    $pdf->Ln(8);
                    $pdf->SetX(10);
                    $pdf->SetFont('Arial', 'B', 8);
                    $pdf->Cell(36, 8, "Elaborado por:", 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode("Revisado por:"), 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode("Aprobado por:"), 1, 0, "C", 0);
                    $pdf->SetFont('Arial', 'B', 6.5);
                    $pdf->Cell(36, 8, utf8_decode("Firma de Cont.(acuse de recibo)"), 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode("Firma(elabora la Nómina)"), 1, 0, "C", 0);
                    $pdf->Ln(8);
                    $pdf->SetX(10);
                    $pdf->SetFont('Arial', '', 7);

                    $nombreapell = "";
                    if ($elaboradopor->nombrepersona) {
                        $rev = explode(' ', $elaboradopor->nombrepersona);						
                        if (count($rev) == 3) {
                            $nombreapell = $elaboradopor->nombrepersona;
                        } else if (count($rev) == 4) {
                            $letra = substr($rev[1], 0, 1);
                            $nombreapell = $rev[0] . " " . "$letra" . ". " . $rev[2] . " " . $rev[3];
                        } else if (count($rev) == 5) {
                            $letra = substr($rev[1], 0, 1);
                            $nombreapell = $rev[0] . " " . "$letra" . ". " . $rev[2] . " " . $rev[3]. " " . $rev[4];
                        } else if (count($rev) == 6) {
                            $letra = substr($rev[3], 0, 1);
                            $nombreapell = $rev[0] . " " . "$letra" . ". " . $rev[4] . " " . $rev[5];
                        }
                    } else {
                        $nombreapell = "";
                    }
                    $pdf->Cell(36, 8, utf8_decode($nombreapell), 1, 0, "C", 0);
                    $nombreapellrev = "";
                    if ($revisadopor->nombrepersona) {
                        $rev = explode(' ', $revisadopor->nombrepersona);						
                        if (count($rev) == 3) {
                            $nombreapellrev = $revisadopor->nombrepersona;
                        } else if (count($rev) == 4) {
                            $letra = substr($rev[1], 0, 1);
                            $nombreapellrev = $rev[0] . " " . "$letra" . ". " . $rev[2] . " " . $rev[3];
                        } else if (count($rev) == 5) {
                            $letra = substr($rev[1], 0, 1);
                            $nombreapellrev = $rev[0] . " " . "$letra" . ". " . $rev[2] . " " . $rev[3]. " " . $rev[4];
                        } else if (count($rev) == 6) {
                            $letra = substr($rev[3], 0, 1);
                            $nombreapellrev = $rev[0] . " " . "$letra" . ". " . $rev[4] . " " . $rev[5];
                        }
                    } else {
                        $nombreapellrev = "";
                    }
                    $pdf->Cell(36, 8, utf8_decode($nombreapellrev), 1, 0, "C", 0);
                    $nombreapellaprob = "";
                    if ($aprobadopor->nombrepersona) {
                        $aprob = explode(' ', $aprobadopor->nombrepersona);
                        if (count($aprob) == 3) {
                            $nombreapellaprob = $aprobadopor->nombrepersona;
                        } else if (count($aprob) == 4) {
                            $letra = substr($aprob[1], 0, 1);
                            $nombreapellaprob = $aprob[0] . " " . "$letra" . ". " . $aprob[2] . " " . $aprob[3];
                        } else if (count($aprob) == 5) {
                            $letra = substr($aprob[1], 0, 1);
                            $nombreapellaprob = $aprob[0] . " " . "$letra" . ". " . $aprob[2] . " " . $aprob[3]. " " . $aprob[4];
                        }else if (count($aprob) == 6) {
                            $letra = substr($aprob[3], 0, 1);
                            $nombreapellaprob = $aprob[0] . " " . "$letra" . ". " . $aprob[4] . " " . $aprob[4];
                        }
                    } else {
                        $nombreapellaprob = "";
                    }
                    $pdf->Cell(36, 8, utf8_decode($nombreapellaprob), 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode(''), 1, 0, "C", 0);
                    $pdf->Cell(36, 8, utf8_decode(''), 1, 0, "C", 0);
                    $pdf->SetFont('Arial', '', 8);
                    $pdf->Ln(40);
                    $pdf->SetX(10);
                }

            }
        }

        return $pdf;
    }

    public function cabeceraReporte($pdf, $anno, $fecha)
    {
        $pdf->SetLeftMargin(5);
        $pdf->AddPage();
        return $pdf;
    }

    private function getMes($mesnum)
    {
        if ($mesnum == 1) {
            return 'Enero';
        } else if ($mesnum == 2) {
            return 'Febrero';
        } else if ($mesnum == 3) {
            return 'Marzo';
        } else if ($mesnum == 4) {
            return 'Abril';
        } else if ($mesnum == 5) {
            return 'Mayo';
        } else if ($mesnum == 6) {
            return 'Junio';
        } else if ($mesnum == 7) {
            return 'Julio';
        } else if ($mesnum == 8) {
            return 'Agosto';
        } else if ($mesnum == 9) {
            return 'Septiembre';
        } else if ($mesnum == 10) {
            return 'Octubre';
        } else if ($mesnum == 11) {
            return 'Noviembre';
        } else if ($mesnum == 12) {
            return 'Diciembre';
        } else {
            return '';
        }
    }
}