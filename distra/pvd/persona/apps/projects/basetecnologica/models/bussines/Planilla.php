<?php

class Planilla
{

    var $pdf;
    var $idpersona;
    var $persona;
    var $posY;
    var $obService;

    public function Planilla($idp)
    {
        $this->obService = new ConfiguracionGeneralService();
        $dir = $_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps . 'apps/pvd/comun/recursos/tcpdf/config/lang/eng.php');
        require_once($apps . 'apps/pvd/comun/recursos/tcpdf/TCPDF.php');
        $idpersona = $idp;
    }

    public function CrearPlanilla()
    {
        $this->pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, A4, true, 'UTF-8', false);
        // set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('RRHH-SIAC');
        $this->pdf->SetTitle('Datos del Cuadro');
        $this->pdf->SetSubject('Datos del Cuadro');
        $this->pdf->SetKeywords('Cuadro, Persona, siac, datos del cuadro');
        // remove default header/footer
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);
        // set default monospaced font
        // $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        //set margins
        // $this->pdf->SetMargins(10, 5, 5, 10);
        //set auto page breaks
        $this->pdf->SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
        //set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
        //set some language-dependent strings
        $this->pdf->setLanguageArray($l);
        //set margins
        //set margins
        $this->pdf->SetMargins(10, PDF_MARGIN_TOP, 8);
        $this->pdf->SetHeaderMargin(PDF_MARGIN_HEADER);
        $this->pdf->SetFooterMargin(PDF_MARGIN_FOOTER);
        // ---------------------------------------------------------
        // set font
        $this->pdf->SetFont('Times', 'B', 40);
    }

    public function CrearPagina1()
    {
        $this->pdf->AddPage();
        //set margins
        // $this->pdf->SetMargins(10, 20, 10, false);
        //set auto page breaks
        $this->pdf->SetAutoPageBreak(true, 15);
        $borde = array('width' => 1, 'cap' => 'round', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0));
        $folio = 'FOLIO ';
        //////inside////////
        $this->pdf->Line(10, 20, 200, 20, $borde);
        $this->pdf->Line(10, 20, 10, 278, $borde);
        $this->pdf->Line(10, 278, 200, 278, $borde);
        $this->pdf->Line(200, 20, 200, 278, $borde);
        $borde = array('width' => 0, 'cap' => 'round', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0));
        /////outside//////////////
        $this->pdf->Line(8, 18, 202, 18, $borde);
        $this->pdf->Line(8, 18, 8, 280, $borde);
        $this->pdf->Line(8, 280, 202, 280, $borde);
        $this->pdf->Line(202, 18, 202, 280, $borde);
        ////context////////////////////
        $this->pdf->SetFont('times', '', 14);
        // $this->pdf->Write(24, $folio, $link='', $fill=0, $align='R', $ln=1, $stretch=1, $firstline=false, $firstblock=false, $maxh=0);
        $this->pdf->SetXY(160, 24);
        $this->pdf->Cell(40, 0, $folio, 0, 1, 'C', 0, '', 0);
        $this->pdf->SetFont('times', 'BU', 50);
        $this->pdf->SetXY(10, 100);
        $this->pdf->Write(
            0, 'DATOS', $link = '', $fill = 0, $align = 'C', $ln = 1, $stretch = 1, $firstline = false, $firstblock = false,
            $maxh = 0
        );
        $this->pdf->Write(
            0, 'DEL', $link = '', $fill = 0, $align = 'C', $ln = 1, $stretch = 1, $firstline = false, $firstblock = false,
            $maxh = 0
        );
        $this->pdf->Write(
            0, 'CUADRO', $link = '', $fill = 0, $align = 'C', $ln = 1, $stretch = 1, $firstline = false,
            $firstblock = false, $maxh = 0
        );
    }

    public function CrearPagina2()
    {
        //page 2///
        // $this->pdf->SetMargins(10, 5, 5,10);
        $this->pdf->SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
        $this->pdf->AddPage();
        $this->pdf->SetFont('Times', 'B', 20);
        $this->pdf->SetXY(10, 10);
        $this->pdf->Cell(190, 0, 'INSTRUCCIONES', 0, 1, 'C', 0, '', 0);
        $this->pdf->SetFont('times', '', 15);
        $this->pdf->Write(0, $txt, '', 0, 'L', true, 0, false, false, 0);
        //$this->pdf->SetFillColor(0, 180, 180);
        $this->pdf->SetFillColor(220, 220, 220);
        $txt3
            = '1. En el acápite 1.18 nivel de escolaridad, debe expresar el último nivel de enseñanza
		vencido.';
        $txt4
            = '2. En el acápite 1.22 idiomas que domina, debe reflejar los idiomas que lee, habla y escribe
		coherentemente.';
        $txt5 = '3. En el acápite 1.24 militancia política, debe manifestar si tiene doble militancia.';
        $txt6 = '4. En el acápite 2.6 cargo, debe poner el cargo que ocupa actualmente.';
        $txt7
            = '5. En el acápite 18 otras personas que convivan en su casa, si alguno de los familiares
		referidos en el acápite 17 convive en su vivienda, solo exprese el parentesco, nombre y
		apellidos.';
        $this->pdf->SetY(35);
        // $this->pdf->SetX(5);
        $this->pdf->MultiCell(250, 5, $txt1, 0, 'L', 0, 0, '', '', true);
        $this->pdf->SetY(60);
        // $this->pdf->SetX(5);
        $this->pdf->MultiCell(250, 5, $txt2, 0, 'L', 0, 0, '', '', true);
        $this->pdf->SetY(85);
        // $this->pdf->SetX(5);
        $this->pdf->MultiCell(250, 5, $txt3, 0, 'L', 0, 0, '', '', true);
        $this->pdf->SetY(110);
        $this->pdf->MultiCell(250, 5, $txt4, 0, 'L', 0, 0, '', '', true);
        $this->pdf->SetY(135);
        $this->pdf->MultiCell(250, 5, $txt5, 0, 'L', 0, 0, '', '', true);
        $this->pdf->SetY(160);
        $this->pdf->MultiCell(250, 5, $txt6, 0, 'L', 0, 0, '', '', true);
        $this->pdf->SetY(185);
        $this->pdf->MultiCell(250, 5, $txt7, 0, 'L', 0, 0, '', '', true);
    }

    public function CrearPagina3(
        $Persona, $foto, $datnacimiento, $ciudadania, $fenotipo, $residencia, $contacto, $especialidad, $escolaridad,
        $categoriasgral, $idioma /*, $datsociales*/, $afiliaciones, $trayectoria, $trabajo, $cargo
    )

    {

        $this->pdf->AddPage();
        $bordetabla = array(
            'LTRB' => array(
                'width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0)));
        $this->pdf->SetFont('times', 'B', 20);
        $this->pdf->SetXY(10, 10);
        $this->pdf->Cell(190, 0, 'DATOS DEL CUADRO', 0, 1, 'C', 0, '', 0);
        $this->pdf->Write(0, $txt, '', 0, 'L', true, 0, false, false, 0);
        $this->pdf->SetFont('times', '', 11);
        $this->pdf->setJPEGQuality(75);
        /* if ($foto[0]['extension']) {
             $extension = explode('.', $foto[0]['extension']);
             $extension = $extension[1];
             $this->pdf->Image('personaimgs/' . $Persona['idpersona'] . $foto[0]['extension'], 170, 7, 30, 30, $extension, '', '', true, 150, '', false, false, 1, false, false, false);
  
         } else
             $this->pdf->Image('../../views/images/persona/no-photo-male.png', 170, 7, 30, 30, 'png', '', '', true, 150, '', false, false, 1, false, false, false);*/
        /////////FOTO//////
        $dirfoto = $_SERVER ['DOCUMENT_ROOT'] . '/pvd/persona/views/images/persona/no-photo-male.png';
        //print_r($this->datos['foto']);die;
        if ($foto) {
            //$this->table->addImageToCell(1, 1, $dirfoto, new ParFormat('left'),2.92, 2.77);
            $this->pdf->Image($foto, 170, 7, 30, 30, '', '', '', true, 150, '', false, false, 1, false, false, false);

        } else {
            //$this->table->addImageToCell(1, 1, $_SERVER ['DOCUMENT_ROOT'].$this->datos['foto'], new ParFormat('left'),2.92, 2.77);
            $this->pdf->Image(
                $dirfoto, 170, 7, 30, 30, 'png', '', '', true, 150, '', false, false, 1, false, false, false
            );

        }
        ////Celdas del nombre///
        $this->pdf->SetXY(10, 40);
        $this->pdf->Cell(60, 0, '1.1 PRIMER APELLIDO', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(70, 40);
        $this->pdf->Cell(60, 0, '1.2 SEGUNDO APELLIDO', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(130, 40);
        $this->pdf->Cell(70, 0, '1.3 NOMBRES', 1, 1, 'C', 1, '', 0);
        $nombre;
        $Apellido1;
        $Apellido2;
        //$nombre = $Persona->nombre;
        $nombre = $Persona['nombre'];
        $snombre = $Persona['snombre'];
        $flag = true;
        for ($i = 0; $i < strlen($snombre); $i++) {
            if ($flag) {
                $flag = false;
                $nombre[strlen($nombre)] = ' ';
                $nombre[strlen($nombre)] = $snombre[$i];
            } else {
                $nombre[strlen($nombre)] = $snombre[$i];
            }
        }
        $papel = $Persona['papel'];
        $papel = trim($papel);
        $sapel = $Persona['sapel'];
        $sapel = trim($sapel);
        $Apellido1 = $papel;
        $Apellido2 = $sapel;
        $this->pdf->SetXY(10, 45);
        $this->pdf->Cell(60, 0, $Apellido1, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(70, 45);
        $this->pdf->Cell(60, 0, $Apellido2, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(130, 45);
        $this->pdf->Cell(70, 0, $nombre, 1, 1, 'C', 0, '', 0);
        ///sexo///
        $this->pdf->SetXY(10, 55);
        $this->pdf->Cell(15, 0, '1.4', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(25, 55);
        $this->pdf->Cell(15, 0, 'M', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(40, 55);
        $this->pdf->Cell(15, 0, 'F', 1, 1, 'C', 1, '', 0);
        $sexo = $Persona['sexo'];
        $nid = $Persona['numid'];

        $masc='';
        $fem='';

        if ($sexo == 0) {
            $fem = 'X';
        } else {
            $masc = 'X';
        }
        $this->pdf->SetXY(10, 60);
        $this->pdf->Cell(15, 0, 'Sexo', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(25, 60);
        $this->pdf->Cell(15, 0, $masc, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(40, 60);
        $this->pdf->Cell(15, 0, $fem, 1, 1, 'C', 0, '', 0);
        ////No identidad/////
        $this->pdf->SetXY(80, 55);
        $this->pdf->Cell(120, 0, '1.5 No. de Identidad permanente', 1, 1, 'C', 1, '', 0);
        $id = $nid;
        $this->pdf->SetXY(80, 60);
        $this->pdf->Cell(120, 0, $id, 1, 1, 'C', 0, '', 0);
        ///////lugar de nacimiento y provincia////////
        $this->pdf->SetXY(10, 70);
        $this->pdf->Cell(120, 0, '1.6 Lugar de Nacimiento', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(130, 70);
        $this->pdf->Cell(70, 0, '1.7 Provincia', 1, 1, 'C', 1, '', 0);
       // $obj = new ZendExt_Nomencladores_ADT ();
        $nacimiento;
        $provincia;
        $nacimiento;


        if (!empty($datnacimiento)) {

            //pais
            if ($datnacimiento['idpais']) {
                $arreglo = $this->obService->findContryById($datnacimiento['idpais']);
                $arr['pais'] = $arreglo['nombrepais'];
            } else {
                $arr['pais'] = '';
            }
            //municipio
            if ($datnacimiento['idmunicipio']) {
                $arreglo1 = $this->obService->getDptDadoArrayIds($datnacimiento['idmunicipio']);
                $arr['municipio'] = $arreglo1[0]['denominacion'];
                $arr['idpadre'] = $arreglo1[0]['idpadre'];
            } else {
                $arr['municipio'] = '';
                $arr['idpadre'] = '';
            }
            //provincia
            if ($arr['idpadre']) {
                $arreglo1 = $this->obService->getDptDadoArrayIds($arr['idpadre']);
            }

            if ($arr['idpadre']) {
                $arreglo2 = $this->obService->getDptDadoArrayIds($arr['idpadre']);
                $arr['provincia'] = $arreglo2[0] ['denominacion'];
                $nacimiento = $arr['pais'];
                $provincia = $arr['provincia'];
                $nacimiento = $nacimiento . ',' . $provincia . ',' . $arr['municipio'];
            } else {
                $nacimiento = '';
                $provincia = '';
                $nacimiento = '';
            }


        }
        $this->pdf->SetXY(10, 75);
        $this->pdf->Cell(120, 0, $nacimiento, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(130, 75);
        $this->pdf->Cell(70, 0, $provincia, 1, 1, 'C', 0, '', 0);
        /////////ciudadania//////
        $OCD;
        $flag = false;
        $ciuda = ' ';
        $flag1 = true;
        for ($i = 0; $i < count($ciudadania); $i++) {
            // $temp = $ciudadania[$i]['ciudadania'];
            $temp = $ciudadania[$i]['denomciudadania'];

            if ($temp != 'Cubano') {
                $flag = true;
                $ciuda .= $temp . ' ';
            }
        }
        if ($flag) {
            $OCD = SI;
        } else {
            $OCD = NO;
        }

        $this->pdf->SetXY(10, 85);
        $this->pdf->Cell(60, 0, '1.8 Ha tenido otra ciudadanía', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(70, 85);
        $this->pdf->Cell(15, 0, $OCD, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(85, 85);
        $this->pdf->Cell(115, 0, '1.9 Cuál?' . $ciuda, 1, 1, 'l', 0, '', 0);
        //////color//////////
        $this->pdf->SetXY(10, 95);
        $this->pdf->Cell(25, 0, '1.10', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(35, 95);
        $this->pdf->Cell(25, 0, '1.10.1 Piel', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(60, 95);
        $this->pdf->Cell(25, 0, '1.10.2 Ojos', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(85, 95);
        $this->pdf->Cell(25, 0, '1.10.2 Pelo', 1, 1, 'C', 1, '', 0);
        // print_r($fenotipo);
        $piel = $fenotipo[0]['piel'];
        $ojos = $fenotipo[0]['ojos'];
        $pelo = $fenotipo[0]['pelo'];
        $this->pdf->SetXY(10, 100);
        $this->pdf->Cell(25, 0, 'Color', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(35, 100);
        $this->pdf->Cell(25, 0, $piel, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(60, 100);
        $this->pdf->Cell(25, 0, $ojos, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(85, 100);
        $this->pdf->Cell(25, 0, $pelo, 1, 1, 'C', 0, '', 0);
        ////estatura y peso/////
        $this->pdf->SetXY(120, 95);
        $this->pdf->Cell(40, 0, '1.11 Estatura(cm)', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(160, 95);
        $this->pdf->Cell(40, 0, '1.12 Peso(Kgs)', 1, 1, 'C', 1, '', 0);
        $estatura = $fenotipo[0]['estatura'];
        $peso = $fenotipo[0]['pesocorporal'];
        $this->pdf->SetXY(120, 100);
        $this->pdf->Cell(40, 0, $estatura, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(160, 100);
        $this->pdf->Cell(40, 0, $peso, 1, 1, 'C', 0, '', 0);

        ////direccion particular//////
        $DIR;
        $municip;
        $Provinc;
        if (!empty($residencia)) {
            //pais
            /*  $getpais = $obj->get("nom_pais", 0, 0, 'nom_pais.idpais=' . $residencia[0]['idpais']?$residencia[0]['idpais'], "mod_nomencladores");
              $pais[0]['pais'] = $getpais[0]['nombrepais'];*/
            //municipio
            // $obj->get("nom_dpt", 0, 0, 'nom_dpt.iddpt=' . $datnacimiento['iddpt'], 0);
            // $get = $obj->get("nom_dpt", 0, 0, 'nom_dpt.iddpt='  . $residencia[0]['idmunicipio'], "mod_nomencladores");
            if ($residencia[0]['idmunicipio']) {
                $get = $this->obService->getDptDadoArrayIds($residencia[0]['idmunicipio']);
                $array[0]['municipio'] = $get[0]['denominacion'];
                $array[0]['idpadre'] = $get[0]['idpadre'];
            } else {
                $array[0]['municipio'] = '';
                $array[0]['idpadre'] = '';
            }

            if ($arr['idpadre']) {
                //provincia
                //$get1 = $obj->get("nom_dpt", 0, 0, 'nom_dpt.iddpt=' . $array['idpadre'], "mod_nomencladores");
                $get1 = $this->obService->getDptDadoArrayIds($arr['idpadre']);
                $array[0]['provincia'] = $get1[0]['denominacion'];
                $municip = $array[0]['municipio'];
                $Provinc = $array[0]['provincia'];
                // $DIR = $residencia[0]['direccion'] . ',' . $pais[0]['pais'] . ',' . $array[0]['provincia'] . ',' . $array[0]['municipio'];
                $DIR = $residencia[0]['direccion'] . ',' . $array[0]['provincia'] . ',' . $array[0]['municipio'];
            } else {
                $municip = '';
                $Provinc = '';
                // $DIR = $residencia[0]['direccion'] . ',' . $pais[0]['pais'] . ',' . $array[0]['provincia'] . ',' . $array[0]['municipio'];
                $DIR = '';
            }


        }
        $this->pdf->SetXY(10, 110);
        $this->pdf->Cell(190, 0, '1.13 Dirección particular(donde reside físicamente)', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(10, 115);
        $this->pdf->Cell(190, 0, $DIR, 1, 1, 'C', 0, '', 0);
        //print_r($contacto);die;
        $this->pdf->SetXY(10, 120);
        $this->pdf->Cell(47, 0, '1.14 Teléfono', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(57, 120);
        $this->pdf->Cell(48, 0, '1.15 Correo Electrónico', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(105, 120);
        $this->pdf->Cell(48, 0, '1.16 Municipio', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(153, 120);
        $this->pdf->Cell(47, 0, '1.17 Provincia', 1, 1, 'C', 1, '', 0);
        $telef = 'No Conocido';
        $correo = 'No Conocido';

        if (count($contacto)) {
            for ($i = 0; $i < count($contacto); $i++) {
                if ((($contacto[$i]['idtipomediocontacto'] == 4)||($contacto[$i]['idtipomediocontacto'] == 3)) &&
                    ($contacto[$i]['idtipocontacto'] == 1)
                ) {
                    $telef = $contacto[$i]['contacto'];
                }
                if (($contacto[$i]['idtipomediocontacto'] == 1) &&
                    ($contacto[$i]['idtipocontacto'] == 1)
                ) {
                    $correo = $contacto[$i]['contacto'];
                }
            }
        }


        $this->pdf->SetXY(10, 125);
        $this->pdf->Cell(47, 0, $telef, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(57, 125);
        $this->pdf->Cell(48, 0, $correo, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(105, 125);
        $this->pdf->Cell(48, 0, $municip, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(153, 125);
        $this->pdf->Cell(47, 0, $Provinc, 1, 1, 'C', 0, '', 0);

        ////nivel escolaridad////
        $this->pdf->SetXY(10, 130);
        $this->pdf->Cell(90, 0, '1.18 Nivel de Escolaridad', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(100, 130);
        $this->pdf->Cell(100, 0, '1.19 Especialidad', 1, 1, 'C', 1, '', 0);
        $Nescolar = 'No Conocido';
        $Especialidad = 'No Conocido';


        if (!empty($especialidad)) {

            $Especialidad=$especialidad;
        }

        if (!empty($escolaridad)) {
            $Nescolar = '';
            $Nescolar = $escolaridad;
        }
        $this->pdf->SetXY(10, 135);
        $this->pdf->Cell(90, 0, $Nescolar, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(100, 135);
        $this->pdf->Cell(100, 0, $Especialidad, 1, 1, 'C', 0, '', 0);

        ////grado cientifico , categoria docente
        $this->pdf->Ln(2);
        $this->pdf->Cell(90, 0, '1.20 Grado Científico', 1, 0, 'C', 1);
        $this->pdf->Cell(10, 0, '', 0, 0, 'C', 0);
        $this->pdf->Cell(90, 0,' 1.21 Categoría docente o investigativa', 1, 1, 'C', 1);

          $rcategoria = array();
            foreach ($categoriasgral['categinvestig'] as $c) {
                if (empty($c['fhasta'])) {
                    $rcategoria[] = $c['denominacion'];
                }
            }
            foreach ($categoriasgral['categoriadocente'] as $c) {
                if (empty($c['fhasta'])) {
                    $rcategoria[] = $c['denominacion'];
                }
            }

            $rgrado = array();
            foreach ($categoriasgral['gradocientifico'] as $c) {
                if (empty($c['fhasta'])) {
                    $rgrado[] = $c['denominacion'];
                }
            }
            $r = array();
            for ($i = 0; $i < count($categoriasgral); $i++) {
                $r[$i] = $rgrado[$i] . ";" . $rcategoria[$i];
            }

        foreach ($r as $pos) {
            if (!empty(explode(';', $pos)[0])) {
                $this->pdf->Cell(90, 0, explode(';', $pos)[0], 1, 0, 'C', 0);
            }
            $this->pdf->Cell(10, 0, '', 0, 0, 'C', 0);
            if (!empty(explode(';', $pos)[1])) {

                $this->pdf->Cell(90, 0, explode(';', $pos)[1], 1, 1, 'C', 0);
            }
        }

        /////idioma y dominio de la informatica//////
        $DINF = 'NO';

        if (!empty($idioma)) {
            for ($i = 0; $i < count($idioma); $i++) {
                $IDIOMAS .= '|' . $idioma[$i]['denominacion'] . '|';
            }
        }
        if (!empty($datsociales)) {
            if ($datsociales['dominioinfor']) {
                $DINF = 'SI';
            }
        }

        $this->pdf->SetXY(10, 165);
        $this->pdf->Cell(100, 0, '1.22 Idiomas que domina', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(110, 165);
        $this->pdf->Cell(70, 0, '1.23 Tiene dominio básico de informática?', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(180, 165);
        $this->pdf->Cell(20, 0, $DINF, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(10, 170);
        $this->pdf->Cell(100, 0, $IDIOMAS, 1, 1, 'C', 0, '', 0);

        /////militancia////////
        $this->pdf->SetXY(10, 180);
        $this->pdf->Cell(90, 0, '1.24 Militancia política', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(110, 180);
        $this->pdf->Cell(90, 0, '1.25 Fecha de ingreso', 1, 1, 'C', 1, '', 0);
        $NO = 'No Conocido';
        $militancias = '';

        if (count($afiliaciones)) {
            for ($i = 0; $i < count($afiliaciones); $i++) {
                if ($afiliaciones[$i]['denomtipoorganizacion'] == 'Políticas') {
                    $militancias .= $afiliaciones[$i]['denomorganizacion'] ? '|' . $afiliaciones[$i]['denomorganizacion'] .
                        '|' : $NO;
                    $fechalista = explode("/", $afiliaciones[$i]['fdesde']);
                    $fechalista = $fechalista[2] . '-' . $fechalista[1] . '-' . $fechalista[0];
                    $fechaINgreso = '|' . $fechalista . '|';
                }

            }
        }
        $this->pdf->SetXY(10, 185);
        $this->pdf->Cell(90, 0, $militancias, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(110, 185);
        $this->pdf->Cell(90, 0, $fechaINgreso, 1, 1, 'C', 0, '', 0);
        //////centro de trabajo////
        $this->pdf->SetXY(10, 195);
        $this->pdf->Cell(100, 0, '2.1 Centro de trabajo', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(110, 195);
        $this->pdf->Cell(90, 0, '2.2 Organismo', 1, 1, 'C', 1, '', 0);
        $organismo = 'No Conocido';
        /*if (!empty($cargo)) {
            $centro = $cargo[0]['entidad'];
            $organismo = $cargo[0]['organismo'];
            $Cargoactual = $cargo[0]['cargo'];
            $fechalista = explode("-", $cargo[0]['fchocupcargo']);
            $fechaocup = $fechalista[2] . '-' . $fechalista[1] . '-' . $fechalista[0];
        }*/
        $centro = 'No Conocido';
       /* echo'<pre>';
print_r($trayectoria);die;*/
        if (count($trayectoria)) {
            $centro=$trayectoria[0]['entidad'];
            $organismo=$trayectoria[0]['organismo'];
        }

        $dirTrabajo = 'No Conocido';
        if (!empty($trabajo['direccion'])) {
            $dirTrabajo = $trabajo['direccion'];
        }
       // $TelfTrabajo = 'No Conocido';
        $CorreoTrabajo = 'No Conocido';

        if (count($contacto)) {
            for ($i = 0; $i < count($contacto); $i++) {
                if (($contacto[$i]['idtipomediocontacto'] == 4) &&
                    ($contacto[$i]['idtipocontacto'] == 2)
                ) {
                    $TelfTrabajo.= $contacto[$i]['contacto'].'|';
                }
                if (($contacto[$i]['idtipomediocontacto'] == 1) &&
                    ($contacto[$i]['idtipocontacto'] == 2)
                ) {
                    $CorreoTrabajo = $contacto[$i]['contacto'];
                }
            }
        }

        $this->pdf->SetXY(10, 200);
        $this->pdf->Cell(100, 0, $centro, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(110, 200);
        $this->pdf->Cell(90, 0, $organismo, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(10, 205);
        $this->pdf->Cell(100, 0, '2.3 Dirección del centro de trabajo', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(110, 205);
        $this->pdf->Cell(45, 0, '2.4 Teléfonos', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(155, 205);
        $this->pdf->Cell(45, 0, '2.5 Correo electrónico', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(10, 210);
        $this->pdf->Cell(100, 0, $dirTrabajo, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(110, 210);
        $this->pdf->Cell(45, 0, $TelfTrabajo, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(155, 210);
        $this->pdf->Cell(45, 0, $CorreoTrabajo, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(10, 215);
        $this->pdf->Cell(100, 0, '2.6 Cargo', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(110, 215);
        $this->pdf->Cell(90, 0, '2.7 Fecha en que ocupó el cargo', 1, 1, 'C', 1, '', 0);
        $Cargoactual = 'No Conocido';
        $fechaocup = 'No Conocido';


        if ($trabajo) {
            $Cargoactual=$trabajo['cargo'];
        }
        if (count($trayectoria)) {
           $fechaocup = $trayectoria[0]['fdesde'];
        }

        $this->pdf->SetXY(10, 220);
        $this->pdf->Cell(100, 0, $Cargoactual, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(110, 220);
        $this->pdf->Cell(90, 0, $fechaocup, 1, 1, 'C', 0, '', 0);
        /////salario/////
        $this->pdf->SetXY(10, 230);
        $this->pdf->Cell(30, 0, 'Salario', 1, 1, 'C', 1, '', 0);
        $salario = ' ';
        if (!empty($trabajo['salario'])) {
            $salario = $trabajo['salario'];
        }
        $this->pdf->SetXY(40, 230);
        $this->pdf->Cell(15, 0, $salario, 1, 1, 'C', 0, '', 0);
        ////annos de exp////
        $this->pdf->SetXY(10, 240);
        $this->pdf->Cell(80, 0, '2.9 Años de experiencia en labores de dirección', 1, 1, 'C', 1, '', 0);
        $annosEXP = '';
        $this->pdf->SetXY(90, 240);
        $this->pdf->Cell(15, 0, $annosEXP, 1, 1, 'C', 0, '', 0);
        //Administrativa////
        $administrativa = '0';
        $JefeMilitar = '0';
        $pcc = '0';
        $ujc = '0';
        if (!empty($afiliaciones)) {
            for ($i = 0; $i < count($afiliaciones); $i++) {
                if (($afiliaciones[$i]['denomtipoorganizacion'] == 'PCC') && ($afiliaciones[$i]['cargo'] == 'Secretario')) {
                    $ano = explode(" ", $afiliaciones[$i]['annoscargo']);
                    $pcc += $ano[0];
                }
                if (($afiliaciones[$i]['denomtipoorganizacion'] == 'UJC') && ($afiliaciones[$i]['cargo'] == 'Secretario')) {
                    $ano1 = explode(" ", $afiliaciones[$i]['annoscargo']);
                    $ujc += $ano1[0];
                }
            }
        }
        $this->pdf->SetXY(10, 250);
        $this->pdf->Cell(33, 0, '2.10 Administrativa', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(43, 250);
        $this->pdf->Cell(15, 0, $administrativa, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(58, 250);
        $this->pdf->Cell(33, 0, '2.11 Jefe militar', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(91, 250);
        $this->pdf->Cell(15, 0, $JefeMilitar, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(106, 250);
        $this->pdf->Cell(32, 0, '2.12 PCC', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(138, 250);
        $this->pdf->Cell(15, 0, $pcc, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(153, 250);
        $this->pdf->Cell(32, 0, '2.13 UJC', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(185, 250);
        $this->pdf->Cell(15, 0, $ujc, 1, 1, 'C', 0, '', 0);
        //////organos y organizaciones//////
        $PP;
        $OM;

       /* if (!empty($afiliaciones)) {
            for ($i = 0; $i < count($afiliaciones); $i++) {
                if ($afiliaciones[$i]['denomtipoorganizacion'] == 'Masas' || $afiliaciones[$i]['idorganizacion'] == '2') {
                    $OM.=$afiliaciones[$i]['denomorganizacion'].' ';
                }
            }
        }*/
        $this->pdf->SetXY(10, 260);
        $this->pdf->Cell(60, 0, '2.14 Organos del Poder Popular', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(70, 260);
        $this->pdf->Cell(15, 0, $PP, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(85, 260);
        $this->pdf->Cell(60, 0, '2.15 Organizaciones de masa', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(145, 260);
        $this->pdf->Cell(55, 0, $OM, 1, 1, 'L', 0, '', 0);
    }

    public function CrearPagina4(
        $cargosorganizacion, $estadosalud, $afecciones, $trayectoriacargos, $residencia, $educacion, $ocupaciontiempoguerra,
        /*$ingresofar,*/
        $estanciaexterior, $condecoraciones, $sanciones,/* $vehiculo, $armas, */
        $familiares, $familiarexterior,$familiarviaje,$familiarsancionado,$familiarresidente,$ingreso
    )
    {
        $this->pdf->AddPage();
        $this->posY = 2;
        //$this->pdf->SetY(19);
        // $this->pdf->SetX(5);
        //$this->pdf->MultiCell(250, 5, '3. ¿Es miembro de algún organismo de dirección del PCC, UJC, organizaciones de masa, sociales o del Poder Popular?', 0, 'L', 0, 0, '', '', true);
        $tablaafiliaciones;
        $long = count($cargosorganizacion);
        if ($long) {
            for ($i = 0; $i < $long; $i++) {
                $tablaafiliaciones = $tablaafiliaciones . '<tr>
				<td width="244" align="center">' . $cargosorganizacion[$i]['denomcargoorganizacion'] . '</td>
				<td width="244" align="center">' . $cargosorganizacion[$i]['denomorganizacion'] . '</td>
				<td width="200" align="center">' . $cargosorganizacion[$i]['fdesde'] . '</td>
			</tr>';
            }
        }

        $elem
            = '<h2 align="left">3. ¿ES MIEMBRO DE ALGÚN ORGANISMO DEL PCC, UJC, ORGANIZACIONES DE MASA, SOCIALES O DEL PODER POPULAR?</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center" width="244">Cargo</td>
				<td bgcolor="#dcdcdc" align="center" width="244">Organismo</td>
				<td bgcolor="#dcdcdc" align="center" width="200">Fecha en que fue electo</td>
			</tr>
			' . $tablaafiliaciones . '
			<h2></h2>

		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        //estado salud///
        $si = ' Si ___';
        $no = ' No ___';
        $limitaciones = '';
        $flag = false;

        if (count($estadosalud)) {
            for ($i = 0; $i < count($estadosalud); $i++) {
                if ($estadosalud[$i]['limitacion']) {
                    $flag = true;
                    $limitaciones = $estadosalud[$i]['limitacion'];
                }
            }
        }

        if ($flag) {
            $si = ' Si _x_';
        } else {
            $no = ' No _x_';
        }
        ////salud///
        $bueno;
        $malo;
        $regular;
        if (count($estadosalud)) {
            for ($i = 0; $i < count($estadosalud); $i++) {
                if ($estadosalud[$i]['estadosalud'] == 0) {
                    $bueno = 'X';
                    break;
                } elseif ($estadosalud[$i]['estadosalud'] == 1) {
                    $regular = 'X';
                    break;
                } elseif ($estadosalud[$i]['estadosalud'] == 2) {
                    $malo = 'X';
                    break;
                }
            }
        }

        ////enfermedad////
        $enfermedad;
        $Tratamiento;
        $enfertrata;
        $flag = true;
        $long = count($afecciones);
        if (count($long)) {
            for ($i = 0; $i < $long; $i++) {
                $enfertrata = $enfertrata . '<tr>
				<td align="center">' . $afecciones[$i]['denompadecimiento'] . '</td>
				<td align="center">' . $afecciones[$i]['tratamiento'] . '</td>
			</tr>';
            }
        }

        $elem
            = '<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc">4. POSEE USTED LIMITACIONES PARA TRABAJAR?' . $si . $no . 'DE SER POSITIVA SU RESPUESTA, EXPRESE CUALES:</td>
			</tr>
			<tr>
				<td>' . $limitaciones . '</td>
			</tr>
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        $elem
            = '<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc"  width="239">5. Como considera su estado de salud?</td>
				<td width="60" align="center">Bueno</td>
				<td width="40" align="center">' . $bueno . '</td>
				<td width="60" align="center">Regular</td>
				<td width="40" align="center">' . $regular . '</td>
				<td width="60" align="center">Malo</td>
				<td width="40" align="center">' . $malo . '</td>
			</tr>
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        $elem
            = '<h2 align="center">6. ENFERMEDADES QUE PADECE:</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center">Enfermedad</td>
				<td bgcolor="#dcdcdc" align="center">Tratamiento</td>
			</tr>
			' . $enfertrata . '
			<h2></h2>
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');


        //TRAYECTORIA LABORAL////

        $tablatrayectoria;
      /*  echo'<pre>';
        print_r($trayectoriacargos);die;*/
        $long = count($trayectoriacargos);
        if ($long) {
            for ($i = 0; $i < $long; $i++) {
                $tablatrayectoria = $tablatrayectoria . '<tr>
				<td width="200" align="center">' . $trayectoriacargos[$i]['orgentidad'] . '</td>
				<td width="200" align="center">' . $trayectoriacargos[$i]['cargo'] . '</td>
				<td width="73" align="center">' . $trayectoriacargos[$i]['fdesde'] . '</td>
				<td width="73" align="center">' . $trayectoriacargos[$i]['fhasta'] . '</td>
				<td width="132" align="center">' . $trayectoriacargos[$i]['denominacion'] . '</td>
			</tr>';
            }
        }

        $elem
            = '<h2 align="center">7. TRAYECTORIA LABORAL:</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center" width="200">Centro Laboral</td>
				<td bgcolor="#dcdcdc" align="center" width="200">Ocupación Laboral</td>
				<td bgcolor="#dcdcdc" align="center" width="73">Desde</td>
				<td bgcolor="#dcdcdc" align="center" width="73">Hasta</td>
				<td bgcolor="#dcdcdc" align="center" width="132">Causas del cambio</td>
			</tr>
			' . $tablatrayectoria . '
			<h2></h2>

		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        //678
        ///////////// LUGARES DE RESIDENCIA//////////////

        //$obj = new ZendExt_Nomencladores_ADT ();
        $tablaresidencia = '';

        if (!empty($residencia)) {
            $long = count($residencia);
            for ($i = 0; $i < $long; $i++) {
                //pais
                /*  $getpais = $obj->get("nom_pais", 0, 0, 'nom_pais.idpais=' . $direcciones[$i]['idpais'], 0);
                  $pais['pais'] = $getpais[0]['nombrepais'];
                  //municipio
                  $get = $obj->get("nom_dpa", 0, 0, 'nom_dpa.iddpa=' . $direcciones[$i]['iddpa'], 0);
                  $array['municipio'] = $get[0]['denominacion'];
                  $array['idpadre'] = $get[0]['idpadre'];
                  //provincia
                  $get1 = $obj->get("nom_dpa", 0, 0, 'nom_dpa.iddpa=' . $array['idpadre'], 0);
                  $array['provincia'] = $get1 [0]['denominacion'];
                  if ($direcciones[$i][nocasa])
                      $ncasa = $direcciones[$i][nocasa];
                  elseif ($direcciones[$i][noedificio])
                      $ncasa = $direcciones[$i][noedificio];
                  $municip = $array['municipio'];
                  $Provinc = $array['provincia'];
                  $DIR = $direcciones[$i][calle] . ' ' . $ncasa . ',' . $direcciones[$i][localidad] . ',' . $pais['pais'] . ',' . $Provinc . ',' . $municip;
      */

                if ($residencia[$i]['idmunicipio']) {
                    $get = $this->obService->getDptDadoArrayIds($residencia[$i]['idmunicipio']);
                    $array[0]['municipio'] = $get[$i]['denominacion'];
                    $array[0]['idpadre'] = $get[$i]['idpadre'];
                } else {
                    $array[0]['municipio'] = '';
                    $array[0]['idpadre'] = '';
                }
                if ($array[0]['idpadre']) {
                    //provincia
                    //$get1 = $obj->get("nom_dpt", 0, 0, 'nom_dpt.iddpt=' . $array['idpadre'], "mod_nomencladores");
                    $get1 = $this->obService->getDptDadoArrayIds($array[0]['idpadre']);
                    $array[0]['provincia'] = $get1[$i]['denominacion'];
                    $municip = $array[0]['municipio'];
                    $Provinc = $array[0]['provincia'];
                    // $DIR = $residencia[0]['direccion'] . ',' . $pais[0]['pais'] . ',' . $array[0]['provincia'] . ',' . $array[0]['municipio'];
                    $DIR = $residencia[$i]['direccion'] . ',' . $array[0]['provincia'] . ',' . $array[0]['municipio'];
                } else {
                    $municip = '';
                    $Provinc = '';
                    // $DIR = $residencia[0]['direccion'] . ',' . $pais[0]['pais'] . ',' . $array[0]['provincia'] . ',' . $array[0]['municipio'];
                    $DIR = '';
                }


                $tablaresidencia = $tablaresidencia . '<tr>
					<td width="73" align="center">' . $residencia[$i]['fdesde'] . '</td>
					<td width="73" align="center">' . $residencia[$i]['fhasta'] . '</td>
					<td width="310" align="center">' . $DIR . '</td>
					<td width="110" align="center">' . $municip . '</td>
					<td width="112" align="center">' . $Provinc . '</td>
				</tr>';
            }
        }

        $elem
            = '<h2 align="center">8. LUGARES DE RESIDENCIA EN LOS ÚLTIMOS AÑOS:</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center" width="73">Desde</td>
				<td bgcolor="#dcdcdc" align="center" width="73">Hasta</td>
				<td bgcolor="#dcdcdc" align="center" width="310">Dirección</td>
				<td bgcolor="#dcdcdc" align="center" width="110">Municipio</td>
				<td bgcolor="#dcdcdc" align="center" width="112">Provincia</td>
			</tr>
			' . $tablaresidencia . '
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        //////////ESTUDIOS REALIZADOS A PARTIR DE LA ENSEÑANZA MEDIA///////////
        $tablaeducacion = '';
        $long = count($educacion);
        if ($long) {
            for ($i = 0; $i < $long; $i++) {
                if ($educacion[$i]['denomtipoformacion'] != 'Militar') {
                    $tablaeducacion = $tablaeducacion . '<tr>
				<td width="240" align="center">' . $educacion[$i]['denomcentroestudio'] . '</td>
				<td width="280" align="center">' . ' ' . '</td>
				<td width="79" align="center">' . $educacion[$i]['fdesde'] . '</td>
				<td width="79" align="center">' . $educacion[$i]['fhasta'] . '</td>
			</tr>';
                }
            }
        }


        $elem
            = '<h2 align="center">9. ESTUDIOS REALIZADOS:</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center" width="240">Centro de Estudios</td>
				<td bgcolor="#dcdcdc" align="center" width="280">Dirección</td>
				<td bgcolor="#dcdcdc" align="center" width="79">Desde</td>
				<td bgcolor="#dcdcdc" align="center" width="79">Hasta</td>
			</tr>
			' . $tablaeducacion . '
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        //////////TRAYECTORIA MILITAR///////////
        $tablatraymilitar = '';
        $long = count($ingresofar);
        if ($long) {
            for ($i = 0; $i < $long; $i++) {
                $tablatraymilitar = $tablatraymilitar . '<tr>
				<td width="100" align="center">' . $ingresofar[$i]['fechaingresofar'] . '</td>
				<td width="100" align="center">' . $ingresofar[$i]['fechabaja'] . '</td>
				<td width="478" align="center">' . $ingresofar[$i]['motivo'] . '</td>
			</tr>';
            }
        }

        $elem
            = '<h2 align="center">10. TRAYECTORIA MILITAR:</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center" width="100">Año de Ingreso</td>
				<td bgcolor="#dcdcdc" align="center" width="100">Año de Baja</td>
				<td bgcolor="#dcdcdc" align="center" width="478">De haber sido baja diga las causas</td>
			</tr>
			' . $tablatraymilitar . '
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        //////////PREPARACION MILITAR RECIBIDA///////////
        $tablaeducmilitar = '';
        $long = count($educacion);
        if ($long) {
            for ($i = 0; $i < $long; $i++) {
                if ($educacion[$i]['denomtipoformacion'] == 'Militar') {
                    $tablaeducmilitar = $tablaeducmilitar . '<tr>
				<td width="226" align="center">' . $educacion[$i]['denomcurso'] . '</td>
				<td width="226" align="center">' . $educacion[$i]['centroestudio'] . '</td>
				<td width="226" align="center">' . $educacion[$i]['fdesde'] . '</td>
			</tr>';
                }
            }
        }

        $elem
            = '<h2 align="center">11. PREPARACIÓN MILITAR RECIBIDA:</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center" width="226">Curso</td>
				<td bgcolor="#dcdcdc" align="center" width="226">Escuela</td>
				<td bgcolor="#dcdcdc" align="center" width="226">Fecha</td>
			</tr>
			' . $tablaeducmilitar . '
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        ////UBICACION TIEMPO DE GUERRA //////////////
        /* $ubicacion;
         $elem = '<table border="0" cellspacing="0" cellpadding="0">
             <tr>
                 <td width="300">11. Ubicación en tiempo de guerra:' . $ubicacion . '</td>
             </tr>
         </table>';
         $this->pdf->writeHTML($elem, true, false, true, false, '');*/

        //////////OCUPACION EN TIEMPO DE GUERRA///////////
        $tablatiempoguerra = '';
        $long = count($ocupaciontiempoguerra);
        if ($long) {
            for ($i = 0; $i < $long; $i++) {
                $tablatiempoguerra = $tablatiempoguerra . '<tr>
				<td width="240" align="center">' . $ocupaciontiempoguerra[$i]['entidad'] . '</td>
				<td width="280" align="center">' . $ocupaciontiempoguerra[$i]['cargo'] . '</td>
				<td width="79" align="center">' . $ocupaciontiempoguerra[$i]['fdesde'] . '</td>
				<td width="79" align="center">' . $ocupaciontiempoguerra[$i]['fhasta'] . '</td>
			</tr>';
            }
        }

        $elem
            = '<h2 align="center">12. UBICACIÓN EN TIEMPO DE GUERRA:</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center" width="240">Entidad</td>
				<td bgcolor="#dcdcdc" align="center" width="280">Cargo</td>
				<td bgcolor="#dcdcdc" align="center" width="79">Desde</td>
				<td bgcolor="#dcdcdc" align="center" width="79">Hasta</td>
			</tr>
			' . $tablatiempoguerra . '
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        //////////ESTANCIA EN EL EXTERIOR///////////
        $tablaexterior = '';

        $long = count($estanciaexterior);
       // $obj = new ZendExt_Nomencladores_ADT ();
        if ($long) {
            for ($i = 0; $i < $long; $i++) {

                if ($estanciaexterior[$i]['idpais']) {
                    $arreglo = $this->obService->findContryById($estanciaexterior[$i]['idpais']);
                    $arr['pais'] = $arreglo['nombrepais'];

                }
                    $tablaexterior = $tablaexterior . '<tr>
				<td width="216" align="center">' . $estanciaexterior[$i]['denommision'] . '</td>
				<td width="145" align="center">' . $arr['pais'] . '</td>
				<td width="100" align="center">' . $estanciaexterior[$i]['fdesde'] . '</td>
				<td width="216" align="center">' . $estanciaexterior[$i]['cargo'] . '</td>
			</tr>';

            }
        }

        $elem
            = '<h2 align="center">13. ESTANCIA EN EL EXTERIOR:</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center" width="216">Misiones</td>
				<td bgcolor="#dcdcdc" align="center" width="145">País</td>
				<td bgcolor="#dcdcdc" align="center" width="100">Fecha</td>
				<td bgcolor="#dcdcdc" align="center" width="216">Cargo</td>
			</tr>
			' . $tablaexterior . '
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        //////////CONDECORACIONES Y ESTIMULOS///////////
        $tablacondecoraciones = '';
        $long = count($condecoraciones);
        if ($long) {
            for ($i = 0; $i < $long; $i++) {
                $tablacondecoraciones = $tablacondecoraciones . '<tr>
				<td width="578" align="center">' . $condecoraciones[$i]['denomtipocondecoracion'] . ', ' .
                    $condecoraciones[$i]['denominacion'] . ', ' . $condecoraciones[$i]['denommotivocondecoracion'] . '</td>
				<td width="100" align="center">' . $condecoraciones[$i]['fecha'] . '</td>
			</tr>';
            }
        }

        $elem
            = '<h2 align="center">14. CONDECORACIONES, DISTINCIONES Y ESTIMULOS:</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center" width="578">Condecoraciones, distinción o estimulo</td>
				<td bgcolor="#dcdcdc" align="center" width="100">Fecha</td>
			</tr>
			' . $tablacondecoraciones . '
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        //////////SANCIONES///////////
        $tablasanciones = '';
        $long = count($sanciones);
        if ($long) {
            for ($i = 0; $i < $long; $i++) {
                $tablasanciones = $tablasanciones . '<tr>
				<td width="192" align="center">' . $sanciones[$i]['denomtiposancion'] . '</td>
				<td width="192" align="center">' . $sanciones[$i]['denomsancion'] . '</td>
				<td width="192" align="center">' . $sanciones[$i]['denommotivosancion'] . '</td>
				<td width="100" align="center">' . $sanciones[$i]['fimposicion'] . '</td>
			</tr>';
            }
        }

        $elem
            = '<h2 align="center">14. SANCIONES:</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center" width="192">Sanciones</td>
				<td bgcolor="#dcdcdc" align="center" width="192">Sanción</td>
				<td bgcolor="#dcdcdc" align="center" width="192">Motivo</td>
				<td bgcolor="#dcdcdc" align="center" width="100">Fecha</td>
			</tr>
			' . $tablasanciones . '
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        //////////POSEE VEHICULO///////////
        $SI = ' Si__  ';
        $NO = 'No__  ';
        $texto;
        if (!empty($vehiculo)) {
            $SI = 'Si_x_  ';
            $long = count($vehiculo);
            for ($i = 0; $i < $long; $i++) {
                if ($vehiculo[$i]['idclasificacion'] == 1) {
                    $clasificacion = 'Particular';
                } else {
                    $clasificacion = 'Por el cargo';
                }
                $texto = $texto . 'Marca o Modelo:' . $vehiculo[$i]['vehiculo'] . ', ' . $vehiculo[$i]['matricula'] . ', ' .
                    $clasificacion . '.';
            }
        } else {
            $NO = 'No_x_';
        }
        $texto;
        $elem
            = '<table border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td><strong>15. POSEE US. VEHICULO AUTOMOTOR?' . $SI . $NO . 'DE SER POSITIVA SU RESPUESTA, EXPRESE: ' .
            $texto . '</strong></td>
			</tr>
		</table>';

        $this->pdf->writeHTML($elem, true, false, true, false, '');
        //////////ARMA DE FUEGO ///////////
        $SI = 'Si__  ';
        $NO = 'No__';
        $texto;
        if (!empty($armas)) {
            $SI = 'Si_x_  ';
            $long = count($armas);
            for ($i = 0; $i < $long; $i++) {
                if ($armas[$i]['idclasificacion'] == 1) {
                    $clasificacion = 'Particular';
                } else {
                    $clasificacion = 'Por el cargo';
                }
                $texto = $texto . 'Marca o Modelo:' . $armas[$i]['modelo'] . ', ' . $armas[$i]['tparmafuego'] . ', ' .
                    'Licencia' . $armas[$i]['numerolicencia'] . ', ' . $clasificacion . '.';
            }
        } else {
            $NO = 'No_x_';
        }
        $texto;
        $elem
            = '<table border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td><strong>16. POSEE UD. ARMA DE FUEGO?' . $SI . $NO . ' DE SER POSITIVA SU RESPUESTA,EXPRESE: ' . $texto . '</strong></td>
			</tr>
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        //////////DATOS DE FAMILIARES ///////////
        $allegado = 'NO';
        $conviven = 'NO';
        $tablafamiliares;

        $long = count($familiares);

        if ($long) {
            for ($i = 0; $i < $long; $i++) {
                if ($familiares[$i]['allegado'] == 1) {
                    $allegado = 'SI';
                }
                if ($familiares[$i]['conviven'] == 1) {
                    $conviven = 'SI';
                }
                $tablafamiliares = $tablafamiliares . '<tr>
				<td width="240" align="center">' . $familiares[$i]['parentesco'] . '</td>
				<td width="280" align="center">' . $familiares[$i]['nombre'] . '</td>
				<td width="79" align="center">' . $allegado . '</td>
				<td width="79" align="center">' . $conviven . '</td>
			</tr>';
            }
        }

        $elem
            = '<h2 align="center">17. DATOS FAMILIARES:</h2>
		<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td bgcolor="#dcdcdc" align="center" width="240">Parentesco</td>
				<td bgcolor="#dcdcdc" align="center" width="280">Familiar o amigo</td>
				<td bgcolor="#dcdcdc" align="center" width="79">Allegado</td>
				<td bgcolor="#dcdcdc" align="center" width="79">Conviven</td>
			</tr>
			' . $tablafamiliares . '
			<h2></h2>

		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        $SI = ' Si__  ';
        $NO = 'No__';
        $texto = '';

        if (!empty($familiarviaje)) {
            $SI = 'Si_x_  ';
            $long = count($familiarviaje);
            for ($i = 0; $i < $long; $i++) {
                $getpais = $this->obService->findContryById($familiarviaje[$i]['idpais']);
                $pais = $getpais['nombrepais'];
                $nombre =$familiarviaje[$i]['nombre'] ;
                $parentesco =$familiarviaje[$i]['parentesco'] ;
                $fdesde =$familiarviaje[$i]['fdesde'] ;

                $texto = $texto . $nombre . ', '.$pais. ', '.$fdesde.'<br/>';
            }
        } else {
            $NO = 'No_x_';
        }

        $elem
            = '<p><strong>18. ALGUN FAMILIAR O PERSONA QUE RESIDA CON USTED HA REALIZADO VIAJES AL EXTRANJERO?' . $SI . $NO .
            ' DE SER POSITIVA SU RESPUESTA,EXPRESE:<br/></strong>' .$texto. '</p>
		';
        $this->pdf->writeHTML($elem, true, false, true, false, '');

        /////////// FAMILIARES EN EL EXTERIOR ///////////
       // $obj = new ZendExt_Nomencladores_ADT ();
        $SI = ' Si__  ';
        $NO = 'No__';
        $texto = '';


        if (!empty($familiarexterior)) {
            $SI = 'Si_x_  ';
            $long = count($familiarexterior);
            for ($i = 0; $i < $long; $i++) {

                $getpais = $this->obService->findContryById($familiarexterior[$i]['idpais']);
                $pais = $getpais['nombrepais'];
                $parentesco =$familiarexterior[$i]['parentesco'] ;
                $fdesde =$familiarexterior[$i]['fdesde'] ;

                $texto = $texto . $familiarexterior[$i]['nombre'].', ' .$fdesde. ', '.$pais.'</br>';

            }
        } else {
            $NO = 'No_x_';
        }


        $elem
            = '<p><strong>19. TIENE USTED FAMILIARES EN EL EXTERIOR?' . $SI . $NO .' DE SER POSITIVA SU RESPUESTA,EXPRESE:<br/></strong>' .$texto. '</p>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');

        ////OTRAS PESONAS EXTRANJERAS O RESIDENTES EN CUBA CON KE SE TENGA COMUNICACION///
        $tabla = '';
        $tabla
            = '<tr>
			<td align="center"></td>
			<td align="center"></td>
			<td align="center"></td>
		</tr>';

        $texto = '';

        if (!empty($familiarresidente)) {

            $long = count($familiarresidente);
            for ($i = 0; $i < $long; $i++) {

                $getpais = $this->obService->findContryById($familiarresidente[$i]['idpais']);
                    $pais = $getpais['nombrepais'];
                    $parentesco =$familiarresidente[$i]['parentesco'] ;
                    $fdesde =$familiarresidente[$i]['fdesde'] ;
                    $texto = $texto . $familiarresidente[$i]['nombre']   . ', '.$parentesco. ', '.$fdesde. ', '.$pais.'<br/>';
            }
         }

        if (!empty($familiarexterior)) {
            $SI = 'Si_x_  ';
            $long = count($familiarexterior);
            for ($i = 0; $i < $long; $i++) {

                $getpais = $this->obService->findContryById($familiarexterior[$i]['idpais']);
                $pais = $getpais['nombrepais'];
                $parentesco =$familiarexterior[$i]['parentesco'] ;
                $fdesde =$familiarexterior[$i]['fdesde'] ;
                $texto = $texto . $familiarexterior[$i]['nombre'].', ' .$parentesco.', ' .$fdesde. ', '.$pais.'</br>';

            }
        }

        $elem
            = '<p><strong>20. REFIERASE A OTRAS PERSONAS RESIDENTES EN EL EXTERIOR O EXTRANJEROS RESIDENTES EN CUBA CON LOS QUE MANTIENE RELACIONES PERSONALES:<br></strong>' . $texto . '</p>
		';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        $this->pdf->Ln(5);
        ////FAMILIAR SANCIONADO/////
        $SI = ' Si__  ';
        $NO = 'No__';
        $texto = '';

        if (!empty($familiarsancionado)) {

            $long = count($familiarsancionado);
            for ($i = 0; $i < $long; $i++) {

                    $SI = ' Si_x_  ';
                    $sanciones = $familiarsancionado[$i]['sancion'];
                    $motivo = $familiarsancionado[$i]['motivo'];
                    $nombre = $familiarsancionado[$i]['nombre'];
                    $texto = $texto . $nombre . ', '.$sanciones. ' '.'por '.$motivo.'<br/>';

            }
        } else {
            $NO = 'No_x_';
        }


        $elem
            = '<p><strong>21. ALGUN FAMILIAR O PERSONA RESIDENTE CON USTED QUE HA SIDO SANCIONADO JUDICIALMENTE?' . $SI .
            $NO . ' DE SER POSITIVA SU RESPUESTA,EXPRESE: <br></strong>' . $texto . '</p>
		';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        $this->pdf->Ln(5);

        ////RECIBE INGRESO /////
        $SI = ' Si__  ';
        $NO = 'No__';
        $texto = '';
        if (!empty($ingreso)) {
            $SI = ' Si_x_';
        } else {
            $NO = 'No_x_';
        }
        $elem
            = '<table border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td><strong>22. USTED RECIBE ALGUN INGRESO MONETARIO ADEMAS DE SU SALARIO?' . $SI . $NO .
            ' DE SER POSITIVA SU RESPUESTA,MARQUE CON UNA X. </strong>' . $texto . '</td>
			</tr>
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        ////RECIBE INGRESO /////
       $SI = ' Si__  ';
       $NO = 'No__';
        $texto = '';

        if (!empty($ingreso)) {
            for ($i = 0; $i < $long; $i++) {

                if($ingreso[$i]['idfamiliar']){
                    $SI = ' Si_x_  ';
                }else{
                    $NO = 'No_x_';
                }

            }
        } else {
            $NO = 'No_x_';
        }

        $elem
            = '<table border="0" cellspacing="0" cellpadding="0">
			<tr>
				<td><strong>23. SE BENEFICIA DE ALGUN INGRESO MONETARIO QUE RECIBA ALGUNO DE SUS FAMILIARES' . $SI . $NO .
            ' DE SER POSITIVA SU RESPUESTA,MARQUE CON UNA X.</strong> ' . $texto . '</td>
			</tr>
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');
        ////fecha///
        $tabla = '';
        $hoy = date("d.m.y");
        $hoy = explode('.', $hoy);
        $tabla
            = '<tr>
			<td width="40" align="center">Fecha</td>
			<td width="30" align="center">' . $hoy[0] . '</td>
			<td width="30" align="center">' . $hoy[1] . '</td>
			<td width="30" align="center">' . $hoy[2] . '</td>
		</tr>';
        $elem
            = '<table border="1" cellspacing="0" cellpadding="0">
			<tr>
				<td width="40" align="center"></td>
				<td width="30" align="center">D</td>
				<td width="30" align="center">M</td>
				<td width="30" align="center">A</td>
			</tr>
			' . $tabla . '
		</table>';
        $this->pdf->writeHTML($elem, true, false, true, false, '');

    }

    public function DameNombreConcatenado($datos)
    {
        $text = '';
        for ($i = 0; $i < count($datos); $i++) {
            $text = $datos[$i]['nombre'] . ' ' . $datos[$i]['papel'] . ' ' . $datos[$i]['sapel'];
        }

        return $text;
    }

    public function DamePais($datos)
    {
        $text = '';
      //  $obj = new ZendExt_Nomencladores_ADT ();
        for ($i = 0; $i < count($datos); $i++) {
            if ($datos[$i]['idpais']) {
                $getpais =  $this->obService->getChilds($datos[$i]['idpais']);
                $text = $getpais['nombrepais'];
            } else {

                $text = '';
            }

        }

        return $text;
    }

    public function DameSanciones($datos)
    {
        $text = '';
        for ($i = 0; $i < count($datos); $i++) {
            if ($datos[$i][tpsanciones] == 'Judiciales') {
                $text = $datos[$i][sancion];
            }
        }

        return $text;
    }

    public function Guardar()
    {
        ob_clean();
        $this->pdf->Output('DatosCuadro.pdf', 'I');

        return true;
    }

}