<?php

/**
 * Created by PhpStorm.
 * User: Miguel Antonio
 * Date: 21/01/2016
 * Time: 01:00 PM
 */
class BuscadorSuinModel extends ZendExt_Model
{
    private $conection, $status, $dirXML;

    public function BuscadorSuinModel()
    {
        parent::ZendExt_Model();
        $this->conection = new PostgreSQl();

    }

    public function connect()
    {
        $dirXML = Zend_Registry::getInstance()->config->modulo_path . 'recursos/config_buscadorSuin/params.xml';
        if (file_exists($dirXML)) {
            $xmldoc = simplexml_load_file($dirXML);
            $server = (string)$xmldoc->server['value'];
            $port = (string)$xmldoc->port['value'];
            $user = (string)$xmldoc->user['value'];
            $pass = (string)$xmldoc->pass['value'];
            $db = (string)$xmldoc->db['value'];
            $this->status = $this->conection->setParametrosBD($server, $db, $user, $pass, $port);

        }
    }

    private function obtenerWhere($numid, $nombre, $papel, $sapel)
    {
        $cadenaReemplazar = $vocales = array("a", "e", "i", "o", "u", "a", "e", "i", "o", "u", "u", " ");
        $cadenaBuscar = $vocales = array("á", "é", "í", "ó", "ú", "à", "è", "ì", "ò", "ù", "ü", "'");

        $sqlWhere = " WHERE 1 = 1 ";

        if ($numid != '') {
            $sqlWhere .= " AND numid like '{$numid}%' ";
        }
        if ($nombre != '') {
            $nombre = trim($nombre);
            $nombre = mb_strtolower($nombre, "UTF-8");
            $nombre = str_replace($cadenaBuscar, $cadenaReemplazar, $nombre);
            $sqlWhere .= " AND mod_persona.sustituiryconvertir(nombre) like '{$nombre}%' ";
        }
        if ($papel != '') {
            $papel = trim($papel);
            $papel = mb_strtolower($papel, "UTF-8");
            $papel = str_replace($cadenaBuscar, $cadenaReemplazar, $papel);
            $sqlWhere .= " AND mod_persona.sustituiryconvertir(papell) like '{$papel}%' ";
        }
        if ($sapel != '') {
            $sapel = trim($sapel);
            $sapel = mb_strtolower($sapel, "UTF-8");
            $sapel = str_replace($cadenaBuscar, $cadenaReemplazar, $sapel);
            $sqlWhere .= " AND mod_persona.sustituiryconvertir(sapell) like '{$sapel}%' ";
        }


        return $sqlWhere;
    }

    /**
     * Busca segun los parametros especificados personas en la base de datos del MININT
     *
     * @param     $numid  Carnet de identidad
     * @param     $nombre Nombre de la persona
     * @param     $papel  Primer apellido
     * @param     $sapel  Segundo apellido
     * @param int $limit Limite de la consulta
     * @param int $start Offset de la consulta
     *
     * @return array
     */
    public function buscarPersona($numid, $nombre, $papel, $sapel, $limit = 20, $start = 0)
    {
        try {
            $this->connect();
        if (empty($numid) && empty($nombre) && empty($papel) && empty($sapel)) {
            return array();
        } else if ($this->status) {
                $conditions = $this->obtenerWhere($numid, $nombre, $papel, $sapel);
                $sql = "SELECT idpersona as idsuin, numid, nombre,snombre ,papell as papel, sapell as sapel,
                (CASE WHEN snombre is null THEN nombre||' ' ||papell||' '|| sapell   ELSE nombre||' ' ||snombre||' ' ||papell||' '|| sapell END) AS nombreapellidos,
                (CASE WHEN sexo='M' THEN '1' ELSE '0' END) as sexo, nompa, nomma, fnac as fechanacimiento,
                fallecido, fechafallecido, talla as estatura, peso, tomo, folio, annoregistrocivil,
                decas as huella, idcondicionmigratoria, idcolorpelo, idcolorojos, '1' as idtipodocidentidad,
                'Carné de indetidad' as denominacion,idcolorpiel, idregistrocivil, idpaisnac, idprovincianac, idmunicipionac,
                idprovinciares,idmunicipiores,direccion,fechares,fechaactualizacion,fallecido , fechafallecido
                FROM mod_persona.dat_persona  {$conditions} ORDER BY nombre LIMIT {$limit} OFFSET {$start}";

                $this->conection->execute('SET enable_seqscan TO FALSE;');
                $this->conection->execute('SET enable_indexscan TO TRUE;');

                $query = $this->conection->select($sql);

                foreach ($query as $k => $v) {
                    $query[$k]['paisprovmuni'] = self::getPais($v['idpaisnac'], 'string') . '/' . self::getProvincia($v['idprovincianac'], 'string') . '/' . self::getMunicipio($v['idmunicipionac'], 'string');
                    $query[$k]['provmunicres'] = self::getProvincia($v['idprovinciares'], 'string') . '/' . self::getMunicipio($v['idmunicipiores'], 'string');
                    $query[$k]['registrocivil'] = self::getRegistroCivil($v['idregistrocivil'], 'string');
                    $query[$k]['colorojos'] = self::getColorOjos($v['idcolorojos'], 'string');
                    $query[$k]['colorpelo'] = self::getColorPelo($v['idcolorpelo'], 'string');
                    $query[$k]['colorpiel'] = self::getColorPiel($v['idcolorpiel'], 'string');
                }
                return array('datos' => $query, 'cantidad' => $this->conection->totalRegistros($sql));
            } else {
                return array('expecion' => 'Error',
                'msg' => 'El servidor de Base de Datos no esta disponible. Por favor intente mas tarde.');
            }
    } catch (Exception $e) {
        throw $e;
        }
    }

    public function getPais($idpais = null, $tipo = 'array')
    {

        $this->connect();

        if ($idpais) {
            $cond = " WHERE idpais ilike '%{$idpais}'";
        }
        $sql = "SELECT idpais,initcap(denominacion) as pais FROM mod_persona.nom_pais {$cond}";

        $res = $this->conection->select($sql);

        if ($tipo == 'string' && !empty($idpais)) {

            $reusl = ucfirst($res[0]['pais']);
        } else {
            $reusl = $res;
        }
        return $reusl;
    }

    public function getProvincia($idprovincia = null, $tipo = 'array')
    {
        $this->connect();
        if ($idprovincia) {
            $cond = " WHERE idprovincia={$idprovincia}";
        }
        $sql = "SELECT idprovincia, initcap(denominacion) as provincia, abrev, siglas, fdesde, fhasta
               FROM mod_persona.nom_provincias {$cond}";
        $res = $this->conection->select($sql);

        if ($tipo == 'string') {
            $reusl = ucfirst($res[0]['provincia']);
        } else {
            $reusl = $res;
        }
        return $reusl;
    }

    public function getMunicipio($idmunicipio = null, $tipo = 'array')
    {
        $this->connect();
        if ($idmunicipio) {
            $cond = " WHERE idmunicipio={$idmunicipio}";
        }
        $sql = "SELECT idprovincia, idmunicipio, initcap(denominacion) as municipio, abrev, fdesde, fhasta,  idnomenclador
              FROM mod_persona.nom_municipios {$cond}";

        $res = $this->conection->select($sql);

        if ($tipo == 'string') {
            $reusl = ucfirst($res[0]['municipio']);
        } else {
            $reusl = $res;
        }
        return $reusl;
    }

    public function getRegistroCivil($idregistrocivil = null, $tipo = 'array')
    {
        $this->connect();
        if ($idregistrocivil) {
            $cond = " WHERE idregistrocivil={$idregistrocivil}";
        }
        $sql = "SELECT idregistrocivil,initcap(denominacion) as registrocivil  FROM mod_persona.nom_registrocivil {$cond}";
        $res = $this->conection->select($sql);

        if ($tipo == 'string') {
            $reusl = ucfirst($res[0]['registrocivil']);
        } else {
            $reusl = $res;
        }
        return $reusl;
    }

    public function getColorOjos($idcolorojos = null, $tipo = 'array')
    {
        $this->connect();
        if ($idregistrocivil) {
            $cond = " WHERE idcolorojos={$idcolorojos}";
        }
        $sql = "SELECT idcolorojos, initcap(denominacion)  as denominacion, fdesde, fhasta FROM mod_persona.nom_colorojos {$cond}";
        $res = $this->conection->select($sql);

        if ($tipo == 'string') {
            $reusl = $res[0]['denominacion'];
        } else {
            $reusl = $res;
        }
        return $reusl;
    }

    public function getColorPelo($idcolorpelo = null, $tipo = 'array')
    {
        $this->connect();
        if ($idregistrocivil) {
            $cond = " WHERE idcolorpelo={$idcolorpelo}";
        }
        $sql = "SELECT idcolorpelo, initcap(denominacion) as denominacion, fdesde, fhasta FROM mod_persona.nom_colorpelo {$cond}";
        $res = $this->conection->select($sql);

        if ($tipo == 'string') {
            $reusl = $res[0]['denominacion'];
        } else {
            $reusl = $res;
        }
        return $reusl;
    }

    public function getColorPiel($idcolorpiel = null, $tipo = 'array')
    {
        $this->connect();
        if ($idregistrocivil) {
            $cond = " WHERE idcolorpiel={$idcolorpiel}";
        }
        $sql = "SELECT idcolorpiel, initcap(denominacion)  as denominacion, fdesde, fhasta FROM mod_persona.nom_colorpiel {$cond}";
        $res = $this->conection->select($sql);

        if ($tipo == 'string') {
            $reusl = $res[0]['denominacion'];
        } else {
            $reusl = $res;
        }
        return $reusl;
    }


    /**
     * Devuelve los parametros de la conexion
     *
     * @return array
     */
    public function getParamConection()
    {
        $dirXML = Zend_Registry::getInstance()->config->modulo_path . 'recursos/config_buscadorSuin/params.xml';
        if (file_exists($dirXML)) {
            $xmldoc = simplexml_load_file($dirXML);
            $r->server = (string)$xmldoc->server['value'];
            $r->port = (string)$xmldoc->port['value'];
            $r->user = (string)$xmldoc->user['value'];
            $r->pass = (string)$xmldoc->pass['value'];
            $r->db = (string)$xmldoc->db['value'];
            return $r;
        } else {
            exit('No existe el archivo ' . $nameFile);
        }
    }

    /**
     * Comprueba conexion al servidor via PDO
     *
     * @param     $server
     * @param int $port
     * @param     $user
     * @param     $pass
     * @param     $db
     *
     * @return bool
     * @throws ZendExt_Exception
     */
    public function checkConection($server, $port = 5432, $user, $pass, $db)
    {
        try {
            $c = new PDO("pgsql:host=$server;dbname=$db", $user, $pass);
            if ($c) {
                $r->success = true;
            } else {
                $r->success = false;
            }

            return $r;
        } catch (PDOException $e) {
            $r->success = false;
            $r->msg = $e->getMessage();

            return $r;
        }
    }

    /**
     * Almacena en XML los parametros de conexion al SUIN
     *
     * @param     $server
     * @param int $port
     * @param     $user
     * @param     $pass
     * @param     $db
     */
    public function saveConection($server, $port = 5432, $user, $pass, $db)
    {
        $dirXML = Zend_Registry::getInstance()->config->modulo_path . 'recursos/config_buscadorSuin/params.xml';
        if (file_exists($dirXML)) {
            $xmldoc = simplexml_load_file($dirXML);
            $xmldoc->server['value'] = $server;
            $xmldoc->port['value'] = $port;
            $xmldoc->user['value'] = $user;
            $xmldoc->pass['value'] = $pass;
            $xmldoc->db['value'] = $db;

            $xml = $xmldoc->asXML();

            $dom = new DOMDocument;
            $dom->loadXML($xml);
            $dom->formatOutput = true;
            if (!$dom->save($dirXML)) {
                exit('Error guardando el XML');
            }
            return true;
        } else {
            exit('No existe el archivo ' . $nameFile);
        }
    }


}