<?php
$direccionComun = Zend_Registry::getInstance()->config->dir_aplication .
    "pvd/comun/recursos/fpdf/fpdf.php";
include($direccionComun);
class PDFAnexo2 extends fpdf
{
    function Footer()
    {

    }
}
class FluctuacionModel extends ZendExt_Model
{
    /**
     * @method FluctuacionModel - Constructor de la clase.
     * @author Osiel Fundora Ramírez.

   **/
//Consultas

    public function indisciplina($estructura, $mes)
    {

        $sql = "select count (p.idpersona) as dirm
        from mod_persona.dat_persona as p
        INNER JOIN mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
        INNER JOIN mod_persona.dat_situacionlaboral as sit on (sit.idpersonaentidad = pe.idpersonaentidad)
        INNER JOIN mod_fuerzatrabajo.nom_motivobaja as nmbaja on (sit.idmotivo = nmbaja.idmotivobaja)
        where sit.estado = 2 and nmbaja.idmotivobaja = 7 and (select extract(month from sit.fhasta)) = '$mes' 
        and sit.ueb = $estructura
        and ((select extract(year from sit.fhasta))  = (select extract(year from now()::date)) )";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function solicitud($estructura, $mes)
    {

        $sql = "select count (p.idpersona) as p
        from mod_persona.dat_persona as p
        INNER JOIN mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
        INNER JOIN mod_persona.dat_situacionlaboral as sit on (sit.idpersonaentidad = pe.idpersonaentidad)
        INNER JOIN mod_fuerzatrabajo.nom_motivobaja as nmbaja on (sit.idmotivo = nmbaja.idmotivobaja)
        where sit.estado = 2 nmbaja.idmotivobaja = 1 and (select extract(month from sit.fhasta)) = '$mes'
        and sit.ueb = $estructura";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function pocosalario($estructura, $mes)
    {
        $sql = "select count (p.idpersona) as p
        from mod_persona.dat_persona as p
        INNER JOIN mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona)
        INNER JOIN mod_persona.dat_situacionlaboral as sit on (sit.idpersonaentidad = pe.idpersonaentidad)
        INNER JOIN mod_fuerzatrabajo.nom_motivobaja as nmbaja on (sit.idmotivo = nmbaja.idmotivobaja)
        where sit.estado = 2 and (select extract(month from sit.fhasta)) = '$mes'  
        and nmbaja.idmotivobaja = 8 and sit.ueb = $estructura 
        and ((select extract(year from sit.fhasta))  = (select extract(year from now()::date)) )";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function liberacion($estructura, $mes)
    {
        $sql = "select count (p.idpersona) as p
        from mod_persona.dat_persona as p
        INNER JOIN mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona )
        INNER JOIN mod_persona.dat_situacionlaboral as sit on (sit.idpersonaentidad = pe.idpersonaentidad )
        INNER JOIN mod_fuerzatrabajo.nom_motivobaja as nmbaja on (sit.idmotivo = nmbaja.idmotivobaja)
        where sit.estado = 2  and (select extract(month from sit.fhasta)) = '$mes'  and nmbaja.idmotivobaja = 12 
            and sit.ueb = $estructura
            and ((select extract(year from sit.fhasta))  = (select extract(year from now()::date)) )";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function enfermedad($estructura, $mes)
    {
        $sql = "select count (p.idpersona) as p
        from mod_persona.dat_persona as p
        INNER JOIN mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona )
        INNER JOIN mod_persona.dat_situacionlaboral as sit on (sit.idpersonaentidad = pe.idpersonaentidad )
        INNER JOIN mod_fuerzatrabajo.nom_motivobaja as nmbaja on (sit.idmotivo = nmbaja.idmotivobaja)
        where sit.estado = 2  and (select extract(month from sit.fhasta)) = '$mes'  and nmbaja.idmotivobaja = 10 
            and sit.ueb = $estructura
            and ((select extract(year from sit.fhasta))  = (select extract(year from now()::date)) )";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function salidadelpais($estructura, $mes)
    {
        $sql = "select count (p.idpersona) as p
        from mod_persona.dat_persona as p
        INNER JOIN mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona )
        INNER JOIN mod_persona.dat_situacionlaboral as sit on (sit.idpersonaentidad = pe.idpersonaentidad )
        INNER JOIN mod_fuerzatrabajo.nom_motivobaja as nmbaja on (sit.idmotivo = nmbaja.idmotivobaja)
        where sit.estado = 2  and (select extract(month from sit.fhasta)) = '$mes'  and nmbaja.idmotivobaja = 11 
            and sit.ueb = $estructura
            and ((select extract(year from sit.fhasta))  = (select extract(year from now()::date)) )";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function jubilaciones($estructura, $mes)
    {
        $sql = "select count (p.idpersona) as p
        from mod_persona.dat_persona as p
        INNER JOIN mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona )
        INNER JOIN mod_persona.dat_situacionlaboral as sit on (sit.idpersonaentidad = pe.idpersonaentidad )
        INNER JOIN mod_fuerzatrabajo.nom_motivobaja as nmbaja on (sit.idmotivo = nmbaja.idmotivobaja)
        where sit.estado = 2  and (select extract(month from sit.fhasta)) = '$mes'  and nmbaja.idmotivobaja = 2 
            and sit.ueb = $estructura
            and ((select extract(year from sit.fhasta))  = (select extract(year from now()::date)) )";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function fallecimiento($estructura, $mes)
    {
        $sql = "select count (p.idpersona) as p
        from mod_persona.dat_persona as p
        INNER JOIN mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona )
        INNER JOIN mod_persona.dat_situacionlaboral as sit on (sit.idpersonaentidad = pe.idpersonaentidad )
        INNER JOIN mod_fuerzatrabajo.nom_motivobaja as nmbaja on (sit.idmotivo = nmbaja.idmotivobaja)
        where sit.estado = 2  and (select extract(month from sit.fhasta)) = '$mes'  and nmbaja.idmotivobaja = 3 
            and sit.ueb = $estructura
            and ((select extract(year from sit.fhasta))  = (select extract(year from now()::date)) )";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function traslado($estructura, $mes)
    {
        $sql = "select count (p.idpersona) as p
        from mod_persona.dat_persona as p
        INNER JOIN mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona )
        INNER JOIN mod_persona.dat_situacionlaboral as sit on (sit.idpersonaentidad = pe.idpersonaentidad )
        INNER JOIN mod_fuerzatrabajo.nom_motivobaja as nmbaja on (sit.idmotivo = nmbaja.idmotivobaja)
        where sit.estado = 2  and (select extract(month from sit.fhasta)) = '$mes'  and nmbaja.idmotivobaja = 5 
            and sit.ueb = $estructura
            and ((select extract(year from sit.fhasta))  = (select extract(year from now()::date)) )";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function reduccionplantilla($estructura, $mes)
    {
        $sql = "select count (p.idpersona) as p
        from mod_persona.dat_persona as p
        INNER JOIN mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona )
        INNER JOIN mod_persona.dat_situacionlaboral as sit on (sit.idpersonaentidad = pe.idpersonaentidad )
        INNER JOIN mod_fuerzatrabajo.nom_motivobaja as nmbaja on (sit.idmotivo = nmbaja.idmotivobaja)
        where sit.estado = 2  and (select extract(month from sit.fhasta)) = '$mes'  and nmbaja.idmotivobaja = 15 
            and sit.ueb = $estructura
        and ((select extract(year from sit.fhasta))  = (select extract(year from now()::date)) )";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function noidoneo($estructura, $mes)
    {

        $sql = "select count (p.idpersona) as p
        from mod_persona.dat_persona as p
        INNER JOIN mod_persona.dat_personaentidad as pe on (pe.idpersona = p.idpersona )
        INNER JOIN mod_persona.dat_situacionlaboral as sit on (sit.idpersonaentidad = pe.idpersonaentidad )
        INNER JOIN mod_fuerzatrabajo.nom_motivobaja as nmbaja on (sit.idmotivo = nmbaja.idmotivobaja)
        where sit.estado = 2  and (select extract(month from sit.fhasta)) = '$mes'  and nmbaja.idmotivobaja = 13 
            and sit.ueb = $estructura
            and ((select extract(year from sit.fhasta))  = (select extract(year from now()::date)) )";
        $dm = Doctrine_Manager::getInstance();
        $conn = $dm->getCurrentConnection();
        return $conn->fetchAll($sql);
    }
    public function fecha()
    {
        $f = date('d/m/Y');
        $r = explode('/', $f);
        return $r;
    }

    //Reporte
    public function exportarFluctuacion($estructura)
    {
        $pdf = new fpdf('L', 'mm', array(440,560));
        $pdf->SetTitle("Fluctuación");
        $pdf->SetAuthor("Ing. Osiel Fundora Ramírez");
        $pdf->SetLeftMargin(2);
        $pdf->AddPage();
        $pdf->SetFont('Arial', 'B', 20);
        if ($estructura == null) {
           $pdffinal = $this->cabeceraReportenulo($pdf);
           $pdffinal->Output();
        } else {
           $pdffinal = $this->cabeceraReporte($pdf, $estructura);
           $pdffinal->Output();
        }
    }
     
    public function cabeceraReporte($pdf, $estructura)
    {
        $pais = utf8_decode('país');
        $liberacion = utf8_decode('Liberación');
        $res = utf8_decode('Rescisión');
        $idoneo = utf8_decode('idóneo');
        $red = utf8_decode('Reducción');
        $fecha = $this->fecha();
        $fechas = $fecha[2];
        $indisciplinaenero = $this->indisciplina($estructura, 1);
        $indiscenero = $indisciplinaenero[0]['dirm'];
        $indisciplinafebrero = $this->indisciplina($estructura, 2);
        $indiscfebrero = $indisciplinafebrero[0]['dirm'];
        $indisciplinamarzo = $this->indisciplina($estructura, 3);
        $imarzo = $indisciplinamarzo [0]['dirm'];
        $indisciplinaAbril = $this->indisciplina($estructura, 4);
        $iabril = $indisciplinaAbril[0]['dirm'];
        $indisciplinaMayo = $this->indisciplina($estructura, 5);
        $imayo = $indisciplinaMayo[0]['dirm'];
        $indisciplinaJunio = $this->indisciplina($estructura, 6);
        $ijunio = $indisciplinaJunio[0]['dirm'];
        $indisciplinaJulio = $this->indisciplina($estructura, 7);
        $ijulio = $indisciplinaJulio[0]['dirm'];
        $indisciplinaAgosto = $this->indisciplina($estructura, 8);
        $iagosto = $indisciplinaAgosto[0]['dirm'];
        $indisciplinaSeptiembre = $this->indisciplina($estructura, 9);
        $iseptiembre = $indisciplinaSeptiembre[0]['dirm'];
        $indisciplinaOctubre = $this->indisciplina($estructura, 10);
        $ioctubre = $indisciplinaOctubre[0]['dirm'];
        $indisciplinaNoviembre = $this->indisciplina($estructura, 11);
        $inoviembre = $indisciplinaNoviembre [0]['dirm'];
        $indisciplinaDiciembre = $this->indisciplina($estructura, 12);
        $idiciembre = $indisciplinaDiciembre[0]['dirm'];
        $totalprimertrimestreI = $indiscenero+$indiscfebrero+$imarzo;
        $totalsegundotrimestreI = $iabril+$imayo+$ijunio;
        $totaltercertrimestreI = $ijulio+$iagosto+$iseptiembre;
        $totalcuartotrimestreI = $ioctubre+$inoviembre+$idiciembre;
        $totalI = $totalprimertrimestreI+$totalsegundotrimestreI+$totaltercertrimestreI+$totalcuartotrimestreI;

        //solicitudpropia
        $solicitudpropiaenero = $this->solicitud($estructura, 1);
        $spenero = $solicitudpropiaenero[0]['p'];
        $solicitudpropiaFebrero = $this->solicitud($estructura, 2);
        $spfebrero = $solicitudpropiaFebrero[0]['p'];
        $solicitudpropiaMarzo = $this->solicitud($estructura, 3);
        $spmarzo = $solicitudpropiaMarzo[0]['p'];
        $solicitudpropiaAbril = $this->solicitud($estructura, 4);
        $spabril = $solicitudpropiaAbril[0]['p'];
        $solicitudpropiaMayo = $this->solicitud($estructura, 5);
        $spmayo = $solicitudpropiaMayo [0]['p'];
        $solicitudpropiaJunio = $this->solicitud($estructura, 6);
        $spjunio = $solicitudpropiaJunio[0]['p'];
        $solicitudpropiaJulio = $this->solicitud($estructura, 7);
        $spjulio = $solicitudpropiaJulio[0]['p'];
        $solicitudpropiaAgosto = $this->solicitud($estructura, 8);
        $spagosto = $solicitudpropiaAgosto[0]['p'];
        $solicitudpropiaSeptiembre = $this->solicitud($estructura, 9);
        $spseptiembre = $solicitudpropiaSeptiembre[0]['p'];
        $solicitudpropiaOctubre = $this->solicitud($estructura, 10);
        $spoctubre =$solicitudpropiaOctubre[0]['p'];
        $solicitudpropiaNoviembre = $this->solicitud($estructura, 11);
        $spnoviembre= $solicitudpropiaNoviembre[0]['p'];
        $solicitudpropiaDiciembre = $this->solicitud($estructura, 12);
        $spdiciembre = $solicitudpropiaDiciembre[0]['p'];
        $totalSPprimertrimestre = $spenero+$spfebrero+$spmarzo;
        $totalSPsegundotrimestre = $spmayo+$spabril+$spjunio;
        $totalSPtercertrimestre = $spjulio+$spagosto+$spseptiembre;
        $totalSPcuartotrimestre = $spoctubre+$spnoviembre+$spdiciembre;
        $totalsolicitudpropia = $totalSPprimertrimestre+$totalSPsegundotrimestre+
        $totalSPtercertrimestre+$totalSPcuartotrimestre;

        //poco salario
        $mejorasalarioenero = $this->pocosalario($estructura, 1);
        $msalarioenero = $mejorasalarioenero[0]['p'];
        $mejorasalariofebrero = $this->pocosalario($estructura, 2);
        $msalariofebrero = $mejorasalariofebrero[0]['p'];
        $mejorassalariomaarzo = $this->pocosalario($estructura, 3);
        $msalariomarzo = $mejorassalariomaarzo[0]['p'];
        $mejorasalarioabril = $this->pocosalario($estructura, 4);
        $msalarioabril = $mejorasalarioabril[0]['p'];
        $mejorasalariomayo = $this->pocosalario($estructura, 5);
        $msalariomayo = $mejorasalariomayo[0]['p'];
        $mejorasalariojunio  = $this->pocosalario($estructura, 6);
        $msalariojunio = $mejorasalariojunio[0]['p'];
        $mejorasalariojulio = $this->pocosalario($estructura, 7);
        $msalariojulio = $mejorasalariojulio[0]['p'];
        $mejorasalarioagosto = $this->pocosalario($estructura, 8);
        $msalarioagosto = $mejorasalarioagosto[0]['p'];
        $mejorasalarioseptiembre = $this->pocosalario($estructura, 9);
        $msalarioseptiembre = $mejorasalarioseptiembre[0]['p'];
        $mejorasalariooctubre = $this->pocosalario($estructura, 10);
        $msalariooctubre = $mejorasalariooctubre[0]['p'];
        $mejorasalarionoviembre = $this->pocosalario($estructura, 11);
        $msalarionoviembre = $mejorasalarionoviembre[0]['p'];
        $mejorasalariodiciembre = $this->pocosalario($estructura, 12);
        $msalariodiciembre = $mejorasalariodiciembre[0]['p'];
        $totalmejorassalarialesprimertrimestre = $msalarioenero+$msalariofebrero+$msalariomarzo;
        $totalmejorassalarialessegundosemestre = $msalarioabril+$msalariomayo+$msalariojunio;
        $totalmejorassalarialestercertrimestre = $msalariojulio+$msalarioagosto+$msalarioseptiembre;
        $totalmejorassalarialescuartotrimestre = $msalariooctubre+$msalarionoviembre+$msalariodiciembre;
        $totalmejorassalariales = $totalmejorassalarialesprimertrimestre+
        $totalmejorassalarialessegundosemestre+$totalmejorassalarialestercertrimestre+
        $totalmejorassalarialescuartotrimestre;

        //rescision
        $rescisionenero = $this->rescision($estructura, 1);
        $renero = $rescisionenero[0]['p'];
        $rescisionfebrero = $this->rescision($estructura, 2);
        $rfebrero = $rescisionfebrero[0]['p'];
        $rescisionmarzo = $this->rescision($estructura, 3);
        $rmarzo = $rescisionmarzo[0]['p'];
        $rescisionabril = $this->rescision($estructura, 4);
        $rabril = $rescisionabril[0]['p'];
        $rescisionmayo = $this->rescision($estructura, 5);
        $rmayo = $rescisionmayo[0]['p'];
        $rescisionjunio = $this->rescision($estructura, 6);
        $rjunio = $rescisionjunio[0]['p'];
        $rescisionjulio = $this->rescision($estructura, 7);
        $rjulio = $rescisionjulio[0]['p'];
        $rescisionagosto = $this->rescision($estructura, 8);
        $ragosto = $rescisionagosto[0]['p'];
        $rescisionseptiembre = $this->rescision($estructura, 9);
        $rseptiembre = $rescisionseptiembre[0]['p'];
        $rescisionoctubre = $this->rescision($estructura, 10);
        $roctubre =$rescisionoctubre[0]['p'];
        $rescisionnoviembre = $this->rescision($estructura, 11);
        $rnoviembre = $rescisionnoviembre[0]['p'];
        $rescisionesdiciembre = $this->rescisionDiciembre($estructura);
        $rdiciembre = $rescisionesdiciembre[0]['p'];
        $totalRescisionprimertrimestre = $renero+$rfebrero+$rmarzo;
        $totalRescisionessegundotrimestre = $rabril+$rmayo+$rjunio;
        $totalRescisionestercertrimestre = $rjulio+$ragosto+$rseptiembre;
        $totalRescisionescuartotrimestre = $roctubre+$rnoviembre+$rdiciembre;
        $totalRescisiones = $totalRescisionprimertrimestre+$totalRescisionessegundotrimestre+
        $totalRescisionestercertrimestre+$totalRescisionescuartotrimestre;

        //Liberacion del cargo
        $liberacionCenero = $this->liberacion($estructura, 1);
        $libenero = $liberacionCenero [0]['p'];
        $liberacionCfebrero = $this->liberacion($estructura, 2);
        $libfebrero = $liberacionCfebrero[0]['p'];
        $liberacionCmarzo = $this->liberacion($estructura, 3);
        $libmarzo = $liberacionCmarzo[0]['p'];
        $liberacionCabril = $this->liberacion($estructura, 4);
        $libagril = $liberacionCabril[0]['p'];
        $liberacionCmayo = $this->liberacion($estructura, 5);
        $libmayo = $liberacionCmayo[0]['p'];
        $liberacionCjunio = $this->liberacion($estructura, 6);
        $libJunio = $liberacionCjunio [0]['p'];
        $liberacionCjulio = $this->liberacion($estructura, 7);
        $libJulio = $liberacionCjulio[0]['p'];
        $liberacionCagosto = $this->liberacion($estructura, 8);
        $libagosto = $liberacionCagosto[0]['p'];
        $liberacionCseptiembre = $this->liberacion($estructura, 9);
        $libseptiembre=$liberacionCseptiembre[0]['p'];
        $liberacionCoctubre = $this->liberacion($estructura, 10);
        $liboctubre = $liberacionCoctubre[0]['p'];
        $liberacionCnoviembre = $this->liberacion($estructura, 11);
        $libnoviembre = $liberacionCnoviembre[0]['p'];
        $liberacionCdiciembre = $this->liberacion($estructura, 12);
        $libdiciembre = $liberacionCdiciembre[0]['p'];
        //totales liberacion del cargo
        $totalliberacionprimertrimestre = $libenero+$libfebrero+$libmarzo;
        $totalliberacionsegundotrimestre = $libagril+$libmayo+$libJunio;
        $totalliberaciontercertrimestre = $libJulio+$libagosto+$libseptiembre;
        $totalliberacioncuartotrimestre = $liboctubre+$libnoviembre+$libdiciembre;
        $totalliberacion = $totalliberacionprimertrimestre+$totalliberacionsegundotrimestre+
        $totalliberaciontercertrimestre+$totalliberacioncuartotrimestre;

        //Enfermedad
        $enferenero = $this->enfermedad($estructura, 1);
        $eenero = $enferenero[0]['p'];
        $enferfebrero = $this->enfermedad($estructura, 2);
        $efebrero = $enferfebrero [0]['p'];
        $enferMarzo = $this->enfermedad($estructura, 3);
        $emarzo = $enferMarzo[0]['p'];
        $enfeAbril = $this->enfermedad($estructura, 4);
        $eabril = $enfeAbril[0]['p'];
        $enfeMayo = $this->enfermedad($estructura, 5);
        $emayo = $enfeMayo[0]['p'];
        $enfeJunio = $this->enfermedad($estructura, 6);
        $ejunio = $enfeJunio[0]['p'];
        $enfeJulio = $this->enfermedad($estructura, 7);
        $ejulio = $enfeJulio[0]['p'];
        $enfeAgosto = $this->enfermedad($estructura, 8);
        $eagosto = $enfeAgosto[0]['p'];
        $enfeSeptiembre = $this->enfermedad($estructura, 9);
        $eseptiembre = $enfeSeptiembre[0]['p'];
        $enfeOctubre = $this->enfermedad($estructura, 10);
        $eoctubre = $enfeOctubre[0]['p'];
        $enfeNoviembre = $this->enfermedad($estructura, 11);
        $enoviembre = $enfeNoviembre[0]['p'];
        $enfeDiciembre = $this->enfermedad($estructura, 12);
        $ediciembre = $enfeDiciembre[0]['p'];
        //totales enfermedad
        $totalenfermedadprimertrimestre = $eenero+$efebrero+$emarzo;
        $totalenfermedadsegundotrimestre = $eabril+$emayo+$ejunio;
        $totalenfermedadtercertrimestre = $ejulio+$eagosto+$eseptiembre;
        $totalenfermedadcuartotrimestre = $eoctubre+$enoviembre+$ediciembre;
        $totalenfermedad = $totalenfermedadprimertrimestre+$totalenfermedadsegundotrimestre+
        $totalenfermedadtercertrimestre+$totalenfermedadcuartotrimestre;

        //salida del pais
        $salidaEnero = $this->salidadelpais($estructura, 1);
        $senero = $salidaEnero[0]['p'];
        $salidaFebrero = $this->salidadelpais($estructura, 2);
        $sfebrero = $salidaFebrero[0]['p'];
        $salidaMarzo = $this->salidadelpais($estructura, 3);
        $smarzo = $salidaMarzo[0]['p'];
        $salidaAbril = $this->salidadelpais($estructura, 4);
        $sabril = $salidaAbril[0]['p'];
        $salidaMayo = $this->salidadelpais($estructura, 5);
        $smayo = $salidaMayo[0]['p'];
        $salidaJunio = $this->salidadelpais($estructura, 6);
        $sjunio = $salidaJunio[0]['p'];
        $salidaJulio = $this->salidadelpais($estructura, 7);
        $sjulio = $salidaJulio[0]['p'];
        $salidaAgosto = $this->salidadelpais($estructura, 8);
        $sagosto = $salidaAgosto[0]['p'];
        $salidaSeptiembre = $this->salidadelpais($estructura, 9);
        $sseptiembre = $salidaSeptiembre[0]['p'];
        $salidaOctubre = $this->salidadelpais($estructura, 10);
        $soctubre = $salidaOctubre[0]['p'];
        $salidaDiciembre = $this->salidadelpais($estructura, 12);
        $sdiciembre = $salidaDiciembre[0]['p'];
        $salidaNoviembre = $this->salidadelpais($estructura, 11);
        $snoviembre = $salidaNoviembre[0]['p'];
        //totales de salida del pais
        $totalsalidaprimertrimestre = $senero+$sfebrero+$smarzo;
        $totalsalidasegundotrimestre = $sabril+$smayo+$sjunio;
        $totalsalidastercertrimestre = $sjulio+$sagosto+$sseptiembre;
        $totalsalidascuartotrimestre = $soctubre+$snoviembre+$sdiciembre;
        $totalsalidasdelpais = $totalsalidaprimertrimestre+$totalsalidasegundotrimestre+
        $totalsalidastercertrimestre+$totalsalidascuartotrimestre;

        //Jubilaciones
        $jubilacionEnero = $this->jubilaciones($estructura, 1);
        $jenero = $jubilacionEnero [0]['p'];
        $jubilacionFebrero = $this->jubilaciones($estructura, 2);
        $jfebrero = $jubilacionFebrero[0]['p'];
        $jubilacionesMarzo = $this->jubilaciones($estructura, 3);
        $jmarzo = $jubilacionesMarzo[0]['p'];
        $jubilacionAbril = $this->jubilaciones($estructura, 4);
        $jabril = $jubilacionAbril[0]['p'];
        $jubilacionMayo = $this->jubilaciones($estructura, 5);
        $jmayo = $jubilacionMayo[0]['p'];
        $jubilacionJunio = $this->jubilaciones($estructura, 6);
        $jjunio = $jubilacionJunio[0]['p'];
        $jubilacionJulio = $this->jubilaciones($estructura, 7);
        $jjulio = $jubilacionJulio[0]['p'];
        $jubilacionAgosto = $this->jubilaciones($estructura, 8);
        $jagosto = $jubilacionAgosto[0]['p'];
        $jubilacionSeptiembre = $this->jubilaciones($estructura, 9);
        $jseptiembre = $jubilacionSeptiembre[0]['p'];
        $jubilacionOctubre = $this->jubilaciones($estructura, 10);
        $joctubre = $jubilacionOctubre[0]['p'];
        $jubilacionDiciembre = $this->jubilaciones($estructura, 12);
        $jdiciembre = $jubilacionDiciembre[0]['p'];
        $jubilacionNoviembre = $this->jubilaciones($estructura, 11);
        $jnoviembre = $jubilacionNoviembre[0]['p'];
        //totales jubilaciones
        $totaljubilacionprimertrimestre = $jenero+$jfebrero+$jmarzo;
        $totaljubilacionessegundotrimestre = $jabril+$jmayo+$jjunio;
        $totaljubilacionestercertrimestre = $jjulio+$jagosto+$jseptiembre;
        $totaljubilacionescuartotrimestre = $joctubre+$jnoviembre+$jdiciembre;
        $totaljubilaciones = $totaljubilacionprimertrimestre+$totaljubilacionessegundotrimestre+
        $totaljubilacionestercertrimestre+$totaljubilacionescuartotrimestre;

        //Fallecimiento
        $falleEnero = $this->fallecimiento($estructura, 1);
        $fenero = $falleEnero[0]['p'];
        $falleFebrero = $this->fallecimiento($estructura, 2);
        $ffebrero = $falleFebrero[0]['p'];
        $falleMarzo = $this->fallecimiento($estructura, 3);
        $fmarzo = $falleMarzo[0]['p'];
        $fallleAbril = $this->fallecimiento($estructura, 4);
        $fabril = $fallleAbril[0]['p'];
        $falleMayo = $this->fallecimiento($estructura, 5);
        $fmayo = $falleMayo[0]['p'];
        $falleJunio = $this->fallecimiento($estructura, 6);
        $fjunio = $falleJunio[0]['p'];
        $falleJulio = $this->fallecimiento($estructura, 7);
        $fjulio = $falleJulio[0]['p'];
        $falleAgosto = $this->fallecimiento($estructura, 8);
        $fagosto = $falleAgosto[0]['p'];
        $falleSeptiembre = $this->fallecimiento($estructura, 9);
        $fseptiembre = $falleSeptiembre[0]['p'];
        $falleOctubre = $this->fallecimiento($estructura, 10);
        $foctubre = $falleOctubre[0]['p'];
        $falleNoviembre = $this->fallecimiento($estructura, 11);
        $fnoviembre = $falleNoviembre[0]['p'];
        $falleDiciembre = $this->fallecimiento($estructura, 12);
        $fdiciembre = $falleDiciembre[0]['p'];
        //Totales fallecimiento
        $totalfallecimientoprimertrimestre = $fenero+$ffebrero+$fmarzo;
        $totalfallecimientosegundotrimestre = $fabril+$fmayo+$fjunio;
        $totalfallecimientotercertrimestre = $fjulio+$fagosto+$fseptiembre;
        $totalfallecimientocuartotrimestre = $foctubre+$fnoviembre+$fdiciembre;
        $totalfallecimiento = $totalfallecimientoprimertrimestre+$totalfallecimientosegundotrimestre+
        $totalfallecimientotercertrimestre+$totalfallecimientocuartotrimestre;

        //Traslado
        $traslEnero = $this->traslado($estructura, 1);
        $tenero = $traslEnero[0]['p'];
        $traslFebrero = $this->traslado($estructura, 2);
        $tfebrero = $traslFebrero[0]['p'];
        $tralsMarzo = $this->traslado($estructura, 3);
        $tmarzo = $tralsMarzo[0]['p'];
        $traslAbril = $this->traslado($estructura, 4);
        $tabril = $traslAbril[0]['p'];
        $traslMayo = $this->traslado($estructura, 5);
        $tmayo = $traslMayo[0]['p'];
        $traslJunio = $this->traslado($estructura, 6);
        $tjunio = $traslJunio[0]['p'];
        $traslJulio = $this->traslado($estructura, 7);
        $tjulio = $traslJulio[0]['p'];
        $traslAgosto = $this->traslado($estructura, 8);
        $tagosto = $traslAgosto[0]['p'];
        $traslSeptiembre = $this->traslado($estructura, 9);
        $tseptiembre = $traslSeptiembre[0]['p'];
        $traslOctubre = $this->traslado($estructura, 10);
        $toctubre = $traslOctubre[0]['p'];
        $traslNoviembre = $this->traslado($estructura, 11);
        $tnoviembre = $traslNoviembre[0]['p'];
        $traslDiciembre = $this->traslado($estructura, 12);
        $tdiciembre = $traslDiciembre [0]['p'];
        //Totales traslado
        $totaltrasladoprimertrimestre = $tenero+$tfebrero+$tmarzo;
        $totaltrasladosegundotrimestre = $tabril+$tmayo+$tjunio;
        $totaltrasladotercertrimestre = $tjulio+$tagosto+$tseptiembre;
        $totaltrasladocuartotrimestre = $toctubre+$tnoviembre+$tdiciembre;
        $totaltraslado = $totaltrasladoprimertrimestre+$totaltrasladosegundotrimestre+
        $totaltrasladotercertrimestre+$totaltrasladocuartotrimestre;

        //Reduccion de plantilla
        $reduccionEnero = $this->reduccionplantilla($estructura, 1);
        $rpenero = $reduccionEnero[0]['p'];
        $reduccionFebrero = $this->reduccionplantilla($estructura, 2);
        $rpfebrero = $reduccionFebrero[0]['p'];
        $reduccionMarzo = $this->reduccionplantilla($estructura, 3);
        $rpmarzo = $reduccionMarzo[0]['p'];
        $reduccionAbril = $this->reduccionplantilla($estructura, 4);
        $rpabril = $reduccionAbril[0]['p'];
        $reduccionMayo = $this->reduccionplantilla($estructura, 5);
        $rpmayo = $reduccionMayo[0]['p'];
        $reduccionJunio = $this->reduccionplantilla($estructura, 6);
        $rpjunio = $reduccionJunio[0]['p'];
        $reduccionJulio = $this->reduccionplantilla($estructura, 7);
        $rpjulio = $reduccionJulio[0]['p'];
        $reduccionAgosto = $this->reduccionplantilla($estructura, 8);
        $rpagosto = $reduccionAgosto [0]['p'];
        $reduccionSeptiembre = $this->reduccionplantilla($estructura, 9);
        $rpseptiembre = $reduccionSeptiembre[0]['p'];
        $reduccionOctubre = $this->reduccionplantilla($estructura, 10);
        $rpoctubre = $reduccionOctubre[0]['p'];
        $reduccionNoviembre = $this->reduccionplantilla($estructura, 11);
        $rpnoviembre = $reduccionNoviembre[0]['p'];
        $reduccionDiciembre = $this->reduccionplantilla($estructura, 12);
        $rpdiciembre = $reduccionDiciembre[0]['p'];
        //totales reduccion plantilla
        $totalreduccionplantillaprimertrimestre = $rpenero+$rpfebrero+$rpmarzo;
        $totalreduccionplantillasegundotrimestre = $rpabril+$rpmayo+$rpjunio;
        $totalreduccionplantillatercertrimestre = $rpjulio+$rpagosto+$rpseptiembre;
        $totalreduccionplantillacuartotrimestre = $rpoctubre+$rpnoviembre+$rpdiciembre;
        $totalreduccionplantilla = $totalreduccionplantillaprimertrimestre+$totalreduccionplantillasegundotrimestre+
        $totalreduccionplantillatercertrimestre+$totalreduccionplantillacuartotrimestre;

        //No idoneo
        $nidoneoEnero = $this->noidoneo($estructura, 1);
        $nienero = $nidoneoEnero[0]['p'];
        $nidoneoFebrero = $this->noidoneo($estructura, 2);
        $nifebrero = $nidoneoFebrero[0]['p'];
        $nidoneoMarzo = $this->noidoneo($estructura, 3);
        $nimarzo = $nidoneoMarzo[0]['p'];
        $nidoneoAbril = $this->noidoneo($estructura, 4);
        $niabril = $nidoneoAbril[0]['p'];
        $nidoneoMayo = $this->noidoneo($estructura, 5);
        $nimayo = $nidoneoMayo[0]['p'];
        $nidoneoJunio = $this->noidoneo($estructura, 6);
        $nijunio = $nidoneoJunio[0]['p'];
        $nidoneoJulio = $this->noidoneo($estructura, 7);
        $nijulio = $nidoneoJulio[0]['p'];
        $nidoneoAgosto = $this->noidoneo($estructura, 8);
        $niagosto = $nidoneoAgosto[0]['p'];
        $nidoneoSeptiembre = $this->noidoneo($estructura, 9);
        $niseptiembre = $nidoneoSeptiembre[0]['p'];
        $nidoneoOctubre= $this->noidoneo($estructura, 10);
        $nioctubre = $nidoneoOctubre[0]['p'];
        $nidoneoNoviembre = $this->noidoneo($estructura, 11);
        $ninoviembre = $nidoneoNoviembre[0]['p'];
        $nidoneoDiciembre = $this->noidoneo($estructura, 12);
        $nidiciembre = $nidoneoDiciembre[0]['p'];
        //totales no idoneo
        $totalnoidoneosprimertrimestre = $nienero+$nifebrero+$nimarzo;
        $totalnoidoneosegundotrimestre = $niabril+$nimayo+$nijunio;
        $totalnoidoneotercertrimestre = $nijulio+$niagosto+$niseptiembre;
        $totalnoidoneocuartotrimestre = $nioctubre+$ninoviembre+$nidiciembre;
        $totalnoidoneo = $totalnoidoneosprimertrimestre+$totalnoidoneosegundotrimestre+
        $totalnoidoneotercertrimestre+$totalnoidoneocuartotrimestre;

        //Totales
        $totalenero = $nienero+$indiscenero+$spenero+$msalarioenero+$senero+$eenero+
            $libenero+$renero+$rpenero+$jenero+$fenero;
        $totalfebrero = $nifebrero+$indiscfebrero+$spfebrero+$msalariofebrero+$sfebrero+
            $efebrero+$libfebrero+$rfebrero+$rpfebrero+$jfebrero+$ffebrero;
        $totalmarzo = $nimarzo+$imarzo+$spmarzo+$msalariomarzo+$smarzo+$emarzo+$libmarzo+
            $rmarzo+$rpmarzo+$jmarzo+$fmarzo;
        $totalprimertrimestre = $totalenero + $totalfebrero +$totalmarzo;
        $totalabril = $niabril+$iabril+$spabril+$msalarioabril+$sabril+$eabril+$libagril+
            $rabril+$rpabril+$jabril+$fabril;
        $totalmayo = $nimayo+$imayo+$spmayo+$msalariomayo+$smayo+$emayo+$libmayo+$rmayo+$rpmayo+$jmayo+$fmayo;
        $totaljunio = $nijunio+$ijunio+$spjunio+$msalariojunio+$sjunio+$ejunio+$libJunio+
            $rjunio+$rpjunio+$jjunio+$fjunio;
        $totalsegundotrimestre = $totalabril+$totalmayo+$totaljunio;
        $totaljulio = $nijulio+$ijulio+$spjulio+$msalariojulio+$sjulio+$ejulio+$libJulio+$rjulio+
            $rpjulio+$jjulio+$fjulio;
        $totalagosto = $niagosto+$iagosto+$spagosto+$msalarioagosto+$sagosto+$eagosto+$libagosto+
            $ragosto+$rpagosto+$jagosto+$fagosto;
        $totalseptiembre = $niseptiembre+$iseptiembre+$spseptiembre+$msalarioseptiembre+$sseptiembre+
            $eseptiembre+$libseptiembre+$rseptiembre+$rpseptiembre+$jseptiembre+$fseptiembre;
        $totaltercertrimestre = $totaljulio+$totalagosto+$totalseptiembre;
        $totaloctubre = $nioctubre+$ioctubre+$spoctubre+$msalariooctubre+$soctubre+$eoctubre+$liboctubre+
            $roctubre+$rpoctubre+$joctubre+$foctubre;
        $totalnoviembre = $ninoviembre+$inoviembre+$spnoviembre+$msalarionoviembre+$snoviembre+$enoviembre+
            $libnoviembre+$rnoviembre+$rpnoviembre+$jnoviembre+$fjunio;
        $totaldiciembre = $nidiciembre+$idiciembre+$spdiciembre+$msalariodiciembre+$sdiciembre+$ediciembre+
            $libdiciembre+$rdiciembre+$rpdiciembre+$jdiciembre+$fdiciembre;
        $totalcuartotrimestre = $totaloctubre+$totalnoviembre+$totaldiciembre;
        $total = $totalprimertrimestre+$totalsegundotrimestre+$totaltercertrimestre+$totalcuartotrimestre;



        // var_dump($datos);die;

        //Cabecera
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->SetMargins(50, 10);

        //Primera fila del encabezado
        $pdf->SetX(20);
        $pdf->Ln(40);
        $pdf->Cell(500, 40, "Causas de  las bajas", 1, 0);
        $pdf->Ln(15);
        $pdf->SetX(110);
        $pdf->Cell(100, 25, "I TRIM. $fechas", 1, 0, 'C');
        $pdf->SetX(210);
        $pdf->Cell(100, 25, "II TRIM. $fechas", 1, 0, 'C');
        $pdf->SetX(310);
        $pdf->Cell(100, 25, "III TRIM. $fechas", 1, 0, 'C');
        $pdf->SetX(410);
        $pdf->Cell(100, 25, "IV TRIM. $fechas", 1, 0, 'C');
        $pdf->SetX(510);
        $pdf->Cell(20, 25, "Acum", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 25, "%", 1, 0, 'C');
        $pdf->Ln(15);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "ENE", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "FEB", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "MAR", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "TOTAL", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "%", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "ABR", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "MAY", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "JUN", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "TOTAL", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "%", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "JUL", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "AGO", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "SEP", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "TOTAL", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "%", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "OCT", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "NOV", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "DIC", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "TOTAL", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "%", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "TOTAL", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Indisciplina", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$indiscenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$indiscfebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$imarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, $indiscenero + $indiscfebrero + $imarzo, 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalprimertrimestreI / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$iabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$imayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$ijunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalsegundotrimestreI", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totalsegundotrimestreI / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$ijulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$iagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$iseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totaltercertrimestreI", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totaltercertrimestreI / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$ioctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$inoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$idiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalcuartotrimestreI", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalcuartotrimestreI / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalI", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalI / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Solicitud Propia", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$spenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$spfebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$spmarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalSPprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalSPprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$spabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$spmayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$spjunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalSPsegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totalSPsegundotrimestre / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$spjulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$spagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$spseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totalSPtercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totalSPtercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$spoctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$spnoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$spdiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalSPcuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalSPcuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalsolicitudpropia", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalsolicitudpropia / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);

        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Ctos para mejoras sal", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$msalarioenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$msalariofebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$msalariomarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalmejorassalarialesprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalmejorassalarialesprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$msalarioabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$msalariomayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$msalariojunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalmejorassalarialessegundosemestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totalmejorassalarialessegundosemestre / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$msalariojulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$msalarioagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$msalarioseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totalmejorassalarialestercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totalmejorassalarialestercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$msalariooctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$msalarionoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$msalariodiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalmejorassalarialescuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalmejorassalarialescuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalmejorassalariales", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalmejorassalariales / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);

        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Salida del $pais", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$senero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$sfebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$smarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalsalidaprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalsalidaprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$sabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$smayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$sjunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalsalidasegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totalsalidasegundotrimestre / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$sjulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$sagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$sseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totalsalidastercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totalsalidastercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$soctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$snoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$sdiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalsalidascuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalsalidascuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalsalidasdelpais", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalsalidasdelpais / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Enfermedad", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$eenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$efebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$emarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalenfermedadprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalenfermedadprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$eabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$emayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$ejunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalenfermedadsegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totalenfermedadsegundotrimestre / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$ejulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$eagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$eseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totalenfermedadtercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totalenfermedadtercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$eoctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$enoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$ediciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalenfermedadcuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalenfermedadcuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalenfermedad", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalenfermedad / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$liberacion del cargo", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$libenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$libfebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$libmarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalliberacionprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalliberacionprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$libagril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$libmayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$libJunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalliberacionsegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totalliberacionsegundotrimestre / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$libJulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$libagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$libseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totalliberaciontercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totalliberaciontercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$liboctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$libnoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$libdiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalliberacioncuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalliberacioncuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalliberacion", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalliberacion / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$spenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$spfebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$spmarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalSPprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalSPprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$spmayo", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$spabril", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$spjunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalSPsegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totalSPsegundotrimestre * 100 / $totalsegundotrimestre, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$spjulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$spagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$spseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totalSPtercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totalSPtercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$spoctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$spnoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$spdiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalSPcuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalSPcuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalsolicitudpropia", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalsolicitudpropia / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "DE ELLOS:", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(440, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Afect. salarialmente", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Medidas disc. aplicadas", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Resp. Material aplic.", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$res del Contrato", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$renero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$rfebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$rmarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalRescisionprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalRescisionprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$rabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$rmayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$rjunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalRescisionessegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totalRescisionessegundotrimestre / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$rjulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$ragosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$rseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totalRescisionestercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totalRescisionestercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$roctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$rnoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$rdiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalRescisionescuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalRescisionescuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalRescisiones", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalRescisiones / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');

        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "No $idoneo", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$nienero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$nifebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$nimarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalnoidoneosprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalnoidoneosprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$niabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$nimayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$nijunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalnoidoneosegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totalnoidoneosegundotrimestre / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$nijulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$niagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$niseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totalnoidoneotercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totalnoidoneotercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$nioctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$ninoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$nidiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalnoidoneocuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalnoidoneocuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalnoidoneo", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalnoidoneo / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$red de plantilla", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$rpenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$rpfebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$rpmarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalreduccionplantillaprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalreduccionplantillaprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$rpabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$rpmayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$rpjunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalreduccionplantillasegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, 
            round($totalreduccionplantillasegundotrimestre / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$rpjulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$rpagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$rpseptiembre", 1, 0, 'C');
        $pdf->Cell(20, 10, "$totalreduccionplantillatercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totalreduccionplantillatercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$rpoctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$rpnoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$rpdiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalreduccionplantillacuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalreduccionplantillacuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalreduccionplantilla", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalreduccionplantilla / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);

        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$red de plantilla", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$rpenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$rpfebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$rpmarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalreduccionplantillaprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalreduccionplantillaprimertrimestre * 100 / $totalprimertrimestre, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$rpabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$rpmayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$rpjunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalreduccionplantillasegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, 
            round($totalreduccionplantillasegundotrimestre * 100 / $totalsegundotrimestre, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$rpjulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$rpagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$rpseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totalreduccionplantillatercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totalreduccionplantillatercertrimestre * 100 / $totaltercertrimestre, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$rpoctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$rpnoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$rpdiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalreduccionplantillacuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalreduccionplantillacuartotrimestre * 100 / $totalcuartotrimestre, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalreduccionplantilla", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalreduccionplantilla * 100 / $total, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Jubilaciones", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$jenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$jfebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$jmarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totaljubilacionprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totaljubilacionprimertrimestre * 100 / $totalprimertrimestre, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$jabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$jmayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$jjunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totaljubilacionessegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totaljubilacionessegundotrimestre * 100 / $totalsegundotrimestre, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$jjulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$jagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$jseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totaljubilacionestercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totaljubilacionestercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$joctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$jnoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$jdiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totaljubilacionescuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totaljubilacionestercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totaljubilaciones", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totaljubilaciones / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Fallecimiento", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$fenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$ffebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$fmarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalfallecimientoprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totalfallecimientoprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$fabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$fmayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$fjunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalfallecimientosegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totalfallecimientosegundotrimestre / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$fjulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$fagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$fseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totalfallecimientotercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totalfallecimientotercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$foctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$fnoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$fdiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalfallecimientocuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totalfallecimientocuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totalfallecimiento", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totalfallecimiento / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->Ln(10);

        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Traslado a otra U/C", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$tenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$tfebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$tmarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totaltrasladoprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(
            20, 10, round($totaltrasladoprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$tabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$tmayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$tjunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totaltrasladosegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totaltrasladosegundotrimestre / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 
            1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$tjulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$tagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$tseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totaltrasladotercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(
            20, 10, round($totaltrasladotercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$toctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$tnoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$tdiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totaltrasladocuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(
            20, 10, round($totaltrasladocuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$totaltraslado", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($totaltraslado / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C', 'C');
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Total Bajas", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "$totalenero", 1, 0, 'C');
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "$totalfebrero", 1, 0, 'C');
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "$totalmarzo", 1, 0, 'C');
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "$totalprimertrimestre", 1, 0, 'C');
        $pdf->SetX(190);
        $pdf->Cell(20, 10, round($totalprimertrimestre / $totalprimertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "$totalabril", 1, 0, 'C');
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "$totalmayo", 1, 0, 'C');
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "$totaljunio", 1, 0, 'C');
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "$totalsegundotrimestre", 1, 0, 'C');
        $pdf->SetX(290);
        $pdf->Cell(
            20, 10, round($totalsegundotrimestre / $totalsegundotrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C'
        );
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "$totaljulio", 1, 0, 'C');
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "$totalagosto", 1, 0, 'C');
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "$totalseptiembre", 1, 0, 'C');
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "$totaltercertrimestre", 1, 0, 'C');
        $pdf->SetX(390);
        $pdf->Cell(20, 10, round($totaltercertrimestre / $totaltercertrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "$totaloctubre", 1, 0, 'C');
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "$totalnoviembre", 1, 0, 'C');
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "$totaldiciembre", 1, 0, 'C');
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "$totalcuartotrimestre", 1, 0, 'C');
        $pdf->SetX(490);
        $pdf->Cell(20, 10, round($totalcuartotrimestre / $totalcuartotrimestre * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "$total", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 10, round($total / $total * 100, 1, PHP_ROUND_HALF_UP), 1, 0, 'C');
        $pdf->SetX(10);
        return $pdf;
    }
    
    public function cabeceraReportenulo($pdf)
    {
        $ext = utf8_decode('Extensión');
        $pais = utf8_decode('país');
        $liberacion = utf8_decode('Liberación');
        $res = utf8_decode('Rescisión');
        $ter = utf8_decode('término');
        $idoneo = utf8_decode('idóneo');
        $red = utf8_decode('Reducción');
        $periodo = utf8_decode('Período');
        $promo = utf8_decode('Promoción');
        $desc  = utf8_decode('Decisión');
        $fecha = $this->fecha();
        $fechas = $fecha[2];
        //Cabecera
        $pdf->SetFont('Arial', 'B', 15);
        $pdf->SetMargins(50, 10);
        //Primera fila del encabezado
        $pdf->SetX(20);
        $pdf->Ln(40);
        $pdf->Cell(500, 40, "Causas de  las bajas", 1, 0);
        $pdf->Ln(15);
        $pdf->SetX(110);
        $pdf->Cell(100, 25, "I TRIM. $fechas", 1, 0, 'C');
        $pdf->SetX(210);
        $pdf->Cell(100, 25, "II TRIM. $fechas", 1, 0, 'C');
        $pdf->SetX(310);
        $pdf->Cell(100, 25, "III TRIM. $fechas", 1, 0, 'C');
        $pdf->SetX(410);
        $pdf->Cell(100, 25, "IV TRIM. $fechas", 1, 0, 'C');
        $pdf->SetX(510);
        $pdf->Cell(20, 25, "Acum", 1, 0, 'C');
        $pdf->SetX(530);
        $pdf->Cell(20, 25, "%", 1, 0, 'C');
        $pdf->Ln(15);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "ENE", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "FEB", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "MAR", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "TOTAL", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "%", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "ABR", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "MAY", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "JUN", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "TOTAL", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "%", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "JUL", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "AGO", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "SEP", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "TOTAL", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "%", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "OCT", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "NOV", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "DIC", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "TOTAL", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "%", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "TOTAL", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Indisciplina", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Solicitud Propia", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Evitando medidas Disc", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Ctos para mejoras sal", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$ext horario ", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Mejora condiciones trab", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Por problemas pers.", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Mudarse de prov", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Salida del $pais", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Enfermedad", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$liberacion del cargo", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "DE ELLOS:", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(440, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Afect. salarialmente", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Medidas disc. aplicadas", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Resp. Material aplic.", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$res del Contrato", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Vencimiento del $ter", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "No $idoneo", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$red de plantilla", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$periodo a prueba", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$red de plantilla", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Jubilaciones", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Fallecimiento", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Otras causas", 1, 0);
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Traslado a otra U/C", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$promo", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "$desc del gerente", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Incumplimiento de la 15", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Renuncia", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->Ln(10);
        $pdf->SetX(50);
        $pdf->Cell(60, 10, "Total Bajas", 1, 0, 'C');
        $pdf->SetX(110);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(130);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(150);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(170);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(190);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(210);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(230);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(250);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(270);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(290);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(310);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(330);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(350);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(370);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(390);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(410);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(430);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(450);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(470);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(490);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(510);
        $pdf->Cell(20, 10, "", 1, 0);
        $pdf->SetX(530);
        $pdf->Cell(20, 10, "", 1, 0);
        return $pdf;
    }
}