<?php

//namespace Rest\classes\service;

class PmRestService
{
    /**
     * Metodo para obtener el token de acceso de la Api Rest. Este servicio devuelve 4 parametros:
     * acces_token -> El token se utiliza para acceder a los demas servicios
     * expires_in -> tiempo en segundos antes de que el token expire
     * token_type -> tipo de token
     * refresh_token -> token para refrescar una vez pasado el tiempo de expiracion del token
     *
     * @param $server //Direccion del servidor donde esta la plataforma
     * @param $workspace //Sys de la ptaforma
     * @param $clientId //Client ID dado por el sitio donde se publican los servicios rest
     * @param $secretKey //CLient secret dado por el sitio donde se publican los servicios rest
     * @param $username //usuario de la plataforma
     * @param $password //contraseña del usuario
     * @return mixed|null
     */
    public static function login($server, $workspace, $clientId, $secretKey, $username, $password)
    {
        $postParams = array(
            'grant_type' => 'password',
            'scope' => '*',       //set to 'view_process' if not changing the process
            'client_id' => $clientId,
            'client_secret' => $secretKey,
            'username' => $username,
            'password' => $password
        );

        $curl = curl_init();

        curl_setopt_array($curl, array(
            CURLOPT_SSL_VERIFYHOST => 0,
            CURLOPT_SSL_VERIFYPEER => 0,
            CURLOPT_URL => $server . '/' . $workspace . '/oauth2/token',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_ENCODING => "",
            CURLOPT_MAXREDIRS => 10,
            CURLOPT_TIMEOUT => 30,
            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
            CURLOPT_CUSTOMREQUEST => "POST",
            CURLOPT_POSTFIELDS => http_build_query($postParams),
        ));

        $oToken = json_decode(curl_exec($curl));
            $httpStatus = curl_getinfo($curl, CURLINFO_HTTP_CODE);
            $err = curl_error($curl);
        curl_close($curl);

        if ($httpStatus != 200) {
            //print "Error in HTTP status code: $httpStatus\n";
            if (isset($oToken->error)) {
              /*  print "Error logging into $server:\n" .
                    "Error:       {$oToken->error}\n" .
                    "Description: {$oToken->error_description}\n";*/
                return array(
                    'success' => false,
                    "status" => $httpStatus,
                    "error" => $oToken->error,
                    "description" => $oToken->error_description
                );
            }
        } elseif (isset($oToken->error)) {
            return array(
                'success' => false,
                "status" => $httpStatus,
                "error" => $oToken->error,
                "description" => $oToken->error_description
            );/*
            print "Error logging into $server:\n" .
                "Error:       {$oToken->error}\n" .
                "Description: {$oToken->error_description}\n";*/
        } else {
            //At this point $oToken->access_token can be used to call REST endpoints.

            //If planning to use the access_token later, either save the access_token
            //and refresh_token as cookies or save them to a file in a secure location.

            //If saving them as cookies:
            setcookie("access_token", $oToken->access_token, time() + 86400);
            setcookie("refresh_token", $oToken->refresh_token); //refresh token doesn't expire
            setcookie("client_id", $clientId);
            setcookie("client_secret", $secretKey);

            //If saving to a file:
            //file_put_contents("/secure/location/oauthAccess.json", json_encode($tokenData));
        }

        return $oToken;
    }

    /**
     * Metodo para obtener un nuevo token de acceso de la Api Rest si expira  la sesion de Processmaker
     *
     * @param $server
     * @param $method
     * @param $endpoint
     * @param null $aVars
     * @param null $accessToken
     * @return StdClass|null
     * @throws Exception
     */
    public static function request($server, $method, $endpoint, $aVars = null, $accessToken = null)
    {
        $ch = curl_init($server . $endpoint);

        curl_setopt($ch, CURLOPT_HTTPHEADER, array("Authorization: Bearer " . $accessToken));
        curl_setopt($ch, CURLOPT_TIMEOUT, 30);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_SSL_VERIFYHOST, 0);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, 0);
        curl_setopt($ch, CURLOPT_ENCODING, 0);
        curl_setopt($ch, CURLOPT_MAXREDIRS, 10);
        curl_setopt($ch, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);

        $method = strtoupper($method);

        switch ($method) {
            case "GET":
                break;
            case "DELETE":
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
                break;
            case "PUT":
                curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
            case "POST":
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($aVars));
                break;
            case "POST_FORM":
                curl_setopt($ch, CURLOPT_POST, 1);
                curl_setopt($ch, CURLOPT_POSTFIELDS, $aVars);
                break;
            default:
                throw new Exception("Error: Invalid HTTP method '$method' $endpoint");
                return null;
        }
        $response = curl_exec($ch);
        $status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
        curl_close($ch);
        ///print_r($status);die;
        if ($status == 401) { //if session has expired or bad login:
            /*header("Location: loginForm.php"); //change to match your login method
            die();*/
            return array(
                'success' => false,
                "status" => $status,
                "error" => 'session_expired',
                "description" => 'has expired or bad login'
            );
        } elseif ($status != 200 and $status != 201 and $status != 206) { //if error
                $response = json_decode($response);
                if ($response && isset($response->error)) {
                    /*print "Error in $server:\nCode: {$oRet->response->error->code}\n" .
                        "Message: {$oRet->response->error->message}\n";*/
                    return array(
                        'success' => false,
                        "status" => $status,
                        "error" => $response->error,
                        "description" => $response->error->message
                    );
                } else {
                    return array(
                        'success' => false,
                        "status" => $status,
                        "error" => $response->error,
                        "description" => $response->error->message
                    );
                }
        } else{
            $result = json_decode($response,true);
            if($response && (is_object($result) || is_array($result))){
                $response = $result;
            }
        }

        return $response;

        //        if (empty($accessToken) and isset($_COOKIE['access_token']))
//            $accessToken = $_COOKIE['access_token'];
//
//        if (empty($accessToken)) { //if the access token has expired
//            //To check if the PM login session has expired: !isset($_COOKIE['PHPSESSID'])
//            header("Location: loginForm.php"); //change to match your login method
//            die();
//        }
//
//        //add beginning / to endpoint if it doesn't exist:
//        if (!empty($endpoint) and $endpoint[0] != "/")
//            $endpoint = "/" . $endpoint;
//
//        $curl = curl_init();
//        $method = strtoupper($method);
//
//        switch ($method) {
//            case "GET":
//                break;
//            case "DELETE":
//                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "DELETE");
//                break;
//            case "PUT":
//                curl_setopt($curl, CURLOPT_CUSTOMREQUEST, "PUT");
//            case "POST":
//                curl_setopt($curl, CURLOPT_POST, 1);
//                curl_setopt($curl, CURLOPT_POSTFIELDS, http_build_query($aVars));
//                break;
//            default:
//                throw new Exception("Error: Invalid HTTP method '$method' $endpoint");
//                return null;
//        }
//
//        curl_setopt_array($curl, array(
//            CURLOPT_SSL_VERIFYHOST => 0,
//            CURLOPT_SSL_VERIFYPEER => 0,
//            CURLOPT_URL => $server . $endpoint,
//            CURLOPT_RETURNTRANSFER => true,
//            CURLOPT_ENCODING => "",
//            CURLOPT_MAXREDIRS => 10,
//            CURLOPT_TIMEOUT => 30,
//            CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
//            CURLOPT_HTTPHEADER => array(
//                "Authorization: Bearer " . $accessToken, 'Accept: application/json'
//            )
//        ));
//
//        $oRet = new StdClass;
//        $oRet->response = json_decode(curl_exec($curl));
//        $oRet->status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
//        curl_close($curl);
//
//        if ($oRet->status == 401) { //if session has expired or bad login:
//            header("Location: loginForm.php"); //change to match your login method
//            die();
//        } elseif ($oRet->status != 200 and $oRet->status != 201) { //if error
//            if ($oRet->response and isset($oRet->response->error)) {
//                print "Error in $server:\nCode: {$oRet->response->error->code}\n" .
//                    "Message: {$oRet->response->error->message}\n";
//            } else {
//                print "Error: HTTP status code: $oRet->status\n";
//            }
//        }
//
//        return $oRet;
    }
}