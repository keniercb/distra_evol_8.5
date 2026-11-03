<?php

class ConfigurardepreciacionModel extends ZendExt_Model {

    public function setUp() {
        parent::ZendExt_Model();
    }

    public function listarIndicadoresParaAdicionar($params) {

        $res = DatDepreciacionequipo::listarIndicadoresParaAdicionar($params);
        return $res;
    }

    public function listarDepreciaciones($params) {
        $res = DatDepreciacionequipo::listarDepreciaciones($params);
        return $res;
    }

    public function adicionarIndicadores($params) {
        foreach ($params['idindicadores'] as $valorIdindicador) {
            if ($valorIdindicador != null) {
                $objDepEq = new DatDepreciacionequipo();
                $objDepEq->idindicador = $valorIdindicador;
                $objDepEq->cantidad = 0;
                $objDepEq->tasadepreciacion = 0;
                $objDepEq->save();
            }
        }
        return '24';
    }

    public function modificarIndicadores($params) {
        foreach ($params['valores'] as $value) {
            $objInd = Doctrine::getTable('DatDepreciacionequipo')
                    ->find($value->iddepreciacionequipo);

            $objInd->idindicador = $value->idindicador;
            $objInd->cantidad = $value->cantidad;
            $objInd->tasadepreciacion = $value->tasadepreciacion;
            $objInd->save();
        }
        return '24';
    }

    public function eliminarIndicadores($indicadores) {
        $query = Doctrine_Query::create();
        $query->delete('DatDepreciacionequipo')
                ->from('DatDepreciacionequipo')
                ->whereIn('idindicador', $indicadores)->execute();

        return 1;
    }

    public function exportar($params) {
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

        $data = $this->listarDepreciaciones($params);

        //html para el excel
        header("Pragma: public");
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");
        header("Content-Disposition: attachment;filename=depreciaciones.xls");
        header("Content-Transfer-Encoding: binary ");

        $primeraparte = " 
       <h2 align=center>Depreciaciones</h2>     
       <table border=1 cellspacing=0 width=60%>
              
        <tr align=left colspan='9'>
             <th align=left>C&oacute;digo</th>
             <th align=left>Denominaci&oacute;n</th>
             <th align=left>Descripci&oacute;n</th>
             <th align=left>N&uacute;mero de pieza</th>
             <th align=left>Cantidad</th>
             <th align=left>Precio</th>
             <th align=left>Valor de activo fijo</th>
             <th align=left>Tasa de depreciaci&oacute;n anual</th>
             <th align=left>Depreciaci&oacute;n anual</th>
        </tr>";

        echo $primeraparte;

        foreach ($data as $i) {
            echo "<tr><td align=left style=\"mso-number-format:'@';\">" . $i['codigo'] . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($i['denominacion']) . "</td>";
            echo "<td align=left style=\"mso-number-format:'@';\">" . utf8_decode($i['descripcion']) . "</td>";
            echo "<td align=right style=\"mso-number-format:'@';\">" . $i['numeropieza'] . "</td>";
            echo "<td align=right style=\"mso-number-format:'0.000000';\">" . $i['cantidad'] . "</td>";
            echo "<td align=right style=\"mso-number-format:'0.000000';\">" . $i['precio'] . "</td>";
            echo "<td align=right style=\"mso-number-format:'0.000';\">" . $i['valoraf'] . "</td>";
            echo "<td align=right style=\"mso-number-format:'0.000';\">" . $i['tasadepreciacion'] . "</td>";
            echo "<td align=right style=\"mso-number-format:'0.000';\">" . $i['depreciacionanual'] . "</td></tr>";
        }

        echo "</table>";
    }

}
