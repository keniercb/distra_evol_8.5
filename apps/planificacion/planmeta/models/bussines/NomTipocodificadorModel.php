<?php

class NomTipocodificadorModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function insertarnomTipocodificador($nomTipocodificador)
    {
        $nomTipocodificador->save();
    }

    public function modificarnomTipocodificador($nomTipocodificador)
    {
        $nomTipocodificador->save();
    }

    public function eliminarnomTipocodificador($nomTipocodificador)
    {
        $nomTipocodificador->delete();
    }

    public function listar($parametros)
    {
        return NomTipocodificador::listar($parametros);
    }

    public function adicionar($params)
    {
        if ($params['mod'] == 'true') {
            if (!$params['idpadre']) {
                $tipocod = Doctrine::getTable('NomTipocodificador')->find(
                    $params['id']
                );
                //$tipocod->color = $params['color'];
                $tipocod->descripcion = $params['descripcion'];
                $tipocod->denominacion = $params['denominacion'];
                $tipocod->idformato = $params['idformato'];
                $tipocod->save();
                $res = 1;
            } else {
                $datonosm = Doctrine::getTable('NomDatoscodificador')->find(
                    $params['id']
                );
                $datonosm->codigo = $params['codigo'];
                // $datonosm->color = $params['color2'];
                $datonosm->descripcion = $params['descripcion1'];
                $datonosm->denominacion = $params['denominacion1'];
                $datonosm->idumedida = $params['um'];
                $datonosm->save();
                $res = 1;
            }

        } else {
            if (!$params['idpadre']) {
                $dato = NomTipocodificador::buscarpordenom(
                    strtoupper($params['denominacion'])
                );

                if ($dato[0] == null) {
                    $tipocod = new NomTipocodificador();
                    // $tipocod->color = $params['color'];
                    $tipocod->descripcion = $params['descripcion'];
                    $tipocod->denominacion = $params['denominacion'];
                    $tipocod->idformato = $params['idformato'];
                    $tipocod->save();
                    $res = 1;
                } else {
                    $res = 2;
                }
            } else {
                $dato = NomDatoscodificador::buscarporcodigo($params['codigo']);
                if ($dato[0] == null) {
                    $datonosm = new NomDatoscodificador();
                    $datonosm->idtipocodificador = $params['idpadre'];
                    $datonosm->codigo = $params['codigo'];
                    // $datonosm->color = $params['color2'];
                    $datonosm->descripcion = $params['descripcion1'];
                    $datonosm->denominacion = $params['denominacion1'];
                    $datonosm->idumedida = $params['um'];
                    $datonosm->save();
                    $res = 1;
                } else {
                    $res = 2;
                }
            }
        }
        return array('codMsgA' => $res);
    }

    public function eliminar($params)
    {
        foreach ($params as $value) {
            if ($value[1] != null) {
                $nom = Doctrine::getTable('NomDatoscodificador')->find(
                    $value[0]
                );
            } else {
                $nom = Doctrine::getTable('NomTipocodificador')->find(
                    $value[0]
                );
            }
            self::eliminarnomTipocodificador($nom);
        }
        return array('codMsgE' => 1);
    }

    public function listarTipoCodificadores()
    {
        return NomTipocodificador::listarTipoCodificadores();
    }

    public function listarDatosCodifdadoIdPadre($params)
    {
        return NomTipocodificador::listarDatosCodifdadoIdPadre($params);
    }

    public function exportar($parametros)
    {
        $parametros['limit'] = null;
        $parametros['start'] = null;
        if (is_array($parametros['filtros'])) {
            foreach ($parametros['filtros'] as $key => $datos) {
                if ($datos->field == 'denominacion') {
                    $parametros ['denominacion'] = $datos->data->value;
                }
                if ($datos->field == 'descripcion') {
                    $parametros['descripcion'] = $datos->data->value;
                }
                if ($datos->field == 'codigo') {
                    $parametros['codigo'] = $datos->data->value;
                }
            }
        }
        $tituloreporte = 'codificadores';
        $extension = '.xls';
        header(
            "Content-type: application/vnd.ms-" . $tipo . "; name='" . $tipo
            . "';Charset=iso-8859-1"
        );
        header("Expires: " . date("D:M:Y"));
        header("Cache-Control: must-revalidate, post-check=0, pre-check=0");
        header(
            "Content-disposition: attachment; filename=" . $tituloreporte
            . $extension
        );
        header("Pragma: no-cache");
        header("Expires: 0");
        echo '<HTML><HEAD><META HTTP-EQUIV="CONTENT-TYPE" CONTENT="text/html; charset=utf-8"></HEAD><BODY>';
        echo "<table border=1>\n";
        echo "<tr>\n";
        echo "<th colspan = 3 align=center> CODIFICADORES </th>";
        echo "<th colspan = 3 align=center> DATOS CODIFICADORES </th>";
        echo "</tr>";
        echo "<tr>\n";
        echo "<th>C&oacute;digo</th>\n";
        echo "<th align=left>Denominaci&oacute;n </th>\n";
        echo "<th align=left>Descripci&oacute;n</th>\n";
        echo "<th>C&oacute;digo</th>\n";
        echo "<th align=left>Denominaci&oacute;n </th>\n";
        echo "<th align=left>Descripci&oacute;n</th>\n";
        echo "</tr>\n";
        $datos = NomTipocodificador::TotaldeCodificadores($parametros);

        $cantxpag = 10000;
        $cantpag = (int)($datos->total / $cantxpag);
        if (fmod($datos->total, $cantxpag) > 0) {
            $cantpag++;
        }

        $parametros['start'] = 0;
        $parametros['limit'] = $cantxpag;
        for ($i = 0; $i < $cantpag; $i++) {
            $datos = self::listar($parametros);
            $parametros['start'] = $parametros['start'] + $cantxpag;
            foreach ($datos->data as $key => $value) {
                $pinto = true;
                echo "<tr>\n";
                echo "<td style=\"mso-number-format:'@';\">" . $value['codigo']
                    . "</td>\n";
                echo "<td>" . $value['denominacion'] . "</td>\n";
                echo "<td>" . $value['descripcion'] . "</td>\n";

                $datosCodificador = NomDatoscodificador::obtenerDatosDadoIdtipo(
                    $value['idtipocodificador']
                );

                if ($datosCodificador[0] != "") {
                    foreach ($datosCodificador as $keyDatos => $valueDatos) {
                        if (!$pinto) {
                            echo "<tr>\n";
                            echo "<td style=\"mso-number-format:'@';\">" . $value['codigo']
                                . "</td>\n";
                            echo "<td>" . $value['denominacion'] . "</td>\n";
                            echo "<td>" . $value['descripcion'] . "</td>\n";
                        }
                        echo "<td style=\"mso-number-format:'@';\">"
                            . $valueDatos['codigo'] . "</td>\n";
                        echo "<td>" . $valueDatos['denominacion'] . "</td>\n";
                        echo "<td>" . $valueDatos['descripcion'] . "</td>\n";
                        echo "</tr>\n";
                        if ($keyDatos+1 > 0) {
                            $pinto = false;
                        }

                    }
                } else {
                    echo "<td style=\"mso-number-format:'@';\">" . '--'. "</td>\n";
                    echo "<td>" . '--' . "</td>\n";
                    echo "<td>" . '--' . "</td>\n";
                    echo "</tr>\n";
                }

            }
        }

        echo "</table>\n";
        echo '</BODY></HTML>';
    }

}


