<?php

/**
 * Created by PhpStorm.
 * User: Miguel Antonio
 * Date: 22/01/2016
 * Time: 09:11 AM
 */
class ExportarDatosSuinModel extends ZendExt_Model
{
    protected $pdf,
        $persona,
        $posY;

    public function ExportarDatosSuinModel($persona)
    {
        parent::ZendExt_Model();
        $dir = $_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps . 'apps/pvd/comun/recursos/tcpdf/config/lang/eng.php');
        require_once($apps . 'apps/pvd/comun/recursos/tcpdf/tcpdf.php');
        $this->persona = $persona;
    }

    public function CrearPlantilla()
    {
        // Create new PDF document

        $this->pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, PDF_PAGE_FORMAT, true, 'UTF-8', false);

        // remove default header/footer
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);

        // set default monospaced font
        // $this->pdf->SetDefaultMonospacedFont(PDF_FONT_MONOSPACED);
        //set margins
        // $this->pdf->SetMargins(10, 5, 5, 10);
        //set auto page breaks
        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

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

    public function createHeader()
    {

        $this->pdf->SetAutoPageBreak(TRUE, PDF_MARGIN_BOTTOM);

        $this->pdf->SetFillColor(220, 220, 220);

        $bordetabla = array('LTRB' => array('width' => 0, 'cap' => 'butt', 'join' => 'miter', 'dash' => 0, 'color' => array(0, 0, 0)));
        $this->pdf->SetFont('times', 'B', 20);

        $this->pdf->SetXY(10, 10);
        $this->pdf->Cell(190, 0, 'DATOS DE LA PERSONA', 0, 1, 'C', 0, '', 0);


        $this->pdf->Write(0, $txt, '', 0, 'L', true, 0, false, false, 0);
        $this->pdf->SetFont('times', '', 11);

        $this->pdf->setJPEGQuality(75);

        /////////FOTO//////
        $dirfoto = $_SERVER ['DOCUMENT_ROOT'] . '/pvd/persona/views/images/persona/no-photo-male.png';
        $foto = $this->persona->passport;
        if ($this->persona->passport) {
            //$this->table->addImageToCell(1, 1, $dirfoto, new ParFormat('left'),2.92, 2.77);
            $this->pdf->Image($_SERVER ['DOCUMENT_ROOT'] . $foto, 10, 7, 30, 30, '', '', '', true, 150, '', false, false, 1, false, false, false);

        } else {
            //$this->table->addImageToCell(1, 1, $_SERVER ['DOCUMENT_ROOT'].$this->datos['foto'], new ParFormat('left'),2.92, 2.77);
            $this->pdf->Image($dirfoto, 170, 7, 30, 30, 'png', '', '', true, 150, '', false, false, 1, false, false, false);

        }


        ////Celdas del nombre///
        $this->pdf->SetXY(10, 40);
        $this->pdf->Cell(60, 0, 'Primer apellido', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(70, 40);
        $this->pdf->Cell(60, 0, 'Segundo apellido', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(130, 40);
        $this->pdf->Cell(70, 0, 'Nombre(s)', 1, 1, 'C', 1, '', 0);

        $nombre;
        $Apellido1;
        $Apellido2;
        //$nombre = $Persona->nombre;
        $nombre = $this->persona->nombre;
        $snombre = $this->persona->snombre;
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
        $papel = $this->persona->papel;
        $papel = trim($papel);
        $sapel = $this->persona->sapel;
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
        $this->pdf->Cell(15, 0, 'Tipo', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(25, 55);
        $this->pdf->Cell(15, 0, 'M', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(40, 55);
        $this->pdf->Cell(15, 0, 'F', 1, 1, 'C', 1, '', 0);

        $sexo = $this->persona->sexo;
        $nid = $this->persona->numid;
        $masc;
        $fem;
        if ($sexo == 'Masculino') {
            $masc = 'X';
        } else
            $fem = 'X';
        $this->pdf->SetXY(10, 60);
        $this->pdf->Cell(15, 0, 'Sexo', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(25, 60);
        $this->pdf->Cell(15, 0, $masc, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(40, 60);
        $this->pdf->Cell(15, 0, $fem, 1, 1, 'C', 0, '', 0);

        ////No identidad/////
        $this->pdf->SetXY(80, 55);
        $this->pdf->Cell(120, 0, 'No. de Identidad permanente', 1, 1, 'C', 1, '', 0);
        $id = $nid;
        $this->pdf->SetXY(80, 60);
        $this->pdf->Cell(120, 0, $id, 1, 1, 'C', 0, '', 0);


        ///////lugar de nacimiento y provincia////////
        $this->pdf->SetXY(10, 70);
        $this->pdf->Cell(120, 0, 'Lugar de Nacimiento', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(130, 70);
        $this->pdf->Cell(70, 0, 'Fecha de nacimiento', 1, 1, 'C', 1, '', 0);

        $nacimiento = $nacimiento . ',' . $provincia . ',' . $arr['municipio'];
        $this->pdf->SetXY(10, 75);
        $this->pdf->Cell(120, 0, $this->persona->paisprovmuni, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(130, 75);
        $this->pdf->Cell(70, 0, $this->persona->fechanacimiento, 1, 1, 'C', 0, '', 0);

        $this->pdf->SetXY(10, 85);
        $this->pdf->Cell(25, 0, 'Tipo', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(35, 85);
        $this->pdf->Cell(25, 0, 'Piel', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(60, 85);
        $this->pdf->Cell(25, 0, 'Ojos', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(85, 85);
        $this->pdf->Cell(25, 0, 'Pelo', 1, 1, 'C', 1, '', 0);

        $piel = $this->persona->colorpiel;
        $ojos = $this->persona->colorojos;
        $pelo = $this->persona->colorpelo;
        $this->pdf->SetXY(10, 90);
        $this->pdf->Cell(25, 0, 'Color', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(35, 90);
        $this->pdf->Cell(25, 0, $piel, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(60, 90);
        $this->pdf->Cell(25, 0, $ojos, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(85, 90);
        $this->pdf->Cell(25, 0, $pelo, 1, 1, 'C', 0, '', 0);

        ////estatura y peso/////
        $this->pdf->SetXY(120, 85);
        $this->pdf->Cell(40, 0, 'Estatura(cm)', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(160, 85);
        $this->pdf->Cell(40, 0, 'Peso(Kgs)', 1, 1, 'C', 1, '', 0);

        $estatura = $this->persona->talla;
        $peso = $this->persona->peso;
        $this->pdf->SetXY(120, 90);
        $this->pdf->Cell(40, 0, $estatura, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(160, 90);
        $this->pdf->Cell(40, 0, $peso, 1, 1, 'C', 0, '', 0);

        $DIR = $this->persona->direccion . '. (' . $this->persona->fechares . ')';
        $this->pdf->SetXY(10, 100);
        $this->pdf->Cell(190, 0, utf8_encode('Dirección') . ' particular', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(10, 105);
        $this->pdf->Cell(190, 0, $DIR, 1, 1, 'C', 0, '', 0);

        $this->pdf->SetXY(10, 115);
        $this->pdf->Cell(47, 0, 'Nombre madre', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(57, 115);
        $this->pdf->Cell(48, 0, 'Nombre padre', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(105, 115);
        $this->pdf->Cell(48, 0, 'Provincia/Municipio', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(153, 115);
        $this->pdf->Cell(47, 0, 'Registro civil', 1, 1, 'C', 1, '', 0);


        $this->pdf->SetXY(10, 120);
        $this->pdf->Cell(47, 0, $this->persona->nomma, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(57, 120);
        $this->pdf->Cell(48, 0, $this->persona->nompa, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(105, 120);
        $this->pdf->Cell(48, 0, $this->persona->provmunicres, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(153, 120);
        $this->pdf->Cell(47, 0, $this->persona->registrocivil, 1, 1, 'C', 0, '', 0);

        $this->pdf->SetXY(10, 130);
        $this->pdf->Cell(33, 0, 'Tomo', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(43, 130);
        $this->pdf->Cell(15, 0, $this->persona->tomo, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(58, 130);
        $this->pdf->Cell(33, 0, 'Folio', 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(91, 130);
        $this->pdf->Cell(15, 0, $this->persona->folio, 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(106, 130);
        $this->pdf->Cell(32, 0, utf8_encode('¿Huella registrada?'), 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(138, 130);
        $this->pdf->Cell(15, 0, $this->persona->huella ? 'Si' : 'No', 1, 1, 'C', 0, '', 0);
        $this->pdf->SetXY(153, 130);
        $this->pdf->Cell(32, 0,  utf8_encode('Año resitro civil'), 1, 1, 'C', 1, '', 0);
        $this->pdf->SetXY(185, 130);
        $this->pdf->Cell(15, 0,$this->persona->annoregistrocivil, 1, 1, 'C', 0, '', 0);

    }

    public function Guardar($dest = 'I')
    {
        $this->pdf->AddPage();

        $this->createHeader();

        ob_clean();
        $this->pdf->Output("DatosSuin.pdf", $dest);
        return true;
    }
}