<?php

/**
 * @name GestsistemaController - Clase controladora de sistemas.
 * @package   seguridad.
 * @copyright UCID.
 * @author    Equipo de seguridad UCID.
 * @version   2.0-0
 */
class GestsistemaController extends SeguridadController
{

    /**
     * @name init() - Constructor de la clase.
     */
    function init()
    {
        parent::init();
    }

    /**
     * @name gestsistemaAction() - Función principal de la clase, 
     * encargada de renderiar la vista correspondiente.
     * @return void
     */
    public function gestsistemaAction()
    {
//        $this->view->jsayuda = $this->integrator->ayuda->devolverJS();
        $this->render();
    }

    /**
     * @method insertarsistemaAction - Función usada para adicionar 
     * un nuevo sistema.
     */
    public function insertarsistemaAction()
    {
        $sistema = new DatSistema();
        $idpadre = $this->_request->getPost('idpadre');
        //$idservidorauth = $this->_request->getPost('idservidor');
        $sistema->denominacion = $this->_request->getPost('denominacion');
        $sistema->abreviatura = $this->_request->getPost('abreviatura');
        $sistema->descripcion = $this->_request->getPost('descripcion');
        $sistema->index = $this->_request->getPost('index');
        $sistema->icono = $this->_request->getPost('icono');
        $sistema->iddominio = $this->global->Perfil->iddominio;
        $servidorweb = $this->_request->getPost('servidorweb');
        if ($idpadre == 0) {
            if ($servidorweb) {
                $sistema->externa = $servidorweb;
            }
            $sistema->idpadre = $sistema->idsistema;
            $sistema->save();
        } else {
            $sistema->idpadre = $idpadre;
            $servwebpadre = DatSistema::buscarservidorweb($idpadre);
            if (count($servwebpadre)) {
                $sistema->externa = $servwebpadre[0]->externa;
            }
            $sistema->save();
        }
        $objSistemaComp = new DatSistemaCompartimentacion();
        $objSistemaComp->idsistema = $sistema->idsistema;
        $objSistemaComp->iddominio = $this->global->Perfil->iddominio;
        $objSistemaComp->save();
        $servidoresdeco = json_decode(
            stripcslashes($this->_request->getPost('servidores'))
        );
        $arrayObjServidores = array();
        if (count($servidoresdeco)) {
            $arrayObjServidores = array();
            foreach ($servidoresdeco as $servidor) {
                $servidorsistema = new DatSistemaDatServidores();
                $servidorsistema->idservidor = $servidor[2];
                $idgestor = explode('-', $servidor[3]);
                $servidorsistema->idgestor = $idgestor[0];
                $nombreDb = explode('-', $servidor[4]);
                $servidorsistema->idbd =$this->insertaNomBaseDato($nombreDb[0]);
                $nameesquema = explode('-', $servidor[5]);
                $servidorsistema->idesquema = $this->insertaNomEsquema(
                    $nameesquema[0]
                );
                $servidorsistema->idsistema = $sistema->idsistema;
                $ideolesbd = explode('-', $servidor[6]);
                $servidorsistema->idrolesbd = $ideolesbd[0];
                $arrayObjServidores[] = $servidorsistema;
            }
        }
        $model = new DatSistemaModel();
        $model->insertarsistema($arrayObjServidores, $sistema);
        $this->showMessage('El sistema ha sido adicionado satisfactoriamente.');
    }

    /**
     * @method modificarsistemaAction - Función usada para midificar 
     * un sistema seleccionado.
     */
    public function modificarsistemaAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $sistema = Doctrine::getTable('DatSistema')->find($idsistema);
        $sistema->denominacion = $this->_request->getPost('denominacion');
        $sistema->abreviatura = $this->_request->getPost('abreviatura');
        $sistema->descripcion = $this->_request->getPost('descripcion');
        $sistema->index = $this->_request->getPost('index');
        $externa = $this->_request->getPost('servidorweb');
        $uncollapsed = $this->_request->getPost('externo');
        $sistema->icono = $this->_request->getPost('icono');
        if ($externa) {
            $externa = ($uncollapsed) ? $externa : '';
            $sistema->externa = $externa;
            self::modificarhijos($idsistema, $externa);
        }
        $esquemasEliminados = json_decode(
            stripcslashes($this->_request->getPost('esquemasEliminados'))
        );
        if (count($esquemasEliminados) > 0) {
            foreach ($esquemasEliminados as $esquemaEl) {
                $esquemaElArr = explode('_', $esquemaEl);
                $sql = 'idsistema = ? and idservidor = ? and idgestor = ?'
                    . ' and idbd = ? and idesquema = ?';
                $esquemaELObj = Doctrine::getTable('DatSistemaDatServidores')
                    ->findByDql($sql, $esquemaElArr);
                $esquemaELObj[0]->delete();
            }
        }
        $servidoresdeco = json_decode(
            stripcslashes($this->_request->getPost('servidores'))
        );
        $arrayObjServidores = array();
        if (count($servidoresdeco)) {
            $arrayObjServidores = array();
            foreach ($servidoresdeco as $servidor) {
                $sistServ = new DatSistemaDatServidores();
                $sistServ->idservidor = $servidor[2];
                $idgestor = explode('-', $servidor[3]);
                $sistServ->idgestor = $idgestor[0];
                $nombreDb = explode('-', $servidor[4]);
                $sistServ->idbd = $this->insertaNomBaseDato($nombreDb[0]);
                $nameesquema = explode('-', $servidor[5]);
                $sistServ->idesquema =$this->insertaNomEsquema($nameesquema[0]);
                $sistServ->idsistema = $sistema->idsistema;
                $ideolesbd = explode('-', $servidor[6]);
                $sistServ->idrolesbd = $ideolesbd[0];
                $arrayObjServidores[] = $sistServ;
            }
        }
        $model = new DatSistemaModel();
        $model->modificarsistema($arrayObjServidores, $sistema);
        $this->showMessage('El sistema ha sido modificado satisfactoriamente.');
    }

    /**
     * @method eliminarsistemaAction - Función usada para 
     * eliminar una rama completa.
     */
    public function eliminarsistemaAction()
    {
        DatSistema::eliminarsistema($this->_request->getPost('idsistema'));
        $this->showMessage('El sistema ha sido eliminado satisfactoriamente.');
    }

    /**
     * @method cargarsistemaAction - Función usada para 
     * cargar el árbol de sistemas.
     */
    public function cargarsistemaAction()
    {
        $sistemas = DatSistema::cargarsistema($this->_request->getPost('node'));
        $sistemaArr = array();
        if (count($sistemas) > 0) {
            foreach ($sistemas as $valores => $valor) {
                $sistemaArr[$valores]['id'] = $valor->id;
                $sistemaArr[$valores]['text'] = $valor->text;
                $sistemaArr[$valores]['abreviatura'] = $valor->abreviatura;
                $sistemaArr[$valores]['descripcion'] = $valor->descripcion;
                $sistemaArr[$valores]['idpadre'] = $valor->idpadre;
                $sistemaArr[$valores]['icono'] = $valor->icono;
                $sistemaArr[$valores]['servidorweb'] = $valor->externa;
                $sistemaArr[$valores]['leaf'] = $valor->leaf;
                $sistemaArr[$valores]['index'] = $valor->index;
            }
        }
        echo json_encode($sistemaArr);
    }

    /**
     * @method cargarservidoresAction - Función usada para cargar el 
     * árbol de servidores.
     */
    public function cargarservidoresAction()
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
                }
            }
            echo json_encode($servidoresArr);

            return;
        } elseif ($accion == 'cargargestores') {
            $idservidor = $this->_request->getPost('idservidor');
            $gestores = DatGestor::cargargestores($idservidor, 0, 0);
            if ($gestores->getData() != null) {
                foreach ($gestores as $valores => $valor) {
                    $gestArr[$valores]['id'] = $valor->idgestor . '-' . $idnodo;
                    $gestArr[$valores]['text'] = $valor->gestor;
                    $gestArr[$valores]['idgestor'] = $valor->idgestor;
                    $gestArr[$valores]['idservidor'] = $idservidor;
                    $gestArr[$valores]['gestor'] = $valor->gestor;
                    if ($valor->gestor == 'pgsql') {
                        $gestArr[$valores]['icon'] = 
                            '../../views/images/pgadmin.png';
                    } else {
                        $gestArr[$valores]['icon'] = 
                            '../../views/images/oracle.png';
                    }
                    $gestArr[$valores]['puerto'] = $valor->puerto;
                    $gestArr[$valores]['type'] = 'gestor';
                    $gestArr[$valores]['ipgestorbd'] = 
                        $valor->DatGestorDatServidorbd[0]
                        ->DatServidorbd->DatServidor->ip;
                }
                echo json_encode($gestArr);

                return;
            } else {
                $gest = $gestores->toArray();
                echo json_encode($gest);

                return;
            }
        } elseif ($accion == 'cargarbd') {
            $user = $this->_request->getPost('user');
            $pass = $this->_request->getPost('passw');
            $gestor = $this->_request->getPost('gestor');
            $ipgestorbd = $this->_request->getPost('ipgestorbd');
            $idservidor = $this->_request->getPost('idservidor');
            $idgestor = $this->_request->getPost('idgestor');
            $puerto = $this->_request->getPost('puerto');
            $getDatabases = 'get' . ucfirst($gestor) . 'Databases';
            $arrayBD = $this->$getDatabases(
                $gestor, $user, $pass, $ipgestorbd, $idgestor, $idservidor, 
                $idsistema, $idnodo, $puerto
            );
            $this->verificarBasesDatos($arrayBD, $idservidor, $idgestor);
            echo json_encode($arrayBD);
        } elseif ($accion == 'cargaresquemas') {
            $rSA = new ZendExt_RSA_Facade();
            $user = $this->_request->getPost('user');
            $pass = $rSA->decrypt($this->_request->getPost('passw'));
            $gestor = $this->_request->getPost('gestor');
            $ipgestorbd = $this->_request->getPost('ipgestorbd');
            $namebd = $this->_request->getPost('namebd');
            $idsistema = $this->_request->getPost('idsistema');
            $idservidor = $this->_request->getPost('idservidor');
            $idgestor = $this->_request->getPost('idgestor');
            $puerto = $this->_request->getPost('puerto');
            $rolbd = $this->_request->getPost('nombrerol');
            $getSchemas = 'get' . ucfirst($gestor) . 'Schemas';
            $schemasArr = $this->$getSchemas(
                $gestor, $user, $pass, $ipgestorbd, 
                $namebd, $idsistema, $idnodo, 
                $puerto, $idservidor, $idgestor, $rolbd
            );
            $this->verificarEsquemas(
                $schemasArr, $idservidor, $idgestor, $namebd
            );
            echo json_encode($schemasArr);
        }
    }

    /**
     * @method exportarsistemaAction - Función usada para exportar los sistemas
     *  a partir de un nbodo especifico.
     */
    public function exportarsistemaAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $xml = $this->devolverXML($idsistema);
        header('Content-Disposition: attachment; filename="sistemas.xml"');
        header('Content-Type: application/force-download');
        header('Content-type: "text/xml"; charset="utf8"');
        header('Pragma: no-cache');
        header('Expires: 0');
        echo($xml);
    }

    /**
     * @method importarXMLAction - Función usada para importar un sistema.
     */
    public function importarXMLAction()
    {
        $idsistema = $this->_request->getPost('idsistema');
        $dirFile = $_FILES['fileUpload']['tmp_name'];
        if ($_FILES['fileUpload']['type'] == 'text/xml') {
            if (file_exists($dirFile)) {
                $contenido = file_get_contents($dirFile);
                $contenido = ltrim($contenido);
                if ($obj = simplexml_load_string($contenido)) {
                    $xmlcargado = $obj;
                    try {
                        $this->arrayainsertar($xmlcargado, $idsistema, '');
                        $this->showMessage(
                            'El sistema ha sido importado satisfactoriamente.'
                        );
                    } catch (Exception $exc) {
                        $this->showErrorMessage(
                            'El archivo introducido no es válido.'
                        );
                    }
                } else {
                    $this->showErrorMessage(
                        'El archivo introducido no es válido.'
                    );
                }
            }
        } else {
            $this->showErrorMessage('El archivo introducido no es válido.');
        }
    }

    private static function modificarhijos($idsistema, $externa)
    {
        $canthijos = DatSistema::obtenersistemashijos($idsistema);
        if (count($canthijos)) {
            foreach ($canthijos as $hijos) {
                $hijos->externa = $externa;
                $idsistema = $hijos->idsistema;
                $hijos->save();
                self::modificarhijos($idsistema, $externa);
            }
        }
    }

    /*private function verificarsistema($denominacion, $abreviatura)
    {
        $datossistema=DatSistema::verificarsistema($denominacion, $abreviatura);
        if ($datossistema) {
            return 1;
        } else {
            return 0;
        }
    }*/

    private function insertaNomBaseDato($db)
    {
        $idbd = DatBd::buscarnombd($db, 1, 0);
        if (count($idbd)) {
            return $idbd[0]->idbd;
        } else {
            $objBD = new DatBd();
            $objBD->denominacion = $db;
            $objBD->descripcion = $db;
            $objBD->save();

            return $objBD->idbd;
        }
    }

   /* private function verifyRoles($array, $gestor, $user, $pass, $ipgestorbd)
    {        
        $arrayDelete = array();
        $arrayReturn = array();
        $dm = Doctrine_Manager::getInstance();
        $nameCurrentConn = $dm->getCurrentConnection()->getName();
        $conn = $dm->openConnection(
            "$gestor://$user:$pass@$ipgestorbd/template1", 'pg_catalog'
        );
        $arrayRolesGestor = PgAuthid::getRoles($conn);
        $dm->setCurrentConnection($nameCurrentConn);
        $arrayRolesGestor = SegUtil::convertToUnidimensional(
            $arrayRolesGestor, 'rolname'
        );
        $arrayRoles = SegUtil::convertToUnidimensional($array, 'rolname');
        $arrayDelete = array_diff($arrayRoles, $arrayRolesGestor);
        $arrayReturn = array_intersect($arrayRoles, $arrayRolesGestor);
        if (count($arrayDelete)) {
            SegRolesbd::deleteRoles($arrayDelete);
        }
        if (count($arrayReturn)) {
            $arrayReturn = SegRolesbd::getRolInformation($arrayReturn);
        }

        return $arrayReturn;
    }*/

    private function insertaNomEsquema($esquema)
    {
        $idesquema = DatEsquema::buscarnomesquemas($esquema, 1, 0);
        if (count($idesquema)) {
            return $idesquema[0]->idesquema;
        } else {
            $objEsquemas = new DatEsquema();
            $objEsquemas->denominacion = $esquema;
            $objEsquemas->descripcion = $esquema;
            $objEsquemas->save();

            return $objEsquemas->idesquema;
        }
    }

    /*private function getPgsqlDatabases(
        $gestor, $user, $pass, $ipgestorbd, $idgestor, $idservidor, 
        $idsistema, $idnodo, $puerto
    )
    {
        $bdArr = array();
        $rsa = new ZendExt_RSA_Facade();
        $dm = Doctrine_Manager::getInstance();
        $nameCurrentConn = $dm->getCurrentConnection()->getName();
        $conn = $dm->openConnection(
            "$gestor://$user:$pass@$ipgestorbd/template1", 'pg_catalog'
        );
        $db = PgDatabase::getPgsqlDatabases($conn);
        $dm->setCurrentConnection($nameCurrentConn);
        $key = 0;
        if ($db->getData() != null) {
            foreach ($db as $valor) {
                $bdArr[$key]['id'] = $valor->datname . '-' . $idnodo;
                $bdArr[$key]['text'] = $valor->datname;
                $bdArr[$key]['namebd'] = $valor->datname;
                $bdArr[$key]['gestor'] = $gestor;
                $bdArr[$key]['ipgestorbd'] = $ipgestorbd;
                $bdArr[$key]['puerto'] = $puerto;
                $bdArr[$key]['user'] = $user;
                $bdArr[$key]['passw'] = $rsa->encrypt($pass);
                $bdArr[$key]['idgestor'] = $idgestor;
                $bdArr[$key]['idservidor'] = $idservidor;
                $bdArr[$key]['type'] = 'bd';
                $bdArr[$key]['icon'] = '../../views/images/server.PNG';
                $key++;
            }
        }
        $rolesbd = SegRolesbd::loadRoleBD($idservidor, $idgestor);
        $rolBD = $this->verifyRoles(
            $rolesbd, $gestor, $user, $pass, $ipgestorbd
        );
        if (count($rolBD)) {
            foreach ($rolBD as $roles) {
                $bdArr[$key]['id'] = $roles->id . '-' . $idnodo;
                $bdArr[$key]['idrolbd'] = $roles->id;
                $bdArr[$key]['text'] = $roles->rolname;
                $bdArr[$key]['leaf'] = true;
                if (DatSistemaDatServidores::verifyCheckedRole(
                    $roles->id, $idsistema
                )
                ) {
                    $bdArr[$key]['checked'] = true;
                    $bdArr[$key]['marcado'] = true;
                } else {
                    $bdArr[$key]['checked'] = false;
                }
                $bdArr[$key]['rol'] = true;
                $bdArr[$key]['type'] = 'roles';
                $bdArr[$key]['icon'] = '../../views/images/usuario.png';
                $key++;
            }
        }

        return $bdArr;
    }*/

    /*private function getPgsqlSchemas(
        $gestor, $user, $pass, $ipgestorbd, $namebd, $idsistema, $idnodo, 
        $puerto, $idservidor, $idgestor, $rolbd
    )
    {
        $schemasArr = array();
        $dm = Doctrine_Manager::getInstance();
        $nameCurrentConn = $dm->getCurrentConnection()->getName();
        $conn = $dm->openConnection(
            "$gestor://$user:$pass@$ipgestorbd/$namebd", 'information_schema'
        );
        $schemas = Schemata::getPgsqlSchemasByDb($conn, $namebd);
        $dm->setCurrentConnection($nameCurrentConn);
        foreach ($schemas as $key => $esquemas) {
            $schemasArr[$key]['id'] = $esquemas['id'] . '-' . $idnodo;
            $schemasArr[$key]['text'] = $esquemas['text'];
            $schemasArr[$key]['leaf'] = true;
            $schemasArr[$key]['type'] = 'schemas';
            $schemasArr[$key]['icon'] = '../../views/images/schemas.PNG';
            $esq = $esquemas['esquema'];
            $marcado = DatSistemaDatServidores::chequeado(
                $idsistema, $ipgestorbd, $gestor, $namebd, $esq, $rolbd
            );
            if (count($marcado) > 0) {
                $schemasArr[$key]['checked'] = true;
                $schemasArr[$key]['marcado'] = 
                    $marcado[0]->idsistema 
                    . '_' . $marcado[0]->idservidor 
                    . '_' . $marcado[0]->idgestor 
                    . '_' . $marcado[0]->idbd 
                    . '_' . $marcado[0]->idesquema;
            } else {
                $schemasArr[$key]['checked'] = false;
            }
        }

        return $schemasArr;
    }*/

    /*private function getOracleDatabases(
        $gestor, $user, $pass, $ipgestorbd, $idgestor, $idservidor,
        $idsistema, $idnodo, $puerto
    )
    {
        $rsa = new ZendExt_RSA_Facade();
        $sID = DatGestorDatServidorbd::getSid($idgestor, $idservidor);
        $cadenaConex = "(DESCRIPTION=(ADDRESS_LIST=(ADDRESS=(PROTOCOL='TCP')"
            . "(HOST=$ipgestorbd)(PORT=$puerto)))" .
            "(CONNECT_DATA = (SID = $sID)))";
        $bdArr = array();
        $key = 0;
        @$conn = oci_connect("$user", "$pass", "$cadenaConex");
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
                $bdArr[$key]['type'] = 'bd';
                $key++;
            }
            oci_close($conn);
            SegRolesbd::loadRoleBD($idservidor, $idgestor);

            return $bdArr;
        } else {
            echo "{'codMsg':3,'mensaje': 'Error de conexión.'}";

            return;
        }
    }*/

    /*private function verifyRolesOracle(
        $array, $gestor, $user, $pass, $ipgestorbd, $cadenaConex
    )
    {
        $arrayDelete = array();
        $arrayReturn = array();
        $keyy = 0;
        $conn = oci_connect("$user", "$pass", "$cadenaConex");
        $query = 'select user_id, username from dba_users';
        $stid = oci_parse($conn, $query);
        oci_execute($stid);
        while ($row = oci_fetch_array($stid, OCI_ASSOC)) {
            $arrayRolesGestor[$keyy] = $row['USERNAME'];
            $keyy++;
        }
        $arrayRoles = SegUtil::convertToUnidimensional($array, 'rolname');
        $arrayDelete = array_diff($arrayRoles, $arrayRolesGestor);
        $arrayReturn = array_intersect($arrayRoles, $arrayRolesGestor);
        if (count($arrayDelete)) {
            SegRolesbd::deleteRoles($arrayDelete);
        }
        if (count($arrayReturn)) {
            $arrayReturn = SegRolesbd::getRolInformation($arrayReturn);
        }
        oci_close($conn);

        return $arrayReturn;
    }*/

   /* private function getOracleSchemas(
        $gestor, $user, $pass, $ipgestorbd, $namebd, $idsistema, $idnodo, 
        $puerto, $idservidor, $idgestor, $rolbdS
    )
    {
        $schemasArr = array();
        $result = SegRolesbd::getRolesOracle($idservidor, $idgestor);
        $key = 0;
        foreach ($result as $value) {
            $schemasArr[$key]['id'] = $value['nombrerol'] . '-' . $idnodo;
            $schemasArr[$key]['text'] = $value['nombrerol'];
            $schemasArr[$key]['idrol'] = $value['idrolesbd'] . '-' . $idnodo;
            $schemasArr[$key]['idrolbd'] = $value['idrolesbd'];
            $schemasArr[$key]['textrol'] = $value['nombrerol'];
            $schemasArr[$key]['lenguaje'] = "Oracle";
            $schemasArr[$key]['leaf'] = true;
            $schemasArr[$key]['type'] = 'schemas';
            $schemasArr[$key]['bd'] = 'oracle';
            $nomb = $value['nombrerol'];
            $marcado = DatSistemaDatServidores::chequeado0racle(
                $idsistema, $ipgestorbd, $gestor, $namebd, $nomb
            );
            if (count($marcado) > 0) {
                $schemasArr[$key]['checked'] = true;
                $schemasArr[$key]['marcado'] = 
                    $marcado[0]->idsistema 
                    . '_' . $marcado[0]->idservidor 
                    . '_' . $marcado[0]->idgestor 
                    . '_' . $marcado[0]->idbd 
                    . '_' . $marcado[0]->idesquema;
            } else {
                $schemasArr[$key]['checked'] = false;
            }
            $key++;
        }

        return $schemasArr;
    }*/

    private function verificarBasesDatos($bdObj, $idservidor, $idgestor)
    {
        $bdArr = array();
        foreach ($bdObj as $bd) {
            if ($bd['type'] == 'bd') {
                $bdArr[] = $bd['namebd'];
            }
        }
        $bdNoUsadasObj = DatSistemaDatServidores::obtenerBdNoUsadas(
            $bdArr, $idservidor, $idgestor
        );
        if (count($bdNoUsadasObj)) {
            $bdNUArr = array();
            foreach ($bdNoUsadasObj as $bdNoUsada) {
                $bdNUArr[] = $bdNoUsada->idbd;
            }
            $bdUsadasObj = DatSistemaDatServidores::obtenerBdUsadas(
                $bdNUArr, $idservidor, $idgestor
            );
            if (count($bdUsadasObj)) {
                $bdBorrar = array();
                foreach ($bdNUArr as $idbd) {
                    $isBdUsada = false;
                    foreach ($bdUsadasObj as $bdUsada) {
                        if ($bdUsada->idbd == $idbd) {
                            $isBdUsada = true;
                            break;
                        }
                    }
                    if (!$isBdUsada) {
                        $bdBorrar[] = $idbd;
                    }
                }
            } else {
                $bdBorrar = $bdNUArr;
            }
            $esquemas = DatSistemaDatServidores::obtenerEsquemas(
                $bdNUArr, $idservidor, $idgestor
            );
            $esqBorrar = array();
            if (count($esquemas)) {
                $arrayEsq = array();
                foreach ($esquemas as $esq) {
                    $arrayEsq[] = $esq->idesquema;
                }
                $arrayEsqUsados =DatSistemaDatServidores::obtenerEsquemasUsados(
                    $arrayEsq, $idservidor, $idgestor
                );
                if (count($arrayEsqUsados)) {
                    foreach ($arrayEsq as $idEsq) {
                        $isEsqUsado = false;
                        foreach ($arrayEsqUsados as $esqUsado) {
                            if ($esqUsado->idesquema == $idEsq) {
                                $isEsqUsado = true;
                                break;
                            }
                        }
                        if (!$isEsqUsado) {
                            $esqBorrar[] = $idEsq;
                        }
                    }
                } else {
                    $esqBorrar = $arrayEsq;
                }
            }
            DatSistemaDatServidores::borrarBdFisicamente(
                $bdNUArr, $idservidor, $idgestor
            );
            if (count($esqBorrar)) {
                DatEsquema::borrarEsqFisicamente($esqBorrar);
            }
            if (count($bdBorrar)) {
                DatBd::borrarBdFisicamente($bdBorrar);
            }
        }
    }

    private function verificarEsquemas(
        $schemasArr, $idservidor, $idgestor, $namebd
    )
    {
        $bdObj = DatBd::buscarnombd($namebd, 1, 0);
        if ($bdObj->getData() != null) {
            $idbd = $bdObj[0]->idbd;
            $esqArr = array();
            foreach ($schemasArr as $esq) {
                $esqArr[] = $esq['text'];
            }
            $esqNoUsadosObj = DatSistemaDatServidores::obtenerEsquemasNoUsados(
                $esqArr, $idservidor, $idgestor, $idbd
            );
            if (count($esqNoUsadosObj)) {
                $esqNUArr = array();
                foreach ($esqNoUsadosObj as $esqNoUsado) {
                    $esqNUArr[] = $esqNoUsado->idesquema;
                }
                $oEsqUs = DatSistemaDatServidores::obtenerEsquemasUsadosByBD(
                    $esqNUArr, $idservidor, $idgestor, $idbd
                );
                $esqUsadosObj = $oEsqUs;
                $esqBorrar = array();
                if (count($esqUsadosObj)) {
                    foreach ($esqNUArr as $idesq) {
                        $isEsqUsado = false;
                        foreach ($esqUsadosObj as $esqUsado) {
                            if ($esqUsado->idesquema == $idesq) {
                                $isEsqUsado = true;
                                break;
                            }
                        }
                        if (!$isEsqUsado) {
                            $esqBorrar[] = $idesq;
                        }
                    }
                } else {
                    $esqBorrar = $esqNUArr;
                }
                DatSistemaDatServidores::borrarEsqFisicamente(
                    $esqNUArr, $idservidor, $idgestor, $idbd
                );
                if (count($esqBorrar)) {
                    DatEsquema::borrarEsqFisicamente($esqBorrar);
                }
            } else {
                $esqUsadosByOther = array();
                $eEsqUs = DatSistemaDatServidores::existEsquemasUsadosByBD(
                    $esqArr, $idservidor, $idgestor, $idbd
                );
                $esqUsadosByOther = $eEsqUs;
                $esqUsados = array();
                if (count($esqUsadosByOther) > 0) {
                    $esqUsadosByOther = SegUtil::convertToUnidimensional(
                        $esqUsadosByOther, 'text'
                    );
                    $arrayEsqUsados = array_diff($esqArr, $esqUsadosByOther);
                    $esqUsados = SegUtil::convertToUnidimensional(
                        $eEsqUs, 'text'
                    );
                    $arrayNotUsed = array_diff($arrayEsqUsados, $esqUsados);
                    if (count($arrayNotUsed)) {
                        DatEsquema::deleteSchemas($arrayNotUsed);
                    }
                } else {
                    $esqUsados = DatSistemaDatServidores::existEsquemasUsedByBD(
                        $esqArr, $idservidor, $idgestor, $idbd
                    );
                    if (!count($esqUsados)) {
                        DatEsquema::deleteSchemas($esqArr);
                    }
                }
            }
        }
    }

    private function devolverXML($idsistema)
    {

        $sistemas = DatSistema::obtenersistemaexportarxml($idsistema);
        if (count($sistemas)) {
            $menu = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<menu>";
            foreach ($sistemas as $mdf) {
                $this->subsistemasxml($mdf, $menu);
            }
            $menu .= "\n</menu>";

            return $menu;
        } else {
            $menu = "<?xml version=\"1.0\" encoding=\"UTF-8\"?><menu></menu>";

            return $menu;
        }
    }

    private function subsistemasxml($raiz, &$menu)
    {
        $type = 'sistema';
        $menu .= "<MenuItem name=\"{$raiz['denominacion']}\" "
        . "id=\"{$raiz['idsistema']}\" "
        . "externa=\"{$raiz['externa']}\" "
        . "icon=\"{$raiz['icono']}\"  "
        . "status=\"{$raiz['descripcion']}\" "
        . "type=\"{$type}\">";
        $this->funcionalidadesxml($raiz['idsistema'], $menu);
        $sistemashijos = DatSistema::obtenersistemashijos($raiz['idsistema']);
        if (count($sistemashijos)) {
            foreach ($sistemashijos as $hijo) {
                if ($raiz['idsistema'] != $hijo['idsistema']) {
                    $this->subsistemasxml($hijo, $menu);
                }
            }
        }
        $menu .= "</MenuItem>";
    }

    private function funcionalidadesxml($idsistema, &$menu)
    {
        $type = 'funcionalidad';
        $funcsistema = DatFuncionalidad::obtenerFuncionalidad($idsistema);
        if (count($funcsistema)) {
            foreach ($funcsistema as $funcionalidades) {
                $menu .= "<MenuItem name=\"{$funcionalidades->text}\" "
                . "id=\"{$funcionalidades->idfuncionalidad}\"  "
                . "src=\"{$funcionalidades->referencia}\" "
                . "icon=\"{$funcionalidades->icono}\"  "
                . "visible=\"{$funcionalidades->visible}\" "
                . "status=\"{$funcionalidades->descripcion}\" "
                . "index=\"{$funcionalidades->index}\" "
                . "type=\"{$type}\">";
                $this->accionesxml($funcionalidades->idfuncionalidad, $menu);
                $menu .= "</MenuItem>";
            }
        }
    }

    private function accionesxml($idfuncionalidad, &$menu)
    {
        $type = 'accion';
        $acciones = DatAccion::obtenerAcciones($idfuncionalidad);
        if (count($acciones)) {
            foreach ($acciones as $accion) {
                $menu .= "<MenuItem name=\"{$accion->denominacion}\" "
                . "id=\"{$accion->idaccion}\" "
                . "type=\"{$type}\" "
                . "descripcion=\"{$accion->descripcion}\" >";
                $this->recursosXml($accion->idaccion, $idfuncionalidad, $menu);
                $menu .= "</MenuItem>";
            }
        }
    }

    private function recursosXml($idaccion, $idfuncionalidad, &$menu)
    {
        $type = 'recurso';
        $arrayRecursos = DatRecurso::ObtenerRecursosXml(
            $idaccion, $idfuncionalidad
        );
        if (count($arrayRecursos)) {
            foreach ($arrayRecursos as $recursos) {
                $menu .= "<MenuItem name=\"{$recursos['denominacion']}\" "
                . "id=\"{$recursos['idrecurso']}\" "
                . "status=\"{$recursos['descripcion']}\" "
                . "index=\"{$recursos['abreviatura']}\" "
                . "type=\"{$type}\" />";
            }
        }
    }

    private function arrayainsertar($xmlcargado, $idpadre, $id)
    {
        foreach ($xmlcargado as $xml) {
            if ((string) $xml['type'] == 'sistema') {
                $sistema = new DatSistema();
                $sistema->denominacion = (string) $xml['name'];
                $sistema->descripcion = (string) $xml['status'];
                $sistema->icono = (string) $xml['icon'];
                $sistema->externa = (string) $xml['externa'];
                $sistema->iddominio = $this->global->Perfil->iddominio;
                if ($idpadre) {
                    $sistema->idpadre = $idpadre;
                }
                $sistema->save();
                $sistemaCompartimentacion = new DatSistemaCompartimentacion();
                $sistemaCompartimentacion->idsistema = $sistema->idsistema;
                $sistemaCompartimentacion->iddominio = 
                    $this->global->Perfil->iddominio;
                $sistemaCompartimentacion->save();
                if (count($xml->MenuItem)) {
                    $this->arrayainsertar(
                        $xml->MenuItem, $sistema->idsistema, ''
                    );
                }
            } elseif ((string) $xml['type'] == 'accion') {
                $accion = new DatAccion();
                $accion->denominacion = (string) $xml['name'];
                $accion->idfuncionalidad = $idpadre;
                $accion->descripcion = (string) $xml['descripcion'];
                $accion->iddominio = $this->global->Perfil->iddominio;
                $accion->save();
                $accionCompartimentacion = new DatAccionCompartimentacion();
                $accionCompartimentacion->idaccion = $accion->idaccion;
                $accionCompartimentacion->iddominio = 
                    $this->global->Perfil->iddominio;
                $accionCompartimentacion->save();
                if (count($xml->MenuItem)) {
                    $this->arrayainsertar(
                        $xml->MenuItem, 
                        $accion->idaccion, 
                        $accion->idfuncionalidad
                    );
                }
            } elseif ((string) $xml['type'] == 'recurso') {
                $recurso =DatRecurso::findIdRecurso((string) $xml['name'], $id);
                if (count($recurso)) {
                    $idrecurso = $recurso[0]['idrecurso'];
                } else {
                    $objRecurso = new DatRecurso();
                    $objRecurso->denominacion = (string) $xml['name'];
                    $objRecurso->descripcion = (string) $xml['status'];
                    $objRecurso->abreviatura = (string) $xml['index'];
                    $objRecurso->idfuncionalidad = $id;
                    $objRecurso->iddominio = $this->global->Perfil->iddominio;
                    $objRecurso->save();
                    $idrecurso = $objRecurso->idrecurso;
                    $obRecursoComp = new DatRecursoCompartimentacion();
                    $obRecursoComp->idrecurso = $idrecurso;
                    $obRecursoComp->iddominio =$this->global->Perfil->iddominio;
                    $obRecursoComp->save();
                }
                $objFunAccRec = new DatFuncionalidadDatAccion();
                $objFunAccRec->idrecurso = $idrecurso;
                $objFunAccRec->idfuncionalidadasociada = $id;
                $objFunAccRec->idaccion = $idpadre;
                $objFunAccRec->save();
            } elseif ((string) $xml['type'] == 'funcionalidad') {
                $funcionalidad = new DatFuncionalidad();
                $funcionalidad->denominacion = (string) $xml['name'];
                $funcionalidad->descripcion = (string) $xml['status'];
                $funcionalidad->icono = (string) $xml['icon'];
                $funcionalidad->referencia = (string) $xml['src'];
                $funcionalidad->index = (string) $xml['index'];
                $funcionalidad->visible = (boolean) $xml['visible'];
                $funcionalidad->idsistema = $idpadre;
                $funcionalidad->iddominio = $this->global->Perfil->iddominio;
                $funcionalidad->save();
                $funcionalidadCompartimentacion = 
                    new DatFuncionalidadCompartimentacion();
                $funcionalidadCompartimentacion->idfuncionalidad = 
                    $funcionalidad->idfuncionalidad;
                $funcionalidadCompartimentacion->iddominio = 
                    $this->global->Perfil->iddominio;
                $funcionalidadCompartimentacion->save();
                if (count($xml->MenuItem)) {
                    $this->arrayainsertar(
                        $xml->MenuItem, $funcionalidad->idfuncionalidad, ''
                    );
                }
            } else {
                throw new ZendExt_Exception('SEGSIST04');
            }
        }
    }

}
