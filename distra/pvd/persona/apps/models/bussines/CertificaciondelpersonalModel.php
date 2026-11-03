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
class CertificaciondelpersonalModel extends ZendExt_Model
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
    public function directivosMujeresPrimerosoficiales($estructura){

        $sql = "select count(dcp.idpersona) as categ
from
mod_personaext.dat_categoria as dcp
INNER JOIN mod_personaext.nom_categoriapersona as ncp on (dcp.idcategoriapersona = ncp.idcategoriapersona)
INNER JOIN mod_persona.dat_persona as p on (dcp.idpersona = p.idpersona)
Inner JOIN mod_persona.dat_personaentidad as pe on (dcp.idpersona = pe.idpersona and pe.fhasta is null)
INNER JOIN mod_persona.dat_situacionlaboral as sit on (pe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1 and sit.fhasta is null)
INNER JOIN mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
INNER JOIN mod_estructuracomp.dat_cargocivil as dcc on (sit.idcargo = dcc.idcargo)
INNER JOIN mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
where ec.idestructuraop = $estructura and ncp.idcategoriapersona = 24 and p.sexo = 0 and nc.idcategocup = 5";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function directivosHombresPrimerosoficiales($estructura){

        $sql = "select count(dcp.idpersona) as categ
from
mod_personaext.dat_categoria as dcp
INNER JOIN mod_personaext.nom_categoriapersona as ncp on (dcp.idcategoriapersona = ncp.idcategoriapersona)
INNER JOIN mod_persona.dat_persona as p on (dcp.idpersona = p.idpersona)
Inner JOIN mod_persona.dat_personaentidad as pe on (dcp.idpersona = pe.idpersona and pe.fhasta is null)
INNER JOIN mod_persona.dat_situacionlaboral as sit on (pe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1 and sit.fhasta is null)
INNER JOIN mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
INNER JOIN mod_estructuracomp.dat_cargocivil as dcc on (sit.idcargo = dcc.idcargo)
INNER JOIN mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
where ec.idestructuraop = $estructura and ncp.idcategoriapersona = 24 and p.sexo = 1 and nc.idcategocup = 5";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function directivosHombresOficialessubalternos($estructura){

        $sql = "select count(dcp.idpersona) as categ
from
mod_personaext.dat_categoria as dcp
INNER JOIN mod_personaext.nom_categoriapersona as ncp on (dcp.idcategoriapersona = ncp.idcategoriapersona)
INNER JOIN mod_persona.dat_persona as p on (dcp.idpersona = p.idpersona)
Inner JOIN mod_persona.dat_personaentidad as pe on (dcp.idpersona = pe.idpersona and pe.fhasta is null)
INNER JOIN mod_persona.dat_situacionlaboral as sit on (pe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1 and sit.fhasta is null)
INNER JOIN mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
INNER JOIN mod_estructuracomp.dat_cargocivil as dcc on (sit.idcargo = dcc.idcargo)
INNER JOIN mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
where ec.idestructuraop = $estructura and ncp.idcategoriapersona = 23 and p.sexo = 1 and nc.idcategocup = 5";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function directivosMujeresOficialessubalternos($estructura){

        $sql = "select count(dcp.idpersona) as categ
from
mod_personaext.dat_categoria as dcp
INNER JOIN mod_personaext.nom_categoriapersona as ncp on (dcp.idcategoriapersona = ncp.idcategoriapersona)
INNER JOIN mod_persona.dat_persona as p on (dcp.idpersona = p.idpersona)
Inner JOIN mod_persona.dat_personaentidad as pe on (dcp.idpersona = pe.idpersona and pe.fhasta is null)
INNER JOIN mod_persona.dat_situacionlaboral as sit on (pe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1 and sit.fhasta is null)
INNER JOIN mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
INNER JOIN mod_estructuracomp.dat_cargocivil as dcc on (sit.idcargo = dcc.idcargo)
INNER JOIN mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
where ec.idestructuraop = $estructura and ncp.idcategoriapersona = 23 and p.sexo = 0 and nc.idcategocup = 5";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function ejecutivosHombresOficialessubalternos($estructura){

    $sql = "select count(dcp.idpersona) as categ
from
mod_personaext.dat_categoria as dcp
INNER JOIN mod_personaext.nom_categoriapersona as ncp on (dcp.idcategoriapersona = ncp.idcategoriapersona)
INNER JOIN mod_persona.dat_persona as p on (dcp.idpersona = p.idpersona)
Inner JOIN mod_persona.dat_personaentidad as pe on (dcp.idpersona = pe.idpersona and pe.fhasta is null)
INNER JOIN mod_persona.dat_situacionlaboral as sit on (pe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1 and sit.fhasta is null)
INNER JOIN mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
INNER JOIN mod_estructuracomp.dat_cargocivil as dcc on (sit.idcargo = dcc.idcargo)
INNER JOIN mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
where ec.idestructuraop = $estructura and ncp.idcategoriapersona = 23 and p.sexo = 1 and nc.idcategocup = 7";
    $dm = Doctrine_Manager::getInstance();
    $conn = $dm->getCurrentConnection();
    return $conn->fetchAll($sql);
}
    public function ejecutivosMujeresOficialessubalternos($estructura){

        $sql = "select count(dcp.idpersona) as categ
from
mod_personaext.dat_categoria as dcp
INNER JOIN mod_personaext.nom_categoriapersona as ncp on (dcp.idcategoriapersona = ncp.idcategoriapersona)
INNER JOIN mod_persona.dat_persona as p on (dcp.idpersona = p.idpersona)
Inner JOIN mod_persona.dat_personaentidad as pe on (dcp.idpersona = pe.idpersona and pe.fhasta is null)
INNER JOIN mod_persona.dat_situacionlaboral as sit on (pe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1 and sit.fhasta is null)
INNER JOIN mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
INNER JOIN mod_estructuracomp.dat_cargocivil as dcc on (sit.idcargo = dcc.idcargo)
INNER JOIN mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
where ec.idestructuraop = $estructura and ncp.idcategoriapersona = 23 and p.sexo = 0 and nc.idcategocup = 7";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function ejecutivosHombresPrimerosoficiales($estructura){

        $sql = "select count(dcp.idpersona) as categ
from
mod_personaext.dat_categoria as dcp
INNER JOIN mod_personaext.nom_categoriapersona as ncp on (dcp.idcategoriapersona = ncp.idcategoriapersona)
INNER JOIN mod_persona.dat_persona as p on (dcp.idpersona = p.idpersona)
Inner JOIN mod_persona.dat_personaentidad as pe on (dcp.idpersona = pe.idpersona and pe.fhasta is null)
INNER JOIN mod_persona.dat_situacionlaboral as sit on (pe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1 and sit.fhasta is null)
INNER JOIN mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
INNER JOIN mod_estructuracomp.dat_cargocivil as dcc on (sit.idcargo = dcc.idcargo)
INNER JOIN mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
where ec.idestructuraop = $estructura and ncp.idcategoriapersona = 24 and p.sexo = 1 and nc.idcategocup = 7";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function ejecutivosMujeresPrimerosoficiales($estructura){

        $sql = "select count(dcp.idpersona) as categ
from
mod_personaext.dat_categoria as dcp
INNER JOIN mod_personaext.nom_categoriapersona as ncp on (dcp.idcategoriapersona = ncp.idcategoriapersona)
INNER JOIN mod_persona.dat_persona as p on (dcp.idpersona = p.idpersona)
Inner JOIN mod_persona.dat_personaentidad as pe on (dcp.idpersona = pe.idpersona and pe.fhasta is null)
INNER JOIN mod_persona.dat_situacionlaboral as sit on (pe.idpersonaentidad = sit.idpersonaentidad and sit.principal = 1 and sit.fhasta is null)
INNER JOIN mod_estructuracomp.dat_estructuraop as ec on (sit.ueb = ec.idestructuraop)
INNER JOIN mod_estructuracomp.dat_cargocivil as dcc on (sit.idcargo = dcc.idcargo)
INNER JOIN mod_estructuracomp.nom_categocup as nc on (dcc.idcategocup = nc.idcategocup)
where ec.idestructuraop = $estructura and ncp.idcategoriapersona = 24 and p.sexo = 0 and nc.idcategocup = 7";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    //Reporte
   public function exportarestadoCertificacion( $estructura){
         $pdf = new fpdf('L', 'mm', array(440,560));
         $pdf->SetTitle("Certificacion del personal");
         $pdf->SetAuthor("Ing. Osiel Fundora Ramírez");
         $pdf->SetLeftMargin(2);
         $pdf->AddPage();
         $pdf->SetFont('Arial', 'B', 20);
       //var_dump($estructura);die;
if($estructura == null)
{$pdffinal = $this->cabeceraReportenulo($pdf,    $estructura);

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
$categoria = utf8_decode('Certificación');
        $tec = utf8_decode('Técnicos');
        $cat = utf8_decode('Categoría');
        $dulceria = utf8_decode('dulcería');
        $gastro = utf8_decode('Gastronómicos');
        $alma = utf8_decode('Almacén');
        $chofer = utf8_decode('Chóferes');
        $pro = utf8_decode('Producción');
        $med = utf8_decode('Médicos');
        $estom = utf8_decode('Estomatólogos');
        $directivosprimerosoficialesmujeres = $this->directivosMujeresPrimerosoficiales($estructura);
        $dirM1eroficial = $directivosprimerosoficialesmujeres[0]['categ'];
        $directivosprimerosoficialeshombres = $this->directivosHombresPrimerosoficiales($estructura);
        $dirH1eroficial = $directivosprimerosoficialeshombres[0]['categ'];
        $totaldirectivos1eroficial = $dirH1eroficial+$dirM1eroficial;
        $directivosuboficialmujer = $this->directivosMujeresOficialessubalternos($estructura);
        $dirmujersuboficial = $directivosuboficialmujer[0]['categ'];
        $directivohombresuboficial = $this->directivosHombresOficialessubalternos($estructura);
        $dirhombresuboficial = $directivohombresuboficial[0]['categ'];
        $totalsuboficialdirectivo = $dirhombresuboficial+$dirmujersuboficial;
        $ejecutivoprimeroficialmujer = $this->ejecutivosMujeresPrimerosoficiales($estructura);
        $ejec1eroficialmujer = $ejecutivoprimeroficialmujer[0]['categ'];
        $ejecutivoprimeroficialhombre = $this->ejecutivosHombresPrimerosoficiales($estructura);
        $ejechombreprimeroficial = $ejecutivoprimeroficialhombre[0]['categ'];
        $totalejecutivosprimeroficial = $ejec1eroficialmujer+$ejechombreprimeroficial;
        $ejecutivossuboficialmujeres = $this->ejecutivosMujeresOficialessubalternos($estructura);
        $ejectsubmujeres = $ejecutivossuboficialmujeres[0]['categ'];
        $ejecutivossuboficialhombre = $this->ejecutivosHombresOficialessubalternos($estructura);
        $ejecsubhombre = $ejecutivossuboficialhombre[0]['categ'];
        $totalejecutivosub = $ejecsubhombre+$ejectsubmujeres;
        //Primera fila del encabezado
        $pdf->SetX(100);
        $pdf->Cell(400,15,"",0,0, 'C');
        $pdf->Ln(15);
        $pdf->Cell(200,15,"$categoria del personal",0,0, 'C');
        $pdf->Cell(300,15,"$fechas",0,0, 'C');
        $pdf->Ln(15);

        $pdf->Cell(40,15,"No.",1,0, 'C');
        $pdf->Cell(100,15,"$cat",1,0, 'C');
        $pdf->Cell(100,15,"Mujeres",1,0, 'C');
        $pdf->Cell(100,15,"Hombres",1,0, 'C');
        $pdf->Cell(100,15,"Total",1,0, 'C');
        $pdf->Ln(15);
        $pdf->Cell(40,10,"1",1,0, 'C');
        $pdf->Cell(100,10,"Directivos",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.1",1,0, 'C');
        $pdf->Cell(100,10,"Primeros Oficiales",1,0, 'C');
        $pdf->Cell(100,10,"$dirM1eroficial",1,0, 'C');
        $pdf->Cell(100,10,"$dirH1eroficial",1,0, 'C');
        $pdf->Cell(100,10,"$totaldirectivos1eroficial",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.2",1,0, 'C');
        $pdf->Cell(100,10,"Oficiales Subalternos",1,0, 'C');
        $pdf->Cell(100,10,"$dirmujersuboficial",1,0, 'C');
        $pdf->Cell(100,10,"$dirhombresuboficial",1,0, 'C');
        $pdf->Cell(100,10,"$totalsuboficialdirectivo",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.3",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 1er Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.4",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 2do Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.5",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 3er Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.6",1,0, 'C');
        $pdf->Cell(100,10,"Otros Cuadros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2",1,0, 'C');
        $pdf->Cell(100,10,"Ejecutivos",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.1",1,0, 'C');
        $pdf->Cell(100,10,"Primeros Oficiales",1,0, 'C');
        $pdf->Cell(100,10,"$ejec1eroficialmujer",1,0, 'C');
        $pdf->Cell(100,10,"$ejechombreprimeroficial",1,0, 'C');
        $pdf->Cell(100,10,"$totalejecutivosprimeroficial",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.2",1,0, 'C');
        $pdf->Cell(100,10,"Oficiales Subalternos",1,0, 'C');
        $pdf->Cell(100,10,"$ejectsubmujeres",1,0, 'C');
        $pdf->Cell(100,10,"$ejecsubhombre",1,0, 'C');
        $pdf->Cell(100,10,"$totalejecutivosub",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.3",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 1er Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.4",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 2do Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.5",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 3er Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.6",1,0, 'C');
        $pdf->Cell(100,10,"Otros Cuadros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3",1,0, 'C');
        $pdf->Cell(100,10,"$tec",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.1",1,0, 'C');
        $pdf->Cell(100,10,"$tec (Trabajo Administrativo)",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.2",1,0, 'C');
        $pdf->Cell(100,10,"$tec Directo a $pro",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.3",1,0, 'C');
        $pdf->Cell(100,10,"$tec en Adiestramiento",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.4",1,0, 'C');
        $pdf->Cell(100,10,"Oficial Subalterno",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.5",1,0, 'C');
        $pdf->Cell(100,10,"$med",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.6",1,0, 'C');
        $pdf->Cell(100,10,"$estom",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.7",1,0, 'C');
        $pdf->Cell(100,10,"$tec de Salud",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.8",1,0, 'C');
        $pdf->Cell(100,10,"Otros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"4",1,0, 'C');
        $pdf->Cell(100,10,"Administrativos",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5",1,0, 'C');
        $pdf->Cell(100,10,"Servicios",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.1",1,0, 'C');
        $pdf->Cell(100,10,"Cocineros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.2",1,0, 'C');
        $pdf->Cell(100,10,"Panaderos y Dulceros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.3",1,0, 'C');
        $pdf->Cell(100,10,"Ayudantes (coc, panad, $dulceria)",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.4",1,0, 'C');
        $pdf->Cell(100,10,"Dependientes $gastro",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.5",1,0, 'C');
        $pdf->Cell(100,10,"Dependientes de $alma",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.6",1,0, 'C');
        $pdf->Cell(100,10,"Pisteros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.7",1,0, 'C');
        $pdf->Cell(100,10,"Encargado de $alma",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.8",1,0, 'C');
        $pdf->Cell(100,10,"$chofer",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.9",1,0, 'C');
        $pdf->Cell(100,10,"CVP",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.10",1,0, 'C');
        $pdf->Cell(100,10,"Jardinero",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.11",1,0, 'C');
        $pdf->Cell(100,10,"Auxiliar General (limpieza)",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.12",1,0, 'C');
        $pdf->Cell(100,10,"Otros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6",1,0, 'C');
        $pdf->Cell(100,10,"Obreros",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.1",1,0, 'C');
        $pdf->Cell(100,10,"Constructores",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.2",1,0, 'C');
        $pdf->Cell(100,10,"Cocineros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.3",1,0, 'C');
        $pdf->Cell(100,10,"Ayudante de Cocina",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.4",1,0, 'C');
        $pdf->Cell(100,10,"$chofer",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.5",1,0, 'C');
        $pdf->Cell(100,10,"Operadores de Equipos Pesados",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.6",1,0, 'C');
        $pdf->Cell(100,10,"$chofer Directo a $pro",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.7",1,0, 'C');
        $pdf->Cell(100,10,"Servicio Alternativo",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.8",1,0, 'C');
        $pdf->Cell(100,10,"Otros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Total de efectivos",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(30);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Albergados",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Constructores",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Tuneleros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Obra Divisa",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Otros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(50);

        $pdf->Cell(50, 15, "Elaborado:",0,0, 'C');
        $pdf->SetX(300);
        $pdf->Cell(50, 15, "Aprobado por:",0,0, 'C');


        return $pdf;}
    public function cabeceraReportenulo($pdf,   $estructura)
    {
        $fecha = $this->fecha();
        $fechas = $fecha[0]['anno'];
        //Cabecera
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->SetMargins(50,10);
        $categoria = utf8_decode('Certificación');
        $tec = utf8_decode('Técnicos');
        $cat = utf8_decode('Categoría');
        $dulceria = utf8_decode('dulcería');
        $gastro = utf8_decode('Gastronómicos');
        $alma = utf8_decode('Almacén');
        $chofer = utf8_decode('Chóferes');
        $pro = utf8_decode('Producción');
        $med = utf8_decode('Médicos');
        $estom = utf8_decode('Estomatólogos');

        //Primera fila del encabezado
        $pdf->SetX(100);
        $pdf->Cell(400,15,"",0,0, 'C');
        $pdf->Ln(15);
        $pdf->Cell(200,15," del personal",0,0, 'C');
        $pdf->Cell(300,15,"",0,0, 'C');
        $pdf->Ln(15);

        $pdf->Cell(40,15,"No.",1,0, 'C');
        $pdf->Cell(100,15,"$cat",1,0, 'C');
        $pdf->Cell(100,15,"Mujeres",1,0, 'C');
        $pdf->Cell(100,15,"Hombres",1,0, 'C');
        $pdf->Cell(100,15,"Total",1,0, 'C');
        $pdf->Ln(15);
        $pdf->Cell(40,10,"1",1,0, 'C');
        $pdf->Cell(100,10,"Directivos",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.1",1,0, 'C');
        $pdf->Cell(100,10,"Primeros Oficiales",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.2",1,0, 'C');
        $pdf->Cell(100,10,"Oficiales Subalternos",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.3",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 1er Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.4",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 2do Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.5",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 3er Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"1.6",1,0, 'C');
        $pdf->Cell(100,10,"Otros Cuadros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2",1,0, 'C');
        $pdf->Cell(100,10,"Ejecutivos",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.1",1,0, 'C');
        $pdf->Cell(100,10,"Primeros Oficiales",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.2",1,0, 'C');
        $pdf->Cell(100,10,"Oficiales Subalternos",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.3",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 1er Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.4",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 2do Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.5",1,0, 'C');
        $pdf->Cell(100,10,"Cuadros de 3er Nivel",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"2.6",1,0, 'C');
        $pdf->Cell(100,10,"Otros Cuadros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3",1,0, 'C');
        $pdf->Cell(100,10,"$tec",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.1",1,0, 'C');
        $pdf->Cell(100,10,"$tec (Trabajo Administrativo)",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.2",1,0, 'C');
        $pdf->Cell(100,10,"$tec Directo a $pro",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.3",1,0, 'C');
        $pdf->Cell(100,10,"$tec en Adiestramiento",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.4",1,0, 'C');
        $pdf->Cell(100,10,"Oficial Subalterno",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.5",1,0, 'C');
        $pdf->Cell(100,10,"$med",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.6",1,0, 'C');
        $pdf->Cell(100,10,"$estom",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.7",1,0, 'C');
        $pdf->Cell(100,10,"$tec de Salud",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"3.8",1,0, 'C');
        $pdf->Cell(100,10,"Otros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"4",1,0, 'C');
        $pdf->Cell(100,10,"Administrativos",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5",1,0, 'C');
        $pdf->Cell(100,10,"Servicios",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.1",1,0, 'C');
        $pdf->Cell(100,10,"Cocineros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.2",1,0, 'C');
        $pdf->Cell(100,10,"Panaderos y Dulceros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.3",1,0, 'C');
        $pdf->Cell(100,10,"Ayudantes (coc, panad, $dulceria)",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.4",1,0, 'C');
        $pdf->Cell(100,10,"Dependientes $gastro",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.5",1,0, 'C');
        $pdf->Cell(100,10,"Dependientes de $alma",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.6",1,0, 'C');
        $pdf->Cell(100,10,"Pisteros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.7",1,0, 'C');
        $pdf->Cell(100,10,"Encargado de $alma",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.8",1,0, 'C');
        $pdf->Cell(100,10,"$chofer",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.9",1,0, 'C');
        $pdf->Cell(100,10,"CVP",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.10",1,0, 'C');
        $pdf->Cell(100,10,"Jardinero",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.11",1,0, 'C');
        $pdf->Cell(100,10,"Auxiliar General (limpieza)",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"5.12",1,0, 'C');
        $pdf->Cell(100,10,"Otros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6",1,0, 'C');
        $pdf->Cell(100,10,"Obreros",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.1",1,0, 'C');
        $pdf->Cell(100,10,"Constructores",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.2",1,0, 'C');
        $pdf->Cell(100,10,"Cocineros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.3",1,0, 'C');
        $pdf->Cell(100,10,"Ayudante de Cocina",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.4",1,0, 'C');
        $pdf->Cell(100,10,"$chofer",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.5",1,0, 'C');
        $pdf->Cell(100,10,"Operadores de Equipos Pesados",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.6",1,0, 'C');
        $pdf->Cell(100,10,"$chofer Directo a $pro",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.7",1,0, 'C');
        $pdf->Cell(100,10,"Servicio Alternativo",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"6.8",1,0, 'C');
        $pdf->Cell(100,10,"Otros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Total de efectivos",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(30);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Albergados",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"         De ellos son:",1,0);
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Constructores",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Tuneleros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Obra Divisa",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(10);
        $pdf->Cell(40,10,"",1,0, 'C');
        $pdf->Cell(100,10,"Otros",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Cell(100,10,"",1,0, 'C');
        $pdf->Ln(50);

        $pdf->Cell(50, 15, "Elaborado:",0,0, 'C');
        $pdf->SetX(300);
        $pdf->Cell(50, 15, "Aprobado por:",0,0, 'C');


        return $pdf;}
}