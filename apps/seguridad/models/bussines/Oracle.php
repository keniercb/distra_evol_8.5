<?php

/**
 * Clase de negocio.
 *
 * @package Acaxia
 * @copyright UCID-ERP Cuba
 * @author Equipo de seguridad UCID.
 * @version 3.0-0
 */
class Oracle
{

    protected $_rsa;

    function __construct()
    {
        $this->_rsa = new ZendExt_RSA_Facade();
    }

    private function getStringConex($host, $port, $sid)
    {
        return "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
        . "(HOST=$host)(PORT=$port)))(CONNECT_DATA = (SID = $sid)))";
    }

    public function getConexion($user, $passw, $host, $port, $sid)
    {
        return oci_connect(
            "$user", "$passw", $this->getStringConex($host, $port, $sid)
        );
    }

    public function getOracleDatabases(
        $gestor, $user, $pass, $ipgestorbd, $idgestor, $idservidor, $idsistema,
        $idnodo, $puerto, $sid
    )
    {
        $key = 0;
        $bdArr = array();
        $conn = $this->getConexion($user, $pass, $ipgestorbd, $puerto, $sid);
        $query = 'select name from sys.v_$database';
        $bd = oci_parse($conn, $query);
        oci_execute($bd);
        while ($row = oci_fetch_array($bd, OCI_ASSOC)) {
            $bdArr[$key]['id'] = $row['NAME'] . '-' . $idnodo;
            $bdArr[$key]['text'] = $row['NAME'];
            $bdArr[$key]['namebd'] = $row['NAME'];
            $bdArr[$key]['gestor'] = $gestor;
            $bdArr[$key]['ipgestorbd'] = $ipgestorbd;
            $bdArr[$key]['puerto'] = $puerto;
            $bdArr[$key]['user'] = $user;
            $bdArr[$key]['passw'] = $this->_rsa->encrypt($pass);
            $bdArr[$key]['idgestor'] = $idgestor;
            $bdArr[$key]['idservidor'] = $idservidor;
            $bdArr[$key]['icon'] = '../../views/images/server.PNG';
            $bdArr[$key]['type'] = 'oracle';
            $bdArr[$key]['leaf'] = true;
            $key++;
        }
        oci_close($conn);
        return $bdArr;
    }

    public function getOracleUsers(
        $gestor, $user, $passw, $ipgestorbd, $puerto, $sid, $limit, $start
    )
    {
        $key = 0;
        $usuarios = array();
        $pass = $this->_rsa->decrypt($passw);
        $conn = $this->getConexion($user, $pass, $ipgestorbd, $puerto, $sid);
        $query = "select username,USER_ID,ACCOUNT_STATUS,CREATED,EXPIRY_DATE,
            LOCK_DATE,PASSWORD from (
            select rownum parte, username, USER_ID, ACCOUNT_STATUS, CREATED, 
            EXPIRY_DATE, LOCK_DATE, PASSWORD
            from ( select username,USER_ID,ACCOUNT_STATUS,CREATED,EXPIRY_DATE,
            LOCK_DATE,PASSWORD from dba_users )
            )
            where parte between $start and $limit";
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        while ($row = oci_fetch_array($stid, OCI_ASSOC)) {
            $radioButtonThree = off;
            $radioButtonTwo = off;
            $radioButtonOne = off;
            $usuarios[$key]['user'] = $row['USERNAME'];
            $usuarios[$key]['id'] = $row['USER_ID'];
            $usuarios[$key]['estado'] = $row['ACCOUNT_STATUS'];
            $usuarios[$key]['creado'] = $row['CREATED'];
            $usuarios[$key]['expira'] = $row['EXPIRY_DATE'];
            $usuarios[$key]['bloqueado'] = $row['LOCK_DATE'];
            $usuarios[$key]['password'] = $row['PASSWORD'];
            if ($row['PASSWORD'] == "GLOBAL")
                $radioButtonThree = on;
            else if ($row['PASSWORD'] == "EXTERNAL")
                $radioButtonTwo = on;
            else
                $radioButtonOne = on;
            $usuarios[$key]['radiobutton3'] = $radioButtonThree;
            $usuarios[$key]['radiobutton2'] = $radioButtonTwo;
            $usuarios[$key]['radiobutton1'] = $radioButtonOne;
            $key++;
        }
        $consultCant = "SELECT count (*) as cantidad FROM dba_users";
        $cant = oci_parse($conn, $consultCant);
        oci_execute($cant);
        $row = oci_fetch_array($cant, OCI_ASSOC);
        $cantidad = $row['CANTIDAD'];
        oci_close($conn);
        $array = array('datos' => $usuarios, 'cantidad_filas' => $cantidad);
        return $array;
    }

    public function loadOracleRole(
        $gestor, $user, $passw, $ipgestorbd, $puerto, $sid, $limit, $start
    )
    {
        $key = 0;
        $roles = array();
        $array = array();
        $pass = $this->_rsa->decrypt($passw);;
        $conn = $this->getConexion($user, $pass, $ipgestorbd, $puerto, $sid);
        $query = "SELECT ROLE, PASSWORD_REQUIRED FROM ( 
            SELECT rownum parte, ROLE, PASSWORD_REQUIRED FROM (
            SELECT ROLE, PASSWORD_REQUIRED FROM dba_roles )
            )
            WHERE parte between $start AND $limit";
        $rol = oci_parse($conn, $query);
        oci_execute($rol);
        while ($row = oci_fetch_array($rol, OCI_ASSOC)) {
            $roles[$key]['rol'] = $row['ROLE'];
            $roles[$key]['pidepass'] = $row['PASSWORD_REQUIRED'];
            $radioButtonFour = off;
            $radioButtonSeven = off;
            $radioButtonSix = off;
            $radioButtonFive = off;
            if ($row['PASSWORD_REQUIRED'] == "GLOBAL")
                $radioButtonSeven = on;
            else if ($row['PASSWORD_REQUIRED'] == "EXTERNAL")
                $radioButtonSix = on;
            else if ($row['PASSWORD_REQUIRED'] == "YES")
                $radioButtonFive = on;
            else
                $radioButtonFour = on;
            $roles[$key]['radiobutton7'] = $radioButtonSeven;
            $roles[$key]['radiobutton6'] = $radioButtonSix;
            $roles[$key]['radiobutton5'] = $radioButtonFive;
            $roles[$key]['radiobutton4'] = $radioButtonFour;
            $key++;
        }
        $consultCant = "SELECT count (*) as cantidad FROM dba_roles";
        $cant = oci_parse($conn, $consultCant);
        oci_execute($cant);
        $row = oci_fetch_array($cant, OCI_ASSOC);
        $cantidad = $row['CANTIDAD'];
        oci_close($conn);
        $array = array('datos' => $roles, 'cantidad_filas' => $cantidad);
        return $array;
    }

    public function getUserData($name, $conn)
    {
        $query = "SELECT username, USER_ID, ACCOUNT_STATUS, CREATED, "
            . "EXPIRY_DATE, LOCK_DATE, PASSWORD FROM dba_users "
            . "WHERE username = '$name'";
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        while ($row = oci_fetch_array($stid, OCI_ASSOC)) {
            $radioButtonThree = off;
            $radioButtonTwo = off;
            $radioButtonOne = off;
            $usuarios[$key]['user'] = $row['USERNAME'];
            $usuarios[$key]['id'] = $row['USER_ID'];
            $usuarios[$key]['estado'] = $row['ACCOUNT_STATUS'];
            $usuarios[$key]['creado'] = $row['CREATED'];
            $usuarios[$key]['expira'] = $row['EXPIRY_DATE'];
            $usuarios[$key]['bloqueado'] = $row['LOCK_DATE'];
            $usuarios[$key]['password'] = $row['PASSWORD'];
            if ($row['PASSWORD'] == "GLOBAL")
                $radioButtonThree = on;
            else if ($row['PASSWORD'] == "EXTERNAL")
                $radioButtonTwo = on;
            else
                $radioButtonOne = on;
            $usuarios[$key]['radiobutton3'] = $radioButtonThree;
            $usuarios[$key]['radiobutton2'] = $radioButtonTwo;
            $usuarios[$key]['radiobutton1'] = $radioButtonOne;
            $key++;
        }
        oci_close($conn);
        return $usuarios;
    }

    public function exist($name, $conn)
    {
        if ($this->verifyRole($name, $conn) || $this->verifyUser($name, $conn))
            return true;
        else
            return false;
    }

    private function verifyUser($name, $conn)
    {
        $query = "SELECT username FROM dba_users WHERE username = '$name'";
        $ociParse = oci_parse($conn, $query);
        oci_execute($ociParse);
        $valor = oci_fetch_array($ociParse, OCI_ASSOC);
        if ($valor != NULL)
            return true;
        else
            return false;
    }

    private function verifyRole($name, $conn)
    {
        $query = "SELECT * FROM dba_roles WHERE ROLE = '$name'";
        $ociParse = oci_parse($conn, $query);
        oci_execute($ociParse);
        $valor = oci_fetch_array($ociParse, OCI_ASSOC);
        if ($valor != NULL)
            return true;
        else
            return false;
    }

}