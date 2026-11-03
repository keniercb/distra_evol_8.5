<?php

/**
 * @name GestrolesbdController - Clase controladora.
 * @package   seguridad
 * @copyright UCID
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestrolesbdController extends ZendExt_Controller_Secure
{

    protected $lista = array(
        'Tablas' => 'TABLE',
        'Vistas' => 'VIEW',
        'Sequencias' => 'SECUENCE',
        'Esquemas' => 'SCHEMA',
        'Bases de dato' => 'DATABASE',
        'Funciones' => 'FUNCTION'
    );
    protected $criterios = array(
        'Tablas' => 'Tables',
        'Vistas' => 'Views',
        'Secuencias' => 'Sequences',
        'Esquemas' => 'Schemas',
        'Bases de dato' => 'Databases',
        'Funciones' => 'Functions'
    );

    function init()
    {
        parent::init();
    }

    function gestrolesbdAction()
    {
        $this->render();
    }

    function cargarservidoresAction()
    {
        $idnodo = $this->_request->getPost('node');
        $accion = $this->_request->getPost('accion');
        $idsistema = $this->_request->getPost('idsistema');
        if (!$idnodo) {
            $servidoresArr = array();
            $servidores = DatServidor::cargarservidores();
            if (count($servidores) > 0) {
                foreach ($servidores as $valores => $valor) {
                    $servidoresArr[$valores] = $valor;
                    $servidoresArr[$valores]['type'] = 'servidores';
                    $servidoresArr[$valores]['icon'] = 
                        '../../views/images/server-white.PNG';
                }
            }
            echo json_encode($servidoresArr);

            return;
        } elseif ($accion == 'cargargestores') {
            $idservidor = $this->_request->getPost('idservidor');
            $gestores = DatGestor::cargargestores($idservidor, 0, 0);
            if ($gestores->getData() != null) {
                foreach ($gestores as $valores => $valor) {
                    $gestoresArr[$valores]['id'] = 
                        $valor->idgestor . '-' . $idnodo;
                    $gestoresArr[$valores]['text'] = $valor->gestor;
                    $gestoresArr[$valores]['idgestor'] = $valor->idgestor;
                    $gestoresArr[$valores]['idservidor'] = $idservidor;
                    $gestoresArr[$valores]['gestor'] = $valor->gestor;
                    $gestoresArr[$valores]['puerto'] = $valor->puerto;
                    if ($valor->gestor == 'pgsql') {
                        $gestoresArr[$valores]['icon'] = 
                            '../../views/images/pgadmin.png';
                    } else {
                        $gestoresArr[$valores]['icon'] = 
                            '../../views/images/oracle.png';
                    }
                    $objip = $valor->DatGestorDatServidorbd[0]
                        ->DatServidorbd->DatServidor->ip;
                    $gestoresArr[$valores]['ipgestorbd'] = $objip;
                }
                echo json_encode($gestoresArr);

                return;
            } else {
                $gest = $gestores->toArray();
                echo json_encode($gest);

                return;
            }
        } else {
            $user = $this->_request->getPost('user');
            $pass = $this->_request->getPost('passw');
            $gestor = $this->_request->getPost('gestor');
            $ipgestorbd = $this->_request->getPost('ipgestorbd');
            $idservidor = $this->_request->getPost('idservidor');
            $idgestor = $this->_request->getPost('idgestor');
            $puerto = $this->_request->getPost('puerto');
            $getDatabases = 'get' . ucfirst($gestor) . 'Databases';
            $arrayBD = $this->$getDatabases(
                $gestor, $user, $pass, $ipgestorbd, 
                $idgestor, $idservidor, $idsistema, $idnodo, $puerto
            );
            echo json_encode($arrayBD);
        }
    }

    /*private function getPgsqlDatabases(
        $gestor, $user, $pass, $ipgestorbd, $idgestor, 
        $idservidor, $idsistema, $idnodo, $puerto
    )
    {
        $bdArr = array();
        $rSA = new ZendExt_RSA_Facade();
        $dm = Doctrine_Manager::getInstance();
        $nameCurrentConn = $dm->getCurrentConnection()->getName();
        $conn = $dm->openConnection(
            "$gestor://$user:$pass@$ipgestorbd/template1", 'pg_catalog'
        );
        $db = PgDatabase::getPgsqlDatabases($conn);
        $dm->setCurrentConnection($nameCurrentConn);
        if ($db->getData() != null) {
            foreach ($db as $key => $valor) {
                $bdArr[$key]['id'] = $valor->datname . '-' . $idnodo;
                $bdArr[$key]['text'] = $valor->datname;
                $bdArr[$key]['namebd'] = $valor->datname;
                $bdArr[$key]['gestor'] = $gestor;
                $bdArr[$key]['ipgestorbd'] = $ipgestorbd;
                $bdArr[$key]['puerto'] = $puerto;
                $bdArr[$key]['user'] = $user;
                $bdArr[$key]['passw'] = $rSA->encrypt($pass);
                $bdArr[$key]['idgestor'] = $idgestor;
                $bdArr[$key]['idservidor'] = $idservidor;
                $bdArr[$key]['icon'] = '../../views/images/server.PNG';
                $bdArr[$key]['type'] = $gestor;
                $bdArr[$key]['leaf'] = true;
            }
        }

        return $bdArr;
    }*/

    //funcion de oracle para cargar bases de datos
   /* private function getOracleDatabases(
        $gestor, $user, $pass, $ipgestorbd, $idgestor, 
        $idservidor, $idsistema, $idnodo, $puerto
    )
    {
        $rsa = new ZendExt_RSA_Facade();
        //$SID = "orac";
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))"
            . "(CONNECT_DATA = (SID = $sID)))";
        $bdArr = array();
        $key = 0;
        @ $conn = oci_connect("$user", "$pass", "$cadenaConex");
        if ($conn == true) {
            $query = 'select name from sys.v_$database';
            $stid = oci_parse($conn, $query);
            oci_execute($stid);
            while ($row = oci_fetch_array($stid, OCI_ASSOC)) {
                $bdArr[$key]['id'] = $row['NAME'] . '-' . $idnodo;
                $bdArr[$key]['text'] = $row['NAME'];
                $bdArr[$key]['namebd'] = $row['NAME'];
                $bdArr[$key]['gestor'] = $gestor;
                $bdArr[$key]['ipgestorbd'] = $ipgestorbd;
                $bdArr[$key]['puerto'] = $puerto;
                $bdArr[$key]['user'] = $user;
                $bdArr[$key]['passw'] = $rsa->encrypt($pass);
                $bdArr[$key]['idgestor'] = $idgestor;
                $bdArr[$key]['idservidor'] = $idservidor;
                $bdArr[$key]['icon'] = '../../views/images/server.PNG';
                $bdArr[$key]['type'] = 'oracle';
                $bdArr[$key]['leaf'] = true;
                $key++;
            }
            oci_close($conn);

            return $bdArr;
        } else {
            echo "{'cod':3,'mensaje': 'Error de conexión.'}";
            die;
        }
    }*/

    function loadInterfaceAction()
    {
        $opcion = $this->_request->getPost('tipo');
        $this->render($opcion);
    }

    function cargarRolesBDAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        $gestor = $this->_request->getPost('gestor');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $bd = $this->_request->getPost('bd');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $nombreRol = $this->_request->getPost('nombreRol');
        $funcion = $gestor . 'CargarRolesBD';
        $result = $this->$funcion(
            $gestor, $user, $pass, $ipgestorbd, $bd, $limit, $start, $nombreRol
        );
        echo json_encode($result);
    }

    /*private function pgsqlCargarRolesBD(
        $gestor, $user, $pass, $ipgestorbd, $bd, $limit, $start, $nombreRol
    )
    {
        $dm = Doctrine_Manager::getInstance();
        $nameCurrentConn = $dm->getCurrentConnection()->getName();
        $conn = $dm->openConnection(
            "$gestor://$user:$pass@$ipgestorbd/$bd", 
            'pg_catalog'
        );
        if ($nombreRol) {
            $result = PgAuthid::getRolBDbyName(
                $conn, $nombreRol, $limit, $start
            )->toArray();
            $roles = $this->devolverDatosRol($result);
            $cant = PgAuthid::cantRolBDbyName($conn, $nombreRol);
        } else {
            $result = PgAuthid::getRolBD($conn, $limit, $start)->toArray();
            $roles = $this->devolverDatosRol($result);
            $cant = PgAuthid::cantRolBD($conn);
        }
        $dm->setCurrentConnection($nameCurrentConn);

        return array('cantidad_filas' => $cant, 'datos' => $roles);
    }*/

    // funcion util para oracle convertir formato de fecha
    function conv_fech($date)
    {
        $fechaInicial = substr($date, 0, 10);
        $dia = substr($fechaInicial, 0, 2);
        $mes = substr($fechaInicial, 3, 2);
        $ano = substr($fechaInicial, 6, 4);
        $resp = $mes . '/' . $dia . '/' . $ano;

        return $resp;
    }

    // funcion de oracle para cargar usuarios
    function oracleCargarUsuariosBDAction()
    {
        $key = 0;
        $usuarios = array();
        $arr = array();
        $rSA = new ZendExt_RSA_Facade();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $limit = $start + $limit - 1;
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        //$SID = "orac";
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $query = "select username,USER_ID,ACCOUNT_STATUS,
            CREATED,EXPIRY_DATE,LOCK_DATE,PASSWORD from
            (
            select rownum parte,
            username,USER_ID,ACCOUNT_STATUS,
            CREATED,EXPIRY_DATE,LOCK_DATE,PASSWORD
            from (
            select username,USER_ID,ACCOUNT_STATUS,
            CREATED,EXPIRY_DATE,LOCK_DATE,PASSWORD
            from dba_users order by username
            )
            )
            where parte between $start and $limit";
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        while ($row = oci_fetch_array($stid, OCI_ASSOC)) {
            $usuarios[$key]['user'] = $row['USERNAME'];
            $usuarios[$key]['id'] = $row['USER_ID'];
            $usuarios[$key]['estado'] = $row['ACCOUNT_STATUS'];
            $usuarios[$key]['creado'] = $row['CREATED'];
            $usuarios[$key]['expira'] = $row['EXPIRY_DATE'];
            $usuarios[$key]['bloqueado'] = $row['LOCK_DATE'];
            $usuarios[$key]['password'] = $row['PASSWORD'];
            $usuarios[$key]['fecha'] = $this->conv_fech($row['EXPIRY_DATE']);
            if ($row['ACCOUNT_STATUS'] == "OPEN") {
                $usuarios[$key]['checkactivacion'] = true;
            } else {
                $usuarios[$key]['checkactivacion'] = false;
            }
            $key++;
        }
        $consultCant = "select count (*) as cantidad from dba_users";
        $stidOne = oci_parse($conn, $consultCant);
        oci_execute($stidOne);
        $row = oci_fetch_array($stidOne, OCI_ASSOC);
        $cantidad = $row['CANTIDAD'];
        $arr['cantidad_filas'] = $cantidad;
        $arr['datos'] = $usuarios;
        oci_close($conn);
        echo json_encode($arr);
    }

    // funcion de oracle para cargar roles
    function oracleCargarRolesBDAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        $key = 0;
        $roles = array();
        $arr = array();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $limit = $start + $limit - 1;
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $query = "select ROLE,PASSWORD_REQUIRED from
            (
            select rownum parte,
            ROLE,PASSWORD_REQUIRED
            from (
            select ROLE,PASSWORD_REQUIRED
            from dba_roles
            )
            )
            where parte between $start and $limit";
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        while ($row = oci_fetch_array($stid, OCI_ASSOC)) {
            $roles[$key]['rol'] = $row['ROLE'];
            $roles[$key]['pidepass'] = $row['PASSWORD_REQUIRED'];
            $pas = $row['PASSWORD_REQUIRED'];
            if ($pas == "GLOBAL") {
                $radioButtonSeven = on;
                $radioButtonSix = off;
                $radioButtonFive = off;
                $radioButtonFour = off;
            } else {
                if ($pas == "EXTERNAL") {
                    $radioButtonSix = on;
                    $radioButtonSeven = off;
                    $radioButtonFour = off;
                    $radioButtonFive = off;
                } else {
                    if ($pas == "YES") {
                        $radioButtonFive = on;
                        $radioButtonSeven = off;
                        $radioButtonSix = off;
                        $radioButtonFour = off;
                    } else {
                        if ($pas == "NO") {
                            $radioButtonFour = on;
                            $radioButtonSeven = off;
                            $radioButtonSix = off;
                            $radioButtonFive = off;
                        }
                    }
                }
            }
            $roles[$key]['radiobutton7'] = $radioButtonSeven;
            $roles[$key]['radiobutton6'] = $radioButtonSix;
            $roles[$key]['radiobutton5'] = $radioButtonFive;
            $roles[$key]['radiobutton4'] = $radioButtonFour;
            $key++;
        }
        $consultCant = "select count (*) as cantidad from dba_roles";
        $stidOne = oci_parse($conn, $consultCant);
        oci_execute($stidOne);
        $row = oci_fetch_array($stidOne, OCI_ASSOC);
        $cantidad = $row['CANTIDAD'];
        $arr['cantidad_filas'] = $cantidad;
        $arr['datos'] = $roles;
        oci_close($conn);
        echo json_encode($arr);
    }

    // funcion para restar fechas util para oracle
    function dateDiff($fechaOne, $fechaTwo)
    {
        //Calcula los dias entre dos Fechas
        //Descomponemos la fechas en dia, mes y año.
        list($diaOne, $mesOne, $anoOne) = split("[/.-]", $fechaOne);
        list($diaTwo, $mesTwo, $anoTwo) = split("[/.-]", $fechaTwo);
        //calculo timestam de las dos fechas
        $timestampOne = mktime(0, 0, 0, $mesOne, $diaOne, $anoOne);
        $timestampTwo = mktime(0, 0, 0, $mesTwo, $diaTwo, $anoTwo);
        //resto a una fecha la otra. Esto entrega 
        //como resultado un valor en segundos
        $segundosDiferencia = $timestampOne - $timestampTwo;
        //convierto segundos en días
        $diasDiferencia = $segundosDiferencia / (60 * 60 * 24);
        //obtengo el valor absoulto de los días (quito posible signo negativo)
        $diasDiferencia = abs($diasDiferencia);
        //quito los decimales a los días de diferencia
        $diasDiferencia = floor($diasDiferencia);

        return $diasDiferencia;
    }

    // funcion de oracle para insertar un usuario
    function oracleInsertarUsuarioAction()
    {
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $rSA = new ZendExt_RSA_Facade();
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $cadena = $this->_request->getPost('denominacion1');
        $userInsert = strtoupper($cadena);
        $passInsert = $this->_request->getPost('newpass1');
        $checkactivacion = $this->_request->getPost('checkactivacion1');
        $fechaexpira = date(
            'd/m/Y', 
            strtotime($this->_request->getPost('fechaF'))
        );
        $fechaactual = date('d/m/Y');
        $dias = $this->dateDiff("$fechaexpira", "$fechaactual");
        $fechaexp = $this->dateDiff("$fechaexpira", "1,1,1950");
        $fechaact = $this->dateDiff("$fechaactual", "1,1,1950");
        if ($fechaexp > $fechaact) {
            $consulta = "select * from dba_users where username='$userInsert'";
            $stid = oci_parse($conn, $consulta);
            oci_execute($stid);
            $row = oci_fetch_array($stid, OCI_ASSOC);
            $consultaOne = "select * from dba_roles where ROLE='$userInsert'";
            $stidOne = oci_parse($conn, $consultaOne);
            oci_execute($stidOne);
            $rowOne = oci_fetch_array($stidOne, OCI_ASSOC);
            if (($row == null) && ($rowOne == null)) {
                if ($checkactivacion == off) {
                    $query = "CREATE USER $userInsert "
                        . "IDENTIFIED BY $passInsert ACCOUNT LOCK";
                    $stid = oci_parse($conn, $query);
                    oci_execute($stid);
                } else {
                    $query ="CREATE USER $userInsert IDENTIFIED BY $passInsert";
                    $stid = oci_parse($conn, $query);
                    oci_execute($stid);
                }
                $perfil = "CREATE PROFILE $userInsert LIMIT
                      PASSWORD_LIFE_TIME $dias";
                $stidTwo = oci_parse($conn, $perfil);
                oci_execute($stidTwo);
                $asig = "ALTER USER $userInsert  PROFILE $userInsert";
                $stidThree = oci_parse($conn, $asig);
                oci_execute($stidThree);
                $objRolesbd = new SegRolesbd();
                $objRolesbd->idservidor = $idservidor; 
                // tiene que mandarlo de la interfaz
                $objRolesbd->idgestor = $idgestor; 
                // tiene que mandarlo de la interfaz
                $objRolesbd->nombrerol = $userInsert; 
                //usuario a insertar
                $objRolesbd->passw = $rSA->encrypt($passInsert);
                $objRolesbd->save();
                $this->showMessage('Usuario insertado satisfactoriamente.');
            } else {
                $this->showMessage(
                    'El nombre de usuario ya existe en otro Rol o Usuario.'
                );
            }
        } else {
            $this->showMessage(
                'La fecha de expiracion debe ser mayor que la fecha actual.'
            );
        }
    }

    //funcion de oracle para eliminar un usuario
    function oracleEliminarUsuarioAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $cadena = $this->_request->getPost('userelim');
        $userEliminar = strtoupper($cadena);
        $query = "select count(PROFILE) from dba_profiles "
            . "where PROFILE='$userEliminar'";
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        $cant = oci_fetch_array($stid, OCI_ASSOC);
        if ($cant != null) {
            $perfil = "DROP PROFILE $userEliminar CASCADE";
            $stidTwo = oci_parse($conn, $perfil);
            oci_execute($stidTwo);
        }
        $query = "DROP USER $userEliminar CASCADE";
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        $exist = SegRolesbd::exist($userEliminar, $idservidor, $idgestor);
        if (!$this->verifySistems($exist[0]->idrolesbd)) {
            SegRolesbd::deleteRol($exist[0]->idrolesbd);
        }
        $this->showMessage('Usuario eliminado satisfactoriamente.');
        oci_close($conn);
    }

    //funcion de oracle para modificar un usuario
    function oracleModificarUsuarioAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $cadena = $this->_request->getPost('denominacion');
        $userMod = strtoupper($cadena);
        $newpass = $this->_request->getPost('newpass');
        $checkactivacion = $this->_request->getPost('checkactivacion');
        $cambiapass = $this->_request->getPost('cambiar');
        $fechaexpira = date(
            'd/m/Y', 
            strtotime($this->_request->getPost('fechaF'))
        );
        $fechaactual = date('d/m/Y');
        $dias = $this->dateDiff("$fechaexpira", "$fechaactual");
        $fechaexp = $this->dateDiff("$fechaexpira", "1,1,1950");
        $fechaact = $this->dateDiff("$fechaactual", "1,1,1950");
        $query = "select count(PROFILE) as cant from dba_profiles "
            . "where PROFILE='$userMod'";
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        $cant = oci_fetch_array($stid, OCI_ASSOC);
        if ($fechaexp > $fechaact) {
            if ($cant['CANT'] > 0) {
                $perfil = "ALTER PROFILE $userMod LIMIT "
                    . "PASSWORD_LIFE_TIME $dias";
                $stidTwo = oci_parse($conn, $perfil);
                oci_execute($stidTwo);
            } else {
                $perfil = "CREATE PROFILE $userMod LIMIT "
                    . "PASSWORD_LIFE_TIME $dias";
                $stidTwo = oci_parse($conn, $perfil);
                oci_execute($stidTwo);
                $asig = "ALTER USER $userMod PROFILE $userMod";
                $stidThree = oci_parse($conn, $asig);
                oci_execute($stidThree);
            }
            if ($cambiapass == on) {
                $query = "ALTER USER $userMod IDENTIFIED BY $newpass";
                $stid = oci_parse($conn, $query);
                oci_execute($stid);
            }
            if ($checkactivacion == on) {
                $query = "ALTER USER $userMod ACCOUNT UNLOCK";
                $stid = oci_parse($conn, $query);
                oci_execute($stid);
            } else {
                $query = "ALTER USER $userMod ACCOUNT LOCK";
                $stid = oci_parse($conn, $query);
                oci_execute($stid);
            }
            $this->updateSegRolesbd(
                $userMod,
                $userMod, 
                $idservidor, 
                $idgestor,
                $newpass
            ); //ver datos enviados
            $this->showMessage('Usuario modificado satisfactoriamente.');
        } else {
            $this->showMessage(
                'La fecha de expiracion debe ser mayor que la fecha actual.'
            );
        }
        oci_close($conn);
    }

    //funcion de oracle para isertar un rol
    function oracleInsertarRolAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $cadena = $this->_request->getPost('denominacionR1');
        $rolInsert = strtoupper($cadena);
        $passInsert = $this->_request->getPost('newpassr');
        $radioButtonOne = $this->_request->getPost('radiobuton7');
        $radioButtonTwo = $this->_request->getPost('radiobuton4');
        $radioButtonThree = $this->_request->getPost('radiobuton5');
        $radioButtonFour = $this->_request->getPost('radiobuton6');
        if ($radioButtonOne == on) {
            $consultaOne = "select username from dba_users "
                . "where username='$rolInsert'";
            $stidOne = oci_parse($conn, $consultaOne);
            oci_execute($stidOne);
            $rowOne = oci_fetch_array($stidOne, OCI_ASSOC);
            $consulta = "select * from dba_roles where ROLE='$rolInsert'";
            $stid = oci_parse($conn, $consulta);
            oci_execute($stid);
            $row = oci_fetch_array($stid, OCI_ASSOC);
            if (($row == null) && ($rowOne == null)) {
                $query = "CREATE ROLE $rolInsert NOT IDENTIFIED";
                $stid = oci_parse($conn, $query);
                oci_execute($stid);
                $this->showMessage('Rol insertado satisfactoriamente.');
            } else {
                $this->showMessage(
                    'El nombre de rol ya existe en otro Rol o Usuario.'
                );
            }
        } else {
            if ($radioButtonTwo == on) {
                $consultaOne = "select username from dba_users "
                    . "where username='$rolInsert'";
                $stidOne = oci_parse($conn, $consultaOne);
                oci_execute($stidOne);
                $rowOne = oci_fetch_array($stidOne, OCI_ASSOC);
                $consulta = "select * from dba_roles where ROLE='$rolInsert'";
                $stid = oci_parse($conn, $consulta);
                oci_execute($stid);
                $row = oci_fetch_array($stid, OCI_ASSOC);
                if (($row == null) && ($rowOne == null)) {
                    $query = "CREATE ROLE $rolInsert IDENTIFIED BY $passInsert";
                    $stid = oci_parse($conn, $query);
                    oci_execute($stid);
                    $this->showMessage('Rol insertado satisfactoriamente.');
                } else {
                    $this->showMessage(
                        'El nombre de rol ya existe en otro Rol o Usuario.'
                    );
                }
            } else {
                if ($radioButtonThree == on) {
                    $consultaOne = "select username from dba_users "
                        . "where username='$rolInsert'";
                    $stidOne = oci_parse($conn, $consultaOne);
                    oci_execute($stidOne);
                    $rowOne = oci_fetch_array($stidOne, OCI_ASSOC);
                    $consulta="select * from dba_roles where ROLE='$rolInsert'";
                    $stid = oci_parse($conn, $consulta);
                    oci_execute($stid);
                    $row = oci_fetch_array($stid, OCI_ASSOC);
                    if (($row == null) && ($rowOne == null)) {
                        $query = "CREATE ROLE $rolInsert IDENTIFIED EXTERNALLY";
                        $stid = oci_parse($conn, $query);
                        oci_execute($stid);
                        $this->showMessage('Rol insertado satisfactoriamente.');
                    } else {
                        $this->showMessage(
                            'El nombre de rol ya existe en otro Rol o Usuario.'
                        );
                    }
                } else {
                    if ($radioButtonFour == on) {
                        $consultaOne = "select username from dba_users "
                            . "where username='$rolInsert'";
                        $stidOne = oci_parse($conn, $consultaOne);
                        oci_execute($stidOne);
                        $rowOne = oci_fetch_array($stidOne, OCI_ASSOC);
                        $consulta = "select * from dba_roles "
                            . "where ROLE='$rolInsert'";
                        $stid = oci_parse($conn, $consulta);
                        oci_execute($stid);
                        $row = oci_fetch_array($stid, OCI_ASSOC);
                        if (($row == null) && ($rowOne == null)) {
                            $query="CREATE ROLE $rolInsert IDENTIFIED GLOBALLY";
                            $stid = oci_parse($conn, $query);
                            oci_execute($stid);
                            $this->showMessage(
                                'Rol insertado satisfactoriamente.'
                            );
                        } else {
                            $this->showMessage(
                                'El nombre de rol ya '
                                . 'existe en otro Rol o Usuario.'
                            );
                        }
                    }
                }
            }
        }
        oci_close($conn);
    }

    //funcion de oracle para eliminar un rol
    function oracleEliminarRolAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $rolEliminar = $this->_request->getPost('rol');
        $query = "DROP ROLE $rolEliminar";
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        $this->showMessage('Rol eliminado satisfactoriamente.');
        oci_close($conn);
    }

    //funcion de oracle para modificar un rol
    function oracleModificarRolAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $cadena = $this->_request->getPost('rol');
        $rolInsert = strtoupper($cadena);
        $passInsert = $this->_request->getPost('newpassrM');
        $radioButtonOne = $this->_request->getPost('radiobuton7');
        $radioButtonTwo = $this->_request->getPost('radiobuton4');
        $radioButtonThree = $this->_request->getPost('radiobuton5');
        $radioButtonFour = $this->_request->getPost('radiobuton6');
        if ($radioButtonOne == on) {
            $query = "ALTER ROLE $rolInsert NOT IDENTIFIED";
            $stid = oci_parse($conn, $query);
            oci_execute($stid);
            $this->showMessage('Rol modificado satisfactoriamente.');
        } else if ($radioButtonTwo == on) {
            $query = "ALTER ROLE $rolInsert IDENTIFIED BY $passInsert";
            $stid = oci_parse($conn, $query);
            oci_execute($stid);
            $this->showMessage('Rol modificado satisfactoriamente.');
        } else if ($radioButtonThree == on) {
            $query = "ALTER ROLE $rolInsert IDENTIFIED EXTERNALLY";
            $stid = oci_parse($conn, $query);
            oci_execute($stid);
            $this->showMessage('Rol modificado satisfactoriamente.');
        } else if ($radioButtonFour == on) {
            $query = "ALTER ROLE $rolInsert IDENTIFIED GLOBALLY";
            $stid = oci_parse($conn, $query);
            oci_execute($stid);
            $this->showMessage('Rol modificado satisfactoriamente.');
        }
        oci_close($conn);
    }

    //funcion de oracle para enviar a interfas el 
    //listado de roles que tiene un usuario
    function oracleMuestraRolesAsignadosUserAction()
    {
        $roles = array();
        $key = 0;
        //$check = false;
        $rSA = new ZendExt_RSA_Facade();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $limit = $start + $limit - 1;
        $usuarioRol = $this->_request->getPost('usuariorol');
        $query = "select ROLE from ( select rownum parte,ROLE"
            ." from (select ROLE from dba_roles" 
            ." where role <> '$usuarioRol'" 
            ." and PASSWORD_REQUIRED <> 'GLOBAL'))"
            ." where parte between $start and $limit";
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        $queryOne = "select * from dba_role_privs where GRANTEE='$usuarioRol'";
        $stidOne = oci_parse($conn, $queryOne);
        while ($row = oci_fetch_array($stid, OCI_ASSOC)) {
            $roles[$key]['rol'] = $row['ROLE'];
            $roles[$key]['grentee'] = false;
            $roles[$key]['opcion'] = false;
            $roles[$key]['pordefecto'] = false;
            oci_execute($stidOne);
            while ($rowOne = oci_fetch_array($stidOne, OCI_ASSOC)) {
                if ($row['ROLE'] == $rowOne['GRANTED_ROLE']) {
                    $roles[$key]['grentee'] = true;
                    if ($rowOne['ADMIN_OPTION'] == "YES") {
                        $roles[$key]['opcion'] = true;
                    }
                    if ($rowOne['DEFAULT_ROLE'] == "YES") {
                        $roles[$key]['pordefecto'] = true;
                    }
                }
            }
            $key++;
        }
        $arr = array();
        $consultCant = "select count (*) as cantidad "
            . "from dba_roles where role <> '$usuarioRol' "
            . "and PASSWORD_REQUIRED <> 'GLOBAL'";
        $stidOne = oci_parse($conn, $consultCant);
        oci_execute($stidOne);
        $row = oci_fetch_array($stidOne, OCI_ASSOC);
        $cantidad = $row['CANTIDAD'];
        $arr['cantidad_filas'] = $cantidad;
        $arr['datos'] = $roles;
        oci_close($conn);
        echo json_encode($arr);
    }

    //funcion de oracle para enviar a interfas el listado 
    //de roles que tiene un rol
    function oracleMuestraRolesAsignadosRolAction()
    {
        $roles = array();
        $key = 0;
        //$check = false;
        $rSA = new ZendExt_RSA_Facade();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $limit = $start + $limit - 1;
        $usuarioRol = $this->_request->getPost('usuariorol');
        $query = "select ROLE from (select rownum parte,ROLE
		            from (select ROLE from dba_roles 
                            where role <> '$usuarioRol' and 
                            PASSWORD_REQUIRED <> 'GLOBAL'))
		            where parte between $start and $limit";
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        $queryOne = "select * from dba_role_privs where GRANTEE='$usuarioRol'";
        $stidOne = oci_parse($conn, $queryOne);
        while ($row = oci_fetch_array($stid, OCI_ASSOC)) {
            $roles[$key]['rol'] = $row['ROLE'];
            $roles[$key]['grentee'] = false;
            $roles[$key]['opcion'] = false;
            oci_execute($stidOne);
            while ($rowOne = oci_fetch_array($stidOne, OCI_ASSOC)) {
                if ($row['ROLE'] == $rowOne['GRANTED_ROLE']) {
                    $roles[$key]['grentee'] = true;
                    if ($rowOne['ADMIN_OPTION'] == "YES") {
                        $roles[$key]['opcion'] = true;
                    }
                }
            }
            $key++;
        }
        $arr = array();
        $consultCant = "select count (*) as cantidad from dba_roles "
            . "where role <> '$usuarioRol' and " . "
        PASSWORD_REQUIRED <> 'GLOBAL'";
        $stidOne = oci_parse($conn, $consultCant);
        oci_execute($stidOne);
        $row = oci_fetch_array($stidOne, OCI_ASSOC);
        $cantidad = $row['CANTIDAD'];
        $arr['cantidad_filas'] = $cantidad;
        $arr['datos'] = $roles;
        oci_close($conn);
        echo json_encode($arr);
    }

    //funcion de oracle para enviar a interfas el listado de privilegios 
    //que tiene un usuario o un rol
    function oracleMuestraPrivilegiosAsignadosAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        $key = 0;
        $privilegios = array();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" . "
        (CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $limit = $this->_request->getPost('limit');
        $start = $this->_request->getPost('start');
        $limit = $start + $limit - 1;
        $usuarioRol = $this->_request->getPost('usuariorol');
        $query = "SELECT PRIVILEGE FROM ( SELECT rownum parte,PRIVILEGE" 
            ." FROM ( SELECT distinct (PRIVILEGE)"
            ." FROM dba_sys_privs where" 
            ." PRIVILEGE <> 'ADMINISTER RESOURCE MANAGER' order by PRIVILEGE ))"
            ." WHERE parte between $start and $limit";
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        $queryOne = "select * from dba_sys_privs where GRANTEE='$usuarioRol'";
        $stidOne = oci_parse($conn, $queryOne);
        while ($row = oci_fetch_array($stid, OCI_ASSOC)) {
            $privilegios[$key]['privilegio'] = $row['PRIVILEGE'];
            $privilegios[$key]['grantee'] = false;
            $privilegios[$key]['opcion'] = false;
            oci_execute($stidOne);
            while ($rowOne = oci_fetch_array($stidOne, OCI_ASSOC)) {
                if ($rowOne['PRIVILEGE'] == $row['PRIVILEGE']) {
                    $privilegios[$key]['grantee'] = true;
                    if ($rowOne['ADMIN_OPTION'] == "YES") {
                        $privilegios[$key]['opcion'] = true;
                    }
                }
            }
            $key++;
        }
        $arr = array();
        $consultCant = "select count (distinct (PRIVILEGE)) as cantidad "
            . "from dba_sys_privs order by PRIVILEGE";
        $stidOne = oci_parse($conn, $consultCant);
        oci_execute($stidOne);
        $row = oci_fetch_array($stidOne, OCI_ASSOC);
        $cantidad = $row['CANTIDAD'];
        $arr['cantidad_filas'] = $cantidad;
        $arr['datos'] = $privilegios;
        oci_close($conn);
        echo json_encode($arr);
    }

    //Funcion de oracle para darle privilegios a un Usuario o Rol 
    function oracleDarPrivilegiosAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        //$arreglOption = array();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $usuario = $this->_request->getPost('usuario');
        $arreglo = json_decode(
            stripslashes($this->_request->getPost('listadoPrivilegiosAcceso'))
        );
        foreach ($arreglo as $datos) {
            if ($datos[1] == false) {
                $queryFive = "select * from dba_sys_privs where grantee = "
                    . "'$usuario' and privilege = '$datos[0]'";
                $stidFive = oci_parse($conn, $queryFive);
                oci_execute($stidFive);
                $row = oci_fetch_array($stidFive, OCI_ASSOC);
                if ($row != null) {
                    $queryOne = "revoke $datos[0] from $usuario";
                    $stidOne = oci_parse($conn, $queryOne);
                    oci_execute($stidOne);
                }
            }
        }
        foreach ($arreglo as $datos) {
            if (($datos[1] == true) && ($datos[2] == true)) {
                $queryTwo = "GRANT $datos[0] TO $usuario WITH ADMIN OPTION";
                $stidTwo = oci_parse($conn, $queryTwo);
                oci_execute($stidTwo);
            }
        }
        foreach ($arreglo as $datos) {
            if (($datos[1] == true) && ($datos[2] == false)) {
                $queryFive = "select * from dba_sys_privs where grantee = "
                    . "'$usuario' and privilege = '$datos[0]'";
                $stidFive = oci_parse($conn, $queryFive);
                oci_execute($stidFive);
                $row = oci_fetch_array($stidFive, OCI_ASSOC);
                if ($row != null) {
                    $queryOne = "revoke $datos[0] from $usuario";
                    $stidOne = oci_parse($conn, $queryOne);
                    oci_execute($stidOne);
                }
                $queryTwo = "GRANT $datos[0] TO $usuario";
                $stidTwo = oci_parse($conn, $queryTwo);
                oci_execute($stidTwo);
            }
        }
        //   $this->showMessage('Privilegios asignados satisfactoriamente.');
        oci_close($conn);
    }

    //Funcion de oracle para asignarle roles a un rol
    function oracleDarRolaRolAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        //$arreglOption = array();
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $usuario = $this->_request->getPost('usuario');
        $arreglo = json_decode(
            stripslashes($this->_request->getPost('listadoPrivilegiosAcceso'))
        );
        foreach ($arreglo as $datos) {
            if ($datos[1] == false) {
                $queryFive = "select * from dba_role_privs where grantee = "
                    . "'$usuario' and GRANTED_ROLE = '$datos[0]'";
                $stidFive = oci_parse($conn, $queryFive);
                oci_execute($stidFive);
                $row = oci_fetch_array($stidFive, OCI_ASSOC);
                if ($row != null) {
                    $queryOne = "revoke $datos[0] from $usuario";
                    $stidOne = oci_parse($conn, $queryOne);
                    oci_execute($stidOne);
                }
            }
        }
        foreach ($arreglo as $datos) {
            if (($datos[1] == true) && ($datos[2] == true)) {
                $queryTwo = "GRANT $datos[0] TO $usuario WITH ADMIN OPTION";
                $stidTwo = oci_parse($conn, $queryTwo);
                oci_execute($stidTwo);
            }
        }
        foreach ($arreglo as $datos) {
            if (($datos[1] == true) && ($datos[2] == false)) {
                $queryFive = "select * from dba_role_privs where grantee = "
                    . "'$usuario' and GRANTED_ROLE = '$datos[0]'";
                $stidFive = oci_parse($conn, $queryFive);
                oci_execute($stidFive);
                $row = oci_fetch_array($stidFive, OCI_ASSOC);
                if ($row != null) {
                    $queryOne = "revoke $datos[0] from $usuario";
                    $stidOne = oci_parse($conn, $queryOne);
                    oci_execute($stidOne);
                }
                $queryTwo = "GRANT $datos[0] TO $usuario";
                $stidTwo = oci_parse($conn, $queryTwo);
                oci_execute($stidTwo);
            }
        }
        //  $this->showMessage('Privilegios asignados satisfactoriamente.');
        oci_close($conn);
    }

    //Funcion de oracle para asignar roles a un Usuario 
    function oracleAsignarRolesAUsuariosAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        $arr = array();
        $auxiliar = array();
        $pos = 0;
        $cadena = null;
        //$gestor = $this->_request->getPost('gestor');
        $puerto = $this->_request->getPost('puerto');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" 
            . "(CONNECT_DATA = (SID = $sID)))";
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $usuario = $this->_request->getPost('usuario');
        $arreglo = json_decode(
            stripslashes($this->_request->getPost('listadoPrivilegiosAcceso'))
        );
        $defecto = json_decode(
            stripslashes($this->_request->getPost('listadoDefecto'))
        );
        $defectoFalse = json_decode(
            stripslashes($this->_request->getPost('listadoDefectoFalse'))
        );
        foreach ($arreglo as $datos) {
            if ($datos[1] == false) {
                $queryFive = "select * from dba_role_privs where grantee = "
                    . "'$usuario' and GRANTED_ROLE = '$datos[0]'";
                $stidFive = oci_parse($conn, $queryFive);
                oci_execute($stidFive);
                $row = oci_fetch_array($stidFive, OCI_ASSOC);
                if ($row != null) {
                    $queryOne = "revoke $datos[0] from $usuario";
                    $stidOne = oci_parse($conn, $queryOne);
                    oci_execute($stidOne);
                }
            }
        }
        foreach ($arreglo as $datos) {
            if (($datos[1] == true) && ($datos[2] == true)) {
                $queryTwo = "GRANT $datos[0] TO $usuario WITH ADMIN OPTION";
                $stidTwo = oci_parse($conn, $queryTwo);
                oci_execute($stidTwo);
            }
        }
        foreach ($arreglo as $datos) {
            if (($datos[1] == true) && ($datos[2] == false)) {
                $queryFive = "select * from dba_role_privs where grantee = "
                    . "'$usuario' and GRANTED_ROLE = '$datos[0]'";
                $stidFive = oci_parse($conn, $queryFive);
                oci_execute($stidFive);
                $row = oci_fetch_array($stidFive, OCI_ASSOC);
                if ($row != null) {
                    $queryOne = "revoke $datos[0] from $usuario";
                    $stidOne = oci_parse($conn, $queryOne);
                    oci_execute($stidOne);
                }
                $queryTwo = "GRANT $datos[0] TO $usuario";
                $stidTwo = oci_parse($conn, $queryTwo);
                oci_execute($stidTwo);
            }
        }
        $queryFive = "select GRANTED_ROLE,DEFAULT_ROLE,grantee
                   from dba_role_privs where DEFAULT_ROLE='YES' 
                   and grantee = '$usuario'";
        $stidFive = oci_parse($conn, $queryFive);
        oci_execute($stidFive);
        while ($row = oci_fetch_array($stidFive, OCI_ASSOC)) {
            $arr[$pos] = $row['GRANTED_ROLE'];
            $pos++;
        }
        $auxiliar = $arr;
        for ($i = 0; $i < count($arr); $i++) {
            for ($j = 0; $j < count($defectoFalse); $j++) {
                if ($arr[$i] == $defectoFalse[$j]) {
                    unset($auxiliar[$i]);
                }
            }
        }
        $arr = array_values($auxiliar);
        $auxiliar = $arr;
        for ($i = 0; $i < count($arr); $i++) {
            for ($j = 0; $j < count($defecto); $j++) {
                if ($arr[$i] == $defecto[$j]) {
                    unset($auxiliar[$i]);
                }
            }
        }
        $arr = array_values($auxiliar);
        $cadenaTwo = implode(",", $defecto);
        $cadenaOne = implode(",", $arr);
        if ($defecto[0] == null && $arr[0] != null)
            $cadena = $cadenaOne;
        if ($defecto[0] != null && $arr[0] == null)
            $cadena = $cadenaTwo;
        if ($defecto[0] != null && $arr[0] != null)
            $cadena = $cadenaTwo . "," . $cadenaOne;
        if ($defecto[0] == null && $arr[0] == null)
            $cadena = "NONE";
        $queryFour = "ALTER USER $usuario DEFAULT ROLE $cadena";
        $stidFour = oci_parse($conn, $queryFour);
        oci_execute($stidFour);
        $auxiliar = null;
        //$this->showMessage('Roles asignados satisfactoriamente.');
        oci_close($conn);
    }

    /*private function devolverDatosRol($array)
    {
        foreach ($array as $key => $valores) {
            $roles[$key]['oid'] = $valores['oid'];
            $roles[$key]['rolname'] = $valores['rolname'];
            $roles[$key]['rolsuper'] = $valores['rolsuper'];
            $roles[$key]['rolinherit'] = $valores['rolinherit'];
            $roles[$key]['rolcreaterole'] = $valores['rolcreaterole'];
            $roles[$key]['rolcreatedb'] = $valores['rolcreatedb'];
            $roles[$key]['rolcatupdate'] = $valores['rolcatupdate'];
            $roles[$key]['rolcanlogin'] = $valores['rolcanlogin'];
            $roles[$key]['rolpassword'] = $valores['rolpassword'];
            if (isset($valores['rolvaliduntil'])) {
                $separar = explode(' ', $valores['rolvaliduntil']);
                $roles[$key]['fechainicio'] = $separar[0];
                $separar = explode(':', $separar[1]);
                $roles[$key]['horaaa'] = $separar[0] . ':' . $separar[1];
            } else {
                $roles[$key]['fechainicio'] = '';
                $roles[$key]['horaaa'] = '';
            }
        }

        return $roles;
    }*/

    function insertarRolBaseDatoAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        $gestor = $this->_request->getPost('gestor');
        $function = $gestor . 'Insert';
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $bd = $this->_request->getPost('bd');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $roleName = $this->_request->getPost('rolname');
        $password = $this->_request->getPost('contrasena');
        $dateExpires = $this->_request->getPost('fechainicio');
        $hora = $this->_request->getPost('horaaa');
        $permisos = $this->_request->getPost('permisos');
        $rolsuper = $this->_request->getPost('rolsuper');
        $rolcreatedb = $this->_request->getPost('rolcreatedb');
        $rolcreaterole = $this->_request->getPost('rolcreaterole');
        $rolcatupdate = $this->_request->getPost('rolcatupdate');
        $this->$function(
            $ipgestorbd, $gestor, $bd, $user, $pass, $idservidor, $idgestor, 
            $roleName, $password, $dateExpires, $hora, $permisos, $rolsuper, 
            $rolcreatedb, $rolcreaterole, $rolcatupdate
        );
        $this->showMessage('Rol insertado satisfactoriamente');
    }

    function modificarRolBaseDatoAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        $gestor = $this->_request->getPost('gestor');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $bd = $this->_request->getPost('bd');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $function = $gestor . 'ModifyRole';
        $oid = $this->_request->getPost('oid');
        $rolname = $this->_request->getPost('rolname');
        $password = $this->_request->getPost('contrasena');
        $dateExpires = $this->_request->getPost('fechainicio');
        $hora = $this->_request->getPost('horaaa');
        $permisos = $this->_request->getPost('permisos');
        $rolsuper = $this->_request->getPost('rolsuper');
        $rolcreatedb = $this->_request->getPost('rolcreatedb');
        $rolcreaterole = $this->_request->getPost('rolcreaterole');
        $rolcatupdate = $this->_request->getPost('rolcatupdate');
        $this->$function(
            $ipgestorbd, $gestor, $bd, $user, $pass, $idservidor, $idgestor,
            $oid, $rolname, $password, $dateExpires, $hora, $permisos, 
            $rolsuper, $rolcreatedb, $rolcreaterole, $rolcatupdate
        );
        $this->showMessage('Rol modificado satisfactoriamente');
    }

    function eliminarRolesDBAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        $gestor = $this->_request->getPost('gestor');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $bd = $this->_request->getPost('bd');
        $function = $gestor . 'DeleteRole';
        $oid = $this->_request->getPost('oid');
        $rolname = $this->_request->getPost('rolname');
        $idservidor = $this->_request->getPost('idservidor');
        $idgestor = $this->_request->getPost('idgestor');
        $this->$function(
            $ipgestorbd, $gestor, $bd, $idservidor, $idgestor,
            $user, $pass, $oid, $rolname
        );
        $this->showMessage('Rol eliminado satisfactoriamente');
    }

    /*private function pgsqlInsert($ipgestorbd, $gestor, $bd, $user, $pass, 
        $idservidor, $idgestor, $roleName, $password, $dateExpires, 
        $hora, $permisos, $rolsuper, $rolcreatedb, $rolcreaterole, $rolcatupdate
    )
    {
        $dm = Doctrine_Manager::getInstance();
        $nameCurrentConn = $dm->getCurrentConnection()->getName();
        $conn = $dm->openConnection(
            "$gestor://$user:$pass@$ipgestorbd/$bd", 'pg_catalog'
        );
        $newObj = new ZendExt_Db_Role_Pgsql();
        $newObj->roleName = $roleName;
        $newObj->password = $password;
        $newObj->dateExpires = $dateExpires;
        if ($hora)
            $newObj->timeExpires = $hora;
        if ($permisos == 'on')
            $newObj->inherit = true;
        if ($rolsuper == 'on')
            $newObj->superUser = true;
        if ($rolcreatedb == 'on')
            $newObj->canCreateDb = true;
        if ($rolcreaterole == 'on')
            $newObj->canCreateRole = true;
        if ($rolcatupdate == 'on')
            $newObj->canUpdateCat = true;
        $newObj->save($conn);
        $dm->setCurrentConnection($nameCurrentConn);
        $rsa = new ZendExt_RSA_Facade();
        $objRolesbd = new SegRolesbd();
        $objRolesbd->idservidor = $idservidor;
        $objRolesbd->idgestor = $idgestor;
        $objRolesbd->nombrerol = $roleName;
        $objRolesbd->passw = $rsa->encrypt($password);
        $objRolesbd->save();
    }*/

    /*private function pgsqlModifyRole(
        $ipgestorbd, $gestor, $bd, $user, $pass, $idservidor, $idgestor, $oid, 
        $rolname, $password, $dateExpires, $hora, $permisos, $rolsuper, 
        $rolcreatedb, $rolcreaterole, $rolcatupdate
    )
    {
        $dm = Doctrine_Manager::getInstance();
        $nameCurrentConn = $dm->getCurrentConnection()->getName();
        $conn = $dm->openConnection(
            "$gestor://$user:$pass@$ipgestorbd/$bd", 'pg_catalog'
        );
        $newObj = new ZendExt_Db_Role_Pgsql();
        $result = $newObj->find($oid, $conn);
        $name = $result->lastFindObject->rolname;
        $result->roleName = $rolname;
        $result->dateExpires = $dateExpires;
        $result->timeExpires = $hora;
        if ($password)
            $result->password = $password;
        if ($permisos == 'on')
            $result->inherit = true;
        else
            $result->inherit = false;
        if ($rolsuper == 'on')
            $result->superUser = true;
        else
            $result->superUser = false;
        if ($rolcreatedb == 'on')
            $result->canCreateDb = true;
        else
            $result->canCreateDb = false;
        if ($rolcreaterole == 'on')
            $result->canCreateRole = true;
        else
            $result->canCreateRole = false;
        if ($rolcatupdate == 'on')
            $result->canUpdateCat = true;
        else
            $result->canUpdateCat = false;
        $result->save($conn);
        $dm->setCurrentConnection($nameCurrentConn);
        $this->updateSegRolesbd(
            $name, $rolname, $idservidor, $idgestor, $password
        );
    }*/

    private function updateSegRolesbd(
        $name, $rolname, $idservidor, $idgestor, $password
    )
    {
        if ($name != $rolname) {
            $rsa = new ZendExt_RSA_Facade();
            $exist = SegRolesbd::exist($name, $idservidor, $idgestor);
            if (count($exist)) {
                $objRolesbd = Doctrine::getTable('SegRolesbd')
                    ->find($exist[0]->idrolesbd);
                $objRolesbd->nombrerol = $rolname;
                if ($password)
                    $objRolesbd->passw = $rsa->encrypt($password);
                $objRolesbd->save();

                return;
            } else {
                $obj = new SegRolesbd();
                $obj->idservidor = $idservidor;
                $obj->idgestor = $idgestor;
                $obj->nombrerol = $rolname;
                $obj->passw = $rsa->encrypt($password);
                $obj->save();

                return;
            }
        } elseif ($password) {
            $rsa = new ZendExt_RSA_Facade();
            $exist = SegRolesbd::exist($rolname, $idservidor, $idgestor);
            if (count($exist)) {
                $objRolesbd = Doctrine::getTable('SegRolesbd')
                    ->find($exist[0]->idrolesbd);
                $objRolesbd->passw = $rsa->encrypt($password);
                $objRolesbd->save();

                return;
            } else {
                $obj = new SegRolesbd();
                $obj->idservidor = $idservidor;
                $obj->idgestor = $idgestor;
                $obj->nombrerol = $rolname;
                $obj->passw = $rsa->encrypt($password);
                $obj->save();

                return;
            }
        }
    }

    /*private function pgsqlDeleteRole(
        $ipgestorbd, $gestor, $bd, $idservidor, 
        $idgestor, $user, $pass, $oid, $rolname
    )
    {
        $exist = SegRolesbd::exist($rolname, $idservidor, $idgestor);
        if (!$this->verifySistems($exist[0]->idrolesbd)) {
            SegRolesbd::deleteRol($exist[0]->idrolesbd);
            $dm = Doctrine_Manager::getInstance();
            $nameCurrentConn = $dm->getCurrentConnection()->getName();
            $conn = $dm->openConnection(
                "$gestor://$user:$pass@$ipgestorbd/$bd", 'pg_catalog'
            );
            $newObj = new ZendExt_Db_Role_Pgsql();
            $result = $newObj->find($oid, $conn);
            $result->delete($conn);
            $dm->setCurrentConnection($nameCurrentConn);
        } else
            throw new ZendExt_Exception('SEGRBD01');
    }*/

    private function verifySistems($idrolesbd)
    {
        if (DatSistemaDatServidores::countSistemsByIdrolesBd($idrolesbd) > 0)
            return true;

        return false;
    }

    function getcriteriosAction()
    {
        $datos = array(0 => array("criterio" => "Tablas"), 
            1 => array("criterio" => "Vistas"),
            2 => array("criterio" => "Secuencias"), 
            3 => array("criterio" => "Esquemas"),
            4 => array("criterio" => "Bases de dato"),
            5 => array("criterio" => "Funciones")
        );
        echo json_encode($datos);
    }

    function configridAction()
    {
        $result = $result = array('grid' => array('columns' => array()));
        $criterio = $this->_request->getPost('criterio');
        $criterio = $this->criterios["$criterio"];
        switch ($criterio) {
            case "Tables":
                $fields = array(
                    0 => "name",
                    1 => "OWN",
                    2 => "SEL",
                    3 => "INS",
                    4 => "UPD", 
                    5 => "DEL",
                    6 => "REF",
                    "TRIG"
                );
                break;
            case 'Views':
                $fields = array(
                    0 => "name", 
                    1 => "OWN",
                    2 => "SEL", 
                    3 => "INS", 
                    4 => "UPD", 
                    5 => "DEL", 
                    6 => "REF",
                    "TRIG"
                );
                break;
            case "Sequences":
                $fields =array(0 => "name", 1 => "SEL", 2 => "UPD", 3 => "USG");
                break;
            case "Schemas":
                $fields =array(0 => "name", 1 => "OWN", 2 => "CRT", 3 => "USG");
                break;
            case "Databases":
                $fields = array(
                    0 => "name",
                    1 => "OWN",
                    2 => "CONN", 
                    3 => "CRT", 
                    4 => "TMP"
                );
                break;
            case "Functions":
                $fields = array(0 => "name", 1 => "OWN", 2 => "EXEC");
                break;
        }
        foreach ($fields as $field) {
            $header = ucwords($field);
            if ($field == 'name')
                $result ['grid'] ['columns'] [] = array(
                    'header' => $header, 
                    'width' => 300, 
                    'sortable' => true,
                    'dataIndex' => $field, 
                    'editor' => true
                );
            else
                $result ['grid'] ['columns'] [] = array(
                    'header' => $header, 
                    'width' => 50, 
                    'sortable' => true,
                    'dataIndex' => $field, 
                    'editor' => true
                );
            $result ['grid'] ['campos'] [] = $field;
        }
        echo json_encode($result);
    }

    function cargargriddatosAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        $limit = $this->_request->getPost('limit');
        $idrolselec = $this->_request->getPost('idrolselec');
        $offset = $this->_request->getPost('start');
        $rolbd = $this->_request->getPost('rolbd');
        $gestor = $this->_request->getPost('gestor');
        $criterio = $this->_request->getPost('criterio');
        $criterio = $this->criterios[$criterio];
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $bd = $this->_request->getPost('bd');
        $esqSelected = $this->_request->getPost('esqSelected');
        $dm = Doctrine_Manager::getInstance();
        $nameCurrentConn = $dm->getCurrentConnection()->getName();
        $conn = $dm->openConnection(
            "$gestor://$user:$pass@$ipgestorbd/$bd", 'pg_catalog'
        );
        $funcion = $gestor . 'DataByCritery';
        $result = $this->$funcion(
            $conn, $limit, $offset, $criterio, $rolbd, $idrolselec, $esqSelected
        );
        $dm->setCurrentConnection($nameCurrentConn);
        echo json_encode($result);
    }

    /*private function pgsqlDataByCritery(
        $conn, $limit, $offset, $criterio, $rolbd, $idrolselec, $esqSelected
    )
    {
        switch ($criterio) {
            case "Tables":
                if ($esqSelected) {
                    $result = PgNamespace::getInformationByCriteria(
                        $conn, $criterio, $esqSelected, $limit, $offset
                    )
                        ->toArray(true);
                    $filas = PgNamespace::getCantRecordsByCriteria(
                        $conn, $criterio, $esqSelected
                    );
                } else {
                    $result = PgNamespace::getInformation(
                        $conn, $criterio, $limit, $offset
                    )->toArray(true);
                    $filas = PgNamespace::getCantRecords($conn, $criterio);
                }
                foreach ($result as $key => $valores) {
                    $datos[$key]['name'] = $valores['PgNamespace']['nspname'] 
                        . '.' . $valores['name'];
                    if ($idrolselec == $valores['relowner'])
                        $datos[$key]['OWN'] = true;
                    else
                        $datos[$key]['OWN'] = false;
                    $result = $this->armarPermisos(
                        $valores['relacl'], $rolbd, $criterio
                    );
                    if (isset($result['INS']))
                        $datos[$key]['INS'] = $result['INS'];
                    else
                        $datos[$key]['INS'] = false;
                    if (isset($result['SEL']))
                        $datos[$key]['SEL'] = $result['SEL'];
                    else
                        $datos[$key]['SEL'] = false;
                    if (isset($result['UPD']))
                        $datos[$key]['UPD'] = $result['UPD'];
                    else
                        $datos[$key]['UPD'] = false;
                    if (isset($result['DEL']))
                        $datos[$key]['DEL'] = $result['DEL'];
                    else
                        $datos[$key]['DEL'] = false;
                    if (isset($result['REF']))
                        $datos[$key]['REF'] = $result['REF'];
                    else
                        $datos[$key]['REF'] = false;
                    if (isset($result['TRIG']))
                        $datos[$key]['TRIG'] = $result['TRIG'];
                    else
                        $datos[$key]['TRIG'] = false;
                }
                $array = array('cantidad' => $filas, 'datos' => $datos);
                break;
            case 'Views':
                if ($esqSelected) {
                    $result = PgNamespace::getInformationByCriteria(
                        $conn, $criterio, $esqSelected, $limit, $offset
                    )
                        ->toArray(true);
                    $filas = PgNamespace::getCantRecordsByCriteria(
                        $conn, $criterio, $esqSelected
                    );
                } else {
                    $result = PgNamespace::getInformation(
                        $conn, $criterio, $limit, $offset
                    )->toArray(true);
                    $filas = PgNamespace::getCantRecords($conn, $criterio);
                }
                foreach ($result as $key => $valores) {
                    $datos[$key]['name'] = $valores['PgNamespace']['nspname'] 
                        . '.' . $valores['name'];
                    if ($idrolselec == $valores['relowner'])
                        $datos[$key]['OWN'] = true;
                    else
                        $datos[$key]['OWN'] = false;
                    $result = $this->armarPermisos(
                        $valores['relacl'], $rolbd, $criterio
                    );
                    if (isset($result['INS']))
                        $datos[$key]['INS'] = $result['INS'];
                    else
                        $datos[$key]['INS'] = false;
                    if (isset($result['SEL']))
                        $datos[$key]['SEL'] = $result['SEL'];
                    else
                        $datos[$key]['SEL'] = false;
                    if (isset($result['UPD']))
                        $datos[$key]['UPD'] = $result['UPD'];
                    else
                        $datos[$key]['UPD'] = false;
                    if (isset($result['DEL']))
                        $datos[$key]['DEL'] = $result['DEL'];
                    else
                        $datos[$key]['DEL'] = false;
                    if (isset($result['REF']))
                        $datos[$key]['REF'] = $result['REF'];
                    else
                        $datos[$key]['REF'] = false;
                    if (isset($result['TRIG']))
                        $datos[$key]['TRIG'] = $result['TRIG'];
                    else
                        $datos[$key]['TRIG'] = false;
                }
                $array = array('cantidad' => $filas, 'datos' => $datos);
                break;
            case "Sequences":
                if ($esqSelected) {
                    $result = PgNamespace::getInformationByCriteria(
                        $conn, $criterio, $esqSelected, $limit, $offset
                    )
                        ->toArray(true);
                    $filas = PgNamespace::getCantRecordsByCriteria(
                        $conn, $criterio, $esqSelected
                    );
                } else {
                    $result = PgNamespace::getInformation(
                        $conn, $criterio, $limit, $offset
                    )->toArray(true);
                    $filas = PgNamespace::getCantRecords($conn, $criterio);
                }
                foreach ($result as $key => $valores) {
                    $datos[$key]['name'] = $valores['PgNamespace']['nspname'] 
                        . '.' . $valores['name'];
                    if ($idrolselec == $valores['relowner'])
                        $datos[$key]['OWN'] = true;
                    else
                        $datos[$key]['OWN'] = false;
                    $result = $this->armarPermisos(
                        $valores['relacl'], $rolbd, $criterio
                    );
                    if (isset($result['SEL']))
                        $datos[$key]['SEL'] = $result['SEL'];
                    else
                        $datos[$key]['SEL'] = false;
                    if (isset($result['UPD']))
                        $datos[$key]['UPD'] = $result['UPD'];
                    else
                        $datos[$key]['UPD'] = false;
                    if (isset($result['USG']))
                        $datos[$key]['USG'] = $result['USG'];
                    else
                        $datos[$key]['USG'] = false;
                }
                $array = array('cantidad' => $filas, 'datos' => $datos);
                break;
            case "Schemas":
                if ($esqSelected) {
                    $result = PgNamespace::getInformationSchemasByCriteria(
                        $conn, $esqSelected, $limit, $offset
                    )->toArray(true);
                    $filas = PgNamespace::getRecordsSchemasByCriteria(
                        $conn, $esqSelected
                    );
                } else {
                    $result = PgNamespace::getInformationSchemas(
                        $conn, $limit, $offset
                    )->toArray(true);
                    $filas = PgNamespace::getRecordsSchemas($conn);
                }
                foreach ($result as $key => $valores) {
                    $datos[$key]['name'] = $valores['nspname'];
                    if ($valores['nspowner'] == $idrolselec)
                        $datos[$key]['OWN'] = true;
                    else
                        $datos[$key]['OWN'] = false;
                    $result = $this->armarPermisos(
                        $valores['nspacl'], $rolbd, $criterio
                    );
                    if (isset($result['CRT']))
                        $datos[$key]['CRT'] = $result['CRT'];
                    else
                        $datos[$key]['CRT'] = false;
                    if (isset($result['USG']))
                        $datos[$key]['USG'] = $result['USG'];
                    else
                        $datos[$key]['USG'] = false;
                }
                $array = array('cantidad' => $filas, 'datos' => $datos);
                break;
            case "Databases":
                if ($esqSelected) {
                    $result = PgDatabase::getInformationDatabasesByCriteria(
                        $conn, $esqSelected, $limit, $offset
                    )->toArray(true);
                    $filas = PgDatabase::getRecordsDatabasesByCriteria(
                        $conn, $esqSelected
                    );
                } else {
                    $result = PgDatabase::getInformationDatabases(
                        $conn, $limit, $offset
                    )->toArray(true);
                    $filas = PgDatabase::getRecordsDatabases($conn);
                }
                foreach ($result as $key => $valores) {
                    $datos[$key]['name'] = $valores['datname'];
                    if ($valores['datdba'] == $idrolselec)
                        $datos[$key]['OWN'] = true;
                    else
                        $datos[$key]['OWN'] = false;
                    $result = $this
                        ->armarPermisos($valores['datacl'], $rolbd, $criterio);
                    if (isset($result['CRT']))
                        $datos[$key]['CRT'] = $result['CRT'];
                    else
                        $datos[$key]['CRT'] = false;
                    if (isset($result['CONN']))
                        $datos[$key]['CONN'] = $result['CONN'];
                    else
                        $datos[$key]['CONN'] = false;
                    if (isset($result['TMP']))
                        $datos[$key]['TMP'] = $result['TMP'];
                    else
                        $datos[$key]['TMP'] = false;
                }
                $array = array('cantidad' => $filas, 'datos' => $datos);
                break;
            case "Functions":
                if ($esqSelected) {
                    $result = PgProc::getInformationByCriteria(
                        $conn, $esqSelected, $limit, $offset
                    )->toArray(true);
                    $filas = PgProc::getCantRecordsByCriteria(
                        $conn, $esqSelected
                    );
                } else {
                    $result = PgProc::getInformation($conn, $limit, $offset)
                        ->toArray(true);
                    $filas = PgProc::getCantRecords($conn);
                }
                foreach ($result as $key => $valores) {
                    $datos[$key]['name'] = $valores['PgNamespace']['nspname'] 
                        . '.' . $valores['proname'];
                    if ($valores['proowner'] == $idrolselec)
                        $datos[$key]['OWN'] = true;
                    else
                        $datos[$key]['OWN'] = false;
                    $result = $this->armarPermisos(
                        $valores['proacl'], $rolbd, $criterio
                    );
                    if (isset($result['EXEC']))
                        $datos[$key]['EXEC'] = $result['EXEC'];
                    else
                        $datos[$key]['EXEC'] = false;
                }
                $array = array('cantidad' => $filas, 'datos' => $datos);
                break;
        }
        return $array;
    }*/

    /*private function armarPermisos($permisos, $rolbd, $criterio)
    {
        $cadena = $this->armaCadena($permisos);
        $array = explode(',', $cadena);
        $result = array();
        foreach ($array as $valor) {
            $valor = explode('=', $valor);
            if ($valor[0] == $rolbd) {
                $function = 'pgsql' . $criterio;
                $result = $this->$function($valor[1]);
                break;
            } else
                continue;
        }

        return $result;
    }*/

   /* private function armaCadena($nspacl)
    {
        for ($i = 1; $i < strlen($nspacl) - 1; $i++)
            $cadena .= $nspacl[$i];

        return $cadena;
    }*/

    /*private function pgsqlTables($valor)
    {
        $val = explode('/', $valor);
        $result['INS'] = $this->validar($val[0], 'a');
        $result['SEL'] = $this->validar($val[0], 'r');
        $result['UPD'] = $this->validar($val[0], 'w');
        $result['DEL'] = $this->validar($val[0], 'd');
        $result['REF'] = $this->validar($val[0], 'x');
        $result['TRIG'] = $this->validar($val[0], 't');

        return $result;
    }*/

   /* private function pgsqlViews($valor)
    {
        $val = explode('/', $valor);
        $result['INS'] = $this->validar($val[0], 'a');
        $result['SEL'] = $this->validar($val[0], 'r');
        $result['UPD'] = $this->validar($val[0], 'w');
        $result['DEL'] = $this->validar($val[0], 'd');
        $result['REF'] = $this->validar($val[0], 'x');
        $result['TRIG'] = $this->validar($val[0], 't');

        return $result;
    }*/

    /*private function pgsqlSequences($valor)
    {
        $val = explode('/', $valor);
        $result['SEL'] = $this->validar($val[0], 'r');
        $result['UPD'] = $this->validar($val[0], 'w');
        $result['USG'] = $this->validar($val[0], 'U');

        return $result;
    }*/

    /*private function pgsqlSchemas($valor)
    {
        $val = explode('/', $valor);
        $result['USG'] = $this->validar($val[0], 'U');
        $result['CRT'] = $this->validar($val[0], 'C');

        return $result;
    }*/

    /*private function pgsqlDatabases($valor)
    {
        $val = explode('/', $valor);
        $result['CRT'] = $this->validar($val[0], 'C');
        $result['CONN'] = $this->validar($val[0], 'c');
        $result['TMP'] = $this->validar($val[0], 'T');

        return $result;
    }*/

    /*private function pgsqlFunctions($valor)
    {
        $val = explode('/', $valor);
        $result['EXEC'] = $this->validar($val[0], 'X');

        return $result;
    }*/

    /*private function validar($cadena, $caracter)
    {
        for ($i = 0; $i < strlen($cadena); $i++)
            if ($cadena[$i] == $caracter)
                return true;

        return false;
    }*/

    /*private function oracleDataByCritery()
    {
        switch ('') {
            case "Tables":
                break;
            case 'Views':
                break;
            case "Sequences":
                break;
            case "Schemas":
                break;
            case "Databases":
                break;
            case "Functions":
                break;
        }
        return;
    }*/

    function modificarPermisosAction()
    {
        $rSA = new ZendExt_RSA_Facade();
        $arrayAccess = json_decode(
            stripslashes($this->_request->getPost('acceso'))
        );
        $arrayDeny = json_decode(
            stripslashes($this->_request->getPost('denegado'))
        );
        $usuariobd = $this->_request->getPost('usuariobd');
        //$rolbd = $this->_request->getPost('rolbd');
        $gestor = $this->_request->getPost('gestor');
        $criterio = $this->_request->getPost('criterio');
        $user = $this->_request->getPost('user');
        $pass = $rSA->decrypt($this->_request->getPost('passw'));
        $ipgestorbd = $this->_request->getPost('ip');
        $bd = $this->_request->getPost('bd');
        $dm = Doctrine_Manager::getInstance();
        $nameCurrentConn = $dm->getCurrentConnection()->getName();
        $conn = $dm->openConnection(
            "$gestor://$user:$pass@$ipgestorbd/$bd", 'pg_catalog'
        );
        $obj = new ZendExt_Db_Role_Pgsql();
        $obj->modifyAccess(
            $arrayAccess, $arrayDeny, $conn, $usuariobd, $this->lista[$criterio]
        );
        $dm->setCurrentConnection($nameCurrentConn);
        echo("{'cod':1,'mensaje':'Permisos asignados satisfactoriamente.'}");
    }

}
