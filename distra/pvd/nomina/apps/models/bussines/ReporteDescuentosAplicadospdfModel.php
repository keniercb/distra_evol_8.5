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

    function Footer ()
    {


    }
}


class ReporteDescuentosAplicadospdfModel extends ZendExt_Model
{
    public function ReporteSNCpdfModel ()
    {
        parent::ZendExt_Model();

    }

    public function construirReporte ($datospersona)
    {
//print_r($datospersona);die;
        $pdf = new PDFNomina('L', 'mm', 'A4');
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 20);
        $pdffinal = $this->cabeceraReporte($pdf, $datospersona);
        $pdffinal = $this->cuerpoReporte($pdf, $datospersona);

        $pdffinal->Output();
    }

    public function cuerpoReporte ($pdf, $datospersona)
    {

        $variables1 = 'en contruccion';
        $variables = 'en contruccion';
        $plantilla = $datospersona[0]['idplantillanominal'];
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->MultiCell(550, 15, "Listado de Descuentos Aplicados a los Empleados", 0, 'L');
        $pdf->SetFont('Arial', 'I', 15);
        $pdf->SetX(350);
        $pdf->Cell(550, 15, "Fecha de impresion :  $variables1", 0, 1, 'L');
        $pdf->SetX(90);
        $pdf->Cell(50, 15, "Area/Grupo: ", 0, 'L');
        $pdf->Cell(100, 15, "" . utf8_decode("" . $datospersona[0]['denominacion']), 0, 1, 'L');
        $pdf->Cell(50, 15, "Empleado: ", 0, 'L');
        $pdf->Cell(200, 15, "", 0, 'L');
        $pdf->Cell(50, 15, "Descuento: ", 0, 'L');
        $pdf->Cell(50, 15, "", 0, 'L');
        $pdf->Cell(50, 15, "Tipo: ", 0, 'L');
        $pdf->Cell(50, 15, "", 0, 'L');
        $pdf->Cell(50, 15, "Nomina: ", 0, 1, 'L');

        foreach($datospersona as $k => $v) {

            if($plantilla != $v['idplantillanominal']){

                $pdf->SetFont('Arial', 'B', 15);
                $pdf->MultiCell(550, 15, "Listado de Descuentos Aplicados a los Empleados", 0, 'L');
                $pdf->SetFont('Arial', 'I', 15);
                //  $pdf->SetX(350);
                $pdf->Cell(550, 15, "Fecha de impresion :  $variables1", 0, 1, 'L');
                $pdf->SetX(90);
                $pdf->Cell(50, 15, "Area/Grupo: ", 0, 'L');
                $pdf->Cell(100, 15, "" . utf8_decode("" . $v[denominacion]), 0, 1, 'L');
                $pdf->Cell(50, 15, "Empleado: ", 0, 'L');
                $pdf->Cell(200, 15, "", 0, 'L');
                $pdf->Cell(50, 15, "Descuento: ", 0, 'L');
                $pdf->Cell(50, 15, "", 0, 'L');
                $pdf->Cell(50, 15, "Tipo: ", 0, 'L');
                $pdf->Cell(50, 15, "", 0, 'L');
                $pdf->Cell(50, 15, "Nomina: ", 0, 1, 'L');
            }
            $pdf->Cell(50, 15, "" . utf8_decode("" . $v[nombreyapellidos]), 0, 'L');
            $pdf->Cell(200, 15, "", 0, 'L');
            $pdf->Cell(50, 15, "566 ", 0, 'L');
            $pdf->Cell(50, 15, "", 0, 'L');
            $pdf->Cell(50, 15, "sm ", 0, 'L');
            $pdf->Cell(50, 15, "", 0, 'L');
            $pdf->Cell(50, 15, "genral ", 0, 1, 'L');


            $plantilla = $v['idplantillanominal'];
        }

        return $pdf;
    }

    public function cabeceraReporte ($pdf, $datospersona)
    {

        //Logo de la entidad
        $arrEstruct = ZendExt_IoC::getInstance()->metadatos->DameEstructura($this->identidad);
        list($imagenBase64,) = explode(';', $arrEstruct[0]->logo);
        list(, $extension) = explode('/', $imagenBase64);
        if(!empty($arrEstruct[0]->logo)){
            $pdf->Image($arrEstruct[0]->logo, 5, 5, 22, 10, $extension);
        }
        //base64_decode()
        //$register = Zend_Registry::getInstance();
        //$direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        //$pdf->Image($direccion, 5, 5, 22, 10);
        //Logo
        $register = Zend_Registry::getInstance();
        $direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        $pdf->Image($direccion, 5, 5, 22, 10);

        //Titulo
        $tituloprincipal = 'Listado de descuentos aplicados a los empleados';
        $pdf->Cell(280, 15, $tituloprincipal, 0, 1, 'C', 0);

        //Nombre de la Empresa
        $nombreempresa = 'TRD Caribe';
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(20, 10, 'Empresa: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(180, 10, $nombreempresa, 0, 0, 'L', 0);
        //$pdf->Cell(140, 10, $nombreempresa, 0, 0, 'L', 0);

        //Fecha y hora
        $date = DatNominaModel::fnFechaHora();
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(50, 10, 'Fecha: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(20, 10, $date['fecha'], 0, 1, 'L', 0);

        return $pdf;
    }

    public function fnPintarEncabezado (&$pdf, $objdatosperiodo, $estado)
    {
        $pdf->SetFont('Arial', 'B', 10);

        //Logo
        $register = Zend_Registry::getInstance();
        $direccion = $register->config->modulo_path . 'views/images/logotrd.jpg';
        $pdf->Image($direccion, 5, 5, 22, 10);

        //Titulo
        $tituloprincipal = 'MODELO SC-4-06 NOMINA';
        $pdf->Cell(280, 15, $tituloprincipal, 0, 1, 'C', 0);

        //Nombre de la Empresa
        $nombreempresa = 'TRD Caribe';
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(20, 10, 'Empresa: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(180, 10, $nombreempresa, 0, 0, 'L', 0);
        //$pdf->Cell(140, 10, $nombreempresa, 0, 0, 'L', 0);

        //Fecha y hora
        $date = DatNominaModel::fnFechaHora();
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(50, 10, 'Fecha: ', 0, 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(20, 10, $date['fecha'], 0, 1, 'L', 0);
        //$pdf->Cell(20, 10, $date['fecha'], 0, 0, 'L', 0);
        //$pdf->SetFont('Arial', 'B', 10);
        //$pdf->Cell(15, 10, 'Hora: ', 0, 0, 'R', 0);
        //$pdf->SetFont('Arial', '', 10);
        //$pdf->Cell(25, 10, $date['hora'], 0, 1, 'L', 0);

        $pdf->SetFillColor(240);//Definiendo el color de celdas
        $pdf->SetTextColor(0);//Definiendo el color de la letra
        //Primera fila-------------------------------------
        $pdf->Ln(2);
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(85, 5, 'Entidad', 1, 0, 'C', 0);
        $pdf->Cell(32, 5, 'Cheque', 1, 0, 'C', 0);
        $pdf->Cell(45, 20, '', 1, 0, 'C', 0);
        $pdf->Cell(20, 20, '', 1, 0, 'C', 0);
        $pdf->Cell(20, 20, '', 1, 0, 'C', 0);
        $pdf->Cell(21, 5, utf8_decode('Período:'), 'T', 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(11, 5, $objdatosperiodo['fechainicioperiodo'][1], 'T', 0, 'L', 0);
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(20, 5, 'Mes de pago:', 'T', 0, 'R', 0);
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(20, 5, $objdatosperiodo['mespago'], 'T,R', 1, 'L', 0);

        //Segunda fila-------------------------------------
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(55, 15, '', 1, 0, 'C', 0);
        $pdf->Cell(30, 15, '', 1, 0, 'C', 0);
        $pdf->Cell(10, 15, '', 1, 0, 'C', 0);
        $pdf->Cell(22, 15, '', 1, 0, 'C', 0);
        $pdf->Cell(45, 15, '', 0, 0, 'C', 0);
        $pdf->Cell(20, 15, '', 0, 0, 'C', 0);
        $pdf->Cell(20, 15, '', 0, 0, 'C', 0);
        $pdf->Cell(36, 5, 'Desde', 1, 0, 'C', 0);
        $pdf->Cell(36, 5, 'Hasta', 1, 1, 'C', 0);


        //Tercera fila-------------------------------------
        $pdf->SetFont('Arial', 'B', 8);
        $pdf->Cell(55, 5, 'Nombre', 0, 0, 'C', 0);
        $pdf->Cell(30, 5, utf8_decode('Código'), 0, 0, 'C', 0);
        $pdf->Cell(10, 5, 'No', 0, 0, 'C', 0);
        $pdf->Cell(22, 5, 'Fecha', 0, 0, 'C', 0);
        $pdf->Cell(45, 5, utf8_decode('Tipo de Nómina'), 0, 0, 'C', 0);
        $pdf->Cell(20, 5, utf8_decode('Nómina No.'), 0, 0, 'C', 0);
        $pdf->Cell(20, 5, 'Hoja No.', 0, 0, 'C', 0);
        $pdf->Cell(12, 5, utf8_decode('Día'), 1, 0, 'C', 0);
        $pdf->Cell(12, 5, 'Mes', 1, 0, 'C', 0);
        $pdf->Cell(12, 5, utf8_decode('Año'), 1, 0, 'C', 0);
        $pdf->Cell(12, 5, utf8_decode('Día'), 1, 0, 'C', 0);
        $pdf->Cell(12, 5, 'Mes', 1, 0, 'C', 0);
        $pdf->Cell(12, 5, utf8_decode('Año'), 1, 1, 'C', 0);

        //cuarta fila-------------------------------------
        $pdf->SetFont('Arial', '', 8);
        $pdf->Cell(55, 5, utf8_decode($objdatosperiodo['datosentidad'][0]['abreviatura']), 1, 0, 'C', 0);
        $pdf->Cell(30, 5, utf8_decode($objdatosperiodo['datosentidad'][0]['codigo']), 1, 0, 'C', 0);
        $pdf->Cell(10, 5, '', 1, 0, 'C', 0);
        $pdf->Cell(22, 5, '', 1, 0, 'C', 0);
        $pdf->Cell(45, 5, utf8_decode($objdatosperiodo['tiponomina']), 1, 0, 'C', 0);
        $pdf->Cell(20, 5, $objdatosperiodo['numeronomina'], 1, 0, 'C', 0);
        $pdf->Cell(20, 5, $pdf->PageNo(), 1, 0, 'C', 0);
        $pdf->Cell(12, 5, $objdatosperiodo['fechainicioperiodo'][0], 1, 0, 'C', 0);
        $pdf->Cell(12, 5, $objdatosperiodo['fechainicioperiodo'][1], 1, 0, 'C', 0);
        $pdf->Cell(12, 5, $objdatosperiodo['fechainicioperiodo'][2], 1, 0, 'C', 0);
        $pdf->Cell(12, 5, $objdatosperiodo['fechafinperiodo'][0], 1, 0, 'C', 0);
        $pdf->Cell(12, 5, $objdatosperiodo['fechafinperiodo'][1], 1, 0, 'C', 0);
        $pdf->Cell(12, 5, $objdatosperiodo['fechafinperiodo'][2], 1, 1, 'C', 0);
    }
}


