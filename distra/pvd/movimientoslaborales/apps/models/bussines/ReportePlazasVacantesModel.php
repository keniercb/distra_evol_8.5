<?php
class PDFFuerzatrabajo extends fpdf
{
    private $pdf;
    private $table;
    private $alingsArray;
    private $datos;
    function Footer()
    {

    }
}
class ReportePlazasVacantesModel extends ZendExt_Model
{
    public function ReportepdfModel()
    {

        parent::ZendExt_Model();
    }

    public function CrearReportePDF($idestructura)
    {
        $pdf = new PDFFuerzatrabajo('L', 'mm', 'a3');
        $this->pdf = $pdf;
        $this->table = new Tableml($this->pdf);
        $datosestructura = ZendExt_IoC::getInstance()->metadatos->DameEstructura($idestructura);
        $rutaestructura = ZendExt_IoC::getInstance()->metadatos->obtenerPadreEntidad(array($idestructura), true);

        $cargoestructura = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura);
        $idcargos = $this->arrayColumn($cargoestructura, 'idcargo');
        $datoscargo = ZendExt_IoC::getInstance()->metadatos->obtenerDatosCargo($idcargos);

        $this->crearEncabezadoPrincipal($datosestructura, $rutaestructura);
        $this->crearCuerpo($datoscargo);
        $this->crearFinal($datosestructura);
        $this->pdf->AddPage();
        $pdfNGeneral = $this->crearAnexo($datoscargo);
        $pdfNGeneral->Output();

    }

    private function crearEncabezadoPrincipal($datosestructura, $rutaestructura)
    {
        $this->pdf->SetLeftMargin(30);
        $this->pdf->AddPage();
        $this->pdf->SetFont('Times', 'B', 28);
        $this->pdf->SetLineWidth(0.5);
        $this->pdf->Cell(500, 10, utf8_decode('Información de plazas vacantes'), 0, 0, 'C', 0);
        $this->pdf->Ln(20);
        $this->pdf->SetFont('Times', 'B', 16);
        $this->pdf->Cell(150, 40, 'MINISTERIO DE TRABAJO Y SEGURIDAD SOCIAL', 1, 0, 'C', 0);
        $this->pdf->Cell(200, 40, utf8_decode('INFORMACION DE PLAZAS VACANTES'), 1, 0, 'C', 0);
        $this->pdf->Cell(150, 15, utf8_decode('MODELO'), 1, 2, 'C');
        $this->pdf->Cell(150, 25, utf8_decode('No. de radicación'), 1, 1, 'C');

        $this->pdf->Cell(250, 30, utf8_decode('Organismo:' . ' ' . $rutaestructura[0]->denominacion), 1, 0, 'L', 0);
        $this->pdf->Cell(250, 30, utf8_decode('Entidad:' . ' ' . $datosestructura[0]->denominacion), 1, 1, 'L', 0);
        $this->pdf->Cell(150, 30, utf8_decode('Dirección:' . ' ' . $datosestructura[0]->direccion), 1, 0, 'L', 0);
        $this->pdf->Cell(80, 30, utf8_decode('Teléfono:' . ' ' . $datosestructura[0]->telefono), 1, 0, 'L', 0);

        $datosdireccion = ZendExt_IoC::getInstance()->datosmaestros->getElementoid($datosestructura[0]->iddpt);
        $municipio = ZendExt_IoC::getInstance()->datosmaestros->getElementoid($datosdireccion[0]['idpadre']);
        $provincia = ZendExt_IoC::getInstance()->datosmaestros->getElementoid($municipio[0]['idpadre']);

        $this->pdf->Cell(120, 30, utf8_decode('Municipio:' . ' ' . $municipio[0]['denominacion']), 1, 0, 'L', 0);
        $this->pdf->Cell(150, 30, utf8_decode('Provincia:' . ' ' . $provincia[0]['denominacion']), 1, 1, 'L', 0);

    }

    private function crearCuerpo($datoscargo)
    {
       if(count($datoscargo) > 0){
           $this->pdf->Cell(500, 15, 'DATOS DE LAS PLAZAS VACANTES', 1, 1, 'C', 0);
           $x = $this->pdf->GetX();
           $y = $this->pdf->GetY();
           $this->pdf->Cell(80, 10, utf8_decode('Tipo de Contrato'), 1, 1, 'C');
           $y += 10;
           $this->pdf->SetY($y);
           $this->pdf->SetX($x);
           $this->pdf->Cell(40, 20, utf8_decode('Indeterminado'), 1, 1, 'C');
           $this->pdf->SetY($y);
           $this->pdf->SetX($x + 40);
           $this->pdf->Cell(40, 20, utf8_decode('Determinado'), 1, 1, 'C');
           $this->pdf->SetY($y - 10);
           $this->pdf->SetX($x + 80);
           $this->pdf->Cell(150, 30, utf8_decode('Denominación del cargo'), 1, 0, 'C', 0);
           $this->pdf->Cell(45, 30, utf8_decode('Salario del cargo'), 1, 0, 'C', 0);
           $this->pdf->Cell(100, 10, utf8_decode('Categoría ocupacional'), 1, 1, 'C');

           $this->pdf->SetY($y);
           $this->pdf->SetX($x + 275);
           $this->pdf->Cell(20, 20, 'O', 1, 0, 'C', 0);
           $this->pdf->Cell(20, 20, 'S', 1, 0, 'C', 0);
           $this->pdf->Cell(20, 20, 'A', 1, 0, 'C', 0);
           $this->pdf->Cell(20, 20, 'T', 1, 0, 'C', 0);
           $this->pdf->Cell(20, 20, 'C', 1, 0, 'C', 0);

           $this->pdf->SetY($y - 10);
           $this->pdf->SetX($x + 375);
           $this->pdf->Cell(125, 30, utf8_decode('Para uso de la Dirección de Trabajo'), 1, 1, 'C');

           $categocupacional=ZendExt_IoC_Inter::getInstance()->maestro->getCategoriasOcup();

           $arreglocat=array();
           foreach ($categocupacional as $categ) {
               $arreglocat[$categ['idcategocup']]=$categ['idcategoriareporte'];
           }

           $datoscargo = $this->fusionarCargos($datoscargo);

           foreach ($datoscargo as $dat) {
               $idcategoriareporte=$arreglocat[$dat['idcategoria']];

               if ($dat['cantidadreal'] < $dat['cantidad']) {
                   $this->pdf->SetFont('Times', '', 16);

                   if ($dat['temporal'] == 1) {
                       $this->pdf->Cell(40, 10, '', 1, 'C');
                       $this->pdf->Cell(40, 10, '', 1, 'C');
                   } else {
                       $this->pdf->Cell(40, 10, '', 1, 'C');
                       $this->pdf->Cell(40, 10, '', 1, 'C');
                   }

                   $this->pdf->Cell(150, 10, utf8_decode($dat['denominacion']), 1, 0, 'L', 0);
                   $this->pdf->Cell(45, 10, $dat['salario'], 1, 0, 'C', 0);

                   ///operario
                   if ($idcategoriareporte == 1) {
                       $this->pdf->Cell(20, 10, $dat['cantcateg'], 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       
                   } else if ($idcategoriareporte == 3) {///servicio
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, $dat['cantcateg'], 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);

                   } else if ($idcategoriareporte == 2) { ////administradtivo
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, $dat['cantcateg'], 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);

                   } else if ($idcategoriareporte == 4) { ////tecnico
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, $dat['cantcateg'], 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);

                   } else if ($idcategoriareporte == 5) {  ///Cuadro (directivo, directivo superior y ejecutivo)
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, $dat['cantcateg'], 1, 0, 'C', 0);
                   } else {
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                       $this->pdf->Cell(20, 10, '', 1, 0, 'C', 0);
                   } 
                   $this->pdf->Cell(125, 10, '', 1, 1, 'C');
               }
           }
       }
    }

    private function crearFinal($datosestructura)
    {
        $this->pdf->SetFont('Times', 'B', 16);
        $this->pdf->Ln();
        $x = $this->pdf->GetX();
        $y = $this->pdf->GetY();
        $this->pdf->MultiCell(100, 10, utf8_decode('Fecha de emisión:'), 1, 'C');
        $y += 10;
        $this->pdf->SetY($y);
        $this->pdf->SetX($x);
        $this->pdf->MultiCell(30, 10, utf8_decode('Día'), 1, 'C');
        $this->pdf->SetY($y);
        $this->pdf->SetX($x + 30);
        $this->pdf->MultiCell(35, 10, utf8_decode('Mes'), 1, 'C');

        $this->pdf->SetY($y);
        $this->pdf->SetX($x + 65);
        $this->pdf->MultiCell(35, 10, utf8_decode('Año'), 1, 'C');

        $formato = date("Y/m/d");
        $fecha = explode('/', $formato);

        $y += 10;
        $this->pdf->SetY($y);
        $this->pdf->SetX($x);
        $this->pdf->MultiCell(30, 10, $fecha[2], 1, 'C');

        $this->pdf->SetY($y);
        $this->pdf->SetX($x + 30);
        $this->pdf->MultiCell(35, 10, $fecha[1], 1, 'C');

        $this->pdf->SetY($y);
        $this->pdf->SetX($x + 65);
        $this->pdf->MultiCell(35, 10, $fecha[0], 1, 'C');


        $this->pdf->SetY($y - 20);
        $this->pdf->SetX($x + 100);
        $this->pdf->Cell(205, 30, utf8_decode('Entidad:' . ' ' . $datosestructura[0]->denominacion), 1, 0, 'L', 0);

        $this->pdf->Cell(
            195, 30, utf8_decode(' Dirección de Trabajo:'.' '.$datosestructura[0]->direccion), 1, 0, 'L', 0
        );

    }

    private function crearAnexo($datoscargo)
    {
        $this->pdf->SetFont('Times', 'B', 20);
        $this->pdf->Cell(500, 20, utf8_decode('Anexo Información Estadística'), 0, 0, 'C', 0);
        $this->pdf->Ln();
        $this->pdf->SetFont('Times', 'B', 16);
        $this->pdf->SetX(150);
        $this->pdf->Cell(200, 10, 'DENOMINACION', 1, 0, 'C', 0);
        $this->pdf->Cell(50, 10, 'CANTIDAD', 1, 1, 'C', 0);
        $cargo=[];
        $datos=[];

        foreach ($datoscargo as  $k=>$estruct) {
            if (!in_array($datoscargo[$k]['idnomcargo'], $cargo)) {
                array_push($datos,
                    array(
                        'denom' => $datoscargo[$k]['denominacion'],
                        'id' => $datoscargo[$k]['idnomcargo']
                    )
                );
            }
            array_push($cargo, $datoscargo[$k]['idnomcargo']);
        }
        $valores[] = array_count_values($cargo);

        foreach ($valores as $v) {
            foreach ($datos as $d) {
                $this->pdf->SetFont('Times', '', 16);
                $this->pdf->SetX(150);
                $this->pdf->Cell(200, 10, utf8_decode($d['denom']), 1, 0, 'C', 0);
                $this->pdf->Cell(50, 10, $v[$d['id']], 1, 1, 'C', 0);
            }
        }
        return $this->pdf;
    }
    
    private function fusionarCargos($arraycargos) {
        $cargosresult = array();
        foreach ($arraycargos as $v) {
            // Verificar si el cargo tiene plazas vacantes
            if ($v['cantidadreal'] < $v['cantidad']) {
                $add = true; // Inicializar la variable de control
                $plazasVacantes = $v['cantidad'] - $v['cantidadreal']; // Calcular plazas vacantes
            } else {
                $add = false; // Si no hay plazas vacantes, no se añade
                $plazasVacantes = 0; // No hay plazas vacantes
            }
    
            // Verificar si el cargo ya existe en el resultado
            foreach ($cargosresult as $pr => $d) {
                if ($v['idnomcargo'] == $d['idnomcargo'] && $v['idcategoria'] == $d['idcategoria']) {
                    // Si el cargo ya existe, sumar las plazas vacantes
                    $cargosresult[$pr]['cantcateg'] += $plazasVacantes;
                    $add = false; // Marcar que no se debe añadir un nuevo cargo
                    break; // Salir del bucle ya que se encontró el duplicado
                }
            }
    
            // Si es el primer elemento o no se encontró un duplicado, añadir el cargo
            if ($add) {
                $v['cantcateg'] = $plazasVacantes; // Inicializar el contador con las plazas vacantes
                array_push($cargosresult, $v);
            }
        }
        return $cargosresult;
    }

	private function arrayColumn($arreglo, $columnKey, $indexKey)
    {
        if (function_exists( 'array_column' )) {
            return array_column($arreglo, $columnKey);
        }
        else {
            $resultado = array();
            foreach($arreglo as $k => $v) {
                $resultado[ $indexKey ? $v[ $indexKey ] : $k ] = $v[ $columnKey ];
            }
            return $resultado;
        }
    }
}