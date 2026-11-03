<?php
/**
 * Created by PhpStorm.
 * User: Ignacio Barrera Lópe
 * Date: 23/04/2018
 * Time: 11:26
 */

class GenerarPdfFichaCosto
{
    protected $pdf;
    protected $table;


    /**
     * GenerarPdfFichaCosto constructor.
     */
    public function __construct($params, $datoscarta, $piedefirma, $mediosmateriales, $energia, $combustible, $agua, $depreciacion, $salario, $mantenimiento, $dia, $mes, $anno)
    {
        $this->params = $params;

        $this->datoscarta = $datoscarta;
        $this->piedefirma = $piedefirma;
        $this->mediosmateriales = round($mediosmateriales, 2);
        $this->energia = round($energia, 2);
        $this->combustible = round($combustible, 2);
        $this->agua = round($agua, 2);
        $this->depreciacion = round($depreciacion, 2);
        $this->salario = round($salario, 2);
        $this->mantenimiento = round($mantenimiento, 2);
        $this->dia = $dia;
        $this->mes = $mes;
        $this->anno = $anno;


        $this->pdf = new TCPDF('P', PDF_UNIT, 'A3', true, 'UTF-8', false);
        $this->table = new Table($this->pdf);

// Set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('XETID');
        $this->pdf->SetTitle('Ficha de Costo');
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

// set default monospaced font
        $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);

// set margins
        $this->pdf->SetMargins(5, 5, 5);

// set auto page breaks
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

// set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
    }

    public function export()
    {
        $this->pdf->setJPEGQuality(75);
        $this->pdf->AddPage();
        $this->createHeader();
        $this->pdf->Ln(5);
        $this->pdf->Ln();
        $this->pdf->SetAutoPageBreak(TRUE, 20);


// Close and output PDF document
        ob_clean();
        $filename = $this->datoscarta[0]['denominacion'];
        $filename = strtolower($filename);


        //Reemplazamos caracteres especiales latinos
        $find = array('á', 'é', 'í', 'ó', 'ú', 'â', 'ê', 'î', 'ô', 'û', 'ü', 'ã', 'õ', 'ç', 'ñ');
        $repl = array('a', 'e', 'i', 'o', 'u', 'a', 'e', 'i', 'o', 'u', 'u', 'a', 'o', 'c', 'n');
        $filename = str_replace($find, $repl, $filename);

        //Añadimos los guiones
        $find = array(' ', '&amp;', '\r\n', '\n', '+');
        $filename = str_replace($find, '-', $filename);


        //Eliminamos y Reemplazamos los demas caracteres especiales
        $find = array('/[^a-z0-9\-&lt;&gt;]/', '/[\-]+/', '/&lt;{^&gt;*&gt;/');
        $repl = array('', '-', '');
        $filename = preg_replace($find, $repl, $filename);
        $filename = strtoupper($filename);

        $this->pdf->Output("FichaCosto_(" . $filename . ").pdf", 'I');
        return true;
    }

    private function createHeader()
    {

        $totalmaterias = $this->agua + $this->mediosmateriales + $this->combustible + $this->energia;
        $totalgastosdir = $this->depreciacion;
        $vacaciones = round($this->salario * 0.0909, 2);
        $seguridadsocial = round((($this->salario + $vacaciones) * 0.125), 2);
        $totalgastofuerza = $this->salario + $vacaciones + $seguridadsocial;
        $otros = round(($this->salario * 0.65) - $this->mantenimiento, 2);
        $totalgastoindi = $this->mantenimiento + $otros;
        $seguridadsocialgeneral = round(($this->salario + $vacaciones) * 0.015, 2);
        $gastomateriales = round(($this->salario - (($this->salario * 0.65) + $seguridadsocialgeneral)) * 0.6, 2);
        $otrosgenerales = round(($this->salario - ($this->salario * 0.65)) - ($gastomateriales + $seguridadsocialgeneral), 2);
        $gastosgenerales = $gastomateriales + $seguridadsocialgeneral + $otrosgenerales;
        $gastodistrb = 0;
        $gastobancario = 0;
        $seguroestatal = round(($totalmaterias + $totalgastosdir + $totalgastofuerza + $totalgastoindi + $gastosgenerales + $gastodistrb) * 0.05, 2);
        $subtotal = $totalgastosdir + $totalgastofuerza + $totalgastoindi + $gastosgenerales + $gastodistrb + $gastobancario + $seguroestatal;
        $gastostotales = $totalmaterias + $subtotal;
        $gastoTonelada = round($gastostotales / $this->datoscarta[0]['valorrendimiento'], 2);
        $gastoKilogramo = round($gastostotales / ($this->datoscarta[0]['valorrendimiento'] * 1000), 2);
        $gastoQuintal = round($gastostotales / ($this->datoscarta[0]['valorrendimiento'] * 21.74), 2);
        $precioTonelada = round(($gastostotales + ($gastostotales * 0.1)) / $this->datoscarta[0]['valorrendimiento'], 2);


        $this->pdf->setJPEGQuality(75);
        //TÍTULO
        //Formato: (ancho,alto, texto,bordes,salto de fila, alineacion,cell background,?,?)
        $this->pdf->SetFont('helvetica', 'B', 14);
        $this->pdf->setColor('black');
        $this->pdf->Cell(0, 5, 'MODELO - TIPO', 0, 0, 'C', false, '', 1);
        $this->pdf->Ln(6);

        $this->pdf->Cell(0, 5, 'PARA LA FORMACIÓN O MODIFICACIÓN DE PRECIOS MAYORISTAS POR EL MÉTODO DE GASTOS', 0, 0, 'C', false, '', 1);
        $this->pdf->Ln(12);

        //COLUMNAS
        $this->pdf->SetFont('helvetica', 'B', 10);
        $this->pdf->setColor('black');
        $this->pdf->SetFillColor(255, 255, 255);
        $this->pdf->Cell(125, 2, 'A) Empresa: ' . $this->params['denomentidad'], 'TLBR', 0, 'C', true, '', 1);
        $this->pdf->Cell(125, 2, 'B) Descripción del Producto: ' . $this->datoscarta[0]['denoindicador'], 'TLBR', 1, 'C', true, '', 1);

        $this->pdf->Cell(125, 2, 'Subordinada a: ' . $this->piedefirma[0]['empresasubordinada'], 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(125, 2, 'UM: ' . utf8_decode($this->datoscarta[0]['valorrendimiento']) .
            ' ' . $this->datoscarta[0]['denominacionunidadmedida'] .
            ' / ' . $this->datoscarta[0]['variablecontrol'], 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(125, 2, 'Propuesta de Precio', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(125, 2, 'Código del Producto: ' . $this->datoscarta[0]['codigoind'], 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(125, 2, 'Nuevo:                       Modificado: X', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(125, 2, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(250, 2, 'Volumen de Producción en U.F. (Anual)', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(13, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(75, 5, 'Propuesta Importe', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Conceptos de Gastos', 'LR', 0, 'C', true, '', 1);
        $this->pdf->Cell(13, 5, 'Fila', 'LR', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'Costo Base', 'LR', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'M.N.', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'Divisa', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'Total', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'Aprobado', 'LR', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'A', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(13, 5, 'B', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '1', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '2', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '3', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '4', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '6', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Materias Primas y Materiales', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '1', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $totalmaterias, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $totalmaterias, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Materias Primas y Materiales Fundamentales', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '1,1', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->mediosmateriales, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->mediosmateriales, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Combustibles y Lubricantes', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '1,2', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->combustible, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->combustible, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Energía Eléctrica', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '1,3', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->energia, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->energia, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Agua', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '1,4', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->agua, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->agua, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Subtotal (Gastos de Elaboración)', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '2', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $subtotal, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $subtotal, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Otros Gastos Directos', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '3', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $totalgastosdir, 'LRT', 0, 'C', true, '', 1);//falta el vaor del concepto arrendamiemnto de equipos junto con ropa y calzado
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $totalgastosdir, 'LRT', 0, 'C', true, '', 1);//falta el vaor del concepto arrendamiemnto de equipos
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Depreciación', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '3,1', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->depreciacion, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->depreciacion, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Arrendamiento de Equipos', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '3,2', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Ropa y Calzado (Trabajadores Directos)', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '3,3', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Gastos de Fuerza de Trabajo', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '4', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $totalgastofuerza, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $totalgastofuerza, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Salarios ', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '4,1', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->salario, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->salario, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Vacaciones', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '4,2', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $vacaciones, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $vacaciones, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Contribución a la Seguridad Social', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '4,3', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $seguridadsocial, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $seguridadsocial, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Impuesto por la Utilización de la Fuerza de Trabajo', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '4,4', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Estimulación Fuerza de Trabajo', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '4,5', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Gastos Indirectos de Producción', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '5', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $totalgastoindi, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $totalgastoindi, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Mantenimiento y Reparación', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '5,1', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->mantenimiento, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->mantenimiento, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Otros', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '5,2', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $otros, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $otros, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Gastos Generales y de Administración', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '6', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $gastosgenerales, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $gastosgenerales, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Materiales', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '6,1', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $gastomateriales, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $gastomateriales, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Contribución a la Seguridad Social (1,5 %)', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '6,2', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $seguridadsocialgeneral, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $seguridadsocialgeneral, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, '   Otros', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '6,3', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $otrosgenerales, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $otrosgenerales, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Gastos de Distribución y Venta', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '7', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Gastos Bancarios', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '8', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Seguro Estatal', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '9', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $seguroestatal, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $seguroestatal, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Gastos Totales', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '10', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $gastostotales, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $gastostotales, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Gasto por Tonelada', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '11', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $gastoTonelada, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Gasto por Kilogramo', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '12', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $gastoKilogramo, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Gasto por Quintal', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '13', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $gastoQuintal, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Margen Utilidad (10 % Gasto Total)', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '14', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '0.10', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Utilidad', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '15', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, round($gastostotales * 0.1, 2), 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Precio de Empresa por Tonelada', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '16', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $precioTonelada, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Precio de Empresa por Kilogramo', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '17', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, round($precioTonelada / 1000, 2), 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Precio de Empresa por Quintal', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '18', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, round($precioTonelada / 21.74, 2), 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Precio de Empresa Anterior por Tonelada', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '19', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 5521.96, 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Precio de Empresa  Anterior por Kilogramo', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '20', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, round(5521.96 / 1000, 2), 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(112, 5, 'Precio de Empresa  Anterior por Quintal', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(13, 5, '21', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRTT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRTT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, round(5521.96 / 21.74, 2), 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(67, 5, 'Confeccionado por:', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(58, 5, 'Firma', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(50, 5, 'Cargo: ' . $this->piedefirma[0]['cargoconf'], 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(75, 5, 'Fecha', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(67, 5, $this->piedefirma[0]['confeccionada'], 'LR', 0, 'L', true, '', 1);
        $this->pdf->Cell(58, 5, '', 'LR', 0, 'C', true, '', 1);
        $this->pdf->Cell(50, 5, 'Teléfono: ' . $this->piedefirma[0]['telefonoconf'], 'LR', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, 'D', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'M', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, 'A', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(67, 5, 'Aprobado por:', 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(58, 5, 'Firma', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(50, 5, 'Cargo: ' . $this->piedefirma[0]['cargoaprob'], 'LRT', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, '', 'LRT', 1, 'C', true, '', 1);

        $this->pdf->Cell(67, 5, $this->piedefirma[0]['aprobada'], 'LRB', 0, 'L', true, '', 1);
        $this->pdf->Cell(58, 5, '', 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(50, 5, 'Teléfono: ' . $this->piedefirma[0]['telefonoaprob'], 'LRB', 0, 'L', true, '', 1);
        $this->pdf->Cell(25, 5, $this->dia, 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->mes, 'LRB', 0, 'C', true, '', 1);
        $this->pdf->Cell(25, 5, $this->anno, 'LRB', 1, 'C', true, '', 1);








    }
}
