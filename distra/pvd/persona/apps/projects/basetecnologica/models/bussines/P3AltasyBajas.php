<?php

class P3AltasyBajas
{
    protected $pdf;
    protected $arrMotivos = array();

    public function P3AltasyBajas()
    {
        $dirwww = $_SERVER["DOCUMENT_ROOT"];
        //Direccion del Marco de trabajo relativa a la carpeta de publicacion.
        $dirrelmt = "/";
        //Direccion absoluta del marco de trabajo
        $apps = str_replace("//", "/", dirname($dirwww . "..") . "/" . $dirrelmt);
        require_once($apps . 'apps/pvd/comun/recursos/tcpdf/config/lang/eng.php');
        require_once($apps . 'apps/pvd/comun/recursos/tcpdf/TCPDF.php');
        $this->arrMotivos = array();
    }

    public function crearReporte()
    {
        $this->pdf = new TCPDF(PDF_PAGE_ORIENTATION, PDF_UNIT, A4, true, 'UTF-8', false);
        // set document information
        $this->pdf->SetCreator(PDF_CREATOR);
        $this->pdf->SetAuthor('Centro Recursos Humano');
        $this->pdf->SetTitle('Reporte de altas y bajas de los trabajadores');
        // remove default header/footer
        $this->pdf->setPrintHeader(false);
        $this->pdf->setPrintFooter(false);
        //set auto page breaks
        $this->pdf->SetAutoPageBreak(true, PDF_MARGIN_BOTTOM);
        //set image scale factor
        $this->pdf->setImageScale(PDF_IMAGE_SCALE_RATIO);
        //set some language-dependent strings
        //$this->pdf->setLanguageArray($l);
        //set margins
        $this->pdf->SetMargins(10, PDF_MARGIN_TOP, 10);
        // ---------------------------------------------------------
        // set font
        $this->pdf->SetFont('Times', 'B', 12);
        $this->pdf->AddPage('L', 'A4');
    }

    public function crearTabla($arr = array())
    {
        //$tdMotivos = '';
        $rows = '';
        $cantColspan = 1;
        $cont = 1;
        $this->conformarDireccion($arr);
        foreach ($arr as $k => $val) {
            $nAlta = $val['dpen_noalta'] ? '-' . $val['dpen_noalta'] : '';
            $dpa = isset($val['dpt']) ? ', ' . $val['dpt']['mun'] . ', ' . $val['dpt']['prov'] : '';
            $direccion = !empty($val['dd_direccion']) ? $val['dd_direccion'] . $dpa : '';
            $rows
                .= '<tr>
                        <th width="25">' . $cont . '</th>
                        <th width="100">' . $val['dpident_numid'] . '</th>
                        <th colspan="4"> ' . $direccion . '</th>
                        <th colspan="2">' . $val['dpen_fdesde'] . $nAlta . '</th>
                        <th colspan="2">' . $val['npsc_denominacion'] . '</th>
                        <th colspan="2">' . $val['dpen_fhasta'] . '</th>
                         <th colspan="1">' . $val['nmb_denominacion'] . '</th>
                    </tr>';
            $cont++;
        }
        if (count($this->arrMotivos) > 0) {
            $cantColspan = count($this->arrMotivos);
        }
        $tbl
            = '<h1>Registro de Altas y Bajas</h1><br />
                <table border="1" align="center">
                    <tr>
                        <th rowspan="3" width="25">No.</th>
                        <th rowspan="3" width="100">No.CI</th>
                        <th rowspan="3" colspan="4">Dirección particular del trabajador</th>
                        <th colspan="4">Altas</th>
                        <th rowspan="2" colspan="2"  width="100">Fecha y <br/> No. de baja</th>
                        <th rowspan="4" width="100">Motivo de baja</th>
                    </tr>
                    <tr>
                        <th colspan="2" rowspan="2">Fecha y No. de alta</th>
                        <th colspan="2" rowspan="2">Fuente de procedencia</th>

                    </tr>
                    <tr></tr>
                    <tr></tr>

                    ' . $rows . '
            </table>';
        $this->pdf->writeHTML($tbl, true, false, false, false, '');
    }

    /**
     * Obtener direccion de la persona
     *
     * @param numeric Idpersona identificador de la persona.
     * @param array   Arreglo de persona para actualizar con los datos que gestiona la funcion.
     * @param numeric posicion del arreglo en la que se manda a ejecutar esta funcion.
     */
    public function conformarDireccion(&$array)
    {
        $services = new ConfiguracionGeneralService();
        foreach ($array as $k => $v) {
            if (empty($v['dd_idprovincia'])) {
                continue;
            }
            $mun = $services->getDptDadoArrayIds($v['dd_idmunicipio']);
            $prov = $services->getDptDadoArrayIds($v['dd_idprovincia']);
            $array[$k]['dpt']['mun'] = $mun[0]['denominacion'];
            $array[$k]['dpt']['prov'] = $prov[0]['denominacion'];
        }

        return $array;
    }

    public function crearTablaDin($arr)
    {
        $tbl
            = '<table border="1" cellpadding="0" cellspacing="0" align="center">
             <tr nobr="true">
              <td>No</td>
              <th colspan="2" >NON-BREAKING ROWS</th>
             <th colspan="3">NON-BREAKING ROWS</th>
             </tr>
             <tr nobr="true">
              <td style="writing-mode: tb-rl;">ROW 1<br />COLUMN 1</td>
              <td>ROW 1<br />COLUMN 2</td>
              <td>ROW 1<br />COLUMN 3</td>
             </tr>
             <tr nobr="true">
              <td>ROW 2<br />COLUMN 1</td>
              <td>ROW 2<br />COLUMN 2</td>
              <td>ROW 2<br />COLUMN 3</td>
             </tr>
             <tr nobr="true">
              <td>ROW 3<br />COLUMN 1</td>
              <td>ROW 3<br />COLUMN 2</td>
              <td>ROW 3<br />COLUMN 3</td>
             </tr>
            </table>';
        $this->pdf->writeHTML($tbl, true, false, false, false, '');
    }

    public function save()
    {
        try {
            ob_clean();
            $this->pdf->Output('P3.pdf', 'I');
        } catch (Exception $e) {
            print_r($e);
            die;
        }
    }
}