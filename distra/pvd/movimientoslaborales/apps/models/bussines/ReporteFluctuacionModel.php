<?php
$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);
class PDFEstruc extends fpdf
{
}
class ReporteFluctuacionModel extends ZendExt_Model
{
    public function ReporteFluctuacionModel()
    {
        parent::ZendExt_Model();

    }

    public function fluctuacion($estructura, $anno)
    {
        $pdf = new PDFEstruc('L', 'mm', 'a3');
        if ($estructura == null) {
            $pdfNGeneral = $this->crearEncabezado($pdf);
           $pdfNGeneral->Output();
        } else
            $pdfNGeneral = $this->crearCuerpo($pdf, $estructura, $anno);
        $pdfNGeneral->Output();
    }


    private function crearEncabezado($pdf)
    {
        $pdf->SetLeftMargin(10);
        $pdf->AddPage();

        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(545, 11, 'Causas de las Bajas', 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Ln(11);
        $pdf->Cell(105, 11, utf8_decode("Entidad:"), 1, 0, 'C');
        $pdf->Cell(440, 11, "", 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Ln(11);
        $pdf->Cell(50, 22, " ", 1, 0, 'C');
        $pdf->Cell(100, 11, "I TRIM. ", 1, 0, 'C');
        $pdf->Cell(100, 11, "II TRIM. ", 1, 0, 'C');
        $pdf->Cell(100, 11, "III TRIM. ", 1, 0, 'C');
        $pdf->Cell(100, 11, "IV TRIM. ", 1, 0, 'C');
        $pdf->Cell(20, 11, "Acum", 1, 0, 'C');
        $pdf->Cell(20, 22, "%", 1, 0, 'C');
        $pdf->Ln(11);
        $pdf->SetX(115);
        $pdf->Cell(20, 11, "ENE", 1, 0);
        $pdf->Cell(20, 11, "FEB", 1, 0);
        $pdf->Cell(20, 11, "MAR", 1, 0);
        $pdf->Cell(20, 11, "TOTAL", 1, 0);
        $pdf->Cell(20, 11, "%", 1, 0);
        $pdf->Cell(20, 11, "ABR", 1, 0);
        $pdf->Cell(20, 11, "MAY", 1, 0);
        $pdf->Cell(20, 11, "JUN", 1, 0);
        $pdf->Cell(20, 11, "TOTAL", 1, 0);
        $pdf->Cell(20, 11, "%", 1, 0);
        $pdf->Cell(20, 11, "JUL", 1, 0);
        $pdf->Cell(20, 11, "AGO", 1, 0);
        $pdf->Cell(20, 11, "SEP", 1, 0);
        $pdf->Cell(20, 11, "TOTAL", 1, 0);
        $pdf->Cell(20, 11, "%", 1, 0);
        $pdf->Cell(20, 11, "OCT", 1, 0);
        $pdf->Cell(20, 11, "NOV", 1, 0);
        $pdf->Cell(20, 11, "DIC", 1, 0);
        $pdf->Cell(20, 11, "TOTAL", 1, 0);
        $pdf->Cell(20, 11, "%", 1, 0);
        $pdf->Cell(20, 11, "TOTAL", 1, 0);
        return $pdf;
    }

    public function crearCuerpo($pdf, $estructura, $anno)
    {
        $deno = ZendExt_IoC::getInstance()->metadatos->DameEstructura($estructura);

        $pdf->SetLeftMargin(10);
        $pdf->AddPage();
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Cell(545, 11, 'Causas de las Bajas', 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Ln(11);
        $pdf->Cell(105, 11, utf8_decode("Entidad:"), 1, 0, 'C');
        $pdf->Cell(440, 11, utf8_decode($deno[0]->denominacion), 1, 0, 'C');
        $pdf->SetFont('Times', 'B', 10);
        $pdf->Ln(11);
        $pdf->Cell(105, 22, " ", 1, 0, 'C');
        $pdf->Cell(100, 11, "I TRIM. ", 1, 0, 'C');
        $pdf->Cell(100, 11, "II TRIM. ", 1, 0, 'C');
        $pdf->Cell(100, 11, "III TRIM. ", 1, 0, 'C');
        $pdf->Cell(100, 11, "IV TRIM. ", 1, 0, 'C');
        $pdf->Cell(20, 11, "Acum", 1, 0, 'C');
        $pdf->Cell(20, 22, "%", 1, 0, 'C');
        $pdf->Ln(11);
        $pdf->SetX(115);
        $pdf->Cell(20, 11, "ENE", 1, 0);
        $pdf->Cell(20, 11, "FEB", 1, 0);
        $pdf->Cell(20, 11, "MAR", 1, 0);
        $pdf->Cell(20, 11, "TOTAL", 1, 0);
        $pdf->Cell(20, 11, "%", 1, 0);
        $pdf->Cell(20, 11, "ABR", 1, 0);
        $pdf->Cell(20, 11, "MAY", 1, 0);
        $pdf->Cell(20, 11, "JUN", 1, 0);
        $pdf->Cell(20, 11, "TOTAL", 1, 0);
        $pdf->Cell(20, 11, "%", 1, 0);
        $pdf->Cell(20, 11, "JUL", 1, 0);
        $pdf->Cell(20, 11, "AGO", 1, 0);
        $pdf->Cell(20, 11, "SEP", 1, 0);
        $pdf->Cell(20, 11, "TOTAL", 1, 0);
        $pdf->Cell(20, 11, "%", 1, 0);
        $pdf->Cell(20, 11, "OCT", 1, 0);
        $pdf->Cell(20, 11, "NOV", 1, 0);
        $pdf->Cell(20, 11, "DIC", 1, 0);
        $pdf->Cell(20, 11, "TOTAL", 1, 0);
        $pdf->Cell(20, 11, "%", 1, 0);
        $pdf->Cell(20, 11, "TOTAL", 1, 0);
        $pdf->Ln(11);
        
        $datos = $this->getDatos($estructura, $anno);
        foreach ($datos as $value) {
            $denom = $value['denominacion'];
            if (strlen($denom) > 50) {
                $denom = substr($denom, 0, 50);
            }
            $pdf->Cell(105, 11, utf8_decode($denom), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['enero']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['febrero']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['marzo']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['totalprimertrim']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['porcientoprimertrim']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['abril']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['mayo']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['junio']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['totalsegundotrim']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['porcientosegundotrim']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['julio']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['agosto']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['septiembre']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['totaltercertrim']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['porcientotercertrim']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['octubre']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['noviembre']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['diciembre']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['totalcuartotrim']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['porcientocuartotrim']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['totalgeneral']), 1, 0, 'C');
            $pdf->Cell(20, 11, utf8_decode($value['porcientogeneral']), 1, 0, 'C');
            $pdf->Ln(11);
        }
        return $pdf;
    }
    
    public function getDatos($estructura, $anno)
    {
        $cargos = ZendExt_IoC::getInstance()->metadatos->obtenerCargosEstructura($estructura, true);
        if (empty($anno)) {
            $anno = date ("Y");
        }
        if (count($cargos) > 0) {
            foreach ($cargos as $h => $carg) {
                $idcargos[$h] = $carg['idcargo'];
            }
            $stringIdsCargos = $this->arrayToString($idcargos);
            
            $sql = "SELECT nmb.denominacion,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 1
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as enero,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 2
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as febrero,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 3
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as marzo,
                    (SELECT count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad AND sl.fhasta = dpe.fhasta)
                            WHERE sl.idmotivo = nmb.idmotivobaja AND dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno 
                                    AND ((select extract(month from dpe.fhasta)) = 1 OR (select extract(month from dpe.fhasta)) = 2 OR (select extract(month from dpe.fhasta)) = 3)
                                    AND sl.idcargo IN ($stringIdsCargos)
                    ) as totalprimertrim,
                    cast(((SELECT count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad AND sl.fhasta = dpe.fhasta)
                            WHERE sl.idmotivo = nmb.idmotivobaja AND dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno 
                                    AND ((select extract(month from dpe.fhasta)) = 1 OR (select extract(month from dpe.fhasta)) = 2 OR (select extract(month from dpe.fhasta)) = 3)
                                    AND sl.idcargo IN ($stringIdsCargos)) * 100.0 / 
                            (SELECT count(distinct(dpe.idpersonaentidad))
                                    FROM mod_persona.dat_personaentidad AS dpe
                                    INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                    WHERE dpe.fdesde < '$anno-04-01' AND ((dpe.fhasta > '$anno-01-01' OR dpe.fhasta is null) OR sl.estado = 0)
                                            AND sl.idcargo IN ($stringIdsCargos))
                    ) as decimal(9,2)) as porcientoprimertrim,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 4
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as abril,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 5
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as mayo,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 6
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as junio,
                    (SELECT count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad AND sl.fhasta = dpe.fhasta)
                           /* WHERE sl.idmotivo = nmb.idmotivobaja AND dpe.fhasta is not null AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno */
                            WHERE sl.idmotivo = nmb.idmotivobaja AND dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno
                                    AND ((select extract(month from dpe.fhasta)) = 4 OR (select extract(month from dpe.fhasta)) = 5 OR (select extract(month from dpe.fhasta)) = 6)
                                    AND sl.idcargo IN ($stringIdsCargos)
                    ) as totalsegundotrim,
                    cast(((SELECT count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad AND sl.fhasta = dpe.fhasta)
                            WHERE sl.idmotivo = nmb.idmotivobaja AND dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno 
                                    AND ((select extract(month from dpe.fhasta)) = 4 OR (select extract(month from dpe.fhasta)) = 5 OR (select extract(month from dpe.fhasta)) = 6)
                                    AND sl.idcargo IN ($stringIdsCargos)) * 100.0 / 
                            (SELECT count(distinct(dpe.idpersonaentidad))
                                    FROM mod_persona.dat_personaentidad AS dpe
                                    INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                    WHERE dpe.fdesde < '$anno-07-01' AND ((dpe.fhasta > '$anno-04-01' OR dpe.fhasta is null) OR sl.estado = 0)
                                            AND sl.idcargo IN ($stringIdsCargos))
                    ) as decimal(9,2)) as porcientosegundotrim,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 7
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as julio,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 8
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as agosto,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 9
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as septiembre,
                    (SELECT count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad AND sl.fhasta = dpe.fhasta)
                            WHERE sl.idmotivo = nmb.idmotivobaja AND dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno 
                                    AND ((select extract(month from dpe.fhasta)) = 7 OR (select extract(month from dpe.fhasta)) = 8 OR (select extract(month from dpe.fhasta)) = 9)
                                    AND sl.idcargo IN ($stringIdsCargos)
                    ) as totaltercertrim,
                    cast(((SELECT count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad AND sl.fhasta = dpe.fhasta)
                            WHERE sl.idmotivo = nmb.idmotivobaja AND dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno 
                                    AND ((select extract(month from dpe.fhasta)) = 7 OR (select extract(month from dpe.fhasta)) = 8 OR (select extract(month from dpe.fhasta)) = 9)
                                    AND sl.idcargo IN ($stringIdsCargos)) * 100.0 / 
                            (SELECT count(distinct(dpe.idpersonaentidad))
                                    FROM mod_persona.dat_personaentidad AS dpe
                                    INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                    WHERE dpe.fdesde < '$anno-10-01' AND ((dpe.fhasta > '$anno-07-01' OR dpe.fhasta is null) OR sl.estado = 0)
                                            AND sl.idcargo IN ($stringIdsCargos))
                    ) as decimal(9,2)) as porcientotercertrim,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 10
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as octubre,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 11
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as noviembre,
                    (select count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                            WHERE sl.idmotivo = nmb.idmotivobaja  AND sl.estado = 2 AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND 
                            (select extract(year from dpe.fhasta)) = $anno
                             AND  (select extract(month from dpe.fhasta)) = 12
                                    AND sl.idcargo IN ($stringIdsCargos) 
                    ) as diciembre,
                    (SELECT count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad AND sl.fhasta = dpe.fhasta)
                           /* WHERE sl.idmotivo = nmb.idmotivobaja AND dpe.fhasta is not null AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno*/
                            WHERE sl.idmotivo = nmb.idmotivobaja AND dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno
                                    AND ((select extract(month from dpe.fhasta)) = 10 OR (select extract(month from dpe.fhasta)) = 11 OR (select extract(month from dpe.fhasta)) = 12)
                                    AND sl.idcargo IN ($stringIdsCargos)
                    ) as totalcuartotrim,
                    cast(((SELECT count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad AND sl.fhasta = dpe.fhasta)
                            WHERE sl.idmotivo = nmb.idmotivobaja AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno 
                                    AND ((select extract(month from dpe.fhasta)) = 10 OR (select extract(month from dpe.fhasta)) = 11 OR (select extract(month from dpe.fhasta)) = 12)
                                    AND sl.idcargo IN ($stringIdsCargos)) * 100.0 / 
                            (SELECT count(distinct(dpe.idpersonaentidad))
                                    FROM mod_persona.dat_personaentidad AS dpe
                                    INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                    WHERE dpe.fdesde <= '$anno-12-31' AND ((dpe.fhasta > '$anno-10-01' OR dpe.fhasta is null) OR sl.estado = 0)
                                            AND sl.idcargo IN ($stringIdsCargos))
                    ) as decimal(9,2)) as porcientocuartotrim,
                    (SELECT count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad AND sl.fhasta = dpe.fhasta)
                            WHERE sl.idmotivo = nmb.idmotivobaja AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno 
                                    AND sl.idcargo IN ($stringIdsCargos)
                    ) as totalgeneral,
                    cast(((SELECT count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad AND sl.fhasta = dpe.fhasta)
                            WHERE sl.idmotivo = nmb.idmotivobaja AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno 
                                    AND sl.idcargo IN ($stringIdsCargos)) * 100.0 / 
                            (SELECT count(distinct(dpe.idpersonaentidad))
                                    FROM mod_persona.dat_personaentidad AS dpe
                                    INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad)
                                    WHERE dpe.fdesde <= '$anno-12-31' AND ((dpe.fhasta > '$anno-01-01' OR dpe.fhasta is null) OR sl.estado = 0)
                                            AND sl.idcargo IN ($stringIdsCargos))
                    ) as decimal(9,2)) as porcientogeneral

            FROM mod_fuerzatrabajo.nom_motivobaja AS nmb

            WHERE nmb.fdesde <= now() AND (nmb.fhasta > now() OR nmb.fhasta IS NULL)
                    AND (SELECT count(distinct(dpe.idpersonaentidad))
                            FROM mod_persona.dat_personaentidad AS dpe
                            INNER JOIN mod_persona.dat_situacionlaboral AS sl ON (sl.idpersonaentidad = dpe.idpersonaentidad AND sl.fhasta = dpe.fhasta)
                            WHERE sl.idmotivo = nmb.idmotivobaja AND  dpe.fdesde>= '01/01/$anno' AND dpe.fhasta<= '31/12/$anno' AND sl.estado = 2 AND (select extract(year from dpe.fhasta)) = $anno
                                    AND sl.idcargo IN ($stringIdsCargos)) > 0

            ORDER BY nmb.idmotivobaja;";
            
            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();

            $datos = $conn->fetchAll($sql);
            
            $posfinal = count($datos);
            $datos[$posfinal]['denominacion'] = 'Total de bajas';
            
            foreach ($datos as $key => $value) {
                $datos[$posfinal]['enero'] += $value['enero'];
                $datos[$posfinal]['febrero'] += $value['febrero'];
                $datos[$posfinal]['marzo'] += $value['marzo'];
                $datos[$posfinal]['totalprimertrim'] += $value['totalprimertrim'];
                $datos[$posfinal]['porcientoprimertrim'] += $value['porcientoprimertrim'];
                $datos[$posfinal]['abril'] += $value['abril'];
                $datos[$posfinal]['mayo'] += $value['mayo'];
                $datos[$posfinal]['junio'] += $value['junio'];
                $datos[$posfinal]['totalsegundotrim'] += $value['totalsegundotrim'];
                $datos[$posfinal]['porcientosegundotrim'] += $value['porcientosegundotrim'];
                $datos[$posfinal]['julio'] += $value['julio'];
                $datos[$posfinal]['agosto'] += $value['agosto'];
                $datos[$posfinal]['septiembre'] += $value['septiembre'];
                $datos[$posfinal]['totaltercertrim'] += $value['totaltercertrim'];
                $datos[$posfinal]['porcientotercertrim'] += $value['porcientotercertrim'];
                $datos[$posfinal]['octubre'] += $value['octubre'];
                $datos[$posfinal]['noviembre'] += $value['noviembre'];
                $datos[$posfinal]['diciembre'] += $value['diciembre'];
                $datos[$posfinal]['totalcuartotrim'] += $value['totalcuartotrim'];
                $datos[$posfinal]['porcientocuartotrim'] += $value['porcientocuartotrim'];
                $datos[$posfinal]['totalgeneral'] += $value['totalgeneral'];
                $datos[$posfinal]['porcientogeneral'] += $value['porcientogeneral'];
            }
            return $datos;
        } else {
            return array();
        }
    }
    
    private function arrayToString($array)
    {
        $string = '';
        foreach ($array as $key => $value) {
            if ($key == 0) {
                $string .= $value;
            } else {
                $string .= ',' . $value;
            }
        }
        return $string;
    }
    
}