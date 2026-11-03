<?php
class PDFAnexo3 extends fpdf
{
    //private $pdf;
    //private $table;
    //private $alingsArray;
    function Footer()
    {

    }
}
class Anexo3Model extends ZendExt_Model
{
    /**
     * @method Anexo3Model - Constructor de la clase.
     * @author Osiel Fundora Ramírez.

   **/
//Consultas
    public function indeterminados($idcargos)
    {
        $sql = "select count (pe.idpersonaentidad) as indeterminado
        from
        mod_persona.dat_personaentidad as pe
        INNER JOIN mod_persona.dat_situacionlaboral as sit 
            on (sit.idpersonaentidad = pe.idpersonaentidad and (sit.fhasta is null or sit.fhasta > now()::date))
        INNER JOIN mod_fuerzatrabajo.nom_tipocontrato as ntc on (sit.idtipocontrato = ntc.idtipocontrato)
        where ntc.determinado = 0 and (pe.fhasta is null or pe.fhasta > now()::date) and sit.principal = 1 and sit.estado = 0
        AND sit.idcargo in (" . implode(',', $idcargos) . ") AND pe.idpersonaentidad in (SELECT dsl.idpersonaentidad
        FROM mod_persona.dat_situacionlaboral as  dsl
        WHERE dsl.idpersonaentidad = pe.idpersonaentidad AND dsl.idcargo <> sit.idcargo and dsl.estado = 0
            AND (pe.fhasta is null or pe.fhasta > now())AND dsl.idcargo in (" . implode(',', $idcargos) . "))";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function determinado($idcargos)
    {
        $sql = "select count (pe.idpersonaentidad) as determinado
        from
         mod_persona.dat_personaentidad as pe
        INNER JOIN mod_persona.dat_situacionlaboral as sit 
            on (sit.idpersonaentidad = pe.idpersonaentidad and (sit.fhasta is null or sit.fhasta > now()::date))
        INNER JOIN mod_fuerzatrabajo.nom_tipocontrato as ntc on (sit.idtipocontrato = ntc.idtipocontrato)
        where ntc.determinado = 1 and (pe.fhasta is null or pe.fhasta > now()::date) and sit.principal = 1 and sit.estado = 0
        AND sit.idcargo in (" . implode(',', $idcargos) . ") AND pe.idpersonaentidad in (SELECT dsl.idpersonaentidad
        FROM mod_persona.dat_situacionlaboral as  dsl
        WHERE dsl.idpersonaentidad = pe.idpersonaentidad AND dsl.idcargo <> sit.idcargo and dsl.estado = 0
            AND (pe.fhasta is null or pe.fhasta > now()) AND dsl.idcargo in (" . implode(',', $idcargos) . "))";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }



    //Reporte
    public function construirReporte($idestructura)
    {
         $pdf = new fpdf('L', 'mm', array(440,560));
         $pdf->SetTitle("CONTROL DE TRABAJADORES CON MAS DE UN CONTRATO");
         $pdf->SetAuthor("Ing. Osiel Fundora Ramírez");
         $pdf->SetLeftMargin(2);
         $pdf->AddPage();
         $pdf->SetFont('Arial', 'B', 20);

       //var_dump($ent);die;
          $pdffinal = $this->cabeceraReporte($pdf, $idestructura);
           $pdffinal->Output();

    }
    
     public function cabeceraReporte($pdf, $idestructura)
     {
         $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($idestructura, true);
         if (count($cargos) > 0) {
             foreach ($cargos as $h => $carg) {
                 $idcargos[$h] = $carg['idcargo'];
             }
         }
        $indeterminado = $this->indeterminados($idcargos);
        $indt = $indeterminado[0]['indeterminado'];
        $determinado = $this->determinado($idcargos);
        $det = $determinado[0]['determinado'];
        $total = $indt+$det;
        $titulo = utf8_decode('Trabajadores con más de un contrato de trabajo:');
        $cabezera = utf8_decode(
            'CONTROL DE TRABAJADORES CON MÁS DE UN CONTRATO Y DE LAS EXCEPCIONES PARA LA CONTRATACIÓN EN LA HABANA'
        );
        //Cabecera
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->SetMargins(50, 10);

        //Primera fila del encabezado
        $pdf->SetX(20);
        $pdf->Cell(470, 30, "$cabezera", 0, 0, 'C');
        $pdf->Ln(40);
        $pdf->SetX(20);
        $pdf->Cell(270, 30, "$titulo", 1, 0, 'C');
        $pdf->Cell(120, 30, "Estudiantes trabajando", 1, 0);
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->Cell(130, 80, "Personas sin residencia permanente", 1, 0, 'C');
        $pdf->Ln(15);
        $pdf->SetX(420);
        $pdf->Cell(130, 80, "autorizadas por los OACE", 0, 0, 'T');
        $pdf->Ln(15);
        //Segunda fila
        $pdf->SetX(20);
        $pdf->Cell(150, 25, "Vinculados de otros centros de trabajo", 1, 0, 'C');
        $pdf->Cell(120, 25, "En la propia entidad", 1, 0, 'C');
        $pdf->Cell(60, 50, "Nivel medio superior", 1, 0, 'C');
        $pdf->Cell(60, 50, "Nivel superior", 1, 0, 'C');
        $pdf->Ln(25);
        $pdf->SetX(20);
        $pdf->Cell(55, 25, "Provincia o Sectores", 1, 0, 'C');
        $pdf->Cell(20, 25, "Total", 1, 0, 'C');
        $pdf->Cell(40, 25, "Indeterminado", 1, 0, 'C');
        $pdf->Cell(35, 25, "Determinado", 1, 0, 'C');

        $pdf->Cell(20, 25, "Total", 1, 0, 'C');
        $pdf->Cell(50, 25, "Indeterminado", 1, 0, 'C');
        $pdf->Cell(50, 25, "Determinado", 1, 0, 'C');
        $pdf->Ln(25);
        $pdf->SetX(20);
        $pdf->Cell(55, 25, "", 1, 0);
        $pdf->Cell(20, 25, "", 1, 0);
        $pdf->Cell(40, 25, "", 1, 0);
        $pdf->Cell(35, 25, "", 1, 0);

        $pdf->Cell(20, 25, "$total", 1, 0, 'C');
        $pdf->Cell(50, 25, "$indt", 1, 0, 'C');
        $pdf->Cell(50, 25, "$det", 1, 0, 'C');
        $pdf->Cell(60, 25, "", 1, 0, 'C');
        $pdf->Cell(60, 25, "", 1, 0, 'C');
        $pdf->Cell(130, 25, "", 1, 0);

        return $pdf;
     }
}