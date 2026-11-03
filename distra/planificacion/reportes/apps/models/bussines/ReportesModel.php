<?php

class ReportesModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    private $celdas = "padding: 3px;
					line-height: 1.428571429;
					vertical-align: top;
					border-right: 1px solid #000000;
					padding-left: 10px;
					font-family: Arial;
					text-align:left;
					font-size: 12px;
					border-bottom: 1px solid #000;";

    private $firstceldas = "padding: 3px;
					line-height: 1.428571429;
					vertical-align: top;
					border-right: 1px solid #000000;
					padding-left: 10px;
					font-family: Arial;
					text-align:left;
					font-size: 12px;
					border-left: 1px solid #000000;
					border-bottom: 1px solid #000;";

    public function obtenerReporte($params)
    {
        $styles = self::getStyles();
        $header = self::getHeader($params);
        $body = self:: getBody($params);
        $html = "<html><head><meta http-equiv=\"Content-Type\" content=\"text/html;
            charset=UTF-8\"></head><body>
			<div class=\"body\" id=\"page-content\">
			<style type='text/css'>
			" . $styles . "
			@page{/*height:" . $params->altohoja . "cm;
			width:" . $params->anchohoja . "cm;
			size:" . $params->orientacionhoja . ";*/
			margin-right:0px;} </style>
			" . $header . $body . "</div></body></html>";

        return $html;
    }

    public function getHeader($params)
    {

        $denominacion = $params['denominacion'];
        $informe = strtoupper($params['informe']);
        switch ($params['subsistema']) {
            case 'proyecto':
                $observaciones = "";
                if ($params['observaciones']) {
                    $observaciones .= "<h2 style=\"font-family: Arial; font-size: 12px;\">Observaciones: <br>
                                    <table style='padding:5px; border: solid 1px #000000;width: 100%;'>
                                    <tbody>
                                    <td>
                                    " . $params['observaciones'] . "
                                    </td>
                                    </tbody>
                                    </table><br>";
                }
                if ($params['subtitulo']) {
                    $observaciones .= $params['subtitulo'];
                }
                $header = "<div >
						<div style = 'margin-left: 40px; width: 100%;'>

							<h2 style=\"font-family: Arial; font-size: 24px; text-align: center;width: 100%;\"> {$params['informe']} <br>
							    <br>
                                </h2>.
                                {$observaciones}

							</div>
							</div>";
                break;
            case 'inversiones':
                $observaciones = "";
                $organismo = "";
                if ($params['organismo']) {
                    $organismo = "<h2 style=\"font-family: Arial; font-size: 12px;\">Organismo: " . $params['organismo'] . "<br>";
                }
                if ($params['observaciones']) {
                    $observaciones = "<h2 style=\"font-family: Arial; font-size: 12px;\">Observaciones: <br>
                                    <table style='padding:5px; border: solid 1px #000000;'>
                                    <tbody>
                                    <td>
                                    " . $params['observaciones'] . "
                                    </td>
                                    </tbody>
                                    </table><br>";
                }

                $header = "<div >
						<div style = 'margin-left: 40px'>

							<h2 style=\"font-family: Arial; font-size: 12px;\">Ministerio de Economía y Planificación  <br>
							    Dirección de Inversiones <br>
							    <br> <br>
                                " . $params['titulo'] . " <br>
                                " . date('d/m/Y') . "<br>
                                " . $params['hora'] . "<br>
                                <br>
                                <br>
                                </h2>
                                {$observaciones}
                                {$organismo}

							</div>
							</div>";
                break;
            case 'controlaprobaciones':
                $stringaprobacion = "";
                $stringordinario = "";
                if ($params['numero']) {
                    $stringaprobacion = "APROBACI&Oacute;N: " . $params['numero'] . "";
                    $stringordinario = " <br><h4 style=\"font-family: Arial; text-align:right; font-size: 12px;\">
							    Ordinario
                                <br>
                                Ejemplar No._____
                                <br>
                                </h4> ";
                }

                $header = "<div >
						<div class = 'container'>
                            {$stringordinario}
							<h2 style=\"font-family: Arial; text-align:center; font-size: 18px;\">" . $params['responsable'][1] . "  <br>
							    " . $params['responsable'][2] . " <br></h2>
							    <h2 style=\"font-family: Arial; margin-left:20px;  font-size: 18px;\">
							    APROBADO: <br> <br></h2>
							    <h2 style=\"font-family: Arial; text-align:center; font-size: 18px;\">
							    " . $params['responsable'][0] . "
                                <br>
                                <br>
                                </h2>
                                <h2 style=\"font-family: Arial; margin-left:20px;  font-size: 18px;\">
							     {$stringaprobacion} <br>
							    " . $params['entidad'] . "
							    <br></h2>


							</div>
							</div>";
                break;
        }


        return $header;
    }

    public function getBody($params)
    {
        $body = "<div class=\" container\">";
        foreach ($params as $value) {

            switch ($value->tipo) {
                case 'multiheader':
                    $body .= self::getMultiheader($value);
                    break;
                case 'estandar':
                    $body .= self::getEstandar($value);
                    break;
                case 'encabezado_agrupado':
                    $body .= self::getEstandarAgrupado($value);
                    break;
                case 'noborder':
                    $body .= self::getNoborder($value);
                    if ($params['numero']) {
                        $body .= "<br><h4 style=\"font-family: Arial; text-align:left; font-size: 12px;\">
							    Nota: Las cantidades y valores son indicativas y los precios referativos
                                <br>
                                El financiamiento líquido se realizara puntualmente
                                <br>
                                </h4>";
                    }
                    break;
                case 'matriz':
                    $body .= self::getTable($value);
                    break;
                case 'combinada':
                    $body .= self::getTable($value);
                    break;
            }
        }

        $body .= "</div>";
        return $body;
    }

    public function getNoborder($params)
    {
        $table = "<br><table class=\"table\"><tbody>";
        $table .= $this->createHeadersEstandar($params);
        $table .= $this->createBodyNoborder($params);
        $table .= "</tbody></table>";
        return $table;
    }

    public function createBodyNoborder($params)
    {
        $body = '';
        $cambio = false;
        foreach ($params->datos as $pos => $dato) {


            $body .= '<tr>';
            if (is_array($params->referencias)) {
                foreach ($params->referencias as $key => $referencia) {
                    $style = 'line-height: 1.428571429; font-family: Arial;
					text-align:left; font-size: 12px; vertical-align: top; padding-left: 10px; padding-right: 10px;
                    border-right:1px solid; padding-bottom:5px solid;';//$this->celdas;
                    $color = '';
                    $negrita = '';
                    if ($key == 0) {
                        $style = 'font-family: Arial; text-align:left; font-size: 12px;
                        line-height: 1.428571429; padding-left: 10px; padding-right: 10px;
					    vertical-align: top; border-right:1px solid; border-left:1px solid;
                        padding-bottom:5px;';//$this->firstceldas;
                    }
                    if ($dato['negrita']) {
                        $negrita = 'font-weight:bold !important;';
                    }
                    if ($dato['color']) {
                        $color = 'background-color:' . $dato['color'] . ' !important;';
                    }
                    if ($dato['center']) {
                        $style .= 'text-align:center !important;';
                    }
                    if ($dato['right']) {
                        $style .= 'text-align:right !important;';
                    }
                    if ($dato['font-size']) {
                        $style .= 'font-size: ' . $dato['font-size'] . 'px !important;';
                    }

                    $style = $style . $negrita . $color;
                    if ($pos == (count($params->datos) - 1))
                        $style .= ' border-bottom:1px solid; ';

                    if ($dato[$referencia])
                        $body .= "<td style = \"{$style} \">" . $dato[$referencia] . "</td>";
                    else
                        $body .= "<td style = \"{$style} \">" . $params->emptyvalue . "</td>";
                }
            }
            $body .= '</tr>';
        }
        return $body;
    }

    public function getEstandar($params)
    {
        $table = "<br><table id=\"tabladatos\" class=\"table\"><tbody>";
        $table .= $this->createHeadersEstandar($params);
        $table .= $this->createBodyEstandar($params);
        $table .= "</tbody></table>";
        return $table;
    }

  public function getEstandarAgrupado($params)
  {
    $leyenda='';
    if(isset($params->leyenda)){
      $leyenda=$params->leyenda;
    }
    $table = $leyenda;
    $table .= "<br><TABLE id=\"tabladatos\" class=\"table\" CELLSPACING=\"0\" BORDER=\"2\" CELLPADDING=\"3\">";
    $table .= $params->columnas_agrupadas;
    $table .= $this->createBodyEstandar($params);
    $table .= "</TABLE>";
    return $table;
  }

    public function createHeadersEstandar($params)
    {
        $header = '<tr>';
        foreach ($params->columnas as $key => $columnheader) {
            $class = 'columnheaders';
            if ($key == 0) {
                $class = 'firstcolheaders';
            }
            $header .= "<td class = \"" . $class . "\">" . $columnheader . "</td>";
        }
        $header .= '</tr>';
        return $header;
    }

    public function createBodyEstandar($params)
    {
        $body = '';
        foreach ($params->datos as $pos => $dato) {
            if(isset($dato['tr_columna'])){
              $body .= $dato['tr_columna'];
            }else{
              $body .= '<tr>';
              if (is_array($params->referencias)) {
                foreach ($params->referencias as $key => $referencia) {
                  $style = $this->celdas;
                  $color = '';
                  $negrita = '';
                  if ($key == 0) {
                    $style = $this->firstceldas;
                  }
                  if ($dato['negrita']) {
                    $negrita = 'font-weight:bold !important;';
                  }
                  if ($dato['color']) {
                    $color = 'background-color:' . $dato['color'] . ' !important;';
                  }

                  $style = $style . $negrita . $color;
                  if ($dato[$referencia])
                    $body .= "<td style = \"{$style} \">" . $dato[$referencia] . "</td>";
                  else
                    $body .= "<td style = \"{$style} \">" . $params->emptyvalue . "</td>";
                }
              }
              $body .= '</tr>';
            }

        }
        if(isset($params->total_costo_plan)){
          $body .= '<TR><TH align="left" COLSPAN="4">TOTAL:
                          <TH align="center">'.$params->total_costo_plan.
            '<TH align="center"> '.
            '<TH align="center"> '.$params->total_costo_real.
            '<TH align="center"> ';
         }
         if(isset($params->total_costo_normal)){
          $body .= '<TR><TH align="left" COLSPAN="2">TOTAL:
                          <TH align="center">'.$params->total_costo_normal.
                         '<TH align="center"> '.$params->total_costo_limite;
         }
         if(isset($params->total_matriz_elasticidad)){
          $body .= '<TR><TH align="left" COLSPAN="20">TOTAL:
                         <TH align="center"> '.$params->total_matriz_elasticidad;
         }

        return $body;
    }

    public function getMultiheader($params)
    {
        $table = "<br><table class=\"table\"><tbody>";
        $table .= $this->createHeadersMultiheader($params);
        $table .= $this->createBodyMultiheader($params);
        $table .= "</tbody></table>";
        return $table;
    }

    public function createHeadersMultiheader($params)
    {
        $header = '<tr>';
        foreach ($params->encabezados as $pos => $encabezado) {
            $colspan = count($encabezado['columnas']);
            if ($encabezado['colspan'])
                $colspan += $encabezado['colspan'] - 1;
            switch ($encabezado['tipo']) {
                case 'simple':
                case 'colspan':
                    $actual = '';
                    if ($encabezado['actual'] == 'actual' && $encabezado['header'] != '') {
                        $actual = '<b>(EJERCICIO ACTUAL)</b>';
                    }
                    $header .= "<td class =\"titulo" . $encabezado['actual'] . "\" colspan = \" " . $colspan . " \">" . $encabezado['header'] . ' ' . $actual . "</td>";
                    break;
                case 'rowspan':
                    $actual = '';
                    if ($encabezado['actual'] == 'actual' && $encabezado['header'] != '') {
                        $actual = '<b>(EJERCICIO ACTUAL)</b>';
                    }
                    $header .= "<td class =\"titulo" . $encabezado['actual'] . "\" rowspan = \" " . $encabezado['rowspan'] . " \">" . $encabezado['header'] . ' ' . $actual . "</td>";
                    break;
            }
        }
        $header .= '</tr><tr>';
        $doble = false;
        foreach ($params->encabezados as $pos => $encabezado) {
            switch ($encabezado['tipo']) {
                case 'simple':
                    foreach ($encabezado['columnas'] as $key => $columnheader) {
                        $class = 'columnheaders';
                        if ($key == 0) {
                            $class = 'firstcolheaders';
                        }
                        if ($encabezado['rowspan'])
                            $header .= "<td rowspan = \" " . $encabezado['rowspan'] . "\" class = \"" . $class . "\">" . $columnheader . "</td>";
                        else
                            $header .= "<td class = \"" . $class . "\">" . $columnheader . "</td>";
                    }
                    break;
                case 'colspan':
                    $doble = true;
                    foreach ($encabezado['columnas'] as $key => $columnheader) {
                        $class = 'columnheaders';
                        if ($key == 0) {
                            $class = 'firstcolheaders';
                        }
                        if ($key == $encabezado['columnadoble'])
                            $header .= "<td colspan = \" " . $encabezado['colspan'] . "\" class = \"" . $class . "\">" . $columnheader . "</td>";
                        else
                            $header .= "<td rowspan = \" " . $encabezado['rowspan'] . "\" class = \"" . $class . "\">" . $columnheader . "</td>";
                    }
                    break;
            }

        }

        $header .= '</tr>';

        if ($doble) {
            $header .= '<tr>';
            foreach ($params->encabezados as $pos => $encabezado) {
                switch ($encabezado['tipo']) {
                    case 'colspan':
                        foreach ($encabezado['columnas'] as $key => $columnheader) {
                            $class = 'columnheaders';
                            if ($key == 0) {
                                $class = 'firstcolheaders';
                            }
                            if ($key == $encabezado['columnadoble']) {
                                foreach ($encabezado['colspancolumns'] as $columna) {
                                    $header .= "<td class = \"" . $class . "\">" . $columna . "</td>";
                                }
                            }
                        }
                        break;
                }

            }
            $header .= '</tr>';
        }
        return $header;

    }

    public function createBodyMultiheader($params)
    {
        $body = '';
        $datos = $params->datos;
        foreach ($datos as $dato) {
            $body .= '<tr>';
            foreach ($params->encabezados as $pos => $encabezado) {
                switch ($encabezado['tipo']) {
                    case 'simple':
                    case 'rowspan':
                        if (is_array($encabezado['referencias'])) {
                            foreach ($encabezado['referencias'] as $key => $referencia) {
                                $style = $this->celdas;
                                $color = '';
                                $negrita = '';
                                if ($key == 0) {
                                    $style = $this->firstceldas;
                                }
                                if ($dato['negrita']) {
                                    $negrita = 'font-weight:bold !important;';
                                }
                                if ($dato['color']) {
                                    $color = 'background-color:' . $dato['color'] . ' !important;';
                                }
                                if ($dato['center']) {
                                    $style .= 'text-align:center !important;';
                                }

                                $style = $style . $negrita . $color;

                                if ($encabezado['inside']) {
                                    if ($dato[$encabezado['inside']][$referencia])
                                        $body .= "<td style = \"{$style} \">" . $dato[$encabezado['inside']][$referencia] . "</td>";
                                    else
                                        $body .= "<td style = \"{$style} \">" . $encabezado['emptyvalue'] . "</td>";
                                } else {
                                    if ($dato[$referencia])
                                        $body .= "<td style = \"{$style} \">" . $dato[$referencia] . "</td>";
                                    else
                                        $body .= "<td style = \"{$style} \">" . $encabezado['emptyvalue'] . "</td>";
                                }

                            }
                        }
                        break;
                    case 'colspan':
                        if (is_array($encabezado['referencias'])) {
                            foreach ($encabezado['referencias'] as $key => $referencia) {
                                $style = $this->celdas;
                                $color = '';
                                $negrita = '';
                                if ($key == 0) {
                                    $style = $this->firstceldas;
                                }
                                if ($dato['negrita']) {
                                    $negrita = 'font-weight:bold !important;';
                                }
                                if ($dato['color']) {
                                    $color = 'background-color:' . $dato['color'] . ' !important;';
                                }

                                $style = $style . $negrita . $color;
                                if ($key == $encabezado['columnadoble']) {
                                    foreach ($encabezado['colspanreferencias'] as $refercolspan) {
                                        if ($dato[$refercolspan])
                                            $body .= "<td style = \"{$style} \">" . $dato[$refercolspan] . "</td>";
                                        else
                                            $body .= "<td style = \"{$style} \">" . $encabezado['emptyvalue'] . "</td>";
                                    }
                                } else {
                                    if ($encabezado['inside']) {
                                        if ($dato[$encabezado['inside']][$referencia])
                                            $body .= "<td style = \"{$style} \">" . $dato[$encabezado['inside']][$referencia] . "</td>";
                                        else
                                            $body .= "<td style = \"{$style} \">" . $encabezado['emptyvalue'] . "</td>";
                                    } else {
                                        if ($dato[$referencia])
                                            $body .= "<td style = \"{$style} \">" . $dato[$referencia] . "</td>";
                                        else
                                            $body .= "<td style = \"{$style} \">" . $encabezado['emptyvalue'] . "</td>";
                                    }
                                }
                            }
                        }
                        break;

                }
            }


            $body .= '</tr>';
        }


        return $body;
    }

    /* public function getBody($params){
         $body = "<div class=\" container\">";

         foreach ($params as $value) {

             switch ($value->tipo){
                 case 'estandar':
                 case 'multi-estandar':
                 case 'group-estandar':
                 case 'multi-header':
                 case 'descripcion':
                 case 'combinada':
                 case 'matriz':
                 case 'tree':
                     $body .= self::getTable($value);
                     break;

                 case 'diagrama':
                     $body .= self::getDiagram($value);
                     break;

                 case 'resumen':
                     $body .= self::getResumen($value);
                     break;

                 case 'image':
                 case 'leyenda-image':
                     $body .= self::getImageBase64($value);
                     break;

                 case 'epigrafe':
                     $body .= self::getEpigrafe($value);
                     break;

                 case 'html':
                     $body .= self::getHTML($value);
                     break;
             }
         }

         $body.="</div>";
         return $body;
     }*/

    public function createTableHeader($columnas = array(), $titulo = '')
    {

        return "<tbody> <tr>
                    <td class =\"titulo\" colspan = \" " . count($columnas) . " \">
			        <b style=\"padding: 5px 5px; font-size: 16px; color: #FFF; font-family: Arial; line-height: 1.42857;\">" . $titulo . "</b>
			        </td></tr></tbody>";
    }

    public function createRow($dato = null, $referencia = array(), $_unidad = array())
    {

        $content = '';

        if ($dato) {

            foreach ($referencia as $pos => $reference) {
                $cont = 0;
                $bordeizq = 'celdas';
                if ($pos == 0) {
                    $bordeizq = "firstceldas";
                }
                foreach ($dato as $key => $valor) {
                    $valor = is_float($valor) ? round($valor, 2) : $valor;

                    if ($reference == $key) {
                        $cont += 1;
                        $unidad = '';
                        if ($_unidad) {
                            $unidad = explode('&', $_unidad[$pos]);
                            if (count($unidad) > 1) {
                                $unidad = $unidad[1];
                            } else {
                                $unidad = $dato[$unidad[0]];
                            }
                        }
                        $content .= "<td class = \"{$bordeizq} \">" . $valor . " " . $unidad . "</td>";
                    }
                }
                if ($cont == 0) {
                    $content .= "<td class = \"{$bordeizq}\"></td>";
                }
            }

        } else {
            $content .= "<td class = \"firstceldas\"></td>";
        }

        return $content;
    }

    public function createTableColumns($columnas = array(), $group = null, $cantidad = 0)
    {

        $content = "<tr>";

        if (!$group) {

            foreach ($columnas as $p => $nombrecolumna) {
                $bordeizq = 'columnheaders';
                if ($p == 0) {
                    $bordeizq = 'firstcolheaders';
                }
                $content .= "<td class =\"" . $bordeizq . "\" >" . $nombrecolumna . "</td>";
            }

        } else {
            $label = $group . ' (' . $cantidad . ')';
            $content .= "<td class =\"firstcolheaders-group\" colspan = \" " . count($columnas) . " \" >" . $label . "</td>";
        }

        $content .= "</tr>";

        return $content;
    }

    public function createTableData($datos = array(), $referencia = array(), $_unidad = array())
    {

        $content = '';

        if (count($datos) > 0) {
            foreach ($datos as $p => $dato) {
                $content .= "<tr>";
                $content .= $this->createRow($dato, $referencia, $_unidad);
                $content .= "</tr>";
            }
        } else {
            $content .= "<tr><td class = \"celdas firstceldas\" colspan = \" " . count($referencia) . " \">
                <b style=\"padding: 2px 2px; font-size: 12px; color: #FFF; font-family: Arial; line-height: 1.42857;\">" . ' ' . "</b>
                </td></tr>";
        }

        return $content;
    }

    public function createTableEstandar($params)
    {

        $content = '';
        $content .= $this->createTableHeader($params->columnas, $params->encabezado);
        $content .= $this->createTableColumns($params->columnas);
        $content .= $this->createTableData($params->datos, $params->referencia, $params->unidad);

        return $content;
    }


    public function createTableMultiEstandar($params)
    {

        $content = "<table class=\"table\" ><tbody>";

        foreach ($params->datos as $item) {
            $content .= $this->createTableEstandar($item);
        }

        $content .= "</tbody></table>";

        return $content;
    }

    public function createTableGroupEstandar($params)
    {

        $content = "<table class=\"table\" >";

        $content .= $this->createTableHeader($params->columnas, $params->encabezado);
        $content .= $this->createTableColumns($params->columnas);

        $groups = array();

        foreach ($params->datos as $item) {
            $groups[$item[$params->groupReferent]]['rows'] .= "<tbody><tr>" . $this->createRow($item, $params->referencia, $params->unidad) .
                "</tr></tbody>";
            $groups[$item[$params->groupReferent]]['count'] = $groups[$item[$params->groupReferent]]['count'] ?
                $groups[$item[$params->groupReferent]]['count'] + 1 : 1;
        }

        foreach ($params->groups as $group) {

            if ($groups[$group]) {
                $content .= $this->createTableColumns($params->columnas, $group, $groups[$group]['count']);
                $content .= $groups[$group]['rows'];
            } else {
                $content .= "<tr><td class = \"celdas firstceldas\" colspan = \" " . count($params->referencia) . " \">
                <b style=\"padding: 2px 2px; font-size: 12px; color: #FFF; font-family: Arial; line-height: 1.42857;\">" . ' ' . "</b>
                </td></tr></tbody>";
            }
        }

        $content .= "</table>";
        return $content;
    }

    public function createTableMultiHeader($params)
    {

        $content = "<table class=\"table\" >";

        foreach ($params->datos as $item) {
            $content .= $this->createTableHeader($item->datos[0]->columnas, $item->encabezado);
            foreach ($item->datos as $item1) {
                $content .= $this->createTableColumns($item1->columnas);
                $content .= $this->createTableData($item1->datos, $item1->referencia, $item1->unidad);
            }
        }
        $content .= "</table>";
        return $content;
    }

    public function createTreeTable($params)
    {

        $content = "<table class=\"table\" >";

        $level = 0;

        foreach ($params->datos as $item) {
            $this->createTreeDataTable($item, $params->columnas, $params->order, $params->referencia,
                $params->unidad = null, $level, $content);
        }

        $content .= "</table>";
        return $content;
    }

    public function createTreeDataTable($item, $columns, $order, $referent,
                                        $unit = null, & $level, & $content)
    {

        if (!$item['children']) {

            $data = $this->createTableColumns($columns);
            $data .= $this->createTableData($item, $referent, $unit);
            $content = $data . $content;

        } else {
            $header = 'Denominacion';

            if ($order[$level]) {
                $header = $order[$level];
            }

            $data = $this->createTableColumns($columns);
            $data .= $this->createTableData($item, $referent, $unit);
            $data .= $this->createTableHeader($columns, $header);
            $content = $data . $content;


            $this->createTreeDataTable($item, $columns, $order,
                $referent, $unit, $level);
        }


    }

    public function getTable($params)
    {

        $table = "";

        switch ($params->tipo) {
            case 'estandar':
                $table = "<table class=\"table\"><tbody>";
                $table .= $this->createTableEstandar($params);
                $table .= "</tbody></table>";
                break;
            case 'multi-estandar':

                $table .= $this->createTableMultiEstandar($params);

                break;
            case 'group-estandar':

                $table .= $this->createTableGroupEstandar($params);

                break;
            case 'multi-header':

                $table .= $this->createTableMultiHeader($params);

                break;

            case 'tree':

                $table .= $this->createTreeTable($params);

                break;

            case 'descripcion':
                /*Se construye ahora cada tupla de datos para la tabla*/
                $table .= "<table class=\"table\" >
						<tbody>
                        <tr>
                        <td class =\"titulo\" colspan = \" " . count($params->columnas) . " \">
			  <b style=\"padding: 5px 5px; font-size: 16px; color: #FFF; font-family: Arial; line-height: 1.42857;\">" . $params->encabezado . "</b>
			  </td></tr><tr>";
                /*Para construir el encabezado de la tabla según las columnas*/
                foreach ($params->columnas as $p => $nombrecolumna) {
                    $bordeizq = 'columnheaders';
                    if ($p == 0) {
                        $bordeizq = 'firstcolheaders';
                    }

                    $table .= "<td class=\"{$bordeizq}\">" . $nombrecolumna . "</td>";
                }
                $table .= "</tr></tbody><tbody>";

                /*Se construye ahora cada tupla de datos para la tabla*/
                foreach ($params->datos as $dato) {
                    $table .= "<tr>";

                    foreach ($params->referencia as $p => $reference) {
                        $bordeizq = 'celdas';
                        if ($p == 0) {
                            $bordeizq = 'firstceldas';
                        }
                        foreach ($dato as $key => $valor) {
                            $valor = is_float($valor) ? round($valor, 2) : $valor;

                            if ($reference == $key) {
                                $table .= "<td class =\"{$bordeizq}\">" . $valor . "</td>";
                            }
                        }

                    }
                    $table .= "</tr>";

                    $table .= "<tr><td style =\"border-left: 1px solid #000000 ; border-right: 1px solid #000000 ;
                                padding: 0 !important;\" colspan = \" " . count($params->columnas) . " \">
					<div style=\"min-height: 20px;
								  padding: 10px;
								  border: 1px solid #e3e3e3;
								  font-family: Arial;
								  font-size: 12px;
								  border-bottom: 2px solid #000;
								 \">
					<h4 style=\"font-size: 13px; font-family: Arial; margin-top:-8px !important; margin-bottom:7px !important;\">" . $params->nombredescripcion . ":</h4>" . $dato['descripcion'] . "</div></td></tr>";

                }
                $table .= "</tbody></table>";


                break;
            case 'matriz':
                $table .= "<table class=\"table\" >
						<tbody>
                        <tr>
                        <td class =\"titulo\" colspan = \" " . count($params->columnas) . " \">
			  <b style=\"padding: 5px 5px; font-size: 16px; color: #FFF; font-family: Arial; line-height: 1.42857;\">" . $params->encabezado . "</b>
			  </td></tr><tr>";
                /*Para construir el encabezado de la tabla según las columnas*/
                foreach ($params->columnas as $p => $nombrecolumna) {
                    $bordeizq = 'columnheaders';
                    if ($p == 0) {
                        $bordeizq = 'firstcolheaders';
                    }
                    $table .= "<td class=\"{$bordeizq}\">" . $nombrecolumna . "</td>";
                }
                $table .= "</tr></tbody><tbody>";
                /*Se construye ahora cada tupla de datos para la tabla*/
                foreach ($params->datos as $p => $dato) {
                    $table .= "<tr style=\"height:30px\">";

                    foreach ($params->referencia as $pos => $reference) {
                        $bordeizq = 'celdas';
                        /*if ($p == 0) {
                            $bordeizq = 'firstceldas';
                        }*/
                        $cont = 0;
                        foreach ($dato as $key => $valor) {
                            $valor = is_float($valor) ? round($valor, 2) : $valor;

                            if ($reference == $key) {
                                $cont += 1;
                                if ($pos == 0) {
                                    $bordeizq = 'firstceldascolor';
                                    $table .= "<td class =\"{$bordeizq}\"><b>" . $valor . "</b></td>";
                                } else {

                                    if (trim($valor) == '&') {
                                        $bordeizq = "celdascolor";
                                        $valor = '';
                                    }


                                    $table .= "<td class =\"{$bordeizq}\">" . $valor . "</td>";
                                }

                            }
                        }
                        if ($cont == 0) {
                            $valor = "";
                            $table .= "<td class =\"{$bordeizq}\">" . $valor . "</td>";
                        }

                    }

                    $table .= "</tr>";
                }
                $table .= "</tbody></table>";
                break;
            case'combinada':
                $cantidadcolumnas = (count($params->columnas) * count($params->columnasActos))
                    + count($params->columnasExtra[0]['inicio']) + count($params->columnasExtra[0]['fin']);
                $table .= "<table class=\"table\" >
						<thead>
                        <tr>
                        <th class =\"titulo\" colspan = \" " . $cantidadcolumnas . " \">
			  <b style=\"padding: 5px 5px; font-size: 16px; color: #FFF; font-family: Arial; line-height: 1.42857;\">" . $params->encabezado . "</b>
			  </th></tr><tr>";
                $cont = 0;
                foreach ($params->columnasExtra[0]['inicio'] as $pos => $extra) {
                    $bordeizq = 'columnheaders';
                    if ($cont == 0) {
                        $cont = 1;
                        $bordeizq = 'firstcolheaders';
                    }
                    $table .= "<th class =\"" . $bordeizq . "\" ></th>";

                }
                foreach ($params->columnasActos as $acto) {
                    $bordeizq = 'columnheaders';
                    if ($cont == 0) {
                        $cont = 1;
                        $bordeizq = 'firstcolheaders';
                    }
                    $table .= "<th class =\"" . $bordeizq . "\" colspan = \"" . $params->colspan . "\" >" . $acto . "</th>";
                }
                foreach ($params->columnasExtra[0]['fin'] as $pos => $extra) {
                    $bordeizq = 'columnheaders';
                    if ($cont == 0) {
                        $cont = 1;
                        $bordeizq = 'firstcolheaders';
                    }
                    $table .= "<th class =\"" . $bordeizq . "\" ></th>";
                }
                $table .= "</tr><tr>";

                $cont = 0;
                foreach ($params->columnasExtra[0]['inicio'] as $pos => $extra) {
                    $bordeizq = 'columnheaders';
                    if ($cont == 0) {
                        $cont = 1;
                        $bordeizq = 'firstcolheaders';
                    }
                    $table .= "<th class =\"" . $bordeizq . "\" >" . $extra . "</th>";
                }

                foreach ($params->columnasActos as $acto) {
                    $bordeizq = 'columnheaders';
                    if ($cont == 0) {
                        $cont = 1;
                        $bordeizq = 'firstcolheaders';
                    }
                    foreach ($params->columnas as $columna) {
                        $table .= "<th class =\"" . $bordeizq . "\">" . $columna . "</th>";
                    }
                }
                foreach ($params->columnasExtra[0]['fin'] as $pos => $extra) {
                    $bordeizq = 'columnheaders';
                    if ($cont == 0) {
                        $cont = 1;
                        $bordeizq = 'firstcolheaders';
                    }
                    $table .= "<th class =\"" . $bordeizq . "\" >" . $extra . "</th>";
                }
                $table .= "</tr>";
                $table .= "</thead><tbody>";
                foreach ($params->datos as $p => $dato) {
                    $table .= "<tr>";
                    $cont = 0;
                    foreach ($params->referenciaExtra[0]['inicio'] as $pos => $extra) {
                        $bordeizq = 'celdas';
                        if ($cont == 0) {
                            $cont = 1;
                            $bordeizq = 'firstceldas';
                        }
                        $table .= "<td class =\"" . $bordeizq . "\" >" . $dato[$extra] . "</td>";
                    }

                    foreach ($params->idActos as $idacto) {
                        $bordeizq = 'celdas';
                        if ($cont == 0) {
                            $cont = 1;
                            $bordeizq = 'firstceldas';
                        }
                        foreach ($params->referencia as $referencia) {
                            $table .= "<td class =\"" . $bordeizq . "\">" . $dato[$referencia . $idacto] . "</td>";
                        }
                    }
                    foreach ($params->referenciaExtra[0]['fin'] as $pos => $extra) {
                        $bordeizq = 'celdas';
                        if ($cont == 0) {
                            $cont = 1;
                            $bordeizq = 'firstceldas';
                        }
                        $table .= "<td class =\"" . $bordeizq . "\" >" . $dato[$extra] . "</td>";
                    }
                    $table .= "</tr>";
                }
                $table .= "</tbody></table>";
                break;
            case 'arbol':
                $table .= "<table class=\"table\" >
						<tbody>
                        <tr>
                        <td class =\"titulo\" colspan = \" " . count($params->columnas) . " \">
			  <b style=\"padding: 5px 5px; font-size: 16px; color: #FFF; font-family: Arial; line-height: 1.42857;\">" . $params->encabezado . "</b>
			  </td></tr><tr>";
                /*Para construir el encabezado de la tabla según las columnas*/
                foreach ($params->columnas as $p => $nombrecolumna) {
                    $bordeizq = 'columnheaders';
                    if ($p == 0) {
                        $bordeizq = 'firstcolheaders';
                    }
                    $table .= "<td class=\"{$bordeizq}\">" . $nombrecolumna . "</td>";
                }
                $table .= "</tr></tbody><tbody>";

                foreach ($params->datos as $dato) {
                    $table .= "<tr>";

                    foreach ($params->referencia as $p => $reference) {
                        $bordeizq = 'celdas';
                        if ($p == 0) {
                            $bordeizq = 'firstceldas';
                        }
                        foreach ($dato as $key => $valor) {
                            if ($reference == $key) {
                                $table .= "<td class =\"{$bordeizq}\">" . $valor . "</td>";
                            }
                            $table .= $this->drawChildrens($params);
                        }

                    }
                }
                break;
        }
        $table .= "<br><br>";

        return $table;
    }

    public function getDiagram($params)
    {
        $div = "<div id = $params->chartid style='height: 600px'> </div>";
        return $this->getContainer($params->encabezado, $div);
    }

    public function getResumen($params)
    {

        $div = "<div style=\"min-height: 20px;
								  padding: 10px;
								  font-family: Arial;
								  font-size: 12px;
								 \">
					" . $params->datos . "</div>";


        return $this->getContainer($params->encabezado, $div);

    }

    public function getImageBase64($params)
    {

        switch ($params->tipo) {
            case 'image':
                $body = "<div><img src = $params->image /> </div>";
                break;
            case 'leyenda-image':

                $leyenda = $params->image[0];
                $image = $params->image[1];

                $body = "<td style = \" width: 20%;\">
                        <img src = $leyenda /> </td >";
                $body .= "<td style = \" width: 70%;\">
                        <img src = $image /></td>";
                break;
        }
        return $this->getContainer($params->encabezado, $body, true);
    }

    public function getHTML($params)
    {
        return $this->getContainer($params->encabezado, $params->datos, false);
    }

    public function getContainer($header, $body, $leyend = null)
    {

        $container = '';
        $container = "<table class=\"table\" >
						<thead class=\"thead\">
                        <tr>
                        <th class =\"titulo\" colspan = 2>
			  <b style=\"padding: 5px 5px; font-size: 16px; color: #FFF; font-family: Arial; line-height: 1.42857;\">" . $header . "</b>
			  </th></tr></thead><tbody>";

        if ($leyend == true) {
            $container .= "<tr style =\"border: 1px solid #000000 !important;\">" . $body . "</tr>";
        } else {
            $container .= "<tr><td style =\"border: 1px solid #000000 ; !important;\" colspan = 1> " . $body . "</td></tr>";
        }

        $container .= "</tbody></table>";

        return $container;

    }

    public function getEpigrafe($params)
    {

        $epigrafe = '';

        switch ($params->variante) {

            case 'h2':
                $epigrafe = "<h4 style=\"font-family: Arial; font: bold; font-size: 14px; padding-bottom: 1.5px\">$params->text</h4>";
                break;

            case 'h4':
                $epigrafe = "<h4 style=\"font-family: Arial; font-size: 14px;\">$params->text</h4>";
                break;
        }
        return $epigrafe;
    }

    public function getStyles()
    {
        $stylestag = '';
        $stylestag .= "


			h4{
				margin-top:-8px !important;
				margin-bottom:7px !important;
			}

			.well {
			  min-height: 20px;
			  padding: 10px;
			  background-color: #f5f5f5;
			  border: 1px solid #e3e3e3;
			  border-bottom: 2px solid #000;
			  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
					  box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.05);
			}

			.well blockquote {
			  border-color: #ddd;
			  border-color: rgba(0, 0, 0, 0.15);
			}

			.well-lg {
			  padding: 24px;
			  border-radius: 6px;
			}

			.well-sm {
			  padding: 9px;
			  border-radius: 3px;
			}

			.body {
			  font-family: \"Helvetica Neue\", Helvetica, Arial, sans-serif;
			  font-size: 11px;
			  line-height: 1.428571429;
			  color: #333333;
			  background-color: #ffffff;
			}

			.actual{
			    background-color: #CC7302 !important;
			}


			.table {
				margin-bottom: 1rem;
				max-width: 100%;
				width: 100%;
				background-color: transparent;
				border-collapse: collapse;
				border-spacing: 0;
			}

			.thead {
				display: table-header-group;
				text-align:left;
                border-bottom: 1px solid #000000;
                font-size: 14px;
                color: #000000;
                background-color: rgba(92, 87, 87, 0.6);
			  }

				
				.titulo{
					  padding: 5px 5px;
					  border-bottom-right-radius: 0px;
					  border-bottom-left-radius: 0px;
					  color: #ffffff;
					  background-color: #3B3636;
					  border-color: trasparent !important;
					  margin-top: 0;
					  text-align: center;
					  margin-bottom: 0;
					  border: 1px solid #000000 ;
					  /*border-left: 1px solid #000000 ;*/
					  font-size: 16px;
				}

				.tituloactual{
					  padding: 5px 5px;
					  border-bottom-right-radius: 0px;
					  border-bottom-left-radius: 0px;
					  color: #000000;
					  background-color: #FF9A02;
					  border-color: trasparent !important;
					  margin-top: 0;
					  text-align: left;
					  margin-bottom: 0;
					  border: 1px solid #000000 ;
					  /*border-left: 1px solid #000000 ;*/
					  font-size: 16px;
				}
				
				.celdas {
					padding: 3px;
					line-height: 1.428571429;
					vertical-align: top;
					border-right: 1px solid #000000;
					padding-left: 10px;
					font-family: Arial;
					text-align:left;
					font-size: 12px;
					border-bottom: 1px solid #000;
				}
				
				.celdascolor{
					padding: 3px;
					line-height: 1.428571429;
					vertical-align: top;
					border-right: 1px solid #000000;
					padding-left: 10px;
					text-align:left;
					font-family: Arial;
					font-size: 12px;
					border-bottom: 1px solid #000;
					background-color: #9D9898;
				}
				
				.firstceldas {
					padding: 3px;
					line-height: 1.428571429;
					vertical-align: top;
					border-right: 1px solid #000000;
					padding-left: 10px;
					font-family: Arial;
					text-align:left;
					font-size: 12px;
					border-left: 1px solid #000000;
					border-bottom: 1px solid #000;
				}


				
				.firstceldascolor {
					padding: 3px;
					line-height: 1.428571429;
					vertical-align: top;
					border-right: 1px solid #000000;
					padding-left: 10px;
					font-family: Arial;
					text-align:left;
					font-size: 12px;
					border-left: 1px solid #000000;
					border-bottom: 1px solid #000;
					border-left: 1px solid #000000;
					background-color: #AEA9A9;
				}
				
				.columnheaders
				{
				padding: 3px;
				 line-height: 1.428571429;
				 vertical-align: top;
				 border-right: 1px solid #000000;
				 border-top: 1px solid #000000;
				 padding-left: 10px !important;
				 background-color: #AEA9A9;
				font-family: Arial;
				text-align: left;
				border-bottom: 1px solid #000000;
				font-size: 14px;
				color: #000000;
				}
				
				.firstcolheaders
				{
				padding: 3px;
				 line-height: 1.428571429;
				 vertical-align: top;
				 border-right: 1px solid #000000;
				 border-top: 1px solid #000000;
				 padding-left: 10px !important;
				 background-color: #AEA9A9;
				font-family: Arial;
				text-align: left;
				border-bottom: 1px solid #000000;
				font-size: 14px;
				color: #000000;
				border-left: 1px solid #000000;
				}

				.firstcolheaders-group
				{
                padding: 3px;
				 line-height: 1.428571429;
				 vertical-align: top;
				 border-right: 1px solid #000000;
				 padding-left: 10px !important;
				background-color: #FFF;
				font-family: Arial;
				text-align: left;
				border-bottom: 2px solid #000000;
				font-size: 12px;
				color: #000000;
				border-left: 1px solid #000000;

				}
				
				.bordeizq {
				 border-left: 1px solid #000000;
				}


				.descripcion {
					padding: 0 !important;
				}

			.container {
			    padding-right: 35px;
			    padding-left: 35px;
			    margin-right: auto;
			    margin-left: auto;
			}

			.containertable {
			    padding-right: 35px;
			    padding-left: 35px;
			    margin-right: auto;
			    margin-left: auto;
			}

			.header {
			    padding: 40px 15px;
			    text-align: center;
			}
			.estrecho > thead > tr > th{
				padding: 2px !important;
				line-height: 1.428571429;
				vertical-align: top;
				border-top: 1px solid #dddddd;
			}

			.estrecho > tbody > tr > td{
				padding: 10px !important;
			}
			.estrecho {
				width: 100% !important;
			}


			.panel {
                margin-bottom: 20px;
                background-color: #ffffff;
                border: 1px solid #000000 !important;
                border-radius: 4px;
                -webkit-box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);
                box-shadow: 0 1px 1px rgba(0, 0, 0, 0.05);

			}

			.panel-body {
                padding: 15px;
			}

			.panel-body:before,
			.panel-body:after {
                display: table;
                content: \" \";
			}

			.panel-body:after {
                clear: both;
			}

			.panel-body:before,
			.panel-body:after {
                display: table;
			    content: \" \";
			}

			.panel-body:after {
			    clear: both;
			}

			.panel > .list-group {
			    margin-bottom: 0;
			}

			.panel > .list-group .list-group-item {
			    border-width: 1px 0;
			}

			.panel > .list-group .list-group-item:first-child {
			    border-top-right-radius: 0;
			    border-top-left-radius: 0;
			}

			.panel > .list-group .list-group-item:last-child {
			    border-bottom: 0;
			}

			.panel-heading + .list-group .list-group-item:first-child {
			    border-top-width: 0;
			}

			.panel > .table,
			.panel > .table-responsive > .table {
			    margin-bottom: 0;
			}

			.panel > .table > tbody:first-child th,
			.panel > .table > tbody:first-child td {
			    border-top: 0;
			}

			.panel > .table-bordered,
			.panel > .table-responsive > .table-bordered {
			    border: 0;
			}

			.panel > .table-bordered > thead > tr > th:first-child,
			.panel > .table-responsive > .table-bordered > thead > tr > th:first-child,
			.panel > .table-bordered > tbody > tr > th:first-child,
			.panel > .table-responsive > .table-bordered > tbody > tr > th:first-child,
			.panel > .table-bordered > tfoot > tr > th:first-child,
			.panel > .table-responsive > .table-bordered > tfoot > tr > th:first-child,
			.panel > .table-bordered > thead > tr > td:first-child,
			.panel > .table-responsive > .table-bordered > thead > tr > td:first-child,
			.panel > .table-bordered > tbody > tr > td:first-child,
			.panel > .table-responsive > .table-bordered > tbody > tr > td:first-child,
			.panel > .table-bordered > tfoot > tr > td:first-child,
			.panel > .table-responsive > .table-bordered > tfoot > tr > td:first-child {
			    border-left: 0;
			}

			.panel > .table-bordered > thead > tr > th:last-child,
			.panel > .table-responsive > .table-bordered > thead > tr > th:last-child,
			.panel > .table-bordered > tbody > tr > th:last-child,
			.panel > .table-responsive > .table-bordered > tbody > tr > th:last-child,
			.panel > .table-bordered > tfoot > tr > th:last-child,
			.panel > .table-responsive > .table-bordered > tfoot > tr > th:last-child,
			.panel > .table-bordered > thead > tr > td:last-child,
			.panel > .table-responsive > .table-bordered > thead > tr > td:last-child,
			.panel > .table-bordered > tbody > tr > td:last-child,
			.panel > .table-responsive > .table-bordered > tbody > tr > td:last-child,
			.panel > .table-bordered > tfoot > tr > td:last-child,
			.panel > .table-responsive > .table-bordered > tfoot > tr > td:last-child {
			  border-right: 0;
			}

			.panel > .table-bordered > thead > tr:last-child > th,
			.panel > .table-responsive > .table-bordered > thead > tr:last-child > th,
			.panel > .table-bordered > tbody > tr:last-child > th,
			.panel > .table-responsive > .table-bordered > tbody > tr:last-child > th,
			.panel > .table-bordered > tfoot > tr:last-child > th,
			.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > th,
			.panel > .table-bordered > thead > tr:last-child > td,
			.panel > .table-responsive > .table-bordered > thead > tr:last-child > td,
			.panel > .table-bordered > tbody > tr:last-child > td,
			.panel > .table-responsive > .table-bordered > tbody > tr:last-child > td,
			.panel > .table-bordered > tfoot > tr:last-child > td,
			.panel > .table-responsive > .table-bordered > tfoot > tr:last-child > td {
			  border-bottom: 0;
			}

			.panel > .table-responsive {
			  margin-bottom: 0;
			  border: 0;
			}

			.panel-heading {
			  padding: 5px 5px;
			  /*border-bottom: 2px solid #000;
			  border-top-right-radius: 3px;
			  border-top-left-radius: 3px;*/
			  border-bottom-right-radius: 0px;
			  border-bottom-left-radius: 0px;
			}

			.panel-title {
			  margin-top: 0;
			  margin-bottom: 0;
			  font-size: 16px;
			  color: inherit;
			}

			.panel-footer {
			  padding: 10px 15px;
			  background-color: #f5f5f5;
			  border-top: 1px solid #dddddd;
			  border-bottom-right-radius: 3px;
			  border-bottom-left-radius: 3px;
			}

			.panel-group .panel-heading + .panel-collapse .panel-body {
			  border-top: 1px solid #dddddd;
			}

			.panel-group .panel-footer {
			  border-top: 0;
			}

			.panel-default {
			  border-color: #dddddd;
			}

			.panel-default > .panel-heading {
                 color: #ffffff;
                 background-color: #3B3636;
                 border-color: trasparent !important;
                }

			.panel-primary > .panel-heading {
			  color: #ffffff;
			  background-color: #428bca;
			  border-color: #428bca;
			}

			.panel-primary > .panel-heading + .panel-collapse .panel-body {
			  border-top-color: #428bca;
			}

			.panel-primary > .panel-footer + .panel-collapse .panel-body {
			  border-bottom-color: #428bca;
			}

			.panel-success {
			  border-color: #d6e9c6;
			}

			.panel-success > .panel-heading {
			  color: #3c763d;
			  background-color: #dff0d8;
			  border-color: #d6e9c6;
			}

			.panel-success > .panel-heading + .panel-collapse .panel-body {
			  border-top-color: #d6e9c6;
			}

			.panel-success > .panel-footer + .panel-collapse .panel-body {
			  border-bottom-color: #d6e9c6;
			}

			.panel-info {
			  border-color: #bce8f1;
			}

			.panel-info > .panel-heading {
			  color: #31708f;
			  background-color: #d9edf7;
			  border-color: #bce8f1;
			}

			.panel-info > .panel-heading + .panel-collapse .panel-body {
			  border-top-color: #bce8f1;
			}

			.panel-info > .panel-footer + .panel-collapse .panel-body {
			  border-bottom-color: #bce8f1;
			}

		";


        return $stylestag;
    }

    public function drawChildrens($parametros)
    {
        $html = '';

    }

}

