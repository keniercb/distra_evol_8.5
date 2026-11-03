<?php

$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);


class PDFNivelescolarrangoedadesge extends fpdf
{
}

class ReportepdfnivelescolarrangoedadesgeModel extends ZendExt_Model
{
    public function ReportepdfnivelescolarrangoedadesgeModel()
    {
        parent::ZendExt_Model();

    }

    public function construirReporte($idestructura)
    {
        $modeloDatos = new DatosnivelescolarrangoedadesgeModel();
        
        $gruposEscala = $modeloDatos->getGruposEscala($idestructura);
        $denomColumnas = $modeloDatos->getDenominacionColumnas();
        
        //NO hacer nada y devolver un mensaje de error si no existen cargos o personas ubicadas en cargo en la estructura que se selecciono:
        if (empty($gruposEscala)) {
            print_r("<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link href='/lib/ExtJS
                    /temas/default/css/icon-clases.css' rel='stylesheet' type='text/css' media='screen'/></head><body><pre
                    ><table width='100%' border='0'><tr><td width='7%'><div class='iconoERROR' style='margin:10 0 0 10'>
                    </div></td><td width='93%'><div style='margin:10px 0px 0px 0px;font-size:9pt' ><b>ERROR</b><br>Imposible 
                    crear el reporte ya que no existen cargos o no existen personas ubicadas en cargo en la estructura
                    seleccionada.</div></td></tr></table></pre></body
                    >");die;
        }
        
        //No hacer nada y devolver un mensaje de error si esta vacio el nomenclador de Nivel eduacional:
        if (empty($denomColumnas['totalniveleduc'])) {
            print_r("<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link href='/lib/ExtJS
                    /temas/default/css/icon-clases.css' rel='stylesheet' type='text/css' media='screen'/></head><body><pre
                    ><table width='100%' border='0'><tr><td width='7%'><div class='iconoERROR' style='margin:10 0 0 10'>
                    </div></td><td width='93%'><div style='margin:10px 0px 0px 0px;font-size:9pt' ><b>ERROR</b><br>Imposible 
                    crear el reporte ya que el nomenclador Nivel educacional se encuentra vacío.</div></td></tr></table></pre></body
                    >");die;
        }
        
        //No hacer nada y devolver un mensaje de error si esta vacia la configuracion de rangos de edades:
        if (empty($denomColumnas['totalrangoedades'])) {
            print_r("<html><head><meta http-equiv='Content-Type' content='text/html; charset=utf-8' /><link href='/lib/ExtJS
                    /temas/default/css/icon-clases.css' rel='stylesheet' type='text/css' media='screen'/></head><body><pre
                    ><table width='100%' border='0'><tr><td width='7%'><div class='iconoERROR' style='margin:10 0 0 10'>
                    </div></td><td width='93%'><div style='margin:10px 0px 0px 0px;font-size:9pt' ><b>ERROR</b><br>Imposible 
                    crear el reporte ya que la configuración Rango de edades se encuentra vacía.</div></td></tr></table></pre></body
                    >");die;
        }
        
        $entidad = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $entidad = $entidad[0]->denominacion;
        
        $tamannoColumGrupoEscala = 31;
        
        $longdinamica = 36 * (count($denomColumnas['denominaciones']) - 1); // -1 para descontar la columna Grupo Escala
        
        $anchopdf = $tamannoColumGrupoEscala + $longdinamica + 20; //Se le suman 20 para los margenes.
        $altopdf = $anchopdf * 0.6; //El alto va a ser igual al 60% del ancho.
        
        $pdf = new PDFNivelescolarrangoedadesge('L', 'mm', array($altopdf, $anchopdf));   
        $pdf->SetTopMargin(5);
        $pdf->AddPage();
        
        $pdffinal = $this->cabeceraReporte($pdf, $denomColumnas, $tamannoColumGrupoEscala, $entidad);
        $pdffinal = $this->cuerpoReporte($pdf, $tamannoColumGrupoEscala, $gruposEscala, $modeloDatos, $denomColumnas, $idestructura);
        
        $pdf->Output();
    }

    public function cuerpoReporte(&$pdf, $tamannoColumGrupoEscala, $gruposEscala, $modeloDatos, $denomColumnas, $idestructura)
    {
        $totalesEscolaridad = array();
        $totalesRangosEdad = array();
        $totalEnEdadJubilacion = 0;
        $totalMujeresEnEdadJubilacion = 0;
        $totalTotalTotal = 0;
        $totalMujeresTotal = 0;
        
        $pdf->SetFont('Times', '', 14);
        
        foreach ($gruposEscala as $value) {
            $valoresFila = $modeloDatos->getValoresFila($value['idgrupocomplejidad'], $idestructura);
            
            $pdf->Cell($tamannoColumGrupoEscala, 10, "" . utf8_decode("" . $value['grupoescala']), 1, 0, "C");
            
            if (count($valoresFila['escolaridad']) != 0) {
                foreach ($valoresFila['escolaridad'] as $k => $v) {
                    $cant = "";
                    $cantMujeres = "";
                    if ($v['cantidad'] != 0) {
                        $cant = $v['cantidad'];
                    }
                    if ($v['cantidadmujeres'] != 0) {
                        $cantMujeres = $v['cantidadmujeres'];
                    }
                    $pdf->Cell(18, 10, "" . utf8_decode("" . $cant), 1, 0, "C");
                    $pdf->Cell(18, 10, "" . utf8_decode("" . $cantMujeres), 1, 0, "C");
                    $totalesEscolaridad[$k]['total'] += $v['cantidad'];
                    $totalesEscolaridad[$k]['totalmujeres'] += $v['cantidadmujeres'];
                }
            } else {
                $totalColumnasEscolaridad = $denomColumnas['totalniveleduc'];
                for ($i = 0; $i < $totalColumnasEscolaridad * 2; $i++) {
                    $pdf->Cell(18, 10, "", 1, 0, "C");
                }
            }
            
            if (count($valoresFila['rangosedades']) != 0) {
                foreach ($valoresFila['rangosedades'] as $k => $v) {
                    $cant = "";
                    $cantMujeres = "";
                    if ($v['cantidad'] != 0) {
                        $cant = $v['cantidad'];
                    }
                    if ($v['cantidadmujeres'] != 0) {
                        $cantMujeres = $v['cantidadmujeres'];
                    }
                    $pdf->Cell(18, 10, "" . utf8_decode("" . $cant), 1, 0, "C");
                    $pdf->Cell(18, 10, "" . utf8_decode("" . $cantMujeres), 1, 0, "C");
                    $totalesRangosEdad[$k]['total'] += $v['cantidad'];
                    $totalesRangosEdad[$k]['totalmujeres'] += $v['cantidadmujeres'];
                }
            } else {
                $totalColumnasRangosEdad = $denomColumnas['totalrangoedades'];
                for ($i = 0; $i < $totalColumnasRangosEdad * 2; $i++) {
                    $pdf->Cell(18, 10, "", 1, 0, "C");
                }
            }
                        
            $pdf->Cell(18, 10, "" . utf8_decode("" . $valoresFila['enedadjubilacion']), 1, 0, "C");
            $pdf->Cell(18, 10, "" . utf8_decode("" . $valoresFila['enedadjubilacionmujeres']), 1, 0, "C");
            
            $pdf->Cell(18, 10, "" . utf8_decode("" . $valoresFila['totaltotal']), 1, 0, "C");
            $pdf->Cell(18, 10, "" . utf8_decode("" . $valoresFila['totalmujeres']), 1, 0, "C");
            
            //Incremento los contadores de los totales:
            
            $totalEnEdadJubilacion += $valoresFila['enedadjubilacion'];
            $totalMujeresEnEdadJubilacion += $valoresFila['enedadjubilacionmujeres'];
            
            $totalTotalTotal += $valoresFila['totaltotal'];
            $totalMujeresTotal += $valoresFila['totalmujeres'];          
            
            $pdf->Ln(10);
        }
        
        //Pinto la fila de los totales:
        $pdf->SetFont('Times', 'B', 14);
        $pdf->Cell($tamannoColumGrupoEscala, 10, "" . utf8_decode("TOTAL"), 1, 0, "C");

        foreach ($totalesEscolaridad as $llave => $valor) {
            $pdf->Cell(18, 10, "" . utf8_decode($valor['total']), 1, 0, "C");
            $pdf->Cell(18, 10, "" . utf8_decode($valor['totalmujeres']), 1, 0, "C");
        }
        
        foreach ($totalesRangosEdad as $llave => $valor) {
            $pdf->Cell(18, 10, "" . utf8_decode($valor['total']), 1, 0, "C");
            $pdf->Cell(18, 10, "" . utf8_decode($valor['totalmujeres']), 1, 0, "C");
        }
                
        $pdf->Cell(18, 10, "" . utf8_decode($totalEnEdadJubilacion), 1, 0, "C");
        $pdf->Cell(18, 10, "" . utf8_decode($totalMujeresEnEdadJubilacion), 1, 0, "C");
        
        $pdf->Cell(18, 10, "" . utf8_decode($totalTotalTotal), 1, 0, "C");
        $pdf->Cell(18, 10, "" . utf8_decode($totalMujeresTotal), 1, 0, "C");        
        
        return $pdf;      
    }

    public function cabeceraReporte(&$pdf, $denomColumnas, $tamannoColumGrupoEscala, $entidad)
    {
        $fechaactual = date('d/m/Y');
        
        $pdf->SetFont('Arial', 'B', 18);
        $pdf->Cell(0, 10, utf8_decode('DISTRIBUCIÓN DE LOS TRABAJADORES POR NIVEL ESCOLAR, RANGO DE EDADES Y GRUPO DE LA ESCALA'), 0, 0, 'C', 0);
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 16);
        $pdf->Cell(0, 10, utf8_decode('Entidad: ' . $entidad . '      ' . $fechaactual), 0, 0, 'C', 0);
        $pdf->Ln(10);

        $pdf->SetFont('Times', 'B', 14);
        
        $textoNivelEsc = "NIVEL DE ESCOLARIDAD";
        if ($denomColumnas['totalniveleduc'] == 1) {
            $textoNivelEsc = "NE";
        }
        
        $x = $pdf->GetX();
        $pdf->SetX($tamannoColumGrupoEscala + $x);
        $pdf->Cell(36 * ($denomColumnas['totalniveleduc']), 10, $textoNivelEsc, 1, 0, "C", 0);
        $pdf->Cell(36 * ($denomColumnas['totalrangoedades']), 10, "RANGO DE EDADES", 1, 0, "C", 0); // 13 es el total de rangos de edad (cuando era estatico)
        $pdf->Cell(36, 10, utf8_decode("JUBILACIÓN"), 1, 0, "C", 0);
        $pdf->Cell(36, 10, utf8_decode("TOTAL"), 1, 0, "C", 0);
        
        $pdf->Ln(10);        
        
        $altoCelda = 0;
        foreach ($denomColumnas['denominaciones'] as $columna) {
            $altoCelda = ($pdf->GetStringWidth($columna) > $altoCelda) ? $pdf->GetStringWidth($columna) : $altoCelda;
        }
        $altoCelda = round($altoCelda, 0, PHP_ROUND_HALF_UP) + 1;
        
        $pdf->Cell($tamannoColumGrupoEscala, $altoCelda, "" . utf8_decode($denomColumnas['denominaciones'][0]), 1, 0, "C", 0);

        foreach ($denomColumnas['denominaciones'] as $value) {
            if ($denomColumnas['denominaciones'][0] != $value) {
                $this->addVerticalColumn($altoCelda, $value, 4.5, 4.5, $pdf);
            }            
        }
        
        $pdf->Ln($altoCelda);
        
        $pdf->Cell($tamannoColumGrupoEscala, 10, 'A', 1, 0, "C", 0);
        
        $cantColumns = ($denomColumnas['totalniveleduc'] + $denomColumnas['totalrangoedades'] + 2) * 2 + 1; //Columnas dinamicas del nomenclador nivel educacional + Columnas dinamicas de la config de rango de edades + columnas fija en total 2
        
        for ($i = 1; $i < $cantColumns; $i++) {
            if ($i % 2 == 0) {
                $pdf->Cell(18, 10, 'Mujeres', 1, 0, "C", 0);
            } else {
                $pdf->Cell(18, 10, 'Total', 1, 0, "C", 0);
            }
        }
        
        $pdf->Ln(10);   
        
        return $pdf;
    }

    private function addVerticalColumn($w, $text, $salto, $space = 1, &$pdf, $fill = 0)
    {
        $x = $pdf->GetX();
        $y = $pdf->GetY();
        $pdf->Rotate(90, $x + ($w / 2), $y + ($w / 2));
        $pdf->MultiCell($w, $space * 8, utf8_decode($text), 1, 'C', $fill);
        $pdf->SetY($y);
        $pdf->SetX($x + (8 * $salto));
        $pdf->Rotate(0);
    }

}