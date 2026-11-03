<?php

class CarteraproductosModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarCarteraProductos($params) {
        $result = Carteraproductos::listarCarteraProductos($params);
        return $result;
    }

    public function exportarCarteraProductos($params) {
        //Ajustando los parámetros de los filtros al formato 'listar'
        $nuevos_filtros = [];
        foreach ($params['filtros'] as $filtro) {
            $obj_filtro['field'] = $filtro->field;
            $obj_filtro['data']['type'] = $filtro->data->type;
            if ($obj_filtro['data']['type'] == 'numeric') {
                $obj_filtro['data']['comparison'] = $filtro->data->comparison;
            }
            if ($obj_filtro['data']['type'] == 'list') {
                $obj_filtro['data']['value'] = $filtro->data->value[0];
            } else {
                $obj_filtro['data']['value'] = $filtro->data->value;
            }
            $nuevos_filtros[] = $obj_filtro;
        }
        $params['filtros'] = $nuevos_filtros;
        //Fin de los filtros
        //Simulando stores para hacer render
        //UM
        $params['array_um'] = array();

        foreach ($params['um'] as $valorUM) {
            $params['array_um'][$valorUM['idunidadmedida']] = $valorUM['abreviaturaunidadmedida'];
        }
        unset($params['um']);

        //FIn de los stores
        //Creando el encabezado
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-type: application/vnd.ms-excel; charset=UTF-8");
        header("Content-Encoding: utf-8");
        //header("Transfer-Encoding: chunked");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=carteraProductos_.xls");
        header("Content-Transfer-Encoding: binary ");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo"<H2 align=center>Cartera de productos</H2>";
        echo"<H3>Entidad: {$params['denoentidad']} <br/>";
        echo "<tr>
        <table border=1 cellspacing=0 width=60%>  
             <th align=center>Código</th>
             <th align=center>Denominación</th>
             <th align=center>UM</th> 
             <th align=center>Precio</th>
             <th align=center>Precio divisa</th>
             <th align=center>Aprobado</th>
             <th align=center>Activado</th>             
             <th align=center>Nivel de planificación</th>
            ";
        echo "</tr>";
        //Obteniendo los datos
        $datos = CarteraproductosModel::listarCarteraProductos($params);
        $data = $datos->data;
        //Mostrando los datos
        foreach ($data as $value) {
            echo "<tr>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['codigo'] . "</td>";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $value['denominacion'] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\" >" . $params['array_um'][$value['idunidadmedida']] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . $value['precio'] . "</td>";
            echo"<td align=right style=\"mso-number-format:'#,##0.00';\">" . $value['preciodivisa'] . "</td>";

            if ($value['idaprobacion'] == 1)
                $aprobación = "Desaprobado";
            else
            if ($value['idaprobacion'] == 3)
                $aprobación = "Aprobado especialista";
            else
            if ($value['idaprobacion'] == 4)
                $aprobación = "Aprobado rector";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $aprobación . "</td>";
            if ($value['estado'] == 1)
                $estado = "Sí";
            else
                $estado = "No";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $estado . "</td>";
            if ($value['nivel'] == 1)
                $nivel = "Sí";
            else
                $nivel = "No";
            echo"<td align=left style=\"mso-number-format:'@';\" >" . $nivel . "</td>";

            echo "</tr>";
        }
        echo "</table>\n";
        echo"<H6 align=right>Documento generado por PROEZA<br/>";
        $fecha = strftime("%Y/%m/%d %T", time());
        echo"Fecha: {$fecha}</H6>.";
        echo '</BODY></HTML>';
    }

}
