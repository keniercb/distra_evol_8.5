<?php

class NomConfiguracionReporteModel extends ZendExt_Model
{
    private $nomconfreporte;

    public function __construct()
    {
        $this->nomconfreporte = new NomConfiguracionReporte();
    }

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function listarConfiguracion($params)
    {
        try {
            $query = new Doctrine_Query ();
            if ($params['start']) $query->offset($params['start']);
            if ($params['limit']) $query->limit($params ['limit']);

            $query->from('NomConfiguracionReporte')
                ->setHydrationMode(Doctrine :: HYDRATE_ARRAY);

            $temp = $query->getSqlQuery();

            $res ['data'] = $query->execute();
            $res ['total'] = $query->count();
            return $res;
        } catch (Exception $e) {
            return 0;
        }
    }

    public function adicionarConfiguracion($params)
    {
        $result = self::validarParametrosObligatorios($params);
        if ($result == 1) {
            extract($params);
            try {
                $this->nomconfreporte->denconfiguracion = $denconfiguracion;
                $this->nomconfreporte->urlservidor = $urlservidor;
                $this->nomconfreporte->usuario = $usuario;
                $this->nomconfreporte->apikey = $apikey;
                $this->nomconfreporte->idsso = $idsso;
                $this->nomconfreporte->autenticarapikey = intval($autenticarapikey);
                $this->nomconfreporte->usuariors = $usuariors;
                $this->nomconfreporte->contrasenna = $pwd;
                $this->nomconfreporte->save();
                return 1;  //ok
            } catch (Exception $e) {
                echo($e->getMessage());
                return -1; //error
            }
        } else return $result; //campos obligatorios vacios
    }

    public function modificarConfiguracion($params)
    {
        $result = self::validarParametrosObligatorios($params);
        if ($result == 1) {
            extract($params);
            try {
                $nomconfreporte = Doctrine::getTable('NomConfiguracionReporte')->find($idconfiguracion);
                if (isset($nomconfreporte->idconfiguracion)) {
                    $nomconfreporte->denconfiguracion = $denconfiguracion;
                    $nomconfreporte->urlservidor = $urlservidor;
                    $nomconfreporte->usuario = $usuario;
                    $nomconfreporte->apikey = $apikey;
                    $nomconfreporte->idsso = $idsso;
                    $nomconfreporte->autenticarapikey = intval($autenticarapikey);
                    $nomconfreporte->usuariors = $usuariors;
                    $nomconfreporte->contrasenna = $pwd;
                    $nomconfreporte->save();
                    return 1;  //ok
                } else return 2; //no existe configuracion
            } catch (Exception $e) {
                return -1; //error
            }
        } else return $result; //campos obligatorios vacios
    }

    public function validarParametrosObligatorios($params)
    {
        extract($params);
        if (empty($denconfiguracion) || empty($urlservidor) || ($autenticarapikey == '1' && (!empty($usuario) && empty($apikey)) || (empty($usuario) && !empty($apikey)))
            || ($autenticarapikey == '0' && (empty($usuariors) || empty($pwd) || empty($idsso)))) {
            return 3; //campos obligatorios vacios
        } else return 1;
    }

    public function eliminarConfiguracion($arrayidconfiguracion)
    {
        $noexiste = 0;
        $puedeeliminar = true;
        try {
            foreach ($arrayidconfiguracion as $idconfiguracion) {
                $objreporte = Doctrine::getTable('DatReporte')->findByDql(
                    "idconfiguracion = '$idconfiguracion'"
                );
                if (!empty($objreporte[0]->idreporte)) {
                    $puedeeliminar = false;
                } else {
                    $objelemento = Doctrine::getTable('NomConfiguracionReporte')->find(
                        $idconfiguracion
                    );
                    if (isset($objelemento->idconfiguracion)) $objelemento->delete();
                    else $noexiste++;
                }
            }
        } catch (Exception $e) {
            $noexiste++;
        }
        $cant = count($arrayidconfiguracion);
        if ($cant == 1) {
            if (!$puedeeliminar) $mensaje = -1; //mensaje: existen reportes configurados
            else if ($noexiste) $mensaje = 0; //mensaje :el elemento no existe en el registro
            else $mensaje = 1; //mensaje :elemento eliminado correctamente
        }
        if ($cant > 1) {
            if (!$noexiste && $puedeeliminar) $mensaje = 1; // mensaje :elementos eliminados correctamente
            else if ($noexiste == $cant) $mensaje = 0; //los elementos no existen en el registro
            else if (!$puedeeliminar) $mensaje = -1; //mensaje: existen reportes configurados
            else $mensaje = 2; //algunos elementos no fueron eliminados
        }
        return $mensaje;
    }

    public function obtenerConfiguracionDadoId($idconfiguracion)
    {
        if (!empty($idconfiguracion)) {
            $result = $this->nomconfreporte->obtenerConfiguracionDadoId($idconfiguracion);
            if (isset($result['idconfiguracion'])) {
                return $result;
            } else return 0; //no se encuentra la configuracion
        } else return 2; //falta id configuracion

    }

    public function obtenerDatosConfiguracionReporte($params)
    {
        extract($params);
        if (!empty($idreporte)) {
            $result = $this->nomconfreporte->obtenerDatosConfiguracionReporteSql($params);
            if (isset($result[0])) {
                $config = array(
                    'urlservidor' => $result[0]['urlservidor'],
                    'id' => $result[0]['idreportereportserver'],
                    'user' => $result[0]['usuario'],
                    'apikey' => $result[0]['apikey'],
                    'format' => $formatoreporte,
                    'download' => 'false'
                );
                $configusuariopwd = array(
                    'autenticarapikey' => $result[0]['autenticarapikey'],
                    'usuariors' => $result[0]['usuariors'],
                    'contrasenna' => $result[0]['contrasenna'],
                    'idsso' => $result[0]['idsso']
                );
                if (!empty($datosfiltros)) {
                    foreach ($result as $key => $value) {
                        if ($value['tipo'] == 4 && $value['enviarid'] == 1) //nomenclador
                            $config["p_{$value['nombreparametro']}"] = (is_array($datosfiltros->{$value['nomidentificador']})) ? $datosfiltros->{$value['nomidentificador']}[0] : $datosfiltros->{$value['nomidentificador']};
                        else if ($value['tipo'] == 5) //variable
                            $config["p_{$value['nombreparametro']}"] = (is_array($datosfiltros->{$value['nombreparametro']})) ? $datosfiltros->{$value['nombreparametro']}[0] : $datosfiltros->{$value['nombreparametro']};
                        else if ($value['tipo'] == 6) //estructura
                            $config["p_{$value['nombreparametro']}"] = $idestructura;
                        else $config["p_{$value['nombreparametro']}"] = $datosfiltros->{$value['idfiltro']};
                    }
                }
                $data = array(
                    'config' => $config,
                    'configusuariopwd' => $configusuariopwd
                );
                return $data;
            } else return 0; //no se encuentra la configuracion
        } else return 2; //falta id reporte
    }

}

//fin clase
