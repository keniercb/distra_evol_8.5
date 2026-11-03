<?php

class ValidarpersonaModel extends ZendExt_Model
{

    public function setUp()
    {
        parent::ZendExt_Model();
    }

    public function getPersonas($numid, $nombre, $papel, $sapel, $start = 0, $limit = null)
    {
        try {
            $sql = "SELECT ab0.idpersona, ab0.nombre, ab0.snombre, ab0.papel, ab0.sapel, ab0.sexo, ab1.numero as numid,
                        dvp.idfuente, dvp.fechavalidacion::date as fechadevalidacion, dvp.fechavalidacion::time as horadevalidacion
                    FROM mod_persona.dat_persona ab0 
                    LEFT JOIN mod_persona.dat_docidentidad ab1 ON(ab1.idpersona = ab0.idpersona and ab1.idtipodocidentidad = 1)
                    LEFT JOIN mod_persona.dat_validacionpersona dvp ON(dvp.idpersona = ab0.idpersona)
                    WHERE ab0.feliminado IS NULL";

            $sqlCompartimentacion = ZendExt_IoC::getInstance()->pvd->getSqlUserCompartimentacionPersona();

            if (!empty($sqlCompartimentacion)) {
                $sql .= " AND " . $sqlCompartimentacion;
            }

            if (!empty($numid)) {
                $sql .= " AND ab1.numero LIKE '%$numid%'";
            }
            if (!empty($nombre)) {
                $sql .= " AND mod_rrhhmaestro.sustituiryconvertir(ab0.nombre) LIKE '%$nombre%'";
            }
            if (!empty($papel)) {
                $sql .= " AND mod_rrhhmaestro.sustituiryconvertir(ab0.papel) LIKE '%$papel%'";
            }
            if (!empty($sapel)) {
                $sql .= " AND mod_rrhhmaestro.sustituiryconvertir(ab0.sapel) LIKE '%$sapel%'";
            }

            if ($limit) {
                $sql .= " limit {$limit}
                            offset {$start};";
            }

            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();

            $personas = $conn->fetchAll($sql);
            
            foreach ($personas as $key => $value) {
                if ($value['idfuente'] == 1) {
                    $personas[$key]['fuente'] = 'SUIN';
                }
                if ($value['idfuente'] == 2) {
                    $personas[$key]['fuente'] = 'SUINFAR';
                }
            }

            return $personas;
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function getCantPersonas($numid, $nombre, $papel, $sapel)
    {
        try {
            $sql = "SELECT COUNT(ab0.idpersona) AS cantidad
                    FROM mod_persona.dat_persona ab0 
                    LEFT JOIN mod_persona.dat_docidentidad ab1 ON(ab1.idpersona = ab0.idpersona and ab1.idtipodocidentidad = 1)
                    LEFT JOIN mod_persona.dat_validacionpersona dvp ON(dvp.idpersona = ab0.idpersona)
                    WHERE ab0.feliminado IS NULL";

            $sqlCompartimentacion = ZendExt_IoC::getInstance()->pvd->getSqlUserCompartimentacionPersona();

            if (!empty($sqlCompartimentacion)) {
                $sql .= " AND " . $sqlCompartimentacion;
            }

            if (!empty($numid)) {
                $sql .= " AND ab1.numero LIKE '%$numid%'";
            }
            if (!empty($nombre)) {
                $sql .= " AND mod_rrhhmaestro.sustituiryconvertir(ab0.nombre) LIKE '%$nombre%'";
            }
            if (!empty($papel)) {
                $sql .= " AND mod_rrhhmaestro.sustituiryconvertir(ab0.papel) LIKE '%$papel%'";
            }
            if (!empty($sapel)) {
                $sql .= " AND mod_rrhhmaestro.sustituiryconvertir(ab0.sapel) LIKE '%$sapel%'";
            }

            $dm = Doctrine_Manager::getInstance();
            $conn = $dm->getCurrentConnection();

            $cantPersonas = $conn->fetchAll($sql);

            return $cantPersonas[0]['cantidad'];
        } catch (Exception $e) {
            throw $e;
        }
    }

    public function buscarPersonaSuinFarServicioWeb($numid, $nombre, $papel, $sapel, $limit = 20, $start = 0)
    {
        try {
            //Editar la direccion del servicio web:
            $client = new SoapClient("http://10.12.170.106:5701/seguridad/webservices/AcaxiaSoapAutentication.wsdl", array('trace' => true));            
            $idseccion = $client->authenticateUserApi('administrador', 'administrador');
            $clientSuinfar = new SoapClient("http://10.12.170.106:5701/suinfar/webservices/SuinfarService.wsdl", array('trace' => true));
            $clientSuinfar->__setCookie('PHPSESSID', $idseccion);
            
            $params = array();
            $params['operacion'] = 'buscarPersona';

            $p = array();
            if (!empty($numid)) {
                $p['ni'] = $numid;
            }
            if (!empty($nombre)) {
                $p['nombre1'] = $nombre;
            }
            if (!empty($papel)) {
                $p['apellido1'] = $papel;
            }
            if (!empty($sapel)) {
                $p['apellido2'] = $sapel;
            }
            $params['parametros'] = $p;

            $params['limite'] = $limit;
            $params['inicio'] = $start;
            $params['camposordenar'] = array('nombre1', 'apellido1', 'apellido2');
            $params['ordenordenar'] = 'ASC';
            $params['tipobusqueda'] = 2;

            $r = $clientSuinfar->buscarEnSuinFar($params);


            $datos = array();
            $datossuin = $r->respuesta['datos'];
            foreach ($datossuin as $key => $value) {
                $datos[$key]['idpersona'] = null;
                $datos[$key]['tipoidentidad'] = null;
                $datos[$key]['idsuin'] = $datossuin[$key]['id'];
                $datos[$key]['numid'] = $datossuin[$key]['ni'];
                $datos[$key]['nombre'] = $datossuin[$key]['nombre1'];
                $datos[$key]['snombre'] = $datossuin[$key]['nombre2'];
                $datos[$key]['papel'] = $datossuin[$key]['apellido1'];
                $datos[$key]['sapel'] = $datossuin[$key]['apellido2'];
                $datos[$key]['sexo'] = $datossuin[$key]['sexo'];
                $datos[$key]['nomma'] = $datossuin[$key]['nombredelamadre'];
                $datos[$key]['nompa'] = $datossuin[$key]['nombredelpadre'];
                $datos[$key]['registrocivil'] = $datossuin[$key]['registrocivil'];
                $datos[$key]['idpaisnac'] = $datossuin[$key]['idpaisdenacimiento'];
                $datos[$key]['paisnac'] = $datossuin[$key]['paisnac'];
                $datos[$key]['idprovincianac'] = $datossuin[$key]['idprovinciadenacimiento'];
                $datos[$key]['idmunicipionac'] = $datossuin[$key]['idmunicipiodenacimiento'];
                $datos[$key]['provnac'] = $datossuin[$key]['provnac'];
                $datos[$key]['municnac'] = $datossuin[$key]['municnac'];
                $datos[$key]['fechanacimiento'] = $datossuin[$key]['fechandeacimiento'];
                $datos[$key]['annoregistrocivil'] = $datossuin[$key]['anyoderegistrocivil'];
                $datos[$key]['tomo'] = $datossuin[$key]['tomo'];
                $datos[$key]['folio'] = $datossuin[$key]['folio'];
                $datos[$key]['idprovinciaderesidencia'] = $datossuin[$key]['idprovinciaderesidencia'];
                $datos[$key]['idprovinciares'] = $datossuin[$key]['idprovinciaderesidencia'];
                $datos[$key]['idmunicipioderesidencia'] = $datossuin[$key]['idmunicipioderesidencia'];
                $datos[$key]['provinciaresidencia'] = $datossuin[$key]['provres'];
                $datos[$key]['municipioresidencia'] = $datossuin[$key]['municipioresidencia'];
                $datos[$key]['fechares'] = $datossuin[$key]['fechaderegderesidencia'];
                $datos[$key]['direccion'] = $datossuin[$key]['dirdelapersona'];
                $datos[$key]['peso'] = $datossuin[$key]['peso'];
                $datos[$key]['talla'] = $datossuin[$key]['talla'];
                $datos[$key]['estatura'] = $datossuin[$key]['talla'];
                if ($datossuin[$key]['poseehuellasdactilares']) {
                    $datos[$key]['huella'] = 't';
                } else {
                    $datos[$key]['huella'] = 'f';
                }
                $datos[$key]['idcolorpelo'] = $datossuin[$key]['idcolordepelo'];
                $datos[$key]['idcolorojos'] = $datossuin[$key]['idcolordeojos'];
                $datos[$key]['idcolorpiel'] = $datossuin[$key]['idcolordepiel'];
                $datos[$key]['colorpelo'] = $datossuin[$key]['colorpelo'];
                $datos[$key]['colorpiel'] = $datossuin[$key]['colorpiel'];
                $datos[$key]['colorojos'] = $datossuin[$key]['colorojos'];
                $datos[$key]['paisprovmuni'] = $datossuin[$key]['paisnac'] . '/' . $datossuin[$key]['provnac'] . '/' . $datossuin[$key]['municnac'];
                $datos[$key]['provmunicres'] = $datossuin[$key]['provres'] . '/' . $datossuin[$key]['municipioresidencia'];
            }
            $cantidad = $r->respuesta['cantidad'];

            return array('datos' => $datos, 'cantidad' => $cantidad);
        } catch (Exception $e) {
            $a = array();
            $a['codigo'] = 'ERROR';
            $a['error'] = $e->getMessage();
            return $a;
        }
    }

    public function validarPersona(array $persona, $idpersona, $idfuente)
    {
        try {
            $datPersona = new DatPersona();
            $objPersona = $datPersona->getById($idpersona);

            if (count($objPersona) > 0) {
                //print_r($persona);die;
                foreach ($persona as $v) {
                    $dm = Doctrine_Manager::getInstance();
                    $conn = $dm->getCurrentConnection();

                    $sqlIdSuin = "SELECT idpersona
                                FROM mod_persona.dat_persona
                                WHERE idpersona <> {$idpersona} AND idsuin = '{$v['idsuin']}';";
                    $coincidencia = $conn->fetchAll($sqlIdSuin);                    //print_r($sqlIdSuin);die;
                    if (!empty($coincidencia)) {
                        $response = new stdClass();
                        $response->codigo = 2;
                        return $response;
                    }
                    
                    $objPersona = Doctrine::getTable('DatPersona')->find($idpersona);
                    $objPersona->nombre = $v['nombre'];
                    $objPersona->snombre = $v['snombre'];
                    $objPersona->papel = $v['papel'];
                    $objPersona->sapel = $v['sapel'];
                    $objPersona->idsuin = $v['idsuin'];
                    $objPersona->sexo = $v['sexo'];
                    $objPersona->save();
                    
                    //Actualizo el carnet de identidad tambien:
                    $sql = "SELECT iddocidentidad
                            FROM mod_persona.dat_docidentidad
                            WHERE idpersona = {$idpersona} AND idtipodocidentidad = 1;";
                    
                    $result = $conn->fetchAll($sql);
                    $iddocidentidad = $result[0]['iddocidentidad'];
                    
                    $sqlUpdate = "UPDATE mod_persona.dat_docidentidad
                                    SET numero = '{$v['numid']}'
                                  WHERE iddocidentidad = {$iddocidentidad};";
                    $conn->execute($sqlUpdate);
                }
                
                //Guardo los datos de la ultima validacion de la persona:
                $objValidacionPersona = new DatValidacionpersona();
                $idvalidacionpersona = $objValidacionPersona->getByIdpersona($idpersona);
                
                if ($idvalidacionpersona) {
                    $obj = DatValidacionpersona::getById($idvalidacionpersona);
                    $obj->idfuente = $idfuente;
                    $obj->fechavalidacion = date("Y-m-d H:i:s");
                    $obj->save();
                } else {
                    $obj = new DatValidacionpersona();
                    $obj->idpersona = $idpersona;
                    $obj->idfuente = $idfuente;
                    $obj->fechavalidacion = date("Y-m-d H:i:s");
                    $obj->save();
                }                
                
            } else {
                throw new Exception('No existe la persona que quiere validar', 3);
            }
            return true;
        } catch (Exception $e) {
            throw $e;
        }
    }

}
