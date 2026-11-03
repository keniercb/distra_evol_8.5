<?php
class FUCModel extends ZendExt_Model
{
    private $config;
    public function FUCModel()
    {
        parent::ZendExt_Model();
        $dir = str_replace('web', 'apps', $_SERVER['DOCUMENT_ROOT']);
        $this->config = json_decode(file_get_contents($dir . "/pvd/comun/recursos/json/fuc.json"));
    }

    public function buscarpersona($params)
    {
        try {
            $busqueda_local = $this->buscarPersonaLocal($params);
            if (count($busqueda_local) > 0) {
                return json_encode($busqueda_local);
            } else {
                return $this->buscarPersonaFUC($params);
            }
        } catch (Exception $e) {
            return json_encode(array("service" => false, "error" => $e->getMessage()));
        }
    }

    public function buscarPersonaFUC($params)
    {
        $accessToken = $this->obtenerCredenciales()->access_token;
        $service_url = $this->config->url . $this->config->servicio . $this->config->consulta;
        $curl_consulta = curl_init();
        curl_setopt_array($curl_consulta, array(
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_URL => $service_url . '?' . $this->obtenerParametros($params),
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "GET",
            CURLOPT_HTTPHEADER => array(
                "Authorization: Bearer " . $accessToken, 'Accept: application/json'
            ),
        ));
        $response = curl_exec($curl_consulta);
        $err_consulta = curl_error($curl_consulta);
        curl_close($curl_consulta);
        if ($err_consulta) {
            return json_encode(array("service" => true, "error" => $err_consulta));
        } else {
            return $response;
        }
    }

    private function obtenerCredenciales()
    {
        $curl_credenciales = curl_init();
        curl_setopt_array($curl_credenciales, array(
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_URL => $this->config->url . 'token',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => $this->config->postfields,
            CURLOPT_HTTPHEADER => array(
                "Authorization: Basic " . base64_encode($this->config->consumer_key . ":" . $this->config->consumer_secret)
            ),
        ));
        $response_credenciales = curl_exec($curl_credenciales);
        $err_credenciales = curl_error($curl_credenciales);
        curl_close($curl_credenciales);
        if ($err_credenciales) {
            return "CURL Error #:" . $err_credenciales;
        }
        return json_decode($response_credenciales);
    }

    private function obtenerParametros($params)
    {
        $parametros = "";
        if (!empty($params['id'])) {
            $parametros .= 'id=' . $params['id'];
        } else {
            if(!empty($params['identidad_numero']))
                $parametros .= 'identidad_numero=' . $params['identidad_numero'];
            if(!empty($params['primer_nombre']))
                (empty($parametros)) ? $parametros .= 'primer_nombre=' . $params['primer_nombre'] : $parametros .= '&primer_nombre=' . $params['primer_nombre'];
            if(!empty($params['primer_apellido']))
                (empty($parametros)) ? $parametros .= 'primer_apellido=' . $params['primer_apellido'] : $parametros .= '&primer_apellido=' . $params['primer_apellido'];
            if(!empty($params['segundo_apellido']))
                (empty($parametros)) ? $parametros .= 'segundo_apellido=' . $params['segundo_apellido'] : $parametros .= '&segundo_apellido=' . $params['segundo_apellido'];
            if(!empty($params['segundo_nombre']))
                (empty($parametros)) ? $parametros .= 'segundo_nombre=' . $params['segundo_nombre'] : $parametros .= '&segundo_nombre=' . $params['segundo_nombre'];
            if(!empty($params['nombre_madre']))
                (empty($parametros)) ? $parametros .= 'nombre_madre=' . $params['nombre_madre'] : $parametros .= '&nombre_madre=' . $params['nombre_madre'];
            if(!empty($params['nombre_padre']))
                (empty($parametros)) ? $parametros .= 'nombre_padre=' . $params['nombre_padre'] : $parametros .= '&nombre_padre=' . $params['nombre_padre'];
        }
        return $parametros;
    }

    private function buscarPersonaLocal($params)
    {
        try{
            $sql = "SELECT
                    dp.numid AS identidad_numero,
                    dp.nombre AS primer_nombre,
                    dp.snombre AS segundo_nombre,
                    dp.papel AS primer_apellido,
                    dp.sapel AS segundo_apellido,
                    CASE WHEN dp.sexo = 1 THEN 'M' ELSE 'F' END AS sexo,
                    dp.nommadre AS nombre_madre,
                    dp.nompadre AS nombre_padre,
                    dp.direccion AS direccion,
                    dp.fechanacimiento AS nacimiento_fecha,
                    dp.idsuin AS id,
                    true AS local
                FROM mod_persona.dat_persona AS dp";
            $where = '';
            if(!empty($params['identidad_numero']))
                $where = " WHERE dp.numid ilike '%" . $params['identidad_numero'] . "%'";
            if(!empty($params['primer_nombre']))
                (empty($where)) ? $where = " WHERE dp.nombre ilike '%" . $params['primer_nombre'] . "%'" : $where .= " AND dp.nombre ilike '%" . $params['primer_nombre'] . "%'";
            if(!empty($params['primer_apellido']))
                (empty($where)) ? $where = " WHERE dp.papel ilike '%" . $params['primer_apellido'] . "%'" : $where .= " AND dp.papel ilike '%" . $params['primer_apellido'] . "%'";
            if(!empty($params['segundo_apellido']))
                (empty($where)) ? $where = " WHERE dp.sapel ilike '%" . $params['segundo_apellido'] . "%'" : $where .= " AND dp.sapel ilike '%" . $params['segundo_apellido'] . "%'";
            if(!empty($params['segundo_nombre']))
                (empty($where)) ? $where = " WHERE dp.snombre ilike '%" . $params['segundo_nombre'] . "%'" : $where .= " AND dp.snombre ilike '%" . $params['segundo_nombre'] . "%'";
            if(!empty($params['nombre_madre']))
                (empty($where)) ? $where = " WHERE dp.nommadre ilike '%" . $params['nombre_madre'] . "%'" : $where .= " AND dp.nommadre ilike '%" . $params['nombre_madre'] . "%'";
            if(!empty($params['nombre_padre']))
                (empty($where)) ? $where = " WHERE dp.nompadre ilike '%" . $params['nombre_padre'] . "%'" : $where .= " AND dp.nompadre ilike '%" . $params['nombre_padre'] . "%'";
            $doctrine_manager = Doctrine_Manager::getInstance();
            $conexion = $doctrine_manager->getCurrentConnection();
            return $conexion->execute($sql . $where)->fetchAll(PDO::FETCH_ASSOC);
        } catch (Exception $e) {
            return $e;
        }
    }
}