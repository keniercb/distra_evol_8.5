<?php
    /**
     * @name MovimientonaminalModel - Clase de lógica de negocio del reporte de movimiento de nomina.
     * @package movimientoslaborales.
     * @copyright XETID.
     * @author Centro RRHH. División Gestión de Entidades. XETID.
     * @version 1.0
    */
$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);
class PDFAnexo2 extends fpdf
{
    private $pdf;
    private $table;
    private $alingsArray;
    function Footer()
    {

    }
}
class PromediotrabajadoresacumuladoModel extends ZendExt_Model
{
    /**
     * @method CertificaciondelpersonalModel - Constructor de la clase.
     * @author Osiel Fundora Ramírez.

   **/
//Consultas
    public function fecha(){

        $sql = "select now()::date as anno";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }

    public function denominacion($estructura){

        $sql = "select ec.denominacion  as deno from mod_estructuracomp.dat_estructuraop as ec where ec.idestructuraop = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    //Reporte
   public function exportarestadoPromedio( $estructura){
         $pdf = new fpdf('L', 'mm', array(440,560));
         $pdf->SetTitle("Promedio de trabajadores acumulados");
         $pdf->SetAuthor("Ing. Osiel Fundora Ramírez");
         $pdf->SetLeftMargin(2);
         $pdf->AddPage();
         $pdf->SetFont('Arial', 'B', 20);
       //var_dump($estructura);die;
if($estructura == null)
{$pdffinal = $this->cabeceraReportenull($pdf,    $estructura);

    $pdffinal->Output();
}
else{
    $pdffinal = $this->cabeceraReporte($pdf,    $estructura);

    $pdffinal->Output();
}


     }

    public function cabeceraReporte($pdf,   $estructura)
    {
        $fecha = $this->fecha();
        $fechas = $fecha[0]['anno'];
                //Cabecera
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->SetMargins(50,10);
$categoria = utf8_decode('Días');
        $tec = utf8_decode('Técnicos');
        $cat = utf8_decode('Categoría');
        $deno = $this->denominacion($estructura);
        $den = $deno[0]['deno'];
        $cod = utf8_decode($den);


        //Primera fila del encabezado
        $pdf->SetX(100);
        $pdf->Cell(100,15,"Promedio de trabajadores",0,0, 'C');
        $pdf->Cell(200,15,"$cod",0,0, 'C');
        $pdf->Ln(15);

        $pdf->Cell(100,20,"Meses",1,0, 'C');
        $pdf->Cell(100,10,"Total",1,0, 'C');
        $pdf->Cell(100,10,"Promedio de Trabaj.",1,0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(150);
        $pdf->Cell(50,10,"Horas",1,0, 'C');
        $pdf->SetX(200);
        $pdf->Cell(50,10,"$categoria",1,0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(50,10,"Mes",1,0, 'C');
        $pdf->SetX(300);
        $pdf->Cell(50,10,"$categoria",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Enero",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Febrero",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Marzo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Abril",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Mayo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Junio",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Julio",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Agosto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Septiembre",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Octubre",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Noviembre",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Diciembre",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');

        $pdf->Ln(10);
        $pdf->Cell(50, 5, "Elaborado:",0,0, 'C');
        $pdf->SetX(300);
        $pdf->Cell(50, 5, "Aprobado por:",0,0, 'C');


        return $pdf;}
    public function cabeceraReportenull($pdf)
    {
        $fecha = $this->fecha();
        $fechas = $fecha[0]['anno'];
        //Cabecera
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->SetMargins(50,10);
        $categoria = utf8_decode('Días');
        $tec = utf8_decode('Técnicos');
        $cat = utf8_decode('Categoría');
       // $deno = $this->denominacion($estructura);
        $den = $deno[0]['deno'];
        $cod = utf8_decode($den);


        //Primera fila del encabezado
        $pdf->SetX(100);
        $pdf->Cell(100,15,"Promedio de trabajadores",0,0, 'C');
        $pdf->Cell(200,15,"$cod",0,0, 'C');
        $pdf->Ln(15);

        $pdf->Cell(100,20,"Meses",1,0, 'C');
        $pdf->Cell(100,10,"Total",1,0, 'C');
        $pdf->Cell(100,10,"Promedio de Trabaj.",1,0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(150);
        $pdf->Cell(50,10,"Horas",1,0, 'C');
        $pdf->SetX(200);
        $pdf->Cell(50,10,"$categoria",1,0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(50,10,"Mes",1,0, 'C');
        $pdf->SetX(300);
        $pdf->Cell(50,10,"$categoria",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Enero",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Febrero",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Marzo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Abril",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Mayo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Junio",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Julio",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Agosto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Septiembre",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Octubre",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Noviembre",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Diciembre",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Directo",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(100,10,"Indirecto",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');
        $pdf->Cell(50,10,"",1,0, 'C');

        $pdf->Ln(10);
        $pdf->Cell(50, 5, "Elaborado:",0,0, 'C');
        $pdf->SetX(300);
        $pdf->Cell(50, 5, "Aprobado por:",0,0, 'C');


        return $pdf;}
}