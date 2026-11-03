<?php

class PDFNominaSubtotales extends fpdf
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


class ReporteSubtotalespdfModel extends ZendExt_Model {

    public function ReporteSubtotalespdfModel() {
        parent::ZendExt_Model();
    }

    //10+45+26
    public function CrearReportePDF($datos) {
        $objNomina = new DatNomina();
		$idnomina = $datos[0]['idnomina'];
		$datosnomina = $objNomina->obtenerObj($idnomina);
		$datelaborarpago = Doctrine::getTable('DatElaborarPagos')->find($datosnomina->idelaborarpago);
		$nomtipopago = Doctrine::getTable('NomTipoPago')->find($datelaborarpago->idtipopago);
		$clasificacionpago = $nomtipopago->clasificacionpago;
		$fechainicio = $datelaborarpago->fechainicioperiodo;
		$fechafin = $datelaborarpago->fechafinperiodo;
		$objdatosperiodo->clasificacionpago = $clasificacionpago;
		$objdatosperiodo->fechainicioperiodo = $fechainicio;
		$objdatosperiodo->fechafinperiodo = $fechafin;
								
	    //$pdf = new PDFNomina('L', 'mm', 'A3');
        $pdf  = new PDFNominaSubtotales('L', 'mm',array(300,730));
        $arrcolumna = unserialize($datos[0]['campos']);
        $cantidadColumna = count($arrcolumna);
        $ArrayAncho = $this->crearEncabezadoPrincipal($pdf, $cantidadColumna, 'Contabilizar subtotales', 0, $objdatosperiodo);
        $pdfNGeneral = $this->crearCuerpo($pdf, $datos, $ArrayAncho, false, 0, $objdatosperiodo);
        //Nomina Efectivo
      /*  $ArrayAncho = $this->crearEncabezadoPrincipal($pdfNGeneral,$cantidadColumna, 'Nomina en Efectivo', 1, $objdatosperiodo);
        $pdfNGeneral = $this->crearCuerpo($pdfNGeneral, $datos, $ArrayAncho, 1, 1, $objdatosperiodo);

        $ArrayAncho = $this->crearEncabezadoPrincipal($pdfNGeneral,$cantidadColumna, 'Nomina en Cajero', 0, $objdatosperiodo);
        $pdfNGeneral = $this->crearCuerpo($pdfNGeneral, $datos, $ArrayAncho, 2, 0, $objdatosperiodo);*/
        $pdfNGeneral->Output();
    }
    private function crearPieDFirma($pdf){
        $pdf->Ln(20);
        $pdf->SetX(20);
        $pdf->Write(10,'POR RECURSOS HUMANOS');
        $pdf->SetX(300);
        $pdf->Write(10,'POR EL AREA CONTABLE');
        $pdf->Ln();
        $pdf->SetX(20);
        $pdf->Write(10,'ELABORADO POR:');
        $pdf->SetX(300);
        $pdf->Write(10,'REVISADO POR:');
        $pdf->Ln();
        $pdf->SetX(20);
        $pdf->Write(10,'REVISADO Y APROBADO POR:');
        $pdf->SetX(300);
        $pdf->Write(10,'CONTABILIZADO POR:');
        return $pdf;

    }
    private function crearCuerpo($pdf, $datos, $ArrayAncho, $tipo, $firma, $objdatosperiodo) {
        //Agredando las columnas dinamicamente
       $arrcolumna = unserialize($datos[0]['campos']);
        $cantidadColumna = count($arrcolumna);
        $cantidadColumnasDatosPersona = 0;
        if ($arrcolumna[0]) {
            if ($cantidadColumna < 19) {//Pregunto si es la nomina general , si no es asi completo con espacios en blancos

                $arrayAux = array_fill(1, 19 - $cantidadColumna, '');
                $Array1 = array_slice($arrcolumna, 0, -1);
                $Array2 = array_slice($arrcolumna, -1);
                $arrcolumna = array_merge($Array1, $arrayAux, $Array2);

            }
//$ArrayAncho[$keycol]
            foreach ($arrcolumna as $keycol => $valuecol) {



                $pdf->Cell($ArrayAncho[$keycol], 8, utf8_decode($valuecol['denominacion']), 1, 0, 'L', 0);
                if ($valuecol['tipocampo'] == 1)
                    $cantidadColumnasDatosPersona++;
            }

			if($firma==1){
			    $pdf->Cell(30, 8, "Firma", 1, 0, 'L', 0);
			}
        }

        $pdf->Ln(8);
        //Agregando los datos de las personas
        if ($datos[0]) {
            $sumPorGeneral = array();
            $encontrado = false;
            foreach ($datos as $keyGen => $valueGen) {//Por cada centro
                $sumPorCentro = array();
                $sumPorCentroMil = array();
                $sumPorCentroCiv = array();
                if ($tipo) {
                    if ($valueGen['cajacajero'] != $tipo) {
                        continue;
                    }
                }

                $y = $pdf->GetY();
                if ($y >= '221.00125' ) {
                    $pdf->AddPage();
                    $this->getEncabezado($arrcolumna, $ArrayAncho, $pdf, $firma, $objdatosperiodo);
                }
                $pdf->SetFont('Arial', 'B', 15);
                if ($cantidadColumna < 20)
                    $pdf->Cell(606, 8, utf8_decode($valueGen['codigo'] . '_' . $valueGen['denominacion']), 1, 1, 'L', 0);
                else
                    $pdf->Cell(657, 8, utf8_decode($valueGen['codigo'] . '_' . $valueGen['denominacion']), 1, 1, 'L', 0);
                if ($valueGen['valores']) {
                    $encontrado = true;
                    $arrayDatosPersona = unserialize($valueGen['valores']);

                  foreach($arrayDatosPersona as $kcat=>$vcat){
                       $id= explode('-',$vcat['id'])[0];
                     // print_r($id);die;
                       $sqlCat = "select cat.denominacion as denom from mod_personaext.nom_categoria cat
										inner join mod_personaext.dat_categorizacion dc on (dc.idcategoria = cat.idcategoria)
										inner join mod_persona.dat_persona dp on (dp.idpersona = dc.idpersona)
										where dp.idpersona = ?;";
                       $mg = Doctrine_Manager::getInstance();
                       $conn = $mg->getCurrentConnection();
                       $categoriapersona = $conn->fetchAll($sqlCat, array($id));
                       //incluyo la categoria


                      $arrayDatosPersona[$kcat]['cat']= $categoriapersona[0]['denom'];



                   }

                    $pdf->SetFont('Arial', '', 12);
                    foreach ($arrayDatosPersona as $keyPersona => $valuePersona) { //Por cada persona
                        if ($valuePersona) {
                            if ($cantidadColumna < 19) {
                                $arrayAux = array_fill(1, 19 - $cantidadColumna + 1, '');
                                $Array1 = array_slice($valuePersona, 0, -1);
                                $Array2 = array_slice($valuePersona, -1);
                                $valuePersona = array_merge($Array1, $arrayAux, $Array2);
                            }
                            $i = 0; //Contadro pra moverme por el arreglo de ancho de columnas
                            $anchoarraux = 0;
                           // print_r($valuePersona);die;
                            foreach ($valuePersona as $keyEsp => $valueEspecifico) {//Por la persona en cuestion
                                //Para obiar el primer elmento del arreglo
                               if ($keyEsp != 'id') {
                                    $y = $pdf->GetY();
                                   // if ($valueEspecifico=='479562')die($y);
                                  // if ($y == '269.00125' || $y == '274.00125' || $y == '275.00125') {
                                    if ($y >= '221.00125' ) {
                                        $pdf->AddPage();
                                        $this->getEncabezado($arrcolumna, $ArrayAncho, $pdf, $firma, $objdatosperiodo);


                                    }

                                    if ($arrcolumna[$i]['tipocampo'] == 2){
                                        //Compruebo que la columna sea un valor numerico
                                        if($valuePersona['cat']=='Militar'){
                                            $sumPorCentroMil[$keyEsp] = $sumPorCentroMil[$keyEsp] + $valueEspecifico;
                                        }else{
                                            $sumPorCentroCiv[$keyEsp] = $sumPorCentroCiv[$keyEsp] + $valueEspecifico;
                                        }

                                        $sumPorCentro[$keyEsp] = $sumPorCentro[$keyEsp] + $valueEspecifico;
                                    }
                                    //if ($i ==1)//Para aliniar el nombre y Apellido a las izquierda
                                       // $pdf->Cell($ArrayAncho[$i], 8, utf8_decode($valueEspecifico), 1, 0, 'L', 0);
                                       // $pdf->RotatedText($ArrayAncho[$i], 60, utf8_decode($valueEspecifico), 90);

                                    else
                                      //  $pdf->Cell($ArrayAncho[$i], 8, utf8_decode($valueEspecifico), 1, 0, 'R', 0);
                                    $i++; //incrmento el contador para el anchod e las columnas
									$anchoarraux = $ArrayAncho[$i];
                                }
                            }
							if($firma==1){
							  $pdf->Cell(30, 8, "", 1, 0, 'L', 0);
			                }


                            //$pdf->Ln(8);
                        }
                    }
                    //Agregando subtotales por centros
                    //Sumando el largo de las columnas que tiene que ver con personas
                    $achoColumna = array_sum(array_slice($ArrayAncho, 0, $cantidadColumnasDatosPersona));
                 //   print_r(array_slice($ArrayAncho, 0, $cantidadColumnasDatosPersona));die;
                    $pdf->SetFont('Arial','', 15);
                    $pdf->Cell($achoColumna, 8, 'Militares', 1, 0, 'R', 0);
// columnas de los militares
                    if ($cantidadColumna < 19) {//Pregunto si es la nomina general , si no es asi completo con espacios en blancos
                        $arrayMilAux = array_fill(1, 19 - $cantidadColumna, '');
                        $ArrayMil1 = array_slice($sumPorCentroMil, 0, -1);
                        $ArrayMil2 = array_slice($sumPorCentroMil, -1);
                        $sumPorCentroMil = array_merge($ArrayMil1, $arrayMilAux, $ArrayMil2);
                        //print_r($arrcolumna);die;
                    }
                    foreach ($arrcolumna as $keycolm => $valuecolm) {
                        if ($valuecolm['tipocampo'] == 2) {//Compruebo que la columna sea un valor numerico
                            //  $numero = number_format($number, 2, '.', '');
                            // $sumPorGeneral[$valuecolm['indice']] = $sumPorGeneral[$valuecolm['indice']] + $sumPorCentro[$valuecolm['indice']];
                            $pdf->Cell($ArrayAncho[$keycolm], 8, number_format($sumPorCentroMil[$valuecolm['indice']], 2, '.', ''), 1, 0, 'R', 0);
                        } else if ($cantidadColumna < 20 && $valuecolm['tipocampo'] != 1)
                            $pdf->Cell($ArrayAncho[$keycolm], 8, '', 1, 0, 'R', 0);//
                    }
                    $pdf->Ln(8);

                    $pdf->SetFont('Arial','', 15);
                    $pdf->Cell($achoColumna, 8, 'Civiles', 1, 0, 'R', 0);
//columnas de los civiles
                    if ($cantidadColumna < 19) {//Pregunto si es la nomina general , si no es asi completo con espacios en blancos
                        $arrayCivAux = array_fill(1, 19 - $cantidadColumna, '');
                        $ArrayCiv1 = array_slice($sumPorCentroCiv, 0, -1);
                        $ArrayCiv2 = array_slice($sumPorCentroCiv, -1);
                        $sumPorCentroCiv = array_merge($ArrayCiv1, $arrayCivAux, $ArrayCiv2);
                        //print_r($arrcolumna);die;
                    }
                    foreach ($arrcolumna as $keycolm => $valuecolm) {
                        if ($valuecolm['tipocampo'] == 2) {//Compruebo que la columna sea un valor numerico
                            //  $numero = number_format($number, 2, '.', '');
                            // $sumPorGeneral[$valuecolm['indice']] = $sumPorGeneral[$valuecolm['indice']] + $sumPorCentro[$valuecolm['indice']];
                            $pdf->Cell($ArrayAncho[$keycolm], 8, number_format($sumPorCentroCiv[$valuecolm['indice']], 2, '.', ''), 1, 0, 'R', 0);
                        } else if ($cantidadColumna < 20 && $valuecolm['tipocampo'] != 1)
                            $pdf->Cell($ArrayAncho[$keycolm], 8, '', 1, 0, 'R', 0);//
                    }
                    $pdf->Ln(8);





                 //   print_r(array_slice($ArrayAncho, 0, $cantidadColumnasDatosPersona));die;
                    $pdf->SetFont('Arial', 'B', 10);
                    $pdf->Cell($achoColumna, 8, 'Subtotales', 1, 0, 'L', 0);

                    if ($cantidadColumna < 19) {//Pregunto si es la nomina general , si no es asi completo con espacios en blancos
                        $arrayAux = array_fill(1, 19 - $cantidadColumna, '');
                        $Array1 = array_slice($sumPorCentro, 0, -1);
                        $Array2 = array_slice($sumPorCentro, -1);
                        $sumPorCentro = array_merge($Array1, $arrayAux, $Array2);
                        //print_r($arrcolumna);die;
                    }
                    //    print_r($cantidadColumnasDatosPersona);die;
                    foreach ($arrcolumna as $keycol => $valuecol) {
                        if ($valuecol['tipocampo'] == 2) {//Compruebo que la columna sea un valor numerico
                            //  $numero = number_format($number, 2, '.', '');
                            $sumPorGeneral[$valuecol['indice']] = $sumPorGeneral[$valuecol['indice']] + $sumPorCentro[$valuecol['indice']];
						    $pdf->Cell($ArrayAncho[$keycol], 8, number_format($sumPorCentro[$valuecol['indice']], 2, '.', ''), 1, 0, 'R', 0);
                        } else if ($cantidadColumna < 20 && $valuecol['tipocampo'] != 1)
                            $pdf->Cell($ArrayAncho[$keycol], 8, '', 1, 0, 'R', 0);//
                    }
                    $pdf->Ln(8);

                }
            }

            if ($encontrado) {
                //Agregando total general
                $pdf->SetFont('Arial', 'B', 10);
                $pdf->Cell($achoColumna, 8, 'Total general', 1, 0, 'L', 0);
                if ($cantidadColumna < 19) {//Pregunto si es la nomina general , si no es asi completo con espacios en blancos
                    $arrayAux = array_fill(1, 19 - $cantidadColumna, '');
                    $Array1 = array_slice($sumPorGeneral, 0, -1);
                    $Array2 = array_slice($sumPorGeneral, -1);
                    $sumPorGeneral = array_merge($Array1, $arrayAux, $Array2);
                }
				//$numero = number_format($number, 2, '.', '');
                foreach ($arrcolumna as $keycol => $valuecol) {

                    if ($valuecol['tipocampo'] == 2) {//Compruebo que la columna sea un valor numerico
				        $pdf->Cell($ArrayAncho[$keycol], 8, number_format($sumPorGeneral[$valuecol['indice']], 2, '.', ''), 1, 0, 'R', 0);
             		} else if ($cantidadColumna < 20 && $valuecol['tipocampo'] != 1)
                        $pdf->Cell($ArrayAncho[$keycol], 8, '', 1, 0, 'R', 0);
                }
            }
        }

        return $pdf;
    }

    private function crearEncabezadoPrincipal($pdf, $cantidadColumna, $titulo, $firma, $objdatosperiodo) {
        $paginaActual=$pdf->PageNo()+1;

        //Arreglo de anchod e columnas estatico para 19 columnas fijas
        //$ArrayAncho = Array(0 => 35, 1 => 65, 2 => 18, 3 => 26, 4 => 20, 5 => 20, 6 => 20, 7 => 20, 8 => 20, 9 => 20, 10 => 20, 11 => 20, 12 => 20, 13 => 15, 14 => 20, 15 => 20, 16 => 20, 17 => 15, 18 => 20);
        $ArrayAncho = Array(0 => 64, 1 => 64, 2 => 26, 3 => 45, 4 => 26, 5 => 31, 6 => 28, 7 => 28, 8 => 28, 9 => 39, 10 => 27, 11 => 24, 12 => 23, 13 => 24, 14 => 23, 15 => 23, 16 => 35, 17 => 24, 18 => 24);
        $i=0;
        $valoranchodefecto=20;
        $anchoextender= $valoranchodefecto*($cantidadColumna-19);
		if($firma==1){
		$anchoextender = $anchoextender+30;
		}
		
        //Agrego posicioens de ancho para el caso de que se necesite cuadrar la tabla
        while ($i<$cantidadColumna-19){
          array_push($ArrayAncho, $valoranchodefecto) ;
          $i++;
        }

//primer pdf
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 20);
        $pdf->SetLineWidth(0.5);
        $pdf->Text(280, 10, $titulo);
        //Creando el encabezado inicial estatico
        $pdf->Ln(10);
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->SetFillColor(230, 230, 230); //
        $pdf->Cell(100, 8, 'Entidad', 1, 0, 'C', 0);
        $pdf->Cell(54, 8, 'Cheque', 1, 0, 'C', 0); //
       $pdf->Cell(140, 8, utf8_decode('Tipo de Nóminas'), 1, 0, 'C', 0);
        //$pdf->RotatedText(100, 8, 'Sueldos', 90);
        $pdf->Cell(30, 43, utf8_decode('Nómina No.'), 1, 0, 'L', 0);
        $pdf->Cell(30, 43, 'Hoja Nro.', 1, 0, 'L', 0);
        if ($cantidadColumna > 19) {
            $pdf->Cell(303, 8, utf8_decode('Período'), 1, 0, 'C', 0);
           // $pdf->Cell($anchoextender, 8, '', '1', 1, 'C', 0);
            $pdf->Ln(8);
            $pdf->SetX(2);
        }else
            $pdf->Cell(303, 8, utf8_decode('Período'), 1, 1, 'C', 0);



//estee s el primero
        $pdf->Cell(35, 35, 'Nombre', 1, 0, 'C', 0);
        $pdf->Cell(65, 35, utf8_decode('Código'), 1, 0, 'C', 0);
        $pdf->Cell(23 , 35, 'No', 1, 0, 'C', 0);
        $pdf->Cell(31, 35, 'Fecha', 1, 0, 'C', 0);
        $pdf->Cell(28, 35, '', 1, 0, 'C', 0);
        $pdf->Cell(28, 35, '', 1, 0, 'C', 0);
        $pdf->Cell(28, 35, '', 1, 0, 'C', 0);
        $pdf->Cell(28, 35, '', 1, 0, 'C', 0);
        $pdf->Cell(28, 35, '', 1, 0, 'C', 0);
        //Textos Verticales
        $pdf->RotatedText(165, 60, 'Sueldos', 90);
        $pdf->RotatedText(195, 60, 'Otros', 90);
        $pdf->RotatedText(223, 60, 'Vacaciones', 90);
        $pdf->RotatedText(250, 60, 'Licencias', 90);
        $pdf->RotatedText(277, 60, 'Subsidios', 90);
        //Para lo de Periodo
        $pdf->SetX(316);
        $pdf->Cell(40, 50, '', 0, 0, 'C', 0);
        $pdf->Cell(150, 17, 'Desde', 1, 0, 'C', 0);

        if ($cantidadColumna > 19) {
            $pdf->Cell(153, 17, 'Hasta', 1, 0, 'C', 0);
           // $pdf->Cell($anchoextender, 12, '', 1, 1, 'C', 0);
            $pdf->Ln(17);
            $pdf->SetX(356);
        }else{
            $pdf->Cell(153, 17, 'Hasta', 1, 1, 'C', 0);
            $pdf->SetX(356);
        }




      //  $pdf->Cell(0, 13, '', 0, 0, 'C', 0);
        $pdf->Cell(50, 18, utf8_decode('Día'), 1, 0, 'C', 0);
        $pdf->Cell(50, 18, 'Mes', 1, 0, 'C', 0);
        $pdf->Cell(50, 18, utf8_decode('Año'), 1, 0, 'C', 0);
        $pdf->Cell(50, 18, utf8_decode('Día'), 1, 0, 'C', 0);
        $pdf->Cell(50, 18, 'Mes', 1, 0, 'C', 0);
        if ($cantidadColumna > 19) {
            $pdf->Cell(53, 18, utf8_decode('Año'), 1, 0, 'C', 0);
           // $pdf->Cell($anchoextender, 13, '', 1, 1, 'C', 0);
            $pdf->Ln(18);
        }else
            $pdf->Cell(53, 18, utf8_decode('Año'), 1, 1, 'C', 0);



        //Para poner los valores
        $pdf->Cell(35, 8, 'XETID', 1, 0, 'C', 0);
        $pdf->Cell(65, 8, '127.0.14420', 1, 0, 'C', 0);
        $pdf->Cell(23, 8, '', 1, 0, 'C', 0);
        $pdf->Cell(31 , 8, '', 1, 0, 'C', 0);
		
        $pdf->Cell(28, 8, ($objdatosperiodo->clasificacionpago==1)?'X':'', 1, 0, 'C', 0);
        $pdf->Cell(28, 8, ($objdatosperiodo->clasificacionpago==2)?'X':'', 1, 0, 'C', 0);
        $pdf->Cell(28, 8, ($objdatosperiodo->clasificacionpago==3)?'X':'', 1, 0, 'C', 0);
        $pdf->Cell(28, 8, ($objdatosperiodo->clasificacionpago==4)?'X':'', 1, 0, 'C', 0);
        $pdf->Cell(28, 8, ($objdatosperiodo->clasificacionpago==5)?'X':'', 1, 0, 'C', 0);
        $pdf->Cell(30, 8, '', 1, 0, 'C', 0);
        $pdf->Cell(30, 8, $paginaActual, 1, 0, 'C', 0);

        //Para lo de Periodo
		$fechai = $objdatosperiodo->fechainicioperiodo;
		$fechaf = $objdatosperiodo->fechafinperiodo;
		$rfechai = explode('/', $fechai);
		$rfechaf = explode('/', $fechaf);
        $pdf->Cell(50, 8, ''.$rfechai[0], 1, 0, 'C', 0);
        $pdf->Cell(50, 8, ''.$rfechai[1], 1, 0, 'C', 0);
        $pdf->Cell(50, 8, ''.$rfechai[2], 1, 0, 'C', 0);
        $pdf->Cell(50, 8, ''.$rfechaf[0], 1, 0, 'C', 0);
        $pdf->Cell(50, 8, ''.$rfechaf[1], 1, 0, 'C', 0);
        if ($cantidadColumna > 19) {
            $pdf->Cell(53, 8, ''.$rfechaf[2], 1, 0, 'C', 0);
           // $pdf->Cell($anchoextender, 8, '', 1, 1, 'C', 0);
            $pdf->Ln(8);
            $pdf->SetX(2);
        }else
        {
            $pdf->Cell(53, 8, ''.$rfechaf[2], 1, 1, 'C', 0);
            $pdf->SetX(2);
        }





        return $ArrayAncho;
    }

    private function getEncabezado($arrcolumna, $ArrayAncho, &$pdf, $firma, $objdatosperiodo) {
        $paginaActual=$pdf->PageNo();
        if ($arrcolumna[0]) {
            $cantidadColumna = count($arrcolumna);
            $i=0;
            $valoranchodefecto=20;
            $anchoextender= $valoranchodefecto*($cantidadColumna-19);
			if($firma==1){
			  $anchoextender=$anchoextender+30;
			}
            while ($i<$cantidadColumna-19){
                array_push($ArrayAncho, $valoranchodefecto) ;
                $i++;
            }

            $pdf->SetFont('Arial', 'B', 20);
            $pdf->SetLineWidth(0.5);
            $pdf->Text(180, 10, $titulo);

            //Creando el encabezado inicial estatico
            $pdf->Ln(10);
            $pdf->SetFont('Arial', 'B', 15);
            $pdf->SetFillColor(230, 230, 230); //
            $pdf->Cell(100, 8, 'Entidad', 1, 0, 'C', 0);
            $pdf->Cell(54, 8, 'Cheque', 1, 0, 'C', 0); //
            $pdf->Cell(140, 8, utf8_decode('Tipo de Nóminas'), 1, 0, 'C', 0);
            $pdf->Cell(30, 43, utf8_decode('Nómina No.'), 1, 0, 'L', 0);
            $pdf->Cell(30, 43, 'Hoja Nro.', 1, 0, 'L', 0);
            if ($cantidadColumna > 19) {
      /*//245*/          $pdf->Cell(303, 8, utf8_decode('Período'), 1, 0, 'C', 0);
                $pdf->Ln(8);
               // $pdf->Cell($anchoextender, 8, '', '1', 1, 'C', 0);
            }else
                $pdf->Cell(303, 8, utf8_decode('Período'), 1, 1, 'C', 0);

//

            $pdf->Cell(35, 35, 'Nombre', 1, 0, 'C', 0);
            $pdf->Cell(65, 35, utf8_decode('Código'), 1, 0, 'C', 0);
            $pdf->Cell(23, 35, 'No', 1, 0, 'C', 0);
            $pdf->Cell(31, 35, 'Fecha', 1, 0, 'C', 0);
            $pdf->Cell(28, 35, '', 1, 0, 'C', 0);
            $pdf->Cell(28, 35, '', 1, 0, 'C', 0);
            $pdf->Cell(28, 35, '', 1, 0, 'C', 0);
            $pdf->Cell(28, 35, '', 1, 0, 'C', 0);
            $pdf->Cell(28, 35, '', 1, 0, 'C', 0);
            //Textos Verticales
            $pdf->RotatedText(165, 60, 'Sueldos', 90);
            $pdf->RotatedText(195, 60, 'Jornales', 90);
            $pdf->RotatedText(223, 60, 'Vacaciones', 90);
            $pdf->RotatedText(250, 60, 'Licencias', 90);
            $pdf->RotatedText(277, 60, 'Subsidios', 90);



           // $pdf->Ln(1);
            $pdf->SetX(316);
            //Para lo de Periodo
            $pdf->Cell(40, 50, '', 0, 0, 'C', 0);
            $pdf->Cell(150, 17, 'Desde', 1, 0, 'C', 0);
            if ($cantidadColumna > 19) {
                $pdf->Cell(153, 17, 'Hasta', 1, 0, 'C', 0);
               // $pdf->Cell($anchoextender, 12, '', 1, 1, 'C', 0);
                $pdf->Ln(17);
                $pdf->SetX(356);
            }else
            {
                $pdf->Cell(153, 17, 'Hasta', 1, 1, 'C', 0);
                $pdf->SetX(356);
            }





            //$pdf->Cell(264, 13, '', 0, 0, 'C', 0);
            $pdf->Cell(50, 18, utf8_decode('Día'), 1, 0, 'C', 0);
            $pdf->Cell(50, 18, 'Mes', 1, 0, 'C', 0);
            $pdf->Cell(50, 18, utf8_decode('Año'), 1, 0, 'C', 0);
            $pdf->Cell(50, 18, utf8_decode('Día'), 1, 0, 'C', 0);
            $pdf->Cell(50, 18, 'Mes', 1, 0, 'C', 0);
            if ($cantidadColumna > 19) {
                $pdf->Cell(53, 18, utf8_decode('Año'), 1, 0, 'C', 0);
               // $pdf->Cell($anchoextender, 13, '', 1, 1, 'C', 0);
                $pdf->LN(18);
            }else
                $pdf->Cell(53, 18, utf8_decode('Año'), 1, 1, 'C', 0);



            $pdf->Cell(35, 8, 'XETID', 1, 0, 'C', 0);
            $pdf->Cell(65, 8, '127.0.14421', 1, 0, 'C', 0);
            $pdf->Cell(23, 8, '', 1, 0, 'C', 0);
            $pdf->Cell(31, 8, '', 1, 0, 'C', 0);
            $pdf->Cell(28, 8, ($objdatosperiodo->clasificacionpago==1)?'X':'', 1, 0, 'C', 0);
            $pdf->Cell(28, 8, ($objdatosperiodo->clasificacionpago==2)?'X':'', 1, 0, 'C', 0);
            $pdf->Cell(28, 8, ($objdatosperiodo->clasificacionpago==3)?'X':'', 1, 0, 'C', 0);
            $pdf->Cell(28, 8, ($objdatosperiodo->clasificacionpago==4)?'X':'', 1, 0, 'C', 0);
            $pdf->Cell(28, 8, ($objdatosperiodo->clasificacionpago==5)?'X':'', 1, 0, 'C', 0);
            $pdf->Cell(30, 8, '', 1, 0, 'C', 0);
            $pdf->Cell(30, 8, $paginaActual, 1, 0, 'C', 0);

            //Para lo de Periodo
            $fechai = $objdatosperiodo->fechainicioperiodo;
		    $fechaf = $objdatosperiodo->fechafinperiodo;
	    	$rfechai = explode('/', $fechai);
			$rfechaf = explode('/', $fechaf);
            $pdf->Cell(50, 8, ''.$rfechai[0], 1, 0, 'C', 0);
            $pdf->Cell(50, 8, ''.$rfechai[1], 1, 0, 'C', 0);
            $pdf->Cell(50, 8, ''.$rfechai[2], 1, 0, 'C', 0);
            $pdf->Cell(50, 8, ''.$rfechaf[0], 1, 0, 'C', 0);
            $pdf->Cell(50, 8, ''.$rfechaf[1], 1, 0, 'C', 0);
            if ($cantidadColumna > 19) {
                $pdf->Cell(53, 8, ''.$rfechaf[2], 1, 0, 'C', 0);
               // $pdf->Cell($anchoextender, 8, '', 1, 1, 'C', 0);
                $pdf->Ln(8);
                $pdf->SetX(2);
            }else
            {
                $pdf->Cell(53, 8, ''.$rfechaf[2], 1, 1, 'C', 0);
                $pdf->SetX(2);
            }



            $pdf->SetFont('Arial', 'B', 15);
           // $pdf->Ln(65);


            foreach ($arrcolumna as $keycol => $valuecol) {
               // $pdf->SetX($contX);
               $pdf->Cell($ArrayAncho[$keycol], 8, utf8_decode($valuecol['denominacion']), 1, 0, 'L', 0);


            }
			if($firma==1){
			   $pdf->Cell(30, 8, "Firma", 1, 0, 'L', 0);
			}
        }
        $pdf->SetFont('Arial', '', 12);
        $pdf->Ln(8);
    }
 
}

/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */

