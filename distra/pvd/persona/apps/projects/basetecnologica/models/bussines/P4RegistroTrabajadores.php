<?php

/**
 * Created by PhpStorm.
 * User: yOaN
 * Date: 31/03/2015
 * Time: 15:45
 */
class P4RegistroTrabajadores
{
    protected $_pdf;

    function P4RegistroTrabajadores()
    {
        $dir = $_SERVER ['DOCUMENT_ROOT'];
        $apps = str_replace('/web', '/', $dir);
        require_once($apps . 'apps/pvd/comun/recursos/tcpdf/config/lang/eng.php');
        require_once($apps . 'apps/pvd/comun/recursos/tcpdf/TCPDF.php');
    }

    public function crearReporte()
    {
        $this->_pdf = new TCPDF('L', PDF_UNIT, A_4, true, 'UTF-8', false);
        // set document information
        $this->_pdf->SetCreator(PDF_CREATOR);
        $this->_pdf->SetAuthor('Linea Capital Humano');
        $this->_pdf->SetTitle('Reporte anexo 4');
        // remove default header/footer
        $this->_pdf->setPrintHeader(false);
        $this->_pdf->setPrintFooter(false);
        //set auto page breaks
        $this->_pdf->SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
        //set image scale factor
        $this->_pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
        //set some language-dependent strings
        //$this->_pdf->setLanguageArray($l);
        //set margins
        $this->_pdf->SetMargins(1, PDF_MARGIN_TOP, 30);
        // ---------------------------------------------------------
        // set font
        $this->_pdf->SetFont('Times', 'B', 11);
        $this->_pdf->AddPage('L', 'A4');
    }

    public function crearTabla($arr = array(), $datosnominales = array())
    {
        //$tdMotivos = '';
        $rows = '';
        //$cantColspan = 1;
        $cont = 1;
        $rowspan = 0;
        foreach ($datosnominales as $b => $c) {
            if ($b == 'Salario') {
                $b = 'Salario escala';
            }
            $valores .= '<th colspan="2" rowspan="1">' . $b . '</th>';

        }
        foreach ($arr->data as $k => $val) {
            $rowspan = 0;
            foreach ($datosnominales as $key => $c) {
                $datos .= '<th  rowspan="1" colspan="2" >' . $val['salario'][$key] . '</th>';
                $rowspan += 2;
            }
            $rows
                .= '<tr>
                           <th width="25">' . $cont . '</th>
                           <th colspan="3">' . $val['cargo'] . '</th>
                           <th colspan="3">' . $val['categoria'] . '</th>
                           <th colspan="4">' . $val['nombreapellidos'] . '</th>
                           <th width="70">' . $val['sexo'] . '</th>
                           <th width="70">' . $val['numid'] . '</th>
                           <th colspan="3">' . $val['nivel_preparacion'] . '</th>
                           <th colspan="2">' . $val['grupocomplejidad'] . '</th>
                           <th colspan="2">' . $val['total'] . '</th>
                           ' . $datos . '
                           </tr>';
            $datos = '';
            $cont++;
        }
        $tbl
            = '<h1 align="center">Registro de trabajadores.</h1><br /><br />
                <table border="1" align="center">
                    <tr>
                        <th rowspan="2" width="25">No.</th>
                        <th rowspan="2" colspan="3">&Oacute;rganos y cargos</th>
                        <th rowspan="2" colspan="3">Categor&iacute;a ocupacional</th>
                        <th rowspan="2" colspan="4">Nombre y apellidos</th>
                        <th rowspan="2" width="70">Sexo</th>
                        <th rowspan="2" width="70">Carn&eacute; de Identidad</th>
                        <th rowspan="2" colspan="3">Nivel de preparaci&oacute;n</th>
                        <th rowspan="2" colspan="2">Grupo escala</th>
                        <th rowspan="2" colspan="2">Total</th>
                        <th colspan="' . $rowspan . '">Salario</th>
                         <!--<th colspan="20">Salario</th>-->
                    </tr>
                    <tr>' . $valores . '
                    </tr>' . $rows . '</table>';
        $this->_pdf->writeHTML($tbl, true, false, false, false, '');
    }

    public function save()
    {
        try {
            ob_clean();
            $this->_pdf->Output('P4.pdf', 'I');
        } catch (Exception $e) {
            print_r($e);
            die;
        }
    }
}