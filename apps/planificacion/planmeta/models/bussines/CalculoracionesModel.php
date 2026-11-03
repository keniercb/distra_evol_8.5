<?php

class CalculoracionesModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function exportarBalances($parametros)
    {
        $extension = '.xls';
        header(
            "Content-type: application/vnd.ms-" . $tipo . "; name='" . $tipo
            . "';Charset=iso-8859-1"
        );
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header(
            "Content-disposition: attachment; filename=" . 'Balances'
            . $extension
        );
        header("Pragma: no-cache");
        header("Expires: 0");

        echo "
            <table >
                <th align=left style = color:blue >Componente: </th>
                <td align=left>" . $parametros['componente'] . "</td>

                <th align=left style = color:green >Entidad: </th>
                <td align=left>" . $parametros['entidad'] . "</td>";
        echo " 
            <br>
            <tr>
            <th align=left style = color:green >Tipo Balance: </th>
            <td align=left>" . $parametros['tipobalance'] . "</td>

            <th align=right style = color:green >Sub-Tipo Balance: </th>
            <td align=left>" . $parametros['idsubtipobalance'] . "</td>
            </tr>
            </br>  ";

        echo ("<br></br></table>") . "<tr >";
        echo "
            <table border=1 cellspacing=0 width=60%>   
            <th align=left>Denominaci&oacute;n</th>
            <th align=left>Descripci&oacute;n</th>
            
        </tr>";


        $datos = self::listarRacionesExportar($parametros);

        foreach ($datos->data as $dat) {

            echo "<td>" . $dat['denominacion'] . "</td>\n";
            echo "<td>" . $dat['descripcion'] . "</td>\n";
            echo "</tr>";
        }

        echo "</table>\n";


    }

    public function listarRacionesExportar($parametros)
    {
        $aux = "";

        if ($parametros['hoja'] == 'true') {
            $data->data = DatRacionesModel::listarBalance(
                $parametros['idEstructura'], $parametros['idsubtipobalance'],
                'false', $parametros['idconftiponomesp'], $start, $limit, $aux
            );
            $data->totales = DatRacionesModel::listarTotalesBalance(
                $parametros['idEstructura'], $parametros['idsubtipobalance'],
                'false', $parametros['idconftiponomesp'], $aux
            );
            foreach ($data->data as $key => $value) {
                $data->data[$key]['idsubtipobalancebalance']
                    = $value['DatSubtipobalancebalance'][0]['idsubtipobalancebalance'];
                $data->data[$key]['total'] = $value['DatSubtipobalancebalance'][0]['total'];
                $data->data[$key]['coeficiente'] = $value['DatSubtipobalancebalance'][0]['coeficiente'];
                $data->data[$key]['racion'] = number_format(
                    $value['DatSubtipobalancebalance'][0]['racion'], '3', '.', ','
                );
            }
        } else {
            if ($parametros['todos'] == 'false') {
                $data->data = DatRacionesModel::consolidar(
                    $parametros['idsubtipobalance'], $parametros['idconftiponomesp'], $aux
                );
            } else {
                $data->data = DatRacionesModel::listarBalance(
                    $parametros['idEstructura'], $parametros['idsubtipobalance'], $parametros['todos'],
                    $parametros['idconftiponomesp'], $start, $limit, $aux
                );

            }
        }
        return $data;
    }


    public function obtenerListadoAsociaciones($params, $identidad, $idsubtipobalancebalance, $idejercicio)
    {

        $data = DatSubtipobalancebalanceactividad::listarAsociaciones(
            $params, $idsubtipobalancebalance, $identidad, $idejercicio
        );

        return $data;
    }

    public function obtenerListadoTodasAct($params, $identidad, $idejercicio)
    {
        $modeloAct = new DatActividadentidadModel();
        $data = $modeloAct->listarTodasAct($params, $identidad, $idejercicio);

        return $data;
    }

    public function obtenerEjercicios()
    {

        $data = NomEjercicioplanificacionModel::obtenerEjercicios();
        return $data;
    }

    public function guardarTS($params)
    {
        $data = DatRacionesModel::guardarTS($params);
        return $data;
    }

    public function asociarActividades($params)
    {

        $longactividades = count($params['actividades']);
        $cociente = $params['racion'] / $longactividades;
        $resto = $params['racion'] % $longactividades;
        $act = array();
        $modeloAct = new DatActividadentidadModel();
        if ($params['racion'] >= $longactividades) { 
            if ($resto == 0) {
                $modeloActEnt = new DatActividadentidad();
                $idActEnt = DatActividadentidad::devolverActEnt($params['actividades'], $params, true);
                $modeloAct->updateNAM($idActEnt, $cociente);
            } else {
                $act[0] = $params['actividades'][0];
                $modeloActEnt = new DatActividadentidad();
                $idAcs = DatActividadentidad::devolverActEnt($act, $params, true);
                $modeloAct->updateNAM($idAcs, $cociente + $resto);

                $modeloActEnt = new DatActividadentidad();
                $idActEnt = DatActividadentidad::devolverActEnt($params['actividades'], $params, false);
                $modeloAct->updateNAM($idActEnt, $cociente);
            }
            foreach ($params['actividades'] as $dat) {
                $varAux=DatSubtipobalancebalanceactividad::buscarrelacion($params['idsubtipobalancebalance'], $dat);
                if ($varAux == null) {
                     DatSubtipobalancebalanceactividad::insertarSBBA($dat, $params);
                }
            }
        }
    }

    public function desasociarActividades($params)
    {
        $model = new DatSubtipobalancebalanceactividadModel();
        $array = array();
        $modeloAct = new DatActividadentidadModel();
        $modeloActEnt = new DatActividadentidad();
        $idActEnt = DatActividadentidad::devolverActEnt($params['actividades'], $params, true);
        foreach ($params['actividades'] as $dat) {
            $asociacionaemsbb
                = DatSubtipobalancebalanceactividad::buscarrelacion($params['idsubtipobalancebalance'], $dat);
            $varAux=$asociacionaemsbb[0]['idsubtipobalancebalanceactividad'];
            $varAuxiliar=$model->eliminardatSubtipobalancebalanceactividad($varAux);
            if ($varAuxiliar) {
                $array[0] = $idActEnt[0]['idactividadentidad'];
                $cociente = 0;
                $modeloAct->updateNAM($array, $cociente);
                $result = true;
            } else {
                $result = false;
            }
        }
        return $result;
    }

}
